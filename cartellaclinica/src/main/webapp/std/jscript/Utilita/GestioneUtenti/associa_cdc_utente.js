function invia()
{
	var doc = document.frmesa;	
    doc.codici.value = '';
    i=0;
    while(i != doc.lst_seleesa.length)
    {
      doc.codici.value = doc.codici.value + doc.lst_seleesa.options[i].value + '*';
      i++;
    }
	
	window.opener.cdc = doc.codici.value;
	window.opener.setCdc = true;
	window.opener.frm_generale.hsetCdc.value = true;
	window.opener.removeCDC();
	j = 0;
	
	if(window.opener.cdc == '')
    {
	   alert('Prego, associare almeno un centro di costo.');
	   return;
    }

    for(j = 0; j < doc.lst_seleesa.length; j++)
    {
   		//window.opener.addCDC(document.frmesa.lst_seleesa.options[j].value, document.frmesa.lst_seleesa.options[j].value);
		window.opener.frm_web.cdc_attivi_utente.value += doc.lst_seleesa.options[j].value + "*";
    }
    self.close();
}
            
			
function chiudi()
{
	if(window.opener.cdc == '')
    {
	   alert('Prego, associare almeno un centro di costo.');
	   return;
    }
	else
   		self.close();
}
     
//window.onunload = function salvaCdcScelti(){closeCNS();};
	 
	 
	 
function aggiungi_elemento(valore)
{
   if(valore=='M')
   {
   		num_esa = document.all.oEsa_In.options.length;
   		for(i = 0;i < num_esa; i++)
   		{
       		if(document.all.oEsa_In[i].selected)
	   		{
           		valore_iden = document.all.oEsa_In.options(i).value;
           		valore_descr = document.all.oEsa_In.options(i).text;
           		var oOption = document.createElement('Option');
           		oOption.text = valore_descr;
           		oOption.value = valore_iden;
           		document.all.oEsa_Out.add(oOption);
       		}
   		}
   		for(i=num_esa-1;i>-1;i--)
   		{
   			if(document.all.oEsa_In[i].selected)
   			{
       			document.all.oEsa_In.options.remove(i);
   			}
   		}
   		return;
   	}
}
            
function rimuovi_elemento()
{
   num_esa=document.all.oEsa_Out.options.length;
   for(i=num_esa-1;i>-1;i--)
   {
       if (document.all.oEsa_Out[i].selected)
	   {
           valore_iden = document.all.oEsa_Out.options(i).value;
           valore_descr = document.all.oEsa_Out.options(i).text;
           var oOption = document.createElement('Option');
           oOption.text = valore_descr;
           oOption.value = valore_iden;
           document.all.oEsa_In.add(oOption);
           document.all.oEsa_Out.options.remove(i);
        }
    }
}