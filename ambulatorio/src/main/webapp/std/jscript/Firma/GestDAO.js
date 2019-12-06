// JavaScript Document
function regDao(){
var Oscuramento='';
var Autorizzazione='';
if (document.formDAO.oscCitta.checked)
{
	Oscuramento='1';
}
else{
	Oscuramento='0'
}
if (document.formDAO.oscHIV.checked)
{
	Oscuramento=Oscuramento+'1';
}
else{
	Oscuramento=Oscuramento+'0'
}
if (document.formDAO.oscVio.checked)
{
	Oscuramento=Oscuramento+'1';
}
else{
	Oscuramento=Oscuramento+'0'
}
if (document.formDAO.oscGra.checked)
{
	Oscuramento=Oscuramento+'1';
}
else{
	Oscuramento=Oscuramento+'0'
}
if (document.formDAO.oscTos.checked)
{
	Oscuramento=Oscuramento+'1';
}
else{
	Oscuramento=Oscuramento+'0'
}
if (document.formDAO.Autorizzazione.checked)
{
	Autorizzazione='1';
}
else{
	Autorizzazione='0'
}

var pass = Oscuramento+'*'+Autorizzazione+'* '+document.formDAO.txtArea.value+'*'+document.formRegistraDAO.idenRef.value;
alert(pass)
dwrDAO.GetDao(pass,dwrEnd)
}

function dwrEnd(variabileRit){

//alert('CIAO' + variabileRit);
if (document.formRegistraDAO.hidFunctionToCall.value=='close')
{
   self.close();
}
else
{
ArrS = variabileRit.split("*");
  if (ArrS[0]=='0')
  {
    if (ArrS[1]=='OK')
    {
    //alert(ArrS[2])
    document.formRegistraDAO.DAO.value=ArrS[2];
    document.formRegistraDAO.Hash.value=ArrS[3];
    document.formRegistraDAO.Xslt.value=ArrS[4];
    if (document.formRegistraDAO.DAO.value=='NO')
    {
    document.formRegistraDAO.DAO.value='';
    }

    //alert(document.formRegistraDAO.DAO.value)
    document.formRegistraDAO.submit();
    }
    else{
        alert('ERROR: ' + ArrS[2]);
    }
  }
  else
  {
    alert(ArrS[1]);
  }
}
}


function regDaoSanter(tagXML){
var Oscuramento='';
var Autorizzazione='';
if (document.formDAO.oscCitta.checked)
{
	Oscuramento='1';
}
else{
	Oscuramento='0'
}
if (document.formDAO.oscHIV.checked)
{
	Oscuramento=Oscuramento+'1';
}
else{
	Oscuramento=Oscuramento+'0'
}
if (document.formDAO.oscVio.checked)
{
	Oscuramento=Oscuramento+'1';
}
else{
	Oscuramento=Oscuramento+'0'
}
if (document.formDAO.oscGra.checked)
{
	Oscuramento=Oscuramento+'1';
}
else{
	Oscuramento=Oscuramento+'0'
}
if (document.formDAO.oscTos.checked)
{
	Oscuramento=Oscuramento+'1';
}
else{
	Oscuramento=Oscuramento+'0'
}
if (document.formDAO.Autorizzazione.checked)
{
	Autorizzazione='1';
}
else{
	Autorizzazione='0'
}

var pass = Oscuramento+'*'+Autorizzazione+'*'+document.formDAO.txtArea.value+'*'+document.formRegistraDAO.idenRef.value+"*REF.FirmaMarcaArchivia";
alert(pass)
dwrDAO.UpdateDao(pass,dwrEndSanter)
}

function dwrEndSanter(variabileRit){

//alert('CIAO' + variabileRit);
if (document.formRegistraDAO.hidFunctionToCall.value=='close')
{
   self.close();
}
else
{
ArrS = variabileRit.split("*");
  if (ArrS[0]=='0')
  {
    if (ArrS[1]=='OK')
    {
    //alert(ArrS[2])
    document.formRegistraDAO.DAO.value=ArrS[2];

    if (document.formRegistraDAO.DAO.value=='NO')
    {
    document.formRegistraDAO.DAO.value='';
    }

    //alert(document.formRegistraDAO.DAO.value)
    document.formRegistraDAO.action='ServletfirmaSanter';
    document.formRegistraDAO.submit();
    }
    else{
        alert('ERROR: ' + ArrS[2]);
    }
  }
  else
  {
    alert(ArrS[1]);
  }
}
}
