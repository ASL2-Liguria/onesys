function ricarica_ricerca_pazienti(nome_funzione_ricerca, rows_uno, rows_due, sorgente)
{
	if(sorgente == 'worklistInizio' || sorgente == 'worklist')
		parent.location.replace('worklistInizio');
	else
	{
		var tipo_ricerca = document.form_visualizza_esami.tipo_ricerca.value;
		var val_ric_paz_da_vis_esami = document.form_visualizza_esami.campi_ricerca.value;

		//parent.location.replace('RicPazFrameset?param_ric='+ tipo_ricerca +	'&rows_frame_uno='+rows_uno+'&rows_frame_due='+rows_due+'&menuVerticalMenu='+sorgente+'&val_ric_paz_da_vis_esami='+val_ric_paz_da_vis_esami+"&nome_funzione_ricerca="+nome_funzione_ricerca+'&provenienza=VisualizzaEsami');
		
		parent.location.replace('SL_RicercaPazienteFrameset?param_ric='+ tipo_ricerca +	'&rows_frame_uno='+rows_uno+'&rows_frame_due='+rows_due+'&menuVerticalMenu='+sorgente+'&val_ric_paz_da_vis_esami='+val_ric_paz_da_vis_esami+"&nome_funzione_ricerca="+nome_funzione_ricerca+'&provenienza=VisualizzaEsami');
	}
}


function riposiziona_frame()
{
	var frameClose = 50;
	var frameOpen= 85;
    if (parent.document.all.oFramesetWorklist.rows == "85,0,*")//oFramesetVisualizzaEsamiPaziente
	{
    	parent.document.all.oFramesetWorklist.rows = frameClose + ",0,*";
    }
    else
	{
        parent.document.all.oFramesetWorklist.rows = frameOpen + ",0,*";
    }
}

function applica()
{
	document.form_worklist_esami.target = 'worklistMainFrame';
	document.form_worklist_esami.action = 'worklist';
	document.form_worklist_esami.hidWhere.value = 'where iden_anag = ' + iden;// + ' ' + document.form_worklist_esami.hfiltro_cdc.value;
	document.form_worklist_esami.submit();
}