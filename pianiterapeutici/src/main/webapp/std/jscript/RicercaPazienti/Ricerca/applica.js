//var hnd_attesa='';


function applica(pagina){
	var tipoRicercaAnagraficaUtente = parent.RicPazWorklistFrame.baseUser.TIPO_RICERCA_ANAGRAFICA;	
	
	//alert('aggiorna(): tipoRicerca = ' + tipoRicercaAnagraficaUtente);
	
	if(tipoRicercaAnagraficaUtente == '0')
		ricercaCognNomeData(pagina);
		
	if(tipoRicercaAnagraficaUtente == '1')
		ricercaCodiceFiscale(pagina);
		
	if(tipoRicercaAnagraficaUtente == '2')
		ricercaNumeroArchivio(pagina);
		
	if(tipoRicercaAnagraficaUtente == '3')
		ricercaIdPazDicom(pagina);
		
	if(tipoRicercaAnagraficaUtente == '4')
		ricercaNumeroNosologico(pagina);
	
	if(tipoRicercaAnagraficaUtente == '5')
		ricercaNumeroArchivioNumOld(pagina);
		
	if(tipoRicercaAnagraficaUtente == '6')
		ricercaDaConfigurare(pagina);	
}


/**
	Funzione richiamata all'onLoad della parte di ricerca di Ricerca Pazienti
*/
function caricamento()
{	
	fillLabels(arrayLabelName,arrayLabelValue);
	document.getElementById("idcampo0").focus();
	tutto_schermo();
//	initAppletLogout();
}

/**
	
*/
function raddoppia_apici(valore)
{
	var stringa = valore.replace(/\'/g, "\'\'");//var stringa = valore.replace('\'', '\'\'');
	return stringa;
}



/**
	
*/
function chiudi()
{
	parent.opener.parent.worklistTopFrame.ricerca();
	parent.close();
}



/*
 * Start RICERCA ANAGRAFICA per COGNOME, NOME E DATA DI NASCITA
 */
function ricercaCognNomeData(numero_pagina)
{
	var doc = document.form_pag_ric;
	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';
	
	doc.hidcampo0.value = doc.COGN.value;
	
	if(doc.hCOGN.value != '' || doc.hNOME.value != '' || doc.hDATA.value != ''){
		doc.COGN.value = doc.hCOGN.value;
		doc.NOME.value = doc.hNOME.value;
		doc.DATA.value = doc.hDATA.value;
	}

	if(numero_pagina == '-100' && doc.COGN.value == ''){
		doc.hidWhere.value = "where iden = '-100'";		
		doc.submit();		
	}
	else
	{
		if(numero_pagina != '')
			doc.pagina_da_vis.value = numero_pagina;
		
		doc.COGN.value = doc.COGN.value.toUpperCase();
		doc.NOME.value = doc.NOME.value.toUpperCase();
	
		if(controllo_cognomeCND())
		{
			doc.hidWhere.value = "where cogn like '" + raddoppia_apici(doc.COGN.value) + "%'";
		
			if(doc.NOME.value != '')
				doc.hidWhere.value += " and nome like '" + raddoppia_apici(doc.NOME.value) + "%'";
		
			if(doc.DATA.value != '')
				doc.hidWhere.value += " and data like '" + doc.DATA.value + "'";
			
			doc.hidOrder.value = "order by cogn, nome, dataorder";
	
			doc.submit();
	
			try{
				parent.parent.hideFrame.apri_attesa();
			}
			catch(e){
				//alert(e.description);
			}
		}
	}

	//alert('frame info esame: ' + parent.worklistInfoEsame);
	
	if(parent.worklistInfoEsame)
	{
		var righeFramRicerca = parent.document.all.oFramesetRicercaPaziente.rows.split(',');
		parent.document.all.oFramesetRicercaPaziente.rows = righeFramRicerca[0] + ',*,0,0';
	}
}


/**
	
*/
function controllo_cognomeCND()
{
	var ricerca = false;
	var doc = document.form_pag_ric;
	
	if(doc.DATA.value != '')
	{
		ricerca = true;
	}
	else
	{	
		doc.COGN.value = replace_stringa(doc.COGN.value, "'");
		doc.NOME.value = replace_stringa(doc.NOME.value, "'");
		
		//alert('RES: ' + doc.COGN.value);return;
		
		for(i = 0; i < doc.COGN.value.length; i++)
			if(doc.COGN.value.substring(i, i+1) == '_')
			{
				alert(ritornaJsMsg('alert_underscore'));
				doc.COGN.value == '';
				ricerca = false;
				return;
			}
	
		if(doc.COGN.value == '' 														 || 
		   doc.COGN.value.length < 2 													 || 
		  (doc.COGN.value.substring(0,1) == '%' && doc.COGN.value.substring(1,2) == '%'))																																						
		{
			if(doc.COGN.value.substring(0,1) == '%' && doc.COGN.value.substring(1,2) == '%')
			{
				alert(ritornaJsMsg('alert_%'));
				if(document.getElementById('div').style.display != 'none')
					doc.COGN.focus();
				
				doc.COGN.value = '';
				ricerca = false;
				return;
			}
			else
			{
				if(doc.COGN.value == '' || doc.COGN.value.length < 2)
				{
					alert(ritornaJsMsg('alert_cogn'));
					if(document.getElementById('div').style.display != 'none')
						doc.COGN.focus();
					
					doc.COGN.value = '';
					ricerca = false;
					return;
				}
				ricerca = true;
			}
		}
		else
		{
			ricerca = true;
		}
	}
	return ricerca;
}



/**
	
*/
function apriChiudiCND(){
	ShowHideLayer('div');
	if(parent.document.all.oFramesetRicercaPaziente.rows == "141,*,0,0")
	{
    	parent.document.all.oFramesetRicercaPaziente.rows = "50,*,0,0";
	}
	else
	{
        parent.document.all.oFramesetRicercaPaziente.rows = "141,*,0,0";
    }		
}

function chiudiCND()
{
	parent.close();
}


/**
	
*/
function tastiCND()
{
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaCognNomeData();
 	}
}

/**
	
*/
function resettaDatiCND()
{
	var doc = document.form_pag_ric;
	
	doc.COGN.value = '';
	doc.NOME.value = '';
	doc.DATA.value = '';
	if(document.getElementById('div').style.display != 'none')
		doc.COGN.focus();
}
/*end RICERCA ANAGRAFICA per COGNOME, NOME E DATA DI NASCITA*/

/*
 * Start RICERCA ANAGRAFICA per NUMERO NOSOLOGICO
 */
function ricercaNumeroNosologico(numero_pagina)
{
	var doc = document.form_pag_ric;
	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';

	doc.hidcampo0.value = doc.NUM_NOSOLOGICO.value;
	
	if(numero_pagina == '-100'){
		doc.hidWhere.value = "where iden = '-100'";
		doc.submit();
	}
	else
	{
		if(numero_pagina != '')
			doc.pagina_da_vis.value = numero_pagina;
		
		doc.NUM_NOSOLOGICO.value = doc.NUM_NOSOLOGICO.value.toUpperCase();
	
		controllo_num_nos();
	}
	
	if(parent.worklistInfoEsame)
	{
		var righeFramRicerca = parent.document.all.oFramesetRicercaPaziente.rows.split(',');
		parent.document.all.oFramesetRicercaPaziente.rows = righeFramRicerca[0] + ',*,0,0';
	}
}


/**
	
*/
function tastiNOS()
{
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaNumeroNosologico();
 	}
}

/**
	
*/
function apriChiudiNOS(){
	ShowHideLayer('div');
	if(parent.document.all.oFramesetRicercaPaziente.rows == "82,*,0,0")
	{
    	parent.document.all.oFramesetRicercaPaziente.rows = "50,*,0,0";
	}
	else
	{
        parent.document.all.oFramesetRicercaPaziente.rows = "82,*,0,0";
    }	
}

/**
	
*/
function resettaDatiNOS()
{
	var doc = document.form_pag_ric;
	
	doc.NUM_NOSOLOGICO.value = '';
	if(document.getElementById('div').style.display != 'none')
		doc.NUM_NOSOLOGICO.focus();
}
/*end RICERCA ANAGRAFICA per NUMERO NOSOLOGICO*/



/*
 * Start RICERCA ANAGRAFICA per NUMERO ARCHIVIO - NUM_ARC
 */
function ricercaNumeroArchivio(numero_pagina)
{
	var doc = document.form_pag_ric;

	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';

	doc.hidcampo0.value = doc.NUM_ARC.value;
	
	if(numero_pagina == '-100'){
		doc.hidWhere.value = "where iden = '-100'";
		doc.submit();
	}
	else
	{
		if(doc.provenienza.value == '')
			doc.provenienza.value = 'FromMenuVerticalMenu';
		
		if(numero_pagina != '')
			doc.pagina_da_vis.value = numero_pagina;
		
		doc.NUM_ARC.value = doc.NUM_ARC.value.toUpperCase();
	
		controllo_num_arc('NUM_ARC');
	}
	
	if(parent.worklistInfoEsame)
	{
		var righeFramRicerca = parent.document.all.oFramesetRicercaPaziente.rows.split(',');
		parent.document.all.oFramesetRicercaPaziente.rows = righeFramRicerca[0] + ',*,0,0';
	}
}

/**
	
*/
function tastiNA()
{
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaNumeroArchivio();
 	}
}

/**
	
*/
function apriChiudiNA(){
	ShowHideLayer('div');

	if(parent.document.all.oFramesetRicercaPaziente.rows == "82,*,0,0")
	{
    	parent.document.all.oFramesetRicercaPaziente.rows = "50,*,0,0";
	}
	else
	{
        parent.document.all.oFramesetRicercaPaziente.rows = "82,*,0,0";
    }		
}

/**
	
*/
function resettaDatiNA()
{
	var doc = document.form_pag_ric;
	
	doc.NUM_ARC.value = '';
	
	if(document.getElementById('div').style.display != 'none')
		doc.NUM_ARC.focus();
}
/*end RICERCA ANAGRAFICA per NUMERO ARCHIVIO NUM_ARC*/









/*
 * Start RICERCA ANAGRAFICA per NUMERO ARCHIVIO - NUM_OLD
 */
function ricercaNumeroArchivioNumOld(numero_pagina)
{
	var doc = document.form_pag_ric;

	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';

	doc.hidcampo0.value = doc.NUM_OLD.value;
	
	if(numero_pagina == '-100'){
		doc.hidWhere.value = "where iden = '-100'";
		doc.submit();
	}
	else
	{
		if(doc.provenienza.value == '')
			doc.provenienza.value = 'FromMenuVerticalMenu';
		
		if(numero_pagina != '')
			doc.pagina_da_vis.value = numero_pagina;
		
		doc.NUM_OLD.value = doc.NUM_OLD.value.toUpperCase();
	
		controllo_num_arc('NUM_OLD');
	}
	
	if(parent.worklistInfoEsame)
	{
		var righeFramRicerca = parent.document.all.oFramesetRicercaPaziente.rows.split(',');
		parent.document.all.oFramesetRicercaPaziente.rows = righeFramRicerca[0] + ',*,0,0';
	}
}

/**
	
*/
function tastiNO()
{
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaNumeroArchivioNumOld();
 	}
}

/**
	
*/
function apriChiudiNO(){
	ShowHideLayer('div');
	
	if(parent.document.all.oFramesetRicercaPaziente.rows == "110,*,0,0")
	{
    	parent.document.all.oFramesetRicercaPaziente.rows = "50,*,0,0";
	}
	else
	{
        parent.document.all.oFramesetRicercaPaziente.rows = "110,*,0,0";
    }	
}

/**
	
*/
function resettaDatiNO()
{
	var doc = document.form_pag_ric;
	
	doc.NUM_OLD.value = '';
	
	if(document.getElementById('div').style.display != 'none')
		doc.NUM_OLD.focus();
}
/*end RICERCA ANAGRAFICA per NUMERO ARCHIVIO - NUM_OLD*/








/*
 * Start RICERCA ANAGRAFICA per CODICE FISCALE
 */
function ricercaCodiceFiscale(numero_pagina)
{
	var righe_frame = null;
	var doc = document.form_pag_ric;
	
	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';
	
	doc.hidcampo0.value = doc.COD_FISC.value;	

	if(numero_pagina == '-100'){
		doc.hidWhere.value = "where iden = '-100'";		
		doc.submit();		
	}	
	else{
		if(numero_pagina != '')
			doc.pagina_da_vis.value = numero_pagina;
			
		if(doc.provenienza.value == '')
			doc.provenienza.value = 'FromMenuVerticalMenu';	
		
		doc.COD_FISC.value = doc.COD_FISC.value.toUpperCase();
		
		if(controllo_COD_FISC())
		{
			doc.hidWhere.value = "where cod_fisc like '" + doc.COD_FISC.value + "'";
	
			doc.hidOrder.value = "order by cod_fisc";
		
			doc.submit();
			
			parent.parent.hideFrame.apri_attesa();
		}
	}
	
	if(parent.worklistInfoEsame)
	{
		var righeFramRicerca = parent.document.all.oFramesetRicercaPaziente.rows.split(',');
		parent.document.all.oFramesetRicercaPaziente.rows = righeFramRicerca[0] + ',*,0,0';
	}
}

/**
	
*/
function apriChiudiCF(){
	ShowHideLayer('div');

	if(parent.document.all.oFramesetRicercaPaziente.rows == "82,*,0,0")
	{
    	parent.document.all.oFramesetRicercaPaziente.rows = "50,*,0,0";
	}
	else
	{
        parent.document.all.oFramesetRicercaPaziente.rows = "82,*,0,0";
    }	
}

/**
	
*/
function tastiCF()
{
	if(window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaCodiceFiscale();
 	}
}

/**
	
*/
function resettaDatiCF()
{
	var doc = document.form_pag_ric;
	
	doc.COD_FISC.value = '';

	if(document.getElementById('div').style.display != 'none')
		doc.COD_FISC.focus();
}
/*end RICERCA ANAGRAFICA per CODICE FISCALE*/


/*
 * Start RICERCA ANAGRAFICA per ID_PAZ_DICOM
 */
function ricercaIdPazDicom(numero_pagina)
{
	var doc = document.form_pag_ric;
	
	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';

	doc.hidcampo0.value = doc.ID_PAZ_DICOM.value;
	
	if(numero_pagina == '-100'){
		doc.hidWhere.value = "where iden = '-100'";
		doc.submit();
	}
	else
	{
		if(doc.ID_PAZ_DICOM.value == ''){
			alert(ritornaJsMsg('alert_id_paz_dicom'));
			doc.ID_PAZ_DICOM.focus();
			return;
		}
		else{
			if(numero_pagina != '')
			doc.pagina_da_vis.value = numero_pagina;
		
			doc.ID_PAZ_DICOM.value = doc.ID_PAZ_DICOM.value.toUpperCase();
	
			controllo_ID_PAZ_DICOM();
		}
	}
	
	if(parent.worklistInfoEsame)
	{
		var righeFramRicerca = parent.document.all.oFramesetRicercaPaziente.rows.split(',');
		parent.document.all.oFramesetRicercaPaziente.rows = righeFramRicerca[0] + ',*,0,0';
	}
}


/**
	
*/
function tastiIPD()
{
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaIdPazDicom();
 	}
}

/**
	
*/
function apriChiudiIPD(){
	ShowHideLayer('div');
	if(parent.document.all.oFramesetRicercaPaziente.rows == "82,*,0,0")
	{
    	parent.document.all.oFramesetRicercaPaziente.rows = "50,*,0,0";
	}
	else
	{
        parent.document.all.oFramesetRicercaPaziente.rows = "82,*,0,0";
    }	
}

/**
	
*/
function resettaDatiIPD()
{
	var doc = document.form_pag_ric;
	
	doc.ID_PAZ_DICOM.value = '';
	if(document.getElementById('div').style.display != 'none')
		doc.ID_PAZ_DICOM.focus();
}
/*end RICERCA ANAGRAFICA per ID_PAZ_DICOM*/



/*
 * Start RICERCA ANAGRAFICA da CONFIGURARE
 */
function ricercaDaConfigurare(numero_pagina){
	var doc = document.form_pag_ric;
	
	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';

	doc.hidcampo0.value = doc.DA_CONFIGURARE.value;
	
	if(numero_pagina == '-100'){
		doc.hidWhere.value = "where iden = '-100'";
		doc.submit();
	}
	else
	{
		if(doc.DA_CONFIGURARE.value == ''){
			alert('Attenzione: popolare il campo da ricercare');
			doc.DA_CONFIGURARE.focus();
			return;
		}
		else{
			if(numero_pagina != '')
				doc.pagina_da_vis.value = numero_pagina;
		
			doc.DA_CONFIGURARE.value = doc.DA_CONFIGURARE.value.toUpperCase();
			
			doc.hidWhere.value = "where DA_CONFIGURARE like '" + raddoppia_apici(doc.DA_CONFIGURARE.value) + "%'";

			doc.hidOrder.value = "order by cogn, nome, dataorder";
			
			doc.submit();

			try{
				parent.parent.hideFrame.apri_attesa();
			}
			catch(e){
			}
		}
	}
}


function tastiDaConfigurare(){
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaDaConfigurare();
 	}
}


function apriChiudiDaConfigurare(){
	ShowHideLayer('div');
	if(parent.document.all.oFramesetRicercaPaziente.rows == "82,*,0,0")
	{
    	parent.document.all.oFramesetRicercaPaziente.rows = "50,*,0,0";
	}
	else
	{
        parent.document.all.oFramesetRicercaPaziente.rows = "82,*,0,0";
    }		
}

function resettaDatiDaConfigurare(){
	var doc = document.form_pag_ric;
	
	doc.DA_CONFIGURARE.value = '';
	if(document.getElementById('div').style.display != 'none')
		doc.DA_CONFIGURARE.focus();
}


/*end RICERCA ANAGRAFICA per DA CONFIGURARE*/



/*inizio Ricerca Cognome Nome Data Nascita e Codice Fiscale*/
function ricercaCognNomeDataCF(numero_pagina)
{
	var doc = document.form_pag_ric;
	doc.hidWhere.value = '';
	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';
	
	doc.hidcampo0.value = doc.COGN.value;
	
	if(doc.hCOGN.value != '' || doc.hNOME.value != '' || doc.hDATA.value != ''){
		doc.COGN.value = doc.hCOGN.value;
		doc.NOME.value = doc.hNOME.value;
		doc.DATA.value = doc.hDATA.value;
	}

	if(numero_pagina == '-100' && doc.COGN.value == ''){
		doc.hidWhere.value = "where iden = '-100'";		
		doc.submit();		
	}
	else
	{
		if(numero_pagina != '')
			doc.pagina_da_vis.value = numero_pagina;
		
		doc.COGN.value = doc.COGN.value.toUpperCase();
		doc.NOME.value = doc.NOME.value.toUpperCase();
		doc.COD_FISC.value = doc.COD_FISC.value.toUpperCase();
	
		if(doc.COD_FISC.value != ''){// && controllo_COD_FISC()
			doc.hidWhere.value = "where cod_fisc like '" + raddoppia_apici(doc.COD_FISC.value) + "%'";
		}
		if(controllo_cognomeCNDC())
		{
			if(doc.COGN.value != ''){
				if(doc.hidWhere.value == ''){
					doc.hidWhere.value = "where cogn like '" + raddoppia_apici(doc.COGN.value) + "%'";
				}
				else{
					doc.hidWhere.value += "and cogn like '" + raddoppia_apici(doc.COGN.value) + "%'";
				}
			}
			
 			if(doc.NOME.value != ''){
 				doc.hidWhere.value += " and nome like '" + raddoppia_apici(doc.NOME.value) + "%'";
 			}
		
			if(doc.DATA.value != ''){
				if(doc.hidWhere.value == ''){
					doc.hidWhere.value += " where data like '" + doc.DATA.value + "'";		
				}else{
					doc.hidWhere.value += " and data like '" + doc.DATA.value + "'";				
				}				
			}

	
		}
		
		
		if(doc.hidWhere.value != ''){
			doc.hidOrder.value = "order by cogn, nome, dataorder";	
			//alert('1 where cond:' + doc.hidWhere.value);
			doc.submit();	
			try{
				parent.parent.hideFrame.apri_attesa();
			}
			catch(e){
				//alert(e.description);
			}
		}
	}

	//alert('frame info esame: ' + parent.worklistInfoEsame);
	
	if(parent.worklistInfoEsame)
	{
		var righeFramRicerca = parent.document.all.oFramesetRicercaPaziente.rows.split(',');
		parent.document.all.oFramesetRicercaPaziente.rows = righeFramRicerca[0] + ',*,0,0';
	}
}


/**
	
*/
function controllo_cognomeCNDC()
{
	var ricerca = false;
	var doc = document.form_pag_ric;
	
	if(doc.DATA.value != '' || doc.COD_FISC.value != '')
	{
		ricerca = true;
	}
	else
	{	
		doc.COGN.value = replace_stringa(doc.COGN.value, "'");
		doc.NOME.value = replace_stringa(doc.NOME.value, "'");
		doc.COD_FISC.value = replace_stringa(doc.COD_FISC.value, "'");
		
		//alert('RES: ' + doc.COGN.value);return;
		
		for(i = 0; i < doc.COGN.value.length; i++)
			if(doc.COGN.value.substring(i, i+1) == '_')
			{
				alert(ritornaJsMsg('alert_underscore'));
				doc.COGN.value == '';
				ricerca = false;
				return;
			}
	
		if(doc.COGN.value == '' 														 || 
		   doc.COGN.value.length < 2 													 || 
		  (doc.COGN.value.substring(0,1) == '%' && doc.COGN.value.substring(1,2) == '%'))																																						
		{
			if(doc.COGN.value.substring(0,1) == '%' && doc.COGN.value.substring(1,2) == '%')
			{
				alert(ritornaJsMsg('alert_%'));
				if(document.getElementById('div').style.display != 'none')
					doc.COGN.focus();
				
				doc.COGN.value = '';
				ricerca = false;
				return;
			}
			else
			{
				if(doc.COGN.value == '' || doc.COGN.value.length < 2)
				{
					alert(ritornaJsMsg('alert_cogn'));
					if(document.getElementById('div').style.display != 'none')
						doc.COGN.focus();
					
					doc.COGN.value = '';
					ricerca = false;
					return;
				}
				ricerca = true;
			}
		}
		else
		{
			ricerca = true;
		}
	}
	return ricerca;
}



/**
	
*/
function apriChiudiCNDC(){
	ShowHideLayer('div');
	if(parent.document.all.oFramesetRicercaPaziente.rows == "112,*,0")
	{
    	parent.document.all.oFramesetRicercaPaziente.rows = "50,*,0";
	}
	else
	{
        parent.document.all.oFramesetRicercaPaziente.rows = "112,*,0";
    }		
}

/**
	
*/
function tastiCNDC()
{
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaCognNomeDataCF();
 	}
}

/**
	
*/
function resettaDatiCNDC()
{
	var doc = document.form_pag_ric;
	
	doc.COGN.value = '';
	doc.NOME.value = '';
	doc.DATA.value = '';
	doc.COD_FISC.value = '';
	if(document.getElementById('div').style.display != 'none')
		doc.COGN.focus();
}

/*fine Ricerca Cognome Nome Data Nascita e Codice Fiscale*/

/* 26 - 04 - 2012
 * LinoB
 * Modifica per la gestione della Log Out con SmartCard
 */

/*Aggiungo l'applet e le sue funzioni javascript

function initAppletLogout()
{
	var $newobj = $('<OBJECT type="application/x-java-applet" height="0" width="0">'+
					'<param name="code" value="it.elco.applet.NomeHostSmartCard.class">'+
					'<param name="archive" value="std/app/SignedAppletHostSmartCard.jar">'+	
					'</OBJECT>');

	$('body').append($newobj);
}

//Funzioni utilizzate dall'applet
function LogoutSmart(cf)
{
	try
	{
		closeWhale.chiudiWhale();
	}
	catch(e){
		alert('Error from log out function: '+e.description);
	}
}
//Non c'è la definizione della funzione per evitare l'errore quando sono richiamate dall'applet
function LoginSmartCard(cf){}

function setHostName(nome_host,ip_rilevato){}


//Aggiungo il namespace di gestione della chiusura di whale(rr e pt)

var closeWhale = {

		arrayWindowOpened : new Array(),
		
		init:function(){
		},
		
		pushFinestraInArray:function(finestra){
			this.arrayWindowOpened.push(finestra);
		},
		
		clearArray: function(){
			for (var i=0;i<this.arrayWindowOpened.length;i++){
				try
				{
					this.arrayWindowOpened[i].close();	
				}
				catch(e)
				{
					alert('clearArray'+e.description);
				}
			}
		},
		
		retLenghtArray:function(){
			alert(this.arrayWindowOpened.length);
		},
		
		chiudiWhale:function(){
			try
			{
				closeWhale.clearArray();
			}catch(e)
			{
				alert('chiudiWhale'+e.description);
			}
			top.close();
		}
	};*/