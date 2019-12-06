/*TAB_APP_MXSCREEN*/
document.write('<script type="text/javascript" src="dwr/engine.js" language="JavaScript"></script>');
document.write('<script type="text/javascript" src="dwr/util.js" language="JavaScript"></script>');
document.write('<script type="text/javascript" src="dwr/interface/Update_Firmato.js" language="JavaScript"></script>');
document.write('<script type="text/javascript" src="std/jscript/tutto_schermo.js" language="JavaScript"></script>');
var cod_per;
var iden_anag;
var iden_esa;
var iden_esame;
//var urlXml 		= 'http://192.168.1.20:8081/polarisProduzione/XML2DB';


function appropriatezza_screening(idenAnag, idenEsame, codPer, idenEsa, urlXml)
{
	 cod_per 	= codPer;
	 iden_anag 	= idenAnag;
	 iden_esame = idenEsame;
	 iden_esa   = idenEsa;
	 
	 urlXml = urlXml + 'XML2DB';
	
	//alert('cod_per=' + codPer + ' - anag=' + idenAnag + ' - esame=' + idenEsame + ' - urlXml= ' + urlXml);

	document.write('<script>');
	document.write('tutto_schermo();');
	document.write('</script>');

	document.write('<form accept-charset="UNKNOWN" method="POST" name="id_chiusura" action="javascript:chiudi_screening();" enctype="application/x-www-form-urlencoded"><input name="HSalvato" type="hidden" value=""></form>');
	document.write('<OBJECT ID="Mammo" CLASSID="clsid:5E179C44-D4E5-4E65-A8D5-2ADFD181A288" height="768" width="1024">');
	document.write('<param name="CodUteLogin" value="' + cod_per + '">');
	document.write('<param name="idPaz" value="' + iden_anag + '">');
	document.write('<param name="strIdenEsa" value="' + iden_esame + '">');
	document.write('<param name="UrlXml" value="' + urlXml + '">');
	document.write('</OBJECT>');
	document.write('<script>');
	document.write('document.Mammo.StartMammo();');
	document.write('</script>');
}

/*TAB_APP_LIV2SCREEN*/
function appropriatezza_screening2(idenAnag, idenEsame, codPer, idenEsa, urlXml)
{
	 cod_per 	= codPer;
	 iden_anag 	= idenAnag;
	 iden_esame = idenEsame;
	 iden_esa   = idenEsa;
	 
	 urlXml = urlXml + 'XML2DB';
	 
	 if(opener.name=="leftConsolle")
	 {
		//alert('--->2 -- cod_per=' + codPer + ' - anag=' + idenAnag + ' - esame=' + idenEsame); //D50F12DE-022F-407C-A73D-F043B8EADFBD
		document.write('<form accept-charset="UNKNOWN" method="POST" name="id_chiusura" action="javascript:chiudi_liv2screening();" enctype="application/x-www-form-urlencoded"><input name="HSalvato" type="hidden" value=""></form>');
		document.write('<OBJECT ID="Mammo" CLASSID="CLSID:D50F12DE-022F-407C-A73D-F043B8EADFBD" height="768" width="1024>" CODEBASE="../../Cab/prjScreening/prgApprof.cab#version=1,0,0,3">');
		document.write('<param name="CodUteLogin" value="' + cod_per + '">');
		document.write('<param name="idPaz" value="' + iden_anag + '">');
		document.write('<param name="strIdenEsa" value="' + iden_esame + '">');
		document.write('<param name="UrlXml" value="' + urlXml + '">');
		document.write('</OBJECT>');
		document.write('<script>');
		document.write('document.Mammo.StartMammoApp();');
		document.write('</script>');
	 }
	 else{
		//Viene eseguito l'esame e reso appropriato
		//Chi inserisce il record in appropriatezza_esame?Jack quando mette lo stato come appropriato inserisce il record in appropriatezza_esame???
		Update_Firmato.UpdateEseguitoAppropriato(iden_esame);
		opener.aggiorna();
		self.close();
	}
}


function chiudi_screening(){
	if(document.id_chiusura.HSalvato.value=="true")
	{
		Update_Firmato.UpdateEseguitoAppropriato(iden_esame);
		if (opener.name!="leftConsolle")
		{
			opener.aggiorna();
			self.close();
		}
		else
		{

			opener.document.frmMain.HactionAfterSave.value = "CLOSE";
			opener.registra();
			self.close();
		}
	}
else
	{
		opener.aggiorna();
		self.close();
	}
}



function chiudi_liv2screening(){

	if (document.id_chiusura.HSalvato.value=="true")
	{
		Update_Firmato.UpdateEseguitoAppropriato(iden_esame);
		if (opener.name!="leftConsolle")
		{
			opener.aggiorna();
			self.close();
		}
		else
		{

			self.close();
		}
	}
else
	{
		opener.aggiorna();
		self.close();
	}
}
