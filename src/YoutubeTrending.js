/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
class YoutubeTrending{

  constructor(audioPlayer, youtubePlaylist){
    this._player = audioPlayer;
    this._ytPlaylist = youtubePlaylist;
    this._trendingDiv = document.getElementById("trendingDiv");
    this._trendingTables = document.getElementsByClassName('trendingResultTables');
    this._trendingPageToken;
    this._trendingTotalResults;
    this._trendingResults = 0;
    this._selectedTopic = document.getElementById("selectTrending");
    this._titleList = [];
    this._idList = [];
  }

  addAllEvents(){
    this._selectedTopic.self = this;
    this._selectedTopic.scrolled = false;
    this._trendingDiv.self = this;
    this._trendingDiv.self.scrolled = false;
    this._selectedTopic.addEventListener('change', this._getTrendingVideos);
    this._trendingDiv.addEventListener('scroll', this._whenScrolledDown);
  }

  showTredingVideos(){

    this._getTrendingVideos(false);
  }

  _getTrendingVideos(event) {

      let resultNum = 10;
      let pageNum = null;
      let self = this;
      let scrolled = false;
      let topic, request;

      if(event){
       self = event.currentTarget.self;
       scrolled = event.currentTarget.scrolled;
      }

    try{
        if(scrolled === true){
          resultNum = 5;
          pageNum = self._trendingPageToken;
        }else{
          self._trendingResults = 0;
          self._trendingDiv.innerHTML = '<div class="resultsLoading">Loading...</div>';
        }

        topic = self._selectedTopic.value;
        request = self._getYoutubeRequest(topic,resultNum,pageNum);

        request.execute(function(response) {
          self._processResponse(response,self,scrolled);
        },
        function(reason) {
            self._showError(self._trendingDiv,'Error: ' + reason.result.error.message);
          });
    }catch(err){
      console.log(err);
    }
  //  return false;
  };

  _processResponse(response,self,scrolled){

    if(scrolled === true){
      self._trendingTotalResults += 5;
    }else{
      self._trendingTotalResults = 0;
      self._trendingDiv.innerHTML = "";
      self._titleList = [];
      self._idList = [];
    }
    if(response.items){
      self._trendingPageToken = response.nextPageToken;
      self._showTrendingResults(response, self);
      self._addTredingEvents(self);
    }else{
      self._showError(self._trendingDiv,'Error Loading');
    }
  }

  _getYoutubeRequest(topic,resultNum,pageNum){

    let request = gapi.client.youtube.search.list({
      chart: 'mostPopular',
      topicId: topic,
      part: 'snippet',
      maxResults: resultNum,
      type: 'video',
      pageToken: pageNum,
      fields: 'items(id,snippet(title,thumbnails(default))),nextPageToken'
    });
    return request;
  }

  _showTrendingResults(response, self){

    response.items.forEach(function(item){
      let title = item.snippet.title.replace(/[^a-zA-Z0-9 ]/g, "");
      title = title.trim();
      self._titleList.push(title);
      self._idList.push(item.id.videoId);
      let contents = '<div class="trendingResultTables"><table><tr><td rowspan="2"> <img src="'+ item.snippet.thumbnails.default.url+'"></td>';
      contents += '<td valign="top"><a id="trendingTrack'+ self._trendingResults + '" href="#">'+ item.snippet.title +'</a></td></tr>';
      contents += '<tr><td id="t'+ self._trendingResults + '"style="display:none;">';
      contents += '<a class="youtubeLink" href="#" onClick="YoutubeDownloadAgent.saveMp3('+"'" +item.id.videoId+"','" +title+ "'" + ')">Download Mp3</a>';
      contents += '&nbsp;<a class="youtubeLink" href="https://www.youtube.com/watch?v='+item.id.videoId+'">';
      contents += 'open youtube page</a></td></tr></table></div>';
      self._trendingDiv.innerHTML += contents;
      self._trendingResults++;
    })
  }

  _addTredingEvents(self){

    for(let i = 0; i < self._trendingTables.length; i++) {
      self._trendingTables[i].addEventListener('mouseover', function(){
        self._trendingTables[i].style.background = '#38393d';
        document.getElementById('t' + i).style.display = 'block';
      });
      self._trendingTables[i].addEventListener('mouseout', function(){
        self._trendingTables[i].style.background = '#282b30';
        document.getElementById('t' + i).style.display = 'none';
      });
      let id = 'trendingTrack' + i;
      let trackLink = document.getElementById(id);
      trackLink.title = self._titleList[i];
      trackLink.videoId = self._idList[i];
      trackLink.self = self;
      trackLink.addEventListener('click', this._beforePlay);
    }
  }

  _beforePlay(event){

    let self = event.currentTarget.self;
    let title = event.currentTarget.title;
    let videoId = event.currentTarget.videoId;
    self._ytPlaylist.PublicPlaylistActive = false;
    self._player.playTrack(videoId, title);
  }

  _whenScrolledDown(event)
  {
      let self = event.currentTarget.self;
      let o = event.currentTarget;
      //visible height + pixel scrolled = total height
      if(o.offsetHeight + o.scrollTop == o.scrollHeight)
      {
        if(self._trendingTotalResults <= 200)
          event.currentTarget.scrolled = true;
          self._getTrendingVideos(event);
      }
  }

  _showError(element, text){
    element.innerHTML = '<div class="resultsLoading">'+ text + '</div>';
  }
}
