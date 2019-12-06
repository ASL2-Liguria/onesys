$.NS_WORKLIST_COMPONENT =
{
    CONFIG: function(cfg_srv, cfg_struct)
    {
        var _config =
        {
            server: cfg_srv,
            structure: cfg_struct
        };

        return _config;
    },

    CACHE: function()
    {
        var _cache=
        {
            parameter:
            {
                enable: false,
                key_region: null,
                limit: '0',
                keep_session: false,
                keep_alive: '0'
            },

            _generate_key: function(id, key_region)
            {
                var key = LIB.isValid(key_region) && key_region != '' ? key_region:this.parameter.key_region;

                if(LIB.isValid(id) && id != '')
                    key += '_' + id;

                return key;
            },

            check_storage: function()
            {
                try
                {
                    return 'localStorage' in window && window['localStorage'] !== null;
                }
                catch(e)
                {
                    return false;
                }
            },

            init: function(param)
            {
                if(!LIB.isValid(param))
                    param = this._root.config.structure.cache;

                this.parameter = $.extend({}, {enable: false, key_region: null, limit: '0', keep_session: false, keep_alive: '0'}, LIB.isValid(param) ? param:{});
                this.parameter.enable = this.parameter.enable && this.check_storage() && LIB.isValid(this.parameter.key_region);

                if(this.parameter.enable && !this.parameter.keep_session)
                    this.clear();
            },

            set_status: function(enable)
            {
                this.parameter.enable = this.check_storage() && LIB.isValid(this.parameter.key_region) && (typeof enable == 'boolean' ? enable:enable.toUpperCase() === 'S' || enable.toUpperCase() === 'Y');
            },

            get_status: function()
            {
                return this.parameter.enable;
            },

            set_data: function(data, id, key_region)
            {
                if(this.parameter.enable && LIB.isValid(data))
                    localStorage.setItem(this._generate_key(id, key_region), JSON.stringify(data));
            },

            append_data: function(data, id, key_region)
            {
                if(LIB.isValid(data))
                {
                    var data_storage = this.get_data(id, key_region, true);

                    if(LIB.isValid(data_storage))
                    /* Esiste gia' il dato, controllo il limite */
                        if(data_storage.rows.length + data.rows.length <= parseInt(this.parameter.limit, 10))
                            data.rows = $.merge($.merge([], data_storage.rows), data.rows);

                    this.set_data(data, id, key_region);
                }
            },

            get_data: function(id, key_region, direct_storage)
            {
                var data = null;

                if(this.parameter.enable)
                {
                    var data_storage = localStorage.getItem(this._generate_key(id, key_region));

                    if(LIB.isValid(data_storage))
                    {
                        var data_tmp = JSON.parse(data_storage);

                        /* Controllo se e' paginato o no... in tal caso, estraggo solo la parte interessata di righe! */
                        if(this._root.config.structure.use_pager && !direct_storage)
                        {
                            var start = (this._root.page.current - 1) * this._root.page.size;
                            var end = this._root.page.size;

                            if(data_tmp.rows.length >= start)
                            {
                                data = {page: data_tmp.page, rows: data_tmp.rows.splice(start, end)};
                                data.page.current = this._root.page.current;
                            }
                        }
                        else
                            data = data_tmp;

                        /* Controllo in piu' per sicurezza */
                        if(LIB.isValid(data) && data.rows.length < 1)
                            data = null;
                    }
                    else
                        data = null;
                }

                return data;
            },

            clear: function(id)
            {
                if(this.parameter.enable)
                    if(LIB.isValid(id))
                        localStorage.removeItem(this._generate_key(id));
                    else
                        localStorage.clear();
            }
        };

        return _cache;
    },

    STRUCTURE: function()
    {
        var _structure =
        {
            container: null,
            objects: $.managerObject()
        };

        return _structure;
    },

    CALLBACK: function()
    {
        var _callback =
        {
            invoke: function(who, ctx, params)
            {
                var o = null;

                params = !LIB.isValid(params) ? {} : params;

                eval('o = this.' + who + ';');

                if(LIB.isValid(o))
                    if(typeof o == 'Array')
                        for(var i = 0; i < o.length; i++)
                        {
                            if(!o[i].call(ctx, param))
                                return false;
                        }
                    else
                    {
                        return o.call(ctx, params);
                    }
            },

            build:
            {
                before: null,
                after: null
            },

            load:
            {
                before: null,
                after: null,
                error: null
            },

            append:
            {
                before: null,
                after: null
            }
        };

        return _callback;
    },

    BUILDER: function()
    {
        var _builder =
        {
            container: function()
            {
                return this._root.structure.container = $.createElement('div').addClass('clsWk');
            },

            loading: function()
            {
                var struct  = this._root.structure;
                var divLoad = $.createElement('div').addClass('clsWkLdg').html('&nbsp;').css({'width' : struct.container.outerWidth(), 'height' : struct.container.outerHeight()}).fadeTo(0, 0.8).hide();

                struct.objects.set('loading', divLoad);

                return divLoad;
            },

            header: function()
            {
                var columns     = this._shortcut.getConfigColumns();
                var list_column = columns.list;
                var objects     = this._shortcut.getObjects();
                var table       = $.createElement('table');
                var colgroup    = $.createElement('colgroup');
                var thead       = $.createElement('thead');
                var tr          = $.createElement('tr');
                var sort        = LIB.isValid(columns.sort) ? columns.sort : new Array(0); /* La prudenza non e' mai troppa! */
                var div         = objects.get('d_header_fixed');

                if(!LIB.isValid(div)) /* Se non esiste, creo il div per contenere head fisso! */
                    objects.set('d_header_fixed', div = $.createElement('div').addClass('clsWkHdFix'));

                thead.append(tr);

                for(var i = 0; i < list_column.length; i++)
                {
                    var column      = list_column[i];
                    var th          = $.createElement('th');
                    var column_sort = sort.searchForKeyJSON(column.id_col);
                    var cls         = '';

                    if(!column['movable'])
                        cls += 'clsNoMove';

                    if(!column['sortable'])
                        cls += ' clsNoOrd';

                    if(LIB.isValid(column_sort))
                        cls += ' clsOrd_' + column_sort.value;

                    colgroup.append($.createElement('col'));
                    tr.append(th.addClass(cls).html(column.output != '' ? column.output : '&nbsp;').DisableSelection());
                }

                table.append(colgroup).append(thead).attr({cellPadding: 0, cellSpacing: 0, border: 0}).append($.createElement('tbody')); /* TBODY obbligatorio... */

                /* Salvo il colgroup e la table! */
                objects.set('colgroup', colgroup).set('t_header_fixed', table).set('t_head', thead);

                return div.append(table);
            },

            header_resize: function()
            {
                var div = $.createElement('div').addClass('clsWkRsz');

                for(var i = 0; i < this._shortcut.getConfigColumnsList().length - 1; div.append($.createElement('div').attr('class', 'clsRszId_' + i++).DisableSelection()));

                this._shortcut.getObjects().set('d_header_r_dd', div);

                return div;
            },

            body: function()
            {
                var objects = this._shortcut.getObjects();
                var divBody = $.createElement('div').addClass('clsWkScroll'); /* Div contenitore per lo scroll */
                var tboby   = $.createElement('tbody');
                var table   = $.createElement('table').data('id_worklist', this._shortcut.getConfigStructure().id_worklist);
                var height  = this._shortcut.getConfigStructure().rows.height;

                if(LIB.isValid(height))
                    divBody.addClass('clsTR' + (height + '').removePX());

                table.append(objects.get('colgroup').clone(true)); /* Copio il colgroup del thead */
                table.append(tboby);

                objects.set('d_body', divBody).set('t_body', tboby).set('t_table', table);

                divBody.append(table);

                return divBody;
            },

            footer: function()
            {
                var divFooter   = $.createElement('div').addClass('clsWkFt').html('&nbsp;'); /* Div del footer */
                var div         = $.createElement('div');

                this._shortcut.getObjects().set('d_footer', divFooter);

                div.append($.createElement('div').DisableSelection().html('&nbsp;').addClass('clsWkFtPrev').css({'visibility':'hidden'}));

                if(this._root.config.choose_pager)
                    div.append($.createElement('div').DisableSelection().html('&nbsp;').addClass('clsWkFtCmb'));

                div.append($.createElement('div').DisableSelection().html('&nbsp;').addClass('clsWkFtInd'));
                div.append($.createElement('div').DisableSelection().html('&nbsp;').addClass('clsWkFtNext').css({'visibility':'hidden'}));

                divFooter.append(div.addClass('clsWkFtBT'));

                return divFooter;
            },

            context_columns: function(position)
            {
                var ul      = null;
                var context = this._shortcut.getObjects().get('d_context_columns');
                var columns = this._shortcut.getConfigColumns();

                if(LIB.isValid(context))
                {
                    ul = context.find('ul');
                    ul.find('li').empty().remove();
                }
                else
                    this._shortcut.getObjects().set('d_context_columns', context = $.createElement('div').addClass('clsWkSelCol').hide().append(ul = $.createElement('ul')));

                var list            = columns.list;
                var width_context   = 0;

                for(var i = 0; i < list.length; i++)
                {
                    var li = $.createElement('li');

                    if(!LIB.isValid(list[i].visible) || list[i].visible)
                        li.html('V - ' + list[i].output).addClass('clsSelV');
                    else
                        li.html('X - ' + list[i].output).addClass('clsSelX');

                    if($.trim(list[i].output) == '')
                        li.hide();

                    ul.append(li);

                    var tmp_width = $().getWidthText(li.text()) + 20;
                    if(tmp_width > width_context)
                        width_context = tmp_width;
                }

                if(context.outerHeight() > this._root.structure.container.outerHeight())
                    context.css({'height': (this._root.structure.container.outerHeight() - 20) + 'px', 'width': width_context + 'px'}).mCustomScrollbar({'axis':'y', 'theme':'minimal-dark'});
                else
                    context.css({'width': width_context + 'px'});

                if(LIB.isValid(position))
                {
                    var w_content = this._shortcut.getContainer().outerWidth(true);

                    if((position.left + width_context) > w_content)
                        position.left = w_content - width_context;

                    context.css(position);
                }

                return context;
            },

            group: function()
            {
                var div_cont    = $.createElement('div').addClass('clsWkGrpCnt').append(this.header()).append(this.header_resize()).append(this.body());
                var div         = $.createElement('div').addClass('clsWkGrp').append(div_cont);

                this._shortcut.getObjects().set('group', div).set('group_content', div_cont);

                return div;
            }
        };

        return _builder;
    },

    ADJUST: function()
    {
        var _adjust =
        {
            get_objects_work: function()
            {
                var objects = this._shortcut.getObjects();

                return $.managerObject().set('objects', objects)
                    .set('colgroup', objects.get('colgroup'))
                    .set('head', objects.get('t_head'))
                    .set('div_resize', objects.get('d_header_r_dd'))
                    .set('table', objects.get('t_table'))
                    .set('list', this._shortcut.getConfigColumnsList()).object;
            },

            align_size: function()
            {
                var objects     = this._shortcut.getObjects();
                var list        = this._shortcut.getConfigColumnsList();
                var width_cont  = this._shortcut.getContainer().outerWidth();
                var height      = this._shortcut.getContainer().outerHeight();
                var height_scrl;
                var width       = 0;

                for(var i = 0; i < list.length; i++)
                    if(list[i].visible)
                        width += list[i].width.removePX();

                if(width < width_cont)
                    width = width_cont;

                if(LIB.isValid(objects.get('d_footer')))
                    height -= objects.get('d_footer').outerHeight();

                height_scrl = (height - objects.get('t_header_fixed').outerHeight()) + 'px';
                width += 'px';
                height += 'px';

                objects.get('group_content').css({'width': width, 'height': height});
                objects.get('d_header_r_dd').css({'width': width});
                objects.get('colgroup').attr('width', width);
                objects.get('t_header_fixed').attr('width', width);
                objects.get('t_table').attr({'width': width});
                objects.get('group').css({'width': width_cont + 'px', 'height': height}).mCustomScrollbar("update");
                objects.get('d_body').css({'height': height_scrl}).mCustomScrollbar("update");

                var scroll_v = $('.mCSB_scrollTools_vertical', objects.get('group'));
                //scroll_v.css({'left': (width_cont + objects.get('group_content').position().left - scroll_v.outerWidth() - 6) + 'px'});
                scroll_v.css({'left': (width_cont + Math.abs(objects.get('group_content').parent().position().left) - scroll_v.outerWidth() - 2) + 'px'});
            },

            align_visible: function(index)
            {
                var param = this.get_objects_work();

                if(!LIB.isValid(index))
                {
                    var col_vis = 0;

                    for(var i = 0; i < param.list.length; i++)
                    {
                        $('col:eq(' + i + ')', param.colgroup).display(param.list[i].visible).css({'visibility': !param.list[i].visible ? 'collapse':''});
                        $('th:eq(' + i + ')', param.head).display(param.list[i].visible);

                        if(param.list[i].visible)
                            col_vis++;
                    }

                    $('tbody tr.clsDetail td', param.table).each(function(riga){$(this).attr('colspan', col_vis)});
                }
                else
                    $('tbody tr', param.table).each(function(riga){ $('td:eq(' + index + ')', this).display(param.list[index].visible); });
            },

            align_column_size: function()
            {
                var param       = this.get_objects_work();
                var width_cont  = this._shortcut.getContainer().outerWidth()
                var width_sum   = 0;
                var last_idx    = 0;
                var i;

                for(i = 0; i < param.list.length; i++)
                {
                    $('col:eq(' + i + ')', param.colgroup).attr('width', (param.list[i].width + '').removePX() + 'px');

                    if(LIB.isValid(param.list[i].visible) && param.list[i].visible)
                    {
                        width_sum += (param.list[i].width + '').removePX();
                        last_idx = i;
                    }
                }

                if(width_sum < width_cont)
                    $('col:eq(' + last_idx + ')', param.colgroup).attr('width', ((param.list[last_idx].width + '').removePX() + (width_cont - width_sum)) + 'px')
            },

            align_resize: function()
            {
                var param = this.get_objects_work();

                for(var i = 0, left = 0; i < param.list.length; i++)
                {
                    var column  = param.list[i];
                    var col     = $('col:eq(' + i + ')', param.colgroup);
                    var visible = column.visible;

                    if(visible)
                        if(col.attr('width') !== 'auto') /* Indica che sono all'ultima colonna visibile */
                            left += col.outerWidth();
                        else
                            visible = false;

                    $('.clsRszId_' + i, param.div_resize).display(visible && column.resizable).css({'left' : left});
                }
            },

            align_sort: function()
            {
                var columns = this._shortcut.getConfigColumns();

                if(LIB.isValid(columns.sort))
                {
                    var param = this.get_objects_work();

                    /* Prima rimuovo tutte le classi di ordinamento */
                    $('tr th', param.head).removeClass('clsOrd_ASC').removeClass('clsOrd_DESC');

                    for(var i = 0; i < param.list.length; i++)
                    {
                        var sort = columns.sort.searchForKeyJSON(param.list[i].id_col);

                        if(sort != null)
                            $('tr th:eq(' + i + ')', param.head).addClass('clsOrd_' + columns.sort[sort.index][columns.list[i].id_col]);
                    }
                }
            },

            align_colgroup: function()
            {
                var param = this.get_objects_work();

                $('colgroup:eq(0)', param.table).remove();
                param.table.prepend(param.colgroup.clone(true));
            },

            all: function()
            {
                var $this = this;

                $.each(this, function(id, obj)
                {
                    if((typeof obj == 'function') && id != 'all' && id != 'get_objects_work')
                        obj.call($this);
                });
            }
        };

        return _adjust;
    },

    ALTER: function()
    {
        var _alter =
        {
            column_visible: function(index, visible)
            {
                var columns = this._shortcut.getConfigColumns();

                if(!LIB.isValid(visible))
                    visible = !columns.list[index].visible;

                columns.list[index].visible = visible;

                this._root.adjust.align_visible(index);
                this._root.adjust.all();

                this._root.save.visible(index);
            },

            move_column: function(index_1, index_2)
            {
                if(index_1 != index_2 && Math.abs(index_2 - index_1) != 1 && index_1 > -1 && index_2 > -1)
                {
                    var columns     = this._shortcut.getConfigColumns();
                    var objects     = this._shortcut.getObjects();
                    var thead       = objects.get('t_header_fixed');
                    var list        = columns.list;
                    var sorgente    = list[index_1];

                    /* Scambio lato configurazione */
                    if(index_1 > index_2)
                    {
                        list.splice(index_1, 1);
                        list.splice(index_2, 0, sorgente)
                    }
                    else
                    {
                        list.splice(index_2, 0, sorgente);
                        list.splice(index_1, 1);
                    }

                    /* Scambio i th dell'head fixed*/
                    $('th:eq(' + index_2 + ')', thead).before($('th:eq(' + index_1 + ')', thead));

                    /* Scambio le colonne della table */
                    $('tr', objects.get('t_table')).each(function()
                    {
                        $('td:eq(' + index_2 + ')', this).before($('td:eq(' + index_1 + ')', this));
                    });

                    this._root.save.position(index_1, index_2);
                }
            },

            auto_height_container: function()
            {
                /*var struct = this._root.structure;
                 var height = $(struct.objects.get('t_body')).outerHeight() + $(struct.objects.get('t_header_fixed')).outerHeight() + 30;

                 $(struct.container).css({'height': height});

                 for(var i = 0; i < arguments.length; i++)
                 $(arguments[i]).css({'height': height});*/
                alert('perché???');
            }
        };

        return _alter;
    },

    EVENTS: function()
    {
        var _events =
        {
            flags:
            {
                key_ctrl: false
            },

            context_columns: function(event)
            {
                this._root.builder.context_columns({'top': event.pageY, 'left': event.pageX}).show();

                return false;
            },

            move_resize:
            {
                /* Rappresente la root e il shortcut principale (settata dall'init) */
                _root: null,
                _shortcut: null,

                /* Serve per gli oggetti d'appoggio...*/
                objects: $.managerObject(),

                start: function(type, event, object_html)
                {
                    var objects_event   = this.objects;
                    var objects_stuct   = this._shortcut.getObjects();
                    var div_work        = null;

                    object_html = $(object_html);

                    objects_event.clear();

                    if(type == 'move')
                    {
                        /* Caso di spostamento della colonna, creo la copia della cella */
                        objects_event.set('object', div_work = $.createElement('div').html(object_html.html()));
                        div_work.css({'width': object_html.outerWidth() > 200 ? 200:object_html.outerWidth(), 'height': object_html.outerHeight(), 'top': object_html.offset().top + object_html.outerHeight(), 'left': event.pageX - Math.round(object_html.outerWidth()/2)}).data('idx', object_html.index()).hide();

                        objects_stuct.get('d_header_r_dd').append(div_work);

                        $('thead tr th:not(.clsNoMove)', objects_stuct.get('t_header_fixed')).hover(function()
                        {
                            $('th.clsOverMv', objects_stuct.get('t_header_fixed')).removeClass('clsOverMv');
                            $(this).addClass('clsOverMv');

                            objects_event.set('target', this);
                        });
                    }
                    else
                    {
                        objects_event.set('object', object_html);

                        div_work = objects_event.get('object');

                        objects_stuct.get('t_header_fixed').addClass('clsWkHdFixRsz');
                    }

                    div_work.addClass('clsAct_' + type);

                    /* Salvo i dati per gestire il resto degli eventi... */
                    objects_event.set('type', type);
                    objects_event.set('target', event.currentTarget);

                    objects_event.set('left_start', event.pageX).set('left_end', objects_event.get('left_start'));
                    objects_event.set('time_start', new Date().getTime()).set('time_end', objects_event.get('time_start'));
                },

                move: function(event)
                {
                    var objects_event   = this.objects;
                    var div_work        = objects_event.get('object');

                    if(LIB.isValid(div_work))
                    {
                        var objects     = this._shortcut.getObjects();
                        var left_cursor = event.pageX;
                        var left_object = left_cursor;

                        objects_event.set('left_end', left_cursor);
                        objects_event.set('target', event.currentTarget);

                        if(objects_event.get('type') == 'move')
                        {
                            /* Bisogna controllare perche' sclera t_header_fixed (gia' convertito in oggetto jquery)*/
                            if($(objects.get('t_header_fixed')).hasClass('clsWkHdFixMv'))
                                $(objects.get('t_header_fixed')).addClass('clsWkHdFixMv');

                            /* Richiamo l'over per marcare la cella */
                            $('th.clsOverMv', objects.get('t_header_fixed')).hover();

                            if(Math.abs(objects_event.get('left_start') - left_cursor) >= 10)
                            {
                                var width_object = Math.round(div_work.width()/2);
                                /* Mostro la cella*/
                                div_work.show();

                                left_object -= left_cursor >= width_object ? width_object : width_object + left_object - width_object;
                            }
                        }
                        else
                            left_object += Math.abs(objects.get('d_body').position().left) - 3 - objects.get('group_content').offset().left; /* Serve per lo scroll orizzontale (il valore è sempre negativo) */

                        div_work.css('left', left_object);
                    }
                },

                end: function(event)
                {
                    var object_param    = this.objects.object;
                    var object_event    = object_param.object;

                    if(LIB.isValid(object_event))
                    {
                        var object_structure = this._shortcut.getObjects();

                        object_param.time_end = new Date().getTime();
                        object_param.left_end = event.pageX; /* Per sicurezza! */
                        object_param.target = event.currentTarget;

                        if(object_param.type == 'move')
                        {
                            if(Math.abs(object_param.time_end - object_param.time_start) > 800)
                                this._root.alter.move_column(object_event.data('idx'), $('th.clsOverMv', object_structure.get('t_header_fixed')).index());

                            /* Rimuovo l'oggetto, la classe e l'evento over! */
                            $('th.clsOverMv', object_structure.get('t_header_fixed')).removeClass('clsOverMv');

                            object_structure.get('t_header_fixed').removeClass('clsWkHdFixMv');

                            object_event.remove();

                            $('tr th', object_structure.get('t_header_fixed')).unbind('hover');
                        }
                        else
                        {
                            var col = this._shortcut.getConfigColumnsList()[parseInt(object_event.attr('class').split('_')[1], 10)];

                            if(LIB.isValid(col))
                            {
                                var width_difference = col.width.removePX() + (object_param.left_end - object_param.left_start);

                                if(width_difference < 20)
                                    width_difference = 20;

                                col.width = width_difference + 'px';

                                this._root.save.width();
                            }

                            object_event.removeClass('clsAct_' + object_param.type);
                            object_structure.get('t_header_fixed').removeClass('clsWkHdFixRsz');
                        }

                        this._root.adjust.all();
                    }

                    this.objects.clear();
                }
            },

            order_column: function(event, index)
            {
                var config      = this._shortcut.getConfigStructure();
                var sort        = LIB.isValid(config.columns.sort) ? config.columns.sort:new Array(0);
                var list        = config.columns.list;
                var col_search  = sort.searchForKeyJSON(list[index].id_col);
                var new_sort    = {};

                if(col_search == null)
                    new_sort[list[index].id_col] = 'ASC';
                else
                if(col_search.value == 'ASC')
                    new_sort[col_search.key] = 'DESC';
                else
                if(col_search.value == 'DESC')
                    new_sort = null;

                if(!event.ctrlKey)
                    if(col_search != null)
                    {
                        var obj_sort = sort[col_search.index];
                        sort = new Array(1);
                        sort[0] = obj_sort;
                        col_search.index = 0;
                    }
                    else
                        sort = new Array(0);

                if(LIB.isValid(col_search) && LIB.isValid(new_sort))
                    sort[col_search.index] = new_sort;
                else
                if(LIB.isValid(new_sort))
                    sort.push(new_sort);
                else
                if(LIB.isValid(col_search))
                    sort.splice(col_search.index, 1);

                config.columns.sort = sort;

                this._root.adjust.align_sort();

                if(event.ctrlKey)
                {
                    if(!this.flags.key_ctrl)
                    {
                        var $this = this;

                        this.flags.key_ctrl = true;

                        $(document).keyup(function(ek)
                        {
                            ek.preventDefault();
                            ek.stopPropagation();

                            $(document).unbind('keyup');

                            $this.flags.key_ctrl = false;
                            $this._root.save.order();
                            $this._root.data.load();
                        });
                    }
                }
                else
                {
                    this._root.save.order();
                    this._root.data.load();
                }
            },

            auto_resize: function(obj)
            {
                var idx = parseInt($(obj).attr('class').split('_')[1], 10);
                var col = this._shortcut.getConfigColumnsList()[idx];

                if(LIB.isValid(col.id_db))
                {
                    var rows        = this._root.data.result.rows;
                    var new_width   = 0;

                    for(var i = 0; i < rows.length; i++)
                    {
                        var tmp_width = $().getWidthText(rows[i][col.id_db]);

                        if(tmp_width > new_width)
                            new_width = tmp_width;
                    }

                    new_width += 16; /* Meglio sfasare un pochino... */

                    col.width = new_width + 'px';

                    this._root.adjust.all();
                    this._root.save.width();
                }
            },

            init: function()
            {
                var config  = this._shortcut.getConfigStructure();
                var objects = this._shortcut.getObjects();
                var $this   = this;

                /* Setto la root e shortcut */
                this.move_resize._root = this._root;
                this.move_resize._shortcut = this._shortcut;

                /* Gestione pagine */
                if(config.use_pager)
                {
                    var div = objects.get('d_footer');

                    $('div.clsWkFtPrev', div).click(function(ev){ $this._root.page.move(-1);});
                    $('div.clsWkFtNext', div).click(function(ev){ $this._root.page.move(+1);});

                    if(config.choose_pager)
                    {
                        $('div.clsWkFtInd', div).hover(function(ev)
                            {
                                if($this._root.page.total > 1)
                                {
                                    var _t = $(this);
                                    var sel = $.createElement('select');

                                    for (var i = 1; i <= $this._root.page.total; i++)
                                        sel.append($.createElement('option').val(i).html(i));

                                    sel.val($this._root.page.current).change(function (ev)
                                    {
                                        $this._root.page.move($(this).val() - $this._root.page.current);
                                    });

                                    _t.html('').append(sel);
                                }
                            },
                            function(ev)
                            {
                                $('select', this).hide();
                                $(this).html($this._root.page.current + '/' + $this._root.page.total);
                            });
                    }
                }

                /* Eventi sulle righe (da configurazione) */
                if(LIB.isValid(config.rows.events))
                    $.each(config.rows.events, function(id_event, func)
                    {
                        $(objects.get('t_table')).on(id_event, 'tr:not(.clsDetail)', function(event)
                        {
                            if($(this).closest("table").data("id_worklist") != config.id_worklist) return;

                            var record = $this._root.data.get_row($(this).data('index'));

                            $(this).data('wk_data', $this._root.data);

                            func.call(this, record, event, $this._root);
                        });
                    });

                /* ContextMenu delle colonne */
                if(config.select_columns && LIB.isValid(objects.get('d_header_fixed')))
                {
                    $('ul', objects.get('d_context_columns')).on('click', 'li', function(event) {$this._root.alter.column_visible($(this).index()); objects.get('d_context_columns').hide();});
                    $(objects.get('d_header_fixed')).on('contextmenu', function(event) {event.stopPropagation(); return $this.context_columns(event);});
                }

                /* Resize */
                $(objects.get('d_header_r_dd')).on('mousedown', 'div:not(.clsNoRsz)', function(event)
                {
                    if(!isRightClick(event))
                    {
                        event.stopPropagation();

                        if(!event.ctrlKey)
                            $this.move_resize.start('resize', event, this);
                        else
                            $this.auto_resize(this); /* Auto resize (esperimento) */
                    }
                });

                /* Move */
                $('tr', objects.get('t_header_fixed')).on('mousedown', 'th:not(.clsNoMove)', function(event)
                {
                    event.stopPropagation();

                    if(!isRightClick(event))
                        $this.move_resize.start('move', event, this);
                });

                /* Order by */
                $('tr', objects.get('t_header_fixed')).on('click', 'th:not(.clsNoOrd)', function(event)
                {
                    $this._root.data.flag.order_changed = true;
                    $this.order_column(event, $(this).index());
                });

                /* Rilascio e movimento del mouse... */
                $(this._root.structure.container).on('mouseup', function(event)
                {
                    /*event.stopPropagation();*/
                    $this.move_resize.end(event, config.columns);
                });

                $(this._root.structure.container).on('mousemove', function(event)
                {
                    $this.move_resize.move(event);
                }).on('mouseup', function(event)
                {
                    /*event.stopPropagation();*/
                    $this.move_resize.end(event);
                }).on('mouseleave', function(event)
                {
                    /*event.stopPropagation();*/
                    $this.move_resize.end(event);
                }).on('hover', function(event){}, function(event)
                {
                    event.stopPropagation();
                    if(event.pageX < 0 || event.pageY < 0) $this.move_resize.end(event);
                }).on('click', function(event)
                {
                    /* Per sicurezza, nascondo il contextmenu delle colonne */
                    if(objects.get('d_context_columns') != null)
                        objects.get('d_context_columns').hide();
                });

                /* Context Menu della worklist */
                if(LIB.isValid(config.menu))
                {
                    var c_menu = objects.get('d_body').contextMenu(config, {openSubMenuEvent: "click", openInfoEvent: "click"});

                    $(objects.get('d_body')).on('contextmenu', 'div', function(event)
                    {
                        event.preventDefault();
                        event.stopImmediatePropagation();

                        var tr = $(event.target).closest('tr');

                        /* Per sicurezza, nascondo il contextmenu delle colonne */
                        if(objects.get('d_context_columns') != null)
                            objects.get('d_context_columns').hide();

                        if($this._root.selected.indexs.indexOf(tr.data('index')) < 0)
                            tr.trigger('click');

                        c_menu.test(event, $this._root.selected.get_array_record());
                    });
                }
            }
        };

        $.extend(_events.move_resize, _events);

        return _events;
    },

    SELECTED: function()
    {
        var _selected =
        {
            indexs: new Array(0),

            init: function()
            {
                this.indexs.length = 0;
            },

            append: function(idx)
            {
                if(!isNaN(idx))
                    this.indexs.push(idx);
            },

            remove: function(idx)
            {
                if(!isNaN(idx))
                    this.indexs.splice(this.indexs.indexOf(idx), 1);
            },

            get_array_record: function()
            {
                var ret = new Array(0);
                var idx = this.indexs;

                for(var i = 0; i < idx.length; ret.push(this._root.data.get_row(idx[i++])));

                return ret;
            },

            get_string_data: function(id, concat)
            {
                var ret = '';

                if(LIB.isValid(id) && $.trim(id) != '')
                {
                    var idx = this.indexs;

                    if(!LIB.isValid(concat) || $.trim(concat) == '')
                        concat = '*';

                    for(var i = 0; i < idx.length; i++)
                    {
                        if(i > 0)
                            ret += concat;

                        ret += this._root.data.get_row(idx[i])[id];
                    }
                }

                return ret;
            }
        };

        return _selected;
    },

    GRID: function()
    {
        var _grid =
        {
            populate: function(data)
            {
                var objects = this._shortcut.getObjects();

                /* Inizializzo l'array di selezione */
                this._root.selected.init();

                if(LIB.isValid(data) && LIB.isValid(data.rows))
                {
                    var $this               = this;
                    var list                = this._shortcut.getConfigColumnsList();
                    var group_rows          = this._shortcut.getConfigStructure().use_group_rows;
                    var group_rows_enable   = LIB.isValid(group_rows) && group_rows.groups;
                    var alternate_color 	= this._shortcut.getConfigStructure().rows.alternate_color;

                    /* Setto le info della pagina... */
                    this._root.page.init(data.page);

                    $.each(data.rows, function(i, row)
                    {
                        var tr = $.createElement('tr').data('index', i); /* Salvo l'indice del json array */

                        /* per le righe dispari, se la config e' alternate color, aggiungo la classe odd */
                        if(alternate_color && i%2 != 0)
                            tr.addClass("clsOdd");

                        if(LIB.isValid(row.IDEN))
                            tr.attr('data-iden', row.IDEN);

                        $this._root.callback.invoke("append.before", $this, {index:i, tr:tr, row:row});

                        for(var j = 0; j < list.length; j++)
                        {
                            var td  = $.createElement('td');
                            var div = $.createElement('div');

                            if(LIB.isValid(list[j].process) && list[j].process != null && list[j].process != '')
                                try
                                {
                                    div.html(list[j].process.call(tr, row, $this._root, td));
                                }
                                catch(ex)
                                {
                                    div.html(row[LIB.isValid(list[j].id_db) ? list[j].id_db : list[j].id_col]).attr('title', div.text());
                                }
                            else
                                div.html(row[LIB.isValid(list[j].id_db) ? list[j].id_db : list[j].id_col]).attr('title', div.text());

                            if(LIB.isValid(list[j].visible) && !list[j].visible)
                                td.hide();

                            /*
                             * AGGIUNTA PER GESTIONE RESPONSIVA DELLE TABELLE.
                             * L'HEADER DELLA COLONNA VIENE COPIATO IN UN DATA-ATTRIBUTE
                             * PER UTILIZZARE GLI PSEUDOSELETTORI CSS :AFTER  E:BEFORE COME HEAD DELLA RIGA
                             * PER UTILIZZARE GLI PSEUDOSELETTORI CSS :AFTER E :BEFORE COME HEAD DELLA RIGA
                             * */

                            if(LIB.isValid(list[j].output))
                                td.attr('data-header', list[j].output);

                            tr.append(td.append(div));
                        }

                        objects.get('t_body').append(tr);

                        $this._root.callback.invoke("append.after", $this, {index:i, tr:tr, row:row});

                        /* Verifico se e' attivo il dettaglio delle righe! */
                        if(group_rows_enable)
                            objects.get('t_body').append($.createElement('tr').addClass('clsDetail').append($.createElement('td').attr('colspan', list.length)).hide().DisableSelection());
                    });

                    $this._root.adjust.align_visible();
                    $this._root.adjust.align_size();
                }

                objects.get('loading').hide();
            },

            set_page_info: function(info)
            {
                var div_footer = this._shortcut.getObjects().get('d_footer');

                $.extend({}, {total:1, current:1, size:1}, info);

                if(info.current == 1)
                    $('div.clsWkFtBT div.clsWkFtPrev', div_footer).css({'visibility':'hidden'});
                else
                if(info.current > 1)
                    $('div.clsWkFtBT div.clsWkFtPrev', div_footer).css({'visibility':'visible'});

                if(info.current == info.total)
                    $('div.clsWkFtBT div.clsWkFtNext', div_footer).css({'visibility':'hidden'});
                else
                if(info.current < info.total)
                    $('div.clsWkFtBT div.clsWkFtNext', div_footer).css({'visibility':'visible'});

                $('div.clsWkFtBT div.clsWkFtInd', div_footer).html(info.current + '/' + info.total);
            },

            clear: function()
            {
                if(LIB.isValid(this._shortcut.getObjects().get('t_body')))
                    this._shortcut.getObjects().get('t_body').empty();
            }
        };

        return _grid;
    },

    PAGE: function()
    {
        var _page =
        {
            total: 1,
            current: 1,
            size: null,
            count_row: 1,

            init: function(param)
            {
                if(!this._shortcut.getConfigStructure().use_pager)
                    return;

                if(LIB.isValid(param) && LIB.isValid(param.size))
                    this.size = param.size;
                else
                    this.size = null;

                if(LIB.isValid(param) && LIB.isValid(param.total))
                {
                    this.total = parseInt(param.total, 10) > 0 ? parseInt(param.total, 10) : 1;
                    this.current = parseInt(param.current, 10) > 0 ? parseInt(param.current, 10) : 1;
                }
                else
                    this.total = this.current = 1;

                if(this.size == null) /* Mi calcolo il numero di righe da caricare! */
                {
                    var val = parseInt(this._shortcut.getObjects().get('d_body').outerHeight(), 10) / (this._shortcut.getConfigStructure().rows.height + '').removePX();
                    this.size = parseInt(val, 10);
                }

                if(this.size == 0)
                    this.size = 1;

                this.count_row = this.total;
                this.total = Math.ceil(this.total / this.size);

                if(this.total == 0)
                    this.total = 1;

                this._root.grid.set_page_info(this);
            },

            first: function()
            {
                this.move(this.current - this.total + 1);
            },

            last: function()
            {
                this.move(this.total - this.current);
            },

            move: function(offset)
            {
                this.current += offset;
                this._root.grid.set_page_info(this);
                this._root.data.load();
            }
        };

        return _page;
    },

    DATA: function()
    {
        var _data =
        {
            /* Contiene il resultset della worklist */
            result: null,

            /* Oggetto per gestire la where */
            where: $.managerWhere(),

            flag:
            {
                load: false,
                filter_changed: false,
                order_changed: false
            },

            sources:
            {
                index: 0,
                urls: ['pageWorklistData'], /* Default */

                next_source: function()
                {
                    return ++this.index < this.urls.length;
                },

                get_url: function(idx)
                {
                    var i = LIB.isValid(idx) ? parseInt(idx, 10) : this.index;

                    if(i >= 0 && i < this.urls.length)
                    {
                        var url = this.urls[i];

                        if(url.indexOf('http') != 0)
                            url = $().getAbsolutePathServer() + url;

                        return url;
                    }

                    return 'pageWorklistData';
                }
            },

            generate_param_sender: function()
            {
                var obj     = $.managerObject();
                var config  = this._shortcut.getConfigStructure();

                /* Dati principali per la worklist */
                obj.set('ID_WK', config.id_worklist)
                    .set('ID_WK_QUERY', config.id_query)
                    .set('ID_CONNECTION', config.id_connection);

                /* Controllo se devo mandare dei dati per la paginazione */
                if(config.use_pager)
                    obj.set('PAGE_COUNT_ROW', this._root.page.count_row)
                        .set('PAGE_CURRENT', this._root.page.current)
                        .set('PAGE_SIZE', this._root.page.size);
                else
                    obj.set('PAGE_COUNT_ROW', 2);

                /* Controllo se c'è un order by settato */
                if(LIB.isValid(config.columns.sort))
                {
                    var a_sort  = config.columns.sort;
                    var sort    = '';

                    $.each(a_sort, function(idx, content)
                    {
                        $.each(content, function(campo, type)
                        {
                            if(campo != '')
                            {
                                if(sort != '')
                                    sort += ', ';

                                sort += campo + ' ' + type;
                            }
                        });
                    });

                    if(sort != '')
                        obj.set('PAGE_ORDER', 'order by ' + sort);
                }

                if(LIB.isValid(this.where.content))
                    obj.set('PAGE_WHERE', this.where.content);

                return obj.object;
            },

            generate_bind_sender: function()
            {
                var ret = decodeURIComponent($.param({PAGE_WHERE_BIND_NAME:this.where.bind_name}, true));

                if(ret != '')
                    return  '?' + ret + '&' + decodeURIComponent($.param({PAGE_WHERE_BIND_VALUE:this.where.bind_value}, true));
                else
                    return '';
            },

            load: function()
            {
                if(this.where.callback == null)
                {
                    var $this = this;
                    this.where.callback = function(){$this.flag.filter_changed = true;};
                }

                if(!this.flag.load)
                {
                    /* Per prima cosa, pulisco la tabella e inizializzo il page (se e' attivo) per sicurezza! */
                    this.result = null;
                    this._root.grid.clear();

                    /* Controllo se hanno cambiato i filtri */
                    if(this.flag.filter_changed)
                    {
                        this.sources.index = 0;
                        this._root.page.init();
                    }

                    if(LIB.isValid(this._root.config) && LIB.isValid(this._root.config.structure))
                    {
                        var $this       = this;
                        var objects     = this._shortcut.getObjects();
                        var structure   = this._shortcut.getConfigStructure();
                        var param       = $.extend(this._root.config.server,
                            {
                                send_data_form: true,
                                type: 'POST',
                                dataType: 'json',
                                data: null,
                                url: null,
                                timeout: 60000,

                                success: function(data, status, xhr, jump_cache)
                                {
                                    $this.result = data;
                                    $this._root.grid.populate(data);
                                    $this.flag.load = false;
                                    $this.flag.order_changed = false;
                                    $this.flag.filter_changed = false;

                                    if($this._root.cache.get_status() && !jump_cache)
                                    {
                                        var id = structure.id_worklist;
                                        $this._root.cache.append_data(data, id);
                                    }
                                },

                                error: function(XMLHttpRequest, textStatus, errorThrown)
                                {
                                    if(XMLHttpRequest.status == 600)
                                    {
                                        home.NOTIFICA.error(
                                            {
                                                message: XMLHttpRequest.responseText,
                                                title: "Errore interno!",
                                                timeout: 4,
                                                id: "wk"
                                            });

                                        $this._root.callback.invoke("load.error", $this, {textStatus: textStatus, errorThrown: errorThrown});
                                        objects.get('loading').hide();
                                    }
                                    else
                                    if($this.sources.next_source())
                                    {
                                        $this.flag.load = false;
                                        $this.flag.filter_changed = false;
                                        $this.load();
                                    }
                                    else
                                    {
                                        home.NOTIFICA.info(
                                            {
                                                message: 'Worklist in caricamento',
                                                title: "Worklist",
                                                timeout: 2,
                                                id: "wk"
                                            });

                                        $this._root.callback.invoke("load.error", $this, {textStatus: textStatus, errorThrown: errorThrown});
                                        objects.get('loading').hide();
                                    }
                                }
                            });

                        this.flag.load = true;
                        objects.get('loading').show();

                        /* Rimappo i valori dei filtri */
                        param.data = this.generate_param_sender();
                        param.url = this.sources.get_url() + this.generate_bind_sender();

                        if(this._root.callback.invoke("load.before", $this) == false)
                        {
                            objects.get('loading').hide();
                            this.flag.load = false;
                            $this.flag.filter_changed = false;

                            return;
                        }

                        /* Se la cache e' attiva e non sono stati cambiati i filtri o ordinamenti, provo a recuperarlo dalla cache! */
                        if(this._root.cache.get_status() && !this.flag.filter_changed && !this.flag.order_changed)
                        {
                            var id   = structure.id_worklist;
                            var data = this._root.cache.get_data(id);

                            if(LIB.isValid(data))
                            {
                                param.success(data, 'success', null, true);
                                this._root.callback.invoke("load.after", $this, {result:data});

                                return;
                            }
                        }
                        else
                        if(this._root.cache.get_status() && (this.flag.filter_changed || this.flag.order_changed))
                            this._root.cache.clear();

                        /* Lancio il caricamento dei dati... */
                        $.ajax(param).success(function(data)
                        {
                            if(data.rows.length == 0 && $this.sources.next_source())
                            {
                                $this.flag.load = false;
                                $this.flag.filter_changed = false;
                                $this.load();
                            }
                            else
                            {
                                $this._root.callback.invoke("load.after", $this, {result: data});
                            }
                        });
                    }
                    else
                        alert('Error: config is nothing!');
                }
            },

            get_row: function(row)
            {
                return this.result.rows[row];
            },

            append_row: function(params, data)
            {
                /*
                 param:{
                 [prepend:<boolean> default:true; true --> prepend, false --> append]
                 [,initRowFunction:<function>; function per agire sulla oggetto riga creata prima della creazione dell'oggetto html]
                 },
                 data:{ contiene la riga contenente i dati del resulset (opzionale)}
                 */

                var list    = this._shortcut.getConfigColumnsList();
                var row     = {};

                params = !LIB.isValid(params) ? {} : params;
                data = !LIB.isValid(data) ? {} : data;

                for(var i = 0; i < list.length; i++)
                    row[list[i].id_col] = !LIB.isValid(data[list[i].id_col]) ? "" : data[list[i].id_col];

                if(typeof params.initRowFunction == 'function')
                    try
                    {
                        params.initRowFunction(row);
                    }
                    catch(ex)
                    {
                    }

                if(!LIB.isValid(this.result))
                    this.result = {rows: new Array(0)};

                if(!LIB.isValid(param.prepend) || params.prepend)
                    this.result.rows.unshift(row);
                else
                    this.result.rows.push(row);

                this._root.grid.populate(this.result);
            },

            duplicate_row: function(index, params)
            {
                /*
                 params: vedere specifiche di append_row
                 */

                if(!LIB.isValid(index))
                    return alert('Indice di riga non valido per la duplicazione');

                this.append_row(params, $.extend({}, this.result.rows[index]));
            }
        };

        return _data;
    },

    SAVE: function()
    {
        var _save =
        {
            visible: function(index)
            {
                var col = this._shortcut.getConfigColumnsList()[index];

                toolKitWK.saveVisible(this._shortcut.getConfigStructure().id_worklist, col.id_col, col.visible ? "S":"N", index, $('form#EXTERN input#SITO').val());
            },

            position: function(index_1, index_2)
            {
                toolKitWK.savePosition(this._shortcut.getConfigStructure().id_worklist, index_1, index_2, $('form#EXTERN input#SITO').val());
            },

            width: function()
            {
                /* Per sicurezza, salvo tutte le colonne... */
                var list        = this._shortcut.getConfigColumnsList();
                var a_id        = new Array(list.length);
                var a_width     = new Array(list.length);
                var a_position  = new Array(list.length);

                for(var i = 0; i < list.length; i++)
                {
                    a_id[i]         = list[i].id_col;
                    a_width[i]      = list[i].width;
                    a_position[i]   = i;
                }

                toolKitWK.saveWidthMulti(this._shortcut.getConfigStructure().id_worklist, a_id, a_width, a_position, $('form#EXTERN input#SITO').val());
            },

            order: function()
            {
                var struct  = this._shortcut.getConfigStructure();
                var sort    = struct.columns.sort;
                var a_name  = new Array(sort.length);
                var a_type  = new Array(sort.length);

                $.each(sort, function(index, row)
                {
                    $.each(row, function(name, type)
                    {
                        if(name != '')
                        {
                            a_name[index] = name;
                            a_type[index] = type;
                        }
                    });
                });

                toolKitWK.saveOrder(struct.id_worklist, a_name, a_type, $('form#EXTERN input#SITO').val());
            }
        };

        return _save;
    },

    WORKLIST: function(server, structure)
    {
        var worklist = {};

        /* Senza tanti problemi ^_^ */
        /* Prima di tutto, creo tutti i componenti neccessari alla worklist... */
        $.each(this, function(id, obj_wk)
        {
            if(id != 'WORKLIST')
                worklist[id.toLowerCase()] = obj_wk(server, structure);
        });

        /* ... dopo di che assegno la variabile _root ad ogni componente per accedere all'oggetto worklist...
         (non si puo' fare prima perche' la gestione degli oggetti js e' veramente stuuuupida!) */
        $.each(worklist, function(id, component)
        {
            if(id != 'WORKLIST')
            {
                $.extend(component, {_root: worklist});

                /* Per evitare di diventare shemi, creo un oggetto "scorciatoia" per prendermi gli oggetti usati spesso e sovente */
                $.extend(component, {_shortcut:
                {
                    getContainer: function()
                    {
                        return worklist.structure.container;
                    },

                    getConfigStructure: function()
                    {
                        return worklist.config.structure;
                    },

                    getConfigColumns: function()
                    {
                        return worklist.config.structure.columns;
                    },

                    getConfigColumnsList: function()
                    {
                        return this.getConfigColumns().list;
                    },

                    getObjects: function()
                    {
                        return worklist.structure.objects;
                    }
                }});
            }
        });

        return worklist;
    }
};