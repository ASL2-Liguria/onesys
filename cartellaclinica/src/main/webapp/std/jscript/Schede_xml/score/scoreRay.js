var WindowCartella = null;
jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
	
	if (_STATO_PAGINA == 'L'){
		document.getElementById('lblRegistra').parentElement.style.display = 'none';
	}
	$('.classTdLabelLink').css('width','200px');

	// Disabilito il Totale dello Score
	document.getElementById('txtRayTotale').disabled 	= true;
	document.getElementById('txtRayIntensita').disabled = true;

    WindowCartella.utilMostraBoxAttesa(false);
	NS_MANAGE_CHECK.setRadioAttribute();
	
});
/*
 *	setRadioAttribute	--> Al caricamento della pagina setta l'handler che al click del radio button fa il conteggio
 * 	countCheck			--> Calcola il conteggio e imposta il risultato totale
 */
var NS_MANAGE_CHECK = {
	
	setRadioAttribute:function(){
		//Imposto i Check per il Conteggio
		for(var i = 1;i <= 7; i++)
		{	
			// Raccolgo tutti i Radio 
			var concatChk	= document.getElementsByName('chkRayDom'+i);			
			$(concatChk).each(
				function(){						
					$(this).click(NS_MANAGE_CHECK.countCheck);
				}
			);		
		}

	},
	countCheck:function()
	{	
		// Conto i Valori di Has Bled
		var conteggioRay = 0;
		for(var i = 1;i <= 7; i++)
		{			
			var concatChk	= document.getElementsByName('chkRayDom'+i);						
			for(var j = 0;j < concatChk.length; j++)
			{
				if(concatChk[j].checked)
				{
					// In questa scala il valore del radio è definito nel suo value
					conteggioRay += parseInt(concatChk[j].value);										
				}				
			}
		}
		$('#txtRayTotale').val(conteggioRay);
		NS_MANAGE_CHECK.getIntensita(conteggioRay);
	},
	getIntensita:function(points){
	
		var percentuale	= '';
		if(points > 23)
			percentuale	= 'Alta';
		
		$('#txtRayIntensita').val(percentuale);
	}

};

var NS_STANDARD	= {
	stampaScore:function(){

		var iden_ricovero	= WindowCartella.getRicovero("IDEN");
		var funzione		= 'SCORE_RAY';
		var reparto			= WindowCartella.getReparto("COD_CDC");
		var anteprima		= 'S';
		var sf				= '&prompt<pVisita>=' + iden_ricovero;
		
		if(baseUser.LOGIN == 'usrradiologi' || baseUser.LOGIN == 'testelco2' )
			alert('Alert Solo per Amministratori!' + '\n - iden_visita: ' + iden_ricovero + '\n - reparto: ' + reparto + '\n - anteprima: '+ anteprima + '\n - sf: ' + sf + '\n - funzione: ' + funzione);

        WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);
	}

}