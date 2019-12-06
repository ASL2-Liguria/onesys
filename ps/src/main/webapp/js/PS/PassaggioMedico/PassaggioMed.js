/**
 * User: matteopi+carlog
 * Date: 10/12/13
 * Time: 14.32
 */
jQuery(document).ready(function () {
    NS_TRASFERIMENTO.init();
    NS_TRASFERIMENTO.event();
    NS_FENIX_SCHEDA.registra = NS_TRASFERIMENTO.registra;
    NS_FENIX_SCHEDA.beforeSave = NS_TRASFERIMENTO.beforeSave;
    NS_FENIX_SCHEDA.successSave = NS_TRASFERIMENTO.successSave;

});

var NS_TRASFERIMENTO = {

    idenProvSorgente : $("#hProvenienza").val(),
    idePerSorgente : $("#hUtenteSorgente").val(),

    init : function () {
        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";

        home.NS_CONSOLEJS.addLogger({name:'trasferimento',console:0});
        window.logger = home.NS_CONSOLEJS.loggers['trasferimento'];

        $("#cmbRepDestinazione").val(NS_TRASFERIMENTO.idenProvSorgente);
        $("#txtOraInizio").val(moment().format('HH:mm'));

        NS_TRASFERIMENTO.detectBaseUser();
        $('#acMedico').data('acList').changeBindValue({"iden_cdc": Number($("#IDEN_CDC").val())});

    },

    detectBaseUser: function () {
        var butSalva = $("button.butSalva");
        var TipoPersonale = home.baseUser.TIPO_PERSONALE;

        switch (TipoPersonale) {
            case 'A':
            case 'I':
            case 'OST':
                butSalva.hide();
                break;
            case 'M':
                var statoListaAttesa = $("#hStatoListaAttesa").val();
                var statoContatto = $("#hStatoContatto").val();

                if(statoContatto==="DISCHARGED" || (statoListaAttesa==="INSERITO" && statoListaAttesa==="COMPLETO" )){
                    butSalva.hide();
                }else{
                    butSalva.show();
                    $("#tabInserimento").on("click", function () {
                        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";
                    });
                }
                break;
            default:
                logger.error("NS_TRIAGE.detectBaseUser : baseuser is undefined or have a wrong value = " + TipoPersonale);
                break;
        }
    },

    event: function () {

    },

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value));
    },

    isAssistenziale : function(idenPerDestinatario){
        if(!NS_TRASFERIMENTO.hasAValue(idenPerDestinatario))
            return logger.error("idenPerDestinatario is undefined: " +idenPerDestinatario);
        if(!NS_TRASFERIMENTO.hasAValue(NS_TRASFERIMENTO.idePerSorgente))
            return logger.error("idePerSorgente is undefined: " + NS_TRASFERIMENTO.idePerSorgente);

        return (Number(idenPerDestinatario) !== Number(NS_TRASFERIMENTO.idePerSorgente));
    },

    isGiuridico : function(idenProvDestinatario){
        if(!NS_TRASFERIMENTO.hasAValue(idenProvDestinatario))
            return logger.error("idenPerDestinatario is undefined: " +idenProvDestinatario);
        if(!NS_TRASFERIMENTO.hasAValue(NS_TRASFERIMENTO.idenProvSorgente))
            return logger.error("idePerSorgente is undefined: " + NS_TRASFERIMENTO.idenProvSorgente);

        return (Number(idenProvDestinatario) !== Number(NS_TRASFERIMENTO.idenProvSorgente));
    },

    isGiuridicoAssistenziale : function(idenPerDestinatario, idenProvDestinatario){
        return (NS_TRASFERIMENTO.isAssistenziale(idenPerDestinatario) && NS_TRASFERIMENTO.isGiuridico(idenProvDestinatario))
    },

    isPresoInCarico : function(jsonGiuridici,jsonAssistenziali){
        return ((0 !== jsonGiuridici.length)||(0 !== jsonAssistenziali.length))
    },

    registra:function(){

        home.NS_LOADING.showLoading({"timeout":"0","testo" : "SALVATAGGIO", "loadingclick" : function(){home.NS_LOADING.hideLoading();}});

        var iden_contatto = $("#IDEN_CONTATTO").val();
        var params= {contattiGiuridici:1,contattiAssistenziali:1,assigningAuthorityArea:'ps'};
        var jsonContatto = NS_DATI_PAZIENTE.getDatiContattobyIden(iden_contatto,params);
        var idePerDestinatario = $("#h-txtMedico").val();
        var cmbRepDestinazione = $("#cmbRepDestinazione");
        var idenProvDestinatario = cmbRepDestinazione.val();
        var idenCdcDestinatario = cmbRepDestinazione.data("iden_cdc");
        var areaPs = cmbRepDestinazione.find("option:selected").data("iden_area");
        var data = $("#h-dateData").val();
        var ora = $("#txtOraInizio").val();
        var note = $("#txtNote").val();

        var contattoAssNew = {};
        var contattoGiuNew = {};

        $.extend(contattoAssNew,jsonContatto.contattiAssistenziali[jsonContatto.contattiAssistenziali.length -1]);
        $.extend(contattoGiuNew, jsonContatto.contattiGiuridici[jsonContatto.contattiGiuridici.length -1]);



        contattoGiuNew.provenienza = { id : idenProvDestinatario, idCentroDiCosto : idenCdcDestinatario, codice : null};
        contattoGiuNew.dataInizio = data+ora;//moment().format('YYYYMMDDhh:mm');
        contattoGiuNew.uteInserimento.id = NS_TRASFERIMENTO.idePerSorgente;
        contattoGiuNew.stato.id = null;
        contattoGiuNew.stato.codice = 'ADMITTED';
        contattoGiuNew.uteModifica.id = NS_TRASFERIMENTO.idePerSorgente;
        contattoGiuNew.note = note;
        contattoGiuNew.precedente = {"id":jsonContatto.contattiGiuridici[jsonContatto.contattiGiuridici.length -1].id};
        contattoGiuNew.id = null;

        jsonContatto.contattiAssistenziali[jsonContatto.contattiAssistenziali.length -1].dataFine = data+ora;
        contattoAssNew.provenienza = { id : idenProvDestinatario, idCentroDiCosto : idenCdcDestinatario, codice : null};
        contattoAssNew.dataInizio = data+ora;//moment().format('YYYYMMDDhh:mm');
        contattoAssNew.stato.id = null;
        contattoAssNew.stato.codice = 'ADMITTED';
        contattoAssNew.uteInserimento.id = NS_TRASFERIMENTO.idePerSorgente;
        contattoAssNew.uteModifica.id = NS_TRASFERIMENTO.idePerSorgente;
        contattoAssNew.note = note;
        contattoAssNew.precedente = {"id":jsonContatto.contattiAssistenziali[jsonContatto.contattiAssistenziali.length -1].id};
        contattoAssNew.mapMetadatiString['UTENTE_RESPONSABILE_MEDICO'] = idePerDestinatario;

        contattoAssNew.mapMetadatiString['AREAPS'] = areaPs;
        contattoAssNew.id = null;

        jsonContatto.contattiAssistenziali.push(contattoAssNew);
        jsonContatto.contattiGiuridici.push(contattoGiuNew);

        if((NS_TRASFERIMENTO.isPresoInCarico(jsonContatto.contattiGiuridici,jsonContatto.contattiAssistenziali))&&(NS_TRASFERIMENTO.isAssistenziale(idePerDestinatario))&&(!NS_TRASFERIMENTO.isGiuridico(idenProvDestinatario)))
        {
            logger.info("paziente gia preso in cairco; richiesto trasferimento assistenziale");
            CONTROLLER_PS.TransferPatientAssistenziale({
                jsonContatto : jsonContatto,
                callback : function(){
                    NS_TRASFERIMENTO.successSave();
                }});
        }
        else if((NS_TRASFERIMENTO.isPresoInCarico(jsonContatto.contattiGiuridici,jsonContatto.contattiAssistenziali))&&(NS_TRASFERIMENTO.isGiuridicoAssistenziale(idePerDestinatario,idenProvDestinatario))){
            logger.info("paziente gia preso in cairco; richiesto trasferimento giuridico e assistenziale");
            CONTROLLER_PS.TransferGiuridico({
                jsonContatto : jsonContatto,
                callback : function(){
                    NS_TRASFERIMENTO.successSave();
                }});
        }
        else if ((NS_TRASFERIMENTO.isPresoInCarico(jsonContatto.contattiGiuridici,jsonContatto.contattiAssistenziali))&&(!NS_TRASFERIMENTO.isAssistenziale(idePerDestinatario))&&(NS_TRASFERIMENTO.isGiuridico(idenProvDestinatario)))
        {
            logger.info("paziente gia preso in cairco; richiesto trasferimento giuridico e assistenziale");
            CONTROLLER_PS.TransferGiuridico({
                jsonContatto : jsonContatto,
                callback : function(){
                    NS_TRASFERIMENTO.successSave();
                }});
        }
        else
        {
            home.NOTIFICA.error({message:"Errore nella presa in carico", title: "Error"});
        }

    },

    successSave : function(){
        $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>TRASFERITO</h2>");
        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        //home.CARTELLA_INFO.initWkStoria(function(){home.NS_LOADING.hideLoading();});
        home.NS_LOADING.hideLoading();
    }
};