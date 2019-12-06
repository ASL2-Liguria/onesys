$(function(){
	wrapper_cdc.init();
	wrapper_cdc.setEvents();
});

var wrapper_cdc = {
		cod_cdc:null,
		funzione:function(){},
		init:function() {
			var pFunzione = $("input#funzione").val();
			switch(pFunzione){
				case 'prescrizioniStd':
					wrapper_cdc.funzione=funzioni.apriPrescrizioniStd;
					break;
				default:
					alert("Errore in wrapper_cdc: nessuna funzione disponibile");
			}
		},
		setEvents:function() {
			$("A#lblRegistra").click(function() {
				var cdc = $("select[name='cmbCdc'] option:selected");
				if (cdc.val()=="") {
					alert("Selezionare un reparto");
				} else {
					$("A#lblRegistra").parent().parent().prev().html("Reparto selezionato: "+cdc.text());
					var codici = cdc.val().split("@");
					wrapper_cdc.cod_cdc=codici[3];
					wrapper_cdc.funzione();
				}
			});
			$("select[name='cmbCdc']").change(function(){
				$("A#lblRegistra").click();
			});
		}
};

var funzioni = {
		apriPrescrizioniStd:function(){
			var url = "servletGeneric?class=cartellaclinica.gestioneTerapia.plgTerapia";
			//url+="&statoTerapia=I";
			url+="&layout=V&reparto="+wrapper_cdc.cod_cdc;
			url+="&idenVisita="+-1+"&idenAnag="+-1;	
			url+="&PROCEDURA="+"INSERIMENTO";	
			url+="&modality="+"I";	
			url+="&btnGenerali="+"Salva Std::registra('modello');";	
			$("iframe#frameFunzione").attr("src",url);
		}
}; 