var logout = false;
//window.name = "home"; spostato nell'attributo TOP
//var home = window;
var RECOGNICE  = null;

$(document).ready(function ()
{
    $(document).ajaxError(NS_FENIX_TOP.handlerExpiredSession);

	NS_FENIX_TOP.init();
	NS_FENIX_TOP.setEvents();
	NS_FENIX_TOP.addMobileSupport();

	logger.debug("NS_FENIX_TOP caricato correttamente");

	NS_FENIX_PRINT.init();
	NS_FENIX_PRINT.setEvents();

	if(LIB.ToF(baseGlobal.ABILITA_CODE))
	{
		NS_FENIX_CODE.init();
		NS_FENIX_CODE.setEvents();
	}

	NS_NOTE.init();
	NS_NOTE.setEvents();

	NS_INFORMATIONS.init();
	NS_INFORMATIONS.setEvents();

	NS_FENIX_FIRMA.init();
	NS_FENIX_FIRMA.setEvents();

	if(LIB.ToF(baseGlobal.ABILITA_RICETTE))
	{
		NS_GESTIONE_RICETTE.init();
		NS_GESTIONE_RICETTE.setEvents();
	}

	eval('NS_FENIX_'+NS_FENIX_TOP.sito+'.init()');
	eval('NS_FENIX_'+NS_FENIX_TOP.sito+'.setEvents()');


	var load_on_startup = LIB.getParameter(home.baseUser, 'LOAD_ON_STARTUP');
	if(!load_on_startup) load_on_startup = baseGlobal.LOAD_ON_STARTUP;
	var full = false;

	var scheda_extern = $("input[name='scheda']","#EXTERN");

	if(scheda_extern.length > 0)
	{
		load_on_startup = baseGlobal.PAGE_URL + scheda_extern.val();
		var callClose = $("input[name='CALL_ON_CLOSE']","#EXTERN");
		if(callClose.length>0)
		{
			NS_FENIX_TOP.callAfterLogout= callClose.val();
		}
		full = true;
	}


	NS_FENIX_TOP.apriPagina({url: load_on_startup, id: 'TT', fullscreen:full});

	NS_FENIX_TOP.setInfoUser();
	NS_FENIX_TOP.initGlobalVocal();

	NS_DEBUG.init();
	NS_FENIX_MINI_MENU.initMenuVocale();
	NS_SESSION_CONTROL.setSessionId($.cookie("JSESSIONID"));
	setInterval(function(){ if(!NS_SESSION_CONTROL.checkSession()){NS_SESSION_CONTROL.openDialogErrorSession();}}, NS_SESSION_CONTROL.getIntervalCheckSession());
	home.document.title = "FeniX";
	NS_AGGIORNA.init();


});

var appletFenix = {

    RuotaAntiOrario: function ()
    {
        AppStampa.RuotaAntiOrario();
    },
    RuotaAntiOrarioAngolo: function (angolo)
    {
        AppStampa.RuotaAntiOrario(angolo);
    },
    RuotaOrario: function ()
    {
        AppStampa.RuotaOrario();
    },
    RuotaOrarioAngolo: function (angolo)
    {
        AppStampa.RuotaOrarioAngolo(angolo);
    },
    setZoom: function (zoom)
    {
        AppStampa.setZoom(angolo);
    },
    setZoom100: function ()
    {
        AppStampa.setZoom();
    },
    ZoomIn: function ()
    {
        AppStampa.ZoomIn();
    },
    ZoomInValore: function (zoom)
    {
        AppStampa.ZoomIn(zoom);
    },
    ZoomOut: function ()
    {
        AppStampa.ZoomOut();
    },
    ZoomOutValore: function (zoom)
    {
        AppStampa.ZoomOut(zoom);
    },
    PageUp: function ()
    {
        AppStampa.PageUp();
    },
    PageDown: function ()
    {
        AppStampa.PageDown();
    },
    setPagina: function (pagina)
    {
        AppStampa.setPagina(pagina);
    },
    getNPagine: function ()
    {
        return AppStampa.getNPagine();
    },
    PrimaPagina: function ()
    {
        AppStampa.PrimaPagina();
    },
    UltimaPagina: function ()
    {
        AppStampa.UltimaPagina ();
    },
    setNCopie: function (ncopie)
    {
        AppStampa.setNCopie(ncopie);
    },
    printOn: function (param,nativo)
    {
        AppStampa.printOn(param,nativo); /*TODO*/
    },
    print: function (stampante,parametri)
    {
        AppStampa.print(stampante,parametri);
    },

    printWithParamStampante: function (stampante,width,height)
    {
        AppStampa.printWithParamStampante(stampante,width,height);
    },

    printWithParam: function (width,height)
    {
        AppStampa.printWithParam(width,height);
    },
    printStampante: function (stampante)
    {
        AppStampa.printStampante(stampante);
    },
    getDocumentBase64: function()
    {
        return AppStampa.getBase64_Documento();
    },
    getPrinterList: function ()
    {
        return AppStampa.getPrinterList();
    },
    getScannerList: function (dllPath)
    {
        return AppStampa.getScannerList(dllPath);
    },
    setSrcUrl: function (url)
    {
        var res =  AppStampa.setSrcFromUrl(url);
        return JSON.parse(res);
    },
    firma: function (pin)
    {
        var res = AppStampa.FirmaP7m(pin);
        return JSON.parse(res);
    },
    getDocumentMd5: function ()
    {
        return AppStampa.getMD5_Documento();
    },
    getSmartCardID: function ()
    {
        return AppStampa.getSmartCardID(baseGlobal.PATH_PKCS11_SMART_CARD);
    },
    imageCapture:function(setPartImage,addImage,maxWidth,maxHeight)
    {
        AppStampa.imageCapture(setPartImage,addImage,maxWidth,maxHeight);
    },
    getPageCount:function(){
        return AppStampa.getPageCount();
    },
    salvaSuFile:function(defaultFileName){
        return JSON.parse(AppStampa.salvaSuFile(defaultFileName));
    },
    postCall:function(url,content_type,body){
        return AppStampa.postCall(url,content_type,body);
    },
    estraiTesto: function ()
    {
    	return AppStampa.getDocumentPlainText();
    },
    getSmartCardCertificatesInfo:function(pin){
        return JSON.parse(AppStampa.getSmartCardCertificatesInfo(pin));
    }

};

var NS_FENIX_TOP = {


    callAfterLogout:'',
    currentRowConsultaPrenotazione: new Array(),

    init: function ()
    {
        this.sito = $("#SITO").val();
        this.versione = $("#VERSIONE").val();
        this.HAS_APPLET = (typeof AppStampa == "object" || typeof AppStampa == "function");
        NS_CONSOLEJS.init();
        NS_CONSOLEJS.addLogger({name: 'home', console: 0});
        window.logger = NS_CONSOLEJS.loggers['home'];

        NS_CONSOLEJS.addLogger({name:"APPLET",console:0});
        this.APPLET_LOGGER = NS_CONSOLEJS.loggers["APPLET"];

        // Il dimensionamento del layout viene definito nella functione
        // configLayout richiamata dal plugin resizeEnd settato in setEvents
        // NS_FENIX_TOP.configLayout();

        this.attivaMenu();
        NS_FENIX_TOP.body = $('body');

    },

    setEvents: function ()
    {
        try
        {
            opener.chiudiHomepage();
        }
        catch (e)
        {
            logger.warn('opener.chiudiHomepage()');
        }

        window.onunload = NS_FENIX_TOP.logout;

        $(window).resizeEnd({
            onDragEnd: function ()
            {
				if ($.browser.chrome) {
					window.resizeTo(screen.width, screen.height);
				}
                NS_FENIX_TOP.configLayout();
            },
            runOnStart: true
        });

        $('body').on("click", chiudiMenu);

        var contextMenuAbilitato = LIB.getParameter(home.baseUser, 'ABILITA_CONTEXT_MENU');
        if(!contextMenuAbilitato || contextMenuAbilitato == 'N')
        {
            $('body').on('contextmenu',function(){return false;});
        }
    },

    handlerExpiredSession:function(event, jqxhr, settings, thrownError ){
      if(jqxhr['status']==600){
          window.location.replace("sdj_error.jsp?MSG=Sessione%20Scaduta!");
      }
    },
    addMobileSupport: function() {

		var metaTag = $( document.createElement('meta') ).attr({
			'name':			'viewport',
			'content':		'width=device-width, initial-scale=1, maximum-scale=1'
		});

		$('head').append( metaTag );

		if( $.browser.ipad || $.browser.iphone || $.browser.android ) {
			$( document.createElement('link')).attr({
				'rel':	'stylesheet',
				'href':	'css/mobile.css',
				'type':	'text/css'
			}).appendTo('head');
		}
	},

    setInfoUser: function()
    {
        $('#h5UsernameVal').html(home.baseUser.USERNAME + ' - ' + home.baseUser.DESCRIZIONE);
        $('#h5NomeHostVal').html(home.basePC.IP);
    },

    getAbsolutePathServer: function()
    {
        return home.location.protocol + '//' + home.location.hostname + ':' + home.location.port + '/' + home.location.pathname.split('/')[1] + '/';
    },

    logout: function (op)
    {
        if(logout) return;

        if (typeof op == 'undefined') var op = "LOGOUT";

        try
        {
            home.pacs.quit();
        }
        catch (e)
        {
        }

        home.NS_LOADING.showLoading({timeout: 0});

        try{
            if(LIB.isValid(NS_FENIX_TOP.callAfterLogout) && NS_FENIX_TOP.callAfterLogout!='')
            {
                eval('opener.' + NS_FENIX_TOP.callAfterLogout + "()");
                window.close();
                return;
            }
        }
        catch(e)
        {}

        logout = true;
        try
        {
            var baseurl = NS_FENIX_TOP.getAbsolutePathServer();
            home.location.replace(baseurl + "Logout?OP=" + op);
        }
        catch(e)
        {}

    },

    configLayout: function ()
    {
        var hBrowser = LIB.getHeight();
        var wBrowser = LIB.getWidth();

        var hMenuBar = $("#menuBar").outerHeight(true); this.hMenuBar = hMenuBar;
        var hStatBar = $("#statusBar").outerHeight(true);
        var hContent = hBrowser - hMenuBar - hStatBar;

        $("#content > iframe").height(hContent).attr("h", hContent).width(wBrowser);
    },

    attivaMenu: function ()
    {
        //	attivazione menu orizzontale
        $slidemenu.buildmenuClick("slidemenu");
    },

    apriPagina: function (param)
        /*{
         [url]			url della pagina da aprire (es: page?KEY=NOME_SCHEDA oppure http://pagina)
         [fullscreen]	true per aprire la pagina in un iframe fullscreen
         [height]       altezza personalizzata
         [sito]
         [versione]
         }*/
    {
        if (typeof param.url == 'undefined') return logger.error('apriPagina -> url non valida o mancante');
        if (typeof param.fullscreen == 'undefined') param.fullscreen = false;
        if (typeof param.showloading == 'undefined') param.showloading = true;
        if (typeof param.classe == 'undefined')param.classe="";
        if (!param.sito)param.sito = this.sito;
        if (!param.versione)param.versione = this.versione;

        if(param.url.indexOf('?') === -1) {
            var sito_versione = "?SITO=" + param.sito + "&VERSIONE=" + param.versione;
        }else{
            var sito_versione = "&SITO=" + param.sito + "&VERSIONE=" + param.versione;
        }
        logger.debug("NS_FENIX_TOP.apriPagina -> " + LIB.print_r(param));

        if (param.fullscreen == true)
        {
            var schede =[];
            $.each($(".iScheda", "body"),function(){
                schede.push($(this).attr("data-n_scheda"));
            });
            var n_scheda = (schede.length)?(parseInt(schede.sort()[schede.length-1])+1):1;
            var url = param.url + sito_versione + "&N_SCHEDA=" + n_scheda + '&time=' + new Date().getTime();
            var hFrame = LIB.getHeight() - $('#statusBar').height();

            if (typeof param.height != 'undefined')hFrame = param.height;

            $('<iframe />', {
                "id": "iScheda-" + n_scheda,
                "src": url,
                "height": hFrame,
                "allowTransparency" : "true",
                "data-key-legame": url,
                "data-n_scheda":n_scheda
            }).addClass("iScheda "+param.classe).appendTo('body');
        }
        else
        {
            var url = param.url + sito_versione + '&time=' + new Date().getTime();
            $('#iContent').attr('src', url).attr('data-key-legame', param.url);
        }

        if(param.showloading)NS_LOADING.showLoading({timeout: 0});
    },

    chiudiTutte: function ()
    {
        var n_schede = $(".iScheda", "body").length;
        if(n_schede > 0){
            for(var n = 1; n <= n_schede; n++){
                NS_FENIX_TOP.chiudiScheda({'n_scheda': n});
            }
        }
    },

    chiudiUltima: function ()
    {
        var schede =[];
        $.each($(".iScheda", "body"),function(){
            schede.push($(this).attr("data-n_scheda"));
        });
        var n_scheda = (schede.length)?(parseInt(schede.sort()[schede.length-1])):1;
        //var n_scheda = ($(".iScheda", "body").length);
        NS_FENIX_TOP.chiudiScheda({'n_scheda': n_scheda});
    },

    chiudiScheda: function (params)
        /*
         [n]
         */
    {
        $('#iScheda-' + params.n_scheda, "body").remove();
    },

    aggiorna: function (){
        /* ridefinire questa funzione tramite NS_AGGIORNA.set(function) */
        NS_AGGIORNA.set(NS_FENIX_TOP.empty);
    },

    empty: function()
    {
        ;
    },


    initGlobalVocal: function ()
    {
        if(LIB.isValid(home.basePC.GLOBAL_RECOGNICE) && LIB.isValid(home.baseUser.ATTIVA_GLOBAL_RECOGNICE) && home.baseUser.ATTIVA_GLOBAL_RECOGNICE=='S')
        {
            eval("home.RECOGNICE = " + home.basePC.GLOBAL_RECOGNICE);

        }
        else
        {
            home.RECOGNICE = NS_VOCAL;
        }

        paramApp=new Object();
        paramApp.name='appVocal';
        paramApp.target=$("#stampa");
        paramApp.param=JSON.parse(LIB.getParameter(home.basePC,"APPLET_VOCAL_PARAM")==null ? "{}" : home.basePC.APPLET_VOCAL_PARAM );

        home.RECOGNICE.setCallbacks(
            {
                'afterClientID':function(params)
                {
                    var codice_vocale = LIB.getParameter(home.baseUser,"CODICE_VOCALE");

                    if(codice_vocale != null && codice_vocale != '')
                        home.RECOGNICE.setup({'usercode': codice_vocale});
                    else
                        home.NOTIFICA.warning({ message: traduzione.warnProfiloVocaleNonCaricato, title: traduzione.lblAttenzione});
                }
            });
        home.RECOGNICE.init(paramApp);




    }

};

function chiudiMenu()
{
    $("#menuBar").find("ul").find("ul").slideUp($slidemenu.animateduration.out).prop("aperto", "false");
    $(".topMenuActive").removeClass("topMenuActive");
    $(".liMenuActive").removeClass("liMenuActive");
}



/*Gestione di ActiveMQ*/
var NS_FENIX_CODE =
{
    init: function ()
    {
        logger.info("Inizializzo CODE");
        NS_FENIX_CODE.appletFenix.startReceive();
    },
    setEvents: function ()
    {

    },
    appletFenix: {
        startReceive: function ()
        {
            try
            {
				if (typeof APPSTAMPA != "undefined") {
					$.when(APPSTAMPA.loaded).then(function() {
						AppStampa.AMQReceive(NS_FENIX_TOP.sito, "user = '" + baseUser.USERNAME + "' OR pc = '" + basePC.IP + "' OR tipo_personale = '" + baseUser.TIPO_PERSONALE + "'", baseUser.USERNAME);
					});
				} else {
					window.setTimeout(function() {
					   AppStampa.runThread("AMQReceive", [NS_FENIX_TOP.sito, "user = '" + baseUser.USERNAME + "' OR pc = '" + basePC.IP + "' OR tipo_personale = '" + baseUser.TIPO_PERSONALE + "'", baseUser.USERNAME]);
					}, 0);
				}
            }
            catch (e)
            {
                logger.error("Errore inizializzazione Code " + e.message);
            }
        },
        reportError:function(msg,priority)
        {
            AppStampa.reportError(msg,priority);
        }
    }
}



/*funzione richiamata dall'applet al disinserimento della smartcard*/
function SCLogout()
{
    NS_COMANDI_VOCALI.parla("Disinserimento smartcard. Disconnettere l'utente?")
    $.dialog("Disinserimento smartcard. <br> Disconnettere l'utente?",
        {
            title:"Avviso",
            width:300,
            timeout:10,
            showCountDown:true,
            showBtnClose:false,
            buttons:
                [
                    {label:traduzione.lblSi,action:function(){NS_FENIX_TOP.logout('LOGOUT')}},
                    {label:traduzione.lblNo,action: $.dialog.hide}
                ],
            autoClose:function(){NS_FENIX_TOP.logout('LOGOUT')}
        });

}


var NS_FENIX_MINI_MENU = {

    cambiaLogin: function ()
    {
        NS_FENIX_TOP.logout('CHANGELOGIN');
    },

    bloccaWorkstation: function (cbk)
    {

        $("body").append($("<div>").attr("id","divBlock"));
        DIALOG.autenticazione({callback:(cbk?cbk:NS_FENIX_MINI_MENU.sbloccaWorkstation),loadUser:true,config:{title:traduzione.titPostazioneBloccata,createOn:$("#divBlock")}});
        /*Cose Brutte*/
        $("#dialog-btn_Verifica").text(traduzione.butSblocca);
        $("#dialog-btn_Annulla").remove();
        /*End Cose brutte*/
    },
    sbloccaWorkstation: function (ctx,msg)
    {
        $("#divBlock").remove();
    },

    cdc: function ()
    {

    },

    logout: function ()
    {
        NS_FENIX_TOP.logout('LOGOUT');
    },
    initMenuVocale: function ()
    {

        if(LIB.isValid(home.baseUser.VOCALE_ATTIVO) && home.baseUser.VOCALE_ATTIVO=='S')
        {
            $("#linkVocaleCheck").find("i").removeClass("icon-mute").addClass("icon-mic").css({color:'#58fa58'});
        }
    },
    attivaDisattivaVocale: function ()
    {
        if(LIB.isValid(home.baseUser.VOCALE_ATTIVO) && home.baseUser.VOCALE_ATTIVO=='S')
        {
            home.baseUser.VOCALE_ATTIVO='N';
            $("#linkVocaleCheck").find("i").removeClass("icon-mic").addClass("icon-mute").css({color:'#FA5858'});
        }
        else
        {
            home.baseUser.VOCALE_ATTIVO='S';
            $("#linkVocaleCheck").find("i").removeClass("icon-mute").addClass("icon-mic").css({color:'#58fa58'});
        }

    }

};




var NS_FENIX_BOOK =
{

    init: function()
    {

        NS_FENIX_BOOK.fenixbookUrl	= 'http://192.168.3.159/fenixbook/login.php?' + NS_FENIX_BOOK.getLoginParameters();
        NS_FENIX_BOOK.iframe		= $('iframe#fenixbook').length > 0 ? $('iframe#fenixbook') : $('<iframe>', { 'id' : 'fenixbook', 'class' : 'iframe-right', 'src' : NS_FENIX_BOOK.fenixbookUrl }).appendTo('#content');
        NS_FENIX_BOOK.resize();

    },

    setEvents: function()
    {


    },

    resize: function()
    {

        var content = $('#content');
        var menuBar = $('#menuBar');

        NS_FENIX_BOOK.iframe.width( parseInt( content.outerWidth(true) / 2 ) ).height( content.outerHeight(true) - menuBar.outerHeight(true) ).css( 'top', menuBar.outerHeight(true) );

    },

    toggle: function()
    {

        NS_FENIX_BOOK.iframe.toggle();
        NS_FENIX_BOOK.resize();

    },

    getLoginParameters: function()
    {

        return 'username='+ baseUser.USERNAME +'&password=' + baseUser.PASSWORD;

    }

};


var NS_DEBUG =
{

    init: function()
    {
        if(typeof(basePermission) != 'undefined' && typeof(basePermission.DEBUGGER) !='undefined')
            if(basePermission.DEBUGGER.clearButton == "S"){
                NS_DEBUG.extendSiteButtons();
                NS_DEBUG.showClearButtons();
            }
    },
    clearButtons:{
        jcsClear : function(){return $(document.createElement('a')).text('CLEAR CACHE').on('click', NS_DEBUG.jcsClear);},
        consoleJS : function(){return $(document.createElement('a')).text('CONSOLE JS').on('click', home.NS_CONSOLEJS.toggleConsole);}
    },
    showClearButtons: function()
    {
        $('#h5DebugTit, #h5DebugVal').show();
        var $DebugContainer = $('#h5DebugVal');
        $DebugContainer.empty();
        $.each(NS_DEBUG.clearButtons,function(k,v){
            if($.isFunction(v)){
                $DebugContainer.append(v());
            }
        });
    },
    /**
     * PER ESTENDERE I BUTTONS: Creare un NAMESPACE "NS_DEBUG_[SITO]" e defifire l'oggetto clearButtons che verr� esteso con i default.
    */
    extendSiteButtons:function(){
        try{
            $.extend(NS_DEBUG.clearButtons,eval('NS_DEBUG_'+NS_FENIX_TOP.sito+'.clearButtons'));
        }catch(e){
            logger.info("No Debug Buttons to extend.")
        }


    },
    clearAll: function()
    {
        NS_DEBUG.purgePools();
        NS_DEBUG.springRefresh();
        NS_DEBUG.jcsClear();
    },

    purgePools: function()
    {
        //  Purge pools
        $.ajax(
            {
                url: "managerWeb?TYPE=POOL&ACTION=PURGE&ID=ALL"
            }).done(function (data)
            {
                home.NOTIFICA.info({
                    message: "Purge pools completed",
                    title: "Purge pools",
                    timeout: 2,
                    id: "purgePools"
                });
            });
    },

    springRefresh: function()
    {
        //  Spring refresh
        $.ajax(
            {
                url: "managerWeb?TYPE=CONTEXT&ACTION=REFRESH"
            }).done(function ( data )
            {
                home.NOTIFICA.info({
                    message: "Spring refresh completed",
                    title: "Spring refresh",
                    timeout: 2,
                    id: "springRefresh"
                });
            });
    },

    jcsClear: function()
    {
        //  JCSCache clear
        $.ajax(
            {
                url: "manager/JCSAdmin.jsp?action=clearAllRegions"
            }).done(function ( data )
            {
                home.NOTIFICA.info({
                    message: "JCSCache clear completed",
                    title: "JCSCache clear",
                    timeout: 2,
                    id: "JCSCacheClear"
                });
            });
    }
};

var NS_AGGIORNA =
{
    stackFunction: [],
    init: function(){
        NS_CONSOLEJS.addLogger({name: 'NS_AGGIORNA', console: 1});
        NS_AGGIORNA.logger = NS_CONSOLEJS.loggers['NS_AGGIORNA'];
        home.NS_AGGIORNA = this;
    },
    set: function (params) {
        /**
         [fnc] - funzione di aggiornamento
         [id] - identificativo della pagina che ridefinisce la funzione di aggiornamento
         */
        NS_AGGIORNA.logger.debug("NS_AGGIORNA.set con id: " + params.id);
        if(typeof params.fnc !== 'function'){
            NS_AGGIORNA.logger.error("NS_AGGIORNA.set con parametri errati [" + params.fnc + "]");
            return false;
        }
        NS_AGGIORNA.unset(params.id);
        NS_AGGIORNA.stackFunction.push(params);
    },
    unset: function(id){
        if (NS_AGGIORNA.stackFunction.length == 0) {
            NS_AGGIORNA.logger.warn("nessuna funzione di aggiornamento da rimuovere");
            return false;
        }
        // SE TROVATE UN ERRORE QUA -> INSERIRE script ecma.js in include_file con condizione IE8
        // INSERT INTO "CONFIG_WEB"."INCLUDE_FILES" (ORIGINE, LINGUA, PATH_FILE, ORDINE, ATTIVO, SITO, VERSIONE, CONDIZIONE, TIPO) VALUES ('MAIN_PAGE', 'IT', 'js/Base/NO-min/ecma.js', '1', 'S', 'ALL', '1', 'IE', 'JS');
        NS_AGGIORNA.stackFunction = NS_AGGIORNA.stackFunction.filter(function(el){
            return el.id != id;
        });
        return true;
    },
    aggiorna: function(){
        var n = NS_AGGIORNA.stackFunction.length;
        if(n == 0){
            NS_AGGIORNA.logger.warn("funzione di aggiornamento non disponibile");
            return false;
        }
        var el = NS_AGGIORNA.stackFunction[n-1];
        if(typeof el.fnc !== 'function'){
            NS_AGGIORNA.logger.error("NS_AGGIORNA.go di [" + el.fnc + "]");
            return false;
        }
        NS_AGGIORNA.logger.info("Esecuzione funzione di aggiornamento con id: " + el.id);
        try{
            el.fnc();
        }catch(e){
            NS_AGGIORNA.logger.error("Errore durante l'esecuzione della funzione di aggiornamento con id: " + el.id + ", errore: " + e.message);
        }
    }

};

/*
 * Work in progress per PS
 */
var NS_SESSION_CONTROL = {

    INTERVAL_CHECK_SESSION:1000,

    setIntervalCheckSession: function (msec_interval)
    {
        NS_SESSION_CONTROL.INTERVAL_CHECK_SESSION=msec_interval;
    },
    getIntervalCheckSession: function ()
    {
        return NS_SESSION_CONTROL.INTERVAL_CHECK_SESSION;
    },
    setSessionId: function(sess_id)
    {
       home.SESSION_FULL = sess_id;
       home.SESSION=NS_SESSION_CONTROL.getSessionWihoutPrefix(sess_id);
    },

    getSessionId: function()
    {
        return home.SESSION;
    },

    /**
     * Tolgo eventualmente la parte prima del carattere "~" che viene apposta da HAPROXY per stabilire il server preferenziale verso cui re-indirizzare
     */
    getSessionWihoutPrefix: function(sess_id){
		try {
			var ar = sess_id.split("~");
			return (ar.lenght === 1 ? sess_id : ar[1]);
		} catch (e) {
			/*TODO: possiamo mettere il session_id in un posto piu' acconcio, ma per ora good enough qui per chi non ha useHttpOnly=false*/
			return $("#AppStampa param[name=session_id]").val();
		}
    },

    checkSession: function()
    {
        return home.SESSION === NS_SESSION_CONTROL.getSessionWihoutPrefix($.cookie("JSESSIONID"));
    },

    openDialogErrorSession: function(call_back)
    {
        $.dialog("Attenzione un altro utente si è loggato sulla postazione.<br> La sessione Verrà chiusa",
            {
                title:"Avviso",
                width:300,
                timeout:10,
                showCountDown:true,
                showBtnClose:false,
                buttons:
                    [
                        {label:traduzione.lblOk,action:function(){
                            if(typeof call_back == 'function')
                            {
                                call_back();
                            }
                            else
                            {
                                NS_SESSION_CONTROL.defaultAfterDialogError();
                            }
                        }

                        }

                    ]

            });
    }      ,
    defaultAfterDialogError: function(){
        window.location.replace("sdj_error.jsp?MSG=Attenzione un altro utente si loggato sulla postazione. \n " +
        "La sessione verra terminata \n " +
        "SESSIONID OLD=" + home.SESSION + " \n  " +
        "NEW SESSION=" +  $.cookie("JSESSIONID"));
    }


};

var NS_SMARTCARD = {
	removed: function() {
		SCLogout();
	},

	error_connect: function() {
		//SCError('Inserire Correttamente la SmartCard.');
	},

	error_get_id: function() {
		//SCError('SmartCard non supportata per il login.');
	},

	login: function(card_id) {
		dwrBaseFactory.reloadUserFromCodice(card_id, false, NS_FENIX_TOP.sito, NS_FENIX_TOP.versione, function(result) {
			var changed_user = false;
			if (result != "") {
				changed_user = true;
				home.baseUser = JSON.parse(result);
				home.NS_FENIX_TOP.setInfoUser();
			}
			NS_SMARTCARD.afterLogin(changed_user);
		});
	},

	afterLogin: function(changed_user) {
		NS_FENIX_MINI_MENU.sbloccaWorkstation();
	}
};
