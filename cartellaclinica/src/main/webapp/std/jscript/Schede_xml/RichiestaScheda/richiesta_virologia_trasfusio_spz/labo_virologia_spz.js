var _filtro_list 	= null;
var P_registra 		= 'OK';
var elencoEsaAppr	= '';
var gUrgenza0 		= 'Routine';
var gUrgenza2 		= 'Urgente';

// INTESTAZIONE TIPO RICHIESTA
var cdcRichiesta 	= parent.$('#divGroupCDC').find("#lblTitleCDC");
var WindowCartella 	= null;

jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    WindowCartella.utilMostraBoxAttesa(false);
	caricamento();

	
	
	switch (_STATO_PAGINA){

		// 	INSERIMENTO ////////////////////////////////
		case 'I':
		
			setUrgenza(0);	
			//INTESTAZIONE CORRETTA
			cdcRichiesta.html('Invio Richiesta di VIROLOGIA/BIOLOGIA MOLECOLARE');
			
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
			jQuery("#groupInfoClinicheFiglioFunicolo").hide();


			valorizzaMed();
			nascondiCampi();
			if(typeof document.EXTERN.URGENZA != 'undefined'){setUrgenzaScheda();}
			
		break;
		
		// MODIFICA ////////////////////////////////
		case 'E':
			
			//INTESTAZIONE CORRETTA
			cdcRichiesta.html('Invio Richiesta di VIROLOGIA/BIOLOGIA MOLECOLARE');
			
			jQuery("#txtAltezza").blur(function(){ controllaCampiNumerici(document.dati.txtAltezza ,document.all['lblAltezza']); });
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });
					
			//ONLOAD  body
			valorizzaMed();
			setUrgenzaScheda();
			if(document.EXTERN.MODIFICA.value== 'S'){HideLayer('groupUrgenzaLabo'); }
			$(".datepick-trigger").hide();
			
		break;
			
		// LETTURA ////////////////////////////////
		case 'L':
			
			//ONLOAD  body
			valorizzaMed();
			setUrgenzaScheda();
			document.all['lblRegistraLabo'].parentElement.parentElement.style.display = 'none';
			
			if(document.EXTERN.LETTURA.value== 'S')
				HideLayer('groupUrgenzaLabo');
			
		break;
	}
});

function caricamento(){
	
	try {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtDataProposta);
	}catch(e){}
	
	document.all.lblTitleUrgenza_L.innerText = 'Grado Urgenza';	
	impostaButtonUrgenza();
	
	dialog = document.createElement('div');
	dialog.id='dialog'; 
	dialog.className = 'jqmWindow jqmID1';
	document.body.appendChild(dialog);
	
	dialog2 = document.createElement('div');
	dialog2.id='dialog2'; 
	dialog2.className = 'jqmWindow jqmID1';
	document.body.appendChild(dialog2);
		
}

//Funzione richiamata all'apertura della pagina, valorizza la descrizione del Medico e/o quella delloperatore richiesdente se tipo_ute = I 
function valorizzaMed(){
	
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
function setUrgenza(urgenzaPassata){
	
	var urgenza = document.all.hUrgenza.value;	
	document.all.lblTitleUrgenza_L.innerText = 'Grado Urgenza';

	//Se cambia l'urgenza devo svuotare gli esami
	if(urgenzaPassata != urgenza){
		$('#HelencoEsami').val('');
		$('#cmbPrestRich_L').val(''); 
		$('#HelencoMetodiche').val('');
		$('#HMateriali').val('');		
	}
	
	//IMPOSTO IL CAMPO NASCOSTO DELL'URGENZA
	$('#hUrgenza').val(urgenzaPassata);

	if (_STATO_PAGINA == 'I'){
			
		switch(urgenzaPassata){
			
			case 0:
				document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' ROUTINE    ';
				document.all.lblTitleUrgenza_L.className = '';
				addClass(document.all.lblTitleUrgenza_L,'routine');
				break;		
				
			case 2:							
				document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' URGENZA    ';
				document.all.lblTitleUrgenza_L.className = '';
				addClass(document.all.lblTitleUrgenza_L,'urgenza');
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


//funzione che 'prepara' i dati e valorizza i campi nascosti per il salvataggio. Alla fine lancia registra()
function preSalvataggio(){	
	
	//var controindicazioni = '';
	var esami 			= '';
	var metodiche 		= '';
	var esaMetodica 	= '';
	var doc = document.dati;
	var materiali 		= '';

	//	Valorizza HelencoEsami, HelencoMetodiche, Hmateriali leggendo i valori della ListBox cmbPrestRich_L dopo averli splittati [@] e ciclati
	for(var i = 0; i < doc.cmbPrestRich_L.length; i++){
		
		esaMetodica = doc.cmbPrestRich_L[i].value.split('@');

			if(esami != ''){
				esami += '#';
				metodiche += '#';
				materiali += '#';
			}		
		
		esami += esaMetodica[0];
		metodiche += esaMetodica[1];
		materiali += esaMetodica [2];		

	}
	
	doc.HelencoEsami.value = '';
	doc.HelencoMetodiche.value ='';
	doc.Hmateriali.value =''; 
	doc.HelencoEsami.value = esami;
	doc.HelencoMetodiche.value = metodiche;
	doc.Hmateriali.value = materiali;	
	
//	alert('esami : ' + esami);
//	alert('metodiche : ' + metodiche);
//	alert('materiali : ' + materiali);
	
	//	Se in Inserimento o modifica, valorizza il cdc_destinatario
	if (document.EXTERN.LETTURA.value == 'N'){			
		doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
	}
		
	if(document.getElementById('Hiden_op_rich').value ==''){
		document.getElementById('Hiden_op_rich').value = document.getElementById('USER_ID').value ;		
		}
	
	//	Obbliagatorietà di scelta di almeno una prestazione
	var al = '';
		
		if (doc.HelencoEsami.value == ''){				
			al = '- Scegliere almeno una Prestazione';		
		}
		if (doc.txtOraProposta.value == '' && doc.txtOraProposta.STATO_CAMPO == 'O'){			
			al += '\n\n- Inserire Orario Programmato Prelievo ';		
		}
		
		if (al != ''){	
			alert ('allerta : ' + al);
			return;
		}
		
		//controllo la lunghezza dell'ora e il formato
		controllaOraProposta();
			
	  var debug = 'IDEN: ' ;
//	  debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
//	  debug += '\nUTE_INS: ' + document.all.Hiden_op_rich.value;
//	  debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
//	  debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
//	  debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
//	  debug += '\nCONTROINDICAZIONI: ' + doc.Hiden_controindicazioni.value;
	  debug += '\nESAMI: ' + doc.HelencoEsami.value;
	  debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
//	  debug += '\nURGENZA: ' + doc.hUrgenza.value;
//	  debug += '\nNOTE: ' + doc.txtNote_L.value;
//	  debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
//	  debug += '\nQUESITO: ' + doc.txtQuesito_L.value;
//	  debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;
	  debug += '\nMATERIALI: ' + doc.Hmateriali.value;

	 //alert(debug);
	
	if(_STATO_PAGINA == 'E'){
		alert('La Richiesta e\' stata modificata pertanto occorre ristampare l\'etichetta.');
	}

	if (P_registra == 'OK'){
		registra();
	}
}



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
	HideLayer('groupOperatoriLabo');
}

function controllaCampiNumerici(campo, label) {

	var descrizione = label.innerText;
	var contenutoDopoReplace = campo.value.replace (',','.');
	
	campo.value = contenutoDopoReplace;
	
	if (isNaN(campo.value)){
		alert ('il valore immesso in '+' " ' +descrizione+' " '+' non è un numero. Il campo richiede un valore numerico');
		campo.value= '';
		campo.focus();
		return;		
	}
}

// APRI SCELTA ESAMI
function apriContenitoreLabo(){
	
	var url 		= '';
	var urgenza 	= $('#hUrgenza').val();
	
	if(urgenza == '' || urgenza == null)		
		return alert('Scegliere il Grado di Urgenza.');

	url = "sceltaEsamiTrasfusio?" +
			"&URGENZA="+urgenza+
			"&REPARTO_RICHIEDENTE="+document.EXTERN.HrepartoRicovero.value+
			"&CDC_DESTINATARIO="+$('#DESTINATARIO').val()+
			"&TIPO=R"+
			"&METODICA=V";
	
	window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
	
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
		
			labelDestinazione.parentElement.className = ''; 
			addClass(labelDestinazione,'classTdLabel_O_O');
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
		
		if (oggetto.value.toString().length < 4) {
		
			alert (' Formato ora errato \n\n Inserire l\'ora nel formato HH:MM'); 
			oggetto.value = '';
			oggetto.focus();
		}
	}
}

function addCalendar(idCampo)
{
	try{
		jQuery('#'+ idCampo ).datepick({onClose: function(){jQuery(this).focus();}, showOnFocus: false,  showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});
	}
	catch(e) {alert('Message Error: '+e.message);}		
}

function chiudi(){

	if(parent.name == 'WHALE_winVisRich'){
		parent.opener.aggiorna();
		self.close();
	}else{
        WindowCartella.apriWorkListRichieste();
	}
}

function impostaButtonUrgenza(){
	
	jQuery(".pulsanteUrgenza0 a").remove();
	jQuery(".pulsanteUrgenza0").html('<A href="javascript:setUrgenza(0);apriContenitoreLabo()">' + gUrgenza0 + '</A>');
	jQuery(".pulsanteUrgenza2 a").remove();
	jQuery(".pulsanteUrgenza2").html('<A href="javascript:setUrgenza(2);apriContenitoreLabo()">' + gUrgenza2 + '</A>');

}

