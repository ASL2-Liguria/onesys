var V_PS_GIUNTO_CADAVERE = {

    elements: {

        "h-radConstatazioneGiunto": {
            status: "required",
            name: "Causa Morte",
            tab : "tabDati"
            /*events: {
                change : function (ctx) {

                    var valore =  $(this).val();
                    var testo = $("#txtAltro");


                    if (valore==="CAUSA_INDETERMINATA") {

                        ctx.data._attachStatus(testo, {"status": "required"});

                    } else {

                        ctx.data.removeStatus(testo);

                    }

                }
            }*/
        },
        "txtAltro" : {
            name: "Testo Specifica",
            tab : "tabDati",
            status: "required"
        }

    }
};