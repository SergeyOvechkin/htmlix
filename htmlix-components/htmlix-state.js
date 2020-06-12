function HTMLixState(StateMap){
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
	for (var key in StateMap){

						if(key == "stateSettings"){ 

						this.stateSettings = StateMap[key];
			continue;
		}		
		if(key == "stateMethods"){ 

						this.stateMethods = StateMap[key];
			continue;
		}		
		if(key == 'stateProperties'){

			this.stateProperties = StateMap[key];
			continue;				
		}		
		if(key == 'eventEmiters' || key ==  'virtualArrayComponents'){

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

					}					
				}
				
				context.verifyFetchComponents(divEl);

							},  StateMap.stateSettings.templatePath);

						continue;
		}

				initStandartComponents(this, StateMap, key);
	}

				function initStandartComponents(context, StateMap, key){

				var node = document.querySelector('[data-'+key+']');

					if(node == undefined){

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

  // console.log("source-map");		
}

HTMLixState.prototype.containerInit = function(node, StateMap, key){

		if(this.state[key] != undefined)return;
	if(node == null)node = document.querySelector('[data-'+key+']');
    if(node == null || node == undefined)console.log("error в html разметке не найден контейнер "+key);	
	if(StateMap[key]== undefined)console.log("error- проверьте корректность parent ключей в html - коде");
	this.state[key] = new Container(node, key,  StateMap[key].props, StateMap[key].methods, null, key, this);

	}
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

														var htmlLinkToProp  = this.state[key].htmlLink;

														if(selector != ""){

																htmlLinkToProp = this.state[key].htmlLink.querySelector(selector);

																if(htmlLinkToProp == undefined)console.log("error не возможно найти селектор для свойства "+selector+" массива "+key+" проверьте правильность селектора");
																continue;

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

HTMLixState.prototype.verifyFetchComponents = function(divEl){
	
	if(this.description.virtualArrayComponents != undefined){
		
		for(var key in this.description.virtualArrayComponents){
			
			if(this.state[ key ] == undefined){
				
				var containerHTML = divEl.querySelector('[data-'+this.description.virtualArrayComponents[key].container+']');

			      if(containerHTML == null ){
					  
					  console.log("Error в шаблоне "+ this.stateSettings.templatePath+" не найдено компонента "+key+" - виртуального массива,  проверьте его наличие и правильность ключей в шаблоне");
					  return;
					  
				  }
				  this.state[ key ] = new HTMLixArray("virtual-array", containerHTML, this, key, undefined);
				
				
			}			
		}

       		if(this.stateMethods != undefined && this.stateMethods.onLoadAll != undefined)this.stateMethods.onLoadAll.bind(this)();
	}
}
HTMLixState.prototype.addContainer=  function (stateNameProp, properties, insertLocation){


		if(this.state[stateNameProp] == undefined)console.log("не получается найти компонент"+stateNameProp+"в this.state");

		var stateArray = this.state[stateNameProp];
		
		//console.log(stateArray);

		if(stateArray.type != "array"){

				console.log("создать контейнер можно только в массиве array");
		return;		
	}
	if( insertLocation != undefined  && insertLocation != "and" && isNaN(insertLocation)){

				console.log("Введите корректную позицию для вставки контейнера в массив "+stateNameProp);
		return;
	}
	var index = 0;

		if(insertLocation == undefined || insertLocation == "and"  ){ 

			index = stateArray.data.length;

			}else if(typeof insertLocation == 'number' ){

				if(insertLocation > stateArray.data.length) insertLocation = stateArray.data.length;

				index = insertLocation;

			}
	var Link = stateArray.templateData.cloneNode(true);	

									       var desc =this.description[stateNameProp];
										   
										   //console.log(this.description);

	   	   if(desc == undefined){ 

		    if(this.description.virtualArrayComponents != undefined && this.description.virtualArrayComponents[stateNameProp] != undefined){ 


										desc = this.description.virtualArrayComponents[stateNameProp];
							   
		   }else {

			   		   if(this.description.fetchComponents !=undefined && this.description.fetchComponents[stateNameProp] != undefined){

			   						 desc = this.description.fetchComponents[stateNameProp];
			   }else{

				   				   console.log("eror- не получается найти описание для компонета "+stateNameProp+" проверьте существуют ли обьекты fetchComponents, virtualArrayComponents в описании, параметре StateMap");
			   }			  
		   }
	   }


				var container = new Container(Link, desc.container,  desc.props,
									desc.methods, index, stateNameProp, this, true, properties);

											//container.renderType = "container-inner";

				var htmlLink = stateArray.htmlLink;
				
				if(stateArray.selector != undefined ){
					
					htmlLink = htmlLink.querySelector(stateArray.selector);
					
					if(htmlLink == null || htmlLink == undefined)console.log("error - не удается найти селектор "+stateArray.selector+" для массива "+stateNameProp);
					
				}

	if(insertLocation == undefined || insertLocation == "and" ){ 

				if(this.description.virtualArrayComponents == undefined){ 

						htmlLink.appendChild(Link);

					}else{	

					if(this.description.virtualArrayComponents[stateNameProp] == undefined)htmlLink.appendChild(Link);
		}	
		stateArray.data.push(container);
	}else if(typeof insertLocation == 'number'){

				if(this.description.virtualArrayComponents == undefined ){

				            htmlLink.insertBefore(Link, htmlLink.children[insertLocation]);
		}else{


									if(this.description.virtualArrayComponents[stateNameProp] == undefined)htmlLink.insertBefore(Link, htmlLink.children[insertLocation]);
		}
		stateArray.data.splice(insertLocation, 0, container);

		for(var i=insertLocation ; i < stateArray.data.length; i++){

			stateArray.data[i].index = i;
		}		
	}

	if(properties != undefined)container.setAllProps(properties);

	return container;
}
HTMLixState.prototype.changeOrder = function(stateNameProp, newOrderArr){
	
	var stateArray = this.state[stateNameProp];
	
	var htmlLink = stateArray.htmlLink;
	
	if(stateArray.selector != undefined ){
					
					htmlLink = htmlLink.querySelector(stateArray.selector);
					
					if(htmlLink == null || htmlLink == undefined)console.log("error - не удается найти селектор "+stateArray.selector+" для массива "+stateNameProp);
					
	}	
	if(newOrderArr.length != stateArray.data.length){
		
		console.log("в массиве newOrderArr, должно быть столько же элементов скольео и в массиве stateNameProp.data");
		return;
		
	}	
	var newData = [];
	
	for(var i=0; i<newOrderArr.length; i++){
		
		newData.push(stateArray.data[newOrderArr[i]]);
	}
	stateArray.data = newData;
	stateArray.htmlLink.innerHTML = "";
	
	for(var k=0; k<stateArray.data.length; k++){
		
		stateArray.htmlLink.appendChild(stateArray.data[k].htmlLink);
		
		stateArray.data[k].index = k;
	}
}


HTMLixState.prototype.removeAll = function(stateNameProp, widthChild){	

		if(this.state[stateNameProp].type != "array")return;

		for (var index =0; index < this.state[stateNameProp].data.length; index++){
			
			     this.clearContainerProps(stateNameProp, index, widthChild);

			this.state[stateNameProp].data[index].htmlLink.remove();
	}
	this.state[stateNameProp].data.length = 0;
	this.state[stateNameProp].data = [];

}

HTMLixState.prototype.removeByIndex = function(stateNameProp, index, widthChild){

	this.removeByIndexes(stateNameProp, [index], widthChild);
}


HTMLixState.prototype.removeByIndexes = function(stateNameProp, indexArray, widthChild ){

		if(this.state[stateNameProp].type != "array")return;
	if(indexArray.length == undefined){

				console.log("error - некорректно задан второй аргумент для функции removeByIndexes, проверьте что это не пустой массив, а также номер эелемента для удаления" );
		return;
	}

	for(var r = 0; r < indexArray.length; r++){

				if(indexArray[r] > this.state[stateNameProp].data.length-1){

						console.log("error - индекс для удаления "+indexArray[r]+" больше количества элементов в массиве "+stateNameProp);
			return;
		}		
		           this.clearContainerProps(stateNameProp, indexArray[r], widthChild);

		          this.state[stateNameProp].data[indexArray[r]].htmlLink.remove();

			}
		var newData = this.state[stateNameProp].data.filter(  function(container, i) {

									return ! indexArray.some(function(numb){ return numb == i });
		});	
		this.state[stateNameProp].data = newData;
	for(var i=0 ; i < this.state[stateNameProp].data.length; i++){

			this.state[stateNameProp].data[i].index = i;
	}

	}
	
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
				
                    /*
						                    var indexesArr = [];						
					for(var it =0; it < container.props[key].groupChild.length; it++){
						indexesArr.push(container.props[key].groupChild[it].index);
					}
					this.removeByIndexes(container.props[key].groupChild[0].pathToCоmponent,  indexesArr, true);

							*/
				}
			}
}	

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


