/*
 * Fire's off once we land on the redirect page
 * and have been authenticated.
 */
"use strict";

function getAccessToken() {
    var access_token_re = new RegExp("access_token=(.*?)&");
    var match = access_token_re.exec(document.URL);

    return match[1];
}

function handle_redirect() {
    var access_token = getAccessToken();

    localStorage.setItem("token", access_token);
    makeAPICall();
}

$(document).ready(function() {
    handle_redirect();
    window.close();
} );
