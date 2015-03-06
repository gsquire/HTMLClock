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
    var imgur_me_url = "https://api.imgur.com/3/account/me";
    var access_token = getAccessToken();

    localStorage.setItem("token", access_token);
    makeAPICall();
    window.close();
}

$(document).ready(function() {
    handle_redirect();
} );
