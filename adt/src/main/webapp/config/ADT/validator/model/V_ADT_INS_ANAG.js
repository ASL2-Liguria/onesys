var V_ADT_INS_ANAG = 
{
    elements : {
        "txtCognome" : {
            status: "required",
            name: "Cognome",
            tab:"tabDatiPrincipali"
        },
        "txtNome" : {
            status: "required",
            name: "Nome",
            tab:"tabDatiPrincipali"
        },
        "txtDataNasc" : {
            status: "required",
            name: "Data di nascita",
            tab:"tabDatiPrincipali"
        },
        "txtLuogoNasc" : {
            status: "required",
            name  : "Comune nascita",
            tab   : "tabDatiPrincipali"
        },
        "txtCodFisc" : {
            status: "required",
            name: "Codice fiscale",
            rules:
            {
                minlength:16,
                maxlength:16
            },
            tab:"tabDatiPrincipali"
        },
        "h-radSesso":{
            status: "required",
            name: "Sesso",
            tab:"tabDatiPrincipali"
        },
        "txtNaz" : {
            status: "required",
            name: "Nazionalita'",
            tab:"tabDatiPrincipali"
        },
        "txtComuneRes" : {
            status: "required",
            name: "Comune Residenza",
            tab:"tabResDom"
        },
        "txtIndRes" : {
            status: "required",
            name: "Indirizzo",
            tab:"tabResDom"
        },
        "txtCAPRes" : {
            status: "required",
            name: "CAP",
            tab:"tabResDom"
        },
        "txtUSLAss":{
            status: "required",
            name: "ASL",
            tab:"tabDatiPrincipali"
        },
        /*"txtIndDom":{
       	 status: "required",
            name: "Indirizzo Domicilio",
            tab:"tabResDom"
       },*/
       "txtASLResidenza":{
        	 status: "required",
             name: "ASL di Residenza",
             tab:"tabResDom"
        },
        "txtCodiceRegioneRes":{
       	 	status: "required",
            name: "Regione di Residenza",
            tab:"tabResDom"
        }/*,
        "txtComuneDom":{
          	 status: "required",
             name: "Comune Domicilio",
             tab:"tabResDom"
        }*/
    }
};
