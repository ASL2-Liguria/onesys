/* global NS_INFO_PAZIENTE, NS_PANEL, NS_REFERTO, home, jsonData */

window.name = 'console';

$(document).ready(function() {
    home.CARTELLA = window;
    jsonData.H_STATO_PAGINA = $.parseJSON(jsonData.H_STATO_PAGINA);
    // NS_INFO_PAZIENTE.DATI_AMMINISTRATIVI.dataIngresso = jsonData.DATA_INGRESSO;  /*yyyymmddhh24mi*/
    /*json con i dati relativi al paziente*/
    NS_INFO_PAZIENTE.initJsonAnagrafica($("#IDEN_ANAG").val());
    NS_INFO_PAZIENTE.initJsonListaAttesa($("#IDEN_LISTA").val(), function(){});
    //NS_INFO_PAZIENTE.initJsonLocazione($("#IDEN_CONTATTO").val());
    NS_INFO_PAZIENTE.initJsonLocazione($("#IDEN_CONTATTO").val(), function(){
        NS_INFO_PAZIENTE.initJsonModuli(NS_INFO_PAZIENTE.getJsonLocazione.IDEN);
        NS_REFERTO.loadOnStartUp();
    });

    /*json con i dati relativi alla locazione dell'utente loggato : home.baseUserLocation */
    NS_PANEL.init();
    NS_PANEL.setEvents();
    NS_PANEL_TOP.setEvents();

    NS_INFO_ESAME.init();
    NS_FUNZIONI.init();
    NS_REFERTO.init();
    NS_INFO.init();

    NS_INFO_ESAME.setEvents();
    NS_REFERTO.setEvents();
    NS_FUNZIONI.setEvents();

    NS_PANEL.resize.content();
    NS_PANEL.resize.dx();
    NS_PANEL.resize.sx();
    NS_PANEL.resize.bottom();

    //NS_REFERTO.loadOnStartUp();
    NS_INFO_ESAME.showInfoEsame();

    home.NS_LOADING.hideLoading();

    home.PANEL.NS_DATI_CONTATTO_PS = NS_DATI_PAZIENTE;
    home.PANEL.NS_REFERTO = NS_REFERTO;
    home.PANEL.NS_FUNZIONI = NS_FUNZIONI;
    home.PANEL.NS_INFO_PAZIENTE = NS_INFO_PAZIENTE;

    NS_CARTELLA.init();
});



/***********************************************************************************************************************
 *                                        Namespace dell'iframe  in ALTO                                               *
 **********************************************************************************************************************/
var NS_PANEL_TOP = {
    init : function(){

    },
    setEvents : function(){
        $("#Paziente").find("span").on("click",function(e){
            NS_PANEL_TOP.showInfoPaziente(e);
        });
        $("#utenteRiferimento").find("span").on("click",function(e){
            NS_PANEL_TOP.showInfoUtenti(e);
        });
    },

    showInfoPaziente:function(e){
        var tablePaziente = $(document.createElement("table"));
        var tr1 = $(document.createElement("tr"));
        tr1.append($(document.createElement("td")).text("Eta' : ").addClass("textLeft"));
        tr1.append($(document.createElement("td")).text(NS_PANEL_TOP.calcolaEta()).addClass("textCenter"));
        tablePaziente.append(tr1);
        var tr2 = $(document.createElement("tr"));
        tr2.append($(document.createElement("td")).text("Sesso : ").addClass("textLeft"));
        tr2.append($(document.createElement("td")).text(jsonData.Sesso).addClass("textCenter"));
        tablePaziente.append(tr2);
        var tr3 = $(document.createElement("tr"));
        tr3.append($(document.createElement("td")).text("Esenzione : ").addClass("textLeft"));
        tr3.append($(document.createElement("td")).text(jsonData.ESENZIONE).addClass("textCenter"));
        tablePaziente.append(tr3);

        NS_PANEL_TOP.creatInfoDialog(e,"Info Paziente",tablePaziente,200);
    },

    showInfoUtenti : function(e){
        var tableUtenti = $(document.createElement("table"));

        var infermiereTriage = jsonData.infermiereTriage;
        var utenteRiferimento = jsonData.utenteRiferimento;
        var  infResponsabile = jsonData.infResponsabile;

        var wkApertura = $("#WK_APERTURA").val();

        var tr1 = $(document.createElement("tr"));
        tr1.append($(document.createElement("td")).text("Operatore Triage : ").addClass("textLeft"));
        tr1.append($(document.createElement("td")).text(infermiereTriage).addClass("textCenter"));
        tableUtenti.append(tr1);

        if(wkApertura=="LISTA_APERTI" || wkApertura=="LISTA_OBI" || wkApertura=="LISTA_CHIUSI"){
            var tr2 = $(document.createElement("tr"));
            tr2.append($(document.createElement("td")).text("Medico Responsabile : ").addClass("textLeft"));
            tr2.append($(document.createElement("td")).text(utenteRiferimento).addClass("textCenter"));
            tableUtenti.append(tr2);
            var tr3 = $(document.createElement("tr"));
            tr3.append($(document.createElement("td")).text("Infermiere Responsabile : ").addClass("textLeft"));
            tr3.append($(document.createElement("td")).text(infResponsabile).addClass("textCenter"));
            tableUtenti.append(tr3);
        }


        NS_PANEL_TOP.creatInfoDialog(e,"Info Operatori",tableUtenti,350);
    },

    calcolaEta: function(){
        var dataNascita = moment(($("#hDataNascita").val()), "YYYYMMDD");
        var dataAttuale = moment();
        var dataString ="";

        if(dataNascita=="" || dataNascita==null) logger.error("NS_PANEL_TOP.calcolaEta : dataNascita is undefinded");

        if (dataAttuale.diff(dataNascita, "months") >  36){
            var anni = dataAttuale.diff(dataNascita, "years");
            dataString = anni + " anni ";
        }else{
            var mesi = dataAttuale.diff(dataNascita, "months");
            var giorni = Math.round(dataAttuale.diff(dataNascita, "days") % 29.41);
            dataString = mesi + " mesi " + giorni +" giorni ";
        }

        return dataString;
    },

    creatInfoDialog : function(e,header,table,width){
        $.infoDialog({
            event: e,
            classPopup: "",
            headerContent: header,
            content:table,
            width: width,
            dataJSON: false,
            classText: "infoDialogTextMini"
        });
    }
};
/***********************************************************************************************************************
 *                               Namespace gestione stato paziente e semaforo                                          *
 **********************************************************************************************************************/
var NS_CARTELLA = {
    stato_paziente : null,
    privacy: jsonData.PRIVACY_EVENTO,
    tutore: null,

    init : function(){
        home.NS_CARTELLA = this;
        NS_CARTELLA.stato_paziente = $("#STATO_PAZIENTE").val();
        NS_CARTELLA.setSemaphore();
        NS_CARTELLA.setEvents();
        NS_CARTELLA.showUrgenza(jsonData.UrgenzaListaAttesa, jsonData.UrgenzaEsameObiettivo, jsonData.UrgenzaVerbale);
        var iden_anag = $("#IDEN_ANAG").val();
        //@todo qui vengono fatte 3 query, pensare ad un modo per unificare questi procedimenti.
        NS_PANEL.illuminaAvvertenze(iden_anag);
        NS_PANEL.illuminaMalattieRare(iden_anag);
        NS_PANEL.illuminaOrganismiMultiResistenti(iden_anag);

        if($("#STATO_PAGINA").val()==="R"){
            $("#cmbStatoPaziente").attr("disabled","disabled");
            if($("#AVVISO").val() === "CONSULENZE")
            {
                $("#avvisoStorico").text("CONSULTAZIONE").css({"font-size":"25px"});
            }
            else
            {
                $("#avvisoStorico").text("STORICO").css({"font-size":"25px"});
            }
        }
    },

    setEvents:function(){
        if($("#STATO_PAGINA").val() != 'R'){
            $("#cmbStatoPaziente").on("change",NS_CARTELLA.salvaStatoPaziente);

            $("#numeroPratica").find("span").on("click", function(e) {

                NS_CARTELLA.showInfoDialogRicovero(e, $(this).text())
            })

        }

    },

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value) && ("undefined"!==typeof value));
    },

    setSemaphore : function() {

        var statoAttivita = $("#statoAttivita").find("span");

        if(NS_CARTELLA.hasAValue(statoAttivita.text())){
            var steps = JSON.parse(statoAttivita.text());
            statoAttivita.text("").semaphore(steps);
        }
    },

    setSemaphoreOnSave: function(){

        var params = {
            iden_contatto : {t:"N", v: $('#IDEN_CONTATTO').val()}
        };

        var parametri = {
            "datasource": "PS",
            id: "CONTATTO.Q_STATO_ATTIVITA",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.SELECT(parametri);

        function callbackOk(data) {
            if(data.result[0].STATO_ATTIVITA){

                var statoAttivita = $("#statoAttivita").find("span");
                var steps = JSON.parse(data.result[0].STATO_ATTIVITA);
                statoAttivita.text("").semaphore(steps);
            }
        }



    },

    showUrgenza : function(urgenzaListaAttesa, urgenzaEsameObiettivo, urgenzaVerbale){

        var urgenzaAttuale ;
        var tHeader =  $("#tHeader");
        var codiceAttuale = $("#CodiceColoreAttuale");

        if(NS_CARTELLA.hasAValue(urgenzaVerbale)){
            urgenzaAttuale = urgenzaVerbale;
        }else{
            if(NS_CARTELLA.hasAValue(urgenzaEsameObiettivo)){
                urgenzaAttuale = urgenzaEsameObiettivo;
            }else{
                if(NS_CARTELLA.hasAValue(urgenzaListaAttesa)){
                    urgenzaAttuale = urgenzaListaAttesa;
                }else{
                    logger.warn("NS_CARTELLA.showUrgenza : Nessun valore di urgenza disponibile");
                }
            }
        }

        home.PANEL.urgenza = urgenzaAttuale;

        codiceAttuale.find("span").empty();
        codiceAttuale.find("span").html(urgenzaAttuale);
        tHeader.removeClass();
        tHeader.addClass(urgenzaAttuale);
    },

    salvaStatoPaziente:function(){
        NS_CARTELLA.stato_paziente = this.value;

       /* var json = NS_DATI_PAZIENTE.getDatiContattobyIden($("#IDEN_CONTATTO").val(), {contattiAssistenziali: 1, contattiGiuridici: 1, assigningAuthorityArea: 'ps'});
        json.mapMetadatiCodifiche["STATO_PAZIENTE"] = {id: this.value, codice: null};

        CONTROLLER_PS.UpdatePatientInformation({
            jsonContatto: json,
            callback: function () {
                if (NS_REFERTO.iStruct.attr("src").match(/KEY_LEGAME=CODICE_COLORE/g)) {
                    var iframe = document.getElementById('iContent').contentWindow;
                    iframe.$("#cmbStatoPaziente").val(NS_CARTELLA.stato_paziente);
                }
            }
        });*/

        var params = {
            "P_IDEN_CONTATTO" : {t:"N", v:$("#IDEN_CONTATTO").val()},
            "P_KEY_LIST" : {v:['STATO_PAZIENTE'],t:'A'},
            "P_VALUE_LIST" : {v:[NS_CARTELLA.stato_paziente],t:'A'},
            "P_TYPE_LIST" : {v:['C'],t:'A'}
        };

        var parametri = {
            "datasource": "PS",
            id: "ADT$ADT_CONTATTI.UPDATE_METADATI_CONTATTO",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.PROCEDURE(parametri);

        function callbackOk(data) {
            logger.info("update dei metadati stato paziente effettuato con " + JSON.stringify(data));
            if (NS_REFERTO.iStruct.attr("src").match(/KEY_LEGAME=CODICE_COLORE/g)) {
                var iframe = document.getElementById('iContent').contentWindow;
                iframe.$("#cmbStatoPaziente").val(NS_CARTELLA.stato_paziente);
            }
        }
    },

    showInfoDialogRicovero : function (e, codice) {

        var div = $(document.createElement("div")).attr({"class":"RadioBox"/*,"unselectable":"off", "style":"-webkit-user-select: none;"*/})
            .append(
            $(document.createElement("div"))
                .attr({"class":"RBpuls","id":"ANONIMO_SI"}).append($(document.createElement("i"))).append($(document.createElement("span")).text("SI"))

        ).append(
            $(document.createElement("div"))

                .attr({"class":"RBpuls","id":"ANONIMO_NO"}).append($(document.createElement("i"))
            ).append($(document.createElement("span")).text("NO")
            )

        );

        if(jsonData.TUTORE != NS_CARTELLA.tutore && NS_CARTELLA.tutore != null && NS_CARTELLA.tutore != ''){

            jsonData.TUTORE = NS_CARTELLA.tutore;
        }
        var divTutore = $(document.createElement("span")).attr({"class":"Tutore", "id":"txtTutore"}).text((jsonData.TUTORE).toUpperCase());

        var tablePaziente = $(document.createElement("table"));
        var tr1 = $(document.createElement("tr"))
            .append($(document.createElement("td")).text("Anonimato").css("padding","2"))

            .append($(document.createElement("td")).append(div));

        var tr2 = $(document.createElement("tr"))
            .append($(document.createElement("td")).text("Tutore").css("padding","2"))

            .append($(document.createElement("td")).append(divTutore));
        tablePaziente.append(tr1);

        if(jsonData.TUTORE !== null && jsonData.TUTORE !== '') {
            tablePaziente.append(tr2);
        }


        NS_PANEL_TOP.creatInfoDialog(e,"Info Ricovero",tablePaziente,300);

        var ANONIMO_SI = $("#ANONIMO_SI");
        var ANONIMO_NO = $("#ANONIMO_NO");

        ANONIMO_SI.on("click",function(){

            var param = {
                "datasource" : "ADT",
                "id" : "pck_privacy.registraAnonimatoEvento",
                "params" : {
                    pCodiceEvento : {t:'V', v: codice},
                    pCodiceUtente : {t:'V', v: home.baseUser.CODICE_DECODIFICA},
                    pDataOra      : {t:'T', v: moment().format("YYYYMMDD HH:mm:ss")}
                },
                "callbackOK" : function(){
                    ANONIMO_SI.addClass("RBpulsSel");
                    ANONIMO_NO.removeClass("RBpulsSel");
                    NS_CARTELLA.privacy = 'S';
                }
            };
            NS_CALL_DB.PROCEDURE(param);
        });

        ANONIMO_NO.on("click",function(){

            var param = {
                "datasource" : "ADT",
                "id" : "pck_privacy.rimuoviAnonimatoEvento",
                "params" : {
                    pCodiceEvento : {t:'V', v: codice},
                    pCodiceUtente : {t:'V', v: home.baseUser.CODICE_DECODIFICA},
                    pDataOra      : {t:'T', v: moment().format("YYYYMMDD HH:mm:ss")}
                },
                "callbackOK" : function(){
                    ANONIMO_NO.addClass("RBpulsSel");
                    ANONIMO_SI.removeClass("RBpulsSel");
                    NS_CARTELLA.privacy = 'N';
                }
            };
            NS_CALL_DB.PROCEDURE(param);
        });

        if(NS_CARTELLA.privacy == 'S'){
            ANONIMO_SI.addClass("RBpulsSel");
            ANONIMO_NO.removeClass("RBpulsSel");
        }else{
            ANONIMO_NO.addClass("RBpulsSel");
            ANONIMO_SI.removeClass("RBpulsSel");
        }
    }
};


/***********************************************************************************************************************
 *                  Namespace dell'iframe in BASSO (div#tBottom) usato per wk con i precedenti                         *
 **********************************************************************************************************************/
var NS_INFO = {

    init : function() {
        NS_INFO.iBottom = $("#iBottom");
        NS_INFO.iBottom.width(NS_PANEL.ref.body.width());
    },

    resize : function() {
        NS_PANEL.ref.bottom.width(NS_PANEL.ref.body.width());
        NS_INFO.iBottom.height(dim.hBottom);
        NS_INFO.load();
        //logger.debug("Resize iFrame bottom\nevent : "+event+"\nui : "+ui);
    },

    load : function() {
        var urlLoad = 'page?KEY_LEGAME=CARTELLA_INFO&IDEN_ANAG='+ $("#IDEN_ANAG").val() + '&IDEN_CONTATTO=' + $("#IDEN_CONTATTO").val() + '&STATO_PAGINA='+$("#STATO_PAGINA").val()+'&time='+ new Date().getTime();
        logger.info(urlLoad);
        NS_INFO.iBottom.attr("src", urlLoad);
    }
};