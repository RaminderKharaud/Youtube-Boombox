var audioPlayer = document.querySelector('.green-audio-player');
var playPause = audioPlayer.querySelector('#playPause');
var playpauseBtn = audioPlayer.querySelector('.play-pause-btn');
var loading = audioPlayer.querySelector('.loading');
var progress = audioPlayer.querySelector('.progress');
var sliders = audioPlayer.querySelectorAll('.slider');
var volumeBtn = audioPlayer.querySelector('.volume-btn');
var volumeControls = audioPlayer.querySelector('.volume-controls');
var volumeProgress = volumeControls.querySelector('.slider .progress');
var player = audioPlayer.querySelector('audio');
var currentTime = audioPlayer.querySelector('.current-time');
var totalTime = audioPlayer.querySelector('.total-time');
var speaker = audioPlayer.querySelector('#speaker');
var repeat = document.querySelector('#repeatButton');
var nextButton = document.getElementById('nextButtonDiv');
var prevButton = document.getElementById('prevButtonDiv');
var draggableClasses = ['pin'];
var currentlyDragged = null;
var repeatValue = 0;
const ytdl  = require('ytdl-core');
const lang  = 'en';
const fs    = require('fs');
const path = require('path');
//const path  = require('path');

window.addEventListener('mousedown', function (event) {

  if (!isDraggable(event.target)) return false;

  currentlyDragged = event.target;
  var handleMethod = currentlyDragged.dataset.method;

  this.addEventListener('mousemove', window[handleMethod], false);

  window.addEventListener('mouseup', function () {
    currentlyDragged = false;
    window.removeEventListener('mousemove', window[handleMethod], false);
  }, false);
});

playpauseBtn.addEventListener('click', togglePlay);
playpauseBtn.addEventListener('mouseover', hoverPlay);
playpauseBtn.addEventListener('mouseout', mouseOutPlay);

nextButton.addEventListener('click', playNext);
nextButton.addEventListener('mouseover', nextButtonHover);
nextButton.addEventListener('mouseout', nextButtonMouseOut);

prevButton.addEventListener('click', playPrev);
prevButton.addEventListener('mouseover', prevButtonHover);
prevButton.addEventListener('mouseout', prevButtonMouseOut);

repeat.addEventListener('click', repeatOnClick);
repeat.addEventListener('mouseover', hoverRepeat);
repeat.addEventListener('mouseout', mouseOutRepeat);

player.addEventListener('timeupdate', updateProgress);
player.addEventListener('volumechange', updateVolume);
player.addEventListener('loadedmetadata', function () {
  totalTime.textContent = formatTime(player.duration);
});
player.addEventListener('canplay', makePlay);
player.addEventListener('ended', function () {
//  playPause.attributes.d.value = "M18 12L0 24V0";
playPause.src = path.join(__dirname,'images/Play-Button.png');
  player.currentTime = 0;
  if(repeatValue == 1){
    player.play();
  }else if(repeatValue == 2){
    if(publicPlaylistActive && publicPlaylistCurr == publicPlaylistLength - 1){
      playPublicPlaylist(0);
    }
  }else{
    document.getElementById('playingStatus').innerHTML = "Stopped:";
  }
});

volumeBtn.addEventListener('click', function () {
  volumeBtn.classList.toggle('open');
  volumeControls.classList.toggle('hidden');
});

window.addEventListener('resize', directionAware);

sliders.forEach(function (slider) {
  var pin = slider.querySelector('.pin');
  slider.addEventListener('click', window[pin.dataset.method]);
});

directionAware();

function isDraggable(el) {
  var canDrag = false;
  var classes = Array.from(el.classList);
  draggableClasses.forEach(function (draggable) {
    if (classes.indexOf(draggable) !== -1)
    canDrag = true;
  });
  return canDrag;
}

function inRange(event) {
  var rangeBox = getRangeBox(event);
  var rect = rangeBox.getBoundingClientRect();
  var direction = rangeBox.dataset.direction;
  if (direction == 'horizontal') {
    var min = rangeBox.offsetLeft;
    var max = min + rangeBox.offsetWidth;
    if (event.clientX < min || event.clientX > max) return false;
  } else {
    var min = rect.top;
    var max = min + rangeBox.offsetHeight;
    if (event.clientY < min || event.clientY > max) return false;
  }
  return true;
}

function updateProgress() {
  var current = player.currentTime;
  var percent = current / player.duration * 100;
  progress.style.width = percent + '%';

  currentTime.textContent = formatTime(current);
}

function updateVolume() {
  volumeProgress.style.height = player.volume * 100 + '%';
  if (player.volume >= 0.5) {
    speaker.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
  } else if (player.volume < 0.5 && player.volume > 0.05) {
    speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
  } else if (player.volume <= 0.05) {
    speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
  }
}

function getRangeBox(event) {
  var rangeBox = event.target;
  var el = currentlyDragged;
  if (event.type == 'click' && isDraggable(event.target)) {
    rangeBox = event.target.parentElement.parentElement;
  }
  if (event.type == 'mousemove') {
    rangeBox = el.parentElement.parentElement;
  }
  return rangeBox;
}

function getCoefficient(event) {
  var slider = getRangeBox(event);
  var rect = slider.getBoundingClientRect();
  var K = 0;
  if (slider.dataset.direction == 'horizontal') {

    var offsetX = event.clientX - slider.offsetLeft;
    var width = slider.clientWidth;
    K = offsetX / width;

  } else if (slider.dataset.direction == 'vertical') {

    var height = slider.clientHeight;
    var offsetY = event.clientY - rect.top;
    K = 1 - offsetY / height;
  }
  if(K < 0.03) K = 0;
  return K;
}

function rewind(event) {
  if (inRange(event)) {
    player.currentTime = player.duration * getCoefficient(event);
  }
}

function changeVolume(event) {
  if (inRange(event)) {
    player.volume = getCoefficient(event);
  }
}

function formatTime(time) {
  var min = Math.floor(time / 60);
  var sec = Math.floor(time % 60);
  return min + ':' + (sec < 10 ? '0' + sec : sec);
}

function togglePlay() {
  if(player.src != null && player.src.length > 0){
    if (player.paused) {
        playPause.src = path.join(__dirname,'images/Pause-Button-Hover.png');
        document.getElementById('playingStatus').innerHTML = "Now Playing:";
    //  playPause.attributes.d.value = "M0 0h6v24H0zM12 0h6v24h-6z";
      player.play();
    } else {
    //  playPause.attributes.d.value = "M18 12L0 24V0";
        playPause.src = path.join(__dirname,'images/Play-Button-Hover.png');
        document.getElementById('playingStatus').innerHTML = "Paused:";
      player.pause();
    }
  }
}
function hoverPlay(){
  if(player.paused){
    playPause.src = path.join(__dirname,'images/Play-Button-Hover.png');
  }else{
    playPause.src = path.join(__dirname,'images/Pause-Button-Hover.png');
  }
}
function mouseOutPlay(){
  if(player.paused){
    playPause.src = path.join(__dirname,'images/Play-Button.png');
  }else{
    playPause.src = path.join(__dirname,'images/Pause-Button.png');
  }
}
function playNext(){
  if(publicPlaylistActive){
    playPublicPlaylist(publicPlaylistCurr + 1);
  }
}
function playPrev(){
  if(publicPlaylistActive){
    playPublicPlaylist(publicPlaylistCurr - 1);
  }
}
function nextButtonHover(){
  if(publicPlaylistActive)
    document.getElementById('nextButton').src = 'images/Play-Forward-Hover.png';
}
function nextButtonMouseOut(){
  document.getElementById('nextButton').src = 'images/Play-Forward.png';
}
function prevButtonHover(){
  if(publicPlaylistActive)
    document.getElementById('prevButton').src = 'images/Play-Back-Hover.png';
}
function prevButtonMouseOut(){
  document.getElementById('prevButton').src = 'images/Play-Back.png';
}
function hoverRepeat(){
  if(repeatValue == 0){
    repeat.src = path.join(__dirname,'images/repeat-Hover.png');
  }
}
function mouseOutRepeat(){
  if(repeatValue == 0){
    repeat.src = path.join(__dirname,'images/Repeat.png');
  }
}
function repeatOnClick(){
  if(repeatValue == 0){
    repeatValue = 1;
    repeat.src = path.join(__dirname,'images/Repeat-1.png');
  }else if(repeatValue == 1){
    repeatValue = 2;
    repeat.src = path.join(__dirname,'images/Repeat-A.png');
  }else if(repeatValue == 2){
    repeatValue = 0;
    repeat.src = path.join(__dirname,'images/repeat-Hover.png');
  }
}
function makePlay() {
  playpauseBtn.style.display = 'block';
  loading.style.display = 'none';
}

function directionAware() {
  if (window.innerHeight < 250) {
    volumeControls.style.bottom = '-54px';
    volumeControls.style.left = '54px';
  } else if (audioPlayer.offsetTop < 154) {
    volumeControls.style.bottom = '-164px';
    volumeControls.style.left = '-3px';
  } else {
    volumeControls.style.bottom = '52px';
    volumeControls.style.left = '-3px';
  }
}

//_______________________________________________________________________

//play youtube audio
function play(itemId, title){
  publicPlaylistActive = false;
  if(searchForList){
    document.getElementById("playListDiv").style.display = 'flex';
    document.getElementById("ytSearchTab").style.display = 'none';
    loadPublicPlaylist(itemId, title);
  }else{
    playTrack(itemId, title);
  }
}
function playTrending(itemId, title){
  publicPlaylistActive = false;
  playTrack(itemId, title);
}
function playTrack(videoId, title){
  playpauseBtn.style.display = 'none';
  loading.style.display = 'block';
  if(!player.paused && player.src.trim().length > 0)player.pause();
  try {
    ytdl.getInfo(videoId, (err, info) => {
      if (err) throw err;
      //let formats = ytdl.filterFormats(info.formats, 'audioonly');
      let audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
      if (audioFormat) {
           player.src = audioFormat.url;
           player.load();
           playPause.src = path.join(__dirname,'images/Pause-Button.png');
           player.play();
           document.getElementById('PlayingInfo').style.display = 'block';
           document.getElementById('titleBar').innerHTML = title;
           var htm = '<a style="color:hotpink;margin-right:10px;" class="youtubeLink"';
           htm += 'href="#" onClick="saveMp3('+"'" +videoId+"','" +title+ "'" + ')">Download Mp3</a>';
           htm += '<a style="color: yellow;" class="youtubeLink"';
           htm += 'href="https://www.youtube.com/watch?v='+ videoId + '">open youtube Page</a>';
           document.getElementById('ytLink').innerHTML = htm;

           visualization(player);
     }
   });

  } catch(err) {
   console.log(err);
  }
}
