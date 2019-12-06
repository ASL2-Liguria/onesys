

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
	event.returnValue = false;
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
	event.returnValue = false;
}

function setAOrderWk(obj, nomeCampo, ordinamento, classe){
	//alert('Nome del campo: '+ nomeCampo + '\nOrdinamento:  ' + ordinamento + '\nClasse: ' + classe);
	if (ordinamento == 'DESC'){
		alert('ordino ascendente');
		var node= obj.childNodes[0].parentElement.parentElement.childNodes;
		for (var i=0;i<node.length; i++){
			if (node[i].id == 'A_Desc'){
				addClass(node[i], 'divUniqueArrowNull');
			}else if (node[i].id == 'A_Asc'){
				removeClass(node[i], 'divUniqueArrowNull');
			}
		}
		
		setManualAscOrder(nomeCampo);
	}else{
		alert('ordino discendente');
		var node= obj.childNodes[0].parentElement.parentElement.childNodes;
		for (var i=0;i<node.length; i++){
			if (node[i].id == 'A_Asc'){
				addClass(node[i], 'divUniqueArrowNull');
			}else if (node[i].id == 'A_Desc'){
				removeClass(node[i], 'divUniqueArrowNull');
			}
		}
		
		setManualDescOrder(nomeCampo);
	}
}