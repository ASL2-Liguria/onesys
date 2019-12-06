var salvaFirma='KO';

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++)if ((new Date().getTime() - start) > milliseconds)break;
}
function InizializzaFirma(){
	//setVeloNero('body');
	document.write('<OBJECT name="ocxfirma" classid="clsid:BE1968E9-C85D-4B6A-AA9F-C2CA1DC20299" id = "objocxfirma"');
	document.write('<param name="utente_web" value="">');
	document.write('<param name="utente_connesso" value=\"'+baseUser.IDEN_PER+'\">');
	document.write('<param name="codice_fiscale" value=\"'+baseUser.COD_FISC+'\">');
	document.write('<param name="numero_copie"value="1">');
	document.write('<param name="percorso_http" value="">');
	document.write('<param name="stampante" value="">');
	document.write('</OBJECT>');

		
	
	/*setto il js da chiamare per salvare il pdf in b64*/
	document.id_aggiorna.action = document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_AFTER.value;/* javascript:salva_pdf(); */
	var viewInfo =document.formConfigurazioneFirma.VIEW_TO_TAKE_JS.value;

	var campoFiltro;
	var valoreFiltro;
	if (typeProcedure=='LETTERA_STANDARD' || typeProcedure=='LETTERA_PROSECUZIONE')
	{
		/* VIEW_CC_LETTERA_DA_FIRMARE */
		/* il campo da filtrare è idenVisita */
		campoFiltro  = campoDaFiltrare;		
		/* valore di idenVisita */
		valoreFiltro = whereReport;			
	}
	else
	{						
		/* VIEW_CC_CONSULENZA_DA_FIRMARE */
		/* il campo da filtrare è l'iden_esame */
		campoFiltro  = 'IDEN_ESAME';															
		/* valore di iden_esame */
		valoreFiltro = idenEsame;			
	}
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
		alert(resp);
	else
		eval(document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_BEFORE.value);					/* PreparaFirmaLettera() */
}

function PreparaFirmaLettera(){

	var spToCallBefore = document.formConfigurazioneFirma.PROC_TO_CALL_BEFORE.value;

	var valoriParametri = new Array();	
	var tipiParametri = new Array();	
	
	/*da qui si impostano i parametri da passare alla SP tipi['CLOB','VARCHAR',,'NUMBER','FLOAT']*/	

	tipiParametri.push('VARCHAR');
	valoriParametri.push(typeProcedure);	

	tipiParametri.push('VARCHAR');
	valoriParametri.push(setParam.arrParam['TABELLA']);	

	if (typeProcedure=='LETTERA_STANDARD' || typeProcedure=='LETTERA_PROSECUZIONE')
	{
		tipiParametri.push('NUMBER');
		valoriParametri.push(setParam.arrParam['IDEN']);	
}
	else
	{
		tipiParametri.push('NUMBER');
		valoriParametri.push(idenReferto);		
	}		

	tipiParametri.push('NUMBER');
	valoriParametri.push(whereReport);	
	
	tipiParametri.push('NUMBER');
	valoriParametri.push(baseUser.IDEN_PER);					

	/*fine parametri per la SP*/
	dwr.engine.setAsync(false);
	dwrPreparaFirma.preparaFirma(spToCallBefore,tipiParametri,valoriParametri,afterdwrPreparazione);
	dwr.engine.setAsync(true);
}

function afterdwrPreparazione (variReturn){
	if(variReturn==null || variReturn=='')
	{
		var pdfPosition ="";
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

		if (typeProcedure=='LETTERA_STANDARD' || typeProcedure=='LETTERA_PROSECUZIONE')
		{	
			var allegati				= allegaDatiStr.split("#")[0];
		
			if(allegati == 'S'){
				var concatenazioneIden 	= allegaDatiStr.split("#")[1];
				concatenazioneIden 		= checkLastComma(concatenazioneIden);
				var concatenazioneEsami = allegaDatiStr.split("#")[2];
				concatenazioneEsami 	= checkLastComma(concatenazioneEsami);
			}else{
				concatenazioneIden		= '';
				concatenazioneEsami		= '';
			}			
			pdfPosition+='&prompt<pVisita>='+setParam.arrParam['IDEN_VISITA']+'&prompt<pIdenAnag>='+idenAnag+'&prompt<pReparto>='+repartoDati+'&prompt<pConcatenazioneIden>='+concatenazioneIden+'&prompt<pAllega>='+allegati+'&prompt<pConcatenazioneEsami>='+concatenazioneEsami;
		}
		else
		{
			pdfPosition+="&prompt<pIdenTR>="+setParam.arrParam['IDEN']+"&prompt<pIdenVersione>="+idenReferto;//+"&prompt<pIdenPer>="+parseInt(baseUser.IDEN_PER)+"&prompt<pDataEsa>='"+dataEsame+"'";
		}

		sleep(500);
		document.all.ocxfirma.start_firma(pdfPosition);
		removeVeloNero('body');	
	}
	else
	{
		alert(variReturn);
	}
}

function salva_pdf(){
	var valoriParametri = new Array();	
	var tipiParametri = new Array();
	/*da qui si impostano i parametri da passare alla SP*/
	tipiParametri.push('VARCHAR');
	valoriParametri.push(typeProcedure);
	
	tipiParametri.push('VARCHAR');
	valoriParametri.push(setParam.arrParam['TABELLA']);

	if (typeProcedure=='LETTERA_STANDARD' || typeProcedure=='LETTERA_PROSECUZIONE')
	{
		tipiParametri.push('NUMBER');
		valoriParametri.push(setParam.arrParam['IDEN']);
	}
	else
	{
		tipiParametri.push('NUMBER');
		valoriParametri.push(idenReferto);

		tipiParametri.push('NUMBER');
		valoriParametri.push(idenRefOld);	
	}
	tipiParametri.push('NUMBER');
	valoriParametri.push(setParam.arrParam['IDEN_VISITA']);	

	tipiParametri.push('CLOB');
	valoriParametri.push(document.id_aggiorna.HinputRefFirmato.value);

	/*fine parametri per la SP*/
	if (typeFirma=='CONSULENZE_REFERTAZIONE')
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
	dwr.engine.setAsync(false);
	dwrPreparaFirma.archiviaFirma(spToCallAfter,tipiParametri,valoriParametri,afterSaveOK);
	dwr.engine.setAsync(true);	
}
function afterSaveOK(rit)
{
	salvaFirma = rit.split('*')[0];
}

var proc='KO';
function closeAnteprima()
{
	if (typeProcedure=='LETTERA_STANDARD' || typeProcedure=='LETTERA_PROSECUZIONE')
	{
		opener.top.apriLetteraDimissioni(typeProcedure);
	}
	else
	{
		if (salvaFirma=='KO')
		{		
			dwr.engine.setAsync(false);
			dwrPreparaFirma.resetFirma('{call CC_RESET_CONSULENZA(?)}',idenEsame,afterReset);	
			dwr.engine.setAsync(true);
		}else{
			opener.chiudi();
		}
		
	}
}

function OnFileClose()
{	
	var w;
   	w = new ActiveXObject("WScript.Shell");
	w.run("taskkill.exe /im DigitalSignPro.exe");
	return true;	
}

function tornaIndietro(){
	if (typeProcedure=='LETTERA_STANDARD' || typeProcedure=='LETTERA_PROSECUZIONE')
	{
		try{
			//opener.top.refreshPage();
			self.close(); 
		}
		catch(e){}
	}
	else{
		try{
			self.close();
		}
		catch(e){}
	}
}


function afterReset(ret)
{
	opener.chiudi();
}

$(window).unload(function(){
			closeAnteprima();
	});
	
function checkLastComma(concatenazione){
	var concatenazioneCheck = '';
	if (concatenazione.substr(concatenazione.length-1,concatenazione.length) == ','){
		concatenazioneCheck = concatenazione.substr(0,concatenazione.length-1);
	}else{
		concatenazioneCheck = concatenazione;
	}
	return concatenazioneCheck;
	
};

function apriStampaGlobale(){
	if (salvaFirma=='KO')
		alert('La lettera non è firmata digitalmente.\n La stampa della cartella è momentamente non disponibile');
	else	
		opener.top.stampaGlobaleCartella();
}