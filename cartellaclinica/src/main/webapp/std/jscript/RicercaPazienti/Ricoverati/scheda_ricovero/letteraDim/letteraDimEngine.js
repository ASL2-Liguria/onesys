/*2 array contenenti i caratteri da sostituire prima del salvataggio per evitare che oracle interpreti &<qualcosa> come parametro e non come valore*/
var arRE2replace 			= new Array(/&nbsp;/g,/&ugrave;/g,/&eacute;/g,/&egrave;/g,/&igrave;/g,/&agrave;/g,/&ograve;/g);
var arChar4replace 			= new Array(' ','�','�','�','�','�','�');
var strutturaDaIncollare 	= null;
var changeEvent				= false;
var WindowCartella 			= null;
var _ALLEGATO_DATI_LABO = {
	
	'allegato' : '',
	'elencoTestate'  : '',
	'elencoEsami' : '',
	'elencoEsamiCodici' : '',
	'parametroStampa' : '',
	
	SETTINGS : {
		
		'LETTERA_STANDARD' 		: {'allegato' : true, 'farmaciAlBisogno' : true},
		'LETTERA_DIMISSIONI_DH' : {'allegato' : true, 'farmaciAlBisogno' : true},
		'LETTERA_PROSECUZIONE' 	: {'allegato' : false, 'farmaciAlBisogno' : true},
		'LETTERA_TRASFERIMENTO' : {'allegato' : false, 'farmaciAlBisogno' : true},
		'LETTERA_AL_CURANTE' 	: {'allegato' : true, 'farmaciAlBisogno' : true},
		'LETTERA_PRIMO_CICLO' 	: {'allegato' : true, 'farmaciAlBisogno' : false},
		'LETTERA_FARMACIA' 		: {'allegato' : true, 'farmaciAlBisogno' : true},
		'FUNZIONE_ATTIVA'		: ''
	}
};

jQuery(document).ready(function(){
	window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti 	= WindowCartella.baseReparti;
    window.baseGlobal 	= WindowCartella.baseGlobal;
    window.basePC 		= WindowCartella.basePC;
    window.baseUser 	= WindowCartella.baseUser;  
    
    try{
    	_V_DATI	= WindowCartella.getForm();
    }catch(e)
    {    
    	window.WindowCartella = parent.opener.top.window;
    }
    try{
    	_ALLEGATO_DATI_LABO.SETTINGS['FUNZIONE_ATTIVA']	= document.frmLettera.funzione.value;
	}catch(e){}
	
	try{
		var dRic = $('#txtFineRicovero').val();
		if (dRic!=''){
			//var dataRic = parseInt(dRic.substring(6,10) + dRic.substring(3,5) + dRic.substring(0,2));
			var dataRic = dRic.substring(6,10) + dRic.substring(3,5) + dRic.substring(0,2);

			var dataFineRicoveroAdt = WindowCartella.getRicovero("DATA_FINE");
			$('#dataFineRicoveroAdt').val(dataFineRicoveroAdt);
	   		//if( ($('#dataFineRicoveroAdt').val()!='' && dataRic!=$('#dataFineRicoveroAdt').val())&& document.frmLettera.funzione.value!='LETTERA_PROSECUZIONE'){
			if(dataFineRicoveroAdt !='' && dataRic!=dataFineRicoveroAdt && document.frmLettera.funzione.value!='LETTERA_PROSECUZIONE'){
				alert('Attenzione: la data di fine ricovero � diversa da quella indicata come  data di dimissione del paziente');
				$('#txtFineRicovero').focus();
	   		}
		}
	}catch(e){}
	
	NEONATOLOGIA.init();
});

jQuery(window).load(function(){
	/**
	 * Ricarica il frame interno se nel frame superiore il valore di CONTROLLO_ACCESSO � differente.
	 * 
	 * @author  gianlucab
	 * @version 1.0
	 * @since   2014-10-03
	 */
	try {
		if (typeof top.CartellaPaziente === 'object') 
			top.CartellaPaziente.controllaPaziente($('form[name=frmLettera] input[name=CONTROLLO_ACCESSO]').val());
	} catch(e) {
		alert(e.message);
	}
	
	// Controllo schede salvate
	if (NEONATOLOGIA.strError != null)
		alert(NEONATOLOGIA.strError);
});
/**
 * Funzione caricata sull'evento onload del body(definito da java)
 */
function initGlobalObject(){

	try{
		NS_LETTERA_CONSENSO.init();
		caricaClassiTextArea();
		initTinyMCE();
		initbaseUser();
		setHeight();
		showSection(0);
		try{
			ricerca();
		}catch(e){
			//alert(e.description);
		} //lancio l'eventuale ricerca dei testi std se abilitati nella pagina

		caricaSezAccertamenti();

		$('[name="frmLettera"]').append('<input type="hidden" name="AbsolutePath" value="'+WindowCartella.getAbsolutePath()+'" ></input>');

		if (WindowCartella.ModalitaCartella.isReadonly(document)==true) {
			$('#idRegistra, #idFirma').hide();
			appendFunctionToButton();
			WindowCartella.utilMostraBoxAttesa(false);
		}
		
		if (WindowCartella.ModalitaCartella.isStampabile(document)==false) {
			$('#idStampa').hide();
		}		

		// Se Prosecuzione Valorizzo Data Fine Ricovero con quella dell'ADT
		if (document.frmLettera.funzione.value == 'LETTERA_PROSECUZIONE'){

			var dataFineRicoveroADT	= jQuery("#dataFineRicoveroAdt").val();

			if(dataFineRicoveroADT.length > 0){
				dataFineRicoveroADT		= dataFineRicoveroADT.substring(6,8) + '/' + dataFineRicoveroADT.substring(4,6) + '/' + dataFineRicoveroADT.substring(0,4);
				jQuery("#txtFineRicovero").val(dataFineRicoveroADT);
			}else{
				jQuery("#txtFineRicovero").val('');
			}
			document.getElementById('txtFineRicovero').disabled = true;

			// Nascondo Immagine Calendario selezione Data
			jQuery(".trigger").hide();
			
			
		}
//		Controllo la presenza della configurazione di firma multipla
		if (NS_REGISTRA_FIRMA_LETTERA.configurazioneMultipla()){
			NS_LOAD_TERAPIA_DOMICILIARE.init();
		}
//		Controlla se ci sono dati strutturati di laboratorio		
		DATI_STRUTTURATI_ALLEGA.init();
	}catch(e){
		alert("letteraDimEngine initGlobalObject - Error: " + e.description);
	}

	jQuery("[name=idTxtStd]").each(function(){
		var target = jQuery(this).attr('idSezione');
		jQuery(this).addClass("classDivTestiStd").click(function(){apriTestiStandard(target);});
	});
	
	
}

function  apriTestiStandard(targetOut){

	var reparto=gup('reparto');

	if (WindowCartella.ModalitaCartella.isReadonly ( document )==true){return;}

	var url='servletGenerator?KEY_LEGAME=SCHEDA_TESTI_STD&TARGET='+targetOut+"&PROV=LETTERA&FUNZIONE=LETTERA_STD&REPARTO="+reparto;
	$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 580,
		'href'		: url,
		'type'		: 'iframe'
	});
}

function initTinyMCE(){
	try{

		tinyMCE.init({
			mode : "textareas",
			theme : "advanced",
			language : "it",
			theme_advanced_buttons1 : "copy,paste,|,bold,italic,underline,strikethrough,|,fontselect,fontsizeselect,|,forecolor,|,backcolor,|,bullist,numlist,|,removeformat,undo,redo,|,pasteStrutcture",
			theme_advanced_buttons2 : "",
			theme_advanced_buttons3 : "",
			theme_advanced_buttons4 : "",
			theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
			skin : "o2k7",
			skin_variant : "silver",
			editor_deselector : /(Terapie|Readonly)/,
	        force_br_newlines : true,
	        force_p_newlines : false,
	        handle_event_callback : function(e) {
	        	if ( e.ctrlKey && e.keyCode == 86 && e.type == "keydown") {   
	        		tinyMCE.activeEditor.setContent(tinyMCE.activeEditor.getContent() + window.clipboardData.getData("Text"));
	        		e.preventDefault();
		        //     return tinyMCE.cancelEvent(e);
		          }

		          return true;
		       },
			setup : function(ed) {		
				ed.addButton('pasteStrutcture', {
					title : 'Incolla struttura generata',
					image : '../jscripts/tiny_mce/plugins/example/img/example.gif',
					onclick : function() {
                        strutturaDaIncollare = window.clipboardData.getData("Text");
                        alert(strutturaDaIncollare);
						if(strutturaDaIncollare==null){alert('Nessuna struttura generata');return;}
						ed.setContent(ed.getContent() + strutturaDaIncollare);


					}
				});
			}
		});
		
		tinyMCE.init({
			mode : "textareas",
			editor_selector : "Readonly",
			theme : "advanced",
			readonly: 1,
	        force_br_newlines : true,
	        force_p_newlines : false,
			setup : function(ed) {}
		});
		
		tinyMCE.init({
			mode : "textareas",
			editor_selector : "Terapie",
			theme : "advanced",
			language : "it",
			theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
			theme_advanced_buttons1 : "apriTerapie,|,copy,paste,|,bold,italic,underline,strikethrough,|,fontselect,fontsizeselect,|,forecolor,|,backcolor,|,bullist,numlist,|,removeformat,undo,redo",
			theme_advanced_buttons2 : "",
			theme_advanced_buttons3 : "",
			theme_advanced_buttons4 : "",
	        force_br_newlines : true,
	        force_p_newlines : false,
			init_instance_callback : function(editor) {
				eventChangeTiny();
	        	appendFunctionToButton();
	        	WindowCartella.utilMostraBoxAttesa(false);		        
		    },
	        
			setup : function(ed) {
				ed.addButton('apriTerapie', {
					title : 'Apri Terapie',
					image : 'imagexPix/button/farma_btn.png',
					onclick : function() { apriTerapie();
					}
				});	        
			}
		});
			
	}
	catch(e){
		alert("initTinyMCE - Error: " + e.description);
	}	
}


function registra(firma){
	if (document.frmLettera.readonly.value=='S')
	{
		alert('Lettera di dimissioni in sola lettura: impossibile registrare e/o salvare nuova versione!');
		return;
	}
	var funzione	= document.frmLettera.funzione.value;
/*	if (WindowCartella.ModalitaCartella.isReadonly ( document )==true)
	{
		$('.pulsanteBarraFooter').hide();
		alert('Cartella Clinica in sola lettura');
		return;
	}*/

	if(firma=='N' && document.frmLettera.stato.value=='F'){
		alert('Impossibile sovrascrivere una lettera firmata digitalmente, procedere firmando versione sostitutiva');
		return;
	}

	var dRic = $('#txtFineRicovero').val();
	var DataOdierna = new Date();
	var dataRic 	= parseInt(dRic.substring(6,10) + dRic.substring(3,5) + dRic.substring(0,2));

	if (dRic != '' && funzione == 'LETTERA_STANDARD')
	{
		$('#dataFineRicoveroAdt').val(WindowCartella.getRicovero("DATA_FINE"));
		if ( $('#dataFineRicoveroAdt').val()!='' &&  $('#dataFineRicoveroAdt').val()!=dataRic)
		{
			alert('Attenzione: la data di fine ricovero � diversa da quella indicata come  data di dimissione del paziente' );
			$('#txtFineRicovero').focus();
			return;
		}
		else if ($('#dataFineRicoveroAdt').val()=='' && dataRic < parseInt(getData(DataOdierna,'YYYYMMDD')))
		{
			alert('La data di fine ricovero inserita � antecedente alla data attuale ');
			$('#txtFineRicovero').focus();
			return;
		}
	}
	else if(funzione == 'LETTERA_PROSECUZIONE')
	{
		var dataADTStr	= jQuery("#dataFineRicoveroAdt").val();
		var day			= parseInt(dataADTStr.substring(6,8));
		var month		= parseInt(dataADTStr.substring(4,6)-1);
		var year		= parseInt(dataADTStr.substring(0,4));
		var dataADT		= new Date(year , month , day );

		//alert(' - Data ADT: ' + dataADT + '\n - Data Oggi: ' +  DataOdierna);
		if(dataADTStr.length == 0 || isNaN(dataADT)){
			alert('Data di Dimissioni NON Valida. Impossibile Continuare la Registrazione!');
			return;

		}
		if(dataADT > DataOdierna){
			alert('La data odierna risulta antecedente a quella di dimissione');
			return;
		}

	}
	else
	{
		if (firma=='S')
		{
			alert('Inserire la data di fine ricovero!');
			$('#txtFineRicovero').focus();
			return;
		}
	}
	
	if (NS_LETTERA_CONSENSO.consensoAttivo){
		 var respCheck=NS_LETTERA_CONSENSO.checkConsenso();
		if (respCheck!=''){
			return alert(respCheck);
		}else{	
			var retFromSave = NS_LETTERA_CONSENSO.saveConsenso();
			if (!retFromSave.esito){
				return alert(retFromSave.motivo)
			}
		}
	}
	$( "#idRegistra").unbind( "click" );
	$( "#idFirma").unbind( "click" );
	$( "#idStampa").unbind( "click" );
//  var consenso = checkConsensoDocumento(checkIdenRiferimento(),document.frmGestionePagina.funzione.value);
//  if (firma=='S' && !consenso){
//      registraConsensoDocumento();        
//  }else{
    WindowCartella.utilMostraBoxAttesa(true);
    //LETTERA DIMISSIONI / LETTERA PROSECUZIONE
    var iden_visita = WindowCartella.FiltroCartella.getIdenRiferimento(WindowCartella.getForm(document));
    sectionInGrassetto("idMotivoRicovero");
    sectionInGrassetto("idDiagnosiDimissione");
        //Se presente la configurazione per la firma multipla, la parte di registrazione viene definita e implementata nel file NS_REGISTRA_FIRMA_LETTERA.js
        if (NS_REGISTRA_FIRMA_LETTERA.configurazioneMultipla()) {
        	NS_REGISTRA_FIRMA_LETTERA.registra({"firma":firma,"dataFine":typeof dRic==undefined || dRic==""?"":dRic});
        }else{
	//        Salvataggio Sezioni
	        var arIdSection 		= new Array();
	        var arLblArea 			= new Array();
	        var arRowsArea 			= new Array();
	        var arLblSection 		= new Array();
	        var arContent2convert 	= new Array();
	        var arContentConverted 	= new Array();
	        var arIdenFar			= new Array();
	        var arScatole			= new Array();
	        var arPrimoCiclo		= new Array();
	        var arDose				= new Array();
	        var arDurata			= new Array();
	        var arTipoTerapia		= new Array();
	        var arStatoTerapia		= new Array();
	        var arCategoria			= new Array();
	
	        try
	        {
	            dwr.engine.setAsync(false);
//			 Recupero dal frame delle terapie, gli array per il salvataggio delle terapie su cc_lettera_farmaci 
	            if (window.frames['frameTerapie'] && window.frames['frameTerapie'].arTerapie) {
	                var arTerapie = window.frames['frameTerapie'].arTerapie;
	                /*for (var idx=0;idx<arTerapie.length;idx++)
	                {
	                    arPrimoCiclo.push(arTerapie[idx][0]);
	                    arIdenFar.push(arTerapie[idx][1]);
	                    arStatoTerapia.push(arTerapie[idx][2]);
	                    arTipoTerapia.push(arTerapie[idx][3]);
	                    arDose.push(arTerapie[idx][4]);
	                    arDurata.push(arTerapie[idx][5]);
	                    arScatole.push(arTerapie[idx][6]);
	                    arCategoria.push(arTerapie[idx][7]);
	                }*/
					$.each(arTerapie,function(i,value){
						arIdenFar.push(value.getIdenFarmaco());
						arStatoTerapia.push(value.getStatoTerapia());
						arTipoTerapia.push(value.getTipoTerapia());
						arDose.push(value.getDose());
						arDurata.push(value.getDurata());
						arScatole.push(value.getScatole());					
						arPrimoCiclo.push(value.getPrimoCiclo());	
						arCategoria.push(value.getCategoria());				
						
					});
	                
	                
	            } else {
	                arIdenFar.push(0);
	            }
	
//			 Salvataggio Sezioni - Creazioni array di salvataggio  - Recupero dalle textaree il testo che convertir� per eliminare i caratteri accentati e i tag html(testo_piano)
	            var lista_sezioni = document.getElementsByTagName("textarea");
	            for(var i=0;i<lista_sezioni.length;i++){
	                if(typeof lista_sezioni[i].attiva!='undefined'){
	                    arIdSection.push(lista_sezioni[i].id);
	                    arLblArea.push(lista_sezioni[i].label);
	                    arRowsArea.push(lista_sezioni[i].rows);
	                    arLblSection.push(lista_sezioni[i].sezione);
	
	                    var str = tinyMCE.get(lista_sezioni[i].id).getContent();
	                    for(var j=0;j<arRE2replace.length;j++){
	                        str= str.replace(arRE2replace[j],arChar4replace[j]);
	                    }
	                    arContent2convert.push(str);
	                }
	            }
	
	            dwrPreparaFirma.convertHtmlToText(arContent2convert, replyConverter);
	            function replyConverter(reply){
	                arContentConverted= reply;
//			Inizio funzione di salvataggio
//			Controllo se ci sono dei dati di laboratorio allegati o configurati(configurazione presente all'inizio dei javascript letteraDimEngine.js e LetteraDimEngineNew.js) per essere allegati		
	                if (_ALLEGATO_DATI_LABO.SETTINGS[_ALLEGATO_DATI_LABO.SETTINGS['FUNZIONE_ATTIVA']]['allegato'] && _ALLEGATO_DATI_LABO.allegato=='S')
	                    $('input[name="allegaDatiStr"]').val(_ALLEGATO_DATI_LABO.parametroStampa);			
	
	                var tipiParametri = new Array();
	                var valoriParametri = new Array();
//    Salvata la funzione che genera il salvataggio	
	                tipiParametri.push('VARCHAR');
	                valoriParametri.push(document.frmLettera.funzione.value);
//    Salvato l'iden ricovero	
	                tipiParametri.push('NUMBER');
	                valoriParametri.push(iden_visita);
//    Salvato l'iden visita associato all'accesso del ricovero
	                tipiParametri.push('NUMBER');
	                valoriParametri.push(WindowCartella.getForm(document).iden_visita);
//    Salvato l'iden del utente che sta eseguendo il salvataggio
	                tipiParametri.push('NUMBER');
	                valoriParametri.push(baseUser.IDEN_PER);
//		Parametro che mi indica se � una firma o registrazione	
	                tipiParametri.push('VARCHAR');
	                valoriParametri.push(firma);
	
	                tipiParametri.push('VARCHAR');
	
	                var txtMedPed = $('#txtMedPed').val() === undefined || $('#txtMedPed').val() == null ? "" : $('#txtMedPed').val(); 
	                var hMedPed = $('#hMedPed').val() === undefined || $('#hMedPed').val() == null ? "" : $('#hMedPed').val();
	//                 alert('Registrazione: ' + _ALLEGATO_DATI_LABO.parametroStampa);
	                if (_ALLEGATO_DATI_LABO.SETTINGS[_ALLEGATO_DATI_LABO.SETTINGS['FUNZIONE_ATTIVA']]['allegato'] && _ALLEGATO_DATI_LABO.allegato == 'S'){
	                    DATI_STRUTTURATI_ALLEGA.getCodEsaByIden();
	//                    valoriParametri.push('<PAGINA><CAMPI><CAMPO KEY_CAMPO="DATA_FINE_RICOVERO">'+dRic+'</CAMPO><CAMPO KEY_CAMPO="ALLEGA_DATI_STRUTTURATI">'+ _ALLEGATO_DATI_LABO.parametroStampa +'</CAMPO></CAMPI></PAGINA>');
	                    valoriParametri.push('<PAGINA><CAMPI><CAMPO KEY_CAMPO="DATA_FINE_RICOVERO">'+dRic+'</CAMPO><CAMPO KEY_CAMPO="ALLEGA_DATI_STRUTTURATI">'+ _ALLEGATO_DATI_LABO.parametroStampa +'</CAMPO><CAMPO KEY_CAMPO="TXT_MED_PED">'+txtMedPed+'</CAMPO><CAMPO KEY_CAMPO="H_MED_PED">'+hMedPed+'</CAMPO></CAMPI></PAGINA>');
	                }else{			
	//                    valoriParametri.push('<PAGINA><CAMPI><CAMPO KEY_CAMPO="DATA_FINE_RICOVERO">'+dRic+'</CAMPO><CAMPO KEY_CAMPO="ALLEGA_DATI_STRUTTURATI">N##</CAMPO></CAMPI></PAGINA>');			
	                    valoriParametri.push('<PAGINA><CAMPI><CAMPO KEY_CAMPO="DATA_FINE_RICOVERO">'+dRic+'</CAMPO><CAMPO KEY_CAMPO="ALLEGA_DATI_STRUTTURATI">N##</CAMPO><CAMPO KEY_CAMPO="TXT_MED_PED">'+txtMedPed+'</CAMPO><CAMPO KEY_CAMPO="H_MED_PED">'+hMedPed+'</CAMPO></CAMPI></PAGINA>');			
	                }
	
	//                 array di varchar -> idSezioni da salvare 
	                tipiParametri.push('ARRAY_VALUE_ID_SEZIONE');
	                tipiParametri.push('ARRAY_VALUE_LBL_SEZIONE');
	                tipiParametri.push('ARRAY_VALUE_ARROWSAREA');
	                tipiParametri.push('ARRAY_VALUE_ARROWSLBLAREA');
	//                 array di clob -> testo html 
	                tipiParametri.push('ARRAY_CLOB_HTML');
	//                 array di clob -> testo piano 
	                tipiParametri.push('ARRAY_CLOB_PIANO');
	//                 array: iden_farmaco,scatole,primo_ciclo -> testo piano 
	                tipiParametri.push('ARRAY_VALUE_IDEN_FAR');
	                tipiParametri.push('ARRAY_VALUE_SCATOLE');
	                tipiParametri.push('ARRAY_VALUE_PRIMO_CICLO');
	                tipiParametri.push('ARRAY_VALUE_DOSE');
	                tipiParametri.push('ARRAY_VALUE_DURATA');
	                tipiParametri.push('ARRAY_VALUE_TIPO_TER');
	                tipiParametri.push('ARRAY_VALUE_STATO_TER');
	                tipiParametri.push('ARRAY_VALUE_CATEGORIA');
	                dwrPreparaFirma.preparaFirmaClob('{call CC_LETTERA_SAVE_CLOB_GEN(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}',tipiParametri,valoriParametri,arIdSection,arLblSection,arRowsArea,arLblArea,arContent2convert,arContentConverted,arIdenFar,arScatole,arPrimoCiclo,arDose,arDurata,arTipoTerapia,arStatoTerapia,arCategoria,replyRegistra);
	            }
	
	            function replyRegistra(returnValue){
	                WindowCartella.utilMostraBoxAttesa(false);
	                WindowCartella.DatiNonRegistrati.set(false);
	                if (firma !='S') {
	                    alert("Registrazione effettuata");
	                    appendFunctionToButton(false);
	                }
	                try{
	                    if (returnValue.split("*")[0]=="KO"){
	                        alert("Errore: " + returnValue.split("*")[1]);
	                        return;
	                    }
	                    if(firma=='S')firma_lettera();else{WindowCartella.utilMostraBoxAttesa(false);}
	                }
	                catch(e){alert("replyRegistra - Error: " + e.description);}
	
	            }
	            dwr.engine.setAsync(true);
	        }
	        catch(e){
	            alert("registra - Error: " + e.description);
	        }
        }
    //}
}

function firma_lettera(){
        var tmpVar;
        if(typeof(_V_DATI.iden_prericovero)=="undefined" || _V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == "")
            tmpVar  =  _V_DATI.ricovero;
        else
            tmpVar  =  _V_DATI.ricovero + ',' + _V_DATI.prericovero;
        
        $('[name="frmFirmaLettera"]').append('<input type="hidden" name="paramNosologico" value="'+tmpVar+'"></input>');
        $('[name="frmFirmaLettera"]').append('<input type="hidden" name="paramIdPaziente" value="'+_V_DATI.idRemoto+'"></input>');
        $('[name="frmFirmaLettera"]').append('<input type="hidden" name="paramDaData" value=""></input>');
        $('[name="frmFirmaLettera"]').append('<input type="hidden" name="paramAData" value=""></input>');        
        $('[name="frmFirmaLettera"]').append('<input type="hidden" name="paramModalita" value="'+returnModalitaStampa()+'"></input>');
        $('[name="frmFirmaLettera"]').append('<input type="hidden" name="paramProvRisultati" value="INT,PS,EST"></input>');
        $('[name="frmFirmaLettera"]').append('<input type="hidden" name="paramNumRichieste" value=""></input>');
        $('[name="frmFirmaLettera"]').append('<input type="hidden" name="paramBranca" value=""></input>');

        var myForm = document.frmFirmaLettera;

	var finestra = window.open("","finestra","fullscreen=yes scrollbars=no");
	myForm.target='finestra';
//	myForm.action='SrvFirmaPdf';
	myForm.action='servletGeneric?class=firma.SrvFirmaPdf';
	myForm.submit();
    WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);

}
function showSection(index){
	try{
		arSection = document.all['sections'].childNodes;
		arTabSections = document.all['tabSections'].childNodes;
		for (var i=0;i<arSection.length;i++){
			arSection[i].className = 'tabHide';
			arTabSections[i].className = '';
		}
		arSection[index].className = 'tabShow';
		arTabSections[index].className = 'active';
	}catch(e){}
}

function showInfo(index){
	try{
		arInfo = document.all['infos'].childNodes;
		arTabInfo = document.all['tabInfos'].childNodes;
		for (var i=0;i<arInfo.length;i++){
			arInfo[i].className = 'tabHide';
			arTabInfo[i].className = '';
		}
		arInfo[index].className = 'tabShow';
		arTabInfo[index].className = 'active';
		if (arInfo[index].id == 'idReferti' && arInfo[index].innerHTML=='') {
			caricaWkReferti(index);
		} else if (arInfo[index].id == 'idDatiLabo' && document.all.divTabLaboratorio.innerHTML=='') {
			caricaDati();
			try{GESTIONE_DATI_STRUTTURATI_GRAFICA.inition_selection_load();}catch(e){/*nessun dato presente*/}
		} else if (arInfo[index].id == 'idRefertiCons'){
			caricaWkRefertiConsulenze(index);
		} else if(arInfo[index].id == 'idLettere_Precedenti'){
            caricaWkLetterePrecedenti(index);
        }
		else if(arInfo[index].id == 'idRefertiAmb'){
			caricaWkRefertiAmb(index);
        }
	}catch(e){}
}
function setHeight(){
h=WindowCartella.document.all.frameWork.offsetHeight - document.all.divHeader.scrollHeight - document.all.footer.offsetHeight -document.all.divFrame.offsetHeight-10;
	document.all.divBody.style.height = h +'px';
}



function userDidNotLeave() {
    WindowCartella.utilMostraBoxAttesa(false);
}


function unLock(){
	//Lettera di dimissione e di prosecuzione di ricovero salvate per iden ricovero

	dwr.engine.setAsync(false);
	dwrPreparaFirma.unLockFunzione('CC_LETTERA_VERSIONI',document.frmLettera.funzione.value,WindowCartella.getForm(document).iden_ricovero,callBack);
	dwr.engine.setAsync(true);
	function callBack(reply){
		if(reply!='OK')alert(reply);
	}
}

function controllaData() {
	var da = $('#txtRicDal').val();
	var al = $('#txtRicAl').val();
	var dataDa = parseInt(da.substring(6,10) + da.substring(3,5) + da.substring(0,2));
	var dataAl = parseInt(al.substring(6,10) + al.substring(3,5) + al.substring(0,2));
	if (dataDa > dataAl) {
		alert('La data inserita � inferiore alla data di inizio ricovero');
		$('#txtRicAl').val('');
	}
}

function stampaLetteraDimissioniBozza(){

	if (WindowCartella.ModalitaCartella.isStampabile ( document ) == false)
	{
		alert('Cartella Clinica in sola lettura');
		return;
	}
	var myFormLettera = document.frmLettera;
	if (myFormLettera.stato.value=='F')
	{
		var finestra = window.open("","finestra","fullscreen=yes scrollbars=no");
		myFormLettera.target='finestra';
		myFormLettera.action='ApriPDFfromDB';
		myFormLettera.submit();
        WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
	}
	else
	{
		// Gestione Allegato
		var	iden_visita	= WindowCartella.FiltroCartella.getIdenRiferimento(_V_DATI);
		var sf			= '';

		if (_ALLEGATO_DATI_LABO.SETTINGS[_ALLEGATO_DATI_LABO.SETTINGS['FUNZIONE_ATTIVA']]['allegato']){
			
			if(_ALLEGATO_DATI_LABO.allegato == 'S'){
				sf  = 	'&prompt<pVisita>=' + iden_visita ;
				sf  += 	'&prompt<pReparto>=' + _V_DATI.reparto ;
				sf  += 	'&prompt<pIdenAnag>=' + _V_DATI.iden_anag ;
				sf  += 	'&prompt<pAllega>=' + _ALLEGATO_DATI_LABO.allegato;
                                
				if(_V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == "")
					sf  += '&prompt<pNosologico>=' + _V_DATI.ricovero;
				else
					sf  += '&prompt<pNosologico>=' + _V_DATI.ricovero + ',' + _V_DATI.prericovero;
					   
				sf  += '&prompt<pIdPaziente>=' + _V_DATI.idRemoto;
				sf  += '&prompt<pNumRichieste>=';
				sf  += '&prompt<pDaData>=';
				sf  += '&prompt<pAData>=';
				sf  += '&prompt<pProvRisultati>=INT,PS,EST';
				sf  += '&prompt<pModalita>=' + returnModalitaStampa();
				sf  += '&prompt<pBranca>=';   
				sf  += '&prompt<pWebUser>='+WindowCartella.baseUser.LOGIN;   				                        
                        }
			else{
				sf 	= 	'&prompt<pVisita>='+iden_visita;
				sf 	+= 	'&prompt<pReparto>=';
				sf 	+= 	'&prompt<pIdenAnag>=';
				sf 	+= 	'&prompt<pAllega>='+_ALLEGATO_DATI_LABO.allegato;
				sf  += 	'&prompt<pNosologico>=';			   
				sf  += 	'&prompt<pIdPaziente>=';
				sf  += 	'&prompt<pNumRichieste>=';
				sf  += 	'&prompt<pDaData>=';
				sf  += 	'&prompt<pAData>=';
				sf  += 	'&prompt<pProvRisultati>=';
				sf  += 	'&prompt<pModalita>=';
				sf  += 	'&prompt<pBranca>=';
				sf  +=  '&prompt<pWebUser>='+WindowCartella.baseUser.LOGIN;      				
			}
		}else{
			sf 	= 	'&prompt<pVisita>='+iden_visita;
			sf  += 	'&prompt<pReparto>=';
			sf  += 	'&prompt<pIdenAnag>=';
			sf  += 	'&prompt<pAllega>=N';		
			sf  += 	'&prompt<pNosologico>=';			   
			sf  += 	'&prompt<pIdPaziente>=';
			sf  += 	'&prompt<pNumRichieste>=';
			sf  += 	'&prompt<pDaData>=';
			sf  += 	'&prompt<pAData>=';
			sf  += 	'&prompt<pProvRisultati>=';
			sf  += 	'&prompt<pModalita>=';
			sf  += 	'&prompt<pBranca>=';
			sf  +=  '&prompt<pWebUser>='+WindowCartella.baseUser.LOGIN;      			
		}
		
		if (document.frmLettera.funzione.value=='LETTERA_FARMACIA'){
			sf += '&prompt<pIdenVersioneAssociata>='+ document.frmLettera.idenVersione.value;
		}
		// alert('sf : ' + sf );

        WindowCartella.confStampaReparto(document.frmLettera.funzione.value, sf, 'S', _V_DATI.reparto, null);

	}

}


function caricaWkReferti(index) {
	//	modifica per avere la stessa gestione fra la worklist esami strumentali e questa wk + il filtro sulla data
	var iniz_ric;
	if (WindowCartella.getRicovero("DEA_DATA_INGRESSO") !=null && WindowCartella.getRicovero("DEA_DATA_INGRESSO")!=''){
		iniz_ric=WindowCartella.getRicovero("DEA_DATA_INGRESSO");
	}
	else{
        iniz_ric=(WindowCartella.getPrericovero("IDEN") == null || WindowCartella.getPrericovero("IDEN") == "") ? WindowCartella.getRicovero("DATA_INIZIO") :WindowCartella.getPrericovero("DATA_INIZIO");                
	}
	
	//top.DatiCartella.Pazienti[top.getForm(document).iden_anag]['NOME']
//	cognome=cognome.replace(/'/gi,"''");
//	nome=nome.replace(/'/gi,"''");
	var idRemoto  	 = WindowCartella.getPaziente("ID_REMOTO");    
    top.dwr.engine.setAsync(false);
	top.dwrUtility.executeStatement("letteraSezioniInfo.xml","getIdenRefertiPs",[idRemoto,iniz_ric],1,cbkCaricaWkReferti);
	top.dwr.engine.setAsync(true);
	
	function cbkCaricaWkReferti(resp){	
	 if (resp[0]!='KO' && resp[2]!=''){
		 var wkReferti = "<IFRAME id='frameReferti' height=98%  width=100% src=\"servletGenerator?KEY_LEGAME=WK_REFERTI_LETTERA"+
			"&WHERE_WK=where iden_ref in("+resp[2]+") and FIRMATO = 'S' order by DAT_ESA_ORDINAMENTO desc\" frameBorder=0></IFRAME>";
			document.getElementById('infos').childNodes[index].innerHTML=wkReferti;
	}
	}
}

function caricaWkRefertiConsulenze(index)
{
	var vDati 	= WindowCartella.getForm(document);
	var url		= "servletGenerator?KEY_LEGAME=WK_REFERTO_CONSULENZA&WHERE_WK=where IDEN_VISITA=" + vDati.iden_ricovero + " or PARENT=" + vDati.iden_ricovero + " order by DATA_ESAME desc";
	var wkReferti = '<IFRAME id="frameReferti" height=98%  width=100% src="'+url+'" frameBorder=0></IFRAME>';
	document.getElementById('infos').childNodes[index].innerHTML=wkReferti;
}

function caricaWkRefertiAmb(index) {

	 var dati_ambulatorio = WindowCartella.CartellaPaziente.getRiferimentiAmbulatorio();
	var where="where FIRMATO='S' and  iden_anag =" + dati_ambulatorio.iden_anag +" AND DAT_ESA>='"+WindowCartella.getRicovero("DATA_INIZIO")+"'";
	
	if(WindowCartella.getRicovero("DATA_FINE")!=''){
		 where+=" AND DAT_ESA<='"+WindowCartella.getRicovero("DATA_FINE")+"'";
	 } 
	
    var url = "servletGenerator?KEY_LEGAME=WORKLIST"
        +"&TIPO_WK=WK_REFERTI_LETTERA_AMBU"
        +"&WHERE_WK="+where
        +"&NOME_POOL=elcoPool_ambulatorio"
        +"&ILLUMINA=javascript:illumina(this.sectionRowIndex);";
	var wkReferti = '<IFRAME id="frameReferti" height=98%  width=100% src="'+url+'" frameBorder=0></IFRAME>';
	document.getElementById('infos').childNodes[index].innerHTML=wkReferti;

}

function caricaWkLetterePrecedenti(index){
    var vDati = WindowCartella.getForm(document);
    var funzione_lettera = document.frmLettera.funzione.value;
    var where_secondo_funzione = '';
    /*switch(funzione_lettera){
	    case 'LETTERA_STANDARD' 		: 
	    case 'LETTERA_DIMISSIONI_DH' 	: 
	    case 'LETTERA_PROSECUZIONE' 	: where_secondo_funzione = "and funzione = '"+funzione_lettera+"' and (IDEN_RICOVERO<>"+vDati.iden_ricovero+" or accesso=1)";break;
	    default: where_secondo_funzione = "and funzione = '"+funzione_lettera+"' and IDEN_VISITA<>"+vDati.iden_visita;
	}*/
    switch(funzione_lettera){
	    case 'LETTERA_STANDARD' 		: 
	    case 'LETTERA_DIMISSIONI_DH' 	: 
	    case 'LETTERA_PROSECUZIONE' 	: where_secondo_funzione = "and (IDEN_RICOVERO<>"+vDati.iden_ricovero+" or accesso=1)";break;
	    default: where_secondo_funzione = "and IDEN_VISITA<>"+vDati.iden_visita;
	}        
    var url = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_LETTERE_PRECEDENTI&WHERE_WK=where IDEN_ANAG='" + vDati.iden_anag +"' "+ where_secondo_funzione+" order by DATA_FINE_RICOVERO_ORDERBY desc";
    url+="&ILLUMINA=illumina(this.sectionRowIndex);";
    
    url += "&COD_DEC="+WindowCartella.baseUser.COD_DEC;
    url += "&COD_FISC="+WindowCartella.getPaziente("COD_FISC");     

    if(WindowCartella.CartellaPaziente.checkPrivacy('LETTERE_PRECEDENTI')){
	    url += "&PREDICATE_FACTORY=" + encodeURIComponent(WindowCartella.privacy.LETTERE_PRECEDENTI.PREDICATE_FACTORY);
	    url += "&BUILDER=" + encodeURIComponent(WindowCartella.privacy.LETTERE_PRECEDENTI.BUILDER);
	    url += "&ID_REMOTO="+WindowCartella.getPaziente("ID_REMOTO");
	    url += "&QUERY=getListDocumentPatientID";
        url += "&TIPOLOGIA_ACCESSO="+WindowCartella.document.EXTERN.ModalitaAccesso.value;
        url += "&EVENTO_CORRENTE="+WindowCartella.getRicovero("NUM_NOSOLOGICO");	    
    }        
         
  //  alert(url);
    
    var wkReferti = '<IFRAME id="frameLetterePrecedenti" width="100%" src= "' +url+  '" frameBorder=0></IFRAME>';
     wkReferti += '<IFRAME id="frameLetterePrecedentiSezioni" width="100%" src= "" frameBorder=0></IFRAME>';

    document.getElementById('infos').childNodes[index].innerHTML=wkReferti;
}

function apriTerapie() {
    if (document.getElementById('divTerapie')) {
        $('#divTerapie').show();
    } else {
		
		var farmaciAlBisogno	= _ALLEGATO_DATI_LABO.SETTINGS[_ALLEGATO_DATI_LABO.SETTINGS['FUNZIONE_ATTIVA']]['farmaciAlBisogno'] ? 1 : 0;

        top.utilMostraBoxAttesa(true);
        var dati	= WindowCartella.getForm(document);
        var url		= "servletGeneric?class=cartellaclinica.lettera.pckInfo.sTerapie";
        url			+= "&idenRicovero=" + dati.iden_ricovero;
        url			+= "&idenVisita=" + dati.iden_visita;
        if (typeof (NS_LOAD_TERAPIA_DOMICILIARE.idenTerapiaDomiciliare)!='undefined' && NS_LOAD_TERAPIA_DOMICILIARE.idenTerapiaDomiciliare!=''){
            url			+= "&idenLettera=" + NS_LOAD_TERAPIA_DOMICILIARE.idenTerapiaDomiciliare;        	
        }else{
            url			+= "&idenLettera=" + document.frmLettera.idenVersione.value;        	        		
        }
        
    	if (typeof (document.frmLettera.iden_terapia_associata.value!='undefined') && document.frmLettera.iden_terapia_associata.value!=""){
            url			+= "&idenTerapiaAssociata=" + document.frmLettera.iden_terapia_associata.value;        	        		
    	}else{
            url			+= "&idenTerapiaAssociata=";        	        		
    	}
    	
        url			+= "&idenAnag=" + dati.iden_anag;
        url			+= "&reparto=" + dati.reparto;
		url			+= "&farmaciAlBisogno=" + farmaciAlBisogno;
        
		var iframe = "<IFRAME id='frameTerapie' src='" + url + "' height=100%  width=100% ></IFRAME>";

        var newmarkup = "<div id='divTerapie'>"+ iframe +'</div>';
        $('#divBody').before(newmarkup);
        $('div#divTerapie').height($('iframe#frameWork',WindowCartella.document).height());
    }
    $('#divBody').hide();
    $('#divHeader').hide();
    $('#footer').hide();
}
function apriPrimoCicloSel(idenVersione,idenTerapiaAssociata) {
    top.utilMostraBoxAttesa(true);
    var dati = WindowCartella.getForm(document);
    var url="servletGeneric?class=cartellaclinica.lettera.pckInfo.sTerapie";
    url += "&idenRicovero="+dati.iden_ricovero;
    url	+= "&idenVisita=" + dati.iden_visita;        
    url += "&idenLettera="+idenVersione;
    url += "&idenTerapiaAssociata="+idenTerapiaAssociata;
    url += "&idenAnag="+dati.iden_anag;
    url += "&reparto="+dati.reparto;
	url	+= "&farmaciAlBisogno=0";
    var iframe = "<IFRAME id='frameTerapie' src='" + url + "' height=100%  width=100% ></IFRAME>";
	if (document.getElementById('divTerapie')){
		$('div#divTerapie').html(iframe);
		$('div#divTerapie').show();
	}else{
	    var newmarkup = "<div id='divTerapie'>"+ iframe +'</div>';
	    $('#divBody').before(newmarkup);
	    $('div#divTerapie').height($('iframe#frameWork',WindowCartella.document).height());		
	}

    $('#divBody').hide();
    $('#divHeader').hide();
    $('#footer').hide();
}


function chiudiTerapie() {
	$('#divTerapie').hide();
	$('#divBody').show();
	$('#divHeader').show();
	$('#footer').show();
}

function caricaSezAccertamenti() {
	$tab = $('#idRichieste tbody');

	if($tab.length == 0){
		return;
	}

	//var tab = document.getElementById('idRichieste').getElementsByTagName('tbody')[0];
	var tab  = $tab[0];
	var len = tab.rows.length;

	if (len<2)
		return;

	var table =document.createElement('table');
	var tBody = document.createElement('tbody');

	table.style.fontSize = '10px';
	table.border=1;

	var row;
	var cell;

	row = document.createElement('tr');
	for(var j=0;j<4;j++){
		if (j==1)
			j++;
		cell = document.createElement('th');
		cell.innerText = tab.rows[0].cells[j].innerText;
		row.appendChild(cell);
	}

	tBody.appendChild(row);

	row = document.createElement('tr');

	var tipologia = "";

	for(var i=1;i<len;i++){

		if (tab.rows[i].cells[4].innerText != tipologia) {
			tipologia = tab.rows[i].cells[4].innerText;
			row = document.createElement('tr');
			cell = document.createElement('th');
			cell.colSpan='4';
			cell.innerText=tipologia;
			row.appendChild(cell);
			tab.insertBefore(row ,tab.rows[i]);
			row = document.createElement('tr');
			cell = document.createElement('th');
			cell.colSpan='3';
			cell.innerText=tipologia;
			row.appendChild(cell);

			tBody.appendChild(row);
			i++;
			len++;
		}

		row = document.createElement('tr');
		for(var j=0;j<4;j++){
			if (j==1)
				j++;
			cell = document.createElement('td');
			cell.innerText = tab.rows[i].cells[j].innerText;
			row.appendChild(cell);
		}
	//importo nella sezione accertamenti eseguiti solamente le richieste in stato E o R
		if(tab.rows[i].cells[1].innerText=='R' || tab.rows[i].cells[1].innerText=='E'){;
			tBody.appendChild(row);
		}
		tab.rows[i].deleteCell(4);
	}
	table.appendChild(tBody);

	tab.rows[0].deleteCell(4);
	if ($('#idAccertamentiEseguiti').val() == '') {
		$('#idAccertamentiEseguiti').val(table.outerHTML);
	}
}

function caricaClassiTextArea()
{
	if (WindowCartella.ModalitaCartella.isReadonly ( document )==true || (document.frmLettera.readonly.value=='S'))
	{
		var arIdSection = new Array();
		var lista_sezioni = document.getElementsByTagName("textarea");
		for(var i=0;i<lista_sezioni.length;i++)
		{
			if(typeof lista_sezioni[i].attiva!='undefined')
			{
				arIdSection.push(lista_sezioni[i].id);
			}
		}

		for (i=0;i<arIdSection.length;i++)
		{
			$('#'+arIdSection[i]).addClass('Readonly');
		}
	}
	else
	{
		$('#idTerapiaDomiciliare').addClass('Terapie');
		$('#idPrimoCiclo').addClass('Readonly');
	}
}


function sectionInGrassetto(id){
	try{
	var str = tinyMCE.get(id).getContent({format : 'raw'});
	str = strip_tags( str,'<b><u><i><br><em><strike><ol><li><span>');
//se non trova il tag strong lo aggiunge
	if (str.indexOf('strong')==-1){
		str = "<strong>"+str+"</strong>";
		tinyMCE.get(id).setContent(str);
	}
	}catch(e){}
}


function getData(pDate,format){
	anno = pDate.getFullYear();
	mese = '0'+(pDate.getMonth()+1);mese =  mese.substring(mese.length-2,mese.length);
	giorno = '0'+pDate.getDate();giorno =  giorno.substring(giorno.length-2,giorno.length);
	switch(format){
		case 'YYYYMMDD':	return anno+mese+giorno;
		case 'DD/MM/YYYY':	return giorno+'/'+mese+'/'+anno;
	}
}

function checkLastComma(concatenazione){
	var concatenazioneCheck = '';
	if (concatenazione.substr(concatenazione.length-1,concatenazione.length) == ','){
		concatenazioneCheck = concatenazione.substr(0,concatenazione.length-1);
	}else{
		concatenazioneCheck = concatenazione;
	}
	return concatenazioneCheck;

}

//prende parametri dal top
function  gup( name ){

	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var tmpURL = document.location.href;
	var results = regex.exec( tmpURL );

	if( results == null ){
		return "";
	}else{
		return results[1];
	}
}

function abilitaSelezione(){
	event.cancelBubble=true;
	document.body.onmouseup=function(){
		if( window.clipboardData && clipboardData.setData ){
			clipboardData.setData("Text", document.selection.createRange().text);
		}
		document.body.onmouseup=function(){};
	};
}

function strip_tags (str, allowed_tags)
{

    var key = '', allowed = false;
    var matches = [];    var allowed_array = [];
    var allowed_tag = '';
    var i = 0;
    var k = '';
    var html = '';
    var replacer = function (search, replace, str) {
        return str.split(search).join(replace);
    };
    // Build allowes tags associative array
    if (allowed_tags) {
        allowed_array = allowed_tags.match(/([a-zA-Z0-9]+)/gi);
    }
    str += '';

    // Match tags
    matches = str.match(/(<\/?[\S][^>]*>)/gi);
    // Go through all HTML tags
    for (key in matches) {
        if (isNaN(key)) {
                // IE7 Hack
            continue;
        }

        // Save HTML tag
        html = matches[key].toString();
        // Is tag not in allowed list? Remove from str!
        allowed = false;

        // Go through all allowed tags
        for (k in allowed_array) {            // Init
            allowed_tag = allowed_array[k];
            i = -1;

            if (i != 0) { i = html.toLowerCase().indexOf('<'+allowed_tag+'>');}
            if (i != 0) { i = html.toLowerCase().indexOf('<'+allowed_tag+' ');}
            if (i != 0) { i = html.toLowerCase().indexOf('</'+allowed_tag)   ;}

            // Determine
            if (i == 0) {                allowed = true;
                break;
            }
        }
        if (!allowed) {
            str = replacer(html, "", str); // Custom replace. No regexing
        }
    }
    return str;
}


function eventChangeTiny(){
	$('TEXTAREA').each(function(){
		$(this).attr('id')+'\n\n\n'+$('#'+$(this).attr('id')+'_ifr').contents().find('HTML').find('BODY').bind("keyup input paste mouseup",function(){
				WindowCartella.DatiNonRegistrati.set(true);							
			});
		});
}

function returnModalitaStampa(){
	switch (WindowCartella.FiltroCartella.getLivelloValue())
	{
		case 'ANAG_REPARTO': 	
			return 'PAZIENTE_REPARTO';
			break;
		
		case 'IDEN_VISITA':			
		case 'NUM_NOSOLOGICO':
			
			return 'RICOVERO';
			
			break;
	}
}
/*
function registraConsensoDocumento(chiamata){
    var urlParameters   =  'tabella=RADSQL.NOSOLOGICI_PAZIENTE';
    urlParameters       += '&statement_to_load=loadConsensoEspressoDocumento'; 
    urlParameters       += '&iden='+checkIdenRiferimento();
    urlParameters       += '&tipologia_documento='+document.frmLettera.funzione.value;
    
    WindowCartella.$.fancybox({
        'padding'	: 3,
        'width'		: 570,
        'height'	: 150,
        'href'		: 'consenso.html?'+urlParameters,
        'type'		: 'iframe',
        'showCloseButton'	: false
    });
}

function checkConsensoDocumento(iden,funzione){
   var pStatementFile = 'consensi.xml';
    var pStatementStatement = 'loadConsensoEspressoDocumento';
    var pBinds = new Array();
    pBinds.push(iden);
    pBinds.push(funzione);
    var vResp = WindowCartella.executeStatement(pStatementFile,pStatementStatement,pBinds,3);
    if (vResp[0]=='OK'){
        if (vResp[2]==null)
            return false;
        else
            return true;
    }else{
        return false;
    }
}

function checkIdenRiferimento(){
     var iden='';
     switch(document.frmLettera.funzione.value){
        case 'LETTERA_STANDARD'         : 
	    case 'LETTERA_DIMISSIONI_DH'    : 
	    case 'LETTERA_PROSECUZIONE'     : 
            iden       = WindowCartella.getForm().iden_ricovero;
            break;
	    default:    
            iden       = WindowCartella.getForm().iden_visita;
            break;
    }
    return iden;
}*/

var NS_LETTERA_CONSENSO = {
		windowConsenso:'',
		consensoAttivo:true,
		init:function(){
			this.consensoAttivo=WindowCartella.CartellaPaziente.checkPrivacy(document.frmLettera.funzione.value);
			if(!this.consensoAttivo)
				{
				$('iframe#idFrameConsenso').parent().hide();
				return;
				}
			var wnd = $('iframe#idFrameConsenso')[0];
			wnd = wnd.contentWindow || wnd.contentDocument;
			this.windowConsenso = wnd	
		},
		
		checkConsenso:function(){
			var msg='';
				//Se � scelta una voce tra oscurato e oscuramento dell'oscuramento,   la scelta di almeno uno dei due checkbox � obbligatoria ai fini del salvataggio
				if((this.windowConsenso.$('input:radio[@name="rdOscuramento"]:checked').val()=='V'||this.windowConsenso.$('input:radio[@name="rdOscuramento"]:checked').val()=='R') && !this.windowConsenso.$('#idVolereCittadino').is(':checked') && !this.windowConsenso.$('#idPerLegge').is(':checked')){
					msg='Prego selezionare almeno una voce tra "Volont� del cittadino" e "per Legge"'; 
				 }
				 else{
					 //Per effettuare il salvataggio o la firma, se l'utente spunta il check 'per legge', la scelta di una voce della combo deve essere obbligatoria
					 if(this.windowConsenso.$('#idPerLegge').is(':checked') && this.windowConsenso.$('#cmbOscuramentoPerLegge').val()==''){
						msg='Prego inserire una motivazione relativa all\'oscuramento "per Legge" '; 
					 }
				 }
			return msg;
		},
		
		saveConsenso:function(){
			return this.windowConsenso.NS_GESTIONE_CONSENSO.save();
		}
		
}


/**
 * Funzioni di stampa specifiche per il reparto NIDO_SV
 * 
 * @author  gianlucab
 * @version 1.0
 * @since   2014-09-08
 */
var NEONATOLOGIA = {};
(function() {
	/* Metodi e attributi pubblici */
	this.strError = null;
	
	this.init = function() {
		var cdc = $('form[name=frmLettera] input[name=reparto]').val()
		if (WindowCartella.baseReparti.getValue(cdc,'letteraDimissioniControllo') != 'S') return;
		eventChangeTiny();
    	appendFunctionToButton(true);
    	WindowCartella.utilMostraBoxAttesa(false);	
		var check = {
			'ACCERTAMENTO_INFERMIERISTICO': 'Accertamento infermieristico',
			'ANAMNESI':'Anamnesi familiare',
			//'SETTIMANA36':'Anamnesi ostetrica', /* readonly */
			'PARTOGRAMMA_PARTO':'Parto',
			'ESAME_OBIETTIVO':'Esame obiettivo all\'ingresso',
			'ESAME_OBIETTIVO_USCITA':'Esame obiettivo all\'uscita'
		};
		var rs = WindowCartella.executeQuery("nido.xml","controllaFunzioniSalvate",[top.getRicovero("IDEN")]);
		while(rs.next()){
			if (rs.getString('iden_riferimento') == '') {
				this.strError = 'Impossibile reperire le informazioni relative al ricovero della madre.';
				return;
			}
			
			if (typeof check[rs.getString('funzione')] === 'string') {			
				delete check[rs.getString('funzione')];
			}
		}
		
		var message = '';
		var i=0;
		for (var k in check) {
			if (i++ > 0) message += '\n\t- ';
			message += check[k];
		}
		
		if (message != '') {
			this.strError = "Attenzione! Le seguenti schede non risultano essere salvate:\n\t- "+message;
		}
	};
	
	this.stampaLetteraDimissioniBozza = function() {
		strip_span("idIndicazioniAlimentari", "evidenziato");
		stampaLetteraDimissioniBozza();
	};
	
	this.registraConsensoDocumento = function(chiamata) {
		strip_span("idIndicazioniAlimentari", "evidenziato");
		registraConsensoDocumento(chiamata);
	};
	
	this.registra = function(firma) {
		strip_span("idIndicazioniAlimentari", "evidenziato");
		registra(firma);
	};
	
	/* Metodi e attributi privati */
	
	function strip_span(id, className) {
		var text = getContent(id);	

		var span = text.match(/(<span[^>]*>)[^<\/]+(<\/span>)/ig);
		if (!span) return;
		for (var i=0; i<span.length; i++) {
			var element = $(span[i]);
			var innerText = element.text();
			switch (element.attr('class')) {
			case className:
				if (innerText == '...') innerText = '';
				text = text.replace(span[i], innerText);
				break;
			case undefined:
			default:
			}
		}
		
		setContent(id, text);
	}
	
	function getContent(id) {
		return tinyMCE.get(id).getContent({format : 'html'});
	}
	
	function setContent(id, text) {
		tinyMCE.get(id).setContent(text);
	}
}).apply(NEONATOLOGIA);

function appendFunctionToButton(param)
{
	if (baseUser.TIPO=='I')
	{
		$('#idStampa').click(function() {
			if (typeof (param)!= 'undefined' && param){
				NEONATOLOGIA.stampaLetteraDimissioniBozza()
			}else{
				stampaLetteraDimissioniBozza()
			}
		});
	}
	else
	{
		if (document.frmLettera.stato.value=='F')
		{
			$('#idRegistra').hide();
		}
		else
		{
			$('#idRegistra').click(function() {
				if (typeof (param)!= 'undefined' && param){
					NEONATOLOGIA.registra("N");
				}else{
					registra("N");
				}
			});
		}
		$('#idFirma').click(function() {
			if (typeof (param)!= 'undefined' && param){
				NEONATOLOGIA.registra("S");
			}else{
				registra("S");
			}
		});
               
		$('#idStampa').click(function() {
			if (typeof (param)!= 'undefined' && param){
				NEONATOLOGIA.stampaLetteraDimissioniBozza()
			}else{
				stampaLetteraDimissioniBozza()
			}
		});
	}
}