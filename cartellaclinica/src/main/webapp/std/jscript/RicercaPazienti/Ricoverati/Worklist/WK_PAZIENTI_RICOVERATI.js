var WK_PAZIENTI_RICOVERATI = {
	
	prenota:function(){

		top.executeAction(
			"Esami",
			"getDatiPrenotazioneInterna",
			{
				iden_evento:stringa_codici(array_iden_visita)
			},
			function(resp){

				if(!resp.success){
					return alert(resp.message);
				}
				try{
					var form = parent.document.EXTERN;

					form.Hiden_anag.value = resp.ID_RIS_PAZIENTE;
					form.Hiden_pro.value = resp.IDEN_PRO;
					
					form.extra_db.value= "WHALE_CC<riferimenti iden_ricovero='"+resp.iden_ricovero+"' iden_visita='"+resp.iden_visita+"'/>";
					
					form.action = top.NS_APPLICATIONS.switchTo('AMBULATORIO','prenotazioneInizio');
					form.js_after_load.value = 'parent.frameDirezione.show_bt("btDataOra");';
						
					form.submit();
				}catch(e){
					alert(e.description);
				}
			}
		);		
				
	}
	
};

