jQuery(document).ready(function(){
	
	INSERIMENTO_NOTE.caricaNote();
	
});

var INSERIMENTO_NOTE = {

	//function di chiusura della pagina di inserimento
	chiudi : function(){
	
		parent.$.fancybox.close();
	
	},

	//function di 'salvataggio' delle note. Aggiunge al valore della option selezionata un '@' + la nota
	insNota : function(){
	
		var campo = '';
		
		if (document.EXTERN.PROVENIENZA.value == 'PAG_INS_INTERVENTI_IPCCC'){
			campo=parent.document.getElementById('lblInterventi');
		}else{
			campo=parent.document.getElementById('lblDiagnosi');
		}

		var nota='@' + jQuery("#txtNote").val();
		var valueOption=campo.options[campo.options.selectedIndex].value;
		var textOption=campo.options[campo.options.selectedIndex].text;
		var newValue = '';
	
		newValue = (valueOption += nota);
		newText = (textOption += '****   Nota:  ' + jQuery("#txtNote").val() + ' ****');
		
		campo.options[campo.options.selectedIndex].value = newValue;
		campo.options[campo.options.selectedIndex].text = newText;

		this.chiudi();
	
	},
	
	//function che carica le note, se presenti, nella pagina di inserimento
	caricaNote : function(){
	
		var campo = '';
		
		if (document.EXTERN.PROVENIENZA.value == 'PAG_INS_INTERVENTI_IPCCC'){
			campo=parent.document.getElementById('lblInterventi');
		}else{
			campo=parent.document.getElementById('lblDiagnosi');
		}
		
		try{

			var valueAttuale=campo.options[campo.options.selectedIndex].value.split('@');
			var notaPrecedente=valueAttuale[1];
			jQuery("#txtNote").val(notaPrecedente);
			
		}catch(e){
			alert(e.description);
		}
	}
}
