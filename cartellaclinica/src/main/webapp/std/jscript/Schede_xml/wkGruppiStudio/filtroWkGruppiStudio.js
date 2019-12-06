jQuery(document).ready(function() {
	FILTRO_WK_GRUPPI_STUDIO.init();
	FILTRO_WK_GRUPPI_STUDIO.setEvents();
});

/* FILTRO_WK_GRUPPI_STUDIO */
var FILTRO_WK_GRUPPI_STUDIO = {
	url : "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_VIEW_CC_GRUPPI_STUDIO&ILLUMINA=illumina(this.sectionRowIndex);",

	init : function() {
		// $('#cmbGruppiStudio:selected').val('');
		// $('#hTabPerTipo').val("'" + baseUser.TIPO + "'");
		$('form[name="EXTERN"]').append($('<input type="hidden" name = "WHERE_WK_EXTRA"/>'));
		$('#txtDataRiferimento').val(clsDate.getData(new Date(),'DD/MM/YYYY'));
		
		FILTRO_WK_GRUPPI_STUDIO.applica_filtro_gruppi_studio(FILTRO_WK_GRUPPI_STUDIO.url);

	},

	setEvents : function() {
		$('#lblAggiorna').click(function() {
			FILTRO_WK_GRUPPI_STUDIO.applica_filtro_gruppi_studio();
		});

		$("input[name^='txt']").keyup(function() {
			this.value = this.value.toUpperCase();
			if (window.event.keyCode == 13) {
				FILTRO_WK_GRUPPI_STUDIO.applica_filtro_gruppi_studio();
				return;
			}
		});
	},

	applica_filtro_gruppi_studio : function(url) {
		// setVeloNero('oIFWk');
		
		var data_riferimento = $('#txtDataRiferimento').val();
		
		$('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val(
				"trunc(validita_inizio) <= to_date('" + data_riferimento + "','dd/MM/yyyy') and (validita_fine is null or trunc(validita_fine) > to_date('" + data_riferimento + "','dd/MM/yyyy'))"
		);
		
		if (typeof url == 'undefined')
			applica_filtro();
		else
			applica_filtro(url);
	}

};