var WindowCartella = null;
jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    WindowCartella.utilMostraBoxAttesa(false);
	NS_SCALA_MMSE.init();
	if (_STATO_PAGINA == 'L'){
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
		document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
	}
	NS_SCALA_MMSE.setEvents();
	
});

var NS_SCALA_MMSE = {
		init: function(){	
		$("#lblTest7").parent().attr('colspan', '6');
		$("#lblRipeti").parent().attr('colspan', '6');
		$("#lblNominaTesto").parent().attr('colspan', '6');
		$("#lblComandiScrTesto").parent().attr('colspan', '6');
		$("#lblScrittTesto").parent().attr('colspan', '6');
		$("#lblDisegnaTesto").parent().attr('colspan', '6');
		$("#lblPunteggio").parent().attr('colspan', '6');
		$("#lblPunteggioNorm").parent().attr('colspan', '6');
		$("#lblIndicaTesto").parent().attr('colspan', '3');
		$("#lblRicordaTesto").parent().attr('colspan', '3');
		$("#lblComandiVerbTesto").parent().attr('colspan', '3');
		},
		setEvents:function(){
			
			$("#txtOrientaPunti,#txtOrientaSpazPunti,#txtIndicaPunti,#txtTest7Punti,#txtRicordaPunti,#txtNominaPunti,#txtRipetiPunti,#txtComandiVerbPunti,#txtComandiScrPunti,#txtScrittPunti,#txtDisegnaPunti").blur(function(){
				NS_SCALA_MMSE.calcolaTotale();				
			});
			$("input[name='chkAnno']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiOrientaTemp();
				});
			$("input[name='chkStagione']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiOrientaTemp();
				});
			$("input[name='chkData']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiOrientaTemp();
				});
			$("input[name='chkGiornoSett']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiOrientaTemp();
				});
			$("input[name='chkMese']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiOrientaTemp();
				});
			
			$("input[name='chkRegione']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiOrientaSpaz();
				});
			$("input[name='chkNazione']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiOrientaSpaz();
				});
			$("input[name='chkCitta']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiOrientaSpaz();
				});
			$("input[name='chkEdificio']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiOrientaSpaz();
				});
			$("input[name='chkPiano']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiOrientaSpaz();
				});
			
			$("input[name='chkOggetto1']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiIndica();
				});
			$("input[name='chkOggetto2']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiIndica();
				});
			$("input[name='chkOggetto3']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiIndica();
				});
			
			$("input[name='chkRicOggetto1']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiRicorda();
				});
			$("input[name='chkRicOggetto2']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiRicorda();
				});
			$("input[name='chkRicOggetto3']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiRicorda();
				});
			
			$("input[name='chkAzione1']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiComandi();
				});
			$("input[name='chkAzione2']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiComandi();
				});
			$("input[name='chkAzione3']").click(function(){
				NS_SCALA_MMSE.calcolaPuntiComandi();
				});
		},
		calcolaTotale: function(){
			var tot=0;
			var v =0;
			
			v = parseInt($("#txtOrientaPunti").val());
			if (!isNaN(v)) { tot += v; }
			v = parseInt($("#txtOrientaSpazPunti").val());
			if (!isNaN(v)) { tot += v; }
			v = parseInt($("#txtIndicaPunti").val());
			if (!isNaN(v)) { tot += v; }
			v = parseInt($("#txtTest7Punti").val());
			if (!isNaN(v)) { tot += v; }
			v = parseInt($("#txtRicordaPunti").val());
			if (!isNaN(v)) { tot += v; }
			v = parseInt($("#txtNominaPunti").val());
			if (!isNaN(v)) { tot += v; }
			v = parseInt($("#txtRipetiPunti").val());
			if (!isNaN(v)) { tot += v; }
			v = parseInt($("#txtDisegnaPunti").val());
			if (!isNaN(v)) { tot += v; }
			v = parseInt($("#txtComandiVerbPunti").val());
			if (!isNaN(v)) { tot += v; }
			v = parseInt($("#txtComandiScrPunti").val());
			if (!isNaN(v)) { tot += v; }
			v = parseInt($("#txtScrittPunti").val());
			if (!isNaN(v)) { tot += v; }
			
			$("#txtTotale").val(tot);
		},
		calcolaPuntiOrientaTemp: function(){
			var punti=0;
			// calcolo punti per orientamento temporale
			if ($("input[name='chkAnno']").attr('checked')== true) { punti++;}
			if ($("input[name='chkStagione']").attr('checked')==true){ punti++;}
			if ($("input[name='chkData']").attr('checked')==true){ punti++;}
			if ($("input[name='chkGiornoSett']").attr('checked')==true){ punti++;}
			if ($("input[name='chkMese']").attr('checked')==true){ punti++;}
			$("#txtOrientaPunti").val(punti);
			NS_SCALA_MMSE.calcolaTotale();
		},
		calcolaPuntiOrientaSpaz: function(){
			var punti=0;
			// calcolo punti per orientamento spaziale
			if ($("input[name='chkRegione']").attr('checked')== true) { punti++;}
			if ($("input[name='chkNazione']").attr('checked')==true){ punti++;}
			if ($("input[name='chkCitta']").attr('checked')==true){ punti++;}
			if ($("input[name='chkEdificio']").attr('checked')==true){ punti++;}
			if ($("input[name='chkPiano']").attr('checked')==true){ punti++;}
			$("#txtOrientaSpazPunti").val(punti);
			NS_SCALA_MMSE.calcolaTotale();
		},
		calcolaPuntiIndica: function(){
			var punti=0;
			// calcolo punti per indicare oggetti
			if ($("input[name='chkOggetto1']").attr('checked')== true) { punti++;}
			if ($("input[name='chkOggetto2']").attr('checked')==true){ punti++;}
			if ($("input[name='chkOggetto3']").attr('checked')==true){ punti++;}
			$("#txtIndicaPunti").val(punti);
			NS_SCALA_MMSE.calcolaTotale();
		},
		calcolaPuntiRicorda: function(){
			var punti=0;
			// calcolo punti per orientamento temporale
			if ($("input[name='chkRicOggetto1']").attr('checked')== true) { punti++;}
			if ($("input[name='chkRicOggetto2']").attr('checked')==true){ punti++;}
			if ($("input[name='chkRicOggetto3']").attr('checked')==true){ punti++;}
			$("#txtRicordaPunti").val(punti);
			NS_SCALA_MMSE.calcolaTotale();
		},
		calcolaPuntiComandi: function(){
			var punti=0;
			// calcolo punti per orientamento temporale
			if ($("input[name='chkAzione1']").attr('checked')== true) { punti++;}
			if ($("input[name='chkAzione2']").attr('checked')==true){ punti++;}
			if ($("input[name='chkAzione3']").attr('checked')==true){ punti++;}
			$("#txtComandiVerbPunti").val(punti);
			NS_SCALA_MMSE.calcolaTotale();
		}
};
	
