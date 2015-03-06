/*
 * Start an OAuth flow with Imgur.
 */
"use strict";

// An object that keeps track of the App info we use
// to authenticate users with.
var imgur_info;

// Our Imgur information to login with.
function init() {
    return {
        "client_id": "3e4c3a64b4c7403",
        "response_type": "token",
        "state": "777"
    };
}

function login() {
    var IMGUR_URL = "https://api.imgur.com/oauth2/authorize?";
    var params_string = $.param(imgur_info); // Make a query string.
    var complete_url = IMGUR_URL + params_string;

    window.open(complete_url);
}

function makeAPICall() {
    var imgur_me_url = "https://api.imgur.com/3/account/me";
    var access_token = localStorage.getItem("token");
    var headers = {"Authorization" : "Bearer " + access_token};

    $.ajax( {
        type: "GET",
        url: imgur_me_url,
        headers: headers,
        success: function(response) {
            alert("Hello, " + response["data"]["url"]);
        }
    } );
}

$(document).ready(function () {
    imgur_info = init();
    $("#signIn").click(login);
} );
