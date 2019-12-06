/**
  *	Modifica l'altezza del frame filtri se è attivo il profilo grafico design2010
  *	e aggiunge un ID al form_pag_ric
  */
if(top.baseUser.PERSONALCSS == 'design2010'){
	var righe_frame = parent.document.all.oFramesetRicercaPaziente.rows;
	vettore = righe_frame.split(',');
	if(vettore[0] == 82){
		parent.document.all.oFramesetRicercaPaziente.rows = '90,*,0,0';
	}else if(vettore[0] == 141){
		parent.document.all.oFramesetRicercaPaziente.rows = '147,*,0,0';
	}
	//alert(document.getElementsById('#div').value);
	parent.idRicPazRicercaFrame.form_pag_ric.id = 'form_pag_ric';
}