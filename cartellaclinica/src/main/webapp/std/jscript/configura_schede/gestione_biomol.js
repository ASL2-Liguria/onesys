var _filtro_list_tappi='';
var _filtro_list_tappi_scheda='';
var _filtro_list_esami='';
var _filtro_list_esami_tappo='';
var _filtro_list_materiali='';
var _filtro_list_materiali_tappo='';

parent.document.getElementById('hUrgenza').value='0';

addClass(document.getElementById('elencoEsamiTappo'),'elenchiScelte');

/*  document.getElementById('divRicEsami').style.display='none';
 document.getElementById('divEsamiTappo').style.display='none'; */
 $('#divInsMat').hide();
 
 //creo due div
$(document).ready(function()
{
	$("body").append('<div id="popup" class="hide"></div>');
	$("body").append('<div id="overlay" class="hide"></div>');
});
 

 //appendo l'iframe nel div di ricerca esame
var iframe='';
iframe+='<div id="divElencoEsami"><IFRAME id=elencoEsami width=500 height=500 src="servletGenerator?KEY_LEGAME=WK_ESAMI_CONFIGURATORE&WHERE_WK=" frameBorder=5 scrolling=yes SRC_ORIGINE="blank.htm"></IFRAME></div>';

$('#groupRicEsami').append(iframe);

//metto l'evento onclick sui radio chkRicerca
var chk=document.dati.chkRicerca;
for (var i=0;i<chk.length;i++){

	chk[i].onclick=function (){
		ricercaEsameWk();
	}
} 

 
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

//carica gli esami del tappo
function filtroEsamiTappo(){

 	var whereCond='iden in (select iden_esa from radsql.gestione_laboratorio where ';
	 var ListTappi=document.getElementById('elencoTappiScheda');
	 
	 //alert('filtroEsameTappo: '+ListTappi.options[ListTappi.selectedIndex].text);
	
	if (document.EXTERN.INSERIMENTO.value!='S'){
	
		if (parent.document.EXTERN.MODIFICA.value!='S'){
		
			whereCond+='iden_pro=\'0\' and iden_tappo='+ListTappi.options[ListTappi.options.selectedIndex].value+')';		
		
		}else{
		
			whereCond+='iden_tappo='+ListTappi.options[ListTappi.options.selectedIndex].value+')';		
		}
		
	}else{
	
		whereCond='1=0';
	}

	//alert('whereCond: '+whereCond);
	_filtro_list_esami_tappo = new FILTRO_QUERY('elencoEsamiTappo', null);
	_filtro_list_esami_tappo.setEnableWait('N');	
	_filtro_list_esami_tappo.setValueFieldQuery('IDEN');  //cambiare con iden del laboratorio
	_filtro_list_esami_tappo.setDescrFieldQuery('DESCR'); //cambiare con la descr del laboratorio
	_filtro_list_esami_tappo.setFromFieldQuery('RADSQL.TAB_ESA'); //cambiare con l a vista che mi tira su gli esami con iden e descr dal laboratorio
	_filtro_list_esami_tappo.setWhereBaseQuery(whereCond);
	_filtro_list_esami_tappo.setOrderQuery('DESCR ASC'); //cambiare
	
	if (document.EXTERN.INSERIMENTO.value!='S'){
		_filtro_list_esami_tappo.searchListRefresh(); 	
	}

}

//function che carica il riepilogo dei materiali associati all'esame
function filtroInfoEsame(){

	var whereCond='';
	var Listbox=document.getElementById('elencoEsamiTappo').options;
	var splitEsami=Listbox[Listbox.selectedIndex].value.split(',');
	var iden='';
	var elencoIden='';
	
	for (var i=0;i<splitEsami.length;i++){

		if (i==0){
			iden=splitEsami[i];
		}else{
		
			if (elencoIden!=''){elencoIden+=','}
			
			elencoIden+=splitEsami[i];
		}
	}
	
	if (splitEsami.length==2){
		whereCond='IDEN = '+elencoIden;
	}else{
		whereCond+='IDEN IN('+elencoIden+')';
	}
	
	//alert('whereCond: '+whereCond);

	_filtro_list_materiali_tappo = new FILTRO_QUERY('infoEsami', null);
	_filtro_list_materiali_tappo.setEnableWait('N');	
	_filtro_list_materiali_tappo.setValueFieldQuery('IDEN');  //cambiare con iden del laboratorio
	_filtro_list_materiali_tappo.setDescrFieldQuery('DESCR'); //cambiare con la descr del laboratorio
	_filtro_list_materiali_tappo.setFromFieldQuery('RADSQL.MG_ART'); //cambiare con l a vista che mi tira su gli esami con iden e descr dal laboratorio
	_filtro_list_materiali_tappo.setWhereBaseQuery(whereCond);
	_filtro_list_materiali_tappo.setOrderQuery('DESCR ASC'); //cambiare
	_filtro_list_materiali_tappo.searchListRefresh(); 

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
	
	/*filtroEsami();
	_filtro_list_esami.searchListRefresh();*/
	
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
	var listaDescr='';
	var ListTappi=document.getElementById('elencoTappiScheda');
	var ListEsaTappo=document.getElementById('elencoEsamiTappo');
	var idenScheda=parent.document.getElementById('Hiden').value;
	var nomeTappo=document.getElementById('lblElencoEsamiTappo').innerText;
	var urgenza = parent.document.getElementById('hUrgenza').value;
	var classe='altriesami';
	var metodica=parent.document.getElementById('hTipo').value;
	
	for(var i=0;i<ListEsaTappo.options.length;i++){
	
		if (listaEsami!=''){listaEsami+='@';}
		if (listaDescr!=''){listaDescr+=',';}
		
		listaEsami+=ListEsaTappo[i].value ;
		listaDescr+=ListEsaTappo[i].text;
	}
	//alert('listaEsami: '+listaEsami);

	document.getElementById('lblElencoEsamiTappo').innerText= 'Dettaglio degli esami del Tappo';

	chiudiDettaglio();
	
	if(document.getElementById('elencoEsamiTappo').options.length>0){
	
		add_selected_elements('ElencoTappi', 'ElencoTappiScheda', true);
		sortSelect('ElencoTappiScheda');
	}

	sql = "{call ? := RADSQL.SALVA_ESAMI('" + listaEsami+ "', '"+listaDescr+"','"+nomeTappo+"','"+classe+"', '"+urgenza+"',"+idenScheda+",'"+metodica+"')}";
		
	dwr.engine.setAsync(false);
		
	toolKitDB.executeFunctionData(sql, callIdenTappo);
	
	dwr.engine.setAsync(true);
	
	//function di callback
	function callIdenTappo(idenTappo){
	
		for(var i=0;i<ListTappi.options.length;i++){
		
			if (ListTappi.options[i].text==nomeTappo){

				ListTappi.options[i].value=idenTappo;
			}
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
	//alert('Descrizione allineata');
	opener.parent._filtro_list_esami.searchListRefresh();
	

}

function eliminaEsaTappo(){
	
	var ListEsami=document.getElementById('elencoEsamiTappo');
	var esame='';
	var elencoIden='';
	
	for (var i=0; i< ListEsami.length ;i++){
	
		//alert(ListEsami.options[i].selected);
		if (ListEsami.options[i].selected){
		
			if (esame!=''){esame+=','}
		
			esame+=ListEsami.options[i].value;
		
		}else{
		
			if (elencoIden!=''){elencoIden+=','}
			
			elencoIden+=ListEsami.options[i].value;
		}
	}
	
	//var esame=ListEsami.options[ListEsami.options.selected].value;
	//alert('esame: '+esame);
	esame+=',';
	var splitEsame=esame.split(',');
	
	for (var x=0;x<splitEsame.length;x++){
	
		//scelgo l'option selezionata e la rimuovo
		for (var i = ListEsami.length - 1; i>=0; i--) {
			
			if (ListEsami.options[i].value==splitEsame[x]) {	
				
				ListEsami.remove(i);
			
			}
		}
	}
	
	//controllo se l'esame eliminato è l'ultimo del listbox, se lo è valorizzo elencoIden con 0 in modo che non la wk si carichi correttamente
	if (elencoIden==''){elencoIden='0'}

	var src="servletGenerator?KEY_LEGAME=WK_ESAMI_CONFIGURATORE&WHERE_WK= where iden not in ("+elencoIden+") order by descrizione asc";
	//alert(src);

	//ricarico la worklist con la nuova where condition
	var iframe='';
	iframe+='<div id="divElencoEsami" ><IFRAME id=elencoEsami width=500 height=500 src="'+src+'" frameBorder=5 scrolling=yes SRC_ORIGINE="blank.htm"></IFRAME></div>';

	$("#elencoEsami").replaceWith(iframe);
}

//funzione che cicla il listbox dei tappi della scheda e valorizza il campo nascosto 
function preSalvataggio(){

	var Listbox = document.getElementById('elencoTapppiScheda');
	var ListaTappi='';
	
	for (var i=0;i<Listbox.options.length;i++){
	
		if (ListaTappi!=''){ListaTappi+=','}
		
		ListaTappi+=Listbox.options[i].value;
		alert(ListaTappi);
	}
	
	parent.$("#hTappi").val(ListaTappi);
	//alert(parent.$("#hTappi"));
}

function ricercaEsameWk(){

	$("#txtRicEsami").val($("#txtRicEsami").val().toUpperCase());
	var testo=$("#txtRicEsami").val();
	var param='';	
	var chkRicerca=document.dati.chkRicerca;
	var controllo='';
	var whereWk=document.getElementById('elencoEsami').contentWindow.document.EXTERN.WHERE_WK.value;
	//alert(chkRicerca.length);
	//alert(document.getElementById('elencoEsami').contentWindow.document.EXTERN.WHERE_WK.value);
	
	for (var i=0;i<chkRicerca.length;i++){
	
		//alert(chkRicerca[i].value + "_"+chkRicerca[i].checked);
	
		if (chkRicerca[i].checked || chkRicerca[i].value=='RIC_DESCR'){
			
			if (testo==''){
			alert(testo);
				if (whereWk=="order by descrizione" || whereWk==''){
					param="order by descrizione desc";
				}else {
					param="order by descrizione";
				} 
			}else{
				param="WHERE descrizione like \'%25"+testo+"%25\'" ;
			}
			
		}else if (chkRicerca[i].checked || chkRicerca[i].value=='RIC_ESA'){
			
			if (testo==''){
				if (whereWk=="order by iden" || whereWk==''){
					param="order by iden desc";
				}else {
					param="order by iden";
				}
			}else{
				param="WHERE iden like \'"+testo+"%25\' order by iden asc";
			}
			
		}else{
		
			param="WHERE iden like \'"+testo+"%25\' or descrizione like \'%25"+testo+"%25\' order by descrizione asc";
		}
	}

	 var src="servletGenerator?KEY_LEGAME=WK_ESAMI_CONFIGURATORE&WHERE_WK="+param;
	 //alert(param);
	//alert(src);
	
	document.getElementById('elencoEsami').src=src;

}

function infoEsame(){

		if (document.getElementById('elencoEsamiTappo').options[document.getElementById('elencoEsamiTappo').options.selectedIndex].value ==''){
			
			alert('Selezionare la riga dell\'esame da visualizzare');
		
		}else{
			
			var divEl = '';
			divEl += '<span id="titPopupRiep">MATERIALI ASSOCIATI</span>';
			divEl += '<SELECT id=infoEsami  style="WIDTH: 100%; HEIGHT: 120px; overflow: scroll;" multiple name=infoEsami STATO_CAMPO="E" dpieagent_iecontroltype="7"></SELECT>';
			divEl += '<span id="footPopup"></span>';
			$("#popup").removeClass("hide");
			$("#popup").html(divEl);
			$("#popup").addClass("popupEsamiRiep");
			
			//	Posiziona il popup
			var hTable = $("body").height();
			var hPopup = $("#popup").height();
			var offset = $("body").offset();
			var spazioLiberoInBasso = offset.top + hTable - event.clientY;
			var posXpopup = 0;
			
			if(spazioLiberoInBasso > hPopup){
				posXpopup = event.clientY;
			}else{
				posXpopup = offset.top + hTable - hPopup - 15;
			}

			$("#popup").css("top",posXpopup);
			$("#popup").css("left",event.clientX+10);
			
			filtroInfoEsame();
			
			$("#popup").show();
			$("#overlay").removeClass("hide");
			$("#overlay").click(function(){$("#popup").hide();$("#overlay").addClass("hide");});
			
		}
}








