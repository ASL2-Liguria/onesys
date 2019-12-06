/**
 * User: matteopi
 * Date: 04/02/14
 * Time: 11.42
 *
 * 20141030 - alessandro.arrighi - Modifica dei campi Obbligatori. Implementazione Gestione Neonato (fino a 30 GG).
 * 20150201 - alessandro.arrighi - Trasformazione Campi ASL in AUTOCOMPLETE.
 * 20150204 - alessandro.arrighi - Gestione Manuale Codice STP ed ENI.
 * 20150205 - alessandro.arrighi - Gestione ASL Assistenza e rispettivo codice regione.
 */

var paz_sconosciuto;
var stato_pagina;
var iden_anagrafica;
var _CHECK_PRE_RICOVERO = false;
var _VALIDATOR;


jQuery(document).ready(function () {

	paz_sconosciuto=$("#PAZ_SCONOSCIUTO").val()=='S'?true:false;
	stato_pagina = $("#STATO_PAGINA").val();
	iden_anagrafica = $("#IDEN_ANAG").val();

	// Se l'apertura della pagina arriva da un controllo dell'anagrafica per successivo ricovero applico un validator differente
    if (typeof $("#CHECK_PRE_RICOVERO").val() !== 'undefined'){
    	_CHECK_PRE_RICOVERO = $("#CHECK_PRE_RICOVERO").val() == 'S' ? true : false;
    }

	if (paz_sconosciuto){
    	_VALIDATOR="V_ADT_INS_ANAG_SCONOSCIUTO";
    }
    else{
    	 _VALIDATOR = _CHECK_PRE_RICOVERO ? "V_ADT_INS_ANAG_PRE_RICOVERO" : "V_ADT_INS_ANAG";
    }

	NS_ANAGRAFICA.init();
	NS_ANAGRAFICA.event();
	NS_FENIX_SCHEDA.registra = NS_ANAGRAFICA.registra;
});

var NS_ANAGRAFICA = {
		schedaAnagrafica:'S',
		idenContatto:null,
		init : function () {

			NS_ANAGRAFICA.setCssTab();

			if (paz_sconosciuto)
			{
				// compila cognome nome e codice fiscale
				/*var procedura="GETPROGPAZIENTESCONOSCIUTO";
				var anno=moment().format('YYYY');
				var params={'pAnno': anno};
				dwr.engine.setAsync(false);

				toolKitDB.executeFunctionDatasource(procedura,"ADT",params,function(resp){
					$("#txtCognome").val("SCONOSCIUTO");
					var prog=("000"+resp.p_result).slice(-3);
					$("#txtNome").val("ASSISTITO_"+anno+'_'+prog);
					$("#txtCodFisc").val("ONESYSADT"+anno+prog);
					$("#txtDataNasc").val(moment().format('DD/MM/YYYY'));
				});
				dwr.engine.setAsync(true);*/
				NS_ANAGRAFICA.prepareToPazUnknow();
			};

			NS_ANAGRAFICA.addPlusButton();
			NS_ANAGRAFICA.valorizeCittadinanza();
			NS_ANAGRAFICA.hideCodSTP('N');
			NS_ANAGRAFICA.hideCodGIU('N');
			NS_ANAGRAFICA.hideCodENI('N');

			top.NS_CONSOLEJS.addLogger({name:'schedaAnagrafica',console:0});
			window.logger = top.NS_CONSOLEJS.loggers['schedaAnagrafica'];
			//document.getElementById('txtCodFisc').setAttribute("onchange","NS_ANAGRAFICA.Coerenza_Cod_Fisc_Anag()"); //cambio attributo a campo codice fiscale per verifica corretezza

			document.getElementById('txtDataNasc').setAttribute("onchange","NS_ANAGRAFICA.setNeonato();"); //setto attributo a campo data in modo che verifichi l'inserimento di un neonato

			NS_FENIX_SCHEDA.addFieldsValidator({config : _VALIDATOR});

			NS_ANAGRAFICA.getContattiAperti(iden_anagrafica);

			//bug 7318 medico di base readonly
			$("#txtMedBase").attr("disabled","disabled");
			$("#lblMedBase").off("click");
		},

		event : function () {

			if (stato_pagina === "E") {
				NS_ANAGRAFICA.getstatus_Codestanagid4(); //verifica ID4 valroizzato e blocca eventuali campi
			}

			// compatibilita' IE
			$(document).on("click",".plus", function (e) {
				//e.preventDefault();  // if you want to prevent default form submission
				NS_ANAGRAFICA.hideCittadinanza();
			});

			$(document).on("change","#h-radSTP", function (e) {
				NS_ANAGRAFICA.hideCodSTP(this.value);
			});

			$(document).on("change","#h-radENI", function (e) {
				NS_ANAGRAFICA.hideCodENI(this.value);
			});

			$(document).on("change","#h-radGIU", function (e) {
				NS_ANAGRAFICA.hideCodGIU(this.value);
			});

			$(".butStampaDati").on("click",function(){
				NS_ANAGRAFICA.stampaDatiAnagrafici();
			});

			if (home.basePermission.hasOwnProperty('GENERA_CF'))
			{
				$('#lblCodFisc').text( "Codice Fiscale (Click per calcolare)");
				$('#lblCodFisc').on("click", function(){NS_ANAGRAFICA.setCod_Fisc();});
			}

			$("#txtCognome, #txtNome, #txtLuogoNasc, #txtDataNasc, #h-radSesso").on("change", function(){

				 var cognome = $("#txtCognome").val();
				 var nome = $("#txtNome").val();
				 var dataNascita = $("#h-txtDataNasc").val();
				 var comuneNascita = $('#txtLuogoNasc').attr("data-c-codice_comune");
				 var sesso = $("#h-radSesso").val();

				 if (cognome.length > 0 && nome.length > 0 && dataNascita.length > 0 && comuneNascita != null && sesso != null && home.basePermission.hasOwnProperty('GENERA_CF'))
				 {
					 NS_ANAGRAFICA.setCod_Fisc();
				 }

			});

			$("#txtCodFisc").on("change",NS_ANAGRAFICA.Coerenza_Cod_Fisc_Anag);
			$("#txtcodSTP").on("blur", function () {
				$(this).val($(this).val().toUpperCase());

			});
			$("#txtcodENI").on("blur", function () {
				$(this).val($(this).val().toUpperCase());

			});
			$("#txtcodGIU").on("blur", function () {
				$(this).val($(this).val().toUpperCase());

			});


			$("#txtDataDec").on({change:function(){
				NS_ANAGRAFICA.checkDataMorte($(this).val(), $("#txtDataNasc").val(), this.getAttribute("id"));
			},blur : function(){
				NS_ANAGRAFICA.checkDataMorte($(this).val(),$("#txtDataNasc").val(), this.getAttribute("id"));
			}});

			$("#txtDataNasc").on({change:function(){
				NS_ANAGRAFICA.checkDataNascita($(this).val(), this.getAttribute("id"));
			},blur : function(){
				NS_ANAGRAFICA.checkDataNascita($(this).val(), this.getAttribute("id"));
			}});



		},

		checkDataMorte : function(date1, date2, id){
			var msg ="Attenzione valorizzare correttamente la data di decesso : data nascita "+date2 + " data morte "+ date1;
			this.checkData(date1,date2,id, msg);

		},
		checkDataNascita : function (date1, id) {
			var date2 = "01/01/1900";
			var msg = "Attenzione data nascita precedente a " + date2 ;
			this.checkData(date1,date2,id, msg);
		},

		checkData : function(date1, date2, id, msg){

			if(date1 != '' && !DATE_CONTROL.checkBetwen2Date({date1: date1, date2 : date2})){
				home.NOTIFICA.error({message: msg , timeout: 0, title: "Error"});
				$("#"+id).val("");
			}
		},

		setCssTab:function(){
			$("#li-tabCodiciEsterni, #li-tabEsami, #li-tabIndirizzi").hide();
			$("#li-tabAnamnesi").css({"border-top-right-radius" : "6px"});
		},

		prepareToPazUnknow:function(){
			$("#txtTitoloAnag," +
					"#txtCognome, " +
					"#txtNome," +
					"#txtDataNasc," +
					"#radSesso, " +
					"#txtLuogoNasc, " +
					"#txtCodFisc, " +
					"#txtIDpaz," +
					"#txtStatoCivile," +
					"#txtTitoloStudio," +
					"#txtCodiceRegioneAss," +
					"#txtCitt," +
					"#txtMedBase," +
					"#txtUSLAss," +
					"#txtProf," +
					"#txtMail," +
			"#txtDataDec").attr("disabled","disabled");
			/*
			$("#txtNome").text("ASSISTITO");
			$("#txtCognome").text("SCONOSCIUTO");
			$("#txtCodFisc").text();
                     */
		},

		registra:function(){

			var codice_fiscale = $("#txtCodFisc").val();

			if(stato_pagina == 'I') {
				var db = $.NS_DB.getTool({setup_default: {datasource: 'WHALE'}});

				var params = {
					"COD_FISC": {t:'V', v: codice_fiscale}
				};

				var xhr = db.select(
					{
						id       : 'DATI.CHECKEXISTANAG',
						parameter: params
					});

				//controlla se in anagrafica c'è già un codice fiscale uguale

				xhr.done(function (data, textStatus, jqXHR) {

					if(data.result[0].HASCODFISC == 0) {
						registraDef();
					} else {
						return home.NOTIFICA.error({
							message: "Attenzione codice fiscale gia' presente in anagrafica",
							timeout: 0,
							title  : "Error"
						});

					}
				});
				xhr.fail(function (data, textStatus, jqXHR) {
				 	logger.error(data);
					return home.NOTIFICA.error({
						message: "Attenzione nel controllo codice fiscale",
						timeout: 0,
						title  : "Error"
					});

				});

			} else {
				registraDef();
			}

			function registraDef () {




				var STP = $("#txtcodSTP").val();
				var ENI = $("#txtcodENI").val();
				var GIUBILEO = $("#txtcodGIU").val();
				var checkENI = new RegExp("^ENI[0-9]{13}$").test(ENI);
				var checkSTP = new RegExp("^STP[0-9]{13}$").test(STP);
				var checkGIU = new RegExp("^GIU[0-9]{13}$").test(GIUBILEO);

				var radSTP = $("#h-radSTP").val();
				var radENI = $("#h-radENI").val();
				var radGIU = $("#h-radGIU").val();

				if(!NS_FENIX_SCHEDA.validateFields()) {
					return false;
				}
				else if($(".tdError").size() > 0) {
					return home.NOTIFICA.error({
						message: "Attenzione valorizzare correttamente tutti i campi obbligatori",
						timeout: 0,
						title  : "Error"
					});
				}
				else if(!((checkENI || ENI == '' ) && (checkSTP || STP == '' ) && (checkGIU || GIUBILEO == '' ))) {
					return home.NOTIFICA.error({
						message: "Attenzione Errore nella valorizazione del codice ENI/STP/GIUBILEO",
						timeout: 0,
						title  : "Error"
					});
				}
				else {

					/* gestione cittadinanza */
					var XML = NS_NODE.createSimpleNode("prova");
					var cittadinanza = NS_NODE.createSimpleNode("CITTADINANZA");
					var dati = NS_NODE.createSimpleNode("DATI");

					$(".AUTOCOMPLETECITTADINANZA").each(function () {
						var value = $(this).find('input[type="text"]').val();
						value = value.replace("'", "\'");

						//alert(value)
						if(value != '') {
							dati.appendChild(NS_NODE.createNode("ITEM", $(this).find('input[type="text"]').attr("data-c-value"), "DESCR", value))
						}

					});

					cittadinanza.appendChild(dati);

					var REQUEST = NS_NODE.createSimpleNode("REQUEST");

					var sesso = $("#h-radSesso").val();
					sesso = sesso == 'U' ? 'X' : sesso;
					var data = $("#h-txtDataNasc").val() != '' ? $("#h-txtDataNasc").val() : moment().format('YYYYMMDD');
					var nome = $('#txtNome').val().toUpperCase();
					var cognome = $('#txtCognome').val().toUpperCase();
					var comune_nascita = $("#h-txtLuogoNasc").val();

					REQUEST.appendChild(NS_NODE.createNodeWithText("MANAGE_DELETED", "S"));
					REQUEST.appendChild(NS_NODE.createSimpleNode("MITTENTE"));
					REQUEST.appendChild(NS_NODE.createNodeWithText("DATI_SENS", "S"));

					if(stato_pagina == 'E') {

						REQUEST.appendChild(NS_NODE.createNodeWithText("METODO", "MODIFICA"));
					} else {
						REQUEST.appendChild(NS_NODE.createNodeWithText("METODO", "INSERIMENTO"));
					}

					var src = NS_NODE.createNodeWithAttr("SEARCH_KEY_LIST", "max_iden", "true");
					if(stato_pagina == 'E') {
						src.appendChild(NS_NODE.createNode("SEARCH_KEY", iden_anagrafica, "key", "IDEN"));
					}
					else {
						src.appendChild(NS_NODE.createNode("SEARCH_KEY", codice_fiscale, "key", "COD_FISC"));
						src.appendChild(NS_NODE.createNode("SEARCH_KEY", sesso, "key", "SESSO"));
						src.appendChild(NS_NODE.createNode("SEARCH_KEY", data, "key", "DATA"));
						src.appendChild(NS_NODE.createNode("SEARCH_KEY", cognome, "key", "COGN"));
						src.appendChild(NS_NODE.createNode("SEARCH_KEY", nome, "key", "NOME"));
					}

					REQUEST.appendChild(src);

					var src2 = NS_NODE.createNodeWithAttr("SEARCH_KEY_LIST", "max_iden", "true");

					src2.appendChild(NS_NODE.createNode("SEARCH_KEY", codice_fiscale, "key", "COD_FISC"));
					src2.appendChild(NS_NODE.createNode("SEARCH_KEY", data, "key", "DATA"));
					src2.appendChild(NS_NODE.createNode("SEARCH_KEY", cognome, "key", "COGN"));
					src2.appendChild(NS_NODE.createNode("SEARCH_KEY", nome, "key", "NOME"));

					REQUEST.appendChild(src2);

					var paziente = NS_NODE.createSimpleNode("PAZIENTE");
					paziente.appendChild(cittadinanza);
					paziente.appendChild(NS_NODE.createNodeWithText("LIVELLO_ISTRUZIONE", $("#h-txtTitoloStudio").val()))

					var identificativiRemoti = NS_NODE.createSimpleNode("IDENTIFICATIVI_REMOTI");

					paziente.appendChild(identificativiRemoti);
					paziente.appendChild(NS_NODE.createNodeWithText("PROFESSIONE", $("#h-txtProf").val()));
					paziente.appendChild(NS_NODE.createNodeWithText("STATO_CIVILE", $("#h-txtStatoCivile").val()));

					if(stato_pagina == 'E') {
						paziente.appendChild(NS_NODE.createNodeWithText("ID_RIS", iden_anagrafica));
					} else {
						paziente.appendChild(NS_NODE.createSimpleNode("ID_RIS"));
					}

					paziente.appendChild(NS_NODE.createSimpleNode("ID_PAZ_DICOM"));
					paziente.appendChild(NS_NODE.createNodeWithText("COGNOME", cognome));
					paziente.appendChild(NS_NODE.createNodeWithText("NOME", nome));
					paziente.appendChild(NS_NODE.createNodeWithText("SESSO", sesso));
					paziente.appendChild(NS_NODE.createNodeWithText("DATA_NASCITA", data));
					paziente.appendChild(NS_NODE.createNodeWithText("COMUNE_NASCITA", comune_nascita));
					paziente.appendChild(NS_NODE.createNodeWithText("CODICE_FISCALE", codice_fiscale));

					//parte relativa alla residenza
					var residenza = NS_NODE.createSimpleNode("RESIDENZA");

					residenza.appendChild(NS_NODE.createNodeWithText("INDIRIZZO", $("#txtIndRes").val()));
					residenza.appendChild(NS_NODE.createNodeWithText("CIVICO", $("#txtCivRes").val()));
					residenza.appendChild(NS_NODE.createNodeWithText("COMUNE", $("#h-txtComuneRes").val()));
					residenza.appendChild(NS_NODE.createNodeWithText("PROVINCIA", $("#txtProvRes").val()));
					residenza.appendChild(NS_NODE.createNodeWithText("CAP", $("#txtCAPRes").val()));
					residenza.appendChild(NS_NODE.createNodeWithText("TELEFONO", $("#txtTelRes").val()));
					paziente.appendChild(residenza);

					//parte relativa al domicilio
					var domicilio = NS_NODE.createSimpleNode("DOMICILIO");
					domicilio.appendChild(NS_NODE.createNodeWithText("INDIRIZZO", $("#txtIndDom").val()));
					domicilio.appendChild(NS_NODE.createNodeWithText("CIVICO", $("#txtCivDom").val()));
					domicilio.appendChild(NS_NODE.createNodeWithText("COMUNE", $("#h-txtComuneDom").val()));
					domicilio.appendChild(NS_NODE.createNodeWithText("PROVINCIA", $("#txtProvDom").val()));
					domicilio.appendChild(NS_NODE.createNodeWithText("CAP", $("#txtCAPDom").val()));
					domicilio.appendChild(NS_NODE.createNodeWithText("TELEFONO", $("#txtTelDom").val()));
					paziente.appendChild(domicilio);

					//parte tessera sanitaria
					var tessera_sanitaria = NS_NODE.createSimpleNode("TESSERA_SANITARIA");
					tessera_sanitaria.appendChild(NS_NODE.createNodeWithText("NUMERO", $("#txtTessera").val()));
					tessera_sanitaria.appendChild(NS_NODE.createSimpleNode("CODICE_REGIONE"));
					tessera_sanitaria.appendChild(NS_NODE.createNodeWithText("SCADENZA", $("#h-txtScadenzaTessera").val()));
					paziente.appendChild(tessera_sanitaria);

					paziente.appendChild(NS_NODE.createNodeWithText("CUSL_RES", $("#h-txtASLResidenza").val()));
					paziente.appendChild(NS_NODE.createNodeWithText("CODICE_REGIONALE_RES", $("#txtCodiceRegioneRes").val()));

					paziente.appendChild(NS_NODE.createNodeWithText("CODICE_REGIONALE", $("#txtCodiceRegioneAss").val()));
					paziente.appendChild(NS_NODE.createNodeWithText("CUSL", $("#h-txtASLAssistenza").val()));
					paziente.appendChild(NS_NODE.createNodeWithText("CODICE_REGIONALE_DOM", $("#txtCodiceRegioneDom").val()));
					paziente.appendChild(NS_NODE.createNodeWithText("CUSL_DOM", $("#h-txtASLDomicilio").val()));
					paziente.appendChild(NS_NODE.createNodeWithText("MEDICO_BASE", $("#h-txtMedBase").val()));
					paziente.appendChild(NS_NODE.createNodeWithText("ANAMNESI", $("#Anamnesi").val()));
					paziente.appendChild(NS_NODE.createNodeWithText("DATA_MORTE", $("#h-txtDataDec").val()));
					paziente.appendChild(NS_NODE.createSimpleNode("CONSENSO"));
					paziente.appendChild(NS_NODE.createNodeWithText("NAZIONE", $("#h-txtNaz").val()));
					paziente.appendChild(NS_NODE.createNodeWithText("CELLULARE", $("#txtCellPaz").val()));
					paziente.appendChild(NS_NODE.createNodeWithText("EMAIL", $("#txtMail").val()));
					paziente.appendChild(NS_NODE.createNodeWithText("PESO", $("#txtPeso").val()));
					paziente.appendChild(NS_NODE.createNodeWithText("ALTEZZA", $("#txtAltezza").val()));
					paziente.appendChild(NS_NODE.createNodeWithText("NOTE", $("#taNote").val()));
					REQUEST.appendChild(paziente);
					XML.appendChild(REQUEST);

//				new XMLSerializer().serializeToString(XML)// mi ritorna un xml che non va bene allora devo fare sti tapulli qui
					//alert(serializeXmlNode(XML));
//				var xmlString = '<?xml version="1.0" encoding="ISO-8859-1"?>' + XML.innerHTML.toUpperCase().toString();

					var xmlString = serializeXmlNode(XML);
					if(home.baseUser.USERNAME == 'arry') {
						alert(xmlString);
					}
					xmlString = xmlString.replace(/TRUE/g, "true");
					xmlString = xmlString.replace(/FALSE/g, "false");
					xmlString = xmlString.replace(/ KEY/g, " key");
					xmlString = xmlString.replace(/ MAX_IDEN/g, " max_iden");
					xmlString = xmlString.replace(/ POSITION/g, " position");
					xmlString = xmlString.replace(/ SEARCH_ORDER/g, " search_order");
					xmlString = xmlString.replace(/ UPDATE/g, " update");
					xmlString = xmlString.replace(/ SEARCH/g, " search");
					/*non dico la mia vergogna a scrivere le due righe sucessive di codice, all'origine era fatto in maniera umana ma internet explorer ti obbliga a fare del male*/
					xmlString = xmlString.replace("<CITTADINANZA>", "<CITTADINANZA><![CDATA[");
					xmlString = xmlString.replace("</CITTADINANZA>", "]]></CITTADINANZA>");
					//doppio spazio fa l'encoding
					xmlString = xmlString.split("&nbsp;").join(" ");
					xmlString = xmlString.split("&NBSP;").join(" ");

					var scadenzaSTP = $("#h-txtscadcodSTP").val();

					if(STP !== "" && (scadenzaSTP == "" || scadenzaSTP == null)) {
						return home.NOTIFICA.error({
							message: "Valorizzare la Data di Scadenza del Codice STP",
							timeout: 0,
							title  : "Error"
						});
					}

					var scadenzaENI = $("#h-txtscadcodENI").val();

					if(ENI !== "" && (scadenzaENI == "" || scadenzaENI == null)) {
						return home.NOTIFICA.error({
							message: "Valorizzare la Data di Scadenza del Codice ENI",
							timeout: 0,
							title  : "Error"
						});
					}

					var scadenzaGIUBILEO = $("#h-txtscadcodGIU").val();

					if(GIUBILEO !== "" && (scadenzaGIUBILEO == "" || scadenzaGIUBILEO == null)) {
						return home.NOTIFICA.error({
							message: "Valorizzare la Data di Scadenza del Codice GIUBILEO",
							timeout: 0,
							title  : "Error"
						});
					}

					if(radSTP == 'N') {
						STP = '';
						scadenzaSTP = '';
					}
					if(radENI == 'N') {
						ENI = '';
						scadenzaENI = '';
					}
					if(radGIU == 'N') {
						GIUBILEO = '';
						scadenzaGIUBILEO = '';
					}

					// alert(xmlString);
					// logger.debug(xmlString);
					// return;
					$.NS_DB
						.getTool({setup_default: {datasource: 'WHALE'}})
						.call_procedure(
						{
							id       : 'ANAGRAFICA_FROM_FENIX.CALL_ANAG_START_FROM_FENIX',
							parameter: {
								"vXML"             : {t: 'C', v: xmlString},
								p_result           : {t: 'V', d: 'O'},
								'STP'              : {t: 'V', v: STP},
								'SCADENZA_STP'     : {t: 'V', v: scadenzaSTP},
								'ENI'              : {t: 'V', v: ENI},
								'SCADENZA_ENI'     : {t: 'V', v: scadenzaENI},
								'GIUBILEO'         : {t: 'V', v: GIUBILEO},
								'SCADENZA_GIUBILEO': {t: 'V', v: scadenzaGIUBILEO}

							}

						})
						.done(function (data) {
							//alert(data.p_result);
							var xmlResponse = $.parseXML(data.p_result);
							var $xmlResponse = $(xmlResponse);
							var warn = $xmlResponse.find("WARNING").find("DESCRIZIONE").text();
							var err = $xmlResponse.find("ERRORE").has("DESCRIZIONE").text();

							if(err != '') {
								logger.error(err);
								home.NOTIFICA.error({message: err, timeout: 0, title: "Error"});

							} else {

								if(warn != '') {
									logger.error(warn);
									home.NOTIFICA.warning({message: err, timeout: 0, title: "Warning"});
								}

								if($xmlResponse.find("ID_RIS").text() != '') {
									home.NOTIFICA.success({
										message: 'Paziente inserito/modificato in anagrafica',
										timeout: 4,
										title  : 'Success'
									});

									var objdiv = top.$("#iContent").contents().find("#filtroPazienti");
									var txt = objdiv.find("#txtCognome");
									txt.val(cognome);
									txt = objdiv.find("#txtNome");
									txt.val(nome);
									var e = $.Event("keypress", {which: 13});
									txt.trigger(e);
									var params = {'refresh': true}
									if(NS_ANAGRAFICA.idenContatto != null) {
										home.DIALOG.si_no({
											title: "Aggiornamento dati anagrafici in ricovero aperto",
											msg  : "Attenzione: si vuole proseguire con l\'aggiornamento dei dati anagrafici del ricovero aperto per questo paziente?",
											cbkNo: function () {
												NS_FENIX_SCHEDA.chiudi(params);
											},
											cbkSi: function () {
												NS_ANAGRAFICA.setMetadatiAnagrafica();
											}
										});
									}
									else {
										NS_FENIX_SCHEDA.chiudi(params);
									}

								}

							}
						})
						.fail(function (a) {
							logger.error(JSON.stringify(a));
							home.NOTIFICA.error({
								message: 'Errore nel salvataggio anagrafica controllare la console',
								timeout: 6,
								title  : "Error"
							});
						});
				}
			}

		},

		addPlusButton:function(){
			$('.divPlus').each(function(){
				$(this).append(document.createElement('a')).html("<i class='icon-plus-squared plus' title='Aggiungi cittadinanza'>");
			});
		},

		hideCittadinanza:function(){

			var bool = false;

			$(".AUTOCOMPLETECITTADINANZA").each(function(i){
				var td = $(this);
				var tr = td.closest("tr");
				var value = td.find('input[type="text"]').val();
				if(i != 0 && bool){
					tr.hide();
				}else if(value == ''){
					bool = true;
					tr.show();
				}else {
					tr.show();
				}
			});
		},

		hideCittadinanzaInit:function(){

			var bool = false;
			$(".AUTOCOMPLETECITTADINANZA").each(function(i){
				var td = $(this);
				var tr = td.closest("tr");
				var value = td.find('input[type="text"]').val();
				if(i != 0 && bool){
					tr.hide();
				}else if(value == '' && i != 0){
					bool = true;
					tr.hide();
				}else {
					tr.show();

				}
			});
		},

		hideCodSTP:function(v){

			var txt = $("#txtcodSTP");
			var tr = $("#lblcodSTP").closest('tr');
			var txtScad = $("#txtscadcodSTP");
			var trScadenza = txtScad.closest("tr");
			if(v == 'S' || jsonData.STP == 'S'){
				tr.show();
				trScadenza.show();
			}else if(txt.val() == ''|| v=='N'){
				txt.val("");
				tr.hide();
				trScadenza.hide();
				txtScad.val("");
			}
			else
			{
				tr.show();
				trScadenza.show()
			}
		},

		hideCodENI:function(v){

			var txt = $("#txtcodENI");
			var tr = $("#lblcodENI").closest('tr');
			var txtScad = $("#txtscadcodENI");
			var trScadenza = txtScad.closest("tr");

			if(v == 'S' || jsonData.ENI == 'S'){
				tr.show();
				trScadenza.show();
			}else if(txt.val() == ''|| v =='N'){
				txt.val("");
				tr.hide();
				trScadenza.hide();
				txtScad.val("");
			}
			else
			{
				tr.show();
				trScadenza.show()
			}
		},
		hideCodGIU : function (v){

			var txt = $("#txtcodGIU");
			var tr = $("#lblcodGIU").closest('tr');
			var txtScad = $("#txtscadcodGIU");
			var trScadenza = txtScad.closest("tr");

			if(v == 'S' || jsonData.GIU == 'S'){
				tr.show();
				trScadenza.show();
			}else if(txt.val() == ''|| v =='N'){
				txt.val("");
				tr.hide();
				trScadenza.hide();
				txtScad.val("");
			}
			else
			{
				tr.show();
				trScadenza.show()
			}
		},

		valorizeCittadinanza:function(){

			var dati = jsonData.cittadinanza;
			dati = '<DATI>'+dati+'</DATI>';
			var re= /<ITEM DESCR="([A-Z ']*)">([0-9]*)<\/ITEM>/g

			var i = 0;
			while (match = re.exec(dati))
			{
				var descr = match[1];
				var valore =  match[2];
				$("#txtCitt"+i).val(descr).attr({"data-c-value":valore,"data-c-descr":descr});
				$("#h-txtCitt"+i).val(valore);
				i++;
			}

			NS_ANAGRAFICA.hideCittadinanzaInit();

		},

		getstatus_Codestanagid4: function(){

			if($("#ID4").val() != "") //in caso di ID4 null blocca campi
			{
				$("#radSesso").data("RadioBox").disable();
				eval(_VALIDATOR).elements.txtCognome.status = "readonly";
				eval(_VALIDATOR).elements.txtNome.status = "readonly";
				eval(_VALIDATOR).elements.txtDataNasc.status = "readonly";
				eval(_VALIDATOR).elements.txtDataNasc.status = "readonly";
				eval(_VALIDATOR).elements.txtLuogoNasc.status = "readonly";
				eval(_VALIDATOR).elements.txtCodFisc.status = "readonly";
				NS_FENIX_SCHEDA.addFieldsValidator({config : _VALIDATOR});
				document.getElementById('txtDataNasc').setAttribute('disabled','true');
                $('#lblLuogoNasc').off("click");
                $('#lblCodFisc').off('click');
			}
		},

		verificaCodiceFiscaleDefinitivo : function (cfins) {

			if (cfins == '')
				return false;
			if (cfins.length != 16)
				return false;
			var cf = cfins.toUpperCase();
			var cfReg = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{2}(\d|[L-V])[A-Z]$/;
			if (!cfReg.test(cf))
				return false;
			var set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
			var s = 0;
			for (i = 1; i <= 13; i += 2)
				s += setpari.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
			for (i = 0; i <= 14; i += 2)
				s += setdisp.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
			if (s % 26 != cf.charCodeAt(15) - 'A'.charCodeAt(0))
				return false;
			return true;
		},


		calcola_cfs : function(cognome, nome, datanascita, sesso, provincia) {
			//alert("Cognome: "+cognome+"\nNome: "+nome+"\nSesso: "+sesso+"\nData di nascita: "+datanascita+"\nProvincia :"+provincia);
			// Attenzione, per utilizzo datanascita deve essere: gg/mm/aaaa
			//if (cognome == '' || nome == '' || datanascita == '' || sesso == '' || provincia == '')	return "Dati mancanti";

			if (cognome == '') {
				return "Cognome mancante";
			}
			if (nome == '') {
				return "Nome mancante";
			}
			if (sesso == '' || sesso == 'U') {
				return "Sesso mancante";
			}
			if (provincia == null) {
				return "Luogo di nascita mancante";
			}
			if (datanascita == '') {
				return "Data di nascita mancante";
			}

			//Ricavo il cognome(123)
			cognome = cognome.toUpperCase();
			vocali = "";
			consonanti = "";
			l = cognome.length;

			var a = "AEIOU";
			var b = "BCDFGHJKLMNPQRSTVWXYZ";

			for (var i = 0; i < l; i++)
			{
				if (a.search(cognome.substr(i, 1)) != -1) {
					vocali = vocali + cognome.substr(i, 1);
				}
				if (b.search(cognome.substr(i, 1)) != -1) {
					consonanti = consonanti + cognome.substr(i, 1);
				}
				if (consonanti.length == 3) {
					break;
				}
			}

			if (consonanti.length < 3) {
				consonanti = consonanti + vocali.slice(0, (3 - consonanti.length)); //consonanti=consonanti+vocali.substr(0, (3 - consonanti.length));
			}

			if (consonanti.length < 3) {
				var appo = consonanti + 'XXX';
				consonanti = appo.substr(0, 3);
			}

			cfs = consonanti;

			//Ricavo il nome(456)

			nome = nome.toUpperCase();
			vocali = "";
			consonanti = "";
			l = nome.length;

			for (i = 0; i < l; i++)
			{
				if (a.search(nome.substr(i, 1)) != -1) {
					vocali = vocali + nome.substr(i, 1);
				}
				if (b.search(nome.substr(i, 1)) != -1) {
					consonanti = consonanti + nome.substr(i, 1);
				}
			}

			if ((consonanti.length > 4) || (consonanti.length == 4)) {
				consonanti = consonanti.slice(0, 1) + consonanti.substr(2, 2);
			}

			if (consonanti.length < 4) {
				covo = consonanti + vocali;
				consonanti = covo.slice(0, 3);

				if (consonanti.length < 3) {
					var appo = consonanti + 'XXX';
					consonanti = appo.substr(0, 3);
				}
			}

			cfs = cfs + consonanti;
			//Anno di nascita(78)

			cfs = cfs + datanascita.slice(8, 10);
			//Mese di nascita(9)

			a = "ABCDEHLMPRST";
			cfs = cfs + a.substr(datanascita.slice(3, 5) - 1, 1);
			//Giorno nascita(0A)

			if (sesso == "F") {
				cfs = cfs + (parseFloat(datanascita.slice(0, 2)) + 40);
			} else {
				cfs = cfs + datanascita.slice(0, 2);
			}
			//Località di nascita(BCDE)

			cfs = cfs + provincia;

			//Ultima lettera(F)
			//Controllo caratteri pari

			tempnum = 0;
			a = "B1A0KKPPLLC2QQD3RRE4VVOOSSF5TTG6UUH7MMI8NNJ9WWZZYYXX";
			b = "A0B1C2D3E4F5G6H7I8J9KKLLMMNNOOPPQQRRSSTTUUVVWWXXYYZZ";
			cicla = 1;
			i = 0;

			while (cicla == 1) //for(i=0;i<15;i++)
			{
				//Dispari
				apponum = a.search(cfs.substr(i, 1)) + 1;
				tempnum = tempnum + ((apponum - 1) & 32766) / 2;
				//alert("dispari "+i+"  a: "+apponum+"  t: "+tempnum);
				i++;
				if (i > 13) {
					cicla = 0;
				}
				//Pari
				apponum = b.search(cfs.substr(i, 1)) + 1;
				tempnum = tempnum + ((apponum - 1) & 32766) / 2;
				//alert("pari "+i+"  a: "+apponum+"  t: "+tempnum);
				i++;
			}
			tempnum = tempnum % 26;
			a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			cfs = cfs + a.substr(tempnum, 1);

			return (cfs);
		},


		getCod_Fisc : function()
		{
			var cognome = document.getElementById('txtCognome').value;
			var nome = document.getElementById('txtNome').value;
			var datanascita = document.getElementById('txtDataNasc').value;
			var sesso = document.getElementById('h-radSesso').value;
			var codluogonascita = $('#hCodComNasc').val();

			if(codluogonascita == '')
			{
				//in caso di nuovo paziente hdcomnas risulta nullo, recupero valore da tag generato
				codluogonascita = $('#txtLuogoNasc').attr("data-c-codice_comune");
			}

			logger.debug('luogo nascita -> ' + codluogonascita)
			var cfs= NS_ANAGRAFICA.calcola_cfs(cognome, nome, datanascita, sesso, codluogonascita);
			return cfs;
		},

		setCod_Fisc : function(){
			var cfs = NS_ANAGRAFICA.getCod_Fisc();
			document.getElementById('txtCodFisc').value=cfs;
			document.getElementById('txtCodFisc').setAttribute("class", "tdObb");
		},

		setNeonato : function(){

			var dn = moment($('#h-txtDataNasc').val(),'YYYYMMDD');
			var now = moment();
			var _NEONATO = now.diff(dn,'day') <= 30 ? true : false;

			if (_NEONATO)
			{
				document.getElementById('lblCodFisc').innerHTML = "Codice Fiscale (Click per calcolare)";
				document.getElementById('lblCodFisc').setAttribute("onclick", "NS_ANAGRAFICA.setCod_Fisc()");

			}
			else
			{
				document.getElementById('lblCodFisc').removeAttribute("onclick");
				document.getElementById('lblCodFisc').innerHTML = "Codice Fiscale";
			}

		},

		Coerenza_Cod_Fisc_Anag : function(){

			var codEstero = "";
			var codFisc = $("#txtCodFisc");
			var codluogonascita = document.getElementById('hCodComNasc').getAttribute("value");

			if(codluogonascita==''){
				// in caso di nuovo paziente hdcomnas risulta nullo, recupero valore da tag generato
				codluogonascita = document.getElementById('txtLuogoNasc').getAttribute("data-c-codice_comune");
			}

			//gestisco eccezione di charat = null
			try {
			    codEstero = codluogonascita.charAt(0);
			}
			catch(err) {
				home.NOTIFICA.error({message: 'Il comune inserito non è valido, riprovare', timeout: 4, title: "Error"});
			}
			var correct=NS_ANAGRAFICA.verificaCodiceFiscaleDefinitivo(document.getElementById('txtCodFisc').value);
			//se non è corretto sintatticamente non faccio andare avanti l'esecuzione
			if(!correct)
			{
				$("#txtCodFisc").removeClass("tdObb").addClass("tdError");
				home.NOTIFICA.error({message: 'Formato Codice Fiscale ERRATO o NON VALIDO', timeout: 4, title: "Verifica CODICE FISCALE"});
				return;
			}

			var cfs=NS_ANAGRAFICA.getCod_Fisc();

			if( cfs != document.getElementById('txtCodFisc').value)
			{
				home.DIALOG.si_no({
	        		title: "Verifica Esattezza Codice Fiscale",
	        		msg:"Il codice fiscale inserito potrebbe essere errato! Confermi la validità e prosegui con la modifica dell\'anagrafica?",
	        		cbkNo:function(){ document.getElementById('txtCodFisc').value =''; },
	        		cbkSi: function(){$("#txtCodFisc").removeClass("tdError"); }
	        	});
				home.NOTIFICA.error({message: 'Il Codice Fiscale potrebbe essere errato', timeout: 6, title: "Verifica CODICE FISCALE"});
			} else{
				if(codFisc.hasClass("tdError")){
					$("#txtCodFisc").removeClass("tdError").addClass("tdObb");
				}

			}

		},

		stampaDatiAnagrafici:function(){
			var _par = {};
	        _par.PRINT_DIRECTORY = 'ANAGRAFICA';
	        _par.PRINT_REPORT = 'DATI_ANAGRAFICI';
	        _par.PRINT_PROMPT = "&promptIDEN_ANAGRAFICA=" + $("#IDEN_ANAG").val();
	        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

	        home.NS_FENIX_PRINT.caricaDocumento(_par);
	        home.NS_FENIX_PRINT.apri(_par);
		},

		getCapRegioneProvincia:function(data,type){

			switch (type) {
			case 'DOMICILIO':
				NS_ANAGRAFICA.valorizeCapRegioneProvinciaDomicilio(data);
				break;
			case 'RESIDENZA' :
				NS_ANAGRAFICA.valorizeCapRegioneProvinciaResidenza(data);
				break;
			default :
				logger.error("Tipo di dato non riconosciuto scheda anagrafica.js riga 802");
			break;
			}
			/*var db = $.NS_DB.getTool({setup_default: {datasource: 'ADT'}});
			var params = {"IDEN_COMUNE" : {v:data.VALUE, t:'V'}};

			var xhr = db.select(
					{
						id       : 'ADT.Q_CAP_REGIONE_PROVINCIA_BY_COMUNE',
						parameter: params
					});

			xhr.done(function (data, textStatus, jqXHR) {

				//{"result":[{"CODICE_REGIONE":"090","CODICE_PROVINCIA":"SI","CAP":"53021"}]}
				var resp = data.result[0];

				switch (type) {
				case 'DOMICILIO':
					NS_ANAGRAFICA.valorizeCapRegioneProvinciaDomicilio(resp);
					break;
				case 'RESIDENZA' :
					NS_ANAGRAFICA.valorizeCapRegioneProvinciaResidenza(resp);
					break;
				default :
					logger.error("Tipo di dato non riconosciuto schedaanagrafica.js riga 743");
				break;
				}

			});

			xhr.fail(function (response) {

				logger.error(JSON.stringify(response));
				home.NOTIFICA.warning({title: "Attenzione", message: 'Errore nel valorizzare cap provincia e codice regione', timeout: 6});
			});*/
		},

		valorizeCapRegioneProvinciaDomicilio:function(data){

			$("#txtCodiceRegioneDom").val(data.CODICE_REGIONE);
			$("#txtCAPDom").val(data.CAP);
			//$("#txtProvDom").val(data.CODICE_PROVINCIA);
			$("#txtProvDom").val(data.PROVINCIA); // da autocomplete
			if (data.CODICE_USL!=null && data.ASL_DESCR!=null){
				$("#txtASLDomicilio").val(data.ASL_DESCR);
				$("#txtASLDomicilio").attr("data-c-value",data.CODICE_USL);
				$("#txtASLDomicilio").attr("data-c-regione_codice",data.CODICE_REGIONE);
				$("#h-txtASLDomicilio").val(data.CODICE_USL);
			}
		},

		valorizeCapRegioneProvinciaResidenza:function(data){
			//aggiungo il .trigger("change") perchè il validator se lo valorizzi così nn vede il change
			$("#txtCAPRes").val(data.CAP).trigger("change");
			//$("#txtProvRes").val(data.CODICE_PROVINCIA);
			$("#txtProvRes").val(data.PROVINCIA).trigger("change");
			$("#txtCodiceRegioneRes").val(data.CODICE_REGIONE).trigger("change");;
			if (data.CODICE_USL!=null && data.ASL_DESCR!=null){
				$("#txtASLResidenza").val(data.ASL_DESCR).trigger("change");
				$("#txtASLResidenza").attr("data-c-value",data.CODICE_USL);
				$("#txtASLResidenza").attr("data-c-regione_codice",data.CODICE_REGIONE);
				$("#h-txtASLResidenza").val(data.CODICE_USL).trigger("change");
			}
		},

		getContattiAperti:function(idenAnag){
			var db = $.NS_DB.getTool({setup_default: {datasource: 'ADT'}});
			var params = {"idenAnag" : {v:idenAnag, t:'N'}};
			var xhr = db.select(
					{
						id       : 'ADT.Q_CONTATTI_APERTI',
						parameter: params
					});

			xhr.done(function (data, textStatus, jqXHR) {
				if (data.result.length>0){
					// ci sono ricoveri aperti
					NS_ANAGRAFICA.idenContatto=data.result[0].IDEN_CONTATTO;
				}
			});

			xhr.fail(function (response) {
				logger.error(JSON.stringify(response));
				home.NOTIFICA.warning({title: "Attenzione", message: 'Errore in lettura ricoveri aperti', timeout: 6});
			});
		},
		setMetadatiAnagrafica:function(){
			var  _json = NS_CONTATTO_METHODS.getContattoById(NS_ANAGRAFICA.idenContatto);

			_json.mapMetadatiString['ANAG_COGNOME'] = $("#txtCognome").val();
			_json.mapMetadatiString['ANAG_NOME'] = $("#txtNome").val();
			_json.mapMetadatiString['ANAG_SESSO'] = $("#h-radSesso").val();
			_json.mapMetadatiString['ANAG_DATA_NASCITA'] = $("#h-txtDataNasc").val();
			_json.mapMetadatiString['ANAG_COMUNE_NASC'] = $('#h-txtLuogoNasc').val();
			_json.mapMetadatiString['ANAG_COD_FISC'] = $("#txtCodFisc").val();
			if ($("#txtCodSTP").val()!=''){
				_json.mapMetadatiString['STP'] = $("#txtCodSTP").val();
				_json.mapMetadatiString['SCADENZA_STP'] = $("#txtScadCodSTP").val();
			}
			else{
				_json.mapMetadatiString['STP'] = '';
				_json.mapMetadatiString['SCADENZA_STP'] = '';
			}
			if ($("#txtCodENI").val()!=''){
				_json.mapMetadatiString['ENI'] = $("#txtCodENI").val();
				_json.mapMetadatiString['SCADENZA_ENI'] = $("#txtScadCodENI").val();
			}
			else{
				_json.mapMetadatiString['ENI'] = '';
				_json.mapMetadatiString['SCADENZA_ENI'] = '';
			}
			var giubileo = $("#txtCodGIU").val();
			if (giubileo!=''){
				_json.mapMetadatiString['GIUBILEO'] = giubileo;
				_json.mapMetadatiString['SCADENZA_GIUBILEO'] = $("#txtScadCodGIU").val();
			}
			else{
				_json.mapMetadatiString['GIUBILEO'] = '';
				_json.mapMetadatiString['SCADENZA_GIUBILEO'] = '';
			}
			_json.mapMetadatiCodifiche['STATO_CIVILE']= {codice:null,id: $("#h-txtStatoCivile").val()};
			 _json.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TITOLO_STUDIO']= {codice:null,id: $("#h-txtTitoloStudio").val()};
			 _json.mapMetadatiString['ANAG_CITTADINANZA_ID'] =$("#h-txtCitt0").val();
			 _json.mapMetadatiString['ANAG_CITTADINANZA_DESCR'] =$("#txtCitt0").val();
			 _json.mapMetadatiString['ANAG_TESSERA_SANITARIA'] =$("#txtTessera").val();
			 _json.mapMetadatiString['ANAG_TESSERA_SANITARIA_SCADENZA'] =$("#h-txtScadenzaTessera").val();
			 // residenza
			 _json.mapMetadatiString['ANAG_RES_CODICE_ISTAT'] =$("#h-txtComuneRes").val();
			 _json.mapMetadatiString['ANAG_RES_REGIONE'] =$("#txtCodiceRegioneRes").val();
			 _json.mapMetadatiString['ANAG_RES_ASL'] =$("#h-txtASLResidenza").val();
			 _json.mapMetadatiString['ANAG_RES_CAP'] =$("#txtCAPRes").val();
			 _json.mapMetadatiString['ANAG_RES_PROV'] =$("#txtProvRes").val();
			 _json.mapMetadatiString['ANAG_RES_INDIRIZZO'] =$("#txtIndRes").val();
			 _json.mapMetadatiString['ANAG_TELEFONO'] =$("#txtTelRes").val();
			 //alert(JSON.stringify(_json));
			 var p = {"contatto" :  _json, "hl7Event" : "A08", "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Modifica Dati Anagrafici in Ricovero Avvenuta con Successo", "errorMessage" : "Errore Durante Modifica Ricovero"}, "cbkSuccess" : function(){NS_FENIX_SCHEDA.chiudi({'refresh':true});}};
		    NS_CONTATTO_METHODS.updatePatientInformation(p);
		}
};

var  NS_NODE = {
		createNodeWithAttr:function(name,attr,value){
			return NS_NODE.createNode(name,null,attr,value);
		},
		createNodeWithText:function(name,text){
			return NS_NODE.createNode(name,text,null,null);
		},
		createSimpleNode:function(name){
			return NS_NODE.createNode(name,null,null,null)
		},

		createNode:function(name,text,attr,value){
			var node =  document.createElement(name.toUpperCase());
			if(text!=null){node.innerText = text;}
			if(attr!=null){node.setAttribute(attr,value)};
			return node;
		}
};


function serializeXmlNode(xmlNode) {

	if (typeof window.XMLSerializer != "undefined") {
		//IE 9 > , mozzilla, chrome
		return '<?xml version="1.0" encoding="ISO-8859-1"?>' + xmlNode.innerHTML.toUpperCase().toString();
	} else {
		return $(xmlNode).html();

	}
}
