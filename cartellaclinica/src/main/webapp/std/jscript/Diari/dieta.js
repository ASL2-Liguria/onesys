
var WindowCartella = null;
$(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    $('textarea[name=txtDieta]').focus();
    if($('form[name="EXTERN"] input[name="VISUALIZZA_WK"]').val()=="N"){
        NS_SCHEDA_DIETA.hide_wk_dieta();
    }else{
        NS_SCHEDA_DIETA.load_wk_dieta();
    }

});

var NS_SCHEDA_DIETA = {

    chiudi:function() {
        parent.$.fancybox.close();
    },

    load_wk_dieta:function(){
        $("textarea[name=txtDieta]").focus();

        var vWhere;
        var vDati = WindowCartella.getForm(document);
        switch(WindowCartella.FiltroCartella.getLivelloValue(vDati)){
            case 'IDEN_VISITA':		vWhere= " where  CONTENUTO IS NOT NULL and iden_visita =" + WindowCartella.getAccesso("IDEN");
                break;
            case 'NUM_NOSOLOGICO':	vWhere= " where CONTENUTO IS NOT NULL and iden_ricovero =" + WindowCartella.getRicovero("IDEN");
                break;
            default:			vWhere= " where iden_anag =" + WindowCartella.getPaziente("IDEN");
                break;
        }
        var url = 'servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_DIETA&ILLUMINA=javascript:illumina(this.sectionRowIndex);';
        url    += '&WHERE_WK=' + vWhere;
        $("iframe#frameDiete").attr("src",url);
    },
    hide_wk_dieta:function(){
        $("iframe#frameDiete").hide();
        $("#divGroupInfo").hide();
        $("#lblChiudi").closest("td").hide();
    }
};