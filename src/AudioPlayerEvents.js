/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
class AudioPlayerEvents{

  constructor(audio_playerElements, windowEvents, publicPlaylist){

    this._windowEvents = windowEvents;
    this._publicPlaylist = publicPlaylist;
    this._playpauseBtn = audio_playerElements.PlayPauseButton;
    this._nextButton = audio_playerElements.NextButton;
    this._prevButton = audio_playerElements.PrevButton;
    this._repeat = audio_playerElements.RepeatButton;
    this._player = audio_playerElements.Player;
    this._sliders = audio_playerElements.Sliders;
    this._speaker = audio_playerElements.Speaker;
    this._volumeBtn = audio_playerElements.VolumeButton;
    this._volumeControls = audio_playerElements.VolumeControls;
    this._volumeProgress = audio_playerElements.VolumeProgressElement;
    this._playPauseButtonImage = audio_playerElements.PlayPauseButtonImage;
    this._playingStatus = audio_playerElements.PlayingStatus;
    this._progress = audio_playerElements.ProgressElement;
    this._currentTime = audio_playerElements.CurrentTime;
    this._totalTime = audio_playerElements.TotalTime;
    this._loading = audio_playerElements.LoadingElement;
    this._errorPlaying = false;
    this._repeatValue = 0;

  }

  get errorPlaying(){

    return this._errorPlaying;
  }

  set errorPlaying(value){

    this._errorPlaying = value;
  }

  addAllEvents(){
    this.AddPlayPauseButtonEvents();
    this.Add_nextButtonEvents();
    this.Add_prevButtonEvents();
    this.Add_repeatButtonEvents();
    this.Add_playerEvents();
    this.AddVolumeButtonEvents();
    this.AddSliderEvents();
  }

  AddPlayPauseButtonEvents(){
    this._playpauseBtn.self = this;
    this._playpauseBtn.addEventListener('click', this._togglePlay);
    this._playpauseBtn.addEventListener('mouseover', this._hoverPlay);
    this._playpauseBtn.addEventListener('mouseout', this._mouseOutPlay);
  }

  Add_nextButtonEvents(){
    this._nextButton.self = this;
    this._nextButton.addEventListener('click', this._playNext);
    this._nextButton.addEventListener('mouseover', this._nextButtonHover);
    this._nextButton.addEventListener('mouseout', this._nextButtonMouseOut);
  }

  Add_prevButtonEvents(){
    this._prevButton.self = this;
    this._prevButton.addEventListener('click', this._playPrev);
    this._prevButton.addEventListener('mouseover', this._prevButtonHover);
    this._prevButton.addEventListener('mouseout', this._prevButtonMouseOut);
  }

  Add_repeatButtonEvents(){
    this._repeat.self = this;
    this._repeat.addEventListener('click', this._repeatOnClick);
    this._repeat.addEventListener('mouseover', this._hoverRepeat);
    this._repeat.addEventListener('mouseout', this._mouseOutRepeat);
  }

  Add_playerEvents(){
    this._player.self = this;
    this._player.addEventListener('timeupdate', this._updateProgress);
    this._player.addEventListener('volumechange', this._updateVolume);
    this._player.addEventListener('loadedmetadata', this._loadMetaData);
    this._player.addEventListener('canplay', this.makePlay);
    this._player.addEventListener('ended', this._whenTrackEnds);
  }

  AddVolumeButtonEvents(){
    this._volumeBtn.self = this;
    this._volumeBtn.addEventListener('click', this._toggleVolumeBtn);
  }

  AddSliderEvents(){
    let self = this;
    this._sliders.forEach(function(slider){
      slider.self = self;
    })

    this._sliders.forEach(self._sliderClickEvent);
  }

  _sliderClickEvent(slider){
    let self = slider.self;
    let pin = slider.querySelector('.pin');
    slider.addEventListener('click', self._windowEvents[pin.dataset.method]);
  }

  _whenTrackEnds(event) {
    let self = event.currentTarget.self;
  //  playPause.attributes.d.value = "M18 12L0 24V0";
    self._playPauseButtonImage.src = path.join(__dirname,'images/Play-Button.png');
      self._player.currentTime = 0;
      if(self._repeatValue == 1){
        self._player.play();
      }else if(self._repeatValue == 2){
        if(self._publicPlaylist.PublicPlaylistActive && self._publicPlaylist.PublicPlaylistCurr == self._publicPlaylist.PublicPlaylistLength - 1){
          self._publicPlaylist.PlayPublicPlaylist(0);
        }
      }else{
        self._playingStatus.innerHTML = "Stopped:";
      }
  }

  _togglePlay(event) {

    let self = event.currentTarget.self;
    if(self._errorPlaying)return;

    if(self._player.src != null && self._player.src.length > 0){
      if (self._player.paused) {
          self._playPauseButtonImage.src = path.join(__dirname,'images/Pause-Button-Hover.png');
          self._playingStatus.innerHTML = "Now Playing:";
      //  playPause.attributes.d.value = "M0 0h6v24H0zM12 0h6v24h-6z";
        self._player.play();
      } else {
      //  playPause.attributes.d.value = "M18 12L0 24V0";
          self._playPauseButtonImage.src = path.join(__dirname,'images/Play-Button-Hover.png');
          self._playingStatus.innerHTML = "Paused:";
        self._player.pause();
      }
    }
  }

  _hoverPlay(event){
    let self = event.currentTarget.self;
    if(self._player.paused){
      self._playPauseButtonImage.src = path.join(__dirname,'images/Play-Button-Hover.png');
    }else{
      self._playPauseButtonImage.src = path.join(__dirname,'images/Pause-Button-Hover.png');
    }
  }

  _mouseOutPlay(event){
    let self = event.currentTarget.self;
    if(self._player.paused){
      self._playPauseButtonImage.src = path.join(__dirname,'images/Play-Button.png');
    }else{
      self._playPauseButtonImage.src = path.join(__dirname,'images/Pause-Button.png');
    }
  }

  _playNext(event){

    let self = event.currentTarget.self;
    if(self._publicPlaylist.PublicPlaylistActive){
      self._publicPlaylist.PlayPublicPlaylist(self._publicPlaylist.PublicPlaylistCurr + 1);
    }
  }

  _playPrev(){

    let self = event.currentTarget.self;
    if(self._publicPlaylist.PublicPlaylistActive){
      self._publicPlaylist.PlayPublicPlaylist(self._publicPlaylist.PublicPlaylistCurr - 1);
    }
  }

  _nextButtonHover(){
    let self = event.currentTarget.self;
    if(self._publicPlaylist.PublicPlaylistActive)
      document.getElementById('nextButton').src = 'images/Play-Forward-Hover.png';
  }

  _nextButtonMouseOut(){
    document.getElementById('nextButton').src = 'images/Play-Forward.png';
  }

  _prevButtonHover(){
    let self = event.currentTarget.self;
    if(self._publicPlaylist.PublicPlaylistActive)
      document.getElementById('prevButton').src = 'images/Play-Back-Hover.png';
  }

  _prevButtonMouseOut(){
    document.getElementById('prevButton').src = 'images/Play-Back.png';
  }

  _hoverRepeat(event){
    let self = event.currentTarget.self;
    if(self._repeatValue == 0){
      self._repeat.src = path.join(__dirname,'images/repeat-Hover.png');
    }
  }

  _mouseOutRepeat(event){
    let self = event.currentTarget.self;
    if(self._repeatValue == 0){
      self._repeat.src = path.join(__dirname,'images/Repeat.png');
    }
  }

  _repeatOnClick(event){
    let self = event.currentTarget.self;
    if(self._repeatValue == 0){
      self._repeatValue = 1;
      self._repeat.src = path.join(__dirname,'images/Repeat-1.png');
    }else if(self._repeatValue == 1){
      self._repeatValue = 2;
      self._repeat.src = path.join(__dirname,'images/Repeat-A.png');
    }else if(self._repeatValue == 2){
      self._repeatValue = 0;
      self._repeat.src = path.join(__dirname,'images/repeat-Hover.png');
    }
  }

  makePlay(event) {
    let self;
    if(event){
      self = event.currentTarget.self;
    }else{
      self = this;
    }
    self._playpauseBtn.style.display = 'block';
    self._loading.style.display = 'none';
  }
  _updateProgress(event) {

    let self = event.currentTarget.self;
    let current = self._player.currentTime;
    let percent = current / self._player.duration * 100;
    self._progress.style.width = percent + '%';
    self._currentTime.textContent = self._formatTime(current);
  }

  _updateVolume(event) {

    let self = event.currentTarget.self;
    self._volumeProgress.style.height = self._player.volume * 100 + '%';
    if (self._player.volume >= 0.5) {
      self._speaker.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
    } else if (self._player.volume < 0.5 && self._player.volume > 0.05) {
      self._speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
    } else if (self._player.volume <= 0.05) {
      self._speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
    }
  }

  _toggleVolumeBtn(event){

    let self = event.currentTarget.self;
    self._volumeBtn.classList.toggle('open');
    self._volumeControls.classList.toggle('hidden');
  }

  _loadMetaData (event) {

    let self = event.currentTarget.self;
    self._totalTime.textContent = self._formatTime(self._player.duration);
  }

  _formatTime(time) {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return min + ':' + (sec < 10 ? '0' + sec : sec);
  }

}
