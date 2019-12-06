$(document).ready(function()
{
    NS_FENIX_FILTRI.oldFiltri = NS_FENIX_FILTRI.leggiFiltriDaSalvare();
    NS_FENIX_FILTRI.oldFiltriComparable = NS_FENIX_FILTRI.convertFiltri(NS_FENIX_FILTRI.oldFiltri.filtro);
	if($("#ID_FILTRO_PERSONALE").length > 0){
		NS_FENIX_FILTRI.salvaFiltri(NS_FENIX_FILTRI.oldFiltri, NS_FENIX_FILTRI.salvaFiltriCbk);
	}
});


var NS_FENIX_FILTRI = {

    oldFiltri: null,
    oldFiltriComparable: null,

    applicaFiltri: function (params)
    {
        NS_FENIX_FILTRI.params = (typeof params != 'undefined') ? params : {};
        NS_FENIX_FILTRI.reload = (typeof NS_FENIX_FILTRI.params.reload != 'undefined') ? NS_FENIX_FILTRI.params.reload : false;
        NS_FENIX_FILTRI.force = (typeof NS_FENIX_FILTRI.params.force != 'undefined') ? NS_FENIX_FILTRI.params.force : true;
        NS_FENIX_FILTRI.doMyCbk = (typeof NS_FENIX_FILTRI.params.doMyCbk != 'undefined') ? NS_FENIX_FILTRI.params.doMyCbk : null; /*se function al salvataggio chiama una callback personale */
        NS_FENIX_FILTRI.tabAttivo = (typeof NS_FENIX_FILTRI.params.tabAttivo != 'undefined')?params.tabAttivo:null;

        $(".toUpper", "#filtri").each(function (k, v)
        {
			/*v.value = v.value.replace(/[\xE1]/g, "a'");
			v.value = v.value.replace(/[\xE0]/g, "a'");
			v.value = v.value.replace(/[\xE8]/g, "e'");
			v.value = v.value.replace(/[\xE9]/g, "e'");
			v.value = v.value.replace(/[\xEC]/g, "i'");
			v.value = v.value.replace(/[\xED]/g, "i'");
			v.value = v.value.replace(/[\xF2]/g, "o'");
			v.value = v.value.replace(/[\xF3]/g, "o'");
			v.value = v.value.replace(/[\xF9]/g, "u'");
			v.value = v.value.replace(/[\xFA]/g, "u'");*/
			
            var $v = $(v);
            $v.val($.trim($v.val().toUpperCase()));
        });

        NS_FENIX_FILTRI.jsonFiltri = NS_FENIX_FILTRI.leggiFiltriDaSalvare();

        if(JSON.stringify(NS_FENIX_FILTRI.jsonFiltri) !== JSON.stringify(NS_FENIX_FILTRI.oldFiltri))
        {
            $('[name="ID_FILTRO_PERSONALE"]').val('');
			$('.titlePersonalFilter').text('');
			
			if (NS_FENIX_FILTRI.jsonFiltri.filtro.length != 0)
            {
                logger.debug("Filtri modificati - verifica quali effettivamente modificati");
                NS_FENIX_FILTRI.jsonFiltriComparable = NS_FENIX_FILTRI.convertFiltri(NS_FENIX_FILTRI.jsonFiltri.filtro);

                for (var k in NS_FENIX_FILTRI.jsonFiltriComparable) {
                    if(NS_FENIX_FILTRI.jsonFiltriComparable[k].compare(NS_FENIX_FILTRI.oldFiltriComparable[k]))
                    {
                        NS_FENIX_FILTRI.jsonFiltri.filtro = NS_FENIX_FILTRI.jsonFiltri.filtro.filter(function(el){ return el.id != k; })
                    }
                }
                NS_FENIX_FILTRI.salvaFiltri(NS_FENIX_FILTRI.jsonFiltri, NS_FENIX_FILTRI.salvaFiltriCbk);
            }
            else
            {
                NS_FENIX_FILTRI.salvaFiltriCbk();
            }
        }
        else
        {
            logger.debug("Filtri non modificati");
            NS_FENIX_FILTRI.salvaFiltriCbk();
        }
    },

    salvaFiltriCbk: function()
    {
        NS_FENIX_FILTRI.oldFiltri = NS_FENIX_FILTRI.leggiFiltriDaSalvare();
        NS_FENIX_FILTRI.oldFiltriComparable = NS_FENIX_FILTRI.convertFiltri(NS_FENIX_FILTRI.oldFiltri.filtro);

        //logger.debug("salvaFiltri Callback");
        if($.isFunction(NS_FENIX_FILTRI.doMyCbk))
        {
            NS_FENIX_FILTRI.doMyCbk();
            return;
        }

        if (NS_FENIX_FILTRI.reload)
        {
            home.NS_LOADING.showLoading({timeout: 0});
            var url = LIB.setGetParameter(window.location.href, 'time', new Date().getTime());
            if(NS_FENIX_FILTRI.tabAttivo !== null)url = LIB.setGetParameter(url, 'TAB_ATTIVO', NS_FENIX_FILTRI.tabAttivo);
			window.location.href = url;
        }
        else
            NS_FENIX_WK.aggiorna(NS_FENIX_FILTRI.params);
    },

    salvaFiltri: function (jsonFiltri, cbk)
    {
        $("#savingFilters").addClass("savingFilters");
        var gruppo_filtri = $(".tabActive").attr("data-tab");

        toolKitDB.salvaFiltri(JSON.stringify(jsonFiltri),gruppo_filtri,null, $("#USERNAME").val(), $("#SITO").val(),
            {
                callback: function (response)
                {
                    if (response.result == "KO")
                    {
                        NS_FENIX_FILTRI.errorFiltri(response);
                    }
                    else
                    {
                        $("#savingFilters").removeClass("savingFilters").addClass("savingFiltersOK");
                        setTimeout("$('#savingFilters').removeClass('savingFiltersOK')", 1000);
                        //logger.debug("Salvataggio filtri effettuato correttamente");

                        cbk.call();
                    }
                },
                timeout: 3000,
                errorHandler: function (response)
                {
                    NS_FENIX_FILTRI.errorFiltri(response);
                }
            });
    },
    errorFiltri: function (response)
    {
        $("#savingFilters").removeClass("savingFilters").addClass("savingFiltersKO");
        setTimeout("$('#savingFilters').removeClass('savingFiltersKO')", 1000);
        logger.debug("Errore durante il salvataggio filtri [" + response + "]");
    },
    leggiFiltriDaBindare: function ()
    {
        var idActive = $("#filtri").find(".tabs").data("Tabs").idActive();

        var paramsWk = new Object();
        var aBind = new Array();
        var aVal = new Array();

        $("[data-filtro-bind]", "#" + idActive).each(function (k, v)
        {
            var campo = $(v);
            aBind.push(campo.data("filtro-bind"));
            aVal.push(NS_FENIX_FILTRI.formatValoreFiltro(campo));
        });

        paramsWk.aBind = aBind;
        paramsWk.aVal = aVal;

        return paramsWk;
    },
    formatValoreFiltro: function (campo)
    {
        var valore = campo.val();
        valore = valore.replace(/%/g, "%25");
        switch(campo.data("filtro-tipo"))
        {
            case "N":
                return valore;
                break;
            case "V":
                return (valore == "")?"%25":valore;
                break;
            case "T":
                return (valore == "")?"%25" : valore.like();
                break;
            default:
                return valore;
                break;
        }
    },

    leggiFiltriDaSalvare: function ()
    {
        var jsonFiltri = new Object();
        jsonFiltri.username = $("#USERNAME").val();
        jsonFiltri.sito = $("#SITO").val();
        jsonFiltri.filtro = [];

        var idActive = $("#filtri").find(".tabs").data("Tabs").idActive();

        $("#" + idActive).find("[data-filtro-id]").each(function (k, v)
        {
            $v = $(v);
            var id_filtro = $v.data("filtro-id");
            var tipo_filtro = $v.data("filtro-tipo");

            if ($v.parent().data("CheckBox") != undefined)
            {
                $.each($v.val().split($v.parent().data("CheckBox").getSplitter()), function (key, value)
                {
                    var filtro = new Object();
                    filtro.id = id_filtro;
                    filtro.tipo = tipo_filtro;
                    filtro.val = value;//.replace(/\'/g,"");

                    jsonFiltri.filtro.push(filtro);
                });
            }
            else
            {
                var filtro = new Object();
                filtro.id = id_filtro;
                filtro.tipo = tipo_filtro;
                filtro.val = $v.val();

                jsonFiltri.filtro.push(filtro);
            }
        });



        return jsonFiltri;
    },

    convertFiltri: function(arrayJson)
    {
        var result = {};

        for (var i = 0; i < arrayJson.length; i++)
        {
            var id = arrayJson[i].id;

            if(typeof result[id] == 'undefined'){
                result[id] = [];
            }

            result[id].push(arrayJson[i].val);
        }

        return result;
    }
};

/*Filtri Personali*/
(function($) {

    function El(el)
    {
        return $(document.createElement(el));
    }

    $.fn.personalFilters = function (options)
    {
        if ((typeof(this.data("personalFilters")) != "undefined"))
        {
            return this.data("personalFilters");
        }
        else
        {
            var personalFilters = new PersonalFilters(this.get(0), options);
            this.data("personalFilters", personalFilters);
            return personalFilters;
        }
    }

    function PersonalFilters(el, options)
    {
        this.el = $(el);
        this.settings = $.extend({}, this.defaults, options);
        this.structure = {
            settingIcon: El('i').addClass("icon-cog-1 openPersonalFilters"),
            useIcon: El('i').addClass("icon-forward").attr("title", traduzione.ttUtilizza),
            deleteIcon: El('i').addClass("icon-trash").attr("title", traduzione.ttCancella),
            titleFilter: El('p').addClass("titlePersonalFilter")
        };
        this.init();
        this.setEvents();
        return this;
    }

    PersonalFilters.prototype = {
        defaults: {

        },
        init: function ()
        {
            this.filtersGroup = this.el.attr("data-tab");
            this.idTab = this.el.attr("id");
            this.build();

        },
        setEvents: function ()
        {
            var $this = this;
            $this.structure.settingIcon.on("click", function (e)
            {
                if($this.el.hasClass("tabActive")) {
                    e.stopImmediatePropagation();
                    $this.createContainer(e);
                }
            });
        },

        build:function()
        {
            var $this=this;
            this.el.prepend($this.structure.settingIcon);
            if($("input[name='ID_FILTRO_PERSONALE']").length>0)
            {
                var f_param = $("input[name='ID_FILTRO_PERSONALE']").val();
                var f_arr_param = f_param.split('@');
                if($this.filtersGroup==f_arr_param[0])
                {
                    var f_title= this.el.find(".titlePersonalFilter");
                    var f_name = decodeURIComponent(f_arr_param[1]);
                    if(f_title.length==1)
                        f_title.text("["+f_name+"]");
                    else
                        this.el.append($this.structure.titleFilter.text("["+f_name+"]"));
                }
            }
        },

        createContainer:function(e)
        {
            var $this=this;
            this.el.Popup({
                width:                  200,
                height:                 "auto",
                title:                  traduzione.lblFiltriPersonali,
                startAsVisible:         true,
                arrow:                  true,
                arrowPosition:          'top-left',
                content:                $this.createContent(),
                mousePosition:          e
            });
        },

        createContent: function ()
        {
            var $this = this;
            var $div = $("<div>");
            $div.append($this.createListFilters(), $this.createFooterButtons());
            return $div;
        },

        getListFilters: function ()
        {
            var $this = this;
            var resp = {};

            var params = {
                "gruppo_filtri": $this.filtersGroup,
                "username": $("input[name='USERNAME']").val(),
                "sito": $("input[name='SITO']").val()
            };

            dwr.engine.setAsync(false);
            toolKitDB.getResult("FILTRI.FILTRI_PERSONALI", params, '', function (response)
            {
                resp = response;
            })
            dwr.engine.setAsync(true);

            return resp;
        },

        createListFilters: function ()
        {
            var $this = this;
            var $ul = $("<ul>");
            $.each($this.getListFilters(), function (k, v)
            {
                $ul.append($("<li>", {"class": "itemPersonalFilters", "data-filter_name": v.ID_FILTRO_PERSONALE}).text(v.ID_FILTRO_PERSONALE).append($this.createControlIcons()))
            });

            return $ul;
        },

        createFooterButtons: function ()
        {
            var $this = this;
            return $("<button>", {"class": "btnSavePersonalFilters"}).text(traduzione.butSaveStatoFiltri).on("click", function (e)
            {
                home.DIALOG.nuovoFiltroPersonale(NS_FENIX_FILTRI.leggiFiltriDaSalvare(), $this.filtersGroup, $("input[name='SITO']").val());
            });
        },

        createControlIcons: function ()
        {
            var $this = this;
            var $div = $("<div>", {"class": "right"});
            return  $div.append($this.structure.useIcon.clone().on("click", function (e)
            {
                $this.importPersonalFilter(this);
            }), $this.structure.deleteIcon.clone().on("click", function (e)
            {
                e.stopImmediatePropagation();
                $this.deleteListFilter(this);
            }));
        },

        deleteListFilter: function (el)
        {
            var $this = this;
            var filter = $(el).closest(".itemPersonalFilters");

            var user = $('#USERNAME').val();
            var sito = $('#SITO').val();

            var params = {
                "p_gruppo_filtri": $this.filtersGroup,
                "p_id_filtro_personale": filter.attr("data-filter_name"),
                "p_username": user,
                "p_sito": sito
            };

            toolKitDB.executeFunction("DELETE_FILTRI_PERSONALI", params, function (response)
            {
                if (response.p_result == 'OK')
                {
                    filter.remove();
                    toolKitDB.reloadFiltri(user, sito);
                }
            });
        },

        importPersonalFilter: function (el)
        {
            var $this = this;
            var f_name = $(el).closest(".itemPersonalFilters").attr("data-filter_name");
            var user = $("input[name='USERNAME']").val();
            var sito = $("input[name='SITO']").val();

            var params = {
                "p_gruppo_filtri": $this.filtersGroup,
                "p_id_filtro_personale": f_name,
                "p_username": user,
                "p_sito": sito
            };

            toolKitDB.executeFunction("ATTIVA_FILTRI_PERSONALI", params, function (response)
            {

                if (response.p_result == 'OK')
                {

                    toolKitDB.reloadFiltri(user, sito,
                    {
                        callback:   function(response)
                        {
                            var url = LIB.setGetParameter($().getAbsolutePathServer() + 'page?KEY_LEGAME=' + $('#KEY_LEGAME').val(), 'ID_FILTRO_PERSONALE', $this.filtersGroup + '@' + encodeURIComponent(f_name));
                            url += '&TAB_ATTIVO=' + $this.filtersGroup;
							url += '&time=' + new Date().getTime();
							window.location.href = url;
                        } ,
                        errorHandler: function(errorString, exception)
                        {
                            logger.debug("Errore Reload Filtri   errore :" + errorString);
                        }

                    } )

                }
            });
        }
    }
})(jQuery);