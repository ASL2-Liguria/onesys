
jQuery(document).ready(function(){

	CHIUSURA_PROBLEMI.init();
	CHIUSURA_PROBLEMI.setEvents();
	
	NS_FENIX_SCHEDA.afterSave		= CHIUSURA_PROBLEMI.afterSave; 
	
});

var CHIUSURA_PROBLEMI = {
		
		init:function(){
			//jQuery("#hAccesso").val(home.NS_MMG.setInfoAccesso());
			//jQuery("#hUtente").val(home.NS_MMG.setInfoUtente());
			jQuery("#cmbProblema").find("option[value="+jQuery("#ID_PROBLEMA").val()+"]").attr("selected","selected");
			//$("#cmbProblema").val($("#ID_PROBLEMA").val());//--> funziona anche così
		},
		
		setEvents:function(){
		
		},
		
		chiudiScheda:function(){
			
//			NS_FENIX_SCHEDA.chiudi();
			home.NS_FENIX_TOP.chiudiUltima();
		},
		
//		afterSave:function(resp){
//			if(resp.result=='OK'){
//				//TODO: settare problema nel top e nella combo dei problemi	
//	
//				CHIUSURA_PROBLEMI.chiudiScheda();
//			}else{
//				
//			}
//		}
		
		afterSave: function(){
			
			home.RIEP_ACCESSI_PROBLEMI.initWk();
			CHIUSURA_PROBLEMI.chiudiScheda();
		}

};