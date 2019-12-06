// ************* FUNCTION IntercettaTasti
function intercetta_tasti(){
	 if (window.event.keyCode==13){
		 window.event.returnValue=false;
		 loadExample();		 
	 }
}



function initGlobalObject(){
	initbaseGlobal();
	initbaseUser();	
	fillLabels(arrayLabelName,arrayLabelValue);
	fillComboCssProfile()
	loadInfoCssProfile();
	
}



function loadInfoCssProfile(){
	
	var codiceSelezionato = "";
	var i
	var object
	var descrizione = "";
	
	codiceSelezionato = getValue("idPersonalCss");
	object = document.getElementById("idPersonalCss");	
	// estrapolo indice corretto per tirar fuori la descrizione
	indiceArray = getRelatedIndexCode(array_codiceCssProfile,codiceSelezionato);
	descrizione = array_descrCssProfile[indiceArray];
	
	
	document.all.lblInfo.innerText = descrizione;

}

function fillComboCssProfile(){
	
	var object
	var indice_selezionato = -1
	var indice_predefinito ;
	var i ;
	
	fill_select("idPersonalCss", array_codiceCssProfile,array_codiceCssProfile);
	// seleziono quello predefinito
	object = document.getElementById("idPersonalCss");	
	if (object){
		for (i=0;i<object.length;i++){
			if (object.options(i).value.toString().toLowerCase()=="default"){
				indice_predefinito = i;
			}
			if (object.options(i).value==baseUser.PERSONALCSS){
				indice_selezionato = i;
				break;
			}
		}		
		if (indice_selezionato==-1){
			// nessun valore selezionato o esistente
			indice_selezionato = indice_predefinito;
		}
		object.selectedIndex = 	indice_selezionato;
	}

}

function loadExample(){
	
	var urlToLoad="";
	
	// carico info nella label
	loadInfoCssProfile()
	urlToLoad = getExampleUrl();
	// quindi carico esempio relativo
	parent.personalCssMainFrame.location.replace (urlToLoad);
	
}


function getExampleUrl(){
	var codiceSelezionato;
	var object
	var indiceArray
	

	codiceSelezionato = getValue("idPersonalCss");
	object = document.getElementById("idPersonalCss");	
	if (object){	
		// estrapolo indice corretto per tirar fuori la descrizione
		indiceArray = getRelatedIndexCode(array_codiceCssProfile,codiceSelezionato);
		return array_urlEsempioCssProfile[indiceArray];
	}
	
}

// funzione che ritorna 
// il relativo indice dell'array in base al
// codice selezioato
function getRelatedIndexCode(nomeArray, codiceSelezionato){
	
	var object
	var i 
	
	// estrapolo indice corretto per tirar fuori la descrizione
	for (i=0;i<nomeArray.length;i++){
		if (nomeArray[i]==codiceSelezionato){
			return i;
			break;
		}
	}

	
}

function salva(){
	
	var codiceSelezionato = "";
	
	// notifica
   	alert(ritornaJsMsg("lblWarning"));
	// **
	codiceSelezionato = getValue("idPersonalCss");	
	document.frmMain.cssProfileCode.value = codiceSelezionato;
	document.frmMain.submit();
	
}


function chiudi(){
	parent.location.replace ("blank");
}