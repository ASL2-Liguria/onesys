

//campi che verranno importati 
//alla pressione del pulsante "importa modulo anamnestico"
var fieldToImport = new Array ();
fieldToImport = ['ANAMNESI','ANAMNESI_INCERTA', 'IPERTENSIONE' ,'ICTUS','DIABETE' ,'INFARTO' ,'IPERTRIGLICEMIA' ,'IDEN_COLESTEROLO' ,'IDEN_FUMO' ,'FUMO_X_ANNI' ,'IDEN_MOTIVAZIONI' ,'ALTRE_MOTIVAZIONI', 'PA_OMERO']; 


function setFocusOnFirstField (){
	try{
		setTimeout("$('#ANAMNESI').focus()",2000 );
	}
	catch(e){;}
}

function calcoloIndicePressorio(){
	try{
		var PA_OMERO = document.getElementById("PA_OMERO").value;
		if (document.getElementById("PRESSIONE_CAVIGLIA_DX")){
			var PRESSIONE_CAVIGLIA_DX = document.getElementById("PRESSIONE_CAVIGLIA_DX").value;
			var PRESSIONE_CAVIGLIA_SX = document.getElementById("PRESSIONE_CAVIGLIA_SX").value;
			var INDICE_PRESSORIO_DX;
			var INDICE_PRESSORIO_SX;
			
			try{if ((!isNaN(PA_OMERO))&&(PA_OMERO!=0)){INDICE_PRESSORIO_DX = PRESSIONE_CAVIGLIA_DX / PA_OMERO;}}catch(e){}
			try{if ((!isNaN(PA_OMERO))&&(PA_OMERO!=0)){INDICE_PRESSORIO_SX = PRESSIONE_CAVIGLIA_SX / PA_OMERO;}}catch(e){}
			
			if (!isNaN(INDICE_PRESSORIO_DX)){
				document.getElementById("INDICE_PRESSORIO_DX").value = INDICE_PRESSORIO_DX.roundTo(2);
			}
			if (!isNaN(INDICE_PRESSORIO_SX)){
				document.getElementById("INDICE_PRESSORIO_SX").value = INDICE_PRESSORIO_SX.roundTo(2);
			}		
		}
	}
	catch(e){
		alert("calcoloIndicePressorio - Error: " + e.description);
	}		
}

// importa info anamnestiche 
// (anamnesi - patologie associate ...)
// spesso il flusso 
// step1: estrapolo iden che mi interessa (ultimo iden esame
// stessa prestazione (ECOD%) stessa anagrafica)
// step2: importo per tale iden le info che mi interessano
function impInfoAnamnestiche(){
	var myLista = new Array();
	var rs;
	var ultimo_iden;
	var gbl_strDatiXml="";
	var gbl_XmlDoc;
	
	try{
		myLista.push(gbl_idenAnag);
		myLista.push(gbl_idenEsa);
		//alert(gbl_idenAnag +"," + gbl_idenEsa);
		try{rs = parent.executeQuery('ecodoppler.xml','lastIdenSameExam',myLista);}catch(e){alert("Errore: lastIdenSameExam");}
		//alert("###check rs ");
		if (rs.next()){
			ultimo_iden = rs.getString("ULTIMO_IDEN");
		}
		else{
			alert("Nessun precedente con scheda ECODOPPLER dal quale importare");return;
		}
		if (ultimo_iden==""){alert("Nessun precedente con scheda ECODOPPLER dal quale importare!!");return;}
		myLista = new Array();
		myLista.push(ultimo_iden);
		//alert(ultimo_iden);
		try{rs = parent.executeQuery('pat_infettive.xml','infoDettEsami',myLista);}catch(e){alert("Errore: infoDettEsami");}

		if (rs.next()){
			//alert("###check rs ");
			gbl_strDatiXml = rs.getString("xml_module_output");
			//alert(gbl_strDatiXml);
			gbl_XmlDoc = getXmlDocFromXmlString(gbl_strDatiXml);
			for (var k=0;k<fieldToImport.length;k++){
				try{
					setInitValueOfField(fieldToImport[k], gbl_XmlDoc.getElementsByTagName(fieldToImport[k])[0].childNodes[0].nodeValue,gbl_XmlDoc.getElementsByTagName(fieldToImport[k])[0]);
				}
				catch(e){
					alert("Error: " + e.description +"\n" + fieldToImport[k]);
				}
			}
		}
	}
	catch(e){
		alert("impInfoAnamnestiche - Error: " + e.description);
	}		
}


function checkPrecedenteAnamnesi(){
	var bolEsito = false;
	var myLista = new Array();
	var ultimo_iden;
	var rs;
	
	try{
		myLista.push(gbl_idenAnag);
		myLista.push(gbl_idenEsa);
		//alert(gbl_idenAnag +"," + gbl_idenEsa);
		try{rs = parent.executeQuery('ecodoppler.xml','lastIdenSameExam',myLista);}catch(e){alert("Errore: lastIdenSameExam");}
		//alert("###check rs ");
		if (rs.next()){
			ultimo_iden = rs.getString("ULTIMO_IDEN");
		}
		if (ultimo_iden!="") {bolEsito = true;}
	}
	catch(e){
		alert("impInfoAnamnestiche - Error: " + e.description);
	}
	
	return bolEsito;
}