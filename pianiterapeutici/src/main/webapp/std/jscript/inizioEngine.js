// JavaScript Document

var statoFrame='chiuso';
//window.onload = function startup(){initGlobalObject();};

var ArrayWindowOpened = new Array();

initGlobalObject();

function CloseWindowsOpened(){
	for (var i=0;i<ArrayWindowOpened.length;i++){
		try{
			ArrayWindowOpened[i].close();
			
		}catch(e){
			alert(e.description);
		}
	}
}

function getStatoFrame(stato)
{
	if(stato == 'chiuso' || stato == 'aperto')
		statoFrame = stato;
		
	return statoFrame;
}


// funzione EXPANDMENU
function expandMenu(){
	if(statoFrame=='chiuso'){
		parent.document.all.oFrameset.cols = '170,*'; 
    	statoFrame='aperto';
 	}
 	else{
   		shrinkMenu();
   		statoFrame='chiuso';
 	}
 
	leftFrame.ShowHideLayer('layMenuContainer');
 
 // devo ridimensionare, se presente
 // il tabheader della worklist
 try{
	 mainFrame.workFrame.worklistMainFrame.resizeTabHeader();
 }
 catch(e){
	 ;
 }
 
}

        
// funzione SHRINKMENU
function shrinkMenu(){
	parent.document.all.oFrameset.cols = '20,*';
}

		
function initGlobalObject(){
	try{
		
		window.onunload = function scaricaFrameset(){scarica();};
		initbaseGlobal();
		initbaseUser();
		initbasePC();
//		alert("Sito in fase di test");
	}
	catch(e){
		;
	}
}

// funzione che scarica
// tutti gli oggetti aperti
function scarica(){

	//scarico pacs
	// non mi preoccupo del tipo
	// di pacs da scaricare
	// perchè è definito dentro a
	// HideIntegrazioni
	quitPacs();
}

// funzione che fa quit
// dei vari pacs
function quitPacs(){
	try{
		// chiude gli esami sul pacs
		mainFrame.hideFrame.sendToPacs("QUIT",mainFrame.hideFrame.objectSyncPacs,"");	
	}
	catch(e){
		;
	}
}
