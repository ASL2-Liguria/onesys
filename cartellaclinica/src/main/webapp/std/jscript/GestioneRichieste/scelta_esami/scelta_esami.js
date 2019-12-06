var _CONF_ESA_REPARTO	= null;
var _A_SEL_PARTE 		= new Array();
var _filtro_list 		= null;
var _filtro_list_scelti	= null;
var _METODICA 			= typeof $('#METODICA').val() == 'undefined' ? '' : $('#METODICA').val() ;

$(window).load(function() {
	try {
		// HTML_EVENTI
		setEvents();
	} catch(e) {
		alert(e.message);
	}
});

function setEvents() {
	// SCELTA_ESAMI.body
	document.setTuttoSchermo();gestioneCaricamento();
	
	// SCELTA_ESAMI.dati.oTableElenco.elencoEsami
	document.getElementById('elencoEsami').ondblclick = function(e) {
		add_selected_elements('elencoEsami', 'elencoEsamiScelti', false, 0);/*sortSelect('elencoEsamiScelti');*/return false;
	};
	document.getElementById('elencoEsami').oncontextmenu = document.getElementById('elencoEsami').ondblclick;
	
	// SCELTA_ESAMI.dati.oTableElencoScelti.elencoEsamiScelti
	document.getElementById('elencoEsamiScelti').conferma = function() {
		opener.getElementById('cmbPrestRich').options.outerHTML = opener.document.getElementById('cmbPrestRich').options.outerHTML.substr(0, opener.document.getElementById('cmbPrestRich').options.outerHTML.toUpperCase().indexOf('<OPTION') > 0 ? opener.document.getElementById('cmbPrestRich').options.outerHTML.toUpperCase().indexOf('<OPTION'):opener.document.getElementById('cmbPrestRich').options.outerHTML.toUpperCase().indexOf('</SELECT')) + document.getElementById('elencoEsamiScelti').options.innerHTML + '</SELECT>';
	};
	document.getElementById('elencoEsamiScelti').chiusura = function() {
		self.close();
	};
	document.getElementById('elencoEsamiScelti').ondblclick = function(e) {
		remove_elem_by_sel('elencoEsamiScelti');sortSelect('elencoEsamiScelti');return false;
	};
	document.getElementById('elencoEsamiScelti').oncontextmenu = document.getElementById('elencoEsamiScelti').ondblclick;
	
	// SCELTA_ESAMI.dati.oTableElenco.txtRicerca
	document.getElementById('txtRicerca').onkeyup = function(e) {
		_filtro_list.searchListRefresh("COL02 like '" + (document.getElementById("chkSensibile").checked ? "%":"") + document.getElementById('txtRicerca').value.toUpperCase() + "%'", "RICERCA");
	};
	
	// SCELTA_ESAMI.dati.oTableElenco.chkSensibile
	document.getElementById('chkSensibile').onclick = document.getElementById('txtRicerca').onkeyup;
	
	// Aggiunge gli eventi per selezionare le parti del corpo
	if (!isIE) $('img#ominde').mapster({singleSelect: false, render_highlight: {fillColor: '00cc00'}, render_select: {fillColor: '00cc00'}, mapKey: 'data-zone', fill: true, fillOpacity: 0.5, areas: []});
}

function generateWhereCorpo()
{
	var ret = '';
	
	for(var idx in _A_SEL_PARTE)
	{
		if(_A_SEL_PARTE[idx] != null && typeof idx == 'string' && typeof _A_SEL_PARTE[idx] != 'undefined' && typeof _A_SEL_PARTE[idx] != 'function')
		{
			if(typeof $(_A_SEL_PARTE[idx]).attr('parte') != 'undefined' && $(_A_SEL_PARTE[idx]).attr('parte') != '')
				ret += (ret != '' ? ' or ':'') + ' COL17 like \'%' + idx + '%\'';
		}
	}

	return ret;
}

function generateWhereMetodica()
{
	var a_bt   = $('li[class=pulsanteLISelezionato]');
	var elenco = '';
	
	for(var idx = 0; idx < a_bt.length; idx++)
	{
		if(elenco != '')
			elenco += ', ';
		elenco += '\'' + a_bt.get(idx).getAttribute('id').split('_')[1] + '\'';
	}
	return elenco != '' ? 'COL07 in (' + elenco + ')':'';
}

function set_parte_corpo(parte)
{
	var area_sel = document.getElementById('ominde_canvas');
	
	if(typeof _A_SEL_PARTE[parte] == 'undefined' || _A_SEL_PARTE[parte] == null)
	{
		_A_SEL_PARTE[parte] = document.createElement('canvas');
		_A_SEL_PARTE[parte].id = 'CANVAS_' + parte;
		$(_A_SEL_PARTE[parte]).attr('parte', parte);
		_A_SEL_PARTE[parte].innerHTML = area_sel.innerHTML;
		_A_SEL_PARTE[parte].style.cursor = 'pointer';
		_A_SEL_PARTE[parte].onclick = new Function('set_parte_corpo("' + parte + '")');
		
		document.body.appendChild(_A_SEL_PARTE[parte]);
	}
	else
	{
		document.body.removeChild(_A_SEL_PARTE[parte]);
		
		$(_A_SEL_PARTE[parte]).attr('parte', '');
		_A_SEL_PARTE[parte].innerHTML = '';
		_A_SEL_PARTE[parte] = null;
		_A_SEL_PARTE.splice(parte, 1);
	}
	
	_filtro_list.refreshList(generateWhereCorpo(), 'CORPO');
}

function ripristina_parte_corpo()
{
	for(var idx in _A_SEL_PARTE)
	{
		if(_A_SEL_PARTE[idx] != null && typeof idx == 'string' && typeof _A_SEL_PARTE[idx] != 'undefined' && typeof _A_SEL_PARTE[idx] != 'function')
		{
			if(typeof $(_A_SEL_PARTE[idx]).attr('parte') != 'undefined' && $(_A_SEL_PARTE[idx]).attr('parte') != '')
			{
				document.body.removeChild(_A_SEL_PARTE[idx]);
				
				$(_A_SEL_PARTE[idx]).attr('parte', '');
				_A_SEL_PARTE[idx].innerHTML = '';
				_A_SEL_PARTE[idx] = null;
				_A_SEL_PARTE.splice(idx, 1);
				
				// Ripristina gli eventi per selezionare le parti del corpo
				if (!isIE) $('img#ominde').mapster({singleSelect: false, render_highlight: {fillColor: '00cc00'}, render_select: {fillColor: '00cc00'}, mapKey: 'data-zone', fill: true, fillOpacity: 0.5, areas: []});
			}
		}
	}
	
	_filtro_list.refreshList(generateWhereCorpo(), 'CORPO');
}

function set_metodica(valore)
{
	var bt = $('#metodica_' + valore);
	
	if(bt.attr('class') == '' || typeof bt.attr('class') == 'undefined')
	{
		bt.attr('class', 'pulsanteLISelezionato');
	}
	else
	{
		bt.attr('class', '');
	}
	
	_filtro_list.refreshList(generateWhereMetodica(), 'METODICA');
}

function ripristina_filtro()
{
	var a_bt = $('li[class=pulsanteLISelezionato]');
	
	for(var idx = 0; idx < a_bt.length; idx++)
	{
		a_bt.attr('class', '');
	}
	
	_filtro_list.refreshList(generateWhereMetodica(), 'METODICA');
}

function add_esame_ACR(id, descr)
{
	if(id != '' && descr != '')
	{
		add_elem('elencoEsamiScelti', id, descr);
		sortSelect('elencoEsamiScelti');
	}
}

function annulla()
{
	if(window.opener != null)
	{
		if(typeof window.opener.aggiorna == 'function')
			window.opener.aggiorna();
		
		self.close();
	}
	else
	{
		// Non è aperta da parte, blank!
		document.forms[0].target = '_self';
		document.forms[0].action = 'blank';
		document.forms[0].submit();
	}
}

function continua()
{	
	try {
		if(document.getElementById('elencoEsamiScelti').options.length > 0)
		{
			if(check_metodica()){
				opener.document.getElementById('cmbPrestRich').parentElement.innerHTML = opener.document.getElementById('cmbPrestRich').parentElement.innerHTML.substr(0, opener.document.getElementById('cmbPrestRich').parentElement.innerHTML.toUpperCase().indexOf('<OPTION') > 0 ? opener.document.getElementById('cmbPrestRich').parentElement.innerHTML.toUpperCase().indexOf('<OPTION'):opener.document.getElementById('cmbPrestRich').parentElement.innerHTML.toUpperCase().indexOf('</SELECT')) + document.getElementById('elencoEsamiScelti').innerHTML + '</SELECT>';
				self.close();
	
			}else{
				alert('Attenzione! Selezionare esami con la stessa metodica!');
			}
		}
		else{
			alert('Scegliere almeno un esame per proseguire!');
		}
	} catch(e) {
		alert(e.message);
	}
}


//funzione per aggiungere gli esami di un gruppo
function aggiungiEsami(){
	
	var object = document.dati.elencoGruppi;

	dwr.engine.setAsync(false);

	toolKitDB.getListResultData("select to_char(TAB_ESA.iden)||'@'||TAB_ESA.METODICA, TAB_ESA.DESCR from TAB_ESA join tab_esa_gruppi on (tab_esa_gruppi.iden_esa = tab_esa.iden) where TAB_ESA_GRUPPI.cod_GRUPPO =  '" +  object.options(object.selectedIndex).value + "'", callEsami);

	//select to_char(TAB_ESA.iden)||'@'||TAB_ESA.METODICA, TAB_ESA.DESCR from TAB_ESA join tab_esa_gruppi on (tab_esa_gruppi.iden_esa = tab_esa.iden) where TAB_ESA_GRUPPI.cod_GRUPPO = 
	
	//vecchia
	//select TAB_ESA.iden, TAB_ESA.DESCR from TAB_ESA join tab_esa_gruppi on (tab_esa_gruppi.iden_esa = tab_esa.iden) where TAB_ESA_GRUPPI.cod_GRUPPO =
	
	dwr.engine.setAsync(true);
	
}

//funzione callback per inserirli in un campo
function callEsami (esami){
	
	for (var i = 0; i<esami.length; i++)
	{
		add_elem('elencoEsamiScelti', esami[i][0], esami[i][1]);
	}  
	sortSelect('elencoEsamiScelti');
		
}

//funzione di controllo delle metodiche, attivabile con il parametro in CC_CONFIGURA_REPARTO --> PRESTAZIONI_CONTROLLO_METODICA
function check_metodica(){

	var ret 			= true;	
	var vCdc 			= document.EXTERN.CDC_DESTINATARIO.value;
	var vTipo 			= document.EXTERN.TIPO.value;
	var vRichiedente 	= document.EXTERN.REPARTO_RICHIEDENTE.value;
	var ControlloMetodicheAbilitato;	
	eval('var ControlloMetodiche =' + baseReparti.getValue(vRichiedente,'PRESTAZIONI_CONTROLLO_METODICA'));
	
	if(typeof ControlloMetodiche[vTipo][vCdc] == 'undefined'){
		if(typeof ControlloMetodiche[vTipo]['Default'] == 'undefined'){
			ControlloMetodicheAbilitato = false;
		}else{
			ControlloMetodicheAbilitato = ControlloMetodiche[vTipo]['Default'];
		}
	}else{
		ControlloMetodicheAbilitato = ControlloMetodiche[vTipo][vCdc];
	}
	
	if(ControlloMetodicheAbilitato){
		
		var f_met = '';
		var a_met = '';
		$('select[name="elencoEsamiScelti"] option').each(function(){
			a_met = $(this).val().split('@')[1];
			if(f_met == '' && a_met!=''){
				f_met = a_met;
			}
			if(a_met != f_met){
				ret = false;
			}			
		});
	}
	return ret;
}	

//funzione che gestisce il caricamento dei listbox al caricamento della pagina
function gestioneCaricamento(){

	var esami	= $('#ESAMI').val();
	var cdcSorg	= $('#REPARTO_RICHIEDENTE').val();
	var cdcDest	= $('#CDC_DESTINATARIO').val();
	var tipo	= $('#TIPO').val();
	var urgenza	= $('#URGENZA').val();
	
	var where 	= esami != '' ? 'COL01 NOT IN (' + esami + ')' : '' ;
		
	// Listbox Esami 
	_filtro_list = new FILTRO_QUERY('elencoEsami', 'txtRicerca', true); // iden - metodica - mdc_sino
	_filtro_list.setValueFieldQuery('COL01 || \'@\' || COL07|| \'@\' || COL06');
	_filtro_list.setDescrFieldQuery('COL02');
	_filtro_list.setFromFieldQuery("table(RADSQL.GETESAMIRICHIEDIBILI('"+cdcDest+"','"+cdcSorg+"','"+tipo+"','"+urgenza+"','"+_METODICA+"',''))");
	_filtro_list.setWhereBaseQuery(where);
	_filtro_list.setOrderQuery('COL02 ASC');
	_filtro_list.refreshList();
	
	// Valorizzo Listbox con Esami (Eventualmente) Già Scelti
	if(esami != ''){

		var funz1 = document.getElementById('elencoEsamiScelti').conferma;
		var funz2 = document.getElementById('elencoEsamiScelti').chiusura;

		_filtro_list_sel = new FILTRO_QUERY('elencoEsamiScelti');
		_filtro_list_sel.setValueFieldQuery('to_char(IDEN) || \'@\' || METODICA');
		_filtro_list_sel.setDescrFieldQuery('DESCR');
		_filtro_list_sel.setFromFieldQuery('TAB_ESA');
		_filtro_list_sel.setWhereBaseQuery('ATTIVO = \'S\' AND IDEN IN (' + esami + ')');
		_filtro_list_sel.setOrderQuery('DESCR ASC');
		_filtro_list_sel.refreshList();

		document.getElementById('elencoEsamiScelti').conferma = funz1;
		document.getElementById('elencoEsamiScelti').chiusura = funz2;
	}
}


function scegliEsamiProfilo(val){

	var reparto=document.EXTERN.REPARTO_RICHIEDENTE.value;
	
	var sql='select tg.iden_esa ||\'@\'|| TE.METODICA , te.descr from radsql.VIEW_ESA_REPARTO te join radsql.TAB_ESA_GRUPPI tg on (te.iden=tg.iden_esa) where tg.cod_gruppo=\''+val+'\' AND REPARTO=\''+reparto+'\'';


	dwr.engine.setAsync(false);
	toolKitDB.getListResultData(sql, creaOptEsami);
	dwr.engine.setAsync(true);
}


function creaOptEsami(elenco){

	 //alert('Risultato query dwr: \n\n' +elenco);
	
	var Listbox=document.getElementsByName('elencoEsamiScelti')[0];
	arrayOpt=new Array();
	
	for (var i=0;i<elenco.length; i++){
	
		var oOpt = document.createElement('Option');
		
		oOpt.value = elenco[i][0];
		oOpt.text = elenco[i][1];
		//alert(oOpt.value);
		
		if (oOpt!=''){
		
		//alert((in_array(Listbox, oOpt.value)));
			
			if (in_array(Listbox, oOpt.value)){
				//alert('L\'esame '+oOpt.text+' è già presente');	
			}else{
				Listbox.add(oOpt);
			}
		}
	}
}


//funzione alla quale si passa l'elemento array e l'elemento da controllare. Se l
function in_array(thaArray, element){
	
	//alert('funzione in_array');
	var res=false;
		
		for(var e=0;e<thaArray.length;e++){
			if(thaArray[e].value == element){
				res=true;
				break;
			}
		}
	return res;
}

function visualizza_preferiti()
{
	var bt = document.getElementById('lblPreferiti').parentElement;
	if(bt.className == '' || typeof bt.className == 'undefined' || bt.className == 'pulsante'){
		_filtro_list.setFromFieldQuery('TAB_ESA,TAB_ESA_GRUPPI');
		_filtro_list.refreshList("TAB_ESA_GRUPPI.IDEN_ESA=TAB_ESA.IDEN AND TAB_ESA_GRUPPI.SITO='PREFERITI_RADIOLOGIA' AND TAB_ESA_GRUPPI.REPARTO='"+document.EXTERN.REPARTO.value+"'", 'PREFERITO');

		bt.className = 'pulsanteSelezionato';
	}
	else
	{
		_filtro_list.setFromFieldQuery('TAB_ESA');
		_filtro_list.refreshList("", 'PREFERITO');

		bt.className = 'pulsante';
	}
	
}

