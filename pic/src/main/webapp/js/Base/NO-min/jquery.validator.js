(function ($)
{
    $.extend($.fn,
    {
        validate: function (cfg)
        {
            var config = eval(cfg);

            if (!LIB.isValid(config))
            {
                return;
            }

            // if nothing is selected, return nothing; can't chain anyway
            if (!this.length)
            {
                if (config && window.console)
                {
                    console.warn("Nothing selected, can't validate, returning nothing.");
                }
                return;
            }

            // check if a validator for this form was already created
            var validator = $.data(this[0], "validator");
            if (validator)
            {
                return validator;
            }

            // Add novalidate tag if HTML5.
            this.attr("novalidate", "novalidate");

            validator = new $.validator(config, this[0]);
            $.data(this[0], "validator", validator);

            return validator;
        }
    });

    $.validator = function (cfg, form)
    {
        this.config = cfg;
        this.map_class = $.extend(true, {}, $.validator.map_class, cfg.map_class); //estendo le classi di default con quelle personalizzate;
        this.form = form;
        this.elements = [];
        this.listErrors = [];
        this.listImportants = [];

        this.init();
    };

    $.validator.format = function (source, params)
    {
        if (arguments.length === 2)
        {
            if (params.constructor !== Array)
            {
                params = [ params ];
            }
            $.each(params, function (i, n)
            {
                source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function ()
                {
                    return n;
                });
            });
        }

        return source;
    };

    $.extend($.validator,
    {
        defaults: {
            parent: null,
            status: "",
            errorClass: "",
            field_check: null,
            format: ""
        },

        defaultEvents: {
            change: function (ctx)
            {
                ctx.data.removeError($(this));
            }
        },

        map_class: {
            required: "tdObb",
            important: "tdImp",
            readonly: "tdROnly",
            disabled: "tdDisab",
            hide: "tdHide",
            error: "tdError"
        },

        messages: {
            required: traduzione.validRequired,
            important: traduzione.validImportant,
            email: traduzione.validEmail,
            url: traduzione.validUrl,
            number: traduzione.validNumber,
            digits: traduzione.validDigits,
            minlength: traduzione.validMinlength,
            maxlength: traduzione.validMaxlength,
            rangelength: traduzione.validRangelength,
            range: traduzione.validRange,
            max: traduzione.validMax,
            min: traduzione.validMin,
            fixedLength: traduzione.validFixedLength,
            hours: traduzione.validHours,
            date: traduzione.validDate,
            "atLeast": traduzione.atLeast


        },
        prototype: {
            init: function ()
            {
                var $this = this;
                if(!LIB.isValid(this.config.dependencies))this.config.dependencies = [];
                $.each(this.config.elements, function (k, v)
                {
                    $this.attach(k,v)
                });
            },
            attachDependencies:function(d){
                if(LIB.isValid(this.config.dependencies))
                {
                    this.config.dependencies.push(d);
                }
            },
            attach:function(k,v){
                var $this = this;
                var id = (typeof(k) === "object")?k:$("#" + k);
                $this.elements.push(id);
                id.data("name", v.name);
                if (LIB.isValid(v.getValue))//PROVVISORIO
                {
                    id.data("getValue", v.getValue);
                }
                if (LIB.isValid(v.parent))//PROVVISORIO
                {
                    id.data("parent", v.parent);
                }
                $this._attachEvents(id, v);
                $this._attachStatus(id, v);
                $this._attachRules(id, v);
                $this._attachTab(id, v);
                $this._attachMessages(id, v);
            },
            _attachEvents: function (el, v)
            {
                var $this = this;
                var events = $.extend({}, $.validator.defaultEvents, v.events);
                if (el.length)
                {
                    $.each(events, function (k, v)
                    {
                        if(LIB.isValid(el.data('ComboList')))el.find(".combolist_text").on(k, $this, v);
                    else
                            el.on(k, $this, v);
                    });
                }
            },
            _attachStatus: function (el, v)
            {
                if (el.length)
                {
                    if (LIB.isValid(v.status))
                    {
                        if($.isFunction(v.beforeAttachStatus) && !v.beforeAttachStatus.call(this,el,v))
                        {
                            return;
                        }
                        if (this.map_class[v.status])
                        {
                            el.data("status", v.status);
                            this._attachClass(el, this.map_class[v.status]);
                        }
                        if (v.status == "readonly")
                        {
                            this.setReadOnly(el);
                        }

                    }
                }
            },
            _attachTab: function (el, v)
            {
                if(el.length)
                {
                    if (LIB.isValid(v.tab))
                    {
                        el.data("tab", v.tab);
                    }
                }
            },
            _attachMessages: function (el, v)
            {
                var $this = this;
                if (el.length > 0)
                {
                    var msgs = $.extend({}, $.validator.messages, v.messages);
                    el.data("messages", msgs);
                }
            },
            _attachClass: function (el, classe)
            {
                var $this = this;
                switch (el.data("status"))
                {
                    case "hide":
                        if(el.is("fieldset") || el.is("div"))
                            el.addClass(classe);
                        el.closest("tr").addClass(classe);  //occhio se sono sullo stesso tr
                        break;

                    default:
                        $.each($this.getParent(el), function (k, v)
                        {
                            if($(v).data("ComboList")!="undefined");
                            $(v).find(".combolist_text").addClass(classe);
                            $(v).addClass(classe);
                        });

                        break;
                }
            },
            _attachRules: function (el, v)
            {
                if (LIB.isValid(v.rules))
                {
                    el.data("rules", v.rules);
                }
            },
            setReadOnly: function (el)
            {

                if(LIB.isValid(el.data('ComboList'))){el.data('ComboList').disable();return};
                if(LIB.isValid(el.data('CheckBox'))){el.data('CheckBox').disable();return};
                if(LIB.isValid(el.data('RadioBox'))){el.data('RadioBox').disable();return};
                switch (el.prop("tagName").toLowerCase())
                {
                    case "select":
                        el.attr("disabled", "disabled");
                        break;
                    default:
                        el.attr("readonly", "readonly");
                        break;
                }
            },

            getParent: function (el)
            {
                if (LIB.isValid(el.data("parent")))
                {
                    //alert("classe al parent");
                    return el.data("parent").call();
                }

                return el;

            },

            remClass: function (el, classe)
            {
                //alert("remClass - "+el.attr("id"));
                var $this = this;
                switch (classe)
                {
                    case "hide":
                        el.closest("tr").removeClass(classe);  //occhio se sono sullo stesso tr
                        break;
                    default:
                        $.each($this.getParent(el), function (k, v)
                        {
                            if($(v).data("ComboList")!="undefined");
                                $(v).find(".combolist_text").removeClass(classe);
                            $(v).removeClass(classe);
                        });

                        break;
                }
            },
            removeError: function (el)
            {
                this.remClass(el, this.map_class["error"]);
                if (LIB.isValid(el.data("status")))
                {
                    this._attachClass(el, this.map_class[el.data("status")])
                }
            },
            removeStatus: function (el)
            {
                if (LIB.isValid(el.data("status")))
                {
                    this.remClass(el, this.map_class[el.data("status")]);
                    el.removeData("status");
                }
            },
            changeStatus: function (el, new_status)
            {
                if (LIB.isValid(el.data("status")) && el.data("status") != new_status)
                {
                    this.removeStatus(el);
                    this._attachStatus(el, {"status": new_status});
                }
            },

            checkStatus: function (el)
            {
                var val = this.getValue(el);
                var errorMsg = [];
                if (!$.validator.methods[el.data("status")].call(this, val, el, null))
                {
                    if (el.data("status") == "important")
                    {
                        this.listImportants.push({element: el, msg: $.validator.messages[el.data("status")]});
                        return [];
                    }
                    errorMsg.push(el.data("messages")[el.data("status")]);
                    this.remClass(el, this.map_class[el.data("status")]);
                    this._attachClass(el, this.map_class["error"]); //provvisorio
                }

                return errorMsg;
            },
            checkRules: function (el)
            {
                if (el.data("status") != "required" && this.getValue(el) == "")
                {
                    return [];
                }

                var $this = this;
                var errorMsg = [];
                $.each(el.data("rules"), function (k, v)
                {
                    var val = $this.getValue(el);
                    if (!$.validator.methods[k].call($this, val, el, v))
                    {
                        errorMsg.push($.validator.format($.validator.messages[k], v));
                        $this.remClass(el, $this.map_class[el.data("status")]);
                        $this._attachClass(el, $this.map_class["error"]); //provvisorio
                    }
                });
                return errorMsg;
            },
            checkDependencies:function(d){
                var $this = this;
                if($.isFunction(d.condition))
                {
                    if(d.condition.call($this))
                    {
                        var result=0;
                        var el;
                        $.each(d.elements,function(k,v){
                            el = $(v);
                            var val = $this.getValue(el);
                            if($.validator.methods["required"].call($this,val,el,null))result++;
                        });
                        if(!eval('result '+ d.rule))$this.listErrors.push({element: el,title: d.name, msg: [$.validator.format($.validator.messages['atLeast'],result+1)]});
                    }
                }
            },
            check: function (el)
            {
                var listErr = [];
                if (LIB.isValid(el.data("status")))
                {
                    listErr = listErr.concat(this.checkStatus(el));
                }
                if (LIB.isValid(el.data("rules")))
                {
                    listErr = listErr.concat(this.checkRules(el));
                }
                if (listErr.length > 0)
                {
                    this.listErrors.push({element: el,title:el.data("name"), msg: listErr});
                }
            },
            checkForm: function ()
            {
                this.listErrors = []; //svuoto la lista degli errori
                this.listImportants = []; //svuoto la lista degli campi importanti non compilati
                var $this = this;
                for (var i = 0; i < this.elements.length; i++)
                {
                    $this.check(this.elements[i]);
                }
                /*controllo sulle dipendenze*/
                $.each(this.config.dependencies,function(k,v){
                    $this.checkDependencies(v);
                });

                this.showError();

            },
            valid: function ()
            {
                var $this = this;
                this.checkForm();

                if (this.listErrors.length == 0 && this.listImportants.length == 0)
                {
                    return true;
                }

                if (!(this.listErrors.length == 0))
                {
                    return false;
                }

                /*ODIO CHI HA INVENTATO I CAMPI IMPORTANTI*/
                if (!(this.listImportants.length == 0))
                {
                    $.dialog(traduzione.lblCampiImportanti,
                        {
                            title: traduzione.lblAttenzione,
                            showBtnClose: false,
                            buttons: [
                                {"label": traduzione.lblSi, "action": function ()
                                {
                                    $.dialog.hide();
                                    NS_FENIX_SCHEDA.registra({valida: false});
                                }},
                                {"label": traduzione.lblNo, "action": function ()
                                {
                                    $.dialog.hide();
                                    return false;
                                }}
                            ],
                            width: 300
                        }
                    );
                }
            },
            validAndReturnErrors:function(){
                //Non guardo i campi important
                this.checkForm();
                return {valid: (this.listErrors.length == 0), errors:this.listErrors};
            },
            showError: function ()
            {
                var $this = this;
                if (this.listErrors.length > 0) // DIVIDERE IN 2 FUNZIONI
                {
                    $this.goToMyTab(this.listErrors[0].element);
                    $.each(this.listErrors, function (k, v)
                    {
                        var m = "";
                        $.each(v.msg, function (k, v1)
                        {
                            m += v1 + "<br/>";
                        });
                        NOTIFICA.error({message: m, title: v.title});
                    });
                }

            },
            goToMyTab: function (el)
            {
                if (LIB.isValid(el.data('tab')))
                {
                    $(".tabs").data("Tabs").go(el.data('tab'));
                }
            },
            getLength: function (value, element)
            {
                switch (element[0].nodeName.toLowerCase())
                {
                    case "select":
                        if ($(element).prop("multiple"))
                        {
                            return $("option", element).length;
                        }
                        if ($("option:selected", element).length > 0)
                        {
                            if ($("option:selected", element).val() == "") //valutare or null
                            {
                                return 0;
                            }
                        }
                        else
                        {
                            return 0;
                        }
                        break;
                    case "input":
                        if($(element).attr("type")=="radio")
                        {
                            return $(element).filter(':checked').length;
                        }
                        break;
                }
                return value.length;
            },
            getValue: function (el)
            {
                if (LIB.isValid(el) && el.length)
                {
                    if (LIB.isValid(el.data("getValue")))
                    {
                        return el.data("getValue").call(this, el);
                    }

                    if(LIB.isValid(el.data("ComboList")))
                        return el.find(".combolist_val").val();

                    return el.val();
                }

                return null;
            },

            reset: function ()
            {
                var _this = this;

                this.listErrors = []; //svuoto la lista degli errori
                this.listImportants = []; //svuoto la lista degli campi importanti non compilati

                for (var i = 0; i < this.elements.length; i++)
                {
                    _this.removeStatus(this.elements[i]);
                    _this.removeError(this.elements[i]);
                }

                $(_this.form).data('validator', null);
            }
        },
        methods: {
            required: function (value, element, param)
            {

                if(typeof element =='undefined')return false;
                return this.getLength(value, element) > 0
            },
            important: function (value, element, param)
            {
                return this.getLength($.trim(value), element) > 0 && value != "";
            },
            readonly: function (value, element, param)
            {
                return true;
            },
            hide: function (value, element, param)
            {
                return true;
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/minlength
            minlength: function (value, element, param)
            {
                var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);
                return /*this.optional(element) ||*/length != 0 && length >= param; //IN PROVA!!
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/maxlength
            maxlength: function (value, element, param)
            {
                var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);
                return /*this.optional(element) ||*/ length != 0 && length <= param; //IN PROVA!!
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/rangelength
            rangelength: function (value, element, param)
            {
                var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);
                return /*this.optional(element) ||*/ ( length >= param[0] && length <= param[1] );
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/min
            min: function (value, element, param)
            {
                return /*this.optional(element) ||*/ value >= param;
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/max
            max: function (value, element, param)
            {
                return this.optional(element) || value <= param;
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/range
            range: function (value, element, param)
            {
                return /*this.optional(element) ||*/ ( value >= param[0] && value <= param[1] );
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/email
            email: function (value, element)
            {
                // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
                return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/number
            number: function (value, element)
            {
                //alert("number: "+ /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value));
                return /*this.optional(element)*/ value != "" && /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value); //IN PROVA!!!!
            },
            // http://docs.jquery.com/Plugins/Validation/Methods/digits
            digits: function (value, element)
            {
                return /*this.optional(element) ||*/ /^\d+$/.test(value);
            },
            fixedLength: function (value, element, param)
            {
                return this.getLength($.trim(value), element) == param;
            },
            hours: function( value, element)
            {
                var regexp = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/;

                return regexp.test(value);
            },
            date: function( value, element) {
            	
            	return moment( value ,"DD/MM/YYYY").isValid()
            }
        }
    });
})(jQuery);

