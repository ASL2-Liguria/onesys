/*
 * Richiede html2canvas
 */

$(document).ready(function() {
	parent.semaforo_anteprima.resolve();
});

var RENDER = {
		document: null,
		canvas: null,
		dataurl: null,
		
		scala_css: function(obj, proprieta, scala){
			var old = obj.css(proprieta);
			var nuovo = old.substring(0,old.length-2) * scala;
			obj.css(proprieta, nuovo + "px");
		},
		
		resize: function(elemento_dom, scala){
			var elemento = $(elemento_dom);
			RENDER.scala_css(elemento, "width", scala);
			RENDER.scala_css(elemento, "height", scala);
			RENDER.scala_css(elemento, "font-size", scala);
			$("div, img", elemento).each(function(){
				RENDER.scala_css($(this), "width", scala);
				RENDER.scala_css($(this), "height", scala);
				RENDER.scala_css($(this), "left", scala);
				RENDER.scala_css($(this), "top", scala);
			});
		},

		to_canvas: function(elemento, callback) {
			html2canvas(
					elemento,
					{
						onrendered: function(canvas) {
							RENDER.canvas = canvas;
							RENDER.dataurl = canvas.toDataURL("image/png", 1.0);
							if (typeof callback == "function") {
								callback(RENDER.dataurl);
							}
						},
						height: $(elemento).height(),
						width: $(elemento).width()
					}
			);
		},
		
		print: function(callback) {
			RENDER.resize(document.body, 3);
			RENDER.to_canvas(document.body, callback);
		}
};


//JavaScript BarCode39 v. 1.0 (c) Lutz Tautenhahn, 2005
//The author grants you a non-exclusive, royalty free, license to use,
//modify and redistribute this software.
//This software is provided "as is", without a warranty of any kind.

function Code39(theBarCodeText, theBarHeight, theBarCodeSize) {
	var output = "";
	var ss = 1;
	if (theBarCodeSize)
		ss = parseInt(theBarCodeSize);
	if (isNaN(ss) || ss < 1)
		ss = 1;
	output += CodePics("*", theBarHeight, ss);
	for (var i = 0; i < theBarCodeText.length; i++)
		output += CodePics(theBarCodeText.charAt(i), theBarHeight, ss);
	output += CodePics("*", theBarHeight, ss);
	return output;
}

function CodePics(theChar, theHeight, theSize) {

	var Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%";
	var Codes = new Array("111221211", "211211112", "112211112", "212211111",
			"111221112", "211221111", "112221111", "111211212", "211211211",
			"112211211", "211112112", "112112112", "212112111", "111122112",
			"211122111", "112122111", "111112212", "211112211", "112112211",
			"111122211", "211111122", "112111122", "212111121", "111121122",
			"211121121", "112121121", "111111222", "211111221", "112111221",
			"111121221", "221111112", "122111112", "222111111", "121121112",
			"221121111", "122121111", "121111212", "221111211", "122111211",
			"121121211", "121212111", "121211121", "121112121", "111212121");
	var BarPic = new Array(2);
	BarPic[0] = new Image();
	BarPic[0].src = "img/code39b.gif";
	BarPic[1] = new Image();
	BarPic[1].src = "img/code39w.gif";
	
	var ss = "", cc = "9", ii = Chars.indexOf(theChar);
	if (ii >= 0)
		cc = Codes[ii];
	for (ii = 0; ii < cc.length; ii++)
		ss += "<img src='"
				+ BarPic[ii % 2].src
				+ "' width="
				+ ((cc.charAt(ii) * (3 * theSize - theSize % 2) - theSize + theSize % 2) / 2)
				+ " height=" + theHeight + ">";
	ss += "<img src='" + BarPic[ii % 2].src + "' width=" + theSize + " height="
			+ theHeight + ">";
	return (ss);
}
