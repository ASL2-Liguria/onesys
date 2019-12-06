// JavaScript Document



// variabile che descrive l'oggetto 
// procedura generico
var objEsame = {"esameObj":[
		{"IDEN":"", "QUESITO":"", "QUADRO":""}
	]
};

// azzera tutti i valori
function resetJSONObjEsa(){
	objEsame.esameObj[0].IDEN = "";
	objEsame.esameObj[0].QUESITO = "";
	objEsame.esameObj[0].QUADRO = "";
}

function oggettoEsame(pIDEN, pQUESITO, pQUADRO){
	this.IDEN = pIDEN;
	this.QUESITO = pQUESITO;		
	this.QUADRO = pQUADRO;
}

