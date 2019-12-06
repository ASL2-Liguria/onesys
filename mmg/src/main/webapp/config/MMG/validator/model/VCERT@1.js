var VCERT =
{
    elements:
    {
    	txtUsername:
        {
            status: "required",
            name: "Codice Fiscale paziente"
        },
    	txtPwd:
        {
            status: "required",
            name: "Password"
        },
        txtPin:
        {
            status: "required",
            name: "PIN"
        },
        txtIndirizzo:
        {
            status: "required",
            name: "Indirizzo"
        },
        txtCivico:
        {
            status: "required",
            name: "Civico"
        },
        txtCAP:
        {
            status: "required",
            name: "CAP",
            	rules:
                {
                    number:true
                }
        },
        txtComune:
        {
            status: "required",
            name: "Comune"
        },
        txtProvincia:
        {
            status: "required",
            name: "Provincia"
        },
        txtDataRilascio:
        {
            status: "required",
            name: "Data Rilascio"
        },
        txtDataMalattia:
        {
            status: "required",
            name: "Data Inizio"
        },
        txtDataFine:
        {
            status: "required",
            name: "Data Fine"
        },
        /*txtCodDiagnosi:
        {
            status: "required",
            name: "COD Diagnosi"
        },*/
        /***********dalle prove svolte SEMBRA che txtCodDiagnosi, txtNoteDiagnosi e txtDataRilascio NON siano obbligatori...*******/
        /*txtDiagnosi:
        {
            status: "required",
            name: "Diagnosi"
        },*/
        /*txtNoteDiagnosi:
        {
            status: "required",
            name: "Note Diagnosi"
        },*/
        "h-radRuolo":
        {
            status: "required",
            name: "Ruolo"
        },
        hCodReg:
        {
            status: "required",
            name: traduzione.erroreCodReg
        },
        hCodAsl:
        {
            status: "required",
            name: traduzione.erroreCodAsl
        },
        "h-radTipoVisita":
        {
            status: "required",
            name: "Tipo Visita"
        },
        "h-radTipoCertificato":
        {
            status: "required",
            name: "Tipo Certificato"
        }/*,
        "h-radAgevolazione":
        {
            status: "required",
            name: "Tipo Agevolazione"
        },*/
        /*hdiff:
        {
            status: "required",
            name: traduzione.lblDataDiff,
            rules:
            {
                number:true
            },
            messages:{
            	number:"Ciao"
            }
        }*/
    }
};