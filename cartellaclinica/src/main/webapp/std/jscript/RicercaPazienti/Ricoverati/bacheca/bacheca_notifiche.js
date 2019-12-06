function cambiaAssociazione(obj){

	/*alert(document.all.radioAssociazione[0].checked);
	alert(document.all.radioAssociazione[1].checked);
	alert(document.all.radioAssociazione[2].checked);	
*/
	
	if (document.all.radioAssociazione[0].checked)
			{
				document.all.cmbReparto_Rep.selectedIndex= -1;
				document.all.cmbReparto_Rep.disabled = false;
				document.all.cmbTipo_Rep.selectedIndex= -1;
				document.all.cmbTipo_Rep.disabled = false;
				
				document.all.cmbReparto_Deg.selectedIndex= -1;
				document.all.cmbReparto_Deg.disabled = true;
				document.all.cmbDegente_Deg.selectedIndex= -1;
				document.all.cmbDegente_Deg.disabled = true;
				document.all.cmbTipo_Deg.selectedIndex= -1;
				document.all.cmbTipo_Deg.disabled = true;
				
				document.all.cmbReparto_Ope.selectedIndex= -1;
				document.all.cmbReparto_Ope.disabled = true;
				document.all.cmbOperatore_Ope.selectedIndex= -1;
				document.all.cmbOperatore_Ope.disabled = true;
				
			}
	if (document.all.radioAssociazione[1].checked)
			{
				document.all.cmbReparto_Rep.selectedIndex= -1;
				document.all.cmbReparto_Rep.disabled = true;
				document.all.cmbTipo_Rep.selectedIndex= -1;
				document.all.cmbTipo_Rep.disabled = true;
				
				document.all.cmbReparto_Deg.selectedIndex= -1;
				document.all.cmbReparto_Deg.disabled = false;
				document.all.cmbDegente_Deg.selectedIndex= -1;
				document.all.cmbDegente_Deg.disabled = false;
				document.all.cmbTipo_Deg.selectedIndex= -1;
				document.all.cmbTipo_Deg.disabled = false;
				
				document.all.cmbReparto_Ope.selectedIndex= -1;
				document.all.cmbReparto_Ope.disabled = true;
				document.all.cmbOperatore_Ope.selectedIndex= -1;
				document.all.cmbOperatore_Ope.disabled = true;

			}
	if (document.all.radioAssociazione[2].checked)
			{
				document.all.cmbReparto_Rep.selectedIndex= -1;
				document.all.cmbReparto_Rep.disabled = true;
				document.all.cmbTipo_Rep.selectedIndex= -1;
				document.all.cmbTipo_Rep.disabled = true;
				
				document.all.cmbReparto_Deg.selectedIndex= -1;
				document.all.cmbReparto_Deg.disabled = true;
				document.all.cmbDegente_Deg.selectedIndex= -1;
				document.all.cmbDegente_Deg.disabled = true;
				document.all.cmbTipo_Deg.selectedIndex= -1;
				document.all.cmbTipo_Deg.disabled = true;
				
				document.all.cmbReparto_Ope.selectedIndex= -1;
				document.all.cmbReparto_Ope.disabled = false;
				document.all.cmbOperatore_Ope.selectedIndex= -1;
				document.all.cmbOperatore_Ope.disabled = false;
			}
		
}

function filtraDegenti(cmbSelezione,cmbDestinazione){
alert (cmbDestinazione);
	var objOption;
	objCombo = cmbDestinazione;

	for(i=objCombo.options.length-1;i>=0;i--)
	{objCombo.options[i]=null}
	
	for (i=0;i<array_degenti_reparto.length;i++)
	{
		if (array_degenti_reparto[i]==cmbSelezione.options[cmbSelezione.selectedIndex].value || cmbSelezione.options[cmbSelezione.selectedIndex].value=='')
		{
			objOption = document.createElement("option");
			objOption.value = array_degenti_iden[i];
			objOption.innerText = array_degenti[i];
			objCombo.appendChild(objOption);
		}
	}

}
 
function initArray (arrayDestinazione)   {
	
	var ComboArray = new Array ();
	
	comboArray = document.all.arrayDestinazione.value.split (',');
	
	}
	
function svuotaCampi () {

/*alert (document.all.radioReparto.checked);
alert (document.all.radioDegente.checked);
alert (document.all.radioPersonale.checked);*/

document.all.hTipoUte.value= '';
document.all.hIdenAnag.value= '';
document.all.hIdenPer.value= '';
document.all.hCodiceReparto.value= '';

}

function SegnaComeLetta(){
	
	var idenBacheca = stringa_codici(array_iden);
	var idenPer = document.EXTERN.USER_ID.value;
	var letto = stringa_codici(array_letto);

	if (letto == 'N'){
	
	var sql = "insert into CC_BACHECA_LETTA (IDEN_BACHECA, IDEN_PER, DATA_MODIFICA) VALUES ("+ idenBacheca + ","+idenPer+",sysdate)";
	
	dwr.engine.setAsync(false);
	dwrTerapie.execute(sql,callback);
	dwr.engine.setAsync(true);
	
	
	}else{
		
		alert ('notifica già segnato come "LETTA"');
	}
	
	document.location.reload();

}

function callback(resp)
{
	if(resp!='OK')
		alert(resp);
}	

function preSalvataggio(){
	
    document.all.hDateDataRiferimento.value= document.all.DateDataRiferimento.value;

	//alert (document.dati.hDateDataRiferimento.value);
	
	
	
}