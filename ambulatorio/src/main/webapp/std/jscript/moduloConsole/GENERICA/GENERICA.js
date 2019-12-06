function setFocusOnFirstField (){
	try{
		setTimeout("$('#DIAGNOSI').focus()",1500 );
	}
	catch(e){;}
}

//funzione da implementare *sempre*
//viene chiamata dall'esterno
//per validare il modulo
//ritorna boolean
function validateModule(){
	return true;
}

//funzione che carica i valori iniziali del modulo
//in caso di INSERIMENTO (record NON presente lato DB Ambulatorio) viene chiamata, 
//eventualmente, una procedura esterna x reperire i dati
//in caso di MODIFICA vengono caricati i dati locali da DETT_ESAMI
function loadInitValue(){
	var myLista = new Array();
	var k = 0;
	var nodoRow;
	var nodifigli;
	var rs;
	var urlSnodoAssoluta = "";

	try{
		myLista.push(gbl_idenEsa);
		//alert(gbl_idenEsa);
		// select iden, xml_module_output from dett_esami where iden  in (select column_value from table(split(?)));
		// **************************************************
		// problemi nel passaggio di variabili byVal alle funzioni del iframe
		// ****************************************************
		//alert("parent.parent.opener.top.name " + parent.parent.opener.top.name);
		//alert("###try to executeQuery ");
		if (parent.document.frmMain.HIDEN_REF.value!=""){		
			// lo statement infoDettEsami è comune a tutte le schede!!
			// quindi lo estrapolo e lo metto in un xml separato 
			try{rs = parent.executeQuery('generica.xml','infoDettEsami',myLista);}catch(e){alert("Errore: infoDettEsami");}
			//alert("###check rs ");
			if (rs.next()){
				//alert("###check xml");
				/*for (var k=0; k < rs.columns.length;k++){
				//alert(rs.columns[k] +": " + rs.getString(rs.columns[k]));
				setInitValueOfField(rs.columns[k], rs.getString(rs.columns[k]));
				}*/
				// avrò sempre e solo un esame
				// nella query uso cmq il tablesplit
				// per casi multipli futuri
				gbl_strDatiXml = rs.getString("xml_module_output");
				//alert(gbl_strDatiXml);
				gbl_XmlDoc = getXmlDocFromXmlString(gbl_strDatiXml);
				//alert(getTagXmlValue(gbl_XmlDoc, "NOTE"));
				nodoRow = gbl_XmlDoc.getElementsByTagName("ROW")[0];
				if (nodoRow){
					nodifigli = nodoRow.childNodes;
					for (k=0;k<nodifigli.length;k++)
					{
						//alert(nodifigli[k].nodeName);
						if(nodifigli[k].childNodes[0]){
							setInitValueOfField(nodifigli[k].nodeName, nodifigli[k].childNodes[0].nodeValue, nodifigli[k]);
						}
						//alert("fatto");
					}			
				}
			}
			else{
				// carico dati di base (iden_anag, iden_esame)
				setInitValueOfField("IDEN_ANAG", parent.globalIdenAnag);
				setInitValueOfField("IDEN_ESAME", gbl_idenEsa);
				// provo a caricare referto esterno in diagnosi
				try{setInitValueOfField("DIAGNOSI", parent.refertoTXT);}catch(e){;}
			}
		}
		else{
			setInitValueOfField("IDEN_ANAG", parent.globalIdenAnag);
			setInitValueOfField("IDEN_ESAME", gbl_idenEsa);
		}
	}
	catch(e){
		alert("loadInitValue - Error: " + e.description);
	}
}






