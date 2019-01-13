const publicPlaylistLengthLimit = 300;
var PublicPlaylistPage = null;
var publicPlaylistLength = 0;
var publicPlaylist = new Array(publicPlaylistLengthLimit);
var publicPlaylistTitles = new Array(publicPlaylistLengthLimit);
var publicPlaylistCurr = 0;
var publicPlaylistActive = false;

function playPublicPlaylist(index){
    if( index >= 0 && index < publicPlaylistLength ){
      document.getElementById('PL' + publicPlaylistCurr).style.background = '#38393d';
      publicPlaylistCurr = index;
      document.getElementById('PL' + publicPlaylistCurr).style.background = '#7c7c7a';//#6a6b70';
      publicPlaylistActive = true;
      playTrack(publicPlaylist[index],publicPlaylistTitles[index]);
  }
}
function loadPublicPlaylist(playlistId, playlistTitle)
{
  if(PublicPlaylistPage == null){
    playlistResults.innerHTML = '<div class="resultsLoading">Loading...</div>';
    document.getElementById('playlistNameDiv').innerHTML = "";
    publicPlaylistLength = 0;
  }
  try{
      var request = gapi.client.youtube.playlistItems.list({
        playlistId: playlistId,
        part: 'snippet',
        maxResults: 50,
        pageToken: PublicPlaylistPage,
        fields: 'items(id,snippet(resourceId(videoId),title,thumbnails(default))),nextPageToken'
      });
      request.execute(function(response) {
        //var str = JSON.stringify(response);
        if(PublicPlaylistPage == null){
          playlistResults.innerHTML = "";
        }
        if(response.items){
          showPublicPlaylist(response);
        }else{
          showError(results,'Error Loading');
          return;
        }
        if(response.nextPageToken && publicPlaylistLength < (publicPlaylistLengthLimit - 1)){
          PublicPlaylistPage = response.nextPageToken;
          loadPublicPlaylist(playlistId, playlistTitle);
        }else{
          PublicPlaylistPage = null;
          if(publicPlaylistLength > 0){
            let listName = '<p class="listNameStyle">Playlist: ' + playlistTitle;
            listName += ' (Items: ' + publicPlaylistLength + ')</p>';
            document.getElementById('playlistNameDiv').innerHTML = listName;
            addPublicPlaylistEvents();
            playPublicPlaylist(0);
          }
        }
      },
      function(reason) {
          showError(playlistResults,'Error: ' + reason.result.error.message);
        });
  }catch(err){
    console.log(err);
  }
}
function showPublicPlaylist(response){
  response.items.forEach(function(item){
    if(item.snippet.thumbnails && item.snippet.resourceId){
      var title = item.snippet.title.replace(/[^a-zA-Z0-9 ]/g, "");
      title = title.trim();
      var contents = '<div id="PL'+ publicPlaylistLength + '"  style="background:#38393d;margin-top:5px;">';
      contents += '<table><tr><td rowspan="2"> <img style="width:70px;height:50px;" src="'+ item.snippet.thumbnails.default.url+'"></td>';
      contents += '<td><a onclick="playPublicPlaylist(' + publicPlaylistLength + ')" href="#">'+ item.snippet.title +'</a></td></tr>';
      contents += '<tr><td id="PLHover'+ publicPlaylistLength + '" style="display:none;">';
     contents += '<a style="margin-left:10px;" class="youtubeLink" href="#" onClick="saveMp3('+"'" +item.snippet.resourceId.videoId+"','" +title+ "'" + ')">Download Mp3</a>';
     contents += '<a style="margin-left:10px;" class="youtubeLink" href="https://www.youtube.com/watch?v='+item.snippet.resourceId.videoId+'">';
     contents += 'open youtube page</a></td></tr>'
      //contents += '</table></div>';
      playlistResults.innerHTML += contents;
      publicPlaylist[publicPlaylistLength] = item.snippet.resourceId.videoId;
      publicPlaylistTitles[publicPlaylistLength] = title;
      publicPlaylistLength++;
    }
  });
}
function addPublicPlaylistEvents(){
  for(let i = 0; i < publicPlaylistLength; i++) {
    var div = document.getElementById('PL' + i);
    div.addEventListener('mouseover', function(){
      document.getElementById('PLHover' + i).style.display = 'block';
    });
    div.addEventListener('mouseout', function(){
      document.getElementById('PLHover' + i).style.display = 'none';
    });
  }
}
function goBackToResults(){
  publicPlaylistActive = false;
  document.getElementById("playListDiv").style.display = 'none';
  document.getElementById("ytSearchTab").style.display = 'flex';
}
