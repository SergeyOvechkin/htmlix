function HTMLixState(StateMap){
	
	var _templateVarDOM = false;
		
	this.description = StateMap;
	this.state = {};
	this.eventProps = {};
	this.stateMethods = {};
	this.stateProperties = {};

	if(StateMap.eventEmiters != undefined){
		  for (var key in StateMap.eventEmiters){ 
             if(StateMap.eventEmiters[key].behavior != undefined){				 
				 this.eventProps[key] = new EventEmiter(key, StateMap.eventEmiters[key].prop, {}, {}, StateMap.eventEmiters[key].behavior, this);				 
			 }else{				 
				 this.eventProps[key] = new EventEmiter(key, StateMap.eventEmiters[key].prop, {}, {} );				 
			 } 		    
		 }
	}
    if(StateMap.stateSettings != undefined){		
		this.stateSettings = StateMap.stateSettings;		
	}	
	for (var key in StateMap){
	
		if(key == "stateMethods"){ 
		
			this.stateMethods = StateMap[key];
			
			for(var key56 in this.stateMethods){
				
                var context256 = this;
				
				this.stateMethods[key56] = function(){ 
				
				    var fn = StateMap[key][key56];			
				    							     
				    return function(){	

                    if(this.rootLink == undefined  && this.description == undefined && this.state == undefined && this.htmlLink == undefined ){
						
						return fn.apply(context256, arguments); 				
					}												
					return fn.apply(this, arguments); 					
				}				
			   }()
			}			
			continue;
		}		
		if(key == 'stateProperties'){

			this.stateProperties = StateMap[key];
			continue;				
		}		
		if(key == 'eventEmiters' || key ==  'virtualArrayComponents' || key == "stateSettings"){

						continue;
		}
		if(key == "fetchComponents"){

			  var context = this;
			  var StateMap1 = StateMap.fetchComponents;
			 
			  if(StateMap.stateSettings == undefined)StateMap.stateSettings = {};
              if (StateMap.stateSettings.templatePath == undefined) StateMap.stateSettings.templatePath = "/template/template.html";
                			 

			this.fetchTemplates(function(divEl){
				for(var key10 in StateMap1){


						var node = divEl.querySelector('[data-'+key10+']');

						if(node == undefined){

							console.log("Error - в Html коде нет атрибута data-"+key10+" для компонента из объекта fetchComponents");
						}

						var type = node.dataset[key10];


						if(type=="array"){

									context.arrayInit(node, StateMap1, key10);

						}else if(type=="container"){

						context.containerInit(node, StateMap1, key10);

						}else{
							console.log("erorr - неправильно указан тип для контейнера либо массива "+key+" для компонента из объекта fetchComponents");
						}					
				}				
				context.verifyFetchComponents(divEl);

							},  StateMap.stateSettings.templatePath);

						continue;
		}
		initStandartComponents(this, StateMap, key);
					
	}
	if(this.stateSettings != undefined && this.stateSettings.templateVar != undefined){
			
		createFromVarTemplate(this);
		
		this.verifiTemplateVarComponents(_templateVarDOM);					
	}
	function initStandartComponents(context, StateMap, key){

				var node = document.querySelector('[data-'+key+']');
								
				     if(node == null || node == undefined){
						 						 
						 if(context.stateSettings != undefined && context.stateSettings.templateVar != undefined){
							 
							    createFromVarTemplate(context);
								
								node = _templateVarDOM.querySelector('[data-'+key+']'); 															
						 }
					 }
				if(node == undefined || node == null){

						console.log("Error - в Html коде нет атрибута data-"+key+" проверьте корректность названия ключей в html");
				}
				var type = node.dataset[key];		
				if(type=="array"){

					context.arrayInit(node, StateMap, key);			

				}else if(type=="container"){

					context.containerInit(node, StateMap, key);

				}else{
						console.log("erorr - неправильно указан тип для контейнера либо массива "+key);
				}	
	    }
		function createFromVarTemplate(context){
			
			if(_templateVarDOM == false){
				_templateVarDOM = document.createElement('div'); 
				_templateVarDOM.innerHTML = context.stateSettings.templateVar;
			}				
		}	
}
//создает контейнер - компонент (renderType = "container-outer")
HTMLixState.prototype.containerInit = function(node, StateMap, key){

	if(this.state[key] != undefined)return;
	if(node == null)node = document.querySelector('[data-'+key+']');
    if(node == null || node == undefined)console.log("error в html разметке не найден контейнер "+key);	
	if(StateMap[key]== undefined)console.log("error- проверьте корректность parent ключей в html - коде");
	this.state[key] = new Container(node, key,  StateMap[key].props, StateMap[key].methods, null, key, this);

}
//создает компонент - обычный массив (renderType="array")
HTMLixState.prototype.arrayInit = function(node, StateMap, key){

	       	if(this.state[key] != undefined)return;
			if(node == null)node = document.querySelector('[data-'+key+']');
            if(node == null || node == undefined)console.log("error в html разметке не найден массив "+key);	
			
		    var lengthChildren = node.children.length; 
			if(StateMap[key].container == undefined)console.log("error- забыли указать контейнер для массива " +key);
			var containerHTML = node.querySelectorAll('[data-'+StateMap[key].container+']');
			
			var array_selector = undefined;
			
			if(StateMap[key].selector != undefined) array_selector = StateMap[key].selector;

		    if(containerHTML.length == 0)console.log("error - в html коде нет атрибута data-"+StateMap[key].container+" либо не создан шаблон для массива "+key);
			this.state[key] = new HTMLixArray(node, containerHTML[0], this, key, array_selector);
			
			if(StateMap[key]["arrayProps"] !=undefined ){

								this.state[key]["props"] = {};

								for (var t=0; t < StateMap[key]["arrayProps"].length; t++){


						if(typeof StateMap[key]["arrayProps"][t] == "string"){
												var htmlLink = this.state[key].htmlLink.querySelectorAll('[data-'+key+'-'+StateMap[key]["arrayProps"][t]+']')[0];
												if(htmlLink == undefined)htmlLink  = this.state[key].htmlLink;



																							this.state[key]["props"][ StateMap[key]["arrayProps"][t] ] 	= constructorProps( htmlLink, key, StateMap[key]["arrayProps"][t], StateMap[key]["arrayMethods"][ StateMap[key]["arrayProps"][t] ],
																						key,
																						this.state[key],
																						this
																					);						



						}else{

							var string =  StateMap[key]["arrayProps"][t][0];

				 			var selector = StateMap[key]["arrayProps"][t][2];
							
							var type = StateMap[key]["arrayProps"][t][1];
							
							if(type == "aux"){
								
                                  								
									 if(StateMap[key]["arrayMethods"][  string ] == undefined)console.log("error название свойства массива "+key+" - "+string+" не совпадает с названием метода");
									 if(this.state[key].methods == undefined)this.state[key].methods = {};
									 this.state[key].methods[string] = StateMap[key]["arrayMethods"][  string ].bind( this.state[key]);
									 continue;
									 
							}else if(type == "extend"){
									 
									 var isTrue = this.propExtend(StateMap[key]["arrayProps"][t][2], StateMap[key]["arrayProps"][t][3], StateMap[key]["arrayProps"], StateMap[key]["arrayMethods"], StateMap[key]["arrayProps"][t][0], t);
									 if(isTrue == false)continue;
									 t--;
									 continue;
								 
							}

														var htmlLinkToProp  = this.state[key].htmlLink;

														if(selector != ""){

																htmlLinkToProp = this.state[key].htmlLink.querySelector(selector);

																if(htmlLinkToProp == undefined || htmlLinkToProp == null){
																	console.log("error не возможно найти селектор для свойства "+selector+" массива "+key+" проверьте правильность селектора");
																	continue;
																}	

														}			 
							this.state[key]["props"][ string ] = constructorProps(htmlLinkToProp, key,	StateMap[key]["arrayProps"][t], 
							                                                        StateMap[key]["arrayMethods"][  string ],
																						key,
																						this.state[key],
																						this
																					);	
					}	
				}
			}

			var i = 0;
			if(containerHTML[0].dataset[StateMap[key].container] == "template"){
				                 
								 containerHTML[0].dataset[StateMap[key].container] = "container";

								containerHTML[0].setAttribute('style', "");

								this.state[key].templateData = containerHTML[0].cloneNode(true);

								containerHTML[0].remove();

				if (containerHTML.length == 1 )return;
				i = 1;

			}		
			
			for( var j=0, i; i < containerHTML.length; j++, i++){

						if(containerHTML[i].dataset[StateMap[key].container] != "container"){

											console.log("erorr - неправильно указан тип для контейнера "+StateMap[key].container+" index - "+i+ " массива "+key);
						}					
						var container23 = new Container(containerHTML[i], StateMap[key].container,  StateMap[key].props, StateMap[key].methods, j, key, this);
						// container23.renderType = "container-inner";
						this.state[key].data[j] = container23 ;

            }
			if(this.state[key].data.length < lengthChildren ){

				console.log("warn - контейнеров в массиве "+key+" создано меньше чем обьявлено в html, проверьте корректность написания всех ключей в html коде либо удалите лишние элементы не соответствующие контейнеру - "+StateMap[key].container);	
			}
            if(this.state[key].data.length > lengthChildren){

				console.log("warn - контейнеров "+StateMap[key].container+" в массиве "+key+" создано больше чем обьявлено в html, проверьте что контейнеры распологаются в массиве непосредственно, старайтесь избегать создания порежуточных тегов");
		   }	
}
//проверяет что созданы все виртуальные массивы при дозагрузке компонентов в fetchTemplates а также вызывает метод - событие onLoadAll
HTMLixState.prototype.verifyFetchComponents = function(divEl){
	
	if( this.verifiTemplateVarComponents(divEl) ){

       		if(this.stateMethods != undefined && this.stateMethods.onLoadAll != undefined)this.stateMethods.onLoadAll/*.bind(this)*/();
	}
}
//проверяет что созданы все виртуальные массивы после создания всех компонентов с опцией templateVar
HTMLixState.prototype.verifiTemplateVarComponents = function(divEl){
	
	if(this.description.virtualArrayComponents != undefined){
		
		for(var key in this.description.virtualArrayComponents){
			
			if(this.state[ key ] == undefined){
				
				var containerHTML = divEl.querySelector('[data-'+this.description.virtualArrayComponents[key].container+']');

			      if(containerHTML == null ){
					  
					  console.log("Error в догружаемом шаблоне  не найдено компонента "+key+" - виртуального массива,  проверьте его наличие и правильность ключей в шаблоне");
					  return false;
					  
				  }
				  this.state[ key ] = new HTMLixArray("virtual-array", containerHTML, this, key, undefined);				
			}			
		}

	}
	return true;
}
//удаляет обработчики событий со свойств - слушателей событий, а также дочерние контейнеры со свойств с типами group group-mix и render-variant
HTMLixState.prototype.clearContainerProps = function(stateNameProp, index, widthChild){
	
	                var container = this.state[stateNameProp].data[index];
					
					for (key in  container.props){

							if(container.props[key].emiterKey != undefined){
							this.eventProps[container.props[key].type].removeListener(container.props[key].htmlLink);
					}
					else if(container.props[key].events != undefined){

												for(key1 in container.props[key].events){
							container.props[key].htmlLink.removeEventListener(key1, container.props[key].events[key1]);		
							delete container.props[key].events[key1]

													}
					}else if(widthChild != undefined && widthChild == true && container.props[key].renderChild  != undefined && container.props[key].renderChild.renderType == "container-inner"){

												container.props[key].renderChild.remove(true);
					}
					else if(widthChild != undefined && widthChild == true && container.props[key].groupChild != undefined && container.props[key].groupChild.length > 0){
													
							container.props[key].clearGroup();
				}
			}
}
///метод ля отсеивания повторяющихся полей какого либо массива	
HTMLixState.prototype.getDifrentFilds = function(array, fild){
	
	var newArr = [];
	for(var i=0; i<array.length; i++){   
			
			var compareItem = array[i];
			if(fild){
				compareItem = array[i][fild];
				if(typeof compareItem == "object")compareItem = JSON.stringify(array[i][fild]);
			}else{
				
				if(typeof array[i] == "object")compareItem = JSON.stringify(array[i]);
			}
					
			var isPersist = false;
			newArr.forEach(newItem=>{    
					var compareItem_2 = newItem;
					if(fild){
							compareItem_2 = newItem[fild];
							if(typeof compareItem_2 == "object")compareItem_2 = JSON.stringify(newItem[fild]);
					}else{		
						if(typeof newItem == "object")compareItem_2 = JSON.stringify(newItem);
					}
					if(compareItem_2 == compareItem)isPersist = true;
			});
			if(!isPersist){
				
				newArr.push(array[i]);				
				
			}
	}
	return newArr;	
}
//загрузка шаблонов для fetchTemplate option
HTMLixState.prototype.fetchTemplates = function(callb, templatePath){
	
		if(templatePath == undefined)console.log("error не указана дериктория для поиска шаблона в настройках .stateSettings.templatePath");

								fetch(templatePath)
					.then((response) => {
						if(response.ok) {
							return response.text();
						}	
            						throw new Error('Network response was not ok');
					})
					.then((text) => {

						var div = document.createElement('div');
						div.innerHTML = text;
						callb(div);

					})
					.catch((error) => {
							console.log(error);
					});

}
HTMLixState.prototype.capitalizeFirstLetter = function(string){

		return string.charAt(0).toUpperCase() + string.slice(1);

	}
//наследование свойств контейнера	
HTMLixState.prototype.containerExtend =  function(parentContainerName, props, methods){
	  
	          ///описание наследуемого компонента		   
		  var parCont = this.description[parentContainerName];
		   if(parCont == undefined &&  this.description.virtualArrayComponents != undefined){
			   
			   parCont = this.description.virtualArrayComponents[parentContainerName];
			   
		   }if(parCont == undefined &&  this.description.fetchComponents != undefined){
			   
			   parCont = this.description.fetchComponents[parentContainerName];
		   }
		   if(parCont == undefined)console.log("error неправильно указано имя наследуемого компонента в container_extend");
		   		 
		   var shareProps = parCont.props;
				
		  if(parCont.share_props != undefined){
			  		  
			  shareProps = shareProps.slice(0, parCont.share_props);
		  }
		  for(var u =0; u < shareProps.length; u++){
			  
			  var keyProp = shareProps[u];
			  if(typeof keyProp == "object")keyProp = shareProps[u][0];
			  
			  var isPersist = false;
			  
			  props.forEach((prop)=>{ 			  
			             var findProp = prop;						
						if(typeof findProp == "object")findProp = prop[0];
						if(findProp == keyProp)isPersist = true;                      					
			  });
			  if(isPersist)continue
			  
			  props.unshift(shareProps[u]);
			  			  
			  if(parCont.methods[keyProp] != undefined){			
				  
					methods[keyProp] = parCont.methods[keyProp]; 
						
			  }
		  }		     
  }
  //наследование отдельных свойств
  HTMLixState.prototype.propExtend =  function(parentContainerName, propsOrArrayProps, props, methods, propName, index){
	  
	  	   ///описание наследуемого компонента		   
		  var parCont = this.description[parentContainerName];
		   if(parCont == undefined &&  this.description.virtualArrayComponents != undefined){
			   
			   parCont = this.description.virtualArrayComponents[parentContainerName];
			   
		   }
		   if(parCont == undefined &&  this.description.fetchComponents != undefined){
			   
			   parCont = this.description.fetchComponents[parentContainerName];
		   }
		   if(parCont == undefined)console.log("error неправильно указано имя  наследуемого компонента в prop_extend");
		   		 
		   var shareProps = parCont[propsOrArrayProps];
		   
		   var isExtend = false;
	       
		   for(var u =0; u < shareProps.length; u++){ 
		   
		   			  var keyProp = shareProps[u];
					if(typeof keyProp == "object")keyProp = shareProps[u][0];
		           
				   if(keyProp == propName){
					   
					   isExtend = true;
					   
					    props[index] = shareProps[u];
					   
					   if(propsOrArrayProps == "props" && parCont.methods[keyProp] != undefined){
						   
						   methods[keyProp] = parCont.methods[keyProp];
						   
					   }else if(propsOrArrayProps == "arrayProps" && parCont.arrayMethods[keyProp] != undefined){
						   
						   methods[keyProp] = parCont.arrayMethods[keyProp];
					   }
				   }
				   
                   				   
		   }  
		   if(!isExtend){
			   
			   console.log("error свойства "+propName+" в компоненте "+parentContainerName+" не найдено");
			   return false;
		   }
  }
  
 HTMLixState.prototype.isEvent = function(type){

		var isEv = false;

	switch(type){

				case'click':
		isEv = 'click';
		break;

				case 'keydown':
		isEv = 'keydown';
		break;	

				case'dblclick':
		isEv = 'dblclick';
		break;

				case 'contextmenu':
		isEv = 'contextmenu';
		break;	

		case'selectstart':
		isEv = 'selectstart';
		break;

				case 'mousewheel':
		isEv = 'mousewheel';
		break;	

				case'mousemove':
		isEv = 'mousemove';
		break;

				case 'mouseout':
		isEv = 'mouseout';
		break;	

				case'mouseover':
		isEv = 'mouseover';
		break;

				case 'mouseup':
		isEv = 'mouseup';
		break;	

				case'mousedown':
		isEv = 'mousedown';
		break;

				case 'keypress':
		isEv = 'keypress';
		break;	

		case'keyup':
		isEv = 'keyup';
		break;

				case 'focus':
		isEv = 'focus';
		break;	

				case'blur':
		isEv = 'blur';
		break;

				case 'change':
		isEv = 'change';
		break;	

				case 'reset':
		isEv = 'reset';
		break;	

		case'select':
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

HTMLixState.prototype.isEmiter = function(emiterName){

	var isEmiter = false;

    for(var key123 in this.eventProps){		
		if(key123 == emiterName){
			isEmiter = key123;
		}
	}
			return  isEmiter;
}
HTMLixState.prototype.$$ = function(emiterName){
	
	return this.eventProps[emiterName];
}
HTMLixState.prototype.$methods = function(nameMethod){
	
	if(nameMethod != undefined)return this.stateMethods[nameMethod];

     return this.stateMethods;	
}
HTMLixState.prototype.$props = function(nameProp){
	
	if(nameProp != undefined)return this.stateProperties[nameProp];	
	
	return this.stateProperties;
}
