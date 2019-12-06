jQuery(document).ready(function(){
	FILTRO_WK_PRESAINCARICO.init();
	FILTRO_WK_PRESAINCARICO.setEvents();
});

var FILTRO_WK_PRESAINCARICO = {
	url:"servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_PRESAINCARICO&ILLUMINA=illumina(this.sectionRowIndex);",
	
	init: function(){
            var today = new Date();
            var fromDate = today;
            fromDate.setDate(today.getDate()-5);
			$('#txtDaDataRic').val(parent.clsDate.getData(fromDate,'DD/MM/YYYY'));		
            $('select[name=cmbStato]').val('\'I\'');
            $('form[name="EXTERN"]').append($('<input type="hidden" name = "WHERE_WK_EXTRA"/>'));
                 
            FILTRO_WK_PRESAINCARICO.applica_filtro_presaincarico(FILTRO_WK_PRESAINCARICO.url);
	},
	
	setEvents:function(){
		$('#lblAggiorna').click(function(){FILTRO_WK_PRESAINCARICO.applica_filtro_presaincarico();});
		
		$("input[name^='txt']").keyup(function(){
			if (this.name == 'txtCognome' || this.name == 'txtNome') {
				this.value = this.value.toUpperCase();
			}
			if(window.event.keyCode==13){
				FILTRO_WK_PRESAINCARICO.applica_filtro_presaincarico();
			return;
  			}
		});
		
        try 
        {
            var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
            var elements = ['txtDaDataRic', 'txtADataRic', 'txtData'];
            for (var i=0, length=elements.length; i<length; i++) {
	            var e = jQuery('input[name='+elements[i]+']');
	            e.attr('id', elements[i]);
				oDateMask.attach(document.getElementById(elements[i]));
            }
        } catch(e)
        {
            alert('Applicazione maschera data in errore: '+e.description);
        }
	},
                	
	applica_filtro_presaincarico: function(url){
		//setVeloNero('oIFWk');
		if ($('#txtDaDataRic').val()=='' && $('#txtCognome').val()==''){
	        return alert('Attenzione: prima di eseguire la ricerca popolare il campo "Cognome" o il campo "Data Richiesta da"');   
	    }
		 $('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val(" REPARTO IN ('"+baseUser.LISTAREPARTI.join("','")+"')");
		if (typeof url=='undefined')
			applica_filtro();
		else
			applica_filtro(url);
	}
	
};