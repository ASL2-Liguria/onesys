/* global home, NS_FUNCTIONS, NS_FENIX_SCHEDA, moment */

var NS_CORE = {

	sott_tel		: '',
	sott_email		: '',
	sott_doc		: '',
	sott_numero		: '',
	sott_emesso		: '',
	sott_data		: '',
	sott_data_iso	: '',
    saved        	: false,

    init: function() {

		$("#li-tabDichiarazioneSostitutiva").hide();
        /* Carico le variabili EXTERN */
        NS_FUNCTIONS.loadExtern();

        /* Se non ho l'iden dell'anagrafica chiamo la funzione gestAnag che me lo recupera */
        if (_PATIENT_ID == null) {
            NS_FUNCTIONS.gestAnag();
            /* Ricarico la pagina con la url completa */
            NS_FUNCTIONS.url.params.load();
            _URL_PARAMS += NS_FUNCTIONS.url.params.set('PATIENT_ID', _PATIENT_ID);
            _URL_PARAMS += NS_FUNCTIONS.url.params.set('ASSIGNING_AUTHORITY', home.baseGlobal.ASSIGNING_AUTHORITY);
            /*** alert(location.origin + location.pathname + _URL_PARAMS); ***/
            /*** alert("location.hash: " + location.hash +
                    "\nlocation.host: "	+ location.host +
                    "\nlocation.hostname: "	+ location.hostname +
                    "\nlocation.href: " + location.href +
                    "\nlocation.origin: " + location.origin +
                    "\nlocation.pathname: " + location.pathname +
                    "\nlocation.port: " + location.port +
                    "\nlocation.protocol: " + location.protocol +
                    "\nlocation.search: " + location.search); ***/
            location.href = location.protocol + "//" + location.host + location.pathname + _URL_PARAMS;
        }else{
			NS_FUNCTIONS.loadPatient(); 
		}
        
        if (($("#TITOLARE_TRATTAMENTO").val() == '' || $("#TITOLARE_TRATTAMENTO").val() == undefined) && LIB.isValid(home.baseUser.TITOLARE_TRATTAMENTO)){
        	NS_FUNCTIONS.getTitolareTrattamento();
        }else if ($("#TITOLARE_TRATTAMENTO").val() == '' || $("#TITOLARE_TRATTAMENTO").val() == undefined) {
            home.NOTIFICA.error({message: "ATTENZIONE: titolare del trattamento assente", timeout: 5, title: "Error"});

        	var msg = "ATTENZIONE: titolare del trattamento assente";

			var $div = $("<div>", {"id":"DivDialogConferma"}).append($("<p>").html(msg));

			$.dialog(
				$div, {
					width	: 400,
					title	: "Attenzione",
					buttons	: [
						       	   {
						       		   label: "Chiudi",
						       		   action: function () {
						       			   $.dialog.hide();

						                   if (_LOGOUT_ON_CLOSE != 'N') {
						                       NS_FENIX_SCHEDA.beforeClose = function(){
						                           home.NS_FENIX_TOP.logout();
						                       };
						                   }
						                   NS_FENIX_SCHEDA.chiudi();
						       		   }
						       	   }
					       	  ]
				}
			);
        }
        
        /*** finchè ci saranno i moduli cartacei NON possiamo pretendere l'obbligatorietà dei campi ***/
        NS_FENIX_SCHEDA.addFieldsValidator({'config': 'V_' + _TIPO_CONSENSO}); 

        /* Disabilito i campi data registrazione e utente registrazione in modo che non siano modificabili*/
    	$("#txtDataRegistrazione").attr("disabled",true);
    	$("#txtDataRegistrazione").off("click");
    	$("#txtOperatoreRegistrazione").attr("readonly", true); /*** necessario se il validator viene commentato ***/

        /* Faccio sparire alcune label a seconda che ci troviamo in inserimento o in modifica */
        var lblTit;
        if($("#h-versione_modulo").val() === ''){
        	lblTit = "INSERIMENTO DEL ";
        	$("#fldRegistrazione").hide();
        }else{
        	lblTit = "MODIFICA DEL ";
        }
        document.getElementById("lblTitolo").innerHTML = lblTit + document.getElementById("lblTitolo").innerHTML;
        
        $(".butSalva").hide();
        
        NS_CORE.lockFields("Garante");
        $("#txtAutoOperatoreDichiarazione").closest("td").hide();

        /*if(LIB.isValid(home.baseUser) && LIB.isValid(home.baseUser.DESCRIZIONE) && $("#h-versione_modulo").val() === ''){
            $("#txtOperatoreDichiarazione").val(home.baseUser.DESCRIZIONE);
        }*/
    },

    setEvents: function() {

        switch (_ACTION) {
            case 'INSERISCI':
                /* Modalit� di inserimento del consenso */
                NS_CORE.inserisci();
                break;
            case 'VISUALIZZA':
                /* Modalit� di visualizzazione del consenso */
                NS_CORE.visualizza();
                break
            default:
                /* Azione sconosciuta */

                home.NOTIFICA.error({
                    message	: "UNKNOWN ACTION: " + _ACTION,
                    title	: "Errore!"
                });
                NS_FENIX_SCHEDA.chiudi();
        }

        $("#chkNomeProprio").on("change",function(){
            if (chkNomeProprio.val() === '') {
                NS_CORE.empty.patient.basicData("Sottoscritto");
                NS_CORE.unlockFields("Sottoscritto");
                NS_CORE.set.patient.basicData("Garante");
            } else {
                NS_CORE.empty.patient.basicData("Garante");
                NS_CORE.set.patient.basicData("Sottoscritto");
                NS_CORE.lockFields("Sottoscritto");
            	radTipoDichiarante.empty();
            }
        });

        $("#h-radScelta1B").change(function() {
            radScelta1B.val() === 'N' ? $("#txtScelta1BDettaglio").val("") : null;
        });

        NS_FENIX_SCHEDA.customizeParam = NS_CORE.customizeParam;

        if (_LOGOUT_ON_CLOSE != 'N') {
            NS_FENIX_SCHEDA.beforeClose = function(){
                home.NS_FENIX_TOP.logout();
            };
        }

        /*** Se il paziente è minorenne, in fase di inserimento, compilo automaticamente la parte del 'Garante' ***/
        var data_nascita = $('#DATA_NASCITA').val();
        var data_maggiorenne = moment(data_nascita, "YYYYMMDD").add(18, 'years').format('YYYYMMDD');
        var data_odierna = moment().format('YYYYMMDD');

        if(data_odierna < data_maggiorenne){
            if($("#h-versione_modulo").val() === ''){

            	NS_CORE.empty.patient.basicData("Sottoscritto");
            	NS_CORE.unlockFields("Sottoscritto");
            	NS_CORE.set.patient.basicData("Garante");
            	radTipoDichiarante.selectByValue('G');

            }
            $("#chkNomeProprio").hide();

        }else{

            $("#h-radTipoDichiarante").change(function() {
                if (radTipoDichiarante.val() === '') {
                    NS_CORE.empty.patient.basicData("Garante");
                    NS_CORE.set.patient.basicData("Sottoscritto");
                    NS_CORE.lockFields("Sottoscritto");
                } else {
                	if (chkNomeProprio.val() !== '') {
	                    NS_CORE.empty.patient.basicData("Sottoscritto");
	                    NS_CORE.unlockFields("Sottoscritto");
                	}
                    NS_CORE.set.patient.basicData("Garante");
                }
            });
        }

    },
    
    setOperatoreDichiarazione: function(data){
    	$("#txtOperatoreDichiarazione").val(data.DESCR);
    },
    
    checkDicSost: function() {
    	if(!NS_CORE.ctrl.patient.basicData("Garante")){

            home.NOTIFICA.warning({
                message	: "Controllare che i campi relativi alla dichiarazione sostitutiva siano compilati!",
                title	: "Attenzione!"
            });
        	return false;
    	}
        
        if (!NS_CORE.checkCampiSottoscritto()){

            home.NOTIFICA.warning({
                message	: "Controllare che i campi relativi a chi sottoscrive la dichiarazione sostitutiva siano compilati!",
                title	: "Attenzione!"
            });
        	return false;
        }
    	return true;
    },
    
    checkCampiSottoscritto: function() {
    	if($("#txtSottoscrittoNome").val() == ''){ return false; }
    	if($("#txtSottoscrittoCognome").val() == ''){ return false; }
    	if($("#txtSottoscrittoLuogoNascita").val() == ''){ return false; }
    	if($("#txtSottoscrittoDataNascita").val() == ''){ return false; }
    	if($("#txtSottoscrittoCodiceFiscale").val() == ''){ return false; }
    	return true;
    },

    beforeSave: function() {
        
        $("#h-tipo").val(_TIPO_CONSENSO);
        
        /*if (radTipoDichiarante.val() === '' && !NS_CORE.ctrl.patient.basicData("Sottoscritto")) {
            home.NOTIFICA.warning({message: "ATTENZIONE: compilare tutti i dati del paziente", timeout: 5, title: "Error"});
            return false;
        }else if (radTipoDichiarante.val() !== ''){
            
            /*** controlli nel caso in cui sia stata selezionata la scelta della dichiaraizone sostitutiva ***/
            /*if (!NS_CORE.checkDicSost()){ return false; };
        }*/


        if($("#txtSottoscrittoCodiceFiscale").val() != '') {
            /*** controllo integrita' del codice fiscale inserito nelle parte del sottoscritto ***/
            if (!NS_FUNCTIONS.verificaCodiceFiscaleDefinitivo($("#txtSottoscrittoCodiceFiscale").val())) {
                home.NOTIFICA.warning({
                    message: "Il Codice Fiscale inserito nella sezione del 'sottoscritto' non è valido",
                    timeout: 5
                });
                return false;
            }

            /*** controllo che i codici fiscali inseriti nelle parte del sottoscritto e in quella del 'tutore' siano diversi ***/
            if ($("#txtSottoscrittoCodiceFiscale").val() == $("#txtGaranteCodiceFiscale").val()) {
                home.NOTIFICA.warning({
                    message: "Il Codice Fiscale inserito nella sezione del 'sottoscritto' è uguale a quello del paziente",
                    timeout: 5
                });
                return false;
            }
        }

        /*** se il paziente è minorenne valorizzo il campo h-data_scadenza con la data del suo 18 compleanno ***/
        var data_scadenza = '';
        var data_odierna = moment().format('YYYYMMDD');

        var data_nascita = $('#DATA_NASCITA').val();
        var data_maggiorenne = moment(data_nascita, "YYYYMMDD").add(18, 'years').format('YYYYMMDD');

        if(data_odierna < data_maggiorenne){
            data_scadenza = data_maggiorenne;
        }

        $("#h-data_scadenza").val(data_scadenza);

        return true;
    },

    ctrl: {

        patient: {
            basicData: function(id) {
                return $("#txt" + id + "Nome").val() !== '' 
                	&& $("#txt" + id + "Cognome").val() !== ''
                		&& $("#txt" + id + "LuogoNascita").val() !== '' 
                			&& $("#txt" + id + "DataNascita").val() !== '' 
                				&& $("#h-txt" + id + "DataNascita").val() !== '' 
                					&& $("#txt" + id + "Residente").val() !== '' 
                						&& $("#txt" + id + "CodiceFiscale").val() !== '';
            }
        }
    },

    customizeParam: function(params) {

        /*** param.afterSave = NS_FENIX_SCHEDA.chiudi; ***/
        params.beforeSave = NS_CORE.beforeSave;
        params.refresh = true;
        params.successSave = NS_CORE.successSave;
        return params;
    },
	
	myCustomizeJson: function( json ) {
		
		json.TITOLARE_TRATTAMENTO = (LIB.isValid($("#TITOLARE_TRATTAMENTO").val()) && $("#TITOLARE_TRATTAMENTO").val() !== '') ? $("#TITOLARE_TRATTAMENTO").val() : home.baseGlobal.TITOLARE_TRATTAMENTO_DEFAULT;
		return json;
    },

    empty: {

        patient: {
            basicData: function(id) {

                if(id === 'Sottoscritto'){

                	if( $("#txt" + id + "Telefono").val() !== ''){
                            NS_CORE.sott_tel = $("#txt" + id + "Telefono").val();
                        }
                	if( $("#txt" + id + "EMail").val() !== ''){
                            NS_CORE.sott_email = $("#txt" + id + "EMail").val();
                        }
                	if( $("#txt" + id + "DocumentoIdentita").val() !== ''){
                            NS_CORE.sott_doc = $("#txt" + id + "DocumentoIdentita").val();
                        }
                	if( $("#txt" + id + "NumeroDocumento").val() !== ''){
                            NS_CORE.sott_numero = $("#txt" + id + "NumeroDocumento").val();
                        }
                	if( $("#txt" + id + "DocumentoEmesso").val() !== ''){
                            NS_CORE.sott_emesso = $("#txt" + id + "DocumentoEmesso").val();
                        }
                	if( $("#txt" + id + "DataEmissione").val() !== ''){
                            NS_CORE.sott_data = $("#txt" + id + "DataEmissione").val();
                        }
                	if( $("#h-txt" + id + "DataEmissione").val() !== ''){
                            NS_CORE.sott_data_iso = $("#h-txt" + id + "DataEmissione").val();
                        }

                	$("#txt" + id + "Telefono").val("");
                	$("#txt" + id + "EMail").val("");
                	$("#txt" + id + "DocumentoIdentita").val("");
                	$("#txt" + id + "NumeroDocumento").val("");
                	$("#txt" + id + "DocumentoEmesso").val("");
                	$("#txt" + id + "DataEmissione").val("");
                	$("#h-txt" + id + "DataEmissione").val("");
                	chkNomeProprio.deselectAll();
                }

                $("#txt" + id + "NomeCognome").val("");
				$("#txt" + id + "Nome").val("");
				$("#txt" + id + "Cognome").val("");
                $("#txt" + id + "LuogoNascita").val("");
                $("#txt" + id + "DataNascita").val("");
                $("#h-txt" + id + "DataNascita").val("");
                $("#txt" + id + "Residente").val("");
				$("#txt" + id + "Indirizzo").val("");
                $("#txt" + id + "TesseraSanitaria").val("");
                $("#txt" + id + "CodiceFiscale").val("");
            }
        }
    },

    inserisci: function() {
        NS_FUNCTIONS.loadHideParams();

        if ($("#h-idenConsenso").val() === '') {
            NS_FUNCTIONS.loadPatient();
            NS_CORE.set.patient.basicData("Sottoscritto");
        }

        if($("#chkNomeProprio_S").hasClass("CBpulsSel")){
            NS_CORE.lockFields("Sottoscritto");
        }else{
            NS_CORE.unlockFields("Sottoscritto");
        }
    },

    visualizza: function() {
        NS_FUNCTIONS.loadHideParams();
        NS_FUNCTIONS.hideSalva();

        /* Questo if non c'era; è stato aggiunto solo per evitare che il consenso si apra vuoto
         * nel caso non ci siano consensi salvati per quel paziente
         * e l'utente rimanga 'disorientato' (es.su ambulatorio)*/
        if ($("#h-idenConsenso").val() === '') {
            NS_FUNCTIONS.loadPatient();
            NS_CORE.set.patient.basicData("Sottoscritto");
        }
    },

    lockFields: function(id){
    	
    	$("#lbl" + id + "LuogoNasc").attr("disabled", true);
    	$("#lbl" + id + "Res").attr("disabled", true);

		$("#txt" + id + "Nome").attr("readonly", true);
		$("#txt" + id + "Cognome").attr("readonly", true);
        $("#txt" + id + "LuogoNascita").attr("readonly", true);
        $("#txt" + id + "DataNascita").attr("disabled", true);
        $("#h-txt" + id + "DataNascita").attr("disabled", true);
        $("#txt" + id + "TesseraSanitaria").attr("readonly", true);
        $("#txt" + id + "CodiceFiscale").attr("readonly", true);
        $("#txt" + id + "Residente").attr("readonly", true);
        $("#txt" + id + "Indirizzo").attr("readonly", true);
    },

    unlockFields: function(id){
    	
    	$("#lbl" + id + "LuogoNasc").attr("disabled", false);
    	$("#lbl" + id + "Res").attr("disabled", false);

		$("#txt" + id + "Nome").attr("readonly", false);
		$("#txt" + id + "Cognome").attr("readonly", false);
        $("#txt" + id + "LuogoNascita").attr("readonly", false);
        $("#txt" + id + "DataNascita").attr("disabled", false);
        $("#h-txt" + id + "DataNascita").attr("disabled", false);
        $("#txt" + id + "TesseraSanitaria").attr("readonly", false);
        $("#txt" + id + "CodiceFiscale").attr("readonly", false);
        $("#txt" + id + "Residente").attr("readonly", false);
        $("#txt" + id + "Indirizzo").attr("readonly", false);
    },

    set: {

        patient: {

            basicData: function(id) {
                $("#txt" + id + "NomeCognome").val(_NOME + " " + _COGNOME);
				$("#txt" + id + "Nome").val(_NOME);
				$("#txt" + id + "Cognome").val(_COGNOME);
                $("#txt" + id + "LuogoNascita").val(_COMUNE_NASCITA);
                $("#txt" + id + "DataNascita").val(_DATA_NASCITA.substring(6, 8) + "/" + _DATA_NASCITA.substring(4, 6) + "/" + _DATA_NASCITA.substring(0, 4));
                $("#h-txt" + id + "DataNascita").val(_DATA_NASCITA);
                $("#txt" + id + "Residente").val(_COMUNE_RESIDENZA);
				$("#txt" + id + "Indirizzo").val(_INDIRIZZO);
				(_TESSERA_SANITARIA == null || _TESSERA_SANITARIA == 'null') ? $("#txt" + id + "TesseraSanitaria").val('') : $("#txt" + id + "TesseraSanitaria").val(_TESSERA_SANITARIA);
                
                $("#txt" + id + "CodiceFiscale").val(_CODICE_FISCALE);

                if(id === 'Sottoscritto'){
                	$("#txt" + id + "Telefono").val(NS_CORE.sott_tel);
                	$("#txt" + id + "EMail").val(NS_CORE.sott_email);
                	$("#txt" + id + "DocumentoIdentita").val(NS_CORE.sott_doc);
                	$("#txt" + id + "NumeroDocumento").val(NS_CORE.sott_numero);
                	$("#txt" + id + "DocumentoEmesso").val(NS_CORE.sott_emesso);
                	$("#txt" + id + "DataEmissione").val(NS_CORE.sott_data);
                	$("#h-txt" + id + "DataEmissione").val(NS_CORE.sott_data_iso);
                	chkNomeProprio.selectAll();
                }
            }
        }
    },

    successSave: function(message) {
        NS_CORE.saved = true;
        $("#h-idenConsenso").val(message);
        NS_FUNCTIONS.callAjax.EVC([{"idenDettaglio": message, "tabellaModulo": "PIC_MODULI_CONSENSO"}], "PIC_MODULI_CONSENSO");
        
        NS_PIC_BRIDGE.refreshWKUnico();
    }
};

$(document).ready(function() {
    try {
        NS_CORE.init();
        NS_CORE.setEvents();
        home.NS_LOADING.hideLoading();
    	NS_FENIX_SCHEDA.customizeJson = NS_CORE.myCustomizeJson;
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }
});