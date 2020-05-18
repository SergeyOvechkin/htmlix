
function constructorProps(htmlLink, keyData1, keyData2, eventMethod, pathToContainer, parentContainer, rootLink, newProps) {
	var propType = "";

		if(typeof keyData2 == "object"){
          
	  	  propType = keyData2[1];

	    }else if(keyData2 == "data"){
			
			propType = "data";
			
			return new PropCommon(htmlLink, propType,  parentContainer);
			
		}else{
			
			propType = htmlLink.dataset[ keyData1 + rootLink.capitalizeFirstLetter(keyData2) ];
		}
  if(propType == null){
		
           var mess = "error не определен тип свойства для data-"+keyData1+"-"+keyData2+" в html коде не найдено для компонента "+pathToContainer+", index= "+parentContainer.index+" !, проверьте правильность названия свойств";
			console.log(mess);
           throw mess;
	 }
  if( eventMethod != undefined && isEvent(propType) != false ){

        return new PropStandartEvent(htmlLink, propType, keyData2, eventMethod, pathToContainer, parentContainer, rootLink);
	
  }
   else if(eventMethod != undefined && isEmiter(propType, rootLink) != false  ){
	  
		return new PropEventEmiter(htmlLink, propType, keyData2, eventMethod, pathToContainer, parentContainer, rootLink);
	 
	}
	else if(propType == "render-variant" ){
		
       return new PropVariant(htmlLink, propType,  keyData2, pathToContainer, parentContainer, rootLink, newProps);
		  		  

	}else if(propType == "group"){
		
		return new PropGroup(htmlLink, propType, keyData1, keyData2, pathToContainer, parentContainer, rootLink, newProps);
				
	}else {
		
		return new PropCommon(htmlLink, propType,  parentContainer);
		
	}
}

function PropCommon(htmlLink, propType, parentComponent){
	
	
	 this.htmlLink = htmlLink;
	 this.type = propType;
	 
	 if(this.type == "data"){
		 
		 this.parent = parentComponent;
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

PropCommon.prototype.setProp = function(value, eventMethod) {
	
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

PropCommon.prototype.getProp = function(value) {
	
	if(this.type == "text"){

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
			
			this.htmlLink.dataset[ this.parent.name + "Data" ] = "";
			return;
	
	}else if(this.isAttr(this.type) != false){

				this.htmlLink.setAttribute(this.isAttr(this.type), "");
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
