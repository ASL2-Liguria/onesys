function InizializzaRFID()
{
  document.all.codRFID.focus();
  document.all.iframeRisultato.style.display="none"
  document.all.iframeVersioni.style.height="140"
}
function tastiCND()
{

if (window.event.keyCode==13)
	{

     	window.event.keyCode = 0;
     	verificaRFID()
 	}
}


function verificaRFID()
{
if (document.all.codRFID.value == "")
	{
	alert("Inserire il codice rfid del Braccialetto")
	return
	}


document.all.codRFID.value = document.all.codRFID.value.toUpperCase();
var hi = hiden_Esame

dwrRFID.Inserisci_confronta(hiden_Esame +'*'+document.all.codRFID.value,afterDWRverificaRFID);
}
function afterDWRverificaRFID(aa){

if (aa!='OK')
	{
	//alert("Il paziente selezionato non corrisponde al braccialetto verificato!!!")
	winSound = window.open('','suono','left=60,top=60,width=1,height=1,menubar=no,status=no,location=no,toolbar=no,scrollbars=no');
			try{
				if (winSound){
					winSound.document.write("<html><head><title>suono</title></head><body TOPMARGIN=0 LEFTMARGIN=0 MARGINHEIGHT=0 MARGINWIDTH=0><bgsound volume='0' src='sounds/KO.wav' id=music loop=10 autostart='true'><script type='text/javascript'>setTimeout('chiudi()', 1000);function chiudi(){self.close();}</script></body></html>");
				}

			}
			catch(e){
				alert("replyCheckUpdatedDataWk - error: " +  e.description);
			}
        document.all.iframeRisultato.src="std/jscript/RFID/KO.html"
        document.all.iframeRisultato.height="260"
	document.all.iframeRisultato.style.display = "block"
	document.all.codRFID.value = ""
	}
else
	{
        winSound = window.open('','suono','left=60,top=60,width=1,height=1,menubar=no,status=no,location=no,toolbar=no,scrollbars=no');
			try{
				if (winSound){
					winSound.document.write("<html><head><title>suono</title></head><body TOPMARGIN=0 LEFTMARGIN=0 MARGINHEIGHT=0 MARGINWIDTH=0><bgsound volume='0' src='sounds/OK.wav' id=music loop=10 autostart='true'><script type='text/javascript'>setTimeout('chiudi()', 1000);function chiudi(){self.close();}</script></body></html>");
				}

			}
			catch(e){
				alert("replyCheckUpdatedDataWk - error: " +  e.description);
			}

	document.all.iframeRisultato.src="std/jscript/RFID/OK.html"
    document.all.iframeRisultato.height="260"
	document.all.iframeRisultato.style.display = "block"

	document.all.codRFID.value = ""
	}
document.getElementById('iframeVersioni').src=document.getElementById('iframeVersioni').src;

}

function SalvaNote(intest)
{
dwrRFID.UpdateNote(IDEN+'*'+intest+'*0',afterSalva_Note)
}

function afterSalva_Note(inte)
{
	document.getElementById('iframeVersioni').src=document.getElementById('iframeVersioni').src;
}

function chiudi()
{
	opener.aggiorna();
	self.close();
}

function aggiorna()
{
	document.getElementById('iframeVersioni').src=document.getElementById('iframeVersioni').src;
}

function ForzaverificaRFID()
{
	var finestra  = window.open("SrvRFIDForza?HidenEsame="+hiden_Esame,"","top=100,left=100,width=600, height=300");

	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open("SrvRFIDForza?HidenEsame="+hiden_Esame,"","top=100,left=100,width=600, height=300");
	}
}


function InizializzaForzaEngine()
{
	setPage(document);
}

function SalvaForzaverificaRFID()
{
	
	dwrRFID.InserisciForzato(HidenEsame+'*'+document.all.cmbMotivo.value+'*'+document.all.txtLogin.value+'*'+document.all.txtPsw.value,afterDwrForza);
	
}
function afterDwrForza(variu)
{
	Dat=variu.split("[*]");
	if (Dat[0]=='OK')
	{
	dwrRFID.UpdateNote(HidenEsame+'* *'+ document.all.cmbMotivo.value,afterNoteForzate)
	}
	else
	{
	alert(variu);
	}
	
}
function afterNoteForzate()
{
	opener.aggiorna();
	self.close();
	opener.chiudi();
}
