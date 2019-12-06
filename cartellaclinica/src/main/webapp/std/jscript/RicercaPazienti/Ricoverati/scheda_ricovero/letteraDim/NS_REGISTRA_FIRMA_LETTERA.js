/**
 * Funzioni di stampa specifiche per il reparto NIDO_SV
 * 
 * @author  linob
 * @version 1.0
 * @since   2014-11-01
 */
var NS_REGISTRA_FIRMA_LETTERA = {
	formDati : '',
	formFirma : '',

/**
 * 
 * @param parameters: S/N a seconda che sia una firma o meno
 * @returns richiama la funzione di firma se S, altrimenti ricarica la pagina della lettera
 */	
	registra : function(parameters) {
		NS_REGISTRA_FIRMA_LETTERA.formDati = window.document.frmLettera
				|| window.document.frmGestionePagina;
		NS_REGISTRA_FIRMA_LETTERA.formFirma = window.document.frmFirmaLettera
				|| window.document.frmImpostazioniFirma;
		// iden visita di riferimento per il salvataggio
		// LETTERA_STANDARD, LETTERA_DIMISSIONI_DH, LETTERA_PROSECUZIONE ->
		// iden_visita = iden_ricovero
		// LETTERA_PRIMO_CICLO, LETTERA_AL_CURANTE -> iden_visita = iden_accesso
		// selezionato
		var iden_visita = $('input[name="idenVisita"]').val();
		var iden_visita_registrazione = $('input[name="idenVisitaRegistrazione"]').val();

		/* Salvataggio Sezioni */
		var arIdSection = new Array();
		var arLblArea = new Array();
		var arRowsArea = new Array();
		var arLblSection = new Array();
		var arContent2convert = new Array();
		var arContentConverted = new Array();
		var arIdenFar = new Array();
		var arScatole = new Array();
		var arPrimoCiclo = new Array();
		var arDose = new Array();
		var arDurata = new Array();
		var arTipoTerapia = new Array();
		var arStatoTerapia = new Array();
		var arCategoria = new Array();

		try {
			dwr.engine.setAsync(false);

			var arTerapie;
//			 Recupero dal frame delle terapie, gli array per il salvataggio delle terapie su cc_lettera_farmaci 
			if (window.frames['frameTerapie'] && window.frames['frameTerapie'].arTerapie) {
				var arTerapie = window.frames['frameTerapie'].arTerapie;
				$.each(arTerapie,function(i,value){
					arIdenFar.push(value.getIdenFarmaco());
					arStatoTerapia.push(value.getStatoTerapia());
					arTipoTerapia.push(value.getTipoTerapia());
					arDose.push(value.getDose());
					arDurata.push(value.getDurata());
					arScatole.push(value.getScatole());					
					arPrimoCiclo.push(value.getPrimoCiclo());	
					arCategoria.push(value.getCategoria());				
					
				});
				
			}else {
				arIdenFar.push(0);

			}
//			Gestione, per la terapia domiciliare di day surgery, nel caso in cui volessero firmare una lettera senza farmaci di primo ciclo
//			Quindi con l'array arPrimoCiclo vuoto o con nessun valore =='S'
			if (NS_REGISTRA_FIRMA_LETTERA.formDati.funzione.value=='LETTERA_FARMACIA'){
				var pos = $.inArray('S', arPrimoCiclo);
				if (arPrimoCiclo.length==0){
//					Questo è anche il caso in cui si ricarica la pagina, l'array di svuota ma sono presenti dei farmaci di primo ciclo che cerco con la query
					var boolCheckReload;
					var rs = WindowCartella.executeQuery('terapia_domiciliare.xml','getTerapiaDomiciliareDati',[$('input[name="idenVersione"]').val()]);
					while (rs.next()){
						if (rs.getString('primo_ciclo')==='S'){
							boolCheckReload = true;
							break;
						}
					}
					if (!boolCheckReload){
						alert('Processo di registrazione interrotto. Non sono presenti farmaci di primo ciclo.');
						return 	WindowCartella.utilMostraBoxAttesa(false);						
					}
				}else{
					if (pos<0){
						alert('Processo di registrazione interrotto. Non sono presenti farmaci di primo ciclo.');
						return WindowCartella.utilMostraBoxAttesa(false);
					}
				}
			}
//			 Salvataggio Sezioni - Creazioni array di salvataggio  - Recupero dalle textaree il testo che convertirò per eliminare i caratteri accentati e i tag html(testo_piano)
			var lista_sezioni = document.getElementsByTagName("textarea");
			for (var i = 0; i < lista_sezioni.length; i++) {
				if (typeof lista_sezioni[i].attiva != 'undefined') {
					arIdSection.push(lista_sezioni[i].id);
					arLblArea.push(lista_sezioni[i].label);
					arRowsArea.push(lista_sezioni[i].rows);
					arLblSection.push(lista_sezioni[i].sezione);

					var str = tinyMCE.get(lista_sezioni[i].id).getContent();
					for (var j = 0; j < arRE2replace.length; j++) {
						str = str.replace(arRE2replace[j], arChar4replace[j]);
					}
					arContent2convert.push(str);
				}
			}
			dwrPreparaFirma
					.convertHtmlToText(arContent2convert, replyConverter);
			function replyConverter(reply) {
				arContentConverted = reply;
//			Inizio funzione di salvataggio
//			Controllo se ci sono dei dati di laboratorio allegati o configurati(configurazione presente all'inizio dei javascript letteraDimEngine.js e LetteraDimEngineNew.js) per essere allegati	
				if (_ALLEGATO_DATI_LABO.SETTINGS[_ALLEGATO_DATI_LABO.SETTINGS['FUNZIONE_ATTIVA']]['allegato']
						&& _ALLEGATO_DATI_LABO.allegato == 'S') {
					$('input[name="allegaDatiStr"]').val(
							_ALLEGATO_DATI_LABO.parametroStampa);
				}

				var tipiParametri = new Array();
				var valoriParametri = new Array();
//    Salvata la funzione che genera il salvataggio
				tipiParametri.push('VARCHAR');
				valoriParametri.push(NS_REGISTRA_FIRMA_LETTERA.formDati.funzione.value);
//    Salvato l'iden accesso/ricovero(nel caso di lettera_primo_ciclo del dh e lettera_al_curante, salvo in questo campo l'iden accesso)		
				tipiParametri.push('NUMBER');
				valoriParametri.push(iden_visita);
//    Salvato l'iden accesso(nel caso di lettera_primo_ciclo del dh e lettera_al_curante, salvo in questo campo l'iden accesso)
				tipiParametri.push('NUMBER');
				valoriParametri.push(iden_visita_registrazione);

				tipiParametri.push('NUMBER');
				valoriParametri.push(baseUser.IDEN_PER);
//				Iden della terapia domiciliare da associare al salvataggio della lettera
				tipiParametri.push('NUMBER');
				valoriParametri.push(NS_LOAD_TERAPIA_DOMICILIARE.idenTerapiaDomiciliare);				
//				alert('idenVersione:'+$('input[name="idenVersione"]').val()+'\nstato'+$('input[name="stato"]').val());

				tipiParametri.push('NUMBER');
				valoriParametri.push($('input[name="idenVersione"]').val()==''?0:$('input[name="idenVersione"]').val());	

				tipiParametri.push('VARCHAR');
				valoriParametri.push($('input[name="stato"]').val()==''?'':$('input[name="stato"]').val());					
				
				tipiParametri.push('VARCHAR');
				valoriParametri.push(parameters.firma);
//				alert(valoriParametri)
				
				tipiParametri.push('VARCHAR');

				var txtMedPed = $('#txtMedPed').val() === undefined
						|| $('#txtMedPed').val() == null ? "" : $('#txtMedPed')
						.val();
				var hMedPed = $('#hMedPed').val() === undefined
						|| $('#hMedPed').val() == null ? "" : $('#hMedPed')
						.val();

//				Creazione xml di salvataggio da salvare nel campo contenuto della tabella cc_lettera_versioni per il salvataggio di
//				- data di fine ricovero
//				- eventuale presenza di dati di laboratorio (+ i cod esa e iden delle richieste)
//				- Campi per la gestione del nido	
				if (_ALLEGATO_DATI_LABO.SETTINGS[_ALLEGATO_DATI_LABO.SETTINGS['FUNZIONE_ATTIVA']]['allegato']
						&& _ALLEGATO_DATI_LABO.allegato == 'S') {
					DATI_STRUTTURATI_ALLEGA.getCodEsaByIden();
					// valoriParametri.push('<PAGINA><CAMPI><CAMPO
					// KEY_CAMPO="DATA_FINE_RICOVERO">'+dRic+'</CAMPO><CAMPO
					// KEY_CAMPO="ALLEGA_DATI_STRUTTURATI">'+
					// _ALLEGATO_DATI_LABO.parametroStampa
					// +'</CAMPO></CAMPI></PAGINA>');
					valoriParametri
							.push('<PAGINA><CAMPI><CAMPO KEY_CAMPO="DATA_FINE_RICOVERO">'
									+ parameters.dataFine
									+ '</CAMPO><CAMPO KEY_CAMPO="ALLEGA_DATI_STRUTTURATI">'
									+ _ALLEGATO_DATI_LABO.parametroStampa
									+ '</CAMPO><CAMPO KEY_CAMPO="TXT_MED_PED">'
									+ txtMedPed
									+ '</CAMPO><CAMPO KEY_CAMPO="H_MED_PED">'
									+ hMedPed + '</CAMPO></CAMPI></PAGINA>');
				} else {

					// valoriParametri.push('<PAGINA><CAMPI><CAMPO
					// KEY_CAMPO="DATA_FINE_RICOVERO">'+dRic+'</CAMPO><CAMPO
					// KEY_CAMPO="ALLEGA_DATI_STRUTTURATI">N##</CAMPO></CAMPI></PAGINA>');
					valoriParametri
							.push('<PAGINA><CAMPI><CAMPO KEY_CAMPO="DATA_FINE_RICOVERO">'
									+ parameters.dataFine
									+ '</CAMPO><CAMPO KEY_CAMPO="ALLEGA_DATI_STRUTTURATI">N##</CAMPO><CAMPO KEY_CAMPO="TXT_MED_PED">'
									+ txtMedPed
									+ '</CAMPO><CAMPO KEY_CAMPO="H_MED_PED">'
									+ hMedPed + '</CAMPO></CAMPI></PAGINA>');
				}
				/* array di varchar -> idSezioni da salvare */
				tipiParametri.push('ARRAY_VALUE_ID_SEZIONE');
				tipiParametri.push('ARRAY_VALUE_LBL_SEZIONE');
				tipiParametri.push('ARRAY_VALUE_ARROWSAREA');
				tipiParametri.push('ARRAY_VALUE_ARROWSLBLAREA');
				/* array di clob -> testo html */
				tipiParametri.push('ARRAY_CLOB_HTML');
				/* array di clob -> testo piano */
				tipiParametri.push('ARRAY_CLOB_PIANO');
				/* array: iden_farmaco,scatole,primo_ciclo -> testo piano */
				tipiParametri.push('ARRAY_VALUE_IDEN_FAR');
				tipiParametri.push('ARRAY_VALUE_SCATOLE');
				tipiParametri.push('ARRAY_VALUE_PRIMO_CICLO');
				tipiParametri.push('ARRAY_VALUE_DOSE');
				tipiParametri.push('ARRAY_VALUE_DURATA');
				tipiParametri.push('ARRAY_VALUE_TIPO_TER');
				tipiParametri.push('ARRAY_VALUE_STATO_TER');
				tipiParametri.push('ARRAY_VALUE_CATEGORIA');
				
//				Procedura db di salvataggio			
				switch(NS_REGISTRA_FIRMA_LETTERA.formDati.funzione.value){
					case 'LETTERA_FARMACIA':
					case 'LETTERA_PRIMO_CICLO':
						var callableStatement = '{call LETTERA.registraLetteraPrimoCiclo(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}';
						break;
					default:
						var callableStatement = '{call LETTERA.registraLettera(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}';
						break;
						
				}
//				Dwr che richiama la procedura db di salvataggio					
				dwrPreparaFirma
						.registraLettera(
								callableStatement,
								tipiParametri, valoriParametri, arIdSection,
								arLblSection, arRowsArea, arLblArea,
								arContent2convert, arContentConverted,
								arIdenFar, arScatole, arPrimoCiclo, arDose,
								arDurata, arTipoTerapia, arStatoTerapia,
								arCategoria, replyRegistra);
			}
//			Funzione di callback della procedura di salvataggio
			function replyRegistra(returnValue) {

				WindowCartella.DatiNonRegistrati.set(false);
				try {
					if (returnValue.split("*")[0] == "KO") {
						alert("Errore: " + returnValue.split("*")[1]);
						return;
					}
					if (parameters.firma == 'S') {
//						Se firma, compongo l'oggetto da passare alla servlet di firma composto da
//						- iden_versione: iden della lettera appena salvata e da firmare
//						- primo_ciclo: parametro che mi indica se il primo ciclo è variato rispetto al salvataggio precedente e quindi se è da salvare o meno 
//						- iden_terapia_domiciliare: associata, se fosse stata firmata prima la farmaceutica e poi la lettera senza cambiare la farmaceutica
						var par = {
							'iden_versione' : returnValue.split("*")[1],
							'primo_ciclo'	: returnValue.split("*")[2],
							'iden_terapia_domiciliare':NS_LOAD_TERAPIA_DOMICILIARE.idenTerapiaDomiciliare
						}
//						alert('par.iden_versione' + returnValue.split("*")[1]+'\n'+'par.primo_ciclo' +returnValue.split("*")[2]+'\n'+NS_LOAD_TERAPIA_DOMICILIARE.idenTerapiaDomiciliare);
						WindowCartella.utilMostraBoxAttesa(false);
						NS_REGISTRA_FIRMA_LETTERA.firma(par);
					} else {
						alert('Registrazione Effettuata con successo');
						WindowCartella.utilMostraBoxAttesa(false);
						WindowCartella.apriLetteraDimissioni(NS_REGISTRA_FIRMA_LETTERA.formDati.funzione.value);

					}
				} catch (e) {
					WindowCartella.utilMostraBoxAttesa(false);
					alert("replyRegistra - Error: " + e.description);
				}
			}
			dwr.engine.setAsync(true);
		} catch (e) {
			WindowCartella.utilMostraBoxAttesa(false);
			alert("registra - Error: " + e.description);
		}

	},

/**
 * 
 * @param param: oggetto con
 * iden_versione: iden della lettera appena salvata e da firmare
 * primo_ciclo: parametro che mi indica se il primo ciclo è variato rispetto al salvataggio precedente e quindi se è da salvare o meno 
 * iden_terapia_domiciliare: associata, se fosse stata firmata prima la farmaceutica e poi la lettera senza cambiare la farmaceutica
 */		
	firma : function(param) {
		var tmpVar;
		if (typeof (_V_DATI.iden_prericovero) == "undefined"
				|| _V_DATI.iden_prericovero == null
				|| _V_DATI.iden_prericovero == "")
			tmpVar = _V_DATI.ricovero;
		else
			tmpVar = _V_DATI.ricovero + ',' + _V_DATI.prericovero;
		var $form = $(NS_REGISTRA_FIRMA_LETTERA.formFirma);
//		Parametri Per la firma
//		parametri per i dati laboratorio	
		$form.append(NS_REGISTRA_FIRMA_LETTERA.setInput('paramNosologico','hidden', tmpVar));
		$form.append(NS_REGISTRA_FIRMA_LETTERA.setInput('paramIdPaziente','hidden', _V_DATI.idRemoto));
		$form.append(NS_REGISTRA_FIRMA_LETTERA.setInput('paramDaData','hidden', ''));
		$form.append(NS_REGISTRA_FIRMA_LETTERA.setInput('paramAData', 'hidden',''));
		$form.append(NS_REGISTRA_FIRMA_LETTERA.setInput('paramModalita','hidden', returnModalitaStampa()));
		$form.append(NS_REGISTRA_FIRMA_LETTERA.setInput('paramProvRisultati','hidden', 'INT,PS,EST'));
		$form.append(NS_REGISTRA_FIRMA_LETTERA.setInput('paramNumRichieste','hidden', ''));
		$form.append(NS_REGISTRA_FIRMA_LETTERA.setInput('paramBranca','hidden', ''));
//		parametri per la firma multipla
		$form.append(NS_REGISTRA_FIRMA_LETTERA.setInput('idenVersione','hidden', param.iden_versione));
		$form.append(NS_REGISTRA_FIRMA_LETTERA.setInput('checkPrimoCiclo','hidden', param.primo_ciclo));
		$form.append(NS_REGISTRA_FIRMA_LETTERA.setInput('idenTerapiaDomiciliare','hidden', param.iden_terapia_domiciliare));		
		var myForm = NS_REGISTRA_FIRMA_LETTERA.formFirma;

		var finestra = window.open("", "finestra",
				"fullscreen=yes scrollbars=no");
		myForm.target = 'finestra';

		myForm.action = 'servletGeneric?class=firma.SrvFirmaPdfMultipla';

		myForm.submit();
		try{
			WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
		}catch(e){}


	},
/**
 * Gestione del reperimento della configurazione di firma multipla
 * @returns {Boolean}
 * true: se la configurazione è presente e se il pc è configurato correttamente(IMAGOWEB.CONFIGURA_PC.ABILITA_FIRMA_DIGITALE = 'S')
 */
	configurazioneMultipla : function() {
//		NS_REGISTRA_FIRMA_LETTERA.formDati = window.document.frmLettera
//		|| window.document.frmGestionePagina;
//		NS_REGISTRA_FIRMA_LETTERA.formFirma = window.document.frmFirmaLettera
//		|| window.document.frmImpostazioniFirma;
		var value;
//		var conf = WindowCartella.baseReparti.getValue(WindowCartella.getReparto("COD_CDC"), "getConfFirmaMultipla"+NS_REGISTRA_FIRMA_LETTERA.formDati.funzione.value)
//		if (typeof conf == undefined || conf == null || conf == "") {
//			value = false;
//		} else {
//			if (WindowCartella.basePC.ABILITA_FIRMA_DIGITALE === 'S'){
//				value = true
//			}else{
//				value = false;				
//			}
//		}

		if (WindowCartella.basePC.ABILITA_FIRMA_DIGITALE === 'S'){
			value = true
		}else{
			value = false;				
		}
		return value;
	},

/**
 * Creazione campi input hidden
 */
	setInput : function(id, type, value) {
		var $input = jQuery('<input/>', {
			'id' : id,
			'name' : id,
			'type' : type,
			'value' : value
		});
		return $input;
	}
};


/**
 * Funzioni per la gestione del caricamento della terapia domiciliare
 * 
 * @author  linob
 * @version 1.0
 * @since   2014-12-09
 */
var NS_LOAD_TERAPIA_DOMICILIARE = {
		formDati:'',
		arTerapie:new Array(),
		idenTerapiaDomiciliare:0,
		init:function(){
			NS_LOAD_TERAPIA_DOMICILIARE.formDati = window.document.frmLettera || window.document.frmGestionePagina;
//			Controllo se esiste una lettera salvata
			if (NS_LOAD_TERAPIA_DOMICILIARE.formDati.idenVersione.value==''){
//			Se la lettera non esiste, controllo se esiste una terapia domiciliare salvata 				
				NS_LOAD_TERAPIA_DOMICILIARE.checkTerapiaDomiciliare();
			}
		},
		
/**
 * Controllo la presenza di terapia domiciliare al caricamento
 */		
		checkTerapiaDomiciliare:function(){
	        var pDati	= WindowCartella.getForm(document);
	        var pBinds = new Array();
	        if (
	        		NS_LOAD_TERAPIA_DOMICILIARE.formDati.funzione.value =='LETTERA_AL_CURANTE' || 
	        		NS_LOAD_TERAPIA_DOMICILIARE.formDati.funzione.value =='LETTERA_DIMISSIONI_DH'
	        	){
	        	pBinds.push(pDati.iden_visita);
	        	pBinds.push(pDati.iden_visita);
	        	pBinds.push('LETTERA_PRIMO_CICLO');
	        }else{
	        	pBinds.push(pDati.iden_ricovero);
	        	pBinds.push(pDati.iden_visita);
	        	pBinds.push('LETTERA_FARMACIA');	        	
	        }
	        var rs = WindowCartella.executeQuery('terapia_domiciliare.xml','getTerapiaDomiciliareFirmata',pBinds);
			if (rs.next()){
//				alert(rs.getString("IDEN"))
				NS_LOAD_TERAPIA_DOMICILIARE.idenTerapiaDomiciliare = rs.getString("IDEN");
				NS_LOAD_TERAPIA_DOMICILIARE.loadArrayTerapie(NS_LOAD_TERAPIA_DOMICILIARE.idenTerapiaDomiciliare);
				NS_LOAD_TERAPIA_DOMICILIARE.loadSectionTerapie(NS_LOAD_TERAPIA_DOMICILIARE.idenTerapiaDomiciliare);
			}
		},
//		caricamento array terapia domiciliare	
		loadArrayTerapie:function(iden){
			var rs = WindowCartella.executeQuery('terapia_domiciliare.xml','getTerapiaDomiciliareDati',[iden]);
			var arTerapia = new Array();
			
			while (rs.next()){		
				var iden_farmaco 	= rs.getString('iden_farmaco');
				var stato_terapia 	= rs.getString('stato_terapia');
				var tipo_terapia 	= rs.getString('tipo_terapia');
				var dose 			= rs.getString('dose');
				var durata 			= rs.getString('durata');
				var scatole 		= rs.getString('num_scatole');
				var primo_ciclo 	= rs.getString('primo_ciclo');
				var categoria 		= rs.getString('categoria');

				var farmaco = new Farmaco(
						iden_farmaco,
						primo_ciclo ,
						categoria ,
						stato_terapia ,
						tipo_terapia ,
						dose ,
						durata ,
						scatole 
				);

				NS_LOAD_TERAPIA_DOMICILIARE.arTerapie.push(farmaco);
			}
		},
//		caricamento sezioni html terapia domiciliare		
		loadSectionTerapie:function(iden){
			var rs = WindowCartella.executeQuery('terapia_domiciliare.xml','getTerapiaDomiciliareSezioni',[iden]);
			while (rs.next()){
				$('#'+rs.getString('id_elemento')).val(rs.getString('testo_html'));
			}
		}	
};




/**
 * Oggetto Farmaco: implementazione del costruttore
 */
var Farmaco = function(iden_farmaco,primo_ciclo,categoria,stato_terapia,tipo_terapia,dose,durata,scatole) { // constructor
	this._iden_farmaco = iden_farmaco;
	this._primo_ciclo = primo_ciclo;
	this._categoria=categoria;
	this._stato_terapia=stato_terapia;
	this._tipo_terapia=tipo_terapia;
	this._dose=dose;
	this._durata=durata;
	this._scatole=scatole;

}
/**
 * Implementazione di tutti i gettere per le proprietà dell'oggetto farmaco
 */
Farmaco.prototype = {
	
	getIdenFarmaco :function(){
		return this._iden_farmaco;
	},
	
	getPrimoCiclo:function(){
		return this._primo_ciclo;
	},
	
	getCategoria:function(){
		return this._categoria;
	},
	
	getStatoTerapia:function(){
		return this._stato_terapia;
	},
	
	getTipoTerapia:function(){
		return this._tipo_terapia;
	},
	
	getDose:function(){
		return this._dose;
	},	

	getDurata:function(){
		return this._durata;
	},	
	
	getScatole:function(){
		return this._scatole;
	}/*,
	
	equal:function(farmaco){
		alert(this._iden_farmaco +' - '+farmaco.getIdenFarmaco() +'\n'+ 
				this._scatole +' - '+farmaco.getScatole() +'\n'+
				this._primo_ciclo +' - '+farmaco.getPrimoCiclo())
		if (
				this._iden_farmaco ==farmaco.getIdenFarmaco() && 
				this._scatole ==farmaco.getScatole() &&
				this._primo_ciclo ==farmaco.getPrimoCiclo()
			){
			return false;
		}else{
			return true;
		}
		
		
	}*/
}


