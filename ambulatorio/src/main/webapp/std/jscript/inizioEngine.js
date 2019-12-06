// JavaScript Document
statoFrame='chiuso';
window.onload = function startup(){initGlobalObject();};
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
//		alert("Sito in fase di test");
		window.onunload = function scaricaFrameset(){scarica();};
		initbaseGlobal();
		initbaseUser();
		initbasePC();
	}
	catch(e){
		;
	}
}

// funzione che scarica
// tutti gli oggetti aperti
function scarica(){


}

