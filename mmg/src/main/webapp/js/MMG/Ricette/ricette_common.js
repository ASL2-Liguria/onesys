/*Metodi condivisi*/
var WORKLIST_RICETTE = {
	/*
	 * Where
	 */
	whereConferma: function (rec) {
		var passed = (rec.length > 0);
		for (var i = 0; i < rec.length; i++) {
			if (rec[i].CODICE_STATO != 'I' || rec[i].IDEN_MEDICO != home.baseUser.IDEN_PER) {
				passed = false;
			}
		}
		return passed;
	},
	whereStampa: function (rec) {
		var passed = typeof rec != "undefined" && rec.length > 0 ? true : false;
		for (var i = 0; i < rec.length; i++) {
			if (rec[i].DEMATERIALIZZATA == 'D') {
				passed = false;
			}
		}
		return passed;
	},
	whereCancella: function (data) {
		return typeof data[0] != "undefined" && data.length == 1
				&& (
					(data[0].UTE_INS == home.baseUser.IDEN_PER && data[0].DEMATERIALIZZATA != 'D')
					|| data[0].IDEN_MEDICO == home.baseUser.IDEN_PER
				);
	},
	whereInfo: function (data) {
		return typeof data[0] != "undefined" && data.length == 1;
	},
	whereModuloTC: function (data) {
		return typeof data[0] != "undefined" && data.length == 1 && data[0].TIPO_RICETTA == 'P';
	},
	whereModuloRM: function (data) {
		return typeof data[0] != "undefined" && data.length == 1 && data[0].TIPO_RICETTA == 'P';
	},
	whereModuloPRI: function (data) {
		return typeof data[0] != "undefined" && data.length == 1 && data[0].TIPO_RICETTA == 'P';
	},
    
	/*
	 * Processclass
	 */
    setStatoRicetta: function( data ){
    	
    	return $(document.createElement('div')).addClass( data['CODICE_STATO'] == 'I' ? 'red' : 'green' ).text( data['STATO'] );
    },
	
	splitNRE:function(nre) {
		if (typeof nre == "undefined" || nre == null)
			return "";
		return nre.substring(0,5) + " " + nre.substring(5);
	},
    
    setElencoRicette: function( data ) {
    	
    	var icon_info = $(document.createElement('i')).addClass('icon-info-circled worklist-icon');
    	var icon_trash = $(document.createElement('i')).addClass('icon-trash worklist-icon');
    	var icon_print = $(document.createElement('i')).addClass('icon-print worklist-icon');
    	    	
    	icon_trash.on('click', function(event){
			event.stopPropagation();
			NS_MENU_ELENCO_RICETTE.cancellaRicetta( data );
		});
    	icon_print.on('click', function(event){
			event.stopPropagation();
			WORKLIST_RICETTE.stampa( data );
		});
    	icon_info.on('click', function(event){
			event.stopPropagation();
			WORKLIST_RICETTE.showInfoRicetta( data );
		});
    	
		var div = $(document.createElement('div')).append(icon_info);
    	if(WORKLIST_RICETTE.whereCancella([data])){
	    	div.append( icon_trash );
    	}
		if(WORKLIST_RICETTE.whereStampa([data])) {
			div.append( icon_print );
		}
		return div;
    },
	
	/*
	 * Chiamate
	 */
	stampa: function (rec) {

		home.NS_LOADING.showLoading();

		if (typeof rec[0] == 'undefined') {
			var tmp = rec;
			rec = new Array();
			rec.push(tmp);
		}
		
		var vIdenRicetteB = new Array();
		var vIdenRicetteF = new Array();
		var vIdenRicetteP = new Array();
		var vIdenRicetteFD = new Array();
		var vIdenRicettePD = new Array();
		
		var almeno_una_dd = false;

		for (var i = 0; i < rec.length; i++) {

			var pTipo = rec[i]['TIPO_RICETTA'];

			switch (rec[i]['DEMATERIALIZZATA']) {
			case 'S':
				pTipo += 'D';
				break;
			case 'D':
				pTipo = "DD"; /*dematerializzata differita, non stampabile*/
				almeno_una_dd = true;
				break;
			case 'N':
			default:
			}

			switch (pTipo) {
			case 'B':
			case 'Q':
				vIdenRicetteB.push(rec[i]['IDEN']);
				break;
			case 'F':
				vIdenRicetteF.push(rec[i]['IDEN']);
				break;
			case 'P':
				vIdenRicetteP.push(rec[i]['IDEN']);
				break;
			case 'FD':
				vIdenRicetteFD.push(rec[i]['IDEN']);
				break;
			case 'PD':
				vIdenRicettePD.push(rec[i]['IDEN']);
				break;
			default:
				//nulla
			}
		}

		var obj = {};

		if (vIdenRicetteB.length > 0) {
			obj['B'] = vIdenRicetteB.toString();
		}

		if (vIdenRicetteF.length > 0) {
			obj['F'] = vIdenRicetteF.toString();
		}

		if (vIdenRicetteP.length > 0) {
			obj['P'] = vIdenRicetteP.toString();
		}

		if (vIdenRicetteFD.length > 0) {
			obj['FD'] = vIdenRicetteFD.toString();
		}

		if (vIdenRicettePD.length > 0) {
			obj['PD'] = vIdenRicettePD.toString();
		}

		/* Devo mandare un oggetto {B: "125,126", F: "123,124", P: "127,128"}*/
		home.RICETTA_UTILS.stampaRicette(JSON.stringify(obj));

		home.NS_LOADING.hideLoading();
		
		if (almeno_una_dd) {
			home.NOTIFICA.warning({
				title: "Attenzione",
				message: "Una o più ricette non stampate in quanto dematerializzate in attesa di conferma"
			});
		}
		WORKLIST_RICETTE.refreshWk();
	},
	
	showInfoRicetta: function(data) {
		console.log(data);
		if (data.length) {
			data = data[0];
		}
		home.NS_LOADING.showLoading();
		home.$.NS_DB.getTool({_logger: home.logger}).select({
			id: "RICETTE.GET_INFO_RICETTA",
			parameter: {
				iden : { v : data.IDEN , t : 'N'}
			}
		}).done( function( resp ){
			home.NS_LOADING.hideLoading();
			home.NOTIFICA.info({
				message: resp.result[0].MESSAGE,
				title: resp.result[0].TITLE,
				timeout: 30
			});
		});
	}
};

var NS_MENU_CONFERMA_RICETTE = {
	/*
	 * WORKLIST_RICETTE.refreshWk -> CONFERMA_RICETTE.loadWk
	 */
	conferma: function (rec, vStampa) {

		if (typeof vStampa == 'undefined') {
			vStampa = "N";
		}

		var vIdenRicette = new Array();

		home.NS_MMG.confirm(traduzione.conferma, function () {
			for (var i = 0; i < rec.length; i++) {
				vIdenRicette.push(rec[i]['IDEN']);
			}

			vIdenRicette = vIdenRicette.join(',');

			var vProcedure;
			var vParameter;
			if (vStampa == 'N') {
				vProcedure = 'RR_CONFERMA';
				vParameter = {
					"p_iden_ricetta": {v: vIdenRicette, t: 'V'},
					"v_stampato": {v: "N", t: 'V'},
					"p_result": {t: 'V', d: 'O'}
				};
			} else {
				vProcedure = 'RR_CONFERMA_STAMPA';
				vParameter = {
					"p_iden_ricetta": {v: vIdenRicette, t: 'V'},
					"p_result": {t: 'V', d: 'O'}
				};
			}

			home.$.NS_DB.getTool({_logger: home.logger}).call_procedure({
				id: vProcedure,
				parameter: vParameter
			}).done(function (response) {

				/* ho confermato e basta */
				if (vStampa == 'N') {

					var status = response.p_result.split('$')[0];
					var msg = response.p_result.split('$')[1];

					if (status == 'OK') {
						home.NOTIFICA.success({message: msg, title: 'Successo!'})
						WORKLIST_RICETTE.refreshWk();
					} else {
						home.NOTIFICA.error({message: msg, title: 'Errore!'});
					}

					/* ho confermato e stampato */
				} else {
					/* Devo mandare un oggetto {B: "125,126", F: "123,124", P: "127,128"}*/
					home.RICETTA_UTILS.stampaRicette(response.p_result);
					WORKLIST_RICETTE.refreshWk();
				}
			});
		});
	},
	confermaStampa: function (rec) {
		NS_MENU_CONFERMA_RICETTE.conferma(rec, 'S');
	}
};

var NS_MENU_ELENCO_RICETTE = {
	apriModulo: function (pModulo, row) {

		var urlAgg = "&PROVENIENZA=ELENCO_RICETTE";
		urlAgg += "&ACCERTAMENTO_RICETTA=" + row[0].ELENCO;
		urlAgg += "&PROBLEMA_RICETTA=" + row[0].IDEN;

		if (!home.CARTELLA.isActive()) {

			home.NS_OBJECT_MANAGER.init(row[0].IDEN_ANAG, function () {
				home.NS_MMG.apri(pModulo, urlAgg);
			});

		} else {
			home.NS_MMG.apri(pModulo, urlAgg);
		}
	},
	/*
	 * WORKLIST_RICETTE.refreshWk -> ELENCO_RICETTE.refreshWk
	 */
	cancellaRicetta: function (rec) {

		if (typeof rec[0] == 'undefined') {
			var tmp = rec;
			rec = new Array();
			rec.push(tmp);
		}

		if (!home.MMG_CHECK.canDelete(rec[0].UTE_INS, rec[0].IDEN_MEDICO)) {
			home.NOTIFICA.warning({
				title: "Cancellazione non possibile",
				message: "l'utente non ha autorizzazione a cancellare la riga corrente"
			});
			return;
		}

		var vIdenRicette = new Array();

		home.NS_MMG.confirm("Cancellare la ricetta/e selezionata?", function () {
			home.NS_LOADING.showLoading();

			for (var i = 0; i < rec.length; i++) {

				vIdenRicette.push(rec[i]['IDEN']);
			}

			var promise = home.$.NS_DB.getTool({_logger: home.logger}).call_procedure({
				id: 'RR_CANCELLA',
				parameter: {
					v_tipo: {v: "RICETTA", t: 'V'},
					v_ar_iden: {v: vIdenRicette, t: 'A'},
					c_errori: {t: 'C', d: 'O'},
					n_iden_ute: {v: home.baseUser.IDEN_PER, t: 'N'},
					v_username: {v: home.baseUser.USERNAME, t: 'V'},
					v_note: {v: '', t: 'V'}
				}
			});
			promise.done(function (response) {
				if (LIB.isValid(response['c_errori']) && response['c_errori'] != "") {
					home.NOTIFICA.error({
						message: "Impossibile annullare la ricetta: " + response['c_errori'],
						title: "Attenzione"
					});
				}
				WORKLIST_RICETTE.refreshWk();
				if ($("#KEY_LEGAME").val() == "MMG_ELENCO_RICETTE" && $("#PROVENIENZA").val() != 'CARTELLA_OUT') {

					var pTipo = rec[0].TIPO_RICETTA;

					if (pTipo == 'P' || pTipo == "Q") {
						home.RICETTA_ACCERTAMENTI.reload();
					} else {
						home.RICETTA_FARMACI.reload();
					}
				}
			});
			promise.fail(home.NS_LOADING.hideLoading);
		});
	}
};
