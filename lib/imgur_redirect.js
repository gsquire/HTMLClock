/*
 * Fire's off once we land on the redirect page
 * and have been authenticated.
 */
"use strict";

// css-tricks.com
function getQueryVar(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }

    return false;
}

function handle_redirect() {
    var access_token = getQueryVar("access_token");

    console.log(access_token);
}

$(document).ready(function() {
    handle_redirect();
} );
