var _V_DATI			= null;
var _BUTTON			= null;

//var WindowCartella = null;
//jQuery(document).ready(function(){
//
//    window.WindowCartella = window;
//    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
//        window.WindowCartella = window.WindowCartella.parent;
//    }
//    window.baseReparti = WindowCartella.baseReparti;
//    window.baseGlobal = WindowCartella.baseGlobal;
//    window.basePC = WindowCartella.basePC;
//    window.baseUser = WindowCartella.baseUser;
//	
//	_V_DATI	= WindowCartella.getForm();
////	DATI_STRUTTURATI_ALLEGA.init();
//	 
//});


function caricaDati(){
	_V_DATI	= WindowCartella.getForm();
	// Verifico La Presenza di Dati Inseriti Manualmente
	var vResp = WindowCartella.executeStatement("datiStrutturatiLabo.xml","checkDatiManuali",[_V_DATI.iden_anag,_V_DATI.ricovero],1);

	if(vResp[0]=='KO')
		return alert('Select In Errore: \n' + vResp[1]);	
	
	if (vResp[2] > 0)
		alert('Per il Paziente in Esame sono Presenti Dati di Laboratorio Inseriti Manualmente. Per Visualizzarli Spostarsi nella Sezione Dedicata "Dati di Laboratorio"');

//	var ricovero	=	(_V_DATI.ricovero && _V_DATI.prericovero) != '' ? elenco = _V_DATI.ricovero + ',' + _V_DATI.prericovero : _V_DATI.ricovero;
	
	// Preparo la Chiamata
	url = 'servletGeneric?class=cartellaclinica.cartellaPaziente.datiStrutturatiLabo.listDocumentLaboratorioLettera&reparto=' + _V_DATI.reparto + '&provChiamata=CARTELLA&provRisultati=INT,PS,EST&idPatient=' + _V_DATI.idRemoto;

	switch (WindowCartella.FiltroCartella.getLivelloValue())
	{
		case 'ANAG_REPARTO': 	
			url += '&modalita=PAZIENTE_REPARTO';
			break;
		
		case 'IDEN_VISITA':			
		case 'NUM_NOSOLOGICO':
			
			url += '&modalita=RICOVERO';
			if  (_V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == ""){
				if (WindowCartella.getRicovero("DEA_STR")==null || WindowCartella.getRicovero("DEA_STR")==""){
					_V_DATI.nosologico = _V_DATI.ricovero;
				}else{
					_V_DATI.nosologico = _V_DATI.ricovero + ','+  WindowCartella.getRicovero("DEA_STR")+"-"+WindowCartella.getRicovero("DEA_ANNO")+"-"+WindowCartella.getRicovero("DEA_CARTELLA");
				}
			}else{
				_V_DATI.nosologico= _V_DATI.ricovero + ','+  _V_DATI.prericovero;
			}
			url +='&nosologico=' + _V_DATI.nosologico;				
			
//			if(_V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == "")
//				url += '&nosologico=' + _V_DATI.ricovero;
//			else
//				url += '&nosologico=' + _V_DATI.ricovero + ',' + _V_DATI.prericovero;
			
			break;
	}
	$('#divTabLaboratorio').load(url,function(){
		/*Sulla url, carico tutti i valori*/
		_BUTTON = $("span#btnAllegaDatiLabo");
//		DATI_STRUTTURATI_ALLEGA.init();
		if($('#tabRisultatiLabo').length > 0){
			
			DATI_STRUTTURATI_ALLEGA.STYLES.setgenericStyle();
			DATI_STRUTTURATI_ALLEGA.EVENTS.setGenericEvents();
			DATI_STRUTTURATI_ALLEGA.EVENTS.enableCheckLabel();
			DATI_STRUTTURATI_ALLEGA.de_seleziona_all($('#checkAll')[0]);
			
			if(_ALLEGATO_DATI_LABO.allegato == 'S'){				
				DATI_STRUTTURATI_ALLEGA.change_label_button();
				DATI_STRUTTURATI_ALLEGA.check_richieste();
				DATI_STRUTTURATI_ALLEGA.check_esami();
				DATI_STRUTTURATI_ALLEGA.dis_abilita_selezionamento();				
			}
			
		}else{
			DATI_STRUTTURATI_ALLEGA.STYLES.hideOptionAllega();
		}
        
        if (_ALLEGATO_DATI_LABO.SETTINGS.FUNZIONE_ATTIVA =='VISITA_ANESTESIOLOGICA')
            DATI_STRUTTURATI_ALLEGA.STYLES.hideOptionAllega();
	});
	
	

};

var DATI_STRUTTURATI_ALLEGA = {
	
	init : function(){
		_ALLEGATO_DATI_LABO.parametroStampa = $('input[name="allegaDatiStr"]').val();
		DATI_STRUTTURATI_ALLEGA.setAllegato($('input[name="allegaDatiStr"]').val().split('#')[0]);
		
		if(_ALLEGATO_DATI_LABO.allegato == 'S'){
			
			_ALLEGATO_DATI_LABO.elencoTestate 	= $('input[name="allegaDatiStr"]').val().split('#')[1];
			_ALLEGATO_DATI_LABO.elencoEsami 	= $('input[name="allegaDatiStr"]').val().split('#')[2];
		}	
	},
	
	EVENTS : {
		
		setGenericEvents : function(){
			
			// Set Hendler Button Allega
			_BUTTON.click(function(){
				
				DATI_STRUTTURATI_ALLEGA.setAllegato();	
				DATI_STRUTTURATI_ALLEGA.change_label_button();
				DATI_STRUTTURATI_ALLEGA.get_concat_iden();
				DATI_STRUTTURATI_ALLEGA.get_concat_id_esami();			
				DATI_STRUTTURATI_ALLEGA.add_remove_dicitura();			
				DATI_STRUTTURATI_ALLEGA.setInputConcatIden();			
				DATI_STRUTTURATI_ALLEGA.dis_abilita_selezionamento();
				
			});	
		
		},
	
		enableCheckLabel : function(){
			
			if(_ALLEGATO_DATI_LABO.allegato == 'N'){

				$('label.lblCheckRichiestaPrestazione').each(function(){					
					$(this).click(function(){
						if($(this).prev().is(':checked'))
							$(this).prev().attr('checked', false);
						else
							$(this).prev().attr('checked', true);					
					});
			
				});
				
			}else{
				
				$('label.lblCheckRichiestaPrestazione').each(function(){				
					$(this).unbind('click');		
				});
			
			}
			
		}
		
	},
	
	STYLES : {
	
		setgenericStyle : function(){
		
			// Hide Vecchia Intestazione
			$('.divFiltroLaboratorio div:first-child').hide();
			
			// Disabilito I Vecchi CheckBox
			$('#chkTabLaboBordi').attr('disabled', true);
			$('#chkTabLaboGruppi').attr('disabled', true);
			// alert(0);
			$('.colEsameSingolo label.lblCheckRichiestaPrestazione').each(function(){
				$(this).text('- ' + $(this).text()).css({'margin-left' : '5px'});
				
			});
		},
		
		hideOptionAllega : function(){
		
			$('.divFiltroLaboratorio').hide();
		}		
	
	},
	
	// Set S o N Allegato
	setAllegato : function(valAllegato){
	
		if(typeof valAllegato != 'undefined')
			_ALLEGATO_DATI_LABO.allegato	= valAllegato;
		else{
			if(_ALLEGATO_DATI_LABO.allegato == 'S')
				_ALLEGATO_DATI_LABO.allegato	= 'N';
			else
				_ALLEGATO_DATI_LABO.allegato	= 'S';
		}		
	
	},
	
	// Set label Button aLLEGA
	change_label_button : 	function(){
		
		if(_ALLEGATO_DATI_LABO.allegato == 'S')
			_BUTTON.text('Togli Allegato');
		else
			_BUTTON.text('Allega');

	},
	
	// Add Dicitura in Sezione Accertamenti Eseguiti
	add_remove_dicitura : function(){
		
		var dicturaAllega 	= '<p id="legendaAllegati"><strong>per i dati strutturati di laboratorio vedere allegato</strong></p>';
        var str 			= tinyMCE.get("idAccertamentiEseguiti").getContent();

		if (_ALLEGATO_DATI_LABO.allegato =='S'){
			
			str += dicturaAllega;
            tinyMCE.get("idAccertamentiEseguiti").setContent('');					
            tinyMCE.get("idAccertamentiEseguiti").setContent(str);
			
		}else{
			
			try{	
					var re = new RegExp(dicturaAllega);
					str = str.replace(re,'');
					tinyMCE.get("idAccertamentiEseguiti").setContent('');					
					tinyMCE.get("idAccertamentiEseguiti").setContent(str);
					
			}catch(e){};
		}

		WindowCartella.DatiNonRegistrati.set(true);
				
	},
	
	// Check Input Testata
	check_richieste : function(){			

		var arrayIdenTestata	= _ALLEGATO_DATI_LABO.elencoTestate.split(',');
		
		// Uncheck All Input		
		$('.chkIdenTestata').each(function(){			
			$(this).attr('checked', false);	
		});

		// Check Salvati			
		for (var i=0; i<arrayIdenTestata.length;i++)			
			$('#R' + arrayIdenTestata[i] ).attr('checked', true);

		
	},
	
	// Check Input Prestazione
	check_esami : function(){
		
		var arrayIdenEsami	= _ALLEGATO_DATI_LABO.elencoEsami.split(',');	
		$('.chkIdEsameSingolo').each(function(){			
			$(this).attr('checked', false);	
		});

		for (var i=0; i < arrayIdenEsami.length; i++){
			$('input[id="'+arrayIdenEsami[i]+'"]').each(function(idx){	
				$(this).attr('checked', true);	
			});
		}	
	},
	
	// Set Obj Allegato Dati Laboratorio 
	setInputConcatIden : function(concatIdenTestata, concatIdEsami){
			
		_ALLEGATO_DATI_LABO.parametroStampa	= _ALLEGATO_DATI_LABO.allegato + '#' + _ALLEGATO_DATI_LABO.elencoTestate + '#' + _ALLEGATO_DATI_LABO.elencoEsami;
				
		// Controlli Selezione Esami/Testate
		if(_ALLEGATO_DATI_LABO.allegato == 'S'){
			
			if(_ALLEGATO_DATI_LABO.elencoTestate.length > 1 && _ALLEGATO_DATI_LABO.elencoEsami.length < 1){
				
				alert('L\' Allegato NON contiene Esami. Prego Ricontrollare la Selezione');
				DATI_STRUTTURATI_ALLEGA.setAllegato('N');
				DATI_STRUTTURATI_ALLEGA.change_label_button();
				DATI_STRUTTURATI_ALLEGA.EVENTS.enableCheckLabel();
				DATI_STRUTTURATI_ALLEGA.add_remove_dicitura();
				
			}else if(_ALLEGATO_DATI_LABO.elencoTestate.length < 1 && _ALLEGATO_DATI_LABO.elencoEsami.length > 1){
				
				alert('L\' Allegato NON contiene Richieste. Prego Ricontrollare la Selezione');
				DATI_STRUTTURATI_ALLEGA.setAllegato('N');
				DATI_STRUTTURATI_ALLEGA.change_label_button();
				DATI_STRUTTURATI_ALLEGA.EVENTS.enableCheckLabel();
				DATI_STRUTTURATI_ALLEGA.add_remove_dicitura();
				
			}else if(_ALLEGATO_DATI_LABO.elencoTestate.length < 1 && _ALLEGATO_DATI_LABO.elencoEsami.length < 1){
				
				alert('L\' Allegato NON contiene ne Richieste ne Prestazioni. Prego Ricontrollare la Selezione');
				DATI_STRUTTURATI_ALLEGA.setAllegato('N');
				DATI_STRUTTURATI_ALLEGA.change_label_button();
				DATI_STRUTTURATI_ALLEGA.EVENTS.enableCheckLabel();
				DATI_STRUTTURATI_ALLEGA.add_remove_dicitura();
			
			}
			
		}			
		
	},
	
	// Set Richieste Selezionate
	get_concat_iden : function(timeOfAction){

		var concatIdenTestata	= '';
		
		$('.chkIdenTestata').each(function(){			
			
			if($(this).attr('checked')){				
				concatIdenTestata	=	concatIdenTestata != '' ? concatIdenTestata += ',' : concatIdenTestata = concatIdenTestata;
				concatIdenTestata += $(this).attr('iden_testata');
			}
				
		});
		
		_ALLEGATO_DATI_LABO.elencoTestate	= concatIdenTestata;

	},
		
	// Set Prestazioni Allegate
	get_concat_id_esami : function(){

		var concatIdenEsami		= '';

		$('.chkIdEsameSingolo').each(function(){						
			
			if($(this).attr('checked')){					
				concatIdenEsami	=	concatIdenEsami != '' ? concatIdenEsami += ',' : concatIdenEsami = concatIdenEsami;
				concatIdenEsami += $(this).attr('id');					
			}
				
		});
		
		_ALLEGATO_DATI_LABO.elencoEsami	= concatIdenEsami;

	},	
	
	// Seleziono o Deseleziono Tutto
	de_seleziona_all :function(obj){

		if(obj.checked){
				
			$('.chkIdenTestata').each(function(){			
				$(this).attr('checked', true);	
			});

			$('.chkIdEsameSingolo').each(function(){			
				$(this).attr('checked', true);	
			});
		
		}else{
				
			$('.chkIdenTestata').each(function(){			
				$(this).attr('checked', false);	
			});

			$('.chkIdEsameSingolo').each(function(){			
				$(this).attr('checked', false);	
			});
		}

		
	},
	// Se Allegato Attivo Disabilito la Spunta
	dis_abilita_selezionamento : function(){
		
		if(_ALLEGATO_DATI_LABO.allegato == 'S'){
			
			$('#checkAll').attr('disabled', true);	
				
			$('.chkIdenTestata').each(function(){			
				$(this).attr('disabled', true);	
			});

			$('.chkIdEsameSingolo').each(function(){			
				$(this).attr('disabled', true);	
			});
			
		}else{
			
			$('#checkAll').attr('disabled', false);
			
			$('.chkIdenTestata').each(function(){			
				$(this).attr('disabled', false);	
			});

			$('.chkIdEsameSingolo').each(function(){			
				$(this).attr('disabled', false);	
			});		
			
		}
		DATI_STRUTTURATI_ALLEGA.EVENTS.enableCheckLabel();
		
	},
	
	getCodEsaByIden : function(){
		if (_ALLEGATO_DATI_LABO.elencoEsami == '')
			return;
		
/*		var vResp = WindowCartella.executeStatement("datiStrutturatiLabo.xml","insertCodEsaByIdenToTabWork",[_ALLEGATO_DATI_LABO.elencoEsami],1);

		if(vResp[0] == 'KO')
			return alert('Select Cod_Dec Esami Allegato Lettera In Errore: \n' + vResp[1]);	
		
		_ALLEGATO_DATI_LABO.elencoEsamiCodici	= vResp[2]

		return _ALLEGATO_DATI_LABO.elencoEsamiCodici; */
		
		var pBinds = new Array();
		pBinds.push(_ALLEGATO_DATI_LABO.elencoTestate );	
		pBinds.push(_ALLEGATO_DATI_LABO.elencoEsami );	
		pBinds.push(WindowCartella.baseUser.LOGIN );
		pBinds.push(WindowCartella.FiltroCartella.getIdenRiferimento(WindowCartella.getForm(document)));				
		var vResp = WindowCartella.executeStatement("datiStrutturatiLabo.xml","insertCodEsaByIdenToTabWork",pBinds,1);

		if(vResp[0] == 'KO')
			return alert('Insert su tab_work non riuscito: \n' + vResp[1] + '---' +vResp[2]);	

		return vResp[2]; 
	}
		
};