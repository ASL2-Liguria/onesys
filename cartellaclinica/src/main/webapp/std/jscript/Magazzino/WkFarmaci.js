var WK_FARMACI = {
	CaricoFarmaco : function() {
		WK_FARMACI.openFancyBox("servletGenerator?"
				+ "KEY_LEGAME=CARICO_FARMACI_MAG"
				+ "&KEY_ID="
				+ "&IDEN_FARMACO=" + stringa_codici(array_iden_farmaco)
				+ "&DESCR=" + stringa_codici(array_descr_farmaco)
				+ "&DISP=" + stringa_codici(array_disp_farmaco)
				+ "&TIPO=CARICO"
				+ "&WEBUSER=" + top.baseUser.LOGIN
				+ "&IDEN_MAGAZZINO=" + parent.$('#groupFarmaci').find('[name="cmbMagazzino"]').find('option:selected').val());
	},
	
	ScaricoFarmaco : function() {
		WK_FARMACI.openFancyBox("servletGenerator?"
				+ "KEY_LEGAME=SCARICO_FARMACI_MAG"
				+ "&IDEN_FARMACO=" + stringa_codici(array_iden_farmaco)
				+ "&DESCR=" + stringa_codici(array_descr_farmaco)
				+ "&DISP=" + stringa_codici(array_disp_farmaco)
				+ "&WEBUSER=" + top.baseUser.LOGIN
				+ "&KEY_ID="
				+ "&IDEN_MAGAZZINO=" + parent.$('#groupFarmaci').find('[name="cmbMagazzino"]').find('option:selected').val());
	},

	openFancyBox : function(url) {
		$.fancybox({
			'padding' : 3,
			'width' : 1024,
			'height' : 380,
			'href' : url,
			'type' : 'iframe',
			'onClosed' : function() {
				parent.caricaWkFarmaci();
			}
		});
	}
};
