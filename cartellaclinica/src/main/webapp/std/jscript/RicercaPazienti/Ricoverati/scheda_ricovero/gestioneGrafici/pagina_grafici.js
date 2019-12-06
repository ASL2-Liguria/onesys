$(document).ready(function(){
	allargaFrameGrafici();
	document.all.oIFWorklist.src = "servletGenerator?KEY_LEGAME=WK_CC_GRAFICI&WHERE_WK= where UTE_INS="+baseUser.IDEN_PER+" or IDEN_ANAG="+parent.document.EXTERN.idenAnag.value+" or REPARTO='"+parent.document.EXTERN.reparto.value+"'";
	document.all.frameImpostazione.src= 'configChart?idenAnag='+document.EXTERN.idenAnag.value+'&idenVisita='+document.EXTERN.idenVisita.value+'&ricovero='+document.EXTERN.ricovero.value+'&reparto='+document.EXTERN.reparto.value;
});

function allargaFrameGrafici(){

// funzione per allargare alla dimensione massima permessa un frame

	//alert (document.all.frameImpostazione.offsetTop);

	var altPagina = '';
	var altFrame1 = '';
	var altFrame2 = '';
	var altFooter = '';

	altPagina = screen.availHeight;
	altFrame1 = document.all.frameImpostazione.offsetTop;
	altFooter = '10';

	altFrame2 = parseInt(altPagina, 10) - parseInt(altFrame1, 10) - altFooter;

	document.all.frameImpostazione.style.height = altFrame2;
}
function apriGrafico(){
	var idGrafico = stringa_codici(array_iden);
        var vDati = top.getForm(document);
	parent.document.all.frameImpostazione.src="configChart?idenGrafico="+idGrafico+"&idenAnag="+vDati.iden_anag+"&idenVisita="+vDati.iden_visita+"&ricovero="+vDati.ricovero+"&reparto="+vDati.reparto;
}
function appendEvent(tab){
	for (var i=0;i<tab.rows.length;i++)
		tab.rows[i].ondblclick = function(){apriGrafico();}

}
