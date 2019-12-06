/****************************** DIALOG **********************************/
/*
 * jQuery  Dialog plugin 1.5.0
 * Released: May 17, 2013
 * 
 * Copyright (c) 2013 Jacopo Brovida
 *
 * @license http://www.opensource.org/licenses/mit-license.php
 * @license http://www.gnu.org/licenses/gpl.html
 * @project jquery.dialog
 * 
 * 
 * parametri:
 * 
 * 		title  titolo del Dialog
 * 		width langhezza del Dialog
 * 		height altezza del Dialog
 * 		timeout tempo di autochiusura del Dialog
 * 		showCountDown (boolean) visualizza o meno il countdown del tempo residuo alla chiusura
 *		showBtnClose  (boolean) visualizza o menu il tasto di chiusura (se false ricordarsi di aggiungere [$.dialog.hide()] nelle action dei tasti presenti)
 *	    showIconClose (boolean)	aggiunge l'icona di chiusura nell'header del dialog
 *	    ESCandClose	  (boolean) evento chiusura dialog se si preme il tasto ESC
 *	    movable (boolean)   indica se il dialog pu� essere spostato
 *	    createOn (Object) definisce il contenitore dove deve essere appeso il dialog
 *	    initShow (boolean) indica se il dialog deve essere visualizzato dopo essere stato creato
 * 		buttons:[
 {"label":,"action":}
 ]
 autoClose: funzione richiamato all'autochiusura del Dialog (se presente un form all'interno del dialog ritorna il serializeArray dei dati al suo interno)
 * 
 */
(function ($)
{

    function El(el)
    {
        return $(document.createElement(el));
    }

    $.dialog = function (msg, options)
    {
        if ((typeof(options.id) != "undefined") && $("#" + options.id).length > 0)
        {
            $("#" + options.id).data("Dialog").destroy();
        }
        if ((typeof(options.id) == "undefined") && $("#dialog_static").length > 0)
        {
            var d = $("#dialog_static").data("Dialog");
            d.destroy();
        }

        return  new Dialog(msg, options);
    }


    function Dialog(msg, options)
    {
        var $this = this;
        this.content = msg;
        this.settings = $.extend({}, this.defaults, options);
        this.structure = {
            mask: El('div').attr("id", "dialog-mask"),
            dl: El('div').addClass("dialog").attr("id", $this.settings.id),
            header: El('div').addClass('dialog_header dialog_header26'),
            title: El('span').addClass("hC"),
            icon: El('i').addClass("icon-cancel-circled dialog-icon-close"),
            body: El('div').addClass("dialog-content"),
            content: El('div').addClass("dialog-content-inner"),
            footer: El('div').addClass("dialog-button-container"),
            footer_buttons: El('div').addClass("dialog-button-container-float")
        };
        this.init();
        this.setEvents();
        this.structure.dl.attr('tabindex',-1);
        this.structure.dl.data("Dialog", $this);

        $.isFunction( this.settings.created ) && this.settings.created($this);
        
        return this;
    }

    Dialog.prototype = {
        defaults: {
            showMask:true,
            id: "dialog_static",
            width: "auto",
            height: "auto",
            showBtnClose: true,
            showIconClose: false,
            ESCandClose: false,
            initShow: true,
            movable: false,
            createOn: $("body"),
            buttons: [
                {"label": "Chiudi", "action": function (ctx)
                {
                    ctx.data.close();
                },
                "keycode": ""
                }
            ],
            showCountDown: false,
            timeout: 0,
            autoClose: $.dialog.hide,//modificare;
            onClose: null,
            created:null

        },
        init: function ()
        {
            this.build();
            this.setTitle();
            this.setContent(this.content);
            this.setButtons({});
            this.setDimension();
        },
        setEvents: function ()
        {
            var $this = this;
            this.structure.icon.on("click", function ()
            {
                $this.close();
            });
            if (this.settings.movable)
            {
                this.setMoveEvents();
            }
            if (this.settings.ESCandClose)
            {
                this.setESCEvent();
            }
            /*TODO: Valutare gestione evento per non avere il rischio di averlo associato anche quando il dialog viene rimosso*/
            this.settings.createOn.on('keydown',function( event ){

                var button = $this.structure.dl.find('[data-keycode="'+ event.keyCode +'"]');
                if( button.length)button.trigger('click');
            });
        },
        setMoveEvents: function ()
        {
            var $this = this;
            this.structure.header.on("mousedown", function ()
            {
                $this.onmove = true;
            });
            $("body").on("mouseup", function ()
            {
                $this.onmove = false;
            });

            $("body").on("mousemove", function (e)
            {
                if (!$this.onmove)
                {
                    return;
                }
                $this.structure.dl.css({"left": e.pageX, "top": e.pageY});
            });
        },
        setESCEvent: function ()
        {
            var $this = this;

            $("body").on("keydown", function (event)
            {
                var code = (event.keyCode ? event.keyCode : event.which);
                (code == 27) ? $this.close() : null;
            });
        },
        build: function ()
        {
            var $this = this;
            var mask = $("#dialog-mask");
            if (!mask.length > 0)
            {   if($this.settings.showMask)
                    $this.settings.createOn.append($this.structure.mask);
            }
            $this.settings.createOn.append(
                $this.structure.dl.append($this.structure.header.append($this.structure.title)
                        .append($this.structure.icon))
                    .append($this.structure.body.append($this.structure.content).append($this.structure.footer.append($this.structure.footer_buttons)))
            );
            (!this.settings.showIconClose) ? $this.structure.icon.hide() : null;
            (!this.settings.initShow) ? this.close() : this.open();
        },
        setButtons: function (param)
        {/*[btns]:oggetto configurazione btn; [append] boolean che indica se appendere o sovrascrivere quelli esistenti*/
            var $this = this;
            var btns = (typeof(param.btns) == "undefined") ? $this.settings.buttons : param.btns;
            (typeof(param.append) != "undefined" && param.append == true) ? null : $this.structure.footer_buttons.empty();
            $.each(btns, function (i, val)
            {
                var button = 
                	El('button')
                		.addClass("btn")
                			.attr("id", "dialog-btn_" + val.label)
                            .attr('data-keycode',val.keycode)
	                		    .text(val.label)
	                		        .on("click", $this, val.action);
                if(val.classe) button.addClass(val.classe);
                $this.structure.footer_buttons.append(button);
            });
            
        },
        setDimension: function (width, height)
        {
            var dlWidth = (typeof(width) != "undefined") ? width : this.settings.width;
            var dlHeight = (typeof(height) != "undefined") ? height : this.settings.height;
            this.structure.dl.css({'width': dlWidth});
            this.structure.dl.css({'height': dlHeight});
            this.structure.content.css({'height': dlHeight});
            if(LIB.isValid(this.settings.position))
                this.setPosition(this.settings.position.x,this.settings.position.y);
            else
                this.setPosition();
        },
        setPosition: function (top, left)
        {
            var dlTop = (typeof(top) != "undefined") ? top : Math.abs($(window).height() - this.structure.dl.height()) / 2;
            var dlLeft = (typeof(left) != "undefined") ? left : ($(window).width() - this.structure.dl.width()) / 2;
            this.structure.dl.css('top', dlTop);
            this.structure.dl.css('left', dlLeft);
        },
        setTitle: function (title)
        {
            var $this = this;
            if (LIB.isValid(title))
            {
                this.structure.title.text(title);
            }
            else
            {
                this.structure.title.text($this.settings.title);
            }
        },
        setContent: function (content)
        {
            this.structure.content.html(content);
        },
        appendContent: function (content)
        {
            this.structure.content.append(content);
        },
        getContent: function ()
        {
            return this.structure.content;
        },
        getForm: function ()  /*se presente un form nel content ritorno i dati*/
        {
            var form = this.structure.content.find("form");
            if (form.length)
            {
                return form.serializeArray();
            }
            return null;
        },
        open: function ()
        {
            if(this.settings.showMask)$("#dialog-mask").show();
            this.structure.dl.show();
            this.structure.dl.addClass('dialog-active');
            $("body").trigger("dialog-opened-" + this.settings.id);
        },
        close: function ()
        {
            this.structure.dl.hide();
            this.structure.dl.removeClass('dialog-active');
            if ($('.dialog.dialog-active').length == 0)
            {
                $("#dialog-mask").hide();
            }
            if ($.isFunction(this.settings.onClose))
            {
                this.settings.onClose();
            }
        },
        destroy: function ()
        {
            this.structure.dl.remove();
        },
        getObject: function ()
        {
            return this.structure.dl;
        }
    }

    $.dialog.hide = function ()
    {
        $('.dialog').hide();
        $('#dialog-mask').hide();
    };

})(jQuery);		