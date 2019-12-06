var classTarget = {object:null,gruppo:''};
var classDraggable = {object:null,gruppo:''};

var DragDrop = {
	hasClass: function(ele,cls){return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));},
	addClass: function(ele,cls){if (!DragDrop.hasClass(ele,cls)){ele.className += " "+cls;}},
	removeClass: function(ele,cls){if (DragDrop.hasClass(ele,cls)){var reg=new RegExp('(\\s|^)'+cls+'(\\s|$)');ele.className=ele.className.replace(reg,' ');}},
	documentOffset : {Top:0,Left:0,ScrollTop:0,ScrollLeft:0},
	setOffsetDocument: function (){},
	dragObj : document.createElement('div'),
	veloObj : document.createElement('div'),
	classDragObj:null,
	selectedObj:null,
	Array_Object2disable: [],
	disableSelection:function (){for(var i=0;i<DragDrop.Array_Object2disable.length;i++) DragDrop.Array_Object2disable[i].onselectstart=function(){return false}},
	selectedObject:[],
	targets:{Array_Target:[],Array_Gruppo:[]},
	targetsAttivi:{Array_Target:[],Array_Top:[],Array_Left:[],Array_Bottom:[],Array_Right:[]},
	differenza:{X:0,Y:0},
	getHtmlContent:function(obj){return obj.outerHTML;},
	resetTarget:function(){DragDrop.targets={Array_Target:new Array(),Array_Gruppo:new Array()};},
	resetSelectedObject:function(){DragDrop.selectedObject =new Array();},
	resetObj:function()
		{
			DragDrop.targets={Array_Target:new Array(),Array_Gruppo:new Array()}
			DragDrop.selectedObject =new Array();
		},
	getPosition: function(obj)
		{
			this.curleft = this.curtop =  0;this.curwidth = obj.offsetWidth;this.curheight = obj.offsetHeight;	
			
			DragDrop.documentOffset.Top= DragDrop.documentOffset.Left=DragDrop.documentOffset.ScrollTop = DragDrop.documentOffset.ScrollLeft =0;
			

			/*************************/
			
			function getDocumentElement(obj){
				var objDocument=obj;do{objDocument = objDocument.parentNode;}while(objDocument.parentNode); return objDocument;
			}
			function getPositionInDocument(obj){
				this.left=this.top=0;if(obj.offsetParent){do{this.left+=obj.offsetLeft-obj.scrollLeft;this.top+=obj.offsetTop-obj.scrollTop;}while(obj=obj.offsetParent)}
			}

			var objIndicato=obj;
			var objDocument=objIndicato;

			//dell'oggetto originale calcolo la posizione relativa al proprio documento
			//a questo punto il nuovo oggetto di cui calcolare la posizione diventa il frame contenitore se il document è diverso
			//da quello contenente il dragdrop
			
			var objDaCalcolare = obj;
			var objDocument = getDocumentElement(objDaCalcolare);
			var pos;
			var continuaSuFrameSuperiore = true;
			
			DragDrop.documentOffset.Top= document.documentElement.offsetTop;
			DragDrop.documentOffset.Left=document.documentElement.offsetLeft;
			DragDrop.documentOffset.ScrollTop = document.documentElement.scrollTop;
			DragDrop.documentOffset.ScrollLeft =document.documentElement.scrollLeft;

			do{

				pos=new getPositionInDocument(objDaCalcolare);
				this.curleft+=pos.left;
				this.curtop+=pos.top;
				
				continuaSuFrameSuperiore=(objDocument!=document);
				
				if(objDocument.parentWindow.frameElement!=null){
					objDaCalcolare = objDocument.parentWindow.frameElement;
					objDocument = getDocumentElement(objDaCalcolare);					
				}

			}while (continuaSuFrameSuperiore);
		},
	addSelectedObject: function(inObject)
		{	
			var classObj = {Obj:null,gruppo:'',cssObj:''};		
		
			classObj.Obj=inObject.object;
			classObj.gruppo = inObject.gruppo;
			classObj.cssObj = inObject.cssObj;
			DragDrop.selectedObject.push(classObj);
			inObject.object.onmousedown=function(){ try{event.cancelBubble=true}catch(e){};DragDrop.mouseDown(this);};
			inObject.object.style.cursor='hand';
		},
	addTarget: function(inClass)
		{
			
			for (var i=0;i<DragDrop.targets.Array_Target.length;i++){
				if (DragDrop.targets.Array_Target[i]==inClass.object) //target già associato capita nel caso in cui venga ricaricato un frame
					return;
			}
			DragDrop.targets.Array_Target.push(inClass.object);
			DragDrop.targets.Array_Gruppo.push(inClass.gruppo);
		},
	removeTarget: function(inClass)
		{
			var index=null;
			for (var i=0;i<DragDrop.targets.Array_Target.length;i++)
				if (DragDrop.targets.Array_Target[i]==inClass.object) 
				{
					index=i;
					break;
				}
			if (index!= null)
			{
				DragDrop.targets.Array_Target.splice(index,1);
				DragDrop.targets.Array_Gruppo.splice(index,1);
			}		
		},
	recalTargetPosition: function(gruppoAttivo)
		{
			//alert(DragDrop.targets.Array_Target.length);targetsAttivi
			var objectPosition;
			DragDrop.targetsAttivi ={Array_Target:[],Array_Top:[],Array_Bottom:[],Array_Left:[],Array_Right:[]};
			for (var i=0;i<DragDrop.targets.Array_Target.length;i++)
			{
				if(DragDrop.targets.Array_Gruppo[i]==gruppoAttivo){
					objectPosition = new DragDrop.getPosition(DragDrop.targets.Array_Target[i]);	
					//alert(DragDrop.targets.Array_Target[i].outerHTML + ' : top:' + objectPosition.curtop);
					DragDrop.targetsAttivi.Array_Target.push(DragDrop.targets.Array_Target[i]);
					DragDrop.targetsAttivi.Array_Top.push(parseInt(objectPosition.curtop,10));
					DragDrop.targetsAttivi.Array_Bottom.push(parseInt(parseInt(objectPosition.curtop,10) + parseInt(objectPosition.curheight,10),10));
					DragDrop.targetsAttivi.Array_Left.push(parseInt(objectPosition.curleft,10));
					DragDrop.targetsAttivi.Array_Right.push(parseInt(parseInt(objectPosition.curleft,10) + parseInt(objectPosition.curwidth,10),10));				
				}
			}
		},
	mouseDown:	function(obj)
		{
			DragDrop.veloObj.style.position = 'absolute';					
			DragDrop.veloObj.style.zIndex =98;
			DragDrop.veloObj.style.left = '0px';
			DragDrop.veloObj.style.top = '0px';
			DragDrop.veloObj.style.width = document.body.scrollWidth+'px';
			DragDrop.veloObj.style.height = document.body.scrollHeight+'px';
			DragDrop.veloObj.style.filter='alpha(opacity=0)';
			DragDrop.veloObj.style.backgroundColor= '#FFF';
			DragDrop.veloObj.onmousemove = function (){DragDrop.mouseMove()};
			document.body.appendChild(DragDrop.veloObj);			

			DragDrop.setOffsetDocument();//nel caso fossero cambiati
				
			DragDrop.selectedObj = obj;
								
			for(var i=0;i<DragDrop.selectedObject.length;i++)
			{
				if (DragDrop.selectedObject[i].Obj==obj)
				{
					DragDrop.recalTargetPosition(DragDrop.selectedObject[i].gruppo);
					DragDrop.dragObj.setAttribute('gruppo',DragDrop.selectedObject[i].gruppo);
					DragDrop.addClass(DragDrop.selectedObject[i].Obj,DragDrop.selectedObject[i].cssObj);
					break;
				}
			}
					
			objectPosition = new DragDrop.getPosition(obj);

			document.body.onmouseup = function (){DragDrop.mouseUp()};

			DragDrop.addClass(DragDrop.dragObj,DragDrop.classDragObj);

			//DragDrop.dragObj.onmousemove = function (){DragDrop.mouseMove()};
			DragDrop.dragObj.innerHTML = DragDrop.getHtmlContent(obj);	

			DragDrop.dragObj.style.zIndex =99;
			DragDrop.dragObj.setAttribute('id','dragObj');
			DragDrop.dragObj.style.position = 'absolute';
			DragDrop.dragObj.style.height = parseInt(objectPosition.curheight,10);
			DragDrop.dragObj.style.width =   parseInt(objectPosition.curwidth,10);			
										
			mouseX=mouseY=0

			rootElement = obj;
			do{
				rootElement = rootElement.parentNode;
			}while (rootElement.parentNode);

			var activeDocument =rootElement.documentElement.document;

			if (activeDocument.parentWindow.frameElement!=null)
			{
				mouseX =  activeDocument.parentWindow.frameElement.contentWindow.event.clientX;
				mouseY =  activeDocument.parentWindow.frameElement.contentWindow.event.clientY+activeDocument.parentWindow.frameElement.offsetTop;		
			}else
			{
				mouseX = event.clientX;mouseY=event.clientY;
			}
					

			DragDrop.dragObj.style.left=mouseX+DragDrop.documentOffset.Left-DragDrop.documentOffset.ScrollLeft;

			DragDrop.dragObj.style.top=mouseY+DragDrop.documentOffset.Top-DragDrop.documentOffset.ScrollTop;	
			try{DragDrop.dragObj.firstChild.style.top='';}catch(e){}


					
			document.body.appendChild(DragDrop.dragObj);

		},	
	mouseMove:function()
		{
			if (document.all.dragObj==undefined || document.all.dragObj==null){return;}
			var bool;
			
			for (var i=0;i<DragDrop.targetsAttivi.Array_Target.length;i++)
			{
				bool = event.clientX>(DragDrop.targetsAttivi.Array_Left[i]-DragDrop.documentOffset.ScrollLeft);
				bool = bool && event.clientX<(DragDrop.targetsAttivi.Array_Right[i]-DragDrop.documentOffset.ScrollLeft);
				bool = bool && event.clientY>(DragDrop.targetsAttivi.Array_Top[i]-DragDrop.documentOffset.ScrollTop);
				bool = bool && event.clientY<(DragDrop.targetsAttivi.Array_Bottom[i]-DragDrop.documentOffset.ScrollTop);

				if (bool){DragDrop.mouseMoveInTarget(DragDrop.targetsAttivi.Array_Target[i]);}
				else{DragDrop.mouseMoveOutTarget(DragDrop.targetsAttivi.Array_Target[i]);}					

			}
			DragDrop.dragObj.style.left=event.clientX+DragDrop.documentOffset.ScrollLeft;
			DragDrop.dragObj.style.top=event.clientY+DragDrop.documentOffset.ScrollTop;
		},		
	mouseMoveInTarget:function(target){target.bgColor='yellow';},
	mouseMoveOutTarget:function(target){target.bgColor='';},		
	mouseUp:function()
		{
			var bool;
			for (var i=0;i<DragDrop.targetsAttivi.Array_Target.length;i++)
			{			
				bool = event.clientX>(DragDrop.targetsAttivi.Array_Left[i]-DragDrop.documentOffset.ScrollLeft);
				bool = bool && event.clientX<(DragDrop.targetsAttivi.Array_Right[i]-DragDrop.documentOffset.ScrollLeft);
				bool = bool && event.clientY>(DragDrop.targetsAttivi.Array_Top[i]-DragDrop.documentOffset.ScrollTop);
				bool = bool && event.clientY<(DragDrop.targetsAttivi.Array_Bottom[i]-DragDrop.documentOffset.ScrollTop);
				if (bool){DragDrop.mouseUpInTarget(DragDrop.targetsAttivi.Array_Target[i]);break;}
				if (i==DragDrop.targetsAttivi.Array_Target.length-1){DragDrop.mouseUpOutTarget(DragDrop.dragObj);}
	
			}
			DragDrop.dragObj.removeNode(true);
			DragDrop.veloObj.removeNode(true);
			document.body.onmouseup = function(){return null;};
			DragDrop.mouseUpRestore(DragDrop.selectedObj);
		},
	mouseUpInTarget:function(target){alert('Rilasciato nell\'oggetto con id:"'+target.id+'"');},
	mouseUpOutTarget:function(obj){alert('Rilasciato fuori dai target indicati');},	
	mouseUpRestore:function(obj)
		{
			for(var i=0;i<DragDrop.selectedObject.length;i++)
			{
				if (DragDrop.selectedObject[i].Obj==obj){DragDrop.removeClass(DragDrop.selectedObj,DragDrop.selectedObject[i].cssObj);break;				}
			}
			for (var i=0;i<DragDrop.targets.Array_Target.length;i++){DragDrop.mouseMoveOutTarget(DragDrop.targets.Array_Target[i]);}
		},
	setup:function(config)
		{
			try{for (var i=0;i<config.object2disable.length;i++) DragDrop.Array_Object2disable.push(config.object2disable[i])}catch(e){}
			try{for (var i=0;i<config.targetObject.length;i++) DragDrop.addTarget(config.targetObject[i]);}catch(e){}				
			try{for (var i=0;i<config.draggabledObject.length;i++) DragDrop.addSelectedObject(config.draggabledObject[i]);}catch(e){}			
			if (config.generateHtmlContent!= undefined && config.generateHtmlContent!='')
				DragDrop.getHtmlContent = config.generateHtmlContent;
			if (config.eventMouseUpInTarget!= undefined && config.eventMouseUpInTarget!='')	
				DragDrop.mouseUpInTarget = config.eventMouseUpInTarget;
			if (config.eventMouseUpOutTarget!= undefined && config.eventMouseUpOutTarget!='')
				DragDrop.mouseUpOutTarget = config.eventMouseUpOutTarget;
			if (config.eventMouseUpRestore!= undefined && config.eventMouseUpRestore!='')
				DragDrop.mouseUpRestore = config.eventMouseUpRestore;
			if (config.eventMouseMoveInTarget!= undefined && config.eventMouseMoveInTarget!='')	
				DragDrop.mouseMoveInTarget = config.eventMouseMoveInTarget;
			if (config.eventMouseMoveOutTarget!= undefined && config.eventMouseMoveOutTarget!='')	
				DragDrop.mouseMoveOutTarget = config.eventMouseMoveOutTarget;	
			if (config.classDragObj!= undefined && config.classDragObj!='')
				DragDrop.classDragObj = config.classDragObj;
			DragDrop.disableSelection();
	
		}
};
