function chiudi_ins_mod_tab_per(form)
{
	var tipo_ricerca;
	var campo_descr;
	tipo_ricerca = opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value;
	if(tipo_ricerca == 'DESCR')
		campo_descr = form.cognome.value + ' ' + form.titolo.value + ' ' + form.nome.value;//campo_descr = form.titolo.value + ' ' + form.nome.value + ' ' + form.cognome.value;
    else
		campo_descr = form.cod_dec.value;
	
	opener.parent.Ricerca.put_last_value(campo_descr);
	self.close();
}


	
	
function aggiungi_elemento(valore)
{
	if(valore=='M')
	{
    	num_esa=document.all.oEsa_In.options.length;
        for (i=0;i<num_esa;i++)
		{
        	if (document.all.oEsa_In[i].selected)
			{
            	valore_iden = document.all.oEsa_In.options(i).value;
                valore_descr = document.all.oEsa_In.options(i).text;
                var oOption = document.createElement('Option');
                oOption.text = valore_descr;
                oOption.value = valore_iden;
                document.all.oEsa_Out.add(oOption);
            }
        }
        for (i=num_esa-1;i>-1;i--)
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
    for(i = num_esa-1;i >-1;i--)
	{
    	if(document.all.oEsa_Out[i].selected)
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