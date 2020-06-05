
function constructorProps(htmlLink, keyData1, keyData2, eventMethod, pathToContainer, parentContainer, rootLink, newProps) {
	var propType = null;

		if(typeof keyData2 == "object"){
          
	  	  propType = keyData2[1];
		  
		  if(keyData2[0].search("data") == 0){
			  
			  propType = "data";
			  
			  return new PropCommon(htmlLink, propType,  parentContainer, keyData2[0]);
		  }

	    }else if(keyData2.search("data") == 0){
			
			propType = "data";
			
			return new PropCommon(htmlLink, propType,  parentContainer, keyData2);
			
		}else{
			
			propType = htmlLink.dataset[ keyData1 + rootLink.capitalizeFirstLetter(keyData2) ];
		}
  if(propType == null){
		
           var mess = "error не определен тип свойства для data-"+keyData1+"-"+keyData2+" в html коде не найдено для компонента "+pathToContainer+", index= "+parentContainer.index+" !, проверьте правильность названия свойств";
			console.log(mess);
           throw mess;
	 }
	if(propType == "render-variant" ){
		
       return new PropVariant(htmlLink, propType,  keyData2, pathToContainer, parentContainer, rootLink, newProps);
		  		  
	}else  if(propType == "group"){
		
		return new PropGroup(htmlLink, propType, keyData1, keyData2, pathToContainer, parentContainer, rootLink, newProps);
				
	}else if(propType == "group-mix"){
		
		return new PropGroupMix(htmlLink, propType, keyData1, keyData2, pathToContainer, parentContainer, rootLink, newProps);
				
	}else  if(eventMethod != undefined && isEmiter(propType, rootLink) != false  ){
	  
		return new PropEventEmiter(htmlLink, propType, keyData2, eventMethod, pathToContainer, parentContainer, rootLink);
	 
	}else if( eventMethod != undefined && isEvent(propType) != false ){

        return new PropStandartEvent(htmlLink, propType, keyData2, eventMethod, pathToContainer, parentContainer, rootLink);
	
  }else {
		
		return new PropCommon(htmlLink, propType);
		
	}
}

function PropCommon(htmlLink, propType, parentComponent, propName){
	
	
	 this.htmlLink = htmlLink;
	 this.type = propType;
	 
	 if(this.type == "data"){
		 
		 this.parent = parentComponent;
		 this.propName = propName;
	 }

}
function PropSubtype(htmlLink, propType, propName,  pathToComponent, parentComponent, rootLink){
	
	  //PropCommon.call(this, htmlLink, propType, parentComponent);
		this.htmlLink = htmlLink;
		this.type = propType;
	  	this.pathToCоmponent = pathToComponent; 
		this.parent = parentComponent; 
		this.rootLink = rootLink;
		this.prop = null;
		this.propName = propName;	

}
PropSubtype.prototype.component = function(){

	return this.rootLink.state[this.pathToCоmponent];
}
PropSubtype.prototype.removeAllChild = function(){	
	
	var children = this.htmlLink.children;
	
	var count = children.length;
	
	for(var p=0; p< count ; p++ ){
	
		children[0].remove();
		
	}
	
}

PropCommon.prototype.setProp = function(value) {
	
			if(this.type == "text"){

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
                         var classLength = this.htmlLink.classList.length;
						
						for(var u=0; u < classLength; u++){
							
							this.htmlLink.classList.remove(this.htmlLink.classList[0]);
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
			
			this.htmlLink.dataset[ this.parent.name + this.parent.rootLink.capitalizeFirstLetter(this.propName) ] = value;
			return;
	
	}
}

PropCommon.prototype.getProp = function() {
	
	if(this.type == "text"){

				return this.htmlLink.textContent;

	}else if(this.type == "inputvalue" || this.type == "select"){

			return this.htmlLink.value;

	}else if(this.type == "checkbox" || this.type == "radio"){

				return this.htmlLink.checked;

			}else if(this.type == "class"){
				
				var classList = this.htmlLink.classList;
				var clasArr = [];
				for(var i=0; i< classList.length; i++){
					
					clasArr.push(classList[i]);
					
				}
				return clasArr;


	}else if(this.type == "html"){

				  return this.htmlLink.innerHTML;

    }else  if(this.isAttr(this.type) != false){


						return this.htmlLink.getAttribute(this.isAttr(this.type));

	}
	else if(this.type == "data"){ 
			
			return this.htmlLink.dataset[ this.parent.name + this.parent.rootLink.capitalizeFirstLetter(this.propName) ];
	
	}
}
PropCommon.prototype.removeProp = function(value) {
	
			if(this.type == "text"){

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
			
			this.htmlLink.dataset[ this.parent.name + this.rootLink.parent.capitalizeFirstLetter(this.propName) ] = "";
			return;
	
	}else if(this.isAttr(this.type) != false){

				this.htmlLink.removeAttribute(this.isAttr(this.type));
				return;

	}	
}

PropCommon.prototype.isAttr = function (type){

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
function isEmiter(emiterName, rootLink_p){

		var isEmiter = false;

			for(var key123 in rootLink_p.eventProps){		
		if(key123 == emiterName){
			isEmiter = key123;
		}
	}

			return  isEmiter;
}
function isEvent (type){

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
