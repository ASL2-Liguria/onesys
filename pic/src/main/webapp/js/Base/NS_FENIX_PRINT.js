/*Gestione di Anteprima e Stampa*/
var NS_FENIX_PRINT =
{
    /**
     * oggetto contenente i parametri passati alla funzione caricaDocumento per il processo di "stampa" in corso
     */
    printParam:null,
    init:function(){},
    getDefaultParams: function() { return {} },
    stampaNoApplet:function(url){window.open(url);},
    getPrintParam:function(){
      return $.extend({},NS_FENIX_PRINT.getDefaultParams(),NS_FENIX_PRINT.printParam);
    },
    initStampa:function(params){
        $("#fldFunzioniFirma").hide();
        $("#fldFunzioniFirmaRemota").hide();
        $("#fldFunzioniSISS").hide();
        $("#fldFunzioniValida").hide();
        $("#fldFunzioniStampa").show();
        $("#fldFunzioniRitornaWk").hide();
        $("#fldFunzioniFirmaGrafometrica").hide();
        return true;
    },
    /*funzione richamata dall'Applet alla fine del caricamento dell'anteprima del documento  riceve la url del documento*/
    /**@deprecated*/
    documentChangeHandler:function(url){},
    /*WARN! La ridefinizione diretta di questi metodi comporta la modifica permanente per tutta la durata della sessione*/
    beforeApri:function(){return true;},
    beforeStampa:function(param){return true;},
    afterStampa:function(param,res){},
    beforeChiudi:function(param){return true;},
    afterChiudi:function(param){},
    setEvents:function(){
        $("#butChiudi").on("click", function ()
        {
            NS_FENIX_PRINT.chiudi(NS_FENIX_PRINT.getPrintParam());
        });
        $("#butIngrandisci").on("click", function ()
        {
           appletFenix.ZoomIn();
        });
        $("#butDiminuisci").on("click", function ()
        {
            appletFenix.ZoomOut();
        });
        $("#butPagPrec").on("click", function ()
        {
            appletFenix.PageUp();
        });
        $("#butPagSucc").on("click", function ()
        {
            appletFenix.PageDown();
        });
        $("#butPagPrima").on("click", function ()
        {
            appletFenix.setPagina(1);
        });
        $("#butPagUltima").on("click", function ()
        {
            appletFenix.UltimaPagina();
        });
        $("#butRuotaOrario").on("click", function ()
        {
            appletFenix.RuotaOrario();
        });
        $("#butRuotaAnti").on("click", function ()
        {
            appletFenix.RuotaAntiOrario();
        });
        $("#butStampa").on("click", function ()
        {
            var param= NS_FENIX_PRINT.getPrintParam();
            NS_FENIX_PRINT.stampa(param);
        });
        $("#butStampaSu").on("click", function ()
        {
            var param = NS_FENIX_PRINT.getPrintParam();
            param['STAMPA_SU']   = true;
            //param['CONFIG']      = '{methods:[{showNativePrintDialog: []}]}';  /*problema a estendere il json: perde i valori float :( */
            NS_FENIX_PRINT.stampa(param);
        });
        $("#butSalvaSuFile").on("click",function(){
            var resp = appletFenix.salvaSuFile('documento.pdf');

            switch(resp.status){
                case "OK":
                    home.NOTIFICA.success({title:"Salvato!",message:"File salvato in "+resp.message,timeout:4,width:300});
                    logger.info("SalvaSuFile - file creato:"+resp.message);
                    break;
                case "KO":
                    home.NOTIFICA.error({title:traduzione.errorTitleSave,message:traduzione.errorSave,timeout:4,width:300});
                    logger.error("SalvaSuFile - "+resp.message);
                    break;
                default:
                    logger.info("SalvaSuFile - "+resp.message);
                    break;
            }
        });

        $("#butEstraiTesto").on("click", function ()  {
        	var plainText = appletFenix.estraiTesto();
        	$("#stampa").removeClass("visible").addClass("invisible");
        	$.dialog($("<textarea>").val(plainText).css({"width":"100%","height":"100%"}), {
            	title : "Testo del Documento"
            	, position : {x : 15, y : 15}
            	, height : $("#content").height() - 60
            	, width : $("#content").width() - 30
            	, buttons : [{
            		label: "Chiudi", action: function (ctx) {
            			$("#stampa").removeClass("invisible").addClass("visible");
            			$.dialog.hide();
                    }
                }
            	]
            });
        });


    },
    setInfoDocumento:function(resp){
        $("#numPagine").html(traduzione.lblNumPagine + " : " + appletFenix.getNPagine());
    },
    /**
     *
     * @param param {URL,PRINT_DIRECTORY,PRINT_REPORT,PRINT_INIT,PRINT_SF,PRINT_PROMPT}
     * @returns {*}
     */
    generaUrlStampa: function (param)
    {
        if (LIB.isValid(param.URL))
        {
            logger.debug("generaUrlStampa:" + param.URL);
            return param.URL;
        }
        else
        {
            var ulrToRet;
            urlToRet = baseGlobal.PRINT_URL
            urlToRet += "report=" + baseGlobal.PRINT_REPOSITORY_REPORT + "/" ;
            (LIB.isValid(param.PRINT_DIRECTORY)) ? urlToRet +=  param.PRINT_DIRECTORY + "/": urlToRet +=  basePC.PRINT_DIRECTORY_REPORT+ "/";
            urlToRet += param.PRINT_REPORT + ".RPT";
            (LIB.isValid(param.PRINT_INIT)) ? urlToRet += "&init=" + param.PRINT_INIT : urlToRet += "&init=pdf";
            (LIB.isValid(param.PRINT_SF))? urlToRet += "&sf=" + param.PRINT_SF:"";
            (LIB.isValid(param.PRINT_PROMPT))? urlToRet += param.PRINT_PROMPT:""; /*es. &promptPbind=valore*/
            urlToRet += "&ts=" + moment().unix();
            logger.debug("generaUrlStampa:" + urlToRet);
            return  urlToRet;
        }
    },
    caricaDocumento:function(param){
        var $this = this;
        $this.printParam = param;/*setto i parametri per la stampa corrente*/
        LIB.checkParameter(param,'okCaricaDocumento',NS_FENIX_PRINT.okCaricaDocumento);
        LIB.checkParameter(param,'koCaricaDocumento',NS_FENIX_PRINT.koCaricaDocumento);
        if (NS_FENIX_TOP.HAS_APPLET) {
            var resp = appletFenix.setSrcUrl(NS_FENIX_PRINT.generaUrlStampa(param));
            if (resp.status == "OK") {
                logger.info("okCaricaDocumento: " + resp.message);
                $this.setInfoDocumento(resp);
                param.okCaricaDocumento(param, resp);
            } else {
                logger.error("koCaricaDocumento: " + resp.message);
                param.koCaricaDocumento(resp);
            }
        }else{
            $this.stampaNoApplet(NS_FENIX_PRINT.generaUrlStampa(param));
        }
    },
    okCaricaDocumento:function(param,resp){},
    koCaricaDocumento:function(resp){
        NOTIFICA.error({
            message: traduzione.errorLoadDocument,
            title: traduzione.errorTitleSave,
            timeout: 5
        });
        logger.error("Errore caricamento documento: "+JSON.stringify(resp));
    },
    /**
     *
     * @param param  {N_COPIE,STAMPA_SU,STAMPANTE,CONFIG,beforeStampa,afterStampa}
     */
    stampa: function (param)
    {
        LIB.checkParameter(param,'beforeStampa',NS_FENIX_PRINT.beforeStampa);
        LIB.checkParameter(param,'afterStampa',NS_FENIX_PRINT.afterStampa);
        if(!param.beforeStampa(param)){logger.warn("beforeStampa return false");return false;}
        LIB.checkParameter(param,'NATIVO',false);
        (LIB.isValid(param.N_COPIE)) ? appletFenix.setNCopie(param.N_COPIE) : appletFenix.setNCopie(1);
        if (!param.CONFIG) {
            param['CONFIG'] = '{"methods": [{"setPageSize":[2]} ]}';
            /*TODO: adattare getDefaultConfig*/
        }
        if (LIB.isValid(param.STAMPA_SU) && LIB.ToF(param.STAMPA_SU)) {
            appletFenix.printOn(param.CONFIG, param.NATIVO);
            /*{CONFIG: '{methods:[{showNativePrintDialog: []}]}'}*/
        } else {
            param.STAMPANTE = (LIB.isValid(param.STAMPANTE)) ? param.STAMPANTE : null;
            logger.debug("stampa su: " + param.STAMPANTE);
            var res = appletFenix.print(param.STAMPANTE, param.CONFIG);
        }
        param.afterStampa(param, res);
        return res;

    },
    apri:function(param){
        LIB.checkParameter(param,'beforeApri',NS_FENIX_PRINT.beforeApri);
        if(!param.beforeApri(param)){logger.warn("beforeApri return false");return false;}
        var stampa = $("#stampa");
        stampa.removeClass("invisible");
        stampa.addClass("visible");
        $("#AppStampa").css({height: (stampa.innerHeight() - $(".sfDark").outerHeight())});
		if (home.NOAPPLET) {
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
		if (home.NOAPPLET) {
			AppStampa._setVisible(false);
		}
    }


}