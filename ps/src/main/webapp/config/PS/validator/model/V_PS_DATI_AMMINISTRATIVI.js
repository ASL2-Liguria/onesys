/*
 specifiche campi obligatori :

 GESTIONE OBLIGATORIETA'
 MEZZO INCIDENTE -> obbligatorio solo in caso di mezzo di arrivo = "incidente stradale" / "incidente stradale + infortunio"
 DATA EVENTO -> obbligatorio solo in caso di mezzo di arrivo = "incidente stradale" / "incidente stradale + infortunio"
 LOCALITA' EVENTO -> obbligatorio solo in caso di mezzo di arrivo = "incidente stradale" / "incidente stradale + infortunio"
 CODICE MISSIONE -> obbligatorio se il campo MODALITA' ARRIVO è "CENTRALE OPERATIVA 118" e campo MEZZO DI ARRIVO = 01 - "AMBULANZA 118", 04 - "ELICOTTERO 118", 06 - "MEZZO DI SOCCORSO 118 ALTRE REGIONI"
 Codice identificativo della Centrale Operativa -> obbligatorio se il campo MODALITA' ARRIVO è "CENTRALE OPERATIVA 118" e campo MEZZO DI ARRIVO = 01 - "AMBULANZA 118", 04 - "ELICOTTERO 118", 06 - "MEZZO DI SOCCORSO 118 ALTRE REGIONI"
 PRESIDIO DI PROVENIENZA ->
 Da compilare solo se il campo Modalità di accesso al triage contiene il valore
 06 (Reparto ospedaliero afferente al presidio ospedaliero del PS medesimo),
 08 (Trasferimento da altra struttura di ricovero pubblica) o
 09 (Trasferimento da casa di cura privata);
 PROBLEMA PRINCIPALE -> obbligatorio sempre;
 MODALITA' ARRIVO -> obbligatorio sempre;
 comune infortunio ??
 COMUNE EVENTO -> obbligatorio solo in caso d'infortunio (02,06,09) e di incidente (05,16)
 */

var V_PS_DATI_AMMINISTRATIVI =
{
    elements: {
        cmbModArrivo: {
            status: "required",
            name: "modalita arrivo",
            tab: "tabDati",
            events: {
                change: function (ctx) {
                    var v = $(this).val();
                    var vMezzoArrivo = $("#cmbMezzoArrivo").find("option:selected").val();
                    if(v == 13){
                        ctx.data._attachStatus($("#cmbMezzoArrivo"), {"status": "required"});

                        if(vMezzoArrivo == '01' || vMezzoArrivo == '06') {
                            ctx.data._attachStatus($("#txtProgressivoMissione"), {"status": "required"});
                            ctx.data._attachStatus($("#cmbCodIdentificativo"), {"status": "required"});
                            ctx.data._attachStatus($("#cmbTriageAcc"), {"status": "required"});
                        } else if(vMezzoArrivo == '04') {
                            ctx.data._attachStatus($("#cmbCodIdentificativo"), {"status": "required"});
                            ctx.data.removeStatus($("#txtProgressivoMissione"));
                            ctx.data.removeStatus($("#cmbTriageAcc"));
                        } else {
                            ctx.data.removeStatus($("#txtProgressivoMissione"));
                            ctx.data.removeStatus($("#cmbCodIdentificativo"));
                            ctx.data.removeStatus($("#cmbTriageAcc"));

                        }
                    }else{
                        ctx.data.removeStatus($("#cmbMezzoArrivo"));
                        $("#cmbMezzoArrivo").val('');
                        ctx.data.removeStatus($("#txtProgressivoMissione"));
                        ctx.data.removeStatus($("#cmbCodIdentificativo"));
                        ctx.data.removeStatus($("#cmbTriageAcc"));

                    }
                    if (v == '06' || v == '08' || v == '09') {
                        ctx.data._attachStatus($("#cmbPresidio"), {"status": "required"});
                    } else {
                        ctx.data.removeStatus($("#cmbPresidio"));
                    }
                }
            }
        },
        cmbMezzoArrivo: {
            name: "mezzo arrivo",
            tab: "tabDati",
            events: {
                change: function (ctx) {
                    var v = $(this).val();
                    if ((v == '01' || v == '06')) {
                        ctx.data._attachStatus($("#txtProgressivoMissione"), {"status": "required"});
                        ctx.data._attachStatus($("#cmbCodIdentificativo"), {"status": "required"});
                        ctx.data._attachStatus($("#cmbTriageAcc"), {"status": "required"});
                    } else if(v == '04') {
                        ctx.data._attachStatus($("#cmbCodIdentificativo"), {"status": "required"});
                        ctx.data.removeStatus($("#txtProgressivoMissione"));
                        ctx.data.removeStatus($("#cmbTriageAcc"));
                    } else {
                        ctx.data.removeStatus($("#txtProgressivoMissione"));
                        ctx.data.removeStatus($("#cmbCodIdentificativo"));
                        ctx.data.removeStatus($("#cmbTriageAcc"));
                    }
                }
            }
        },
        cmbMotivoIngresso: {
            status: "required",
            name: "motivo ingresso",
            tab: "tabDati",
            events: {
                change: function (ctx) {
                    var v = $(this).val();
                    var mezzoIncidente = $("#cmbMezzoIncidente");
                    if (v == 5 || v == 16) {
                        ctx.data._attachStatus(mezzoIncidente, {"status": "required"});
                        ctx.data._attachStatus($("#txtDataEvento"), {"status": "required"});
                        ctx.data._attachStatus($("#txtOraEvento"), {"status": "required"});
                        ctx.data._attachStatus($("#taDescrLocEvento"), {"status": "required"});
                    } else {
                        mezzoIncidente.val("");
                        ctx.data.removeStatus(mezzoIncidente);
                        ctx.data.removeStatus($("#txtDataEvento"));
                        ctx.data.removeStatus($("#txtOraEvento"));
                        ctx.data.removeStatus($("#taDescrLocEvento"));
                    }
                    if (v == '02' || v == '06' || v == '09' || v == '05' || v == '16' || v == '04') {
                        ctx.data._attachStatus($("#txtComuneEv"), {"status": "required"});
                        ctx.data._attachStatus($("#taDichiarazione"), {"status": "required"});
                        ctx.data._attachStatus($("#txtDataEvento"), {"status": "required"});
                        ctx.data._attachStatus($("#txtOraEvento"), {"status": "required"});
                    } else {
                        ctx.data.removeStatus($("#txtComuneEv"));
                        ctx.data.removeStatus($("#taDichiarazione"));
                        ctx.data.removeStatus($("#txtDataEvento"));
                        ctx.data.removeStatus($("#txtOraEvento"));
                    }
                }
            }
        },
        chkIntAutoritaGiu: {
            status: null,
            name: "Interesse autorità giudiziaria",
            tab: "tabDati",
            events: {
                click: function (ctx) {

                    var v = $(this).find('div');
                    var autorita = $("#cmbAutorita");

                    if (v.hasClass('CBpulsSel')) {

                        ctx.data._attachStatus(autorita, {"status": "required"});

                    } else {

                        ctx.data.removeStatus(autorita);

                    }

                }
            }
        },
        cmbPresidio:{
            status: "",
            name: "Presidio Provenienza",
            tab: "tabDati"
        },
        cmbProbPrinc: {
            status: "required",
            name: "Problema Principale",
            tab: "tabDati"
        },
        cmbMezzoIncidente: {
            name: "Mezzo incidente",
            tab: "tabDati"
        },
        cmbCodIdentificativo: {
            name: "Codice Identificativo",
            tab: "tabDati"
        },
        cmbTriageAcc: {
            name: "Codice Colore",
            tab: "tabDati"
        },
        cmbAutorita: {
            name: "Autorita",
            tab: "tabDati"
        },
        cmbOnere: {
            name: "Onere",
            status: "required",
            tab: "tabDati"
        },
        txtComuneEv:{
            name: "Comune evento",
            tab: "tabDati"
        },
        taDescrLocEvento:{
            name: "Descrizione localita evento",
            tab: "tabDati"
        },
        txtProgressivoMissione: {
            name: "Progressivo Missione",
            tab: "tabDati"
        },
        txtDataIngresso: {
            status: "required",
            name: "Data Ingresso",
            tab: "tabDati"
        },
        txtDataEvento: {
            name: "Data Evento",
            tab: "tabDati"
        },
        txtOraIngresso: {
            status: "required",
            name: "Ora Ingresso",
            tab: "tabDati"
        },
        txtOraEvento: {
            name: "Ora Evento",
            tab: "tabDati"
        },
        taDichiarazione: {
            name: "Dichiarazione",
            tab: "tabDati"
        },
        "h-radIntAutoritaGiu": {
            name: "interesse autorità giudiziaria",
            tab: "tabDati",
            events: {
                change: function (ctx) {
                    var v = $(this).val();
                    if (v == 'S') {
                        ctx.data._attachStatus($("#cmbAutorita"), {"status": "required"});
                        ctx.data._attachStatus($("#txtComuneEv"), {"status": "required"});
                    } else {
                        ctx.data.removeStatus($("#cmbAutorita"));
                        ctx.data.removeStatus($("#txtComuneEv"));
                    }
                }
            }
        }
    }
};
