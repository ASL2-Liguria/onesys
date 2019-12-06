var V_PS_INAIL =
{
    elements: {
        txtDataAbb: {
            status: "required",
            name: "Data abbandono",
            tab: "tabDati"
        },
        txtDataEvento: {
            status: "required",
            name: "Data abbandono",
            tab: "tabDati"
        },
        txtComuneEv: {
            status: "required",
            name: "Data abbandono",
            tab: "tabDati"
        },
        txtCivico: {
            status: "required",
            name: "Numero Civico",
            tab: "tabDati"
        },
        txtOraAbb: {
            status: "required",
            name: "Ora abbandono",
            tab: "tabDati"
        },
        cmbSettoreLav: {
            status: "required",
            name: "Settore lavorativo",
            tab: "tabDati"
        },

        "h-radPrognosi":{
            status: "",
            name: "Tipo prognosi",
            tab: "tabDati",
            events: {
                change: function (ctx) {

                    var v = $(this).val();

                    if ((v == '1')) {
                        ctx.data._attachStatus($("#txtDataFino"), {"status": "required"});
                        ctx.data._attachStatus($("#txtDataProg"), {"status": "required"});
                        ctx.data._attachStatus($("#txtProgGiorni"), {"status": "required"});
                    } else if ((v == '0')) {
                        ctx.data.removeStatus($("#txtDataFino"));
                        ctx.data.removeStatus($("#txtProgGiorni"));
                        ctx.data._attachStatus($("#txtDataProg"), {"status": "required"});
                    } else {
                        ctx.data.removeStatus($("#txtDataFino"));
                        ctx.data.removeStatus($("#txtDataProg"));
                        ctx.data.removeStatus($("#txtProgGiorni"));
                    }
                }
            }
        },
        "txtDataProg" : {
            name: "Data inizio prognosi",
            tab: "tabDati"
        },
        "txtDataFino" : {
            name: "Data fine prognosi",
            tab: "tabDati"
        },
        "txtProgGiorni" :{
            name: "Giorni prognosi",
            tab: "tabDati"
        },
        "txtLuogoRil" :{
            status: "required",
            name: "Giorni prognosi",
            tab: "tabDati"
        }

    }
};