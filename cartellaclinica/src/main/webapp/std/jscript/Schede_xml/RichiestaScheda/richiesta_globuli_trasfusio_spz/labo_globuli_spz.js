// var _filtro_list 	= null;
var P_registra 		= 'OK';
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
	// Tolgo La Listbox delle Prestazioni
	jQuery("#groupPrestazioniLabo").hide();	
	caricamento();
		
	switch (_STATO_PAGINA){

		// 	INSERIMENTO ////////////////////////////////
		case 'I':
				
			NS_CONFIGURAZIONI.setIntestazioneRichiesta();
			
			//VALORIZZO LA DATA E  ORA PROPOSTE
			NS_CONFIGURAZIONI.setDataOraPrelievo();

			jQuery("#txtUnita").blur(function(){	NS_CONTROLLI.controllaUnita(); });
			
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			jQuery("#txtOraTrasfusio").blur(function(){ oraControl_onblur(document.getElementById('txtOraTrasfusio')); });

			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			jQuery("#txtOraTrasfusio").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraTrasfusio')); });

			jQuery("#txtHb").keyup(function(){ NS_CONTROLLI.controllaLunghezza('txtHb', 4); });
			jQuery("#txtHt").keyup(function(){ NS_CONTROLLI.controllaLunghezza('txtHt', 4); });
			jQuery("#txtPeso").keyup(function(){ NS_CONTROLLI.controllaLunghezza('txtPeso', 4); });

			jQuery("#txtDataProposta").blur(function(){	NS_CONTROLLI.controllaDataProposta(); }); //
			jQuery("#txtDataTrasfusione").blur(function(){	NS_CONTROLLI.controllaDataProposta(); });
			
			jQuery("#txtPeso").blur(function(){ NS_CONTROLLI.controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });
			
			jQuery("#radControllo2").click(function(){ NS_OBBLIGHI.disObbligaDataOraPrelievo(1); });	// TOGLIE OBBLIGO DI DATA E ORA PROPOSTA
			jQuery("#radControllo1").click(function(){ NS_OBBLIGHI.disObbligaDataOraPrelievo(0); });	// AGGIUNGE OBBLIGO DATA E ORA PROPOSTA
			
			NS_CONFIGURAZIONI.valorizzaMed();			
			NS_SHOW.nascondiCampi();
			NS_CONFIGURAZIONI.hideMotivoRichiesta();
			
			if(typeof document.EXTERN.URGENZA != 'undefined'){NS_URGENZA.setUrgenzaScheda();}
			
		break;
		
		// MODIFICA ////////////////////////////////
		case 'E':
			// IMPOSTO OBBLIGO IN BASE AI CAMPI
			var urgenza = document.getElementById('URGENZA').value;
			document.getElementById('hUrgenza').value = urgenza;
		
			NS_OBBLIGHI.setObbligoFromUrgenza(urgenza);
			NS_SHOW.visualizzaControllo(urgenza);

			//NASCONDO IL DIV DELLE PRESTAZIONI E QUELLO DELLE URGENZE
			$("#groupPrestazioniLabo").hide();	
			$("#groupUrgenzaLabo").hide();

			//INTESTAZIONE CORRETTA
			var cdcRichiesta = parent.$('#divGroupCDC').find("#lblTitleCDC");
			cdcRichiesta.html('Invio Richiesta di : GLOBULI ROSSI ');

			jQuery("#txtUnita").blur(function(){NS_CONTROLLI.controllaUnita(); });

			jQuery("#txtPeso").blur(function(){ NS_CONTROLLI.controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });

			jQuery("#radControllo2").click(function(){NS_OBBLIGHI.disObbligaDataOraPrelievo(1); });
			jQuery("#radControllo1").click(function(){NS_OBBLIGHI.disObbligaDataOraPrelievo(0); });			
			
			//ONLOAD  body
			NS_CONFIGURAZIONI.valorizzaMed();
			NS_URGENZA.setUrgenzaScheda();
			NS_URGENZA.setComboFromUrgenza(document.getElementById('hUrgenza').value, 'E');
			
			// Controllo Lunghezza massima 4 per HB, HT e Peso
			jQuery("#txtHb").keyup(function(){ NS_CONTROLLI.controllaLunghezza('txtHb', 4); });
			jQuery("#txtHt").keyup(function(){ NS_CONTROLLI.controllaLunghezza('txtHt', 4); });
			jQuery("#txtPeso").keyup(function(){ NS_CONTROLLI.controllaLunghezza('txtPeso', 4); });
			
			
		break;
			
		// LETTURA ////////////////////////////////
		case 'L':

			// IMPOSTO OBBLIGO IN BASE AI CAMPI
			var urgenza = document.getElementById('URGENZA').value;
			document.getElementById('hUrgenza').value = urgenza;
		
			NS_OBBLIGHI.setObbligoFromUrgenza(urgenza);
			NS_SHOW.visualizzaControllo(urgenza);
			//NASCONDO IL DIV DELLE PRESTAZIONI E QUELLO DELLE URGENZE
			$("#groupPrestazioniLabo").hide();	
			$("#groupUrgenzaLabo").hide();

			//INTESTAZIONE CORRETTA
			try{
				var cdcRichiesta = parent.$('#divGroupCDC').find("#lblTitleCDC");
				cdcRichiesta.html('Invio Richiesta di : GLOBULI ROSSI ');
			}catch(e){}
			//ONBLUR txtUnita
			jQuery("#txtUnita").blur(function(){NS_CONTROLLI.controllaUnita(); });
			
			//ONBLUR  txtPeso
			jQuery("#txtPeso").blur(function(){ NS_CONTROLLI.controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });
			
			//ONCLICK CONTROLLO GRUPPO
			jQuery("#radControllo2").click(function(){NS_OBBLIGHI.disObbligaDataOraPrelievo(1); });
			jQuery("#radControllo1").click(function(){NS_OBBLIGHI.disObbligaDataOraPrelievo(0); });	
		
			//ONLOAD  body
			NS_CONFIGURAZIONI.valorizzaMed();
			NS_URGENZA.setUrgenzaScheda();
			document.all['lblRegistraLabo'].parentElement.parentElement.style.display = 'none';
			$("#groupUrgenzaLabo").css("display","none");
			
		break;
	}
	
	
});

function caricamento(){
	
	try {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtDataProposta);
		oDateMask.attach(document.dati.txtDataTrasfusione);
	}catch(e){}
	
	document.all.lblTitleUrgenza_L.innerText = 'Grado Urgenza';

	NS_URGENZA.impostaButtonUrgenza();
	try{NS_SHOW.nascondiControllo()}catch(e){};
	
	//imposto campi obbligatori in caso di modifica
	if(_STATO_PAGINA == 'E'){
		
		if(document.getElementById('hControllo').value == '03'){
			NS_OBBLIGHI.disObbligaDataOraPrelievo(0);
		}else if(document.getElementById('hControllo').value == '04'){
			NS_OBBLIGHI.disObbligaDataOraPrelievo(1);
		}
	}	
	// Verifico Se ci sono TS Aperti.
	NS_CONTROLLI.verifyTS(_STATO_PAGINA);
	
}

var NS_CONTROLLI = {

	verifyTS : function(STATO_PAGINA){
		var statoPage	= STATO_PAGINA;
		var idenAnag 	= document.EXTERN.Hiden_anag.value;
		var TS			= '';	

		dwr.engine.setAsync(false);
		toolKitDB.getResultData("select count(*) from INFOWEB.testata_richieste where iden_anag='"+idenAnag+"' and cdc='TRASFUSIO' and id_richiesta_2>to_char(sysdate,'YYYYMMDDHH24MI')",callBack);
		dwr.engine.setAsync(true);	
		
		function callBack(resp){
			TS = resp;
			if(TS > 0)
			{
				if(statoPage == 'I'){
					alert('Per questa richiesta risulta essere già aperta un TS.');
					//top.inserisciRichiestaConsulenza();
				}else if(statoPage == 'E'){
						//_STATO_PAGINA = 'L';
						if(!confirm("Per questo paziente risulta essere già aperto un Type & Screen. Continuare con La modifica?")){
                            WindowCartella.apriWorkListRichieste();
					}
				}
				//Non faccio nulla se sono in sola lettura				
			}
		}
	},
	controllaCampiNumerici : function (campo, label){
		
		var descrizione = label.innerText;
		var contenutoDopoReplace = campo.value.replace (',','.');
		
		campo.value = contenutoDopoReplace;
		
//		alert ('contenuto dopo replace: '+campo.value);
//		alert ('campo: '+campo);
//		alert ('label: '+label);
//		alert ('contenuto: '+contenutoDopoReplace);
//		alert ('descrizione: '+descrizione);
		
		if (isNaN(campo.value)){
			alert ('il valore immesso in '+' " ' +descrizione+' " '+' non è un numero. Il campo richiede un valore numerico');
			campo.value= '';
			campo.focus();
			return;		
		}
	},
	controllaDataProposta : function (){

		var dataProposta= document.all['txtDataProposta'].value;
		
		//alert('dataProposta: '+dataProposta);

		if (dataProposta!='')
		{		
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
		
	},
	controllaOraProposta : function () {
		
		var oggetto = document.all['txtOraProposta']; 

		if (oggetto.value != '')
		{			
			if (oggetto.value.toString().length < 4) {
			
				alert (' Formato ora errato \n\n Inserire l\'ora nel formato HH:MM'); 
				oggetto.value = '';
				oggetto.focus();
			}
		}
	},
	controllaUnita : function(){
		var unita = document.getElementById('txtUnita');
		if(unita == ''){
			return;
		}else if(isNaN(unita.value)){
			alert('Inserire solo valori numerici');
			unita.value = '';
			unita.focus();
		}else if(unita.value < 1 || unita.value > 10){
			alert('Inserire un valore compreso tra 1 e 10');
			unita.value = '';
			unita.focus();
		}else{
			null;
		}
	},
	// Controlla Ora Inserita
	verificaOra : function(obj){
		
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
	},
	controllaLunghezza:function(idCampo, length){
		
		var valoreCampo	= $('#'+idCampo).val();
		if(valoreCampo.length > length){
			alert(' Il Valore Immesso Risulta essere Troppo Lungo! \n Lunghezza Massima Consentita: ' + length);
			$('#'+idCampo).val(valoreCampo.substring(0,4));
		}
	}
	
}

var NS_SHOW = {

	visualizzaControllo : function(urgenza){
		
		if(urgenza == '0' || urgenza == '2'){
			NS_OBBLIGHI.disObbligaDataOraPrelievo(0);
			$("#groupInfoClinicheLaboControllo").hide();
			$('#hControllo').val('');
			// Resetto I radio per il Controllo
			resetRadio(document.getElementById('radControllo2'));
			resetRadio(document.getElementById('radControllo2'));
		}else if(urgenza == '3'){
			$("#groupInfoClinicheLaboControllo").show();
		}
	},
	nascondiControllo : function (){
		var hControllo = document.getElementById('hControllo').value;
		if(hControllo != '03' || hControllo != '04'){
			jQuery("#groupInfoClinicheLaboControllo").hide();	
		}else{
			jQuery("#groupInfoClinicheLaboControllo").show();
		}
	},
	nascondiCampi : function(){
		document.all['lblMotAnn_L'].parentElement.style.display = 'none';
		document.all['txtMotivoAnnullamento_L'].parentElement.style.display = 'none';
		HideLayer('groupOperatoriLabo');
	}
}

var NS_OBBLIGHI = {
	
		dis_obbliga : function (obj,stato,label){
		
		if (label){
			obj.STATO_CAMPO_LABEL = label;
		}else{
			if(obj.STATO_CAMPO_LABEL){
				obj.STATO_CAMPO_LABEL = '';
			}
		}
		
		obj.STATO_CAMPO = stato;
		obj.parentElement.STATO_CAMPO = stato;

	},
	
	obbligaCampoProposta : function (campoCondizione, campoDestinazione, labelDestinazione){
		
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
	},
	
	// gestisce obbligatorieta DATA e ORA in base al CONTROLLO
	disObbligaDataOraPrelievo : function (controllo){
		
		if(controllo == '1'){
			
			if(document.getElementById('lblDataProposta').parentElement.STATO_CAMPO == 'E'){
				// Do nothing
				$('#hControllo').val('04');
			}else{
				jQuery("#lblDataProposta").parent().removeClass("classTdLabelLink_O_O").removeClass("classTdLabelLink_O").addClass("classTdLabelLink");		
				jQuery("#txtDataProposta").parent().removeClass("classTdField_O_O").removeClass("classTdField_O").addClass("classTdField");		
				jQuery("#txtOraProposta").parent().removeClass("classTdField_O_O").removeClass("classTdField_O").addClass("classTdField");
				jQuery("#lblOraProposta").parent().removeClass("classTdLabel_O_O").removeClass("classTdLabel_O").addClass("classTdLabel");

				NS_OBBLIGHI.dis_obbliga(document.getElementById('lblDataProposta'),'E');
				NS_OBBLIGHI.dis_obbliga(document.getElementById('txtDataProposta'),'E');
				NS_OBBLIGHI.dis_obbliga(document.getElementById('lblOraProposta'),'E');
				NS_OBBLIGHI.dis_obbliga(document.getElementById('txtOraProposta'),'E');
			}		
			
			//	alert('stato campo td TXT data : ' + document.getElementById('txtDataProposta').parentElement.className + '\n' +
			//	'stato campo td LBL data : ' + document.getElementById('lblDataProposta').parentElement.className + '\n' +
			//	' - stato campo td TXT ora : ' + document.getElementById('txtDataProposta').parentElement.className + '\n' +
			//	' - stato campo td LBL ora : ' + document.getElementById('lblDataProposta').parentElement.className);
					
			$('#hControllo').val('04');
			
		}else{
			if(document.getElementById('txtDataProposta').parentElement.STATO_CAMPO =='O'){
				// Do nothing
				$('#hControllo').val('03');
			}else{
				try{
					NS_OBBLIGHI.dis_obbliga(document.getElementById('lblDataProposta'),'O');
					NS_OBBLIGHI.dis_obbliga(document.getElementById('txtDataProposta'),'O', 'lblDataProposta');
					NS_OBBLIGHI.dis_obbliga(document.getElementById('lblOraProposta'),'O');
					NS_OBBLIGHI.dis_obbliga(document.getElementById('txtOraProposta'),'O', 'lblOraProposta');
				
				
					document.getElementById('lblDataProposta').parentElement.className = document.getElementById('lblDataProposta').parentElement.className + '_O';
					document.getElementById('txtDataProposta').parentElement.className = document.getElementById('txtDataProposta').parentElement.className + '_O';
					document.getElementById('lblOraProposta').parentElement.className = document.getElementById('lblOraProposta').parentElement.className + '_O';
					document.getElementById('txtOraProposta').parentElement.className = document.getElementById('txtOraProposta').parentElement.className + '_O';
				}catch(e){}
				$('#hControllo').val('03');

			}
		}
	},
	
	setObbligoFromUrgenza : function (urgenzaPassata){
		if(urgenzaPassata == '0'){
			
			if($('#urgenzaObbligoCampi').val() == '0'){
				// Do nothing
			}else{
				// Obbligo i Campi per l'urgenza 
				NS_OBBLIGHI.dis_obbliga(document.getElementById('txtDataTrasfusio'),'O','lblDataTrasfusione');
				NS_OBBLIGHI.dis_obbliga(document.getElementById('txtHb'),'O','lblHb');
				
				$('#txtDataTrasfusio').parent().attr('class','').addClass('classTdField_O');
				$('#lblDataTrasfusione').parent().attr('class','').addClass('classTdLabel_O');
				$('#txtHb').parent().attr('class','').addClass('classTdField_O');
				$('#lblHb').parent().attr('class','').addClass('classTdLabel_O');
				
				//Disobbligo i Campi eventualmente obbligati Precedentemente
				NS_OBBLIGHI.dis_obbliga(document.getElementById('lblMedContattato'),'E');
				NS_OBBLIGHI.dis_obbliga(document.getElementById('cmbMedContattato'),'E');
				
				$("#cmbMedContattato").parent().attr("class","").attr("class","classTdField");
				$("#lblMedContattato").parent().attr("class","").attr("class","classTdLabel");
				
				$('#urgenzaObbligoCampi').val(0);
			}
		}else if(urgenzaPassata == '2'){
			if($('#urgenzaObbligoCampi').val() == 2){
				// Do nothing
			}else{
				// Obbligo i Campi per l'urgenza 
				NS_OBBLIGHI.dis_obbliga(document.getElementById('cmbMedContattato'),'O','lblMedContattato');			
				
				$('#cmbMedContattato').parent().attr('class','').addClass('classTdField_O');
				$('#lblMedContattato').parent().attr('class','').addClass('classTdLabel_O');
			
				// Disobbligo i Campi (Eventualmente) resi obbligatori precedentemente
				NS_OBBLIGHI.dis_obbliga(document.getElementById('txtDataTrasfusio'),'E');
				NS_OBBLIGHI.dis_obbliga(document.getElementById('lblDataTrasfusione'),'E');
				
				jQuery("#txtDataTrasfusio").parent().attr("class","").attr("class","classTdField");		
				jQuery("#lblDataTrasfusione").parent().attr("class","").attr("class","classTdLabel");			

				NS_OBBLIGHI.dis_obbliga(document.getElementById('txtHb'),'E');
				NS_OBBLIGHI.dis_obbliga(document.getElementById('lblHb'),'E');
				jQuery("#lblHb").parent().attr("class","").attr("class","classTdLabel");;
				jQuery("#txtHb").parent().attr("class","").attr("class","classTdField");
				
				$('#urgenzaObbligoCampi').val(2);
			}
		}
		else
		{
			if($('#urgenzaObbligoCampi').val() == 3){
				// Do nothing
			}
			else
			{
				// Obbligo CampiPer Urgenza 
				NS_OBBLIGHI.dis_obbliga(document.getElementById('cmbMedContattato'),'O','lblMedContattato');			
				
				$('#cmbMedContattato').parent().attr('class','').addClass('classTdField_O');
				$('#lblMedContattato').parent().attr('class','').addClass('classTdLabel_O');
				
				// Disobbligo i Campi (Eventualmente) resi obbligatori precedentemente
				NS_OBBLIGHI.dis_obbliga(document.getElementById('txtDataTrasfusio'),'E');
				NS_OBBLIGHI.dis_obbliga(document.getElementById('lblDataTrasfusione'),'E');
				
				jQuery("#txtDataTrasfusio").parent().attr("class","").attr("class","classTdField");		
				jQuery("#lblDataTrasfusione").parent().attr("class","").attr("class","classTdLabel");			

				NS_OBBLIGHI.dis_obbliga(document.getElementById('txtHb'),'E');
				NS_OBBLIGHI.dis_obbliga(document.getElementById('lblHb'),'E');
				jQuery("#lblHb").parent().attr("class","").attr("class","classTdLabel");;
				jQuery("#txtHb").parent().attr("class","").attr("class","classTdField");

				$('#urgenzaObbligoCampi').val(3);
			}
		}
		// Lego i campi alle loro label
		jQuery("#txtUnita").attr("STATO_CAMPO_LABEL","lblUnita");
		jQuery("select[name=cmbMotivoRichiesta]").attr("STATO_CAMPO_LABEL","lblMotivoRichiesta");
	}
}

var NS_URGENZA = {
	// Modifica Urgenza in fase di Scelta
	setUrgenza : function(){
		if (_STATO_PAGINA == 'I'){
			var urgenza = document.all.hUrgenza.value;
			document.all.lblTitleUrgenza_L.innerText = 'Grado Urgenza';
		}
	
		//controllo se la pagina è in modalità di inserimento
		if (_STATO_PAGINA == 'I'){
						
			//svuotaListBox(document.dati.cmbPrestRich_L);     // svuoto il listbox degli esami e il campo nascosto				
			switch(urgenza){
				// Non urgente
				case '0':
					
					document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' ROUTINE    ';
					document.all.lblTitleUrgenza_L.className = '';
					addClass(document.all.lblTitleUrgenza_L,'routine');
					NS_OBBLIGHI.setObbligoFromUrgenza('0');
					NS_SHOW.visualizzaControllo('0');
					NS_URGENZA.setComboFromUrgenza(0);
					break;
				
				// Urgenza
				case '2':
					
					document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' URGENTE    ';
					document.all.lblTitleUrgenza_L.className = '';
					addClass(document.all.lblTitleUrgenza_L,'urgenza');
					NS_OBBLIGHI.setObbligoFromUrgenza('2');
					NS_SHOW.visualizzaControllo('2');
					NS_URGENZA.setComboFromUrgenza(2);
					break;
				
				case '3':
								
					document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' URGENTISSIMA    ';
					document.all.lblTitleUrgenza_L.className = '';
					addClass(document.all.lblTitleUrgenza_L,'emergenza');
					NS_OBBLIGHI.setObbligoFromUrgenza('3');
					NS_SHOW.visualizzaControllo('3');		//Visualizza i campi per il Controllo
					NS_URGENZA.setComboFromUrgenza(3);
					break;
			}
			return;
		
		}else{	
			
			alert ('Impossibile modificare il grado di urgenza');	
		}
	},
	// Gestisce URGENZA in dase di caricamento pagina (lettura/Modifica)
	setUrgenzaScheda : function(){
		
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
			
				// Urgenza
			case '3':
				document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' EMERGENZA    ';
				document.all.lblTitleUrgenza_L.className = '';
				addClass(document.all.lblTitleUrgenza_L,'emergenza');
				break;
		}
	},
	// Imposta Il Button per la scelta dell'urgenza sostituendo quanto in HTML_ATTRIBUTI
	impostaButtonUrgenza : function(){
		
		var gUrgenza0 = 'Routine';
		var gUrgenza2 = 'Urgente';
		var gUrgenza3 = 'Urgentissimo';
		
		jQuery(".pulsanteUrgenza0 a").remove();
		jQuery(".pulsanteUrgenza0").html('<A href="javascript:document.all.hUrgenza.value=\'0\';NS_URGENZA.setUrgenza();">' + gUrgenza0 + '</A>');
		jQuery(".pulsanteUrgenza2 a").remove();
		jQuery(".pulsanteUrgenza2").html('<A href="javascript:document.all.hUrgenza.value=\'2\';NS_URGENZA.setUrgenza();">' + gUrgenza2 + '</A>');
		jQuery(".pulsanteUrgenza3 a").remove();
		jQuery(".pulsanteUrgenza3").html('<A href="javascript:document.all.hUrgenza.value=\'3\';NS_URGENZA.setUrgenza();">' + gUrgenza3 + '</A>');
		
	},
	setComboFromUrgenza : function(urgenzaPassata, statoPagina){
		
		if (statoPagina != 'E')
		{			
			jQuery("div#groupInfoClinicheLabo table:first-child").show();
			
			jQuery("select[name=cmbMotivoRichiesta]").removeAttr("disabled");
			jQuery("select[name=cmbMotivoRichiesta]").attr("STATO_CAMPO_LABEL","lblMotivoRichiesta");
			jQuery("select[name=cmbMotivoRichiesta] option[value='']").attr("selected","selected");	
			if (urgenzaPassata == 3) {
				
				jQuery("select[name=cmbMotivoRichiesta] option").each(function(){
					$(this).removeAttr("disabled");
					if($(this).val() != 'URG'){
						$(this).attr("disabled","disabled");
					}else{
						$(this).attr("selected","selected");
					}
				});
				
				jQuery("select[name=cmbMotivoRichiesta]").attr("disabled","disabled")
				
			}else{
				
				jQuery("select[name=cmbMotivoRichiesta] option").each(function(){
					$(this).removeAttr("disabled");
					if($(this).val() == 'URG'){
						$(this).attr("disabled","disabled");
					}
				});
				
			}
		
		}else{
			// Dato che il motivo della richiesta è legato all'urgenza non puoò essere modificato in stato E
			jQuery("select[name=cmbMotivoRichiesta]").attr("disabled","disabled")
		}
		
		
	}
}

var NS_CONFIGURAZIONI = {
	
		setIntestazioneRichiesta : function(){
		
		var cdcRichiesta = parent.$('#divGroupCDC').find("#lblTitleCDC");
		cdcRichiesta.html('Invio Richiesta di GLOBULI ROSSI');
	},
	setDataOraPrelievo : function(){
		
		var dataOdierna		= new Date();
		var dataPrelievo 	= clsDate.getData(dataOdierna,'DD/MM/YYYY');
		var oraPrelievo		= clsDate.getOra(dataOdierna);
		
		$('#txtDataProposta').val(dataPrelievo);
		$('#txtOraProposta').val(oraPrelievo);
		
	},
	
	valorizzaMed : function(){
		
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
	},
	// In Base al Controllo Associa un esame alla richiesta
	associaProfilo : function(codiceProfilo){
		
		dwr.engine.setAsync(false);	
		toolKitDB.getResultData("select RADSQL.concat_fields ('select iden from radsql.tab_esa where cod_dec =''" + codiceProfilo + "'' and attivo = ''S'' ',chr(35)) from dual", callBack);
		dwr.engine.setAsync(true);
		
		function callBack(resp){		
			$('#HelencoEsami').val('');
			$('#HelencoEsami').val(resp+'#');		
		}
		
	},
	addCalendar : function (idCampo){
		try	{
			jQuery('#'+ idCampo ).datepick({onClose: function(){jQuery(this).focus();}, showOnFocus: false,  showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});
		}catch(e) {
			alert('Message Error: '+e.message);
		}
	},
	hideMotivoRichiesta : function(){
		jQuery("div#groupInfoClinicheLabo table:first-child").hide();
	}
}

function preSalvataggio(){	
	
	var checkGruppo	= $('#hControllo').val();
	var esami;
	var metodiche;
	var materiali;
	var idenEsa;
	var doc 		= document.dati;
	var sql			= "select iden from (SELECT iden from radsql.tab_esa where cod_esa='02' and branca ='T' order by iden desc) where rownum = 1 ";
	var urgenza		= $('#hUrgenza').val();
	
	dwr.engine.setAsync(false);	
	
	//alert("select ("+sql+") from dual");
	toolKitDB.getResultData("select ("+sql+") from dual", callBack);
	dwr.engine.setAsync(true);
	
	function callBack(resp){
		idenEsa = resp;				
	}
	
	//Gestisco la presenza di Controllo Gruppo e in base all'urgenza associo profili diversi
	if(urgenza < 3 ){
		
		NS_CONFIGURAZIONI.associaProfilo('002');
		doc.HelencoMetodiche.value ='T#T';
		doc.Hmateriali.value ='0#0';
		$('#HelencoEsami').val($('#HelencoEsami').val() + idenEsa);
	
	}else if(urgenza == 3 && checkGruppo == '03'){
	
		NS_CONFIGURAZIONI.associaProfilo('138');
		doc.HelencoMetodiche.value ='T#T';
		doc.Hmateriali.value ='0#0';
		$('#HelencoEsami').val($('#HelencoEsami').val() + idenEsa);
		
	}else{
		
		doc.HelencoMetodiche.value ='T';
		doc.Hmateriali.value ='0';
		$('#HelencoEsami').val(idenEsa);
		
	}

	esami = doc.HelencoEsami.value;
	metodiche = doc.HelencoMetodiche.value;
	materiali = doc.Hmateriali.value;

	//	Se in Inserimento o modifica, valorizza il cdc_destinatario
	if (document.EXTERN.LETTURA.value == 'N'){			
		doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
	}

	if(document.getElementById('Hiden_op_rich').value ==''){
		document.getElementById('Hiden_op_rich').value = document.getElementById('USER_ID').value ;
	}

	//	Obbliagatorietà di scelta di almeno una prestazione
	var al = '';

		if (doc.hUrgenza.value == '' && doc.txtOraProposta.parentElement.STATO_CAMPO == 'O'){			
			al += '\n\n- Inserire Urgenza Prelievo ';		
		}		
		if (al != ''){	
			alert ('allerta : ' + al);
			return;
		}
		
	// Obbligo Controllo solo in caso di richiesta Urgentissima
	if(!(document.getElementById('radControllo2').checked)  && !(document.getElementById('radControllo1').checked) &&document.getElementById('hUrgenza').value == '3'){
		alert('Hai inserito una richiesta URGENTISSIMA. Verifica di aver selezionato il tipo di controllo');
		return;
	}

	NS_CONTROLLI.controllaOraProposta();
			
	  var debug = 'IDEN: ' + document.EXTERN.IDEN.value;
	  debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
	  debug += '\nUTE_INS: ' + document.all.Hiden_op_rich.value;
	  // debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
	  debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
	  debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
	  // debug += '\nCONTROINDICAZIONI: ' + doc.Hiden_controindicazioni.value;
	  debug += '\nESAMI: ' + doc.HelencoEsami.value;
	  debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
	  debug += '\nURGENZA: ' + doc.hUrgenza.value;
	  debug += '\nNOTE: ' + doc.txtNote_L.value;
	  debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
	  // debug += '\nQUESITO: ' + doc.txtQuesito_L.value;
	  debug += '\nCONTROLLO: ' + document.getElementById('hControllo').value;
	  debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;
	  debug += '\nMATERIALI: ' + doc.Hmateriali.value;
	  
	  //alert('debug: '+debug);
	
	if(_STATO_PAGINA == 'E'){
		alert('La Richiesta e\' stata modificata pertanto occorre ristampare l\'etichetta.');
	}

	registra();
}