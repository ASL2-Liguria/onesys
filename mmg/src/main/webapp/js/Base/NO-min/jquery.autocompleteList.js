(function ($) {
    $.fn.autocompleteList = function (Id_list, options) {
        //alert(Id_list)($("#"+Id_list)) ;
        var autocompleteList;
        if (typeof($("#" + Id_list).data('acList')) != 'undefined') {
            autocompleteList = $("#" + Id_list).data('acList');
        } else {
            autocompleteList = new AutocompleteList(this.get(0), Id_list, options);
            $("#" + Id_list).data('acList', autocompleteList);
        }
        return autocompleteList;
    };

    function AutocompleteList(label, Id_list, options) {
        this.label = $(label);
        this.acList = $("#" + Id_list);
        this.textField = this.label.parent().next(".tdAC").children(":text");
        if (this.textField.length == 0) {
            this.textField = this.label.parent().find('.txtAC')
        }
        this.htextField = $("#h-" + this.textField.attr("id"));
        this.filtri = this.acList.find(".acListFiltri");
        this.wk;
        this.titolo = $(this.acList.find(".hC"));
        this.options = {
            id_wk: null,
            auto_sensitive_search:false /*se utilizzare di default la ricerca sensibile*/
        };
        this.v = [];
        this.b = [];
        this.extendOptions(options);
        this.setQueryBinds(this.options.binds); //setto le bind opzionali che mi vengono passate da configurazione
        this.initialize();
        return this;
    }

    AutocompleteList.prototype =
    {
        initialize: function () {
            this.setTitle(this.options.title);
            this.createFiltri();
            this.setEvents();

            Mousetrap.bind('esc', function () {
                $('.acListChiudi').trigger("click");
                return false;
            });
        },
        setTitle: function (title) {
            this.titolo.html(title);
        },
        setEvents: function () {
            var $this = this;
            $this.label.on("click", function (e) {
                e.preventDefault();
                $this.openList();
                //$this.closeSuggestions()
            });
            var txtfiltro = $(".txtACLfiltro", $this.filtri);
            txtfiltro.on("keyEnter", function () {
                $this.loadWKData($(this).val());
            });
            $this.acList.find(".acListChiudi").on("click", function (e) {
                e.preventDefault();
                $this.closeList();
            });
            $this.acList.find(".acListCerca").on("click", function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $this.loadWKData(txtfiltro.val());
            });
        },
        extendOptions: function (options) {
            $.extend(this.options, options);
        },
        // $('#...').data('acList').changeBindValue({"a":1,"b":2});  //ESEMPIO
        changeBindValue: function (param) {
            var $this = this;
            $.each(param, function (k, val) {
                if ($this.b.indexOf(k) > -1) {
                    $this.v[$this.b.indexOf(k)] = val.toString();
                }
                else {
                    $this.b.push(k);
                    $this.v.push(val.toString());
                }

                //alert($this.b)($this.v);
            });
        },
        setQueryBinds: function (param) {
            var $this = this;
            $.each(param, function (k, val) {
                $this.b.push(k);
                $this.v.push(val);

            });
            $this.b.push("descr");
            $this.v.push("");

        },
        openList: function () {
            var $this = this;
            this.showList();
            if (typeof(this.wk) == "undefined") //controllo se ho gi� la struttura della WK caricata
            {
                var hC = this.acList.find(".contentDiv").outerHeight(true);
                var hF = this.acList.find(".acListFiltri").outerHeight(true);
                this.acList.find(".acListWk").css({"width": 788, "height": (hC - hF - 17)});
                var WkParams = this.getStructTable();
                $.extend(WkParams,{
                    callback:
                    {
                        load: {
                            after:function(){$this.beforeLoadWk.call($this)}
                        }
                    }
                });
                this.wk = this.acList.find(".acListWk").worklist(WkParams);

                this.wk.structure.objects.get("t_body").on("select", ".clsSel", function () {
                    $this.returnSelected($this.wk.data.get_row($(this).data('index')));
                });

                // centro verticalmente
                var $acdiv = this.acList.find('.acListDiv');
                var mtop = (LIB.getHeight() - $acdiv.outerHeight()) / 2;
                $acdiv.css("margin-top", mtop + 'px');
            }
            var valore = (this.htextField.val() == '') ? this.textField.val() : '';
            $(".txtACLfiltro", this.filtri).val(valore);
            this.loadWKData(valore);

            $(".txtACLfiltro", this.filtri).focus();
        },
        beforeLoadWk:function(){
            if(this.wk.data.result.page.total==1)
            {
                this.returnSelected(this.wk.data.result.rows[0]);
            }
        },
        closeList: function () {
            if (this.htextField.val() == "") {
                this.clear();
            }
            this.hideList();
        },
        loadWKData: function (param) {
                ($(".CBpuls", this.filtri).hasClass("CBpulsSel")) ? this.v[this.b.indexOf("descr")] = param.like(true).toUpperCase() : this.v[this.b.indexOf("descr")] = param.like().toUpperCase()
                var paramsWk = {arBind: this.b, arValue: this.v};
                this.wk.data.where.init();
                if (param != null){this.wk.data.where.set('', paramsWk.arBind, paramsWk.arValue)};
                this.wk.data.load();

        },
        createFiltri: function () {
            var $cbkRicSens = $("<div>").addClass("CBpuls CBcolorDefault").text(traduzione.acListRicercaSensibile).append("<i>");
            if(this.options.auto_sensitive_search){$cbkRicSens.addClass("CBpulsSel")}
            $(".txtACLfiltro", this.filtri).parent().parent().append($("<td>").append($cbkRicSens));
            $(".CBpuls", this.filtri).on('click', function () {
                $(this).toggleClass("CBpulsSel");
            });
        },
        getStructTable: function () {
            var me = this;
            var ret = null;

            $.ajax({
                type: 'POST',
                dataType: 'text',
                contentType: "application/json; charset=utf-8",
                url: $().getAbsolutePathServer() + "pageWorklistStructure?ID_WK=" + me.options.id_wk + '&SITO=' + $("#SITO").val(),
                async: false,
                success: function (data) {
                    eval('ret = ' + data);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //alert('Error: ' + textStatus + '\nMessage:' + errorThrown + '\n' + me.options.id_wk);
                }
            });
            return ret;
        },
        returnSelected: function (ret) {
            var $this = this;
            this.textField.removeAttributes(/^data-c-/);
            var fn = this.options.onSelect;
            this.textField.val(ret.DESCR);
            $.each(ret, function (k, v) {
                $this.textField.attr("data-c-" + k, v);
                if (k == "VALUE") {
                    $this.htextField.val(v);
                }
            });
            this.closeList();
            this.textField.trigger("change");
            if ($.isFunction(fn)) {
                fn(ret);
            }
        },
        getValue: function () {
            return this.htextField.val();
        },
        showList: function () {
            this.acList.removeClass("hide");
        },
        hideList: function () {
            this.acList.addClass("hide");
        },
        disable: function () {
            this.closeList();
            this.label.off();
        },
        enable: function () {
            var $this = this;
            this.label.on("click", function (e) {
                e.preventDefault();
                $this.openList();
            }); //provvisorio
        },
        clear: function () {
            this.textField.removeAttributes(/^data-c-/);
            this.textField.val("");
            this.htextField.val("");
        }
    };
})(jQuery);