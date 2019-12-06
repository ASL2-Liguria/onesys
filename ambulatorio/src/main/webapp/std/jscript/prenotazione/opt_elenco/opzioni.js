var aIdx      = null;
var aIdxTable = null;
var firstSel  = null;
var inserisci = false;
var indice	  = -1;
var ok_blank  = false;



function aggiorna(avviso)
{
	var esami = '';
	var idx = '';
	
	
	// modifica 18-4-16
	var strPostiOccupati = "";
	if ($( "#chkPostiLiberi" ).length){
		if ($('#chkPostiLiberi').attr('checked')){
			strPostiOccupati = "&mostra_posti_occupati=S";
		}
		else{
			strPostiOccupati = "&mostra_posti_occupati=N";
		}
	}
	else{
		strPostiOccupati = "&mostra_posti_occupati=N";
	}
	// *****************
	if(avviso == null)
	{
		avviso = true;
	}
	esami = parent.frameElenco.stringa_codici(parent.frameElenco.a_id_esa);
	idx = parent.frameElenco.generateStringIndice();
	
	if(esami != '')
	{
		//parent.frameCDC.location.replace('prenotazioneCDC?iden_esa=' + esami + '&da_data=' + document.opzioni.txtDaData.value + '&idx_esa=' + idx);
		// modifica 18-4-16
		parent.frameCDC.location.replace('prenotazioneCDC?iden_esa=' + esami + '&da_data=' + document.opzioni.txtDaData.value + '&idx_esa=' + idx + strPostiOccupati);
		// *******
		parent.frameDettaglio.location.replace('blank');
	}
	else
	{
		if(avviso)
		{
			alert('Selezionare almeno un\'esame!');
		}
	}
}

function rimuovi_esame_menu()
{
	var i;
	var par = '';
	
	par = vettore_indici_sel.toString();
	par = par.replace(/\,/g, "*");
	
	checkBlank();
	hideContextMenu();
	rimuovi_esame(par);
	prenDWRClient.rimuovi_esami(par, check_remove);
}

function check_remove(msg)
{
	if(msg != null && msg != '')
	{
		alert(msg);
	}
	
	if(inserisci)
	{
		inserisci = false;
		parent.frameDettaglio.inserisci_prenotazione_confirm(indice);
		if(!ok_blank)
		{
			checkBlank();
		}
	}
}

function rimuovi_esame(idx, ins)
{
	var aInd;
	var i;
	var ok = false;
	
	inserisci = ins != null ? ins:false;
	indice = idx;
	idx += '*';
	aInd = idx.split("*");
	aInd.sort(confronto_dec);
	
	for(i=0; i < aInd.length; i++)
	{
		if(aInd[i] != '')
		{
			aIdx[parseInt(aInd[i])] = '0';
			//a_metodica.splice(parseInt(aInd[i]), 1);
			//a_id_esa.splice(parseInt(aInd[i]), 1);
		}
	}
	
	// Tolto x la nuova versione!!!
	/*aInd = new Array();
	for(i=0; i<document.all.oTable.rows.length; i++)
	{
		if(document.all.oTable.rows(i).style.backgroundColor == sel)
		{
			aInd.splice(0,0,i);
		}
	}*/
	
	for(i=0; i<aInd.length; i++)
	{
		//document.all.oTable.deleteRow(aInd[i]);
		if(aInd[i] != '')
		{
			document.all.oTable.rows(parseInt(aInd[i])).style.display = 'none';
			//document.all.oTable.rows(parseInt(aInd[i])).style.visibility = 'hidden';
			//document.all.oTable.rows(parseInt(aInd[i])).style.height = 0;
		}
	}
	
	// Auto blank
	for(i=0; i<document.all.oTable.rows.length && !ok; i++)
	{
		if(document.all.oTable.rows(i).style.display != 'none')
		{
			ok = true;
		}
	}
	
	ok_blank = ok;
	
	vettore_indici_sel = new Array();
	
	generateStringIndice();
	
	prenDWRClient.ripristina_esami(idx, check_remove);
}

function ripristina_esame(idx)
{
	//document.all.oTable.rows(idx).style.visibility = 'visible';
	//document.all.oTable.rows(idx).style.height = 17;
	document.all.oTable.rows(idx).style.display = 'block';
	document.all.oTable.rows(idx).style.backgroundColor = desel;
	
	if(aIdx == null)
	{
		aIdx = new Array(a_indice.length);
		for(i=0; i<aIdx.length; i++)
		{
			aIdx[i] = '0';
		}
	}
	
	aIdx[idx] = '1';
	
	prenDWRClient.rimuovi_esami(idx, check_remove);
}

function gesIndice(idx, idx_rows)
{
	var i;
	
	//checkBlank();
	
	if(aIdx == null)
	{
		aIdx = new Array(a_indice.length);
		for(i=0; i<aIdx.length; i++)
		{
			aIdx[i] = '0';
		}
	}
	else
	{/*
		if(firstSel != null)
		{
			if(a_metodica[firstSel] != a_metodica[idx])
			{
				for(i=0; i<aIdx.length; i++)
				{
					if(a_metodica[firstSel] == a_metodica[i])
					{
						aIdx[i] = '0';
					}
				}
			}
		}*/
	}
	
	if (hasClass(document.all.oTable.rows(idx_rows), 'sel'))//style.backgroundColor == sel)
	{
		aIdx[idx] = '1';
	}
	else
	{
		aIdx[idx] = '0';
	}
	
	firstSel = idx;
	
	generateStringIndice();
}

function generateStringIndice()
{
	var i;
	
	document.elenco.indice.value = '';
	
	for(i=0; i<aIdx.length; i++)
	{
		if(aIdx[i] == '1')
		{
			if(document.elenco.indice.value != '')
			{
				document.elenco.indice.value += '*';
			}
			
			document.elenco.indice.value += a_indice[i];
		}
	}
	
	return document.elenco.indice.value;
}

function checkBlank()
{
	var nome;
	
	nome = parent.frameCDC.location.href;
	nome = nome.substr(nome.length-5,5)
	if(nome != 'blank')
	{
		parent.frameCDC.location.replace('blank');
	}
	
	nome = parent.frameDettaglio.location.href;
	nome = nome.substr(nome.length-5,5)
	if(nome != 'blank')
	{
		parent.frameDettaglio.location.replace('blank');
	}
}

function apri_elenco_esami()
{
	parent.frameElenco.location.replace('prenotazioneElenco');
}

function creaCheckPostiOccupati(){
	try{
//		alert("creaCheckPostiOccupati");
	   // modifica 18-4-16	
	   if (! $( "#chkPostiLiberi" ).length ) {
		   $("#txtDaData").parent().append("&nbsp;<input type='checkbox' id='chkPostiLiberi' name='chkPostiLiberi' onclick='javascript:aggiorna();' />&nbsp;<label for='chkPostiLiberi' style='cursor:pointer;'>Mostra anche giornate piene</label>");	
	   }
		// *****			
	}
	catch(e){
		alert("creaCheckPostiOccupati - Error:  " + e.description);
	}
}

function seleziona_tutto(aggiorna, vuoto, dett)
{
	var i;
	var ill = false;
	
	if(aggiorna == null)
	{
		aggiorna = true;
	}
	
	if(vuoto == null)
	{
		vuoto = false;
	}
	
	if(dett == null)
	{
		dett = false;
	}
	
	/*for(i=0; i<a_metodica.length; i++)
	{
		if(document.all.oTable.rows(i).style.display != 'none')
		{
			illumina_multiplo(i, a_metodica);
			ill = true;
			gesIndice(i, i);
		}
	}*/
	
	for(i=0; i<document.all.oTable.rows.length; i++)
	{
		if(document.all.oTable.rows(i).style.display != 'none')
		{
			//document.all.oTable.rows(i).style.backgroundColor = desel
			//if(document.all.oTable.rows(i).style.backgroundColor != sel)
			//{
			//	illumina_multiplo(i, a_metodica);
			//}
			//document.all.oTable.rows(i).style.backgroundColor == sel;
			illumina_multiplo(i, a_metodica);
			ill = true;
			gesIndice(i, i);
		}
	}
	
	if(ill && aggiorna)
	{
		parent.frameOpzioni.aggiorna(false);
	}
	else
	{
		if(!ill && vuoto)
		{
			checkBlank();
		}
		else
		{
			if(dett)
			{
				parent.frameDettaglio.aggiorna();
			}
		}
	}
}

function seleziona_stessa_metodica()
{
	var met     = '';
	var cmet    = 0;
	var v_temp  = new Array(a_metodica.length);
	var v_count = new Array(a_metodica.length);
	var v_met   = new Array(a_metodica.length);
	var ill     = false;
	var i;
	var j=0;
	
	for(i=0; i<v_temp.length; i++)
	{
		v_temp[i] = a_metodica[i];
	}
	
	v_temp.sort();
	met = v_temp[0]
	for(i=0; i<=v_temp.length; i++)
	{
		if(v_temp[i] == met)
		{
			cmet++;
		}
		else
		{
			v_count[j] = cmet;
			v_met[j] = met;
			met = v_temp[i];
			cmet = 1;
			j++;
		}
	}
	
	cmet = -1;
	for(i=0; i<j; i++)
	{
		if(v_count[i] > cmet)
		{
			cmet = v_count[i];
			met = v_met[i];
		}
	}
	
	for(i=0; i<a_metodica.length; i++)
	{
		if(a_metodica[i] == met)
		{
			illumina_multiplo(i, a_metodica);
			ill = true;
			gesIndice(i, i);
		}
	}
	
	if(ill)
	{
		parent.frameOpzioni.aggiorna();
	}
}

function getStringEsa(selezionati)
{
	var i;
	var sRet = '';
	var sRet1 = '';
	var sRet2 = '';
	
	for(i=0; i<document.all.oTable.rows.length; i++)
	{
		if(document.all.oTable.rows(i).style.display != 'none')
		{	
			if((selezionati == 'S' && hasClass(document.all.oTable.rows(i), 'sel')) || selezionati == 'T')//document.all.oTable.rows(i).style.backgroundColor == sel) || selezionati == 'T')
			{
				if(sRet1 != '')
				{
					sRet1 += ',';
					sRet2 += ',';
				}
				
				sRet1 += a_id_esa[i];
				sRet2 += a_indice[i];
			}
		}
	}
	sRet = sRet1 + '*' + sRet2;
	
	return sRet;
}

function getCountEsa(prenotati)
{
	var i;
	var countEsa = 0;
	
	for(i=0; i<document.all.oTable.rows.length; i++)
	{
		if(document.all.oTable.rows(i).style.display != 'none' || !prenotati)
		{
			countEsa++;
		}
	}
	
	return countEsa;
}

function annulla_invio()
{
	if (window.event.keyCode==13)
	{
		window.event.returnValue=false;
		aggiorna();
	}
}

function annulla()
{
	parent.ritorna_prenotazione();
}

function ges_data(pos, inc)
{
	var aData = document.opzioni.txtDaData.value.split("/");
	
	aData[pos] += inc;
	
	document.opzioni.txtDaData.value = aData[0] + '/' + aData[1] + '/' + aData[2];
	formatta(document.opzioni.txtDaData.value, '');
}