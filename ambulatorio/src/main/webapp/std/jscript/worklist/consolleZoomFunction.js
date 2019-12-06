// JavaScript Document

var rightZoomClass="toRight";
var leftZoomClass ="toLeft";

//funzione che ritorna la larghezza del frame di sinistra
function getLeftFrameWidth(){
	return parent.document.all.leftConsolle.width;
}


// ridimensiona il frame di sinistra alla percentuale
// passata come parametro
function resizeLeftFrameToMaxInPercent(percentuale){
	
	var larghezzaFrameSx;
	// ridimensiono Frameset	
	// a circa il 70 per cento
	if (isNaN(percentuale)){
		return;
	}
	larghezzaFrameSx = Math.round(parseInt(larghezzaSchermo*percentuale)/100);
	parent.document.all.framesetConsolle.cols=larghezzaFrameSx + " ,*";
	// ridimensiono controllo 
	setReportControlObjectSize(larghezzaFrameSx,getReportControlHeight());
	
}

// ridimensiona il frame di destra alla percentuale
// passata come parametro
function resizeRightFrame(dimensione){
	
	var larghezzaFrameSx;

	if (isNaN(dimensione)){
		return;
	}
	larghezzaFrameSx = Math.round(parseInt(larghezzaSchermo-dimensione-10));
	parent.document.all.framesetConsolle.cols="*," + dimensione;
	// ridimensiono controllo 
	setReportControlObjectSize(larghezzaFrameSx,getReportControlHeight());
}


function setZoomClass(valore,classType){
	if (valore==""){return;}
	objectNode = document.getElementById(valore);
	if (objectNode){
		objectNode.className=classType;
	}
}

// funzione che gestisce
// lo zoom del frame di sinistra
function zoomConsolleLeftFrame(){
	objectNode = document.getElementById("divBtZoom");
	if (objectNode){
		if (objectNode.className==leftZoomClass){
			// devo settare pulsante right
			// ZOOM NORMALE
			setZoomClass("divBtZoom",rightZoomClass);
			resizeRightFrame(dimensioneDefaultRightFrame);
		}
		else{
			// ZOOM MAX
			setZoomClass("divBtZoom",leftZoomClass);
			resizeRightFrame(0);
		}
	}
}

// funzione che fa lo zoom
// della parte di refertazione
// ridimensionando al volo 2 layer
function zoomConsolle(){
	ShowHideLayer('divFirstLayout');
	resizeRptCtlAfterCloseLayer('divFirstLayout');
	ShowHideLayer('divSecondLayout');
	resizeRptCtlAfterCloseLayer('divSecondLayout');	
}
 