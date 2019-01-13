const trendingDiv = document.getElementById("trendingDiv");
const trendingTables = document.getElementsByClassName('trendingResultTables');
var trendingPageToken;
let trendingTotalResults;
let trendingResults = 0;

function addTredingEvents(){
  for(let i = 0; i < trendingTables.length; i++) {
    trendingTables[i].addEventListener('mouseover', function(){
      trendingTables[i].style.background = '#38393d';
      document.getElementById('t' + i).style.display = 'block';
    });
    trendingTables[i].addEventListener('mouseout', function(){
      trendingTables[i].style.background = '#282b30';
      document.getElementById('t' + i).style.display = 'none';
    });
  }
}

function trendingVideos(scroll) {
    var resultNum = 10;
    var pageNum = null;
  try{
      if(scroll){
        resultNum = 5;
        pageNum = trendingPageToken;
      }else{
        trendingResults = 0;
        trendingDiv.innerHTML = '<div class="resultsLoading">Loading...</div>';
      }
      var topic = document.getElementById("selectTrending").value;
      var request = gapi.client.youtube.search.list({
        chart: 'mostPopular',
        topicId: topic,
        part: 'snippet',
        maxResults: resultNum,
        type: 'video',
        pageToken: pageNum,
        fields: 'items(id,snippet(title,thumbnails(default))),nextPageToken'
      });

      request.execute(function(response) {
        if(!scroll){
          trendingTotalResults = 0;
          trendingDiv.innerHTML = "";
        }else{
          trendingTotalResults += 5;
        }
        if(response.items){
          trendingPageToken = response.nextPageToken;
          showTrendingResults(response);
          addTredingEvents();
        }else{
          showError(trendingDiv,'Error Loading');
        }
      },
      function(reason) {
          showError(trendingDiv,'Error: ' + reason.result.error.message);
        });
  }catch(err){
    console.log(err);
  }
//  return false;
};
function showTrendingResults(response){
  response.items.forEach(function(item){
    var title = item.snippet.title.replace(/[^a-zA-Z0-9 ]/g, "");
    title = title.trim();
    var contents = '<div class="trendingResultTables"><table><tr><td rowspan="2"> <img src="'+ item.snippet.thumbnails.default.url+'"></td>';
    contents += '<td valign="top"><a onclick="playTrending('+"'"+item.id.videoId+"','" + title + "'" + ')" href="#">'+ item.snippet.title +'</a></td></tr>';
    contents += '<tr><td id="t'+ trendingResults + '"style="display:none;">';
    contents += '<a class="youtubeLink" href="#" onClick="saveMp3('+"'" +item.id.videoId+"','" +title+ "'" + ')">Download Mp3</a>';
    contents += '&nbsp;<a class="youtubeLink" href="https://www.youtube.com/watch?v='+item.id.videoId+'">';
    contents += 'open youtube page</a></td></tr></table></div>';
    trendingDiv.innerHTML += contents;
    trendingResults++;
  })
}
function trendingScrolled(o)
{
    //visible height + pixel scrolled = total height
    if(o.offsetHeight + o.scrollTop == o.scrollHeight)
    {
      if(trendingTotalResults <= 200)
        trendingVideos(true);
    }
}
