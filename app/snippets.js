var fs = require('fs');
var {app} = require('electron').remote;
const path = require('path');
const snippet_folder_path = path.join(app.getPath('userData'), 'Snippets');

function createUserTemplateFolder () {
  console.log(snippet_folder_path);
  console.log(app.getPath('userData'));
  if (fs.existsSync(snippet_folder_path)) {
    console.log("Folder Exists");
  } else {
    fs.mkdir(snippet_folder_path);
    console.log("Templates folder has been created");
  }
}
