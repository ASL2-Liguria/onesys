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
	document.write('</OBJECT>');

	/*setto il js da chiamare per salvare il pdf in b64*/
	document.id_aggiorna.action = document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_AFTER.value;/* javascript:salva_pdf(); */
	var viewInfo =document.formConfigurazioneFirma.VIEW_TO_TAKE_JS.value;

	var campoFiltro;
	var valoreFiltro;
	if (typeFirma=='LETTERA_STANDARD')
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
	dwrPreparaFirma.getInfo(viewInfo,campoFiltro,valoreFiltro,PreparaFirma);
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
	valoriParametri.push(whereReport);	
	
	tipiParametri.push('NUMBER');
	valoriParametri.push(baseUser.IDEN_PER);					

	/*fine parametri per la SP*/
	dwrPreparaFirma.preparaFirma(spToCallBefore,tipiParametri,valoriParametri,afterdwrPreparazione);
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

		if (typeFirma=='LETTERA_STANDARD')
		{	
			pdfPosition+='&prompt<pVisita>='+setParam.arrParam['IDEN_VISITA'];
		}
		else
		{

			pdfPosition+="&prompt<pIdenTR>="+setParam.arrParam['IDEN']+"&prompt<pIdenVersione>="+idenReferto+"&prompt<pIdenPer>="+parseInt(baseUser.IDEN_PER)+"&prompt<pDataEsa>='"+dataEsame+"'";
		}
		alert(pdfPosition);

		sleep(500);

		document.all.ocxfirma.start_firma(pdfPosition);
		
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

	/*fine parametri per la SP*/
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
	
}
function afterSaveOK(rit)
{
	
	salvaFirma = rit.split('*')[0];
}

function closeAnteprima()
{
	var proc;
	if (typeFirma=='LETTERA_STANDARD')
	{
		//OnFileClose();
		opener.top.apriLetteraDimissioni(typeFirma);
	}
	else
	{
		if (salvaFirma=='KO')
		{
			dwrPreparaFirma.resetFirma('{call CC_RESET_CONSULENZA(?,?)}',idenReferto,idenEsame,afterReset);	
		}
		//OnFileClose();
		opener.chiudi();
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
$(window).unload(function() {

		closeAnteprima();
	});