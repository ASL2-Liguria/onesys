// funzione che ritorna
// una boolean in base alla 
// modalità degli esami che
// si stanno refertando
// true: esami MN
// false: esami NON mn 
// ************
// accetta come parametri
// l'array contenente le metodiche
function checkModalitaEsami(lista){
	
	var oldMetodica = "-1";
	var esito = true;
	var i = 0

	try{
		for (i=0;i<lista.length;i++){
			if (lista[i].toString().toUpperCase()!="Z"){
				esito = false;
				break;
			}
		}
	}
	catch(e){
		esito = false;
	}
	return esito;
}

// funzione
// che ritorna l'intestazione 
// del  testo del referto 
// per gli esami MN
function getMNreportHeader(){
	
	var strHeaderReferto ="";
	var i = 0;
	// usare gestione
	// errore try catch
	// nel caso si accedesse a un 
	// array non definito
	try{
		for (var i =0;i<array_descr_esame.length;i++){
			// label esami
			if (baseGlobal.MN_LABEL_ESAMI=="S"){
				strHeaderReferto  = strHeaderReferto + "Esami: " + array_descr_esame[i] + "\r\n";
			}
			// label data esecuzione esame
			if (baseGlobal.MN_DATA_PRESENTE=="S"){
				if (baseGlobal.MN_DATA_A_CAPO=="S"){
					strHeaderReferto  = strHeaderReferto + baseGlobal.MN_LABEL_DATA +" " + iso2data(array_dat_esa[i]) + "\r\n";
				}
				else{
					strHeaderReferto  = strHeaderReferto + baseGlobal.MN_LABEL_DATA + " " +iso2data(array_dat_esa[i]) + "\r\n";					
				}
			}
		}
		for (var i =0;i<array_descr_art.length;i++){
			// materiale
			// array_descr_art
			// array_qta_art
			if (i==0){
				strHeaderReferto = strHeaderReferto + baseGlobal.MN_LABEL_MAT + "\r\n\r\n";
			}
			try{
				if (baseGlobal.MN_ORDINE_MAT=="Q"){
					// prima la quantità
					strHeaderReferto = strHeaderReferto + "- " +array_qta_art[i] + " " + array_descr_art[i] + "\r\n";
				}
				else{
					// prima la descrizione materiale
					strHeaderReferto = strHeaderReferto + "- " + array_descr_art[i] + " " + array_qta_art[i] + "\r\n";
				}
			}
			catch(e){
				;
			}
		}
	}
	catch(e){
		//strHeaderReferto = "Error";
	}
	
	return strHeaderReferto;
}

// funzione che
// che converte la data da formato ISO
// aaaammgg a formato data gg/mm/aaaa
function iso2data(valore){
	if (valore==""){return"";}
	return valore.substr(6,2) + "/" + valore.substr(4,2) +"/" + valore.substr(0,4); 
}