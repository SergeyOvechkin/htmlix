function PropEventEmiter(htmlLink, propType, propName, eventMethod, pathToComponent, parentComponent, rootLink){
	

	
	 PropSubtype.call(this, htmlLink, propType, propName,  pathToComponent, parentComponent, rootLink)
	// console.log(this);
	
	 this.emiterKey = "";
	 this.emiter = "";
	 this.eventMethod = eventMethod.bind(this);
	
	
	  this.emiterKey = "key"+Math.floor(Math.random()*89999+10000);
	  this.emiter = this.rootLink.eventProps[this.type];
	  this.rootLink.eventProps[this.type].addListener(htmlLink, this.eventMethod, this.type, this.emiterKey);
}
PropEventEmiter.prototype = Object.create(PropSubtype.prototype);

Object.defineProperty(PropEventEmiter.prototype, 'constructor', { 
    value: PropEventEmiter, 
    enumerable: false, // false, чтобы данное свойство не появлялось в цикле for in
    writable: true });

PropEventEmiter.prototype.getProp = function(){
	
	return this.type;
}
PropEventEmiter.prototype.setProp= function(){
	
	return false;
}
PropEventEmiter.prototype.removeProp= function(){
	
	return false;
}
PropEventEmiter.prototype.disableEvent= function(){
	

		if(this[this.type+'-disable'] != undefined){

			return;
		}

		this[this.type+'-disable'] = true;

				this.emiter.removeListener(this.htmlLink);

}
PropEventEmiter.prototype.enableEvent = function(){

		if(this[this.type+'-disable'] == undefined){

			return;
		}
		delete this[this.type+'-disable'];

		this.emiter.addListener(this.htmlLink, this.eventMethod, this.type, this.emiterKey);
}

/*PropEventEmiter.prototype.component = function(){

	return this.rootLink.state[this.pathToCоmponent];
}*/
/////////////////////////////////////////////





function PropStandartEvent(htmlLink, propType, propName, eventMethod, pathToComponent, parentComponent, rootLink){
	
	
	
	 PropSubtype.call(this, htmlLink, propType, propName,  pathToComponent, parentComponent, rootLink);
	 //console.log(this);
	 
	 this.events = {};
	 
	 this.events[this.type] = eventMethod.bind(this);	
	 this.htmlLink.addEventListener(this.type, this.events[this.type]);
	 


}
PropStandartEvent.prototype = Object.create(PropSubtype.prototype);

Object.defineProperty(PropStandartEvent.prototype, 'constructor', { 
    value: PropStandartEvent, 
    enumerable: false, // false, чтобы данное свойство не появлялось в цикле for in
    writable: true });
/*	
PropStandartEvent.prototype.component = function(){

	return this.rootLink.state[this.pathToCоmponent];
}*/
PropStandartEvent.prototype.getProp= function(){
	
	return this.type;
}
PropStandartEvent.prototype.setProp= function(value, eventMethod){
	
	
			if(eventMethod == undefined){			
				console.log("не определен обработчик для события-"+value);
				return;
			}

				this.events[value] = eventMethod.bind(this);		
				this.htmlLink.addEventListener(value , this.events[value]);	
				return;
	
}
PropStandartEvent.prototype.removeProp= function(value){

		this.htmlLink.removeEventListener(value, this.events[value]);		
		delete this.events[value];
		return;
}		

PropStandartEvent.prototype.disableEvent = function(value){
        if(value == undefined){
			value = this.type;
		}
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
PropStandartEvent.prototype.enableEvent = function(value){
        if(value == undefined){
			value = this.type;
		}
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
PropStandartEvent.prototype.emitEvent = function(eventName){
	
	this.events[eventName]()
	
}