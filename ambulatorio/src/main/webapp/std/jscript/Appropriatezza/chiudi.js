function chiudi_schede_appropriatezza()
{
	//alert('chiudi_schede_appropriatezza: ' + opener.document.form_rows_lock.hblocco.value);
	try{
		opener.after_update();
	}
	catch(e){
		//alert('segreteria');
	}
	
	/*try{
		opener.close();
	}
	catch(e){
		alert('Errore chiusura scheda appropriatezza: ' + e.description);
	}*/
	
	try{
		self.close();
	}
	catch(e){
		alert('Errore chiusura pagina di modifica: ' + e.description);
	}
}

