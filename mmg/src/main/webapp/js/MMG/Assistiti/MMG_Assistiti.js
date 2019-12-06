$(document).ready(function(){
	ASSISTITI.init();
	ASSISTITI.setEvents();
});

var ASSISTITI = {
			
	wkRevocati:null,

	wkAssistiti:null,

	init:function(){

		$('#h-txtDataRevoca').val(moment().subtract(3, 'months').format('YYYYMMDD'));
		$('#txtDataRevoca').val(moment().subtract(3, 'months').format('DD/MM/YYYY'));

		ASSISTITI.initWk();

		home.$.NS_DB.getTool({_logger : home.logger}).select({

			id:'WORKLIST.ASSISTITI_NUMERO',
			parameter:
			{
				iden_med			: { v : home.baseUser.IDEN_PER, t : 'N'},
				scadenza_assistenza : { v : '99999999', t : 'V'}
			}

		}).done( function(resp) {

			if(LIB.isValid(resp.result[0].NUMERO_ASSISTITI) && resp.result[0].NUMERO_ASSISTITI != '0'){
				var numero_assistiti = $(document.createElement("span")).attr('id', 'numero_assistiti').html('Numero degli assistiti: ' + resp.result[0].NUMERO_ASSISTITI);
				$(".buttons").parent().prepend(numero_assistiti);
			}
		});

	},

	setEvents:function(){

		$("#butCerca, #li-tabAssistiti").on("click", function(){
			ASSISTITI.refreshWk();
		});

		$("body").on("keyup",function(e) {
			if(e.keyCode == 13) {
				ASSISTITI.refreshWk();
			}
		});

		$("#txtDataNascita").on("keydown",function(e) {
			if(e.keyCode == 13) {
				$("#txtDataNascita").trigger("blur");
				$("#butCerca").trigger("click");
			}
                        
		});

		$('#li-tabRevocati').on('click', function(){
			//ASSISTITI.loadWkRevocati('NOTDEFINED');

			var msg="La lista degli assistiti revocati non è stata caricata all'apertura in quanto risultano parecchi risultati.<br><br>"
				+"Si prega di effettuare una ricerca mirata o, in caso di necessità di una lista completa, cliccare sul tasto cerca senza impostare i filtri"
				+"<br>(L'operazione potrebbe richiedere alcuni secondi di attesa)";

			home.NOTIFICA.info({
				"message" 	: msg,
				"title"		:traduzione.lblAttenzione,
				"timeout"	:"30"

			})
		});

		$('#butCercaRevocati').on('click', function(){
			ASSISTITI.loadWkRevocati();
		});

		$('.butStampa').on('click', ASSISTITI.stampa);
	},

	initWk:function(){
		ASSISTITI.refreshWk();
	},

	refreshWk: function(){

		$('.butStampa').show();

		var h = $('.contentTabs').outerHeight(true) - $('#fldRicerca').outerHeight(true) - 10;

		$("#ElencoWork").height(h);

		var data_nascita = $("#h-txtDataNascita").val();
		var nome = $("#Nome").val().toUpperCase();
		var cognome = $("#Cognome").val().toUpperCase();
		var iden_med_base = home.baseUser.IDEN_PER;
		var residenza = $('#Residenza').val().toUpperCase();
		var scadenza_assistenza = $("#h-txtDataScadenza").val() == '' ? '99999999' : $("#h-txtDataScadenza").val();

		var params = {
			"id"		: 'ASSISTITI_WORKLIST',
			"aBind"		: ["nome","cognome","data_nascita","iden_med_base","residenza","scadenza_assistenza"],
			"aVal"		: [nome,cognome,data_nascita,iden_med_base,residenza,scadenza_assistenza],
			"container" : 'ElencoWork'
		};

		ASSISTITI.wkAssistiti = new WK(params);
		ASSISTITI.wkAssistiti.loadWk();
	},

	loadWkRevocati: function(valore){

		var nome		= $('#NomeRevocato').val().toUpperCase();
		var cognome		= $('#CognomeRevocato').val().toUpperCase();
		var dataRevoca 	= $('#h-txtDataRevoca').val() == '' ? moment().subtract('months', 1).format('YYYYMMDD') : $('#h-txtDataRevoca').val();

		//viene fatto in modo da caricare la wk vuota alla prima apertura passandogli 'NOTDEFINED'
		if(typeof valore != 'undefined' && valore == 'NOTDEFINED'){
			nome 	= valore;
			cognome = valore;
		}

		var parameters	= {
			'id'		: 'ASSISTITI_REVOCATI',
			'aBind'		: ['nome','cognome', 'iden_med_base', 'data_revoca'],
			'aVal'		: [nome, cognome, home.baseUser.IDEN_PER, dataRevoca],
			"container" : 'divWk'
		};

		var h = $('.contentTabs').innerHeight() - $('#fldRicercaRevocati').outerHeight(true) - 20;
		$('#divWk').height( h );

		ASSISTITI.wkRevocati = new WK(parameters);
		ASSISTITI.wkRevocati.loadWk();
	},

	stampa: function(){

                var tabSel = $("#li-tabAssistiti").hasClass("tabActive") ? 'ASSISTITI' : 'REVOCATI' ;
                var prompts = {};
                var vReport = '';

                if(tabSel == 'ASSISTITI'){
                    
                    prompts = {
                        pIdenPer: home.baseUser.IDEN_PER,
                        pCognome: $("#Cognome").val().toUpperCase(),
                        pNome: $("#Nome").val().toUpperCase(),
                        pDataNascita: $("#h-txtDataNascita").val(),
                        pDataFineAssistenza: $("#h-txtDataScadenza").val() != '' ? $("#h-txtDataScadenza").val() : '99999999',
                        pIndirizzo: $('#Residenza').val().toUpperCase()
                    };
                    
                    vReport = "LISTA_ASSISTITI.RPT";
                }else{
                    
                    prompts = {
                        pIdenPer            : home.baseUser.IDEN_PER, 
                        pCognome            : $("#Cognome").val().toUpperCase(), 
                        pNome               : $("#Nome").val().toUpperCase(),
                        pDataRevoca         : $("#h-txtDataRevoca").val() != '' ?  $("#h-txtDataRevoca").val() : '19500101'
                    };
                    
                    vReport = "LISTA_ASSISTITI_REVOCATI.RPT";
                }

                home.NS_PRINT.print({
                path_report: vReport + "&t=" + new Date().getTime(),
                prompts: prompts,
                show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
                output: "pdf"
                });	     
	},
        
	apriCartella: function(rec) {
		if (typeof rec[0] != "undefined") {
			rec = rec[0];
		}
		var param = {
			IDEN_ANAG 				: rec.IDEN_ANAG,
			PAZIENTE 				: rec.PAZIENTE,
			IDEN_MED_BASE 			: rec.IDEN_MED_BASE,
			CONSENSO_PRIVACY_MMG 	: rec.CONSENSO_PRIVACY_MMG,
			PERMESSI_LETTURA 		: rec.PERMESSI_LETTURA
		};
		NS_MENU_WORKLIST_ASSISTITI.apriCartellaAssistito( param, 'CARTELLA', home.NS_FENIX_TOP.chiudiUltima);
	}
};