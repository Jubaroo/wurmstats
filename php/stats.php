<?php
/**
 * Serve up the stats.xml in a safe manner
 */

// Set $pathToStats to the location of your stats.xml. This may be a web URL or a proper filesystem path.
// $pathToStats = "/home/jonathan/stats.xml"; // Local 
$pathToStats = "http://brain.death.rocks/~jonathan/stats.xml"; // URL

// DO NOT ALTER PAST THIS POINT UNLESS YOU KNOW WHAT YOU ARE DOING
header("Access-Control-Allow-Origin: *");
if(($stats = file_get_contents($pathToStats)) === false) {
    header("HTTP/1.0 500 Server Error: {$pathToStats} is not readable.");
} else {
    header("Content-Type: text/xml");
    echo $stats;
}