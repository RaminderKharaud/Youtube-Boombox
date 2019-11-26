/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
class Generator{

  constructor(youtube_API_Key){

    this._Youtube_API_Key = youtube_API_Key;
  }

  generateAppCode(){

    let context = new (window.AudioContext || window.webkitAudioContext)();
    let filepath = path.join(__dirname,'Appdata/soundData.txt');

    const tabs = new TabsEvent();
    tabs.addEvents();

    const ytApi = new YoutubeAPI(this._Youtube_API_Key);
    ytApi.makeYoutubeAPIReady();

    const equalizer = new SoundEqualizer(context);

    const file = new File(filepath, equalizer);

    const titleBar = new TitleBar(file);
    titleBar.AddAllTittleBarButtonEvents();

    const soundVisualization = new SoundVisualization(equalizer.context, equalizer.source);

    const ytDownloader = new YoutubeDownloadAgent();

    const playerElements = new AudioPlayerElementsCollection();

    const winEvents = new WindowEvents(playerElements);
    winEvents.addAllEvents();

    const audioPlayer = new AudioPlayer(playerElements, soundVisualization, ytdl);

    const ytPlaylist = new YoutubePublicPlaylist(audioPlayer);

    const playerEvents = new AudioPlayerEvents(playerElements,winEvents,ytPlaylist);
    playerEvents.addAllEvents();

    audioPlayer.PlayerEvents = playerEvents;

    const ytTrending = new YoutubeTrending(audioPlayer, ytPlaylist);
    ytTrending.addAllEvents();

    const ytSearch = new YouTubeSearch(audioPlayer, ytPlaylist);
    ytSearch.addAllEvents();

    file.ReadFile();
    setTimeout(this._showAnimationBeforeLoadingApp.bind(null, ytTrending), 2000);

  }

  _showAnimationBeforeLoadingApp(ytTrending){

    document.getElementById('loaderDiv').style.display = 'none';
    document.getElementById('wrapperDiv').style.display = 'none';
    document.getElementById('loaderDiv').innerHTML = "";
    document.getElementById('tabs').style.display = 'flex';
    document.getElementById('trendingTab').style.display = 'flex';
    document.getElementById('playerDiv').style.position = 'none';
    ytTrending.showTredingVideos();
  }

}
