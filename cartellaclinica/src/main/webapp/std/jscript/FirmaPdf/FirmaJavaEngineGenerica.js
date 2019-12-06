var salvaFirma='KO';

/*$(document).ready(function(){
	InizializzaFirma();
});
*/

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
	var typeProcedura = $('[name="TYPE_PROCEDURE"]').val();
	switch(typeProcedura) 
	{ 
  		case 'LETTERA_DIMISSIONI_DH':getInfoLettera(viewInfo); 
  		break; 

  		case 'LETTERA_AL_CURANTE': getInfoLettera(viewInfo); 
  		break;  		

  		case 'LETTERA_PRIMO_CICLO': getInfoLettera(viewInfo); 
  		break;  		
  		
  		case 'CONSULENZE_REFERTAZIONE': getInfoConsulenza(viewInfo);
  		break;

  		case 'PIANO_TERAPEUTICO': eval(document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_BEFORE.value);//preparaFirmaPT();
  		break;

  		case 'LETTERA_TRASFERIMENTO': eval(document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_BEFORE.value);//preparaLetTrasferimento();
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
	campoFiltro  = 'IDEN';/*(da trasformare in campoDaFiltrare LATO JAVA)*/															
	/* valore di iden_esame */
	valoreFiltro = idenTes;
	alert('getInfoConsulenza')
	
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
	valoriParametri.push($('[name="TYPE_PROCEDURE"]').val());	

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
	valoriParametri.push($('[name="TYPE_PROCEDURE"]').val());	

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
	valoriParametri.push($('[name="TYPE_PROCEDURE"]').val());	

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

function preparaLetteraTrasferimento()
{
	var spToCallBefore = document.formConfigurazioneFirma.PROC_TO_CALL_BEFORE.value;
	var valoriParametri = new Array();	
	var tipiParametri = new Array();	
	
	/*da qui si impostano i parametri da passare alla SP tipi['CLOB','VARCHAR',,'NUMBER','FLOAT']*/	

	tipiParametri.push('VARCHAR');
	valoriParametri.push($('[name="TYPE_PROCEDURE"]').val());	

	tipiParametri.push('VARCHAR');
	valoriParametri.push(tabella);	

	tipiParametri.push('NUMBER');
	valoriParametri.push(idenLettera);		

	tipiParametri.push('NUMBER');
	valoriParametri.push(idenVisita);	
	
	tipiParametri.push('NUMBER');
	valoriParametri.push(idenPer);					

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

		switch($('[name="TYPE_PROCEDURE"]').val()) { 
  
  		case 'LETTERA_DIMISSIONI_DH': pdfPosition+=componiPdfUrlLetteraDimissioni(); 
  		break;
  		
  		case 'LETTERA_AL_CURANTE': pdfPosition+=componiPdfUrlLettera(); 
  		break;  		

  		case 'LETTERA_PRIMO_CICLO': pdfPosition+=componiPdfUrlLettera(); 
  		break;  		  		

  		case 'CONSULENZE_REFERTAZIONE': pdfPosition+=componiPdfUrlConsulenza();
  		break;

  		case 'LETTERA_TRASFERIMENTO': pdfPosition+=componiPdfUrlLetteraTrasferimento();
  		break;
  		
  		default: pdfPosition+=componiPdfUrlPT()
		}

		sleep(500);
		document.all.ocxfirma.start_firma(pdfPosition);	
	}
	else
	{
		alert(variReturn);
	}
}

function componiPdfUrlLetteraDimissioni()
{
	var allegati			= allegaDatiStr.split("#")[0];
	if(allegati == 'S'){
		var concatenazioneIden 	= allegaDatiStr.split("#")[1];
		concatenazioneIden 		= checkLastComma(concatenazioneIden);
		var concatenazioneEsami = allegaDatiStr.split("#")[2];
		concatenazioneEsami 	= checkLastComma(concatenazioneEsami);
	}else{
		concatenazioneIden		= '';
		concatenazioneEsami		= '';
	}
	return "&prompt<pVisita>="+setParam.arrParam['IDEN_VISITA']+"&prompt<pFunzione>='"+typeFirma+"'"+"&prompt<pIdenAnag>="+idenAnag+"&prompt<pReparto>="+repartoDati+"&prompt<pConcatenazioneIden>="+concatenazioneIden+"&prompt<pAllega>="+allegati+"&prompt<pConcatenazioneEsami>="+concatenazioneEsami;
}

function componiPdfUrlLettera()
{
	var idenAnag 			= '';
	var repartoDati 		= '';
	var concatenazioneIden 	= '';
	var concatenazioneEsami = '';
	var allegati			= 'N';
	return "&prompt<pVisita>="+setParam.arrParam['IDEN_VISITA']+"&prompt<pFunzione>='"+typeFirma+"'"+"&prompt<pIdenAnag>="+idenAnag+"&prompt<pReparto>="+repartoDati+"&prompt<pConcatenazioneIden>="+concatenazioneIden+"&prompt<pAllega>="+allegati+"&prompt<pConcatenazioneEsami>="+concatenazioneEsami;
}

function componiPdfUrlConsulenza()
{
	return "&prompt<pIdenTR>="+setParam.arrParam['IDEN']+"&prompt<pIdenVersione>="+idenReferto;//+"&prompt<pIdenPer>="+parseInt(baseUser.IDEN_PER)+"&prompt<pDataEsa>='"+dataEsame+"'";
}

function componiPdfUrlPT()
{
	return "&prompt<pIdenTestata>="+idenTestataPT;
}

function componiPdfUrlLetteraTrasferimento()
{	
	return "&prompt<pVersione>="+idenLettera;
}

function salva_pdf_consulenza()
{
	var valoriParametri = new Array();	
	var tipiParametri = new Array();
	/*da qui si impostano i parametri da passare alla SP*/
	tipiParametri.push('VARCHAR');
	valoriParametri.push($('[name="TYPE_PROCEDURE"]').val());
	
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
	valoriParametri.push($('[name="TYPE_PROCEDURE"]').val());

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

function salva_pdf_lettera_trasferimento()
{
	var valoriParametri = new Array();	
	var tipiParametri = new Array();
	/*da qui si impostano i parametri da passare alla SP*/
	tipiParametri.push('VARCHAR');
	valoriParametri.push($('[name="TYPE_PROCEDURE"]').val());

	tipiParametri.push('VARCHAR');
	valoriParametri.push(tabella);

	tipiParametri.push('NUMBER');
	valoriParametri.push(idenLettera);	
	
	tipiParametri.push('NUMBER');
	valoriParametri.push(idenVisita);	

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
	valoriParametri.push($('[name="TYPE_PROCEDURE"]').val());
	
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

var closeFirma= false;
function closeAnteprima()
{
	closeFirma=true;
	var proc;
	var typeProcedure = $('[name="TYPE_PROCEDURE"]').val();
	if (typeProcedure=='LETTERA_DIMISSIONI_DH' || typeProcedure=='LETTERA_AL_CURANTE' || typeProcedure=='LETTERA_PRIMO_CICLO')
	{
		opener.top.apriLetteraDimissioniNew(typeFirma);
	}
	else if (typeProcedure=='CONSULENZE_REFERTAZIONE')
	{
		if (salvaFirma=='KO')
		{
			dwr.engine.setAsync(false);
			dwrPreparaFirma.resetFirma('{call CC_RESET_CONSULENZA(?)}',$('#idenTes').val(),afterReset);	
			dwr.engine.setAsync(true);
		}
		//OnFileClose();
		opener.chiudi();
	}
	else if (typeProcedure=='LETTERA_TRASFERIMENTO')
	{
		//OnFileClose();
		if (salvaFirma == 'KO'){
			//se lo stato della lettera precedente è F, allora la riattivo e cancello l'ultima inserita(cancellando anche la riga su cc_firma_pdf)
			if (statoLetteraPrecedente!=undefined && statoLetteraPrecedente=='F')
			{
				
				var resp = executeStatement("letteraTrasferimento.xml","rollbackLetteraTrasferimento",[idenLetteraPrecedente,idenLettera,typeFirma]);
 
				if (resp[0]=='OK')
					opener.location.reload();
				else
					alert('Errore Update di Rollback: '+ resp[1]);
			}
		}
		else	
			opener.location.reload();
	}
	else
	{
		opener.chiudiPt();
	}
	self.close();
	
}

function executeStatement(pFileName , pStatementName , pBinds , pOutsNumber){
	var vResponse;
	top.dwr.engine.setAsync(false);
	dwrUtility.executeStatement(pFileName,pStatementName,pBinds,(typeof pOutsNumber=='undefined'?0:pOutsNumber),callBack);
	top.dwr.engine.setAsync(true);
	return vResponse;

	function callBack(resp){
		vResponse = resp;
	}
}


$(window).unload(function() {
		if (closeFirma==false)
			closeAnteprima();
	});

function afterReset(ret){}


function checkLastComma(concatenazione){
	var concatenazioneCheck = '';
	if (concatenazione.substr(concatenazione.length-1,concatenazione.length) == ','){
		concatenazioneCheck = concatenazione.substr(0,concatenazione.length-1);
	}else{
		concatenazioneCheck = concatenazione;
	}
	return concatenazioneCheck;
	
};