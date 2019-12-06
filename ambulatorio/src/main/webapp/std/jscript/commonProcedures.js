
//JavaScript Document
var myXmlHttpRequest;
var myXmlHttpRequestForData;
var indexDatoTabellato=0;
var lengthDatoTabellato=0;
var collectionDatiTabellati;

//variabile contenente la funzione
// di callback da richiamare dopo
// inizializzazione dei campi
var callBackAfterInitAll = "";
//var idScheda = "";



var esameScheda = new Object();
function initEsame(){
	esameScheda.ANNO = "";
	esameScheda.MESE = "";
	esameScheda.GIORNO = "";	
	esameScheda.DESCRIZIONE = "";
	esameScheda.ORA_ESA = "";
}


var pazienteScheda = new Object();
function initPaziente(){
	pazienteScheda.NOME = "";
	pazienteScheda.COGNOME = "";
	pazienteScheda.ANNO_NASCITA = "";
	pazienteScheda.MESE_NASCITA = "";
	pazienteScheda.GIORNO_NASCITA = "";	
	pazienteScheda.PESO = "";
	pazienteScheda.ALTEZZA = "";
	pazienteScheda.SESSO = "";	 
}


//funzione che carica le info del paziente
//in base al patID
function initPatientInfoByIdenEsa(patID){
	try{
		if (patID=="" ){
			alert("Codice paziente nullo o non valido.");
			return;
		}
		sql = "select cogn, nome, data, sesso, cod_fisc, altezza, peso, descr_esa, dat_esa, ora_esa from VIEW_SCH_CONSOLE_ANAG where (iden=" + patID + ")";
		getXMLData("",parseSql(sql),"processXmlDocumentForPatient");
	}
	catch(e){
		alert("initPatientInfoByIdenEsa - Error: " + e.description);
	}
}

//funzione di callback
function processXmlDocumentForPatient(xmlDoc){

	var cognomeTagObj;
	var nomeTagObj;
	var dataTagObj;
	var codFiscTagObj;
	var pesoTagObj;
	var altezzaObj;
	var descrEsameObj;
	var datEsaObj;
	var sessoTagObj;
	var oraEsaTagObj;

	var cognomeValue = "";
	var nomeValue = "";
	var dataValue = "";
	var codFiscValue = "";
	var pesoValue = "";
	var altezzaValue = "";
	var descrEsameValue = "";
	var datEsaValue = "";
	var sessoValue = "";
	var oraEsaValue = "";

	var paziente ="";
	var k=0;

	try{
		initPaziente();
		if (xmlDoc){
			// COGNOME
			cognomeTagObj = xmlDoc.getElementsByTagName("COGN")[0];
			if (cognomeTagObj){
				cognomeValue = cognomeTagObj.childNodes[0].nodeValue;
				if ((cognomeValue=="null")||(cognomeValue=="undefined")){
					cognomeValue = "";
				}
			}
			pazienteScheda.COGNOME = cognomeValue;
			// NOME
			nomeTagObj = xmlDoc.getElementsByTagName("NOME")[0];
			if (nomeTagObj){
				nomeValue = nomeTagObj.childNodes[0].nodeValue;
				if ((nomeValue=="null")||(nomeValue=="undefined")){
					nomeValue = "";
				}
			}
			pazienteScheda.NOME = nomeValue;
			// data
			dataTagObj = xmlDoc.getElementsByTagName("DATA")[0];
			if (nomeTagObj){
				dataValue = dataTagObj.childNodes[0].nodeValue;
				if ((dataValue=="null")||(dataValue=="undefined")){
					dataValue = "";
				}
				else{
					dataValue = dataValue.substring(6,8) + "/" + dataValue.substring(4,6) + "/" + dataValue.substring(0,4);
				}
			}
			pazienteScheda.ANNO_NASCITA = dataTagObj.childNodes[0].nodeValue.substring(0,4);
			pazienteScheda.MESE_NASCITA = parseInt(dataTagObj.childNodes[0].nodeValue.substring(4,6),10);
			pazienteScheda.GIORNO_NASCITA = parseInt(dataTagObj.childNodes[0].nodeValue.substring(6,8),10);
			// SESSO
			sessoTagObj = xmlDoc.getElementsByTagName("SESSO")[0];
			if (sessoTagObj){
				sessoValue = sessoTagObj.childNodes[0].nodeValue;
				if ((sessoValue=="null")||(sessoValue=="undefined")){
					sessoValue = "";
				}
			}		
			pazienteScheda.SESSO = sessoValue;
			// COD FISC
			codFiscTagObj = xmlDoc.getElementsByTagName("COD_FISC")[0];
			if (codFiscTagObj){
				codFiscValue = codFiscTagObj.childNodes[0].nodeValue;
				if ((codFiscValue=="null")||(codFiscValue=="undefined")){
					codFiscValue = "";
				}
			}
			// PESO
			pesoTagObj = xmlDoc.getElementsByTagName("PESO")[0];
			if (pesoTagObj){
				pesoValue = pesoTagObj.childNodes[0].nodeValue;
				if ((pesoValue=="null")||(pesoValue=="undefined")){
					pesoValue = "";
				}
				// potrebbe non esserci
				try{document.getElementById("PESO").value = pesoValue;}catch(e){;}
			}			
			pazienteScheda.PESO = pesoValue;
			// ALTEZZA 
			altezzaObj = xmlDoc.getElementsByTagName("ALTEZZA")[0];
			if (altezzaObj){
				altezzaValue = altezzaObj.childNodes[0].nodeValue;
				if ((altezzaValue=="null")||(altezzaValue=="undefined")){
					altezzaValue = "";
				}
				try{document.getElementById("ALTEZZA").value = altezzaValue;}catch(e){;}
			}				
			pazienteScheda.ALTEZZA = altezzaValue; 
			// Descr esame
			descrEsameObj = xmlDoc.getElementsByTagName("DESCR_ESA")[0];
			if (descrEsameObj){
				descrEsameValue = descrEsameObj.childNodes[0].nodeValue;
				if ((descrEsameValue=="null")||(descrEsameValue=="undefined")){
					descrEsameValue = "";
				}
			}				
			esameScheda.DESCRIZIONE = descrEsameValue;
			// ************* dat_esa
			datEsaObj = xmlDoc.getElementsByTagName("DAT_ESA")[0];
			if (datEsaObj){
				datEsaValue = datEsaObj.childNodes[0].nodeValue;
				if ((datEsaValue=="null")||(datEsaValue=="undefined")){
					datEsaValue = "";
				}
			}				
			// li tengo numeri per poi usarli per il calcolo delle formule!!
			esameScheda.ANNO = datEsaObj.childNodes[0].nodeValue.substring(0,4).toString();
			esameScheda.MESE = parseInt(datEsaObj.childNodes[0].nodeValue.substring(4,6),10);
			esameScheda.GIORNO = parseInt(datEsaObj.childNodes[0].nodeValue.substring(6,8),10);
			// ORA ESAME
			oraEsaTagObj = xmlDoc.getElementsByTagName("ORA_ESA")[0];
			if (oraEsaTagObj){
				oraEsaValue = oraEsaTagObj.childNodes[0].nodeValue;
				if ((oraEsaValue=="null")||(oraEsaValue=="undefined")){
					oraEsaValue = "";
				}
			}				
			esameScheda.ORA_ESA = oraEsaValue;			
			// **************
			if ((cognomeValue =="") && (nomeValue=="")){
				alert("Errore - Paziente non trovato. Impossibile continuare.");
				top.close();
				return;
			}
			paziente = "<SPAN class='infoPazienteEsame'>"+ cognomeValue + " " + nomeValue + " " + dataValue + "</SPAN> ";
			paziente += "- Esame: <SPAN class='infoPazienteEsame'>" + descrEsameValue + "</SPAN>";
			paziente += " del <SPAN class='infoPazienteEsame'>" + pad(esameScheda.GIORNO,2) +"/" + pad(esameScheda.MESE,2) +"/" + esameScheda.ANNO ;
			paziente += " "+ esameScheda.ORA_ESA +"</SPAN>";;
			// metto a video
			document.getElementById("paziente_" + params.get("scheda")).innerHTML = paziente;
		}
	}
	catch(e){
		alert("processXmlDocumentForPatient " + e.description)
	}
}



//funzione che carica i combo con i dati
function initCombo(){
	// devo ciclare su tutti gli elementi
	// per ogni gruppo
	// quindi SOLO per i nodename di tipo Select
	// caricare i valori dei combo
	var collection
	var i = 0;
	var k = 0;
//	objectNode.nodeName
	var objectNode;
	var sql = "";
	var tipo_dato="";
	var id = "";

	try{
//		collection = getElementsByAttribute(document.body, "*", "gruppo", array_descrizione_gruppi[k]);
		listaCombo = getElementsByAttribute(document.body, "SELECT", "id");
		// nella listaCombo ho tutti gli oggetti combo che
		// devo elaborare
		loadComboViaXml();
	}
	catch(e){
		alert("initCombo - Error: " + e.description);
	}
}

//funzione che chiamerò 1 volta sola
//per caricare i vari combo.
//Ciclerò all'interno dell' XMLdoc
//tenendo traccia del cambiamento di combo
//Verrà richiamata solo DOPO che XMLHTTPrequest ha finito
//il parsing
function loadComboViaXml(){

	var sql = "";
	var i =0;
	var whereTipoScheda = "";

	try{
		myXmlHttpRequest = getHTTPObject();

		sql = "select IDEN, DESCRIZIONE, VALORE_DEFAULT, TIPO_DATO, TIPO_SCHEDA  from tab_codifiche ";
		sql += " where (CODICE_REPARTO='" + parent.topFrame.baseCallerInfo.REPARTO +"' or CODICE_REPARTO = 'ALL') "
		sql += " and ATTIVO='S' and DELETED ='N'";

		for (i=0;i<array_descrizione_gruppi.length;i++){
			if (whereTipoScheda==""){
				whereTipoScheda = "tipo_scheda ='" + array_descrizione_gruppi[i] +"'";
			}
			else{
				whereTipoScheda	= whereTipoScheda + " OR tipo_scheda ='" + array_descrizione_gruppi[i] +"'";
			}
		}
		sql += " and (" + whereTipoScheda + ")";
		sql += " order by TIPO_DATO, DESCRIZIONE, TIPO_SCHEDA";
		//alert(sql);
		/*
		try{
			if (listaCombo[indice].gruppo!=""){
				sql += " AND TIPO_SCHEDA ='" + listaCombo[indice].gruppo +"'";
			}
		}
		catch(e){
			alert("Manca attributo gruppo su: " + listaCombo[indice].id);
		}*/
		//alert(encodeURI(URL_to_call_for_xmlData + parseSql(sql)) );
		// URL_to_call_for_xmlData è definito in xmlHttpRequestHandler.js
		myXmlHttpRequest.open("GET", encodeURI(URL_to_call_for_xmlData + parseSql(sql)) , true);
		myXmlHttpRequest.onreadystatechange = function(){processAfterLoadCombo();};
		myXmlHttpRequest.send(null);
	}
	catch(e){
		alert("loadComboByIndex - Error: " + e.description)
	}
}


function processAfterLoadCombo(){

	var bolError = false;
	var errorObject
	var xmlDoc
	var idOggetto ="";
	var i = 0;

	var oldTipoDato = "";

	var chiaveTagObj
	var chiaveValue
	var valoreTagObj
	var valoreValue

	var checkTagObj ;
	var checkTagValue;
	var tipoDatoTagObj ;
	var tipoDatoTagValue;

	var tipoSchedaTagObj ;
	var tipoSchedaTagValue;

	var rowTagObj
	var elemId
	var collection
	var collectionFiltered

	var contaOption = 0;

	try{
		if (myXmlHttpRequest.readyState==4){
			if (myXmlHttpRequest.status == 200){
				try{
					errorObject = myXmlHttpRequest.responseXML.getElementsByTagName("ERROR")[0];
				}
				catch(e){
					alert("processAfterLoadCombo - Error getting documentElement: " + e.description + "\n" + myXmlHttpRequest.responseText);
				}
				bolError = xmlErrorHandler(errorObject);
				if (bolError){
					// ERRORE
					return;
				}
				myDoc = myXmlHttpRequest.responseXML;
				//			 alert (myXmlHttpRequest.responseText);
				rowTagObj = myDoc.getElementsByTagName("ROW");
				if (rowTagObj){
					for (i=0; i < rowTagObj.length; i++){
						// valore
						chiaveTagObj = rowTagObj[i].getElementsByTagName("IDEN")[0];
						chiaveValue = chiaveTagObj.childNodes[0].nodeValue;
						// descrizione
						valoreTagObj = rowTagObj[i].getElementsByTagName("DESCRIZIONE")[0];
						valoreValue = valoreTagObj.childNodes[0].nodeValue;
						valoreValue = limitazioneTesto(valoreValue,50, "...");
						// tipo_dato
						tipoDatoTagObj = rowTagObj[i].getElementsByTagName("TIPO_DATO")[0];
						tipoDatoTagValue = tipoDatoTagObj.childNodes[0].nodeValue;
						// tipo scheda
						tipoSchedaTagObj = rowTagObj[i].getElementsByTagName("TIPO_SCHEDA")[0];
						tipoSchedaTagValue = tipoSchedaTagObj.childNodes[0].nodeValue;

						// filtro per tipoDato , dovrei filtrare anche per tipo_scheda ATTENZIONE
						collection = getElementsByAttribute(document.body, "SELECT", "TIPO_DATO", tipoDatoTagValue);
						collectionFiltered = new Array();
						try{
							for (var k =0; k<collection.length;k++){
								if (collection[k].gruppo==tipoSchedaTagValue){
									collectionFiltered.push(collection[k]);
								}
							}
						}
						catch(e){
							alert("processAfterLoadCombo - Error filtering by gruppo");
						}
						//****
						// ne deve trovare solo uno !!
						try{
							idOggetto = collectionFiltered[0].id
						}
						catch(e){
							//alert("processAfterLoadCombo - collectionFiltered vuota");
						}

						elemId = document.getElementById(idOggetto);
						if (oldTipoDato==""){
							// primo giro
							oldTipoDato =  tipoDatoTagValue;
							// aggiungo elemento vuoto
							add_elem(idOggetto, "", "");
							contaOption = 1;
						}
						
						// controllo se è di default
						checkTagObj  = rowTagObj[i].getElementsByTagName("VALORE_DEFAULT")[0];
						checkTagValue =  checkTagObj.childNodes[0].nodeValue;
						//alert("chiaveValue: " + chiaveValue +" valoreValue: " + valoreValue +" tipoDatoTagValue: " + tipoDatoTagValue + " checkTagValue: " + checkTagValue);
						// devo controllare se è cambiato combo
						// in tale situazione aggiungo prima un option vuoto
						if(oldTipoDato!=tipoDatoTagValue){
							// aggiungo option
							add_elem(idOggetto, "", "");
							contaOption	= 1;
							// risetto valore
							oldTipoDato = tipoDatoTagValue;
						}
						// aggiungo option
						add_elem(idOggetto, chiaveValue, valoreValue);
						contaOption ++;
						if (checkTagValue=="S"){
							// setto valore di default
							elemId[contaOption -1].selected = true;
						}
					}  // fine ciclo su FOR
				}// fine if su rowTagObj

				myXmlHttpRequest = null;
				if (functionToCallHttpRequest!=""){
					eval(functionToCallHttpRequest);
				}
			} // fine controllo XMLHTTP
		}// fine controllo XMLHTTP
	}
	catch(e){
		alert("processAfterLoadCombo - Error: " + e.description);
		chiudiThickBox()();
	}

}

function PreCaricaDatiTabellati(){
	collectionDatiTabellati = getElementsByAttribute(document.body, "*", "type", "hidden");
	lengthDatoTabellato=collectionDatiTabellati.length;
	indexDatoTabellato=0;
	if (lengthDatoTabellato>0)
		CaricaDatiTabellati(indexDatoTabellato);

}

function CaricaDatiTabellati(indice){

	try{
		//alert(collectionDatiTabellati[indice].tabella + '/' + collectionDatiTabellati[indice].value + '/' + collectionDatiTabellati[indice].id + '/' + indice)
		if (collectionDatiTabellati[indice].tabella  !=undefined && collectionDatiTabellati[indice].value +''!=''){
			sql = "select * from " + collectionDatiTabellati[indice].tabella + " where iden=" + collectionDatiTabellati[indice].value;	

			myXmlHttpRequestForData = getHTTPObject();
			//alert(URL_to_call_for_xmlData + parseSql(sql));
			myXmlHttpRequestForData.open("GET", encodeURI(URL_to_call_for_xmlData + parseSql(sql)) , true);
			myXmlHttpRequestForData.onreadystatechange = function(){processAfterCaricaDatiTabellati();};
			myXmlHttpRequestForData.send(null);

		}else if(lengthDatoTabellato>indice+1){
			indexDatoTabellato++;
			CaricaDatiTabellati(indexDatoTabellato);
		}
	}
	catch(e){
		alert("CaricaDatiTabellati -  error: " + e.description);
	}

}

function processAfterCaricaDatiTabellati(){
	var myXmlDoc
	var errorObject
	var bolError
	var valoreGruppo = "";

	try{

		if (myXmlHttpRequestForData.readyState==4){
			if (myXmlHttpRequestForData.status == 200){

				myXmlDoc = myXmlHttpRequestForData.responseXML;
				//alert(myXmlHttpRequestForData.responseText);
				try{
					errorObject = myXmlHttpRequestForData.responseXML.getElementsByTagName("ERROR")[0];
				}
				catch(e){
					alert("processAfterCaricaDatiTabellati - Error getting documentElement: " + e.description + "\n" + myXmlHttpRequest.responseText);
				}
				bolError = xmlErrorHandler(errorObject);
				if (bolError){
					// ERRORE
					return;
				}
//				****************************************************************************************************************


				if (collectionDatiTabellati[indexDatoTabellato].idCodice!=undefined && collectionDatiTabellati[indexDatoTabellato].idCodice + "" != ""){
					valore = getTagXmlValue(myXmlDoc, "COD_DEC");
					if (valore != "null"){
						document.getElementById(collectionDatiTabellati[indexDatoTabellato].idCodice).value=valore
					}
				}

				if (collectionDatiTabellati[indexDatoTabellato].idDescr!=undefined && collectionDatiTabellati[indexDatoTabellato].idDescr + "" != ""){
					valore = getTagXmlValue(myXmlDoc, "DESCR");
					if (valore != "null"){
						document.getElementById(collectionDatiTabellati[indexDatoTabellato].idDescr).value=valore
					}
				}

//				****************************************************************************************************************
				indexDatoTabellato++;
				if (indexDatoTabellato<lengthDatoTabellato){

					CaricaDatiTabellati(indexDatoTabellato);
				}
			}
		}
	}
	catch(e){
		alert("processAfterCaricaDatiTabellati - error: " + e.description);
	}
}

function caricaDatiTabulatore(nomeScheda, idenScheda, idenEsame){

	var sql = "";
	var valoreGruppo = "";
	var myId ="";

	try{
		if (idenScheda!=""){
			// modifica, quindi carico i dati già presenti
			sql = "select * from " + nomeScheda;
			sql += " where iden = " + idenScheda;
			
			myXmlHttpRequestForData = getHTTPObject();
			//		alert(URL_to_call_for_xmlData + parseSql(sql));
			myXmlHttpRequestForData.open("GET", encodeURI(URL_to_call_for_xmlData + parseSql(sql)) , true);
			myXmlHttpRequestForData.onreadystatechange = function(){processAfterCaricaDatiTabulatore();};
			myXmlHttpRequestForData.send(null);
		}
		else{
			// ATTENZIONE !!!!!! 
			// se la scheda NON esiste DEVO
			// comunque eseguire eventuale callback
			if (callBackAfterInitAll!=""){
				try{eval(callBackAfterInitAll);}catch(e){;}
				callBackAfterInitAll = "";
			}			
		}

	}
	catch(e){
		alert("caricaDatiTabulatore - error: " + e.description);
		lastIndexToProcess = 0;
	}
}


function processAfterCaricaDatiTabulatore(){

	var myXmlDoc
	var errorObject
	var bolError
	var valoreGruppo = "";

	try{

		if (myXmlHttpRequestForData.readyState==4){
			if (myXmlHttpRequestForData.status == 200){
				try{
					valoreGruppo = array_descrizione_gruppi[parseInt(lastIndexToProcess)];
				}
				catch(e){
					alert ("Errore non esiste gruppo indice: " + lastIndexToProcess);
					lastIndexToProcess = 0;
					return;
				}
				myXmlDoc = myXmlHttpRequestForData.responseXML;
				//alert(myXmlHttpRequestForData.responseText);
				// devo gestire errore
				try{
					errorObject = myXmlHttpRequestForData.responseXML.getElementsByTagName("ERROR")[0];
				}
				catch(e){
					alert("processAfterCaricaDatiTabulatore - Error getting documentElement: " + e.description + "\n" + myXmlHttpRequest.responseText);
				}
				//alert(errorObject.getElementsByTagName("CODE")[0].childNodes[0].nodeValue);
				bolError = xmlErrorHandler(errorObject);
				if (bolError){
					// ERRORE
					return;
				}
				
				// lavoro su tutti gli oggetti del gruppo e ne inizializzo i valori
				try{initObjectByGroupAttribute(myXmlDoc, valoreGruppo);}catch(e){;}
			}
		}
	}
	catch(e){
		alert("processAfterCaricaDatiTabulatore - error: " + e.description);
		lastIndexToProcess = 0;
	}
}

//funzione che cicla
//su tutti gli oggetti filtrati per gruppo
//ed in base al tipo viene inizializzato il valore
//per ora vengono gestiti i seguenti input:
//TEXTBOX, TEXTAREA, CHECKBOX, RADIO (???)
//SELECT (*solo* combo e non listbox...verificare)
// 20120110 ATTENZIONE VERIFICA x COMBO !!! 
function initObjectByGroupAttribute(xmlDoc, gruppo){

	var collection;
	var i = 0;
	var k = 0;
	var objectNode;
	var nodeTag;
	var nodeType;
	var oNewText;
	var valore ="";
	var strToEval="";

	// LAVORO su INPUT

	//alert(xmlDocument.getElementsByTagName('*').length
	try{
		xmlDoc = myXmlHttpRequestForData.responseXML;
		collection = getElementsByAttribute(document.body, "*", "gruppo", gruppo);
		for (k=0;k<collection.length;k++){
			try{
				var nomeCampo = collection[k].id;
				// nel caso di multi combo (doppi IN_ e OUT_)
				// DEVO considerare SOLO quelli IN_
				if (nomeCampo.toString().substring(0,3)=="IN_"){
					nomeCampo = nomeCampo.toString().substring(3,nomeCampo.length);
				}
				//alert("cerco "+ nomeCampo);
				valore = getTagXmlValue(xmlDoc, nomeCampo);
				if (valore == "null"){
					valore = "";
				}
				//alert("valore: "+ valore);
			}
			catch(e){
				alert("Errore su getTagXmlValue - gruppo: " + gruppo + " - error:" + e.description);
			}
			// devo switchare su attributo type
			//alert(collection[k].id + " - " + nomeCampo + " - " + valore);
			nodeTag = collection[k].nodeName.toString().toUpperCase();
			switch (nodeTag){
			case "LABEL":
				try{
					collection[k].innerText = formatValue(collection[k],valore);

				}
				catch(e){
					alert("initObjectByGroupAttribute - error: " + e.description);
				}
				break;
			case "INPUT":
				nodeType = collection[k].type.toString().toLowerCase();
				switch (nodeType){
				case "checkbox":
					//alert("id: " + collection[k].id + " - valore: " + valore);
					collection[k].checked  = (valore=="S");
					break;
				case "text":

					// controllo se deve essere fatta qualche trasformazione
					// ad esempio di data
					/*
						if (collection[k].formato=='DS'){
							if ((valore!="") && (valore.length==8)){
								collection[k].value = valore.substring(6,8) + "/" + valore.substring(4,6) + "/" + valore.substring(0,4)
							}
						}
						else if (collection[k].formato=='S'){
							collection[k].value = valore;
						}*/
					collection[k].value = formatValue(collection[k],valore);
					break;
				case "hidden":
					//alert("collection[k].id: " + collection[k].id +" - hidden:"  + valore);
					collection[k].value = valore;
					break;
				case "radio":
					/*
					gbl_XmlDoc.getElementsByTagName("ROW")[0];
					nodifigli = nodoRow.childNodes;
					nodifigli[k]
					
					if (nodoXML.getAttribute("checked")==true || nodoXML.getAttribute("checked")=="checked"){
					}*/
					break;
				default:
					oNewText=document.createTextNode(valore);
				collection[k].appendChild(oNewText);
				}
				break;
			case "TEXTAREA":
				collection[k].value = valore;
				break;
			case "SELECT":
				// do per scontato che il combo sia già precaricato
				if (collection[k].id.toString().substring(0,3)=="IN_"){
					//alert("carico.... " + collection[k].id + " " + valore);
					//selectMultiValoreCombo(collection[k].id, valore, ",");
					strToEval = "selectMultiValoreCombo('" + collection[k].id + "','" + valore +"', ',');";

					setTimeout(strToEval,100 * k);
				}
				else if (collection[k].id.toString().substring(0,4)=="OUT_"){
					// nulla
				}
				else{
					// combo classico
					if(valore!=""){
						selectOptionByValue(collection[k].id,valore, ",");
					}
				}
				break;
			default:
				break;
			}// fine switch
		}// fine for
	}
	catch(e){
		alert("initObjectByGroupAttribute - Error: " + e.description);
	}
	finally{
		if (callBackAfterInitAll!=""){
			eval(callBackAfterInitAll);
			callBackAfterInitAll = "";
		}
	}
}




//funzione da richiamare per selezionare il valore
//predefinito del combo (quello presente nel db)
//PREVEDERE la GESTIONE di listbox multipli
//con convenzioni "IN_" e "OUT_"
function selectMultiValoreCombo(select_id, value, splitChar) {


	var i = 0;
	var carattereDiSplit = "*";
	var suffissoCombo = ""; 
	var lista;	

	try {
		if (select_id==""){return;}
		if (splitChar!=""){carattereDiSplit = splitChar;}


		suffissoCombo = select_id.toString().substring(3,select_id.length);
		// gestisco eccezione combo
		// trattato come listbox a multivalore
		// rimappo quelli per i listbox
		lista = value.toString().split(splitChar);
		remove_all_elem("OUT_" + suffissoCombo);
		//alert("value: " + value + ", suffissoCombo: " + suffissoCombo);
		for (i=0;i<lista.length;i++){
			// seleziono quello che serve nella lista IN
			selectOptionByValue("IN_" + suffissoCombo, lista[i]);
			if (getValue("IN_"+ suffissoCombo )==lista[i]){
				add_selected_elements('IN_' + suffissoCombo, 'OUT_'+  suffissoCombo, true);				
			}
		}
	} catch (e) {
		alert('ID ' + select_id + " sconosciuto - Error: " + e.description);
		return;
	}

}

//formatta il valorei in base al tipo
function formatValue(oggetto, valore){

	var strOutput = "";
	try{
		// data stringa aaaammgg
		if (oggetto.formato=='DS'){
			if ((valore!="") && (valore.length==8)){
				strOutput = valore.substring(6,8) + "/" + valore.substring(4,6) + "/" + valore.substring(0,4)
			}
		}
		// data stringa ORACLE !
		else if (oggetto.formato=='DSO'){
			// 2009-04-20 17:07:20
			if ((valore!="")){
				strOutput = valore.substring(8,10) + "/" + valore.substring(5,7) + "/" + valore.substring(0,4)	+ " " + valore.substring(11,16);
			}
		}
		else if (oggetto.formato=='S'){
			strOutput = valore;
		}
		else{
			strOutput = valore;
		}
	}
	catch(e){
		alert("formatValue - Error: " + e.description)
	}
	return strOutput;
}




function checkbeforeSaving(gruppo){
	var k = 0;
	var collectionCampi;
	var i =0;


	try{
		if (gruppo==""){
			alert("Errore: gruppo nullo");
			return;
		}
		collectionCampi = getElementsByAttribute(document.body, "*", "gruppo", gruppo);
		for(k=0;k<collectionCampi.length;k++){
			if (!checkObbligatorio(collectionCampi[k])){
				return;
			}
		}
		salvaScheda();
	}
	catch(e){
		alert("checkbeforeSaving - Error: " + e.description);
	}

}



function chiudi(){
	//scaricaTutto();

	//top.close();
	var callback = "";
	
	try{
		callback = params.get("callback");
		//alert(callback);
		if ((callback !="")&&(callback !="undefined")){
			eval(callback);
		}
		
	}
	catch(e){
		alert("NON trovata callback");
	}
	if(navigator.userAgent.toLowerCase().indexOf("msie 7") != -1 || navigator.userAgent.toLowerCase().indexOf("msie 8") != -1)
	{
		//IE 7...
		top.window.open('','_self');
		top.window.close();
	}
	else
	{
		//IE 6 in giù...
		top.window.opener = null;
		top.close();
	}
}

var bolInserimento = false;

function getFormValueInXml(){
	try{

		var collectionCampi = "";
		var gruppo = array_descrizione_gruppi[0];
		var i = 0;

		var nodeTag; var nodeType;
		var valoreElemento = "";
		var nomeCampo = "";
		var strOutput = "";
		var strTmp = "";
		var xw = new XMLWriter('UTF-8');
		xw.formatting = 'indented';//add indentation and newlines
		xw.indentChar = ' ';//indent with spaces
		xw.indentation = 2;//add 2 spaces per level

		xw.writeStartDocument( );
		//xw.writeDocType('"items.dtd"');
		xw.writeStartElement( 'ROW' );

		collectionCampi = getElementsByAttribute(document.body, "*", "gruppo", gruppo);

		for (i=0;i<collectionCampi.length;i++){

			nomeCampo = collectionCampi[i].id;
			nodeTag = collectionCampi[i].nodeName.toString().toUpperCase();
			switch (nodeTag){
			case "LABEL":
				break;
			case "INPUT":
				// inizio nodo
				nodeType = collectionCampi[i].type.toString().toLowerCase();
				switch (nodeType){
				case "checkbox":
					
					valoreElemento = collectionCampi[i].value;
					if (nomeCampo!=""){
						xw.writeStartElement(nomeCampo);
						xw.writeAttributeString("checked", collectionCampi[i].checked);
						try{
						if ((jQuery("#"+nomeCampo).attr("ordine")!="") && (typeof(jQuery("#"+nomeCampo).attr("ordine")) != "undefined")){
							xw.writeAttributeString( 'ordine', jQuery("#"+nomeCampo).attr("ordine"));
						}
						if ((jQuery("#"+nomeCampo).attr("sezione")!="") && (typeof(jQuery("#"+nomeCampo).attr("sezione")) != "undefined")){
							xw.writeAttributeString( 'sezione', jQuery("#"+nomeCampo).attr("sezione"));
						}
						if ((jQuery("#"+nomeCampo).attr("eti")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti")) != "undefined")){
							xw.writeAttributeString( 'eti', jQuery("#"+nomeCampo).attr("eti"));
						}	
						if ((jQuery("#"+nomeCampo).attr("eti_DE")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti_DE")) != "undefined")){
							xw.writeAttributeString( 'eti_DE', jQuery("#"+nomeCampo).attr("eti_DE"));
						}						
						}catch(e){;}	

						if (collectionCampi[i].checked){
							xw.writeCDATA( valoreElemento );
						}
						else{
							// lo metto comunque MA vuoto
							xw.writeCDATA( "" );
						}
						xw.writeEndElement();
					}
					break;
				case "text":
					valoreElemento = collectionCampi[i].value;
					if (nomeCampo!=""){
						xw.writeStartElement(nomeCampo);
						try{
							if ((jQuery("#"+nomeCampo).attr("ordine")!="") && (typeof(jQuery("#"+nomeCampo).attr("ordine")) != "undefined")){
								xw.writeAttributeString( 'ordine', jQuery("#"+nomeCampo).attr("ordine"));
							}
							if ((jQuery("#"+nomeCampo).attr("sezione")!="") && (typeof(jQuery("#"+nomeCampo).attr("sezione")) != "undefined")){
								xw.writeAttributeString( 'sezione', jQuery("#"+nomeCampo).attr("sezione"));
							}
							if ((jQuery("#"+nomeCampo).attr("eti")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti")) != "undefined")){
								xw.writeAttributeString( 'eti', jQuery("#"+nomeCampo).attr("eti"));
							}
							if ((jQuery("#"+nomeCampo).attr("eti_DE")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti_DE")) != "undefined")){
								xw.writeAttributeString( 'eti_DE', jQuery("#"+nomeCampo).attr("eti_DE"));
							}						
							try{
								if ((jQuery("#"+nomeCampo).attr("suffissoValore")!="") && (typeof(jQuery("#"+nomeCampo).attr("suffissoValore")) != "undefined")){
									xw.writeAttributeString( 'suffissoValore', jQuery("#"+nomeCampo).attr("suffissoValore"));
								}
								if ((jQuery("#"+nomeCampo).attr("suffissoValore_DE")!="") && (typeof(jQuery("#"+nomeCampo).attr("suffissoValore_DE")) != "undefined")){
									xw.writeAttributeString( 'suffissoValore_DE', jQuery("#"+nomeCampo).attr("suffissoValore_DE"));
								}	
							}catch(e){alert("#######" + e.description + jQuery("#"+nomeCampo).attr("id"));}									
						}catch(e){;}		 					
						xw.writeCDATA( valoreElemento ); 
						xw.writeEndElement();
					}
					break;
				case "hidden":
					valoreElemento = collectionCampi[i].value;
					if (nomeCampo!=""){
						xw.writeStartElement(nomeCampo);
						try{
						if ((jQuery("#"+nomeCampo).attr("ordine")!="") && (typeof(jQuery("#"+nomeCampo).attr("ordine")) != "undefined")){
							xw.writeAttributeString( 'ordine', jQuery("#"+nomeCampo).attr("ordine"));
						}
						if ((jQuery("#"+nomeCampo).attr("sezione")!="") && (typeof(jQuery("#"+nomeCampo).attr("sezione")) != "undefined")){
							xw.writeAttributeString( 'sezione', jQuery("#"+nomeCampo).attr("sezione"));
						}
						if ((jQuery("#"+nomeCampo).attr("eti")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti")) != "undefined")){
							xw.writeAttributeString( 'eti', jQuery("#"+nomeCampo).attr("eti"));
						}
						if ((jQuery("#"+nomeCampo).attr("eti_DE")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti_DE")) != "undefined")){
							xw.writeAttributeString( 'eti_DE', jQuery("#"+nomeCampo).attr("eti_DE"));
						}						
						}catch(e){;}							
						xw.writeCDATA( valoreElemento );
						xw.writeEndElement();
					}
					break;
				case "radio":
					// TODO
					// devo lavorare sul name !!
					/*
					nomeCampo = jQuery("#"+nomeCampo).attr("name");
					valoreElemento = $("input:radio[name='" + nomeCampo + "']:checked").val()
					if (nomeCampo!=""){
						xw.writeStartElement(nomeCampo);
						try{
						if ((jQuery("#"+nomeCampo).attr("ordine")!="") && (typeof(jQuery("#"+nomeCampo).attr("ordine")) != "undefined")){
							xw.writeAttributeString( 'ordine', jQuery("#"+nomeCampo).attr("ordine"));
						}
						if ((jQuery("#"+nomeCampo).attr("sezione")!="") && (typeof(jQuery("#"+nomeCampo).attr("sezione")) != "undefined")){
							xw.writeAttributeString( 'sezione', jQuery("#"+nomeCampo).attr("sezione"));
						}
						if ((jQuery("#"+nomeCampo).attr("eti")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti")) != "undefined")){
							xw.writeAttributeString( 'eti', jQuery("#"+nomeCampo).attr("eti"));
						}	
						if ((jQuery("#"+nomeCampo).attr("eti_DE")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti_DE")) != "undefined")){
							xw.writeAttributeString( 'eti_DE', jQuery("#"+nomeCampo).attr("eti_DE"));
						}						
						}catch(e){;}	
						xw.writeCDATA( valoreElemento );
						xw.writeEndElement();
					}*/
					
					valoreElemento = $("#" + nomeCampo).val();
					if (nomeCampo!=""){
						xw.writeStartElement(nomeCampo);
						var isCheck = $("#" + nomeCampo).attr("checked");
						if (typeof(isCheck)=="undefined"){ 								isCheck = false ;						}
						xw.writeAttributeString("checked", isCheck);
						try{
						if ((jQuery("#"+nomeCampo).attr("ordine")!="") && (typeof(jQuery("#"+nomeCampo).attr("ordine")) != "undefined")){
							xw.writeAttributeString( 'ordine', jQuery("#"+nomeCampo).attr("ordine"));
						}
						if ((jQuery("#"+nomeCampo).attr("sezione")!="") && (typeof(jQuery("#"+nomeCampo).attr("sezione")) != "undefined")){
							xw.writeAttributeString( 'sezione', jQuery("#"+nomeCampo).attr("sezione"));
						}
						if ((jQuery("#"+nomeCampo).attr("eti")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti")) != "undefined")){
							xw.writeAttributeString( 'eti', jQuery("#"+nomeCampo).attr("eti"));
						}	
						if ((jQuery("#"+nomeCampo).attr("eti_DE")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti_DE")) != "undefined")){
							xw.writeAttributeString( 'eti_DE', jQuery("#"+nomeCampo).attr("eti_DE"));
						}						
						}catch(e){;}	
						xw.writeCDATA( valoreElemento );
						xw.writeEndElement();
					}
					break;
				default:
					break;
				}
				break;
			case "TEXTAREA":
				// inizio nodo
				valoreElemento = collectionCampi[i].value;
				if (nomeCampo!=""){
					xw.writeStartElement(nomeCampo);
					try{
					if ((jQuery("#"+nomeCampo).attr("ordine")!="") && (typeof(jQuery("#"+nomeCampo).attr("ordine")) != "undefined")){
						xw.writeAttributeString( 'ordine', jQuery("#"+nomeCampo).attr("ordine"));
					}
					if ((jQuery("#"+nomeCampo).attr("sezione")!="") && (typeof(jQuery("#"+nomeCampo).attr("sezione")) != "undefined")){
						xw.writeAttributeString( 'sezione', jQuery("#"+nomeCampo).attr("sezione"));
					}
					if ((jQuery("#"+nomeCampo).attr("eti")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti")) != "undefined")){
						xw.writeAttributeString( 'eti', jQuery("#"+nomeCampo).attr("eti"));
					}
					if ((jQuery("#"+nomeCampo).attr("eti_DE")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti_DE")) != "undefined")){
						xw.writeAttributeString( 'eti_DE', jQuery("#"+nomeCampo).attr("eti_DE"));
					}		
					if ((jQuery("#"+nomeCampo).attr("suffissoValore")!="") && (typeof(jQuery("#"+nomeCampo).attr("suffissoValore")) != "undefined")){
						xw.writeAttributeString( 'suffissoValore', jQuery("#"+nomeCampo).attr("suffissoValore"));
					}	
					if ((jQuery("#"+nomeCampo).attr("suffissoValore_DE")!="") && (typeof(jQuery("#"+nomeCampo).attr("suffissoValore_DE")) != "undefined")){
						xw.writeAttributeString( 'suffissoValore_DE', jQuery("#"+nomeCampo).attr("suffissoValore_DE"));
					}						
					}catch(e){;}						
					xw.writeCDATA( valoreElemento );
					xw.writeEndElement();
				}	
				break;
			case "SELECT":
				if ((collectionCampi[i].multiple)&&(collectionCampi[i].id.substring(0,4)=="OUT_")){
					// rimappo
					nomeCampo = collectionCampi[i].id.substring(4,collectionCampi[i].id.length);
					// inizio nodo
					xw.writeStartElement(nomeCampo);
					// caso multiple
					// di 2 listbox e analizzo OUT
					valoreElemento = getAllOptionCode(collectionCampi[i].id);
					valoreElemento = valoreElemento.replace(/[*]/g, ",");
					try{
						if ((jQuery("#"+nomeCampo).attr("ordine")!="") && (typeof(jQuery("#"+nomeCampo).attr("ordine")) != "undefined")){
							xw.writeAttributeString( 'ordine', jQuery("#"+nomeCampo).attr("ordine"));
						}
						if ((jQuery("#"+nomeCampo).attr("sezione")!="") && (typeof(jQuery("#"+nomeCampo).attr("sezione")) != "undefined")){
							xw.writeAttributeString( 'sezione', jQuery("#"+nomeCampo).attr("sezione"));
						}
						if ((jQuery("#"+nomeCampo).attr("eti")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti")) != "undefined")){
							xw.writeAttributeString( 'eti', jQuery("#"+nomeCampo).attr("eti"));
						}
						if ((jQuery("#"+nomeCampo).attr("eti_DE")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti_DE")) != "undefined")){
							xw.writeAttributeString( 'eti_DE', jQuery("#"+nomeCampo).attr("eti_DE"));
						}					
					}catch(e){;}					
					
					xw.writeAttributeString( 'iden', valoreElemento);
					strTmp =  getAllOptionText(collectionCampi[i].id);
					strTmp = strTmp.replace(/[*]/g, ",");
					xw.writeCDATA( strTmp );
					xw.writeEndElement();
				}
				else if ((collectionCampi[i].multiple)&&(collectionCampi[i].id.substring(0,3)!="IN_")){
					// caso multiplo NON di 2 listbox

					xw.writeStartElement(nomeCampo);
					valoreElemento = getAllOptionCode(collectionCampi[i].id);
					valoreElemento= valoreElemento.replace(/[*]/g, ",");
					try{
						if ((jQuery("#"+nomeCampo).attr("ordine")!="") && (typeof(jQuery("#"+nomeCampo).attr("ordine")) != "undefined")){
							xw.writeAttributeString( 'ordine', jQuery("#"+nomeCampo).attr("ordine"));
						}
						if ((jQuery("#"+nomeCampo).attr("sezione")!="") && (typeof(jQuery("#"+nomeCampo).attr("sezione")) != "undefined")){
							xw.writeAttributeString( 'sezione', jQuery("#"+nomeCampo).attr("sezione"));
						}
						if ((jQuery("#"+nomeCampo).attr("eti")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti")) != "undefined")){
							xw.writeAttributeString( 'eti', jQuery("#"+nomeCampo).attr("eti"));
						}
						if ((jQuery("#"+nomeCampo).attr("eti_DE")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti_DE")) != "undefined")){
							xw.writeAttributeString( 'eti_DE', jQuery("#"+nomeCampo).attr("eti_DE"));
						}					
					}catch(e){;}					
					xw.writeAttributeString( 'iden', valoreElemento );
					strTmp =  getAllOptionText(collectionCampi[i].id);
					strTmp = strTmp.replace(/[*]/g, ",");
					xw.writeCDATA( strTmp );						
					xw.writeEndElement();
				}
				else if ((collectionCampi[i].id.substring(0,3)!="IN_")){
					try{
						// caso classico, dropdown
						xw.writeStartElement(nomeCampo);
						if (collectionCampi[i].multiple){
							valoreElemento = getAllSelectedOptionCode(collectionCampi[i].id);
							valoreElemento= valoreElemento.replace(/[*]/g, ",");
						}
						else{
							valoreElemento = getValue(collectionCampi[i].id);							
						}
						
						try{
							if ((jQuery("#"+nomeCampo).attr("ordine")!="") && (typeof(jQuery("#"+nomeCampo).attr("ordine")) != "undefined")){
								xw.writeAttributeString( 'ordine', jQuery("#"+nomeCampo).attr("ordine"));
							}
							if ((jQuery("#"+nomeCampo).attr("sezione")!="") && (typeof(jQuery("#"+nomeCampo).attr("sezione")) != "undefined")){
								xw.writeAttributeString( 'sezione', jQuery("#"+nomeCampo).attr("sezione"));
							}
							if ((jQuery("#"+nomeCampo).attr("eti")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti")) != "undefined")){
								xw.writeAttributeString( 'eti', jQuery("#"+nomeCampo).attr("eti"));
							}
							if ((jQuery("#"+nomeCampo).attr("eti_DE")!="") && (typeof(jQuery("#"+nomeCampo).attr("eti_DE")) != "undefined")){
								xw.writeAttributeString( 'eti_DE', jQuery("#"+nomeCampo).attr("eti_DE"));
							}					
						}catch(e){;}	
						
						xw.writeAttributeString('iden', valoreElemento );
						if (collectionCampi[i].multiple){
							strTmp =  getAllSelectedOptionText(collectionCampi[i].id);
						}
						else{
							strTmp =  getText(collectionCampi[i].id);
						}
						xw.writeCDATA( strTmp );
						xw.writeEndElement();
					}
					catch(e){
						alert("getFormValueInXml Error on: " + nomeCampo);
					}
				}
				break;

			}
		} // fine ciclo FOR
		// *****************************************************
		xw.writeEndElement(); // fine elemento ROW
		xw.writeEndDocument(); // fine documento	
		strOutput = xw.flush();
		xw.close();		
	}
	catch(e){
		alert("getFormValueInXml - Error: " + e.description);
	}
	return strOutput;
}


var strToEval = "";
function salvaScheda(){
	var collectionCampi = "";
	var gruppo = array_descrizione_gruppi[0];
	var i = 0;
	var sql = "";
	var nodeTag; var nodeType;
	var valoreElemento = "";
	var nomeCampo = "";
	var idenEsame = "";
	
	try{

//		if (idScheda==""){
		if (params.get("iden_scheda")==""){
			// inserimento
			sql = "insert into " + gruppo;
			bolInserimento = true;
		}
		else{
			// modifica
			//	idScheda = params.get("iden_scheda");
			sql = "update " + gruppo + " set ";		
			bolInserimento = false;
		}
		/*}
		else{
			sql = "update " + gruppo + " set ";					
			bolInserimento = false;
		}*/

		collectionCampi = getElementsByAttribute(document.body, "*", "gruppo", gruppo);
		if (bolInserimento){
			sql +=" (";
			for (i=0;i<collectionCampi.length;i++){
				// scrivo i campi
				if (collectionCampi[i].id.substring(0,3)!="IN_"){
					if (collectionCampi[i].id.substring(0,4) == "OUT_"){
						sql+= collectionCampi[i].id.substring(4,collectionCampi[i].id.length) + ",";
					}
					else{
						sql+= collectionCampi[i].id +",";						
					}
				}
			}
			sql = sql.substr(0,sql.length-1);
			// salvo anche UTE_MOD
			sql += ",UTE_MOD";
			sql +=") VALUES (";
		}
		try{
			for (i=0;i<collectionCampi.length;i++){
				nomeCampo = collectionCampi[i].id;
				nodeTag = collectionCampi[i].nodeName.toString().toUpperCase();
				// azzero variabile
				valoreElemento = "";
				switch (nodeTag){
				case "LABEL":
					break;
				case "INPUT":
					nodeType = collectionCampi[i].type.toString().toLowerCase();
					switch (nodeType){
					case "checkbox":
						valoreElemento = collectionCampi[i].value;
						//	TODO
						break;
					case "text" || "hidden":
						valoreElemento = collectionCampi[i].value;
						break;
					case "radio":
						// TODO
						valoreElemento = collectionCampi[i].value;
						break;
					default:
						valoreElemento =  collectionCampi[i].value;
					}
					break;
				case "TEXTAREA":
					valoreElemento = collectionCampi[i].value;
					break;
				case "SELECT":
					try{
						if ((collectionCampi[i].multiple)&&(collectionCampi[i].id.substring(0,4)=="OUT_")){
							// rimappo
							nomeCampo = collectionCampi[i].id.substring(4,collectionCampi[i].id.length);
							// caso multiple
							// di 2 listbox e analizzo OUT
							valoreElemento = getAllOptionCode(collectionCampi[i].id);
						}
						else if ((collectionCampi[i].multiple)&&(collectionCampi[i].id.substring(0,3)!="IN_")){
							// caso multiplo NON di 2 listbox
							valoreElemento = getAllOptionCode(collectionCampi[i].id);	
						}
						else{
							// caso classico, dropdown
							valoreElemento = getAllOptionCode(collectionCampi[i].id);
						}
						if (collectionCampi[i].multiple){
							valoreElemento= valoreElemento.replace(/[*]/g, ",");
						}
					}
					catch(e){
						alert("SalvaScheda - error in select collection");
					}
					break;
	
				}
				// devo rimappare campo nel caso in cui ci fossero dei listbox
				// a selezione multipla
				// DEVO SALTARE QUELLI CON "IN_"
				if (collectionCampi[i].id.substring(0,3)!="IN_"){			
					switch(collectionCampi[i].formato){
					case "S":
						// stringa
	//					alert("id: "+ collectionCampi[i].id +" value: "+ collectionCampi[i].value);
						if (bolInserimento){
							//sql += "'" + collectionCampi[i].value.toString().replaceAll("'","''") + "',";
							sql += "'" + valoreElemento.toString().replaceAll("'","''") + "',";						
						}
						else{
							//sql += collectionCampi[i].id + "='" + collectionCampi[i].value.toString().replaceAll("'","''") + "',";
							sql += nomeCampo + "='" + valoreElemento.toString().replaceAll("'","''") + "',";
						}
						break;
					case "N":
						// numero	
						if (bolInserimento){
							//if (collectionCampi[i].value.toString()==""){
							if (valoreElemento.toString()==""){
								sql += "null,";							
							}
							else{
								//sql += collectionCampi[i].value.toString() + ",";
								sql += valoreElemento.toString() + ",";
							}
						}
						else{
							//if (collectionCampi[i].value.toString()==""){
							if (valoreElemento.toString()==""){
								sql += nomeCampo + "=null,";							
							}
							else{
								sql += nomeCampo + "=" + valoreElemento.toString() + ",";
							}
						}
						break;
					case "DS":
						// data stringa
						break;
					case "D":
						// data
						break;
					} // end switch
					//alert(sql);
				} // end controllo diversi IN_
			} // fine ciclo FOR
		}
		catch(e){
			alert("SalvaScheda - Error for cycle "+ e.description);
		}

		// taglio la virgola finale
		sql = sql.substr(0,sql.length-1);
		if (bolInserimento){
			// INSERIMENTO
			if (params.get("ute_mod")==""){
				sql += ",null";
			}
			else{
				sql += "," + params.get("ute_mod");
			}

			sql += ")";			
		}
		else{
			// MODIFICA 
			if (params.get("ute_mod")==""){
				sql += "UTE_MOD = null";
			}
			else{
				sql += ", UTE_MOD =" + params.get("ute_mod");
			}			
			// MANCA WHERE !!!!
			// lavorare su IDEN_ESAME, il rapporto con iden_scheda è 1:1
			if (params.get("iden_scheda")==""){
				sql += " WHERE IDEN_ESAME = " + document.getElementById("IDEN_ESAME").value;
			}
			else{
				sql += " WHERE IDEN = " + params.get("iden_scheda");				
			}
			

		}
		//alert(sql);
		utilMostraBoxAttesa(true, "Registrazione in corso");
		// eseguire sql
		callQueryCommand(sql);
		idenEsame = document.getElementById("IDEN_ESAME").value;	
		// eseguo anche salvataggio su dett_esami
		sql = "UPDATE DETT_ESAMI set SCHEDA_COMPILATA='2' where iden = " + idenEsame;
		callQueryCommand(sql);		
		
		// *******************************
		// aggiorno dati xml 
		var strXml = "";
		strXml = getFormValueInXml();
		//alert(strXml);
		/*
		if (strXml!=""){
			sql = "update " + gruppo + " set ";
			// fare replace
			sql += " XML_OUTPUT ='" + strXml.replace(/[']/g, "''") +"'";
			if (params.get("iden_scheda")==""){		
				sql += " WHERE IDEN_ESAME = " + document.getElementById("IDEN_ESAME").value;
			}
			else{
				sql += " WHERE IDEN = " + params.get("iden_scheda");
			}
			callQueryCommand(sql);	
		}*/
		dwr.engine.setAsync(false);
		//alert("saveSchedaXml");
		try{
			ajaxQueryCommand.saveSchedaXml(document.getElementById("IDEN_ESAME").value , params.get("iden_scheda") , gruppo , strXml, replyQueryCommand);
		}
		catch(e){
			alert("salvaScheda - Error saving xml: " + e.description);
		}
		// *************** faccio trasformazione
		/*strToEval = "ajaxQueryCommand.createHtmlFromXml('"+ document.getElementById("IDEN_ESAME").value + "','" + params.get("iden_scheda") +"','" + gruppo +"',replyQueryCommand);";
		alert(strToEval);
		timer = window.setTimeout("eval(strToEval);",500);*/
		//alert("createHtmlFromXml");
		ajaxQueryCommand.createHtmlFromXml(document.getElementById("IDEN_ESAME").value , params.get("iden_scheda") , gruppo ,replyQueryCommand);		
		// ********************** 
		if (params.get("iden_scheda")==""){		
			aggiorna();
		}
		else{
			utilMostraBoxAttesa(false, "");		
		}
		alert("Registrazione effettuata.");
	}
	catch(e){
		alert("salvaScheda - Error: " + e.description);
		utilMostraBoxAttesa(false, "");
	}
	finally{
		dwr.engine.setAsync(true);	
		bolInserimento = false;
	}
}


//se sono in inserimento
//devo fare select max(iden) iden from SCH_RM_CARDIACA
//reperire iden appena inserito e
//aggiornare opener.iden_scheda_in_console
//e fare
//udpdateLocalIdenScheda(nuovoValore)
function aggiorna(){
	sql = "select max(iden) lastiden from " + array_descrizione_gruppi[0];
	sql += " where iden > 0 ";
	getXMLData("",parseSql(sql),"callbackAggiorna");
//	timerCheckDrivePcEvent

}

function callbackAggiorna(xmlDoc){

	var lastIden = "";

	try{
		lastIden = getTagXmlValue(xmlDoc, "LASTIDEN");
		if ((lastIden=="")||(lastIden == null)||(lastIden == "undefined")){
			alert("ERRORE - iden nullo");
			return;
		}
//		alert("lastIden:" + lastIden);
		//	aggiorno variabile locale globale
		// sarebbe preferibile usare un oggetto per la scheda
		//idScheda = lastIden;
		// ATTENZIONE - NON posso più aggionare 
		// la singola variabile ma DEVO andare ad aggiornare
		// listaIdenSchedaConsole iesimo
		opener.updateIdenScheda_by_IdenEsa(lastIden, document.getElementById("IDEN_ESAME").value);
		//opener.iden_scheda_in_console = lastIden;
		udpdateLocalIdenScheda(lastIden);
	}
	catch(e){
		alert("callbackAggiorna - Error: " + e.description);
	}
	finally{
		utilMostraBoxAttesa(false, "");		
	}
}



//*****************************************
//***************** AJAX

//esegue query di comando
function callQueryCommand(sql){
	if (sql==""){
		return;
	}
	try{
		dwr.engine.setAsync(false);
		ajaxQueryCommand.ajaxDoCommand("DATA",sql ,replyQueryCommand);
		dwr.engine.setAsync(true);		
	}
	catch(e){
		dwr.engine.setAsync(true);		
		alert("callQueryCommand - " + e.description + " "+ sql);
		utilMostraBoxAttesa(false, "");		
	}	
}

var replyQueryCommand = function (returnValue){

	var feedback;

	//alert(returnValue);
	feedback = returnValue.split("*");

	try{	
		if (feedback[0].toString().toUpperCase()=="KO"){
			// azzero funzione di callback 
			// da chiamare per interrompere la catena in caso di errore
			functionCallBack = "";
			utilMostraBoxAttesa(false, "");		
			alert("Error on query command: " + feedback[1]);
		}
		else{
			/*if (params.get("iden_scheda")==""){		
				aggiorna();
			}
			else{
				utilMostraBoxAttesa(false, "");		
			}
			alert("Registrazione effettuata.");*/
		}
	}
	catch(e){
		alert("replyQueryCommand  - Error: " + e.description);
		utilMostraBoxAttesa(false, "");		
	}

}

//*****************************************
//*******************************************************

function pad(num, count) {
	  var lenDiff = count - String(num).length;
	  var padding = "";
	  
	  if (lenDiff > 0)
	    while (lenDiff--)
	      padding += "0";
	  
	  return padding + num;
	}