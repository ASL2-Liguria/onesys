var height = screen.availHeight;
var width = screen.availWidth;


//jQuery(document).ready(function(){
//	parent.utilMostraBoxAttesa(false);
//});


function visualizzaRichiesteTUTTEpaziente(){
	var iden_remotoRicoverato   = null;

	iden_remotoRicoverato = stringa_codici(array_iden_anag);

	if(iden_remotoRicoverato == ''){
		alert(ritornaJsMsg('selezionare'));
		return;
	}

	dwr.engine.setAsync(false);
	CJsGestioneAnagrafica.gestioneRicercaRemotaRicoverati(iden_remotoRicoverato, back_visualizzaRichiestePAZIENTEtutte);
	dwr.engine.setAsync(true);
}

function back_visualizzaRichiestePAZIENTEtutte(iden_anag_locale){
	var winVisRichieste = null;
    	
	iden_remotoRicoverato = stringa_codici(array_iden_anag);
	
	alert(iden_anag_locale);
	alert(iden_remotoRicoverato);
		
	indirizzoGericos = '&indirizzoGericos=' +  baseGlobal.URL_GERICOS;
    
	numeroRicovero="N";
	indirizzoGericos += "&pulsante="+"SL_Inizio?topSource=3";
	indirizzoGericos += "&utente=" + baseUser.LOGIN;
	indirizzoGericos += "&reparto=" + stringa_codici(array_reparto_di_ricovero);
	indirizzoGericos += "&idPaziente=" + iden_remotoRicoverato;
	
	if(numeroRicovero == "S")
		indirizzoGericos += "&numeroRicovero=" + stringa_codici(array_num_nosologico);
	
	if(iden_anag_locale == ''){
		alert('ERRORE: NON è STATO INSERITO IL PAZIENTE IN LOCALE');
	}
	else
	{
		doc = 'ServletTutteRichiestePaziente?iden_locale=where iden_anag = '+iden_anag_locale+indirizzoGericos;
		winVisRichieste = window.open(doc, 'worklistMainFrame','width='+width+',height='+height+', status=yes, resizable=yes, top=0,left=0');

		if (winVisRichieste){
			winVisRichieste.focus();
		}
		else{
			winVisRichieste = window.open(doc, 'worklistMainFrame','width='+width+',height='+height+', status=yes, resizable=yes, top=0,left=0');
		}
	}

}

function visualizzaRichiesteTUTTEreparto(){

	var winVisRichieste = null;
        iden_remotoRicoverato = stringa_codici(array_iden_anag);
	indirizzoGericos = '&indirizzoGericos=' +  baseGlobal.URL_GERICOS;
        numeroRicovero="N";
	indirizzoGericos += "&pulsante="+"SL_Inizio?topSource=2";
	indirizzoGericos += "&utente=" + baseUser.LOGIN;
	indirizzoGericos += "&reparto=" + stringa_codici(array_reparto_di_ricovero);
	indirizzoGericos += "&idPaziente=" + iden_remotoRicoverato;
	doc = "ServletTutteRichiestePaziente?iden_locale= where CODICE_REPARTO_PROV ='"+stringa_codici(array_reparto_di_ricovero)+"'"+indirizzoGericos;


		winVisRichieste = window.open(doc, 'worklistMainFrame','width='+width+',height='+height+', status=yes, resizable=yes, top=0,left=0');

		if (winVisRichieste){
			winVisRichieste.focus();
		}
		else{
			winVisRichieste = window.open(doc, 'worklistMainFrame','width='+width+',height='+height+', status=yes, resizable=yes, top=0,left=0');
		}
}

function VisualizzaFabioCartella()
{
var nome="ANAMNESI_GRUPPO";
var key_ID=stringa_codici(array_codice_reparto)+'|'+stringa_codici(array_iden)+'|'+stringa_codici(array_num_nosologico);
	winVisRichieste = window.open("servletGenerator?KEY_GRUPPO=" + nome + "&KEY_ID=" + key_ID, '_blank','width='+width+',height='+height+', status=yes, resizable=yes, top=0,left=0');

		if (winVisRichieste){
			winVisRichieste.focus();
		}
		else{
                	winVisRichieste = window.open("servletGenerator?KEY_GRUPPO=" + nome + "&KEY_ID=" + key_ID,'_blank','width='+width+',height='+height+', status=yes, resizable=yes, top=0,left=0');
		}
}



function VisualizzaDiarioMedico(tipoDiario)
{
  var nome="IFRAMESET_DIARIO_MEDICO";
  var KEY_REPARTO=stringa_codici(array_codice_reparto)
  var KEY_NOSOLOGICO=stringa_codici(array_num_nosologico)
  key_id=""
	winVisRichieste = window.open("servletGenerator?KEY_LEGAME=" + nome + "&KEY_REPARTO=" + KEY_REPARTO+ "&KEY_NOSOLOGICO=" + KEY_NOSOLOGICO+ "&KEY_TIPO_DIARIO="+tipoDiario  , '_blank','width='+width+',height='+height+', status=yes, resizable=yes, top=0,left=0');
		if (winVisRichieste){
			winVisRichieste.focus();
		}
		else{

                	winVisRichieste = window.open("servletGenerator?KEY_LEGAME=" + nome + "&KEY_REPARTO=" + KEY_REPARTO+ "&KEY_NOSOLOGICO=" + KEY_NOSOLOGICO+ "&KEY_TIPO_DIARIO=MEDICO", '_blank','width='+width+',height='+height+', status=yes, resizable=yes, top=0,left=0');
		}
}
