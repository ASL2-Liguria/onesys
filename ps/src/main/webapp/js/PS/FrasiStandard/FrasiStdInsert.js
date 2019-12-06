$(function() {
    NS_FENIX_SCHEDA.customizeParam = function(params){ params.extern=true; return params; };
    NS_FENIX_SCHEDA.successSave = NS_FRASI.successSave ;
    NS_FRASI.init();
});

var NS_FRASI = {
    init : function(){
        $("#hSito").val($("#SITO").val())
        $("#txtGruppo").val(home.baseUserLocation.cod_cdc).closest("tr").hide()
    },
    successSave : function(){
        home.RIFERIMENTO_FRASI_STD.FRASI_STD.initWkFrasi();
        NS_FENIX_SCHEDA.chiudi({});
    }
};