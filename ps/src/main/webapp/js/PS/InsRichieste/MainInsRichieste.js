/**
 * Autore: CarloG
 * Data : 04/06/2014
 * Descrizione: file js della scheda INS_RISCHIESTE.
 * Include le funzioni di caricamento iniziale della pagina, e la partenza di tutti gli eventi.
 * Altri file inclusi nella pagina :
 * 	filtriProfiliRichieste.js (gestione dei filtri, e dei pulsanti preferiti da DB),
 * 	appendRichieste.js (creazione e la validazione dinamica degli elementi),
 * 	inviaRichieste.js (creazione, valorizzazione e invio messaggio Json verso client.java),
 * 	wkRichieste.js (gestione della WorKlist)
 **/

$(function() {

    MAIN_INS_RICHIESTE.init();

});

var MAIN_INS_RICHIESTE = {

    reparto_attuale : null,			// cod_cdc del pronto soccorso in uso attualmente
    rep_destinazione : null,	// cod_cdc reparto destinazione tab_esa_reparto
    descr : null, 				// descrizione degli esami di tab_esa, usata per filtrare gli stessi
    reparto : "", 			    // cod_cdc reparto destinatario per le consulenze
    iden_contatto : null, 		// iden_contatto
    strutturaAttuale : null, 	// struttura in cui si trova l'operatore caricata al caricamento della pagina da centri_di_costo
    tipoRichiesta : null, 		// tipo riciesta di tab_esa_reparto: I interne, C consulenze, R tutte le altre
    urgenza : null, 			// urgenza dell'esame di norma =3, in labo e consulenze =2. Da tab_esa_reparto.
    descr_reparto : null, 		// descriuzione del reparto corrispondente al cod_cdc da centri_di_costo
    metodica : "",			    // metodica degli esami
    idenScheda : null,          // iden scheda su tab_esa_reparto con decodifica su tab_labo_schede
    attualeCodDec : null,		// variabile usata per confronto del CodDec
    attualeMetodica : null,		// variabile usata per confronto della Metodica
    validator : null, 			// validatore dei campi obbligatori
    corpo : null,               // corpo di tab_esa
    isIE : true,                // verifica che il browser aperto sia IE
    esamiCaricati : [],         // json con tutti gli iden degli esami mandati
    jsonQuesito : [],           // json con tutti i quesiti  id,val
    num_nosologico : null,      //il num nosologico, normalmente lo prende dalla query della pagina in autologin gli viene passato in URL
    /**
     * Funzione iniziale
     */
    init : function() {

        MAIN_INS_RICHIESTE.isIE = !!document.documentMode;
        NS_FENIX_SCHEDA.customizeParam = function(params) { params.extern = true; return params; };
        NS_FENIX_SCHEDA.validateFields = function(){valida = true;};

        //MAIN_INS_RICHIESTE.iden_contatto = $("#IDEN_CONTATTO").val();
        MAIN_INS_RICHIESTE.strutturaAttuale = $("#hStruttura").val();


        // funzioni dedicate solo all'autologin
        if($("#AUTOLOGIN").val() != 'S'){
            MAIN_INS_RICHIESTE.reparto_attuale = $("#hCodCdc").val();
            MAIN_INS_RICHIESTE.urgenza = NS_WK_RICHIESTE.setUrgenza(home.PANEL.urgenza);
            MAIN_INS_RICHIESTE.Pagina.alertAlcol();
            MAIN_INS_RICHIESTE.num_nosologico = $("#hContCodice").val();
        }else{
            MAIN_INS_RICHIESTE.reparto_attuale = $("#EXTERN").find("#hCodCdc").val();
            MAIN_INS_RICHIESTE.urgenza = $("#URGENZA").val();//0-1-2-3
            MAIN_INS_RICHIESTE.num_nosologico = $("#NUM_NOSOLOGICO").val();

        }


        NS_APPEND_RICHIESTE.creaIntestazioneTable();

        MAIN_INS_RICHIESTE.validator = NS_FENIX_SCHEDA.addFieldsValidator({config : "V_PS_INS_RICHIESTE"});


        if(MAIN_INS_RICHIESTE.hasAValue(home) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO)&& MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        }

        home.MAIN_INS_RICHIESTE = this;

        MAIN_INS_RICHIESTE.detectBaseUser();
        NS_WK_RICHIESTE.initialSettings();

        var radRichSel = $("#radRichieste").find("div[data-cod_cdc='"+MAIN_INS_RICHIESTE.reparto_attuale+"']");
        MAIN_INS_RICHIESTE.Pagina.showHide(radRichSel);


        MAIN_INS_RICHIESTE.setEvents();


    },
    /**
     * Funzione cattura eventi
     */
    setEvents : function() {

        $("#UrgenzaRichieste").on("click", function(){

            MAIN_INS_RICHIESTE.urgenza = $(this).find("input[type=hidden]").val();

            var radHidden = $("#h-radRichieste").val();

            var radRichSel = $("#radRichieste").find("div[data-value='"+radHidden+"']");

            MAIN_INS_RICHIESTE.Pagina.selezionaRadio(radRichSel);

        });

        $("#butCerca").on("click", function() {
            NS_WK_RICHIESTE.gestioneWk(MAIN_INS_RICHIESTE.tipoRichiesta, $("#txtFiltroText").val());
        });

        $("#txtFiltroText").keypress(function(e) {
            if (e.which == 13) {
                NS_WK_RICHIESTE.gestioneWk(MAIN_INS_RICHIESTE.tipoRichiesta, $("#txtFiltroText").val());
                e.preventDefault();
            }
        });

        $("#cmbRepartoConsulenze").on("change", function() {
            MAIN_INS_RICHIESTE.Pagina.gestioneRepartoConsulenze($(this).find("option:selected"));
        });

        $("#butSeleziona").on("click", function() {
            MAIN_INS_RICHIESTE.ComboList.spacchettaRichieste();
        });

        $("textarea").live("select", function(){ MAIN_INS_RICHIESTE.Pagina.copySelection(); });

        //per determinare l'urgenza effettua i seguenti controlli
        /**
         * la prende da configurazione dell'albero    urgenza-default
         * se no la prende da cartella di PS
         *
         */
        $("#radRichieste").on("click", function(){
            var radHidden = $("#h-radRichieste").val();
            var hRadRichieste = $("#radRichieste").find("div[data-value='"+radHidden+"']").data("cod_cdc");

            var $destinatario = $(this).find(".RBpulsSel");

            //il laboratorio ha come urgenza per gli esami solo 0 e 2
            var radUrgenzaRichieste = $("#UrgenzaRichieste");

            radUrgenzaRichieste.find("div.RBpuls").show();

            //data-urgenza_default
           if($destinatario.data("urgenza_default")!='undefined' && $destinatario.data("urgenza_default")!='' ){
               MAIN_INS_RICHIESTE.urgenza =  $destinatario.data("urgenza_default")
           }else{
               //se no prendo quella generale del paziente
                if(MAIN_INS_RICHIESTE.hasAValue(home) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL.urgenza)){
                    MAIN_INS_RICHIESTE.urgenza = NS_WK_RICHIESTE.setUrgenza(home.PANEL.urgenza);
                }
           }

            /** @TODO Ora brasati i reparti , bruttissimo da fare configurabile sul albero di  CC_CONFIGURA_REPARTO */
            //se è laboratorio o consulenze nascono le urgenze 1e 3
            if(hRadRichieste==="LABO" || hRadRichieste==="CONSULENZE"){
                radUrgenzaRichieste.find("div[data-value='1']").hide();
                radUrgenzaRichieste.find("div[data-value='3']").hide();

            }

            radUrgenzaRichieste.find("div.RBpuls").removeClass("RBpulsSel");
            radUrgenzaRichieste.find("input[type=hidden]").val(MAIN_INS_RICHIESTE.urgenza);
            radUrgenzaRichieste.find("div[data-value="+MAIN_INS_RICHIESTE.urgenza+"]").addClass("RBpulsSel");

            if(!MAIN_INS_RICHIESTE.hasAValue(radUrgenzaRichieste.find("input[type=hidden]").val()))
            {
                home.NOTIFICA.warning({message: "Selezionare Urgenza", title: "Attenzione"});
            }
            else
            {
                if($destinatario.length){
                    function getDataAttributes(el) {
                        var data = {};
                        $.each(el.attributes, function(k,attr)
                        {
                            if (/^data-/.test(attr.name)) {
                                var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
                                    return $1.toLowerCase();
                                });
                                data[camelCaseName.toLowerCase()] = attr.value;
                            }
                        });
                        return data;
                    }

                    var dati_destinatario = getDataAttributes($destinatario[0]);

                    /* dati_destinatario sono del tipo :
                     {"tipo":"R","value":"Radiologia","iden_scheda":"","cod_cdc":"ALBEN","tipo_scelta_esame":"partiAnatomiche","descr":"Radiologia"}
                     */

                    /*temporaneo: allineare tutti i tipi scelta*/
                    if(dati_destinatario.tipo_scelta_esame){
                        MAIN_INS_RICHIESTE.Pagina.selezionaRadio($(this).find("div.RBpulsSel"));
                        NS_TIPOLOGIA_SCELTA_ESAME.check(dati_destinatario);
                    }else
                    {
                        if(MAIN_INS_RICHIESTE.hasAValue(hRadRichieste))
                        {
                            MAIN_INS_RICHIESTE.Pagina.selezionaRadio($(this).find("div.RBpulsSel"));
                        }
                    }
                } /*gestione click errata TAPULLO*/
            }
        });


        /* Aggiungo la riga selezionata del combo_list con un doppio click */
        $("#cmbRichSel").on("dblclick", function() {

            var elemento = $(this).find(":selected");

            if(MAIN_INS_RICHIESTE.hasAValue(elemento.attr("data-iden")))
            {


                MAIN_INS_RICHIESTE.aggiungiPrestazione({
                    IDEN: elemento.attr("data-iden"),
                    COD_DEC: elemento.attr("data-coddec"),
                    ESAME: elemento.attr("data-descr"),
                    LATERALITA: elemento.attr("data-lateralita"),
                    METODICA: elemento.attr("data-metodica"),
                    EROGATORE: elemento.attr("data-erogatore"),
                    COD_CDC: elemento.attr("data-cdc"),
                    IMPEGNATIVA: elemento.attr("data-numimpegnativa"),
                    URGENZA_IMPEGNATIVA: elemento.attr("data-urgimpegnativa"),
                    DATA_IMPEGNATIVA: elemento.attr("data-dataimpegnativa"),
                    TIPO_IMPEGNATIVA: elemento.attr("data-tipoimpegnativa"),
                    COD_ESENZIONE: elemento.attr("data-codesenzione"),
                    URGENZA: MAIN_INS_RICHIESTE.urgenza
                });

                elemento.remove();
            }
        });

        /* Al click creo il messaggio in json e lo mando con ajax al listener*/
        $(".butInvia").on("click", function() {

            if(!MAIN_INS_RICHIESTE.hasAValue(NS_INVIA_RICHIESTE.jsonRichieste))
            {
                home.NOTIFICA.warning({message: "Attenzione selezionare almeno una prestazione", title: "Error"});
                return false;
            }
            else
            {
                if(!NS_FENIX_SCHEDA.validateFields())
                {
                    logger.error("Validazione in errore non valido");
                    return false;
                }
                else if(NS_INVIA_RICHIESTE.jsonRichieste.length==0)
                {
                    home.NOTIFICA.warning({message: "Attenzione selezionare almeno una prestazione", title: "Error"});
                    return false;
                }
                else if (NS_INVIA_RICHIESTE.jsonRichieste.length>0)
                {
                    if(NS_INVIA_RICHIESTE.jsonRichieste != null)
                    {
                        NS_DATI_RICHIESTE.setAssigningAuthorityMittente("FENIX-PS");
                        NS_DATI_RICHIESTE.setRepartoMittente($("#hCodDec").val());
                        NS_DATI_RICHIESTE.setAssigningAuthorityDestinatario("WHALE");
                        NS_DATI_RICHIESTE.setVersione("2.5");
                        NS_DATI_RICHIESTE.setIdenAnag($("#hAnagIden").val());
                        NS_DATI_RICHIESTE.setCodiceFiscale($("#hAnagCodFisc").val());
                        NS_DATI_RICHIESTE.setCognome($("#hAnagCognome").val());
                        NS_DATI_RICHIESTE.setNome($("#hAnagNome").val());
                        NS_DATI_RICHIESTE.setDataNascita($("#hAnagDataNasc").val());
                        NS_DATI_RICHIESTE.setSesso($("#hAnagSesso").val());
                        NS_DATI_RICHIESTE.setIdenProvenienza($("#IDEN_PROVENIENZA").val());
                        NS_DATI_RICHIESTE.setNumNosologico(MAIN_INS_RICHIESTE.num_nosologico);
                        NS_DATI_RICHIESTE.setUrgenza("3");
                        NS_DATI_RICHIESTE.setUserIdenPer(home.baseUser.IDEN_PER);
                        NS_DATI_RICHIESTE.setDataOraMessaggio();
                        NS_DATI_RICHIESTE.setDataOraRegOrdine(moment().format("YYYYMMDDHHmmss")	+ ".000");
                        NS_DATI_RICHIESTE.setNumOrdine();
                        NS_DATI_RICHIESTE.setNumRichiesta();

                        NS_APPEND_RICHIESTE.addValueJSON();

                        home.NS_LOADING.showLoading({"timeout":"0","testo" : "INVIO RICHIESTA", "loadingclick" : function(){NS_LOADING.hideLoading();}});


                        NS_INVIA_RICHIESTE.processaRichieste();
                    }
                    else
                    {
                        home.NOTIFICA.warning({message:"PREMI IL PULSANTE SELEZIONA\nINSERISCI: QUESITO E GLI ALTRI DATI!!!!", title: "Error"});
                    }
                }
            }

        });
    },

    detectBaseUser: function () {

        if(home.baseUser.TIPO_PERSONALE === "I" || home.baseUser.TIPO_PERSONALE === "OST")
        {
            if(MAIN_INS_RICHIESTE.hasAValue(home) && MAIN_INS_RICHIESTE.hasAValue(home.CARTELLA) && MAIN_INS_RICHIESTE.hasAValue(home.CARTELLA.NS_REFERTO)&& MAIN_INS_RICHIESTE.hasAValue(home.CARTELLA.NS_REFERTO.wk_apertura)) {

                if(home.CARTELLA.NS_REFERTO.wk_apertura === 'LISTA_CHIUSI') {
                    $('.butInvia').remove();
                }

                else {
                    NS_PREFERITI_RICHIESTE.problemaPrincipale();
                }
            }

        }
        if(home.baseUser.TIPO_PERSONALE === "M")
        {
            $('#colWkSelezionati').hide();
            $('#colWkRichieste').css('width','100%');
            $('.butInvia').show();

            if((parent.$("#WK_APERTURA").val()==="LISTA_APERTI") && ($("#hUtenteResponsabile").val() != home.baseUser.IDEN_PER) ){
                $("button.butInvia").hide();
            }
        }
    },

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value) && ("undefined" !== typeof value) && ("null" !== value) && ("undefined" !== value));
    },

    /*******************************************************************
     **************************** PAGINA *******************************
     *******************************************************************/
    Pagina : {
        /**
         * A seconda del tipo_richiesta dell'erogatore selezionato carico la WK con parametri diversi e mostro pulsanti aggiuntivi.
         * C = consulenze, I = interne, R = tutte le altre.
         * @param radRichieste
         */
        selezionaRadio : function(radRichieste) {

            MAIN_INS_RICHIESTE.Pagina.cancellaTesto();
            MAIN_INS_RICHIESTE.Pagina.showHide(radRichieste);
            MAIN_INS_RICHIESTE.descr_reparto = radRichieste.attr("title");
            MAIN_INS_RICHIESTE.rep_destinazione = radRichieste.attr("data-cod_cdc");
            MAIN_INS_RICHIESTE.reparto = radRichieste.attr("data-cod_cdc");
            MAIN_INS_RICHIESTE.tipoRichiesta = radRichieste.data("tipo");
            MAIN_INS_RICHIESTE.idenScheda = radRichieste.attr("data-iden_scheda");

            switch (MAIN_INS_RICHIESTE.tipoRichiesta) {
                case 'R':
                    MAIN_INS_RICHIESTE.metodica = "%25";
                    MAIN_INS_RICHIESTE.corpo = null;
                    if(radRichieste.attr('data-descr') !== 'Radiologia') {
                        NS_WK_RICHIESTE.gestioneWk(MAIN_INS_RICHIESTE.tipoRichiesta, "");
                    }
                    break;
                case 'I':
                    MAIN_INS_RICHIESTE.metodica = "%25";
                    MAIN_INS_RICHIESTE.corpo = null;
                    NS_WK_RICHIESTE.gestioneWk(MAIN_INS_RICHIESTE.tipoRichiesta, "");
                    break;
                case 'C':
                    MAIN_INS_RICHIESTE.metodica = null;
                    MAIN_INS_RICHIESTE.corpo = null;
                    MAIN_INS_RICHIESTE.Pagina.gestioneStrutturaConsulenze(MAIN_INS_RICHIESTE.strutturaAttuale);
                    MAIN_INS_RICHIESTE.reparto = "";
                    NS_WK_RICHIESTE.gestioneWk(MAIN_INS_RICHIESTE.tipoRichiesta, "");
                    break;
                default:
                    logger.error("MAIN_INS_RICHIESTE.selezionaRadio : tipoRichiesta non definito");
                    break;
            }
        },
        /**
         * Funzione che mostra e nasconde i pulsanti aggiuntivi profili e filtri, a seconda della selezione del radio.
         * Se idenScheda e tipo_scelta_esame sono valorizzati non carica niente
         * @param radRichieste
         */
        showHide : function(radRichieste) {

            $("div.showHide").hide();

            if(!MAIN_INS_RICHIESTE.hasAValue(radRichieste.data("iden_scheda")) && (!MAIN_INS_RICHIESTE.hasAValue(radRichieste.data("tipo_scelta_esame"))))
            {
                switch (radRichieste.attr("data-tipo"))
                {
                    case 'R':
                        NS_PROFILI_RICHIESTE.loadButProfili(radRichieste.attr("data-cod_cdc"), $("#COD_CDC_PS").val(), MAIN_INS_RICHIESTE.urgenza);
                        break;
                    case 'I':
                        NS_FILTRI_RICHIESTE.loadButFiltri(radRichieste.attr("data-cod_cdc"), radRichieste.attr("data-tipo"), MAIN_INS_RICHIESTE.urgenza);
                        break;
                    case 'C':
                        $("#divRepartoCons").show();
                        break;
                    default:
                        logger.error("MAIN_INS_RICHIESTE.showHide : radRichieste is undefined");
                        break;
                }
            }
        },
        /**
         * Funzione che gestisce la struttura e i reparti delle consulenze.
         * Carico un determinato combo reparti a seconda della struttura selezionata.
         * @param strutturaSel
         */
        gestioneStrutturaConsulenze : function(strutturaSel) {
            MAIN_INS_RICHIESTE.Pagina.cancellaTesto();
            MAIN_INS_RICHIESTE.metodica = null;
            MAIN_INS_RICHIESTE.corpo = null;
            MAIN_INS_RICHIESTE.reparto = "";
            NS_WK_RICHIESTE.gestioneWk("C", "");
            var cmbRepConsulenze = $("#cmbRepartoConsulenze");

            cmbRepConsulenze.empty();

            if (MAIN_INS_RICHIESTE.hasAValue(strutturaSel)) {

                cmbRepConsulenze.append('<option value="" id="cmbRepartoConsulenze_"></option>');

                var db = $.NS_DB.getTool({setup_default:{datasource:'WHALE',async:false}});

                var params = {
                    "cod_cdc": $("#COD_CDC_PS").val()
                    , "tipoUtente": home.baseUser.TIPO_PERSONALE
                };

                var xhr = db.select({
                    id: "OE.Q_REPARTO_CONSULENZE",
                    parameter: params
                });

                xhr.done(function (data) {
                    if (data.result.length === 0) {
                        logger.debug("MAIN_INS_RICHIESTE.gestioneStrutturaConsulenze : Q_REPARTO_CONSULENZE nessun reparto");
                    } else {
                        $.each(data.result, function(k, v) {
                            var option = document.createElement("option");
                            option.className = "optionCons";
                            option.id = "cmbRepartoConsulenze_" + k;
                            option.innerHTML = v.DESCR;
                            option.value = v.VALUE;
                            option.setAttribute("data-struttura", v.STRUTTURA);
                            option.setAttribute("data-cdc", v.COD_CDC);
                            option.setAttribute("data-tipo", v.TIPO);
                            option.setAttribute("data-idenscheda", v.IDEN_SCHEDA);
                            option.setAttribute("data-urgenza_default", v.URGENZA_DEFAULT);
                            $("#cmbRepartoConsulenze").append(option);
                        });
                    }
                });

                xhr.fail(function (jqXHR) {
                    home.NOTIFICA.error({message: "Attenzione errore nella chiamata PS_TERAPIE.DUPLICATERAPIA", title: "Error"});
                    logger.error("Errore in OE.Q_REPARTO_CONSULENZE jqXHR " +  JSON.stringify(jqXHR));
                });
            }
        },

        /**
         * Funzione che passa il nuovo reparto selezionato dal combo alla wk aggiornandola
         * @param repartoCons
         */
        gestioneRepartoConsulenze : function(repartoCons) {
            MAIN_INS_RICHIESTE.metodica = null;
            MAIN_INS_RICHIESTE.corpo = null;
            MAIN_INS_RICHIESTE.idenScheda = repartoCons.attr("data-idenscheda");
            MAIN_INS_RICHIESTE.reparto = repartoCons.attr("data-cdc");
            MAIN_INS_RICHIESTE.rep_destinazione = repartoCons.attr("data-cdc");
            MAIN_INS_RICHIESTE.tipoRichiesta = repartoCons.attr("data-tipo");

            NS_WK_RICHIESTE.gestioneWk("C", "");
        },

        /**
         * copia il testo selezionato in da una textarea ad un'altra
         */
        copySelection: function(){
            var text = "";

            if (window.getSelection) {
                text = window.getSelection().toString();
            }

            $("textarea").on("dblclick",function(){
                $(this).val(text);
            })
        },

        /**
         * Cancella il contenuto del filtroText.
         */
        cancellaTesto : function() {
            $("#txtFiltroText").val("");
        },

        /**
         * Controllo il campo catena dei dati amministrativi, se e' valorizzato inserisco un messaggio di allerta.
         */
        alertAlcol : function() {
            var catena = $("#hCatena").val();
            var wkApertura = $("#WK_APERTURA").val();
            var esamiForensi = $("#hEsamiForensi").val();

            if ((MAIN_INS_RICHIESTE.hasAValue(catena)) && (home.PANEL.catenaCustodia !== 'S') && (wkApertura!=="ANAGRAFICA" && wkApertura!=="LISTA_ATTESA") && (esamiForensi!=="S") ) {
                $("#lblTitolo").append("<span style='color: rgb(255, 255, 0);' id='lblAlertAlcol'>ATTENZIONE : INSERIRE ESAMI TOSSICOLOGICI E/O ALCOOLEMICI</span>");
                $('#lblAlertAlcol').css({'position': 'absolute', 'right': '10px'});
            }
        }
    },
    /*******************************************************************
     **************************** COMBO LIST ***************************
     *******************************************************************/
    ComboList : {
        /**
         * Funzione che controlla se e gia presente o meno una prestazione nel combo_list.
         * @param iden (iden dell'esame di tab_esa)
         * @param urgenza (tab_esa_reparto)
         * @param metodica (metodica di tab_esa)
         * @param cod_cdc (centri di costo)
         * @param descr ( tab esa)
         * @param descr_reparto (cdc)
         * @param cod_dec (cod dec di centri di costo)
         * @param cod_esa (codice esame)
         */
        controlloComboList : function(iden, urgenza, metodica,cod_cdc, descr, descr_reparto, cod_dec, cod_esa) {

            var combolist = $("#cmbRichSel");
            var booleanControl = false;

            if (combolist.find("option").length === 0) {
                booleanControl = true;
            } else {
                $(combolist.find("option")).each(function() {
                    var thisCodEsaCombo = $(this).attr("data-codesa");
                    var thisRepartoCombo = $(this).attr("data-cdc");

                    if ((thisCodEsaCombo === cod_esa)&&(thisRepartoCombo === cod_cdc)) {
                        booleanControl = false;
                        return booleanControl;
                    } else {
                        booleanControl = true;
                        return booleanControl;
                    }
                });
            }
            if (booleanControl === true) {
                var option = document.createElement("option");
                option.className = "optionRow";
                option.innerHTML = descr + "\t-\t" + descr_reparto;
                option.setAttribute("data-iden", iden);
                option.setAttribute("data-urgenza", urgenza);
                option.setAttribute("data-descr", descr);
                option.setAttribute("data-metodica", metodica);
                option.setAttribute("data-coddec", cod_dec);
                option.setAttribute("data-cdc", cod_cdc);
                option.setAttribute("data-codesa", cod_esa);
                option.setAttribute("data-erogatore", descr_reparto);
                option.setAttribute("data-numimpegnativa", "");
                option.setAttribute("data-urgimpegnativa", "");
                option.setAttribute("data-tipoimpegnativa", "");
                option.setAttribute("data-dataimpegnativa", "");
                option.setAttribute("data-codesenzione", "");
                option.setAttribute("data-lateralita", "");

                combolist.append(option);
            }
        },

        /**
         * Cicla tutte le option inserite e crea un json con doc_dec, cod_cdc, e iden_esa.
         * Il json è suddiviso sia per CDC che per METODICA.
         */
        spacchettaRichieste : function() {

            var combolist = $("#cmbRichSel");

            $(combolist.find("option")).each(
                function() {
                    MAIN_INS_RICHIESTE.aggiungiPrestazione({
                        IDEN: $(this).attr("data-iden"),
                        COD_DEC: $(this).attr("data-coddec"),
                        ESAME: $(this).attr("data-descr"),
                        LATERALITA: $(this).attr("data-lateralita"),
                        METODICA: $(this).attr("data-metodica"),
                        EROGATORE: $(this).attr("data-erogatore"),
                        COD_CDC: $(this).attr("data-cdc"),
                        IMPEGNATIVA: $(this).attr("data-numimpegnativa"),
                        URGENZA_IMPEGNATIVA: $(this).attr("data-urgimpegnativa"),
                        DATA_IMPEGNATIVA: $(this).attr("data-dataimpegnativa"),
                        TIPO_IMPEGNATIVA: $(this).attr("data-tipoimpegnativa"),
                        COD_ESENZIONE: $(this).attr("data-codesenzione"),
                        URGENZA: MAIN_INS_RICHIESTE.urgenza
                    });

                    $(this).remove();
                }
            );
        }
    },

    /**
     * Aggiuinge richieste o prestazioni al json delle richieste NS_INVIA_RICHIESTE.jsonRichieste
     * @param input
     */
    aggiungiPrestazione: function(input){

        var item = {};

        MAIN_INS_RICHIESTE.valorizeJsonQuesiti();

        if (NS_INVIA_RICHIESTE.jsonRichieste == null){ NS_INVIA_RICHIESTE.jsonRichieste = []; }

        if(MAIN_INS_RICHIESTE.hasAValue(home) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO)&& MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "R";
        }


        /* Il primo inserimento, inserisce senza controlli */
        if ( NS_INVIA_RICHIESTE.jsonRichieste.length === 0  ) {

            MAIN_INS_RICHIESTE.valorizeJsonRichiesta(input);

        /*  Per ogni altro caso successivo al I, controllo i cdc e le metodiche*/
        } else {

            var booleanPush = false;

            for ( var i = 0; i < NS_INVIA_RICHIESTE.jsonRichieste.length; i++) {
                /* Se esiste gia un segmento con lo stesso cdc e la stessa metodica e stessa urgenza allora inserisco solo un nuovo esame */

                if (NS_INVIA_RICHIESTE.jsonRichieste[i].COD_DEC == input.COD_DEC
                    && NS_INVIA_RICHIESTE.jsonRichieste[i].METODICA == input.METODICA
                    && NS_INVIA_RICHIESTE.jsonRichieste[i].URGENZA == input.URGENZA)
                {
                    /* controllo per non inserire piu volte lo stesso esame */
                    var booleanEsame = true;

                    for(var j = 0; j < NS_INVIA_RICHIESTE.jsonRichieste[i].ESAMI.length;  j++)
                    {
                        if(NS_INVIA_RICHIESTE.jsonRichieste[i].ESAMI[j].IDEN_ESA == input.IDEN)
                        {
                            booleanEsame = false;
                            booleanPush = true;
                        }
                    }

                    if(booleanEsame )
                    {
                        item["IDEN_ESA"] = input.IDEN;
                        item["ESAME"] = input.ESAME;
                        item["METODICA"] = input.METODICA;
                        item["URGENZA"] = input.URGENZA;
                        item["LATERALITA"] = "";
                        item["IMPEGNATIVA"] =  "";
                        item["URGENZA_IMPEGNATIVA"] =  "";
                        item["DATA_IMPEGNATIVA"] =  "";
                        item["TIPO_IMPEGNATIVA"] =  "";
                        item["COD_ESENZIONE"] = "";

                        NS_INVIA_RICHIESTE.jsonRichieste[i].ESAMI.push(item);

                        booleanPush = true;

                        i = NS_INVIA_RICHIESTE.jsonRichieste.length;
                    }

                }
            }
            /* Se non esiste ancora quel cdc o quella metodica inserisco un nuovo segmento */
            if (!booleanPush) {

                MAIN_INS_RICHIESTE.valorizeJsonRichiesta(input);
            }
        }

        NS_APPEND_RICHIESTE.creaTrTable(NS_INVIA_RICHIESTE.jsonRichieste);
        $("button.butInvia").show();
    },

    /**
     * Valorizza il json con l'id delle textaree e il relativo contenuto
     */
    valorizeJsonQuesiti : function(){
        MAIN_INS_RICHIESTE.jsonQuesito ={
            quesiti : []
        };

        $("#colAltriDati").find("textarea").each(function(){

            MAIN_INS_RICHIESTE.jsonQuesito.quesiti.push({
                "id" : $(this).attr("id"),
                "val" :  $(this).val()
            });

        });
    },

    /**
     * Valorizza la richiesta con i dati relativi
     * @param input
     */
    valorizeJsonRichiesta : function(input){
        var itemRchiesta = {};

        itemRchiesta["COD_DEC"] = input.COD_DEC;
        itemRchiesta["METODICA"] = input.METODICA;
        itemRchiesta["EROGATORE"]= input.EROGATORE;
        itemRchiesta["COD_CDC"] = input.COD_CDC;
        itemRchiesta["TIPO"] = MAIN_INS_RICHIESTE.tipoRichiesta;
        itemRchiesta["URGENZA"] = input.URGENZA;
        itemRchiesta["QUESITO"] ="";
        itemRchiesta["QUADRO"] = null;
        itemRchiesta["NOTE"] = null;
        itemRchiesta["DATA_PROPOSTA"] = null;
        itemRchiesta["ORA_PROPOSTA"] = null;
        itemRchiesta["ESAMI"] = [];
        itemRchiesta["ESAMI"].push({
            "IDEN_ESA" : input.IDEN,
            "ESAME" : input.ESAME,
            "LATERALITA" : "",
            "METODICA" : input.METODICA,
            "URGENZA" : input.URGENZA,
            "IMPEGNATIVA": "",
            "URGENZA_IMPEGNATIVA" :  "",
            "DATA_IMPEGNATIVA" : "",
            "TIPO_IMPEGNATIVA" :  "",
            "COD_ESENZIONE" : ""
        });

        NS_INVIA_RICHIESTE.jsonRichieste.push(itemRchiesta);
    },

    /**
     * Cicla su tutte le richieste epr trovare il singolo esame ed eliminarlo. Se la richiesta rimane vuota, la elimina
     * @param parameters {COD_DEC,METODICA,IDEN_ESA,callback}
     */
    rimuoviPrestazione: function(parameters){

        for ( var i = 0; i < NS_INVIA_RICHIESTE.jsonRichieste.length; i++) {

            if (NS_INVIA_RICHIESTE.jsonRichieste[i].COD_DEC === parameters.COD_DEC
                && NS_INVIA_RICHIESTE.jsonRichieste[i].METODICA === parameters.METODICA) {

                for(var j=0; j < NS_INVIA_RICHIESTE.jsonRichieste[i].ESAMI.length; j++){

                    if(NS_INVIA_RICHIESTE.jsonRichieste[i].ESAMI[j].IDEN_ESA === parameters.IDEN_ESA){
                        NS_INVIA_RICHIESTE.jsonRichieste[i].ESAMI.splice(j, 1);
                        NS_APPEND_RICHIESTE.deleted = 'S';
                        NS_APPEND_RICHIESTE.iden_esame_delete = parameters.IDEN_ESA;

                        if (NS_INVIA_RICHIESTE.jsonRichieste[i].ESAMI.length == 0)
                        {
                           NS_INVIA_RICHIESTE.jsonRichieste.splice(i,1);

                        }

                        parameters.callback();

                        return;
                    }
                }

            }
        }
        if(NS_INVIA_RICHIESTE.jsonRichieste.length == 0){
            if(MAIN_INS_RICHIESTE.hasAValue(home) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO)&& MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
                home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
            }

        }
    }
};

var NS_TIPOLOGIA_SCELTA_ESAME = {

    check : function(dati){

        if(dati.tipo_scelta_esame)
        {
            NS_TIPOLOGIA_SCELTA_ESAME[dati.tipo_scelta_esame].init(dati);
        }
    },

    partiAnatomiche : {
        init:function(dati){
            var url = "page?KEY_LEGAME=SCHEDA_PARTI_ANATOMICHE";
            url += "&COD_CDC_PS="+$("#COD_CDC_PS").val();
            url += "&DESTINATARIO="+dati.cod_cdc;
            url += "&URGENZA="+MAIN_INS_RICHIESTE.urgenza;
            url += "&TIPO="+dati.tipo;
            url += "&TEMPLATE=URGENZA_RICHIESTE/UrgenzaRichiesta.ftl";

            home.NS_FENIX_TOP.apriPagina({'url':url,'fullscreen':true});
        }

    }

};