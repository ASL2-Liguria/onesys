var V_CARTELLA_STORICA =
{
    elements:
    {
        txtAnno :
        {
            status : "required",
            name : "Anno",
            tab : "tabRicovero"
        },
        txtStruttura :
        {
            status : "required",
            name : "Struttura",
            tab : "tabRicovero"
        },
        txtCartella :
        {
            status : "required",
            name : "Cartella",
            tab : "tabRicovero"
        },
        txtCodice :
        {
            status : "required",
            name : "Codice",
            tab : "tabRicovero"
        },
        txtDataRicovero : {
            status : "required",
            name : "Data di ricovero",
            tab : "tabRicovero"
        },
        cmbRegimeRicovero :
        {
            status : "required",
            name : "Regime di ricovero",
            tab : "tabRicovero",
            events : {
            	change : function(ctx) {

                    var _regime = $(this).find("option:selected").val();

                    logger.debug("Cartella Pregressa - Evento change combo regime - Regime selezonato -> " + _regime);

                    NS_REGIME_TIPO_MOTIVO_RICOVERO.setTipoFromRegime();

                    logger.debug("Cartella Pregressa - Evento change combo regime - Valorizzato -> " + _regime);

                    NS_REGIME_TIPO_MOTIVO_RICOVERO.SHDatiPrimoAccessoDH(_regime);

                    logger.debug("Cartella Pregressa - Evento change combo regime - Regime selezonato -> " + _regime);

                    $('#acRepartoGiuridico').val("").data('acList').changeBindValue({"regime_abilitato":_regime});
                    $('#txtRepartoGiuridico').val("").data('autocomplete').changeBindValue({"regime_abilitato":_regime});
                    $('#h-txtRepartoGiuridico').val("");

                    $('#acRepartoGiuridicoDimissione').val("").data('acList').changeBindValue({"regime_abilitato":_regime});
                    $('#txtRepartoGiuridicoDimissione').val("").data('autocomplete').changeBindValue({"regime_abilitato":_regime});
                    $('#h-txtRepartoGiuridicoDimissione').val("")

                    if (_regime == "2")
                    {
                        V_CARTELLA_STORICA.elements.txtDataFineAccesso.status = "required";
                        V_CARTELLA_STORICA.elements.txtOraFineAccesso.status = "required";

                        ctx.data._attachStatus($("#txtDataFineAccesso"), {"status": "required"});
                        ctx.data._attachStatus($("#txtOraFineAccesso"), {"status": "required"});

                        V_CARTELLA_STORICA.elements.txtDataTrasferimento.status = "";
                        V_CARTELLA_STORICA.elements.txtOraTrasferimento.status = "";

                        ctx.data.removeStatus($("#txtDataTrasferimento"));
                        ctx.data.removeStatus($("#txtOraTrasferimento"));

                        $("#txtDataFineAccesso").val($("#txtDataRicovero").val());
                        $("#h-txtDataFineAccesso").val($("#h-txtDataRicovero").val());
                    }
                    else
                    {
                        V_CARTELLA_STORICA.elements.txtDataFineAccesso.status = "";
                        V_CARTELLA_STORICA.elements.txtOraFineAccesso.status = "";

                        ctx.data.removeStatus($("#txtDataFineAccesso"));
                        ctx.data.removeStatus($("#txtOraFineAccesso"));
                    }
                }
            }
        },
        txtRepartoGiuridico:
        {
            status : "required",
            name : "Reparto giuridico di ricovero",
            tab : "tabRicovero"
        },
        cmbOnere:
        {
            /* status : "required", */
            name : "Onere",
            tab : "tabRicovero",
            events : 
            {
                change:function(ctx){

                	if ($(this).find("option:selected").attr("data-codice") == "9") {
                        ctx.data._attachStatus($("#cmbSubOnere"), {"status": "required"});
                    } else {
                        ctx.data.removeStatus($("#cmbSubOnere"));
                    }
                }
            }
        },
        cmbSubOnere:
        {
            /* status: "required", */
            name : "Sub Onere",
            tab : "tabRicovero"
        },
        txtDataTrasferimento:
        {
            /* status : "required", */
            name : "Data Trasferimento",
            tab : "tabRicovero"
        },
        txtOraTrasferimento:
        {
            /* status : "required", */
            name : "Ora Trasferimento",
            tab : "tabRicovero"
        },
        txtDataFineAccesso :
        {
            /* status: "required", */
            name : "Data fine accesso",
            tab : "tabRicovero"
        },
        txtOraFineAccesso :
        {
            /* status: "required", */
            name : "Ora fine accesso",
            tab : "tabRicovero"
        },
        txtRepartoGiuridicoDimissione:
        {
            status : "required",
            name : "Reparto giuridico di ricovero",
            tab : "tabRicovero"
        }
    }
};
