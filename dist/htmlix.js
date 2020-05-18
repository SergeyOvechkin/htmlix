function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function HTMLixArray(node, containerHTML, rootLink, pathToComponent, selector) {
  this.htmlLink = node, this.data = [], this.rootLink = rootLink, this.pathToComponent = pathToComponent, this.type = "array", this.templateData = containerHTML.cloneNode(true),
  /*this.id = null, */
  this.index = null, this.renderType = "array", this.selector = selector;
  if (node == "virtual-array") this.renderType = "virtual-array";
}

HTMLixArray.prototype.add = function (props, insertLocation) {
  var container = this.rootLink.addContainer(this.pathToComponent, props, insertLocation);
  return container;
};

HTMLixArray.prototype.removeIndex = function (indexArray, widthChild) {
  if (_typeof(indexArray) != "object") indexArray = [indexArray];
  this.rootLink.removeByIndexes(this.pathToComponent, indexArray, widthChild);
};

HTMLixArray.prototype.removeAll = function (widthChild) {
  this.rootLink.removeAll(this.pathToComponent, widthChild);
};

HTMLixArray.prototype.reuseAll = function (arrayWithObjects) {
  var newArrLength = arrayWithObjects.length;
  var oldArrLength = this.data.length;
  var add = 0;
  var remove = 0;
  if (newArrLength > oldArrLength) add = newArrLength - oldArrLength;
  if (newArrLength < oldArrLength) remove = oldArrLength - newArrLength;

  for (var i = 0; i < this.data.length; i++) {
    this.data[i].setAllProps(arrayWithObjects[i]);

    for (var key in this.data[i].props) {
      this.data[i].props[key].prop = null;
    }
  }

  if (add > 0) {
    for (var t = 0; t < add; t++) {
      this.add(arrayWithObjects[oldArrLength + t]);
    }
  }

  if (remove > 0) {
    for (var f = 0; f < remove; f++) {
      this.removeIndex([this.data.length - 1], true);
    }
  }
};

HTMLixArray.prototype.getAll = function (map_Object) {
  var array_r = [];

  if (map_Object != undefined) {
    for (var f = 0; f < this.data.length; f++) {
      array_r.push(this.data[f].getAllProps(map_Object));
    }
  } else {
    for (var f = 0; f < this.data.length; f++) {
      array_r.push(this.data[f].getAllProps());
    }
  }

  return array_r;
};

HTMLixArray.prototype.order = function (newOrderArr) {
  this.rootLink.changeOrder(this.pathToComponent, newOrderArr);
};
function Container(htmlLink, containerName, props, methods, index, pathToContainer, rootLink, isRuncreatedContainer, newProps) {
  this.htmlLink = htmlLink;
  this.rootLink = rootLink;
  this.props = {};
  this.index = index;
  this.pathToCоmponent = pathToContainer;
  this.name = containerName;
  this.type = "container";
  this.renderType = "container-outer";
  if (props == undefined) props = [];

  for (var i2 = 0; i2 < props.length; i2++) {
    if (methods == undefined) methods = {};

    if (typeof props[i2] == "string") {
      var htmlLinkToProp = this.htmlLink.querySelector('[data-' + containerName + '-' + props[i2] + ']');
      if (htmlLinkToProp == undefined) htmlLinkToProp = this.htmlLink;
      this.props[props[i2]] = constructorProps(htmlLinkToProp, containerName, props[i2], methods[props[i2]], this.pathToCоmponent, this, this.rootLink, newProps);
    } else {
      var string = props[i2][0];
      var selector = props[i2][2];
      var htmlLinkToProp = this.htmlLink;

      if (selector != "") {
        htmlLinkToProp = this.htmlLink.querySelector(selector);

        if (htmlLinkToProp == undefined) {
          console.log("error - не возможно найти селектор для свойства " + selector + " контейнера " + containerName + " проверьте правильность селектора или наличие тега в html разметке");
          continue;
        }
      }

      this.props[string] = constructorProps(htmlLinkToProp, containerName, props[i2], methods[string], this.pathToCоmponent, this, this.rootLink, newProps);
    }
  }

  if (methods.createdContainer != undefined) {
    this.createdContainer = methods.createdContainer.bind(this);

    if (isRuncreatedContainer == undefined || isRuncreatedContainer != false) {
      this.createdContainer(); //console.log(this);
    }
  }
}

Container.prototype.remove = function (widthChild) {
  if (this.groupId != undefined && this.groupParent != undefined) {
    this.groupParent.removeFromGroup(this.groupId);
    return;
  }

  if (this.renderParent != undefined && this.renderParent.renderChild != undefined && this.renderParent.renderChild != null) {
    this.renderParent.renderChild = null;
  }

  if (this.index == null) {
    console.log("conteiner without array not removing, to remove its first add container to array");
    return null;
  }

  if (widthChild != undefined && widthChild == true) {
    this.rootLink.removeByIndexes(this.pathToCоmponent, [this.index], true);
  } else {
    this.rootLink.removeByIndexes(this.pathToCоmponent, [this.index]);
  }

  return true;
};

Container.prototype.setAllProps = function (properties) {
  for (key in properties) {
    if (this.props[key] != undefined) {
      this.props[key].setProp(properties[key]);
    } else if (key != "componentName") {
      //console.log(this);
      console.log("warn не найден ключь " + key + " в контейнере " + this.name + " index " + this.index + " массива " + this.pathToCоmponent + " проверте правильность названия ключей в объекте properties");
    }
  }
};

Container.prototype.getAllProps = function (properties) {
  var properties_r = {};

  if (properties != undefined) {
    for (key in properties) {
      if (this.props[key] != undefined) {
        properties_r[key] = this.props[key].getProp(properties[key]);
      }
    }
  } else {
    for (key in this.props) {
      properties_r[key] = this.props[key].getProp();
    }
  } //console.log( properties_r);


  return properties_r;
};

Container.prototype.component = function () {
  return this.rootLink.state[this.pathToCоmponent];
};
function HTMLixRouter(state, routes) {
  var namePathInRoutes = findComponent(routes); //поиск соответствующего роута

  function findComponent(routes) {
    var urlPath = window.location.pathname; //console.log(urlPath);

    if (urlPath == "/" && routes["/"] != undefined) {
      return urlPath;
    }

    var pathArray = urlPath.split("/");

    for (var key in routes) {
      var isCountSerchСoincide = true;
      var pathArrayFind = key.split("/");
      var word = pathArrayFind.slice(-1)[0]; //поиск последнего слова в маршруте чтобы проверить есть ли у него в конце знак *

      var paramWord = {};

      if (pathArrayFind.length > 2 && word == "") {
        word = pathArrayFind.slice(-2)[0];
        pathArrayFind.pop();
      } else if (pathArrayFind.length > 2 && word == "*") {
        word = pathArrayFind.slice(-2)[0];
        pathArrayFind.pop();
        isCountSerchСoincide = false;
      }

      var word2 = pathArray.slice(-1)[0]; //поиск последнего слова в маршруте чтобы убрать пустую строку

      if (pathArray.length > 2 && word2 == "") {
        //word2 = pathArrayFind.slice(-2)[0];
        pathArray.pop();
      } //console.log(pathArrayFind);


      var searchInword = false;
      var searchInwordCount = {};
      var isParam = false;

      for (var y = 0; y < pathArrayFind.length; y++) {
        if (pathArrayFind[y][pathArrayFind[y].length - 1] == "*") {
          searchInword = true;
          word = pathArrayFind[y];
          searchInwordCount[y] = y;
        }

        if (pathArrayFind[y][0] == ":") {
          isParam = true;
          paramWord[y] = y; //console.log(paramWord+" param word "+ pathArrayFind[y]);
        }
      }
      /*
      		if(word[word.length-1] == "*"){
      				searchInword = true;
      	}
      */


      var count = 0;

      for (var i = 0; i < pathArrayFind.length; i++) {
        if (pathArrayFind[i] == pathArray[i]) {
          count++;
        } else if (searchInword == true && searchInwordCount[i] != undefined) {
          var search = pathArray[i].search(word);

          if (word != "" && search == 0) {
            count++; //	console.log(search + " search  " +  word);
          }
        } else if (isParam == true && paramWord[i] != undefined) {
          count++;
        }
      } //console.log(count+" - "+pathArrayFind.length);
      //console.log(pathArrayFind); console.log(pathArray);


      if (isCountSerchСoincide == false) {
        if (pathArrayFind.length == count) {
          namePathInRoutes = key;
          return key;
        }
      }

      if (pathArrayFind.length == count && pathArrayFind.length == pathArray.length) {
        namePathInRoutes = key;
        return key;
      }
    }

    return null;
  } //поиск шаблона


  if (routes[namePathInRoutes] != undefined && routes[namePathInRoutes].templatePath != undefined) {
    if (state.stateSettings == undefined) state.stateSettings = {};
    state.stateSettings.templatePath = routes[namePathInRoutes].templatePath;
  } else {
    console.log("router error- маршрут не найден убедитесь в правильности запроса");
  } ///изменение структуры state для загрузки шаблонов для других страниц в fetch запросе


  for (var key2 in state) {
    var toCare = true;

    for (var t = 0; t < routes[namePathInRoutes].first.length; t++) {
      if (key2 == routes[namePathInRoutes].first[t] || key2 == "stateSettings" || key2 == "stateMethods" || key2 == 'stateProperties' || key2 == "eventEmiters" || key2 == 'virtualArrayComponents' || key2 == "fetchComponents"
      /* ||  key2 ==  'firstInitComponents' */
      ) {
          toCare = false;
        }
    }

    if (toCare) {
      if (state['fetchComponents'] == undefined) state['fetchComponents'] = {};
      state['fetchComponents'][key2] = state[key2];
      delete state[key2];
    }
  }

  var stateWithRoutes = new HTMLixState(state);
  var routerObj = {
    routes: routes,
    htmlLink: {},
    component: {},
    matchRout: findComponent,
    findRouters: function findRouters(nameArrComp) {
      if (nameArrComp == undefined) {
        nameArrComp = this.matchRout(this.routes);

        if (nameArrComp == null) {
          console.log("router error - не удается найти совпадающий rout для маршрута " + window.location.pathname);
        }
      }

      for (var key in this.routes[nameArrComp].routComponent) {
        var key2 = this.routes[nameArrComp].routComponent[key];

        if (this.component[key2] == undefined) {
          var component = this.rootLink.state[key2];
          this.component[key2] = component;
          if (component == undefined) console.log("router error - не удается найти компонент " + key2 + " в описании приложения, проверьте правильность написания ключей в параметре routes для HTMLixRouter"); //console.log(key);
        }

        if (this.htmlLink[key] == undefined || this.htmlLink[key] == null) this.htmlLink[key] = document.querySelector("[data-" + key + "]"); //console.log(this.htmlLink[key]);
      }

      for (var key in this.routes[nameArrComp].routComponent) {
        if (this.htmlLink[key] == undefined || this.htmlLink[key] == null) {
          for (var keyRouter in this.routes[nameArrComp].routComponent) {
            this.htmlLink[key] = this.component[this.routes[nameArrComp].routComponent[keyRouter]].htmlLink.querySelector("[data-" + key + "]");
            if (this.htmlLink[key] != undefined || this.htmlLink[key] != null) continue;
          }
        }

        if (this.htmlLink[key] == undefined || this.htmlLink[key] == null) console.log("error в html коде не найден роутер data-" + key);
      }
    },
    setHtml: function setHtml(nameArrComp) {
      for (var key in this.routes[nameArrComp].routComponent) {
        var key2 = this.routes[nameArrComp].routComponent[key];
        this.htmlLink[key].innerHTML = "";
        this.htmlLink[key].appendChild(this.component[key2].htmlLink);
      }
    },
    setRout: function setRout(url, newComponent) {
      //console.log(url);
      window.history.pushState(null, url, url);
      var nameArrComp = this.matchRout(this.routes);

      if (nameArrComp == null) {
        console.log("router error - не удается найти совпадающий rout для маршрута " + window.location.pathname);
      }

      this.findRouters(nameArrComp);
      this.setHtml(nameArrComp);
    }
  };
  stateWithRoutes.router = routerObj;
  stateWithRoutes.router.rootLink = stateWithRoutes;
  routerObj.findRouters(); // stateWithRoutes.router.component = stateWithRoutes.state[routes[namePathInRoutes].routComponent];  

  return stateWithRoutes;
}

function EventEmiter(eventName, prop, listeners, listenersEventMethods) {
  this.listeners = listeners;
  this.listenersEventMethods = listenersEventMethods;
  this.event = new Event(eventName);
  this.type = eventName;
  this.prop = prop;
}

EventEmiter.prototype.addListener = function (htmlLinkToListener, eventMethod, eventName, nameListener) {
  htmlLinkToListener.addEventListener(eventName, eventMethod);
  this.listeners[nameListener] = htmlLinkToListener;
  this.listenersEventMethods[nameListener] = eventMethod;
};

EventEmiter.prototype.removeListener = function (htmlLinkToListener) {
  var index = null;

  for (key in this.listeners) {
    if (htmlLinkToListener == this.listeners[key]) index = key;
  }

  if (index == null) return;
  this.listeners[index].removeEventListener(this.type, this.listenersEventMethods[index]);
  delete this.listenersEventMethods[index];
  delete this.listeners[index];
};

EventEmiter.prototype.emit = function () {
  for (key in this.listeners) {
    this.listeners[key].dispatchEvent(this.event);
  }
};

EventEmiter.prototype.setEventProp = function (prop) {
  this.prop = prop;
  this.emit();
};

EventEmiter.prototype.getEventProp = function () {
  return this.prop;
};
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function constructorProps(htmlLink, keyData1, keyData2, eventMethod, pathToContainer, parentContainer, rootLink, newProps) {
  var propType = "";

  if (_typeof(keyData2) == "object") {
    propType = keyData2[1];
  } else if (keyData2 == "data") {
    propType = "data";
    return new PropCommon(htmlLink, propType, parentContainer);
  } else {
    propType = htmlLink.dataset[keyData1 + rootLink.capitalizeFirstLetter(keyData2)];
  }

  if (propType == null) {
    var mess = "error не определен тип свойства для data-" + keyData1 + "-" + keyData2 + " в html коде не найдено для компонента " + pathToContainer + ", index= " + parentContainer.index + " !, проверьте правильность названия свойств";
    console.log(mess);
    throw mess;
  }

  if (eventMethod != undefined && isEvent(propType) != false) {
    return new PropStandartEvent(htmlLink, propType, keyData2, eventMethod, pathToContainer, parentContainer, rootLink);
  } else if (eventMethod != undefined && isEmiter(propType, rootLink) != false) {
    return new PropEventEmiter(htmlLink, propType, keyData2, eventMethod, pathToContainer, parentContainer, rootLink);
  } else if (propType == "render-variant") {
    return new PropVariant(htmlLink, propType, keyData2, pathToContainer, parentContainer, rootLink, newProps);
  } else if (propType == "group") {
    return new PropGroup(htmlLink, propType, keyData1, keyData2, pathToContainer, parentContainer, rootLink, newProps);
  } else {
    return new PropCommon(htmlLink, propType, parentContainer);
  }
}

function PropCommon(htmlLink, propType, parentComponent) {
  this.htmlLink = htmlLink;
  this.type = propType;

  if (this.type == "data") {
    this.parent = parentComponent;
  }
}

function PropSubtype(htmlLink, propType, propName, pathToComponent, parentComponent, rootLink) {
  //PropCommon.call(this, htmlLink, propType, parentComponent);
  this.htmlLink = htmlLink;
  this.type = propType;
  this.pathToCоmponent = pathToComponent;
  this.parent = parentComponent;
  this.rootLink = rootLink;
  this.prop = null;
  this.propName = propName;
}

PropCommon.prototype.setProp = function (value, eventMethod) {
  if (this.type == "text") {
    this.htmlLink.textContent = value;
    return;
  } else if (this.type == "inputvalue" || this.type == "select") {
    this.htmlLink.value = value;
    return;
  } else if (this.type == "checkbox" || this.type == "radio") {
    if (value != true && value != false) value = true;
    this.htmlLink.checked = value;
    return;
  } else if (this.type == "html") {
    this.htmlLink.innerHTML = value;
    return;
  } else if (this.type == "class") {
    if (Array.isArray(value)) {
      for (var u = 0; u < this.htmlLink.classList.length; u++) {
        this.htmlLink.classList.remove(this.htmlLink.classList[u]);
      }

      for (var k = 0; k < value.length; k++) {
        this.htmlLink.classList.add(value[k]);
      }
    } else {
      this.htmlLink.classList.add(value);
    }

    return;
  } else if (this.isAttr(this.type) != false) {
    this.htmlLink.setAttribute(this.isAttr(this.type), value);
    return;
  } else if (this.type == "data") {
    this.htmlLink.dataset[this.parent.name + "Data"] = value;
    return;
  }
};

PropCommon.prototype.getProp = function (value) {
  if (this.type == "text") {
    return this.htmlLink.textContent;
  } else if (this.type == "inputvalue" || this.type == "select") {
    return this.htmlLink.value;
  } else if (this.type == "checkbox" || this.type == "radio") {
    return this.htmlLink.checked;
  } else if (this.type == "class") {
    return this.htmlLink.classList;
  } else if (this.type == "html") {
    return this.htmlLink.innerHTML;
  } else if (this.isAttr(this.type) != false) {
    return this.htmlLink.getAttribute(this.isAttr(this.type));
  } else if (this.type == "data") {
    return this.htmlLink.dataset[this.parent.name + "Data"];
  }
};

PropCommon.prototype.removeProp = function (value) {
  if (this.type == "text") {
    return this.htmlLink.textContent = "";
  } else if (this.type == "class") {
    if (Array.isArray(value)) {
      for (var u = 0; u < this.htmlLink.classList.length; u++) {
        this.htmlLink.classList.remove(this.htmlLink.classList[u]);
      }
    } else {
      this.htmlLink.classList.remove(value);
    }

    return;
  } else if (this.type == "html") {
    this.htmlLink.innerHTML = "";
    return;
  } else if (this.type == "checkbox" || this.type == "radio") {
    this.htmlLink.checked = false;
    return;
  } else if (this.type == "inputvalue" || this.type == "select") {
    this.htmlLink.value = "";
    return;
  } else if (this.type == "data") {
    this.htmlLink.dataset[this.parent.name + "Data"] = "";
    return;
  } else if (this.isAttr(this.type) != false) {
    this.htmlLink.setAttribute(this.isAttr(this.type), "");
    return;
  }
};

PropCommon.prototype.isAttr = function (type) {
  var isAttr = false;

  switch (type) {
    case 'alt':
      isAttr = 'alt';
      break;

    case 'disabled':
      isAttr = 'disabled';
      break;

    case 'href':
      isAttr = 'href';
      break;

    case 'id':
      isAttr = 'id';
      break;

    case 'src':
      isAttr = 'src';
      break;

    case 'style':
      isAttr = 'style';
      break;

    case 'title':
      isAttr = 'title';
      break;
  }

  return isAttr;
};

function isEmiter(emiterName, rootLink_p) {
  var isEmiter = false;

  for (var key123 in rootLink_p.eventProps) {
    if (key123 == emiterName) {
      isEmiter = key123;
    }
  }

  return isEmiter;
}

function isEvent(type) {
  var isEv = false;

  switch (type) {
    case 'click':
      isEv = 'click';
      break;

    case 'keydown':
      isEv = 'keydown';
      break;

    case 'dblclick':
      isEv = 'dblclick';
      break;

    case 'contextmenu':
      isEv = 'contextmenu';
      break;

    case 'selectstart':
      isEv = 'selectstart';
      break;

    case 'mousewheel':
      isEv = 'mousewheel';
      break;

    case 'mousemove':
      isEv = 'mousemove';
      break;

    case 'mouseout':
      isEv = 'mouseout';
      break;

    case 'mouseover':
      isEv = 'mouseover';
      break;

    case 'mouseup':
      isEv = 'mouseup';
      break;

    case 'mousedown':
      isEv = 'mousedown';
      break;

    case 'keypress':
      isEv = 'keypress';
      break;

    case 'keyup':
      isEv = 'keyup';
      break;

    case 'focus':
      isEv = 'focus';
      break;

    case 'blur':
      isEv = 'blur';
      break;

    case 'change':
      isEv = 'change';
      break;

    case 'reset':
      isEv = 'reset';
      break;

    case 'select':
      isEv = 'select';
      break;

    case 'submit':
      isEv = 'submit';
      break;

    case 'abort':
      isEv = 'abort';
      break;

    case 'change':
      isEv = 'change';
      break;
  }

  return isEv;
}
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function PropGroup(htmlLink, propType, keyData1, propName, pathToComponent, parentComponent, rootLink, newProps) {
  this.groupChild = [];
  this.groupArray = null;
  PropSubtype.call(this, htmlLink, propType, propName, pathToComponent, parentComponent, rootLink);

  if (newProps == undefined || newProps[propName] == undefined || _typeof(newProps[propName]) != "object" || newProps[propName].componentName == undefined) {
    this.initGroup(keyData1, propName);
  } else {
    this.removeAllChild();
  }
}

PropGroup.prototype.component = function () {
  return this.rootLink.state[this.pathToCоmponent];
};

PropGroup.prototype.removeAllChild = function () {
  var children = this.htmlLink.children;
  var count = children.length;

  for (var p = 0; p < count; p++) {
    children[0].remove();
  }
};

PropGroup.prototype.getProp = function (value) {
  if (value == undefined) {
    var array_r = [];

    for (var i = 0; i < this.groupChild.length; i++) {
      array_r.push(this.groupChild[i].getAllProps());
    }

    var componentName = "";
    if (this.groupArray != undefined) componentName = this.groupArray.pathToComponent;
    return {
      group: array_r,
      componentName: componentName
    };
  } else {
    if (typeof value == "number") {
      return this.groupChild[value];
    } else if (_typeof(value) == "object") {
      var array_r = [];

      if (value.componentName == undefined && value.group == undefined) {
        for (var i = 0; i < this.groupChild.length; i++) {
          array_r.push(this.groupChild[i].getAllProps(value));
        }

        return array_r;
      } else {
        for (var i = 0; i < this.groupChild.length; i++) {
          array_r.push(this.groupChild[i].getAllProps(value));
        }

        var obj_r = {
          group: array_r
        };
        if (value.componentName != undefined) obj_r.componentName = this.groupArray.pathToComponent;
        return obj_r;
      }
    }
  }
};

PropGroup.prototype.setProp = function (value) {
  if (Array.isArray(value)) {
    this.reuseGroup(value);
  } else if (_typeof(value) == "object") {
    if (value.componentName != undefined && value.group != undefined) {
      this.createNewGroup(value.group, value.componentName);
    } else {
      if (value.location != undefined) {
        var location = value.location;
        delete value.location;
      }

      this.createInGroup(value, location);
    }
  } else {
    console.log("не получается создать " + value + "в группе компонента" + this.pathToCоmponent);
  }

  return;
};

PropGroup.prototype.removeProp = function (value) {
  if (value == undefined) {
    this.clearGroup();
  } else {
    this.removeFromGroup(value);
  }

  return;
};

PropGroup.prototype.removeFromGroup = function (groupID) {
  if (this.groupChild[groupID] == undefined) {
    console.log("error- элемента с id = " + groupID + " в группе не существует");
    return;
  }

  delete this.groupChild[groupID].groupId;
  delete this.groupChild[groupID].groupParent;
  this.groupChild[groupID].remove(true);
  this.groupChild.splice(groupID, 1);

  for (var t = 0; t < this.groupChild.length; t++) {
    this.groupChild[t].groupId = t;
  }
};

PropGroup.prototype.clearGroup = function () {
  if (this.groupChild.length <= 0) return;
  var indexes = [];

  for (var i = 0; i < this.groupChild.length; i++) {
    indexes.push(this.groupChild[i].index);
  }

  this.rootLink.removeByIndexes(this.groupChild[0].pathToCоmponent, indexes, true);
  this.groupChild = [];
};

PropGroup.prototype.getGroupsArray = function () {
  if (this.groupArray == null || this.groupArray == undefined) {
    if (this.component().type == "array") {
      for (var h = 0; h < this.component().data.length; h++) {
        var groupArray_r = this.component().data[h].props[this.propName].groupArray;

        if (groupArray_r != null && groupArray_r != undefined) {
          this.groupArray = groupArray_r;
          return this.groupArray;
        }
      }
    }
  }

  return null;
};

PropGroup.prototype.reuseGroup = function (arrayWithObjects) {
  if (this.groupArray == null && this.getGroupsArray() == null) {
    console.log("error для использования метода .reuseGroup свойство должно иметь поле this.groupArray");
    return;
  }

  var newArrLength = arrayWithObjects.length;
  var oldArrLength = this.groupChild.length;
  var add = 0;
  var remove = 0;
  if (newArrLength > oldArrLength) add = newArrLength - oldArrLength;
  if (newArrLength < oldArrLength) remove = oldArrLength - newArrLength;

  for (var i = 0; i < this.groupChild.length; i++) {
    this.groupChild[i].setAllProps(arrayWithObjects[i]);

    for (var key in this.groupChild[i].props) {
      this.groupChild[i].props[key].prop = null;
    }
  }

  if (add > 0) {
    for (var t = 0; t < add; t++) {
      this.createInGroup(arrayWithObjects[oldArrLength + t]);
    }
  }

  if (remove > 0) {
    for (var f = 0; f < remove; f++) {
      this.removeFromGroup(this.groupChild.length - 1);
    }
  }
};

PropGroup.prototype.createInGroup = function (props, insertLocation) {
  if (this.groupArray == null && this.getGroupsArray() == null) {
    console.log("error для использования метода createInGroup свойство должно иметь поле this.groupArray");
    return;
  }

  var container = this.groupArray.add(props);
  this.addToGroup(container, insertLocation);
};

PropGroup.prototype.createNewGroup = function (groupArr, componentName) {
  if (this.groupArray != null && this.groupArray.pathToComponent != undefined && this.groupArray.pathToComponent == componentName) {
    this.reuseGroup(groupArr);
  } else {
    if (this.groupChild != undefined) {
      this.clearGroup();
    } else {
      this.groupChild = [];
    }

    this.groupArray = this.rootLink.state[componentName];

    for (var i = 0; i < groupArr.length; i++) {
      this.createInGroup(groupArr[i]);
    }
  }
};

PropGroup.prototype.addToGroup = function (container, insertLocation) {
  var loc = "and";
  if (insertLocation == "front") loc = 0;
  if (insertLocation != undefined && typeof insertLocation == 'number') loc = insertLocation;
  this.groupArray = this.rootLink.state[container.pathToCоmponent];
  container.groupParent = this;

  if (loc == "and") {
    this.htmlLink.appendChild(container.htmlLink);
    this.groupChild.push(container);
    container.groupId = this.groupChild.length - 1;
  } else if (typeof loc == 'number') {
    this.htmlLink.insertBefore(container.htmlLink, this.htmlLink.children[loc]);
    this.groupChild.splice(insertLocation, 0, container);

    for (var i = insertLocation; i < this.groupChild.length; i++) {
      this.groupChild[i].groupId = i;
    }
  }
};

PropGroup.prototype.initGroup = function (containerName, propName) {
  var groupItems = this.htmlLink.children;
  var countItems = 0;

  if (groupItems.length != 0) {
    for (var i = 0; i < groupItems.length; i++) {
      var objToFind = groupItems[i].dataset;
      var nameVirtualArray = null;
      var nameContainer = null;

      for (var key5 in objToFind) {
        if (objToFind[key5] == "container" || objToFind[key5] == "template") {
          for (var key57 in this.rootLink.description.virtualArrayComponents) {
            if (this.rootLink.description.virtualArrayComponents[key57].container == [key5]) {
              nameVirtualArray = key57;
              nameContainer = key5;
              countItems++;
            }
          }

          if (nameContainer == null) console.log("error- контейнера " + key5 + " не найдено в нутри контейнера " + containerName + " index - " + this.parentContainer.index + " проверьте правельность названия ключей в html коде");

          if (nameVirtualArray != null && this.rootLink.state[nameVirtualArray] == undefined) {
            this.rootLink.state[nameVirtualArray] = new HTMLixArray("virtual-array", groupItems[i], this.rootLink, nameVirtualArray, undefined);
          }

          if (nameVirtualArray != null && nameContainer != null && objToFind[key5] == "container") {
            var container = new Container(groupItems[i], nameContainer, this.rootLink.description.virtualArrayComponents[nameVirtualArray].props, this.rootLink.description.virtualArrayComponents[nameVirtualArray].methods, this.rootLink.state[nameVirtualArray].data.length, nameVirtualArray, this.rootLink, false);
            container.renderType = "container-inner";
            container.groupParent = this;
            this.rootLink.state[nameVirtualArray].data.push(container);
            this.groupChild.push(container);
            this.groupArray = this.rootLink.state[nameVirtualArray]; //console.log(this);
            //console.log('/////////////////');

            container.groupId = this.groupChild.length - 1;
            if (container.createdContainer != undefined) container.createdContainer();
          } else if (objToFind[key5] == "template") {
            this.groupArray = this.rootLink.state[nameVirtualArray];
            groupItems[i].setAttribute('style', "");
            groupItems[i].dataset[key5] = "container";
            this.rootLink.state[nameVirtualArray].templateData = groupItems[i].cloneNode(true);
            groupItems[i].remove();
          } else {
            if (typeof propName != "string") {
              console.log("error- проверьте правельность селектора для ключа " + propName[0] + " в контейнере " + containerName);
            } else {
              console.log("error- контейнера с ключем " + key5 + " не найдено проверьте правельность названия ключей после data- в html коде");
            }
          }
        }
      }
    }

    if (groupItems.length > countItems) console.log("warn - элементов в свойстве " + propName + " контейнера " + containerName + " index - " + this.parentContainer.index + " создано меньше чем обьявлено в теге, проверьте корректность написания ключей ");
  }
};
function PropEventEmiter(htmlLink, propType, propName, eventMethod, pathToComponent, parentComponent, rootLink) {
  this.emiterKey = "";
  this.emiter = "";
  PropSubtype.call(this, htmlLink, propType, propName, pathToComponent, parentComponent, rootLink); // console.log(this);

  this.emiterKey = "key" + Math.floor(Math.random() * 89999 + 10000);
  this.emiter = this.rootLink.eventProps[this.type];
  this.rootLink.eventProps[this.type].addListener(htmlLink, eventMethod.bind(this), this.type, this.emiterKey);
}

PropEventEmiter.prototype.getProp = function () {
  return this.type;
};

PropEventEmiter.prototype.setProp = function () {
  return false;
};

PropEventEmiter.prototype.removeProp = function () {
  return false;
};

PropEventEmiter.prototype.component = function () {
  return this.rootLink.state[this.pathToCоmponent];
};

function PropStandartEvent(htmlLink, propType, propName, eventMethod, pathToComponent, parentComponent, rootLink) {
  this.events = {};
  PropSubtype.call(this, htmlLink, propType, propName, pathToComponent, parentComponent, rootLink); //console.log(this);

  this.events[this.type] = eventMethod.bind(this);
  this.htmlLink.addEventListener(this.type, this.events[this.type]);
}

PropStandartEvent.prototype.component = function () {
  return this.rootLink.state[this.pathToCоmponent];
};

PropStandartEvent.prototype.getProp = function () {
  return this.type;
};

PropStandartEvent.prototype.setProp = function (value, eventMethod) {
  if (eventMethod == undefined) {
    console.log("не определен обработчик для события-" + value);
    return;
  }

  this.events[value] = eventMethod.bind(this);
  this.htmlLink.addEventListener(value, this.events[value]);
  return;
};

PropStandartEvent.prototype.removeProp = function (value) {
  this.htmlLink.removeEventListener(value, this.events[value]);
  delete this.events[value];
  return;
};

PropStandartEvent.prototype.disableEvent = function (value) {
  if (this.events[value] != undefined) {
    if (this[value + 'disable'] != undefined) {
      return;
    }

    this[value + 'disable'] = value;
    this.htmlLink.removeEventListener(value, this.events[value]);
  } else {
    console.log("обработчика с таким событием не найдено");
  }
};

PropStandartEvent.prototype.enableEvent = function (value) {
  if (this.events[value] != undefined) {
    if (this[value + 'disable'] == undefined) {
      return;
    }

    delete this[value + 'disable'];
    this.htmlLink.addEventListener(value, this.events[value]);
  } else {
    console.log("обработчика с таким событием не найдено");
  }
};
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function PropVariant(htmlLink, propType, propName, pathToComponent, parentComponent, rootLink, newProps) {
  this.renderChild = null;
  PropSubtype.call(this, htmlLink, propType, propName, pathToComponent, parentComponent, rootLink);

  if (newProps == undefined || newProps[propName] == undefined || _typeof(newProps[propName]) != "object" || newProps[propName].componentName == undefined) {
    this.initRenderVariant();
  } else {
    this.removeAllChild();
  }
}

PropVariant.prototype.component = function () {
  return this.rootLink.state[this.pathToCоmponent];
};

PropVariant.prototype.removeAllChild = function () {
  var children = this.htmlLink.children;
  var count = children.length;

  for (var p = 0; p < count; p++) {
    children[0].remove();
  }
};

PropVariant.prototype.getProp = function (value) {
  var return_obg = {};

  if (value == undefined) {
    if (this.renderChild.type == "container") {
      return_obg = this.renderChild.getAllProps();
    } else if (this.renderChild.type == "array") {
      return_obg = this.renderChild.getAll();
    }

    return_obg["componentName"] = this.renderChild.pathToCоmponent;
    return return_obg;
  } else if (_typeof(value) == "object") {
    if (this.renderChild.type == "container") {
      return_obg = this.renderChild.getAllProps(value);
    } else if (this.renderChild.type == "array") {
      return_obg = this.renderChild.getAll(value);
    }

    if (value.componentName != undefined) {
      return_obg["componentName"] = this.renderChild.pathToCоmponent;
    }

    return return_obg;
  }
};

PropVariant.prototype.setProp = function (value) {
  if (typeof value == "string") {
    this.render(value);
  } else if (_typeof(value) == "object" && value.renderType != undefined && value.renderType == "container-inner") {
    this.renderByContainer(value);
  } else if (_typeof(value) == "object" && value.componentName != undefined) {
    this.setOrCreateAndRender(value);
  } else {
    console.log("не удается отрисовать контейнер в render-variant если вы хотите отрисовать компонент то используйте текстовый параметр");
  }

  return;
};

PropVariant.prototype.removeProp = function (value) {
  var isRemove = false;

  if (this.renderChild.renderType == "container-inner") {
    isRemove = this.renderChild.remove(true);
  }

  if (isRemove == null) {
    this.renderChild.renderParent = null;
  }

  this.renderChild = null;
  this.htmlLink.innerHTML = "";
  return;
};

PropVariant.prototype.render = function (nameComponent) {
  if (this.renderChild == undefined && nameComponent == undefined) {
    console.log("не известен компонент для рендера");
    return "undefinit render-variant";
  }

  if (nameComponent != undefined && this.rootLink.state[nameComponent] != undefined) {
    this.renderChild = this.rootLink.state[nameComponent];
    this.rootLink.state[nameComponent].renderParent = this;
    this.htmlLink.innerHTML = "";
    this.htmlLink.appendChild(this.renderChild.htmlLink);
  } else {
    console.log("не найден компонент " + nameComponent + " для рендера");
    return "undefinit render-variant";
  }
};

PropVariant.prototype.renderByContainer = function (containerLink) {
  if (containerLink != undefined && containerLink.renderType == "container-inner") {
    if (this.renderChild != undefined && this.renderChild.renderType != undefined && this.renderChild.renderType == "container-inner") this.renderChild.remove(true);
    this.renderChild = containerLink;
    this.renderChild.renderParent = this;
  } else {
    console.log(" для метода renderByContainer необходимо прередать container с renderType='container-inner'");
    return "undefined render-variant-htmlLink";
  }

  this.htmlLink.innerHTML = "";
  this.htmlLink.appendChild(this.renderChild.htmlLink);
};

PropVariant.prototype.setOrCreateAndRender = function (objWidthProps) {
  if (objWidthProps.componentName == undefined) {
    console.log("забыли указать имя компонента  .componentName в обьекте-параметре objWidthProps");
    return;
  }

  var component = this.rootLink.state[objWidthProps.componentName];

  if (component.renderType == "virtual-array") {
    if (this.renderChild != undefined && this.renderChild.pathToCоmponent != undefined && this.renderChild.pathToCоmponent == objWidthProps.componentName) {
      this.renderChild.setAllProps(objWidthProps);
    } else {
      var container = component.add(objWidthProps);
      this.renderByContainer(container);
    }
  } else if (component.renderType == "container-outer") {
    component.setAllProps(objWidthProps);
    this.render(objWidthProps.componentName);
  } else if (component.renderType == "array") {
    if (objWidthProps.data == undefined) {
      console.log("для отображения массива с новыми данными, в параметре objWidthProps.data должен содержаться массив с объектами");
      return;
    }

    this.render(objWidthProps.componentName);
    component.reuseAll(objWidthProps.data);
  }
};

PropVariant.prototype.initRenderVariant = function () {
  var objIs = this.htmlLink.firstElementChild;

  if (objIs != undefined) {
    var objToFind = objIs.dataset;

    for (var key5 in objToFind) {
      if (objToFind[key5] == "array") {
        if (this.rootLink.state[key5] == undefined && this.rootLink.description[key5] != undefined) this.rootLink.arrayInit(objIs, this.rootLink.description, key5);
        if (this.rootLink.state[key5] == undefined && this.rootLink.description[key5] == undefined && this.rootLink.description.fetchComponents != undefined && this.rootLink.description.fetchComponents[key5] != undefined) this.rootLink.arrayInit(objIs, this.rootLink.description.fetchComponents, key5);
        this.renderChild = this.rootLink.state[key5];
        this.renderChild.renderParent = this;
      }

      if (objToFind[key5] == "container") {
        if (this.rootLink.description[key5] != undefined && this.rootLink.state[key5] == undefined) {
          this.rootLink.containerInit(objIs, this.rootLink.description, key5);

          if (this.rootLink.state[key5] != undefined) {
            this.renderChild = this.rootLink.state[key5];
            this.renderChild.renderParent = this;
          }
        } else if (this.rootLink.description[key5] != undefined && this.rootLink.state[key5] != undefined) {
          this.renderChild = this.rootLink.state[key5];
          this.renderChild.renderParent = this;
        } else if (this.rootLink.description[key5] == undefined && this.rootLink.state[key5] == undefined && this.rootLink.description.fetchComponents != undefined && this.rootLink.description.fetchComponents[key5] != undefined) {
          this.rootLink.containerInit(objIs, this.rootLink.description.fetchComponents, key5);
          this.renderChild = this.rootLink.state[key5];
          this.renderChild.renderParent = this;
        } else {
          var nameVirtualArray = null;
          var nameContainer = null;

          for (var key4 in this.rootLink.description.virtualArrayComponents) {
            if (this.rootLink.description.virtualArrayComponents[key4].container == [key5]) {
              nameVirtualArray = key4;
              nameContainer = key5;
            }
          }

          if (nameVirtualArray == null || nameContainer == null) {
            console.log("error- компонента " + key5 + "  не найдено  убедитесь в коректности названия ключей после data");
            return;
          }

          if (nameVirtualArray != null && this.rootLink.state[nameVirtualArray] == undefined) {
            var selector = undefined;
            if (this.rootLink.description.virtualArrayComponents[nameVirtualArray].selector != undefined) selector = this.rootLink.description.virtualArrayComponents[nameVirtualArray].selector;
            this.rootLink.state[nameVirtualArray] = new HTMLixArray("virtual-array", objIs, this.rootLink, nameVirtualArray, selector);
          }

          if (nameVirtualArray != null && nameContainer != null) {
            var container = new Container(objIs, nameContainer, this.rootLink.description.virtualArrayComponents[nameVirtualArray].props, this.rootLink.description.virtualArrayComponents[nameVirtualArray].methods, this.rootLink.state[nameVirtualArray].data.length, nameVirtualArray, this.rootLink);
            container.renderType = "container-inner";
            container.renderParent = this;
            this.rootLink.state[nameVirtualArray].data.push(container);
            this.renderChild = container;
          }
        }
      }
    }
  }
};
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function HTMLixState(StateMap) {
  this.description = StateMap;
  this.state = {};
  this.eventProps = {};
  this.stateMethods = {};
  this.stateProperties = {};

  if (StateMap.eventEmiters != undefined) {
    for (var key in StateMap.eventEmiters) {
      this.eventProps[key] = new EventEmiter(key, StateMap.eventEmiters[key].prop, {}, {});
    }
  }

  for (var key in StateMap) {
    if (key == "stateSettings") {
      this.stateSettings = StateMap[key];
      continue;
    }

    if (key == "stateMethods") {
      this.stateMethods = StateMap[key];
      continue;
    }

    if (key == 'stateProperties') {
      this.stateProperties = StateMap[key];
      continue;
    }

    if (key == 'eventEmiters' || key == 'virtualArrayComponents') {
      continue;
    }

    if (key == "fetchComponents") {
      var context = this;
      var StateMap1 = StateMap.fetchComponents;
      if (StateMap.stateSettings == undefined) StateMap.stateSettings = {};
      if (StateMap.stateSettings.templatePath == undefined) StateMap.stateSettings.templatePath = "/template/template.html";
      this.fetchTemplates(function (divEl) {
        for (var key10 in StateMap1) {
          var node = divEl.querySelector('[data-' + key10 + ']');

          if (node == undefined) {
            console.log("Error - в Html коде нет атрибута data-" + key10 + " для компонента из объекта fetchComponents");
          }

          var type = node.dataset[key10];

          if (type == "array") {
            context.arrayInit(node, StateMap1, key10);
          } else if (type == "container") {
            context.containerInit(node, StateMap1, key10);
          }
        }

        context.verifyFetchComponents(divEl);
      }, StateMap.stateSettings.templatePath);
      continue;
    }

    initStandartComponents(this, StateMap, key);
  }

  function initStandartComponents(context, StateMap, key) {
    var node = document.querySelector('[data-' + key + ']');

    if (node == undefined) {
      console.log("Error - в Html коде нет атрибута data-" + key + " проверьте корректность названия ключей в html");
    }

    var type = node.dataset[key];

    if (type == "array") {
      context.arrayInit(node, StateMap, key);
    } else if (type == "container") {
      context.containerInit(node, StateMap, key);
    } else {
      console.log("erorr - неправильно указан тип для контейнера либо массива " + key);
    }
  }

  console.log("source-map");
}

HTMLixState.prototype.containerInit = function (node, StateMap, key) {
  if (this.state[key] != undefined) return;
  if (node == null) node = document.querySelector('[data-' + key + ']');
  if (node == null || node == undefined) console.log("error в html разметке не найден контейнер " + key);
  if (StateMap[key] == undefined) console.log("error- проверьте корректность parent ключей в html - коде");
  this.state[key] = new Container(node, key, StateMap[key].props, StateMap[key].methods, null, key, this);
};

HTMLixState.prototype.arrayInit = function (node, StateMap, key) {
  if (this.state[key] != undefined) return;
  if (node == null) node = document.querySelector('[data-' + key + ']');
  if (node == null || node == undefined) console.log("error в html разметке не найден контейнер " + key);
  var lengthChildren = node.children.length;
  if (StateMap[key].container == undefined) console.log("error- забыли указать контейнер для массива " + key);
  var containerHTML = node.querySelectorAll('[data-' + StateMap[key].container + ']');
  var array_selector = undefined;
  if (StateMap[key].selector != undefined) array_selector = StateMap[key].selector;
  if (containerHTML.length == 0) console.log("error - в html коде нет атрибута data-" + StateMap[key].container + " либо не создан шаблон для массива " + key);
  this.state[key] = new HTMLixArray(node, containerHTML[0], this, key, array_selector);

  if (StateMap[key]["arrayProps"] != undefined) {
    this.state[key]["props"] = {};

    for (var t = 0; t < StateMap[key]["arrayProps"].length; t++) {
      if (typeof StateMap[key]["arrayProps"][t] == "string") {
        var htmlLink = this.state[key].htmlLink.querySelectorAll('[data-' + key + '-' + StateMap[key]["arrayProps"][t] + ']')[0];
        if (htmlLink == undefined) htmlLink = this.state[key].htmlLink;
        this.state[key]["props"][StateMap[key]["arrayProps"][t]] = constructorProps(htmlLink, key, StateMap[key]["arrayProps"][t], StateMap[key]["arrayMethods"][StateMap[key]["arrayProps"][t]], key, this.state[key], this);
      } else {
        var string = StateMap[key]["arrayProps"][t][0];
        var selector = StateMap[key]["arrayProps"][t][2];
        var htmlLinkToProp = this.state[key].htmlLink;

        if (selector != "") {
          htmlLinkToProp = this.state[key].htmlLink.querySelector(selector);
          if (htmlLinkToProp == undefined) console.log("error не возможно найти селектор для свойства " + selector + " массива " + key + " проверьте правильность селектора");
          continue;
        }

        this.state[key]["props"][string] = constructorProps(htmlLinkToProp, key, StateMap[key]["arrayProps"][t], StateMap[key]["arrayMethods"][string], key, this.state[key], this);
      }
    }
  }

  var i = 0;

  if (containerHTML[0].dataset[StateMap[key].container] == "template") {
    containerHTML[0].dataset[StateMap[key].container] = "container";
    containerHTML[0].setAttribute('style', "");
    this.state[key].templateData = containerHTML[0].cloneNode(true);
    containerHTML[0].remove();
    if (containerHTML.length == 1) return;
    i = 1;
  }

  for (var j = 0, i; i < containerHTML.length; j++, i++) {
    if (containerHTML[i].dataset[StateMap[key].container] != "container") {
      console.log("erorr - неправильно указан тип для контейнера " + StateMap[key].container + " index - " + i + " массива " + key);
    }

    var container23 = new Container(containerHTML[i], StateMap[key].container, StateMap[key].props, StateMap[key].methods, j, key, this);
    container23.renderType = "container-inner";
    this.state[key].data[j] = container23;
  }

  if (this.state[key].data.length < lengthChildren) {
    console.log("warn - контейнеров в массиве " + key + " создано меньше чем обьявлено в html, проверьте корректность написания всех ключей в html коде либо удалите лишние элементы не соответствующие контейнеру - " + StateMap[key].container);
  }

  if (this.state[key].data.length > lengthChildren) {
    console.log("warn - контейнеров " + StateMap[key].container + " в массиве " + key + " создано больше чем обьявлено в html, проверьте что контейнеры распологаются в массиве непосредственно, старайтесь избегать создания порежуточных тегов");
  }
};

HTMLixState.prototype.verifyFetchComponents = function (divEl) {
  if (this.description.virtualArrayComponents != undefined) {
    for (var key in this.description.virtualArrayComponents) {
      if (this.state[key] == undefined) {
        var containerHTML = divEl.querySelector('[data-' + this.description.virtualArrayComponents[key].container + ']');

        if (containerHTML == null) {
          console.log("Error в шаблоне " + this.stateSettings.templatePath + " не найдено компонента " + key + " - виртуального массива,  проверьте его наличие и правильность ключей в шаблоне");
          return;
        }

        this.state[key] = new HTMLixArray("virtual-array", containerHTML, this, key, undefined);
      }
    }

    if (this.stateMethods != undefined && this.stateMethods.onLoadAll != undefined) this.stateMethods.onLoadAll.bind(this)();
  }
};

HTMLixState.prototype.addContainer = function (stateNameProp, properties, insertLocation) {
  if (this.state[stateNameProp] == undefined) console.log("не получается найти компонент" + stateNameProp + "в this.state");
  var stateArray = this.state[stateNameProp]; //console.log(stateArray);

  if (stateArray.type != "array") {
    console.log("создать контейнер можно только в массиве array");
    return;
  }

  if (insertLocation != undefined && insertLocation != "and" && isNaN(insertLocation)) {
    console.log("Введите корректную позицию для вставки контейнера в массив " + stateNameProp);
    return;
  }

  var index = 0;

  if (insertLocation == undefined || insertLocation == "and") {
    index = stateArray.data.length;
  } else if (typeof insertLocation == 'number') {
    if (insertLocation > stateArray.data.length) insertLocation = stateArray.data.length;
    index = insertLocation;
  }

  var Link = stateArray.templateData.cloneNode(true);
  var desc = this.description[stateNameProp]; //console.log(this.description);

  if (desc == undefined) {
    if (this.description.virtualArrayComponents != undefined && this.description.virtualArrayComponents[stateNameProp] != undefined) {
      desc = this.description.virtualArrayComponents[stateNameProp];
    } else {
      if (this.description.fetchComponents != undefined && this.description.fetchComponents[stateNameProp] != undefined) {
        desc = this.description.fetchComponents[stateNameProp];
      } else {
        console.log("eror- не получается найти описание для компонета " + stateNameProp + " проверьте существуют ли обьекты fetchComponents, virtualArrayComponents в описании, параметре StateMap");
      }
    }
  }

  var container = new Container(Link, desc.container, desc.props, desc.methods, index, stateNameProp, this, true, properties);
  container.renderType = "container-inner";
  var htmlLink = stateArray.htmlLink;

  if (stateArray.selector != undefined) {
    htmlLink = htmlLink.querySelector(stateArray.selector);
    if (htmlLink == null || htmlLink == undefined) console.log("error - не удается найти селектор " + stateArray.selector + " для массива " + stateNameProp);
  }

  if (insertLocation == undefined || insertLocation == "and") {
    if (this.description.virtualArrayComponents == undefined) {
      htmlLink.appendChild(Link);
    } else {
      if (this.description.virtualArrayComponents[stateNameProp] == undefined) htmlLink.appendChild(Link);
    }

    stateArray.data.push(container);
  } else if (typeof insertLocation == 'number') {
    if (this.description.virtualArrayComponents == undefined) {
      htmlLink.insertBefore(Link, htmlLink.children[insertLocation]);
    } else {
      if (this.description.virtualArrayComponents[stateNameProp] == undefined) htmlLink.insertBefore(Link, htmlLink.children[insertLocation]);
    }

    stateArray.data.splice(insertLocation, 0, container);

    for (var i = insertLocation; i < stateArray.data.length; i++) {
      stateArray.data[i].index = i;
    }
  }

  if (properties != undefined) container.setAllProps(properties);
  return container;
};

HTMLixState.prototype.changeOrder = function (stateNameProp, newOrderArr) {
  var stateArray = this.state[stateNameProp];
  var htmlLink = stateArray.htmlLink;

  if (stateArray.selector != undefined) {
    htmlLink = htmlLink.querySelector(stateArray.selector);
    if (htmlLink == null || htmlLink == undefined) console.log("error - не удается найти селектор " + stateArray.selector + " для массива " + stateNameProp);
  }

  if (newOrderArr.length != stateArray.data.length) {
    console.log("в массиве newOrderArr, должно быть столько же элементов скольео и в массиве stateNameProp.data");
    return;
  }

  var newData = [];

  for (var i = 0; i < newOrderArr.length; i++) {
    newData.push(stateArray.data[newOrderArr[i]]);
  }

  stateArray.data = newData;
  stateArray.htmlLink.innerHTML = "";

  for (var k = 0; k < stateArray.data.length; k++) {
    stateArray.htmlLink.appendChild(stateArray.data[k].htmlLink);
    stateArray.data[k].index = k;
  }
};

HTMLixState.prototype.removeAll = function (stateNameProp, widthChild) {
  if (this.state[stateNameProp].type != "array") return;

  for (var index = 0; index < this.state[stateNameProp].data.length; index++) {
    this.clearContainerProps(stateNameProp, index, widthChild);
    this.state[stateNameProp].data[index].htmlLink.remove();
  }

  this.state[stateNameProp].data.length = 0;
  this.state[stateNameProp].data = [];
};

HTMLixState.prototype.removeByIndex = function (stateNameProp, index, widthChild) {
  this.removeByIndexes(stateNameProp, [index], widthChild);
};

HTMLixState.prototype.removeByIndexes = function (stateNameProp, indexArray, widthChild) {
  if (this.state[stateNameProp].type != "array") return;

  if (indexArray.length == undefined) {
    console.log("error - некорректно задан второй аргумент для функции removeByIndexes, проверьте что это не пустой массив, а также номер эелемента для удаления");
    return;
  }

  for (var r = 0; r < indexArray.length; r++) {
    if (indexArray[r] > this.state[stateNameProp].data.length - 1) {
      console.log("error - индекс для удаления " + indexArray[r] + " больше количества элементов в массиве " + stateNameProp);
      return;
    }

    this.clearContainerProps(stateNameProp, indexArray[r], widthChild);
    this.state[stateNameProp].data[indexArray[r]].htmlLink.remove();
  }

  var newData = this.state[stateNameProp].data.filter(function (container, i) {
    return !indexArray.some(function (numb) {
      return numb == i;
    });
  });
  this.state[stateNameProp].data = newData;

  for (var i = 0; i < this.state[stateNameProp].data.length; i++) {
    this.state[stateNameProp].data[i].index = i;
  }
};

HTMLixState.prototype.clearContainerProps = function (stateNameProp, index, widthChild) {
  var container = this.state[stateNameProp].data[index];

  for (key in container.props) {
    if (container.props[key].emiterKey != undefined) {
      this.eventProps[container.props[key].type].removeListener(container.props[key].htmlLink);
    } else if (container.props[key].events != undefined) {
      for (key1 in container.props[key].events) {
        container.props[key].htmlLink.removeEventListener(key1, container.props[key].events[key1]);
        delete container.props[key].events[key1];
      }
    } else if (widthChild != undefined && widthChild == true && container.props[key].renderChild != undefined && container.props[key].renderChild.renderType == "container-inner") {
      container.props[key].renderChild.remove(true);
    } else if (widthChild != undefined && widthChild == true && container.props[key].groupChild != undefined && container.props[key].groupChild.length > 0) {
      var indexesArr = [];

      for (var it = 0; it < container.props[key].groupChild.length; it++) {
        indexesArr.push(container.props[key].groupChild[it].index);
      }

      this.removeByIndexes(container.props[key].groupChild[0].pathToCоmponent, indexesArr, true);
    }
  }
};

HTMLixState.prototype.getDifrentFilds = function (array, fild) {
  var newArr = [];

  for (var i = 0; i < array.length; i++) {
    var compareItem = array[i];

    if (fild) {
      compareItem = array[i][fild];
      if (_typeof(compareItem) == "object") compareItem = JSON.stringify(array[i][fild]);
    } else {
      if (_typeof(array[i]) == "object") compareItem = JSON.stringify(array[i]);
    }

    var isPersist = false;
    newArr.forEach(function (newItem) {
      var compareItem_2 = newItem;

      if (fild) {
        compareItem_2 = newItem[fild];
        if (_typeof(compareItem_2) == "object") compareItem_2 = JSON.stringify(newItem[fild]);
      } else {
        if (_typeof(newItem) == "object") compareItem_2 = JSON.stringify(newItem);
      }

      if (compareItem_2 == compareItem) isPersist = true;
    });

    if (!isPersist) {
      newArr.push(array[i]);
    }
  }

  return newArr;
};

HTMLixState.prototype.fetchTemplates = function (callb, templatePath) {
  if (templatePath == undefined) console.log("error не указана дериктория для поиска шаблона в настройках .stateSettings.templatePath");
  fetch(templatePath).then(function (response) {
    if (response.ok) {
      return response.text();
    }

    throw new Error('Network response was not ok');
  }).then(function (text) {
    var div = document.createElement('div');
    div.innerHTML = text;
    callb(div);
  })["catch"](function (error) {
    console.log(error);
  });
};

HTMLixState.prototype.capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
//# sourceMappingURL=htmlix.js.map
