jQuery(document).ready(function(){

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

		switch(parent._PROV_CAHIAMATA){
			case 'CARTELLA':
			case 'AMBULATORIO':
				NS_DATI_LABO_GRIGLIA.STYLES.setDimensionCartella();
				break
			case 'IPATIENT':
				NS_DATI_LABO_GRIGLIA.STYLES.setDimensionIPatient();
				break;
			case 'MMG':
				NS_DATI_LABO_GRIGLIA.STYLES.setDimensionMMG();
		}
		/*
		if(parent._PROV_CHIAMATA == 'CARTELLA'){ 
			
		}else if(parent._PROV_CHIAMATA == 'MMG'){
			
		}else{
			NS_DATI_LABO_GRIGLIA.STYLES.setDimensionAmbulatorio();
		}*/
	
	},
	
	EVENTS : {
		
		setGenericEvents : function(){
			
			NS_DATI_LABO_GRIGLIA.UTILS.disabilitaTastoDx();
			
			// Visualizza Dati MicroBiologia
			$("td[class~='datiMicrobiologia']").live('click',function(){    
				NS_DATI_LABO_GRIGLIA.UTILS.visualizzaMicrobiologia($(this).attr('RICHIESTA'),$(this).attr('PROGRANALISI'),$(this).attr('PROGRANALISIPR'),$('#tabellaLeft').find("tr").eq($(this).closest("tr")[0].rowIndex).find("td").eq(1).html());
			});
			
			try{top.utilMostraBoxAttesa(false);}catch(e){}
			
		}
		
	},
	
	STYLES : {
	
		setGenericStyle : function(){
			
			// Richieste di Altri reparti
			$("td[class~='tdIntAltriRep']").each(function(){
				$(this).prepend("<div title='"+$(this).attr('DESCRPROV')+"' class='triangoloNote'></div>");
			});

			// Proprietà generiche dati Labo
			if($('#tabellaInt').length > 0){
			
				NS_DATI_LABO_GRIGLIA.STYLES.setAltezzaCol();			
				
				$('#divDati').scroll(function(){
										  
					$('#divLeft').scrollTop($('#divDati').scrollTop());
					$('#divInt').scrollLeft($('#divDati').scrollLeft());
					$('.triangoloNote').scrollLeft($('.tdIntAltriRep').scrollLeft());
				});
				
			}
			
		},
		
		setDimensionCartella : function(){
		
			if ($('#divDati').length > 0){
				
				var height 		= parent.document.getElementById('iframeGriglia').offsetHeight;
				var widthDati	= $(document).width() - (document.getElementById('divDati').offsetLeft + 4);
				
				$('#divWrapper').css({'height' : height - 35 +'px'});
				$('#divLeft').css({'height' : height - 40 +'px'});		
				$('#divDati').css({'height' : height - 41 +'px','width': + widthDati + 'px'});
				
			}
		
		},
		
		setDimensionMMG : function(){
			
			if (parent._IDX_REFRESH < 1)
				top.jQuery("#iContent").height(top.jQuery("#iContent").height()-50);
			else
				top.jQuery("#iContent").height(top.jQuery("#iContent").height());
			
			$('#divWrapper').width($(document).width())
			
			var widthDati	= (($('#divWrapper').width()) - jQuery("#divLeft").width());
			var h = (top.jQuery("#iContent").height()-118);
			
			$('#divWrapper').css({'height' :  h +'px'});
			$('#divLeft').css({'height' : h +'px'});				
			$('#divDati').css({'height' : h +'px','width': + (parseInt(widthDati)-10) + 'px'});
			
			parent._IDX_REFRESH = parent._IDX_REFRESH + 1;
		
		},		
		
		setDimensionAmbulatorio : function(){
		
		
		},
		
		setDimensionIPatient : function(){
			
			var hMenuLaterale	= parent.parent.$('#divBody').height();
			var wBodyIPatient	= parent.parent.$('#divBody').width();
			var hFiltroDatiLabo	= parent.$('#divMenu').height();
			var hTabIntDatiLabo	= $('#tabellaInt').height();
			// alert('h menu laterale: ' + hMenuLaterale+'\n wBodyIPatient: '+wBodyIPatient + '\n hFiltroDatiLabo: ' + hFiltroDatiLabo + '\n hTabIntDatiLabo: ' + hTabIntDatiLabo);
			if ($('#divDati').length > 0){
				
				var height 		= parent.parent.$('#divBody').height() - parent.$('#divMenu').height();
				var widthDati	= $(document).width() - (document.getElementById('divDati').offsetLeft + 4);

				parent.$('#iframeGriglia').css({'height':hMenuLaterale-(hFiltroDatiLabo+4)});
				$('#divWrapper').css({'height' : hMenuLaterale-(hFiltroDatiLabo)});
				$('#divLeft').css({'height' : (hMenuLaterale - hFiltroDatiLabo) - (hTabIntDatiLabo+8)});		
				$('#divDati').css({'height' : (hMenuLaterale - hFiltroDatiLabo) - (hTabIntDatiLabo+8),'width': + widthDati});
				
			}
		
		},
		
		
		setAltezzaCol:function(){
			
			document.all.tabellaBloc.rows[0].style.height=(document.all.tabellaInt.rows[0].offsetHeight-4)+'px';
			
			// per certe versioni di ie8 il padding viene considerato
			if(document.all.tabellaBloc.rows[0].offsetHeight<document.all.tabellaInt.rows[0].offsetHeight){
				document.all.tabellaBloc.rows[0].style.height=(document.all.tabellaInt.rows[0].offsetHeight)+'px';
			}
			
			// risetto la larghezza delle  colonne di sinistra
			for (var i=0;i<document.all.tabellaBloc.rows[0].cells.length;i++){
				document.all.tabellaBloc.rows[0].cells[i].style.width=(document.all.tabellaLeft.rows[1].cells[i].offsetWidth-5)+'px';		
			}
	
			// risetto la larghezza delle  colonne di destra
			for (var i=0;i<document.all.tabellaInt.rows[0].cells.length;i++){
				document.all.tabellaInt.rows[0].cells[i].style.width=(document.all.datiTable.rows[1].cells[i].offsetWidth-5)+'px';		  
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
		
		apriReferto : function(idenTestata){
			
			// .split('|')[1].substring(0,2) == 'EX'
			if(idenTestata.toString().lastIndexOf('|') > 0)
				var url = "servletGenerator?KEY_LEGAME=VISDOC&identificativoEsterno="+idenTestata.split('|')[1].replace("'","");			 	
			else
				var url = "servletGenerator?KEY_LEGAME=VISDOC&identificativoEsterno=WHALE"+idenTestata;			 	
		 	
			var finestra = window.open (url,'','fullscreen=yes, scrollbars=no');
		    try{
		    	WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
				}
		    catch(e){}
		},

		visualizzaMicrobiologia : function(vRichiesta,vProgrAnalisi,vProgrAnalisiPr,title){

			var rs=top.executeQuery("datiStrutturatiLabo.xml","getDatiMicrobiologia",[vRichiesta,vProgrAnalisi,vProgrAnalisiPr]);
			var vObj =top.$('<div></div>').attr("id","divMain"); 
			var vObjGerme =''; 
			var vObjTable =''; 
			
			var germeOld='';
			while(rs.next()){
			 if(germeOld!=rs.getString("GERME")){
				 //se è già stato processato un germe con la relativa tabella lo appendo
				 if (germeOld!=''){
					 vObj.append(vObjGerme).append(vObjTable);	 
				 }
				 vObjGerme=top.$('<DIV></DIV>').attr('class','divGerme').text('GERME: '+rs.getString("GERME"));
				 vObjTable= top.$('<table></table>').attr('class','tableAntibio');
				 vObjTable.append(
							top.$('<tr></tr>')
							.append(top.$('<th></th>').text('ANTIBIOTICI'))	
							.append(top.$('<th></th>').text('MIC'))	
							.append(top.$('<th></th>').text('')));
				 
			 }
		 
				vObjTable.append(
						top.$('<tr></tr>')
						.append(top.$('<td></td>').text(rs.getString("ANTIBIOTICO")))	
						.append(top.$('<td></td>').text(rs.getString("MIC")))	
						.append(top.$('<td></td>').text(rs.getString("RISULTATORSI")))	
				);	
				germeOld=rs.getString("GERME");
				
			}
			vObj.append(vObjGerme).append(vObjTable).append(top.$('<DIV></DIV>').attr('class','divLegenda').text('S: Ceppo sensibile, R: Ceppo resistente, I: Risposta Intermedia'));
			
		
			top.Popup.append({
				title:'ANALISI: '+title,
				obj:vObj,
				width:450,
				height:500,
				position:[event.clientX,event.clientY+80]
			});
		
		},
		
		grafLabWhale : function(obj){
			
			function setParam(){
				
				this.pCodiceEsame	= obj.codiceEsame;
				this.pNosologico	= obj.elencoNosologici;
				this.pIdenRichiesta	= obj.idenRichiesta;
				this.pIdPaziente	= obj.idPaziente;
				this.pMateriale		= obj.materiale;
				this.pDataAcc		= $('table#tabellaInt tr td:last-child').attr('DATA_RICHIESTA');
				this.pCodProRep		= $('input#codProRep').val();
					
				var elencoTestate	= '';
				$('#tabellaInt td').each(function(index, value){				  
					elencoTestate	= elencoTestate != '' ? elencoTestate += ',' : elencoTestate;
					elencoTestate	+= "'"+$(this).attr('IDEN_RICHIESTA').split('|')[0].replace("'","")+"'";
				});	
				
				this.pElencoRichieste= elencoTestate;
		
				//passo questi parametri solo nel caso ci siano gli esami di ps
				if($('input#datiPs').val()=='S' && obj.idenRichiesta=='' && parent._PROV_CAHIAMATA == 'CARTELLA'){
					this.pCognome	= $('input#cognome').val();
					this.pNome		= $('input#nome').val();
					this.pSesso		= $('input#sesso').val();
					this.pCodFisc	= $('input#codfisc').val();
					this.pDataNasc	= $('input#datanasc').val();
				}
			}
			
			var param = new setParam();
			alert('elencoTestate: '+ param.pElencoRichieste)
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
				document.onmousedown=nrcNS;
			}else{
				document.onmouseup=nrcNS;
				document.oncontextmenu=nrcIE;
			}
			document.oncontextmenu=new Function("return false");
		
		}
		
	}
};