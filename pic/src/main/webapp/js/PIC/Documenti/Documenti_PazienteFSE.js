/* global LIB, home, moment */

var NS_FORM = {

	initPDF:function(){

		if( $("#EXTERN [name='PDF']").val() == undefined){

			$("#EXTERN").attr("action","srvOpenBase64PDF");
			$("#EXTERN").attr("target","_blank");
			var $v = $(document.createElement("input"));
			$v.attr("name","PDF");
			$v.attr("type","hidden");
			$v.attr("value","");
			var $v1 = $(document.createElement("input"));
			$v1.attr("name","FILENAME");
			$v1.attr("value","pdfFilename");
			$v1.attr("type","hidden");
			$v1.attr("value","");
			$("#EXTERN").append($v);
			$("#EXTERN").append($v1);

		}else{
	        $("[name='PDF']").val('');
	        $("[name='FILENAME']").val('');
		}
	}
};

var DOCUMENTI_PAZIENTE_FSE = {

	ORGANIZATION_ID			: '',
	ORGANIZATION			: '',
	PATIENT_CONSENT			: '',
	CODICE_FISCALE_UTENTE	: '',
	CODICE_FISCALE_PAZIENTE	: '',
	IDEN_ANAG_PAZIENTE		: '',
	ROLE					: '',

	setFSEdataRequest: function() {

		DOCUMENTI_PAZIENTE_FSE.ORGANIZATION_ID
			= LIB.isValid($("#ORGANIZATION_ID").val()) ? $("#ORGANIZATION_ID").val() : '';

		DOCUMENTI_PAZIENTE_FSE.ORGANIZATION
			= LIB.isValid($("#ORGANIZATION").val()) ? $("#ORGANIZATION").val() : '';

		DOCUMENTI_PAZIENTE_FSE.PATIENT_CONSENT
			= LIB.isValid($("#PATIENT_CONSENT").val()) ? $("#PATIENT_CONSENT").val() : "false";

		DOCUMENTI_PAZIENTE_FSE.CODICE_FISCALE_UTENTE
			= LIB.isValid($("#CODICE_FISCALE_UTENTE").val()) ? $("#CODICE_FISCALE_UTENTE").val() : home.baseUser.CODICE_FISCALE;

		DOCUMENTI_PAZIENTE_FSE.CODICE_FISCALE_PAZIENTE
			= $("#CODICE_FISCALE").val();

		DOCUMENTI_PAZIENTE_FSE.ROLE
			= LIB.isValid($("#ROLE").val()) ? $("#ROLE").val() : '';

		var paziente = home.NS_FENIX_PIC.search.patient_from_cf($("#CODICE_FISCALE").val());
		DOCUMENTI_PAZIENTE_FSE.IDEN_ANAG_PAZIENTE
			= paziente.IDEN_ANAGRAFICA;
	},

    init: function() {

    	if(LIB.isValid($("#FSE_ONLY")) && $("#FSE_ONLY").val() === 'S'){
    		$("#li-tabDocRepository").hide();
    		$("#li-tabDocFSE").trigger("click");
    	}

    	$('#chkRicercaFSE').data('CheckBox').selectByValue('Tutti');

    	DOCUMENTI_PAZIENTE_FSE.setFSEdataRequest();

        $('#ElencoWorkFSE').height("320px");

        /*** Faccio partire la ricerca da tre mesi ad oggi ***/
        var data_inizio_iso = $("#h-txtDaDataFSE").val() !== "" ? $('#h-txtDaDataFSE').val() : moment().subtract('days', 90).format('YYYYMMDD');
        $("#h-txtDaDataFSE").val(data_inizio_iso);
        var data_inizio = data_inizio_iso.substr(6,2) + '/' + data_inizio_iso.substr(4,2) + '/' + data_inizio_iso.substr(0,4);
        $("#txtDaDataFSE").val(data_inizio);

        /*** Imposto il valore del radio 'Emergenza' ***/
        if(LIB.isValid($("#EMERGENZA_MEDICA").val()) && $("#EMERGENZA_MEDICA").val() == 'true'){
        	radEmergenzaFSE.selectByValue('EMERGENCY');
        	radEmergenzaFSE.disable();
        }else{
        	radEmergenzaFSE.selectByValue('TREATMENT');
        	$("#lbltaNoteEmergenzaFSE, #taNoteEmergenzaFSE").hide();
        }

        /* Valorizzo ORGANIZATION_ID, ORGANIZATION e ROLE nel caso in cui NON mi siano stati passati o mi siano stati passati vuoti */
        var locality = JSON.parse(home.baseGlobal.FSE_LOCALITY);

        var resp = home.NS_FENIX_PIC.search.user(home.baseUser.IDEN_PER);

        if (resp == '') {
            home.NOTIFICA.error({
                message	: "ATTENZIONE: utente non trovato!",
                title	: "Errore!"
            });
        } else {
        	var cod_asl = resp.COD_ASL;
        	/*** esempio di cod_asl = 102 ***/
            DOCUMENTI_PAZIENTE_FSE.ORGANIZATION_ID
            	= DOCUMENTI_PAZIENTE_FSE.ORGANIZATION_ID == '' ? locality[cod_asl].COD : DOCUMENTI_PAZIENTE_FSE.ORGANIZATION_ID;

            DOCUMENTI_PAZIENTE_FSE.ORGANIZATION
            	= DOCUMENTI_PAZIENTE_FSE.ORGANIZATION == '' ? locality[cod_asl].DESCR : DOCUMENTI_PAZIENTE_FSE.ORGANIZATION;

            /* DOCUMENTI_PAZIENTE_FSE.ROLE = DOCUMENTI_PAZIENTE_FSE.ROLE == '' ? resp.ROLE : DOCUMENTI_PAZIENTE_FSE.ROLE;
            valore da recuperare da una colonna di TAB_PER ancora da  stabilire. */
        }
    },

    setEvents: function() {

        $("#butCercaFSE").on("click", function() {
        	DOCUMENTI_PAZIENTE_FSE.checkFSEdataRequest();
        });

        /*** Faccio apparire/sparire la textarea delle note in base al valore dell'emergenza medica ***/
		$("#h-radEmergenzaFSE").on("change", function (){

			if($("#h-radEmergenzaFSE").val() === 'EMERGENCY'){

		        $("#lbltaNoteEmergenzaFSE, #taNoteEmergenzaFSE").show();
			}else{
		        $("#lbltaNoteEmergenzaFSE, #taNoteEmergenzaFSE").hide();
			}
		});

		/*** Quando clicco su una scelta diversa da 'Tutti' deseleziono la scelta 'Tutti' ***/
		$("#chkRicercaFSE div").each(function() {
			var data_value = $(this).attr('data-value');

			if(data_value != undefined && data_value !== '' && data_value !== 'Tutti'){
				$("#chkRicercaFSE_" + data_value).on("click", function() {
					if($("#chkRicercaFSE_Tutti").hasClass('CBpulsSel')){
						$("#chkRicercaFSE_Tutti").removeClass('CBpulsSel');
					}
				});
			}
		});

		/*** Quando clicco 'Tutti' deseleziono tutte le altre scelte ***/
		$("#chkRicercaFSE_Tutti").on("click", function() {
			if($("#chkRicercaFSE_Tutti").hasClass('CBpulsSel')){
				$('#chkRicercaFSE').data('CheckBox').deselectAll();
				$("#chkRicercaFSE_Tutti").addClass('CBpulsSel');
				$("h-chkRicercaFSE").val('Tutti');
			}
        });

		/*** Avverto nel caso in cui il range di date sia più ampio di un intervallo temporale da me stabilito ***/
		/*** $("#txtDaDataFSE, #txtADataFSE").on("change", function (){

			var aData = ($("#h-txtADataFSE").val() != '' && $("#h-txtADataFSE").val() != undefined) ? $("#h-txtADataFSE").val() : moment().format('YYYYMMDD');
			var daData = ($("#h-txtDaDataFSE").val() != '' && $("#h-txtDaDataFSE").val() != undefined) ? $("#h-txtDaDataFSE").val() : '190000101';

			if(moment(aData, 'YYYYMMDD').subtract(90, 'days').format('YYYYMMDD') > daData){

				var message = "Il range di date impostato supera i 90 giorni: la ricerca potrebbe richiedere qualche istante in piu'";

	            home.NOTIFICA.warning({
	                message	: message,
	                title	: "Attenzione!",
	                timeout	: 10
	            });
			}
		}); ***/
    },

	checkFSEdataRequest: function() {

		if($("#h-radEmergenzaFSE").val() === 'EMERGENCY' && $("#taNoteEmergenzaFSE").val() ===''){

            home.NOTIFICA.warning({
                message	: "Impossibile eseguire la ricerca, e' necessario specificare una motivazione per lo stato di urgenza",
                title	: "Attenzione!"
            });

            return;
		}

		if (DOCUMENTI_PAZIENTE_FSE.ORGANIZATION_ID === '' ||
				DOCUMENTI_PAZIENTE_FSE.ORGANIZATION === '' ||
					DOCUMENTI_PAZIENTE_FSE.PATIENT_CONSENT === '' ||
//						DOCUMENTI_PAZIENTE_FSE.ROLE == '' ||
							DOCUMENTI_PAZIENTE_FSE.CODICE_FISCALE_UTENTE === '' ||
								DOCUMENTI_PAZIENTE_FSE.CODICE_FISCALE_PAZIENTE === ''){

            home.NOTIFICA.error({
                message	: "ATTENZIONE: Impossibile eseguire la ricerca, dati incompleti!",
                title	: "Errore!"
            });

            return;
		}

		if($("#h-radEmergenzaFSE").val() === 'EMERGENCY' && DOCUMENTI_PAZIENTE_FSE.IDEN_ANAG_PAZIENTE === ''){

			home.NOTIFICA.warning({
				message	: "Impossibile tener traccia dell'operazione richiesta: i dati del paziente non sono completi",
				title	: "Attenzione!"
			});

			return;
		}

		var aData = ($("#h-txtADataFSE").val() != '' && $("#h-txtADataFSE").val() != undefined) ? $("#h-txtADataFSE").val() : moment().format('YYYYMMDD');
		var daData = ($("#h-txtDaDataFSE").val() != '' && $("#h-txtDaDataFSE").val() != undefined) ? $("#h-txtDaDataFSE").val() : '190000101';

		if(moment(aData, 'YYYYMMDD').subtract(90, 'days').format('YYYYMMDD') > daData){

			var params =
				{
		            "title"	: "Attenzione",
		            "msg"	: "Il range di date impostato supera i 90 giorni: la ricerca potrebbe richiedere qualche istante in piu'. Proseguire?",
		            "cbkSi"	: function(){DOCUMENTI_PAZIENTE_FSE.checkTraceUserAction();}
		        };
			home.DIALOG.si_no(params);
		}else{
			DOCUMENTI_PAZIENTE_FSE.checkTraceUserAction();
		}
	},

	checkTraceUserAction: function() {
		if($("#h-radEmergenzaFSE").val() === 'EMERGENCY'){
			DOCUMENTI_PAZIENTE_FSE.traceUserAction();
		}

		DOCUMENTI_PAZIENTE_FSE.loadWk();
	},

	loadWk: function() {

		var parameters	= {
			'id'			:	'WK_FSE',
			'container'		:	'ElencoWorkFSE',
			'aBind'			:	[],
			'aVal'			:	[],
			'loadData'		:	false,
			'build_callback':  	{ 'after':	DOCUMENTI_PAZIENTE_FSE.getWorklistData }
		};

		DOCUMENTI_PAZIENTE_FSE.wk = new WK( parameters );
		DOCUMENTI_PAZIENTE_FSE.wk.loadWk();
	},

    getWorklistData: function() {

		var da_data_iso = $("#h-txtDaDataFSE").val() === "" ? /*moment().subtract('days', 90).format('YYYYMMDD')*/ '19900101' : $('#h-txtDaDataFSE').val();
		var a_data_iso = $("#h-txtADataFSE").val() === "" ? moment().format('YYYYMMDD') : $("#h-txtADataFSE").val();

		var purposeof = $("#h-radEmergenzaFSE").val() === "" ? 'TREATMENT' : $("#h-radEmergenzaFSE").val();

		var list_document_metadata_request = {
			"LIST_DOCUMENT_METADATA_REQUEST" : {
				"PARAMETRI_RICERCA" : {
					"CODICE_FISCALE_UTENTE" 	: "RSSMRA65B07D969Q",
//					"CODICE_FISCALE_UTENTE" 	: DOCUMENTI_PAZIENTE_FSE.CODICE_FISCALE_UTENTE,
					"CODICE_FISCALE_PAZIENTE" 	: "RSSMRA65B07D969Q",
//					"CODICE_FISCALE_PAZIENTE" 	: DOCUMENTI_PAZIENTE_FSE.CODICE_FISCALE_PAZIENTE,
					"DA_DATA" 					: da_data_iso + "000000",
					"A_DATA" 					: a_data_iso + "000000",
					"ORDINE" 					: "DESC",
					"TIPO_DOCUMENTO" 			: ""
				}
				,"PARAMETRI_ASSERZIONE" : {
					"ISSUER" 			: "070103",
//					"ISSUER" 			: DOCUMENTI_PAZIENTE_FSE.ORGANIZATION_ID,
					"ROLE" 				: "ASS",
//					"ROLE" 				: DOCUMENTI_PAZIENTE_FSE.ROLE, /* valore da pescare in RADSQL.TAB_PER */
					"RESOURCE-ID" 		: "RSSMRA65B07D969Q",
//					"RESOURCE-ID" 		: DOCUMENTI_PAZIENTE_FSE.CODICE_FISCALE_PAZIENTE,
					"LOCALITY" 			: "070103",
//					"LOCALITY" 			: DOCUMENTI_PAZIENTE_FSE.ORGANIZATION_ID,
//					"PURPOSEOF" 		: "TREATMENT",
					"PURPOSEOF" 		: purposeof,
					"ORGANIZATION-ID" 	: "070103",
//					"ORGANIZATION-ID" 	: DOCUMENTI_PAZIENTE_FSE.ORGANIZATION_ID,
					"ORGANIZATION" 		: "ASL 3 GENOVESE",
//					"ORGANIZATION" 		: DOCUMENTI_PAZIENTE_FSE.ORGANIZATION,
					"PATIENT-CONSENT" 	: DOCUMENTI_PAZIENTE_FSE.PATIENT_CONSENT,
					"ACTION-ID" 		: "READ"
				}
			}
		};

		var tipo_documento = [];
		if($("#h-chkRicercaFSE").val() != undefined && $("#h-chkRicercaFSE").val() != ''){
			tipo_documento = $("#h-chkRicercaFSE").val().split(',')
		}

		if($("#chkRicercaFSE_Tutti").hasClass('CBpulsSel')){
			tipo_documento = [];
		}
		list_document_metadata_request.LIST_DOCUMENT_METADATA_REQUEST.PARAMETRI_RICERCA.TIPO_DOCUMENTO = tipo_documento;

		home.NS_LOADING.showLoading();

		var FSEDocumentMetadataRequest = $.ajax({
            url			: home.baseGlobal.FSE_DOC_LIST_REQUEST,
			type		: 'POST',
            contentType	: "application/json; charset=utf-8",
            data		: JSON.stringify(list_document_metadata_request)
        });

		FSEDocumentMetadataRequest.done(function(r) {

			if( r.LIST_DOCUMENT_METADATA_RESPONSE.ESITO === 'OK'){

        		home.NS_LOADING.hideLoading();

                home.NOTIFICA.success({
                    message	: "Richiesta eseguita correttamente.",
                    title	: "Success!"
                });

                if( r.LIST_DOCUMENT_METADATA_RESPONSE.NUMERO_DOCUMENTI < 1){

                    home.NOTIFICA.warning({
                        message: "Nessun documento trovato per i parametri di ricerca impostati."
                    });
                }
                else{

            		DOCUMENTI_PAZIENTE_FSE.wkJSON = DOCUMENTI_PAZIENTE_FSE.getWorklistJSON( r.LIST_DOCUMENT_METADATA_RESPONSE.DOCUMENTS_LIST );
            		/*** DOCUMENTI_PAZIENTE_FSE.wkJSON = DOCUMENTI_PAZIENTE_FSE.getWorklistJSON( DOCUMENTI_PAZIENTE_FSE.jsonAccess.LIST_DOCUMENT_METADATA_RESPONSE.DOCUMENTS_LIST ); ***/

            		DOCUMENTI_PAZIENTE_FSE.wk.$wk.worklist().data.result = DOCUMENTI_PAZIENTE_FSE.wkJSON;
            		DOCUMENTI_PAZIENTE_FSE.wk.$wk.worklist().grid.populate( DOCUMENTI_PAZIENTE_FSE.wkJSON );
                }
			}else{

        		home.NS_LOADING.hideLoading();
                home.NOTIFICA.error({
                    message	: "Richiesta al momento non disponibile: " + r.LIST_DOCUMENT_METADATA_RESPONSE.DESCRIZIONE,
                    title	: "Errore!"
                });
			}
        });
	},

	getWorklistJSON: function( recordset ) {

		var json = { 'page' : {}, 'rows' : [] };
		json.page = { 'total' : 1, 'current' : 1, 'size' : 100 };

		/*** var size = 10;

		var json = { 'page' : {}, 'rows' : [] };
		json.page = {'current' : 1, 'total': recordset.length, 'size' : size}; ***/

		for( var i = 0; i < recordset.length; i++ ) {
			var row = {};
			for( var key in recordset[i] ) {
				row[key] = recordset[i][key];
			}
			row['N_ROW'] = i;
			json.rows.push( row );
		}

		return json;
	},

	checkApriDocFSE: function(rec) {
		if(rec[0] == undefined){
			rec[0] = rec;
		}

		if($("#h-radEmergenzaFSE").val() === 'EMERGENCY' && $("#taNoteEmergenzaFSE").val () ===''){

            home.NOTIFICA.warning({
                message	: "Impossibile aprire il documento, e' necessario specificare una motivazione per lo stato di urgenza",
                title	: "Attenzione!"
            });

            return;
		}
//		alert(rec[0].ACCESS_RESTRICTION)
		var accesso_consentito = true;
    	$.each(rec[0].ACCESS_RESTRICTION, function(k,v){

    		/*** DOCUMENTI_PAZIENTE_FSE.ROLE = 'DAM'; ***/

    		if(DOCUMENTI_PAZIENTE_FSE.ROLE == v.ROLE && v.PART_RESTRICTION[0].RESTRICTION === 'R'){

                home.NOTIFICA.warning({
                    message	: "Apertura del documento non consentita!",
                    title	: "Attenzione!"
                });

        		accesso_consentito = false;

                return;
    		}
		});

    	if(accesso_consentito){

    		if($("#h-radEmergenzaFSE").val() === 'EMERGENCY'){
    			if (DOCUMENTI_PAZIENTE_FSE.IDEN_ANAG_PAZIENTE === ''){

    				home.NOTIFICA.warning({
    					message	: "Impossibile tener traccia dell'operazione richiesta: i dati del paziente non sono completi",
    					title	: "Attenzione!"
    				});

    				return;
    			}else{
    				DOCUMENTI_PAZIENTE_FSE.traceUserAction();
    			}
    		}

    		DOCUMENTI_PAZIENTE_FSE.apriDocFSE(rec);
    	}
	},

	apriDocFSE: function(rec) {

		var purposeof = $("#h-radEmergenzaFSE").val() === "" ? 'TREATMENT' : $("#h-radEmergenzaFSE").val();

		NS_FORM.initPDF();

		/* Esempio di richiesta: */
		var test = {
			"GET_DOCUMENT_REQUEST" : {
				"PARAMETRI_RICERCA" :{
		     		"CODICE_FISCALE_UTENTE" 	: "RSSMRA65B07D969Q",
					"CODICE_FISCALE_PAZIENTE" 	: "RSSMRA65B07D969Q",
					"ID_DOCUMENTO"				: rec[0].ID_DOCUMENTO,
		      		"OID_NODO_LOCALE" 			: rec[0].OID_NODO_LOCALE},
//					"ID_DOCUMENTO"				: "urn:oid:2.16.840.1.113883.2.9.2.70.4.2^70103.000000000000205",
//		      		"OID_NODO_LOCALE" 			: "urn:oid:2.16.840.1.113883.2.9.2.70.4.5.10"},
		      	"PARAMETRI_ASSERZIONE" : {
					"ISSUER" 			: "070103",
//					"ISSUER" 			: DOCUMENTI_PAZIENTE_FSE.ORGANIZATION_ID,
					"ROLE" 				: "MMG",
//					"ROLE" 				: DOCUMENTI_PAZIENTE_FSE.ROLE, /* valore da pescare in RADSQL.TAB_PER */
					"RESOURCE-ID" 		: "RSSMRA65B07D969Q",
//					"RESOURCE-ID" 		: DOCUMENTI_PAZIENTE_FSE.CODICE_FISCALE_PAZIENTE,
					"LOCALITY" 			: "070103",
//					"LOCALITY" 			: DOCUMENTI_PAZIENTE_FSE.ORGANIZATION_ID,
//					"PURPOSEOF" 		: "TREATMENT",
					"PURPOSEOF" 		: purposeof,
					"ORGANIZATION-ID" 	: "070103",
//					"ORGANIZATION-ID" 	: DOCUMENTI_PAZIENTE_FSE.ORGANIZATION_ID,
					"ORGANIZATION" 		: "ASL 3 GENOVESE",
//					"ORGANIZATION" 		: DOCUMENTI_PAZIENTE_FSE.ORGANIZATION,
					"PATIENT-CONSENT" 	: DOCUMENTI_PAZIENTE_FSE.PATIENT_CONSENT,
					"ACTION-ID" 		: "READ",
		          	"TIPO_DOCUMENTO"	: "11502-2"
//			        "TIPO_DOCUMENTO"	: rec[0].CODICE_TIPO_DOC
				}
			}
		};

		home.NS_LOADING.showLoading();

		var FSEDocumentRequest = $.ajax({
            url: home.baseGlobal.FSE_DOC_REQUEST,
			type: 'POST',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(test)
        });

		FSEDocumentRequest.done(function (data) {

    		home.NS_LOADING.hideLoading();

			if(data.GET_DOCUMENT_RESPONSE.ESITO === 'OK'){

                if($("[name='PDF']").val() ===""){
                    $("[name='PDF']").val(data.GET_DOCUMENT_RESPONSE.DOC_BASE64);
                    $("[name='FILENAME']").val('test');

                }else{
                    $("[name='PDF']").val($("[name='PDF']").val() + "*" + data.GET_DOCUMENT_RESPONSE.DOC_BASE64);
                    $("[name='FILENAME']").val($("[name='FILENAME']").val() + "_" + 'test');
                }

            	if( $("[name='PDF']").val() !== ""){
            		$("#EXTERN").submit();
            	}
        	}
        });

		FSEDocumentRequest.fail(

				function (data){

	        		home.NS_LOADING.hideLoading();

	                home.NOTIFICA.error({
	                    message	: "Impossibile recuperare il dcumento desiderato: " + data.GET_DOCUMENT_RESPONSE.DESCRIZIONE,
	                    title	: "Errore!"
	                });
				}
		);
	},

	traceUserAction: function() {
		/*** Registro l'operazione su IMAGOWEB.TRACE_USER_ACTION ***/

		var paziente = DOCUMENTI_PAZIENTE_FSE.IDEN_ANAG_PAZIENTE;
		var note = $("#taNoteEmergenzaFSE").val();
		
		NS_FUNCTIONS.traceDocFSEAperturaEmergenza(paziente, note);
	},

	/* Esempio di risposta positiva per la ricerca dei documenti */
    jsonIN : {
    	  "LIST_DOCUMENT_METADATA_RESPONSE": {
    		    "ESITO": "OK",
    		    "DESCRIZIONE": "Operazione completata con successo",
    		    "NUMERO_DOCUMENTI": "5",
    		    "DOCUMENTS_LIST": [
    		      {
    		        "ID_DOCUMENTO": "urn:oid:2.16.840.1.113883.2.9.2.70.4.2^70.863",
    		        "CODICE_AZIENDA_PRODUTTRICE": "070",
    		        "DESCR_AZIENDA_PRODUTTRICE": "REGIONE LIGURIA",
    		        "CF_AUTORE_DOCUMENTO": "LZZSFN62B15D969W",
    		        "RUOLO_AUTORE_DOCUMENTO": null,
    		        "CF_FIRMATARIO_DOCUMENTO": null,
    		        "CF_PAZIENTE": "RSSMRA65B07D969Q",
    		        "CODICE_STATO_DOC": "final",
    		        "CODICE_TIPO_DOC": "59284-0",
    		        "CODICE_CONSENSO": "N",
    		        "DISPLAY_CONSENSO": "Normal",
    		        "TEXT_CONSENSO": "",
    		        "CONTENT_TYPE": "text/x-cda-r2+xml",
    		        "DATA_CREAZIONE": "20160606105719",
    		        "DATA_INDICIZZAZIONE": "20160606105719",
    		        "DISPLAY_STATO_DOC": "",
    		        "TEXT_STATO_DOC": "DOCUMENTO CORRENTE",
    		        "DISPLAY_TIPO_DOC": "Documento dei consensi",
    		        "TEXT_TIPO_DOC": "Documento dei consensi",
    		        "FORMAT": "urn:oid:1.3.6.1.4.1.19376.1.5.3.1.1.7",
    		        "OID_NODO_LOCALE": "urn:oid:2.16.840.1.113883.2.9.2.70.4.5.10",
    		        "STATO_INDICIZZAZIONE_DOC": "current",
    		        "ACCESS_RESTRICTION": []
    		      },
    		      {
    		        "ID_DOCUMENTO": "urn:oid:2.16.840.1.113883.2.9.2.70.4.2^70.868",
    		        "CODICE_AZIENDA_PRODUTTRICE": "070",
    		        "DESCR_AZIENDA_PRODUTTRICE": "ASSISTITO",
    		        "CF_AUTORE_DOCUMENTO": "RSSMRA65B07D969Q",
    		        "RUOLO_AUTORE_DOCUMENTO": "ASS",
    		        "CF_FIRMATARIO_DOCUMENTO": "RSSMRA65B07D969Q",
    		        "CF_PAZIENTE": "RSSMRA65B07D969Q",
    		        "CODICE_STATO_DOC": "final",
    		        "CODICE_TIPO_DOC": "11502-2",
    		        "CODICE_CONSENSO": "N",
    		        "DISPLAY_CONSENSO": "Normal",
    		        "TEXT_CONSENSO": "RISERVATEZZA NORMALE",
    		        "CONTENT_TYPE": "application/pdf",
    		        "DATA_CREAZIONE": "20160602000000",
    		        "DATA_INDICIZZAZIONE": "20160606120521",
    		        "DISPLAY_STATO_DOC": "",
    		        "TEXT_STATO_DOC": "DOCUMENTO CORRENTE",
    		        "DISPLAY_TIPO_DOC": "Referto di Laboratorio",
    		        "TEXT_TIPO_DOC": "documento di prova",
    		        "FORMAT": "PDF",
    		        "OID_NODO_LOCALE": "urn:oid:2.16.840.1.113883.2.9.2.70.4.5.10",
    		        "STATO_INDICIZZAZIONE_DOC": "current",
    		        "ACCESS_RESTRICTION": []
    		      },
    		      {
    		        "ID_DOCUMENTO": "urn:oid:2.16.840.1.113883.2.9.2.70.4.2^RAD@30275580",
    		        "CODICE_AZIENDA_PRODUTTRICE": "070102",
    		        "DESCR_AZIENDA_PRODUTTRICE": "AZIENDA SANITARIA LOCALE 2 SAVONESE",
    		        "CF_AUTORE_DOCUMENTO": "BSSNCY54T54Z600C",
    		        "RUOLO_AUTORE_DOCUMENTO": "DRS",
    		        "CF_FIRMATARIO_DOCUMENTO": "BSSNCY54T54Z600C",
    		        "CF_PAZIENTE": "RSSMRA65B07D969Q",
    		        "CODICE_STATO_DOC": "final",
    		        "CODICE_TIPO_DOC": "68604-8",
    		        "CODICE_CONSENSO": "N",
    		        "DISPLAY_CONSENSO": "Normal",
    		        "TEXT_CONSENSO": "Normal",
    		        "CONTENT_TYPE": "application/pdf",
    		        "DATA_CREAZIONE": "20160412165154",
    		        "DATA_INDICIZZAZIONE": "20160623120619",
    		        "DISPLAY_STATO_DOC": "DEFINITIVO",
    		        "TEXT_STATO_DOC": "DOCUMENTO CORRENTE",
    		        "DISPLAY_TIPO_DOC": "Referto radiologico",
    		        "TEXT_TIPO_DOC": "REFERTO CR",
    		        "FORMAT": "PDF",
    		        "OID_NODO_LOCALE": "urn:oid:2.16.840.1.113883.2.9.2.70.4.5.2",
    		        "STATO_INDICIZZAZIONE_DOC": "current",
    		        "ACCESS_RESTRICTION": []
    		      },
    		      {
    		        "ID_DOCUMENTO": "urn:oid:2.16.840.1.113883.2.9.2.70.4.2^70103.000000000000205",
    		        "CODICE_AZIENDA_PRODUTTRICE": "070103",
    		        "DESCR_AZIENDA_PRODUTTRICE": "AZIENDA SANITARIA LOCALE 3 GENOVESE",
    		        "CF_AUTORE_DOCUMENTO": "SCRGNN55R01A944R",
    		        "RUOLO_AUTORE_DOCUMENTO": "APR",
    		        "CF_FIRMATARIO_DOCUMENTO": "SCRGNN55R01A944R",
    		        "CF_PAZIENTE": "RSSMRA65B07D969Q",
    		        "CODICE_STATO_DOC": "final",
    		        "CODICE_TIPO_DOC": "57833-6",
    		        "CODICE_CONSENSO": "N",
    		        "DISPLAY_CONSENSO": "Normal",
    		        "TEXT_CONSENSO": "RISERVATEZZA NORMALE",
    		        "CONTENT_TYPE": "application/pdf",
    		        "DATA_CREAZIONE": "20151118124300",
    		        "DATA_INDICIZZAZIONE": "20160606111430",
    		        "DISPLAY_STATO_DOC": "DEFINITIVO",
    		        "TEXT_STATO_DOC": "DOCUMENTO CORRENTE",
    		        "DISPLAY_TIPO_DOC": "Prescrizione farmaceutica",
    		        "TEXT_TIPO_DOC": "Prescrizione farmaceutica",
    		        "FORMAT": "PDF",
    		        "OID_NODO_LOCALE": "urn:oid:2.16.840.1.113883.2.9.2.70.4.5.10",
    		        "STATO_INDICIZZAZIONE_DOC": "current",
    		        "ACCESS_RESTRICTION": []
    		      },
    		      {
    		        "ID_DOCUMENTO": "urn:oid:2.16.840.1.113883.2.9.2.70.4.2^70901.0000000000001203",
    		        "CODICE_AZIENDA_PRODUTTRICE": "070901",
    		        "DESCR_AZIENDA_PRODUTTRICE": "AO-IRCCS SAN MARTINO-IST",
    		        "CF_AUTORE_DOCUMENTO": "PRDGTT59C05D969B",
    		        "RUOLO_AUTORE_DOCUMENTO": "AAS",
    		        "CF_FIRMATARIO_DOCUMENTO": "PRDGTT59C05D969B",
    		        "CF_PAZIENTE": "RSSMRA65B07D969Q",
    		        "CODICE_STATO_DOC": "final",
    		        "CODICE_TIPO_DOC": "11502-2",
    		        "CODICE_CONSENSO": "N",
    		        "DISPLAY_CONSENSO": "Normal",
    		        "TEXT_CONSENSO": "RISERVATEZZA NORMALE",
    		        "CONTENT_TYPE": "application/pdf",
    		        "DATA_CREAZIONE": "20151117124300",
    		        "DATA_INDICIZZAZIONE": "20160606112827",
    		        "DISPLAY_STATO_DOC": "DEFINITIVO",
    		        "TEXT_STATO_DOC": "DOCUMENTO CORRENTE",
    		        "DISPLAY_TIPO_DOC": "Referto di Laboratorio",
    		        "TEXT_TIPO_DOC": "Referto di Laboratorio",
    		        "FORMAT": "PDF",
    		        "OID_NODO_LOCALE": "urn:oid:2.16.840.1.113883.2.9.2.70.4.5.9",
    		        "STATO_INDICIZZAZIONE_DOC": "current",
    		        "ACCESS_RESTRICTION": []
    		      }
    		    ]
    		  }
    		},

	jsonAccess : {
			  "LIST_DOCUMENT_METADATA_RESPONSE": {
			    "ESITO": "OK",
			    "DESCRIZIONE": "Operazione completata con successo",
			    "NUMERO_DOCUMENTI": "1",
			    "DOCUMENTS_LIST": [
			      {
			        "ID_DOCUMENTO": "urn:oid:2.16.840.1.113883.2.9.2.70.4.2^RAD@30275580",
			        "CODICE_AZIENDA_PRODUTTRICE": "070102",
			        "DESCR_AZIENDA_PRODUTTRICE": "AZIENDA SANITARIA LOCALE 2 SAVONESE",
			        "CF_AUTORE_DOCUMENTO": "BSSNCY54T54Z600C",
			        "RUOLO_AUTORE_DOCUMENTO": "DRS",
			        "CF_FIRMATARIO_DOCUMENTO": "BSSNCY54T54Z600C",
			        "CF_PAZIENTE": "RSSMRA65B07D969Q",
			        "CODICE_STATO_DOC": "final",
			        "CODICE_TIPO_DOC": "68604-8",
			        "CODICE_CONSENSO": "N",
			        "DISPLAY_CONSENSO": "Normal",
			        "TEXT_CONSENSO": "Normal",
			        "CONTENT_TYPE": "application/pdf",
			        "DATA_CREAZIONE": "20160412165154",
			        "DATA_INDICIZZAZIONE": "20160623120619",
			        "DISPLAY_STATO_DOC": "DEFINITIVO",
			        "TEXT_STATO_DOC": "DOCUMENTO CORRENTE",
			        "DISPLAY_TIPO_DOC": "Referto radiologico",
			        "TEXT_TIPO_DOC": "REFERTO CR",
			        "FORMAT": "PDF",
			        "OID_NODO_LOCALE": "urn:oid:2.16.840.1.113883.2.9.2.70.4.5.2",
			        "STATO_INDICIZZAZIONE_DOC": "current",
			        "ACCESS_RESTRICTION": [
			          {
			            "ROLE": "AAS",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "APR",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "DAM",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "DRS",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "DSA",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "FAR",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "INF",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "MRP",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "OAM",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "PRE",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "PRO",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "PSS",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "RIA",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "RSA",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "TEC",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "TSA",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          },
			          {
			            "ROLE": "TSD",
			            "PART_RESTRICTION": [
			              {
			                "RESTRICTION": "R",
			                "CREATED": "20160627000000",
			                "STATUS": "CURRENT",
			                "SECTION_OR_DATA": null
			              }
			            ]
			          }
			        ]
			      }
			    ]
			  }
			}
};

$(document).ready(function() {
    try {
    	DOCUMENTI_PAZIENTE_FSE.init();
        DOCUMENTI_PAZIENTE_FSE.setEvents();
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }
});