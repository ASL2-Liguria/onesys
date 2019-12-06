jQuery(document).ready(function(){
	SCHEDA_PATOLOGIA_REPARTO.init();
	SCHEDA_PATOLOGIA_REPARTO.setEvents();	
});

var SCHEDA_PATOLOGIA_REPARTO = {
		init: function(){
		$("#txtCodice").val($("#COD_DEC").val());
		$("#txtCategoria").val($("#CATEGORIA").val());
		$("#hTipo").val("DIAGNOSI");
		if ($("#DESCR").val()!=""){
			$("#txtDescr").val($("#DESCR").val());
		}
	},
	
	setEvents: function(){
		
	},
	
	testDati: function(){
		if ($("#txtDescr").val() == "") {
			alert("Inserire la descrizione della patologia");
			return;
		}
		registra();	
	},
	
	chiudiScheda: function(){
		self.close(); //dialogbox
		parent.$.fancybox.close(); //fancybox
	},
	
	chiudiAggiornaWk: function(){
		SCHEDA_PATOLOGIA_REPARTO.chiudiScheda();
		if (parent.document.getElementById('oIFWk')){
			$('iframe#oIFWk',parent.document)[0].contentWindow.location.reload();
		}
	}
}