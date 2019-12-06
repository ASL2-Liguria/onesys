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
		//	jQuery("#txtDataProposta").blur(function(){ controllaDataProposta(); });
					
			nascondiCampi();
			$("#lblCodiceICD").parent().parent().hide();
			caricaUbicazione();
        
		break;
		
		
		// 	MODIFICA ////////////////////////////////
		case 'E':
		
			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			
			//ONBLUR  txtDataProposta
	//		jQuery("#txtDataProposta").blur(function(){ controllaDataProposta(); });
                        nascondiCampi();
                        $("#lblCodiceICD").parent().parent().hide();
                        
			break;
		
		// LETTURA ////////////////////////////////
		case 'L':
			document.getElementById('lblRegistra').parentElement.style.display='none';
			nascondiCampi();
			//ONLOAD  body
		break;
	}


	$('SELECT[name="cmbAppunt"]').change(function() {
		caricaUbicazione();
	});
});

function chiudi(){
	parent.$.fancybox.close();
}

function chiudiScheda(){
	top.apriWorkListRichieste();
}


//funzione richiamata all'onload della pagina
function caricamento(){
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
	
	$("#groupInfo LEGEND").text('Visita');

	
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
	$("#groupOperatori").hide();
	
}

function caricaUbicazione(){

	var vRs = WindowCartella.executeQuery("OE_Richiesta.xml","getUbicazione",[$('SELECT[name="cmbAppunt"]').val(),document.EXTERN.reparto.value]);	
	if (vRs.next()) {
		$("TEXTAREA[name='txtNote']").val(vRs.getString("DESCRIZIONE"));
	}
	else{
		$("TEXTAREA[name='txtNote']").val('');
	}

	
}

function preSalvataggio(){	

	$('#hDataEvento').val($('input[name=txtDataProposta]').val().substr(6,4)+$('input[name=txtDataProposta]').val().substr(3,2)+$('input[name=txtDataProposta]').val().substr(0,2));
	$('#hIdenEsame').val($('SELECT[name="cmbAppunt"]').val());
	
    registra();	
}

function refreshAfterClose() {
    chiudi();
    $('iframe#frameNote',parent.document)[0].contentWindow.location.reload();
}

