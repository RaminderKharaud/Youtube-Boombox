/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
class SoundVisualization{

  constructor(context, source){

    this._canvas = document.getElementById("canvas");
    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;
    this._WIDTH = this._canvas.width;
    this._HEIGHT = this._canvas.height;
    this._analyser;
    this._barCounter;
    this._dataArray;
    this._ctx;
    this._barHeight;
    this._barWidth;
    this._bufferLength;
    this._context = context;
    this._mediaElement = document.querySelector('audio');
    this._source = source;
    this.ramy = 'sss';
  }

  visualization(audio){
    window.visuals = this;
    this._analyser = this._context.createAnalyser();
    this._ctx = this._canvas.getContext("2d");

    this._source.connect(this._analyser);
    this._analyser.connect(this._context.destination);

    this._analyser.fftSize = 256;

    this._bufferLength = this._analyser.frequencyBinCount;

    this._dataArray = new Uint8Array(this._bufferLength);

    this._barWidth = (this._WIDTH / this._bufferLength) * 2.5;
    this._barCounter = 0;
    this._renderFrame();
  }

  _renderFrame(){
    let self = window['visuals'];
    requestAnimationFrame(self._renderFrame);

    self._barCounter = 0;

    self._analyser.getByteFrequencyData(self._dataArray);

    self._ctx.fillStyle = "#282b30";
    self._ctx.fillRect(0, 0, self._WIDTH, self._HEIGHT);

    for (let i = 0; i < self._bufferLength; i++) {
      self._barHeight = self._dataArray[i];

      let r = self._barHeight + (25 * (i/self._bufferLength));
      let g = 250 * (i/self._bufferLength);
      let b = 50;

      self._ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
      self._ctx.fillRect(self._barCounter, self._HEIGHT - self._barHeight - 100, self._barWidth, self._barHeight + 100);

      self._barCounter += self._barWidth + 1;
    }
  }
}
