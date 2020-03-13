$(document).ready(function()
{
    NS_FENIX_WK.beforeCaricaWk = WORKLIST.beforeCaricaWk;

    //$.cookie('idTabAttivoWORKLIST', null, { expires: 7 });
    WORKLIST.init();
    WORKLIST.setEvents();

    NS_FENIX.attivaTabs = WORKLIST.attivaTabs;
    NS_FENIX_TAG_LIST.beforeApplica = WORKLIST.beforeApplicaAfterTag;
    NS_FENIX_WK.beforeApplica = WORKLIST.beforeApplica;

    $("#li-filtroWk").personalFilters({});/*PROVA*/
    $("#li-filtroGesRich").personalFilters({})/*PROVA*/
});

var WORKLIST = {

    tabs:null,

    init:function()
    {
        home.NS_CONSOLEJS.addLogger({name:'worklist',console:0});
        window.logger = home.NS_CONSOLEJS.loggers['worklist'];

        $(".butAzzeraFiltri" ).hide();

        LOCKS.unlock_rows();

        home.WORKLIST = this;
        WORKLIST.db = $.NS_DB.getTool({ _logger : window.logger });
    },
    setEvents:function()
    {
        WORKLIST.attivaTabs();
        NS_FENIX.setAggiorna(WORKLIST.aggiorna);
        NS_FENIX_WK.caricaWk();

        $("#Worklist\\@butAzzeraFiltri").on("click", WORKLIST.azzeraFiltri);
        
        $("#Worklist\\@butAllegaByBarcode").on("click", WORKLIST.allegaByBarcode);
		
		$(window).on('unload', function () {
			home.WORKLIST = null;
		});
    },
    
    allegaByBarcode: function(){		
    	
		var $fr = $("<form>").attr("id","AllegaDOC");
        $fr.append(
			$(document.createElement('p')).append(
                $(document.createElement('label')).attr({"id": "lbltxtDialogCodFisc"}).text("Codice Fiscale").css("margin-right", "5px"),
                $(document.createElement('textarea')).attr({"id": "txtDialogCodFisc", "name": "txtDialogCodFisc"}).on("click", function(e){
                	if(e.keyCode===13){
	                	e.preventDefault();
			    		e.stopImmediatePropagation();
                	}
		    	})
	    	)
        );
        
    	$.dialog($fr,{
    		"width":"400px",
            "title":'Allega Documento tramite Barcode',
			"showBtnClose" : false,
            "buttons": [
	            {"label": "Annulla", "action": function (){
	                    $.dialog.hide();
	                }
	            },
                {"label": "Procedi", "action": function (){
                	
                		var cod_fisc = $("#txtDialogCodFisc").val().trim();
	                	if(cod_fisc.length < 16){
	                		home.NOTIFICA.warning({message: "Il Codice Fiscale inserito è incompleto",timeout: 5});
	                	}else{
	                		var checkCodFisc = NS_FUNCTIONS.verificaCodiceFiscaleDefinitivo(cod_fisc);
	                		if(checkCodFisc){
		                		WORKLIST.cercaPazienteByCF(cod_fisc);
			                    $.dialog.hide();	                			
	                		}else{
		                		home.NOTIFICA.warning({message: "Il Codice Fiscale inserito non è valido",timeout: 5});
	                		}
	                	}
	                }
	            }
            ]
        });
    },

    cercaPazienteByCF: function(cf)
    {
		WORKLIST.db.select({
            id 				: 'WORKLIST.RICERCA_ANAGRAFICA'
            , datasource 	: 'ANAGRAFICA'
            , parameter 	: {
            	"cognome" 			: {v : '%', t : 'V'}
				,"nome" 			: {v : '%', t : 'V'}
				,"data_nascita" 	: {v : '%', t : 'V'}
				,"codice_fiscale" 	: {v : '%' + cf, t : 'V'}
            }
		}).done(function(resp) {
			if(resp.result.length > 0){
				if(home.NS_FENIX_PIC.search.consensus(resp.result[0].IDEN_ANAGRAFICA, 'CONSENSO_UNICO') != ''){
					WK_RICERCA_ANAGRAFICA.allegato.allega(resp.result, null, 'CONSENSO_UNICO');
				}else{
					home.NOTIFICA.warning({
		    			'title'		: 'Attenzione',
		    			'message'	: "Il paziente non ha un consenso unico registrato. Registrare il consenso per il paziente e successivamente procedere con l'Allega Documento'",
		    			'timeout'	: 5
		    		});
				}
			}else{
				home.NOTIFICA.warning({
	    			'title'		: 'Attenzione',
	    			'message'	: 'Paziente non trovato',
	    			'timeout'	: 5
	    		});
			}
		});
    },

    azzeraFiltri: function()
    {
        var contentTab	=  $("li.tabActive", "#tabs-Worklist");

        $( "#"+ contentTab.attr("data-tab") ).find(":input").each(function()
        {
            $( this ).val("");
        });
        NS_FENIX_WK.caricaWk();
    },

    gestioneTastoAzzeraFiltri: function(tabClicked)
    {
        var butAzzeraFiltri	= $("#Worklist\\@butAzzeraFiltri");

        if( tabClicked !== "li-filtroWk" )
            butAzzeraFiltri.show();
        else
            butAzzeraFiltri.hide();
    },

    gestioneFocus: function(tabClicked)

    {
        if(tabClicked == 'li-filtroRicercaAnagrafica')
        {
            $('#txtCognome').focus();
        }
        else if(tabClicked == 'li-filtroRicPazCodFisc')
        {
            $('#txtCodFisc').focus();
        }
    },

    aggiorna:function()
    {
        LOCKS.unlock_rows();
        NS_FENIX_WK.aggiornaWk({"force":false});
    },
    refreshWk:function()
    {
        LOCKS.unlock_rows();
        NS_FENIX_WK.refreshWK();
    },

    attivaTabs:function()
    {
        // debugging
        //$("#Worklist").Tabs({idActive:"filtroRicPazCognNomeData"},NS_FENIX_WK.caricaWk);
        //$("#Worklist").Tabs();

        var idTabAttivo;
        var hTabAttivo = $("#TAB_ATTIVO");
        if(hTabAttivo.length==1){
            idTabAttivo = hTabAttivo.val();
            $.cookie('idTabAttivoWORKLIST', idTabAttivo, { expires: 7 });

            logger.debug("cookie['idTabAttivoWORKLIST'] = " + idTabAttivo);
        }else{
            logger.debug("cookie['idTabAttivoWORKLIST'] = " + $.cookie('idTabAttivoWORKLIST'));
            idTabAttivo = ($.cookie('idTabAttivoWORKLIST') != null) ? $.cookie('idTabAttivoWORKLIST') : null;
        }
        WORKLIST.gestioneTastoAzzeraFiltri("li-"+idTabAttivo);
        WORKLIST.tabs = $("#Worklist").Tabs({'idActive':idTabAttivo}, function()
        {
            var tabClicked = $("li.tabActive", "#tabs-Worklist").attr("id");
            var idTabAttivo = $("li.tabActive", "#tabs-Worklist").data("tab");
            $.cookie('idTabAttivoWORKLIST', idTabAttivo, { expires: 7 });
            logger.debug("cookie['idTabAttivoWORKLIST'] = " + idTabAttivo);
            WORKLIST.gestioneTastoAzzeraFiltri(tabClicked);
            WORKLIST.gestioneFocus(tabClicked);
            LOCKS.unlock_rows();
            NS_FENIX_WK.caricaWk();
        });
        var hRicercaPaz = $("#MSG");
        if(hRicercaPaz.length==1)
        {
            var ArrRicerca = hRicercaPaz.val().split(/ /gi);
            $("#txtCognome").val(ArrRicerca[ArrRicerca.length-2]);
            $("#txtNome").val(ArrRicerca[ArrRicerca.length-1])  ;
            setTimeout( "NS_FENIX_FILTRI.applicaFiltri()",1000);

        }
    },

    beforeApplica: function (el)
    {
        LOCKS.unlock_rows();

        var tabAttivo = WORKLIST.tabs.idActive();

        
        if(tabAttivo == 'filtroRicercaAnagrafica')
        {
            var cognome = $('#txtCognome').val();
            var nome = $('#txtNome').val();
            var data = $('#h-txtDataNasc').val();

            var cf = $('#txtCodFisc').val();
            
            if(!cognome && !nome && !data && !cf) return false;
        }
        else if(tabAttivo == 'filtroWk')
        {
            var dadata = moment($('#h-txtDaData').val(),'YYYYMMDD');
            var adata = moment($('#h-txtAData').val(),'YYYYMMDD');
            var diff = adata.diff(dadata, 'days');

            if(diff < 0){
                home.NOTIFICA.warning({message: traduzione.lblDaDataAntecedenteAData,timeout: 5});

                return false;
            }

            // INSERT INTO PARAMETRI (GRUPPO, ID_GRUPPO, NOME, VALORE, ATTIVO, SITO, VERSIONE) VALUES ('GLOBALI', 'GLOBALI', 'CHECK_RANGE_DATA', 'S', 'S', 'ALL', '1');
            var check = LIB.getParameter(home.baseGlobal, 'CHECK_RANGE_DATA');
            if(check == 'S' && diff > 60){
                home.NOTIFICA.warning({message: traduzione.lblRangeDateElevato,timeout: 5});
                return false;
            }else{
                return true;
            }
        }

        return true;
    },

    beforeCaricaWk: function (params)
    {
        params.loadData = (params.id == 'PRINCIPALE' || params.id == 'WK_GESTIONE_RICHIESTE' );
        //alert(JSON.stringify(params));
        return params;
    },

    beforeApplicaAfterTag: function(idTag, params)
        /*
         ricarica la pagina se modifico filtri CDC (sale e provenienze dipendono dai cdc)
         */
    {
        if(idTag == 'tagCDC')
            params.reload = true;

        return params;
    },

    apriSchedaEsame:function(iden_testata)
    {
        home.NS_FENIX_TOP.apriPagina({url:"page?KEY_LEGAME=SCHEDA_ESAME&IDEN_TESTATA="+iden_testata,fullscreen:true});
    },

    apriAnagrafica: function(data)
    {
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&IDEN_ANAG=' + data,id:'SchedaAnagraficaPage',fullscreen:true});
    }
};

window.info = function(msg){home.NOTIFICA.info({message: msg,timeout: 2});}