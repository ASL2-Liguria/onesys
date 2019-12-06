function InizializzaSrvImmaginiEsame()
{
	//alert();
}


function EditImage()
{
	 
	var urlOpen="SrvImmaginiEsameApplet?iden=" + stringa_codici(array_iden) +"&iden_esami=" +stringa_codici(array_iden_esami)+ "&iden_tab_esa=" +stringa_codici(array_iden_tab_esa) ;
	aa=window.open(urlOpen,"","top=0,left=0,width=1,height=1");
	
}


function InitWorklist()
{
	if (typeWK=="ImmaginiGeneriche")
	{
		document.all.titolo_wk.innerText="Immagini Generiche relative all'esame: " + parent.document.frmInfo.descrEsa.value;
	}
	else
	{
		document.all.titolo_wk.innerText="Immagini relative all'esame del Sig. " + parent.document.frmInfo.COGN.value;
	}
}