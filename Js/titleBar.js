const remote = require('electron').remote;
//(function () {
 function init() {
   let window = remote.getCurrentWindow();
    const minButton = document.getElementById('min-button'),
        maxButton = document.getElementById('max-button'),
        restoreButton = document.getElementById('restore-button'),
        closeButton = document.getElementById('close-button');

    minButton.addEventListener("click", event => {
        window = remote.getCurrentWindow();
        window.minimize();
    });

    maxButton.addEventListener("click", event => {
        window = remote.getCurrentWindow();
        window.maximize();
        toggleMaxRestoreButtons();
    });

    restoreButton.addEventListener("click", event => {
        window = remote.getCurrentWindow();
        window.unmaximize();
        toggleMaxRestoreButtons();
    });

    // Toggle maximise/restore buttons when maximisation/unmaximisation
    // occurs by means other than button clicks e.g. double-clicking
    // the title bar:
    toggleMaxRestoreButtons();
    window.on('maximize', toggleMaxRestoreButtons);
    window.on('unmaximize', toggleMaxRestoreButtons);

    closeButton.addEventListener("click", event => {
        writeFile();
      //  window = remote.getCurrentWindow();
      //  window.close();
    });

    function toggleMaxRestoreButtons() {
        window = remote.getCurrentWindow();
        if (window.isMaximized()) {
            maxButton.style.display = "none";
            restoreButton.style.display = "flex";
        } else {
            restoreButton.style.display = "none";
            maxButton.style.display = "flex";
        }
    }
 };

 document.onreadystatechange = function () {
      if (document.readyState == "complete") {
          init();
          getYouTubeReady();
      }
 };
window.onload = function(){
  readFile();
  setButtonEvents();
  setTimeout(DisplayApp, 2000);
}

function writeFile(){
  let EquilizerData;
   if(currEffect === 'none'){
     EquilizerData = getEquilizerValues();
   }else{
     EquilizerData = currEffect;
   }
  let filePath = path.join(__dirname,'Appdata/soundData.txt');
  fs.writeFile(filePath, EquilizerData, (err) => {
  //  if(err)console.log(err);
  //  console.log('Lyric saved!');
    window = remote.getCurrentWindow();
    window.close();
  });
}
function readFile(){
  let filePath = path.join(__dirname,'Appdata/soundData.txt');
  fs.readFile(filePath, 'utf8', function(err, contents) {
    
    if(contents && contents.trim().length > 0){
      if(contents.includes(':')){
        setEquilizerValues(contents);
      }else{
        setEffect(contents.trim());
      }
    }else if(err){
      //  console.log(err);
      }
});
}

//})();
function DisplayApp(){
  document.getElementById('loaderDiv').style.display = 'none';
  document.getElementById('wrapperDiv').style.display = 'none';
  document.getElementById('loaderDiv').innerHTML = "";
  document.getElementById('tabs').style.display = 'flex';
  document.getElementById('trendingTab').style.display = 'flex';
  document.getElementById('playerDiv').style.position = 'none';
  trendingVideos();
}
