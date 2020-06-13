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
           
          ///описание наследуемого компонента		   
		  var parCont = this.rootLink.description[parentContainerName];
		   if(parCont == undefined &&  this.rootLink.description.virtualArrayComponents != undefined){
			   
			   parCont = this.rootLink.description.virtualArrayComponents[parentContainerName];
			   
		   }else if(parCont == undefined &&  this.rootLink.description.fetchComponents != undefined){
			   
			   parCont = this.rootLink.description.fetchComponents[parentContainerName];
		   }
		   if(parCont == undefined)console.log("error неправильно указано имя компонента наследуемого контейнера в container_extend");
			 
		   var shareProps = parCont.props;
		
		
		  if(parCont.share_props != undefined){
			  		  
			  shareProps = shareProps.slice(0, parCont.share_props);
		  }
		  for(var u =0; u < shareProps.length; u++){
			  
			  var keyProp = shareProps[u];
			  if(typeof keyProp == "object")keyProp = shareProps[u][0];
			  
			  var isPersist = false;
			  
			  thisArrDesc.props.forEach((prop)=>{ 			  
			             var findProp = prop;						
						if(typeof findProp == "object")findProp = findProp[0];
						if(findProp == keyProp)isPersist = true;						
			  });
			  
			  if(isPersist)continue
			  
			  thisArrDesc.props.push(shareProps[u]);
			  
			  if(parCont.methods[keyProp] != undefined){
				  
				 thisArrDesc.methods[keyProp] = parCont.methods[keyProp];
			  }
		  }		  
		  //thisArrDesc.props = shareProps.concat(thisArrDesc.props);
	  }
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
