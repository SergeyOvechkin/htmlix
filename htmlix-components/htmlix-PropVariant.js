function PropVariant(htmlLink, propType,   propName,  pathToComponent, parentComponent, rootLink, newProps){
	
	
	
	 PropSubtype.call(this, htmlLink,  propType, propName,  pathToComponent, parentComponent, rootLink);
	 
	 this.renderChild = null;
	 
	 				if(newProps == undefined || newProps[propName] == undefined 
				|| typeof newProps[propName] != "object" ||  newProps[propName].componentName == undefined){

					this.initRenderVariant();
				}else{
					
					this.removeAllChild();
				}


}
PropVariant.prototype = Object.create(PropSubtype.prototype);

Object.defineProperty(PropVariant.prototype, 'constructor', { 
    value: PropVariant, 
    enumerable: false,
    writable: true });

PropVariant.prototype.getProp= function(value){
	
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
	
}
PropVariant.prototype.setProp= function(value){
	
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
	
}
PropVariant.prototype.removeProp= function(value){
	
			var isRemove = null;

          if(this.renderChild != null && this.renderChild.renderType == "container-inner"){
			  
			    isRemove = this.renderChild.remove(true);
		  }
				
		 if(isRemove == null){

			 			 this.renderChild.renderParent = null;	
		 }
	     this.renderChild = null;

	     		 this.htmlLink.innerHTML = "";
				 return;
	
}
PropVariant.prototype.render = function(nameComponent){

	if(this.renderChild == null && nameComponent == undefined ){

			    console.log("не известен компонент для рендера");
		return  "undefinit render-variant";
	}
	if(nameComponent != undefined && this.rootLink.state[nameComponent] != undefined){
		
		if(this.renderChild != null && this.renderChild.renderParent != undefined && this.renderChild.renderParent != null)this.renderChild.renderParent = null;
		
		this.renderChild = this.rootLink.state[nameComponent];
		
		this.rootLink.state[nameComponent].renderParent = this;		

		this.htmlLink.innerHTML = "";

		this.htmlLink.appendChild(this.renderChild.htmlLink);
		
	}else{
				
          console.log("не найден компонент "+nameComponent+" для рендера");
		return  "undefinit render-variant";
	}

}
PropVariant.prototype.renderByContainer = function(containerLink){

		if(containerLink != undefined && containerLink.renderType == "container-inner"){
		if(this.renderChild != null && this.renderChild.renderType != undefined && this.renderChild.renderType == "container-inner")this.renderChild.remove(true);

		this.renderChild = containerLink;
		this.renderChild.renderParent = this;

			}else{
		console.log(" для метода renderByContainer необходимо прередать container с renderType='container-inner'");
		return "undefined render-variant-htmlLink"
	}
	this.htmlLink.innerHTML = "";
	this.htmlLink.appendChild(this.renderChild.htmlLink);
}

PropVariant.prototype.setOrCreateAndRender = function(objWidthProps){

        if(objWidthProps.componentName == undefined){
			
			console.log("забыли указать имя компонента  .componentName в обьекте-параметре objWidthProps");
			
			return;
		}	
    var component = this.rootLink.state[objWidthProps.componentName];

    if(component.renderType == "virtual-array"){
		
		 if(this.renderChild != null && this.renderChild.pathToCоmponent != undefined &&  this.renderChild.pathToCоmponent == objWidthProps.componentName){

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
PropVariant.prototype.initRenderVariant = function(){

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

											//container.renderType = "container-inner";
											container.renderParent = this;
											this.rootLink.state[nameVirtualArray].data.push( container );										
											this.renderChild =  container;	

													}														
					}					
				}
			}

				}	

	}