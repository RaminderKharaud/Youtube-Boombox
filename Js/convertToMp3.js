const {ipcRenderer} = require('electron');

var trackId;
let starttime;
function saveMp3(videoId, title){
  trackId = videoId;
  var vTitle = title.substring(0,20);
  vTitle.trim();
  //remove all specail characters
  //vTitle = vTitle.replace(/[^a-zA-Z0-9 ]/g, "");
  vTitle = vTitle.split(" ").join("_");
  vTitle = '*/' + vTitle + '.mp3';
  var videoInfo = {Id: videoId, Title: vTitle};
  ipcRenderer.send('saveMp3File', videoInfo);
}

ipcRenderer.on('overLimit', (event, message) => {
    alert(message);
  });
