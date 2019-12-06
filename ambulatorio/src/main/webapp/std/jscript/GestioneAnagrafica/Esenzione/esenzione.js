function gestEsenzione(tipo, readonly)
{
	//alert('TIPO: ' + tipo);
	//alert('READONLY: ' + readonly);
	
	if(tipo=="INS")
	{
		document.frmDati.hEsenzione.value="insese";
		document.frmDati.hIdenEsenz.value="-1";
		document.frmDati.action="SL_EsenzioniPaziente";
		document.frmDati.submit();
	}
	else if(tipo=="MOD")
	{
		if(vettore_indici_sel[0]==null || vettore_indici_sel[0]==-1)
		{
			alert(ritornaJsMsg("MSG_EFFETTUARESELEZIONE"));
		}
		else
		{
			document.frmDati.hEsenzione.value="modese";
			document.frmDati.hIdenEsenz.value=array_codDec[vettore_indici_sel[0]];
			document.frmDati.action="SL_EsenzioniPaziente";
			document.frmDati.submit();
		}
	}
	else if(tipo=="INSESE")
	{
		if(document.frmDati.hEsePat.value == '' || document.frmDati.strEsePat.value == '')
		{
			alert('Prego, inserire una Patologia di Esenzione');
			document.frmDati.strEsePat.focus();
			return;
		}
		document.frmDati.hEsenzione.value="reginsese";
		document.frmDati.action="SL_EsenzioniPaziente";
		document.frmDati.submit();
	}
	else if(tipo=="MODESE")
	{
		if(document.frmDati.hEsePat.value == '' || document.frmDati.strEsePat.value == '')
		{
			alert('Prego, inserire una Patologia di Esenzione');
			document.frmDati.strEsePat.focus();
			return;
		}
		document.frmDati.hEsenzione.value="reginsese";
		document.frmDati.action="SL_EsenzioniPaziente";
		document.frmDati.submit();
	}
	else if(tipo=="EXINSMOD")
	{
		document.frmDati.hEsenzione.value="";
		document.frmDati.action="SL_EsenzioniPaziente";
		document.frmDati.submit();
	}
	else if(tipo=="CAN")
	{
		if(vettore_indici_sel[0]==null || vettore_indici_sel[0]==-1)
		{
			alert(ritornaJsMsg("MSG_EFFETTUARESELEZIONE"));
		}
		else
		{
			var trInt=document.all.oTable.rows[vettore_indici_sel[0]+1];
			var confRsp=window.confirm(ritornaJsMsg("MSG_CANCELLAREESENZIONE")+" "+trInt.cells[0].innerText+" <-> "+trInt.cells[1].innerText);
			if(confRsp)
			{
				document.frmDati.hEsenzione.value="cancese";
				document.frmDati.hIdenEsenz.value=array_codDec[vettore_indici_sel[0]];
				document.frmDati.action="SL_EsenzioniPaziente";
				document.frmDati.submit();
			}
		}
	}
	else 
		if(tipo=="ESC")
		{
			document.frmDati.hIdenAnag.value=document.frmDati.anag_cod.value;
			//document.frmDati.hEsenzione.value = "ricarica";
			
			opener.document.frmDati.esenzioni_paziente_iden.value = array_codDec;

			if(readonly == 'true')
				readonly = 'S';
			else
				readonly = 'N';
			
			//document.frmDati.action = "SL_SchedaAnag?readOnly="+readonly+"&esenzioni_paziente_iden="+array_codDec;
			//document.frmDati.submit();
			
			self.close();
		}
}
function finestre_popup(valore)
{
	if(valore=="ESE")
	{
		document.tab_std.myproc.value="TAB_ESE_PAT";
		document.tab_std.myric.value=document.frmDati.strEsePat.value;
	}
	var winstd = window.open('','winstd','status=yes, scrollbars = yes');//, width=1000, height=680, top=0,left=5
	if(winstd)
		winstd.focus();
	else
		winstd = window.open('','winstd','status=yes, scrollbars = yes');//, width=1000, height=680, top=0,left=5
	document.tab_std.submit();
}