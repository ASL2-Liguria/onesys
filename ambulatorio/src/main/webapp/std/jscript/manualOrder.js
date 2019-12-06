

// funzione che setta l'ordinamento
// manuale (ascendente) della wk
// in base al campo selezionato

// NB verrà usata, se si vuole, una variabile 
// publica jscript "nome_form_manual_order"
// per indicare una form diversa da quella
// di default (frmAggiorna) da richiamare in caso 
// di ordinamento manuale
function setManualAscOrder(valore){
	var oggettoForm;
	var flgNuovaForm=false;
	
	if(valore==""){
		return;
	}
	try{
		if (nome_form_manual_order){
			if (nome_form_manual_order!=""){
				flgNuovaForm = true;
			}
			else{
				flgNuovaForm = false;
			}
		}
	}
	catch (e){
		flgNuovaForm = false;
	}
	
	if (flgNuovaForm==true){
		oggettoForm = document.getElementsByName(nome_form_manual_order)[0];
	}
	else{
		oggettoForm = document.getElementsByName("frmAggiorna")[0];
	}
	if (oggettoForm){
		// ******* azzero i campi
		oggettoForm.hidManualOrderAsc.value = "";
		oggettoForm.hidManualOrderDesc.value = "";
		// *********
		oggettoForm.hidManualOrderAsc.value = valore;
		// finestra attesa
		try{
			loadWaitWindow();
		}
		catch(e){;}
		// fare submit della form di aggiornamento
		oggettoForm.submit();
	}

}

// funzione che setta l'ordinamento
// manuale (discendente) della wk
// in base al campo selezionato
function setManualDescOrder(valore){
	var oggettoForm;
	var flgNuovaForm=false;
	
	if(valore==""){
		return;
	}
	try{
		if (nome_form_manual_order){
			if (nome_form_manual_order!=""){
				flgNuovaForm = true;
			}
			else{
				flgNuovaForm = false;
			}
		}
	}
	catch (e){
		flgNuovaForm = false;
	}
	if (flgNuovaForm==true){
		oggettoForm = document.getElementsByName(nome_form_manual_order)[0];
	}
	else{
		oggettoForm = document.getElementsByName("frmAggiorna")[0];
	}
	if (oggettoForm){
		// ******* azzero i campi
		oggettoForm.hidManualOrderAsc.value = "";
		oggettoForm.hidManualOrderDesc.value = "";
		// *********
		oggettoForm.hidManualOrderDesc.value = valore;
		// finestra attesa
		try{loadWaitWindow();}catch(e){;}
		// fare submit della form di aggiornamento
		oggettoForm.submit();
	}
}