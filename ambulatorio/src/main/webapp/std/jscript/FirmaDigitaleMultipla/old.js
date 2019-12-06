var pin="";
var tip_referti ="";
var tip_reparto="";
var already_do="";
var ok=true;
var referti="";
var currentIdenRef="";
var currentReparto="";
var currentProgressivo="";
var currentIdenVr="";
var lungh ;
var now_cont;
var wndAttesa ;
var array_firmati_SN;
var fileDao='NO';
function anteprima_referto()
{
	var doc = document.form_stampa;

	var referto = stringa_codici(array_iden_ref);


	/*alert('IDEN REFERTO: ' + referto);
	alert('PROGRESSIVO: ' + progressivo);*/

	if(referto == '')
	{
		alert('Prego, effettuare una selezione');
		return;
	}
	try
	{
		if(referto.split('*').length > 1)
		{
			alert('Prego, effettuare una selezione');
			return;
		}
	}
	catch(e){
	}

	doc.action = 'elabStampa';
	doc.target = 'wndPreviewPrint';
	doc.method = 'POST';

	doc.stampaSorgente.value       = 'firma_digitale_multipla';
	doc.stampaFunzioneStampa.value = 'REFERTO_STD';
	doc.stampaIdenRef.value        = referto;

	doc.stampaAnteprima.value      = "S";

	var wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");

	if (wndPreviewPrint)
	{
		wndPreviewPrint.focus();
	}
	else
	{
		wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}

	doc.submit();
}

function firma_multipla()
{
	var controllo;
	var prova='';
        var refertiControllo='';
	referti = stringa_codici(array_iden_ref);
	tip_referti = stringa_codici(array_tipo_referto);
	tip_reparto =stringa_codici(array_reparto)
	var lungh_array = array_iden_ref.length;

	if (referti=='')
	{
		alert('Selezionare almeno un referto')
		return;
	}
	/*Controllo di non rifirmare Referti già firmati*/
	refertiControllo=referti+"*";
        ArrControllo=refertiControllo.split("*")
	lunghControllo = ArrControllo.length;

/*
	for (controllo=0;controllo<lunghControllo;controllo++)
	{

		if (array_firmati_SN[vettore_indici_sel[controllo]]==1)
		{

			alert('Impossibile Firmare Referti già Firmati')
			return;

		}
	}
-----------------------------------*/

	ret_n_tip=n_tipi(tip_referti);

	arr_ret_n=ret_n_tip.split("*");
	var richiesta=false;


	if (arr_ret_n[1]>0 || arr_ret_n[0] >0)
	{
		richiesta=confirm(' Ci sono ' + arr_ret_n[1] + ' referti non modificati dall utente \n Ci sono ' + arr_ret_n[0] + ' referti non pronti per firma dall utente \n')
		if (!richiesta)
		{
			return;
		}
	}


	firma();
}
function aggiorna()
{
}

function n_tipi(arr_nec)
{
	var f=0;
	var s=0;
	var n=0;

	ArrS = arr_nec.split("*");

	for (i=0;i<=ArrS.length;i++)
		{

			if (ArrS[i]=='1')
				{
					f++;
				}
			if (ArrS[i]=='0')
				{
					s++;
				}
			if (ArrS[i]=='2')
				{
					n++;
				}

		}




	return f+'*'+n+'*'+s;
}

function firma_ricor()
{

	if(now_cont-- > 0)
	{

		document.all.oTable.rows(vettore_indici_sel[now_cont]).style.backgroundColor = '#FF6600';
		currentIdenRef=ArrIdenRef[now_cont];
		currentReparto=ArrReparto[now_cont];
		currentProgressivo="0";
		write_log("Inizio Firam " + currentIdenRef)
		//alert(currentIdenRef);
                if (basePC.ABILITA_FIRMA_DIGITALE == 'D')
                {
                dwrDAO.GetDaoMultiplo(currentIdenRef,dwrEnd)
                }
                else
                {
                Update_Firmato.CallAggVerRefMultiplo(document.form_firma.iden_per.value+'*'+currentIdenRef,passo2);

                }
		//Update_Firmato.CallAggVerRef(document.form_firma.iden_per.value+'*'+currentIdenRef,passo1);
	}
	else
	{

		alert("Eseguita Firma Multipla")
		}
}



function firma() {



	write_log("Inserito Il pin")
	ArrReparto=tip_reparto.split("*")
	ArrIdenRef=referti.split("*")
	lungh = ArrIdenRef.length;
	now_cont=lungh;
	write_log("Numero Referti da Firmare: " + lungh)
	//alert('INIZIO');

	//alert(referti)
	pin=window.showModalDialog('pwd_rich.html','','center:1;dialogHeight:110px;dialogWidth:480px;status:0');

	firma_ricor()

}

function InitMainFirma(){
	//document.write('<SCRIPT>');
try{
	var lungh_array = array_iden_ref.length;
	document.write('<OBJECT classid="clsid:C85A6712-F5AC-4C35-947A-34F8B0E4645C" id="ocxf_multipla">');
   	document.write('<param name="percorso_http" value="'+percorso_http+'">');
	document.write('<param name="servlet" value="'+servlet+'">');
	document.write('<param name="stampante" value="">');
	document.write('</object>');
	write_log("Inizializzato ActiveX");
	var lungh_array_nodup = array_iden_ref.length;

	array_firmati_SN = new Array(lungh_array_nodup);
	for (t=0;t<lungh_array_nodup;t++)
	{
		array_firmati_SN[t] = 0;
	}
}
catch(e){
}
}

function passo2(ret){
	write_log("CallAggVerRef Return= (OK*idenRef*PROGR)" + ret)
	arrErr=ret.split("*")
	if (arrErr[0]=='KO')
	{
		write_log("Errore Referto("+ currentIdenRef +") CallAggVerRef:"+(arrErr[1]))
		ok=false;
		document.all.oTable.rows(vettore_indici_sel[now_cont]).style.backgroundColor = '#FF0000';
		firma_ricor()
	}
	else
	{
		currentProgressivo=arrErr[2];
		currentIdenVr=arrErr[3];
		write_log("Aggiunta la versione "+ arrErr[1] +" del referto " + arrErr[2])
		file=ocxf_multipla.Firma_documento(currentIdenRef,currentReparto,currentProgressivo,pin)
		write_log("Aggiunta la versione "+ arrErr[1] +" del referto " + arrErr[2])
		passo3(file)
	}

}




function passo3(B64File){

	if (B64File=='')
	{
		alert('IMPOSSIBILE IMPORTARE IL FILE')
		ok=false;
		write_log("File vuoto Consultare log ocx")
		document.all.oTable.rows(vettore_indici_sel[now_cont]).style.backgroundColor = '#FF0000';
		//Update_Firmato.RollBackDb(currentIdenRef+'*'+currentProgressivo,afterRollback);


	}
	else
	{
		write_log("File Compilato Eseguo L'update su db")
		alert(fileDao);
		alert(currentIdenRef+"*"+currentProgressivo+"*F*"+ currentIdenVr+ "*"+B64File+"*"+fileDao)
		Update_Firmato.UpdateDBDAO(currentIdenRef+"*"+currentProgressivo+"*F*"+ currentIdenVr+ "*"+ B64File+"*"+fileDao,passo4);
	}

}
function passo4(ret){
	write_log("Tentativo Esucuzione Update Db Return:" + ret)

	if (ret=='0')
	{
		write_log("Firma Ok Per il Referto "+ currentIdenRef + " passo al prossimo")
		document.all.oTable.rows(vettore_indici_sel[now_cont]).style.backgroundColor = '#00FF00';
		array_firmati_SN[vettore_indici_sel[now_cont]]=1;

		firma_ricor()
	}
	else
	{
		write_log("Errore Per il Referto "+ currentIdenRef + " Eseguo il Rollback!")
		//Update_Firmato.RollBackDb(currentIdenRef+'*'+currentProgressivo,afterRollback);
		document.all.oTable.rows(vettore_indici_sel[now_cont]).style.backgroundColor = '#FF0000';

	}

}

function afterRollback(valore)
{
	firma_ricor()
}

function write_log(stringa){
	var path="";
	path =ocxf_multipla.GetPathToLog()

  var fs, a, ForAppending;
  ForAppending = 8;
  var File_Log;

  File_Log=path+"log_firma_javascript.txt"
  fs = new ActiveXObject("Scripting.FileSystemObject");
  if (!fs.FileExists(File_Log))
	{
		fs.CreateTextFile (File_Log)
	}
  a = fs.OpenTextFile(File_Log, ForAppending, false);
  a.Write(stringa);
  a.WriteBlankLines(1);
  a.Close();
  }
function dwrEnd(variabileRit){

alert('CIAO' + variabileRit);
  ArrS = variabileRit.split("*");
  if (ArrS[0]=='0')
  {
    if (ArrS[1]=='OK')
    {
    //alert(ArrS[2])

    if (ArrS[2]=='NO')
    {
    //document.formRegistraDAO.DAO.value='';
	fileDao=ArrS[2];
alert('C1' + fileDao);
	Update_Firmato.CallAggVerRefMultiplo(document.form_firma.iden_per.value+'*'+currentIdenRef,passo2);
    }
    //alert(document.formRegistraDAO.DAO.value)
	else
	{
    fileDao=ocxf_multipla.Firma_DAO(ArrS[2],pin);
	//dwrDAO.SaveDao()
	alert('C2' + fileDao);
	Update_Firmato.CallAggVerRefMultiplo(document.form_firma.iden_per.value+'*'+currentIdenRef,passo2);
	}
    }
    else{
        alert('ERROR: ' + ArrS[2]);
    }
  }
  else
  {
    alert('TEST ' + ArrS[1]);
  }
}

function seleziona_tutti()
{
	for(indice = 0; indice < array_iden_ref.length; indice ++)
	{
		document.all.oTable.rows(indice).style.backgroundColor = sel;
		nuovo_indice_sel(indice);
	}
}






// JavaScript Document
var typeClose='S'
function initOBJfirmaSanter(){
altezza = screen.height-60;
	largh = screen.width-25;
document.write('<object CLASSID="clsid:969CB476-504B-41CF-B082-1B8CDD18323A" CODEBASE="cab/pdfControl/prjXPdfReader.CAB#version=1,0,0,2"  id="pdfReader">');
	// id="pdfReader">');
document.write('<param name="width" value="'+largh+'">');
document.write('<param name="height" value="'+altezza+'">');
document.write('<param name="top" value="0">');
document.write('<param name="left" value="0">');
document.write('<param name="preview" value="S">');
document.write('<param name="PDFurl" value="'+pdfPosition+'">');
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
//document.all.pdfReader.PrintVisible(false);
//document.all.pdfReader.PrintOnVisible(false);
document.all.pdfReader.PDFurl=pdfPosition;
document.all.pdfReader.printAll();
identificaOperatore()
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
function firmaSanter(variabile){
  var myObj= new ActiveXObject("ActiveXSissWay.CallSissWayWin");


//bb="<MIA.selPaz><appl>IMAGO</appl><omettiEsenzioni>S</omettiEsenzioni><cognomeCittadino></cognomeCittadino><nomeCittadino></nomeCittadino><dataNascitaCittadino></dataNascitaCittadino><sessoCittadino>M</sessoCittadino><codiceFiscaleCittadino></codiceFiscaleCittadino><codiceSanitarioCittadino></codiceSanitarioCittadino></MIA.selPaz>"
var aa;
//alert(myObj);

var ToSend=document.id_aggiorna.HinputDAO.value.replace("<naturaReferto></naturaReferto>","<naturaReferto>01</naturaReferto>");
aa=myObj.sendRequest(ToSend);
//alert(aa);
myObj.terminate();
Update_Firmato.UpdateDBDAOSanter(ID_referto+'*'+progr+'*'+document.id_aggiorna.HIden_vr.value+'*'+aa,dwrEndUpdateSanter);
}



function dwrEndUpdateSanter(variabile){
//alert(variabile);


}
function identificaOperatore(){
var myObjId= new ActiveXObject("ActiveXSissWay.CallSissWayWin");
var Id;
Id=myObjId.sendRequest('<MIA.operatore><appl>IMAGO</appl></MIA.operatore>');
xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
xmlDoc.async="false";
xmlDoc.loadXML(Id)
var cfsc=xmlDoc.getElementsByTagName("codiceFiscale")[0].childNodes[0].nodeValue;
xmlDoc1=new ActiveXObject("Microsoft.XMLDOM");
xmlDoc1.async="false";
xmlDoc1.loadXML(document.id_aggiorna.HinputDAO.value)
var cfpolaris=xmlDoc1.getElementsByTagName("codiceFiscaleMedico")[0].childNodes[0].nodeValue;
if (cfsc!=cfpolaris)
{
	alert("Medico Refertante diverso dal medico della SmartCard")
	self.close();
}

}

function firma_multiplaSanter()
{
	var controllo;
	var prova='';
        var refertiControllo='';
	referti = stringa_codici(array_iden_ref);
	tip_referti = stringa_codici(array_tipo_referto);
	tip_reparto =stringa_codici(array_reparto)
	var lungh_array = array_iden_ref.length;

	if (referti=='')
	{
		alert('Selezionare almeno un referto')
		return;
	}
	/*Controllo di non rifirmare Referti già firmati*/
	refertiControllo=referti+"*";
        ArrControllo=refertiControllo.split("*")
	lunghControllo = ArrControllo.length;

/*
	for (controllo=0;controllo<lunghControllo;controllo++)
	{

		if (array_firmati_SN[vettore_indici_sel[controllo]]==1)
		{

			alert('Impossibile Firmare Referti già Firmati')
			return;

		}
	}
-----------------------------------*/

	ret_n_tip=n_tipi(tip_referti);

	arr_ret_n=ret_n_tip.split("*");
	var richiesta=false;


	if (arr_ret_n[1]>0 || arr_ret_n[0] >0)
	{
		richiesta=confirm(' Ci sono ' + arr_ret_n[1] + ' referti non modificati dall utente \n Ci sono ' + arr_ret_n[0] + ' referti non pronti per firma dall utente \n')
		if (!richiesta)
		{
			return;
		}
	}


	firmaSanterMulti();

}

var ArrrefSiss;
function firmaSanterMulti(){
var refSiss=referti.toString().replace(/\*/g, "@");
//alert(refSiss);
ArrrefSiss=refSiss.split("@");
//alert("REF.FirmaMarcaArchiviaMultipla*"+refSiss+"*"+baseUser.IDEN_PER);
dwrDAO.GetXMLMultiplo("REF.FirmaMarcaArchiviaMultipla*"+refSiss+"*"+baseUser.IDEN_PER,AfterFirmaSanter);
}

var array_Idenvr="";

function AfterFirmaSanter(VarRetSanterProc){
alert(VarRetSanterProc)
VarRetSanter=VarRetSanterProc.split("#")[0];
Vararray_Idenvr=VarRetSanterProc.split("#")[1].substring(1);
array_Idenvr=Vararray_Idenvr.split(",");
var ToSign='<m:REF.firmaMarcaArchivia xmlns:m="http://santer.it/schemas/SISSWAY/2007-01/firmaMarcaArchivia/" dataSetVersion="1.0">';
ToSign=ToSign+'<appl>IMAGO</appl>';
ToSign=ToSign+'<mostraGui>N</mostraGui>';
ToSign=ToSign+'<documenti>'+VarRetSanter+'</documenti>';
ToSign=ToSign+'</m:REF.firmaMarcaArchivia>';
alert(ToSign);
var myObj= new ActiveXObject("ActiveXSissWay.CallSissWayWin");


//bb="<MIA.selPaz><appl>IMAGO</appl><omettiEsenzioni>S</omettiEsenzioni><cognomeCittadino></cognomeCittadino><nomeCittadino></nomeCittadino><dataNascitaCittadino></dataNascitaCittadino><sessoCittadino>M</sessoCittadino><codiceFiscaleCittadino></codiceFiscaleCittadino><codiceSanitarioCittadino></codiceSanitarioCittadino></MIA.selPaz>"
var aa;
//alert(myObj);


aa=myObj.sendRequest(ToSign);
//alert(aa);

myObj.terminate();
xmlDoc1=new ActiveXObject("Microsoft.XMLDOM");
xmlDoc1.async="false";
//xmlDoc1.loadXML('<m:REF.firmaMarcaArchiviaResponse xmlns:m="http://santer.it/schemas/SISSWAY/2007-01/firmaMarcaArchivia/"><esito>OK</esito><documenti><documento><identificativoDocumento>3341_17</identificativoDocumento><esitoOperazione>OK</esitoOperazione><tipoDocumento>PDF</tipoDocumento><tipoFirma>LEGALE_OPERATORE</tipoFirma><contenuto>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ZW5kb2JqCjE3IDAgb2JqIFsvUERGIC9UZXh0IF0KZW5kb2JqCjE4IDAgb2JqIDw8IC9GMiAxMiAwIFI+PgplbmRvYmoKMTkgMCBvYmogbnVsbCAKZW5kb2JqCjIwIDAgb2JqIDw8IC9GaWx0ZXIgL0ZsYXRlRGVjb2RlIC9MZW5ndGggNjUgPj4gc3RyZWFtCniccwrhMtBTgCCFonQEJ8idS9/NSMFSISSNy8TSQsHcxEDPXCEkhUsjIDE9VcFIIT9NwUhTISSLyzWECwDvWw64CmVuZHN0cmVhbQplbmRvYmoKMjEgMCBvYmogPDwvVHlwZSAvT3V0bGluZXMgL0NvdW50IC0xIC9UaXRsZSAoMy4zNDEsMDApIC9QYXJlbnQgMyAwIFIgIC9EZXN0IFs0IDAgUiAgL1hZWiAwIDc1IDBdCiAvRmlyc3QgMjIgMCBSICAvTGFzdCAyMiAwIFIgPj4KZW5kb2JqCjIyIDAgb2JqIDw8L1R5cGUgL091dGxpbmVzICAvVGl0bGUgKCkgL1BhcmVudCAyMSAwIFIgIC9EZXN0IFs0IDAgUiAgL1hZWiAwIDc1IDBdCj4+CmVuZG9iagoyMyAwIG9iajw8ICAvUHJvZHVjZXIgKGktbmV0IENyeXN0YWwtQ2xlYXIgNi41LjE5KSAvQ3JlYXRpb25EYXRlIChEOjIwMDUwOTE1MTA1ODQ5KzAxJzAwJykgL01vZERhdGUgKEQ6MjAwOTA3MjkxNjA2MDcrMDEnMDAnKSAvVGl0bGUgKFJlcG9ydDMpPj4KZW5kb2JqCnhyZWYKMCAyNAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA3MyAwMDAwMCBuIAowMDAwMDAwMTYwIDAwMDAwIG4gCjAwMDAwMDAyMzMgMDAwMDAgbiAKMDAwMDAwMDMyNSAwMDAwMCBuIAowMDAwMDAwMzcxIDAwMDAwIG4gCjAwMDAwMDA5OTUgMDAwMDAgbiAKMDAwMDAwMTAxNSAwMDAwMCBuIAowMDAwMDAxMDQ0IDAwMDAwIG4gCjAwMDAwMDEwODYgMDAwMDAgbiAKMDAwMDAwMTEwOCAwMDAwMCBuIAowMDAwMDAxMjEwIDAwMDAwIG4gCjAwMDAwMDEzMDcgMDAwMDAgbiAKMDAwMDAwMTQxMyAwMDAwMCBuIAowMDAwMDAxNDYyIDAwMDAwIG4gCjAwMDAwMDE3ODYgMDAwMDAgbiAKMDAwMDAwMTgwNyAwMDAwMCBuIAowMDAwMDAxODM3IDAwMDAwIG4gCjAwMDAwMDE4NjkgMDAwMDAgbiAKMDAwMDAwMTg5MSAwMDAwMCBuIAowMDAwMDAyMDI4IDAwMDAwIG4gCjAwMDAwMDIxNjQgMDAwMDAgbiAKMDAwMDAwMjI1NSAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgMjQgL0luZm8gMjMgMCBSICAvUm9vdCAxIDAgUiA+PgpzdGFydHhyZWYKMjQwNwolJUVPRgo=</contenuto><contenutoFirmato>TWltZS1WZXJzaW9uOiAxLjANCkNvbnRlbnQtVHlwZTogbXVsdGlwYXJ0L21peGVkOyBib3VuZGFyeT0iU2lzcyINCg0KLS1TaXNzDQpDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL3BrY3M3LW1pbWU7IHNtaW1lLXR5cGU9c2lnbmVkLWRhdGE7IG5hbWU9ImNvbnRlbnQucDdtIg0KQ29udGVudC1UcmFuc2Zlci1FbmNvZGluZzogYmFzZTY0DQpDb250ZW50LURpc3Bvc2l0aW9uOiBhdHRhY2htZW50OyBmaWxlbmFtZT0iY29udGVudC5wN20iDQpDb250ZW50LURlc2NyaXB0aW9uOiBTaWduZWQgZW52ZWxvcGUNCgpNSUlTR0FZSktvWklodmNOQVFjQ29JSVNDVENDRWdVQ0FRRXhDVEFIQmdVckRnTUNHakNDQzZrR0NTcUdTSWIzRFFFSEFhQ0NDNW9FDQpnZ3VXSlZCRVJpMHhMalFLTVNBd0lHOWlhaUE4UEM5VWVYQmxJQzlEWVhSaGJHOW5JQzlRWVdkbGN5QXlJREFnVWlBdlQzVjBiR2x1DQpaWE1nTXlBd0lGSWdQajRLWlc1a2IySnFDaklnTUNCdlltb2dQRHd2Vkhsd1pTQXZVR0ZuWlhNZ0wwTnZkVzUwSURJZ0wwdHBaSE1nDQpXelFnTUNCU0lERXpJREFnVWlCZElDOU5aV1JwWVVKdmVDQmJNQ0F3SURVNU5TQTROREZkUGo0S1pXNWtiMkpxQ2pNZ01DQnZZbW9nDQpQRHd2Vkhsd1pTQXZUM1YwYkdsdVpYTWdMME52ZFc1MElERWdMMFpwY25OMElESXhJREFnVWlBZ0wweGhjM1FnTWpFZ01DQlNJRDQrDQpDbVZ1Wkc5aWFnbzBJREFnYjJKcUlEdzhMMVI1Y0dVZ0wxQmhaMlVnTDFCaGNtVnVkQ0F5SURBZ1VpQXZVbVZ6YjNWeVkyVnpJRFVnDQpNQ0JTSUM5RGIyNTBaVzUwY3lBMklEQWdVaUF2UVc1dWIzUnpJRGNnTUNCU1BqNEtaVzVrYjJKcUNqVWdNQ0J2WW1vZ1BEd3ZVSEp2DQpZMU5sZENBNElEQWdVaUF2Um05dWRDQTVJREFnVWo0K0NtVnVaRzlpYWdvMklEQWdiMkpxSUR3OElDOUdhV3gwWlhJZ0wwWnNZWFJsDQpSR1ZqYjJSbElDOU1aVzVuZEdnZ05UVXlJRDQrSUhOMGNtVmhiUXA0bkoyVFRZL1RNQkNHNy9rVmM0UkRVNDhkT3drM2xpMm9seFYwDQpjME1jckNidEd1VmpsWVJGMmwvUDJMSFRkQ2xTU3hWWmZkczNNODk4K0s2SVdBelRBLzN4SkhaZm92Vm5oQnlLUThSNUJncEZ6S0VvDQpvM2NNMS9SZ0x0bDdLSDZTaXdNeWExdmxERllZUytlNjE2T0cwc0NESHZabTFCKzhseUxHcWJSdU1uTUtPYm1MeldNQllNOUxNWmw3DQpoV3hmOWF1cDJyRzZFRTBBWnlFYVM5ZE1yRGxqK1YvUnlCWmNqbkF6Nk9aQ09DNGxySklrV0lscnMzdll2bzFHM2dWYjM3MVVMZUc5DQpMb3BGTmFYbDFCVVU2WnphUE90K05BM1YwdGttN1hScHVybzdHZzJmYXRPYXZYWVJVTVVacGNBczVMZzMrdGgydzBnR3FFcllVaXQ2DQpTam9hOTVON1oxTkUzK0VIZ3pKQytCMmhRTWhReHJtRUpwSksya0JlMTBHbmlEVFoybm5EOXlHNkt4YVZDcVFGa0NwT0hjVzJqUDg5DQpDRHJubGhRWm80OFNIQU1hMHNpSmdFNGlJS1JKSTFWb3N6NzY5Y05wRjFFdytsTm1JdUFyMnordjYxbXJ6T003dDFkUGNMQWxvQXNXDQo0Z1hoZHB0cTR4WVlSUVl5NWI2MmI3K3F3ZEJRcGpGMGdmdU1hM2xIZkZhYVZMSmtuUFNKa1ZGUFRveGUzY2pJcEwrQUgxdmR0SVFKDQpaVlhEczUvRWxhUXF5ODY2NmZWTXFsS3g2R1pRdDVHcU5BMmIwaDY2dmlIQ3J2MHYya1Njejk3cm1UYkI1ZXlEdW8wMjRXSDIyNmJSDQpSeG83N0orTWZybVdFZEZPYzBhYzVFeVlKeFB3NUEzcU5zSTh0OHRrQ1hmVm9lckhhN2VTcmtLNm5QU1NTL0lsVjFDMzNwcVp5d3o3DQpyaDE3RThqK0FObWxhTlFLWlc1a2MzUnlaV0Z0Q21WdVpHOWlhZ28zSURBZ2IySnFJRzUxYkd3S1pXNWtiMkpxQ2pnZ01DQnZZbW9nDQpXeTlRUkVZZ0wxUmxlSFFnWFFwbGJtUnZZbW9LT1NBd0lHOWlhaUE4UENBdlJqRWdNVEVnTUNCU0lDOUdNaUF4TWlBd0lGSStQZ3BsDQpibVJ2WW1vS01UQWdNQ0J2WW1vZ2JuVnNiQ0FLWlc1a2IySnFDakV4SURBZ2IySnFDanc4Q2k5VGRXSjBlWEJsSUM5VWVYQmxNUW92DQpRbUZ6WlVadmJuUWdMMGhsYkhabGRHbGpZUzFDYjJ4a0NpOUZibU52WkdsdVp5QXZWMmx1UVc1emFVVnVZMjlrYVc1bkNpOVVlWEJsDQpJQzlHYjI1MFBqNEtaVzVrYjJKcUNqRXlJREFnYjJKcUNqdzhDaTlUZFdKMGVYQmxJQzlVZVhCbE1Rb3ZRbUZ6WlVadmJuUWdMMGhsDQpiSFpsZEdsallRb3ZSVzVqYjJScGJtY2dMMWRwYmtGdWMybEZibU52WkdsdVp3b3ZWSGx3WlNBdlJtOXVkRDQrQ21WdVpHOWlhZ294DQpNeUF3SUc5aWFpQThQQzlVZVhCbElDOVFZV2RsSUM5UVlYSmxiblFnTWlBd0lGSWdMMUpsYzI5MWNtTmxjeUF4TkNBd0lGSWdMME52DQpiblJsYm5SeklGc3hOU0F3SUZJZ01qQWdNQ0JTWFNBZ0wwRnVibTkwY3lBeE5pQXdJRkkrUGdwbGJtUnZZbW9LTVRRZ01DQnZZbW9nDQpQRHd2VUhKdlkxTmxkQ0F4TnlBd0lGSWdMMFp2Ym5RZ01UZ2dNQ0JTUGo0S1pXNWtiMkpxQ2pFMUlEQWdiMkpxSUR3OElDOUdhV3gwDQpaWElnTDBac1lYUmxSR1ZqYjJSbElDOU1aVzVuZEdnZ01qVXhJRDQrSUhOMGNtVmhiUXA0bkUyUVMwdkVRQkNFNy8wcmlqMHByRDJQDQpaSktKUjExZEJCZGt6VTA4QkRNSkkzbEFOdWpmTjVNaEtnd00zZlYxTmRWM0pVbEdmSmphditKOEpQR29ZVkUycEEwYjVLbmx3cUNzDQo2V3AzZG8yYjVoR05uL3BxK1d2ZitybnFlamZNRHBYSHhRMFhqOXAxbmNNd1RyM0RsMjhYMGQvaXdDOThaZ3dNbzVLQVFFbWhsRkJGDQprZSt2VVg2U3hFM0JlZHgwNFB1RlAvRUtTaXVrRG1DeC8yZVRwbVpUbFJaYVNoblVaejdHSVowSXFVSmI4MjYxRDZtaWYwTlp2Z1JMDQpMT3U0TFN4SUFsdjhra29ITHBGWm1OQnlJNTg2bkZ6dFAwYkVVMVJMOEhYbW9hUTN2RXZVcFBCTnlzSXFFODZHbmt5ZWJWVkhyL1FEDQpHajliY1FwbGJtUnpkSEpsWVcwS1pXNWtiMkpxQ2pFMklEQWdiMkpxSUc1MWJHd0taVzVrYjJKcUNqRTNJREFnYjJKcUlGc3ZVRVJHDQpJQzlVWlhoMElGMEtaVzVrYjJKcUNqRTRJREFnYjJKcUlEdzhJQzlHTWlBeE1pQXdJRkkrUGdwbGJtUnZZbW9LTVRrZ01DQnZZbW9nDQpiblZzYkNBS1pXNWtiMkpxQ2pJd0lEQWdiMkpxSUR3OElDOUdhV3gwWlhJZ0wwWnNZWFJsUkdWamIyUmxJQzlNWlc1bmRHZ2dOalVnDQpQajRnYzNSeVpXRnRDbmljY3dyaE10QlRnQ0NGb25RRUo4aWRTOS9OU01GU0lTU055OFRTUXNIY3hFRFBYQ0VraFVzaklERTlWY0ZJDQpJVDlOd1VoVElTU0x5eldFQ3dEdld3NjRDbVZ1WkhOMGNtVmhiUXBsYm1Sdlltb0tNakVnTUNCdlltb2dQRHd2Vkhsd1pTQXZUM1YwDQpiR2x1WlhNZ0wwTnZkVzUwSUMweElDOVVhWFJzWlNBb015NHpOREVzTURBcElDOVFZWEpsYm5RZ015QXdJRklnSUM5RVpYTjBJRnMwDQpJREFnVWlBZ0wxaFpXaUF3SURjMUlEQmRDaUF2Um1seWMzUWdNaklnTUNCU0lDQXZUR0Z6ZENBeU1pQXdJRklnUGo0S1pXNWtiMkpxDQpDakl5SURBZ2IySnFJRHc4TDFSNWNHVWdMMDkxZEd4cGJtVnpJQ0F2VkdsMGJHVWdLQ2tnTDFCaGNtVnVkQ0F5TVNBd0lGSWdJQzlFDQpaWE4wSUZzMElEQWdVaUFnTDFoWldpQXdJRGMxSURCZENqNCtDbVZ1Wkc5aWFnb3lNeUF3SUc5aWFqdzhJQ0F2VUhKdlpIVmpaWElnDQpLR2t0Ym1WMElFTnllWE4wWVd3dFEyeGxZWElnTmk0MUxqRTVLU0F2UTNKbFlYUnBiMjVFWVhSbElDaEVPakl3TURVd09URTFNVEExDQpPRFE1S3pBeEp6QXdKeWtnTDAxdlpFUmhkR1VnS0VRNk1qQXdPVEEzTWpreE5qQTJNRGNyTURFbk1EQW5LU0F2VkdsMGJHVWdLRkpsDQpjRzl5ZERNcFBqNEtaVzVrYjJKcUNuaHlaV1lLTUNBeU5Bb3dNREF3TURBd01EQXdJRFkxTlRNMUlHWWdDakF3TURBd01EQXdNRGtnDQpNREF3TURBZ2JpQUtNREF3TURBd01EQTNNeUF3TURBd01DQnVJQW93TURBd01EQXdNVFl3SURBd01EQXdJRzRnQ2pBd01EQXdNREF5DQpNek1nTURBd01EQWdiaUFLTURBd01EQXdNRE15TlNBd01EQXdNQ0J1SUFvd01EQXdNREF3TXpjeElEQXdNREF3SUc0Z0NqQXdNREF3DQpNREE1T1RVZ01EQXdNREFnYmlBS01EQXdNREF3TVRBeE5TQXdNREF3TUNCdUlBb3dNREF3TURBeE1EUTBJREF3TURBd0lHNGdDakF3DQpNREF3TURFd09EWWdNREF3TURBZ2JpQUtNREF3TURBd01URXdPQ0F3TURBd01DQnVJQW93TURBd01EQXhNakV3SURBd01EQXdJRzRnDQpDakF3TURBd01ERXpNRGNnTURBd01EQWdiaUFLTURBd01EQXdNVFF4TXlBd01EQXdNQ0J1SUFvd01EQXdNREF4TkRZeUlEQXdNREF3DQpJRzRnQ2pBd01EQXdNREUzT0RZZ01EQXdNREFnYmlBS01EQXdNREF3TVRnd055QXdNREF3TUNCdUlBb3dNREF3TURBeE9ETTNJREF3DQpNREF3SUc0Z0NqQXdNREF3TURFNE5qa2dNREF3TURBZ2JpQUtNREF3TURBd01UZzVNU0F3TURBd01DQnVJQW93TURBd01EQXlNREk0DQpJREF3TURBd0lHNGdDakF3TURBd01ESXhOalFnTURBd01EQWdiaUFLTURBd01EQXdNakkxTlNBd01EQXdNQ0J1SUFwMGNtRnBiR1Z5DQpDanc4TDFOcGVtVWdNalFnTDBsdVptOGdNak1nTUNCU0lDQXZVbTl2ZENBeElEQWdVaUErUGdwemRHRnlkSGh5WldZS01qUXdOd29sDQpKVVZQUmdxZ2dnVE9NSUlFeWpDQ0E3S2dBd0lCQWdJREFKd3lNQTBHQ1NxR1NJYjNEUUVCQlFVQU1HZ3hDekFKQmdOVkJBWVRBa2xVDQpNUlV3RXdZRFZRUUtFd3hNU1ZOSlZDQlRMbkF1UVM0eEl6QWhCZ05WQkFzVEdsTmxjblpwZW1sdklHUnBJR05sY25ScFptbGpZWHBwDQpiMjVsTVIwd0d3WURWUVFERXhSTVNWTkpWQ0JEUVNCa2FTQlRaWEoyYVhwcGJ6QWVGdzB3T0RBeU1UVXdPRE0wTWpWYUZ3MHhOREF5DQpNVFV3T0RNME1qTmFNSUhqTVFzd0NRWURWUVFHRXdKSlZERXZNQzBHQTFVRUNnd21RMUpUSUZOSlUxTWdRMlZ5ZEdsbWFXTmhkR2tnDQpaR2tnWm1seWJXRWdaR2xuYVhSaGJHVXhKekFsQmdOVkJBc01Ia05sY25ScFptbGpZWFJwSUU5d1pYSmhkRzl5YVNCV2FYSjBkV0ZzDQphVEVSTUE4R0ExVUVCQXdJVmxSQlIweFBSRWt4RURBT0JnTlZCQ29NQjFOUVJVTkJUVUl4R1RBWEJnTlZCQU1NRUZOUVJVTkJUVUlnDQpWbFJCUjB4UFJFa3hIREFhQmdOVkJBVVRFMGxVT2xaVVIxTkRUVFV3UVRBeFJqSXdOVTB4Q3pBSkJnTlZCQXdNQWpFeU1ROHdEUVlEDQpWUVF1RXdZeE9UQXhNVGt3Z2FBd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ1k0QU1JR0tBb0dCQUpPbkxPVmpwZkVhNWxoNzZFcXMvVVI2DQpIOGtVMFZrTzNuZ3ZBeEZlcGV2cHcvMnc2cW9VQUZxTEpnUnpwQzkreG14VkVUS21WMnlsajBzN0RkejB2QnRRY05qbUw0Z01aVVVyDQpkZUh5L2QrL0hZVFF5K0hEOG9pU21MVkxyUHdvK2RoU2ZWd2FtblNOUjhQTGdBMmZSVTJwR0x6Z0xVRHc5aXAvbHBUMlY0NWZBZ1FBDQpxUWRIbzRJQmdqQ0NBWDR3U0FZRFZSMGdCRUV3UHpBOUJnb3JCZ0VFQWJ4dUV3SmpNQzh3TFFZSUt3WUJCUVVIQWdFV0lXaDBkSEE2DQpMeTkzZDNjdWJHbHphWFF1YVhRdlptbHliV0ZrYVdkcGRHRnNaVEF2QmdnckJnRUZCUWNCQXdRak1DRXdDQVlHQkFDT1JnRUJNQXNHDQpCZ1FBamtZQkF3SUJGREFJQmdZRUFJNUdBUVF3RGdZRFZSMFBBUUgvQkFRREFnWkFNQjhHQTFVZEl3UVlNQmFBRklUTnNTOGNxOUNMDQp6M3Ird2J4WHNJb2REb1VMTUlHd0JnTlZIUjhFZ2Fnd2dhVXdnYUtnZ1orZ2daeUdnWmxzWkdGd09pOHZiR1JoY0M1amNuTXViRzl0DQpZbUZ5WkdsaExtbDBMMk51SlROa1EwUlFNU3h2ZFNVelpFTlNUQ1V5TUVOQkpUSXdVMlZ5ZG1sNmFXOHNieVV6WkV4SlUwbFVKVEl3DQpVeTV3TGtFdUxHTWxNMlJKVkQ5alpYSjBhV1pwWTJGMFpWSmxkbTlqWVhScGIyNU1hWE4wUDJKaGMyVS9iMkpxWldOMFEyeGhjM005DQpZMUpNUkdsemRISnBZblYwYVc5dVVHOXBiblF3SFFZRFZSME9CQllFRkpDUUpXQUpvUVlHN2diWmdLbHVrQ0o0cW11RU1BMEdDU3FHDQpTSWIzRFFFQkJRVUFBNElCQVFDT3JxWk4xaVBrMGdoblVrNHlKbWtoZlM3Q01zc29rS01jQ2k1ajdNK1pYNWt6K0ZibjdIMDNlUW9vDQo2UVRMWVQzT3hOdlBFT1JYQllSNnFGS1JidlcwWUdEdFhkcVJZOVlzS2pvNjJtb0hFMmtMN3B4aEI3QjZvWWtmNlpKbkRCSmp2YmF3DQpnQjRuekZrRnhsL3JQYkNUQTNVTmU4VmEvMmxCYXVOSk5RaUEreW1vZm9qMWFjUzh5ZmZJNjYxdHZpSWU5ellSdllzOUtaK1poYXJsDQpkWXBwZUx2czUraEVNL1dFdzcraSszVXkrZlAvUTdPcWlSYnl3WFZKUDNEMW1XVHlpaDVmWHAza0lRcGxYdDdtL1A2L3kzOXZ4bTlxDQpUZHYxbUtJeHNsT015MU5jKzhuRkExbUhlVnlCOXB0ckQ5WEFXeURzbVQxdXl2OEsyS1dOSkJZdE1ZSUJkRENDQVhBQ0FRRXdiekJvDQpNUXN3Q1FZRFZRUUdFd0pKVkRFVk1CTUdBMVVFQ2hNTVRFbFRTVlFnVXk1d0xrRXVNU013SVFZRFZRUUxFeHBUWlhKMmFYcHBieUJrDQphU0JqWlhKMGFXWnBZMkY2YVc5dVpURWRNQnNHQTFVRUF4TVVURWxUU1ZRZ1EwRWdaR2tnVTJWeWRtbDZhVzhDQXdDY01qQUpCZ1VyDQpEZ01DR2dVQW9GMHdHQVlKS29aSWh2Y05BUWtETVFzR0NTcUdTSWIzRFFFSEFUQWNCZ2txaGtpRzl3MEJDUVV4RHhjTk1Ea3dOekk1DQpNVFF3TmpNMVdqQWpCZ2txaGtpRzl3MEJDUVF4RmdRVUhlbzUyRTJHZGNZSDk1TWxTNExFV05acHFzd3dEUVlKS29aSWh2Y05BUUVGDQpCUUFFZ1lCcG5Jb0dieWoyUyszNFR4NTBnRmluNUFKZnd5d21RVVIrT3plT1Y5YTJXT0R1WkpGWU1yN1dEZitvUDdZZERmM3lzN3lqDQpRbjVCWmIxdFYvdkFiODVDNVlPUzlHd2xVQTdwbXNOa3YrYmRYSjg0RjN6T0Y3RUdjMWNpSGphaGNMRUNNdm4wUVFzWHJDenJZdkFqDQp6MmFYeW9pdkpSZWhnQ0N5b1VvNlMrdFE1Zz09Cg0KLS1TaXNzDQpDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL3RpbWVzdGFtcC1yZXBseTsgbmFtZT0iQzovY29udGVudC5wN20udHMiDQpDb250ZW50LVRyYW5zZmVyLUVuY29kaW5nOiBiYXNlNjQNCkNvbnRlbnQtRGlzcG9zaXRpb246IGF0dGFjaG1lbnQ7IGZpbGVuYW1lPSJDOi9jb250ZW50LnA3bS50cyINCkNvbnRlbnQtRGVzY3JpcHRpb246IHRpbWUtc3RhbXAgcmVzcG9uc2UNCgpNSUlINnpBREFnRUFNSUlINGdZSktvWklodmNOQVFjQ29JSUgwekNDQjg4Q0FRTXhDekFKQmdVckRnTUNHZ1VBTUlIU0Jnc3Foa2lHDQo5dzBCQ1JBQkJLQ0J3Z1NCdnpDQnZBSUJBUVlKS3dZQkJBRzhiZ1FDTUNFd0NRWUZLdzREQWhvRkFBUVVxc0VBSGdEbUVxQjU2VUErDQp0TTFWclBIQVp1SUNDQjgyMHd5K2dtSEVHQTh5TURBNU1EY3lPVEUwTURZME5GcWdicVJzTUdveEN6QUpCZ05WQkFZVEFrbFVNUlV3DQpFd1lEVlFRS0V3eE1TVk5KVkNCVExuQXVRUzR4S0RBbUJnTlZCQXNUSDFObGNuWnBlbWx2SUdScElHMWhjbU5oZEhWeVlTQjBaVzF3DQpiM0poYkdVeEdqQVlCZ05WQkFNVEVWUnBiV1VnVTNSaGJYQWdVMlZ5ZG1WeW9JSUVqekNDQklzd2dnTnpvQU1DQVFJQ0FpVUFNQTBHDQpDU3FHU0liM0RRRUJCUVVBTUlHUE1Rc3dDUVlEVlFRR0V3SkpWREVWTUJNR0ExVUVDaE1NVEVsVFNWUWdVeTV3TGtFdU1TTXdJUVlEDQpWUVFMRXhwVFpYSjJhWHBwYnlCa2FTQmpaWEowYVdacFkyRjZhVzl1WlRGRU1FSUdBMVVFQXhNN1RFbFRTVlFnVTJWeWRtbDZhVzhnDQpaR2tnWTJWeWRHbG1hV05oZW1sdmJtVWdjR1Z5SUd4aElFMWhjbU5oZEhWeVlTQlVaVzF3YjNKaGJHVXdIaGNOTURrd05qSTJNRGswDQpNRFUwV2hjTk1UWXdPVEF5TVRRME56QXhXakJxTVFzd0NRWURWUVFHRXdKSlZERVZNQk1HQTFVRUNoTU1URWxUU1ZRZ1V5NXdMa0V1DQpNU2d3SmdZRFZRUUxFeDlUWlhKMmFYcHBieUJrYVNCdFlYSmpZWFIxY21FZ2RHVnRjRzl5WVd4bE1Sb3dHQVlEVlFRREV4RlVhVzFsDQpJRk4wWVcxd0lGTmxjblpsY2pDQm56QU5CZ2txaGtpRzl3MEJBUUVGQUFPQmpRQXdnWWtDZ1lFQXdqOWdhQWorL0FwdlhNeWtOZUlyDQpiYjZQZ2VNQXhvOWEwWGU0a21QZ1lhK1BvZ3pRbUF1WE1saUs1ZThnSzYrS2VrYzU1U0k4RkJva0FZcXJnMXl2dlU0ejlPZnQwc1pmDQpaVHVZS2RnVDJwWTJuSldJbTVRcEdlMW11Zmp4WFQxNW02ZS9wQVRkamJDbU4raDZPSm1wWjFUT2VQQ0pIK2hJNHVMY3g1NXBaVDBDDQpBd0VBQWFPQ0FaY3dnZ0dUTUVjR0ExVWRJQVJBTUQ0d1BBWUpLd1lCQkFHOGJnUUNNQzh3TFFZSUt3WUJCUVVIQWdFV0lXaDBkSEE2DQpMeTkzZDNjdWJHbHphWFF1YVhRdlptbHliV0ZrYVdkcGRHRnNaVEFPQmdOVkhROEJBZjhFQkFNQ0I0QXdGZ1lEVlIwbEFRSC9CQXd3DQpDZ1lJS3dZQkJRVUhBd2d3SHdZRFZSMGpCQmd3Rm9BVXRTaGtDQ2czOHRBNnFzSTQzdTloWWYxa0ZpSXdnZDhHQTFVZEh3U0IxekNCDQoxRENCMGFDQnpxQ0J5NGFCeUd4a1lYQTZMeTlzWkdGd0xtTnljeTVzYjIxaVlYSmthV0V1YVhRdlkyNGxNMlJNU1ZOSlZDVXlNRk5sDQpjblpwZW1sdkpUSXdaR2tsTWpCalpYSjBhV1pwWTJGNmFXOXVaU1V5TUhCbGNpVXlNR3hoSlRJd1RXRnlZMkYwZFhKaEpUSXdWR1Z0DQpjRzl5WVd4bExHOTFKVE5rVTJWeWRtbDZhVzhsTWpCa2FTVXlNR05sY25ScFptbGpZWHBwYjI1bExHOGxNMlJNU1ZOSlZDVXlNRk11DQpjQzVCTGl4akpUTmtTVlEvWTJWeWRHbG1hV05oZEdWU1pYWnZZMkYwYVc5dVRHbHpkRDlpWVhObE1CMEdBMVVkRGdRV0JCUmdKMnQ2DQp1RkgraHpIRHdHMVlUTFlQUnJwSDBqQU5CZ2txaGtpRzl3MEJBUVVGQUFPQ0FRRUFQdk1Jb3JYYWhvZ1EwZUljSlB2MjE0Z0c1bzg5DQp2UzhtcklqaWtxTlpkVjZoaHZhVDFLejdFbm1pVE5IWEJoTTR3T3JHaWcrUEhWSE1IU04zeENCZHZQVGIrRXJiQy9KWnM3TDl0QW12DQp3L0JYaGNkSWRZSEFnWlRFa2Y3TTF3UmNJYjluUHRmZ2NJSnEyc1lCdytrYjlJc2lqVmZDUzlrQXJtM3pGcjAzRWhhUjlYcFlubXJVDQpQanFQa0lNZDVlY2NKN3V5emk0SEl6YVRQU0EyRTY4VmZYb0w2NUZyaEllbXR5NUlCODlKVzhyTHRCNFNva3hPMWEyTnR6UjBqY3BvDQpjOUo2Q0tDUEdqMVBXWVp5Y0ZIQWd1NWN1RFljN2FCSW1JYm5PYW9HSEtMTmloUFg2cXk5T252cGllMWJtTHEvTkk1emxPdWhzK2h4DQpYNDJSZ2xWS3F6R0NBbE13Z2dKUEFnRUJNSUdXTUlHUE1Rc3dDUVlEVlFRR0V3SkpWREVWTUJNR0ExVUVDaE1NVEVsVFNWUWdVeTV3DQpMa0V1TVNNd0lRWURWUVFMRXhwVFpYSjJhWHBwYnlCa2FTQmpaWEowYVdacFkyRjZhVzl1WlRGRU1FSUdBMVVFQXhNN1RFbFRTVlFnDQpVMlZ5ZG1sNmFXOGdaR2tnWTJWeWRHbG1hV05oZW1sdmJtVWdjR1Z5SUd4aElFMWhjbU5oZEhWeVlTQlVaVzF3YjNKaGJHVUNBaVVBDQpNQWtHQlNzT0F3SWFCUUNnZ2dFU01Cb0dDU3FHU0liM0RRRUpBekVOQmdzcWhraUc5dzBCQ1JBQkJEQWpCZ2txaGtpRzl3MEJDUVF4DQpGZ1FVazFEVDBTd09lVnRFdnB2cm9NUzRFQ2dlQXBjd2djNEdDeXFHU0liM0RRRUpFQUlNTVlHK01JRzdNSUc0TUlHMUJCUWNnR2pFDQpMVzdRdkF2WWYvbUJxSi9lT2phWkV6Q0JuRENCbGFTQmtqQ0JqekVMTUFrR0ExVUVCaE1DU1ZReEZUQVRCZ05WQkFvVERFeEpVMGxVDQpJRk11Y0M1QkxqRWpNQ0VHQTFVRUN4TWFVMlZ5ZG1sNmFXOGdaR2tnWTJWeWRHbG1hV05oZW1sdmJtVXhSREJDQmdOVkJBTVRPMHhKDQpVMGxVSUZObGNuWnBlbWx2SUdScElHTmxjblJwWm1sallYcHBiMjVsSUhCbGNpQnNZU0JOWVhKallYUjFjbUVnVkdWdGNHOXlZV3hsDQpBZ0lsQURBTkJna3Foa2lHOXcwQkFRRUZBQVNCZ0lVSVk1UVZjNDNmVmFiR2lzUHJsZVJlblY0eUtXUGRiU0dMa1FaalJETTVSc1VGDQpLT3YrZ1p4aWxrcE9jMFNBdk4yU3kvS0NtVTBpaEdTUHl5TnJ4MVcrOTF2bFlORnZZdGhYa2VPZ2Y1a1V6ajZhTTdjdlR0QmtkSDk3DQpQRlNYL1k3dFFiR24yQVhLUEZIMlRiYTVZcE5EMEtrWmtwMnRSRVpkNEtpcXBnMVEKDQoNCi0tU2lzcy0t</contenutoFirmato><marcaTemporale>01</marcaTemporale><uriReferto>REF03097803006700P240994</uriReferto></documento><documento><identificativoDocumento>3822_17</identificativoDocumento><esitoOperazione>OK</esitoOperazione><tipoDocumento>PDF</tipoDocumento><tipoFirma>LEGALE_OPERATORE</tipoFirma><contenuto>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agoxNiAwIG9iaiBudWxsCmVuZG9iagoxNyAwIG9iaiBbL1BERiAvVGV4dCBdCmVuZG9iagoxOCAwIG9iaiA8PCAvRjIgMTIgMCBSPj4KZW5kb2JqCjE5IDAgb2JqIG51bGwgCmVuZG9iagoyMCAwIG9iaiA8PCAvRmlsdGVyIC9GbGF0ZURlY29kZSAvTGVuZ3RoIDY1ID4+IHN0cmVhbQp4nHMK4TLQU4AghaJ0BCfInUvfzUjBUiEkjcvE0kLB3MRAz1whJIVLIyAxPVXBSCE/TcFIUyEki8s1hAsA71sOuAplbmRzdHJlYW0KZW5kb2JqCjIxIDAgb2JqIDw8L1R5cGUgL091dGxpbmVzIC9Db3VudCAtMSAvVGl0bGUgKDMuODIyLDAwKSAvUGFyZW50IDMgMCBSICAvRGVzdCBbNCAwIFIgIC9YWVogMCA3NSAwXQogL0ZpcnN0IDIyIDAgUiAgL0xhc3QgMjIgMCBSID4+CmVuZG9iagoyMiAwIG9iaiA8PC9UeXBlIC9PdXRsaW5lcyAgL1RpdGxlICgpIC9QYXJlbnQgMjEgMCBSICAvRGVzdCBbNCAwIFIgIC9YWVogMCA3NSAwXQo+PgplbmRvYmoKMjMgMCBvYmo8PCAgL1Byb2R1Y2VyIChpLW5ldCBDcnlzdGFsLUNsZWFyIDYuNS4xOSkgL0NyZWF0aW9uRGF0ZSAoRDoyMDA1MDkxNTEwNTg0OSswMScwMCcpIC9Nb2REYXRlIChEOjIwMDkwNzI5MTYwNjA3KzAxJzAwJykgL1RpdGxlIChSZXBvcnQzKT4+CmVuZG9iagp4cmVmCjAgMjQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNzMgMDAwMDAgbiAKMDAwMDAwMDE2MCAwMDAwMCBuIAowMDAwMDAwMjMzIDAwMDAwIG4gCjAwMDAwMDAzMjUgMDAwMDAgbiAKMDAwMDAwMDM3MSAwMDAwMCBuIAowMDAwMDAxMDEwIDAwMDAwIG4gCjAwMDAwMDEwMzAgMDAwMDAgbiAKMDAwMDAwMTA1OSAwMDAwMCBuIAowMDAwMDAxMTAxIDAwMDAwIG4gCjAwMDAwMDExMjMgMDAwMDAgbiAKMDAwMDAwMTIyNSAwMDAwMCBuIAowMDAwMDAxMzIyIDAwMDAwIG4gCjAwMDAwMDE0MjggMDAwMDAgbiAKMDAwMDAwMTQ3NyAwMDAwMCBuIAowMDAwMDAxODAyIDAwMDAwIG4gCjAwMDAwMDE4MjMgMDAwMDAgbiAKMDAwMDAwMTg1MyAwMDAwMCBuIAowMDAwMDAxODg1IDAwMDAwIG4gCjAwMDAwMDE5MDcgMDAwMDAgbiAKMDAwMDAwMjA0NCAwMDAwMCBuIAowMDAwMDAyMTgwIDAwMDAwIG4gCjAwMDAwMDIyNzEgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDI0IC9JbmZvIDIzIDAgUiAgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjI0MjMKJSVFT0YK</contenuto><contenutoFirmato>TWltZS1WZXJzaW9uOiAxLjANCkNvbnRlbnQtVHlwZTogbXVsdGlwYXJ0L21peGVkOyBib3VuZGFyeT0iU2lzcyINCg0KLS1TaXNzDQpDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL3BrY3M3LW1pbWU7IHNtaW1lLXR5cGU9c2lnbmVkLWRhdGE7IG5hbWU9ImNvbnRlbnQucDdtIg0KQ29udGVudC1UcmFuc2Zlci1FbmNvZGluZzogYmFzZTY0DQpDb250ZW50LURpc3Bvc2l0aW9uOiBhdHRhY2htZW50OyBmaWxlbmFtZT0iY29udGVudC5wN20iDQpDb250ZW50LURlc2NyaXB0aW9uOiBTaWduZWQgZW52ZWxvcGUNCgpNSUlTS0FZSktvWklodmNOQVFjQ29JSVNHVENDRWhVQ0FRRXhDVEFIQmdVckRnTUNHakNDQzdrR0NTcUdTSWIzRFFFSEFhQ0NDNm9FDQpnZ3VtSlZCRVJpMHhMalFLTVNBd0lHOWlhaUE4UEM5VWVYQmxJQzlEWVhSaGJHOW5JQzlRWVdkbGN5QXlJREFnVWlBdlQzVjBiR2x1DQpaWE1nTXlBd0lGSWdQajRLWlc1a2IySnFDaklnTUNCdlltb2dQRHd2Vkhsd1pTQXZVR0ZuWlhNZ0wwTnZkVzUwSURJZ0wwdHBaSE1nDQpXelFnTUNCU0lERXpJREFnVWlCZElDOU5aV1JwWVVKdmVDQmJNQ0F3SURVNU5TQTROREZkUGo0S1pXNWtiMkpxQ2pNZ01DQnZZbW9nDQpQRHd2Vkhsd1pTQXZUM1YwYkdsdVpYTWdMME52ZFc1MElERWdMMFpwY25OMElESXhJREFnVWlBZ0wweGhjM1FnTWpFZ01DQlNJRDQrDQpDbVZ1Wkc5aWFnbzBJREFnYjJKcUlEdzhMMVI1Y0dVZ0wxQmhaMlVnTDFCaGNtVnVkQ0F5SURBZ1VpQXZVbVZ6YjNWeVkyVnpJRFVnDQpNQ0JTSUM5RGIyNTBaVzUwY3lBMklEQWdVaUF2UVc1dWIzUnpJRGNnTUNCU1BqNEtaVzVrYjJKcUNqVWdNQ0J2WW1vZ1BEd3ZVSEp2DQpZMU5sZENBNElEQWdVaUF2Um05dWRDQTVJREFnVWo0K0NtVnVaRzlpYWdvMklEQWdiMkpxSUR3OElDOUdhV3gwWlhJZ0wwWnNZWFJsDQpSR1ZqYjJSbElDOU1aVzVuZEdnZ05UWTNJRDQrSUhOMGNtVmhiUXA0bkoyVFRZL2FNQkNHNy9rVmMyd1BCSThUNTZNM2RwZFd1V3k3DQp3VDFWUFZna3NLN3lzVXJTcmJTL3ZoUEhEcUdsRWxSQ3dBdHZaaDdQTzc2VEh2Tmhla0YzUEluOGs3ZitpSkNDUEhpY0p4Qmg0SE9RDQpoZmNPZ3pWTDE1Z200ajNJSCtUaWdHeTByVklHSy9TRmNUMm9RVUdoNFZIMWV6Mm9EOVpMRmYxWWpHNHljeW81dWU4ektUZTdiTGNEDQplUHE2a1RML1RCLzU1bEZ1THZWZ3BnUTk5a1c5NmJJWnlndlZBK0RNVmVmcG1zVnJ6bGo2VnpXeU9aY2gzdmFxdmxDT0N3R3JNSFRXDQo3VTV1ODhmc3oycmtYYkIxN1d2WkVON2I0dkFZVFcwNVRRbURlRzZ0WDFRMzZKck8wbzVEeTFXaDI2bzlhZ1gzbFc3MFhwa0tHUGtKDQp0Y0RFOVhqUTZ0aTAvVUFHS0F2SWFCUWROUjIwK2NrOHM1WGVOL2pPb1BBUWZua1lJQ1FvL0ZSQTdZbElqSVdzcnB5T0VTbnB5bmpkDQo5OTY3azR1VEJrZ0xJU0kvTmhSWjRmODdDSHFmUjRJaFl3NEtLWHpxVGUvVW0yQW1qWFMyc2QvT0xpSk9XNGtCb3o5RkVqandhSnljDQoxZFdzbzhTQ0c3ZFZ6M0FZNGRFVWMvV2NNRnRPcCtJaktnWUppSmpiVXozOUxIdE5jVXdCdEk3N2pHdDVXMnhYeWloY01rNzZ4TWhvDQpHaWRHcTI1a1pNSmV4VTJqNm9Zd29TZ3JlTEVaWEVrYUpjblpOSzJlU2FNNFdFelRxZHRJb3poMk85SWMycTRtd3JiNUw5b3dPTS9lDQo2cGsyeEdYMlR0MUdHM0tYZlZiWDZraXh3LzVacTlkckdSSEhOR2ZFU2M2RWFUZ0JUMTZuYmlOTTAzR1pSc0s4UEpUZGNPMVcwbFdJDQpsMGt2dVFSZmNqbDE2NjJadVhTL2I1dWgwNDdzTjJZQWJHQUtaVzVrYzNSeVpXRnRDbVZ1Wkc5aWFnbzNJREFnYjJKcUlHNTFiR3dLDQpaVzVrYjJKcUNqZ2dNQ0J2WW1vZ1d5OVFSRVlnTDFSbGVIUWdYUXBsYm1Sdlltb0tPU0F3SUc5aWFpQThQQ0F2UmpFZ01URWdNQ0JTDQpJQzlHTWlBeE1pQXdJRkkrUGdwbGJtUnZZbW9LTVRBZ01DQnZZbW9nYm5Wc2JDQUtaVzVrYjJKcUNqRXhJREFnYjJKcUNqdzhDaTlUDQpkV0owZVhCbElDOVVlWEJsTVFvdlFtRnpaVVp2Ym5RZ0wwaGxiSFpsZEdsallTMUNiMnhrQ2k5RmJtTnZaR2x1WnlBdlYybHVRVzV6DQphVVZ1WTI5a2FXNW5DaTlVZVhCbElDOUdiMjUwUGo0S1pXNWtiMkpxQ2pFeUlEQWdiMkpxQ2p3OENpOVRkV0owZVhCbElDOVVlWEJsDQpNUW92UW1GelpVWnZiblFnTDBobGJIWmxkR2xqWVFvdlJXNWpiMlJwYm1jZ0wxZHBia0Z1YzJsRmJtTnZaR2x1WndvdlZIbHdaU0F2DQpSbTl1ZEQ0K0NtVnVaRzlpYWdveE15QXdJRzlpYWlBOFBDOVVlWEJsSUM5UVlXZGxJQzlRWVhKbGJuUWdNaUF3SUZJZ0wxSmxjMjkxDQpjbU5sY3lBeE5DQXdJRklnTDBOdmJuUmxiblJ6SUZzeE5TQXdJRklnTWpBZ01DQlNYU0FnTDBGdWJtOTBjeUF4TmlBd0lGSStQZ3BsDQpibVJ2WW1vS01UUWdNQ0J2WW1vZ1BEd3ZVSEp2WTFObGRDQXhOeUF3SUZJZ0wwWnZiblFnTVRnZ01DQlNQajRLWlc1a2IySnFDakUxDQpJREFnYjJKcUlEdzhJQzlHYVd4MFpYSWdMMFpzWVhSbFJHVmpiMlJsSUM5TVpXNW5kR2dnTWpVeUlENCtJSE4wY21WaGJRcDRuRTJRDQpUMHZFTUJERjcva1VqejBwckpOSjJqU05SMTFkQkJkazdVMDhGSnVXU1A5QXQralh0Mm1wQ29FdzgzN3ZEVE4zaFdEQytqQTJmOFg1DQpLT1NqUm82aUZ0cVFnVTF6Y2daRkphNTJaMS83Y1JwUWg3RXI1NzhLVFpqS3R2UDk1RkVHWEh4L0NhaDgyM3IwdzloNWZJVm1Gc010DQpEdlJDWjBKUE1DcUpDQlJMcGFSeXp1NnZVWHdLeG8wanUwNDYwUDNNbjJnQk9aZXNJK2oyLzJMUzFHeXEwbEl6YzFTZjZiaWFkQ0paDQp4YmFtM1JJZnQxcnphNUhaZWJFa0o3MU8wMDZ5amF6N0paV09YTUpaZEdqZXlLY1dKMStGandIcktjcDU4Y1h6VUlnM3ZETXFvZkF0DQpWSTVjbVhnMmRNTFliS3RhOFNwK0FCMHBXM2dLWlc1a2MzUnlaV0Z0Q21WdVpHOWlhZ294TmlBd0lHOWlhaUJ1ZFd4c0NtVnVaRzlpDQphZ294TnlBd0lHOWlhaUJiTDFCRVJpQXZWR1Y0ZENCZENtVnVaRzlpYWdveE9DQXdJRzlpYWlBOFBDQXZSaklnTVRJZ01DQlNQajRLDQpaVzVrYjJKcUNqRTVJREFnYjJKcUlHNTFiR3dnQ21WdVpHOWlhZ295TUNBd0lHOWlhaUE4UENBdlJtbHNkR1Z5SUM5R2JHRjBaVVJsDQpZMjlrWlNBdlRHVnVaM1JvSURZMUlENCtJSE4wY21WaGJRcDRuSE1LNFRMUVU0QWdoYUowQkNmSW5VdmZ6VWpCVWlFa2pjdkUwa0xCDQozTVJBejF3aEpJVkxJeUF4UFZYQlNDRS9UY0ZJVXlFa2k4czFoQXNBNzFzT3VBcGxibVJ6ZEhKbFlXMEtaVzVrYjJKcUNqSXhJREFnDQpiMkpxSUR3OEwxUjVjR1VnTDA5MWRHeHBibVZ6SUM5RGIzVnVkQ0F0TVNBdlZHbDBiR1VnS0RNdU9ESXlMREF3S1NBdlVHRnlaVzUwDQpJRE1nTUNCU0lDQXZSR1Z6ZENCYk5DQXdJRklnSUM5WVdWb2dNQ0EzTlNBd1hRb2dMMFpwY25OMElESXlJREFnVWlBZ0wweGhjM1FnDQpNaklnTUNCU0lENCtDbVZ1Wkc5aWFnb3lNaUF3SUc5aWFpQThQQzlVZVhCbElDOVBkWFJzYVc1bGN5QWdMMVJwZEd4bElDZ3BJQzlRDQpZWEpsYm5RZ01qRWdNQ0JTSUNBdlJHVnpkQ0JiTkNBd0lGSWdJQzlZV1ZvZ01DQTNOU0F3WFFvK1BncGxibVJ2WW1vS01qTWdNQ0J2DQpZbW84UENBZ0wxQnliMlIxWTJWeUlDaHBMVzVsZENCRGNubHpkR0ZzTFVOc1pXRnlJRFl1TlM0eE9Ta2dMME55WldGMGFXOXVSR0YwDQpaU0FvUkRveU1EQTFNRGt4TlRFd05UZzBPU3N3TVNjd01DY3BJQzlOYjJSRVlYUmxJQ2hFT2pJd01Ea3dOekk1TVRZd05qQTNLekF4DQpKekF3SnlrZ0wxUnBkR3hsSUNoU1pYQnZjblF6S1Q0K0NtVnVaRzlpYWdwNGNtVm1DakFnTWpRS01EQXdNREF3TURBd01DQTJOVFV6DQpOU0JtSUFvd01EQXdNREF3TURBNUlEQXdNREF3SUc0Z0NqQXdNREF3TURBd056TWdNREF3TURBZ2JpQUtNREF3TURBd01ERTJNQ0F3DQpNREF3TUNCdUlBb3dNREF3TURBd01qTXpJREF3TURBd0lHNGdDakF3TURBd01EQXpNalVnTURBd01EQWdiaUFLTURBd01EQXdNRE0zDQpNU0F3TURBd01DQnVJQW93TURBd01EQXhNREV3SURBd01EQXdJRzRnQ2pBd01EQXdNREV3TXpBZ01EQXdNREFnYmlBS01EQXdNREF3DQpNVEExT1NBd01EQXdNQ0J1SUFvd01EQXdNREF4TVRBeElEQXdNREF3SUc0Z0NqQXdNREF3TURFeE1qTWdNREF3TURBZ2JpQUtNREF3DQpNREF3TVRJeU5TQXdNREF3TUNCdUlBb3dNREF3TURBeE16SXlJREF3TURBd0lHNGdDakF3TURBd01ERTBNamdnTURBd01EQWdiaUFLDQpNREF3TURBd01UUTNOeUF3TURBd01DQnVJQW93TURBd01EQXhPREF5SURBd01EQXdJRzRnQ2pBd01EQXdNREU0TWpNZ01EQXdNREFnDQpiaUFLTURBd01EQXdNVGcxTXlBd01EQXdNQ0J1SUFvd01EQXdNREF4T0RnMUlEQXdNREF3SUc0Z0NqQXdNREF3TURFNU1EY2dNREF3DQpNREFnYmlBS01EQXdNREF3TWpBME5DQXdNREF3TUNCdUlBb3dNREF3TURBeU1UZ3dJREF3TURBd0lHNGdDakF3TURBd01ESXlOekVnDQpNREF3TURBZ2JpQUtkSEpoYVd4bGNnbzhQQzlUYVhwbElESTBJQzlKYm1adklESXpJREFnVWlBZ0wxSnZiM1FnTVNBd0lGSWdQajRLDQpjM1JoY25SNGNtVm1DakkwTWpNS0pTVkZUMFlLb0lJRXpqQ0NCTW93Z2dPeW9BTUNBUUlDQXdDY01qQU5CZ2txaGtpRzl3MEJBUVVGDQpBREJvTVFzd0NRWURWUVFHRXdKSlZERVZNQk1HQTFVRUNoTU1URWxUU1ZRZ1V5NXdMa0V1TVNNd0lRWURWUVFMRXhwVFpYSjJhWHBwDQpieUJrYVNCalpYSjBhV1pwWTJGNmFXOXVaVEVkTUJzR0ExVUVBeE1VVEVsVFNWUWdRMEVnWkdrZ1UyVnlkbWw2YVc4d0hoY05NRGd3DQpNakUxTURnek5ESTFXaGNOTVRRd01qRTFNRGd6TkRJeldqQ0I0ekVMTUFrR0ExVUVCaE1DU1ZReEx6QXRCZ05WQkFvTUprTlNVeUJUDQpTVk5USUVObGNuUnBabWxqWVhScElHUnBJR1pwY20xaElHUnBaMmwwWVd4bE1TY3dKUVlEVlFRTERCNURaWEowYVdacFkyRjBhU0JQDQpjR1Z5WVhSdmNta2dWbWx5ZEhWaGJHa3hFVEFQQmdOVkJBUU1DRlpVUVVkTVQwUkpNUkF3RGdZRFZRUXFEQWRUVUVWRFFVMUNNUmt3DQpGd1lEVlFRRERCQlRVRVZEUVUxQ0lGWlVRVWRNVDBSSk1Sd3dHZ1lEVlFRRkV4TkpWRHBXVkVkVFEwMDFNRUV3TVVZeU1EVk5NUXN3DQpDUVlEVlFRTURBSXhNakVQTUEwR0ExVUVMaE1HTVRrd01URTVNSUdnTUEwR0NTcUdTSWIzRFFFQkFRVUFBNEdPQURDQmlnS0JnUUNUDQpweXpsWTZYeEd1WlllK2hLclAxRWVoL0pGTkZaRHQ1NEx3TVJYcVhyNmNQOXNPcXFGQUJhaXlZRWM2UXZmc1pzVlJFeXBsZHNwWTlMDQpPdzNjOUx3YlVIRFk1aStJREdWRkszWGg4djNmdngyRTBNdmh3L0tJa3BpMVM2ejhLUG5ZVW4xY0dwcDBqVWZEeTRBTm4wVk5xUmk4DQo0QzFBOFBZcWY1YVU5bGVPWHdJRUFLa0hSNk9DQVlJd2dnRitNRWdHQTFVZElBUkJNRDh3UFFZS0t3WUJCQUc4YmhNQ1l6QXZNQzBHDQpDQ3NHQVFVRkJ3SUJGaUZvZEhSd09pOHZkM2QzTG14cGMybDBMbWwwTDJacGNtMWhaR2xuYVhSaGJHVXdMd1lJS3dZQkJRVUhBUU1FDQpJekFoTUFnR0JnUUFqa1lCQVRBTEJnWUVBSTVHQVFNQ0FSUXdDQVlHQkFDT1JnRUVNQTRHQTFVZER3RUIvd1FFQXdJR1FEQWZCZ05WDQpIU01FR0RBV2dCU0V6YkV2SEt2UWk4OTYvc0c4VjdDS0hRNkZDekNCc0FZRFZSMGZCSUdvTUlHbE1JR2lvSUdmb0lHY2hvR1piR1JoDQpjRG92TDJ4a1lYQXVZM0p6TG14dmJXSmhjbVJwWVM1cGRDOWpiaVV6WkVORVVERXNiM1VsTTJSRFVrd2xNakJEUVNVeU1GTmxjblpwDQplbWx2TEc4bE0yUk1TVk5KVkNVeU1GTXVjQzVCTGl4akpUTmtTVlEvWTJWeWRHbG1hV05oZEdWU1pYWnZZMkYwYVc5dVRHbHpkRDlpDQpZWE5sUDI5aWFtVmpkRU5zWVhOelBXTlNURVJwYzNSeWFXSjFkR2x2YmxCdmFXNTBNQjBHQTFVZERnUVdCQlNRa0NWZ0NhRUdCdTRHDQoyWUNwYnBBaWVLcHJoREFOQmdrcWhraUc5dzBCQVFVRkFBT0NBUUVBanE2bVRkWWo1TklJWjFKT01pWnBJWDB1d2pMTEtKQ2pIQW91DQpZK3pQbVYrWk0vaFc1K3g5TjNrS0tPa0V5MkU5enNUYnp4RGtWd1dFZXFoU2tXNzF0R0JnN1YzYWtXUFdMQ282T3RwcUJ4TnBDKzZjDQpZUWV3ZXFHSkgrbVNad3dTWTcyMnNJQWVKOHhaQmNaZjZ6Mndrd04xRFh2Rld2OXBRV3JqU1RVSWdQc3BxSDZJOVduRXZNbjN5T3V0DQpiYjRpSHZjMkViMkxQU21mbVlXcTVYV0thWGk3N09mb1JEUDFoTU8vb3Z0MU12bnovME96cW9rVzhzRjFTVDl3OVpsazhvb2VYMTZkDQo1Q0VLWlY3ZTV2eit2OHQvYjhadmFrM2I5WmlpTWJKVGpNdFRYUHZKeFFOWmgzbGNnZmFiYXcvVndGc2c3Sms5YnNyL0N0aWxqU1FXDQpMVEdDQVhRd2dnRndBZ0VCTUc4d2FERUxNQWtHQTFVRUJoTUNTVlF4RlRBVEJnTlZCQW9UREV4SlUwbFVJRk11Y0M1QkxqRWpNQ0VHDQpBMVVFQ3hNYVUyVnlkbWw2YVc4Z1pHa2dZMlZ5ZEdsbWFXTmhlbWx2Ym1VeEhUQWJCZ05WQkFNVEZFeEpVMGxVSUVOQklHUnBJRk5sDQpjblpwZW1sdkFnTUFuREl3Q1FZRkt3NERBaG9GQUtCZE1CZ0dDU3FHU0liM0RRRUpBekVMQmdrcWhraUc5dzBCQndFd0hBWUpLb1pJDQpodmNOQVFrRk1ROFhEVEE1TURjeU9URTBNRFl6Tmxvd0l3WUpLb1pJaHZjTkFRa0VNUllFRkwzaGt0MW9ndGdWMllvamhseUxjMmxLDQpzVnlNTUEwR0NTcUdTSWIzRFFFQkJRVUFCSUdBaTNaZDlJeGJvOWRJQUkvbExPaVZCZUFudGFtdTdOanBQc3BCcTVFc3ZhcjcrbEtjDQpKMVpLcmgrVjdDK3VwYTZUM2ZDR05VNE5xY3ZRTW45SEI1MFZxNWNsZm9pNkJLOW9qRVdsWm4ydnNndlJGZG5YRWtlcFBkMHpzTHRXDQpwcHI2eTNvOE9RQWZhWVVESXVpSzhESnh4UTcxcWU2d0hNN1haQmFxVlRRSHZwMD0KDQotLVNpc3MNCkNvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vdGltZXN0YW1wLXJlcGx5OyBuYW1lPSJDOi9jb250ZW50LnA3bS50cyINCkNvbnRlbnQtVHJhbnNmZXItRW5jb2Rpbmc6IGJhc2U2NA0KQ29udGVudC1EaXNwb3NpdGlvbjogYXR0YWNobWVudDsgZmlsZW5hbWU9IkM6L2NvbnRlbnQucDdtLnRzIg0KQ29udGVudC1EZXNjcmlwdGlvbjogdGltZS1zdGFtcCByZXNwb25zZQ0KCk1JSUg3REFEQWdFQU1JSUg0d1lKS29aSWh2Y05BUWNDb0lJSDFEQ0NCOUFDQVFNeEN6QUpCZ1VyRGdNQ0dnVUFNSUhUQmdzcWhraUcNCjl3MEJDUkFCQktDQnd3U0J3RENCdlFJQkFRWUpLd1lCQkFHOGJnUUNNQ0V3Q1FZRkt3NERBaG9GQUFRVUdsNUVwcURIRW93dGtRdFkNCitwcTl4RXRPaEh3Q0NRRFVhd0RZdGZVdlFCZ1BNakF3T1RBM01qa3hOREEyTkRWYW9HNmtiREJxTVFzd0NRWURWUVFHRXdKSlZERVYNCk1CTUdBMVVFQ2hNTVRFbFRTVlFnVXk1d0xrRXVNU2d3SmdZRFZRUUxFeDlUWlhKMmFYcHBieUJrYVNCdFlYSmpZWFIxY21FZ2RHVnQNCmNHOXlZV3hsTVJvd0dBWURWUVFERXhGVWFXMWxJRk4wWVcxd0lGTmxjblpsY3FDQ0JJOHdnZ1NMTUlJRGM2QURBZ0VDQWdJbEFEQU4NCkJna3Foa2lHOXcwQkFRVUZBRENCanpFTE1Ba0dBMVVFQmhNQ1NWUXhGVEFUQmdOVkJBb1RERXhKVTBsVUlGTXVjQzVCTGpFak1DRUcNCkExVUVDeE1hVTJWeWRtbDZhVzhnWkdrZ1kyVnlkR2xtYVdOaGVtbHZibVV4UkRCQ0JnTlZCQU1UTzB4SlUwbFVJRk5sY25acGVtbHYNCklHUnBJR05sY25ScFptbGpZWHBwYjI1bElIQmxjaUJzWVNCTllYSmpZWFIxY21FZ1ZHVnRjRzl5WVd4bE1CNFhEVEE1TURZeU5qQTUNCk5EQTFORm9YRFRFMk1Ea3dNakUwTkRjd01Wb3dhakVMTUFrR0ExVUVCaE1DU1ZReEZUQVRCZ05WQkFvVERFeEpVMGxVSUZNdWNDNUINCkxqRW9NQ1lHQTFVRUN4TWZVMlZ5ZG1sNmFXOGdaR2tnYldGeVkyRjBkWEpoSUhSbGJYQnZjbUZzWlRFYU1CZ0dBMVVFQXhNUlZHbHQNClpTQlRkR0Z0Y0NCVFpYSjJaWEl3Z1o4d0RRWUpLb1pJaHZjTkFRRUJCUUFEZ1kwQU1JR0pBb0dCQU1JL1lHZ0kvdndLYjF6TXBEWGkNCksyMitqNEhqQU1hUFd0RjN1SkpqNEdHdmo2SU0wSmdMbHpKWWl1WHZJQ3V2aW5wSE9lVWlQQlFhSkFHS3E0TmNyNzFPTS9UbjdkTEcNClgyVTdtQ25ZRTlxV05weVZpSnVVS1JudFpybjQ4VjA5ZVp1bnY2UUUzWTJ3cGpmb2VqaVpxV2RVem5qd2lSL29TT0xpM01lZWFXVTkNCkFnTUJBQUdqZ2dHWE1JSUJrekJIQmdOVkhTQUVRREErTUR3R0NTc0dBUVFCdkc0RUFqQXZNQzBHQ0NzR0FRVUZCd0lCRmlGb2RIUncNCk9pOHZkM2QzTG14cGMybDBMbWwwTDJacGNtMWhaR2xuYVhSaGJHVXdEZ1lEVlIwUEFRSC9CQVFEQWdlQU1CWUdBMVVkSlFFQi93UU0NCk1Bb0dDQ3NHQVFVRkJ3TUlNQjhHQTFVZEl3UVlNQmFBRkxVb1pBZ29OL0xRT3FyQ09ON3ZZV0g5WkJZaU1JSGZCZ05WSFI4RWdkY3cNCmdkUXdnZEdnZ2M2Z2djdUdnY2hzWkdGd09pOHZiR1JoY0M1amNuTXViRzl0WW1GeVpHbGhMbWwwTDJOdUpUTmtURWxUU1ZRbE1qQlQNClpYSjJhWHBwYnlVeU1HUnBKVEl3WTJWeWRHbG1hV05oZW1sdmJtVWxNakJ3WlhJbE1qQnNZU1V5TUUxaGNtTmhkSFZ5WVNVeU1GUmwNCmJYQnZjbUZzWlN4dmRTVXpaRk5sY25acGVtbHZKVEl3WkdrbE1qQmpaWEowYVdacFkyRjZhVzl1WlN4dkpUTmtURWxUU1ZRbE1qQlQNCkxuQXVRUzRzWXlVelpFbFVQMk5sY25ScFptbGpZWFJsVW1WMmIyTmhkR2x2Ymt4cGMzUS9ZbUZ6WlRBZEJnTlZIUTRFRmdRVVlDZHINCmVyaFIvb2N4dzhCdFdFeTJEMGE2UjlJd0RRWUpLb1pJaHZjTkFRRUZCUUFEZ2dFQkFEN3pDS0sxMm9hSUVOSGlIQ1Q3OXRlSUJ1YVANClBiMHZKcXlJNHBLaldYVmVvWWIyazlTcyt4SjVva3pSMXdZVE9NRHF4b29QangxUnpCMGpkOFFnWGJ6MDIvaEsyd3Z5V2JPeS9iUUoNCnI4UHdWNFhIU0hXQndJR1V4Skgrek5jRVhDRy9aejdYNEhDQ2F0ckdBY1BwRy9TTElvMVh3a3ZaQUs1dDh4YTlOeElXa2ZWNldKNXENCjFENDZqNUNESGVYbkhDZTdzczR1QnlNMmt6MGdOaE92RlgxNkMrdVJhNFNIcHJjdVNBZlBTVnZLeTdRZUVxSk1UdFd0amJjMGRJM0sNCmFIUFNlZ2lnanhvOVQxbUdjbkJSd0lMdVhMZzJITzJnU0ppRzV6bXFCaHlpellvVDErcXN2VHA3NlludFc1aTZ2elNPYzVUcm9iUG8NCmNWK05rWUpWU3FzeGdnSlRNSUlDVHdJQkFUQ0JsakNCanpFTE1Ba0dBMVVFQmhNQ1NWUXhGVEFUQmdOVkJBb1RERXhKVTBsVUlGTXUNCmNDNUJMakVqTUNFR0ExVUVDeE1hVTJWeWRtbDZhVzhnWkdrZ1kyVnlkR2xtYVdOaGVtbHZibVV4UkRCQ0JnTlZCQU1UTzB4SlUwbFUNCklGTmxjblpwZW1sdklHUnBJR05sY25ScFptbGpZWHBwYjI1bElIQmxjaUJzWVNCTllYSmpZWFIxY21FZ1ZHVnRjRzl5WVd4bEFnSWwNCkFEQUpCZ1VyRGdNQ0dnVUFvSUlCRWpBYUJna3Foa2lHOXcwQkNRTXhEUVlMS29aSWh2Y05BUWtRQVFRd0l3WUpLb1pJaHZjTkFRa0UNCk1SWUVGSFdhb1NHNHBJRC9UTWRiandFamwrZU0yKzdnTUlIT0Jnc3Foa2lHOXcwQkNSQUNEREdCdmpDQnV6Q0J1RENCdFFRVUhJQm8NCnhDMXUwTHdMMkgvNWdhaWYzam8ybVJNd2dad3dnWldrZ1pJd2dZOHhDekFKQmdOVkJBWVRBa2xVTVJVd0V3WURWUVFLRXd4TVNWTkoNClZDQlRMbkF1UVM0eEl6QWhCZ05WQkFzVEdsTmxjblpwZW1sdklHUnBJR05sY25ScFptbGpZWHBwYjI1bE1VUXdRZ1lEVlFRREV6dE0NClNWTkpWQ0JUWlhKMmFYcHBieUJrYVNCalpYSjBhV1pwWTJGNmFXOXVaU0J3WlhJZ2JHRWdUV0Z5WTJGMGRYSmhJRlJsYlhCdmNtRnMNClpRSUNKUUF3RFFZSktvWklodmNOQVFFQkJRQUVnWUNHMURtWlJpSiszQjBtSFdGOGVLSUkyT1gwU1grNmwzblBSK1hjVzRKNFRGeGcNCi9acG9WNlhDaG1KZzc4MXk1NjNzdG5WRWdWNEJlcjFiSTJJZ1oySlhpSjJwYVFITGxoUXdGWFdaUWN6RzVINTlsZjFNWEFUb3BRSnQNClU5NEcxaHJaOEppM1NsU2lPRFUrYnZuUTVSSm1aV0l3SFZ4U3RCdzlHOVNNT3o0cVJ3PT0KDQoNCi0tU2lzcy0t</contenutoFirmato><marcaTemporale>01</marcaTemporale><uriReferto>REF03097803006700P240995</uriReferto></documento></documenti></m:REF.firmaMarcaArchiviaResponse>')
xmlDoc1.loadXML(aa);
try{
var faultstring=xmlDoc1.getElementsByTagName("faultstring")[0].childNodes[0].nodeValue;
alert(faultstring);
}
catch(e){
            var esitoOperazione=xmlDoc1.getElementsByTagName("esito")[0].childNodes[0].nodeValue;
            alert("esito:" + esitoOperazione)

            if (esitoOperazione=="OK")
            {
              //errorObject = httpRequestObject.responseXML.getElementsByTagName("ERROR")[0];

              salvaReferti();
            }
        }
}

var contat=0;

function salvaReferti(){

              var esito="";
              var identificativo;
              var contenuto;
              var uriReferto;
              var autorizzazioneFirmata;
             // alert(ArrrefSiss.length)
             
 //alert(contat)
              //alert(i<ArrrefSiss.length)
                        if (contat<ArrrefSiss.length)
              {
		document.all.oTable.rows(vettore_indici_sel[contat]).style.backgroundColor =  '#FF6600'

              try{
              esito = xmlDoc1.getElementsByTagName("documenti/documento/esitoOperazione")[contat].text;
              if (esito=="OK")
              {
              alert(esito);
              identificativo = xmlDoc1.getElementsByTagName("documenti/documento/identificativoDocumento")[contat].text;
              //alert(identificativo);
              contenuto = xmlDoc1.getElementsByTagName("documenti/documento/contenutoFirmato")[contat].text;
              //alert(contenuto);
              uriReferto = xmlDoc1.getElementsByTagName("documenti/documento/uriReferto")[contat].text;
              //alert(uriReferto);
              //autorizzazioneFirmata = xmlDoc1.getElementsByTagName("documenti/documento/autorizzazioneFirmata")[i].text;
              //alert(autorizzazioneFirmata);
              //  var nodes = xmlDoc1.getElementsByTagName("/documentidocumento/esitoOperazione")[i].text;
              currentIdenRef=identificativo.split("_")[0]
              alert(currentIdenRef);
              currentProgressivo=identificativo.split("_")[1]
              alert(currentProgressivo);
              alert(array_Idenvr[contat]);
              alert(contenuto);
              Update_Firmato.UpdateDBDAO(currentIdenRef+"*"+currentProgressivo+"*F*"+array_Idenvr[contat]+ "*"+ contenuto+"*"+autorizzazioneFirmata,salvaReferti)
              contat++;
              document.all.oTable.rows(vettore_indici_sel[contat]).style.backgroundColor = '#00FF00';
              }
              else
              {
                 document.all.oTable.rows(vettore_indici_sel[contat]).style.backgroundColor = '#FF0000';	
			contat++;

		   salvaReferti();
              }
              }
              catch(e){
              alert(e);
              }

              }


          }
