const {ipcRenderer} = require('electron');
var remote = require('electron').remote;
const ytdl  = require('ytdl-core');
const fs    = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const readline = require('readline');
var elem = document.getElementById("myBar");
var cancelButton = document.getElementById("cancelBtn");

ipcRenderer.on('downloadFile', (event, videoInfo,fileName,os) => {

    var pathName = fileName.split('\\');
    var name = pathName[pathName.length - 1];
    let duration;
    let ffmpegPath = path.join(__dirname,'../ffmpeg/ffmpeg.exe');
    let ffprobePath =  path.join(__dirname,'../ffmpeg/ffprobe.exe');
    if(os === 'win32'){
      ffmpeg.setFfmpegPath(ffmpegPath);
      ffmpeg.setFfprobePath(ffprobePath);
    }else{
      ffmpeg.setFfmpegPath(path.join(__dirname,'../ffmpeg/ffmpeg'));
      ffmpeg.setFfprobePath(path.join(__dirname,'../ffmpeg/ffprobe'));
    }
    document.getElementById('fName').innerHTML = 'File: ' + name;
    document.getElementById("myProgress").style.display = 'flex';
    var audioStream = ytdl(videoInfo.Id,{filter: 'audioonly'},
                          {quality: 'highestaudio'});

  //  starttime = Date.now();

    ffmpeg(audioStream)
    .ffprobe(function(err, data) {
      duration = data.format.duration;
    });
    ffmpeg(audioStream)
    .audioBitrate(128)
    .audioCodec('libmp3lame')
    .format('mp3')
    .save(fileName)
    .on('progress', function(progress) {
      let percent = ((progress.targetSize / ((duration * 128)/8) )* 100).toFixed(2);
      if(!isNaN(percent)){
        document.getElementById("info").innerHTML = percent + '% Complete';
        elem.style.width = percent + '%';
      }
      if(progress.percent >= 100){
        window = remote.getCurrentWindow();
        window.close();
      }
    })
    .on('end', () => {
      //console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
      window = remote.getCurrentWindow();
      window.close();
    });
});
cancelButton.addEventListener("click", event => {
      closeWin();
});

(function () {

     function init() {

       let window = remote.getCurrentWindow();
        const minButton = document.getElementById('min-button'),
            closeButton = document.getElementById('close-button');

        minButton.addEventListener("click", event => {
            window = remote.getCurrentWindow();
            window.minimize();
        });

        closeButton.addEventListener("click", event => {
            closeWin();
        });

     };
     document.onreadystatechange = function () {
          if (document.readyState == "complete") {
               init();
          }
     };

})();

function closeWin(){
  var con = confirm('Are you sure to cancel the download?');
   if(con){
      window = remote.getCurrentWindow();
      window.close();
    }
}
