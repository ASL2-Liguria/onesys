var WindowCartella = null;
$(function() {

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

	$('fieldset#lbltabValoriSoglia').hide();
	$('select[name=cmbAreaCorporea ]').hide();
	$('input[name=chkLblAreaCorporea ]').click(function(){
		$('select[name=cmbAreaCorporea ]').toggle();
	});
	$('select[name=cmbTipoParametro]').append('<option selected value="">-- Selezionare parametro --</option>')
		.change(function(){
			$('fieldset#lbltabValoriSoglia').hide();
			var iden_parametro = $(this).find('option:selected').val();
			if (iden_parametro=='') {return;}
			var sqlBinds = new Array(); 
			sqlBinds.push($('input#REPARTO').val());
			sqlBinds.push(iden_parametro);
            alert(WindowCartella);
            WindowCartella.dwr.engine.setAsync(false);
            WindowCartella.dwrUtility.executeQuery("parametri.xml","getValoriSoglia",sqlBinds,callBack);
            WindowCartella.dwr.engine.setAsync(true);
			function callBack(resp) {
				if (resp[0][0]=='KO') {return alert(resp[0][1]);}
				var valoriSoglia = resp[1];
				$('input[name=txtCriticoMax]').val(valoriSoglia[1]);
				$('input[name=txtAllertaMax]').val(valoriSoglia[2]);
				$('input[name=txtAllertaMin]').val(valoriSoglia[3]);
				$('input[name=txtCriticoMin]').val(valoriSoglia[4]);
				var separatore = valoriSoglia[0]; 
				if (separatore !='') {
					$('label[name=lblSeparatore]').text(separatore).parent().show();
					$('input[name=txtCriticoMax_2]').val(valoriSoglia[5]).parent().show();
					$('input[name=txtAllertaMax_2]').val(valoriSoglia[6]).parent().show();
					$('input[name=txtAllertaMin_2]').val(valoriSoglia[7]).parent().show();
					$('input[name=txtCriticoMin_2]').val(valoriSoglia[8]).parent().show();

				} else {
					$('label[name=lblSeparatore],input[name=txtCriticoMin_2],input[name=txtCriticoMax_2],input[name=txtAllertaMin_2],input[name=txtAllertaMax_2]')
					 	.parent().hide();
				}
				$('fieldset#lbltabValoriSoglia').show(500);
			}
		});
});

function chiudiScheda(){
	parent.$.fancybox.close();
}

function registraScheda() {
	alert('registra');
}