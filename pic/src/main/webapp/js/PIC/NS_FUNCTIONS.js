/* global NS_LOADING, home, dwr, toolKitDB */

var _OUT = false;
/*
 * Parametri chiamata da DENTRO l'applicativo:
 * - ACTION
 * - PATIENT_ID
 * - ASSIGNING_AUTHORITY
 * - CODICE_FISCALE
 * - KEY_LEGAME
 *
 * Parametri chiamata da FUORI l'applicativo:
 * - ACTION
 * - ASSIGNING_AUTHORITY
 * - CODICE_FISCALE
 * - COGNOME
 * - COM_NASC
 * - COM_RES
 * - DATA_NASCITA
 * - KEY_LEGAME
 * - NOME
 * - SESSO
*/

var _ACTION = '';
var _ASSIGNING_AUTHORITY = '';
var _TESSERA_SANITARIA = '';
var _CODICE_FISCALE = '';
var _COGNOME = '';
var _COMUNE_NASCITA = '';
var _COM_NASC = '';
var _COMUNE_RESIDENZA = '';
var _INDIRIZZO = '';
var _COM_RES = '';
var _DATA_NASCITA = '';
var _IDEN_CONSENSO = '';
var _LISTA_EVENTI_ATTIVATI = '';
var _LISTA_EVENTI_OSCURATI = '';
var _LISTA_DOCUMENTI_ATTIVATI = '';
var _LISTA_DOCUMENTI_OSCURATI = '';
var _NOME = '';
var _NOSOLOGICO_PAZIENTE = '';
var _ID_DOCUMENTO = '';
var _PATIENT_ID = '';
var _SESSO = '';
var _TIPO = '';
var _TIPO_CONSENSO = '';
var _LOGOUT_ON_CLOSE = '';
var _EMERGENZA_MEDICA = '';
var _ID_REMOTO = '';
var _URL_PARAMS = '?';
var _UTE_INS = '';
var _VERSIONE = '';

var NS_FUNCTIONS = {
    wkDocumentiAttivati: null,
    wkDocumentiOscurati: null,
    wkEventiAccessoPsAttivati: null,
    wkEventiCartellaAmbAttivati: null,
    wkEventiRicoveroAttivati: null,
    wkEventiAccessoPsOscurati: null,
    wkEventiCartellaAmbOscurati: null,
    wkEventiRicoveroOscurati: null,
    wkEventiAccessoPsInespressi: null,
    wkEventiCartellaAmbInespressi: null,
    wkEventiRicoveroInespressi: null,
    callAjax: {
        EVC: function(listaIden, tabellaModulo, callback) {

            if(!home.baseGlobal["consensi.distribuzione.enabled"]){
                window.logger.info("La distribuzione dei consensi non risulta attiva");
                return;
            }

            /*** $('.butChiudi').attr('disabled', 'disabled'); //in futuro da fare: NS_LOADING.showLoading(); ***/
			NS_LOADING.showLoading();
            /* Chiamata ajax al proxy per effettuare una chiamata esterna:
             * 192.168.3.215:9697/EVC?INPUT={"elencoIden":[{"idenDettaglio": "123"},{"idenDettaglio":"345", "tabellaModulo": "PIC_MODULI_CONSENSO"}]}
             * Es risposta:
             * - positiva {"elencoIden":[{"idenDettaglio":"1141","esitoCreazione":"0","esitoRoute":[{"routeName":"AMBU","sending":"0"},{"routeName":"WHALE","sending":"0"},{"routeName":"POLARIS","sending":"0"}]}]}
             * - negativa {"elencoIden":[{"idenDettaglio":"1140","esitoCreazione":"1","descrErr":"Iden non trovato in tabella"}]}
             */

            if(!home.baseGlobal.URL_INTEGRAZIONE){
                home.NOTIFICA.error({message: 'Parametro "PIC.URL_INTEGRAZIONE" non valorizzato, il consenso appena acquisito non verr� distribuito', timeout: 5, title: "Error"});
                return;
            }

            var urlToCall = home.baseGlobal.URL_INTEGRAZIONE + "EVC";



            var dataToSend = "INPUT=" + encodeURIComponent(JSON.stringify({"elencoIden": listaIden, "tabellaModulo": tabellaModulo}));
            /*** alert(urlToCall+"?"+dataToSend); ***/

            jQuery.support.cors = true;
            $.ajax({
                url: "proxy?CALL=" + encodeURIComponent(urlToCall) +  "&METHOD=GET&PARAM=" + dataToSend,
                /*data: {
                    "URL": urlToCall,
                    "PARAM": dataToSend
                },*/
                cache: false,
                type: "GET",
                crossDomain: false,
                dataType: "json",
                contentType: "application/x-www-form-urlencoded",
                success: function(resp) {
                	/*** console.log(resp); ***/
                    var elencoIden = resp.elencoIden;
                    var i = 0;
                    while (i < elencoIden.length) {

                        if (elencoIden[i].esitoParsingData === "KO") {
                            home.NOTIFICA.error({message: elencoIden[i].descrErr, timeout: 5, title: "Error"});
                            i = elencoIden.length;
                        } else {
                            i++;
                        }
                    }
					NS_LOADING.hideLoading();

					if (typeof(callback) === "function") {
						callback();
					}
                },
                error: function(resp) {
                    home.NOTIFICA.error({message: resp, timeout: 5, title: "Error"});
					NS_LOADING.hideLoading();
                }
            });
        }
    },

	traceDeoscuraDocumento: function(iden_anag, id) {
		
    	var params = {
    			pIdenAnag 		: iden_anag,
    			pIdenDocumento 	: id 
    	};
    	NS_FUNCTIONS.traceUserAction(params, 'PCK_TRACE_USER_ACTION.traceDeoscuraDocumento');
	},

	traceDeoscuraEvento: function(iden_anag, id) {
		
    	var params = {
    			pIdenAnag 	: iden_anag,
    			pIdenEvento : id
    	};
    	NS_FUNCTIONS.traceUserAction(params, 'PCK_TRACE_USER_ACTION.traceDeoscuraEvento');
	},

	traceCancellaConsenso: function(iden_anag, id) {
		
    	var params = {
    			pIdenAnag 	: iden_anag,
    			pId			: '' + id + ''
    	};
    	NS_FUNCTIONS.traceUserAction(params, 'PCK_TRACE_USER_ACTION.traceCancellaConsenso');
	},

	traceRevocaConsenso: function(iden_anag, id) {
		
    	var params = {
    			pIdenAnag 	: iden_anag,
    			pId			: '' + id + ''
    	};
    	NS_FUNCTIONS.traceUserAction(params, 'PCK_TRACE_USER_ACTION.traceRevocaConsenso');
	},

	traceAperturaWKEventiDSE: function(iden_anag) {
		
    	var params = {pIdenAnag : iden_anag};
    	NS_FUNCTIONS.traceUserAction(params, 'PCK_TRACE_USER_ACTION.traceAperturaWKEventiDSE');
	},

	traceAperturaWKDocDSE: function(iden_anag) {
		
    	var params = {pIdenAnag : iden_anag};
    	NS_FUNCTIONS.traceUserAction(params, 'PCK_TRACE_USER_ACTION.traceAperturaWKDocDSE');
	},

	traceAperturaDocumento: function(id_documento, iden_anag) {
		
    	var params = { 
    			pIdDoc		: id_documento,
    			pIdenAnag 	: iden_anag
    	};
    	NS_FUNCTIONS.traceUserAction(params, 'PCK_TRACE_USER_ACTION.traceAperturaDocumento');
	},
	
	traceChiusuraDocumento: function() {
		
		var params = {};
		NS_FUNCTIONS.traceUserAction(params, 'PCK_TRACE_USER_ACTION.traceChiusuraDocumento');
	},

	traceAperturaDocumentoMMG: function(id_documento, iden_anag, tipo_medico) {

		var params = { 
    			pIdDoc		: id_documento,
    			pIdenAnag 	: iden_anag,
    			pTipoMed 	: tipo_medico
    	};
    	NS_FUNCTIONS.traceUserAction(params, 'PCK_TRACE_USER_ACTION.traceAperturaDocumentoMMG');
	},
		
	traceDocFSEAperturaEmergenza: function(iden_anag, note){
		
    	var params = {
    			pIdenAnag 	: '' + iden_anag + '',
    			pNote 		: note
    	};
    	NS_FUNCTIONS.traceUserAction(params, 'PCK_TRACE_USER_ACTION.traceDocFSEAperturaEmergenza');
	},

    traceStpConsensoDOC: function(prompt){

	    for(i = 0; i < prompt.pIdDoc.length; i++){

            var params = {
                pIdenAnag 	: '' + prompt.pIdenAnag + '',
                pIdDoc      : prompt.pIdDoc[i],
                pNote 		: '{Conferimento: '+ prompt.pConferimento + ', Oscuramento: ' + prompt.pOscuramento +'}'
            };
            NS_FUNCTIONS.traceUserAction(params, 'PCK_TRACE_USER_ACTION.traceStampaConsensoDocumento');
        }
    },

    traceUserAction : function (params, id_procedura) {
    	
		/*** Registro l'operazione su IMAGOWEB.TRACE_USER_ACTION ***/
		home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({

			/*** id: 'MMG_CONFIG.TRACE_USER_ACTION', ***/
			id			: id_procedura,
	        datasource	: 'PORTALE_PIC',
	        parameter	: params
		}).done(function() {
            home.NOTIFICA.success({
                message	: "Operazione registrata con successo"
            });
		}).fail(function (jqXHR, textStatus, errorThrown) {
        	var msg;

			if (textStatus === 'abort') {
            	msg = "AJAX request aborted";
            } else if (textStatus === 'timeout') {
            	msg = "AJAX request timeout";
            } else {
            	msg = "AJAX request error";
        	}

        	NOTIFICA.error({title: "Error", message: "Errore comunicazione db: " + msg + " - " + errorThrown, timeout: 5, width: 300});
		});
    },

    documento: {
        attiva: function(refresh) {
            dwr.engine.setAsync(false);
            var param = {
                "p_VERSIONE": _VERSIONE,
                "p_PATIENT_ID": _PATIENT_ID,
                "p_ASSIGNING_AUTHORITY": _ASSIGNING_AUTHORITY,
                "p_SOSTITUTO_NC": $("#txtSostitutoNomeCognome").val(),
                "p_SOSTITUTO_LN": $("#txtSostitutoLuogoNascita").val(),
                "p_SOSTITUTO_DN": $("#h-txtSostitutoDataNascita").val(),
                "p_SOSTITUTO_R": $("#txtSostitutoResidente").val(),
                "p_SOSTITUTO_DI": $("#txtSostitutoDocumentoIdentita").val(),
                "p_TIPO_SOSTITUTO_DICHIARANTE": $("#h-radTipoSostitutoDichiarante").val(),
                //"p_TIPO": _TIPO,
                "p_LISTA_IDEN_DOCUMENTI": _LISTA_DOCUMENTI_OSCURATI,
                "p_UTE_INS": _UTE_INS
            };
            toolKitDB.executeProcedureDatasource("PKG_PIC_DOCUMENTO.ATTIVA", "PORTALE_PIC", param, function(resp) {
                var strSplit = resp.p_result.split('|');
                if (strSplit[0] === 'KO') {
                    home.NOTIFICA.error({message: strSplit[1], timeout: 5, title: "Error"});
                } else {
                    home.NOTIFICA.success({message: "Salvataggio avvenuto con successo", timeout: 2, title: "Success"});
                    if ($('#divWkDocumentiOscurati').is(':visible')) {
                        NS_FUNCTIONS.wkDocumentiOscurati.$wk.worklist().data.flag.filter_changed = true;
                    }
                    refresh ? NS_FUNCTIONS.wkDocumentiOscurati.refresh() : null;

                    var idDocumenti = _LISTA_DOCUMENTI_OSCURATI.split('#');
                    for (var k = 0; k < idDocumenti.length; k++) {
                    	NS_FUNCTIONS.traceDeoscuraDocumento(_PATIENT_ID, idDocumenti[k]);
                    }

                    var listaIden = [];
                    var idenSplit = strSplit[1].split('#');
                    for (var i = 0; i < idenSplit.length; i++) {
                        listaIden[i] = {"idenDettaglio": idenSplit[i], "tabellaModulo": "PIC_MODULI_CONSENSO"};
                    }
                    NS_FUNCTIONS.callAjax.EVC(listaIden);
                }
            });
            dwr.engine.setAsync(true);
        },

        oscura: function(refresh) {
            dwr.engine.setAsync(false);
            var param = {
                "p_VERSIONE": _VERSIONE,
                "p_PATIENT_ID": _PATIENT_ID,
                "p_ASSIGNING_AUTHORITY": _ASSIGNING_AUTHORITY,
                "p_SOSTITUTO_NC": $("#txtSostitutoNomeCognome").val(),
                "p_SOSTITUTO_LN": $("#txtSostitutoLuogoNascita").val(),
                "p_SOSTITUTO_DN": $("#h-txtSostitutoDataNascita").val(),
                "p_SOSTITUTO_R": $("#txtSostitutoResidente").val(),
                "p_SOSTITUTO_DI": $("#txtSostitutoDocumentoIdentita").val(),
                "p_TIPO_SOSTITUTO_DICHIARANTE": $("#h-radTipoSostitutoDichiarante").val(),
                //"p_TIPO": _TIPO,
                "p_LISTA_IDEN_DOCUMENTI": _LISTA_DOCUMENTI_ATTIVATI,
                "p_UTE_INS": _UTE_INS
            };
            toolKitDB.executeProcedureDatasource("PKG_PIC_DOCUMENTO.OSCURA", "PORTALE_PIC", param, function(resp) {
                var strSplit = resp.p_result.split('|');
                if (strSplit[0] === 'KO') {
                    home.NOTIFICA.error({message: strSplit[1], timeout: 5, title: "Error"});
                } else {
                    home.NOTIFICA.success({message: "Salvataggio avvenuto con successo", timeout: 2, title: "Success"});

                    if ($('#divWkDocumentiAttivati').is(':visible')) {
                        NS_FUNCTIONS.wkDocumentiAttivati.$wk.worklist().data.flag.filter_changed = true;
                    }
                    refresh ? NS_FUNCTIONS.wkDocumentiAttivati.refresh() : null;

                    var listaIden = [];
                    var idenSplit = strSplit[1].split('#');
                    for (var i = 0; i < idenSplit.length; i++) {
                        listaIden[i] = {"idenDettaglio": idenSplit[i], "tabellaModulo": "PIC_MODULI_CONSENSO"};
                    }
                    NS_FUNCTIONS.callAjax.EVC(listaIden);
                }
            });
            dwr.engine.setAsync(true);
        }
    },

    evento: {
        attiva: function() {
            dwr.engine.setAsync(false);
            var paramEvento = {
                "p_VERSIONE": _VERSIONE,
                "p_PATIENT_ID": _PATIENT_ID,
                "p_ASSIGNING_AUTHORITY": _ASSIGNING_AUTHORITY,
                "p_SOSTITUTO_NC": $("#txtSostitutoNomeCognome").val(),
                "p_SOSTITUTO_LN": $("#txtSostitutoLuogoNascita").val(),
                "p_SOSTITUTO_DN": $("#h-txtSostitutoDataNascita").val(),
                "p_SOSTITUTO_R": $("#txtSostitutoResidente").val(),
                "p_SOSTITUTO_DI": $("#txtSostitutoDocumentoIdentita").val(),
                "p_TIPO_SOSTITUTO_DICHIARANTE": $("#h-radTipoSostitutoDichiarante").val(),
                //"p_TIPO": _TIPO,
                "p_LISTA_IDEN_EVENTI": _LISTA_EVENTI_OSCURATI,
                "p_UTE_INS": _UTE_INS
            };
            toolKitDB.executeProcedureDatasource("PKG_PIC_EVENTO.ATTIVA", "PORTALE_PIC", paramEvento, function(resp) {
                var strSplit = resp.p_result.split('|');
                if (strSplit[0] === 'KO') {
                    home.NOTIFICA.error({message: strSplit[1], timeout: 5, title: "Error"});
                } else {
                    home.NOTIFICA.success({message: "Salvataggio avvenuto con successo", timeout: 2, title: "Success"});
                    /*** var params = {'refresh': true}; ***/

                    var Nosologici = _LISTA_EVENTI_OSCURATI.split('#');
                    for (var k = 0; k < Nosologici.length; k++) {
                    	NS_FUNCTIONS.traceDeoscuraEvento(_PATIENT_ID, Nosologici[k]);
                    }

                    var listaIden = [];
                    var idenSplit = strSplit[1].split('#');
                    for (var i = 0; i < idenSplit.length; i++) {
                        listaIden[i] = {"idenDettaglio": idenSplit[i], "tabellaModulo": "PIC_MODULI_CONSENSO"};
                    }
                    NS_FUNCTIONS.callAjax.EVC(listaIden, null, NS_FUNCTIONS.evento.aggiornaWkOscurati);
                }
            });
            dwr.engine.setAsync(true);
        },

        oscura: function() {
            dwr.engine.setAsync(false);
            var paramEvento = {
                "p_VERSIONE": _VERSIONE,
                "p_PATIENT_ID": _PATIENT_ID,
                "p_ASSIGNING_AUTHORITY": _ASSIGNING_AUTHORITY,
                "p_SOSTITUTO_NC": $("#txtSostitutoNomeCognome").val(),
                "p_SOSTITUTO_LN": $("#txtSostitutoLuogoNascita").val(),
                "p_SOSTITUTO_DN": $("#h-txtSostitutoDataNascita").val(),
                "p_SOSTITUTO_R": $("#txtSostitutoResidente").val(),
                "p_SOSTITUTO_DI": $("#txtSostitutoDocumentoIdentita").val(),
                "p_TIPO_SOSTITUTO_DICHIARANTE": $("#h-radTipoSostitutoDichiarante").val(),
                //"p_TIPO": _TIPO,
                "p_LISTA_IDEN_EVENTI": _LISTA_EVENTI_ATTIVATI,
                "p_UTE_INS": _UTE_INS
            };
            toolKitDB.executeProcedureDatasource("PKG_PIC_EVENTO.OSCURA", "PORTALE_PIC", paramEvento, function(resp) {
                var strSplit = resp.p_result.split('|');
                if (strSplit[0] === 'KO') {
                    home.NOTIFICA.error({message: strSplit[1], timeout: 5, title: "Error"});
                } else {
                    home.NOTIFICA.success({message: "Salvataggio avvenuto con successo", timeout: 2, title: "Success"});
                    /*** var params = {'refresh': true}; ***/

                    var listaIden = [];
                    var idenSplit = strSplit[1].split('#');
                    for (var i = 0; i < idenSplit.length; i++) {
                        listaIden[i] = {"idenDettaglio": idenSplit[i], "tabellaModulo": "PIC_MODULI_CONSENSO"};
                    }
                    NS_FUNCTIONS.callAjax.EVC(listaIden, null, NS_FUNCTIONS.evento.aggiornaWkAttivati);
                }
            });
            dwr.engine.setAsync(true);
        },

        aggiornaWkOscurati: function() {

        	if ($('#selectListaEventi').val() == 1) {
//			if ($('#divWkEventiAccessoPsOscurati').is(':visible')) {
				NS_FUNCTIONS.wkEventiAccessoPsOscurati.$wk.worklist().data.flag.filter_changed = true;
				NS_FUNCTIONS.wkEventiAccessoPsOscurati.refresh();
			}
			if ($('#selectListaEventi').val() == 2) {
//			if ($('#divWkEventiCartellaAmbOscurati').is(':visible')) {
				NS_FUNCTIONS.wkEventiCartellaAmbOscurati.$wk.worklist().data.flag.filter_changed = true;
				NS_FUNCTIONS.wkEventiCartellaAmbOscurati.refresh();
			}
			if ($('#selectListaEventi').val() == 3) {
//			if ($('#divWkEventiRicoveroOscurati').is(':visible')) {
				NS_FUNCTIONS.wkEventiRicoveroOscurati.$wk.worklist().data.flag.filter_changed = true;
				NS_FUNCTIONS.wkEventiRicoveroOscurati.refresh();
			}
		},

		aggiornaWkAttivati: function() {

			if ($('#selectListaEventi').val() == 1) {
//			if ($('#divWkEventiAccessoPsAttivati').is(':visible')) {
				NS_FUNCTIONS.wkEventiAccessoPsAttivati.$wk.worklist().data.flag.filter_changed = true;
				NS_FUNCTIONS.wkEventiAccessoPsAttivati.refresh();
			}			
			if ($('#selectListaEventi').val() == 2) {
//			if ($('#divWkEventiCartellaAmbAttivati').is(':visible')) {
				NS_FUNCTIONS.wkEventiCartellaAmbAttivati.$wk.worklist().data.flag.filter_changed = true;
				NS_FUNCTIONS.wkEventiCartellaAmbAttivati.refresh();
			}
			if ($('#selectListaEventi').val() == 3) {
//			if ($('#divWkEventiRicoveroAttivati').is(':visible')) {
				NS_FUNCTIONS.wkEventiRicoveroAttivati.$wk.worklist().data.flag.filter_changed = true;
				NS_FUNCTIONS.wkEventiRicoveroAttivati.refresh();
			}
		},

		aggiornaWkInespressi: function() {

			if ($('#selectListaEventi').val() == 1) {
				NS_FUNCTIONS.wkEventiAccessoPsInespressi.$wk.worklist().data.flag.filter_changed = true;
				NS_FUNCTIONS.wkEventiAccessoPsInespressi.refresh();
			}			
			if ($('#selectListaEventi').val() == 2) {
				NS_FUNCTIONS.wkEventiCartellaAmbInespressi.$wk.worklist().data.flag.filter_changed = true;
				NS_FUNCTIONS.wkEventiCartellaAmbInespressi.refresh();
			}
			if ($('#selectListaEventi').val() == 3) {
				NS_FUNCTIONS.wkEventiRicoveroInespressi.$wk.worklist().data.flag.filter_changed = true;
				NS_FUNCTIONS.wkEventiRicoveroInespressi.refresh();
			}
		}
    },

    formatDate: function(ID, date) {
        $("#" + ID).val(date.substring(6, 8) + "/" + date.substring(4, 6) + "/" + date.substring(0, 4));
        $("#h-" + ID).val(date);
    },

    gestAnag: function() {
        dwr.engine.setAsync(false);
        var param = {
            "p_CODICE_FISCALE": _CODICE_FISCALE,
            "p_COGNOME": _COGNOME,
            "p_COM_NASC": _COM_NASC,
            "p_DATA_NASCITA": _DATA_NASCITA,
            "p_NOME": _NOME,
            "p_SESSO": _SESSO
        };
        toolKitDB.executeProcedureDatasource("PKG_PIC_ANAGRAFICA.ESEGUI", "ANAGRAFICA", param, function(resp) {
            var xmlDoc;

            if (window.DOMParser) {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(resp.p_result, "text/xml");
            } else { // Internet Explorer
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(resp.p_result);
            }
			/*** var xml_serializer = new XMLSerializer();
			alert(xml_serializer.serializeToString(xmlDoc)); ***/
            _PATIENT_ID = xmlDoc.getElementsByTagName("ID_RIS")[0].childNodes[0].nodeValue;
        });
        dwr.engine.setAsync(true);

        NS_FUNCTIONS.loadPatient();
    },

    getExternValue: function(extern) {
        return extern === undefined || extern === '' || extern == null ? null : extern;
//        return (!LIB.isValid(extern) ||  extern === '' ||  extern === 'null') ? '' : extern;
    },

    hideChiudi: function() {
        $("#Consenso\\@butChiudi").hide();
    },

    hideSalva: function() {
        $("input").prop("disabled", true);
        $("#Consenso\\@butSalva").hide();
    },

    hideStampa: function() {
        $("#Consenso\\@butStampa").hide();
    },

    loadExtern: function() {
        _ACTION                 = NS_FUNCTIONS.getExternValue($("#ACTION", "#EXTERN").val());
        _ASSIGNING_AUTHORITY    = NS_FUNCTIONS.getExternValue($("#ASSIGNING_AUTHORITY", "#EXTERN").val());
        _TESSERA_SANITARIA      = NS_FUNCTIONS.getExternValue($("#TESSERA_SANITARIA", "#EXTERN").val());
        _CODICE_FISCALE         = NS_FUNCTIONS.getExternValue($("#CODICE_FISCALE", "#EXTERN").val());
        _COGNOME                = NS_FUNCTIONS.getExternValue($("#COGNOME", "#EXTERN").val());
        _COMUNE_NASCITA         = NS_FUNCTIONS.getExternValue($("#COMUNE_NASCITA", "#EXTERN").val());
        _COM_NASC               = NS_FUNCTIONS.getExternValue($("#COM_NASC", "#EXTERN").val());
        _COMUNE_RESIDENZA       = NS_FUNCTIONS.getExternValue($("#COMUNE_RESIDENZA", "#EXTERN").val());
		_INDIRIZZO		        = NS_FUNCTIONS.getExternValue($("#INDIRIZZO", "#EXTERN").val());
        _COM_RES                = NS_FUNCTIONS.getExternValue($("#COM_RES", "#EXTERN").val());
        _DATA_NASCITA           = NS_FUNCTIONS.getExternValue($("#DATA_NASCITA", "#EXTERN").val());
        _NOME                   = NS_FUNCTIONS.getExternValue($("#NOME", "#EXTERN").val());
        _NOSOLOGICO_PAZIENTE    = NS_FUNCTIONS.getExternValue($("#NOSOLOGICO_PAZIENTE", "#EXTERN").val());
        _ID_DOCUMENTO    		= NS_FUNCTIONS.getExternValue($("#ID_DOCUMENTO", "#EXTERN").val());
        _PATIENT_ID             = NS_FUNCTIONS.getExternValue($("#PATIENT_ID", "#EXTERN").val());
        _SESSO                  = NS_FUNCTIONS.getExternValue($("#SESSO", "#EXTERN").val());
        _TIPO                   = NS_FUNCTIONS.getExternValue($("#KEY_LEGAME", "#EXTERN").val());
        _TIPO_CONSENSO          = NS_FUNCTIONS.getExternValue($("#TIPO_CONSENSO", "#EXTERN").val());
        _EMERGENZA_MEDICA       = NS_FUNCTIONS.getExternValue($("#EMERGENZA_MEDICA", "#EXTERN").val());
        _ID_REMOTO              = NS_FUNCTIONS.getExternValue($("#ID_REMOTO", "#EXTERN").val());
        _LOGOUT_ON_CLOSE        = NS_FUNCTIONS.getExternValue($("#LOGOUT_ON_CLOSE", "#EXTERN").val());
        _VERSIONE = "1";
    },

    loadHideParams: function() {
        /* Compilo i campi nascosti */
        $("#h-action").val(_ACTION);
        $("#h-anagrafica").val(_PATIENT_ID);
        $("#h-assigningAuthority").val(_ASSIGNING_AUTHORITY);
        $("#h-nosologicoPaziente").val(_NOSOLOGICO_PAZIENTE);
        $("#h-idDocumento").val(_ID_DOCUMENTO);
        $("#h-tipo").val(_TIPO);
        NS_FUNCTIONS.loadUser();
        $("#h-uteIns").val(_UTE_INS);
        $("#h-versione").val(_VERSIONE);
    },

    loadPatient: function() {

        /* Recupero i dati del paziente selezionato */
        var resp = new PicService().search.patient(_PATIENT_ID);

        if (resp === '') {

            home.NOTIFICA.error({
                message	: "ATTENZIONE: paziente inesistente!",
                title	: "Errore!"
            });

        } else {
            _CODICE_FISCALE = resp.CODICE_FISCALE;
            _COGNOME = resp.COGNOME;
            _COMUNE_NASCITA = resp.COMUNE_NASCITA;
            _COM_NASC = resp.COM_NASC;
            _COMUNE_RESIDENZA = resp.COMUNE_RESIDENZA;
            _TESSERA_SANITARIA = resp.TESSERA_SANITARIA;
			_INDIRIZZO = resp.INDIR;
            _COM_RES = resp.COM_RES;
            _DATA_NASCITA = resp.DATA_NASCITA;
            _NOME = resp.NOME;
            _SESSO = resp.SESSO;
        }
    },

    loadUser: function() {
        /* Recupero i dati dell'utente loggato */
        var resp = new PicService().search.user(home.baseUser.IDEN_PER);

        if (resp === '') {

            home.NOTIFICA.error({
                message	: "ATTENZIONE: utente inesistente!",
                title	: "Errore!"
            });

        } else {
            _UTE_INS = resp.COD_DEC;
        }
    },
    
    getvalueConsensoUnico: function (anagrafica, tipo, titolare_trattamento){

        var resp = null;

        dwr.engine.setAsync(false);
        toolKitDB.getResultDatasource("SDJ.Q_VALUES_CONSENSO_UNICO", "PORTALE_PIC", {"anagrafica": anagrafica, "tipo": tipo, "titolare_trattamento": titolare_trattamento}, null, function(response) {
            if (response.length !== 0) {
                resp = response;
            }else{
            	resp = [{
        				"IDEN" : null, 
            			"TRATTAMENTO_DATI" : null, 
            			"INTEGRAZIONE_PASSATA" : null,
            			"INTEGRAZIONE_FUTURA" : null
            	}]
            }
        });
        dwr.engine.setAsync(true);

        return resp;
    },

    checkvalueConsensoUnico: function (anagrafica){

        var titolare = LIB.isValid($("#TITOLARE_TRATTAMENTO").val()) ? $("#TITOLARE_TRATTAMENTO").val() : NS_FUNCTIONS.getTitolareTrattamentoDefault();
        var ConsensoValues = NS_FUNCTIONS.getvalueConsensoUnico(anagrafica, 'CONSENSO_UNICO', titolare);

        if(ConsensoValues[0].TRATTAMENTO_DATI == null || ConsensoValues[0].INTEGRAZIONE_FUTURA == null || ConsensoValues[0].INTEGRAZIONE_PASSATA == null ){

            home.NOTIFICA.warning({
                message	: "Il consenso attivo per il paziente selezionato risulta incompleto: si prega di inserire un consenso completo prima di procedere alla stampa.",
                title	: "Attenzione!",
                timeout : 10
            });
            return false;
        }else{
            return true;
        }
    },
    
    getTitolareTrattamentoDefault: function (){
   		return home.baseGlobal.TITOLARE_TRATTAMENTO_DEFAULT;
    },
    
    getTitolareTrattamento: function (){
    	if(LIB.isValid(home.baseUser.TITOLARE_TRATTAMENTO)){
    		if(home.baseUser.TITOLARE_TRATTAMENTO.indexOf(',') <0){
    			return home.baseUser.TITOLARE_TRATTAMENTO;
    		}else{
    			return NS_FUNCTIONS.getTitolareFromParam();
    		}
    	}else{
    		NS_FUNCTIONS.getTitolareTrattamentoDefault();
    	}
    },
    
    getTitolareFromParam: function(){
    	var baseUserTitolare = home.baseUser.TITOLARE_TRATTAMENTO;
    	var arrayTitolari = baseUserTitolare.split(',');
		var buttons = [];
		for( var i = 0; i < arrayTitolari.length; i++ ) {
			
			var buttontitolare = $("<span>", {"class":"btn","id":"Tit_" + arrayTitolari[i]});
			buttontitolare.html(arrayTitolari[i]);
			buttontitolare.on("click",function(e){
    			e.preventDefault();
        		e.stopImmediatePropagation();

                NS_FUNCTIONS.url.params.load();
                _URL_PARAMS += NS_FUNCTIONS.url.params.set('TITOLARE_TRATTAMENTO', $(this).text());
                location.href = location.protocol + "//" + location.host + location.pathname + _URL_PARAMS;
                
            	$.dialog.hide();
            	
    		}).css({"height": "30px", "font-size": "medium","background":"#444","cursor":"pointer","color":"white","padding":"2px 20px","margin":"2px", "display": "inline-block"});
			buttons.push(buttontitolare);
		}
		
		var label = 'Scegliere un titolare trattamento:';    		
		
		var $fr = $("<form>").attr("id","ScegliTitoTratt");
		$fr.append(
    			$(document.createElement('p')).append(buttons).css("text-align", "center")
	    );
        
    	$.dialog($fr,{"width":"auto",
    		"title"			: label,
			"showBtnClose" 	: false,
			"modal" 		: true,
            "buttons"		: []
        });
    },

	verificaCodiceFiscaleDefinitivo : function (cfins) {

		if (cfins == '')
			return false;
		if (cfins.length != 16)
			return false;
		var cf = cfins.toUpperCase();
		//var cfReg = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{2}(\d|[L-V])[A-Z]$/;
        var cfReg = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d(\d|[L-V]){2}[A-Z]$/;
		if (!cfReg.test(cf))
			return false;
		var set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
		var s = 0;
		for (var i = 1; i <= 13; i += 2)
			s += setpari.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
		for (var y = 0; y <= 14; y += 2)
			s += setdisp.indexOf(set2.charAt(set1.indexOf(cf.charAt(y))));
		if (s % 26 != cf.charCodeAt(15) - 'A'.charCodeAt(0))
			return false;
		return true;
	},

    gestOscSingleDoc: function(rec){
        //alert(rec)

        var prompt = {};
        prompt.pIdenAnag = $("#PATIENT_ID", "#EXTERN").val();
        prompt.pIdDoc = [];

        for (var i = 0; i < rec.length; i++){
            prompt.pIdDoc.push(rec[i].ID);
        }
        prompt.pData = moment().format('YYYYMMDD');
        prompt.pConferimento = '';
        prompt.pOscuramento = '';

        var $fr = $("<form>").attr("id","ConsensoDOC");

        $.dialog($fr,{
            "width":"250px",
            "title":'Consenso singolo documento sanitario',
            "showBtnClose" : false,
            "buttons": [
                {"label": "Stampa modulo Oscuramento", "action": function (){

                    prompt.pConferimento = '';
                    prompt.pOscuramento = 'S';
                    home.NS_FENIX_PIC.print.stampa_consenso_documento("1", prompt);
                    NS_FUNCTIONS.traceStpConsensoDOC(prompt);
                    $.dialog.hide();
                }
                },
                {"label": "Stampa modulo Conferimento", "action": function (){

                    prompt.pConferimento = 'S';
                    prompt.pOscuramento = '';
                    home.NS_FENIX_PIC.print.stampa_consenso_documento("1", prompt);
                    NS_FUNCTIONS.traceStpConsensoDOC(prompt);
                    $.dialog.hide();
                }
                },
                {"label": "Annulla", "action": function (){
                    $.dialog.hide();
                }
                }
            ]
        });
    },

    url: {
        params: {
            add: function(key, value) {
                return key !== 'ANAGRAFICA' ? NS_FUNCTIONS.url.params.set(key, value) : '';
            },
            load: function() {
                location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                    _URL_PARAMS += NS_FUNCTIONS.url.params.add(key, value);
                });
            },
            set: function(key, value) {
                return _URL_PARAMS === '?' ? key + '=' + value : '&' + key + '=' + value;
            }
        }
    }
};