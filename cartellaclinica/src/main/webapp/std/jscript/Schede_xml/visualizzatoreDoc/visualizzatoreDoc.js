

$(document).ready(function()
{	
	VISUALIZZATORE_DOC.init();
	VISUALIZZATORE_DOC.setEvents();

});

var VISUALIZZATORE_DOC = {

	init:function()
	{
		top.utilMostraBoxAttesa(false);
		
		
		
		var urlDocAllegati 	= "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_DOC_ALLEGATI&ILLUMINA=javascript:illumina(this.sectionRowIndex);&WHERE_WK=WHERE IDEN_ANAG="+top.getForm(document).iden_anag;		
		
		SplitCodice = top.CartellaPaziente.getAccesso("CODICE_MODALITA_CARTELLA").split('_');
		if(SplitCodice[1]=='READONLY')
		 urlDocAllegati += "&CONTEXT_MENU=WK_DOC_ALLEGATI_L";
		
	    $('#frameWkDocAllegati').attr('src',urlDocAllegati);

	},
	
	setEvents:function(){
		
	}
};