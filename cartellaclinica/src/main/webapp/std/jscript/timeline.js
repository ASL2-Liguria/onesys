var timeline={
		setup:{zoom:1,data:'',ora:'',numeroOre:0,minutiBlocco:0,tipoAlternaColore:'1',minutiEditing:0,orarioUnivoco:true},
		properties:{dateIni:new Date(),dateFine:new Date(),lastDate:new Date(),nextDate:new Date(),activeDate:new Date(),numeroBlocchi:0,classeGiorno:'',callBackRemoveDettaglio:function(){},callBackAddDettaglio:function(){},orarioUnivoco:null,TimelinePct:null},
		offset:{width:0,left:0},
		objTimeLine:null,
		objScroll:null,		
		arTbody:[/*array contenente tutte le impostazioni dei dettagli*/],
		clsTbody:function(pObj){
					this.obj=pObj;
					this.arDettagli=new Array();
					
					this.addDettaglio=function(pDate,pTxt,pLivello){
						var vDettaglio =new timeline.clsDettaglio(pDate,null,pTxt);
						this.arDettagli.push(vDettaglio);
						vDettaglio.append(pObj);
						(typeof pLivello!='undefined')?vDettaglio.setLivello(pLivello):null;
					}
					this.addDettaglioDurata=function(pDate,pDurata,pTxt,pLivello){
						var vDettaglio = new timeline.clsDettaglio(pDate,clsDate.dateAdd(pDate,'mi',pDurata),pTxt);

						vDettaglio.addRange(vDettaglio.dateIni,vDettaglio.dateFine,pTxt);
						this.arDettagli.push(vDettaglio);
						vDettaglio.append(pObj);
						(typeof pLivello!='undefined')?vDettaglio.setLivello(pLivello):null;
					}	
					this.addDettaglioRanges=function(pDateIni,pRanges,pLivello){
						var vDettaglio = new timeline.clsDettaglio(pDateIni,pRanges[pRanges.length-1].dateFine);
						for(var i=0;i<pRanges.length;i++)
							vDettaglio.addRange(pRanges[i].dateIni,pRanges[i].dateFine,pRanges[i].txt);
						this.arDettagli.push(vDettaglio);
						vDettaglio.append(pObj);
						(typeof pLivello!='undefined')?vDettaglio.setLivello(pLivello):null;						
					}
					this.removeDettagli=function(){
						this.arDettagli = new Array();
					}
		},
		clsDettaglio:function(pDateIni,pDateFine,pTxt,pLivello){

					this.arRange=new Array();
					this.dateIni=pDateIni;
					this.dateFine=pDateFine;
					
					this.pctLeft=clsDate.date2pct(timeline.properties.dateIni,timeline.properties.dateFine,pDateIni,timeline.properties.TimelinePct);
					
					(typeof pLivello!='undefined')?this.livello=pLivello:this.livello=0;
					
					this.setLivello=function(pLivello){
						this.livello=pLivello;
						this.obj.className='L'+this.livello+'';
					}
			
					this.addRange=function(pDateIni,pDateFine,pTxt){
						var newRange=new timeline.clsRange(pDateIni,pDateFine,pTxt);
						if(pDateFine!=null)
							newRange.pctWidth = clsDate.range2pct({ini:this.dateIni,fine:this.dateFine},{ini:pDateIni,fine:pDateFine});								
						this.arRange.push(newRange);	
					}

					if(pDateFine!=null)
						this.pctWidth=clsDate.range2pct({ini:timeline.properties.dateIni,fine:timeline.properties.dateFine},{ini:pDateIni,fine:pDateFine},timeline.properties.TimelinePct);
					else						
						this.addRange(pDateIni,null,pTxt);

					this.pctRight=this.pctLeft+this.pctWidth;	
					
					this.refresh=function(){
						this.left=this.obj.offsetLeft;
						this.top=this.obj.offsetTop;
						this.width=this.obj.offsetWidth;
						this.height=this.obj.offsetHeight;
						
						this.right=this.left+this.width;
						this.bottom=this.top+this.height;						
					}
					
					this.refreshPosition=function(){
						this.pctLeft=clsDate.date2pct(timeline.properties.dateIni,timeline.properties.dateFine,pDateIni,timeline.properties.TimelinePct);
						this.obj.style.left=this.pctLeft+'%';
						if(pDateFine!=null){
							this.pctWidth=clsDate.range2pct({ini:timeline.properties.dateIni,fine:timeline.properties.dateFine},{ini:pDateIni,fine:pDateFine},timeline.properties.TimelinePct);
							this.obj.style.width = this.pctWidth+'%';
							//this.refresh();
						}
							
					}
					
					this.append=function(tbody){												
						
						var div=document.createElement("div");
						this.obj=div;
						div.index = tbody.index;
						div.id="dettaglio";
						div.className = 'L'+this.livello+'';
						div.style.left=this.pctLeft+"%";
						div.style.top="5px";
						(this.pctWidth>0)?div.style.width=this.pctWidth+"%":null;
						div.style.top=tbody.rows[tbody.rows.length-1].offsetTop+'px';
						div.style.paddingTop="5px";
						
						div.data = clsDate.getData(this.dateIni,'YYYYMMDD');
						div.ora=clsDate.getOra(this.dateIni);
						div.day=clsDate.difference.day(this.dateIni,timeline.properties.dateIni);
						
						for(var idx=0;idx<this.arRange.length;idx++){
							var divRange = document.createElement("div");
							
							divRange.onclick=function(){timeline.removeDettaglio(div);}
							
							divRange.className="range";
							(this.arRange[idx].pctWidth>0)?divRange.style.width=this.arRange[idx].pctWidth+"%":null;
							
							var divTop = document.createElement("div");	
							var divBottom = document.createElement("div");	
							
							if(this.arRange.length==1 && this.arRange[0].dateIni==this.arRange[0].dateFine){
								divTop.className="textRight";								
								if(tbody.printOre=="1")
									divTop.innerHTML=clsDate.getOra(this.arRange[idx].dateIni)
								else{
									divTop.innerHTML='&nbsp;';
									(this.arRange[0].txt==null || this.arRange[0].txt=='')?divRange.style.width = "15px":null;
								}
							}else{
								divTop.innerHTML = "&nbsp";
								divBottom.innerHTML = "&nbsp";							
								
								if(idx%2==0){
									divTop.className="textLeft";
									(tbody.printOre=="1")?divTop.innerHTML=clsDate.getOra(this.arRange[idx].dateIni):divTop.innerHTML='&nbsp;';
									divBottom.className="border";
									if(idx==this.arRange.length-1){
										divBottom.className="border textRight";
										(tbody.printOre=="1")?divBottom.innerHTML=clsDate.getOra(this.arRange[idx].dateFine):divBottom.innerHTML='&nbsp;';
									}
								}else{
									divTop.className="border";
									divBottom.className="textLeft";	
									(tbody.printOre=="1")?divBottom.innerHTML=clsDate.getOra(this.arRange[idx].dateIni):divBottom.innerHTML='&nbsp;';								
									if(idx==this.arRange.length-1){
										divTop.className="border textRight";
										(tbody.printOre=="1")?divTop.innerHTML=clsDate.getOra(this.arRange[idx].dateFine):divTop.innerHTML='&nbsp;';
									}								
								}
							
							}

							var divMiddle = document.createElement("div");
							divMiddle.className="middle border";
							divMiddle.innerText = this.arRange[idx].txt;
							
							divRange.appendChild(divTop);
							divRange.appendChild(divMiddle);													
							divRange.appendChild(divBottom);
							
							div.appendChild(divRange);
						}
						tbody.parentNode.parentNode.appendChild(div);	
						timeline.properties.callBackAddDettaglio();

						this.refresh();
						for(var i=tbody.index;i<timeline.arTbody.length;i++)
							timeline.alignTbody(i);
					}
		},
		clsRange:function(pDateIni,pDateFine,pTxt){
					this.dateIni=pDateIni;					
					(pDateFine==null)?this.dateFine=pDateIni:this.dateFine=pDateFine;
					(pTxt==null || typeof pTxt=='undefined')?this.txt='':this.txt=pTxt;
					this.pctWidth=0;
									
		},		
		zoom:function(timeline,value){
			timeline.width = (value*100)+'%';
			timeline.parentNode.speed=(value*2);	
		},
		refresh:function(){

		},
		Scroll:function(start){
			var objScroll =timeline.objScroll;// timeline.getParentObj(obj,'scrollObj');	
			if(start){//inizio lo scroll
				objScroll.initX=event.clientX;
				objScroll.onmousemove=function(){		
					objScroll.scrollLeft =objScroll.scrollLeft+(parseInt(objScroll.initX,10)- event.clientX)*parseInt(objScroll.speed,10);	
					objScroll.initX=event.clientX;
					
				}
			}else{//finisco lo scroll
				objScroll.initX=0;
				objScroll.onmousemove=function(){null;}		
			}
		},
		getParentObj:function(obj,id){while (obj.id!=id){obj = obj.parentNode;}return obj;},
		build:function(obj,callBack){
			
			obj.attachEvent("onselectstart",function(){return false;});
			
			//(typeof obj=='undefined')?obj=timeline.objTimeLine:timeline.objTimeLine=obj;
			
			if(typeof timeline.setup.callBackRemoveDettaglio != 'undefined' && timeline.setup.callBackRemoveDettaglio){
				timeline.properties.callBackRemoveDettaglio = timeline.setup.callBackRemoveDettaglio;
			}
			if(typeof timeline.setup.callBackAddDettaglio != 'undefined' && timeline.setup.callBackAddDettaglio){
				timeline.properties.callBackAddDettaglio = timeline.setup.callBackAddDettaglio;
			}			
			
			timeline.objTimeLine=obj;
			timeline.objScroll=obj.parentNode;
			timeline.obj=obj.parentNode;
			timeline.properties.classeGiorno='pari';

			timeline.zoom(obj,timeline.setup.zoom);

//			if(timeline.arTbody.length==0){
				timeline.arTbody = [];
				for(var i=0;i<obj.firstChild.tBodies.length;i++){
					timeline.arTbody.push(new timeline.clsTbody(obj.firstChild.tBodies[i]));
				}
	//		}

			for(var j=0;j<timeline.arTbody.length;j++){
				for(var i=timeline.arTbody[j].obj.rows.length-1;i>=0;i--){			
					timeline.arTbody[j].obj.rows[i].removeNode(true);					
				}
			}

			timeline.properties.numeroBlocchi = timeline.setup.numeroOre*60/timeline.setup.minutiBlocco;
			timeline.properties.dateIni  = clsDate.setData(timeline.setup.data,timeline.setup.ora);
			timeline.properties.dateIni  = clsDate.round(timeline.properties.dateIni,'mi',timeline.setup.minutiBlocco);	
			timeline.properties.dateFine.setTime(timeline.properties.dateIni.getTime());	
			timeline.properties.dateFine = clsDate.dateAdd(timeline.properties.dateFine,'h',timeline.setup.numeroOre);
			timeline.properties.activeDate.setTime(timeline.properties.dateIni.getTime());
			timeline.properties.lastDate.setTime(timeline.properties.dateIni.getTime());
			timeline.properties.nextDate.setTime(timeline.properties.dateIni.getTime());
			timeline.properties.nextDate = clsDate.dateAdd(timeline.properties.nextDate,'mi',timeline.setup.minutiBlocco);
			timeline.properties.orarioUnivoco = (typeof timeline.setup.orarioUnivoco == 'undefined'?true:timeline.setup.orarioUnivoco);
			timeline.properties.TimelinePct = (96/timeline.setup.numeroOre % 1 == 0 ? 96 : timeline.setup.numeroOre);			

			var trGiorni = document.createElement('tr');	trGiorni.id  ='rowGiorno';   
			var trOre = document.createElement('tr');		trOre.id     ='rowOre';     
			var trBlocchi = document.createElement('tr');	trBlocchi.id ='rowBlocchi'; 

			var clsGiorno='pari',clsBlocco='pari';
			var txtGiorno='',txtOra='',clsOra='';
			var minuti=0;
			
			while(timeline.properties.activeDate<timeline.properties.dateFine){

				if(timeline.properties.activeDate.getTime()==timeline.properties.dateIni.getTime()){//primo giro
					txtGiorno=timeline.properties.activeDate.getDate();
					txtOra = clsDate.getOra(timeline.properties.activeDate).substring(0,2);
				}else{
					txtGiorno=txtOra='&nbsp;&nbsp;';
				}		

				if(timeline.properties.activeDate.getDate()!=timeline.properties.lastDate.getDate()){//è cambiata la data
					timeline.properties.classeGiorno = alterna(timeline.properties.classeGiorno);
					clsGiorno = timeline.properties.classeGiorno + ' left';
					txtGiorno=timeline.properties.activeDate.getDate();
				}
				if(timeline.properties.activeDate.getDate()==timeline.properties.nextDate.getDate())//non è cambiata la data
					clsGiorno+= ' mid';
				if(timeline.properties.activeDate.getDate()!=timeline.properties.nextDate.getDate())//prossimo giro cambia la data
					clsGiorno+= ' right';
				appendTd(trGiorni,clsGiorno,txtGiorno);
		
				if(timeline.properties.activeDate.getHours()!=timeline.properties.lastDate.getHours()){//è cambiata l'ora
					txtOra = '0'+timeline.properties.activeDate.getHours();
					txtOra = txtOra.substring(txtOra.length-2,txtOra.length);
					clsOra = 'ora left';
				}
				if(timeline.properties.activeDate.getHours()==timeline.properties.nextDate.getHours())//non è cambiata l'ora
					clsOra+= 'ora mid';
				if(timeline.properties.activeDate.getHours()!=timeline.properties.nextDate.getHours())//prossimo giro cambia ora
					clsOra = 'ora right';
				appendTd(trOre,clsOra,txtOra);

				minuti = timeline.properties.activeDate.getMinutes();
				switch (timeline.setup.tipoAlternaColore){
					case '1':if(minuti==0)clsBlocco = alterna(clsBlocco);break;			
					case '1/2':if(minuti==0 || minuti==30)clsBlocco = alterna(clsBlocco);break;			
					case '1/4':if(minuti==0 || minuti==15 || minuti==30 || minuti==45)clsBlocco = alterna(clsBlocco);break;
				}
				appendTd(trBlocchi,clsBlocco,'&nbsp;&nbsp;');	

				timeline.properties.lastDate.setTime(timeline.properties.activeDate.getTime());
				timeline.properties.activeDate.setTime(timeline.properties.nextDate.getTime());
				timeline.properties.nextDate = clsDate.dateAdd(timeline.properties.nextDate,'mi',timeline.setup.minutiBlocco);
			}
	
			appendTd(trGiorni,'empty','&nbsp;&nbsp;');
			appendTd(trOre,'empty','&nbsp;&nbsp;');
			appendTd(trBlocchi,'empty','&nbsp;&nbsp;');		

			for(var i=0;i<timeline.arTbody.length;i++){				
				if(timeline.arTbody[i].obj.showGiorni=="1")
					timeline.arTbody[i].obj.appendChild(trGiorni.cloneNode(true));
				if(timeline.arTbody[i].obj.showOre=="1")
					timeline.arTbody[i].obj.appendChild(trOre.cloneNode(true));
				if(timeline.arTbody[i].obj.showBlocchi=="1")
					timeline.arTbody[i].obj.appendChild(trBlocchi.cloneNode(true));
				timeline.arTbody[i].obj.top=timeline.arTbody[i].obj.rows[timeline.arTbody[i].obj.rows.length-1].offsetTop;
								
				timeline.setEventsEditing(timeline.arTbody[i].obj,timeline.arTbody[i].obj.editing=="1");		
				
				for(var j=0;j<timeline.arTbody[i].arDettagli.length;j++){
					timeline.arTbody[i].arDettagli[j].refreshPosition();
				}
			}	

			timeline.objTimeLine.firstChild.width = '100%';
			
			timeline.align();
			timeline.offset.width = obj.scrollWidth;
			
			//var position = new parent.clsPosition.get(timeline.objScroll);
			timeline.offset.left=obj.offsetLeft;
			timeline.offset.top=obj.offsetTop;
			
			if(typeof callBack == 'function'){
				callBack();
			}

			function alterna(cls){if(cls=='pari')return 'dispari';else return 'pari';}
	
			function appendTd(tr,cls,text){
				var td = document.createElement('td');
				var div = document.createElement('div');
				
				if(cls=='empty')
					td.style.width = (100 - timeline.properties.TimelinePct) + '%';
				else				
					td.style.width = (Math.ceil(timeline.properties.TimelinePct/ timeline.properties.numeroBlocchi))+'%';
				
				div.className = cls;
				div.innerHTML = text;		
				
				td.appendChild(div);
				tr.appendChild(td);		
			}

		},
		setEventsEditing:function(tbody,enable){
			var row = tbody.rows[tbody.rows.length-1]
			if(enable){
				row.onmouseenter=function(){timeline.startToolTip(tbody);}
				row.onmouseleave=function(){timeline.stopToolTip(tbody);}
				row.onmousemove=function(){timeline.refreshToolTip(tbody);}	
				row.onmousedown=function(){timeline.addDettaglio(tbody);event.cancelBubble=true;}
				
				row.cells[row.cells.length-1].onclick=function(){event.cancelBubble=true;}
			}else{
				row.onmouseon=function(){null;}
				row.onmouseout=function(){null;}
				row.onmousemove=function(){null;}	
				row.onclick=function(){null;}
			}
		},
		startToolTip:function(tbody){
					tbody.all['toolTip'].style.display='block';tbody.style.cursor='hand';
					obj = tbody.parentNode.parentNode;
//					alert()
					timeline.offset.width = obj.scrollWidth;		
					timeline.offset.left  = obj.offsetLeft;
		},
		stopToolTip:function(tbody){
					tbody.all['toolTip'].style.display='none';tbody.style.cursor='default';		
		},
		refreshToolTip:function(tbody){
						
						var pct = (event.clientX-timeline.offset.left+timeline.objScroll.scrollLeft)/timeline.offset.width*100;

						if(pct<=timeline.properties.TimelinePct){
							tbody.all['toolTip'].style.top= tbody.rows[tbody.rows.length-1].offsetTop;
							var vLeft = event.clientX-52-timeline.offset.left+timeline.objScroll.scrollLeft;
							if(vLeft>=0)
								tbody.all['toolTip'].style.left= vLeft+'px';
							else
								tbody.all['toolTip'].style.left= (vLeft+65)+'px';
							var data = new Date();
							data =clsDate.pct2date(timeline.properties.dateIni,timeline.properties.dateFine,pct,timeline.properties.TimelinePct);
							data = clsDate.round(data,'mi',timeline.setup.minutiEditing);
							tbody.all['toolTip'].innerText=clsDate.getOra(data);
							tbody.all['toolTip'].ora=clsDate.getOra(data);
							tbody.all['toolTip'].data=clsDate.getData(data,'YYYYMMDD');
						}

		},
		addDettaglio:function(tbody,pDate){
						
						var vIgnoraDuplicazione =(typeof pDate != 'undefined' ? true : false);
						var NewDate =(typeof pDate != 'undefined' ?  pDate : clsDate.str2date(tbody.all['toolTip'].data,'YYYYMMDD',tbody.all['toolTip'].ora));
						//alert(timeline.properties.dateIni + '\n' + pDate + '\n' + timeline.properties.dateFine)
						if(pDate < timeline.properties.dateIni)return;
						if(pDate >= timeline.properties.dateFine)return;
						
						if(timeline.properties.orarioUnivoco){
							for(var i=0 ; i < timeline.arTbody[tbody.index].arDettagli.length ; i++){
								if(timeline.arTbody[tbody.index].arDettagli[i].dateIni.getTime() == NewDate.getTime()){
									if(!vIgnoraDuplicazione){
										timeline.removeDettaglio(timeline.arTbody[tbody.index].arDettagli[i].obj);
									}
									return;
								}
							}
						}

						timeline.arTbody[tbody.index].arDettagli.push(new timeline.clsDettaglio(NewDate,null,null));
						timeline.arTbody[tbody.index].arDettagli[timeline.arTbody[tbody.index].arDettagli.length-1].append(tbody);

		},
		removeDettaglio:function(dettaglio){
					if(timeline.arTbody[dettaglio.index].obj.editing=="1"){
						var idxDettaglio;
	
						for(var i=0;i<timeline.arTbody[dettaglio.index].arDettagli.length;i++){
							if(timeline.arTbody[dettaglio.index].arDettagli[i].obj==dettaglio)
								idxDettaglio=i;
						}
						timeline.arTbody[dettaglio.index].arDettagli.splice(idxDettaglio,1);
						dettaglio.removeNode(true);
						timeline.properties.callBackRemoveDettaglio();
						timeline.align();
					}			
		},
		sorting:{
			leftAsc:function(a,b){return a.left - b.left;},
			leftDesc:function(a,b){return b.left - a.left;},			
			dataAsc:function(a,b){return clsDate.str2date(a.data,'YYYYMMDD',a.ora).getTime() - clsDate.str2date(b.data,'YYYYMMDD',b.ora).getTime();},
			dataDesc:function(a,b){return clsDate.str2date(b.data,'YYYYMMDD',b.ora) - clsDate.str2date(a.data,'YYYYMMDD',a.ora);}			
		},
		align:function(){
			for(var i=0;i<timeline.arTbody.length;i++)
				timeline.alignTbody(i);
		},
		alignTbody:function(index){
			var trHeight =30;
			var vTop;
	
			var lstDettagli = timeline.arTbody[index].arDettagli;

			if(lstDettagli.length==0){setTr();return;}
			if(timeline.arTbody[index].obj.rows[timeline.arTbody[index].obj.rows.length-1].offsetTop==0){
				vTop='29px';
			}
			else{

			vTop=timeline.arTbody[index].obj.rows[timeline.arTbody[index].obj.rows.length-1].offsetTop+'px';
			}
			lstDettagli.sort(timeline.sorting.leftDesc);
			lstDettagli[0].obj.style.paddingTop='5px';
			lstDettagli[0].obj.style.top = vTop;
			lstDettagli[0].obj.style.zIndex = 50;
			lstDettagli[0].refresh();
			(trHeight<(lstDettagli[0].height+5))?trHeight=lstDettagli[0].height+5:null;			
			
			if(lstDettagli.length==1){setTr();return;}
			
			for(var j=1;j<lstDettagli.length;j++){
				lstDettagli[j].refresh();
				lstDettagli[j].obj.style.top = vTop;
				lstDettagli[j].obj.style.paddingTop='5px';
				lstDettagli[j].obj.style.zIndex = 50;
				
				if(lstDettagli[j].right>=lstDettagli[j-1].left){
					lstDettagli[j].obj.style.paddingTop=(lstDettagli[j-1].bottom-lstDettagli[j-1].top+5)+'px';
					lstDettagli[j].obj.style.zIndex = lstDettagli[j-1].obj.style.zIndex-1;
				}
					
				lstDettagli[j].refresh();
				(trHeight<(lstDettagli[j].height+5))?trHeight=lstDettagli[j].height+5:null;
				
			}
			
			setTr();
			
			function setTr(){
					for(z=0;z<timeline.arTbody[index].obj.rows[timeline.arTbody[index].obj.rows.length-1].cells.length;z++)
						timeline.arTbody[index].obj.rows[timeline.arTbody[index].obj.rows.length-1].cells[z].firstChild.style.height=trHeight+'px';				
			}
		}
	}//end timeline
	
/*function clsTimeLine(obj){
	this.objTimeline = obj;
	this.objScroll   = obj.parentNode;
	
	this.setup={zoom:1,data:'',ora:'',numeroOre:0,minutiBlocco:0,tipoAlternaColore:'1',minutiEditing:0};
	this.properties={dateIni:new Date(),dateFine:new Date(),lastDate:new Date(),
					nextDate:new Date(),activeDate:new Date(),numeroBlocchi:0,classeGiorno:''};
}*/