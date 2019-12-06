// inizialmente è selezionato SEMPRE il primo con indice 0
var vecchioIndiceSelezionato = 0;

function initGlobalObject(){

	fillLabels(arrayLabelName,arrayLabelValue);
	
	
	var indiceProceduraSelezionata = document.all.selProcedure.selectedIndex;
	vecchioIndiceSelezionato = indiceProceduraSelezionata;
	
	fill_select_NoEmptyCodeOption('selCampiIn',arrayCodicePreferitiDisponibili[indiceProceduraSelezionata].split("*"),arrayPreferitiDisponibili[indiceProceduraSelezionata].split("*"),true);
	fill_select_NoEmptyCodeOption('selCampiOut',arrayCodicePreferitiSelezionati[indiceProceduraSelezionata].split("*"),arrayPreferitiSelezionati[indiceProceduraSelezionata].split("*"),true);
	
	// aggiorno descrizione procedura
	setLabelText("lblDescrProcedura", arrayDescrizioneProcedure[indiceProceduraSelezionata]);	
	
}


// funzione caricaLabelCampo
function caricaLabelCampo(nomeLabel,nomeListBox){

	if ((nomeLabel=="")||(nomeListBox=="")){return;}
	setLabelText(nomeLabel,arrayLabelCampo[getIndexByValue(arrayCampoAll, getValue(nomeListBox))]);
}




// funzione 
// che setta il valore
// di un oggetto , tipicamente una label,
// in base ad un ID passato 
// come parametro

function setLabelText(elemento, testo){

var objectNode;

	if (elemento==""){return;}
	objectNode = document.getElementById(elemento);
	if (objectNode){
		objectNode.innerText =testo;
	}

}


// funzione
// che ritorna l'indice 
// di un array in base
// ad un elemento di ricerca
// , se presente
function getIndexByValue(arrayIn,valore){

	var	indiceOut = -1;
	var dimensione ;
	var i=0;
	dimensione = arrayIn.length;
	for (i=0;i<dimensione;i++){
		if (arrayIn[i]==valore){
			indiceOut=i;
			break;
		}
	}
	return indiceOut;

}


// funzione che gestisce 
// l'onchange della procedura
function changeProcedura(){
	
	var codiciDisponibili = "";
	var codiciSelezionati = "";
	var preferitiDisponibili = "";
	var preferitiSelezionati = "";


	var nuovoIndiceProceduraSelezionata = document.all.selProcedure.selectedIndex;

	// devo salvare la situazione attuale
	// rimappo i disponibili 
	codiciDisponibili = getAllOptionCode("selCampiIn");
	preferitiDisponibili = getAllOptionText("selCampiIn");

	arrayCodicePreferitiDisponibili[vecchioIndiceSelezionato] = codiciDisponibili;
	arrayPreferitiDisponibili[vecchioIndiceSelezionato] = preferitiDisponibili;
	
	// rimappo i selezionati
	codiciSelezionati = getAllOptionCode("selCampiOut");
	preferitiSelezionati = getAllOptionText("selCampiOut");
	arrayCodicePreferitiSelezionati[vecchioIndiceSelezionato] = codiciSelezionati;
	arrayPreferitiSelezionati[vecchioIndiceSelezionato] = preferitiSelezionati;
	
	// pulisco le liste 
	remove_all_elem("selCampiIn");
	remove_all_elem("selCampiOut");
	
	// quindi aggiorno
	// entrambe le liste
	fill_select_NoEmptyCodeOption('selCampiIn',arrayCodicePreferitiDisponibili[nuovoIndiceProceduraSelezionata].split("*"),arrayPreferitiDisponibili[nuovoIndiceProceduraSelezionata].split("*"),true);
	fill_select_NoEmptyCodeOption('selCampiOut',arrayCodicePreferitiSelezionati[nuovoIndiceProceduraSelezionata].split("*"),arrayPreferitiSelezionati[nuovoIndiceProceduraSelezionata].split("*"),true);
	
	// il vecchio indice
	vecchioIndiceSelezionato = document.all.selProcedure.selectedIndex;
	
	// aggiorno descrizione procedura
	setLabelText("lblDescrProcedura", arrayDescrizioneProcedure[document.all.selProcedure.selectedIndex]);
}



// funzione chiudi
function chiudi(){
	document.location.replace ("blank");
}


// funzione che tiene allineati
// i contenuti degli array
// con i listbox a video
function aggiornaArray(){
	
	arrayPreferitiDisponibili[document.all.selProcedure.selectedIndex] = getAllOptionText("selCampiIn");
	arrayCodicePreferitiDisponibili[document.all.selProcedure.selectedIndex] = getAllOptionCode("selCampiIn");
	arrayPreferitiSelezionati[document.all.selProcedure.selectedIndex] = getAllOptionText("selCampiOut");
	arrayCodicePreferitiSelezionati[document.all.selProcedure.selectedIndex] = getAllOptionCode("selCampiOut");
}


// funzione
// che registra
// i preferiti dell'utente
function registra(){

	var strOutput = "";
	var k=0;
	// salvo i dati
//	document.frmRegistra.hArrayPreferitiDisponibili.value = getAllOptionTextWithSplitElement("selCampiIn","@");
	//document.frmRegistra.hArrayCodiciPreferitiDisponibili.value = getAllOptionCodeWithSplitElement("selCampiIn","@");
//	document.frmRegistra.hArrayPreferitiSelezionati.value = getAllOptionTextWithSplitElement("selCampiOut","@");

	for (k=0; k< arrayCodicePreferitiSelezionati.length; k++){
		if (strOutput==""){
			if (arrayCodicePreferitiSelezionati[k]==""){
				strOutput = "VOID";		
			}
			else{
				strOutput = arrayCodicePreferitiSelezionati[k];				
			}

		}
		else{
			if (arrayCodicePreferitiSelezionati[k]==""){
				strOutput = strOutput + "@VOID";
			}
			else{
				strOutput = strOutput + "@" + arrayCodicePreferitiSelezionati[k] ;				
			}
			
		}
	}
	document.frmRegistra.hArrayCodiciPreferitiSelezionati.value = strOutput;
	document.frmRegistra.hArrayProcedure.value = getAllOptionCode("selProcedure");
	// apro finestra	
	var finestra = window.open("","wndRegistraPreferiti","top=0, left=0, width = 500, height= 500, status = yes");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("","wndRegistraPreferiti","top=0, left=0, width = 500, height= 500, status = yes");
	}
	document.frmRegistra.submit();


}


