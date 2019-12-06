// JavaScript Document

function cambiaPermessi()
{
for(i = 0; i < array_iden_group.length; i++)
{
	if(document.frm_web.group.value == array_iden_group[i])
	{
		//alert('GRUPPI.cod_ope: ' + array_permessi);
		//alert('GRUPPI.permissioni_tabelle: ' + array_permessi_tabelle);
		
		document.frm_web.cod_ope_pre.value = array_permessi[i].substring(0,1);
		document.frm_web.cod_ope_acc.value = array_permessi[i].substring(1,2);
		document.frm_web.cod_ope_ese.value = array_permessi[i].substring(2,3);
		document.frm_web.cod_ope_ref.value = array_permessi[i].substring(3,4);
		document.frm_web.cod_ope_ana.value = array_permessi[i].substring(4,5);
		document.frm_web.cod_ope_par.value = array_permessi[i].substring(5,6);
		document.frm_web.cod_ope_mag.value = array_permessi[i].substring(6,7);
		document.frm_web.cod_ope_can.value = array_permessi[i].substring(7,8);
		//document.frm_web.cod_ope_tab.value = array_permessi[i].substring(8,9);
		document.frm_web.cod_canc_esa.value = array_permessi[i].substring(9,10);
		
		if(array_permessi_tabelle[i].substring(0,1) != '_')
			document.frm_web.permesso_tabelleA.checked = true;
		else
			document.frm_web.permesso_tabelleA.checked = false;
			
		if(array_permessi_tabelle[i].substring(1,2) != '_')
			document.frm_web.permesso_tabelleT.checked = true;
		else
			document.frm_web.permesso_tabelleT.checked = false;
			
        if(array_permessi_tabelle[i].substring(2,3) != '_')
			document.frm_web.permesso_tabelleE.checked = true;
		else
			document.frm_web.permesso_tabelleE.checked = false;
			
		if(array_permessi_tabelle[i].substring(3,4) != '_')
			document.frm_web.permesso_tabelleR.checked = true;	
		else
			document.frm_web.permesso_tabelleR.checked = false;
			
		if(array_permessi_tabelle[i].substring(4,5) != '_')
			document.frm_web.permesso_tabelleP.checked = true;	
		else
			document.frm_web.permesso_tabelleP.checked = false;
			
		if(array_permessi_tabelle[i].substring(5,6) != '_')
			document.frm_web.permesso_tabelleO.checked = true;	
		else
			document.frm_web.permesso_tabelleO.checked = false;
			
		if(array_permessi_tabelle[i].substring(6,7) != '_')
			document.frm_web.permesso_tabelleC.checked = true;
		else
			document.frm_web.permesso_tabelleC.checked = false;
			
		if(array_permessi_tabelle[i].substring(7,8) != '_')
			document.frm_web.permesso_tabelleX.checked = true;
		else
			document.frm_web.permesso_tabelleX.checked = false;	
		}
	}
}