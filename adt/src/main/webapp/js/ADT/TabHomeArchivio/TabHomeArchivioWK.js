var NS_HOME_ARCHIVIO_WK =
{
		wkRichiesteGrouper : null,
	    wkMovimentiCartelle : null,
	    wkcaricaWkouper : null,
	    wkRichiesteCartelle : null,

	    beforeApplica : function()
	    {
			logger.debug("Before Applica Tabulatore -> " + NS_HOME_ARCHIVIO.tab_sel);

	    	if (NS_HOME_ARCHIVIO.tab_sel == 'filtroCartelle')
	        {
	        	var obj = NS_HOME_ARCHIVIO_WK.definisciQueryWKMovimentiCartelle();

	            logger.debug("Applica WK Movimenti Cartella -> " + JSON.stringify(obj));

	            if (obj.SUCCESS)
	            {
	            	$("#divWk").worklist().config.structure.id_query = obj.QUERY;

					if($("#txtNCartella").val() !== ""){
						if($("#txtAnnoMovimenti").val() == "" || $("#txtStrutturaMovimenti").val() == ""){
							home.NOTIFICA.warning({title: "Attenzione",message:"Valorizzare filtri Anno e Struttura",timeout: 3});
							return false;
						}
						else{
							return true;
						}
					}
					else{
	            		return true;
					}
	            }
	            else
	            {
	            	return false;
	            }


	        }
	        else if (NS_HOME_ARCHIVIO.tab_sel == "filtroGrouper")
	        {
		        var obj = NS_HOME_ARCHIVIO_WK.definisciQueryWKRichiesteGrouper();

		        logger.debug("Applica WK Gestione Richieste Grouper -> " + JSON.stringify(obj));

	            if (obj.SUCCESS)
	            {
	            	$("#divWk").worklist().config.structure.id_query = obj.QUERY;

	            	return true;
	            }
	            else
	            {
	            	return false;
	            }
	        }
	        else if (NS_HOME_ARCHIVIO.tab_sel == 'filtroRichiesteCartelle')
	    	{
	            var obj = NS_HOME_ARCHIVIO_WK.definisciQueryWKRichiesteCartelle();

	            logger.debug("Applica WK Gestione Richieste Cartella -> " + JSON.stringify(obj));

	            if (obj.SUCCESS)
	            {
	            	$("#divWk").worklist().config.structure.id_query = obj.QUERY;

	            	return true;
	            }
	            else
	            {
	            	return false;
	            }
	    	}

	    },

	    caricaWk : function()
	    {
	    	$(".butApplica").show();

	        switch   (NS_HOME_ARCHIVIO.tab_sel)
	        {
	            case 'filtroCartelle':
	                 NS_HOME_ARCHIVIO_WK.caricaWkMovimentiCartelle();
	                break;

	            case 'filtroGrouper' :
	                NS_HOME_ARCHIVIO_WK.caricaWkRichiesteGrouper();
	                break;

	            case 'filtroRichiesteCartelle':
	                NS_HOME_ARCHIVIO_WK.caricaWkRichiesteCartelle();
	                break;

	            case 'filtroEstrazioneCartelle':
	                NS_HOME_ARCHIVIO_ESTRAZIONE_CARTELLE.init();
	                break;
	        }
	    },

	    definisciQueryWKMovimentiCartelle : function(){

	    	var p =
	        {
	        		"cognome" : $("#txtCognome").val() == "" ? null  : $("#txtCognome").val(), "nome" : $("#txtNome").val() == "" ? null : $("#txtNome").val(),
	        		"cartella" : $("#txtNCartella").val() == "" ? null  : $("#txtNCartella").val(),
	        		"da_data" : $("#h-txtDaData").val() == "" ? null :  $("#h-txtDaData").val(), "a_data" : $("#h-txtAData").val() == "" ? null :  $("#h-txtAData").val(),
	        		"SUCCESS" : true,
	        		"QUERY" : ""
	        };

	    	if (p.cartella != null)
	    	{
	    		p.QUERY = "WORKLIST.WK_GESTIONE_CARTELLE_BY_CARTELLA";
	    	}
	    	else if (p.cognome != null && p.cognome.length >= 3)
	    	{
	    		p.QUERY = "WORKLIST.WK_GESTIONE_CARTELLE_BY_DATI_ANAGRAFICI";
	    	}
	    	else if (p.da_data != null && p.a_data != null)
	    	{
	    		p.QUERY = "WORKLIST.WK_GESTIONE_CARTELLE_BY_DATA_RANGE";
	    	}
	    	else
	    	{
	    		home.NOTIFICA.error({message: "Valorizzare almeno uno dei seguenti criteri: 1) Cartella 2) Dati Anagrafici 3) Range di Date", title: "Error"});
	    		p.SUCCESS = false;
	    	}

            logger.debug("Carico la wk con la query -> " + p.QUERY);
	    	return p;
	    },

	    caricaWkMovimentiCartelle : function()
	    {
	    	// Valorizzo i filtri delle date solo se le WK non sono mai state inizializzate
	        if(!NS_HOME_ARCHIVIO_WK.wkMovimentiCartelle)
	        {
	            var daData = $("#txtDaData" ).data('Zebra_DatePicker');
	            daData.setDataIso(moment().add(-10,"days").format('YYYYMMDD'));

	            var aData = $("#txtAData" ).data('Zebra_DatePicker');
	            aData.setDataIso(moment().format('YYYYMMDD'));
	        }

	        var obj = NS_HOME_ARCHIVIO_WK.definisciQueryWKMovimentiCartelle();


	        logger.debug("Applica WK Movimenti Cartelle -> " + JSON.stringify(obj));

	        NS_HOME_ARCHIVIO_WK.wkMovimentiCartelle = new WK({
	            id:"ADT_WK_GESTIONE_CARTELLE",
	            container:"divWk",
	            aBind : [],
	            aVal : [],
	            load_callback: null,
	            loadData : false
	        });

	        NS_HOME_ARCHIVIO_WK.wkMovimentiCartelle.loadWk();
			NS_HOME_ARCHIVIO_WK.handlerFiltriMovimentiCartella();
	    },

	    definisciQueryWKRichiesteGrouper : function(){

	    	var p =
	        {
	        		"cognome" : $("#txtCognomeListaRichiesteGrouper").val() == "" ? null  : $("#txtCognomeListaRichiesteGrouper").val(), "nome" : $("#txtNomeListaRichiesteGrouper").val() == "" ? null : $("#txtNomeListaRichiesteGrouper").val(),
	        		"struttura" : $("#txtStrutturaGrouper").val()=="" ? null : 	$("#txtStrutturaGrouper").val(),
	        		"anno" : $("#txtAnnoGrouper").val()=="" ? null : 	$("#txtAnnoGrouper").val(),
	        		"cartella" : $("#txtNCartellaGrouper").val() == "" ? null  : $("#txtNCartellaGrouper").val(),
	        		"da_data" : $("#h-txtDaDataGrouper").val() == "" ? null :  $("#h-txtDaDataGrouper").val(), "a_data" : $("#h-txtADataGrouper").val() == "" ? null :  $("#h-txtADataGrouper").val(),
	        		"SUCCESS" : true,
	        		"QUERY" : ""
	        };

			if (p.cartella != null || p.struttura != null || p.anno != null)
			{
				p.QUERY = "WORKLIST.WK_RICHIESTE_GROUPER_BY_CARTELLA";
			}
	    	else if (p.cognome != null && p.cognome.length >= 3)
	    	{
	    		p.QUERY = "WORKLIST.WK_RICHIESTE_GROUPER_BY_DATI_ANAGRAFICI";
	    	}
	    	else if (p.da_data != null && p.a_data != null)
			{
				p.QUERY = "WORKLIST.WK_RICHIESTE_GROUPER_BY_DATA_RANGE";
			}
	    	else
	    	{
	    		home.NOTIFICA.error({message: "Valorizzare almeno uno dei seguenti criteri: 1) Struttura Anno Cartella 2) Dati Anagrafici 3) Range di Date", title: "Error"});
	    		p.SUCCESS = false;
	    	}
            logger.debug("Carico la wk con la query -> " + p.QUERY);
	    	return p;
	    },

	    caricaWkRichiesteGrouper : function(){

	    	// Valorizzo i filtri delle date solo se le WK non sono mai state inizializzate
	        if(!NS_HOME_ARCHIVIO_WK.wkRichiesteGrouper)
	        {
	            var daData = $("#txtDaDataGrouper").data('Zebra_DatePicker');
	            daData.setDataIso(moment().add(-10,"days").format('YYYYMMDD'));

	            var aData = $("#txtADataGrouper").data('Zebra_DatePicker');
	            aData.setDataIso(moment().format('YYYYMMDD'));
	        }

	        NS_HOME_ARCHIVIO_WK.wkRichiesteGrouper = new WK({
	            id : "ADT_WK_GESTIONE_CARTELLE_GROUPER",
	            container : "divWk",
	            aBind : [],
	            aVal : [],
	            load_callback: null,
	            loadData : false
	        });

	        NS_HOME_ARCHIVIO_WK.wkRichiesteGrouper.loadWk();
			NS_HOME_ARCHIVIO_WK.handlerFiltriRichiesteGrouper();
	    },

	    definisciQueryWKRichiesteCartelle : function(){

			var p =
	        {
	        		"iden_richiesta" : $("#txtIdenRichiesta").val() == "" ? null  :  $("#txtIdenRichiesta").val(),
	        		"cognome" : $("#txtCognomeRichieste").val() == "" ? null  : $("#txtCognomeRichieste").val(), "nome" : $("#txtNomeRichieste").val() == "" ? null : $("#txtNomeRichieste").val(), "data_nascita" : $("#DataNasc").val() == "" ? null : $("#h-DataNasc").val(),
	        		"anno" : $("#txtAnno").val() == "" ? null :  $("#txtAnno").val(), "struttura" : $("#txtStruttura").val() == "" ? null  : $("#txtStruttura").val(), "cartella" : $("#txtNCartellaRich").val() == "" ? null  : $("#txtNCartellaRich").val(),
	        		"da_data" : $("#h-txtDaDataA").val() == "" ? null :  $("#h-txtDaDataA").val(), "a_data" : $("#h-txtADataA").val() == "" ? null :  $("#h-txtADataA").val(),
	        		"SUCCESS" : true,
	        		"QUERY" : ""
	        };

	    	if (p.iden_richiesta != null)
	    	{
	    		p.QUERY = "WORKLIST.WK_GESTIONE_RICHIESTE_CARTELLE_BY_IDEN_RICHIESTA";
	    	}
			else if (p.cartella != null || p.struttura != null || p.anno != null)
			{
				p.QUERY = "WORKLIST.WK_GESTIONE_RICHIESTE_CARTELLE_BY_CARTELLA";
			}
			else if ((p.cognome != null && p.cognome.length >= 2) && (p.nome!= null && p.nome.length >= 2))
	    	{
	    		p.QUERY = "WORKLIST.WK_GESTIONE_RICHIESTE_CARTELLE_BY_DATI_ANAGRAFICI";
	    	}
			else if (p.da_data != null && p.a_data != null)
			{
				p.QUERY = "WORKLIST.WK_GESTIONE_RICHIESTE_CARTELLE_BY_DATA_RANGE";
			}
			else
	    	{
	    		home.NOTIFICA.error({message: "Valorizzare almeno uno dei seguenti criteri: 1) iden richiesta 2) numero di cartella 3) 2 caratteri per nome e cognome 4) range di Date", title: "Error"});
	    		p.SUCCESS = false;
	    	}
	    	logger.debug("Carico la wk con la query -> " + p.QUERY);
	    	return p;
	    },

	    caricaWkRichiesteCartelle : function () {

	    	// Valorizzo i filtri delle date solo se le WK non sono mai state inizializzate
	        if(!NS_HOME_ARCHIVIO_WK.wkRichiesteCartelle)
	        {
	            var daData = $("#txtDaDataA").data('Zebra_DatePicker');
	            daData.setDataIso(moment().add(-10,"days").format('YYYYMMDD'));

	            var aData = $("#txtADataA").data('Zebra_DatePicker');
	            aData.setDataIso(moment().format('YYYYMMDD'));
	        }

			NS_HOME_ARCHIVIO_WK.wkRichiesteCartelle = new WK({
				id : "ADT_WK_GESTIONE_RICHIESTE_CARTELLE",
				container :"divWk",
				aBind : [],
				aVal : [],
				load_callback : null,
				loadData : false
			});

			NS_HOME_ARCHIVIO_WK.wkRichiesteCartelle.loadWk();
			NS_HOME_ARCHIVIO_WK.handlerFiltriRichiestaCartelle();
	    },

	    refreshWk : function(){

	    	switch (NS_HOME_ARCHIVIO.tab_sel)
	    	{
	    		case "filtroCartelle" :
	    			NS_HOME_ARCHIVIO_WK.wkMovimentiCartelle.refresh();
	    			break;

	    		case "filtroGrouper" :
	    			NS_HOME_ARCHIVIO_WK.wkRichiesteGrouper.refresh();
	    			break;

	    		case "filtroRichiesteCartelle" :
	    			NS_HOME_ARCHIVIO_WK.wkRichiesteCartelle.refresh();
	    			break;
	    	}

	    },

		handlerFiltriMovimentiCartella : function(){

			$("#txtNCartella, #txtStrutturaMovimenti, #txtAnnoMovimenti").off("keyup").on("keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtCognome, #txtNome, #txtDaData, #txtAData, #txtReparto");
				var _value = $("#txtNCartella").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").off("click")
						}


						if(filtro.parent().prev(".clickToOggi").length > 0){
							filtro.parent().prev(".clickToOggi").off("click");
						}
					})
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").not(".tagList").on("click", NS_FENIX_TAG_LIST.apriTagList);
						}
						if(filtro.parent().prev(".clickToOggi").length > 0){
							filtro.parent().prev(".clickToOggi").on("click",function(){
								var datapicker = filtro.data('Zebra_DatePicker');
								datapicker.setDataIso(DATE.getOggiYMD());
							})
						}
					})
				}
			});

			$("#txtCognome, #txtNome").off("keyup").on("keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtNCartella, #txtDaData, #txtAData");
				var _value = $("#txtCognome").val() + $("#txtNome").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").off("click")
						}


						if(filtro.parent().prev(".clickToOggi").length > 0){
							//console.log(filtro);
							filtro.parent().prev(".clickToOggi").off("click");
						}
					})
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").not(".tagList").on("click", NS_FENIX_TAG_LIST.apriTagList);
						}
						if(filtro.parent().prev(".clickToOggi").length > 0){
							filtro.parent().prev(".clickToOggi").on("click",function(){
								var datapicker = filtro.data('Zebra_DatePicker');
								datapicker.setDataIso(DATE.getOggiYMD());
							})
						}
					})
				}
			});

			$("#txtDaData, #txtAData").off("keyup").on("change input paste keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtNCartella, #txtCognome, #txtNome");
				var _value = $("#txtDaData").val() + $("#txtAData").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").off("click")
						}


						if(filtro.parent().prev(".clickToOggi").length > 0){
							//console.log(filtro);
							filtro.parent().prev(".clickToOggi").off("click");
						}
					})
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").not(".tagList").on("click", NS_FENIX_TAG_LIST.apriTagList);
						}
						if(filtro.parent().prev(".clickToOggi").length > 0){
							filtro.parent().prev(".clickToOggi").on("click",function(){
								var datapicker = filtro.data('Zebra_DatePicker');
								datapicker.setDataIso(DATE.getOggiYMD());
							})
						}
					})
				}
			});

			$("#lblCampiMovimentiCartelle").click(function () {
				$("#txtNCartella, #txtCognome, #txtNome, #txtDaData, #txtAData, #h-txtDaData, #h-txtAData, #txtAnnoMovimenti, #txtStrutturaMovimenti, #txtReparto").removeAttr("readonly").css({"background":"none"}).val("");
				$(".tdLabelTags").not(".tagList").on("click", NS_FENIX_TAG_LIST.apriTagList);
				$(".clickToOggi").on("click",function(){
					var datapicker = $(this).next(".tdData").find("input").data('Zebra_DatePicker');
					datapicker.setDataIso(DATE.getOggiYMD());
				})
			});

		},

		handlerFiltriRichiesteGrouper : function(){

			$("#txtStrutturaGrouper, #txtAnnoGrouper, #txtNCartellaGrouper").off("keyup").on("keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtCognomeListaRichiesteGrouper, #txtNomeListaRichiesteGrouper, #txtDaDataGrouper, #txtADataGrouper, #h-txtDaDataGrouper, #h-txtADataGrouper");
				var _value = $("#txtStrutturaGrouper").val() + $("#txtAnnoGrouper").val() + $("#txtNCartellaGrouper").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").off("click")
						}


						if(filtro.parent().prev(".clickToOggi").length > 0){
							//console.log(filtro);
							filtro.parent().prev(".clickToOggi").off("click");
						}
					})
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").not(".tagList").on("click", NS_FENIX_TAG_LIST.apriTagList);
						}
						if(filtro.parent().prev(".clickToOggi").length > 0){
							filtro.parent().prev(".clickToOggi").on("click",function(){
								var datapicker = filtro.data('Zebra_DatePicker');
								datapicker.setDataIso(DATE.getOggiYMD());
							})
						}
					})
				}
			});

			$("#txtCognomeListaRichiesteGrouper, #txtNomeListaRichiesteGrouper").off("keyup").on("keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtStrutturaGrouper, #txtAnnoGrouper, #txtNCartellaGrouper, #txtDaDataGrouper, #txtADataGrouper, #h-txtDaDataGrouper, #h-txtADataGrouper");
				var _value = $("#txtCognomeListaRichiesteGrouper").val() + $("#txtNomeListaRichiesteGrouper").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").off("click")
						}


						if(filtro.parent().prev(".clickToOggi").length > 0){
							//console.log(filtro);
							filtro.parent().prev(".clickToOggi").off("click");
						}
					})
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").not(".tagList").on("click", NS_FENIX_TAG_LIST.apriTagList);
						}
						if(filtro.parent().prev(".clickToOggi").length > 0){
							filtro.parent().prev(".clickToOggi").on("click",function(){
								var datapicker = filtro.data('Zebra_DatePicker');
								datapicker.setDataIso(DATE.getOggiYMD());
							})
						}
					})
				}
			});

			$("#txtDaDataGrouper, #txtADataGrouper").off("keyup").on("change input paste keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtStrutturaGrouper, #txtAnnoGrouper, #txtNCartellaGrouper, #txtCognomeListaRichiesteGrouper, #txtNomeListaRichiesteGrouper");
				var _value = $("#txtDaDataGrouper").val() + $("#txtADataGrouper").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").off("click")
						}


						if(filtro.parent().prev(".clickToOggi").length > 0){
							//console.log(filtro);
							filtro.parent().prev(".clickToOggi").off("click");
						}
					})
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").not(".tagList").on("click", NS_FENIX_TAG_LIST.apriTagList);
						}
						if(filtro.parent().prev(".clickToOggi").length > 0){
							filtro.parent().prev(".clickToOggi").on("click",function(){
								var datapicker = filtro.data('Zebra_DatePicker');
								datapicker.setDataIso(DATE.getOggiYMD());
							})
						}
					})
				}
			});

			$("#lblResetCampiGrouper").click(function () {
				$("#txtStrutturaGrouper, #txtAnnoGrouper, #txtNCartellaGrouper, #txtCognomeListaRichiesteGrouper, #txtNomeListaRichiesteGrouper, #txtDaDataGrouper, #txtADataGrouper, #h-txtDaDataGrouper, #h-txtADataGrouper").removeAttr("readonly").css({"background":"none"}).val("");
				$(".tdLabelTags").not(".tagList").on("click", NS_FENIX_TAG_LIST.apriTagList);
				$(".clickToOggi").on("click",function(){
					var datapicker = $(this).next(".tdData").find("input").data('Zebra_DatePicker');
					datapicker.setDataIso(DATE.getOggiYMD());
				})
			});

		},

		handlerFiltriRichiestaCartelle : function(){

			$("#txtIdenRichiesta").off("keyup").on("keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtStruttura, #txtAnno, #txtNCartellaRich, #txtAnno, #txtNomeRichieste, #txtCognomeRichieste, #DataNasc, #txtDaDataA, #h-txtDaDataA, #txtADataA, #h-txtADataA")
				var _value = $("#txtIdenRichiesta").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").off("click")
						}


						if(filtro.parent().prev(".clickToOggi").length > 0){
							//console.log(filtro);
							filtro.parent().prev(".clickToOggi").off("click");
						}
					})
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").not(".tagList").on("click", NS_FENIX_TAG_LIST.apriTagList);
						}
						if(filtro.parent().prev(".clickToOggi").length > 0){
							filtro.parent().prev(".clickToOggi").on("click",function(){
								var datapicker = filtro.data('Zebra_DatePicker');
								datapicker.setDataIso(DATE.getOggiYMD());
							})
						}
					})
				}
			});

			$("#txtStruttura, #txtAnno, #txtNCartellaRich").off("keyup").on("keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtIdenRichiesta, #txtNomeRichieste, #txtCognomeRichieste, #DataNasc, #txtDaDataA, #h-txtDaDataA, #txtADataA, #h-txtADataA");
				var _value = $("#txtStruttura").val() + $("#txtAnno").val() + $("#txtNCartellaRich").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").off("click")
						}


						if(filtro.parent().prev(".clickToOggi").length > 0){
							//console.log(filtro);
							filtro.parent().prev(".clickToOggi").off("click");
						}
					})
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").not(".tagList").on("click", NS_FENIX_TAG_LIST.apriTagList);
						}
						if(filtro.parent().prev(".clickToOggi").length > 0){
							filtro.parent().prev(".clickToOggi").on("click",function(){
								var datapicker = filtro.data('Zebra_DatePicker');
								datapicker.setDataIso(DATE.getOggiYMD());
							})
						}
					})
				}
			});

			$("#txtNomeRichieste, #txtCognomeRichieste, #DataNasc").off("keyup").on("keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtStruttura, #txtAnno, #txtNCartellaRich, #txtAnno, #txtDaDataA, #h-txtDaDataA, #txtADataA, #h-txtADataA, #txtIdenRichiesta");
				var _value = $("#txtNomeRichieste").val() + $("#txtCognomeRichieste").val() + $("#DataNasc").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").off("click")
						}


						if(filtro.parent().prev(".clickToOggi").length > 0){
							//console.log(filtro);
							filtro.parent().prev(".clickToOggi").off("click");
						}
					})
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").not(".tagList").on("click", NS_FENIX_TAG_LIST.apriTagList);
						}
						if(filtro.parent().prev(".clickToOggi").length > 0){
							filtro.parent().prev(".clickToOggi").on("click",function(){
								var datapicker = filtro.data('Zebra_DatePicker');
								datapicker.setDataIso(DATE.getOggiYMD());
							})
						}
					})
				}
			});

			$("#txtDaDataA, #txtADataA").off("keyup").on("change input paste keyup", function(e) {
				if (e.keyCode == 13) { return; }

				var _filtri = $("#txtStruttura, #txtAnno, #txtNCartellaRich, #txtAnno, #txtNomeRichieste, #txtCognomeRichieste, #DataNasc, #txtIdenRichiesta");
				var _value = $("#txtDaDataA").val() + $("#txtADataA").val();

				if (_value !== null && _value !== "") {
					_filtri.attr("readonly","readonly").css({"background-color":"#D8D8D8"}).val("");
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").off("click")
						}


						if(filtro.parent().prev(".clickToOggi").length > 0){
							//console.log(filtro);
							filtro.parent().prev(".clickToOggi").off("click");
						}
					})
				} else {
					_filtri.removeAttr("readonly").css({"background":"none"});
					_filtri.each(function(){
						var filtro = $(this);
						if(typeof filtro.closest(".tdLabelTags") !== "undefined"){
							filtro.closest(".tdLabelTags").not(".tagList").on("click", NS_FENIX_TAG_LIST.apriTagList);
						}
						if(filtro.parent().prev(".clickToOggi").length > 0){
							filtro.parent().prev(".clickToOggi").on("click",function(){
								var datapicker = filtro.data('Zebra_DatePicker');
								datapicker.setDataIso(DATE.getOggiYMD());
							})
						}
					})
				}
			});

			$("#lblResetCampi").click(function () {
				$("#txtStruttura, #txtAnno, #txtNCartellaRich, #txtAnno, #txtNomeRichieste, #txtCognomeRichieste, #DataNasc, #txtDaDataA, #txtADataA, #h-txtDaDataA, #h-txtADataA, #txtIdenRichiesta, #txtStatoCartellaRich, #h-txtStatoCartellaRich").removeAttr("readonly").css({"background":"none"}).val("");
				$(".tdLabelTags").not(".tagList").on("click", NS_FENIX_TAG_LIST.apriTagList);
				$(".clickToOggi").on("click",function(){
					var datapicker = $(this).next(".tdData").find("input").data('Zebra_DatePicker');
					datapicker.setDataIso(DATE.getOggiYMD());
				})
			});

    },

    apriVerbale : function(rec){
        //aspetto url di arry
        var url = 'http://'+ document.location.host + document.location.pathname.match(/\/.*\//) +  "jsp/PS/verbale.jsp?idenContatto="+ rec[0].IDEN_CONTATTO;
        logger.debug(url);
        var _par = {URL:url};
        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);

    },

    where : {
        isAdt : function (rec) {
            var ps = false;
            var adt = false;

            $.each(rec, function (k,v){

                if(rec[k].ASSIGNING_AUTHORITY_AREA === 'ADT'){
                    adt = true;
                }else{
                    ps = true;
                }
            });
            return (!ps && adt);
        },
        isPs : function (rec) {
            var ps = false;
            var adt = false;
            $.each(rec, function (k,v){
                if(rec[k].ASSIGNING_AUTHORITY_AREA === 'PS'){
                    ps =  true;
                }else{
                    adt = true
                }
            });
            return (ps && !adt);
        },
        isPsDiacharged : function (rec) {
            return  NS_HOME_ARCHIVIO_WK.where.isPs(rec)  && rec[0].STATO_CONTATTO == 'DISCHARGED' ;
        }
    }


};