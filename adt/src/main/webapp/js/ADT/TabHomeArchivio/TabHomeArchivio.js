jQuery(document).ready(function () {
	
    window.NS_FENIX_TOP = window.parent.NS_FENIX_TOP;
    window.$.NS_DB = window.parent.$.NS_DB;
    
    NS_HOME_ARCHIVIO.init();
    NS_HOME_ARCHIVIO.events();
});

var IDEN_ARCHIVIO;
var ARCHIVIO;

var NS_HOME_ARCHIVIO =
{
    struttura : null,

    init : function(){
    	
    	NS_HOME_ARCHIVIO.tab_sel = 'filtroCartelle';
    	
        $("#txtAnno").val(moment().format('YYYY'));
        $("#txtAnnoGrouper").val(moment().format('YYYY'));

        NS_HOME_ARCHIVIO_WK.caricaWk();
        NS_HOME_ARCHIVIO.initLogger();
        NS_HOME_ARCHIVIO.initFiltroStruttura();
        NS_HOME_ARCHIVIO.impostaArchivio();
    },

    events : function(){

		// Aggiorno NS_FENIX_WK.beforeApplica
		NS_FENIX_WK.beforeApplica = NS_HOME_ARCHIVIO_WK.beforeApplica;

		// Allineo il comportamento del tasto invio su un filtro a quello del tasto applica
		// Vedi NS_FENIX_WK.setInputEnterEvent e NS_FENIX_WK.setApplicaEvent
		$("#filtroCartelle input, #filtroGrouper input, #filtroRichiesteCartelle input").off("keypress").on("keypress", function (e)
		{
			if (e.keyCode == 13)
			{
				if(!NS_FENIX_WK.beforeApplica())
				{
					NS_FENIX_WK.setApplicaEvent();
					return false;
				}
				NS_FENIX_FILTRI.applicaFiltri(NS_FENIX_WK.params);
			}
		});
    	
    	// Click su Tabulatore
    	$('#tabs-Worklist').children().click(function(){
            NS_HOME_ARCHIVIO.tab_sel = $(this).attr('data-tab');
            NS_HOME_ARCHIVIO_WK.caricaWk(); 
        });

		$(".okTags").off("click").on("click", function(){
			var idTag = $(this).attr("id").split("@")[0];

			var descr = $("#" + idTag).data("CheckBox").descr();
			$("[data-tag-descr='" + idTag + "']").val(descr);

			$(".tagList").hide();
		})

    },
    
    initLogger:function()
    {
        home.NS_CONSOLEJS.addLogger({name:'GESTIONE_CARTELLE',console:0});
        window.logger = home.NS_CONSOLEJS.loggers['GESTIONE_CARTELLE'];
        
        home.NS_CONSOLEJS.addLogger({name:'CALCOLA_DRG',console:0});
        window.loggerDRG = home.NS_CONSOLEJS.loggers['CALCOLA_DRG'];
    },
    
    initFiltroStruttura : function()
    {        
        var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
        var xhr =  db.select(
        {
                id: "ADT.Q_STRUTTURA_UTENTE_ARCHIVIO",
                parameter : {"webuser" : $("#USERNAME").val()}
        });
		
        xhr.done(function (data, textStatus, jqXHR) {

        	if (data.result.length > 0)
            {
        		 $("#txtStruttura").val(data.result[0].CODICE_STRUTTURA)
        		 $("#txtStrutturaGrouper").val(data.result[0].CODICE_STRUTTURA)
            }
        });
        
    },
    
    riepiligoaccessidh:function(rec){
    	home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=RIEPILOGO_ACCESSI_DH&IDEN_ANAG='+rec[0].IDEN_ANAGRAFICA+'&IDEN_CONTATTO='+rec[0].IDEN_CONTATTO+'&STATO_PAGINA=R',fullscreen:true});
    },
        
    impostaArchivio:function(){
        var param={"username":$("#USERNAME").val()};
        dwr.engine.setAsync(false);
        toolKitDB.getResultDatasource("ADT.Q_ARCHIVIO_REPARTI_FILTRO","ADT",param,null,function(resp){
            IDEN_ARCHIVIO= resp[0].IDEN;
            ARCHIVIO=resp[0].ARCHIVIO;
        });
        dwr.engine.setAsync(true);
    }
    
};

var NS_HOME_ARCHIVIO_PRINT = {
		
		stampaStoricoRicoveriCartella : function(IDEN_ANAGRAFICA)
		{
			var _par = {};
			_par.PRINT_DIRECTORY = 'STORICO_RICOVERI';
			_par.PRINT_REPORT = 'STORICO_RICOVERI_PZ';
			_par.PRINT_PROMPT = "&promptIDEN_ANAGRAFICA=" + IDEN_ANAGRAFICA;
			_par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

			home.NS_FENIX_PRINT.caricaDocumento(_par);
			home.NS_FENIX_PRINT.apri(_par);
	    },
		 
	    stampaAccessiDH : function(idenContatto)
	    {
	    	var _par = {};
	    	_par.PRINT_DIRECTORY = 'DH';
	    	_par.PRINT_REPORT = 'ACCESSI_DH';
	    	_par.PRINT_PROMPT = "&promptpidenContatto=" + idenContatto;
			_par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

			home.NS_FENIX_PRINT.caricaDocumento(_par);
			home.NS_FENIX_PRINT.apri(_par);
		}
};

var NS_HOME_ARCHIVIO_PROCESS_DATA = {
		
		setBackgroundMorte : function(data,td){

	    	var Datamorte = data.DATA_MORTE;
	    	
	    	if (Datamorte != null)
	    	{
	            td.css({'background-color':'#7a7a7a'});
	            data.ASSISTITO=data.ASSISTITO+" (Deceduto)";
	        }
	        return data.ASSISTITO;
	    },
	    
		setBackgroundLEA : function(data,td){
	        
			if (data.LEA == "S") {
	            td.css({'background-color':'#87CEFA'});
	        }
			
	        if (data.DRG_ANOMALO=='S') {
	            td.css({'text-decoration':'underline','color':'red'});
	        }
	        
	        return data.CODICE_DRG;
	    },
	    
	    setBackgroundStato_Cartella : function(data,td)
	    {
	        if (data.CODICE_STATO_CARTELLA=='00') {
	        	td.css({'text-decoration':'underline','color':'red'});
	        }
	        return data.STATO_CARTELLA;
	    },
	    
	    setBackgroundDRG_ANOMALO : function(data,td) 
	    {
	        if (data.DRG_ANOMALO=='N') {
	            td.css({'text-decoration':'underline','color':'red'});
	        }
	        
	        return data.DRG_ANOMALO;
	    },
	    
	    setBackgroundRic : function(data,td)
	    {
	        if (data.N_RICHIESTE > 0)
	        {
	            td.css({'background-color':'#00BFFF'});
	            return data.N_RICHIESTE;
	        }
	        else
	        {
	            return null;
	        }
	    },
	    
		processDatiAnag : function (IDEN_ANAG, ASSISTITO) 
		{
	        var $a =$(document.createElement('a')).text(ASSISTITO);
	        $a.on('click',function(){
	            top.NS_FENIX_TOP.apriPagina({'url':'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=N&STATO_PAGINA=E&IDEN_ANAG='+ IDEN_ANAG,'id':'datiAnag','fullscreen':true});
	        });
	        
	        return $a;
	    },

		showDettaglioRichieste : function (text, codice) {

			var _tbl = $("<table></table>"); _tbl.css({"width":"100%","text-align":"center"});
			var _richieste = new Array();
			var _richieste_dettaglio = new Array();

			if (text.length < 1) {
				return;
			}

			_richieste = text.split(",");
			_TrTh = $("<tr><th>ID</th><th>DATA</th><th>STATO</th><th>STATO RICHIESTA CARTELLA</th></tr>"); _TrTh.css({"font-weight":"bold"})
			_tbl.append(_TrTh);

			for(var i = 0; i < _richieste.length; i++){
				// IDEN_RICHIESTA|DATA_INIZIO(yyyyMMddhh24:mi)|STATO_RICHIESTA|STATO_RIC_CARTELLA
				_richieste_dettaglio = _richieste[i].split("|");
				_tbl.append($("<tr><td>" + _richieste_dettaglio[0] + "</td><td>" + moment(_richieste_dettaglio[1],"YYYYMMDDHH:mm").format("DD/MM/YYYY") + "</td><td>" + _richieste_dettaglio[2] + "</td><td>" + _richieste_dettaglio[3] + "</td></tr>"));
			}

			$.dialog(_tbl, {
				id: "dialogDettaglioRichieste",
				title: "Dettaglio Richieste Cartella " + codice,
				showBtnClose: true,
				movable: true,
				width : 450
			});
		}
};