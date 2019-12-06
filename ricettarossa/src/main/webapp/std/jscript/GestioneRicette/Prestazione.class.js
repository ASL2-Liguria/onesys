/**
 * Classe JavaScript che istanzia una prestazione con tanto di nota di appropriatezza e di allegato della patologia.
 *
 * @since   2016-02-22
 * @version 1.0
 */
function Prestazione() {
	/* private attributes */
	
	var _codiceCUR             = null;
	var _codiceDM              = null;
	var _tipoCiclicita         = null;
	var _limiteSedute          = null;
	var _note                  = null;
	var _indiceNotaPredefinita = null;
	var _allegatoNota          = null;
	
	var _this                  = this;
	var _constructor = {
		
		"string,string": function(codiceCUR, codiceDM) {
			_codiceCUR = codiceCUR;             // radsql.view_rr_prestazioni.CODICE_REGIONALE
			_codiceDM  = codiceDM;              // radsql.view_rr_prestazioni.DM_CODICE
			_tipoCiclicita = '0';               // radsql.view_rr_prestazioni.CICLICHE
			_limiteSedute = 0;                  // radsql.view_rr_prestazioni.NUM_SEDUTE
			_note = {
				ID:                new Array(), // radsql.view_rr_prestazioni_note.ID_OPT
				tipo:              new Array(), // radsql.view_rr_prestazioni_note.TIPO_NOTA
				codice:            new Array(), // radsql.view_rr_prestazioni_note.CODICE_NOTA
				descrizione:       new Array(), // radsql.view_rr_prestazioni_note.DESCRIZIONE_NOTA
				allegatoGenetica : new Array()  // radsql.view_rr_prestazioni_note.GENETICA
			};
			_indiceNotaPredefinita = -1;        // selezione effettuata dall'utente (se le note sono presenti)
			_allegatoNota = "";                 // mmg.view_rr_genetica_patologie.CODICE
		},
		
		"string": function(codice) {
			var match = codice.split("@");
			this["string,string"].apply(this, [match[0], match[1]]);
		}
	};
	
	/* private methods */
	
	function makeString(obj) {
		switch(Object.prototype.toString.call(obj)) {
			case "[object String]":
				return '"' + obj.replace(_this.escapeRegExp, function(match) { 
					return _this.escapeChars[match]; 
				}) + '"';
			case "[object Array]" :
				if (obj.length == 0) {
					return "";
				}
				if (obj.length == 1) {
					return makeString(obj[0]);
				}
				return makeString(obj[0]) + ',' + makeString(obj.slice(1));
			default:
				return null;
		}
	}
	
	/* public attributes */
	
	this.escapeRegExp = /[\b\t\n\f\r\"\\]/g;
	
	this.escapeChars = {
		"\b": "\\b",  // backspace
		"\t": "\\t",  // horizontal tab
		"\n": "\\n",  // line feed
		"\f": "\\f",  // form feed
		"\r": "\\r",  // carriage return
		"\"": "\\\"", // double quote
		"\\": "\\\\"  // backslash
	};
	
	/* privileged methods */

	this.setCodiceCUR = function(codiceCUR) {
		_codiceCUR = codiceCUR;
	};
	
	this.getCodiceCUR = function() {
		return _codiceCUR;
	};
	
	this.setCodiceDM = function(codiceDM) {
		_codiceDM = codiceDM;
	};
	
	this.getCodiceDM = function() {
		return _codiceDM;
	};
	
	this.setTipoCiclicita = function(tipoCiclicita) {
		_tipoCiclicita = tipoCiclicita;
	};
	
	this.getTipoCiclicita = function() {
		return _tipoCiclicita;
	};
	
	this.isCiclica = function() {
		return _tipoCiclicita != '0';
	};
	
	this.setLimiteSedute = function(limiteSedute) {
		_limiteSedute = limiteSedute;
	};
	
	this.getLimiteSedute = function() {
		return _limiteSedute;
	};
	
	this.setNote = function(note) {
		if (note.ID.length === note.tipo.length && note.ID.length === note.codice.length && note.ID.length === note.descrizione.length && note.ID.length === note.allegatoGenetica.length) {
			_note = note;
		} else {
			throw new RangeError("Gli array non coincidono nelle dimensioni");
		}
	};
	
	this.getNote = function() {
		return _note;
	};
	
	this.setIndiceNotaPredefinita = function(indiceNotaPredefinita) {
		if (indiceNotaPredefinita === -1 || typeof _note.ID[indiceNotaPredefinita] !== 'undefined') {
			_indiceNotaPredefinita = indiceNotaPredefinita;
		} else {
			throw new RangeError("Indice di selezione nota prestazione non valido");
		}
	};
	
	this.getIndiceNotaPredefinita = function() {
		return _indiceNotaPredefinita;
	};
	
	this.setAllegatoNota = function(allegatoNota) {
		_allegatoNota = allegatoNota;
	};
	
	this.getAllegatoNota = function() {
		return _allegatoNota;
	};
	
	this.addNota = function(ID, tipo, codice, descrizione, allegatoGenetica) {
		_note.ID.push(ID);
		_note.tipo.push(tipo);
		_note.codice.push(codice);
		_note.descrizione.push(descrizione);
		_note.allegatoGenetica.push(allegatoGenetica);
	};
	
	this.getListaIDNote = function() {
		return _note.ID;
	};
	
	this.getListaTipiNote = function() {
		return _note.tipo;
	};
	
	this.getListaCodiciNote = function() {
		return _note.codice;
	};
	
	this.getListaDescrizioniNote = function() {
		return _note.descrizione;
	};
	
	this.getListaAllegatiGeneticaNote = function() {
		return _note.allegatoGenetica;
	};
	
	this.toString = function() {
		return '{'
			+ '"codiceCUR":' + makeString(_codiceCUR)
			+ ',"codiceDM":' + makeString(_codiceDM)
			+ ',"tipoCiclicita":' + makeString(_tipoCiclicita)
			+ ',"limiteSedute":' + _limiteSedute
			+ ',"note":{'
			    + '"ID":[' + makeString(_note.ID) + ']'
			    + ',"tipo":[' + makeString(_note.tipo) + ']'
			    + ',"codice":[' + makeString(_note.codice) + ']'
			    + ',"descrizione":[' + makeString(_note.descrizione) + ']'
				+ ',"allegatoGenetica":[' + makeString(_note.allegatoGenetica) + ']'
			+ '}'
			+ ',"indiceNotaPredefinita":' + _indiceNotaPredefinita
			+ ',"allegatoNota":' + makeString(_allegatoNota)
		+ '}';
	};
	
	this.equals = function(o) {
		return _codiceCUR === o.getCodiceCUR() && _codiceDM === o.getCodiceDM();
	};
	
	/* overloaded constructor */
	var _arr_constructor = [];
	for (var i=0,length=arguments.length; i < length; i++) {
		_arr_constructor.push(typeof arguments[i]);
	}
	var _id = _arr_constructor.join(",");
	if (typeof _constructor[_id] === 'function') {
		_constructor[_id].apply(_constructor, arguments);
	} else {
		throw new TypeError("_constructor[\"" + _id + "\"] is undefined");
	}
}