var _filtro_list = null;
var urgenzaGenerale = '';
var dataAppuntamento='';
var numeroRiga = 0;
var numeroRigaImp = 0;
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
	
	var testoLabelDivIntestazione = 'Richiedibilità solo notturna di esami POCT(dalle 20 alle 8)';
	$('[name="dati"]').prepend("<div class='labelDivIntestazione'><span>"+testoLabelDivIntestazione+"</span></div>");

	caricamento(_STATO_PAGINA);
	
	switch (_STATO_PAGINA){
		
		// 	INSERIMENTO ////////////////////////////////
		case 'I':
			//Click sulla label dei combo
			jQuery("#lblPrestRich_L").click(function(){document.all.hUrgenza.value !=''?apriContenitoreLabo():alert('Scegliere il grado di urgenza')});

			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			
			//ONBLUR  txtDataProposta
			jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
			
			//ONBLUR  txtNumImp
			jQuery("#txtNumImp").blur(function(){ controllaCampiNumerici(document.dati.txtNumImp,document.getElementById('lblNumImp'));});
			
			//ONBLUR  txtAltezza
			jQuery("#txtAltezza").blur(function(){ controllaCampiNumerici(document.dati.txtAltezza ,document.all['lblAltezza']); });
			
			//ONBLUR  txtDiuresi_L
			jQuery("#txtDiuresi_L").blur(function(){ 
				controllaCampiNumerici(document.dati.txtDiuresi_L,document.all['lblDiuresi_L']);
				controllaDiuresi();
			});
			
			//ONBLUR  txtGravidanza_L
			jQuery("#txtGravidanza_L").blur(function(){ controllaCampiNumerici(document.dati.txtGravidanza_L,document.all['lblGravidanza_L']);});
			
			//ONBLUR  txtPeso
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });
			
			//ONLOAD  body
			POCT.retrieveIdenScheda();
			valorizzaMed();
			document.all['lblStampa'].parentElement.style.display = 'none';
			nascondiCampi();
			cambiaPulsante();
			document.all.hUrgenza.value = '2';

			URGENZA.setUrgenza();
			if(typeof document.EXTERN.URGENZA != 'undefined'){
				URGENZA.setCampiUrgenzaModifica();
			}		
			document.getElementById('txtDiuresi_ore').value='24';
			document.getElementById('txtDiuresi_ore').style.visibility='hidden';
			
		break;
		
		// MODIFICA ////////////////////////////////
		case 'E':
			//Click sulla label dei combo
			jQuery("#lblPrestRich_L").click(function(){document.all.hUrgenza.value !=''?apriContenitoreLabo():alert('Scegliere il grado di urgenza')});			
			
			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			
			//ONBLUR  txtDataProposta
			jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
			
			//ONBLUR  txtNumImp
			jQuery("#txtNumImp").blur(function(){ controllaCampiNumerici(document.dati.txtNumImp,document.getElementById('lblNumImp'));});
			
			//ONBLUR  txtAltezza
			jQuery("#txtAltezza").blur(function(){ controllaCampiNumerici(document.dati.txtAltezza ,document.all['lblAltezza']); });
				
			//ONBLUR  txtDiuresi_L
			jQuery("#txtDiuresi_L").blur(function(){ 
				controllaCampiNumerici(document.dati.txtDiuresi_L,document.all['lblDiuresi_L']);
				controllaDiuresi();
			});
			
			//ONBLUR  txtGravidanza_L
			jQuery("#txtGravidanza_L").blur(function(){ controllaCampiNumerici(document.dati.txtGravidanza_L,document.all['lblGravidanza_L']);});
					
			//ONBLUR  txtPeso
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });
					
			//ONLOAD  body
			valorizzaMed();
			URGENZA.setCampiUrgenzaModifica();
			nascondiCampi();
			cambiaPulsante();
			document.all['lblStampa'].parentElement.style.display = 'none';
			document.getElementById('txtDiuresi_ore').value='24';
			document.getElementById('txtDiuresi_ore').style.visibility='hidden';
			document.getElementById('lblDiuresi_ore').style.visibility='hidden';
			
		break;
			
			
		// LETTURA ////////////////////////////////
		case 'L':
			
			//ONLOAD  body
			valorizzaMed();
			URGENZA.setCampiUrgenzaModifica();
			cambiaPulsante();
			document.all['lblStampa'].parentElement.style.display = 'none';
			document.all['lblRegistraLabo'].parentElement.parentElement.style.display = 'none';
			if(document.EXTERN.LETTURA.value== 'S'){
				HideLayerFieldset('divGroupUrgenzaLabo');
			}		
			
		break;
	}
});


function caricamento(statoPagina){
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
	
	if(statoPagina !='L'){
		DATA_PROPOSTA.addEvent();
	}
	
	//jQuery("#txtNumImp").parent().attr("colSpan", "10");
	jQuery("#btPlusImp").parent().attr("colSpan", "1");
	
	//funzione che carica la data proposta se arriva in input	
	if(statoPagina == 'I'){
		caricaDataOraInput();
	}
	
	try {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtUltimeMestrua);
		oDateMask.attach(document.dati.txtDataProposta);
	}catch(e){
		//alert(e.description);
	}
	
	document.all.lblTitleUrgenza_L.innerText = 'Grado Urgenza';
	
}


/**
/*
Funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico 
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

/**
*/
//funzione che 'prepara' i dati e valorizza i campi nascosti per il salvataggio. Alla fine lancia registra()
function preSalvataggio(){	
	
	//var controindicazioni = '';
	var esami = '';
	var metodiche = '';
	var esaMetodica = '';
	var doc = document.dati;
	var materiali = '';
	
/*
	//	Valorizza Hiden_controindicazioni leggendo i valori della ListBox cmbControindicazioni
	for(i = 0; i < doc.cmbControindicazioni.length; i++){
		
		if(doc.cmbControindicazioni.length-1 == i){
			controindicazioni += doc.cmbControindicazioni[i].value;
		}else{
			controindicazioni += doc.cmbControindicazioni[i].value + ',';
		}
	}
	
	doc.Hiden_controindicazioni.value = controindicazioni;
*/
		
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
		
		//alert(esaMetodica[0]+'/n'+esaMetodica[1]);
	}
	
	doc.HelencoEsami.value = '';
	doc.HelencoMetodiche.value ='';
	doc.Hmateriali.value =''; 
	doc.HelencoEsami.value = esami;
	doc.HelencoMetodiche.value = metodiche;
	doc.Hmateriali.value = materiali;
	
	//	Se in Inserimento o modifica, valorizza il cdc_destinatario
	if (document.EXTERN.LETTURA.value == 'N'){			
		doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
	}
	
	//	Obbliagatorietà di scelta di almeno una prestazione
	var al = '';
		
		if (al != ''){
	
			alert (al);
			return;
		}

	// controllo la lunghezza dell'ora e il formato
	// controllaOraProposta();

	if (baseUser.LOGIN == 'lucas'){	
	
		var debug = 'IDEN: ' + doc.Hiden.value;
		 debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
		 debug += '\nUTE_INS: ' + document.all.Hiden_op_rich.value;
		 debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
		 debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
		 debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
		  /*debug += '\nCONTROINDICAZIONI: ' + doc.Hiden_controindicazioni.value;*/
		 debug += '\nESAMI: ' + doc.HelencoEsami.value;
		 debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
		 debug += '\nURGENZA: ' + doc.hUrgenza.value;
		 debug += '\nNOTE: ' + doc.txtNote_L.value;
		 debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
		 debug += '\nQUESITO: ' + doc.txtQuesito_L.value;
		 debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;
		 debug += '\nMATERIALI: ' + doc.Hmateriali.value;
		
		alert(debug);
 	}
	registra();	
}


//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){
	document.all['lblMotAnn_L'].parentElement.style.display = 'none';
	document.all['txtMotivoAnnullamento_L'].parentElement.style.display = 'none';
	document.all['lblControindicazioni_L'].parentElement.style.display = 'none';
	document.all['cmbControindicazioni'].parentElement.style.display = 'none';
	//document.all['txtDataRichiesta_L'].parentElement.style.display = 'none';
	//document.all['lblDataRichiesta_L'].parentElement.style.display = 'none';
	//document.all['txtOraRichiesta_L'].parentElement.style.display = 'none';
	//document.all['lblOraRichiesta_L'].parentElement.style.display = 'none';
	//HideLayer('groupOperatoriLabo');
	HideLayerFieldset('divGroupOperatoriLabo');
	HideLayerFieldset('divGroupUrgenzaLabo');
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

//funzione che apre la servlet contenitore che contiene le servlet di scelta esami
function apriContenitoreLabo(){

	var urgenza = document.all.hUrgenza.value;

	if(document.EXTERN.LETTURA.value !="S" ){
		
		var url = "servletGenerator?KEY_LEGAME=SCELTA_ESAMI_LABO" +
					"&URGENZA="+urgenza+
					"&CDC_DESTINATARIO="+$('#DESTINATARIO').val()+
					"&REPARTO_RICHIEDENTE="+document.EXTERN.HrepartoRicovero.value+
					"&TIPO=R"+
					"&METODICA=L"+
					"&IDEN_SCHEDA="+$('#HidenScheda').val();


		window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
		
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
			
			jQuery(".dp").each(function(){
				
				if(date_p!=''){ date_p += '#'; }
				
				date_p += jQuery(this).val();
			});
			
			jQuery(".op").each(function(){
				
				if(ore_p!=''){ ore_p += '#'; }
				
				ore_p += jQuery(this).val();
			});
			
			if(baseUser.LOGIN =='lucas'){
				//alert('Date: '+date_p+'\nOre'+ore_p+'\nUtente'+utente+'\nKey_legame'+key_legame+'\nIden dell\'XML'+idenXML+'\n');
			}
			
			if(date_p != ''){
				var rs = WindowCartella.executeStatement("OE_Richiesta.xml","duplicaRichiesta",[utente, user_login, key_legame, date_p, ore_p, idenXML]);
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
			
			jQuery("#btPlus"+numeroRiga).parent().unbind('click',false);
			jQuery("#btPlus"+numeroRiga).parent().bind('click',function(){DATA_PROPOSTA.riga(numeroRiga);});
			jQuery("#btPlus"+numeroRiga).parent().attr("action","remove");
			
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
			})
			
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


var POCT = {
	retrieveIdenScheda:function(){
		var rs = WindowCartella.executeQuery("OE_Richiesta.xml","getIdenSchedaLabo",[$('#Hcodice_scheda').val()]);
		while (rs.next()){
			$('#HidenScheda').val(rs.getString('iden'));	
		}
	}
	
};