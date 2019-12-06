/**
 * File JavaScript in uso dalla scheda 'RICHIESTA_ANATOMIA_PATOLOGICA'.
 * 
 * @author  gianlucab
 * @version 1.1
 * @since   2014-09-22
 */
var _filtro_list = null;
var urgenzaGenerale = '';
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

		// 	INSERIMENTO ////////////////////////////////
		case 'I':
		
			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			
			//ONBLUR  txtDataProposta, txtDataRicetta
			jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
			jQuery("#txtDataRicetta").blur(function(){	controllaDataProposta(); });
			
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
			//HideLayer('groupUrgenzaLabo');
			//HideLayerFieldset('divGroupUrgenzaLabo');
			nascondiCampi();
			
		break;
		
		// MODIFICA ////////////////////////////////
		case 'E':
			
			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
		
			//ONBLUR  txtDataProposta, txtDataRicetta
			jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
			jQuery("#txtDataRicetta").blur(function(){	controllaDataProposta(); });
			
			//ONBLUR  txtNumImp
			jQuery("#txtNumImp").blur(function(){ controllaCampiNumerici(document.dati.txtNumImp,document.getElementById('lblNumImp'));});
					
			//ONBLUR  txtAltezza
			jQuery("#txtAltezza").blur(function(){ controllaCampiNumerici(document.dati.txtAltezza ,document.all['lblAltezza']); });
			
			//ONBLUR  txtPeso
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });
					
			//ONLOAD  body
			document.all['lblStampa'].parentElement.style.display = 'none';
			setUrgenzaScheda();
			//valorizzaMed();
			//$(".datepick-trigger").hide();
			//HideLayer('groupUrgenzaLabo');
			//HideLayerFieldset('divGroupUrgenzaLabo');
			nascondiCampi();
			
		break;
			
		// LETTURA ////////////////////////////////
		case 'L':
			
			//ONLOAD  body
			//valorizzaMed();
			setUrgenzaScheda();
			document.all['lblStampa'].parentElement.style.display = 'none';
			document.all['lblRegistraLabo'].parentElement.parentElement.style.display = 'none';
			if(document.EXTERN.LETTURA.value== 'S'){
				//HideLayer('groupUrgenzaLabo');
				HideLayerFieldset('divGroupUrgenzaLabo');
			}
			nascondiCampi();		
			
		break;
	}
});

function caricamento(statoPagina){
	
	//funzione che carica la data proposta se arriva in input
	switch(statoPagina) {
		case 'I':
			caricaDataOraInput();
			DATA_PROPOSTA.addEvent();
			if ($('input[name=Hint_est]').val() == 'E') // Esterno
				NS_FUNCTIONS.setCampoStato('txtNumImp', 'lblNumImp', 'O');
			break;
		case 'E':
			DATA_PROPOSTA.addEvent();
			if ($('input[name=Hint_est]').val() == 'E') // Esterno
				NS_FUNCTIONS.setCampoStato('txtNumImp', 'lblNumImp', 'O');
			break;
		case 'L': default:
			break;
	}
	
	//jQuery("#txtNumImp").parent().attr("colSpan", "10");
	jQuery("#btPlusImp").parent().attr("colSpan", "1");
	jQuery(".pulsanteUrgenza1 a").text('Intraoperatorio');
	
	document.getElementById('hTerapiaAnt').parentElement.style.display='none';
	
	try {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtDataProposta);
		oDateMask.attach(document.dati.txtDataRicetta);
	}catch(e){
		//alert(e.description);
	}
	
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
}

/**
 * Funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico 
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


//funzione che modifica la label del div a seconda del tipo esame (grado di urgenza)
function setUrgenza(conferma){
	//controllo se la pagina è in modalità di inserimento
	if (_STATO_PAGINA == 'I' || _STATO_PAGINA == 'E'){
		var lblTitleUrgenza_L = 'Tipo Esame';
		
		if (urgenzaGenerale ==''){
			urgenzaGenerale=document.getElementById('hUrgenza').value;
		} else if (document.all.hUrgenza.value == urgenzaGenerale) {
			return;
		} /*else if (conferma && document.dati.HelencoEsami.value != '' && !confirm('Attenzione! In seguito al cambio di tipo di esame verranno cancellate le analisi già scelte. Procedere ugualmente?')) {
			return;
		}*/
		
		var urgenza = document.all.hUrgenza.value;
		document.all.lblTitleUrgenza_L.innerText = lblTitleUrgenza_L;
		
		//svuotaListBox(document.dati.cmbPrestRich_L);     // svuoto il listbox degli esami e il campo nascosto
			
		switch(urgenza){
			// Non urgente
			case '0':

				/*if (document.all.lblTitleUrgenza_L.innerText == '    '+lblTitleUrgenza_L+':  ' + ' ROUTINE    '){*/
				if(urgenzaGenerale !=  urgenza){
					//controllo se l'urgenza prima del click è diversa
					document.dati.HelencoEsami.value = '';
				}
				
				urgenzaGenerale='0';
								
				document.all.lblTitleUrgenza_L.innerText = '    '+lblTitleUrgenza_L+':  ' + ' ROUTINE    ';
				document.all.lblTitleUrgenza_L.className = '';
				addClass(document.all.lblTitleUrgenza_L,'routine');
				//apriContenitoreLabo();
				break;
			
			// Urgenza differita
			case '1':

				/*if (document.all.lblTitleUrgenza_L.innerText == '    '+lblTitleUrgenza_L+':  ' + ' URGENZA    '){*/
				if(urgenzaGenerale != urgenza){
					//controllo se l'urgenza prima del click è diversa
					document.dati.HelencoEsami.value = '';
				}
				
				urgenzaGenerale='1';
				
				document.all.lblTitleUrgenza_L.innerText = '    '+lblTitleUrgenza_L+':  ' + ' INTRAOPERATORIO    ';
				document.all.lblTitleUrgenza_L.className = '';
				addClass(document.all.lblTitleUrgenza_L,'urgenzaDifferita');
				//apriContenitoreLabo();
				break;
				
			// Urgenza
			case '2':
				
				/*if (document.all.lblTitleUrgenza_L.innerText == '    '+lblTitleUrgenza_L+':  ' + ' INTRAOPERATORIO    '){*/
				if(urgenzaGenerale != urgenza){
					//controllo se l'urgenza prima del click è diversa
					document.dati.HelencoEsami.value = '';
				}

				urgenzaGenerale='2';
				
				document.all.lblTitleUrgenza_L.innerText = '    '+lblTitleUrgenza_L+':  ' + ' URGENZA    ';
				document.all.lblTitleUrgenza_L.className = '';
				addClass(document.all.lblTitleUrgenza_L,'urgenza');
				//apriContenitoreLabo();
				break;
		}
		return;
	
	}else{
		alert ('Impossibile modificare il tipo di esame.'); // grado di urgenza
	}
}

//funziona che modifica la label in modalità visualizzazione/modifica
function setUrgenzaScheda(){
	var lblTitleUrgenza_L = 'Tipo Esame';
	
	if (urgenzaGenerale ==''){
		urgenzaGenerale=document.EXTERN.URGENZA.value;
	}
	
	var urgenza = document.EXTERN.URGENZA.value;
	document.all.lblTitleUrgenza_L.innerText = lblTitleUrgenza_L;

	document.all.hUrgenza.value = urgenza;

		switch(urgenza){
			// Non urgente
			case '0':
				urgenzaGenerale='0';
				document.all.lblTitleUrgenza_L.innerText = '    '+lblTitleUrgenza_L+':  ROUTINE    ';
				document.all.lblTitleUrgenza_L.className = '';
				addClass(document.all.lblTitleUrgenza_L,'routine');
				break;
			
			// Urgenza differita
			case '1':

				urgenzaGenerale='1';
				
				document.all.lblTitleUrgenza_L.innerText = '    '+lblTitleUrgenza_L+':  INTRAOPERATORIO    ';
				document.all.lblTitleUrgenza_L.className = '';
				addClass(document.all.lblTitleUrgenza_L,'urgenzaDifferita');
				break;
			
			// Emergenza
			case '2':

				urgenzaGenerale='2';
				
				document.all.lblTitleUrgenza_L.innerText = '    '+lblTitleUrgenza_L+':  URGENZA    ';
				document.all.lblTitleUrgenza_L.className = '';
				addClass(document.all.lblTitleUrgenza_L,'urgenza');
				break;

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
	
	//controllo se viene espresso o non espresso il consenso
	jQuery("[name='chkTerapiaAnt']").each(function(){
		//alert(jQuery(this).val());
		if(jQuery(this).attr("checked")==true){				
			document.getElementById('hTerapiaAnt').value = jQuery(this).val();
		}
	});

	//alert(doc.cmbPrestRich_L.options.length);
	//	Valorizza HelencoEsami, HelencoMetodiche, Hmateriali leggendo i valori della ListBox cmbPrestRich_L dopo averli splittati [@] e ciclati
	for(var i = 0; i < doc.cmbPrestRich_L.options.length; i++){
		esaMetodica = doc.cmbPrestRich_L.options[i].value.split('@');

		if(esami != ''){
			esami += '#';
			metodiche += '#';
			corpo += '#';
			note += '#';
			materiali += '#';
		}		
		
		esami += esaMetodica[0];
		metodiche += 'A';
		materiali += esaMetodica[1];
		corpo += esaMetodica[2];
		note += esaMetodica[3];
	}
	
	doc.HelencoEsami.value = esami;
	doc.HelencoMetodiche.value = metodiche;
	doc.Hmateriali.value = materiali;
	doc.HelencoCorpo.value = corpo;
	document.getElementById("Hnote").value = note;

	//	Se in Inserimento o modifica, valorizza il cdc_destinatario
	if (document.EXTERN.LETTURA.value == 'N'){			
		doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
	}

	// controllo la lunghezza dell'ora e il formato
	// controllaOraProposta();
	
	var debug = 'IDEN: ' + doc.Hiden.value;
	debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
	debug += '\nUTE_INS: ' + String(doc.Hiden_op_rich.value);
	//debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
	debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
	debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
	 /*debug += '\nCONTROINDICAZIONI: ' + document.getElementById("Hiden_controindicazioni").value;*/
	debug += '\nESAMI: ' + doc.HelencoEsami.value;
	debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
	debug += '\nMATERIALI: ' + doc.Hmateriali.value;
	debug += '\nPARTI DEL CORPO: ' + doc.HelencoCorpo.value;
	debug += '\nNOTE ESAMI: ' + document.getElementById("Hnote").value;
	debug += '\nURGENZA: ' + doc.hUrgenza.value;
	debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
	debug += '\nQUESITO: ' + doc.txtInformazioni_L.value;
	debug += '\nNOTE: ' + doc.txtNote_L.value;
	debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;
	//alert(debug);
	
	registra();
}

function stampa_scheda_richiesta(){//TODO
	var sf= '{TESTATA_RICHIESTE.IDEN}='+document.EXTERN.KEY_ID.value;
	var finestra = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_PATO_SV&stampaReparto=RICHIESTA_GENERICA_PATO_SV&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra){	
		finestra.focus();
	}else{
		finestra = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_PATO_SV&stampaReparto=RICHIESTA_GENERICA_PATO_SV&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}
}

//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){
	document.all['lblMotAnn_L'].parentElement.style.display = 'none';
	document.all['txtMotivoAnnullamento_L'].parentElement.style.display = 'none';
	document.all['lblControindicazioni_L'].parentElement.style.display = 'none';
	document.all['cmbControindicazioni'].parentElement.style.display = 'none';
	document.all['txtDataRichiesta_L'].parentElement.style.display = 'none';
	document.all['lblDataRichiesta_L'].parentElement.style.display = 'none';
	document.all['txtOraRichiesta_L'].parentElement.style.display = 'none';
	document.all['lblOraRichiesta_L'].parentElement.style.display = 'none';
	//HideLayer('groupOperatoriLabo');
	HideLayerFieldset('divGroupOperatoriLabo');
	$('hTerapiaAnt').parent().hide();
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
function apriContenitoreLabo(){
	
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
	
	var finestra = new Object();
	if(document.EXTERN.LETTURA.value !="S" ){
		
		url = "servletGenerator?KEY_LEGAME=SCELTA_ESAMI_PATO&Hiden_pro="+iden_Pro+"&URGENZA="+urgenza+"&REPARTO="+document.EXTERN.HrepartoRicovero.value+"&IDPAGINA="+idpagina;
		finestra = window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
		//alert (url);
	}
	
	try{
		WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
	}catch(e){
		
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

function chiediConferma() {
	if (document.EXTERN.LETTURA.value == 'S'){
		top.apriWorkListRichieste();
	} else {
		chiudi();
	}
}

var DATA_PROPOSTA = {
		
		riga:function(indice){
			
			var action = jQuery("#btPlus"+indice).parent().attr('action');
			var idRiga = (indice == '' ? '0' : indice);

			//alert('action: '+action + '\nidRiga: '+ idRiga);
			
			switch(action){
			
				case 'add': 
						DATA_PROPOSTA.aggiungiRiga();
						break;
				
				case 'remove': 
						DATA_PROPOSTA.eliminaRiga(idRiga);
						break; 

				default:
					break;
			}
			
		},
	
		aggiungiRiga:function(){
			
			if(!DATA_PROPOSTA.controllo(numeroRiga)){return alert('Compilare i campi data e ora prelievo prima di procedere all\'inserimento di una nuova riga');}
			
			var prec = (numeroRiga = 0 ? '' : numeroRiga);
			numeroRiga++;

			var html= "<TR id = tr"+numeroRiga+"><TD class=classTdLabelLink_O STATO_CAMPO=\"O\">"+
				"<LABEL id=lblDataProposta"+numeroRiga+"  name=\"lblDataProposta\">Data programmata prelievo</LABEL></TD>"+
				"<TD class=classTdField_O_O STATO_CAMPO=\"O\" STATO_CAMPO_LABEL=\"lblDataProposta\">"+
				"<INPUT id=txtDataProposta"+numeroRiga+" name=txtDataProposta"+numeroRiga+" class=\"dp\" maxLength=10 size=10 STATO_CAMPO=\"O\" STATO_CAMPO_LABEL=\"lblDataProposta\" length=\"10\" max_length=\"10\" >"+
				 "</INPUT></TD>" +
				"<TD class=classTdLabel_O_O STATO_CAMPO=\"O\"><LABEL id=lblOraProposta"+numeroRiga+" name=\"lblOraProposta"+numeroRiga+"\">Orario programmato prelievo</LABEL></TD>"+
				"<TD class=classTdField_O_O STATO_CAMPO=\"O\" STATO_CAMPO_LABEL=\"lblOraProposta\">"+
				"<INPUT id=txtOraProposta"+numeroRiga+" name=txtOraProposta"+numeroRiga+" class=op STATO_CAMPO=\"O\" STATO_CAMPO_LABEL=\"lblOraProposta\" jQuery1341932397154=\"20\"> </INPUT></TD>"+
				//"<TD style=\"WIDTH: auto\" class=\"classTdLabel btPlus\" colSpan=9 STATO_CAMPO=\"E\">"+
				"<TD style=\"WIDTH: auto\" class=\"classTdLabel btMinus\" colSpan=9 STATO_CAMPO=\"E\">"+
				"<LABEL indice="+numeroRiga+" id=btPlus"+numeroRiga+" name=\"btPlus\">&nbsp;</LABEL></TD></TR>";

			jQuery("#groupDatiRichiestaLabo").find('table').prepend(html);
			
			DATA_PROPOSTA.addEventRow(prec, numeroRiga);
			
		},
		
		eliminaRiga:function(idx){
			
			jQuery("#tr"+idx).remove();
			
		},
		
		checkDuplica:function(){
			
			var date_p = '';
			var ore_p = '';
			var utente = document.EXTERN.USER_ID.value;
			var user_login = document.EXTERN.USER_LOGIN.value;
			var key_legame = document.EXTERN.KEY_LEGAME.value;
			var idenXML = document.EXTERN.IDEN.value;
			
			//alert(idenXML);
			
			jQuery(".dp").each(function(){
				
				if(date_p!=''){ date_p += '#'; }
				
				date_p += jQuery(this).val();
			});
			
			jQuery(".op").each(function(){
				
				if(ore_p!=''){ ore_p += '#'; }
				
				ore_p += jQuery(this).val();
			});
			
			//alert('Date: '+date_p+'\nOre'+ore_p+'\nUtente'+utente+'\nKey_legame'+key_legame+'\nIden dell\'XML'+idenXML+'\n');
			
			if(date_p != ''){
				WindowCartella.executeStatement("OE_Richiesta.xml","duplicaRichiesta",[utente, user_login, key_legame, date_p, ore_p, idenXML]);
			}
		},
		
		addEvent:function(){
			
			indice = (numeroRiga = '0' ? '':numeroRiga);
			
			jQuery("#btPlus"+indice).parent().addClass("btPlus");
			jQuery("#btPlus"+indice).parent().attr("action","add");
			jQuery("#btPlus"+indice).parent().parent().attr('id','tr0');
			jQuery("#btPlus"+indice).parent().click(function(){DATA_PROPOSTA.riga(indice);});
		},
		
		addEventRow:function(prec,numeroRiga){
			
			//jQuery("#btPlus"+prec).parent().removeClass("btPlus").addClass("btMinus").attr("action","remove");
			//jQuery("#btPlus"+prec).parent().unbind('click',false);
			//jQuery("#btPlus"+prec).parent().bind('click',function(){DATA_PROPOSTA.riga(prec);});
			
			jQuery("#btPlus"+numeroRiga).parent().unbind('click',false);
			jQuery("#btPlus"+numeroRiga).parent().bind('click',function(){DATA_PROPOSTA.riga(numeroRiga);});
			jQuery("#btPlus"+numeroRiga).parent().attr("action","remove");
			//jQuery("#btPlus"+numeroRiga).parent().attr("action","add");
			
			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta"+numeroRiga).blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta'+numeroRiga)); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta"+numeroRiga).keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta'+numeroRiga)); });
			
			//ONBLUR  txtDataProposta
			jQuery("#txtDataProposta"+numeroRiga).blur(function(){controllaDataProposta(numeroRiga); });
			var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
			oDateMask.attach(document.getElementById('txtDataProposta'+numeroRiga));
					
			jQuery("#txtDataProposta"+numeroRiga).datepick({
				onClose: function(){jQuery(this).focus();}, 
				showOnFocus: false,  
				showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'
			});
			
			jQuery("#lblDataProposta"+numeroRiga).click(function(){
				if(_STATO_PAGINA != 'L' && _STATO_PAGINA !='E' ){
					document.getElementById('txtDataProposta'+numeroRiga).value=getToday();
				}
			});
		},
		
		controllo:function(numeroRiga){

			if(jQuery("#txtDataProposta"+numeroRiga).val() == "" || jQuery("#txtOraProposta"+numeroRiga).val() == ""){
				return false;
			}else{
				return true;
			}
		}		
};