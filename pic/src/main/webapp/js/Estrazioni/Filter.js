$(document).ready(function () {
	NS_STATISTICA.init();
});

var NS_FILTRI_STATISTICHE = {

	Operators : {

		codici : ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'bw', 'in', 'ew', 'cn'],
		label : ['equal', 'not equal', 'less', 'less or equal', 'greater', 'greater or equal', 'begins with', 'is in', 'ends with', 'contains'],
		sql : ["=","<>","<","<=",">",">=","LIKE","IN","LIKE","LIKE"]
	},

	init : function(){

		logger.debug("Statistica - Fitro - Init");

		NS_FILTRI_STATISTICHE.setEvents();
		NS_FILTRI_STATISTICHE.creaFormEstrazione();
		NS_FILTRI_STATISTICHE.popolaFiltri();

		logger.debug("Statistica - Fitro - End Init");
	},

	/**
	 * Funzione che valorizza gli eventi per i button presenti nella pagina.
	 * Prima dell'assgnazione ogni button viene resettato tramite jQuery off
	 * in quanto quando viene premuto il tasto applica vengono disabilitato
	 * il button applica per evitare ricerce compulsive.
	 */
	setEvents : function(){

		$("#cmbFiltro").off("change").on("change",function(){
			NS_FILTRI_STATISTICHE.handleFiltro.call(this, (NS_FILTRI_STATISTICHE.getFiltroDetail($(this).find("option:selected").attr("id-filtro"))));
		});

		$("#cmbFiltriSalvati").off("change").on("change",function(){
			NS_FILTRI_STATISTICHE.caricaFiltriSalvati($(this).find("option:selected").attr("data-campi"));

			if ($(this).val() !== null && $(this).val() !== "" ) {
				NS_FILTRI_STATISTICHE.showHideButtonDeleteSavedFilter(true);
			} else {
				NS_FILTRI_STATISTICHE.showHideButtonDeleteSavedFilter(false);
			}
		});

		$("#butDeleteSavedFilter").off('click').on('click',function(){
			var filter = $("#cmbFiltriSalvati").find("option:selected");
			// idFilter, idPersonalFilter, concatFieldsFilter
			NS_FILTRI_STATISTICHE.removeSavedFilter(filter.attr("data-value"),filter.attr("data-descr"));
		});

		$("#butApplicaFiltri").off("click").on("click",function(){

			// disabilito il button applica
			$(this).off("click");

			// Mostro il velo di attesa (NON rimovibile tramite il click)
			NS_LOADING.showLoading({"timeout" : 0, "testo" : "Elaborazione Statistica", "loadingclick" : function(){return;}});

			if (NS_FILTRI_STATISTICHE.checkFiltri()){
				NS_GRIGLIA.load(NS_FILTRI_STATISTICHE.getWhereCondition());
			} else {
				NS_LOADING.hideLoading(); NS_FILTRI_STATISTICHE.setEvents();
			};

		});

		$("#butSalvaFiltro").off("click").on("click",function(){
			NS_FILTRI_STATISTICHE.salvaFiltro();
		});

	},

	/**
	 * Funzione generica che passandogli l'ID del filtro
	 * recupera l'oggetto completo dal file di configurazione.
	 *
	 * @param pFiltro
	 * @returns {*}
	 */
	getFiltroDetail : function(pFiltro){

		for (var j = 0; j < NS_STATISTICA["config"]["FILTRI"]["LIST"].length; j++)
		{
			if (pFiltro == NS_STATISTICA["config"]["FILTRI"]["LIST"][j]["ID"]){
				return NS_STATISTICA["config"]["FILTRI"]["LIST"][j];
			}
		}
	},

	/**
	 * La select dei filtri viene popolata tramite il file di configurazione della statistica e non tramite query.
	 * Al change del filtro selezionato viene recuperato l'oggetto dallo stesso file e trasformato in filtro.
	 * I filtri salvati vengono caricati tramite query solo una volta che caricato il file di configurazione si possiede l'identificativo della statistica.
	 * E' stata aggiunta anche la gestione dei campi per il raggruppamento dell'estrazione.
	 * Viene selezionato il campo che conporta l'ordinamento dell'estrazione. Una volta estratto in modo ordinato il plugin JQgrid
	 * si occupa del resto. L'ordinamento � stato un ripiego in quanto il plugin non � in grado di raggruppare senza averte i dati gi� ordinati.
	 */
	popolaFiltri : function(){

		$("#cmbFiltro").append($("<option></option>"));
		$("#cmbGroupBy").append($("<option></option>"));

		// Popolo il combo dei filtri selezionabili
		for (var i = 0; i < NS_STATISTICA["config"]["FILTRI"]["LIST"].length; i++)
		{
			var opt = $("<option></option>");
			opt.attr("id-filtro",NS_STATISTICA["config"]["FILTRI"]["LIST"][i]["ID"]);
			opt.text(NS_STATISTICA["config"]["FILTRI"]["LIST"][i]["LABEL"]);
			$("#cmbFiltro").append(opt);

			if (NS_STATISTICA["config"]["FILTRI"]["LIST"][i]["GROUPABLE"]){
				var optGroupBy = $("<option></option>");
				optGroupBy.attr({"id-filtro":NS_STATISTICA["config"]["FILTRI"]["LIST"][i]["ID"],"key-campo":NS_STATISTICA["config"]["FILTRI"]["LIST"][i]["KEY_CAMPO"],"key-campo-group-order":NS_STATISTICA["config"]["FILTRI"]["LIST"][i]["KEY_CAMPO_GROUP_ORDER"]});
				optGroupBy.text(NS_STATISTICA["config"]["FILTRI"]["LIST"][i]["LABEL"]);
				$("#cmbGroupBy").append(optGroupBy);
			}
		}

		// Leggo i filtri salvati su DB (fx$filtri)
		var db = $.NS_DB.getTool({setup_default:{datasource:'POLARIS_DATI'}});
		var xhr =  db.select(
			{
				id: "SDJ.Q_ESTRAZIONI_SALVATE",
				parameter : {
					"id_statistica":   {t: 'V', v: NS_STATISTICA["config"]["ID"]},
					"username":   {t: 'V', v: $("#USERNAME").val()}}
			});

		xhr.done(function (data, textStatus, jqXHR) {

			$("#cmbFiltriSalvati").append($("<option></option>"));

			for (var i = 0; i < data.result.length; i++)
			{
				var opt = $("<option></option>");
				opt.attr("data-campi",data.result[i].CAMPI);
				opt.attr("data-descr",data.result[i].DESCR);
				opt.attr("data-value",data.result[i].VALUE);
				opt.text(data.result[i].DESCR);
				$("#cmbFiltriSalvati").append(opt);
			}

		});
	},

	/**
	 *
	 * @param show boolean. Se true visualizza il button
	 */
	showHideButtonDeleteSavedFilter : function(show){
		if (show) {
			$("#butDeleteSavedFilter").show();
		} else {
			$("#butDeleteSavedFilter").hide();
		}
	},

	/**
	 *
	 * @param idFilter
	 * @param idPersonalFilter
	 * @param concatFieldsFilter
	 */
	removeSavedFilter : function(idFilter, idPersonalFilter){

		logger.debug("Statistica - Rimozione filtro " + idFilter + " - Init");
		logger.debug("Statistica - Rimozione filtro - " + idFilter + " - Struttura -> {idFilter :" + idFilter + ", idPersonalFilter : " + idPersonalFilter + "}");

		var _json_filtri ={
			"username" : $("#USERNAME").val(),
			"sito" : $("#SITO").val(),
			filtro :[]
		};

		_json_filtri.filtro.push({"id" : idFilter, "tipo":"T", "val" : null});

		toolKitDB.salvaFiltri(JSON.stringify(_json_filtri),"FILTRO_STATISTICHE_USER_DEFINED_" + NS_STATISTICA["config"]["ID"],idPersonalFilter, $("#USERNAME").val(), $("#SITO").val(),
			{
				callback: function (response)
				{
					if (response.p_result == "OK") {

						$("#cmbFiltriSalvati option:selected").remove();
						home.NOTIFICA.success({message: "Rimozione filtro " + idPersonalFilter + " avvenuta con successo", width:220});
					} else {
						logger.error("Statistica - Errore procedura Rimozione filtri - response -> " + JSON.stringify(response));
						home.NOTIFICA.error({message: "Errore durante il salvataggio dei filtri",width:220});
					}
				},
				errorHandler: function (response)
				{
					logger.error("Statistica - errore toolkitDB Rimozione filtri - response -> " + JSON.stringify(response));
					home.NOTIFICA.error({message: "Errore durante il salvataggio dei filtri",width:220});
				},
				timeout: 3000
			});

	},

	/**
	 * Metodo invocato al change del filtro applicato.
	 * A partire dall'input recupera dal file di configurazione
	 * il filtro corrispondente e lo appende a quelli gi� inseriti.
	 * Prima di applicare il filtro viene controllato il valore ALLOW_MULTIPLE.
	 * Se FALSE e il filtro � gi� stato inserito interrompe la creazione del filtro.
	 * Una volta determinato il tiop di filtro selezionato
	 * viene invocata una funzione specifica per il filtro selezionato.
	 *
	 * @param p ID del filtro che viene applcato
	 */
	handleFiltro : function(p){

		logger.debug("Statistica - Handling filtro - Oggetto in input -> " + JSON.stringify(p));

		if (typeof p != "object") {
			return;
		}

		if (!p.ALLOW_MULTIPLE) {
			var list = $("#" + p.ID);
			if (list.length > 0) {
				return home.NOTIFICA.warning({message: "Il filtro " + p.LABEL + " non pu&ograve; essere selezionato pi&ugrave; di una volta",title:"Attenzione",width : 220});
			}
		}

		switch (p["TYPE"]) {
			case "DATE" :
				var obj = NS_FILTRI_STATISTICHE.getFiltroDate(p);
				break;
			case "DATE_RANGE" :
				var obj = NS_FILTRI_STATISTICHE.getFiltroDateRange(p);
				break;
			case "TEXT" :
				var obj = NS_FILTRI_STATISTICHE.getFiltroText(p);
				break;
			case "NUMBER" :
				var obj = NS_FILTRI_STATISTICHE.getFiltroText(p);
				break;
			case "SELECT" :
				var obj = NS_FILTRI_STATISTICHE.getFiltroSelect(p);
				break;
			case "MULTISELECT" :
				var obj = NS_FILTRI_STATISTICHE.getFiltroMultiSelect(p);
				break;
			case "AUTOCOMPLETE" :
				var obj = NS_FILTRI_STATISTICHE.getFiltroAutocomplete(p);
				break;
		}

		$("#tableFiltri").append(obj);

		logger.info("Statistica - Handling filtro - Applicato filtro " + p.LABEL);

		//tolgo l'option selezionato
		$(this).find("option:selected").removeAttr("selected")
	},

	getRow : function(p){

		var obj = $("<tr></tr>");
		obj.attr("tipo", p.TYPE);
		obj.attr("label", p.LABEL);
		obj.attr("tipo-dato", p.TYPE_DATA);
		obj.attr("key_campo", p.KEY_CAMPO);
		obj.attr("id", p.ID);

		return obj;
	},

	getTd : function(p){

		var obj = $("<td></td>");
		obj.addClass(p.class);

		return obj;
	},

	getLabel : function(p){

		var td = NS_FILTRI_STATISTICHE.getTd({"class":"tdLbl"});
		td.text(p.LABEL);

		return td;
	},

	getSelect : function(p){

		var td = NS_FILTRI_STATISTICHE.getTd({"class":"tdCombo"});
		var sel = $("<select></select>");

		for (var i = 0; i < p.VALUE.length; i++){
			var opt = $("<option></option>").text(p.LABEL[i]).attr("data-value",p.VALUE[i]).val(p.VALUE[i]);
			sel.append(opt);
		}

		td.append(sel);

		return td;
	},

	getMultiSelect : function(p){

		var td = NS_FILTRI_STATISTICHE.getTd({"class":"tdMultiSelect"});
		var sel = $("<select multiple></select>").attr("size",p.SIZE);

		for (var i = 0; i < p.VALUE.length; i++){
			var opt = $("<option></option>").text(p.LABEL[i]).attr({"data-value":p.VALUE[i],"selected":"selected"}).val(p.VALUE[i]);
			sel.append(opt);
		}

		td.append(sel);

		return td;
	},

	getCalendar : function(p){

		var td = NS_FILTRI_STATISTICHE.getTd({"class":"tdData"});

		var txt = $("<input type='text'/>");
		txt.attr("id", p.ID);

		var txtHidden = $("<input type='hidden'/>");
		txtHidden.attr("id", "h-" + p.ID);

		td.append(txt);
		td.append(txtHidden);

		txt.Zebra_DatePicker({
			onSelect : function(){},
			startWithToday : true, readonly_element : false,
			format : 'Ymd', months : (traduzione.Mesi).split(','),
			days : (traduzione.Giorni).split(',')
		});
		txt.maskData({});

		txt.on("blur change", function(){
			txtHidden.val(moment($(this).val(),"DD/MM/YYYY").format("YYYYMMDD"));
		});

		return td;
	},

	getText : function(p){

		var td = NS_FILTRI_STATISTICHE.getTd({"class":"tdText"});
		var inp = $("<input type='text'/>");

		inp.addClass(p.class);
		td.append(inp);

		return td;
	},

	/**
	 * La caratteristica di questo autocomplete risiede nel fatto che
	 * sia composto da un select MULTIPLE e non da un singolo input.
	 * Viene costruito tramite il plugin Tokenize.
	 *
	 * @param p
	 * @returns {*}
	 */
	getAutocomplete : function(p){

		var td = NS_FILTRI_STATISTICHE.getTd({"class":"tdText"});
		var inp = $("<select id='tokenize' multiple='multiple' class='tokenize-sample'>		<option value='1'>Dave</option>		<option value='2'>Paul</option>		<option value='3'>Michel</option>		<option value='4'>Anna</option>		<option value='5'>Eleanor</option>		</select>");

		td.append(inp);

		inp.tokenize({
			searchParam : p["DETAIL"]["SEARCH_PARAM_GET"],
			valueField : p["DETAIL"]["FIELD_VALUE"],
			textField : p["DETAIL"]["FIELD_TEXT"],
			htmlField : p["DETAIL"]["FIELD_HTML"],
			datas : p["DETAIL"]["URL"]
		});

		return td;
	},

	getButtonRemove : function(p){

		var td = NS_FILTRI_STATISTICHE.getTd({"class":"tdText"});
		var btn = $("<button type='button' class='btn btnRemoveFilter'>Rimuovi</button>").on("click",function(){$(this).closest("TR").remove()});

		td.append(btn);

		return td;
	},

	getFiltroDate : function(p){

		var tr = NS_FILTRI_STATISTICHE.getRow(p);
		var lbl = NS_FILTRI_STATISTICHE.getLabel(p);
		var operator = NS_FILTRI_STATISTICHE.getSelect(p.OPERATORS);
		var calendar = NS_FILTRI_STATISTICHE.getCalendar(p);
		var btnRemove = NS_FILTRI_STATISTICHE.getButtonRemove(p);

		tr.append(lbl);
		tr.append(operator.addClass("td-filtro-operator"));
		tr.append(calendar.addClass("td-filtro-value"));
		tr.append(btnRemove);

		return tr;
	},

	getFiltroDateRange : function(p){

		// Clono l'oggetto raltivo al filtro in quanto devo modificarne l'ID
		// L'ID viene modificato per assegnare due id diversi ai campi delle date
		var pCloned = jQuery.extend({}, p);

		var tr = NS_FILTRI_STATISTICHE.getRow(p);
		var lbl = NS_FILTRI_STATISTICHE.getLabel(p);
		var lblDa = NS_FILTRI_STATISTICHE.getLabel({"LABEL":"Da"});
		pCloned.ID = "DA_" + pCloned.ID;
		var calendarDa = NS_FILTRI_STATISTICHE.getCalendar(pCloned);
		var lblA = NS_FILTRI_STATISTICHE.getLabel({"LABEL":"A"});
		pCloned.ID = "A_" + pCloned.ID
		var calendarA = NS_FILTRI_STATISTICHE.getCalendar(pCloned);
		var btnRemove = NS_FILTRI_STATISTICHE.getButtonRemove(p);

		tr.append(lbl);
		tr.append(lblDa);
		tr.append(calendarDa.addClass("td-filtro-value"));
		tr.append(lblA);
		tr.append(calendarA.addClass("td-filtro-value"));
		tr.append(btnRemove);

		return tr;
	},

	getFiltroText : function(p){

		var tr = NS_FILTRI_STATISTICHE.getRow(p);
		var lbl = NS_FILTRI_STATISTICHE.getLabel(p);
		var operator = NS_FILTRI_STATISTICHE.getSelect(p.OPERATORS);
		var text = NS_FILTRI_STATISTICHE.getText(p);
		var btnRemove = NS_FILTRI_STATISTICHE.getButtonRemove(p);

		tr.append(lbl);
		tr.append(operator.addClass("td-filtro-operator"));
		tr.append(text.addClass("td-filtro-value"));
		tr.append(btnRemove);

		return tr;
	},

	getFiltroSelect : function(p){

		var tr = NS_FILTRI_STATISTICHE.getRow(p);
		var lbl = NS_FILTRI_STATISTICHE.getLabel(p);
		var operator = NS_FILTRI_STATISTICHE.getSelect(p.OPERATORS);
		var btnRemove = NS_FILTRI_STATISTICHE.getButtonRemove(p);
		var select = null;

		// se il select degli operatori contiene solo un valore non lo mostro
		var lengthOperator = operator.find("select > option").length;
		lengthOperator > 1 ? null : operator.css({"visibility":"hidden"});

		// Da un select pu� dipendere anche il valore di un sotto filtro
		if (p["OPTIONS"].hasOwnProperty("DATA_SLAVE")){

			select = NS_FILTRI_STATISTICHE.getSelect(p.OPTIONS);

			// Alla modifica verifico se il sottofiltro � stato valorizzato
			// in tal caso aggiorno i valori selezionati con quelli opportuni per il nuovo valore
			select.on("change",function(){
				$("#tableFiltri tr").each(function () {
					// Se il TR esaminato � tra quelli presenti nel DATA_SLAVE ([n,n1,n2...]) lo elimino e lo reinserisco
					if (p["OPTIONS"]["DATA_SLAVE"].lastIndexOf($(this).attr("id")) >= 0) {
						var posSubFiltro = p["OPTIONS"]["DATA_SLAVE"].lastIndexOf($(this).attr("id"));
						$(this).remove();
						NS_FILTRI_STATISTICHE.handleFiltro(NS_FILTRI_STATISTICHE.getFiltroDetail(p["OPTIONS"]["DATA_SLAVE"][posSubFiltro]));
					}
				});
			});

		} else if (p["OPTIONS"].hasOwnProperty("DATA_MASTER")) {

			// Se il filtro selezionato ha l'attributo DATA_MASTER quest ultimo deve essere valorizzato
			// Se non valorizzato il DATA_MASTER non posso popolare correttamente il filtro. Sollevo eccezione.
			var hasMasterSelected = false;

			// Recupero i valore del MASTER per settare le option adeguate al multiselect
			$("#tableFiltri tr").each(function () {
				if ($(this).attr("id") == p["OPTIONS"]["DATA_MASTER"]["FIELD"]) {
					var valueMaster = $('#tableFiltri tr#' + p['OPTIONS']['DATA_MASTER']['FIELD'] + ' td.td-filtro-value > select').val();
					select = NS_FILTRI_STATISTICHE.getSelect(p['OPTIONS']['DATA_MASTER']['CASE'][valueMaster]);
					hasMasterSelected = true;
				}
			});

			if (!hasMasterSelected){
				var objMaster = NS_FILTRI_STATISTICHE.getFiltroDetail(p["OPTIONS"]["DATA_MASTER"]["FIELD"]);
				return home.NOTIFICA.error({message: "Il filtro " + p["LABEL"] + " necessita del filtro " + objMaster["LABEL"] + " selezionato",title:"Attenzione",width : 220});
			}

		} else {
			select = NS_FILTRI_STATISTICHE.getSelect(p.OPTIONS);
		}

		tr.append(lbl);
		tr.append(operator.addClass("td-filtro-operator"));
		tr.append(select.addClass("td-filtro-value"));
		tr.append(btnRemove);

		return tr;
	},

	getFiltroMultiSelect : function(p){

		var tr = NS_FILTRI_STATISTICHE.getRow(p);
		var lbl = NS_FILTRI_STATISTICHE.getLabel(p);
		var operator = NS_FILTRI_STATISTICHE.getTd({"class":"tdLbl"});
		var btnRemove = NS_FILTRI_STATISTICHE.getButtonRemove(p);
		var multiselect = null;

		// Se il multiselect ha valorizzato DATA_MASTER significa che i valori dipendono dal MASTER
		if (p["OPTIONS"].hasOwnProperty("DATA_MASTER")) {
			var hasMasterSelected = false;
			// Recupero i valore del MASTER per settare le option adeguate al multiselect
			$("#tableFiltri tr").each(function () {
				if ($(this).attr("id") == p["OPTIONS"]["DATA_MASTER"]["FIELD"]) {
					var valueMaster = $('#tableFiltri tr#' + p['OPTIONS']['DATA_MASTER']['FIELD'] + ' td.td-filtro-value > select').val();
					multiselect = NS_FILTRI_STATISTICHE.getMultiSelect(p['OPTIONS']['DATA_MASTER']['CASE'][valueMaster]);
					hasMasterSelected = true;
				}
			});

			if (!hasMasterSelected){
				var objMaster = NS_FILTRI_STATISTICHE.getFiltroDetail(p["OPTIONS"]["DATA_MASTER"]["FIELD"]);
				return home.NOTIFICA.error({message: "Il filtro " + p["LABEL"] + " necessita del filtro " + objMaster["LABEL"] + " selezionato",title:"Attenzione",width : 220});
			}

		} else {
			multiselect = NS_FILTRI_STATISTICHE.getMultiSelect(p.OPTIONS);
		}

		tr.append(lbl);
		tr.append(operator);
		tr.append(multiselect.addClass("td-filtro-value"));
		tr.append(btnRemove);

		return tr;
	},

	getFiltroAutocomplete : function(p){

		var tr = NS_FILTRI_STATISTICHE.getRow(p);
		var lbl = NS_FILTRI_STATISTICHE.getLabel(p);
		var empty = NS_FILTRI_STATISTICHE.getTd({"class":"tdLbl"});
		var multiselect = NS_FILTRI_STATISTICHE.getAutocomplete(p);
		var btnRemove = NS_FILTRI_STATISTICHE.getButtonRemove(p);

		tr.append(lbl);
		tr.append(empty);
		tr.append(multiselect.addClass("td-filtro-value"));
		tr.append(btnRemove);

		return tr;
	},


	/**
	 * Funzione invocata prima della generazione della where condition e dell'estrazione vera e propria.
	 * Controlla se i filtri sono stati valorizzati e in modo appropriato.
	 *
	 * @returns {boolean}
	 */
	checkFiltri : function(){

		logger.debug("Statistica - Check Filtri - Init");

		// Se viene definita una funzione al before applica viene interpretata
		var beforeApplica = NS_STATISTICA["config"]["FILTRI"]["BEFORE_APPLICA"];
		var fnBeforeApplica = NS_FILTRI_STATISTICHE[beforeApplica];

		// controllo che il reiferimento sia una funzione
		if (typeof fnBeforeApplica === "function") {

			if (!fnBeforeApplica()){
				NS_LOADING.hideLoading(); NS_FILTRI_STATISTICHE.setEvents();
				return false;
			}
		}

		var result = true;
		var campiRequired = [];
		var campiRequiredLabel = [];

		// valorizzo un array con i campi required
		for (var i = 0; i < NS_STATISTICA["config"]["FILTRI"]["LIST"].length; i++){
			if (NS_STATISTICA["config"]["FILTRI"]["LIST"][i]["REQUIRED"]){
				campiRequired.push(NS_STATISTICA["config"]["FILTRI"]["LIST"][i]["KEY_CAMPO"]);
				campiRequiredLabel.push(NS_STATISTICA["config"]["FILTRI"]["LIST"][i]["LABEL"]);
			}
		}

		var checkStringNotNull = function(td){

			var _string = td.find("input:visible").val();

			if (_string == "" || _string == null) {
				return false;
			}

			return true;
		};

		var checkDateNotNull = function(td){

			var _dateVisible = td.find("input:visible").val();
			var _dateHidden = td.find("input:hidden").val();

			// alert("_dateVisible -> " + _dateVisible + "\n_dateHidden -> " + _dateHidden);

			if (_dateVisible == "" || _dateVisible == null) {
				return false;
			}

			if (_dateHidden == "" || _dateHidden == null){
				td.find("input:hidden").val(moment(_dateVisible,"DD/MM/YYYY").format("YYYYMMDD"))
			}

			return true;
		};

		if ($("#tableFiltri tr").length < 1){
			NS_LOADING.hideLoading(); NS_FILTRI_STATISTICHE.setEvents();
			home.NOTIFICA.error({message: "Valorizzare almeno un filtro",title:"Errore",width : 220});
			return false;
		}

		$("#tableFiltri tr").each(function(idx){

			var operator = $(this).find(".td-filtro-operator select").val();
			var keyCampo = $(this).attr("key_campo");
			var tipo = $(this).attr("tipo");
			// alert("idx -> " + idx + "\nType -> " + $(this).attr("tipo") + "\nCampo -> " + keyCampo + "\nOperator -> " + operator);

			var positionRequired = campiRequired.indexOf(keyCampo);
			if (positionRequired >= 0){
				campiRequired.splice(positionRequired,1);
				campiRequiredLabel.splice(positionRequired,1);
			}

			logger.debug("Statistica - Check Filtri - Process Check - Idx -> " + idx + ", Type -> " + $(this).attr("tipo") + ", Campo -> " + keyCampo + ", Operator -> " + operator);

			switch (tipo){
				case "DATE" :
					result = checkDateNotNull($(this).find(".td-filtro-value"));
					break;

				case "DATE_RANGE" :
					$(this).find('.td-filtro-value').each(function() {
						result = checkDateNotNull($(this));
					});
					break;

				case "TEXT" :
					result = checkStringNotNull($(this).find(".td-filtro-value"));
					break;

				case "NUMBER" :
					result = checkStringNotNull($(this).find(".td-filtro-value"));
					break;

				case "AUTOCOMPLETE" :
					result = $(".TokensContainer > .Token").length == 0 ? false : true;
					break;

				case "MULTISELECT" :

					var counter = 0;
					$(this).find('.td-filtro-value > select > option:selected').each(function() {
						counter++;
					});

					if (counter == 0){
						result = false;
					}
					break;
			}

			if (!result){
				home.NOTIFICA.error({message: "Il filtro " + $(this).attr("label") + " non &egrave; valorizzato",title:"Attenzione",width : 220});
			}

		});

		if (campiRequiredLabel.length > 0){
			for (var i = 0; i < campiRequiredLabel.length; i++){
				home.NOTIFICA.error({message: "Il filtro " + campiRequiredLabel[i] + " &egrave; obbligatorio",title:"Attenzione",width : 220});
			}
			result = false;
		}

		logger.debug("Statistica - Check Filtri - End - Esito -> " + result);

		return result;
	},

	/**
	 * Funzione che una volta selezionatii filtri genera la query con la where condition
	 * appropriata (valori sostituiti da ?) e un oggetto contenente i valori da sostituire nella where condition.
	 *
	 * @returns {{SQL: string, PARAMETERS: {}}}
	 */
	getWhereCondition : function(){

		logger.debug("Statistica - Get Query Dati - Init");

		var sql = sqlDebug = NS_STATISTICA["config"]["QUERY_DATI"];
		sql = sqlDebug += sql.lastIndexOf("WHERE") > 0 ? " AND " : " WHERE ";

		var whereParameters = {};
		var caption = "";

		var counter = 0; // definisco un contatore esterno a causa dei multiselect che possono avere pi� di un valore selezionato

		logger.debug("Statistica - Get Query Dati - Query sorgente -> " + NS_STATISTICA["config"]["QUERY_DATI"]);

		$("#tableFiltri tr").each(function(idx){

			sql += idx > 0 ? " AND " : "";
			sqlDebug += idx > 0 ? " AND " : "";
			caption += idx == 0 ? "Filtro " + $(this).attr("label") : "," + $(this).attr("label");

			var operator = $(this).find(".td-filtro-operator select").val();
			var id = $(this).attr("id");
			var keyCampo = $(this).attr("key_campo");
			var tipo = $(this).attr("tipo");
			var tipoDato = $(this).attr("tipo-dato");
			var filtroDetail = NS_FILTRI_STATISTICHE.getFiltroDetail(id);

			logger.debug("Statistica - Get Query Dati - Process filtro - " + "Idx -> " + idx + ", Type -> " + $(this).attr("tipo") + ", Campo -> " + keyCampo + ", Operator -> " + operator);

			switch (tipo){

				case "DATE" :

					if (filtroDetail.hasOwnProperty("EXPRESSION")){
						sql += filtroDetail["EXPRESSION"];
						sqlDebug += filtroDetail["EXPRESSION"];
					} else {
						sql +=  keyCampo + " " + NS_FILTRI_STATISTICHE.decodeOperator(operator) + " ?";
						sqlDebug +=  keyCampo + " " + NS_FILTRI_STATISTICHE.decodeOperator(operator) + " TO_DATE('" + $(this).find(".td-filtro-value > input:hidden").val() + "','yyyyMMdd')";
					}

					whereParameters[counter] = NS_FILTRI_STATISTICHE.getBindVariable(tipoDato,$(this).find(".td-filtro-value > input:hidden").val(),operator);
					counter++;
					break;

				case "DATE_RANGE" :

					if (filtroDetail.hasOwnProperty("EXPRESSION")){
						sql += filtroDetail["EXPRESSION"];
						sqlDebug += filtroDetail["EXPRESSION"];
					} else {
						// Aggiunto "+1" alla data di fine del range per includere tutti gli orari della data indicata
						sql +=  keyCampo + " BETWEEN ? AND ? + 1 ";
						sqlDebug +=  keyCampo + " BETWEEN TO_DATE('" + $(this).find(".td-filtro-value > input:hidden").first().val() + "','yyyyMMdd') AND TO_DATE('" + $(this).find(".td-filtro-value > input:hidden").last().val() + "','yyyyMMdd')";
					}

					whereParameters[counter] = NS_FILTRI_STATISTICHE.getBindVariable(tipoDato,$(this).find(".td-filtro-value > input:hidden").first().val(),operator);
					counter++;
					whereParameters[counter] = NS_FILTRI_STATISTICHE.getBindVariable(tipoDato,$(this).find(".td-filtro-value > input:hidden").last().val(),operator);
					counter++;
					break;

				case "TEXT" :

					if (filtroDetail.hasOwnProperty("EXPRESSION")){
						sql += filtroDetail["EXPRESSION"];
						sqlDebug += filtroDetail["EXPRESSION"];
					} else {
						sql +=  keyCampo + " " + NS_FILTRI_STATISTICHE.decodeOperator(operator) + " " + NS_FILTRI_STATISTICHE.getBindVariableWhere(operator);
						sqlDebug +=  keyCampo + " " + NS_FILTRI_STATISTICHE.decodeOperator(operator) + " " + NS_FILTRI_STATISTICHE.getBindVariableWhere(operator,$(this).find(".td-filtro-value > input").val());
					}

					whereParameters[counter] = NS_FILTRI_STATISTICHE.getBindVariable(tipoDato,$(this).find(".td-filtro-value > input").val(),operator);
					counter++;
					break;

				case "NUMBER" :
					sql +=  keyCampo + " " + NS_FILTRI_STATISTICHE.decodeOperator(operator) + " ?";
					sqlDebug +=  keyCampo + " " + NS_FILTRI_STATISTICHE.decodeOperator(operator) + " " + $(this).find(".td-filtro-value > input").val();
					whereParameters[counter] = NS_FILTRI_STATISTICHE.getBindVariable(tipoDato,$(this).find(".td-filtro-value > input").val(),operator);
					counter++;
					break;

				case "SELECT" :
					sql +=  keyCampo + " " + NS_FILTRI_STATISTICHE.decodeOperator(operator) + " " + NS_FILTRI_STATISTICHE.getBindVariableWhere(operator);
					sqlDebug +=  keyCampo + " " + NS_FILTRI_STATISTICHE.decodeOperator(operator) + " '" +  NS_FILTRI_STATISTICHE.getBindVariableWhere(operator,$(this).find(".td-filtro-value > select").val()) + "'";
					whereParameters[counter] = NS_FILTRI_STATISTICHE.getBindVariable(tipoDato,$(this).find(".td-filtro-value > select").val(),operator);
					counter++;
					break;

				case "MULTISELECT" :

					sql +=  keyCampo + " IN (";
					sqlDebug +=  keyCampo + " IN (";
					$(this).find('.td-filtro-value > select > option:selected').each(function(i,k) {
						whereParameters[counter] = NS_FILTRI_STATISTICHE.getBindVariable(tipoDato,$(this).val(),operator);
						sql +=  i > 0 ? ",?" : "?";
						sqlDebug +=  i > 0 ? ",'" + $(this).val() + "'" : "'" + $(this).val() + "'";
						counter++;
					});

					sql +=  ")";
					sqlDebug +=  ")";

					break;

				case "AUTOCOMPLETE" :

					var filtroDetail = NS_FILTRI_STATISTICHE.getFiltroDetail(id);
					var idx = 0;

					var arrayParametersValue = [];
					$(this).find('.td-filtro-value ul.TokensContainer li.Token').each(function() {
						arrayParametersValue.push($(this).attr("data-value"));
						idx++;
					});

					if (filtroDetail["DETAIL"]["TYPE"] == "FUNCTION" ){

						sql += filtroDetail["DETAIL"]["CONDITION"];
						sqlDebug += filtroDetail["DETAIL"]["CONDITION"].replace("?",JSON.stringify(arrayParametersValue));
						whereParameters[counter] = {"TYPE":filtroDetail["DETAIL"]["TYPE_BIND"],"VALUE":arrayParametersValue};
						counter++;

					} else {

						sql += filtroDetail["DETAIL"]["NAME"] + " IN (";
						sqlDebug += filtroDetail["DETAIL"]["NAME"] + " IN (";

						for (var i = 0; i < arrayParametersValue.length; i++){
							var valueDebug = tipoDato == "VARCHAR" ? "'" + arrayParametersValue[i] + "'" : arrayParametersValue[i];

							sql += i == 0 ? "?" : ",?";
							sqlDebug += i == 0 ? valueDebug : "," + valueDebug + "";
							whereParameters[counter] =  {"TYPE":tipoDato,"VALUE":arrayParametersValue[i]};
							counter++;
						}

						sql += ")";
						sqlDebug += ")";
					}

					break;
			}

		});

		var groupField = $("#cmbGroupBy > option:selected");
		if (groupField.val() != "" && groupField.val() != null){
			sql += " ORDER BY " + groupField.attr("key-campo-group-order");
			sqlDebug += " ORDER BY " + groupField.attr("key-campo-group-order");
		}

		logger.debug("Statistica - Get Query Dati - Query estrazione -> " + sql);
		logger.debug("Statistica - Get Query Dati - Dati where -> " + JSON.stringify(whereParameters));
		logger.debug("Statistica - Get Query Dati - Query estrazione Valorizzata per DEBUG -> " + sqlDebug);

		return {"SQL": encodeURIComponent(sql),"PARAMETERS" : whereParameters, "KEY_CONNECTION" : NS_STATISTICA["config"]["KEY_CONNECTION"], "GROUP_FIELD" : groupField.attr("key-campo-group-order"), "CAPTION" : caption};
	},

	/**
	 * Funzione che in base al codice dell'operatore ricevuto in input restituisce il
	 * valore nel linguaggio SQL.
	 *
	 * @param operator
	 * @returns {*}
	 */
	decodeOperator : function(operator){
		var idx = NS_FILTRI_STATISTICHE.Operators.codici.lastIndexOf(operator);
		return NS_FILTRI_STATISTICHE.Operators.sql[idx];
	},

	getBindVariable : function(type,value,operator){

		var _value = value;

		return {"TYPE":type,"VALUE":_value};
	},

	/**
	 * Per i campi che consentono il like restituisce la giusta struttura di valorizzazione
	 *
	 * @param operator
	 * @param value
	 * @returns {string}
	 */
	getBindVariableWhere : function(operator, value){

		var valueCondition = "";
		if ( operator == "bw"){
			valueCondition = "? || '%'";
		} else if (operator == "ew"){
			valueCondition = "'%' || ? ";
		} else if (operator == "cn"){
			valueCondition = "'%' || ? || '%'";
		} else {
			valueCondition = "?";
		}

		if (typeof value != "undefined"){
			valueCondition = valueCondition.replace("?",value);
		}

		return valueCondition;
	},

	/**
	 * Funzione invocata alla selezione dei filtri salavati dell'utente.
	 * Riceve in input la concatenazione dei filtri da caricare.
	 * La concatenazione viene splittata e per ogni ID viene caricato il
	 * filtro corrispondente.
	 *
	 * @param pCampi
	 */
	caricaFiltriSalvati : function(pCampi){

		if (pCampi == "" || pCampi == null){
			return;
		}

		var arCampi = pCampi.split("|");

		for (var i = 0; i < arCampi.length; i++)
		{
			NS_FILTRI_STATISTICHE.handleFiltro(NS_FILTRI_STATISTICHE.getFiltroDetail(arCampi[i]));
		}

	},

	/**
	 * Una volta effettuata la selezione dei filtri � possibile salvarla.
	 * Il salvataggio avviene sulla tabella filtri con la stessa funzione
	 * utilizzata per salvare i filtri delle normali WK.
	 * La struttura di salvataggio dei filtri:
	 *
	 * GRUPPO_FILTRI -> FILTRO_STATISTICHE_USER_DEFINED
	 * USERNAME -> utente loggato
	 * SITO -> SITO configurato per l'applicativo
	 * ID_FILTRO -> FILTRO_STATISTICA_ + numero progressivo dei filtri salvati per l'utente in questione
	 * CODICE_VARCHAR -> ID del filtro configurato per l'estrazione
	 * ID_FILTRO_PERSONALE -> Concatenazione delle label dei campi coinvolti nel filtro
	 */
	salvaFiltro : function(){

		logger.debug("Statistica - Registrazione filtri - Init");

		var _json_filtri ={
			"username" : $("#USERNAME").val(),
			"sito" : $("#SITO").val(),
			filtro :[]
		};

		var idFiltro = "FILTRO_STATISTICA_"+ NS_STATISTICA["config"]["ID"] + "_" + ($('#cmbFiltriSalvati > option').length);
		var idFiltroPersonale = "";
		var campiFiltro = "";

		$("#tableFiltri tr").each(function(idx){
			_json_filtri.filtro.push({"id":idFiltro,"tipo":"T","val":$(this).attr("id")});

			idFiltroPersonale += idx == 0 ? "" : ",";
			idFiltroPersonale += $(this).attr("label");

			campiFiltro += idx == 0 ? "" : "|";
			campiFiltro += $(this).attr("id");
		});

		logger.debug("Statistica - Registrazione filtri - Id filtro personale -> " + idFiltroPersonale + ", Campi Filtro -> " + campiFiltro);
		logger.debug("Statistica - Registrazione filtri - Oggetto filtri -> " + JSON.stringify(_json_filtri));

		toolKitDB.salvaFiltri(JSON.stringify(_json_filtri),"FILTRO_STATISTICHE_USER_DEFINED_" + NS_STATISTICA["config"]["ID"],idFiltroPersonale, $("#USERNAME").val(), $("#SITO").val(),
			{
				callback: function (response)
				{
					if (response.p_result == "OK") {

						home.NOTIFICA.success({message: "Salvataggio filtri avvenuto con successo",width:220});

						logger.info("Statistica - Registrazione filtri - Oggetto filtri -> " + JSON.stringify(_json_filtri));

						if ($('#cmbFiltriSalvati > option').length == 0){
							$('#cmbFiltriSalvati').append($("<option></option>"));
						}

						var opt = $("<option></option>").attr("data-campi",campiFiltro).text(idFiltroPersonale);
						$('#cmbFiltriSalvati').append(opt);

					} else {
						home.NOTIFICA.error({message: "Errore durante il salvataggio dei filtri",width:220});
					}
				},
				errorHandler: function (response)
				{
					home.NOTIFICA.error({message: "Errore durante il salvataggio dei filtri",width:220});
				},
				timeout: 3000
			});
	},

	/**
	 * Per effettuare l'estrazione della statistica viene creato un JSON
	 * e valorizzato in un form nascosto che a suo volta viene mandato in POST
	 * ad una servlet che dal JSON costruisce l'oggetto appropriato.
	 * Questo perch� tramite una chiamata POST con AJAX il client non riconosce
	 * l'header che gli forza il download del file.
	 */
	creaFormEstrazione : function(){

		var form = $("<form id='form-estrazione' enctype='application/x-www-form-urlencoded' action='estrazione/xls' method='POST' ></form>");
		var inputIntestazione = $("<input type='hidden' name='h-intestazione' id='h-intestazione'>");
		var inputDati = $("<input type='hidden' name='h-dati' id='h-dati'>");

		form.append(inputIntestazione);
		form.append(inputDati);

		$("#fldStatistiche").append(form);
	},

	/**
	 * Funzione che a partire dallo stesso json che ha generato la WK
	 * valorizza il form nascosto e ne effettua il submit.
	 * Il json viene riprocessato con gli stessi formatter della WK in quanto non
	 * � possibile estrarre interamente la WK con i valori gi� formattati.
	 *
	 * @param nGriglia
	 */
	esporta : function(nGriglia){

		logger.debug("Statistica - Export - Init");
		//$('#colch_' + nGriglia).trigger('reloadGrid');

		var sortColumnName = $('#colch_' + nGriglia).jqGrid('getGridParam','sortname');
		var sortOrder = $('#colch_' + nGriglia).jqGrid('getGridParam','sortorder'); // 'desc' or 'asc'
		var colData = $.extend(true,[],$('#colch_' + nGriglia).jqGrid('getGridParam','data'));
		var colNames = $.extend(true,[],$('#colch_' + nGriglia).jqGrid('getGridParam','colNames'));
		var arrayModel = $.extend(true,[],$('#colch_' + nGriglia).jqGrid('getGridParam','colModel'));
		var countColumnHidden = 0;

		// alert(JSON.stringify(colNames));

		for (var i = 0; i < colData.length; i++){
			delete colData[i]["_id_"];
		}

		for (var x = 0; x < arrayModel.length; x++) {

			var columnModel = arrayModel[x];

			if (columnModel.hidden) {

				logger.debug("Statistica - Export - Elimino la colonna " + columnModel.name + "/" + colNames[x] + " alla posizione " + x);

				colNames.splice(x-countColumnHidden,1);

				for (var i = 0; i < colData.length; i++){
					delete colData[i][columnModel.name];
				}

				countColumnHidden++;

			} else if (!columnModel.hidden && columnModel.hasOwnProperty("formatter")) {

				var fncFormatter = eval(columnModel.formatter);

				for (var i = 0; i < colData.length; i++){
					colData[i][columnModel.name] = fncFormatter(colData[i][columnModel.name],null,colData[i]);
					logger.debug("Statistica - Export - Dato da formattare - " + colData[i][columnModel.name] + " -> " + columnModel.formatter);
				}

			}
		}

		// alert(JSON.stringify(colNames));
		// alert(JSON.stringify(colData));

		/*colData.sort(function(a, b) {

		 if ( a[sortColumnName] < b[sortColumnName] ){

		 if(sortOrder === 'desc'){

		 return 1;
		 }else if(sortOrder === 'asc'){
		 return -1;
		 }
		 }

		 if ( a[sortColumnName] > b[sortColumnName] ){

		 if(sortOrder === 'desc'){
		 return -1;
		 }else if(sortOrder === 'asc'){
		 return 1;
		 }
		 }

		 return 0;

		 });*/

		colData = alasql('SELECT * FROM ? ORDER BY '+sortColumnName+' '+sortOrder+'',[colData]);

		var groupOccurences = 0;

		var groupBy = $("#cmbGroupBy").find("option:selected").attr("key-campo-group-order");

		if(groupBy !== "" && groupBy !== null && typeof groupBy !== "undefined"){

			//ordino l'oggetto secondo l'elemento per cui è raggruppato

			colData = alasql('SELECT * FROM ? ORDER BY '+groupBy+'',[colData]);



			var occurences = 0;


			/**
			 APPLICO RAGGRUPPAMENTO ALL'OGGETTO CONTENTENTE I DATI DELL'ESTRAZIONE
			 ciclo l'oggetto. Al primo giro aggiungo come primo elemento dell'oggetto, il titolo del primo gruppo assegnandoli il valore
			 dell'elemento per cui è raggruppato.
			 Nei giri seguenti, nel caso venga riscontrata una differenza tra il valore dell'elemento corrente e quello successivo
			 allora inserisco tra i due il titolo del gruppo successivo, cosi facendo viene riprodotta graficamente la tabella
			 generata da JQGrid

			 **/

			for(var i=0; i < colData.length ; i++){

				if(i === 0){
					var value = colData[i][groupBy];
					occurences = colData.reduce(function(n, val){
						return n + (val[groupBy] === value);
					}, 0);

					colData.unshift(JSON.parse('{"'+groupBy+'":"'+value+' - '+occurences+'"}'));
					i++;
					groupOccurences++;
				}

				var j = i+1;

				if(j < colData.length ){
					if(colData[i][groupBy] !== colData[j][groupBy]){

						var value = colData[j][groupBy];
						occurences = colData.reduce(function(n, val){
							return n + (val[groupBy] === value);
						}, 0);


						colData.splice(j,0,JSON.parse('{"'+groupBy+'":"'+value+' - '+occurences+'"}'));
						i++;
						groupOccurences++;

					}
				}
			}


		}

		var totale = alasql('SELECT COUNT(*) AS CONTO FROM ? ',[colData]);

		totale = totale[0].CONTO - groupOccurences;
		colData.splice(colData.length ,0,JSON.parse('{"TOTALE":"TOTALE - '+totale+'"}'));



		$("input#h-intestazione").val(JSON.stringify(colNames));
		$("input#h-dati").val(JSON.stringify(colData));
		$("#form-estrazione").submit();

	}

};