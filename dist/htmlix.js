function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function HTMLixArray(node, containerHTML, rootLink, pathToComponent, selector) {
  this.htmlLink = node, this.data = [], this.rootLink = rootLink, this.pathToComponent = pathToComponent, this.type = "array", this.templateData = containerHTML.cloneNode(true),
  /*this.id = null, */
  this.index = null, this.renderType = "array", this.selector = selector;
  if (node == "virtual-array") this.renderType = "virtual-array"; ///container_extend

  if (this.renderType == "virtual-array") {
    var thisArrDesc = this.rootLink.description.virtualArrayComponents[this.pathToComponent];
    var parentContainerName = thisArrDesc.container_extend;
  } else {
    var thisArrDesc = this.rootLink.description[this.pathToComponent];
    if (thisArrDesc == undefined) thisArrDesc = this.rootLink.description.fetchComponents[this.pathToComponent];
    var parentContainerName = thisArrDesc.container_extend;
  }

  if (parentContainerName != undefined) {
    this.rootLink.containerExtend(parentContainerName, thisArrDesc.props, thisArrDesc.methods);
  }
} ///добавляет контейнер в массив 


HTMLixArray.prototype.add = function (properties, insertLocation) {
  if (insertLocation != undefined && insertLocation != "and" && isNaN(insertLocation)) {
    console.log("Введите корректную позицию для вставки контейнера в массив " + this.pathToComponent);
    return;
  }

  var index = 0;

  if (insertLocation == undefined || insertLocation == "and") {
    index = this.data.length;
  } else if (typeof insertLocation == 'number') {
    if (insertLocation > this.data.length) insertLocation = this.data.length;
    index = insertLocation;
  }

  var Link = this.templateData.cloneNode(true);
  var desc = this.rootLink.description[this.pathToComponent];

  if (desc == undefined) {
    if (this.rootLink.description.virtualArrayComponents != undefined && this.rootLink.description.virtualArrayComponents[this.pathToComponent] != undefined) {
      desc = this.rootLink.description.virtualArrayComponents[this.pathToComponent];
    } else {
      if (this.rootLink.description.fetchComponents != undefined && this.rootLink.description.fetchComponents[this.pathToComponent] != undefined) {
        desc = this.rootLink.description.fetchComponents[this.pathToComponent];
      } else {
        console.log("eror- не получается найти описание для компонета " + this.pathToComponent + " проверьте существуют ли обьекты fetchComponents, virtualArrayComponents в описании, параметре StateMap");
      }
    }
  }

  var container = new Container(Link, desc.container, desc.props, desc.methods, index, this.pathToComponent, this.rootLink, true, properties);
  var htmlLink = this.htmlLink;

  if (this.selector != undefined) {
    htmlLink = htmlLink.querySelector(this.selector);
    if (htmlLink == null) console.log("error - не удается найти селектор " + this.selector + " для массива " + this.pathToComponent);
  }

  if (insertLocation == undefined || insertLocation == "and") {
    if (this.rootLink.description.virtualArrayComponents == undefined) {
      htmlLink.appendChild(Link);
    } else {
      if (this.rootLink.description.virtualArrayComponents[this.pathToComponent] == undefined) htmlLink.appendChild(Link);
    }

    this.data.push(container);
  } else if (typeof insertLocation == 'number') {
    if (this.rootLink.description.virtualArrayComponents == undefined) {
      htmlLink.insertBefore(Link, htmlLink.children[insertLocation]);
    } else {
      if (this.rootLink.description.virtualArrayComponents[this.pathToComponent] == undefined) htmlLink.insertBefore(Link, htmlLink.children[insertLocation]);
    }

    this.data.splice(insertLocation, 0, container);

    for (var i = insertLocation; i < this.data.length; i++) {
      this.data[i].index = i;
    }
  }

  if (properties != undefined) container.setAllProps(properties);
  return container;
}; ///удаляет контейнер или группу контейнеров из массива по индексам	


HTMLixArray.prototype.removeIndex = function (indexArray, widthChild) {
  if (widthChild != false) widthChild = true;
  if (_typeof(indexArray) != "object") indexArray = [indexArray];

  for (var r = 0; r < indexArray.length; r++) {
    if (indexArray[r] > this.data.length - 1) {
      console.log("error - индекс для удаления " + indexArray[r] + " больше количества элементов в массиве " + this.pathToComponent);
      return;
    }

    this.rootLink.clearContainerProps(this.pathToComponent, indexArray[r], widthChild);
    this.data[indexArray[r]].htmlLink.remove();
  }

  var newData = this.data.filter(function (container, i) {
    return !indexArray.some(function (numb) {
      return numb == i;
    });
  });
  this.data = newData;

  for (var i = 0; i < this.data.length; i++) {
    this.data[i].index = i;
  }
}; //удаляет все контейнеры из массива	


HTMLixArray.prototype.removeAll = function (widthChild) {
  if (widthChild != false) widthChild = true;

  for (var index = 0; index < this.data.length; index++) {
    this.rootLink.clearContainerProps(this.pathToComponent, index, widthChild);
    this.data[index].htmlLink.remove();
  }

  this.data.length = 0;
  this.data = [];
}; //метод обновляет свойства всех контейнеров, а также обнуляет поле prop каждого свойства, если переданных в метод
//объектов со свойствами больше контейнеров в массиве, то добавляет контейнеры
//если меньше то удаляет лишние	


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
      if (this.data[i].props[key].prop != undefined) this.data[i].props[key].prop = null;
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
}; //получает набор объектов где названия ключей - имена свойств контейнеров, а данные - данные свойств контейнеров


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
}; //изменяет проядок контейнеров в массиве и html разметке


HTMLixArray.prototype.order = function (newOrderArr) {
  var htmlLink = this.htmlLink;

  if (this.selector != undefined) {
    htmlLink = htmlLink.querySelector(this.selector);
    if (htmlLink == null) console.log("error - не удается найти селектор " + this.selector + " для массива " + this.pathToComponent);
  }

  if (newOrderArr.length != this.data.length) {
    console.log("в массиве newOrderArr, должно быть столько же элементов сколько и в исходном массиве ");
    return;
  }

  var newData = [];

  for (var i = 0; i < newOrderArr.length; i++) {
    newData.push(this.data[newOrderArr[i]]);
  }

  this.data = newData;
  this.htmlLink.innerHTML = "";

  for (var k = 0; k < this.data.length; k++) {
    this.htmlLink.appendChild(this.data[k].htmlLink);
    this.data[k].index = k;
  }
};

HTMLixArray.prototype.$ = function (componentName) {
  if (componentName != undefined) return this.rootLink.state[componentName];
  return this.rootLink;
};

HTMLixArray.prototype.$$ = function (eventPropName) {
  return this.rootLink.eventProps[eventPropName];
};

HTMLixArray.prototype.$methods = function (nameMethod) {
  if (nameMethod != undefined) return this.rootLink.stateMethods[nameMethod];
  return this.rootLink.stateMethods;
};

HTMLixArray.prototype.$props = function (nameProp) {
  if (nameProp != undefined) return this.rootLink.stateProperties[nameProp];
  return this.rootLink.stateProperties;
};
function Container(htmlLink, containerName, props, methods, index, pathToContainer, rootLink, isRunonCreatedContainer, newProps) {
  this.htmlLink = htmlLink;
  this.rootLink = rootLink;
  this.props = {};
  this.index = index;
  this.pathToCоmponent = pathToContainer;
  this.name = containerName;
  this.type = "container";
  this.renderType = "container-outer";
  if (pathToContainer != containerName) this.renderType = "container-inner"; ///container_extend

  if (this.renderType == "container-outer") {
    var thisCont = this.rootLink.description[this.pathToCоmponent];
    if (thisCont == undefined) thisCont = this.rootLink.description.fetchComponents[this.pathToCоmponent];
    var parentContainerName = thisCont.container_extend;

    if (parentContainerName != undefined) {
      this.rootLink.containerExtend(parentContainerName, props, methods);
    }
  }

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
      var type = props[i2][1];

      if (type == "aux") {
        if (methods[string] == undefined) console.log("error название свойства " + string + " не совпадает с названием метода");
        if (this.methods == undefined) this.methods = {};
        this.methods[string] = methods[string].bind(this);
        continue;
      } else if (type == "extend") {
        var isTrue = this.rootLink.propExtend(props[i2][2], props[i2][3], props, methods, props[i2][0], i2);
        if (isTrue == false) continue;
        i2--;
        continue;
      }

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

  if (methods.onCreatedContainer != undefined) {
    this.onCreatedContainer = methods.onCreatedContainer.bind(this);

    if (isRunonCreatedContainer == undefined || isRunonCreatedContainer != false) {
      this.onCreatedContainer();
    }
  }
}

Container.prototype.remove = function (widthChild) {
  if (this.index == null) {
    console.log("conteiner without array not removing, to remove its first add container to array");
    return null;
  }

  if (this.groupId != undefined && this.groupParent != undefined) {
    this.groupParent.removeFromGroup(this.groupId);
    return;
  }

  if (this.renderParent != undefined && this.renderParent.renderChild != undefined && this.renderParent.renderChild != null) {
    this.renderParent.renderChild = null;
  }

  this.rootLink.state[this.pathToCоmponent].removeIndex([this.index], widthChild);
  return true;
};

Container.prototype.setAllProps = function (properties) {
  for (key in properties) {
    if (this.props[key] != undefined) {
      this.props[key].setProp(properties[key]);
    } else if (key != "componentName") {
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
  }

  return properties_r;
};

Container.prototype.component = function () {
  return this.rootLink.state[this.pathToCоmponent];
};

Container.prototype.$ = function (componentName) {
  if (componentName != undefined) return this.rootLink.state[componentName];
  return this.rootLink;
};

Container.prototype.$$ = function (eventPropName) {
  return this.rootLink.eventProps[eventPropName];
};

Container.prototype.$methods = function (nameMethod) {
  if (nameMethod != undefined) return this.rootLink.stateMethods[nameMethod];
  return this.rootLink.stateMethods;
};

Container.prototype.$props = function (nameProp) {
  if (nameProp != undefined) return this.rootLink.stateProperties[nameProp];
  return this.rootLink.stateProperties;
};
function HTMLixRouter(state, routes) {
  var namePathInRoutes = "";
  var _templateVar = false;
  if (state.stateSettings != undefined && state.stateSettings.templateVar != undefined) _templateVar = true;
  if (!_templateVar) namePathInRoutes = findComponent(routes); //поиск соответствующего роута

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
        pathArray.pop();
      }

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
          paramWord[y] = y;
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
      }

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


  if (!_templateVar) {
    if (routes[namePathInRoutes] != undefined && routes[namePathInRoutes].templatePath != undefined) {
      if (state.stateSettings == undefined) state.stateSettings = {};
      state.stateSettings.templatePath = routes[namePathInRoutes].templatePath;
    } else {
      console.log("router error- маршрут не найден убедитесь в правильности запроса");
    }
  } ///изменение структуры state для загрузки шаблонов для других страниц в fetch запросе


  if (!_templateVar) {
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
  }

  var stateWithRoutes = new HTMLixState(state);
  var routerObj = {
    routes: routes,
    htmlLink: {},
    component: {},
    matchRout: findComponent,
    countError: 0,
    findRouters: function findRouters(nameArrComp) {
      if (nameArrComp == undefined) {
        nameArrComp = this.matchRout(this.routes);

        if (nameArrComp == null) {
          console.log("router error - не удается найти совпадающий rout для маршрута " + window.location.pathname);
        }
      }

      for (var key in this.routes[nameArrComp].routComponent) {
        //console.log(key);
        var key2 = this.routes[nameArrComp].routComponent[key]; //console.log(key2);

        if (this.component[key2] == undefined) {
          var component = this.rootLink.state[key2];
          this.component[key2] = component;

          if (component == undefined) {
            var messPart = "warn не удалось найти компонент " + key2 + " в описании приложения;";
            if (this.countError > 0) messPart = "router error - не удается найти компонент " + key2 + " в описании приложения, проверьте правильность написания ключей в параметре routes для HTMLixRouter";
            console.log(messPart);
            this.countError = this.countError + 1;
          } //console.log(key);

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
} ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function EventEmiter(eventName, prop, listeners, listenersEventMethods, behavior, rootLink) {
  this.listeners = listeners;
  this.listenersEventMethods = listenersEventMethods;
  this.event = new Event(eventName);
  this.type = eventName;
  this.prop = prop;
  this.behavior = null;
  this.rootLink = null;

  if (behavior != undefined) {
    this.behavior = behavior.bind(this);
    this.rootLink = rootLink;
  }
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
  if (this.behavior != null) {
    var isEmit = this.behavior();
    if (isEmit == false) return;
  }

  for (key in this.listeners) {
    this.listeners[key].dispatchEvent(this.event);
  }
};

EventEmiter.prototype.setEventProp = function (prop) {
  this.prop = prop;
  this.emit();
};

EventEmiter.prototype.set = function (prop) {
  this.setEventProp(prop);
};

EventEmiter.prototype.getEventProp = function () {
  return this.prop;
};

EventEmiter.prototype.get = function (prop) {
  this.getEventProp(prop);
};

EventEmiter.prototype.$ = function (componentName) {
  if (componentName != undefined) return this.rootLink.state[componentName];
  return this.rootLink;
};

EventEmiter.prototype.$$ = function (eventPropName) {
  return this.rootLink.eventProps[eventPropName];
};

EventEmiter.prototype.$methods = function (nameMethod) {
  if (nameMethod != undefined) return this.rootLink.stateMethods[nameMethod];
  return this.rootLink.stateMethods;
};

EventEmiter.prototype.$props = function (nameProp) {
  if (nameProp != undefined) return this.rootLink.stateProperties[nameProp];
  return this.rootLink.stateProperties;
};
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function constructorProps(htmlLink, keyData1, keyData2, eventMethod, pathToContainer, parentContainer, rootLink, newProps) {
  var propType = null;

  if (_typeof(keyData2) == "object") {
    propType = keyData2[1];

    if (keyData2[0].search("data") == 0) {
      propType = "data";
      return new PropCommon(htmlLink, propType, parentContainer, keyData2[0]);
    }
  } else if (keyData2.search("data") == 0) {
    propType = "data";
    return new PropCommon(htmlLink, propType, parentContainer, keyData2);
  } else {
    propType = htmlLink.dataset[keyData1 + rootLink.capitalizeFirstLetter(keyData2)];
  }

  if (propType == null) {
    var mess = "error не определен тип свойства для data-" + keyData1 + "-" + keyData2 + " в html коде не найдено для компонента " + pathToContainer + ", index= " + parentContainer.index + " !, проверьте правильность названия свойств";
    console.log(mess);
    throw mess;
  }

  if (propType == "render-variant") {
    return new PropVariant(htmlLink, propType, keyData2, pathToContainer, parentContainer, rootLink, newProps);
  } else if (propType == "group") {
    return new PropGroup(htmlLink, propType, keyData1, keyData2, pathToContainer, parentContainer, rootLink, newProps);
  } else if (propType == "group-mix") {
    return new PropGroupMix(htmlLink, propType, keyData1, keyData2, pathToContainer, parentContainer, rootLink, newProps);
  } else if (eventMethod != undefined && rootLink.isEmiter(propType) != false) {
    return new PropEventEmiter(htmlLink, propType, keyData2, eventMethod, pathToContainer, parentContainer, rootLink);
  } else if (eventMethod != undefined && rootLink.isEvent(propType) != false) {
    return new PropStandartEvent(htmlLink, propType, keyData2, eventMethod, pathToContainer, parentContainer, rootLink);
  } else {
    return new PropCommon(htmlLink, propType);
  }
}

function PropCommon(htmlLink, propType, parentComponent, propName) {
  this.htmlLink = htmlLink;
  this.type = propType;

  if (this.type == "data") {
    this.parent = parentComponent;
    this.propName = propName;
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
  if (_typeof(propName) == "object") this.propName = propName[0];
}

PropSubtype.prototype.component = function () {
  return this.rootLink.state[this.pathToCоmponent];
};

PropSubtype.prototype.props = function (propName) {
  return this.parent.props[propName];
};

PropSubtype.prototype.methods = function (nameAuxMethod) {
  return this.parent.methods[nameAuxMethod];
};

PropSubtype.prototype.$$ = function (eventPropName) {
  return this.rootLink.eventProps[eventPropName];
};

PropSubtype.prototype.$ = function (componentName) {
  if (componentName != undefined) return this.rootLink.state[componentName];
  return this.rootLink;
};

PropSubtype.prototype.$methods = function (nameMethod) {
  if (nameMethod != undefined) return this.rootLink.stateMethods[nameMethod];
  return this.rootLink.stateMethods;
};

PropSubtype.prototype.$props = function (nameProp) {
  if (nameProp != undefined) return this.rootLink.stateProperties[nameProp];
  return this.rootLink.stateProperties;
};

PropSubtype.prototype.removeAllChild = function () {
  var children = this.htmlLink.children;
  var count = children.length;

  for (var p = 0; p < count; p++) {
    children[0].remove();
  }
};

PropCommon.prototype.setProp = function (value) {
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
      var classLength = this.htmlLink.classList.length;

      for (var u = 0; u < classLength; u++) {
        this.htmlLink.classList.remove(this.htmlLink.classList[0]);
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
    this.htmlLink.dataset[this.parent.name + this.parent.rootLink.capitalizeFirstLetter(this.propName)] = value;
    return;
  } else {
    console.log("error неправильно указан тип свойства, если тип = aux его нужно создавать с помощью массива ['имя_метода', 'aux']");
  }
};

PropCommon.prototype.getProp = function () {
  if (this.type == "text") {
    return this.htmlLink.textContent;
  } else if (this.type == "inputvalue" || this.type == "select") {
    return this.htmlLink.value;
  } else if (this.type == "checkbox" || this.type == "radio") {
    return this.htmlLink.checked;
  } else if (this.type == "class") {
    var classList = this.htmlLink.classList;
    var clasArr = [];

    for (var i = 0; i < classList.length; i++) {
      clasArr.push(classList[i]);
    }

    return clasArr;
  } else if (this.type == "html") {
    return this.htmlLink.innerHTML;
  } else if (this.isAttr(this.type) != false) {
    return this.htmlLink.getAttribute(this.isAttr(this.type));
  } else if (this.type == "data") {
    return this.htmlLink.dataset[this.parent.name + this.parent.rootLink.capitalizeFirstLetter(this.propName)];
  } else {
    console.log("error неправильно указан тип свойства, если тип = aux его нужно создавать с помощью массива ['имя_метода', 'aux']");
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
    this.htmlLink.dataset[this.parent.name + this.rootLink.parent.capitalizeFirstLetter(this.propName)] = "";
    return;
  } else if (this.isAttr(this.type) != false) {
    this.htmlLink.removeAttribute(this.isAttr(this.type));
    return;
  } else {
    console.log("error неправильно указан тип свойства, если тип = aux его нужно создавать с помощью массива ['имя_метода', 'aux']");
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
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function PropGroup(htmlLink, propType, keyData1, propName, pathToComponent, parentComponent, rootLink, newProps) {
  PropSubtype.call(this, htmlLink, propType, propName, pathToComponent, parentComponent, rootLink);
  this.groupChild = [];
  this.groupArray = null;

  if (newProps == undefined || newProps[propName] == undefined || _typeof(newProps[propName]) != "object" || newProps[propName].componentName == undefined) {
    this.initGroup(keyData1, propName);
  } else {
    this.removeAllChild();
  }
}

PropGroup.prototype = Object.create(PropSubtype.prototype);
Object.defineProperty(PropGroup.prototype, 'constructor', {
  value: PropGroup,
  enumerable: false,
  // false, чтобы данное свойство не появлялось в цикле for in
  writable: true
});

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
    console.log("не получается создать " + value + "в группе компонента" + this.pathToComponent);
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
  var count = this.groupChild.length;
  if (count <= 0) return;
  var indexes = [];

  for (var i = 0; i < count; i++) {
    indexes.push(this.groupChild[i].index);
  }

  this.rootLink.state[this.groupChild[0].pathToCоmponent].removeIndex(indexes, true);
  this.groupChild.length = 0;
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
    console.log("error для использования метода .reuseGroup свойство должно иметь поле this.groupArray !=null");
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
      if (this.groupChild[i].props[key].prop != undefined) this.groupChild[i].props[key].prop = null;
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
  if (this.groupArray == null && this.getGroupsArray() == null && props.componentName == undefined) {
    console.log("error для использования метода createInGroup свойство должно иметь поле this.groupArray !=null");
    return;
  }

  if (this.groupArray == null || this.groupArray == undefined) this.groupArray = this.rootLink.state[props.componentName];
  var container = this.groupArray.add(props);
  this.addToGroup(container, insertLocation);
};

PropGroup.prototype.createNewGroup = function (groupArr, componentName) {
  if (this.groupArray != null && this.groupArray.pathToComponent != undefined && this.groupArray.pathToComponent == componentName) {
    this.reuseGroup(groupArr);
  } else {
    if (this.groupChild != undefined && this.groupChild.length != 0) {
      this.clearGroup();
    } else {
      this.groupChild = [];
    }

    this.groupArray = this.rootLink.state[componentName];
    if (!this.groupArray) console.log("error не создан компонент " + componentName);

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

PropGroup.prototype.order = function (newOrderArr) {
  var htmlLink = this.htmlLink;

  if (newOrderArr.length != this.groupChild.length) {
    console.log("в массиве newOrderArr, должно быть столько же элементов сколько и в массиве this.groupChild");
    return;
  }

  var newData = [];

  for (var i = 0; i < newOrderArr.length; i++) {
    newData.push(this.groupChild[newOrderArr[i]]);
  }

  this.groupChild = newData;
  htmlLink.innerHTML = "";

  for (var k = 0; k < this.groupChild.length; k++) {
    htmlLink.appendChild(this.groupChild[k].htmlLink);
    this.groupChild[k].groupId = k;
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
            var container = new Container(groupItems[i], nameContainer, this.rootLink.description.virtualArrayComponents[nameVirtualArray].props, this.rootLink.description.virtualArrayComponents[nameVirtualArray].methods, this.rootLink.state[nameVirtualArray].data.length, nameVirtualArray, this.rootLink, false); //container.renderType = "container-inner";

            container.groupParent = this;
            this.rootLink.state[nameVirtualArray].data.push(container);
            this.groupChild.push(container);
            this.groupArray = this.rootLink.state[nameVirtualArray]; //console.log(this);
            //console.log('/////////////////');

            container.groupId = this.groupChild.length - 1;
            if (container.onCreatedContainer != undefined) container.onCreatedContainer();
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
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function PropGroupMix(htmlLink, propType, keyData1, propName, pathToComponent, parentComponent, rootLink, newProps) {
  PropSubtype.call(this, htmlLink, propType, propName, pathToComponent, parentComponent, rootLink);
  this.groupChild = [];

  if (newProps == undefined || newProps[propName] == undefined || _typeof(newProps[propName]) != "object" || newProps[propName].componentName == undefined) {
    this.initGroup(keyData1, propName);
  } else {
    this.removeAllChild();
  }
}

PropGroupMix.prototype = Object.create(PropSubtype.prototype);
Object.defineProperty(PropGroup.prototype, 'constructor', {
  value: PropGroupMix,
  enumerable: false,
  // false, чтобы данное свойство не появлялось в цикле for in
  writable: true
});

PropGroupMix.prototype.getProp = function (value) {
  if (value == undefined) {
    var array_r = [];

    for (var i = 0; i < this.groupChild.length; i++) {
      var item = this.groupChild[i].getAllProps();
      item.componentName = this.groupChild[i].pathToCоmponent;
      array_r.push(item);
    }

    return array_r;
  } else {
    if (typeof value == "number") {
      return this.groupChild[value];
    } else if (_typeof(value) == "object") {
      var array_r = [];

      for (var i = 0; i < this.groupChild.length; i++) {
        var item = this.groupChild[i].getAllProps(value);
        if (value.componentName != undefined) item.componentName = this.groupChild[i].pathToCоmponent;
        array_r.push(item);
      }

      return array_r;
    }
  }
};

PropGroupMix.prototype.setProp = function (value) {
  if (Array.isArray(value)) {
    this.clearGroup();

    for (var i = 0; i < value.length; i++) {
      if (value[i].location != undefined) {
        var location = value[i].location;
        delete value[i].location;
      }

      this.createInGroup(value[i], location);
    }
  } else if (_typeof(value) == "object") {
    if (value.location != undefined) {
      var location = value.location;
      delete value.location;
    }

    this.createInGroup(value, location);
  } else {
    console.log("не получается создать " + value + "в группе компонента" + this.pathToCоmponent);
  }

  return;
};

PropGroupMix.prototype.order = function (newOrderArr) {
  PropGroup.prototype.order.call(this, newOrderArr);
};

PropGroupMix.prototype.removeProp = function (value) {
  PropGroup.prototype.removeProp.call(this, value);
};

PropGroupMix.prototype.initGroup = function (containerName, propName) {
  PropGroup.prototype.initGroup.call(this, containerName, propName);
  if (this.groupArray != undefined) delete this.groupArray;
};

PropGroupMix.prototype.addToGroup = function (container, insertLocation) {
  PropGroup.prototype.addToGroup.call(this, container, insertLocation);
  if (this.groupArray != undefined) delete this.groupArray;
};

PropGroupMix.prototype.removeFromGroup = function (groupID) {
  PropGroup.prototype.removeFromGroup.call(this, groupID);
};

PropGroupMix.prototype.createInGroup = function (props, insertLocation) {
  if (props.componentName == undefined) {
    console.log("error для использования метода createInGroup в параметре должно присутствовать поле props.componentName");
    return;
  }

  var vArr = this.rootLink.state[props.componentName];
  if (vArr == undefined) console.log("error не создан виртуальный массив " + props.componentName);
  var container = vArr.add(props);
  this.addToGroup(container, insertLocation);
};

PropGroupMix.prototype.clearGroup = function () {
  var count = this.groupChild.length;
  if (count <= 0) return;

  for (var i = 0; i < count; i++) {
    this.groupChild[0].remove(true);
  }

  this.groupChild.length = 0;
};
function PropEventEmiter(htmlLink, propType, propName, eventMethod, pathToComponent, parentComponent, rootLink) {
  PropSubtype.call(this, htmlLink, propType, propName, pathToComponent, parentComponent, rootLink); // console.log(this);

  this.emiterKey = "";
  this.emiter = "";
  this.eventMethod = eventMethod.bind(this);
  this.emiterKey = "key" + Math.floor(Math.random() * 89999 + 10000);
  this.emiter = this.rootLink.eventProps[this.type];
  this.rootLink.eventProps[this.type].addListener(htmlLink, this.eventMethod, this.type, this.emiterKey);
}

PropEventEmiter.prototype = Object.create(PropSubtype.prototype);
Object.defineProperty(PropEventEmiter.prototype, 'constructor', {
  value: PropEventEmiter,
  enumerable: false,
  // false, чтобы данное свойство не появлялось в цикле for in
  writable: true
});

PropEventEmiter.prototype.getProp = function () {
  return this.type;
};

PropEventEmiter.prototype.setProp = function () {
  return false;
};

PropEventEmiter.prototype.removeProp = function () {
  return false;
};

PropEventEmiter.prototype.disableEvent = function () {
  if (this[this.type + '-disable'] != undefined) {
    return;
  }

  this[this.type + '-disable'] = true;
  this.emiter.removeListener(this.htmlLink);
};

PropEventEmiter.prototype.enableEvent = function () {
  if (this[this.type + '-disable'] == undefined) {
    return;
  }

  delete this[this.type + '-disable'];
  this.emiter.addListener(this.htmlLink, this.eventMethod, this.type, this.emiterKey);
};
/*PropEventEmiter.prototype.component = function(){

	return this.rootLink.state[this.pathToCоmponent];
}*/
/////////////////////////////////////////////


function PropStandartEvent(htmlLink, propType, propName, eventMethod, pathToComponent, parentComponent, rootLink) {
  PropSubtype.call(this, htmlLink, propType, propName, pathToComponent, parentComponent, rootLink); //console.log(this);

  this.events = {};
  this.events[this.type] = eventMethod.bind(this);
  this.htmlLink.addEventListener(this.type, this.events[this.type]);
}

PropStandartEvent.prototype = Object.create(PropSubtype.prototype);
Object.defineProperty(PropStandartEvent.prototype, 'constructor', {
  value: PropStandartEvent,
  enumerable: false,
  // false, чтобы данное свойство не появлялось в цикле for in
  writable: true
});
/*	
PropStandartEvent.prototype.component = function(){

	return this.rootLink.state[this.pathToCоmponent];
}*/

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

PropStandartEvent.prototype.emitEvent = function (eventName) {
  this.events[eventName]();
};
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function PropVariant(htmlLink, propType, propName, pathToComponent, parentComponent, rootLink, newProps) {
  PropSubtype.call(this, htmlLink, propType, propName, pathToComponent, parentComponent, rootLink);
  this.renderChild = null;

  if (newProps == undefined || newProps[propName] == undefined || _typeof(newProps[propName]) != "object" || newProps[propName].componentName == undefined) {
    this.initRenderVariant();
  } else {
    this.removeAllChild();
  }
}

PropVariant.prototype = Object.create(PropSubtype.prototype);
Object.defineProperty(PropVariant.prototype, 'constructor', {
  value: PropVariant,
  enumerable: false,
  writable: true
});

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
  var isRemove = null;

  if (this.renderChild != null && this.renderChild.renderType == "container-inner") {
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
  if (this.renderChild == null && nameComponent == undefined) {
    console.log("не известен компонент для рендера");
    return "undefinit render-variant";
  }

  if (nameComponent != undefined && this.rootLink.state[nameComponent] != undefined) {
    if (this.renderChild != null && this.renderChild.renderParent != undefined && this.renderChild.renderParent != null) this.renderChild.renderParent = null;
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
    if (this.renderChild != null && this.renderChild.renderType != undefined && this.renderChild.renderType == "container-inner") this.renderChild.remove(true);
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
    if (this.renderChild != null && this.renderChild.pathToCоmponent != undefined && this.renderChild.pathToCоmponent == objWidthProps.componentName) {
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
            var container = new Container(objIs, nameContainer, this.rootLink.description.virtualArrayComponents[nameVirtualArray].props, this.rootLink.description.virtualArrayComponents[nameVirtualArray].methods, this.rootLink.state[nameVirtualArray].data.length, nameVirtualArray, this.rootLink); //container.renderType = "container-inner";

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
  var _templateVarDOM = false;
  this.description = StateMap;
  this.state = {};
  this.eventProps = {};
  this.stateMethods = {};
  this.stateProperties = {};

  if (StateMap.eventEmiters != undefined) {
    for (var key in StateMap.eventEmiters) {
      if (StateMap.eventEmiters[key].behavior != undefined) {
        this.eventProps[key] = new EventEmiter(key, StateMap.eventEmiters[key].prop, {}, {}, StateMap.eventEmiters[key].behavior, this);
      } else {
        this.eventProps[key] = new EventEmiter(key, StateMap.eventEmiters[key].prop, {}, {});
      }
    }
  }

  if (StateMap.stateSettings != undefined) {
    this.stateSettings = StateMap.stateSettings;
  }

  for (var key in StateMap) {
    if (key == "stateMethods") {
      this.stateMethods = StateMap[key];

      for (var key56 in this.stateMethods) {
        var context256 = this;

        this.stateMethods[key56] = function () {
          var fn = StateMap[key][key56];
          return function () {
            if (this.rootLink == undefined && this.description == undefined && this.state == undefined && this.htmlLink == undefined) {
              return fn.apply(context256, arguments);
            }

            return fn.apply(this, arguments);
          };
        }();
      }

      continue;
    }

    if (key == 'stateProperties') {
      this.stateProperties = StateMap[key];
      continue;
    }

    if (key == 'eventEmiters' || key == 'virtualArrayComponents' || key == "stateSettings") {
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
          } else {
            console.log("erorr - неправильно указан тип для контейнера либо массива " + key + " для компонента из объекта fetchComponents");
          }
        }

        context.verifyFetchComponents(divEl);
      }, StateMap.stateSettings.templatePath);
      continue;
    }

    initStandartComponents(this, StateMap, key);
  }

  if (this.stateSettings != undefined && this.stateSettings.templateVar != undefined) {
    createFromVarTemplate(this);
    this.verifiTemplateVarComponents(_templateVarDOM);
  }

  function initStandartComponents(context, StateMap, key) {
    var node = document.querySelector('[data-' + key + ']');

    if (node == null || node == undefined) {
      if (context.stateSettings != undefined && context.stateSettings.templateVar != undefined) {
        createFromVarTemplate(context);
        node = _templateVarDOM.querySelector('[data-' + key + ']');
      }
    }

    if (node == undefined || node == null) {
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

  function createFromVarTemplate(context) {
    if (_templateVarDOM == false) {
      _templateVarDOM = document.createElement('div');
      _templateVarDOM.innerHTML = context.stateSettings.templateVar;
    }
  }
} //создает контейнер - компонент (renderType = "container-outer")


HTMLixState.prototype.containerInit = function (node, StateMap, key) {
  if (this.state[key] != undefined) return;
  if (node == null) node = document.querySelector('[data-' + key + ']');
  if (node == null || node == undefined) console.log("error в html разметке не найден контейнер " + key);
  if (StateMap[key] == undefined) console.log("error- проверьте корректность parent ключей в html - коде");
  this.state[key] = new Container(node, key, StateMap[key].props, StateMap[key].methods, null, key, this);
}; //создает компонент - обычный массив (renderType="array")


HTMLixState.prototype.arrayInit = function (node, StateMap, key) {
  if (this.state[key] != undefined) return;
  if (node == null) node = document.querySelector('[data-' + key + ']');
  if (node == null || node == undefined) console.log("error в html разметке не найден массив " + key);
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
        var type = StateMap[key]["arrayProps"][t][1];

        if (type == "aux") {
          if (StateMap[key]["arrayMethods"][string] == undefined) console.log("error название свойства массива " + key + " - " + string + " не совпадает с названием метода");
          if (this.state[key].methods == undefined) this.state[key].methods = {};
          this.state[key].methods[string] = StateMap[key]["arrayMethods"][string].bind(this.state[key]);
          continue;
        } else if (type == "extend") {
          var isTrue = this.propExtend(StateMap[key]["arrayProps"][t][2], StateMap[key]["arrayProps"][t][3], StateMap[key]["arrayProps"], StateMap[key]["arrayMethods"], StateMap[key]["arrayProps"][t][0], t);
          if (isTrue == false) continue;
          t--;
          continue;
        }

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

    var container23 = new Container(containerHTML[i], StateMap[key].container, StateMap[key].props, StateMap[key].methods, j, key, this); // container23.renderType = "container-inner";

    this.state[key].data[j] = container23;
  }

  if (this.state[key].data.length < lengthChildren) {
    console.log("warn - контейнеров в массиве " + key + " создано меньше чем обьявлено в html, проверьте корректность написания всех ключей в html коде либо удалите лишние элементы не соответствующие контейнеру - " + StateMap[key].container);
  }

  if (this.state[key].data.length > lengthChildren) {
    console.log("warn - контейнеров " + StateMap[key].container + " в массиве " + key + " создано больше чем обьявлено в html, проверьте что контейнеры распологаются в массиве непосредственно, старайтесь избегать создания порежуточных тегов");
  }
}; //проверяет что созданы все виртуальные массивы при дозагрузке компонентов в fetchTemplates а также вызывает метод - событие onLoadAll


HTMLixState.prototype.verifyFetchComponents = function (divEl) {
  if (this.verifiTemplateVarComponents(divEl)) {
    if (this.stateMethods != undefined && this.stateMethods.onLoadAll != undefined) this.stateMethods.onLoadAll
    /*.bind(this)*/
    ();
  }
}; //проверяет что созданы все виртуальные массивы после создания всех компонентов с опцией templateVar


HTMLixState.prototype.verifiTemplateVarComponents = function (divEl) {
  if (this.description.virtualArrayComponents != undefined) {
    for (var key in this.description.virtualArrayComponents) {
      if (this.state[key] == undefined) {
        var containerHTML = divEl.querySelector('[data-' + this.description.virtualArrayComponents[key].container + ']');

        if (containerHTML == null) {
          console.log("Error в догружаемом шаблоне  не найдено компонента " + key + " - виртуального массива,  проверьте его наличие и правильность ключей в шаблоне");
          return false;
        }

        this.state[key] = new HTMLixArray("virtual-array", containerHTML, this, key, undefined);
      }
    }
  }

  return true;
}; //удаляет обработчики событий со свойств - слушателей событий, а также дочерние контейнеры со свойств с типами group group-mix и render-variant


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
      container.props[key].clearGroup();
    }
  }
}; ///метод ля отсеивания повторяющихся полей какого либо массива	


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
}; //загрузка шаблонов для fetchTemplate option


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
}; //наследование свойств контейнера	


HTMLixState.prototype.containerExtend = function (parentContainerName, props, methods) {
  ///описание наследуемого компонента		   
  var parCont = this.description[parentContainerName];

  if (parCont == undefined && this.description.virtualArrayComponents != undefined) {
    parCont = this.description.virtualArrayComponents[parentContainerName];
  }

  if (parCont == undefined && this.description.fetchComponents != undefined) {
    parCont = this.description.fetchComponents[parentContainerName];
  }

  if (parCont == undefined) console.log("error неправильно указано имя наследуемого компонента в container_extend");
  var shareProps = parCont.props;

  if (parCont.share_props != undefined) {
    shareProps = shareProps.slice(0, parCont.share_props);
  }

  for (var u = 0; u < shareProps.length; u++) {
    var keyProp = shareProps[u];
    if (_typeof(keyProp) == "object") keyProp = shareProps[u][0];
    var isPersist = false;
    props.forEach(function (prop) {
      var findProp = prop;
      if (_typeof(findProp) == "object") findProp = prop[0];
      if (findProp == keyProp) isPersist = true;
    });
    if (isPersist) continue;
    props.unshift(shareProps[u]);

    if (parCont.methods[keyProp] != undefined) {
      methods[keyProp] = parCont.methods[keyProp];
    }
  }
}; //наследование отдельных свойств


HTMLixState.prototype.propExtend = function (parentContainerName, propsOrArrayProps, props, methods, propName, index) {
  ///описание наследуемого компонента		   
  var parCont = this.description[parentContainerName];

  if (parCont == undefined && this.description.virtualArrayComponents != undefined) {
    parCont = this.description.virtualArrayComponents[parentContainerName];
  }

  if (parCont == undefined && this.description.fetchComponents != undefined) {
    parCont = this.description.fetchComponents[parentContainerName];
  }

  if (parCont == undefined) console.log("error неправильно указано имя  наследуемого компонента в prop_extend");
  var shareProps = parCont[propsOrArrayProps];
  var isExtend = false;

  for (var u = 0; u < shareProps.length; u++) {
    var keyProp = shareProps[u];
    if (_typeof(keyProp) == "object") keyProp = shareProps[u][0];

    if (keyProp == propName) {
      isExtend = true;
      props[index] = shareProps[u];

      if (propsOrArrayProps == "props" && parCont.methods[keyProp] != undefined) {
        methods[keyProp] = parCont.methods[keyProp];
      } else if (propsOrArrayProps == "arrayProps" && parCont.arrayMethods[keyProp] != undefined) {
        methods[keyProp] = parCont.arrayMethods[keyProp];
      }
    }
  }

  if (!isExtend) {
    console.log("error свойства " + propName + " в компоненте " + parentContainerName + " не найдено");
    return false;
  }
};

HTMLixState.prototype.isEvent = function (type) {
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
};

HTMLixState.prototype.isEmiter = function (emiterName) {
  var isEmiter = false;

  for (var key123 in this.eventProps) {
    if (key123 == emiterName) {
      isEmiter = key123;
    }
  }

  return isEmiter;
};

HTMLixState.prototype.$$ = function (emiterName) {
  return this.eventProps[emiterName];
};
//# sourceMappingURL=htmlix.js.map
