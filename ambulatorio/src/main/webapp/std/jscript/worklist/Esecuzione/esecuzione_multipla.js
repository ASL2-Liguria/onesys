/*
	Funzione richiamata nei casi in cui:
	- l'esecuzione viene effettuata solo dalle schede di appropriatezza poichè
	il campo web.ob_esecuzione == 'N'.
	- la scheda di appropriatezza non è visualizzabile in esecuzione e WEB.ob_esecuzione == 'S'
	
*/
function esecuzione_multipla(iden_esame_no_appr, elenco_esami_scheda_esame)
{
	//alert(iden_esame_no_appr + '------' + elenco_esami_scheda_esame);

	var elenco_esami = elenco_esami_scheda_esame;//var elenco_esami = opener.stringa_codici(opener.array_iden_esame);

	elenco_esami += '@' + iden_esame_no_appr;

	dwr.engine.setAsync(false);
	CJsEMAltraSchedaAppr.apri_altra_scheda_appr(elenco_esami, cbk);
	dwr.engine.setAsync(true);
}

function cbk(message)
{
	CJsEMAltraSchedaAppr = null;
	var idenEsame_elencoEsami_statiEsami = message.split('@');
	
	if(idenEsame_elencoEsami_statiEsami[0] == '' && idenEsame_elencoEsami_statiEsami[0] != 'STOP')
	{
		/*non ci sono più schede di appropriatezza da inserire*/
		var fin_scheda_esame = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
		fin_scheda_esame.opener = opener;
		self.close();
	}
	else
	{
		/*altra scheda di appropriatezza da inserire.*/
		if(idenEsame_elencoEsami_statiEsami[0] != 'STOP')
		{
			//alert('IDEN_ANAG: ' + opener.stringa_codici(opener.array_iden_anag).split('*')[0]);
			//alert('IDEN_ESAME: ' + idenEsame_elencoEsami_statiEsami[0]);
			var finestra = window.open("Appropriatezza?provenienza=EM&iden_paz="+opener.stringa_codici(opener.array_iden_anag)[0]+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
		}
		else
		{
			opener.aggiorna();
			self.close();
		}
	}
}