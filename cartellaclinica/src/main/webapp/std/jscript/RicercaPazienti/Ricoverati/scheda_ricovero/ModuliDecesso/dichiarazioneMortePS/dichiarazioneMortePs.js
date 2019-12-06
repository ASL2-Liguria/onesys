/**
 * User: matteopi
 * Date: 04/07/13
 * Time: 15.31
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

    NS_CERT_MORTE.init();
    NS_CERT_MORTE.event();
});

var NS_CERT_MORTE = {
    init : function () {
        try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){/*se non e aperto dalla cartella*/}
        $('#frameCertNecro').attr('src','servletGenerator?KEY_LEGAME=CERT_NECROSCOPICO&KEY_ID=');

        $('#txtCausaNatu , #txtCausaViolenta').hide();
        $('#txtOre').parent().width(50);
        //gestione css
        var lenght = $('#lblDichMorte').closest('tr').width()-10;
        $('#lblDichMorte').width(lenght).css({'text-align':'center','padding-top':'5px', 'padding-bottom':'5px'});
        $('#lblSottoScritto').width(300).parent().width(299);
        $('#lblDichiara, #lblgiunto,#lblDecesso').width(300);

        $('input[name="radioCausa"]').parent().click(function(){
            var checked = $(this).find('input').is(':checked');
            if(checked){
                var val = $(this).find('label').text();
                NS_CERT_MORTE.checkRadioSelected(val);
            };
        });
//        $('#frameCertNecro').width(lenght);
//        $('input[name="radioCausa"]').change(function(){
//            var val =  $(this).parent().find('label').text();
//            NS_CERT_MORTE.checkRadioSelected(val);
//        })
    },
    event: function () {

    },
    controlloOra:function(id){

        var selector = '#'+id;

        $(selector).keyup(function() {
            oraControl_onkeyup(document.getElementById(id));
        });
        $(selector).blur(function() {
            oraControl_onblur(document.getElementById(id));
        });
    },
    checkRadioSelected:function(val){
        if (val=='Causa naturale'){
            NS_CERT_MORTE.hideAndShow(
                $('#txtCausaViolenta'),
                $('#txtCausaNatu')
            );
        }else if(val == 'Causa violenta'){
            NS_CERT_MORTE.hideAndShow(
                $('#txtCausaNatu'),
                $('#txtCausaViolenta')
            );
        }else{
            $('#txtCausaNatu , #txtCausaViolenta').hide()
        }
    },
    hideAndShow:function(toHide,toShow){
       toHide.hide();
       toShow.show();
    }

}


