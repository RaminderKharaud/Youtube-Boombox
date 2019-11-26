/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
class AudioPlayerElementsCollection{

  constructor(){

    this._audioPlayerElement = document.querySelector('.green-audio-player');
    this._playPauseImage = this._audioPlayerElement.querySelector('#playPause');
    this._playpauseBtn = this._audioPlayerElement.querySelector('.play-pause-btn');
    this._loading = this._audioPlayerElement.querySelector('.loading');
    this._progress = this._audioPlayerElement.querySelector('.progress');
    this._sliders = this._audioPlayerElement.querySelectorAll('.slider');
    this._volumeBtn = this._audioPlayerElement.querySelector('.volume-btn');
    this._volumeControls = this._audioPlayerElement.querySelector('.volume-controls');
    this._volumeProgress = this._volumeControls.querySelector('.slider .progress');
    this._player = this._audioPlayerElement.querySelector('audio');
    this._currentTime = this._audioPlayerElement.querySelector('.current-time');
    this._totalTime = this._audioPlayerElement.querySelector('.total-time');
    this._speaker = this._audioPlayerElement.querySelector('#speaker');
    this._repeat = document.querySelector('#repeatButton');
    this._nextButton = document.getElementById('nextButtonDiv');
    this._prevButton = document.getElementById('prevButtonDiv');
    this._playingStatus = document.getElementById('playingStatus');
  }

  get AudioPlayerElement(){

    return this._audioPlayerElement;
  }
  get PlayPauseButton(){

    return this._playpauseBtn;
  }
  get PlayPauseButtonImage(){

    return this._playPauseImage;
  }
  get LoadingElement(){

    return this._loading;
  }
  get ProgressElement(){

    return this._progress;
  }
  get Sliders(){

    return this._sliders;
  }
  get VolumeButton(){

    return this._volumeBtn;
  }
  get VolumeControls(){

    return this._volumeControls;
  }
  get VolumeProgressElement(){

    return this._volumeProgress;
  }
  get Player(){

    return this._player;
  }
  get CurrentTime(){

    return this._currentTime;
  }
  get TotalTime(){

    return this._totalTime;
  }
  get Speaker(){

    return this._speaker;
  }
  get RepeatButton(){

    return this._repeat;
  }
  get NextButton(){

    return this._nextButton;
  }
  get PrevButton(){

    return this._prevButton;
  }
  get PlayingStatus(){

    return this._playingStatus;
  }
}
