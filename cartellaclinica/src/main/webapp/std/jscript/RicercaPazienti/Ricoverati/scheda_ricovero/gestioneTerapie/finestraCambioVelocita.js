$(document).ready(function() { 

  if(window.dialogArguments.sospensione=='S'){
	  $('input[name=txtVelocita]').val('0').parent().parent().hide();
	  $('#lblTitolo').text('Sospensione terapia');
  }
  else{
	  $('#lblTitolo').text('Cambio velocità');
	  $('input[name=txtResiduo]').parent().parent().hide();
  }
  
	
$('input[name=txtData]').val(dataCorrente());
$('input[name=txtOra]').val(oraCorrente());
//$('input[name=txtData2]').val(dataCorrente());

$('input[name=txtOra]').bind('keyup', function(){ oraControl_onkeyup(document.getElementById('txtOra'));});
$('input[name=txtOra]').bind('blur', function(){ oraControl_onblur(document.getElementById('txtOra'));});
$('input[name=txtOra2]').bind('keyup', function(){ oraControl_onkeyup(document.getElementById('txtOra2'));});
$('input[name=txtOra2]').bind('blur', function(){ oraControl_onblur(document.getElementById('txtOra2'));});


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


function registraVelocita() {

	
var daData=$('input[name=txtData]').val().substring(6,10)
+ $('input[name=txtData]').val().substring(3,5)
+ $('input[name=txtData]').val().substring(0,2);
var aData=$('input[name=txtData2]').val().substring(6,10)
+ $('input[name=txtData2]').val().substring(3,5)
+ $('input[name=txtData2]').val().substring(0,2);

var dDataInizio=new Date(window.dialogArguments.dataInizio.substring(0,4),parseInt(window.dialogArguments.dataInizio.substring(4,6),10),parseInt(window.dialogArguments.dataInizio.substring(6,8),10),parseInt(window.dialogArguments.oraInizio.substring(0,2),10),parseInt(window.dialogArguments.oraInizio.substring(3,5),10),'','');
var dDataIni=new Date($('input[name=txtData]').val().substring(6,10),parseInt($('input[name=txtData]').val().substring(3,5),10),parseInt($('input[name=txtData]').val().substring(0,2),10),parseInt($('input[name=txtOra]').val().substring(0,2),10),parseInt($('input[name=txtOra]').val().substring(3,5),10),'','');


if(daData==aData && $('input[name=txtOra]').val()==$('input[name=txtOra2]').val()) {
  alert('Attenzione, inserire un orario di inizio differente da quello di fine');	
 return;
}


	
if($('input[name=txtData]').val()=='' || $('input[name=txtOra]').val()=='' || $('input[name=txtVelocita]').val()==''){
	alert('Inserire i campi obbligatori');
	return;
}
	
if(window.dialogArguments.sospensione=='S' && !IsNumeric(document.all.txtResiduo.value)) {
  alert('Inserire correttamente il residuo (numerico)');
  return;	
}

 if(!IsNumeric(document.all.txtVelocita.value) || document.all.txtVelocita.value>1000){
	alert('Inserire correttamente la velocità (valore inferiore a 1000 ml/h)');
	return;
	}


if ((aData!='' && $('input[name=txtOra2]').val()=='') || (aData=='' && $('input[name=txtOra2]').val()!='')){
	alert('Attenzione, inserire entrambi i campi di fine intervallo');
	return;
}

if (aData!=''){
var dDataFine=new Date($('input[name=txtData2]').val().substring(6,10),parseInt($('input[name=txtData2]').val().substring(3,5),10),parseInt($('input[name=txtData2]').val().substring(0,2),10),parseInt($('input[name=txtOra2]').val().substring(0,2),10),parseInt($('input[name=txtOra2]').val().substring(3,5),10),'','');

if (dDataIni>dDataFine){	
	alert('Attenzione, "Da data/ora" successivo a "Fino a data/ora"');
	return;
}
}

if (dDataInizio>dDataIni){
	alert('Inserire i campi "Da data/ora" successivi a quelli di inizio infusione');
	return;
}


	var resp = new Object();
	resp.velocita =$('input[name=txtVelocita]').val();
	resp.dataIni = daData;
	resp.oraIni =$('input[name=txtOra]').val();
	resp.dataFine = aData;
	resp.oraFine =$('input[name=txtOra2]').val();
	resp.residuo =$('input[name=txtResiduo]').val();

	window.returnValue = resp; 
	self.close();
	
}

function chiudiVelocita() {
	window.returnValue=null;
	self.close();
}
function IsNumeric(sText)
{
   var ValidChars = "0123456789,";
   var IsNumber=true;
   var Char;

   for (i = 0; i < sText.length && IsNumber == true; i++) 
      { 
      Char = sText.charAt(i); 
      if (ValidChars.indexOf(Char) == -1) 
         {
         IsNumber = false;
         }
      }
   return IsNumber;
   
}