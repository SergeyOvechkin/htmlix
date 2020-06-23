function PropGroup(htmlLink, propType, keyData1,  propName,  pathToComponent, parentComponent, rootLink, newProps){
	

	
	 PropSubtype.call(this, htmlLink,  propType, propName,  pathToComponent, parentComponent, rootLink);
	 
	 	this.groupChild = [];
	this.groupArray = null;
	 
	 			if(newProps == undefined || newProps[propName] == undefined 
				|| typeof newProps[propName] != "object" ||  newProps[propName].componentName == undefined ){
					this.initGroup(keyData1, propName);
				}else{
					this.removeAllChild();
				}	

}
PropGroup.prototype = Object.create(PropSubtype.prototype);

Object.defineProperty(PropGroup.prototype, 'constructor', { 
    value: PropGroup, 
    enumerable: false, // false, чтобы данное свойство не появлялось в цикле for in
    writable: true });

PropGroup.prototype.getProp= function(value){
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
	
}
PropGroup.prototype.setProp= function(value){
	
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
			
			console.log("не получается создать "+value+"в группе компонента"+this.pathToComponent);
		}
		return;
	
}
PropGroup.prototype.removeProp= function(value){
	
			    if(value == undefined ){

						this.clearGroup();

					}else{

						this.removeFromGroup(value);

					}
					return;
	
}
PropGroup.prototype.removeFromGroup = function(groupID){
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
PropGroup.prototype.clearGroup = function(){
	
	   var count = this.groupChild.length;

		if(count <= 0)return;

		var indexes = [];

		for(var i=0; i< count; i++){

				indexes.push(this.groupChild[i].index);
	}
	this.rootLink.state[this.groupChild[0].pathToCоmponent].removeIndex(indexes, true);

	this.groupChild.length = 0;
}
PropGroup.prototype.getGroupsArray = function(){
	
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

PropGroup.prototype.reuseGroup = function(arrayWithObjects){
	
	
		if(this.groupArray == null && this.getGroupsArray() == null){
				
					console.log("error для использования метода .reuseGroup свойство должно иметь поле this.groupArray !=null");
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
			
			if(this.groupChild[i].props[key].prop != undefined)this.groupChild[i].props[key].prop = null;
			
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
PropGroup.prototype.createInGroup = function(props, insertLocation){
	
	if(this.groupArray == null && this.getGroupsArray() == null && props.componentName == undefined){
		
		console.log("error для использования метода createInGroup свойство должно иметь поле this.groupArray !=null");
		return		
	}
	if(this.groupArray == null || this.groupArray == undefined)this.groupArray = this.rootLink.state[props.componentName];
		
	var container =  this.groupArray.add(props);
	
	this.addToGroup(container, insertLocation);	
}
PropGroup.prototype.createNewGroup = function(groupArr, componentName){
	

	
	if(this.groupArray != null && this.groupArray.pathToComponent != undefined && this.groupArray.pathToComponent == componentName){
		
		this.reuseGroup(groupArr);
		
	}else{		
		if(this.groupChild != undefined && this.groupChild.length != 0){
			this.clearGroup();
			
		}else{
			
			this.groupChild = [];
		}	
		
		this.groupArray = this.rootLink.state[componentName];
		if(!this.groupArray)console.log("error не создан компонент "+componentName);
		
		for(var i=0; i<groupArr.length; i++){
			
			this.createInGroup(groupArr[i]);
	}		
	}	
}
PropGroup.prototype.addToGroup = function(container, insertLocation){ 

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
PropGroup.prototype.order= function(newOrderArr){ 

	var htmlLink = this.htmlLink;
	

	if(newOrderArr.length != this.groupChild.length){
		
		console.log("в массиве newOrderArr, должно быть столько же элементов сколько и в массиве this.groupChild");
		return;
		
	}	
	var newData = [];
	
	for(var i=0; i<newOrderArr.length; i++){
		
		newData.push(this.groupChild[newOrderArr[i]]);
	}
	this.groupChild = newData;
	htmlLink.innerHTML = "";
	
	for(var k=0; k< this.groupChild.length; k++){
		
		htmlLink.appendChild(this.groupChild[k].htmlLink);
		
		this.groupChild[k].groupId = k;
	}
}

PropGroup.prototype.initGroup = function(containerName, propName){

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

					    //container.renderType = "container-inner";
						container.groupParent	= this;

						this.rootLink.state[nameVirtualArray].data.push( container );	
						this.groupChild.push(container);
						
						this.groupArray = this.rootLink.state[nameVirtualArray];
						//console.log(this);
						//console.log('/////////////////');
						container.groupId  = this.groupChild.length - 1; 
						if(container.onCreatedContainer != undefined)container.onCreatedContainer();

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