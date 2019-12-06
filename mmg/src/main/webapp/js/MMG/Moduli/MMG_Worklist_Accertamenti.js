$(document).ready(function(){
	WORKLIST_ACCERTAMENTI.init();
	WORKLIST_ACCERTAMENTI.setEvents();
});

var WORKLIST_ACCERTAMENTI = {
		
			init:function(){
				
				WORKLIST_ACCERTAMENTI.refreshWk();
			},
			
			setEvents:function(){
				
				$("#but_Cerca").on("click",function(){
					WORKLIST_ACCERTAMENTI.refreshWk();
				});
			},
			
			refreshWk: function(){
				
				var h = $('.contentTabs').innerHeight() - $('#fld1').outerHeight(true) - 20;
				$("#WkAcc").height( h );
				
				var idenAnag = home.ASSISTITO.IDEN_ANAG;
				//var text = $("#VALORE_RICERCA").val().toUpperCase();
				var testo = $("#Ricerca").val().toUpperCase();
				
				var params = {
					"id"		: 'ACCERTAMENTI_EFFETTUATI',
	    			"aBind"		: ["iden_anag", "iden_utente", "testo"],
	    			"aVal"		: [idenAnag, $("#USER_IDEN_PER").val(), "%25"+testo+"%25"],
	    			"container" : 'WkAcc'
				};
				
				var objWk = new WK(params);
				objWk.loadWk();
			},
			
			estraiAccertamento: function(accert){

				var accertamento_scelto = accert;
				
				var provenienza = $("#PROVENIENZA").val();
				var txt_accertamenti_effettuati = home[provenienza].accertamento.val();
				
				if (txt_accertamenti_effettuati == ""){
					
					home[provenienza].accertamento.val(accertamento_scelto);
				}
				else {
					txt_accertamenti_effettuati = txt_accertamenti_effettuati + ", " + accertamento_scelto;
					home[provenienza].accertamento.val(txt_accertamenti_effettuati);
				}
				
				if(accertamento_scelto !=""){
				
					home.NOTIFICA.success({

			            message	: accertamento_scelto + " inserito.",
			            title	: "Attenzione",
			            timeout : 4
			        });
				}
			}
};