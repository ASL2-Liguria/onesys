function applica()
{
	var provenienza = '';
	var doc = document.formDati;
	var text = "";

	try{
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
		else{
			if (document.getElementById("txtAData")){ 
				if(document.all.txtAData.value == ''){
					document.all.txtAData.value = document.all.txtDaData.value;
				}
			}
		}		
		setHiddenValueFiltri();
		if(baseUser.FILTRO_PROVENIENZA == '0')
			provenienza = document.formDati.FilProv.value;
		if(baseUser.FILTRO_PROVENIENZA == '1')
			provenienza = document.formDati.hFilProv.value;	
		// attenzione
		// viene lasciato comunque l'update
		// dei valori di filtraggio 
		// MA per la data "da data" verrà sempre preso 
		// , perchè cablato nella servlet, la giornata ordierna
		if (tipoFiltraggio == 10){
			text = 'null@' + doc.hMetodica.value + '@' + doc.hCdc.value + '@' + provenienza;
			text +=  '@' + doc.hSale.value + '@null@' + doc.txtDaData.value + '@null@' + doc.hstato_iden.value + '@';
		}
		else if (tipoFiltraggio == 0){
			text = doc.FilUrgenze.value + '@' + doc.hMetodica.value + '@' + doc.hCdc.value + '@' + provenienza;
			text +=  '@' + doc.hSale.value + '@' + doc.FilMed.value + '@' + doc.txtDaData.value + '@' + doc.txtAData.value;
			text +=  '@' + doc.hstato_iden.value + '@';
		}// fine elseif
		//alert(text);
		if(controlAll()==true)
		{
			dwr.engine.setAsync(false);
			CJsUpdTabFiltri.updateFiltri(text, cbkUpdateFiltri);
			dwr.engine.setAsync(true);
		}		
	}
	catch(e){
		alert("applica - error: " + e.description);
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