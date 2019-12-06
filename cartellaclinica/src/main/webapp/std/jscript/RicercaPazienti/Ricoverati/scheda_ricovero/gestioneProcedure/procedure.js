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

	var key_legame = document.EXTERN.KEY_LEGAME.value;
	
	if(key_legame == 'PT_LESCHIRURGICHE') {
		mostraDate('radPunti');
		mostraDate('radDrenaggi');
	}
	
	switch ($('input#STATO_PAGINA').val()){
	case 'I':
		$('input[name=dteData]').val(WindowCartella.clsDate.getData(new Date(),'DD/MM/YYYY'));
		$('input[name=txtOra]').val(WindowCartella.clsDate.getOra(new Date()));
		$('input[name=hTipoMedicazione]').val('Nessuna');
		$('input[name=chkGuarigione]').closest('tr').hide();
		break;
	case 'E':			
		break;
	case 'L':
	}

	if (parent.parent.name == 'BISOGNI') {
		$(":radio[value=Prima]").attr('checked',true);
		$("input[name=radQuando]").attr('disabled',true);
	} else {
		if ($(":radio[value=Prima]").attr('checked')==false)
			$(":radio[value=Durante]").attr('checked',true);
	}
	var frame = $('#scheda', parent.document.body);
	var height = $(document).height();
	frame.height(height); 

	document.getElementById('groupSub').style.display='none';
	document.getElementById('SITO').value='ALL';
	
	eval($('input[name=hJsValues]').val());
	
	$('input[type=radio]').bind('dblclick',function(){
		this.checked = false;
	});
	
	$('input[name=txtOra]').bind('keyup', function(){ oraControl_onkeyup(document.getElementById('txtOra'));});
	$('input[name=txtOra]').bind('blur', function(){ oraControl_onblur(document.getElementById('txtOra'));});
	$('#txtMedPrescr').bind('blur', function()
			{if ($('#txtMedPrescr').val()!='') {launch_scandb_link_where(document.getElementById('lblMedPre'),document.dati.hWhereCond.value);}
		});

	$('select[name=cmbTipo]').bind('change', function(){ $('input[name=txtRiposizionamento]').val(Posizionamento[''+ $('select[name=cmbTipo] option:selected').val() +''] != null ?
			Posizionamento[''+ $('select[name=cmbTipo] option:selected').val() +'']/24:'');});
	
	$('select[name=cmbTipoPresidio]').bind('change', function(){ $('input[name=txtRiposizionamento]').val(Posizionamento[''+ $('select[name=cmbTipoPresidio] option:selected').val() +''] != null ?
			Posizionamento[''+ $('select[name=cmbTipoPresidio] option:selected').val() +'']/24:'');});
	
	$('input[name=txtRiposizionamento]').bind('blur', function(){ isNumber(document.getElementById('txtRiposizionamento'));});
	$('input[name=radNutrizione]').bind('click', function(){ $('input[name=txtCambioLinea]').val(CambioLinea[''+ $('input[name=radNutrizione]:checked').val() +'']/24);});
	$('input[name=txtCambioLinea]').bind('blur', function(){ isNumber(document.getElementById('txtCambioLinea'));});
	$('input[name=txtCruenta]').bind('blur', function(){ isNumber(document.getElementById('txtCruenta'));});
	if (document.getElementById('txtCruenta')) {
		$('input[name=txtCruenta]').val(Cruenta['ALL']/24);
	}
	if (typeof Posizionamento !='undefined'){
	$('input[name=txtRiposizionamento]').val(Posizionamento['ALL']);
	}
	
	if (document.getElementById('lblStadio')) {
		var stadio = document.getElementById('lblStadio');
		stadio.title="- I : Eritema cutaneo che non scompare alla digitopressione.\n" + 
		"- II : Soluzione di continuo dell'epidermide e/o derma.\n- III : Ulcera a tutto spessore.\n" + 
		"- IV : Ulcera a tutto spessore con interessamento muscolare fino alle strutture ossee.\n- V : Escara" ;
		stadio.parentNode.nextSibling.getElementsByTagName('label')[0].title="I : Eritema cutaneo che non scompare alla digitopressione.";
		stadio.parentNode.nextSibling.getElementsByTagName('label')[1].title="II : Soluzione di continuo dell'epidermide e/o derma.";
		stadio.parentNode.nextSibling.getElementsByTagName('label')[2].title="III : Ulcera a tutto spessore.";
		stadio.parentNode.nextSibling.getElementsByTagName('label')[3].title="IV : Ulcera a tutto spessore con interessamento muscolare fino alle strutture ossee.";
		stadio.parentNode.nextSibling.getElementsByTagName('label')[4].title="V : Escara";
	}
	
	$('#chkGuarigione').click(function() {
		if($(this).is(':checked')){
			pulisciCampiRivalutazione();
		} else {
			$('#idtabCondizioni td').attr('disabled',false);
			$('#idtabCondizioni td').find('[STATO_CAMPO=X]').attr('STATO_CAMPO','O');
		}
	});
	if (document.EXTERN.GUARIGIONE) {
		pulisciCampiRivalutazione();
		$('#chkGuarigione').attr('checked',true);
	}
 });

function pulisciCampiRivalutazione() {
	var condizioni = $('#idtabCondizioni td')
	.not($('#chkGuarigione').parent())
	.not($('#lblNote').parent())
	.not($('textarea[name=txtareaNote]').parent());
	$(condizioni).attr('disabled',true);
	$(condizioni).find('input').removeAttr('checked').removeAttr('value').attr('STATO_CAMPO','X');
	$(condizioni).find('option[value=""]').attr('selected',true);
}

function registraScheda() {

	switch (document.EXTERN.KEY_LEGAME.value) {
	case 'PT_LESDECUBITO':
		$('input[name=hQuando]').val($('input[name=radQuando]:checked').next().next().text());
		$('input[name=hStadio]').val($('input[name=cmbStadio]:checked').next().next().text());
		$('input[name=hSede]').val($('select[name=cmbSede] option:selected').text());
		$('input[name=hStato]').val($('select[name=cmbStato] option:selected').text());
		$('input[name=hBordi]').val($('select[name=cmbBordi] option:selected').text());
		$('input[name=hCute]').val($('select[name=cmbCute] option:selected').text());
		break;
	case 'PT_LESCHIRURGICHE':
		break;
	case 'PT_ALTRELES':
		break;
	case 'PT_CVC':
		$('input[name=hTipo]').val($('select[name=cmbTipo] option:selected').text());
		$('input[name=hSede]').val($('select[name=cmbSede] option:selected').text());
		$('input[name=hNutrizione]').val($('input[name=radNutrizione]:checked').next().next().text());
		$('input[name=hFrequenzaRiposizionamento]').val(document.getElementById('txtRiposizionamento').value*24);
//		$('input[name=hFrequenzaCambioLinea]').val(document.getElementById('txtCambioLinea').value*24);
		break;
	case 'PT_CVP':
		$('input[name=hTipo]').val($('select[name=cmbTipo] option:selected').text());
		$('input[name=hSede]').val($('select[name=cmbSede] option:selected').text());
		$('input[name=hNutrizione]').val($('input[name=radNutrizione]:checked').next().next().text());
		$('input[name=hFrequenzaRiposizionamento]').val(document.getElementById('txtRiposizionamento').value*24);
//		$('input[name=hFrequenzaCambioLinea]').val(document.getElementById('txtCambioLinea').value*24);
		break;
	case 'PT_CVESC':
		$('input[name=hMat]').val($('select[name=cmbTipo] option:selected').text());
		$('input[name=hFrequenzaRiposizionamento]').val(document.getElementById('txtRiposizionamento').value*24);
		break;
	case 'PT_CA':
		$('input[name=hTipo]').val($('select[name=cmbTipo] option:selected').text());
		$('input[name=hFrequenzaRiposizionamento]').val(document.getElementById('txtRiposizionamento').value*24);
		$('input[name=hFrequenzaCruenta]').val(document.getElementById('txtCruenta').value*24);
		break;
	case 'PT_SNG':
		$('input[name=hMat]').val($('select[name=cmbMat] option:selected').text());
		$('input[name=hUso]').val($('input[name=radUso]:checked').next().next().text());
		break;
	case 'PT_PEG':
		break;
	case 'PT_TRACHEOSTOMIA':
		$('input[name=hCalibro]').val($('select[name=cmbCalibro] option:selected').text());
		$('input[name=hSede]').val($('select[name=cmbSede] option:selected').text());
		break;
	case 'PT_TUBO_OROTRAC':
		$('input[name=hCalibro]').val($('select[name=cmbCalibro] option:selected').text());
		$('input[name=hSede]').val($('select[name=cmbSede] option:selected').text());
		break;
	case 'PT_BASE':
		$('input[name=hTipoPresidio]').val($('select[name=cmbTipoPresidio] option:selected').text());
		$('input[name=hFrequenzaRiposizionamento]').val(document.getElementById('txtRiposizionamento').value*24);
		break;
	}
	registra();
}

function aggiornaOpener(){
	switch (top.opener.name){
		case 'PIANO_GIORNALIERO': 
			top.opener.refreshPiano('OK');
			parent.chiudiProcedura();
			break;
		case 'bisogni': 
			parent.opener.caricaWkProcedure();
			parent.chiudiProcedura();
			break;
		default:parent.chiudiProcedura(); 
			break;
	}
	
}

function mostraDate(nome) {
	
	src = document.getElementById(nome);
		
	if($('input[name=' + nome + ']:checked').val() == 'S') {
		src.parentNode.nextSibling.style.visibility='';
		src.parentNode.nextSibling.nextSibling.style.visibility='';
		src.parentNode.nextSibling.nextSibling.nextSibling.style.visibility='';
		src.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.style.visibility='';
		$(src).parent().next().attr('class','classTdLabel_O_O').next().attr('STATO_CAMPO','O').find('input').attr('STATO_CAMPO','O');
	} else {
		src.parentNode.nextSibling.style.visibility='hidden';
		src.parentNode.nextSibling.nextSibling.style.visibility='hidden';
		src.parentNode.nextSibling.nextSibling.nextSibling.style.visibility='hidden';
		src.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.style.visibility='hidden';	
		$(src).parent().next().attr('class','classTdLabel').next().attr('STATO_CAMPO','E').find('input').attr('STATO_CAMPO','E');;
	}
}

function isNumber(input) {
	var text = input.value;
	var ValidChars = "0123456789";
	var Char;
	if (text=='')
		return;

	for (var i = 0; i < text.length; i++) 
	{ 
		Char = text.charAt(i); 
		if (ValidChars.indexOf(Char) == -1) {
			alert('Inserire un valore numerico');
			input.value='';
			return;
		}
	}
}

