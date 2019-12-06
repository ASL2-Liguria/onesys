var idInfoLayerAboutPat = "idInfoLayerAboutPat";
var idInfoLayerAboutPatInner = "idInfoLayerAboutPatInner";
var idInfoLayerAboutPatShadow = "idInfoLayerAboutPatShadow";
var bolCreatedInfoPatLayer = false;

var clientx ;
var clienty ;

// funzione che nasconde livello
// riguardante le info del paziente
function hideInfoLayerInWorklist(){
	hideInfoLayerById(idInfoLayerAboutPat);
	hideInfoLayerById(idInfoLayerAboutPatInner);
	hideInfoLayerById(idInfoLayerAboutPatShadow);	
}

function hideInfoLayerById(id){
	var obj = document.getElementById(id);
	if (obj){
		obj.style.visibility = 'hidden';
		obj.id=obj.id + '1';
	}	
}


// creo livello con le informazioni
// dell'esame al suo interno
function createDivInfoPatLayer(){
	
	var divInfoLayer
	var divInfoLayerInner
	var divInfoLayerShadow	
	
	try{
		divInfoLayerInner = document.createElement("DIV");
		divInfoLayerInner.id = idInfoLayerAboutPatInner;
		divInfoLayerInner.className = "boxInfoLayer-inner";	
		
		divInfoLayer = document.createElement("DIV");
			
		divInfoLayer.id = idInfoLayerAboutPat;
		divInfoLayer.className = "boxInfoLayer";
		divInfoLayer.appendChild(divInfoLayerInner);
		divInfoLayer.onclick = function(){hideInfoLayerInWorklist();}
		
		// shadow
		// divInfoLayerShadow = document.createElement("DIV");
		// divInfoLayerShadow.id = idInfoLayerAboutPatShadow;
		// divInfoLayerShadow.className = "boxInfoLayer";
		
		document.body.appendChild(divInfoLayer);
		// document.body.appendChild(divInfoLayerShadow);
		bolCreatedInfoPatLayer = true;
	}
	catch(e){
		alert("createDivInfoPatLayer " + e.description);
	}
}


function apriDiv(note,noteChiusura){

	clientx = event.clientX;
	clienty = event.clientY;

	hideInfoLayerInWorklist();
	createDivInfoPatLayer();
	setLayerPosition(clienty,clientx);
	setContentLayer(note,noteChiusura);

}

function setLayerPosition(top,left){
	var altezzaDocumento = document.body.offsetHeight;	
	var larghezzaDocumento = document.body.offsetWidth;		
	var obj = document.getElementById(idInfoLayerAboutPat);

	var posizioneTop
	var posizioneLeft
	
	try{
		if (obj){
			obj.style.visibility = 'visible';		
			obj.style.position = "absolute";
			posizioneLeft = left;
			// posizionamento verticale
			if ((top+obj.scrollHeight)>altezzaDocumento){
				if ((top-obj.scrollHeight)>0){
					posizioneTop = document.body.scrollTop+(top-obj.scrollHeight);
					}
				else{
					posizioneTop = document.body.scrollTop
				}
				
			}
			else{
				posizioneTop = document.body.scrollTop+top;
			}	
			// posizionamento orizzontale
			if ((left+obj.scrollWidth)>larghezzaDocumento){
				if ((left-obj.scrollWidth)>0){
					posizioneLeft = document.body.scrollLeft+(left-obj.scrollWidth);
					}
				else{
					posizioneLeft = document.body.scrollLeft
				}
				
			}
			else{
				posizioneLeft = document.body.scrollLeft+left;
			}				
			// ******************************
			
			
			obj.style.left = posizioneLeft ;
			obj.style.top = posizioneTop;
		}
		// sposto anche l'ombra
		var objShadow = document.getElementById(idInfoLayerAboutPatShadow);
		if (objShadow){
			//objShadow.style.visibility = 'visible';		
			//objShadow.style.position = "absolute";
			//objShadow.style.left = parseInt(posizioneLeft+5);
			//objShadow.style.top =  parseInt(posizioneTop+5);
		}
	}
	catch(e){
		alert("setLayerPosition " + e.description);
	}

}

function setContentLayer(note,noteChiusura){	
	var obj = document.getElementById(idInfoLayerAboutPatInner);
	var div2=document.getElementById(idInfoLayerAboutPat);
	var contenutoHtml = "";
	
	try{
		if(obj){
			// paziente 				
			contenutoHtml = "<div onclick=\"hideInfoLayerInWorklist()\"></DIV>";					
			contenutoHtml += "<table cellspacing='2' width='100%' class='classFormRicPaz' border='0' cellpadding='2'><TBODY>";
			contenutoHtml += "<TR></TR>";
			if(note!=''){
			contenutoHtml += "<TR><td class='TitoloSez'>Note</td></TR>";
			contenutoHtml += "<TR><td class='textDettaglio'>" + note+"<br /></TD></TR>";
			contenutoHtml += "<TR></TR>";
			contenutoHtml += "<TR></TR>";
			}
			if(noteChiusura!=''){
			contenutoHtml += "<TR><td class='TitoloSez'>Note Chiusura</td></TR>";
			contenutoHtml += "<TR><td class='textDettaglio'>" +noteChiusura+"<br /></TD></TR>";
			}
			contenutoHtml += "</TBODY></TABLE>"
			obj.innerHTML = contenutoHtml;
			obj.style.visibility = 'visible';
		}
	}
	catch(e){
		alert("setContentLayer - Error: "+ e.description);
	}
	
}