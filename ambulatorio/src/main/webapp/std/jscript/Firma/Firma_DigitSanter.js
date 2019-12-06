// JavaScript Document
var typeClose='S'
var tipo_firma="";
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
function firma(variabile){
tipo_firma=variabile;
var metodo="REF.FirmaMarcaArchivia"
var report="REFERTO_FIRMA.rpt";
if (tipo_firma=='3')
{
alert(document.all.pdfReader.PDFurl);
var metodo="REF.FirmaMarcaArchiviaAnnulla"
report="REFERTO_ANNULLA.rpt"
var rep=document.all.pdfReader.PDFurl;
rep=rep.replace("REFERTO_FIRMA.RPT","REFERTO_ANNULLA.rpt");
document.all.pdfReader.PDFurl=rep
alert(document.all.pdfReader.PDFurl);
document.all.pdfReader.printAll();

}
var to_dwr=metodo+"*"+ID_referto+"*"+report+"*"+CDC;
dwrDAO.GetXmlDao(to_dwr,firma2);
}

function firma2 (variabileRit){
alert(variabileRit)
ArrS = variabileRit.split("*");
  if (ArrS[0]=='0')
  {
    if (ArrS[1]=='OK')
    {
        document.id_aggiorna.HinputDAO.value=ArrS[2];
        var myObj= new ActiveXObject("ActiveXSissWay.CallSissWayWin");
        var aa;
        if (tipo_firma=='0')
        {
          var ToSend=document.id_aggiorna.HinputDAO.value.replace("<naturaReferto>01</naturaReferto>","<naturaReferto>01</naturaReferto>");
        }
        if (tipo_firma=='1')
        {
          var ToSend=document.id_aggiorna.HinputDAO.value.replace("<naturaReferto>01</naturaReferto>","<naturaReferto>02</naturaReferto>");
        }
        if (tipo_firma=='2')
        {
          var ToSend=document.id_aggiorna.HinputDAO.value.replace("<naturaReferto>01</naturaReferto>","<naturaReferto>03</naturaReferto>");
        }
        if (tipo_firma=='3')
        {
          var ToSend=document.id_aggiorna.HinputDAO.value.replace("<naturaReferto>01</naturaReferto>","<naturaReferto>04</naturaReferto>");
        }
        aa=myObj.sendRequest(ToSend);
alert(aa);
myObj.terminate();
Update_Firmato.UpdateDBDAOSanter(ID_referto+'*'+progr+'*'+document.id_aggiorna.HIden_vr.value+'_'+tipo_firma+'*'+aa,dwrEndUpdateSanter);
      }

  }
}




function dwrEndUpdateSanter(variabile){
alert(variabile);


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
