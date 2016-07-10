define(["jquery", "knockout", "jstz", "moment", "moment.tz", "moment.duration.format"],
    function ($, ko, jstz, moment) {
        // Configure statsUrl to point to your stats.xml or the included stats.php wrapper.
        // NOTE: If your website is httpS, the stats.xml MUST be hosted on an httpS URL
        //       If your stats.xml is NOT on the same domain as your website, use the stats.php wrapper.
        var statsUrl = "http://brain.death.rocks/~jonathan/stats.php";

        // Configure what servername to show at the top of the stats listing - OPTIONAL
        var serverName = "";

        // Date format
        // For more information on formats: http://momentjs.com/docs/#/displaying/format/
        var dateFormat = "dddd, MMMM D, YYYY";
        // Timezone
        var timezone = "Europe/Stockholm";
        // Display User's Timezone (if available)
        var localTZ = true;

        // Uptime format
        // Formatting: https://github.com/jsmreese/moment-duration-format (under Template)
        //var customUptimeFormat = "y [years], M [months], W [weeks], D [days], H [hours], m [minutes]";
        var customUptimeFormat = false;

        // ViewModel - all of the data bindings are found here.
        // You can bind any of these using the data-bind attribute.
        // To change default values, edit the string inside the ko.observable() - DO NOT remove ko.observable!
        function StatsViewModel(stats) {
            var self = this;
            // serverName is injected
            self.serverName = serverName;
            // uptime - time in seconds that the server has been online
            self.uptime = ko.observable('');
            // status - string sent by the server to indicate status
            self.status = ko.observable('');
            // wurmtime - The wurmtime sent by the server when stats.xml was generated
            self.wurmtime = ko.observable('');
            // weather - The current wind conditions in Wurm
            self.weather = ko.observable('');
            // servers - array of all servers and their attributes
            self.servers = ko.observableArray();
            // timestamp - the unix timestamp of the last stats.xml update (NOTE: must multiply by 1000 for milliseconds)
            self.timestamp = ko.observable(0);
            // lastUpdated - computed based on timestamp and formatted with the injected dateFormat
            self.lastUpdated = ko.computed(function () {
                if (self.timestamp() == 0)
                    return "";
                if (localTZ) {
                    var tz = jstz.determine();
                    if (tz !== null)
                        return moment.unix(self.timestamp()).tz(tz.name()).format(dateFormat);
                }
                return moment.unix(self.timestamp()).tz(timezone).format(dateFormat);
            });
            self.uptimeFormat = function (d) {
                var f = "y [year" + (d.years() != 1 ? "s] " : "] ");
                f += "M [month" + (d.months() != 1 ? "s] " : "] ");
                f += "W [week" + (d.weeks() != 1 ? "s] " : "] ");
                f += "D [day" + (d.days() != 1 ? "s] " : "] ");
                f += "H [hour" + (d.hours() != 1 ? "s] " : "] ");
                f += "m [minute" + (d.minutes() != 1 ? "s] " : "] ");
                f += "s [second" + (d.seconds() != 1 ? "s] " : "] ");
                return f;
            };
            self.upSince = ko.computed(function () {
                if (self.uptime() == 0)
                    return "";
                if (customUptimeFormat !== false)
                    return moment.duration(self.uptime(), "seconds").format(customUptimeFormat);
                else {
                    var d = moment.duration(self.uptime(), "seconds")
                    return d.format(self.uptimeFormat(d));
                }
            });
            self.readValue = function (s, n) {
                var v = s.find(n);
                if (v !== null && v.length > 0 && v[0] !== null)
                    return v[0].textContent;
                return "";
            };
            // Handles the data coming back from the request.
            self.handleResult = function (s) {
                self.status(self.readValue(s, "status"));
                self.timestamp(parseInt(self.readValue(s, "timestamp")));
                self.uptime(parseInt(self.readValue(s, "uptime")));
                self.wurmtime(self.readValue(s, "wurmtime"));
                self.weather(self.readValue(s, "weather"));
                var servers = s.find("server");
                for (var i = 0; i < servers.length; i++) {
                    self.servers.push(
                        {
                            "name": servers[i].attributes["name"].value,
                            "maxplayers": parseInt(servers[i].attributes["maxplayers"].value),
                            "players": parseInt(servers[i].attributes["players"].value)
                        }
                    );
                }
            };
            self.handleResult(stats);
        }
        // Entry point
        $(document).ready(function () {
            var jqxhr = $.get(statsUrl, function (data) {
                ko.applyBindings(new StatsViewModel($(data)));
                $("div.loading.container").hide();
                $("div.feed.container").show();
            })
                .fail(function (xhr, textStatus) {
                    $("div.loading.container").hide();
                    $("div.error.container").show();
                    var httpcode =
                        $(".error.top").html("The request to '" + statsUrl + "' failed.");
                    $(".error.bottom").html("Status: HTTP " + xhr.status + " " + xhr.statusText);
                    console.log(xhr);
                });

        });
    });
    