var WindowCartella = null;

$(document).ready(function() {
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
	
	switch($('input#KEY_PROCEDURA').val()) {
		case 'PT_LESCHIRURGICHE':
		case 'PT_ALTRELES':
			$('#txtMedPrescr').attr('STATO_CAMPO','O');
			$('label#lblMedPre').parent().attr('class','classTdLabelLink_O');
			break;
		default:
			break;
	}

	var frame = $('#' + $('#TIPO').val(), parent.document.body);
	var height = $('form[name=dati]').height();
	
	if ($('#TIPO').val() != 'MEDICAZIONE') {
		$('#lblTipo').closest('tr').remove();
		height -= 40;
	}
	frame.height(height); 

	$('input[name=txtOra]').bind('keyup', function(){ oraControl_onkeyup(document.getElementById('txtOra'));});
	$('input[name=txtOra]').bind('blur', function(){ oraControl_onblur(document.getElementById('txtOra'));});
	$('#txtMedPrescr').bind('blur', function()
			{if ($('#txtMedPrescr').val()!='') {launch_scandb_link(document.getElementById('lblMedPre'));}
			});

	$('input[name=dteData]').val(WindowCartella.clsDate.getData(new Date(), 'DD/MM/YYYY'));
	$('input[name=txtOra]').val(WindowCartella.clsDate.getOra(new Date()));
	
	if(baseUser.TIPO=='M'){
		$('#txtMedPrescr').val(baseUser.DESCRIPTION); 
		$('#Hiden_MedPrescr').val(baseUser.IDEN_PER); 
	}
});