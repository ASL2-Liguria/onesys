function annulla(accettato)
{
	try
	{
		opener.aggiorna(accettato);
	}
	catch(ex)
	{
		opener.aggiorna();
	}
	
	self.close();
}

function accetta()
{
	var data = new Date();
	var dd = '00' + data.getDate();
	var mm = '00' + (data.getMonth() + 1);
	var yyyy = data.getYear();
	var data_oggi;
	var data_ins = document.accettazione.data_acc.value.split("/")[2] + document.accettazione.data_acc.value.split("/")[1] + document.accettazione.data_acc.value.split("/")[0];
	
	dd = dd.substr(dd.length-2, dd.length);
	mm = mm.substr(mm.length-2, mm.length);
	
	data_oggi = yyyy + mm + dd;
	
	if(parseInt(data_oggi, 10) < parseInt(data_ins, 10) && parseInt(data_ins, 10) > parseInt(document.accettazione.dat_esa.value, 10))
	{
		alert('Attenzione! La data inserita è maggiore di quella di prenotazione!');
	}
	else
	{
		document.accettazione.target = '_self';
		document.accettazione.action = 'accettaEsameRegistra';
		document.accettazione.submit();
	}
}

function avvisoAccettato()
{
	alert('Esame già accettato!!!');
	annulla();
}

function oggi()
{
	var data = new Date();
	var dd = '00' + data.getDate();
	var mm = '00' + (data.getMonth() + 1);
	var yyyy = data.getYear();
	
	dd = dd.substr(dd.length-2, dd.length);
	mm = mm.substr(mm.length-2, mm.length);
	
	document.accettazione.data_acc.value = dd + '/' + mm + '/' + yyyy;
}

function avvisoReparto()
{
	alert('Esame appartenente ad un reparto non associato all\'utente!!!');
	annulla();
}