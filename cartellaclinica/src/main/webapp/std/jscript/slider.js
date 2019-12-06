function appendSlider(obj_a_cui_appendere,larghezza,rangeDown,rangeUp,inVisibility){
	
	var divSlider = document.createElement("div");
	divSlider.className = "slider";
	divSlider.style.width = larghezza+'px';
	divSlider.style.visibility = inVisibility;
	
	var divSliderSX = document.createElement("div");
	divSliderSX.className = "sliderSX";	
	
	var divSliderMiddle = document.createElement("div");
	divSliderMiddle.className = "sliderMiddle";	
	divSliderMiddle.style.width = (larghezza-18) + 'px';
	
	var divSliderDX = document.createElement("div");	
	divSliderDX.className = "sliderDX";	
	
	var divSliderBT = document.createElement("div");	
	divSliderBT.className = "sliderBT";	
	divSliderBT.onmousedown = function(){startSlide(this);}
	
	var newAttr = document.createAttribute("rangeUp");
	newAttr.nodeValue  = rangeUp;
	divSlider.setAttributeNode(newAttr);

	newAttr = document.createAttribute("rangeDown");
	newAttr.nodeValue  = rangeDown;
	divSlider.setAttributeNode(newAttr);	

	newAttr = document.createAttribute("value");
	newAttr.nodeValue  = 0;	
	divSlider.setAttributeNode(newAttr);
	
	divSliderMiddle.appendChild(divSliderBT);
	
	divSlider.appendChild(divSliderSX);
	divSlider.appendChild(divSliderMiddle);
	divSlider.appendChild(divSliderDX);
	
	obj_a_cui_appendere.appendChild(divSlider);
	
	
}
function startSlide(obj){
	
	var objApp = obj.parentNode.parentNode;
	curleft =0;
	if (objApp.offsetParent) {
		do {
			curleft += objApp.offsetLeft;;
			} while (objApp = objApp.offsetParent);
	}
	obj.minVal = curleft;
	obj.maxVal = curleft + obj.parentNode.parentNode.offsetWidth - obj.offsetWidth;
	obj.style.position = 'absolute';
	
	var moveDiff =parseInt( event.clientX-obj.offsetLeft,10);
	document.body.onmousemove=function(){slideTo(obj,moveDiff);}
	document.body.onmouseup=function(){endSlide(obj);}	
}
function slideTo(obj,moveDiff){

	if(event.clientX-moveDiff>=obj.minVal && event.clientX-moveDiff<=obj.maxVal)
		obj.style.left=(event.clientX - moveDiff) + 'px';

}
function endSlide(obj){
	
	obj.parentNode.parentNode.value = (obj.offsetLeft - obj.parentNode.parentNode.offsetLeft)*obj.parentNode.parentNode.rangeUp/ (obj.parentNode.parentNode.offsetWidth-obj.offsetWidth);
	
	obj.parentNode.parentNode.value=roundTo(obj.parentNode.parentNode.value,2);
	obj.style.position = 'fixed';
	document.body.onmousemove=function(){null;}
	document.body.onmouseup=function(){null;}	
}
function roundTo(value, decimalpositions)
{
    var i = value * Math.pow(10,decimalpositions);
    i = Math.round(i);
    return i / Math.pow(10,decimalpositions);
} 