var _filtro_list = null;
var dataAppuntamento = '';
var tipo_salvataggio='';


jQuery(document).ready(function(){
	
	caricamento(_STATO_PAGINA);
	
	switch (_STATO_PAGINA){
		
		// 	INSERIMENTO ////////////////////////////////
		case 'I':
			
			try{top.utilMostraBoxAttesa(true);}catch(e){}
			
			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			
			//ONBLUR  txtDataProposta
			jQuery("#txtDataProposta").blur(function(){ controllaDataProposta(); });
			
			//ONBLUR  txtQuesito
			//jQuery("#txtQuesito").blur(function(){ if(jQuery("#txtQuesito").val().length < 10 && jQuery("#txtQuesito").val() != ''){jQuery(this).focus();} });
			
			//ONLOAD  body
			scegli_prestazioni();
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
		
		//MODIFICA
		case 'E':

			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			
			//ONBLUR  txtDataProposta
			jQuery("#txtDataProposta").blur(function(){ controllaDataProposta(); });

			//ONLOAD  body
			//valorizzaMed();
			top.utilMostraBoxAttesa(false);
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
	
	//funzione che carica la data proposta se arriva in input	
	if(statoPagina == 'I'){
		caricaDataOraInput();
	}
	try {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtDataProposta);
	}catch(e){
		//alert(e.description);
	}
	try {
		var oDateMask2 = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask2.attach(document.dati.txtDataRicetta);
	}catch(e){}
	//allargo il quesito e tolgo i l calendarietto
	jQuery("#txtQuesito").attr("style","width:400px;");
	jQuery("#txtDataRichiesta").next().hide();
	
	//commentato per l'apertura della pagina di scelta esami all'avvio.... Se si vuole chiudere prima dell'apertura, decomentare
	if(statoPagina=='E'){
		try{top.utilMostraBoxAttesa(false);}catch(e){}
	}
}

// funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico
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

/**
*/
//funzione commentata per un eventuale gestione della scelta esami diversa dal listbox
function scegli_prestazioni(){
	
	try{top.utilMostraBoxAttesa(false);}catch(e){}
	
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
		url += '&REPARTO=' + document.EXTERN.HrepartoRicovero.value;
		url += '&URGENZA=' + document.all.hUrgenza.value;
	
		popup = window.open(url, "", "status = yes, scrollbars = yes");
		if(popup){
			popup.focus();
		}else{
			popup = window.open(url, "", "status = yes, scrollbars = yes");
		}
	}
}

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
function preSalvataggio(tipo){

	var tipo = typeof tipo != 'undefined'?tipo:'';
	if(tipo!=''){ tipo_salvataggio = tipo; }
	
	var controindicazioni = '';
	var esami = '';
	var metodiche = '';
	var esaMetodica = '';
	var doc = document.dati;
	
	if (document.all.hUrgenza.value == ''){

			alert ('scegliere Urgenza');
			return;		
	}
	
	if(jQuery("#txtQuesito").val().length < 10 && jQuery("#txtQuesito").val() != ''){
		return alert("Attenzione! Inserire un testo di almeno 10 caratteri");
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
		
		//alert(esaMetodica[0]+'/n'+esaMetodica[1]);
	}
	
	doc.HelencoEsami.value = '';
	doc.HelencoEsami.value = esami;
	doc.HelencoMetodiche.value = metodiche;
	
	if (document.EXTERN.LETTURA.value == 'N'){
		
		doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
	}
	
	//controllo la lunghezza dell'ora e il formato
	controllaOraProposta();
		
	//	alert ("document.all['radioMDC']: "+document.all['radioMDC']);
	//	alert ("document.all['radioMDC'].value: "+document.all['radioMDC'].value);
	
	if(baseUser.LOGIN == 'lucas'){
	
		 var debug = 'IDEN: ' + doc.Hiden.value;
		 debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
		 debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
		 debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
		 debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
		 debug += '\nCONTROINDICAZIONI: ' + doc.Hiden_controindicazioni.value;
		 debug += '\nESAMI: ' + doc.HelencoEsami.value;
		// debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
		// debug += '\nURGENZA: ' + doc.hUrgenza.value;
		// debug += '\nNOTE: ' + doc.txtNote.value;
		 debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
		 debug += '\nQUESITO: ' + doc.txtQuesito.value;
		 debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;
		
		//alert(debug);
		//return; 
	}
	
	registraScheda();
}

/**
*/
function chiudi(){
	//alert(parent.name);
	if(parent.name == 'WHALE_winVisRich'){
		parent.opener.aggiorna();
		self.close();
	}else{
		top.apriWorkListRichieste();
	}
}

function svuotaListBox(elemento){
	
	var object;
	var indice;
	
	if (typeof elemento == 'String')
		object = document.getElementById(elemento);
	else
		object = elemento;

	
	if (object){
		indice = parseInt(object.length);
		while (indice>-1)
		{
			object.options.remove(indice);
			indice--;
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

function chiudiAlbero(){
	
	HideLayer('groupCDC');	
}

function appendDivACR(obj){

	if(!document.all['clsACR']){
		divAcr = document.createElement('DIV');
		divAcr.id='clsACR'; 
		divAcr.className = 'clsACR';
		obj.appendChild(divAcr);
	}

	creaDivACR('clsACR', 0, 'SCELTA_SCHEDA_RICHIESTA', chiudiAlbero);
}


//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){

	document.getElementById('lblMotAnn').parentElement.style.display = 'none';
	document.getElementById('txtMotivoAnnullamento').parentElement.style.display = 'none';
	document.getElementById('lblOpRich').parentElement.style.display = 'none';
	document.getElementById('txtOpRich').parentElement.style.display = 'none';
	//document.all['txtDataRichiesta'].parentElement.style.display = 'none';
	//document.all['lblDataRichiesta'].parentElement.style.display = 'none';
	//document.all['txtOraRichiesta'].parentElement.style.display = 'none';
	//document.all['lblOraRichiesta'].parentElement.style.display = 'none';
	//HideLayer('groupOperatori');
	HideLayerFieldset('divGroupOperatori');
	HideLayerFieldset('divGroupNote');
	HideLayerFieldset('divGroupInfoCliniche');
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

//funzione che controlla la lunghezza del campo ora. Nel caso sia minore del dovuto cancella il campo e sposta il focus sul campo stesso. Da mettere sull'evento onblur	
function controllaOraProposta(){

	var oggetto = document.all['txtOraProposta']; 

	if (oggetto.value != ''){
		
		if (oggetto.value.toString().length < 4) {
		
			alert (' Formato ora errato \n\n Inserire l\'ora nel formato HH:MM'); 
			oggetto.value = '';
			oggetto.focus();	
		}
	}
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

function stampa_scheda_richiesta(){

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

function obbligaCampiSino(){

	var esaMetodica = '';
	var arrayEsami = new Array();

	for(var i = 0; i < document.dati.cmbPrestRich.length; i++){

		esaMetodica = document.dati.cmbPrestRich[i].value.split('@');
		arrayEsami.push(esaMetodica[0]);
	}

	//alert('arrayEsami: '+arrayEsami);
	
	var sql="select count(*) from radsql.TAB_ESA where IDEN in ("+arrayEsami+") and MDC_SINO='S'";
	
	if(baseUser.LOGIN=='lucas'){
		alert('lucas.sql: '+sql);
	}
	
	//deve essere un array diviso da virgole altrimenti manda in errore il dwr
	//cerco se tra gli esami scelti ce ne sia uno o più con TAB_ESA.MDC_SINO = 'S'

	dwr.engine.setAsync(false);	
	toolKitDB.getResultData(sql, checkEsami);
	dwr.engine.setAsync(true);
}


function checkEsami(resp){

	if(baseUser.LOGIN=='lucas'){
		alert ('lucas.resp chechEsami: '+resp);
	}
	
	if(!jQuery('input#radioNoContro').attr("checked")){
		//alert('ho schiacciato si');
		if (resp>0){		

			if (document.all['lblControindicazioni'].parentElement.style.display == 'none'){
			
				document.all['lblControindicazioni'].parentElement.style.display = 'block';
				document.all['cmbControindicazioni'].parentElement.style.display = 'block';
			}
						
				jQuery('label#lblPresControindicazioni').parent().attr("STATO_CAMPO","O");
				jQuery('input#radioSiContro , input#radioNoContro').attr("STATO_CAMPO","O");
				jQuery('input#radioSiMDC , input#radioNoMDC').attr("STATO_CAMPO","O");
				obbligaCampo(document.all['Hiden_controindicazioni'], document.all['lblControindicazioni']);	   //chiedere a Marco
		}else{
			

			jQuery('input#radioSiMDC , input#radioNoMDC').attr("STATO_CAMPO","E");
			
		}

	}else{
		
		//alert('ho schiacciato no');
		//alert(document.all['Hiden_controindicazioni'].STATO_CAMPO);
		document.all['Hiden_controindicazioni'].STATO_CAMPO='E';
		jQuery('#lblControindicazioni').attr("STATO_CAMPO","E");
		jQuery('#cmbControindicazioni').attr("STATO_CAMPO","E");
		jQuery('label#lblPresControindicazioni').parent().attr("STATO_CAMPO","E");
		jQuery('input#radioSiMDC , input#radioNoMDC').attr("STATO_CAMPO","E");
		jQuery('input#radioSiContro , input#radioNoContro').attr("STATO_CAMPO","E");
		
	}
}

function cambiaChiusura(){
	
	//caso in cui voglio ricaricare la pagina e non chiudere
	if(typeof tipo_salvataggio != 'undefined' && tipo_salvataggio=='REINS' && tipo_salvataggio != ''){ 
		document.location.replace(document.location);
		try{top.utilMostraBoxAttesa(true);}catch(e){}
	}else{
		chiudiScheda();
	}
}
