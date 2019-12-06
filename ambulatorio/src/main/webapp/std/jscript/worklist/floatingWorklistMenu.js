// JavaScript Document

function JSFX_FloatTopDiv()
{
	var startX = 0,
	startY = 0;
	var ns = (navigator.appName.indexOf("Netscape") != -1);
	var d = document;
	function ml(id)
	{
		var el=d.getElementById?d.getElementById(id):d.all?d.all[id]:d.layers[id];
		if(d.layers)el.style=el;
		el.sP=function(x,y){this.style.left=x;this.style.top=y;};
		el.x = startX;
		el.y = startY;
		return el;
	}
	window.stayTopLeft=function()
	{
		var pY = ns ? pageYOffset : document.body.scrollTop;
		ftlObj.y += (pY + startY - ftlObj.y)/8;
		// sposta il layer
		ftlObj.sP(ftlObj.x, ftlObj.y);
		// *****
		setTimeout("stayTopLeft()", 10);
	}
	ftlObj = ml("divStayTopLeft");
	stayTopLeft();
}
