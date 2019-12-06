var JQGridFormatterExtension = {
    /**
     * Formatter creato in quanto la vista datasource per pentaho restiruisce il numero di accessi
     * e i giorni di degenza senza discriminare il regime. Per non mostrare entrambi nell'estrazione
     * è stato creato questo formatter.
     *
     * @param cellvalue
     * @param options
     * @param rowObject
     * @returns {*}
     */
    formatGiorniDegenza : function (cellvalue, options, rowObject){
        if (rowObject["REGIME"] == "ORDINARIO" && cellvalue != null){
            return cellvalue;
        } else {
            return "";
        }
    },

    /**
     * Vedi commento per funzione JQGridFormatterExtension.formatGiorniAccessi
     * @param cellvalue
     * @param options
     * @param rowObject
     * @returns {*}
     */
    formatGiorniAccessi : function (cellvalue, options, rowObject){
        if (rowObject["REGIME"] == "DAY HOSPITAL" && cellvalue != null){
            return cellvalue;
        } else {
            return "";
        }
    },

    normalizeNosologico : function(cellValue, rowObject){
        return cellValue.replace(/-/g, "");
    }
};

NS_FILTRI_STATISTICHE.checkBeforeApplica  = function(){
    if ($('tr#DATA_RICOVERO').length > 0 || $('tr#DATA_FINE').length > 0 || $('tr#DATA_STATO_CARTELLA').length > 0){
        return true;
    } else {
        home.NOTIFICA.error({'message':'Valorizzare almeno Data Ricovero o Data Dimissione','title':'Errore','width':220});
        return false;
    }
}