
var NS_INVIA_RICHIESTE = {

    //listaInviati: [],
    jsonRichieste : null,
    countError : null,
    controlForensi : false,
    /*dataLABO : null,
    oraLABO : null,
    dataECG : null,
    oraECG : null,*/
   // idenTestataRichiesta : null,
    //idenEsamiTestata : null,
    //idenEsaECG : null,
    //idenEsamiDettaglio : null,

    getJSONRichieste: function () {
        return NS_INVIA_RICHIESTE.jsonRichieste;
    },
    /**
     * Per ogni segmento del JSON appena creato (jsonRichieste) lo ciclo e faccio una chiamata ajax. Utilizzo come
     * discriminante il cod_dec e la metodica.
     */
    processaRichieste : function(){

        NS_INVIA_RICHIESTE.countError = 0;

        for (var i = 0; i < NS_INVIA_RICHIESTE.jsonRichieste.length; i++)
        {
            var jsonSegRich = NS_INVIA_RICHIESTE.jsonRichieste[i];

            NS_INVIA_RICHIESTE.checkRepartoRichiesta($("#hCodDec").val(), jsonSegRich.COD_DEC, jsonSegRich);
        }

        if(NS_INVIA_RICHIESTE.countError === 0)
        {
            home.NOTIFICA.success({message: "Richieste inserite con successo",timeout: 2,title: 'Success'});

            if(MAIN_INS_RICHIESTE.hasAValue(home) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO)&& MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
                home.PANEL.NS_REFERTO.SALVA_SCHEDA = 'S';
            }

            //NS_WK_RICHIESTE.initialSettings();
            MAIN_INS_RICHIESTE.Pagina.cancellaTesto();
        }
        else if(NS_INVIA_RICHIESTE.jsonRichieste.length == NS_INVIA_RICHIESTE.countError)
        {
            home.NOTIFICA.error({message: "Nessuna Richiesta inserite",timeout: 2,title: "Error"});
            if(MAIN_INS_RICHIESTE.hasAValue(home) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO)&& MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
                home.PANEL.NS_REFERTO.SALVA_SCHEDA = 'S';
            }
        }
        else if(NS_INVIA_RICHIESTE.countError > 0 && NS_INVIA_RICHIESTE.countError < NS_INVIA_RICHIESTE.jsonRichieste.length)
        {
            home.NOTIFICA.warning({message: "Una o piu' Richieste non inserite",timeout: 2,title: "Warning"});
            if(MAIN_INS_RICHIESTE.hasAValue(home) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO)&& MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
                home.PANEL.NS_REFERTO.SALVA_SCHEDA = 'S';
            }
        }

        NS_INVIA_RICHIESTE.jsonRichieste = [];
        $("#colAltriDati").find("tr.trDati").remove();

    },

    /**
     * controlla se il reparto mittente e destinatario sono gli stessi. Se sono diversi manda una richiesta HL7
     * alla servlet, altrimenti chiama la procedura GEST_RIS_ESAMI_2
     * @param repartoMittente
     * @param repartoDestinatario
     * @param jsonSegRich
     */
    checkRepartoRichiesta : function(repartoMittente,repartoDestinatario,jsonSegRich){

        home.NS_CONSOLEJS.addLogger({name: 'checkRepartoRichiesta', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['checkRepartoRichiesta'];

        if(repartoMittente=="" || repartoMittente==null) logger.error("checkRepartoRichiesta : repartoMittente is undefined");

        if(repartoDestinatario=="" || repartoDestinatario==null) logger.error("checkRepartoRichiesta : repartoDestinatario is undefined");

        var callback = function(idenRichiesta, idenEsameDettaglio) {
            $("#colAltriDati").find("tr.trDati").remove();
            if(MAIN_INS_RICHIESTE.hasAValue(home) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO)&& MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
                home.PANEL.NS_REFERTO.SALVA_SCHEDA = 'S';
            }

            for (var i = 0; i < jsonSegRich.ESAMI.length; i++) {
                if (jsonSegRich.ESAMI[i].IDEN_ESA == home.baseGlobal.ECG_REPARTO_PS) {
                   /* NS_INVIA_RICHIESTE.dataECG = jsonSegRich.DATA_PROPOSTA;
                    NS_INVIA_RICHIESTE.oraECG = jsonSegRich.ORA_PROPOSTA;*/
                    NS_INVIA_RICHIESTE.inviaECG(jsonSegRich.DATA_PROPOSTA,jsonSegRich.ORA_PROPOSTA,idenEsameDettaglio);
                }
            }

            if(jsonSegRich.COD_DEC==="LABO")
            {
                /*NS_INVIA_RICHIESTE.dataLABO = jsonSegRich.DATA_PROPOSTA;
                NS_INVIA_RICHIESTE.oraLABO = jsonSegRich.ORA_PROPOSTA;*/

                if(jsonSegRich.METODICA==="F" && NS_INVIA_RICHIESTE.controlForensi===false)
                {
                    NS_INVIA_RICHIESTE.setEsamiForensi({callback : function(){
                        NS_INVIA_RICHIESTE.controlForensi = true;
                        if(MAIN_INS_RICHIESTE.hasAValue(home) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL.catenaCustodia)){
                            home.PANEL.catenaCustodia = "S";
                        }


                        $("#lblAlertAlcol").remove();
                        NS_INVIA_RICHIESTE.inviaPrelievo(jsonSegRich.DATA_PROPOSTA,jsonSegRich.ORA_PROPOSTA,idenRichiesta);
                    }})
                }
                else
                {
                    NS_INVIA_RICHIESTE.inviaPrelievo(jsonSegRich.DATA_PROPOSTA,jsonSegRich.ORA_PROPOSTA,idenRichiesta);
                }
            }
            if(MAIN_INS_RICHIESTE.hasAValue(home) && MAIN_INS_RICHIESTE.hasAValue(home.NS_CARTELLA) ){
                home.NS_CARTELLA.setSemaphoreOnSave();
            }


            NS_LOADING.hideLoading();
        };

        var callbackError = function(){
            NS_LOADING.hideLoading();
            if(MAIN_INS_RICHIESTE.hasAValue(home) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO)&& MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
                home.PANEL.NS_REFERTO.SALVA_SCHEDA = 'S';
            }

        };

        if(repartoMittente==repartoDestinatario){
            logger.info("JSON RIS ESAMI : \n" + JSON.stringify(jsonSegRich));
            NS_INVIA_RICHIESTE.callRisEsami(jsonSegRich,callback,callbackError);
        }else{
            logger.info("JSON MSG HL7 : \n" + JSON.stringify(jsonSegRich));
            NS_INVIA_RICHIESTE.creaJsonHl7(jsonSegRich,callback,callbackError);
        }
    },

    /**
     * Funzione che crea il segmento principale del JSON da passare al client HL7.
     * Poi per ogni prestazione, e quindi per ogni option presente nel combo_list,
     * chiamo la funzione che crea un segmento del JSON e lo inserisco nel campo ORDER.
     * Infine chiamo la funzione che fa la chiamata HL7 con il messaggio completo.
     */
    creaJsonHl7: function (jsonSegRich,callback,callbackError) {
        var OraFormattata = NS_INVIA_RICHIESTE.formattaOra(jsonSegRich.ORA_PROPOSTA);

        var msg = {
            "MESSAGE": [
                {
                    "NAME": "OMG_O19",
                    "VALUE": {
                        "MSH": {
                            "MSH.1": "|",
                            "MSH.2": "^~\\&",
                            "MSH.3": {
                                "HD.1": NS_DATI_RICHIESTE.getAssigningAuthorityMittente()
                            },
                            "MSH.4": {
                                "HD.1": NS_DATI_RICHIESTE.getRepartoMittente()
                            },
                            "MSH.5": {
                                "HD.1": NS_DATI_RICHIESTE.getAssigningAuthorityDestinatario()
                            },
                            "MSH.6": {
                                "HD.1": (jsonSegRich.COD_DEC).toString()  //reparto destinatario
                            },
                            "MSH.7": {
                                "TS.1": jsonSegRich.DATA_PROPOSTA+OraFormattata+"00.000"//NS_DATI_RICHIESTE.getDataOraMessaggio()
                            },
                            "MSH.9": {
                                "MSG.1": "OMG",
                                "MSG.2": "O19",
                                "MSG.3": "OMG_O19"
                            },
                            "MSH.10": jsonSegRich.DATA_PROPOSTA+OraFormattata+"00.000",//NS_DATI_RICHIESTE.getDataOraMessaggio(),
                            "MSH.11": {
                                "PT.1": "T" //T sta per test, P per produzione
                            },
                            "MSH.12": {
                                "VID.1": NS_DATI_RICHIESTE.getVersione()
                            }
                        },
                        "PATIENT": {
                            "PID": {
                                "PID.3": [
                                    {
                                        "CX.1": NS_DATI_RICHIESTE.getIdenAnag(),
                                        "CX.3": NS_DATI_RICHIESTE.getAssigningAuthorityDestinatario(),
                                        "CX.5": "PK"
                                    },
                                    {
                                        "CX.1": NS_DATI_RICHIESTE.getCodiceFiscale(),
                                        "CX.3": NS_DATI_RICHIESTE.getAssigningAuthorityDestinatario(),
                                        "CX.5": "CF"
                                    }
                                ],
                                "PID.5": {
                                    "XPN.1": {
                                        "FN.1": NS_DATI_RICHIESTE.getCognome()
                                    },
                                    "XPN.2": NS_DATI_RICHIESTE.getNome()
                                },
                                "PID.7": {
                                    "TS.1": NS_DATI_RICHIESTE.getDataNascita()
                                },
                                "PID.8": NS_DATI_RICHIESTE.getSesso()
                            },
                            "PATIENT_VISIT": {
                                "PV1": {
                                    "PV1.1": "1",
                                    "PV1.2": "I", //classe paziente
                                    "PV1.3": {
                                        "PL.1": NS_DATI_RICHIESTE.getIdenProvenienza()
                                    },
                                    "PV1.19": {
                                        "CX.1": (NS_DATI_RICHIESTE.getNumNosologico()).toString()
                                    }
                                }
                            }
                        },
                        "ORDER": []
                    }
                }
            ]
        };

        for (var i = 0; i < jsonSegRich.ESAMI.length; i++) {

            var segORC = NS_INVIA_RICHIESTE.setSegORC(i, jsonSegRich.ESAMI[i], jsonSegRich.QUESITO, jsonSegRich.QUADRO, jsonSegRich.DATA_PROPOSTA, OraFormattata);


            msg.MESSAGE[0].VALUE.ORDER.push(segORC);
        }

        NS_INVIA_RICHIESTE.chiamataHL7(msg,callback,callbackError);
    },
    /**
     * Funzione che crea un segmento ORC+OBR per ogni prestazione, ogni segmento sarà poi inserito nel JSON principale.
     */
    setSegORC: function (i, jsonSegRichEsame, quesito, quadro, data_proposta, ora_proposta) {
        return segORC = {
            "ORC": {
                "ORC.1": "NW",
                "ORC.2": {
                    "EI.1": NS_DATI_RICHIESTE.getNumOrdine()
                },
                "ORC.4": {
                    "EI.1": NS_DATI_RICHIESTE.getNumRichiesta()
                },
                "ORC.5": {
                    "EI.1": NS_DATI_RICHIESTE.getTipoRichiesta()
                },
                "ORC.7": {
                    "TQ.1": {
                        "CQ.1": data_proposta + ora_proposta
                    },
                    "TQ.6": (jsonSegRichEsame.URGENZA).toString()
                },
                "ORC.8": {
                    "EIP.1": {
                        "EI.1": jsonSegRichEsame.IMPEGNATIVA.toString()
                    }
                },
                "ORC.9": {
                    "TS.1": (jsonSegRichEsame.DATA_IMPEGNATIVA).toString()
                },
                "ORC.12": {
                    "XCN.1": NS_DATI_RICHIESTE.getUserIdenPer()
                },
                "ORC.21": {
                    "XON.1": NS_DATI_RICHIESTE.getAssigningAuthorityMittente()
                }
            },
            "OBSERVATION_REQUEST": {
                "OBR": {
                    "OBR.1": (i + 1).toString(),
                    "OBR.2": {
                        "EI.1": (jsonSegRichEsame.IDEN_ESA + 1).toString()
                    },
                    "OBR.4": {
                        "CE.1": (jsonSegRichEsame.IDEN_ESA).toString(),
                        "CE.2": jsonSegRichEsame.ESAME,
                        "CE.3": jsonSegRichEsame.LATERALITA
                    },
                    "OBR.7": {
                        "TS.1": NS_DATI_RICHIESTE.getDataOraRegOrdine()
                    },
                    "OBR.13": quadro,
                    "OBR.23": {
                        "MOC.2": {
                            "CE.1": (jsonSegRichEsame.COD_ESENZIONE).toString()
                        }
                    },
                    "OBR.27": {
                        "TQ.1": {
                            "CQ.1": data_proposta + ora_proposta
                        }
                    },
                    "OBR.31": {
                        "CE.2": quesito
                    },
                    "OBR.39": {
                        "CE.1": jsonSegRichEsame.TIPO_IMPEGNATIVA
                    }
                }
            }
        };


    },

    /**
     * @param jsonSegRich
     * @param callback
     * @param callbackError
     * author matteo.pipitone
     * NUOVA GESTIONE DEGLI ESAMI
     * BISOGNA CHIAMARE PRESTAZIONI.FNC_RICHIEDI_ESAMI CHE CREA XML E LO MANDA A FX$GESTIONE_RIS_ESAMI.SALVA_ESAMI
     */
    callRisEsami : function(jsonSegRich,callback,callbackError){

        home.NS_CONSOLEJS.addLogger({name: 'callRisEsami', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['callRisEsami'];

        var stringaIdenEsami ="";
        var isEcg = false;
        var isLabo = false;
        var position = null;

        $.each(jsonSegRich.ESAMI, function(k,v){
            if(k==0){
                stringaIdenEsami += v.IDEN_ESA;
            }else{
                stringaIdenEsami += ","+ v.IDEN_ESA;
            }

            if(v.IDEN_ESA == home.baseGlobal.ECG_REPARTO_PS){
                isEcg=true;
                position=k;
            }
            if(v.IDEN_ESA == home.baseGlobal.PRELIEVO_DI_SANGUE_VENOSO_IDEN_ESA){
                isLabo=true;
                position=k;
            }

        });

        var db = $.NS_DB.getTool({setup_default:{datasource:'PS',async:false}});
        var key_legame = $("#KEY_LEGAME").val();
        var sala_area = jsonData.hUbicazione == ''? eval('home.baseGlobal.SALA_DEFAULT_' + $("#COD_CDC_PS").val()) : '';

        var parametri = {
            pIdenPer:{t:'N',v: parseInt(NS_DATI_RICHIESTE.getUserIdenPer())},
            pUsername : {t:'V',v:home.baseUser.USERNAME},
            pIdenAnagrafica : {t:'N',v: NS_DATI_RICHIESTE.getIdenAnag()},
            pDataEsame : {t:'V',v:jsonSegRich.DATA_PROPOSTA},
            pOraEsame : {t:'V', v:jsonSegRich.ORA_PROPOSTA},
            pIdenCdc : {t:'N', v : parseInt($("#IDEN_CDC_PS").val()) },
            pIdenNomenclatore : {t:'V', v: stringaIdenEsami},
            pStatoEsame : {t:'N', v: 50},
            pIdenSalaArea : {t:'V', v : sala_area},
            pIdenProvenienza : {t:'N', v: parseInt(NS_DATI_RICHIESTE.getIdenProvenienza())},
            pIdenContatto : {t:'N',v: parseInt($("#IDEN_CONTATTO").val())},
            pQuadro : {t:'V', v: jsonSegRich.QUADRO},
            pQuesito : {t:'V', v: jsonSegRich.QUESITO},
            pKeyLegame : {t:'V', v: key_legame},
            pStatoPagina : {t:'V',v: $("#STATO_PAGINA").val()},
            pScheda :{t:'V', v: key_legame}
        };

        var xhr = db.call_function({
            id: "PRESTAZIONI.FNC_RICHIEDI_ESAMI",
            parameter: parametri
        });

        xhr.done(function (data, textStatus, jqXHR) {
            //data={"p_result":"OK$3008023@3008601"}
            var risp = data.p_result.split("$");

            if (risp[0] == 'OK'){
                logger.info("callRisEsami Success : " + JSON.stringify(data));

                var listaEsami = ((risp[1].match(/\@(.*)/))[1]).split(',');
                var idenEsameDettaglio = "";

                if(isEcg){
                    idenEsameDettaglio = listaEsami[position];
                }
                if(isLabo){
                    idenEsameDettaglio = listaEsami[position];
                }

                callback(null, idenEsameDettaglio);

            }else{

                logger.error("resp  KO  : Errore nella chiamata a PRESTAZIONI.FNC_RICHIEDI_ESAMI \n" + risp[1] +
                    JSON.stringify(textStatus) + "\n"+ JSON.stringify(jqXHR));
                NS_INVIA_RICHIESTE.countError++;
                callbackError();
            }

        });

        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("xhr fail : Errore nella chiamata a PRESTAZIONI.FNC_RICHIEDI_ESAMI \n" + JSON.stringify(jqXHR)+
               "\n"+ JSON.stringify(textStatus) + "\n"+ JSON.stringify(errorThrown));
            NS_INVIA_RICHIESTE.countError++;
            callbackError();
        });

    },
    /**
     * Chiamata Ajax al server HL7 Client.java
     * @param msg
     * @param callback
     * @param callbackError
     */
    chiamataHL7: function (msg,callback,callbackError) {

        home.NS_CONSOLEJS.addLogger({name: 'chiamataHL7', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['chiamataHL7'];

        $.ajax({
            type: 'POST',
            url: 'adt/Client/json/',
            dataType: 'text',
            data: JSON.stringify(msg),
            async: false,
            error: function (data) {
                NS_INVIA_RICHIESTE.countError++;
                logger.error("InviaRichieste.js chiamataHL7 non riuscita :\n"+data);
                callbackError();
            },
            success: function (data, status) {

                var result = JSON.parse(data);

                if (result.STATO == "OK") {
                    logger.info("Prestazioni inserite con successo" + JSON.stringify(result));
                    callback(Number(result.ID), null);
                } else {
                    NS_INVIA_RICHIESTE.countError++;
                    logger.error("Prestazioni non inserite " + JSON.stringify(result)+"\nstatus : "+status);
                    callbackError();
                }
            }
        });
    },

    inviaECG : function(data,ora,idenEsameDettaglio){
        var codCdc = $("#COD_CDC_PS").val();
        var jsonRepartiEcg = $.parseJSON(home.baseGlobal.ECG_REPARTI_DESTINATARI);
        var jsonEcg = jsonRepartiEcg[''+codCdc+''];
        var itemECG = {};
        var jsonSegRichECG = [];

        if(MAIN_INS_RICHIESTE.hasAValue(jsonEcg.IDEN_ESA)){
            itemECG["COD_DEC"] = jsonEcg.COD_DEC;
            itemECG["METODICA"] = jsonEcg.METODICA;
            itemECG["EROGATORE"]= jsonEcg.EROGATORE;
            itemECG["COD_CDC"] = jsonEcg.COD_CDC;
            itemECG["QUESITO"] = $("#hDescrProblemaPrinc").val();
            itemECG["QUADRO"] = "";
            itemECG["NOTE"] = "";
            itemECG["DATA_PROPOSTA"] = data;
            itemECG["ORA_PROPOSTA"] = ora;
            itemECG["ESAMI"] = [];
            itemECG["ESAMI"].push({
                "IDEN_ESA" : jsonEcg.IDEN_ESA,
                "ESAME" : jsonEcg.ESAME,
                "METODICA" : jsonEcg.METODICA,
                "URGENZA" : MAIN_INS_RICHIESTE.urgenza,
                "LATERALITA" : "",
                "IMPEGNATIVA":  "",
                "URGENZA_IMPEGNATIVA" :  "",
                "DATA_IMPEGNATIVA" :  "",
                "TIPO_IMPEGNATIVA" :  "",
                "COD_ESENZIONE" : ""
            });

            logger.info("aggiungo una prestazione di ECG in cardiologia");

            jsonSegRichECG.push(itemECG);
        }else{
            logger.error("nessun reparto di cardiologia configurato per l'ECG");
        }


        var callback = function(idEsame){
            return function(idenRichiesta){
                NS_INVIA_RICHIESTE.callCodiciEsterni(idenRichiesta, idEsame);
            }
        }(idenEsameDettaglio);

        var callbackError = function(){
            logger.error("Errore nell'incvio della prestazione associata di ECG");
            NS_LOADING.hideLoading();
        };

        NS_INVIA_RICHIESTE.creaJsonHl7(jsonSegRichECG[0],callback,callbackError);

    },

    inviaPrelievo : function(data,ora,idenRichiesta){
        var itemLABO = {};
        var jsonLoc = {};
        if(MAIN_INS_RICHIESTE.hasAValue(home) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_INFO_PAZIENTE)){
            jsonLoc = home.PANEL.NS_INFO_PAZIENTE.getJsonLocazione();
        }else{
            jsonLoc = {COD_DEC_CDC : $("#COD_DEC_CDC").val(), DESCRIZIONE: $("#DESCR_CDC").val(),COD_CDC: MAIN_INS_RICHIESTE.reparto_attuale }
        }


        var jsonSegRichLABO = [];

        itemLABO["COD_DEC"] = jsonLoc.COD_DEC_CDC;
        itemLABO["METODICA"] = "G";
        itemLABO["EROGATORE"]= jsonLoc.DESCRIZIONE;
        itemLABO["COD_CDC"] = jsonLoc.COD_CDC;
        itemLABO["QUESITO"] = "";
        itemLABO["QUADRO"] = "";
        itemLABO["NOTE"] = "";
        itemLABO["DATA_PROPOSTA"] = data;
        itemLABO["ORA_PROPOSTA"] = ora;
        itemLABO["ESAMI"] = [];
        itemLABO["ESAMI"].push({
            "IDEN_ESA" : home.baseGlobal.PRELIEVO_DI_SANGUE_VENOSO_IDEN_ESA,
            "ESAME" : "PRELIEVO DI SANGUE VENOSO",
            "METODICA" : "G",
            "URGENZA" : MAIN_INS_RICHIESTE.urgenza,
            "LATERALITA" : "",
            "IMPEGNATIVA":  "",
            "URGENZA_IMPEGNATIVA" :  "",
            "DATA_IMPEGNATIVA" :  "",
            "TIPO_IMPEGNATIVA" :  "",
            "COD_ESENZIONE" : ""
        });

        logger.info("aggiungo una prestazione di prelievo");
        jsonSegRichLABO.push(itemLABO);

        var callback = function(idRichiesta){
            return function(idRichiestaInutile, idenEsameDettaglio){
                NS_INVIA_RICHIESTE.callCodiciEsterni(idRichiesta, idenEsameDettaglio);
            }
        }(idenRichiesta);

        var callbackError = function(){
            logger.error("Errore nell'incvio della prestazione associata di LABO");
            NS_LOADING.hideLoading();
        };

        NS_INVIA_RICHIESTE.callRisEsami(jsonSegRichLABO[0],callback,callbackError);

    },

    setEsamiForensi : function(json){

        var params = {
            "P_IDEN_CONTATTO" : {t:"N", v:$("#IDEN_CONTATTO").val()},
            "P_KEY_LIST" : {v:['ESAMI_FORENSI'],t:'A'},
            "P_VALUE_LIST" : {v:['S'],t:'A'},
            "P_TYPE_LIST" : {v:['S'],t:'A'}
        };

        var parametri = {
            "datasource": "PS",
            id: "ADT$ADT_CONTATTI.UPDATE_METADATI_CONTATTO",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.PROCEDURE(parametri);

        function callbackOk(data) {
            logger.info("seTesamiForensi.callbackOK : "+ JSON.stringify(data));
            json.callback();
        }
    },

    setCodiciEsterni : function(json){

        var params = {
            "pIdenTabella" :  {t:"N", v: json.pIdenTabella},
            "pCodice1"     :  {t:"N", v: json.pCodice1},
            "pCodice2"     :  {t:"N", v: json.pCodice2},
            "pNomeTabella" :  {t:"V", v: json.pNomeTabella},
            "pDescrizione" :  {t:"V", v: json.pDescrizione},
            "pResult"      :  {d:"O", t: "V"}
        };

        var parametri = {
            "datasource": "PS",
            id: "INSERT_CODICI_ESTERNI_TABELLE",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.PROCEDURE(parametri);

        function callbackOk(data) {
            logger.info("Inserito in CODICI_ESTERNI_TABELLE con iden " +data.pResult);
            json.callback();
        }
    },

    callCodiciEsterni : function(idenTestataRichiesta, idenEsamiDettaglio){



        NS_INVIA_RICHIESTE.setCodiciEsterni({
            "pIdenTabella" : idenTestataRichiesta,
            "pCodice1"     : idenEsamiDettaglio,
            "pCodice2"     : $("#IDEN_CONTATTO").val(),
            "pNomeTabella" : "INFOWEB.TESTATA_RICHIESTE",
            "pDescrizione" : "idenTestataRichiesta = iden_tabella, idenEsamiDettaglio = Codice_1",
            "callback"              : function(){
                NS_INVIA_RICHIESTE.setCodiciEsterni({
                    "pIdenTabella" :  idenEsamiDettaglio,
                    "pCodice1"     :  idenTestataRichiesta,
                    "pCodice2"     : $("#IDEN_CONTATTO").val(),
                    "pNomeTabella" : "POLARIS_DATI.ESAMI_DETTAGLIO",
                    "pDescrizione" : "idenEsamiDettaglio = iden_tabella, idenTestataRichiesta = Codice_1",
                    "callback"              : function(){
                        //NS_INVIA_RICHIESTE.idenTestataRichiesta = null;
                       // NS_INVIA_RICHIESTE.idenEsamiTestata = null;
                        //NS_INVIA_RICHIESTE.idenEsamiDettaglio = null;
                    }
                });
            }
        });
    },

    formattaOra : function(value){
        var ora = (value).split(":");
        return ora[0] + ora[1];
    }

    /*addListaInviati : function(msg){

        var iden_richiesta = (msg.match(/\$(.*)\@/))[1];

        var esami = ((msg.match(/\@(.*)/))[1]).split(',');

        var item={};

        item["IDEN_RICHIESTA"] = iden_richiesta;

        item["ESAMI"] = [];

        for(var i=0; i < esami.length; i++ )
        {
            item["ESAMI"].push({"IDEN_ESA" : esami[i]});
        }

        NS_INVIA_RICHIESTE.listaInviati.push(item);

    }*/
};