/**
 * Created with IntelliJ IDEA.
 * User: matteopi
 * Date: 24/01/13
 * Time: 11.08
 */
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

    NS_WK_DIETA.setClassDeleted();
});

var NS_WK_DIETA = {

    inserisciDieta:function() {
        NS_DIARI.pagina.inserisciDieta({
                iden_visita:WindowCartella.getAccesso("IDEN"),
                callBackOk:NS_WK_DIETA.refresh
        });

    },

    refresh:function(){
        document.location.replace(document.location);
    },

    cancellaDieta:function(){
    	
        if(stringa_codici(array_iden_diario) == ''){
            return alert('Attenzione:effettuare una selezione');
       }

        if(stringa_codici(array_deleted)=="S"){
            return alert("Attenzione dieta già cancellata");
        }
        if(stringa_codici(array_ute_ins)!=WindowCartella.baseUser.IDEN_PER){
            return alert("Cancellazione consentita solo all'utente che ha inserito la dieta");
        }
        if(confirm("Vuoi cancellare la dieta selezionata")){
            var resp= WindowCartella.executeStatement("diari.xml","cancellaDiarioEpicrisi",[stringa_codici(array_iden_diario), ""],0);
            if (resp[0]=="KO"){
                alert(resp[1]);
            }
            NS_WK_DIETA.refresh();

        }
    },

    //controllo sulla worklist delle diete cancellate
    setClassDeleted:function(){
        $('table#oTable tr').each(function(idx){
            if(array_deleted[idx]=="S"){
                $(this).addClass("gray");
            }
        });
    },

    modificaDieta:function(){
    	
        if(stringa_codici(array_iden_diario) == ''){
            return alert('Attenzione:effettuare una selezione');
       }
    	
        if(stringa_codici(array_deleted)=="S"){
            return alert("Attenzione dieta già cancellata");
        }
        if(stringa_codici(array_ute_ins)!=WindowCartella.baseUser.IDEN_PER){
            return alert("Modifica consentita solo all'utente che ha inserito la dieta");
        }
           NS_DIARI.pagina.modificaDieta();
    }
};