function aggiorna()
{
	var nome 	= document.all.cmbPagina.value;
	var key_id 	= document.all.txtKeyID.value;
	
	if(nome != '')
	{
		//alert("servletGenerator?KEY_LEGAME=" + nome + "&KEY_ID=" + key_id);
		document.all.iFrameVisualizza.style.width = '100%';
		document.all.iFrameVisualizza.style.height = '100%';
		document.all.iFrameVisualizza.src = "servletGenerator?KEY_LEGAME=" + nome + "&KEY_ID=" + key_id;
		//document.all.iFrameVisualizza.src = "testJack";
	}
	else
	{
		alert('Prego selezionare almeno una pagina.');
	}
}