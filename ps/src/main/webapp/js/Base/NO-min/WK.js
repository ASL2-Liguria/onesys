function WK(params)
/*{
 [id]			id della worklist da caricare
 [container]	contenitore o id del contenitore dove caricare la worklist
 [aBind]		parametri da passare alla query
 [aVal]			parametri da passare alla query
 [loadData]		carica i dati
 [type]			GET o POST
 }*/
{
    this.container  = (typeof params.container	!= 'undefined') ? params.container : "divWk";      //  [default] ID del div che conterra' la worklist
    this.loadData  = (typeof params.loadData	!= 'undefined') ? params.loadData : true;      //  [default] ID del div che conterra' la worklist
    this.$wk    = (typeof params.container == 'object') ? params.container : $("#"+this.container);
    this.idWk   = params.id;  //  ID della worklist
    this.idMenu = LIB.isValid(params.id_menu) ? $.trim(params.id_menu):'';
    this.aBind  = params.aBind;  //  parametri da passare alla query
    this.aVal   = params.aVal;  //  parametri da passare alla query
    this.id_connection = (typeof params.id_connection != 'undefined') ? params.id_connection : null;
    this.type = (typeof params.type != 'undefined') ? params.type : 'POST';

    this.build_callback = (typeof params.build_callback != 'undefined') ? params.build_callback : null;
    this.load_callback = (typeof params.load_callback != 'undefined') ? params.load_callback : null;
    this.load_callbefore = (typeof params.load_callbefore != 'undefined') ? params.load_callbefore : null;
    this.append_callback = (typeof params.append_callback != 'undefined') ? params.append_callback : null;
    this.customizeConfig = (typeof params.customizeConfig != 'undefined') ? params.customizeConfig : null;

    home.NS_CONSOLEJS.addLogger({name:this.idWk,console:0});
    this.logger = home.NS_CONSOLEJS.loggers[this.idWk];

    this.loadWk = function()
    {
        var $this = this;
        var $wk = this.$wk;

        $.ajax(
        {
            type: $this.type,
            dataType: 'text',
            url: $().getAbsolutePathServer() + 'pageWorklistStructure?ID_WK=' + $this.idWk + '&ID_MENU=' + $this.idMenu + '&SITO=' + $("#SITO").val(),
            success: function(struct)
            {
                var jsonStruct = null;

                eval("jsonStruct = " + struct);

                if($this.id_connection)
                    jsonStruct.id_connection = $this.id_connection;

                //alert(jsonStruct);

                /* Aggiunta automatica per il contextmenu in caso di mobile... ^_^ */
                if($.browser.ipad || $.browser.iphone || $.browser.android)
                {
                    var col_cm =
                    {
                        "process": function(data, wk)
                        {
                            return"<i class='icon-cog-1 openCM'></i>";
                        },
                        "id_col": "MENU",
                        "visible": true,
                        "width": "35px",
                        "sortable": false,
                        "align": "center",
                        "movable": false,
                        "resizable": false,
                        "savable": false
                    }

                    jsonStruct.columns.list.unshift(col_cm);

                    /* Setto l'evento click tramite callback*/
                    $.extend(jsonStruct,
                        {
                            callback:
                            {
                                build:
                                {
                                    after: function()
                                    {
                                        var $this = this;

                                        $($this.structure.objects.get('d_body')).on('click', '.openCM', function(e)
                                        {
                                            var c_menu  = $this.structure.objects.get('d_body').contextMenu(this, {openSubMenuEvent: "click", openInfoEvent: "click"});
                                            var tr      = $(e.target).closest('tr');

                                            if($this.selected.indexs.indexOf(tr.data('index')) < 0)
                                                tr.trigger('click');

                                            e.preventDefault();
                                            e.stopImmediatePropagation();

                                            c_menu.test(e, $this.selected.get_array_record());
                                        });
                                    }
                                }
                            }
                        });
                }// FINE MOBILE

                if($this.load_callback)
                    $.extend(jsonStruct,
                        {
                            callback:
                            {
                                load:
                                {

                                    after:$this.load_callback

                                }

                            }
                        });
                if($this.load_callbefore)
                    $.extend(jsonStruct,
                        {
                            callback:
                            {
                                load:
                                {

                                    before:$this.load_callbefore

                                }

                            }
                        });
                if($this.build_callback)
                    $.extend(jsonStruct,
                        {
                            callback:
                            {
                                build: $this.build_callback
                            }
                        });

                if($this.append_callback)
                    $.extend(jsonStruct,
                        {
                            callback:
                            {
                                append: $this.append_callback
                            }
                        });

                /*funzione per modificare la configurazione della struttura prima dell'inizializzazione*/
                if($.isFunction($this.customizeConfig)){
                    jsonStruct = $this.customizeConfig(jsonStruct);
                }

                // qua magari si puo aggiungere un metodo di WK per aggiungere/mod alcune colonne o altro nella wk


                if($wk != null)
                {
                    var sub = $wk.worklist(jsonStruct);
                    if($this.loadData)
                    {
                        if(($this.aBind != null) && ($this.aVal != null))
                        {
                            sub.data.where.init();
                            sub.data.where.set('', $this.aBind, $this.aVal);
                        }
                        sub.data.load();
                    }
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown)
            {
                home.NOTIFICA.error({
                    message: 'Error: ' + textStatus + '\nMessage:' + errorThrown,
                    title: "Errore Worklist",
                    timeout: 5
                });

                $this.logger.debug("Worklist ["+this.idWk+"] caricata con ["+JSON.stringify(this.aBind)+"]");

                if(LIB.isValid($wk.structure))
                    $wk.structure.objects.get('loading').hide();
            }
        });

        this.logger.debug("Worklist ["+this.idWk+"] caricata con ["+JSON.stringify(this.aBind)+"]["+JSON.stringify(this.aVal)+"]");
    };

    this.setIdConnection = function(id_connection)
    {
        this.id_connection = id_connection;
    }

    /**
     * Metodo per ricaricare i dati delle worklist
     */
    this.refresh = function()
    {
        this.$wk.worklist().data.load();
    }

    /**
     *  Ritorna l'array di valori delle righe selezionate
     */
    this.getArrayRecord = function()
    {
        return this.$wk.worklist().selected.get_array_record();
    }

    /**
     * Mantiene la selezione
     * @param e
     */
    this.keepSelection = function(e)
    {
        var tr = $(e.target).closest('tr');

        if(this.$wk.worklist().selected.indexs.indexOf(tr.data('index')) < 0)
            tr.trigger('click');
    }

    /**
     * Metodo per fitrare i dati delle worklist
     */
    this.filter=function(param)
    {
        var $this = this;
        /*
            [param.aBind]    bind da passare alla query
            [param.aVal]   bind da passare alla query
        */
        if(LIB.isValid(param))
        {
            var WK= this.$wk.worklist();

            WK.data.where.init();
            WK.data.where.set('', param.aBind, param.aVal);
            WK.data.load();
            $this.logger.debug("Worklist ["+$this.idWk+"] filtrata con ["+JSON.stringify(param.aBind)+"]["+JSON.stringify(param.aVal)+"]");
        }
    }

    /**
     * @returns {numero righe della query}
     */
    this.getTotal = function()
    {
        return this.$wk.worklist().data.result.page.total;
    }

    /**
     * @returns {json della riga con indice idx}
     */
    this.getRow = function(idx)
    {
        return this.$wk.worklist().data.result.rows[idx];
    }

    /**
     * @returns {json di tutte le righe}
     */
    this.getRows = function()
    {
        return this.$wk.worklist().data.result.rows;
    }

    /**
     *  trigger event sulla riga con data-iden dato
     */
    this.eventRow = function(event, iden)
    {
        this.$wk.worklist().structure.objects.get('t_table').find("tr[data-iden='" + iden + "']").trigger(event);
    }

    this.search = function(key, value)
    {
        var rows = this.getRows();

        var r = rows.filter(function(el)
        {
            return el && el[key] && (el[key] == value);
        });

        return r;
    }
    /**
     *   @returns (json di tutte le righe selezionate)
     */
    this.getRowsSelected = function(){
        return this.$wk.worklist().selected.get_array_record();
    }
}