var WindowCartella = null;

jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    WindowCartella.utilMostraBoxAttesa(false);
	NS_SCALA_MELD.init();
	if (_STATO_PAGINA == 'L'){
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
    }
    NS_SCALA_MELD.setEvents();
});

var NS_SCALA_MELD={
		init: function(){
			
		},
		setEvents: function(){
			$('#txtBilirubina,#txtINR,#txtCreatinina').keyup(function(){
				NS_SCALA_MELD.calcolaFormulaMeld();
			});
			$("input[name='radioDialisi']").click(function(){
				NS_SCALA_MELD.calcolaFormulaMeld();
			});
		},
		calcolaFormulaMeld: function(){
			var valore=$('#txtBilirubina').val();
			valore = valore.replace(',','.');
			var vBili = parseFloat(valore);
			if (vBili<1) {vBili=1;}
			valore =$('#txtINR').val();
			valore = valore.replace(',','.');
			var vINR = parseFloat(valore);
			if (vINR<1){vINR=1;}
			valore =$('#txtCreatinina').val();
			valore = valore.replace(',','.');
			var vCrea = parseFloat(valore);	
			if (vCrea<1) {vCrea=1;}
			if (!isNaN(vBili) && !isNaN(vINR) && !isNaN(vCrea)){
				var radio=$("input[name='radioDialisi']");
				if (radio[0].checked){ 
					vCrea=4.0; 
					//$('#txtCreatinina').val(4.0); 
					//$('#txtCreatinina').attr('disabled','disabled');
					}
				/*else{
					$('#txtCreatinina').removeAttr('disabled');
				}*/
				$('#txtPunteggio').val(Math.round(3.78*Math.log(vBili)+11.2*Math.log(vINR)+9.57*Math.log(vCrea)+6.43));
			}
			else{
				$('#txtPunteggio').val('');
			}
		}
};