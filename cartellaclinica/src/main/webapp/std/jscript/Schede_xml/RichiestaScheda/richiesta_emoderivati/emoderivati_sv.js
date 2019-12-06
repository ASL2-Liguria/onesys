var _filtro_list = null;
var urgenzaGenerale = '';
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
	jQuery("div#divGroupTerapie label, div#divGroupEmoderivati label").css('white-space', 'nowrap');
	NS_FUNCTIONS.moveLeftField({element: $('#txtFattoreAltro'), space: '&nbsp;&nbsp;&nbsp;', colspan: 1});
	$('input[name=chkFattoreAltro]').parent().attr('colspan', '14');
	$('#txtDurata').parent().attr('colspan', '12');
	$('#lblPosologia, #txtPosologia').parent().attr('rowspan','2');
	
	switch (_STATO_PAGINA){
		
		// INSERIMENTO ////////////////////////////////
		case 'I':
			
			//ONCONTEXTMENU  cmbSceltaPrest
			document.getElementById('cmbSceltaPrest').oncontextmenu=
			function(){ 
				add_selected_elements('cmbSceltaPrest', 'cmbPrestRich', false, 0);
				//sortSelect('cmbPrestRich');
				aggiornaInputValue('cmbPrestRich','HEsami');
			};
			
			//ONDBLCLICK  cmbSceltaPrest
			document.getElementById('cmbSceltaPrest').ondblclick=
			function(){ 
				add_selected_elements('cmbSceltaPrest', 'cmbPrestRich', false, 0);
				//sortSelect('cmbPrestRich');
				aggiornaInputValue('cmbPrestRich','HEsami');
			};
			
			//ONCONTEXTMENU  cmbPrestRich
			document.getElementById('cmbPrestRich').oncontextmenu=
			function(){ 
				//add_selected_elements('cmbPrestRich', 'cmbSceltaPrest', true, 0);
				remove_elem_by_id('cmbPrestRich',0);
				//sortSelect('cmbSceltaPrest');
				aggiornaInputValue('cmbPrestRich','HEsami');
			};
			
			//ONDBLCLICK  cmbPrestRich
			document.getElementById('cmbPrestRich').ondblclick=
			function(){ 
				//add_selected_elements('cmbPrestRich', 'cmbSceltaPrest', true, 0);
				remove_elem_by_id('cmbPrestRich',0);
				//sortSelect('cmbSceltaPrest');
				aggiornaInputValue('cmbPrestRich','HEsami');
			};
			
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
			
			//ONBLUR  txtNumImp
			jQuery("#txtNumImp").blur(function(){ controllaCampiNumerici(document.dati.txtNumImp,document.getElementById('lblNumImp'));});
		
			//ONLOAD  body
			valorizzaMed();
			cambiaPulsante();
			nascondiCampi();
			
			if(typeof document.EXTERN.URGENZA != 'undefined'){
				setUrgenzaScheda();
			}else{
				document.all.hUrgenza.value = '0';
				setUrgenza();
			}
		
		break;
		
		// MODIFICA ///////////////////////////////
		case 'E':
			
			//ONCONTEXTMENU  cmbSceltaPrest
			document.getElementById('cmbSceltaPrest').oncontextmenu=
			function(){ 
				add_selected_elements('cmbSceltaPrest', 'cmbPrestRich', false, 0);
				//sortSelect('cmbPrestRich');
				aggiornaInputValue('cmbPrestRich','HEsami');
			};
			
			//ONDBLCLICK  cmbSceltaPrest
			document.getElementById('cmbSceltaPrest').ondblclick=
			function(){ 
				add_selected_elements('cmbSceltaPrest', 'cmbPrestRich', false, 0);
				//sortSelect('cmbPrestRich');
				aggiornaInputValue('cmbPrestRich','HEsami');
			};
			
			//ONCONTEXTMENU  cmbPrestRich
			document.getElementById('cmbPrestRich').oncontextmenu=
			function(){ 
				//add_selected_elements('cmbPrestRich', 'cmbSceltaPrest', true, 0);
				remove_elem_by_id('cmbPrestRich',0);
				//sortSelect('cmbSceltaPrest');
				aggiornaInputValue('cmbPrestRich','HEsami');
			};
			
			//ONDBLCLICK  cmbPrestRich
			document.getElementById('cmbPrestRich').ondblclick=
			function(){ 
				//add_selected_elements('cmbPrestRich', 'cmbSceltaPrest', true, 0);
				remove_elem_by_id('cmbPrestRich',0);
				//sortSelect('cmbSceltaPrest');
				aggiornaInputValue('cmbPrestRich','HEsami');
			};
			
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
			
			//ONBLUR  txtNumImp
			jQuery("#txtNumImp").blur(function(){ controllaCampiNumerici(document.dati.txtNumImp,document.getElementById('lblNumImp'));});
			
			//ONLOAD  body
			//document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
			//valorizzaMed();
			cambiaPulsante();
			nascondiCampi();
			
			if(typeof document.EXTERN.URGENZA != 'undefined'){
				setUrgenzaScheda();
			}else{
				document.all.hUrgenza.value = '0';
				setUrgenza();
			}
			
		break;
		
		// LETTURA ////////////////////////////////
		case 'L':

			//ONLOAD  body
			//document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
			valorizzaMed();
			setUrgenzaScheda();
			cambiaPulsante();
			
			if(document.EXTERN.LETTURA.value== 'S'){
				//HideLayer('groupUrgenza');
				HideLayerFieldset('divGroupUrgenza');
			}
			
		break;
	}
});

//funzione che viene lanciata ad ogni caricamento della pagina
function caricamento(statoPagina){
	
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
	
	//funzione che carica la data proposta se arriva in input	
	if(statoPagina == 'I'){
		caricaDataOraInput();
	}

    /*jQuery("#txtMotivo").parent().css({float:'left'}).append($('<div></div>').addClass('classDivEpi').attr("title","Recupera Epicrisi").click(function() {
        var rs = WindowCartella.executeQuery("diari.xml", "getEpicrisiRicovero", WindowCartella.getRicovero("NUM_NOSOLOGICO"));
        // Recupero valori epicrisi e carico in textarea
        while (rs.next()) {
            $("#txtMotivo").append(rs.getString("EPICRISI") + "<br/>");
        }
    }));*/
	$('#groupUrgenza, #groupPrestazioni').hide();

	try{
		if (parent.document.getElementById('hIntEst').value =='E' ){
			obbligaCampo(document.getElementById('txtNumImp'), document.getElementById('lblNumImp'));
			obbligaCampo(document.getElementById('cmbTicket'), document.getElementById('lblTicket'));
			obbligaCampo(document.getElementById('txtDataRicetta'), document.getElementById('lblDataRicetta'));
			obbligaCampo(document.getElementById('txtMotivo'), document.getElementById('lblMotivo'));
		}else{
			obbligaCampo(document.getElementById('txtMedPrescr'), document.getElementById('lblMedPrescr'));
		}
	}catch(e){
		//alert(e.description);
	}	
	try {
		var oDateMask2 = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask2.attach(document.dati.txtDataRicetta);
		oDateMask2.attach(document.dati.txtDataProposta);
	}catch(e){
		//alert(e.description);
	}	
}

// funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico 
function valorizzaMed(){

//	alert (baseUser.TIPO);
//	alert(document.EXTERN.LETTURA.value);
//	alert(baseUser.DESCRIPTION);
	
	if (document.EXTERN.LETTURA.value!= 'S') {
	
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
/**
*/
//funzione che imposta la combo del reparto sorgente
function gestioneComboRepSorgente(){
	
	//alert (document.EXTERN.Hreparto_ricovero.value);
	
	var repartoDiRicovero = document.EXTERN.Hreparto_ricovero.value;
	
	if(repartoDiRicovero != ''){

		for(var i = 0; i < document.dati.cmbRepSorgente.length; i++){
			
			if(document.dati.cmbRepSorgente[i].innerText == repartoDiRicovero)
				document.dati.cmbRepSorgente[i].selected = true;
		}
				
		document.dati.cmbRepSorgente.disabled = true;	
	}
	
	appendDivACR(document.all.cmbRepDest.parentNode);
}

function getDayHour(){
	
	if(_STATO_PAGINA != 'L' && _STATO_PAGINA !='E' ){
		document.getElementById('txtDataProposta').value=getToday();
		//decommentare se voglio che all'inserimento della data odierna venga inserita l'ora '08:00'
		document.getElementById('txtDataProposta').focus();
		//document.getElementById('txtOraProposta').focus();
	}
	
}


//funzione che modifica la label del div a seconda del grado dell'urgenza
function setUrgenza(){
	
	if (urgenzaGenerale ==''){
		urgenzaGenerale=document.getElementById('hUrgenza').value;
	}

	document.all.lblTitleUrgenza.innerText = 'Grado Urgenza';
	var urgenza = document.all.hUrgenza.value;


	//controllo se la pagina è in modalità di inserimento
	if (_STATO_PAGINA != 'L'){
	
		//svuotaListBox(document.dati.cmbPrestRich);     // svuto il listbox degli esami e il campo nascosto
		//document.dati.HelencoEsami.value = '';

		
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
function genera_stringa_codici(sel, carattere){
	
	//alert(sel + '\n ' + carattere);
	var idx;
	var ret = '';
	
	for(idx = 0; idx < sel.length; idx++)
	{
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
			
			//e l'ora è vuota, metto ore 8 di default
			if(document.getElementById('txtOraProposta').value == ''){
				document.getElementById('txtOraProposta').value = '08:00';
			}
		
		//altrimenti cancello entrambi i campio in modo che la funzione di salvataggio inserisca sysdate
		}else{
			
			//se l'ora è vuota, oppure uguale alle 08:00, cancello data e ora in modo da utilizzare poi il sysdate
			if(document.getElementById('txtOraProposta').value == '' || document.getElementById('txtOraProposta').value == '08:00'){
				document.getElementById('txtDataProposta').value = '';
				document.getElementById('txtOraProposta').value = '';
			}
		}
	
	//nel caso sia vuota la data proposta non ha senso che ci sia l'ora compilata
	}else{
		document.getElementById('txtOraProposta').value = '';
	}
	
	/**********************************************/
	
			
	for(var i = 0; i < doc.cmbPrestRich.length; i++){
		
		esaMetodica = doc.cmbPrestRich[i].value.split('@');

		if(esami != ''){
			
			esami += '#';
			metodiche += '#';
		}
		
		esami += esaMetodica[0];
		metodiche += esaMetodica[1];
		
//		alert(esaMetodica[0]+'/n'+esaMetodica[1]);
	}

	
	doc.HelencoEsami.value ='';
	doc.HelencoEsami.value = esami;
	doc.HelencoMetodiche.value = 'T';//metodiche;
	
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
//	debug += '\nESAMI: ' + doc.HelencoEsami.value;
//	debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
//	debug += '\nURGENZA: ' + doc.hUrgenza.value;
//	debug += '\nNOTE: ' + doc.txtNote.value;
//	debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
//	debug += '\nMOTIVO: ' + doc.txtMotivo.value;
//	debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;
//	debug += '\nNUM IMPEGNATIVA: ' + doc.txtNumImp.value;
//	debug += '\nONERE: ' + doc.txtOnere.value;
//	debug += '\nTICKET: ' + doc.cmbTicket.value;
//	debug += '\nCOD_ESENZIONE: ' + doc.HcodEsenzione.value;
//	debug += '\nRICETTA: ' + doc.Hricetta.value;
//	debug += '\nTIPO RICETTA: ' + doc.cmbTipoRicetta.value;
//	debug += '\nMOD_ACCESSO: ' + doc.Hiden_op_rich.value;
//	debug += '\nMOD_PRESCRITTIVA: ' + doc.cmbModPrescr.value;
//	debug += '\nCODICE DSA: ' + doc.txtCodDSA.value;
//	debug += '\nTIPO DSA: ' + doc.cmbTipoDSA.value;

//	alert(debug);

	registraScheda();

}

/**
*/
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
	
	document.all.lblTitleUrgenza.innerText='Grado urgenza';
		
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

//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){

	document.getElementById('lblMotAnn').parentElement.style.display = 'none';
	document.getElementById('txtMotivoAnnullamento').parentElement.style.display = 'none';
	document.getElementById('txtDataRichiesta').parentElement.style.display = 'none';
	document.getElementById('lblDataRichiesta').parentElement.style.display = 'none';
	document.getElementById('txtOraRichiesta').parentElement.style.display = 'none';
	document.getElementById('lblOraRichiesta').parentElement.style.display = 'none';
	//HideLayer('groupOperatori');
	HideLayerFieldset('divGroupOperatori');
	HideLayerFieldset('divGroupDatiAmministrativi');
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

/*
function stampa_scheda_richiesta(){

	var sf;
	var funzione;
	var reparto;
	var anteprima;
	var idRichiesta;
	var stampante = null;
	
	var keyLegame       = document.EXTERN.KEY_LEGAME.value;
	var versione       	= document.EXTERN.VERSIONE.value;
	var cdcDestinatario = document.EXTERN.DESTINATARIO.value;	

	if (document.EXTERN.LETTURA.value == 'N'){
	
		//alert (document.EXTERN.ID_STAMPA.value);
		idRichiesta = document.EXTERN.ID_STAMPA.value;
		//alert(idRichiesta);
		
		if (idRichiesta == ""){
			alert ('Salvataggio non effettuato');
			return;
			}
	}
	
	if (document.EXTERN.LETTURA.value == 'S'){
	
		//alert(document.EXTERN.KEY_ID.value);
		idRichiesta = document.EXTERN.KEY_ID.value;
		//alert (idRichiesta);
	}

	//sf= "{TESTATA_RICHIESTE.IDEN}="+idRichiesta;
	sf= "{VIEW_VIS_RICHIESTA_REPORT.IDEN}="+idRichiesta;
	funzione = cdcDestinatario + '_' + keyLegame + '_' + versione ;
	reparto = cdcDestinatario;

		if(basePC.PRINTERNAME_REF_CLIENT==''){
			anteprima='S';
		}else{
			anteprima='N';
		}	

	
	url =  'elabStampa?stampaFunzioneStampa='+funzione;
	url += '&stampaAnteprima='+anteprima;
	url += '&ServletStampe=N';
	
	if(reparto!=null && reparto!='')
		url += '&stampaReparto='+reparto;	
	if(sf!=null && sf!='')
		url += '&stampaSelection='+sf;	
	if(stampante!=null && stampante!='')
		url += '&stampaStampante='+stampante;	
	
	var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra){ 
		finestra.focus();}
    else{
		finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}
	
	chiudiScheda();	
}
*/
