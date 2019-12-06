/**
 * File JavaScript in uso dalla servlet stampe.multi.VerificaCompletezza.
 *
 * @author  gianlucab
 * @version 1.0
 * @since   2015-06-17
 */
WindowCartella = null;

$(document).ready(function(){
	window.WindowCartella = window;
	while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
		window.WindowCartella = window.WindowCartella.parent;
	}
	
	try {		
		var url = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_STAMPA_REFERTI&WHERE_WK="+encodeURIComponent(" where NUM_NOSOLOGICO='"+WindowCartella.CartellaPaziente.getRicovero("NUM_NOSOLOGICO")+"'")+"&ORDER_FIELD_CAMPO=";
		url += "&ILLUMINA=javascript:illumina_multiplo_generica(this.sectionRowIndex);";

		$("#divRichieste").prepend("<iframe id=\"idWkRichieste\" src=\"" + url + "\" width=\"100%\" height=\"250px\"></iframe>");
		
		$("#lblStampaCartella").bind("click", stampaGlobaleCartella);
		$("#lblStampaReferti").bind("click", stampaModuliReferti);
	} catch(e) {
		alert(e.message);
	}
	
	try {
		WindowCartella.utilMostraBoxAttesa(false);
	} catch(e) {}
});

$(window).load(function(){
	fillLabels(arrayLabelName,arrayLabelValue);
});

function stampaGlobaleCartella(conferma) {
	conferma = typeof conferma === 'boolean' ? conferma : true;
	try {
		WindowCartella.stampaGlobaleCartellaCore({'vResp': vResp, 'conferma': conferma});
	} catch(e) {
		alert(e.message);
	}
}

function stampaModuliReferti() {
	WindowCartella.utilMostraBoxAttesa(true);
	if (confirm('Iniziare Processo di Stampa?') == false) {
		WindowCartella.utilMostraBoxAttesa(false);
        return;
    }

	// Stampa moduli
	stampaGlobaleCartella(false);
	
	// Stampa referti
	document.getElementById('idWkRichieste').contentWindow.selezionaStampaRefertati();
}