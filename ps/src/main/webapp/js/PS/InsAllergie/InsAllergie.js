/**
 * Created by matteo.pipitone on 08/04/2015.
 */

$(document).ready(function(){
    NS_ALLERGIE.init();
    NS_ALLERGIE.setEvents();

});

var NS_ALLERGIE =
{
    init:function(){
        NS_FENIX_SCHEDA.customizeParam = function(params){ params.extern=true; return params; };
        NS_FENIX_SCHEDA.addFieldsValidator({config: "V_ALLERGIE"});
        NS_FENIX_SCHEDA.successSave = NS_ALLERGIE.successSave;
    },
    setEvents:function(){

    },

    successSave :function () {
        home.ESAME_OBIETTIVO.importaAllergie();

        NS_FENIX_SCHEDA.chiudi();


    }
};