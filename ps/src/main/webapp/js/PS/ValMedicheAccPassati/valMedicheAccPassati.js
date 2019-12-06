
/**
 * Created by matteo.pipitone on 11/03/2015.
 */
$(document).ready(function(){
    NS_RIVALUTAZIONI_MEDICHE_PASSATE.init();
    NS_RIVALUTAZIONI_MEDICHE_PASSATE.setEvents();
});

var NS_RIVALUTAZIONI_MEDICHE_PASSATE = {

    dimensioniWk : null,

    init:function(){

        $('#lblTitolo').text('Rivalutazioni Mediche Passate');
        if(LIB.isValid(home) && LIB.isValid(home.PANEL) &&  LIB.isValid(home.PANEL.NS_REFERTO)&&  LIB.isValid(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        }
        if($("#READONLY").val() === "S"){$("div.contentTabs").css({"background":"#CACACC"})}
        NS_RIVALUTAZIONI_MEDICHE_PASSATE.calcolaDimensioneWk(function(){
            NS_RIVALUTAZIONI_MEDICHE_PASSATE.initWkRivalutazioni();
        });

    },
    setEvents : function () {

    },
    calcolaDimensioneWk : function (callback) {

        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 65;
        NS_RIVALUTAZIONI_MEDICHE_PASSATE.dimensioniWk = parseInt(contentTabs - margine);

        callback();
    },



    initWkRivalutazioni : function () {

        $("div#divWkRivalutazioniMedichePassate").height(NS_RIVALUTAZIONI_MEDICHE_PASSATE.dimensioniWk);
        NS_RIVALUTAZIONI_MEDICHE_PASSATE.WkRivalutazioni = new WK({
            id: "ANAM_ESA_OBIETTIVO_PRECEDENTI",
            container: "divWkRivalutazioniMedichePassate",
            aBind: ['iden_contatto'],
            aVal: [$("#IDEN_CONTATTO").val()]
        });
        NS_RIVALUTAZIONI_MEDICHE_PASSATE.WkRivalutazioni.loadWk();

    },
    setColorStorico: function(data, elemento, td){

        var contatto = $('#IDEN_CONTATTO').val();

        if(data.IDEN_CONTATTO == contatto){

            elemento.find('td').each(function(){

                $(this).css('background','#58ACFA');
            });
            td.css('background','#58ACFA');

        }
        if(data.ESAME_OBIETTIVO !== null){
            td.text(data.ESAME_OBIETTIVO);
        }

    }
};