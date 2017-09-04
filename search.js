/**
  *  Be warned! All this is WIP
  *  I am aware that it looks horrendous.
  *  Liam x
  */

// Prototype functions
String.prototype.kebabcase = function() { return this.replace(/\s+/g, '-').toLowerCase(); }
String.prototype.camelcase = function() {
  return this.toLowerCase()
    .replace( /[-_]+/g, ' ')
    .replace( /[^\w\s]/g, '')
    .replace( / (.)/g, function($1) { return $1.toUpperCase(); })
    .replace( / /g, '' );
}

// Global variables
const ENV = {
  iconWrapper: document.getElementById('icons'),
  tmplTitle: document.getElementById('icon-title-template'),
  tmpl: document.getElementById('icon-template'),
  iconKeywords: [
    /* 0 */ 'computer bug internet',
    /* 1 */ 'rewards reward champion',
    /* 2 */ 'medical religion human interest',
    /* 3 */ 'navigation transport social',
    /* 4 */ 'finance economy media social',
    /* 5 */ 'food drink gastronomy',
    /* 6 */ 'office file document interface interactive',
    /* 7 */ 'science atom education',
    /* 8 */ 'shopping store shop transport',
    /* 9 */ 'arrows bubble direction messaging communication'
  ]
}
const CUSTOM_ACTIONS = {
  increaseSize() {
    let fontSize = parseInt(window.getComputedStyle(ENV.iconWrapper).fontSize);
    ENV.iconWrapper.style.fontSize = fontSize + 5 + 'px';
  },
  decreaseSize() {
    let fontSize = parseInt(window.getComputedStyle(ENV.iconWrapper).fontSize);
    ENV.iconWrapper.style.fontSize = fontSize - 5 + 'px';
  },
  toggleTitles() {
    ENV.iconWrapper.classList.toggle('hide-titles', this.checked);
  },
  alertOnClick() {
    // TODO: implement something less shitty
  },
  searchIcons(e) {
    let results = extractIcons(e.target.value.toLowerCase());
    printIconCount(results);
    printIconList(results);
  }
};

// Init()
const cleanIconList = getCleanIconList();
printIconList(cleanIconList);
printIconCount(cleanIconList)
setTriggers();

// Actions
function getCleanIconList() {
  return iconList.icons.map(function(val,i) { // iconList.icons -> Loaded JSON file
    return { code: val.properties.code,
             name: val.properties.name,
             cleanTitle: val.properties.name.split('-').join(' '),
             keywords: `${val.properties.name.split('-').join(' ')} ${ENV.iconKeywords[val.setId]}`,
             setId: val.setId };
  });
}

function printIconList(icons) {

  ENV.iconWrapper.innerHTML = ''; // Clean

  let set; // Initial value
  icons.forEach(function(el) {
    let tmpTmpl = ENV.tmpl.content.cloneNode(true);
    let tmpTmplWrapper = tmpTmpl.querySelector('.icon-wrapper');

    if((set == el.setId ? false : true)) {
      let tmpTitleTmpl = ENV.tmplTitle.content.cloneNode(true);
      tmpTitleTmpl.querySelector('.icon-set-title').innerText = `Set: ${el.setId}`;
      ENV.iconWrapper.appendChild(tmpTitleTmpl);
    } set = el.setId;

    tmpTmplWrapper.classList = `icon-wrapper icon-set-${el.setId}`;
    tmpTmplWrapper.title = el.cleanTitle;
    tmpTmpl.querySelector('.icon').classList = `icon icon-${el.name}`;
    tmpTmpl.querySelector('.icon-title').innerText = el.cleanTitle;
    tmpTmplWrapper.addEventListener('click', function() { printIconInfo(this, el.name, el.setId); });

    ENV.iconWrapper.appendChild(tmpTmpl);

  });

}

function setTriggers() {

  let _triggers = document.querySelectorAll('[data-action]');

  _triggers.forEach(function(el) {
    let actionStr = el.dataset.action;
    // Determine action type [default -> click]
    let actionType = actionStr.indexOf(':') > 0 ? actionStr.slice(0, actionStr.indexOf(':')).camelcase() : 'click';
    // Add click trigger
    el.addEventListener( actionType, CUSTOM_ACTIONS[actionStr.split(':').pop().camelcase()].bind(this) );
    // Trigger onLoad if is checked checkbox
    el.checked ? CUSTOM_ACTIONS[actionStr.camelcase()].apply(el) : '';
  });

}

function printIconInfo(elem, title, setId) {
  let consoleText = `
    Icon Info:
    ----------

    Title: ${title}
    Css code: ${getIconCodeFromCss(elem)}
  `;
  if(document.querySelector('[data-action="alert-on-click"]') && document.querySelector('[data-action="alert-on-click"]').checked === true) alert(consoleText);
  console.info(consoleText);
}

function getIconCodeFromCss(elem) {
  let str = window.getComputedStyle(elem.querySelector('span.icon'), ':before').content;
  return code = escape(str.replace(/['"%]+/g, ''))
                   .replace(/[%]+/g, '\\')
                   .toLowerCase();
}

function printIconCount(iconList) {
  let placeholders = document.querySelector('[data="icon-count"]');
  placeholders.innerHTML = `(${iconList.length})`;
}
// Search functions
function extractIcons(query) {
  return cleanIconList.filter(function(elem) {
    return elem.keywords.indexOf(query) > -1;
  });
}
