var NS_HOME_ADT_WK = {

		wkRicercaAnagrafica : null,
	    wkRicoverati : null,
	    wkTrasferimenti : null,
	    wkDimissioniSDO : null,
	    wkTrasferimentiAccettazione : null,
	    wkDimessi : null,
		wkRicoveriSovrapposti : null,

	    beforeApplica : function()
	    {

	        if (NS_HOME_ADT.tab_sel == "filtroPazienti")
	        {
	        	if (!NS_HOME_ADT_WK.isValidForAnagrafica())
	        	{
            		home.NOTIFICA.warning({message: "Valorizzare almeno due caratteri relativi al cognome o la data di nascita", timeout : 6, title: "Warning"});
            		return false;
            	}

	        	return NS_HOME_ADT_WK.definisciQueryWKAnagrafica().SUCCESS;
	        }
	        else if (NS_HOME_ADT.tab_sel == "filtroWkDimessi")
	        {
	        	return NS_HOME_ADT_WK.definisciQueryWKDimessi().SUCCESS;
	        }
	        else if (NS_HOME_ADT.tab_sel == "filtroDimissioniSDO")
	        {
	        	return NS_HOME_ADT_WK.definisciQueryWKDimessioniSDO().SUCCESS;
	        }
	        else
	    	{
	        	return true;
	    	}
	    },

	    caricaWk : function(){

	        switch  (NS_HOME_ADT.tab_sel)
	        {
	            case 'filtroPazienti':
	                NS_HOME_ADT_WK.caricaWkPazienti();
	                break;
	            case 'filtroRicoverati':
	                NS_HOME_ADT_WK.caricaWkRicoverati();
	                break;
	            case 'filtroAccettazioneTrasferimenti':
	                NS_HOME_ADT_WK.caricaWkAccettazioneTrasferimenti();
	                break;
	            case 'filtroDimissioniSDO':
	                NS_HOME_ADT_WK.caricaWkDimissioniSDO();
	                break;
	            case 'filtroTrasferimenti':
	                NS_HOME_ADT_WK.caricaWkTrasferimenti();
	                break;
	            case 'filtroWkDimessi' :
	                NS_HOME_ADT_WK.caricaWkDimessi();
	                break;
				case 'filtroRicoveriSovrapposti' :
					NS_HOME_ADT_WK.caricaWkRicoveriSovrapposti();
					break;
	            default :
					logger.error("Tabulatore non riconosciuto " + NS_HOME_ADT.tab_sel);
					//return alert('ATTENZIONE TABULATORE NON RICONOSCIUTO');
	        }
	    },

	    /**
	     * Gestione del refresh della WK Anagrafica.
	     * Viene definita la logica e la valenza dei filtri da applicare e la query con cui estrapolare i dati.
	     * Se viene selezionata la ricerca sensibile viene modificato dinamicamente il tipo di BIND da T (Text) a N (Number).
	     * La ricerca sensibile viene applicata solo se il nome e il cognome sono valorizzati.
	     *
	     *  @author alessandro.arrighi
	     */
	    definisciQueryWKAnagrafica : function(){

	    	var ricercaSensibile = $("#h-chkRicercaSensibile").val() == "S" ? true : false;
	    	var nome = $("#txtNome").val();
	    	var cognome = $("#txtCognome").val();
	    	var cf = $("#txtCodFisc").val();

	    	$('#txtNome').attr("data-filtro-tipo", ricercaSensibile && nome.length > 0 ? "N" : "T");
	    	$('#txtCognome').attr("data-filtro-tipo", ricercaSensibile && cognome.length > 0 ? "N" : "T");
	    	$('#txtNome').data("filtro-tipo", ricercaSensibile && nome.length > 0 ? "N" : "T");
	    	$('#txtCognome').data("filtro-tipo", ricercaSensibile && cognome.length > 0 ? "N" : "T");

	    	var p = {"SUCCESS" : true, "QUERY" : null};

	    	p.QUERY = cf.length > 0 ? "WORKLIST.WK_RICERCA_ANAGRAFICA_BY_CODICE_FISCALE" : "WORKLIST.WK_RICERCA_ANAGRAFICA";

	    	logger.debug("WK Anagrafica caricata con query -> " + p.QUERY);

	    	$("#divWk").worklist().config.structure.id_query = p.QUERY;

	    	return p;
	    },

	    caricaWkPazienti : function(){

	        NS_HOME_ADT_WK.wkRicercaAnagrafica= new WK({
	            id : "WK_RICERCA_ANAGRAFICA",
	            container : "divWk",
	            aBind : [],
	            aVal : [],
	            loadData : false
	        });

	        NS_HOME_ADT_WK.wkRicercaAnagrafica.loadWk();
	    },

	    /**
	     * Funzione per il caricamento della WK Ricoverati.
	     * Viene caricata sempre la stessa WK con la stessa query a prescindere del tipo di contatto selezionato.
	     * Grazie all'implementazione della tabella <b>CONTATTI_SINTESI</b> siamo riusciti ad evitare di avere tre WK.
	     * La tabella <b>CONTATTI_SINTESI</b> contiene i campi su cui vengono effettuati i filtri dei <b>SOLI</b> contatti aperti.
	     *
	     * @author alessandro.arrighi
	     */
	    caricaWkRicoverati : function(){

	        var scope = $("#h-radFiltroWk").val();

	        $('#txtNomeCont, #txtCognomeCont').each(function (k,v){
	            var $v = $(v);
	            $v.val($.trim($v.val().toUpperCase()));
	        });

	        var nome =  $('#txtNomeCont').val() == '' ? '%25': $('#txtNomeCont').val() +'%25';
	        var cognome =   $('#txtCognomeCont').val() == '' ? '%25': $('#txtCognomeCont').val() + '%25';
	        var cartella =   $('#txtCartellaCont').val();

	        NS_HOME_ADT_WK.wkRicoverati= new WK({
	            id : "WK_RICOVERATI",
	            container : "divWk",
	            aBind : ["nome","cognome","cartella","scope_cdc","username"],
	            aVal : [nome,cognome,cartella,scope,$('#USERNAME').val()]
	        });

	        NS_HOME_ADT_WK.wkRicoverati.loadWk();
	    },

	    definisciQueryWKDimessi : function(){

	        var repartiSelezionati = $("#h-tagRepartoAGD").val().split(",");
	        var cognome = $("#txtCognomeAGD").val();
			var nome = $("#txtNomeAGD").val();
	        var cartella = $("#txtCartellaAGD").val();
			var daData = $("#h-txtDaDataAGD").val();
			var aData = $("#h-txtADataAGD").val();

	    	var p = { "SUCCESS" : true, "QUERY" : "" };

			if (cartella.length > 0)
			{
				p.QUERY = "WORKLIST.WK_DIMESSI_BY_CARTELLA";
			}
			else if (cognome != null && cognome.length >= 2)
			{
				p.QUERY = "WORKLIST.WK_DIMESSI_BY_DATI_ANAGRAFICI";
			}
			else if (daData != null && daData != "" && aData != null && aData != "" )
			{
				p.QUERY = "WORKLIST.WK_DIMESSI_BY_DATA_RANGE";
			}
			else
			{
				p.SUCCESS = false;
			}

	    	if ((cartella.length < 1 && repartiSelezionati.length > 3 && cognome.length < 2) || !p.SUCCESS){
	    		p.SUCCESS = false;
	    		home.NOTIFICA.warning({message: "Valorizzare almeno due caratteri relativi al cognome oppure un massimo di tre reparti", timeout : 6, title: "Warning"});
	    	}

	    	logger.debug("WK Dimessi caricata con query -> " + p.QUERY);

	    	$("#divWk").worklist().config.structure.id_query = p.QUERY;

	    	return p;
	    },

	    /**
	     * La ricerca dei dimessi avviene tramite la wk <b>WK_DIMESSI</b>.
	     * La wk viene valorizzata grazie a due distinte query a seconda che venga valorizzato il filtro cartella.
	     * Le query in questione sono WK_DIMESSI_BY_DATA_RANGE e WK_DIMESSI_BY_CARELLA.
	     * Le date possono essere NULL da interfaccia ma in background viene applicato il filtro a partire da un anno fa ad oggi.
	     *
	     * @author alessandro.arrighi
	     */
	    caricaWkDimessi : function(){

	        if(!NS_HOME_ADT_WK.wkDimessi)
	        {
	            var daData = $("#txtDaDataAGD" ).data('Zebra_DatePicker');
	            daData.setDataIso(moment().add(-10,"days").format('YYYYMMDD'));

	            var aData = $("#txtADataAGD" ).data('Zebra_DatePicker');
	            aData.setDataIso(moment().format('YYYYMMDD'));
	        }

	        NS_HOME_ADT_WK.wkDimessi= new WK({
	            id : "WK_DIMESSI",
	            container : "divWk",
	            aBind : [],
	            aVal : [],
	            loadData : false
	        });

	        NS_HOME_ADT_WK.wkDimessi.loadWk();
			NS_HOME_ADT_WK.handlerFiltriWKDimessi();
	    },

	    caricaWkTrasferimenti : function(){

	        var nome = $('#txtNomeTA').val() == '' ? '%25' : $('#txtNomeTA').val();
	        var cognome = $('#txtCognomeTA').val() == '' ? '%25' : $('#txtCognomeTA').val();

	        NS_HOME_ADT_WK.wkTrasferimenti= new WK({
	            id : "WK_TRASFERIMENTI",
	            container : "divWk",
	            aBind : ["nome","cognome","username"],
	            aVal : [nome,cognome,home.baseUser.USERNAME]
	        });

	        NS_HOME_ADT_WK.wkTrasferimenti.loadWk();
	    },

	    definisciQueryWKDimessioniSDO : function(){

			// #txtCognomeContattiSdo #txtNomeContattiSdo #txtCartellaSdo #h-txtDataInizioListaContattiSdo #txtDataInizioListaContattiSdo  #h-txtDataFineListaContattiSdo #txtDataFineListaContattiSdo

			var cognome = $("#txtCognomeContattiSdo").val();
			var nome = $("#txtNomeContattiSdo").val();
			var cartella = $("#txtCartellaSdo").val();
			var daData = $("#h-txtDataInizioListaContattiSdo").val();
			var aData = $("#h-txtDataFineListaContattiSdo").val();

	    	var p = { "SUCCESS" : true, "QUERY" : "" };

			if (cartella.length > 0)
			{
				p.QUERY = "WORKLIST.WK_DIMESSI_SDO_BY_CARTELLA";
			}
			else if (cognome != null && cognome.length >= 2)
			{
				p.QUERY = "WORKLIST.WK_DIMESSI_SDO_BY_DATI_ANAGRAFICI";
			}
			else if (daData != null && daData != "" && aData != null && aData != "" )
			{
				p.QUERY = "WORKLIST.WK_DIMESSI_SDO_BY_DATA_RANGE";
			}
			else
			{
				p.SUCCESS = false;
				home.NOTIFICA.warning({message: "Valorizzare almeno Data Inizio e Data Fine, Numero di Cartella o i Dati Anagrafici", timeout : 6, title: "Warning"});
			}

	    	// p.QUERY = $("#txtCartellaSdo").val().length > 0 ? "WORKLIST.WK_DIMESSI_SDO_BY_CARTELLA" : "WORKLIST.WK_DIMESSI_SDO_BY_DATA_RANGE";

	    	logger.debug("WK Dimessi SDO caricata con query -> " + p.QUERY);

	    	$("#divWk").worklist().config.structure.id_query = p.QUERY;

	    	return p;
	    },

	    caricaWkDimissioniSDO : function(){

	        if(!NS_HOME_ADT_WK.wkDimissioniSDO)
	        {
	            var daData = $("#txtDataInizioListaContattiSdo" ).data('Zebra_DatePicker');
	            daData.setDataIso(moment().add(-10,"days").format('YYYYMMDD'));

	            var aData = $("#txtDataFineListaContattiSdo" ).data('Zebra_DatePicker');
	            aData.setDataIso(moment().format('YYYYMMDD'));
	        }

	        NS_HOME_ADT_WK.wkDimissioniSDO = new WK({
	            id:"WK_DIMESSI_SDO",
	            container : "divWk",
	            aBind : [],
	            aVal : [],
	            loadData : false

	        });

	        NS_HOME_ADT_WK.wkDimissioniSDO.loadWk();
			NS_HOME_ADT_WK.handlerFiltriWKDimessiSDO();

	    },

	    caricaWkAccettazioneTrasferimenti : function(){

	        NS_HOME_ADT_WK.wkTrasferimentiAccettazione= new WK({
	            id : "WK_TRASFERIMENTI_ACCETTAZIONE",
	            container : "divWk",
	            aBind : ["username"],
	            aVal : [home.baseUser.USERNAME]
	        });

	        NS_HOME_ADT_WK.wkTrasferimentiAccettazione.loadWk();
	    },

		/**
		 * Si tratta della WK degli accessi DH chiusi forzatamente dall'inserimento di un ricovero ordinario.
		 *
		 * @author alessandro.arrighi
		 */
		caricaWkRicoveriSovrapposti : function(){

			if(!NS_HOME_ADT_WK.wkRicoveriSovrapposti)
			{
				var daData = $("#txtDataInizioRicoveriSovrapposti" ).data('Zebra_DatePicker');
				daData.setDataIso(moment().add(-30,"days").format('YYYYMMDD'));

				var aData = $("#txtDataFineRicoveriSovrapposti" ).data('Zebra_DatePicker');
				aData.setDataIso(moment().format('YYYYMMDD'));
			}

			NS_HOME_ADT_WK.wkRicoveriSovrapposti= new WK({
				id : "WK_RICOVERI_SOVRAPPOSTI",
				container : "divWk",
				aBind : [],
				aVal : [],
				loadData : false
			});

			NS_HOME_ADT_WK.wkRicoveriSovrapposti.loadWk();
		},

	    isValidForAnagrafica : function(){

	    	var cognome = $("#txtCognome").val();
	    	var dataNascita =  $("#h-dateData").val();
	    	var codiceFiscale =  $("#txtCodFisc").val();

	    	return cognome.length < 2 && dataNascita.length < 8 && codiceFiscale.length < 10 ? false : true;
	    },

		handlerFiltriWKDimessi : function() {

			// #txtCognomeAGD #txtNomeAGD #txtCartellaAGD #h-txtDaDataAGD #txtDaDataAGD  #h-txtADataAGD #txtADataAGD
			$("#txtCartellaAGD").off("keyup").on("keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtCognomeAGD, #txtNomeAGD, #txtDaDataAGD, #h-txtDaDataAGD, #h-txtADataAGD, #txtADataAGD");
				var _value = $("#txtCartellaAGD").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
				}
			});

			$("#txtCognomeAGD, #txtNomeAGD").off("keyup").on("keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtCartellaAGD, #h-txtDaDataAGD, #txtDaDataAGD, #h-txtADataAGD, #txtADataAGD");
				var _value = $("#txtCognomeAGD").val() + $("#txtNomeAGD").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
				}
			});

			$("#txtDaDataAGD, #txtADataAGD").off("keyup").on("change input paste keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtCognomeAGD, #txtNomeAGD, #txtCartellaAGD");
				var _value = $("#txtDaDataAGD").val() + $("#txtADataAGD").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
				}
			});

			$("#lblResetCampiCampiWKDimessi").click(function () {
				$("#txtCognomeAGD, #txtNomeAGD, #txtCartellaAGD, #txtDaDataAGD, #h-txtDaDataAGD, #h-txtADataAGD, #txtADataAGD").removeAttr("readonly").css({"background":"none"}).val("");
			});

		},

		handlerFiltriWKDimessiSDO : function() {

			// #txtCognomeContattiSdo #txtNomeContattiSdo #txtCartellaSdo #h-txtDataInizioListaContattiSdo #txtDataInizioListaContattiSdo  #h-txtDataFineListaContattiSdo #txtDataFineListaContattiSdo
			$("#txtCartellaSdo").off("keyup").on("keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtCognomeContattiSdo, #txtNomeContattiSdo, #txtDataInizioListaContattiSdo, #h-txtDataInizioListaContattiSdo, #h-txtDataFineListaContattiSdo, #txtDataFineListaContattiSdo");
				var _value = $("#txtCartellaSdo").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
				}
			});

			$("#txtCognomeContattiSdo, #txtNomeContattiSdo").off("keyup").on("keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtCartellaSdo, #h-txtDataInizioListaContattiSdo, #txtDataInizioListaContattiSdo, #h-txtDataFineListaContattiSdo, #txtDataFineListaContattiSdo");
				var _value = $("#txtCognomeContattiSdo").val() + $("#txtNomeContattiSdo").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
				}
			});

			$("#txtDataInizioListaContattiSdo, #txtDataFineListaContattiSdo").off("keyup").on("change input paste keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtCognomeContattiSdo, #txtNomeContattiSdo, #txtCartellaSdo");
				var _value = $("#txtDataInizioListaContattiSdo").val() + $("#txtDataFineListaContattiSdo").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
				}
			});

			$("#lblResetCampiCampiWKDimessiSDO").click(function () {
				$("#txtCognomeContattiSdo, #txtNomeContattiSdo, #txtCartellaSdo, #h-txtDataInizioListaContattiSdo, #txtDataInizioListaContattiSdo, #h-txtDataFineListaContattiSdo, #txtDataFineListaContattiSdo").removeAttr("readonly").css({"background":"none"}).val("");
			});

		}
};