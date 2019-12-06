/**
 * User: matteopi
 * Date: 28/01/13
 * Time: 11.31
 */


var WindowCartella = null;

$(document).ready(function() {
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    NS_MESSAGGIO.init();
    NS_MESSAGGIO.events();
});

var NS_MESSAGGIO = {

    init:function(){
        $('#txtMotivoCanc').focus();
        $('#lblTitle').text($('#lblTitolo').val());
        $('#lblAnnulla').closest("td").hide();
    },
    events:function(){
        $('#lblRegistra').click(NS_MESSAGGIO.registraMotivo);
    },
    registraMotivo:function(){

        //prende il testo
        var vTesto = $('#txtMotivoCanc').val();
        var vIdenPer = WindowCartella.baseUser.IDEN_PER;
        var vTitle = $('#lblTitolo').val();

        //esegue lo statement per la registrazione
        parent.FancyboxParameters.functionregistra({
            testo: vTesto,
            idenper: vIdenPer,
            title: vTitle
        });

    }
};
