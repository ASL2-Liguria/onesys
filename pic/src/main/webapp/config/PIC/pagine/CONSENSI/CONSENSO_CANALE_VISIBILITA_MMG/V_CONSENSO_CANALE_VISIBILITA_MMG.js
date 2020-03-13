var V_CONSENSO_CANALE_VISIBILITA_MMG = {
    elements: {
        txtDataDichiarazione: {
            status: "required",
            name: "Data dichiarazione"
        },
        /*txtOperatoreRegistrazione:{
            status:"readonly"
        },*/
        txtOperatoreDichiarazione:{
            status: "required",
            name: "Operatore dichiarazione"
        },
        txtSottoscrittoNome: {
            status: "required",
            name: "Sottoscritto - nome"
        },
        txtSottoscrittoCognome: {
            status: "required",
            name: "Sottoscritto - cognome"
        },
        txtSottoscrittoLuogoNascita: {
            status: "required",
            name: "Sottoscritto - luogo nascita"
        },
        txtSottoscrittoDataNascita: {
            status: "required",
            name: "Sottoscritto - data nascita",
            events:{

                change: function() {
                	
                	var dataNascita = $("#h-txtSottoscrittoDataNascita").val();
                	var data_maggiorenne = moment(dataNascita, "YYYYMMDD").add(18, 'years').format('YYYYMMDD');
                    var data_odierna = moment().format('YYYYMMDD');

                    if(data_odierna < data_maggiorenne && dataNascita != ''){
                    	home.NOTIFICA.error({
                            message	: "La persona che compila la sezione 'Sottoscritto' deve essere maggiorenne!",
                            title	: "Attenzione!",
                            timeout : 8
                        });
                    	$("#h-txtSottoscrittoDataNascita").val('');
                    	$("#txtSottoscrittoDataNascita").val('');
                    }
                }
            }
        }/*,
        txtSottoscrittoCodiceFiscale: {
            status: "required",
            name: "Sottoscritto - codice fiscale"
        },
        "h-radConsensoMMGFuturo": {
            status: "required",
            name: "Consenso esami, referti e documenti DA ORA IN POI"
        },
        "h-radConsensoMMGPassato": {
            status: "required",
            name: "Consenso esami, referti e documenti DAL 2002 AD OGGI"
        }*/
    }
};