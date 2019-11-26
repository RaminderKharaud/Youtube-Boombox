/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
class WindowEvents{

  constructor(audioPlayerElementsCollection){

    this._playerElements = audioPlayerElementsCollection;
    this._currentlyDragged = null;
    this._draggableClasses = ['pin'];
    this._handleMethod;
  //  this._addAllEvents();

  }

  addAllEvents(){

    this._addMouseDownEvent();
    this._addMouseUpEvent();
    this._addResizeEvent();
  }
  _addResizeEvent(){

    window.addEventListener('resize', this._directionAware);
    window.winEvents = this;
  }

  _addMouseDownEvent(){
    let self = this;
    window.addEventListener('mousedown', function (event) {

      if (!self._isDraggable(event.target)) return false;

      self._currentlyDragged = event.target;
      self._handleMethod = self._currentlyDragged.dataset.method;
      window.addEventListener('mousemove', self[self._handleMethod], false);
    });
  }

  _addMouseUpEvent(){
    let self = this;
    window.addEventListener('mouseup', function () {
      self._currentlyDragged = false;
      window.removeEventListener('mousemove', self[self._handleMethod], false);
    }, false);
  }

  _directionAware(event) {
    let self = event.currentTarget.winEvents;
    if (window.innerHeight < 250) {
      self._playerElements.VolumeControls.style.bottom = '-54px';
      self._playerElements.VolumeControls.style.left = '54px';
    } else if (self._playerElements.AudioPlayerElement.offsetTop < 154) {
      self._playerElements.VolumeControls.style.bottom = '-164px';
      self._playerElements.VolumeControls.style.left = '-3px';
    } else {
      self._playerElements.VolumeControls.style.bottom = '52px';
      self._playerElements.VolumeControls.style.left = '-3px';
    }
  }

  _isDraggable(el) {
    let draggableClasses = ['pin'];
    let canDrag = false;
    let classes = Array.from(el.classList);
    draggableClasses.forEach(function (draggable) {
      if (classes.indexOf(draggable) !== -1)
      canDrag = true;
    });
    return canDrag;
  }
  rewind(event) {
    let self = window['winEvents'];
    let player = self._playerElements.Player;
    try{
      if (self._inRange(event)) {
         player.currentTime = player.duration * self._getCoefficient(event);
       }
     }catch(error){
       console.log('nothing is being played righ now');
     }
   }

   changeVolume(event) {
    // let self = event.currentTarget.winEvents;
    let self = window['winEvents'];
     let player = self._playerElements.Player;
     try{
       if (self._inRange(event)) {
         player.volume = self._getCoefficient(event);
       }
     }catch(error){
      console.log('error with volume control '+ error);
    }
   }
   _inRange(event) {
     let self = window['winEvents'];
     let rangeBox = self._getRangeBox(event);
     let rect = rangeBox.getBoundingClientRect();
     let direction = rangeBox.dataset.direction;
     if (direction == 'horizontal') {
       let min = rangeBox.offsetLeft;
       let max = min + rangeBox.offsetWidth;
       if (event.clientX < min || event.clientX > max) return false;
     } else {
       let min = rect.top;
       let max = min + rangeBox.offsetHeight;
       if (event.clientY < min || event.clientY > max) return false;
     }
     return true;
   }
   _getCoefficient(event) {
     let self = window['winEvents'];
     let slider = self._getRangeBox(event);
     let rect = slider.getBoundingClientRect();
     let K = 0;
     if (slider.dataset.direction == 'horizontal') {

       let offsetX = event.clientX - slider.offsetLeft;
       let width = slider.clientWidth;
       K = offsetX / width;

     } else if (slider.dataset.direction == 'vertical') {

       let height = slider.clientHeight;
       let offsetY = event.clientY - rect.top;
       K = 1 - offsetY / height;
     }
     if(K < 0.03) K = 0;
     return K;
   }
   _getRangeBox(event) {
     let self = window['winEvents'];
     let rangeBox = event.target;
     let el = self._currentlyDragged;
     if (event.type == 'click' && self._isDraggable(event.target)) {
       rangeBox = event.target.parentElement.parentElement;
     }
     if (event.type == 'mousemove') {
       rangeBox = el.parentElement.parentElement;
     }
     return rangeBox;
   }
}
