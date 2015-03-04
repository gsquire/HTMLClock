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
    var imgur_me_url = "https://api.imgur.com/3/account/me";
    var access_token = getQueryVar("#access_token");
    var headers = {"Authorization" : "Bearer: " + access_token};

    $.get(imgur_me_url, headers, function(response) {
        alert("Hello there " + response["data"]["url"] + "!");
    } );
}

$(document).ready(function() {
    handle_redirect();
} );
