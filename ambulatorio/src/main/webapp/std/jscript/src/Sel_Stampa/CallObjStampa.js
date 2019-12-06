function callAfterDwrUrl(url)
{

altezza = screen.height-60;
	largh = screen.width-25;
document.write('<object CLASSID="clsid:969CB476-504B-41CF-B082-1B8CDD18323A" CODEBASE="cab/pdfControl/prjXPdfReader.CAB" top="200" id="pdfReader">');
	// id="pdfReader">');
		document.write('<param name="width" value="'+largh+'">');
		document.write('<param name="height" value="'+altezza+'">');
		document.write('<param name="top" value="0">');
		document.write('<param name="left" value="0">');
		document.write('<param name="preview" value="S">');
		document.write('<param name="PDFurl" value="'+url+'">');
		document.write('<param name="OffTop" value="'+OffsTop+'">');
		document.write('<param name="OffLeft" value="'+OffsLeft+'">');
		document.write('<param name="Rotate" value="'+Rotation+'">');
		document.write('<param name="trace" value="S">');
		document.write('<param name="numCopy" value="'+n_copie+'">');
		document.write('<param name="zoomFactor" value="75">');
		document.write('<param name="zoomFit" value="">');
		document.write('<param name="printerName" value="'+selezionaStampante+'">');
		//alert(selezionaStampante);
		document.write('<param name="driverName" value="">');
		document.write('<param name="portName" value="">');
		document.write('</object>');
document.all.pdfReader.printAll();
}
