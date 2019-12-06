/*contiene utility di conversione e varie
	- checkDato @Deprecated really??
	- clsDate
	- clsGrid
	- DragDrop @Deprecated
	- MenuTxDx
	- ShowMenu2
	- hideContextMenu
	- NS_CONSOLEJS
*/

/*var checkDato={
	ora:{
		setEvents:function(pObj){
			pObj.onblur  = check.ora.OnBlur;
			pObj.onkeyup = check.ora.OnKeyUp;
		},
		
		OnKeyUp:function(pObj){
			var campo = typeof pObj =='undefined'?event.srcElement:pObj;
			var ora=campo.value;
			var oraReplace=ora.replace(/:/gi,"");
	
			if(event.keyCode==110 || event.keyCode==190 || event.keyCode==188 || event.keyCode==189 || event.keyCode==192){
				//controllo su '.'(da tastierino e non) , ',' , '-' , 'ò'
				campo.value='';
				campo.value=ora.substring(0,ora.length-1);
				return;		
			}
	
			if (ora.substring(3,5)>59 || ora.substring(3,5)<0){		
				campo.value=ora.substring(0,3);
				return;	
			}

			if (ora.length>2){	
				campo.value=oraReplace.substring(0,2)+':'+oraReplace.substring(2,4);
				return;	
			}
	
	
			if (ora.length>5){		
				campo.value=campo.value.substring(0,5);		
			}
	
			if (ora.substring(0,2)>23 || ora.substring(0,2)<0){
				if(ora.substring(0,1)<=2){
					campo.value=ora.substring(0,1);
					return;
				}else{					
					campo.value='';
					ora='0'+oraReplace.substring(0,oraReplace.substring(0,3));
					campo.value=ora.substring(0,2)+':'+ora.substring(2,4);
					return;
				}
			}			
		},
		
		OnBlur:function(pObj){
			
			var campo = typeof pObj =='undefined'?event.srcElement:pObj;
			var ora=campo.value;
			var oraReplace=ora.replace(/\./gi,"");
			oraReplace=oraReplace.replace(/\.\,@?\;/gi,"");
			
			if (campo.value==''){
			}else{
			
				if (oraReplace>ora){					
					campo=oraReplace;
					return;					
				}
				
				if (
						ora.length<5 || 
						ora.substring(0,2)>23 || 
						ora.substring(0,2)<0 ||
						ora.substring(3,5)>59 || 
						ora.substring(3,5)<0
					){					
					alert('Immettere l\'ora nel formato corretto HH:MM');
					campo.value='';
					campo.focus();
					return;				
				}
				
				try{
					if (isNaN(parseInt(ora.substring(0,2),10))||isNaN(parseInt(ora.substring(3,5),10))){					
						alert('Il valore immesso non è un numero!');
						campo.value='';
						campo.focus();
						return;					
					}
				}catch(e){
						//alert(e.description);
				}
				
			}			
			
		}
	}
};*/

var clsDate={
	range:function(pDateIni,pDateFine){this.ini=pDateIni;this.fine=pDateFine;},
	setData:function(vData,vOra){
			var vDate = new Date(
								parseInt(vData.substring(0,4),10),
								parseInt(vData.substring(4,6),10)-1,
					 			parseInt(vData.substring(6,8),10),
				 				parseInt(vOra.substring(0,2),10),
				 				parseInt(vOra.substring(3,5),10),
				 				0);
						return vDate;
	},
	round:function(pDate,pTimeUnit,pValue){			
		var vCoeff;
		switch (pTimeUnit){
			case 's':vCoeff=1000;break;
			case 'mi':vCoeff=(60*1000);break;				
			case 'h':vCoeff=(60*60*1000);break;				
			case 'D':vCoeff=(24*60*60*1000);break;				
		}
		var vDate = new Date();
		vDate.setTime(Math.floor(pDate.getTime()/(pValue*vCoeff))*(pValue*vCoeff));
		return vDate;
	},
	getOra:function(pDate){
					ore ='0'+pDate.getHours();minuti='0'+pDate.getMinutes();
					return (ore.substring(ore.length-2,ore.length)+':'+minuti.substring(minuti.length-2,minuti.length));
	},
	getData:function(pDate,format){
				mese = '0'+(pDate.getMonth()+1);mese =  mese.substring(mese.length-2,mese.length);
				giorno = '0'+pDate.getDate();giorno =  giorno.substring(giorno.length-2,giorno.length);
				switch(format){
					case 'YYYYMMDD':	return pDate.getFullYear()+mese+giorno;
					case 'DD/MM/YYYY':	return giorno+'/'+mese+'/'+pDate.getFullYear();		
				}
	},	
	dateAdd:function(pDate,type,value){
				var vDate=new Date();vDate.setTime(pDate.getTime());
				switch (type) {
					case 'Y' : vDate.setFullYear(pDate.getFullYear()+value);break;
					case 'M' : vDate.setMonth(pDate.getMonth()+value);break;
					case 'D' : vDate.setTime(pDate.getTime()+(value*1000*60*60*24));break;
					case 'h' : vDate.setTime(pDate.getTime()+(value*1000*60*60));break;
					case 'mi': vDate.setTime(pDate.getTime()+(value*1000*60));break;
					case 'ss': vDate.setTime(pDate.getTime()+(value*1000*60));break;
					case 'ms': vDate.setTime(pDate.getTime()+value);break;
				}
				return vDate;			
				
	},
	dateAddStr:function(pStrData,pFormat,pOra,pTypeAdd,pValueAdd){
		var vDate = clsDate.str2date(pStrData,pFormat,pOra);
		return  clsDate.getData(clsDate.dateAdd(vDate,pTypeAdd,pValueAdd),pFormat);		
	},
	date2pct:function(pDataIni,pDataFine,pData,scala){	
				var millis_ini = pDataIni.getTime();
				var millis_fine = pDataFine.getTime();
				var millis_data = pData.getTime();	
				if(typeof scala=='undefined')
					return Math.floor(100*(millis_data-millis_ini)/(millis_fine-millis_ini)*100)/100;
				else
					return Math.floor(scala*(millis_data-millis_ini)/(millis_fine-millis_ini)*100)/100;
	},
	pct2date:function(pDataIni,pDataFine,pPct,scala){				
				if(typeof scala=='undefined')
					var millis_2add=(pDataFine.getTime()-pDataIni.getTime())*pPct/100;					
				else
					var millis_2add=(pDataFine.getTime()-pDataIni.getTime())*pPct/scala;
				var pData=new Date();
				pData.setTime(pDataIni.getTime());
				return clsDate.dateAdd(pData,'ms',millis_2add);					
	},
	str2date:function(pStrData,pFormat,pOra){
				var anno,mese,gionro,ora,minuti='';
				var vDate = new Date();
				switch(pFormat){
					case 'YYYYMMDD':anno = pStrData.substring(0,4); mese = parseInt(pStrData.substring(4,6),10)-1; giorno = pStrData.substring(6,8);break;
					case 'DD/MM/YYYY':anno = pStrData.substring(6,10); mese = parseInt(pStrData.substring(3,5),10)-1; giorno = pStrData.substring(0,2);break;		
				}
				if(pOra==''){
					ora='00'; minuti ='00';
				}else{
					ora=pOra.substring(0,2); minuti = pOra.substring(3,5);
				}

				vDate.setFullYear(anno,mese,giorno);
				vDate.setHours(ora,minuti,0,0);
				return vDate;
	},
	range2pct:function(range1,range2,scala){	
				var millis_range1 = range1.fine.getTime()-range1.ini.getTime();
				var millis_range2 = range2.fine.getTime()-range2.ini.getTime();					
				if(typeof scala=='undefined')					
					return Math.floor(100*millis_range2/millis_range1*100)/100;
				else
					return Math.floor(scala*millis_range2/millis_range1*100)/100;
	},
	difference:{
		day:function(pDate,pDateRiferimento){

	  	var vDate = new Date();
		vDate.setTime(pDate.getTime());
		var vRiferimento = new Date();
		vRiferimento.setTime(pDateRiferimento.getTime());

		var result=0;
		(vRiferimento<vDate)?valore=-1:valore=1;

		while(clsDate.getData(vDate,'YYYYMMDD')!=clsDate.getData(vRiferimento,'YYYYMMDD') && result<1000){
   
			vDate = clsDate.dateAdd(vDate,'D',valore);
			result=result+(-valore);
		}
		return result;				
	
	},
		hour:function(pDate,pDateRiferimento){
			var vDate = new Date();
			vDate.setTime(pDate.getTime());
			//pDateRiferimento.setTime(pDateRiferimento.getTime());
			var result=-1;//differenze minori di 60 minuti vengono considerate nulle
			
			if(vDate==pDateRiferimento)return 0;
			
			if(vDate>pDateRiferimento){
				while(vDate>pDateRiferimento){
					vDate = clsDate.dateAdd(vDate,'h',-1);
					result++;
				}
			}else{
				while(vDate<pDateRiferimento){
					vDate = clsDate.dateAdd(vDate,'h',1);
					result++;
				}				
			}
			return result;				
		}
	},
	str2str:function(pStrData,pFormatIn,pFormatOut){
		switch(pFormatIn){
			case 'YYYYMMDD':
					switch(pFormatOut){
						case 'DD/MM/YYYY': return pStrData.substring(6,8)+'/'+pStrData.substring(4,6)+'/'+pStrData.substring(0,4); 
						break;
					}
					break;			
				
			case 'DD/MM/YYYY':
					switch(pFormatOut){
						case 'YYYYMMDD': return pStrData.substring(6,10)+pStrData.substring(3,5)+pStrData.substring(0,2); 
						break;
					}
					break;										
		}		
	}
}

var clsGrid={
	setup:{
		target:{width:60,height:20},
		ascissa:{show:true,asc:true,top:false,Min:0,Max:1,step:0.1,precision:0.1,decimal:1,width:30,height:20},
		ordinata:{show:true,asc:false,left:true,Min:34,Max:42,step:1,precision:1,decimal:0,width:30,height:40},
		reference:{assi:true,hover:false,proiezione:false,risultato:true},
		onmove:function(){return clsGrid.values.landscape+clsGrid.values.vertical;},
		onclick:function(){parametri.rilevazione(clsGrid.values.landscape,clsGrid.values.vertical)},
		ondblclick:function(){null;}
	},
	values:{landscape:0,vertical:0},
	build:function(obj){
		
		try{
		//alert(obj.setup);
			eval(obj.setup);
			
			obj.onselectstart=function(){return false;}
			
			var dimension={width:0,height:0}		
			
			dimension.width = (clsGrid.setup.ascissa.Max-clsGrid.setup.ascissa.Min)/clsGrid.setup.ascissa.step*clsGrid.setup.ascissa.width;
			dimension.height = (clsGrid.setup.ordinata.Max-clsGrid.setup.ordinata.Min)/clsGrid.setup.ordinata.step*clsGrid.setup.ordinata.height;		
			
			var divPiano = document.createElement("div");
	
			var divResultY = getDiv("resultY","",clsGrid.setup.ordinata.width,clsGrid.setup.ordinata.height,"");
			divResultY.appendChild(getDiv("","",clsGrid.setup.ordinata.width-2,clsGrid.setup.ordinata.height-2,""));
							
			var divResultX = getDiv("resultX","",clsGrid.setup.ascissa.width,clsGrid.setup.ascissa.height,"");
			divResultX.appendChild(getDiv("","",clsGrid.setup.ascissa.width-2,clsGrid.setup.ascissa.height-2,""))
			
			divPiano.appendChild(divResultX);
			divPiano.appendChild(divResultY);
	
			var divOrigine = getOrigine();
	
			var divPanel = getPanel();
	
			var divAscisse = getAscisse();;
			var divOrdinate = getOrdinate();		
	
			if(clsGrid.setup.ascissa.top){
				divPiano.appendChild(divOrigine);
				divPiano.appendChild(divAscisse);	
				divPiano.appendChild(divOrdinate);
				divPiano.appendChild(divPanel);	
			}else{
				divPiano.appendChild(divOrdinate);
				divPiano.appendChild(divPanel);
				divPiano.appendChild(divOrigine);
				divPiano.appendChild(divAscisse);		
			}			
			
	
				
			obj.appendChild(divPiano);							
	
			obj.style.width  = (dimension.width) +'px';		
			obj.style.height = (dimension.height)+'px';	
		
		}catch(e){
			alert(e.description);
		}
		
		function getOrigine(){
				
			if(clsGrid.setup.ordinata.left){
				var divOrigine =getDiv(null,"origine left",0,0,null);
			}else{
				var divOrigine =getDiv(null,"origine right",0,0,null);
			}
			
			if(clsGrid.setup.ordinata.show && clsGrid.setup.ascissa.show){
				divOrigine.style.width = clsGrid.setup.ordinata.width+'px';	
				divOrigine.style.height = clsGrid.setup.ascissa.height+'px';	
				
				divOrigine.appendChild(getDiv(null,null,clsGrid.setup.ordinata.width-2,clsGrid.setup.ascissa.height-2,null));			
			}
					
			return divOrigine;
		}
				
		function getAscisse(){
			var set = clsGrid.setup.ascissa;
			
			var divAscisse = document.createElement("div");
			divAscisse.id = "ascisse";
			
			divAscisse.style.width = ((set.Max-set.Min)/set.step*set.width)+'px';
			if(set.show){
				divAscisse.style.height = set.height+'px';
				dimension.height = dimension.height + set.height;
			}else{
				divAscisse.visibility = "hidden";
				divAscisse.style.height= '0px';
			}
			
			if(clsGrid.setup.ordinata.left){
				divAscisse.className = "right";
			}else{
				divAscisse.className = "left";				
			}
			
			var divAscissa;
			var w,h;

			for (var i=0;i<((set.Max-set.Min)/set.step);i++){
				w = clsGrid.setup.ascissa.width;
				h = clsGrid.setup.ascissa.height;
				divAscissa = getDiv(null,"ascissa",w,h,null);
				divAscissa.style.lineHeight = h+'px';
				if(set.asc){
					divAscissa.appendChild(getDiv(null,null,w-2,h-2,clsGrid.roundTo(set.Min+(set.step*i),set.decimal)));
				}else{
					divAscissa.appendChild(getDiv(null,null,w-2,h-2,clsGrid.roundTo(set.Max-(set.step*(i+1)),set.decimal)));
				}
				divAscisse.appendChild(divAscissa);						
			}			

						
			return divAscisse;
		}
				
		function getOrdinate(){
			
			var set = clsGrid.setup.ordinata;
			
			var divOrdinate = document.createElement("div");
			divOrdinate.id = "ordinate";
			
			divOrdinate.style.height = (((set.Max-set.Min)/set.step)*set.height)+'px';
			
			if(set.show){
				divOrdinate.style.width = set.width + 'px';
				dimension.width = dimension.width + set.width;
			}else{
				divOrdinate.style.width = '0px';
				divOrdinate.visibility = "hidden";
			}
			
			if(set.left){
				divOrdinate.className = 'left';
			}else{
				divOrdinate.className = 'right';				
			}
								
			var divOrdinata;
			var w,h;
			
			for (var i=0;i<((set.Max-set.Min)/set.step);i++){
				w = clsGrid.setup.ordinata.width;
				h = clsGrid.setup.ordinata.height;
				divOrdinata = getDiv(null,"ordinata",w,h,null);
				divOrdinata.style.lineHeight = h+'px';
				if(set.asc){
					divOrdinata.appendChild(getDiv(null,null,w-2,h-2,clsGrid.roundTo(set.Min+(set.step*i),set.decimal)))
				}else{
					divOrdinata.appendChild(getDiv(null,null,w-2,h-2,clsGrid.roundTo(set.Max-(set.step*(i+1)),set.decimal)))
				}
				divOrdinate.appendChild(divOrdinata);					
			}	
			
		
			
			return divOrdinate;		
		}
		
		function getPanel(){
			var w = (clsGrid.setup.ascissa.Max-clsGrid.setup.ascissa.Min)/clsGrid.setup.ascissa.step*clsGrid.setup.ascissa.width;
			var h = (clsGrid.setup.ordinata.Max-clsGrid.setup.ordinata.Min)/clsGrid.setup.ordinata.step*clsGrid.setup.ordinata.height;		
	
			if(clsGrid.setup.ordinata.left){
				var panel = getDiv(null,"panel right",w,h,"");
			}else{
				var panel = getDiv(null,"panel left",w,h,"");
			}

			panel.appendChild(getDiv("column","",clsGrid.setup.ascissa.width,null,""));
			panel.appendChild(getDiv("row","",null,clsGrid.setup.ordinata.height,""));
			
			panel.appendChild(getDiv("X","asse",null,null,""));		
			panel.appendChild(getDiv("Y","asse",null,null,""));						
			
			var target = getDiv("result",null,clsGrid.setup.target.width,clsGrid.setup.target.height,null,"");
			target.style.lineHeight = clsGrid.setup.target.height+'px';	
			target.onclick = clsGrid.setup.onclick;
			target.ondblclick = clsGrid.setup.ondblclick;				
			panel.appendChild(target);	
			
			panel.onmousemove=function(){clsGrid.refresh(this);};		
			
			return panel;
		}		
		
		function getDiv(id,className,width,height,txt){
			var div = document.createElement("div");
			if(className!=null)
				div.className = className;
			if(txt!=null)
				div.innerText = txt;
			if(id!=null)
				div.id = id;
			if(width!=null)
				div.style.width = width;
			if(height!=null)
				div.style.height = height;			
			
			return div;		
		}
	},
	refresh:function(obj){
		var objGrid = obj.parentNode.parentNode;
		eval(objGrid.setup);
		
		asseX = obj.all["X"];
		asseY = obj.all["Y"];		
		lbl   = obj.all["result"];					
		
		var panel = {top:0,bottom:0,left:0,right:0,width:0,height:0}
		
		panel.top    = document.documentElement.scrollTop+objGrid.offsetTop+obj.offsetTop;
		panel.bottom = panel.top+obj.offsetHeight;
		
		panel.left   = document.documentElement.scrollLeft+objGrid.offsetLeft+obj.offsetLeft;
		panel.right  = panel.left +obj.offsetWidth;
		
		panel.width  = obj.offsetWidth;
		panel.height = obj.offsetHeight;
		
		//lbl.innerText = document.documentElement.scrollTop;
		//lbl.innerText=panel.top+ ' : ' + panel.bottom + ' : ' + panel.left + ' : ' + panel.right;
		lbl.innerText = objGrid.style.pixelTop;
		if( event.clientY > panel.top && event.clientY < panel.bottom){
			if(clsGrid.setup.reference.assi){
				asseX.style.top = event.clientY - panel.top + document.documentElement.scrollTop + 'px';
				asseX.style.visibility = "visible";
			}
			lbl.style.top   = event.clientY - panel.top + document.documentElement.scrollTop - (lbl.offsetHeight/2) + 'px';			
		}		
		
		if( event.clientX > panel.left && event.clientX < panel.right){
			if(clsGrid.setup.reference.assi){
				asseY.style.left = event.clientX - panel.left + document.documentElement.scrollLeft + 'px';
				asseY.style.visibility = "visible";
			}
			lbl.style.left   = event.clientX - panel.left + document.documentElement.scrollLeft - (lbl.offsetWidth/2) + 'px';			
		}	

		var pctY = 100*parseInt(event.clientX - panel.left + document.documentElement.scrollLeft)/panel.width;
		var pctX = 100*parseInt(event.clientY - panel.top + document.documentElement.scrollTop)/panel.height;	
		
		//lbl.innerText = pctY + ' : ' + pctX;
		//lbl.innerText = pctY + ' : ' + pctX;
			
		if(clsGrid.setup.ascissa.asc){	
			clsGrid.values.landscape = clsGrid.setup.ascissa.Min + ((clsGrid.setup.ascissa.Max-clsGrid.setup.ascissa.Min)*pctY/100);	
		}else{
			clsGrid.values.landscape = clsGrid.setup.ascissa.Max - ((clsGrid.setup.ascissa.Max-clsGrid.setup.ascissa.Min)*pctY/100);	
		}

		if(clsGrid.setup.ordinata.asc){	
			clsGrid.values.vertical = clsGrid.setup.ordinata.Min + ((clsGrid.setup.ordinata.Max-clsGrid.setup.ordinata.Min)*pctX/100);	
		}else{
			clsGrid.values.vertical = clsGrid.setup.ordinata.Max - ((clsGrid.setup.ordinata.Max-clsGrid.setup.ordinata.Min)*pctX/100);				
		}
		
		clsGrid.values.landscape= clsGrid.roundTo(Math.floor(clsGrid.values.landscape/clsGrid.setup.ascissa.precision)*clsGrid.setup.ascissa.precision,clsGrid.setup.ascissa.decimal);
		clsGrid.values.vertical = clsGrid.roundTo(Math.floor(clsGrid.values.vertical/clsGrid.setup.ordinata.precision)*clsGrid.setup.ordinata.precision,clsGrid.setup.ordinata.decimal);		
		
		idxAscissa = clsGrid.getIdAscissa();
		idxOrdinata = clsGrid.getIdOrdinata();
		
		if(clsGrid.setup.ascissa.show || clsGrid.setup.ordinata.show){

			for (var i=0;i<objGrid.all["ascisse"].childNodes.length;i++){				
					objGrid.all["ascisse"].childNodes[i].id='';
			}
			for (var i=0;i<objGrid.all["ordinate"].childNodes.length;i++){
					objGrid.all["ordinate"].childNodes[i].id='';
			}			
							

			if(clsGrid.setup.ordinata.show){
								
				
				if(clsGrid.setup.reference.risultato){
					if(clsGrid.setup.ascissa.top){
						objGrid.all["resultY"].style.top =  (asseX.offsetTop-(clsGrid.setup.ordinata.height/2)+clsGrid.setup.ordinata.height)+'px';
					}else{
						objGrid.all["resultY"].style.top =  (asseX.offsetTop-(clsGrid.setup.ordinata.height/2))+'px';
					}
					if(clsGrid.setup.ordinata.left){
						objGrid.all["resultY"].style.left = '0px';
					}else{
						objGrid.all["resultY"].style.left = panel.width + 'px';
					}
					objGrid.all["resultY"].style.visibility = "visible";				
					objGrid.all["resultY"].firstChild.innerText = clsGrid.values.vertical;
				}
							
				if(clsGrid.setup.reference.proiezione){
					Row   = objGrid.all["row"];
					Row.style.top = objGrid.all["ordinate"].childNodes[idxOrdinata].offsetTop + 'px';
					Row.style.visibility = "visible";	
					if(clsGrid.setup.ordinata.left){
						Row.style.left = '0px';
						Row.style.width = (objGrid.all["ascisse"].childNodes[idxAscissa].offsetLeft+objGrid.all["ascisse"].childNodes[idxAscissa].offsetWidth)+'px';
					}else{
						Row.style.left = objGrid.all["ascisse"].childNodes[idxAscissa].offsetLeft + 'px';
						Row.style.width = (panel.width-objGrid.all["ascisse"].childNodes[idxAscissa].offsetLeft)+'px';
					}
				}			
				
				if(clsGrid.setup.reference.hover){
					objGrid.all["ordinate"].childNodes[idxOrdinata].id='hover';/*sommo solo il panel*/
				}
			}

			if(clsGrid.setup.ascissa.show){			
				
				
				
				if(clsGrid.setup.reference.risultato){
					if(clsGrid.setup.ascissa.top){
						objGrid.all["resultX"].style.top = '0px';
					}else{
						objGrid.all["resultX"].style.top = obj.offsetHeight + 'px';
					}
					if(clsGrid.setup.ordinata.show && clsGrid.setup.ordinata.left){
						objGrid.all["resultX"].style.left =  (asseY.offsetLeft+clsGrid.setup.ordinata.width-(clsGrid.setup.ascissa.width/2))+'px';					
					}else{
						objGrid.all["resultX"].style.left =  (asseY.offsetLeft-(clsGrid.setup.ascissa.width/2))+'px';					
					}
					objGrid.all["resultX"].style.visibility = "visible";				
					objGrid.all["resultX"].firstChild.innerText = clsGrid.values.landscape;				
				}
				
				if(clsGrid.setup.reference.proiezione){
					Column= obj.all["column"];	
					Column.style.left = (objGrid.all["ascisse"].childNodes[idxAscissa].offsetLeft) + 'px';						
					if(clsGrid.setup.ascissa.top){
						Column.style.top = '0px';
						Column.style.height = objGrid.all["ordinate"].childNodes[idxOrdinata].offsetTop+'px';
					}else{
						Column.style.top = (objGrid.all["ordinate"].childNodes[idxOrdinata].offsetTop)+'px';
						Column.style.height = (panel.height-objGrid.all["ordinate"].childNodes[idxOrdinata].offsetTop)+'px';
					}
					
					Column.style.visibility = "visible";	
				}
							
									
				if(clsGrid.setup.reference.hover){
					objGrid.all["ascisse"].childNodes[idxAscissa].id='hover';
				}
	
			}				
			
		}
		//lbl.innerText = clsGrid.setup.onmove();
		//lbl.innerText = idxAscissa + ' :' + nAscisse + ' : ' + idxOrdinata + ' : ' + nOrdinate; 
	},
	roundTo:function(value,decimalpositions)
	{
		var i = value * Math.pow(10,decimalpositions);
		i = Math.round(i);
		return i / Math.pow(10,decimalpositions);
	},
	getIdAscissa:function(){
		var stop = false;
		var range={bottom:clsGrid.setup.ascissa.Min,top:clsGrid.setup.ascissa.Max,val:0,val2:0,index:0};
		
		if(clsGrid.setup.ascissa.asc){					
			
			range.val = range.bottom;
			range.val2 = clsGrid.roundTo(range.val + clsGrid.setup.ascissa.step,clsGrid.setup.ascissa.decimal);
			while(!stop && range.index<(range.top-range.bottom)/clsGrid.setup.ascissa.step){
				if(clsGrid.values.landscape>=range.val && clsGrid.values.landscape<range.val2){
					stop=true;				
				}else{
					range.val  = clsGrid.roundTo(range.val + clsGrid.setup.ascissa.step,clsGrid.setup.ascissa.decimal);												
					range.val2 = clsGrid.roundTo(range.val + clsGrid.setup.ascissa.step,clsGrid.setup.ascissa.decimal);																		
					range.index++;
				}
			}
		}else{
			range.val = range.top;
			range.val2 = clsGrid.roundTo(range.val - clsGrid.setup.ascissa.step,clsGrid.setup.ascissa.decimal);

			while(!stop && range.index<(range.top-range.bottom)/clsGrid.setup.ascissa.step){
				if(clsGrid.values.landscape<range.val && clsGrid.values.landscape>=range.val2){
					stop=true;

				}else{
					range.val  = clsGrid.roundTo(range.val - clsGrid.setup.ascissa.step,clsGrid.setup.ascissa.decimal);		
					range.val2 = clsGrid.roundTo(range.val - clsGrid.setup.ascissa.step,clsGrid.setup.ascissa.decimal);												
					range.index++;
				}
			}						
		}	
		
		return 	range.index;
	},
	getIdOrdinata:function(){
		var stop = false;
		var range={bottom:clsGrid.setup.ordinata.Min,top:clsGrid.setup.ordinata.Max,val:0,val2:0,index:0};							

		if(clsGrid.setup.ordinata.asc){					
			
			range.val = range.bottom;
			range.val2 = clsGrid.roundTo(range.val+clsGrid.setup.ordinata.step,clsGrid.setup.ordinata.decimal);
			while(!stop && range.index<(range.top-range.bottom)/clsGrid.setup.ordinata.step){
				if(clsGrid.values.vertical>=range.val && clsGrid.values.vertical<range.val2){
					stop=true;
				}else{
					range.val  = clsGrid.roundTo(range.val + clsGrid.setup.ordinata.step,clsGrid.setup.ordinata.decimal);
					range.val2 = clsGrid.roundTo(range.val + clsGrid.setup.ordinata.step,clsGrid.setup.ordinata.decimal);												
					range.index++;
				}
			}
		}else{
			range.val = range.top;
			range.val2 = clsGrid.roundTo(range.val-clsGrid.setup.ordinata.step,clsGrid.setup.ordinata.decimal);
			while(!stop && range.index<(range.top-range.bottom)/clsGrid.setup.ordinata.step){
				if(clsGrid.values.vertical<range.val && clsGrid.values.vertical>=range.val2){
					stop=true;
				}else{
					range.val  = clsGrid.roundTo(range.val - clsGrid.setup.ordinata.step,clsGrid.setup.ordinata.decimal);
					range.val2 = clsGrid.roundTo(range.val - clsGrid.setup.ordinata.step,clsGrid.setup.ordinata.decimal);												
					range.index++;
				}
			}						
		}
		
		return 	range.index;
	}
}

var classTarget = {object:null,gruppo:''};
var classDraggable = {object:null,gruppo:''};
/*
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
			

			//************************
			
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
};*/



var idSelezionato; //id elemento per il quale è stato attivato il menu contestuale
//var ArrayContextDescriptor = new Array();
var documentOffset = {Top:0,Left:0};

function MenuTxDx(contextID)
{
	//alert(contextID);
	hideContextMenu();
	setOffsetDocument();
		//var altezzaDocumento = document.body.offsetHeight;
		var altezzaDocumento = screen.availHeight-documentOffset.Top ;
		var larghezzaDocumento = screen.availWidth-documentOffset.Left;
		document.all[contextID].style.display='block';


		// posizionamento orizzontale
		if ((event.clientX + document.all[contextID].offsetWidth)>larghezzaDocumento){
			document.all[contextID].style.left = larghezzaDocumento - document.all[contextID].offsetWidth - 10;
		}
		else{
			document.all[contextID].style.left = event.clientX - 10;
		}
		
		limiteDX = parseInt(document.all[contextID].style.left) + parseInt(document.all[contextID].offsetWidth); //utilizzo per il sottomenu
		limiteSX = parseInt(document.all[contextID].style.left) ;
		//alert(altezzaDocumento);
		//alert(document.all[contextID].offsetHeight);
		if ((event.clientY+document.all[contextID].offsetHeight)>altezzaDocumento){
			document.all[contextID].style.top = altezzaDocumento -  document.all[contextID].offsetHeight -5+document.documentElement.scrollTop;			
		}
		else{
			document.all[contextID].style.top = event.clientY -5+document.documentElement.scrollTop;
		}
	
		document.all[contextID].style.visibility = "visible";
		
		return top.baseUser.ABILITA_CONTEXT_MENU=='S';


}
function ShowMenu2(object,contextID)
{
	try{

		var altezzaDocumento = screen.availHeight-documentOffset.Top ;
		var larghezzaDocumento = screen.availWidth-documentOffset.Left;
		document.all[contextID].style.display ='block';
		menuDiv = object.parentNode.parentNode.parentNode;

		// posizionamento orizzontale
		if (parseInt(menuDiv.offsetLeft,10)+parseInt(menuDiv.offsetWidth,10)+parseInt(document.all[contextID].offsetWidth,10)>larghezzaDocumento){
			document.all[contextID].style.left = limiteSX - document.all[contextID].offsetWidth;
		}
		else{
			document.all[contextID].style.left = limiteDX;
		}
		

		if (object.offsetTop + menuDiv.offsetTop + document.all[contextID].offsetHeight-document.documentElement.scrollTop> altezzaDocumento)
			document.all[contextID].style.top= altezzaDocumento -  document.all[contextID].offsetHeight -5 +document.documentElement.scrollTop;	
		else
			document.all[contextID].style.top= object.offsetTop + menuDiv.offsetTop;

		document.all[contextID].style.visibility = "visible";

		
	}catch(e){
		alert(e.description);
	}

}
function hideContextMenu()
{	

	for (var i=0;i<ArrayContextDescriptor.length;i++){
			obj = document.getElementById(ArrayContextDescriptor[i]);
			try{obj.style.visibility="hidden"}catch(e){};		
	}
	
	if(typeof document.all["X"]=='undefined')return;
	if(typeof document.all["X"].length == 'undefined'){
		document.all["X"].style.visibility = 'hidden';
	}else{
		for(var i=0;i<document.all["X"].length;i++){
			document.all["X"][i].style.visibility = 'hidden';
		}
	}
	
	if(typeof document.all["Y"]=='undefined')return;
	if(typeof document.all["Y"].length == 'undefined'){
		document.all["Y"].style.visibility = 'hidden';
	}else{
		for(var i=0;i<document.all["Y"].length;i++){
			document.all["Y"][i].style.visibility = 'hidden';
		}
	}
	
	if(typeof document.all["resultX"]=='undefined')return;
	if(typeof document.all["resultX"].length == 'undefined'){
		document.all["resultX"].style.visibility = 'hidden';
	}else{
		for(var i=0;i<document.all["resultX"].length;i++){
			document.all["resultX"][i].style.visibility = 'hidden';
		}
	}
	
	if(typeof document.all["resultY"]=='undefined')return;
	if(typeof document.all["resultY"].length == 'undefined'){
		document.all["resultY"].style.visibility = 'hidden';
	}else{
		for(var i=0;i<document.all["resultY"].length;i++){
			document.all["resultY"][i].style.visibility = 'hidden';
		}
	}		

}
function switchContext(obj)
{

	if (obj.className=='ContextMenuNormal' || obj.className==''){
		obj.className='ContextMenuOver';
	}else{
		obj.className='ContextMenuNormal';
	}
}
function setOffsetDocument()
{
	documentOffset.Top= documentOffset.Left =0;
	var activeDocument =document;
	while(activeDocument.parentWindow.frameElement!=null)
	{	
		documentOffset.Top+= activeDocument.parentWindow.frameElement.offsetTop;
		documentOffset.Left += activeDocument.parentWindow.frameElement.offsetLeft;				
		activeDocument = activeDocument.parentWindow.parent.document;;

	}
	//alert(documentOffset.Top);
	//alert(documentOffset.Left);
}

function MultiSubstring(pValue,pRanges){//[	[0,1,'/'] ] begin-end -delimiter
	var StringOut = '';
	for (var i = 0 ; i < pRanges.length ; i++){
		StringOut += pValue.substring(pRanges[i][0],pRanges[i][1]) + (typeof pRanges[i][2] != 'undefined' ? pRanges[i][2]: '')
	}
	return StringOut;
}

var NS_CONSOLEJS = {

	loggers:{},

	init:function(){

		NS_CONSOLEJS.createObject();
		NS_CONSOLEJS.setEvents();
		
	},
	
	setEvents:function(){
		$(document).bind('keydown', 'alt+h', function(){$("#consolejs").toggle();});
		
		$("#svuotaConsole").click(function(){
			for(var i in NS_CONSOLEJS.loggers)
				NS_CONSOLEJS.loggers[i].clean();
		});
		$("#chiudiConsole").click(function(){$("#consolejs").hide();});
		$("#filtraConsole").click(NS_CONSOLEJS.filtra);
		
		$("#filtriConsole input").live("click",function(){
			$("#taConsoleJs li").hide();			
			$("#filtriConsole input:checked").each(function(){
				var cl = $(this).attr("id");cl = cl.substr(3);
				$("#taConsoleJs li."+cl).show();
			});
		});		
		
	},
	
	addLogger:function(pParam){
		NS_CONSOLEJS.loggers[pParam.name] = new NS_CONSOLEJS.Logger(pParam);
	},
	
	createObject:function(){

		$('body')
			.append(
				$('<div id="consolejs"></div>')
					.append(
						$('<div id="filtriConsole"></div>')
					)
					.append(
						$('<img id="moveConsole" src="imagexPix/button/move.png" alt="" />')
					)
					.append(
						$('<a id="chiudiConsole" class="pulsConsole" href="javascript:void(0);">Chiudi</a>')						
					)
					.append(
						$('<a id="svuotaConsole" class="pulsConsole" href="javascript:void(0);">Svuota</a>')
					)
					.append(
						$('<a id="filtraConsole" class="pulsConsole" href="javascript:void(0);">Filtri</a>')
					)
					.append(
						$('<div id="cConsole"></div>')
							.append(
								$('<ul id="taConsoleJs"></ul>')
							)
					)
					.hide()
			);

	},
	
	filtra:function(){

		if($(this).html() == "Filtri"){

			$("#filtriConsole").html("").show();		
			
			for ( var i in NS_CONSOLEJS.loggers){
				var level = NS_CONSOLEJS.loggers[i].getLogOnConsole();
				$("#filtriConsole")		
					.append($('<input type="checkbox" id="fc_'+i+'" value="'+i+'" />'))	
					.append(
						$('<select></select>')
							.append($('<option></option>').val("3").text("ERROR").attr("selected",level==3))
							.append($('<option></option>').val("2").text("WARNING").attr("selected",level==2))
							.append($('<option></option>').val("1").text("INFO").attr("selected",level==1))
							.append($('<option></option>').val("0").text("DEBUG").attr("selected",level==0))
							.change(function(){
									NS_CONSOLEJS.loggers[i].setLogOnConsole($(this).find('option:selected').val());
								})																					
					)					
					.append($('<label for="fc_'+i+'">'+i+'</label>'))					
					.append($('<br/>'))					
					;				
				/*$("#filtriConsole")
					.append('<input type="checkbox" id="fc_'+i+'" value="'+i+'" />')
					.append('<label for="fc_'+i+'">'+i+'</label><br />');*/
			}						
			
			$("#filtriConsole").css("top",(0-$("#filtriConsole").outerHeight()));
			
			$(this).html("Chiudi filtri");
		}
		else
		{
			$(this).html("Filtri");
			$("#filtriConsole").hide();
		}
	},
	
	Logger:function(pParam){
		/*{
			[name]		Nome del logger
			[,level] 	Livello di log per write
			[,db]		Livello di log su db
			[,alert]	Livello di log su alert
			[,console] 	Livello di log su console
		}*/

		if(typeof pParam == 'string')
			pParam = {name:pParam};
		
		function checkParameter(pValue,pDefault){return typeof pValue =='undefined' ? pDefault : pValue;}
		function checkLevel(pParameter,pLevel){return pParameter != null && pParameter <= pLevel;};
		
		this.name 	= checkParameter(pParam.name	 	, 'NS_CONSOLEJS.Logger.js');
		this.level 	= checkParameter(pParam.level	 	, 3);
		this.db 	= checkParameter(pParam.db		 	, null);
		this.alert  = checkParameter(pParam.alert	 	, null);
		this.console  = checkParameter(pParam.console	, null);	

		this.levels = {DEBUG:0,INFO:1,WARN:2,ERROR:3};
		this.msg = new Array();		
		
		this.clean = function(){
			this.msg = new Array();
			
			if(this.console != null)
				$('#taConsoleJs').text("");				
		};
		
		this.write = function(pText,pLevel){

			var vLevel = typeof pLevel == 'undefined' ? 'ERROR' : pLevel;
			
			if(checkLevel(this.level,this.levels[pLevel])){			
				this.msg.push({text:pText,level:vLevel,time:new Date()});
			}

			if(checkLevel(this.alert,this.levels[pLevel])){
				alert(pText);
			}

			if(checkLevel(this.db,this.levels[pLevel])){
				top.executeStatement("Logger.xml","GEST_LOGS.LOG",[this.name,pText,vLevel]);
			}
			
			if(checkLevel(this.console,this.levels[pLevel])){
				var currentTime = new Date();
				var hours = currentTime.getHours();
				var minutes = currentTime.getMinutes();
				if (minutes < 10){minutes = "0" + minutes;}
				
				$('#taConsoleJs').append(
					$("<li class='"+this.name+"'></li>")
						.append(
							$("<strong></strong>").addClass(pLevel).text(pLevel)
						)
						.append(
							$("<strong></strong>").text(" - "+hours+":"+minutes+" - "+this.name)
						)					
						.append(": " + pText)
				);
			}			
				
		};

		this.debug = function(pText){this.write(pText,'DEBUG');};
		this.info = function(pText){this.write(pText,'INFO');};
		this.warn = function(pText){this.write(pText,'WARN');};
		this.error = function(pText){this.write(pText,'ERROR');};
				
		this.setLogOnDb		= function(pLevel){this.db 		= pLevel;}		
		this.setLogOnAlert 	= function(pLevel){this.alert 	= pLevel;}
		this.setLogOnConsole= function(pLevel){this.console	= pLevel;}
		
		this.getLogOnDb		= function(){return this.db;}		
		this.getLogOnAlert 	= function(){return this.alert;}
		this.getLogOnConsole= function(){return this.console;}		
	}	

};