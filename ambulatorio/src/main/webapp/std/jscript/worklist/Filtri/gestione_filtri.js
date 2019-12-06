function gestioneProvenienze(){
	var winTipoProv = null;
	document.formDati.method = 'POST';
	document.formDati.action = 'SL_TipoProvenienze';
	document.formDati.target = 'tipo_provenienze';
	winTipoProv = window.open('', 'tipo_provenienze','width=1000,height=600, status=yes, top=10,left=10, scrollbars=yes');

	if(winTipoProv)
		winTipoProv.focus();
	else
		winTipoProv = window.open('', 'tipo_provenienze','width=1000,height=600, status=yes, top=10,left=10, scrollbars=yes');

	try
	{
		document.formDati.submit();
	}
	catch(e)
	{
		alert('Non ha trovato il document');
	}
}

function whereConditionTipoProvenienza(){
	if(document.forms("formDati").elements("hFilProv").value != '')
	{
		if(strWhere!='')
		{
			strWhere+=" AND ";
		}

		strWhere += "INT_EST in (" + document.forms("formDati").elements("hFilProv").value + ")";
	}
	//alert('whereConditionTipoProvenienza(): ' + strWhere);
}


function gestioneStato(documento)
{
	documento.formDati.action = 'SL_SceltaFiltroStato';
	documento.formDati.target = 'scelta_filtri';
	documento.formDati.method = 'POST';

	var win_scelta_filtro_stato;

	win_scelta_filtro_stato = window.open('', 'scelta_filtri', 'width=1000, height=600, status=yes, top=10,left=10, scrollbars=yes');

	if(win_scelta_filtro_stato)
	{
		win_scelta_filtro_stato.focus();
	}
	else
	{
		win_scelta_filtro_stato = window.open("", "scelta_filtri", "width=1000, height=600, status=yes, top=10,left=10, scrollbars=yes");
	}
//	documento.formDati.hstato_whereCondition.value = '';


	try
	{
		documento.formDati.submit();
	}
	catch(e)
	{
		alert(e);
	}
}

function gestioneSale(documento)
{
	documento.formDati.method = 'POST';
	documento.formDati.action='SL_GestoreSale';
	documento.formDati.target='salesManager';
	var win_sale = window.open('', 'salesManager','width=1000,height=600, status=yes, top=10,left=10, scrollbars=yes');
	if(win_sale)
		win_sale.focus();
	else
		win_sale = window.open('', 'salesManager','width=1000,height=600, status=yes, top=10,left=10, scrollbars=yes');

	try
	{
		documento.formDati.submit();
	}
	catch(e)
	{
		alert('Non ha trovato il document');
	}
}

function gestioneMetodica(documento)
{
	documento.formDati.method = 'POST';
	documento.formDati.action='SL_Gestione_Metodiche';
	documento.formDati.target='gest_metodiche';
	var win_metodica = window.open('', 'gest_metodiche','width=1000,height=600, status=yes, top=10,left=10, scrollbars=yes');
	if(win_metodica)
		win_metodica.focus();
	else
		win_metodica = window.open('', 'gest_metodiche','width=1000,height=600, status=yes, top=10,left=10, scrollbars=yes');

	try
	{
		documento.formDati.submit();
	}
	catch(e)
	{
		alert('Non ha trovato il document');
	}
}

function gestioneCDC(documento)
{
	documento.formDati.method = 'POST';
	documento.formDati.action='SL_GestFiltroCDC';
	documento.formDati.target='gest_cdc';
	documento.formDati.nome_funzione_applica.value = 'applica_worklist_esami()';
	documento.formDati.nome_funzione_chiudi.value = 'chiudi()';
	var win_cdc = window.open('', 'gest_cdc','width=1000,height=600, status=yes, top=10,left=10, scrollbars=yes');
	if(win_cdc)
		win_cdc.focus();
	else
		win_cdc = window.open('', 'gest_cdc','width=1000,height=600, status=yes, top=10,left=10, scrollbars=yes');
	try
	{
		documento.formDati.submit();
	}
	catch(e)
	{
		alert('Non ha trovato il document');
	}
}			


/*
  Funzione per effettuare il refresh dei filtri (sala, provenienze, medici)
  al cambiamento della scelta dei cdc.
  Richiamata dalla funzione js worklist/Filtri/gestione_cdc.js
 */
function refresh_filtri(cdc)
{
	try{
		document.form_refresh_filtri.action = 'SL_RefreshFiltri';
		document.form_refresh_filtri.target = 'worklistHideFrame';
		if(cdc  == '')
			cdc = document.form_refresh_filtri.cdc.value;
		document.form_refresh_filtri.elenco_cdc.value = cdc;
		// modifica aldo 21-11-14
		try{
		$("#applica").html("Attendere...");
		$("#applica").attr("href","javascript:return false;");}catch(e){;}
		// *************************
		document.form_refresh_filtri.submit();
	}
	catch(e){
		alert("setHiddenValueFiltri - Error: " + e.description);
	}
}

/*
	Funzione che setta i valori dei campi nascosti dei filtri
 */
function setHiddenValueFiltri()
{
	try{
		/*Copia dei valori inseriti nei campi nascosti*/
		document.forms("frmMain").elements("hFilMeto").value   = document.all.hMetodica.value;
		document.forms("frmMain").elements("hFilCdc").value    = document.all.hCdc.value;


		if(baseUser.FILTRO_PROVENIENZA == '0')
			document.forms("frmMain").elements("hFilProv").value = document.all.FilProv.options(document.all.FilProv.selectedIndex).value;
		if(baseUser.FILTRO_PROVENIENZA == '1')
			document.forms("frmMain").elements("hFilProv").value = document.all.hFilProv.value;

		document.forms("frmMain").elements("hFilSala").value   = document.all.hSale.value;
		if (document.all.FilMed){
			document.forms("frmMain").elements("hFilMed").value    = document.all.FilMed.options(document.all.FilMed.selectedIndex).value;
		}
		document.forms("frmMain").elements("hFilState").value  = document.all.hstato_iden.value;
		document.forms("frmMain").elements("htxtDaData").value = document.all.txtDaData.value;
		if (document.all.txtAData){
			document.forms("frmMain").elements("htxtAData").value  = document.all.txtAData.value;
		}
		if (document.all.FilUrgenze){
			document.forms("frmMain").elements("hFilUrgenze").value = document.all.FilUrgenze.options(document.all.FilUrgenze.selectedIndex).value;
		}
	}
	catch(e){
		alert("setHiddenValueFiltri - Error: " + e.description);
	}
}

/*
	Funzione utilizzata per effettuare la cancellazione degli elementi del combo-box delle provenienze
	e dei medici dalla finestra dei filtri
 */
/*function remove_option(combo_box)
{
	try{
		var num_options = combo_box.length;
		for(idx = num_options; idx > 0; idx--)
		{
			combo_box.options.remove(idx);
			combo_box.options[idx]=null;
			combo_box.length = 1;
		}
	}
	catch(e){
		alert("remove_option - Error: " + e.description);
	}
}*/


function remove_option(combo_box)
{
	var indice;
	if (combo_box){
		indice = parseInt(combo_box.length);
		while (indice>0)
		{
			combo_box.options.remove(indice);
			indice--;
		}
	}
}

/*
	Funzione utilizzata per caricare le nuove provenienze ed i medici derivanti dalla scelta dei nuovi centri
	di costo.
	@param idx   
	@param id 	  indica il value da mettere nelle option della combo-box delle provenienze o dei medici	
	@param descr  indica la descrizione dell'elemento del combo-box delle provenienze o dei medici
	@param el	  indica il nome dell'elemento combo-box provenienze
 */
function update_elemento(combo_box, idx, id, descr, el)
{
	if(el != null && idx > 0)
	{
		combo_box.options[idx] = new Option(descr, id);
	}
}
/*
	Funzione utilizzata per caricare le nuove sale che sono associate ai centri di costo selezionati 
	dalla finestra di scelta
	@param sale_ass_cdc_iden   contiene gli iden delle sale che appartengono ai cdc selezionati
	@param sale_ass_cdc_descr  contiene le descrizioni delle sale
	@param count 			   indica il numero delle sale che appartengono ai cdc
 */

function refresh_sale(sale_ass_cdc_iden, sale_ass_cdc_descr, count)
{
	parent.worklistTopFrame.document.all.hSale.value = sale_ass_cdc_iden;

	parent.worklistTopFrame.document.all.tabella_sale.title = sale_ass_cdc_descr;

	var label_sale = sale_ass_cdc_descr;
	if(sale_ass_cdc_descr.length > 25)
		label_sale = sale_ass_cdc_descr.substring(0,25) + '...';
	parent.worklistTopFrame.document.all.td_sale.innerText = label_sale;//'N° Sale sel.: ' + count;
	// modifica aldo 21-11-14
	// questa funzione viene chiamata dall'esterno,
	// ovvero dal frame nascosto !!!!!
	try{
	parent.worklistTopFrame.$("#applica").html("Applica");
	parent.worklistTopFrame.$("#applica").attr("href","javascript:applica();");		}catch(e){;}
	// ***********	
}

//inizializza variabile locale where
function whereConditionStato()
{
	var stato = document.forms("formDati").elements("hstato_whereCondition").value.replace(/"/g, "'");

	if(stato != '')
	{
		if(strWhere != '')
		{
			strWhere += ' AND ';
		}
		strWhere+='('+stato+')';
	}
}



function gestioneCalendario(){
	if (document.getElementById("txtDaData")){
		jQuery('#txtDaData').datepick({showOnFocus: false, showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});
	}
	if (document.getElementById("txtAData")){
		jQuery('#txtAData').datepick({showOnFocus: false, showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});
	}

}



function gestioneDaDataAData(campoData){
	if(campoData == 'txtDaData')	
		document.formDati.txtDaData.value = getToday();
	else
		document.formDati.txtAData.value = getToday();
}


/*
function sceltaIntEstPs(){
	 window.open('ProvIEPS.html', 'win_bidoni','height=300px,width=900px,top=200px,left=80px,status=no');

}*/

function initMainObject(){
	try{
		if (tipoFiltraggio == 10){
			document.getElementById("LBL_FLTdaData").innerHTML = "In Data";
			parent.document.all.oFramesetWorklist.rows = "90,0,*,0";
		}
	}
	catch(e){
		alert("initMainObject - Error: " + e.description);
	}
}

/*
var miaData = "31/01/2012";
var dataGiorno = miaData.substring(0,2);
var dataMese = miaData.substring(3,5) ;
if (dataGiorno.substring(0,1)=="0"){dataGiorno = dataGiorno.substring(0,2);}
if (dataMese.substring(0,1)=="0"){dataMese = dataMese.substring(0,2);}
var mydate = new Date();
mydate.setFullYear(2012,parseInt(dataMese) -1 ,dataGiorno);
alert('Date original=' + mydate.format("dd/mm/yyyy"));
mydate=mydate.Add("uD", -1);
alert('Date After =' + mydate.format("dd/mm/yyyy"));
*/