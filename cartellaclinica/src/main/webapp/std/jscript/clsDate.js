/**
 * Contiene utility di conversione e varie.
 * 
 * @Deprecated   Usare al suo posto clsUtilities.js
 */
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
					case 'YYYYMMDDHH:mm:ss' :
    					var yyyy = pDate.getFullYear();
					    var MM = ("00"+(pDate.getMonth()+1)).slice(-2);
					    var dd = ("00"+(pDate.getDate())).slice(-2);
					    var hh =("00"+(pDate.getHours())).slice(-2);
					    var mm =("00"+(pDate.getMinutes())).slice(-2);
					    var ss =("00"+(pDate.getSeconds())).slice(-2);
					    return yyyy+MM+dd+" "+hh+":"+mm+":"+ss;
				}
	},	
	dateAdd:function(pDate,type,value){
				var vDate=new Date();vDate.setTime(pDate.getTime());
				switch (type) {
					case 'Y' : vDate.setFullYear(pDate.getFullYear()+parseInt(value));break;
					case 'M' : vDate.setMonth(pDate.getMonth()+parseInt(value));break;
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
				var anno,mese,giorno,ora,minuti='';
				var vDate = new Date();
				switch(pFormat){
					case 'YYYYMMDD':anno = pStrData.substring(0,4); mese = parseInt(pStrData.substring(4,6),10)-1; giorno = pStrData.substring(6,8);break;
					case 'DD/MM/YYYY':anno = pStrData.substring(6,10); mese = parseInt(pStrData.substring(3,5),10)-1; giorno = pStrData.substring(0,2);break;		
				}
				if(typeof pOra =='undefined' || pOra==''){
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
		},
		month:function(pDate,pDateRiferimento){

			var vDate = new Date();
			vDate.setTime(pDate.getTime());
			
			var result=0;
			
			if(vDate>pDateRiferimento){
				while(vDate>pDateRiferimento){
					vDate = clsDate.dateAdd(vDate,'M',-1);
					result++;
				}
			}else{
				while(vDate<pDateRiferimento){
					vDate = clsDate.dateAdd(vDate,'M',1);
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
	},
	getDayName:function(pDate,pShort){
		pShort = (typeof pShort == 'undefined' ? false : pShort);
		switch(pDate.getDay()){
			case 0 : return pShort ? 'Dom' : 'Domenica';
			case 1 : return pShort ? 'Lun' : 'Lunedì';
			case 2 : return pShort ? 'Mar' : 'Martedì';
			case 3 : return pShort ? 'Mer' : 'Mercoledì';
			case 4 : return pShort ? 'Gio' : 'Giovedì';
			case 5 : return pShort ? 'Ven' : 'Venerdì';
			case 6 : return pShort ? 'Sab' : 'Sabato';																				
		}
	},
	
	/**
	 * Restituisce la differenza tra due date, a meno di estremi definiti in un range opzionale.
	 * Se gli estremi sono nulli o negativi, il controllo è disabilitato.
	 * 
	 * @author  gianlucab
	 * @param   date1,      la prima data da verificare
	 * @param   date2,      la seconda data da verificare
	 * @param   range,      (opzionale) un oggetto che contiene gli estremi top e down (Number)
	 * @returns {Number}    1: date1 è maggiore di date2;
	 *                     -1: date1 è minore di date2;
	 *                      0: date1 e date2 coincidono.
	 */
	dateCompare:function(date1, date2, range) {
		var offset = {top:0, down:0};
		
		if (range != null && typeof range === 'object') {	
			offset['top'] = typeof range['top'] === 'number' && range.top >= 0 ? range.top : NaN;
			offset['down'] = typeof range['down'] === 'number' && range.down >= 0 ? range.down : NaN;
		}
		
		var start = isNaN(offset.down) ? date2 : clsDate.dateAdd(date2,'h',-offset.down);
		var end   = isNaN(offset.top)  ? date2 : clsDate.dateAdd(date2,'h', offset.top);
		
		if(date1<start && !isNaN(offset.down)) {
			return -1;
		} else if (date1>end && !isNaN(offset.top)) {
			return +1;
		}
		return 0;
	},
	
	/**
	 * Calcola l'età in anni a partire dalla data di nascita passata come parametro.
	 * 
	 * @param birthDate  (date)
	 * @returns          anni di età
	 */
	getAge:function(birthDate) {
	    var today = new Date();
	    var age = today.getFullYear() - birthDate.getFullYear();
	    var m = today.getMonth() - birthDate.getMonth();
	    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
	        age--;
	    }
	    return age;
	}
};

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