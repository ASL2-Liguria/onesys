// funzione utilizzata per settare
// proprietà TITLE del documento quindi il titolo della finestra
// proprietà TEXT delle LABEL
// proprietà ALT di IMG, quindi il tooltip
//

// html in modo dinamico in base alla lingua
function fillLabels(arrayLabel, arrayValue){

	var indice=0;
	var objectNode;
	var oNewText;
	
	// controllo che ci sia uniformità negli array
	if (arrayLabel.length!=arrayValue.length){
		alert("Error!Arrays of label with different length");
		return;
	}
	try{
		for (indice=0;indice<arrayLabel.length;indice++){
			objectNode = document.getElementById(arrayLabel[indice]);
			if (objectNode){
				if (objectNode.nodeName=="DIV"){
						objectNode.title = arrayValue[indice];
				}
				// se esiste la label cambio il suo valore
				//if(objectNode.children.length==0){	
				if(objectNode.children.length===0){	
					// nessun testo impostato
					// creo testo e lo appendo
					switch (objectNode.nodeName){
						case "TITLE":
							document.title = arrayValue[indice];
							break;
						case "INPUT":
							//oNewText=document.createTextNode(arrayValue[indice]);
							objectNode.value = arrayValue[indice];
							break;
						case "LABEL":
							//oNewText = document.createTextNode(arrayValue[indice]);
							//objectNode.appendChild(oNewText);
							objectNode.innerHTML = arrayValue[indice];
							break;
						case "IMG":
							objectNode.title = arrayValue[indice];
							break;
						default:
							oNewText=document.createTextNode(arrayValue[indice]);
							objectNode.appendChild(oNewText);
					}
				}			
			}
		} // fine ciclo for
	}
	catch(e){
		alert("Error! Can't fill labels. Not define in table - " + e.description);
	}
}

// funzione utilizzata per avere i msg degli script 
// in base alla lingua in modo dinamico
function ritornaJsMsg(valore){
	var i = 0;
	var msgOut="";

	try{
		//if (valore==""){return msgOut;}
		if (valore===""){return msgOut;}
		for (i=0;i<arrayLabelName.length;i++){
			if (arrayLabelName[i]==valore){
				msgOut = arrayLabelValue[i];
				break;
			}
		}
		//if (msgOut==""){
		if (msgOut===""){
			msgOut = "Error JScode: " + valore;
		}
	}
	catch(e){
		alert("ritornaJsMsg - Error: "+ e.description);
	}
	return msgOut;
}