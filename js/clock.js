/*
 * author: Garrett Squire, gsquire
 *
 * A small script to display a clock and some weather information.
 *
 */
"use strict";

var USER_ID; // Used to keep track of who is logged in to the app.

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

// The following functions mainpulate the DOM to show and hide the adding
// and removing of an alarm.
function showAlarmPopup() {
    $("#mask").removeClass("hide");
    $("#popup").removeClass("hide");
}

function hideAlarmPopup() {
    $("#mask").addClass("hide");
    $("#popup").addClass("hide");
}

function insertAlarm(hours, mins, ampm, alarmName, objectId) {
    // This will be the top level of the new alarm.
    var newAlarm = $("<div></div>");
    newAlarm.addClass("flexable");

    // This is set to select within jQuery later so we can delete it.
    newAlarm.attr("id", objectId);

    var alarmSpec = $("<div></div>");
    alarmSpec.addClass("name");
    alarmSpec.html(alarmName);

    var alarmTime = $("<div></div>");
    alarmTime.addClass("time");
    alarmTime.html(hours + ":" + mins + " " + ampm);

    newAlarm.append(alarmSpec);
    newAlarm.append(alarmTime);

    $("#alarms").append(newAlarm);
}

// Get the user input and save the new alarm.
function addAlarm() {
    var hours = $("#hours").find(":selected").text();
    var mins = $("#mins").find(":selected").text();
    var ampm = $("#ampm").find(":selected").text();
    var alarmName = $("#alarmName").val();

    // It's nicer to save this object into Parse.
    var time = {
        hours: hours,
        mins: mins,
        ampm: ampm
    };
    var AlarmObject = Parse.Object.extend("Alarm");
    var alarmObject = new AlarmObject();

    // Save the alarm to Parse.
    // USER_ID is our global given to us by Google.
    alarmObject.save( {"userId": USER_ID, "time": time, "alarmName": alarmName}, {
        success: function(alarmObject) {
            insertAlarm(hours, mins, ampm, alarmName, alarmObject.id);
            $("#" + alarmObject.id).click(deleteAlarm);
            hideAlarmPopup();
        }
    } );

    // Send a Google Analytics event.
    ga('send', 'event', 'Alarm', 'Add');
}

// Fill the options for the select options in hours and minutes.
function fillSelects() {
    for (var i = 1; i <= 12; i++) {
        $("#hours").append("<option>" + i + "</option>");
    }

    for (var j = 0; j <= 55; j += 5) {
        $("#mins").append("<option>" + j + "</option>");
    }
}

// Interact with Parse now.
// The parameter is the unique id given to me by Google.
function getAllAlarms(userId) {
    Parse.initialize("oBE4i8C3eA0LxytpX8qolrZPQAHGEYGiiueJbtwK", "PabMP44i4foZaQoz3RjTRfMv1L7TSsbfAehbTZUM");

    var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    query.equalTo("userId", USER_ID); // Ensure that we only get this user.

    query.find( {
        success: function(results) {
            for (var i = 0; i < results.length; i++) {
                var timeObj = results[i].get("time");
                var id = results[i].id;

                insertAlarm(timeObj["hours"],
                    timeObj["mins"],
                    timeObj["ampm"],
                    results[i].get("alarmName"),
                    id);

                // Add a click handler to be able to delete later.
                $("#" + id).click(deleteAlarm);
            }
        }
    } );
}

// Delete an alarm with the objectId associated with it.
function deleteAlarm() {
    var AlarmClock = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmClock);
    var objectId = $(this).attr("id");

    // I love callback functions...
    query.get(objectId, {
        success: function(alarmObject) {
            alarmObject.destroy( {
                success: function(alarmObject) {
                    console.log("The alarm was successfully deleted.");
                }
            } );
        }
    } );

    // Remove the alarm from the DOM.
    $("#" + objectId).remove();

    // Google analytics.
    ga('send', 'event', 'Alarm', 'Delete');
}

function signinCallback(authResponse) {
    if (authResponse["status"]["signed_in"]) {
        $("#signinButton").hide(); // They have logged in.

        gapi.client.load("plus", "v1", function() {
            var request = gapi.client.plus.people.get( { "userId": "me" } );

            request.execute(function(resp) {
                $("#userInformation").html("Welcome, " + resp["displayName"]);
                USER_ID = resp["id"];
                getAllAlarms(USER_ID);
            } );
        } );
    }
    else {
        console.log("Sign-in error: " + authResponse["error"]);
    }
}

// Call the functions once the DOM loads.
$(document).ready(function () {
    // Register the click event handlers.
    $("#addAlarmButton").click(showAlarmPopup);
    $("#cancelAlarmButton").click(hideAlarmPopup);
    $("#saveAlarmButton").click(addAlarm);

    fillSelects();
    getTime();
    getTemp();
} );
