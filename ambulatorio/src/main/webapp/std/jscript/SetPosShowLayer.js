// javascript per menu a tendina

function showLayerSetPos(layerName){


 var currentMenu;
 var sx = document.body.scrollLeft + event.clientX;
 var tp = document.body.scrollTop + event.clientY;

 currentMenu = eval(layerName);
 currentMenu.style.left = sx-10;
 currentMenu.style.top = tp+3;
 currentMenu.style.visibility = 'visible';

}

function hideLayerSetPos(layerName){
 var currentMenu;

 currentMenu = eval(layerName);
 currentMenu.style.visibility = 'hidden';

}