/**
 * User: matteopi
 * Date: 21/01/13
 * Time: 17.41
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

    NS_CONFIGURA_TAB_ESA_REP.init();

    NS_CONFIGURA_TAB_ESA_REP.event();

    //ONCLICK  lstElencoEsamiDisp
    $("[name='lstElencoEsamiDisp']").click(

        function(){
            //Controllo che non ci sia già un esame uguale a quello che si vuole aggiungere
            //nell'elenco degli esami disponibili
            var esadaimportare = (this.value);
            var verifica = true;
            $("select[name='lstElencoEsamiSel'] option").each(function(i, selected){
                if ($(selected).val()==esadaimportare){
                    verifica=false;
                    alert("Attenzione si sta inserendo un \nesame già presente nell'elenco")
                    return;
                }
            });
            if(verifica){
                add_selected_elements('lstElencoEsamiDisp', 'lstElencoEsamiSel', false, 0);

                if (typeof $('#TIPO').val()!='undefined'){
                    WindowCartella.executeStatement("OE_Configurazioni.xml","AddEsameConfigurazione",[esadaimportare,$('#REPARTO_SORGENTE').val(),$('#REPARTO_DESTINAZIONE').val(),$('#TIPO').val()],0);
                }else{
                    alert('Selezionare una tipologia')
                }
            }
        });

    //ONCLICK  lstElencoEsamiSel

    $("select[name='lstElencoEsamiSel']").dblclick(

        function(){

            WindowCartella.executeStatement("OE_Configurazioni.xml","RemoveEsameConfigurazione",[this.value,$('#REPARTO_SORGENTE').val(),$('#REPARTO_DESTINAZIONE').val()],0);

            remove_elem_by_id('lstElencoEsamiSel',jQuery("select[name='lstElencoEsamiSel']").find("option:selected").index());
        });

});

var NS_CONFIGURA_TAB_ESA_REP = {

    init:function(){
        //impostare l'altezza dei select

        $("select[name='lstElencoEsamiDisp']").attr("size","15");
        $("select[name='lstElencoEsamiSel']").attr("size","15");

    },
    event:function(){

    }
}
