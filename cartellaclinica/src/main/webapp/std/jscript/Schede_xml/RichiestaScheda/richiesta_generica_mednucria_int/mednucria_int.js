var _filtro_list = null;
var urgenzaGenerale = '';
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

			//ONBLUR  txtDiuresi_L
			jQuery("#txtDiuresi_L").blur(function(){ 
				controllaCampiNumerici(document.dati.txtDiuresi_L,document.all['lblDiuresi_L']);
				controllaDiuresi();
			});
			
			//ONBLUR  txtDiuresi_ore
			jQuery("#txtDiuresi_ore").blur(function(){ controllaCampiNumerici(document.dati.txtDiuresi_ore ,document.all['lblDiuresi_ore']); });

			//ONLOAD  body
			valorizzaMed();
			document.all['lblStampa'].parentElement.style.display = 'none';
			nascondiCampi();
			
		break;
		
				// 	INSERIMENTO ////////////////////////////////
		case 'E':
		
			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			
			//ONBLUR  txtDataProposta
			jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });

			//ONBLUR  txtDiuresi_L
			jQuery("#txtDiuresi_L").blur(function(){ 
				controllaCampiNumerici(document.dati.txtDiuresi_L,document.all['lblDiuresi_L']);
				controllaDiuresi();
			});
			
			//ONBLUR  txtDiuresi_ore
			jQuery("#txtDiuresi_ore").blur(function(){ controllaCampiNumerici(document.dati.txtDiuresi_ore ,document.all['lblDiuresi_ore']); });

			//ONLOAD  body
			valorizzaMed();
			document.all['lblStampa'].parentElement.style.display = 'none';
			setUrgenzaScheda();
			nascondiCampi();
			
		break;
			
		// LETTURA ////////////////////////////////
		case 'L':
			
			//ONLOAD  body
			valorizzaMed();
			setUrgenzaScheda();
			document.all['lblRegistraLabo'].parentElement.parentElement.style.display = 'none';
			document.all['lblStampa'].parentElement.parentElement.style.display='none';
			if(document.EXTERN.LETTURA.value == 'S'){HideLayer('groupUrgenzaLabo');}			
			
		break;
	}
});


function caricamento(statoPagina){

	try{
		
		$('#sceltaEsami').chromatable(
			{width: "100%", height: "600px",scrolling: "yes"}
		);
		
	}catch(e){}
	
	
	if(statoPagina == 'I'){
		caricaDataOraInput();
	}

	document.all.lblTitleUrgenza_L.innerText = 'Grado Urgenza';
	
	try{

		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtUltimeMestrua);
		
			var oDateMask2 = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask2.attach(document.dati.txtDataProposta);

	}catch(e){}
	
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
}


// funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico 
function valorizzaMed(){
	
	//alert (baseUser.TIPO);
	
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
		urgenzaGenerale=document.getElementById('hUrgenza').value;
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
				apriContenitoreLabo();
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
				apriContenitoreLabo();
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

	for(i = 0; i < doc.cmbControindicazioni.length; i++){
	
		if(doc.cmbControindicazioni.length-1 == i){
			controindicazioni += doc.cmbControindicazioni[i].value;
		}else{
			controindicazioni += doc.cmbControindicazioni[i].value + ',';
		}
	}

	doc.Hiden_controindicazioni.value = controindicazioni;
	
	var metodica = '';

	for(var i=0; i < doc.cmbPrestRich_L.length; i++){
	
		esaMetodica = doc.cmbPrestRich_L[i].value.split('@');

		if(esami != ''){
			esami += '#';
			metodiche += '#';
		}

		esami += esaMetodica[0];
		metodiche += esaMetodica[1];

		//alert(esaMetodica[0]+'/n'+esaMetodica[1]);
	}

	doc.HelencoEsami.value='';
	doc.HelencoEsami.value = esami;
	doc.HelencoMetodiche.value = metodiche;
	
	if (document.EXTERN.LETTURA.value == 'N'){
		doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
	}

	//Obbligatorietà di scelta di almeno una prestazione
	var al = '';
	if (doc.HelencoEsami.value == ''){		
		al = '-Scegliere prestazioni';
	}

	if (doc.txtOraProposta.value == '' && doc.txtOraProposta.STATO_CAMPO == 'O'){
		al += '\n\n-Inserire Orario Programmato Prelievo ';
	}

	if (al != ''){	alert (al);return;	}
	
	// var debug = 'IDEN: ' + doc.Hiden.value;
	// debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
	// debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
	// debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
	// debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
	// debug += '\nCONTROINDICAZIONI: ' + doc.Hiden_controindicazioni.value;
	// debug += '\nESAMI: ' + doc.HelencoEsami.value;
	// debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
	// debug += '\nURGENZA: ' + doc.hUrgenza.value;
	// debug += '\nNOTE: ' + doc.txtNote_L.value;
	// debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
	// debug += '\nQUESITO: ' + doc.txtQuesito_L.value;
	// debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;

	// alert(debug);

	registraScheda();
}

/**
*/



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


//funzione che impedisce il salvataggio in modalità visualizzazione
function registraScheda(){
	
	//alert (document.EXTERN.LETTURA.value);
	if (document.EXTERN.LETTURA.value == 'S'){
		alert ('Impossibile salvare in modalità VISUALIZZAZIONE');
		return;
	}else{
		registra();
	}
}


//funzione che crea due array con id e valore degli esami con il check
function arrayEsami(){

	//creo il nuovo ListBox,uguale a quello della pagina precedente
	var myListBox= document.createElement('select');
	
	myListBox.id='cmbPrestRich_L';
	myListBox.name='cmbPrestRich_L';
	myListBox.style.width = '100%';
	myListBox.setAttribute('STATO_CAMPO',opener.document.all.cmbPrestRich_L.STATO_CAMPO);
	myListBox.setAttribute('multiple','multiple');

	var chk=document.getElementsByName("chkEsami");
	var idEsami='';
	var optArray = new Array ();
    
	for (var i=0; i<chk.length;i++){	
		if (chk[i].checked){
			optArray.push(new Option(chk[i].descr, chk[i].id));
		}
	}
	
	svuotaListBox(myListBox); //svuoto il ListBox prima di riempirlo con le nuove scelte
	
	for(var i=0; i<optArray.length; i++) {
		myListBox.options[myListBox.options.length] = new Option(optArray[i].text, optArray[i].value + '@' + '0');
		idEsami += optArray[i].value + '#';
	}
	
	var s= idEsami;
	var b=/#$/.test(s);   
	var t=s.replace(/#$/,"");    
	
	opener.document.getElementById('HelencoEsami').value = idEsami; //valorizzo il campo nascosto della pagina precedente
	
//	sostituisco le options del listbox creato a quelle della pagina precedente
	opener.getElementById('cmbPrestRich_L').options.outerHTML = window.opener.document.getElementById('cmbPrestRich_L').options.outerHTML.substr(0, window.opener.document.getElementById('cmbPrestRich_L').options.outerHTML.toUpperCase().indexOf('<OPTION') > 0 ? window.opener.document.getElementById('cmbPrestRich_L').options.outerHTML.toUpperCase().indexOf('<OPTION'):window.opener.document.getElementById('cmbPrestRich_L').options.outerHTML.toUpperCase().indexOf('</SELECT')) + myListBox.options.innerHTML + '</SELECT>';

	self.close();
}


//funzione che permette di scegliere solo determinati esami se la richiesta è urgente
function urgenza(){
	
	var tipoUrgenza = opener.document.all.hUrgenza.value;
	var urgenza = '';
		
	if (tipoUrgenza != 2){
			urgenza = 0;
	}else{
		urgenza = tipoUrgenza;
	}

//	alert ('tipoUrgenza' + tipoUrgenza);
	
	chk = document.getElementsByName('chkEsami');
		
	for (var i=0; i<chk.length;i++){
		if (tipoUrgenza != 2){ 			//se l'attributo urgenza del check differisce dal valore 
										//dell'urgenza, i checkbox ciclati vengono disabilitati
							   			//altrimenti è permesso cliccarli

		//	alert ('chkUrgenza' + chk[i].urgenza);
			chk[i].disabled = false;
		}else{
			
			if (chk[i].urgenza != tipoUrgenza){
				
				chk[i].disabled = true;
				addClass(chk[i].parentNode,"nonUrgente");
//				alert (chk[i].className);
				
			}
		}
	}
}

/*
function stampa_scheda_richiesta(){
	
	var sf= '{TESTATA_RICHIESTE.IDEN}='+document.EXTERN.KEY_ID.value;
	var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_MEDNUCRIA_INT_0&stampaReparto=RICHIESTA_GENERICA_MEDNUCRIA_INT&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra){	
		finestra.focus();
	}else{
		var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_MEDNUCRIA_INT_0&stampaReparto=RICHIESTA_GENERICA_MEDNUCRIA_INT&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}
}
*/

//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){

	document.all['lblMotAnn_L'].parentElement.style.display = 'none';
	document.all['txtMotivoAnnullamento_L'].parentElement.style.display = 'none';
	HideLayer('groupOperatoriLabo');
}


function valorizzaCampo(check){
	
	var idEsame = check.id;
	var descrEsame = check.descr;
	var codEsa = check.cod_esa;
	var CampoEsami = document.getElementById('txtEsamiSelezionati');
	
		if (check.checked){
		
			if (CampoEsami.value == ''){
		
				CampoEsami.value = " '" + codEsa + "' ";
				//alert ('Se vuoto innerText '+ CampoEsami.value);
			}else{
			
				CampoEsami.value = CampoEsami.value += " '" + codEsa + "' ";
				//alert ('Già pieno innerText '+ CampoEsami.value);
			}
		}else{
			
			//alert(CampoEsami.value);
			var replace = CampoEsami.value.replace (" '" + codEsa + "' ",'');	
			CampoEsami.value = replace;
		}
}


//funzione che rende lo stato campo obbligatorio
function apriContenitoreLabo(){
	
	var url = '';
	
	if(document.EXTERN.LETTURA.value !="S"){		
		
		url = "sceltaEsamiMedNucLaboSV?KEY_LEGAME=RICHIESTA_GENERICA_MEDNUC_VITRO";
		url	+= "&num_col=6&funzione_profili=scegliProfilo";
		url += "&REPARTO_RICHIEDENTE="+document.EXTERN.HrepartoRicovero.value;
		url += "&CDC_DESTINATARIO="+ $('#DESTINATARIO').val();
		url	+= "&URGENZA="+$('#hUrgenza').val();
		url	+= "&TIPO=R";
		url	+= "&METODICA=0";
		url += "&INFO_COLONNA=" + baseReparti.getValue(WindowCartella.getForm().reparto,'MEDUC_RIA_COLONNA_INFO');

		alert (url);
		window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
		
	}
}
