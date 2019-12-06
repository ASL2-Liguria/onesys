 var  _filtro_list = null;
 var  _filtro_list_sel = null;
 var dataAppuntamento = '';
 var WindowCartella = null;
 
 jQuery(document).ready(function(){
     window.WindowCartella = window;
     while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
         window.WindowCartella = window.WindowCartella.parent;
     }
     window.baseReparti = WindowCartella.baseReparti;
     window.baseGlobal = WindowCartella.baseGlobal;
     window.basePC = WindowCartella.basePC;
     window.baseUser = WindowCartella.baseUser;
		
		caricamento(_STATO_PAGINA);
		
		switch (_STATO_PAGINA){
			
			// INSERIMENTO ////////////////////////////////
			case 'I':
				
				//ONLOAD  body
				valorizzaMed();
				cambiaPulsante();
				nascondiCampi();
				
				//var x=document.getElementById("cmbStatoPaziente");x.options[x.selectedIndex].text=document.all.HcmbStatoPaz.value;
				
				if(typeof document.EXTERN.URGENZA != 'undefined'){
					setUrgenzaScheda();
				}else{
					document.all.hUrgenza.value = '0';
					setUrgenza();
				}
				
			break;
			
			// LETTURA ////////////////////////////////
			case 'L':
				
				//ONLOAD  body
				valorizzaMed();
				setUrgenzaScheda();
				cambiaPulsante();
				document.all['lblRegistra'].parentElement.parentElement.style.display = 'none';
				if(document.EXTERN.LETTURA.value== 'S'){
					HideLayer('groupUrgenzaLabo');
				}
				
			break;
		}
});
 

 function caricamento(){
	 
	 document.getElementById('lblTitleUrgenza').innerText = 'Grado urgenza';

	//funzione che carica la data proposta se arriva in input	
		if(statoPagina == 'I'){
			caricaDataOraInput();
		}
	 
	 // GESTIONE EVENTUALE DEI CAMPI DSA OBBLIGATORI COME CARDIO_DAYSERVICCE
	 	if (parent.document.getElementById('hIntEst').value =='E' ){

		obbligaCampo(document.getElementById('txtNumImp'), document.getElementById('lblNumImp'));
		obbligaCampo(document.getElementById('cmbTicket'), document.getElementById('lblTicket'));
		obbligaCampo(document.getElementById('txtDataRicetta'), document.getElementById('lblDataRicetta'));
		obbligaCampo(document.getElementById('txtQuesito'), document.getElementById('lblQuesito'));

	}else{
		
		obbligaCampo(document.getElementById('txtMedPrescr'), document.getElementById('lblMedPrescr'));
	}
	 	
	 try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
 }
 
 
//funzione che in caso di ricovero DSA valorizza il combo  dello stato del paziente
 function controllaDSA(){
 	
 	try{
 		var combo = document.getElementById('cmbStatoPaziente');
 		
 		if (parent.parent.document.EXTERN.ricovero.value.substring(0,3)=='DSA'){
 			//alert('entro');

 			for (var i=0;i<combo.options.length;i++){
 				
 				if (combo.options[i].text=='D.S.A.'){
 						combo.options[i].selected=true;
 				}
 			}
 		}
 	}catch(e){}
 }


//Funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico 
function valorizzaMed(){
	
	//alert (baseUser.TIPO);
	
	
	if (document.EXTERN.LETTURA.value != 'S') {
	
		if (baseUser.TIPO == 'M'){
		
			document.dati.Hiden_MedPrescr.value = baseUser.IDEN_PER; 
			document.dati.txtMedPrescr.value = baseUser.DESCRIPTION;
			document.dati.Hiden_op_rich.value = baseUser.IDEN_PER; 
			document.dati.txtOpRich.value = baseUser.DESCRIPTION;
			jQuery('#txtMedPrescr').attr("readOnly",true);

		}else{
		
			document.dati.Hiden_op_rich.value = baseUser.IDEN_PER; 
			document.dati.txtOpRich.value = baseUser.DESCRIPTION;	
		}
	}
			
	if (typeof document.EXTERN.Hiden_pro != 'undefined'){	
	
		document.dati.Hiden_pro.value = document.EXTERN.Hiden_pro.value;
	}
}

//funzione che modifica la label del div a seconda del grado dell'urgenza
function setUrgenza(){
	
	var urgenza = document.all.hUrgenza.value;

	//controllo se la pagina è in modalità di inserimento
	if (_STATO_PAGINA != 'L'){
		
	switch(urgenza)
	{
		// Non urgente
		case '0':
			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' ROUTINE    ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'routine');
			break;
		
		// Urgenza
		case '2':
			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' URGENZA    ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'urgenza');
			break;

	}
	
	return;
	
	}else{
	
		alert ('Impossibile modificare il grado di urgenza in modalità visualizzazione');
	
	}
	
}

function scegli_prestazioni(){
	
	var url = null;
	var popup = null;
	var esaMetodica='';
	var esami='';

	for(var i = 0; i < document.dati.cmbPrestRich.length; i++){
			
		esaMetodica = document.dati.cmbPrestRich[i].text;
		//alert (esaMetodica);

		if (esami != ''){
			esami += ',';
		}
			
		esami += "'"+esaMetodica+"'";
		//alert(esami)
	}
		
	//alert(esami);
	
	if (document.EXTERN.LETTURA.value != "S"){
	
		url = 'servletGenerator?KEY_LEGAME=SCELTA_ESAMI';
		url += '&CDC_DESTINATARIO=' + document.EXTERN.DESTINATARIO.value;
		url += '&SITO=' + document.EXTERN.DESTINATARIO.value;
		url += '&ESAMI='+esami;
		url += '&REPARTO_RICHIEDENTE=' + document.EXTERN.HrepartoRicovero.value;
		url += '&TIPO=R';
		url += '&URGENZA=' + document.all.hUrgenza.value;	
	
		popup = window.open(url, "", "status = yes, scrollbars = yes");
		if(popup){
			popup.focus();
		}else{
			popup = window.open(url, "", "status = yes, scrollbars = yes");
		}
		try{
			WindowCartella.opener.top.closeWhale.pushFinestraInArray(popup);
		}catch(e){
			
		}
		
	}
}

function apriControindicazioni(){
	
	var doc = document.dati;
	var controind = '';
	//var idenVisita = '';
	var idenAnag = '';
	
	doc.Hiden_controindicazioni.value = genera_stringa_codici(doc.cmbControindicazioni, ",");
	controind = doc.Hiden_controindicazioni.value;
	//idenVisita = document.EXTERN.Hiden_visita.value;
	idenAnag = document.EXTERN.Hiden_anag.value;
	
	if(controind == ''){
		controind = '-1';
	}
   	
	where_condition_sx = " iden_anag="+idenAnag+" and iden not in ("+ controind +") and superato_lineare = 'N' and descrizione_lineare is not null ";
	where_condition_dx = " iden in ("+ controind +") and superato_lineare = 'N' and descrizione_lineare is not null ";
	
	//alert(where_condition_sx);
	//alert(where_condition_dx);
	
	var servlet = 'SL_Scelta?where_condition_sx='+where_condition_sx+'&where_condition_dx='+where_condition_dx;
	servlet += '&table=radsql.VIEW_CC_ALLERTE_RICOVERO&ltitle=lblCntInd&campo_descr=cmbControindicazioni&campo_iden=Hcontroindicazioni';
	servlet += '&elencoCampiSelect=iden@descrizione_lineare';
	
	var popup = window.open(servlet,'','width=500,height=600, resizable = yes, status=yes, top=10,left=10');
	try{
		WindowCartella.opener.top.closeWhale.pushFinestraInArray(popup);
	}catch(e){
		
	}
	
}

/**
*/
function genera_stringa_codici(sel, carattere){
	
	//alert(sel + '\n ' + carattere);
	var idx;
	var ret = '';
	
	for(idx = 0; idx < sel.length; idx++){
		
		if(ret != ''){
			ret += carattere; //'*';
		}
		ret += sel[idx].value;
	}
	
	return ret;
}

/**
*/
//funzione che 'prepara' i dati e valorizza i campi nascosti per il salvataggio. Alla fine lancia registra()
function preSalvataggio(){
	
	var controindicazioni = '';
	var esami = '';
	var metodiche = '';
	var esaMetodica = '';
	var doc = document.dati;
	
	if (document.all.hUrgenza.value == ''){

			alert ('scegliere Urgenza');
			return;
		}

		
		for(var i = 0; i < doc.cmbControindicazioni.length; i++){
			
			if(doc.cmbControindicazioni.length-1 == i)
				controindicazioni += doc.cmbControindicazioni[i].value;
			else
				controindicazioni += doc.cmbControindicazioni[i].value + ',';
		}

		doc.Hiden_controindicazioni.value = controindicazioni;
			
		for(i = 0; i < doc.cmbPrestRich.length; i++){
			
			esaMetodica = doc.cmbPrestRich[i].value.split('@');

			if(esami != ''){
				
				esami += '#';
				metodiche += '#';
			}
			
			esami += esaMetodica[0];
			metodiche += esaMetodica[1];
			
//			alert(esaMetodica[0]+'/n'+esaMetodica[1]);
		}
		
		doc.HelencoEsami.value ='';
		doc.HelencoEsami.value = esami;
		doc.HelencoMetodiche.value = metodiche;
		
		if (document.EXTERN.LETTURA.value == 'N'){			
		
			doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
		}
			
		if (doc.HelencoEsami.value == ''){
		
			alert ('scegliere prestazioni');
			return;
		}
		
		try{
			document.EXTERN.IDEN.value='';
		}catch(e){}
	if (baseUser.LOGIN == 'lucas'){
		
		var debug = 'IDEN: ' + doc.Hiden.value;
		debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
		//debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
		debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
		debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
		debug += '\nCONTROINDICAZIONI: ' + doc.Hiden_controindicazioni.value;
		debug += '\nESAMI: ' + doc.HelencoEsami.value;
		debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
		debug += '\nURGENZA: ' + doc.hUrgenza.value;
		//debug += '\nQUADROCLICNICO: ' + doc.txtQuadroClinico.value;
		debug += '\nNOTE: ' + doc.txtNote.value;
		debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
		debug += '\nQUESITO: ' + doc.txtQuesito.value;
		debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;
		debug += '\nNUM IMPEGNATIVA: ' + doc.txtNumImp.value;
	  	debug += '\nONERE: ' + doc.txtOnere.value;
		debug += '\nTICKET: ' + doc.cmbTicket.value;
		debug += '\nCOD_ESENZIONE: ' + doc.HcodEsenzione.value;
		debug += '\nRICETTA: ' + doc.Hricetta.value;
		debug += '\nTIPO RICETTA: ' + doc.cmbTipoRicetta.value;
		debug += '\nMOD_ACCESSO: ' + doc.Hiden_op_rich.value;
		debug += '\nMOD_PRESCRITTIVA: ' + doc.cmbModPrescr.value;
		debug += '\nCODICE DSA: ' + doc.txtCodDSA.value;
		debug += '\nTIPO DSA: ' + doc.cmbTipoDSA.value;
		debug += '\nDataRicetta: ' + doc.txtDataRicetta.value;
		//debug += '\nDataProposta: ' + doc.txtDataProposta.value;
		debug += '\nClasse Priorita Prest: ' + doc.cmbClassePriorita.value;
		debug += '\nGaranzia Tempi Att: ' + doc.HgaranziaTempiAtt.value;
		debug += '\nPrestazioni Primo Acc: ' + doc.HprestPrimoAcc.value;


		alert(debug);
	}
	
	registraScheda();
}

/**
*/
function chiudi(){
	//alert(parent.name);
	
	if (documentEXTERN.LETTURA.value == 'S') {
	
		self.close();
		
	}else{
			
		if(parent.name == 'WHALE_winVisRich'){	
			parent.opener.aggiorna();
		}
	}
}

//funziona che modifica la label in modalità visualizzazione/modifica
function setUrgenzaScheda(){
	
		var urgenza = document.EXTERN.URGENZA.value;

	    document.all.hUrgenza.value = urgenza;
		
		switch(urgenza){
		
			// Non urgente
			case '0':
				document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' ROUTINE    ';
				document.all.lblTitleUrgenza.className = '';
				addClass(document.all.lblTitleUrgenza,'routine');
				break;

			// Urgenza
			case '2':
				document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' URGENZA    ';
				document.all.lblTitleUrgenza.className = '';
				addClass(document.all.lblTitleUrgenza,'urgenza');
				break;

		}
}


//funzione che impedisce il salvataggio in modalità visualizzazione
function registraScheda(){
	
//	alert (document.EXTERN.LETTURA.value);

	if (document.EXTERN.LETTURA.value == 'S'){
		
		alert ('Impossibile salvare in modalità VISUALIZZAZIONE');
		return;
		
	}else{
	
		registra();
	}
}


function stampa_scheda_richiesta(){
	
	/*var sf= '{TESTATA_RICHIESTE.IDEN}='+document.EXTERN.KEY_ID.value;
	var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_RADIO_INT_0&stampaReparto=RICHIESTA_GENERICA_RADIO_INT&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra){	
		finestra.focus();
	}else{
		finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_RADIO_INT_0&stampaReparto=RICHIESTA_GENERICA_RADIO_INT&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}*/
	//alert ('1.entro funzione');

	var sf;
	var funzione;
	var reparto;
	var anteprima;
	var idRichiesta='';
	var stampante = null;
	
	var keyLegame       	= document.EXTERN.KEY_LEGAME.value;
	var versione        	  	= document.EXTERN.VERSIONE.value;
	var cdcDestinatario  	= document.EXTERN.DESTINATARIO.value;	

	if (document.EXTERN.LETTURA.value == 'N'){
	
		//alert (document.EXTERN.ID_STAMPA.value);
		idRichiesta = document.EXTERN.ID_STAMPA.value;
		//alert(idRichiesta);
		
		if (idRichiesta == ""){
			alert ('Salvataggio non effettuato');
			return;
			}
	}
	
	if (document.EXTERN.LETTURA.value == 'S'){
	
		//alert(document.EXTERN.KEY_ID.value);
		idRichiesta = document.EXTERN.KEY_ID.value;
		//alert (idRichiesta);
	}

	//sf= "{TESTATA_RICHIESTE.IDEN}="+idRichiesta;
	sf= "{VIEW_VIS_RICHIESTA_REPORT.IDEN}="+idRichiesta;
	funzione = cdcDestinatario + '_' + keyLegame + '_' + versione ;
	reparto = cdcDestinatario;
	
	if(basePC.PRINTERNAME_REF_CLIENT==''){
		anteprima='S';
	}else{
		anteprima='N';
	}	
	
	url =  'elabStampa?stampaFunzioneStampa='+funzione;
	url += '&stampaAnteprima='+anteprima;

	if(reparto!=null && reparto!='')
		url += '&stampaReparto='+reparto;	
	if(sf!=null && sf!='')
		url += '&stampaSelection='+sf;	
	if(stampante!=null && stampante!='')
		url += '&stampaStampante='+stampante;	
	url += '&ServletStampe=N'
	var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra){ 
		finestra.focus();
	}else{
    	finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}
	
	return 0;	
}

//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){

	document.all['lblMotAnn'].parentElement.style.display = 'none';
	document.all['txtMotivoAnnullamento'].parentElement.style.display = 'none';
	document.all['txtDataRichiesta'].parentElement.style.display = 'none';
	document.all['lblDataRichiesta'].parentElement.style.display = 'none';
	document.all['txtOraRichiesta'].parentElement.style.display = 'none';
	document.all['lblOraRichiesta'].parentElement.style.display = 'none';
	HideLayer('groupOperatori');
}

function controllaCampiNumerici(campo, label) {

	var descrizione = label.innerText;
	var contenutoDopoReplace = campo.value.replace (',','.');
	
	campo.value = contenutoDopoReplace;
	
//	alert ('contenuto dopo replace: '+campo.value);
//	alert ('campo: '+campo);
//	alert ('label: '+label);
//	alert ('contenuto: '+contenutoDopoReplace);
//	alert ('descrizione: '+descrizione);
	
	if (isNaN(campo.value)){
		alert ('il valore immesso in '+' " ' +descrizione+' " '+' non è un numero. Il campo richiede un valore numerico');
		campo.value= '';
		campo.focus();
		return;		
	}
}

//funzione che rende lo stato campo obbligatorio
function obbligaCampoMedico(){
	
	var doc = document.dati;
	var esami = '';
	var metodiche = '';
	var esaMetodica = '';
	var campoDestinazione = document.all['txtMedRadiologo'];
	var labelDestinazione = document.all['lblMedRadiologo'];
	var urgenza = document.all.hUrgenza.value;
	var arrayMetodiche = new Array();

	for(var i = 0; i < doc.cmbPrestRich.length; i++){
		
		esaMetodica = doc.cmbPrestRich[i].value.split('@');

		if(esami != ''){
			
			metodiche += '#';
		}
		arrayMetodiche.push(esaMetodica[1]);
	}
	
	//arrayMetodiche = metodiche.value.split('#');
	//alert ('arrayMetodiche '+arrayMetodiche);
	
	for(i = 0; i < arrayMetodiche.length; i++){
	
		if (arrayMetodiche[i] == '3'){   //TC
		
			if (urgenza != 0 ){
				
				//alert ('== TC ' + arrayMetodiche[i]);
				campoDestinazione.STATO_CAMPO = 'O';
				labelDestinazione.STATO_CAMPO = 'O';
				campoDestinazione.STATO_CAMPO_LABEL = labelDestinazione.name;
				labelDestinazione.parentElement.className = labelDestinazione.parentElement.className + "_O";

				return;
			}
			
			if (urgenza == 0 ){
				
				//alert ('== TC ' + arrayMetodiche[i]);
				campoDestinazione.STATO_CAMPO = 'E';
				labelDestinazione.STATO_CAMPO = 'E';
				campoDestinazione.STATO_CAMPO_LABEL = '';
			}	
		}
		
		if (arrayMetodiche[i] == '4'){  //RM
			
				//alert ('== RM ' + arrayMetodiche[i]);
			
				campoDestinazione.STATO_CAMPO = 'O';
				labelDestinazione.STATO_CAMPO = 'O';
				campoDestinazione.STATO_CAMPO_LABEL = labelDestinazione.name;
				labelDestinazione.parentElement.className = labelDestinazione.parentElement.className + "_O";
				return;
		}
	}
}

