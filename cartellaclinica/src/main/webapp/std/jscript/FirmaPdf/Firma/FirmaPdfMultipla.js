/**
 * Firma multipla
 * (de gestire, quando sarà richiesto, l'unione dei pdf in visualizzazione)
 * 
 * @author  linob
 * @version 1.0
 * @since   2014-12-09
 */

$(document).ready(function() {
	
	if (opener.top.name == 'schedaRicovero'){
		window.WindowCartella = opener.top;		
	}else{
		if ((typeof opener.document.EXTERN.arrivatoDa)!='undefined' && opener.document.EXTERN.arrivatoDa.value==='PS'){
			window.WindowCartella = opener.top;
		}else{
			window.WindowCartella = opener.opener.top;			
		}
	}

	NS_FIRMA.init();
	NS_FIRMA.setEvents();
})

/**
 * Firma multipla: mappatura delle funzioni salvate nella configurazione
 * 
 * @author  linob
 * @version 1.0
 * @since   2014-12-09
 */
var NS_MAPPING_FIRMA = {

	letteraDimissione : {

		LETTERA_STANDARD : function(url, parameters, mapping) {
			return url + NS_MAPPING_FIRMA.letteraDimissione.componiUrlReport(parameters,mapping);
		},
		
		LETTERA_PRIMO_CICLO : function(url, parameters, mapping) {
			return url + NS_MAPPING_FIRMA.letteraDimissione.componiUrlReport(parameters,mapping);
		},

		LETTERA_AL_CURANTE : function(url, parameters, mapping) {
			return url + NS_MAPPING_FIRMA.letteraDimissione.componiUrlReport(parameters,mapping);
		},

		LETTERA_PROSECUZIONE : function(url, parameters, mapping) {
			return url + NS_MAPPING_FIRMA.letteraDimissione.componiUrlReport(parameters,mapping);
		},		
		
		LETTERA_DIMISSIONI_DH : function(url, parameters, mapping) {
			return url + NS_MAPPING_FIRMA.letteraDimissione.componiUrlReport(parameters,mapping)
		},

		LETTERA_FARMACIA : function(url, parameters, mapping) {
			return url + NS_MAPPING_FIRMA.letteraDimissione.componiUrlReport(parameters,mapping)
		},
		
		LETTERA_TRASFERIMENTO : function(url, parameters, mapping) {
			return url + "&prompt<pVersione>="+parameters.idenVersione;
		},
		SEGNALAZIONE_DECESSO : function(url, parameters, mapping) {
			return url + "&prompt<pIdenVisita>="+parameters.idenVisita;
		},
/**
 * Funzione per la composizione delle varie url:
 * @params:
 * parameters: parametri ricevuti in post
 * mapping: i parametri mappati nella configurazione
 */		
		componiUrlReport:function(parameters, mapping){
//			alert(typeof parameters.idenVisita+'\n'+parameters.idenVisita)
			var sf = "&prompt<pVisita>=" + 	parameters.idenVisita;
			sf += "&prompt<pFunzione>=" + 	mapping.funzione;
			sf += "&prompt<pFunzioneAssociata>=" + mapping.funzioneAssociata;
			if (mapping.funzione==='LETTERA_FARMACIA' || mapping.funzione==='LETTERA_PRIMO_CICLO'/*&& mapping.funzioneAssociata!=''*/){
				sf += "&prompt<pIdenVersioneAssociata>=" + 	parameters.idenVersione;
			}
			if (mapping.funzione!='LETTERA_FARMACIA'){
				sf += "&prompt<pIdenAnag>=" + 	parameters.idenAnag;
				sf += "&prompt<pReparto>=" + 	parameters.repartoDati;				
			}

			sf += "&prompt<pWebUser>=" + WindowCartella.baseUser.LOGIN;
			sf += NS_MAPPING_FIRMA.letteraDimissione.allegaDatiLaboratorio(parameters);
			
			return sf;
		},

/**
* Funzione per la composizione delle varie url:
* @params:
* parameters: parametri ricevuti in post
*/		
		allegaDatiLaboratorio:function(parameters){
			var sfdati = '';
			if(opener._ALLEGATO_DATI_LABO.SETTINGS[opener._ALLEGATO_DATI_LABO.SETTINGS['FUNZIONE_ATTIVA']]['allegato']){
				if(opener._ALLEGATO_DATI_LABO.allegato== 'S'){
					sfdati = "&prompt<pAllega>=S";
					sfdati += "&prompt<pNosologico>="+$('input[name="paramNosologico"]').val();
					sfdati += "&prompt<pIdPaziente>="+$('input[name="paramIdPaziente"]').val();
					sfdati += "&prompt<pDaData>="+$('input[name="paramDaData"]').val();
					sfdati += "&prompt<pAData>="+$('input[name="paramAData"]').val();
					sfdati += "&prompt<pModalita>="+$('input[name="paramModalita"]').val();
					sfdati += "&prompt<pProvRisultati>="+$('input[name="paramProvRisultati"]').val();
					sfdati += "&prompt<pBranca>="+$('input[name="paramBranca"]').val();
					sfdati += "&prompt<pNumRichieste>="+$('input[name="paramNumRichieste"]').val();					
				}else{
					sfdati = "&prompt<pAllega>=N";
					sfdati += "&prompt<pNosologico>=";
					sfdati += "&prompt<pIdPaziente>=";
					sfdati += "&prompt<pDaData>=";
					sfdati += "&prompt<pAData>=";
					sfdati += "&prompt<pModalita>=";
					sfdati += "&prompt<pProvRisultati>=";
					sfdati += "&prompt<pBranca>=";
					sfdati += "&prompt<pNumRichieste>=";					
				}
			}else{
				sfdati = "&prompt<pAllega>=N";
				sfdati += "&prompt<pNosologico>=";
				sfdati += "&prompt<pIdPaziente>=";
				sfdati += "&prompt<pDaData>=";
				sfdati += "&prompt<pAData>=";
				sfdati += "&prompt<pModalita>=";
				sfdati += "&prompt<pProvRisultati>=";
				sfdati += "&prompt<pBranca>=";
				sfdati += "&prompt<pNumRichieste>=";
			}			
			
			return sfdati;
		},
/**
* Funzione per la preparazione del salvataggio su cc_firma_pdf
* @params:
* parameters: parametri ricevuti in post
* mapping: i parametri mappati nella configurazione
* @return:
* record salvato su cc_firma_pdf dove verrà inserita successivamente la firma
*/	
		preparaFirmaLettera : function(mapping, parameters) {
//			alert('preparaFirmaLettera inizio')
			var ret;
			var valoriParametri = new Array();
			var tipiParametri = new Array();
//			alert(mapping.funzione+'\n'+mapping.tabella+'\n'+parameters.idenVersione+'\n'+parameters.idenVisita+'\n'+WindowCartella.baseUser.IDEN_PER);
			tipiParametri.push('VARCHAR');
			valoriParametri.push(mapping.funzione);

			tipiParametri.push('VARCHAR');
			valoriParametri.push(mapping.tabella);

//			 Iden Della Lettera
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenVersione);
//			 LETTERA_STANDARD, LETTERA_DIMISSIONI_DH, LETTERA_PROSECUZIONE ->  iden_visita = iden_ricovero
//			 LETTERA_PRIMO_CICLO, LETTERA_AL_CURANTE -> iden_visita = iden_accesso selezionato
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenVisita);//iden ricovero per LETT

			tipiParametri.push('NUMBER');
			valoriParametri.push(WindowCartella.baseUser.IDEN_PER);

//			fine parametri per la SP
			dwr.engine.setAsync(false);
			dwrPreparaFirma.preparaFirma(mapping.beforeProcedure, tipiParametri,
					valoriParametri, function(resp) {
						ret = resp == "" ? "OK" : resp;
					});
//			alert('preparaFirmaLettera fine');
			dwr.engine.setAsync(true);
			return ret;
		},
/**
* Funzione per la preparazione del salvataggio su cc_firma_pdf nel caso di LETTERA_FARMACIA(sia come funzione singola che come lettera associata)
* e nel caso di LETTERA_PRIMO_CICLO(dh)
* @params:
* parameters: parametri ricevuti in post
* mapping: i parametri mappati nella configurazione
* @return:
* record salvato su cc_firma_pdf dove verrà inserita successivamente la firma
*/			
		preparaFirmaLetteraPrimoCiclo : function(mapping, parameters) {
//			alert('preparaFirmaLetteraPrimoCiclo inizio')
			var ret;
			if (parameters.idenTerapiaDomiciliare=='0' && parameters.checkPrimoCiclo == '1'){
				var valoriParametri = new Array();
				var tipiParametri = new Array();
//				alert(mapping.funzione+'\n'+mapping.tabella+'\n'+parameters.idenVersione+'\n'+parameters.idenVisita+'\n'+WindowCartella.baseUser.IDEN_PER);
				tipiParametri.push('VARCHAR');
				valoriParametri.push(mapping.funzione);
	
				tipiParametri.push('VARCHAR');
				valoriParametri.push(mapping.tabella);
	
//				 Iden Della Lettera
				tipiParametri.push('NUMBER');
				valoriParametri.push(parameters.idenVersione);
//				 LETTERA_STANDARD, LETTERA_DIMISSIONI_DH, LETTERA_PROSECUZIONE ->  iden_visita = iden_ricovero
//				 LETTERA_PRIMO_CICLO, LETTERA_AL_CURANTE -> iden_visita = iden_accesso selezionato
				tipiParametri.push('NUMBER');
				valoriParametri.push(parameters.idenVisita);//iden ricovero per LETT
	
				tipiParametri.push('NUMBER');
				valoriParametri.push(WindowCartella.baseUser.IDEN_PER);
	
//				fine parametri per la SP
				dwr.engine.setAsync(false);
				dwrPreparaFirma.preparaFirma(mapping.beforeProcedure, tipiParametri,
						valoriParametri, function(resp) {
							ret = resp == "" ? "OK" : resp;
						});
//				alert('preparaFirmaLettera fine');
				dwr.engine.setAsync(true);
			}else{
				ret='KO';				
			}
//			alert(ret)
			return ret;
		},	

/**
* Funzione di salvataggio dopo la firma
* @params:
* parameters: parametri ricevuti in post
* mapping: i parametri mappati nella configurazione
* pdfFirmato: base64 del pdf da firmare
* @return:
* completa il salvataggio su:
* - cc_lettera_versioni: stato='F', attivo='S'
* - cc_firma_pdf: pdf_firmato = base64 firmato
* - tab_eventi: crea l'evento per la gestione dell'invio sul repository della lettera e per l'invio del primo ciclo in farmacia
*/			
//		Funzione di salvataggio dopo la firma, riceve i parametri di configurazione + il pdf da salvare nella tabella cc_firma_pdf
		salvaFirmaLettera : function(mapping,parameters,pdfFirmato) {
//			Procedura di salvataggio dopo la firma della lettera 
			var valoriParametri = new Array();	
			var tipiParametri = new Array();
//			da qui si impostano i parametri da passare alla SP
//			alert(mapping.funzione+'\n'+mapping.tabella+'\n'+parameters.idenVersione+'\n'+parameters.idenVisita+'\n'+pdfFirmato)
			tipiParametri.push('VARCHAR');
			valoriParametri.push(mapping.funzione);
		
			tipiParametri.push('VARCHAR');
			valoriParametri.push(mapping.tabella);
		
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenVersione);	
		
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenVisita);
			
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenTerapiaDomiciliare);				
			
			tipiParametri.push('CLOB');
			valoriParametri.push(pdfFirmato);

			dwr.engine.setAsync(false);
//			viene usata la procedura su db LETTERA.archiviaFirma
			dwrPreparaFirma.archiviaFirmaMulti(mapping.afterProcedure,tipiParametri,valoriParametri,function(resp){
				ret = resp == "" ? "OK" : resp;
			});
			dwr.engine.setAsync(true);
			return ret;
		},
		
		salvaFirmaLetteraTrasferimento:function(mapping,parameters,pdfFirmato) {
			var valoriParametri = new Array();	
			var tipiParametri = new Array();
			//da qui si impostano i parametri da passare alla SP
			tipiParametri.push('VARCHAR');
			valoriParametri.push(mapping.funzione);
		
			tipiParametri.push('VARCHAR');
			valoriParametri.push(mapping.tabella);
		
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenVersione);	
			
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenVisita);	
		
			tipiParametri.push('CLOB');
			valoriParametri.push(pdfFirmato);
		
			dwr.engine.setAsync(false);
//			viene usata la procedura su db UPD_LET_TRASF_FIRMATO
			dwrPreparaFirma.archiviaFirma(mapping.afterProcedure,tipiParametri,valoriParametri,function(resp){
				ret = resp == "" ? "OK" : resp;
			});
			dwr.engine.setAsync(true);
			return ret;
		}
		
	},
	
	consulenzeRefertazione:{
		CONSULENZE_REFERTAZIONE : function(url, parameters, mapping) {
			return url + NS_MAPPING_FIRMA.consulenzeRefertazione.componiUrlReport(parameters,mapping);
		},
		
		/**
		 * Funzione per la composizione delle varie url:
		 * @params:
		 * parameters: parametri ricevuti in post
		 * mapping: i parametri mappati nella configurazione
		 */		

		componiUrlReport : function(parameters, mapping) {
			// alert(typeof parameters.idenTes+'\n'+parameters.idenReferto)
			var sf = "&prompt<pIdenTR>=" + parameters.idenTes;
			sf += "&prompt<pIdenVersione>="+ parameters.idenVersione; 

			return sf;
		},
		
		PreparaFirmaConsulenza:function(mapping, parameters){
			// Chiama la procedura che inserisce all'interno di cc_firma_pdf un record su cui fare l'update
			var ret;
			var valoriParametri = new Array();	
			var tipiParametri = new Array();	
			
			//da qui si impostano i parametri da passare alla SP tipi['CLOB','VARCHAR',,'NUMBER','FLOAT']	
			tipiParametri.push('VARCHAR');
			valoriParametri.push(mapping.funzione);	
		
			tipiParametri.push('VARCHAR');
			valoriParametri.push(mapping.tabella);	
			// Iden Del Referto
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenVersione);		
			// Iden Visita di Testata Richieste			
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenVisita);	
			
			tipiParametri.push('NUMBER');
			valoriParametri.push(WindowCartella.baseUser.IDEN_PER);					
		
			//fine parametri per la SP		
			dwr.engine.setAsync(false);
			dwrPreparaFirma.preparaFirma(mapping.beforeProcedure, tipiParametri,
					valoriParametri, function(resp) {
						ret = resp == "" ? "OK" : resp;
					});
			dwr.engine.setAsync(true);
			return ret;
		},
		
		salvaPdfConsulenza:function(mapping,parameters,pdfFirmato){
			var valoriParametri = new Array();	
			var tipiParametri = new Array();
			//da qui si impostano i parametri da passare alla SP
			//Funzione
			tipiParametri.push('VARCHAR');
			valoriParametri.push(mapping.funzione);
			//Tabella
			tipiParametri.push('VARCHAR');
			valoriParametri.push(mapping.tabella);
			//idenTab = idenReferto da salvare
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenVersione);
			//idenRef = idenReferto da sostituire
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenRefOld);
			
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenVisita);	
		
			tipiParametri.push('CLOB');
			valoriParametri.push(pdfFirmato);
			//iden della richiesta		
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenTes);
		
			tipiParametri.push('NUMBER');
			valoriParametri.push(WindowCartella.baseUser.IDEN_PER);
		
			tipiParametri.push('VARCHAR');
			valoriParametri.push(parameters.dataEsame);
		
			tipiParametri.push('VARCHAR');
			valoriParametri.push(parameters.oraEsame);
		
			tipiParametri.push('VARCHAR');
			valoriParametri.push(parameters.validaFirma);
		
			dwr.engine.setAsync(false);
//			viene usata la procedura su db oe_consulenza.saveAfterProcFirma
			dwrPreparaFirma.archiviaFirma(mapping.afterProcedure,tipiParametri,valoriParametri,function(resp){
				ret = resp == "" ? "OK" : resp;
			});
			dwr.engine.setAsync(true);
			return ret;
		}
	},
	
	visitaAnestesiologica:{
		VISITA_ANESTESIOLOGICA : function(url, parameters, mapping) {
			return url + NS_MAPPING_FIRMA.visitaAnestesiologica.componiUrlReport(parameters,mapping);
		},
		
		/**
		 * Funzione per la composizione delle varie url:
		 * @params:
		 * parameters: parametri ricevuti in post
		 * mapping: i parametri mappati nella configurazione
		 */		

		componiUrlReport : function(parameters, mapping) {
			// alert(typeof parameters.idenTes+'\n'+parameters.idenReferto)
			var sf = "&prompt<pIdenTestata>=" + parameters.idenTes;; 

			return sf;
		},
		
		PreparaFirmaVisita:function(mapping, parameters){
			// Chiama la procedura che inserisce all'interno di cc_firma_pdf un record su cui fare l'update
			var ret;
			var valoriParametri = new Array();	
			var tipiParametri = new Array();	
			
			//da qui si impostano i parametri da passare alla SP tipi['CLOB','VARCHAR',,'NUMBER','FLOAT']	
			tipiParametri.push('VARCHAR');
			valoriParametri.push(mapping.funzione);	
		
			tipiParametri.push('VARCHAR');
			valoriParametri.push(mapping.tabella);	
			// Iden Del Referto
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenVersione);		
			// Iden Visita di Testata Richieste			
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenVisita);	
			
			tipiParametri.push('NUMBER');
			valoriParametri.push(WindowCartella.baseUser.IDEN_PER);					
		
			//fine parametri per la SP		
			dwr.engine.setAsync(false);
			dwrPreparaFirma.preparaFirma(mapping.beforeProcedure, tipiParametri,
					valoriParametri, function(resp) {
						ret = resp == "" ? "OK" : resp;
					});
			dwr.engine.setAsync(true);
			return ret;
		},
		
		salvaPdfVisitaAnestesiologica:function(mapping,parameters,pdfFirmato){
			var valoriParametri = new Array();	
			var tipiParametri = new Array();
			//da qui si impostano i parametri da passare alla SP
			//Funzione
			tipiParametri.push('VARCHAR');
			valoriParametri.push(mapping.funzione);
			//Tabella
			tipiParametri.push('VARCHAR');
			valoriParametri.push(mapping.tabella);
			//idenTab = idenReferto da salvare
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenVersione);
			//idenRef = idenReferto da sostituire
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenRefOld);
			
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenVisita);	
		
			tipiParametri.push('CLOB');
			valoriParametri.push(pdfFirmato);
			//iden della richiesta		
			tipiParametri.push('NUMBER');
			valoriParametri.push(parameters.idenTes);
		
			tipiParametri.push('NUMBER');
			valoriParametri.push(WindowCartella.baseUser.IDEN_PER);
		
			tipiParametri.push('VARCHAR');
			valoriParametri.push('');
		
			tipiParametri.push('VARCHAR');
			valoriParametri.push('');
		
			tipiParametri.push('VARCHAR');
			valoriParametri.push(parameters.validaFirma);
		
			dwr.engine.setAsync(false);
//			viene usata la procedura su db oe_consulenza.saveAfterProcFirma
			dwrPreparaFirma.archiviaFirma(mapping.afterProcedure,tipiParametri,valoriParametri,function(resp){
				ret = resp == "" ? "OK" : resp;
			});
			dwr.engine.setAsync(true);
			return ret;
		}
	}
	
};


/**
 * Firma multipla: gestione struttura base di firma
 * 
 * @author  linob
 * @version 1.0
 * @since   2014-12-09
 */
var NS_FIRMA = {
	configurazione : '',
	urlDaFirmare : {},
	urlDaVisualizzare : {},
	parametriPost : {},
	closeWindow : false,
	fineFirma:new Array(),

	init : function() {
		$('#divFirmato').hide();
		$('#EXTERN > input').each(function() {
			NS_FIRMA.set(NS_FIRMA.parametriPost, $(this).attr("id"), $(this).val());
		});
		
		if (NS_FIRMA.checkCodFisc()) {
			alert('Codice fiscale associato alla smartcard diverso dall\'utente loggato. Procedura di firma interrotta');
			return self.close();
		}
//		parametri activeX
		parametriActiveX = {
			'height' : screen.height - 100,
			'width' : screen.width - 25,
			'printerName' : WindowCartella.basePC.PRINTERNAME_REF_CLIENT,
			'zoomFactor' : 125
		};
//		Aggiungo activex alla pagina
		NS_FIRMA.appendOcx(parametriActiveX);
//		Popolo NS_FIRMA.parametriPost con i parametri della request
//		carico la configurazione di firma multipla
		if (NS_FIRMA.parametriPost.typeProcedure=='CONSULENZE_REFERTAZIONE' || NS_FIRMA.parametriPost.typeProcedure=='VISITA_ANESTESIOLOGICA'){
			NS_FIRMA.set(NS_FIRMA.parametriPost, "idenVersione", NS_FIRMA.parametriPost.idenReferto);
			eval('NS_FIRMA.configurazione ='+WindowCartella.baseReparti.getValue(NS_FIRMA.parametriPost.repartoDestinatario, "getConfFirmaMultipla"+NS_FIRMA.parametriPost.typeProcedure));
		}else{
			eval('NS_FIRMA.configurazione ='+WindowCartella.baseReparti.getValue(WindowCartella.getReparto("COD_CDC"), "getConfFirmaMultipla"+NS_FIRMA.parametriPost.typeProcedure));	
		}
//		alert(WindowCartella.baseReparti.getValue(WindowCartella.getReparto("COD_CDC"), "getConfFirmaMultipla"+NS_FIRMA.parametriPost.typeProcedure))
// 		creo sul db la riga su cc_firma_pdf per ogni funzione da firmare
		NS_FIRMA.beforeFirma();
// 		recupero le url da visualizzare e le passo quealla da visualizzare all'activex di stampa
		for (var i in NS_FIRMA.urlDaVisualizzare){
//		$.each(NS_FIRMA.urlDaVisualizzare, function(i, val) {
			document.all.pdfReader.PDFurl = NS_FIRMA.urlDaVisualizzare[i];
			document.all.pdfReader.printAll();
		};
		

	},

	setEvents : function() {
		
		$('#btChiudi').click(function(){
			NS_FIRMA.closeFirma();
		});
		
		if (NS_FIRMA.parametriPost.typeProcedure=='LETTERA_STANDARD'){
			$('#btStampaCartella').click(function(){
				NS_FIRMA.apriStampaGlobale();
			});					
		}else{
			$('#btStampaCartella').hide();
		}
//		Per la gestione dell'inizio della firma vengono controllati:
//		- la presenza dell'ocx di firma correttamente caricato nella pagina
//		- la presenta del pin di firma, in modo da non generare eventi sul comped che potrebbero bloccare la firma
		$('#divButtonFirma').click(function() {
	    	var objcheck = NS_FIRMA.checkControlFirma();
	    	if (!objcheck.controllo){
	    		alert(objcheck.messaggio);
	    		return NS_FIRMA.closeFirma();
	    	}
			var obj = NS_FIRMA.checkPin();
			if (obj.controllo){
				NS_FIRMA.firma_documento(obj.valore);				
			}else{
				alert(obj.messaggio)
			}
		});
		
		$('#inputPinFirma').keyup(function(e) {
		    //alert(e.keyCode);
		    if(e.keyCode == 13) {
		    	var objcheck = NS_FIRMA.checkControlFirma();
		    	if (!objcheck.controllo){
		    		alert(objcheck.messaggio);
		    		return NS_FIRMA.closeFirma();
		    	}
		    	var obj = NS_FIRMA.checkPin();
		    	if (obj.controllo){
					NS_FIRMA.firma_documento(obj.valore);				
				}else{
					alert(obj.messaggio)
				}		    	
		    }
		});
		
		
		$('#inputPinFirma').focus();

	},
/**
 * Controllo presenza pin
 * @returns {controllo:se il pin è stato messo o no,messaggio:eventuale messaggio errore,valore:pin}
 */	
	checkPin:function(){		
		if ($('#inputPinFirma').val()==''){
			return {'controllo':false,'messaggio':'Inserire il pin prima di procedere a firmare','valore':''}
		}
		else{
			return {'controllo':true,'messaggio':'true','valore':$('#inputPinFirma').val()}
		}
	},
/**
 * Controllo codice fiscale
 * @returns {Boolean}
 */
	checkCodFisc : function() {
		dgst = new ActiveXObject("CCypher.Digest");
		var codfisc = dgst.GetSmartCardProperty(16);

		if ((typeof codfisc) == 'undefined') {
			alert('Dispositivo smartcard non collegato correttamente / CompEd non avviato correttamente')
			return true;
		}

		if (WindowCartella.baseUser.COD_FISC != codfisc) {
			return true;
		} else {
			return false;
		}
	},
/**
 * Controllo presenta ocx di firma: se il controllo non è installato, correttamente, dovrebbe ritornare undefined e quindi false
 * Se invece è presente, ritorna unknown e quindi true
 */	
	checkControlFirma:function(){
		/*Controllo la presenza dell'activex*/
		if ((typeof document.all.firma_multipla.Firma_documento)=='undefined' && (typeof document.all.firma_multipla.Firma_documento_whale)=='undefined'){
			return {'controllo':false,'messaggio':'Errore durante il caricamento dell\'activex di firma multipla, prego contattare assistenza.','valore':''};
		}else{
			return {'controllo':true,'messaggio':'','valore':''};
		}
	},

// 	Struttura che appende activex firma + stampa 
	appendOcx : function(options) {
		var objStampa = '<object classid="clsid:AD4EF313-6690-48CF-8A55-CFA1DDF111A0" codebase="cab/pdfControlFirma/prjXPdfReader.CAB#version=1,0,0,0" id="pdfReader" name="pdfReader">';
		objStampa += '<param name="width" value="' + options.width + '" />';
		objStampa += '<param name="height" value="' + options.height + '" />';
		objStampa += '<param name="top" value="0" />';
		objStampa += '<param name="left" value="0" />';
		objStampa += '<param name="preview" value="S" />';
		objStampa += '<param name="PDFurl" value="" />';
		objStampa += '<param name="OffTop" value="-1" />';
		objStampa += '<param name="OffLeft" value="-1" />';
		objStampa += '<param name="Rotate" value="0" />';
		objStampa += '<param name="trace" value="S" />';
		objStampa += '<param name="numCopy" value="0" />';
		objStampa += '<param name="zoomFactor" value="' + options.zoomFactor
				+ '" />';
		objStampa += '<param name="zoomFit" value="" />';
		objStampa += '<param name="printerName" value="' + options.printerName
				+ '" />';
		objStampa += '<param name="driverName" value="" />';
		objStampa += '<param name="portName" value="" />';
		objStampa += '<param name="visualizzaBottoniStampa" value="False" />';		
		objStampa += '</object>';
		$('body').append(objStampa);

		var objFirma = '<object classid="clsid:C85A6712-F5AC-4C35-947A-34F8B0E4645C" id="firma_multipla" name="firma_multipla">';
		objFirma += '<param name="width" value="' + options.width + '"/>';
		objFirma += '<param name="height" value="' + options.height + '"/>';
		objFirma += '<param name="percorso_http" value="'+options.printerName+'"/>';
		objFirma += '<param name="stampante" value="'+options.printerName+'"/>';
		objFirma += '<param name="webapp" value="whale"/>';		
		objFirma += '</object>';

		$('body').append(objFirma);
	},
	
// 	Creazione delle righe su cui salvare dentro a cc_firma_pdf
	beforeFirma : function() {
		var ret;
//		Ciclo il json di configurazione per richiamare la funzione di preparazione della firma	 	
		$.each(NS_FIRMA.configurazione.documenti,
			function(i,val) {
			//alert(val.mapping.famiglia+val.mapping.beforeFirma+'\n');alert(typeof (NS_MAPPING_FIRMA[val.mapping.famiglia][val.mapping.beforeFirma]))
				if (typeof (NS_MAPPING_FIRMA[val.mapping.famiglia][val.mapping.beforeFirma]) == "function") {
//					Richiamo le funzioni configurate nel json per salvare il pdf
					ret = NS_MAPPING_FIRMA[val.mapping.famiglia][val.mapping.beforeFirma]
							(
								val.mapping,
								NS_FIRMA.parametriPost
								
							);

					if (ret =='OK') {
						//se, la funzione ha ritornato OK, genero la url per la firma/visualizzazione
						NS_FIRMA.genera_url_documento_da_salvare(val.report[val.mapping.funzione], val.mapping)
					} /*else {
						alert('url da non generare')
					}*/
				}
			});
	},

// 	Creazione url da firmare	
	genera_url_documento_da_salvare : function(report, mapping) {
		var tmpUrl = NS_FIRMA.getUrlDocument();
		tmpUrl += "ServletStampe?report=" + report;
//		alert(typeof (NS_MAPPING_FIRMA[mapping.famiglia][mapping.funzione]));
//		alert(mapping.famiglia+'\n'+mapping.funzione+'\n'+mapping.funzioneAssociata)
		var url = NS_MAPPING_FIRMA[mapping.famiglia][mapping.funzione](tmpUrl,NS_FIRMA.parametriPost,mapping)+'&t='+new Date().getTime();
//		salvo tutte le url da firmare
//		alert(url)
		NS_FIRMA.set(NS_FIRMA.urlDaFirmare, mapping.funzione, url);
		if (mapping.visualizza == "S") {
			//visualizzo solo le url configurate,perchè manca la gestione del merge dei pdf
			NS_FIRMA.set(NS_FIRMA.urlDaVisualizzare, mapping.funzione, url);
		}
	},

//recupera la url di base dell'applicativo
	getUrlDocument : function() {
		var pdfPosition = ""
		dwr.engine.setAsync(false);
		dwrUtility.getBaseUrl(function(resp) {
			pdfPosition = resp;
		});
		dwr.engine.setAsync(true);

		return pdfPosition;
	},

	set : function(obj, name, value) {
		obj[name] = value;
	},
	
// 	Funzione da associare al bottone di firma activex.firma la url passata e ritorna ilbase64 
	firma_documento : function(pin) {
        $('#divButtonFirma').hide();
        $('#divInputFirma').hide();
        var ret;
		var pwdSbagliata;
//        prendo tutte le url salvate e provo a firmarle
		$.each( NS_FIRMA.urlDaFirmare,function(i, val) {
			var funzione = i;
//			passo la url, il documento e N(per la stampa automatica) e l'activex mi ritorna il base64
			var pdfFirmato = '';
			if (typeof (document.all.firma_multipla.Firma_documento_whale)=='undefined'){
				pdfFirmato = document.all.firma_multipla.Firma_documento(val,pin,'N')
			}else{
				pdfFirmato = document.all.firma_multipla.Firma_documento_whale(val,pin,'N')
			}
//			var pdfFirmato = document.all.firma_multipla.Firma_documento(val,pin,'N')
//			Se il pdffirmato viene ritornato vuoto, evidenzio un errore. Probabilmente dovuto a un errore dell'activex
			if (pdfFirmato == ''){
		        $('#divButtonFirma').show();
		        $('#divInputFirma').show();
		        $('#divInputFirma').val('');
				alert('Firma Fallita, problema relativo all\'activex di firma. Rivolgersi all\'assistenza.');
				pwdSbagliata = true;	
				return false;
			}
//			per ogni documento, cerco la configurazione associata per la funzinoe di salvataggio del pdf -> NS_MAPPING_FIRMA[val.mapping.famiglia][val.mapping.afterFirma]
			var fineFirmaLettere;
			$.each(NS_FIRMA.configurazione.documenti,
				function(i,val) {
					if (val.mapping.funzione == funzione) {
						ret = NS_MAPPING_FIRMA[val.mapping.famiglia][val.mapping.afterFirma]
								(
									val.mapping,
									NS_FIRMA.parametriPost,
									pdfFirmato
								);
//						Creo un oggetto di ritorno del processo di firma
						fineFirmaLettere = new FineFirma(val.mapping.funzione,ret,val.mapping.visualizza,NS_FIRMA.parametriPost.idenVersione);
						NS_FIRMA.fineFirma.push(fineFirmaLettere);
					}
			});
			
			
		});
		var verifica = true;
		var messaggio = '';
//		Ciclo l'array di fineFirma per vedere se di tutti i pdf firmati ce ne è qualcuno in errore
		$.each(NS_FIRMA.fineFirma, function(i,value){
			if (value.getValore().split("*")[0]=='KO'){
				verifica = false;
				messaggio = value.getFunzione() + '\n' + value.getValore().split("*")[1]
			}
		});
		if (verifica && NS_FIRMA.fineFirma.length>0){
			$('#spanFirmato').text('REFERTO FIRMATO DIGITALMENTE DA '+ WindowCartella.baseUser.DESCRIPTION);
	        $('#divFirmato').show();
			$.each(NS_FIRMA.fineFirma, function(i,value){
				if (value.getVisualizza()==='S'){
//					recupero la url del pdf firmato recuperata dal db
					var url = NS_FIRMA.getUrlDocument()+'ServleTReadPDF?db=&iden='+value.getIdenVersione() +'&funzione='+value.getFunzione()+'&t='+new Date().getTime();
					parametriActiveX = {
							'height' : screen.height - 100,
							'width' : screen.width - 25,
							'printerName' : WindowCartella.basePC.PRINTERNAME_REF_CLIENT,
							'zoomFactor' : 125
						};
					
//					RICARICO l'activex di stampa con la url del pdf firmato recuperata dal db questo perchè se no alla fine della firma il pdf si presenterebbe vuoto
//					a causa della cancellazione di tutti i record su cc_lettera_versioni che hanno creato il report da firmare
					$('body').find('object#pdfReader').remove();
					var objStampa = '<object classid="clsid:AD4EF313-6690-48CF-8A55-CFA1DDF111A0" codebase="cab/pdfControlFirma/prjXPdfReader.CAB#version=1,0,0,0" id="pdfReader" name="pdfReader">';
					objStampa += '<param name="width" value="' + parametriActiveX.width + '" />';
					objStampa += '<param name="height" value="' + parametriActiveX.height + '" />';
					objStampa += '<param name="top" value="0" />';
					objStampa += '<param name="left" value="0" />';
					objStampa += '<param name="preview" value="S" />';
					objStampa += '<param name="PDFurl" value="'+url+'" />';
					objStampa += '<param name="OffTop" value="-1" />';
					objStampa += '<param name="OffLeft" value="-1" />';
					objStampa += '<param name="Rotate" value="0" />';
					objStampa += '<param name="trace" value="S" />';
					objStampa += '<param name="numCopy" value="0" />';
					objStampa += '<param name="zoomFactor" value="' + parametriActiveX.zoomFactor+ '" />';
					objStampa += '<param name="zoomFit" value="" />';
					objStampa += '<param name="printerName" value="' + parametriActiveX.printerName	+ '" />';
					objStampa += '<param name="driverName" value="" />';
					objStampa += '<param name="portName" value="" />';
					objStampa += '<param name="visualizzaBottoniStampa" value="True" />';					
					objStampa += '</object>';
					$('body').append(objStampa);
					
					document.all.pdfReader.PDFurl = url;
					document.all.pdfReader.printAll();
				}
			});	        
	        
		}else{
			if (!pwdSbagliata){
				alert('Errore in fase di salvataggio del pdf sul database:' + messaggio);	
			}
			
		}
		
		
		
	},

//	funzione richiamata alla chiusura della consolle firma	
	closeFirma:function(){
		NS_FIRMA.closeWindow = true;
		switch(NS_FIRMA.parametriPost.typeProcedure) 
		{
			case 'LETTERA_STANDARD'		: 
			case 'LETTERA_PROSECUZIONE'	: 
			case 'LETTERA_DIMISSIONI_DH':
			case 'LETTERA_AL_CURANTE'	:  
			case 'LETTERA_PRIMO_CICLO'	: 
			case 'LETTERA_FARMACIA'	: 
				WindowCartella.apriLetteraDimissioniNew(NS_FIRMA.parametriPost.typeProcedure); 
					break;
			case 'TERAPIA_DOMICILIARE':
				WindowCartella.apriTerapiaDomiciliare();
					break;
			case 'CONSULENZE_REFERTAZIONE': 
				if (NS_FIRMA.fineFirma=='' || NS_FIRMA.fineFirma[0].getValore().split("*")[0]=='KO'){
					dwr.engine.setAsync(false);
					dwrPreparaFirma.resetFirma('{call RADSQL.OE_CONSULENZA.resetRefetazioneConsulenza(?)}',NS_FIRMA.parametriPost.idenTes,function(resp) {
						ret = resp == "" ? "OK" : resp;
					});	
					dwr.engine.setAsync(true);
				}
				opener.chiudi();
				break;		
			case 'LETTERA_TRASFERIMENTO': 
				if (NS_FIRMA.fineFirma=='' || NS_FIRMA.fineFirma[0].getValore().split("*")[0]=='KO'){
					//se lo stato della lettera precedente è F, allora la riattivo e cancello l'ultima inserita(cancellando anche la riga su cc_firma_pdf)
					if (NS_FIRMA.parametriPost.statoLetteraPrecedente!=undefined && NS_FIRMA.parametriPost.statoLetteraPrecedente=='F')
					{
						
						var resp = WindowCartella.executeStatement("letteraTrasferimento.xml","rollbackLetteraTrasferimento",[NS_FIRMA.parametriPost.idenLetteraPrecedente,NS_FIRMA.parametriPost.idenVersione,NS_FIRMA.parametriPost.typeProcedure]);
		 
						if (resp[0]=='OK')
							opener.location.reload();
						else
							alert('Errore Update di Rollback: '+ resp[1]);
					}
				}
				else
				{	
					opener.location.reload();
				}
				break;
			case 'VISITA_ANESTESIOLOGICA': 
				if (NS_FIRMA.fineFirma=='' || NS_FIRMA.fineFirma[0].getValore().split("*")[0]=='KO'){
					dwr.engine.setAsync(false);
					dwrPreparaFirma.resetFirma('{call RADSQL.OE_REFERTAZIONE.resetrefertazionevisita(?)}',NS_FIRMA.parametriPost.idenTes,function(resp) {
						ret = resp == "" ? "OK" : resp;
					});	
					dwr.engine.setAsync(true);
					if (NS_FIRMA.parametriPost.idenRefOld=='0'){
						WindowCartella.apriRefertoVisitaAnestesiologica(NS_FIRMA.parametriPost.idenTes,NS_FIRMA.parametriPost.idenVersione)
					}else{
						var pBinds = new Array();
						pBinds.push(NS_FIRMA.parametriPost.idenRefOld);
						var statoRefertoPrecedente;
						var rs = WindowCartella.executeQuery("OE_Refertazione_Visita_Anestesiologica.xml","loadingStatoRefertoPrecedente",pBinds);
						while (rs.next()){
							statoRefertoPrecedente = rs.getString("stato");
						}
						if (statoRefertoPrecedente=='R'){
							WindowCartella.apriRefertoVisitaAnestesiologica(NS_FIRMA.parametriPost.idenTes,NS_FIRMA.parametriPost.idenVersione);
						}else{
							WindowCartella.apriRefertoVisitaAnestesiologica(NS_FIRMA.parametriPost.idenTes,NS_FIRMA.parametriPost.idenRefOld);
						}
					}		
				}else{
					WindowCartella.apriRefertoVisitaAnestesiologica(NS_FIRMA.parametriPost.idenTes,NS_FIRMA.parametriPost.idenVersione);					
				}

				break;  				
				
			default : null;
		}			
		self.close();			
		
	},
	
	apriStampaGlobale:function(){
		if (NS_FIRMA.fineFirma.length==0){
			alert('La lettera non è firmata digitalmente.\n La stampa della cartella è momentamente non disponibile');
		}
		else{
				var txtconfermastampa = confirm('Iniziare Processo di Stampa?')
				if (txtconfermastampa==true)
				{
					WindowCartella.stampaGlobaleCartella(true);
				}
			}
	}
	
};

//Se la pagina viene chiusa, senza cliccare su chiudi richiamo la funzione closeFirma
window.onbeforeunload = (
	function() {
		if (NS_FIRMA.closeWindow==false){
			NS_FIRMA.closeFirma();
		}
	}
);

//Oggetto ritornato alla fine della firma
var FineFirma = function(funzione,valore,visualizza,idenVersione) { 
	this._funzione = funzione;
	this._valore = valore;
	this._visualizza = visualizza;
	this._idenVersione = idenVersione;
}

FineFirma.prototype = {
	
	getFunzione :function(){
		return this._funzione;
	},
	
	getValore:function(){
		return this._valore;
	},

	getVisualizza:function(){
		return this._visualizza;
	},

	getIdenVersione:function(){
		return this._idenVersione;
	}/*,
	
	getUrl:function(){
		var url = 'ServleTReadPDF?db=&iden='+this._idenVersione +'&funzione='+this._funzione;
		return url;
	}*/
};

/*------------------------------- CONFIGURAZIONE D'ESEMPIO -------------------------------*/
var NS_CONF_FIRMA = {
	getConfigurazioneTest : function() {
		var configurazione = {
			'documenti':[{
							'report': {
								'LETTERA_STANDARD': 'ASL2/LETTERA_FIRMA.RPT'
							},
							'mapping': {
								'famiglia': 'letteraDimissione',
								'funzione': 'LETTERA_STANDARD',
								'funzioneAssociata': '',
								'beforeFirma': 'preparaFirmaLettera',
								'beforeProcedure': '{callLETTERA.prepara(?,?,?,?,?)}',
								'afterFirma': 'salvaFirmaLettera',
								'afterProcedure': '{callLETTERA.archiviaFirma(?,?,?,?,?,?)}',
								'visualizza': 'S',
								'tabella': 'CC_LETTERA_VERSIONI'
							}
						},
						{
							'report': {
								'LETTERA_PRIMO_CICLO': 'ASL2/LETTERA_TERAPIA.RPT'
							},
							'mapping': {
								'famiglia': 'letteraDimissione',
								'funzione': 'LETTERA_PRIMO_CICLO',
								'funzioneAssociata': 'LETTERA_STANDARD',
								'beforeFirma': 'preparaFirmaLetteraPrimoCiclo',
								'beforeProcedure': '{callLETTERA.prepara(?,?,?,?,?)}',
								'afterFirma': 'salvaFirmaLettera',
								'afterProcedure': '{callLETTERA.archiviaFirma(?,?,?,?,?,?)}',
								'visualizza': 'N',
								'tabella': 'CC_LETTERA_VERSIONI'
							}
						}]
		};
		var stringConf = JSON.stringify(configurazione);
		return stringConf;
	}
};
