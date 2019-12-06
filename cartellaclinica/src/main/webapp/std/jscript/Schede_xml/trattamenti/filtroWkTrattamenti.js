jQuery(document).ready(function() {
    FILTRO_WK_TRATTAMENTI.init();
    FILTRO_WK_TRATTAMENTI.setEvents();
});

/* FILTRO_WK_TRATTAMENTI */
var FILTRO_WK_TRATTAMENTI = {
    url: "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_VIEW_CC_TRATTAMENTI_ATTIVI&ILLUMINA=illumina(this.sectionRowIndex);",
    
    init : function() {
        //$('#hTabUte').val("'" + baseUser.TIPO + "'");
        //$('#hTabMed').val("'" + baseUser.TIPO_MED + "'");
        
        $('form[name="EXTERN"]').append($('<input type="hidden" name = "WHERE_WK_EXTRA"/>'));
        FILTRO_WK_TRATTAMENTI.setView();
 
         if($('select[name="cmbRepAss"]>option').size()==2){
        	$('select[name="cmbRepAss"] option:eq(1)').attr('selected', 'selected');
        //	FILTRO_WK_TRATTAMENTI.applica_filtro_trattamenti(FILTRO_WK_TRATTAMENTI.url);
        }
        
        if($('#cmbRepAss').val()!="'RRF_PL'" && $('#cmbRepAss').val()!="'SSDRF_AL'"){
        	$('#cmbTipologia').parent().parent().hide();
        }
        
    },
            
    setEvents : function() {
        $('#lblAggiorna').click(function() {
            FILTRO_WK_TRATTAMENTI.applica_filtro_trattamenti(FILTRO_WK_TRATTAMENTI.url);
        });

        $("input[name^='txt']").keyup(function() {
            this.value = this.value.toUpperCase();
            if (window.event.keyCode == 13) {
                FILTRO_WK_TRATTAMENTI.applica_filtro_trattamenti(FILTRO_WK_TRATTAMENTI.url);
                return;
            }
        });
        
        $('#cmbRepAss').change(function(){
        	if($(this).val()=="'RRF_PL'" || $(this).val()=="'SSDRF_AL'"){
        		$('#cmbTipologia').parent().parent().show();
        	}
        	else
        	{
        		$('#cmbTipologia').val('').parent().parent().hide();
        	}
        });
    },

    setView : function() {
        if (baseUser.TIPO == 'M' && baseUser.TIPO_MED == 'F') {
            // Fisiatra
            $('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val("(TIPO_UTE='"+baseUser.TIPO+"' AND TIPO_MED='"+baseUser.TIPO_MED+"')");
        } else if (baseUser.TIPO == 'D' || baseUser.TIPO == 'L') {
            // Dietista & Logopedista
            $('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val("TIPO_UTE='"+baseUser.TIPO+"'");
        } else if (baseUser.TIPO == 'F') {
            // Fisioterapista (NB: vede anche i trattamenti del fisiatra)
            $('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val("(TIPO_UTE='"+baseUser.TIPO+"' OR (TIPO_UTE='M' AND TIPO_MED='F'))");                
        } else if (baseUser.TIPO == 'AS') {
            // Fisioterapista (NB: vede anche i trattamenti del fisiatra)
            $('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val("TIPO_UTE='"+baseUser.TIPO+"'");                
        } else {
            $('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val("1=-1");
        }
        
        if($('#cmbTipologia').val()=='5'){
        	$('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val($('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val()+ " and TIPOLOGIA_RICHIESTA='5' "); 
        }
        else if($('#cmbTipologia').val()=='14'){
        	$('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val($('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val()+ " and TIPOLOGIA_RICHIESTA='14' "); 
        }
    },
            
    applica_filtro_trattamenti : function(url) {
    	
        	if ($('select[name="cmbRepAss"]').val()==''){
        		return alert('Scegliere un reparto di destinazione');
            	}
        	if(($('#cmbRepAss').val()=="'RRF_PL'" || $('#cmbRepAss').val()=="'SSDRF_AL'") && $('#cmbTipologia').val()==''){
        		return alert('Scegliere una tipologia');
        	}
        	FILTRO_WK_TRATTAMENTI.setView();
            applica_filtro(url);
    }

};