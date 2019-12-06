
/***********************************************************************************************
 * 	GESTORE DEGLI OGGETTI ASSISTITO E CARTELLA.
 * 	LEGGE DA DWR MMG LA QUERY INFO_CARTELLA E ISTANZIA GLI ATTRIBUTI DI ASSISTITO E CARTELLA
 ***********************************************************************************************/

var NS_OBJECT_MANAGER = {
	
	instanced:		new Array(),
	functions:		{ informazioni : 'MMG_DATI.INFO_CARTELLA' },
	datasource:		'MMG_DATI',	
	
	init: function( IDEN_ANAG, callBack ) {
		
		home.NS_OBJECT_MANAGER		= this;
		NS_OBJECT_MANAGER.IDEN_ANAG = IDEN_ANAG;
		
		NS_OBJECT_MANAGER.collectData( callBack );
	},
	
	collectData: function(callBack) {
		home.$.NS_DB.getTool({_logger : home.logger}).select({
			id: NS_OBJECT_MANAGER.functions.informazioni,
			datasource: NS_OBJECT_MANAGER.datasource,
			parameter: {
				'iden_anag': {v: NS_OBJECT_MANAGER.IDEN_ANAG, t: 'N'},
				'iden_per' : {v: home.baseUser.IDEN_PER, t: 'N'}
			}
		}).done( function(resp) {
			var response = resp.result;
			NS_OBJECT_MANAGER.callBack(response, callBack);
		});
	},
	
	callBack: function( response, callBack ) {
		
		var obj = response.length == 1 ? response[0] : null; 
		
		for( var key in obj ) {
			if( LIB.isValid( key )) {
				eval( key.toUpperCase() + ' = obj[ key ];' );
				NS_OBJECT_MANAGER.instanced.push( key.toUpperCase() );
			}
		}
		
		if( typeof callBack === 'function' ) {
			callBack();
		}
			
		ASSISTITO.init( NS_OBJECT_MANAGER.IDEN_ANAG, NS_MMG.checkPromemoriaBacheca );
	},
	
	clear: function( callBack ) {
		
		NS_OBJECT_MANAGER.IDEN_ANAG = null;

		for( var i = 0; i < NS_OBJECT_MANAGER.instanced.length; i++ )
			eval( NS_OBJECT_MANAGER.instanced[i] +' = null;' );
		
		if( typeof callBack === 'function' )
			callBack();
	}
	
};

var ASSISTITO = {
	
	functions:		{ informazioni : 'MMG_DATI.INFO_CARTELLA', esenzioni : 'MMG_DATI.ESENZIONI', esenzioniPrestazioni : 'MMG_DATI.ESENZIONI_PRESTAZIONI', esenzioniFarmaci : 'MMG_DATI.ESENZIONI_FARMACI' },
	datasource:		'MMG_DATI',
	
	init: function( IDEN_ANAG, callBack ) {			
		
		if ( IDEN_ANAG === null && ASSISTITO.IDEN_ANAG !== null )
			NS_MMG_UTILITY.trace('CHIUSURA_CARTELLA', this.IDEN_ANAG, '', '');
		
		if ( IDEN_ANAG !== null )
			NS_MMG_UTILITY.trace('APERTURA_CARTELLA', IDEN_ANAG, '', '');
		
		ASSISTITO.IDEN_ANAG 	= IDEN_ANAG; 
		//ASSISTITO.IDEN_MED_BASE	= baseUser.IDEN_PER;
		
		ASSISTITO.setEsenzioni();
		
		if( typeof callBack === 'function' )
			callBack();
		
	},
	
	refresh: function( IDEN_ANAG ) {
		ASSISTITO.init( IDEN_ANAG );
	},
	
	/*********************************************************************************
	 * SETTERS
	 *********************************************************************************/
	
	setEsenzioni: function() {
		home.$.NS_DB.getTool({_logger : home.logger}).select({
			id: ASSISTITO.functions.esenzioni, 
			datasource: ASSISTITO.datasource,
			parameter: {
				'iden_anag': {v: ASSISTITO.IDEN_ANAG, t: 'N'},
				'codice_esenzione': {v: null, t: 'V'}
			}
		}).done( function(resp) {
			var response = resp.result;
			ASSISTITO.ESENZIONI = response;
			MAIN_PAGE.setInfoEsenzioni();
		});
	},
	
	isAssistitoGruppo: function(iden_med_base) {
		if (typeof iden_med_base == "undefined") {
			iden_med_base = this.IDEN_MED_BASE;
		}
		return UTENTE.inMyGroup( iden_med_base );
	},
	
	isMioAssistito : function() {
		return this.getIdenMedBase() == baseUser.IDEN_PER ;
	},
	
	isMioAssistitoTemporaneo : function() {
		return false;
	},
	
	enumeraEsenzioni : function( testFunction ) {
		
		var esenzioni = new Array();
		
		if( LIB.isValid( ASSISTITO.ESENZIONI ) )
			for( var i = 0; i < ASSISTITO.ESENZIONI.length; i++ ) 
				testFunction( ASSISTITO.ESENZIONI[i] ) ? esenzioni.push( ASSISTITO.ESENZIONI[i] ) : null;
			
		return esenzioni;
	},
	
	getEsenzioni : function( tipologia, livello ) {
		/* Escludo esenzione EPF, che e' totale ma solo in congiunzione con esenzione per patologia, e la gestisco da procedura */
		return this.enumeraEsenzioni(function(e) { return (e.TIPOLOGIA != 'R') && (tipologia == null || e.TIPOLOGIA == tipologia) && (livello == null || e.LIVELLO == livello); });
	},
	
	/*********************************************************************************
	 * GETTERS
	 *********************************************************************************/
	
	getInstance: function() {
		return this;
	},
	
	getIdenAnag: function() {
		return this.IDEN_ANAG;
	},
	
	getIdenMedBase: function() {
		return this.IDEN_MED_BASE;
	},
	
	getEsenzione: function(codice_esenzione) {
		return this.enumeraEsenzioni(function(e) {
			return (codice_esenzione == e.CODICE_ESENZIONE || codice_esenzione == e.CODICE_ESENZIONE_FARMA);
		})[0];
	},
	
	checkEsenzioniFarmaci: function( codice_farmaco, callback ) {
		var esenzioniFarmaci = {};
		if( this.getNumeroEsenzioni() > 0 ) {
			home.$.NS_DB.getTool({_logger : home.logger}).select({
				id: this.functions.esenzioniFarmaci,
				datasource: ASSISTITO.datasource,
				parameter: {
					'cod_farmaco': {v: codice_farmaco, t: 'V'},
					'codici_esenzioni': {v: this.getEsenzioniAsString(), t: 'V'}
				}
			}).done( function(resp) {
				var response = resp.result;
				for (var i = 0; i < response.length; i++ ) {
					esenzioniFarmaci[response[i].CODICE_PRODOTTO] = ASSISTITO.getEsenzione(response[i].CODICE_ESENZIONE);
				}
				callback(esenzioniFarmaci);
			});
		}
	},
	
	checkEsenzioniPrestazioni: function( codice_prestazione, callback ) {
		var esenzioniPrestazioni = {};
		if( this.getNumeroEsenzioni() > 0 ) {
			home.$.NS_DB.getTool({_logger : home.logger}).select({
				id: this.functions.esenzioniPrestazioni,
				datasource: ASSISTITO.datasource,
				parameter: {
					'cod_prestazione': {v: codice_prestazione, t: 'V'},
					'codici_esenzioni': {v: this.getEsenzioniAsString(), t: 'V'}
				}
			}).done( function(resp) {
				var response = resp.result;
				for (var i = 0; i < response.length; i++ ) {
					esenzioniPrestazioni[response[i].COD_PRESTAZIONE] = ASSISTITO.getEsenzione(response[i].CODICE_ESENZIONE);
				}
				callback(esenzioniPrestazioni);
			});
		}
	},
	
	getEsenzioniAsString: function() {
		var esenzioniAsString = '';
		$.each(ASSISTITO.ESENZIONI, function(idx, val) { 
			esenzioniAsString += val['CODICE_ESENZIONE'] +',';
		});
		return esenzioniAsString.substring(0,esenzioniAsString.length-1);
	
	},
	
	getEsenzioniAsStringForInt: function() {
		var esenzioniAsStringForInt = '';
		$.each(ASSISTITO.ESENZIONI, function(idx, val) {
			if(val['FONTE_ESENZIONE'] != '' && val['FONTE_ESENZIONE'] != null){
				esenzioniAsStringForInt += val['CODICE_ESENZIONE'] +' (' + val['FONTE_ESENZIONE'] +') ,';
			}else{
				esenzioniAsStringForInt += val['CODICE_ESENZIONE'] +',';				
			}
		});
		return esenzioniAsStringForInt.substring(0,esenzioniAsStringForInt.length-1);
	
	},
		
	getNumeroEsenzioni: function() {
		return ASSISTITO.ESENZIONI.length;
	}

};

var CARTELLA =  {
		
	active: false,
	
	filtri : {
		diari : "ALL"
	},
	
	isActive: function() {
		return this.active;
	},
	
	isReadOnly: function() {
		return !( ASSISTITO.isMioAssistito() || ASSISTITO.isMioAssistitoTemporaneo() );
	},
	
	setRegime: function(pRegime) {
		if ( (ASSISTITO.REGIME=="UE")
			&&
			(pRegime == "SSN" || pRegime == "AC")
		) {
			pRegime = ASSISTITO.REGIME;
		}
		CARTELLA.REGIME = pRegime; 
	},
	
	getRegime: function() {
		var regime = CARTELLA.REGIME;
		if (regime == "AC") {
			regime = "SSN";
		}
		return regime;
	},
	
	getMedPrescr: function() {
		return baseUser.TIPO_UTENTE == 'M' ? baseUser.IDEN_PER : CARTELLA.IDEN_MED_PRESCR;
	}
};

var PERMESSI = {
		/* MMG_PERMESSI:
			(0) := 'CONSENSO_DATI';
			(1) := 'SOSTITUTO';	
			(2) := 'ASSOCIATI';
			(3) := 'COLLABORATORI';
			(4) := 'CONSENSO_PERSONALE_ASL';
			(5) := 'SPECIALISTA';
			(6) := 'CONSENSO_COMUNICAZIONE';
			(7) := 'CONSENSO_DATI_SENSIBILI';
			(8) := 'VISIONE_DATI_ASL';
		*/
		lista_consensi: [],
		
		init: function() {
			home.$.NS_DB.getTool({_logger : home.logger}).select({
				id:'PRIVACY.GET_LISTA_CONSENSI',
				datasource: NS_OBJECT_MANAGER.datasource,
				parameter: {
				}
			}).done( function(resp) {
				try {
					PERMESSI.lista_consensi = resp.result[0].PERMESSI_DEFAULT.split(",");
				} catch (e) {
					console.error(e);
				}
			});
		},
		
		getPermesso: function(indice) {
			return PERMESSI.lista_consensi[indice];
		},
		
		getPosition: function(permesso_descr) {
			return PERMESSI.lista_consensi.indexOf(permesso_descr);
		},
		
		getPermessiAbilitati: function (permessi_lettura) {
			if (typeof permessi_lettura == "undefined") {
				permessi_lettura = ASSISTITO.PERMESSI_LETTURA;
			}
			var out = [];
			for (var i=0; i < PERMESSI.lista_consensi.length; i++) {
				var power = Math.pow(2,i);
				if ((power & permessi_lettura) == power) {
					out.push(PERMESSI.getPermesso(i));
				}
			}
			return out;
		},
		
		getPermessiNegati:function(permessi_lettura){
			if (typeof permessi_lettura == "undefined") {
				permessi_lettura = ASSISTITO.PERMESSI_LETTURA;
			}
			return PERMESSI.getPermessiAbilitati(~permessi_lettura);
		},
		
		isAbilitato: function(permesso_descr, permessi_lettura) {
			if (typeof permessi_lettura == "undefined") {
				permessi_lettura = ASSISTITO.PERMESSI_LETTURA;
			}
			if (permessi_lettura == null) {
				return true;
			}
			var power = Math.pow(2,PERMESSI.getPosition(permesso_descr));
			return (power & permessi_lettura) == power;
		},
		
		consensoDati: function(permessi_lettura) {
			return PERMESSI.isAbilitato("CONSENSO_DATI", permessi_lettura);
		},
		
		consensoDatiSensibili: function(permessi_lettura) {
			return PERMESSI.isAbilitato("CONSENSO_DATI_SENSIBILI", permessi_lettura);
		},
		
		consensoSostituto: function(permessi_lettura) {
			return PERMESSI.isAbilitato("SOSTITUTO", permessi_lettura);
		},
		
		consensoAssociati: function(permessi_lettura) {
			return PERMESSI.isAbilitato("ASSOCIATI", permessi_lettura);
		},
		
		consensoCollaboratori: function(permessi_lettura) {
			return PERMESSI.isAbilitato("COLLABORATORI", permessi_lettura);
		},
		
		consensoPersonaleASL: function(permessi_lettura) {
			return PERMESSI.isAbilitato("CONSENSO_PERSONALE_ASL", permessi_lettura);
		},
		
		consensoSpecialista: function(permessi_lettura) {
			return PERMESSI.isAbilitato("SPECIALISTA", permessi_lettura);
		},
		
		consensoTerzi: function(permessi_lettura) {
			return PERMESSI.isAbilitato("CONSENSO_COMUNICAZIONE", permessi_lettura);
		},
		
		visioneDatiAsl: function(permessi_lettura) {
			return PERMESSI.isAbilitato("VISIONE_DATI_ASL", permessi_lettura);
		}
		
};

var UTENTE = {
		
		IDEN_MED_GRUPPO: [baseUser.IDEN_PER],
		
		PARAMETRI_IDEN_PER: {},
		PARAMETRI_USERNAME: {},
		
		init: function() {
			home.$.NS_DB.getTool({_logger : home.logger}).select({
				id:'MMG_DATI.INFO_UTENTE',
				datasource: NS_OBJECT_MANAGER.datasource,
				parameter: {
					iden_utente: baseUser.IDEN_PER
				}
			}).done( function(resp) {
				try {
					UTENTE.IDEN_MED_GRUPPO = resp.result[0].IDEN_MED_GRUPPO.split(",");
				} catch (e) {
					console.error(e);
					UTENTE.IDEN_MED_GRUPPO = [baseUser.IDEN_PER];
				}
				var utenti = resp.result[0].UTENTI;
				for (var i=0; i < utenti.length; i++) {
					var utente = utenti[i];
					if (typeof UTENTE.PARAMETRI_IDEN_PER[utente.IDEN_PER] == "undefined") {
						UTENTE.PARAMETRI_IDEN_PER[utente.IDEN_PER] = {};
					}
					if (typeof UTENTE.PARAMETRI_USERNAME[utente.IDEN_PER] == "undefined") {
						UTENTE.PARAMETRI_USERNAME[utente.USERNAME] = {};
					}
					for (var u=0; u < utente.PARAMETRI.length; u++) {
						var parametro = utente.PARAMETRI[u];
						UTENTE.PARAMETRI_IDEN_PER[utente.IDEN_PER][parametro.NOME]=parametro.VALORE;
						UTENTE.PARAMETRI_IDEN_PER[utente.IDEN_PER].USERNAME=utente.USERNAME;
						UTENTE.PARAMETRI_USERNAME[utente.USERNAME][parametro.NOME]=parametro.VALORE;
						UTENTE.PARAMETRI_USERNAME[utente.USERNAME].IDEN_PER=utente.IDEN_PER;
					}
				}
			});
		},
		
		getParametroIdenPer: function (iden_per, nome_parametro, def) {
			try {
				var parametro = UTENTE.PARAMETRI_IDEN_PER[iden_per][nome_parametro];
				if (LIB.isValid(parametro)) {
					return parametro;
				} else {
					return def;
				}
			} catch (e) {
				return def;
			}
		},
		
		getParametroUsername: function (username, nome_parametro, def) {
			try {
				var parametro = UTENTE.PARAMETRI_USERNAME[username][nome_parametro];
				if (LIB.isValid(parametro)) {
					return parametro;
				} else {
					return def;
				}
			} catch (e) {
				return def;
			}
		},
		
		inMyGroup: function( iden_per ) {
			return NS_MMG_UTILITY.checkPresenzaInArray( this.IDEN_MED_GRUPPO, iden_per );
		}
};

