/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
class YoutubeAPI{

  constructor(youtubeAPIKey){

    this._API_KEY = youtubeAPIKey;
  }

  makeYoutubeAPIReady(){

    gapi.client.setApiKey(this._API_KEY);
    gapi.client.load("youtube", "v3", function() {});

    this._openExternalURLInNewWindow();
  }

  _openExternalURLInNewWindow(){

    let shell = require('electron').shell;

    document.addEventListener('click', function (event) {
      if (event.target.tagName === 'A' && event.target.href.startsWith('https')) {
        event.preventDefault();
        shell.openExternal(event.target.href);
      }
    })
  }
}
