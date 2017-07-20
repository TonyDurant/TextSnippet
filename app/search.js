window.onload = function() {
  createSnippetFolder();
  createSnippetFile();
}

var clipboard = require('electron').clipboard
var ipc = require('electron').ipcRenderer
var searching = false
var searchInput = document.querySelector('.js-search')
var searchResults = document.querySelector('.js-results')
var directions = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
}
var Fuse = require('fuse.js')

var fs = require('fs');
const path = require('path');
var {app} = require('electron').remote;
const snippet_file_path = path.join(app.getPath('userData'), 'Snippets', 'snippets.json');
var list = JSON.parse(fs.readFileSync(snippet_file_path, 'utf-8'));

var options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "abb",
    "full_text",
    "author"
]
};

var fuse = new Fuse(list.snippets, options); // "list" is the item array

searchInput.dataset.isSearchInput = true
searchInput.focus()
// search('')
searchInput.addEventListener('keyup', function () {
  var result = fuse.search(searchInput.value);
  console.log(result);
  populateResults(result);
})

ipc.on('show', function (event, message) {
  searchInput.focus()
})

function populateResults (result) {
  var text_snippet = document.createElement('div')
  for (var i = 0; i < result.length; i++) {
    var html = '<a href="#" class="list-group-item" onclick="copyFocusedText(' + result[i].id + ');" >'
    // html += '<input type="checkbox" id="' + key + '"' + (preference[key] ? 'checked' : '') + '>'
    html += '<h5 class="list-group-item-heading">' + result[i].abb + '</h5>'
    html += '<p class="list-group-item-text">' + result[i].full_text + '</p>'
    html += '</a>'
    text_snippet.innerHTML += html
    //add_line_item_price_addon.onclick = function(){ alert('blah'); };
  }
  searchResults.innerHTML = text_snippet.innerHTML
}

function copyFocusedText (id, copyText) {
  var data
  console.log(list.snippets.filter(function(snippet){return snippet.id == id;})[0].full_text)
  // on enter: copy data and exit
  if (copyText) {
    data = list.snippets.filter(function(snippet){return snippet.id == id;})[0].full_text
  } else {
    data = list.snippets.filter(function(snippet){return snippet.id == id;})[0].full_text
  }
  clipboard.writeText(data)
  searchInput.value = ''
  // search('')
  ipc.send('abort')
}

document.addEventListener('keydown', function (evt) {
  var onSearchField = !!evt.target.dataset.isSearchInput
  if (onSearchField) {
    if (evt.keyCode === 40) {
      // on down: focus on the first thing!
      jumpto('up')
      evt.preventDefault()
    } else if (evt.keyCode === 13) {
      copyFocusedEmoji(document.querySelector('.emoji:first-child'), evt.shiftKey)
    }
  } else if (evt.target.classList.contains('emoji')) {
    if (evt.keyCode === 32) {
      if (evt.shiftKey) {
        jumpto('prev')
      } else {
        jumpto('next')
      }
    } else if (evt.keyCode === 13) {
      copyFocusedEmoji(evt.target, evt.shiftKey)
    } else if (Object.keys(directions).indexOf(evt.keyCode.toString()) >= 0) {
      // on navigation, navigate
      jumpto(directions[evt.keyCode])
    }
  }

  if (!onSearchField && evt.keyCode === 191 && !evt.shiftKey && !evt.metaKey && !evt.ctrlKey) {
    // on `/`: focus on the search field
    searchInput.select()
    evt.preventDefault()
  } else if (evt.keyCode === 27) {
    // on escape: exit
    ipc.send('abort')
  }
})

// searchInput.dataset.isSearchInput = true
// searchInput.focus()
// search('')
// searchInput.addEventListener('input', function () {
//   search(this.value.toLowerCase())
// })
//
// ipc.on('show', function (event, message) {
//   searchInput.focus()
// })

// searchInput.dataset.isSearchInput = true
// searchInput.focus()
// search('')
// searchInput.addEventListener('input', function () {
//   search(this.value.toLowerCase())
// })
//
// ipc.on('show', function (event, message) {
//   searchInput.focus()
// })
//
// document.addEventListener('mousewheel', function (e) {
//   if (e.deltaY % 1 !== 0) {
//     e.preventDefault()
//   }
// })
// document.addEventListener('keydown', function (evt) {
//   var onSearchField = !!evt.target.dataset.isSearchInput
//   if (onSearchField) {
//     if (evt.keyCode === 40) {
//       // on down: focus on the first thing!
//       jumpto('up')
//       evt.preventDefault()
//     } else if (evt.keyCode === 13) {
//       copyFocusedEmoji(document.querySelector('.emoji:first-child'), evt.shiftKey)
//     }
//   } else if (evt.target.classList.contains('emoji')) {
//     if (evt.keyCode === 32) {
//       if (evt.shiftKey) {
//         jumpto('prev')
//       } else {
//         jumpto('next')
//       }
//     } else if (evt.keyCode === 13) {
//       copyFocusedEmoji(evt.target, evt.shiftKey)
//     } else if (Object.keys(directions).indexOf(evt.keyCode.toString()) >= 0) {
//       // on navigation, navigate
//       jumpto(directions[evt.keyCode])
//     }
//   }
//
//   if (!onSearchField && evt.keyCode === 191 && !evt.shiftKey && !evt.metaKey && !evt.ctrlKey) {
//     // on `/`: focus on the search field
//     searchInput.select()
//     evt.preventDefault()
//   } else if (evt.keyCode === 27) {
//     // on escape: exit
//     ipc.send('abort')
//   }
// })
//
// function copyFocusedEmoji (emoji, copyText) {
//   var data
//   // on enter: copy data and exit
//   if (copyText) {
//     data = ':' + emoji.getAttribute('aria-label') + ':'
//   } else {
//     data = emoji.innerText
//   }
//   clipboard.writeText(data)
//   searchInput.value = ''
//   search('')
//   ipc.send('abort')
// }
//
// document.addEventListener('keypress', function (evt) {
//   // if typing while navigatin, just type into the search box!
//   var word = isWord(evt.charCode)
//   if (word && evt.target.classList.contains('emoji')) {
//     searchInput.focus()
//   }
// })
//
// // if click on and emoji item, copy emoji unicode char to clipboard on click or
// // copy emoji code if `shiftKey` is pressed
// document.addEventListener('click', function (evt) {
//   if (evt.target.classList.contains('emoji')) {
//     copyFocusedEmoji(evt.target, evt.shiftKey)
//   }
// })
//
// function stringIncludes (string, search) {
//   if (search.length > string.length) {
//     return false
//   } else {
//     return string.indexOf(search) !== -1
//   }
// }
//
// function search (query) {
//   if (searching) {
//     clearTimeout(searching)
//   }
//   searching = setTimeout(function () {
//     var results
//     if (query.length === 0 || (query.length === 1 && query.charCodeAt() <= 255)) {
//       results = emojikeys.slice(0)
//     } else {
//       var resultsDict = {}
//       indexKeys.forEach(function matchQuery (keyword) {
//         if (stringIncludes(keyword, query)) {
//           index[keyword].forEach(function addMatchingEmoji (emoji) {
//             resultsDict[emoji] = true
//           })
//         }
//       })
//       results = Object.keys(resultsDict).sort(function sortResults (a, b) {
//         return emojikeyIndexTable[a] - emojikeyIndexTable[b]
//       })
//     }
//
//     // Put exact match first
//     if (results.indexOf(query) >= 0) {
//       results.splice(results.indexOf(query), 1)
//       results.unshift(query)
//     }
//
//     renderResults(results, document.querySelector('.js-results'))
//     if (document.querySelector('.emoji')) document.querySelector('.emoji').scrollIntoViewIfNeeded()
//   }, 80)
// }
//
// function renderResults (emojiNameArray, containerElement) {
//   containerElement.innerHTML = ''
//   var fragment = document.createDocumentFragment()
//   emojiNameArray.forEach(function (name) {
//     var unicode = (emojilib[name]['char'] || '--')
//     var resultElement = document.createElement('button')
//     resultElement.type = 'button'
//     resultElement.className = 'emoji'
//     resultElement.setAttribute('aria-label', name)
//     resultElement.textContent = unicode
//     fragment.appendChild(resultElement)
//   })
//   containerElement.appendChild(fragment)
// }
//
// function buildEmojikeyIndexTable () {
//   var indexTable = {}
//   emojikeys.forEach(function (name, index) {
//     indexTable[name] = index
//   })
//   return indexTable
// }
//
// function buildIndex () {
//   var keywords = {}
//   emojikeys.forEach(function (name) {
//     var words = emojilib[name]['keywords']
//     words.push(name)
//     words.push(emojilib[name]['char'])
//     words.push(emojilib[name]['category'])
//
//     words.forEach(function (word) {
//       if (keywords[word] && keywords[word].indexOf(name) < 0) {
//         keywords[word].push(name)
//       } else if (!keywords[word]) {
//         keywords[word] = [name]
//       }
//     })
//   })
//
//   return keywords
// }
//
// function isWord (charCode) {
//   return String.fromCharCode(charCode).match(/\w/)
// }
//
// function jumpto (destination) {
//   var container = document.getElementsByClassName('js-results')[0]
//   var all = document.getElementsByClassName('emoji')
//   var focusedElement = document.querySelector('.emoji:focus')
//   var nodeIndex = Array.prototype.indexOf.call(all, focusedElement)
//   var resultPerRow = Math.floor(container.clientWidth / all[0].clientWidth)
//   var resultPerCol = Math.floor(container.clientHeight / all[0].clientHeight)
//   var newTarget
//
//   if (destination === 'up') {
//     newTarget = nodeIndex - resultPerRow
//   } else if (destination === 'down') {
//     newTarget = nodeIndex + resultPerRow
//   } else if (destination === 'left') {
//     if ((nodeIndex + 1) % resultPerRow === 1) {
//       // Wrap to previous row.
//       newTarget = nodeIndex + (resultPerRow - 1) // Adjust to last column.
//       newTarget -= resultPerRow // Up one row.
//     } else {
//       newTarget = nodeIndex - 1
//     }
//   } else if (destination === 'right') {
//     if ((nodeIndex + 1) % resultPerRow === 0) {
//       // Wrap to next row.
//       newTarget = nodeIndex - (resultPerRow - 1) // Adjust to first column.
//       newTarget += resultPerRow // Down one row.
//     } else {
//       newTarget = nodeIndex + 1
//     }
//   } else if (destination === 'next') {
//     newTarget = nodeIndex + resultPerRow * (resultPerCol - 1 || 1)
//   } else if (destination === 'prev') {
//     newTarget = nodeIndex - resultPerRow * (resultPerCol - 1 || 1)
//   }
//
//   if (newTarget < 0) {
//     // Allow jump back up to search field IF already at first item.
//     if (nodeIndex === 0) {
//     // Purposefully mismatch so we focus on input instead.
//       newTarget = -1
//     } else {
//       newTarget = 0
//     }
//   }
//   if (newTarget >= all.length - 1) newTarget = all.length - 1
//   if (all[newTarget]) {
//     all[newTarget].focus()
//     all[newTarget].scrollIntoViewIfNeeded()
//   } else {
//     searchInput.focus()
//   }
// }
