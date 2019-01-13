//following code is for sound equalizer
var context = new (window.AudioContext || window.webkitAudioContext)();
var mediaElement = document.querySelector('audio');
var source = context.createMediaElementSource(mediaElement);
var highShelf = context.createBiquadFilter();
var lowShelf = context.createBiquadFilter();
var highPass = context.createBiquadFilter();
var lowPass = context.createBiquadFilter();
var currEffect = 'none';
var buttonArray = ['Boombox','Stereo','Classic','Jazz','Pop','Rock'];

source.connect(highShelf);
highShelf.connect(lowShelf);
lowShelf.connect(highPass);
highPass.connect(lowPass);
lowPass.connect(context.destination);

highShelf.type = "highshelf";
highShelf.frequency.value = 4700;
highShelf.gain.value = 50;

lowShelf.type = "lowshelf";
lowShelf.frequency.value = 35;
lowShelf.gain.value = 50;

highPass.type = "highpass";
highPass.frequency.value = 800;
highPass.Q.value = 0.7;

lowPass.type = "lowpass";
lowPass.frequency.value = 880;
lowPass.Q.value = 0.7;

var ranges = document.querySelectorAll('input[type=range]');
ranges.forEach(function(range){
  range.addEventListener('input', function() {
    eraseColor();
    currEffect = 'none';
    window[this.dataset.filter][this.dataset.param].value = this.value;
  });
});

//reset equalizer to default values
function reset(){
  currEffect = 'none';
  eraseColor();
  document.getElementById("HS1").value = 4700;
  window['highShelf']['frequency'].value = 4700;
  document.getElementById("HS2").value = 50;
  window['highShelf']['gain'].value = 50;

  document.getElementById("LS1").value = 35;
  window['lowShelf']['frequency'].value = 35;
  document.getElementById("LS2").value = 50;
  window['lowShelf']['gain'].value = 50;

  document.getElementById("HP1").value = 800;
  window['highPass']['frequency'].value = 800;
  document.getElementById("HP2").value = 0.7;
  window['highPass']['Q'].value = 0.7;

  document.getElementById("LP1").value = 880;
  window['lowPass']['frequency'].value = 880;
  document.getElementById("LP2").value = 0.7;
  window['lowPass']['Q'].value = 0.7;
}

function getEquilizerValues(){
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
function setEquilizerValues(data){
  let list = data.split(':');
  if(list.length == 8){
    document.getElementById("HS1").value = list[0];
    window['highShelf']['frequency'].value = list[0];
    document.getElementById("HS2").value = list[1];
    window['highShelf']['gain'].value = list[1];

    document.getElementById("LS1").value = list[2];
    window['lowShelf']['frequency'].value = list[2];
    document.getElementById("LS2").value = list[3];
    window['lowShelf']['gain'].value = list[3];

    document.getElementById("HP1").value = list[4];
    window['highPass']['frequency'].value = list[4];
    document.getElementById("HP2").value = list[5];
    window['highPass']['Q'].value = list[5];

    document.getElementById("LP1").value = list[6];
    window['lowPass']['frequency'].value = list[6];
    document.getElementById("LP2").value = list[7];
    window['lowPass']['Q'].value = list[7];
  }
}
function eraseColor(){
  let color = '-webkit-linear-gradient(top, #4f595e 5%, #000000 100%)';
  for(i = 0;i < buttonArray.length; i++){
    document.getElementById(buttonArray[i]).style.background = color;
  }
}

function setEffect(effect){
  eraseColor();
  currEffect = effect;
  document.getElementById(effect).style.background = '-webkit-linear-gradient(top, #f49b42 5%, #000000 100%)';
  if(effect === 'Boombox'){
    currEffect = 'Boombox';
    document.getElementById("HS1").value = 9300;
    window['highShelf']['frequency'].value = 9300;
    document.getElementById("HS2").value = 15;
    window['highShelf']['gain'].value = 15;

    document.getElementById("LS1").value = 162;
    window['lowShelf']['frequency'].value = 162;
    document.getElementById("LS2").value = 28;
    window['lowShelf']['gain'].value = 28;

    document.getElementById("HP1").value = 1700;
    window['highPass']['frequency'].value = 1700;
    document.getElementById("HP2").value = 0.7;
    window['highPass']['Q'].value = 0.7;

    document.getElementById("LP1").value = 410;
    window['lowPass']['frequency'].value = 410;
    document.getElementById("LP2").value = 0.7;
    window['lowPass']['Q'].value = 0.7;

  }else if(effect === 'Stereo'){
    currEffect = 'Stereo';
    document.getElementById("HS1").value = 5800;
    window['highShelf']['frequency'].value = 5800;
    document.getElementById("HS2").value = 7;
    window['highShelf']['gain'].value = 7;

    document.getElementById("LS1").value = 181;
    window['lowShelf']['frequency'].value = 181;
    document.getElementById("LS2").value = 39;
    window['lowShelf']['gain'].value = 39;

    document.getElementById("HP1").value = 2700;
    window['highPass']['frequency'].value = 2700;
    document.getElementById("HP2").value = 2.7;
    window['highPass']['Q'].value = 2.7;

    document.getElementById("LP1").value = 600;
    window['lowPass']['frequency'].value = 600;
    document.getElementById("LP2").value = 9.6;
    window['lowPass']['Q'].value = 9.6;
  }else if(effect === 'Classic'){
    currEffect = 'Classic';
    document.getElementById("HS1").value = 7100;
    window['highShelf']['frequency'].value = 7100;
    document.getElementById("HS2").value = 31;
    window['highShelf']['gain'].value = 31;

    document.getElementById("LS1").value = 65;
    window['lowShelf']['frequency'].value = 65;
    document.getElementById("LS2").value = 33;
    window['lowShelf']['gain'].value = 33;

    document.getElementById("HP1").value = 2700;
    window['highPass']['frequency'].value = 2700;
    document.getElementById("HP2").value = 7.2;
    window['highPass']['Q'].value = 7.2;

    document.getElementById("LP1").value = 400;
    window['lowPass']['frequency'].value = 400;
    document.getElementById("LP2").value = 3.3;
    window['lowPass']['Q'].value = 3.3;
  }else if(effect === 'Jazz'){
    currEffect = 'Jazz';
    document.getElementById("HS1").value = 18700;
    window['highShelf']['frequency'].value = 18700;
    document.getElementById("HS2").value = -19;
    window['highShelf']['gain'].value = -19;

    document.getElementById("LS1").value = 36;
    window['lowShelf']['frequency'].value = 36;
    document.getElementById("LS2").value = 47;
    window['lowShelf']['gain'].value = 47;

    document.getElementById("HP1").value = 1700;
    window['highPass']['frequency'].value = 1700;
    document.getElementById("HP2").value = 3.6;
    window['highPass']['Q'].value = 3.6;

    document.getElementById("LP1").value = 1090;
    window['lowPass']['frequency'].value = 1090;
    document.getElementById("LP2").value = 8.6;
    window['lowPass']['Q'].value = 8.6;
  }else if(effect === 'Pop'){
    currEffect = 'Pop';
    document.getElementById("HS1").value = 13000;
    window['highShelf']['frequency'].value = 13000;
    document.getElementById("HS2").value = 50;
    window['highShelf']['gain'].value = 50;

    document.getElementById("LS1").value = 114;
    window['lowShelf']['frequency'].value = 114;
    document.getElementById("LS2").value = 50;
    window['lowShelf']['gain'].value = 50;

    document.getElementById("HP1").value = 3000;
    window['highPass']['frequency'].value = 3000;
    document.getElementById("HP2").value = 4.5;
    window['highPass']['Q'].value = 4.5;

    document.getElementById("LP1").value = 880;
    window['lowPass']['frequency'].value = 880;
    document.getElementById("LP2").value = 2.8;
    window['lowPass']['Q'].value = 2.8;
  }else if(effect === 'Rock'){
    currEffect = 'Rock';
    document.getElementById("HS1").value = 9100;
    window['highShelf']['frequency'].value = 9100;
    document.getElementById("HS2").value = 50;
    window['highShelf']['gain'].value = 50;

    document.getElementById("LS1").value = 202;
    window['lowShelf']['frequency'].value = 202;
    document.getElementById("LS2").value = 25;
    window['lowShelf']['gain'].value = 25;

    document.getElementById("HP1").value = 2300;
    window['highPass']['frequency'].value = 2300;
    document.getElementById("HP2").value = 3.3;
    window['highPass']['Q'].value = 3.3;

    document.getElementById("LP1").value = 1400;
    window['lowPass']['frequency'].value = 1400;
    document.getElementById("LP2").value = 0.7;
    window['lowPass']['Q'].value = 0.7;
  }
}
function setButtonEvents(){
  for(j = 0;j < buttonArray.length; j++){
    let button = buttonArray[j];
    document.getElementById(button).addEventListener('mouseover', function(){
      if(currEffect != button)
      document.getElementById(button).style.background = '-webkit-linear-gradient(top, #f44242 5%, #000000 100%)';
    });
    document.getElementById(button).addEventListener('mouseout', function(){
      if(currEffect != button)
      document.getElementById(button).style.background = '-webkit-linear-gradient(top, #4f595e 5%, #000000 100%)';
    });
  }
}
