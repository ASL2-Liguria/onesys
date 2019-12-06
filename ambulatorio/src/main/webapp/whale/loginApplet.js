/*Funzioni richiamate dall'applet*/
function initAppletLogout()
{	/*funzione ce andrà eliminata quando ci sarà solo la nuova homepage*/
	document.write('<OBJECT type="application/x-java-applet" height="0" width="0">');
	document.write('<param name="code" value="it.elco.applet.NomeHostSmartCardLogOff.class">');
	document.write('<param name="archive" value="std/app/SignedAppletHostSmartCard.jar">');	
	document.write('</OBJECT>');
}

function LogoutSmart(cf)
{
	try
	{
		top.closeWhale.chiudiWhale();
	}
	catch(e){
		
		alert('logout - loginapplet'+e.description)
	}
}

function LoginSmartCard(cf)
{
	try
	{
		startUpSmartCardManagement(cf);
	}
	catch(e)
	{
		
	}
}

function setHostName(nome_host,ip_rilevato)
{
	//$("#nomeHost").val(nome_host);		
}