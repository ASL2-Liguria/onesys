var _PROGRESSIVO_LETTERA = null;
var _IDEN_VERSIONE_INSERITA = null;
var _IDEN_VERSIONE_CORRENTE = null;

var _IDEN_LETTERA_APERTURA = null;

var NS_REGISTRA_FIRMA = {

		Registra : {

			registra : function(p){

				var parametriLettera = typeof p == 'undefined' ? {FIRMA : false} : p;

				switch  (_FUNZIONE_ATTIVA) {

		            case 'LetteraAperturaDSA':

		            	var _functionApertura = function(){
		            	NS_REGISTRA_FIRMA.Lettera.registraApertura(parametriLettera);

		            	};

		            	if (_JSON_CONTATTO == null){
		            		NS_REGISTRA_FIRMA.Registra.registraRicovero({callBack : _functionApertura});
		            	} else {
		            		NS_REGISTRA_FIRMA.Registra.aggiornaRicovero({callBack : _functionApertura});
		            	}

		                break;

		            case 'LetteraChiusuraDSA':

						if ($("#txtDataChiusuraDSA")== ''){
							home.NOTIFICA.error({message: "Attenzione Data Chiusura DSA non valida", title: "Error"});
							return false;
						}

		            	var _functionChiusura = function(){NS_REGISTRA_FIRMA.Lettera.registraChiusura(parametriLettera);};

		            	if (_JSON_CONTATTO.stato.codice != 'DISCHARGED'){
		            		NS_REGISTRA_FIRMA.Registra.dimettiRicovero({callBack : _functionChiusura});
		            	} else {
		            		NS_REGISTRA_FIRMA.Registra.aggiornaRicovero({callBack : _functionChiusura});
		            	}

		                break;

		            default :
		            	home.NOTIFICA.error({message: "Errore durante Registrazione Funzione NON Riconosciuta", title: "Error", timeout: 2, width: 220});
		            	return;
				}


			},

			registraRicovero : function(p){

	            if (!NS_FENIX_SCHEDA.validateFields()) {
	            	return false;
	            }
				if(!$("#cmbTipologiaDSA").find("option:selected").val()  || $("#cmbTipologiaDSA").find("option:selected").val() == "null"){
					home.NOTIFICA.error({message: "Valorizzare tipologia DSA", title: "Error", timeout: 10});
					return false;
				}
	            if (!testSospettoDia()){
	            	home.NOTIFICA.error({message: "Il testo del sospetto diagnostico non è significativo, inserirne uno di senso compiuto", title: "Error", timeout: 10});
	            	return;
	            }
	            if (!testRicettaValida($("#txtCodiceRiceIniDSA").val())){
	            	return;
	            }
				var dataInizio = $("#h-txtDataAperturaDSA").val() + $("#txtOraAperturaDSA").val();
				_JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoEmpty();
            	_JSON_CONTATTO.anagrafica.id = $("#IDEN_ANAG").val();
            	_JSON_CONTATTO.codice.assigningAuthority = 'FENIX';
            	_JSON_CONTATTO.codice.assigningAuthorityArea = 'AMB';
            	_JSON_CONTATTO.dataInizio = dataInizio
            	_JSON_CONTATTO.deleted = false;
            	_JSON_CONTATTO.uteInserimento.id = home.baseUser.IDEN_PER;
            	_JSON_CONTATTO.uteAccettazione.id = $("#h-txtCaseManager").val();
            	_JSON_CONTATTO.stato.codice = 'ADMITTED';
            	_JSON_CONTATTO.regime.codice = _REGIME_DSA;
            	_JSON_CONTATTO.tipo.codice = _TIPO_DSA;
            	_JSON_CONTATTO.mapMetadatiString['NEONATO'] = false;
            	_JSON_CONTATTO.mapMetadatiString['DATA_PRENOTAZIONE'] = $("#h-txtDataRiceIniDSA").val()== '' ? null : $("#h-txtDataRiceIniDSA").val()+"00:00";

            	_JSON_CONTATTO.contattiGiuridici[0].stato = {id : null, codice : "ADMITTED"};
            	_JSON_CONTATTO.contattiGiuridici[0].provenienza.id = $("select[name='cmbReparto']").val();
            	_JSON_CONTATTO.contattiGiuridici[0].percorsoCure = {id : $("#cmbTipologiaDSA option:selected").val(), codice : $("#cmbTipologiaDSA option:selected").attr("data-codice")};
            	_JSON_CONTATTO.contattiGiuridici[0].dataInizio = dataInizio;
            	_JSON_CONTATTO.contattiGiuridici[0].uteInserimento.id = home.baseUser.IDEN_PER;
            	_JSON_CONTATTO.contattiGiuridici[0].regime.codice = _REGIME_DSA;
            	_JSON_CONTATTO.contattiGiuridici[0].tipo.codice = _TIPO_DSA;
            	_JSON_CONTATTO.contattiAssistenziali[0].stato = {id : null, codice : "ADMITTED"};
            	_JSON_CONTATTO.contattiAssistenziali[0].provenienza.id = $("select[name='cmbReparto']").val();
            	_JSON_CONTATTO.contattiAssistenziali[0].dataInizio = dataInizio;
            	_JSON_CONTATTO.contattiAssistenziali[0].uteInserimento.id = home.baseUser.IDEN_PER;

            	var p = {"contatto" : _JSON_CONTATTO, "hl7Event" : "A01", "notifica" : {"show" : "S", "message" : "Inserimento DSA Avvenuto Correttamente", "errorMessage" : "Errore Durante Inserimento DSA", "timeout" : 3}, "cbkSuccess" : p.callBack };

            	/*p.cbkSuccess = function(){

            		_JSON_CONTATTO = NS_CONTATTO_METHODS.contatto;

                    NS_GESTIONE_DSA.idContatto = _JSON_CONTATTO.id;
                    NS_GESTIONE_DSA.numNosologico = _JSON_CONTATTO.codice.codice;
                    NS_GESTIONE_DSA.idContattiAss = _JSON_CONTATTO.contattiAssistenziali[0].id;
                    NS_GESTIONE_DSA.idContattiGiu = _JSON_CONTATTO.contattiGiuridici[0].id;
                    NS_GESTIONE_DSA.idContattiAss =_JSON_CONTATTO.contattiAssistenziali[0].id;
                    NS_GESTIONE_DSA.idContattiGiu = _JSON_CONTATTO.contattiGiuridici[0].id;
                    $("#txtNumNosologico").val(NS_GESTIONE_DSA.numNosologico);

    			};*/

    			NS_CONTATTO_METHODS.admitVisitNotification(p);
			},

			aggiornaRicovero : function(p){

				var dataInizio = $("#h-txtDataAperturaDSA").val() + $("#txtOraAperturaDSA").val();
	            if(!NS_FENIX_SCHEDA.validateFields()){
	            	return false;
	            }
				if(!$("#cmbTipologiaDSA").find("option:selected").val()  || $("#cmbTipologiaDSA").find("option:selected").val() == "null"){
					alert();
					return false;
				}
	            if (!testSospettoDia()){
	            	home.NOTIFICA.error({message: "Il testo del sospetto diagnostico non è significativo, inserirne uno di senso compiuto", title: "Error", timeout: 3, width: 220});
	            	return;
	            }
	            if (!testRicettaValida($("#txtCodiceRiceIniDSA").val())){
	            	return;
	            }
				var dataPrenotazione = $("#h-txtDataRiceIniDSA").val()== '' ? null : $("#h-txtDataRiceIniDSA").val()+"00:00";
				var dataFine = $('#h-txtDataChiusuraDSA').val() == '' ? null : $('#h-txtDataChiusuraDSA').val() + '00:00';

				_JSON_CONTATTO.regime.codice = _REGIME_DSA;
				_JSON_CONTATTO.tipo.codice = _TIPO_DSA;
				_JSON_CONTATTO.contattiGiuridici[0].percorsoCure = {id : $("#cmbTipologiaDSA option:selected").val(), codice : $("#cmbTipologiaDSA option:selected").attr("data-codice")};
				_JSON_CONTATTO.dataFine = dataFine;
				_JSON_CONTATTO.dataInizio = dataInizio;
				_JSON_CONTATTO.uteAccettazione.id = $('#h-txtCaseManager').val();
				_JSON_CONTATTO.uteAccettazione.descrizione = $('#txtCaseManager').val();
				_JSON_CONTATTO.uteModifica.id = home.baseUser.IDEN_PER;
			    _JSON_CONTATTO.mapMetadatiString['DATA_PRENOTAZIONE'] = dataPrenotazione;
			    _JSON_CONTATTO.mapMetadatiString['ESENZIONE_PROPOSTA_CODICE'] = $("#h-txtEsenzioneProposta").val() ;
			    _JSON_CONTATTO.mapMetadatiString['ESENZIONE_PROPOSTA_DESCR'] = $("#txtEsenzioneProposta").attr('data-c-descr') ;

			    _JSON_CONTATTO.codiciICD  = $("#txtDiagnosiPrinc").val() != "" ? NS_GESTIONE_DSA.Diagnosi.getDiagnosi() : {} ;

			    var p = {"contatto" : _JSON_CONTATTO, "hl7Event" : "A08", "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Modifica Ricovero Avvenuta con Successo", "errorMessage" : "Errore Durante Modifica Ricovero"}, "cbkSuccess" :p.callBack};

				NS_CONTATTO_METHODS.updatePatientInformation(p);

			},

			dimettiRicovero : function(p){

				if(!NS_FENIX_SCHEDA.validateFields()){
	            	return false;
	            }
				_JSON_CONTATTO.uteDimissione.id = home.baseUser.IDEN_PER;
	    		_JSON_CONTATTO.dataFine = $('#h-txtDataChiusuraDSA').val();
	    		_JSON_CONTATTO.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'] = {id : $("#h-radDimissioni").val(), codice : null};
	    		_JSON_CONTATTO.contattiGiuridici[_JSON_CONTATTO.contattiGiuridici.length-1].uteModifica.id = home.baseUser.IDEN_PER;
	    		_JSON_CONTATTO.contattiAssistenziali[_JSON_CONTATTO.contattiAssistenziali.length-1].uteModifica.id = home.baseUser.IDEN_PER;
	    		_JSON_CONTATTO.codiciICD  = $("#txtDiagnosiPrinc").val() != "" ? NS_GESTIONE_DSA.Diagnosi.getDiagnosi() : {} ;

	    		var pA03 = {"contatto" : _JSON_CONTATTO, "updateBefore" : true, "hl7Event" : "A03", "notifica" : {"show" : "S", "timeout" : 2, "width" : 220, "message" : "Dimissione DSA Avvenuta con Successo", "errorMessage" : "Errore Durante la Dimissione DSA"}, "cbkSuccess" : function(){ p.callBack(); }};
	        	NS_CONTATTO_METHODS.dischargeVisit(pA03);

			}

		},

		Firma : {

			firmaDSA : function(p){

				dwr.engine.setAsync(false);

				NS_REGISTRA_FIRMA.Lettera.getLetteraAperturaAttiva();
		    	NS_REGISTRA_FIRMA.Lettera.getProgressivoLettera();

		    	dwr.engine.setAsync(true);

				if (typeof p == 'undefined'){

					home.FIRMA = home.NS_FENIX_FIRMA.getInstance(home.FIRMA_ADT);
					// home.NS_FENIX_FIRMA.getInstance(home.FIRME_ADT["SDO"]);

					/*
					 var prompts = 	"&promptpIdenApertura=" + _IDEN_LETTERA_APERTURA +
					 "&promptpIdenChiusura=" + _IDEN_VERSIONE_INSERITA +
					 "&promptpIdenContatto=" + _JSON_CONTATTO.id +
					 "&promptpProgrPrestazione=" + _JSON_CONTATTO.contattiGiuridici[_JSON_CONTATTO.contattiGiuridici.length - 1].percorsoCure.codice +
					 "&promptpFirma=" + "S";
					 */
					var prompts = 	"&promptpIdenContatto=" + _JSON_CONTATTO.id +
						"&promptpFunzioneIni=LetteraAperturaDSA"+
						"&promptpFunzioneFine=LetteraChiusuraDSA" +
						"&promptprogressivo=" + _JSON_CONTATTO.contattiGiuridici[_JSON_CONTATTO.contattiGiuridici.length - 1].percorsoCure.codice +
						"&promptpFirma=" + "S";

					p = {
							"STAMPA" : {"PRINT_REPORT":"RELAZIONE_DSA", "PRINT_DIRECTORY": "DSA" , "PRINT_PROMPT": prompts},
							"FIRMA" : {}
						};

				}

				p['FIRMA'].FIRMA_COMPLETA = false;
				p['FIRMA'].PRIMA_FIRMA = true;
	    		p['FIRMA'].IDEN_VERSIONE = _IDEN_VERSIONE_INSERITA;
	    		p['FIRMA'].IDEN_VERSIONE_PRECEDENTE = _IDEN_VERSIONE_CORRENTE;
	    		p['FIRMA'].TIPO_DOCUMENTO = "DSA";
	    		p['FIRMA'].TABELLA = "ADT.LETTERA_VERSIONI";
	    		p['FIRMA'].KEY_CONNECTION = "ADT";
	    		p['FIRMA'].CALLBACK = function(){NS_FENIX_SCHEDA.chiudi({'refresh' : true});};

	    		logger.debug("Firma - NS_FIRMA_SDO.firma - p -> " + JSON.stringify(p));

	    		home.FIRMA.initFirma(p);
			}
		},

		Lettera : {

			registraApertura : function(parametri){
				// salvataggio dati apertura DSA in lettera_sezione e lettera_versioni
			    var anamnesi = $("#txtAnamnesi").val();
			 	var sospettoDia = $("#txtSospettoDia").val();
			 	var esameObi = $("#txtEsameObi").val();
			 	var esamiPrec = $("#txtEsamiPrec").val();
			 	var codiceRice = $("#txtCodiceRiceIniDSA").val();

			 	if(anamnesi!="" || sospettoDia!="" || esameObi!="" || esamiPrec!="" || codiceRice!=""){

			 		var aTesto = new Array(5);
			 		//anamnesi = anamnesi.replace(/\n/g,'%0D%0A');
			 		anamnesi=replaceCaratteriSpeciali(anamnesi);
			 		//esameObi = esameObi.replace(/\n/g,'%0D%0A');
			 		esameObi=replaceCaratteriSpeciali(esameObi);
			 		//sospettoDia = sospettoDia.replace(/\n/g,'%0D%0A');
			 		sospettoDia = replaceCaratteriSpeciali(sospettoDia);
			 		//esamiPrec = esamiPrec.replace(/\n/g,'%0D%0A');
			 		esamiPrec = replaceCaratteriSpeciali(esamiPrec);
			     	aTesto[0] = anamnesi;
			     	aTesto[1] = sospettoDia;
			     	aTesto[2] = esameObi;
			     	aTesto[3] = esamiPrec;
			     	aTesto[4] = codiceRice;

			     	aggiornaDatiContatto();

			     	var db = $.NS_DB.getTool({setup_default:{datasource:'ADT',async:false}});
			     	// alert('_LETTERA_FIRMATA: ' + _LETTERA_FIRMATA);
			     	// alert('parametri.FIRMA: ' + parametri.FIRMA);


			     	var parametriLetteraApertura = {
							pFunzione:'LetteraAperturaDSA',
							pIdenContatto:{v: _JSON_CONTATTO.id, t:'N'},
							pIdenPer:{v:home.baseUser.IDEN_PER,t:'N'},
							pDaFirmare: parametri.FIRMA && _LETTERA_FIRMATA ? 'S' : 'N',
							pIdSezioni: {v:['txtAnamnesi','txtSospettoDia','txtEsameObi','txtEsamiPrec','txtCodiceRiceIniDSA'],t:'A'},
							plbSezioni: {v:['Anamnesi','Sospetto Diagnostico','Esame Obiettivo','Risultati esami precedenti','Codice ricetta iniziale'],t:'A'},
							pTestoPiano: {v:aTesto,t:'A'},
							p_result:{t:'V',d:'O'}
						};

			     	if (_IDEN_VERSIONE_CORRENTE != null){
			     		parametriLetteraApertura.P_IDEN_PRECEDENTE = {v : _IDEN_VERSIONE_CORRENTE, t : 'N'};
			     	}

			     	var xhr =db.call_procedure(
					{
						id: 'LETTERA_SAVE_GEN',
						parameter : parametriLetteraApertura

					});
			     	xhr.done(function(data, textStatus, jqXHR){
			     		eval('var respApertura = ' + data.p_result.toString().split('$')[1]);
						_IDEN_VERSIONE_INSERITA = respApertura.data.idenVersione;
						dwr.engine.setAsync(false);
				    	NS_REGISTRA_FIRMA.Lettera.getLetteraCorrente();
				    	NS_REGISTRA_FIRMA.Lettera.getLetteraFirmata();
				    	dwr.engine.setAsync(true);
				    	home.NOTIFICA.success({message: 'Salvataggio dati clinici primo accesso eseguito!', timeout: 1, title: 'Success', width : 220});
			     	});

			     	xhr.fail(function(data){
                        logger.error(JSON.stringify(data));
                        home.NOTIFICA.error({message: "Attenzione errore in salvataggio dati clinici primo accesso", title: "Error"});
                    });
			 	}

			},

			registraChiusura : function(parametri){

				var aTesto = new Array(3);
				//aTesto[0] = $("#txtRisultati").val().replace(/\n/g,'%0D%0A').replace(/%/g,'%25').replace(/#/g,'%23').replace(/&/g,'%26');
				//aTesto[1] = $("#txtSintesiClinica").val().replace(/\n/g,'%0D%0A').replace(/%/g,'%25').replace(/#/g,'%23').replace(/&/g,'%26');
				//aTesto[2] = $("#txtTerapieProposte").val().replace(/\n/g,'%0D%0A').replace(/%/g,'%25').replace(/#/g,'%23').replace(/&/g,'%26');

				aTesto[0]=replaceCaratteriSpeciali($("#txtRisultati").val());
				aTesto[1]=replaceCaratteriSpeciali($("#txtSintesiClinica").val());
				aTesto[2]=replaceCaratteriSpeciali($("#txtTerapieProposte").val());

				var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

				/**
				 * Quando Firmo il record inserito e ATTIVO = N.
				 * Se Come prima registrazione provo a firmare il record che inserisco � comunque attivo.
				 */
				var parametriLetteraChiusura = {
						pFunzione : 'LetteraChiusuraDSA',
						pIdenContatto : {v : NS_GESTIONE_DSA.idContatto, t : 'N'},
						pIdenPer : {v : home.baseUser.IDEN_PER, t : 'N'},
						pDaFirmare : {v:parametri.FIRMA && _LETTERA_FIRMATA ? 'S' : 'N', t:'V'},
						pIdSezioni : {v : ['txtRisultati','txtSintesiClinica','txtTerapieProposte'],t:'A'},
						plbSezioni : {v : ['Risultati degli esami praticati','Sintesi clinica e formulazione della diagnosi','Eventuali proposte terapeutiche'],t:'A'},
						pTestoPiano : {v : aTesto, t : 'A'},
						p_result : {t : 'V', d : 'O'}
				};
				if (_IDEN_VERSIONE_CORRENTE != null){
					parametriLetteraChiusura.P_IDEN_PRECEDENTE = {v : _IDEN_VERSIONE_CORRENTE, t : 'N'};
		     	}

				var xhr =db.call_procedure(
				{
					id: 'LETTERA_SAVE_GEN',
					parameter : parametriLetteraChiusura
				});
				xhr.done(function(data, textStatus, jqXHR){
						eval('var respChiusura = ' + data.p_result.toString().split('$')[1]);
						_IDEN_VERSIONE_INSERITA = respChiusura.data.idenVersione;
						dwr.engine.setAsync(false);
				    	NS_REGISTRA_FIRMA.Lettera.getLetteraCorrente();
				    	NS_REGISTRA_FIRMA.Lettera.getLetteraFirmata();
				    	dwr.engine.setAsync(true);
						home.NOTIFICA.success({message: 'Salvataggio dati clinici chiusura DSA eseguito!', timeout: 1, title: 'Success', width : 220});

						if (parametri.FIRMA){
							NS_REGISTRA_FIRMA.Firma.firmaDSA();
						}

						// NS_FENIX_SCHEDA.chiudi({'refresh':true});
				});
				xhr.fail(function(data){
					logger.error(JSON.stringify(data));
                    home.NOTIFICA.error({message: "Attenzione errore in salvataggio dati clinici chiusura dsa", title: "Error"});
				});
			 },

			 getLetteraFirmata : function(){

				 /**
				  * Se Viene passato un IDEN_CONTATTO viene controllato se per tale contatto ci sono lettere firmate.
				  * Se presenti viene gestita la visualizzazione del BUTTON.
				  * Se NON presenti la prima firma produce un record identico alla registrazione (STATO = R e ATTIVO = S) in modo che se chiudono rimane il salvataggio (TIPO WHALE).
				  *
				  * Chiamata in fase di modifica all'init della pagina
				  * Chiamata dopo firma documento per hide button salva.
				  *
				  * SELECT NVL(COUNT(*),0) AS LETTERE_FIRMATE FROM LETTERA_VERSIONI WHERE IDEN_CONTATTO = :IDEN_CONTATTO AND FUNZIONE = :FUNZIONE AND STATO = 'F'
				  */

				 if (_JSON_CONTATTO == null){
					 _LETTERA_FIRMATA = false;
					 return;
				 }

				 var param = {"IDEN_CONTATTO" : _JSON_CONTATTO.id, 'FUNZIONE' : _FUNZIONE_ATTIVA};
				 dwr.engine.setAsync(false);
				 toolKitDB.getResultDatasource("DSA.Q_LETTERE_FIRMATE","ADT",param, null,function(resp){
					// alert('_LETTERA_FIRMATA: ' + JSON.stringify(resp))
					_LETTERA_FIRMATA = resp[0].LETTERE_FIRMATE > 0 ? true : false;
					NS_GESTIONE_DSA.Style.showHideButtonSalva();

				 });

				 dwr.engine.setAsync(true);

			 },

			 getProgressivoLettera : function(){

				 /**
				  * Restituisce il numero di lettere firmate incrementato di 1
				  * Viene chiamata in fase di archiviazione del documento per dare un progressivo al nome del file.
				  *
				  * SELECT (NVL(COUNT(IDEN_CONTATTO),-1)+1) AS PROGRESSIVO_LETTERA_FIRMATA FROM ADT.LETTERA_VERSIONI WHERE FUNZIONE = :FUNZIONE AND IDEN_CONTATTO = :IDEN_CONTATTO AND STATO = 'F'
				  */

				 if (_JSON_CONTATTO == null){
					 _PROGRESSIVO_LETTERA = 1;
					 return;
				 }

				 var param = {"IDEN_CONTATTO" : _JSON_CONTATTO.id, 'FUNZIONE' : _FUNZIONE_ATTIVA};
				 dwr.engine.setAsync(false);
				 toolKitDB.getResultDatasource("DSA.Q_PROGRESSIVO_LETTERA","ADT",param, null,function(resp){
					 // alert('_PROGRESSIVO_LETTERA: ' + JSON.stringify(resp));
					 _PROGRESSIVO_LETTERA = resp[0].PROGRESSIVO_LETTERA_FIRMATA;
					 _LETTERA_FIRMATA = resp[0].PROGRESSIVO_LETTERA_FIRMATA > 1 ? true : false;
				 });

				 dwr.engine.setAsync(true);

			 },

			 getLetteraCorrente : function(){

				 /**
				  * Assegna alla variabile _IDEN_VERSIONE_CORRENTE l'iden della lettera che si sta visualizzando (LETTERA ATTIVA).
				  * Viene Utilizzata per disattivare il record una volta registrato il nuovo sempre che l'archiviazione del documento sia andata a buon fine.
				  * Alla prima firma la lettera corrente (ATTIVA) e quella inserita sono le stesse.
				  * Non crea problemi in fase di inserimento in quanto prima viene disattivata e poi viene subito riattivata.
				  *
				  * SELECT NVL(IDEN,0) AS LETTERA_ATTIVA FROM ADT.LETTERA_VERSIONI WHERE FUNZIONE = :FUNZIONE AND IDEN_CONTATTO = :IDEN_CONTATTO AND ATTIVO = 'S' and DELETED = 'N'
				  */

				 if (_JSON_CONTATTO == null){
					 _IDEN_VERSIONE_CORRENTE = null;
					 return;
				 }

				 var param = {"IDEN_CONTATTO" : _JSON_CONTATTO.id, 'FUNZIONE' : _FUNZIONE_ATTIVA};
				 dwr.engine.setAsync(false);
				 toolKitDB.getResultDatasource("DSA.Q_LETTERA_ATTIVA","ADT",param, null,function(resp){
					 // alert('_IDEN_VERSIONE_CORRENTE: ' + JSON.stringify(resp));
					 _IDEN_VERSIONE_CORRENTE = typeof resp[0] == 'undefined' ? null : resp[0].LETTERA_ATTIVA;
				 });

				 dwr.engine.setAsync(true);

			 },

			 getLetteraAperturaAttiva : function(){

				 var param = {"IDEN_CONTATTO" : _JSON_CONTATTO.id, 'FUNZIONE' : 'LetteraAperturaDSA'};
				 dwr.engine.setAsync(false);
				 toolKitDB.getResultDatasource("DSA.Q_LETTERA_ATTIVA","ADT",param, null,function(resp){
					 // alert('_IDEN_LETTERA_APERTURA: ' + JSON.stringify(resp));
					 _IDEN_LETTERA_APERTURA = typeof resp[0] == 'undefined' ? null : resp[0].LETTERA_ATTIVA;
				 });

				 dwr.engine.setAsync(true);
			 }

		},

		Dati : {

			getRegimeTipo : function(){

				 dwr.engine.setAsync(false);
				 toolKitDB.getResultDatasource("DSA.Q_REGIME_TIPO_DSA","ADT",null, null,function(resp){
					 // alert('_REGIME_TIPO_DSA: ' + JSON.stringify(resp));
					 _REGIME_DSA = typeof resp[0] == 'undefined' ? null : resp[0].CODICE_REGIME;
					 _TIPO_DSA = typeof resp[0] == 'undefined' ? null : resp[0].CODICE_TIPO;
				 });

				 dwr.engine.setAsync(true);
			 }

		}
};

function replaceCaratteriSpeciali(t){
	var t1;
	t1=t.replace(/%/g,'%25').replace(/#/g,'%23').replace(/&/g,'%26').replace(/\n/g,'%0D%0A');
	return t1;
}

function aggiornaDatiContatto(){
	_JSON_CONTATTO = NS_CONTATTO_METHODS.contatto;

    NS_GESTIONE_DSA.idContatto = _JSON_CONTATTO.id;
    NS_GESTIONE_DSA.numNosologico = _JSON_CONTATTO.codice.codice;
    NS_GESTIONE_DSA.idContattiAss = _JSON_CONTATTO.contattiAssistenziali[0].id;
    NS_GESTIONE_DSA.idContattiGiu = _JSON_CONTATTO.contattiGiuridici[0].id;
    NS_GESTIONE_DSA.idContattiAss =_JSON_CONTATTO.contattiAssistenziali[0].id;
    NS_GESTIONE_DSA.idContattiGiu = _JSON_CONTATTO.contattiGiuridici[0].id;
    $("#txtNumNosologico").val(NS_GESTIONE_DSA.numNosologico);

}

function testSospettoDia(){
	// questo campo va in ricetta come diagnosi : deve contenere almeno un carattere alfanumerico
	var testo=$("#txtSospettoDia").val();
	var pattern = new RegExp(/[A-Za-z0-9]/g);
    return pattern.test(testo) ;
}

function testRicettaValida(testo){
	// controllo lunghezza e validità campo codice ricetta
	if (testo.length>15 || testo.length<15){
		home.NOTIFICA.error({message: "Attenzione il codice della ricetta "+testo+" risulta di lunghezza errata (<>15)", title: "Error"});
		return false;
	}
	else{
		var pattern = new RegExp("^[A-Z0-9]+$");
		if (!pattern.test(testo)){
			home.NOTIFICA.error({message: "Attenzione il codice della ricetta "+testo+" non contiene cifre valide", title: "Error"});
		}
		return pattern.test(testo)
	}
}