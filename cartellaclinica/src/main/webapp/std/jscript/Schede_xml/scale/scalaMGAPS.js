var WindowCartella = null;

jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    WindowCartella.utilMostraBoxAttesa(false);
	NS_SCALA_MGAPS.init();
	if (_STATO_PAGINA == 'L'){		
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
    }
    NS_SCALA_MGAPS.setEvents();
    
});
var somma;

var NS_SCALA_MGAPS={
		init: function(){
			if ($('#txtEta').val()=='' && _STATO_PAGINA != 'L'){
				// recupero data nascita paziente
				var rs=WindowCartella.executeQuery('cartellaPaziente.xml','getPaziente',[WindowCartella.getPaziente("IDEN")]);
				if(rs.next()) {
					// calcolo età paziente alla data odierna
					var dNasc=clsDate.str2date(rs.getString("DATA"),'YYYYMMDD');
					var now = new Date();
					var etaMM=clsDate.difference.month(now,dNasc);
					var v = Math.round(etaMM/12);
					$('#txtEta').val(v);
					if (v>55){
						$('#chkEta').attr('checked','checked');
						NS_SCALA_MGAPS.calcolaSomma();
					}
				}
				
			}				
		},
		setEvents: function(){
			$('#txtPaO2').blur(function(){
				if ($('#txtPaO2').val()!=''){
					var v = parseFloat($('#txtPaO2').val());
					if (v < 7.9){$('#chkPaO2').attr('checked','checked');}
					else { $('#chkPaO2').removeAttr('checked');}
				}
				NS_SCALA_MGAPS.calcolaSomma();
			});
			$('#txtEta').blur(function(){
				if ($('#txtEta').val()!=''){
					var v = parseFloat($('#txtEta').val());
					if (v > 55){$('#chkEta').attr('checked','checked');}
					else {$('#chkEta').removeAttr('checked');}
				}
				NS_SCALA_MGAPS.calcolaSomma();
			});
			$('#txtNeutrofili').blur(function(){
				if ($('#txtNeutrofili').val()!=''){
					var v = parseFloat($('#txtNeutrofili').val());
					if (v > 15){$('#chkNeutrofili').attr('checked','checked');}
					else {$('#chkNeutrofili').removeAttr('checked');}
				}
				NS_SCALA_MGAPS.calcolaSomma();
			});
			$('#txtCalcio').blur(function(){
				if ($('#txtCalcio').val()!=''){
					var v = parseFloat($('#txtCalcio').val());
					if (v < 2){$('#chkCalcio').attr('checked','checked');}
					else {$('#chkCalcio').removeAttr('checked');}
				}
				NS_SCALA_MGAPS.calcolaSomma();
			});
			$('#txtUrea').blur(function(){
				if ($('#txtUrea').val()!=''){
					var v = parseFloat($('#txtUrea').val());
					if (v > 16){$('#chkUrea').attr('checked','checked');}
					else {$('#chkUrea').removeAttr('checked');}
				}
				NS_SCALA_MGAPS.calcolaSomma();
			});
			$('#txtEnzimi').blur(function(){
				if ($('#txtEnzimi').val()!=''){
					var v = parseFloat($('#txtEnzimi').val());
					if (v > 600){$('#chkEnzimi').attr('checked','checked');}
					else {$('#chkEnzimi').removeAttr('checked');}
				}
				NS_SCALA_MGAPS.calcolaSomma();
			});
			$('#txtAlbumina').blur(function(){
				if ($('#txtAlbumina').val()!=''){
					var v = parseFloat($('#txtAlbumina').val());
					if (v < 32){$('#chkAlbumina').attr('checked','checked');}
					else {$('#chkAlbumina').removeAttr('checked');}
				}
				NS_SCALA_MGAPS.calcolaSomma();
			});
			$('#txtGlicemia').blur(function(){
				if ($('#txtGlicemia').val()!=''){
					var v = parseFloat($('#txtGlicemia').val());
					if (v > 10){$('#chkGlicemia').attr('checked','checked');}
					else {$('#chkGlicemia').removeAttr('checked');}
				}
				NS_SCALA_MGAPS.calcolaSomma();
			});
			$("[name^='chk']").click(function(){
				NS_SCALA_MGAPS.calcolaSomma();
			});
		},
		calcolaSomma: function(){
			somma=0;
			$("[name^='chk']").each(function(){
				if ($(this).attr('checked')==true) somma +=1;
			});
			$('#txtPunteggio').val(somma);
		}
}