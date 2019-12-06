var NS_CONTATTO_METHODS =
{
		/**
		 * Oggetto di riferimento per la valorizzazione del contatto.
		 * Sostituisce la variabile globale _JSON_CONTATTO
		 */
		contatto : null,

		executeAJAX : function(params)
		{

		   	//console.log(JSON.stringify(NS_CONTATTO_METHODS.contatto));


			NS_CONTATTO_METHODS.initLogger();
			NS_LOADING.showLoading({"timeout" : 0});
			params.notifica.width = typeof params.notifica.width == "undefined" ? 400 : params.notifica.width;

			loggerContattoMethods.debug(params.hl7Event + " - Init " + params.servlet + " - params -> ");
			// + JSON.stringify(params.contatto)
			var startTime = new Date().getTime();

			var url = "";
			url += typeof params.scope == "undefined" || params.scope == null ? "adt" : params.scope.replace("/","");
			url += "/";
			url += params.servlet;
			url += "/";
			url += typeof params.type == "undefined" || params.type == null ? "json" : params.type.replace("/","");
			url += "/";
			url += typeof params.query == "undefined" ? "" : params.query;

			loggerContattoMethods.debug(params.hl7Event + " - Url " + params.servlet + " -> " + url);

			$.ajax({
		        url : url,
		        dataType : "json",
		        type : "POST",
				data : JSON.stringify(NS_CONTATTO_METHODS.contatto),
		        error: function(jqXHR, textStatus, errorThrown)
		        {
		        	NS_LOADING.hideLoading();

		        	loggerContattoMethods.error(params.hl7Event + " - " + params.servlet + " - AJAX Error : " + " jqXHR -> " + JSON.stringify(jqXHR) + ", textStatus -> " + textStatus + ", errorThrown -> " + errorThrown);
		        	home.NOTIFICA.error({message: params.notifica.errorMessage, timeout: 0, width : params.notifica.width, title: "Error"});

		        	if (typeof params.cbkError == "function")
	            	{
	            		loggerContattoMethods.error(params.hl7Event + " - " + params.servlet + " - Eseguo ERROR Callback -> " + params.cbkError);
	            		params.cbkError(jqXHR);
	            	}
		        },
		        success : function(data, status)
		        {
		        	NS_LOADING.hideLoading();

					NS_CONTATTO_METHODS.contatto = typeof data.contatto !== "undefined" ? Ricovero.extend(data.contatto) : Ricovero.extend(NS_CONTATTO_METHODS.contatto);

					loggerContattoMethods.info(params.hl7Event + " - " + params.servlet + " - Manipolazione Contatto + {id : " + NS_CONTATTO_METHODS.contatto.id + "} Avvenuta con Successo - Tempo Impiegato " + (new Date().getTime() - startTime) + " ms");

					if (params.notifica.show === "S") {
						home.NOTIFICA.success({message: params.notifica.message, timeout: params.notifica.timeout, width : params.notifica.width, title: "Success"});
					}

					if (typeof params.cbkSuccess == "function") {
						loggerContattoMethods.info(params.hl7Event + " - " + params.servlet + " - Eseguo SUCCESS Callback -> " + params.cbkSuccess);
						params.cbkSuccess();
					}
		        }
		    });
		},

		admitVisitNotification : function(params)
		{
			params.servlet = "AdmitVisit";

			NS_CONTATTO_METHODS.contatto = params.contatto;
			NS_CONTATTO_METHODS.executeAJAX(params);
		},

		/**
		 * Metodo per il trasferimento del contatto.
		 * All'interno viene gestito il tipo di trasferimento.
		 *
		 * @param params
		 * @author alessandro.arrighi
		 */
		transferPatient : function(params)
		{
			params.servlet = params.tipoTrasferimento === "GA" || params.tipoTrasferimento === "G" ? "TransferPatientGiuridico" : "TransferPatientAssistenziale";

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);
			NS_CONTATTO_METHODS.executeAJAX(params);
		},

		/**
		 * Metodo specifico per la richiesta di trasferimento.
		 * Come per il trasferimento per prima cosa determina se si tratta di una richiesta di trasferimento giuridico o assistenziale.
		 * I metodi invocati sono gli stessi del trasferimento.
		 * Sono state divise le chiamate per evitare di invocare l'integrazione del trasferimento in fase id richiesta
		 * in quanto produce un disallineamento tra ADT e cartella (cartella non gestisce lo stato REQUESTED)
		 *
		 * @param params
		 * @author alessandro.arrighi
		 */
		pendingTransfer : function(params)
		{
			params.servlet = params.tipoTrasferimento === "GA" || params.tipoTrasferimento === "G" ? "PendingTransferGiuridico" : "PendingTransferAssistenziale";

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);
			NS_CONTATTO_METHODS.executeAJAX(params);
		},

		/**
		 * Metodo per la cancellazione di un trasferimento.
		 * All'interno viene gestito il tipo di cancellazione.
		 *
		 * @param params
		 * @author alessandro.arrighi
		 */
		cancelTransferPatient : function(params)
		{
			params.servlet = params.tipoTrasferimento === "GA" || params.tipoTrasferimento === "GA" ? "CancelTransferGiuridico" : "CancelTransferAssistenziale";

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);
			NS_CONTATTO_METHODS.executeAJAX(params);
		},

		/**
		 * Metodo per la cancellazione della richiesta di trasferimento.
		 * All'interno viene gestito il tipo di cancellazione.
		 *
		 * @param params
		 * @author alessandro.arrighi
		 */
		cancelPendingTransfer : function(params)
		{
			// Se non stabilito a priori determino che tipo  di richiesta devo annullare
			if (params.servlet == null && params.tipoTrasferimento != null)
			{
				params.servlet = params.tipoTrasferimento === "GA" || params.tipoTrasferimento === "G" ? "CancelPendingTransferGiuridico" : "CancelPendingTransferAssistenziale";
			}
			else if (params.servlet == null && params.tipoTrasferimento == null)
			{
				loggerContattoMethods.error(params.hl7Event + " - " + params.servlet + " - Tipo di richiesta di trasferimento non definito. il tipo di richiesta (Giuridico o Assistenziale)");
	        	home.NOTIFICA.error({message: params.notifica.errorMessage, timeout: 0, width : params.notifica.width, title: "Error"});
			}

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);
			NS_CONTATTO_METHODS.executeAJAX(params);
		},

		/**
		 * Metodo specifico per l'accettazione del trasferimento giuridico assistenziale.
		 * Viene effettuato un UpdatepatientInformationPartial e nella stessa transazione il cambio di stato dei segmenti.
		 *
		 * @param params
		 * @author alessandro.arrighi
		 */
		accettaTrasferimentoGiuridico : function(params)
		{
			params.servlet = "AccettaTrasferimentoGiuridico";

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);
			NS_CONTATTO_METHODS.executeAJAX(params);
		},

		/**
		 * Metodo specifico per l'accettazione del trasferimento assistenziale.
		 * Viene effettuato un UpdatepatientInformationPartial e nella stessa transazione il cambio di stato dei segmenti.
		 *
		 * @param params
		 * @author alessandro.arrighi
		 */
		accettaTrasferimentoAssistenziale : function(params)
		{
			params.servlet = "AccettaTrasferimentoAssistenziale";

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);
			NS_CONTATTO_METHODS.executeAJAX(params);
		},

		/**
		 * Metodo specifico per l'ammissione del pre-ricovero.
		 * Invoca la Servlet <i>PreAdmitVisit</i> che invoca gli stessi metodi del controller utilizzati per <i>AdmitVisit</i>
		 * la logica per il calcolo del Numero Nosologico � definita dentro gli script groovy del controller ADT.
		 *
		 * @param params
		 * @author alessandro.arrighi
		 */
		preAdmitVisitNotification : function(params)
		{
			params.servlet = "PreAdmitVisit";

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);
			NS_CONTATTO_METHODS.executeAJAX(params);
		},

		/**
		 * Metodo per la modifica generica dell'oggetto contatto.
		 * Effettua l'update del contatto, dei trasferimenti, dei codici ICD.
		 * In alcuni metodi come il DischargeVisit viene invocata prima del metodo
		 * per apportare tutte le modifiche non gestite dal metodo specifico.
		 *
		 * @param params
		 * @author alessandro.arrighi
		 */
		updatePatientInformation : function(params)
		{
			params.servlet = "UpdatePatientInformation";

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);
			NS_CONTATTO_METHODS.executeAJAX(params);
		},

		/**
		 * Metodo per la dimissione del contatto.
		 * Invoca prima l'updatePatentInformation per impostare tutte le informazioni accessorie alla dimissione.
		 *
		 * @author alessandro.arrighi
		 * @param params
		 */
		dischargeVisit : function(params)
		{
			params.servlet = "DischargeVisit";

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);

			var _discharge_visit = function(params)
			{
				NS_CONTATTO_METHODS.executeAJAX(params);
			};

			_discharge_visit(params);

		},

		/**
		 * Funzione che consente il cambio di anagrafica di un contatto.
		 *
		 * @author alessandro.arrighi
		 * @param params
		 */
		moveVisit : function(params)
		{
			params.servlet = "MoveVisit";
			params.query = JSON.stringify(params.anagrafica);

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);

			NS_CONTATTO_METHODS.executeAJAX(params);
		},

		/**
		 * Metodo che consente di annullare l'inserimento di un contatto.
		 * Prima del metodo specifico per il cambiamento di stato effettua un UpdatepatientInformation per settare il motivo.
		 *
		 * @param params
		 */
		cancelAdmission : function(params)
		{
			params.servlet = "CancelAdmission";

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);

			var _cancel_admission = function(params)
			{
				NS_CONTATTO_METHODS.executeAJAX(params);
			};

			_cancel_admission(params);
		},

		/**
		 * Metodo specifico per la cancellazione del pre-ricovero.
		 * Invoca la servlet <i>CancelPreAdmission</i> che invoca gli stessi metodi del controller della servlet <i>CancelAdmission</i>
		 *
		 * @author alessandro.arrighi
		 */
		cancelPreAdmission : function(params) {

			params.servlet = "CancelPreAdmission";

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);

			var _cancel_pre_admission = function(params)
			{
				NS_CONTATTO_METHODS.executeAJAX(params);
			};

			_cancel_pre_admission(params);
		},

		/**
		 * Metodo che consente di annullare la dimissione di un ricovero.
		 * Cambia lo stato del contatto e degli ultimi segmenti DELETED = N.
		 *
		 * @param params
		 * @author alessandro.arrighi
		 */
		cancelDischarge : function(params)
		{

			params.servlet = "CancelDischarge";

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);

			var _cancel_discharge = function(params)
			{
				NS_CONTATTO_METHODS.executeAJAX(params);
			};

			_cancel_discharge(params);
		},

		/**
		 * Metodo specifico per l'inserimento/modifica del singolo accesso assistenziale.
		 * L'inserimento o la modifica dipendono dalla valorizzazione dell'ID del segmento. ID == NULL ? INSERIMENTO : MODIFICA.
		 * params.contatto deve contenere l'accesso che si intende manipolare.
		 * Questa gestione per non reimplementare un file dedicato alla gestione degli accessi.
		 *
		 * @param params
		 * @author alessandro.arrighi
		 */
		upsertAccesso : function(params)
		{
			params.servlet = "UpsertContattoAssistenziale";

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);
			NS_CONTATTO_METHODS.executeAJAX(params);
		},

		/**
		 * Metodo specifico per il trasferimento dell'accesso assistenziale.
		 * params.contatto deve contenere l'accesso che si intende trasferire.
		 * l'accesso
		 *
		 * @param params
		 * @author alessandro.arrighi
		 */
		trasferisiciAccesso : function(params)
		{
			params.servlet = "TrasferisciContattoAssistenziale";

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);
			NS_CONTATTO_METHODS.executeAJAX(params);
		},

		/**
		 * Metodo specifico per l'annullamento del singolo accesso assistenziale.
		 * params.contatto deve contenere l'accesso che si intende manipolare.
		 * Questa gestione per non reimplementare un file dedicato alla gestione degli accessi.
		 *
		 * @param params
		 * @author alessandro.arrighi
		 */
		annullaAccesso : function(params)
		{
			params.servlet = "AnnullaContattoAssistenziale";

			NS_CONTATTO_METHODS.contatto = Ricovero.extend(params.contatto);
			NS_CONTATTO_METHODS.executeAJAX(params);
		},


		/**
		 * Metodo generico invocato per la restituzione del contatto.
		 *
		 * @param parameters {filter : tipo di valore a cui corrisponde parameters.value, value : valore identificativo del contatto, body : Assigning Authority Area, cbkSuccess : function, cbkError : function}
		 * @author alessandro.arrighi
		 */
		getContatto : function(parameters){
			try {

				var url = typeof parameters.scope != 'undefined'? parameters.scope : "adt";

				NS_CONTATTO_METHODS.initLogger();
				NS_CONTATTO_METHODS.contatto = null;

				loggerContattoMethods.debug("Get Contatto - Init - parameters: " + JSON.stringify(parameters));

				switch (parameters.filter) {
					case 'CODICE' :
						url += '/GetContattoByCodice/string/';
						break;
					case 'IDEN':
						url += '/GetContattoById/string/';
						break;
					case 'EMPTY':
						url += '/GetContattoVoid/string/';
						break;
					case 'ANAGRAFICA':
						url += '/GetContattiAnagrafica/string/';
						break;
				}

				$.ajax({
					url     : url + parameters.value + "?ts=" + new Date().getTime(),
					type    : "POST",
					dataType: "json",
					async   : false,
					cache   : false,
					data    : parameters.body,
					error   : function (jqXHR, textStatus, errorThrown) {
						home.NOTIFICA.error({
							message: "Errore Durante Get Contatto \n jqXHR: " + jqXHR + "\n textStatus: " + textStatus + "\n errorThrown: " + errorThrown,
							title  : "Error",
							timeout: 0
						});
						loggerContattoMethods.error("Get Contatto - Error - parameters " + JSON.stringify(parameters) + " jqXHR: " + jqXHR + " - textStatus: " + textStatus + " - errorThrown: " + errorThrown);

						if(typeof parameters.cbkError == "function") {
							parameters.cbkError();
						}
					},
					success : function (data) {

						if( typeof parameters.scope != 'undefined' &&  parameters.scope == 'adt' ){
							NS_CONTATTO_METHODS.contatto = Ricovero.extend(data.contatto);
						}else if(typeof parameters.scope != 'undefined' &&  parameters.scope == 'ps'){
							NS_CONTATTO_METHODS.contatto = data.contatto;
						}else{
							NS_CONTATTO_METHODS.contatto = Ricovero.extend(data.contatto);
						}


						if(typeof parameters.cbkSuccess == "function") {
							loggerContattoMethods.debug("Get Contatto - Invocazione cbkSuccess");
							parameters.cbkSuccess();
						}
					}
				});

				return Ricovero.extend(NS_CONTATTO_METHODS.contatto);
			}catch(e){
					logger.error(e.code  + ' - '+ e.message );
					home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});

			}
		},

		getContattoById : function(value, p)
		{
			var parameters = {
					"filter" : "IDEN",
					"value" : value,
					"body" : null,
					"cbkSuccess" : typeof p == "undefined" ? null : p.cbkSuccess,
					"cbkError" : typeof p == "undefined" ? null : p.cbkError
			};

			return NS_CONTATTO_METHODS.getContatto(parameters);
		},

		getContattoByCodice : function(value, p)
		{
			var params = typeof p == "undefined" ? {"cbkSuccess": null, "cbkError" : null, assigningAuthorityArea : "ADT"} : p;

			var parameters = {
					"filter" : "CODICE",
					"value" : value,
					"body" : typeof params.assigningAuthorityArea == "undefined" || params.assigningAuthorityArea == null ? "ADT" : params.assigningAuthorityArea,
					"cbkSuccess" : typeof params.cbkSuccess == "undefined" ? null : params.cbkSuccess,
					"cbkError" : typeof params.cbkError == "undefined" ? null : params.cbkError
			};

			return NS_CONTATTO_METHODS.getContatto(parameters);
		},

		getContattiAnagrafica : function(value, p)
		{
			var params = typeof p == "undefined" ? {"cbkSuccess": null, "cbkError" : null, assigningAuthorityArea : "ADT"} : p;

			var parameters = {
					"filter" : "ANAGRAFICA",
					"value" : value,
					"body" : typeof params.assigningAuthorityArea == "undefined" || params.assigningAuthorityArea == null ? "ADT" : params.assigningAuthorityArea,
					"cbkSuccess" : typeof params.cbkSuccess == "undefined" ? null : params.cbkSuccess,
					"cbkError" : typeof params.cbkError == "undefined" ? null : params.cbkError
			};

			return NS_CONTATTO_METHODS.getContatto(parameters);
		},

		getContattoEmpty : function(p)
		{
			var params = typeof p == "undefined" ? {"cbkSuccess": null, "cbkError" : null, assigningAuthorityArea : "ADT"} : p;

			var parameters = {
					"filter" : "EMPTY",
					"value" : null,
					"body" : params.assigningAuthorityArea == null ? "ADT" : params.assigningAuthorityArea,
					"cbkSuccess" : params.cbkSuccess,
					"cbkError" : params.cbkError
			};

			return NS_CONTATTO_METHODS.getContatto(parameters);
		},

		initLogger : function()
		{
			home.NS_CONSOLEJS.addLogger({name:'NS_CONTATTO_METHODS', console:0});
	        window.loggerContattoMethods = home.NS_CONSOLEJS.loggers['NS_CONTATTO_METHODS'];
		}
};
/**
 *
 * @constructor
 */
var ContattoAssistenziale = function () {
	this._parent = null;
};
/**
 *
 * @constructor
 */
var ContattoGiuridico = function () {
	this._parent = null;
};
/**
 *
 * @constructor
 */
var Ricovero = function(){};

/**
 * funzione per estendere il ricovero
 * @param data
 * @return {*}
 */
Ricovero.extend = function(data){
	if(typeof data === 'undefined'){
		throw new Ricovero.errors["parametro.errato"](arguments);
	}
	if(data.constructor === Ricovero){
		return data;
	}

	var contatto = $.extend(data, new Ricovero());
	contatto.constructor = Ricovero;
	return contatto;
};
/**
 * funzione per istanziare il contatto assistenziale
 * @param data
 * @param _parent
 * @return {*}
 */
ContattoAssistenziale.extend = function(data, _parent){
	if(data.constructor === ContattoAssistenziale){
		return data;
	}

	var contattoassistenziale = $.extend(data, new ContattoAssistenziale());
	contattoassistenziale._parent = _parent;
	contattoassistenziale.constructor = ContattoAssistenziale;
	return contattoassistenziale;
};
/**
 * funzione per istanziare il contatto giuridico
 * @param data
 * @param _parent
 * @return {*}
 */
ContattoGiuridico.extend = function(data, _parent){
	if(data.constructor === ContattoGiuridico){
		return data;
	}

	var contattogiuridico = $.extend(data, new ContattoGiuridico());
	contattogiuridico._parent = _parent;
	contattogiuridico.constructor = ContattoGiuridico;
	return contattogiuridico;
};
/**
 * Funzione che clona l'oggetto contatti assistenziali
 * @return {*}
 */
ContattoAssistenziale.prototype.clone = function(){

	var contattoCloned = $.extend(new ContattoAssistenziale(), this);
	contattoCloned.id = null;
	return contattoCloned;
};
/**
 * Funzione che clona l'oggetto contatto giuridico
 * @return {*}
 */
ContattoGiuridico.prototype.clone = function(){

	var contattoCloned = $.extend(new ContattoGiuridico(),this);
	contattoCloned.id = null;
	return contattoCloned;
};


/**
 * funzione che imposta la data fine e effettua i controlli
 * @param data
 */
ContattoAssistenziale.prototype.setDataFine = function(data) {
	//controllo formato dell'ora
	if(!Date.checkFormat(data)){
		throw new Ricovero.errors["data.formaterror"](arguments);
	}

	var dataInizio = moment(this.dataInizio,"YYYYMMDDHH:mm");
	var dataFine = moment(data,"YYYYMMDDHH:mm");

	//strettamente successivo all'inizio di sè stesso
	if(dataInizio.isAfter(dataFine)){
		throw new Ricovero.errors["datafine.successiva"](arguments);
	}


	if(this._parent.isOrdinario()) {
		this.dataFine = data;
		return;
	}

	if(this._parent.isDayHospital()) {

		if(this._parent.isODS()) {
			//se è dimesso con tipo volontaria o deceduto
			if(this._parent.isDimissioneVolontaria() || this._parent.isDimissioneDecesso()){

				//giorno di inzio di sè stesso o il successivo tollerato, tutto il resto no
				if(Number(dataFine.format('YYYYMMDD') > Number(dataInizio.add(2, 'day').format('YYYYMMDD')))){
					throw new Ricovero.errors["datafine.giornoodiernoogiornosuccessivo"](arguments);
				}
			}else{

				//giorno successivo all'inzio di sè stesso
				if(dataFine.format("YYYYMMDD") != dataInizio.add(1, 'day').format("YYYYMMDD")){

					throw new Ricovero.errors["datafine.giornosuccessivo"](arguments);
				}
			}
		} else {
			//giorno di inzio di sè stesso
			if(!dataFine.isSame(dataInizio, 'days')){
				throw new Ricovero.errors["datafine.diversaaccessodh"](arguments);
			}

		}

		//se la data di fine è diversa da quella del ricovero e non è un dh imposto la stessa data anche nel ricovero
		if((this._parent.dataFine != null &&  this._parent.dataFine != "" ) && this === this._parent.getLastAccessoAssistenziale() && this._parent.dataFine != data){
			var dataFineOld = this.dataFine;
			//provo a mettere la data fine anche al contatto
			try{
				this.dataFine = data;
				this._parent.setDataFine(data);
			}catch (e){
				//se va in eccezzione metto la data vecchia
				this.dataFine = dataFineOld;
				throw e;
			}


		}else{
			this.dataFine = data;
		}

		return;
	}

	if(this._parent.isPreRicovero()){
		this.dataFine = data;
		return;
	}

	throw new Ricovero.errors["regime.mancante"](arguments);

};
/**
 * funzion che mette la data di fine al contatto giuridico effettuando il controllo
 *
 * @param data
 */
ContattoGiuridico.prototype.setDataFine = function(data) {
	//controllo sul formato della data
	if(!Date.checkFormat(data)){
		throw new Ricovero.errors["data.formaterror"](arguments);
	}else{

		var dataInizio = moment(this.dataInizio,"YYYYMMDDHH:mm");
		var dataFine = moment(data,"YYYYMMDDHH:mm");

		//strettamente successivo all'inizio di sè stesso
		if(dataInizio.isAfter(dataFine)){
			throw new Ricovero.errors["datafine.successiva"](arguments);
		}


		if(this._parent.isOrdinario()) {
			this.dataFine = data;
			return;
		}
		//se è un day hospital
		if(this._parent.isDayHospital()) {
			//se è un ricovero di ODS
			if(this._parent.isODS()) {
				//se è dimesso con tipo volontaria o deceduto
				if(this._parent.isDimissioneVolontaria() || this._parent.isDimissioneDecesso()){

					//giorno di inzio di sè stesso o il successivo tollerato, tutto il resto no
					if(!(Number(dataInizio.add(2, 'day').format('YYYYMMDD')) > Number(dataFine.format('YYYYMMDD')))){
						throw new Ricovero.errors["datafine.giornoodiernoogiornosuccessivo"](arguments);
					}
				}else{

					//giorno successivo all'inzio di sè stesso

					//if(dataInizio.add(1, 'day').diff(dataFine, 'days') !== 0){ da NaN
					if(dataInizio.add(1, 'day').format("YYYYMMDD") !== dataFine.format("YYYYMMDD")){

							throw new Ricovero.errors["datafine.giornosuccessivo"](arguments);
					}
				}
			}
			//giorno di inzio di sè stesso solo se è un DS
			if(this._parent.isDS()){
				if(dataFine.diff(dataInizio, 'days') > 0 ){
				 throw new Ricovero.errors["datafine.diversaaccessodh"](arguments);
				 }
			}

			this.dataFine = data;
			return;
		}

	}
	if(this._parent.isPreRicovero()){
		this.dataFine = data;
		return;
	}
	//regime non gestito
	throw new Ricovero.errors["regime.mancante"](arguments);

};

/**
 * funzione che setta la data di fine con i controlli
 * @param dataFine
 */
Ricovero.prototype.setDataFine = function(dataFine){
	var dataInizioGiuridici =  moment(this.getLastAccessoGiuridico().dataInizio,"YYYYMMDDHH:mm");
	var dataFineAccessoAssistenziale = this.getLastAccessoAssistenziale().dataFine;
	var momDataFine ="";
	//controllo sul formato dell'ora
	if(!Date.checkFormat(dataFine)){
		throw new Ricovero.errors["data.formaterror"](arguments);
	}else{
		momDataFine = moment(dataFine,"YYYYMMDDHH:mm");
	}

	//strettamente precedente alla data di inizio ricovero
	if(this.dataInizio != '' && moment(this.dataInizio,"YYYYMMDDHH:mm").isAfter(momDataFine)){
		throw new Ricovero.errors["datafine.successivaultimoaccessogiuridico"](arguments);
	}

	//strettamente successivo all'inizio dell'ultimo giuridico
	if(dataInizioGiuridici.isAfter(momDataFine)){
		throw new Ricovero.errors["datafine.successivaultimoaccessogiuridico"](arguments);
	}

	//controlli da effettuare su DH non chirurgico
	if(this.isDayHospital() && !this.isChirurgico()){
		//se ultimo assistenziale non ha data fine solleva eccezione
		if(dataFineAccessoAssistenziale === '' || dataFineAccessoAssistenziale == null){
			throw new Ricovero.errors["datafine.contattoassistenzialenull"](arguments);
		}

		//deve essere uguale alla data fine dell'ultimo assistenziale
		if(dataFineAccessoAssistenziale != dataFine){
			throw new Ricovero.errors["datafine.contattoassistenzialediversa"](arguments);
		}

	}

	Ricovero.controlloODSDataTipoDimissione(this, momDataFine, null);
	var dataFineOld = this.dataFine;
	try {
		if(dataFine != this.getLastAccessoAssistenziale().dataFine ){
			this.getLastAccessoAssistenziale().setDataFine(dataFine);
		}
		if(dataFine != this.getLastAccessoGiuridico().dataFine ){
			this.getLastAccessoGiuridico().setDataFine(dataFine);
		}

		this.dataFine = dataFine;
	}catch (e){
		this.dataFine = dataFineOld;
		throw e;
	}


};
/**
 * imposta la data di inizio del contatto assistenziale  con i dovuti controlli
 * @param data
 */
ContattoAssistenziale.prototype.setDataInizio = function (data) {
	//controllo sul formato dell'ora
	if(!Date.checkFormat(data)){
		throw new Ricovero.errors["data.formaterror"](arguments);
	}

	// controllo che la data di inizio nn sia precedente  alla data di inizio ricovero
	/*if(Number(moment(this._parent.dataInizio, "YYYYMMDDHH:mm").format("YYYYMMDDHHmm")) >= Number(moment(data, "YYYYMMDDHH:mm").format("YYYYMMDDHHmm"))){
		throw new Ricovero.errors["data.dataprecedente"];
	} */

	if(Number(moment(data, "YYYYMMDDHH:mm").format("YYYYMMDDHHmm")) < Number(moment(this._parent.dataInizio, "YYYYMMDDHH:mm").format("YYYYMMDDHHmm"))){
		throw new Ricovero.errors["data.dataprecedente"](arguments);
	}

	//se è presene la data di fine deve essere successiva alla data di inizio
	if(this.dataFine != null && this.dataFine != '' && (moment(data, "YYYYMMDDHH:mm").isAfter(moment(this.dataFine, "YYYYMMDDHH:mm"))) ){
		throw new Ricovero.errors["data.datasucessiva"](arguments);
	}

	//se è presente la data di fine del ricovero la data inizio deve essere strettamente precedente
	if(this._parent.dataFine != null && this._parent.dataFine != '' && (moment(data, "YYYYMMDDHH:mm").isAfter(moment(this._parent.dataFine, "YYYYMMDDHH:mm"))) ){
		throw new Ricovero.errors["data.datasucessiva"](arguments);
	}


	//controlli da fare su un ricovero ordinario
	if(this._parent.isOrdinario()){
		//ciclo tutti i contatti assistenziali
		for (var j = 0; j < this._parent.contattiAssistenziali.length; j++)
		{
			//solo in caso di trasferimento  (STATO REQUESTED)  se c'è già un trasferimento sollevo eccezione
			if (this._parent.contattiAssistenziali[j].stato.codice === "REQUESTED")
			{
				throw new Ricovero.errors["trasferimento.giarichiesto"](arguments);

			}

			if(this === this._parent.contattiAssistenziali[j]){
				continue;
			}
			//controlli che la data inserita non sia precedente alla data di inizio degli altri contatti assistenziali SUCESSIVI
			if (
				!(moment(data, "YYYYMMDDHH:mm").isAfter(moment(this._parent.contattiAssistenziali[j].dataInizio,"YYYYMMDDHH:mm")))
			){
				//data, this._parent.contattiAssistenziali[j].dataInizio
				arguments.indice = j;
				arguments.dataInizio = this._parent.contattiAssistenziali[j].dataInizio;
				throw new Ricovero.errors["data.datainizioprecedentedatainiziotrasferimento"](arguments);
			}

		}

	}
    //considerando che la data di inizio di un'accesso dh non può essere modificata
	//se è un dh devo controllare che non ci sia già un accesso in quella data
	if(this._parent.isDayHospital()){

		//ciclo tutti gli accessi e faccio un controllo  che non ci siano già accessi in quella data.
		var accessi =this._parent.contattiAssistenziali;
		for (var i=0; i < accessi.length; i++)
		{
			//se è lo stesso accesso che si sta provando ad inserire non effettuo alcun controllo se non quelli già fatti precedentemente
			if(this === accessi[i]){
				continue;
			}
			//se è in inserimento l'id sara null altrimenti si tratta di una modifica di accesso
			if (accessi[i].dataInizio /*accessi[i].dataInizio != null && accessi[i].dataInizio != "" */)
			{
				//se il giorno è lo stesso sollevo eccezzione
				if (accessi[i].dataInizio.substring(0,8) == data.substring(0,8)){
					throw new Ricovero.errors["data.dataInizioAssistenzialeAccDupl"](arguments);
				}
				// direttiva se c'e' un accesso aperto impedire di inserire un nuovo accesso
				if(accessi[i].stato.codice == 'ADMITTED'){
					throw new Ricovero.errors["accessoAssistenziale.accessogiaaperto"](arguments);
				}

			}
		}

		//effettuo il controllo che il nuovo accesso sia nell'anno di apertura del ricovero
		if(moment(this._parent.dataInizio, "YYYYMMDDHH:mm").format("YYYY") != moment(data, "YYYYMMDDHH:mm").format("YYYY")){
			throw new Ricovero.errors["data.annodiverso"](arguments);
		}
	}
	this.dataInizio = data;

};
/***
 * Imposta la data di inizio al contatto giuridico
 * @param data
 */

ContattoGiuridico.prototype.setDataInizio = function (data) {
	if(!Date.checkFormat(data)){
		throw new Ricovero.errors["data.formaterror"](arguments);
	}
	//se regime è ordinario e si sta impostando una data di inizio sucessiva alla data di un trasferimento sollevare eccezzion
	if(this._parent.isOrdinario()){
		//ciclo tutti i contatti assistenziali
		for (var j = 0; j < this._parent.contattiGiuridici.length; j++)
		{
			//solo in caso di trasferimento  (STATO REQUESTED)  se c'è già un trasferimento sollevo eccezione
			if (this._parent.contattiGiuridici[j].stato.codice === "REQUESTED")
			{
				throw new Ricovero.errors["trasferimento.giarichiesto"](arguments);

			}

			if(this === this._parent.contattiGiuridici[j]){
				continue;
			}
			//controlli che la data inserita non sia precedente alla data di inizio degli altri contatti assistenziali SUCESSIVI
			if (
				!(moment(data, "YYYYMMDDHH:mm").isAfter(moment(this._parent.contattiGiuridici[j].dataInizio,"YYYYMMDDHH:mm")))
			){
				//data, this._parent.contattiAssistenziali[j].dataInizio
				arguments.indice = j;
				arguments.dataInizio = this._parent.contattiGiuridici[j].dataInizio;
				throw new Ricovero.errors["data.datainizioprecedentedatainiziotrasferimento"](arguments);
			}

		}

	}

	this.dataInizio = data;
};
/**
 * funzione che imposta la data di inizio con i dovuti controlli
 * @param data
 */
Ricovero.prototype.setDataInizio = function(data){
	//controllo formato data
	if(!Date.checkFormat(data)){
		throw new Ricovero.errors["data.formaterror"](arguments);
	}
	this.dataInizio = data;
	this.getAccessoAssistenziale(0).setDataInizio(data);
	this.getAccessoGiuridico(0).setDataInizio(data);
	/*
	this.getLastAccessoAssistenziale().setDataInizio(data);
	this.getLastAccessoGiuridico().setDataInizio(data);
	*/


};
/**
 *
 * @return {boolean}
 */
ContattoAssistenziale.prototype.isAccesso = function () {
	return this.accesso === "S";

};
/**
 *
 * @return {boolean}
 */
ContattoAssistenziale.prototype.isAdmitted = function () {
	return this.stato.codice === "ADMITTED";
};
/**
 *
 * @return {boolean}
 */
ContattoAssistenziale.prototype.isDischarged = function () {
	return this.stato.codice === "DISCHARGED";

};
/**
 *
 * @return {boolean}
 */
ContattoAssistenziale.prototype.isNullified = function () {
	return this.stato.codice === "NULLIFIED";

};

/**
 *
 * @return {boolean}
 */
Ricovero.prototype.isDimissioneVolontaria = function (){

	 return (typeof this.mapMetadatiCodifiche.ADT_DIMISSIONE_TIPO != 'undefined') && (this.mapMetadatiCodifiche.ADT_DIMISSIONE_TIPO.codice === "5" || this.mapMetadatiCodifiche.ADT_DIMISSIONE_TIPO.iden === "185");
};
/**
 *
 * @return {boolean}
 */
Ricovero.prototype.isDimissioneDecesso = function (){
	return (typeof this.mapMetadatiCodifiche.ADT_DIMISSIONE_TIPO != 'undefined') && (this.mapMetadatiCodifiche.ADT_DIMISSIONE_TIPO.codice === "1" || this.mapMetadatiCodifiche.ADT_DIMISSIONE_TIPO.iden === "181" );
};

/**
 *
 * @param index
 * @return {*}
 */
Ricovero.prototype.getAccessoAssistenziale = function(index){
	//verifico che l'index che mi è arrivato sia minore della lunghezza dei contatti assistenziali

	if(index > this.contattiAssistenziali.length -1){
		throw new Ricovero.errors["assistenziale.indiceInesistente"](arguments);
	}
	if(this.contattiAssistenziali[index].constructor !== ContattoAssistenziale){

		this.contattiAssistenziali[index] = ContattoAssistenziale.extend(this.contattiAssistenziali[index], this);
	}
	return this.contattiAssistenziali[index];
};
/**
 * funzione che torna l'ultimo accesso assistenziale
 * @return {*}
 */
Ricovero.prototype.getLastAccessoAssistenziale = function(){

	return this.getAccessoAssistenziale(this.contattiAssistenziali.length -1);
};
/**
 * funzione che torna il contatto assistenziale avendo l'ID
 * @param iden
 * @return {*}
 */
Ricovero.prototype.getAccessoAssistenzialeFromId = function(iden){

	for (var i = 0; i < this.contattiAssistenziali.length; i++)
	{
		if (this.contattiAssistenziali[i].id ==iden)
		{
			return this.getAccessoAssistenziale(i);
		}
	}

	throw new Ricovero.errors["assistenziale.accessononpresente"](arguments);


};
/**
 * funzione che torna l'accesso giuridico in base all'indice passato
 * @param index
 * @return {*}
 */
Ricovero.prototype.getAccessoGiuridico = function(index){

	if(index > this.contattiGiuridici.length -1){
		throw new Ricovero.errors["assistenziale.indiceInesistente"](arguments);
	}

	if(this.contattiGiuridici[index].constructor !== ContattoGiuridico){
		//verifico che l'index che mi è arrivato sia minore della lunghezza dei contatti assistenziali
		this.contattiGiuridici[index] = ContattoGiuridico.extend(this.contattiGiuridici[index], this);
	}
	return this.contattiGiuridici[index];
};
/**
 * funzione che torna il contatto assistenziale avendo l'ID
 * @param iden
 * @return {*}
 */
Ricovero.prototype.getAccessoGiuridicoFromId = function(iden){

	for (var i = 0; i < this.contattiGiuridici.length; i++)
	{
		if (this.contattiGiuridici[i].id ==iden)
		{
			return this.getAccessoGiuridico(i);
		}
	}

	throw new Ricovero.errors["assistenziale.accessononpresente"](arguments);


};

/**
 * funzione che torna l'ultimo accesso giuridico
 * @return {*}
 */
Ricovero.prototype.getLastAccessoGiuridico = function(){

	return this.getAccessoGiuridico(this.contattiGiuridici.length -1);
};
/**
 *
 * @return {boolean}
 */
Ricovero.prototype.isOrdinario = function(){
	return this.regime.codice === "1";
};
/**
 *
 * @return {boolean}
 */
Ricovero.prototype.isDayHospital = function(){
	return this.regime.codice === "2";
};
/**
 *
 * @returns {boolean}
 */
Ricovero.prototype.isPreRicovero = function(){
	return this.regime.codice === "3";
};
/**
 *
 * @return {boolean}
 */
Ricovero.prototype.isUrgente = function(){
	return this.tipo.codice === "2";
};
/**
 *
 * @return {boolean}
 */
Ricovero.prototype.isChirurgico = function(){
	return this.isDayHospital() && (this.tipo.codice === "S" || this.tipo.codice === "O");
};
/**
 *
 * @return {boolean}
 */
Ricovero.prototype.isProvenienzaPS = function(){
	return (typeof this.mapMetadatiString !== 'undefined' && this.mapMetadatiString.hasOwnProperty("DEA_ANNO"));
};
/**
 * un paziente per essere considerato pediatrico deve avere meno di 18 anni
 * @return {boolean}
 */
Ricovero.prototype.isPediatrico = function(){
	return moment(this.dataFine,"YYYYMMDDHH:mm").diff(moment(this.anagrafica.dataNascita,"YYYYMMDD"),'years') <= 18;
};
/**
 *
 * @return {boolean}
 */
Ricovero.prototype.isODS = function(){
	return this.isDayHospital() &&  this.tipo.codice === "O";
};
/**
 *
 * @return {boolean}
 */
Ricovero.prototype.isDS = function(){
	return this.isDayHospital() && this.tipo.codice === "S";
};

/**
 *
 * @return {STORICO_PAZIENTE.anagrafica|*|p.anagrafica|paramsPic.anagrafica|NS_CARTELLA_STORICA.anagrafica}
 */
Ricovero.prototype.getAnagrafica = function (){
	return this.anagrafica;
};

/**
 *
 * @return {boolean}
 */
Ricovero.prototype.isAdmitted = function(){
	return this.stato.codice === "ADMITTED";
};
/**
 *
 * @return {boolean}
 */
Ricovero.prototype.isDischarged = function(){
	return this.stato.codice === "DISCHARGED";
};
/**
 *
 * @return {boolean}
 */
Ricovero.prototype.isNullified = function(){
	return this.stato.codice === "NULLIFIED";
};
/**
 *
 * @param iden_per
 */
Ricovero.prototype.setUteDimissione=  function (iden_per){
	this.uteDimissione.id = iden_per;
};
/**
 * funzione che imposta il regime
 * @param codice
 * @param iden
 */
Ricovero.prototype.setRegime=  function (codice, iden){
	if(typeof codice == 'undefined'){
		codice = null;
	}
	if(typeof iden == 'undefined'){
		iden = null;
	}
	this.regime = {id : iden, codice : codice}
};
/***
 * funzione che setta il tipo
 * @param codice
 * @param iden
 */
Ricovero.prototype.setTipo =  function (codice, iden){
	if(typeof codice == 'undefined'){
		codice = null;
	}
	if(typeof iden == 'undefined'){
		iden = null;
	}

	this.tipo = {id : iden, codice : codice}
};

/**
 *
 * @param codice
 * @param iden
 */
Ricovero.prototype.setUrgenza =  function (codice, iden){
	if(typeof codice == 'undefined'){
		codice = null;
	}
	if(typeof iden == 'undefined'){
		iden = null;
	}

	this.urgenza = {id : iden, codice : codice}
};
/**
 *
 * @param codice
 * @param iden
 */
Ricovero.prototype.setMotivo =  function (codice, iden){
	if(typeof codice == 'undefined'){
		codice = null;
	}
	if(typeof iden == 'undefined'){
		iden = null;
	}

	this.motivo = {id : iden, codice : codice}
};
/***
 * Funzione che imposta il tipo dimissione e fa il controllo sulla data fine
 * @param codice
 * @param iden
 */
Ricovero.prototype.setTipoDimissione = function (codice, iden){
	if(!codice && !iden){
		throw new Ricovero.errors["parametro.errato"](arguments);
	}
	codice = codice || null;
	iden = iden || null;

	var tipo = {id : iden, codice : codice};
	Ricovero.controlloODSDataTipoDimissione(this, null, tipo);

	this.mapMetadatiCodifiche.ADT_DIMISSIONE_TIPO =  tipo;

};
/**
 *
 * @param ricovero
 * @param dataFine
 * @param tipo
 */
Ricovero.controlloODSDataTipoDimissione = function(ricovero, dataFine, tipo){
	//inizializzo le variabili
	dataFine = dataFine || ricovero.dataFine;
	tipo = tipo || ricovero.mapMetadatiCodifiche.ADT_DIMISSIONE_TIPO;
	//se una delle due è null non proseguo con il controllo
	if(!dataFine || !tipo){
		return;
	}
	var dataInizio = moment(ricovero.dataInizio,"YYYYMMDDHH:mm");
	//se è dimesso con tipo volontaria o deceduto
	if (ricovero.isDayHospital() && ricovero.isODS() && (ricovero.isDimissioneVolontaria() || ricovero.isDimissioneDecesso())) {

		//giorno di inzio di sè stesso o il successivo tollerato, tutto il resto no
		if (Number(dataFine.format('YYYYMMDD') > Number(dataInizio.add(2, 'day').format('YYYYMMDD')))) {
			throw new Ricovero.errors["datafine.giornoodiernoogiornosuccessivo"](arguments);
		}
	} else if(ricovero.isDayHospital() && ricovero.isODS()){

		//giorno successivo all'inzio di sè stesso
		if (dataFine.format("YYYYMMDD") != dataInizio.add(1, 'day').format("YYYYMMDD")) {

			throw new Ricovero.errors["datafine.giornosuccessivo"](arguments);

		}
	}

};


/**
 * viene sovrascritta la funzione toJSON in modo tale ogni volta che viene fatto lo strinfidy di un contatto viene ignorato il _parent
 * questo viene fatto cloando l'oggetto Ricovero e ritornando l'oggetto clonato.
 * @return {*}
 */

Ricovero.prototype.toJSON = function (){

	/**
	 cloneObject
	 secondo parametro è ignore (true se vuoi che venga ignorato, false se nn vuoi che sia ignorato)
	 */
	return cloneObject(this, function(key){
		return key === "_parent";
	});

};

var counter = 0;
/**
 * funzione che clona l'oggetto che gli viene passato ingorando quello che gli viene passato come ignorer
 * @param obj
 * @param ignorer
 * @return {*}
 */
function cloneObject(obj, ignorer) {
	//fatto per evitare loop infiniti
	if (counter >10){
		return;
	}
	//se gli passo un parametro che non va bene faccio il return
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	var temp = new obj.constructor(); // give temp the original obj's constructor

	for (var key in obj) {
		if(typeof ignorer === 'function' && !ignorer.call(obj, key)){
			temp[key] = cloneObject(obj[key],ignorer);
		}
	}

	return temp;
}

/**
 * costruisce una function che "estende" Error per sollevare eccezioni specifiche  obj : coppia codice/messagio dell'errore
 * @param {{code: String(), message: String()}}
 * @param {String} obj[code] : codice specifico dell'errore
 * @param {String} obj[message] : messaggio specifico dell'errore
 * @return {Function}
 */
function generateFunctionError(obj){
	var f =  function(){
		this.code = obj.code;
		this.message = obj.message;
		this.args = arguments;
	};

	f.prototype = new Error();
	f.prototype.constructor = f;
	return f;
}


/**
 *
 *   JSON degli errrori
 */
Ricovero.errors = {
	"regime.mancante" :generateFunctionError({code:"regime.mancante", message:"Regime non valorizzato"}),
	"datafine.diversaaccessodh" : generateFunctionError({code:"datafine.diversaaccessodh", message:"Data fine accesso diversa dalla data di inizio accesso"}),
	"datafine.giornoodiernoogiornosuccessivo" : generateFunctionError({code : "datafine.giornoodiernoogiornosuccessivo", message : "La data fine accesso puo' essere la data di inizio accesso o il giorno successivo"}),
	"datafine.giornosuccessivo" : generateFunctionError({code : "dataFine.giornosuccessivo", message : "La data fine accesso puo' essere solo il giorno successivo alla data di inizio"}),
	"datafine.successiva" : generateFunctionError({code : "datafine.successiva", message : "La data fine e' precedente alla data di inizio"}),
	"datafine.successivaultimoaccessogiuridico" : generateFunctionError({code: "datafine.successivaultimoaccessogiuridico", message : "La data fine e' precedente alla data inizio"}),
	//"datafine.contattoassistenzialenull" : {code: "datafine.contattoassistenzialenull", message : "Valorizzare data fine ultimo accesso assistenziale"},
	"datafine.contattoassistenzialenull" : generateFunctionError({code: "datafine.contattoassistenzialenull", message : "Valorizzare data fine ultimo accesso assistenziale"}),
	"datafine.contattoassistenzialediversa" : generateFunctionError({code: "datafine.contattoassistenzialediversa", message : "La data di chiusura dell'ultimo accesso assistenziale deve essere uguale alla data di dimissione"}),
	"assistenziale.indiceInesistente" : generateFunctionError({code:"assistenziale.indiceInesistente", message:"Indice del contatto assistenziale inesistente"}),
	"assistenziale.accessononpresente" : generateFunctionError({code:"assistenziale.accessononpresente", message:"E' stato cercato un contatto assistenziale con un indice non presente"}),
	"parametri.parametroNull" : generateFunctionError({code:"parametri.parametroNull", message:"Parametro null o undefined"}),
	"data.formaterror" :  generateFunctionError( {code:"data.formaterror", message:"Formato data errato"}),
	"parametro.errato" : generateFunctionError({code:"parametro.errato", message:"Parametri undefined"}),
	"data.dataprecedente" : generateFunctionError({code:"data.dataprecedente", message:"Impossibile impostare una data precedente alla data di inizio ricovero"}),
	"data.datasucessiva" : generateFunctionError({code:"data.datasucessiva", message:"Impossibile impostare una data inizio successiva alla data di fine"}),
	"data.dataprecedenteUltimoAccesso" : generateFunctionError({code:"data.dataprecedenteUltimoAccesso", message:"Impossibile impostare una data precedente alla data di fine dell'ultimo accesso"}),
	"data.dataInizioAssistenzialeAccDupl" : generateFunctionError({code:"data.dataInizioAssistenzialeAccDupl", message:"Attenzione!E' già presente un accesso in questa data"}),
	"data.annodiverso" :  generateFunctionError({code:"data.annodiverso", message:"Attenzione!Anno di apertura ricovero diversa dall'anno della data inserita. Gli accessi devono essere relativi allo stesso anno di apertura DH"}),
	"accessoAssistenziale.accessogiaaperto" : generateFunctionError({code:"accessoAssistenziale.accessogiaaperto", message:"Attenzione Risulta aperto ancora un accesso in DH per questo paziente"}),
	//riguardare @todo
	"data.datainizioprecedentedatainiziotrasferimento" : generateFunctionError({code:"data.datainizioprecedentedatainiziotrasferimento", message:"La data di inizio del trasferimento deve essere superiore alla data di inizio ricovero"}),


	"trasferimento.giarichiesto" : generateFunctionError({code:"trasferimento.giarichiesto", message:"Attenzione e' gia' stato richiesto un trasferimento per questo paziente"})


};


/**
 * regex per determinare il formato dell'ora
 * @param string
 * @return {boolean}
 */
Date.checkFormat = function(string){
	return /^(19|20)\d\d(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])(0[0-9]|1[0-9]|2[0-3]):[0-5]\d$/.test(string);
};


