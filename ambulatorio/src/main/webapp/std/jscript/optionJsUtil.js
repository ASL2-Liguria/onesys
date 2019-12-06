// JavaScript Document

// Set di funzioni per la gestione di tag <SELECT>
function containElementByValue (elementId, value){
	var oggetto;
	var bolFound = false;
	try{
		oggetto = document.getElementById(elementId);
		if (oggetto){
			for (i=0;i<oggetto.length;i++){
				if  (oggetto.options.item(i).value.toString()==value){
					bolFound = true;
					break;
				}
			}
		}
	}
	catch(e){
		alert("containElementByValue - Error: " + e.description);
	}
	return bolFound;
}

function containElementByText (elementId, value){
	var oggetto;
	var bolFound = false;
	try{
		oggetto = document.getElementById(elementId);
		if (oggetto){
			for (i=0;i<oggetto.length;i++){
				if  (oggetto.options.item(i).text.toString()==value){
					bolFound = true;
					break;
				}
			}
		}
	}
	catch(e){
		alert("containElementByText - Error: " + e.description);
	}
	return bolFound;
}


// funzione che rimuove elemento selezionato
function remove_elem_by_sel(elemento)
{
	
	var object;
	
	object = document.getElementById(elemento);
	if (object)
	{
		for(var idx = object.length - 1; idx >= 0; idx--)
		{
			if (object[idx].selected)
			{
				object.options.remove(idx);
			}
		}
	}
}


function remove_elem_by_value(elemento, value){
	
	try{
		object = document.getElementById(elemento);
		if (object){
			for (i=0;i<object.length;i++){
				if (object.options.item(i).value==value){
					object.options.remove(i);
					break;
				}
			}
		}
	}
	catch(e){
		alert("remove_elem_by_value - Error: " + e.description);
	}		
}

// funzione che rimuove l'elemento passandogli l'indice
function remove_elem_by_id(elemento, indice){
	
	var object;

	object = document.getElementById(elemento);
	if (object){
		if (!isNaN(indice)){
			if (indice>-1){
				object.options.remove(indice);
			}
		}
	}
}


// funzione che rimuove tutti gli elementi
function remove_all_elem(elemento)
{
	
	var object;
	var indice;
	
	object = document.getElementById(elemento);
	if (object){
		indice = parseInt(object.length);
		while (indice>-1)
		{
			object.options.remove(indice);
			indice--;
		}
	}
}

// funzione che riempie un combo o listbox passandogli degli 
// array, previa azzeramento del combo.
// NB NON è necessario fornire numCaratteri e suffixString
// in tal caso fuziona in modo classico
function fill_select(elemento, arrayValue,arrayDescr, numCaratteri, suffixString)
{
	var i;
	var num_elementi = 0;
	var object;
	
	// controllo che non ci siano differenze di dimensioni
	if (arrayValue.length != arrayDescr.length){
		alert("Error on array's size");
		return;
	}
	num_elementi = arrayValue.length;
	i = num_elementi;
	object = document.getElementById(elemento);
	if (object){
		while (i>-1)
		{
			object.options.remove(i);
			i--;
		}
		//carico descr esami - ci vuole un flag per cod + descr o solo descr
		for (i=0; i<num_elementi; i++)
		{
			var oOption = document.createElement("Option");
			if (!isNaN(numCaratteri)){
				oOption.text = limitazioneTesto(arrayDescr[i],numCaratteri, suffixString);
			}
			else{
				oOption.text = arrayDescr[i];
			}
			oOption.title = arrayDescr[i];
			oOption.value = arrayValue[i];
			object.add(oOption);
		}
	}
}


// uguale alla precedente
// ma aggiunge un option vuoto
// funzione duplicata(senza aggiungere parametro
// alla precedente) per evitare che codice pre esistente
// mal funzionasse
function fill_selectWithEmptyOption(elemento, arrayValue,arrayDescr, numCaratteri, suffixString)
{
	var i;
	var num_elementi = 0;
	var object;
	var oOption;
	
	// controllo che non ci siano differenze di dimensioni
	if (arrayValue.length != arrayDescr.length){
		alert("Error on array's size");
		return;
	}
	num_elementi = arrayValue.length;
	i = num_elementi;
	object = document.getElementById(elemento);
	if (object){
		while (i>-1)
		{
			object.options.remove(i);
			i--;
		}
		oOption = document.createElement("Option");
		oOption.text =  "";
		oOption.value = "";
		object.add(oOption);		
		//carico descr esami - ci vuole un flag per cod + descr o solo descr
		for (i=0; i<num_elementi; i++)
		{
			oOption = document.createElement("Option");
			if (!isNaN(numCaratteri)){
				oOption.text = limitazioneTesto(arrayDescr[i],numCaratteri, suffixString);
			}
			else{
				oOption.text = arrayDescr[i];
			}
			oOption.title = arrayDescr[i];			
			oOption.value = arrayValue[i];
			object.add(oOption);
		}
	}
}

// funzione che riempie un combo o listbox passandogli degli 
// array, previa azzeramento del combo.
// Si differenzia dal precedente perchè 
// durante il caricamento effettua una scelta
// sull'option da caricare o meno
// indiceArrayPerControllo: vale o 0 o 1 (indica se il
// controllo deve essere effettuato su arrayValue o arrayDescr )
// flgInside: vale true se si vuole ricercare all'interno o meno
// valoreConfronto: valore col quale effettuare il controllo
// flgCaseSensitive: vale true se si vuole tenere conto del case sensitive
//
// *** ATTENZIONE *** Verificare se il controllo == è case sensitive
function fill_selectWithCheck(elemento, arrayValue,arrayDescr, indiceArrayPerControllo,flgInside, valoreConfronto, flgCaseSensitive, numCaratteri, suffixString)
{
	var i;
	var num_elementi = 0;
	var object;
	var bolTrovato = false;
	var arrayToCompare = null;
	// controllo che non ci siano differenze di dimensioni
	if (arrayValue.length != arrayDescr.length){
		alert("Error on array's size");
		return;
	}
	num_elementi = arrayValue.length;
	i = num_elementi;
	object = document.getElementById(elemento);
	if (object){
		while (i>-1)
		{
			object.options.remove(i);
			i--;
		}
		//carico descr esami - ci vuole un flag per cod + descr o solo descr
		for (i=0; i<num_elementi; i++)
		{
			// resetto variabili
			bolTrovato = false;
			arrayToCompare = null;
			// ****
			if (parseInt(indiceArrayPerControllo)==0){
				// lavoro su arrayValue 
				arrayToCompare = arrayValue;
			}
			else{
				// lavoro su arrayDescr 	
				arrayToCompare = arrayDescr;				
			}
			if (flgInside){
				if (flgCaseSensitive){
					if(arrayToCompare[i].toString().indexOf(valoreConfronto.toString())>-1){
						bolTrovato = true;
					}
					else{
						bolTrovato = false;
					}					
				}
				else{
					if(arrayToCompare[i].toString().toUpperCase().indexOf(valoreConfronto.toString().toUpperCase())>-1){
						bolTrovato = true;
					}
					else{
						bolTrovato = false;
					}					
				}
			}
			else{
				// match preciso
				if (flgCaseSensitive){
					if (arrayToCompare[i].toString()==valoreConfronto.toString()){
						bolTrovato = true;
					}
					else{
						bolTrovato = false;						
					}
				}
				else{
					if (arrayToCompare[i].toString().toUpperCase()==valoreConfronto.toString().toUpperCase()){
						bolTrovato = true;
					}
					else{
						bolTrovato = false;						
					}					
				}
			}
			
			// effettuo controllo
			if (bolTrovato){
				var oOption = document.createElement("Option");
				if (!isNaN(numCaratteri)){
					oOption.text = limitazioneTesto(arrayDescr[i],numCaratteri, suffixString);
				}
				else{
					oOption.text = arrayDescr[i];
				}
				oOption.title = arrayDescr[i];				
				oOption.value = arrayValue[i];
				object.add(oOption);
			}
		}
	}
}



// funzione che riempie un combo o listbox passandogli degli 
// array, previa azzeramento del combo.
// uguale al metodo precedente con un 
// flag in + che indica (se true) di NON caricare
// le option con codice vuoto
function fill_select_NoEmptyCodeOption(elemento, arrayValue,arrayDescr, addEmptyCodeElement)
{
	var i;
	var num_elementi = 0;
	var object;
	
	
	try{
		if (addEmptyCodeElement!=true){
			fill_select (elemento, arrayValue, arrayDescr);
			return;
		}
		// controllo che non ci siano differenze di dimensioni
		if (arrayValue.length != arrayDescr.length){
			alert("Error on array's size");
			return;
		}
		num_elementi = arrayValue.length;
		i = num_elementi;
		object = document.getElementById(elemento);
		
		if (object){
			while (i>-1)
			{
				object.options.remove(i);
				i--;
			}
			//carico descr esami - ci vuole un flag per cod + descr o solo descr
			for (i=0; i<num_elementi; i++)
			{
				if ((arrayValue[i]!="")&&(arrayValue[i]!="''")){
					var oOption = document.createElement("Option");
					oOption.text = arrayDescr[i];
					oOption.value = arrayValue[i];
					oOption.title = arrayDescr[i];				
					object.add(oOption);
				}
			}
		}
	}
	catch(e){
		alert("fill_select_NoEmptyCodeOption - Error: " + e.description);
	}
}

function fillSelectViaJson(elemento, arrayJson,valuePropName, descrPropName, selPropName){
	var i;
	var object;
	var bolSelected = false;
	try{
		object = document.getElementById(elemento);
		if (object){
			for (var i = 0; i < arrayJson.length; i++) {
				var oOption = document.createElement("Option");
				oOption.text = eval("arrayJson[i]." + descrPropName);
				oOption.title = eval("arrayJson[i]." + descrPropName);
				oOption.value = eval("arrayJson[i]." + valuePropName);
				bolSelected = eval("arrayJson[i]." + selPropName);
				alert (i + " - " + bolSelected);
				if (bolSelected){
					oOption.selected = true;
				}
				object.add(oOption);			
			}
		}
	}
	catch(e){
		alert("fillSelectViaJson - Error: " + e.description);
	}	
}


// funzione che aggiunge elemento al combo
// è permesso anche l'inserimento di elementi vuoti
//@deprecated
function add_elem(elemento, valore, testo, cod_decValue)
{
	var object;
	try
	{
		object = document.getElementById(elemento);
		if (object){
			var oOption = document.createElement("Option");
			oOption.text = testo;
			oOption.value = valore;
			oOption.title = testo;
			if (typeof(cod_decValue)!="undefined"){
				// aggiungo codice 
				oOption.setAttribute("cod_dec", cod_decValue);
			}			
			object.add(oOption);
		}
	}
	catch(e){
		alert("add_elem - Error: " + e.description);
	}	
}

// funzione che aggiunge elemento al combo
// è permesso anche l'inserimento di elementi vuoti
// specificando anche la classe
//@deprecated
function add_elem(elemento, valore, testo, classe, cod_decValue)
{
	var object;
	try{
		object = document.getElementById(elemento);
		if (object){
			var oOption = document.createElement("Option");
			oOption.text = testo;
			oOption.value = valore;
			try{oOption.className = classe;}catch(e){;}
			if (typeof(cod_decValue)!="undefined"){
				// aggiungo codice 
				oOption.setAttribute("cod_dec", cod_decValue);
			}				
			oOption.title = testo;		
			object.add(oOption);
		}
	}
	catch(e){
		alert("add_elem with class - Error: " + e.description);
	}		
}

// analoga alla precedente con in più il title
function add_elem(elemento, valore, testo, classe, titolo, cod_decValue)
{
	var object;
	try{
		object = document.getElementById(elemento);
		if (object){
			var oOption = document.createElement("Option");
			oOption.text = testo;
			oOption.value = valore;
			if (typeof(cod_decValue)!="undefined"){
				// aggiungo codice 
				oOption.setAttribute("cod_dec", cod_decValue);
			}				
			if (classe!="undefined" && typeof(classe) != "undefined" && classe!=""){
				try{oOption.className = classe;}catch(e){;}
			}
			if (titolo!="undefined" && typeof(titolo) != "undefined" && titolo!=""){
				oOption.title = titolo;		
			}
			else{
				oOption.title = testo;		
			}
			object.add(oOption);
		}
	}
	catch(e){
		alert("add_elem with class and title - Error: " + e.description);
	}		
}

// funzione che aggiunge gli elementi selezionati in una listbox 
// ad un altra listbox. E' possibile specificare se rimuovere
// o meno l'elemento dalla listbox d'origine
// Il parametro rimozione è un booleano. true: rimuovi sorgente   false: NON rimuovi

function add_selected_elements(elementoOrigine, elementoDestinazione, rimozione){
	
	var objectSource;
	var objectTarget;
	var num_elementi=0;
	var i=0;
	
	var valore_iden, valore_descr;

	try{
		objectSource = document.getElementById(elementoOrigine);
		objectTarget = document.getElementById(elementoDestinazione);
		if ((objectSource)&&(objectTarget)){
			num_elementi = objectSource.length ;
			for (i=0;i<num_elementi;i++)
			{
				if (objectSource[i].selected)
				{
					valore_iden = objectSource.options.item(i).value;
					valore_descr = objectSource.options.item(i).text;
					var oOption = document.createElement("Option");
					oOption.text = valore_descr;
					oOption.value = valore_iden;
					oOption.title = valore_descr;					
					objectTarget.add(oOption);
					// rimuovo elemento
					if (rimozione==true){
						remove_elem_by_id(elementoOrigine,i);
						i--;
						num_elementi--;
					}
				}
			}
		}
	}
	catch(e){
		alert("add_selected_elements - Error: " + e.description);
	}
}




// ritorna il value dell'elemento selezionato
function getValue(elemento){
	
	var outString = "";
	
	var object;
	try{
		object = document.getElementById(elemento);
		if (object){
			if (object.selectedIndex !=-1)
			{
				outString = object.options.item(object.selectedIndex).value;
			}
		}
	}
	catch(e){
		alert("getValue - Error: " + e.description);
	}	
	return outString;
}

// ritorna il testo dell'elemento selezionato
function getText(elemento){
	
	var outString = "";
	
	var object;

	try{
		object = document.getElementById(elemento);
		if (object){
			if (object.selectedIndex !=-1)
			{	
				outString = object.options.item(object.selectedIndex).text;
			}
		}
	}
	catch(e){
		alert("getValue - Error: " + e.description);
	}	
	return outString;
}

// ritorna tutti i codici delle option del tag select
// splittati dal carattere *
function getAllOptionCode(elemento){
	var i;
	var object;
	var outString = "";	
	
	try{
		object = document.getElementById(elemento);
		if (object){
			for (i=0;i<object.length;i++){
				if (outString==""){
						outString = object.options.item(i).value.toString();
				}
				else{
						outString = outString.toString() + "*" + object.options.item(i).value.toString() ;					
				}
			}
		}
	}
	catch(e){
		alert("getAllOptionCode - Error: " + e.description);
	}		
	return outString;
}


// ritorna tutti i codici delle option *selezionati* del tag select
// splittati dal carattere *
function getAllSelectedOptionCode(elemento){
	var i;
	var object;
	var outString = "";	

	try{
		object = document.getElementById(elemento);
		if (object){
			for (i=0;i<object.length;i++){
				if (object.options.item(i).selected){
					if (outString==""){
							outString = object.options.item(i).value.toString();
					}
					else{
							outString = outString.toString() + "*" + object.options.item(i).value.toString() ;					
					}
				}
			}
		}
	}
	catch(e){
		alert("getAllSelectedOptionCode - Error: " + e.description);
	}			
	return outString;
}


// ritorna tutti i codici delle option *selezionati* del tag select
// splittati dal carattere *
function getAllSelectedOptionCodeWithSplitElement(elemento, splitElement){
	var i;
	var object;
	var outString = "";	
	
	if (splitElement==""){splitElement="*";}
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (object.options.item(i).selected){
				if (outString==""){
						outString = object.options.item(i).value;
				}
				else{
						outString = outString + splitElement + object.options.item(i).value;					
				}
			}
		}
	}
	return outString;
}

// ritorna tutti le descrizioni delle option *selezionati* del tag select
// splittati dal carattere *
function getAllSelectedOptionText(elemento){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (object.options.item(i).selected){			
				if (outString==""){
						outString = object.options.item(i).text;
				}
				else{
						outString = outString + "*" +object.options.item(i).text;					
				}
			}
		}
	}
	return outString;
}



// ritorna tutti i codici delle option del tag select
// splittati dal carattere specificato
// se non viene specificato nulla verrà usato "*"
function getAllOptionCodeWithSplitElement(elemento, splitElement){
	var i;
	var object;
	var outString = "";
	
	if (splitElement==""){splitElement="*";}
	object = document.getElementById(elemento);
	
	if (object){
		for (i=0;i<object.length;i++){
			if (outString==""){
					outString = object.options.item(i).value;
			}
			else{
					outString = outString + splitElement + object.options.item(i).value;					
			}
		}
	}
	return outString;
}

// ritorna tutti le descrizioni delle option del tag select
// splittati dal carattere *
function getAllOptionText(elemento){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (outString==""){
					outString = object.options.item(i).text;
			}
			else{
					outString = outString + "*" +object.options.item(i).text;					
			}
		}
	}
	return outString;
}


// ritorna tutti le descrizioni delle option del tag select
// splittati dal carattere  specificato
// se non viene specificato nulla verrà usato "*"
function getAllOptionTextWithSplitElement(elemento, splitElement){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (outString==""){
					outString = object.options.item(i).text;
			}
			else{
					outString = outString + splitElement +object.options.item(i).text;					
			}
		}
	}
	return outString;
}


function getTextByValue(elemento, valoreValue){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			//alert("valore iesimo " + object.options.item(i).value + ", valore richiesto:" + valoreValue);
			if (object.options.item(i).value==valoreValue){
					outString = object.options.item(i).text;
					break;
			}
		}
	}
	return outString;
}


// funzione che seleziona un elemento
// attrverso il suo codice
function selectOptionByValue(elemento, valoreValue){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			//alert("valore iesimo " + object.options.item(i).value + ", valore richiesto:" + valoreValue);
			if (object.options.item(i).value==valoreValue){
					object.options.item(i).selected = true;
					break;
			}
		}
	}	
}


// funzione che seleziona un elemento
// attrverso la sua descrizione
function selectOptionByText(elemento, valoreText){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (object.options.item(i).text==valoreText){
					object.options.item(i).selected = true;
					break;
			}
		}
	}		
}


function updateTextSelectedByText(elemento, newText, oldText){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (object.options.item(i).text==oldText){
					object.options.item(i).text = newText;
					break;
			}
		}
	}		
}

function updateValueSelectedByValue(elemento, newValue, oldValue){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (object.options.item(i).value==oldValue){
					object.options.item(i).value = newValue;
					break;
			}
		}
	}		
}


// funzione che seleziona *tutti* gli
// elementi del combo
function selectAllElement(elemento){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	for (i=0;i<object.length;i++){	
		if (object){
			object.options.item(i).selected = true;
		}	
	}
}

// funzione che DEseleziona  *tutti* gli
// elementi del combo
function deSelectAllElement(elemento){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	for (i=0;i<object.length;i++){
		if (object){
			object.options.item(i).selected = false;
		}	
	}
}


// sposta l'option selezionata di STEP posozioni
// il parametro STEP può essere positivo o negativo
function moveUpDownElement(elemento,step){
	
	var object;
	var tmpValue;
	var tmpText;
	var dimensioneListBox;
	var nuovaPosizione;
	var indiceSelezionato;
	
	object = document.getElementById(elemento);
	if (object){
		dimensioneListBox = object.length;		
		// controllo se esiste un elemento selezionato
		if (object.selectedIndex !=-1){
			indiceSelezionato = object.selectedIndex;
			// controllo di non essere fuori dai limiti
			nuovaPosizione = object.selectedIndex + step;
			if ((nuovaPosizione>=0) && (nuovaPosizione<dimensioneListBox)){
				// sono nei limiti
				// salvo valore dell'option che verrà sovrascritto
				tmpText = object.options.item(nuovaPosizione).text;
				tmpValue =  object.options.item(nuovaPosizione).value;
				// sovrascrivo con nuovi valori
				object.options.item(nuovaPosizione).text = object.options.item(indiceSelezionato).text;
				object.options.item(nuovaPosizione).value = object.options.item(indiceSelezionato).value;				
				// effettuo scambio
  			    object.options.item(indiceSelezionato).text = tmpText;
				object.options.item(indiceSelezionato).value = tmpValue;
				// riposiziono selezione su nuovo indice
				object.selectedIndex = nuovaPosizione;
			}
		}
	}
	
}


// funzione che limita la dimensione
// di una stringa a "numCaratteri" e
// in coda appende suffixString
function limitazioneTesto(valore, numCaratteri, suffixString){
	
	var strOutput="";
	var appendoSuffisso = false;
	
	if (isNaN(numCaratteri)){
		return valore;
	}
	try{
		if (parseInt(valore.toString().length) <= parseInt(numCaratteri)){
			appendoSuffisso = false;
		}
		else{
			appendoSuffisso = true;
		}
		if (appendoSuffisso){
			strOutput = valore.substr(0,numCaratteri) + suffixString;
		}
		else{
			strOutput = valore;
		}
	}
	catch(e){
		strOutput = valore;
	}
	return strOutput;
	
}

// partendo da un XmlDoc 
// viene riempito un combo referenziato tramite elemId
// "chiave" indica quale tag deve essere preso per settare il value dell'option
// "valore" indica quale tag deve essere preso per settare la descrizione dell'option
// *** ATTENZIONE questa funzione si basa sull'uso di XML2DB
// verranno riempiti 2 vettori per richiamare poi il metodo base fill_select
function fill_selectFromXmlDoc (xmlDoc,elemId, chiave, valore, numCaratteri, suffixString){
	
	var oggetto;
	var arrayCode;
	var arrayDescr;

	var chiaveTagObj;
	var chiaveValue;
	var valoreTagObj;
	var valoreValue	;
	
	var rowTagObj;
	var i=0;
	
	var strCode = "";
	var strDescr = "";
	
	
	oggetto = document.getElementById(elemId);
	if (oggetto){
		// esiste combo
		try{
			if (xmlDoc){
				// webuser
				rowTagObj = xmlDoc.getElementsByTagName("ROW");
				if (rowTagObj){
					
					for (i=0; i < rowTagObj.length; i++){
						// ciclo nelle righe
						// chiave
						chiaveTagObj = rowTagObj[i].getElementsByTagName(chiave)[0];
						chiaveValue = chiaveTagObj.childNodes[0].nodeValue;
						if (strCode==""){
							strCode = chiaveValue;
						}
						else{
							strCode = strCode + "@@" + chiaveValue;
						}
						// descrizione
						valoreTagObj = rowTagObj[i].getElementsByTagName(valore)[0];
						valoreValue = valoreTagObj.childNodes[0].nodeValue;
						if (strDescr==""){
							strDescr = valoreValue;
						}
						else{
							strDescr = strDescr + "@@" + valoreValue;
						}
					}
					// creo array
					arrayCode = strCode.split("@@");
					arrayDescr = strDescr.split("@@");
					fill_select(elemId, arrayCode,arrayDescr, numCaratteri, suffixString);
				}
			}
		}
		catch(e){
			alert("fill_selectFromXmlDoc - Error: " + e.description);
		}
	}
}

function fill_selectFromResultSet (rs,elemId, chiave, valore, numCaratteri, suffixString, cod_decValue){
	if (document.getElementById(elemId)){
		try{
//						alert(testo + " " + valore);
			while (rs.next()){
				if (numCaratteri == -1){
					// nessuna limitazione
					/* vecchio codice
					try{
						add_elem(elemId, rs.getString(chiave), rs.getString(valore),  rs.getString(cod_decValue));
					}catch(e){
						add_elem(elemId, rs.getString(chiave), rs.getString(valore));						
					}
					*/
					try{
						add_elem(elemId, rs.getString(chiave), rs.getString(valore), "", rs.getString(valore), rs.getString(cod_decValue));
					}catch(e){
						add_elem(elemId, rs.getString(chiave), rs.getString(valore));						
					}
					
				}
				else{
					
					try{
						add_elem(elemId, rs.getString(chiave), limitazioneTesto(rs.getString(valore),numCaratteri, suffixString),"",rs.getString(valore),rs.getString(cod_decValue));	
					}catch(e){
						add_elem(elemId, rs.getString(chiave), limitazioneTesto(rs.getString(valore),numCaratteri, suffixString),"",rs.getString(valore));							
					}

					/* vecchio codice
					try{
						add_elem(elemId, rs.getString(chiave), limitazioneTesto(rs.getString(valore),numCaratteri, suffixString, rs.getString(cod_decValue)));
					}catch(e){
						add_elem(elemId, rs.getString(chiave), limitazioneTesto(rs.getString(valore),numCaratteri, suffixString));
					}
					*/
				}
			}
		}catch(e){	alert("fill_selectFromResultSet - Error: " + e.description);}
	}
}



function fill_selectFromXmlDocWithBlankOption (xmlDoc,elemId, chiave, valore, numCaratteri, suffixString){
	
	var oggetto;
	var arrayCode;
	var arrayDescr;

	var chiaveTagObj;
	var chiaveValue;
	var valoreTagObj;
	var valoreValue;
	
	var rowTagObj;
	var i=0;
	
	var strCode = "";
	var strDescr = "";
	
	
	oggetto = document.getElementById(elemId);
	if (oggetto){
		// esiste combo
		try{
			if (xmlDoc){
				// webuser
				rowTagObj = xmlDoc.getElementsByTagName("ROW");
				if (rowTagObj){
					
					for (i=0; i < rowTagObj.length; i++){
						// ciclo nelle righe
						// chiave
						chiaveTagObj = rowTagObj[i].getElementsByTagName(chiave)[0];
						chiaveValue = chiaveTagObj.childNodes[0].nodeValue;
						if (strCode==""){
							strCode = chiaveValue;
						}
						else{
							strCode = strCode + "@@" + chiaveValue;
						}
						// descrizione
						valoreTagObj = rowTagObj[i].getElementsByTagName(valore)[0];
						valoreValue = valoreTagObj.childNodes[0].nodeValue;
						if (strDescr==""){
							strDescr = valoreValue;
						}
						else{
							strDescr = strDescr + "@@" + valoreValue;
						}
					}
					// creo array
					arrayCode = strCode.split("@@");
					arrayDescr = strDescr.split("@@");
					fill_selectWithEmptyOption(elemId, arrayCode,arrayDescr, numCaratteri, suffixString);
				}
			}
		}
		catch(e){
			alert("fill_selectFromXmlDocWithBlankOption - Error: " + e.description);
		}
	}
}


function fill_selectFromResultSetWithBlankOption (rs,elemId, chiave, valore, numCaratteri, suffixString, cod_decValue){
	if (document.getElementById(elemId)){
		try{
			add_elem(elemId,"","");
			// che senso ha il beforeFirst ?!?
			try{rs.beforeFirst();}catch(e){;}

			while (rs.next()){
				// function add_elem(elemento, valore, testo, classe, titolo, cod_decValue)
				if (numCaratteri==-1){
					// nessuna limitazione
					try{
						add_elem(elemId, rs.getString(chiave), rs.getString(valore),"","",rs.getString(cod_decValue));					
					}catch(e){
						add_elem(elemId, rs.getString(chiave), rs.getString(valore),"","");											
					}
					
				}
				else{
					try{
						add_elem(elemId, rs.getString(chiave), limitazioneTesto(rs.getString(valore),numCaratteri, suffixString),"",rs.getString(valore),rs.getString(cod_decValue));	
					}catch(e){
						add_elem(elemId, rs.getString(chiave), limitazioneTesto(rs.getString(valore),numCaratteri, suffixString),"",rs.getString(valore));							
					}
				}
			}
		}catch(e){	alert("fill_selectFromResultSetWithBlankOption - Error: " + e.description);}
	}
}



// funzione che carica un combo
// passando attraverso una select
// ATTENZIONE si basa sulla funzione
// getXMLData inclusa in xmlHttpRequestHandler.js
// che si basa su XML2DB
var varSelectFromSqlViaXml_elemId = "";
var varSelectFromSqlViaXml_chiave = "";
var varSelectFromSqlViaXml_valore = "";
var varSelectFromSqlViaXml_numCaratteri = "";
var varSelectFromSqlViaXml_suffixString = "";

function fill_selectFromSqlViaXml(sql,elemId, chiave, valore, numCaratteri, suffixString){
	try{
		// setto variabili globali
		// affinchè possono essere usate
		// dalla callback
		varSelectFromSqlViaXml_elemId = elemId;
		varSelectFromSqlViaXml_chiave = chiave;
		varSelectFromSqlViaXml_valore = valore;
		varSelectFromSqlViaXml_numCaratteri = numCaratteri;
		varSelectFromSqlViaXml_suffixString = suffixString;
//		alert(parseSql(sql));
		getXMLData("",parseSql(sql),"callBackFillSelectFromSqlViaXml");		
	}
	catch(e){
		alert("fill_selectFromSqlViaXml - Error: " + e.description);
	}
}

// *************************************
function callBackFillSelectFromSqlViaXml(xmlDoc){
	try{
		if (xmlDoc){
			fill_selectFromXmlDoc(xmlDoc,varSelectFromSqlViaXml_elemId, varSelectFromSqlViaXml_chiave,varSelectFromSqlViaXml_valore, varSelectFromSqlViaXml_numCaratteri, varSelectFromSqlViaXml_suffixString);
			
		}
	}
	catch(e){
		alert("callBackFillSelectFromSqlViaXml - Error: " + e.description);
	}	
}



// funzione che passatole l'xmlDoc
// e il nome del tag xml ritorna
// tutti i relativi valori splittati da splitElement
// *** ATTENZIONE questa funzione si basa sull'uso di XML2DB
function getValueXmlTagViaXmlDoc(xmlDoc, chiave, splitElement){
	
	var strOutput = "";
	
	try{
		if (xmlDoc){
			// webuser
			rowTagObj = xmlDoc.getElementsByTagName("ROW");
			if (rowTagObj){
				for (i=0; i < rowTagObj.length; i++){
					// ciclo nelle righe
					// chiave
					chiaveTagObj = rowTagObj[i].getElementsByTagName(chiave)[0];
					chiaveValue = chiaveTagObj.childNodes[0].nodeValue;
					if (strOutput==""){
						strOutput = chiaveValue;
					}
					else{
						strOutput = strOutput + splitElement + chiaveValue;
					}
				}
			}
		}	
	}
	catch(e){
		alert("getValueXmlTagViaXmlDoc - Error: " + e.description);
	}	
	return strOutput;
}





// uguale a fill_selectFromSqlViaXml
// MA inserisce come primo valore un option vuoto
function fill_selectFromSqlViaXmlWithBlankOption(sql,elemId, chiave, valore, numCaratteri, suffixString){
	try{
		// setto variabili globali
		// affinchè possono essere usate
		// dalla callback
		varSelectFromSqlViaXml_elemId = elemId;
		varSelectFromSqlViaXml_chiave = chiave;
		varSelectFromSqlViaXml_valore = valore;
		varSelectFromSqlViaXml_numCaratteri = numCaratteri;
		varSelectFromSqlViaXml_suffixString = suffixString;
//		alert(parseSql(sql));
		getXMLData("",parseSql(sql),"callBackFillSelectFromSqlViaXmlWithBlankOption");		
	}
	catch(e){
		alert("fill_selectFromSqlViaXmlWithBlankOption - Error: " + e.description);
	}
}

// *************************************
function callBackFillSelectFromSqlViaXmlWithBlankOption(xmlDoc){
	try{
		if (xmlDoc){
			fill_selectFromXmlDocWithBlankOption(xmlDoc,varSelectFromSqlViaXml_elemId, varSelectFromSqlViaXml_chiave,varSelectFromSqlViaXml_valore, varSelectFromSqlViaXml_numCaratteri, varSelectFromSqlViaXml_suffixString);
			
		}
	}
	catch(e){
		alert("callBackFillSelectFromSqlViaXmlWithBlankOption - Error: " + e.description);
	}	
}


/*
function che valorizza un campo nascosto con i value del listbox di interesse 
id_sorgente= id del listbox
id_destinazione = id dell'hinput di destinazione
*/
function aggiornaInputValue(id_sorgente,id_destinazione)

{
	try{
		campo_hidden_destinazione = document.all[id_destinazione];
		elemento_sorgente = document.all[id_sorgente];
		campo_hidden_destinazione.value="";
		for (var i=0;i<elemento_sorgente.length;i++){
		   campo_hidden_destinazione.value+="'"+elemento_sorgente.options[i].value+"',";
		}
		campo_hidden_destinazione.value=campo_hidden_destinazione.value.substring(0,campo_hidden_destinazione.value.length-1);
	}
	catch(e){
		alert("aggiornaInputValue - Error: " + e.description);
	}		
}

function sortSelect(id)
{
	var obj = document.getElementById(id);
	var o 	= new Array();
	
	if(typeof obj != 'undefined')
	{
		for (var i=0; i<obj.options.length; i++)
		{
			o[o.length] = new Option( obj.options[i].text, obj.options[i].value, obj.options[i].defaultSelected, obj.options[i].selected);
		}
		
		o = o.sort( 
					function(a,b)
					{ 
						if((a.text+"") < (b.text+"")){return -1;}
						if((a.text+"") > (b.text+"")){return 1;}
						
						return 0;
					}
				  );
	
		for (var i=0; i<o.length; i++)
		{
			obj.options[i] = new Option(o[i].text, o[i].value, o[i].defaultSelected, o[i].selected);
		}
	}
}