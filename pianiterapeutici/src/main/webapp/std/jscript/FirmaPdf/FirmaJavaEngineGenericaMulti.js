var salvaFirma='KO';

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++)if ((new Date().getTime() - start) > milliseconds)break;
}
function InizializzaFirma(){
	if (!checkCodFisc()){
		parametriActiveX = {
				'height' : screen.height - 100,
				'width' : screen.width - 25,
				'printerName' : basePC.PRINTERNAME_REF_CLIENT,
				'zoomFactor' : 125
			};		
		appendOcx(parametriActiveX);
		/*setto il js da chiamare per salvare il pdf in b64*/
		document.id_aggiorna.action = document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_AFTER.value;
		var viewInfo = document.formConfigurazioneFirma.VIEW_TO_TAKE_JS.value;
		eval(document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_BEFORE.value);//preparaFirmaPT();
		
		$('#divButtonFirma').click(function() {
	    	var objcheck = checkControlFirma();
	    	if (!objcheck.controllo){
	    		alert(objcheck.messaggio);
	    		return tornaIndietro();
	    	}
			var obj = checkPin();
			if (obj.controllo){
				firma_documento(obj.valore);				
			}else{
				alert(obj.messaggio)
			}
		});
		
		$('#inputPinFirma').keyup(function(e) {
		    //alert(e.keyCode);
		    if(e.keyCode == 13) {
		    	var objcheck = checkControlFirma();
		    	if (!objcheck.controllo){
		    		alert(objcheck.messaggio);
		    		return tornaIndietro();
		    	}
		    	var obj = checkPin();
		    	if (obj.controllo){
					firma_documento(obj.valore);				
				}else{
					alert(obj.messaggio)
				}		    	
		    }
		});
		
		
		$('#inputPinFirma').focus();
		
	}else{
		alert('Codice fiscale associato alla smartcard diverso dall\'utente loggato. Procedura di firma interrotta');
		return self.close();		
	}
}

function preparaFirmaPT()
{
	var spToCallBefore = document.formConfigurazioneFirma.PROC_TO_CALL_BEFORE.value;
	var valoriParametri = new Array();	
	var tipiParametri = new Array();	
	
	/*da qui si impostano i parametri da passare alla SP tipi['CLOB','VARCHAR',,'NUMBER','FLOAT']*/	

	tipiParametri.push('VARCHAR');
	valoriParametri.push(typeFirma);	

	tipiParametri.push('VARCHAR');
	valoriParametri.push(tabella);	
	/*IDEN della Tabella PT_TESTATA*/
	tipiParametri.push('NUMBER');
	valoriParametri.push(idenTestataPT);		

	var iden_visita = 0;
	
	tipiParametri.push('NUMBER');
	valoriParametri.push(iden_visita);	
	
	tipiParametri.push('NUMBER');
	valoriParametri.push(iden_per);					

	/*fine parametri per la SP*/
	dwr.engine.setAsync(false);
	dwrPreparaFirma.preparaFirma(spToCallBefore,tipiParametri,valoriParametri,afterdwrPreparazione);
	dwr.engine.setAsync(true);
}



function afterdwrPreparazione (variReturn){
	if(variReturn==null || variReturn=='')
	{
		var pdfPosition =""
		pdfPosition+=document.formConfigurazioneFirma.webScheme.value+'://';
		pdfPosition+=document.formConfigurazioneFirma.webServerName.value+':';
		pdfPosition+=document.formConfigurazioneFirma.webServerPort.value;
		pdfPosition+=document.formConfigurazioneFirma.webContextPath.value;
		
		reparto  = document.formConfigurazioneFirma.REPARTO.value;
		report   = document.formConfigurazioneFirma.REPORT.value;
		sfReport = document.formConfigurazioneFirma.WHERE_REPORT.value;

		pdfPosition+='/ServletStampe?';
		pdfPosition+='report=' + reparto + '/' + report;

		pdfPosition+=componiPdfUrlPT();
		document.all.pdfReader.PDFurl = pdfPosition;
		document.all.pdfReader.printAll();
	}
	else
	{
		alert(variReturn);
	}
}

function componiPdfUrlPT()
{
	var sf = '';
	if (baseGlobal.SITO=='ASL2')
		sf = "&prompt<pIdenTestata>="+idenTestataPT;
	else
		sf = "&prompt<pIdenTestata>="+idenTestataPT+"&prompt<pNotaInFondo>=S";
	
	return sf;
}

function salva_pdf_PT()
{
	var valoriParametri = new Array();	
	var tipiParametri = new Array();
	/*da qui si impostano i parametri da passare alla SP*/
	tipiParametri.push('VARCHAR');
	valoriParametri.push(typeFirma);
	
	tipiParametri.push('VARCHAR');
	valoriParametri.push(tabella);

	tipiParametri.push('NUMBER');
	valoriParametri.push(idenTestataPT);	

	var idenVisita=0;
	tipiParametri.push('NUMBER');
	valoriParametri.push(idenVisita);	

	tipiParametri.push('CLOB');
	valoriParametri.push(document.id_aggiorna.HinputRefFirmato.value);

	var spToCallAfter = document.formConfigurazioneFirma.PROC_TO_CALL_AFTER.value;

	dwr.engine.setAsync(false);
	dwrPreparaFirma.archiviaFirma(spToCallAfter,tipiParametri,valoriParametri,afterSaveOK);	
	dwr.engine.setAsync(true);
}




function afterSaveOK(rit)
{
	salvaFirma = rit.split('*')[0];
	if (salvaFirma=='OK'){
		$('#spanFirmato').text('REFERTO FIRMATO DIGITALMENTE DA '+ baseUser.DESCRIPTION);
		var funzione = 'PIANO_TERAPEUTICO';
		var pdfPosition=document.formConfigurazioneFirma.webScheme.value+'://';
		pdfPosition+=document.formConfigurazioneFirma.webServerName.value+':';
		pdfPosition+=document.formConfigurazioneFirma.webServerPort.value;
		pdfPosition+=document.formConfigurazioneFirma.webContextPath.value;
		pdfPosition+="/ServleTReadPDF?db=&iden="+idenTestataPT+"&funzione="+funzione+"&progressivo=0";

		parametriActiveX = {
				'height' : screen.height - 100,
				'width' : screen.width - 25,
				'printerName' : basePC.PRINTERNAME_REF_CLIENT,
				'zoomFactor' : 125
			};
		
//		RICARICO l'activex di stampa con la url del pdf firmato recuperata dal db questo perchè se no alla fine della firma il pdf si presenterebbe vuoto
//		a causa della cancellazione di tutti i record su cc_lettera_versioni che hanno creato il report da firmare
		$('body').find('object#pdfReader').remove();
		var objStampa = '<object classid="clsid:AD4EF313-6690-48CF-8A55-CFA1DDF111A0" codebase="cab/pdfControlFirma/prjXPdfReader.CAB#version=1,0,0,0" id="pdfReader" name="pdfReader">';
		objStampa += '<param name="width" value="' + parametriActiveX.width + '" />';
		objStampa += '<param name="height" value="' + parametriActiveX.height + '" />';
		objStampa += '<param name="top" value="0" />';
		objStampa += '<param name="left" value="0" />';
		objStampa += '<param name="preview" value="S" />';
		objStampa += '<param name="PDFurl" value="'+pdfPosition+'" />';
		objStampa += '<param name="OffTop" value="-1" />';
		objStampa += '<param name="OffLeft" value="-1" />';
		objStampa += '<param name="Rotate" value="0" />';
		objStampa += '<param name="trace" value="S" />';
		objStampa += '<param name="numCopy" value="0" />';
		objStampa += '<param name="zoomFactor" value="' + parametriActiveX.zoomFactor+ '" />';
		objStampa += '<param name="zoomFit" value="" />';
		objStampa += '<param name="printerName" value="' + parametriActiveX.printerName	+ '" />';
		objStampa += '<param name="driverName" value="" />';
		objStampa += '<param name="portName" value="" />';
		objStampa += '<param name="visualizzaBottoniStampa" value="True" />';					
		objStampa += '</object>';
		$('body').append(objStampa);
		
		document.all.pdfReader.PDFurl = pdfPosition;
		document.all.pdfReader.printAll();
		
        $('#divFirmato').show();
	}else{
		alert('Errore durante il salvataggio del pdf firmato sul database. Contattare l\'assistenza');
		tornaIndietro();
	}
}


function retrieveProgressivo(iden_testata_pt,funzione){
	
	var progressivo = '';
 
	 dwr.engine.setAsync(false); 
	 toolKitDB.getResultData('select max(progr) from CC_FIRMA_PDF where iden_tab = ' + iden_testata_pt + ' and funzione = \''+funzione+'\'', resp_check);
	 dwr.engine.setAsync(true);
	 
	 function resp_check(resp){
		 progressivo=resp;
	 }
 
	 return progressivo;
}

function closeAnteprima()
{
	var proc;
	try
	{
		tornaIndietro();
		//opener.pianoTerapeutico.chiudiPt();
	}
	catch(e){
		// Eccezione usata per gestire la chiamata della firma del piano terapeutico da worklist
	}
	self.close();
	
}


function afterReset(ret)
{
	//alert(ret);	
}

function tornaIndietro(){
	try{
		opener.pianoTerapeutico.chiudiPt();
	}
	catch(e){
	try{	
		opener.parent.ricercaPT();
	}
	catch(e){}
	}

	self.close();

}

function tornaIndietroBtn(){
	try{	
		opener.parent.ricercaPT();
	}
	catch(e){
		if (opener.document.EXTERN.STATO.value =='MC')
			opener.location.replace("servletGenerator?KEY_LEGAME=PIANO_TERAPEUTICO&idRemoto="+idRemoto+"&IDEN="+idenXml+"&IDEN_TESTATA="+idenTestataPT+"&STATO=MC&FIRMATO="+opener.document.EXTERN.FIRMATO.value);			
		else	
			opener.location.replace("servletGenerator?KEY_LEGAME=PIANO_TERAPEUTICO&idRemoto="+idRemoto+"&IDEN="+idenXml+"&IDEN_TESTATA="+idenTestataPT+"&STATO=M&FIRMATO=N");
	}	
	self.close();
}

function appendOcx(options){
		var objStampa = '<object classid="clsid:AD4EF313-6690-48CF-8A55-CFA1DDF111A0" codebase="cab/pdfControlFirma/prjXPdfReader.CAB#version=1,0,0,0" id="pdfReader" name="pdfReader">';
		objStampa += '<param name="width" value="' + options.width + '" />';
		objStampa += '<param name="height" value="' + options.height + '" />';
		objStampa += '<param name="top" value="0" />';
		objStampa += '<param name="left" value="0" />';
		objStampa += '<param name="preview" value="S" />';
		objStampa += '<param name="PDFurl" value="" />';
		objStampa += '<param name="OffTop" value="-1" />';
		objStampa += '<param name="OffLeft" value="-1" />';
		objStampa += '<param name="Rotate" value="0" />';
		objStampa += '<param name="trace" value="S" />';
		objStampa += '<param name="numCopy" value="0" />';
		objStampa += '<param name="zoomFactor" value="' + options.zoomFactor
				+ '" />';
		objStampa += '<param name="zoomFit" value="" />';
		objStampa += '<param name="printerName" value="' + options.printerName
				+ '" />';
		objStampa += '<param name="driverName" value="" />';
		objStampa += '<param name="portName" value="" />';
		objStampa += '<param name="visualizzaBottoniStampa" value="False" />';			
		objStampa += '</object>';
		$('body').append(objStampa);

		var objFirma = '<object classid="clsid:C85A6712-F5AC-4C35-947A-34F8B0E4645C" id="firma_multipla" name="firma_multipla">';
		objFirma += '<param name="width" value="' + options.width + '"/>';
		objFirma += '<param name="height" value="' + options.height + '"/>';
		objFirma += '<param name="percorso_http" value="'+options.printerName+'"/>';
		objFirma += '<param name="stampante" value="'+options.printerName+'"/>';
		objFirma += '<param name="webapp" value="whale"/>';				
		objFirma += '</object>';

		$('body').append(objFirma);	
}

function 	checkCodFisc() {
	dgst = new ActiveXObject("CCypher.Digest");
	var codfisc = dgst.GetSmartCardProperty(16);

	if (typeof (codfisc) == undefined) {
		alert('Dispositivo smartcard non collegato correttamente / CompEd non avviato correttamente')
		return true;
	}

	if (baseUser.COD_FISC != codfisc) {
		return true;
	} else {
		return false;
	}
}


function checkControlFirma(){
	/*Controllo la presenza dell'activex*/
	if (typeof (document.all.firma_multipla.Firma_documento_whale)=='undefined' && typeof (document.all.firma_multipla.Firma_documento)=='undefined'){
		return {'controllo':false,'messaggio':'Errore durante il caricamento dell\'activex di firma multipla, prego contattare assistenza.','valore':''};
	}else{
		return {'controllo':true,'messaggio':'','valore':''};
	}
}

function checkPin(){		
	if ($('#inputPinFirma').val()==''){
		return {'controllo':false,'messaggio':'Inserire il pin prima di procedere a firmare','valore':''}
	}
	else{
		return {'controllo':true,'messaggio':'true','valore':$('#inputPinFirma').val()}
	}
}

function firma_documento(txtpin){
    $('#divButtonFirma').hide();
    $('#divInputFirma').hide();
    $('#divFirmato').show();
    var ret;
	var pwdSbagliata;
	
//		passo la url, il documento e N(per la stampa automatica) e l'activex mi ritorna il base64
	var pdfFirmato = '';
	if (typeof (document.all.firma_multipla.Firma_documento_whale)=='undefined'){
		pdfFirmato = document.all.firma_multipla.Firma_documento(document.all.pdfReader.PDFurl,txtpin,'N')
	}else{
		pdfFirmato = document.all.firma_multipla.Firma_documento_whale(document.all.pdfReader.PDFurl,txtpin,'N')
	}	
//	var pdfFirmato = document.all.firma_multipla.Firma_documento_whale(document.all.pdfReader.PDFurl,txtpin,'N')
//		Se il pdffirmato viene ritornato vuoto, evidenzio un errore. Probabilmente dovuto a un errore dell'activex
	if (pdfFirmato == ''){
		$('#divButtonFirma').show();
	    $('#divInputFirma').show();
	    $('#divInputFirma').val('');
	    $('#divFirmato').hide();
	    alert('Firma Fallita, problema relativo all\'activex di firma. Rivolgersi all\'assistenza.');
		pwdSbagliata = true;	
		return false;
	}
//		per ogni documento, cerco la configurazione associata per la funzinoe di salvataggio del pdf -> NS_MAPPING_FIRMA[val.mapping.famiglia][val.mapping.afterFirma]
	document.id_aggiorna.HinputRefFirmato.value = pdfFirmato;
	salva_pdf_PT();
	
}