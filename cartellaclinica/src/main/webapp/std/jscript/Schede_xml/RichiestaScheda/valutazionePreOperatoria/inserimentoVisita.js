var _filtro_list_elenco = null;
var _filtro_list_scelti  = null;
var WindowCartella = null;

jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
	
	caricamento();

	switch (_STATO_PAGINA){
		
		// 	INSERIMENTO ////////////////////////////////
		case 'I':
			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			
			//ONBLUR  txtDataProposta
	//		jQuery("#txtDataProposta").blur(function(){ controllaDataProposta(); });
					
			nascondiCampi();
			
			caricaUbicazione();
        
		break;
		
		
		// 	MODIFICA ////////////////////////////////
		case 'E':
		
			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			
			//ONBLUR  txtDataProposta
			jQuery("#txtDataProposta").blur(function(){ controllaDataProposta(); });
		
			break;
		
		// LETTURA ////////////////////////////////
		case 'L':
			
			//ONLOAD  body
		break;
	}

});


//funzione richiamata all'onload della pagina
function caricamento(){
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
	
	switch (document.EXTERN.TIPOLOGIA_RICHIESTA.value){
	case '11':
		$("#groupInfo LEGEND").text('Visita anestesiologica');
		break;
	}
	
		
	//nascondo in lettura il tasto registra
	if (document.EXTERN.LETTURA.value=='S'){
		document.getElementById('lblRegistra').parentElement.style.display='none';
	}else{
		jQuery('#txtOpeRich').attr("readOnly",true);
	}
	
	document.getElementById('Hiden_anag').value = document.EXTERN.Hiden_anag.value;
	
	//maskedit sulla data proposta
	try {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtDataProposta);
	}catch(e){
		//alert(e.description);
	}

}

//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){

	HideLayerFieldset("divGroupOperatori");
	
}

function caricaUbicazione(){
	
		var vRs = WindowCartella.executeQuery("OE_Richiesta.xml","getUbicazione",[document.EXTERN.IDEN_ESAME.value,document.EXTERN.REPARTO.value]);	
		if (vRs.next()) {
			$("TEXTAREA[name='txtNote']").val(vRs.getString("DESCRIZIONE"));
		}
	
}

//funzione che 'prepara' i dati e valorizza i campi nascosti per il salvataggio. Alla fine lancia registra()
function preSalvataggio(){	
	var doc = document.dati;
	if (_STATO_PAGINA=='I'){
		doc.HelencoEsami.value = document.EXTERN.IDEN_ESAME.value;
		document.dati.Hiden_pro.value = document.EXTERN.Hiden_pro.value;
	}
	

    registra();	
}

