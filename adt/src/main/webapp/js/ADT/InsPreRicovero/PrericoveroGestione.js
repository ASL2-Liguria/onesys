var _ORIGINE = null;
var _STATO_PAGINA = null;
var _IDEN_CONTATTO = null;
var _IDEN_ANAG = null;
var _JSON_CONTATTO = null;
var _JSON_ANAGRAFICA = null;

jQuery(document).ready(function () {

	_ORIGINE = $('#ORIGINE').val();
	_STATO_PAGINA = $('#STATO_PAGINA').val();
	_IDEN_ANAG = $('#IDEN_ANAG').val();
	_IDEN_CONTATTO = $('#IDEN_CONTATTO').val();

	if(_STATO_PAGINA !== 'I')
    {
    	_JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(_IDEN_CONTATTO);
    	_JSON_ANAGRAFICA = _JSON_CONTATTO.anagrafica;
    }

	if(_STATO_PAGINA === 'I')
    {
    	_JSON_ANAGRAFICA = NS_ANAGRAFICA.Getter.getAnagraficaById(_IDEN_ANAG);
    }

    NS_PRERICOVERO.init();

});

var NS_PRERICOVERO = {

	init : function()
	{
		NS_PRERICOVERO.initLogger();
        NS_PRERICOVERO.setIntestazione();
        NS_PRERICOVERO.setEvents();
        NS_PRERICOVERO.setTipoRicoveroDefault();
        NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PRERICOVERO"});
    },

	setEvents : function(){

        // Override funzioni di salvataggio
        if (_STATO_PAGINA == 'E')
		{
        	NS_PRERICOVERO.aggiornaPagina();
			NS_FENIX_SCHEDA.registra = NS_PRERICOVERO_SALVATAGGI.registraModifica;
		}
		else
		{
			NS_PRERICOVERO.showHideRepartoDestinazione(false);
			NS_FENIX_SCHEDA.registra = NS_PRERICOVERO_SALVATAGGI.registraInserimento;
		}

		// Set Urgenza Da Lista Attesa
        // Se Lista di Attesa valorizzo i reparti in base a quelli abilitati per la lista in question
		if (_ORIGINE == 'LISTA_ATTESA')
		{
        	NS_PRERICOVERO.setUrgenzaFromListaAttesa();
            NS_PRERICOVERO.valorizeReparti({query:'LISTA_ATTESA.Q_REPARTI_PRERICOVERO',datasource:'ADT',parameters:{'USERNAME' : {t: 'V', v: home.baseUser.USERNAME, d:'I'},IDEN_LISTA:{t:'N',v :$("#IDEN_LISTA_ELENCO").val(), d:'I'}}});
        }
		else
		{
            NS_PRERICOVERO.valorizeReparti({query:'ADT.QUERY_REPARTI_PERSONALE', datasource:'ADT',parameters:{'USERNAME' : {t: 'V', v: home.baseUser.USERNAME, d:'I'}, IDEN_PER:{t:'N',v: null, d:'I'}}});
        };

        $("#cmbReparto").on("change", function(){
        	var _abilita_vpo = $("option:selected", this).attr("data-abilita_vpo") === "S" ? true : false;
        	NS_PRERICOVERO.showHideRepartoDestinazione(_abilita_vpo);

        	if (_abilita_vpo) {
        		$("#acRepartoDestinazione").data("acList").changeBindValue({"iden_cdc" : $("#cmbReparto option:selected").attr("data-value")});
                $("#txtRepartoDestinazione").data("autocomplete").changeBindValue({"iden_cdc" : $("#cmbReparto option:selected").attr("data-value")});
        	}
        });
	},

	aggiornaPagina : function() {

		_JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(_IDEN_CONTATTO);

        $("#h-txtDataPre").val(_JSON_CONTATTO.dataInizio.substring(0,8));
        $("#txtDataPre").val(moment(_JSON_CONTATTO.dataInizio, "YYYYMMDDHH:mm").format("DD/MM/YYYY"));
        $("#txtOraPre").val(moment(_JSON_CONTATTO.dataInizio, "YYYYMMDDHH:mm").format("HH:mm"));
        $('#h-cmbLivelloUrg').val(_JSON_CONTATTO.urgenza.codice);
        $("#cmbLivelloUrg_" + _JSON_CONTATTO.urgenza.codice).addClass("CBpulsSel");
	},

	setRepartoDestinazione : function(){

		if (_JSON_CONTATTO.mapMetadatiString["CDC_DESTINAZIONE_VPO"] != null && _JSON_CONTATTO.mapMetadatiString["CDC_DESTINAZIONE_VPO"] !== "")
        {
        	var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

            var xhr =  db.select(
            {
                    id: "ADT.Q_REPARTO_BY_CDC",
                    parameter : {"iden_cdc":   {t : 'N', v : _JSON_CONTATTO.mapMetadatiString["CDC_DESTINAZIONE_VPO"]}}
            });

            xhr.done(function (data, textStatus, jqXHR) {
            	$("#acRepartoDestinazione").data('acList').returnSelected({DESCR:data.result[0].DESCRIZIONE, VALUE : _JSON_CONTATTO.mapMetadatiString["CDC_DESTINAZIONE_VPO"]});
            });

            $("#acRepartoDestinazione").data("acList").changeBindValue({"iden_cdc" : $("#cmbReparto option:selected").attr("data-value")});
            $("#txtRepartoDestinazione").data("autocomplete").changeBindValue({"iden_cdc" : $("#cmbReparto option:selected").attr("data-value")});

            NS_PRERICOVERO.showHideRepartoDestinazione(true);
        }
        else if ($("#cmbReparto option:selected").attr("data-abilita_vpo") === "S")
        {
        	$("#acRepartoDestinazione").data("acList").changeBindValue({"iden_cdc" : $("#cmbReparto option:selected").attr("data-value")});
                $("#txtRepartoDestinazione").data("autocomplete").changeBindValue({"iden_cdc" : $("#cmbReparto option:selected").attr("data-value")});

        	NS_PRERICOVERO.showHideRepartoDestinazione(true);
        }
        else
        {
        	NS_PRERICOVERO.showHideRepartoDestinazione(false);
        }

	},

	getUrlCartellaPaziente : function(nosologico, callback){

		var url = home.baseGlobal.URL_CARTELLA + "/autoLogin?utente=" + home.baseUser.USERNAME;
		url = url + "&postazione=" + home.AppStampa.GetCanonicalHostname().toUpperCase();
		url = url + "&pagina=CARTELLAPAZIENTEADT";
		url = url + "&ricovero=" + nosologico;
		url = url + "&funzione=apriVuota()";

		logger.debug("NS_PRERICOVERO.getUrlCartellaPaziente - url -> " + url);

		// L'opener deve essere home in quanto dopo l'apertura della cartella la agina di inserimento viene chiusa
		// e su whale serve il riferimento a opener
		home.window.open(url, "_blank", "fullscreen=yes");

		if (typeof callback == "function") {
			callback();
		}

    },

    initLogger : function()
    {
    	home.NS_CONSOLEJS.addLogger({name:'PRERICOVERO',console:0});
        window.logger = home.NS_CONSOLEJS.loggers['PRERICOVERO'];
    },

    setUrgenzaFromListaAttesa : function(){

		var urgenza =  $('#URGENZA').val();

        $('#h-cmbLivelloUrg').val(urgenza);
        $("#cmbLivelloUrg_" + urgenza).addClass("CBpulsSel");
	},

	setIntestazione : function(){

        $('#lblTitle').html(_JSON_ANAGRAFICA.cognome + ' ' + _JSON_ANAGRAFICA.nome + ' - ' + _JSON_ANAGRAFICA.sesso + ' - ' + moment(_JSON_ANAGRAFICA.dataNascita, 'YYYYMMDDHH:mm').format('DD/MM/YYYY') + ' - ' + _JSON_ANAGRAFICA.codiceFiscale);

        // Button in alto a destra per il print degli errori della pagina
        $("#butPrintVideata").remove();
        $("#lblTitle").css({"width":"80%","display":"inline"});
        $(".headerTabs").append($("<button></button>").attr("id","butPrintVideata").attr("class","btn").html(traduzione.butPrintVideata).css({"float":"right"}).on("mousedown",function(){window.print();}));

    },

    valorizeReparti : function(json){

        var db = $.NS_DB.getTool({setup_default:{datasource:json.datasource}});

        var xhr =  db.select(
        {
            id: json.query,
            parameter :json.parameters
        });

        xhr.done(function (data, textStatus, jqXHR) {

        	var res = data.result;
            var key = null;
            var count = 0;

            $("#cmbReparto").append("<option data-codice_decodifica='' data-value='' data-abilita_vpo='' data-descr=''></option>");

            for(key in res)
            {
                if (typeof res[count] != 'undefined')
                {
                    $("#cmbReparto").append("<option data-codice_decodifica='" + res[count].CODICE_DECODIFICA +
                        "' data-value='" + res[count].VALUE + "' data-abilita_vpo='" + res[count].ABILITA_VPO + "' data-descr='" + res[count].DESCR + "'>"
                        + res[count].DESCR + "</option>");
                    count++;
                }
            }

            if(_STATO_PAGINA === 'E'){
                $("#cmbReparto").val(_JSON_CONTATTO.contattiGiuridici[0].provenienza.descrizione);
            }

            // Se il reparto selezionato e VPO visuaizzo il reparto destinatario
            if (_STATO_PAGINA === 'E' && $("#cmbReparto option:selected").attr("data-abilita_vpo") === "S")
            {
            	NS_PRERICOVERO.setRepartoDestinazione();
            }

        });

        xhr.fail(function (response) {
            home.NOTIFICA.error({message: "Attenzione Errore durante la valorizazione dei reparti", timeout : 6, title: "Error"});
            logger.error("Error xhr valorizzazione reparti -> " +  JSON.stringify(response));
        });
    },

    showHideRepartoDestinazione : function(show)
    {
    	var _show = typeof show != undefined ? show : false;

    	if (!_show) {
    		$("#txtRepartoDestinazione").closest("TR").hide();
    	} else {
    		$("#txtRepartoDestinazione").closest("TR").show();
    	}
    },
    setTipoRicoveroDefault : function () {
        $("#cmbTipoPreRicovero").find("option[data-value=\"PRE\"]").attr("selected","selected");
    }
};