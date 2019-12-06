// JavaScript Document
function getRisVersion(){
	var oggetto
	
	try{
//		lblInfoPolaris
		var oggetto ;
		
		oggetto = document.getElementById("lblInfoPolaris");
		if (oggetto){
			oggetto.innerText = oggetto.innerText + " - Ris Ver.2.6b";
		}
	}
	catch(e){
		alert("getRisVersion - Error" + e.description)
	}
}