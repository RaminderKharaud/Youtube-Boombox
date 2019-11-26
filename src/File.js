/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Date: November, 2019
*/
class File{

  constructor(filepath, equalizer){
    this._filePath = filepath;
    this._equalizer = equalizer;

  }

  ReadFile(){
    let eq = this._equalizer;
    fs.readFile(this._filePath, 'utf8', function(err, contents) {
      if(contents && contents.trim().length > 0){
        if(contents.includes(':')){
          eq.setEquilizerValues(contents);
        }else{
          eq.setEffect(contents.trim());
        }
      }else if(err){
          console.log(err);
      }
  });
  }

  WriteFileAndCloseApp(win){
    let EquilizerData;
     if(this._equalizer.currEffect === 'none'){
       EquilizerData = this._equalizer.getEquilizerValues();
     }else{
       EquilizerData = this._equalizer.currEffect;
     }
    fs.writeFile(this._filePath, EquilizerData, (err) => {
      if(err)console.log(err);
      win.close();
    });
  }
}
