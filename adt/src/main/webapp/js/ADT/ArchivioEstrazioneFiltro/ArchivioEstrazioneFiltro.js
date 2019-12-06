jQuery(document).ready(function () {
    NS_ARCHIVIO_ESTRAZIONE.init();
});

var IDEN_ARCHIVIO = null;
var ARCHIVIO = null;

var NS_ARCHIVIO_ESTRAZIONE = 
{
		WK : null,
		
		/**
		 * Funzione che inizializza la pagina conetenente la WK
		 * 
		 * @author alessandro.arrighi
		 */
		init : function() {
			
			NS_ARCHIVIO_ESTRAZIONE.setEvents();
			NS_ARCHIVIO_ESTRAZIONE.loadWK();
			NS_ARCHIVIO_ESTRAZIONE.impostaArchivio();
			NS_ARCHIVIO_ESTRAZIONE.initLogger();
			
			NS_FENIX_WK.beforeApplica = NS_ARCHIVIO_ESTRAZIONE.beforeApplica;
		},
		
		setEvents : function()
		{

			var daData = $("#txtDaDataEstrazione" ).data('Zebra_DatePicker');
            daData.setDataIso(moment().add(-10,"days").format('YYYYMMDD'));

            var aData = $("#txtADataEstrazione" ).data('Zebra_DatePicker');
            aData.setDataIso(moment().format('YYYYMMDD'));
            
			$("#li-filtroEstrazione").html("Estrazione " + $("#LABEL").val());
	        $("#divWk").css({'height':document.body.offsetHeight  - $("#filtri").height() - 10});
	        
			$(".butChiudiEstrazione").on("click", function(){ home.NS_FENIX_TOP.chiudiScheda({"n_scheda" : $("#N_SCHEDA").val()}); });
		},
		
		impostaArchivio : function()
		{
	        var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

            var xhr =  db.select({
                    id: "ADT.Q_ARCHIVIO_REPARTI_FILTRO",
                    parameter : {"username":   {t: "V", v: home.baseUser.USERNAME}}
            });
            
            xhr.done(function (data, textStatus, jqXHR) {
            	IDEN_ARCHIVIO = data.result[0].IDEN;
            	ARCHIVIO = data.result[0].ARCHIVIO;
            });
	    },
	    
		/**
		 * Al beforeApplica verifico che in apertura non sia specificata una WK specifica per il caricamento dei dati.
		 * 
		 * @author alessandro.arrighi
		 */
		beforeApplica : function()
		{ 
			var _query = $("#ID_QUERY").val();
			
			if (_query.length > 0){
				$("#divWk").worklist().config.structure.id_query = $("#ID_QUERY").val();
			}
			
			loggerEstrazioneCartelle.info("Caricamento WK -> " + $("#WK").val() + " con query " + $("#divWk").worklist().config.structure.id_query);
			
			return true; 
		},
		
		loadWK : function()
		{			
			NS_ARCHIVIO_ESTRAZIONE.WK = new WK({
	            id : $("#WK").val(),
	            container : "divWk",
	            aBind : [],
	            aVal : [],
	            load_callback : null,
	            loadData : false
	        });

			NS_ARCHIVIO_ESTRAZIONE.WK.loadWk();	
		},
		
		initLogger : function(){
			home.NS_CONSOLEJS.addLogger({name:'ARCHIVIO_ESTRAZIONE_CARTELLE',console:0});
	        window.loggerEstrazioneCartelle = home.NS_CONSOLEJS.loggers['GESTIONE_CARTELLE'];
		}
};