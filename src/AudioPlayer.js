/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
class AudioPlayer{

  constructor(audioPlayerElements, soundVisual, ytdl)
  {

    this._playerElements = audioPlayerElements;
    this._soundVisualization = soundVisual;
    this._playerEvents;
    this._ytdl = ytdl;
  }

  set PlayerEvents(player){

    this._playerEvents = player;
  }

  playTrack(videoId, title){

    this._makePlayerReady();

    try {
        this._ytdl.getInfo(videoId, (err, info) => {
        if (err) throw err;
        let audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
        if (audioFormat) {
             this._playerElements.Player.src = audioFormat.url;
             this._playerElements.Player.load();
             this._setupYoutubeLinks(videoId, title);

             let promise = this._playerElements.Player.play();
             if (promise !== undefined) {
                promise.then(_ => {
                  this._trackIsGoingToPlay(title)
                }).catch(error => {
                  this._trackIsNotGoingToPlay(error)
                });
            }
        }
     });
    }
    catch(err)
    {
     console.log(err);
    }
  }

  _makePlayerReady(){

    this._playerElements.PlayPauseButton.style.display = 'none';
    this._playerElements.LoadingElement.style.display = 'block';
    if(!this._playerElements.Player.paused && this._playerElements.Player.src.trim().length > 0)this._playerElements.Player.pause();
  }

  _setupYoutubeLinks(videoId, title){

    let htm = '<a style="color:hotpink;margin-right:10px;" class="youtubeLink"';
    htm += 'href="#" onClick="saveMp3('+"'" +videoId+"','" +title+ "'" + ')">Download Mp3</a>';
    htm += '<a style="color: yellow;" class="youtubeLink"';
    htm += 'href="https://www.youtube.com/watch?v='+ videoId + '">open youtube Page</a>';
    document.getElementById('ytLink').innerHTML = htm;
  }

  _trackIsGoingToPlay(title){

    this._playerEvents.errorPlaying = false;
    this._playerElements.PlayPauseButtonImage.src = path.join(__dirname,'images/Pause-Button.png');
    document.getElementById('PlayingInfo').style.display = 'block';
    document.getElementById('titleBar').innerHTML = title;
    this._soundVisualization.visualization(this._playerElements.Player);

  }

  _trackIsNotGoingToPlay(error){

    this._playerEvents.errorPlaying = true;
    this._playerEvents.makePlay();
    this._playerElements.PlayPauseButtonImage.src = path.join(__dirname,'images/Play-Button.png');
    document.getElementById('PlayingInfo').style.display = 'block';
    document.getElementById('titleBar').innerHTML ='<font color="red">error: ' + error+ '</font>';
  }
}
