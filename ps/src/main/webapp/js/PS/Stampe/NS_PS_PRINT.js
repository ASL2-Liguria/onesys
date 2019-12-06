/**
 * Created by matteo.pipitone on 04/11/2015.
 */


var NS_PS_PRINT = {

    initStampa:function(params){

        NS_FENIX_PRINT.setEvents = NS_PS_PRINT.setEvents;
        NS_FENIX_PRINT.setEvents();
        logger.debug("NS_PS_PRINT Eventi settati");
        logger.debug("NS_PS_PRINT.initStampa");
        NS_PS_PRINT.initGenerics();
        $("#fldFunzioni").show();
        $("#fldFunzioniStampa").show();



        return true;
    },
    initGenerics : function (){
        logger.debug("NS_PS_PRINT.initGenerics");
        $("#fldFunzioniFirma").hide();
        $("#fldFunzioniStampa").hide();
        $("#fldFunzioniModuli").hide();
        $("#fldFunzioni").hide();
    },
    setEvents:function(){
        logger.debug("NS_PS_PRINT.setEvents");

        $("#butChiudi").off().on("click", function ()
        {
            NS_FENIX_PRINT.chiudi(NS_FENIX_PRINT.getPrintParam());
            //NS_FENIX_PRINT.chiudi(NS_FENIX_PRINT.getDefaultParams());
        });
        $("#butPagPrec").off().on("click", function ()
        {
            appletFenix.PageUp();
        });
        $("#butPagSucc").off().on("click", function ()
        {
            appletFenix.PageDown();
        });
        $("#butStampa").off().on("click", function ()
        {
            logger.debug("NS_PS_PRINT.butStampa.onclick");
            //var param= NS_FENIX_PRINT.getDefaultParams();
            var param= NS_FENIX_PRINT.getPrintParam();
            logger.debug("Button Stampa - Exists afterSTampa -> " + typeof param.afterStampa);
            logger.debug("STAMPA PARAMS ->" + JSON.stringify(param));

            logger.debug("PRINT PARAMS PRIMA DI STAMPA -> " + JSON.stringify(NS_FENIX_PRINT.printParam));
            //console.log(JSON.stringify(NS_FENIX_PRINT));
            //console.log(NS_FENIX_PRINT);
            NS_FENIX_PRINT.stampa(param);
            logger.debug("DOPO STAMPA ");

        });

    },

    apri:function(param){

        LIB.checkParameter(param,'beforeApri',NS_FENIX_PRINT.beforeApri);
        if(!param.beforeApri(param)){logger.warn("beforeApri return false");return false;}
        var stampa = $("#stampa");
        stampa.removeClass("invisible");
        stampa.addClass("visible");
        $("#AppStampa").css({height: (stampa.innerHeight() - $(".sfDark").outerHeight())});
        if (typeof home.NOAPPLET != "undefined" && home.NOAPPLET) {
            AppStampa._setVisible(true);
            var stampa_pos = $("#AppStampa").position();
            /*Tutto da vedere*/
            AppStampa._setBounds(stampa_pos.left, stampa_pos.top, $("#AppStampa").css("width"), $("#AppStampa").css("height"));

        }

    },
    /**
     *
     * @param param {beforeChiudi,afterChiudi}
     * @returns {boolean}
     */
    chiudi:function(param){
        LIB.checkParameter(param,'beforeChiudi',NS_FENIX_PRINT.beforeChiudi);
        LIB.checkParameter(param,'afterChiudi',NS_FENIX_PRINT.afterChiudi);
        if(!param.beforeChiudi(param)){logger.info("beforeChiudi return false");return false;}
        $("#stampa").removeClass("visible");
        $("#stampa").addClass("invisible");
        $("#txtPin").val("");$("#txtPassword").val("");
        param.afterChiudi(param);
        if (typeof home.NOAPPLET != "undefined" && home.NOAPPLET) {s
            AppStampa._setVisible(false);
        }
    },


    getDefaultParams : function(){

        var param = $.extend({},{},NS_FENIX_PRINT.config);

        logger.debug("NS_FENIX_PRINT.getDefaultParams param -> " + JSON.stringify(param));

        if(LIB.isValid(basePC.STAMPANTE_CONFIGURAZIONE)){
            param['CONFIG'] = baseGlobal.STAMPANTE_CONFIGURAZIONE;
        }

        NS_FENIX_PRINT.config = null;

        logger.debug("NS_FENIX_PRINT.config controllo di averlo svuotato -> " + JSON.stringify(NS_FENIX_PRINT.config) + "\n param dovrebbe essere rimasto a posto -> " + JSON.stringify(param));

        return param;

    }
};