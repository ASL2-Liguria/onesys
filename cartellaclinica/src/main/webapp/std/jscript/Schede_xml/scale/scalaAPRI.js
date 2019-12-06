var WindowCartella = null;

jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    WindowCartella.utilMostraBoxAttesa(false);
	NS_SCALA_APRI.init();
	if (_STATO_PAGINA == 'L'){		
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
    }
    NS_SCALA_APRI.setEvents();
    
});

var NS_SCALA_APRI = {
		init: function(){},
		setEvents: function(){
			$('#txtAST').blur(function(){
				NS_SCALA_APRI.calcolaFormulaAPRI();
			});
			$('#txtPiastrine').blur(function(){
				NS_SCALA_APRI.calcolaFormulaAPRI();
			});
			$('#txtLimiteNorm').blur(function(){
				NS_SCALA_APRI.calcolaFormulaAPRI();
			});
		},
		calcolaFormulaAPRI: function(){
			var valore = $('#txtAST').val();
			valore = valore.replace(',','.');
			var vAST=parseFloat(valore);
			valore =$('#txtLimiteNorm').val();
			valore = valore.replace(',','.');
			var vLimite = parseFloat(valore);
			valore =$('#txtPiastrine').val();
			valore = valore.replace(',','.');
			var vPiastrine = parseFloat(valore);
			if (!isNaN(vAST) && !isNaN(vLimite) && !isNaN(vPiastrine)){
				if (vLimite!=0 && vPiastrine!=0){
					var formula = ((vAST/vLimite)*100)/vPiastrine;
					$('#txtPunteggio').val(formula.toFixed(2));
				}				
			}
		}
}