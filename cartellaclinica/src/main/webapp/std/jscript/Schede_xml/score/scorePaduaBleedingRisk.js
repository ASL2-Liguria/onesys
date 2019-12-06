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

	var cmbDecisione	= document.getElementById('cmbBleedingRiskDecisioneClinica').value;
	if(cmbDecisione == 'DC5')
		NS_STANDARD.setQuesitoDecisione('DC5');
	
	if (_STATO_PAGINA == 'L'){
		document.getElementById('lblRegistra').parentElement.style.display = 'none';
	}
	if(baseGlobal.SITO=='ASL2'){
		$('#lblStampa').parent().parent().remove();
	}
	$('#lblStampa').parent().parent().remove();
	$('.classTdLabelLink').css('width','300px');
	$('#lblQuesitoBleedingRisk').css('width','300px');
	
	$('#lblBleedingRiskDom10').html('Eta, &gt;= 85 - 48 anni vs &lt; 40 anni');
	
	// Disabilito i Totali dei due score
	document.getElementById('txtBleedingRiskDomTotale').disabled = true;
	document.getElementById('txtPaduaTotale').disabled = true;

    WindowCartella.utilMostraBoxAttesa(false);
	NS_MANAGE_CHECK.setRadioAttribute();
	$('select[name="cmbBleedingRiskDecisioneClinica"]').change(function(){
			NS_STANDARD.setQuesitoDecisione(this.value);
	});

	
});
/*
 *	setRadioAttribute	--> Al caricamento della pagina setta l'handler che al click del radio button fa il conteggio
 * 	countCheck			--> Calcola il conteggio e imposta il risultato totale
 */
var NS_MANAGE_CHECK = {
	
	setRadioAttribute:function(){
		//Imposto i Check per Padua
		for(var i = 1;i <= 11; i++)
		{			
			var concatChk	= document.getElementsByName('chkPaduaDom'+i);
			
			$(concatChk).each(
				function(){						
					$(this).click(NS_MANAGE_CHECK.countCheck);
				}
			);
		}
		//Imposto i Check per il Bleeding Risk
		for(var i = 1;i <= 13; i++)
		{			
			var concatChk	= document.getElementsByName('chkBleedingRiskDom'+i);
			
			$(concatChk).each(
				function(){						
					$(this).click(NS_MANAGE_CHECK.countCheck);
				}
			);
		}
	},
	countCheck:function()
	{	
		// Conto i Valori di Padua
		var conteggioPadua = 0;
		for(var i = 1;i <= 11; i++)
		{
			var concatChk	= document.getElementsByName('chkPaduaDom'+i);
						
			for(var j = 0;j < concatChk.length; j++)
			{
				if(concatChk[j].checked && concatChk[j].value == '621')
				{
					if(i == 6 || i == 7 || i == 8 || i == 9 || i == 10 || i == 11 ){
						//1
						conteggioPadua += 1;
					}else if(i == 5 ){
						//2
						conteggioPadua += 2;
					}else if(i == 1 || i == 2 || i == 3 || i == 4){
						//3
						conteggioPadua += 3;
					}					
				}				
			}
		}
		$('#txtPaduaTotale').val(conteggioPadua);
		
		// Conto i Valori di Bleeding Risk
		var conteggioBR = 0;
		for(var i = 1;i <= 13; i++)
		{
			var concatChk	= document.getElementsByName('chkBleedingRiskDom'+i);
						
			for(var j = 0;j < concatChk.length; j++)
			{
				if(concatChk[j].checked && concatChk[j].value == '621')
				{
					if(i == 1 || i == 2){
						//1
						conteggioBR += 1;
					}else if(i == 4 || i == 5 || i == 6){
						//2
						conteggioBR += 2;
					}else if(i == 11 || i == 12){
						//4
						conteggioBR += 4;
					}else if(i == 3){
						//1.5
						conteggioBR += 1.5;
					}else if(i == 7 ||i == 8 ||i == 9){
						//2.5
						conteggioBR += 2.5;
					}else if(i == 10){
						//3.5
						conteggioBR += 3.5;
					}else if(i == 13){
						//4.5
						conteggioBR += 4.5;
					}					
				}				
			}
		}
		$('#txtBleedingRiskDomTotale').val(conteggioBR);
	}

};

var NS_STANDARD = {
	setQuesitoDecisione:function(codDecisione){
		if(codDecisione == 'DC5')
		{		
			// Obbligo il campo del quesito			
			NS_STANDARD.dis_obbliga_campo(document.getElementById('txtQuesitoBleedingRisk'),'O','lblQuesitoBleedingRisk');	
		}else{	
			// Disobbligo il campo del quesito
			NS_STANDARD.dis_obbliga_campo(document.getElementById('txtQuesitoBleedingRisk'),'E','lblQuesitoBleedingRisk');
		}
	},
	 // Questa Funzione gestisce lo stato dei campi e delle label
	dis_obbliga_campo:function(obj,stato,label){
		if (stato == 'O'){
			obj.STATO_CAMPO_LABEL = label;
			$('#'+label).parent().attr('class','').addClass('classTdLabel_O');
		}else{		
			if(obj.STATO_CAMPO_LABEL){
				obj.STATO_CAMPO_LABEL = '';
			}
			$('#'+label).parent().attr('class','').addClass('classTdLabel');
		}
		
		obj.STATO_CAMPO = stato;
		obj.parentElement.STATO_CAMPO = stato;
		
	}
}