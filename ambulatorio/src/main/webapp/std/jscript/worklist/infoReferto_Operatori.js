function initGlobalObject(){
	fillLabels(arrayLabelName,arrayLabelValue);
	try{
		// chiamo funzione presente in infoRefertoEngine.js		
		initBaseClass();
	}
	catch(e){
		;
	}	
	try{
		// chiamo funzione presente in infoRefertoEngine.js
		createMaximizeTabulator();
	}
	catch(e){;}	
	// controllo se devo massimizzare
	try{
		if (inputMaximized ){
			risezeConsoleBottomFrame(true);			
		}
	}
	catch(e){;}		
	
}