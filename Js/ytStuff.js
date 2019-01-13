const results = document.getElementById('resultsDiv');
const playlistResults = document.getElementById('playlistResultsDiv');
const text = document.getElementById('txtSearch');
const resultTables = document.getElementsByClassName('resultTables');
const searchTypeSelect = document.getElementById("selectSearchType");
let resultCount = 0;
let totalResults = 0;
let searchForList = false;
var nextPageToken = "";
var query = "";

function addEvents(){
  for(let i = 0; i < resultTables.length; i++) {
    resultTables[i].addEventListener('mouseover', function(){
      resultTables[i].style.background = '#38393d';
      if(!searchForList)
        document.getElementById(i).style.display = 'block';
    });
    resultTables[i].addEventListener('mouseout', function(){
      resultTables[i].style.background = '#282b30';
      if(!searchForList)
        document.getElementById(i).style.display = 'none';
    });
  }
}
function getYouTubeReady(){
    let k = Math.floor(Math.random() * 24);
    gapi.client.setApiKey(ApiKeys[k].ApiKey);
    gapi.client.load("youtube", "v3", function() {});
}
let shell = require('electron').shell
document.addEventListener('click', function (event) {
  if (event.target.tagName === 'A' && event.target.href.startsWith('https')) {
    event.preventDefault();
    shell.openExternal(event.target.href);
  }
})
function search() {
  var type = 'video';
  if(searchTypeSelect.value == 'list'){
    searchForList = true;
    type = 'playlist';
  }else{
    searchForList = false;
  }
  try{
    resultCount = 0;
    totalResults = 0;
    if(text.value.trim().length > 0){
      results.innerHTML = '<div class="resultsLoading">Loading...</div>';
      query = encodeURIComponent(text.value.trim()).replace(/%20/g, "+");
      var request = gapi.client.youtube.search.list({
        q: query,
        part: 'snippet',
        maxResults: '10',
        type: type,
        order: 'relevance',
        fields: 'items(id,snippet(title,thumbnails(default))),nextPageToken'
      });

      request.execute(function(response) {
        //var str = JSON.stringify(response.result);
        results.innerHTML = "";
        resultCount = 0;
        totalResults = 10;

        if(response.items){
          nextPageToken = response.nextPageToken;
          showResults(response);
          addEvents();
        }else{
          showError(results,'Error Loading');
        }
      },
      function(reason) {
          showError(results,'Error: ' + reason.result.error.message);
        });
    }
  }catch(err){
    console.log(err);
  }
  return false;
}
function showResults(response){
  response.items.forEach(function(item){
    var title = item.snippet.title.replace(/[^a-zA-Z0-9 ]/g, "");
    title = title.trim();
    var itemId = searchForList? item.id.playlistId : item.id.videoId;
    var contents = '<div class="resultTables"><table><tr><td rowspan="2"> <img src="'+ item.snippet.thumbnails.default.url+'"></td>';
    contents += '<td valign="top"><a onclick="play('+"'"+itemId+"','" + title + "'" + ')" href="#">'+ item.snippet.title +'</a></td></tr>';

    if(!searchForList){
      contents += '<tr><td id="'+ resultCount + '"style="display:none;">';
      contents += '<a class="youtubeLink" href="#" onClick="saveMp3('+"'" +item.id.videoId+"','" +title+ "'" + ')">Download Mp3</a>&nbsp;';
      contents += '<a class="youtubeLink" href="https://www.youtube.com/watch?v='+item.id.videoId+'">';
      contents += 'open youtube page</a></td></tr>';
    }
    contents += '</table></div>';
    results.innerHTML += contents;
    resultCount++;
  })
}
function onScrollDown(){
  try{
      var request = gapi.client.youtube.search.list({
        q: query,
        part: 'snippet',
        maxResults: '5',
        order: 'relevance',
        type: 'video',
        pageToken: nextPageToken,
        fields: 'items(id,snippet(title,thumbnails(default))),nextPageToken'
      });
      request.execute(function(response) {
        //var str = JSON.stringify(response.result);
        totalResults += 5;
        nextPageToken = response.nextPageToken;
        showResults(response);
        addEvents();
      });
  }catch(err){
    console.log(err);
  }
}
function scrolled(o)
{
    //visible height + pixel scrolled = total height
    if(o.offsetHeight + o.scrollTop == o.scrollHeight)
    {
      if(totalResults <= 300)
        onScrollDown();
    }
}
function showError(element, text){
  element.innerHTML = '<div class="resultsLoading">'+ text + '</div>';
}

function downloader(){
  let url = document.getElementById('txtLink').value.trim();
  if(url.length > 0){
    if(ytdl.validateURL(url)){
      document.getElementById('errorMessage').innerHTML = "";
      let id = ytdl.getVideoID(url);
      let title;
      ytdl.getInfo(id, (err, info) => {
        if (err){
          title = 'track_' + id;
          saveMp3(id, title);
        }else{
          title = info.title;
          title = title.replace(/[^a-zA-Z0-9 ]/g, "");
          title = title.trim();
          saveMp3(id, title);
        }
      });
    }else{
      document.getElementById('errorMessage').innerHTML = "Invalid Url: Youtube video link that you provided is not valid";
    }
  }
  return false;
}
