function InitAppImage()
{
	document.write('<applet archive="std/app/AppViewImage.jar,std/app/commons-codec-1.3.jar"  code="ij.ImageJApplet" name="TestApp">');
	document.write('<param name=urlDefault value="'+url_iden+'">');
	document.write('</applet>');
	
}
var test;
function saveImage()
{

	
	if (document.TestApp.getIsNew()=='SI')
	{
		
		var Descr = prompt("Inserire Descrizione Per L'immagine","");
		if (var_iden_tab_esa == null || var_iden_tab_esa=='')
		{
			var_iden_tab_esa=opener.parent.document.frmInfo.iden_tab_esa.value;
		}	
		dwrImmaginiEsame.SalvaImmagine('-1*'+opener.parent.hiden_Esame+'*'+var_iden_tab_esa+'*'+Descr+'*'+document.TestApp.getImage(),afterDwr);
	}
	else
	{
		if (opener.typeWK=='ImmaginiGeneriche')
		{
			var Descr = prompt("Inserire Descrizione Per L'immagine","");
			dwrImmaginiEsame.SalvaImmagine('-1*'+opener.parent.hiden_Esame+'*'+var_iden_tab_esa+'*'+Descr+'*'+document.TestApp.getImage(),afterDwr);
		}
		else
		{
			dwrImmaginiEsame.SalvaImmagine(var_iden+'*'+var_iden_esami+'*'+var_iden_tab_esa+'*TEST*'+document.TestApp.getImage(),afterDwr);
		}
	//var Descr = prompt("Inserire Descrizione Per L'immagine","");
	//dwrImmaginiEsame.SalvaImmagine(var_iden+'*'+var_iden_esami+'*'+var_iden_tab_esa+'*TEST*'+document.TestApp.getImage(),afterDwr);
	}
}

function afterDwr(){
	self.close();
}

function destroy_applet()
{
	document.TestApp.destroy();
}