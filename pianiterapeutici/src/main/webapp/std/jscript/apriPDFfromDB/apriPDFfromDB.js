jQuery(document).ready(function()
{
	$('.classTabHeaderMiddle').html('PDF');
});

function initMainObject(pdfPosition){
	var reqAnteprima 		= 'S';
	var StampaSu			= 'N';
	var selezionaStampante	= '';
	var OffsTop				= '-1';
	var OffsLeft			= '-1';
	var Rotation			= '-1';
	var contatore=0;
	if (pdfPosition.substring(1,5)=='noRef')
	{
		alert("Esame non disponibile o in errore la lettura da db");
		self.close();
		return;
	}
	var UrlImago= pdfPosition;
	var altezza = screen.height-60;
	var largh 	= screen.width-25;
	if (reqAnteprima=='N')
	{
		altezza = "0";
		largh	 = "0";
	}
	document.write('<object CLASSID="clsid:969CB476-504B-41CF-B082-1B8CDD18323A" CODEBASE="cab/pdfControl/prjXPdfReader.CAB#version=1,0,0,2"  id="pdfReader">');

	document.write('<param name="width"	  		value="'+largh+'">');	
	document.write('<param name="height"  		value="'+altezza+'">');	
	document.write('<param name="top"     		value="0">');	
	document.write('<param name="left"    		value="0">');	
	document.write('<param name="preview" 		value="'+reqAnteprima+'">');	
	document.write('<param name="PDFurl"  		value="'+UrlImago+'">');		
	document.write('<param name="OffTop"  		value="'+OffsTop+'">');
	document.write('<param name="OffLeft" 		value="'+OffsLeft+'">');
	document.write('<param name="Rotate"  		value="'+Rotation+'">');
	document.write('<param name="trace"   		value="S">');
	document.write('<param name="numCopy"		value="1">');		
	document.write('<param name="zoomFactor" 	value="70">');				
	document.write('<param name="zoomFit" 		value="">');
	document.write('<param name="printerName" 	value="'+selezionaStampante+'">');		
	document.write('<param name="driverName" 	value="">');		
	document.write('<param name="portName" 		value="">');						
	document.write('</object>');
	document.all.pdfReader.printAll();
	if (reqAnteprima=='N')
	{
		if (StampaSu=='N')
		{			
			document.all.pdfReader.stampa_silenziosa();
			top.close();
		}
		else 
		{	
			document.all.pdfReader.printWithDialog();
			top.close();
		}
	}

	
//	for (contatore = 0; contatore < UrlImago.length ; contatore++)
//	{
//
//		document.all.pdfReader.PDFurl=UrlImago[contatore];
//
//		document.all.pdfReader.printAll();
//		if (reqAnteprima=='N')
//		{
//			if (StampaSu=='N')
//			{			
//				document.all.pdfReader.stampa_silenziosa();
//				top.close();
//			}
//			else 
//			{	
//				document.all.pdfReader.printWithDialog();
//				top.close();
//			}
//		}
//	}
}
