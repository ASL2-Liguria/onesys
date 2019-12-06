var V_ADT_ACC_RICOVERO =
{
    elements:
    {
        cmbRegime :
        {
            status : "required",
            name : "Regime di ricovero",
            tab : "tabRicovero",
            events : {
            	change : function(ctx) { /* La gestione degli eventi viene gestita dalla pagina a causa delle innumerevoli variabili che intervengono sul validator */}
            }
        },
        cmbTipoRico:
        {
        	status : "required",
            name : "Tipo di ricovero",
            tab : "tabRicovero"
        },
        txtPesoNascita:
        {
        	name : "Peso alla nascita",
            tab : "tabRicovero"
        },
        cmbTipoNeonato:
        {
        	name : "Tipo neonato",
            tab : "tabRicovero"
        },
        txtCategoriaCausaEsterna:
        {
            name : "Categoria causa esterna",
            tab : "tabRicovero"
        },
        cmbCausaEsterna:
        {
            name : "Causa esterna",
            tab : "tabRicovero"
        },
        cmbRepartoRico:
        {
            status : "required",
            name : "Reparto giuridico di ricovero",
            tab : "tabRicovero"
        },
        cmbRepartoAss:
        {
            status : "required",
            name : "Reparto assistenziale di ricovero",
            tab : "tabRicovero"
        },
        txtDataRico:
        {
            status : "required",
            name : "Data di ricovero",
            tab : "tabRicovero"
        },
        txtDataPren:
        {
            /* status: "required", */
            name : "Data Prenotazione",
            tab : "tabRicovero"
        },
         "h-cmbLivelloUrg":{
        	name : "Priorita",
            tab : "tabRicovero"
        },
        txtOraRico:
        {
            status : "required",
            name : "Ora di ricovero",
            tab : "tabRicovero"
        },
        cmbMotivoRico:
        {
            status : "required",
            name : "Motivo di ricovero",
            tab : "tabRicovero"
        },
        txtMedicoAcc:
        {
            status : "required",
            name : "Medico accettante",
            tab : "tabRicovero"
        },
        "h-txtMedicoAcc":
        {
            status : "required",
            name : "Medico accettante",
            tab : "tabRicovero"
        },
        txtDiagnosiAcc:
        {
            status : "required",
            name : "Diagnosi testuale",
            tab : "tabRicovero"
        },
        cmbTipoMedicoPresc:
        {
            status : "required",
            name : "Tipo medico prescrivente",
            tab : "tabRicovero"
        },
        cmbTrauma :
        {
            events : {
                change : function (ctx) {
                	
                	if ($(this).find("option:selected").val() != "" && $(this).find("option:selected").val() != null) 
                    {
                        ctx.data._attachStatus($("#txtCategoriaCausaEsterna"), {"status": "required"});
                        ctx.data._attachStatus($("#cmbCausaEsterna"), {"status": "required"});
                    }
                    else
                    {
                    	ctx.data.removeStatus($("#txtCategoriaCausaEsterna"), {"status": "required"});
                    	ctx.data.removeStatus($("#cmbCausaEsterna"), {"status": "required"});
                    }
                }
            }
        },  
        cmbTrauma :
        {
            events : {
                change : function (ctx) {
                	
                	if ($(this).find("option:selected").val() != "" && $(this).find("option:selected").val() != null) 
                    {
                        ctx.data._attachStatus($("#txtCategoriaCausaEsterna"), {"status": "required"});
                        ctx.data._attachStatus($("#cmbCausaEsterna"), {"status": "required"});
                    }
                    else
                    {
                    	ctx.data.removeStatus($("#txtCategoriaCausaEsterna"), {"status": "required"});
                    	ctx.data.removeStatus($("#cmbCausaEsterna"), {"status": "required"});
                    }
                }
            }
        },  
        cmbOnere:
        {
            status : "required",
            name : "Onere",
            tab : "tabRicovero",
            events : 
            {
                change:function(ctx){
                    
                	if ($(this).find("option:selected").attr("data-codice") == "9") 
                    {
                        ctx.data._attachStatus($("#cmbSubOnere"), {"status": "required"});
                    }
                    else
                    {
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
        cmbProvenienza:
        {
            status : "required",
            name : "Provenienza",
            tab : "tabRicovero"
        },
        cmbTitoloStudio:
        {
            status : "required",
            name : "Titolo di studio",
            tab : "tabRicovero"
        },
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
        "h-txtLuogoNasc" : {
            status: "required",
            name  : "Comune nascita",
            tab   : "tabAnagrafica"
        },
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
        "h-radAnagSesso":{
            status: "required",
            name: "Sesso",
            tab:"tabAnagrafica"
        },
          "txtComuneRes" : {
            status: "required",
            name: "Comune Residenza",
            tab:"tabAnagrafica"
        },
        "h-txtComuneRes" : {
            status: "required",
            name: "Comune Residenza",
            tab:"tabAnagrafica"
        },
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
        "h-txtASLResidenza":{
       	 status: "required",
            name: "ASL di Residenza",
            tab:"tabAnagrafica"
       },
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
        "h-txtTitoloStudio":
        {
            status: "required",
            name: "Titolo di studio",
            tab:"tabAnagrafica"
        },
        "txtStatoCivile":{
        	status: "required",
            name: "Stato civile",
            tab:"tabAnagrafica"
        },
        "h-txtStatoCivile":{
        	status: "required",
            name: "Stato civile",
            tab:"tabAnagrafica"
        },
        "txtCitt0":{
        	status: "required",
            name: "Cittadinanza",
            tab:"tabAnagrafica"
        },
        "h-txtCitt0":{
        	status: "required",
            name: "Cittadinanza",
            tab:"tabAnagrafica"
        }
    }
    
};
