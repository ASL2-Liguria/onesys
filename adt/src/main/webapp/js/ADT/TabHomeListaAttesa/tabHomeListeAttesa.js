jQuery(document).ready(function () {
    NS_HOME_LISTA_ATTESA.init();
    NS_HOME_LISTA_ATTESA.setEvents();
});

var NS_HOME_LISTA_ATTESA = {

    tab_sel :'filtroListaAttesa',
    adt_lista_attesa : null,
    adt_lista_chiamata : null,

    init : function(){
        NS_HOME_LISTA_ATTESA.initLogger();
        NS_HOME_LISTA_ATTESA.caricaWk();
    },

    setEvents : function(){
        $('#tabs-Worklist').children().click(function(){
            NS_HOME_LISTA_ATTESA.tab_sel = $(this).attr('data-tab');
            NS_HOME_LISTA_ATTESA.caricaWk();
        });
    },

    caricaWk : function(){

        switch  (NS_HOME_LISTA_ATTESA.tab_sel) {

            case 'filtroListaAttesa':
                ListaAttesa.initTab();
                break;
            case 'filtroListaChiamata':
                ListaChiamata.initTab();
                break;
            default :
                logger.error("Tabulatore non riconosciuto " + NS_HOME_LISTA_ATTESA.tab_sel);
                //return alert('ATTENZIONE TABULATORE NON RICONOSCIUTO');
        }
    },

    initLogger:function(){
        top.NS_CONSOLEJS.addLogger({name:'HOME_LISTA_ATTESA',console:0});
        window.logger = top.NS_CONSOLEJS.loggers['HOME_LISTA_ATTESA'];
    },

    processApriCartella : function(data, wk){

    	if (data.CODICE != null)
    	{
    		return $(document.createElement('a')).attr('href', "javascript:NS_HOME_LISTA_ATTESA.getUrlCartellaPaziente('" + data.CODICE + "')").html("<i class='icon-folder-open icoPaz' title='Apri cartella paziente'>");
        }
    	else
    	{
    		return null;
    	}
    },

    processPeriodo : function(data, wk,td){

        var dato = moment(data.PERIODO_PREVISTO_DA,'YYYYMMDD').format('DD/MM/YYYY') + " - " + moment(data.PERIODO_PREVISTO_A,'YYYYMMDD').format('DD/MM/YYYY');
        //alert(dato);
        //alert(typeof data.PERIODO_PREVISTO_DA);
        td.text(dato);

    },


    getUrlCartellaPaziente : function(codice_contatto){

    	// da utilizzare con NS_APPLICATION
    	// var url = 'servletGeneric?class=cartellaclinica.cartellaPaziente.cartellaPaziente&ricovero='+codice_contatto;
        // var url =   home.baseGlobal.URL_CARTELLA + '/autoLogin?utente='+home.baseUser.USERNAME+'&postazione='+home.basePC.IP+'&pagina=CARTELLAPAZIENTEADT&ricovero='+codice_contatto;
        var url =   home.baseGlobal.URL_CARTELLA + '/autoLogin?utente=' + home.baseUser.USERNAME + '&postazione=' + home.AppStampa.GetCanonicalHostname().toUpperCase() + '&pagina=CARTELLAPAZIENTEADT&ricovero='+codice_contatto;

        logger.debug("NS_HOME_ADT.getUrlCartellaPaziente - NOSOLOGICO -> " +  codice_contatto + ', URL -> ' + url);

        if (home.baseUser.TIPO_PERSONALE == 'M')
        {
            url += '&funzione=apriDatiGenerali()';
        }
        else
        {
            url += '&funzione=apriAnamnesi()';
        }

        //url = NS_APPLICATIONS.switchTo('WHALE', url);
        window.open(url, "_blank", "fullscreen=yes");

    }
};

var ListaAttesa = {

    idWk : "",

    /**
     * Definisco ID_WK in base a cio' che viene valorizzato nel combo.
     * Al CHANGE della lista di attesa modifico il TIPO_WK visualizzato e ricarico la WK.
     */

    initTab : function(){

        ListaAttesa.idWk = typeof $('#cmbListaAttesaID option:selected').attr("data-id_wk") === "undefined" ? "WK_LISTA_ATTESA_STD" : $('#cmbListaAttesaID option:selected').attr("data-id_wk");

        $("#filtroListaAttesa").attr("id-worklist",ListaAttesa.idWk);

        ListaAttesa.loadWK();
        ListaAttesa.setEvents();

    },

    setEvents : function(){

        $('#cmbListaAttesaID').off("change").on("change",function(){

            var nome = $('#txtListaAttesaNome').val() == '' ? '%25' : $('#txtListaAttesaNome').val();
            var cognome = $('#txtListaAttesaCognome').val() == '' ? '%25' : $('#txtListaAttesaCognome').val();
            var ursername = $('#USERNAME').val();

            ListaAttesa.idWk =  $('#cmbListaAttesaID option:selected').attr("data-id_wk");

            logger.debug("Lista di Attesa - init - Apertura WK " + ListaAttesa.idWk);

            NS_FENIX_FILTRI.applicaFiltri(
                {
                    "force": false,
                    "reload" : false,
                    "doMyCbk" : function() {
                        NS_HOME_LISTA_ATTESA.adt_lista_attesa.filter(
                            {
                                id: $('#cmbListaAttesaID option:selected').attr("data-id_wk"),
                                container : "divWk",
                                aBind : ["cognome","nome","username"],
                                aVal : [cognome,nome,ursername]
                            });
                    }
                });

        });

    },

    /**
     * Funzione incaricata di valorizzare la WK sottostante.
     * La wk viene valorizzata con la quella specificata in LISTA_ATTESA_ELENCO.ID_WK
     */

    loadWK : function(){

        var nome = $('#txtListaAttesaNome').val() == '' ? '%25' : $('#txtListaAttesaNome').val();
        var cognome = $('#txtListaAttesaCognome').val() == '' ? '%25' : $('#txtListaAttesaCognome').val();
        var ursername = $('#USERNAME').val();

        NS_HOME_LISTA_ATTESA.adt_lista_attesa = new WK({
            id: ListaAttesa.idWk,
            container : "divWk",
            aBind : ["cognome","nome","username"],
            aVal : [cognome,nome,ursername]
        });

        NS_HOME_LISTA_ATTESA.adt_lista_attesa.loadWk();

    },

    /**
     * I REPORT delle liste di attesa vengono stampati in base all'ID della WK.
     * Il nome del REPORT avra' sempre lo stesso ID della WK.
     *
     *  @todo se la il report con lo stesso ID della WK NON esiste allora posizionarsi sull'identificativo STANDARD - <i>Groovy</i>
     */

    printWK : function(){

		var _par = {};
        var _user = $('#USERNAME').val();
        var _nome = $('#txtListaAttesaNome').val() === '' || $('#txtListaAttesaNome').val() == null ? '%25' : $('#txtListaAttesaNome').val();
        var _cognome = $('#txtListaAttesaCognome').val() === "" || $('#txtListaAttesaCognome').val() == null ? '%25' : $('#txtListaAttesaCognome').val();

        _par.PRINT_DIRECTORY = 'LISTA_ATTESA';
        _par.PRINT_REPORT = ListaAttesa.idWk;
        _par.PRINT_PROMPT = "&promptpUser=" + _user + "&promptpCognome=" + _cognome + "&promptpNome=" + _nome;
        _par.STAMPANTE = home.basePC.STAMPANTE_REFERTO;
        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);

    }
};

var ListaChiamata = {

    idWk : "",

    /**
     * Funzione Chiamata Solo Alla Selzione del Tabulatore.
     * Valorizza una variabile con l'id della WK e ricarica quella selezionata o precedentemente salvata.
     * Se la COMBO non è valorizzata viene caricata <i>WK_LISTA_CHIAMATA_STD</i>
     */

    initTab : function(){

    	ListaChiamata.idWk = typeof $('#cmbListaChimataID option:selected').attr("data-id_wk") === "undefined" ? "WK_LISTA_CHIAMATA_STD" : $('#cmbListaChiamataID option:selected').attr("data-id_wk");

        logger.debug("Lista di Chiamata - init - Apertura WK " + ListaChiamata.idWk);

        // Una volta intercettata la WK imposto l'attributo pche consente di ricaricare la WK corretta
        $("#filtroListaChiamata").attr("id-worklist",ListaChiamata.idWk);

        ListaChiamata.loadWK();
        ListaChiamata.setTipoWKFromLista();
    },

    /**
     * Al CHANGE della <b>Lista di Chiamata</b> viene ricaricata la WK con il rispettivo modello configurato.
     * la WK viene configurata su LISTA_ATTESA_ELENCO.ID_WK
     */

    setTipoWKFromLista : function(){

        $('#cmbListaChiamataID').off('change').on('change',function(){

            var nome = $('#txtListaChiamataNome').val() == '' ? '%25' : $('#txtListaChiamataNome').val();
            var cognome = $('#txtListaChiamataCognome').val()=='' ? '%25' : $('#txtListaChiamataCognome').val();
            var ursername = $('#USERNAME').val();

            ListaChiamata.idWk =  $('#cmbListaChiamataID option:selected').attr('data-id-wk');

            logger.debug("Lista di Chiamata - Cambio COMBO Lista Chiamata - Set WK " + ListaChiamata.idWk);

            NS_FENIX_FILTRI.applicaFiltri(
                {
                    "force": false,
                    "reload" : false,
                    "doMyCbk" : function() {
                        NS_HOME_LISTA_ATTESA.adt_lista_chiamata.filter(
                            {
                                id: $('#cmbListaChiamataID option:selected').attr("data-id_wk"),
                                container : "divWk",
                                aBind : ["cognome","nome","username"],
                                aVal : [cognome,nome,ursername]
                            });
                    }
                });

        });

    },

    /**
     * Funzione incaricata di valorizzare la WK sottostante.
     * La wk viene valorizzata con la quella specificata in LISTA_ATTESA_ELENCO.ID_WK
     */

    loadWK : function(){

        // Viene Lanciato solo la prima volta quando viene selezionato il TAB.
        var nome = $('#txtListaChiamataNome').val() == '' ? '%25' : $('#txtListaChiamataNome').val();
        var cognome = $('#txtListaChiamataCognome').val() == '' ? '%25' : $('#txtListaChiamataCognome').val();
        var ursername = $('#USERNAME').val();

        NS_HOME_LISTA_ATTESA.adt_lista_chiamata = new WK({
            id : ListaChiamata.idWk,
            container : "divWk",
            aBind : ["cognome","nome","username"],
            aVal : [cognome,nome,ursername]
        });

        NS_HOME_LISTA_ATTESA.adt_lista_chiamata.loadWk();

    },

    /**
     * I REPORT delle liste di chiamata vengono stampati in base all'ID della WK.
     * Il nome del REPORT avra' sempre lo stesso ID della WK.
     *
     *  @todo se la il report con lo stesso ID della WK NON esiste allora posizionarsi sull'identificativo STANDARD - <i>Groovy</i>
     */

    printWK : function(){

        var _par = {};
        var _user = $('#USERNAME').val();
        var _nome = $('#txtListaChiamataNome').val() === '' || $('#txtListaChiamataNome').val() == null ? '%25' : $('#txtListaChiamataNome').val();
        var _cognome = $('#txtListaChiamataCognome').val() === "" || $('#txtListaChiamataCognome').val() == null ? '%25' : $('#txtListaChiamataCognome').val();

        _par.PRINT_DIRECTORY = 'LISTA_CHIAMATA';
        _par.PRINT_REPORT = ListaChiamata.idWk;
        _par.PRINT_PROMPT = "&promptpUser=" + _user + "&promptpCognome=" + _cognome + "&promptpNome=" + _nome;
        _par.STAMPANTE = home.basePC.STAMPANTE_REFERTO;
        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);

    }
};
