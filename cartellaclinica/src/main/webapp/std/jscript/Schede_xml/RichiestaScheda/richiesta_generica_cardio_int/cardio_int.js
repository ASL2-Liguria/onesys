var _filtro_list = null;
var _filtro_list_sel = null;
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

	jQuery("td > select[name='cmbSceltaPrest']").parent().css("width","40%");
	jQuery("select[name='cmbSceltaPrest']").css("font-size", "10px");
	jQuery("select[name='cmbPrestRich']").css("font-size", "10px");
	
	switch (_STATO_PAGINA){

			// INSERIMENTO ////////////////////////////////
		case 'I':

			//ONCONTEXTMENU  cmbSceltaPrest
			document.getElementById('cmbSceltaPrest').oncontextmenu=
			function(){ 
				add_selected_elements('cmbSceltaPrest', 'cmbPrestRich', true, 0);
				aggiornaInputValue('cmbPrestRich','HEsami');
			};
			
			//ONDBLCLICK  cmbSceltaPrest
			document.getElementById('cmbSceltaPrest').ondblclick=
			function(){ 
				add_selected_elements('cmbSceltaPrest', 'cmbPrestRich', true, 0);
				aggiornaInputValue('cmbPrestRich','HEsami');
			};
			
			//ONCONTEXTMENU  cmbPrestRich
			document.getElementById('cmbPrestRich').oncontextmenu=
			function(){ 
				add_selected_elements('cmbPrestRich', 'cmbSceltaPrest', true, 0);
				aggiornaInputValue('cmbPrestRich','HEsami');
			};
			
			//ONDBLCLICK  cmbPrestRich
			document.getElementById('cmbPrestRich').ondblclick=
			function(){ 
				add_selected_elements('cmbPrestRich', 'cmbSceltaPrest', true, 0);
				aggiornaInputValue('cmbPrestRich','HEsami');
			};
			
			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			
			//ONBLUR  txtDataProposta
			jQuery("#txtDataProposta").blur(function(){ controllaDataProposta(); });
		
			//ONLOAD  body
			valorizzaMed();
			cambiaPulsante();
			document.all['lblStampa'].parentElement.style.display = 'none';nascondiCampi();
			if(typeof document.EXTERN.URGENZA != 'undefined'){
				setUrgenzaScheda();
			}
			
			//ONBLUR  txtDataProposta
			jQuery("#txtDataProposta").blur(function(){	
				controllaDataProposta();
				/*if(jQuery(this).val() != ''){
					if(jQuery("#txtOraProposta").val() == ''){
						jQuery("#txtOraProposta").val("08:00");
					}
				}*/
			});
		
		break;
		
		case 'L':
			
			//ONLOAD  body
			valorizzaMed();
			setUrgenzaScheda();
			cambiaPulsante();
			document.all['lblRegistra'].parentElement.parentElement.style.display = 'none';
			if(document.EXTERN.LETTURA.value== 'S'){
				HideLayer('groupUrgenzaLabo');
			}
			
		break;
	}
});


function caricamento(statoPagina){
	
	document.all.lblTitleUrgenza.innerText = 'Grado Urgenza';
	
	//funzione che carica la data proposta se arriva in input	
	if(statoPagina == 'I'){
		caricaDataOraInput();
	}
	
	//nascondo il campo data proposta
	jQuery("#lblOraProposta").parent().hide();
	jQuery("#txtOraProposta").parent().hide();
	
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
	
	try {
		var oDateMask2 = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask2.attach(document.dati.txtDataProposta);
	}catch(e){
		//alert(e.description);
	}	
}
/*
Funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico 
*/

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
	
	/*** controlli data proposta cardiologia *******/	
	if(document.getElementById("txtDataProposta").value != '' ){
		
		//se la data è diversa da oggi
		if(document.getElementById("txtDataProposta").value != getToday()){
			
			//e l'ora è vuota, metto ore 0 di default
			if(document.getElementById('txtOraProposta').value == ''){
				document.getElementById('txtOraProposta').value = '00:00';
			}
		
		//altrimenti cancello entrambi i campio in modo che la funzione di salvataggio inserisca sysdate
		}else{
			
			//se l'ora è vuota cancello data e ora in modo da utilizzare poi il sysdate
			if(document.getElementById('txtOraProposta').value == ''){
				document.getElementById('txtDataProposta').value = '';
				document.getElementById('txtOraProposta').value = '';
			}
		}
	
	//nel caso sia vuota la data proposta non ha senso che ci sia l'ora compilata
	}else{
		document.getElementById('txtOraProposta').value = '';
	}
	
	/**********************************************/
	
	for(i = 0; i < doc.cmbControindicazioni.length; i++){
	
		if(doc.cmbControindicazioni.length-1 == i)
			controindicazioni += doc.cmbControindicazioni[i].value;
		else
			controindicazioni += doc.cmbControindicazioni[i].value + ',';
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
		
		//alert(esaMetodica[0]);
		//alert(esaMetodica[1]);
	}

	doc.HelencoEsami.value = esami;
	doc.HelencoMetodiche.value = metodiche;
	
	if (document.EXTERN.LETTURA.value == 'N'){
		
		doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
	}
		
	if (doc.HelencoEsami.value == ''){
	
		alert ('scegliere prestazioni');
		return;
	}


//	var debug = 'IDEN: ' + doc.Hiden.value;
//	debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
//	debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
//	debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
//	debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
//	debug += '\nCONTROINDICAZIONI: ' + doc.Hiden_controindicazioni.value;
//	debug += '\nESAMI: ' + doc.HelencoEsami.value;
//	debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
//	debug += '\nURGENZA: ' + doc.hUrgenza.value;
//	debug += '\nNOTE: ' + doc.txtNote.value;
//	debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
//	debug += '\nQUESITO: ' + doc.txtQuesito.value;
//	debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;

//	alert(debug);

	registraScheda();

}



//funzione che seleziona gli esami già scelti alla riapertura della pagina	
function ricordaEsami(){
	
	var Esami = window.opener.document.all.HelencoEsami.value;	

	var esame= new Array();
	
	esame = Esami.split('#');

	for (var i=0; i<esame.length; i++){

		if(esame[i] != '')
			if(typeof document.getElementById(''+esame[i]+'') != 'undefined')
				document.getElementById(''+esame[i]+'').checked=true;
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

/*
function stampa_scheda_richiesta(){

	var sf= '{TESTATA_RICHIESTE.IDEN}='+document.EXTERN.KEY_ID.value;
	var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_CARDIO_INT_0&stampaReparto=RICHIESTA_GENERICA_CARDIO_INT&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra){	finestra.focus();}
	else
	{var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_CARDIO_INT_0&stampaReparto=RICHIESTA_GENERICA_CARDIO_INT&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);}
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


