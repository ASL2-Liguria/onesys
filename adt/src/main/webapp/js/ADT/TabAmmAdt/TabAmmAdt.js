/**
 * User: matteopi
 * Date: 14/10/13
 * Time: 11.50
 */

jQuery(document).ready(function () {

    NS_HOME_AMM.init();
    NS_HOME_AMM.event();
});

var NS_HOME_AMM = {
    tab_sel:null,
    adt_wk_lista:null,
    adt_wk_liste_chiamata:null,

    init : function () {
        home.NS_HOME_AMM = this;
        $("#divWk").css({
            'height':'700'
        });
        NS_HOME_AMM.startWorklist();


    },
    event: function () {

        $('#tabs-Worklist').children().click(function(){
            NS_HOME_AMM.tab_sel = $(this).attr('data-tab');

            switch  (NS_HOME_AMM.tab_sel) {
                case 'filtroListaAttesa': NS_HOME_AMM.caricaWkListaAttesa();
                    break;
                case 'filtroListaChiamata':NS_HOME_AMM.caricaWkListaChiamata();
                    break;
                default :
                    logger.error("Tabulatore non riconosciuto " + NS_HOME_AMM.tab_sel);
                    // return alert('ATTENZIONE TABULATORE NON RICONOSCIUTO');
            }
        });


    },
    startWorklist:function(){
        NS_HOME_AMM.caricaWkListaAttesa();
    },
    caricaWkListaAttesa:function(){

        var Descrizione =   ($('#txtDescrLista').val()=='')?'%25': $('#txtDescrLista').val();

        NS_HOME_AMM.adt_wk_lista= new WK({
            id : "ADT_WK_LISTA",
            container : "divWk",
            aBind : ["DescrLista"],
            aVal : [Descrizione]
//            loadData : false
        });

        NS_HOME_AMM.adt_wk_lista.loadWk();
    },
    cancellaListaAttesa:function(iden_lista){
        dwr.engine.setAsync(false);
        var param =
        {
            PIDENLIST :iden_lista
        }

        toolKitDB.executeProcedureDatasource("LISTA_ATTESA_GESTIONE.REMOVELIST","ADT",param,function(resp){
            var response = resp.p_result.split('|');
            if (response[0]=='KO'){
                home.NOTIFICA.error({message: 'Errore nell\' eliminazione della lista',timeout: 5, title: "Error"});
            }else{
                home.NOTIFICA.success({message: 'Salvataggio effettuato correttamente', timeout: 2, title: 'Success'});
                NS_HOME_AMM.caricaWkListaAttesa();
            }

        });
        dwr.engine.setAsync(true);
    },
    caricaWkListaChiamata:function(){

        //ADT_WK_LISTE_ATTESA
        var Descrizione =   ($('#txtDescrListaChiamata').val()=='')?'%25': $('#txtDescrListaChiamata').val();

        NS_HOME_AMM.adt_wk_liste_chiamata= new WK({
            id : "ADT_WK_LISTE_CHIAMATA",
            container : "divWk",
            aBind : ["DescrLista"],
            aVal : [Descrizione]
//            loadData : false
        });
        NS_HOME_AMM.adt_wk_liste_chiamata.loadWk();
    }
};




