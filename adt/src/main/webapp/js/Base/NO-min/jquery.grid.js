;
(function ($)
{
    function grid(element, options, onReady)
    {
        // PUNTATORE ALL'ELEMENTO CUI SI APPENDE IL GRID ( DEVE AVERE LA CLASSE contentGrid )
        this.contentGrid = element,
            this.$contentGrid = $(this.contentGrid),
            this.elements =
            {
                // CONTENITORE DELLA TESTATA
                headerGrid: null,
                $headerGrid: null,
                // CONTENITORE DEI DATI
                dataGrid: null,
                $dataGrid: null,
                // CONTENITORE DELLE RIGHE ( E' IL PUNTATORE ALL'ULTIMO INSERITO )
                rowGrid: null,
                // CONTENITORE DELLA LABEL DELLE RIGHE ( E' IL PUNTATORE ALL'ULTIMO INSERITO )
                headRowGrid: null,
                // CONTENITORE DELLE COLONNE ( E' IL PUNTATORE ALL'ULTIMO INSERITO )
                contentColGrid: null                                                                                    
            },
            this.options = options;

        this.init();
    }

    $.fn.Grid = function (options, onReady)
    {

        var defaults =
        {
            // JSON DI STRUTTURA
            struct: {},

            // JSON DI DATI
            data: {},

            // FUNZIONE AL CLICK SULLA RIGA
            rowClick: function (event)
            {
                event.preventDefault();
            },

            // FUNZIONE AL CLICK SULLA COLONNA
            colClick: function (event)
            {
                event.preventDefault();
            },

            // FUNZIONE AL DOPPIO-CLICK SULLA RIGA
            rowDoubleClick: function (event)
            {
                event.preventDefault();
            },

            // FUNZIONE AL DOPPIO-CLICK SULLA COLONNA
            colDoubleClick: function (event)
            {
                event.preventDefault();
            },

            // ABILITA/DISABILITA CONTEXT MENU
            contextMenu: true,

            // CLASSE EXTRA DA AGGIUNGERE EVENTUALMENTE AL DIV DATAGRID PER GESTIRE L'ALTEZZA DELLE RIGHE
            dataGridClass: '',

            // FORMATTAZIONE DEL CONTENUTO DELLE COLONNE, VALE PER TUTTE LE COLONNE DEL JSON
            contentFormat: function (params)
            {
                return params.cell.html('')
            },

            // FORMATTAZIONE DEL CONTENUTO DELLE LABEL DELLE RIGHE
            labelFormat: function (text)
            {
                return text;
            }
        };

        var options = $.extend(defaults, options);

        var plugin = new grid(this.get(0), options, onReady);
        plugin.setEvents();

        var $this = $(this);
        $this.data('Grid', plugin);

        if (typeof onReady === 'function')
        {
            onReady.call({ obj: this });
        }

        return plugin;

    };

    grid.prototype = {

        // CLASSI DEGLI ELEMENTI DELLA GRIGLIA
        classes: { headerGrid: 'headerGrid', dataGrid: 'dataGrid', rowGrid: 'rowGrid', headRowGrid: 'headRowGrid', contentColGrid: 'contentColGrid', rowHover: 'rowHover', colHover: 'colHover' },

        // CONTATORI DI RIGHE E COLONNE
        counters: { rows: 0, cols: 0 },

        init: function ()
        {
            var $this = this;
            $this.clear();

            // Creo l'intestazione della griglia
            $this.createHeaderGrid();

            // CREAZIONE DATA GRID, CHE CONTIENE LE CELLE E LE LABEL DELLE RIGHE
            $this.createDataGrid();

            // AGGIORNO IL CONTATORE DELLE COLONNE
            $this.counters.cols = $this.options.struct.model.length;

            // Dimensiono le celle in base alla larghezza disponibile
            $this.resize();

            // Inizializzo il plugin per scorrere il dataGrid mantenendo l'intestazione fissa
            $this.initAntiscroll();
        },

        // CREA L'HEADER DELLA GRIGLIA
        createHeaderGrid: function ()
        {
            var $this = this;

            $this.elements.headerGrid = document.createElement('div');
            $this.elements.headerGrid.className = $this.classes.headerGrid;
            $this.contentGrid.appendChild($this.elements.headerGrid);
            $this.elements.$headerGrid = $($this.elements.headerGrid);

            $this.createRowGrid({ "type": "STRUCT", "json": $this.options.struct });
        },

        // CREA IL CONTENITORE DEI DATI DELLA GRIGLIA
        createDataGrid: function ()
        {
            var $this = this;
            var heightvar = $this.$contentGrid.height();// - $this.elements.$headerGrid.outerHeight(true);
            //console.log($this.$contentGrid);
            $this.elements.dataGrid = document.createElement('div')
            $this.elements.dataGrid.className = $this.classes.dataGrid;
            if($this.options.dataGridClass)
                $this.elements.dataGrid.className += ' ' + $this.options.dataGridClass;

            //$this.elements.dataGrid.className += ' ' + 'antiscroll-inner';
            $this.elements.$dataGrid = $($this.elements.dataGrid);
            //$this.elements.$dataGrid.height(heightvar);

            var wrap = document.createElement('div');
            wrap.className = 'antiscroll-wrap';
            $(wrap).height(heightvar - $this.elements.$headerGrid.outerHeight(true)).width(this.$contentGrid.width());
            wrap.appendChild($this.elements.dataGrid);
            $this.contentGrid.appendChild(wrap);

            // CICLO IL JSON DEI DATI
            for (var row in this.options.data)
            {
                $this.createRowGrid({ "type": "DATA", "json": $this.options.data[row], "id": $this.contentGrid.id + '_' + row });
                $this.counters.rows++;
            }
        },

        // CREA UNA RIGA. ACCETTA COME PARAMETRO UN OGGETTO CONTENENTE IL TIPO DI JSON ( STRUCT O DATA ) DA CUI LEGGERE E IL JSON STESSO
        createRowGrid: function (params)
        {
            var $this = this;

            if (params.type === 'STRUCT')
            {
                $this.elements.rowGrid = document.createElement('div');
                $this.elements.rowGrid.className = $this.classes.rowGrid
                $this.elements.headerGrid.appendChild($this.elements.rowGrid);
                $this.elements.$rowGrid = $($this.elements.rowGrid);
                $this.createHeadRowGrid(params);
            }
            else if (params.type === 'DATA')
            {
                $this.elements.rowGrid = document.createElement('div');
                $this.elements.rowGrid.id = params.id;
                $this.elements.rowGrid.className = $this.classes.rowGrid
                $this.elements.dataGrid.appendChild($this.elements.rowGrid);
                $this.elements.$rowGrid = $($this.elements.rowGrid);
                $this.createHeadRowGrid(params);
            }
        },

        // CREA LA LABEL DELLA RIGA
        createHeadRowGrid: function (params)
        {
            var $this = this;

            if (params.type === 'STRUCT')
            {
                $this.elements.headRowGrid = document.createElement('div');
                $this.elements.headRowGrid.className = $this.classes.headRowGrid;
                $this.elements.rowGrid.appendChild($this.elements.headRowGrid);
                $this.createContentColGrid(params);
            }
            else if (params.type === 'DATA')
            {
                $this.elements.headRowGrid = document.createElement('div');
                $this.elements.headRowGrid.className = $this.classes.headRowGrid;
                $this.elements.headRowGrid.setAttribute('data-code', params.json.code);
                $this.elements.headRowGrid.appendChild($this.createGeneralDiv($this.options.labelFormat(params.json.rowdescriptor)));
                $this.elements.rowGrid.appendChild($this.elements.headRowGrid);
                $this.createContentColGrid(params);
            }
        },

        // CREA IL CONTENITORE DELLE CELLE
        createContentColGrid: function (params)
        {
            var $this = this;
            $this.elements.contentColGrid = document.createElement('ul');
            $this.elements.contentColGrid.className = $this.classes.contentColGrid;

            $this.createContentColGridItems(params);

            $this.elements.rowGrid.appendChild($this.elements.contentColGrid);
        },

        // CREA LE CELLE DELLA GRIGLIA. IL JSON IN ARRIVO PUO' ESSERE STRUCT O DATA
        createContentColGridItems: function (params)
        {
            var $this = this;

            // LOGICA DI CREAZIONE DELL'INTESTAZIONE DELLA GRIGLIA ( JSON STRUCT )
            if (params.type === 'STRUCT')
            {
                for (var i = 0; i < params.json.model.length; i++)
                {
                    var li = document.createElement('li');
                    li.className = 'd' + params.json.model[i].position;
                    li.setAttribute("data-value", params.json.model[i].value);

                    var d = document.createElement('div');
                    d.innerHTML = params.json.model[i].display;
                    d.title = params.json.model[i].display;
                    li.appendChild(d);

                    $this.elements.contentColGrid.appendChild(li);
                }
            }
            // LOGICA DI CREAZIONE DEI DATI DELLA GRIGLIA ( JSON DATA )
            else if (params.type === 'DATA')
            {
                for (var i = 0; i < params.json.data.length; i++)
                {
                    var v = $this.options.struct.model[i].value;
                    var column = $this.elements.$headerGrid.find('li[data-value="' + v + '"]');
                    var row = $this.elements.$rowGrid;

                    var li = document.createElement('li');

                    // CONTROLLO CHE IL CONTENUTO DELLA CELLA NON SIA VUOTO
                    if (!$.isEmptyObject(params.json.data[i].content))
                    {
                        var contentFormatparams =
                        {
                            "json": params.json.data[i].content,
                            "column": column,
                            "row": row
                        }

                        li.id = params.id + '-' + $this.options.struct.model[ i ].value;
                        li.setAttribute('data-json', JSON.stringify(params.json.data[i].content));
                        li.setAttribute('data-column', $this.options.struct.model[i].value);
                        li.setAttribute('data-row', row.attr('id'));

                        li.appendChild($this.options.contentFormat(contentFormatparams))

                        $this.elements.contentColGrid.appendChild(li);
                    }
                    // SE LA CELLA E' VUOTA INSERISCO UN ELEMENTO NULLO PER POPOLARE IL GRID UNIFORMEMENTE
                    else
                    {
                        li.className = "liDisabled";
                        li.setAttribute('data-json', "");
                        li.setAttribute('data-column', $this.options.struct.model[i].value);
                        li.setAttribute('data-row', row.attr('id'));

                        var d = document.createElement('div');
                        d.title = traduzione.cellaDisabilitata;
                        li.appendChild(d);

                        $this.elements.contentColGrid.appendChild(li);
                    }
                }
            }
        },

        // CREA UN DIV NECESSARIO AL RENDERING DEL PADDING
        createGeneralDiv: function (text)
        {
            var d = document.createElement('div');
            d.title = ( text === '&nbsp;' ) ? traduzione.cellaDisabilitata : text;
            d.innerHTML = text;

            return d;
        },

        setHover: function ()
        {
            var $this = this;
            $this.elements.$dataGrid.find('.contentColGrid')
                .on('mouseenter', 'li:not(.liDisabled)', function ()
                {
                    var $this = $(this);
                    var column = $this.attr('data-column');
                    var row = $this.attr('data-row');

                    //  TODO optimize
                    // EVENTO HOVER SULLA RIGA
                    $('.headRowGrid', '#' + row).addClass('rowHover');
                    $('.contentColGrid > li[data-value=\'' + column + '\']', '.headerGrid').addClass('colHover');
                })
                .on('mouseleave', 'li:not(.liDisabled)', function ()
                {
                    //  TODO optimize
                    $('.headRowGrid', '.dataGrid').removeClass('rowHover');
                    $('.contentColGrid > li', '.headerGrid').removeClass('colHover');
                });
        },

        setEvents: function ()
        {
            var $this = this;

            // EVENTI SULLE RIGHE
            $('.rowGrid', $this.elements.$dataGrid)
                .on('click', $this.options.rowClick)
                .on('dblclick', $this.options.rowDoubleClick);

            // EVENTI SULLE CELLE
            $this.elements.$dataGrid.find('.contentColGrid')
                .on('click', 'li:not(.liDisabled)', $this.options.colClick)
                .on('dblclick', 'li:not(.liDisabled)', $this.options.colDoubleClick)

            $this.setHover();

            $this.$contentGrid.on('contextmenu', ( !$this.options.contextMenu ) ? function ()
            {
                return false;
            } : function ()
            {
                return true;
            });
        },

        resize: function ()                                                                                             // CREA UN TAG STYLE ON-THE-FLY IN CUI INSERISCE LA REGOLA CSS PER LE LARGHEZZE
        {
            var $this = this;
            var gridWidth = $this.elements.$dataGrid.innerWidth();

            var sideWidth = $this.elements.$dataGrid.find('.' + $this.classes.headRowGrid).outerWidth(true);
            var cellsWidth = (( gridWidth - sideWidth) / ( $this.counters.cols ));
            var cssRule = '#' + $this.$contentGrid.attr("id") + ' ul.contentColGrid > li{ width: ' + cellsWidth + 'px; }';

            $this.$contentGrid.append('<style>' + cssRule + '</style>');
        },

        initAntiscroll: function ()
        {
            var $this = this;
            $this.$contentGrid.find(".antiscroll-wrap").mCustomScrollbar({'theme':'minimal-dark', 'scrollInertia':0});//antiscroll();

            //per non vedere 1px
            var $dg = $this.$contentGrid.find(".dataGrid");
            $dg.width($dg.width() + 1)
                .height($dg.height() + 1);
        },

        getCounters: function ()                                                                                        // RITORNA L'OGGETTO DEI CONTATORI DI RIGHE E COLONNE, UTILE PER CICLARE LE RIGHE DEL GRID AL DI FUORI DEL PLUGIN
        {
            return this.counters;
        },

        clear: function ()
        {
            this.$contentGrid.empty();
        }
    }
})(jQuery);