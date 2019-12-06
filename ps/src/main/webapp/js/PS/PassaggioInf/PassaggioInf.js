/**
 * User: carlog
 * Date: 12/02/15
 */
jQuery(document).ready(function () {
    NS_PASSAGGIO_INF.init();
});

var NS_PASSAGGIO_INF = {

    idenProvSorgente : $("#hProvenienza").val(),
    idePerSorgente : $("#hUtenteSorgente").val(),

    init : function () {
        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";

        home.NS_CONSOLEJS.addLogger({name:'NS_PASSAGGIO_INF',console:0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_PASSAGGIO_INF'];

        $("#cmbRepDestinazione").val(NS_PASSAGGIO_INF.idenProvSorgente);
        $("#txtOraPassaggio").val(moment().format('HH:mm'));

        $('#acInfermiere').data('acList').changeBindValue({"iden_cdc": Number(home.baseUserLocation.iden)});

        NS_PASSAGGIO_INF.override();
        NS_PASSAGGIO_INF.detectBaseUser();
    },

    override : function(){
        NS_FENIX_SCHEDA.registra = NS_PASSAGGIO_INF.registra;
        NS_FENIX_SCHEDA.beforeSave = NS_PASSAGGIO_INF.beforeSave;
        NS_FENIX_SCHEDA.successSave = NS_PASSAGGIO_INF.successSave;
    },

    detectBaseUser: function () {
        var butSalva = $("button.butSalva");
        var TipoPersonale = home.baseUser.TIPO_PERSONALE;

        switch (TipoPersonale) {
            case 'A':
                butSalva.hide();
                break;
            case 'M':
            case 'I':
            case 'OST':
                var statoListaAttesa = $("#hStatoListaAttesa").val();
                var statoContatto = $("#hStatoContatto").val();

                if(statoContatto==="DISCHARGED" || statoListaAttesa==="CHIUSO"){
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



    hasAValue: function (value) {
        return (("" !== value) && ("null" !== value) && (null !== value) && ("undefined" !== value) && ("undefined" !== typeof value));
    },

    isAssistenziale : function(idenPerDestinatario){
        if(!NS_PASSAGGIO_INF.hasAValue(idenPerDestinatario))
            return logger.error("idenPerDestinatario is undefined: " +idenPerDestinatario);
        if(!NS_PASSAGGIO_INF.hasAValue(NS_PASSAGGIO_INF.idePerSorgente))
            return logger.error("idePerSorgente is undefined: " + NS_PASSAGGIO_INF.idePerSorgente);

        return (Number(idenPerDestinatario) !== Number(NS_PASSAGGIO_INF.idePerSorgente));
    },

    isGiuridico : function(idenProvDestinatario){
        if(!NS_PASSAGGIO_INF.hasAValue(idenProvDestinatario))
            return logger.error("idenPerDestinatario is undefined: " +idenProvDestinatario);
        if(!NS_PASSAGGIO_INF.hasAValue(NS_PASSAGGIO_INF.idenProvSorgente))
            return logger.error("idePerSorgente is undefined: " + NS_PASSAGGIO_INF.idenProvSorgente);

        return (Number(idenProvDestinatario) !== Number(NS_PASSAGGIO_INF.idenProvSorgente));
    },

    isGiuridicoAssistenziale : function(idenPerDestinatario, idenProvDestinatario){
        return (NS_PASSAGGIO_INF.isAssistenziale(idenPerDestinatario) && NS_PASSAGGIO_INF.isGiuridico(idenProvDestinatario))
    },

    isPresoInCarico : function(jsonGiuridici,jsonAssistenziali){
        return ((0 !== jsonGiuridici.length)||(0 !== jsonAssistenziali.length))
    },

    registra:function(){

        home.NS_LOADING.showLoading({"timeout":"0","testo" : "SALVATAGGIO", "loadingclick" : function(){home.NS_LOADING.hideLoading();}});

        var iden_contatto = $("#IDEN_CONTATTO").val();
        var params= {contattiGiuridici:1,contattiAssistenziali:1,assigningAuthorityArea:'ps'};
        var jsonContatto = NS_DATI_PAZIENTE.getDatiContattobyIden(iden_contatto,params);
        var idePerDestinatario = $("#h-txtInfermiere").val();
        var cmbRepDestinazione = $("#cmbRepDestinazione");
        var idenProvDestinatario = cmbRepDestinazione.val();
        var idenCdcDestinatario = cmbRepDestinazione.data("iden_cdc");
        var areaPs = cmbRepDestinazione.find("option:selected").data("iden_area");
        var data = $("#h-dataPassaggio").val();
        var ora = $("#txtOraPassaggio").val();
        var note = $("#txtNote").val();
        var contattoAssNew = {};
        var contattoGiuNew = {};

        $.extend(contattoAssNew,jsonContatto.contattiAssistenziali[jsonContatto.contattiAssistenziali.length -1]);
        $.extend(contattoGiuNew, jsonContatto.contattiGiuridici[jsonContatto.contattiGiuridici.length -1]);

        contattoGiuNew.id = null;
        contattoAssNew.id = null;

        contattoGiuNew.provenienza = { id : idenProvDestinatario, idCentroDiCosto : idenCdcDestinatario, codice : null};
        jsonContatto.contattiAssistenziali[jsonContatto.contattiAssistenziali.length -1].dataFine = data+ora;
        contattoGiuNew.dataInizio = data+ora;
        //contattoGiuNew.uteInserimento.id = NS_PASSAGGIO_INF.idePerSorgente;
        contattoGiuNew.stato.id = null;
        contattoGiuNew.stato.codice = 'ADMITTED';
        contattoGiuNew.uteModifica.id = NS_PASSAGGIO_INF.idePerSorgente;
        contattoGiuNew.note = note;
        contattoGiuNew.precedente = {"id":jsonContatto.contattiGiuridici[jsonContatto.contattiGiuridici.length -1].id};
        contattoGiuNew.id = null;

        contattoAssNew.provenienza = { id : idenProvDestinatario, idCentroDiCosto : idenCdcDestinatario, codice : null};
        contattoAssNew.dataInizio = data+ora;
        contattoAssNew.stato.id = null;
        contattoAssNew.stato.codice = 'ADMITTED';
        //contattoAssNew.uteInserimento.id = NS_PASSAGGIO_INF.idePerSorgente;
        contattoAssNew.uteModifica.id = NS_PASSAGGIO_INF.idePerSorgente;
        contattoAssNew.note = note;
        contattoAssNew.precedente = {"id":jsonContatto.contattiAssistenziali[jsonContatto.contattiAssistenziali.length -1].id};

        contattoAssNew.mapMetadatiString['UTENTE_RESPONSABILE_INFERMIERE'] = idePerDestinatario;
        contattoAssNew.mapMetadatiString['PRIMA_PRESA_IN_CARICO_MEDICA'] =  'N';

        contattoAssNew.mapMetadatiString['AREAPS'] = areaPs;
        contattoAssNew.id = null;

        jsonContatto.contattiAssistenziali.push(contattoAssNew);
        jsonContatto.contattiGiuridici.push(contattoGiuNew);

        CONTROLLER_PS.TransferPatientAssistenziale({
            jsonContatto : jsonContatto,
            callback : function(){
                NS_PASSAGGIO_INF.successSave();
            }});

    },

    successSave : function(){
        $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>TRASFERITO</h2>");
        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        //home.CARTELLA_INFO.initWkStoria(function(){home.NS_LOADING.hideLoading();});
        home.NS_LOADING.hideLoading();
    }
};