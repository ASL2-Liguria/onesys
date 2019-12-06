/**
 * Created by matteo.pipitone on 23/09/2015.
 */

$(document).ready(function(){
    GESTIONE_PC.init();
    GESTIONE_PC.setEvents();
});

var GESTIONE_PC = {

    WK_PC : null,

    init:function() {
        GESTIONE_PC.caricaWkPc();
    },
    setEvents : function () {

    },
    caricaWkPc : function () {
        var NomePC = $("#txtCampoPC").val();

        GESTIONE_PC.WK_PC = new WK({
            id: "WK_PC",
            container: "divWk",
            loadData : true,
            aBind: ["PC"],
            aVal: [NomePC]
        });
        GESTIONE_PC.WK_PC.loadWk();
    }

};