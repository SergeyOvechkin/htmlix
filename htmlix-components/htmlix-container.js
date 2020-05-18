function Container(htmlLink, containerName,  props, methods, index, pathToContainer, rootLink, isRuncreatedContainer, newProps) {
  this.htmlLink = htmlLink;
  this.rootLink = rootLink;
  this.props = {};
  this.index = index; 
  this.pathToCоmponent = pathToContainer; 
  this.name = containerName;
  this.type =  "container";
  this.renderType =  "container-outer";
  if(pathToContainer != containerName)this.renderType = "container-inner";

  if(props == undefined)props = [];
  for(var i2 = 0; i2 < props.length; i2++){

         if(methods == undefined)methods = {};

		 		 if(typeof props[i2] == "string"){

			 			 	    var htmlLinkToProp = this.htmlLink.querySelector('[data-'+containerName+'-'+props[i2]+']');

										if(htmlLinkToProp == undefined)htmlLinkToProp = this.htmlLink;			

							this.props[ props[i2] ] = constructorProps(htmlLinkToProp, containerName,	props[i2], methods[ props[i2] ],
																						this.pathToCоmponent,
																						this,
																						this.rootLink,
																						newProps
																					);	
		 }else{

			     				 var string =  props[i2][0];

				 				 var selector = props[i2][2];

				 				 var  htmlLinkToProp = this.htmlLink;

				 				 if(selector != ""){

											  htmlLinkToProp = this.htmlLink.querySelector(selector);

					  						  if(htmlLinkToProp == undefined){
												  
												  console.log("error - не возможно найти селектор для свойства "+selector+" контейнера "+containerName+" проверьте правильность селектора или наличие тега в html разметке");
												  continue;
											  }
				                 }

			     		 				      this.props[ string ] = constructorProps(htmlLinkToProp, 
				                                   containerName,	
												   props[i2], 
												   methods[ string ],
													this.pathToCоmponent,
													this,
												   this.rootLink,
												   newProps
																);	

		 }


		 								}
       if(methods.createdContainer != undefined ){ 

				this.createdContainer = methods.createdContainer.bind(this)

		if(isRuncreatedContainer==undefined || isRuncreatedContainer!=false){
			
			this.createdContainer();
			//console.log(this);
		}
	}

	}
Container.prototype.remove = function(widthChild){
	if(this.index == null){

				console.log("conteiner without array not removing, to remove its first add container to array");
		return null;
	}
	if(this.groupId != undefined && this.groupParent !=undefined){
		
		this.groupParent.removeFromGroup(this.groupId);
		return;
	}
	if(this.renderParent !=undefined && this.renderParent.renderChild != undefined && this.renderParent.renderChild != null){ 
	
		this.renderParent.renderChild = null;
	
	}
	if(widthChild != undefined && widthChild == true){

				this.rootLink.removeByIndexes(this.pathToCоmponent, [this.index], true);

			}else{
		this.rootLink.removeByIndexes(this.pathToCоmponent, [this.index]);
	}
      return true;
}

Container.prototype.setAllProps = function(properties){
	
		for(key in properties){

				if(this.props[key]!= undefined){

						this.props[key].setProp(properties[key]);
						
				}else if(key != "componentName"){
					//console.log(this);
					console.log("warn не найден ключь "+key+" в контейнере "+this.name+" index "+this.index+" массива "+this.pathToCоmponent+" проверте правильность названия ключей в объекте properties");
				}
	}
	
}
Container.prototype.getAllProps = function(properties){
	
	var properties_r = {};
	
	if(properties != undefined){
		
		for(key in properties){

				if(this.props[key]!= undefined){
						
						properties_r[key] = this.props[key].getProp(properties[key]);
				}
		}
	}else{
		
		for(key in this.props){

			properties_r[key] = this.props[key].getProp();

		}
		
	}
	//console.log( properties_r);
	return properties_r;
}	
	

Container.prototype.component = function(){
	
	
	return this.rootLink.state[this.pathToCоmponent];
}