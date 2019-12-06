var WindowHome = null;

jQuery(document).ready(function() {

	window.WindowHome = window;
	while ((window.WindowHome.name != 'Home' || window.WindowHome.name != 'schedaRicovero') && window.WindowHome.parent != window.WindowHome) {
		window.WindowHome = window.WindowHome.parent;
	}

	if(typeof(array_provenienza)!='undefined'){
		for (var i in array_provenienza) {
			if(array_provenienza[i]!=array_reparto_attuale[i] && array_reparto_appoggio[i]==''){
				if (array_reparto_attuale[i]!='PAZIENTE DIMESSO IN DATA ODIERNA'){
					$('table#oTable tr:eq('+i+')').addClass('orange');    				
				}    			
			}
		}
	}

});


function apriCartella(num_min, obj) {
	var riga = setRiga(obj);
	var iden_versione = array_iden_versione[riga];
	var iden_testata = array_iden_testata[riga];
	var iden_visita = array_iden_visita[riga];
	var modalita;

	if(baseUser.TIPO!='AS'){
		if(array_tipologia[riga]=='14'){
			modalita="PRESA_IN_CARICO";
		}
		else{
			modalita="CONSULENZA";
		}
	}
	else{
		modalita="CONSULENZA_ASSISTENTE_SOCIALE";
	}

	top.NS_CARTELLA_PAZIENTE.apri({
		iden_evento         : array_iden_visita[riga],
		funzione            : "apriVuota();",
		ModalitaAccesso    : modalita
	});
}

function setRiga(obj) {
	while (obj.nodeName != 'TR') {
		obj = obj.parentNode;
	}

	return obj.sectionRowIndex;
}

function stampaListaTrattamentiAttivi(){
	var funzione 	= '';
	var sf		 	= '';
	var reparto		= '';
	if (array_iden_visita.length<1)
	{
		alert('Attenzione, non ci sono pazienti nella worklist');
		return;
	}
	else
	{
		funzione 	= 'WK_RICOVERATI_TRATTAMENTI';
		sf= "{VIEW_CC_TRATTAMENTI_ATTIVI.IDEN_TESTATA}  in [" + array_iden_testata + "]";
		top.confStampaReparto(funzione,sf,'S',reparto,null);
	}     
}


function chiudiTrattamento(){
	var iden  = stringa_codici(array_iden_versione);

	if(iden == ''){
		return alert('Attenzione:effettuare una selezione');
	}
	if(confirm('Chiudere il trattamento?')){

		var resp= WindowHome.executeStatement("wkTrattamenti.xml","chiudi",[iden,baseUser.IDEN_PER]);
		if (resp[0]=="KO"){
			alert(resp[1]);
		}
		else{
			document.location.reload();
		}

	}


}