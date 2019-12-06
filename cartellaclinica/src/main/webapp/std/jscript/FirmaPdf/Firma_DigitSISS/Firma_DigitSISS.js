// JavaScript Document
var typeClose='S';
var tipo_firma='';
var OpenXml =  '<?xml version="1.0" encoding="ISO-8859-1"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsd="http://www.w3.org/1999/XMLSchema" xmlns:xsi="http://www.w3.org/1999/XMLSchema-instance" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">';
var XmlDAO = '';
var METODI='FSE';

var FirmaSiss = {
	
	openXml: '<?xml version="1.0" encoding="ISO-8859-1"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsd="http://www.w3.org/1999/XMLSchema" xmlns:xsi="http://www.w3.org/1999/XMLSchema-instance" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
	
	objOcx:'',//riferimento all'ocx inserito nella pagina 
	objQuery:opener.opener.top,//Riferimento all'oggetto per le query sul db
	contenutoBase64daFirmare:'',//variabile nel quale verr� salvato il base64 da firmare
	
	init:function(){
		typeof $('div a#idBtnDao').val()=='undefined'?null:$("div a#idBtnDao").click(function() {
			FirmaSiss.modificaDao(); 
		}); 
		typeof $('div a#idBtnFirma').val()=='undefined'?null:$("div a#idBtnFirma").click(function() {
			FirmaSiss.firma('0'); 
		}); 
		typeof $('div a#idBtnFirmaSost').val()=='undefined'?null:$("div a#idBtnFirmaSost").click(function() { 
			FirmaSiss.firma('1'); 
		}); 
		typeof $('div a#idBtnFirmaAnnul').val()=='undefined'?null:$("div a#idBtnFirmaAnnul").click(function() { 
			FirmaSiss.firma('3'); 
		});
	},
	
	setEvents:function(){
		
	},
	
	creaOcx:function(){
		utilitySiss.writeLogTemp('Inizio Creazione Ocx');
		altezza = screen.height-100;
		largh = screen.width-10;
		OffsTop = 0;	
		OffsLeft = 0;
		Rotation = 0;
		n_copie = 1;//Da config_firma_siss,impostare con jquery
		selezionaStampante="";
		var $newobj = $('<object CLASSID="clsid:969CB476-504B-41CF-B082-1B8CDD18323A" CODEBASE="cab/pdfControl/prjXPdfReader.CAB#version=2,0,0,0" id="pdfReader">'+
						'<param name="width" value="'+largh+'">'+
						'<param name="height" value="'+altezza+'">'+
						'<param name="top" value="0">'+
						'<param name="left" value="0">'+
						'<param name="preview" value="S">'+
						'<param name="PDFurl" value="'+beforeSISS.pdfPosition+'">'+
						'<param name="OffTop" value="'+OffsTop+'">'+
						'<param name="OffLeft" value="'+OffsLeft+'">'+
						'<param name="Rotate" value="'+Rotation+'">'+
						'<param name="trace" value="S">'+
						'<param name="numCopy" value="'+n_copie+'">'+
						'<param name="zoomFactor" value="75">'+
						'<param name="zoomFit" value="">'+
						'<param name="printerName" value="'+selezionaStampante+'">'+
						'<param name="driverName" value="">'+
						'<param name="portName" value="">'+
						'</object>');
	
		$('#EXTERN').append($newobj);
		FirmaSiss.objOcx = document.getElementById("pdfReader");
		FirmaSiss.objOcx.PDFurl = beforeSISS.pdfPosition;	
		FirmaSiss.objOcx.printAll();
		FirmaSiss.objOcx.disableBtnCopy();
		FirmaSiss.objOcx.disableBtnPrint();
		utilitySiss.writeLogTemp('Fine Creazione Ocx');
		//FirmaSiss.modificaDao();
		
		if (FirmaSiss.checkCodFisc()) {
		 
			//se il codice fiscale � diverso, nascondo i button e interrompo 
			FirmaSiss.nascondiTasti();
			return;
		}
		/*
		FirmaSiss.modificaDao();
		*/
	},
	
	checkCodFisc:function(){
		utilitySiss.writeLogTemp('Inizio Controllo Codice Fiscale SmartCard');
		var LeggiOpeRisp;
		var XML_OPE = '';
		var codFiscWeb = baseUser.COD_FISC;
		//creazione xml per recuperare le info della carta(codice fiscale)		
		XML_OPE = FirmaSiss.openXml;
		XML_OPE = XML_OPE + '<SOAP-ENV:Body>';
		XML_OPE = XML_OPE + '<m:SA.ottieniCredenzialeInChiaro xmlns:m="http://www.crs.lombardia.it/schemas/CRS-SISS/SA/2005-01/ottieniCredenzialeInChiaro/" dataSetVersion="1.0">';
		XML_OPE = XML_OPE + '<param></param></m:SA.ottieniCredenzialeInChiaro></SOAP-ENV:Body></SOAP-ENV:Envelope>';
		//chiamata al siss e controllo codice fiscale
		utilitySiss.writeLogTemp(XML_OPE);
		LeggiOpeRisp = utilitySiss.callSiss(XML_OPE);
		codFiscSmartCard = utilitySiss.estraiValoreXml(LeggiOpeRisp, "userId");//CODICE FISCALE SMART CARD
		utilitySiss.writeLogTemp(' COD FISCALE WEB = '+codFiscWeb+' COD FISCALE CARTA = '+codFiscSmartCard);
		if (codFiscSmartCard != codFiscWeb){
			alert("L'utente loggato � diverso dall'utente associato alla carta");
			return true;
		}
		return false;
	},
	
	modificaDao:function(){//Chiamata alla servlet di modifica del DAO
		myForm = document.EXTERN;
		finestraDao = window.open("","finestraDao","left=0; top=0,width=1024px, height=600px scrollbars=no");
    	myForm.target='finestraDao';
    	myForm.action='servletGeneric?class=firma.SrvDao';
		myForm.submit();
	},
	
	nascondiTasti:function(esito){
		typeof $('#idBtnDao').val()=='undefined'?null:$('#idBtnDao').hide(); 
		typeof $('#idBtnFirma').val()=='undefined'?null:$('#idBtnFirma').hide(); 
		typeof $('#idBtnFirmaSost').val()=='undefined'?null:$('#idBtnFirmaSost').hide(); 
		typeof $('#idBtnFirmaAnnul').val()=='undefined'?null:$('#idBtnFirmaAnnul').hide();
		if (typeof esito!='undefined'){
			if (esito=='OK'){
				FirmaSiss.objOcx.enableAndVisibleBtnPrint();
			}
		}
	},
	
	predisponiPubblicazioneDao:function(type){
		utilitySiss.writeLogTemp('Inizio Predisponi Pubblicazione Documento');
		var Metodo 			= 'FSE.predisponiPubblicazioneDCE';
		/*
		creare le righe di configurazione identiche per ognuna delle tipologie.
		chiedere se esistono dei cambiamenti a livello della predisponi nel caso del referto annullativo o � solo un cambio del report
		switch(type){
		case '0': Metodo = 'FSE.predisponiPubblicazioneDCE';break;
		case '1': Metodo = 'FSE.predisponiPubblicazioneDCESost';break;
		case '2': Metodo = 'FSE.predisponiPubblicazioneDCEAnnul';break;	
		}
		*/
		var where_cond 		= 'identificativodocumento='+$('#idenReferto').val();
		vResp = FirmaSiss.objQuery.executeStatement('firmaSiss.xml','siss.PredisponiPubblicazioneFSE',[Metodo,where_cond],1);
		if (vResp[0]=='OK'){
			utilitySiss.writeLogTemp('Funzione SISS_FUNCTION_GENERAXML eseguita con successo');
			utilitySiss.writeLogTemp(vResp[0]);
			utilitySiss.writeLogTemp(vResp[2]);			
		}else{
			alert('Errore: controllare i file di log')
			utilitySiss.writeLogTemp('Funzione SISS_FUNCTION_GENERAXML eseguita con errore'+vResp[1]);
			return;
		}
		var predisponiXml = FirmaSiss.openXml;
		predisponiXml = predisponiXml + '<SOAP-ENV:Body>';
		predisponiXml = predisponiXml + '<m:FSE.predisponiPubblicazioneDCE  xmlns:m="http://www.crs.lombardia.it/schemas/DCSanita/FSE/2008-01/predisponiPubblicazioneDCE/" dataSetVersion="1.0">';
		predisponiXml = predisponiXml + vResp[2];
		predisponiXml = predisponiXml + '</m:FSE.predisponiPubblicazioneDCE>';
		predisponiXml = predisponiXml + '</SOAP-ENV:Body>';
		predisponiXml = predisponiXml + '</SOAP-ENV:Envelope>';
		utilitySiss.writeLogTemp('******************************************************************************');
		utilitySiss.writeLogTemp(predisponiXml);
		utilitySiss.writeLogTemp('Fine Predisponi Pubblicazione Documento');
		return predisponiXml;
	},
	
	ottieniDocFirmato:function(IdDocumento,InizioLotto,FineLotto){
		var XML_ODF = '';
		XML_ODF = FirmaSiss.openXml;
		XML_ODF = XML_ODF +'<SOAP-ENV:Body>';
		XML_ODF = XML_ODF +'<m:SA.ottieniDocumentoFirmato xmlns:m="http://www.crs.lombardia.it/schemas/CRS-SISS/SA/2005-01/ottieniDocumentoFirmato/" dataSetVersion="1.0">';
		XML_ODF = XML_ODF +'<param><dati><inizioLotto>'+InizioLotto+'</inizioLotto><fineLotto>'+FineLotto+'</fineLotto><documento>';
		XML_ODF = XML_ODF +'<identificativoDocumento>'+IdDocumento+'</identificativoDocumento></documento></dati></param>';
		XML_ODF = XML_ODF +'</m:SA.ottieniDocumentoFirmato>';
		XML_ODF = XML_ODF +'</SOAP-ENV:Body>';
		XML_ODF = XML_ODF +'</SOAP-ENV:Envelope>';
		utilitySiss.writeLogTemp('Richiesta FIRMA' + XML_ODF);
		return XML_ODF;
	},
		
	richiediFirmaDocumento:function(IdDocumento,Contenuto,InizioLotto,FineLotto,tipo){
		var XML_FD = '';

		XML_FD = FirmaSiss.openXml;
		XML_FD = XML_FD +'<SOAP-ENV:Body>';
		XML_FD = XML_FD +'<m:SA.richiediFirmaDocumento xmlns:m="http://www.crs.lombardia.it/schemas/CRS-SISS/SA/2005-01/richiediFirmaDocumento/" dataSetVersion="1.0">';
		XML_FD = XML_FD +'<param>';
		XML_FD = XML_FD +'<dati>';
		XML_FD = XML_FD +'<inizioLotto>'+InizioLotto+'</inizioLotto>';//paramaetrizzare
		XML_FD = XML_FD +'<fineLotto>'+FineLotto+'</fineLotto>';//paramaetrizzare
		XML_FD = XML_FD +'<documento>';
		XML_FD = XML_FD +'<identificativoDocumento>'+IdDocumento+'</identificativoDocumento>';
		XML_FD = XML_FD +'<tipoDocumento>'+tipo+'</tipoDocumento>';
		XML_FD = XML_FD +'<tipoFirma>LEGALE_OPERATORE</tipoFirma>';
		XML_FD = XML_FD +'<contenuto>'+Contenuto+'</contenuto>';
		XML_FD = XML_FD +'</documento>';
		XML_FD = XML_FD +'</dati>';
		XML_FD = XML_FD +'</param>';
		XML_FD = XML_FD +'</m:SA.richiediFirmaDocumento>';
		XML_FD = XML_FD +'</SOAP-ENV:Body>';
		XML_FD = XML_FD +'</SOAP-ENV:Envelope>';
		utilitySiss.writeLogTemp('Richiesta FIRMA' + XML_FD);
	
		return XML_FD;
	},

	
	firma:function(type){
		var idenReferto		= $('#idenReferto').val();
		var autorizzaDao 	= '';
		var contenutoDao 	= '';
		var toCall			= '';
		var esitoPredisponi	= '';	
		var esitoFirma		= '';
		var RitornoSiss		= '';
		var ErrorSISS		= '';
		/*Se la tipologia del referto � annullativo*/
		if(type=='3')
		{
			var reportAnnullativo	= "REFERTO_CONSULENZE_FIRMA_ANNULLA.RPT"
			FirmaSiss.objOcx.PDFurl	= FirmaSiss.objOcx.PDFurl.replace("REFERTO_CONSULENZE_FIRMA.RPT",reportAnnullativo);
			FirmaSiss.objOcx.printAll();
		}
		/*Controllo il codice fiscale*/
		if (FirmaSiss.checkCodFisc()) {
				FirmaSiss.nascondiTasti();
			return;
		}

		FirmaSiss.contenutoBase64daFirmare = FirmaSiss.objOcx.GetMyPdfBase64();
		xmlDao = FirmaSiss.predisponiPubblicazioneDao(type);
		xmlDao = xmlDao.replace("TESTO",FirmaSiss.contenutoBase64daFirmare);
		utilitySiss.writeLogTemp(xmlDao);
		autorizzaDao = utilitySiss.callSiss(xmlDao);
		utilitySiss.writeLogTemp('********** XML DI AUTORIZZAZIONE RISPOSTA **********');
		utilitySiss.writeLogTemp(autorizzaDao);
		esitoPredisponi	= utilitySiss.estraiValoreXml(autorizzaDao,'esito');
		hash 	= utilitySiss.estraiValoreXml(autorizzaDao,'hashDocumento');
		sizeDoc	= utilitySiss.estraiValoreXml(autorizzaDao,'sizeDocumento');
		xslt 	= utilitySiss.estraiValoreXml(autorizzaDao,'versioneXSLT');
		try 
		{
			contenutoDao = utilitySiss.estraiValoreXml(autorizzaDao,'contenuto');
			if (contenutoDao.length<5)
			{
				toCall='1'
			}else{
				toCall='0'			
			}
		}
		catch(e)
		{
			contenutoDao=''
			toCall='1'
		}
		utilitySiss.writeLogTemp(' RISPOSTA OTTENUTA DAL SISS ');
//		alert(esitoPredisponi + '\n' +hash + '\n' +sizeDoc+ '\n' +xslt+ '\n' +toCall+ '\n' +contenutoDao)
		if (esitoPredisponi == 'OK')
		{
			//RICHIEDI FIRMA DOCUMENTO 
			richFirmaDoc = FirmaSiss.richiediFirmaDocumento(idenReferto,FirmaSiss.contenutoBase64daFirmare,'1',toCall,'PDF');
		
			utilitySiss.writeLogTemp(' CHIAMO RICHIEDIFIRMADOCUMENTO AL SISS ');
			RitornoSiss	= utilitySiss.callSiss(richFirmaDoc);
			ErrorSISS 	= utilitySiss.cercaErrore(RitornoSiss);
			utilitySiss.writeLogTemp(' OTTENUTA RISPOSTA RICHIEDIFIRMADOCUMENTO DAL SISS ');
			//alert('fine richiedi documento firmato senza dao');	
			if(ErrorSISS == 'OK')
			{
				utilitySiss.writeLogTemp(' CHIAMO RICHIEDI FIRMA DOCUMENTO DEL DAO AL SISS ');
				if(contenutoDao.length >5)
				{
					richFirmaDoc	= FirmaSiss.richiediFirmaDocumento(idenReferto +'_DAO',contenutoDao,'0','1','TESTO');
					RitornoSiss 	= utilitySiss.callSiss(richFirmaDoc);
					utilitySiss.writeLogTemp(' OTTENUTA RISPOSTA DEL DAO DAL SISS ');
					ErrorSISS= utilitySiss.cercaErrore(RitornoSiss);
				}
				else
				{
					ErrorSISS ='OK';
				}
				
				if (ErrorSISS == 'OK')
				{				
					//OTTIENI DOCUMENTO FIRMATO
					utilitySiss.writeLogTemp(' CHIAMO OTTIENIDOCUMENTOFIRMATO AL SISS ');
					ottieniDocFirm	= FirmaSiss.ottieniDocFirmato(idenReferto,'1',toCall);	
					RitornoSiss 	= utilitySiss.callSiss(ottieniDocFirm);
					//RitornoSiss 	= testReturnSiss64;
					esitoFirma 		= utilitySiss.estraiValoreXml(RitornoSiss, 'esitoOperazione');
					PDF_Firmato 	= utilitySiss.estraiValoreXml(RitornoSiss, 'contenutoFirmato');
					utilitySiss.writeLogTemp(' OTTENUTA RISPOSTA OTTIENIDOCUMENTOFIRMATO DAL SISS ');					
					utilitySiss.writeLogTemp(' DOCUMENTO FIRMATO: '   + PDF_Firmato) ;
					if(esitoFirma=='FIRMA_OK')
					{
						
						//OTTIENI DOCUMENTO FIRMATO DAO
						if(contenutoDao.length >5)
						{
							utilitySiss.writeLogTemp(' CHIAMO OTTIENIDOCUMENTOFIRMATO DAO AL SISS ');
							ottieniDocFirm	= FirmaSiss.ottieniDocFirmato(idenReferto +'_DAO','0','1');	
							RitornoSiss 	= utilitySiss.callSiss(ottieniDocFirm);
							//RitornoSiss 	= testReturnSiss64DAO;
							esitoFirma 		= utilitySiss.estraiValoreXml(RitornoSiss, 'esitoOperazione');
							PDF_Firmato_DAO = utilitySiss.estraiValoreXml(RitornoSiss, 'contenutoFirmato');
							//alert(esitoFirma+'\n'+PDF_Firmato_DAO);
							utilitySiss.writeLogTemp(' OTTENUTA RISPOSTA OTTIENIDOCUMENTOFIRMATO DAO DAL SISS ');
							//alert('inizia ottieni documento firmato dao')														
						}
						else
						{
							esitoFirma 		= 'FIRMA_OK';
							PDF_Firmato_DAO = '';
						}
						
						if(esitoFirma =='FIRMA_OK')
						{
							utilitySiss.writeLogTemp(' SALVO IL PDF FIRMATO E IL DAO');
							ret = FirmaSiss.salvaRefertoFirmato(PDF_Firmato,type,PDF_Firmato_DAO,xslt,hash,sizeDoc);
							utilitySiss.writeLogTemp(' COMPLETATO SALVATAGGIO SU DB');
							/*try
							{
								utilitySiss.writeLogTemp('INIZIO SALVATAGGIO HASH XSLT '+hash + ' ' + xslt + ' ' + ID_referto + ' ' + progr);

								var nome_procedura = '';
								nome_procedura = 'SP_UPD_XSLTHASH2';

								CJsUpdate.call_stored_procedure (nome_procedura +'@'+hash+','+xslt+','+ID_referto+','+progr+','+ sizeDoc +'@FALSE,@ ');
						
								utilitySiss.writeLogTemp('COMPLETATO SALVATAGGIO ');
							}
							catch(e)
							{
								utilitySiss.writeLogTemp('ERRORE DURANTE SALVATAGGIO XSLT HASH');
							}*/

							if(ret=='OK')
							{
								FirmaSiss.nascondiTasti('OK');			
								if(type=='0')
								{
									alert('Referto Firmato Correttamente');
									beforeSISS.salvaFirma='OK';
								}
								else if (type =='1')
								{
									alert('Referto Sostitutivo Firmato Correttamente');
									beforeSISS.salvaFirma='OK';
								}
								else if (type=='2')
								{
									alert('Referto Integrativo Firmato Correttamente');
									beforeSISS.salvaFirma='OK';					
								}
								else if(type == '3')
								{
									alert('Referto Annullativo Firmato Correttamente');
									beforeSISS.salvaFirma='OK';
								}
							
							}
							else
							{
								alert('Errore durante il salvataggio del DAO Firmato');
								FirmaSiss.nascondiTasti('OK')
							}
						}
						else
						{
							alert('Errore durante la firma del DAO');
							FirmaSiss.nascondiTasti('OK')
						}
							
					}
					else
					{
						alert('Errore durante la firma del documento');
						FirmaSiss.nascondiTasti('KO');
					}
					
				}
				else
				{
				
					if (ErrorSISS!='OK')
					{
						alert(ErrorSISS);
					}
					
					alert('Richiesta Firma DAO Fallita');
					FirmaSiss.nascondiTasti('KO');				
					
				}
			
			}
			else
			{
				
				if (ErrorSISS!='OK')
				{
					alert(ErrorSISS);
				}
				
				alert('Richiesta Firma Fallita');
				FirmaSiss.nascondiTasti('KO');
				
			}
		}
		else
		{
			//Ritornato Errore Dalla predisponi pubblicazione
			ErrorStack = utilitySiss.estraiValoreXml(autorizzaDao, 'errorStack');
			alert('Autorizzazione Fallita');
			FirmaSiss.nascondiTasti('KO');
		}
	},
	
	salvaRefertoFirmato:function(PDF_Firmato,type,PDF_Firmato_DAO,Xslt,HashPdf,SizeDoc){
		
		/*update su cc_firma_pdf,inserendo i vari clob(pdf_firmato)*/
		var respUpdate = '';
		utilitySiss.writeLogTemp('Inizio Salvataggio sul DB');
/*		alert('Inizio Salvataggio sul DB')
		alert(	
				PDF_Firmato+'\n'+
				type+'\n'+
				PDF_Firmato_DAO+'\n'+
				Xslt+'\n'+
				HashPdf+'\n'+
				SizeDoc+'\n'+
				$('#idenReferto').val()+'\n'+
				$('#typeProcedure').val()+'\n'+
				$('#idenTes').val()+'\n'+
				baseUser.IDEN_PER+'\n'+
				$('#dataEsame').val()+'\n'+
				$('#oraEsame').val());*/
		respUpdate = FirmaSiss.objQuery.executeStatement('firmaSiss.xml','siss.salvaRefertoFirmato',
						[	PDF_Firmato,
							type,
							PDF_Firmato_DAO,
							Xslt,
							HashPdf,
							SizeDoc,
                       		$('#idenReferto').val(),
							$('#typeProcedure').val(),
							$('#idenTes').val(),
 							baseUser.IDEN_PER,
							$('#dataEsame').val(),
							$('#oraEsame').val(),
							],0);
		if (respUpdate[0]=='OK'){
			utilitySiss.writeLogTemp('Funzione UPD_CONS_FIRMATO_SISS eseguita con successo');
			return (respUpdate[0]);
		}else{
			alert('Errore: controllare i file di log')
			utilitySiss.writeLogTemp('Funzione UPD_CONS_FIRMATO_SISS eseguita con errore'+respUpdate[1]);
			return;
		}	
	}
	
};

var utilitySiss = {
	callSiss:function(inputXml){
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
					utilitySiss.writeLogTemp(' RISPOSTA CHIAMATA SOAP DAL SISS');
				}
			}
			xmlHttp.open("POST","http://127.0.0.1:8000",false);
			utilitySiss.writeLogTemp(' SEND CHIAMATA SOAP AL SISS');
			xmlHttp.send(inputXml); 
			return RispostaSISS;
		}catch(e)
		{
			alert(e.description);
			alert('Errore, verificare l\'autenticazione sul SISS' + ' ' + e);
		try{
			xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			xmlHttp.open("POST","http://127.0.0.1:8000",false);
			xmlHttp.send(inputXml); 
		}catch(e)
		{
			alert(e.description);
			alert('Verificare l\'autenticazione sul SISS e riporovare');
		}
		return RispostaSISS;
		}
	},
	estraiValoreXml:function(inXML,campo){
		/*var valoreEstratto='';
		var StartCut=0;
		
		var campoStart='<'+campo+'>';
		var lenStartcut=campoStart.length;
		var campoStop='</'+campo+'>';
		var StopCut;
		var lenToCut=0;
		
		StartCut=inXML.indexOf(campoStart);
		StartCut=StartCut+lenStartcut;
		StopCut=inXML.indexOf(campoStop);
		lenToCut=StopCut-StartCut;
		valoreEstratto=inXML.substr(StartCut,lenToCut);*/
		xmlDoc = $.parseXML( inXML );
		$xml = $( xmlDoc);
		$title = $xml.find(campo);
		valoreEstratto = $title.text();
	
		return valoreEstratto;
	},
	
	writeLogTemp:function(stringaToLog){
		try{
			var d = new Date();
			var Day = d.getDate();
			var H = d.getHours();
			var M = d.getMinutes();
			var Sec = d.getSeconds();
			var Mlsec= d.getMilliseconds();
			var DataOra = Day + ' ' + H +':'+M+':'+Sec+':' +Mlsec;
			var Str = DataOra + ' '+ stringaToLog;
			
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
		}catch(e){}
	},
	
	cercaErrore:function(Xml){
		var Error = '';
		var	Exception = '';
		var Ritorno = '';

		//gestire il firma legale rifutata
		Error = utilitySiss.estraiValoreXml(Xml, 'descErrore');
		if(Error != ''){
			Exception = utilitySiss.estraiValoreXml(Xml, 'descEccezione');
			Ritorno = Error + ' : ' + Exception;
		}else{
			Ritorno = 'OK';
		}
	
		return Ritorno;
	}

};

/*
function salva_refertoFirmato(PdfFirmato,TipoFirma,dao)
{
	if(document.id_aggiorna.HinputRefFirmato.value.length > 0)
	{
		if(dao == '') {
			dao='NO';
		}
		Update_Firmato.UpdateDBDAO(ID_referto+'*'+progr+'*'+TipoFirma+'*'+document.id_aggiorna.HIden_vr.value+'*'+PdfFirmato+'*'+dao,aggiornaForm);

		try 
		{
		
			opener.registrazioneAbilitata = false;
			// diabilito medico refertante
			opener.disableLinkMedRiferimento();
			// nascondo il pulsante di salvataggio
			opener.hideSaveButton();
			return "OK";
			
		}
		catch(e)
		{
		
			alert(e);
		
		}
		
	}
	else
	{
		
		alert('Errore - Referto non firmato');
		//Update_Firmato.RollBackDb(ID_referto+'*'+progr,aggiornaForm2);

	}

}*/