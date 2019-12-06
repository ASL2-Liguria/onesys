// JavaScript Document
var labelInfoToUpdate = "";
function initGlobalObject(){
	try{
		try{
			initbaseUser();	
		}
		catch(e){
			alert("Can't inizialize user");
		}
		fillLabels(arrayLabelName,arrayLabelValue);
	//	fill_select('selCampiIn',arrayCampoIn,arrayCampoIn);
	//	fill_select('selCampiOut',arrayCampoOut,arrayCampoOut);
		utilCreaBoxAttesa();
	}
	catch(e){
		alert("initGlobalObject - Error: " + e.description);
	}
}

// funzione caricaLabelCampo
function caricaLabelCampo(nomeLabel,nomeListBox){
	var valore = "";
	
	try{
		if ((nomeLabel=="")||(nomeListBox=="")){return;}
		labelInfoToUpdate = nomeLabel;
		valore = getValue(nomeListBox);
		if (valore==""){return;}
		sql = "select labelcampo from imagoweb.tab_campi_wk";
		sql += " where keycampo='"  + valore +"'";
		sql += " and lingua ='IT'";
		getXMLData("",parseSql(sql),"callBackCaricaLabelCampo");	
//		setLabelText(nomeLabel,arrayLabelCampo[getIndexByValue(arrayCampoAll, getValue(nomeListBox))]);
	}
	catch(e){
		;
	}
}

var callBackCaricaLabelCampo = function(xDoc){
	var valore
	try{
		valore = getTagXmlValue(xDoc, "LABELCAMPO");
		setLabelText(labelInfoToUpdate,valore);		
	}
	catch(e){
		alert("callBackCaricaLabelCampo" + e.description);
	}
}


// funzione SetLabelText
function setLabelText(elemento, testo){

	var objectNode;
	if (elemento==""){return;}
	objectNode = document.getElementById(elemento);
	 if (objectNode){
		 objectNode.innerText =testo;
	 }

}


// funzioni getIndexByValue
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

// funzione chiudi
function chiudi(){
 document.location.replace ("blank");
}

function registra(){
	document.frmDati.idenCampi.value=getAllOptionCode("selCampiOut");
	document.frmDati.submit();
}

// funzione che prende il tipo wk
// scelto e fa le query
function loadInfoTipoWk(oggetto){
	
	var tipoWk = "";
	
	try{
		// pulisco tutti i combo

		remove_all_elem("selCampiIn");
		remove_all_elem("selCampiOut");
		
		// ****
	
		tipoWk = oggetto.value;

		if (tipoWk==""){
			alert("Tipo worklist non valido");
			return;
		}
		utilMostraBoxAttesa(true, "Prego attendere il caricamento...");
		dwr.engine.setAsync(false);		
		ajaxUserManage.getFieldsForTipoWk(tipoWk, replyGetFieldsForTipoWk);
		dwr.engine.setAsync(true);		
	}
	catch(e){
		utilMostraBoxAttesa(false);		
		alert("loadInfoTipoWk - Error: " + e.description);
		
	}
}


var replyGetFieldsForTipoWk = function(value){
	
	var sql = "";
	var lista;
	var strWhere = "";
	var i=0;
	try{
		// con Value riempio il combo dei campi selezionati
		lista = value.split("*");		
		if (value!=""){
			fill_select("selCampiOut", lista,lista, 25, "...")
		}		
		// devo anche riempire il combo di quelli disponibili !!
		// uso XML2DB !!
		sql = "select keycampo from imagoweb.tab_campi_wk ";
		// escludo quelli già presenti
		if (value!=""){		
			for (i=0;i<lista.length;i++){
				if (strWhere==""){
					if (lista[i]!=""){
						strWhere = " where keycampo<>'" + lista[i] +"'";
					}
				}
				else{
					if (lista[i]!=""){					
						strWhere += " and keycampo<>'" + lista[i] +"'";				
					}
				}
			}
		}		
		if (strWhere==""){
			sql += " where obbligatorio ='N'";
		}
		else{
			sql += strWhere + " and obbligatorio ='N'";
		}
		sql += " AND tipo_wk='" + getValue("idSelTipoWk") +"'";
		if (baseUser.LINGUA==""){
			sql += " AND lingua='IT'";		
		}
		else{
			sql += " AND lingua='" + baseUser.LINGUA +"'";		
		}

		fill_selectFromSqlViaXml(sql,"selCampiIn", "KEYCAMPO", "KEYCAMPO", 25, "...");
	}
	catch(e){
		alert("replyGetFieldsForTipoWk - Error: " + e.description);
	}		
	finally{
		utilMostraBoxAttesa(false);			
	}
}

function registra(){
//	alert("registra: " + getValue("idSelTipoWk"));
	var valori = "";
	try{
		valori = getAllOptionCode("selCampiOut");
		if (valori==""){
			alert("Attenzione: non è stato selezionato nulla!");
			return;
		}
		utilMostraBoxAttesa(true, "Attendere prego...");		
		dwr.engine.setAsync(false);
		ajaxUserManage.setFieldsForTipoWk(getValue("idSelTipoWk"), valori, replySetFieldsForTipoWk);		
		dwr.engine.setAsync(true);		
		
	}
	catch(e){
		utilMostraBoxAttesa(false);				
		alert("registra - Error: "+ e.description);
	}
}

var replySetFieldsForTipoWk = function(value){
	try{
		if (value!="OK"){
			alert("Errore: " + value.split("*")[1]);
			return;
		}
		else{
			alert("Registrazione effettuta.");
		}
		
	}
	catch(e){
		alert("replySetFieldsForTipoWk - Error: "+ e.description);
	}
	finally{
		utilMostraBoxAttesa(false);						
	}
}
