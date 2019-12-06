// JavaScript Document
statoFrame='chiuso';
window.onload = function startup(){initGlobalObject();};
// funzione EXPANDMENU
function expandMenu(){
 if(statoFrame=='chiuso'){
	parent.document.all.oFrameset.cols = '170,*';
     statoFrame='aperto';}
 else{
   shrinkMenu();
   statoFrame='chiuso';}
 leftFrame.ShowHideLayer('layMenuContainer');
}

        
// funzione SHRINKMENU
function shrinkMenu(){
	parent.document.all.oFrameset.cols = '20,*';
}

		
function initGlobalObject(){
	var oggetto 
	try{
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

