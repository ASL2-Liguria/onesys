function applica()
{
	var provenienza = '';
	var doc = document.formDati;
	
	if(document.getElementById("DIVFLTUP").style.display=='none')
	{
		document.forms("frmMain").elements("hApriChiudi").value = "Chiuso";
	}
	else
	{
		document.forms("frmMain").elements("hApriChiudi").value = "";
	}
	
	if(document.all.txtDaData.value == '')
	{
		alert('Prego inserire il filtro: DA DATA');
		return;
	}
	else
		if(document.all.txtAData.value == '')
		{
			document.all.txtAData.value = document.all.txtDaData.value;
		}

	//Copia dei valori inseriti nei campi nascosti
	setHiddenValueFiltri();

	
	if(baseUser.FILTRO_PROVENIENZA == '0')
		provenienza = document.formDati.FilProv.value;
	if(baseUser.FILTRO_PROVENIENZA == '1')
		provenienza = document.formDati.hFilProv.value;	
		
	//alert('function applica() - WEB.FILTRO_PROVENIENZA = '+ baseUser.FILTRO_PROVENIENZA + '\n VALORE CAMPO PROVENIENZA: ' + provenienza);


	var text = doc.FilUrgenze.value + '@' + doc.hMetodica.value + '@' + doc.hCdc.value + '@' + provenienza;
	text +=  '@' + doc.hSale.value + '@' + doc.FilMed.value + '@' + doc.txtDaData.value + '@' + doc.txtAData.value;
	text +=  '@' + doc.hstato_iden.value + '@';
        
	if(controlAll()==true)
	{
		dwr.engine.setAsync(false);
    	CJsUpdTabFiltri.updateFiltri(text, cbkUpdateFiltri);/* parametro per la funzione java + callback */
		dwr.engine.setAsync(true);
	}
}

/* funzione di callback */
function cbkUpdateFiltri(message)
{
	if(message == '')
	{
		/*Costruzione delle stringhe Where e Order per effettuare il submit alla worklist (form_worklist)*/
		insertWhereOrder();
		/*Finestra di attesa*/
		top.home.apri_attesa();
	}
	else
		if(message == 'sessione_scaduta')
		{
			insertWhereOrder();
		}
		else
			alert(message);
}



var frameClose = 40;
var frameOpen= 140;

function espandiFrame()
{
	var righe_frame = parent.document.all.oFramesetWorklist.rows;
	//alert(righe_frame);
	vettore = righe_frame.split(',');
	var info_ref = vettore[3];
	//alert(info_ref);
	if (righe_frame == '140,0,*,' + info_ref)
	{
		parent.document.all.oFramesetWorklist.rows = frameClose + ',0,*,' + info_ref;
	}
	else
	{
		parent.document.all.oFramesetWorklist.rows = frameOpen + ',0,*,' + info_ref;
	}
}