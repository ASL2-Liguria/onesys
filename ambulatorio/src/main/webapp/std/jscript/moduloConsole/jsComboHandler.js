var bolAllComboLoaded = false;
var defaultCharNumOfCombo = 40;


function loadAllCombo(fatherComboId, homeFrame, charNum){
	var sql = "";
	var myLista = new Array();
	var stm = "";
	var rs;
	
	try{
		if (isNaN(charNum)){charNum = defaultCharNumOfCombo;}
		for (var k =0; k<array_id_combo.length;k++){
			myLista = new Array();
			if (fatherComboId==""){
				// getCodificheCombo
				myLista.push(array_combo_codifiche[k]);
				myLista.push(array_combo_codifiche[k]);
				stm = "getCodificheCombo";
			}
			else{
				// getCodificheComboWithFather
				myLista.push(array_combo_codifiche[k]);
				myLista.push(getValue(fatherComboId));	
				stm = "getCodificheComboWithFather";				
			}
			if (typeof(homeFrame)=="undefined"){
				try{rs = parent.executeQuery('comboCodifiche.xml',stm,myLista);}catch(e){alert("Errore: " + stm);return;}
			}
			else{
//				var objHome = eval (homeFrameString);
				try{rs = homeFrame.executeQuery('comboCodifiche.xml',stm,myLista);}catch(e){alert("Errore: " + stm);return;}			
			}
			if (typeof(charNum) == "undefined"){
				// default 
				if(document.getElementById(array_id_combo[k]).multiple){
					// listbox
					fill_selectFromResultSet(rs,array_id_combo[indexToProcess], "IDEN", "DESCRIZIONE", charNum, "...", "COD_DEC");						
				}
				else{
					// combobox classico
					fill_selectFromResultSetWithBlankOption (rs,array_id_combo[k], "IDEN", "DESCRIZIONE", charNum, "...", "COD_DEC");					
				}					
			}
			else{
				if(document.getElementById(array_id_combo[k]).multiple){
					// listbox
					fill_selectFromResultSet(rs,array_id_combo[indexToProcess], "IDEN", "DESCRIZIONE", charNum, "...", "COD_DEC");						
				}
				else{
					// combobox classico
					fill_selectFromResultSetWithBlankOption (rs,array_id_combo[k], "IDEN", "DESCRIZIONE", charNum, "...", "COD_DEC");					
				}	
			}
		}
	}
	catch(e){
		alert("loadAllCombo - Error: " + e.description);	 	
	}
}



function setValore(input_id, value) {
	document.getElementById(input_id).value=value;
}
