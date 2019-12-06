	  
function caricaPDF(pdfPosition){

//  Applet di Fabio per visualizzare PDF (in questo caso la lettera di dimissione);

	//alert (pdfPosition);
	
	document.write('<APPLET CODE = firma.appFirma ARCHIVE = "std/app/Firma_ALL.zip,std/app/Firma_EXT.zip,std/app/PDFOne.jar" WIDTH = '+ screen.availWidth  +' HEIGHT = '+ (screen.availHeight - 150) +' NAME = "firmaApplet">');

	document.write('<param name="iden_ref" value="">');

	document.write('<param name="progr" value="">');

	document.write('<param name="StringConnection" value="">');

	document.write('<param name="risoluzione" value="1">');

	document.write('<param name="driver" value="com.microsoft.sqlserver.jdbc.SQLServerDriver">');

	document.write('<param name="user" value="radsql">');

	document.write('<param name="psw" value=""');

	document.write('<param name="file_log" value="1">');

	document.write('<param name="n_file" value="1">');

	document.write('<param name="firma" value="N">');

	document.write('<param name="typeFirma" value="P7M">');

	document.write('<param name="stampante" value="">');

	document.write('<param name="ncopie" value="1">');

	document.write('<param name="urlPdf" value="'+pdfPosition+'">');

	document.write('<param name="stampa_auto" value="N">');

	document.write('<param name="chiudi_auto" value="N">');

	document.write('<param name= "attivaTimeStamp" value="N">');

	document.write('<param name="ksPath" value="">');

	document.write('<param name="ksUrl" value="">');

	document.write('<param name="PKCS11_Path" value="">');

	document.write('<param name="PKCS11_Url" value="">');

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


	document.firmaApplet.startAppletPdf();

	}

