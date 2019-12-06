var WindowHome = null;

jQuery(document).ready(function () {
    window.WindowHome = window;
    while ((window.WindowHome.name != 'Home' || window.WindowHome.name != 'schedaRicovero') && window.WindowHome.parent != window.WindowHome) {
        window.WindowHome = window.WindowHome.parent;
    }

    window.baseReparti 	= WindowHome.baseReparti;
    window.baseGlobal 	= WindowHome.baseGlobal;
    window.basePC 		= WindowHome.basePC;
    window.baseUser 	= WindowHome.baseUser;
});

/* WK_SOMMINISTRAZIONI */
var WK_SOMMINISTRAZIONI = {

	ControlloMovimento : function() {
		/* Controllo se esiste un movimento associato:
		 * - se esiste, carico la pagina con i dati solo in lettura
		 * - altrimenti carico tutti i dati che mi servono per poter registrare il movimento di scarico del farmaco
		 */
		var iden_movimento = stringa_codici(array_iden_movimento);
		var iden_dettaglio = stringa_codici(array_iden_dettaglio);
		
		//return alert(iden_movimento);
		if (iden_movimento == null || iden_movimento == '' || iden_movimento < 0) 	WK_SOMMINISTRAZIONI.AssociaMovimento(iden_dettaglio);
		else 																		WK_SOMMINISTRAZIONI.VisualizzaMovimento(iden_movimento);
	},
	
	VisualizzaMovimento : function(idenMovimento) {
		var dettagli_movimento = WindowHome.executeStatement("Magazzino.xml", "DETTAGLI_MOVIMENTO", [idenMovimento], 8);
		if (dettagli_movimento[0] == 'KO') return alert(dettagli_movimento[1]);
		//else return alert("DATA & ORA: "+dettagli_movimento[2]+"\nTIPO MOVIMENTO: "+dettagli_movimento[3]+"\nUNITA: "+dettagli_movimento[4]+"\nLOTTO: "+dettagli_movimento[5]+"\nUTENTE: "+dettagli_movimento[6]+"\nMAGAZZINO: "+dettagli_movimento[7]+" "+dettagli_movimento[8]+"\nFARMACO: "+dettagli_movimento[9]);
		
		WK_SOMMINISTRAZIONI.openFancyBox("servletGenerator?"
				+ "KEY_LEGAME=MOVIMENTO_FARMACI_MAG"
				+ "&DATA=" 				+ dettagli_movimento[2]
				+ "&TIPO_MOVIMENTO=" 	+ dettagli_movimento[3]
				+ "&UNITA=" 			+ dettagli_movimento[4]
				+ "&LOTTO=" 			+ dettagli_movimento[5]
				+ "&UTENTE=" 			+ dettagli_movimento[6]
				+ "&MAGAZZINO="	 		+ dettagli_movimento[8] + " - " + dettagli_movimento[7]
				+ "&FARMACO=" 			+ dettagli_movimento[9]);
	},
	
	AssociaMovimento : function(idenDettaglio) {
		var dettagli_somministrazione = WindowHome.executeStatement("Magazzino.xml", "DETTAGLI_SOMMINISTRAZIONE", [idenDettaglio], 5);
		if (dettagli_somministrazione[0] == 'KO') return alert(dettagli_somministrazione[1]);
		//else return alert("REPARTO: "+dettagli_somministrazione[2]+"\nFARMACO: "+dettagli_somministrazione[3]+"\nDATA: "+dettagli_somministrazione[4]+"\nORA: "+dettagli_somministrazione[5]+"\nMEDICO PRESCRIVENTE: "+dettagli_somministrazione[6]+"\nUTENTE ESECUTIVO: "+dettagli_somministrazione[7]+"\nPAZIENTE: "+dettagli_somministrazione[8]+"\nIDEN MOVIMENTO: "+dettagli_somministrazione[9]);
		
                if (dettagli_somministrazione[4]=='0') {
			alert('Attenzione, nessun magazzino associato');
			return;
		}
		var iden_farmaco = dettagli_somministrazione[2];
		var iden_magazzino = dettagli_somministrazione[4];
		
		var getDisponibilita = WindowHome.executeStatement("Magazzino.xml", "GET_DISPONIBILITA", [iden_farmaco, iden_magazzino], 1);
		if (getDisponibilita[0] == 'KO') return alert(getDisponibilita[1]);
		
		WK_SOMMINISTRAZIONI.openFancyBox("servletGenerator?"
				+ "KEY_LEGAME=SCARICO_FARMACI_MAG"
				+ "&IDEN_FARMACO=" + dettagli_somministrazione[2]
				+ "&DESCR=" + dettagli_somministrazione[3]
				+ "&DISP=" + getDisponibilita[2]
				+ "&WEBUSER=" + top.baseUser.LOGIN
				+ "&KEY_ID="
				+ "&IDEN_MAGAZZINO=" + dettagli_somministrazione[4]
				+ "&IDEN_DETTAGLIO=" + idenDettaglio);
	},

	openFancyBox : function(url) {
		$.fancybox({
			'padding' 	: 3,
			'width' 	: 1024,
			'height' 	: 380,
			'href' 		: url,
			'type' 		: 'iframe',
			'onClosed' : function() {
				window.location.reload();
				parent.FILTRO_WK_SOMMINISTRAZIONI;
			}
		});
	}
	
};
