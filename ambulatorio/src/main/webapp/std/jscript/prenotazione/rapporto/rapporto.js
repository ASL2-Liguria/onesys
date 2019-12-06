// modifica 17-6-15
$(function() {
	// devo togliere auto deselezione riga !!!
	// affinchè sia possibile usare "ripeti ciclica"
	// per più prestazioni
	auto_deselezione_paz_div = function (vettore, indice_ultimo_paz){
		return true;
	}
});
//**************
function esci()
{
	ritorna_prenotazione();
	/*
	var aPar = parent.parametri;

	switch (aPar[0])
	{
		case "PRENOTAZIONE":
			document.location.replace('sceltaEsami?tipo_registrazione=P&next_servlet=schedaEsame&cmd_extra=parent.parametri%3Dnew+Array("PRENOTAZIONE")%3B');
			break;
		case "CONSULTAZIONE":
			document.location.replace('consultazioneInizio?sala=' + aPar[1] + '&data=' + aPar[2] + '&aree=' + aPar[3] + '&area=' +  + aPar[4] + '&tipo=' + aPar[5] + '&js_click=javascript%3A&js_indietro=javascript%3Aritorna_consulta(%22' + aPar[5] + '%22%2C%22' + aPar[1] + '%22%2C%22' + aPar[7] + '%22%2C%22' + aPar[6] + '%22)%3B');
			break;
		default:
			document.location.replace('blank');
	}
	 */
}

function stampa()
{
	var strFirstExam = "";
	var strUrl = "";
	
	var idenEsame = stringa_codici(a_iden_esame) + '';
	var stampaReparto = stringa_codici(a_reparto)+'';
	if (idenEsame=='')
	{
		alert('Selezionare almeno 1 esame')
		return;
	}
	strFirstExam = idenEsame.split("*")[0];
	idenEsame=idenEsame.replace(/\*/g, ",");

	var sf= '{ESAMI.IDEN} in [' + idenEsame  + ']'
	
	strUrl = "elabStampa?stampaFunzioneStampa=RICEVUTA_PRENO_STD&stampaSelection=" + sf + "&stampaAnteprima=N";
	// passo separatamente il primo esame
	// affinchè processPrintInfo java funzioni correttamente
	strUrl += "&stampaIdenEsame=" + strFirstExam;
	strUrl += "&stampaReparto=" + stampaReparto;
	// stampaReparto a_reparto
	var finestra  = window.open(strUrl,"","top=0,left=0");

	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open(strUrl,"","top=0,left=0");
	}
}

function avviso_utente(valore)
{
	if(valore != null && valore != '' && valore != 'null')
	{
		alert('Attenzione, ci sono esami presenti nell\'intervallo di un\'ora:\n' + valore);
	}
}

function funzione_extra()
{
	initbaseUser();
	// modifica 13-8-15
	// ******************************
	try{
		
		// ******************
		// modifica 19-4-16		
		var bolCallFromConsole = false;		
		// **********************
		
		// controllo se arrivo dalla console: ovvero giro di Riccio
		// quindi chiamo in atutomatico funzione per elencare MIE prenotazioni
		// e nascondo i pulsanti
		// rimappare il pulsante esci o unload, affinchè
		// vengano caricate le prestazioni
		try{
			if (typeof(top.opener.parent.isRegularConsole.toString().toLowerCase()=="function")){
				// ******************
				// modifica 19-4-16				
				bolCallFromConsole = true;
				// ******************			
				$("#lblWorklist").parent().hide();
				$("#lblEsci").parent().hide()		;		
				top.opener.refreshPrenotazioniPaziente();
			}
		}
		catch(e){
			bolCallFromConsole = false;			
		}
//		alert("isRegularConsole() " + top.opener.parent.isRegularConsole());
		// nascondere: lblWorklist, lblEsci, lblStampa (? lasciare ?)
		// menu contestuale lo lascio ? se viene prenotato un prelievo
		// appare "richiesta labo", funziona?? verifica
	}
	catch(e){		
		alert("funzione_extra - errore: " + e.description);
	}
	// ******************************
	try{
		$("table").first().find('tr').eq(0).find('td').eq(3).after("<td class='classButtonHeader'><div class='pulsante'><a id='lblGetOut' href='javascript:top.close();'>Esci</a></div>");
	}
	catch(e){;}
	try
	{
		if(parent.frameDirezione)
		{
			parent.document.all.frameMainPrenotazione.rows = "0,*";
		}
	}	catch(ex){;}

	// ******************
	// modifica 19-4-16
	var objCaller =  window.parent.objCaller;
	try{caller = objCaller.caller;}catch(e){caller="";}
	if ((caller=="undefined")||(typeof(caller)=="undefined")){
		caller = "";
	}		
	if ((caller!="")&&(!bolCallFromConsole)){
		$("#lblWorklist").parent().hide();		
		$("#lblEsci").parent().hide()		;				
	}
	// ************************
}

function backToWorklist(){
	try{
		top.apri('worklistInizio');
	}
	catch(e){
		alert("backToWorklist - Error: "+ e.description);
	}
}


// *******************************************************
// ************************ cicliche
// *******************************************************
// *******************************************************
// ************************ cicliche
// *******************************************************

// modifica 24-10-16
function checkErogatiRegione(idenEsami){
	try{
		var rs=top.executeQuery('worklist_main.xml','getCountErogatiRegione',[idenEsami]);
		if (rs.next()){
			try{
				if (parseInt(rs.getString("esito"))>0){
					throw new Error("Impossibile proseguire: alcune delle prestazioni scelte son state gi\u00E0 erogate al ministero !");
				}
			}catch(e){
				// errore di conversione, non dovrebbe mai esserci
				throw new Error("Impossibile proseguire: alcune delle prestazioni scelte son state gi\u00E0 erogate al ministero !!!");
			}
		}else{
			throw new Error("Errore grave: esami cancellati");
		}
	}catch(e){
		throw e;
	}		
}
// *********


// modifica 12-5-15
function ripetiCiclo(){
	try{
		var idenEsame = stringa_codici(a_iden_esame) + '';
		var lista ;
		
		lista = idenEsame.split("*");
		// array disponibili a_iden_esame, a_reparto, a_iden_anag
		// *********************
		var rs ;
		var bolImpegnativaDaCompilare = false;
		var bolImpegnativaDiversa = false;

		if (lista.length!=1){
			alert('Prego, selezionare una prestazione.')
			return;
		}

		// *******************
	    // modifica 24-10-16
		try{
			checkErogatiRegione(idenEsame);
		}catch(e){
			alert(e.description);
			return;
		}		
		// *****************
		try{rs=top.executeQuery('worklist_main.xml','getNumImpRich',[idenEsame]);}catch(e){alert("Errore getNumImpRich\n" + e.description); }
		if (rs.next()){
			// modifica 14-6-16
			// ticker iden = 107 SOLVENTE
			if (rs.getString("IDEN_TICK")!="107"){
				if ((rs.getString("NUMIMP_NUMRICH")=="")&&(rs.getString("INT_EST")=="E")){
					// modifica 6-7-16
					// casi extra LEA
					var arrProvenienza = [];
					arrProvenienza.push(rs.getString("IDEN_PRO"));
					// 2872 ESTERNI EXTRA LEA, 4492 ESTERNO ACCESSO DIRETTO
					if (jQuery.inArray( "2872", arrProvenienza) == -1 && jQuery.inArray( "4492", arrProvenienza) == -1 && top.home.getConfigParam("SITO")=="SAVONA"){
						bolImpegnativaDaCompilare=true;
					}
					// ***********
				}
			}
		}
		if (bolImpegnativaDaCompilare){
			alert("Impossibile ripetere l'esame: impegnativa non compilata.");
			return;
		}
		// ******** FINE modifica 13-6-16


		// *********
		
		$.fancybox({
			'width'				: 800,
			'height'			: '95%',
			'autoScale'     	: false,
			'transitionIn'		: 'none',
			'transitionOut'		: 'none',
			'type'				: 'iframe'		,
			'href'		: 'ciclicheAnnuali.html?sorgente=prenRapporto&idenEsame=' + idenEsame
		});	
	}
	catch(e){
		alert("ripetiCiclo - Error: " + e.description);
	}	
}

// modifica 27-4-15
// modifica 11-5-15
// modifica 14-6-16
// modifica 14-7-16
// prendere in toto
function generaEsamiCiclici(valore, jsonObj, closeOnExit){
	try{
		var bolEsitoInsert = true;
		var strTmpData = "";
		// valore contiene le date in formato gg/mm/yyyy
		var listaDate ;
		var myLista 
		var stm;
		var myJson ;
		
		var myCloseOnExit = true;
		if (typeof closeOnExit=="undefined"){myCloseOnExit = true;		}
		else{	myCloseOnExit = closeOnExit;}		
		
		try{
			myJson = JSON.parse(jsonObj);
		}
		catch(e){
			alert("Errore di conversione dati. Impossibile continuare.");
			return;
		}
		
		if (valore==""){
			alert("Nessuna data valida selezionata");
			return;
		}
		listaData = valore.split(",")
		var idenEsame = stringa_codici(a_iden_esame);
		var idenPerUtente = baseUser.IDEN_PER ;
		
		
		
		var listaEsami = idenEsame.split("*");
		var ID_GRUPPO_CICLICA = "";
		
		for (var z=0;z<listaEsami.length;z++){		
			ID_GRUPPO_CICLICA = "";
			// *** nuovo 
			// genereo id aggregante
			stm = top.executeStatement('worklist_main.xml','getIdGruppoCiclica',[],1);
			if (stm[0]!="OK"){
				alert("Errore: problemi nel recupero id gruppo cicliche.\n"+ + stm[1]);
				return;
			}
			ID_GRUPPO_CICLICA = stm[2]; // primo parametro output
			if (isNaN(ID_GRUPPO_CICLICA)){
				alert("Errore: codice gruppo ciclica NON numerico.");
				return;			
			}
			if (myJson.ora_accettazione=="" || myJson.ora_accettazione=="undefined"){
				alert("Nessuna ora valida selezionata");
				return ;
			}				
			// **************		
			for (var i=0;i<listaData.length;i++){
				myLista = new Array();
				myLista.push(listaEsami[z]);				
//				myLista.push(idenEsame);		
				myLista.push(idenPerUtente);
				strTmpData = listaData[i].substring(6,10) + listaData[i].substring(3,5) + listaData[i].substring(0,2);
				myLista.push(strTmpData);
				myLista.push(parseInt(ID_GRUPPO_CICLICA)); 
				// *************
				if (i== listaData.length-1){
					// ultimo del pacchetto
					myLista.push("S");
				}
				else{
					myLista.push("N");
				}
				//***********			
	//			alert(idenEsame +"#"+ idenPerUtente + "#" + strTmpData);
				myLista.push(myJson.ora_accettazione);
				myLista.push(myJson.note_accettazione);						
				stm = top.executeStatement('worklist_main.xml','creaEsameCiclico',myLista,0);
				if (stm[0]!="OK"){
					alert("Errore: problemi nel salvataggio dell'esame ciclico.\n" + stm[1]);
					bolEsitoInsert = false;
					break;
				}			
			} // fine loop sulle data
		} // fine loop su esami
		if (!bolEsitoInsert){
			// ERRORE!!
			// todo completare
			alert("Errore: problemi nel salvataggio dell'esame ciclico");
			return;
		}
		else{
			// alla fine torno alla worklist
			// modifica 17-6-15
			alert("Prestazioni inserite correttamente.");
//			backToWorklist();
		}
	}
	catch(e){
		alert("generaEsamiCiclici - Error: " + e.description);
	}	
}
// *********************************


//********************
// modifica 22-5-15
//********************
function stampaReport(funzione_chiamante){
	try{
		var idenAnag = "", sf = "";var finestraStampa;
		if (funzione_chiamante==""){return;}
		switch (funzione_chiamante){
			case"LISTA_PRENO_PAZ":
				idenAnag = stringa_codici(a_iden_anag).split("*")[0];
//				idenEsame=idenEsame.replace(/\*/g, ",");
				sf= "{ESAMI.IDEN_ANAG} = " + idenAnag  + " and {ESAMI.REPARTO} in ['" +  baseUser.LISTAREPARTI.toString().replace(/,/g, "','") + "']";
				try{
					var x = (new String("")).getTodayStringFormat();
				}
				catch(e){
					String.prototype.getTodayStringFormat = function()
					{
						var dataOggi ;
					
					
						dataOggi=new Date();
						var dataOggiGiorno=dataOggi.getDate();
						if (parseInt(dataOggiGiorno)<10){dataOggiGiorno = "0" + dataOggiGiorno.toString();}
						var dataOggiMese=dataOggi.getMonth()+1;
						if (parseInt(dataOggiMese)<10){dataOggiMese = "0" + dataOggiMese.toString(); }
						var dataOggiAnno=dataOggi.getFullYear();
						var dataOggiStringa= dataOggiAnno.toString() + dataOggiMese.toString() + dataOggiGiorno.toString();
						return dataOggiStringa;
					};
				}
				sf += " AND {ESAMI.DAT_ESA} >'" + (new String("")).getTodayStringFormat() +"'";
				// ************************
				// modifica 17-6-15
//				sf += " AND {ESAMI.PRENOTATO} ='1' and {ESAMI.ACCETTATO} ='0'";
				sf += " AND {ESAMI.ESEGUITO} ='0'";
				// ************************
				sf += " AND {ESAMI.DELETED} ='N'";
				strUrl = "elabStampa?stampaFunzioneStampa="+funzione_chiamante+"&stampaSelection=" + sf + "&stampaAnteprima=S";
				finestraStampa  = window.open(strUrl,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight); 
				if(finestraStampa){finestraStampa.focus();}
					else{finestraStampa  = window.open(strUrl,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);}
				break;
			default:
				break;
		}
	}	
	catch(e){
		alert("stampaReport - error: " + e.description);
	}
}