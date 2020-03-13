/**
 *  Ajax Autocomplete for jQuery, version 1.1.5
 *  (c) 2010 Tomas Kirda, Vytautas Pranskunas
 *
 *  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
 *  For details, see the web site: http://www.devbridge.com/projects/autocomplete/jquery/
 *
 *  Last Review: 07/24/2012
 */

/*jslint onevar: true, evil: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*global window: true, document: true, clearInterval: true, setInterval: true, jQuery: true */

(function ($) {

    var reEscape = new RegExp('(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'].join('|\\') + ')', 'g');

    function fnFormatResult(value, data, currentValue) {
        var pattern = '(' + currentValue.replace(reEscape, '\\$1') + ')';
        return value.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
    }

    function Autocomplete(el, options) {
        this.el = $(el);
        this.hel = $("#h-" + this.el.attr("id"));
        this.el.attr('autocomplete', 'off');
        this.suggestions = [];
        this.data = [];
        this.value = [];
        this.badQueries = [];
        this.selectedIndex = -1;
        this.currentValue = this.el.val();
        this.intervalId = 0;
        this.cachedResponse = [];
        this.onChangeInterval = null;
        this.onChange = null;
        this.ignoreValueChange = false;
        this.serviceUrl = options.serviceUrl;
        this.isLocal = false;
        this.options = {
            autoSubmit: false,
            minChars: 3,
            showOnFocus: false,
            maxHeight: 300,
            deferRequestBy: 0,
            width: 0,
            highlight: true,
            params: {
                maxResults: 20
            },
            fnFormatResult: fnFormatResult,
            delimiter: null,
            zIndex: 9999,
            storedQuery: null,
            storedQueryOpz: null,
            condition: null,
            maxResults: 100,
            datasource: null,
            selectOnSingleResult:true /*se true seleziona in automatico il risultato (se ritorna un solo valore)*/
        };
        this.initialize();
        this.setOptions(options);

        this.el.data('autocomplete', this);
    }

    $.fn.autocomplete = function (options, optionName) {
        var autocompleteControl;
        if (typeof options == 'string') {
            autocompleteControl = this.data('autocomplete');
            if (typeof autocompleteControl[options] == 'function') {
                autocompleteControl[options](optionName);
            }
        } else {
            autocompleteControl = new Autocomplete(this.get(0) || $('<input />'), options);
        }
        return autocompleteControl;
    };


    Autocomplete.prototype = {

        killerFn: null,

        initialize: function () {

            var me, uid, autocompleteElId;
            me = this;
            uid = Math.floor(Math.random() * 0x100000).toString(16);
            autocompleteElId = 'Autocomplete_' + uid;

            this.killerFn = function (e) {
                if ($(e.target).parents('.autocomplete').size() === 0) {
                    me.killSuggestions();
                    me.disableKillerFn();
                }
            };

            if (!this.options.width) {
                this.options.width = this.el.width();
            }
            this.mainContainerId = 'AutocompleteContainter_' + uid;

            $('<div id="' + this.mainContainerId + '" style="position:absolute;z-index:9999;"><div class="autocomplete-w1"><div class="autocomplete" id="' + autocompleteElId + '" style="display:none; width:300px;"></div></div></div>').appendTo('body');

            this.container = $('#' + autocompleteElId);
            this.fixPosition();
            if (window.opera) {
                this.el.keypress(function (e) {
                    me.onKeyPress(e);
                });
            } else {
                this.el.keydown(function (e) {
                    me.onKeyPress(e);
                });
            }
            this.el.keyup(function (e) {
                me.onKeyUp(e);
            });
            this.el.blur(function (e) {
                me.enableKillerFn();
                me.validateField(e);
            });
            this.el.focus(function () {
                me.fixPosition();
                if(me.options.showOnFocus){
                    me.onValueChange();
                }
            });
            this.el.change(function () {
                me.onValueChanged();
            });
            $("body").click(function (e){me.enableKillerFn();})

        },

        extendOptions: function (options) {
            $.extend(this.options, options);
            //alert(JSON.stringify(this.options));
        },

        setOptions: function (options) {
            var o = this.options;

            options.showOnFocus = LIB.ToF(options.showOnFocus);
            this.extendOptions(options);
            if(o.showOnFocus){
                o.minChars = 0;
            }
            if (o.lookup || o.isLocal) {
                this.isLocal = true;
                if ($.isArray(o.lookup)) {
                    o.lookup = { suggestions: o.lookup, value: [] };
                }
            }
            $('#' + this.mainContainerId).css({ zIndex: o.zIndex });
            this.container.css({ maxHeight: o.maxHeight + 'px', width: o.width });
        },

        clearCache: function () {
            this.cachedResponse = [];
            this.badQueries = [];
        },

        disable: function () {
            this.el.attr("readonly", "readonly");
            this.disabled = true;
        },

        enable: function () {
            this.el.removeAttr("readonly");
            this.disabled = false;
        },

        fixPosition: function () {
            var offset = this.el.offset();
            $('#' + this.mainContainerId).css({ top: (offset.top + this.el.innerHeight()) + 'px', left: offset.left + 'px' });
        },

        enableKillerFn: function () {
            var me = this;
            $(document).bind('click', me.killerFn);
        },

        /*Richiamata al Blur del campo*/
        validateField: function (e) {
            var me = this;

            if(me.el.val() == ""){
                me.hel.val("");
                me.el.removeAttributes(/^data-c-/);
            }

            if ((me.hel.val() == "") && (me.el.val() != "")) //controllo se è un valore non valido e il campo non è vuoto
            {
                me.hide();
                if (typeof(me.options.idList) != "undefined") {   //se ho associato una List
                    $("#" + me.options.idList).data('acList').openList();     //obbligo ad aprire la lista
                } else {
                    me.el.val("");          //Pulisco il contenuto
                }
            }
            return true;
        },
        disableKillerFn: function () {
            var me = this;
            $(document).unbind('click', me.killerFn);
        },

        killSuggestions: function () {
            var me = this;
            this.stopKillSuggestions();
            this.intervalId = window.setInterval(function () {
                me.hide();
                me.stopKillSuggestions();
            }, 400);

        },

        stopKillSuggestions: function () {
            window.clearInterval(this.intervalId);
        },

        onValueChanged: function () {
            this.change(this.selectedIndex);
        },

        onKeyPress: function (e) {
            if (this.disabled) {
                e.preventDefault();
                return;
            }
            // return will exit the function
            // and event will not be prevented
            switch (e.keyCode) {
                case 27: //KEY_ESC:
                    this.el.val("");
                    this.hide();
                    this.killSuggestions();
                    break;
                case 9: //KEY_TAB:
                    clearInterval(this.onChangeInterval);
                    e.preventDefault();
                    this.validateField(e);
                    this.killSuggestions();
                    break;
                case 13: //KEY_ENTER:
                    e.preventDefault();
                    if (this.selectedIndex === -1) {
                        this.hide();
                        return;
                    }
                    this.select(this.selectedIndex);
                    break;
                case 38: //KEY_UP:
                    this.moveUp();
                    break;
                case 40: //KEY_DOWN:
                    this.moveDown();
                    break;
                default:
                    return;
            }
            e.stopImmediatePropagation();

        },

        onKeyUp: function (e) {
            if (this.disabled) {
                e.preventDefault();
                return;
            }
            switch (e.keyCode) {
                case 38: //KEY_UP:
                case 40: //KEY_DOWN:
                case 13: //KEY_ENTER:
                    return;

            }
            clearInterval(this.onChangeInterval);
            if (this.currentValue !== this.el.val()) {
                if (this.options.deferRequestBy > 0) {
                    var me = this;
                    this.onChangeInterval = setInterval(function () {
                        me.onValueChange();
                    }, this.options.deferRequestBy);
                } else {
                    this.onValueChange();
                }
            }
        },

        onValueChange: function () {

            clearInterval(this.onChangeInterval);
            if (this.hel.val() != "") {
                this.hel.val("");
                this.el.removeAttributes(/^data-c-/);
            }

            this.currentValue = this.el.val();
            var q = this.getQuery(this.currentValue.toUpperCase());//QUI
            this.selectedIndex = -1;
            if (this.ignoreValueChange) {
                this.ignoreValueChange = false;
                return;
            }
            if (q.length < this.options.minChars) {
                this.hide();
            } else {
                this.getSuggestions(q);
            }
        },

        getQuery: function (val) {
            var d, arr;
            d = this.options.delimiter;
            if (!d) {
                return val;
                /*$.trim(val);*/
            }
            arr = val.split(d);
            return arr[arr.length - 1];
            /*$.trim(arr[arr.length - 1])*/
        },

        getSuggestionsLocal: function (q) {
            var ret, arr, len, val, i;
            arr = this.options.lookup;
            len = arr.suggestions.length;
            ret = { suggestions: [], value: [] };
            q = q.toUpperCase();
            for (i = 0; i < len; i++) {
                val = arr.suggestions[i];

                if (val.toUpperCase().indexOf(q) === 0) {
                    ret.suggestions.push(val);
                    ret.value.push(arr.value[i]);
                }
            }
            return ret;
        },

        getSuggestions: function (q) {

            var cr, me;
            cr = this.isLocal ? this.getSuggestionsLocal(q) : this.cachedResponse[q]; //dadeta this.options.isLocal ||
            if (cr && $.isArray(cr.suggestions)) {
                this.suggestions = cr.suggestions;
                this.value = cr.value;
                this.suggest();
            } else if (!this.isBadQuery(q)) {
                me = this;
                me.options.params.filter = encodeURI(q);
                me.options.params.query = me.options.storedQuery;
                //alert(typeof(me.options.binds)+"-"+JSON.stringify(me.options.binds));
                var bindstmp = [];
                var valuestmp = [];
                $.each(me.options.binds, function (k, v) {
                    //alert(k+"-"+v);
                    bindstmp.push(k);
                    valuestmp.push(v);
                });

                //call extern function()  ..... return bind1 : $("@input").val()
                var b = {binds: bindstmp};
                var v = {values: valuestmp};

                // alert(JSON.stringify(me.options.params));

                if (me.options.storedQueryOpz != null) {
                    me.options.params.queryOpz = me.options.storedQueryOpz;
                }
                me.options.params.maxResults = me.options.maxResults;

                me.options.params.datasource = me.options.datasource;

                /*var params = { width:1680, height:1050,arr:[1,2,3,4,5]};
                 var str = jQuery.param(params,true);
                 $("#results").text(str);*/
                $.get(this.serviceUrl + "?" + $.param(b, true) + "&" + $.param(v, true), me.options.params, function (txt) {
                    me.processResponse(txt);
                }, 'text');
            }
        },

        isBadQuery: function (q) {
            var i = this.badQueries.length;
            while (i--) {
                if (q.indexOf(this.badQueries[i]) === 0) {
                    return true;
                }
            }
            return false;
        },

        hide: function () {
            this.enabled = false;
            this.selectedIndex = -1;
            this.container.hide();
        },

        suggest: function () {

            if (this.suggestions.length === 0) {
                this.hide();
                return;
            }

            if (LIB.ToF(this.options.selectOnSingleResult) && this.suggestions.length === 1) {

                this.select(0);//seleziono l'unico elemento presente
                this.hide();
                return;
            }

            var me, len, div, f, v, i, s, mOver, mClick;
            me = this;
            len = this.suggestions.length;
            f = this.options.fnFormatResult;
            v = this.getQuery(this.currentValue.toUpperCase());
            mOver = function (xi) {
                return function () {
                    me.activate(xi);
                };
            };
            mClick = function (xi) {
                return function () {
                    me.select(xi);
                };
            };
            this.container.hide().empty();
            for (i = 0; i < len; i++) {
                s = this.suggestions[i];
                div = $((me.selectedIndex === i ? '<div class="selected"' : '<div') + ' title="' + s + '">' + f(s, this.value[i], v) + '</div>');
                div.mouseover(mOver(i));
                div.on("click", mClick(i));
                this.container.append(div);
            }
            this.enabled = true;
            me.el.unbind("blur");
            this.container.show();
        },

        processResponse: function (text) {
            var response;
            var me = this;
            try {
                response = eval('(' + text + ')');
            } catch (err) {
                return;
            }
            if (!$.isArray(response.data)) {
                response.data = [];
            }
            if (!this.options.noCache) {
                this.cachedResponse[response.filter] = response;
                if (response.data.length === 0) {
                    this.badQueries.push(response.filter);
                }
            }
            if (response.filter === this.getQuery(this.currentValue.toUpperCase())) {
                me.data = response.data;
                me.suggestions = [];
                me.value = [];
                $.each(response.data, function (k, v) {
                    me.suggestions.push(v.DESCR);
                    me.value.push(v.VALUE);
                });
                this.suggest();
            }
        },

        activate: function (index) {
            var divs, activeItem;
            divs = this.container.children();
            // Clear previous selection:
            if (this.selectedIndex !== -1 && divs.length > this.selectedIndex) {
                $(divs.get(this.selectedIndex)).removeClass();
            }
            this.selectedIndex = index;
            if (this.selectedIndex !== -1 && divs.length > this.selectedIndex) {
                activeItem = divs.get(this.selectedIndex);
                $(activeItem).addClass('selected');
            }
            return activeItem;
        },

        deactivate: function (div, index) {
            div.className = '';
            if (this.selectedIndex === index) {
                this.selectedIndex = -1;
            }
        },

        select: function (i) {
            var selectedValue, f;
            selectedValue = this.suggestions[i];
            if (selectedValue) {
                this.el.val(selectedValue);
                this.ignoreValueChange = true;
                this.hide();
                this.onSelect(i);
            }
        },

        change: function (i) {
            var selectedValue, fn, me;
            me = this;
            selectedValue = this.suggestions[i];
            if (selectedValue) {
                var s, d;
                s = me.suggestions[i];
                d = me.value[i];
                me.el.val(me.getValue(s));
            }
            else {
                s = '';
                d = -1;
            }

            fn = me.options.onChange;
            if ($.isFunction(fn)) {
                fn(s, d, me.el);
            }
        },

        moveUp: function () {
            if (this.selectedIndex === -1) {
                return;
            }
            if (this.selectedIndex === 0) {
                this.container.children().get(0).className = '';
                this.selectedIndex = -1;
                this.el.val(this.currentValue);
                return;
            }
            this.adjustScroll(this.selectedIndex - 1);
        },

        moveDown: function () {
            if (this.selectedIndex === (this.suggestions.length - 1)) {
                return;
            }
            this.adjustScroll(this.selectedIndex + 1);
        },

        adjustScroll: function (i) {
            var activeItem, offsetTop, upperBound, lowerBound;
            activeItem = this.activate(i);
            offsetTop = activeItem.offsetTop;
            upperBound = this.container.scrollTop();
            lowerBound = upperBound + this.options.maxHeight - 25;
            if (offsetTop < upperBound) {
                this.container.scrollTop(offsetTop);
            } else if (offsetTop > lowerBound) {
                this.container.scrollTop(offsetTop - this.options.maxHeight + 25);
            }
            this.el.val(this.getValue(this.suggestions[i]));
        },

        onSelect: function (i) {
            var me, fn, s, d;
            me = this;
            fn = me.options.onSelect;
            s = me.suggestions[i];
            d = me.value[i];
            me.el.val(me.getValue(s));
            me.el.trigger("change");
            $.each(me.data[i], function (k, v) {
                //alert(k+"-"+v);
                me.el.attr("data-c-" + k, v);
                if (k == "VALUE") {
                    me.hel.val(v);
                }
            });
            if ($.isFunction(fn)) {
                fn(me.data[i], me.el);
            }
        },

        getValue: function (value) {
            var del, currVal, arr, me;
            me = this;
            del = me.options.delimiter;
            if (!del) {
                return value;
            }
            currVal = me.currentValue;
            arr = currVal.split(del);
            if (arr.length === 1) {
                return value;
            }
            return currVal.substr(0, currVal.length - arr[arr.length - 1].length) + value;
        },

        setCondition: function (value) {
            //alert(value);
            this.options.condition = value;
            //alert(this.options.condition);
            return;
        }

    };

}(jQuery));