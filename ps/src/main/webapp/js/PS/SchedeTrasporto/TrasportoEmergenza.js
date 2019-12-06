/**
 * Created by alberto.mina on 15/04/2015.
 */

$(document).ready(function(){
    TRASPORTO_EMERGENZA.init();
    TRASPORTO_EMERGENZA.setEvents();

});


var TRASPORTO_EMERGENZA = {

    init: function(){
        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true;return params;};
        TRASPORTO_EMERGENZA.nascondiDataOra();
        $('#txtFarmaciNotizie').width('500');

    },

    setEvents: function(){





    }



};