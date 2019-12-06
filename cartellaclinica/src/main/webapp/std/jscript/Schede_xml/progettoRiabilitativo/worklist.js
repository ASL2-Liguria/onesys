/**
 * File JavaScript in uso dalla worklist Progetto Riabilitativo Individuale.
 * 
 * @author	gianlucab
 * @version	1.0
 * @since	2015-12-28
 */

jQuery(document).ready(function() {
	window.WindowCartella = window;
	while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
		window.WindowCartella = window.WindowCartella.parent;
	}
	WK_PROGETTO_RIABILITATIVO.init();
});

var WK_PROGETTO_RIABILITATIVO = {};
(function() {
	var _this = this;
	
	this.init = function(){
		$('table#oTable tr').find('td div.classDatiTabella:first').css({'text-align':'right','padding-right':'5px'});
		
		try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
	};
		
	this.inserisci = function(){
		if (baseUser.TIPO != 'M') {
			return alert('Funzionalità riservata al personale medico.');
		}
		
		WindowCartella.apriScheda('SCHEDA_PROGETTO_RIABILITATIVO', 'Progetto Riabilitativo', {
			key_legame: 'SCHEDA_PROGETTO_RIABILITATIVO',
			not_unique: 'S'
		}, {
			RefreshFunction: WindowCartella.progettoRiabilitativo
		});
	};
		
	this.modifica = function() {
		if (baseUser.TIPO != 'M') {
			return alert('Funzionalità riservata al personale medico.');
		}
		
		var iden = stringa_codici(array_iden);
		if(iden == ''){
			return alert('Attenzione: nessuna scheda selezionata');
		}
		
	   	WindowCartella.apriScheda('SCHEDA_PROGETTO_RIABILITATIVO', 'Progetto Riabilitativo Individuale', {
	   		key_legame:  'SCHEDA_PROGETTO_RIABILITATIVO',
			not_unique:  'S',
	   		modifica:    'S',
	   		iden_scheda: iden
	   	}, {
	   		RefreshFunction: WindowCartella.progettoRiabilitativo
	   	});
	};
		
	this.visualizza = function(){
		var iden = stringa_codici(array_iden);
		if(iden == ''){
			return alert('Attenzione: nessuna scheda selezionata');
		}
		WindowCartella.apriScheda('SCHEDA_PROGETTO_RIABILITATIVO', 'Progetto Riabilitativo Individuale', {
			key_legame:  'SCHEDA_PROGETTO_RIABILITATIVO',
			not_unique:  'S',
			lettura:     'S',
			iden_scheda: iden
		}, {
			RefreshFunction: WindowCartella.progettoRiabilitativo
		});
	};
	
	this.duplica = function(){
		if (baseUser.TIPO != 'M') {
			return alert('Funzionalità riservata al personale medico.');
		}
		
		var iden = stringa_codici(array_iden);
		if(iden == ''){
			return alert('Attenzione: nessuna scheda selezionata');
		}
		
	   	WindowCartella.apriScheda('SCHEDA_PROGETTO_RIABILITATIVO', 'Progetto Riabilitativo Individuale', {
	   		key_legame:  'SCHEDA_PROGETTO_RIABILITATIVO',
			not_unique:  'S',
	   		modifica:    'N',
	   		iden_scheda: iden
	   	}, {
	   		RefreshFunction: WindowCartella.progettoRiabilitativo
	   	});
	};
	
	this.elimina = function(){
		if (baseUser.TIPO != 'M') {
			return alert('Funzionalità riservata al personale medico.');
		}
		
		var iden = stringa_codici(array_iden);
		if(iden == ''){
			return alert('Attenzione: nessuna scheda selezionata');
		}
		
		if (!confirm("Eliminare la scheda selezionata?")) return;
		
		var vResp = WindowCartella.executeStatement('schede.xml','eliminaScheda', ['SCHEDA_PROGETTO_RIABILITATIVO', WindowCartella.getRicovero("IDEN"), iden],1);
		if (vResp[0]=='KO'){
			return alert("Impossibile eliminare la scheda selezionata:\n\n" + vResp[1]);
		} else if (vResp[2]!='1'){
			return alert("Impossibile eliminare la scheda selezionata:\n\nNessun record aggiornato");
		}
		
		WindowCartella.progettoRiabilitativo();
	};
		
	this.stampa = function(idenScheda){
		try {
			var iden = typeof idenScheda !== 'undefined' ? idenScheda : stringa_codici(array_iden);
			if(iden == ''){
				return alert('Attenzione: nessuna scheda selezionata');
			}
			
			var vDati 		= WindowCartella.getForm();
			var iden_visita	= vDati.iden_ricovero;
			var funzione	= 'SCHEDA_PROGETTO_RIABILITATIVO';
			var reparto		= vDati.reparto;
			var anteprima	= 'S';
			var sf			= "&prompt<pVisita>="+iden_visita+"&prompt<pIdenScheda>=" + iden;

			WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,WindowCartella.basePC.PRINTERNAME_REF_CLIENT);		
		} catch(e) {
			window.alert(e.message);
		}
	};
}).apply(WK_PROGETTO_RIABILITATIVO);
