/*
 * author: Garrett Squire, gsquire
 *
 * A small function to return the current time to the screen.
 *
 */
'use strict';

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

    var clock = document.getElementById("g_clock");
    clock.innerHTML = time_string;
}

window.onload = getTime();
