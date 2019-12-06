function apriRiepilogoParametro(idenAnag,idParametro,offset)
{
	// alert("riepilogoParametri?idenAnag="+idenAnag+"&idParametro="+idParametro+"&offset="+offset);
	window.showModalDialog("riepilogoParametri?idenAnag="+idenAnag+"&idParametro="+idParametro+"&offset="+offset,this, 'dialogWidth:600px;dialogHeight:300px;scroll:auto;');
}
function apriGrafico(idenAnag,idParametro,reparto)
{
	var idenRicovero=top.getRicovero("IDEN");
	var finestra = window.open('servletGenerator?KEY_LEGAME=GRAFICO_PIANOGG&idenParametro='+idParametro+'&idAnag='+idenAnag+'&REPARTO='+reparto+"&idenRicovero="+idenRicovero,'','fullscreen=yes');
	top.opener.top.closeWhale.pushFinestraInArray(finestra);
//window.open('servletGenerator?KEY_LEGAME=GRAFICO_PIANOGG&idenParametro='+idParametro+'&idAnag='+idenAnag,'','fullscreen=yes');
}