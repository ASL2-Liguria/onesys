/**
 * User: matteopi
 * Date: 01/07/13
 * Time: 16.33
 */
var WindowCartella = null;
jQuery(document).ready(function () {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    NS_CERTIFICAZIONECREMAZIONE.init();
    NS_CERTIFICAZIONECREMAZIONE.event();
});

var NS_CERTIFICAZIONECREMAZIONE  = {
    init : function () {
        try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){/*se non e aperto dalla cartella*/}

        NS_CERTIFICAZIONECREMAZIONE.valorizzaInputInit();
        NS_CERTIFICAZIONECREMAZIONE.controlloOra('txtOre');
        //gestione css pagina
        var lenght = $('#lblIlSig').closest('tr').width()-10;
        $('#lblDichiara').width(
            lenght
        );

        $('input[name="radioElettrostimolatore"]').parent().width(85);

        $('#lblDichiarazione')
            .css({
                'padding-top':'5',
                'padding-bottom':'5'
            })
            .width(
                lenght
            )
            .parent()
                .width(
                    lenght
                );

  //////controlli sull'ora inserita
        $('txtOre');

    },
    event: function () {

    },
    valorizzaInputInit:function(){

        var nomePaziente, cognomePaziente, data_nascita, comune_nascita, comune_residenza;

        var rs = WindowCartella.executeQuery('DECESSO.xml','getDatiPaziente',[WindowCartella.getPaziente("IDEN")]);
        while(rs.next()){
            cognomePaziente = rs.getString('cogn');
            nomePaziente = rs.getString('NOME');
            comune_nascita = rs.getString('COMUNE_NASCITA');
            comune_residenza = rs.getString('COMUNE_RESIDENZA');
            data_nascita = rs.getString('DATA_NASCITA');
        }
        //alert(cognomePaziente +'\n'+nomePaziente +'\n'+ comune_nascita +'\n'+ comune_residenza +'\n'+ data_nascita);

        $('#txtSig')
            .val( nomePaziente + ' ' +  cognomePaziente)
            .attr('disabled',true);
        $('#txtNatoPaziente')
            .val(comune_nascita)
            .attr('disabled',true);
        $('#txtIlPaziente')
            .val(data_nascita)
            .attr('disabled',true);
        $('#txtResidenteIn')
            .val(comune_residenza)
            .attr('disabled',true);
        $('#txtDottore')
            .val(WindowCartella.baseUser.DESCRIPTION)
            .attr('disabled',true);

        $('#txtDeceduto').attr('disabled',true);

    },
    controlloOra:function(id){

        var selector = '#'+id;

        $(selector).keyup(function() {
            oraControl_onkeyup(document.getElementById(id));
        });
        $(selector).blur(function() {
            oraControl_onblur(document.getElementById(id));
        });
    }
}


