// JavaScript Document

function initGlobalObject(){
	fillLabels(arrayLabelName,arrayLabelValue);
	fill_select('selCampiIn',arrayCampoIn,arrayCampoIn);
	fill_select('selCampiOut',arrayCampoOut,arrayCampoOut);
}

// funzione caricaLabelCampo
function caricaLabelCampo(nomeLabel,nomeListBox){
	if ((nomeLabel=="")||(nomeListBox=="")){return;}
	setLabelText(nomeLabel,arrayLabelCampo[getIndexByValue(arrayCampoAll, getValue(nomeListBox))]);
}


// funzione SetLabelText
function setLabelText(elemento, testo){

	var objectNode;
	if (elemento==""){return;}
	objectNode = document.getElementById(elemento);
	 if (objectNode){
		 objectNode.innerText =testo;
	 }

}


// funzioni getIndexByValue
function getIndexByValue(arrayIn,valore){

	var	indiceOut = -1;
	var dimensione ;
	var i=0;
	dimensione = arrayIn.length;
	for (i=0;i<dimensione;i++){
		if (arrayIn[i]==valore){
			indiceOut=i;
			break;
		}
	}

	return indiceOut;
}

// funzione chiudi
function chiudi(){
 document.location.replace ("blank");
}

function registra(){
	document.frmDati.idenCampi.value=getAllOptionCode("selCampiOut");
	document.frmDati.submit();
}


