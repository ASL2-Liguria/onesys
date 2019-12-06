;
(function ($)
{
    function Popup(element, options, onReady)
    {
        this.element = $(element),
        this.options = options;

        this.init();
        this.setEvents();
    }

    $.fn.Popup = function (options, onReady)
    {
        var defaults =
        {
            width: 300,
            height: 200,
            title: '',
            // INDICA SE IL PLUGIN DEVE ESSERE VISIBILE ( TRUE ) O NO ( FALSE ) ALL'ATTO DELLA CREAZIONE
            startAsVisible: false,
            // AGGIUNGE ( TRUE ) O NO ( FALSE ) LA FRECCIA ALL'ELEMENTO SU CUI SI E' CLICCATO
            arrow: true,
            // POSIZIONE DELLA FRECCIA I VALORI AMMESSI SONO TOP, LEFT, BOTTOM, RIGHT
            arrowPosition: 'top',
            // IL CONTENUTO DEL POPUP, PUO' ESSERE UN SELETTORE JQUERY O DEL TESTO
            content: '',
            mousePosition: null,
            onClick: {
            	popup: true,
            	closebutton: true,
            	document: true
            }
        };

        var options = $.extend(true, defaults, options);
        var plugin = new Popup(this.get(0), options, onReady);

        $(this).data('Popup', plugin);

        if (typeof onReady === 'function')
        {
            onReady.call({ obj: this });
        }

        return plugin;
    };

    Popup.prototype = {
        elements: new Object(),
        classes: { popup: "popup", title: "title", arrow: "arrow", arrowborder: "arrow-border", visible: "visible", notvisible: "notvisible", content: "content", close: "close", iconclose: "icon-cancel" },

        init: function ()
        {
            var $this = this;

            this.element.closest("body").find(".popup").each(function ()
            {
                // RIMUOVO TUTTI I POPUP ESISTENTI
                $this.elements.popup = $(this);
                $this.destroy();
            });

            $(".hasPopup").removeClass("hasPopup");

            // AGGIUNGO LA CLASSE HASPOPUP ALL'ELEMENTO CUI SI APPENDE IL POPUP
            this.element.addClass("hasPopup");

            this.createPopup();

            this.options.startAsVisible ? this.show() : this.hide();

            this.resize();
        },

        // CREO IL CONTENITORE DEL POPUP E LO APPENDO AL SELETTORE DEL PLUGIN
        createPopup: function ()
        {
            this.elements.popup = $("<div>", { "class": this.classes.popup }).appendTo(this.element.closest("body"));

            if (this.options.arrow)
            {
                this.createArrow();
            }

            this.createTitle();
            this.createContent();
        },

        // CREO LA FRECCIA E IL SUO BORDO E AGGIUNGO LA CLASSE CHE NE INDICA L'ORIENTAMENTO
        createArrow: function ()
        {
            this.elements.arrow = $("<div>", { "class": this.classes.arrow + " " + this.options.arrowPosition }).appendTo(this.elements.popup);
            this.elements.arrowborder = $("<div>", { "class": this.classes.arrowborder + " " + this.options.arrowPosition }).appendTo(this.elements.popup);
        },

        // CREA IL TITOLO DEL POPUP
        createTitle: function ()
        {
            this.elements.title = $("<div>", { "class": this.classes.title, "html": "<span>" + this.options.title + "</span>"}).appendTo(this.elements.popup);
            this.createCloseButton();
        },

        // CREA L'ICON FONT DEL TASTO DI CHIUSURA DEL POPUP
        createCloseButton: function ()
        {
            this.elements.closebutton = $("<a>", { "class": this.classes.close, "html": "<i class='" + this.classes.iconclose + "'></i>" }).appendTo(this.elements.title);
        },

        // CREA LO SPAZIO PER IL CONTENUTO
        createContent: function ()
        {
            this.elements.content = $("<div>", { "class": this.classes.content }).appendTo(this.elements.popup);
            this.populateContent();
        },

        // POPOLA IL CONTENUTO CON I DATI IN ARRIVP
        populateContent: function ()
        {
            this.elements.content.html(this.options.content);
        },

        resize: function ()
        {
        	//var e = ( LIB.isValid(window.event) && LIB.isValid(window.event.pageX) && LIB.isValid(window.event.pageY) ) ? window.event : this.options.mousePosition;
        	var e = this.options.mousePosition || window.event;
        	var left = 0;
            var top = 0;

            // DIMENSIONO IL POPUP
            this.elements.popup.width(this.options.width).height(this.options.height);

            // A SECONDA DELLA POSIZIONE DELLA FRECCIA CAMBIO LE PROPRIETA DI POSIZIONAMENTO DEI CSS
            switch (this.options.arrowPosition.toLowerCase())
            {
                case 'top':
                    left = e.pageX - (this.elements.popup.outerWidth(true) / 2);
                    top = e.pageY + (this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1);

                    this.elements.popup.css({ "left": left, "top": top });
                    break;

                case 'top-left':
                    left = e.pageX - 6;
                    top = e.pageY + (this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1);

                    this.elements.popup.css({ "left": left, "top": top });
                    break;

                case 'top-right':
                    left = e.pageX + ((this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1)) / 2 - this.elements.popup.outerWidth(true);
                    top = e.pageY + (this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1);

                    this.elements.popup.css({ "left": left, "top": top });
                    break;
                    
                case 'bottom':
                    left = e.pageX - ((this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1) / 2);
                    top = e.pageY - (this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1) - this.elements.popup.outerHeight(true);

                    this.elements.popup.css({ "left": left, "top": top });
                    break;
                
                case 'bottom-right':
                	left = e.pageX + ((this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1)) / 2 - this.elements.popup.outerWidth(true);
                	top = e.pageY - (this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1) - this.elements.popup.outerHeight(true);
                	
                	this.elements.popup.css({ "left": left, "top": top });
                	break;
                
                case 'bottom-left':
                	left = e.pageX - (this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1) / 2;
                	top = e.pageY - (this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1) - this.elements.popup.outerHeight(true);
                	
                	this.elements.popup.css({ "left": left, "top": top });
                	break;

                case 'left':
                    left = e.pageX + (this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1);
                    top = e.pageY - ((this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1) / 2);

                    this.elements.popup.css({ "left": left, "top": top });
                    break;
				
				case 'left-top':
                    left = e.pageX + (this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1);
                    top = e.pageY - ((this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1) / 2);

                    this.elements.popup.css({ "left": left, "top": top });
                    break;
				
				case 'left-bottom':
                    left = e.pageX + (this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1);
                    top = e.pageY - this.elements.popup.outerHeight(true) + ((this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1) / 2) ;

                    this.elements.popup.css({ "left": left, "top": top });
                    break;

                case 'right':
                    left = e.pageX - (this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1) - this.elements.popup.outerWidth(true);
                    top = e.pageY - ((this.elements.arrowborder !== undefined ? this.elements.arrowborder.outerHeight(true) : 1) / 2);

                    this.elements.popup.css({ "left": left, "top": top });
                    break;
            }
            
            if (this.options.arrow) {            	
            	this.setArrowPosition();
            }
        },

        // POSIZIONA LA FRECCIA E IL SUO BORDO A META' DEL CONTENITORE POPUP IN BASE
        // ALL'ORIENTAMENTO SCELTO DALL'UTENTE
        // LE MODIFICHE A QUESTO METODO DEVONO SEGUIRE DI PARI PASSO
        setArrowPosition: function ()
        {
            var popupWidth = this.elements.popup.outerWidth(true);
            // QUELLE DEL CSS POPUP.CSS
            var popupHeight = this.elements.popup.outerHeight(true);
            var arrowWidth = this.elements.arrow.outerWidth(true);
            var arrowHeight = this.elements.arrow.outerHeight(true);
            var left = 0;
            var top = 0;
            var right = 0;
            var bottom = 0;

            switch (this.options.arrowPosition.toLowerCase())
            {
                // CALCOLO IL POSIZIONAMENTO DELLA FRECCIA E DEL SUO BORDO, CON ORIENTAMENTO TOP
                case 'top' :

                    top = -10;
                    left = ( popupWidth / 2 ) - ( arrowWidth / 2 );

                    this.elements.arrow.css({ "left": left, "top": top });
                    this.elements.arrowborder.css({ "left": left, "top": ( top - 2 ) });

                    break;

                // CALCOLO IL POSIZIONAMENTO DELLA FRECCIA E DEL SUO BORDO, CON ORIENTAMENTO TOP
                case 'top-left' :

                    top = -10;
                    left = 0;

                    this.elements.arrow.css({ "left": left, "top": top });
                    this.elements.arrowborder.css({ "left": left, "top": ( top - 2 ) });

                    break;

                    // CALCOLO IL POSIZIONAMENTO DELLA FRECCIA E DEL SUO BORDO, CON ORIENTAMENTO TOP
                case 'top-right' :

                    top = -10;
                    right = 0;

                    this.elements.arrow.css({ "right": right, "top": top });
                    this.elements.arrowborder.css({ "right": right, "top": ( top - 2 ) });

                    break;
                    
                // CALCOLO IL POSIZIONAMENTO DELLA FRECCIA E DEL SUO BORDO, CON ORIENTAMENTO BOTTOM
                case 'bottom' :

                    bottom = -10;
                    left = ( popupWidth / 2 ) - ( arrowWidth / 2 );

                    this.elements.arrow.css({ "left": left, "bottom": bottom });
                    this.elements.arrowborder.css({ "left": left, "bottom": ( bottom - 2 ) });

                    break;
               
                // CALCOLO IL POSIZIONAMENTO DELLA FRECCIA E DEL SUO BORDO, CON ORIENTAMENTO BOTTOM-RIGHT
                case 'bottom-right' :
                	
                	bottom = -10;
                	right = 0;
                	
                	this.elements.arrow.css({ "right": right, "bottom": bottom });
                	this.elements.arrowborder.css({ "right": right, "bottom": ( bottom - 2 ) });
                	
                	break;
                	// CALCOLO IL POSIZIONAMENTO DELLA FRECCIA E DEL SUO BORDO, CON ORIENTAMENTO BOTTOM-LEFT
                
                case 'bottom-left' :
                	
                	bottom = -10;
                	left = 0;
                	
                	this.elements.arrow.css({ "left": left, "bottom": bottom });
                	this.elements.arrowborder.css({ "left": left, "bottom": ( bottom - 2 ) });
                	
                	break;

                // CALCOLO IL POSIZIONAMENTO DELLA FRECCIA E DEL SUO BORDO, CON ORIENTAMENTO LEFT
                case 'left' :

                    top = ( popupHeight / 2 ) - ( arrowHeight / 2 );
                    left = -10;

                    this.elements.arrow.css({ "left": left, "top": top });
                    this.elements.arrowborder.css({ "left": ( left - 2 ), "top": top });

                    break;
				
				// CALCOLO IL POSIZIONAMENTO DELLA FRECCIA E DEL SUO BORDO, CON ORIENTAMENTO LEFT-TOP
                case 'left-top' :

                    top = 0;
                    left = -10;

                    this.elements.arrow.css({ "left": left, "top": top });
                    this.elements.arrowborder.css({ "left": ( left - 2 ), "top": top });

                    break;
				
				// CALCOLO IL POSIZIONAMENTO DELLA FRECCIA E DEL SUO BORDO, CON ORIENTAMENTO LEFT-BOTTOM
                case 'left-bottom' :

                    top = popupHeight - arrowHeight - 2;
                    left = -10;

                    this.elements.arrow.css({ "left": left, "top": top });
                    this.elements.arrowborder.css({ "left": ( left - 2 ), "top": top });

                    break;

                // CALCOLO IL POSIZIONAMENTO DELLA FRECCIA E DEL SUO BORDO, CON ORIENTAMENTO TOP
                case 'right' :

                    top = ( popupHeight / 2 ) - ( arrowHeight / 2 );
                    right = -10;

                    this.elements.arrow.css({ "right": right, "top": top });
                    this.elements.arrowborder.css({ "right": ( right - 2 ), "top": top });

                    break;
            }
        },

        setEvents: function ()
        {
            var $this = this;

            if ($this.options.onClick.popup) 
            	$this.elements.popup.on("click", function(e) { e.stopImmediatePropagation(); });
            else 
            	$this.elements.popup.unbind("click");

        	if ($this.options.onClick.closebutton) 
        		$this.elements.closebutton.on("click", function (event) { $this.hide(); });
        	else 
        		$this.elements.closebutton.unbind("click");

        	if ($this.options.onClick.document) 
        		$(document).on("click", function (event) { $this.destroy(); });
        	else 
        		$(document).unbind("click");
        },
        show: function ()
        {
            this.elements.popup.removeClass(this.classes.notvisible).addClass(this.classes.visible);
        },
        hide: function ()
        {
            this.elements.popup.removeClass(this.classes.visible).addClass(this.classes.notvisible);
        },
        destroy: function ()
        {
            this.elements.popup.remove();
        }
    } 
})(jQuery);