// JavaScript Document
var typeClose='S'
var typeFirma ='J'
function initOBJfirma(){
if (basePC.USO_APPLET_STAMPA=='S')
{
	initOBJfirmaJava()
}
else
{
	initOBJfirmaJava()
}
}
function initOBJfirmaActiveX(){
document.write('<OBJECT name="ocxfirma" classid="clsid:AF86D6D6-60BE-4B17-AB43-EC5B457BD9BB" id = "objocxfirma"');
document.write('<param name="ID_vuoto" value="">');
document.write('<param name="ID_referto" value="' + ID_referto + '">');
document.write('<param name="password_data" value="' + password_data + '">');
document.write('<param name="utente_data" value="' + utente_data + '">');
document.write('<param name="progr" value="' + progr + '">');
document.write('<param name="cdc"value="' + cdc + '">');
document.write('<param name="tipoDb" value="' + tipoDb + '">');
document.write('<param name="utente_web" value="' + utente_web + '">');
document.write('<param name="utente_connesso" value="' + utente_connesso + '">');
document.write('<param name="numero_copie"value="' + numero_copie + '">');
document.write('<param name="percorso_http" value="' + percorso_http + '">');
document.write('<param name="driver_string" value="' + driver_string + '">');
document.write('<param name="stampante" value="' + basePC.PRINTERNAME_REF_CLIENT + '">');
document.write('</OBJECT>');
//window.onbeforeunload = function chiudiConsolle(){closeCNS();};
window.onunload = function (){closeforzata();};
document.all.ocxfirma.start_firma();
setFocusOnPin();
}

function initOBJfirmaJava(){

document.write('<APPLET CODE = firma.appFirma ARCHIVE = "Firma_ALL.zip,PDFOne.jar" WIDTH = '+ screen.availWidth +' HEIGHT = '+ screen.availHeight +' NAME = "firmaApplet">');
document.write('<param name="iden_ref" value="' + ID_referto + '">');
document.write('<param name="progr" value="' + progr + '">');
document.write('<param name="StringConnection" value="">');
document.write('<param name="risoluzione" value="1">');
document.write('<param name="driver" value="">');
document.write('<param name="user" value="">');
document.write('<param name="psw" value=""');
document.write('<param name="file_log" value="1">');
document.write('<param name="n_file" value="1">');
document.write('<param name="firma" value="S">');
document.write('<param name="typeFirma" value="PDF">');
document.write('<param name="stampante" value="">');
document.write('<param name="ncopie" value="1">');
document.write('<param name="urlPdf" value="http://localhost:8080/polaris/strutturato.pdf">');
document.write('<param name="stampa_auto" value="N">');
document.write('<param name="chiudi_auto" value="N">');
document.write('<param name= "attivaTimeStamp" value="N">');
document.write('<param name="ksPath" value="C:\\windows\\system32\\CACerts.jks"">');
document.write('<param name="ksUrl" value="http://192.168.1.204/Imagowebdhe_produzione/main/gesreferti/versioni_referti/CACerts.jks"">');
document.write('<param name="PKCS11_Path" value="C:\\windows\\system32\\SI_PKCS11.dll"">');
document.write('<param name="PKCS11_Url" value="http://192.168.1.204/Imagowebdhe_produzione/main/gesreferti/versioni_referti/SI_PKCS11.dwn">');
document.write('<param name="posizioneRet" value="N">');
document.write('<param name="Location" value="N">');
document.write('<param name="Motivo" value="N">');
document.write('<param name="timeStampURL" value="http://timestamping.edelweb.fr/service/tsp/">');
document.write('<param name="iden_ope" value="N">');
document.write('<param name="cod_fisc_ope" value="N">');
document.write('<param name="applicativo" value="polaris">');
document.write('<param name="n_firme" value="2">');
document.write('<param name="posizione_firme" value="a#b">');
document.write('<param name="solo_stampa" value="N">');
document.write('</APPLET>');

}
function setFocusOnPin(){

	var oggetto

	oggetto = document.getElementById("objocxfirma");

	try{
		if (oggetto){

			oggetto.focus();
			oggetto.focusOK();
		}
	}
	catch(e){
		;
	}
}

function closeforzata (prova){

if (document.id_chiusura.HinputFirmatoS_N.value=='N')
	{
	        if (typeClose=='S')
                {

            //    Update_Firmato.RollBackDb(ID_referto+'*'+progr,aggiornaForm2);
					opener.closeforzata(ID_referto+'*'+progr);
		  self.close();

                }
}
else
{
	self.close();
}

}

function closeCNS(prova){
var conferma
if (document.id_chiusura.HinputFirmatoS_N.value=='N')
	{

	conferma=confirm("Verranno Perse Tutte Le Modifiche continuare?")

	if (conferma)
	{
		//Update_Firmato.RollBackDb(ID_referto+'*'+progr,aggiornaForm);
		opener.chiudi();
		self.close();
	}


}
else
{
	opener.chiudi();
	self.close();
}
}
function closeOnlyFirma()
{

        typeClose='N'
        self.close();
	//Update_Firmato.RollBackDb(ID_referto+'*'+progr,aggiornaForm2);

}

function salva_refertoFirmato(){

if(document.id_aggiorna.HinputRefFirmato.value.length > 50 )

{
if (document.id_aggiorna.HinputDAO.value.length<3)
{
document.id_aggiorna.HinputDAO.value="NO";
}

		Update_Firmato.UpdateDBDAO(ID_referto+'*'+progr+'*'+document.id_aggiorna.HinputRefValidatoFirmato.value+'*'+document.id_aggiorna.HIden_vr.value+'*'+document.id_aggiorna.HinputRefFirmato.value+'*'+document.id_aggiorna.HinputDAO.value,aggiornaForm)

		try {
		opener.registrazioneAbilitata = false;
			// diabilito medico refertante
		opener.disableLinkMedRiferimento();
			// nascondo il pulsante di salvataggio
		opener.hideSaveButton();
		}
		catch(e){
			;
		}
	}
	else
	{

		//Update_Firmato.RollBackDb(ID_referto+'*'+progr,aggiornaForm2);

	}


}


function aggiornaForm(ret){
if (ret=="0")
{
  document.id_chiusura.HinputFirmatoS_N.value='S'
}
else
{
  alert("Errore Archiviazione Firma  " + ret)
  document.id_chiusura.HinputFirmatoS_N.value='N'
}

}


function aggiornaForm2(ret){

if (ret=="")
{
  document.id_chiusura.HinputFirmatoS_N.value='S'
self.close();
}
else
{
  alert("Errore Archiviazione Firma  " + ret)
  document.id_chiusura.HinputFirmatoS_N.value='N'
self.close();
}

}
