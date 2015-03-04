/*
 * Fire's off once we land on the redirect page
 * and have been authenticated.
 */
"use strict";

function handle_redirect() {
    var access_token_re = new RegExp("access_token=(.*)?");
    var access_token = document.URL.match(access_token_re);

    console.log(access_token);
}

$(document).ready(function() {
    handle_redirect();
} );
