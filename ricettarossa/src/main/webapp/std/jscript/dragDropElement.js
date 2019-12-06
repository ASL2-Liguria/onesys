// JavaScript Document

var dragDropVariable_Giu = true;
var dragDropVariable_ResizedField = "";
var dragDropVariable_widthPreviousField = "";
var idResizeElement= "idDragDropResizeElement";
var leftBeforeDragDrop 
var leftAfterDragDrop 
var dragDropFunctionToCallAfterDropping = "";


function Coordinate(idValue)
{
	var posizioneTop 
	var oggetto 
	var altezzaDocumento = document.body.offsetHeight;
	
	try{
		
		dragDropVariable_Giu = true;
		// prendo il nome del campo precedente (a sx)
		// che voglio ridimensionare, larghezza inclusa
		dragDropVariable_ResizedField = event.srcElement.previousField; 
		dragDropVariable_widthPreviousField = event.srcElement.previousFieldWidth;
		// attenzione che se metto
		// cancelBubble viene cancellato l'evento di click
		// quindi NON è + possibile ordinare
		// quseto accade perchè la generazione degli
		// eventi è: mousedown, mouseup e infine onclick
		event.cancelBubble=true;
		leftBeforeDragDrop = parseInt(document.body.scrollLeft+event.clientX);
		showidDragDropResizeElement(idValue); 
		
		// ******* calcolo posizione top
 	    oggetto = document.getElementById(idValue);
		if (oggetto){
			if ((event.clientY+ oggetto.scrollHeight)>altezzaDocumento){
				if ((event.clientY-oggetto.scrollHeight)>0){
					posizioneTop = document.body.scrollTop+(event.clientY-oggetto.scrollHeight)-40;
				}
				else{
					posizioneTop = document.body.scrollTop - 40;
				}				
			}
			else{
				posizioneTop = document.body.scrollTop+event.clientY - 40;
			}
		}
		// **************
		
		setPositionidDragDropResizeElement(idValue, parseInt(document.body.scrollLeft+event.clientX-document.getElementById(idValue).clientWidth + 70), posizioneTop);
		document.onmousemove = function(){dragDropMuovi(idValue);};
	}
	catch(e){
		alert("Coordinate " + e.description);
	}		
	
}

function dragDropMuovi(idValue)
{

	var oggetto
	
	try{

	  if (dragDropVariable_Giu){
		  oggetto = document.getElementById(idValue)
		  if (oggetto){
			oggetto.style.left =parseInt(document.body.scrollLeft+event.clientX-oggetto.clientWidth+70);
		  } // fine check oggetto
	  } // fine check boolean
	} // fine try
	catch(e){
		alert("dragDropMuovi " + e.description);
	}	  
}

function dragDropSu(idValue) {
	var offsetColonna = 0;
	var larghezzaColonna = 0;
	var commandToCall = "";
	
	try{
		if (dragDropVariable_Giu){ 
			// salvo coordinata 
			leftAfterDragDrop = parseInt(document.body.scrollLeft+event.clientX);
			// è stato premuto 
			// pulsante su elemento draggabile
			dragDropVariable_Giu = false;
			hideidDragDropResizeElement(idValue);
			// resetto
			//document.getElementById(idValue).onmousemove = null;		
			//alert("before: " + leftBeforeDragDrop + " after: " + leftAfterDragDrop );
			offsetColonna = parseInt(leftAfterDragDrop - leftBeforeDragDrop);
			//alert("campo da allargare: " + dragDropVariable_ResizedField + " di px: " + offsetColonna);
			//alert("vecchia dimensione: " + dragDropVariable_widthPreviousField);
			// calcolo nuova dimensione colonna!
			larghezzaColonna = calcoloLarghezza(dragDropVariable_widthPreviousField, offsetColonna)
			//alert("larghezzaColonna " + larghezzaColonna);
			// effettuo callback
			if (dragDropFunctionToCallAfterDropping!=""){
				try{
					
					commandToCall = dragDropFunctionToCallAfterDropping + "('" + dragDropVariable_ResizedField + "'," + larghezzaColonna +")";
//					alert(commandToCall);
					eval(commandToCall);
				}
				catch(e){
//					alert("dragDropSu - " + e.description);
				}
			}
			// resetto valore
			dragDropVariable_ResizedField = "";	
			dragDropVariable_widthPreviousField = "";
		}
	}
	catch(e){
		alert("dragDropSu " + e.description);
	}	
}

function showidDragDropResizeElement(idValue){
	try{
		document.getElementById(idValue).style.display='block';
	}
	catch(e){
		alert("showidDragDropResizeElement " + e.description);
	}	
}

function hideidDragDropResizeElement(idValue){
	document.getElementById(idValue).style.display='none';
}

function setPositionidDragDropResizeElement(idValue, valX, valY){
	
	try{
		document.getElementById(idValue).style.left = valX;
		document.getElementById(idValue).style.top = valY;
	}
	catch(e){
		alert("setPositionidDragDropResizeElement " + e.description);
	}
}



// idDiv è l'oggetto
// al quale linkare la visualizzazione 
// dell'oggetto di resizing
function connectDragDropToObjectById(){
	// collection di oggetti input
	var collInput
	var i=0;

	try{
		// nome layer che contiene resize element
		idResizeElement	= "idDragDropResizeElement";
		createDividDragDropResizeElement(idResizeElement);	
		// ***
		/*
		var collInput = document.getElementsByName(idDiv);
		for(i=0;i<collInput.length;i++){
			collInput[i].onmousedown = function(){try{Coordinate(idResizeElement);}catch(e){;}};
		}
		document.onmouseup = function(){try{dragDropSu(idResizeElement);}catch(e){;}}	
		*/
	}
	catch(e){
		alert("connectDragDropToObjectById " + e.description);
	}

}

function createDividDragDropResizeElement(idValue){
	var divElement

	try{
		divElement = document.createElement("DIV");
		divElement.id = idValue;
		divElement.onmouseup = function(){dragDropSu(idValue);}
		//divElement.onmousemove = function(){dragDropMuovi(idValue);};		
		document.body.appendChild(divElement);
	}
	catch(e){
		alert("createDividDragDropResizeElement " + e.description);
	}
	
}


// funczione che setta la funzione da richiamare dopo
// il drop dell'elemento di resize
// ** ATTENZIONE **
// sarebbe opportuno definire una "interfaccia"
// per la funzione di callback !
function setCallBackAfterDragDrop(value){
	dragDropFunctionToCallAfterDropping = value;
}


function calcoloLarghezza(oldLarghezza, offsetColonna){
	// setto valore di default
	var newLarghezza=100;
	var strTmp ="" 
	try{
		strTmp = oldLarghezza ;
		strTmp = strTmp.replace("px","");
		strTmp = strTmp.replace("*","");
		if (strTmp ==""){
			// setto valore di default
			strTmp = "100";
		}
		newLarghezza = parseInt(strTmp) + parseInt(offsetColonna);
		if (newLarghezza<0){
			// setto valore minimo
			newLarghezza = 15;
		}
	}
	catch(e){
		newLarghezza = 100;
	}
	
	return newLarghezza;
}

//JavaScript Document

//definisco la funzione che deve essere 
//richiamata dopo il resize della colonna
//*** ATTENZIONE ***
//le funzioni di callback 
//dovranno TUTTE averre questa interfaccia
function callBackFunctionAfterColResizing(nomeCampo, larghezza){ 
	// aggiorno form per l'aggiornamento automatico
	document.frmAggiorna.hidNomeCampoToResize.value = nomeCampo;
	document.frmAggiorna.hidWidthFieldToResize.value = larghezza;
	// aggiorno
	aggiorna();
}