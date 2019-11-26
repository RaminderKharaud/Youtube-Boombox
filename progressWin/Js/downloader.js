/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
const {ipcRenderer} = require('electron');
const remote = require('electron').remote;
const ytdl  = require('ytdl-core');
const fs    = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const readline = require('readline');
const elem = document.getElementById("myBar");
const cancelButton = document.getElementById("cancelBtn");

ipcRenderer.on('downloadFile', (event, videoInfo,fileName,os) => {

    let pathName = fileName.split('\\');
    let name = pathName[pathName.length - 1];
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
    let audioStream = ytdl(videoInfo.Id,{filter: 'audioonly'},
                          {quality: 'highestaudio'});

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

function closeWin(){
  var con = confirm('Are you sure to cancel the download?');
   if(con){
      window = remote.getCurrentWindow();
      window.close();
    }
}
