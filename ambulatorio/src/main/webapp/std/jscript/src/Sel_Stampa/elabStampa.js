//JavaScript Document
var typeFirma ='J'


	function initMainObject(pdfPostion,reqAnteprima){
	try{
		initbasePC()
		initbaseGlobal()
		initbaseUser()


		if (basePC.USO_APPLET_STAMPA=='S')
		{
			initOBJStampaJava(pdfPostion,reqAnteprima)
		}
		else
		{
			initOBJStampaActiveX(pdfPostion,reqAnteprima)
		}
	}
	catch (e)
	{
		initOBJStampaActiveX(pdfPostion,reqAnteprima)
	}
}

function getAbsolutePathServer ()
{
	var value = "";

	try{
		var loc = window.location;
		var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
		value = loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
	}
	catch(e){
		alert("getAbsolutePathServer - Error: "+ e.description);
	}
	return value;
}

function initOBJStampaActiveX(pdfPostion,reqAnteprima){

	var contatore=0;

	try{
		if (pdfPosition=='noRef')
		{alert("Esame non ancora Refertato");
		self.close();}

		var pd = pdfPosition.split("/");
		// 		http://localhost:8080/polaris/ServletStampe?report=AMB/REFERTO_RP.RPT&sf=%7Besami.iden%7D%3D1150963
		//alert(pdfPosition);
		pdfPosition = getAbsolutePathServer();
		//alert(pdfPosition);
		for(var i=4; i < pd.length; i++)
		{
			if(i > 4)
				pdfPosition += '/';

			pdfPosition += pd[i];
		}

		Url=pdfPosition.split('<!!>');
		UrlImago="";
		altezza = screen.height-60;
		largh = screen.width-25;
		//alert(n_copie);
		//altezza = 700;
		//largh = 1000;
		if (requestAnteprima=='N'){
			altezza="0";
			largh="0";
		}
		//alert(n_copie);
		if (n_copie=='0')
		{
			n_copie=window.showModalDialog('n_copie.html','','center:1;dialogHeight:110px;dialogWidth:480px;status:0');
		}
		document.write('<object CLASSID="clsid:969CB476-504B-41CF-B082-1B8CDD18323A" CODEBASE="cab/pdfControl/prjXPdfReader.CAB"  id="pdfReader">');
		// id="pdfReader">');
		document.write('<param name="width" value="'+largh+'">');
		document.write('<param name="height" value="'+altezza+'">');
		document.write('<param name="top" value="0">');
		document.write('<param name="left" value="0">');
		document.write('<param name="preview" value="S">');
		document.write('<param name="PDFurl" value="'+UrlImago+'">');
		document.write('<param name="OffTop" value="'+OffsTop+'">');
		document.write('<param name="OffLeft" value="'+OffsLeft+'">');
		document.write('<param name="Rotate" value="'+Rotation+'">');
		document.write('<param name="trace" value="S">');
		document.write('<param name="numCopy" value="'+n_copie+'">');
		document.write('<param name="zoomFactor" value="125">');
		document.write('<param name="zoomFit" value="">');
		document.write('<param name="printerName" value="'+selezionaStampante+'">');
		//alert(selezionaStampante);
		document.write('<param name="driverName" value="">');
		document.write('<param name="portName" value="">');
		document.write('</object>');
		//sState = document.readyState
		//alert(sState);
		//alert('OK'+n_copie);

		for (contatore = 0; contatore < Url.length ; contatore++)
		{
			document.all.pdfReader.PDFurl=Url[contatore];
			if (requestAnteprima=='S'){
				document.all.pdfReader.printAll();
			}
			else if (requestAnteprima=='N')
			{
				if (StampaSu=='N')
				{
					document.all.pdfReader.stampa_silenziosa();
					callFromAX();
				}
				else
				{
					document.all.pdfReader.printWithDialog();
					callFromAX();
				}
			}

		}
	}
	catch(e){
		alert("initOBJStampaActiveX - error: " + e.description);
	}
}



function closeAnteprima()
{

	if (sorgente=='worklist')
	{
		try
		{
			opener.aggiorna();
		}
		catch(ex)
		{
		}
		self.close();
	}
	else
	{
		try
		{
			opener.aggiorna();
		}
		catch(ex)
		{
		}

		self.close();
	}
}
function cbk_stampa()
{

	LogJavascript = null;
}

function Inizializza()
{

	initbasePC();
	initbaseGlobal();
	initbaseUser();
	//alert(stampaReparto);
}

function callFromAX()
{


//	alert('SP_AFTER_PRINT@IString#IString#IString#IString@' + stampaIdenEsame + '#0#'+baseUser.IDEN_PER+'#'+stampaFunzioneStampa, after_dwr_stampato);// + '@O#S');
	try{
		functionDwr.launch_sp('SP_AFTER_PRINT@IString#IString#IString#IString@' + stampaIdenEsame + '#0#'+baseUser.IDEN_PER+'#'+stampaFunzioneStampa, after_dwr_stampato);// + '@O#S', risposta_cancella_versione);
	}
	catch(e)
	{
		after_dwr_stampato();
	}
}

function after_dwr_stampato(a)
{
	if (requestAnteprima=='N')
	{
		/*
			try
			{
				opener.aggiorna();
			}
			catch(ex)
			{
			}
			self.close();
		 */
		closeAnteprima();
	}
}



function initOBJStampaJava(pdfPostion,reqAnteprima){

	document.write('<APPLET CODE = firma.appFirma ARCHIVE = "std/app/Firma_ALL.zip,std/app/Firma_EXT.zip,std/app/PDFOne.jar" WIDTH = '+ screen.availWidth  +' HEIGHT = '+ (screen.availHeight - 150) +' NAME = "firmaApplet">');
	document.write('<param name="iden_ref" value="">');
	document.write('<param name="progr" value="">');
	document.write('<param name="StringConnection" value="">');
	document.write('<param name="risoluzione" value="1">');
	document.write('<param name="driver" value="com.microsoft.sqlserver.jdbc.SQLServerDriver">');
	document.write('<param name="user" value="radsql">');
	document.write('<param name="psw" value="password"');
	document.write('<param name="file_log" value="1">');
	document.write('<param name="n_file" value="1">');
	document.write('<param name="firma" value="S">');
	document.write('<param name="typeFirma" value="P7M">');
	document.write('<param name="stampante" value="'+selezionaStampante+'">');
	document.write('<param name="ncopie" value="'+n_copie+'">');

	document.write('<param name="urlPdf" value="'+pdfPostion+'">');
	document.write('<param name="stampa_auto" value="N">');
	document.write('<param name="chiudi_auto" value="N">');
	document.write('<param name= "attivaTimeStamp" value="N">');
	document.write('<param name="ksPath" value="C:\\windows\\system32\\CACerts.jks"">');
	document.write('<param name="ksUrl" value="http://192.168.1.204/Imagowebdhe_produzione/main/gesreferti/versioni_referti/CACerts.jks"">');
	document.write('<param name="PKCS11_Path" value="C:\\windows\\system32\\SI_PKCS11.dll"">');
	document.write('<param name="PKCS11_Url" value="http://192.168.1.204/Imagowebdhe_produzione/main/gesreferti/versioni_referti/SI_PKCS11.dwn">');
	document.write('<param name="posizioneRet" value="N">');
	document.write('<param name="Location" value="N">');
	document.write('<param name="Motivo" value="N">');
	document.write('<param name="timeStampURL" value="http://timestamping.edelweb.fr/service/tsp/">');
	document.write('<param name="iden_ope" value="N">');
	document.write('<param name="cod_fisc_ope" value="N">');
	document.write('<param name="applicativo" value="polaris">');
	document.write('<param name="n_firme" value="2">');
	document.write('<param name="posizione_firme" value="a#b">');
	document.write('<param name="solo_stampa" value="S">');
	document.write('</APPLET>');
	if (requestAnteprima=='N')
	{
		document.firmaApplet.startAppletPdfPrintDirect();
		callFromAX();
	}
	else
	{
		document.firmaApplet.startAppletPdf();
	}
}
