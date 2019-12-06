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
				
				if (jQuery("#txtDataProposta").val() == '//'){jQuery("#txtDataProposta").val("") ;}
			
				//ONBLUR  cmbPrestRich
				jQuery("#cmbPrestRich").blur(function(){ if (document.all['cmbPrestRich'].value != '' ){obbligaCampoMedico();}});
				
				//ONBLUR  txtOraProposta
				jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
				
				//ONKEYUP  txtOraProposta
				jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
				
				//ONBLUR  txtDataProposta
				jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
				
				//ONBLUR  txtGravidanza
				jQuery("#txtGravidanza").blur(function(){ controllaCampiNumerici(document.dati.txtGravidanza,document.all['lblGravidanza']);});
			
				
				//ONLOAD  body
				valorizzaMed();
				//cambiaPulsante();
				nascondiCampi();

				if(typeof document.EXTERN.URGENZA != 'undefined'){
					setUrgenzaScheda();
				}else{
					document.all.hUrgenza.value = '0';
					setUrgenza();
				}

				document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
				//controllaDSA();
				
			break;
			
			// MODIFICA ////////////////////////////////
			case 'E':
				
				if (jQuery("#txtDataProposta").val() == '//'){jQuery("#txtDataProposta").val("") ;}
			
				//ONBLUR  cmbPrestRich
				jQuery("#cmbPrestRich").blur(function(){ if (document.all['cmbPrestRich'].value != '' ){obbligaCampoMedico();}});
				
				//ONBLUR  txtOraProposta
				jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
				
				//ONKEYUP  txtOraProposta
				jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
				
				//ONBLUR  txtDataProposta
				jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
				
				//ONBLUR  txtGravidanza
				jQuery("#txtGravidanza").blur(function(){ controllaCampiNumerici(document.dati.txtGravidanza,document.all['lblGravidanza']);});
			
				
				//ONLOAD  body
				valorizzaMed();
				//cambiaPulsante();
				nascondiCampi();
				setUrgenzaScheda();

				document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
				//controllaDSA();
				
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
 
 
 
 
 
 
 function caricamento(statoPagina){
	 
	 document.getElementById('lblTitleUrgenza').innerText = 'Grado urgenza';
	 
	 try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
	 
	//funzione che carica la data proposta se arriva in input
	if(statoPagina == 'I'){
		caricaDataOraInput();
	}
	 
	try{

		var oDateMask2 = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask2.attach(document.dati.txtDataProposta);

	}catch(e){}
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

/*
Funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico 
*/
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
		
	switch(urgenza){
		
		// Non urgente
		case '0':
			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' ROUTINE    ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'routine');
			break;
		
		// Urgenza differita
		case '1':
			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' URGENZA DIFFERITA    ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'urgenzaDifferita');
			break;
		
		// Urgenza
		case '2':
			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' URGENZA    ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'urgenza');
			break;
		
		// Emergenza
		case '3':
			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' EMERGENZA   ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'emergenza');
			break;
		}
	
		return;
	
	}else{
	
		alert ('Impossibile modificare il grado di urgenza in modalità visualizzazione');
	
	}
}
//funzione commentata per un eventuale gestione della scelta esami diversa dal listbox
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
		url += '&URGENZA=' + document.all.hUrgenza.value;	
	
		popup = window.open(url, "", "status = yes, scrollbars = yes");
		if(popup){
			popup.focus();
		}else{
			popup = window.open(url, "", "status = yes, scrollbars = yes");
		}
	}
}



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
			
		if(doc.cmbControindicazioni.length-1 == i){
			controindicazioni += doc.cmbControindicazioni[i].value;
		}else{
				controindicazioni += doc.cmbControindicazioni[i].value + ',';
		}
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
	
	//try{ document.EXTERN.IDEN.value=''; }catch(e){}
	
	// var debug = 'IDEN: ' + doc.Hiden.value;
	// debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
	// debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
	// debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
	// debug += '\nDATA_PROPOSTA: ' + doc.txtDataProposta.value;
	// debug += '\nORA_PROPOSTA: ' + doc.txtOraProposta.value;
	// debug += '\nREPARTO DEST: ' + doc.HcmbRepDest.value;
	// debug += '\nCONTROINDICAZIONI: ' + doc.Hiden_controindicazioni.value;
	// debug += '\nESAMI: ' + doc.HelencoEsami.value;
	// debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
	// debug += '\nURGENZA: ' + doc.hUrgenza.value;
	// debug += '\nNOTE: ' + doc.txtNote.value;
	// debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
	// debug += '\nQUESITO: ' + doc.txtQuesito.value;
	// debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;

	// alert(debug);
	
	registraScheda();
}

/**
*/

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
			
			// Urgenza differita
			case '1':
				document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' URGENZA DIFFERITA    ';
				document.all.lblTitleUrgenza.className = '';
				addClass(document.all.lblTitleUrgenza,'urgenzaDifferita');
				break;
			
			// Urgenza
			case '2':
				document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' URGENZA    ';
				document.all.lblTitleUrgenza.className = '';
				addClass(document.all.lblTitleUrgenza,'urgenza');
				break;
			
			// Emergenza
			case '3':
				document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' EMERGENZA   ';
				document.all.lblTitleUrgenza.className = '';
				addClass(document.all.lblTitleUrgenza,'emergenza');
				break;
		}
}


/*
function stampa_scheda_richiesta(){
	
	var sf= '{TESTATA_RICHIESTE.IDEN}='+document.EXTERN.KEY_ID.value;
	var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_RADIO_INT_0&stampaReparto=RICHIESTA_GENERICA_RADIO_INT&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra){	
		finestra.focus();
	}else{
		finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_RADIO_INT_0&stampaReparto=RICHIESTA_GENERICA_RADIO_INT&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}
}
*/
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

