var _filtro_list_gruppo  = null;
var _filtro_list_profili = null;
var _filtro_list_elenco	 = null;
var _filtro_list_scelti  = null;
var _ID_PROFILO 		 = null;
var _POS_PROFILO 		 = null;


jQuery(document).ready(function(){
	
	caricamento();
	filtroQuery();
	
	//ONDBLCLICK lstEsami
	document.getElementById('lstEsami').ondblclick = function(){ alert('argh');add_selected_elements('lstEsami', 'lstEsamiScelti', true);sortSelect('lstEsamiScelti'); };
	
	//ONCONTEXTMENU lstEsami
	document.getElementById('lstEsami').oncontextmenu = function(){
		add_selected_elements('lstEsami', 'lstEsamiScelti', true, 0);/*sortSelect('lstEsamiScelti');*/
	};
	
	//KEYUP txtEsamiRicerca
	jQuery("#txtEsamiRicerca").keyup(function(){ 
		_filtro_list_elenco.searchListRefresh("DESCR like '%" + document.dati.txtEsamiRicerca.value.toUpperCase() + "%'", "RICERCA_ELENCO"); 
	});
	
	//ONDBLCLICK lstEsami
	document.getElementById('lstEsamiScelti').ondblclick = function(){ 
		if(confirm('Eliminare l\'esame dal profilo?')){
			add_selected_elements('lstEsamiScelti', 'lstEsami', true, 0);
		}
		sortSelect('lstEsami');
	};

	//ONCONTEXTMENU lstEsami
	document.getElementById('lstEsamiScelti').oncontextmenu = function(){
		if(confirm('Eliminare l\'esame dal profilo?')){
			add_selected_elements('lstEsamiScelti', 'lstEsami', true, 0);
		}
		sortSelect('lstEsami');
	};
	
	//ONCHANGE cmbUrgenza
	jQuery("select[name='cmbUrgenza']").change(function(){ 
		
		var whereCond='REPARTO = \'' + document.all['txtCodCdc'].value + 
						'\' and URGENZA='+ document.all['cmbUrgenza'].value + 
						' and SITO = \'' + document.all['cmbGruppo'].value + '\'';
		
		_filtro_list_profili.searchListRefresh(whereCond, 'RICERCA_PROFILI');
		document.getElementById('divDettaglioGruppo').style.display='none';
	});
	
	//ONDBLCLICK lstProfili
	document.getElementById('lstProfili').onclick = function(){
		if(document.all['lstProfili'].selectedIndex >= 0) {
			apri_dettaglio_profilo(document.all['lstProfili'].options(document.all['lstProfili'].selectedIndex).value, document.all['lstProfili'].selectedIndex);
		}
	};
	
	//ONCHANGE txtCodCdc
	jQuery("#txtCodCdc").change(function(){
		var combo=document.getElementById("cmbUrgenza");
		var whereCond2='REPARTO = \'' + document.all['txtCodCdc'].value + 
						'\' and URGENZA=' + urgenza + 
						' and SITO = \'' + document.all['cmbGruppo'].value + '\'';
		
		var urgenza= combo.options[combo.selectedIndex].value;
		_filtro_list_profili.searchListRefresh(whereCond2, 'RICERCA_PROFILI');
	});
	
});

function caricamento(){

	//assegno alcune classi all'apertura della pagina
	addClass(document.all['txtReparto'],'textProfilo');
	addClass(document.all['txtProfilo'],'textProfilo');
	document.all['lstEsamiScelti'].className = '';
	addClass(document.all['lstEsamiScelti'],'listboxVerde');

}
function filtroQuery(){

	_filtro_list_profili = new FILTRO_QUERY('lstProfili', null);
	_filtro_list_profili.setDistinctQuery('S');
	_filtro_list_profili.setValueFieldQuery('COD_GRUPPO');
	_filtro_list_profili.setDescrFieldQuery('DESCR');
	_filtro_list_profili.setFromFieldQuery('TAB_ESA_GRUPPI');
	_filtro_list_profili.setOrderQuery('DESCR ASC');
	_filtro_list_scelti = new FILTRO_QUERY('lstEsamiScelti', null);


	_filtro_list_scelti.setEnableWait('N');
	_filtro_list_scelti.setValueFieldQuery('TAB_ESA.IDEN');
	_filtro_list_scelti.setDescrFieldQuery('TAB_ESA.DESCR');
	_filtro_list_scelti.setFromFieldQuery('TAB_ESA_GRUPPI,TAB_ESA');
	_filtro_list_scelti.setWhereBaseQuery('TAB_ESA.ATTIVO = \'S\' and TAB_ESA.IDEN = TAB_ESA_GRUPPI.IDEN_ESA');
	_filtro_list_scelti.setOrderQuery('TAB_ESA.DESCR ASC');
	
	var reparto=document.dati.Hcdc.value;

	_filtro_list_elenco = new FILTRO_QUERY('lstEsami', 'txtEsamiRicerca');
	_filtro_list_elenco.setValueFieldQuery('IDEN_ESA');
	_filtro_list_elenco.setDescrFieldQuery('DESCR');
	_filtro_list_elenco.setFromFieldQuery('VIEW_SCELTA_ESAMI_LABO');
	_filtro_list_elenco.setWhereBaseQuery("IDEN_PRO=" +reparto);
	_filtro_list_elenco.setOrderQuery('DESCR ASC');

}


function call_function_db(id, reparto, gruppo, descr, esa, urgenza, call_back)
{
		//alert(id +  reparto +  gruppo +  descr +  esa + urgenza + call_back);
		sql = "{call ? := GESTIONE_GRUPPI_ESAMI('" + id + "', '" + reparto + "', '" + gruppo + "', '" + descr + "', '" + esa + "', '" + urgenza + "') }";
		
		dwr.engine.setAsync(false);
		toolKitDB.executeFunctionData(sql, call_back);
		dwr.engine.setAsync(true);
}

//funzione che apre il div del dettaglio dei profili. Si passa id del profilo e la posizione
function apri_dettaglio_profilo(id, pos)
{
	_ID_PROFILO  = id;
	_POS_PROFILO = pos;
	var reparto=document.dati.txtCodCdc.value;
	var vIdenPro=document.getElementById('Hcdc').value;
	var combo=document.getElementById("cmbUrgenza");
	var urgenza= combo.options[combo.selectedIndex].value;
	var idenScheda='';
	//var vSelect = 'SELECT RESP FROM RADSQL.VIEW_IDENSCHEDE_REPARTI WHERE CDC = \''+reparto+'\'';
	var vSelect = 'SELECT RESP FROM RADSQL.VIEW_IDENSCHEDE_REPARTI WHERE iden in (SELECT iden FROM RADSQL.tab_pro WHERE cod_dec in (SELECT cod_dec FROM RADSQL.centri_di_costo WHERE cod_cdc = \''+reparto+'\''+'))';	
	
	document.EXTERN.INSERIMENTO.value = 'N';
	 
	if(pos > -1){
		document.dati.txtProfilo.value = document.dati.lstProfili.options(pos).text;
	}else{
		document.dati.txtProfilo.value = '';
	}

	alert(vSelect);
	dwr.engine.setAsync(false);	
	toolKitDB.getResultData(vSelect , resp_check);
	dwr.engine.setAsync(true);
	
	function resp_check(resp){
		
		var splitValue = resp.toString().split('@');
		idenScheda = splitValue[0];	
	}
		
	_filtro_list_elenco.setEnableWait("N");
	_filtro_list_elenco.setWhereBaseQuery("URGENZA=" +urgenza+ " and IDEN_SCHEDA = "+idenScheda+" and iden_pro = "+vIdenPro+" AND IDEN_ESA not in (select /*+first_rows(100)*/ IDEN_ESA from TAB_ESA_GRUPPI where REPARTO = '" + document.dati.txtCodCdc.value + "' and SITO = '" + document.dati.cmbGruppo.value + "' and COD_GRUPPO = '" + _ID_PROFILO + "')");
	_filtro_list_elenco.refreshList();
	_filtro_list_elenco.setEnableWait("S");

	_filtro_list_scelti.searchListRefresh("TAB_ESA_GRUPPI.REPARTO = '" + document.dati.txtCodCdc.value + "' and TAB_ESA_GRUPPI.SITO = '" + document.dati.cmbGruppo.value + "' and TAB_ESA_GRUPPI.COD_GRUPPO = '" + _ID_PROFILO + "'", "RICERCA_ELENCO_SCELTI");

	document.getElementById('divDettaglioGruppo').style.display='block';
	document.getElementById('groupElencoGruppi').style.display='block';
	
	cambiaLabelUrg();
	
}

//funzione che apre il dettaglio dei profili valorizzando la variabile INSERIMENTO settandola ad S in modo da poter inserire un nuovo profilo
function inserisci(){

	if(document.dati.txtReparto.value != '')
	{
		apri_dettaglio_profilo(0, -1);
		
		document.EXTERN.INSERIMENTO.value = 'S';
		
		document.all['lstProfili'].selectedIndex = -1;
		document.dati.txtProfilo.focus();
	}
	else
		alert('Selezionare almeno un reparto!');
}

//funzione che prende l'id del profilo selezionato e lancia la funzione 'call_function_db'
function cancella(){

	var sql;
	var combo=document.getElementById("cmbUrgenza");
	var urgenza= combo.options[combo.selectedIndex].value;

	
	if(document.all['lstProfili'].selectedIndex >= 0){
	
		if(confirm('Confermare la cancellazione?')){
		
			_ID_PROFILO = document.all['lstProfili'].options(document.all['lstProfili'].selectedIndex).value;
			call_function_db(_ID_PROFILO, document.dati.txtCodCdc.value, document.dati.cmbGruppo.value, document.dati.txtProfilo.value, 'DEL',urgenza, response_cancella_profilo);
		}
		
	}else{
		alert('Prego selezionare almeno un profilo!');
	}
}

function response_cancella_profilo(risp)
{
	if(risp.substr(0, 2) == 'OK')
		alert('Cancellazione effettuata!');
	else
		alert('Errore durante la cancellazione!\nMessaggio: ' + risp.split('*')[1]);
	
	_ID_PROFILO = '0';

	_filtro_list_profili.refreshList();
	
	document.getElementById('divDettaglioGruppo').style.display='none';
}

function registra_profilo()
{
	var msg 	= '';
	var id_esa 	= '';
	var sql 	= '';
	var cdc = '';
	
	var combo=document.getElementById("cmbUrgenza");
	var urgenza= combo.options[combo.selectedIndex].value;

	//alert(document.all['Hcdc'].value);
	//alert('INSERIMENTO: ' + document.EXTERN.INSERIMENTO.value);
	
	document.dati.txtProfilo.value = trim(document.dati.txtProfilo.value).toUpperCase();
	
// 	alert('msg: '+msg); 
	
	if(document.dati.txtProfilo.value == ''){
	
		msg += '\n\t- Inserire nome del profilo;';
	}
	
	if(document.dati.lstEsamiScelti.options.length == 0){
		msg += '\n\t- Aggiungere almeno un esame;';	
	}
	
	if(msg == ''){
	
		id_esa = getAllOptionCodeWithSplitElement('lstEsamiScelti', ',');
		var profilo=document.dati.txtProfilo.value;
		
		// alert('id_esa:'+id_esa);
		// alert('_ID_PROFILO:'+_ID_PROFILO);
		// alert(typeof (_ID_PROFILO) );
		// alert(document.dati.txtCodCdc.value);
		// alert(document.dati.cmbGruppo.value);
		// alert(document.dati.txtProfilo.value); 

		if (document.all['lstProfili'].options.length>0){
		
			for(i=0;i<document.all['lstProfili'].options.length;i++){

				//controllo se il nome del profilo è già presente nella lista e se siamo in inserimento nuovo profilo
				if(document.all['lstProfili'].options[i].text.toUpperCase() == profilo && document.EXTERN.INSERIMENTO.value=='S'){
				
					alert('Attenzione! Nome profilo inserito già esistente.\nScegliere un nuovo nome');
					//document.dati.txtProfilo.value = '';              //Decommentare nel caso si voglia cancellare completamente il nome del profilo se già presente nella lista
					document.dati.txtProfilo.focus();
					addClass(document.all['txtProfilo'],'textProfilo');
					return;
				}
			}
		}
		
		//se non ci sono profili salvati per il reparto salvo direttamente senza operare nessun controllo
		//alert('salvataggio');
		call_function_db(_ID_PROFILO, document.dati.txtCodCdc.value, document.dati.cmbGruppo.value, document.dati.txtProfilo.value, id_esa, urgenza,  response_registra_profilo);
	
	}else{
		alert('Attenzione!' + msg);
	}
         
}


function response_registra_profilo(risp)
{
	
	//alert('funzione di callback');

	if(risp.substr(0, 2) == 'OK')
	{
		alert('Registrazione effettuata!');
		
		_ID_PROFILO = risp.split('*')[1];

	}
	else
		alert('Errore durante il salvataggio!\nMessaggio: ' + risp.split('*')[1]);
		
	document.EXTERN.INSERIMENTO.value = 'N';
	
	_filtro_list_profili.refreshList();
	
	seleziona_profilo(_ID_PROFILO);
	
	document.getElementById('divDettaglioGruppo').style.display='none';	
	
	
}

function seleziona_profilo(id)
{
	var idx;
	var sel = false;
	
	for(idx = 0; !sel && document.dati.lstProfili.options.length; idx++)
	{
		if(document.dati.lstProfili.options(idx).value == id)
			document.dati.lstProfili.options(idx).selected = true;
		
		sel = document.dati.lstProfili.options(idx).selected;
	}
}

//funzione che serve nel tabulatore per settare il reparto da un frame all'altro
function setReparto(){

	//alert('entrato nella funzione setReparto();');

	var reparto = parent.document.EXTERN.REPARTO.value;
	var comboRep = parent.document.all.tabPageFrame[1].contentWindow.document.all['cmbReparto'];
	
	//alert('reparto: '+parent.document.EXTERN.REPARTO.value);
	//alert('comboRep'+parent.document.all.tabPageFrame[1].contentWindow.document.all['cmbReparto']);
	
	if(reparto!=''){
	
		for(i = 0; i < comboRep.options.length; i++){
		
			//alert('options: '+comboRep.options[i].value);
				
			if(comboRep.options[i].value == reparto){
					
				comboRep.options[i].selected = true;
					
			}
		}
	}	

	
}

function aggiornaListaProfili(){

	_filtro_list_profili.searchListRefresh('REPARTO = \'' + document.all['txtCodCdc'].value + '\' and URGENZA='+document.all['cmbUrgenza'].value+' and SITO = \'' + document.all['cmbGruppo'].value + '\'', 'RICERCA_PROFILI');
	_filtro_list_elenco.searchListRefresh('ATTIVO = \'S\' and RADSQL.IN_CDC(\'' + document.all['txtCodCdc'].value + '\', CDC) > 0');
	
	//nascondo blocco div
	document.getElementById('divDettaglioGruppo').style.display='none';

}

function cambiaLabelUrg(){

	var combo=document.getElementById("cmbUrgenza");
	var urgenza= combo.options[combo.selectedIndex].value;
		
		if (urgenza ==  '2'){
		
			document.all['lblUrgenzaProfilo'].className='';
			document.all['lblUrgenzaProfilo'].innerText='URGENZA';
			addClass(document.all['lblUrgenzaProfilo'],'ProfiloUrgenza');
			
		}else{
		
			document.all['lblUrgenzaProfilo'].className='';
			document.all['lblUrgenzaProfilo'].innerText='ROUTINE';
			addClass(document.all['lblUrgenzaProfilo'],'ProfiloRoutine');
		
		}

}

/* FUNZIONE_VECCHIA
function registra_profilo()
{
	var msg 	= '';
	var id_esa 	= '';
	var sql 	= '';
	
	document.dati.txtProfilo.value = trim(document.dati.txtProfilo.value).toUpperCase();
	
	if(document.dati.txtProfilo.value == '')
	{
		msg += '\n\t- Inserire nome del profilo;'
	}
	
	if(document.dati.lstEsamiScelti.options.length == 0)
	{
		msg += '\n\t- Aggiungere almeno un esame;'
	}
	
	if(msg == '')
	{
		id_esa = getAllOptionCodeWithSplitElement('lstEsamiScelti', ',');
		
		call_function_db(_ID_PROFILO, document.dati.cmbReparto.value, document.dati.cmbGruppo.value, document.dati.txtProfilo.value, id_esa, response_registra_profilo);
	}
	else
		alert('Attenzione!' + msg);
}
*/