function PropGroupMix(htmlLink, propType, keyData1,  propName,  pathToComponent, parentComponent, rootLink, newProps){
	
	
	 PropSubtype.call(this, htmlLink,  propType, propName,  pathToComponent, parentComponent, rootLink);
	 
	 	this.groupChild = [];	
	 
	 			if(newProps == undefined || newProps[propName] == undefined 
				|| typeof newProps[propName] != "object" ||  newProps[propName].componentName == undefined ){
					this.initGroup(keyData1, propName);
					
				}else{
					this.removeAllChild();
				}	

}

PropGroupMix.prototype = Object.create(PropSubtype.prototype);

Object.defineProperty(PropGroup.prototype, 'constructor', { 
    value: PropGroupMix, 
    enumerable: false, // false, чтобы данное свойство не появлялось в цикле for in
    writable: true });


PropGroupMix.prototype.getProp= function(value){
				if(value == undefined){
						
						var array_r = [];
						
                         for(var i=0; i<this.groupChild.length; i++){
							 
							 var item = this.groupChild[i].getAllProps();
							
							 item.componentName = this.groupChild[i].pathToCоmponent;							 
							 array_r.push(item);
							 
						 }
						return array_r;
			}else{
				
				if(typeof value == "number"){
					
					return this.groupChild[value];
					
					
				}else if(typeof value == "object"){
					
						var array_r = [];
						
							 
							 	for(var i=0; i<this.groupChild.length; i++){
									
									 var item = this.groupChild[i].getAllProps(value);
							  
									if(value.componentName != undefined)item.componentName = this.groupChild[i].pathToCоmponent;
									array_r.push(item);
							 
								} 
								
								return array_r;						
				}	
			}
	
}
PropGroupMix.prototype.setProp= function(value){
	
			if(Array.isArray(value) ){
				
				this.clearGroup();
				for(var i=0; i< value.length; i++){
					
					if(value[i].location != undefined ){
						var location = value[i].location;
						
						delete value[i].location;
						
					}
					
					this.createInGroup(value[i], location);
					
				}
			}else if(typeof value == "object"){
				

					if(value.location != undefined ){
						var location = value.location;
						
						delete value.location;
						
					}
					this.createInGroup(value, location);			
				
		}else {
			
			console.log("не получается создать "+value+"в группе компонента"+this.pathToCоmponent);
		}
		return;	
}
PropGroupMix.prototype.order= function(newOrderArr){ 

	PropGroup.prototype.order.call(this, newOrderArr);
	
}
PropGroupMix.prototype.removeProp= function(value){
	
	PropGroup.prototype.removeProp.call(this, value);
	
	
}
PropGroupMix.prototype.initGroup = function(containerName, propName){
		
	PropGroup.prototype.initGroup.call(this, containerName, propName);
	if(this.groupArray != undefined)delete this.groupArray;
	
}	

PropGroupMix.prototype.addToGroup = function(container, insertLocation){ 

		PropGroup.prototype.addToGroup.call(this, container, insertLocation);
		if(this.groupArray != undefined)delete this.groupArray;
}
PropGroupMix.prototype.removeFromGroup = function(groupID){
		PropGroup.prototype.removeFromGroup.call(this, groupID);
}

PropGroupMix.prototype.createInGroup = function(props, insertLocation){
	
	if(props.componentName == undefined){
		
		console.log("error для использования метода createInGroup в параметре должно присутствовать поле props.componentName");
		return		
	}
	var vArr = this.rootLink.state[props.componentName];
	if(vArr == undefined)console.log("error не создан виртуальный массив "+props.componentName);
	
	var container =  vArr.add(props);	
	this.addToGroup(container, insertLocation);	
}
PropGroupMix.prototype.clearGroup = function(){
	
	   var count = this.groupChild.length;

		if(count <= 0)return;

		for(var i=0; i< count; i++){
			
			this.groupChild[0].remove(true);

	}
		this.groupChild.length = 0;
}


