/**
 * User: matteopi+carlog
 * Date: 09/12/13
 * Time: 9.48
 */
jQuery(document).ready(function () {
    NS_ANAMNESI_INF.init();
    NS_ANAMNESI_INF.event();
});

var NS_ANAMNESI_INF = {

    dimensioneWk: null,

    init : function () {
        home.NS_CONSOLEJS.addLogger({name: 'NS_ANAMNESI_INF', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_ANAMNESI_INF'];

        NS_FENIX_SCHEDA.customizeParam = function(params){ params.extern=true; return params; };
        NS_FENIX_SCHEDA.successSave = NS_ANAMNESI_INF.successSave;

        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";

        var textarea =  $("#txtAllergie, #txtTerInCorso, #txtMalattie, #txtUltimoPasto, #txtInterventoSubito");

        if($("#READONLY").val()==="S")
        {
            $("button.butSalva").hide();
            textarea.attr("readonly","readonly");
            $("div.contentTabs").css({"background":"#CACACC"});
        }
        else
        {
            NS_ANAMNESI_INF.detectStatoPagina();
            NS_ANAMNESI_INF.detectBaseUser();
            NS_ANAMNESI_INF.gestisciAllergie();
        }

        //textarea.autosize();
    },

    event : function () {
        /*$("#li-tabDati").on("click", function(){
            NS_ANAMNESI_INF.salvaShowHide("S",home.baseUser.TIPO_PERSONALE);
        });
        $("#li-tabRivalutazioni").on("click", function(){
            NS_ANAMNESI_INF.salvaShowHide("H",home.baseUser.TIPO_PERSONALE);
            NS_ANAMNESI_INF.initWkRivalutazioni();
        });
        $("#li-tabPrecedenti").on("click", function(){
            NS_ANAMNESI_INF.salvaShowHide("H",home.baseUser.TIPO_PERSONALE);
            NS_ANAMNESI_INF.initWkPrecedenti();
        });*/
    },

    detectStatoPagina : function(){
        var statoPagina = $("#STATO_PAGINA").val();

        if(statoPagina === "E") {
            $("div.headerTabs").html("<h2 style='color: rgb(255, 255, 0);' id='lblAlertModifica'>MODIFICA</h2>");
        }else if(statoPagina === "I"){

        }else{
            logger.error("statoPagina non valorizzato correttamente : "+statoPagina);
        }
    },

    detectBaseUser : function () {
        var TipoPersonale = home.baseUser.TIPO_PERSONALE;
        var statoContatto = $("#hStatoContatto").val();
        var butSalva = $("button.butSalva");
        var utenteDimissione = $("#hUtenteDimissione").val();
        var diff_ora_chiusura = $("#hOreDiffChiusura").val();
        var jsonLista = home.PANEL.NS_INFO_PAZIENTE.getJsonListaAttesa();

        if(jsonLista!=="null" && typeof jsonLista!=="undefined" && jsonLista!=="undefined" && jsonLista!==null && jsonLista!=="" && jsonLista!==undefined){
            var statoLista = jsonLista.STATO_DESCR;
        }

        butSalva.hide();

        switch (TipoPersonale) {
            case 'A':
                butSalva.hide();
                break;
            case 'I':
                if(statoContatto=="ADMITTED")
                {
                    $("#rowAnamnesiInf").on("click" , function(){home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";});
                    butSalva.show();
                }
                break;
            case 'OST':
                if(statoContatto=="ADMITTED")
                {
                    $("#rowAnamnesiInf").on("click" , function(){home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";});
                    butSalva.show();
                }
                break;
            case 'M':
                if((statoContatto==="DISCHARGED") && (((home.baseUser.IDEN_PER==utenteDimissione) && (diff_ora_chiusura < home.baseGlobal["cartella.tempo_manutenzione.cartella_chiusa"])) || (home.basePermission.hasOwnProperty("SUPERUSER"))) )
                {
                    $("#rowAnamnesiInf").on("click" , function(){home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";});
                    butSalva.show();
                }
                else if(statoLista==="CHIUSO" && (statoContatto!=="DISCHARGED"))
                {
                    $("#txtAllergie, #txtTerInCorso, #txtMalattie, #txtUltimoPasto, #txtInterventoSubito").attr("readonly","readonly");
                }
                else
                {
                    $("#rowAnamnesiInf").on("click" , function(){home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";});
                    butSalva.show();
                }
                break;
            default:
                logger.error("TipoPersonale non valorizzato correttamente : " + TipoPersonale);
                break;
        }
    },

    /*salvaShowHide : function(param,TipoPersonale,statoContatto){


        if((param=="H") || (statoContatto=="DISCHARGED")){
            butSalva.hide();
        }
        if(param=="S" && TipoPersonale=="I" && statoContatto=="ADMITTED"){
            butSalva.show();
        }

        if(TipoPersonale=="M"){

        }
        if(param=="S" && TipoPersonale=="M" && (statoContatto==="DISCHARGED") && (((home.baseUser.IDEN_PER==utenteDimissione) && (diff_ora_chiusura<12)) || (home.basePermission.hasOwnProperty("SUPERUSER"))) )
        {
            butSalva.show();
        }

    },*/

    /*calcolaDimensioneWk : function(){
        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 65;
        NS_ANAMNESI_INF.dimensioneWk = contentTabs  - margine;
    },*/

    /*initWkRivalutazioni : function() {
        if (!NS_ANAMNESI_INF.WkRivalutazioni) {
            $("div#divWkRivalutazioni").height(NS_ANAMNESI_INF.dimensioneWk);
            NS_ANAMNESI_INF.WkRivalutazioni = new WK({
                id : "PS_VERSIONI_ANAMNESI",
                container : "divWkRivalutazioni",
                aBind : ['iden_contatto'],
                aVal : [$("#IDEN_CONTATTO").val()]
            });
            NS_ANAMNESI_INF.WkRivalutazioni.loadWk();
        }else{
            NS_ANAMNESI_INF.WkRivalutazioni.refresh();
        }
    },*/

    /*initWkPrecedenti: function(){
        if (!NS_ANAMNESI_INF.WkPrecedenti) {
            $("div#divWkPrecedenti").height(NS_ANAMNESI_INF.dimensioneWk);
            NS_ANAMNESI_INF.WkPrecedenti = new WK({
                id : "ANAMNESI_PRECEDENTI",
                container : "divWkPrecedenti",
                aBind : ['iden_contatto'],
                aVal : [$("#IDEN_CONTATTO").val()]
            });
            NS_ANAMNESI_INF.WkPrecedenti.loadWk();
        }else{
            NS_ANAMNESI_INF.WkPrecedenti.refresh();
        }
    },*/

    successSave : function(){
        home.CARTELLA.jsonData.H_STATO_PAGINA.ANAMNESI_INF = 'E';
        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>COMPLETATO</h2>");
    },

    gestisciAllergie : function (){
        var button;
        button = document.createElement("button");
        button.innerHTML = "Importa";
        if (!home.NS_FENIX_PS.isIE) {
            button.type = "button";
        }

        button.id = "ImportaAllergie";
        button.className = "btn";
        $(button).on("click", function() {
            var testo = $("#txtAllergie").val();
            var db = $.NS_DB.getTool({setup_default: {datasource: 'WHALE', async: false}});

            var params = {"idenAnag": {'v': Number(home.CARTELLA.$("#IDEN_ANAG").val()), 't': 'N'}};


            var xhr = db.select({
                id       : "CCE.Q_DATI_AVVERTENZE",
                parameter: params
            });

            xhr.done(function (data) {


                var result = data.result;
                logger.debug(JSON.stringify(data));
                logger.debug('result.ssize -> ' + result.length);
                if( result.length == 0) {
                    home.NOTIFICA.info({message: 'Nessuna allergia trovata', timeout : 3, title : "Info"});
                }else{
                    $.each(result, function (k, v) {

                        if(v.TIPO == 'ALLERGIA'){
                            testo += v.DESCRIZIONE + '\n';
                        }
                    });
                    $("#txtAllergie").text(testo).autosize();
                }

            });

        });

        var $div = $(document.createElement("div")).append(button);
        $("#lblAllergie").append($div);
    }
};


