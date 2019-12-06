/**
 * User: matteopi, alessandroa
 * Date: 23/09/13
 * Time: 14.41
 * 
 * 20140221 - Modifica Inserimento Ricovero da Prericovero.
 * 20140401 - Modifica Gestione Metadati Codificati e NON.
 */

var _JSON_CONTATTO = null;
var _JSON_CONTATTO_PRERICOVERO = null;
var _JSON_PRERICOVERO_BAD = null;

jQuery(document).ready(function () {

    NS_ASS_PRERICOVERO_RICOVERO.init();
    NS_ASS_PRERICOVERO_RICOVERO.event();

});

var NS_ASS_PRERICOVERO_RICOVERO = {
    
	iden_dimi : null,
    adt_lista_prericovero : null,

    init : function () {

    	_JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById($('#IDEN_CONTATTO').val());
        $('#divWkAss').css({height : $(".contentTabs").innerHeight() - 65},{width:'500px'});
        NS_ASS_PRERICOVERO_RICOVERO.caricaWkPrericovero();
    },
    event: function () {

    },
    caricaWkPrericovero:function(){

        var param = {
            id:"ADT_WK_PRERICOVERI",
            container:"divWkAss",
            aBind:["iden_anagrafica"],
            aVal:[$("#IDEN_ANAG").val().toString()]
        }


        NS_ASS_PRERICOVERO_RICOVERO.adt_lista_prericovero =  new WK(param);
        NS_ASS_PRERICOVERO_RICOVERO.adt_lista_prericovero.loadWk();

    },

    associaPreRic : function(idenPrericovero){

        _JSON_CONTATTO_PRERICOVERO = NS_CONTATTO_METHODS.getContattoById(idenPrericovero);
        _JSON_PRERICOVERO_BAD = NS_CONTATTO_METHODS.getContattoById(_JSON_CONTATTO.parent.id);

        _JSON_CONTATTO.parent = _JSON_CONTATTO_PRERICOVERO;

        _JSON_CONTATTO_PRERICOVERO.uteDimissione.id = home.baseUser.IDEN_PER;
        _JSON_CONTATTO_PRERICOVERO.dataFine = _JSON_CONTATTO.dataInizio;
        _JSON_CONTATTO_PRERICOVERO.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'] = {id : null ,codice : '9P'};;
        _JSON_CONTATTO_PRERICOVERO.contattiGiuridici[_JSON_CONTATTO_PRERICOVERO.contattiGiuridici.length-1].uteModifica.id = home.baseUser.IDEN_PER;
        _JSON_CONTATTO_PRERICOVERO.contattiAssistenziali[_JSON_CONTATTO_PRERICOVERO.contattiAssistenziali.length-1].uteModifica.id = home.baseUser.IDEN_PER;

        // Valorizzazione Parent Ricovero
        var pA08 = {"contatto" : _JSON_CONTATTO, "hl7Event" : "A08", "notifica" : {"show" : "N", "timeout" : 3 ,"message" : "Associazione Pre-ricovero a Ricovero Avvenuta con Successo", "errorMessage" : "Errore Durante Associazione Pre-ricovero a Ricovero"}, "cbkSuccess" : function(){}};

        // Chiusura Pre-Ricovero
        var pA03 = {"contatto" : _JSON_CONTATTO_PRERICOVERO, "hl7Event" : "A03", "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Associazione Pre-ricovero a Ricovero Avvenuta con Successo", "errorMessage" : "Errore Durante Chiusura Pre-Ricovero"}, "cbkSuccess" : function(){}};

        // Riapertura Pre-ricovero disassociato al ricovero
        var pA13 = {"contatto" : _JSON_PRERICOVERO_BAD, "hl7Event" : "A13", "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Riapertura Pre-ricovero Avvenuta con Successo", "errorMessage" : "Errore Durante Riapertura Pre-Ricovero"}, "cbkSuccess" : function(){NS_ASS_PRERICOVERO_RICOVERO.adt_lista_prericovero.refresh();}};

        pA08.cbkSuccess = function(){
            NS_CONTATTO_METHODS.cancelDischarge(pA13);
        };

        pA03.cbkSuccess = function(){
            NS_CONTATTO_METHODS.updatePatientInformation(pA08);
        };

        NS_CONTATTO_METHODS.dischargeVisit(pA03);
    }
};