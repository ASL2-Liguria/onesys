var chk_value;

function annulla_invio()
{
	if (window.event.keyCode==13)
	{
		window.event.returnValue=false;
	}
}

function registra()
{
	var daData    = document.gestione.txtDaData.value;
	var aData     = document.gestione.txtAData.value;
	var daOra     = document.all.cmbDaOra.value;
	var aOra      = document.all.cmbAOra.value;
	var idAree    = opener.document.dettaglio.id_area.value;
	var tipo      = document.gestione.tipo.value;
	var parametro = daData + '*' + aData + '*' + daOra + '*' + aOra + '*' + idAree + '*' + tipo;
	
	chk_value = '0';
	
	document.gestione.Hda_data.value = daData;
	document.gestione.Ha_data.value = aData;
	document.gestione.Hda_ora.value = document.all.cmbDaOra.value;
	document.gestione.Ha_ora.value = document.all.cmbAOra.value;
	document.gestione.iden_are.value = idAree;
	
	prenDWRClient.check_sosp(parametro, check_fascia);
}

function check_fascia(valore)
{
	var o1 = 0;
	var o2 = 0;
	var err = '';
	
	chk_value = valore;
	
	o1 = (parseInt(document.gestione.Hda_ora.value.substr(0, 2), 10) * 60) + parseInt(document.gestione.Hda_ora.value.substr(3, 5), 10);
	o2 = (parseInt(document.gestione.Ha_ora.value.substr(0, 2), 10) * 60) + parseInt(document.gestione.Ha_ora.value.substr(3, 5), 10);
	
	if(o1 > o2)
	{
		err = 'Inserire l\'ora di fine superiore a quella di inizio!\n';
	}
	
	if(chk_value != '0')
	{
		err += 'Attenzione! Nella fascia oraria selezionata è già presente un esame o una nota o sospensione!\n';
	}
	
	if(document.gestione.note.value == '')
	{
		err += 'Inserire una nota valida!';
	}
	
	if(err != '')
	{
		alert(err);
	}
	else
	{
		document.gestione.submit();
	}
}

function chiudi()
{
	opener.aggiorna();
	self.close();
}