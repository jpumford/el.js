/**
* el.js v0.3 - A JavaScript Node Creation Tool
*
* https://github.com/markgandolfo/el.js
*
* Copyright 2013 Mark Gandolfo and other contributors
* Released under the MIT license.
* http://en.wikipedia.org/wiki/MIT_License
*/
window.el = (function () {
  var el = function() {
    // Pattern to match id & class names
    var pattern = /([a-z]+|#[\w-\d]+|\.[\w\d-]+)/g

    // set defaults
    var attrs = {}, child = [], tagName = '';
    // iterate through args and guess their types
    for (var i in arguments) {
      switch (typeof arguments[i]) {
        case 'object':
          // an array, dictionary, or HTML element?
          if (arguments[i] instanceof Array) {
            child = child.concat(arguments[i]);
          } else if (arguments[i] instanceof HTMLElement) {
            // @todo Test on older versions of IE
            child.push(arguments[i]);
          } else {
            // @todo Merge these two objects intelligently
            attrs = arguments[i];
          }
          break;
        case 'string':
          //do we already have a name?
          if (tagName !== '') {
            child = [arguments[i]];
          } else {
            tagName = arguments[i];
          }
          break;
        default:
          console.log('el.js: Invalid argument ' + arguments[i]);
          break;
      }
    }

    // run the pattern over the tagname an attempt to pull out class & id attributes
    // shift the first record out as it's the element name
    matched = tagName.match(pattern);
    console.log(tagName);
    tagName = matched[0];
    matched.shift();
    
    // Iterate over the matches and concat the attrs to either class or id keys in attrs json object
    for (var m in matched) {
      if(matched[m][0] == '.') {
        if(attrs['class'] == undefined) {
          attrs['class'] = matched[m].substring(1, matched[m].length);
        } else {
          attrs['class'] = attrs['class'] + ' ' + matched[m].substring(1, matched[m].length);
        }
      } else if(matched[m][0] == '#') {
        if(attrs['id'] == undefined) {
          attrs['id'] = matched[m].substring(1, matched[m].length)
        } else {
          // Feels dirty having multiple id's, but it's allowed: http://www.w3.org/TR/selectors/#id-selectors
          attrs['id'] = attrs['id'] + ' ' + matched[m].substring(1, matched[m].length);
        }
      }
    }

    // create the element
    var el = document.createElement(tagName);
    for(var i = 0; i < child.length; i += 1) {
       if(typeof(child[i]) == 'object') {
          el.appendChild(child[i]);
       } else {
          el.innerHTML = child[i];
       }
    }

    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        el.setAttribute(key, attrs[key]);
      }
    }
  return el;
};
  
  // alias
  el.create = el.c = el;
  
  // vanity methods
  el.img = function(attrs) {
    return this.create('img', attrs);
  };
    
  el.a = function(attrs, child) {
    return this.create('a', attrs);
  };
  
  el.div = function(attrs, child) {
    return this.create('div', attrs);
  };
  
  el.p = function(attrs, child) {
    return this.create('p', attrs);
  };
  
  el.input = function(attrs, child) {
    return this.create('input', attrs);
  };

  return el;
}());
