var WindowCartella = null;

jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }

	switch (_STATO_PAGINA){
	
		case 'I':
			document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';		
			document.getElementById("txtData").setAttribute("value",getToday());
			document.getElementById("txtDataDichiara").setAttribute("value",getToday());
			
			//radConvivente ONCLICK
			jQuery('#radConvivente').click(function(){ compilaDatiAnag(); });
			
			//radNomeProprio ONCLICK
			jQuery('#radNomeProprio').click(function(){ compilaDatiAnag(); });
			
			//radParente ONCLICK
			jQuery('#radParente').click(function(){ compilaDatiAnag(); });
			
			//radRappLegale ONCLICK
			jQuery('#radRappLegale').click(function(){ compilaDatiAnag(); });
		
		
		break;
		
		case 'L':
		
			$("td[class=classTdLabelLink]").attr('disabled', 'disabled');  
			document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
			document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';

		break;
	}
});

function compilaDatiAnag(){
	
	var param;
	
	param = "SELECT COGN,NOME,DATA,INDIR,COM_NASC,COM_RES,TEL,COMUNI_NASC.COMUNE COMUNE_NASC,COMUNI_NASC.COD_PRO PROV_NASC,"+ 
			"COMUNI_RES.COMUNE COMUNE_RES,COMUNI_RES.COD_PRO PROV_RES FROM ANAG LEFT JOIN COMUNI COMUNI_NASC ON (ANAG.COM_NASC=COMUNI_NASC.XXX_CCOM)"+
			"LEFT JOIN COMUNI COMUNI_RES ON (ANAG.COM_RES=COMUNI_RES.XXX_CCOM) WHERE ANAG.IDEN=" + document.EXTERN.IDEN_ANAG.value;
	param += "@COGN*NOME*DATA*INDIR*COM_NASC*COM_RES*TEL*COMUNE_NASC*PROV_NASC*COMUNE_RES*PROV_RES";
	param += "@1*1*1*1*1*1*1*1*1*1*1";
	
	dwr.engine.setAsync(false);
	CJsUpdate.select(param, gestDatiAnag);
	dwr.engine.setAsync(true);	
}


function gestDatiAnag(datiAnag){
	
	var array_dati=null;
	var sData=null;
	
	//alert('datiAnag='+datiAnag);
	array_dati = datiAnag.split('@');
	if (document.all.radNomeProprio.checked){
		clearDatiAnag(); // cancella i dati anagrafici in alto
		clearDatiSig();  // cancella i dati anagrafici del rappresentante
		clearDatiDichiara(); // cancella i dati anagrafici di dichiarazione atto notorietà
		// riscrive i dati anagrafici in alto
		document.all.txtSottoscritto.value=array_dati[0]+ ' ' + array_dati[1];
		if (array_dati[7]!='null') 
			document.all.txtNato.value=array_dati[7];
		if (array_dati[8]!='null')
			document.all.txtProvNasc.value = array_dati[8];
		sData=array_dati[2];
		document.all.txtDataNasc.value=sData.substring(6)+'/'+sData.substring(4,6)+'/'+sData.substring(0,4);
		if (array_dati[9]!='null')
			document.all.txtComuneRes.value=array_dati[9];
		if (array_dati[10]!='null')
			document.all.txtProvRes.value=array_dati[10];
		if (array_dati[3]!='null')
			document.all.txtIndirizzo.value = array_dati[3];
		if (array_dati[6]!='null')
			document.all.txtTelefono.value = array_dati[6];
	
	}else{
		
		clearDatiSig(); // cancella i dati anagrafici del rappresentante
		// riscrive i dati anagrafici del rappresentante
		document.all.txtSig.value=array_dati[0]+ ' ' + array_dati[1];
		if (array_dati[7]!='null') 
			document.all.txtNatoA.value=array_dati[7];
		if (array_dati[8]!='null')
			document.all.txtProvNasc2.value = array_dati[8];
		sData=array_dati[2];
		document.all.txtDataNasc2.value=sData.substring(6)+'/'+sData.substring(4,6)+'/'+sData.substring(0,4);
		if (array_dati[9]!='null')
			document.all.txtComuneRes2.value=array_dati[9];
		if (array_dati[10]!='null')
			document.all.txtProvRes2.value=array_dati[10];
		if (array_dati[3]!='null')
			document.all.txtIndirizzo2.value = array_dati[3];
		if (array_dati[6]!='null')
			document.all.txtTelefono2.value = array_dati[6];
		// copia i dati anagrafici nella parte della dichiarazione di atto di notorietà
		if (document.all.txtSottoscritto2.value==''){
			document.all.txtSottoscritto2.value=document.all.txtSottoscritto.value;
			document.all.txtNatoA2.value=document.all.txtNato.value;
			document.all.txtProvNasc3.value=document.all.txtProvNasc.value;
			document.all.txtDataNasc3.value=document.all.txtDataNasc.value;
			document.all.txtComuneRes3.value=document.all.txtComuneRes.value;
			document.all.txtProvRes3.value=document.all.txtProvRes.value;
		}
	}
}

function clearDatiAnag(){
	
	//alert('clear dati anag');
	document.all.txtSottoscritto.value='';
	document.all.txtNato.value='';
	document.all.txtProvNasc.value='';
	document.all.txtProvNasc.value='';
	document.all.txtDataNasc.value='';
	document.all.txtComuneRes.value='';
	document.all.txtProvRes.value='';
	document.all.txtIndirizzo.value='';
	document.all.txtTelefono.value='';
}

function clearDatiSig(){
	
	// alert('clear dati sig');
	document.all.txtSig.value='';
	document.all.txtNatoA .value='';
	document.all.txtProvNasc2.value='';
	document.all.txtDataNasc2.value='';
	document.all.txtComuneRes2.value='';
	document.all.txtProvRes2.value='';
	document.all.txtIndirizzo2.value='';
	document.all.txtTelefono2 .value='';	
}

function clearDatiDichiara(){
	
	document.all.txtSottoscritto2.value='';
	document.all.txtNatoA2 .value='';
	document.all.txtProvNasc3.value='';
	document.all.txtDataNasc3.value='';
	document.all.txtComuneRes3.value='';
	document.all.txtProvRes3.value='';
	document.all.txtDocIdentita.value='';
}

function registraConsenso(){
	// test correttezza dati
	if (document.all.txtSottoscritto.value==document.all.txtSig.value){
		alert('Attenzione: il nominativo del paziente non deve essere uguale al rappresentante legale!');
		return;
	}
	if (!document.all.radNomeProprio.checked && !document.all.radRappLegale.checked && !document.all.radParente.checked && !document.all.radConvivente.checked){		
		alert('Occorre scegliere una opzione di potestà');	
		return;
	}
	if (document.all.radRappLegale.checked)
		if (document.all.cmbRappLegale.selectedIndex==0){
			alert('Occorre scegliere il rappresentante legale');
			return;
		}
	if (document.all.radParente.checked)
		if (document.all.cmbParentela.selectedIndex==0){
			alert('Occorre scegliere il grado di parentela');
			return;
		}
	if (!document.all.radAutorizzaTrattDati.checked && !document.all.radNonAutorizzaTrattDati.checked){
		alert('Occorre scegliere una opzione di autorizzazione');
		return;
	}
	if (!document.all.txtSottoscritto2.value=='')
		if (!document.all.radPotestaMinore.checked && !document.all.radRappLegalePaz.checked && !document.all.radParentePaz.checked && !document.all.radConviventePaz.checked){
			alert('Occorre scegliere una opzione nella dichiarazione atto di notorietà');
			return;
		}
			
	// salvataggio 
	registra();
}

function stampaConsenso()
{
	var funzione	= 'CONSENSO_TRATTAMENTO_DATI';
	var anteprima	= 'S';
	var reparto		= WindowCartella.getAccesso("COD_CDC");
	var sf 			= '&prompt<pVisita>='+top.getRicovero("IDEN");

    WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,WindowCartella.basePC.PRINTERNAME_REF_CLIENT);
	
}

function regOK(){
	$('iframe#frameWork',parent.document)[0].contentWindow.$('iframe#oIFWk')[0].contentWindow.location.reload();
    WindowCartella.$.fancybox.close();
}
