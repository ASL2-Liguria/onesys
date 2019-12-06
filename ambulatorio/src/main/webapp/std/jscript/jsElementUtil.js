// JavaScript Document
var arrayCaratteriProibiti = new Array(2);
arrayCaratteriProibiti = ['§','#'];
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
	try{
		var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
		var arrReturnElements = new Array();
		var oAttributeValue = (typeof strAttributeValue != "undefined")? new RegExp("(^|\\s)" + strAttributeValue + "(\\s|$)") : null;
		var oCurrent;
		var oAttribute;
		for(var i=0; i<arrElements.length; i++){
			oCurrent = arrElements[i];
			oAttribute = oCurrent.getAttribute && oCurrent.getAttribute(strAttributeName);
			/*if (strAttributeValue=="classTdField"){
				alert(oCurrent.tagName + "#" + strAttributeName + "#" + oAttribute);
			}*/
			if(typeof oAttribute == "string" && oAttribute.length > 0){
				if(typeof strAttributeValue == "undefined" || (oAttributeValue && oAttributeValue.test(oAttribute))){
					arrReturnElements.push(oCurrent);
				}
			}
		}
	}
	catch(e){
		alert("getElementsByAttribute - Error: " + e.description);		
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
				// aggiunto per l'eco ostetrica
				try{
					if (typeof oggetto.defaultIdenFromTabEcoCod != "undefined"){
						if (oggetto.defaultIdenFromTabEcoCod!=""){
							// setto cmq un default
							selectOptionByValue(oggetto.id,oggetto.defaultIdenFromTabEcoCod);
						}
					}
				}
				catch(e){
					;
				}
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
	var collectionCampi;
	
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


/* This script and many more are available free online at
The JavaScript Source!! http://javascript.internet.com
Created by: Robert Nyman | http://robertnyman.com/ */
function removeHTMLTags(){
 	if(document.getElementById && document.getElementById("input-code")){
 		var strInputCode = document.getElementById("input-code").innerHTML;
 		/* 
  			This line is optional, it replaces escaped brackets with real ones, 
  			i.e. < is replaced with < and > is replaced with >
 		*/	
 	 	strInputCode = strInputCode.replace(/&(lt|gt);/g, function (strMatch, p1){
 		 	return (p1 == "lt")? "<" : ">";
 		});
 		var strTagStrippedText = strInputCode.replace(/<\/?[^>]+(>|$)/g, "");
 		alert("Output text:\n" + strTagStrippedText);	
   // Use the alert below if you want to show the input and the output text
   //		alert("Input code:\n" + strInputCode + "\n\nOutput text:\n" + strTagStrippedText);	
 	}	
}




// funzione che rimuove elemento html
// dalla pagina html
function removeHtmlElementById(elName) {
	var el;
	try{
		el = document.getElementById(elName);
		if (el){
			el.parentNode.removeChild(el);
		}
	}
	catch(e){
		alert("removeHtmlElementById - " + e.description);
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
			if (typeof(obbligatorio)=="undefined"){obbligatorio="N";}			
		}
		catch(e){
			obbligatorio= "N";
		}
		if ((obbligatorio =="N")){
			bolEsito = true;	
		}
		else{
			if ((obbligatorio =="S")&&(oggetto.value!="")){
				bolEsito = true;	
			}
			else{
				try{
					descrizione = oggetto.descrizione;
					if ((typeof (descrizione) == "undefined")||(descrizione == "")){
					   alert("Prego, compilare il campo: " + oggetto.id);						
					}
					else{
					   	alert("Prego compilare il campo: " + descrizione);					
					}
				}
				catch(e){
				   alert("Si prega di compilare il campo: " + oggetto.id + " - " + oggetto.name);
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


function utilCreaBoxAttesa(){
	/*
	var divObject ;
	var spanObject ;
	
	
	try{
		divObject =  document.createElement("DIV");
		divObject.id = "attesaBox";	
		spanObject = document.createElement("SPAN");
		spanObject.id = "idSpanAttesaBox";
		spanObject.className = "testoAttesaBox";
		spanObject.innerHTML = "<LABEL id='labelAttesaBox'>Attendere prego...</LABEL>";	
		divObject.appendChild(spanObject);
		document.body.appendChild(divObject);
	}
	catch(e){
		alert("creaBoxAttesa - Error: " + e.description);
	}	*/
	var divObject ;
	var spanObject ;
	
	
	try{
		divObject =  document.createElement("DIV");
		divObject.id = "attesaBox";	
		spanObject = document.createElement("SPAN");
		spanObject.className = "testoAttesaBox";
		spanObject.id = "spanAttesaBox";	
		spanObject.innerHTML = "Attendere prego...";
		divObject.appendChild(spanObject);
		document.body.appendChild(divObject);
	}
	catch(e){
		alert("utilCreaBoxAttesa - Error: " + e.description);
	}		
}

function utilMostraBoxAttesa(bolStato, titolo){
	/*var oggetto;
	var label ;
	try{
		
		//if ((titolo=="")||(titolo=="undefined")){
			titolo = "<font color='white'>Attendere prego...</font>";
		//}
		//alert("#" + titolo +"#");		
		document.getElementById("labelAttesaBox").innerHTML = titolo;
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
		alert("mostraBoxAttesa - Error: " + e.description);
	}*/
	var oggetto;
	var spanObj;
	try{
		
		oggetto = document.getElementById("attesaBox");
		if (oggetto){
			if (bolStato){
								
				spanObj = document.getElementById("spanAttesaBox");
				
				if (spanObj){
					if (titolo!=""){
						spanObj.innerHTML = "<LABEL>" + titolo +"</LABEL>";
						spanObj.style.top = "200px"; 
					}
					var iebody=(document.compatMode && document.compatMode != "BackCompat")? document.documentElement : document.body
					var dsocleft=document.all? iebody.scrollLeft : pageXOffset;
					var dsoctop=document.all? iebody.scrollTop : pageYOffset;
					oggetto.style.top = dsoctop;
					oggetto.style.left = dsocleft;
					oggetto.style.visibility = "visible";
				}
			}
			else{
				oggetto.style.visibility = "hidden";				
			}

		}
	}
	catch(e){
		alert("utilMostraBoxAttesa - Error: " + e.description);
	}	
}


// gestisco entry dell'ora 
// su event keydown
function formatOra(oggetto){
	var oggetto	;
	var valore;
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
   try{
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
   }
   catch(e){
		alert("isValidTime - Error: " + e.description);	   
   }
   return true;
}


// restituisce oggetto con 
// proprietà x e y 
// relative alla posizione assoluta
// dell'oggetto
function getPosition(e){   
     var left = 0;   
     var top  = 0;   
	
		try{
		 while (e.offsetParent!=null){   
			 left += e.offsetLeft;   
			 top  += e.offsetTop;   
			 e     = e.offsetParent;   
		 }   
	   
		 left += e.offsetLeft;
		 top  += e.offsetTop;
	   }
	   catch(e){
			alert("isValidTime - Error: " + e.description);	   
	   }   
     return {x:left, y:top};   
 }  
 
 
 

// funzione che ritorna
// la corretta classe CSS
// in base al tipo di interfaccia
// touch o normale
// tipo N normale O obbligatorio E errore
function getCssValidatorClass(inCss,tipo){
	var strOutput = "";
	var touchStyle = false;
	try{
		if (inCss.indexOf("touch") == -1){	
			// oggetto NON di tipo touch !!
			touchStyle = false;
		}
		else{
			// oggetto di tipo Touch !
			touchStyle = true;			
		}	
		switch (tipo){
			case "N":
				if (touchStyle){
					strOutput = "touchCampoNormale";											
				}
				else{
					strOutput = "campoNormale";							
				}
				break;
			case "O":
				if (touchStyle){
					strOutput = "touchCampoObbligatorio";											
				}
				else{
					strOutput = "campoObbligatorio";							
				}	
				break;
			case "E":
				if (touchStyle){
					strOutput = "touchCampoErrato";											
				}
				else{
					strOutput = "campoErrato";							
				}	
				break;
			default:
				if (touchStyle){
					strOutput = "touchCampoNormale";											
				}
				else{
					strOutput = "campoNormale";							
				}
				break;			
				
		}
		return strOutput ;	
	}
	catch(e){
		alert("getCssValidatorClass - Error:  "+ e.description);
	}
} 


/*
Definisco un oggetto di tipo controllo
che mi permetterà di andare ad effettuare
i vari controlli sugli oggetti dei campi html

tipoDato:  Numero (N), stringa (S), Data(D)
obbligatotio: S/N
decimali:  nel caso fosse numero specificare il numero di decimali
lungMax:   nel caso fosse stringa specificare la lungh max
callBack: funzione di callback chiamata se i controlli sono ok 
NB alla funzione di callback sarà passato l'oggetto (this) stesso
NON dovra contenere le ()
*/
function tipoControllo (myTipoDato, myObbligatorio, myDecimali, myLungMax, myCallBack) {
    this.tipoDato = myTipoDato;  
    this.obbligatorio = myObbligatorio;  
    this.decimali = myDecimali;  
	this.lungMax = myLungMax;
	this.callBack = myCallBack;
}
// es d'uso var nuovoControllo = new tipoControllo("S","S",0, 15)
// ovvero stringa obbligatoria di 15 char max



// funzione che controlla la validità del dato
// NB !! Il controllo con le regular expression
// al momento funziona con  2 decimali
// se è maggiore di 2 funzia con qualunque numero di decimali
function validaDato(oggettoHtml, oggettoTipoControllo){
	
	var strTmp = "";
	var patternDecimali;
	var patternStr = "";
	var k=0;
	
	try{
  	   window.event.cancelBubble = true;		
	   strTmp = oggettoHtml.value ;		
		// contorllo obbligatorietà
		if ((oggettoTipoControllo.obbligatorio=="N")&&(strTmp=="")){
			// non obbligatorio e vuoto
			oggettoHtml.className = getCssValidatorClass(oggettoHtml.className,"N");
			if (oggettoTipoControllo.callBack!=""){
				// gli passo anche l'ID per poi ritrovare l oggetto
				// che ha generato la chiamata
				eval(oggettoTipoControllo.callBack + "('" + oggettoHtml.id + "')");
			}			
			return false;
		}
	   if ((oggettoTipoControllo.obbligatorio=="S")&&(strTmp=="")){
			window.event.cancelBubble = true;
			oggettoHtml.focus();		
			oggettoHtml.className = getCssValidatorClass(oggettoHtml.className,"E");		   		
//			try{mostraSpanNotifica("Prego compilare il campo.Id: " + oggettoHtml.id,true);}catch(e){;}
//			alert("Prego compilare il campo.Id: " + oggettoHtml.id);
			return false;
	   }		
		// controllo il tipo 
		switch (oggettoTipoControllo.tipoDato){
		   case "S" :
			   // stringa
			   if (strTmp.length > oggettoTipoControllo.lungMax){
				   alert("Il campo può avere lunghezza masssima: " + oggettoTipoControllo.lungMax + " caratteri.");
					oggettoHtml.className = getCssValidatorClass(oggettoHtml.className,"E");		   
				   oggettoHtml.focus();
				   return false;
			   }
			   // caratteri proibiti !
			   for (k=0;k<arrayCaratteriProibiti.length;k++){
				   if (oggettoHtml.value.indexOf(arrayCaratteriProibiti[k])!=-1){
					   alert("Il campo non può contenere il carattere: " + arrayCaratteriProibiti[k]);
						oggettoHtml.className = getCssValidatorClass(oggettoHtml.className,"E");		   
					   oggettoHtml.focus();
					   return false;					   
				   }
			   }
			   
				// resetto se tutti i controlli vanno bene
				if (oggettoTipoControllo.obbligatorio=="N"){
					oggettoHtml.className = getCssValidatorClass(oggettoHtml.className,"N");		   	
				}
				else{
					oggettoHtml.className = getCssValidatorClass(oggettoHtml.className,"O");		   					
				}
			   break;
		   case "N" :
		   		var bolNegative= false;
				// *********************************
				// modifica 4-8-15
				try{
					if (!String.prototype.trim) {
					  (function() {
						// Make sure we trim BOM and NBSP
						var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
						String.prototype.trim = function() {
						  return this.replace(rtrim, '');
						};
					  })();
					}							
					strTmp = strTmp.toString().trim();
					if (strTmp.substr(0,1)=="+"){
						strTmp = strTmp.substr(1,strTmp.length);
					}
				}catch(e){;}
				// **********************
				// modifica 30-7-15
			  	if (isNaN(strTmp.replace(",","."))){
					// NON è un numero
					oggettoHtml.className = getCssValidatorClass(oggettoHtml.className,"E");		   				   
					oggettoHtml.focus();
					if ((typeof (oggettoHtml.descrizione) == "undefined") || (oggettoHtml.descrizione=="")){strTmp= oggettoHtml.id;}else{strTmp = oggettoHtml.descrizione;}
					alert("Il campo "+ strTmp + "  deve essere numerico");
				}
				else{
					// è un numero
					if (strTmp<0){
						strTmp = strTmp.toString().substring(1,strTmp.length);
						bolNegative = true;
					}
					if (oggettoTipoControllo.decimali==1){
						if (strTmp.replace(/,/g, ".").indexOf(".")==-1){
							// non trovati decimali
							patternDecimali=/^([0-9]+)$/;						
						}
						else{
							patternDecimali=/^[0-9]+\.\d{1}$/ ;
						}
					}
					else if(oggettoTipoControllo.decimali==2){
						if (strTmp.replace(/,/g, ".").indexOf(".")==-1){
							// non trovati decimali
							patternDecimali=/^([0-9]+)$/;						
						}
						else{					
							patternDecimali=/^[0-9]+\.\d{1,2}$/ ;
						}
					}
					else if(oggettoTipoControllo.decimali==0){
						// controllo che ci siano solo numeri !
						patternDecimali=/^([0-9]+)$/;
					}				
					else{
						// default n decimali
						patternStr = "/^([0-9])+\.([0-";
						eval("patternDecimali =" + patternStr + oggettoTipoControllo.decimali +"])/;");
					}
					// controllo
					if (!patternDecimali.test(strTmp.replace(/,/g, "."))) { 
					   if (oggettoTipoControllo.decimali>0){
						   if ((typeof (oggettoHtml.descrizione) == "undefined") || (oggettoHtml.descrizione=="")){strTmp= oggettoHtml.id;}else{strTmp = oggettoHtml.descrizione;}
						   strTmp = "Il campo "+ strTmp + " deve essere numerico e puo' avere al massimo " + oggettoTipoControllo.decimali + " decimali.";
					   }
					   else{
						   strTmp = "Il campo deve essere numerico";
					   }
					   oggettoHtml.className = getCssValidatorClass(oggettoHtml.className,"E");		   				   
					   oggettoHtml.focus();
					   //alert(strTmp);
					   return false;
					} 				
					else{
						// OK
						// risetto il valore con un eventuale . al posto della ,
						oggettoHtml.value = strTmp.replace(/,/g, ".");
						if (bolNegative){
							oggettoHtml.value = "-" + oggettoHtml.value;
						}
						// resetto se tutti i controlli vanno bene
						if (oggettoTipoControllo.obbligatorio=="N"){
							oggettoHtml.className = getCssValidatorClass(oggettoHtml.className,"N");		   						
						}
						else{
							oggettoHtml.className = getCssValidatorClass(oggettoHtml.className,"O");		   						
						}			
					}
				}
  			    break;
		   case "D" :
			// data
		} 
		try{mostraSpanNotifica("",false);}catch(e){;}
//		alert(oggettoTipoControllo.callBack);
		if (oggettoTipoControllo.callBack!=""){ 
			// gli passo anche l'ID per poi ritrovare l oggetto
			// che ha generato la chiamata
			eval(oggettoTipoControllo.callBack + "('" + oggettoHtml.id + "')");
		}
		return true;
	}
	catch(e){
		alert("validaDato - error: " + e.description);
	}
}


function creaPrototypeArray(){
	if (!Array.prototype.indexOf) {
	    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
	        "use strict";
	        if (this == null) {
	            throw new TypeError();
	        }
	        var t = Object(this);
	        var len = t.length >>> 0;
	        if (len === 0) {
	            return -1;
	        }
	        var n = 0;
	        if (arguments.length > 1) {
	            n = Number(arguments[1]);
	            if (n != n) { // shortcut for verifying if it's NaN
	                n = 0;
	            } else if (n != 0 && n != Infinity && n != -Infinity) {
	                n = (n > 0 || -1) * Math.floor(Math.abs(n));
	            }
	        }
	        if (n >= len) {
	            return -1;
	        }
	        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
	        for (; k < len; k++) {
	            if (k in t && t[k] === searchElement) {
	                return k;
	            }
	        }
	        return -1;
	    }
	}
}