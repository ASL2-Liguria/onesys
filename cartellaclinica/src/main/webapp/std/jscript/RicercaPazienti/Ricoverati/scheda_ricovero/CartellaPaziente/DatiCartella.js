
var DatiCartella = {

	Eventi		:	{/*<iden_evento>*/}, //usato prima di stabilire la tipologia nei btn next e previous

	Pazienti	:	{/*<iden_anag>:{Ubicazione:{LETTO:'',STANZA:'',REPARTO:''}}*/},
	Accessi     :	{/*<iden_vistia>:{}*/},
	Ricoveri    :	{/*<iden_ricovero>:{}*/},
	Prericoveri : 	{/*<iden_prericovero>:{}*/},
	Reparti		: 	{/*<cod_cdc>:{Modalita:{<modalita>:{json}}}*/},

	logger: null,

	view:function(pRiferimento){
		msg="";
		for(var i in pRiferimento)
			msg += (i + ' : ' + pRiferimento[i] + '\n');
		alert(msg);
	},

	loadPaziente:function(pIdenAnag){
		if(DatiCartella.checkParameter(pIdenAnag)){
			DatiCartella.logger.info("DatiCartella.loadPaziente('"+pIdenAnag+"');");
		}else{
			DatiCartella.logger.error("DatiCartella.loadPaziente('"+pIdenAnag+"');");
		}

		if(typeof DatiCartella.Pazienti[pIdenAnag] == 'undefined'){
			DatiCartella.loadFromQuery(DatiCartella.Pazienti,pIdenAnag,"getPaziente");
			//DatiCartella.loadUbicazione(pIdenAnag);
		}
		CartellaPaziente.setIdenAnag(pIdenAnag);
	},

	loadUbicazione:function(/*pIdenAnag*/pIdenAccesso){
		if(DatiCartella.checkParameter(/*pIdenAnag*/pIdenAccesso)){
			DatiCartella.logger.info("DatiCartella.loadUbicazione('"+/*pIdenAnag*/pIdenAccesso+"');");
		}else{
			DatiCartella.logger.warn("DatiCartella.loadUbicazione('"+/*pIdenAnag*/pIdenAccesso+"');");
		}

		/*if(typeof DatiCartella.Pazienti[pIdenAnag].Ubicazione == 'undefined'){
			DatiCartella.loadFromQuery(DatiCartella.Pazienti[pIdenAnag],"Ubicazione","getUbicazione",[pIdenAnag]);
		}*/
		if(typeof DatiCartella.Accessi[pIdenAccesso].Ubicazione == 'undefined'){
			DatiCartella.loadFromQuery(DatiCartella.Accessi[pIdenAccesso],"Ubicazione","getUbicazione",[pIdenAccesso]);
		}
	},

	loadModalita:function(pCodCdc,pModalita){
		if(DatiCartella.checkParameter(pCodCdc) && DatiCartella.checkParameter(pModalita)){
			DatiCartella.logger.info("DatiCartella.loadModalita('"+pCodCdc+"','"+pModalita+"');");
		}else{
			DatiCartella.logger.warn("DatiCartella.loadModalita('"+pCodCdc+"','"+pModalita+"');");
		}

		if(typeof DatiCartella.Reparti[pCodCdc]['Modalita'][pModalita] == 'undefined'){//non ancora caricato

			var Modalita = DatiCartella.Reparti[pCodCdc].Modalita[pModalita] = $.extend(true, {}, ModalitaCartella.basic);
			var SplitCodice = pModalita.split('_');
			var pCodCdc = CartellaPaziente.getReparto("COD_CDC");
			var Modificatori= {
				TipoRicovero : 	SplitCodice[0],
				StatoRicovero:	(SplitCodice.length > 1 ? SplitCodice[1] : ''),
				TipoApertura:	(typeof document.EXTERN.ModalitaAccesso == 'undefined'?'':document.EXTERN.ModalitaAccesso.value),
				Reparto: pCodCdc
			};

			ModalitaCartella.setModificatori(Modalita,Modificatori);

			var rs = executeQuery("cartellaPaziente.xml","getModalitaCartella",[pCodCdc,pModalita]);
			if(rs.next()){
				eval(rs.getString("RIFERIMENTI"));
			}

		}

		return pModalita;

	},

	loadReparto:function(pCodCdc){
		if(DatiCartella.checkParameter(pCodCdc)){
			DatiCartella.logger.info("DatiCartella.loadReparto('"+pCodCdc+"');");
		}else{
			DatiCartella.logger.error("DatiCartella.loadReparto('"+pCodCdc+"');");
		}

		if(typeof DatiCartella.Reparti[pCodCdc] == 'undefined'){//non ancora caricato
				DatiCartella.loadFromQuery(DatiCartella.Reparti,pCodCdc,"getReparto");
				DatiCartella.Reparti[pCodCdc].Modalita = {};
		}

		CartellaPaziente.setReparto(pCodCdc);
		return pCodCdc;
	},

	loadEvento:function(pRiferimento,pKeyRiferimento){

		if(typeof pRiferimento[pKeyRiferimento] == 'undefined' && pKeyRiferimento != ""){//non ancora caricato

			DatiCartella.loadFromQuery(
				pRiferimento,
				pKeyRiferimento,
				"getEvento",
				[
					baseUser.LOGIN,
					baseUser.MODALITA_ACCESSO,
					pKeyRiferimento
				]
			);


		}
		//DatiCartella.view(pRiferimento[pKeyRiferimento]);
		return pKeyRiferimento;

	},

	loadAccesso:function(pIdenAccesso){
		try{
			if(DatiCartella.checkParameter(pIdenAccesso)){
				DatiCartella.logger.info("DatiCartella.loadAccesso('"+pIdenAccesso+"');");
			}else{
				DatiCartella.logger.error("DatiCartella.loadAccesso('"+pIdenAccesso+"');");
			}

			DatiCartella.loadEvento(DatiCartella.Accessi,pIdenAccesso);
			CartellaPaziente.setIdenAccesso(pIdenAccesso);

			DatiCartella.Eventi[pIdenAccesso] = DatiCartella.Accessi[pIdenAccesso];

			DatiCartella.loadReparto(CartellaPaziente.getAccesso("COD_CDC"));

			DatiCartella.loadRicovero(CartellaPaziente.getAccesso("IDEN_RICOVERO"));
			DatiCartella.loadPrericovero(CartellaPaziente.getRicovero("IDEN_PRERICOVERO"));

			DatiCartella.loadUbicazione(pIdenAccesso);

			DatiCartella.loadPaziente(CartellaPaziente.getAccesso("IDEN_ANAG"));

			CartellaPaziente.setModalita(
				DatiCartella.loadModalita(
					CartellaPaziente.getAccesso("COD_CDC"),
					CartellaPaziente.getAccesso("CODICE_MODALITA_CARTELLA")
				)
			);
			document.getElementById('AlberoConsultazione'+sezioneAttiva).className = ModalitaCartella.getClassName();

			CartellaPaziente.refresh.All();

		}catch(e){
			alert(e.description);
		}
	},

	loadRicovero:function(pIdenRicovero){
		if(DatiCartella.checkParameter(pIdenRicovero)){
			DatiCartella.logger.info("DatiCartella.loadRicovero('"+pIdenRicovero+"');");
		}else{
			apriErrore();
			return DatiCartella.logger.error("DatiCartella.loadRicovero('"+pIdenRicovero+"');");
		}

		DatiCartella.loadEvento(DatiCartella.Ricoveri,pIdenRicovero);
		CartellaPaziente.setIdenRicovero(pIdenRicovero);

		DatiCartella.Eventi[pIdenRicovero] = DatiCartella.Ricoveri[pIdenRicovero];
	},

	loadPrericovero:function(pIdenPrericovero){
		DatiCartella.logger.info("DatiCartella.loadPrericovero('"+pIdenPrericovero+"');");

		DatiCartella.loadEvento(DatiCartella.Prericoveri,pIdenPrericovero);
		CartellaPaziente.setIdenPrericovero(pIdenPrericovero);
	},

	loadForm:function(pRiferimento,pFormName,pKey,pAdditionalKey){
		DatiCartella.logger.info("DatiCartella.loadForm('"+pFormName+"','"+pKey+"');");

		var vKeyRiferimento = $('form[name="'+pFormName+'"] input[name="'+pKey+'"]').val();

		if(vKeyRiferimento == '')return null;

		pRiferimento[vKeyRiferimento] = {};

		$('form[name="'+pFormName+'"] input').each(function(){
			var _input = $(this);
			pRiferimento[vKeyRiferimento][_input.attr("name")] = _input.val();
		});

		if(typeof pAdditionalKey != 'undefined')
			pRiferimento[vKeyRiferimento][pAdditionalKey] = {};

		return vKeyRiferimento;

	},

	loadFromQuery:function(pRiferimento,pKeyRiferimento,pStatementName,pBinds){

		pRiferimento[pKeyRiferimento] = {};

		pBinds = (typeof pBinds == 'undefined' ? [pKeyRiferimento] : pBinds);

		var rs = executeQuery("cartellaPaziente.xml",pStatementName,pBinds);
		if(rs.next()){
			for(var i=0; i< rs.columns.length ; i++){
				pRiferimento[pKeyRiferimento][rs.columns[i]] = rs.getString(rs.columns[i]);
			}
		}

	},

	checkParameter:function(pValue){
		return typeof pValue != 'undefined' && pValue != null && pValue != '';
	}

};

var DatiInterfunzione = {

	data:{},

	load:function(){
		var data = (typeof document.EXTERN.DatiInterfunzione == 'undefined' ? "" : document.EXTERN.DatiInterfunzione.value);
		if(data != ''){
			var arData = data.split('*');
			for (var i=0; i < arData.length; i++){
				DatiInterfunzione.set(arData[i].split('=')[0],arData[i].split('=')[1]);
			}
		}
	},

	set:function(pKey,pValue){
		if(typeof pValue != 'undefined')
			DatiInterfunzione.data[pKey] = pValue;
	},

	get:function(pKey){
		if(typeof DatiInterfunzione.data[pKey] == 'undefined'){
			return "";
		}else{
			return DatiInterfunzione.data[pKey];
		}

	},

	remove:function(pKey){
		if(typeof DatiInterfunzione.data[pKey] != 'undefined')
			delete DatiInterfunzione.data[pKey];
	}

};

/**
 * Allow much of the functionality of bind() to be used in implementations that do not natively support it.
 */
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

/**
 * Libreria per la richiesta di conferma chiusura della pagina senza aver salvato le modifiche.
 * 
 * Utilizzo - Per rilevare le modifiche di input effettuate sul frame corrente e chiedere una conferma
 * all'uscita senza perdere i dati non salvati, chiamare la funzione DatiNonRegistrati.init(window)
 * all'onload della pagina. Quando le modifiche sono state salvate, chiamare la funzione
 * DatiNonRegistrati.reset(). Per correggere gli unload della pagina dovuti al click su link contenenti
 * codice javascript, utilizzare la funzione DatiNonRegistrati.repairLink(window). 
 * 
 * @author  linob
 * @author  darioc
 * @author  gianlucab
 * @version 1.4
 * @since   2012-09-05
 */
var DatiNonRegistrati = {};
(function() {
	
	// Attributi e metodi privati
	var _this = this;
	var _elements = {"select, input, textarea": "change", // default
					"label, .datepick-trigger, .pulsanteUrgenza0 a, .pulsanteUrgenza1 a, .pulsanteUrgenza2 a, .pulsanteUrgenza3 a, div.classDivTestiStd, div.classDivEpi, div.classDivDieta": "click"};
	var _confirm = "Attenzione: sono presenti dati non ancora salvati. Rimanere nella pagina corrente?";
	var _message = "Le modifiche non salvate andranno perse.";
	
	var _getFunzione = function(){return "undefined";};
	var _lastAction = function(){};
	
	function _repairLink(window, element, click, href) {
		click = typeof click === "string" ? click : "";
		href = typeof href === "string" ? href : "";
		
		var code = href.match(/^(javascript:)([\s\S]+)$/i);
		if (code) {
			href = code[2].replace(/^\;+|\;+$/,'');
			click = click.replace(/^\;+|\;+$/,'');
		
			code = [];
			// Aggiunge all'onclick il codice contenuto nell'href, impedendo che quest'ultimo venga eseguito
			if (click != "") code.push(click);
			if (href != "") code.push(href);
			code.push("return false;");
			
			element.onclick = window.Function(code.join(';'));
		}
	};

	// Attributi e metodi pubblici
	this.data = new Object();

	this.set = function(pValue){
		this.data[_getFunzione()] = pValue;
	};

	this.get = function(){
		return this.data[_getFunzione()];
	};

	this.check = function(){
		if(this.data[_getFunzione()]){
			var answer = !confirm(_confirm);
			this.set(!answer);
			return answer;
		}
		return true;
	};
	
	/**
	 * Inizializza il namespace corrente.
	 * 
	 * @param wnd  (object) frame per il quale è richiesto il salvataggio dei dati
	 * @param tags (object) tag HTML aggiuntivi (case sensitive) su cui effettuare il bind dell'evento desiderato.
	 */
	this.init = function(wnd, tags){		
		try {
			// Controlla l'esistenza del frame passato come parametro
			if (typeof wnd !== "object") {
				throw new ReferenceError("'wnd' non è definito");
			}
			
			// Inizializza le funzioni di callback
			if (typeof CartellaPaziente === 'object' && typeof CartellaPaziente.getFunzione === 'function') _getFunzione = CartellaPaziente.getFunzione;
			if (typeof utilMostraBoxAttesa === 'function') _lastAction = function(){utilMostraBoxAttesa(false);};
			
			// Personalizza i tag e gli eventi associati (opzionale)
			if (typeof tags === "object")
				$.extend(_elements, tags);

			// Definisce gli elementi HTML e gli eventi che richiedono la conferma all'uscita
			for (var e in _elements) {
				var event = _elements[e];
				if (typeof event === "string" && event != "") {
					wnd.$(e).bind(event, function(){_this.set(true);});
				}
			}
			
			// Sovrascrive le azioni da eseguire per l'evento onbeforeunload
			wnd.onbeforeunload = (
				function() {
					if (this.get()) {
						_lastAction();
						return _message;
					}
				}
			).bind(this); // utilizza lo scope del namespace corrente
			
			// Evita l'unload del frame quando si clicca su anchor che nell'href contengono codice javascript
			this.repairLink(wnd);
			
			// Inizializza la variabile che verrà modificata in seguito ad una o più modifica della pagina
			this.set(false);
		} catch(e) {
			alert(e.message);
		}
	};
	
	/**
	 * Annulla la richiesta di visualizzazione del popup di uscita.
	 */
	this.reset = function(){
		this.set(false);
	};
	
	/**
	 * Evita l'unload del frame quando si clicca su link che contengono codice javascript.
	 * 
	 * @param window  (object)
	 */
	this.repairLink = function(window) {
		var oThis = this;
		window.$("a").each(function(){
			// Chiama la funzione privata "repairLink" utilizzando lo scope del namespace corrente
			_repairLink.call(oThis, window, $(this)[0], $(this).attr("onclick"), $(this).attr("href"));
		});
	};
	
	/**
	 * Imposta il messaggio che viene visualizzato alla chiusura della pagina.
	 * 
	 * @param confirm (string)
	 */
	this.setConfirm = function(confirm) {
		_confirm = confirm;
	};

	/**
	 * Restituisce il messaggio che viene visualizzato alla chiusura della pagina.
	 */
	this.getConfirm = function() {
		return _confirm;
	};
	
	/**
	 * Imposta il messaggio che viene visualizzato all'unload della pagina.
	 * 
	 * @param message (string)
	 */
	this.setMessage = function(message) {
		_message = message;
	};

	/**
	 * Restituisce il messaggio che viene visualizzato all'unload della pagina.
	 */
	this.getMessage = function() {
		return _message;
	};
}).apply(DatiNonRegistrati);

var NS_PARAMETRI = {

    data:{},

    /*
     {
        <cod_cdc>:{
            <iden(radsql.CC_PARAMETRI_TYPE)>:{
                 iden:null,
                 descrizione:null,
                 cod_dec:null,
                 rilevabile:null,
                 sigla:null
                 }
             }
        }
     */

    load:function(cod_cdc){

        NS_PARAMETRI.data[cod_cdc]={};

        var rsParam = executeQuery("parametri.xml","getParametriRepartoConfigurat", [cod_cdc]);

        while(rsParam.next()){

            NS_PARAMETRI.data[cod_cdc][rsParam.getString('iden')]  = {
                valore_minimo : rsParam.getInt('VALORE_MINIMO'),
                valore_massimo : rsParam.getInt('VALORE_MASSIMO'),
                cod_dec : rsParam.getString('COD_DEC'),
                rilevabile : rsParam.getString('RILEVABILE'),
                sigla : rsParam.getString('SIGLA')
            };
        }
//        alert(NS_PARAMETRI.data['DH_MED_SV']['4'].valore_massimo);

    },

    getByIden:function(cod_cdc,iden_parametro){

        if(typeof(NS_PARAMETRI.data[cod_cdc]) == 'undefined'){
            NS_PARAMETRI.load(cod_cdc);
        }

        return NS_PARAMETRI.data[cod_cdc][iden_parametro];


    },

    getByCodice:function(cod_cdc,cod_parametro){

        if(typeof(NS_PARAMETRI.data[cod_cdc]) == 'undefined'){
            NS_PARAMETRI.load(cod_cdc);
        }

         for(var iden_parametro in NS_PARAMETRI.data[cod_cdc]){

             if(NS_PARAMETRI.data[cod_cdc][iden_parametro].cod_dec == cod_parametro){
                 return NS_PARAMETRI.data[cod_cdc][iden_parametro];
             }

         }

    },

    checkRange:function(valore,cod_cdc,params){/*
            iden_parametro || cod_parametro

        */

        var parametro = null;
        var response={lower:false,higher:false};

        if(typeof params.iden_parametro != 'undefined'){
            parametro = NS_PARAMETRI.getByIden(cod_cdc,params.iden_parametro);
        }

        if(typeof params.cod_parametro != 'undefined'){
            parametro = NS_PARAMETRI.getByCodice(cod_cdc,params.cod_parametro);
        }

        if(parametro == null){
            return alert('Errore di sistema parametro Nullo');
        }

        if (valore != '' && valore < parametro.valore_minimo){
            response.lower = true;
        };

        if (valore != '' && valore > parametro.valore_massimo){
            response.higher = true;
        };

        return response;

    }
};
