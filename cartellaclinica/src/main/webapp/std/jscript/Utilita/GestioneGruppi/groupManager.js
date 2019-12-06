function esegui(valore)
{
	var alt=400;
    var larg=500;
    var codice='';
    var T=0;
    var val = valore;
    if (valore='') 
		return;
    codice = stringa_codici(iden);
	if(val=='VIS')
    {
		if (codice=='')
		{
        	alert(ritornaJsMsg('MSG_EFFETTUARESELEZIONE'));
			return;
		}
		else
			visualizza_informazioni_gruppo();
	}
	if (codice=='' && (val=='CANC' || val == 'MOD'))
	{
        alert(ritornaJsMsg('MSG_EFFETTUARESELEZIONE'));
        return;
	}
	if (val == 'CANC')
	{
        var scelta = confirm(ritornaJsMsg('CNF_CANCELCONFIRM')+' ' + stringa_codici(descr));
        if(scelta == true)
        {
        	varWinPcDel = window.open('','SL_InsModGroup','status=yes, top=10, left=0');
        	tutto_schermo();
        	filleHFields();
        	document.form_hidden.hOpe.value = val;
			document.form_hidden.hiden_group.value = codice;
        	document.form_hidden.submit();
        }
    }
	else 
	if(val == 'MOD' || val == 'INS')
	{
        varWinPc = window.open('','SL_InsModGroup','status=yes, top=10, left=0');
        tutto_schermo();
        if(val == 'MOD')
        {
        	filleHFields();
        }
        document.form_hidden.hOpe.value = val;
		if(val == 'INS')
			document.form_hidden.hCodDec.value = 'operazione_inserimento';
        document.form_hidden.submit();
    }
}

function filleHFields()
{
	document.form_hidden.hCodDec.value = stringa_codici(cod_dec);
    document.form_hidden.hDescr.value = stringa_codici(descr);
    document.form_hidden.hCodOpe.value = stringa_codici(cod_ope);
	document.form_hidden.hpermissioni_tabelle.value = stringa_codici(permissioni_tabelle);
}

function visualizza_informazioni_gruppo()
{
	var win_info = window.open('', 'win_info', 'status=yes, top=10, left=0');
	document.form_info.cod_gruppo.value = stringa_codici(cod_dec);
	document.form_info.descr_gruppo.value = stringa_codici(descr);
	document.form_info.cod_ope.value = stringa_codici(cod_ope);
	document.form_info.permissioni_tabella.value = stringa_codici(permissioni_tabelle);
	document.form_info.submit();
}

function closeInfo()
{
	document.all.botChiudi.style.visibility='hidden';
    document.all.divInfo.style.display='none';
    document.all.divGroup.style.display='block';
}
		
		
function changeLstGroup()
{
	var T=0;
	for(T=0 ; T<document.all.oTable.rows.length ; T++)
	{
		if(document.all.listGroup.options[document.all.listGroup.selectedIndex].text==document.all.oTable.rows[T].cells[0].innerText)
        {
        	illumina(document.all.oTable.rows[T].sectionRowIndex, 1);
        	viewInfo(document.all.oTable.rows[T].cells[0], document.all.oTable.rows[T].cells[1], document.all.oTable.rows[T].cells[2]);
        	break;
        }
     }
}

function aggiorna(){
	document.location.replace('SL_GroupManager');
}
