/**
*/
function caricamento()
{	
	fillLabels(arrayLabelName,arrayLabelValue);	
	
	document.getElementById("DA_DATA").focus();
	document.form_ricerca.DELETED[1].checked = '1';
	
	tutto_schermo();	
	parent.RicercaFrame.ricercaDiarioMedico();
	
	jQuery('#txtDaData').datepick({showOnFocus: false, showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});	
	
	jQuery('#txtAData').datepick({showOnFocus: false, showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});	

}


/**
*/
function intercetta_tasti(){
}


/**
*/
function tastiDiarioMedico(){
	ricercaDiarioMedico();	
}


/**
*/
function ricercaDiarioMedico(){
	var parametri = null;

	parametri = "select getCDCUser('"+baseUser.LOGIN+"', 'S', 'cdc_ute_ins') cdc_ute_ins from dual";
	parametri += '@cdc_ute_ins@1';
	
	dwr.engine.setAsync(false);
	CJsUpdate.select(parametri, cbk_ricercaDiarioMedico);
	dwr.engine.setAsync(true);
}


/**
*/
function cbk_ricercaDiarioMedico(elencoCDCUteLoggato){
	var doc = document.form_dati;
	var docRic = document.form_ricerca;
	var whereCondition = null;
	var iden_anag = null;
	var cdc = elencoCDCUteLoggato.split("$");
	
	doc.action = 'SL_RicercaGenericaWorklist';
	doc.target = 'WorklistFrame';
	doc.method = 'POST';

	doc.modulo.value = docRic.hmodulo.value;

	if(top.opener.name == 'worklistMainFrame'){
		iden_anag = top.opener.stringa_codici(top.opener.array_iden_anag);
	}
	else{
		iden_anag = top.opener.stringa_codici(top.opener.iden);
	}
	
	whereCondition = ' where iden_anag = ' + iden_anag;
	
	if(docRic.DA_DATA.value != ''){
		whereCondition += " and data_ricerca >= '" + docRic.DA_DATA.value.substring(6,10)+docRic.DA_DATA.value.substring(3,5)+docRic.DA_DATA.value.substring(0,2) + "'";		
	}
	
	if(docRic.A_DATA.value != ''){
		whereCondition += " and data_ricerca <= '" + docRic.A_DATA.value.substring(6,10)+docRic.A_DATA.value.substring(3,5)+docRic.A_DATA.value.substring(0,2) + "'";	
	}
		
	if(docRic.DELETED[0].checked){
		whereCondition += " and deleted = 'S'";
	}
	
	if(docRic.DELETED[1].checked){
		whereCondition += " and deleted = 'N'";
	}
	
	doc.tipo_wk.value = 'WK_DIARIO_MEDICO';
	doc.hidWhere.value = whereCondition + ' and (' + cdc[0].substring(0, cdc[0].length-1) + ')';
	doc.hidOrder.value = ' order by iden';
	doc.context_menu.value = 'diarioMedicoRicerca';
	
	//alert('WHERE CONDITION: ' + doc.hidWhere.value);
	//alert('ORDER BY: ' + doc.hidOrder.value);

	doc.submit();
}



/**
*/
function resettaDiarioMedico(){
	var doc = document.form_ricerca;
	
	doc.DA_DATA.value = '';
	doc.A_DATA.value = '';
	doc.DELETED[1].checked = '1';
}


/**
*/
function apriChiudiDiarioMedico(){
	ShowHideLayer('div');

	if(parent.document.all.oFramesetRicercaGenerica.rows == "105,*,0")
	{
		parent.document.all.oFramesetRicercaGenerica.rows = "50,*,0";
	}
	else{
		parent.document.all.oFramesetRicercaGenerica.rows = "105,*,0";
	}
}