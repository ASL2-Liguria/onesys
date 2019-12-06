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

    WindowCartella.utilMostraBoxAttesa(false);

	if (_STATO_PAGINA == 'L'){
		document.getElementById('lblRegistra').parentElement.style.display = 'none';
	}
	$('.classTdLabelLink').css('width','300px');
	//alert(0);
	// Disabilito il Totale dello Score
	document.getElementById('txtPortPSITotale').disabled 	= true;
	document.getElementById('txtPortPSIPerc').disabled 		= true;
	document.getElementById('txtPortPSIRisk').disabled 		= true;
	document.getElementById('txtPortPSIClass').disabled 	= true;
	
	NS_MANAGE_CHECK.setRadioAttribute();
	
});
/*
 *	setRadioAttribute	--> Al caricamento della pagina setta l'handler che al click del radio button fa il conteggio
 * 	countCheck			--> Calcola il conteggio e imposta il risultato totale
 */
var NS_MANAGE_CHECK = {
	
	setRadioAttribute:function(){
		//Imposto i Check per Padua
		for(var i = 1;i <= 19; i++)
		{	
			// Raccolgo tutti i check 
			var concatChk	= document.getElementsByName('chkPortPSIDom'+i);			
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
		var conteggioPortPSI = 0;
		for(var i = 2;i <= 19; i++)
		{
			var concatChk	= document.getElementsByName('chkPortPSIDom'+i);						
			for(var j = 0;j < concatChk.length; j++)
			{
				if(concatChk[j].checked && concatChk[j].value == '621')
				{
					// A seconda della domanda incremento il valore
					if(i == 2 || i == 5 || i == 6 || i == 7 || i == 12 || i == 16 || i == 17 || i == 18 || i == 19)
						conteggioPortPSI += 10;
					else if(i == 11)
						conteggioPortPSI += 15; 
					else if(i == 4 || i == 8 || i == 9 || i == 10 || i == 14 || i == 15)
						conteggioPortPSI += 20; 
					else
						conteggioPortPSI += 30;
				}				
			}
		}
		// Se il Sesso è Femmina aumento di 1
		var concatChkSesso	= document.getElementsByName('chkPortPSIDom1');
		//alert(concatChkSesso.length);
		for(var j = 0;j < concatChkSesso.length; j++)
		{
			if(concatChkSesso[j].checked && concatChkSesso[j].value == 'F')
			{
				conteggioPortPSI += -10;										
			}
		}
		$('#txtPortPSITotale').val(conteggioPortPSI);
		NS_MANAGE_CHECK.getPercentualeRischio(conteggioPortPSI);
	},
	getPercentualeRischio:function(points){
		var mortalita	= '0%';
		var classe		= '';
		var rischio		= '';
		if(points <= 0){
			classe		= 'I';
			mortalita	= '0.1%';
		}
		else if(points > 0 && points <= 70){
			classe		= 'II';
			mortalita	= '0.6%';
		}
		else if(points >= 71 && points <= 90){
			classe		= 'III';
			mortalita	= '2.8%';
		}
		else if(points >= 91 && points <= 130){
			classe		= 'IV';
			mortalita	= '8.2%';			
		}
		else if(points > 130){
			classe		= 'V';
			mortalita	= '29.2%';			
		}
		$('#txtPortPSIPerc').val(mortalita);
		$('#txtPortPSIClass').val(classe);
		
		if(classe == 'I' || classe == 'II' || classe == 'III')
			rischio 	= 'Basso';
		else if(classe = 'IV')
			rischio 	= 'Medio';
		else
			rischio 	= 'Alto';
		
		$('#txtPortPSIRisk').val(rischio);
	}

};