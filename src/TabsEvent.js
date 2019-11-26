/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
class TabsEvent{

  constructor(){

    this._tabs = document.getElementsByClassName("tablinks");

  }
  addEvents(){

    for(let i = 0; i < this._tabs.length; i++) {
      this._tabs[i].addEventListener('click', this._openTab);
      this._tabs[i].self = this;
    }
  }
  _openTab(event){

    let i, tabcontent;
    let tabName = event.currentTarget.id;
    let self = event.currentTarget.self;
    tabName = tabName.substring(0, tabName.length - 3);

    document.getElementById("youtubeTab").style.display = "none";
    document.getElementById("equilizerTab").style.display = "none";
    document.getElementById("downloaderTab").style.display = "none";
    document.getElementById("trendingTab").style.display = "none";

    // Get all elements with class="tablinks" and remove the class "active"
    for (i = 0; i < self._tabs.length; i++) {
        self._tabs[i].className = self._tabs[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "flex";
    event.currentTarget.className += " active";
  }
}
