// JavaScript Document
var typeClose='S';
var tipo_firma='';
var OpenXml =  '<?xml version="1.0" encoding="ISO-8859-1"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsd="http://www.w3.org/1999/XMLSchema" xmlns:xsi="http://www.w3.org/1999/XMLSchema-instance" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">';
var XmlDAO = '';
var METODI='FSE';


function initOBJfirmaSanter(){
var LeggiOpeRisp;
altezza = screen.height-60;
	largh = screen.width-25;
	//alert('stsgffjklfdjgkldfjdl');
document.write('<object CLASSID="clsid:969CB476-504B-41CF-B082-1B8CDD18323A" CODEBASE="cab/pdfControl/prjXPdfReader.CAB#version=1,0,0,2"  id="pdfReader">');
	// id="pdfReader">);
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
document.all.pdfReader.PrintVisible(false);
document.all.pdfReader.PrintOnVisible(false);
document.all.pdfReader.PDFurl=pdfPosition;
document.all.pdfReader.printAll();

WriteLogTemp(' **INIZIO FIRMA DIGITALE SINGOLA**');

LeggiOpeRisp = LeggiOperatoreSISS();
CodFiscSC = estraiValoreXML(LeggiOpeRisp, "userId");//CODICE FISCALE SMART CARD

WriteLogTemp(' COD FISCALE WEB = '+COD_FISC_PER+' COD FISCALE CARTA = '+CodFiscSC);


//Controllo COD_FISC carta con utente loggato, la var globale è COD_FISC_PER
if (CodFiscSC != COD_FISC_PER){
	alert("L'utente loggato è diverso dall'utente associato alla carta");
	return;
}

}

function firma(Type){
var Contenuto='';
var richFirmaDoc = '';
var RitornoSiss='';
var ottieniDocFirm='';
var PDF_Firmato = '';
var Esito = '';
var AutorizzDAO = '';
var ErrorStack = '';
var ContenutoDao = '';
var ErrorSISS = '';
var ret = '';
dwr.engine.setAsync(false);
if (CodFiscSC != COD_FISC_PER){
	alert("L'utente loggato è diverso dall'utente associato alla carta");
}
if ((Oscuramento=='00000' && Autorizzazione=='S')||(Type=='3')){
	
		WriteLogTemp('REFERTO SENZA DAO**');

		//RICHIEDI FIRMA DOCUMENTO
		Contenuto = document.all.pdfReader.GetMyPdfBase64();
		richFirmaDoc = richiediFirmaDocumento(ID_referto + '_'+ progr,Contenuto,'1','1');

		
		WriteLogTemp(' RICHIEDO FIRMA DOCUMENTO');

		RitornoSiss = CallSISS(richFirmaDoc);

		WriteLogTemp(' RITORNO RICHIEDIFIRMADOCUMENTO');

		ErrorSISS = CercaErrore(RitornoSiss);
		
		if (ErrorSISS == 'OK'){
		//OTTIENI DOCUMENTO FIRMATO
		ottieniDocFirm = ottieniDocFirmato(ID_referto + '_' + progr,'1','1');
		RitornoSiss = CallSISS(ottieniDocFirm);
		
		WriteLogTemp(' RITORNO OTTIENIDOCUMENTO FIRMATO');

		Esito = estraiValoreXML(RitornoSiss, 'esitoOperazione');
		
			if(Esito == 'FIRMA_OK'){

				WriteLogTemp(' FIRMA_OK ESTRAGGO IL PDF FIRMATO');

				PDF_Firmato = estraiValoreXML(RitornoSiss, 'contenutoFirmato');
	
				WriteLogTemp(' FIRMA_OK SALVO IL PDF FIRMATO');
				//Salvo il PDF, //Nascondo il tasto standard.
				ret = salva_refertoFirmato(PDF_Firmato,Type,'');

				WriteLogTemp(' FINE PROCEDURA DI SALVATAGGIO IL PDF FIRMATO');
				if (ret=="OK"){
					NascondiTasti(Type,'OK');
					if(Type=='0'){
						alert('Referto Firmato Correttamente');
					}else if (Type =='1'){
						alert('Referto Sostitutivo Firmato Correttamente');
					}else if (Type=='2'){
						alert('Referto Integrativo Firmato Correttamente');					
					}else if(Type == '3'){
						alert('Referto Annullativo Firmato Correttamente');
					}
					
				}else{
					
					alert('Errore durante il salvataggio del referto firmato');
					NascondiTasti(Type, 'KO');
				}
			}else{
				if(ErrorSISS!='OK'){
					alert(ErrorSISS);
				}
				NascondiTasti(Type, 'KO');
			}
		}else{
			if(ErrorSISS!='OK'){
				alert(ErrorSISS);
			}
			NascondiTasti(Type, 'KO');
			
		}
		
	}else{		//chiamo generazione del DAO
		
		WriteLogTemp(' REFERTO CON DAO');
		var hash = '';
		var xslt = '';

	if (METODI=='FSE')
	{
		dwrSoapSISS.GetDaoFSE(Oscuramento+"*"+Autorizzazione+"*"+NoteRepe+"*"+ID_referto,RispostaDao);
	}
	else
	{
		dwrSoapSISS.GetDao(Oscuramento+"*"+Autorizzazione+"*"+NoteRepe+"*"+ID_referto,RispostaDao);

	}
		
		WriteLogTemp(' CHIAMO AUTORIZZAZIONE DEL DAO AL SISS');

		AutorizzDAO = CallSISS(XmlDAO);
		WriteLogTemp('XML DI AUTORIZZAZIONE RISPOSTA : ' + AutorizzDAO );
		Esito = estraiValoreXML(AutorizzDAO, 'esito');
		hash = estraiValoreXML(AutorizzDAO,'hashReferto');
		xslt = estraiValoreXML(AutorizzDAO,'versioneXSLT');
		ContenutoDao = estraiValoreXML(AutorizzDAO, 'contenuto');
		
				
		WriteLogTemp(' RISPOSTA OTTENUTA DAL SISS ');

		if (Esito == 'OK'){
			//RICHIEDI FIRMA DOCUMENTO 
			Esito = '';
			Contenuto = document.all.pdfReader.GetMyPdfBase64();
			richFirmaDoc = richiediFirmaDocumento(ID_referto + '_'+ progr,Contenuto,'1','0');
			
			WriteLogTemp(' CHIAMO RICHIEDIFIRMADOCUMENTO AL SISS ');

			RitornoSiss = CallSISS(richFirmaDoc);
			ErrorSISS = CercaErrore(RitornoSiss);

			WriteLogTemp(' OTTENUTA RISPOSTA RICHIEDIFIRMADOCUMENTO DAL SISS ');
			
			if(ErrorSISS == 'OK'){
				//RICHIEDI FIRMA DOCUMENTO DAO
				
				WriteLogTemp(' CHIAMO RICHIEDI FIRMA DOCUMENTO DEL DAO AL SISS ');

				richFirmaDoc = richiediFirmaDocumento(ID_referto + '_' + progr +'_DAO',ContenutoDao,'0','1');
				RitornoSiss = CallSISS(richFirmaDoc);

				WriteLogTemp(' OTTENUTA RISPOSTA DEL DAO DAL SISS ');

				ErrorSISS = CercaErrore(RitornoSiss);

				if(ErrorSISS == 'OK'){
					//OTTIENI DOCUMENTO FIRMATO
					ottieniDocFirm = ottieniDocFirmato(ID_referto + '_' + progr,'1','0');

					WriteLogTemp(' CHIAMO OTTIENIDOCUMENTOFIRMATO AL SISS ');

					RitornoSiss = CallSISS(ottieniDocFirm);
					
					WriteLogTemp(' OTTENUTA RISPOSTA OTTIENIDOCUMENTOFIRMATO DAL SISS ');

					Esito = estraiValoreXML(RitornoSiss, 'esitoOperazione');
					PDF_Firmato = estraiValoreXML(RitornoSiss, 'contenutoFirmato');
					
					if(Esito=='FIRMA_OK'){
							//OTTIENI DOCUMENTO FIRMATO DAO
							ottieniDocFirm = ottieniDocFirmato(ID_referto + '_' + progr+'_DAO','0','1');
						
						WriteLogTemp(' CHIAMO OTTIENIDOCUMENTOFIRMATO DAO AL SISS ');

							RitornoSiss = CallSISS(ottieniDocFirm);

					WriteLogTemp(' OTTENUTA RISPOSTA OTTIENIDOCUMENTOFIRMATO DAO DAL SISS ');

							Esito = estraiValoreXML(RitornoSiss, 'esitoOperazione');
							
							if(Esito =='FIRMA_OK'){
								//ok adesso SALVO tutto
									PDF_Firmato_DAO = estraiValoreXML(RitornoSiss, 'contenutoFirmato');
							WriteLogTemp(' SALVO IL PDF FIRMATO E IL DAO');
									ret = salva_refertoFirmato(PDF_Firmato,Type,PDF_Firmato_DAO);
							WriteLogTemp(' COMPLETATO SALVATAGGIO SU DB');

					try{
						WriteLogTemp('INIZIO SALVATAGGIO HASH XSLT '+hash + ' ' + xslt + ' ' + ID_referto + ' ' + progr);

						var nome_procedura = '';
						nome_procedura = 'SP_UPD_XSLTHASH';

						CJsUpdate.call_stored_procedure (nome_procedura +'@'+hash+','+xslt+','+ID_referto+','+progr+'@FALSE,@ ');
						
						WriteLogTemp('COMPLETATO SALVATAGGIO ');
					}catch(e){
						WriteLogTemp('ERRORE DURANTE SALVATAGGIO XSLT HASH');
					}

									if(ret=='OK'){
										NascondiTasti(Type, 'OK');
										if(Type=='0'){
											alert('Referto Firmato Correttamente');
										}else if (Type =='1'){
											alert('Referto Sostitutivo Firmato Correttamente');
										}else if (Type=='2'){
											alert('Referto Integrativo Firmato Correttamente');					
										}else if(Type == '3'){
											alert('Referto Annullativo Firmato Correttamente');
										}
									}else{
										alert('Errore durante il salvataggio del DAO Firmato');
										NascondiTasti(Type, 'KO');
									}
								}
								else{
									alert('Errore durante la firma del DAO');
									NascondiTasti(Type, 'KO');
								}
							
					}else{
						alert('Errore durante il salvataggio del referto firmato');
						NascondiTasti(Type, 'KO');
					}
					
				}else{
					if (ErrorSISS!='OK'){
						alert(ErrorSISS);
					}
					alert('Firma Digitale Fallita');
					NascondiTasti(Type,'KO');				
				}
			
			}else{
				if (ErrorSISS!='OK'){
					alert(ErrorSISS);
				}
				alert('Richiesta Firma Fallita');
				NascondiTasti(Type,'KO');
				}
		}else{
			alert(AutorizzDAO);
			ErrorStack = estraiValoreXML(AutorizzDAO, 'errorStack');
			alert(ErrorStack);
			alert('Autorizzazione Fallita');
			NascondiTasti(Type,'KO');
			}
		}
		dwr.engine.setAsync(true);
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
var conferma;
if (document.id_chiusura.HinputFirmatoS_N.value=='N')
	{

	conferma=confirm("Verranno Perse Tutte Le Modifiche continuare?");

	if (conferma)
	{
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
		opener.chiudi();
        typeClose='N';
        self.close();
	//Update_Firmato.RollBackDb(ID_referto+'*'+progr,aggiornaForm2);

}


function salva_refertoFirmato(PdfFirmato,TipoFirma,dao){

if(document.id_aggiorna.HinputRefFirmato.value.length > 0 )

{
	if(dao==''){
		dao='NO';
	}

Update_Firmato.UpdateDBDAO(ID_referto+'*'+progr+'*'+TipoFirma+'*'+document.id_aggiorna.HIden_vr.value+'*'+PdfFirmato+'*'+dao,aggiornaForm);

try {
opener.registrazioneAbilitata = false;
	// diabilito medico refertante
opener.disableLinkMedRiferimento();
	// nascondo il pulsante di salvataggio
opener.hideSaveButton();
return "OK";
}
catch(e){
	;
}
	}
	else
	{
alert('Errore - Referto non firmato');
//Update_Firmato.RollBackDb(ID_referto+'*'+progr,aggiornaForm2);

	}

}


function aggiornaForm(ret){

if (ret=="0")
{
  document.id_chiusura.HinputFirmatoS_N.value='S';
}
else
{
  alert("Errore Archiviazione Firma  " + ret);
  document.id_chiusura.HinputFirmatoS_N.value='N';
}

}


function aggiornaForm2(ret){

if (ret=="")
{
  document.id_chiusura.HinputFirmatoS_N.value='S';
self.close();
}
else
{
  alert("Errore Archiviazione Firma  " + ret);
  document.id_chiusura.HinputFirmatoS_N.value='N';
self.close();
}

}

function ModificaDao(test){
	var finestraCheck = window.open("SrvDAO?HTESTO_TXT=''&HTESTO_RTF=''&sorgente=''&HidenSecondoMed=''&HREPARTO=''&hidFunctionToCall=onlyReg&idenRef="+ID_referto,"wndCheckUser","left=0; top=0,width=350px, height=150px,status=yes");
		if(finestraCheck){
				finestraCheck.focus();
			}
		else{
			finestraCheck = window.open("SrvDAO?HTESTO_TXT=''&HTESTO_RTF=''&sorgente=''&HidenSecondoMed=''&HREPARTO=''&hidFunctionToCall=onlyReg&idenRef="+ID_referto,"wndCheckUser","left=0; top=0,width=350px, height=150px,status=yes");
			}
	}

function estraiValoreXML(inXML,campo)
	{
	var StartCut=0;
	
	var campoStart='<'+campo+'>';
	var lenStartcut=campoStart.length;
	var campoStop='</'+campo+'>';
	var StopCut;
	var valoreEstratto='';
	var lenToCut=0;
		
		StartCut=inXML.indexOf(campoStart);
		StartCut=StartCut+lenStartcut;
		StopCut=inXML.indexOf(campoStop);
		lenToCut=StopCut-StartCut;
		valoreEstratto=inXML.substr(StartCut,lenToCut);
		return valoreEstratto;
	}

function CallSISS(InputXML) // Chiamata Soap sulla porta 8000 localhost
{
var xmlHttp;
var RispostaSISS;
//xmlHttp = InputXML;
try{
	try{
	    xmlHttp=new ActiveXObject("Msxml2.XMLHTTP.3.0");
		}
	  catch (e)
	      {
		  alert("Fallita chiamata Soap");      
	 
		  }
	  
		xmlHttp.onreadystatechange=function(){
	    if(xmlHttp.readyState==4)
	      {
	    	RispostaSISS=xmlHttp.responseText;
		WriteLogTemp(' RISPOSTA CHIAMATA SOAP DAL SISS');
		
	      }
	}
	  xmlHttp.open("POST","http://127.0.0.1:8000",false);
		WriteLogTemp(' SEND CHIAMATA SOAP AL SISS');
	  xmlHttp.send(InputXML); 
  	return RispostaSISS;

}catch(e){
alert(e.description);
	//alert('Errore, verificare l\'autenticazione sul SISS' + ' ' + e);
	try{
     	 xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
	  xmlHttp.open("POST","http://127.0.0.1:8000",false);
	  xmlHttp.send(InputXML); 
	}catch(e){
		alert(e.description);
		alert('Verificare l\'autenticazione sul SISS e riporovare');
	}
  
  	return RispostaSISS;

	}
}


function LeggiOperatoreSISS(){
var XML_OPE = '';
var Ritorno;

XML_OPE = OpenXml;
XML_OPE = XML_OPE + '<SOAP-ENV:Body>';
XML_OPE = XML_OPE + '<m:SA.ottieniCredenzialeInChiaro xmlns:m="http://www.crs.lombardia.it/schemas/CRS-SISS/SA/2005-01/ottieniCredenzialeInChiaro/" dataSetVersion="1.0">';
XML_OPE = XML_OPE + '<param></param></m:SA.ottieniCredenzialeInChiaro></SOAP-ENV:Body></SOAP-ENV:Envelope>';

Ritorno = CallSISS(XML_OPE);

return Ritorno;

}

function richiediFirmaDocumento(IdDocumento,Contenuto,InizioLotto,FineLotto){
	var XML_FD = '';

	XML_FD = OpenXml;
	XML_FD = XML_FD +'<SOAP-ENV:Body>';
	XML_FD = XML_FD +'<m:SA.richiediFirmaDocumento xmlns:m="http://www.crs.lombardia.it/schemas/CRS-SISS/SA/2005-01/richiediFirmaDocumento/" dataSetVersion="1.0">';
	XML_FD = XML_FD +'<param>';
	XML_FD = XML_FD +'<dati>';
	XML_FD = XML_FD +'<inizioLotto>'+InizioLotto+'</inizioLotto>';//paramaetrizzare
	XML_FD = XML_FD +'<fineLotto>'+FineLotto+'</fineLotto>';//paramaetrizzare
	XML_FD = XML_FD +'<documento>';
	XML_FD = XML_FD +'<identificativoDocumento>'+IdDocumento+'</identificativoDocumento>';
	XML_FD = XML_FD +'<tipoDocumento>TESTO</tipoDocumento>';
	XML_FD = XML_FD +'<tipoFirma>LEGALE_OPERATORE</tipoFirma>';
	XML_FD = XML_FD +'<contenuto>'+Contenuto+'</contenuto>';
	XML_FD = XML_FD +'</documento>';
	XML_FD = XML_FD +'</dati>';
	XML_FD = XML_FD +'</param>';
	XML_FD = XML_FD +'</m:SA.richiediFirmaDocumento>';
	XML_FD = XML_FD +'</SOAP-ENV:Body>';
	XML_FD = XML_FD +'</SOAP-ENV:Envelope>';

	return XML_FD;
}

function ottieniDocFirmato(IdDocumento,InizioLotto,FineLotto){
var XML_ODF = '';

XML_ODF = OpenXml;
XML_ODF = XML_ODF +'<SOAP-ENV:Body>';
XML_ODF = XML_ODF +'<m:SA.ottieniDocumentoFirmato xmlns:m="http://www.crs.lombardia.it/schemas/CRS-SISS/SA/2005-01/ottieniDocumentoFirmato/" dataSetVersion="1.0">';
XML_ODF = XML_ODF +'<param><dati><inizioLotto>'+InizioLotto+'</inizioLotto><fineLotto>'+FineLotto+'</fineLotto><documento>';
XML_ODF = XML_ODF +'<identificativoDocumento>'+IdDocumento+'</identificativoDocumento></documento></dati></param>';
XML_ODF = XML_ODF +'</m:SA.ottieniDocumentoFirmato>';
XML_ODF = XML_ODF +'</SOAP-ENV:Body>';
XML_ODF = XML_ODF +'</SOAP-ENV:Envelope>';

return XML_ODF;

}


function RispostaDao(Valore){
WriteLogTemp(Valore);
alert(Valore);
	XmlDAO =  Valore;

}

function NascondiTasti(Type,EsitoOk){
	if(Type=='0'){
		cd = document.getElementById('divbtStand');
		cd.style.display = 'none';
	}else{
		objSost = document.getElementById('divbtSost');
		objSost.style.display = 'none';
		objIntegr = document.getElementById('divbtIntegr');
		objIntegr.style.display = 'none';					
		objAnn = document.getElementById('divbtAnnull');
		objAnn.style.display = 'none';
	}
	obj = document.getElementById('divbtModDao');
	obj.style.display = 'none';		
	if (EsitoOk == 'OK'){
		document.id_chiusura.HinputFirmatoS_N.value='S';
		document.all.pdfReader.PrintVisible(true);
		document.all.pdfReader.PrintOnVisible(true);
		document.all.pdfReader.printAll();
	}else{
		document.id_chiusura.HinputFirmatoS_N.value='S';
		document.all.pdfReader.PrintVisible(false);
		document.all.pdfReader.PrintOnVisible(false);
		document.all.pdfReader.printAll();
	}
}

function CercaErrore(Xml){
var Error = '';
var	Exception = '';
var Ritorno = '';

//gestire il firma legale rifutata
	Error = estraiValoreXML(Xml, 'descErrore');
	if(Error != ''){
		Exception = estraiValoreXML(Xml, 'descEccezione');
		Ritorno = Error + ' : ' + Exception;
	}else{
		Ritorno = 'OK';
	}
	
	return Ritorno;
}

function WriteLogTemp(stringa){
try{
	var d = new Date();
	var Day = d.getDate();
	var H = d.getHours();
	var M = d.getMinutes();
	var Sec = d.getSeconds();
	var Mlsec= d.getMilliseconds();
	var DataOra = Day + ' ' + H +':'+M+':'+Sec+':' +Mlsec;
	var Str = DataOra + ' '+ stringa;
	
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var path = fso.GetSpecialFolder(2);

	 var  a, ForAppending;
	  ForAppending = 8;
	  var File_Log;

	  File_Log=path+"\\log_firma_digitale.txt";
  
	  if (!fso.FileExists(File_Log))
		{
			fso.CreateTextFile (File_Log);
		}
	  a = fso.OpenTextFile(File_Log, ForAppending, false);
	  a.Write(Str );
	  a.WriteBlankLines(1);
	  a.Close();
}catch(e){

}

}

