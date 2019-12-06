/**
 * Created by alberto.mina on 23/03/2015.
 */
var V_FARMACI =
{
    elements:
    {
        "checkMedico": {
            status: "",
            name: "Medico",
            tab: "tabDati",
            events: {
                click: function (ctx) {
                    if(home.baseUser.TIPO_PERSONALE == 'I' || home.baseUser.TIPO_PERSONALE == 'OST') {
                        ctx.data._attachStatus($("#txtMedico"), {"status": "required"});
                    }

                }
            }

        },

        "checkInfermiere": {
            status: "",
            name: "Infermiere",
            tab: "tabDati",
            events: {
                click: function (ctx) {
                    if(home.baseUser.TIPO_PERSONALE == 'I') {
                        ctx.data.removeStatus($("#txtMedico"));
                    }


                }
            }

        },
        "txtMedico": {
            status: "",
            name: "Medico",
            tab: "tabDati"

        }
    }
};