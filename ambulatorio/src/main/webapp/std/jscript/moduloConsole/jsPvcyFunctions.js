// JavaScript Document
// funzioni per la gestione della sezione oscuramento
// all'interno dei moduli console
function initPrivacySection(){
	var objHome ;
	try{
		if (typeof(getHomeFrame)=="undefined"){
			// sembra non andare...
//			objHome = parent.getHomeFrame();
			objHome = parent.parent.top.opener.top;
		}
		else{
			objHome = getHomeFrame();
		}
		if (!objHome.home){
			objHome  = top.opener.top;
		}
		// da cambiare DEVE essere == "S"
		if (objHome.home.getConfigParam("GESTIONE_ATTIVA_PVCY")=="S"){
			// appendo al body un nuovo multiAccordion
			var srcIframe = "";
			var idenEsame = array_iden_esame.toString();
			srcIframe = "oscuramentoCittadino.html?sorgente=consolle&iden_esame=" + idenEsame.replace(/[*]/g, ",")
			var iFramePvcy = "<iframe width='100%' height='170px' src='"+ srcIframe +"' id ='iFrmPvcy'></iframe>";
			j$("#idDivReportControl").parent().append(iFramePvcy);
			j$("idDivReportControl").css("height","250px;");
//			pvcyDiv.appendTo('body');
			//$('#multiAccordionGestPvcy').multiAccordion();
			//$('#multiAccordionGestPvcy').multiAccordion("option", "active", [0]);
		}
	}
	catch(e){
		alert("initPrivacySection - Error: " + e.description);
	}
}


function salvaOscuramentoCittadino(){
	// ****************************
	// modifica 18-11-2014
	// nuovo privacy 
	// NB il param GESTIONE_ATTIVA_PVCY DEVE valere S (il diverso è per test)
	try{
		if (getHomeFrame().home.getConfigParam("GESTIONE_ATTIVA_PVCY")=="S"){
			if (!j$('#iFrmPvcy')[0].contentWindow.salvaOscuramento()){
				return false;
			}
		}
	}catch(e){
		//alert(e.description);
	}
	// *****************************	
}