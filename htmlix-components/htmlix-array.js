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

		}
HTMLixArray.prototype.add = function(props, insertLocation){
		
		var container = this.rootLink.addContainer(this.pathToComponent, props, insertLocation);
		return  container;

	}

HTMLixArray.prototype.removeIndex = function(indexArray, widthChild){

		if(typeof indexArray != "object")indexArray = [indexArray];

		this.rootLink.removeByIndexes(this.pathToComponent, indexArray, widthChild)

	}

HTMLixArray.prototype.removeAll = function( widthChild){

		this.rootLink.removeAll(this.pathToComponent, widthChild)

	}
	
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

HTMLixArray.prototype.order = function(newOrderArr){
	
	
	this.rootLink.changeOrder(this.pathToComponent, newOrderArr);
	
}
