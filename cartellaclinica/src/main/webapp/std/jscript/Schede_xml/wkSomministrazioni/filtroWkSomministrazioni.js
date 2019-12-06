jQuery(document).ready(function() {
	FILTRO_WK_SOMMINISTRAZIONI.init();
	FILTRO_WK_SOMMINISTRAZIONI.setEvents();
});

/* FILTRO_WK_SOMMINISTRAZIONI */
var FILTRO_WK_SOMMINISTRAZIONI = {
	url : "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_VIEW_CC_SOMMINISTRAZIONI&ILLUMINA=illumina(this.sectionRowIndex);",

	init : function() {
		//alert("INIZIALIZZA FILTRO");
		$('form[name="EXTERN"]').append($('<input type="hidden" name = "WHERE_WK_EXTRA"/>'));
		$('#txtGiorno').val(clsDate.getData(new Date(),'DD/MM/YYYY'));
		FILTRO_WK_SOMMINISTRAZIONI.applica_filtro_somministrazioni(FILTRO_WK_SOMMINISTRAZIONI.url);
	},

	setEvents : function() {
		//alert("SET EVENTS FILTRO");
		$('#lblAggiorna').click(function() {
			//alert("AGGIORNA FILTRO");
			FILTRO_WK_SOMMINISTRAZIONI.applica_filtro_somministrazioni();
		});

		$("input[name^='txt']").keyup(function() {
			//alert("KEYCODE FILTRO");
			this.value = this.value.toUpperCase();
			if (window.event.keyCode == 13) {
				FILTRO_WK_SOMMINISTRAZIONI.applica_filtro_somministrazioni();
				return;
			}
		});
	},

	applica_filtro_somministrazioni : function(url) {
		//alert("APPLICA FILTRO");
		if (typeof url == 'undefined') applica_filtro();
		else applica_filtro(url);
	}

};