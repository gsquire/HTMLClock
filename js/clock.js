/*
 * author: Garrett Squire, gsquire
 *
 * A small script to display a clock and some weather information.
 *
 */
"use strict";

function getTime() {
    // Execute the function every second.
    window.setTimeout(getTime, 1000);

    var cur_time = new Date();
    var time_string = cur_time.getHours() + ":" + cur_time.getMinutes() + ":";
    var seconds = cur_time.getSeconds();
    if (seconds < 10) {
        time_string += "0" + seconds;
    } else {
        time_string += seconds;
    }

    $("#g_clock").html(time_string);
}

// Return the background color of a forecast given the temperature.
function getForecastColor(temperature) {
    var colorClass = "";

    if (temperature < 60)
        colorClass = "cold";
    else if (temperature >= 60 && temperature < 70)
        colorClass = "chilly";
    else if (temperature >= 70 && temperature < 80)
        colorClass = "nice";
    else if (temperature >= 80 && temperature < 90)
        colorClass = "warm";
    else
        colorClass = "hot";

    return colorClass;
}

// Called when we fail to get the LAT and LONG of the user.
function geoFailure() {
    console.log("Could not get your location!");
}

// Use the Forecast.io API to get the current weather information.
function getTemp() {
    var API_KEY = "146c4dcccbfcbf15a5c03790ae499447";

    var lat = "35.300399"
    var lon = "-120.662362"
    navigator.geolocation.getCurrentPosition(function (position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
    }, geoFailure);
    var url =
        "https://api.forecast.io/forecast/" + API_KEY + "/" + lat + "," + lon;

    $.ajax( {
        url: url,
        dataType: "jsonp",
        success: function (forecastData) {
            var image = "img/" + forecastData["daily"]["icon"] + ".png";
            var bg_color = getForecastColor(
                            forecastData["daily"]["data"][0]["temperatureMax"]);

            $("#forecastLabel").html(forecastData["daily"]["summary"]);
            $("#forecastIcon").attr("src", image);
            $("body").addClass(bg_color);
        }
    } );
}

// Call the functions once the DOM loads.
$(document).ready(function () {
    getTime();
    getTemp();
} );
