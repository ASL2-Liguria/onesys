function refresh_filtri()
{
	
}

function InizializzaTeleconsulto()

{
	
	
	document.all.iframeWk.height=500;
	document.all.iframeWk.style.border="none";
	document.all.iframeWk.frameborder="0";
	
	Applica();
}

function gestioneCDC(documento)
{
	documento.formDati.method = 'POST';
	documento.formDati.action='SL_GestFiltroCDC';
	documento.formDati.target='gest_cdc';
	documento.formDati.nome_funzione_applica.value = 'applica_worklist_esami()';
	documento.formDati.nome_funzione_chiudi.value = 'chiudi()';
	var win_cdc = window.open('', 'gest_cdc','width=1000,height=600, status=yes, top=10,left=10, scrollbars=yes');
	if(win_cdc){
		win_cdc.focus();
	}else{
		win_cdc = window.open('', 'gest_cdc','width=1000,height=600, status=yes, top=10,left=10, scrollbars=yes');
	}
	try
	{
			documento.formDati.submit();
	}
	catch(e)
	{
		alert('Non ha trovato il document');
	}
}		

function getWhere()
{
	
	var reparti="'"+document.all.td_cdc_label.title.replace(/,/g, "','")+"'";
	var urgenza=document.all.cmbUrg.value;
	
	var ret= "?cl_where=where reparto_remoto in ("+reparti+") ";
	if (urgenza>-1)
	{
		ret+="and urgenza=" + urgenza;
	}
	da_dat=document.all.da_data.value;
	da_dat = da_dat.substr(6,4) + da_dat.substr(3,2) + da_dat.substr(0,2);
	a_dat=document.all.a_data.value;
	a_dat = a_dat.substr(6,4) + a_dat.substr(3,2) + a_dat.substr(0,2);
	ret+="and dataesame>='" + da_dat + "' and dataesame<='" + a_dat + "'";
	
	return ret;
	 //dataesame>= and dataesame";
}

function Applica(){
	
	
	//.;
	parent.hideFrame.chiudi_attesa();
	document.all.iframeWk.src="SrvWkTelec"+ getWhere();
		

}

function aggiorna_new()
{

	parent.Applica();
}


function referta_teleconsulto()
{

	var stringa_iden_esame="";
	var num_esami_selezionati = 0;
	var iden_ref = "";
	var bolByPassAllCheckForAutoDriving_LOCAL = false;
	
	// ***********
	num_esami_selezionati = conta_esami_sel();
	if (conta_esami_sel()==0){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	// nel caso ci siano +
	// record selezionati verifico che non siano
	// pazienti differenti
	if (num_esami_selezionati>1){
		// controllo anagrafica diversa
		
			// ATTENZIONE modificare con label variabile !
			alert(ritornaJsMsg("jsmsgAnagDiv"));
			return;
		
		
	}
	stringa_iden_esame = stringa_codici(array_iden_esame);
		var sql  = "begin SP_INIZIO_TELECONSULTO(" + stringa_iden_esame + ", " + baseUser.IDEN_PER + "); end;";
		
		//alert(sql);
			dwr.engine.setAsync(false);
			toolKitDB.executeQueryData(sql,ret_referta_teleconsulto);
			dwr.engine.setAsync(true);
		


	
}

function ret_referta_teleconsulto(val)
{
referta();
}