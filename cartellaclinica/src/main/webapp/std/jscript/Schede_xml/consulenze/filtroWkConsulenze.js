jQuery(document).ready(function(){
	FILTRO_WK_CONSULENZE.init();
	FILTRO_WK_CONSULENZE.setEvents();
});

/*FILTRO_WK_CONSULENZE*/
var FILTRO_WK_CONSULENZE = {
	url:"servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_ESACONSULENZE&ILLUMINA=illumina(this.sectionRowIndex);",
	
	init: function(){
            var today = new Date();
            var fromDate = today;
            fromDate.setDate(today.getDate()-5);
			$('#txtDaDataRic').val(parent.clsDate.getData(fromDate,'DD/MM/YYYY'));		
            $('select[name=cmbStato]').val('\'I\'');
            //$('#hTabPerTipo').val("'"+baseUser.TIPO+"'");
            $('form[name="EXTERN"]').append($('<input type="hidden" name = "WHERE_WK_EXTRA"/>'));
            FILTRO_WK_CONSULENZE.setView();    
                
            FILTRO_WK_CONSULENZE.applica_filtro_consulenze(FILTRO_WK_CONSULENZE.url);
	},
	
	setEvents:function(){
		$('#lblAggiorna').click(function(){FILTRO_WK_CONSULENZE.applica_filtro_consulenze();});
		
		$("input[name^='txt']").keyup(function(){
			if (this.name == 'txtCognome' || this.name == 'txtNome') {
				this.value = this.value.toUpperCase();
			}
			if(window.event.keyCode==13){
				FILTRO_WK_CONSULENZE.applica_filtro_consulenze();
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
                
    setView : function() {
        /*if (baseUser.TIPO == 'M' && baseUser.TIPO_MED == 'F') {
            // Fisiatra
            $('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val("TIPO='"+baseUser.TIPO+"' AND TIPO_MED='"+baseUser.TIPO_MED+"' or (tipo in ('L','F'))");
        } else*/ 
        if (baseUser.TIPO == 'D' || baseUser.TIPO == 'L' || baseUser.TIPO == 'F') {
            // Dietista, Logopedista & Fisioterapista
            $('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val("TIPO='"+baseUser.TIPO+"'");
        } else if (baseUser.TIPO == 'M' || baseUser.TIPO == 'I' || baseUser.TIPO == 'AS') {
            // Medici & Infermieri
            $('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val("1=1");                
        } else {
            // Unknown tipologia
            $('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val("1=-1");
        }
    },                
	
	applica_filtro_consulenze: function(url){
		//setVeloNero('oIFWk');
		if ($('#txtDaDataRic').val()=='' && $('#txtCognome').val()==''){
	        return alert('Attenzione: prima di eseguire la ricerca popolare il campo "Cognome" o il campo "Data Richiesta da"');   
	    }
		if (typeof url=='undefined')
			applica_filtro();
		else
			applica_filtro(url);
	}
	
};