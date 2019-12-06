function controllo_data_nascita(dataNascita)
{
	var ok = true;
	var doc = document.form_pag_ric;
	
	if(baseGlobal.OB_RIC_PAZ_DATA == 'S' || doc.DATA.value != '')
	{
		if(doc.DATA.value.length != 10 || doc.DATA.value == '')
		{
			alert('Prego, indicare correttamente la data di nascita');//alert(ritornaJsMsg('a_data_error'));
			doc.DATA.focus();
			ok = false;
		}
		else
			if(doc.DATA.value.substring(2,3) != '/' || doc.DATA.value.substring(5,6) != '/')
			{
				/*Problema con gli slash*/
				alert('Prego, indicare correttamente la data di nascita');//alert(ritornaJsMsg('a_data_error'));
				doc.DATA.focus();
				ok = false;
			}
			else
				if(checkDate(doc.DATA.value) == true)
				{
					alert('Prego, indicare correttamente la data di nascita');//alert(ritornaJsMsg('a_data_error'));
					doc.DATA.focus();
					ok = false;
				}
	}
	return ok;
}


/*function controllo_cognome()
{
	var ricerca = false;
	var doc = document.form_pag_ric;

	if(doc.DATA.value != '')
	{
		ricerca = true;
		doc.COGN.value = trim(doc.COGN.value);
		doc.NOME.value = trim(doc.NOME.value);
	}
	else
	{	
		doc.COGN.value = replace_stringa(doc.COGN.value, "'");
		doc.NOME.value = replace_stringa(doc.NOME.value, "'");
		
		doc.COGN.value = trim(doc.COGN.value);
		doc.NOME.value = trim(doc.NOME.value);
		
		//alert('RES: ' + doc.COGN.value);
		
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
			if(document.form_pag_ric.COGN.value.substring(0,1) == '%' && document.form_pag_ric.COGN.value.substring(1,2) == '%')
			{
				alert(ritornaJsMsg('alert_%'));
				if(document.getElementById('div').style.display != 'none')
					document.form_pag_ric.COGN.focus();
				document.form_pag_ric.COGN.value = '';
				ricerca = false;
				return;
			}
			else
			{
				if(document.form_pag_ric.COGN.value == '' || document.form_pag_ric.COGN.value.length < 2)
				{
					alert(ritornaJsMsg('alert_cogn'));
					if(document.getElementById('div').style.display != 'none')
						document.form_pag_ric.COGN.focus();
					document.form_pag_ric.COGN.value = '';
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
}*/



function controllo_nome()
{
	var ricerca = false;
	var doc = document.form_pag_ric;

	//alert(baseGlobal.OB_RIC_PAZ_NOME);
	
	if(baseGlobal.OB_RIC_PAZ_NOME == 'S')
	{
		if(doc.DATA.value != '')
		{
			ricerca = true;
			doc.COGN.value = trim(doc.COGN.value);
			doc.NOME.value = trim(doc.NOME.value);
		}
		else
		{	
			doc.COGN.value = replace_stringa(doc.COGN.value, "'");
			doc.NOME.value = replace_stringa(doc.NOME.value, "'");
			
			doc.COGN.value = trim(doc.COGN.value);
			doc.NOME.value = trim(doc.NOME.value);
			
			//alert('RES: ' + doc.COGN.value);
			
			for(i = 0; i < doc.NOME.value.length; i++)
				if(doc.NOME.value.substring(i, i+1) == '_')
				{
					alert(ritornaJsMsg('alert_underscore_n'));
					doc.NOME.value == '';
					ricerca = false;
					return;
				}
		
			if(doc.NOME.value == '' 														 || 
			   doc.NOME.value.length < 2 													 || 
			  (doc.NOME.value.substring(0,1) == '%' && doc.NOME.value.substring(1,2) == '%'))																																						
			{
				if(document.form_pag_ric.NOME.value.substring(0,1) == '%' && document.form_pag_ric.NOME.value.substring(1,2) == '%')
				{
					alert(ritornaJsMsg('alert_%_n'));
					if(document.getElementById('div').style.display != 'none')
						document.form_pag_ric.NOME.focus();
					document.form_pag_ric.NOME.value = '';
					ricerca = false;
					return;
				}
				else
				{
					if(document.form_pag_ric.NOME.value == '' || document.form_pag_ric.NOME.value.length < 2)
					{
						alert(ritornaJsMsg('alert_nome'));
						if(document.getElementById('div').style.display != 'none')
							document.form_pag_ric.NOME.focus();
						document.form_pag_ric.NOME.value = '';
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
	}
	else{
		//alert('nome non obbligatorio');
		ricerca = true;
	}
		
	return ricerca;
}

/**
*/
function controllo_num_arc(nomeCampo)
{
	var doc = document.form_pag_ric;
	
	if(nomeCampo == 'NUM_ARC'){
		if(doc.NUM_ARC.value == '')
		{
			alert(ritornaJsMsg('alert_num_arc'));
			
			if(document.getElementById('div').style.display != 'none')
				doc.NUM_ARC.focus();
			
			doc.NUM_ARC.value = '';
			return;	
		}
		else
			submit_num_arc();
	}
	else
	{
		if(doc.NUM_OLD.value == '')
		{
			alert(ritornaJsMsg('alert_num_arc'));
			
			if(document.getElementById('div').style.display != 'none')
				doc.NUM_OLD.focus();
			
			doc.NUM_OLD.value = '';
			return;	
		}
		else
			submit_num_old();
	}
}


/**
*/
function submit_num_arc()
{
	var doc = document.form_pag_ric;
	doc.NUM_ARC.value = replace_stringa(doc.NUM_ARC.value, "'");
	
	doc.NUM_ARC.value = trim(doc.NUM_ARC.value);
	
	var where_condition =  " WHERE NUM_ARC like '" + doc.NUM_ARC.value + "'";

	doc.hidWhere.value = where_condition;
	
	//alert('where_condition: ' + doc.hidWhere.value);
	
	doc.hidOrder.value = " ORDER BY NUM_ARC";
	doc.submit();
	
	top.home.apri_attesa();
}

/**
*/
function submit_num_old()
{
	var doc = document.form_pag_ric;
	doc.NUM_OLD.value = replace_stringa(doc.NUM_OLD.value, "'");
	
	doc.NUM_OLD.value = trim(doc.NUM_OLD.value);
	
	var where_condition =  " WHERE NUM_OLD like '" + doc.NUM_OLD.value + "'";

	where_condition += " AND REPARTO LIKE '" + doc.cdc.value + "'";
	
	doc.hidWhere.value = where_condition;
	
	//alert('where_condition: ' + doc.hidWhere.value);
	
	doc.hidOrder.value = " ORDER BY NUM_OLD";
	doc.submit();
	
	top.home.apri_attesa();
}
   
   
function controllo_ID_PAZ_DICOM()
{
	var doc = document.form_pag_ric;
	
	doc.ID_PAZ_DICOM.value = replace_stringa(document.form_pag_ric.ID_PAZ_DICOM.value, "'");
	
	doc.ID_PAZ_DICOM.value = trim(document.form_pag_ric.ID_PAZ_DICOM.value);
	
	doc.hidWhere.value = "where ID_PAZ_DICOM like '" + raddoppia_apici(document.form_pag_ric.ID_PAZ_DICOM.value) + "'";
	doc.hidOrder.value = "order by ID_PAZ_DICOM";
	doc.submit();
	
	top.home.apri_attesa();
}
   
   
function controllo_COD_FISC()
{
	var cod_fisc_right = controllo_correttezza_cod_fisc(document.form_pag_ric.COD_FISC, 'valore_errato_cod_fisc');
	if(cod_fisc_right == 1)
    	 return true;
	else
		 return false;
}

function tasti()
{
	if (window.event.keyCode==13)
	{
		window.event.returnValue=false;
		/*try{
			var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
			oDateMask.attach(document.form_pag_ric.DATA);
		}
		catch(e){
		}*/
     	applica();
 	}
}

/*function tasti()
{
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	applica();
 	}
}*/


