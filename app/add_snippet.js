var addSnippet
var ipc = require('electron').ipcRenderer
var fs = require('fs');

function addSnippet () {
  var abb = document.getElementById('abb_field').value
  var text_snippet = document.getElementById('text_snippet_field').value
  var author = document.getElementById('author_field').value

  var snippet = {
    "id":         Date.now(),
    "abb":        abb,
    "full_text":  text_snippet,
    "author":     author
  }

  var list = JSON.parse(fs.readFileSync(snippet_file_path, 'utf-8'));

  list['snippets'].push(snippet);

  fs.writeFileSync(snippet_file_path, JSON.stringify(list, null, 2));

  toggleAddSnippetPanel();
  window.location.reload(true);
}

var toggleAddSnippetPanel = function () {
  if (document.body.classList.contains('on-add-snippet')) {
    document.body.classList.remove('on-add-snippet')
    document.getElementById('js-add-snippet-panel').remove()
  } else {
    var panel = document.createElement('div')

    panel.classList.add('add-snippet-panel')
    panel.id = 'js-add-snippet-panel'

    var html = '<form>'
      html += '<div class="form-group">'
        html += '<label for="abb">Abbreviature</label>'
        html += '<input type="text" class="form-control" id="abb_field" placeholder="Abbreviature">'
      html += '</div>'
      html += '<div class="form-group">'
        html += '<label for="text snippet">Text Snippet</label>'
        html += '<input type="text" class="form-control" id="text_snippet_field" placeholder="Text Snippet">'
      html += '</div>'
      html += '<div class="form-group">'
        html += '<label for="author">Author</label>'
        html += '<input type="text" class="form-control" id="author_field" placeholder="Author">'
      html += '</div>'
      html += '<button type="submit" class="btn btn-default" onclick="addSnippet();">Add Snippet</button>'
      html += '<button type="cancel" class="btn btn-default" onclick="toggleAddSnippetPanel();">Cancel</button>'
    html += '</form>'

    panel.innerHTML += html
    document.body.classList.add('on-add-snippet')
    document.body.appendChild(panel)

    panel.getElementsByTagName('input')[0].focus()
  }
}
