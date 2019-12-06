var WindowCartella = null;

jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    WindowCartella.utilMostraBoxAttesa(false);
	NS_SCALA_NAFLD.init();
	if (_STATO_PAGINA == 'L'){		
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
    }
    NS_SCALA_NAFLD.setEvents();
    
});

var NS_SCALA_NAFLD ={
		init: function(){
			if ($('#txtEta').val()=='' && _STATO_PAGINA != 'L'){
				// recupero data nascita paziente
				var rs=WindowCartella.executeQuery('cartellaPaziente.xml','getPaziente',[WindowCartella.getPaziente("IDEN")]);
				if(rs.next()) {
					// calcolo età paziente alla data odierna
					var dataNasc=rs.getString("DATA");
					var dNasc=clsDate.str2date(dataNasc,'YYYYMMDD');
					var now = new Date();
					var etaMM=clsDate.difference.month(now,dNasc);
					var v = Math.round(etaMM/12);
					$('#txtEta').val(v);
				}
			};
			if ($('#txtBMI').val()=='' && _STATO_PAGINA != 'L'){
				// recupero ultimo valore di BMI dai parametri
				var vResp = WindowCartella.executeStatement('parametri.xml','getLastParametroVal',[WindowCartella.getRicovero("IDEN"),'BMI'],1);
				if (vResp[0]=='OK'){
					$('#txtBMI').val(vResp[2] == null ? '' : vResp[2]);
				}
			}
		},
		setEvents: function(){
			$('#txtAlbumina').blur(function(){
				NS_SCALA_NAFLD.calcolaFormulaNAFLD();
			});
			$('#txtEta').blur(function(){
				NS_SCALA_NAFLD.calcolaFormulaNAFLD();
			});
			$('#txtBMI').blur(function(){
				NS_SCALA_NAFLD.calcolaFormulaNAFLD();
			});
			$('#txtAST').blur(function(){
				NS_SCALA_NAFLD.calcolaFormulaNAFLD();
			});
			$('#txtALT').blur(function(){
				NS_SCALA_NAFLD.calcolaFormulaNAFLD();
			});
			$('#txtPiastrine').blur(function(){
				NS_SCALA_NAFLD.calcolaFormulaNAFLD();
			});
			$('#txtAlbumina').blur(function(){
				NS_SCALA_NAFLD.calcolaFormulaNAFLD();
			});
		},
		calcolaFormulaNAFLD: function(){
			var vDiab;
			var valore = $('#txtEta').val();
			valore = valore.replace(',','.');
			var vEta = parseFloat(valore);
			valore = $('#txtBMI').val();
			valore = valore.replace(',','.');
			var vBMI=parseFloat(valore);
			valore = $('#txtAST').val();
			valore = valore.replace(',','.');
			var vAST=parseFloat(valore);
			valore =$('#txtALT').val();
			valore = valore.replace(',','.');
			var vALT=parseFloat(valore);
			valore = $('#txtAlbumina').val();
			valore = valore.replace(',','.');
			var vAlbumina = parseFloat(valore);
			valore =$('#txtPiastrine').val();
			valore = valore.replace(',','.');
			vPiastrine = parseFloat(valore);
			var radio=$("input[name='radioDiabete']");
			if (radio[0].checked){vDiab=1;}
			else {vDiab=0;}
			if (!isNaN(vEta) && !isNaN(vBMI) && !isNaN(vAST) && !isNaN(vALT) && !isNaN(vPiastrine) && !isNaN(vAlbumina)){
				var formula= -1.675+(0.037*vEta)+(0.094*vBMI)+(1.13*vDiab)+(0.99*(vAST/vALT))-(0.013*vPiastrine)-(0.66*vAlbumina);
				$('#txtPunteggio').val(formula.toFixed(2));
			}
		}
};