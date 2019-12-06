function applica()
{
	if(vettore_indici_sel[0]!=null && vettore_indici_sel[0]>=0)
	{
		document.all.hReparto.value=array_codDec[vettore_indici_sel[0]];
		document.frmDati.submit();
	}
	else
	{
		alert(ritornaJsMsg("MSG_FARESELEZIONE"));
	}
}


function chiudi(){
	top.parent.mainFrame.workFrame.document.location.replace("worklistInizio");
}