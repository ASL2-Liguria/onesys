/**
 * Created by matteopi on 18/09/2014.
 */

jQuery(document).ready(function () {

    STORICO_PAZIENTE.init();
    STORICO_PAZIENTE.setEvents();
});

var STORICO_PAZIENTE =
{
		anagrafica : null,
		emergenzaMedica : "0",
		wk_storico_ricoveri : null,

	    init : function () {

	    	$('#divEmergenzaMedica').hide();
	        $("#divWkStorico").height("475px");

	        home.NS_CONSOLEJS.addLogger({name:'STORICO_PAZIENTE',console:0});
	        window.logger = home.NS_CONSOLEJS.loggers['STORICO_PAZIENTE'];

	        STORICO_PAZIENTE.anagrafica = NS_ANAGRAFICA.Getter.getAnagraficaById($("#IDEN_ANAG").val());
	        STORICO_PAZIENTE.caricaWkStoricoPazienti();
	    },

	    /**
	     * Se seleziono "Emergenza Medica" escludo i controlli privacy.
	     *
	     * @author alessandro.arrighi
	     */

	    setEvents : function () {

	    	if (home.baseGlobal.ATTIVA_PRIVACY == "S")
	    	{
	    		$('#divEmergenzaMedica').show();
		    	$('#chkEmergenzaMedica').click(function(){

		    		STORICO_PAZIENTE.emergenzaMedica = $('#h-chkEmergenzaMedica').val();

		        	logger.debug("refresh WK STORICO_PAZIENTE.emergenzaMedica -> " + STORICO_PAZIENTE.emergenzaMedica);

		        	if (STORICO_PAZIENTE.emergenzaMedica)
		        	{
						var msg = 'Attenzione! Si sta attivando lo stato di emergenza medica. Potrete accedere alla totalit&agrave; dei dati del paziente (Art.82 del D.lgs 196/2003). Ogni operazione verr&agrave; tracciata e registrata. L\'informativa e il consenso al trattamento dei dati personali possono altres&igrave; intervenire senza ritardo, successivamente alla prestazione, in caso di: \na) impossibilit&agrave; fisica, incapacit&agrave; di agire o incapacit&agrave; di intendere o di volere dell\'interessato, quando non &egrave; possibile acquisire il consenso da chi esercita legalmente la potest&agrave;, ovvero da un prossimo congiunto, da un familiare, da un convivente o, in loro assenza, dal responsabile della struttura presso cui dimora l\'interessato; \nb) rischio grave, imminente ed irreparabile per la salute o l\'incolumit&agrave; fisica dell\'interessato.Procedere? ';
						var tbl = "<table border='2' style='font-size:14px;'>";
						tbl += "<tr>";
						tbl += "<td colspan=\"2\">"+ msg +"</td>";
						tbl += "</tr>";
						tbl += "<tr>";
						tbl += "<td width='25%'>Motivo Emergenza</td><td width='75%'><textarea id='txtMotivo' style='width:100%;height:100px;' ></textarea></td>";
						tbl += "</tr>";
						tbl += "</table>";

			        	$.dialog(tbl, {
			                buttons : 	[
			                    {
			                        label: "Annulla", action: function (ctx)
			                    {
			                        $.dialog.hide();
			                        $("#chkEmergenzaMedica").data("CheckBox").deselectAll();
			                    }
			                    },
			                    {
			                        label: "Prosegui",
			                        action: function (ctx)
			                        {
										STORICO_PAZIENTE.caricaWkStoricoPazienti();
			                        	$.dialog.hide();
			                        }
			                    }
			                ],
			                title : "Emergenza Medica",
			                height:300,
			                width:500
			            });
		        	}
		        	else
		        	{
						STORICO_PAZIENTE.caricaWkStoricoPazienti();
		        	}

		        });

	    	};
	    },

	    caricaWkStoricoPazienti : function(){

	    	logger.debug("STORICO_PAZINETE.caricaWkStoricoPazienti");

	    	logger.debug(STORICO_PAZIENTE.anagrafica.id+ " - " + home.baseUser.CODICE_DECODIFICA+ " - " + STORICO_PAZIENTE.anagrafica.nome+ " - " + STORICO_PAZIENTE.anagrafica.cognome+ " - " + STORICO_PAZIENTE.anagrafica.sesso+ " - " + STORICO_PAZIENTE.anagrafica.codiceFiscale+ " - " + STORICO_PAZIENTE.anagrafica.id+ " - " + "WHALE"+ " - " + STORICO_PAZIENTE.emergenzaMedica);
	    	STORICO_PAZIENTE.wk_storico_ricoveri= new WK({
	            id : "WK_STORICO_PAZIENTE_ADT",
	            container : "divWkStorico",
	            aBind : ["iden_anagrafica", "user", "nome", "cognome", "sesso", "codiceFiscale", "ID_WHALE", "assigningAuthority", "emergenzaMedica", "username"],
	            aVal : [STORICO_PAZIENTE.anagrafica.id, home.baseUser.CODICE_DECODIFICA, STORICO_PAZIENTE.anagrafica.nome, STORICO_PAZIENTE.anagrafica.cognome, STORICO_PAZIENTE.anagrafica.sesso, STORICO_PAZIENTE.anagrafica.codiceFiscale, STORICO_PAZIENTE.anagrafica.id, "WHALE", STORICO_PAZIENTE.emergenzaMedica, home.baseUser.USERNAME]
	        });

	        STORICO_PAZIENTE.wk_storico_ricoveri.loadWk();

	    },

	    printCertificatoRicovero : function(IDEN_CONTATTO){
	        var _par = {};
	        _par.PRINT_DIRECTORY = 'CERTIFICATI';
	        _par.PRINT_REPORT = 'CERTIFICATORICOVERO';
	        _par.PRINT_PROMPT = "&promptIDEN_CONTATTO=" + IDEN_CONTATTO;

	        home.NS_FENIX_PRINT.caricaDocumento(_par);
	        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;
	        home.NS_FENIX_PRINT.apri(_par);
	    },

	    printCertificatoDimi : function(IDEN_CONTATTO,DIAGNOSI){

	        var _par = {};
	        _par.PRINT_DIRECTORY = 'CERTIFICATI';
	        _par.PRINT_REPORT = 'CERTIFICATODIMISSIONE';
	        _par.PRINT_PROMPT = "&promptIDEN_CONTATTO=" + IDEN_CONTATTO+ "&promptDIAGNOSI="+DIAGNOSI;

	        home.NS_FENIX_PRINT.caricaDocumento(_par);
	        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;
	        home.NS_FENIX_PRINT.apri(_par);
	    },

	    printVerbaleRicovero:function(IDEN_CONTATTO){
	        var _par = {};
	        _par.PRINT_DIRECTORY = 'RICERCA_RICOVERATI';
	        _par.PRINT_REPORT = 'VERBALERICOVERO';
	        _par.PRINT_PROMPT = "&promptIDEN_CONTATTO=" + IDEN_CONTATTO;

	        home.NS_FENIX_PRINT.caricaDocumento(_par);
	        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;
	        home.NS_FENIX_PRINT.apri(_par);
	    },

	    printFrontespizio : function(IDEN_CONTATTO){
	        var _par = {};
	        _par.PRINT_DIRECTORY = 'RICERCA_RICOVERATI';
	        _par.PRINT_REPORT = 'Frontespizio';
	        _par.PRINT_PROMPT = "&promptIDEN_CONTATTO=" + IDEN_CONTATTO;
	        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

	        home.NS_FENIX_PRINT.caricaDocumento(_par);
	        home.NS_FENIX_PRINT.apri(_par);
	    }
};


