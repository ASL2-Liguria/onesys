caricaIdenAnag();

function aggiorna(){
	
	var opener=window.dialogArguments;
	opener.document.location.replace(opener.document.location);
}

function chiudiControindicazioni(){

	parent.self.close();
}
      
function registraControindicazioni(){				
	
	registra();
}

jQuery(document).ready(function(){
	
	jQuery('#txtNota').addClass("expand");
	jQuery("textarea[class*=expand]").TextAreaExpander(); 
		
	if (_STATO_PAGINA == 'L'){
		document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
	}
});


function caricaIdenAnag(){
	
	var opener=window.dialogArguments;
	var idenAnag=opener.gup('IDEN_ANAG');
	//alert('IDEN_VISITA: '+document.EXTERN.IDEN_VISITA.value);
	document.getElementById('Hiden_anag').value=idenAnag;
}