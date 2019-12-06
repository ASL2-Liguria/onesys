/**
 * Created by matteo.pipitone on 06/11/2015.
 */

$(document).ready(function(){
    NS_ORGANISMI_MULTIRESISTENTI.init();
    NS_ORGANISMI_MULTIRESISTENTI.setEvents();
    NS_FENIX_SCHEDA.registra = NS_ORGANISMI_MULTIRESISTENTI.registra;
});

var NS_ORGANISMI_MULTIRESISTENTI= {
    init : function () {
        NS_FENIX_SCHEDA.addFieldsValidator({config: "V_ORGANISMI_MULTIRESISTENTI"});
    },
    setEvents : function () {

    },
    registra : function(){
        if(!NS_FENIX_SCHEDA.validateFields()){
            return false;
        }
         var idenAnag = $("#IDEN_ANAG");
         var par = {
            datasource : 'WHALE',
            id : 'CCE.INS_ORGANISMI_MULTIRESISTENTI',
            params : {
                IDEN_ANAG : {t:'N', v:idenAnag.val()},
                DATE_POS : $("#txtDataPositivita").val(),
                GERME : $("#cmbOrganismi").find("option:selected").val(),
                UTE_INS : home.baseUser.IDEN_PER
            },
            callbackOK : functionOk

        };

        function functionOk (resp){
            home.NOTIFICA.success({title : 'Success', message:"Salvataggio eseguito correttamente",timeout: 3});
            NS_FENIX_SCHEDA.chiudi();
        }
        NS_CALL_DB.BLOCK_ANONYMOUS(par)
    }
};