$(document).ready(function ()
{
    NS_FENIX_WK.init();
    NS_FENIX_WK.setEvents();

    NS_FENIX.setAggiorna(NS_FENIX_WK.aggiornaWk);
    NS_FENIX_WK.addMobileSupport();
    home.NS_LOADING.hideLoading();
});

var NS_FENIX_WK = {

    idDivWk:null,

    params:{},

    init: function ()
    {
        NS_FENIX.init();

        home.NS_CONSOLEJS.addLogger({name: $("#KEY_LEGAME").val(), console: 0});
        window.logger = home.NS_CONSOLEJS.loggers[$("#KEY_LEGAME").val()];

        NS_FENIX_WK.idDivWk = $('.adaptiveContainer').attr('id');

        NS_FENIX_WK.adattaAltezzaWk();
    },
    setEvents: function ()
    {
        NS_FENIX.setEvents();
        NS_FENIX_TAG_LIST.setEvents();
        NS_FENIX_WK.setApplicaEvent();
        NS_FENIX_WK.setInputEnterEvent();

        Mousetrap.bind('ctrl+r', function ()
        {
            NS_FENIX.aggiorna();
            return false;
        });
    },
    addMobileSupport: function()
	{
		
		if( $.browser.ipad || $.browser.iphone || $.browser.android )
		{
			
			$( document.createElement('link') )
				.attr({
					'rel':	'stylesheet',
					'href':	'css/mobile.css',
					'type':	'text/css'
				})
				.appendTo('head');
			
			$( document.createElement('meta') )
				.attr({
					'name':			'viewport',
					'content':		'width=device-width, initial-scale=1, maximum-scale=1'	
				})
				.appendTo('head');
			
		}
		
	},
    
    adattaAltezzaWk: function ()
    {
        var $body = $('body');
        var hDiv = home.$('#iContent').height() - $body.padding().top - $body.padding().bottom - $("#filtri").outerHeight(true);
        $(".adaptiveContainer").height(hDiv);
    },
    beforeApplica: function()
    {
        return true;
    },
    setApplicaEvent: function ()
    {
        //$(".butApplica").on("click", NS_FENIX_FILTRI.applicaFiltri);
        $(".butApplica").one("click", function()
        {

            /*------*/
           /* var idActive = $("#filtri").find(".tabs").data("Tabs").idActive();

            $("#" + idActive).find("input[data-filtro-bind]").each(function (k, v){
               alert($(v).attr("id"));
            });*/

            /*-------*/

            if(!NS_FENIX_WK.beforeApplica())
            {
                NS_FENIX_WK.setApplicaEvent();
                return false;
            }

            NS_FENIX_FILTRI.applicaFiltri(NS_FENIX_WK.params);
            NS_FENIX_WK.setApplicaEvent();
        });
    },
    setInputEnterEvent: function ()
    {
        $("input", "form#filtri").on("keypress", function (e)
        {
            if (e.keyCode == 13)
            {
            	if(!LIB.isValid($(this).val()))
                    return false;

                if(!NS_FENIX_WK.beforeApplica())
                	return false;

                NS_FENIX_FILTRI.applicaFiltri();
                return false;
            }
        });
    },

    aggiorna: function (params)
    {
        NS_FENIX_WK.aggiornaWk(params);
    },
    refreshWK  : function ()
    {
        var sub = $('#' + NS_FENIX_WK.idDivWk).worklist();
        var subWk = sub.sub_worklist.get();
        if(!subWk)
        {
            sub.data.load();
        }
        else
        {
            subWk.data.load();
        }
    },

    aggiornaWk: function (params)
        /*{
         [force] true/false forza l'aggiornamento della wk chiudendo i dettagli, default true
         }*/
    {
        var params = (typeof params == 'undefined') ? {} : params;

        var force = (typeof params.force == 'undefined') ? true : params.force;

        var idWorklist = $("#" + $("#filtri").find(".tabs").data("Tabs").idActive()).data("id-worklist");

        var paramsWk = NS_FENIX_FILTRI.leggiFiltriDaBindare();
        paramsWk.aBind.push("username");
        paramsWk.aVal.push($("#USERNAME").val());
        paramsWk.aBind.push('sito');
        paramsWk.aVal.push(home.NS_FENIX_TOP.sito);

        paramsWk = NS_FENIX_WK.beforeAggiornaWk(paramsWk);

        var sub = $('#' + NS_FENIX_WK.idDivWk).worklist();
        var subWk = sub.sub_worklist.get();

        if(force || !subWk)
        {
            sub.data.where.init();
            sub.data.where.set('', paramsWk.aBind, paramsWk.aVal);
            sub.data.load();

            logger.debug("Worklist [" + idWorklist + "] refresh con [" + JSON.stringify(paramsWk) + "]");
        }
        else
        {
            logger.debug("Worklist refresh");
            subWk.data.load();
        }
    },

    caricaWk: function ()
    {
        var idWorklist = $("#" + $("#filtri").find(".tabs").data("Tabs").idActive()).data("id-worklist");

        var params = NS_FENIX_FILTRI.leggiFiltriDaBindare();
        params.aBind.push("username");
        params.aVal.push($("#USERNAME").val());
        params.aBind.push('sito');
        params.aVal.push(home.NS_FENIX_TOP.sito);
        params.id = idWorklist;

        params = NS_FENIX_WK.beforeCaricaWk(params);
        //alert(JSON.stringify(params));return;

        var objWk = new WK(params);
        objWk.loadWk();

        logger.debug("Worklist [" + idWorklist + "] caricata con [" + JSON.stringify(params) + "]");
    },

    beforeAggiornaWk: function(params){return params;},
    beforeCaricaWk: function(params){return params;}
};
