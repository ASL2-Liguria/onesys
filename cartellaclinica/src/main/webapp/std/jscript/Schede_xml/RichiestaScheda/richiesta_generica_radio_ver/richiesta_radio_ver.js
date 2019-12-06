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
	
	$('#txtQuesito').attr("maxlength", String(500)).blur(function(e) {
        maxlength(this, 500,'Attenzione: il testo inserito supera la lunghezza massima consentita di 500 caratteri.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?');
    });
	$('#txtQuadroClinico').attr("maxlength", String(70)).blur(function(e) {
        maxlength(this, 70,'Attenzione: il testo inserito supera la lunghezza massima consentita di 70 caratteri.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?');
    });
	
	
	WindowCartella.CartellaPaziente.Menu.hide();
	WindowCartella.$("div.chiudi, div.info, div.patient").hide();
	
	switch (_STATO_PAGINA){
		
		case 'I':
		
			valorizzaMed();
			cambiaPulsante();
			nascondiCampi();
			caricaInfoExt();
			if(typeof document.EXTERN.URGENZA != 'undefined'){
				setUrgenzaScheda();
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
			if(typeof $('form[name=EXTERN] input[name=URGENZA]').val() != 'undefined'){
				setUrgenzaScheda();
			}else{
				document.getElementById('hUrgenza').value = '0';
				setUrgenza();
			}			
		
			break;
		
		case 'L':
			
			valorizzaMed();
			setUrgenzaScheda();
			cambiaPulsante();
			document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
			
			if($('form[name=EXTERN] input[name=LETTURA]').val()== 'S')
				HideLayerFieldset('divGroupUrgenza');			
			break;
	}
});

$(window).load(function(){
	try{
		$('#lblAttenzione').html(baseReparti.getValue(document.EXTERN.HrepartoRicovero.value,'INFORMATIVA_RICHIESTA_VERONA'));
	} catch(e){
		alert(e.message);
	}
});

function caricamento(statoPagina){
	
	//funzione che carica la data proposta se arriva in input	
	if(statoPagina == 'I')
		caricaDataOraInput();

    
	jQuery(".pulsanteUrgenza0 a").text('Non urgenza');
	jQuery("input[name=txtTelefonoMedico]").attr("maxlength", "20");
	jQuery("#lblAllegaModulo").attr("for", "chkAllegaModulo");
	jQuery("#lblAttenzione").css("white-space", "nowrap");
	jQuery("#lblStampa").parent().css("width", "150px");
	
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
}

// funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico
function valorizzaMed(){
	
	//alert (baseUser.TIPO);	
	if ($('form[name=EXTERN] input[name=LETTURA]').val() != 'S') {
	
		if (baseUser.TIPO == 'M'){		
			
			$('form[name=dati] input[name=Hiden_MedPrescr]').val(baseUser.IDEN_PER);
			$('form[name=dati] input[name=txtMedPrescr]').val(baseUser.DESCRIPTION);
			$('form[name=dati] input[name=Hiden_op_rich]').val(baseUser.IDEN_PER);
			$('form[name=dati] input[name=txtOpRich]').val(baseUser.DESCRIPTION);
			jQuery('#txtMedPrescr').attr("readOnly",true);

		}else{
		
			$('form[name=dati] input[name=Hiden_op_rich]').val(baseUser.IDEN_PER);
			$('form[name=dati] input[name=txtOpRich]').val(baseUser.DESCRIPTION);
			
		}
	}
				
	if (typeof $('form[name=EXTERN] input[name=Hiden_pro]').val() != 'undefined')
		$('form[name=dati] input[name=Hiden_pro]').val($('form[name=EXTERN] input[name=Hiden_pro]').val());
	
}

//funzione che modifica la label del div a seconda del grado dell'urgenza
function setUrgenza(){
	
	var urgenza = document.getElementById('hUrgenza').value;
	document.getElementById('lblTitleUrgenza').innerText = 'Grado Urgenza';

	//controllo se la pagina è in modalità di inserimento
	if (_STATO_PAGINA != 'L'){


	
	if(urgenza == ''){
		document.getElementById('hUrgenza').value = '0';
		urgenza = '0';
	}
		
	switch(urgenza){
	
		// Non urgente
		case '0':
			document.getElementById('lblTitleUrgenza').innerText = '    Grado Urgenza:  ' + ' NON URGENZA    ';
			document.getElementById('lblTitleUrgenza').className = '';
			addClass(document.getElementById('lblTitleUrgenza'),'routine');
			break;
		
		// Urgenza differita
		case '1':
			document.getElementById('lblTitleUrgenza').innerText = '    Grado Urgenza:  ' + ' URGENZA DIFFERITA    ';
			document.getElementById('lblTitleUrgenza').className = '';
			addClass(document.getElementById('lblTitleUrgenza'),'urgenzaDifferita');
			break;
		
		// Urgenza
		case '2':
			document.getElementById('lblTitleUrgenza').innerText = '    Grado Urgenza:  ' + ' URGENZA    ';
			document.getElementById('lblTitleUrgenza').className = '';
			addClass(document.getElementById('lblTitleUrgenza'),'urgenza');
			break;
		
		// Emergenza
		case '3':
			document.getElementById('lblTitleUrgenza').innerText = '    Grado Urgenza:  ' + ' EMERGENZA   ';
			document.getElementById('lblTitleUrgenza').className = '';
			addClass(document.getElementById('lblTitleUrgenza'),'emergenza');
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
	var doc= $('form[name=dati]').get(0);

	if (document.getElementById('hUrgenza').value == ''){
		return alert('Attenzione, selezionare il grado di urgenza');	
	}
	
	for(var i = 0; i < doc.cmbPrestRich.length; i++){
			
		esaMetodica = doc.cmbPrestRich[i].value.split('@');
		//alert (esaMetodica);

		if (esami != ''){
			esami += ',';
		}
			
		esami += "'"+esaMetodica[0]+"'";
		//alert(esami)
	}
		
	//alert(esami);
	
	if ($('form[name=EXTERN] input[name=LETTURA]').val() != "S"){
	
		url = 'servletGenerator?KEY_LEGAME=SCELTA_ESAMI';
		url += '&CDC_DESTINATARIO=' + $('form[name=EXTERN] input[name=DESTINATARIO]').val();
		url += '&SITO=' + $('form[name=EXTERN] input[name=DESTINATARIO]').val();
		url += '&ESAMI='+esami;
		url += '&TIPO=R';
		url += '&REPARTO_RICHIEDENTE=' + $('form[name=EXTERN] input[name=HrepartoRicovero]').val();
		url += '&URGENZA=' + document.getElementById('hUrgenza').value;
	
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
	var doc 		= $('form[name=dati]').get(0);
	
	if (document.getElementById('hUrgenza').value == ''){

			alert ('- Scegliere Urgenza\n');
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
	
	if ($('form[name=EXTERN] input[name=LETTURA]').val() == 'N')
		doc.HcmbRepDest.value = $('form[name=EXTERN] input[name=DESTINATARIO]').val();
	
	// Obbligatorietà di scelta di almeno una prestazione
	var al = '';
	
	if (doc.HelencoEsami.value == '')		
		al = '- Scegliere prestazioni\n';

	
	if (al != ''){	
		alert (al);
		return;
	}
	
//	if(document.getElementById('hUrgenza').value=='1' || document.getElementById('hUrgenza').value=='2' || document.getElementById('hUrgenza').value=='3'){		
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
	
	var urgenza = $('form[name=EXTERN] input[name=URGENZA]').val();

	document.getElementById('hUrgenza').value = urgenza;
		
	switch(urgenza){
	
		// Non urgente
		case '0':
			document.getElementById('lblTitleUrgenza').innerText = '    Grado Urgenza:  ' + ' NON URGENZA    ';
			document.getElementById('lblTitleUrgenza').className = '';
			addClass(document.getElementById('lblTitleUrgenza'),'routine');
			break;
		
		// Urgenza differita
		case '1':
			document.getElementById('lblTitleUrgenza').innerText = '    Grado Urgenza:  ' + ' URGENZA DIFFERITA    ';
			document.getElementById('lblTitleUrgenza').className = '';
			addClass(document.getElementById('lblTitleUrgenza'),'urgenzaDifferita');
			break;
		
		// Urgenza
		case '2':
			document.getElementById('lblTitleUrgenza').innerText = '    Grado Urgenza:  ' + ' URGENZA    ';
			document.getElementById('lblTitleUrgenza').className = '';
			addClass(document.getElementById('lblTitleUrgenza'),'urgenza');
			break;
		
		// Emergenza
		case '3':
			document.getElementById('lblTitleUrgenza').innerText = '    Grado Urgenza:  ' + ' EMERGENZA   ';
			document.getElementById('lblTitleUrgenza').className = '';
			addClass(document.getElementById('lblTitleUrgenza'),'emergenza');
			break;
	}
}


// In Lettura NON Registro
function registraScheda(){
	
	//alert ($('form[name=EXTERN] input[name=LETTURA]').val());
	if ($('form[name=EXTERN] input[name=LETTURA]').val() == 'S'){		
		alert ('Impossibile salvare in modalità VISUALIZZAZIONE');
		return;
	}else{
		document.body.ok_registra=function(){prelevaIdRichiesta();chiudiScheda();};
		registra();	
	}

}

//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){

	document.getElementById('lblMotAnn').parentElement.style.display = 'none';
	document.getElementById('txtMotivoAnnullamento').parentElement.style.display = 'none';
	document.getElementById('txtDataRichiesta').parentElement.style.display = 'none';
	document.getElementById('lblDataRichiesta').parentElement.style.display = 'none';
	document.getElementById('txtOraRichiesta').parentElement.style.display = 'none';
	document.getElementById('lblOraRichiesta').parentElement.style.display = 'none';
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
		alert ('Alert solo Admin \n chechEsami: '+resp);
	*/
	
}

function getDayHour(){
	
	if(_STATO_PAGINA != 'L' && _STATO_PAGINA !='E' ){
		document.getElementById('txtDataProposta').value=getToday();
		//decommentare se voglio che all'inserimento della data odierna venga inserita l'ora '08:00'
		document.getElementById('txtDataProposta').focus();
		//document.getElementById('txtOraProposta').focus();
	}
	
}


function caricaInfoExt(){
    var rs = WindowCartella.executeQuery("OE_Richiesta.xml","getInfoExtVerona",[WindowCartella.getAccesso("IDEN")]);
    
    while (rs.next()) {
    	$('#txtMDA').val(rs.getString('COD_MDA'));
    	$('#txtStanza').val(rs.getString('STANZA'));
    	$('#txtLetto').val(rs.getString('LETTO'));
    	$('TEXTAREA[name=txtQuadroClinico]').val(rs.getString('NOTE'));
    }
	
}


