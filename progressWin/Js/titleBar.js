/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
(function () {

     function init() {

       let window = remote.getCurrentWindow();
        const minButton = document.getElementById('min-button'),
            closeButton = document.getElementById('close-button');

        minButton.addEventListener("click", event => {
            window = remote.getCurrentWindow();
            window.minimize();
        });

        closeButton.addEventListener("click", event => {
            closeWin();
        });

     };
     document.onreadystatechange = function () {
          if (document.readyState == "complete") {
               init();
          }
     };

})();
