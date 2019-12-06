var WindowCartella 	= null;

jQuery(document).ready(function(){

	window.WindowCartella = window;   
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    } 
	NS_DATI_LABO_GRIGLIA.init();
	
});

var NS_DATI_LABO_GRIGLIA = {
	
	init : function(){
		NS_DATI_LABO_GRIGLIA.setEvents();
		NS_DATI_LABO_GRIGLIA.setStyles();
	
	},
		
	setEvents : function(){
		
		NS_DATI_LABO_GRIGLIA.EVENTS.setGenericEvents();
				
	},
	
	setStyles : function(){
	
		NS_DATI_LABO_GRIGLIA.STYLES.setGenericStyle();

		if(parent._CONTEXT == 'CARTELLA' || parent._CONTEXT == 'AMBULATORIO')
			NS_DATI_LABO_GRIGLIA.STYLES.setDimensionCartella();
		else if(parent._CONTEXT == 'MMG')
			NS_DATI_LABO_GRIGLIA.STYLES.setDimensionMMG()
		else if (parent._CONTEXT == 'IPATIENT')
			NS_DATI_LABO_GRIGLIA.STYLES.setDimensionIPatient();
		else if (parent._CONTEXT == 'INFO')
			NS_DATI_LABO_GRIGLIA.STYLES.setDimensionInfo();		
	
	},
	
	setEsitiConsultati : function(idenTestata, insert){
		var pBinds = new Array();
		pBinds.push(WindowCartella.baseUser.IDEN_PER);
		pBinds.push(idenTestata);
	 if(insert)
		 pBinds.push('S'); 
	 else
		 pBinds.push('N');  
	 
	 var vResp = top.executeStatement('datiStrutturatiLabo.xml','esitiConsultati',pBinds);
	 if(vResp[0]=='KO'){
		   alert(vResp[1]);
              }
	},
	
	getEsitiConsultati : function(idenTestata){
		var rs= top.executeQuery("datiStrutturatiLabo.xml","getEsitiConsultati",[WindowCartella.baseUser.IDEN_PER,idenTestata]);
		while(rs.next()){	
		 $("INPUT[name='chkLetto'][idenTestata='"+rs.getString("IDEN_TESTATA_RICHIESTE")+"']").attr('checked', true);
		}
	},
	
	
	EVENTS : {
		
		setGenericEvents : function(){
			
			NS_DATI_LABO_GRIGLIA.UTILS.disabilitaTastoDx();
			
			// Visualizza Dati MicroBiologia
			$("td[class~='datiMicrobiologia']").live('click',function(){    
				NS_DATI_LABO_GRIGLIA.UTILS.visualizzaMicrobiologia($(this).attr('RICHIESTA'),$(this).attr('PROGRANALISI'),$(this).attr('PROGRANALISIPR'),$('#tabellaLeft').find("tr").eq($(this).closest("tr")[0].rowIndex).find("td").eq(1).html());
			});
			
			$("INPUT[name='chkLetto']").live('click',function(){  
				NS_DATI_LABO_GRIGLIA.setEsitiConsultati($(this).attr('idenTestata'),$(this).is(':checked'));
			});
			
			//-----------modifica chiesta da RRF_PL, con dei check segnalano se la richiesta è stata visionata
			var idenTestate='';
			$("INPUT[name='chkLetto']").each(function(index){
	            if(idenTestate!=''){idenTestate+=','}
	            idenTestate+=$(this).attr('idenTestata');
	        });
			if(idenTestate!=''){
			NS_DATI_LABO_GRIGLIA.getEsitiConsultati(idenTestate);
			}
			//-----------modifica chiesta da RRF_PL, con dei check segnalano se la richiesta è stata visionata
			
			try{top.utilMostraBoxAttesa(false);}catch(e){}
			
		}
		
	},
	
	STYLES : {
	
		setGenericStyle : function(){
		
			// Triangolo Intestazione Altro Reparto
			$("td[class~='tdIntAltriRep']").each(function(){
				$(this).prepend('<div title="'+$(this).attr('DESCR_CDC')+'" class="triangoloNote"></div>');
			});	
			
			$("td[class~='noteRichiesta']").each(function(){
				$(this).prepend('<div title="'+$(this).attr('NOTE')+'" class="noteRichiestaIco"></div>');
			});	

			// Dimensioni Wrapper
			if($('#tabIntestazione').length > 0){
			
				NS_DATI_LABO_GRIGLIA.STYLES.setAltezzaCol();			
				
				$('#divDati').scroll(function(){
					$('#divLeft').scrollTop($('#divDati').scrollTop());
					$('#divIntestazione').scrollLeft($('#divDati').scrollLeft());
					$('.triangoloNote').scrollLeft($('.tdIntAltriRep').scrollLeft());
				});
				
			}
			
		},
		
		setDimensionCartella : function(){
		
			if ($('#divDati').length > 0){
				
				var height 		= parent.document.getElementById('iframeGriglia').offsetHeight;
				var offLeft		= $('#divLeft').outerWidth(); // /*document.getElementById('divDati').offsetLeft*/
				var widthDati	= window.screen.availWidth - (offLeft + 8);
				
				
				$('#divWrapper').css({'height' : height - 35 });
				$('#divLeft').css({'height' : height - 62 });		
				$('#divDati').css({'height' : height - 45 ,'width': widthDati,'position':'absolute','left':offLeft});
				$('#divIntestazione').css({'width' : widthDati - 18,'position':'absolute','left':offLeft});
				
			}
		
		},
		
		setDimensionMMG : function(){
			
			if ($('#divDati').length > 0){
			var widthDati	= window.screen.availWidth - (document.getElementById('divDati').offsetLeft + 8);
			var height 		= parent.document.getElementById('iframeGriglia').offsetHeight;
			var offLeft		= $('#divLeft').outerWidth(); 
			
			$('#divWrapper').css({'height' : height , 'width':widthDati});
			$('#divLeft').css({'height' : height - 62});				
			$('#divDati').css({'height' : height - 45,'width': widthDati - 20,'position':'absolute','left':offLeft});
			$('#divIntestazione').css({'width' : widthDati - 20,'position':'absolute','left':offLeft});

			}
		},
		
		setDimensionIPatient : function(){
		
			// Remove Spinner
			top.NS_PAGINA.Events.attesa(false);
			if ($('#divDati').length > 0){
				/*
				var height 		= $(window).height() - (parent.document.getElementById('iframeGriglia').offsetTop); //parent.document.getElementById('iframeGriglia').offsetHeight;
				var widthDati	= window.screen.availWidth - (document.getElementById('divDati').offsetLeft + 8);
				
				$('#divWrapper').css({'height' : height - 10 });
				$('#divLeft').css({'height' : height - 27 });		
				$('#divDati').css({'height' : height - 10 ,'width': widthDati - 185});
				$('#divIntestazione').css({'width' : widthDati - 200});
				*/
				var height 		= parent.document.getElementById('iframeGriglia').offsetHeight;
				var offLeft		= $('#divLeft').outerWidth(); // /*document.getElementById('divDati').offsetLeft*/
				var widthDati	= window.screen.availWidth - (offLeft + 195);
				
				
				$('#divWrapper').css({'height' : height - 35 });
				$('#divLeft').css({'height' : height - 62 });		
				$('#divDati').css({'height' : height - 45 ,'width': widthDati,'position':'absolute','left':offLeft});
				$('#divIntestazione').css({'width' : widthDati - 18,'position':'absolute','left':offLeft});
				
			}
		
		},
		
		setDimensionInfo : function(){

			if ($('#divDati').length > 0){
				var height 		= parent.document.getElementById('iframeGriglia').offsetHeight;;
				var offLeft		= $('#divLeft').outerWidth(); // /*document.getElementById('divDati').offsetLeft*/
				widthDati=parseInt(window.parent.parent.$('#frameDatiStrutturati').css('width'))- (offLeft + 8);
				
				
				$('#divWrapper').css({'height' : height - 35 });
				$('#divLeft').css({'height' : height - 62 });		
				$('#divDati').css({'height' : height - 45 ,'width': widthDati,'position':'absolute','left':offLeft});
				$('#divIntestazione').css({'width' : widthDati - 18,'position':'absolute','left':offLeft});
				
			}
		
		},
				
		// Altezza Dinamica righe 
		setAltezzaCol:function(){
			
			document.all.tabIntestazioneRisultati.rows[0].style.height=(document.all.tabIntestazione.rows[0].offsetHeight-4)+'px';
			
			// per certe versioni di ie8 il padding viene considerato
			if(document.all.tabIntestazioneRisultati.rows[0].offsetHeight<document.all.tabIntestazione.rows[0].offsetHeight){
				document.all.tabIntestazioneRisultati.rows[0].style.height=(document.all.tabIntestazione.rows[0].offsetHeight)+'px';
			}
			
			// risetto l'altezza delle  righe
			var cont=0;
			for (var i=0;i<document.all.tabellaLeft.rows.length;i++)
			{	
				cont=cont+1;
				if(document.all.tabellaLeft.rows[i].offsetHeight>25){
	
					document.all.datiTable.rows[i].style.height=(document.all.tabellaLeft.rows[i].offsetHeight-5)+'px';
					// per certe versioni di ie8 il padding viene considerato
					if(document.all.datiTable.rows[i].offsetHeight<document.all.tabellaLeft.rows[i].offsetHeight){
						document.all.datiTable.rows[i].style.height=(document.all.tabellaLeft.rows[i].offsetHeight)+'px';
					}
				}
				if(document.all.datiTable.rows[i].offsetHeight>25){
	
					document.all.tabellaLeft.rows[i].style.height=(document.all.datiTable.rows[i].offsetHeight-5)+'px';
					// per certe versioni di ie8 il padding viene considerato
					if(document.all.tabellaLeft.rows[i].offsetHeight<document.all.datiTable.rows[i].offsetHeight){
						document.all.tabellaLeft.rows[i].style.height=(document.all.datiTable.rows[i].offsetHeight)+'px';
					}
				}	  
			}
		}
		
	},
	
	
	UTILS : {
		
		apriReferto : function(obj){
			
			var url = '';			 	
	 	
			if($(obj).attr('INT_EST') == 'I')
				url = "servletGenerator?KEY_LEGAME=VISDOC&identificativoEsterno=WHALE"+$(obj).attr('IDEN_RICHIESTA');				
			else
				url = 'servletGenerator?KEY_LEGAME=VISDOC&identificativoEsterno=EXT@'+$(obj).attr('IDEN_RICHIESTA');
			
		 	var finestra = window.open (url,'','fullscreen=yes, scrollbars=no');
		 	try{
		 		WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
		 	}catch(e){
		 		
		 	}
		},

		visualizzaMicrobiologia : function(vRichiesta,vProgrAnalisi,vProgrAnalisiPr,title){

			//alert('vRichiesta: '+ vRichiesta + '\n vProgrAnalisi: '+vProgrAnalisi + '\n vProgrAnalisiPr: ' + vProgrAnalisiPr + '\n title: ' + title)
			var clientX = event.clientX;
			var clientY = event.clientY+80;
			
			var rs= top.executeQuery("datiStrutturatiLabo.xml","getDatiMicrobiologia",[vRichiesta,vProgrAnalisi,vProgrAnalisiPr])//,function(rs){

			var vObj =$('<div></div>').attr("id","divMain"); 
			var vObjGerme =''; 
			var vObjTable =''; 
			
			var germeOld='';
			
			
			while(rs.next()){
				
				if(germeOld!=rs.getString("GERME")){
					
					// Ge è già stato processato un germe con la relativa tabella lo appendo
					if (germeOld!='')
						vObj.append(vObjGerme).append(vObjTable);	 
					
					vObjGerme=$('<DIV></DIV>').attr('class','divGerme').text('GERME: '+rs.getString("GERME"));
					vObjTable= $('<table></table>').attr('class','tableAntibio');
					vObjTable.append(
							$('<tr></tr>')
							.append($('<th></th>').text('ANTIBIOTICI'))	
							.append($('<th></th>').text('MIC'))	
							.append($('<th></th>').text('')));
				 
				}
		 
				vObjTable.append(
						$('<tr></tr>')
						.append($('<td></td>').text(rs.getString("ANTIBIOTICO")))	
						.append($('<td></td>').text(rs.getString("MIC")))	
						.append($('<td></td>').text(rs.getString("RISULTATORSI")))	
				);	
				germeOld=rs.getString("GERME");
				
			}
			vObj.append(vObjGerme).append(vObjTable).append($('<DIV></DIV>').attr('class','divLegenda').text('S: Ceppo sensibile, R: Ceppo resistente, I: Risposta Intermedia'));
			
			
		
			NS_DATI_LABO_GRIGLIA.UTILS.Popup.append({
				title:'ANALISI: '+title,
				obj:vObj,
				width:450,
				height:500,
				position:[clientX,clientY]
			});
			
			//});
		
		},
		
		grafLabWhale : function(obj){
			
			
			
			function setParam(){
			
				var idxRow;
				var arTestate = {};
				var arRisultati = {};
				
				idxRow=$(obj).parent().index();
				
				$('#tabIntestazioneRisultati').find('td').each (function() {
					
					arTestate[$(this).index()]=$(this).html();
					arRisultati[$(this).index()]=$('#datiTable tr').eq(idxRow).find('td').eq($(this).index()).html();
					
					});
				
				this.pCodiceEsame	= obj.getAttribute('COD_ESA');
				this.pDescrEsame	= $(obj).parent().find('td').eq(1).html();
				this.pValMin		= $(obj).parent().find('td').eq(2).html();
				this.pValMax		= $(obj).parent().find('td').eq(3).html();
				this.pTestate		= JSON.stringify(arTestate);
				this.pRisultati		= JSON.stringify(arRisultati);
			/*	this.pTestate		= {"1":"12/12/2012<BR>12:12"};
				this.pRisultati		= {"1":"123"};
				alert(arTestate);
				alert(arRisultati);*/
			
			}
			var param = new setParam();

			var resp = window.showModalDialog('modalUtility/grafici/chartContainerLaboWhale.html',param,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');
		
		},
		
		nrcIE : function(){if (document.all){return false;}},
		
		nrcNS : function(e){
			if(document.layers||(document.getElementById&&!document.all)){
				if (e.which==2||e.which==3)
					return false;							
			}
		},
		
		disabilitaTastoDx : function(){
		
			if (document.layers){
				document.captureEvents(Event.MOUSEDOWN);
				document.onmousedown=this.nrcNS;
			}else{
				document.onmouseup=this.nrcNS;
				document.oncontextmenu=this.nrcIE;
			}
			document.oncontextmenu=new Function("return false");
			
		},
		
		// La Funzione Popup è Stata Replicata Per Evitare Problemi Per I Dati Aperti Fuori Dalla Cartella
		// Riferimento Originele su clsUtilities
		Popup : {
				
				append:function(pParam){

					pParam.header 	= (typeof pParam.header 	!= 'undefined' 	? pParam.header 	: null);
					pParam.footer 	= (typeof pParam.footer 	!= 'undefined' 	? pParam.footer 	: null);
					pParam.title 	= (typeof pParam.title  	!= 'undefined' 	? pParam.title 		: "");
					pParam.width 	= (typeof pParam.width  	!= 'undefined' 	? pParam.width 		: 320);
					pParam.height 	= (typeof pParam.height 	!= 'undefined' 	? pParam.height 	: 130);		
					pParam.position = (typeof pParam.position 	!= 'undefined' 	? pParam.position 	: [event.clientX,event.clientY]);
			        NS_DATI_LABO_GRIGLIA.UTILS.Popup.remove();
				
					$('body').append(
						$('<div id="divPopUpInfo"></div>')
							.css("font-size","12px")
							.append(pParam.header)
							.append(pParam.obj)
							.append(pParam.footer)
							.attr("title",pParam.title)
					);
					

					$('#divPopUpInfo').dialog({
							position:	pParam.position,
								width:		pParam.width,
								height:		pParam.height
					});
					
					NS_DATI_LABO_GRIGLIA.UTILS.Popup.setRemoveEvents();
					
				},
				
				remove:function(){
					$('#divPopUpInfo').remove();
				},
				
				setRemoveEvents:function(){
					
					$("body , #AlberoConsultazione ul li").click(NS_DATI_LABO_GRIGLIA.UTILS.Popup.remove);				
					$('iframe').contents().find("body").click(NS_DATI_LABO_GRIGLIA.UTILS.Popup.remove);
				
				}
				
			}

	}
};