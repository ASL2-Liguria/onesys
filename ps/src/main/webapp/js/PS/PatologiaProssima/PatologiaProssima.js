/**
 * User: matteopi
 * Date: 09/01/14
 * Time: 11.37
 */

jQuery(document).ready(function () {

    NS_PATOLOGIA_PROSSIMA.init();
    NS_PATOLOGIA_PROSSIMA.event();

});

var NS_PATOLOGIA_PROSSIMA = {
    WkRivalutazioni:null,

    init : function () {
        //NS_ESAME_OBIETTIVO.initWkRivalutazioni();
        NS_FENIX_SCHEDA.customizeParam = function(params){ params.extern=true; return params; };
    },
    event : function () {
        $("#li-tabRivalutazioni").on("click", NS_PATOLOGIA_PROSSIMA.initWkRivalutazioni);

    },
    initWkRivalutazioni : function() {

            $("div#divWkRivalutazioni").height("200px");
            NS_PATOLOGIA_PROSSIMA.WkRivalutazioni = new WK({
                id : "PS_VERSIONI_PAT_PROSSIMA",
                container : "divWkRivalutazioni",
                aBind : ['IDEN_CONTATTO'],
                aVal : [document.getElementById("IDEN_CONTATTO").value]
            });
            NS_PATOLOGIA_PROSSIMA.WkRivalutazioni.loadWk();
        }

};


