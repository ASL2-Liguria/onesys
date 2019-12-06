var V_PERSONALE =
{
    elements: {
        txtNome: {
            status: "required",
            name: "Nome",
            rules: {
                maxlength: 90
            }

        },
        txtCognome: {
            status: "required",
            name: "Cognome",
            rules: {
                maxlength: 90
            }

        },
        txtCodiceDecodifica: {
            status: "required",
            name: "Codice Decodifica",
            rules: {
                maxlength: 45
            }
        },
        txtCodiceFiscale: {
            name: "Codice Fiscale",
            rules: {
                maxlength: 16
            }
        }

    }
};