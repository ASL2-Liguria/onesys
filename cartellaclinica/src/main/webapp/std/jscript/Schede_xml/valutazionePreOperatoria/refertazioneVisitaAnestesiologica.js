/**
 * User: linob
 * Date: 26/05/14un
 */

/*2 array contenenti i caratteri da sostituire prima del salvataggio per evitare che oracle interpreti &<qualcosa> come parametro e non come valore*/
var arRE2replace = new Array(/&nbsp;/g, /&ugrave;/g, /&eacute;/g, /&egrave;/g, /&igrave;/g, /&agrave;/g, /&ograve;/);
var arChar4replace = new Array(' ', 'ù', 'é', 'è', 'ì', 'à', 'ò');
var txtAreaOriginali = new Array();
var strutturaDaIncollare = null;
var arrayRadio = new Array();
var arrayInput = new Array();

var _V_DATI = {
    iden_anag: '',
    ricovero: '',
    prericovero: '',
    reparto: '',
    id_remoto: ''
};
var _BUTTON = $("span#btnAllegaDatiLabo");
var _ALLEGATO_DATI_LABO = {
    'allegato': '',
    'elencoTestate': '',
    'elencoEsami': '',
    'elencoEsamiCodici': '',
    'parametroStampa': '',
    SETTINGS: {
        'VISITA_ANESTESIOLOGICA': {'allegato': false, 'farmaciAlBisogno': false},
        'FUNZIONE_ATTIVA': ''
    }
};



jQuery(document).ready(function() {

    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    try {
        _V_DATI = WindowCartella.getForm();
    } catch (e)
    {
        window.WindowCartella = parent.opener.top.window;
    }

    _ALLEGATO_DATI_LABO.SETTINGS['FUNZIONE_ATTIVA'] = 'VISITA_ANESTESIOLOGICA';

    try {
        jQuery("[name=idTxtStd]").each(function() {
            var target = jQuery(this).attr('idSezione');
            jQuery(this).addClass("classDivTestiStd").click(function() {
                apriTestiStandard(target);
            });
        });
    } catch (e) {

    }

});

function  apriTestiStandard(targetOut) {

    var reparto = $('#repartoDest').val();

    var url = 'servletGenerator?KEY_LEGAME=SCHEDA_TESTI_STD&TARGET=' + targetOut + "&PROV=CONSULENZA&FUNZIONE=CONSULENZA_STD&REPARTO=" + reparto;

    $.fancybox({
        'padding': 3,
        'width': 1024,
        'height': 580,
        'href': url,
        'type': 'iframe'
    });
}

/* load del body: esegue i vari controlli sulla data e ora, crea gli oggetti per la sezioni e i dati globali(baseuser, baseglobal) */
function initGlobalObject() {
    try
    {
        WindowCartella.utilMostraBoxAttesa(false);
        setVeloNero('footer');
        if ($('#infos').html() == '') {
            /* Se il div delle info è vuoto, allora lo nascondo e il div delle sezioni lo allargo al 100%*/
            $('#infos').css('display', 'none');
            $('#sections').css('width', '100%');
        }
        if (document.EXTERN.idenReferto.value=='' ||document.EXTERN.idenReferto.value=='-1'){
            $('TEXTAREA#idTerapiaDomiciliare').text('');
            $('TEXTAREA#idPrimoCiclo').text('');            
        }
        NS_CONSULENZA_CONSENSO.init();         
        caricaClassiTextArea();
        setHeight();
        initTinyMCE();
        //initbaseUser();		

        showSection(0);
        //addCaledar($('#txtDataOperabile'));	
        storeTextArea();
        try {
            ricerca();
        } catch (e) {
        } //lancio l'eventuale ricerca dei testi std se abilitati nella pagina

        NS_REFERTAZIONE_ANESTESIOLOGICA.init();
        NS_REFERTAZIONE_ANESTESIOLOGICA.setEvents();
        


        loadInput();
        loadChecked();

//        eventChangeTiny();
//        removeVeloNero('footer');
    }
    catch (e)
    {
        alert("Refertazione Consulenze initGlobalObject - Error: " + e.description);
    }
}

function initTinyMCE() {
    try {
        tinyMCE.init({
            mode: "textareas",
            theme: "advanced",
            theme_advanced_buttons1: "copy,paste,|,bold,italic,underline,strikethrough,|,fontselect,fontsizeselect,|,forecolor,|,backcolor,|,bullist,numlist,|,removeformat,undo,redo,|,pasteStrutcture",
            theme_advanced_buttons2: "",
            theme_advanced_buttons3: "",
            theme_advanced_buttons4: "",
            skin: "o2k7",
            skin_variant: "silver",
            editor_deselector: /(Terapie|Readonly)/,
            force_br_newlines: true,
            force_p_newlines: false,
            setup: function(ed) {

                ed.addButton('pasteStrutcture', {
                    title: 'Incolla struttura generata',
                    image: '../jscripts/tiny_mce/plugins/example/img/example.gif',
                    onclick: function() {
                        if (strutturaDaIncollare == null) {
                            alert('Nessuna struttura generata');
                            return;
                        }
                        ed.setContent(ed.getContent() + strutturaDaIncollare);
                    }
                });
            }
        });

        tinyMCE.init({
            mode: "textareas",
            editor_selector: "Readonly",
            theme: "advanced",
            readonly: 1,
            force_br_newlines: true,
            force_p_newlines: false,
            setup: function(ed) {
            }
        });
        tinyMCE.init({
            mode: "textareas",
            editor_selector: "Terapie",
            theme: "advanced",
            language: "it",
            theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
            theme_advanced_buttons1: "apriTerapie,|,copy,paste,|,bold,italic,underline,strikethrough,|,fontselect,fontsizeselect,|,forecolor,|,backcolor,|,bullist,numlist,|,removeformat,undo,redo",
            theme_advanced_buttons2: "",
            theme_advanced_buttons3: "",
            theme_advanced_buttons4: "",
            force_br_newlines: true,
            force_p_newlines: false,
			init_instance_callback : function(editor) {
				appendFunctionToButton();
				eventChangeTiny();
	        	removeVeloNero('footer');	        
		    },
            setup: function(ed) {
                ed.addButton('apriTerapie', {
                    title: 'Apri Terapie',
                    image: 'imagexPix/button/farma_btn.png',
                    onclick: function() {
                        apriTerapie();
                    }
                });
            }
        });
    
    
    }
    catch (e) {
        alert("initTinyMCE - Error: " + e.description);
    }
}

function registra(firma) {
    var argsVariable;
    if (document.frmGestionePagina.readonly.value == 'S')
    {
        alert('Consulenza in sola lettura: impossibile registrare e/o salvare nuova versione!')
        return;
    }

    if (firma == 'L')
    {
        var answer = window.showModalDialog("bolwincheckuser", argsVariable, "dialogWidth:380px; dialogHeight:200px; center:yes");
        if (answer == true)
        {
            //setVeloNero('footer');
        }
        else
        {
            // chiudo tutto
            return;
        }

	}else{
		if (NS_CONSULENZA_CONSENSO.consensoAttivo){
			 var respCheck=NS_CONSULENZA_CONSENSO.checkConsenso();
				if (respCheck!=''){
					return alert(respCheck);
				}else{	
				var retFromSave = NS_CONSULENZA_CONSENSO.saveConsenso();
				if (!retFromSave.esito){
					return alert(retFromSave.motivo)
				}
			}
		}
    }

    var iden_visita = $('#idenVisita').val();
    var iden_testata = $('#idenTes').val();

//    	Salvataggio Sezioni:
//     db: select * from IMAGOWEB.config_menu_reparto where procedura = 'refertaConsulenzeSezione';
//     -id: idConsulenzaRef 
//     -id: idConsulenzaTer
//     -id: idConsulenzaAcc
	$( "#idRegistra").unbind( "click" );
	$( "#idFirma").unbind( "click" );
	$( "#idStampa").unbind( "click" );	    
    var arIdSection = new Array();
    var arLblArea = new Array();
    var arRowsArea = new Array();
    var arLblSection = new Array();
    var arContent2convert = new Array();
    var arContentConverted = new Array();
    var arOrdinamento = new Array();
    var arPrimoCiclo = new Array();
    var arIdenFar = new Array();
    var arStatoTerapia = new Array();
    var arTipoTerapia = new Array();
    var arDose = new Array();
    var arDurata = new Array();
    var arScatole = new Array();
    var arCategoria = new Array();
    try
    {
        dwr.engine.setAsync(false);

        if (window.frames['frameTerapie'] && window.frames['frameTerapie'].arTerapie) {
            var arTerapie = window.frames['frameTerapie'].arTerapie;
//            for (var idx = 0; idx < arTerapie.length; idx++)
//            {
//                arPrimoCiclo.push(arTerapie[idx][0]);
//                arIdenFar.push(arTerapie[idx][1]);
//                arStatoTerapia.push(arTerapie[idx][2]);
//                arTipoTerapia.push(arTerapie[idx][3]);
//                arDose.push(arTerapie[idx][4]);
//                arDurata.push(arTerapie[idx][5]);
//                arScatole.push(arTerapie[idx][6]);
//                arCategoria.push(arTerapie[idx][7]);
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
//            }
        } else
        {
            arIdenFar.push(0);
        }

//      Salvataggio Sezioni - Creazioni array di salvataggio
        var lista_sezioni = document.getElementsByTagName("textarea");
        for (var i = 0; i < lista_sezioni.length; i++) {
            if (typeof lista_sezioni[i].attiva != 'undefined') {
                arOrdinamento.push(lista_sezioni[i].ordinamento)
                arIdSection.push(lista_sezioni[i].id);
                arLblArea.push(lista_sezioni[i].label);
                arRowsArea.push(lista_sezioni[i].rows);
                arLblSection.push(lista_sezioni[i].sezione);
                var str = tinyMCE.get(lista_sezioni[i].id).getContent();
                arContent2convert.push(togliCaratteriSpeciali(str));
            }
        }

        /*----------Salvataggio Oggetti XML - Creazioni array di salvataggio con all'interno l'xml di creazione degli oggetti----------*/
        $('#sections').find('.divXmlObject').each(function() {
            arOrdinamento.push($(this).attr("ordinamento"))
            arIdSection.push($(this).find('div').attr("class"));

            var lbl = '';
            $(this).find("label").each(function(index) {
                if (index == 0)
                    lbl = $(this).text();
                else
                    lbl = lbl + ' e ' + $(this).text();
            });
            arLblArea.push(lbl);
            arRowsArea.push("0");
            arLblSection.push($(this).attr("sezioneLabel"));
//            alert(NS_SAVE_CONSOLLE_XML.retrieveXml(jQuery(this),jQuery(this).find('div').attr("class"),'class'));
            arContent2convert.push(NS_SAVE_CONSOLLE_XML.retrieveXml(jQuery(this), jQuery(this).find('div').attr("class"), 'class'));
        });
        dwrPreparaFirma.convertHtmlToText(arContent2convert, replyConverter);
        function replyConverter(reply)
        {
            arContentConverted = reply;
            var tipiParametri = new Array();
            var valoriParametri = new Array();

            tipiParametri.push('NUMBER');
            valoriParametri.push(iden_visita);

            tipiParametri.push('NUMBER');
            valoriParametri.push(baseUser.IDEN_PER);

            tipiParametri.push('VARCHAR');
            valoriParametri.push(firma);

            tipiParametri.push('VARCHAR');
            valoriParametri.push('VISITA_ANESTESIOLOGICA');

            tipiParametri.push('NUMBER');
            valoriParametri.push(iden_testata);
//            array di varchar -> idSezioni da salvare 
            tipiParametri.push('ARRAY_VALUE_ID_SEZIONE');
            tipiParametri.push('ARRAY_VALUE_LBL_SEZIONE');
            tipiParametri.push('ARRAY_VALUE_ARROWSAREA');
            tipiParametri.push('ARRAY_VALUE_ARROWSLBLAREA');
            tipiParametri.push('ARRAY_VALUE_ORDINAMENTO');

//             array di clob -> testo html 
            tipiParametri.push('ARRAY_CLOB_HTML');
//             array di clob -> testo piano 
            tipiParametri.push('ARRAY_CLOB_PIANO');
//             array: iden_farmaco,scatole,primo_ciclo -> testo piano 
            tipiParametri.push('ARRAY_VALUE_IDEN_FAR');
            tipiParametri.push('ARRAY_VALUE_SCATOLE');
            tipiParametri.push('ARRAY_VALUE_PRIMO_CICLO');
            tipiParametri.push('ARRAY_VALUE_DOSE');
            tipiParametri.push('ARRAY_VALUE_DURATA');
            tipiParametri.push('ARRAY_VALUE_TIPO_TER');
            tipiParametri.push('ARRAY_VALUE_STATO_TER');
            tipiParametri.push('ARRAY_VALUE_CATEGORIA');
//            			alert(tipiParametri);
//             alert(valoriParametri);
//             alert(arIdSection+' - '+arLblSection+' - '+arRowsArea+' - '+arLblArea);
//             alert(arContent2convert+' - '+arContentConverted);
//             
//             alert(arIdSection.length+' - '+arLblSection.length+' - '+arRowsArea.length+' - '+arLblArea.length);
//             alert(arContent2convert.length+' - '+arContentConverted.length);

            dwrPreparaFirma.preparaRefertazioneAnestesiologica('{call radsql.oe_refertazione.saveRefertazione(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}', tipiParametri, valoriParametri, arIdSection, arLblSection, arRowsArea, arLblArea, arOrdinamento, arContent2convert, arContentConverted, arIdenFar, arScatole, arPrimoCiclo, arDose, arDurata, arTipoTerapia, arStatoTerapia, arCategoria, replyRegistra);
        }

        function replyRegistra(returnValue)
        {
            WindowCartella.DatiNonRegistrati.set(false);
            var idenRef;
            var idenRefOld;
            try {
                if (returnValue.split("*")[0] == "KO") {
                    alert("Errore: " + returnValue.split("*")[1]);
                    return;
                }
                else
                {
                    idenRef = returnValue.split("*")[1].split("-")[0];
                    idenRefOld = returnValue.split("*")[1].split("-")[1];
                    primociclo = returnValue.split("*")[1].split("-")[2];
//                    alert(returnValue)
                    $('[name="frmImpostazioniFirma"]').append('<input type="hidden" name="repartoDestinatario" value="'+document.EXTERN.repartoDest.value+'"></input>');
                    $('[name="frmImpostazioniFirma"]').append('<input type="hidden" name="checkPrimoCiclo" value="'+primociclo+'"></input>');
                    $('[name="frmImpostazioniFirma"]').append('<input type="hidden" name="idenTerapiaDomiciliare" value="0"></input>');
                    if (idenRefOld == '')
                        idenRefOld = 0;
                    if (firma == 'N')
                    {
                        alert('Il referto registrato non verrà inviato al reparto.\n Per inviare procedere con validazione e/o firma digitale.')
                    }
                }
                if (firma == 'S')
                {
                    if (document.frmGestionePagina.stato.value == 'L')
                    {
                        document.frmImpostazioniFirma.idenReferto.value = idenRef;
                        $('[name="frmImpostazioniFirma"]').append('<input type="hidden" name="idenRefOld" value="' + idenRefOld + '" ></input>');
                        firma_lettera();
                    }
                    else
                    {
                        document.frmImpostazioniFirma.idenReferto.value = idenRef;
                        $('[name="frmImpostazioniFirma"]').append('<input type="hidden" name="idenRefOld" value="' + idenRefOld + '" ></input>');
                        firma_lettera();
                    }
                }
                else
                {
                    refreshReferto(idenRef);
                }
            }
            catch (e) {
                alert("replyRegistra - Error: " + e.description);
            }

        }
        dwr.engine.setAsync(true);
    }
    catch (e) {
        alert("registra - Error: " + e.description)
    }


}

function firma_lettera() {   
    var myForm = document.frmImpostazioniFirma;
    var classFirma = 'firma.SrvFirmaPdf';
    if (WindowCartella.basePC.ABILITA_FIRMA_DIGITALE=='S'){
    	classFirma = 'firma.SrvFirmaPdfMultipla';
    }
    finestra = window.open("", "finestra", "fullscreen=yes scrollbars=no");
    myForm.target = 'finestra';
    myForm.action = 'servletGeneric?class='+classFirma;
    myForm.submit();
    try {
        opener.top.closeWhale.pushFinestraInArray(finestra);
    } catch (e) {
    }
}


function refreshReferto(idenRef)
{
    WindowCartella.apriRefertoVisitaAnestesiologica($('#idenTes').val(), idenRef);
    try {
        WindowCartella.opener.document.getElementById("iframe_main").contentWindow.NS_VPO.applica_filtro_vpo();
    } catch (e) {
    }
}


/* Funzione che mostra le sezioni da caricate */
function showSection(index) {
    try {
        arSection = document.all['sections'].childNodes;
        arTabSections = document.all['tabSections'].childNodes;
        for (var i = 0; i < arSection.length; i++) {
            arSection[i].className = 'tabHide';
            arTabSections[i].className = '';
        }
        arSection[index].className = 'tabShow';
        arTabSections[index].className = 'active';
    } catch (e) {
    }
}
/* Funzione che mostra le info da caricate */
function showInfo(index) {
    try {
        arInfo = document.all['infos'].childNodes;
        arTabInfo = document.all['tabInfos'].childNodes;
        for (var i = 0; i < arInfo.length; i++) {
            arInfo[i].className = 'tabHide';
            arTabInfo[i].className = '';
        }
        arInfo[index].className = 'tabShow';
        arTabInfo[index].className = 'active';
        if (arInfo[index].id == 'idReferti' && arInfo[index].innerHTML == '') {
            info.caricaWkReferti(index);
        } else if (arInfo[index].id == 'idDatiLabo' && document.all.divTabLaboratorio.innerHTML == '') {
            caricaDati();
        } else if (arInfo[index].id == 'idRepository') {
            info.apriRepository();
        } else if (arInfo[index].id == 'idReferti_Precedenti') {
            NS_REFERTAZIONE_ANESTESIOLOGICA.caricaWkRefertiPrecedentiRicovero(index);
        } else if (arInfo[index].id == 'idStorico_Paziente') {
            NS_REFERTAZIONE_ANESTESIOLOGICA.caricaWkRefertiPrecedenti(index);
        } 
//        else if (arInfo[index].id == 'idElenco_Referti') {         
//            function getUrl() {
//                alert(document.EXTERN.reparto.value)
//                var url = "servletGenerator?KEY_LEGAME=VISDOC";
//                url += "&idPatient=" + document.EXTERN.idRemoto.value;
//                alert(1)
//                if (document.EXTERN.reparto.value != '') {
//                    url += "&reparto=" + document.EXTERN.reparto.value;
//                } else {
//                    url += "&reparto=" + baseUser.LISTAREPARTIUTENTECODDEC[0];
//                }
//
////                if (pParametri != undefined) {
////                    if (pParametri.identificativoEsterno != undefined)
////                        url += "&identificativoEsterno=" + pParametri.identificativoEsterno;
////                    if (pParametri.reparto != undefined)
////                        url += "&reparto=" + pParametri.reparto;
////                    if (pParametri.LETTERE != undefined)
////                        url += "&LETTERE=" + pParametri.LETTERE;
////                }
//                alert(3)
//                
//                return url;
//            } 
//            
//            try {            
//                alert(getUrl());
//                var url = getUrl();
//                var width = document.body.offsetWidth / 10 * 9;
//                var height = document.body.offsetHeight / 10 * 8;
//                $.fancybox({
//                    'padding': 3,
//                    'width': width,
//                    'height': height,
//                    'href': url,
//                    'type': 'iframe',
//                    'hideOnOverlayClick': false,
//                    'hideOnContentClick': false
//                });                
//            } catch (e) {
//                alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
//            }
//        }
    } catch (e) {
    }
}

/* Funziione che richiama il dwr che sblocca il record sulla tabella ROWS_LOCK
 function unLock(){}
 */
function unLock()
{	/*
 * DA IMPLEMENTARE
 * 
 */
    dwr.engine.setAsync(false);
    dwrPreparaFirma.unLockFunzione('CC_LETTERA_VERSIONI', $('#funzione').val(), $('#idenTes').val(), callBack);
    dwr.engine.setAsync(true);
    function callBack(reply)
    {
        if (reply != 'OK')
        {
            alert("reply:" + reply);
        }
    }

    try {
        WindowCartella.opener.document.getElementById("iframe_main").contentWindow.NS_VPO.applica_filtro_vpo();
    } catch (e) {
    }    
        
    
}


/* Se un valore è nullo ritorna true*/
function isNull(valore)
{
    if (valore == null || valore == '')
    {
        return true;
    }
    else
    {
        return false;
    }
}

/* Aggiunge il calendarietto*/
function addCaledar(obj)
{
    try
    {
        jQuery(obj).datepick({onClose: function() {
                jQuery(this).focus();
            }, showOnFocus: false, showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});
    }
    catch (e)
    {
        alert('Message Error: ' + e.message);
    }
}
/*Funzione abilitata all'interno del pulsante chiudi*/
function chiudi()
{
    self.close();
}
/*Setta l'altezza della consolle di referatazione*/
function setHeight()
{
    h = screen.height - parent.$('div.header').height() - parent.$('div#AlberoConsultazione').height() - document.all.footer.scrollHeight-document.all.divFrame.offsetHeight - 90;
    document.all.sections.style.height = h + 'px';
    document.all.infos.style.height = h + 'px';
 //   document.all.sections.style.height = '250px';
 //   document.all.infos.style.height = '250px';

}
/*Carica la classe della textarea: se è in modalità readonly allora carica la pagina in modalità readonly*/
function caricaClassiTextArea()
{
    if ((document.frmGestionePagina.readonly.value == 'S'))
    {
        var arIdSection = new Array();
        var lista_sezioni = document.getElementsByTagName("textarea");
        for (var i = 0; i < lista_sezioni.length; i++)
        {
            if (typeof lista_sezioni[i].attiva != 'undefined')
            {
                arIdSection.push(lista_sezioni[i].id);
            }
        }

        for (i = 0; i < arIdSection.length; i++)
        {
            $('#' + arIdSection[i]).addClass('Readonly');
        }
    } else {
        $('#idTerapiaDomiciliare').addClass('Terapie');
        $('#idPrimoCiclo').addClass('Readonly');
    }

}
/* Mette in un array le sezioni di testo caricate all'apertura della consolle di refertazione*/
function storeTextArea()
{

    var txtAreaOriginaliHTML = new Array();
    if (document.getElementById("idConsulenzaRef")) {
        var consuleRef = document.getElementById("idConsulenzaRef").value;
        txtAreaOriginaliHTML.push(togliCaratteriSpeciali(consuleRef));
    }
    if (document.getElementById("idConsulenzaTer")) {
        var terapiaRef = document.getElementById("idConsulenzaTer").value;
        txtAreaOriginaliHTML.push(togliCaratteriSpeciali(terapiaRef));
    }
    if (document.getElementById("idConsulenzaAcc")) {
        var ulterioAcc = document.getElementById("idConsulenzaAcc").value;
        txtAreaOriginaliHTML.push(togliCaratteriSpeciali(ulterioAcc));
    }

    /* Da testo html a testo piano*/
    dwr.engine.setAsync(false);
    dwrPreparaFirma.convertHtmlToText(txtAreaOriginaliHTML, replyConverter);
    dwr.engine.setAsync(true);

    function replyConverter(reply)
    {
        txtAreaOriginali = reply;
    }
}
/* Funzione che toglie i caratteri definiti ad inizio del javascript*/
function togliCaratteriSpeciali(stringa)
{
    for (var j = 0; j < arRE2replace.length; j++)
    {
        stringa = stringa.replace(arRE2replace[j], arChar4replace[j]);
    }
    return stringa;
}

/* Confronta l'array delle sezioni prima della firma solo nel caso in cui sia stata eseguita prima una validazione e poi una firma
 function confrontaPrimaDellaFirma(arrayConvertito)
 {
 for (i=0;i<arrayConvertito.length;i++)
 {
 if (txtAreaOriginali[i]!=arrayConvertito[i])
 {
 document.frmImpostazioniFirma.validaFirma.value='S';
 break;	
 }
 }
 }
 */
function stampaRefertoConsulenza()
{
    if (document.frmGestionePagina.stato.value == 'F')
    {
        var url = 'ApriPDFfromDB?idenVersione=' + $('#idenReferto').val() + '&idenVisita=' + $('#idenVisita').val() + '&AbsolutePath=' + WindowCartella.getAbsolutePath();
        var finestra = window.open(url, "finestra", "fullscreen=yes scrollbars=no");
        try {
            WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
        } catch (e) {
        }
    }
    else
    {
        var reparto = $('#repartoDest').val();
        var funzione = $('#funzione').val();
        var anteprima = 'S';
        var sf = "&prompt<pIdenTestata>=" + $('#idenTes').val();

        WindowCartella.confStampaReparto(funzione, sf, anteprima, reparto, null);
    }
}

/* Prima della chiusuara o dell'aggiornamento della pagina viene sbloccato l'utente su rows_lock e viene aggiornata la pagina precedente 
 $(window).bind('beforeunload', function()
 {	
 opener.parent.applica_filtro();	  
 });
 */

var info = {
    caricaWkReferti: function(index) {
        try {
            if ($('#lblDataInizio', top.document).length != 0) {
                var iniz_ric = $('#lblDataInizio', top.document).text();
                iniz_ric = iniz_ric.substring(6, 10) + iniz_ric.substring(3, 5) + iniz_ric.substring(0, 2);
            } else {
                var iniz_ric = '20000101';
            }

            var iden_anag_whale = $('#idenAnag').val();

            sql = "{call ? := get_iden_anag_ris(" + iden_anag_whale + ")}";
            dwr.engine.setAsync(false);
            toolKitDB.executeFunctionData(sql, call_back);
            dwr.engine.setAsync(true);

            function call_back(resp) {
                var wkReferti = "<IFRAME id='frameReferti' height=98%  width=100% src=\"servletGenerator?KEY_LEGAME=WK_REFERTI_LETTERA" +
                        "&WHERE_WK=where IDEN_ANAG='" + resp + "' and DAT_ESA_ORDINAMENTO>='" + iniz_ric
                        + "' and FIRMATO = 'S' order by DAT_ESA_ORDINAMENTO desc\" frameBorder=0></IFRAME>";
                document.getElementById('infos').childNodes[index].innerHTML = wkReferti;
            }
        } catch (e) {
            alert(e.message);
        }
    },
    apriRepository: function() {
        try {
            var idRemoto = $('#idRemoto').val();
            var repDest = $('#repartoDest').val();
            var nosolog = $('#ricovero').val();
            window.open("header?idPatient=" + idRemoto + "&reparto=" + repDest + '&nosologico=' + nosolog, '', 'fullscreen=yes');
        } catch (e) {
            alert(e.message);
        }
    }
}



var NS_REFERTAZIONE_ANESTESIOLOGICA = {
    init: function() {
    //  NS_REFERTAZIONE_ANESTESIOLOGICA.caricaInputFromDb('txtInterventoEsame', 'OE_Refertazione_Visita_Anestesiologica.xml', 'caricaNoteIntervento', [$('#idenVisita').val()]);
        NS_REFERTAZIONE_ANESTESIOLOGICA.isEmptyField('txtPeso') && NS_REFERTAZIONE_ANESTESIOLOGICA.isEmptyField('txtAltezza') ? NS_REFERTAZIONE_ANESTESIOLOGICA.calculateBMI('txtPeso', 'txtAltezza') : null;
    },
    setEvents: function() {
        /*Rimuovi i titoli dei tinymce che si comporteranno da campi note*/
        $('span#spanidAnestesiaProposta').hide();
        $('span#spanidAnestesiaProposta').next().hide();
        $('span#spananestesiologicoIOTtxt').hide();
        $('span#spananestesiologicoIOTtxt').next().hide();
        $('span#spananestesiologicoOperabileTxt').hide();
        $('span#spananestesiologicoOperabileTxt').next().hide();

        try {
            NS_REFERTAZIONE_ANESTESIOLOGICA.setupDivXmlObject();
        } catch (e) {
            alert("initDatiPaziente:\n" + e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description);
        }
        NS_REFERTAZIONE_ANESTESIOLOGICA.aggiungiScanDb('lblInterventoEsame', 'TAB_ICD_DESCR_VIS_ANES');

        //NS_REFERTAZIONE_ANESTESIOLOGICA.aggiungiScanDb('lblEsameDiagnostico','TAB_ICD_DESCR_VIS_ANES_ESAME');
        //NS_REFERTAZIONE_ANESTESIOLOGICA.aggiungiScanDb('lblInterventoChirurgico','TAB_ICD_DESCR_VIS_ANES_INTER');

        $('#txtPeso').change(function() {
            NS_REFERTAZIONE_ANESTESIOLOGICA.isEmptyField('txtPeso') && NS_REFERTAZIONE_ANESTESIOLOGICA.isEmptyField('txtAltezza') ? NS_REFERTAZIONE_ANESTESIOLOGICA.calculateBMI('txtPeso', 'txtAltezza') : null;
        });

        $('#txtAltezza').change(function() {
            NS_REFERTAZIONE_ANESTESIOLOGICA.isEmptyField('txtPeso') && NS_REFERTAZIONE_ANESTESIOLOGICA.isEmptyField('txtAltezza') ? NS_REFERTAZIONE_ANESTESIOLOGICA.calculateBMI('txtPeso', 'txtAltezza') : null;
        });

        // nasconde il bottone chiudi
        $('div#footer span:first-child').hide();
    },
    calculateBMI: function(idPeso, idAltezza) {
        $('#txtBMI').val(+(Math.round($('#' + idPeso).val() / Math.pow($('#' + idAltezza).val() / 100, 2) + 'e+2') + 'e-2'));
    },
    isEmptyField: function(idField) {
        return $('#' + idField).val() === undefined || $('#' + idField).val() == '' ? false : true;
    },
    caricaWkRefertiPrecedentiRicovero: function(index) {
        var url = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_REFERTI_AN_PRECEDENTI&TIPO_WK_REF=PRECEDENTI&WHERE_WK=where IDEN_VISITA='" + $('#idenVisita').val();
        if ($('#idenReferto').val() != '')
            url += "' and IDEN_REFERTO_AN<>'" + $('#idenReferto').val() + "'";
        else
            url += "";
        url += "&ILLUMINA=illumina(this.sectionRowIndex);";

        var wkReferti = '<IFRAME id="frameRefertiPrecedenti" width="100%" src= "' + url + '" frameBorder=0></IFRAME>';
        wkReferti += '<IFRAME id="frameRefertiPrecedentiSezioni" width="100%" src= "" frameBorder=0></IFRAME>';
        document.getElementById('infos').childNodes[index].innerHTML = wkReferti;
    },
    caricaWkRefertiPrecedenti: function(index) {
        var url = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_REFERTI_AN_PRECEDENTI&TIPO_WK_REF=STORICO&WHERE_WK=where IDEN_ANAG='" + $('#idenAnag').val() + "' ";
        if ($('#idenReferto').val() != '')
            url += " and IDEN_REFERTO_AN<>'" + $('#idenReferto').val() + "'";
        else
            url += "";
        url += "&ILLUMINA=illumina(this.sectionRowIndex);";
        var wkReferti = '<IFRAME id="frameRefertiStoricoPrecedenti" width="100%" src= "' + url + '" frameBorder=0></IFRAME>';
        wkReferti += '<IFRAME id="frameRefertiStoricoPrecedentiSezioni" width="100%" src= "" frameBorder=0></IFRAME>';
        document.getElementById('infos').childNodes[index].innerHTML = wkReferti;
    },
    caricaInputFromDb: function(input, statementFile, statementQuery, pBinds) {
        var vRs = WindowCartella.executeQuery(statementFile, statementQuery, pBinds);
        while (vRs.next()) {
            $('#' + input).val(vRs.getString('descrizione_intervento'));
        }
    },
    setupDivXmlObject: function() {
        $('DIV.divXmlObject').each(function(i) {
            // Su una riga solo
            $(this).children('DIV.anestesiologicoLateralita').length > 0 ? NS_REFERTAZIONE_ANESTESIOLOGICA.anestesiologicoSingleLine($(this), "anestesiologicoLateralita") : null;
            $(this).children('DIV.anestesiologicoLivelloUrgenza').length > 0 ? NS_REFERTAZIONE_ANESTESIOLOGICA.anestesiologicoSingleLine($(this), "anestesiologicoLivelloUrgenza") : null;
            $(this).children('DIV.anestesiologicoNYHA').length > 0 ? NS_REFERTAZIONE_ANESTESIOLOGICA.anestesiologicoSingleLine($(this), "anestesiologicoNYHA") : null;
            $(this).children('DIV.anestesiologicoRischioOperatorio').length > 0 ? NS_REFERTAZIONE_ANESTESIOLOGICA.anestesiologicoSingleLine($(this), "anestesiologicoRischioOperatorio") : null;
            $(this).children('DIV.anestesiologicoOperabile').length > 0 ? NS_REFERTAZIONE_ANESTESIOLOGICA.anestesiologicoSingleLine($(this), "anestesiologicoOperabile") : null;
            $(this).children('DIV.anestesiologicoValMallampati').length > 0 ? NS_REFERTAZIONE_ANESTESIOLOGICA.anestesiologicoSingleLine($(this), "anestesiologicoValMallampati") : null;
            $(this).children('DIV.anestesiologicoIOT').length > 0 ? NS_REFERTAZIONE_ANESTESIOLOGICA.anestesiologicoSingleLine($(this), "anestesiologicoIOT") : null;
            $(this).children('DIV.anestesiologicoAVD').length > 0 ? NS_REFERTAZIONE_ANESTESIOLOGICA.anestesiologicoSingleLine($(this), "anestesiologicoAVD") : null;
            $(this).children('DIV.anestesiologicoProtesi').length > 0 ? NS_REFERTAZIONE_ANESTESIOLOGICA.anestesiologicoSingleLine($(this), "anestesiologicoProtesi") : null;
            $(this).children('DIV.anestesiologicoDeposito').length > 0 ? NS_REFERTAZIONE_ANESTESIOLOGICA.anestesiologicoSingleLine($(this), "anestesiologicoDeposito") : null;
            $(this).children('DIV.anestesiologicoDisposizione').length > 0 ? NS_REFERTAZIONE_ANESTESIOLOGICA.anestesiologicoSingleLine($(this), "anestesiologicoDisposizione") : null;

            // "tabulazione" per anestesiologicoASA
            $(this).children('DIV.anestesiologicoASA').length > 0 ? NS_REFERTAZIONE_ANESTESIOLOGICA.anestesiologicoASA($(this)) : null;
            // "tabulazione" per anestesiologicoParametri
            $(this).children('DIV.anestesiologicoParametri').length > 0 ? NS_REFERTAZIONE_ANESTESIOLOGICA.anestesiologicoParametri($(this)) : null;
            // "tabulazione" per anestesiologicoGruppoSanguigno
            $(this).children('DIV.anestesiologicoGruppoSanguigno').length > 0 ? NS_REFERTAZIONE_ANESTESIOLOGICA.anestesiologicoGruppoSanguigno($(this)) : null;
            // "tabulazione" per anestesiologicoEmocomponenti
            $(this).children('DIV.anestesiologicoEmocomponenti').length > 0 ? NS_REFERTAZIONE_ANESTESIOLOGICA.anestesiologicoEmocomponenti($(this)) : null;
			
			$(this).children('DIV.anestesiologicoDisposizione').parent().attr('style','float:right;width:50%');
        });
    },
    anestesiologicoSingleLine: function(divXmlObject, className) {
        divXmlObject.find('.' + className).each(function(i) {
            switch (i) {
                case 0:
                    $(this).attr('style', 'float: left; width: 25%;');
                    break;
                default:
                    break;
            }
        });

        if (className == 'anestesiologicoDisposizione') {
            divXmlObject.prev().children('DIV.anestesiologicoEmocomponenti').parent().attr('style', 'width: 50%;');
        }
				
    },
    anestesiologicoASA: function(divXmlObject) {
        divXmlObject.find('.anestesiologicoASA').each(function(i) {
            switch (i) {
                case 0:
                case 1:
                    $(this).attr('style', 'float: left; width: 25%;');
                    break;
                default:
                    break;
            }
        });
    },
    anestesiologicoParametri: function(divXmlObject) {
        divXmlObject.find('.anestesiologicoParametri').each(function(i) {
            switch (i) {
                case 0:
                case 3:
                case 6:
                case 9:
                    $(this).attr('style', 'float: left; width: 33%;');
                    break;
                case 1:
                case 4:
                case 7:
                case 10:
                    $(this).attr('style', 'float: left; width: 33%;');
                    break;
                default:
                    break;
            }
        });

        NS_REFERTAZIONE_ANESTESIOLOGICA.setting('txtPeso', 'PESO');
        NS_REFERTAZIONE_ANESTESIOLOGICA.setting('txtAltezza', 'ALTEZZA');
        NS_REFERTAZIONE_ANESTESIOLOGICA.setting('txtBMI', 'BMI');
        NS_REFERTAZIONE_ANESTESIOLOGICA.setting('txtPressione', 'ARTERIOSA');
        NS_REFERTAZIONE_ANESTESIOLOGICA.setting('txtO2Sat', 'SATURAZIONE');
        NS_REFERTAZIONE_ANESTESIOLOGICA.setting('txtFrequenzaCardiaca', 'FREQUENZA');
    },
    anestesiologicoGruppoSanguigno: function(divXmlObject) {
        divXmlObject.find('.anestesiologicoGruppoSanguigno').each(function(i) {
            switch (i) {
                case 0:
                case 1:
                case 2:
                    $(this).attr('style', 'float: left; width: 25%;');
                    break;
                default:
                    break;
            }
        });
    },
    anestesiologicoEmocomponenti: function(divXmlObject) {
        divXmlObject.find('.anestesiologicoEmocomponenti').each(function(i) {
            switch (i) {
                case 1:
                case 3:
                case 5:
                    $(this).attr('style', 'float: left; width: 25%;');
                    break;
                default:
                    $(this).forceNumeric();
                    break;
            }
        });
    },
    loading: function(pBinds) {
        var rs = WindowCartella.executeQuery("OE_Refertazione_Visita_Anestesiologica.xml", "loadAnestesiologicoParametri", pBinds);
        return rs.next() ? rs.getString("VALORE_2") == null ? rs.getString("VALORE_1") : rs.getString("VALORE_1") + " " + rs.getString("VALORE_2") : null;
    },
    setting: function(id, cod_dec) {
        if ($('#' + id).val() == '') {
            pBinds = new Array();
            pBinds.push($('#idenVisita').val());
            pBinds.push(cod_dec);
            var value = NS_REFERTAZIONE_ANESTESIOLOGICA.loading(pBinds);
            value == null ? $('#' + id).val("") : $('#' + id).val(value);
        }
},
    aggiungiScanDb: function(idField, procedura) {
        $('#' + idField).click(function() {
            var obj = {
                SCANDB_PROC: procedura
            }
            launch_scandb_link(obj);
        });

        // Precompila la scanDB
        if ($('#hIdenInterventoEsame').val() == "") {
            var pBinds = new Array();
            pBinds.push($('#idenVisita').val());
            var rs = WindowCartella.executeQuery("OE_Refertazione_Visita_Anestesiologica.xml", "loadingScanDb", pBinds);
            if (rs.next()) {
                $('#hIdenInterventoEsame').val(rs.getString("IDEN"));
                $('#htxtInterventoEsame').val(rs.getString("COD_DEC"));
                $('#txtInterventoEsame').val(rs.getString("DESCRIZIONE"));
            }
        }
    }
};

function returnModalitaStampa() {
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

function apriTerapie() {
    if (document.getElementById('divTerapie')) {
        $('#divTerapie').show();
    } else {

        var farmaciAlBisogno = 1;

        top.utilMostraBoxAttesa(true);
        var dati = WindowCartella.getForm(document);
        var url = "servletGeneric?class=cartellaclinica.lettera.pckInfo.sTerapie";
        url += "&idenRicovero=" + dati.iden_ricovero;
        url += "&idenVisita=" + dati.iden_visita;
        url += "&idenLettera=" + $('#idenReferto').val();
        var idenTerapiaAssociata = '';
        if (typeof(document.EXTERN.idenTerapiaAssociata) != 'undefined'){
        	idenTerapiaAssociata = document.EXTERN.idenTerapiaAssociata.value;
        }
        	
        url += "&idenTerapiaAssociata="+idenTerapiaAssociata;
        url += "&idenAnag=" + dati.iden_anag;
        url += "&reparto=" + dati.reparto;
        url += "&farmaciAlBisogno=" + farmaciAlBisogno;

        var iframe = "<IFRAME id='frameTerapie' src='" + url + "' height=100%  width=100% ></IFRAME>";

        var newmarkup = "<div id='divTerapie'>" + iframe + '</div>';
        $('#divBody').before(newmarkup);
        $('div#divTerapie').height($('iframe#frameWork', WindowCartella.document).height());
    }
    $('#divBody').hide();
    $('#divHeader').hide();
    $('#footer').hide();
}
function apriPrimoCicloSel(idenVersione,idenTerapiaAssociata) {
    top.utilMostraBoxAttesa(true);
    var dati = WindowCartella.getForm(document);
    var url = "servletGeneric?class=cartellaclinica.lettera.pckInfo.sTerapie";
    url += "&idenRicovero=" + dati.iden_ricovero;
    url += "&idenLettera=" + idenVersione;
    url += "&idenAnag=" + dati.iden_anag;
    url += "&reparto=" + dati.reparto;
    url += "&idenTerapiaAssociata=";
    url += "&idenVisita=" + dati.iden_visita;    
    url += "&farmaciAlBisogno=0";
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

function anestesiologicoDatiPaziente(divXmlObject) {
    function floatFields(obj) {
        obj.find('.anestesiologicoParametri').each(function(i) {
            switch (i) {
                case 0:
                case 3:
                case 6:
                case 9:
                    $(this).attr('style', 'float: left; width: 33%;');
                    break;
                case 1:
                case 4:
                case 7:
                case 10:
                    $(this).attr('style', 'float: left; width: 33%;');
                    break;
                default:
                    break;
            }
        });
    }
}

function eventChangeTiny() {
    $('TEXTAREA').each(function() {
        $(this).attr('id') + '\n\n\n' + $('#' + $(this).attr('id') + '_ifr').contents().find('HTML').find('BODY').bind("keyup input paste mouseup", function() {
            WindowCartella.DatiNonRegistrati.set(true);
        });
    });

    $('#radLateralita, #radLivelloUrgenza, #radSceltaAnestesiologicoASA, #inputcheckAnestesiologicoASA, #radSceltaAnestesiologicoNYHA, #radSceltaRischioOperatorio, #radSceltaOperabile, #radSceltaValMallampati, #radSceltaIOT, #radSceltaAVD, #radProtesi, #radDeposito, #radSceltaDisposizione, #inputcheckAnestesiologicoProposta1, #inputcheckAnestesiologicoProposta2, #inputcheckAnestesiologicoProposta3, #inputcheckAnestesiologicoProposta4, #inputcheckAnestesiologicoProposta5, #inputcheckAnestesiologicoProposta6').bind('change', function() {
        if (arrayRadio[$(this).attr('id')] === undefined || arrayRadio[$(this).attr('id')] != $(this).val()) {
            WindowCartella.DatiNonRegistrati.set(true);
        }
    });

    $('#hIdenInterventoEsame, #htxtInterventoEsame, #txtInterventoEsame, #txtPressione, #txtO2Sat, #txtFrequenzaCardiaca, #txtPeso, #txtAltezza, #txtBMI, #txtGruppoSanguigno, #txtTestDiCoombs, #txtEmocomponentiPFC, #txtEmocomponentiEC, #txtEmocomponentiPLT').bind('keyup input paste mouseup', function() {
        if (arrayInput[$(this).attr('id')] === undefined || arrayInput[$(this).attr('id')] != $(this).val()) {
            WindowCartella.DatiNonRegistrati.set(true);
        }
    });
}



var NS_CONSULENZA_CONSENSO = {
		windowConsenso:'',
		consensoAttivo:true,
		init:function(){
			this.consensoAttivo=WindowCartella.CartellaPaziente.checkPrivacy('VISITA_ANESTESIOLOGICA');

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
			//Se è scelta una voce tra oscurato e oscuramento dell'oscuramento,   la scelta di almeno uno dei due checkbox è obbligatoria ai fini del salvataggio
				if((this.windowConsenso.$('input:radio[@name="rdOscuramento"]:checked').val()=='V'||this.windowConsenso.$('input:radio[@name="rdOscuramento"]:checked').val()=='R') && !this.windowConsenso.$('#idVolereCittadino').is(':checked') && !this.windowConsenso.$('#idPerLegge').is(':checked')){
					msg='Prego selezionare almeno una voce tra "Volontà del cittadino" e "per Legge"'; 
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



function loadChecked() {
    $('#radLateralita:checked, #radLivelloUrgenza:checked, #radSceltaAnestesiologicoASA:checked, #inputcheckAnestesiologicoASA:checked, #radSceltaAnestesiologicoNYHA:checked, #radSceltaRischioOperatorio:checked, #radSceltaOperabile:checked, #radSceltaValMallampati:checked, #radSceltaIOT:checked, #radSceltaAVD:checked, #radProtesi:checked, #radDeposito:checked, #radSceltaDisposizione:checked, #inputcheckAnestesiologicoProposta1:checked, #inputcheckAnestesiologicoProposta2:checked, #inputcheckAnestesiologicoProposta3:checked, #inputcheckAnestesiologicoProposta4:checked, #inputcheckAnestesiologicoProposta5:checked, #inputcheckAnestesiologicoProposta6:checked').each(function(i) {
        var key = $(this).attr('id');
        var value = $(this).val();
        arrayRadio[key] = value;
    });
}

function loadInput() {
    $('#hIdenInterventoEsame, #htxtInterventoEsame, #txtInterventoEsame, #txtPressione, #txtO2Sat, #txtFrequenzaCardiaca, #txtPeso, #txtAltezza, #txtBMI, #txtGruppoSanguigno, #txtTestDiCoombs, #txtEmocomponentiPFC, #txtEmocomponentiEC, #txtEmocomponentiPLT').each(function(i) {
        var key = $(this).attr('id');
        var value = $(this).val();
        arrayInput[key] = value;
    });
}

function apriConsensoAnestesia() {
	
	var url='servletGenerator?KEY_LEGAME=CONSENSO_ATTO_SANITARIO&KEY_ID=0&IDEN_VISITA=' +  WindowCartella.getRicovero('IDEN') + '&IDEN_VISITA_REGISTRAZIONE=' +  WindowCartella.getAccesso('IDEN') + '&IDEN_ANAG=' + $('#idenAnag').val() + '&TIPO=PROCEDURE_ANEST&REVOCA=N&READONLY=N&APERTURA=LETTERA';
	
    WindowCartella.$.fancybox({
        'padding'   : 3,
        'width'     : top.document.body.offsetWidth/10*9,
        'height'    : top.document.body.offsetWidth/10*8,
        'href'      : url,
        'type'      : 'iframe'
    });
}

function appendFunctionToButton()
{

	if (baseUser.TIPO=='I')
	{
		$('#idStampa').click(function() {
			stampaRefertoConsulenza();
		});
	}
	else
	{
		if (document.frmGestionePagina.stato.value=='F')
		{
			$('#idRegistra').hide();
		}
		else
		{
			$('#idRegistra').click(function() {
				registra("L");
			});
		}
		$('#idFirma').click(function() {
			registra("S");
		});
        
        /*$('#idRegistraConsenso').click(function(){
           registraConsensoDocumento(); 
        });*/
        
		$('#idStampa').click(function() {
			stampaRefertoConsulenza();
		});
		
		$('#idChiudi').click(function() {
			chiudi();
		});
		
		$('#idConsensoAnestesia').click(function() {
			apriConsensoAnestesia();
		});
	}
}
