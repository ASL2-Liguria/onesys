var _filtro_list = null;
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
		
		// 	INSERIMENTO ////////////////////////////////
		case 'I':
		
			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			
			//ONBLUR  txtDataProposta
			jQuery("#txtDataProposta").blur(function(){ controllaDataProposta(); });
			
			//ONBLUR  txtNumImp
			jQuery("#txtNumImp").blur(function(){ controllaCampiNumerici(document.dati.txtNumImp,document.getElementById('lblNumImp'));});
			
			//ONBLUR  txtGravidanza
			jQuery("#txtGravidanza").blur(function(){ controllaCampiNumerici(document.dati.txtGravidanza,document.getElementById('lblGravidanza'));});
			
			//ONBLUR  txtPeso
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.getElementById('lblPeso'));});
			
			
			//ONCLICK radioSiContro
			jQuery("#radioSiContro").click(function(){ 
				document.getElementById('lblControindicazioni').parentElement.style.display = 'block';
				document.getElementById('cmbControindicazioni').parentElement.style.display = 'block';
				document.getElementById('cmbControindicazioni').STATO_CAMPO = 'O';
			});
			
			jQuery("#radioSiContro").dblclick(function(){ 
				this.checked = false;
			});
			
			//ONCLICK radioNoContro
			jQuery("#radioNoContro").click(function(){ 
				document.getElementById('lblControindicazioni').parentElement.style.display = 'none';
				document.getElementById('cmbControindicazioni').parentElement.style.display = 'none';
				document.getElementById('cmbControindicazioni').STATO_CAMPO = 'E';		
			});
			
			jQuery("#radioNoContro").dblclick(function(){ 
				this.checked = false;
			});
			

			//ONLOAD  body
			valorizzaMed();
			cambiaPulsante();
			nascondiCampi();
			//HideLayer('groupUrgenza');
			HideLayerFieldset('divGroupUrgenza');
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
			
			//ONBLUR  txtNumImp
			jQuery("#txtNumImp").blur(function(){ controllaCampiNumerici(document.dati.txtNumImp,document.getElementById('lblNumImp'));});
			
			//ONBLUR  txtGravidanza
			jQuery("#txtGravidanza").blur(function(){ controllaCampiNumerici(document.dati.txtGravidanza,document.getElementById('lblGravidanza'));});
			
			//ONBLUR  txtPeso
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.getElementById('lblPeso'));});
			
			//ONCLICK radioSiContro
			jQuery("#radioSiContro").click(function(){ 
				document.getElementById('lblControindicazioni').parentElement.style.display = 'block';
				document.getElementById('cmbControindicazioni').parentElement.style.display = 'block';
				document.getElementById('cmbControindicazioni').STATO_CAMPO = 'O';
			});
			
			jQuery("#radioSiContro").dblclick(function(){ 
				this.checked = false;
			});
			
			//ONCLICK radioNoContro
			jQuery("#radioNoContro").click(function(){ 
				document.getElementById('lblControindicazioni').parentElement.style.display = 'none';
				document.getElementById('cmbControindicazioni').parentElement.style.display = 'none';
				document.getElementById('cmbControindicazioni').STATO_CAMPO = 'E';		
			});
			
			jQuery("#radioNoContro").dblclick(function(){ 
				this.checked = false;
			});
			

			//ONLOAD  body
			valorizzaMed();
			cambiaPulsante();
			nascondiCampi();
			//HideLayer('groupUrgenza');
			HideLayerFieldset('divGroupUrgenza');
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
			document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
			document.getElementById('lblStampa').parentElement.parentElement.style.display='none';
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
        
	jQuery("#txtQuesito").parent().css({float:'left'}).append($('<div></div>').addClass('classDivEpi').attr("title","Recupera Epicrisi").click(function() {
		var rs = WindowCartella.executeQuery("diari.xml", "getEpicrisiRicovero", WindowCartella.getRicovero("NUM_NOSOLOGICO"));
		// Recupero valori epicrisi e carico in textarea
		while (rs.next()) {
			$("#txtQuesito").append(rs.getString("EPICRISI") + "<br/>");
		}
	}));
	
	try {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtDataProposta);
	}catch(e){
		//alert(e.description);
	}
	try {
		var oDateMask2 = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask2.attach(document.dati.txtDataRicetta);

	}catch(e){
		//alert(e.description);
	}
	
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
	
}


/*
Funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico
*/
function valorizzaMed(){
	
	//alert (baseUser.TIPO);
	//alert (document.EXTERN.LETTURA.value);
	//if (document.EXTERN.LETTURA.value != 'S' || document.EXTERN.MODIFICA.value !='S')
	
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

/**
*/
//funzione che imposta la combo del reparto sorgente
function gestioneComboRepSorgente(){
	
	//alert (document.EXTERN.Hreparto_ricovero.value);
	
	var repartoDiRicovero = document.EXTERN.Hreparto_ricovero.value;
	
	if(repartoDiRicovero != ''){

		for(var i=0; i < document.dati.cmbRepSorgente.length; i++){
			
			if(document.dati.cmbRepSorgente[i].innerText == repartoDiRicovero)
				document.dati.cmbRepSorgente[i].selected = true;
		}
				
		document.dati.cmbRepSorgente.disabled = true;	
	}
	
	appendDivACR(document.all.cmbRepDest.parentNode);
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
		
	switch(urgenza)
	{
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
		//alert(esami);
	}
			
	var urgenza = typeof $('#URGENZA').val() != 'undefined' ? $('#URGENZA').val() : '0';
	
	if (document.EXTERN.LETTURA.value != "S"){
	
		url = 'servletGenerator?KEY_LEGAME=SCELTA_ESAMI';		
		url += '&ESAMI='+esami;
		url += '&REPARTO_RICHIEDENTE=' + document.EXTERN.HrepartoRicovero.value;
		url += '&CDC_DESTINATARIO=' + document.EXTERN.DESTINATARIO.value;
		url += '&SITO=' + document.EXTERN.DESTINATARIO.value;
		url += '&TIPO=R';		
		url += '&URGENZA=' + urgenza;
		url += '&METODICA=Z';
		url += '&IDEN_SCHEDA=';
	
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
function genera_stringa_codici(sel, carattere){
	
	//alert(sel + '\n ' + carattere);
	var idx;
	var ret = '';
	
	for(idx = 0; idx < sel.length; idx++)
	{
		if(ret != '')
			ret += carattere; //'*';
		
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
		
		for(var i = 0; i < doc.cmbControindicazioni.length; i++)
		{
			if(doc.cmbControindicazioni.length-1 == i)
				controindicazioni += doc.cmbControindicazioni[i].value;
			else
				controindicazioni += doc.cmbControindicazioni[i].value + ',';
		}
		
		doc.Hiden_controindicazioni.value = controindicazioni;
		
		for(var i = 0; i < doc.cmbPrestRich.length; i++)
		{
			esaMetodica = doc.cmbPrestRich[i].value.split('@');

			if(esami != '')
			{
				esami += '#';
				metodiche += '#';
			}
			
			esami += esaMetodica[0];
			metodiche += esaMetodica[1];
			
//			alert(esaMetodica[0]+'/n'+esaMetodica[1]);

		}
		
		doc.HelencoEsami.value = '';
		doc.HelencoEsami.value = esami;
		doc.HelencoMetodiche.value = metodiche;
		if (document.EXTERN.LETTURA.value == 'N'){
			
			doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;

		}
		
		//	Obbligatorietà di scelta di almeno una prestazione
		var al = '';
		
		if (doc.HelencoEsami.value == ''){		
			
			al = '-Scegliere prestazioni\n';
		}
		
		if (jQuery('input[name="radioAssociazione"]:checked').length==0 ){
			
			al += '-Spuntare una scelta per le Controindicazioni\n';
			
		}	
		
		if (jQuery('input[name="radioAssociazione"]:checked').length!=0 && jQuery('input#radioSiContro').attr("STATO_CAMPO")=='O'){
			
			al += '-Inserire presenza Controindicazioni\n';
		}
					
		if (doc.Hiden_controindicazioni.value == '' && doc.cmbControindicazioni.STATO_CAMPO == 'O'){
			
			al += '-Inserire Controindicazioni\n ';
		}
		
		if (al != ''){
		
			alert (al);
			return;
		}

			
		//controllo la lunghezza dell'ora e il formato
		controllaOraProposta();

		
//		var debug = 'IDEN: ' + doc.Hiden.value;
//		debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
//		debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
//        debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
//		debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
//		debug += '\nCONTROINDICAZIONI: ' + doc.Hiden_controindicazioni.value;
//		debug += '\nESAMI: ' + doc.HelencoEsami.value;
//		debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
//		debug += '\nURGENZA: ' + doc.hUrgenza.value;
//		debug += '\nNOTE: ' + doc.txtNote.value;
//		debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
//		debug += '\nQUESITO: ' + doc.txtQuesito.value;
//		debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;
//		debug += '\nNUM IMPEGNATIVA: ' + doc.txtNumImp.value;
//	     debug += '\nONERE: ' + doc.txtOnere.value;
//		debug += '\nTICKET: ' + doc.cmbTicket.value;
//		debug += '\nCOD_ESENZIONE: ' + doc.HcodEsenzione.value;
//		debug += '\nRICETTA: ' + doc.Hricetta.value;
//		debug += '\nTIPO RICETTA: ' + doc.cmbTipoRicetta.value;
//		debug += '\nMOD_ACCESSO: ' + doc.Hiden_op_rich.value;
//		debug += '\nMOD_PRESCRITTIVA: ' + doc.cmbModPrescr.value;
//		debug += '\nCODICE DSA: ' + doc.txtCodDSA.value;
//		debug += '\nTIPO DSA: ' + doc.cmbTipoDSA.value;
		
//	alert(debug);

	registraScheda();
	

}

/**
*/
function chiudi(){
	//alert(parent.name);
	if(parent.name == 'WHALE_winVisRich'){
		parent.opener.aggiorna();
		self.close();
		}
	else{
        WindowCartella.apriWorkListRichieste();
	}
}

function svuotaListBox(elemento)
{
	
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
		
	switch(urgenza)
	{
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

function apriSchedasRichiesta(keyLegame,Sito){
		if (baseUser.TIPO != 'M'){
		
			alert('Utente non abilitato ad effettuare la richiesta');
		
		}else{
	
			var url = 'servletGenerator?KEY_LEGAME='+keyLegame;

			if(Sito!=undefined){url+='&SITO='+Sito;}

			url+='&Hiden_anag=' + document.EXTERN.Hiden_anag.value;
			url+='&HrepartoRicovero=' + document.EXTERN.Hreparto_ricovero.value;
			url+='&LETTURA=N';
			url+='&Hiden_visita=' + document.EXTERN.Hiden_visita.value;
			
			document.all.frameSchede.src = url;
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

	document.all['lblMotAnn'].parentElement.style.display = 'none';
	document.all['txtMotivoAnnullamento'].parentElement.style.display = 'none';
	document.all['txtDataRichiesta'].parentElement.style.display = 'none';
	document.all['lblDataRichiesta'].parentElement.style.display = 'none';
	document.all['txtOraRichiesta'].parentElement.style.display = 'none';
	document.all['lblOraRichiesta'].parentElement.style.display = 'none';
	document.all['lblControindicazioni'].parentElement.style.display = 'none';
	document.all['cmbControindicazioni'].parentElement.style.display = 'none';
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


/*function stampa_scheda_richiesta(){

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
		finestra.focus();}
    else{
		var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}

	chiudiScheda();
	
}

*/

