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

    Bind.push("user");
    Value.push(Value[Bind.indexOf("user")]+"%25");
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
            "aBind" : ["user","attivo"],
            "aVal"  : ["%25","S"]
        }
//        alert(params);
        this.wk = new WK(params);
        this.wk.loadWk();
    }

}




