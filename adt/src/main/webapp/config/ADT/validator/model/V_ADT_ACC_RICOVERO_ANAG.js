var V_ADT_ACC_RICOVERO_ANAG =
{
    elements:
    {
        "txtAnagCognome" : {
            status: "required",
            name: "Cognome",
            tab:"tabAnagrafica"
        },
        "txtAnagNome" : {
            status: "required",
            name: "Nome",
            tab:"tabAnagrafica"
        },
        "txtAnagDataNasc" : {
            status: "required",
            name: "Data di nascita",
            tab:"tabAnagrafica"
        },
        "txtLuogoNasc" : {
            status: "required",
            name  : "Comune nascita",
            tab   : "tabAnagrafica"
        },
        //"h-txtLuogoNasc" : {
        //    status: "required",
        //    name  : "Comune nascita",
        //    tab   : "tabAnagrafica"
        //},
        "txtAnagCodFisc" : {
            status: "required",
            name: "Codice fiscale",
            rules:
            {
                minlength:16,
                maxlength:16
            },
            tab:"tabAnagrafica"
        },
        //"h-radAnagSesso":{
        //    status: "required",
        //    name: "Sesso",
        //    tab:"tabAnagrafica"
        //},
          "txtComuneRes" : {
            status: "required",
            name: "Comune Residenza",
            tab:"tabAnagrafica"
        },
        //"h-txtComuneRes" : {
        //    status: "required",
        //    name: "Comune Residenza",
        //    tab:"tabAnagrafica"
        //},
        "txtIndRes" : {
            status: "required",
            name: "Indirizzo",
            tab:"tabAnagrafica"
        },
        "txtCAPRes" : {
            status: "required",
            name: "CAP",
            tab:"tabAnagrafica"
        },
          "txtASLResidenza":{
        	 status: "required",
             name: "ASL di Residenza",
             tab:"tabAnagrafica"
        },
        //"h-txtASLResidenza":{
        //  	 status: "required",
        //       name: "ASL di Residenza",
        //       tab:"tabAnagrafica"
        //  },
        "txtCodiceRegioneRes":{
       	 status: "required",
         name: "Regione di Residenza",
         tab:"tabAnagrafica"
        },
       "txtTitoloStudio":
        {
            status: "required",
            name: "Titolo di studio",
            tab:"tabAnagrafica"
        },
        //"h-txtTitoloStudio":
        //{
        //    status: "required",
        //    name: "Titolo di studio",
        //    tab:"tabAnagrafica"
        //},
        "txtStatoCivile":{
        	status: "required",
            name: "Stato civile",
            tab:"tabAnagrafica"
        },
        //"h-txtStatoCivile":{
        //	status: "required",
        //    name: "Stato civile Nascosto",
        //    tab:"tabAnagrafica"
        //},
        "txtCitt0":{
        	status: "required",
            name: "Cittadinanza",
            tab:"tabAnagrafica"
        }
        //"h-txtCitt0":{
        //	status: "required",
        //    name: "Cittadinanza NAscosta",
        //    tab:"tabAnagrafica"
        //}
    }
};
