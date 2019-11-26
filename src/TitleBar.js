/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
class TitleBar{
  constructor(file){
    this._file = file;
    this._window = remote.getCurrentWindow();
    this._minButton = document.getElementById('min-button');
    this._maxButton = document.getElementById('max-button');
    this._restoreButton = document.getElementById('restore-button');
    this._closeButton = document.getElementById('close-button');
  }
  AddAllTittleBarButtonEvents(){
    this.ToggleMaxRestoreButtons();
    this._window.on('maximize', this.ToggleMaxRestoreButtons);
    this._window.on('unmaximize', this.ToggleMaxRestoreButtons);
    this.AddMinButtonEvents();
    this.AddMaxButtonEvents();
    this.AddRestoreButtonEvents();
    this.AddCloseButtonEvents();
  }
  AddMinButtonEvents(){
    let win = this._window;
    this._minButton.addEventListener("click", event => {
        win.minimize();
    });
  }
  AddMaxButtonEvents(){
    let self = this;
    let win = this._window;
    this._maxButton.addEventListener("click", event => {
        win.maximize();
        self.ToggleMaxRestoreButtons();
    });
  }
  AddRestoreButtonEvents(){
    let self = this;
    let win = this._window;
    this._restoreButton.addEventListener("click", event => {
        win.unmaximize();
        self.ToggleMaxRestoreButtons();
    });
  }

  ToggleMaxRestoreButtons() {

    let win = remote.getCurrentWindow();
    if (win.isMaximized()) {
        document.getElementById('max-button').style.display = "none";
        document.getElementById('restore-button').style.display = "flex";
    } else {
        document.getElementById('restore-button').style.display = "none";
        document.getElementById('max-button').style.display = "flex";
    }
  }

  AddCloseButtonEvents(){
    let self = this;
    this._closeButton.addEventListener("click", event => {
    self._file.WriteFileAndCloseApp(self._window);
    });
  }
}
