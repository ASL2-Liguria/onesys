/**
 * Definizione oggetti home ADT.
 * 
 * @author matteo.pipitone
 * @author alessandro.arrighi
 */

$(document).ready(function(){
	home.document.title = home.baseGlobal.TITLE_MAIN_PAGE;
});

var NS_FENIX_ADT =
{
    init : function()
    {
    	home.NS_FENIX_PRINT = NS_FENIX_PRINT;
        home.NS_FENIX_FIRMA = NS_FENIX_FIRMA;
        
        home.FIRMA = NS_FENIX_FIRMA.getInstance(FIRMA_ADT);
        
        NS_FENIX_PRINT.getDefaultParams = NS_FENIX_ADT.getDefaultParams;
    },

    /**
     * Invocata obbligatoriamente da NS_FENIX_TOP. Non Rimuovere!
     */
	setEvents : function(){},
	
	stampaSDO : function(pIdenContatto, pQuery, pDatasource){
		
		pQuery = typeof pQuery == "undefined" ? 'ADT.VISUALIZZA_PDF_SDO' : pQuery; 
		pDatasource = typeof pDatasource == "undefined" ? 'ADT' : pDatasource; 
		
		var params = {
				"URL": top.NS_FENIX_TOP.getAbsolutePathServer() + 
				'showDocumentoAllegato?IDEN=' + pIdenContatto +
				"&QUERY=" + pQuery +
				"&DATASOURCE=" + pDatasource + "&ts=" + new Date().getTime()
			};
		
		
		params['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;
		home.NS_FENIX_PRINT.caricaDocumento(params);
		home.NS_FENIX_PRINT.apri(params);
	},
	
	getDefaultParams : function(){
		var param = {};
		
		if(LIB.isValid(basePC.STAMPANTE_CONFIGURAZIONE)){
			param['CONFIG'] = basePC.STAMPANTE_CONFIGURAZIONE;
		}

		return param;
	}
	
};

var NS_ADT_API =
{
		selezionaTabulatore : function(WK, cbk){
			
			var _tabWK = "";
			
			switch (WK)
			{
				case "ACCETTAZIONE_TRASFERIMENTI" :
					_tabWK = "li-filtroAccettazioneTrasferimenti";
					break;
					
				default :
					home.NOTIFICA.error({message: "Identificativo WK Non Valido!", timeout : 0, title : "Errore"});
			}
			
			var obj = $("#iContent").contents().find("#" + _tabWK); obj.trigger('click');
			
			if (typeof cbk === "function"){
				cbk();
			}
		},
		
		notificaInfo : function(message){
			home.NOTIFICA.info({message: message, timeout : 0, title : "Info"});
		},
    
		notificaWarn : function(message){
			home.NOTIFICA.warning({message: message, timeout : 0, title : "Attenzione"});
		},
    
		notificaError : function(message){
			home.NOTIFICA.error({message: message, timeout : 0, title : "Errore"});
		},

		focusCartella : function(obj) {
			obj.focus();
		}
};