/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
class SoundEqualizer{

  constructor(context){

    this._context = context;
    this._mediaElement = document.querySelector('audio');
    this._source = this._context.createMediaElementSource(this._mediaElement);
    this._highShelf = this._context.createBiquadFilter();
    this._lowShelf = this._context.createBiquadFilter();
    this._highPass = this._context.createBiquadFilter();
    this._lowPass = this._context.createBiquadFilter();
    this._currEffect = 'none';
    this._buttonArray = ['Boombox','Stereo','Classic','Jazz','Pop','Rock'];
    this._ranges = document.querySelectorAll('input[type=range]');
    this._resetButton = document.getElementById('resetBtn');
    this._ramy = 'ramy';
    this._connect();
    this._setValues();
    this._addAllEvents();

  }
  get context(){
    return this._context;
  }
  get source(){

    return this._source;
  }

  get currEffect(){

    return this._currEffect;
  }

  getEquilizerValues(){

    var valueString;
    valueString = document.getElementById("HS1").value + ':';
    valueString += document.getElementById("HS2").value + ':';
    valueString += document.getElementById("LS1").value + ':';
    valueString += document.getElementById("LS2").value + ':';
    valueString += document.getElementById("HP1").value + ':';
    valueString += document.getElementById("HP2").value + ':';
    valueString += document.getElementById("LP1").value + ':';
    valueString += document.getElementById("LP2").value;

    return valueString;
  }

  setEquilizerValues(data){
    let list = data.split(':');
    if(list.length == 8){
      document.getElementById("HS1").value = list[0];
      this['_highShelf']['frequency'].value = list[0];
      document.getElementById("HS2").value = list[1];
      this['_highShelf']['gain'].value = list[1];

      document.getElementById("LS1").value = list[2];
      this['_lowShelf']['frequency'].value = list[2];
      document.getElementById("LS2").value = list[3];
      this['_lowShelf']['gain'].value = list[3];

      document.getElementById("HP1").value = list[4];
      this['_highPass']['frequency'].value = list[4];
      document.getElementById("HP2").value = list[5];
      this['_highPass']['Q'].value = list[5];

      document.getElementById("LP1").value = list[6];
      this['_lowPass']['frequency'].value = list[6];
      document.getElementById("LP2").value = list[7];
      this['_lowPass']['Q'].value = list[7];
    }
  }

  _addAllEvents(){
    this._addRangeEvents();
    this._addButtonEvents();
  }

  _connect(){

    this._source.connect(this._highShelf);
    this._highShelf.connect(this._lowShelf);
    this._lowShelf.connect(this._highPass);
    this._highPass.connect(this._lowPass);
    this._lowPass.connect(this._context.destination);
  }

  _setValues(){

    this._highShelf.type = "highshelf";
    this._highShelf.frequency.value = 4700;
    this._highShelf.gain.value = 50;

    this._lowShelf.type = "lowshelf";
    this._lowShelf.frequency.value = 35;
    this._lowShelf.gain.value = 50;

    this._highPass.type = "highpass";
    this._highPass.frequency.value = 800;
    this._highPass.Q.value = 0.7;

    this._lowPass.type = "lowpass";
    this._lowPass.frequency.value = 880;
    this._lowPass.Q.value = 0.7;
  }

  _addRangeEvents(){
    let self = this;
    this._ranges.forEach(function(range){
      range.addEventListener('input', function() {
        self._eraseColor(self);
        self._currEffect = 'none';
        self[range.dataset.filter][range.dataset.param].value = range.value;
      });
    });
  }

  _addButtonEvents(){
    this._resetButton.self = this;
    this._resetButton.addEventListener('click', this._reset);

    for(let j = 0;j < this._buttonArray.length; j++){
      let button = document.getElementById(this._buttonArray[j]);
      button.effect = this._buttonArray[j];
      button.self = this;
      button.addEventListener('mouseover', this._buttonBackgroundOnMouseover);
      button.addEventListener('mouseout', this._buttonBackgroundOnMouseout);
      button.addEventListener('click',this._setEffect);
    }

  }
  _buttonBackgroundOnMouseover(event){
    let effect = event.currentTarget.effect;
    let self = event.currentTarget.self;
    if(self._currEffect != effect)
      event.currentTarget.style.background = '-webkit-linear-gradient(top, #f44242 5%, #000000 100%)';
  }
  _buttonBackgroundOnMouseout(event){
    let effect = event.currentTarget.effect;
    let self = event.currentTarget.self;
    if(self._currEffect != effect)
      event.currentTarget.style.background = '-webkit-linear-gradient(top, #4f595e 5%, #000000 100%)';
  }

  setEffect(effect, me){

    let self;
    if(me){
      self = me
    }else{
      self = this;
    }

    self._eraseColor(self);

    self._currEffect = effect;

    document.getElementById(effect).style.background = '-webkit-linear-gradient(top, #f49b42 5%, #000000 100%)';

    if(effect === 'Boombox'){

      self._applyBoomboxEffect(self);

    }else if(effect === 'Stereo'){

      self._applyStereoEffect(self);

    }else if(effect === 'Classic'){

      self._applyClassicEffect(self);

    }else if(effect === 'Jazz'){

      self._applyJazzEffect(self);

    }else if(effect === 'Pop'){

      self._applyPopEffect(self);

    }else if(effect === 'Rock'){

      self._applyRockEffect(self);

    }
  }
  _setEffect(event){
    let self = event.currentTarget.self;
    let effect = event.currentTarget.effect;
    self.setEffect(effect,self);
  }
  _reset(event){

    let self = event.currentTarget.self;

    self._currEffect = 'none';
    self._eraseColor(self);
    document.getElementById("HS1").value = 4700;
    self['_highShelf']['frequency'].value = 4700;
    document.getElementById("HS2").value = 50;
    self['_highShelf']['gain'].value = 50;

    document.getElementById("LS1").value = 35;
    self['_lowShelf']['frequency'].value = 35;
    document.getElementById("LS2").value = 50;
    self['_lowShelf']['gain'].value = 50;

    document.getElementById("HP1").value = 800;
    self['_highPass']['frequency'].value = 800;
    document.getElementById("HP2").value = 0.7;
    self['_highPass']['Q'].value = 0.7;

    document.getElementById("LP1").value = 880;
    self['_lowPass']['frequency'].value = 880;
    document.getElementById("LP2").value = 0.7;
    self['_lowPass']['Q'].value = 0.7;
  }
  _eraseColor(me){
    let self = this;
    if(me)self = me;
    let color = '-webkit-linear-gradient(top, #4f595e 5%, #000000 100%)';
    for(let i = 0;i < self._buttonArray.length; i++){
      document.getElementById(self._buttonArray[i]).style.background = color;
    }
  }
  _applyBoomboxEffect(self){

    self._currEffect = 'Boombox';
  //  let range =
  //  range.value = 9300;
    //currentthis[range.dataset.filter][range.dataset.param].value = 9300;
    document.getElementById("HS1");
    self['_highShelf']['frequency'].value = 9300;
    document.getElementById("HS2").value = 15;
    self['_highShelf']['gain'].value = 15;

    document.getElementById("LS1").value = 162;
    self['_lowShelf']['frequency'].value = 162;
    document.getElementById("LS2").value = 28;
    self['_lowShelf']['gain'].value = 28;

    document.getElementById("HP1").value = 1700;
    self['_highPass']['frequency'].value = 1700;
    document.getElementById("HP2").value = 0.7;
    self['_highPass']['Q'].value = 0.7;

    document.getElementById("LP1").value = 410;
    self['_lowPass']['frequency'].value = 410;
    document.getElementById("LP2").value = 0.7;
    self['_lowPass']['Q'].value = 0.7;
  }
  _applyStereoEffect(self){
    self._currEffect = 'Stereo';
    document.getElementById("HS1").value = 5800;
    self['_highShelf']['frequency'].value = 5800;
    document.getElementById("HS2").value = 7;
    self['_highShelf']['gain'].value = 7;

    document.getElementById("LS1").value = 181;
    self['_lowShelf']['frequency'].value = 181;
    document.getElementById("LS2").value = 39;
    self['_lowShelf']['gain'].value = 39;

    document.getElementById("HP1").value = 2700;
    self['_highPass']['frequency'].value = 2700;
    document.getElementById("HP2").value = 2.7;
    self['_highPass']['Q'].value = 2.7;

    document.getElementById("LP1").value = 600;
    self['_lowPass']['frequency'].value = 600;
    document.getElementById("LP2").value = 9.6;
    self['_lowPass']['Q'].value = 9.6;
  }
  _applyClassicEffect(self){
    self._currEffect = 'Classic';
    document.getElementById("HS1").value = 7100;
    self['_highShelf']['frequency'].value = 7100;
    document.getElementById("HS2").value = 31;
    self['_highShelf']['gain'].value = 31;

    document.getElementById("LS1").value = 65;
    self['_lowShelf']['frequency'].value = 65;
    document.getElementById("LS2").value = 33;
    self['_lowShelf']['gain'].value = 33;

    document.getElementById("HP1").value = 2700;
    self['_highPass']['frequency'].value = 2700;
    document.getElementById("HP2").value = 7.2;
    self['_highPass']['Q'].value = 7.2;

    document.getElementById("LP1").value = 400;
    self['_lowPass']['frequency'].value = 400;
    document.getElementById("LP2").value = 3.3;
    self['_lowPass']['Q'].value = 3.3;
  }
  _applyJazzEffect(self){
    self._currEffect = 'Jazz';
    document.getElementById("HS1").value = 18700;
    self['_highShelf']['frequency'].value = 18700;
    document.getElementById("HS2").value = -19;
    self['_highShelf']['gain'].value = -19;

    document.getElementById("LS1").value = 36;
    self['_lowShelf']['frequency'].value = 36;
    document.getElementById("LS2").value = 47;
    self['_lowShelf']['gain'].value = 47;

    document.getElementById("HP1").value = 1700;
    self['_highPass']['frequency'].value = 1700;
    document.getElementById("HP2").value = 3.6;
    self['_highPass']['Q'].value = 3.6;

    document.getElementById("LP1").value = 1090;
    self['_lowPass']['frequency'].value = 1090;
    document.getElementById("LP2").value = 8.6;
    self['_lowPass']['Q'].value = 8.6;
  }
  _applyPopEffect(self){
    self._currEffect = 'Pop';
    document.getElementById("HS1").value = 13000;
    self['_highShelf']['frequency'].value = 13000;
    document.getElementById("HS2").value = 50;
    self['_highShelf']['gain'].value = 50;

    document.getElementById("LS1").value = 114;
    self['_lowShelf']['frequency'].value = 114;
    document.getElementById("LS2").value = 50;
    self['_lowShelf']['gain'].value = 50;

    document.getElementById("HP1").value = 3000;
    self['_highPass']['frequency'].value = 3000;
    document.getElementById("HP2").value = 4.5;
    self['_highPass']['Q'].value = 4.5;

    document.getElementById("LP1").value = 880;
    self['_lowPass']['frequency'].value = 880;
    document.getElementById("LP2").value = 2.8;
    self['_lowPass']['Q'].value = 2.8;
  }
  _applyRockEffect(self){
    self._currEffect = 'Rock';
    document.getElementById("HS1").value = 9100;
    self['_highShelf']['frequency'].value = 9100;
    document.getElementById("HS2").value = 50;
    self['_highShelf']['gain'].value = 50;

    document.getElementById("LS1").value = 202;
    self['_lowShelf']['frequency'].value = 202;
    document.getElementById("LS2").value = 25;
    self['_lowShelf']['gain'].value = 25;

    document.getElementById("HP1").value = 2300;
    self['_highPass']['frequency'].value = 2300;
    document.getElementById("HP2").value = 3.3;
    self['_highPass']['Q'].value = 3.3;

    document.getElementById("LP1").value = 1400;
    self['_lowPass']['frequency'].value = 1400;
    document.getElementById("LP2").value = 0.7;
    self['_lowPass']['Q'].value = 0.7;
  }
}
