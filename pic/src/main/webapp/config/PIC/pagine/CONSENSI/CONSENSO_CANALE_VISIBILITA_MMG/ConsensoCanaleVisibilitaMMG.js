var NS_CONSENSO_MMG = {
		
    init: function() { 
    	/*** vale per intero l'init di Core.js ***/

        if(LIB.isValid(home.baseUser) && LIB.isValid(home.baseUser.DESCRIZIONE) && $("#h-versione_modulo").val() === ''){
            $("#txtOperatoreDichiarazione").val(home.baseUser.DESCRIZIONE);
        }

        /*** Valorizzo un campo nascosto che mi servirà, in fase di salvataggio, per tener conto del responsabile esterno  ***/
    	$("#h-responsabile_esterno").val('MMG');
    },
    
    setEvents: function() {

        $("#Consenso\\@butStampa").click(function() {
//            home.NS_FENIX_PIC.print.preview("1", $("#h-idenConsenso").val(), $("#PATIENT_ID").val(), 'MMG');
            NS_PIC_BRIDGE.stampaConsenso();
        });
        
        if(_ACTION == 'INSERISCI'){
        	$("#li-tabSezione1").one("click", function() {
        		$(".butSalva").show();
        	});
        }      
    }
};

$(document).ready(function() {
    try {
        NS_CONSENSO_MMG.init();
        NS_CONSENSO_MMG.setEvents();
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }
});