$(document).ready(function(){
	FILTRO_ARCHIVIO_CARTELLE.init();
	jQuery("body").keypress (function(e) {
		if(e.keyCode==13){
			jQuery("#txtNome").val(jQuery("#txtNome").val().toUpperCase());
			jQuery("#txtCognome").val(jQuery("#txtCognome").val().toUpperCase());
			applica_filtro();
		}
	});
	
	document.getElementById('txtNome').onblur = function(){document.getElementById('txtNome').value=document.getElementById('txtNome').value.toUpperCase();};
	document.getElementById('txtCognome').onblur = function(){document.getElementById('txtCognome').value=document.getElementById('txtCognome').value.toUpperCase();};
	
});


var FILTRO_ARCHIVIO_CARTELLE = {
		
		tipo_wk : 	'WK_ARCHIVIO_CARTELLE',
		url		:	'',
		
		init : function(){
			jQuery('#txtDaDataRic').val(getToday());
			FILTRO_ARCHIVIO_CARTELLE.componiUrlFiltro();
			applica_filtro(FILTRO_ARCHIVIO_CARTELLE.url);
			FILTRO_ARCHIVIO_CARTELLE.inserisciMaschera();
		},
		
		componiUrlFiltro : function(){
			FILTRO_ARCHIVIO_CARTELLE.url = 'servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK='+FILTRO_ARCHIVIO_CARTELLE.tipo_wk+'&ILLUMINA=javascript:illumina_multiplo_generica(this.sectionRowIndex);';
		},
		
		inserisciMaschera : function(){
			try 
			{
				var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
				oDateMask.attach($('.hasDatepick'));//assegno la maschera a tutti i campi data
			}
			catch(e)
			{
				alert('Applicazione maschera data in errore: '+e.description);
			}
			
		},
		
		caricaData:function(id){
			$('#'+id).val(getToday());	
		},
		
		impostaMaiuscolo : function(){
			jQuery("#txtNome").blur().val(jQuery("#txtNome").val().toUpperCase());
			jQuery("#txtCognome").blur().val(jQuery("#txtCognome").val().toUpperCase());
			
		}
		
		
}