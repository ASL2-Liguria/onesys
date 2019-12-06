$(document).ready(function()
{
   // da usare cosi: $(document).on('homeCreated', function(){});
    $(document).trigger('homeCreated');
    $(document).ajaxError(home.NS_FENIX_TOP.handlerExpiredSession);

    $(document).unbind('keydown').bind('keydown', function (event)
    {
        var doPrevent = false;
        if(event.keyCode === 8)
        {
            var d = event.srcElement || event.target;

            if((d.tagName.toUpperCase() === 'INPUT' &&
                    (
                    d.type.toUpperCase() === 'TEXT' ||
                    d.type.toUpperCase() === 'PASSWORD' ||
                    d.type.toUpperCase() === 'FILE' ||
                    d.type.toUpperCase() === 'EMAIL' ||
                    d.type.toUpperCase() === 'SEARCH' ||
                    d.type.toUpperCase() === 'DATE' )
                ) ||
                d.tagName.toUpperCase() === 'TEXTAREA')
            {
                doPrevent = d.readOnly || d.disabled;
            }
            else
                doPrevent = true;
        }

        if(doPrevent)
            event.preventDefault();
    });

    window.chiudiMenu = home.chiudiMenu;
});

var NS_FENIX = {

	init:function()
	{
        home.NS_CONSOLEJS.addLogger({name:'NS_FENIX',console:0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_FENIX'];

        NS_FENIX.fixLayout();

		NS_FENIX.attivaTabs();
        NS_FENIX.initPlugins();
	},
	setEvents:function()
	{
		$("body").on("click",chiudiMenu);
		Mousetrap.bind('ctrl+shift+h',home.NS_CONSOLEJS.toggleConsole);
		$('.buttons').DisableSelection();

        var contextMenuAbilitato = LIB.getParameter(home.baseUser, 'ABILITA_CONTEXT_MENU');
        if(!contextMenuAbilitato || contextMenuAbilitato == 'N')
        {
            $(document).on('contextmenu',function(){return false;});
        }

        $('form.dati').attr('action','javascript::return false;');

        $(window).on('unload', NS_FENIX.unsetAggiorna);
	},
	aggiorna:function()
	{
        home.NS_AGGIORNA.aggiorna();
	},
    fixLayout:function(){
          /*ridefinire nella scheda interessata */
    },
	attivaTabs:function()
	{
		$(".tabs").each(function(idx,val){
			id = $(val).prop("id");
			eval("var "+id+" = $('#"+id+"').Tabs();");
			eval("$('#"+id+"').find('ul li').DisableSelection();");
		});
	},
    initPlugins:function()
    {
        $.each(SCRIPT_PLUGIN,function(k,v)
        {
           try
           {
               //alert(v);
               eval(v);
           }
           catch(e)
           {
               logger.error("Errore inizializzazione plugin." + e.message + " -> " + v);
           }
        });
    },
    setAggiorna: function(fnc){
        if(typeof fnc !== 'function'){
            logger.warning("Errore durante la definizione della funzione di aggiornamento");
            return false;
        }
        var key = $("#KEY_LEGAME").val();
        var id = (key != "") ? key : "UNDEFINED_KEY_LEGAME";
        home.NS_AGGIORNA.set({
            "fnc": fnc,
            "id": id
        });
    },
    unsetAggiorna: function(){
        var key = $("#KEY_LEGAME").val();
        var id = (key != "") ? key : "UNDEFINED_KEY_LEGAME";
		if (typeof home.NS_AGGIORNA != "undefined") {
			home.NS_AGGIORNA.logger.debug("Rimozione funzione di aggiornamento con id: " + id);
			home.NS_AGGIORNA.unset(id);
		}
    }
};