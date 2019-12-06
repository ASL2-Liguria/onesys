var _filtro_list_tappi='';
var _filtro_list_tappi_scheda='';
var _filtro_list_esami='';
var _filtro_list_esami_tappo='';
parent.document.getElementById('hUrgenza').value='0';

 document.getElementById('divRicEsami').style.display='none';
 document.getElementById('divEsamiTappo').style.display='none';
 document.getElementById('divInsTappo').style.display='none';
 
 //creo già le variabile da utilizzare nelle funzioni della gestione tappi
 var ListEsaTappo=document.getElementById('elencoEsamiTappo');

//svuota il contenuto dei listbox
function svuotaListBox(elemento){
	//alert('svuotaListbox');
	var object;
	var indice;
	
	if (typeof elemento == 'String'){
		
		object = document.getElementById(elemento);
		
	}else{
	
		object = elemento;

	}
	
	if (object){
	
			indice = parseInt(object.length);
			while (indice>-1)
		
		{
			object.options.remove(indice);
			indice--;
		}
	}
}

//carica l'elenco dei tappi
function filtroElencoTappi(){

	var urgenza=parent.document.getElementById('hUrgenza').value;
	//alert('urgenza: '+urgenza);

	_filtro_list_tappi = new FILTRO_QUERY('elencoTappi', null);
	_filtro_list_tappi.setEnableWait('N');
	_filtro_list_tappi.setDistinctQuery('S');
	_filtro_list_tappi.setValueFieldQuery('IDEN');
	_filtro_list_tappi.setDescrFieldQuery('DESCRIZIONE');
	_filtro_list_tappi.setFromFieldQuery('RADSQL.VIEW_LABO_TAPPI ');
	_filtro_list_tappi.setWhereBaseQuery('GRADO_URGENZA='+urgenza);
	_filtro_list_tappi.setOrderQuery('DESCRIZIONE ASC');
	_filtro_list_tappi.searchListRefresh();
}

//carica i tappi della scheda
function filtroTappi(){
	
	var  scheda=parent.document.EXTERN.IDEN.value;
	//var  urgenza=parent.document.getElementById('hUrgenza').value;
	//var  scheda='';
	var  urgenza='0';
	var whereCond='';
	// alert(parent.document.EXTERN.IDEN.value);

	if (scheda!=''){   
	
		 whereCond='GRADO_URGENZA='+urgenza+'and IDEN_SCHEDA='+scheda;
		
	 }else{
	
		 whereCond='GRADO_URGENZA='+urgenza;
		
	 }  
		
	 // alert ('scheda: '+scheda);
	 // alert('urgenza: '+urgenza);

	_filtro_list_tappi_scheda = new FILTRO_QUERY('elencoTappiScheda', null);
	_filtro_list_tappi_scheda.setEnableWait('N');
	_filtro_list_tappi_scheda.setValueFieldQuery('to_char(IDEN || \'@\' || IDEN_PRO)');
	_filtro_list_tappi_scheda.setDescrFieldQuery('DESCRIZIONE');
	_filtro_list_tappi_scheda.setFromFieldQuery('RADSQL.VIEW_LABO_TAPPI');
	_filtro_list_tappi_scheda.setWhereBaseQuery(whereCond);
	//_filtro_list_tappi_scheda.setOrderQuery('DESCRIZIONE ASC');
	
	if (parent.document.EXTERN.IDEN.value!=''){
		_filtro_list_tappi_scheda.searchListRefresh();
	}
}

//carica gli esami di laboratorio
function filtroEsami(){

	var ListTappi=document.getElementById('elencoTappiScheda');
	var metodica=parent.document.getElementById('hTipo').value;
	//alert('metodica: '+metodica);
	var whereCond='';
	
		if (document.EXTERN.INSERIMENTO.value!='S' && ListTappi.options.length>0){
		
		var Tappo=ListTappi.options[ListTappi.selectedIndex].value.split('#');
		var array=new Array();
		//alert(Tappo);
		
		for (var i=0; i<Tappo.length;i++){
		
			array.push(Tappo[i]);
			//alert(array);

		}

		whereCond='ATTIVO=\'S\' AND METODICA=\''+metodica+'\' and IDEN not IN('+array+')';
		
	}else{
	
		whereCond='ATTIVO=\'S\' AND METODICA=\''+metodica+'\'';
	
	}

	_filtro_list_esami = new FILTRO_QUERY('elencoEsami', null);
	_filtro_list_esami.setEnableWait('N');
	_filtro_list_esami.setValueFieldQuery('IDEN');
	_filtro_list_esami.setDescrFieldQuery('DESCR');
	_filtro_list_esami.setFromFieldQuery('RADSQL.TAB_ESA');
	_filtro_list_esami.setWhereBaseQuery(whereCond);
	_filtro_list_esami.setOrderQuery('DESCR ASC');
	
	if (document.EXTERN.INSERIMENTO.value!='S' || ListTappi.options.length<1){
		_filtro_list_esami.searchListRefresh();
	}
	
}

//carica gli esami del tappo
function filtroEsamiTappo(){

 	var whereCond='';
	 var ListTappi=document.getElementById('elencoTappiScheda');
	 
	 //alert('filtroEsameTappo: '+ListTappi.options[ListTappi.selectedIndex].text);
	
	if (document.EXTERN.INSERIMENTO.value!='S'){
	
		var Tappo=ListTappi.options[ListTappi.selectedIndex].value.split('#');
		var array=new Array();
		 //alert(Tappo);
		
		for (var i=0; i<Tappo.length;i++){
		
			array.push(Tappo[i]);
			//alert(array);
		}

		whereCond='IDEN IN('+array+')';
		
	}else{
	
		whereCond='1=0';
	}

	//alert('whereCond: '+whereCond);
	
	_filtro_list_esami_tappo = new FILTRO_QUERY('elencoEsamiTappo', null);
	_filtro_list_esami_tappo.setEnableWait('N');	
	// _filtro_list_esami_tappo.setDistinctQuery('S');
	_filtro_list_esami_tappo.setValueFieldQuery('IDEN');
	_filtro_list_esami_tappo.setDescrFieldQuery('DESCR');
	_filtro_list_esami_tappo.setFromFieldQuery('RADSQL.TAB_ESA');
	_filtro_list_esami_tappo.setWhereBaseQuery(whereCond);
	_filtro_list_esami_tappo.setOrderQuery('DESCR ASC');
	
	if (document.EXTERN.INSERIMENTO.value!='S'){
		_filtro_list_esami_tappo.searchListRefresh(); 	
	}

}

//funzione che fa apparire il piccolo div di inserimento tappo
function inserisciTappo(){

	$('#divInsTappo').fadeIn(500);
	 addClass(document.getElementById('divElencoTappi'),'opacity');
	 addClass(document.getElementById('divTappiScheda'),'opacity');
	 document.getElementById('txtNomeTappo').focus();
	 document.EXTERN.INSERIMENTO.value='S';

}

//funzione che fa scomparire il piccolo div di inserimento tappo
function annulla(){
	
	var ListTappi=document.getElementById('elencoTappi');
	$('#divInsTappo').fadeOut(300);
	removeClass(document.getElementById('divElencoTappi'),'opacity');
	removeClass(document.getElementById('divTappiScheda'),'opacity');
	ListTappi.focus();
	document.EXTERN.INSERIMENTO.value='N';

}

function duplicaTappo(){



}

//function che apre i div del dettaglio degli esami relativi al tappo. Se obj non glielo passo lui prende la option selezionata nell'elenco dell'anagrafica dei tappi, altrimenti gli si passa la option selezionata 
//nell'elenco dei tappi associati alla scheda
function visualizzaTappo(obj){

	   //alert('obj: '+obj+'\ntypeof obj: '+typeof obj);
	  var ListTappi=document.getElementById('elencoTappi');

	if (typeof obj    == 'undefined'){
		
		//obj=ListTappi.options[ListTappi.selectedIndex].text;		
		//alert('testo del tappo scelto:\n'+ListTappi.options[ListTappi.selectedIndex].text);
		svuotaListBox(ListEsaTappo);
		obj=ListTappi.options[ListTappi.selectedIndex].text;

	}else{

		 filtroEsamiTappo();
	}
	
	filtroEsami();
	_filtro_list_esami.searchListRefresh()
	$('#divEsamiTappo').show(300);
	$('#divRicEsami').show(300);
	addClass(document.getElementById('divElencoTappi'),'opacity');
	addClass(document.getElementById('divTappiScheda'),'opacity');
	//document.getElementById('elencoTappi').style.display='none';
	//document.getElementById('elencoTappiScheda').style.display='none';
	document.getElementById('lblElencoEsamiTappo').innerText= obj;
	
}

//function che fa scomparirre i div di scelta e associazione degli esami al tappo
function chiudiDettaglio(){

	if (document.getElementById('elencoEsamiTappo').options.length<1){
		if(confirm('Non è stato aggiunto alcun esame. Il tappo non verrà associato alla scheda.\n\nContinuare?')){
			
		}else{
			return;
		}
	}
	
	$('#divEsamiTappo').hide(300);
	$('#divRicEsami').hide(300);
	removeClass(document.getElementById('divElencoTappi'),'opacity');
	removeClass(document.getElementById('divTappiScheda'),'opacity');
	//document.getElementById('elencoTappi').style.display='block';
	//document.getElementById('elencoTappiScheda').style.display='block';
	document.getElementById('lblElencoEsamiTappo').innerText= 'Dettaglio degli esami del Tappo';

}

function importaEsame(){

	window.open('servletGenerator?KEY_LEGAME=WK_IMPORTA_ESA_FILTRO','importaEsami','resizable = yes,status = yes, scrollbars = no');

}

//funzione che crea la option nel listbo dei tappi associati alla scheda. Inserisce il nome e la classe.
function registraTappo() {
	
	maiuscolo('txtNomeTappo');
	var text=document.getElementById('txtNomeTappo').value;
	var ListTappi=document.getElementById('elencoTappiScheda');
	
	if  (text!=''){
		
		var value='0';
		ListTappi.options[ListTappi.options.length]=new Option(text, value );
		$('#divInsTappo').hide(300);
		removeClass(document.getElementById('divElencoTappi'),'opacity');
		removeClass(document.getElementById('divTappiScheda'),'opacity');
		visualizzaTappo(text);
		//alert('registrazione Tappo');
		
	
	}else{
	
		alert('Inserire nome al tappo');
	}
}

//funzione che 'registra' gli esami del tappo assegnando la lista di esami assegnati al tappo come valore della option dello stesso tappo nel listbox
function registraEsaTappo() {

	if (document.getElementById('elencoEsamiTappo').options.length<1){
		alert('Attenzione! Scegliere almeno un esame');
		return;
	}

	//alert('registrazione Esami del Tappo');
	var listaEsami='';
	var ListTappi=document.getElementById('elencoTappiScheda');
	var ListEsaTappo=document.getElementById('elencoEsamiTappo');
	var nomeTappo=document.getElementById('lblElencoEsamiTappo').innerText
	
	for(var i=0;i<ListEsaTappo.options.length;i++){
	
		if (listaEsami!=''){
		
			listaEsami+='#';
		}
		
			listaEsami+=ListEsaTappo[i].value ;
	}
	//alert('listaEsami: '+listaEsami);

	document.getElementById('lblElencoEsamiTappo').innerText= 'Dettaglio degli esami del Tappo';

	chiudiDettaglio();
	
	if(document.getElementById('elencoEsamiTappo').options.length>0){
	
		add_selected_elements('ElencoTappi', 'ElencoTappiScheda', true);
		sortSelect('ElencoTappiScheda');
	}
	
		for(var i=0;i<ListTappi.options.length;i++){
		
		if (ListTappi.options[i].text==nomeTappo){

			ListTappi.options[i].value=listaEsami;

		}
	}

}

//funzione che dalla pagina di importazione degli esami di laboratorio si prende iden, descrizione dell'esame e se è un profilo o un esame dalla wk e lancia la procedura
function importaEsameDaLabo(iden,descr,tipo){

		sql = "{call ? := RADSQL.IMPORTA_ESA_LABO(" + iden + ", '"+descr+"','"+tipo+"','')}";
		
		dwr.engine.setAsync(false);
		
		toolKitDB.executeFunctionData(sql, callEsami);
		
		dwr.engine.setAsync(true);

}

function callEsami(resp){

	var esame=resp.substr(2);
	var res=resp.substr(0,2);

	if (res =='OK'){
	
		alert('importato esame \''+esame+'\'');
		parent.self.close();
		opener.parent._filtro_list_esami.searchListRefresh();
	
	}else{
	
		if  (confirm('esame già presente con la descrizione \''+esame+'\'!\nSi vuole allineare la descrizione di Whale a quella di Laboratorio?')){
		
			allineaDescr(esame);
		
		}else{
		
			//parent.self.close();
		
		}
	
	}

}

//funzione che richiama una function sul db per allineare la descr dell'esame a quella presente sul LABORATORIO
function allineaDescr(descrizioneWhale){

		
		sql = "{call ? := RADSQL.IMPORTA_ESA_LABO('" + iden + ", "+descr+","+tipo+"',"+descrizioneWhale+")}";
		
		dwr.engine.setAsync(false);
		
		toolKitDB.executeFunctionData(sql, callRisp);
		
		dwr.engine.setAsync(true);

}

function callRisp(resp){

	//alert(resp);
	alert('Descrizione allineata');
	opener.parent._filtro_list_esami.searchListRefresh();
	

}