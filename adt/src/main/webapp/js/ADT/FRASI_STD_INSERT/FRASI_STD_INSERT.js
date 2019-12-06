$(function() {
	NS_FRASI.init();
});

var NS_FRASI = {
		init : function(){

            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_FRASI_STANDARD"});

			NS_FENIX_SCHEDA.customizeParam = function(params){ params.extern=true; return params; };
			if ($("#_STATO_PAGINA").val()=='I'){
				$("#txtGruppo").val(home.FRASI_STD_REFERTAZIONE.$("#txtGruppo").val());
			}
			NS_FENIX_SCHEDA.afterSave = function() {
				var vGruppo = $("#txtGruppo").val();
				var vCodice = $("#txtCodice").val();
				home.FRASI_STD_REFERTAZIONE.$("#txtGruppo").val(vGruppo);
				home.FRASI_STD_REFERTAZIONE.$("#txtCodDescr").val(vCodice);
				home.FRASI_STD_REFERTAZIONE.$("#radCodDescr").data("RadioBox").selectByValue('COD');
				home.FRASI_STD_REFERTAZIONE.FRASI_STD.aggiorna();
				NS_FENIX_SCHEDA.chiudi({});
			};
		}
};