function visualizza_numeri_archivio(anagIden)
{
	var doc 	  = document.form_vis_num_arch;
	var iden_anag = -1;
	var sel	      = -1;
	
	if(anagIden)
	{
		iden_anag = anagIden;
	}
	else
	{
		try{
			iden_anag = stringa_codici(iden);
		}
		catch(e){
			iden_anag = stringa_codici(array_iden_anag);
		}
	}
	
	//alert('IDEN_ANAG NUM_ARCH: ' + iden_anag);
	
	try{
		sel = iden_anag.indexOf("*");
	}
	catch(e){
		sel = -1;
	}
	
	if(iden_anag == '' || iden_anag == -1 ||  sel > -1)
	{
		alert(ritornaJsMsg("selezionare"));		
		return;
	}
	
	
	doc.action = 'SL_VisualizzaNumeriArchivio';
	doc.target = 'win_vis_num_arch';
	doc.method = 'POST';
	
	doc.hidwhere.value = ' WHERE IDEN_ANAG = ' + iden_anag;//doc.hidwhere.value = ' WHERE IDEN_ANAG_NEW = ' + iden_anag;
	doc.hidorder.value = ' ORDER BY ATTIVO, ANNO';
	
	//alert('WHERE CONDITION: ' + doc.hidwhere.value);
	
	var finestra = window.open("","win_vis_num_arch","toolbar=no,menubar=no,resizable=yes,height=600,width=1000,top=0,left=0,status=yes");
	if(finestra)
		finestra.focus();
	else
		finestra = window.open("","win_vis_num_arch","toolbar=no,menubar=no,resizable=yes,height=600,width=1000,top=0,left=0,status=yes");
	
	
	doc.submit();	
}