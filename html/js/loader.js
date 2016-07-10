// This file handles configuring and loading all of our dependencies
// Editing this file may result in the script not loading.
// All dependencies are configured to load from external CDNs
requirejs.config({
    "baseUrl": "js",
    "paths": {
        "app": "../stats",
        "moment": "//cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/moment.min",
        "jquery": "//ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min",
        "knockout": "//ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0",
        "jstz": "//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.6/jstz.min",
        "moment.tz": "//cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.4/moment-timezone-with-data.min",
        "moment.duration.format": "//cdnjs.cloudflare.com/ajax/libs/moment-duration-format/1.3.0/moment-duration-format"
    },
    "shim": {
        "moment.tz": ["moment"],
        "moment.duration.format": ["moment"]
    }
});
requirejs(["stats"]);
