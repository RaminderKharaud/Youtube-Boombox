/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
class YoutubePublicPlaylist{

  constructor(audioPlayer){

    this._publicPlaylistLengthLimit = 300;
    this._PublicPlaylistPage = null;
    this._publicPlaylistLength = 0;
    this._publicPlaylist = new Array(this._publicPlaylistLengthLimit);
    this._publicPlaylistTitles = new Array(this._publicPlaylistLengthLimit);
    this._playlistName = document.getElementById('playlistNameDiv');
    this._playlistResults = document.getElementById('playlistResultsDiv');
    this._results = document.getElementById('resultsDiv');
    this._backButton = document.getElementById('backButton');
    this._publicPlaylistCurr = 0;
    this._publicPlaylistActive = false;
    this._player = audioPlayer;
    this._addButtonEvent();
  }

  get PublicPlaylistActive(){

    return this._publicPlaylistActive;
  }

  set PublicPlaylistActive(value){

    this._publicPlaylistActive = value;
  }

   get PublicPlaylistCurr(){

     return this._publicPlaylistCurr;
   }

   set PublicPlaylistCurr(value){

     this._publicPlaylistCurr = value;
   }

   get PublicPlaylistLength(){

     return this._publicPlaylistLength;
   }

   set PublicPlaylistLength(value){

     this._publicPlaylistLength = value;
   }

  _addButtonEvent(){
    this._backButton.self = this;
    this._backButton.addEventListener('click', this._goBackToResults);
  }

  PlayPublicPlaylist(event){

    let index,self;

    if(typeof event == 'number'){
      index = event;
      self = this;
    }else{
      index = event.currentTarget.data;
      self = event.currentTarget.self;
    };

    if( index >= 0 && index < self._publicPlaylistLength )
      self._playPlaylistTrack(self,index)
  }

  _playPlaylistTrack(self,index){

    document.getElementById('PL' + self._publicPlaylistCurr).style.background = '#38393d';
    self._publicPlaylistCurr = index;
    document.getElementById('PL' + self._publicPlaylistCurr).style.background = '#7c7c7a';//#6a6b70';
    self._publicPlaylistActive = true;
    self._player.playTrack(self._publicPlaylist[index],self._publicPlaylistTitles[index]);
  }

  _addPublicPlaylistEvents(self){

    for(let i = 0; i < self._publicPlaylistLength; i++) {

      let div = document.getElementById('PL' + i);

      div.addEventListener('mouseover', function(){
        document.getElementById('PLHover' + i).style.display = 'block';
      });

      div.addEventListener('mouseout', function(){
        document.getElementById('PLHover' + i).style.display = 'none';
      });
      self._addListItemEvent(self, i);
    }
  }

  _addListItemEvent(self, index){

    let id = 'listItem'+index;
    let link = document.getElementById(id);
    link.self = self;
    link.data = index;
    link.addEventListener('click', self.PlayPublicPlaylist);
  }

  _showPublicPlaylist(response, self){

    response.items.forEach(function(item){

      if(item.snippet.thumbnails && item.snippet.resourceId){
        let title = item.snippet.title.replace(/[^a-zA-Z0-9 ]/g, "");
        title = title.trim();
        self._playlistResults.innerHTML += self._getPlaylistResultsInnerContent(self,item,title);
        self._publicPlaylist[self._publicPlaylistLength] = item.snippet.resourceId.videoId;
        self._publicPlaylistTitles[self._publicPlaylistLength] = title;
        self._publicPlaylistLength++;
      }
    });
  }

  _goBackToResults(event){

    let self = event.currentTarget.self;
    self._publicPlaylistActive = false;
    document.getElementById("playListDiv").style.display = 'none';
    document.getElementById("ytSearchTab").style.display = 'flex';
  }

  _showError(element, text){

    element.innerHTML = '<div class="resultsLoading">'+ text + '</div>';
  }

  loadPublicPlaylist(playlistId, playlistTitle)
  {

    let publicPlaylistPage = this._publicPlaylistPage;
    let self = this;
    if(this._PublicPlaylistPage == null){
      this._playlistResults.innerHTML = '<div class="resultsLoading">Loading...</div>';
      this._playlistName.innerHTML = "";
      this._publicPlaylistLength = 0;
    }
    try{
        let request = self._getYoutubeRequest(playlistId, publicPlaylistPage);

        request.execute(function(response) {

          self._processResponse(self, response, playlistId, playlistTitle);
        },
        function(reason) {

          self._showError(self._playlistResults,'Error: ' + reason.result.error.message);
        });
    }catch(err){

      console.log(err);
    }
  }

  _processResponse(self, response, playlistId, playlistTitle){

    if(self._PublicPlaylistPage == null)
      self._playlistResults.innerHTML = "";

    if(response.items){
      self._showPublicPlaylist(response,self);
    }else{
      self._showError(self._results,'Error Loading');
      return;
    }
    if(response.nextPageToken && self._publicPlaylistLength < (self._publicPlaylistLengthLimit - 1)){
      self._PublicPlaylistPage = response.nextPageToken;
      self.loadPublicPlaylist(playlistId, playlistTitle);
    }else{
      self._PublicPlaylistPage = null;
      if(self._publicPlaylistLength > 0){
        let listName = '<p class="listNameStyle">Playlist: ' + playlistTitle;
        listName += ' (Items: ' + self._publicPlaylistLength + ')</p>';
        self._playlistName.innerHTML = listName;
        self._addPublicPlaylistEvents(self);
        self.PlayPublicPlaylist(0);
      }
    }
  }

  _getYoutubeRequest(playlistId, publicPlaylistPage){

    let request = gapi.client.youtube.playlistItems.list({
      playlistId: playlistId,
      part: 'snippet',
      maxResults: 50,
      pageToken: publicPlaylistPage,
      fields: 'items(id,snippet(resourceId(videoId),title,thumbnails(default))),nextPageToken'
    });
    return request;
  }
  _getPlaylistResultsInnerContent(self,item,title){

    let contents = '<div id="PL'+ self._publicPlaylistLength + '"  style="background:#38393d;margin-top:5px;">';
    contents += '<table><tr><td rowspan="2"> <img style="width:70px;height:50px;" src="'+ item.snippet.thumbnails.default.url+'"></td>';
    contents += '<td><a id="listItem'+self._publicPlaylistLength+'" href="#">'+ item.snippet.title +'</a></td></tr>';
    contents += '<tr><td id="PLHover'+ self._publicPlaylistLength + '" style="display:none;">';
    contents += '<a style="margin-left:10px;" class="youtubeLink" href="#" onClick="YoutubeDownloadAgent.saveMp3('+"'" +item.snippet.resourceId.videoId+"','" +title+ "'" + ')">Download Mp3</a>';
    contents += '<a style="margin-left:10px;" class="youtubeLink" href="https://www.youtube.com/watch?v='+item.snippet.resourceId.videoId+'">';
    contents += 'open youtube page</a></td></tr>'
    contents += '</table></div>';
    return contents;
  }
}
