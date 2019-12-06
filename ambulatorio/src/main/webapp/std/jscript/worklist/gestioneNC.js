// JavaScript Document
// x Bologna
function importaNC(value){
	var sql = "";
	try{
		// da rivedere
		// fare chiamate
		// xml per aver il testo
		sql = "select testo , tipo from tab_nc where attivo ='S'";
		sql += " and TIPO='" + value + "'";
		getXMLData("",parseSql(sql),"processXmlDocument_NCfunction");
	}
	catch(e){
		alert("importaNC - Error: " + e.description);
	}
}

function processXmlDocument_NCfunction(xmlDoc){
	var testo = "";
	try{
		testo = getTagXmlValue(xmlDoc, "TESTO");
		pasteText(testo);
	}
	catch(e){
		alert("processXmlDocument_NCfunction - Error: " + e.description);		
	}
}