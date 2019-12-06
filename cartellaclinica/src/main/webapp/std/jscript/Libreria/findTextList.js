var stringaRicerca ="";
var timerAzzeraStringa;
var timeoutResetStringa = 3000;

function pressioneTasto(elemento){

	var codiceTasto = window.event.keyCode;
	var valoreTmp = ""
	var object;
	var i=0;
	
	window.event.returnValue=false;
	if (stringaRicerca!=""){
		clearTimeout(timerAzzeraStringa);
	}
	stringaRicerca = stringaRicerca+String.fromCharCode(codiceTasto);
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			valoreTmp = object.options(i).text;
	//		alert("valoreTmp: " + valoreTmp);
			if (valoreTmp.substr(0,stringaRicerca.length).toUpperCase()==stringaRicerca.toUpperCase()){
				object.selectedIndex = i;
				break;
			}
		}
	}	
	timerAzzeraStringa = setTimeout('resettaStringaRicerca()', timeoutResetStringa);
}


function resettaStringaRicerca(){
	clearTimeout(timerAzzeraStringa);
	stringaRicerca= "";
}