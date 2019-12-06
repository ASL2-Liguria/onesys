var JQGridFormatterExtension = {

    normalizeNosologico : function(cellValue, rowObject){
        return cellValue.replace(/-/g, "");
    }

};

NS_FILTRI_STATISTICHE.checkBeforeApplica  = function(){
    if ($('tr#DATA_ACCESSO').length > 0 || $('tr#DATA_CHIUSURA').length > 0){
        return true;
    } else {
        home.NOTIFICA.error({'message':'Valorizzare almeno Data Accesso o Data Chiusura','title':'Errore','width':220});
        return false;
    }
}