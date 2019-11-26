/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
class YouTubeSearch{

  constructor(audioPlayer, youtubePlaylist){

    this._player = audioPlayer;
    this._ytPlaylist = youtubePlaylist;
    this._results = document.getElementById("resultsDiv");
    this._playlistResults = document.getElementById('playlistResultsDiv');
    this._text = document.getElementById('txtSearch');
    this._resultTables = document.getElementsByClassName('resultTables');
    this._searchTypeSelect = document.getElementById("selectSearchType");
    this._searchForm = document.getElementById('searchForm');
    this._resultCount = 0;
    this._totalResults = 0;
    this._searchForList = false;
    this._nextPageToken = "";
    this._query = "";
    this._titleList = [];
    this._idList = [];
  }

  addAllEvents(){

    this._addScrollerEvent();
    this._addSearchFormEvent();
  }

  _addSearchFormEvent(){

    this._searchForm.self = this;
    this._searchForm.addEventListener('submit', this._search);
  }

  _addScrollerEvent(){

    this._results.self = this;
    this._results.addEventListener('scroll', this._whenScrolledDown);
  }

  _search(event) {

    event.preventDefault();
    let self = event.currentTarget.self;
    let type = 'video';
    if(self._searchTypeSelect.value == 'list'){
      self._searchForList = true;
      type = 'playlist';
    }else{
      self._searchForList = false;
    }
    try{
      if(self._text.value.trim().length > 0){
        self._resultCount = 0;
        self._totalResults = 0;
        self._titleList = [];
        self._idList = [];

        let request = self._getSearchRequest(self, type);

        request.execute(function(response) {
            self._processSearchResponse(self, response);
          },
          function(reason) {
              self._showError(self._results,'Error: ' + reason.result.error.message);
        });
      }
    }catch(err){
      console.log(err);
    }
    return false;
  }

  _getSearchRequest(self, type){

    self._results.innerHTML = '<div class="resultsLoading">Loading...</div>';
    self._query = encodeURIComponent(self._text.value.trim()).replace(/%20/g, "+");
    let request = gapi.client.youtube.search.list({
      q: self._query,
      part: 'snippet',
      maxResults: '10',
      type: type,
      order: 'relevance',
      fields: 'items(id,snippet(title,thumbnails(default))),nextPageToken'
    });
    return request;
  }

  _processSearchResponse(self, response){
    self._results.innerHTML = "";
    self._resultCount = 0;
    self._totalResults = 10;

    if(response.items){
      self._nextPageToken = response.nextPageToken;
      self._showResults(response);
      self._addEvents();
    }else{
      self._showError(self._results,'Error Loading');
    }
  }

  _whenScrolledDown(event){
    let o = event.currentTarget;
    let self = event.currentTarget.self;
      //visible height + pixel scrolled = total height
      if(o.offsetHeight + o.scrollTop == o.scrollHeight)
      {
        if(self._totalResults <= 300)
          self._getNextSetOfResults();
      }
  }

  _getNextSetOfResults(){
    let self = this;
    try{
        let request = gapi.client.youtube.search.list({
          q: self._query,
          part: 'snippet',
          maxResults: '5',
          order: 'relevance',
          type: 'video',
          pageToken: self._nextPageToken,
          fields: 'items(id,snippet(title,thumbnails(default))),nextPageToken'
        });
        request.execute(function(response) {
          //var str = JSON.stringify(response.result);
          self._totalResults += 5;
          self._nextPageToken = response.nextPageToken;
          self._showResults(response);
          self._addEvents();
        });
    }catch(err){
      console.log(err);
    }
  }

  _showResults(response){
    let self = this;
    response.items.forEach(function(item){

      let title = item.snippet.title.replace(/[^a-zA-Z0-9 ]/g, "");
      title = title.trim();
      let itemId = self._searchForList? item.id.playlistId : item.id.videoId;
      self._titleList.push(title);
      self._idList.push(itemId);
      self._results.innerHTML += self._getInnerContent(self,item,title);
      self._resultCount++;
    })
  }

  _addEvents(){

    let self = this;
    for(let i = 0; i < this._resultTables.length; i++) {

      this._resultTables[i].addEventListener('mouseover', function(){
        self._resultTables[i].style.background = '#38393d';
        if(!self._searchForList)
          document.getElementById(i).style.display = 'block';
      });

      this._resultTables[i].addEventListener('mouseout', function(){
        self._resultTables[i].style.background = '#282b30';
        if(!self._searchForList)
          document.getElementById(i).style.display = 'none';
      });
      let id = 'track' + i;
      let trackLink = document.getElementById(id);
      trackLink.title = this._titleList[i];
      trackLink.videoId = this._idList[i];
      trackLink.self = this;
      trackLink.addEventListener('click', this._beforePlay);
    }
  }

  _beforePlay(event){
    let self = event.currentTarget.self;
    let title = event.currentTarget.title;
    let videoId = event.currentTarget.videoId;
    self._ytPlaylist.PublicPlaylistActive = false;

    if(self._searchForList){
      document.getElementById("playListDiv").style.display = 'flex';
      document.getElementById("ytSearchTab").style.display = 'none';
      self._ytPlaylist.loadPublicPlaylist(videoId, title);
    }else{
      self._player.playTrack(videoId, title);
    }
  }

  _getInnerContent(self,item,title){

    let contents = '<div class="resultTables"><table><tr><td rowspan="2"> <img src="'+ item.snippet.thumbnails.default.url+'"></td>';
    contents += '<td valign="top"><a id="track'+ self._resultCount + '" href="#">'+ item.snippet.title +'</a></td></tr>';

    if(!self._searchForList){
      contents += '<tr><td id="'+ self._resultCount + '"style="display:none;">';
      contents += '<a class="youtubeLink" href="#" onClick="YoutubeDownloadAgent.saveMp3('+"'" +item.id.videoId+"','" +title+ "'" + ')">Download Mp3</a>&nbsp;';
      contents += '<a class="youtubeLink" href="https://www.youtube.com/watch?v='+item.id.videoId+'">';
      contents += 'open youtube page</a></td></tr>';
    }
    contents += '</table></div>';
    return contents;
  }

  _showError(element, text){

    element.innerHTML = '<div class="resultsLoading">'+ text + '</div>';
  }
}
