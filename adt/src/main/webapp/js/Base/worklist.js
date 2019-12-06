(function($)
{
    /* Oggetto per la gestione degli oggetti! Si pu� utilizzare per salvare qualunque oggetto (anche per i parametri dati per l'ajax) */
    $.managerObject = function()
    {
        var ret =
        {
            object: {},
            last_name: null,

            set: function(n, o)
            {
                this.last_name = n;

                if(LIB.isValid(n))
                    this.object[n] = o;

                return this;
            },

            remove: function(n)
            {
                if(LIB.isValid(n))
                    delete this.object[n];
                else
                if(LIB.isValid(this.last_name))
                    delete this.object[this.name];

                return this;
            },

            get: function(n)
            {
                if(LIB.isValid(n) && this.object[n])
                    return this.object[n];
                else
                if(LIB.isValid(this.last_name) && this.object[this.name])
                    return this.object[this.name];
                else
                    return null;
            },

            clear: function()
            {
                for(var n in this.object) delete this.object[n];

                return this;
            }
        };

        return ret;
    };

    $.managerWhere = function(fnc_callback)
    {
        var ret =
        {
            callback: (LIB.isValid(fnc_callback) ? fnc_callback:null),
            content: null,
            bind_name: new Array(0),
            bind_value: new Array(0),

            invoke_callback: function()
            {
                if(this.callback != null)
                    this.callback();
            },

            init: function()
            {
                this.content = '';
                this.bind_name = new Array(0);
                this.bind_value = new Array(0);
            },

            set: function(w, a_n, a_v)
            {
                this.init();

                this.content = w;

                if(LIB.isValid(a_n) && LIB.isValid(a_v))
                {
                    this.bind_name = a_n;
                    this.bind_value = a_v;

                    this.invoke_callback();
                }
            },

            add_bind: function(n, v)
            {
                if(LIB.isValid(n))
                {
                    this.bind_name.push(n);
                    this.bind_value.push(LIB.isValid(v) ? v:'');

                    this.invoke_callback();
                }
            },

            set_bind: function(n, v)
            {
                var i = this.bind_name.indexOf(n);

                if(i >= 0)
                    this.bind_value[i] = v;
                else
                    this.add_bind(n, v);

                this.invoke_callback();
            },

            remove_bind: function(n)
            {
                var i = this.bind_name.indexOf(n);

                if(i >= 0)
                {
                    this.bind_name.splice(i, 1);
                    this.bind_value.splice(i, 1);

                    this.invoke_callback();
                }
            }
        };

        return ret;
    };

    /* Funzione per creare l'elemento html (inutile, ma non si sa mai!) */
    $.createElement = function(name)
    {
        return $(document.createElement(name));
    };

    /* Metodo privato per creare l'oggetto della worklist (almeno e' piu' "ordinato") */
    $.createWorklist = function(dest, cfg_wk, cfg_srv)
    {
        var wk = null;

        /* eh eh eh... moh non mi incula! */
        if(LIB.isValid($(dest).data('wkPlugin')))
        {
            wk = $(dest).data('wkPlugin');

            if(LIB.isValid(cfg_wk))
            {
                $(dest).removeData('wkPlugin');

                wk.structure.container.empty();
                wk.structure.container.remove();

                delete wk;
            }
            else
                return wk;
        }

        if(!LIB.isValid(cfg_wk))
            return null;

        if(LIB.isValid(cfg_wk.cache))
            $.extend(cfg_wk.cache, {key_region: $('form#EXTERN input#KEY_LEGAME').val()})

        wk = $.NS_WORKLIST_COMPONENT.WORKLIST(cfg_srv, cfg_wk);

        /* eh eh eh moh ci divertiamo! */
        /* Se eistono delle fonti di dati esterni, li setto all'interno dell'oggetto data */
        if(LIB.isValid(cfg_wk.sources) && cfg_wk.sources.length > 0)
            wk.data.sources.urls = cfg_wk.sources;

        $.extend(true, wk.callback, cfg_wk.callback);

        $.extend(wk,
            {
                sub_worklist:
                {
                    object: null,

                    set:function(obj)
                    {
                        this.object = obj;
                    },

                    get: function()
                    {
                        return this.object;
                    },

                    clear: function()
                    {
                        this.object = null;
                    }
                },

                init: function(target)
                {
                    if(LIB.isValid(this.config.structure.columns) && LIB.isValid(target))
                    {
                        this.callback.invoke("build.before", this);

                        var objects     = this.structure.objects;
                        var builder     = this.builder;
                        var container   = builder.container(); /* Div contenitore di tutto! ^_^ */

                        /* Converto il target html in oggetto jquery */
                        target = $(target);

                        /* Inizializzo per prudenza o per pignolagine (come direbbe qualcuno!) */
                        objects.clear();

                        /* Lo appendo per primo, cosi' ho gia' le dimensioni dei blocchi! */
                        target.append(container.css({'width' : target.outerWidth(), 'height' : target.outerHeight()}));

                        /* Prima di tutti, il loading... che sta sopra a tutto!*/
                        container.append(builder.loading());

                        objects.get('loading').show();

                        /* Parte per la selezione delle colonne (se e' attiva!) */
                        if(this.config.structure.select_columns)
                            container.append(builder.context_columns());

                        /* Corpo della worklist */
                        container.append(builder.group());

                        if(this.config.structure.use_pager)
                            container.append(builder.footer());

                        /*, 'scrollInertia':0*/
                        objects.get('group').mCustomScrollbar(
                        {
                            'axis':'x',
                            'theme':'minimal-dark',
                            'mouseWheel': {'enable': false},
                            'scrollInertia':0,
                            'callbacks':
                            {
                                whileScrolling: function()
                                {
                                    var scroll_v    = $('.mCSB_scrollTools_vertical', objects.get('group'));
                                    //var left        = objects.get('group_content').position().left;
                                    var left        = objects.get('group_content').parent().position().left;

                                    scroll_v.css({'left': (container.outerWidth() + Math.abs(left) - scroll_v.outerWidth() + (left > 0 ? 6 : -2)) + 'px'});
                                }
                            }
                        });

                        objects.get('d_body').mCustomScrollbar({'axis':'y', 'theme':'minimal-dark', 'scrollInertia':0});

                        this.adjust.all();
                        this.events.init();
                        this.cache.init();

                        this.page.init();

                        objects.get('loading').hide();
                    }
                    else
                    {
                        // TODO: logger
                    }
                }
            });

        wk.init(dest);

        $(dest).data('wkPlugin', wk);

        wk.callback.invoke("build.after", this);

        return wk;
    };

    $.fn.extend
    ({
        selectedLine: function(multi, cls, keepSelection)
        {
            var $this = $(this);
            var data =  $this.data('wk_data');

            var keep = (typeof keepSelection == 'undefined') ? false : keepSelection;

            var init = function()
            {
                $(this).parent().find('.rowSel').each(function(){$(this).removeClass('rowSel').removeClass(cls)});

                data._root.selected.init();
            };

            if(!LIB.isValid(multi))
                multi = '*'; /* Di default lascio selezionare qualunque cosa! ^_^ */
            else
                multi = $.trim(multi);

            if(!LIB.isValid(cls))
                cls = 'clsSel';

            if($.trim(multi) == '')
                init.call(this);
            else
            {
                if(multi != '*')
                {
                    var r = data.get_row($this.data('index'));
                    var rs = data._root.selected.indexs;

                    for(var i = 0; i < rs.length; i++)
                    {
                        if(r[multi] != data.get_row(rs[i])[multi])
                        {
                            init.call(this);
                            break;
                        }
                    }
                }
            }

            if($this.hasClass(cls))
            {
                if(!keep)
                {
                    data._root.selected.remove($this.data('index'));

                    $this.removeClass('rowSel ' + cls);
                }
            }
            else
            {
                data._root.selected.append($this.data('index'));

                $this.addClass('rowSel ' + cls);
            }
        },

        getAbsolutePathServer: function()
        {
            //return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/' + window.location.pathname.split('/')[1] + '/';
            return location.protocol + "//" + location.host + window.location.pathname.substring(0, window.location.pathname.indexOf("/", 1)) + '/';
        },

        setEventToOpenDetailPage: function(data, wk_source, url)
            /*
             Crea il pulsante in worklist con [+][-] per aprire una pagina nella tr di dettaglio
             */
        {
            var sito_versione = '&SITO=' + $("#SITO").val() + '&VERSIONE=' + $("#VERSIONE").val();
            var button  = $.createElement('button').attr('type', 'button').addClass('btnWk').append($.createElement('i').addClass('icon-plus'));
            var $this = $(this);

            button.on('click', function()
            {
                $this.openDetailPage(data, wk_source, url+sito_versione, $this);
            });

            return button;
        },

        openDetailPage: function(data, wk_source, url, tr_work)
        {
            var i   = $('i', tr_work).first();
            var tr  = $(tr_work).closest('tr').next('tr');

            if(i.hasClass('icon-minus'))
            {
                tr.hide();
                $('iframe', tr).remove();
                i.removeClass('icon-minus').addClass('icon-plus');
                //wk_source.sub_worklist.clear();
            }
            else
            {
                i.removeClass('icon-plus').addClass('icon-minus');
                var iframe = $('<iframe>',{
                    "class":"clsDetailIframe",
                    "src":url
                });

                tr.on('contextmenu',function(){return false;});

                var td = $('td', tr).addClass('tdDetailPage').append(iframe);
                /*tr.show();*/
                tr.display(true);
            }
        },

        openDetailRow: function(idx, data, wk_source, fncBeforeOpen)
        {

            var $this=$(this);
            var button  = $.createElement('button').attr('type', 'button').addClass('btnWk').append($.createElement('i').addClass('icon-plus'));

            var fncBeforeOpenCall = (typeof  fncBeforeOpen != 'undefined' && fncBeforeOpen != null  && typeof  fncBeforeOpen == 'function') ?  fncBeforeOpen : $this.defaultFunctionBefore;

            button.on('click', function(e){
                fncBeforeOpenCall($this,idx, data, wk_source)

            });
            return button;
        },
        defaultFunctionBefore: function(obj,idx, data, wk_source)
        {

            obj.cbkOpen(idx, data, wk_source)
        },


        cbkOpen:function(idx, data, wk_source) {

            var tr_work = $(this);
            var i   = $('i', this).first();
            var tr  = tr_work.closest('tr').next('tr');

            if(i.hasClass('icon-minus'))
            {
                tr.hide();
                $('div', tr).remove();
                i.removeClass('icon-minus').addClass('icon-plus');
                wk_source.sub_worklist.clear();
            }
            else
            {
                var ugr = wk_source.config.structure.use_group_rows.groups[idx];

                if(!LIB.isValid(ugr) && ugr.sub_id_worklist != 'VOID')
                    return;

                if(!LIB.isValid(ugr.config_structure))
                {
                    $.ajax(
                        {
                            type: 'POST',
                            dataType: 'text',
                            url: $().getAbsolutePathServer() + 'pageWorklistStructure?ID_WK=' + ugr.sub_id_worklist + '&SITO=' + $('#SITO').val() + '&VERSIONE=' + $('#VERSIONE').val(),
                            async: false,
                            success: function(struct)
                            {
                                eval('struct = ' + struct);
                                /* Salvo la configurazione cosi' non fara' piu' richieste ajax per la struttura... */
                                $.extend(wk_source.config.structure.use_group_rows.groups[idx], {config_structure: struct});
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown)
                            {
                                //alert('Error: ' + textStatus + '\nMessage:' + errorThrown);
                            }
                        });
                }

                if(LIB.isValid(ugr.config_structure))
                {
                    i.removeClass('icon-plus').addClass('icon-minus');
                    tr.show();

                    var div         = $.createElement('div').addClass('clsDetailContainer').css({'height':'480px'});

                    tr.display(true); /* Cos� si piglia le dimensioni giuste! */

                    var td          = $('td', tr).append(div);
                    var sub_wk      = div.worklist(ugr.config_structure, wk_source.config.server);
                    var sub_where   = ugr.filter(typeof data === 'function' ? data() : data);

                    wk_source.sub_worklist.set(sub_wk);

                    sub_wk.structure.objects.set('loading', wk_source.structure.objects.get('loading'));

                    /*sub_wk.callback.load.after = function(){sub_wk.alter.auto_height_container(div, td, tr);};*/
                    sub_wk.callback.load.after = function(){tr.css({'height':'500px'})};

                    if(sub_where != null)
                        sub_wk.data.where = sub_where;

                    sub_wk.data.load();

                    tr_work.addClass('open');
                }
            }

            wk_source.structure.objects.get('d_body').focus();
        },

        getWidthText: function(txt)
        {
            var html_calc = $.createElement('div').hide().html(txt);

            $(document.body).append(html_calc);

            var w = html_calc.width();

            html_calc.remove();

            return w;
        },

        display: function(s)
        {
            if(s)
                this.css({'display': ''}).css({'visibility': ''});/*this.show(); Tolto perche' firefox fa i capricci! O_o*/
            else
                this.hide();

            return this;
        },

        worklist: function(config_wk, config_server)
        {
            /* Imposto i dati stadard per cominicare al server (generalmente sara' cosi' per tutti!!!) */
            if(LIB.isValid(config_server))
            {
                var default_config_ajax =
                {
                    connection_id: 'POLARIS_DATI', /* Utilizzato da caronte per la connessione! */
                    send_data_form: true, /* Viene utilizzato per mandare i dati della form o no... */
                    type: 'POST',
                    dataType: 'json',
                    url: $().getAbsolutePathServer() + 'worklistData',
                    contentType: "application/x-www-form-urlencoded;charset=ISO-8859-1",/*=UTF-8*/
                    error: function(XMLHttpRequest, textStatus, errorThrown) {alert('Error: ' + textStatus + '\nMessage:' + errorThrown);}
                };

                $.extend(true, config_server, default_config_ajax);
            }

            return $.createWorklist(this, config_wk, config_server);
        }
    });
})(jQuery);