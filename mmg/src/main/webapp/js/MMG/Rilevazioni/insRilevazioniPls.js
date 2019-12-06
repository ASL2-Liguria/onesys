$(function() 
{
	RILEVAZIONI_PLS.init();
	NS_FENIX_SCHEDA.afterSave = RILEVAZIONI_PLS.afterSave;
	
});

var RILEVAZIONI_PLS = {
		
		init: function() {
			RILEVAZIONI_PLS.setEvents();
			$("#txtBMI").attr("readonly","readonly").addClass("readonly");
		},
		
		setEvents: function() {
			PLS_UTILITY.showPercentile();
		},
		
		afterSave: function() {
			try {
				home.RIEPILOGO_RILEVAZIONI.activeWk.refresh();
			}catch(e) {}

			if ( LIB.isValid(home.FILTRI_DIARI_WK) && LIB.isValid(home.FILTRI_DIARI_WK.objWk)) {
				home.FILTRI_DIARI_WK.objWk.refresh();
			}
			
			home.NS_FENIX_TOP.chiudiUltima();
		}
};