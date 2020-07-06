function HTMLixRouter(state, routes){

		var namePathInRoutes = "";

        var _templateVar = false;

		if(state.stateSettings != undefined && state.stateSettings.templateVar != undefined)_templateVar = true;		
        
		if(! _templateVar)namePathInRoutes = findComponent(routes);

//поиск соответствующего роута
function findComponent(routes){

				var urlPath = window.location.pathname;

				//console.log(urlPath);

				if(urlPath == "/" && routes["/"] != undefined){


									return urlPath;
				}
				var pathArray = urlPath.split("/");
					
			for(var key in routes){
                    
					var isCountSerchСoincide = true;
					
					var pathArrayFind = key.split("/");
	
						var word = pathArrayFind.slice(-1)[0];  //поиск последнего слова в маршруте чтобы проверить есть ли у него в конце знак *
						var paramWord = {};

						if( pathArrayFind.length>2 && word == ""){
							 word = pathArrayFind.slice(-2)[0];
							 pathArrayFind.pop();
						}else if(pathArrayFind.length>2 && word == "*"){
							
							word = pathArrayFind.slice(-2)[0];
							 pathArrayFind.pop();
							isCountSerchСoincide = false;
						}
												
						var word2 = pathArray.slice(-1)[0];  //поиск последнего слова в маршруте чтобы убрать пустую строку
						
						if( pathArray.length>2 && word2 == ""){
							
							 pathArray.pop();
						}
						var searchInword = false;
						
						var searchInwordCount = {};
						
						var isParam = false;
						
						for (var y=0; y < pathArrayFind.length; y++){
							
							if(pathArrayFind[y][pathArrayFind[y].length -1] == "*" ){
								
								searchInword = true;
								word = pathArrayFind[y];
								searchInwordCount[y] = y;
							}
							
							if(pathArrayFind[y][0] == ":" ){
								
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

					for(var i=0; i< pathArrayFind.length; i++ ){

										if(pathArrayFind[i] == pathArray[i]){

										count++;

									}else if(searchInword == true && searchInwordCount[i] != undefined){


															var search = pathArray[i].search(word);
															
															

										if( word  != "" && search == 0 ){

														count++;
												//	console.log(search + " search  " +  word);
										}
									}else if(isParam == true && paramWord[i] != undefined ){ 
				
											count++;
									}
						}						
			if(isCountSerchСoincide == false){
				if(pathArrayFind.length == count){
					
					namePathInRoutes = key;
					return key;
				}				
			}								
			if(pathArrayFind.length == count && pathArrayFind.length == pathArray.length){

							namePathInRoutes = key;
							return key;
			}
		}		
		return null;
	}
//поиск шаблона
if(! _templateVar){
	if(routes[namePathInRoutes] != undefined && routes[namePathInRoutes].templatePath != undefined){

				if(state.stateSettings == undefined)state.stateSettings = {};


						state.stateSettings.templatePath = routes[namePathInRoutes].templatePath;

	 }else{


						console.log("router error- маршрут не найден убедитесь в правильности запроса");
	             }
}				 
///изменение структуры state для загрузки шаблонов для других страниц в fetch запросе
if(! _templateVar){
	for (var key2 in state){

				var toCare = true;

				for(var t = 0; t< routes[namePathInRoutes].first.length; t++){

					if(key2 == routes[namePathInRoutes].first[t] || key2 == "stateSettings" || key2 ==  "stateMethods" ||

					key2 == 'stateProperties' || key2 ==  "eventEmiters" ||  key2 ==  'virtualArrayComponents' || key2 ==  "fetchComponents"

							/* ||  key2 ==  'firstInitComponents' */ ){

														toCare = false;

					}
		}
		      if(toCare){

				  				 if( state['fetchComponents'] == undefined)state['fetchComponents']  = {};

								state['fetchComponents'][key2] = state[key2];

				delete state[key2]				  

				  			  }
	}
}	
	var stateWithRoutes = new HTMLixState(state);
	
	var routerObj = {
				routes:  routes,

				htmlLink: {}, 

				component: {},

				matchRout: findComponent,
				
				countError: 0,
				
				findRouters: function(nameArrComp){
					
					if(nameArrComp == undefined){
						
								   nameArrComp = this.matchRout(this.routes);

										if(nameArrComp == null){

												console.log("router error - не удается найти совпадающий rout для маршрута "+window.location.pathname)
				                        }								
					}				
					for(var key in this.routes[nameArrComp].routComponent){
						
						//console.log(key);
						
						var key2 = this.routes[nameArrComp].routComponent[key];
						
						//console.log(key2);
						
						if(this.component[key2] == undefined){
							var component = this.rootLink.state[key2];
							this.component[key2] = component;
							if(component == undefined){
								
								var messPart = "warn не удалось найти компонент "+key2+" в описании приложения;";
								if(this.countError > 0)messPart = "router error - не удается найти компонент "+key2+" в описании приложения, проверьте правильность написания ключей в параметре routes для HTMLixRouter";
							    console.log(messPart);
								
								this.countError = this.countError+1;
							}
							//console.log(key);
						}						
						if(this.htmlLink[key] == undefined || this.htmlLink[key] == null)this.htmlLink[key]= document.querySelector("[data-"+key+"]");
						//console.log(this.htmlLink[key]);								
					}
					for(var key in this.routes[nameArrComp].routComponent){
						
						if(this.htmlLink[key] == undefined || this.htmlLink[key] == null){
							
							for(var keyRouter in this.routes[nameArrComp].routComponent){
								
								this.htmlLink[key]= this.component[ this.routes[nameArrComp].routComponent[keyRouter] ].htmlLink.querySelector("[data-"+key+"]");
								
								if(this.htmlLink[key] != undefined || this.htmlLink[key] != null) continue;								
							}							
						}					
						if(this.htmlLink[key] == undefined || this.htmlLink[key] == null) console.log("error в html коде не найден роутер data-"+key);
					}
			},
			setHtml: function (nameArrComp){
				

				for(var key in this.routes[nameArrComp].routComponent){ 
						
						var key2 = this.routes[nameArrComp].routComponent[key];
						
				        this.htmlLink[key].innerHTML = "";
						this.htmlLink[key].appendChild(
						this.component[key2].htmlLink);
				}			
			},
			setRout: function(url, newComponent){
				
				//console.log(url);

						window.history.pushState( 
					null,
					url,
					url
			);
				var nameArrComp = this.matchRout(this.routes);

					if(nameArrComp == null){

									console.log("router error - не удается найти совпадающий rout для маршрута "+window.location.pathname)
				}	
				this.findRouters(nameArrComp);
				this.setHtml(nameArrComp);

		}
	}
	    stateWithRoutes.router = routerObj;

		stateWithRoutes.router.rootLink = stateWithRoutes;
		routerObj.findRouters();
	// stateWithRoutes.router.component = stateWithRoutes.state[routes[namePathInRoutes].routComponent];  

		return stateWithRoutes;	
}




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function EventEmiter(eventName, prop, listeners, listenersEventMethods, behavior, rootLink){

		this.listeners = listeners;
	this.listenersEventMethods =  listenersEventMethods;

		this.event  = new Event(eventName);
	this.type = eventName;
	this.prop = prop;
	this.behavior = null;
	this.rootLink = null;
	if(behavior != undefined){
		this.behavior = behavior.bind(this);
		this.rootLink = rootLink;
	}
}
EventEmiter.prototype.addListener = function(htmlLinkToListener, eventMethod, eventName, nameListener){


			htmlLinkToListener.addEventListener(eventName, eventMethod);

		this.listeners[nameListener]= htmlLinkToListener;

		this.listenersEventMethods[nameListener] = eventMethod;
}
EventEmiter.prototype.removeListener = function(htmlLinkToListener){

			var index = null;

				for (key in this.listeners){

						if(htmlLinkToListener == this.listeners[key])index = key;

					}
		if(index == null)return;
		this.listeners[index].removeEventListener(this.type, this.listenersEventMethods[index]);

				delete this.listenersEventMethods[index];
		delete this.listeners[index];
}
EventEmiter.prototype.emit = function(){
	
	    if(this.behavior != null){
			
			var isEmit = this.behavior();
			
			if(isEmit == false)return;
		}

		for(key in  this.listeners){

				this.listeners[key].dispatchEvent(this.event);

			}
}
EventEmiter.prototype.setEventProp = function(prop){ 

	this.prop = prop;

		this.emit();
}
EventEmiter.prototype.set = function(prop){ 
     this.setEventProp(prop)
}
EventEmiter.prototype.getEventProp = function(){ 

		return this.prop;
}
EventEmiter.prototype.get = function(prop){ 
     this.getEventProp(prop)
}


EventEmiter.prototype.$ = function(componentName){
	
	if(componentName != undefined)return this.rootLink.state[componentName];
	
	return this.rootLink;
}
EventEmiter.prototype.$$ = function(eventPropName){
	
	return this.rootLink.eventProps[eventPropName];
}
EventEmiter.prototype.$methods = function(nameMethod){
	
	if(nameMethod != undefined)return this.rootLink.stateMethods[nameMethod];

     return this.rootLink.stateMethods;	
}
EventEmiter.prototype.$props = function(nameProp){
	
	if(nameProp != undefined)return this.rootLink.stateProperties[nameProp];	
	
	return this.rootLink.stateProperties;
}
















