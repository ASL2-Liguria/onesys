NS_FENIX_FILTRI.applicaFiltri = function ()
{
    $(".toUpper","#filtri").each(function(k,v){$(v).val();});
    NS_FENIX_WK.aggiornaWk();
};

NS_FENIX_WK.aggiornaWk= function ()
{
    var paramsWk = NS_FENIX_FILTRI.leggiFiltriDaBindare();
    var Bind=paramsWk.aBind;
    var Value=paramsWk.aVal;

    Bind.push("utente");
    Value.push(Value[Bind.indexOf("utente")]+"%25");
    ((Value[Bind.indexOf("attivo")]=="E")?Value[Bind.indexOf("attivo")]="S,N":null);

    GESTIONE_UTENTI.wk.filter({"aBind":paramsWk.aBind,"aVal":paramsWk.aVal});
};

$("document").ready(function(){
    GESTIONE_UTENTI.init();
});

var GESTIONE_UTENTI={
    wk:null,
    init:function()
    {
        var params = {
            "id"    : $("#ID_WK").val(),
            "aBind" : ["utente","attivo"],
            "aVal"  : ["%25","S"]
        };
        this.wk = new WK(params);
        this.wk.loadWk();
    }
};




