function HTMLixArray(node, containerHTML, rootLink, pathToComponent, selector){

		    this.htmlLink = node, 
			this.data = [],
			this.rootLink = rootLink,
			this.pathToComponent = pathToComponent,
			this.type = "array",
			this.templateData = containerHTML.cloneNode(true),
			/*this.id = null, */
			this.index = null,
			this.renderType = "array",
			this.selector = selector
			
			if(node == "virtual-array")this.renderType = "virtual-array";
			
  ///container_extend
	if(this.renderType == "virtual-array"){
		 var thisArrDesc = this.rootLink.description.virtualArrayComponents[this.pathToComponent];
		 var parentContainerName = thisArrDesc.container_extend;
	}else{
		var thisArrDesc = this.rootLink.description[this.pathToComponent];
		if(thisArrDesc == undefined)thisArrDesc = this.rootLink.description.fetchComponents[this.pathToComponent];
		var parentContainerName = thisArrDesc.container_extend;
	}	  
	 if(parentContainerName != undefined){
		  
	     this.rootLink.containerExtend(parentContainerName, thisArrDesc.props, thisArrDesc.methods);
	 }
}

///добавляет контейнер в массив 
HTMLixArray.prototype.add = function(properties, insertLocation){
		
	if( insertLocation != undefined  && insertLocation != "and" && isNaN(insertLocation)){

				console.log("Введите корректную позицию для вставки контейнера в массив "+this.pathToComponent);
		return;
	}
	var index = 0;

		if(insertLocation == undefined || insertLocation == "and"  ){ 

			index = this.data.length;

			}else if(typeof insertLocation == 'number' ){

				if(insertLocation > this.data.length) insertLocation = this.data.length;

				index = insertLocation;

			}
	var Link = this.templateData.cloneNode(true);	

			var desc =this.rootLink.description[this.pathToComponent];

	   	   if(desc == undefined){ 

		    if(this.rootLink.description.virtualArrayComponents != undefined && this.rootLink.description.virtualArrayComponents[this.pathToComponent] != undefined){ 

										desc = this.rootLink.description.virtualArrayComponents[this.pathToComponent];
							   
		   }else {
			   		   if(this.rootLink.description.fetchComponents !=undefined && this.rootLink.description.fetchComponents[this.pathToComponent] != undefined){

			   						 desc = this.rootLink.description.fetchComponents[this.pathToComponent];
			   }else{
				   				   console.log("eror- не получается найти описание для компонета "+this.pathToComponent+" проверьте существуют ли обьекты fetchComponents, virtualArrayComponents в описании, параметре StateMap");
			   }			  
		   }
	   }
				var container = new Container(Link, desc.container,  desc.props,
									desc.methods, index, this.pathToComponent, this.rootLink, true, properties);

				var htmlLink = this.htmlLink;
				
				if(this.selector != undefined ){
					
					htmlLink = htmlLink.querySelector(this.selector);
					
					if(htmlLink == null)console.log("error - не удается найти селектор "+this.selector+" для массива "+this.pathToComponent);
					
				}
	if(insertLocation == undefined || insertLocation == "and" ){ 

				if(this.rootLink.description.virtualArrayComponents == undefined){ 

						htmlLink.appendChild(Link);

					}else{	

					if(this.rootLink.description.virtualArrayComponents[this.pathToComponent] == undefined)htmlLink.appendChild(Link);
		}	
		this.data.push(container);
	}else if(typeof insertLocation == 'number'){

				if(this.rootLink.description.virtualArrayComponents == undefined ){

				   htmlLink.insertBefore(Link, htmlLink.children[insertLocation]);
		}else{

				if(this.rootLink.description.virtualArrayComponents[this.pathToComponent] == undefined)htmlLink.insertBefore(Link, htmlLink.children[insertLocation]);
		}
		this.data.splice(insertLocation, 0, container);

		for(var i=insertLocation ; i < this.data.length; i++){

			this.data[i].index = i;
		}		
	}
	if(properties != undefined)container.setAllProps(properties);

	return container;
}
///удаляет контейнер или группу контейнеров из массива по индексам	
HTMLixArray.prototype.removeIndex = function(indexArray, widthChild){
	
	if(widthChild != false)widthChild = true;
    
	if(typeof indexArray != "object")indexArray = [indexArray];

	for(var r = 0; r < indexArray.length; r++){

				if(indexArray[r] > this.data.length-1){

						console.log("error - индекс для удаления "+indexArray[r]+" больше количества элементов в массиве "+this.pathToComponent);
			return;
		}		
		           this.rootLink.clearContainerProps(this.pathToComponent, indexArray[r], widthChild);

		          this.data[indexArray[r]].htmlLink.remove();
	}
		var newData = this.data.filter(  function(container, i) {

				return ! indexArray.some(function(numb){ return numb == i });
		});	
		this.data = newData;
	for(var i=0 ; i < this.data.length; i++){

			this.data[i].index = i;
	}
}
//удаляет все контейнеры из массива	
HTMLixArray.prototype.removeAll = function(widthChild){	
        
		if(widthChild != false)widthChild = true;

		for (var index =0; index < this.data.length; index++){
			
			     this.rootLink.clearContainerProps(this.pathToComponent, index, widthChild);

			this.data[index].htmlLink.remove();
	}
	this.data.length = 0;
	this.data = [];
}	
//метод обновляет свойства всех контейнеров, а также обнуляет поле prop каждого свойства, если переданных в метод
//объектов со свойствами больше контейнеров в массиве, то добавляет контейнеры
//если меньше то удаляет лишние	
HTMLixArray.prototype.reuseAll = function(arrayWithObjects){
	
	var newArrLength = arrayWithObjects.length;
	var oldArrLength = this.data.length;
	
	var add = 0;
	var remove =0;
	
	if(newArrLength > oldArrLength) add = newArrLength - oldArrLength;
	if(newArrLength < oldArrLength) remove =  oldArrLength - newArrLength;
	
	for(var i=0; i<this.data.length; i++){
		
		this.data[i].setAllProps(arrayWithObjects[i]);
		
			for(var key in this.data[i].props){
			
			if(this.data[i].props[key].prop != undefined)this.data[i].props[key].prop = null;
			
		}	
	}
	if(add > 0){
		for (var t=0; t<add; t++){
			
			this.add(arrayWithObjects[oldArrLength + t]);
		}	
	}
    if(remove > 0){
		for (var f=0; f<remove; f++){
			
			this.removeIndex([this.data.length - 1], true);
		}	
	}	
}
//получает набор объектов где названия ключей - имена свойств контейнеров, а данные - данные свойств контейнеров
HTMLixArray.prototype.getAll = function(map_Object){
		
		var array_r = [];		
		
     if(map_Object != undefined){
		 
		 for (var f=0; f<this.data.length; f++){
			
			array_r.push(  this.data[f].getAllProps(map_Object) );
		}
		 
	 }else{
		 
		 for (var f=0; f<this.data.length; f++){
			
			array_r.push(  this.data[f].getAllProps() );
		}
		 
	 }	

		return array_r;
}
//изменяет проядок контейнеров в массиве и html разметке
HTMLixArray.prototype.order = function(newOrderArr){
	
	var htmlLink = this.htmlLink;
	
	if(this.selector != undefined ){
					
					htmlLink = htmlLink.querySelector(this.selector);
					
					if(htmlLink == null)console.log("error - не удается найти селектор "+this.selector+" для массива "+this.pathToComponent);					
	}	
	if(newOrderArr.length != this.data.length){
		
		console.log("в массиве newOrderArr, должно быть столько же элементов сколько и в исходном массиве ");
		return;		
	}	
	var newData = [];
	
	for(var i=0; i<newOrderArr.length; i++){
		
		newData.push(this.data[newOrderArr[i]]);
	}
	this.data = newData;
	htmlLink.innerHTML = "";
	
	for(var k=0; k<this.data.length; k++){
		
		htmlLink.appendChild(this.data[k].htmlLink);
		
		this.data[k].index = k;
	}
}
HTMLixArray.prototype.$ = function(componentName){
	
	if(componentName != undefined)return this.rootLink.state[componentName];
	
	return this.rootLink;
}
HTMLixArray.prototype.$$ = function(eventPropName){
	
	return this.rootLink.eventProps[eventPropName];
}
HTMLixArray.prototype.$methods = function(nameMethod){
	
	if(nameMethod != undefined)return this.rootLink.stateMethods[nameMethod];

     return this.rootLink.stateMethods;	
}
HTMLixArray.prototype.$props = function(nameProp){
	
	if(nameProp != undefined)return this.rootLink.stateProperties[nameProp];	
	
	return this.rootLink.stateProperties;
}
