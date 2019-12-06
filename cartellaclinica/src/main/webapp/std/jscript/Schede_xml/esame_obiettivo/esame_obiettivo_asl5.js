var WindowCartella = null;

jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }

	try{
        WindowCartella.utilMostraBoxAttesa(false);
	}catch(e){
		//alert(e.description);
	}
	
	window.name = 'ESAME_OBIETTIVO';

	jQuery("#txtArti,#txtCondizioniGenerali,#txtCute,#txtDecubito,#txtEdemi,#txtEdemi,#txtLinfo,#txtPsiche,#txtAscoltazione").addClass("expand");
	jQuery("#txtAscoltazioneCuore,#txtCaratt,#txtFrequenza,#txtIspezioneCuore,#txtPercussioneCuore,#txtPercussione").addClass("expand");
	jQuery("#txtPolsiPeriferici,#txtPolso,#txtPressione,#txtAscoltazioneAdd,#txtIspezioneAdd,#txtAltro,#txtIspezione").addClass("expand");
	jQuery("#txtPercussioneAdd,#txtSistNerv").addClass("expand");
	jQuery("textarea[class*=expand]").TextAreaExpander(); 
	
});

