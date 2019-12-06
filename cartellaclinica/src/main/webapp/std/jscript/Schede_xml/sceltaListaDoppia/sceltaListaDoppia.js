jQuery(document).ready(function() {
	try { //dialogbox
		var opener=window.dialogArguments;		
		document.getElementById('hCampo').value=opener.document.getElementById(document.EXTERN.HIDDEN_CAMPO.value).value;
	} catch (e) { //fancybox
		document.getElementById('hCampo').value=parent.document.getElementById(document.EXTERN.HIDDEN_CAMPO.value).value;
	}
});

function registraListaDoppia(){
	try {	//dialogbox
		var opener = window.dialogArguments;
		opener.document.getElementById(document.EXTERN.HIDDEN_CAMPO.value).value=document.getElementById('hCampo').value;
		opener.document.getElementById(document.EXTERN.TEXT_CAMPO.value).innerText=getAllOptionTextWithSplitElement('elencoSelezionate',',');
		self.close();
	} catch (e) { //fancybox
		parent.document.getElementById(document.EXTERN.HIDDEN_CAMPO.value).value=document.getElementById('hCampo').value;
		parent.document.getElementById(document.EXTERN.TEXT_CAMPO.value).innerText=getAllOptionTextWithSplitElement('elencoSelezionate',',');
		parent.$.fancybox.close(); 
	}		
}

function chiudiScheda(){
		self.close(); //dialogbox
		parent.$.fancybox.close(); //fancybox
}