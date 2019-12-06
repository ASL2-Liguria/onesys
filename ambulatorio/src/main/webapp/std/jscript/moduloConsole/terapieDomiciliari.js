function apriTerapie(reparto) {
	//window.open('../servletGeneric?class=whale.cartellaclinica.lettera.pckInfo.sTerapie&idenAnag=' + parent.globalIdenAnag + '&reparto=' + reparto,toolbar=0,menubar=0,status=0,scrollbars=1);
	window.open('../servletGeneric?class=whale.cartellaclinica.lettera.pckInfo.sTerapie&idenAnag=' + parent.globalIdenAnag + '&reparto=' + reparto,'','toolbar=0,menubar=0,status=0,scrollbars=1, width=' + (screen.availWidth - 100) + ',height='+ (screen.availHeight - 50) +', top=0, left=0');
}

var arTerapie;

function setTerapie(arr) {
	try{
		arTerapie = $.extend(true,[],arr);
		document.all.TERAPIE_DOMICILIARI_JSON.value = JSON.stringify(arTerapie);
	}
	catch(e){
		alert("setTerapie - Error: " + e.description);
	}
}

function initTerapie() {
	try{
	//	alert(document.all.TERAPIE_DOMICILIARI_JSON.value);
		if(document.all.TERAPIE_DOMICILIARI_JSON.value != '' && typeof(document.all.TERAPIE_DOMICILIARI_JSON.value) !="undefined") {
			arTerapie = JSON.parse(document.all.TERAPIE_DOMICILIARI_JSON.value);
	//		alert(arTerapie);
		}
	}
	catch(e){
		alert("initTerapie - Error: " + e.description);
	}

}
