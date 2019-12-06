function apriScheda(funzione){

	var url;

	var vDati = top.getForm(document);

	if(funzione=='WK_OBIETTIVI_MENU'){

		url = "servletGenerator?KEY_LEGAME=WK_OBIETTIVI_MENU&WHERE_WK= where iden_visita="+vDati.iden_visita+" and data_obiettivo_wk=to_char(sysdate,'dd/MM/yyyy')";
		parent.frameBottomBisogni.location.replace(url);

	}else{
		top.apriBisogno(funzione,parent.frameBottomBisogni);
	}


}

function registra(idenBisogno){
	/*document.all.formBisogni.action.value='save';
	document.all.formBisogni.id2save.value = idenBisogno;
	document.all.formBisogni.submit();	*/
}

function refreshBisogni()
{
	parent.frameTopBisogni.location.replace(parent.frameTopBisogni.location);
}



function apriScheda___ufficio(funzione){

	var confScheda =top.getConfScheda(funzione,top.EXTERN.reparto.value,top.EXTERN.iden_visita.value);

	url = "servletGenerator?KEY_LEGAME="+confScheda.KEY_LEGAME+"&FUNZIONE="+funzione+"&IDEN_VISITA="+top.EXTERN.iden_visita.value;

	if(confScheda.SITO != null && confScheda.SITO !=''){url+="&SITO="+confScheda.SITO}
	if(confScheda.VERSIONE != null && confScheda.VERSIONE !=''){url+="&VERSIONE="+confScheda.VERSIONE}

	parent.frameBottomBisogni.location.replace(url);
}
function registra(idenBisogno){
	document.all.formBisogni.action.value='save';
	document.all.formBisogni.id2save.value = idenBisogno;
	document.all.formBisogni.submit();
}
function refreshBisogni()
{
	parent.frameTopBisogni.location.replace("mainBisogni?reparto="+top.getForm(document).reparto+"&iden_visita="+top.getForm(document).iden_visita);
}

