function Prop(htmlLink, keyData1, keyData2, eventMethod, pathToContainer, parentContainer, rootLink, newProps) {
	
	 this.htmlLink = htmlLink;
	 this.type = null;
  
function constructorProp(subtype, prop_r){
	  	  
	  if(subtype == "event"){
		  
		  prop_r.events = {};
		  
	  }else if(subtype == "emiter"){
		  
		  prop_r.emiterKey = "";
		  prop_r.emiter = "";
		  
	  }else if(subtype == "group"){
		  
		  prop_r.groupChild = [];
		  prop_r.groupArray = null;
		  
	  }else if(subtype == "render-variant"){ 
	  
		  prop_r.renderChild = null;
	  
	  }else if(subtype == "data"){ 
	  
		  prop_r.parent = parentContainer;
	  
	  }
	  if(subtype != "data"){
		
	  	prop_r.pathToCоmponent = pathToContainer; 
		prop_r.parent = parentContainer; 
		prop_r.rootLink = rootLink;
		prop_r.prop = null;
		prop_r.propName = keyData2;		  
	  }
  
  }
  if(typeof keyData2 == "object"){
          
	  	  this.type = keyData2[1];

	    }else if(keyData2 == "data"){
			
			this.type = "data";
			constructorProp("data", this);
			
		}else{
			
			this.type = htmlLink.dataset[ keyData1 + rootLink.capitalizeFirstLetter(keyData2) ];
		}

  if(this.type == null){
		
           var mess = "error не определен тип свойства для data-"+keyData1+"-"+keyData2+" в html коде не найдено для компонента "+pathToContainer+", index= "+parentContainer.index+" !, проверьте правильность названия свойств";
			console.log(mess);
           throw mess;
	 }
  if(this.isEvent(this.type) != false && eventMethod != undefined ){
		
		constructorProp("event", this);
		//this.events = {	};
		this.events[this.type] = eventMethod.bind(this);
	
		 this.htmlLink.addEventListener(this.type, this.events[this.type]);
		
  }

    else if(this.isEmiter(this.type, rootLink) != false && eventMethod != undefined ){
	  
	   constructorProp("emiter", this);
	   
	  this.emiterKey = "key"+Math.floor(Math.random()*89999+10000);
	  this.emiter = this.rootLink.eventProps[this.type];
	  this.rootLink.eventProps[this.type].addListener(htmlLink, eventMethod.bind(this), this.type, this.emiterKey);
	 
	}
	else if(this.type == "render-variant" ){
		
       constructorProp("render-variant", this);
	   
				if(newProps == undefined || newProps[keyData2] == undefined 
				|| typeof newProps[keyData2] != "object" ||  newProps[keyData2].componentName == undefined){

					this.initRenderVariant();
				}else{
					
					this.removeAllChild();
				}
		  		  

	}else if(this.type == "group"){
		
		constructorProp("group", this);
				
				if(newProps == undefined || newProps[keyData2] == undefined 
				|| typeof newProps[keyData2] != "object" ||  newProps[keyData2].componentName == undefined){

					this.initGroup(keyData1, keyData2);
				
					
				}else{
					
					this.removeAllChild();
				}	
	}
}
Prop.prototype.setProp = function(value, eventMethod) {
	
	        if(this.pathToCоmponent != undefined){
				
				this.setProp_sybtypes(value, eventMethod);
				return;
				
			}else if(this.type == "text"){

				this.htmlLink.textContent = value;
				return;

			}else if(this.type == "inputvalue" || this.type == "select"){

			this.htmlLink.value = value;
			return

			}else if(this.type == "checkbox" || this.type == "radio"){

		 		 if(value != true && value != false)value = true;

		 		 this.htmlLink.checked = value;
				return;

				}
				else if(this.type == "html"){

				  this.htmlLink.innerHTML = value;
				  return;

			   }else if(this.type == "class"){
					
					if(Array.isArray(value)){

						
						for(var u=0; u < this.htmlLink.classList.length; u++){
							
							this.htmlLink.classList.remove(this.htmlLink.classList[u]);
						}
						
						for(var k=0; k < value.length; k++){
							
							this.htmlLink.classList.add(value[k]);
						}
						
					}else{
						
						this.htmlLink.classList.add(value);
					}
					return;

			}else if(this.isAttr(this.type) != false){

				this.htmlLink.setAttribute(this.isAttr(this.type), value);
				return;

		}else  if(this.type == "data"){ 
			
			this.htmlLink.dataset[ this.parent.name + "Data" ] = value;
			return;
	
	}
}
Prop.prototype.setProp_sybtypes	= function(value, eventMethod){
	
	if(this.type == "render-variant"){

			if(typeof value == "string" ){

								this.render(value);	

			}else if(typeof value == "object" &&  value.renderType != undefined  && value.renderType == "container-inner"){

								this.renderByContainer(value);
								
			}else if(typeof value == "object" && value.componentName != undefined){				
				
				
				this.setOrCreateAndRender(value);
				
				
			}else{

				console.log("не удается отрисовать контейнер в render-variant если вы хотите отрисовать компонент то используйте текстовый параметр")
			}
			return;
			
	}else if(this.type == "group"){ 

		    if(Array.isArray(value) ){
				
					this.reuseGroup(value);
				

			}else if(typeof value == "object"){
				
				if(value.componentName != undefined && value.group != undefined){
					
					this.createNewGroup(value.group, value.componentName);
					
				}else{
					if(value.location != undefined){
						var location = value.location;
						
						delete value.location;
						
					}
					this.createInGroup(value, location);
				}
				
		}else {
			
			console.log("не получается создать "+value+"в группе компонента"+this.pathToCоmponent);
		}
		return;
	}else{ 
	
		var eventType = this.isEvent(value);

		if( eventType != false && this.type != eventType){ 

				if(eventMethod == undefined){			
				console.log("не определен обработчик для события-"+value);
				return;
			}

				this.events[value] = eventMethod.bind(this);		
				this.htmlLink.addEventListener(value , this.events[value]);	
				return;
		}else{
			
			
		}
  }
	
}
	
Prop.prototype.getProp = function(value) {
	
    if(this.pathToCоmponent != undefined){
				
				this.getProp_sybtypes(value);
				return;
				
	}else if(this.type == "text"){

				return this.htmlLink.textContent;

	}else if(this.type == "inputvalue" || this.type == "select"){

			return this.htmlLink.value;

	}else if(this.type == "checkbox" || this.type == "radio"){

				return this.htmlLink.checked;

			}else if(this.type == "class"){

				return this.htmlLink.classList;


	}else if(this.type == "html"){

				  return this.htmlLink.innerHTML;

    }else  if(this.isAttr(this.type) != false){


						return this.htmlLink.getAttribute(this.isAttr(this.type));

	}
	else if(this.type == "data"){ 
			
			return this.htmlLink.dataset[ this.parent.name + "Data" ];
	
	}
}
Prop.prototype.getProp_sybtypes	= function(value){
	
	if(this.type == "render-variant"){
		
			var return_obg = {};
			
		    if(value == undefined){
				
			
				if(this.renderChild.type == "container"){
										
					return_obg = this.renderChild.getAllProps();
					
				}else if(this.renderChild.type == "array"){
					
					return_obg = this.renderChild.getAll();
					
				}	
				return_obg["componentName"] = this.renderChild.pathToCоmponent;
				return return_obg;

			}else if(typeof value == "object"){
				
				if(this.renderChild.type == "container"){
										
					return_obg = this.renderChild.getAllProps(value);
					
				}else if(this.renderChild.type == "array"){
					
					return_obg = this.renderChild.getAll(value);
					
				}	
				if(value.componentName != undefined){
					
					return_obg["componentName"] = this.renderChild.pathToCоmponent;
				}
				return return_obg;

			}

	}else if(this.type == "group"){

			if(value == undefined){
						
						var array_r = [];
						
                         for(var i=0; i<this.groupChild.length; i++){
							 
							 array_r.push(this.groupChild[i].getAllProps());
							 
						 }
						 var componentName = "";
						 
						 if(this.groupArray != undefined)componentName = this.groupArray.pathToComponent;
						 
						return {group: array_r, componentName: componentName};
			}else{
				
				if(typeof value == "number"){
					
					return this.groupChild[value];
					
					
				}else if(typeof value == "object"){
					
						var array_r = [];
						

						 if(value.componentName == undefined && value.group == undefined){
							    for(var i=0; i<this.groupChild.length; i++){
							 
									array_r.push(this.groupChild[i].getAllProps(value));
							 
								} 
							 return array_r;
							 
						 }else{
							 
							 	for(var i=0; i<this.groupChild.length; i++){
							 
									array_r.push(this.groupChild[i].getAllProps(value));
							 
								} 
								
								var obj_r = {group: array_r};
								
								if(value.componentName != undefined)obj_r.componentName = this.groupArray.pathToComponent;
								
								return obj_r;
							 
						 }
						
				}	
			}	 

	}else if(this.isEvent(this.type) != false){ 

			//console.log("get for event property");
		return this.type;
		
	}else if(this.isEmiter(this.type) != false){ 

			//console.log("get for event property");
		return this.type;
		
	}

}

Prop.prototype.removeProp = function(value) {
	
	  if(this.pathToCоmponent != undefined){
				
				this.removeProp_sybtypes(value);
				return;
				
	}else if(this.type == "text"){

				return	this.htmlLink.textContent = "";

			}else if(this.type == "class"){
								
					if(Array.isArray(value)){
						
						for(var u=0; u < this.htmlLink.classList.length; u++){
							
							this.htmlLink.classList.remove(this.htmlLink.classList[u]);
						}					
					}else{
						
						this.htmlLink.classList.remove(value);
					}
					return;
	}else if(this.type == "html"){

				  this.htmlLink.innerHTML = "";
				  return;

    }else if(this.type == "checkbox" || this.type == "radio"){

				 this.htmlLink.checked = false;
				 return;

			}else if(this.type == "inputvalue" || this.type == "select"){

				this.htmlLink.value = "";
				return;

	}else  if(this.type == "data"){ 
			
			this.htmlLink.dataset[ this.parent.name + "Data" ] = "";
			return;
	
	}	
}
Prop.prototype.removeProp_sybtypes	= function(value){

	if(this.type == "render-variant"){
		
		var isRemove = false;

          if(this.renderChild.renderType == "container-inner"){
			  
			    isRemove = this.renderChild.remove(true);
		  }
				
		 if(isRemove == null){

			 			 this.renderChild.renderParent = null;	
		 }
	     this.renderChild = null;

	     		 this.htmlLink.innerHTML = "";
				 return;

			}else if(this.type == "group"){ 

		    if(value == undefined ){

						this.clearGroup();

					}else{

						this.removeFromGroup(value);

					}
					return;

			}else if(this.isAttr(this.type) != false){



								this.htmlLink.setAttribute(this.isAttr(this.type), "");
								return;

	}else if(this.isEvent(value) != false){ 

			this.htmlLink.removeEventListener(value, this.events[value]);		
		delete this.events[value];
		return;
		
	}

}
Prop.prototype.render = function(nameComponent){

	if(this.renderChild == undefined && nameComponent == undefined ){

			    console.log("не известен компонент для рендера");
		return  "undefinit render-variant";
	}
	if(nameComponent != undefined && this.rootLink.state[nameComponent] != undefined){
		
		this.renderChild = this.rootLink.state[nameComponent];
		
		this.rootLink.state[nameComponent].renderParent = this;		

		this.htmlLink.innerHTML = "";

		this.htmlLink.appendChild(this.renderChild.htmlLink);
		
	}else{
				
          console.log("не найден компонент "+nameComponent+" для рендера");
		return  "undefinit render-variant";
	}

}
Prop.prototype.renderByContainer = function(containerLink){

		if(containerLink != undefined && containerLink.renderType == "container-inner"){
		if(this.renderChild != undefined && this.renderChild.renderType != undefined && this.renderChild.renderType == "container-inner")this.renderChild.remove(true);

		this.renderChild = containerLink;
		this.renderChild.renderParent = this;

			}else{
		console.log(" для метода renderByContainer необходимо прередать container с renderType='container-inner'");
		return "undefined render-variant-htmlLink"
	}
	this.htmlLink.innerHTML = "";
	this.htmlLink.appendChild(this.renderChild.htmlLink);
}

Prop.prototype.setOrCreateAndRender = function(objWidthProps){

        if(objWidthProps.componentName == undefined){
			
			console.log("забыли указать имя компонента  .componentName в обьекте-параметре objWidthProps");
			
			return;
		}	
    var component = this.rootLink.state[objWidthProps.componentName];

    if(component.renderType == "virtual-array"){
		
		 if(this.renderChild != undefined && this.renderChild.pathToCоmponent != undefined &&  this.renderChild.pathToCоmponent == objWidthProps.componentName){

			 this.renderChild.setAllProps(objWidthProps);
			 
		 }else{
				
			 	var container = component.add(objWidthProps);

				this.renderByContainer(container);
					 
		 }		
	}else if(component.renderType == "container-outer"){
		
		
		component.setAllProps(objWidthProps);
		
		this.render(objWidthProps.componentName);
				
		
	}else if(component.renderType == "array"){
		
		if(objWidthProps.data == undefined){
			
			console.log("для отображения массива с новыми данными, в параметре objWidthProps.data должен содержаться массив с объектами");
			
			return;
		}	
			this.render(objWidthProps.componentName);
			
			component.reuseAll(objWidthProps.data);
	}
}

Prop.prototype.removeFromGroup = function(groupID){
	if(this.groupChild[groupID] == undefined){

				console.log("error- элемента с id = "+groupID+" в группе не существует");
		return;
	}
	delete this.groupChild[groupID].groupId;
	delete this.groupChild[groupID].groupParent;

		this.groupChild[groupID].remove(true);
	this.groupChild.splice(groupID, 1);
	for(var t=0; t< this.groupChild.length; t++){

				this.groupChild[t].groupId = t;
	}

}
Prop.prototype.clearGroup = function(){

		if(this.groupChild.length <= 0)return;

		var indexes = [];

		for(var i=0; i< this.groupChild.length; i++){

				indexes.push(this.groupChild[i].index);
	}



				this.rootLink.removeByIndexes(this.groupChild[0].pathToCоmponent, indexes, true);

		this.groupChild= [];
}
Prop.prototype.getGroupsArray = function(){
	
			if(this.groupArray == null || this.groupArray == undefined){
			
			      if(this.component().type=="array"){
					  
					  for(var h=0; h<this.component().data.length; h++){
						  
						  var groupArray_r = this.component().data[h].props[this.propName].groupArray;
						  
						  if(groupArray_r != null && groupArray_r != undefined){
							  
							  this.groupArray = groupArray_r;
							  
							  return this.groupArray;
							  
						  }
					  }
					  
				  }					  	
		}
	return null;	
}

Prop.prototype.reuseGroup = function(arrayWithObjects){
	
	
		if(this.groupArray == null && this.getGroupsArray() == null){
				
					console.log("error для использования метода .reuseGroup свойство должно иметь поле this.groupArray");
					return		
		}
	
		var newArrLength = arrayWithObjects.length;
		var oldArrLength = this.groupChild.length;
	
	var add = 0;
	var remove =0;
	
	if(newArrLength > oldArrLength) add = newArrLength - oldArrLength;
	if(newArrLength < oldArrLength) remove =  oldArrLength - newArrLength;
	
	for(var i=0; i<this.groupChild.length; i++){
		
		this.groupChild[i].setAllProps(arrayWithObjects[i]);
		
			for(var key in this.groupChild[i].props){
			
			this.groupChild[i].props[key].prop = null;
			
		}
		
	}	
	if(add > 0){
		for (var t=0; t<add; t++){
			

			
			this.createInGroup(arrayWithObjects[oldArrLength + t]);
		}	
	}
    if(remove > 0){
		for (var f=0; f<remove; f++){
			
			this.removeFromGroup( this.groupChild.length - 1 );
		}	
	}
		
}
Prop.prototype.createInGroup = function(props, insertLocation){
	
	if(this.groupArray == null && this.getGroupsArray() == null){
		
		console.log("error для использования метода createInGroup свойство должно иметь поле this.groupArray");
		return		
	}
	var container =  this.groupArray.add(props);
	
	this.addToGroup(container, insertLocation);	
}
Prop.prototype.createNewGroup = function(groupArr, componentName){
	
	if(this.groupArray != null && this.groupArray.pathToComponent != undefined && this.groupArray.pathToComponent == componentName){
		
		this.reuseGroup(groupArr);
		
	}else{		
		if(this.groupChild != undefined){
			this.clearGroup();
			
		}else{
			
			this.groupChild = [];
		}	
		
		this.groupArray = this.rootLink.state[componentName];
		
		for(var i=0; i<groupArr.length; i++){
			
			this.createInGroup(groupArr[i]);
	}		
	}	
}
Prop.prototype.addToGroup = function(container, insertLocation){ 

          		 var loc = "and";       
          if(insertLocation == "front")loc = 0;
          if(insertLocation != undefined && typeof insertLocation == 'number'  )loc = insertLocation;  		  
                        
						this.groupArray = this.rootLink.state[container.pathToCоmponent];
						container.groupParent = this;

				if( loc == "and"){

						this.htmlLink.appendChild(container.htmlLink);

						 this.groupChild.push(container);
			 container.groupId = this.groupChild.length-1;

					}else if(typeof loc == 'number'){

						this.htmlLink.insertBefore(container.htmlLink, this.htmlLink.children[loc]);

						this.groupChild.splice(insertLocation, 0, container);

							for(var i=insertLocation ; i < this.groupChild.length; i++){		

									this.groupChild[i].groupId = i;
				}			
		}
}
Prop.prototype.removeAllChild = function(){	
	
	var children = this.htmlLink.children;
	
	var count = children.length;
	
	for(var p=0; p< count ; p++ ){
	
		children[0].remove();
		
	}
	
}
Prop.prototype.component = function(){

	return this.rootLink.state[this.pathToCоmponent];
}

Prop.prototype.initRenderVariant = function(){

			var objIs = this.htmlLink.firstElementChild;
	
		if(objIs != undefined){

					var objToFind = objIs.dataset;
						
					for (var key5 in objToFind){
				if(objToFind[key5] == "array" ){

					if(this.rootLink.state[key5] == undefined && this.rootLink.description[key5] != undefined)this.rootLink.arrayInit(objIs, this.rootLink.description, key5);
					if(this.rootLink.state[key5] == undefined && this.rootLink.description[key5] == undefined && this.rootLink.description.fetchComponents != undefined && this.rootLink.description.fetchComponents[key5] != undefined)this.rootLink.arrayInit(objIs, this.rootLink.description.fetchComponents, key5);
					this.renderChild = this.rootLink.state[key5];
	                this.renderChild.renderParent = this;				
				}
				if(objToFind[key5] == "container" ){

						if(this.rootLink.description[key5] != undefined &&  this.rootLink.state[key5] == undefined){

														this.rootLink.containerInit(objIs, this.rootLink.description, key5);	

														if(this.rootLink.state[key5] != undefined){

																		this.renderChild = this.rootLink.state[key5];
																		this.renderChild.renderParent = this;

															}							

																				}else if (this.rootLink.description[key5] != undefined &&  this.rootLink.state[key5] != undefined){

														this.renderChild = this.rootLink.state[key5];
														this.renderChild.renderParent = this;

													}else if (this.rootLink.description[key5] == undefined &&  this.rootLink.state[key5] == undefined && this.rootLink.description.fetchComponents != undefined && this.rootLink.description.fetchComponents[key5] != undefined){

														this.rootLink.containerInit(objIs, this.rootLink.description.fetchComponents, key5);	
															this.renderChild = this.rootLink.state[key5];
															this.renderChild.renderParent = this;
															
														

													}else{

														var nameVirtualArray = null;
							                             var  nameContainer = null;

														for(var key4 in this.rootLink.description.virtualArrayComponents){

							  							  if(this.rootLink.description.virtualArrayComponents[key4].container == [key5] ){

								  								  nameVirtualArray = key4;
								  nameContainer = key5;

								  								}
							}
							if(nameVirtualArray == null || nameContainer == null){

										console.log("error- компонента "+key5+"  не найдено  убедитесь в коректности названия ключей после data");								
										return;
							}
							
							
								if(nameVirtualArray != null && this.rootLink.state[nameVirtualArray] ==  undefined){
									
									var selector = undefined;
			
									if(this.rootLink.description.virtualArrayComponents[nameVirtualArray].selector != undefined) selector = this.rootLink.description.virtualArrayComponents[nameVirtualArray].selector;
									
									this.rootLink.state[nameVirtualArray] = new HTMLixArray("virtual-array", objIs, this.rootLink, nameVirtualArray, selector);
								
									
								}

																

																if(nameVirtualArray != null && nameContainer != null){
										var container = new Container(
															objIs, 
															nameContainer, 
															this.rootLink.description.virtualArrayComponents[nameVirtualArray].props, 
															this.rootLink.description.virtualArrayComponents[nameVirtualArray].methods, 
															this.rootLink.state[nameVirtualArray].data.length , 
															nameVirtualArray, 
															this.rootLink);

											container.renderType = "container-inner";
											container.renderParent = this;
											this.rootLink.state[nameVirtualArray].data.push( container );										
											this.renderChild =  container;	
											//console.log(container);
											//console.log("/////////////////");
													}														
					}					
				}
			}

				}	

	}
Prop.prototype.initGroup = function(containerName, propName){

			var groupItems = this.htmlLink.children;
			var countItems = 0;

				if(groupItems.length != 0){

						for(var i=0; i< groupItems.length; i++ ){

						  var objToFind  = groupItems[i].dataset;

				                	var nameVirtualArray = null;
                    var nameContainer = null;					

				   				   for (var key5 in objToFind){

					   					  if(objToFind[key5] == "container" || objToFind[key5] == "template"){

						  						  for(var key57 in this.rootLink.description.virtualArrayComponents){

							  							  if(this.rootLink.description.virtualArrayComponents[key57].container == [key5] ){

								  								  nameVirtualArray = key57;
								  nameContainer = key5;
								  countItems ++

								  							  }
						  }						  

					  			   					if(nameContainer == null)console.log("error- контейнера "+key5+" не найдено в нутри контейнера "+containerName+" index - "+this.parentContainer.index+" проверьте правельность названия ключей в html коде");


											   	if(nameVirtualArray != null && this.rootLink.state[nameVirtualArray] ==  undefined){
													
												
													
													this.rootLink.state[nameVirtualArray] = new HTMLixArray("virtual-array", groupItems[i], this.rootLink, nameVirtualArray, undefined);
													
												}

										

					if(nameVirtualArray != null && nameContainer != null && objToFind[key5] == "container"){
						var container = new Container(groupItems[i], 
					                                 nameContainer, 
						                          this.rootLink.description.virtualArrayComponents[nameVirtualArray].props, 
						                           this.rootLink.description.virtualArrayComponents[nameVirtualArray].methods, 
						                          this.rootLink.state[nameVirtualArray].data.length , 
						                          nameVirtualArray, 
												  this.rootLink,
												  false
					                               );

												   						container.renderType = "container-inner";
						container.groupParent	= this;

												this.rootLink.state[nameVirtualArray].data.push( container );	
						this.groupChild.push(container);
						
						this.groupArray = this.rootLink.state[nameVirtualArray];
						//console.log(this);
						//console.log('/////////////////');
						container.groupId  = this.groupChild.length - 1; 
						if(container.createdContainer != undefined)container.createdContainer();

				 }else if(objToFind[key5] == "template"){
					 
					 this.groupArray = this.rootLink.state[nameVirtualArray];
					 
					 groupItems[i].setAttribute('style', "");
					 groupItems[i].dataset[key5] = "container";


					this.rootLink.state[nameVirtualArray].templateData = groupItems[i].cloneNode(true);

					groupItems[i].remove();
					 
					 
					 
					 
				 }else{
						 if(typeof propName != "string"){ 

						 						     console.log("error- проверьте правельность селектора для ключа "+propName[0]+" в контейнере "+containerName);

						 						 }else{

							 							 console.log("error- контейнера с ключем "+key5+" не найдено проверьте правельность названия ключей после data- в html коде")
						 }

				}
				 }
			   }	
		    }
			if(groupItems.length > countItems )console.log("warn - элементов в свойстве "+propName+" контейнера "+containerName+" index - "+this.parentContainer.index+" создано меньше чем обьявлено в теге, проверьте корректность написания ключей ");
		}

}
Prop.prototype.disableEvent = function(value){

		if(this.events[value] != undefined){

				if(this[value+'disable'] != undefined){

			return;
		}

					this[value+'disable'] = value;

				this.htmlLink.removeEventListener(value, this.events[value]);

			}else{

				console.log("обработчика с таким событием не найдено");
	}

	}
Prop.prototype.enableEvent = function(value){

		if(this.events[value] != undefined){

				if(this[value+'disable'] == undefined){

			return;
		}

				delete this[value+'disable'];

				this.htmlLink.addEventListener(value, this.events[value]);

			}else{

				console.log("обработчика с таким событием не найдено");
	}
}


Prop.prototype.isEmiter = function(emiterName, rootLink_p){

		var isEmiter = false;
		
        if(rootLink_p == undefined)rootLink_p = this.rootLink.eventProps;

			for(var key123 in rootLink_p.eventProps){		
		if(key123 == emiterName){
			isEmiter = key123;
		}
	}

			return  isEmiter;
}
Prop.prototype.isAttr = function (type){

		var isAttr = false;

		switch(type){

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
}
Prop.prototype.isEvent = function (type){

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