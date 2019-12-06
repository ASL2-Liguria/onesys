/**
*/
function intercetta_tasti()
{
	if (window.event.keyCode==13){
		 window.event.keyCode = 0;
		 applica('', tipo_ric);
 	}
}

/**
*/
function controlla_num_acc(valore, where_cond, tipo_ricerca)
{
	where_cond = replace_stringa(where_cond, "'");
	where_cond = raddoppia_apici(where_cond);
	if(isNaN(valore.value))
	{
    	alert(ritornaJsMsg('alert_num_pre'));
     	valore.value = '';
     	if(document.getElementById('div').style.display != 'none')
        	valore.focus();
     	return;     
	}
	else
	{
    	var select_where = ' where '+tipo_ricerca+' = '  + where_cond;
     	document.form_worklist.hidWhere.value = select_where;
     	document.form_worklist.submit();
	}
}

/**
*/
function applica(valore_campo_ric, tipo_ricerca)
{
	var doc_wk = document.form_worklist;
	var where_cond = '';
	var doc = 'ok';
	var valore = doc_wk.numacc;
	
	if(tipo_ricerca == 'id_esame_dicom')
		doc = doc_wk.id_esame_dicom;
	else
		if(tipo_ricerca == 'numacc')
			doc = doc_wk.numacc;	

	if(valore_campo_ric == -1)
    	where_cond = -1;
	else
    	where_cond = doc.value;
	
	if(where_cond == '') 
	{
    	alert(ritornaJsMsg('campi_vuoti'));
        if(document.getElementById('div').style.display != 'none')
        	doc_wk.id_esame_dicom.focus();
        return;
    }
	else
	{
		if(where_cond == -1)
		{
     		doc_wk.hidWhere.value = " where " + tipo_ricerca + " = '" + where_cond + "'";
     		doc_wk.submit();
		}
		else
		{
			if('numacc' == tipo_ricerca )
     			controlla_num_acc(valore, where_cond, tipo_ricerca);
			else
			    if(tipo_ricerca == 'id_esame_dicom'){
     				var apice_sx = "'";     
					var apice_dx = "'";     
					where_cond = replace_stringa(where_cond, "'");
					doc.value = where_cond;
					where_cond = raddoppia_apici(where_cond);
					
     				var select_where = " where "+tipo_ricerca+" like "  + apice_sx + where_cond + apice_dx;
     				doc_wk.hidWhere.value = select_where;
     				doc_wk.submit();
				}
				else
					if(tipo_ricerca == 'cognome'){
						initRicEsaPazData();
						
						doc_wk.cognome.value = doc_wk.cognome.value.toUpperCase();
						doc_wk.nome.value = doc_wk.nome.value.toUpperCase();
						
						if(controllo_cognome(doc_wk.cognome.value))
						{
							//if(controllo_data_nascita(doc_wk.data_nascita.value))
							//{
								doc_wk.hidWhere.value = "where cognome like '" + raddoppia_apici(doc_wk.cognome.value) + "%'";
							
								if(doc_wk.nome.value != '')
									doc_wk.hidWhere.value += " and nome like '" + raddoppia_apici(doc_wk.nome.value) + "%'";
							
								if(doc_wk.data_nascita.value != '')
									doc_wk.hidWhere.value += " and datanascita like '" + doc_wk.data_nascita.value + "'";
								
								doc_wk.hidOrder.value = "order by cognome, nome";
								
								/*try{
									top.home.apri_attesa();//apri_attesa();
								}
								catch(e){
									parent.top.home.apri_attesa();
								}*/
								
								doc_wk.submit();
							//}
						}
					}
		   }
 	 }
}


/**
*/
function resetta()
{
	if(tipo_ric == 'id_esame_dicom')
		doc = document.form_worklist.id_esame_dicom;
	else	
		if(tipo_ric == 'numacc')
			doc = document.form_worklist.numacc;
		else
			if(tipo_ric == 'cognome'){
				doc = document.form_worklist.cognome;
				document.form_worklist.nome.value = '';
				document.form_worklist.data_nascita.value = '';
			}
	
	doc.value = '';
	
	if(document.getElementById('div').style.display != 'none')
   		doc.focus();
}


/**
*/
function raddoppia_apici(valore)
{
	var stringa = valore.replace("\'", "\'\'");
	return stringa;
}




function controllo_cognome()
{
	var ricerca = false;
	var doc = document.form_worklist;

	if(doc.data_nascita.value != '')
	{
		ricerca = true;
		doc.cognome.value = trim(doc.cognome.value);
		doc.nome.value = trim(doc.nome.value);
	}
	else
	{	
		doc.cognome.value = replace_stringa(doc.cognome.value, "'");
		doc.nome.value = replace_stringa(doc.nome.value, "'");
		
		doc.cognome.value = trim(doc.cognome.value);
		doc.nome.value = trim(doc.nome.value);
		
		//alert('RES: ' + doc.cognome.value);
		
		for(i = 0; i < doc.cognome.value.length; i++)
			if(doc.cognome.value.substring(i, i+1) == '_')
			{
				alert(ritornaJsMsg('alert_underscore'));
				doc.cognome.value == '';
				ricerca = false;
				return;
			}
	
		if(doc.cognome.value == '' 														 || 
		   doc.cognome.value.length < 2 													 || 
		  (doc.cognome.value.substring(0,1) == '%' && doc.cognome.value.substring(1,2) == '%'))																																						
		{
			if(doc.cognome.value.substring(0,1) == '%' && doc.cognome.value.substring(1,2) == '%')
			{
				alert(ritornaJsMsg('alert_%'));
				if(document.getElementById('div').style.display != 'none')
					doc.cognome.focus();
				doc.cognome.value = '';
				ricerca = false;
				return;
			}
			else
			{
				if(doc.cognome.value == '' || doc.cognome.value.length < 2)
				{
					alert(ritornaJsMsg('alert_cogn'));
					if(document.getElementById('div').style.display != 'none')
						doc.cognome.focus();
					doc.cognome.value = '';
					ricerca = false;
					return;
				}
			}
		}
		else
		{
			ricerca = true;
		}
	}
	return ricerca;
}


function initRicEsaPazData(){
	var oDateMask = null;
	oDateMask = new MaskEdit("dd/mm/yyyy","date");
	oDateMask.attach (document.form_worklist.data_nascita);
}




