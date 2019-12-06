var contTrDet = 0;
selectPeriodi = "";
var registrato = 0;
var daFirmare = 0;
var arrTerapie = new Object(); 


jQuery(document).ready(function(){
	
	   $(document).bind("contextmenu",function(e){
           return false;
    });

	caricaPeriodiSom();
	document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
	if(typeof document.EXTERN.DUPLICA != 'undefined' && document.EXTERN.DUPLICA.value == 'S'){
		var data = new Date();
		var txtData;
		txtData = getData(data,'DD/MM/YYYY');
		$('input[name=dataAttivazione]').val(txtData);
		$('input[name=dataScadenza]').val('');
		$('input[name=txtIntervalloMesi]').val('');		 
		document.EXTERN.IDEN.value = '';
		document.EXTERN.IDEN_TESTATA.value = '';
		$('#groupDatiPrestazioni > table INPUT[name=txtDurata]').each(function(index) {
			$(this).val('');
		}); 
		
	}

	
	$('select[name=cmbReparto]').change(function() {
		$('input[name=hReparto]').val($(this).val());	   
	});
	
	$(".datepick-trigger").click(function(){
		jQuery("#txtIntervalloMesi").val("");
	});
	
	jQuery("#txtIntervalloMesi").blur(function(){
		//se non è un numero o se supera 12
		if (jQuery("#txtIntervalloMesi").val() != ""){
			if( ( !isNaN(jQuery("#txtIntervalloMesi").val()) ) && ( (parseInt(jQuery("#txtIntervalloMesi").val())<13) && (parseInt(jQuery("#txtIntervalloMesi").val())>0) )){
				calcolaDurata(jQuery("#txtIntervalloMesi").val());
				cambiaDurata();
			}else{
				jQuery("#txtIntervalloMesi").val("").focus();
				alert("Inserire un valore numerico compreso nell'intervallo da 0 a 12");
				return;
			}
		}
	});

	//document.getElementById('hWhereCond').value=document.getElementById('cmbStruttura').options[document.getElementById('cmbStruttura').options.selectedIndex].value;

	if(document.EXTERN.STATO.value=='I'){

		document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
	
	}
	
	$('input[name=dataAttivazione]').attr('readonly',true);
//	$('input[name=dataScadenza]').attr('readonly',true).blur(function(){ controllaScadenza(); });
	$('input[STATO_CAMPO=L]').attr('disabled', 'disabled');

	 if(document.EXTERN.STATO.value=='L'){
		
		document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
		$("td[class=classTdLabelLink]").attr('disabled', 'disabled');
		$("img[class=trigger datepick-trigger]").attr('disabled', 'disabled');
		$('SELECT[name=cmbReparto]').attr('disabled','disabled');
		$('#txtDiagnosi').attr('disabled', 'disabled');
		$('#dataAttivazione').attr('disabled', 'disabled');
		$('#dataScadenza').attr('disabled', 'disabled');
		$('#txtIntervalloMesi').attr('disabled', 'disabled');
		$('#groupDatiPrestazioni > table td[name=first]').attr('disabled', 'disabled');
		$('#groupDatiPrestazioni > table INPUT[name=txtUnita]').attr('disabled', 'disabled');
		$('#groupDatiPrestazioni > table INPUT[name=txtDurata]').attr('disabled', 'disabled');
		$('#groupDatiPrestazioni > table INPUT[name=txtLitri]').attr('disabled', 'disabled');
		$('#groupDatiPrestazioni > table INPUT[name=txtOre]').attr('disabled', 'disabled');
		$('#groupDatiPrestazioni > table SELECT[name=cmbPeriodoSom]').attr('disabled','disabled');
		$('#groupDatiPrestazioni > table INPUT[name=txtPosologia]').attr('disabled', 'disabled');
		
	}
	else if (document.EXTERN.STATO.value=='M' && (typeof document.EXTERN.DUPLICA == 'undefined' || document.EXTERN.DUPLICA.value != 'S'))
		
	{
		$('#lblAggTerapia').parent().attr('disabled', 'disabled');	
	}
	 
	 if (document.EXTERN.STATO.value!='L'){
			$("#linkElPiano").live("click", function(){ eliminaTrDet($(this).parent().attr('contDet')); });
		}
		  

});




function getData(pDate,format){

	anno = pDate.getFullYear();	
	mese = '0'+(pDate.getMonth()+1);mese =  mese.substring(mese.length-2,mese.length);
	giorno = '0'+pDate.getDate();giorno =  giorno.substring(giorno.length-2,giorno.length);
	switch(format){
	case 'YYYYMMDD':	return anno+mese+giorno;
	case 'DD/MM/YYYY':	return giorno+'/'+mese+'/'+anno;		
	}
}



function apriSceltaTerapie(){


	if ($('input[name=dataAttivazione]').val()=='' || $('input[name=dataScadenza]').val()==''){
		alert('Prego inserire sia una data di attivazione che di scadenza');
		return;	
	}
	
	if ($('SELECT[name=cmbReparto] option:selected').val()==''){
		alert('Prego selezionare il reparto');
		return;	
	}
	

	url = "servletGenerator?KEY_LEGAME=PT_WK_RICERCA_TERAPIE";
	$.fancybox({
		'padding'	: 3,
		'width'		: $(parent).width(),
		'height'	: 580,
		'href'		: url,
		'type'		: 'iframe'
	}); 

}

function chiudiPt(){

	parent.document.all['frameBottom'].src ='blank';
	parent.$('#frameTop').show();	
	parent.document.all['frameTop'].contentWindow.ricercaPT();
	parent.$('#frameBottom').hide();
	parent.document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'block';
	
}


function caricaPeriodiSom(){

	var sql='select codice,descrizione from radsql.pt_codifiche where tipo_codifica =\'PERIODO_SOMMINISTRAZIONE\' order by ordine';
	
	dwr.engine.setAsync(false);
	toolKitDB.getListResultData(sql, creaOptPeriodi);
	dwr.engine.setAsync(true);
}

function creaOptPeriodi(elenco){
	
	selectPeriodi='<SELECT name=cmbPeriodoSom><OPTION selected value=""></OPTION>';
	
	for (var i=0;i<elenco.length; i++){
		selectPeriodi+='<OPTION value='+elenco[i][0]+'>'+elenco[i][1]+'</OPTION>';
	}
	selectPeriodi+='</SELECT>';

	caricaDettaglio();
}



function caricaDettaglio(){

	var terapieLoad=$('[name=hTerapia]').val().split('@');
	var descrPALoad=$('[name=hDescrTerapia]').val().split('@');
	var descrFarmacoLoad=$('[name=hDescrFarmaco]').val().split('@');
	var unitaLoad=$('[name=hUnita]').val().split('@');
	var durataLoad=$('[name=hDurata]').val().split('@');
	var litriLoad=$('[name=hLitri]').val().split('@');
	var oreLoad=$('[name=hOre]').val().split('@');
	var periodoSomLoad=$('[name=hPeriodoSom]').val().split('@');
	var indicazioneLigLoad=$('[name=hIndicazioneLig]').val().split('@');
	var posologiaLoad=$('[name=hPosologia]').val().split('@');


	if (terapieLoad!=""){
		$.each(terapieLoad, function(index, value) { 
			$('#groupDatiPrestazioni > table > tbody').append(creaTrDettaglio(value,descrPALoad[index],descrFarmacoLoad[index],indicazioneLigLoad[index],unitaLoad[index],durataLoad[index],litriLoad[index],oreLoad[index],periodoSomLoad[index],posologiaLoad[index]));
			$('[name=cmbPeriodoSom]:eq('+index+')').val(periodoSomLoad[index]);
		});

		$('[name=lblDetPA]').css("font-size","12px"); 
		$('[name=lblDetFarmaco]').css("font-size","12px"); 

	}

}


var pianoTerapeutico = {

		aggiungiDettaglio : function(codT,descrPA,descrFarmaco,descrConf,descrTitle){

			$('#groupDatiPrestazioni > table > tbody').append(creaTrDettaglio(codT,descrPA,descrFarmaco+' - '+descrConf,descrTitle));
			$('[name=lblDetPA]').css("font-size","12px"); 
			$('[name=lblDetFarmaco]').css("font-size","12px"); 
			
			$('#lblAggTerapia').parent().attr('disabled', 'disabled');

		}

};

function creaTrDettaglio(inCodTer,inDescrPA,inDescrFarmaco,descrTitle,inUnita,inDurata,inLitri,inOre,inPeriodoSom,inPosologia){

	dataIn=$('input[name=dataAttivazione]').val().substr(6,4)+$('input[name=dataAttivazione]').val().substr(3,2)+$('input[name=dataAttivazione]').val().substr(0,2);
	dataFin=$('input[name=dataScadenza]').val().substr(6,4)+$('input[name=dataScadenza]').val().substr(3,2)+$('input[name=dataScadenza]').val().substr(0,2);	
	
	diffDate=clsDate.difference.day(clsDate.str2date(dataFin,'YYYYMMDD',''),clsDate.str2date(dataIn,'YYYYMMDD',''));
	

	arrTerapie[contTrDet]=inCodTer;
	var htmlTr="<tr contDet="+contTrDet+">";
	htmlTr+="<td class='classTdLabelLink' name='first' id='linkElPiano'><LABEL name=lblElimTerapia>Elimina P.A.</LABEL></td>";
	htmlTr+="<td><LABEL name=lblDetPA value="+inCodTer+" title='"+descrTitle+"'>"+inDescrPA+"</LABEL></td>";
	htmlTr+="<td><LABEL name=lblDetFarmaco value="+inCodTer+" title='"+descrTitle+"'>"+inDescrFarmaco+"</LABEL></td>";
	
	htmlTr+="<td class=classTdField><INPUT  name=txtUnita size='5' ";
	if (inUnita!=null){htmlTr+=" value='"+inUnita+"'";};
	if (inCodTer=='001015')
	{
		htmlTr+=" ossigeno='Y'";
	}
	else{
		htmlTr+=" ossigeno='N'";	
	}
		
	htmlTr+="/></td>";

	htmlTr+="<td class=classTdField>"+selectPeriodi+"</td>";


	htmlTr+="<td class=classTdField><INPUT name=txtDurata size='5'  ";
	if (inDurata!=null){
		htmlTr+=" value='"+inDurata;
	}
	else
	{
		htmlTr+=" value='"+(diffDate);
	}	
	htmlTr+="'/></td>";

	htmlTr+="<td class=classTdField><INPUT name=txtPosologia ";
	if (inPosologia!=null){
		htmlTr+=" value='"+inPosologia +"'";
	}
	htmlTr+="/></td>";
	htmlTr+="<td class=classTdField><INPUT name=txtLitri size='5' ";
	if (inLitri!=null){htmlTr+=" value='"+inLitri+"'";};
	if (inCodTer!='001015'){htmlTr+=" disabled ";} else {htmlTr+=" value='' ";};
	htmlTr+="/></td>";

	htmlTr+="<td class=classTdField><INPUT name=txtOre size='5' ";
	if (inOre!=null){htmlTr+=" value='"+inOre+"'";};
	if (inCodTer!='001015'){htmlTr+=" disabled ";} else {htmlTr+=" value='' ";};
	htmlTr+="/></td>";

	htmlTr+="</tr>";

	contTrDet+=1;

	return htmlTr;	
}

function eliminaTrDet(numTr){

	$('#groupDatiPrestazioni > table tr[contDet='+numTr+']').remove();
	delete arrTerapie[numTr];
	$('#lblAggTerapia').parent().removeAttr('disabled');




}

function registraPiano(){

	var vExit=false;
	
	//alert('iden: '+document.EXTERN.IDEN.value +'\niden_testata: '+ document.EXTERN.IDEN_TESTATA.value);
	//return;

	if($('[name=lblDetPA]').val()==undefined)
	{
		alert('Prego inserire almeno una terapia');
		return
	}

	if($('input[name=dataAttivazione]').val()==''){
		alert('Prego inserire la data di attivazione');
		return;
	}

	if($('input[name=dataScadenza]').val()==''){
		alert('Prego inserire la data di scadenza');
		return;
	}


	$('input[name=hTerapia]').val('');
	$('input[name=hDescrTerapia]').val('');
	$('input[name=hDescrFarmaco]').val('');
	$('input[name=hUnita]').val('');
	$('input[name=hDurata]').val('');
	$('input[name=hLitri]').val('');
	$('input[name=hOre]').val('');
	$('input[name=hPeriodoSom]').val('');
	$('input[name=hIndicazioneLig]').val('');
	$('input[name=hPosologia]').val('');




	$('#groupDatiPrestazioni > table LABEL[name=lblDetPA]').each(function() {
		$('input[name=hTerapia]').val()=="" ? $('input[name=hTerapia]').val($(this).val()) : $('input[name=hTerapia]').val($('input[name=hTerapia]').val()+'@'+$(this).val());			
		$('input[name=hDescrTerapia]').val()=="" ? $('input[name=hDescrTerapia]').val($(this).text()) : $('input[name=hDescrTerapia]').val($('input[name=hDescrTerapia]').val()+'@'+$(this).text());			
		$('input[name=hIndicazioneLig]').val()=="" ? $('input[name=hIndicazioneLig]').val($(this).attr('title')) : $('input[name=hIndicazioneLig]').val($('input[name=hIndicazioneLig]').val()+'@'+$(this).attr('title'));			

	}); 
	
	$('#groupDatiPrestazioni > table LABEL[name=lblDetFarmaco]').each(function() {
		$('input[name=hDescrFarmaco]').val()=="" ? $('input[name=hDescrFarmaco]').val($(this).text()) : $('input[name=hDescrFarmaco]').val($('input[name=hDescrFarmaco]').val()+'@'+$(this).text());					
	}); 


	$('#groupDatiPrestazioni > table INPUT[name=txtUnita]').each(function() {
			$('input[name=hUnita]').val()=="" ? $('input[name=hUnita]').val($(this).val()) : $('input[name=hUnita]').val($('input[name=hUnita]').val()+'@'+$(this).val());			
	}); 
	

	$('#groupDatiPrestazioni > table INPUT[name=txtPosologia]').each(function() {
		$('input[name=hPosologia]').val()=="" ? $('input[name=hPosologia]').val($(this).val()) : $('input[name=hPosologia]').val($('input[name=hPosologia]').val()+'@'+$(this).val());			
	}); 
	

	$('#groupDatiPrestazioni > table SELECT[name=cmbPeriodoSom]').each(function() {
		$('input[name=hPeriodoSom]').val()=="" ? $('input[name=hPeriodoSom]').val($(this).attr('value')) : $('input[name=hPeriodoSom]').val($('input[name=hPeriodoSom]').val()+'@'+$(this).attr('value'));			
	});
	
	$('#groupDatiPrestazioni > table INPUT[name=txtDurata]').each(function(index) {
		$('input[name=hDurata]').val()=="" && index==0 ? $('input[name=hDurata]').val($(this).val()) : $('input[name=hDurata]').val($('input[name=hDurata]').val()+'@'+$(this).val());			
	}); 

		
	$('#groupDatiPrestazioni > table INPUT[name=txtLitri]').each(function(index) {
		$('input[name=hLitri]').val()=="" && index==0 ? $('input[name=hLitri]').val($(this).val()) : $('input[name=hLitri]').val($('input[name=hLitri]').val()+'@'+$(this).val());			
	}); 

	$('#groupDatiPrestazioni > table INPUT[name=txtOre]').each(function(index) {
		$('input[name=hOre]').val()=="" && index==0 ? $('input[name=hOre]').val($(this).val()) : $('input[name=hOre]').val($('input[name=hOre]').val()+'@'+$(this).val());			
	}); 

	$('[name=hReparto]').val("");


	/*	
alert($('input[name=hTerapia]').val());
alert($('input[name=hDescrTerapia]').val());
alert($('input[name=hUnita]').val());
alert($('input[name=hDurata]').val());
alert($('input[name=hLitri]').val());
alert($('input[name=hOre]').val());
alert($('input[name=hPeriodoSom]').val());
alert($('input[name=hIndicazioneLig]').val());
	 */	


	var stato =  document.EXTERN.STATO.value;

	if (registrato==1 && stato=='I')
	{
		retrieveIdenXml();
	}

	registra();	

}

function controlloNumero(obj){

	if (isNaN(obj.val()) || parseInt(obj.val())<0  || obj.val()=='' || obj.val().indexOf('.')!=-1)
	{ 
		return 0;
	}
	return 1;
}


function controlloDurata(obj){

	if (isNaN(obj.val()) || parseInt(obj.val())<0  || obj.val()=='') 
	{ 
		alert('Attenzione, inserire correttamente il campo Durata (numerico)!');
		obj.focus();
		return 0;
	}	


	if ($('input[name=dataAttivazione]').val()!='' && $('input[name=dataScadenza]').val()!='');
	{
		dataIn=$('input[name=dataAttivazione]').val().substr(6,4)+$('input[name=dataAttivazione]').val().substr(3,2)+$('input[name=dataAttivazione]').val().substr(0,2);
		dataFin=$('input[name=dataScadenza]').val().substr(6,4)+$('input[name=dataScadenza]').val().substr(3,2)+$('input[name=dataScadenza]').val().substr(0,2);	


	  diffDate=clsDate.difference.day(clsDate.str2date(dataFin,'YYYYMMDD',''),clsDate.str2date(dataIn,'YYYYMMDD',''));

		
		if (obj.val()>(diffDate)){
			if((diffDate)>0)
				alert("Attenzione, la durata inserita supera l'intervallo di giorni compreso tra data attivazione e scadenza!");
			else
			{
				alert("Attenzione, inserita una data scadenza piano antecedente alla data di attivazione");
				$('input[name=dataScadenza]').val('');
				return 0;
			}	
			obj.focus();
			return 0;	
		}
	}  


}

function prepara_firma_piano()
{
	daFirmare = 1;
	registraPiano();
}

function stampa_piano()
{
	var idenTestataPT='';
	if (document.EXTERN.IDEN_TESTATA.value=='') 
		idenTestataPT = retrieveIdenTestata();
	else
		idenTestataPT = document.EXTERN.IDEN_TESTATA.value;	
	/*se lo stato=F apertura da db*/
	var stato = retrieveFirmato(idenTestataPT);
	if (stato == null)
	{
		alert('Prego, effettuare almeno una registrazione');
		return;
	}		
	else if (stato=='F')
	{
		var progr = retrieveProgressivo(idenTestataPT,'PIANO_TERAPEUTICO');
		var url = "ApriPDFfromDB?AbsolutePath="+getAbsolutePath()+"&idenVersione="+idenTestataPT+"&funzione=PIANO_TERAPEUTICO&progr="+progr;
		var finestra = window.open(url,"finestra","fullscreen=yes scrollbars=no");
	}	
	else
	{
		var funzione  = 'PIANO_TERAPEUTICO';
		var anteprima = 'S';
		var reparto   = baseGlobal.SITO;
		var sf		  = '&prompt<pIdenTestata>='+idenTestataPT;
		var stampante = null;
		var url 	  = 'elabStampa?stampaFunzioneStampa='+funzione;
		
		url += '&stampaAnteprima='+anteprima;
		
		if(reparto!=null && reparto!='')		
			url += '&stampaReparto='+reparto;
		
		if(sf!=null && sf!='')
			url += '&stampaSelection='+sf;	
		
		if(stampante!=null && stampante!='')
			url += '&stampaStampante='+stampante;	
		
		var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
			
		if(finestra)
		{	
			finestra.focus();
		}
	    else
		{
			var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		}
	}
}

function retrieveFirmato(iden_testata_pt)
{
	var firmato = '';
	
	dwr.engine.setAsync(false);	
	toolKitDB.getResultData('select stato from PT_TESTATA where iden = \'' + iden_testata_pt + '\'', resp_check);
	dwr.engine.setAsync(true);
	
	function resp_check(resp){
		firmato=resp;
	}
	return firmato;
}


/**
 * funzione che recupera l'iden testata tramite query sulla tabella PT_TESTATA per quel determinato user_login
 * */
function retrieveIdenTestata()
{
	var idenTestata='';

	dwr.engine.setAsync(false);	
	toolKitDB.getResultData('select iden from (select iden from PT_TESTATA where user_login = \'' + baseUser.LOGIN + '\' ORDER BY IDEN DESC)where rownum=1', resp_check);
	dwr.engine.setAsync(true);

	function resp_check(resp){
		idenTestata=resp;
	}
	return idenTestata;
}

/**
 * funzione che recupera l'iden testata tramite query sulla tabella PT_TESTATA per quel determinato user_login
 * */
function retrieveIdenXml()
{
	var idenXml='';
	var idenTestata='';
	dwr.engine.setAsync(false);	
	toolKitDB.getResultData('select iden_xml,iden from (select iden_xml,iden from PT_TESTATA where user_login = \'' + baseUser.LOGIN + '\' ORDER BY IDEN DESC)where rownum=1', resp_check);
	dwr.engine.setAsync(true);

	function resp_check(resp){
		document.EXTERN.IDEN.value = resp[0];
		document.EXTERN.IDEN_TESTATA.value = resp[1];
	}
}


/**
 * funzione che recupera l'iden testata tramite query sulla tabella PT_TESTATA per quel determinato user_login
 * */
function retrieveProgressivo(iden_testata_pt,funzione)
{
	var progressivo = '';
	dwr.engine.setAsync(false);	
	toolKitDB.getResultData('select max(progr) from CC_FIRMA_PDF where iden_tab = ' + iden_testata_pt + ' and funzione = \''+funzione+'\' and deleted=\'N\'', resp_check);
     dwr.engine.setAsync(true);
	function resp_check(resp){
		progressivo=resp;
	}
	return progressivo;
}


function okRegistraPt()
{
	registrato = 1;
	if (daFirmare == 1)
		firma_piano();
	else
		chiudiPt();
}

function firma_piano()
{
	var idenTestataPT=''; 

	if (document.EXTERN.IDEN_TESTATA.value=='') 
		idenTestataPT = retrieveIdenTestata();
	else
		idenTestataPT = document.EXTERN.IDEN_TESTATA.value;	
	var url = "SrvFirmaPdfGenerica?typeFirma=PIANO_TERAPEUTICO&tabella=PT_TESTATA&idenTestataPT="+idenTestataPT+'&reparto='+baseGlobal.SITO+'&iden_per='+baseUser.IDEN_PER;
	var finestra = window.open(url,"finestra","fullscreen=yes scrollbars=no");
}


function getAbsolutePath()
{
	var loc = window.location;
	var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
	return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}

//function da richiamare in questa maniera: if(controllo_data('20101216').metodo); 
//restituisce true o false per ogni metodo (previous,next,equal)
function controllo_data(data){
	
	var str =data.toString();
	
	function cls(){
		this.previous = false;
		this.next= false;
		this.equal = false;
	}
	
	var data= new Date();
	var giorno= data.getDate() ;
	var mese=data.getMonth() +1;
	var anno=data.getYear();
	
	if (giorno.toString().length <2){
		//alert ('giorno prima della modifica: '+giorno);
		giorno = '0'+giorno;	
	}
	
	if (mese.toString().length <2){
		//alert ('mese prima della modifica: '+mese);
		mese = '0'+mese;
	}
	
	var oggi=anno.toString()+mese.toString()+giorno.toString(); //creo una variabile con la data odierna in formato yyyyMMdd
	var dataControl ='';
	
	var myClass = new cls();
	
	if (str.length>8){
		//controllo se la lunghezza è maggiore di 8(yyyyMMdd) vuol dire che la data è in formato dd/MM/yyyy. Faccio una substring in modo da trasformarla...
		dataControl=str.substr(6,4)+str.substr(3,2)+str.substr(0,2);
		//alert('data da controllare:'+dataControl+'e oggi: '+oggi);

	}else{
		dataControl=str;
		//alert(dataControl);
	}
	
	if(dataControl>oggi){
		//alert('next');
		myClass.previous = false;
		myClass.next=true;
		myClass.equal = false;
	}
	
	if(dataControl==oggi){
		//alert('equal');
		myClass.previous = false;
		myClass.next=false;
		myClass.equal = true;
	}
	
	if(dataControl<oggi){
		//alert('previous');
		myClass.previous = true;
		myClass.next=false;
		myClass.equal = false;
	}

	return myClass;
}


// se inseriscono un valore > 36 è da rivedere
function calcolaDurata(input){
	
	var mesi = parseInt(input);
	var dataAttivazione = jQuery("#dataAttivazione").val();
	var meseScad='';
	var annoScad='';
	
	//suddivido la data attivazione per avere i punti di riferimento
	var giornoAtt=dataAttivazione.substr(0,2);
	var meseAtt=parseInt(dataAttivazione.substr(3,2));
	var annoAtt=parseInt(dataAttivazione.substr(6,4));

	meseScad = meseAtt + mesi;
	
	if (meseScad>12 && (meseScad<25)){
		
		annoScad = annoAtt + 1;
		meseScad = (meseAtt + mesi) - 12;
		
	}else if((meseScad>24) && (meseScad<37) ){
		
		annoScad = annoAtt + 2;
		meseScad = (meseAtt + mesi) - 24;
		
	}else if((meseScad>36) && (meseScad<48) ){
		
		annoScad = annoAtt + 3;
		meseScad = (meseAtt + mesi) - 36;
		
	}else{
		
		annoScad = annoAtt;
	}
	
	if (meseScad<10){
		meseScad="0"+meseScad.toString();
	}else{
		meseScad=meseScad.toString();
	}
	
	var dataConteggio=giornoAtt.toString() + "/" + meseScad + "/" + annoScad.toString();
	jQuery("#dataScadenza").val(dataConteggio);
}


function controllaScadenza(){
	
	var dataScad=jQuery("#dataScadenza").val();
	
	if (dataScad != ''){
		
		var giorno=dataScad.substr(0,2);
		var mese=dataScad.substr(3,2);
		var anno=dataScad.substr(6,4);
		
		var dataControllo=anno+mese+giorno;
		
		if (controllo_data(dataControllo).previous){
			alert("Attenzione! Impossibile inserire una data antecedente alla data odierna");
			jQuery("#dataScadenza").val("").focus(); 
		}
	}
	
}



function differenzaDate() {
var dataIn=$('input[name=dataAttivazione]').val().substr(6,4)+$('input[name=dataAttivazione]').val().substr(3,2)+$('input[name=dataAttivazione]').val().substr(0,2);
var dataFin=$('input[name=dataScadenza]').val().substr(6,4)+$('input[name=dataScadenza]').val().substr(3,2)+$('input[name=dataScadenza]').val().substr(0,2);		

var diffDate=clsDate.difference.day(clsDate.str2date(dataFin,'YYYYMMDD',''),clsDate.str2date(dataIn,'YYYYMMDD',''));


return diffDate;

}

function cambiaDurata() {
	if($('input[name=dataAttivazione]').val()!=''  && $('input[name=dataScadenza]').val()!=''){
		$('input[name=txtDurata]').val(differenzaDate());
	}
	
}
