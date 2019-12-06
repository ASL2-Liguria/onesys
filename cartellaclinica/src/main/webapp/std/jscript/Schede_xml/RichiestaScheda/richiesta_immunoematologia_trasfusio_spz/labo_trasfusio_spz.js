var WindowCartella = null;
var P_registra 			= 'OK';
var elencoEsaAppr		= '';
var NUMERO_FUNICOLO 	= 0;
var gUrgenza0 			= 'Routine';


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
			var cdcRichiesta 	= parent.$('#divGroupCDC').find("#lblTitleCDC");
			cdcRichiesta.html('Invio Richiesta di IMMUNOEMATOLOGIA');
			
			//Handler Generici
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });
			
			//NASCONDO I DATI DEL FIGLIO PER ESAME 'FUNICOLO'
			jQuery("#groupInfoClinicheFiglioFunicolo").hide();

			valorizzaMed();
			nascondiCampi();
			
		break;
		
		// MODIFICA ////////////////////////////////
		case 'E':
			
			//Intestazione Corretta
			try{
				var cdcRichiesta 	= parent.$('#divGroupCDC').find("#lblTitleCDC");
				cdcRichiesta.html('Invio Richiesta di IMMUNOEMATOLOGIA');
			}catch(e){}
			
			// Gestione Campi Funicolo				
			var existFunicolo	= document.getElementById('hFunicolo').value;
			var funicoloYN;
			existFunicolo		= existFunicolo.substring(0,2);

			if(existFunicolo ==  'S$'){				
				funicoloYN = 1;			
				NS_FUNICOLO.visualizzaFunicolo(funicoloYN);
				NS_FUNICOLO.loadFunicolo();
			}else{
				NS_FUNICOLO.visualizzaFunicolo(funicoloYN);
			}
			
			$('#groupUrgenzaLabo').hide();	

			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });
					
			//ONLOAD  body
			valorizzaMed();
			setUrgenzaScheda();
			
		break;
			
		// LETTURA ////////////////////////////////
		case 'L':
			
			//ONLOAD  body
			valorizzaMed();
			setUrgenzaScheda();
			cambiaPulsante();
			document.all['lblRegistraLabo'].parentElement.parentElement.style.display = 'none';
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
	}catch(e){}
	
	document.all.lblTitleUrgenza_L.innerText = 'Grado Urgenza';
	impostaButtonUrgenza();
	
}

// TIPO_UTE == 'M' ? VALORIZZA MED : VALORIZZA INF
function valorizzaMed(){
	
	if (document.EXTERN.LETTURA.value != 'S') {
		
		if (baseUser.TIPO == 'M'){
		
			document.dati.Hiden_MedPrescr.value 	= baseUser.IDEN_PER; 
			document.dati.txtMedPrescr.value 		= baseUser.DESCRIPTION;
			document.dati.Hiden_op_rich.value 		= baseUser.IDEN_PER; 
			document.dati.txtOpeRich_L.value 		= baseUser.DESCRIPTION;
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
	
	//Imposto il campo nascosto dell'urgenza
	$('#hUrgenza').val(urgenzaPassata);

	if (_STATO_PAGINA == 'I'){
	
		svuotaListBox(document.dati.cmbPrestRich_L);     // svuoto il listbox degli esami e il campo nascosto
			
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

function genera_stringa_codici(sel, carattere){
	
	var idx;
	var ret = '';
	
	for(idx = 0; idx < sel.length; idx++){
		if(ret != '')
			ret += carattere; //'*';
		
		ret += sel[idx].value;
	}
	
	return ret;
}


// GESTIONE URGENZA VISUALIZZAZIONE/MODIFICA 
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
			"&METODICA=I";
	
//	alert (url);
	
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

	var dataProposta= document.all['txtDataProposta'].value;

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

// CHECK FORMATO ORA PROPOSTA
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

//funzione che 'prepara' i dati e valorizza i campi nascosti per il salvataggio. Alla fine lancia registra()
function preSalvataggio(){	
	
	var esami 		= '';
	var metodiche 	= '';
	var esaMetodica = '';
	var doc 		= document.dati;
	var materiali 	= '';
	var existFunicolo	= document.getElementById('hFunicolo').value;
	existFunicolo		= existFunicolo.substring(0,2);
	
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
		if(esaMetodica[2] == '' || esaMetodica[2] == null)
			materiali += '0';
		else
			materiali += esaMetodica[2];

	}
	
	doc.HelencoEsami.value = '';
	doc.HelencoMetodiche.value ='';
	doc.Hmateriali.value =''; 
	doc.HelencoEsami.value = esami;
	doc.HelencoMetodiche.value = metodiche;
	doc.Hmateriali.value = materiali;

	if (existFunicolo == 'S$'){
		NS_FUNICOLO.setInputHidden();
		NS_FUNICOLO.setInputFunicoloIntegrazione();
	}
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
	try{	
	  var debug = 'IDEN: ' + doc.Hiden.value;
	  debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
	  debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
	  debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
	  debug += '\nESAMI: ' + doc.HelencoEsami.value;
	  debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
	  debug += '\nMATERIALI: ' + doc.Hmateriali.value;

	  //alert(debug);
	}catch(e){
		alert(e.description);
	}
	if(_STATO_PAGINA == 'E'){
		alert('La Richiesta e\' stata modificata pertanto occorre ristampare l\'etichetta.');
	}
	if (P_registra == 'OK'){
		registra();
	}
}

function impostaButtonUrgenza(){
	
	jQuery(".pulsanteUrgenza0 a").remove();
	jQuery(".pulsanteUrgenza0").html('<A href="javascript:setUrgenza(0);apriContenitoreLabo()">' + gUrgenza0 + '</A>');
	
}

function chiudi(){

	if(parent.name == 'WHALE_winVisRich'){
		parent.opener.aggiorna();
		self.close();
	}else{
        WindowCartella.apriWorkListRichieste();
	}
}

function setDataOraPrelievo(){
	
	var dataOdierna		= new Date();
	var dataPrelievo 	= clsDate.getData(dataOdierna,'DD/MM/YYYY');
	var oraPrelievo		= clsDate.getOra(dataOdierna);
	
	$('#txtDataProposta').val(dataPrelievo);
	$('#txtOraProposta').val(oraPrelievo);
	
}

var NS_FUNICOLO = {
		visualizzaFunicolo:function(valoreFunicolo){

			if(valoreFunicolo == 1){			
				
				//IMPOSTO OBBLIGATORIETA DEI CAMPI		
				obbligaCampo(document.getElementById('cmbSessoFiglioFunicolo'),document.getElementById('lblSessoFiglioFunicolo'));
				obbligaCampo(document.getElementById('txtNomeFiglioFunicolo'),document.getElementById('lblNomeFiglioFunicolo'));
				obbligaCampo(document.getElementById('txtCognFiglioFunicolo'),document.getElementById('lblCognFiglioFunicolo'));
				obbligaCampo(document.getElementById('txtDataFiglioFunicolo'),document.getElementById('lblDataFiglioFunicolo'));
				
				NS_CONFIGURAZIONI.addCalendar('txtDataFiglioFunicolo');				
				
				// Aggiungere la classe per il bottone
				jQuery("#btnAddFunicolo").parent().addClass("btnAddFunicolo");
				jQuery("#btnAddFunicolo").parent().attr("action","ADD");
				jQuery("#btnAddFunicolo").parent().attr("indice","");
				jQuery("#btnAddFunicolo").parent().click(function(){
					NS_FUNICOLO.addRemoveFunicolo(this.action);
				});
				
				// Controllo Data OnBlur
				jQuery("#txtDataFiglioFunicolo").blur(function(){
					controllaDataProposta(indice); 
				});
				var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
				oDateMask.attach(document.getElementById("txtDataFiglioFunicolo"));
				
				// Link Inserimento data Rapida
				jQuery("#lblDataFiglioFunicolo").click(function(){
					if(_STATO_PAGINA != 'L' && _STATO_PAGINA !='E' ){
						document.getElementById('txtDataFiglioFunicolo').value = getToday();
					}
				});
				
				// Mostro il Funicolo
				jQuery("#groupInfoClinicheFiglioFunicolo").show();
				
				NUMERO_FUNICOLO	= 1;
				
			}else{
				document.getElementById('cmbSessoFiglioFunicolo').STATO_CAMPO = 'E';
				document.getElementById('txtNomeFiglioFunicolo').STATO_CAMPO = 'E';
				document.getElementById('txtCognFiglioFunicolo').STATO_CAMPO = 'E';
				document.getElementById('txtDataFiglioFunicolo').STATO_CAMPO = 'E';
				
				jQuery("#groupInfoClinicheFiglioFunicolo").hide();
				
				NUMERO_FUNICOLO	= 0;
				
			}
			
		},
		
		// Funzione Wrapper di Tutto il Ciclo di Creazione delle riga
		addRemoveFunicolo:function(action, numeroFunicolo){
			
			NUMERO_FUNICOLO;
			var  nextFunicolo;
			//nFunicolo 			= nFunicolo == '1' ? '' : NUMERO_FUNICOLO;
			if(action == 'ADD')
			{			
				nextFunicolo	= parseInt(NUMERO_FUNICOLO)+1;
				NS_FUNICOLO.addHTML(nextFunicolo);				
				NS_FUNICOLO.addEventButton(nextFunicolo);
				NS_FUNICOLO.setGlobalFunicolo(action);				
			}
			else
			{
				NS_FUNICOLO.removeFunicolo(numeroFunicolo);
				NS_FUNICOLO.setGlobalFunicolo(action);
			}
		},
		// Appendo il Tr del Funicolo
		addHTML:function(indice){
			
			var html;
			html	=  '<TR id="trAddFunicolo' + indice + '"><TD class = "classTdLabel_O" STATO_CAMPO="E"><LABEL id = "lblCognFiglioFunicolo' + indice + '" STATO_CAMPO="O" name="lblCognFiglioFunicolo' + indice + '">Cognome Figlio</LABEL></TD>';
			html	+= '<TD class = "classTdField" STATO_CAMPO = "E"><INPUT id = "txtCognFiglioFunicolo' + indice + '" class = "text_class" name="txtCognFiglioFunicolo' + indice + '" STATO_CAMPO="O" STATO_CAMPO_LABEL="lblCognFiglioFunicolo' + indice + '"></INPUT></TD>'
			html	+= '<TD class = "classTdLabel_O" STATO_CAMPO = "E"><LABEL id = "lblNomeFiglioFunicolo" STATO_CAMPO="O" name="lblNomeFiglioFunicolo">Nome Figlio</LABEL></TD>'
			html	+= '<TD class = "classTdField" STATO_CAMPO = "E"><INPUT id = "txtNomeFiglioFunicolo' + indice + '" class="text_class" name="txtNomeFiglioFunicolo' + indice + '" STATO_CAMPO="O" STATO_CAMPO_LABEL="lblNomeFiglioFunicolo' + indice + '"></INPUT></TD>'
			html	+= '<TD class = "classTdLabelLink_O" STATO_CAMPO = "E"><LABEL id = "lblDataFiglioFunicolo' + indice + '" STATO_CAMPO="O" name="lblDataFiglioFunicolo' + indice + '">Data di Nascita Figlio</LABEL></TD>'
			html	+= '<TD class = "classTdField" STATO_CAMPO = "E"><INPUT id = "txtDataFiglioFunicolo' + indice + '" class="text_class" name="txtDataFiglioFunicolo' + indice + '" maxLength=10 size=10 STATO_CAMPO="O" STATO_CAMPO_LABEL="lblDataFiglioFunicolo' + indice + '" length="10" max_length="10"></INPUT></TD>'
			html	+= '<TD class = "classTdLabel_O" STATO_CAMPO = "E"><LABEL id = "lblSessoFiglioFunicolo' + indice + '" STATO_CAMPO="O" name="lblSessoFiglioFunicolo' + indice + '">Sesso Funicolo</LABEL></TD>'
			html	+= '<TD class = "classTdField" STATO_CAMPO = "E"><SELECT id = "cmbSessoFiglioFunicolo' + indice + '" name = "cmbSessoFiglioFunicolo' + indice + '" STATO_CAMPO="O" STATO_CAMPO_LABEL="lblSessoFiglioFunicolo' + indice + '"><OPTION selected value=""></OPTION><OPTION value=M>Maschio</OPTION><OPTION value=F>Femmina</OPTION></SELECT></TD>'
			html	+= '<TD class = "classTdLabel" colSpan = 5 STATO_CAMPO = "E"><LABEL name="btnAddFunicolo' + indice + '" id="btnAddFunicolo' + indice + '"></LABEL></TD></TR>';

			jQuery("DIV#groupInfoClinicheFiglioFunicolo table").prepend(jQuery(html));
		},
		
		// Imposto l'evento sul Bottone Nuovo Funicolo
		addEventButton:function(indice){

			var idCampoEvento	= 'txtDataFiglioFunicolo'+indice;
			jQuery("#btnAddFunicolo" + indice).parent().addClass("btnRemoveFunicolo");
			jQuery("#btnAddFunicolo" + indice).parent().attr("action","REMOVE");
			jQuery("#btnAddFunicolo" + indice).parent().attr("indice", indice);
			jQuery("#btnAddFunicolo" + indice).parent().click(function(){
				NS_FUNICOLO.addRemoveFunicolo(this.action,this.indice);
			});
			
			// Setto il Calendario	
			NS_CONFIGURAZIONI.addCalendar(idCampoEvento);
			
			// Controllo Data OnBlur
			jQuery("#txtDataFiglioFunicolo" + indice).blur(function(){
				controllaDataProposta(indice); 
			});
			var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
			oDateMask.attach(document.getElementById(idCampoEvento));

			jQuery("#lblDataFiglioFunicolo"+indice).click(function(){
				if(_STATO_PAGINA != 'L' && _STATO_PAGINA !='E' ){
					document.getElementById('txtDataFiglioFunicolo'+indice).value = getToday();
				}
			});
			
		},			
		
		// Rimuove il TR del rispettivo Funicolo
		removeFunicolo:function(indice){
			jQuery("#trAddFunicolo" + indice).remove();
		},
		
		// Imposta il Campo Nascosto
		setInputHidden:function(){
			var nomeFunicolo;
			var cognFunicolo;
			var dataFunicolo;
			var sessoFunicolo;
			var idxFunicolo;
			var inputHidden		= '';
			
			// Ciclo in Base al numero di Funicoli
			for (var i = 2;i <= NUMERO_FUNICOLO; i++)
			{				
				idxFunicolo 	= i;
				
				nomeFunicolo	= jQuery("#txtNomeFiglioFunicolo" + idxFunicolo).val();
				cognFunicolo	= jQuery("#txtCognFiglioFunicolo" + idxFunicolo).val();
				dataFunicolo	= jQuery("#txtDataFiglioFunicolo" + idxFunicolo).val();
				sessoFunicolo	= jQuery("#cmbSessoFiglioFunicolo" + idxFunicolo).val();
				sessoFunicolo 	= sessoFunicolo == 'M' ? 'Maschio' : 'Femmina';
				
				inputHidden		+= nomeFunicolo + '#' + cognFunicolo + '#' + dataFunicolo + '#' + sessoFunicolo + '@';
			}
			inputHidden	= 'S$' + inputHidden + '$' + NUMERO_FUNICOLO;			
			jQuery("#hFunicolo").val("");
			jQuery("#hFunicolo").val(inputHidden);
		},
		
		// Imposta il Campo Nascosto Necessario all'Integrazione
		setInputFunicoloIntegrazione:function(){
			
			var nomeFunicolo;
			var cognFunicolo;
			var dataFunicolo;
			var sessoFunicolo;
			var idxFunicolo;
			var inputFunicoloIntegrazione	= '';
						
			// Ciclo in Base al numero di Funicoli
			for (var i = 1;i <= NUMERO_FUNICOLO; i++)
			{				
				idxFunicolo 	= i;
				idxFunicolo 	= idxFunicolo == 1 ? '' : i;
				
				nomeFunicolo	= jQuery("#txtNomeFiglioFunicolo" + idxFunicolo).val();
				cognFunicolo	= jQuery("#txtCognFiglioFunicolo" + idxFunicolo).val();
				dataFunicolo	= jQuery("#txtDataFiglioFunicolo" + idxFunicolo).val();
				// sessoFunicolo	= jQuery("#cmbSessoFiglioFunicolo" + idxFunicolo).val();
				sessoFunicolo	= jQuery('[name="cmbSessoFiglioFunicolo'+ idxFunicolo+'"]').val();
				
				sessoFunicolo 	= sessoFunicolo == 'M' ? 'Maschio' : 'Femmina';
				
				if (idxFunicolo != NUMERO_FUNICOLO)
					inputFunicoloIntegrazione	+= nomeFunicolo + '#' + cognFunicolo + '#' + dataFunicolo + '#' + sessoFunicolo + '@';
				else
					inputFunicoloIntegrazione	+= nomeFunicolo + '#' + cognFunicolo + '#' + dataFunicolo + '#' + sessoFunicolo;
							
			}
			//alert(inputFunicoloIntegrazione);
			jQuery("#hFunicoloIntegrazione").val("");
			jQuery("#hFunicoloIntegrazione").val(inputFunicoloIntegrazione);
			
		},
		
		// Imposta la Variabile Globale per il numero totale di Funicoli
		setGlobalFunicolo:function(action){
			if(action == 'ADD')
				NUMERO_FUNICOLO++;			
			else
				NUMERO_FUNICOLO--;
				
		},
		
		// Imposta i Funicoli al Caricamento in fase di modifica
		loadFunicolo:function(){
			
			// Setto la variabile Globale
			var numeroFunicoli	= jQuery("#hFunicolo").val();
			numeroFunicoli		= numeroFunicoli.split('$');
			numeroFunicoli		= numeroFunicoli[2];
			NUMERO_FUNICOLO		= numeroFunicoli;

			// Setto le righe e le appendo
			var riga;
			var indice;
			
			var nomeFunicolo;
			var cognFunicolo;
			var dataFunicolo;
			var sessoFunicolo;

			for (var i = 2; i <= numeroFunicoli; i++)
			{
				indice 	= i;
				if (i == 1)
					continue;
				
				// Il Capo Nascosto E' un array di 3 Posizioni. Nella 2 (1) è inserita la concatenzazione da Splittare ulteriormente 
				var datiFunicolo	= jQuery("#hFunicolo").val();

				datiFunicolo		= datiFunicolo.split('$');
				datiFunicolo		= datiFunicolo[1];
				datiFunicolo		= datiFunicolo.split('@');
				datiFunicolo		= datiFunicolo[i-2];
				datiFunicolo		= datiFunicolo.split('#');
				nomeFunicolo		= datiFunicolo[0];
				cognFunicolo		= datiFunicolo[1];
				dataFunicolo		= datiFunicolo[2];
				sessoFunicolo		= datiFunicolo[3];
					
				riga	=  '<TR id="trAddFunicolo' + indice + '"><TD class = "classTdLabel_O" STATO_CAMPO="E"><LABEL id = "lblCognFiglioFunicolo' + indice + '" STATO_CAMPO="O" name="lblCognFiglioFunicolo' + indice + '">Cognome Figlio</LABEL></TD>';
				riga	+= '<TD class = "classTdField" STATO_CAMPO = "E"><INPUT id = "txtCognFiglioFunicolo' + indice + '" class = "text_class" name="txtCognFiglioFunicolo' + indice + '" STATO_CAMPO="O" STATO_CAMPO_LABEL="lblCognFiglioFunicolo' + indice + '" value="'+ cognFunicolo +'"></INPUT></TD>';
				riga	+= '<TD class = "classTdLabel_O" STATO_CAMPO = "E"><LABEL id = "lblNomeFiglioFunicolo' + indice + '" STATO_CAMPO="O" name="lblNomeFiglioFunicolo">Nome Figlio</LABEL></TD>';
				riga	+= '<TD class = "classTdField" STATO_CAMPO = "E"><INPUT id = "txtNomeFiglioFunicolo' + indice + '" class="text_class" name="txtNomeFiglioFunicolo' + indice + '" STATO_CAMPO="O" STATO_CAMPO_LABEL="lblNomeFiglioFunicolo' + indice + '" value="'+ nomeFunicolo +'"></INPUT></TD>';
				riga	+= '<TD class = "classTdLabelLink_O" STATO_CAMPO = "E"><LABEL id = "lblDataFiglioFunicolo' + indice + '" STATO_CAMPO="O" name="lblDataFiglioFunicolo' + indice + '">Data di Nascita Figlio</LABEL></TD>';
				riga	+= '<TD class = "classTdField" STATO_CAMPO = "E"><INPUT id = "txtDataFiglioFunicolo' + indice + '" class="text_class" name="txtDataFiglioFunicolo' + indice + '" maxLength=10 size=10 STATO_CAMPO="O" STATO_CAMPO_LABEL="lblDataFiglioFunicolo' + indice + '" length="10" max_length="10" value="'+ dataFunicolo +'"></INPUT></TD>';
				riga	+= '<TD class = "classTdLabel_O" STATO_CAMPO = "E"><LABEL id = "lblSessoFiglioFunicolo' + indice + '" STATO_CAMPO="O" name="lblSessoFiglioFunicolo' + indice + '">Sesso Funicolo</LABEL></TD>';
				riga	+= '<TD class = "classTdField" STATO_CAMPO = "E"><SELECT id = "cmbSessoFiglioFunicolo' + indice + '" name = "cmbSessoFiglioFunicolo' + indice + '" STATO_CAMPO="O" STATO_CAMPO_LABEL="lblSessoFiglioFunicolo' + indice + '"><OPTION selected value=""></OPTION><OPTION value=M>Maschio</OPTION><OPTION value=F>Femmina</OPTION></SELECT></TD>';
				riga	+= '<TD class = "classTdLabel" colSpan = 5 STATO_CAMPO = "E"><LABEL name="btnAddFunicolo' + indice + '" id="btnAddFunicolo' + indice + '"></LABEL></TD></TR>';

				// Prima di settare le varie opzioni bisogna appendere la riga
				jQuery("DIV#groupInfoClinicheFiglioFunicolo table").prepend(jQuery(riga));				
				$("#cmbSessoFiglioFunicolo"+indice+" option:contains('" + sessoFunicolo + "')").attr('selected', 'selected');
				NS_FUNICOLO.addEventButton(indice);
				
			}
		}
}

NS_CONFIGURAZIONI	= {
	
	addCalendar:function(idCampo){
		
		try{
			jQuery('#'+ idCampo ).datepick({
				onClose: function(){
				jQuery(this).focus();}, 
				showOnFocus: false,  
				showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'
			});
		}catch(e){}	
	}
}
