var _filtro_list = null;
var urgenzaGenerale = '';
var dataApppuntamento='';
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
			jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
			
			//ONBLUR  txtNumImp
			jQuery("#txtNumImp").blur(function(){ controllaCampiNumerici(document.dati.txtNumImp,document.getElementById('lblNumImp'));});
			
			//ONBLUR  txtAltezza
			jQuery("#txtAltezza").blur(function(){ controllaCampiNumerici(document.dati.txtAltezza ,document.all['lblAltezza']); });

			//ONBLUR  txtPeso
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });
			
			//ONLOAD  body
			valorizzaMed();
			document.all['lblStampa'].parentElement.style.display = 'none';
			document.all.hUrgenza.value = '0';
			setUrgenza();
			HideLayer('groupUrgenzaLabo');
			nascondiCampi();
			
		break;
		
		// MODIFICA ////////////////////////////////
		case 'E':
			
			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
		
			//ONBLUR  txtDataProposta
			jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
			
			//ONBLUR  txtNumImp
			jQuery("#txtNumImp").blur(function(){ controllaCampiNumerici(document.dati.txtNumImp,document.getElementById('lblNumImp'));});
					
			//ONBLUR  txtAltezza
			jQuery("#txtAltezza").blur(function(){ controllaCampiNumerici(document.dati.txtAltezza ,getElementById('lblAltezza')); });
			
			//ONBLUR  txtPeso
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,getElementById('lblPeso')); });
					
			//ONLOAD  body
			getElementById('lblStampa').parentElement.style.display = 'none';
			valorizzoMed();
			setUrgenzaScheda();
			$(".datepick-trigger").hide();
			HideLayer('groupUrgenzaLabo');
			nascondiCampi();
			
		break;
			
		// LETTURA ////////////////////////////////
		case 'L':
			
			//ONLOAD  body
			valorizzaMed();
			setUrgenzaScheda();
			getElementById('lblRegistraLabo').parentElement.parentElement.style.display = 'none';
			if(document.EXTERN.LETTURA.value== 'S'){HideLayer('groupUrgenzaLabo');}
			nascondiCampi();		
			
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
		//oDateMask.attach(document.dati.txtUltimeMestrua);
		oDateMask.attach(document.dati.txtDataProposta);
	}catch(e){
		//alert(e.description);
	}
	
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
}
/**
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
			document.dati.txtOpeRich_L.value = baseUser.DESCRIPTION;
			jQuery('#txtMedPrescr').attr("readOnly",true);

		}else{
		
			document.dati.Hiden_op_rich.value = baseUser.IDEN_PER; 
			document.dati.txtOpeRich_L.value = baseUser.DESCRIPTION;
		
		}
	}
				
	if (typeof document.EXTERN.Hiden_pro != 'undefined'){	
		document.dati.Hiden_pro.value = document.EXTERN.Hiden_pro.value;
	}
}


//funzione che modifica la label del div a seconda del grado dell'urgenza
function setUrgenza(){
	
	if (urgenzaGenerale ==''){
		urgenzaGenerale=document.getElementById('hUrgenza').value
	}

	document.all.lblTitleUrgenza_L.innerText = 'Grado Urgenza';
	var urgenza = document.all.hUrgenza.value;

	//controllo se la pagina è in modalità di inserimento
	if (_STATO_PAGINA == 'I'){
	
		svuotaListBox(document.dati.cmbPrestRich_L);     // svuoto il listbox degli esami e il campo nascosto
			
		switch(urgenza){
			// Non urgente
			case '0':

				/*if (document.all.lblTitleUrgenza_L.innerText == '    Grado Urgenza:  ' + ' URGENZA    '){*/
				if(urgenzaGenerale !=  urgenza){
					//controllo se l'urgenza prima del click è diversa
					document.dati.HelencoEsami.value = '';
				}
				
				urgenzaGenerale='0';
								
				document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' ROUTINE    ';
				document.all.lblTitleUrgenza_L.className = '';
				addClass(document.all.lblTitleUrgenza_L,'routine');
				//apriContenitoreLabo();
				break;
			
			// Urgenza
			case '2':

				/*if (document.all.lblTitleUrgenza_L.innerText == '    Grado Urgenza:  ' + ' ROUTINE    '){*/
				if(urgenzaGenerale != urgenza){
					//controllo se l'urgenza prima del click è diversa
					document.dati.HelencoEsami.value = '';
				}
				
				urgenzaGenerale='2';
				
				document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' URGENZA    ';
				document.all.lblTitleUrgenza_L.className = '';
				addClass(document.all.lblTitleUrgenza_L,'urgenza');
				//apriContenitoreLabo();
				break;
		}
		return;
	
	}else{	
		
		alert ('Impossibile modificare il grado di urgenza');	
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
	
	var esami = '' ;
	var metodiche = '' ;
	var esaMetodica = '' ;
	var doc = document.dati ;
	var materiali = '' ;
	var corpo = '' ;
	var note = '' ;

	//alert(doc.cmbPrestRich_L.options.length);
	//	Valorizza HelencoEsami, HelencoMetodiche, Hmateriali leggendo i valori della ListBox cmbPrestRich_L dopo averli splittati [@] e ciclati
	for(var i = 0; i < doc.cmbPrestRich_L.options.length; i++){
		esaMetodica = doc.cmbPrestRich_L.options[i].value.split('@');

			if(esami != ''){
				esami += '#';
				metodiche += '#';
				materiali += '#';
				corpo += '#';
				note += '#';
			}		
		
		esami += esaMetodica[0];
		metodiche += 'A';
		materiali += esaMetodica [1];
		corpo += esaMetodica [2];
		note += esaMetodica [3];
		
		//alert(esaMetodica[0]+'/n'+esaMetodica[1]);
	}
	
	doc.HelencoEsami.value = '';
	doc.HelencoMetodiche.value ='';
	doc.Hmateriali.value ='';
	doc.HelencoCorpo.value = '';
	doc.Hnote.value = '';
	doc.HelencoEsami.value = esami;
	doc.HelencoMetodiche.value = metodiche;
	doc.Hmateriali.value = materiali;
	doc.HelencoCorpo.value = corpo;
	doc.Hnote.value = note;

	//	Se in Inserimento o modifica, valorizza il cdc_destinatario
	if (document.EXTERN.LETTURA.value == 'N'){			
		doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
	}

	// controllo la lunghezza dell'ora e il formato
	// controllaOraProposta();

 if (baseUser.LOGIN == 'lucas'){	
	
	var debug = 'IDEN: ' + doc.Hiden.value;
	 debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
	 debug += '\nUTE_INS: ' + document.all.Hiden_op_rich.value;
	 //debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
	 debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
	 debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
	  /*debug += '\nCONTROINDICAZIONI: ' + doc.Hiden_controindicazioni.value;*/
	 debug += '\nESAMI: ' + doc.HelencoEsami.value;
	 debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
	 debug += '\nMATERIALI: ' + doc.Hmateriali.value;
	 debug += '\nPARTI DEL CORPO: ' + doc.HelencoCorpo.value;
	 debug += '\nNOTE ESAMI: ' + doc.Hnote.value;
	 debug += '\nNOTE: ' + doc.txtNote_L.value;
	 debug += '\nURGENZA: ' + doc.hUrgenza.value;
	 debug += '\nNOTE: ' + doc.txtNote_L.value;
	 debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
	 debug += '\nQUESITO: ' + doc.txtQuesito_L.value;
	 debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;
	 debug += '\nMATERIALI: ' + doc.Hmateriali.value;

	alert(debug);
}
	registra();	
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
			document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' ROUTINE    ';
			document.all.lblTitleUrgenza_L.className = '';
			addClass(document.all.lblTitleUrgenza_L,'routine');
			break;
		
		// Urgenza
		case '2':
			document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' URGENZA    ';
			document.all.lblTitleUrgenza_L.className = '';
			addClass(document.all.lblTitleUrgenza_L,'urgenza');
			break;
	}
}

function stampa_scheda_richiesta(){
	var sf= '{TESTATA_RICHIESTE.IDEN}='+document.EXTERN.KEY_ID.value;
	var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_LABO_SPZ_0&stampaReparto=RICHIESTA_GENERICA_LABO_SPZ&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra){	
		finestra.focus();
	}else{
		finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_LABO_SPZ_0&stampaReparto=RICHIESTA_GENERICA_LABO_SPZ&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}
}

//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){
	document.all['lblMotAnn_L'].parentElement.style.display = 'none';
	document.all['txtMotivoAnnullamento_L'].parentElement.style.display = 'none';
	document.all['lblControindicazioni_L'].parentElement.style.display = 'none';
	document.all['cmbControindicazioni'].parentElement.style.display = 'none';
	HideLayer('groupOperatoriLabo');
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

//funzione che apre la servlet contenitore che contiene le servlet di scelta esami
function apriContenitoreLaboDeprecated(){
	
	var url = '';
	var urgenza = document.all.hUrgenza.value;
	var idpagina = '';
	
	//controllo se ho passato l'iden della provenienza alla pagina... se non l'ho passato sono in modifica e quindi lo prendo dalla pagina...
	if (typeof document.EXTERN.Hiden_pro == 'undefined' ){
		iden_Pro=document.dati.Hiden_pro.value; //lo prendo direttamente dal campo della pagina
	}else{
		iden_Pro=document.EXTERN.Hiden_pro.value; //lo prendo dai parametri passati in chiamata
	}
	
	
	//controllo l'urgenza della pagina e seleziono l'idpagina. Per ora sono solo due!!!
	if (urgenza == '0'){
		idpagina = '3';
		}
	
	if (urgenza == '2'){
		idpagina = '4';
		}
		
	if(document.EXTERN.LETTURA.value !="S" ){
		
		url = "servletGenerator?KEY_LEGAME=SCELTA_ESAMI_MICRO&Hiden_pro="+iden_Pro+"&URGENZA="+urgenza+"&REPARTO="+document.EXTERN.HrepartoRicovero.value+"&IDPAGINA="+idpagina;
		window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
		//alert (url);
	}
}

function apriContenitoreLabo(){
	
	var urgenza = document.all.hUrgenza.value;
		
	if(document.EXTERN.LETTURA.value !="S" ){
		
		var url = "servletGenerator?KEY_LEGAME=SCELTA_ESAMI_MICRO_SV" +
				"&URGENZA="+urgenza+
				"&CDC_DESTINATARIO="+$('#DESTINATARIO').val()+
				"&REPARTO_RICHIEDENTE="+document.EXTERN.HrepartoRicovero.value+
				"&TIPO=R"+
				"&METODICA=A";
		
		window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
	}
}

//funzione che serve a formattare l'ora in inserimento. PER ORA NON FUNZIONA CON I NUMERI INSERITI DA TASTIERINO NUMERICO!!!!!!!!!!!!!!!!!!
function verificaOra(obj){
	obj.disableb = true;
		if(event.keyCode==8){ //backspace
			if(obj.value.toString().length==2 || obj.value.toString().length==3){
				obj.value=obj.value.substring(0,1);
			}
			obj.disabled = false;			
			return;		
		}
		if(obj.value.toString().length==1){
			if(event.keyCode>50 || event.keyCode<48)
				obj.value='';
			obj.disabled = false;			
			return;
		}
		if(obj.value.toString().length==2){
			if(parseInt(obj.value.substring(0,1),10)==2){
				if(event.keyCode>51 || event.keyCode<48)
					obj.value=obj.value.substring(0,1);
				else{
					obj.value=obj.value+':';}
			}else{
				if(event.keyCode>57 || event.keyCode<48)
					obj.value=obj.value.substring(0,1);
				else{
					obj.value=obj.value+':';}				
			}
			obj.disabled = false;
			return;		
		}	
		if(obj.value.toString().length==4){
			if(event.keyCode>53 || event.keyCode<48){
				obj.value=obj.value.substring(0,3);			
			}
			obj.disabled = false;
			return;		
		}
		if(obj.value.toString().length==5){
			if(event.keyCode>57 || event.keyCode<48){
				obj.value=obj.value.substring(0,4);			
			}
			obj.disabled = false;
			return;		
		}
		if(obj.value.toString().length>5){
			obj.value=obj.value.substring(0,5);	
			obj.disabled = false;
			return;
		}
}


//funzione che rende lo stato campo obbligatorio per l'ora proposta
function obbligaCampoProposta(campoCondizione, campoDestinazione, labelDestinazione){

	if (campoCondizione.value !=''){
	
	campoDestinazione.STATO_CAMPO = 'O';
	labelDestinazione.STATO_CAMPO = 'O';
	campoDestinazione.STATO_CAMPO_LABEL = labelDestinazione.name;
	
	//alert('className PRIMA: '+labelDestinazione.parentElement.className);
	
	if (labelDestinazione.parentElement.className != 'classTdLabel_O'){
	
		labelDestinazione.parentElement.className = labelDestinazione.parentElement.className + "_O";
		
		//alert('className DOPO: '+labelDestinazione.parentElement.className);
	}
	
	}
	
}

function controllaDataProposta(){

	//alert('entro nella funzione controllaDataProposta');

	var dataProposta= document.all['txtDataProposta'].value;
	
	//alert('dataProposta: '+dataProposta);

	if (dataProposta!=''){
	
		if (dataProposta.length<10){
				
			alert('Inserire la data in un formato corretto (dd/MM/yyyy)');
				
			document.all['txtDataProposta'].value='';
			document.all['txtDataProposta'].focus();
		}	
		
		if(controllo_data(dataProposta).previous){
			
			alert('Attenzione! La data programmata per il prelievo è precedente alla data odierna');
			
			document.all['txtDataProposta'].value='';
			document.all['txtDataProposta'].focus();
			
		}
	}
}

//funzione che controlla la lunghezza del campo ora. Nel caso sia minore del dovuto cancella il campo e sposta il focus sul campo stesso. Da mettere sull'evento onblur	
function controllaOraProposta(){

	var oggetto = document.all['txtOraProposta']; 

	if (oggetto.value != ''){
		
		if (oggetto.value.toString().length < 5) {
		
			alert (' Formato ora errato \n\n Inserire l\'ora nel formato HH:MM'); 
			oggetto.value = '';
			oggetto.focus();
			
		}

	}
}

//funzione che controlla che il valore della diuresi sia maggiore uguale a 100
function controllaDiuresi(){

	var oggetto=document.getElementById('txtDiuresi_L');

	if(oggetto.value !='' && oggetto.value <100){
	
		alert('Attenzione! Il valore deve essere superiore a 100 ml');
		oggetto.value = '';
		oggetto.focus();
	
	}

}