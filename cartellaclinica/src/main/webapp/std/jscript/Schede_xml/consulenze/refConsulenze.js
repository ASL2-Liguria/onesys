/*2 array contenenti i caratteri da sostituire prima del salvataggio per evitare che oracle interpreti &<qualcosa> come parametro e non come valore*/
var arRE2replace=new Array(/&nbsp;/g,/&ugrave;/g,/&eacute;/g,/&egrave;/g,/&igrave;/g,/&agrave;/g,/&ograve;/);
var arChar4replace=new Array(' ','ù','é','è','ì','à','ò');
var txtAreaOriginali = new Array();
var strutturaDaIncollare=null;

jQuery(document).ready(function(){


	window.home = '';
	if (top.name=='Home'){
		window.home = top.window;
	}else{
		window.home = opener.top.window;
	}

	window.baseUser = window.home.baseUser;
	window.basePC	= window.home.basePC;

	try{
		jQuery("[name=idTxtStd]").each(function(){
			var target = jQuery(this).attr('idSezione');
			jQuery(this).addClass("classDivTestiStd").click(function(){apriTestiStandard(target);});	
		});
	}catch(e){		
	}

	if(document.EXTERN.idenReferto.value=='-1'){
		try{	
			var date 	= new Date(); 
			var day		= '0' + date.getDate(); day	= day.substring((day.length-2),day.length);
			var month	= '0' + (date.getMonth()+1); month = month.substring((month.length-2),month.length);			
			var year	= date.getFullYear();			

			$('#inizioTrattamento').val(day + '/' + month + '/' + year);}
		catch(e){}
	}

});

function  apriTestiStandard(targetOut){

	var reparto = $('#repartoDest').val();

	var url='servletGenerator?KEY_LEGAME=SCHEDA_TESTI_STD&TARGET='+targetOut+"&PROV=CONSULENZA&FUNZIONE=CONSULENZA_STD&REPARTO="+reparto;

	$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 580,
		'href'		: url,
		'type'		: 'iframe'
	});
}

/* Inserimento Maschera per l'inserimento corretto della data*/
function controlloData(id){
	//document.getElementById("idDataEsecuzione").value = clsDate.str2str(getElementById("idDataEsecuzione").value,'YYYYMMDD','DD/MM/YYYY');
	try {
		if (typeof id!= 'undefined') {	
			var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
			oDateMask.attach(document.getElementById(id));
		}
	}catch(e){
		alert('Applicazione maschera data in errore: '+e.description);
	}
}

/* Inserimento Maschera per l'inserimento corretto dell'ora*/
function controlloOra(){

	$('#idOraEsecuzione').keyup(function() {
		oraControl_onkeyup(document.getElementById('idOraEsecuzione'));
	});
	$('#idOraEsecuzione').blur(function() {
		oraControl_onblur(document.getElementById('idOraEsecuzione'));
	});
}

/* load del body: esegue i vari controlli sulla data e ora, crea gli oggetti per la sezioni e i dati globali(baseuser, baseglobal) */	
function initGlobalObject(){
	try
	{   
		$('#idBody').removeAttr('onbeforeunload');
		setVeloNero('footer');    
		if ($('#infos').html()==''){
			/* Se il div delle info è vuoto, allora lo nascondo e il div delle sezioni lo allargo al 100%*/
			$('#infos').css('display','none');
			$('#sections').css('width','100%');
		}
		caricaClassiTextArea();
		controlloData($('#idDataEsecuzione').attr('id'));
		controlloData($('#inizioTrattamento').attr('id'));
		controlloData($('#fineTrattamento').attr('id'));		
		controlloOra();
		NS_CONSULENZA_CONSENSO.init();		
		setHeight();
		initTinyMCE();	
		//initbaseUser();		

		showSection(0);
		addCaledar($('#idDataEsecuzione'));		
		addCaledar($('#inizioTrattamento'));		
		addCaledar($('#fineTrattamento'));

		storeTextArea();
		durataTrattamento.init();
		durataTrattamento.setEvents();

		if(document.EXTERN.idenReferto.value=='-1' && (document.EXTERN.repartoDest.value=='SSO_SV' || document.EXTERN.repartoDest.value=='SSO_PL' || document.EXTERN.repartoDest.value=='SSO_AL')){
			$('#finoFineRicovero').click().trigger('change');	
		}

		try{ricerca();}catch(e){} //lancio l'eventuale ricerca dei testi std se abilitati nella pagina
//		removeVeloNero('footer');
	}
	catch(e)
	{
		alert("Refertazione Consulenze initGlobalObject - Error: " + e.description);
	}

	//nasconde pulsante utilizzato nella refertazione fisita anestesiologica
	$('#idConsensoAnestesia').hide();
	
	if ($('INPUT[name=radAutorizzazione]').length>0 ) {
		if($('INPUT[name=radAutorizzazione]:checked').val()=='N'){
			$('#durataTrattamento').parent().hide();
		}
}
}

/*function initTinyMCE(){
	try{
		tinyMCE.init({
			mode : "textareas",
			theme : "advanced",
			theme_advanced_buttons1 : "copy,paste,|,bold,italic,underline,strikethrough,|,fontselect,fontsizeselect,|,forecolor,|,backcolor,|,bullist,numlist,|,removeformat,undo,redo",
			theme_advanced_buttons2 : "",
			theme_advanced_buttons3 : "",
			theme_advanced_buttons4 : "",			
			skin : "o2k7",
			skin_variant : "silver"
		});
	}
	catch(e){
		alert("initTinyMCE - Error: " + e.description);
	}
}*/

function initTinyMCE(){
	var arTemp = new Array();
	$('textarea').each(function(i,value){
		arTemp.push($(this).attr('id'));
//		alert(value.attr('id'));		
	})


	try{
		tinyMCE.init({
			mode : "textareas",
			theme : "advanced",
			theme_advanced_buttons1 : "copy,paste,|,bold,italic,underline,strikethrough,|,fontselect,fontsizeselect,|,forecolor,|,backcolor,|,bullist,numlist,|,removeformat,undo,redo,|,pasteStrutcture",
			theme_advanced_buttons2 : "",
			theme_advanced_buttons3 : "",
			theme_advanced_buttons4 : "",
			skin : "o2k7",
			skin_variant : "silver",
			editor_deselector : "Readonly",
			force_br_newlines : true,
			force_p_newlines : false,
			init_instance_callback : function(editor) {
				arTemp = jQuery.grep(arTemp, function(value) {
					return value != editor.id;
				});
				if (arTemp.length==0){
//					rimuovo il velo nero dai bottoni di salvataggio solo dopo il caricamento dell'ultima sezione disponibile
					appendFunctionToButton();
					removeVeloNero('footer'); 
				}
			},

			setup : function(ed) {

				ed.addButton('pasteStrutcture', {
					title : 'Incolla struttura generata',
					image : '../jscripts/tiny_mce/plugins/example/img/example.gif',
					onclick : function() {
						if(strutturaDaIncollare==null){alert('Nessuna struttura generata');return;}
						ed.setContent(ed.getContent() + strutturaDaIncollare);
					}
				});
			}
		});	

		tinyMCE.init({
			mode : "textareas",
			editor_selector : "Readonly",
			theme : "advanced",
			readonly: 1,

			setup : function(ed) {}
		});		
	}
	catch(e){
		alert("initTinyMCE - Error: " + e.description);
	}
}

function registra(firma){

	var argsVariable;
	if (document.frmGestionePagina.readonly.value=='S')
	{
		alert('Consulenza in sola lettura: impossibile registrare e/o salvare nuova versione!')
		return;
	}

	if (typeof $('#finoFineRicovero').attr('id') != 'undefined'){
		if (durataTrattamento.checkObbligatorietaDato()){
			appendFunctionToButton();
			return;
		}
	}

	$( "#idRegistra").unbind( "click" );
	$( "#idFirma").unbind( "click" );
	$( "#idStampa").unbind( "click" );

	if (NS_CONSULENZA_CONSENSO.consensoAttivo){
		var respCheck=NS_CONSULENZA_CONSENSO.checkConsenso();
		if (respCheck!=''){
			$('#idRegistra').click(function() {
				registra("L");
			});
			$('#idFirma').click(function() {
				registra("S");
			});
			return alert(respCheck);
		}else{
			var retFromSave = NS_CONSULENZA_CONSENSO.saveConsenso();
			if (!retFromSave.esito){
				$('#idRegistra').click(function() {
					registra("L");
				});
				$('#idFirma').click(function() {
					registra("S");
				});
				return alert(retFromSave.motivo)
			}
		}
	}

	if (firma=='L')
	{			
		var answer = window.showModalDialog("bolwincheckuser",argsVariable,"dialogWidth:380px; dialogHeight:200px; center:yes");
		if (answer==true)
		{
			// autenticazione corretta
			//setVeloNero('sections');
			setVeloNero('footer');
		}
		else
		{
			// chiudo tutto
			return;
		}

	}
	var iden_visita 	= $('#idenVisita').val();
	var iden_testata 	= $('#idenTes').val();
	if (isNull(document.all.idDataEsecuzione.value)) 
	{
		alert('Errore - Campo data esecuzione non compilato');
		return;
	}
	else
	{
		var dataEsecuzione 	= clsDate.str2str(document.all.idDataEsecuzione.value,'DD/MM/YYYY','YYYYMMDD');
	}

	if (isNull(document.all.idOraEsecuzione.value))
	{
		alert('Errore - Campo ora esecuzione non compilato');
		return;
	}
	else
	{
		var oraEsecuzione 	= document.all.idOraEsecuzione.value;
	}



	/*	Salvataggio Sezioni:
	db: select * from IMAGOWEB.config_menu_reparto where procedura = 'refertaConsulenzeSezione';
	-id: idConsulenzaRef 
	-id: idConsulenzaTer
	-id: idConsulenzaAcc
	 */
	var arIdSection 		= new Array();
	var arLblArea 			= new Array();
	var arRowsArea 			= new Array();
	var arLblSection 		= new Array();
	var arContent2convert 	= new Array();
	var arContentConverted 	= new Array();	

	try
	{
		dwr.engine.setAsync(false);

		/*----------Salvataggio Sezioni - Creazioni array di salvataggio----------*/
		var lista_sezioni = document.getElementsByTagName("textarea");
		for(var i=0;i<lista_sezioni.length;i++){
			if(typeof lista_sezioni[i].attiva!='undefined'){

				arIdSection.push(lista_sezioni[i].id);
				arLblArea.push(lista_sezioni[i].label);			
				arRowsArea.push(lista_sezioni[i].rows);
				arLblSection.push(lista_sezioni[i].sezione);
				var str = tinyMCE.get(lista_sezioni[i].id).getContent();
				arContent2convert.push(togliCaratteriSpeciali(str));
			}
		}

		/*----------Salvataggio Oggetti XML - Creazioni array di salvataggio con all'interno l'xml di creazione degli oggetti----------*/
		$('#sections').find('[name="divXmlObject"]').each(function(){	
			arIdSection.push($(this).find('div').attr("id"));
			arLblArea.push($(this).find('div').attr("sezioneLabel"));			
			arRowsArea.push("0");
			arLblSection.push($(this).find('div').attr("sezioneLabel"));
			arContent2convert.push(NS_SAVE_CONSOLLE_XML.retrieveXml(jQuery(this),jQuery(this).find('div').attr("id")));
		});

		dwrPreparaFirma.convertHtmlToText(arContent2convert, replyConverter);	
		function replyConverter(reply)
		{
			arContentConverted= reply;
			var tipiParametri = new Array();
			var valoriParametri = new Array();	

			tipiParametri.push('NUMBER');
			valoriParametri.push(iden_visita);

			tipiParametri.push('NUMBER');
			valoriParametri.push(baseUser.IDEN_PER);

			tipiParametri.push('VARCHAR');		
			valoriParametri.push(firma);

			tipiParametri.push('VARCHAR');		
			valoriParametri.push(dataEsecuzione);

			tipiParametri.push('VARCHAR');		
			valoriParametri.push(oraEsecuzione);

			tipiParametri.push('VARCHAR');

			var fineRicovero = $('#finoFineRicovero').attr('checked')==true?'S':'N';
			var xml='<PAGINA><CAMPI><CAMPO KEY_CAMPO="DATA_INIZIO_TRATTAMENTO">'+$('#inizioTrattamento').val()+'</CAMPO><CAMPO KEY_CAMPO="DATA_FINE_TRATTAMENTO">'+$('#fineTrattamento').val()+'</CAMPO><CAMPO KEY_CAMPO="FINO_FINE_RICOVERO">'+fineRicovero +'</CAMPO>';

			if ($('INPUT[name=radAutorizzazione]').length>1){
				xml+='<CAMPO KEY_CAMPO="AUTORIZZAZIONE_PRESA_IN_CARICO">'+$('INPUT[name=radAutorizzazione]:checked').val()+'</CAMPO>';	
			}
			xml+='</CAMPI></PAGINA>';
			valoriParametri.push(xml);

			tipiParametri.push('NUMBER');
			valoriParametri.push(iden_testata);
			/* array di varchar -> idSezioni da salvare */
			tipiParametri.push('ARRAY_VALUE_ID_SEZIONE');
			tipiParametri.push('ARRAY_VALUE_LBL_SEZIONE');
			tipiParametri.push('ARRAY_VALUE_ARROWSAREA');
			tipiParametri.push('ARRAY_VALUE_ARROWSLBLAREA');
			/* array di clob -> testo html */
			tipiParametri.push('ARRAY_CLOB_HTML');		
			/* array di clob -> testo piano */
			tipiParametri.push('ARRAY_CLOB_PIANO');						

			/*				alert(tipiParametri);
				alert(valoriParametri);
				alert(arIdSection+' - '+arLblSection+' - '+arRowsArea+' - '+arLblArea);*/
			/*				alert(arContent2convert+' - '+arContentConverted);

alert(0);*/
			dwrPreparaFirma.preparaRefertazione('{call radsql.oe_consulenza.saveRefertazioneConsulenza(?,?,?,?,?,?,?,?,?,?,?,?,?,?)}',tipiParametri,valoriParametri,arIdSection,arLblSection,arRowsArea,arLblArea,arContent2convert,arContentConverted,replyRegistra);
		}	

		function replyRegistra(returnValue)
		{	
			var idenRef;
			var idenRefOld;
			try{
				if (returnValue.split("*")[0]=="KO"){
					alert("Errore: " + returnValue.split("*")[1]);
					return;
				}
				else
				{
					idenRef		= returnValue.split("*")[1].split("-")[0];
					idenRefOld	= returnValue.split("*")[1].split("-")[1];
					if (idenRefOld=='')
						idenRefOld=0;
					if (firma=='N')
					{
						alert('Il referto registrato non verrà inviato al reparto.\n Per inviare procedere con validazione e/o firma digitale.')
					}
				}
				if (firma=='S')
				{	
					if (document.frmGestionePagina.stato.value=='L') 
					{
						confrontaPrimaDellaFirma(arContentConverted);
						document.frmImpostazioniFirma.idenReferto.value=idenRef;
						$('[name="frmImpostazioniFirma"]').append('<input type="hidden" name="idenRefOld" value="'+idenRefOld+'" ></input>');
						if (document.frmImpostazioniFirma.typeFirma.value=='SISS'){
							firma_siss();
						}else{
							firma_lettera();
						}
					}
					else
					{
						document.frmImpostazioniFirma.idenReferto.value=idenRef;
						$('[name="frmImpostazioniFirma"]').append('<input type="hidden" name="idenRefOld" value="'+idenRefOld+'" ></input>');
						if (document.frmImpostazioniFirma.typeFirma.value=='SISS'){
							firma_siss();
						}else{
							firma_lettera();
						}

					}

				}
				else
				{
					refreshConsulenze(idenRef);
				}
			}
			catch(e){alert("replyRegistra - Error: " + e.description);}

		}		
		dwr.engine.setAsync(true);
	}
	catch(e){
		alert("registra - Error: " + e.description)
	}


}

function firma_lettera(){

	if (typeof(document.EXTERN.tipo) && document.EXTERN.tipo.value=='presaInCarico'){
		document.frmImpostazioniFirma.typeProcedure.value=document.EXTERN.tipo.value;
	}

	myForm = document.frmImpostazioniFirma;

	finestra = window.open("","finestra","fullscreen=yes scrollbars=no");
	myForm.target='finestra';
	if (configurazioneMultipla()){
		$('[name="frmImpostazioniFirma"]').append('<input type="hidden" name="repartoDestinatario" value="'+document.EXTERN.repartoDest.value+'"></input>');
		myForm.action='servletGeneric?class=firma.SrvFirmaPdfMultipla';    	
	}else{
		myForm.action='servletGeneric?class=firma.SrvFirmaPdf';    	
	}
	myForm.submit();
	try{
		window.home.closeWhale.pushFinestraInArray(finestra);
	}catch(e){}	 
}

function firma_siss(){

	myForm = document.frmImpostazioniFirma;

	finestra = window.open("","finestra","fullscreen=yes scrollbars=no");
	myForm.target='finestra';
	myForm.action='servletGeneric?class=firma.SrvFirmaSiss';
	myForm.submit();
	try{
		window.home.closeWhale.pushFinestraInArray(finestra);
	}catch(e){}	 
}


function refreshConsulenze(idenRef)
{
	var datiPaz 	= $('#paziente').val();;
	var repProv		= $('#reparto').val();
	var idenVis 	= $('#idenVisita').val();
	var idenAna 	= $('#idenAnag').val();
	var nosolog 	= $('#ricovero').val();
	var funzion 	= $('#funzione').val();
	var idenTes 	= $('#idenTes').val();
	var repDest 	= $('#repartoDest').val();
	var idRemoto	= $('#idRemoto').val();
	var tipo 		= $('#tipo').val();
	var tabPerTipo 	= $('#tabPerTipo').val();
	var url =	'servletGeneric?class=refertazioneConsulenze.refertazioneConsulenzeEngine'+
	'&paziente='+datiPaz+
	'&reparto='+repProv+
	'&repartoDest='+repDest+
	'&idenVisita='+idenVis+
	'&idenAnag='+idenAna+
	'&ricovero='+nosolog+
	'&funzione='+funzion/*+'&idenEsame='+idenEsa*/+
	'&idenReferto='+idenRef+
	'&idenTes='+idenTes+
	'&idRemoto='+idRemoto+
	'&tabPerTipo='+tabPerTipo+					
	'&tipo='+(typeof tipo=='undefined'?'generic':tipo)+
	'&arrivatoDa='+(typeof ($('#arrivatoDa').val())=='undefined'?'':$('#arrivatoDa').val())+
	'&abilitaFirma='+(typeof ($('#abilitaFirma').val())=='undefined'?'S':$('#abilitaFirma').val());				

//	Refresh Worklist Consulenze
	if (top.name!='Home'){		
		try {opener.parent.FILTRO_WK_CONSULENZE.applica_filtro_consulenze()} catch(e){};
		try {opener.parent.FILTRO_WK_PRESAINCARICO.applica_filtro_presaincarico()} catch(e){};
	}
//	Refresh Consolle di Refertazione	
	window.location.replace(url,"","status=yes, fullscreen=yes");
}


/* Funzione che mostra le sezioni da caricate */
function showSection(index){
	try{
		arSection = document.all['sections'].childNodes;
		arTabSections = document.all['tabSections'].childNodes;
		for (var i=0;i<arSection.length;i++){
			arSection[i].className = 'tabHide';
			arTabSections[i].className = '';
		}
		arSection[index].className = 'tabShow';
		arTabSections[index].className = 'active';	
	}catch(e){}	
}
/* Funzione che mostra le info da caricate */
function showInfo(index){
	try{
		arInfo = document.all['infos'].childNodes;
		arTabInfo = document.all['tabInfos'].childNodes;
		for (var i=0;i<arInfo.length;i++){
			arInfo[i].className = 'tabHide';
			arTabInfo[i].className = '';
		}
		arInfo[index].className = 'tabShow';
		arTabInfo[index].className = 'active';	

		if (arInfo[index].id == 'idReferti' && arInfo[index].innerHTML=='') { 
			info.caricaWkReferti(index);
		} else if (arInfo[index].id == 'idDatiLabo' && document.all.divTabLaboratorio.innerHTML=='') { 
			caricaDati();
			try{initSelection();}catch(e){alert(e.description);/*nessun dato presente*/}
		} else if (arInfo[index].id == 'idRepository') {
			info.apriRepository();
		}
	}catch(e){}
}


$(window).unload(function() {
	if ($('#arrivatoDa').val()=='WHALE'){
		opener.parent.applica_filtro();
	}
	setTimeout(function(){ unLock($('#funzione').val(),$('#idenTes').val()) }, 3000);
});

function unLock(funzione,idenTestata)
{	
	try{
		dwr.engine.setAsync(false);
		dwrPreparaFirma.unLockFunzione('CC_LETTERA_VERSIONI',funzione,idenTestata,callBack);
		dwr.engine.setAsync(true);
		function callBack(reply)
		{	
			if(reply!='OK')
			{
				alert("reply:"+reply);
			}
		}		
	}catch(e){alert(e.message)}
}


/* Se un valore è nullo ritorna true*/
function isNull(valore)
{
	if (valore==null || valore=='')
	{
		return true;
	}
	else
	{
		return false;
	}
}

/* Aggiunge il calendarietto*/
function addCaledar(obj)
{
	try
	{
		jQuery(obj).datepick({onClose: function(){jQuery(this).focus();}, showOnFocus: false,  showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});
	}
	catch(e)
	{
		alert('Message Error: '+e.message);
	}
}
/*Funzione abilitata all'interno del pulsante chiudi*/
function chiudi()
{
	if (typeof ($('#arrivatoDa').val())!='undefined' && $('#arrivatoDa').val()=='PS'){
		top.close();
	}else{
		self.close();	 		
	}


}
/*Setta l'altezza della consolle di referatazione*/
function setHeight()
{
	h=screen.height - document.all.divIntestazione.scrollHeight- document.all.divHeader.scrollHeight - document.all.footer.scrollHeight-document.all.divFrame.scrollHeight-30;
	document.all.sections.style.height = h +'px';
	document.all.infos.style.height = h +'px';
}
/*Carica la classe della textarea: se è in modalità readonly allora carica la pagina in modalità readonly*/
function caricaClassiTextArea() 
{ 	
	if (document.frmGestionePagina.readonly.value=='S')
	{
		var arIdSection = new Array();
		var lista_sezioni = document.getElementsByTagName("textarea");
		for(var i=0;i<lista_sezioni.length;i++)
		{
			if(typeof lista_sezioni[i].attiva!='undefined')
			{
				arIdSection.push(lista_sezioni[i].id);
			}
		}

		for (i=0;i<arIdSection.length;i++)
		{
			$('#'+arIdSection[i]).addClass('Readonly');
		}
	}
}
/* Mette in un array le sezioni di testo caricate all'apertura della consolle di refertazione*/
function storeTextArea()
{ 

	var txtAreaOriginaliHTML = new Array();
	if (document.getElementById("idConsulenzaRef")) {
		var consuleRef = document.getElementById("idConsulenzaRef").value;
		txtAreaOriginaliHTML.push(togliCaratteriSpeciali(consuleRef));
	}
	if (document.getElementById("idConsulenzaTer")) {
		var terapiaRef = document.getElementById("idConsulenzaTer").value;
		txtAreaOriginaliHTML.push(togliCaratteriSpeciali(terapiaRef));
	}
	if (document.getElementById("idConsulenzaAcc")) {
		var ulterioAcc = document.getElementById("idConsulenzaAcc").value;
		txtAreaOriginaliHTML.push(togliCaratteriSpeciali(ulterioAcc));
	}

	/* Da testo html a testo piano*/
	dwr.engine.setAsync(false);
	dwrPreparaFirma.convertHtmlToText(txtAreaOriginaliHTML, replyConverter);
	dwr.engine.setAsync(true);

	function replyConverter(reply)
	{
		txtAreaOriginali= reply;
	}
}
/* Funzione che toglie i caratteri definiti ad inizio del javascript*/
function togliCaratteriSpeciali(stringa)
{
	for(var j=0;j<arRE2replace.length;j++)
	{
		stringa= stringa.replace(arRE2replace[j],arChar4replace[j]);
	}
	return stringa;
}

/* Confronta l'array delle sezioni prima della firma solo nel caso in cui sia stata eseguita prima una validazione e poi una firma*/
function confrontaPrimaDellaFirma(arrayConvertito)
{
	for (i=0;i<arrayConvertito.length;i++)
	{
		if (txtAreaOriginali[i]!=arrayConvertito[i])
		{
			document.frmImpostazioniFirma.validaFirma.value='S';
			break;	
		}
	}
}

function stampaRefertoConsulenza()
{	
	if (document.frmGestionePagina.stato.value=='F')
	{
		var url = 'ApriPDFfromDB?idenVersione='+$('#idenReferto').val()+'&idenVisita='+$('#idenVisita').val()+'&AbsolutePath='+window.home.getAbsolutePath();
		var finestra = window.open(url,"finestra","fullscreen=yes scrollbars=no");
		try{
			window.home.closeWhale.pushFinestraInArray(finestra);
		}catch(e){}
	}
	else
	{
		var reparto		= $('#repartoDest').val();
		var funzione	= $('#funzione').val();
		var anteprima	= 'S';
		var sf 			= "&prompt<pIdenTR>="+$('#idenTes').val();
		window.home.confStampaReparto(funzione,sf,anteprima,reparto,null);			
	}
}

/* Prima della chiusuara o dell'aggiornamento della pagina viene sbloccato l'utente su rows_lock e viene aggiornata la pagina precedente 
$(window).bind('beforeunload', function()
	{	
		opener.parent.applica_filtro();	  
	});
 */

var info = {
		caricaWkReferti : function(index) {
			try {
				if ($('#lblDataInizio',top.document).length != 0) {
					var iniz_ric = $('#lblDataInizio',top.document).text();
					iniz_ric = iniz_ric.substring(6,10) + iniz_ric.substring(3,5) + iniz_ric.substring(0,2); 
				} else {
					var iniz_ric = '20000101';
				}

				var iden_anag_whale = $('#idenAnag').val();

				sql = "{call ? := get_iden_anag_ris(" + iden_anag_whale + ")}";
				dwr.engine.setAsync(false);
				toolKitDB.executeFunctionData(sql, call_back);
				dwr.engine.setAsync(true);

				function call_back(resp){ 
					var wkReferti = "<IFRAME id='frameReferti' height=98%  width=100% src=\"servletGenerator?KEY_LEGAME=WK_REFERTI_LETTERA" +
					"&WHERE_WK=where IDEN_ANAG='" + resp + "' and DAT_ESA_ORDINAMENTO>='"+ iniz_ric 
					+"' and FIRMATO = 'S' order by DAT_ESA_ORDINAMENTO desc\" frameBorder=0></IFRAME>";
					document.getElementById('infos').childNodes[index].innerHTML=wkReferti;
				}
			} catch (e) {
				alert(e.message);
			}
		},
		apriRepository : function () {
			try {
				var idRemoto = $('#idRemoto').val();
				var repDest = $('#repartoDest').val();
				var nosolog = $('#ricovero').val();
				window.open("header?idPatient="+idRemoto+"&reparto="+repDest+'&nosologico='+nosolog,'','fullscreen=yes');
			} catch (e) {
				alert(e.message);
			}
		}
}

/*NAMESPACE per la gestione del trattamento logopedico*/
var durataTrattamento = {
		init: function(){
			if($('#funzione').val()!='PRESA_IN_CARICO'){
				$('#finoRagObiettivi').prev().hide();
				$('#finoRagObiettivi').hide();				
			}

			if ($('#finoFineRicovero').attr('checked')==true){
				$('#fineTrattamento').hide();
				$('#fineTrattamento').next().hide();
				$('#finoRagObiettivi').prev().hide();
				$('#finoRagObiettivi').hide();
			}
			else if ($('#finoRagObiettivi').attr('checked')==true){
				$('#fineTrattamento').hide();
				$('#fineTrattamento').next().hide();
				$('#finoFineRicovero').prev().hide();
				$('#finoFineRicovero').hide();

			}
			else{
				if ($('#fineTrattamento').val() != ''){
					$('#finoFineRicovero').prev().hide();
					$('#finoFineRicovero').hide();
					$('#finoRagObiettivi').prev().hide();
					$('#finoRagObiettivi').hide();
				}
			}
		},

		setEvents: function(){
			
			if (typeof $("#fineTrattamento").val() != 'undefined' || typeof $("#finoRagObiettivi").val() != 'undefined'){
				$("#fineTrattamento").keyup(function() {
					durataTrattamento.showHideFFR();
				});

				$("body").mousemove(function() {
					durataTrattamento.showHideFFR();
				});
			}
			if (typeof $("#finoFineRicovero").val() != 'undefined'){
				$('#finoFineRicovero').change(function(){
					if ($('#finoFineRicovero').attr('checked')==true){
						$('#fineTrattamento').hide();
						$('#fineTrattamento').val('');
						$('#fineTrattamento').next().hide();
						$('#finoRagObiettivi').prev().hide();
						$('#finoRagObiettivi').hide();
						$('#finoRagObiettivi').attr('checked',false);
					}else{
						$('#fineTrattamento').show();
						$('#fineTrattamento').next().show();
						$('#finoRagObiettivi').prev().show();
						$('#finoRagObiettivi').show();
					}
				});
			}
			if (typeof $("#finoRagObiettivi").val() != 'undefined'){
				$('#finoRagObiettivi').change(function(){
					if ($('#finoRagObiettivi').attr('checked')==true){
						$('#fineTrattamento').hide();
						$('#fineTrattamento').val('');
						$('#fineTrattamento').next().hide();
						$('#finoFineRicovero').prev().hide();
						$('#finoFineRicovero').hide();
						$('#finoFineRicovero').attr('checked',false);
					}else{
						$('#fineTrattamento').show();
						$('#fineTrattamento').next().show();
						$('#finoFineRicovero').prev().show();
						$('#finoFineRicovero').show();
					}
				});
			}

			if ($('INPUT[name=radAutorizzazione]').length>0 ) {
				$('INPUT[name=radAutorizzazione]').change(function(){
					if($('INPUT[name=radAutorizzazione]:checked').val()=='N'){
						$('#inizioTrattamento').val('');
						$('#fineTrattamento').val('');
						$('#finoFineRicovero').attr('checked',false);
						$('#finoRagObiettivi').attr('checked',false);
						$('#durataTrattamento').parent().hide();
					}else{
						$('#durataTrattamento').parent().show();
						$('#fineTrattamento').show();
						$('#fineTrattamento').next().show();
						$('#finoFineRicovero').prev().show();
						$('#finoFineRicovero').show();
						$('#finoRagObiettivi').prev().show();
						$('#finoRagObiettivi').show();
						$('#finoFineRicovero').attr('checked',false);
						$('#finoRagObiettivi').attr('checked',false);
					}
				}); 			 
			}
		},

		checkObbligatorietaDato:function(){

			if ($('INPUT[name=radAutorizzazione]').length>0 ) {
				if ($('INPUT[name=radAutorizzazione]:checked').val()==undefined){
					alert('Prima di procedere, selezionare un esito');
					return true;
				}
				else if($('INPUT[name=radAutorizzazione]:checked').val()=='N'){
					return false;
				}
			}
			var message = 'Prima di procedere, completare i campi per la durata del trattamento';

			var inizio  = $('#inizioTrattamento').val() == ''               ? true : false;
			var fine    = $('#fineTrattamento').val() == ''                 ? true : false;
			var ffr     = $('#finoFineRicovero').attr('checked') == false   ? true : false;
			var fro     = ($('#finoRagObiettivi').length==0 || $('#finoRagObiettivi').attr('checked')== false)   ? true : false;

			if(inizio){
				alert('Attenzione, inserire la data di inizio trattamento');
				$("#inizioTrattamento").focus();
				return true;
			}

			if (!inizio && ((fine && ffr) && (fine && fro))) {
				alert(message);
				$("#fineTrattamento").focus();
				return true;
			}


			return false;
		},

		showHideFFR : function() {

			if($('#finoRagObiettivi').attr('checked')==true || $('#finoFineRicovero').attr('checked')==true){
				return;
			}

			if ($('#fineTrattamento').val()=='' || $('#fineTrattamento').val().length != 10) {
				$('#finoFineRicovero').prev().show();
				$('#finoFineRicovero').show();
			} else {
				$('#finoFineRicovero').prev().hide();
				$('#finoFineRicovero').hide();
				$('#finoRagObiettivi').prev().hide();
				$('#finoRagObiettivi').hide();
			}   
		}


};


var NS_CONSULENZA_CONSENSO = {
		windowConsenso:'',
		consensoAttivo:true,
		init:function(){
			this.consensoAttivo=window.home.home.checkPrivacy($('#funzione').val())
			if (!this.consensoAttivo){
				document.all.divFrame.style.height = '0px';				
				$('iframe#idFrameConsenso').parent().hide();
				return;
			}

			var wnd = $('iframe#idFrameConsenso')[0];
			wnd = wnd.contentWindow || wnd.contentDocument;
			this.windowConsenso = wnd	
		},

		checkConsenso:function(){
			var msg='';
			//Se è scelta una voce tra oscurato e oscuramento dell'oscuramento,   la scelta di almeno uno dei due checkbox è obbligatoria ai fini del salvataggio
			if((this.windowConsenso.$('input:radio[@name="rdOscuramento"]:checked').val()=='V'||this.windowConsenso.$('input:radio[@name="rdOscuramento"]:checked').val()=='R') && !this.windowConsenso.$('#idVolereCittadino').is(':checked') && !this.windowConsenso.$('#idPerLegge').is(':checked')){
				msg='Prego selezionare almeno una voce tra "Volontà del cittadino" e "per Legge"'; 
			}
			else{
				//Per effettuare il salvataggio o la firma, se l'utente spunta il check 'per legge', la scelta di una voce della combo deve essere obbligatoria
				if(this.windowConsenso.$('#idPerLegge').is(':checked') && this.windowConsenso.$('#cmbOscuramentoPerLegge').val()==''){
					msg='Prego inserire una motivazione relativa all\'oscuramento "per Legge" '; 
				}
			}
			return msg;
		},

		saveConsenso:function(){
			return this.windowConsenso.NS_GESTIONE_CONSENSO.save();
		}

}


function appendFunctionToButton()
{

	$( "#idStampa,#idRegistra,#idFirma,#idChiudi" ).unbind( "click" );	

	if (baseUser.TIPO=='I')
	{
		$('#idStampa').click(function() {
			stampaRefertoConsulenza();
		});
	}
	else
	{
		if (document.frmGestionePagina.stato.value=='F')
		{
			$('#idRegistra').hide();
		}
		else
		{
			$('#idRegistra').click(function() {
				registra("L");
			});
		}
		$('#idFirma').click(function() {
			registra("S");
		});

		/*$('#idRegistraConsenso').click(function(){
           registraConsensoDocumento(); 
        });*/

		$('#idStampa').click(function() {
			stampaRefertoConsulenza();
		});

		$('#idChiudi').click(function() {
			chiudi();
		});

		if ($('#abilitaFirma').val()=='N'){
			$('#idFirma').hide();
		}
	}
}


function configurazioneMultipla () {
	var value;
	if (window.basePC.ABILITA_FIRMA_DIGITALE === 'S'){
		value = true
	}else{
		value = false;				
	}
	return value;
}

