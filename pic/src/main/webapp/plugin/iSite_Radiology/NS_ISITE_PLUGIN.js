/*$(document).ready(function ()
{
    NS_ISITE_PLUGIN.init();
});

var NS_ISITE_PLUGIN = {

    opener: null,

    init: function()
    {
        NS_ISITE_PLUGIN.opener = opener;
        home.NS_ISITE_PLUGIN = this;
    },

    logout: function()
    {
        home.NS_FENIX_TOP.logout('LOGOUT');
    },
    apriDatiEsecuzione: function(id_dicom)
    {
        try{
            var datiEsame = NS_ISITE_PLUGIN.leggiDatiEsame(id_dicom);
            if(!datiEsame) return;
            if(datiEsame.length == 0)
            {
                home.logger.warn("Esame non trovato [id_dicom=" + id_dicom + "]");

                home.NOTIFICA.warning({
                    message: "Esame non trovato",
                    title: "Attenzione!",
                    timeout: 5,
                    width: 300
                });

                return false;
            }

            var urlDatiEsecuzione = 'page?KEY_LEGAME=DATI_TECNICI';
            urlDatiEsecuzione += '&IDEN_ANAG=' + datiEsame[0].IDEN_ANAGRAFICA;
            urlDatiEsecuzione += '&IDEN_TESTATA=' + datiEsame[0].IDEN_TESTATA;

            home.NS_FENIX_TOP.apriPagina({url:urlDatiEsecuzione,id:'SCARICO_MATERIALI_ELENCO_ESAMI',fullscreen:true});
        }
        catch(e)
        {
            alert("NS_ISITE_PLUGIN.apriConsole - " + e.message);
        }

    },
    apriConsole: function(id_dicom)
    {
        try{
            var datiEsame = NS_ISITE_PLUGIN.leggiDatiEsame(id_dicom);

            if(!datiEsame) return;

            if(datiEsame.length == 0)
            {
                home.logger.warn("Esame non trovato [id_dicom=" + id_dicom + "]");

                home.NOTIFICA.warning({
                    message: "Esame non trovato",
                    title: "Attenzione!",
                    timeout: 5,
                    width: 300
                });

                return false;
            }

	    if(home.$('.iScheda').length>0)
	     {
		alert('Impossibile aprire 2 shcede contemporaneamente. Chiudere la scheda aperta, manualmente')
		return;

		}	


            var urlConsole = 'page?KEY_LEGAME=CONSOLE';
            urlConsole += '&IDEN_ANAGRAFICA=' + datiEsame[0].IDEN_ANAGRAFICA;
            urlConsole += '&IDEN_TESTATA=' + datiEsame[0].IDEN_TESTATA;
            urlConsole += '&IDEN_DETTAGLIO=' + datiEsame[0].IDEN_DETTAGLIO;
            urlConsole += '&IDEN_REFERTO=' + ((datiEsame[0].IDEN_REFERTO) ? datiEsame[0].IDEN_REFERTO : '');
            urlConsole += '&IDEN_CDC=' + datiEsame[0].IDEN_CDC;
            urlConsole += '&IDEN_NOMENCLATORE=' + datiEsame[0].IDEN_NOMENCLATORE;
            urlConsole += '&IDEN_SALA=' + datiEsame[0].IDEN_SALA;
            urlConsole += '&ID_DICOM=' + datiEsame[0].ID_DICOM;
            urlConsole += '&ID_PAZ_DICOM=' + datiEsame[0].ID_PAZ_DICOM;

            home.NS_FENIX_TOP.apriPagina({url:urlConsole,id:'ConsolePage',fullscreen:true});
        }
        catch(e)
        {
            alert("NS_ISITE_PLUGIN.apriConsole - " + e.message);
        }
    },

    leggiDatiEsame: function(id_dicom)
    {
        var params = {
            "id_dicom": id_dicom
        }

        var result = {};

        dwr.engine.setAsync(false);
        toolKitDB.getResult("DATI.GET_DATI_ESAME_PER_CONSOLE", params, "",
            {
                callback: function (response)
                {
                    result = response;
                },
                timeout: 5000,
                errorHandler: function (response)
                {
                    home.logger.error("errore dwr POLARIS_DATI.GET_DATI_ESAME_PER_CONSOLE con id_dicom=" + id_dicom + ". response: " + response);

                    home.NOTIFICA.error({
                        message: "Errore di comunicazione",
                        title: "Error!",
                        timeout: 5,
                        width: 300
                    });

                    result = false;
                }
            });
        dwr.engine.setAsync(true);

        return result;
    },

    chiudiConsole: function()
    {
        try{
            if(home.CONSOLE)
            {
                //home.NS_FUNZIONI_BASE_CONSOLE.salva();
		 if(LIB.isValid(home.SPEECHMAGIC))		
		  {
			var jsonConsoleIsite = new Object();
			home.NS_REFERTO.readDatiConsole(jsonConsoleIsite);
			if(home.SPEECHMAGIC.isModified() && jsonConsoleIsite.iden_referto=='')
			{
				home.SPEECHMAGIC.save();
			}
			else
			{		
                		home.CONSOLE.chiudi();
		 	}
		  }
		  else
		  {		
                	home.CONSOLE.chiudi();
		  }
		 
		  
                //opener.NS_FENIX_PLUGIN.chiudiCanvas();
            }
        }
        catch(e)
        {
            //alert("NS_ISITE_PLUGIN.chiudiConsole - " + e.message);
        }

    },
    chiudiDatiEsecuzione: function()
    {
        try{

            home.NS_FENIX_TOP.chiudiUltima();


            //opener.NS_FENIX_PLUGIN.chiudiCanvas();

        }
        catch(e)
        {
            //alert("NS_ISITE_PLUGIN.chiudiDatiEsecuzione- " + e.message);
        }

    } ,
    getDatiConsolleAperta: function()
    {
        return home.NS_REFERTO.readDatiConsole(jsonConsoleIsite);
    }
}     */