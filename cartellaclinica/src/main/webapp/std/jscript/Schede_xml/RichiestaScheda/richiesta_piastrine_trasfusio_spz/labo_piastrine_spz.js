var _filtro_list = null;
var P_registra = 'OK';

var gUrgenza0 = 'Routine';
var gUrgenza2 = 'Urgente';
var gUrgenza3 = 'Urgentissimo';
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


    WindowCartella.utilMostraBoxAttesa(false);
	jQuery("#groupPrestazioniLabo").hide();		//la listbox con le prestazioni viene nascosta. per visualizzare l'header bisogna decommentare html_attributi il campo groupPrestazioniLabo||togliere||..||PerVisualizzare||		
	caricamento();		
			
	switch (_STATO_PAGINA){

		// 	INSERIMENTO ////////////////////////////////
		case 'I':
			
			// Valorizzo Data e Ora Proposta in quanto nascoste
			setDataOraPrelievo();
			
			// Intestazione Corretta
			var cdcRichiesta = parent.$('#divGroupCDC').find("#lblTitleCDC");
			cdcRichiesta.html('Invio Richiesta di PIASTRINE ');
			
			jQuery("#txtUnita").blur(function(){	controllaUnita(); });
			
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			jQuery("#txtOraTrasfusio").blur(function(){ oraControl_onblur(document.getElementById('txtOraTrasfusio')); });
			
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			jQuery("#txtOraTrasfusio").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraTrasfusio')); });
			
			jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
			jQuery("#txtDataTrasfusio").blur(function(){	controllaDataProposta(); });

			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });
			
			jQuery("#txtValAttuale").keyup(function(){ NS_CONTROLLI.controllaLunghezza('txtValAttuale', 4); });
			jQuery("#txtPeso").keyup(function(){NS_CONTROLLI.controllaLunghezza('txtPeso', 4); });
			
			valorizzaMed();
			nascondiCampi();
			
			if(typeof document.EXTERN.URGENZA != 'undefined'){setUrgenzaScheda();}
			
		break;
		
		// MODIFICA ////////////////////////////////
		case 'E':
			
			jQuery("#groupUrgenzaLabo").hide();		//NASCONDO LA SELEZIONE DELL'URGENZA
			
			//INTESTAZIONE CORRETTA
			try{
				var cdcRichiesta = parent.$('#divGroupCDC').find("#lblTitleCDC");
				cdcRichiesta.html('Invio Richiesta di : PIASTRINE ');
			}catch(e){}
			
			setUrgenzaScheda();
			setObbligoFromUrgenza(document.getElementById('hUrgenza').value);
						
			jQuery("#txtUnita").blur(controllaUnita());
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });
			
			// Controllo Lunghezza massima 4 per PLT e Peso
			jQuery("#txtValAttuale").keyup(function(){ NS_CONTROLLI.controllaLunghezza('txtValAttuale', 4); });
			jQuery("#txtPeso").keyup(function(){NS_CONTROLLI.controllaLunghezza('txtPeso', 4); });
			
			//ONLOAD  body
			valorizzaMed();			

			$('#groupUrgenzaLabo').hide();

		break;
			
		// LETTURA ////////////////////////////////
		case 'L':
			
			jQuery("#groupUrgenzaLabo").hide();		//NASCONDO LA SELEZIONE DELL'URGENZA
			
			//Intestazione Corretta
			try{
				var cdcRichiesta = parent.$('#divGroupCDC').find("#lblTitleCDC");
				cdcRichiesta.html('Invio Richiesta di : PIASTRINE ');
			}catch(e){}
			
			setUrgenzaScheda();
			setObbligoFromUrgenza(document.getElementById('hUrgenza').value);
			
			jQuery("#txtUnita").blur(controllaUnita());
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });

			//ONLOAD  body
			valorizzaMed();
			setUrgenzaScheda();
			try{				
				document.all['lblRegistraLabo'].parentElement.parentElement.style.display = 'none';
			}catch(e){};
			
			if(document.EXTERN.LETTURA.value== 'S'){
				HideLayer('groupUrgenzaLabo');
			}			
		break;
	}
});

function caricamento(){
	
	try {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtDataProposta);
		oDateMask.attach(document.dati.txtDataTrasfusio);
	}catch(e){
		//alert(e.description);
	}

	// Nascondo Data e Ora Prelievo
	$('#lblDataProposta').parent().parent().css('display','none');
	
	document.all.lblTitleUrgenza_L.innerText = 'Grado Urgenza';
	impostaButtonUrgenza();	
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
function setUrgenza(){
	
	if(_STATO_PAGINA == 'I'){
		document.all.lblTitleUrgenza_L.innerText = 'Grado Urgenza';
		var urgenza = document.all.hUrgenza.value;
	}

	//controllo se la pagina è in modalità di inserimento
	if (_STATO_PAGINA == 'I'){
	
		svuotaListBox(document.dati.cmbPrestRich_L);     // svuoto il listbox degli esami e il campo nascosto
			
		switch(urgenza){
			// Non urgente
			case '0':
				
				if (document.all.lblTitleUrgenza_L.innerText != ''){
					//controllo se l'urgenza prima del click è diversa
					document.dati.HelencoEsami.value = '';
					
				}
				document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' ROUTINE    ';
				document.all.lblTitleUrgenza_L.className = '';
				addClass(document.all.lblTitleUrgenza_L,'routine');
				setObbligoFromUrgenza('0');
				//apriContenitoreLabo();
				break;
			
			// Urgenza
			case '2':
				
				if (document.all.lblTitleUrgenza_L.innerText != ''){
					//controllo se l'urgenza prima del click è diversa
					document.dati.HelencoEsami.value = '';
					
				}
				
				document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' URGENZA    ';
				document.all.lblTitleUrgenza_L.className = '';
				addClass(document.all.lblTitleUrgenza_L,'urgenza');
				setObbligoFromUrgenza('2');
				//apriContenitoreLabo();
				break;
		}
		return;
	
	}else{	
		
		alert ('Impossibile modificare il grado di urgenza');	
	}
}

//funzione che 'prepara' i dati e valorizza i campi nascosti per il salvataggio. Alla fine lancia registra()
function preSalvataggio(){	
	
	//var controindicazioni = '';
	var esami;
	var metodiche;
	var materiali;
	var doc = document.dati;
	var sql='SELECT iden from radsql.tab_esa where cod_esa=\'07\' ';

	dwr.engine.setAsync(false);	
	//alert("select ("+sql+") from dual");
	toolKitDB.getResultData("select ("+sql+") from dual", callBack);
	dwr.engine.setAsync(true);
	
	function callBack(resp){
		
		try{
			esami = resp;
		}catch(e){alert(e.description)}

		$("#HelencoEsami").val(esami);
	}
		
	doc.HelencoMetodiche.value ='T';
	doc.Hmateriali.value ='0'; 


	esami = doc.HelencoEsami.value;
	//alert('esami : ' + esami);
	metodiche = doc.HelencoMetodiche.value;
	materiali = doc.Hmateriali.value;
	
	//	Se in Inserimento o modifica, valorizza il cdc_destinatario
	if (document.EXTERN.LETTURA.value == 'N'){			
		doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
	}
	
	//alert(doc.HcmbRepDest.value);
	if(document.getElementById('Hiden_op_rich').value ==''){
		document.getElementById('Hiden_op_rich').value = document.getElementById('USER_ID').value ;
	}
	
	//alert(document.getElementById('Hiden_op_rich').value);
	
	//	Obbliagatorietà di scelta di almeno una prestazione
	var al = '';
		
		if (doc.HelencoEsami.value == ''){			
			al = '- Scegliere almeno una Prestazione';		
		}
		if (doc.txtOraProposta.value == '' && doc.txtOraProposta.STATO_CAMPO == 'O'){			
			al += '\n\n- Inserire Orario Programmato Prelievo ';	
		}		
		if (doc.hUrgenza.value == '' && doc.txtOraProposta.STATO_CAMPO == 'O'){			
			al += '\n\n- Inserire Urgenza Prelievo ';		
		}		
		if (al != ''){	
			alert ('allerta : ' + al);
			return;
		}
		
		//controllo la lunghezza dell'ora e il formato
		controllaOraProposta();
			
	  var debug = 'IDEN: ' + document.EXTERN.IDEN.value;
//	  debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
//	  debug += '\nUTE_INS: ' + document.all.Hiden_op_rich.value;
	 // debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
	  debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
//	  debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
//	  debug += '\nCONTROINDICAZIONI: ' + doc.Hiden_controindicazioni.value;
	  debug += '\nESAMI: ' + doc.HelencoEsami.value;
	  debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
	  debug += '\nURGENZA: ' + doc.hUrgenza.value;
//	  debug += '\nNOTE: ' + doc.txtNote_L.value;
//	  debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
//	  debug += '\nQUESITO: ' + doc.txtQuesito_L.value;
//	  debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;
	  debug += '\nMATERIALI: ' + doc.Hmateriali.value;

	 //alert('debug: '+debug);

	if(_STATO_PAGINA == 'E'){
		alert('La Richiesta e\' stata modificata pertanto occorre ristampare l\'etichetta.');
	}
 
	registra();
}

function chiudi(){
	//alert(parent.name);
	if(parent.name == 'WHALE_winVisRich'){
		parent.opener.aggiorna();
		self.close();
	}else{
        WindowCartella.apriWorkListRichieste();
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

//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){
	document.all['lblMotAnn_L'].parentElement.style.display = 'none';
	document.all['txtMotivoAnnullamento_L'].parentElement.style.display = 'none';
	//document.all['txtDataRichiesta_L'].parentElement.style.display = 'none';
	//document.all['lblDataRichiesta_L'].parentElement.style.display = 'none';
	//document.all['txtOraRichiesta_L'].parentElement.style.display = 'none';
	//document.all['lblOraRichiesta_L'].parentElement.style.display = 'none';
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

function setDataOraPrelievo(){	
	
	var dataOdierna		= new Date();
	var dataPrelievo 	= clsDate.getData(dataOdierna,'DD/MM/YYYY');
	var oraPrelievo		= clsDate.getOra(dataOdierna);
	
	$('#txtDataProposta').val(dataPrelievo);
	$('#txtOraProposta').val(oraPrelievo);
	
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
	try
	{
		jQuery('#'+ idCampo ).datepick({onClose: function(){jQuery(this).focus();}, showOnFocus: false,  showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});
	}
	catch(e) {alert('Message Error: '+e.message);}		
}



function setObbligoFromUrgenza(urgenzaPassata){

	
	if(urgenzaPassata == '0'){
		if($('#urgenzaObbligoCampi').val() == '0' && _STATO_PAGINA == 'I'){
			//do nothing
		}else{
			//rendo obbligatori i campi in caso di non urgenza
			dis_obbliga(document.getElementById('txtDataTrasfusio'),'O','lblDataTrasfusio');
			dis_obbliga(document.getElementById('txtValAttuale'),'O','lblValAttuale');
			//dis_obbliga(document.getElementById('cmbMotivoRichiesta'),'O','lblMotivoRichiesta');
			
			$('#txtDataTrasfusio').parent().attr('class','').addClass('classTdField_O');
			$('#txtValAttuale').parent().attr('class','').addClass('classTdField_O');
			//$('#cmbMotivoRichiesta').parent().attr('class','').addClass('classTdField_O');
			$('#lblDataTrasfusio').parent().attr('class','').addClass('classTdLabel_O');
			$('#lblValAttuale').parent().attr('class','').addClass('classTdLabel_O');
			//$('#lblMotivoRichiesta').parent().attr('class','').addClass('classTdLabel_O');

			//disobbligo i campi che avevo obbligato (eventualmente) prima			
			jQuery("#lblMedContattato").parent().attr('class','').addClass("classTdLabel");		
			jQuery("#cmbMedContattato").parent().attr('class','').addClass("classTdField");		
			dis_obbliga(document.getElementById('lblMedContattato'),'E');
			dis_obbliga(document.getElementById('cmbMedContattato'),'E');
			
			$('#urgenzaObbligoCampi').val(0);
		}
	}else{
		if($('#urgenzaObbligoCampi').val() == 2 || $('#urgenzaObbligoCampi').val() == 3){
			//do nothing
		}else{
			dis_obbliga(document.getElementById('cmbMedContattato'),'O','lblMedContattato');
			$('#cmbMedContattato').parent().attr('class','').addClass('classTdField_O');
			$('#lblMedContattato').parent().attr('class','').addClass('classTdLabel_O');
			
			//disobbligo i campi che avevo obbligato (eventualmente) prima
			dis_obbliga(document.getElementById('txtDataTrasfusio'),'E');
			dis_obbliga(document.getElementById('txtValAttuale'),'E');
			//dis_obbliga(document.getElementById('cmbMotivoRichiesta'),'E');
			dis_obbliga(document.getElementById('lblDataTrasfusio'),'E');
			dis_obbliga(document.getElementById('lblValAttuale'),'E');
			//dis_obbliga(document.getElementById('lblMotivoRichiesta'),'E');
			
			$('#txtDataTrasfusio').parent().attr('class','').addClass('classTdField');
			$('#txtValAttuale').parent().attr('class','').addClass('classTdField');
			//$('#cmbMotivoRichiesta').parent().attr('class','').addClass('classTdField');
			$('#lblDataTrasfusio').parent().attr('class','').addClass('classTdLabel');
			$('#lblValAttuale').parent().attr('class','').addClass('classTdLabel');
			//$('#lblMotivoRichiesta').parent().attr('class','').addClass('classTdLabel');

			$('#urgenzaObbligoCampi').val(2);		
		}
	}
	// Lego i campi alle loro label
	jQuery("#txtUnita").attr("STATO_CAMPO_LABEL","lblUnita");
	jQuery("select[name=cmbMotivoRichiesta]").attr("STATO_CAMPO_LABEL","lblMotivoRichiesta");
}

function dis_obbliga(obj,stato,label){

	if (label){
		obj.STATO_CAMPO_LABEL = label;
	}else{
		if(obj.STATO_CAMPO_LABEL){
			obj.STATO_CAMPO_LABEL = '';
		}
	}
	
	obj.STATO_CAMPO = stato;
	obj.parentElement.STATO_CAMPO = stato;
	
	// alert(obj + '  ' + stato + ' ' + label );
	// alert('obj.STATO_CAMPO: '+obj.STATO_CAMPO);
	// alert('obj.parentElement.STATO_CAMPO: '+obj.STATO_CAMPO);
}

function impostaButtonUrgenza(){
	jQuery(".pulsanteUrgenza0 a").remove();
	jQuery(".pulsanteUrgenza0").html('<A href="javascript:document.all.hUrgenza.value=\'0\';setUrgenza();">' + gUrgenza0 + '</A>');
	jQuery(".pulsanteUrgenza2 a").remove();
	jQuery(".pulsanteUrgenza2").html('<A href="javascript:document.all.hUrgenza.value=\'2\';setUrgenza();">' + gUrgenza2 + '</A>');
	jQuery(".pulsanteUrgenza3 a").remove();
	jQuery(".pulsanteUrgenza3").html('<A href="javascript:document.all.hUrgenza.value=\'3\';setUrgenza();">' + gUrgenza3 + '</A>');

}

function controllaUnita(){
	
	if(isNaN(document.getElementById('txtUnita').value)){
		alert('In serire solo valori numerici');
		document.getElementById('txtUnita').value = '';
	}else if(document.getElementById('txtUnita').value < 1 || document.getElementById('txtUnita').value > 10){
		alert('inserire un valore compreso tra 1 e 10');
		document.getElementById('txtUnita').value = '';
	}else{
		null;
	}
}

NS_CONTROLLI =  {
		
	controllaLunghezza:function(idCampo, length){
		
		var valoreCampo	= $('#'+idCampo).val();
		if(valoreCampo.length > length){
			alert(' Il Valore Immesso Risulta essere Troppo Lungo! \n Lunghezza Massima Consentita: ' + length);
			$('#'+idCampo).val(valoreCampo.substring(0,4));
		}
	}

}
