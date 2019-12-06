var WindowHome = null;

jQuery(document).ready(function() {
	window.WindowHome = window;
	while ((window.WindowHome.name != 'Home' || window.WindowHome.name != 'schedaRicovero') && window.WindowHome.parent != window.WindowHome) {
		window.WindowHome = window.WindowHome.parent;
	}

	window.baseReparti 	= WindowHome.baseReparti;
	window.baseGlobal 	= WindowHome.baseGlobal;
	window.basePC 		= WindowHome.basePC;
	window.baseUser 	= WindowHome.baseUser;
	
	NS_GESTIONE_SOMMINISTRAZIONI.init();
	NS_GESTIONE_SOMMINISTRAZIONI.setEvents();
});

var NS_GESTIONE_SOMMINISTRAZIONI = {
	init: function() {
		//alert("INIZIALIZZA GESTIONE SOMMINISTRAZIONI");
		//alert("DATA: "+$('#DATA').val()+"\nTIPO MOVIMENTO: "+$('#TIPO_MOVIMENTO').val()+"\nUNITA: "+$('#UNITA').val()+"\nLOTTO: "+$('#LOTTO').val()+"\nMAGAZZINO: "+$('#MAGAZZINO').val()+"\nFARMACO: "+$('#FARMACO').val()+"\nUTENTE: "+$('#UTENTE').val());
		document.getElementById('txtData').value 			= $('#DATA').val();
		document.getElementById('txtTipoMovimento').value 	= $('#TIPO_MOVIMENTO').val();
		document.getElementById('txtUnita').value 			= $('#UNITA').val();
		document.getElementById('txtLotto').value 			= $('#LOTTO').val();
		document.getElementById('txtMagazzino').value 		= $('#MAGAZZINO').val();
		document.getElementById('txtFarmaco').value 		= $('#FARMACO').val();
		document.getElementById('txtUtente').value 			= $('#UTENTE').val();
	},

	setEvents: function() {
	}
};
