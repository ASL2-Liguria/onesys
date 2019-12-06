var WindowCartella = null;

jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    WindowCartella.utilMostraBoxAttesa(false);
	NS_SCALA_GLASGOW.init();
	if (_STATO_PAGINA == 'L'){
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
        document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
    }NS_SCALA_GLASGOW.setEvents();
    
    if (typeof(document.EXTERN.OPEN)!='undefined' && document.EXTERN.OPEN.value=='SCHEDA_OUTREACH'){
        document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';       
    }
	
});
var somma;

var NS_SCALA_GLASGOW = {
		init: function(){
			setRadioResettable();
		},
		setEvents:function(){
			$("input[name='radOcchi']").click(function(){
				NS_SCALA_GLASGOW.calcolaTotale();
			});
			$("input[name='radRispVerb']").click(function(){
				NS_SCALA_GLASGOW.calcolaTotale();
			});
			$("input[name='radRispMot']").click(function(){
				NS_SCALA_GLASGOW.calcolaTotale();
			});
			
		},
		calcolaTotale: function(){
			somma=0;
			sommaRadio($("input[name='radOcchi']"));
			sommaRadio($("input[name='radRispVerb']"));
			sommaRadio($("input[name='radRispMot']"));
			$("#txtPunteggio").val(somma);
		},
		
		okRegistra: function(){
			if (typeof(document.EXTERN.OPEN)!='undefined' && document.EXTERN.OPEN.value=='SCHEDA_OUTREACH'){
				parent.$('#txtGCS').val($("#txtPunteggio").val());
				parent.SCHEDA_OUTREACH.calcolaParametro('rdoGCS', 'txtGCS');
				parent.SCHEDA_OUTREACH.calcolaTotSaps();
				parent.$.fancybox.close();
			}
		}
};

function sommaRadio(radio){
	//alert(radio.length);
	for (var i=0; i<radio.length; i++)
		if (radio[i].checked){
			somma +=radio.length-i;
		};		
	}	
