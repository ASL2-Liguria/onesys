String.prototype.multiReplace = function ( hash ) {
    var str = this, key;
    for ( key in hash ) {
        str = str.replace( new RegExp( key, 'g' ), hash[ key ] );
    }
    return str;
};

$(document).ready(function()
{
	NS_FENIX_SCHEDA.init();
	NS_FENIX_SCHEDA.setEvents();
	NS_FENIX_SCHEDA.addMobileSupport();

    home.NS_LOADING.hideLoading();
});

var NS_FENIX_SCHEDA = {

    content:null,
    multi:true,

    /**
     * Configurazione alternativa per il salvataggio
     * array per salvataggi multipli passando sempre tutto il form
     */
    configSave: {
        "f": [{
                // Funzione DB per il salvataggio (SAVE_DATA per salvataggio standard su unica tabella)
                "funzione": ""

                // Datasource della funzione
                , "datasource": ""

                // Tabella di destinazione (facoltativa, di solito si usa solo per il salvataggio standard)
                , "tabella": ""

                // Chiave primaria della tabella (facoltativa, di solito IDEN...)
                , "colonnaChiavePrimaria": ""

                // id del input hidden che contiene il valore della chiave primaria.
                // (da query string &IDEN_TABELLA=nnn finisce in input hidden con id 'IDEN_TABELLA')
                // Nel salvataggio standard se vuoto INSERT altrimenti UPDATE
                , "campoChiavePrimaria": ""

                // colonna xmltype della tabella (facoltativo, di solito per salvataggio standard)
                , "xml": ""
            }
            //,{}
        ]},

	init:function()
	{
        NS_FENIX_SCHEDA.configSave = null,

        NS_FENIX_SCHEDA.content = $(".contentTabs",".tabs");
        LIB.checkParameter(home.basePermission.READONLY,"SCHEDE",false);
        if( (LIB.isValid(home.basePermission.READONLY) &&  LIB.ToF(home.basePermission.READONLY.SCHEDE)) || ($('#READONLY').val()=='S') ) NS_FENIX_SCHEDA.setReadOnly();

        NS_FENIX.init();

        home.NS_CONSOLEJS.addLogger({name:'NS_FENIX_SCHEDA',console:0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_FENIX_SCHEDA'];

		NS_FENIX_SCHEDA.adattaLayout();
	},
	setEvents:function()
	{
		NS_FENIX.setEvents();

		$(".butChiudi").on("click",NS_FENIX_SCHEDA.chiudi);

        NS_FENIX_SCHEDA.setRegistraEvent();

        Mousetrap.bind('ctrl+s',function(){NS_FENIX_SCHEDA.beforeRegistra();return false;});
        Mousetrap.bind('ctrl+q',function(){NS_FENIX_SCHEDA.chiudi();return false;});
        Mousetrap.bind('ctrl+p',function(){NS_FENIX_SCHEDA.stampa();return false;});
        Mousetrap.bind('ctrl+right',function(){NS_FENIX_SCHEDA.nextTab();return false;});
        Mousetrap.bind('ctrl+left',function(){NS_FENIX_SCHEDA.previousTab();return false;});
	},

    setRegistraEvent: function(){
        $('.butLoading').removeClass("butLoading");
        $(".butRegistra,.butSalva,.butSalvaChiudi").off("click");
        $(".butRegistra,.butSalva").one("click", function(){
            $(this).addClass("butLoading");
            NS_FENIX_SCHEDA.beforeRegistra({close:false});
            setTimeout("NS_FENIX_SCHEDA.setRegistraEvent();", 1000);
            // sto commentando questa riga perche se la funzione registra e' molto veloce, in caso di doppio click potrebbe essere richiamata due volte...
            // NS_FENIX_SCHEDA.setRegistraEvent();
        });
        $(".butSalvaChiudi").one("click", function(){
            NS_FENIX_SCHEDA.beforeRegistra({close:true});
            setTimeout("NS_FENIX_SCHEDA.setRegistraEvent();", 1000)
            // vedi sopra... NS_FENIX_SCHEDA.setRegistraEvent();
        });
    },


    addMobileSupport: function() {
		if( $.browser.ipad || $.browser.iphone || $.browser.android ) {
			$( document.createElement('link') )
				.attr({
					'rel':	'stylesheet',
					'href':	'css/mobile.css',
					'type':	'text/css'
				}).appendTo('head');
		}
	},
	
    /*
     da ridefinire all'interno di una scheda per eventualmente aggiungere/modificare alcuni campi nel json default

     ex:
     NS_FENIX_SCHEDA.customizeJson = myCustomizeJson;

     function myCustomizeJson(json)
     {
     json.campo.push(qualcosaJson);
     return json;
     },
     */
    customizeJson:function(json){return json;},
    validateFields:function(){return true;},
    beforeSave:function(params){return true;},
    successSave:function(message){return true;},
    errorSave:function(response){return true;},
    afterSave:function(){return true;},
    beforeClose:function(params){return true;},
    customizeParam:function(params){return params;},

    unicodeReplace: function(str, type)
    {
        // in caso di altri errori, visitare il seguente link e incollare il testo del referto
        //
        // http://mothereff.in/js-escapes

        var replaced = '';
        switch(type)
        {
	        case 'HTML':
	            replaced = str.multiReplace({
	                '\u2026': '&hellip;',
	                '\u201C': '&ldquo;',
	                '\u201D': '&rdquo;',
	                '\u2018': '&lsquo;',
	                '\u2019': '&rsquo;',
	                '\u2013': '&mdash;',
	                '\u2014': '&ndash;',
					'\u2022': '&bull;'
	            });
	            break;
	
	        case 'TEXT':
	            replaced = str.multiReplace({
	                '\u2026': '...',
	                '\u201C': '\"',
	                '\u201D': '\"',
	                '\u2018': '\'',
	                '\u2019': '\'',
	                '\u2013': '-',
	                '\u2014': '-',
					'\u2022': '-'
	            });
	            break;
        }
        return replaced;
    },

    beforeRegistra:function(params){
        NS_FENIX_SCHEDA.registra(params);
    },

    registra:function(params)
        /*{
         [extern]           aggiunge i dati del form EXTERN (default false)
         [close]	        chiude la pagina dopo il salvataggio (default false)
         [valida]	        indica se il form deve essere validato (default true)
         [customizeParam(params)]   function per personalizzare i parametri
         [beforeSave(params)]       function eseguita prima di far partire il salvataggio, deve ritornare true/false
         [customizeJson(params)]    function per personalizzare il json da inviare ala dwr di salvataggio
         [successSave(response)]    function richiamata in caso di successo
         [errorSave(response)]      function richiamata in caso di errore
         [afterSave(void)]          function richiamata alla fine del salvataggio in ogni caso
         }*/
    {
        if(!home.NS_SESSION_CONTROL.checkSession())
        {
            home.NS_SESSION_CONTROL.openDialogErrorSession();
            return;
        }
        if(typeof params == 'undefined') params = {};

        LIB.checkParameter(params,'extern',false);
        LIB.checkParameter(params,'close',false);
        LIB.checkParameter(params,'valida',true);

        LIB.checkParameter(params,'customizeParam',NS_FENIX_SCHEDA.customizeParam);
        params.customizeParam(params);

        if(params.valida)
        {
            if(!NS_FENIX_SCHEDA.validateFields())
                return false;
        }

        LIB.checkParameter(params,'beforeSave',NS_FENIX_SCHEDA.beforeSave);
        if(!params.beforeSave(params))
        {
            logger.info("NS_FENIX_SCHEDA.beforeSave");
            return false;
        }

        var dati = $('.dati', 'body').serialize();
        var jsonSave = NS_FENIX_SCHEDA.leggiCampiDaSalvare();
        /*Se viene settato il parametro extern a true aggiungo al json il form EXTERN*/
        if(params.extern)
        {
            $("input","form#EXTERN").each(function(k,v)
            {
                var campo	= new Object();
                campo.id	= $(v).attr("id");
                campo.col	= $(v).attr("name");
                campo.val	= $(v).val();

                jsonSave.campo.push(campo);
            });
        }
        else
        {
            jsonSave.campo.push({id: "SITO", val: $("form#EXTERN #SITO").val()});
            jsonSave.campo.push({id: "VERSIONE", val: $("form#EXTERN #VERSIONE").val()});
        }
        LIB.checkParameter(params,'customizeJson',NS_FENIX_SCHEDA.customizeJson);
        jsonSave = params.customizeJson(jsonSave);

        home.NS_LOADING.showLoading({timeout: 0});
        if (NS_FENIX_SCHEDA.configSave)
        {
            NS_FENIX_SCHEDA.salvaLoop(params, jsonSave);
        }
        else
        {
            NS_FENIX_SCHEDA.salvaSingolo(params, jsonSave, NS_FENIX_SCHEDA.cbkSalvaSingolo, NS_FENIX_SCHEDA.koSalvaSingolo);
        }
    },

    salvaLoop: function (params, jsonSave)
    {
        var arr = NS_FENIX_SCHEDA.configSave.f;
        var response = "";

        $.each(arr, function(i,v)
        {
            response = NS_FENIX_SCHEDA.salvaMultiplo(params, jsonSave, NS_FENIX_SCHEDA.cbkSalvaMultiplo, NS_FENIX_SCHEDA.koSalvaMultiplo, v);

            return response;
        });

        var resp = {};
        resp.result = response.toString().split("$")[0];
        resp.message = response.toString().split("$")[1];

        home.NS_LOADING.hideLoading();

        if(resp.result == "OK")
            NS_FENIX_SCHEDA.okSalva(params, resp);
        else
            NS_FENIX_SCHEDA.koSalva(params, resp);
    },

    salvaMultiplo: function (params, jsonSave, cbkOK, cbkKO, el)
    {
        jsonSave.proceduraSalvataggio	= el.funzione;
        jsonSave.connessioneSalvataggio	= el.datasource;
        jsonSave.tabellaSalvataggio		= el.tabella;
        jsonSave.colonnaChiavePrimaria	= el.colonnaChiavePrimaria;
        jsonSave.campoChiavePrimaria	= el.campoChiavePrimaria;
        jsonSave.nomeCampoXml	        = el.xml;
        jsonSave.valoreChiavePrimaria	= ($("#"+jsonSave.campoChiavePrimaria).val() != null) ? $("#"+jsonSave.campoChiavePrimaria).val() : "";

        var res;

        try
        {
            dwr.engine.setAsync(false);
            toolKitDB.salvaScheda(JSON.stringify(jsonSave),
                {
                    callback: function (response)
                    {
                        res = NS_FENIX_SCHEDA.cbkSalvaMultiplo(params, response, jsonSave);
                    },
                    timeout: 4000,
                    errorHandler: function (response)
                    {
                        res = NS_FENIX_SCHEDA.koSalvaMultiplo(params, response, jsonSave);
                    }
                });
            dwr.engine.setAsync(true);
        }
        catch (e)
        {
            logger.error("toolKitDB.salvaScheda [" + e.description + "]");
        }

        return res;
    },

    cbkSalvaMultiplo: function(params, response, jsonSave)
    {
        logger.info("salvataggio eseguito");
        logger.info(JSON.stringify(response));

        switch (response.result)
        {
            case 'OK':
                //  Setta il valore della chiave primaria ritornato
                var campo = jsonSave.campoChiavePrimaria;
                var input = $('#' + campo);
                if(input.length == 0){input = $('<input>',{"name":campo,"id":campo,"type":"hidden"}).appendTo('#EXTERN');}
                input.val(response.message);

                return "OK$" + response.message;
                break;

            case 'KO':
                return NS_FENIX_SCHEDA.koSalvaMultiplo(params, response);
                break;
        }
        home.NS_LOADING.hideLoading();
    },

    koSalvaMultiplo: function(params, response, jsonSave)
    {
        home.NS_LOADING.hideLoading();
        return "KO$" + response;
    },

    salvaSingolo: function (params, jsonSave, cbkOK, cbkKO)
    {
        try
        {
            toolKitDB.salvaScheda(JSON.stringify(jsonSave),
                {
                    callback: function (response)
                    {
                        home.NS_LOADING.hideLoading();
                        cbkOK(params, response);
                    },
                    timeout: 4000,
                    errorHandler: function (response)
                    {
                        home.NS_LOADING.hideLoading();
                        cbkKO(params, response);
                    }
                });
        }
        catch (e)
        {
            logger.error("toolKitDB.salvaScheda [" + e.description + "]");
        }
    },

    cbkSalvaSingolo: function(params, response)
    {
        switch (response.result){
            case 'OK':
                //  Setta il valore della chiave primaria ritornato
                NS_FENIX_SCHEDA.checkIden(response.message);

                NS_FENIX_SCHEDA.okSalva(params, response);
                break;

            case 'KO':
                NS_FENIX_SCHEDA.koSalva(params, response);
                break;
        }
    },

    koSalvaSingolo: function(params, response)
    {
        NS_FENIX_SCHEDA.koSalva(params, response);
    },

    okSalva: function(params, response)
    {
        home.NOTIFICA.success({message: traduzione.successSave, timeout: 2, title: traduzione.successTitleSave});
        LIB.checkParameter(params,'successSave',NS_FENIX_SCHEDA.successSave);
        params.successSave(response.message);

         LIB.checkParameter(params,'afterSave',NS_FENIX_SCHEDA.afterSave);
         if(!params.afterSave(response.message)) logger.error("NS_FENIX_SCHEDA.afterSave");
         if(params.close) NS_FENIX_SCHEDA.chiudi(params);

        NS_FENIX_SCHEDA.setRegistraEvent();
    },

    koSalva: function(params, response)
    {
        home.NOTIFICA.error({message: traduzione.errorSave, title: traduzione.errorTitleSave});
        if(response.message)
            logger.error("errorHandler -> " + response.message);
        else
            logger.error("errorHandler -> " + response);

        LIB.checkParameter(params,'errorSave',NS_FENIX_SCHEDA.errorSave);
        params.errorSave(response);

        LIB.checkParameter(params,'afterSave',NS_FENIX_SCHEDA.afterSave);
        if(!params.afterSave()) logger.error("NS_FENIX_SCHEDA.afterSave");

        NS_FENIX_SCHEDA.setRegistraEvent();
    },

    checkIden: function(iden)
    {
        var campo = $("[data-procedura-salvataggio]").data("campo-chiave-primaria");
        var input = $('#' + campo);
        if(input.length == 0){input = $('<input>',{"name":campo,"id":campo,"type":"hidden"}).appendTo('#EXTERN');}
        input.val(iden);
    },

	chiudi:function(params)
	{
        if(typeof params == 'undefined') params = {};
        LIB.checkParameter(params,'refresh',false);
        var n_scheda = $("#N_SCHEDA").val();

        if(!NS_FENIX_SCHEDA.beforeClose(params))
        {
            logger.error("NS_FENIX_SCHEDA.beforeClose");
            return false;
        }

        if(params.refresh)
        {
            try {
                NS_FENIX.aggiorna();
            } catch (e) {
                logger.warn("problema in NS_FENIX.aggiorna()");
            }
        }

		home.NS_FENIX_TOP.chiudiScheda({"n_scheda":n_scheda});
	},

	stampa:function()
	{

	},

    checkValore: function(val,up)
    {
        var valore = $.trim(LIB.isValid(val) ? val : '');

        var up = (up != 'undefined') ? up : true;

        return (valore) ? (up) ? valore.toUpperCase() : valore : '';
    },

	leggiCampiDaSalvare:function()
	{
		var $form = $("[data-procedura-salvataggio]");

        var jsonSave		= new Object();
        jsonSave.username           	= $("#USERNAME","#EXTERN").val();
        jsonSave.iden_per           	= $("#USER_IDEN_PER","#EXTERN").val();
		jsonSave.proceduraSalvataggio	= $form.data("procedura-salvataggio");
		jsonSave.connessioneSalvataggio	= $form.data("connessione-salvataggio");
		jsonSave.tabellaSalvataggio		= $form.data("tabella-salvataggio");
		jsonSave.colonnaChiavePrimaria	= $form.data("colonna-chiave-primaria");
		jsonSave.campoChiavePrimaria	= $form.data("campo-chiave-primaria");
		jsonSave.nomeCampoXml	        = $form.data("nome-campo-xml");
		jsonSave.valoreChiavePrimaria	= ($("#"+jsonSave.campoChiavePrimaria).val() != null) ? $("#"+jsonSave.campoChiavePrimaria).val() : "";

		jsonSave.campo	= [];

        $('input', $form).each(function (k, v)
        {
            var $v = $(v);

            if(typeof $v.attr("id") == 'undefined' || $v.attr("id") == '')
                return;

            var campo = new Object();
            campo.id = $v.attr("id");

            if($v.data("col-save"))
                campo.col = $v.data("col-save");

            var up = !(LIB.isValid($v.attr("data-toupper")) && ($v.attr("data-toupper") == 'N'));

            if($v.parent().data('RadioBox'))
            {
                var radio = $v.parent().data('RadioBox');
                campo.val = NS_FENIX_SCHEDA.checkValore(radio.val(),false);
                campo.descr = NS_FENIX_SCHEDA.checkValore(radio.descr(), up);
            }
            else if($v.parent().data('CheckBox'))
            {
                var check = $v.parent().data('CheckBox');
                campo.val = NS_FENIX_SCHEDA.checkValore(check.val(),false);
                campo.descr = NS_FENIX_SCHEDA.checkValore(check.descr(), up);
            }
            else
            {
                if($v.attr('type')!= 'file')
                {
                    campo.val = NS_FENIX_SCHEDA.checkValore($v.val(), up);
                    $v.val(campo.val);

                }
            }

            jsonSave.campo.push(campo);
        });

        $('select', $form).each(function (k, v)
        {
            var $v = $(v);

            var campo = new Object();
            campo.id = $v.attr("id");
            if($v.data("col-save"))
                campo.col = $v.data("col-save");

            if ($v.prop("multiple"))
            {
                valore = [];
                descr = [];

                //  per html standard usare ==> $v.find(":selected").each(function ()
                $('option', $v).each(function ()
                {
                    valore.push($(this).val());
                    descr.push($(this).text());
                });

                campo.val = valore;
                campo.descr = descr;
            }
            else
            {
                campo.val = LIB.isValid($v.find(":selected").val()) ? $v.find(":selected").val() : '';
                campo.descr = $.trim($v.find(":selected").text());
            }

            jsonSave.campo.push(campo);
        });

        $('textarea', $form).each(function (k, v)
        {
            var $v = $(v);

            var campo = new Object();
            campo.id = $v.attr("id");
            if($v.data("col-save")) {
                campo.col = $v.data("col-save");
			}
			
			/*se tinyMCE non esiste va in errore senza il primo controllo (Chrome, Firefox)*/
            if(typeof tinyMCE != "undefined" && LIB.isValid(tinyMCE) && LIB.isValid(tinyMCE.get(campo.id))) {
				campo.val = tinyMCE.get(campo.id).getContent();
				campo.val = NS_FENIX_SCHEDA.unicodeReplace(campo.val, 'HTML');
			}	
			else {
				campo.val = LIB.isValid($.trim($v.val())) ? $.trim($v.val()) : '';
				campo.val = NS_FENIX_SCHEDA.unicodeReplace(campo.val, 'TEXT');
			}

            jsonSave.campo.push(campo);
        });

        $('img[data-col-save]').each(function (k, v)
        {
            var $v = $(v);

            var campo = new Object();
            campo.id = $v.attr("id");
            campo.col = $v.data("col-save");
            campo.val = $v.mapster('get');

            jsonSave.campo.push(campo);
        });

		return jsonSave;
	},

	registrachiudi:function(params)
	{

	},

	adattaLayout:function()
	{
		var hWin = LIB.getHeight();
		var body = $("body");
		var paddingBody = body.pixels("paddingTop") + body.pixels("paddingBottom");

        NS_FENIX_SCHEDA.content.height(hWin - $(".ulTabs",".tabs").outerHeight() - $(".headerTabs",".tabs").outerHeight() - $(".footerTabs",".tabs").outerHeight() - paddingBody);
        /* TODO commentare la riga sopra e decommentare le righe sotto dopo aver sostituito TABULAZIONE.INIT con TABULAZIONE.ANTISCROLL in HTML_STRUTTURA per attivare l'antiscroll */
        /*NS_FENIX_SCHEDA.content.closest('.antiscroll-box').height(hWin - $(".ulTabs",".tabs").outerHeight() - $(".headerTabs",".tabs").outerHeight() - $(".footerTabs",".tabs").outerHeight() - paddingBody);
        NS_FENIX_SCHEDA.content.closest('.antiscroll-inner').height(hWin - $(".ulTabs",".tabs").outerHeight() - $(".headerTabs",".tabs").outerHeight() - $(".footerTabs",".tabs").outerHeight() - paddingBody);
        NS_FENIX_SCHEDA.content.closest('.antiscroll-wrap').antiscroll(); */
        var scrollParameters	=
        {
            'autoReinitialise':		false,
            'showArrows':			true,
            'mouseWheelSpeed':		50
        };

        NS_FENIX_SCHEDA.scrollParameters = scrollParameters;
       // NS_FENIX_SCHEDA.content.jScrollPane(scrollParameters);


	},

    allineaAltezzaFieldSet:function(params)
    {
        var h_max=0;
        if(typeof(params.height) == "undefined")
        {
            $.each(params.arr_fld,function(k,v)
            {
                if(v.innerHeight()>h_max)
                    h_max= v.innerHeight();
            });
        }
        else
        {
            h_max = params.height;
        }

        $.each(params.arr_fld,function(k,v)
        {
            v.height(h_max);
        });
    },

    addFieldsValidator: function (params)
    {
        var formId = (LIB.isValid(params.formId)) ? params.formId : 'dati';
        var config = (LIB.isValid(params.config)) ? params.config : 'VDEFAULT';

        var $form = $('#' + formId);

        if($form.data('validator'))
            $form.data('validator').reset();

        $form.validate(config);

        NS_FENIX_SCHEDA.validateFields = function ()
        {
            return $form.data("validator").valid();
        }
        return $form.data('validator');
    },
    /*Elimina i btn di Salvataggio dalla scheda*/
    setReadOnly:function(){
        $(".butSalva").remove();
        $(".butRegistra").remove();
        $(".butRegistraStampa").remove();
        Mousetrap.unbind('ctrl+s');
    },
    nextTab:function(){
        var $tabs =$('.tabs li');
        var len=$tabs.length;
        $.each($tabs,function(k,v){
            if($(v).hasClass('tabActive')){
                var idx=(k < ($tabs.length -1))? (k+1):k=0;
                $tabs.eq(idx).trigger('click');
                return false;
            }
        });
    },
    previousTab:function(){
        var $tabs =$('.tabs li');
        var len=$tabs.length;
        $.each($tabs,function(k,v){
            if($(v).hasClass('tabActive')){
                var idx=(k < ($tabs.length -1))? (k-1):k=$tabs.length;
                $tabs.eq(idx).trigger('click');
                return false;
            }
        });
    }
};