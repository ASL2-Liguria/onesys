var CONSENSO_UNICO = {
		
	init: function() {
			
		CONSENSO_UNICO.objWk 			= null;
				
		CONSENSO_UNICO.initWk();			
		CONSENSO_UNICO.setEvents();
	},
		
	initWk: function() {
		
		chkTipoConsenso.selectAll();
		var tipo_consenso = null;
		
		if(LIB.isValid($("#TIPO_CONSENSO").val())){
			tipo_consenso = $("#TIPO_CONSENSO").val();
			$("#h-chkTipoConsenso").closest("tr").hide();
		}else{
			tipo_consenso = $("#h-chkTipoConsenso").val();
		}

		tipo_consenso = "'" + tipo_consenso + "'";
		
		CONSENSO_UNICO.objWk = new WK({
			id 			: "WK_VERSIONI_CONSENSO_UNICO",
			container 	: "wkVersioniConsensoUnico",
			loadData	: true,
			aBind 		: ['patient_id', 'consensi', 'titolare_trattamento'],
			aVal 		: [$('#PATIENT_ID', '#EXTERN').val(), tipo_consenso, home.baseGlobal.TITOLARE_TRATTAMENTO_DEFAULT]
		});
			
		CONSENSO_UNICO.objWk.loadWk();
	},
		
	filterWk: function() {
		
		var tipo_consenso = null;
		
		if(LIB.isValid($("#TIPO_CONSENSO").val())){
			tipo_consenso = $("#TIPO_CONSENSO").val();
			$("#h-chkTipoConsenso").closest("tr").hide();
		}else{
			tipo_consenso = $("#h-chkTipoConsenso").val();
		}
		
		tipo_consenso = "'" + tipo_consenso + "'";
						
		CONSENSO_UNICO.objWk.filter({
			aBind 	: ['patient_id', 'consensi', 'titolare_trattamento'],
			aVal 	: [$('#PATIENT_ID', '#EXTERN').val(), tipo_consenso, home.baseGlobal.TITOLARE_TRATTAMENTO_DEFAULT]
		});
	},
		
	setEvents: function() {	
		
		$("#butCerca").on("click", function(){CONSENSO_UNICO.filterWk()});

		if(LIB.isValid($("#TIPO_CONSENSO").val())){
            NS_FENIX_SCHEDA.beforeClose = function(){
            	home.NS_GESTISCI_CONSENSI.getConsensiEsistenti();
            	return true;
            }; 
        }

		if (_LOGOUT_ON_CLOSE != 'N') {
            NS_FENIX_SCHEDA.beforeClose = function(){
                home.NS_FENIX_TOP.logout();
            }; 
        }
	},
    
    checkIfRevoked: function(data) {
    	if(data.REVOCA === 'N'){
    		CONSENSO_UNICO.visualizza(data);
    	}
    },   
	
	visualizza: function(data) {

    	home.NS_FENIX_PIC.print.preview("1", data.IDEN, $("#PATIENT_ID").val(), data.TIPO, null);
	}
};

var VERSIONI_CONSENSO_UNICO = {
	
	div			: null,
	frame		: null,
	document 	: null,	
	
	init : function() {
		
		/* Carico le variabili EXTERN */
		NS_FUNCTIONS.loadExtern();

		/* Se non ho l'iden dell'anagrafica chiamo la funzione gestAnag che me lo recupera */
		if (_PATIENT_ID == null) {

			NS_FUNCTIONS.gestAnag();

			/* Ricarico la pagina con la url completa */
			NS_FUNCTIONS.url.params.load();
			_URL_PARAMS += NS_FUNCTIONS.url.params.set('PATIENT_ID', _PATIENT_ID);
            _URL_PARAMS += NS_FUNCTIONS.url.params.set('ASSIGNING_AUTHORITY', home.baseGlobal.ASSIGNING_AUTHORITY);
			/*** alert(location.origin + location.pathname + _URL_PARAMS); ***/
			/*** alert("location.hash: " + location.hash + 
            "\nlocation.host: "	+ location.host +
            "\nlocation.hostname: "	+ location.hostname + 
            "\nlocation.href: " + location.href + 
            "\nlocation.origin: " + location.origin +
            "\nlocation.pathname: " + location.pathname + 
            "\nlocation.port: " + location.port +
            "\nlocation.protocol: " + location.protocol + 
            "\nlocation.search: " + location.search); ***/
			location.href = location.protocol + "//" + location.host + location.pathname + _URL_PARAMS;
		}else{
	        NS_FUNCTIONS.loadPatient();
		}		

        NS_FUNCTIONS.loadUser();
			
		home.VERSIONI_CONSENSO_UNICO 	= this;
		
		home.NS_CONSOLEJS.addLogger({name : 'VERSIONI_CONSENSO_UNICO', console : 0});
	    window.logger = home.NS_CONSOLEJS.loggers['VERSIONI_CONSENSO_UNICO'];
	    	    
		VERSIONI_CONSENSO_UNICO.setLayout();
	    	    
		VERSIONI_CONSENSO_UNICO.tabVersioni 	= $("#li-tabVersioni");
		VERSIONI_CONSENSO_UNICO.db 				= $.NS_DB.getTool({_logger : window.logger});
        
		VERSIONI_CONSENSO_UNICO.setEvents();
		VERSIONI_CONSENSO_UNICO.initTabs();
        
        $('div#VERSIONI_CONSENSO_UNICO div.headerTabs h2#lblTitolo').html(
            $('div#VERSIONI_CONSENSO_UNICO div.headerTabs h2#lblTitolo').html() + " di " + 
            _NOME + " " + _COGNOME + " nato a " + _COMUNE_NASCITA + " il " + _DATA_NASCITA.substring(6, 8) + "/" + _DATA_NASCITA.substring(4, 6) + "/" + _DATA_NASCITA.substring(0, 4) + " (CF: " + _CODICE_FISCALE + "; SESSO: " + _SESSO + ")"
        );
	},
	
	setEvents: function() {
		
		document.onselectstart = function() { return false; };

		VERSIONI_CONSENSO_UNICO.tabVersioni.one("click", CONSENSO_UNICO.init);	
		
		$('input').on('keyup', function(e) {
		    if (e.which == 13) {
		    	CONSENSO_UNICO.filterWk();
		    }
		});
	},
	
	setLayout: function() {
		
		$('#tabs-VERSIONI_CONSENSO_UNICO').hide();
				
		var x = 1000;
		var y = 400;
		
		// Centramento
		$('#dati').css('padding-top', (parent.$('body').height() / 2) - (y / 2));

		// Setto l'altezza
		$('.contentTabs').height(y);
		$('#wkVersioniConsensoUnico').height($('.contentTabs').height() - $('#fldVersioniInner').height() - 25);
		
		// Setto la larghezza
		$('#dati').width(x);
	},

	initTabs: function() {
		
		$(".ulTabs>li:first").trigger("click");
	},
	
	allegaConsenso: function(rec){
      	var consenso = {"IDEN" :rec[0].IDEN}; 
      	WK_RICERCA_ANAGRAFICA.allegato.allega(rec, consenso);
	},
		
	confermaCancellazioneConsenso: function(rec){
		
		var idenRevoca = rec[0].IDEN_MODULO_REVOCA;
		if(!LIB.isValid(idenRevoca)){
			
			var params = {
		            "title"	: "Attenzione",
		            "msg"	: "Procedere con la cancellazione del consenso?",
		            "cbkSi"	: function(){ VERSIONI_CONSENSO_UNICO.cancellaConsenso(rec[0].IDEN, null);}
		        }
			home.DIALOG.si_no(params);
		}else{
			
			VERSIONI_CONSENSO_UNICO.db.select({
	            id: 'MODULI_CONSENSO.CONTA_CONSENSI_PER_REVOCA',
	            datasource: 'PORTALE_PIC',
	            parameter:
	                    {
	            			patient_id: 			{v: rec[0].PATIENT_ID, t: 'V'},
	                        assigning_authority: 	{v: rec[0].ASSIGNING_AUTHORITY, t: 'V'},
	                        tipo: 					{v: rec[0].TIPO, t: 'V'},
	                        iden_modulo_revoca: 	{v: idenRevoca, t: 'N'},
	                        titolare_trattamento: 	{v: rec[0].TITOLARE_TRATTAMENTO, t: 'V'}
	                    }
	        }).done(function(resp) {
	        	
	            if(resp.result[0].CONSENSI_PER_REVOCA == 1){
	    			
	    			var params = {
	    		            "title"	: "Attenzione",
	    		            "msg"	: "Il consenso selezionato risulta revocato, proseguendo verrà cancellato sia il consenso sia la sua revoca. Procedere?",
	    		            "cbkSi"	: function(){ VERSIONI_CONSENSO_UNICO.cancellaConsenso(rec[0].IDEN, idenRevoca);}
	    		        }
	    			home.DIALOG.si_no(params);
	    			
	            }else if(resp.result[0].CONSENSI_PER_REVOCA > 1){
	    			
	    			var params = {
	    		            "title"	: "Attenzione",
	    		            "msg"	: "Il consenso selezionato risulta revocato e sono presenti consensi relativi alla medesima revoca, proseguendo verrà cancellato il solo consenso, si consiglia di verificare successivamente la correttezza della revoca. Procedere?",
	    		            "cbkSi"	: function(){ VERSIONI_CONSENSO_UNICO.cancellaConsenso(rec[0].IDEN, null);}
	    		        }
	    			home.DIALOG.si_no(params);
	    		}
	        });
		}
	},
	
	confermaCancellazioneRevoca: function(idenRevoca){
		
		var params = {
	            "title"	: "Attenzione",
	            "msg"	: "Procedere con la cancellazione della revoca?",
	            "cbkSi"	: function(){ VERSIONI_CONSENSO_UNICO.cancellaConsenso(idenRevoca, null);}
	        }
		home.DIALOG.si_no(params);
	},
	
	cancellaConsenso: function(idenConsenso, idenRevoca){
		
		VERSIONI_CONSENSO_UNICO.db.call_function(
				{
					id: 'CANCELLA_CONSENSO',
					datasource: 'PORTALE_PIC',
					parameter: {
						"p_iden_consenso" 	: {v: idenConsenso, t: 'N'},
						"p_user_iden_per" 	: {v: $("#USER_IDEN_PER").val(), t: 'N'}
						/*** _UTE_INS ***/
					}
				}
			).done(function(resp) {
				if (resp.p_result.indexOf('OK')==0) {
					home.NOTIFICA.success({
						'title'		: 'Success',
						'message'	: "Cancellato il consenso desiderato",
						'timeout'	: 5
					});
					var idenAttivo = resp.p_result.substr(2, resp.p_result.length);
					
					/*** Registro l'operazione su IMAGOWEB.TRACE_USER_ACTION ***/
					NS_FUNCTIONS.traceCancellaConsenso($("#PATIENT_ID").val(), idenConsenso);
					
			        NS_FUNCTIONS.callAjax.EVC([{"idenDettaglio": idenAttivo, "tabellaModulo": "PIC_MODULI_CONSENSO"}]);

					if (LIB.isValid(idenRevoca)) {
						VERSIONI_CONSENSO_UNICO.cancellaConsenso(idenRevoca, null);
					}else{
						CONSENSO_UNICO.objWk.refresh();
					}
				}else{
					home.NOTIFICA.error({
						'title'		: 'Attenzione',
						'message'	: "Impossibile cancellare il consenso desiderato",
						'timeout'	: 5
					});
				}
			}
		);
	},
		
	confermaRevocaConsenso: function(idenConsenso, tipo_consenso){

		var descr_consenso;

		switch (tipo_consenso) {

		case "CONSENSO_CANALE_VISIBILITA_MMG":
			descr_consenso = "CONSENSO CANALE VISIBILITA' per gli MMG";
			break;

		case "CONSENSO_UNICO":
			descr_consenso = 'CONSENSO UNICO';
			break;

		case "CAREGIVER_PAZIENTE":
			descr_consenso = 'CAREGIVER PAZIENTE';
			break;

		default:
			descr_consenso = 'CONSENSO';
			break;
		}
		
		var params = {
	            "title"	: "Attenzione",
	            "msg"	: "Attraverso la revoca il paziente NON avrà un " + descr_consenso + " attivo. Procedere con la REVOCA del consenso?",
	            "cbkSi"	: function(){VERSIONI_CONSENSO_UNICO.revocaConsenso(idenConsenso);}
	        }
		home.DIALOG.si_no(params);
	},
	
	revocaConsenso: function(idenConsenso){
		
		VERSIONI_CONSENSO_UNICO.db.call_function(
				{
					id: 'REVOCA_CONSENSO',
					datasource: 'PORTALE_PIC',
					parameter: {
						"p_iden_consenso" 	: {v: idenConsenso, t: 'N'},
						"p_user_iden_per" 	: {v: _UTE_INS, t: 'V'}
					}
				}
			).done(function(resp) {
				if (resp.p_result.indexOf('OK')==0) {
					home.NOTIFICA.success({
						'title'		: 'Success',
						'message'	: "Revocato il consenso desiderato",
						'timeout'	: 5
					});
					var idenRevocato = resp.p_result.substr(2, resp.p_result.length);
					
					/*** Registro l'operazione su IMAGOWEB.TRACE_USER_ACTION ***/
					NS_FUNCTIONS.traceRevocaConsenso($("#PATIENT_ID").val(), idenConsenso);
					
			        NS_FUNCTIONS.callAjax.EVC([{"idenDettaglio": idenRevocato, "tabellaModulo": "PIC_MODULI_CONSENSO"}]);
					CONSENSO_UNICO.objWk.refresh();
				}else{
					home.NOTIFICA.error({
						'title'		: 'Attenzione',
						'message'	: "Impossibile revocare il consenso desiderato",
						'timeout'	: 5
					});
				}
			}
		);
	},
		
	confermaCancellazioneAllegato: function(idenConsenso){
		
		var params = {
	            "title"	: "Attenzione",
	            "msg"	: "Procedere con la cancellazione dell'allegato?",
	            "cbkSi"	: function(){VERSIONI_CONSENSO_UNICO.cancellaAllegato(idenConsenso);}
	        }
        home.DIALOG.si_no(params);
	},
	
	cancellaAllegato: function(idenConsenso){
		
		var allegato = home.NS_FENIX_PIC.search.allegato(idenConsenso);
		var idenAllegato = allegato.IDEN;
		
		VERSIONI_CONSENSO_UNICO.db.call_function(
				{
					id: 'CANCELLA_ALLEGATO_CONSENSO',
					datasource: 'PORTALE_PIC',
					parameter: {
						"p_iden_allegato" 	: {v: idenAllegato, t: 'N'},
						"p_iden_consenso" 	: {v: idenConsenso, t: 'N'},
					}
				}
			).done(function(resp) {
				if (resp.p_result.indexOf('OK')==0) {
					home.NOTIFICA.success({
						'title'		: 'Success',
						'message'	: "Cancellato l'allegato desiderato",
						'timeout'	: 5
					});
					CONSENSO_UNICO.objWk.refresh();
				}else{
					home.NOTIFICA.error({
						'title'		: 'Attenzione',
						'message'	: "Impossibile cancellare l'allegato desiderato",
						'timeout'	: 5
					});
				}
			}
		);
	}
};

$(function() {
	
	VERSIONI_CONSENSO_UNICO.init();
});