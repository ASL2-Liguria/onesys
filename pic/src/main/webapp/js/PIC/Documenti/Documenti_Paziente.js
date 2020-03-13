function getUrlParameters(parameter, staticURL, decode) {
    var currLocation = staticURL;
    var parArr = currLocation.split("?")[1].split("&");
    var returnBool = true;

    for (var i = 0; i < parArr.length; i++) {
        var parr = parArr[i].split("=");
        if (parr[0] == parameter) {
            return (decode) ? decodeURIComponent(parr[1]) : parr[1];
        } else {
            returnBool = false;
        }
    }

    if (!returnBool)
        return false;
}

var DOCUMENTI_PAZIENTE = {
    LOGGER: null,

    init: function() {
        $('#ElencoWork').height("500px");

        /*** home.NS_CONSOLEJS.addLogger({name: "DOCUMENTI_PAZIENTE", console: 0});
        this.LOGGER = home.NS_CONSOLEJS.loggers["DOCUMENTI_PAZIENTE"]; ***/
        
        NS_FUNCTIONS.loadExtern();
        
        if ($("#PATIENT_ID", "#EXTERN").val() == null) {
        	NS_FUNCTIONS.gestAnag();
        }
        
        /*** alert("CODICE_FISCALE: " + this.CODICE_FISCALE +
                "\nCOGNOME: " + this.COGNOME +
                "\nCOM_NASC: " + this.COM_NASC +
                "\nDATA_NASCITA: " + this.DATA_NASCITA +
                "\nNOME: " + this.NOME +
                "\nSESSO: " + this.SESSO +
                "\nPATIENT_ID: " + this.PATIENT_ID); ***/
        
        $('div#DocumentiPaziente div.headerTabs h2#lblTitolo').html(
            $('div#DocumentiPaziente div.headerTabs h2#lblTitolo').html() + " di " + 
            _NOME + " " + _COGNOME + " nato a " + _COMUNE_NASCITA + " il " + _DATA_NASCITA.substring(6, 8) + "/" + _DATA_NASCITA.substring(4, 6) + "/" + _DATA_NASCITA.substring(0, 4) + " (CF: " + _CODICE_FISCALE + "; SESSO: " + _SESSO + ")"
        );
        
        NS_FUNCTIONS.loadUser(); 

        /*** temporaneamente disabilitato ***/
        /*** if (!LIB.isValid(this.IDEN_ANAG)) {
            this.LOGGER.error("IDEN_ANAG non ricevuto in GET.");
            return;
        } ***/
        
        $('#chkRicerca').data('CheckBox').selectByValue('Tutti');
        
        /*** Nascondo il tasto 'Ultimi 5 documenti' ***/
        $("#butUltimi5").hide();
        
        /*** e faccio partire la ricerca da tre mesi ad oggi ***/
        var data_inizio_iso = $("#h-txtDaData").val() !== "" ? $('#h-txtDaData').val() : moment().subtract('days', 90).format('YYYYMMDD');
        $("#h-txtDaData").val(data_inizio_iso);
        var data_inizio = data_inizio_iso.substr(6,2) + '/' + data_inizio_iso.substr(4,2) + '/' + data_inizio_iso.substr(0,4);
        $("#txtDaData").val(data_inizio);
        
        var h = $('.contentTabs').innerHeight() - $('#fldRicerca').outerHeight(true) - 40;
        $("#ElencoWork").height(h);
        /*** this.lastFive(); ***/
    },
    setEvents: function() {

    	var msg = "L'utente che sta cercando di accedere alla pagina NON è il medico curante del paziente.<br/>" +
    				"Proseguire?";

		var $div = $("<div>", {"id":"DivDialogConferma"}).append($("<p>").html(msg));
    	
    	if(LIB.isValid(home.baseGlobal.CHECK_MMG) && home.baseGlobal.CHECK_MMG === 'S' && LIB.isValid($("#FROM_MMG").val()) && $("#FROM_MMG").val() !== ''){

			$.dialog(
				$div, {
					width	: 400,
					title	: "Attenzione",
					buttons	: [
						       	   {
						       		   label: "Si",
						       		   action: function () {
						       			   $.dialog.hide();
						       		   }
						       	   },
						       	   {
						       		   label: "No",
						       		   action: function () {
						       			   $.dialog.hide();
						       			   NS_FENIX_SCHEDA.chiudi();
						       		   }
						       	   }
					       	  ]
				}
			);
		}

        $("#butUltimi5").on("click", function() {
            DOCUMENTI_PAZIENTE.lastFive();
        });
        
        $("#butCerca").on("click", function() {
            $("#lblUltimi5").text("");
            DOCUMENTI_PAZIENTE.refreshWk();
        });

        /*** volutamente disabilitato ***/
        /*** $('#chkRicerca').on("click", function() {
            DOCUMENTI_PAZIENTE.refreshWk();
        }); ***/
        
        if (_LOGOUT_ON_CLOSE != 'N') {
            NS_FENIX_SCHEDA.beforeClose = function(){
                home.NS_FENIX_TOP.logout();
            }; 
        }
    },

    lastFive: function() {
       
        var codicelast = home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_VISITE_SPECIALISTICHE + "," +
                home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_LETTERE + "," +
                home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_LABORATORIO + "," +
                home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_ESAMI_STRUMENTALI;
        
        home.$.NS_DB.getTool({_logger: home.logger}).select({
            id: 'XDSREGISTRY.DOCUMENTI_LAST',
            datasource: 'PORTALE_PIC',
            parameter:
                    {
                        patientId: {v: _ID_REMOTO, t: 'V'},
                        codice: {v: codicelast, t: 'V'},
                        number: {v: 5, t: 'N'}
                    }
        }).done(function(resp) {

            $("#txtDaData").val(resp.result[0].DATA_INIZIALE);
            $("#h-txtDaData").val(resp.result[0].DATA_INIZIALE_ISO);
            
            DOCUMENTI_PAZIENTE.refreshWk();
        });
    },
    
    refreshWk: function() {

        var chkRicerca = $("#chkRicerca").data('CheckBox').val() !== '' ? $("#chkRicerca").data('CheckBox').val() : '';
        var arrayRicVal = chkRicerca.split(',');
        var da_data = $("#h-txtDaData").val() !== "" ? $('#h-txtDaData').val() : moment().subtract('days', 90).format('YYYYMMDD');
        var a_data = $("#h-txtAData").val();
        var codice = "";
        
        if(jQuery.inArray("Visite Specialistiche", arrayRicVal) !== -1) {
        	codice += home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_VISITE_SPECIALISTICHE;
        }        
        if(jQuery.inArray("Lettere", arrayRicVal) !== -1) {
        	codice += home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_LETTERE;
        }        
        if(jQuery.inArray("Laboratorio", arrayRicVal) !== -1) {
        	codice += home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_LABORATORIO;
        }        
        if(jQuery.inArray("Esami Strumentali", arrayRicVal) !== -1) {
        	codice += home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_ESAMI_STRUMENTALI;
        }        
        if(jQuery.inArray("PS", arrayRicVal) !== -1) {
        	codice += home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_PS;
        }        
        if(jQuery.inArray("AnaPatologica", arrayRicVal) !== -1) {
        	codice += home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_ANATOMIA_PATOLOGICA;
        }        
        if(jQuery.inArray("SalaOperatoria", arrayRicVal) !== -1) {
        	codice += home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_SALA_OPERATORIA;
        }        
        if(jQuery.inArray("Tutti", arrayRicVal) !== -1) {
        	codice = home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_VISITE_SPECIALISTICHE + "," +
	            home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_LETTERE + "," +
	            home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_LABORATORIO + "," +
	            home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_ESAMI_STRUMENTALI + "," +
				home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_PS + "," +
				home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_ANATOMIA_PATOLOGICA + "," +
				home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_SALA_OPERATORIA;
        }

        this.objWk = new WK({
            "id": 'WK_REPOSITORY',
            "aBind": [
                'idRepository'
                , 'codice'
                , 'da_data'
                , 'a_data'
                , 'assigningAuthority'
                , 'patientId'
                , 'nome'
                , 'cognome'
                , 'sesso'
                , 'dataNascita'
                , 'comuneNascita'
                , 'codiceFiscale'
                , 'user'
                , 'emergenzaMedica'
            ],
            /*** "aVal": [this.ID_REMOTO, codice, da_data, a_data, 'WHALE', '629153', 'FRANCESCO', 'GENTA', 'M', '19821109', '009056', 'GNTFNC82P11I480Q', 'fra'], ***/
            "aVal": [
                _ID_REMOTO
                , codice
                , da_data
                , a_data
                , _ASSIGNING_AUTHORITY
                , _PATIENT_ID
                , _NOME
                , _COGNOME
                , _SESSO
                , _DATA_NASCITA
                , _COM_NASC
                , _CODICE_FISCALE
                , _UTE_INS
                , _EMERGENZA_MEDICA
            ],
            "container": 'ElencoWork'
        });

        this.objWk.loadWk();
    }
};

$(document).ready(function() {
    try {
        DOCUMENTI_PAZIENTE.init();
        DOCUMENTI_PAZIENTE.setEvents();
        var h = getUrlParameters('HEIGHTCARTELLA', window.location.search, true);
        $('.contentTabs').height($('.contentTabs').height() - (h ? h * 4 : 0));
        $('#ElencoWork').height($('#ElencoWork').height() - (h ? h * 4 : 0));
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }    
});