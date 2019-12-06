var salvaFirma='KO';

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++)if ((new Date().getTime() - start) > milliseconds)break;
}
function InizializzaFirma(){

	document.write('<OBJECT name="ocxfirma" classid="clsid:BE1968E9-C85D-4B6A-AA9F-C2CA1DC20299" id = "objocxfirma"');
	document.write('<param name="utente_web" value="">');
	document.write('<param name="utente_connesso" value=\"'+baseUser.IDEN_PER+'\">');
	document.write('<param name="codice_fiscale" value=\"'+baseUser.COD_FISC+'\">');
	document.write('<param name="numero_copie"value="1">');
	document.write('<param name="percorso_http" value="">');
	document.write('<param name="stampante" value="">');
// AGGIUNTO QUESTO CAMPO SOLO PER ASL1
	if (baseGlobal.SITO=='ASL1'){
		document.write('<param name="zoom" value="70">');
	}
	document.write('</OBJECT>');
	/*setto il js da chiamare per salvare il pdf in b64*/
	document.id_aggiorna.action = document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_AFTER.value;
	var viewInfo = document.formConfigurazioneFirma.VIEW_TO_TAKE_JS.value;
/* javascript:salva_pdf(); */
	/*if (typeFirma=='LETTERA_STANDARD')
	{
		getInfoLettera();
	}
	else
	{
		getInfoConsulenza();		
	}
	*/

	switch(typeFirma) 
	{ 
  		case 'LETTERA_DIMISSIONI_DH':getInfoLettera(viewInfo); 
  		break; 

  		case 'LETTERA_AL_CURANTE': getInfoLettera(viewInfo); 
  		break;  		

  		case 'LETTERA_PRIMO_CICLO': getInfoLettera(viewInfo); 
  		break;  		
  		
  		case 'REFERTAZIONE_CONSULENZE': getInfoConsulenza();
  		break;

  		case 'PIANO_TERAPEUTICO': eval(document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_BEFORE.value);//preparaFirmaPT();
  		break;

  		default: null; 
  	}
}

/*Carico l'array set param con gli oggetti ottenuti dalla vista*/
function getInfoLettera(viewInfo)
{
	var campoFiltro;
	var valoreFiltro;
	/* VIEW_CC_LETTERA_DA_FIRMARE */
	/* il campo da filtrare è idenVisita */
	campoFiltro  = campoDaFiltrare;		
	/* valore di idenVisita */
	valoreFiltro = whereReport;
	
	dwr.engine.setAsync(false);
	dwrPreparaFirma.getInfo(viewInfo,campoFiltro,valoreFiltro,PreparaFirma);
	dwr.engine.setAsync(true);
}

/*Carico l'array set param con gli oggetti ottenuti dalla vista*/
function getInfoConsulenza(viewInfo)
{
	var campoFiltro;
	var valoreFiltro;
	/* VIEW_CC_CONSULENZA_DA_FIRMARE */
	/* il campo da filtrare è l'iden_esame */
	campoFiltro  = 'IDEN_ESAME';/*(da trasformare in campoDaFiltrare LATO JAVA)*/															
	/* valore di iden_esame */
	valoreFiltro = idenEsame;
	
	dwr.engine.setAsync(false);
	dwrPreparaFirma.getInfo(viewInfo,campoFiltro,valoreFiltro,PreparaFirma);
	dwr.engine.setAsync(true);
}


function setParam(nome, valore){
	if(typeof setParam.arrParam == 'undefined')
		setParam.arrParam= new Array();
	setParam.arrParam[nome] = valore;	
}

function PreparaFirma(resp){
	if (resp!='')
	{
		/*Errore ritornato dalla chiamata al dwr getInfo()*/
		alert(resp);
	}
	else
	{
		/* PreparaFirmaLettera() */
		eval(document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_BEFORE.value);					
	}
}

function PreparaFirmaLettera(){
/* Chiama la procedura che inserisce all'interno di cc_firma_pdf un record su cui fare l'update
	SP_CC_NUOVA_VERSIONE_FIRMA
*/
	var spToCallBefore = document.formConfigurazioneFirma.PROC_TO_CALL_BEFORE.value;

	var valoriParametri = new Array();	
	var tipiParametri = new Array();	
	
	/*da qui si impostano i parametri da passare alla SP tipi['CLOB','VARCHAR',,'NUMBER','FLOAT']*/	

	tipiParametri.push('VARCHAR');
	valoriParametri.push(typeFirma);	

	tipiParametri.push('VARCHAR');
	valoriParametri.push(setParam.arrParam['TABELLA']);	

	/* Iden Della Lettera*/
	tipiParametri.push('NUMBER');
	valoriParametri.push(setParam.arrParam['IDEN']);	

	tipiParametri.push('NUMBER');
	valoriParametri.push(whereReport);	

	tipiParametri.push('NUMBER');
	valoriParametri.push(baseUser.IDEN_PER);					

	/*fine parametri per la SP*/
	dwr.engine.setAsync(false);
	dwrPreparaFirma.preparaFirma(spToCallBefore,tipiParametri,valoriParametri,afterdwrPreparazione);
	dwr.engine.setAsync(true);
}

function PreparaFirmaConsulenza(){
/* Chiama la procedura che inserisce all'interno di cc_firma_pdf un record su cui fare l'update
	SP_CC_NUOVA_VERSIONE_FIRMA
*/
	var spToCallBefore = document.formConfigurazioneFirma.PROC_TO_CALL_BEFORE.value;

	var valoriParametri = new Array();	
	var tipiParametri = new Array();	
	
	/*da qui si impostano i parametri da passare alla SP tipi['CLOB','VARCHAR',,'NUMBER','FLOAT']*/	

	tipiParametri.push('VARCHAR');
	valoriParametri.push(typeFirma);	

	tipiParametri.push('VARCHAR');
	valoriParametri.push(setParam.arrParam['TABELLA']);	
	/* Iden Del Referto*/
	tipiParametri.push('NUMBER');
	valoriParametri.push(idenReferto);		

	tipiParametri.push('NUMBER');
	valoriParametri.push(whereReport);	
	
	tipiParametri.push('NUMBER');
	valoriParametri.push(baseUser.IDEN_PER);					

	/*fine parametri per la SP*/
	dwr.engine.setAsync(false);
	dwrPreparaFirma.preparaFirma(spToCallBefore,tipiParametri,valoriParametri,afterdwrPreparazione);
	dwr.engine.setAsync(true);
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

		//pdfPosition = 'http://192.168.1.20:8081/whaleTest';

		pdfPosition+='/ServletStampe?';
		pdfPosition+='report=' + reparto + '/' + report;
		//pdfPosition+='&sf=' + sfReport + whereReport;

		switch(typeFirma) { 
  
  		case 'LETTERA_DIMISSIONI_DH': pdfPosition+=componiPdfUrlLettera(); 
  		break;
  		
  		case 'LETTERA_AL_CURANTE': pdfPosition+=componiPdfUrlLettera(); 
  		break;  		

  		case 'LETTERA_PRIMO_CICLO': pdfPosition+=componiPdfUrlLettera(); 
  		break;  		  		

  		case 'REFERTAZIONE_CONSULENZE': pdfPosition+=componiPdfUrlConsulenza();
  		break;

  		default: pdfPosition+=componiPdfUrlPT();
		}

		setTimeout(function(){document.all.ocxfirma.start_firma(pdfPosition);},500);
/*		sleep(500);		
		document.all.ocxfirma.start_firma(pdfPosition);	*/
	}
	else
	{
		alert(variReturn);
	}
}

function componiPdfUrlLettera()
{
	return "&prompt<pVisita>="+setParam.arrParam['IDEN_VISITA']+"&prompt<pFunzione>='"+typeFirma+"'";
}

function componiPdfUrlConsulenza()
{
	return "&prompt<pIdenTR>="+setParam.arrParam['IDEN']+"&prompt<pIdenVersione>="+idenReferto+"&prompt<pIdenPer>="+parseInt(baseUser.IDEN_PER)+"&prompt<pDataEsa>='"+dataEsame+"'";
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

function retrieveInfo(){
	
	dgst = new ActiveXObject("CCypher.Digest");
	for (i=0;i<22;i++)
	{var risposta=dgst.GetSmartCardProperty(i);
	alert(i+'\n'+risposta);}
	var stringa='';
	
	return stringa;
	
}

/*function salva_pdf()
{
	var valoriParametri = new Array();	
	var tipiParametri = new Array();

	tipiParametri.push('VARCHAR');
	valoriParametri.push(typeFirma);
	
	tipiParametri.push('VARCHAR');
	valoriParametri.push(setParam.arrParam['TABELLA']);

	if (typeFirma!='LETTERA_STANDARD')
	{
	tipiParametri.push('NUMBER');
	valoriParametri.push(idenReferto);
	}
	else
	{
	tipiParametri.push('NUMBER');
	valoriParametri.push(setParam.arrParam['IDEN']);	

	}
	tipiParametri.push('NUMBER');
	valoriParametri.push(setParam.arrParam['IDEN_VISITA']);	

	tipiParametri.push('CLOB');
	valoriParametri.push(document.id_aggiorna.HinputRefFirmato.value);

	if (typeFirma!='LETTERA_STANDARD')
	{
		tipiParametri.push('NUMBER');
		valoriParametri.push(idenEsame);

		tipiParametri.push('NUMBER');
		valoriParametri.push(baseUser.IDEN_PER);

		tipiParametri.push('VARCHAR');
		valoriParametri.push(dataEsame );

		tipiParametri.push('VARCHAR');
		valoriParametri.push(oraEsame);

		tipiParametri.push('VARCHAR');
		valoriParametri.push(validaFirma);
	}

	var spToCallAfter = document.formConfigurazioneFirma.PROC_TO_CALL_AFTER.value;

	dwrPreparaFirma.archiviaFirma(spToCallAfter,tipiParametri,valoriParametri,afterSaveOK);
	
}*/

function salva_pdf_consulenza()
{
	var valoriParametri = new Array();	
	var tipiParametri = new Array();
	/*da qui si impostano i parametri da passare alla SP*/
	tipiParametri.push('VARCHAR');
	valoriParametri.push(typeFirma);
	
	tipiParametri.push('VARCHAR');
	valoriParametri.push(setParam.arrParam['TABELLA']);

	tipiParametri.push('NUMBER');
	valoriParametri.push(idenReferto);
	
	tipiParametri.push('NUMBER');
	valoriParametri.push(setParam.arrParam['IDEN_VISITA']);	

	tipiParametri.push('CLOB');
	valoriParametri.push(document.id_aggiorna.HinputRefFirmato.value);

	tipiParametri.push('NUMBER');
	valoriParametri.push(idenEsame);

	tipiParametri.push('NUMBER');
	valoriParametri.push(baseUser.IDEN_PER);

	tipiParametri.push('VARCHAR');
	valoriParametri.push(dataEsame );

	tipiParametri.push('VARCHAR');
	valoriParametri.push(oraEsame);

	tipiParametri.push('VARCHAR');
	valoriParametri.push(validaFirma);

	var spToCallAfter = document.formConfigurazioneFirma.PROC_TO_CALL_AFTER.value;
	dwr.engine.setAsync(false);
	dwrPreparaFirma.archiviaFirma(spToCallAfter,tipiParametri,valoriParametri,afterSaveOK);	
	dwr.engine.setAsync(true);
}

function salva_pdf_lettera()
{
	var valoriParametri = new Array();	
	var tipiParametri = new Array();
	/*da qui si impostano i parametri da passare alla SP*/
	tipiParametri.push('VARCHAR');
	valoriParametri.push(typeFirma);

	tipiParametri.push('VARCHAR');
	valoriParametri.push(setParam.arrParam['TABELLA']);

	tipiParametri.push('NUMBER');
	valoriParametri.push(setParam.arrParam['IDEN']);	

	tipiParametri.push('NUMBER');
	valoriParametri.push(setParam.arrParam['IDEN_VISITA']);	

	tipiParametri.push('CLOB');
	valoriParametri.push(document.id_aggiorna.HinputRefFirmato.value);

	var spToCallAfter = document.formConfigurazioneFirma.PROC_TO_CALL_AFTER.value;

	dwr.engine.setAsync(false);
	dwrPreparaFirma.archiviaFirma(spToCallAfter,tipiParametri,valoriParametri,afterSaveOK);
	dwr.engine.setAsync(true);
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
}

function closeAnteprima()
{
	var proc;
	if (typeFirma=='LETTERA_DIMISSIONI_DH' || typeFirma=='LETTERA_AL_CURANTE' || typeFirma=='LETTERA_PRIMO_CICLO')
	{
//		OnFileClose();
//		opener.top.apriLetteraDimissioni(typeFirma);
		opener.top.apriLetteraDimissioniNew(typeFirma);

	}
	else if (typeFirma=='REFERTAZIONE_CONSULENZE')
	{
		if (salvaFirma=='KO')
		{
			dwr.engine.setAsync(false);
			dwrPreparaFirma.resetFirma('{call CC_RESET_CONSULENZA(?,?)}',idenReferto,idenEsame,afterReset);	
			dwr.engine.setAsync(true);
		}
		//OnFileClose();
		opener.chiudi();
	}
	else if (typeFirma=='PIANO_TERAPEUTICO')
	{
		try
		{
			tornaIndietro();
			//opener.pianoTerapeutico.chiudiPt();
		}
		catch(e){
			// Eccezione usata per gestire la chiamata della firma del piano terapeutico da worklist
		}
	}
	self.close();
	
}

function OnFileClose()
{	
	var w;
   	w = new ActiveXObject("WScript.Shell");
	w.run("taskkill.exe /im DigitalSignPro.exe");
	return true;
	
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

//$(window).unload(function() {
//
//		closeAnteprima();
//	});