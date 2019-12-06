/**
 * User: graziav, alessandroa
 * Date: 05/09/2013
 * Time: 14:00
 *
 * 20140415 - Gestione Priorita Diagnosi ICD
 */


/**
 * Spostato Init in File dedicato InitGestioneDSA per gestione funzione attiva.
 */

//NS_FENIX_PRINT.stampa({'STAMPANTE': 'nomestampante', 'CONFIG': '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}'});

var firstLoad = true;
var jsonDati = null;
var onereDefault = "SSN";
var prioritaDefault = "P";
var primoAccessoDefault ="S";
var _STATO_PAGINA = null;
var _JSON_CONTATTO = null;
var _FUNZIONE_ATTIVA = null;
var _IDEN_ANAG = null;
var _LETTERA_FIRMATA = null;
//var _REGIME_DSA = null;
//var _TIPO_DSA = null;
var IDEN_CONT=null;
var CODICE_FISCALE=null;
var  NS_GESTIONE_DSA = {

    wkPrestazioni:null,
    wkRicette:null,
    wkAccessi:null,
    wkRichieste:null,
    tipologia:null,
    idContatto : null,
    numNosologico : null,
    idContattiAss : null,
    idContattiGiu : null,
    listIdAccertamenti:null,

    init:function(){

        CODICE_FISCALE  = jsonData.txtCodFisc=='undefined'?$("#CODICE_FISCALE").val():jsonData.txtCodFisc;
        NS_REGISTRA_FIRMA.Dati.getRegimeTipo();
        $("#txtEsenzioniScelte").hide();
        NS_FENIX_SCHEDA.addFieldsValidator({config:"V_ADT_GESTIONE_DSA"});
        NS_GESTIONE_DSA.Style.showHideButtonModuloDiagnosi();
        IDEN_CONT=$("#IDEN_CONT").val();

        if (IDEN_CONT != null){
            // Modifica
            _JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(IDEN_CONT);
            NS_GESTIONE_DSA.idContatto = IDEN_CONT;
            NS_GESTIONE_DSA.Events.HL7Event = 'A08';
            NS_GESTIONE_DSA.aggiornaPagina(_JSON_CONTATTO);
            NS_GESTIONE_DSA.caricaDatiLettera('LetteraAperturaDSA');
            NS_GESTIONE_DSA.caricaDatiLettera('LetteraChiusuraDSA');
            testAccertamentiDSA();
            NS_REGISTRA_FIRMA.Lettera.getLetteraFirmata();
            NS_REGISTRA_FIRMA.Lettera.getProgressivoLettera();
            NS_REGISTRA_FIRMA.Lettera.getLetteraCorrente();
            //$("#txtAnamnesi").trigger('blur');
        }
        else
        {
            // Inserimento
            NS_GESTIONE_DSA.Events.HL7Event = 'A01';

            $("#txtDataAperturaDSA").val(moment().format('DD/MM/YYYY'));
            $("#h-txtDataAperturaDSA").val(moment().format('YYYYMMDD'));

            $("#txtOraAperturaDSA").val(moment().format('HH:mm')).attr("readonly","readonly");

            if (home.baseUser.TIPO_PERSONALE=='M'){
                $("#h-txtCaseManager").val(home.baseUser.IDEN_PER);
                $("#txtCaseManager").val(home.baseUser.DESCRIZIONE);
            }
        }

        // default tipo e priorit? ricetta
        $("#cmbTipoRicetta").val(onereDefault);
        $("#cmbPrioritaRicetta").val(prioritaDefault);
        $("#cmbPrimoAccesso").val(primoAccessoDefault);
        $("#idEsenzioniPaziente").find("tr:eq(1) td:eq(1)").attr("colspan","3");

        NS_GESTIONE_DSA.Style.showHideButtonFirma();
        NS_GESTIONE_DSA.setIntestazione();
        caricaComboStampanti();
        NS_GESTIONE_DSA.hideAndShow($("#divDatiLabo"),$("#divwkReferti")); // per visualizzare correttamente i pulsanti in fondo alla pagina di chiusura

    },

    /**
     * Funzione invocata in fase di generazione ricetta.
     * In base all'oggetto passato verifica se sono stati compilati i campi obbligatori
     * e restituisce l'oggetto ("accertamento") che deve essere passato alla funzione di salvataggio.
     *
     * @param obj corrisponde alla ROW della WK
     * @returns {"success" : boolean, "accertamento" : {}}
     */
    valorizzaOggettoPrestazione : function(obj){

        logger.debug("Genera Ricetta - Check Valorizzazione Prestazione " + obj.CODICE_MINISTERIALE);

        var _abilitaLorenzin = home.baseGlobal.ABILITA_LORENZIN;
        var notaAppropriatezza = "";
        var _objAccertamento = {
            "cod_accertamento" : obj.CODICE_PRESTAZIONE,
            "accertamento" : obj.PRESTAZIONE,
            "cod_esenzione" : $("#sel-esenzione-" + obj.N_ROW + " option:selected").val(), // getEsenzione(obj.N_ROW),
            "data" : moment($("#h-txtDataAperturaDSA").val(), 'YYYYMMDD') > moment() ? $("#h-txtDataAperturaDSA").val() : moment().format('YYYYMMDD'),
            "forzatura":"R"
        };

        if ("S" === _abilitaLorenzin && obj.ID_NOTA != null && obj.ID_NOTA !== "") {

            var xmlDoc = $.parseXML(obj.XML_CONDIZIONI_INDICAZIONI);
            var isCondizionePrevista = false;
            var isIndicazionePrevista = false;
            var isCondizioneSelezionata = false;
            var isIndicazioneSelezionata = false;

            $("ROWSET > ROW", xmlDoc).each(function () {
                switch ($(this).attr("tipo_nota")) {
                    case "IND" :
                        isIndicazionePrevista = true;
                        break;
                    case "CON" :
                        isCondizionePrevista = true;
                        break;
                }
            });

            var tipoNotaSelezionata = $("#sel-ind-cond-" + obj.N_ROW + " option:selected").closest("optgroup").attr("categoria");
            isCondizioneSelezionata = tipoNotaSelezionata === "CON";
            isIndicazioneSelezionata = tipoNotaSelezionata === "IND";

            var isPatologiaPrevista = (obj.GENETICA !== null && obj.GENETICA !== "");
            var isPatologiaSelezionata = $("#ac-patologie-prest-" + obj.N_ROW).val() != null && $("#ac-patologie-prest-" + obj.N_ROW).val() !== "";

            logger.debug("Genera Ricetta - Check Valorizzazione Prestazione - tipoNotaSelezionata -> " + tipoNotaSelezionata + ", isCondizionePrevista -> " + isCondizionePrevista + ", isIndicazionePrevista -> " + isIndicazionePrevista + ", isPatologiaPrevista -> " + isPatologiaPrevista + ", isPatologiaSelezionata -> " + isPatologiaSelezionata);

            if (isCondizionePrevista && !isCondizioneSelezionata) {
                home.NOTIFICA.error({
                    message: 'Valorizzare la condizione di erogbilit&agrave; per la prestazione ' + obj.PRESTAZIONE,
                    timeout: 3,
                    title: 'Errore'
                });
                return {"success": false, "accertamento": null};
            } else if (isCondizionePrevista && isCondizioneSelezionata && isPatologiaPrevista && !isPatologiaSelezionata) {
                home.NOTIFICA.error({
                    message: 'Valorizzare la patologia per la prestazione ' + obj.PRESTAZIONE,
                    timeout: 3,
                    title: 'Errore'
                });
                return {"success": false, "accertamento": null};
            }

            var notaAppropriatezza = tipoNotaSelezionata + "-" + obj.ID_NOTA + "-" + $("#sel-ind-cond-" + obj.N_ROW + " option:selected").val().split("-")[1];
            notaAppropriatezza += isPatologiaPrevista ? "-" + $("#ac-patologie-prest-" + obj.N_ROW).attr("data-c-value") : "";

            _objAccertamento.id_nota_appropriatezza = notaAppropriatezza;

            logger.debug("Genera Ricetta - Check Valorizzazione Prestazione - notaAppropriatezza -> " + notaAppropriatezza);
        }

        var _modelAccertamento = getModel();

        $.extend(_modelAccertamento, _objAccertamento);

        logger.debug("Genera Ricetta - Check Valorizzazione Prestazione - Oggetto Accertamento -> " + JSON.stringify(_modelAccertamento));

        return {"success" : true, "accertamento" : _modelAccertamento};
    },

    Style : {

        showHideButtonModuloDiagnosi : function(){

            if (_STATO_PAGINA == 'I')
            {
                $('#butModuloDiagnosi').hide();
            }
            else
            {
                $('#butModuloDiagnosi').click(function(){NS_FUNZIONI.stampaModuloDiagnosi();}).show();
            }
        },

        showHideButtonSalva : function(){

            // alert('showHideButtonSalva _FUNZIONE_ATTIVA: ' + _FUNZIONE_ATTIVA + '\n_LETTERA_FIRMATA: ' + _LETTERA_FIRMATA);
            if (_LETTERA_FIRMATA && _FUNZIONE_ATTIVA == 'LetteraChiusuraDSA'){
                $('.butSalva').hide();
            }else{
                $('.butSalva').show();
            }

        },

        showHideButtonFirma : function(){

            // alert('showHideButtonFirma _FUNZIONE_ATTIVA:' + _FUNZIONE_ATTIVA);
            if (_FUNZIONE_ATTIVA == 'LetteraChiusuraDSA'){
                $('.butFirma').show();
            }else{
                $('.butFirma').hide();
            }

        },
        showHideTabDimissione : function(){
            if (_STATO_PAGINA == 'I'){
                $('#li-tabChiusuraDSA').hide();
                $('#li-tabChiusuraDSA').prev().css({"border-top-right-radius" : "6px"});
            }

        }
    },
    setIntestazione : function(){
        toolKitDB.getResultDatasource("TAB.Q_INTESTAZIONE_PAZIENTE","ADT",{"iden":$('#IDEN_ANAG').val()},null,function(response){
            $.each(response,function(k,v){$('#lblTitolo').html(v.COGNOME + ' ' + v.NOME + ' - ' + v.SESSO + ' - ' + v.DATA_NASCITA + ' - ' + v.CODICE_FISCALE);});
        });
    },
    Events :{

        HL7Event : null,
        ICDEvent : 'A03',

        setEvents: function(){

            _IDEN_ANAG = $('#IDEN_ANAG').val();


            $('#butDocumenti').click(function(){
                NS_FUNZIONI.apriVisualizzatore();
            });

            $('#butIPatient').click(function(){
                NS_FUNZIONI.apriIpatient();
            });

            $('#butDatiLaboratorio').click(function(){
                NS_FUNZIONI.apriDatiLaboratorio();
            });

            $("#cmbTipologiaDSA").change(function(){
                NS_GESTIONE_DSA.tipologia = $("#cmbTipologiaDSA option:selected").attr("data-codice");
            }),
                $("#li-tabRichiesteAccessi").click(function(){
                    // WK RICHIESTE DSA
                    if (!NS_GESTIONE_DSA.wkRichieste){
                        $("div#wkRichiesteDSA").css({'height':'200'});
                        NS_GESTIONE_DSA.wkRichieste=new WK({
                            id:"ADT_WK_RICHIESTE_DSA",
                            container: "wkRichiesteDSA",
                            aBind : ["numNoso"],
                            aVal : [NS_GESTIONE_DSA.numNosologico],
                            load_callback: null,
                            loadData:true
                        });
                        NS_GESTIONE_DSA.wkRichieste.loadWk();
                    }
                    else{
                        NS_GESTIONE_DSA.wkRichieste.filter({
                        	 aBind : ["numNoso"],
                             aVal : [NS_GESTIONE_DSA.numNosologico]
                        });
                    }
                    // WK ACCESSI DSA
                    if (!NS_GESTIONE_DSA.wkAccessi){
                        $("div#wkAccessiDSA").css({'height':'140'});
                        NS_GESTIONE_DSA.wkAccessi=new WK({
                            id:"ADT_WK_ACCESSI_DSA",
                            container: "wkAccessiDSA",
                            //aBind : ["idenContatto","progressivo"],
                            aBind : ["idenContatto"],
                            //aVal : [NS_GESTIONE_DSA.idContatto, NS_GESTIONE_DSA.tipologia],
                            aVal : [NS_GESTIONE_DSA.idContatto],
                            load_callback: loadAccessi.after,
                            loadData:true
                        });
                        NS_GESTIONE_DSA.wkAccessi.loadWk();
                    }
                    else{
                        NS_GESTIONE_DSA.wkAccessi.filter({
                            aBind : ["idenContatto","progressivo"],
                            aVal : [NS_GESTIONE_DSA.idContatto, NS_GESTIONE_DSA.tipologia]
                        });
                    }
                }),
                $("#li-tabPrestDSA").click(function(){
                    // controllo salvataggio contatto eseguito
                    if (NS_GESTIONE_DSA.idContatto==null){
                        //alert("Salvare i dati prima di inserire prestazioni e ricette");
                    	home.NOTIFICA.error({message: 'Salvare i dati prima di inserire prestazioni e ricette!', timeout: 3, title: 'Error'});
                        $("#li-tabDSA").trigger('click');
                        return;
                    }
                    // WK PRESTAZIONI DSA
                    if (!NS_GESTIONE_DSA.wkPrestazioni ){
                        $("div#wkPrestDSA").css({
                            'height':'250'
                        });

                        initWkPrestazioni();
                    }
                    else{
                        /*NS_GESTIONE_DSA.wkPrestazioni.filter({
                            aBind : ["codTipologiaDSA","idenContatto"],
                            aVal : [NS_GESTIONE_DSA.tipologia,NS_GESTIONE_DSA.idContatto]
                        });*/
                    	NS_GESTIONE_DSA.wkPrestazioni.refresh();
                    }
                    // WK RICETTE DSA
                   if (!NS_GESTIONE_DSA.wkRicette){
                        $("div#wkRicetteDSA").css({'height':"200"});
                       initWkRicette();
                    }
                    else{
                        /*NS_GESTIONE_DSA.wkRicette.filter({
                            aBind : ["idenContatto"],
                            aVal : [NS_GESTIONE_DSA.idContatto]
                        });*/
                    	NS_GESTIONE_DSA.wkRicette.refresh();
                    }
                    setMedicoRicette();
                }),

                $("#butSelTutte").click(function(){
                    //var rec;
                    $("#wkPrestDSA table tr").each(function(i){
                    	if (i>0){
                    		//rec = NS_GESTIONE_DSA.wkPrestazioni.getRow(i-1);
                            //if (rec.IDEN_ACCERTAMENTO==null){
                                if (!$(this).hasClass('rowSel clsSel')){
                                    $(this).trigger('click');
                                }
                           // }
                    	}
                    });
                }),

                $("#butGeneraRicette").click(function(){

                	var data_rice;
					var data_dsa;
                    // controllo tipo e priorit? ricetta

                    if ($("#cmbTipoRicetta").val()=="" || $("#cmbPrioritaRicetta").val()=="") {
                        //alert("E' obbligatorio indicare tipo e priorita' ricetta");
                    	home.NOTIFICA.error({message: "Sono obbligatori tipo e priorita' ricetta!", timeout: 3, title: "Error"});
                        return;
                    }
                    var diagnosi = null;

                    if ($("#txtSospettoDia").val()!=""){
                        diagnosi=$("#txtSospettoDia").val();
                    } else {
                    	home.NOTIFICA.error({message: "E' obbligatorio indicare il sospetto diagnostico!", timeout: 3, title: "Error"});
                        return;
                    }
                    if($("#h-txtMedicoRicette").val()==""){
                        //alert("Indicare il medico prescrittore delle ricette");
                    	home.NOTIFICA.error({message: "Indicare il medico prescrittore delle ricette!", timeout: 3, title: "Error"});
                        return;
                    }
                    if ($("#cmbPrimoAccesso").val()==""){
                        //alert("Indicare se primo accesso o no ");
                    	home.NOTIFICA.error({message: "Indicare se primo accesso o no!", timeout: 3, title: "Error"});
                        return;
                    }
                    // data ricetta
					data_rice=moment().format('YYYYMMDD');
					// data dsa
                    if (moment($("#h-txtDataAperturaDSA").val(),'YYYYMMDD') > moment()){
                    	data_dsa=$("#h-txtDataAperturaDSA").val();
                    }
                    else{
                    	data_dsa=moment().format('YYYYMMDD');
                    }

                    var ricetta = {
                        "tipo_ricetta": "ACCERTAMENTI",
                        "iden_anag": _IDEN_ANAG,
                        "iden_utente": home.baseUser.IDEN_PER,
                        "iden_med_base": home.baseUser.IDEN_PER,
                        "iden_med_prescr": $("#h-txtMedicoRicette").val(),
                        "urgenza": $("#cmbPrioritaRicetta").val(),
                        "accertamento": [],
                        "iden_accesso": NS_GESTIONE_DSA.idContatto,
                        "diagnosi": diagnosi,
                        "primo_accesso":$("#cmbPrimoAccesso").val()=='S' ? '1' : '2',
                        "INVIO_PACKAGE": "S",
                        "rootNode": "ricetta",
                        "SITO":"ADT_DSA",
                        "onere":$("#cmbTipoRicetta").val(),
                        "data_ricetta":data_rice
                    };

                    var aPrest = NS_GESTIONE_DSA.wkPrestazioni.getArrayRecord();
                    var aJsonPrest = new Array();

                    for (var i = 0; i < aPrest.length; i++){

                        var _objAccertamento = NS_GESTIONE_DSA.valorizzaOggettoPrestazione(aPrest[i]);

                        if (_objAccertamento.success){
                            ricetta.accertamento.push(_objAccertamento.accertamento);
                        } else {
                            return;
                        };
                    }

                    logger.debug("Genera ricetta - oggetto passato alla procedura: " + JSON.stringify(ricetta));

                    toolKitDB.json2xmlProcedureDatasource(
                        "MMG.RR_SALVA_PRESCRIVI",
                        "WHALE",
                        JSON.stringify(ricetta),
                         function(resp){
                             logger.debug(JSON.stringify(resp));

                             if(resp["result"] === 'KO'){
                                 home.NOTIFICA.error({message: 'Attenzione, errore nella generazione ricette', timeout: 3, title: 'Error'});

                             } else {
                                 home.NOTIFICA.success({message: 'Generazione ricette eseguita!', timeout: 3, title: 'Success'});
                                 initWkRicette();
                                 initWkPrestazioni();
                             }
                         }
                    );

                }),

                $("#lstEsenzioniScelte").dblclick(function(){
                    var ese = document.getElementById("lstEsenzioniScelte");
                    for (var i=0; i<ese.length; i++){
                        if (ese[i].selected){
                            ese[i].remove();
                        }
                    }
                }),

                $("#butStampaRicette").click(function(){
                     var report = "PRESTAZIONI_A4";
                    var prompts;
                    var print_params;
                    var conferma_param;
                    var nomeStampante=$("#cmbStampanti").val();
                    //alert(nomeStampante);
                    /*if (nomeStampante==""){
                        alert("Stampante non configurata per questo PC");
                        return;
                    }*/
                    var aRicette=NS_GESTIONE_DSA.wkRicette.getRows();
                    for (var i=0; i<aRicette.length; i++){
                    	 var par = {};
                    	 par.PRINT_DIRECTORY = 'DSA';
                    	 par.PRINT_REPORT= report;
                         if (aRicette[i].STAMPATO=="N" || aRicette[i].NUMERO_POLIGRAFO==null){
                            par.PRINT_PROMPT="&promptpIdenTestata=" + aRicette[i].IDEN;
                            par.STAMPANTE = nomeStampante;
                          //par.CONFIG='{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[11.0,0.0,13.0,200.0],4]}]}';
							//par.CONFIG='{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[11.0,0.0,13.0,190.0],4]}]}';
                            par.CONFIG=LIB.getParamPcGlobal('STAMPANTE_RICETTA_ROSSA_OPZIONI','{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[11.0,0.0,13.0,190.0],4]}]}');
                            logger.debug("Stampa : parametri" +  JSON.stringify(par));
                            home.NS_FENIX_PRINT.caricaDocumento(par);
                            home.NS_FENIX_PRINT.stampa(par);
                            /*conferma_param={
                                    "p_tipo_ricetta":"P",
                                    "p_iden_ricetta":aRicette[i].IDEN
                                };  */
                            conferma_param={
                                    "p_iden_ricetta":aRicette[i].IDEN
                                };
                            dwr.engine.setAsync(false);
                            toolKitDB.executeProcedureDatasource("MMG.RR_CONFERMA", "WHALE", conferma_param, function(resp){
                            	initWkRicette();
                            });
                            dwr.engine.setAsync(true);
                        }
                    }

                }),

                $("#butRegistraCodiceRicetta").click(function(){
                    var rec;
                    var sIden='';
                    var sNumeri='';
                    var tableTr=$("#wkRicetteDSA table tr");
                    var aNumPoli=new Array();
                    tableTr.each(function(i){
                    	if (i>0){
                    		numRic=$(this).find('input.clsNumPoligrafo');
                    		if(numRic.val()!=undefined && numRic.val()!=''){

                            		if (aNumPoli.indexOf(numRic.val()) >=0) {
	                            		home.NOTIFICA.error({message: "N. poligrafo "+numRic.val()+" gia' presente", timeout:6, title: "Error"});
	                            		return;
                            		}
                            		if (!testRicettaValida(numRic.val())) {
                            			return;
                            		}

                                rec=NS_GESTIONE_DSA.wkRicette.getRow(i-1);
                                if (sIden==''){
                                    sIden+=rec.IDEN;
                                    sNumeri+=numRic.val();
                                }
                                else{
                                    sIden+=','+rec.IDEN;
                                    sNumeri+=','+numRic.val();
                                }
                                aNumPoli.push(numRic.val());
                            }
                            else{
                            	rec=NS_GESTIONE_DSA.wkRicette.getRow(i-1);
                            	aNumPoli.push(rec.NUMERO_POLIGRAFO);
                            }
                    	}
                    });
                    if (sIden!=''){
                        UpdateCodiceRicette(sIden,sNumeri);

                    }
                }),

                $("#txtDataRiceIniDSA").on({"change":function(){
                    NS_GESTIONE_DSA.checkDataRicettaDSA(this.value, this.getAttribute("id"));
                },"blur":function(){
                    NS_GESTIONE_DSA.checkDataRicettaDSA(this.value, this.getAttribute("id"));
                }});

                $("#cmbReparto").change(function(){
                    var idenReparto=$("#cmbReparto").val();
                    changeTipologiaDSA(idenReparto);
                }),

                $("#butAnnullaRicetta").click(function(){
                    var jsonrec=NS_GESTIONE_DSA.wkRicette.getArrayRecord();
                    if (jsonrec.length==0){
                        home.NOTIFICA.error({message: "Selezionare le ricette da annullare (le prestazioni non devono essere state prenotate)!", timeout: 3, title: "Error"});
                        return;
                    }
                    home.DIALOG.si_no({
                       	title: "Cancellazione ricette DSA selezionate",
                       	msg:"Si conferma l'operazione di ANNULLAMENTO delle ricette selezionate?",
                       	cbkNo:function(){
                       		return;
                       	},
                       	cbkSi: function(){
                       		var aIdenRicetta=new Array(jsonrec.length);
                       		for (var i=0; i<jsonrec.length; i++){
                       			aIdenRicetta[i]=jsonrec[i].IDEN;
                       		}
                       		var db = $.NS_DB.getTool({setup_default:{datasource:'WHALE',async:false}});
                       		$.NS_DB.setup_ajax.async=false;
                       		var xhr = db.call_procedure(
                       				{
                       					id: 'MMG.RR_CANCELLA',
                       					parameter:
			                            {
			                                v_tipo : {v:'RICETTA',t:'V'},
			                                v_ar_iden : {v: aIdenRicetta,t:'A'},
			                                c_errori: {d:'O',t:'V'}
			                            }

                       				});
                       		xhr.done(function(data, textStatus, jqXHR){
                       			//alert(data.p_result);
                       			home.NOTIFICA.success({message: 'Cancellazione ricette eseguita!', timeout: 3, title: 'Success'});
                       			$("#li-tabPrestDSA") .trigger('click');
                       			//testAccertamentiDSA(); // per abilitare /disabilitare la combo tipologia DSA

                       		});

                       		xhr.fail(function(data){
                       			logger.error(JSON.stringify(data));
                       			home.NOTIFICA.error({message: "Attenzione errore nell eliminazione della ricetta", title: "Error"});
                       		});


                       		$.NS_DB.setup_ajax.async=true;
                       	}
                })
                }),


                $("#butStampaLetteraAperturaDSA").click(function(){
                    stampaLettereDSA('LetteraAperturaDSA');
                })

                $("#butStampaInformativaDSA").click(function(){
                    stampaInformativaDSA('LetteraAperturaDSA');
                })

                $("#butStampaLetteraChiusura").click(function(){
                    stampaLettereDSA('LetteraChiusuraDSA');
                })

                $("#butStampaPrestazioniAccessi").click(function(){
                    stampaLettereDSA('PrestazioniAccessi');
                })

                $("#butStampaRelazione").click(function(){
                    stampaLettereDSA('RelazioneDSA');
                });

                if (_STATO_PAGINA == "I"){
                    $("#butStampaLetteraAperturaDSA, #butStampaInformativaDSA").hide();
                }

            $("#butRichiestePrestazioni").click(function(){
            	// controllo ricette senza numero poligrafo
            	var rec=NS_GESTIONE_DSA.wkRicette.getRows();
            	var flgNumPol=true;
            	for (var j=0; j<rec.length; j++){
            		if (rec[j].NUMERO_POLIGRAFO==null){
            			flgNumPol=false;
            		}
            	}
            	if (!flgNumPol){
            		home.NOTIFICA.error({message: "Attenzione una o più ricette non hanno il numero poligrafo. Le prestazioni relative non verranno considerate per l'invio a Onesys", title: "Error"});
            	}

                top.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=RICHIEDI_PREST_DSA&MED_PRESCR='+$("#txtCaseManager").val()+
                    "&IDEN_MED="+$("#h-txtCaseManager").val()+
                    "&IDEN_CONTATTO="+NS_GESTIONE_DSA.idContatto+
                    "&IDEN_PROVENIENZA="+$("#cmbReparto option:selected").val()+
                    "&PROGRESSIVO="+NS_GESTIONE_DSA.tipologia+
                    "&IDEN_ANAG="+_IDEN_ANAG+
                    "&COGNOME="+$("#txtCognome").val()+
                    "&NOME="+$("#txtNome").val()+
                    "&SESSO="+$("#txtSesso").val()+
                    "&DATA_NASCITA="+$("#h-txtDataNasc").val()+
                    "&COD_FISC="+$("#txtCodFisc").val()+
                    "&CODICE_DSA="+$("#txtNumNosologico").val()+
                    "&DATA_OE="+$("#h-txtDataAperturaDSA").val(),id:'RichiediPrestDSA',fullscreen:true});
            });

            $("#butRefStd1").click(function(){
                top.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=FRASI_STD_REFERTAZIONE&TA=txtRisultati',id:'FrasiStdRefertazione',fullscreen:true});
            });
            $("#butRefStd2").click(function(){
                top.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=FRASI_STD_REFERTAZIONE&TA=txtSintesiClinica',id:'FrasiStdRefertazione',fullscreen:true});
            });
            $("#butRefStd3").click(function(){
                top.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=FRASI_STD_REFERTAZIONE&TA=txtTerapieProposte',id:'FrasiStdRefertazione',fullscreen:true});
            });
            $(document).on("click","#butRefStrum",function(){
                NS_GESTIONE_DSA.hideAndShow($("#divDatiLabo"),$("#divwkReferti"));
                NS_GESTIONE_DSA.getWkEsamiStrumentali();
            });

            $('.butFirma').click(function(){

                    var p = {FIRMA : true};

                    NS_REGISTRA_FIRMA.Registra.registra(p);

            });


        }


    },

    checkDataRicettaDSA : function (val, id) {

        var dataAperturaDSA = $("#txtDataAperturaDSA").val();
        if(val != ''){
            if(!DATE_CONTROL.checkBetwen2Date({date1:dataAperturaDSA,date2:val})){
                home.NOTIFICA.error({message: "Dara ricetta iniziale superiore alla data apertura DSA ", timeout: 3, title: "Error"});
                $("#"+id).val("");

            }
        }

    },
    riportaEsenzioneSelezionata: function(opt){
        // controllo opzione gi? presente
        var ese=document.getElementById("lstEsenzioniScelte");
        var cerca=false;
        for (var i=0; i<ese.length; i++){
            if (ese[i].value==opt.value){
                //alert("Esenzione gia' selezionata");
            	home.NOTIFICA.error({message: "Esenzione gia' selezionata!", timeout: 3, title: "Error"});
                cerca=true;
            }
        }
        if (!cerca) {
            document.getElementById("lstEsenzioniScelte").options.add(opt);
            clearComboEse();
            popolaComboEse("lstEsenzioniPaziente");
            popolaComboEse("lstEsenzioniScelte");
        }
    },
    aggiornaPagina: function(dati){
		NS_GESTIONE_DSA.numNosologico=dati.codice.codice;
        NS_GESTIONE_DSA.idContatto=dati.id;
        $("#txtNumNosologico").val(dati.codice.codice);
        $("#h-txtDataAperturaDSA").val(dati.dataInizio.substring(0,8));
        $("#txtDataAperturaDSA").val(dati.dataInizio.substring(6,8)+'/'+dati.dataInizio.substring(4,6)+'/'+dati.dataInizio.substring(0,4));
        $("#txtOraAperturaDSA").val(dati.dataInizio.substring(8,13)).attr("readonly","readonly");
        $("select[name='cmbReparto']").val(dati.contattiGiuridici[0].provenienza.id);
        changeTipologiaDSA(dati.contattiGiuridici[0].provenienza.id);
        $("#h-txtCaseManager").val(dati.uteAccettazione.id);
        $("#txtCaseManager").val(dati.uteAccettazione.descrizione);

        //alert(dati.codiciICD);
        if (dati.codiciICD != null){
            NS_GESTIONE_DSA.Diagnosi.setDiagnosi();
        }

        if (dati.mapMetadatiString['DATA_PRENOTAZIONE'] != ''){
            $("#h-txtDataRiceIniDSA").val(dati.mapMetadatiString['DATA_PRENOTAZIONE'].substring(0,8));
            $("#txtDataRiceIniDSA").val(dati.mapMetadatiString['DATA_PRENOTAZIONE'].substring(6,8)+'/'+dati.mapMetadatiString['DATA_PRENOTAZIONE'].substring(4,6)+'/'+dati.mapMetadatiString['DATA_PRENOTAZIONE'].substring(0,4));
        }

        NS_GESTIONE_DSA.tipologia = dati.contattiGiuridici[dati.contattiGiuridici.length - 1].percorsoCure.codice;
        $("#cmbTipologiaDSA").val(dati.contattiGiuridici[dati.contattiGiuridici.length - 1].percorsoCure.id);//.attr("disabled",true);

        if (dati.dataFine!=null){
            $("#h-txtDataChiusuraDSA").val(dati.dataFine.substring(0,8));
            $("#txtDataChiusuraDSA").val(dati.dataFine.substring(6,8)+'/'+dati.dataFine.substring(4,6)+'/'+dati.dataFine.substring(0,4));
        }

        if (dati.mapMetadatiString['ESENZIONE_PROPOSTA']!=''){
            $("#txtEsenzioneProposta").attr('data-c-value',dati.mapMetadatiString['ESENZIONE_PROPOSTA_CODICE']);
            $("#h-txtEsenzioneProposta").val(dati.mapMetadatiString['ESENZIONE_PROPOSTA_CODICE']);
            $("#txtEsenzioneProposta").attr('data-c-descr',dati.mapMetadatiString['ESENZIONE_PROPOSTA_DESCR']);
            $("#txtEsenzioneProposta").val(dati.mapMetadatiString['ESENZIONE_PROPOSTA_DESCR']);
        }

        //NS_GESTIONE_DSA.idContattiAss=dati.contattiAssistenziali[0].id;
        NS_GESTIONE_DSA.idContattiGiu=dati.contattiGiuridici[0].id;

    },
    caricaDatiLettera: function(funzione){
        var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
        db.call_procedure(
            {
                id: 'LETTERA_READ_GEN',
                parameter:
                {
                    pFunzione:funzione,
                    pIdenContatto:{v:NS_GESTIONE_DSA.idContatto, t:'N'},
                    pIdSezioni: {t:'A', d:'O'},
                    plbSezioni: {t:'A', d:'O'},
                    pTestoPiano: {t:'A', d:'O'}
                },
                success: function(data)
                {
                    if (funzione=='LetteraAperturaDSA'){
                        setSezioneDati(data.pIdSezioni,data.pTestoPiano,"txtAnamnesi");
                        setSezioneDati(data.pIdSezioni,data.pTestoPiano,"txtSospettoDia");
                        setSezioneDati(data.pIdSezioni,data.pTestoPiano,"txtEsameObi");
                        setSezioneDati(data.pIdSezioni,data.pTestoPiano,"txtEsamiPrec");
                        setSezioneDati(data.pIdSezioni,data.pTestoPiano,"txtCodiceRiceIniDSA");
                    }
                    else{
                        setSezioneDati(data.pIdSezioni,data.pTestoPiano,"txtRisultati");
                        setSezioneDati(data.pIdSezioni,data.pTestoPiano,"txtSintesiClinica");
                        setSezioneDati(data.pIdSezioni,data.pTestoPiano,"txtTerapieProposte");
                    }

                }
            });
    },

    deleteAccessoDsa:function(idenAcc){
    	home.DIALOG.si_no({
           	title: "Cancellazione accesso DSA",
           	msg:"Si conferma l'operazione di ANNULLAMENTO dell'accesso DSA selezionato?",
           	cbkNo:function(){
           		return;
           	},
           	cbkSi: function(){
           		// Recupero il Segmento Assistenziale Dal Contatto Intero per essere sicuro di sovrascrivere tutte le informazioni.
           		var _json_accesso = {};
           		var CONTATTO = NS_CONTATTO_METHODS.getContattoById(_JSON_CONTATTO.id);
           		var numAcc=0;
           		for (var i = 0; i <CONTATTO.contattiAssistenziali.length; i++)
           		{
           			if (CONTATTO.contattiAssistenziali[i].id == idenAcc)
           			{
           				_json_accesso = CONTATTO.contattiAssistenziali[i];
           				numAcc=i;
           			}
           		}
           		if (numAcc==0){
           			// il primo accesso non si può cancellare
           			home.NOTIFICA.error({message: "Attenzione: il primo  accesso DSA non puo\' essere cancellato", title: "Error"});
           			return;
           		}
           		_json_accesso.stato = {"codice":"NULLIFIED", "id" : null};
           		_json_accesso.uteModifica = {"codice": null, "id" : home.baseUser.IDEN_PER};
           		//alert(JSON.stringify(_json_accesso));
           		logger.debug("GESTIONE_DSA.deleteAccessoDsa iden -> " + idenAcc + ", accesso -> " + JSON.stringify(_json_accesso));

           		$.ajax({
                    url: 'adt/AnnullaContattoAssistenziale/json/' + JSON.stringify(_json_accesso),
                    dataType: 'json',
                    error: function( data ) {
                        home.NOTIFICA.error({message: "Attenzione errore nella cancellazione di accesso DSA", title: "Error"});
                        logger.error("GESTIONE_DSA.deleteAccessoDsa - Errore Cancellazione Accesso DDSA-> " + data.responseText);
                    	return false;
                    },
                    success:function(data,status){
                        if(data.success){
                            home.NOTIFICA.success({message: 'Cancellazione accesso DSA effettuata correttamente', timeout: 2, title: 'Success'});
                            NS_GESTIONE_DSA.wkAccessi.loadWk();//.refresh();
                            return true;
                        }else{
                            home.NOTIFICA.error({message: "Attenzione errore nella cancellazione di accesso DSA", title: "Error"});
                            return false;
                        }
                    }
            });
           	}
    	});
    },

    Diagnosi : {

        setDiagnosi : function(){

            for (var i = 0; i < _JSON_CONTATTO.codiciICD.mapCodiciICD.length; i++){
                if (_JSON_CONTATTO.codiciICD.mapCodiciICD[i].key == 'DIAGNOSI')
                {
                    for (var j = 0; j < _JSON_CONTATTO.codiciICD.mapCodiciICD[i].value.length; j++)
                    {
                       // if (_JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].evento.codice == NS_GESTIONE_DSA.Events.ICDEvent)
                        //{
                            $("#txtDiagnosiPrinc").val(_JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].codice + ' - ' + _JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].descrizione);
                            $("#h-txtDiagnosiPrinc").val(_JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].codice);
                            $("#txtDiagnosiPrinc").attr("data-c-codice",_JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].codice);
                            $("#txtDiagnosiPrinc").attr("data-c-value",_JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].codice);
                        //}
                    }
                }
            }

        },

        getDiagnosi : function(){

            var jsonDia =
            {
                mapCodiciICD :
                    [
                        {
                            "key": "DIAGNOSI",
                            "value":
                                [
                                    {
                                        "descrizione": $("#txtDiagnosiPrinc").val(),
                                        "evento": {
                                            "id": null,
                                            "codice": NS_GESTIONE_DSA.Events.ICDEvent
                                        },
                                        "data": null,
                                        "id": null,
                                        "codice": $("#txtDiagnosiPrinc").attr("data-c-codice"),
                                        "ordine" : 0
                                    }
                                ]
                        }
                    ]
            };

            return jsonDia;
        }
    },
    getWkEsamiStrumentali:function(){

        var dataInizio = _JSON_CONTATTO.dataInizio.substr(0,8);
        //return alert(ID_REMOTO+'\n'+dataInizio);
        var db = $.NS_DB.getTool({setup_default:{datasource:'POLARIS'}});

        var xhr = db.call_function(
            {
                id: 'FNC_GET_IDEN_REFERTI',
                parameter:
                {
                    vIdRemoto:{v:CODICE_FISCALE,t:'V',d:'I'},
                    vDataMin:{v:dataInizio,t:'V',d:'I'}
                }
            });


        xhr.done(function (data, textStatus, jqXHR) {

            var wk = new WK({
                id : "ADT_WK_REF_STRUMENTALI",
                container : "divwkReferti",
                aBind : ["iden_ref"],
                aVal : [data.p_result]
            });

            wk.loadWk();
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error(JSON.stringify(jqXHR));
            home.NOTIFICA.error({message: "Attenzione errore nella ricerca degli esami strumentali, contattare l'assistenza", title: "Error"});
        });

    },

    processCopia:function(rec){
        var url ='javascript:NS_GESTIONE_DSA.scrivitesto("'+rec.TESTO_REFERTO+'")';
        //url = "javascript:home.NS_FENIX_TOP.apriPagina({\"url\":NS_HOME_ADT.getUrlCartellaPaziente('"+data.CODICE+"'),\"id\":\"AUTOLOGIN_FENIX\",\"fullscreen\":false,\"showloading\":false});";
        return $(document.createElement('a')).attr("href",url).html("<i class='icon-docs' title='Copia il testo del referto'>");

    },
    scrivitesto:function(text){
    	var testoAttuale=$("#txtRisultati").val();
		testoAttuale+=text;
        $("#txtRisultati").val(testoAttuale).trigger('resize');

    },
    hideAndShow:function(objtohide, objtoShow){
        objtohide.hide();
        objtoShow.show();
    }


};

//function che istanzia nuovo oggetto per evitare object reference comuni
function getModel(){
    return {
        "iden": "",
        "cod_accertamento": null,
        "accertamento": null,
        "data": moment().format('YYYYMMDD'),
        "qta": "1",
        "cod_esenzione": null,
        "cronicita": "N",
        "periodicita": "",
        "temporaneita": "",
        "da_stampare": "S",
        "blocco": "",
        "risultato": "",
        "iden_problema": ""
    };
}


// funzione callback dopo caricamento wk prestazioni DSA
var loadPrest ={
    after: function(){
        /*if (firstLoad){
            var tableTh = $("#wkPrestDSA thead tr");
            $("<td class=clsEse style='color:white'>ESENZIONE</td>").appendTo(tableTh);
            firstLoad=false;
        }*/
        var tableTr=$("#wkPrestDSA table tr");
        var rec;
        var codEse;
        tableTr.each(function(i){
        	if (i>0){
        		rec=NS_GESTIONE_DSA.wkPrestazioni.getRow(i-1);
        		$(this).find('td[data-header="ESENZIONE"]').append("<select id='sel-esenzione-" + rec.N_ROW + "' class=clsEsenzione><option></option></select>");
                //$("<td><select class=clsEsenzione><option></option></select></td>").appendTo($(this));
                if (rec.IDEN_ACCERTAMENTO!=null){
                	$(this).children('td').css('background-color','lightgrey');
                }
        	}

        });
        clearComboEse();
        popolaComboEse("lstEsenzioniPaziente");
        popolaComboEse("lstEsenzioniScelte");
    }
}
//funzione callback dopo caricamento wk ricette DSA
var loadRicette ={
    after: function(){
        var rec;
        var tableTr=$("#wkRicetteDSA table tr");
        tableTr.each(function(i){
        	if (i>0){
        		rec=NS_GESTIONE_DSA.wkRicette.getRow(i-1);
                if (rec.NUMERO_POLIGRAFO==null){
                	$(this).find('td[data-header="N. POLIGRAFO"]').append("<input class=clsNumPoligrafo style='width:100%'>");
                    // $("<td><input class=clsNumPoligrafo style='width:120px'></td>").appendTo($(this));
                }
        	}
        });
        clearComboEse();
        popolaComboEse("lstEsenzioniPaziente");
        popolaComboEse("lstEsenzioniScelte");
        if (NS_GESTIONE_DSA.wkRicette.getRows().length>0){
        	$("#cmbTipologiaDSA").attr("disabled",true);
        	$("#cmbReparto").attr("disabled",true);
        }
        else{
        	$("#cmbTipologiaDSA").attr("disabled",false);
            $("#cmbReparto").attr("disabled",false);
        }
    }
}
//funzione callback dopo caricamento wk Accessi DSA
var loadAccessi={
    after: function(){
        var nAccessi= NS_GESTIONE_DSA.wkAccessi.getRows().length;
        $("#txtNAccessi").val(nAccessi);
        if (nAccessi>3 ){
            $("#txtNAccessi").css('background-color','red');
        }

    }
}

function clearComboEse(){
    var tableTr=$("#wkPrestDSA table tr select.clsEsenzione");
    tableTr.empty();
}

function popolaComboEse(lstEse){
	var eseSpeciali = new Array("048","046","040","041","M50","L02","L04");
    var ese=document.getElementById(lstEse);
    if (ese.length==0){
        return;
    }
    var rec = NS_GESTIONE_DSA.wkPrestazioni.getRows();
    var tableTr=$("#wkPrestDSA table tr");
    var select;
    tableTr.each(function(j){
    	if (j>0){
    		select=$(this).find("td .clsEsenzione");
            if (rec[j-1].IDEN_ACCERTAMENTO == null){
               for (var i=0; i<ese.length; i++){
                   var tipoEse=ese[i].value.substring(0,1);
                   var codEse = ese[i].value.substring(2);
                   if ((tipoEse=="T" ||  ($.inArray(codEse,eseSpeciali)>=0)) && (codEse!='EPF')) { // esenzione totale escluso EPF
                   	$("<option selected>"+codEse+"</option>").appendTo(select);
                   }
                   else
                   if (tipoEse=="P"){// esenzione parziale
                       var codPrest=rec[j-1].CODICE_REGIONALE;
                       var params = {};
                       var funzione = 'ADT_GESTIONE_DSA.isPrestazioneEsente';
                       params =
                       {
                           'pCodPrestazione' : codPrest,
                           'pCodEsenzione': codEse
                       };
                       dwr.engine.setAsync(false);
                       toolKitDB.executeFunctionDatasource(funzione,"ADT",params,function(resp){
                           if (resp.p_result!="0"){
							   //alert(j+' '+rec[j].PRESTAZIONE+' '+codEse);
                               $("<option selected>"+codEse+"</option>").appendTo(select);
                           }
                       });
                       dwr.engine.setAsync(true);
                   };
               }
           }
            else{
    			var codEse;
    			if (rec[j-1].COD_ESENZIONE==null){ codEse='';} else{codEse=rec[j-1].COD_ESENZIONE;}
                $("<option selected>"+codEse+"</option>").appendTo(select);
    		}
    	}
    })
}
function getEsenzione(rowNum){
    var ese=null;
    $("#wkPrestDSA table tr").each(function(i){
        if (i==rowNum){
            ese= $(this).find(":selected");
        }
    });
    if (ese!=undefined){
        return ese.val();
    }
    else{
        return "";
    }
}

function UpdateCodiceRicette(a_idenRicetta, a_codRicetta){
    /*var procedura;
    var params = {};
    procedura='MMG.ADT_RR_UPDATECODICIRICETTE';
    params =
    {
        'pIden' : a_idenRicetta,
        'pNumeroPoligrafo':a_codRicetta
    };

    toolKitDB.executeProcedureDatasource(procedura,"WHALE",params,
        {
            callback: function(resp){
                //alert(resp);
                if (resp=="KO"){home.NOTIFICA.error({message: "Attenzione errore nell salvataggio del n. poligrafo", title: "Error"}); }
                else{
                    home.NOTIFICA.success({message: 'update n. poligrafo eseguito!', timeout: 5, title: 'Success'});
                    NS_GESTIONE_DSA.wkRicette.loadWk();//.refresh();
                }
            },
            timeout: 3000,
            errorHandler: function (resp)
            {
                home.NOTIFICA.error({message: "Attenzione errore nell salvataggio del n. poligrafo", title: "Error"});
            }
        });*/
	var db = $.NS_DB.getTool({setup_default:{datasource:'WHALE'}});
	 $.NS_DB.setup_ajax.async=false;
	var xhr = db.call_procedure(
            {
                id: 'MMG.ADT_RR_UPDATECODICIRICETTE',
                parameter:
                {
        			'pIden':{v:a_idenRicetta,t:'V'},
        			 'pNumeroPoligrafo':{v:a_codRicetta,t:'V'},
        			'p_result':{t:'V',d:'O'}
        	}

            });
        xhr.done(function(data, textStatus, jqXHR){
                //alert(data.p_result);
                home.NOTIFICA.success({message: 'Update n. poligrafo ricetta eseguito!', timeout: 3, title: 'Success'});
                $("#li-tabPrestDSA") .trigger('click');
        });

        xhr.fail(function(data){
            logger.error(JSON.stringify(data));
            home.NOTIFICA.error({message: "Attenzione errore in update n. poligrafo", title: "Error"});
        });
        $.NS_DB.setup_ajax.async=true;
}

function testAccertamentiDSA(){
    var procedura="ADT_GESTIONE_DSA.testAccertamentiDSA";
    var params={'pIdenContatto': NS_GESTIONE_DSA.idContatto};
    dwr.engine.setAsync(false);
    toolKitDB.executeFunctionDatasource(procedura,"ADT",params,function(resp){
        //alert(resp);
        if (parseInt(resp.p_result)>0){
            $("#cmbTipologiaDSA").attr("disabled",true);
            $("#cmbReparto").attr("disabled",true);
        }
        else{
        	$("#cmbTipologiaDSA").attr("disabled",false);
            $("#cmbReparto").attr("disabled",false);
        }
    });
    dwr.engine.setAsync(true);
}

function changeTipologiaDSA(idenPro){
    var param={"idenPro":idenPro};
    dwr.engine.setAsync(false);
    toolKitDB.getResultDatasource("ADT.Q_TIPOLOGIA_DSA_REPARTO","ADT",param,null,function(resp){
        $("#cmbTipologiaDSA").empty();
        for(var i=0; i<resp.length; i++){
        	$("#cmbTipologiaDSA").append("<option data-value='" + resp[i].VALUE + "' data-codice='" + resp[i].CODICE + "' data-descr='" + resp[i].DESCR + "' value='" + resp[i].VALUE + "' id='cmbTipologiaDSA_" + resp[i].VALUE + "'>" + resp[i].DESCR + "</option>");
        }
        
    });
    dwr.engine.setAsync(true);
}


function setSezioneDati(aSezioni,aDati,idSezione){
    for (var i=0; i<aSezioni.length; i++){
        if (aSezioni[i]==idSezione){
            $("#"+idSezione).val(aDati[i]);
            return;
        }
    }
}

function getTipoDimiDSA(){
    var idenTipoDimi;
    param={};
    dwr.engine.setAsync(false);
    toolKitDB.getResultDatasource("ADT.GET_TIPO_DIMI_DSA","ADT",param,null,function(resp){
        //alert(resp[0].IDEN);
        idenTipoDimi= resp[0].IDEN;
    });
    dwr.engine.setAsync(true);
    return idenTipoDimi;
}

function stampaLettereDSA(funzione){
    var nomeStampante=home.basePC.STAMPANTE_REFERTO;
    var nomeReport;
    var prompts;
   /* if (nomeStampante==""){
        alert("Stampante non configurata per questo PC");
        return;
    }*/
    if (funzione=='LetteraAperturaDSA')	{
        nomeReport='LETTERA_APERTURA_DSA';
        prompts = {
            "pIdenContatto": NS_GESTIONE_DSA.idContatto,
            "Funzione" : funzione,
            "pShowOriginale" : '1',
            "configurazione_stampa" : $("#h-txtCaseManager").val()
        };
    }
    else if (funzione=='LetteraChiusuraDSA'){
        nomeReport='LETTERA_CHIUSURA_DSA';
        prompts = {
            "pIdenContatto": NS_GESTIONE_DSA.idContatto,
            "Funzione" : funzione,
            "pShowOriginale" : '1',
            "configurazione_stampa" : $("#h-txtCaseManager").val()
        };
    }
    else if (funzione=='PrestazioniAccessi'){
        nomeReport='PRESTAZIONI_ACCESSI_DSA';
        prompts = {
            "pIdenContatto": NS_GESTIONE_DSA.idContatto,
            "progressivo" : NS_GESTIONE_DSA.tipologia,
            "pShowOriginale" : '1',
            "configurazione_stampa" : $("#h-txtCaseManager").val()
        };
    }
    else { // stampa tutta la relazione
        nomeReport='RELAZIONE_DSA';
        prompts = {
            "pIdenContatto": NS_GESTIONE_DSA.idContatto,
            "pFunzioneIni": "LetteraAperturaDSA",
            "pFunzioneFine" : "LetteraChiusuraDSA",
            "progressivo" : NS_GESTIONE_DSA.tipologia,
            "pFirma" : 'N'
            //"configurazione_stampa" : $("#h-txtCaseManager").val()
        };
    }

    /*var print_params = {
     report: nomeReport,
     prompts: prompts,
     show: "N",
     output: "pdf",
     windowname: "0",
     stampante: nomeStampante,
     opzioni:{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[196.0,152.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}
     };
     if(NS_PRINT.print(print_params)) {alert('Stampa lettera ok');}*/
    var par = {};
    par.PRINT_DIRECTORY = 'DSA';
    par.PRINT_REPORT= nomeReport;
    // par.PRINT_SF="%7bSTAMPA_LISTA_WK.USERNAME%7d%3d%27"+ baseUser.USERNAME + "%27";
    if (funzione=='RelazioneDSA'){
        par.PRINT_PROMPT="&promptpIdenContatto=" + NS_GESTIONE_DSA.idContatto
            +"&promptpFunzioneIni=LetteraAperturaDSA&promptpFunzioneFine=LetteraChiusuraDSA"+
            "&promptprogressivo="+NS_GESTIONE_DSA.tipologia+"&promptpFirma=N";
    }
    else{
        par.PRINT_PROMPT="&promptpIdenContatto=" + NS_GESTIONE_DSA.idContatto+"&promptFunzione="+funzione;
    }

	par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

	home.NS_FENIX_PRINT.caricaDocumento(par);
    home.NS_FENIX_PRINT.apri(par);

}
function stampaInformativaDSA(){

    var par = {};
    par.PRINT_DIRECTORY = 'DSA';
    par.PRINT_REPORT= "INFORMATIVA_DSA";
    par.PRINT_PROMPT="&promptpIdenContatto=" + $("#IDEN_CONT").val();
    par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

	home.NS_FENIX_PRINT.caricaDocumento(par);
    home.NS_FENIX_PRINT.apri(par);
}

var NS_FUNZIONI = {

    apriIpatient : function() {
        var url = 'servletGeneric?class=iPatient.iPatient&provChiamata=MMG&ID_PAZIENTE=PRVGRN13H14I480J';
        url = NS_APPLICATIONS.switchTo('WHALE', url);
        window.open(url);
    },

    apriVisualizzatore : function(){
        // var url = 'http://10.106.128.177:8082/whale/header?utente=dario&cod_cdc=UTIM_SV&idPatient=GGLFNC44H14I947M&pagina=VISUALIZZATORE_EXT&postazione=NB_DARIOC-HP&reparto=826012601A11&';
        var url = 'header?utente=dario&cod_cdc=UTIM_SV&idPatient=PRVGRN13H14I480J&pagina=VISUALIZZATORE_EXT&postazione=NB_DARIOC-HP&reparto=826012601A11&';
        url = NS_APPLICATIONS.switchTo('WHALE', url);
        window.open(url);
    },

    apriDatiLaboratorio: function(){
        // var url = 'http://10.106.128.177:8082/whale/header?utente=dario&cod_cdc=UTIM_SV&idPatient=GGLFNC44H14I947M&pagina=VISUALIZZATORE_EXT&postazione=NB_DARIOC-HP&reparto=826012601A11&';
        var url ='servletGeneric?class=cartellaclinica.cartellaPaziente.cartellaPaziente&ricovero=' + _JSON_CONTATTO.codice.codice +'&funzione=apriDatiLaboratorio()&ModalitaAccesso=REPARTO&provChiamata=CARTELLA';
        url = NS_APPLICATIONS.switchTo('WHALE', url);
        window.open(url);
    },

    stampaModuloDiagnosi : function(){
        var par = {};
        par.PRINT_DIRECTORY = 'DSA';
        par.PRINT_REPORT= "MODULO_ESENZIONI_DIAGNOSI";
        par.PRINT_PROMPT="&promptpIdenContatto=" + _JSON_CONTATTO.id;
        par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

    	home.NS_FENIX_PRINT.caricaDocumento(par);
        home.NS_FENIX_PRINT.apri(par);
    }

};

function setMedicoRicette(){
    if ($("#h-txtMedicoRicette").val()==''){
        $("#h-txtMedicoRicette").val($("#h-txtCaseManager").val());
        $("#txtMedicoRicette").val($("#txtCaseManager").val());
    }
}

function caricaComboStampanti(){
	var stampanti = JSON.parse(home.AppStampa.GetPrinterList());
	for (var i=0; i<stampanti.printers.length; i++){
		$("#cmbStampanti").append("<option id=stamp"+i+" value='"+stampanti.printers[i]+"'>"+stampanti.printers[i]+"</option>")
		if (home.basePC.STAMPANTE_RICETTE!="" && stampanti.printers[i]==home.basePC.STAMPANTE_RICETTE){
			$("#cmbStampanti").val(home.basePC.STAMPANTE_RICETTE);
		}
	}
}

function initWkPrestazioni(){
	NS_GESTIONE_DSA.wkPrestazioni=new WK({
        id:"ADT_PRESTAZIONI_DSA",
        container:"wkPrestDSA",
        aBind : ["codTipologiaDSA","idenContatto"],
        aVal : [NS_GESTIONE_DSA.tipologia,NS_GESTIONE_DSA.idContatto],
        load_callback: loadPrest.after,
        loadData:true
    });
    NS_GESTIONE_DSA.wkPrestazioni.loadWk();
}
function initWkRicette(){
	 NS_GESTIONE_DSA.wkRicette = new WK({
         id:"ADT_WK_RICETTE_DSA",
         container: "wkRicetteDSA",
         aBind : ["idenContatto"],
         aVal : [NS_GESTIONE_DSA.idContatto],
         load_callback: loadRicette.after,
         loadData:true
     });
     NS_GESTIONE_DSA.wkRicette.loadWk();
}

/**
 * Funzione per processclass WK prestazioni DSA
 * Crea dinamicamente il select per la valorizzazione della condizione
 * o dell'indicazione possibile per quella prestazione.
 * Crea inoltre un dialog per la visualizzazione dettagliata di questi ultimi.
 *
 * @param data
 * @param wk
 * @param td
 */
function processColumnErogabilita(data, wk, td){

    var _abilitaLorenzin = home.baseGlobal.ABILITA_LORENZIN;

    if ("N" === _abilitaLorenzin) {
        return;
    }

    if (data.ID_NOTA == null || data.ID_NOTA === ""){
        return;
    }

    var xmlDoc = $.parseXML(data.XML_CONDIZIONI_INDICAZIONI);

    // Icona per apertura dialog dettagli nota
    var span = $("<span></span>").addClass("icon-info").css({"cursor":"pointer"});
    // Select per selezione condizione e indicazione
    var select = $("<select></select>").attr({"id":"sel-ind-cond-" + data.N_ROW});

    // Table wrapper del dialog
    var tbl = $("<table></table>").append("<tr></tr>");
    var trOne = $("<tr></tr>");
    var trTwo = $("<tr></tr>");

    // La wk contiene un xml contenente la struttura delle condizioni e delle indicazioni relative alla prestazione
    // Ciclo l'xml per costruire il select per la selezione e il dialog per la visualizzazione dettagliata
    $("ROWSET > ROW",xmlDoc).each(function(idx){

        var idNota = $(this).attr("id_nota");
        var intestazione = $(this).attr("tipo_nota") === "CON" ? "Condizione di erogabilit&agrave;" : "Indicazioni di appropriatezza prescrittiva";
        var thIntestazione = $("<th>" + intestazione + "</th>").css({"font-weight":"bold","padding":5});
        var tdMultiSelect = $("<td></td>");

        trOne.append(thIntestazione);

        // Multiselect per visualizzazione dettagliata. Deve avere una dimensione massima per evitare una visualizzazione non allineata
        var _multiSelect = $("<select></select>").attr({"id":"multisel-nota-option-" + data.N_ROW,"multiple":"multiple","readonly":"true"}).css({"max-width":400,"overflow-x":"scroll"});
        // Il select e' suddiviso in OPTGROUP per "Indicazioni" e "Condizioni" valorizzate con l'id della notae il rispettivo dettaglio
        var optGroup = $("<optgroup></optgroup>").attr({"categoria":$(this).attr("tipo_nota"),"label" : $(this).attr("tipo_nota") === "CON" ? "Condizioni" : "Indicazioni"});

        $("OPZIONI > VARCHAR2",$(this)).each(function(){

            // Il valore della option nell'xml è dato dal codice (id nota - id dettaglio) concatenato (tramite @) alla descrizione - 47 - 0@Indagine di I livello in caso di sospetta patologia epatica
            var codiceNotaOption = $(this).text().split("@")[0];
            var descrNotaOption = $(this).text().split("@")[1];

            // Option per la select di selezione
            var optShort = $("<option></option>").text(idNota + " - " + codiceNotaOption).val(idNota + "-" + codiceNotaOption);

            // Option per visualizzazione dettagliata
            var optDescr = $("<option></option>").text(descrNotaOption).on("click",function(){
                $('select[id^="multisel-nota-option-"] > option').removeAttr("selected");
                $(".divDescrizioneNota").remove();
                var nTipoNote = $("select#multisel-nota-option-" + data.N_ROW).size();
                $(this).closest("div").append("<div class='divDescrizioneNota' style='max-width:" + (400 * nTipoNote) + "px'>" + $(this).text() + "</div>")
            });

            optGroup.append(optShort);
            _multiSelect.append(optDescr);
        });

        select.append(optGroup);

        tdMultiSelect.append(_multiSelect);
        trTwo.append(tdMultiSelect);
    });

    tbl.append(trOne);
    tbl.append(trTwo);

    // Associo l'evento per la visualizzazione dettagliata
    span.on("click",function(){
        $.dialog(tbl, {
            buttons :
                [
                    {label: "Chiudi", action: function (ctx) { $.dialog.hide(); }},
                ],
            title : "Dettaglio nota " + data.ID_NOTA,
            height : 175,
            width : 'auto'
        });
    });

    // il td della WK e'valorizzato in 2 righe. La prima contiene il link alla visualizzazione dettagliata
    // La seconda riga contiene l'AUTOCOMPLETE delle patologie solo se per la prestazione e' valorizzato il campo GENETICA
    var divOne = $("<div class='divOne'></div>");
    divOne.append(span);
    divOne.append(select);

    td.append(divOne)

    if (data.GENETICA !== null && data.GENETICA !== "") {

        var divTwo = $("<div class='divTwo'></div>");
        var iAC = $("<input />").attr({"type":"text", "value":"", "id":"ac-patologie-prest-" + data.N_ROW}).css({"height":"18px","line-height":"18px","width":"105px","margin":"1px 0 1px 0"});
        var hiAC = $("<input />").attr({"type":"hidden", "value":"", "id":"h-ac-patologie-prest-" + data.N_ROW});

        divTwo.append(iAC);
        divTwo.append(hiAC);

        td.append(divTwo)
        iAC.autocomplete({'appendTo':td,'storedQuery':'WORKLIST.AC_PATOLOGIE','onSelect':function(data){/*alert(data.DESCR)*/},'minChars':'2','binds':{'genetica':'A,B,C'},'deferRequestBy':'200','serviceUrl':'autocompleteAjax','maxResults':'30','datasource':'WHALE'});
    }
}
