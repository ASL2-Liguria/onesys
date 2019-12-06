function ShowHideLayer(valore){
	if (valore==""){return;}
	objectNode = document.getElementById(valore);
	if (objectNode){
		if (objectNode.style.display=='block'){
			objectNode.style.display='none';
		}
		else if(objectNode.style.display =="none"){
			objectNode.style.display='block';
		}
		else if(objectNode.style.display ==""){
			objectNode.style.display='none';
		}
	}
}


function ShowLayer(valore){
	if (valore==""){return;}
	objectNode = document.getElementById(valore);
	if (objectNode){
		objectNode.style.display='block';
	}
}

function HideLayer(valore){
	if (valore==""){return;}
	objectNode = document.getElementById(valore);
	if (objectNode){	
		objectNode.style.display='none';
	}
}