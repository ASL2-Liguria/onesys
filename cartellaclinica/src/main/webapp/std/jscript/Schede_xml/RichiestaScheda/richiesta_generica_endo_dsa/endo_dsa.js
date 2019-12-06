var dataAppuntamento='';
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
				
				//ONBLUR  txtNumImp
				jQuery("#txtNumImp").blur(function(){ controllaCampiNumerici(document.dati.txtNumImp,document.getElementById('lblNumImp'));});
				
				//ONBLUR  txtOraProposta
				jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
				
				//ONKEYUP  txtOraProposta
				jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
				
				//ONBLUR  txtDataProposta
				jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
					 
				//ONLOAD  body
				valorizzaMed();
				cambiaPulsante();
				nascondiCampi();
				
				if(typeof document.EXTERN.URGENZA != 'undefined'){
					setUrgenzaScheda();
				}else{
					document.all.hUrgenza.value = '0';
					setUrgenza();
				}
				
			break;
			
			// MODIFICA ////////////////////////////////
			case 'E':
				
				//ONBLUR  txtNumImp
				jQuery("#txtNumImp").blur(function(){ controllaCampiNumerici(document.dati.txtNumImp,document.getElementById('lblNumImp'));});
				
				//ONBLUR  txtOraProposta
				jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
				
				//ONKEYUP  txtOraProposta
				jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
				
				//ONBLUR  txtDataProposta
				jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
				
				//ONLOAD  body
				valorizzaMed();
				cambiaPulsante();
				nascondiCampi();
				
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
					//HideLayer('groupUrgenza');
					HideLayerFieldset('divGroupUrgenza');
				}
				
			break;
		}
});
 

 function caricamento(statoPagina){
	 
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
	
	//funzione che carica la data proposta se arriva in input	
	if(statoPagina == 'I'){
		caricaDataOraInput();
	}
	
	try {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtDataRicetta);
	}catch(e){ /*alert(e.description);*/ }
	
	document.getElementById('lblTitleUrgenza').innerText = 'Grado urgenza';
	 
	
	
	if(_STATO_PAGINA == 'I'){
		// GESTIONE EVENTUALE DEI CAMPI DSA OBBLIGATORI COME CARDIO_DAYSERVICCE
		if (parent.document.getElementById('hIntEst').value =='E' ){
			
			obbligaCampo(document.getElementById('txtNumImp'), document.getElementById('lblNumImp'));
			obbligaCampo(document.getElementById('cmbTicket'), document.getElementById('lblTicket'));
			obbligaCampo(document.getElementById('txtDataRicetta'), document.getElementById('lblDataRicetta'));
			obbligaCampo(document.getElementById('txtQuesito'), document.getElementById('lblQuesito'));
			
		}else{
			//obbligaCampo(document.getElementById('txtMedPrescr'), document.getElementById('lblMedPrescr'));
		}
	}
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
	
	if (baseUser.TIPO == 'M'){

		document.dati.Hiden_MedPrescr.value = baseUser.IDEN_PER; 
		document.dati.txtMedPrescr.value = baseUser.DESCRIPTION;
		jQuery('#txtMedPrescr').attr("readOnly",true);
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
		
		esaMetodica = document.dati.cmbPrestRich[i].value.split('@');
		//alert (esaMetodica);

		if (esami != ''){
			esami += ',';
		}
			
		esami += "'"+esaMetodica[0]+"'";
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
                url += '&URGENZA='+document.all.hUrgenza.value;
	
		popup = window.open(url, "", "status = yes, scrollbars = no");
		if(popup){
			popup.focus();
		}else{
			popup = window.open(url, "", "status = yes, scrollbars = no");
		}
		try{
			WindowCartella.opener.top.closeWhale.pushFinestraInArray(popup);
		}catch(e){
			
		}
		
	}
}

/**
*/
//funzione che 'prepara' i dati e valorizza i campi nascosti per il salvataggio. Alla fine lancia registra()
function preSalvataggio(){
	
	var esami = '';
	var metodiche = '';
	var esaMetodica = '';
	var doc = document.dati;
	
	if (document.all.hUrgenza.value == ''){
			alert ('scegliere Urgenza');
			return;
		}
			
	for(var i=0; i < doc.cmbPrestRich.length; i++){
		
		esaMetodica = doc.cmbPrestRich[i].value.split('@');

		if(esami != ''){
			esami += '#';
			metodiche += '#';
		}
		
		esami += esaMetodica[0];
		metodiche += esaMetodica[1];	
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
	
	try{document.EXTERN.IDEN.value='';}catch(e){}
	
	if (baseUser.LOGIN == 'lucas'){
		/*
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
*/

		//alert('DEBUG lucas:\n'+debug);
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
	url += '&ServletStampe=N';
	
	if(reparto!=null && reparto!='')
		url += '&stampaReparto='+reparto;	
	if(sf!=null && sf!='')
		url += '&stampaSelection='+sf;	
	if(stampante!=null && stampante!='')
		url += '&stampaStampante='+stampante;	
	
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
	//HideLayer('groupOperatori');
	HideLayerFieldset('divGroupOperatori');
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

