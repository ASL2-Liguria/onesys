(function ($) {

    function Bookmark(_options) {
        this.options = {
            id:'bookmark',
            fromFx: false,
            fromUrl: false,
            fx:function(){},
            url:null,
            title:"Bookmark",
            icons : {text:'',full:'icon-star'},
            rightClick:function(){ $(this).remove();return false;},
            extern:{},
            multiple:true

        };
        this.setOptions(_options);
        this.initialize();
    }

    $.bookmark = function (options) {
        var elcoBookmark;
        elcoBookmark = new Bookmark( options);
        return elcoBookmark;
    };


    Bookmark.prototype = {

        initialize: function () {
            var me;
            me = this;
            this.addBookmark(this.options);
        },
        extendOptions: function (options) {
            $.extend(true,this.options, options);
        },
        setOptions: function (options) {
            var o = this.options;
            this.extendOptions(options);
        },
        addBookmark:function(options){
            /* id : 1234,url:key_legame=SCHEDA_AAAA,fx:NAMESPACE.apri();*/
            var $this=this;
            this.removeObject(options.id,options.multiple);
            var $ico = $(document.createElement("i")).attr(
                {
                    "class":options.icons.full,
                    "id":"bookmark-"+options.id,
                    "title":options.title
                }).on('click',this.open).on('contextmenu',options.rightClick).on('mouseover',function(){$this.showDialog(this,options)});

            $ico.data("obj",options);
            $ico.data("fx",options.fx);
            $ico.data("url",typeof options.url=='undefined'?'': options.url);
            $ico.data("extern",options.extern);
            $ico.html(options.icons.text);
            /*this.removeObject($ico);*/
            $("#statusBar #statDx").append($ico);
            this.animateLight($ico,'yellow',2000);
        },
        getObject:function(_id){
            return $("#statusBar #statDx #bookmark-"+_id);
        },
        removeObject:function(_id,multiple){
            if(!multiple){
                $.each($("#statusBar #statDx [id^='bookmark']"),function(k,v){
                    $(v).remove();
                });
            }
            $("#statusBar #statDx #bookmark-"+_id).remove();
        },
        showDialog:function(e,_options){
            /*$.infoDialog({
             event:e,
             classPopup:"",
             headerContent: "Bookmark" ,
             content:[{"Oggetto":_options.title}],
             width:200,
             height:100,
             dataJSON:true
             });*/
        },
        open:function(){
            if($(this).data("obj")["fromUrl"]){
                if(typeof $(this).data("url") != 'undefined' && $(this).data("url") != null)
                    home.NS_FENIX_TOP.apriPagina($(this).data("url"));
            }else{
                $(this).data("obj").fx(this);
            }
        },
        animateLight:function($elem,highlightColor, duration) {
            notLocked = true;
            var highlightBg = highlightColor || "#FFFF9C";
            var animateMs = duration || 3000;
            var originalBg = $elem.css("backgroundColor");
            if (notLocked) {
                notLocked = false;
                $elem.stop().css("background-color", highlightBg)
                    .animate({backgroundColor: originalBg}, animateMs);
                setTimeout( function() { notLocked = true; }, animateMs);
            }
        }
    };

} (jQuery));

var NS_BOOKMARK = {
    addBookmark: function (params) {
        $.bookmark(params);
    },
    CONSOLE: {
        checkBookmark:function(params){
            if($("#statusBar #statDx [id^='bookmark']").length>0){
                home.NOTIFICA.error({message: "Impossibile ridurre a icona un'ulteriore console", title: "Rimuovere oggetto", timeout: 5});
                return false;
            }
            return true;
        },
        openConsole: function (_elem) {
            var consoleAperta = false;
            var n_schede = $(".iScheda", "body").length;
            if(n_schede > 0){
                $.each($(".iScheda", "body"),function(){
                    if($(this).attr("data-key-legame").indexOf("KEY_LEGAME=CONSOLE")>-1)
                        consoleAperta = true;
                });
                if(consoleAperta)
                    home.NOTIFICA.error({message: "Impossibile sovrapporre 2 console contemporaneamente, chiudere la console attualmente aperta", title: "Chiudere la console!", timeout: 5});
            }

            if(consoleAperta)
                return;

                var db = $.NS_DB.getTool();
                var $this = $(_elem);
                var dbParams =
                {
                    pIdenCdc:{v:$this.data("extern")["IDEN_CDC"],t:'V'},
                    pIdenNomenclatore: {v: $this.data("extern")["IDEN_NOMENCLATORE"], t: 'V'},
                    pIdenDettagli: {v: $this.data("extern")["IDEN_DETTAGLIO"], t: 'V'},
                    pIdenTestate: {v: $this.data("extern")["IDEN_TESTATA"], t: 'V'},
                    pUsername: {v: $this.data("extern")["USERNAME"], t: 'V'},
                    pIp: {v: home.basePC.IP, t: 'V'},
                    pSito: {v: $this.data("extern")["SITO"], t: 'V'},
                    pIdenReferto: {v: $this.data("extern")["IDEN_REFERTO"], t: 'V'},
                    pIdenPer: {v: home.baseUser.IDEN_PER, t: 'V'},
                    pAllinea: {v: "N", t: 'V'}
                }
                var xhr = db.call_function(
                    {
                        datasource: 'POLARIS_DATI',
                        id:'GESTIONE_RIS_REFERTI.CHECK_CONSOLE',
                        parameter: dbParams
                    });
                xhr.done(function(response){
                    switch(response.p_result.split("$")[0]){
                        case "OK":{
                            home.NS_FENIX_TOP.apriPagina($(_elem).data("url"));
                            $(_elem).remove();
                            break;
                        }
                        case "FF":{
                            switch(response.p_result.split("$")[1]){
                                case "CHECK_IMPEGNATIVA" : case "CHECK_ANAGRAFICA":{
                                    home.NS_FENIX_TOP.apriPagina($(_elem).data("url"));
                                    $(_elem).remove();
                                    break;
                                }
                            }
                            break;
                        }
                        case "KO" : {
                            home.NOTIFICA.error({message:  "Si prega di caricare manualmente il paziente : " + $(_elem).attr("title") + "\r per ulteriori informazioni", title: "Referto Modificato!", timeout: 10});
                            break;
                        }
                    }
                });
                xhr.fail(function (jqXHR, textStatus, errorThrown) {
                    home.NOTIFICA.error({message: "Errore Durante la ricerca dell'oggetto", title: "Riferimento Non Trovato!", timeout: 10});
                });
        }
    }
}