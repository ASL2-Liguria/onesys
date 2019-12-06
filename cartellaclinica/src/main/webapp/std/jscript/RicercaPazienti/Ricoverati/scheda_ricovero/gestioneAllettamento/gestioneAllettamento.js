var WindowHome 			= null;

jQuery(document).ready(function(){

	window.WindowHome = window;
	while((window.WindowHome.name != 'Home' /*|| window.WindowHome.name != 'schedaRicovero'*/) && window.WindowHome.parent != window.WindowHome){	
		window.WindowHome = window.WindowHome.parent;
    }

	switch(WindowHome.name){
		case 'Home':
		    window.baseReparti 	= WindowHome.baseReparti;
		    window.baseGlobal 	= WindowHome.baseGlobal;
		    window.basePC 		= WindowHome.basePC;
		    window.baseUser 	= WindowHome.baseUser;
		    break;
		case 'schedaRicovero':
		    window.baseReparti 	= WindowHome.baseReparti;
		    window.baseGlobal 	= WindowHome.baseGlobal;
		    window.basePC 		= WindowHome.basePC;
		    window.baseUser 	= WindowHome.baseUser;
		    break;
		default:
		try{
		    window.baseReparti 	= opener.top.baseReparti;
	    	window.baseGlobal 	= opener.top.baseGlobal;
	    	window.basePC 		= opener.top.basePC;
	    	window.baseUser 	= opener.top.baseUser;
			}catch(e){
		    window.baseReparti 	= top.baseReparti;
	    	window.baseGlobal 	= top.baseGlobal;
	    	window.basePC 		= top.basePC;
	    	window.baseUser 	= top.baseUser;				
			}			
	}
	
	NS_ALLETTAMENTO_STANZE_LETTI.init();
	NS_ALLETTAMENTO_STANZE_LETTI.setEvents();	
	NS_FORM_RICERCA_ALLETTATI.init();
	NS_FORM_RICERCA_ALLETTATI.setEvents();

});

/*Name Space per l'apertura delle stanze*/
var NS_ALLETTAMENTO_STANZE_LETTI = {
	init:function(){
		/*Tooltip*/
		$(".buttonInfoStanza").attr("title","Click per Visulizzare la Lista Degenti\nDoppio Click Per Visualizzare i Letti");
		$(".stanza").attr("title","Doppio Click Per Visualizzare i Letti");
		$('.lettoLibero').attr("title","Numero Letti Occupati");
		$('.lettoOccupato').attr("title","Numero Letti Occupati");
		$('.rimuoviAllettato').attr("title","Libera Letto");				
		
		$('#divTitleBarra').text("Lista Reparti:");
		
		$('#selBarraReparto').change(function(){
			NS_ALLETTAMENTO_STANZE_LETTI.cambiaStanza($('#selBarraReparto option:selected').val());
	    });
		
		$('.buttonBarraBack').click(function(){
			NS_ALLETTAMENTO_STANZE_LETTI.cambiaStanza($('#iden_gruppo').val());
		});			
		
		$('.stanza').each(function(){
			$(this).dblclick(function(e){
					NS_ALLETTAMENTO_STANZE_LETTI.apriStanza($(this).attr('iden_gruppo'),$(this).attr('id'));
	            });		
			});

		
		$('span.rimuoviAllettato').click(function(){
			NS_FCN_ALLETTAMENTO.rimuovi($(this).closest('div .letto').attr('id'))
		});
		
		//Ridimensiona Div container e body della pagina
		parent.$('#iframe_main').css('overflow-y','hidden');
		var altezzaIframeMain = parent.$('#iframe_main').innerHeight();		
		$('#divContainer').css('height',altezzaIframeMain-25);
		$('body').css({'height':$('#divContainer').innerHeight(),'overflow-y':'hidden'});			
		//Ridimensiona Div wrapper e div extra		
		var heightWrapper = altezzaIframeMain - ($('#divHeader').innerHeight() + $('#divFooter').innerHeight());
		$('#divWrapper').css('height',heightWrapper);
		var divExtra = altezzaIframeMain - ($('#divHeader').innerHeight() + $('#divNavigation').innerHeight() + $('#divFooter').innerHeight());
		$('#divExtra').css('height',divExtra);
	},
	
	setEvents:function(){
		$('#divButtonBackWkRicoverati').text("Ricerca Ricoverati")
		$('#divButtonBackWkRicoverati').click(function(){
			/*Richiama la wk da richiamare*/
			eval('WindowHome.'+$(this).attr('wkToRecall'));		
		});
		
		$('.stanza, .letto').droppable({
			tolerance: "pointer",
			drop: function( ev, ui ) {
				
				if ($(this).children(":first").hasClass('titoloStanza_piena')){
					alert('Stanza occupata. Impossibile allettare il paziente.');
					return;
				}
				
				var tipologiaStanza = $(this).attr('tipologiaStanza');		
				
				if ($(this).hasClass('letto'))
				{
					if ($(this).children(":first").hasClass('titoloLetto_occupato')){
						alert('Letto occupato. Impossibile allettare il paziente.');
						return;
					}
					NS_FCN_ALLETTAMENTO.alletta({	
						'sesso':			ui.draggable.attr("sesso"),
						'tipologiaStanza':	tipologiaStanza,
						'idenVisita':		ui.draggable.attr("iden_visita"),
						'idenLetto':		$(this).attr('id'),
						'daStanza':			false
						});
				}
				else
				{
					var msg = '';
					if ((tipologiaStanza =='DONNE' && ui.draggable.attr("sesso")=='M') ||(tipologiaStanza=='UOMINI' && ui.draggable.attr("sesso")=='F')){
						msg = 'Si e\' scelta una stanza/letto non idonea per il paziente, per continuare scegliere il letto fra quelli dispohnibili:';
					}else{
						msg = 'Cliccare per scegliere il letto nel quale allettare il paziente:';
					}
					
					$('#divContent').append(
						$('<div id="divLettiInfo" class="divLettiInfo" title="Scelta Letto">'+msg+'</div>')
					);
		
					var arrayLettiLiberi = NS_FCN_ALLETTAMENTO.retrieveLettiLiberi({'iden_stanza':$(this).attr('id')});
					var btns = new Array();
					for (var i in arrayLettiLiberi){
						btns.push({
									text: arrayLettiLiberi[i].descrLetto,
									"id":"btnIdLetto"+arrayLettiLiberi[i].idenLetto,
									"idLetto" : arrayLettiLiberi[i].idenLetto,
									"descrLetto" : arrayLettiLiberi[i].descrLetto,									
									click: function (e) {								
										NS_FCN_ALLETTAMENTO.alletta({	
												'sesso':			ui.draggable.attr("sesso"),
												'tipologiaStanza':	tipologiaStanza,
												'idenVisita':		ui.draggable.attr("iden_visita"),
												'idenLetto':		$(e.target).attr('idLetto'),
												'daStanza':			true
											});
										$( "#divLettiInfo" ).dialog( "close" )	
									}
								})	
					}

					$('#divLettiInfo').dialog({
						position:	{ my: "bottom center", at: "right bottom", of: $(this) },
						buttons: btns
								
					});
				}
			}
        });
		
		$('.buttonInfoStanza').click(function(){
			$('#divContent').append(
				$('<div id="wkPatientInStanza" class="wkPatientInStanza"></div>')
					.append(NS_INFO_PATIENT.creaTableWkPatientInfo($(this)))
					.attr('title','Dettaglio Stanza: '+$(this).parent().parent().find('div#titoloStanza').text())
				);
			$('#wkPatientInStanza').dialog({
				position:	{my: "left bottom", at: "right bottom", of: $(this) }
			});
		});
	},
	
	
	cambiaStanza:function(idenGruppo){
		var apriWk			= $('input#apriDaWk').val();
		var codCdcReparto 	= $('#idRepDegenza option:selected').val();	
		if (apriWk=='undefined')
			document.location.replace('servletGeneric?class=cartellaclinica.gestioneAllettamento.SrvAllettamento&iden_gruppo='+idenGruppo+'&repdegenza='+codCdcReparto);
		else
			document.location.replace('servletGeneric?class=cartellaclinica.gestioneAllettamento.SrvAllettamento&iden_gruppo='+idenGruppo+'&repdegenza='+codCdcReparto+'&apriDaWk='+apriWk);		
	},
	
	apriStanza:function(idenGruppo,idenStanza){
		var apriWk			= $('input#apriDaWk').val();
		var codCdcReparto 	= $('#idRepDegenza option:selected').val();	
		if (apriWk=='undefined'){
			document.location.replace('servletGeneric?class=cartellaclinica.gestioneAllettamento.SrvAllettamento&iden_gruppo='+idenGruppo+'&idenStanza='+idenStanza+'&repdegenza='+codCdcReparto);
		}else{	
			document.location.replace('servletGeneric?class=cartellaclinica.gestioneAllettamento.SrvAllettamento&iden_gruppo='+idenGruppo+'&idenStanza='+idenStanza+'&repdegenza='+codCdcReparto+'&apriDaWk='+apriWk);}			
	},
	
	refreshaStanza:function(){
		var apriWk			= $('input#apriDaWk').val();
		var idenGruppo 		= $('input#iden_gruppo').val();
		var idenStanza 		= $('input#idenStanza').val();
		var codCdcReparto 	= $('#idRepDegenza option:selected').val();	
		if (apriWk=='undefined'){			
			document.location.replace('servletGeneric?class=cartellaclinica.gestioneAllettamento.SrvAllettamento&iden_gruppo='+idenGruppo+'&idenStanza='+idenStanza+'&repdegenza='+codCdcReparto);			
		}else{
			document.location.replace('servletGeneric?class=cartellaclinica.gestioneAllettamento.SrvAllettamento&iden_gruppo='+idenGruppo+'&idenStanza='+idenStanza+'&repdegenza='+codCdcReparto+'&apriDaWk='+apriWk);					
		}
	}
};


var NS_FORM_RICERCA_ALLETTATI = {
	init:function(){
		$("#idCognome").focus();
		$('#idData').datepick({onClose: function(){jQuery(this).focus();}, showOnFocus: false,  showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});
		$('#idAlle').attr('checked','true');
		
		if (typeof document.getElementById("codCdcReparto")=='object'){
			$('#idRepDegenza option[value="'+$('input#codCdcReparto').val()+'"]').prop('selected', true);			
		}

		if (typeof $('#nome').val()=="undefined")
			$('#idNome, #idCognome, #idCodFisc, #idData').parent().parent().hide();
		
		$(".formTrTitle").attr("title","Cliccare per aprire la ricerca avanzata");
		
		try {
			var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
			oDateMask.attach(document.getElementById("idData"));
		}catch(e){
			alert('Applicazione maschera data in errore: '+e.description);
		}		
	},
	
	setEvents:function(){
		$('#idNome, #idCognome, #idCodFisc').blur(function(){
    		this.value = this.value.toUpperCase();
		}).keypress(function(e){
			if (e.keyCode==13){
				this.value = this.value.toUpperCase();
			}
		});

		
		$('#idRicerca').click(function(){
			$('#divExtra').html(""); 
			NS_WK_PAZIENTI.creaWKPazienti($('#idAlle').is(':checked')); 
		});
		
		$(document).keypress(function(e) {
			if (e.keyCode == 13){
				$('#divExtra').html("");
				NS_WK_PAZIENTI.creaWKPazienti($('#idAlle').is(':checked'));
			}
		});
			
		$('#idResetta').click(function(){
			NS_FORM_RICERCA_ALLETTATI.resetCampi();
		});
		
		$(".formTrTitle").click(function(){
				$('#idNome, #idCognome, #idCodFisc, #idData').parent().parent().toggle();
		});

		NS_WK_PAZIENTI.creaWKPazienti($('#idAlle').is(':checked'));		
		
		$('#idRepDegenza').change(function(){
			$('#divExtra').html(""); 
			NS_WK_PAZIENTI.creaWKPazienti($('#idAlle').is(':checked'));
	    });		
		


	},
	
	resetCampi:function(){
		$('#idNome').val("");
		$('#idCognome').val("");
		$('#idData').val("");
		$('#idCodFisc').val("");				
	}
};


var NS_FCN_ALLETTAMENTO = {
	pStatementFile:'CCE_gestioneAllettamento.xml',

	retrieveLettiLiberi:function(pParam){
		var ret = new Array();
		var vRs = WindowHome.executeQuery(NS_FCN_ALLETTAMENTO.pStatementFile,"allettamento.retrieveLettiLiberi",[pParam.iden_stanza]);	
		while (vRs.next()){
			ret.push({"idenLetto":vRs.getString("iden"),"descrLetto":vRs.getString("descrizione")})	
		}
		return ret;
	},
	
	alletta:function(pParam){
		/*
				[tipologiaStanza],
				[sesso]: sesso del paziente,
				[idenVisita],
				[idenLetto],		
				[daStanza]: parametro per indicare se il paziente viene allettato dal letto o dalla stanza,
		*/
		if (pParam.daStanza){
			var vResp = WindowHome.executeStatement(NS_FCN_ALLETTAMENTO.pStatementFile,"allettamento.alletta_paziente_in_letto",[pParam.idenVisita,pParam.idenLetto],1);	
			if (vResp[0] == 'KO') 
			{
				alert("Errore nell'allettamento del paziente"+vResp[1]);
			} else {
				if(vResp[2]!=' '){
		    		alert(vResp[2]);
		    	}
					NS_ALLETTAMENTO_STANZE_LETTI.cambiaStanza($('input#iden_gruppo').val());
			}		
		
		}
		else{
			if (NS_FCN_ALLETTAMENTO.controllaSessoAllettato(pParam.tipologiaStanza,pParam.sesso))
			{
				var vResp = WindowHome.executeStatement(NS_FCN_ALLETTAMENTO.pStatementFile,"allettamento.alletta_paziente_in_letto",[pParam.idenVisita,pParam.idenLetto],1);	
				if (vResp[0] == 'KO') 
				{
					alert("Errore nell'allettamento del paziente"+vResp[1]);
				} else {
					if(vResp[2]!=' '){
			    		alert(vResp[2]);
			    	}
						NS_ALLETTAMENTO_STANZE_LETTI.refreshaStanza();
				}
			}
		}
	},
	
	controllaSessoAllettato:function(tipologiaStanzaLetto,sessoAllettato){
		if ((tipologiaStanzaLetto =='DONNE' && sessoAllettato=='M') ||(tipologiaStanzaLetto=='UOMINI' && sessoAllettato=='F')){
			if (confirm('Si è scelta una stanza/letto non idonea per il paziente, continuare comunque?')){
				return true;				
			}else{
				return false;
			}
		}else{
			return true;
		}
	},
	
	rimuovi:function(pParam){
		var vResp = WindowHome.executeStatement(NS_FCN_ALLETTAMENTO.pStatementFile,"allettamento.rimuovi_paziente_da_letto",pParam);	
		if (vResp[0] == 'KO') {
        	alert("Errore nella procedura di rimozione: "+vResp[1]);
        } else {
			NS_ALLETTAMENTO_STANZE_LETTI.refreshaStanza();
        }
	}
};
