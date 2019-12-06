var i=0;

var _filtro_list_tappi='';
var _filtro_list_tappi_scheda='';
var _filtro_list_esami='';
var _filtro_list_esami_tappo='';
var _filtro_list_materiali='';
var _filtro_list_materiali_tappo='';
var idScheda=parent.document.EXTERN.IDEN.value;
var deleteTappi='0';
var deleteEsami='0';

//creo già le variabile da utilizzare nelle funzioni della gestione tappi
var ListEsaTappo=document.getElementById('elencoEsamiTappo');


/************************ CONTROLLO ANTI BATTOLLA ***************************************************************************************/
/*if (idScheda=='2400'||idScheda=='2401'||idScheda=='2402'||idScheda=='2403'||idScheda=='2404'||idScheda=='2406'||idScheda=='2407'||idScheda=='2408'||idScheda=='2409'){
	if (baseUser.LOGIN=='02352'){
		//alert('Utente: Battolla');
		document.getElementById('lblRegistraEsaTappo').parentElement.style.display='none';
	}
}*/
/************************ FINE CONTROLLO ANTI BATTOLLA ***************************************************************************************/

jQuery(document).ready(function() {	

	//assegno di default la wk degli esami. Se volessi vedere prima i profili mettere 'WK_PROFILI_CONFIGURATORE'
	document.getElementById('hTipoWk').value='WK_ESAMI_CONFIGURATORE';

	//controllo l'urgenza ed eventualmente la metto di default a 0
	if (parent.document.getElementById('hUrgenza').value==''){
		parent.document.getElementById('hUrgenza').value='0';
	}
	
	//assegno gli eventi
	$("#txtRicercaTappo").bind('keypress', function(e) {
	        if(e.keyCode==13){ ricercaTappoWk(); }
	});

	$("#txtRicEsami").bind('keypress', function(e) {
	        if(e.keyCode==13){ ricercaEsameWk(); }
	});
	
	$("#txtRicTappo").bind('keyup', function(e) {
			_filtro_list_tappi_scheda.searchListRefresh("upper(DESCRIZIONE) like '%" + document.dati.txtRicTappo.value.toUpperCase() + "%'", "RICERCA_TAPPO_SCHEDA");
	});

	$("#lblOrder").bind('click', function(e) {
	        ricercaTappoWk();
	});
	
	$("#lblRicTappo").bind('click', function(e) {
        	preSalvataggio();
	});

	$("#lblOrderEsami").bind('click', function(e) {
			ricercaEsameWk();
	});

	//assegno l'evento onclick alle due label dell'abilitazione della modifica/cancellazione per i <li> degli esami e dei tappi
	$("#lblCancellaTappi").parent().click( function() {
			abilitaModificaTappo();
	});
	
	$("#lblCancella").parent().click (function() {
			abilitaModificaEsame();
	});
	
	//carico i tappi della scheda
	filtroTappiScheda();
	
	//nascondo due div
	 document.getElementById('divRicEsami').style.display='none';
	 document.getElementById('divEsamiTappo').style.display='none';
	 $('#divInsMat').hide();

	 
	//do le classi ai listbox delle scelte effettuate 
	addClass(document.getElementById('radioAnalisiProfili').parentElement,'radio');
	addClass(document.getElementById('chkRicercaTappo').parentElement,'radio');
	addClass(document.getElementById('chkRicerca').parentElement,'radio');
	
	

	
	//creo due div
	$("body").append('<div id="popup" class="hide"></div>');
	$("body").append('<div id="overlay" class="hide"></div>');
	
	
	//appendo l'iframe nel div di ricerca esame
	var iframe='';
	iframe+='<div id="divElencoEsami"><IFRAME id=elencoEsami width=495 height=340 src="servletGenerator?KEY_LEGAME=WK_ESAMI_CONFIGURATORE&WHERE_WK=where iden like \'E%25\'&ORDER_FIELD_CAMPO=" frameBorder=5 scrolling=yes SRC_ORIGINE="blank.htm"></IFRAME></div>';

	$('#groupRicEsami').append(iframe);

	//appendo l'iframe nel div di ricerca contenitori
	var iframe2='';
	iframe2+='<div id="divWkTappi"><IFRAME id=elencoTappi width=510 height=300 src="servletGenerator?KEY_LEGAME=WK_ELENCO_TAPPI&WHERE_WK=&ORDER_FIELD_CAMPO=" frameBorder=5 scrolling=yes SRC_ORIGINE="blank.htm"></IFRAME></div>';

	$('#groupElencoTappi').append(iframe2);


	//metto l'evento onclick sui radio chkRicerca
	var chk=document.dati.chkRicerca;
	for (var i=0;i<chk.length;i++){

		chk[i].onclick=function (){
			ricercaEsameWk();
		};
	}

	//metto l'evento onclick sui radio chkRicercaTappo
	var chkT=document.dati.chkRicercaTappo;
	for (var i=0;i<chkT.length;i++){

		chkT[i].onclick=function (){
			ricercaTappoWk();
		};
	}
	
	
	//metto l'evento onclick sui radio chkRicerca
	var chk=document.dati.radioAnalisiProfili;
	for (var i=0;i<chk.length;i++){

		chk[i].onclick=function (){
			selezionaWk();
		};
	}
	
	document.dati.radioAnalisiProfili[0].checked=true;
	
	
});


// funzione che inserisce la x per poter cancellare il tappo
function abilitaModificaTappo(){

	var li=document.getElementById('elencoTappiScheda').getElementsByTagName('li');
	
	for (var i=0;i<li.length;i++){

		if (deleteTappi=='0'){

			document.getElementById('lblCancellaTappi').parentElement.className='';
			addClass(document.getElementById('lblCancellaTappi').parentElement,"modificaMinus");
			
			var id=i;
			var html=document.createElement('div');
			html.id=id;
			html.tipo='tappo';
			li[i].appendChild(html);
			jQuery("#"+id).addClass('pulsCancella');
			jQuery("#"+id).attr("title","Cancella");
			jQuery("#"+id).click(function(){ if (confirm('Eliminare l\'associazione contenitore - scheda?')){ eliminaAssTappo(this); }});

			var id2=i +'vis';
			var vis=document.createElement('div');
			vis.id=id2;
			//vis='tappo';
			li[i].appendChild(vis);
			jQuery("#"+id2).addClass('pulsVisualizza');
			jQuery("#"+id2).attr("title","Visualizza esami contenitore");
			jQuery("#"+id2).click(function(){ 
				
				removeClass(document.getElementById('lblCancellaTappi').parentElement,"modificaMinus");
				addClass(document.getElementById('lblCancellaTappi').parentElement,"modificaPlus");
				visualizzaTappo(this);
			});
			
		}else{
 
			removeClass(document.getElementById('lblCancellaTappi').parentElement,"modificaMinus");
			addClass(document.getElementById('lblCancellaTappi').parentElement,"modificaPlus");
			li[i].removeChild(li[i].childNodes[2]);
			li[i].removeChild(li[i].childNodes[1]);
		}
	}
	
	if(deleteTappi=='0'){deleteTappi='1';}else{deleteTappi='0';}
}


// funzione che inserisce la x per poter cancellare l'esame
function abilitaModificaEsame(){
	
	var liEsami=document.getElementById('elencoEsamiTappo').getElementsByTagName('li');
	
	for (var x=0;x<liEsami.length;x++){

		if (deleteEsami=='0'){
			
			removeClass(document.getElementById('lblCancella').parentElement,"modificaEsamiPlus");
			addClass(document.getElementById('lblCancella').parentElement,"modificaEsamiMinus");
			
			var id=x + 'del';
			var html=document.createElement('div');
			html.id=id;
			html.tipo='esami';
			liEsami[x].appendChild(html);
			jQuery("#"+id).addClass('pulsCancella');
			jQuery("#"+id).attr("title","Cancella");
			jQuery("#"+id).click(function(){ eliminaEsaTappo(this); });
			
		}else{

			removeClass(document.getElementById('lblCancella').parentElement,"modificaEsamiMinus");
			addClass(document.getElementById('lblCancella').parentElement,"modificaEsamiPlus");
			liEsami[x].removeChild(liEsami[x].childNodes[1]);
		}
	}
	
	if(deleteEsami=='0'){deleteEsami='1';}else{deleteEsami='0';}
}


//funzione che richiama una function sul db per allineare la descr dell'esame a quella presente sul LABORATORIO
function allineaDescr(descrizioneWhale){

	sql = "{call ? := RADSQL.IMPORTA_ESA_LABO('" + iden + ", "+descr+","+tipo+"',"+descrizioneWhale+")}";
	
	dwr.engine.setAsync(false);
	toolKitDB.executeFunctionData(sql, callRisp);
	dwr.engine.setAsync(true);
	
	function callRisp(resp){
		//alert(resp);
		opener.parent._filtro_list_esami.searchListRefresh();
	}
}


function callEsami(resp){

	var esame=resp.substring(2);
	var res=resp.substring(0,2);

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


function cancellaTappo(idenScheda,idenTappo){

	var sql='';
	sql = "{call ? := RADSQL.CLS_CANCELLA_TAPPO(" + idenScheda + ","+idenTappo+")}";

	dwr.engine.setAsync(false);
	toolKitDB.executeFunctionData(sql, callTappo);
	dwr.engine.setAsync(true);

	function callTappo(resp){
		//alert(resp);
	}
}


//function che fa scomparire i div di scelta e associazione degli esami al tappo
function chiudiDettaglio(){

	if (jQuery("#elencoEsamiTappo li").length<1){
		if(confirm('Non è stato aggiunto alcun esame. Il tappo non verrà associato alla scheda.\n\nContinuare?')){
			
		}else{
			return;
		}
	}
	
	$('#divEsamiTappo').hide(300);
	$('#divRicEsami').hide(300);
	
	if(jQuery("#lblCancella").parent().hasClass("modificaEsamiMinus")){
		
		jQuery("#lblCancella").parent().removeClass("modificaEsamiMinus");
		jQuery("#lblCancella").parent().addClass("modificaEsamiPlus");
		deleteEsami = '0';
		
		var liEsami=document.getElementById('elencoEsamiTappo').getElementsByTagName('li');
		
		for (var x=0;x<liEsami.length;x++){
			liEsami[x].removeChild(liEsami[x].childNodes[1]);
		}
	}
	
	removeClass(document.getElementById('divElencoTappi'),'opacity');
	removeClass(document.getElementById('divTappiScheda'),'opacity');
	//document.getElementById('elencoTappi').style.display='block';
	//document.getElementById('elencoTappiScheda').style.display='block';
	document.getElementById('lblElencoEsamiTappo').innerText= 'Dettaglio degli esami del Tappo';
	document.getElementById('txtRicEsami').value='';
	filtroTappiScheda();
	
}


//funzione che elimina l'associazionedel tappo dalla scheda
function eliminaAssTappo(oggetto){

	var elencoDescr="";
	var idenScheda=parent.document.EXTERN.IDEN.value;
	
	var tappo='';
	
	if (oggetto.nodeName.toUpperCase()=='LI'){
		tappo=oggetto;
	}else{
		tappo=oggetto.parentElement;
	}

//	if (parent.document.EXTERN.ATTIVO.value == 'S'){
//		alert('Attenzione! Non è possibile modificare una scheda attiva');
//		return;
//	}
	

/************************ CONTROLLO ANTI BATTOLLA ***************************************************************************************/
/*if (idScheda=='2400'||idScheda=='2401'||idScheda=='2402'||idScheda=='2403'||idScheda=='2404'||idScheda=='2406'||idScheda=='2407'||idScheda=='2408'||idScheda=='2409'){
	//alert('entro');
	if (baseUser.LOGIN=='02352'){
		//alert('Utente: Battolla');
		return;
	}
}*/
/************************ FINE CONTROLLO ANTI BATTOLLA ***************************************************************************************/
	

	document.getElementById('elencoTappiScheda').removeChild(tappo);
	cancellaTappo(idenScheda,tappo.value);
	
	//controllo se il contenitore eliminato è l'ultimo del listbox, se lo è valorizzo elencoIden con 0 in modo che non la wk si carichi correttamente
	if (elencoIden !=''){
		var src="servletGenerator?KEY_LEGAME=WK_ELENCO_TAPPI&WHERE_WK= where UPPER(DESCR) not in ('"+elencoDescr+"')&ORDER_FIELD_CAMPO=";
	}else{
		src="servletGenerator?KEY_LEGAME=WK_ELENCO_TAPPI&WHERE_WK=&ORDER_FIELD_CAMPO=";
	}

	//alert(src);
	//ricarico la worklist con la nuova where condition
	var iframe='';
	iframe+='<div id="divWkTappi" ><IFRAME id=elencoTappi height=300 src="'+src+'" frameBorder=0 width=500 scrolling=yes SRC_ORIGINE="blank.htm"></IFRAME></div>';

	$("#elencoTappi").replaceWith(iframe);
}



// funzione che elimina l'esame dal tappo
function eliminaEsaTappo(oggetto){

	// if (parent.document.EXTERN.ATTIVO.value == 'S'){
		// alert('Attenzione! Non è possibile modificare una scheda attiva');
		// return;
	// }
	

	var elencoDescr="";
	var idenScheda=parent.document.EXTERN.IDEN.value;
	
	var esame='';
	
	if (oggetto.nodeName.toUpperCase()=='LI'){
		esame=oggetto;
	}else{
		esame=oggetto.parentElement;
	}

	if (!confirm('Eliminare dal contenitore l\'esame \n\n '+esame.innerText.toUpperCase()+' ?')){ return;}

	
/************************ CONTROLLO ANTI BATTOLLA ***************************************************************************************/
/*if (idScheda=='2400'||idScheda=='2401'||idScheda=='2402'||idScheda=='2403'||idScheda=='2404'||idScheda=='2406'||idScheda=='2407'||idScheda=='2408'||idScheda=='2409'){
	if (baseUser.LOGIN=='02352'){
		//alert('Utente: Battolla');
		return;
	}
}*/
/************************ FINE CONTROLLO ANTI BATTOLLA ***************************************************************************************/
	
	
	var elencoIdenEsa='';
	var elencoIdenProf='';
	var cont=document.getElementById('hContenitore').value;
	var keyLegame=document.getElementById('hTipoWk').value;
	var param='';
	
	
	/*deleteEsami='1';
	abilitaModificaEsame();*/
	
	document.getElementById('elencoEsamiTappo').removeChild(esame);
	
	//valorizzo i campi nascosti degli iden associati alla scheda
	document.getElementById('hElencoIdenEsa').value=elencoIdenEsa;
	document.getElementById('hElencoIdenProf').value=elencoIdenProf;

	
	if (keyLegame == ''){keyLegame = 'WK_ESAMI_CONFIGURATORE';}
	
	if (keyLegame == 'WK_ESAMI_CONFIGURATORE'){
	
		if (elencoIdenEsa==''){
			param="where 1=1";
		}else{
			param="where iden not in ("+elencoIdenEsa+")";
		}
	
	}else if (keyLegame == 'WK_PROFILI_CONFIGURATORE'){
	
		if (elencoIdenProf==''){
			//istruzione nel caso l'elenco degli iden dei profili rimasti sia zero
		}else{
			param="where iden not in ("+elencoIdenProf+")";
		}
	
	}

	var src="servletGenerator?KEY_LEGAME="+keyLegame+"&WHERE_WK="+param+"&ORDER_FIELD_CAMPO=";     //where iden not in ("+elencoIden+") and contenitore='"+cont+
	//alert(src);
	

	//ricarico la worklist con la nuova where condition
	var iframe='';
	iframe+='<div id="divElencoEsami" ><IFRAME id=elencoEsami height=340 src="'+src+'" frameBorder=0 width=500 scrolling=yes SRC_ORIGINE="blank.htm"></IFRAME></div>';

	$("#elencoEsami").replaceWith(iframe);
}


//carica l'elenco dei tappi
function filtroElencoTappi(){
	
	//alert(parent.document.getElementById('hUrgenza').value);
	//var urgenza=parent.document.getElementById('hUrgenza').value;

	_filtro_list_tappi = new FILTRO_QUERY('elencoTappi', 'txtRicercaTappo');
	_filtro_list_tappi.setEnableWait('N');
	_filtro_list_tappi.setDistinctQuery('S');
	_filtro_list_tappi.setValueFieldQuery('IDEN');
	_filtro_list_tappi.setDescrFieldQuery('DESCRIZIONE');
	_filtro_list_tappi.setFromFieldQuery('RADSQL.VIEW_LABO_TAPPI');

	_filtro_list_tappi.searchListRefresh();
}


//carica gli esami del tappo
function filtroEsamiTappo(idenTappo){

 	var whereCond='';
	var keyLegame=document.getElementById('hTipoWk').value;
	var whereWk='';
	var idenScheda=parent.document.EXTERN.IDEN.value;
	
	if (typeof idenTappo != 'undefined'){
	
		//alert('iden del tappo: '+idenTappo);
		
		if (document.EXTERN.INSERIMENTO.value=='S'){
		
			whereCond+=/*'iden_pro=\'0\' and*/ 'iden_tappo=\''+idenTappo+'\'';
		
		}else{
	
			if (document.EXTERN.MODIFICA.value=='S'){

				whereCond+=' iden_tappo='+idenTappo+' and iden_scheda='+idenScheda;
			
			}else{
			
				whereCond='1=0';
			}
		}
		
	}else{
		
		whereCond+='1=0';
	}
	
	//alert('select distinct cod_Esa, descrizione_listbox from radsql.view_labo_esami where '+whereCond);

		if (typeof _filtro_list_esami_tappo == 'string'){

			
			_filtro_list_esami_tappo = new FILTRO_QUERY('elencoEsamiTappo', null);
			_filtro_list_esami_tappo.setEnableWait('N');
			//_filtro_list_esami_tappo.setDistinctQuery('S');
			_filtro_list_esami_tappo.setValueFieldQuery('COD_ESA');
			_filtro_list_esami_tappo.setDescrFieldQuery('DESCRIZIONE_LISTBOX');
			_filtro_list_esami_tappo.setFromFieldQuery('RADSQL.VIEW_LABO_ESAMI VLE');
			_filtro_list_esami_tappo.setWhereBaseQuery(whereCond);
			_filtro_list_esami_tappo.setTypesElement("UL","LI");
			_filtro_list_esami_tappo._obj.parentNode.style.overflowY = 'scroll';
			_filtro_list_esami_tappo._obj.parentNode.style.position = 'relative';
			
			_filtro_list_esami_tappo.searchListRefresh(); 	
		
		}else if (typeof _filtro_list_esami_tappo == 'object'){

			_filtro_list_esami_tappo.setWhereBaseQuery(whereCond);
			_filtro_list_esami_tappo.searchListRefresh(); 
		}
		
		if (keyLegame==''){
			
			keyLegame='WK_ESAMI_CONFIGURATORE';
		
		}else if (keyLegame=='WK_ESAMI_CONFIGURATORE'){
			
			whereWk="";
		
		}else{
			
			whereWk='';
		}

	if (typeof idenTappo == undefined){
		var src="servletGenerator?KEY_LEGAME="+keyLegame+"&WHERE_WK="+whereWk+"&ORDER_FIELD_CAMPO="; //sistemare con where condition corretta
	}else{
		src="servletGenerator?KEY_LEGAME="+keyLegame+"&WHERE_WK="+whereWk+"&ORDER_FIELD_CAMPO=";
	}
	//alert('src: '+src);
	
	//ricarico la worklist con la nuova where condition
	var iframe='';
	iframe+='<div id="divElencoEsami" ><IFRAME id=elencoEsami height=340 src="'+src+'" frameBorder=0 width=500 scrolling=yes SRC_ORIGINE="blank.htm"></IFRAME></div>';

	$("#elencoEsami").replaceWith(iframe);

	//reinizializzo il sortable per il div con i tappi e per quello degli esami
	sortableLi();
}


//carica i tappi della scheda
function filtroTappiScheda(){
	
	var scheda=parent.document.EXTERN.IDEN.value;
	var urgenza= parent.document.getElementById('hUrgenza').value;	
	var whereCond='';
	// alert(parent.document.EXTERN.IDEN.value);

	if (scheda!=''){   
	
		 whereCond='1=1 and IDEN_SCHEDA='+scheda+' and grado_urgenza='+urgenza;
		
	 }else{
	
		 whereCond='1=1';	
	 }  
	
	// alert('select distinct to_char(IDEN||\'@\'||IDEN_CONTENITORE), descrizione from RADSQL.VIEW_LABO_TAPPI where '+whereCond+' order by descrizione asc')

	if (typeof _filtro_list_tappi_scheda == 'string'){

		//alert('select distinct cod_Esa, to_char(ID_ANALISI ||\' - \'|| DESCR) from radsql.view_labo_esami where '+whereCond);
		_filtro_list_tappi_scheda = new FILTRO_QUERY('elencoTappiScheda', null);
		_filtro_list_tappi_scheda.setEnableWait('N');
		_filtro_list_tappi_scheda.setValueFieldQuery('IDEN');
		_filtro_list_tappi_scheda.setDescrFieldQuery('descr');
		_filtro_list_tappi_scheda.setFromFieldQuery('RADSQL.VIEW_LABO_TAPPI_SCHEDA');
		_filtro_list_tappi_scheda.setWhereBaseQuery(whereCond);
		_filtro_list_tappi_scheda.setTypesElement("UL","LI");
		_filtro_list_tappi_scheda._obj.parentNode.style.height='295px';
		_filtro_list_tappi_scheda._obj.parentNode.style.position = 'relative';
		//_filtro_list_tappi_scheda._obj.parentNode.style.overflowY = 'scroll';

	
	}else if (typeof _filtro_list_tappi_scheda == 'object'){
		_filtro_list_tappi_scheda.setWhereBaseQuery(whereCond); 	
	}
	
	if (parent.document.EXTERN.IDEN.value!=''){
		_filtro_list_tappi_scheda.searchListRefresh();
	}
	
	//reinizializzo il sortable per il div con i tappi e per quello degli esami
	sortableLi();
	
	//aggiungo l'evento sul doppio click per visualizzare il dettaglio del tappo
	jQuery("#elencoTappiScheda li").dblclick(function(){
		visualizzaTappo(this);
	});
}


//non dovrebbe più servire, ma non si sa mai
function importaEsame(){

	window.open('servletGenerator?KEY_LEGAME=WK_IMPORTA_ESA_FILTRO','importaEsami','resizable = yes,status = yes, scrollbars = no');

}

//funzione che dalla pagina di importazione degli esami di laboratorio si prende iden, descrizione dell'esame e se è un profilo o un esame dalla wk e lancia la procedura
function importaEsameDaLabo(iden,descr,tipo){

	sql = "{call ? := RADSQL.IMPORTA_ESA_LABO(" + iden + ", '"+descr+"','"+tipo+"','')}";
		
	dwr.engine.setAsync(false);
	toolKitDB.executeFunctionData(sql, callEsami);
	dwr.engine.setAsync(true);
}


function infoEsame(){

	if (parent.document.getElementById('hTipo').value!='B'){
		return;
	}
	
	var divEl = '';
	divEl += '<span id="titPopupRiep">ESAMI ASSOCIATI</span>';
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


//funzione che cicla il listbox dei tappi della scheda e valorizza il campo nascosto 
function preSalvataggio(){

	var ListTappi = document.getElementById('elencoTappiScheda').getElementsByTagName("li");
	var elencoTappi='';

	for (var i=0;i<ListTappi.length;i++){
	
		if (elencoTappi!=''){elencoTappi+=',';}
		
		elencoTappi+=ListTappi[i].value;
	}
	
	parent.$("#hTappi").val(elencoTappi);
	
	sql = "{call ? := RADSQL.CLS_ORDINA_TAPPI('"+elencoTappi+"',"+parent.document.EXTERN.IDEN.value+")}";

	dwr.engine.setAsync(false);
	toolKitDB.executeFunctionData(sql, callOrder);
	dwr.engine.setAsync(true);
	
	function callOrder(resp){
		//alert(resp);
		if(resp.substring(0,2) == 'KO'){
			alert('Errore nel salvataggio dell\'ordine dei contenitori! Quest\'ultimi non saranno visualizzati nell\'ordine corretto');
		}else{
			//tutto ok
			//alert('tutto ok: '+resp);
		}
	}
	//alert(parent.$("#hTappi"));
}


//funzione che 'registra' gli esami del tappo
function registraEsaTappo() {

	/*if (parent.document.EXTERN.ATTIVO.value == 'S'){
		alert('Attenzione! Non è possibile modificare una scheda attiva');
		chiudiDettaglio();
		return;
	}*/
	
	//alert('registrazione Esami del Tappo');
	var listaEsami='';
	var listaDescr='';
	var idenTappo=document.getElementById('hContenitore').value;    if (idenTappo==''){idenTappo = null;}
	var idenScheda=parent.document.EXTERN.IDEN.value;
	var nomeTappo=document.getElementById('lblElencoEsamiTappo').innerText;
	var classe=document.getElementById('hClasse').value;
	var urgenza = parent.document.getElementById('hUrgenza').value;
	var metodica=parent.document.getElementById('hTipo').value;
	var uteIns=parent.document.EXTERN.USER_ID.value;
	var ListEsaTappo = document.getElementById('elencoEsamiTappo').getElementsByTagName("li");
	var ListTappi = jQuery("#elencoTappiScheda [tipo='tappi']");
	
	if (ListEsaTappo.length<1){
		alert('Attenzione! Scegliere almeno un esame');
		return;
	}
	
	//se il tappo c'è già lo rimuovo per farne un altro
	for (var i = ListTappi.length - 1; i>=0; i--) {
		
		if (ListTappi[i].value==document.getElementById('hControllo').value) {	
			document.getElementById('elencoTappiScheda').removeChild(ListTappi[i]);
			var splitTappo=document.getElementById('hControllo').value;
			//alert( splitTappo[0]);
			cancellaTappo(idenScheda, splitTappo); 
		}
	}
	
	//Listbox.options[Listbox.options.length]=new Option(text, value );
	var html = document.createElement("li");
	html.setAttribute("value","0"); ///da cambiare con il valore del tappo che sto creando
	html.tipo = 'tappi';
	html.innerHTML = nomeTappo;
	//alert(html);
	document.getElementById('elencoTappiScheda').appendChild(html);
	
	for(var i=0;i<ListEsaTappo.length;i++){
	
		if (listaEsami!=''){listaEsami+=',';}
		if (listaDescr!=''){listaDescr+=',';}
		
		var split=ListEsaTappo[i].innerText.split(' - ');
		
		listaEsami+=ListEsaTappo[i].getAttribute("value"); //da controllare assolutamente...deve essere analisidest

		if (jQuery.trim(split[1]) == 'undefined'){
			listaDescr+='';
		}else{
			listaDescr+=jQuery.trim(split[1]);		
		}
		//alert('split descr: '+split[1]+'\ntrim: '+jQuery.trim(split[1]));
	}

	//riporto la label alla descrizione iniziale
	document.getElementById('lblElencoEsamiTappo').innerText= 'Dettaglio degli esami del Tappo';

	var rep=listaDescr.replace(/'/gi,"''");
	listaDescr=rep;
	rep=nomeTappo.replace(/'/gi,"''");
	nomeTappo=rep;
	
	var debug='DEBUG:';
		debug+='\n LISTA ESAMI: '+listaEsami;
		debug+='\n LISTA DESCR: '+listaDescr;
		debug+='\n NOME DEL TAPPO: '+nomeTappo;
		debug+='\n URGENZA: '+urgenza;
		debug+='\n IDEN SCHEDA: '+idenScheda;
		debug+='\n METODICA: '+metodica;
		debug+='\n UTENTE INSERIMENTO: '+uteIns;
		debug+='\n IDEN_TAPPO: '+idenTappo;
	//alert(debug);
	//return;
	
	var sql = "{call ? := RADSQL.CLS_SALVA_ESAMI('"+listaEsami+"', '"+listaDescr+"','"+nomeTappo+"','"+classe+"', '"+urgenza+"',"+idenScheda+",'"+metodica+"',"+uteIns+","+idenTappo+")}";
	
	//salvo il tappo su database con iden_pro = 0 in modo che possa eventualmente cancellarlo
	dwr.engine.setAsync(false);
	toolKitDB.executeFunctionData(sql, callIdenTappo);
	dwr.engine.setAsync(true);
	
	function callIdenTappo(idenTappo){
		
		//alert('Iden tappo salvato '+nomeTappo+': '+idenTappo);
		chiudiDettaglio();
		
		for(var i=0;i<ListTappi.length;i++){
		
			//alert('ListTappi[i].text: '+ListTappi[i].text);
			if (ListTappi[i].text==nomeTappo.replace(/''/gi,"'")){
				ListTappi[i].value=idenTappo;
			}
		}
	}
}


//funzione che ricarica e ricerca all'interno della wk dell'elenco degli esami
function ricercaEsameWk(){

	$("#txtRicEsami").val($("#txtRicEsami").val().toUpperCase());
	var testo=$("#txtRicEsami").val();
	testo=testo.replace(/%/gi,"%25");
	var param='';	
	var chkRicerca=document.dati.chkRicerca;
	var controllo='';
	var cont=document.getElementById('hContenitore').value;
	var whereWk=document.getElementById('elencoEsami').contentWindow.document.EXTERN.WHERE_WK.value;
	var orderField=document.getElementById('elencoEsami').contentWindow.document.EXTERN.ORDER_FIELD_CAMPO;
	var order='';
	var elencoIdenEsa=document.getElementById('hElencoIdenEsa').value;
	var elencoIdenProf=document.getElementById('hElencoIdenProf').value;
	var keyLegame=document.getElementById('hTipoWk').value;
	
	//alert(chkRicerca.length);
	//alert(document.getElementById('elencoEsami').contentWindow.document.EXTERN.WHERE_WK.value);
	
	for (var i=0;i<chkRicerca.length;i++){
	
		//alert('value and checked: '+chkRicerca[i].value + "_"+chkRicerca[i].checked);
		
		//caso in cui è selezionato il radio della descr dell'esame
		if (chkRicerca[i].checked && chkRicerca[i].value=='RIC_DESCR'){
			
			//setto l'ordine della wk
			if (typeof orderField !='undefined' || orderField.value != '' ){
					
				if (orderField.value == 'DESCR ASC'){
				
					order='DESCR DESC';
				
				}else if (orderField.value == 'DESCR DESC'){
				
					order='DESCR ASC';
					
				}else{
				
					order='DESCR ASC';
				
				}	
			}else{
			
				order='DESCR ASC';
				
			}
			
			
			//setto la where della wk
			
			if (keyLegame=='WK_ESAMI_CONFIGURATORE' || keyLegame == ''){
			
				if (testo==''){
				
					if (elencoIdenEsa != ''){
						param="where iden not in ("+elencoIdenEsa+")";
					}else{
						param="where 1=1";
					}
				}else{
					
					if (elencoIdenEsa != ''){
						param="where descr like \'%25"+testo+"%25\' and iden not in ("+elencoIdenEsa+")";
					}else{
						param="where descr like \'%25"+testo+"%25\'";
					}
				}
			
			}else if(keyLegame=='WK_PROFILI_CONFIGURATORE'){
			
							
				if (testo==''){
					
					if (elencoIdenProf != ''){
						param="where iden not in ("+elencoIdenProf+")";
					}
					
				}else{
					
					if (elencoIdenProf != ''){
						param="where descr like \'%25"+testo+"%25\' and iden not in ("+elencoIdenProf+")";
					}else{
						param="where descr like \'%25"+testo+"%25\'";
					}
				}
			}
			
		
		//caso in cui è selezionato il radio dell'id dell'esame
		}else if (chkRicerca[i].checked && chkRicerca[i].value=='RIC_ESA'){
			
			//setto l'ordine della wk
			if (typeof orderField !='undefined' || orderField.value != '' ){
					
				if (orderField.value == 'IDEN ASC'){
				
					order='IDEN DESC';
				
				}else if (orderField.value == 'IDEN DESC'){

					order='IDEN ASC';
					
				}else{
					
					orderField='';
					order='IDEN ASC';
				}	
			}
			
			//setto la where della wk
			if (keyLegame=='WK_ESAMI_CONFIGURATORE' || keyLegame == ''){
			
				if (testo==''){
				
					if (elencoIdenEsa != ''){
						param="where iden not in ("+elencoIdenEsa+")";
					}else{
						param="where 1=1";
					}
				}else{
					
					if (elencoIdenEsa != ''){
						param="where iden like \'%25"+testo+"%25\' and iden not in ("+elencoIdenEsa+")";
					}else{
						param="where iden like \'%25"+testo+"%25\'";
					}
				}
			
			}else if(keyLegame=='WK_PROFILI_CONFIGURATORE'){
			
							
				if (testo==''){
				
					if (elencoIdenProf != ''){
						param="where iden not in ("+elencoIdenProf+")";
					}
					
				}else{
					
					if (elencoIdenProf != ''){
						param="where iden like \'%25"+testo+"%25\' and iden not in ("+elencoIdenProf+")";
					}else{
						param="where iden like \'%25"+testo+"%25\'";
					}
				}
			}
		}else{
			
			if(keyLegame=='WK_ESAMI_CONFIGURATORE'){
			
				if (testo!=''){
					param="where descr like \'%25"+testo+"%25\'";

				}else{
					param="where 1=1";
				}
			
			}else if(keyLegame=='WK_PROFILI_CONFIGURATORE'){
			
				if (testo!=''){
					param="where descr like \'%25"+testo+"%25\'";

				}else{
					param="";
				}
			
			}
				

			if (order==''){
				order='DESCR ASC';
			}
			if (!chkRicerca[0].checked && !chkRicerca[1].checked){	
				chkRicerca[0].checked='true';
				chkRicerca[0].value=='RIC_DESCR';
			}
		
		}
	}

	var src="servletGenerator?KEY_LEGAME="+keyLegame+"&WHERE_WK="+param+"&ORDER_FIELD_CAMPO="+order;
	//alert('param: '+param+'\Nsrc: '+src);-
	
	document.getElementById('elencoEsami').src=src;
}



//funzione che ricarica e ricerca all'interno della wk dei contenitori di laboratorio. Usa la stessa struttura di quella degli esami
function ricercaTappoWk(){
	
	document.getElementById('txtRicercaTappo').value=document.getElementById('txtRicercaTappo').value.toUpperCase();
	var testo=document.getElementById('txtRicercaTappo').value;	
	testo=testo.replace(/%/gi,"%25");
	var param='';	
	var chkRicercaTappo=document.dati.chkRicercaTappo;
	var controllo='';
	var cont=document.getElementById('hContenitore').value;
	var whereWk=document.getElementById('elencoTappi').contentWindow.document.EXTERN.WHERE_WK.value;
	var orderField=document.getElementById('elencoTappi').contentWindow.document.EXTERN.ORDER_FIELD_CAMPO;
	var order='';
	// alert('whereWk: '+whereWk+'\nchkRicercaTappo.length: '+chkRicercaTappo.length);
	// alert('testo: '+testo);
	
	for (var i=0;i<chkRicercaTappo.length;i++){
	
		//alert(chkRicercaTappo[i].value + "_"+chkRicercaTappo[i].checked);
	
		//caso in cui è selezionato il radio della descr del tappo
		if (chkRicercaTappo[i].checked && chkRicercaTappo[i].value=='RIC_DESCR'){
			
			//setto l'ordine della wk
			if (typeof orderField !='undefined' || orderField.value != '' ){
					
				if (orderField.value == 'DESCRIZIONE ASC'){
				
					order='DESCRIZIONE DESC';
				
				}else if (orderField.value == 'DESCRIZIONE DESC'){
				
					order='DESCRIZIONE ASC';
					
				}else{
					
					order='DESCRIZIONE ASC';
				
				}	
			}
			
			//setto la where della wk
			if (testo==''){
			
				param='';
				
			}else{
			
				param="where DESCRIZIONE like \'%25"+testo+"%25\'";

			}
		
		//caso in cui è selezionato il radio dell'id del tappo
		}else if (chkRicercaTappo[i].checked && chkRicercaTappo[i].value=='RIC_ESA'){
			
			//setto l'ordine della wk
			if (typeof orderField !='undefined' || orderField.value != '' ){
					
				if (orderField.value == 'IDEN ASC'){
					
					order='IDEN DESC';
				
				}else if (orderField.value == 'IDEN DESC'){
					
					order='IDEN ASC';
					
				}else{
					
					order='IDEN ASC';
				}	
			}
			
			//setto la where della wk
			if (testo==''){
			
				param='';
				
			}else{
				
				param="where iden like \'"+testo+"%25\' ";
				
			}
			
		}else{
			
			if (testo!=''){
				param="where DESCRIZIONE like \'%25"+testo+"%25\'";
			}
		}
	}

	var src="servletGenerator?KEY_LEGAME=WK_ELENCO_TAPPI&WHERE_WK= "+param+"&ORDER_FIELD_CAMPO="+order;

	document.getElementById('elencoTappi').src=src;
}


function ricercaTappo(){

	$("#txtRicercaTappo").val($("#txtRicercaTappo").val().toUpperCase());
	var testo=$("#txtRicercaTappo").val();	
	testo=testo.replace(/%/gi,"%25");
	var param='';	
	var chkRicercaTappo=document.dati.chkRicercaTappo;
	var controllo='';

	for (var i=0;i<chkRicercaTappo.length;i++){
	
		//caso in cui è selezionato il radio della descr del tappo
		if (chkRicercaTappo[i].checked && chkRicercaTappo[i].value=='RIC_DESCR'){

			//setto la where della wk
			if (testo==''){
			
				param='';
				
			}else{
			
				param="where descr like \'%25"+testo+"%25\'";

			}
		
		//caso in cui è selezionato il radio dell'id del tappo
		}else if (chkRicercaTappo[i].checked && chkRicercaTappo[i].value=='RIC_ESA'){
			
			//setto la where della wk
			if (testo==''){
			
				param='';
				
			}else{
				
				param="iden like \'"+testo+"%\' ";
				
			}
			
		}else{
			
			if (testo!=''){
				param="descrizione like \'%"+testo+"%\'";
			}
		}
	}

	//ricarico il listbox con il filtro corretto
	_filtro_list_tappi.searchListRefresh(param, "RICERCA_TAPPO_SCHEDA");
}


function selezionaWk(){
	
	var radio=document.getElementsByName('radioAnalisiProfili');
	var cont='';
	var keyLegame='';
	var elencoIdenEsa=document.getElementById('hElencoIdenEsa').value;
	var elencoIdenProf=document.getElementById('hElencoIdenProf').value;
	
	for (var i=0;i<radio.length;i++){
	
		if (radio[i].checked && radio[i].value=='E'){

			keyLegame="WK_ESAMI_CONFIGURATORE";
			cont="where 1=1";
			
			if (elencoIdenEsa !=''){
				cont+=" and iden not in ("+elencoIdenEsa+")";
			}
		
		}else if (radio[i].checked && radio[i].value=='P'){
		
			keyLegame="WK_PROFILI_CONFIGURATORE";
			
			if (elencoIdenProf !=''){
				cont+="where iden not in ("+elencoIdenProf+")";
			}

		}
		
		document.getElementById('hTipoWk').value=keyLegame;
	
		var src="servletGenerator?KEY_LEGAME="+keyLegame+"&WHERE_WK="+cont+"&ORDER_FIELD_CAMPO=";
		//alert(src);
		document.getElementById('elencoEsami').src=src;	
		
	}
}


//inizializzo le parti da ordinare con il plugin
function sortableLi(){
	
	$("#elencoTappiScheda").sortable("destroy");
	$("#elencoTappiScheda").sortable();
	$("#elencoTappiScheda").disableSelection();
	$("#elencoEsamiTappo").sortable("destroy");
	$("#elencoEsamiTappo").sortable();
	$("#elencoEsamiTappo").disableSelection();
	
}


//function che apre i div del dettaglio degli esami relativi al tappo. Se obj non glielo passo lui prende la option selezionata nell'elenco dell'anagrafica dei tappi, altrimenti gli si passa la option selezionata 
//nell'elenco dei tappi associati alla scheda
function visualizzaTappo(oggetto){

	var obj='';
	
	if (oggetto.nodeName.toUpperCase()=='LI'){
		obj=oggetto;
	}else{
		obj=oggetto.parentElement;
	}

	var idTappo='';
	var sql='';
	var nomeTappo='';
	
	//mostro il dettaglio dei tappi
	$('#divEsamiTappo').show(300);
	$('#divRicEsami').show(300);
	
	//opacizzo div dei tappi e nascondo il listbox (in IE6 non si opacizza)
	addClass(document.getElementById('divElencoTappi'),'opacity');
	addClass(document.getElementById('divTappiScheda'),'opacity');

	if (obj.innerText==''){
		nomeTappo=document.getElementById('hDescrContenitore').value;
	}else{
		nomeTappo=obj.innerText;
	}
	
	document.getElementById('lblElencoEsamiTappo').innerText=nomeTappo;
		
	if (typeof obj == 'undefined'){

		cont=document.getElementById('hContenitore').value;
	
	}else{

		//alert('idTappo: '+idTappo); 
		idTappo=obj.value;
		document.getElementById('hControllo').value=idTappo;
		document.getElementById('hContenitore').value=idTappo;
		document.getElementById('hVisualizzazione').value='MOD';
				
		sql = "Select class from radsql.TAB_LABO_TAPPI where iden="+idTappo;
		
		dwr.engine.setAsync(false);
		toolKitDB.getResultData(sql, callRisp);
		dwr.engine.setAsync(true);
		
		function callRisp(resp){	
			
			//alert('resp: '+resp);
			document.getElementById("hClasse").value=resp;
		}
		
		document.getElementById("lblColore").parentElement.className ='';
		addClass(document.getElementById("lblColore").parentElement, document.getElementById("hClasse").value);
		document.getElementById("lblColore").innerText='QUESTO E\' IL COLORE DEL CONTENITORE';
		//alert('className: '+document.getElementById("lblColore").parentElement.className);
	}
	
	deleteTappi='0'; 
	filtroEsamiTappo(obj.value);
}

