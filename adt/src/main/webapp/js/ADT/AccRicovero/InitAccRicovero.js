var _IDEN_CONTATTO = null;
var _IDEN_ANAG = null;
var _STATO_PAGINA = null;
var _JSON_CONTATTO = null;
var _JSON_ANAGRAFICA = null;
var _CHIUSURA_FORZATA = null;
var _SDO = typeof $("#SDO").val() == "undefined" || $("#SDO").val() == "" || $("#SDO").val() == null ? "N" : $("#SDO").val();

$(document).ready(function () {

	_STATO_PAGINA = $('#STATO_PAGINA').val();
	_IDEN_ANAG = $('#IDEN_ANAG').val();
	_IDEN_CONTATTO = $('#IDEN_CONTATTO').val();
	_SDO = $("#SDO").val();
	_CHIUSURA_FORZATA = $("#CHIUSURA_FORZATA").val();

	// Se INSERIMENTO recupero l'oggetto _JSON_ANAGRAFICA dal Controller
    if(_STATO_PAGINA == 'I')
    {
    	_JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoEmpty();
    	_JSON_ANAGRAFICA = NS_ANAGRAFICA.Getter.getAnagraficaById(_IDEN_ANAG);

    	$('#tabs-ACC_RICOVERO li[data-tab="tabRicovero"]').css({"border-top-right-radius" : "6px"});
    	$('#tabs-ACC_RICOVERO li[data-tab!="tabRicovero"]').hide();
    	$('#tabs-ACC_RICOVERO li[data-tab="tabAnagrafica"]').show();
    	$(".butStampa").hide();
    }else{
      	// In MODIFICA gestisco il caricamento delle variabili comuni a tutti i tabulatori

        _JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(_IDEN_CONTATTO);

    	_JSON_ANAGRAFICA = _JSON_CONTATTO.anagrafica;

    	NS_SCHEDA.getTopFunctions();

    	// Procedo con la valorizzazione della pagina anche per altri tabulatori.
    	// Controllo se per il ricovero in questione sono presenti registrazioni e/o firme della SDO
        // NS_DIMISSIONE_SDO.getSDO();

    	if (_JSON_CONTATTO.isDayHospital()) {
	        $("#li-tabTrasferimento").hide();
    	} else {
        	$("#li-tabAccessiDh").hide();
        }


    }
    //cose da fare indipendentemente dallo stato pagina

    if (home.baseUser.GRUPPO_PERMESSI.indexOf('GEST_CART') < 0){
            $("#li-tabSintesiPaziente").hide();
            $('#tabs-ACC_RICOVERO li[data-tab="tabDimissione"]').css({"border-top-right-radius" : "6px"});
        }

    // Imposto cambio eventi sul tabulatore
    $('#tabs-ACC_RICOVERO li').on("click",function(){NS_SCHEDA.setTabulatoreScheda();});
    NS_SCHEDA.setTabulatoreScheda();

    // Se apro il Ricovero per l'inserimento della SDO (SDO = S) carico direttamente il tabulatore della dimissione
    if (_SDO === 'S'){
        $('#li-tabDimissione').trigger('click');
    }
        /*else {
    	NS_ACC_RICOVERO.init();
    }*/

    NS_ACC_RICOVERO_ANAGRAFICA.init();

    if (_CHIUSURA_FORZATA === 'S') {
    	$("#h-cmbLivelloUrg").val("A");
        $("#cmbLivelloUrg_A").addClass("CBpulsSel");
        $("#txtDataPren").val(moment().format('DD/MM/YYYY'));
        $("#h-txtDataPren").val(moment().format('YYYYMMDD'))
    }

});

var NS_SCHEDA = {

	topBeforeSave : null,
	topConfigSave : null,
	topRegistra : null,
	topLeggiCampiDaSalvare : null,

	setTabulatoreScheda : function(){

            NS_SCHEDA.resetTopFunctions();
		    NS_SCHEDA.resetAllButton();

            var tabAcctive = $('li.tabActive').attr('data-tab');

            switch  (tabAcctive) {
                case 'tabRicovero':
				NS_ACC_RICOVERO.Setter.setButtonScheda();
                    NS_ACC_RICOVERO.init();
                    break;
                case 'tabTrasferimento':
                    NS_RICH_TRASF_GIURIDICO.init();
                    break;
                case 'tabAccessiDh':
                    NS_ACCESSI_DH.init();
                    break;
                case 'tabDimissione':
                    _JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(_IDEN_CONTATTO);
                    NS_DIMISSIONE_SDO.init();
                    break;
                case 'tabAnagrafica':

                    //controllo se non c'è il validator lo aggiungo se no lascio il precedente (fa schifo come è fatto ma è l'unico modo per capire che validator c'è caricato -.-')
                    var validator =  $("#dati").data('validator');
                    if(typeof validator == 'undefined' || (typeof validator.config != 'undefined' && typeof validator.config.elements != 'undefined' && !validator.config.elements.hasOwnProperty("txtAnagNome"))){
                        NS_FENIX_SCHEDA.addFieldsValidator({config:"V_ADT_ACC_RICOVERO_ANAG"});
                    }

                    NS_ACC_RICOVERO_ANAGRAFICA.events();
                    NS_ACC_RICOVERO_ANAGRAFICA.Setter.setButtonScheda();
                    NS_ACC_RICOVERO.overrideRegistra();
                    break;
                case 'tabSintesiPaziente':
                    NS_SINTESI_PAZIENTE.init();
                    break;
            default :
                logger.error("Tabulatore non riconosciuto " + tabAcctive);
                //return alert('ATTENZIONE TABULATORE NON RICONOSCIUTO');
        }

	},

	getTopFunctions : function(){
		NS_SCHEDA.topBeforeSave = NS_FENIX_SCHEDA.beforeSave;
		NS_SCHEDA.topConfigSave = NS_FENIX_SCHEDA.configSave;
		NS_SCHEDA.topRegistra = NS_FENIX_SCHEDA.registra;
		NS_SCHEDA.topLeggiCampiDaSalvare = NS_FENIX_SCHEDA.leggiCampiDaSalvare;
	},

	resetTopFunctions : function(){
		NS_FENIX_SCHEDA.beforeSave = NS_SCHEDA.topBeforeSave;
		NS_FENIX_SCHEDA.configSave = NS_SCHEDA.topConfigSave;
		NS_FENIX_SCHEDA.registra = NS_SCHEDA.topRegistra;
		NS_FENIX_SCHEDA.leggiCampiDaSalvare = NS_SCHEDA.topLeggiCampiDaSalvare;
	},

	resetAllButton : function () {

		//$('.butStampaSTP, .butStampaENI, .butStampaTesseraENI, .butSalva, .butApriCartella, .butFirma, .butStampa').hide();
		$(".footerTabs div.buttons button").hide();
	}

};