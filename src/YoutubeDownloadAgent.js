const {ipcRenderer} = require('electron');

/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/

class YoutubeDownloadAgent{

  constructor(){

    this._errorMessage = document.getElementById('errorMessage');
    this._url = document.getElementById('txtLink');
    this._downloaderForm = document.getElementById('donwloaderForm');
    this._addAllEvents();
  }

  static saveMp3(videoId, title){

    let trackId = videoId;
    let vTitle = title.substring(0,20);
    vTitle.trim();
    //remove all specail characters
    //vTitle = vTitle.replace(/[^a-zA-Z0-9 ]/g, "");
    vTitle = vTitle.split(" ").join("_");
    vTitle = '*/' + vTitle + '.mp3';
    let videoInfo = {Id: videoId, Title: vTitle};

    ipcRenderer.send('saveMp3File', videoInfo);
  }

  _downloader(event){

    let self = event.currentTarget.self;
    event.preventDefault();
    let url = self._url.value.trim();

    if(url.length > 0){

      let listLinkIndex = url.indexOf("list");
      if(listLinkIndex != -1){
        url = url.substring(0, listLinkIndex - 1);
      }

      if(ytdl.validateURL(url)){

        self._errorMessage.innerHTML = "";
        let id = ytdl.getVideoID(url);
        let title;
        ytdl.getInfo(id, (err, info) => {

          if (err){

            title = 'track_' + id;
            YoutubeDownloadAgent.saveMp3(id, title);
          }else{
            title = info.title;
            if(typeof title == "undefined"){
              title = 'track_' + id;
            }else{
              title = title.replace(/[^a-zA-Z0-9 ]/g, "");
              title = title.trim();
            }
            YoutubeDownloadAgent.saveMp3(id, title);
          }
        });
      }else{
        self._errorMessage.innerHTML = "Invalid Url: Youtube video link that you provided is not valid";
      }
    }
    return false;
  }

  _addAllEvents(){

    ipcRenderer.on('overLimit', (event, message) => {
        alert(message);
      });
      this._downloaderForm.self = this;
    this._downloaderForm.addEventListener('submit', this._downloader);
  }

}
