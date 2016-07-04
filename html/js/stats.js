// Configure statsUrl to point to your stats.xml or the included stats.php wrapper.
// NOTE: If your website is httpS, the stats.xml MUST be hosted on an httpS URL
//       If your stats.xml is NOT on the same domain as your website, use the stats.php wrapper.
var statsUrl = "http://brain.death.rocks/~jonathan/stats.php";

// Configure what servername to show at the top of the stats listing - OPTIONAL
var serverName = "";

// Date format
// For more information on formats: http://momentjs.com/docs/#/displaying/format/
var dateFormat = "dddd, MMMM d, YYYY";
// Uptime format
// Formatting: https://github.com/jsmreese/moment-duration-format (under Template)
var uptimeFormat = "y [years], M [months], W [weeks], D [days], H [hours], m [minutes]";

// ViewModel - all of the data bindings are found here.
// You can bind any of these using the data-bind attribute.
// To change default values, edit the string inside the ko.observable() - DO NOT remove ko.observable!
function StatsViewModel(stats, serverName, dateFormat, uptimeFormat) {
    var self = this;
    // serverName is injected
    self.serverName = serverName;
    // uptime - time in seconds that the server has been online
    self.uptime = ko.observable('');
    // status - string sent by the server to indicate status
    self.status = ko.observable('N/A');
    // wurmtime - The wurmtime sent by the server when stats.xml was generated
    self.wurmtime = ko.observable('N/A');
    // servers - array of all servers and their attributes
    self.servers = ko.observableArray();
    // timestamp - the unix timestamp of the last stats.xml update (NOTE: must multiply by 1000 for milliseconds)
    self.timestamp = ko.observable(0);
    // lastUpdated - computed based on timestamp and formatted with the injected dateFormat
    self.lastUpdated = ko.computed(function() {
        if(self.timestamp() == 0)
            return "N/A";
        return moment.unix(self.timestamp()).format(dateFormat);
    });
    self.upSince = ko.computed(function() {
        if(self.uptime() == 0)
            return "N/A";
        return moment.duration(self.uptime(), "seconds").format(uptimeFormat);
    });
    // Handles the data coming back from the request.
    self.handleResult = function(s) {
        self.status(s.find("status")[0].textContent);
        self.timestamp(parseInt(s.find("timestamp")[0].textContent));
        self.uptime(parseInt(s.find("uptime")[0].textContent));
        self.wurmtime(s.find("wurmtime")[0].textContent);
        var servers = s.find("server");
        for(var i = 0; i < servers.length; i++) {
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
$(document).ready(function() {
    $.get(statsUrl, function(data) {
        ko.applyBindings(new StatsViewModel($(data), serverName, dateFormat, uptimeFormat));
    });
});