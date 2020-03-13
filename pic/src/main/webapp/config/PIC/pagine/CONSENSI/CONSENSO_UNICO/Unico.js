var NS_UNICO = {
		
    init: function() {
        /*** vale per intero l'init di Core.js ***/

        if(LIB.isValid(home.baseUser) && LIB.isValid(home.baseUser.DESCRIZIONE) /*&& $("#h-versione_modulo").val() === ''*/){
            $("#txtOperatoreDichiarazione").val(home.baseUser.DESCRIZIONE);
        }

        if($("#h-radScelta1A").val() === 'S'){
            $("#li-tabSezione1").hide();
        }

        if($("#h-radScelta1A").val() === ''){
            $("#h-radScelta1A").val('S')
            $("#li-tabSezione1").hide();
        }
    },
    
    setEvents: function() {

        $("#Consenso\\@butStampa").click(function() {
            //home.NS_FENIX_PIC.print.preview("1", $("#h-idenConsenso").val(), $("#PATIENT_ID").val());

            if(NS_FUNCTIONS.checkvalueConsensoUnico($("#PATIENT_ID").val())){
                NS_PIC_BRIDGE.stampaConsenso();
            }
        });
        
        if(_ACTION == 'INSERISCI'){
        	$("#li-tabSezione2").one("click", function() {
        		$(".butSalva").show();

                home.NOTIFICA.warning({
                    message	: "Controllare che i campi 'Data in cui l'operatore ha acquisito la dichiarazione di consenso' e 'Operatore che ha acquisito la dichiarazione di consenso' vengano compilati con i dati corretti. Nel caso ci fossero incoerenze con questi campi, modificarli con Operatore e Data dichiarazione corretti.",
                    title	: "Attenzione!",
                    timeout : "15"
                });
        	});
        }
        
        $(".butChiudi").off("click");
        $(".butChiudi").on("click", function() {
        	NS_PIC_BRIDGE.chiudiPagina($("#h-idenConsenso").val(), NS_CORE.saved);
        });
    }
    
};

$(document).ready(function() {
    try {
        NS_UNICO.init();
        NS_UNICO.setEvents();
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }
});