var _filtro_list = null;
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
		
		// 	INSERIMENTO ////////////////////////////////
		case 'I':
		
			//ONBLUR  txtAltezza
			jQuery("#txtAltezza").blur(function(){ controllaCampiNumerici(document.getElementById('txtAltezza') ,document.getElementById('lblAltezza')); });
			
			//ONBLUR  txtPeso
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.getElementById('txtPeso') ,document.getElementById('lblPeso')); });
			
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
			document.getElementById('lblStampa').parentElement.style.display = 'none';
			nascondiCampi();
			document.all.hUrgenza.value = '0';
			setUrgenza();
			controllaDSA();
		
		break;
		
		//MODIFICA
		case 'E':
		
			if (jQuery("#txtDataProposta").val() == '//'){jQuery("#txtDataProposta").val("") ;}
			
			//ONBLUR  txtAltezza
			jQuery("#txtAltezza").blur(function(){ controllaCampiNumerici(document.getElementById('txtAltezza') ,document.getElementById('lblAltezza')); });
			
			//ONBLUR  txtPeso
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.getElementById('txtPeso') ,document.getElementById('lblPeso')); });
			
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
			document.getElementById('lblStampa').parentElement.style.display = 'none';
			nascondiCampi();
			document.all.hUrgenza.value = '0';
			setUrgenzaScheda();
			
			//per adesso niente
		
		break;
		
		// LETTURA ////////////////////////////////
		case 'L':
			
			//ONLOAD  body
			valorizzaMed();
			setUrgenzaScheda();
			document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
			if(document.EXTERN.LETTURA.value== 'S'){
				HideLayer('groupUrgenzaLabo');
			}
			
		break;
	}
});

function caricamento(statoPagina){
	
	
	if(statoPagina == 'I'){
		caricaDataOraInput();
	}
	
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
}

//funzione che in caso di ricovero DSA valorizza il combo  dello stato del paziente
function controllaDSA(){
	
	try{
		
		var combo = document.getElementById('cmbStatoPaziente');
		if (parent.parent.document.EXTERN.ricovero.value.substring(0,3)=='DSA'){
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
	document.all.lblTitleUrgenza.innerText = 'Grado Urgenza';

	//controllo se la pagina è in modalità di inserimento
	if (_STATO_PAGINA != 'L'){
	
	
	if(urgenza == ''){
		document.all.hUrgenza.value = '0';
		urgenza = '0';
	}
		
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
		url += '&ESAMI='+esami;
		url += '&REPARTO_RICHIEDENTE=' + document.EXTERN.HrepartoRicovero.value;
		url += '&TIPO=R';
		url	+= "&METODICA=Z";
	
		popup = window.open(url, "", "status = yes, scrollbars = no");
		if(popup){
			popup.focus();
		}else{
			popup = window.open(url, "", "status = yes, scrollbars = no");
		}
	}
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

	for(i = 0; i < doc.cmbControindicazioni.length; i++){

		if(doc.cmbControindicazioni.length-1 == i){
			controindicazioni += doc.cmbControindicazioni[i].value;
		}else{
			controindicazioni += doc.cmbControindicazioni[i].value + ',';
		}
	}

	doc.Hiden_controindicazioni.value = controindicazioni;

	var metodica = '';

	for(var i = 0; i < doc.cmbPrestRich.length; i++){
	
		esaMetodica = doc.cmbPrestRich[i].value.split('@');

		if(esami != ''){
			esami += '#';
			metodiche += '#';
		}	

		esami += esaMetodica[0];
		metodiche += esaMetodica[1];

	//alert(esaMetodica[0]+'/n'+esaMetodica[1]);

	}
	
	controllaDataProposta();

	doc.HelencoEsami.value = '';
	doc.HelencoEsami.value = esami;
	doc.HelencoMetodiche.value = metodiche;
	if (document.EXTERN.LETTURA.value == 'N'){

		doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
	}

	if (doc.HelencoEsami.value == ''){

		alert ('scegliere prestazioni');
		return;
	}
	
	/*
	var debug = 'IDEN: ' + doc.Hiden.value;
	debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
	debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
	debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
	debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
	debug += '\nCONTROINDICAZIONI: ' + doc.Hiden_controindicazioni.value;
	debug += '\nESAMI: ' + doc.HelencoEsami.value;
	debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
	debug += '\nURGENZA: ' + doc.hUrgenza.value;
	debug += '\nNOTE: ' + doc.txtNote.value;
	debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
	debug += '\nQUESITO: ' + doc.txtQuesito.value;
	debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;

	alert(debug);
	*/

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
	var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_MEDNUC_INT_0&stampaReparto=RICHIESTA_GENERICA_MEDNUC_INT&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra){	finestra.focus();}
	else
	{var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_MEDNUC_INT_0&stampaReparto=RICHIESTA_GENERICA_MEDNUC_INT&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);}
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

