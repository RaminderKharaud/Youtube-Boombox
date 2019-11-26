"use strict";
/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
const remote = require('electron').remote;
const ytdl  = require('ytdl-core');
const lang  = 'en';
const fs    = require('fs');
const path = require('path');

document.onreadystatechange = function () {

     if (document.readyState == "complete") {

       let youtube_API_Key = 'YOUR_YOUTUBE_API_KEY';

       new Generator(youtube_API_Key).generateAppCode(); //initiate all js classes
     }
};
