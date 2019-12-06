/*
Funzione che effettua l'esecuzione MULTIPLA di n esami per volta.
Controlli da eseguire:
1 - gli esami devono avere lo stesso NUM_PRE (ESAMI.num_pre);
2 - devono avere ACCETTATO = 0 ed ESEGUITO = 1;
3 - controllo se c'è l'obbligo di inserimento pwd: WEB.ob_ins_pwd_esecuzione = 'S'.

4\ - controllo se l'utente ha le permissioni per l'esecuzione di un esame o meno.
    Se WEB.ob_ins_pwd_esecuzione = 'S' il controllo è effettuato lato java

5\ - V_GLOBALI.separasottonumeri == 'S' possibilità dell'utente di eseguire esami un cdc che non è
									   fra i suoi in web_cdc.
									   Se WEB.ob_ins_pwd_esecuzione = 'S' il controllo è effettuato lato java

5 - controllo se esistono altri esami dello stesso paziente (per la data dell'esame) che non sono ancora stati eseguiti
6 - obbligatorietà appropriatezza
7\ - obbligatorietà apertura scheda esame in esecuzione WEB.ob_esecuzione = 'S';
	 Se WEB.ob_ins_pwd_esecuzione = 'S' il controllo è effettuato lato java
*/

var azioneCiclo = "";
var costInizioCiclo = "CICLICA";
var costFineCiclo = "FINE_CICLO";
var elenco_esami = '';

try{var globalSito = "SAVONA"; globalSito = top.home.getConfigParam("SITO");}catch(e){globalSito = "SAVONA";}
// ******************************************
Date.prototype.timeNow = function(){
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() ;
};

Date.prototype.today = function(){ 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear() 
};

function myGetTodayStringFormat()
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
}
// ******************************************
// modfica 01-04-2015
var publicRichiestaData = false;
function esegui(richiestaData)
{
	var iden_anag = null;
	var c_num_pre = null;
	var c_ese = null;
	var c_acc = null;
	var c_sottonumero = null;
	var c_permissioniEsecuzioneUtente = null;


	if (conta_esami_sel()== 0)
	{
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}

	// modifica 17-6-2015
	// controllo se sono eseguibili stringa_codici(array_iden_esame)
	try{
		var rsCanExecute =  top.executeQuery('worklist_main.xml','canExecuteExams',[stringa_codici(array_iden_esame)]);
		if (rsCanExecute.next()){
			if (rsCanExecute.getString("esito")!="" && rsCanExecute.getString("esito")!="undefined" && typeof(rsCanExecute.getString("esito"))!="undefined"){
				alert(rsCanExecute.getString("esito"));
				try{aggiorna();}catch(e){;}
				return false;			
			}
		}
	}
	catch(e){alert("Errore in canExecuteExams " + e.description);}
	// **********************
	// modfica 01-04-2015
	var bolRichiestaData = false;
	publicRichiestaData = typeof(richiestaData)=="undefined"?false:richiestaData;

	// controllo se almeno un esame della lista è una DEMA 
	// deriva da una dema !!!
	if (publicRichiestaData){
		try{var rs =  top.executeQuery('worklist_main.xml','exitEsaDematerializzato',[stringa_codici(array_iden_esame).replace(/\*/g, ',')]);}catch(e){alert("Errore in exitEsaDematerializzato " + e.description);}
		if (rs.next()){
			alert("Impossibile proseguire: almeno una delle prestazioni selezionate sono dematerializzate!!!\nImpossibile erogarle in data differente.");
			return;
		}
	}
	// ******************************	
	
	// *********


	// *********************	
	// modifica del 10-02-15
	if (globalSito=="FERRARA"){
		var idenEsaDaBloccare = 48005; // CONTROLLO REFERTI IN VISIONE COMPLETAMENTO DIAGNOSTICO 
		// blocco TAB_ESA.IDEN = 48005
		// array_iden_esa
		var listaIdenEsa = stringa_codici(array_iden_esa).split("*");
		var idxEsaDaBloccare = $.inArray(idenEsaDaBloccare.toString(), listaIdenEsa);
		if (idxEsaDaBloccare>-1){
			// e' stato preso anche quello da bloccare
			// controllo int_esa
//			var rs =  top.executeQuery('worklist_main.xml','getIntEst',[array_iden_esame[idxEsaDaBloccare]]);
			var rs =  top.executeQuery('worklist_main.xml','getIntEst',[stringa_codici(array_iden_esame)]);
			if (rs.next()){
				if  (rs.getString("int_est")=="E"){
					alert("Impossibile erogare la prestazione. Effettuare il controllo referti sulla prestazione precedente del paziente.");
					return;			
				}
			}
			else{
				alert("Errore grave: l'esame e' stato cancellato!"); return;
			}
		}
	}
	// *********************
	
	
	// ***** nuovo privacy ****
	// modifica 7-10-15
	if (!isPrivacyOK()){
		alert("Impossibile continuare, si prega di compilare/i moduli del consenso trattamento dati esame / prestazione.");
		return;
	}
	// ***************************
	/*Controllo se il paziente è READONLY*/
	iden_anag = stringa_codici(array_iden_anag);

	if(isLockPage('ANAGRAFICA', iden_anag, 'ANAG'))
	{
		alert(ritornaJsMsg('a_readonly'));//Attenzione, il paziente selezionato è di sola lettura
		return;
	}
	/**/
	c_num_pre     = controllo_num_pre();
//	c_acc_ese     = controllo_accettato_eseguito();
	// false se è GIA ESEGUITO
	c_ese     = controllo_eseguito();
	// false se NON è accettato
	c_acc     = controllo_accettato();
	c_sottonumero = controllo_separasottonumeri();

	// ******************
	//*********************************
	/*if(!c_num_pre || !c_acc_ese || !c_sottonumero)
	{*/
		

		//if(!c_sottonumero)
			//alert('Attenzione:L \'utente non può eseguire esami che non appartengono ai suoi cdc');


	//}
	
//	if(!c_num_pre){alert('Esami con numero accettazione differenti: non si possono eseguire esami multipli');return;}
	if(!c_ese){
			alert('Attenzione: Esami già eseguiti.');return;}			


	if (c_acc==false){
		// modifica 7-10-15
		
		if (top.home.getConfigParam("ESEGUI_PRENOTAZIONI")=="S"){
			// non accettato, quindi solo prenotato
			if (conta_esami_sel()> 1)
			{
				alert(ritornaJsMsg("jsmsgSoloUnEsame"));
				return;
			}
			var idenEsame = stringa_codici(array_iden_esame);
			//***************************
			//****** modifica DEMA ******
			//***************************	
			// mega patch: rendere il controllo una funzione
			// NON fare copia incolla
			try{
				var listaIdenEsamiPerDema = stringa_codici(array_iden_esame).split("*");
				var rsCheckEsameRefertabile;
				var bolCheckDema = true;
				for (var z=0;z<listaIdenEsamiPerDema.length;z++){  
				//var rs = top.executeStatement('worklist_main.xml','checkEsameRefertabile',[stringa_iden_esame],2);
					rsCheckEsameRefertabile = top.executeStatement('worklist_main.xml','checkEsameRefertabile',[listaIdenEsamiPerDema[z]],2);
					if (rsCheckEsameRefertabile[0] == 'KO') { 
						bolCheckDema = false;
						alert('checkEsameRefertabile' + rsCheckEsameRefertabile[1]);
						break; //return;
					}
					if (rsCheckEsameRefertabile[2] == 'KO') { 
						bolCheckDema = false;
						alert(rsCheckEsameRefertabile[3]);
						break; //return;
					}
				}
				if (!bolCheckDema){return;}
			} catch (e) {
				alert("Errore: checkEsameRefertabile " + e.description);
			}
			//***************************
			var strOggi = myGetTodayStringFormat();
			var newDate = new Date();
			var oraAttuale = newDate.timeNow();		
			var idenPerUtente = baseUser.IDEN_PER ;

			// modifica 6-10-15
			// controllo se ho richiesto "erogazione in data"
			if (publicRichiestaData==false){
				var myLista = new Array();
				myLista.push(strOggi);
				myLista.push(oraAttuale);
				myLista.push(idenPerUtente);
				myLista.push(idenEsame);
				
				// modifica 6-4-16
				myLista.push(azioneCiclo);				
				// ****
				var stm = top.executeStatement('worklist_main.xml','eseguiEsamePrenotatoCiclo',myLista,0);
				if (stm[0]!="OK"){
					alert("Errore: problemi nel salvataggio dello stato eseguito");
					return;
				}
				else{
					// devo tenere in considerazione le cicliche!!
					cbk_esecuzione_multipla_diretta("");
				}
		
				return;
			}
		}
		else{
			// non posso eseguire prenotazioni
			alert("L'esame deve essere prima accettato per proseguire.");
			return;
		}
	}
	// ********************************
	
	// 30-07-20014
	if (globalSito=="FERRARA"){
		// controllo che non vi siano già prestazioni
		// in data odierna, x lo stesso paziente, che 
		// non siano state annullate. In tal caso NON
		// faccio eseguire l'esame
		/*try{
		var rs =  top.executeQuery('worklist_main.xml','getEsaAnnullati',[stringa_codici(array_iden_anag).split("*")[0],stringa_codici(array_iden_esame).split("*")[0],stringa_codici(array_iden_esame).split("*")[0]]);
		if (rs.next()){
			alert("Attenzione: sono presenti, in data odierna, prestazioni annullate\nper il paziente scelto. Impossibile erogare la prestazione.");
			return;
		}
		}catch(e){alert("controllo getEsaAnnullati, error: " + e.description);}*/
	}
	
	//  modifica aldo 11-6-2014 per ferrara
	if (globalSito=="FERRARA"  && conta_esami_sel()== 1){
		// esami tiro su lista esami stesso reparto
		// accettati non eseguiti dello stesso paziente !
		// stringa_codici(array_iden_esame);
		//alert(stringa_codici(array_iden_esame) + " " + stringa_codici(array_iden_anag).split("*")[0]);
//		alert(stringa_codici(array_iden_esame));
		// ***************************		
		// modifica aldo 6/10/14
		// devo verificare se applicare l'automatismo o meno
		// se data_annulla_ese NON è nulla NON devo applicare automatismo
		var bolAlreadyCanceled = false;
		
		var myRs =  top.executeQuery('worklist_main.xml','isAlreadyCanceled',[stringa_codici(array_iden_esame)]);
		if (myRs.next()){
			bolAlreadyCanceled = myRs.getString("annullato")=="S"?true:false;
		}
	//	alert(bolAlreadyCanceled); return;
		// verificare
		if (!bolAlreadyCanceled){
			// ***************************
			var rs =  top.executeQuery('worklist_main.xml','getEsaDaEseguireFerrara',[stringa_codici(array_iden_esame),stringa_codici(array_iden_esame),stringa_codici(array_iden_esame)]);
			var iden_esami = "";
			if (rs.next()){
				iden_esami = rs.getString("iden_esami");
			}
			else{
				alert("Errore : gli esami sono stati cancellati");
				return;
			}
			if (iden_esami==""){
				alert("Errore: nessun esame da erogare!");
				return;
			}
			// modifica aldo 4-12
			CJsEMEseguiEsame.esecuzione_multipla_diretta(iden_esami,cbk_esecuzione_multipla_diretta);
			/*
			dwr.engine.setAsync(false);
			CJsEMGestioneEsami.esecuzione_multipla_gestione_appropriatezza(iden_esami, cbkesecuzione_multipla_gestione_appropriatezza);
			dwr.engine.setAsync(true);
			*/
			return;
		}
	}
	
	//***************************
	//****** modifica DEMA ******
	//***************************		
	if (globalSito=="SAVONA"){
		try{
			var listaIdenEsamiPerDema = stringa_codici(array_iden_esame).split("*");
			var rsCheckEsameRefertabile;
			var bolCheckDema = true;
			for (var z=0;z<listaIdenEsamiPerDema.length;z++){  
			//var rs = top.executeStatement('worklist_main.xml','checkEsameRefertabile',[stringa_iden_esame],2);
				rsCheckEsameRefertabile = top.executeStatement('worklist_main.xml','checkEsameRefertabile',[listaIdenEsamiPerDema[z]],2);
				if (rsCheckEsameRefertabile[0] == 'KO') { 
					bolCheckDema = false;
					alert('checkEsameRefertabile' + rsCheckEsameRefertabile[1]);
					break; //return;
				}
				if (rsCheckEsameRefertabile[2] == 'KO') { 
					bolCheckDema = false;
					alert(rsCheckEsameRefertabile[3]);
					break; //return;
				}
			}
			if (!bolCheckDema){return;}
		} catch (e) {
			alert("Errore: checkEsameRefertabile");
		}
		// modifica 24-10-16
		try{
			checkErogatiRegione((stringa_codici(array_iden_esame)).replace(/[*]/g, ","));
		}catch(e){
			alert(e.description);
			return;
		}		
		// *****************
		
	}
	//***************************	
	
	// ******************
	var rfid=check_rfid();

        if (rfid!='')
        {
          alert(rfid);
          return;
        }

      if(baseUser.OB_INS_PWD_ESECUZIONE == 'S')
	{
		var ins_pwd = window.open('SL_GestioneUtentePwd?provenienza=ESECUZIONE&login=N&next_function=opener.esegui2()','wndEsec', 'height=250,width=400,scrollbars=no,top=200,left=300');
	}
	else
	{
		c_permissioniEsecuzioneUtente = baseUser.COD_OPE.substring(2,3);
		/*alert('PERMISSIONI UTENTE: ' + baseUser.COD_OPE);
		alert('PERMISSIONI ESECUZIONE (3): ' + c_permissioniEsecuzioneUtente);*/

		if(c_permissioniEsecuzioneUtente != 'X' && c_permissioniEsecuzioneUtente != 'S'){
			alert('Attenzione: permissioni insufficienti');
			return;
		}

		if(!c_sottonumero){
			alert('Attenzione:L \'utente non può eseguire esami che non appartengono ai suoi cdc');
			return;
		}

		esegui2();
	}
}

function esegui2()
{
	elenco_esami = stringa_codici(array_iden_esame);
	//alert('ELENCO ESAMI CON STESSO NUM_PRE: ' + elenco_esami);
	var elenco_anag = stringa_codici(array_iden_anag);
	var elenco_data = stringa_codici(array_data_esame);
	var elenco_num_pre = stringa_codici(array_num_pre);

    try{
		var myeelenco_anag=elenco_anag.replace(/\*/g, ",");
		var myelencoesami=elenco_esami.replace(/\*/g, ",");
		var myelenco_data=elenco_data.replace(/\*/g, "','");
	}
	catch(e){
		var myeelenco_anag=elenco_anag;
		var myelencoesami=elenco_esami;
		var myelenco_data=elenco_data;
	}

    Update_Firmato.GetInfoEsami("Iden_anag in ("+ myeelenco_anag +")  and dataesameiso in ('"+myelenco_data+"') and STATO like '%A %' AND IDEN NOT IN ("+ myelencoesami +")" ,esegui3);
}




function esegui3(var3)
{
	var myObject = new Object();
	myObject.arrRep = var3;

	var reparto=null;
	if (var3 != '')
	{
		reparto=window.showModalDialog('esa_to_esec.html' ,myObject,'center:1;dialogHeight:300px;dialogWidth:900px;status:0');
	}
	// modifica 14-6-16
	if (globalSito=="SAVONA"){	
		var intEst = stringa_codici(array_int_est).toString().split('*')[0];
		var idenEsami = stringa_codici(array_iden_esame);
		
		// ****************
		var bolImpegnativaObbligatoria = false;
		var rs ;
		var listaIdenEsami = idenEsami.split('*');
		for (var z=0;z<listaIdenEsami.length;z++){
			try{rs=top.executeQuery('worklist_main.xml','isImpegnativaObbligatoria',[listaIdenEsami[z]]);}catch(e){alert("Errore isImpegnativaObbligatoria\n" + e.description); }
			if (rs.next()){
				if (rs.getString("esito")=="S"){
					bolImpegnativaObbligatoria = true;
					break;
				}
			}
			else{
				alert("Errore grave: esame cancellato " + listaIdenEsami[z]);
				return;
			}			
		}
		if (bolImpegnativaObbligatoria){		
			if(intEst.substr(0,1).toUpperCase() == 'E' && !stessaImpegnativaPresente())
			{
				scaricoRicettaDaEsami(idenEsami,"E");
				return;
			}
		}
	}
	// *****************

	if(baseGlobal.OB_APPROPRIATEZZA == 'S')
	{
		/*
		Controllo che la gestione delle schede di appropriatezza per l'esecuzione sia attiva.
		Devo controllare anche che TAB_APP_SCHEDE.visualizzazione_esecuzione == 'S' per aprire le schede
		dell'appropriatezza.
		*/
		dwr.engine.setAsync(false);
		CJsEM.check_rows_lock(elenco_esami, cbk_rows_lock);
		dwr.engine.setAsync(true);
	}
	else
	{
		if(baseUser.OB_ESECUZIONE == 'S' && globalSito!="FERRARA")
		{
			//alert(elenco_esami);alert(stringa_codici(array_iden_anag));
			/*Apro SOLO la Scheda Esame.*/
			var win_scheda_esame = window.open('schedaEsame?Hiden_esame='+elenco_esami+'&Hiden_anag='+stringa_codici(array_iden_anag)+'&tipo_registrazione=E','','status=yes,scrollbars=yes,height=800,width=600, top=10, left=10');
		}
		else
		{
			// savona !!!
			/*Esecuzione diretta: no gestione schede appropriatezza no obbligo scheda esame.*/
			// *********************************************	
			// modifica 01-04-2015			
			if (publicRichiestaData){
				$.fancybox({
					'href'			: "richiestaDataErogazione.html?sorgente=worklist&idenEsame="+ elenco_esami+"&callbackFunction=doErogaEsameAfterChooseDate",
					'width'				: '90%',
					'height'			: '90%',
					'autoScale'     	: false,
					'transitionIn'	:	'elastic',
					'transitionOut'	:	'elastic',
					'type'				: 'iframe',
					'showCloseButton'	: false,
					'iframe': {
						preload: false // fixes issue with iframe and IE
					},
					'scrolling'   		: 'yes',
					onStart		:	function() {
						//return window.confirm('Continue?');
					},
					onCancel	:	function() {
						//alert('Canceled!');
					},
					onComplete	:	function() {
						//alert('Completed!');
					},
					onCleanup	:	function() {
						//return window.confirm('Close?');
					},
					onClosed	:	function() {
						try{
							if (bolCallbackDataErogazione){
		//						alert("onclosed di openIdentifyPat , toDoAfter " + toDoAfter);
								/*if (toDoAfter!=""){
									eval (toDoAfter);
								}*/
							}
						}
						catch(e){;}
						finally{
							// resetto valore
							bolCallbackDataErogazione= false;
						}
					}						
				});		
			}			
			else{
				dwr.engine.setAsync(false);
				CJsEMEseguiEsame.esecuzione_multipla_diretta(elenco_esami, cbk_esecuzione_multipla_diretta);
				dwr.engine.setAsync(true);
			}
		}
	}
}


// ***********************
// modifica 14-6-16
// modifica 31-8-16
function esegui4(arrIdenEsami)
{	
	try{
		elenco_esami= arrIdenEsami.toString().replace(/\,/g,'*');
		// ***************
		if(baseGlobal.OB_APPROPRIATEZZA == 'S')
		{
			/*
			Controllo che la gestione delle schede di appropriatezza per l'esecuzione sia attiva.
			Devo controllare anche che TAB_APP_SCHEDE.visualizzazione_esecuzione == 'S' per aprire le schede
			dell'appropriatezza.
			*/
			dwr.engine.setAsync(false);
			CJsEM.check_rows_lock(elenco_esami, cbk_rows_lock2);
			dwr.engine.setAsync(true);
		}
		else
		{
			if(baseUser.OB_ESECUZIONE == 'S' && globalSito!="FERRARA")
			{
				//alert(elenco_esami);alert(stringa_codici(array_iden_anag));
				/*Apro SOLO la Scheda Esame.*/
				var win_scheda_esame = window.open('schedaEsame?Hiden_esame='+elenco_esami+'&Hiden_anag='+stringa_codici(array_iden_anag)+'&tipo_registrazione=E','','status=yes,scrollbars=yes,height=800,width=600, top=10, left=10');
			}
			else
			{
				// savona !!!
				/*Esecuzione diretta: no gestione schede appropriatezza no obbligo scheda esame.*/
				// *********************************************	
				if (publicRichiestaData){
					$.fancybox({
						'href'			: "richiestaDataErogazione.html?sorgente=worklist&idenEsame="+ elenco_esami+"&callbackFunction=doErogaEsameAfterChooseDate",
						'width'				: '90%',
						'height'			: '90%',
						'autoScale'     	: false,
						'transitionIn'	:	'elastic',
						'transitionOut'	:	'elastic',
						'type'				: 'iframe',
						'showCloseButton'	: false,
						'iframe': {
							preload: false // fixes issue with iframe and IE
						},
						'scrolling'   		: 'yes',
						onStart		:	function() {
							//return window.confirm('Continue?');
						},
						onCancel	:	function() {
							//alert('Canceled!');
						},
						onComplete	:	function() {
							//alert('Completed!');
						},
						onCleanup	:	function() {
							//return window.confirm('Close?');
						},
						onClosed	:	function() {
							try{
								if (bolCallbackDataErogazione){
			//						alert("onclosed di openIdentifyPat , toDoAfter " + toDoAfter);
									/*if (toDoAfter!=""){
										eval (toDoAfter);
									}*/
								}
							}
							catch(e){;}
							finally{
								// resetto valore
								bolCallbackDataErogazione= false;
							}
						}						
					});		
				}			
				else{
					dwr.engine.setAsync(false);
					CJsEMEseguiEsame.esecuzione_multipla_diretta(elenco_esami, cbk_esecuzione_multipla_diretta2);
					dwr.engine.setAsync(true);
				}
			}
		}
	}
	catch(e){
		alert("Esegui4 - Error: " + e.description);
	}
}

function cbk_rows_lock2(messaggio)
{
	CJsEM = null;
	var operazione = messaggio.split('@');
	//alert('CJsEM.check_rows_lock: ' + messaggio);
	if(operazione[0] == 'LOCK')
	{
		alert(operazione[1]);
		aggiornaDema();
		return;
	}
	else
	{
		if(operazione[0] == 'N' || operazione[0] == 'NO_SCHEDA_APPR')
		{
			/*TAB_APP_SCHEDE.visualizzazione_esecuzione == 'N' quindi non si gestirà la scheda di appropriatezza.
			Oppure caso in cui non vi è associata nessuna scheda di appropriatezza all'esame(NO_SCHEDA_APPR).
			nel caso in cui web.ob_esecuzione == 'S' si aprirà solo la scheda esame.*/
			alert(operazione[1]);
		}
		/*Creo gli array dell'elenco degli esami e delle schede di appropriatezza(se ci sono)*/
		var elenco_esami = stringa_codici(array_iden_esame);
		//elenco_esami = elenco_esami + '@' + operazione[2];


		dwr.engine.setAsync(false);
		CJsEMGestioneEsami.esecuzione_multipla_gestione_appropriatezza(elenco_esami, cbkesecuzione_multipla_gestione_appropriatezza2);
		dwr.engine.setAsync(true);
	}
}

function cbkesecuzione_multipla_gestione_appropriatezza2(messaggio)
{
	//alert('prova ' + messaggio);
	CJsEMGestioneEsami = null;
	if(messaggio != '')
	{
		alert(messaggio);
		return;
	}
	var iden_paziente = stringa_codici(array_iden_anag);
	var elenco_esami  = stringa_codici(array_iden_esame);

	try{
		iden_paziente = stringa_codici(array_iden_anag).split('*')[0];
	}
	catch(e){
	}

	var finestra = window.open("../../Appropriatezza?provenienza=EM&iden_paz="+iden_paziente+"&iden_esame="+elenco_esami+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");//ESEGUI_ESAME_DA_SCHEDA_APPR
}

function cbk_esecuzione_multipla_diretta2(message)
{
	try{
		CJsEMEseguiEsame = null;
		if(message != '')
			alert(message);
	}
	catch(e){
	}
	finally{
		// update cod_est_esami
		try{
			if (azioneCiclo!=""){
				// ....... update .......
	//			alert("Aggiorno cod_est_esami " + azioneCiclo);
				var lista = new Array();
				var iden_esame = stringa_codici(array_iden_esame).replace(/\*/g, ',');
				lista.push(iden_esame);
				lista.push(azioneCiclo);
				try{
					var out = top.executeStatement('worklist_main.xml','updateStatoCiclo',lista);
					if (out[0] != 'OK') {
						alert("Errore " + out);
					}
				}
				catch(e){
				}
			}
		}
		catch(e){
			alert("Errore upd cod_est_esami" + e.description);
		}
		finally{
			azioneCiclo = "";
			aggiornaDema();
		}
	}	
	
}
// ***************** fine modifica 14-6-16


// *********************************************	
// modifica 01-04-2015

var bolCallbackDataErogazione = false;
var publicDataErogazione = "";
function setDataErogazione(strDate){
	try{
		publicDataErogazione = setDataErogazione;
	}
	catch(e){
		alert("setDataErogazione - Error: " + e.description);
	}	
}

function doErogaEsameAfterChooseDate(idenEsame,strDate, strTime, updateDates){
	try{
//		alert("doErogaEsameAfterChooseDate " + strDate + " , " + strTime);return;
		if (strDate=="" || typeof(strDate)=="undefined"){
			alert("Nessuna data valida selezionata");
			return;
		}
		if (strTime=="" || typeof(strTime)=="undefined"){
			alert("Nessuna ora valida inserita");
			return;
		}		
		// al momento l'ora la cablo, poi cambio interfaccia
//		alert(strDate +" , " + strTime +" , " + baseUser.IDEN_PER+" , " +idenEsame);
		// modifica 6-10-15
		if (controllo_accettato()==false){
			// NON accettato
			// modifica 6-4-16 , aggiunto azioneCiclo nei parametri
			var stm = top.executeStatement('worklist_main.xml','eseguiEsamePrenotatoCiclo',[strDate,strTime,baseUser.IDEN_PER,idenEsame,azioneCiclo],0);
			// ***
			if (stm[0]!="OK"){
				alert("Errore: problemi nel salvataggio dello stato eseguito");
				return false;
			}
			else{
				aggiorna();
			}
		}
		else{
			dwr.engine.setAsync(false);
			CJsEMEseguiEsame.esecuzione_multipla_diretta(elenco_esami, function(message){
				if(message == '' && updateDates){
					try{
						try{var out = top.executeStatement('worklist_main.xml','updateDataOraErogazioneDifferita',[idenEsame.replace(/\*/g, ','),strDate,strTime]);}catch(e){alert("errore in updateDataOraErogazioneDifferita\n" + e.description); }
						if (out[0] != 'OK') {
							alert("Errore " + out);
						}
					}
					catch(e){
					}				
					
				}
				cbk_esecuzione_multipla_diretta(message);
			});
			dwr.engine.setAsync(true);	
		}
	}
	catch(e){
		alert("doErogaEsameAfterChooseDate - Error: " + e.description);
	}
}
// *********************************************

/*
 La gestione degli errori è gestita con il log nel db.
 @param messaggio contiene:
 	1° valore = NO_SCHEDA_APPR:(quando l'esame non è associato a nessuna scheda di appropriatezza TAB_ESA.cod_scheda = null);
				N: quando TAB_APP_SCHEDE.visualizzazione_esecuzione == 'N' in esecuzione non verrà aperta la scheda appropriatezza;					                ESEGUI: quando si deve aprire in esecuzione la scheda esame.
				LOCK: quando in ROWS_LOCK vi è un record per la scheda di appropriatezza aperta.
	2° valore = contiene la stinga dell'alert; vuota nel caso in cui il primo valore = ESEGUI.
	3° valore = contiene l'iden_esame degli esami selezionati dalla worklist che non hanno la scheda di appropriatezza
				o che non deve essere visualizzata in esecuzione.

*/
function cbk_rows_lock(messaggio)
{
	CJsEM = null;
	var operazione = messaggio.split('@');
	//alert('CJsEM.check_rows_lock: ' + messaggio);
	if(operazione[0] == 'LOCK')
	{
		alert(operazione[1]);
		aggiorna();
		return;
	}
	else
	{
		if(operazione[0] == 'N' || operazione[0] == 'NO_SCHEDA_APPR')
		{
			/*TAB_APP_SCHEDE.visualizzazione_esecuzione == 'N' quindi non si gestirà la scheda di appropriatezza.
			Oppure caso in cui non vi è associata nessuna scheda di appropriatezza all'esame(NO_SCHEDA_APPR).
			nel caso in cui web.ob_esecuzione == 'S' si aprirà solo la scheda esame.*/
			alert(operazione[1]);
		}
		/*Creo gli array dell'elenco degli esami e delle schede di appropriatezza(se ci sono)*/
		var elenco_esami = stringa_codici(array_iden_esame);
		//elenco_esami = elenco_esami + '@' + operazione[2];


		dwr.engine.setAsync(false);
		CJsEMGestioneEsami.esecuzione_multipla_gestione_appropriatezza(elenco_esami, cbkesecuzione_multipla_gestione_appropriatezza);
		dwr.engine.setAsync(true);
	}
}


function cbkesecuzione_multipla_gestione_appropriatezza(messaggio)
{
	//alert('prova ' + messaggio);
	CJsEMGestioneEsami = null;
	if(messaggio != '')
	{
		alert(messaggio);
		return;
	}
	var iden_paziente = stringa_codici(array_iden_anag);
	var elenco_esami  = stringa_codici(array_iden_esame);

	try{
		iden_paziente = stringa_codici(array_iden_anag).split('*')[0];
	}
	catch(e){
	}

	var finestra = window.open("Appropriatezza?provenienza=EM&iden_paz="+iden_paziente+"&iden_esame="+elenco_esami+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");//ESEGUI_ESAME_DA_SCHEDA_APPR
}


/*
Funzione di callback per la gestione dell'esecuzione multipla DIRETTA.
Senza schede appropriatezza nè schede esame.
*/
function cbk_esecuzione_multipla_diretta(message)
{
	try{
		CJsEMEseguiEsame = null;
		if(message != '')
			alert(message);

	}
	catch(e){
	}
	finally{
		// update cod_est_esami
		try{
			if (azioneCiclo!=""){
				// ....... update .......
	//			alert("Aggiorno cod_est_esami " + azioneCiclo);
				var lista = new Array();
				var iden_esame = stringa_codici(array_iden_esame).replace(/\*/g, ',');
				lista.push(iden_esame);
				lista.push(azioneCiclo);
				try{
					var out = top.executeStatement('worklist_main.xml','updateStatoCiclo',lista);
					if (out[0] != 'OK') {
						alert("Errore " + out);
					}
				}
				catch(e){
				}
			}
		}
		catch(e){
			alert("Errore upd cod_est_esami" + e.description);
		}
		finally{
			azioneCiclo = "";
			aggiorna();
		}
	}
}



/*
	Controllo che tutti gli esami selezionati abbiano lo stesso NUM_PRE
*/
function controllo_num_pre()
{
	var ok = true;
	var elenco_num_pre = stringa_codici(array_num_pre);

	//alert('ELENCO NUM_PRE: ' + elenco_num_pre);

	var num_pre = '';
	try{
		num_pre = elenco_num_pre.split('*');
	}
	catch(e)
	{
		num_pre = elenco_num_pre;
	}

	for(i = 1; i < num_pre.length; i++)
	{
		if(num_pre[0] != num_pre[i])
		{
			i = num_pre.length;
			ok = false;
		}
	}
	return ok;
}


/*
	Funzione che controlla che gli esami selezionati siano accettati
	e non ancora eseguiti.
*/
function controllo_accettato_eseguito()
{
	var ok = true;
	var accettati = stringa_codici(array_accettato);
	var eseguiti  = stringa_codici(array_eseguito);


	var elenco_accettati = '';
	var elenco_eseguiti = '';
	try{
		elenco_accettati = accettati.split('*');
		elenco_eseguiti  = eseguiti.split('*');
	}
	catch(e)
	{
		elenco_accettati = accettati;
		elenco_eseguiti  = eseguiti.split('*');
	}

	for(i = 0; i < elenco_accettati.length; i++)
	{
		if(elenco_accettati[i] == '0' || elenco_eseguiti[i] == '1')
		{
			ok = false;
		}
	}
	return ok;
}

function controllo_accettato()
{
	var ok = true;
	var accettati = stringa_codici(array_accettato);

	var elenco_accettati = '';

	try{
		elenco_accettati = accettati.split('*');
	}
	catch(e)
	{
		elenco_accettati = accettati;
	}

	for(i = 0; i < elenco_accettati.length; i++)
	{
		if(elenco_accettati[i] == '0')
		{
			ok = false;
		}
	}
	return ok;
}

function controllo_eseguito()
{
	var ok = true;
	var eseguiti  = stringa_codici(array_eseguito);


	var elenco_eseguiti = '';
	try{
		elenco_eseguiti  = eseguiti.split('*');
	}
	catch(e)
	{
		elenco_eseguiti  = eseguiti.split('*');
	}

	for(i = 0; i < elenco_eseguiti.length; i++)
	{
		if(elenco_eseguiti[i] == '1')
		{
			ok = false;
		}
	}
	return ok;
}


/*
	Controllo sul CENTRO DI COSTO.
    v_globali.SEPARASOTTONUMERI indica se l'utente può agire o meno su esami
    che non sono del suo centro di costo (WEB_CDC).
    v_globali.SEPARASOTTONUMERI == 'S' possibilità di eseguire esami di un altro centro di costo;
	v_globali.SEPARASOTTONUMERI == 'N' : l'utente loggato non può effettuare l'esecuzione di un esame non appartenente
    								     ai suoi centri di costo attivi(WEB_CDC)
	In Gestione Parametri Procedure la voce è: Parametri Gestione CDC
	'Disabilita le modifiche su esami inseriti da utenti o PC con cdc diverso'
*/
function controllo_separasottonumeri()
{
	var ok = false;
	if(baseGlobal.SEPARASOTTONUMERI == 'S')
	{
		ok = true;
	}
	else
	{
		var reparti = stringa_codici(array_reparto);
		var elenco_reparti = '';
		try{
			elenco_reparti = reparti.split('*');
		}
		catch(e)
		{
			elenco_reparti = reparti;
		}

		for(y = 0; y < elenco_reparti.length; y++)
		{
			for(i = 0; i < baseUser.LISTAREPARTI.length; i++)
			{
				//alert('REP SEL: ' + reparto[y] + '  MIO REP: ' + baseUser.LISTAREPARTI[i]);
				if(elenco_reparti[y].toString() == baseUser.LISTAREPARTI[i].toString())
				{
					ok = true;
				}
			}
			if(!ok)
			{
				return;
			}
		}
	}//else

	return ok;

}//fine


/**
	Verifico:
	- controllo delle permissioni dell'esecuzione
	- ESAMI.eseguito = '1'
	- ESAMI.fine_esecuzione = '0'
	- ESAMI.ute_ese = ESAMI.ute_fin_ese altrimenti chiedo conferma

function fine_esecuzione()
{
	var recordSelezionati = null;
	var esameEseguito = null;
	var esameFineEsecuzione = null;
	var uteEseguito = null;
	var uteFineEseguito = null;
	var esame = null;
	var iden_anag = null;


	recordSelezionati = conta_esami_sel();
	if (recordSelezionati == 0 || recordSelezionati > 1)
	{
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}

	//Controllo se il paziente è READONLY
	iden_anag = stringa_codici(array_iden_anag);

	if(isLockPage('ANAGRAFICA', iden_anag, 'ANAG'))
	{
		alert(ritornaJsMsg('a_readonly'));//Attenzione, il paziente selezionato è di sola lettura
		return;
	}

	esameEseguito = stringa_codici(array_eseguito);
	esameFineEsecuzione = stringa_codici(array_fine_esecuzione);
	uteEseguito = stringa_codici(array_ute_ese);
	uteFineEseguito = baseUser.IDEN_PER;
	esame = stringa_codici(array_iden_esame);

	//alert('PERMISSIONI UTENTE: ' + baseUser.COD_OPE);
	//alert('PERMISSIONI ESECUZIONE (3): ' + baseUser.COD_OPE.substring(2,3));
	//alert('ESAMI.eseguito: ' + esameEseguito);
	//alert('ESAMI.fine_esecuzione: ' + esameFineEsecuzione);
	//alert('ESAMI.ute_ese: ' + uteEseguito);
	//alert('ESAMI.UTE_FINE_ES: ' + uteFineEseguito);


	if(baseUser.COD_OPE.substring(2,3) != 'X' && baseUser.COD_OPE.substring(2,3) != 'S'){
		alert('Attenzione: permissioni insufficienti');
		return;
	}

	if(esameEseguito != '1' || esameFineEsecuzione != '0'){
		alert("Attenzione: l'esecuzione dell'esame deve essere iniziate e non ancora terminata");
		return;
	}

	if(uteEseguito != uteFineEseguito){
		var avanti = confirm('Attenzione il tecnico che ha dato INIZIO ESECUZIONE è diverso dal tecnico che sta dando FINE ESECUZIONE.');

		if(avanti == true){
			CJsEM.settaFineEsecuzione(esame, cbk_fine_esecuzione);
		}
		else
			aggiorna();
	}
	else
		CJsEM.settaFineEsecuzione(esame, cbk_fine_esecuzione);
}
*/


/**
	Verifico:
	- controllo delle permissioni dell'esecuzione
	- ESAMI.eseguito = '1'
	- ESAMI.fine_esecuzione = '0'
	- ESAMI.ute_ese = ESAMI.ute_fin_ese altrimenti chiedo conferma

	Fine esecuzione con possibilità di selezionare più esami
*/

function fine_esecuzione()
{
	var recordSelezionati = null;
	var esameEseguito = null;
	var esameFineEsecuzione = null;
	var uteEseguito = null;
	var uteFineEseguito = null;
	var esame = null;
	var iden_anag = null;


	recordSelezionati = conta_esami_sel();
	if(recordSelezionati == 0)
	{
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}

	//Controllo se il paziente è READONLY
	try{
		iden_anag = stringa_codici(array_iden_anag).split('*')[0];
	}
	catch(e){
		iden_anag = stringa_codici(array_iden_anag);
	}

	if(isLockPage('ANAGRAFICA', iden_anag, 'ANAG'))
	{
		alert(ritornaJsMsg('a_readonly'));//Attenzione, il paziente selezionato è di sola lettura
		return;
	}

	esameEseguito = stringa_codici(array_eseguito);
	uteEseguito = stringa_codici(array_ute_ese);
	uteFineEseguito = baseUser.IDEN_PER;
	esame = stringa_codici(array_iden_esame);

	/*alert('PERMISSIONI UTENTE: ' + baseUser.COD_OPE);
	alert('PERMISSIONI ESECUZIONE (3): ' + baseUser.COD_OPE.substring(2,3));
	alert('ESAMI.eseguito: ' + esameEseguito);
	alert('ESAMI.ute_ese: ' + uteEseguito);
	alert('ESAMI.UTE_FINE_ES: ' + uteFineEseguito);*/
	
	

	if(baseUser.COD_OPE.substring(2,3) != 'X' && baseUser.COD_OPE.substring(2,3) != 'S'){
		alert('Attenzione: permissioni insufficienti');
		return;
	}

	try{
		//CASO DI FINE ESECUZIONE MULTIPLA
		esameEseguito = esameEseguito.split("*");
		esameFineEsecuzione = stringa_codici(array_fine_esecuzione);
		esameFineEsecuzione = esameFineEsecuzione.split("*");

		//alert('ESAMI.fine_esecuzione: ' + esameFineEsecuzione);
		//alert(esameEseguito.length);
		//alert(esameEseguito[0]);
		//alert(esameFineEsecuzione[0]);
		// ******************************
		// TEST --- da togliere
		//alert(stringa_codici(array_contextmenu));
		// ******************************
		for(i = 0; i < esameEseguito.length; i++){
			if(esameEseguito[i] != '1' || esameFineEsecuzione[i] != '0'){
				alert("Attenzione: l'esecuzione dell'esame deve essere iniziate e non ancora terminata");
				i = esameEseguito.length;
				return;
			}
		}


		var uteEseDiverso = false;
		uteEseguito = uteEseguito.split("*");

		for(i = 0; i < uteEseguito.length; i++){
			if(uteEseguito[i] != uteFineEseguito){
				uteEseDiverso = true;
				i = uteEseguito.length;
			}
		}

		if(uteEseDiverso == true){
			var avanti = confirm('Attenzione il tecnico che ha dato INIZIO ESECUZIONE è diverso dal tecnico che sta dando FINE ESECUZIONE.');
				if(avanti == true){
					dwr.engine.setAsync(false);
					CJsEM.settaFineEsecuzione(esame.replace(/\*/g, ','), cbk_fine_esecuzione);
					dwr.engine.setAsync(true);
				}
				else
					aggiorna();
			}
			else{
				dwr.engine.setAsync(false);
				CJsEM.settaFineEsecuzione(esame.replace(/\*/g, ','), cbk_fine_esecuzione);
				dwr.engine.setAsync(true);
			}
	}
	catch(e){
		//CASO DI FINE ESECUZIONE SINGOLA
		esameEseguito = stringa_codici(array_eseguito);
		esameFineEsecuzione = stringa_codici(array_fine_esecuzione);
		if(esameEseguito != '1' || esameFineEsecuzione != '0'){
			alert("Attenzione: l'esecuzione dell'esame deve essere iniziate e non ancora terminata");
			return;
		}

		var avanti = null;

		if(uteEseguito != uteFineEseguito){
			avanti = confirm('Attenzione il tecnico che ha dato INIZIO ESECUZIONE è diverso dal tecnico che sta dando FINE ESECUZIONE.');

			if(avanti == true){
				dwr.engine.setAsync(false);
				CJsEM.settaFineEsecuzione(esame, cbk_fine_esecuzione);
				dwr.engine.setAsync(true);
			}
			else
				aggiorna();
		}
		else{
			dwr.engine.setAsync(false);
			CJsEM.settaFineEsecuzione(esame, cbk_fine_esecuzione);
			dwr.engine.setAsync(true);
		}
	}
}


/**
*/
function cbk_fine_esecuzione(message)
{
	CJsEM = null;
	if(message != ''){
		alert(message);
		return;
	}
	else
		aggiorna();
}

function check_rfid()
{
var ritRfid='';
var checkRfid=stringa_codici(array_val_rfid)
if (checkRfid=='KO')
{
  ritRfid='Impossibile continuare occorre verificare il codice Rfid';
}
if (checkRfid=='SI')
{
  ritRfid='Impossibile continuare occorre verificare il codice Rfid';
}

return ritRfid;
}


// modifica 6-4-16
function inizioCiclo(){
	try{
		azioneCiclo = costInizioCiclo;		
		esegui();
	}
	catch(e){
		alert("inizioCiclo - Error: " + e.description);
	}
}

// modifica 21-10-16
function fineCiclo(){
	try{
		// ATTTENZIONE, Sergio deve creare un campo indicante se è stato erogato in regione o meno
		// se erogato NON dovrà esser possibile fare + nulla sulle cicliche esterne !!!!
		
		// COD10
		// contaPrestazioni_ErogateFineCiclo
		// worklist_main.xml
		// partendo dall'esame devo verificare se esistono, a parita'
		// impegnativa / id_gruppo_ciclica gia' dei fine ciclo
		// TBD
		// modifica 24-10-16
		var bolExecutable = false;
		var bolImpegnativaDaCompilare = false;
		// il controllo è fattibile una prestazione alla volta: non posso dare fine ciclo ad entrambe
		if (conta_esami_sel()>1){
			alert("Impossibile continuare: prego effettuare una sola selezione");
			return;
		}					
		var idenEsame = stringa_codici(array_iden_esame).split("*")[0];
		var rs ;
		try{
			rs=top.executeQuery('worklist_main.xml','getNumImpRich',[idenEsame]);
			if (rs.next()){
				var NUMIMP_NUMRICH = rs.getString("NUMIMP_NUMRICH");
				var INT_EST = rs.getString("INT_EST");			
				if (rs.getString("IDEN_TICK")!="107"){
					if ((rs.getString("NUMIMP_NUMRICH")=="")&&(rs.getString("INT_EST")=="E")){
						// casi extra LEA
						var arrProvenienza = stringa_codici(array_provenienza).toString().split('*');				
						// 2872 ESTERNI EXTRA LEA, 4492 ESTERNO ACCESSO DIRETTO
						if (jQuery.inArray( "2872", arrProvenienza) == -1 && jQuery.inArray( "4492", arrProvenienza) == -1 && top.home.getConfigParam("SITO")=="SAVONA"){
							bolImpegnativaDaCompilare=true;
						}
						// ***********
					}
				}	
				if (bolImpegnativaDaCompilare){
					alert("Impossibile eseguire l'esame: impegnativa non compilata.");
					return;
				}else{
					// impegnativa NON obbligatoria
					if (NUMIMP_NUMRICH!=""){
						rs=top.executeQuery('worklist_main.xml','contaPrestazioni_ErogateFineCiclo',[idenEsame,idenEsame]);
						if (rs.next()){
							if (parseInt(rs.getString("esito"))>0){
								// gia eseguito
								bolExecutable = false;
							}
							else{
								bolExecutable = true;
							}
						}else{
							// grave
							alert("Errore grave: esame cancellato, id: " + idenEsame);
							bolExecutable = false;
						}
					}else{
						bolExecutable = true;
					}
				}
			}
		}catch(e){alert("Errore getNumImpRich\n" + e.description); }
		if (!bolExecutable){
			alert("Impossibile proseguire: e' gia presente una prestazione di fine ciclo per questa impegnativa / ciclica!");
			return;
		}
		//*********************
		azioneCiclo = costFineCiclo;		
		esegui();
	}
	catch(e){
		alert("fineCiclo - Error: " + e.description);
	}
}
// **** fine modifica 6-4-16

// **********************************************
// **************** modifica 13-11-2014
// **********************************************
function commutaStatoCiclo(){
	var bolEseguito = false;
	var iden = "";
	var bolSetFineCiclo = false;
	var bolErogatoRegione = false;
	try{
		try{
			// permetto lo switch di un esame alla volta
			if (conta_esami_sel()>1){
				alert("Impossibile continuare: prego effettuare una sola selezione");
				return;
			}
			iden = stringa_codici(array_iden_esame);
			bolEseguito = isBeenExecuted(iden);
			if 	(!bolEseguito){
				alert("L'esame non è stato ancora erogato. Impossibile continuare");
				return;
			}			
			try{
				// **********************************
				// modifica 24-10-16
				rs=top.executeQuery('worklist_main.xml','getStatoCiclo',[iden]);
				if (rs.next()){		
					/*				
					if (rs.getString("COD10") == costInizioCiclo){
						// si sta cercando di settare il fine ciclo !
						bolSetFineCiclo = true;
					}else{
						bolSetFineCiclo = false;							
					}*/
					bolSetFineCiclo = (rs.getString("COD10") == costInizioCiclo);
					bolErogatoRegione = (rs.getString("INVIO_EROGAZIONE")!="");
				}else{
					// grave
					alert("Errore grave: esame cancellato, id: " + idenEsame);
					return;						
				}
				if (bolErogatoRegione){
					alert("Impossibile proseguire: la prestazione \u00E8 stata gi\u00E0 erogata al ministero !");
					return;
				}
				if (bolSetFineCiclo){
					rs=top.executeQuery('worklist_main.xml','contaPrestazioni_ErogateFineCiclo',[iden,iden]);
					if (rs.next()){
						if (parseInt(rs.getString("esito"))>0){
							// gia eseguito
							alert("Impossibile proseguire: e' gia presente una prestazione di fine ciclo per questa impegnativa / ciclica!");
							return;
						}
					}else{
						// grave
						alert("Errore grave: esame cancellato, id: " + idenEsame);
						return;
					}	
				}
				
				
				// **********************************				
				if(!confirm("Si vuole procedere con il cambio stato?")){return;}
				var out = top.executeStatement('worklist_main.xml','switchStatoCiclo',[iden]);
				if (out[0] != 'OK') {
					alert("Errore " + out);
				}
				else{
					try{aggiorna();}catch(e){;}
				}
			}
			catch(e){;}
		}
		catch(e){
			alert("Impossibile verificare se la prestazione " + iden + " e' stata erogata.");
			return;
		}
	}
	catch(e){
		alert("commutaStatoCiclo - Error: " + e.description);
	}		
}
// **********************************************





