/**
 * User: matteopi + alessandroa
 * Date: 18/11/13
 * Time: 17.07
 *
 * User: carlog
 * implementata la stampa e modificato il salvataggio
 * Date: 18/11/13
 */

/** home.CARTELLA.isDaMotivare indica se la rivalutazione ha il campo motivazione obbligatorio o meno, questo parametro serve alla funzione CHECKCOMPLETATRIAGE
 * per stabilire se deve effettuare  o meno il controllo sulla corretta valorizzazione del campo Motivo Rivalutazione. Questo parametro viene valorizzato al successSave
 * con S o N e all'init con ND, in questo modo se non viene salvata la scheda il controllo funzionera correttamente.**/

jQuery(document).ready(function () {
    NS_TRIAGE.init();
    NS_TRIAGE.setEvents();
});

var NS_TRIAGE = {

    console: null,
    iden_lista_attesa: null,
    validator:  NS_FENIX_SCHEDA.addFieldsValidator({config:"V_CODICE_COLORE"}),

    init: function () {

        home.CARTELLA.isDaMotivare = "ND";

        var tempo = parent.$("#TEMPO_PREVISTO").val();
        var colore = parent.$("#COLORE").val();

        home.NS_CONSOLEJS.addLogger({name: 'Triage', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['Triage'];

        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";

        NS_TRIAGE.detectIdenLista();
        NS_TRIAGE.detectStatoPagina(tempo,colore);
        NS_TRIAGE.detectBaseUser();
        NS_TRIAGE.colorControl();
        NS_TRIAGE.controlloPediatrico();

        NS_FENIX_SCHEDA.beforeSave = NS_TRIAGE.beforeSave;
        NS_FENIX_SCHEDA.successSave = NS_TRIAGE.successSave;
        NS_FENIX_SCHEDA.errorSave = NS_TRIAGE.errorSave;

        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true; return params;};

        var n = 0;
        var wnd = window;
        while (wnd.name != "console" && n < 5) {
            wnd = wnd.parent;
            n++;
        }
        if (n >= 5) {
            throw "Non è stato possibile recuperare il riferimento della pagina 'console'";
        }
        NS_TRIAGE.console = wnd;

        $("#taNote").autosize();
        $("#taNoteBraccialetto").autosize();


        if($("#MENU_APERTURA").val() !== "MANUTENZIONE_CARTELLA"){
            NS_TRIAGE.valorizeUbicazione();
        }

        home.CARTELLA.NS_INFO_ESAME.controlCompletaTriage("OFF");

    },

    setEvents: function () {
        $("#li-tabInserimento").on("click", function(){
            NS_TRIAGE.salvaShowHide("S",home.baseUser.TIPO_PERSONALE, $("#hStatoContatto").val());
        });

        $("#dati").on("click" , function(){
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";
        });

        $("#cmbAreaPS").on("change", function(){
            NS_TRIAGE.valorizeUbicazione();
        })
    },

    detectIdenLista : function(){
        var idenListaFromWK = $("#IDEN_LISTA").val();
        var idenListaFromQuery = $("#hIdenLista").val();

        if(NS_TRIAGE.hasAValue(idenListaFromWK)){
            NS_TRIAGE.iden_lista_attesa=idenListaFromWK;
        }else{
            NS_TRIAGE.iden_lista_attesa=idenListaFromQuery;
        }
    },
    /**
     * cambia il comportamento di alcuni campi a seconda dello stato del TRIAGE
     */
    detectStatoPagina: function (tempo,colore) {

        var menuApertura = $("#MENU_APERTURA").val();
        var stato_lista = $("#hStatoListaAttesa").val();
        var progressivo = $("#hProgressivo").val();
        var taNote = $("#taNote");

        /* Se siamo in Rivalutazione */
        if(stato_lista == "INSERITO"  && progressivo > 0)
        {
            $("#taNoteBraccialetto").closest("tr").hide();
            taNote.closest("tr").hide();
            NS_TRIAGE.validator.removeStatus(taNote);
            $("#taNoteRivalutazione").empty();
            $(".RBpuls").removeClass("RBpulsSel");
            $("#h-UrgenzaPs").val("");

            if(menuApertura === "RIVALUTA_TRIAGE" || menuApertura === "COMPLETA_RIVALUTAZIONE" ){
                $("#lblTitolo").text("Rivalutazione");
                NS_TRIAGE.checkRequiredMotivoRivalutazione(tempo,colore);

                //V_CODICE_COLORE.elements.taNoteRivalutazione.status = 'required';
                V_CODICE_COLORE.elements.taNote.status = null;
                V_CODICE_COLORE.elements.cmbStatoPaziente.status = null;

                NS_FENIX_SCHEDA.addFieldsValidator({config: "V_CODICE_COLORE"});
            }else if(menuApertura === "MANUTENZIONE_RIVALUTAZIONE"){
                $("#lblTitolo").text("Manutenzione Rivalutazione");
                NS_TRIAGE.checkRequiredMotivoRivalutazione(tempo,colore);

            }

        }

        else if((stato_lista == "INSERITO") && progressivo == 0 && menuApertura === "MANUTENZIONE_TRIAGE")
        {
            $("#lblTitolo").text("Manutenzione Triage");
            V_CODICE_COLORE.elements.cmbStatoPaziente.status = 'required';
            NS_FENIX_SCHEDA.addFieldsValidator({config: "V_CODICE_COLORE"});
            $("#taNoteRivalutazione").closest('tr').hide();
        }
        else if(menuApertura == "MANUTENZIONE_CARTELLA"){
            $("#lblTitolo").text("Manutenzione Profilo Sintetico Triage");

            $("#h-UrgenzaPs").val("");
            $("select").remove();
            $("#fldTemplate").remove();
            $("#UrgenzaPs").remove();
            $("textarea").not("#taNote").remove();
            $(".tdLbl").not("#lbltaNote").remove();
            $(".butSalva").show();
            NS_FENIX_SCHEDA.registra = NS_TRIAGE.salvaProfiloSintetico;

            NS_TRIAGE.getProfiloSintetico();

        }
        else
        {
            $("#lblTitolo").text("Triage");
            V_CODICE_COLORE.elements.cmbStatoPaziente.status = 'required';
            NS_FENIX_SCHEDA.addFieldsValidator({config: "V_CODICE_COLORE"});
            $("#taNoteRivalutazione").closest("tr").hide();
        }


    },

    detectBaseUser: function () {
        var butSalva = $("button.butSalva");
        var TipoPersonale = home.baseUser.TIPO_PERSONALE;
        var statoContatto = $("#hStatoContatto").val();

        switch (TipoPersonale) {
            case 'A':
                NS_TRIAGE.salvaShowHide("H",TipoPersonale,statoContatto);
                break;
            case 'I':
            case 'OST':
            case 'M':
                NS_TRIAGE.salvaShowHide("S",TipoPersonale,statoContatto);
                $("#tabInserimento").on("click", function () {
                    home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";
                });
                break;
            default:
                logger.error("NS_TRIAGE.detectBaseUser : baseuser is undefined or have a wrong value = " + TipoPersonale);
                break;
        }
    },

    isMaggiorenne : function(){
        return (moment(moment().format("YYYYMMDD"),"YYYYMMDD").diff(moment( $("#hDataNascita").val(),"YYYYMMDD"),'years') > 18);
    },

    controlloPediatrico : function(){
        if(NS_TRIAGE.isMaggiorenne()){
            var jsonIdenCDC =$.parseJSON(home.baseGlobal.PS_PEDIATRICO)[""+$("#hStruttura").val()+""];
            if(NS_TRIAGE.hasAValue(jsonIdenCDC)){
                $("#cmbAreaPS").find("option[data-iden_cdc="+ jsonIdenCDC.IDEN_CDC_PED +"]").remove();
            }
        }
    },

    colorControl : function(){
        var divUrgenza = $("#UrgenzaPs");
        var cdcAttuale = home.PANEL.NS_INFO_PAZIENTE.getJsonLocazione().COD_CDC;
        var coloriArea = $.parseJSON(home.baseGlobal.CONFIGURAZIONE_COLORI_OPZIONALI)[""+cdcAttuale+""];

        if(NS_TRIAGE.hasAValue(coloriArea)) {

            $.each(coloriArea, function (key, value) {
                if (value.ATTIVO == "S") {

                    switch (value.CONTROLLO) {
                        case"CONTROLLO_MAGGIORENNE":
                            if (NS_TRIAGE.isMaggiorenne()) {
                                divUrgenza.find("div." + value.COD_COLORE).hide();
                            }
                            break;
                        case"CONTROLLO_SESSO":
                            if ($("#hSesso").val() === "M") {
                                divUrgenza.find("div." + value.COD_COLORE).hide();
                            }
                            break;
                        default:
                            //CONTROLLO = NESSUNO
                            break;
                    }
                }
                if (value.ATTIVO == "N") {
                    divUrgenza.find("div." + value.COD_COLORE).hide();
                }
            });
        }
        else
        {
            logger.error("Nessuna configurazione opzionale per questo CDC : " + cdcAttuale);
        }

    },

    hasAValue: function (value) {
        return (("" !== value) && ("undefined" !== value) && (null !== value) && ("null" !== value) && ("undefined" !== typeof value));
    },

    /**
     * visualizza o nasconde il button salva a seconda del tipo utente, stato contatto
     * @param param
     * @param TipoPersonale
     * @param statoContatto
     */
    salvaShowHide : function(param,TipoPersonale,statoContatto){
        var butSalva = $("button.butSalva");

        if((param === "H") ){//(statoContatto === "DISCHARGED")){

            butSalva.hide();
        }
        if(param === "S" && (TipoPersonale === "M" || TipoPersonale === 'I' || TipoPersonale === 'OST') && statoContatto === "ADMITTED"){
            butSalva.show();
        }
    },
    /**
     * inserisce gli option nel select delle ubicazioni valorizzandole a seconda dell'area
     */
    valorizeUbicazione : function(){

        var id = $("#cmbAreaPS").find("option:selected").attr("data-iden_cdc");
        var db = $.NS_DB.getTool();
        var dbParams = {"iden_cdc": {v: id, t: "N"}};

        var xhr = db.select({
            datasource: "PS",
            id: "PS.Q_UBICAZIONE",
            parameter: dbParams
        });

        xhr.done(function (response) {
            var ubicazione = $("#cmbUbicazione");
            var hUbicazione = $("#hUbicazione").val();

            ubicazione.find("option").remove();
            ubicazione.val(hUbicazione);
            var option = document.createElement("option");
            document.getElementById('cmbUbicazione').appendChild(option);

            for (var i = 0; i < response.result.length ; i++)
            {
                var opt = document.createElement('option');
                opt.setAttribute('data-descr', response.result[i].DESCR);
                opt.setAttribute('data-value', response.result[i].VALUE);
                opt.setAttribute('data-codice_decodifica', response.result[i].CODICE_DECODIFICA);
                opt.value = response.result[i].VALUE;
                opt.setAttribute('id','cmbUbicazione_'+response.result[i].VALUE);
                var isFirefox = typeof InstallTrigger !== 'undefined';
                if(isFirefox){
                    opt.textContent = response.result[i].DESCR;
                }
                else{
                    opt.innerText = response.result[i].DESCR;
                }

                document.getElementById('cmbUbicazione').appendChild(opt);
            }

            ubicazione.find("option[value="+hUbicazione+"]").attr("selected","selected");

        });
    },
    /**
     * controllo prima del salvataggio
     * @returns {boolean}
     */


    replaceBefore: function(){
        var CampoNoteBraccialetto = $("#taNoteBraccialetto");
        var noteBraccialetto = CampoNoteBraccialetto.val().replace(/&/g,"&amp;").replace(/°/g,"&deg;");
        noteBraccialetto = NS_TRIAGE.replaceChar(noteBraccialetto);

        CampoNoteBraccialetto.val(noteBraccialetto);
    },

    replaceAfter: function(){
        var CampoNoteBraccialetto = $("#taNoteBraccialetto");
        var noteBraccialetto = CampoNoteBraccialetto.val().replace(/&amp;/g,"&").replace(/&deg;/g,"°");
        CampoNoteBraccialetto.val(noteBraccialetto);
    },

    beforeSave : function(){
        var statoListaAttesa = $("#hStatoListaAttesa").val();
        var statoContatto = $("#hStatoContatto").val();
        var taNote =  $("#taNote");
        var testo = taNote.val();
        var taNoteRivalutazione = $("#taNoteRivalutazione");
        var testoRivaluta = taNoteRivalutazione.val();

        taNote.val(NS_TRIAGE.replaceChar(testo));
        taNoteRivalutazione.val(NS_TRIAGE.replaceChar(testoRivaluta));

        if(statoContatto==="DISCHARGED" || statoListaAttesa==="CHIUSO"){
            $.dialog("Non e' possibile inserire in lista d'attesa ",{
                title: "Attenzione",
                buttons: [
                    {label: "OK", action: function () {
                        $.dialog.hide();
                        return false;
                    }}
                ]
            });
            return false;
        }else{

            NS_TRIAGE.replaceBefore();

           // if (NS_TRIAGE.stampato === "S"){ $("#hRivalutato").val("S"); }
            return true;
        }
    },
    replaceChar : function(testo){
        testo = testo.replace(new RegExp("\u00e0", "g"), 'a\'').replace(new RegExp("\u00f2", "g"), 'o\'')
                .replace(new RegExp("\u00e8", "g"), 'e\'').replace(new RegExp("\u00eC", "g"), 'i\'')
                .replace(new RegExp("\u00f9", "g"), 'u\'').replace(new RegExp("\u00d2", "g"), 'O\'')
                .replace(new RegExp("\u00c0", "g"), 'A\'').replace(new RegExp("\u00d9", "g"), 'U\'')
                .replace(new RegExp("\u00c8", "g"), 'E\'').replace(new RegExp("\u00cc", "g"), 'I\'')
                .replace(new RegExp("\u00e9", "g"), 'e\'').replace(new RegExp("\u00b0", "g"), '^');
        return testo;
    },
    /**
     * Quando il salvataggio va a buon fine, fa l'update dei metadati del contatto.
     * @param message
     * @param callback
     */
    successSave: function (message,callback) {

        if( $("#taNoteRivalutazione").hasClass("tdObb") ){
            home.CARTELLA.isDaMotivare = "S";
        }
        else{
            home.CARTELLA.isDaMotivare = "N";
        }

        NS_TRIAGE.replaceAfter();

        var cmbAreaPS = $("#cmbAreaPS");
        var ubicazione = $("#cmbUbicazione").find("option:selected").val();
        var areaPs = cmbAreaPS.find("option:selected").val();
        var urgenza = ($("#UrgenzaPs").find("div.RBpulsSel").attr("title"));
        var idenPer = home.baseUser.IDEN_PER;
        var idenProvDestinatario = cmbAreaPS.find("option:selected").data("iden_provenienza");
        var idenCdcDestinatario = cmbAreaPS.find("option:selected").data("iden_cdc");


        if (!NS_TRIAGE.hasAValue(ubicazione)) logger.error("NS_TRIAGE.successSave : ubicazione is undefined");
        if (!NS_TRIAGE.hasAValue(areaPs)) logger.error("NS_TRIAGE.successSave : areaPS is undefined");
        if (!NS_TRIAGE.hasAValue(urgenza)) logger.error("NS_TRIAGE.successSave : urgenza is undefined");

        var contatto = NS_DATI_PAZIENTE.getDatiContattobyIden($("#IDEN_CONTATTO").val(),{assigningAuthorityArea:'ps'});

        contatto.urgenza.id = $("#h-UrgenzaPs").val();
        contatto.mapMetadatiCodifiche["STATO_PAZIENTE"] = {id:  $("#cmbStatoPaziente").find("option:selected").val(), codice: null};
        contatto.mapMetadatiString['UBICAZIONE'] = ubicazione;

        contatto.contattiAssistenziali[contatto.contattiAssistenziali.length -1].mapMetadatiString['AREAPS'] = areaPs;

        var params = {"contatto" : contatto, "servlet" : "SetCodiceColore", "hl7Event" : "A08_SHORT","notifica" : {"show" : "N", "timeout" : 3 ,"message" : "Salvataggio Avvenuto Correttamente", "errorMessage" : "Errore Durante Modifica Ricovero"}, "cbkSuccess" : function () {
            $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>COMPLETATO</h2>");
            NS_TRIAGE.console.$('#cmbStatoPaziente').val($("#cmbStatoPaziente").find("option:selected").val());
            NS_TRIAGE.console.NS_CARTELLA.showUrgenza(urgenza,"","");
            home.CARTELLA.jsonData.H_STATO_PAGINA.CODICE_COLORE = 'E';
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
            $("#STATO_PAGINA").val("E");
            home.CARTELLA.NS_INFO_ESAME.comandSxPanel("3","SHOW");

            home.PANEL.NS_INFO_PAZIENTE.initJsonListaAttesa(NS_TRIAGE.iden_lista_attesa,function(){
                home.PANEL.NS_INFO_PAZIENTE.initJsonLocazione($("#IDEN_CONTATTO").val());
                home.CARTELLA.NS_INFO_ESAME.controlCompletaTriage("ON");
            });

        }, "scope" :'ps/'};


        NS_CONTATTO_METHODS.contatto = params.contatto;
        NS_CONTATTO_METHODS.executeAJAX(params);



    },
    errorSave : function(response){
        var message = response.message;

        if(message.indexOf("20101") !=-1){
            $.dialog("LA VALUTAZIONE E' GIA' STATA COMPLETATA. TORNARE IN LISTA ATTESA?", {
                title: "Attenzione",
                buttons: [
                    {label: "NO", action: function () {
                        $.dialog.hide();
                    }},
                    {label: "SI", action: function () {
                        $.dialog.hide();
                        home.PANEL.chiudi();
                    }}
                ]
            });
        }
    },

    checkRequiredMotivoRivalutazione : function(tempo, colore){

        var struttura = home.CARTELLA.NS_INFO_PAZIENTE.jsonLocazione.SUB_CODICE_SEZIONE;
        var tempoPrevisto  = home.baseGlobal["ps.triage.tempoRivalutazione."+colore+"." + struttura +""] ? home.baseGlobal["ps.triage.tempoRivalutazione."+colore+"." + struttura +""] : home.baseGlobal["ps.triage.tempoRivalutazione."+colore+""];

        if(tempo !== "undefined"){

            V_CODICE_COLORE.elements.taNote.status = null;
            V_CODICE_COLORE.elements.cmbStatoPaziente.status = null;
            NS_FENIX_SCHEDA.addFieldsValidator({config: "V_CODICE_COLORE"});

            if (tempoPrevisto === "" || Number(tempo) < Number(tempoPrevisto)){
                V_CODICE_COLORE.elements.taNoteRivalutazione.status = 'required';
            }
            else{
                V_CODICE_COLORE.elements.taNoteRivalutazione.status = null;
            }

        }
    },

    getProfiloSintetico : function(){
        var par = {
            datasource : 'PS',
            id : "PS.Q_GET_PROFILO_SINTETICO",
            params : {"idenContatto": {v: Number($("#IDEN_CONTATTO").val()), t: "N"}},
            callbackOK : function (response) {
                if (response) {
                    logger.info("Caricato profilo sintetico");
                    $("#taNote").val(response.result[0].NOTE);

                } else {
                    logger.error("Profilo sistetico non caricato");
                }
            }
        };
        NS_CALL_DB.SELECT(par);
    },

    salvaProfiloSintetico : function(){
        var par = {
            datasource : 'PS',
            id : "PS.Q_SALVA_PROFILO_SINTETICO",
            params : {"idenContatto": {v: Number($("#IDEN_CONTATTO").val()), t: "N"},
                      "note": {v: $("#taNote").val(), t: "V" }},
            callbackOK : function (response) {
                if (response) {
                    logger.info("Salvato profilo sintetico");
                    home.NOTIFICA.success({title:"Success", message: "Profilo sintetico salvato correttamente"})
                    //$("#taNote").val(response.result[0].NOTE);

                } else {
                    logger.error("Profilo sistetico non salvato");
                }
            }
        };
        NS_CALL_DB.BLOCK_ANONYMOUS(par);
    }

};