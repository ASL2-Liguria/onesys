var readOnly = (new RegExp("^(s|true|on|)$", "i").test($('form[name=EXTERN] input[name=READONLY]').val() || 'N'));

jQuery(document).ready(function() {
	if (typeof document.EXTERN.HIDDEN_CAMPO === 'object') {
		try { //dialogbox
			var opener=window.dialogArguments;
				document.getElementById('hCampo').value=opener.document.getElementById(document.EXTERN.HIDDEN_CAMPO.value).value;
		} catch (e) { //fancybox
			document.getElementById('hCampo').value=parent.document.getElementById(document.EXTERN.HIDDEN_CAMPO.value).value;
		}
	}
	
	if (readOnly) {
		$("#lblRegistra").parent().parent().hide();
	} else {
		document.body['ok_registra'] = function() {
			chiudiScheda();
		};
	}
});

function registraScheda() {
	var lst_source=document.getElementById("elencoSelezionate");
	var arrayScelti = [];

	for (var i=0, length=lst_source.length; i<length;i++){
		arrayScelti.push(lst_source[i].value);
	};
	
	// Registra le positività su CC_POSITIVITA_RICOVERO
	if (arrayScelti.length == 0) {
		return alert('Selezionare almeno una positività.');
	} else {
		$('#hCampo').val(arrayScelti.join(','));
		registra();
	}
}

function chiudiScheda(){
	try {
		parent.$.fancybox.close(); //fancybox
	} catch(e) {
		self.close(); //dialogbox		
	}
}