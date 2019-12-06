 
/*
 *	Al caricamento della pagina vengono caricate tutte le funzioni jQuery
 */
jQuery(document).ready(function() {	
	
	/*
	 *	Default
	 */
	jQuery('input[name="statoMod"]').val("I");
	jQuery('input[name="statoMod"]').parent().addClass("butActive");

	
	/*	
	 *	Al click su uno dei pulsanti di scelta del tipo di modifica,
	 *	rimuove la classe "butActive" da tutti i pulsanti e
	 *	aggiunge la classe "butActive" al pulsante cliccato
	 */
	jQuery('.butStato').click(function(){
		jQuery('.butStato').removeClass("butActive");
		jQuery(this).addClass("butActive");
		
		/*
		 *	Modifica il valore del campo hidden statoMod con l'ultimo carattere dell'id del pulsante cliccato
		 */
		jQuery('input[name="statoMod"]').val(jQuery(this).children('label').attr('id').replace("lblStato", ""));
		applica_filtro();
	});
});

var user_is_admin = false;

function inizializza_filtri() {
	var filtro_reparti=document.forms['dati'].hRepartiElenco;
	for (w=0; w<baseUser.LISTAREPARTI.length-1; w++) {
		filtro_reparti.value+="'" + baseUser.LISTAREPARTI[w] + "',";
	}
	filtro_reparti.value+="'" + baseUser.LISTAREPARTI[w] + "'";
	document.getElementById('lblRepartiElenco').innerText=filtro_reparti.value.replace(/'/g,"");
}