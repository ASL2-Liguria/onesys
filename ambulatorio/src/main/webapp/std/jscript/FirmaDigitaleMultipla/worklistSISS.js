var pdfbase64;
var iden_vr = '';
var iden_buonfine = '';
var progressivo = '0';
var TypeF = '0';
var XmlDAO_Multi = '';
var RetCF = '';//ritrono dwr smart card /ute loggato;
var idRefOttieni = '';
var ArrayToSave = '';
var path = 'c:\\';
function firma_multipla(){
	WriteLogTemp('************ INZIO PROCESSO DI FIRMA MULTIPLA ***********');
	FirmaMultiplaSISS();
}

function FirmaMultiplaSISS(){
//tirare fuori array_progressivi referti oppure utilizzare la funzione dwr
	var iden_referto=0;
	var i = 0;//parto da 1 perchè gli array partono da 1
	var Search = '';
	var IniLotto = '';
	var FineLotto = '';
	var Ret = '';
	var richfirmadoc = '';
	//controllo cod fisc
	var LeggiOpe = '';
	var cod_fisc_per = ''; //codice fiscale associato all'utente
	
	
	LeggiOpeRisp = LeggiOperatoreSISS();
	CodFisc = estraiValoreXML(LeggiOpeRisp, "userId");//CODICE FISCALE SMART CARD
	dwr.engine.setAsync(false);
	dwrSoapSISS.CheckOperatore(baseUser.IDEN_PER ,CodFisc,RitornoCF);
	
	if(RetCF!='OK'){
		WriteLogTemp('AUTENTICAZIONE FALLITA : CODICE FISCALE CARTA= '+CodFisc);
		alert('L\'utente loggato è differente dalla smart card inserita! Impossibile continuare');
		return;
	}

	iden_referti_sel = stringa_codici(array_iden_ref);//prendo i referti selezionati
	//cerco il carattere asterisco *
	Search = iden_referti_sel;
	Search = Search.toString();
	Search = Search.indexOf('*');
	
	if((iden_referti_sel != '') && (Search!= '-1')){
		ArrReferti = iden_referti_sel.split('*');//splitto e mi tengo in memoria l'array
		LunghArray = ArrReferti.length;//lunghezza array da firmare;
		WriteLogTemp('REFERTI SELEZIONATI DA FIRMARE : '+ (ArrReferti.length));
		
		for (i=0;i < LunghArray;i++){
			
			WriteLogTemp('-- INIZIO CICLO : REFERTO '+ i+ ' di ' + (ArrReferti.length - 1));
			IdRefMultiplo = ArrReferti[i];
			IdDocumento = IdRefMultiplo + '_'+progressivo;
			WriteLogTemp('Documento =  ' + IdDocumento);
			//controllo DAO e nel caso, lo genero
			if ((array_oscuramento[i]!='00000')||(array_autorizzazione[i]!='S')){
				WriteLogTemp('REFERTO OSCURATO : ' + IdRefMultiplo + ' '+array_oscuramento[i] + ' '+array_autorizzazione[i]);
				//Gestisco PIN SmartCard
				if(i==0||ArrayToSave == ''){
					IniLotto = '1';
					FineLotto = '0';
					ArrayToSave = ArrayToSave + 'S' + '*';

				}else{
					IniLotto = '0';
					FineLotto = '0';
					ArrayToSave = ArrayToSave + 'S' + '*' ;
				}
				
				//richiamo l'autorizzazione del DAO
				dwr.engine.setAsync(false);
				dwrSoapSISS.GetDaoMultiplo(array_autorizzazione[i]+"*"+array_autorizzazione[i]+"*"+array_noterepe[i]+"*"+IdRefMultiplo,RispostaDaoMulti);
				WriteLogTemp('CHIAMATA AUTORIZZO DAO');
				AutorizzDAO = CallSISS(XmlDAO_Multi);
				WriteLogTemp('RITORNO SISS AUTORIZZO DAO');
				Esito = estraiValoreXML(AutorizzDAO, 'esito');				
				Ret = CheckErroreSISS(AutorizzDAO);
				WriteLogTemp('AUTORIZZO DAO - ESITO ');
				WriteLogTemp('AUTORIZZO DAO - RITORNO SISS ');
				
				if(Ret==''&& Esito =='OK'){
					if(i==0){
						ArrayToSave = ArrayToSave + 'S' + '*';

					}else{
						ArrayToSave = ArrayToSave + 'S' + '*' ;
					}
					ContenutoDaoMulti = estraiValoreXML(AutorizzDAO, 'contenuto');
					//Richiedo la firma del referto //controllino per poter continuare
					WriteLogTemp('RICHIEDO FIRMA REFERTO - ');
					Ret = RichiediFirma(IdDocumento,IdRefMultiplo,IniLotto,FineLotto);
					if (Ret=='OK'){
						if(i == (LunghArray - 1)){
							IniLotto = '0';
							FineLotto = '1';
						}else{
							IniLotto = '0';
							FineLotto = '0';
						}
						WriteLogTemp('RICHIEDO FIRMA DOCUMENTO DEL DAO -');
						richfirmadoc = richiediFirmaDocumento(IdRefMultiplo+ '_'+progressivo+'_DAO',ContenutoDaoMulti,IniLotto,FineLotto);//richiedo il DAO
						RitornoSiss = CallSISS(richfirmadoc);
						ErrorSISS = CercaErrore(RitornoSiss);
						WriteLogTemp('Ritorno SISS RICHIEDI FIRMA DOCUMENTO');
						if (ErrorSISS == 'OK'){
								if(i== (LunghArray - 1)){
									WriteLogTemp('RICHIEDO FIRMA DOCUMENTO DEL DAO - '+ErrorSISS);
									idRefOttieni = idRefOttieni + IdRefMultiplo;
								}else{
									WriteLogTemp('RICHIEDO FIRMA DOCUMENTO DEL DAO - '+ErrorSISS);
									idRefOttieni = idRefOttieni + IdRefMultiplo + '*';
								}
							}else{
								//Gestisco Errore del DAO;
								if(i== (LunghArray - 1)){
									idRefOttieni = idRefOttieni + IdRefMultiplo;
								}else{
									idRefOttieni = idRefOttieni + IdRefMultiplo + '*';
								}
								WriteLogTemp('### RICHIEDO FIRMA DAO - ERRORE ' + ErrorSISS + ' ###');
								document.all.oTable.rows(vettore_indici_sel[i]).style.backgroundColor =  '#FF2400';
							}
						}else{
							WriteLogTemp('### RICHIEDO FIRMA DOCUMENTO - ERRORE ' + Ret + ' ###');
							document.all.oTable.rows(vettore_indici_sel[i]).style.backgroundColor =  '#FF2400';
						}
					}else{
						//Gesitsco Errore;
						WriteLogTemp('### AUTORIZZO DAO - ERRORE ' + Ret + ' ' +Esito+ ' ###');
						document.all.oTable.rows(vettore_indici_sel[i]).style.backgroundColor =  '#FF2400';
					}
				
			}else{
				//Gestisco Lotto/PIN firma
				if(i== 0){
					IniLotto = '1';
					FineLotto = '0';
					ArrayToSave = ArrayToSave + 'N' + '*';
				}else if(i ==LunghArray -1 ){
					IniLotto = '0';
					FineLotto = '1';
					ArrayToSave = ArrayToSave + 'N' ;
					
				}else{
					IniLotto = '0';
					IniLotto = '0';
					ArrayToSave = ArrayToSave + 'N' + '*';
					
				}
				
				IdRefMultiplo = ArrReferti[i];
				IdDocumento = IdRefMultiplo + '_'+progressivo;
				
				WriteLogTemp('RICHIEDO FIRMA DEL DOCUMENTO NON OSCURATO '+IdDocumento);
				Ret = RichiediFirma(IdDocumento,IdRefMultiplo,IniLotto,FineLotto);
				
				if(Ret=='OK'){
					if(i == (LunghArray - 1)){
						//iden_buonfine = iden_buonfine + IdDocumento;
						idRefOttieni = idRefOttieni + IdRefMultiplo;
					}else{
						//iden_buonfine = iden_buonfine + IdDocumento+'*';
						idRefOttieni = idRefOttieni + IdRefMultiplo + '*';
					}
				}else{
					WriteLogTemp('### RICHIEDO FIRMA DEL DOCUMENTO NON OSCURATO ERRORE -  '+IdDocumento+ ' ' +Ret + '  ###');
					document.all.oTable.rows(vettore_indici_sel[i]).style.backgroundColor =  '#FF2400';
				}

				
			}
			
		}
		//OTTENGO
		WriteLogTemp('INIZIO OTTIENI DOCUMENTI');
		ArrRefOttieni = idRefOttieni.split('*');
		LunghOttieni = ArrRefOttieni.length;
		ArrayForDAO = ArrayToSave.split('*');
		ArrVerRef = iden_vr.split('*');
    dwr.engine.setAsync(false);
		
		for(a=0;a<LunghOttieni;a++){
			if(a==0){
				IniLotto = '1';
				FineLotto = '0';
			}else if(a ==(LunghOttieni - 1)){
				IniLotto = '0';
				FineLotto = '1';
			}
			else{
				IniLotto = '0';
				FineLotto = '0';
			}
			if(ArrayForDAO[a]=='S'){//S significa sì c'è il DAO
				var RetDoc='';
				WriteLogTemp('RICHIAMO OTTIENI DOCUMENTI_MULTI CON DAO - ');
				RetDoc = OttieniDocumentiMulti(ArrRefOttieni[a], '0', IniLotto, FineLotto, ArrVerRef[a]);
				
				if(RetDoc != 'KO'){
					WriteLogTemp('RICHIAMO OTTIENI DOCUMENTI_MULTI CON DAO - OK - ' + RetDoc);
					document.all.oTable.rows(vettore_indici_sel[a]).style.backgroundColor =  '#32CD32';
				}else{
					WriteLogTemp('RICHIAMO OTTIENI DOCUMENTI_MULTI CON DAO - ERRORE - ' + RetDoc);
					document.all.oTable.rows(vettore_indici_sel[a]).style.backgroundColor =  '#FF2400';
				}
			}else{
				WriteLogTemp('RICHIAMO OTTIENI DOCUMENTI NON OSCURATO - ');
				RetDoc = OttieniDocumenti(ArrRefOttieni[a], '0', IniLotto, FineLotto, ArrVerRef[a]);
				if(RetDoc != 'KO'){
					WriteLogTemp('RICHIAMO OTTIENI DOCUMENTI OK - ' + RetDoc);
					document.all.oTable.rows(vettore_indici_sel[a]).style.backgroundColor =  '#32CD32';
				}else{
					WriteLogTemp('RICHIAMO OTTIENI DOCUMENTI IN ERRORE - ' + RetDoc);
					document.all.oTable.rows(vettore_indici_sel[a]).style.backgroundColor =  '#FF2400';
				}
			
			}
			
		}
		
	}else{
		alert('Selezionare almeno due esami');
	}
	dwr.engine.setAsync(true);
}

function Ritorno(Value){
	iden_vr = iden_vr + (Value.split("|")[0]) + '*';
	pdfbase64 = Value.split("|")[1];
}

function RichiediFirma(IdDocumento,IdRefMultiplo,IniLotto,FineLotto){
var richfirmadoc='';
var ottdocfirm='';
var RitornoSiss='';
var ErrorSISS = '';


dwr.engine.setAsync(false);
dwrSoapSISS.GetPdfBase64(IdRefMultiplo,Ritorno);

richfirmadoc = richiediFirmaDocumento(IdDocumento,pdfbase64,IniLotto,FineLotto);
RitornoSiss = CallSISS(richfirmadoc);
ErrorSISS = CercaErrore(RitornoSiss);
	
if (ErrorSISS == 'OK'){
	return 'OK';
}else{
	return 'KO';
}

}


function OttieniDocumenti(IdRefMultiplo,TipoFirma,IniLotto,FineLotto,iden_verref){

	dao = '';
	ottdocfirm = ottieniDocFirmato(IdRefMultiplo +'_'+ progressivo,IniLotto,FineLotto);
	RitornoSiss = CallSISS(ottdocfirm);
	Esito = estraiValoreXML(RitornoSiss, 'esitoOperazione');

	if(Esito == 'FIRMA_OK'){
		PDF_Firmato = estraiValoreXML(RitornoSiss,'contenutoFirmato');
		ret = salva_referto_firmato_Multi(IdRefMultiplo, progressivo,iden_verref, TipoFirma, PDF_Firmato, dao);
		
		if(ret=='OK'){
			WriteLogTemp('OTTENUTO E SALVATO CORRETTAMENTE IL DOCUMENTO '+ IdRefMultiplo);
			return 'OK';

		}else{
			WriteLogTemp('### OTTIENI DOCUMENTI - ERRORE DI SALVATAGGIO  DEL PDF FIRMATO'+ ret+' ###');
			return 'KO';
		}
	}else{
		WriteLogTemp('### OTTIENI DOCUMENTI - ERRORE '+ Esito+' ###');
		return 'KO';
	}

	
}

function OttieniDocumentiMulti(IdRefMultiplo,TipoFirma,IniLotto,FineLotto,iden_verref){

	ottdocfirm = ottieniDocFirmato(IdRefMultiplo+'_'+progressivo,IniLotto,FineLotto);
	RitornoSiss = CallSISS(ottdocfirm);
	Esito = estraiValoreXML(RitornoSiss, 'esitoOperazione');

	if(Esito == 'FIRMA_OK'){
		PDF_Firmato = estraiValoreXML(RitornoSiss,'contenutoFirmato');
		WriteLogTemp('CHIAMATA OTTIENI DOCUMENTO');
		ottdocfirm = ottieniDocFirmato(IdRefMultiplo+'_'+ progressivo +'_DAO',IniLotto,FineLotto);
		RitornoSiss = CallSISS(ottdocfirm);
		WriteLogTemp('RITORNO OTTIENI DOCUMENTO');
		Esito = estraiValoreXML(RitornoSiss, 'esitoOperazione');
		
		if(Esito =='FIRMA_OK'){
			PdfDaoFirmato = estraiValoreXML(RitornoSiss,'contenutoFirmato');
			
			ret = salva_referto_firmato_Multi(IdRefMultiplo, progressivo, iden_verref, TipoFirma, PDF_Firmato, PdfDaoFirmato);
			
			if (ret == 'OK'){
				WriteLogTemp('OTTENUTO E SALVATO CORRETTAMENTE IL DOCUMENTO '+ IdRefMultiplo + ' CON DAO');
				return 'OK';
			}else{
				WriteLogTemp('### OTTIENI DOCUMENTI DAO - ERRORE DI SALVATAGGIO  DEL PDF FIRMATO CON DAO '+ ret+' ###');
				return 'KO';
			}
		}else{
			WriteLogTemp('### OTTIENI DOCUMENTI DAO- ERRORE - OTTIENI DOCUMENTO DEL PDF DAO'+ Esito+' ###');
			return 'KO';
		}
		

	}else{
		WriteLogTemp('### OTTIENI DOCUMENTI DAO- ERRORE - OTTIENI DOCUMENTO DEL REFERTO '+ ret+' ###');
		return 'KO';
	}

	
}

function salva_referto_firmato_Multi(ID_referto,progressivo,iden_verref,TipoFirma,PdfFirmato,dao){//manca giustamente id_vr che si aggiorna

	try{
		if(dao==''){
			dao='NO';
			}
        
		Update_Firmato.UpdateDBDAO(ID_referto+'*'+progressivo+'*'+TipoFirma+'*'+iden_verref+'*'+PdfFirmato+'*'+dao,aggiornaFormMultipla);
		return 'OK';
	}catch(e){
		alert('errore update dbdao');
		return 'KO';
	}

}

function aggiornaFormMultipla(value){


}

function RitornoCF(Val){
	RetCF = Val;
}

function CheckErroreSISS(InXml){
	var ErrorCode = '';
	var ErrorStack = '';
	ErrorCode = estraiValoreXML(InXml,'errorCode');
	ErrorStack = estraiValoreXML(InXml,'errorStack');
	
	if(ErrorCode == ''){
		return ErrorCode + ErrorStack;
	}else{
		return ErrorCode + ' ' + ErrorStack;
	}
	
}

function RispostaDaoMulti(ValDao){
	XmlDAO_Multi = ValDao;
	
}

function anteprima_multipla(){
	var refertiToPrint  = stringa_codici(array_iden_ref);
	if (refertiToPrint=='')
	{
		alert('Selezionare almeno un referto');
	}
	refertiToPrint=refertiToPrint.toString().replace(/\*/g, ",");
	alert(refertiToPrint);
	

	var firstreferto=refertiToPrint.split(',')[0];
	alert(refertiToPrint);
	var doc = document.form_stampa;

		doc.action = 'elabStampa';
		doc.target = 'wndPreviewPrint';
		doc.method = 'POST';

		doc.stampaSorgente.value       = 'firma_digitale_multipla';
		doc.stampaFunzioneStampa.value = 'REFERTO_MULTIPLO_STD';
		doc.stampaIdenRef.value        = firstreferto;

		var campo_stampaSelection = document.createElement("input");
	   campo_stampaSelection.type = 'hidden';
	   campo_stampaSelection.name = 'stampaSelection';
	   campo_stampaSelection.value = '{ESAMI.IDEN_REF} in [' +refertiToPrint+ ']';
	    doc.appendChild(campo_stampaSelection);

		var campo_stampaReparto = document.createElement("input");
	   campo_stampaReparto.type = 'hidden';
	   campo_stampaReparto.name = 'stampaReparto';
	   campo_stampaReparto.value = basePC.DIRECTORY_REPORT;
	    doc.appendChild(campo_stampaReparto);

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

//Utility
function WriteLog(stringa,path){
	//path =ocxf_multipla.GetPathToLog()

 /* var fs, a, ForAppending;
  ForAppending = 8;
  var File_Log;

  File_Log=path+"log_firma_javascript.txt";
  fs = new ActiveXObject("Scripting.FileSystemObject");
  if (!fs.FileExists(File_Log))
	{
		fs.CreateTextFile (File_Log);
	}
  a = fs.OpenTextFile(File_Log, ForAppending, false);
  a.Write(stringa);
  a.WriteBlankLines(1);
  a.Close();*/
  }



function ModificaDao_WK(iden_referto){
	var finestraCheck = window.open("SrvDAO?HTESTO_TXT=''&HTESTO_RTF=''&sorgente=''&HidenSecondoMed=''&HREPARTO=''&hidFunctionToCall=onlyReg&idenRef="+iden_referto,"wndCheckUser","left=0; top=0,width=350px, height=150px,status=yes");
		if(finestraCheck){
				finestraCheck.focus();
			}
		else{
			finestraCheck = window.open("SrvDAO?HTESTO_TXT=''&HTESTO_RTF=''&sorgente=''&HidenSecondoMed=''&HREPARTO=''&hidFunctionToCall=onlyReg&idenRef="+iden_referto,"wndCheckUser","left=0; top=0,width=350px, height=150px,status=yes");
			}
	}

function apri_dao() {
	var Cerca='';
	idrefsel = stringa_codici(array_iden_ref);
	Cerca = idrefsel;
	Cerca = Cerca.toString();
	Cerca = Cerca.indexOf('*');
	if(Cerca == '-1'){
		ModificaDao_WK(idrefsel);
	}else{
		alert('Selezionare un solo referto per compilare la scheda del DAO');
		return;
	}
	
}