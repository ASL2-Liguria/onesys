function scaricaPrescrizioneSole(_type)
{

    var v_iden;
	   
	// SAVONA
	// modifica 3-12-15
	if (checkPvcy1A()){return false;}
	// ******************		
	window.open('plugins_SV/sole/scarica_prestazione_sole.html','','top=0,left=0,height='+screen.availHeight+',width='+screen.availWidth+',scrollbars=yes, status=yes');		
}


// ***** 
// modifica 14-6-16
function scaricoRicettaDaEsami(idenEsami,stato)
{
	alert("Attenzione: non \u00E8 possibile proseguire senza prima associare le prestazioni selezionate ad una ricetta. Il sistema aprir\u00E0 la pagina di scarico.");	
	var arr;
	if(typeof codice_fiscale !='undefined') arr=codice_fiscale;
	else if(typeof array_cod_fisc !='undefined') arr=array_cod_fisc;
	else
	{
		alert("Non \u00E8 possibile recuperare il codice fiscale del paziente");
		return;
	}
	
	if (stringa_codici(arr)=="")
	{
		alert("il paziente selezionato non ha associato nell'anagrafica il suo codice fiscale.\nSi prega di inserirlo nella sua scheda anagrafica prima di procedere");
		return;
	}
	
	var i = 0;
	var arrayEsami= new Array();
	var arrayEsamiIns=idenEsami.toString().split('*');

	// modifica 31-8-16
	var impegnative = stringa_codici_con_vuoti(array_impegnativa).toString().split('*');
	var tipo_ricette = stringa_codici_con_vuoti(array_tipo_ricetta).toString().split('*');
	var arrIntEst = stringa_codici_con_vuoti(array_int_est).toString().split('*');
	var arrTicket = stringa_codici_con_vuoti(array_ticket).toString().split('*');
	var arrProvenienza = stringa_codici_con_vuoti(array_provenienza).toString().split('*');
	// **********

	for(i=0; i<arrayEsamiIns.length;i++){
		if (arrIntEst[i].substr(0,1).toUpperCase() == 'E')
		{
			if (arrProvenienza[i]==2872 || arrProvenienza[i]== 4492) continue;
			if (arrTicket[i]!=6 && arrTicket[i]!= 87 && arrTicket[i]!= "") continue;			
			if (tipo_ricette[i]=="DEMA" && impegnative[i]!="") continue;
			// modifica 31-8-16
			if (impegnative[i]==""){
				arrayEsami.push(arrayEsamiIns[i]);
			}
			// *********************			

		}
	}
	
	// modifica 31-8-16
	var idenEsamiNew=arrayEsami.toString().replace(/,/g,'*');
	idenEsami=idenEsami.toString().replace(/,/g,'*');
	var finestra = window.open('plugins_SV/sole/scarica_prestazione_sole.html?stato='+stato+'&idenEsami='+idenEsamiNew+'&idenEsamiOrigin='+idenEsami,'','top=0,left=0,height='+screen.availHeight+',width='+screen.availWidth+',scrollbars=yes');
	// ******************************

	if (finestra){
		finestra.focus();
	}
}
// *********************


function inserimentoEsameSole(iden_anag,iden_esami,quesito,quadro,ticket,esenzione,extra_db,tipo){
	//alert('cbk_inserimentoEsame: ' + iden_anagIden_pro);
	
	var iden_pro = null;
	var finestra = null;
	var doc = document.form_accetta_paziente;
	
	
	doc.action = 'schedaEsame';
	doc.target = 'winSceltaEsami';
	finestra = window.open("","winSceltaEsami","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	if (finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra = window.open("","winSceltaEsami","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}
	
	doc.Hiden_anag.value = iden_anag;
	
	

	/*Aggiungo il campo hidden per poter ricaricare la worklist degli esami dall'inserimento esame
	dalla ricerca del paziente*/
	var campo_carica_worklist_esami = document.createElement("input");
	campo_carica_worklist_esami.type = 'hidden';
	campo_carica_worklist_esami.name = 'Hservlet_succ';
	if(tipo=='ACCETTA')
	{
		doc.tipo_registrazione.value = "I";		
		campo_carica_worklist_esami.value = "javascript:opener.worklist_esami(" + iden_anag + ");self.close();";
	}
	else
	{
		doc.tipo_registrazione.value = "P";		
		campo_carica_worklist_esami.value = "prenotazioneFrame?visual_bt_direzione=S&servlet=prenotazioneInizio%3FHiden_esa%3D" + iden_esami +"%26Hiden_anag%3D" + iden_anag +"&events=onunload&actions=libera_all('" + baseUser.IDEN_PER + "', '" + basePC.IP + "');&visual_bt_direzione=N";
	}
	
	
	doc.appendChild(campo_carica_worklist_esami);
/*
	var campo_iden_Esa = document.createElement("input");
	campo_iden_Esa.type = 'hidden';
	campo_iden_Esa.name = 'Hiden_esa';
	campo_iden_Esa.value = iden_esami;
	doc.appendChild(campo_iden_Esa);
	*/
	var campo_quesito = document.createElement("input");
	campo_quesito.type = 'hidden';
	campo_quesito.name = 'txtQuesitoClinico';
	campo_quesito.value = quesito;
	doc.appendChild(campo_quesito);
	
		var campo_quadro = document.createElement("input");
	campo_quadro.type = 'hidden';
	campo_quadro.name = 'txtQuadroClinico';
	campo_quadro.value = quadro;
	doc.appendChild(campo_quadro);
	
	var campo_extra_db = document.createElement("input");
	campo_extra_db.type = 'hidden';
	campo_extra_db.name = 'extra_db';
	campo_extra_db.value = extra_db;
	doc.appendChild(campo_extra_db);
	

		var campo_ticket = document.createElement("input");
	campo_ticket.type = 'hidden';
	campo_ticket.name = 'Hiden_tick';
	campo_ticket.value = ticket;
	doc.appendChild(campo_ticket);
	
		var campo_esenzione = document.createElement("input");
	campo_esenzione.type = 'hidden';
	campo_esenzione.name = 'Hiden_esenzione';
	campo_esenzione.value = esenzione;
	doc.appendChild(campo_esenzione);
	
	doc.Hiden_esa.value=iden_esami
	
	
	doc.submit();
}

// ***************
// modifica del 26-2-15
function visualizzaDocumentiSole(){
        var v_iden;
        var v_iden_anag;
        var v_num_consenso =0;
		//var bolInconsole = false;
		
		
		// *****************************		
		// modifica del 23-2-15
		var hndHomeFrame ;	
		//@deprecated
//		var isInRicercaPazienti = window.name=='RicPazWorklistFrame'?true:false;
		// si intende sia wk principale che wk esami da ricerca paziente
		var isInWorklist = false;

		var isInConsole=false;
		try{if (typeof(isRegularConsole)!="undefined"){isInConsole = true;}}catch(e){isInConsole=false;}
		if (!isInConsole){
			if (window.name=='worklistMainFrame'){
				isInWorklist= true;
			}
			else{
				if (window.name=="RicPazWorklistFrame" && window.location.href.toString().indexOf("SL_RicPazWorklist")>-1){
					isInWorklist = false;
				}
				else{
					// wk esami da ricerca pazienti
					isInWorklist = true;
				}
			}
		}
		// *****************************			

		
        if(typeof iden == 'undefined'){
            if(typeof array_iden_anag == 'undefined'){
                v_iden_anag = globalIdenAnag;
				isInConsole = true;
            }else{
                v_iden = array_iden_anag;
                v_iden_anag= stringa_codici(v_iden);
            }
        }else{
            v_iden = iden;
            v_iden_anag= stringa_codici(v_iden);
        }
		// *****************************
		// ******* modifica aldo ********
        try{			
			if (!isInConsole){
				// NON sono in console
				var listaStatoAccettato = stringa_codici(array_accettato).split("*") ;  
				var bolNonAccettato = false;
				for (var k=0;k<listaStatoAccettato.length;k++){
					if (listaStatoAccettato[k]<=0){
						bolNonAccettato = true;
						break;
					}
				}
				if (bolNonAccettato){
					//almenon un esame NON
					// è stato accettato
					alert("Paziente non identificato. Impossibile accedere all'archivio SOLE.");
					return;
				}
			}
		}
		catch(e){;}
		// *****************************		
        dwr.engine.setAsync(false);
        var v_sql = "select count(*) from anag where iden = "+v_iden_anag+" and consenso_sole='S'";
        toolKitDB.getResultData(v_sql,function(rs){
            v_num_consenso = rs[0];
        });
        dwr.engine.setAsync(true);
        if(v_num_consenso ==0){
            alert("Consenso Sole non espresso o negato! Impossibile continuare!");
            return;
        }		
		
		// **************************
		// ***************
		// modifica del 26-2-15
		// devo discernere se mi trovo in lista pazienti o worklist esami!
		// RicPazWorklistFrame			ricerca Pazienti
		// worklistMainFrame			wk principale

			
//		var isInRicercaPazienti = window.name=='RicPazWorklistFrame'?true:false;
//		var isInWorklist = window.name=='worklistMainFrame'?true:false;
//		var isInConsole=false;
		
		try{
			//try{if (typeof(isRegularConsole)!="undefined"){isInConsole = true;}}catch(e){isInConsole=false;}
			if (isInConsole){hndHomeFrame = getHomeFrame();}else{hndHomeFrame = top;}	
			if (hndHomeFrame.home.getConfigParam("SOLE.ACCESSO_CON_MOTIVO") == "S"){
				// controllo firmato
				var bolFirmato = false;
				if (isInWorklist){
					// richiedo motivazione se e solo se gli esami sono firmati
					var listaIdenEsame = stringa_codici(array_iden_esame).split("*");
					for (var k=0;k<listaIdenEsame.length;k++){
						if ( ritornaInfoEsame(listaIdenEsame[k], array_iden_esame, array_firmato) =="S"){
							bolFirmato = true;
							break;
						}
					}
				}
				if (isInConsole && classReferto.FIRMATO=="S"){
					bolFirmato = true;
				}
				// ************
				if (isInConsole){
					// console
					if (bolFirmato){
						hndHomeFrame.MOTIVAZIONE_HANDLER.setInputObj(baseUser.LOGIN, baseUser.IDEN_PER, basePC.IP, globalIdenAnag,[array_iden_esame[0]],'BB_SOLE','motivazioni.xml');
					}
					else{
						doVisualizzaDocumentiSole({'WEBUSER':baseUser.LOGIN,'IDEN_PER':baseUser.IDEN_PER,'IP':basePC.IP,'IDEN_ANAG':globalIdenAnag,'IDEN_ESAMI':[array_iden_esame[0]],'FUNZIONALITA':'BB_SOLE','STMFILE':''});	
						return;
					}
				}
				else{
					// worklist
					if (isInWorklist){
						if (bolFirmato){
							hndHomeFrame.MOTIVAZIONE_HANDLER.setInputObj(baseUser.LOGIN, baseUser.IDEN_PER, basePC.IP, stringa_codici(array_iden_anag).split("*")[0],[stringa_codici(array_iden_esame).split("*")[0]],'BB_SOLE','motivazioni.xml');
						}else{
							doVisualizzaDocumentiSole({'WEBUSER':baseUser.LOGIN,'IDEN_PER':baseUser.IDEN_PER,'IP':basePC.IP,'IDEN_ANAG':stringa_codici(array_iden_anag).split("*")[0],'IDEN_ESAMI':[stringa_codici(array_iden_esame).split("*")[0]],'FUNZIONALITA':'BB_SOLE','STMFILE':''});	
							return;
						}
					}
					else{
						// ricerca pazienti
						hndHomeFrame.MOTIVAZIONE_HANDLER.setInputObj(baseUser.LOGIN, baseUser.IDEN_PER, basePC.IP, v_iden_anag,[],'BB_SOLE','motivazioni.xml');
					}
				}
				hndHomeFrame.MOTIVAZIONE_HANDLER.setCaller(window);
	//			var motivazione = hndHomeFrame.MOTIVAZIONE_HANDLER.getInputParam();
				hndHomeFrame.MOTIVAZIONE_HANDLER.setCallback("doOpen_BBSOLE('MOTIVO')");
				hndHomeFrame.MOTIVAZIONE_HANDLER.openForm();
			}
			else{
				if (isInConsole){
					doVisualizzaDocumentiSole({'WEBUSER':baseUser.LOGIN,'IDEN_PER':baseUser.IDEN_PER,'IP':basePC.IP,'IDEN_ANAG':globalIdenAnag,'IDEN_ESAMI':[array_iden_esame[0]],'FUNZIONALITA':'BB_SOLE','STMFILE':''});	
				}
				else{
					if (isInWorklist){
						doVisualizzaDocumentiSole({'WEBUSER':baseUser.LOGIN,'IDEN_PER':baseUser.IDEN_PER,'IP':basePC.IP,'IDEN_ANAG':stringa_codici(array_iden_anag).split("*")[0],'IDEN_ESAMI':[stringa_codici(array_iden_esame).split("*")[0]],'FUNZIONALITA':'BB_SOLE','STMFILE':''});							
					}
					else{
						doVisualizzaDocumentiSole({'WEBUSER':baseUser.LOGIN,'IDEN_PER':baseUser.IDEN_PER,'IP':basePC.IP,'IDEN_ANAG':v_iden_anag,'IDEN_ESAMI':[],'FUNZIONALITA':'BB_SOLE','STMFILE':''});													
					}
				}
			}
		}catch(e){alert(e.description);}
		// *****************************	

}

function doVisualizzaDocumentiSole(value){
	try{
		if (typeof(value)!="undefined"){
			// sono arrivato da accesso diretto, quindi lo registro
			var stm = getHomeFrame().executeStatement('motivazioni.xml',"salvaMotivazione",[JSON.stringify(value),"",""],0);			
			if (stm[0]!="OK"){
				alert("Errore - " + stm[1]);
				return;
			}		
		}
		
		width = 300;
		height = 300;
		leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
		topPosition = (window.screen.height / 2) - ((height / 2) + 50);
		window.open('plugins/sole/sird.html',"_blank","WkRicette","status=yes,left="+leftPosition+",top="+topPosition+",screenX="+leftPosition+",screenY="+topPosition+",toolbar=yes,menubar=yes");   
	}
	catch(e){
		alert("doVisualizzaDocumentiSole - Error: " + e.description);
	}
}

function doOpen_BBSOLE(){
	var isInConsole = false;
	var outputFromFancy = "";
	try{
		// così va bene da worklist
		try{if (typeof(isRegularConsole)!="undefined"){isInConsole = true;}}catch(e){isInConsole=false;}
		if (!isInConsole){		
			outputFromFancy = top.MOTIVAZIONE_HANDLER.getOutputFromFancy();
			top.MOTIVAZIONE_HANDLER.setOutputFromFancy("");
		}
		else{
			outputFromFancy = getHomeFrame().MOTIVAZIONE_HANDLER.getOutputFromFancy();
			getHomeFrame().MOTIVAZIONE_HANDLER.setOutputFromFancy("");
		}
		if (outputFromFancy==""){
			// premuto chiudi, NON vado avanti
			
		}
		else{
			// vado avanti
			doVisualizzaDocumentiSole();
		}

	}
	catch(e){
		alert("doOpen_BBSOLE - Error: " + e.description);
	}
	
}

// *****************************		
// *****************************		
function apriWorklistRicette(){
	width = 300;
	height = 300;
    leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
    topPosition = (window.screen.height / 2) - ((height / 2) + 50);
    var v_iden_anag= stringa_codici(iden);
    var v_cod_fisc= stringa_codici(codice_fiscale);
    window.open('servletGenerator?KEY_LEGAME=RICETTA_ROSSA&IDEN_ANAG='+v_iden_anag+"&COD_FISC="+v_cod_fisc+"&IDEN_PER="+baseUser.IDEN_PER,"_blank","WkRicette","status=no,left="+leftPosition+",top="+topPosition+",screenX="+leftPosition+",screenY="+topPosition+",toolbar=no,menubar=no");
}
function apriWorklistRicetteFromWK(){
	width = 300;
	height = 300;
    leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
    topPosition = (window.screen.height / 2) - ((height / 2) + 50);
    var v_iden_anag= stringa_codici(array_iden_anag);
    var v_cod_fisc= stringa_codici(array_cod_fisc);
    window.open('servletGenerator?KEY_LEGAME=RICETTA_ROSSA&IDEN_ANAG='+v_iden_anag+"&COD_FISC="+v_cod_fisc+"&IDEN_PER="+baseUser.IDEN_PER,"_blank","WkRicette","status=no,left="+leftPosition+",top="+topPosition+",screenX="+leftPosition+",screenY="+topPosition+",toolbar=no,menubar=no");
}
var NS_PRESTAZIONI = {
    nuovaRicettaPrestazioni:function(provenienza){
        var v_utente=baseUser.LOGIN;
		var v_cod_fisc = "";
		var iden_anag="";
		if(typeof array_cod_fisc !='undefined'){
			v_cod_fisc=stringa_codici(array_cod_fisc);
			iden_anag = stringa_codici(array_iden_anag);
		}else{
			v_cod_fisc=stringa_codici(codice_fiscale);
			iden_anag = stringa_codici(iden);
		}

        window.open("servletGenerator?KEY_LEGAME=RICETTA_PRESTAZIONI&idRemoto="+v_cod_fisc+"&utente="+v_utente+"&IDEN_ANAG="+iden_anag+"&PROVENIENZA="+provenienza);
    }
};

var NS_FARMACI = {
    nuovaRicettaFarmaci:function(provenienza){
        var v_utente=baseUser.LOGIN;
		var v_cod_fisc = "";
		var iden_anag="";
		if(typeof array_cod_fisc !='undefined'){
			v_cod_fisc=stringa_codici(array_cod_fisc);
			iden_anag = stringa_codici(array_iden_anag);
		}else{
			v_cod_fisc=stringa_codici(codice_fiscale);
			iden_anag = stringa_codici(iden);
		}
        window.open("servletGenerator?KEY_LEGAME=RICETTA_FARMACI&idRemoto="+v_cod_fisc+"&utente="+v_utente+"&IDEN_ANAG="+iden_anag+"&PROVENIENZA="+provenienza,"","farmaci","status=no,toolbar=no,menubar=no");
    },
    visualizzaFarmaco:function(){
        var v_utente=baseUser.LOGIN;
        var v_cod_fisc=parent.$("#COD_FISC").val();
        var iden_anag = parent.$("#IDEN_ANAG").val();
        var progressivo = stringa_codici(array_progressivo);
        window.open("servletGenerator?KEY_LEGAME=RICETTA_FARMACI&idenprogressivo="+progressivo+"&idRemoto="+v_cod_fisc+"&IDEN_ANAG="+iden_anag+"&utente="+v_utente,"","farmaci","status=no,toolbar=no,menubar=no");
    }
};

function apriRicettaOspedaliera(){
    var iden_ref = stringa_codici(array_iden_ref);
    var iden_anag = stringa_codici(array_iden_anag);
    var ritorno="N";
    window.open("plugins/ricetta_rossa/ricetteOspedaliere.html?IDEN_REF="+iden_ref+"&IDEN_ANAG="+iden_anag+"&RITONO="+ritorno,"","farmaciOspedalieri","status=no,toolbar=no,menubar=no");
}



// modifica aldo 
function canShowSole(){
	var bolEsito = false;
	var isInConsole=false;
	var hndHomeFrame ;
	try{
		
		try{if (typeof(isRegularConsole)!="undefined"){isInConsole = true;}	}catch(e){	isInConsole=false;}
		if (isInConsole){hndHomeFrame = getHomeFrame();	}else{hndHomeFrame = top;}
		
		bolGestioneSole = hndHomeFrame.home.getConfigParam("GESTIONE_SOLE")=="S";		

		if (!bolGestioneSole){
			return false;
		}
		/*if (typeof array_consenso_sole!="undefined"){
			alert("##" + window.array_consenso_sole);
		}
		else{
			alert("non esiste");
		}*/

		if (isInConsole){
			// console
			hndHomeFrame.CTX_MENU_CHECKER.setInfoObj(globalIdenAnag,[array_iden_esame[0]],classReferto.IDEN, window);
		}
		else{
			// worklist
			hndHomeFrame.CTX_MENU_CHECKER.setInfoObj(stringa_codici(array_iden_anag).split("*")[0],[stringa_codici(array_iden_esame).split("*")[0]],stringa_codici(array_iden_ref).split("*")[0], window);
		}
		if (hndHomeFrame.CTX_MENU_CHECKER.isAvailable("SOLE_DISPONIBILE")){
			bolEsito = true; 
		}	
	}
	catch(e){
		alert("canShowSole - Error: " + e.description);
	}

	return bolEsito;
}
// ******************


function stampaProspetto(idenEsame){
	var idDivOcx = "idDivOcx";
	var strToAppend = "";
	var strBase64ToPrint="";
	// parametrizzare  il valore sottostante
	// usare 
	var urlToCall = ""; // ?IDEN_ESAME=1260950
	try{
		if (isNaN(idenEsame)){return false;}
		try{
			if (top.home.getConfigParam("MODULO.PAGAMENTI")!=""){
				urlToCall = top.home.getConfigParam("MODULO.PAGAMENTI");
			}
			else{
				urlToCall = "http://192.168.4.122:7001/ProspettoPagamento";
			}	
		}
		catch(e){urlToCall = "http://192.168.4.122:7001/ProspettoPagamento";}
		/*
		if ($("#" + idDivOcx).length){
			strToAppend = "<div style='display:block; visibility:visible; width:600; height:600;' id='" + idDivOcx + "'></div>";
		    $("body").append(strToAppend);
		}*/
	   // appendo se non esiste l'ocx
       try{
		   
		   var $OBJ;
		    if ($("#prjpdfreader").length==0){
				$OBJ = $(document.createElement("object"));
				var attr={"id":"prjpdfreader","classid":"clsid:969CB476-504B-41CF-B082-1B8CDD18323A"};
				$OBJ.attr(attr);
				$OBJ.css({"width":"1px","height":"1px"});
		       $("body").append($OBJ);				
			}
        }catch(e){
             alert("Error in append " + e);
        }
	   // recupero il pdf da stampare
	    var dataToSend = "IDEN_ESAME="+idenEsame;
		urlToCall = urlToCall + "?" + dataToSend;
		$.ajax({
			url: "proxy",
			data: "CALL="+urlToCall+"&PARAM="+encodeURI("")+"&CONTENT=application/json",
			cache: false,
			type: "POST",
			async : false,
			crossDomain: false,
			dataType: 'json',
			timeout:30000,
            success: function (resp)
            {
                if(resp.RESPONSE.ESITO =="OK"){
                    strBase64ToPrint = resp.RESPONSE.DOCUMENTO;
					alert("Ok. Base64 ricevuto. stampo.");
					try{
						document.all.prjpdfreader.LoadPdfBase64(strBase64ToPrint);        
						document.all.prjpdfreader.printSilently();					
					}catch(e){alert("Error printing - "  + e.description);}
                }
				else{
					// errore
					alert("Errore scaricamento dati. Errore: " + resp.RESPONSE.ERRORE); return false;
				}
            },
            timeout:20000,
            error: function (resp)
            {
                alert("Errore scaricamento dati.");
            }
        });	   
	   
	   // ************************************
	   // **********************************
	   /*
	   setTimeout(function(){
			try{
				document.all.prjpdfreader.LoadPdfBase64(strTest);        
				document.all.prjpdfreader.printSilently();
			}catch(e){alert("#" + e.description);}
	   },2000);*/
	}
	catch(e){
		alert("stampaProspetto - Error: " + e.description);
	}
		
}


