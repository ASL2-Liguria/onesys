// JavaScript Document
function UrlIntegPS(tipo,reparto,idRichiesta,nosologico){
	var pdfPosition="";
	if (tipo=='D') 
	{
		pdfPosition ='http://10.105.106.175:8080/whale/ServletStampe?report=LABO_DATI_STRUTTURATI/LABO_PS.RPT&prompt<pNosologico>='+nosologico+'&prompt<pReparto>='+reparto;				
	}else if (tipo=='E')
	{
		//pdfPosition ='http://10.105.106.175:8080/whale/ServletStampe?report=LABO_METEOR/LABO_ETI_WHALE_PS.rpt&sf={VIEW_STAMPA_ETI_LAB_WHALE_PS.IDENTIFICATIVO_ESTERNO}='+idRichiesta;		
		pdfPosition ='http://10.105.106.175:8080/whale/ServletStampe?report=LABO_METEOR/LABO_ETI_WHALE_PS.rpt&prompt<pRichiesta>='+idRichiesta;
		//sf={VIEW_STAMPA_ETI_LAB_WHALE_PS.IDENTIFICATIVO_ESTERNO}='+idRichiesta;		

	}else if (tipo=='N')
	{
		pdfPosition ='http://10.105.106.183:8081/whaleproduzione/ServletStampe?report=LABO_METEOR/LABO_ETI_WHALE__NEFRO.RPT&prompt<pRichiesta>='+idRichiesta;	
	}
	else
	{
		pdfPosition='http://10.105.106.175:8080/whale/ServletStampe?report=PS/REFERTI_LABO_NO_FIRMATI.RPT&prompt<pRichiesta>='+idRichiesta;
}

	initMainObject(pdfPosition);	
}


function initMainObject(pdfPostion,reqAnteprima){
	//alert("qui: "+pdfPostion);
	
	var contatore=0;
	//tutto_schermo();
	if (pdfPosition=='noRef')
		{alert("Esame non ancora Refertato");
		self.close();}
	
/*	var pd = pdfPosition.split("/");
	
	pdfPosition = getAbsolutePath();
	for(var i=4; i < pd.length; i++)
	{
		if(i > 4)
			pdfPosition += '/';
		
		pdfPosition += pd[i];
	}
*/
	Url=pdfPosition.split('<!!>');
	//alert(Url[0]);
	UrlImago="";
	altezza = screen.height-60;
	largh = screen.width-25;
	//alert(n_copie);
	//altezza = 700;
	//largh = 1000;
	 if (requestAnteprima=='N')
		{altezza="0";
		 largh="0";
		}
	//alert(n_copie);
	if (n_copie=='0')	 
	{
			//alert();
			//n_copie=window.open('n_copie.html')
			//n_copie=
			
			
			n_copie=window.showModalDialog('n_copie.html','','center:1;dialogHeight:110px;dialogWidth:480px;status:0');
			//alert(n_copie);
	}
	var stampante = selezionaStampante.toString();

	var OffsTop	 = "-1";
	var OffsLeft = "-1";
	if (funzioneStampa=='RICETTA_ROSSA_FARMACI' || funzioneStampa=='RICETTA_ROSSA_PRESTAZIONI')
	{
		if 	(stampante.indexOf('ML-331x')>-1){
			OffsTop	 = "298";
			OffsLeft = "86";
			}
		// alert(' - stampante: ' + stampante + '\n - funzione: ' + funzioneStampa + '\n off top: '+ OffsTop + '\n Off Left: '+ OffsLeft);
		if 	(stampante.indexOf('SCX-483x')>-1){
			OffsTop	 = "295";
			OffsLeft = "85";
		}
	}

		 
	 document.write('<object CLASSID="clsid:969CB476-504B-41CF-B082-1B8CDD18323A" CODEBASE="cab/pdfControl/prjXPdfReader.CAB#version=1,0,0,2"  id="pdfReader">');
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
		document.write('<param name="zoomFactor" value="80">');				
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
		try {
			document.all.pdfReader.PDFurl=Url[contatore]+'&t='+new Date().getTime();
			//alert(Url[contatore]);
			document.all.pdfReader.printAll();
			if (requestAnteprima=='N')
			{
				//document.write('<param name="preview" value="N">');
				document.all.pdfReader.stampa_silenziosa();
				// document.all.pdfReader.printAll();
			}else{ 
				document.all.pdfReader.printWithDialog();
			}
		} catch (e) {}
		opener.parent.Ricerca();
		self.close();
	}
}



function closeAnteprima()
{
	if (sorgente=='worklist')
	{
		opener.aggiorna();
		top.close();
	}
	else
	{
		top.close();
	}
}
function cbk_stampa()
{
	
	LogJavascript = null;
}

function getAbsolutePath()
{
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}