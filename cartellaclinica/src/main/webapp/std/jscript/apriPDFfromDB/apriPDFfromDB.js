
var WindowCartella = null;

jQuery(document).ready(function()
{
	$('.classTabHeaderMiddle').html('PDF');
});

function initMainObject(pdfPosition){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

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
	document.write('<object CLASSID="clsid:969CB476-504B-41CF-B082-1B8CDD18323A" CODEBASE="cab/pdfControl/prjXPdfReader.CAB#version=2,0,0,0"  id="pdfReader">');
//	document.write('<object CLASSID="clsid:F9FCC8AE-31CB-4C13-B997-BECB4BAD9C23" CODEBASE="cab/pdfControl/prjXPdfReader.CAB#version=2,0,0,0"  id="pdfReader">');

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
	document.write('<param name="zoomFactor" 	value="100">');				
	document.write('<param name="zoomFit" 		value="">');
	document.write('<param name="printerName" 	value="'+selezionaStampante+'">');		
	document.write('<param name="driverName" 	value="">');		
	document.write('<param name="portName" 		value="">');						
	document.write('</object>');
	//document.all.pdfReader.printAll();

	if (reqAnteprima=='N')
	{
		document.all.pdfReader.stampa_silenziosa();
        WindowCartella.close();
	}
	else
	{
		document.all.pdfReader.printAll();
	}
}
