// javascript per menu a tendina

function hideMenu(menuName){
 var currentMenu;
 if (event.srcElement.className=='DropDownMenuLinks'){
     currentMenu = eval(menuName);
     currentMenu.style.visibility = 'hidden';
 }
}

function MenuTxSx(menuName){



var currentMenu;
var altezzaDocumento = document.body.offsetHeight;
var larghezzaDocumento = document.body.offsetWidth; 
var oldScrollBody ;

//cancella l'evento
event.returnValue = false;

 currentMenu = eval(menuName)
 // posizionamento orizzontale
 if ((event.clientX + currentMenu.scrollWidth)>larghezzaDocumento){
	 currentMenu.style.left = document.body.scrollLeft+event.clientX - currentMenu.scrollWidth +10;
 }
 else{
 	 currentMenu.style.left = document.body.scrollLeft+event.clientX-10;
 }
 // **** pozionamento verticale
 if ((event.clientY+currentMenu.scrollHeight)>altezzaDocumento){
	 currentMenu.style.top = document.body.scrollTop+event.clientY-currentMenu.scrollHeight +10;
 }
 else{
	 // vedo tutto il quadro
	 currentMenu.style.top = parseInt(document.body.scrollTop+event.clientY-10);
 }
 // ****
 currentMenu.style.visibility = 'visible';

}




