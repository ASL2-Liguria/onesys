var V_CONSENSO_UNICO = {
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
        }*/,
        "h-radScelta1A": {
            status: "required",
            name: "Trattamento dati"
        },
        "h-radScelta2A2": {
            status: "required",
            name: "Inserimento dati futuri"
        },
        "h-radScelta2A3": {
            status: "required",
            name: "Inserimento dati pregessi"
        }
    }
};