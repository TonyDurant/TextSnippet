var fs = require('fs');
var {app} = require('electron').remote;
var data = {};
const snippet_folder_path = path.join(app.getPath('userData'), 'Snippets');

function createSnippetFolder () {
  console.log(snippet_folder_path);
  console.log(app.getPath('userData'));
  if (fs.existsSync(snippet_folder_path)) {
    console.log("Folder Exists");
  } else {
    fs.mkdir(snippet_folder_path);
    console.log("Templates folder has been created");
  }
}

function createSnippetFile () {
  if (fs.existsSync(snippet_file_path)) {
    console.log("File Exists");
  } else {
    list = {"snippets": [{"id": Date.now(), "abb": "hmbf", "full_text": "I would appreciate if you could sort it out as soon as possible.", "author": "Anton Vinogradov"}]};
    var data = JSON.stringify(list, null, 2)
    fs.writeFileSync(snippet_file_path, data)
    console.log("Snippet file has been created");
    window.location.reload(true);
  }
}
