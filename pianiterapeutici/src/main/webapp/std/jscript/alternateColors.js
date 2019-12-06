function addAlternateColor(){
	var numeroRighe;
	var resto;
	
	var bolEnableAlternateColors 

	try{
		bolEnableAlternateColors = enableAlternateColors;
	}
	catch(e){
		bolEnableAlternateColors="N";
	}
	if (bolEnableAlternateColors!="S"){
		return;
	}
	numeroRighe = document.getElementById("oTable").rows.length;
	for (var i=0;i<numeroRighe;i++){
		resto = parseInt(i%2);
		if (resto!=0){
			// dispari
			document.all.oTable.rows(i).style.backgroundColor = oddRowColor ;
		}
		else{
			//pari
			document.all.oTable.rows(i).style.backgroundColor = evenRowColor ;
		}

	}
}



function hasClass(ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
	if (!this.hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
	if (hasClass(ele,cls)) {
    	var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className=ele.className.replace(reg,' ');
	}
}