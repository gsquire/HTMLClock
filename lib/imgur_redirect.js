/*
 * Fire's off once we land on the redirect page
 * and have been authenticated.
 */
"use strict";

function handle_redirect() {
    var access_token = document.URL.split("=", 1)[1];

    console.log(access_token);
}

$(document).ready(function() {
    handle_redirect();
} );
