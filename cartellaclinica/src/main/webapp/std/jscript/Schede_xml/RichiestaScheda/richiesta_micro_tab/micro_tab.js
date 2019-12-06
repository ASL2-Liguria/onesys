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
			
			//ONBLUR  txtDataProposta
			jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
			
			//ONBLUR  txtNumImp
			jQuery("#txtNumImp").blur(function(){ controllaCampiNumerici(document.dati.txtNumImp,document.getElementById('lblNumImp'));});
			
			//ONBLUR  txtAltezza
			jQuery("#txtAltezza").blur(function(){ controllaCampiNumerici(document.dati.txtAltezza ,document.all['lblAltezza']); });

			//ONBLUR  txtPeso
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });
			
			//ONLOAD  body
			valorizzaMed();
			caricaDataOraInput();
			document.all['lblStampa'].parentElement.style.display = 'none';
			document.all.hUrgenza.value = '0';
			setUrgenza();
			HideLayerFieldset('divGroupUrgenzaLabo');
			nascondiCampi();
			
		break;
		
		// MODIFICA ////////////////////////////////
		case 'E':
			
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
			
			//ONBLUR  txtPeso
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });
					
			//ONLOAD  body
			document.all['lblStampa'].parentElement.style.display = 'none';
			valorizzaMed();
			setUrgenzaScheda();
			HideLayerFieldset('divGroupUrgenzaLabo');
			nascondiCampi();
			
		break;
			
		// LETTURA ////////////////////////////////
		case 'L':
			
			//ONLOAD  body
			valorizzaMed();
			setUrgenzaScheda();
			document.all['lblStampa'].parentElement.style.display = 'none';
			document.all['lblRegistraLabo'].parentElement.parentElement.style.display = 'none';
			if(document.EXTERN.LETTURA.value== 'S'){
				HideLayerFieldset('divGroupUrgenzaLabo');
			}
			//nascondiCampi();
			
		break;
	}
});

function caricamento(statoPagina){

	if(statoPagina !='L'){
		DATA_PROPOSTA.addEvent();
	}
        
        jQuery("#txtQuesito_L").parent().css({float:'left'}).append($('<div></div>').addClass('classDivEpi').attr("title","Recupera Epicrisi").click(function() {
            var rs = WindowCartella.executeQuery("diari.xml", "getEpicrisiRicovero", WindowCartella.getRicovero("NUM_NOSOLOGICO"));
            // Recupero valori epicrisi e carico in textarea
            while (rs.next()) {
                $("#txtQuesito_L").append(rs.getString("EPICRISI") + "<br/>");
            }
        }));        
	
	//jQuery("#txtNumImp").parent().attr("colSpan", "10");
	jQuery("#btPlusImp").parent().attr("colSpan", "1");
	document.getElementById('hTerapiaAnt').parentElement.style.display='none';

	try {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtDataProposta);
	}catch(e){}

	try{
        WindowCartella.utilMostraBoxAttesa(false);
	}catch(e){}
}


//funzione che apre la servlet contenitore che contiene le servlet di scelta esami
function apriContenitoreLabo(){
	
	var url = '';
	var urgenza = document.all.hUrgenza.value;
	var idpagina = '';
	var Iden_Pro='';
	
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
		
	if(document.EXTERN.LETTURA.value !="S" ){
		
		//url = "servletGenerator?KEY_LEGAME=SCELTA_ESAMI_MICRO_SV&Hiden_pro="+iden_Pro+"&URGENZA="+urgenza+"&REPARTO="+document.EXTERN.HrepartoRicovero.value+"&IDPAGINA="+idpagina;
		url = "servletGenerator?KEY_LEGAME=BK_DNA_PCR&Hiden_pro="+iden_Pro+"&URGENZA="+urgenza+"&REPARTO="+document.EXTERN.HrepartoRicovero.value+"&IDPAGINA="+idpagina;
		var popup  = window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
		try{
			WindowCartella.opener.top.closeWhale.pushFinestraInArray(popup);
		}catch(e){
			
		}
		
		/*try{
			parent.$.fancybox({
				'padding'	: 3,
				'autoScale'	: false,
				'transitionIn'	: 'none',
				'transitionOut'	: 'none',
				'width'		: 1024,
				'height'	: 768,
				'href'		: url,
				'type'		: 'iframe'
			});
		}catch(e){
			window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
		}*/
		//alert (url);
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
				materiali += '#';
				corpo += '#';
				note += '#';
			}		
		
		esami += esaMetodica[0];
		metodiche += 'A';
		materiali += esaMetodica [1];
		corpo += esaMetodica [2];
		note += esaMetodica [3];
		
		//alert(esaMetodica[0]+'/n'+esaMetodica[1]);
	}
	
	doc.HelencoEsami.value = '';
	doc.HelencoMetodiche.value ='';
	doc.Hmateriali.value ='';
	doc.HelencoCorpo.value = '';
	doc.Hnote.value = '';
	doc.HelencoEsami.value = esami;
	doc.HelencoMetodiche.value = metodiche;
	doc.Hmateriali.value = materiali;
	doc.HelencoCorpo.value = corpo;
	doc.Hnote.value = note;

	//	Se in Inserimento o modifica, valorizza il cdc_destinatario
	if (document.EXTERN.LETTURA.value == 'N'){			
		doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
	}

	// controllo la lunghezza dell'ora e il formato
	// controllaOraProposta();

	if (baseUser.LOGIN == 'lucas'){	
		
		var debug = 'IDEN: ' + doc.Hiden.value;
		 debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
		 debug += '\nUTE_INS: ' + document.all.Hiden_op_rich.value;
		 //debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
		 debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
		 debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
		  /*debug += '\nCONTROINDICAZIONI: ' + doc.Hiden_controindicazioni.value;*/
		 debug += '\nESAMI: ' + doc.HelencoEsami.value;
		 debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
		 debug += '\nMATERIALI: ' + doc.Hmateriali.value;
		 debug += '\nPARTI DEL CORPO: ' + doc.HelencoCorpo.value;
		 debug += '\nNOTE ESAMI: ' + doc.Hnote.value;
		 debug += '\nNOTE: ' + doc.txtNote_L.value;
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



//funzione che modifica la label del div a seconda del grado dell'urgenza
function setUrgenza(){

	if (urgenzaGenerale ==''){
		urgenzaGenerale=document.getElementById('hUrgenza').value
	}

	//document.all.lblTitleUrgenza_L.innerText = 'Grado Urgenza';
	var urgenza = document.all.hUrgenza.value;

	//controllo se la pagina è in modalità di inserimento
	if (_STATO_PAGINA == 'I' || _STATO_PAGINA == 'E'){
	
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
				//apriContenitoreLabo();
				break;
		}
		return;
	
	}else{	
		
		alert ('Impossibile modificare il grado di urgenza');	
	}
}

/**
*/

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

function stampa_scheda_richiesta(){
	var sf= '{TESTATA_RICHIESTE.IDEN}='+document.EXTERN.KEY_ID.value;
	var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_LABO_SPZ_0&stampaReparto=RICHIESTA_GENERICA_LABO_SPZ&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra){	
		finestra.focus();
	}else{
		var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_LABO_SPZ_0&stampaReparto=RICHIESTA_GENERICA_LABO_SPZ&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}
}




//Funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico 
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
			
			if(baseUser.LOGIN =='lucas'){
				alert('Date: '+date_p+'\nOre'+ore_p+'\nUtente'+utente+'\nKey_legame'+key_legame+'\nIden dell\'XML'+idenXML+'\n');
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