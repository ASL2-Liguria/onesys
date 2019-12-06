
function registraControind(){
	if(document.all.txtMotivo.innerText.length<window.dialogArguments){
		alert('Inserire una motivazione esauriente');
	}else{
		window.returnValue=document.all.txtMotivo.innerText;
		self.close();
	}	
}

function chiudiControind(){
	self.close();
}
//alert(document.all['lblRegistra'].outerHTML);
document.all['lblRegistra'].href='#';
document.all['lblRegistra'].onclick=function(){registraControind();}

document.all['lblClose'].href='#';
document.all['lblClose'].onclick=function(){chiudiControind();}

//alert(document.all['lblRegistra'].outerHTML);

