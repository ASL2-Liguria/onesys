function ShowHideLayer(valore){
	try{
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
	catch(e){;}
}


function ShowLayer(valore){
	try{
		if (valore==""){return;}
		objectNode = document.getElementById(valore);
		if (objectNode){
			objectNode.style.display='block';
		}
	}
	catch(e){;}
}

function HideLayer(valore){
	try{
		if (valore==""){return;}
		objectNode = document.getElementById(valore);
		if (objectNode){	
			objectNode.style.display='none';
		}
	}
	catch(e){;}
}