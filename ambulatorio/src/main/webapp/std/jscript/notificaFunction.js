// JavaScript Document


var idSpanNotifica = "spanNotificaMsg";
function getSpanNotifica(){
	var oggetto;
	try{
		oggetto = document.getElementById("idSpanNotifica");
		if (!oggetto){
			oggetto = document.createElement("SPAN");
			oggetto.id = idSpanNotifica;
			document.body.appendChild(oggetto);
		}
		return oggetto;
	}
	catch(e){
		alert("creaSpanNotifica - Error: " + e.description);
	}	
}

function mostraSpanNotifica(testo, bolShow){
	var oggetto;
	try{
		oggetto = getSpanNotifica();
		if (oggetto){
			oggetto.innerHTML = testo;
			if (bolShow){
				oggetto.style.visibility = "visible";
			}
			else{
				document.getElementById(idSpanNotifica).style.visibility = "hidden";				
			}
		}
		else{
			// NON trovato
		}
	}
	catch(e){
		alert("mostraSpanNotifica - Error: " + e.description);
	}	
}