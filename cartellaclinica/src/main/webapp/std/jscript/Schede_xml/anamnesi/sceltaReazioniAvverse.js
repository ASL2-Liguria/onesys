



























































































function apriSceltaFarmaci(){
	var reparto;
	try{
		reparto=parent.document.EXTERN.REPARTO.value;	

	}
	catch(e){









		reparto=WindowCartella.getForm().reparto;
	}	
	





	var url="servletGeneric?class=cartellaclinica.gestioneTerapia.plgTerapia&modality=F&layout=V&reparto="+reparto;
	url+= "&statoTerapia=R";
	


	var frameFarmaci = $('iframe#frameFarmaci');
	if (frameFarmaci.is(":visible")) {
		frameFarmaci.hide(500,adjustHeight);
	} else {
		frameFarmaci.height('250px').attr("src",url).show(500,adjustHeight);
	} 
	function adjustHeight() {
		$("iframe#scheda",parent.document).height($('form[name=dati]').height()+5);
	}
}

function chiudiReazioneAvv(){
	WindowCartella.CartellaPaziente.refresh.avvertenze.paziente();
	parent.aggiornaOpener();


}

function registraScheda(){	
	registra();
}

function callbackregistrazione(){
    var idenAllerta= '';
    var rs = WindowCartella.executeStatement('anamnesi.xml','getIdenAllertaInserita',[baseUser.IDEN_PER,document.EXTERN.IDEN_VISITA.value],1);
    if(rs[0]=='KO'){
        return alert(rs[0] + '\n' + rs[1]);
    }else{
        idenAllerta  = rs[2];
    }

    switch(parent.parent.name) {
        case 'ANAMNESI': case '36_SETTIMANA':
            var iden_anag = WindowCartella.getPaziente("IDEN");
            var iden_visita = WindowCartella.getAccesso("IDEN");
            if (parent.parent.NS_ANAMNESI.importaAllergieIdenPaziente === Number(iden_anag)) {
                rs = WindowCartella.executeStatement('anamnesi.xml','duplicaAllerte',[idenAllerta, baseUser.IDEN_PER, iden_visita, iden_anag],0);
                if(rs[0]=='KO'){
                    return alert(rs[0] + '\n' + rs[1]);
                }
			    parent.parent.NS_ANAMNESI.importaAllergieIdenPaziente = null;
			}
            // break;
        case 'QUESTIONARIO_ANAMNESTICO':
            var hidden = parent.parent.$('#hArrayAllergie');
            hidden.val(hidden.val() +  (hidden.val() != '' ? ',' : '' ) + idenAllerta);
            break;
        default:
    }
}

jQuery(document).ready(function(){
	
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
	
	jQuery('#txtNota').addClass("expand");
	jQuery("textarea[class*=expand]").TextAreaExpander();
	
	jQuery('#frameFarmaci').hide();
	try{
		parent.document.getElementById('scheda').height=$(document).height()+5;
	} catch(e){






	}


	

	if (_STATO_PAGINA == 'L'){
		  $("td[class=classTdLabelLink]").attr('disabled', 'disabled'); 
	}
});