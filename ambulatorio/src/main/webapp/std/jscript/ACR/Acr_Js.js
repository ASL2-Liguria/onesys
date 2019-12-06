// JavaScript Document
function initACR() {

document.write('<object classid="clsid:869BE2E1-262D-49B0-901C-14B4DD46A44D" codebase="cab/ACR/ACR.CAB#version=3,0,0,0" Id="ACR">');
document.write('<param name="Enabled" value="-1">');
document.write('<param name="Appearance" value="1">');
document.write('<param name="Codice" value="' + codice + '">');
document.write('<param name="gestione" value="' + gestione + '">');
document.write('<param name="Indirizzo_Ip" value="' + db2xml_path + '">')
document.write('<param name="larghezza" value="' + (screen.height - (screen.height/12)) + '">')
document.write('<param name="altezza" value="' + (screen.width - (screen.width/70)) + '">')
document.write('</object>');

document.ACR.width=screen.width - (screen.width/70)
document.ACR.height=screen.height - (screen.height/12);

}

function apriACR(idenRef,op,codice) {

	wndAnag = window.open("SL_ACROCX?idenRef=" + idenRef + "&ACRopener=" + op + "&codice=" + codice,"","top=200,left=300,width=700,height=745,status=no,scrollbars=no");

		}
		
function ACRtoCampo (op) {
var a ="";
var campo;

if (op=='1')
{opener.document.formACR_Cons.Fie_Acr1.value=document.frmID2.hcodice.value
}
if (op=='2')
{opener.document.formACR_Cons.Fie_Acr2.value=document.frmID2.hcodice.value
}
if (op=='3')
{opener.document.formACR_Cons.Fie_Acr3.value=document.frmID2.hcodice.value
}
self.close();

}
function salvaTab()
{
	
	Update.UpdateDB(document.formACR_Cons.combo_scn1.value+"*"+document.formACR_Cons.combo_scn2.value+"*"+document.formACR_Cons.TxtNote.value+"*"+document.formACR_Cons.Fie_Acr1.value+"*"+document.formACR_Cons.Fie_Acr2.value+"*"+document.formACR_Cons.Fie_Acr3.value+"*"+document.formACR_Cons.idenRef.value,close_as);
}

function close_as(Errore)
{
	if (Errore.lenght>3)
	alert(Errore);
	self.close();
	
}

function caricaCodScie(){}