$(document).ready(function() { 
	$('input[name=txtData]').val(dataCorrente());
	$('input[name=txtOra]').val(oraCorrente());
	if (window.dialogArguments[1]==1) {
		$('input[name=txtData2]').parent().parent().hide();
	} else {
		$('input[name=txtOra2]').bind('keyup', function(){ oraControl_onkeyup(document.getElementById('txtOra2'));});
		$('input[name=txtOra2]').bind('blur', function(){ oraControl_onblur(document.getElementById('txtOra2'));});
	}
	$('input[name=txtOra]').bind('keyup', function(){ oraControl_onkeyup(document.getElementById('txtOra'));});
	$('input[name=txtOra]').bind('blur', function(){ oraControl_onblur(document.getElementById('txtOra'));});
	if (window.dialogArguments[1]>=0) {
		$('#txtMotivo').focus();
	} else {
		$('#txtMotivo').hide();
	}
	if (window.dialogArguments[2]=='N') {
		$('input[name=chkChiusuraDet]').parent().parent().hide();
	}
	else{
		$('input[name=chkChiusuraDet]').attr('checked','checked');
	}
	if(typeof window.dialogArguments[3] != 'undefined'){
		$('input[name=txtResiduo]').val(window.dialogArguments[3].residuo);		
	}
});



function dataCorrente() {
	var oggi = new Date();
	var gg = oggi.getDate();
	var mm = (oggi.getMonth() + 1);
	if (gg < 10)	{
		gg = "0" + gg;
	}
	if (mm < 10) {
		mm = "0" + mm;
	}
	var aa = oggi.getFullYear();
	var data = gg + "/" + mm + "/" + aa;
	return data;
}

function oraCorrente() {
	var oggi = new Date();
	var hh = oggi.getHours();
	var mi = oggi.getMinutes();
	if (hh < 10)	{
		hh = "0" + hh;
	}
	if (mi < 10) {
		mi = "0" + mi;
	}
	var ora = hh + ':' + mi;
	return ora;
}

function registraMotivo() {
	if(document.all.txtMotivo.innerText.length<window.dialogArguments[0]) {
		alert('Inserire una motivazione esauriente');
	} else {
		var resp = new Object();
		resp.motivo =document.all.txtMotivo.value;
		resp.data = (document.all.txtData.value).substring(6,10)
			+ (document.all.txtData.value).substring(3,5)
			+ (document.all.txtData.value).substring(0,2);
		resp.ora =document.all.txtOra.value;
		if (window.dialogArguments[1]==2) {
			resp.data2 = (document.all.txtData2.value).substring(6,10)
			+ (document.all.txtData2.value).substring(3,5)
			+ (document.all.txtData2.value).substring(0,2);
			resp.ora2 =document.all.txtOra2.value;
		}
		
		resp.chiudiDet=$('input[name=chkChiusuraDet]').is(':checked')?'S':'N';
		resp.residuo=$('input[name=txtResiduo]').val();
		
		window.returnValue = resp; 
		self.close();
	}
}

function chiudiMotivo() {
	window.returnValue=null;
	self.close();
}