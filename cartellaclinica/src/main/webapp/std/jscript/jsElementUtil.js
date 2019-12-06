// JavaScript Document

/*
oElm 
Mandatory. This is element in whose children you will look for the attribute. 

strTagName 
Mandatory. This is the name of the HTML elements you want to look in. Use wildcard (*) if you want to look in all elements. 

strAttributeName 
Mandatory. The name of the attribute you’re looking for. 

strAttributeValue 
Optional. If you want the attribute you’re looking for to have a certain value as well. 

Example:
getElementsByAttribute(document.body, "*", "id");
getElementsByAttribute(document.getElementById("the-form"), "input", "type", "text");

*/
function getElementsByAttribute(oElm, strTagName, strAttributeName, strAttributeValue){
	var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
	var arrReturnElements = new Array();
	var oAttributeValue = (typeof strAttributeValue != "undefined")? new RegExp("(^|\\s)" + strAttributeValue + "(\\s|$)") : null;
	var oCurrent;
	var oAttribute;
	for(var i=0; i<arrElements.length; i++){
		oCurrent = arrElements[i];
		oAttribute = oCurrent.getAttribute && oCurrent.getAttribute(strAttributeName);
		if(typeof oAttribute == "string" && oAttribute.length > 0){
			if(typeof strAttributeValue == "undefined" || (oAttributeValue && oAttributeValue.test(oAttribute))){
				arrReturnElements.push(oCurrent);
			}
		}
	}
	return arrReturnElements;
}


// funziona che azzera un campo
// se text lo mette vuoto
// se select mette indice = -1
function resetCampoByObject(oggetto){
	
	var tipoNodo = "";
	try{
		tipoNodo = oggetto.nodeName.toString().toUpperCase();
		switch (tipoNodo){
			case "INPUT":
				oggetto.value = "";
				break;
			case "TEXTAREA":
				oggetto.value = "";
				break;							
			case "SELECT":
				oggetto.selectedIndex = -1;
				break;
		}	
	}
	catch(e){
		alert("resetCampoByObject - Error: " + e.description);
	}
}


// cicla su tutti i campi 
// della pagina e tutti quelli con 
// attributo obbligatorio
// gli cambia la classe
// NB la funzione deve essere combinata col classeCampi.css
function settaObbligatorietaCampi(){
	var collectionCampi
	
	try{
		collectionCampi = getElementsByAttribute(document.body, "*", "obbligatorio", "S");		
		for(var k=0;k<collectionCampi.length;k++){
			collectionCampi[k].className = getCssValidatorClass(collectionCampi[k].className,"O");
		}
	}
	catch(e){
		alert("settaObbligatorietaCampi - Error: "+ e.description);
	}
}


function removeElementById(elName) {
	var el = document.getElementById(elName);
	try{
		el.parentNode.removeChild(el);
	}
	catch(e){
		alert("removeElementById - " + e.description);
	}
}


function checkObbligatorio(oggetto){
	var bolEsito = false;
	var descrizione = "";
	var obbligatorio ="";
	
	
	try{
		// lavoro solo sui campi NON hidden!!
		if (oggetto.type.toString().toUpperCase()=="HIDDEN"){
			return true;
		}
		// ****************
		try{
			obbligatorio = oggetto.obbligatorio;
		}
		catch(e){
			obbligatorio= "N"
		}
		if (obbligatorio =="N"){
			bolEsito = true;	
		}
		else{
			if ((obbligatorio =="S")&&(oggetto.value!="")){
				bolEsito = true;	
			}
			else{
				try{
					descrizione = oggetto.descrizione;
					if ((descrizione == "")||(descrizione == "undefined")){
					   alert("Prego compilare il campo: " + oggetto.id);						
					}
					else{
					   	alert("Prego compilare il campo: " + descrizione);					
					}
				}
				catch(e){
				   alert("Prego compilare il campo: " + oggetto.id + " - " + oggetto.name);
				}
			   oggetto.className = getCssValidatorClass(oggetto.className,"E");
			   oggetto.focus();
			}
		}
		return bolEsito;
	}
	catch(e){
		alert("checkObbligatorio - error: " + e.description);
		return bolEsito;
	}
}


// gestisco entry dell'ora 
// su event keydown
function formatOra(oggetto){
	var oggetto	
	var valore
	try{


		if (oggetto.value.toString().length==5){
			oggetto.value = "";
		}
		valore = oggetto.value;		
		window.event.returnValue=false;		
		if (oggetto){
			if ((window.event.keyCode >= 48) && (window.event.keyCode <= 57)){
				// numero
				oggetto.value = valore + String.fromCharCode(window.event.keyCode);
//				 window.event.returnValue=false;
//				alert("lung: " + valore.toString().length)
				// controllo i minuti
				if (oggetto.value.toString().length==2){
					// controllo le ore
					oggetto.value = oggetto.value + ":";
				}
				if (oggetto.value.toString().length==5){
					if (!isValidTime(oggetto.value.toString())){
						alert("Inserire un'ora valida");
						oggetto.value = "";
						oggetto.focus();
						return false;
					}
				}				

			}
			else if ((window.event.keyCode == 9)){
				// premuto TAB
			}
			else{
				alert("Inserire solo numeri");
				oggetto.focus();				
			}
		}
	}
	catch(e){
		alert("formatOra - Error: " + e.description);
	}
}



function isValidTime(value) {
   var colonCount = 0;
   var hasMeridian = false;
   for (var i=0; i<value.length; i++) {
      var ch = value.substring(i, i+1);
      if ( (ch < '0') || (ch > '9') ) {
         if ( (ch != ':') && (ch != ' ') && (ch != 'a') && (ch != 'A') && (ch != 'p') && (ch != 'P') && (ch != 'm') && (ch != 'M')) {
            return false;
         }
      }
      if (ch == ':') { colonCount++; }
      if ( (ch == 'p') || (ch == 'P') || (ch == 'a') || (ch == 'A') ) { hasMeridian = true; }
   }
   if ( (colonCount < 1) || (colonCount > 2) ) { return false; }
   var hh = value.substring(0, value.indexOf(":"));
   if ( (parseFloat(hh) < 0) || (parseFloat(hh) > 23) ) { return false; }
   if (hasMeridian) {
      if ( (parseFloat(hh) < 1) || (parseFloat(hh) > 12) ) { return false; }
   }
   if (colonCount == 2) {
      var mm = value.substring(value.indexOf(":")+1, value.lastIndexOf(":"));
   } else {
      var mm = value.substring(value.indexOf(":")+1, value.length);
   }
   if ( (parseFloat(mm) < 0) || (parseFloat(mm) > 59) ) { return false; }
   if (colonCount == 2) {
      var ss = value.substring(value.lastIndexOf(":")+1, value.length);
   } else {
      var ss = "00";
   }
   if ( (parseFloat(ss) < 0) || (parseFloat(ss) > 59) ) { return false; }
   return true;
}


// restituisce oggetto con 
// proprietà x e y 
// relative alla posizione assoluta
// dell'oggetto
function getPosition(e){   
     var left = 0;   
     var top  = 0;   
   
     while (e.offsetParent!=null){   
         left += e.offsetLeft;   
         top  += e.offsetTop;   
         e     = e.offsetParent;   
     }   
   
     left += e.offsetLeft;
     top  += e.offsetTop;
   
     return {x:left, y:top};   
 }  
 
function utilCreaBoxAttesa(){
	
	var divObject ;
	var spanObject ;
	
	
	try{
		divObject =  document.createElement("DIV");
		divObject.id = "attesaBox";	
		spanObject = document.createElement("SPAN");
		spanObject.className = "testoAttesaBox";
		spanObject.innerHTML = "<LABEL>Caricamento in corso</LABEL><IMG class=clsImgAttesaRegistra src='imagexPix/thickbox/loadingAnimation.gif' width='20%' height=13>";	
		divObject.appendChild(spanObject);
		document.body.appendChild(divObject);
	}
	catch(e){
		//alert("creaBoxAttesa - Error: " + e.description);
	}	
}

function utilMostraBoxAttesa(bolStato){
	var oggetto;
	try{
		oggetto = document.getElementById("attesaBox");
		oggetto.height = document.body.scrollTop + screen.availHeight;
		oggetto.style.top = document.body.scrollTop;
		if (oggetto){
			if (bolStato){
				oggetto.style.visibility = "visible";				
			}
			else{
				oggetto.style.visibility = "hidden";				
			}

		}
	}
	catch(e){
		//alert("mostraBoxAttesa - Error: " + e.description);
	}
}