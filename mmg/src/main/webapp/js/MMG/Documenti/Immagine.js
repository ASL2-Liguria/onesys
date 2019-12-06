$(function(){
	IMMAGINE.init();
});

var IMMAGINE = {
		
		init: function() {
			$("#lblTitolo").text("IMMAGINE: " + $("#DESCRIZIONE").val());
			$("#ifrload").attr("src","showDocumentoAllegato;jsessionid=" + home.$("#AppStampa param[name=session_id]").val() + "?IDEN=" + $("#IDEN").val());
		}
};