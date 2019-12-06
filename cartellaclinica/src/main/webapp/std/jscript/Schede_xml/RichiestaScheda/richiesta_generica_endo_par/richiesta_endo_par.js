var _filtro_list = null;
var dataAppuntamento = '';
var albero='';
var controllo = 0; //variabile che permette di aprire e chiudere l'albero.
var WindowCartella = null;


jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti 	= WindowCartella.baseReparti;
    window.baseGlobal	= WindowCartella.baseGlobal;
    window.basePC 		= WindowCartella.basePC;
    window.baseUser 	= WindowCartella.baseUser;

	caricamento(_STATO_PAGINA);
	$('SELECT[name=cmbPrestRich]').dblclick(function(){
		remove_elem_by_sel('cmbPrestRich'); 
		$('#txtQuesito').val('');
	});	
	
	$("[name='radAllergie']").click(function(){		
		if (document.all.radAllergie[1].checked) {
			$('#txtAllergie').val('').attr('disabled','disabled');
		}
		else{
			$('#txtAllergie').val('').removeAttr('disabled');
		} 
	});
	$("[name='radControind']").click(function(){		
		if (document.all.radControind[1].checked) {
			$('#txtControind').val('').attr('disabled','disabled');;
			} 
		else{
			$('#txtControind').val('').removeAttr('disabled');
		}			
	});
	
	switch (_STATO_PAGINA){
		
		case 'I':
		
			valorizzaMed();
			cambiaPulsante();
			nascondiCampi();
			if(typeof document.EXTERN.URGENZA != 'undefined'){
				setUrgenzaScheda();
			}else{
				document.all.hUrgenza.value = '0';
				setUrgenza();
			}
                        
			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			
			//ONBLUR  txtDataProposta
			jQuery("#txtDataProposta").blur(function(){	
				controllaDataProposta();
				if(jQuery(this).val() != ''){
					if(jQuery("#txtOraProposta").val() == ''){
						jQuery("#txtOraProposta").val("08:00");
					}
				}
			});                     
			break;
		
		case 'E':
			
			cambiaPulsante();
			nascondiCampi();
			if(typeof document.EXTERN.URGENZA != 'undefined'){
				setUrgenzaScheda();
			}else{
				document.all.hUrgenza.value = '0';
				setUrgenza();
			}			
		
			break;
		
		case 'L':
			
			valorizzaMed();
			setUrgenzaScheda();
			cambiaPulsante();
			document.all['lblRegistra'].parentElement.parentElement.style.display = 'none';
			
			if(document.EXTERN.LETTURA.value== 'S')
				HideLayerFieldset('divGroupUrgenza');			
			break;
	}
});

function caricamento(statoPagina){
	
	//funzione che carica la data proposta se arriva in input	
	if(statoPagina == 'I')
		caricaDataOraInput();
	
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
}

// funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico
function valorizzaMed(){
	
	//alert (baseUser.TIPO);	
	if (document.EXTERN.LETTURA.value != 'S') {
	
		if (baseUser.TIPO == 'M'){		
			
			document.dati.Hiden_MedPrescr.value 	= baseUser.IDEN_PER; 
			document.dati.txtMedPrescr.value 		= baseUser.DESCRIPTION;
			document.dati.Hiden_op_rich.value 		= baseUser.IDEN_PER; 
			document.dati.txtOpRich.value 			= baseUser.DESCRIPTION;
			jQuery('#txtMedPrescr').attr("readOnly",true);

		}else{
		
			document.dati.Hiden_op_rich.value = baseUser.IDEN_PER; 
			document.dati.txtOpRich.value = baseUser.DESCRIPTION;	
			
		}
	}
				
	if (typeof document.EXTERN.Hiden_pro != 'undefined')	
		document.dati.Hiden_pro.value = document.EXTERN.Hiden_pro.value;
	
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
		url += '&TIPO=R';
		url += '&REPARTO_RICHIEDENTE=' + document.EXTERN.HrepartoRicovero.value;
		url += '&URGENZA=' + document.all.hUrgenza.value;
	
		popup = window.open(url, "", "status = yes, scrollbars = yes");
		if(popup){
			popup.focus();
		}else{
			popup = window.open(url, "", "status = yes, scrollbars = yes");
		}
	}
}

// Funzione Prepara Salvataggio. 
function preSalvataggio(){

	var esami 		= '';
	var metodiche 	= '';
	var esaMetodica = '';
	var doc 		= document.dati;
	
	if (document.all.hUrgenza.value == ''){

			alert ('scegliere Urgenza');
			return;		
	}

	for(var i = 0; i < doc.cmbPrestRich.length; i++){
		
		esaMetodica = doc.cmbPrestRich[i].value.split('@');
	
		if(esami != ''){			
			esami += '#';
			metodiche += '#';
		}
		
		esami += esaMetodica[0];
		metodiche += esaMetodica[1];		
		// alert(esaMetodica[0]+'/n'+esaMetodica[1]);
	}
	
	doc.HelencoEsami.value = '';
	doc.HelencoEsami.value = esami;
	doc.HelencoMetodiche.value = metodiche;
	
	if (document.EXTERN.LETTURA.value == 'N')
		doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
	
	
	// Obbligatorietà di scelta di almeno una prestazione
	var al = '';
	
	if (doc.HelencoEsami.value == '')		
		al = '- Scegliere prestazioni\n';

	
	if (al != ''){	
		alert (al);
		return;
	}
	
//	if(document.all.hUrgenza.value=='1' || document.all.hUrgenza.value=='2' || document.all.hUrgenza.value=='3'){		
//		alert('La richiesta va accompagnata da una telefonata');
			
	registraScheda();
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

function svuotaListBox(elemento){
	
	var object;
	var indice;
	
	if (typeof elemento == 'String')
		object = document.getElementById(elemento);
	else
		object = elemento;

	
	if (object){
		indice = parseInt(object.length);
		while (indice>-1){
			object.options.remove(indice);
			indice--;
		}
	}
}

// Gestione Urgenza Visualizzazione/Modifica
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


// In Lettura NON Registro
function registraScheda(){
	
	//alert (document.EXTERN.LETTURA.value);	
	if (document.EXTERN.LETTURA.value == 'S'){		
		alert ('Impossibile salvare in modalità VISUALIZZAZIONE');
		return;
	}else{
		registra();	
	}

}

//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){

	document.all['lblMotAnn'].parentElement.style.display = 'none';
	document.all['txtMotivoAnnullamento'].parentElement.style.display = 'none';
	document.all['txtDataRichiesta'].parentElement.style.display = 'none';
	document.all['lblDataRichiesta'].parentElement.style.display = 'none';
	document.all['txtOraRichiesta'].parentElement.style.display = 'none';
	document.all['lblOraRichiesta'].parentElement.style.display = 'none';
	HideLayerFieldset('divGroupOperatori');
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

function checkEsami(resp){

	/*
	if(baseUser.LOGIN=='arry')
		alert ('lucas.resp chechEsami: '+resp);
	*/
	
}




