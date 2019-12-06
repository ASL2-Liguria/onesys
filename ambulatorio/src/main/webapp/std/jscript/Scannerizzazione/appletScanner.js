//JavaScript Document
var hnd_attesa;
var n_copie;
var descrScansioneDefault = "SCANSIONE";
// indica se è stato premuto il salvataggio 
var saveClicked = false;
var nScansione = 0;
var scansioneFinita = false;

//var listaElementiAllegati = new Array();
var req;

window.onunload = function (){
	try{
		return false;
	}catch(e){}
	
}

function initMainObject(){
	try{
		loadTagsList("idProvenienza","DOC_PROVENIENZA");
		$( "#idtxtDaData" ).datepicker($.datepicker.regional[ "it" ]);
		// aggancio gestore evento dblclick 'SelTipologiaDisc' 
		
		
		document.getElementById("idSelDocLoaded").ondblclick = function(){
				remove_elem_by_sel(this.id);
			}
		document.getElementById("idSelDocLoaded").title = "Doppio click per rimuovere il documento";
		// modifica 11-12-15
		if (other_info=="SCANSIONE_NO"){
			$("#scan").parent().parent().hide();
		}
		// **********************
		
	}
	catch(e){
		alert("initMainObject - Error: "+ e.description);
	}
}




// indica se ho scelto una provenienza dal
// combo autocomplete , se rimane vuoto
// vuol dire che DEVO salvare il valore
// in tabella attraverso insertTag
var provenienzaScelta = "";
function loadTagsList(idKey, idRelatedToKey){
	var sql = "";
	var myLista = new Array();
	var listaHits = new Array();
	var jsonObj;
	var strTmp = "";
	try{
		myLista.push(web_user);
		myLista.push(idRelatedToKey);
		myLista.push($( "#" + idKey ).val());
		//alert(gbl_idenEsa);
		// select iden, xml_module_output from dett_esami where iden  in (select column_value from table(split(?)));
		// **************************************************
		// problemi nel passaggio di variabili byVal alle funzioni del iframe
		// ****************************************************
		//alert("parent.parent.opener.top.name " + parent.parent.opener.top.name);
		
		
		try{
			rs = getRef4Stm().executeQuery('allegaDoc.xml','tagQuery',myLista);
		}catch(e){
			alert("!Errore, tagQuery: " + e.description);return;
		}
		while (rs.next()){
			strTmp = "{\"value\":\"" + rs.getString("DESCR") + "\",\"iden\":\"" + rs.getString("IDEN") +"\"}";
			//alert(strTmp);
			jsonObj = JSON.parse(strTmp);
			listaHits.push(jsonObj);
		}
		
		$( "#" + idKey ).autocomplete({
			source: listaHits,
			focus: function( event, ui ) {
                $( "#" + idKey ).val( ui.item.value );
                return false;
            },
			select: function( event, ui ) {
                //alert(ui.item.iden + " - " + ui.item.value);
                provenienzaScelta = ui.item.value; 
                return;
                /*
				$( "#"+ idRelatedToKey).append(ui.item.value);
				$( "#"+ idKey).val('');
				$( "#"+ idRelatedToKey).focus();
                return false;*/
            }
		});	

	}
	catch(e){
		alert("loadTagsList - Error: " + e.description);	 	
	}
}


function ajaxUploadFunction()
{
	var url = "FileUploadServlet";

	if (window.XMLHttpRequest) // Non-IE browsers
	{ 
		req = new XMLHttpRequest();
		req.onreadystatechange = processStateChange;

		try 
		{
			req.open("GET", url, true);
		} 
		catch (e) 
		{
			alert(e);
		}
		req.send(null);
	} 
	else if (window.ActiveXObject) // IE Browsers
	{ 
		req = new ActiveXObject("Microsoft.XMLHTTP");
	
		if (req) 
		{
			req.onreadystatechange = processStateChange;
			req.open("GET", url, true);
			req.send();
		}
	}
}

function processStateChange()
{
	/**
	 *	State	Description
	 *	0		The request is not initialized
	 *	1		The request has been set up
	 *	2		The request has been sent
	 *	3		The request is in process
	 *	4		The request is complete
	 */
	
	if (req.readyState == 4)
	{
		if (req.status == 200) // OK response
		{
			var xml = req.responseXML;
			
			// No need to iterate since there will only be one set of lines
			var isNotFinished = xml.getElementsByTagName("finished")[0];
			var myBytesRead = xml.getElementsByTagName("bytes_read")[0];
			var myContentLength = xml.getElementsByTagName("content_length")[0];
			var myPercent = xml.getElementsByTagName("percent_complete")[0];
			
			// Check to see if it's even started yet
			if ((isNotFinished == null) && (myPercent == null))
			{
				document.getElementById("initializing").style.visibility = "visible";

				// Sleep then call the function again
				window.setTimeout("ajaxUploadFunction();", 250);
			}
			else 
			{
				document.getElementById("initializing").style.visibility = "hidden";
				document.getElementById("progressBarTable").style.visibility = "visible";
				document.getElementById("percentCompleteTable").style.visibility = "visible";
				document.getElementById("bytesRead").style.visibility = "visible";

				myBytesRead = myBytesRead.firstChild.data;
				myContentLength = myContentLength.firstChild.data;

				if (myPercent != null) // It's started, get the status of the upload
				{
					myPercent = myPercent.firstChild.data;
		
					document.getElementById("progressBar").style.width = myPercent + "%";
					document.getElementById("bytesRead").innerHTML = myBytesRead + " di " + 
						myContentLength + " bytes letti";
					document.getElementById("percentComplete").innerHTML = myPercent + "%";
	
					// Sleep then call the function again
					window.setTimeout("ajaxUploadFunction();", 250);
				}
				else
				{
					var xmlDoc = req.responseXML.documentElement ;
					var iden_doc = xmlDoc.getElementsByTagName("iden_doc")[0].childNodes[0].nodeValue;
					document.getElementById("bytesRead").style.visibility = "hidden";
					document.getElementById("progressBar").style.width = "100%";
					//document.getElementById("initializing").style.visibility = "hidden";
					document.getElementById("percentComplete").innerHTML = "Documento allegato: " + document.all.file.value;
					//alert("Documento allegato iden: " + iden_doc+ "#" + req.responseXML + "#" + req.responseText + "#" );
					//alert("Documento allegato");					
					// aggiunge doc alla lista
					addElementToLoadedDoc("idSelDocLoaded", document.all.file.value, document.all.file.value, iden_doc);
					//resetto variabile
					saveClicked = false;
				}
			}
		}
		else
		{
			alert(req.statusText);
		}
	}
}




function AppletScan(){
	try{
		//setti descr di default
		if(document.formSalva.Fdescr.type.toString().toLowerCase()=="hidden"){
			// NON è stata passata descr di default
			document.formSalva.Fdescr.value= descrScansioneDefault;
		}
		else{
			if (document.formSalva.Fdescr.value=="")
			{
				alert("Prego, inserire una descrizione.");
				document.formSalva.Fdescr.focus();
				return;
			}
		}
		document.formScan.descr.value=document.formSalva.Fdescr.value +".pdf";
		document.formScan.data.value=document.formSalva.txtDaData.value;
		// ambulatorio 
		// lavoro SOLO associando al paziente
		document.formScan.esami_iden.value="0";
		document.formScan.anag_iden.value=document.formScan.old_anag_iden.value;

		if (!document.formSalva.S_esa_anag[0].checked)
		{
			document.formScan.esami_iden.value="0";
			document.formScan.anag_iden.value=document.formScan.old_anag_iden.value;
		}
		else
		{
			document.formScan.esami_iden.value=document.formScan.old_esami_iden.value;
			document.formScan.anag_iden.value=document.formScan.old_anag_iden.value;
		}
		document.formScan.iden_tipo_doc.value = getValue("SelTipologiaDoc");
		document.formScan.iden_tipo_disciplina.value = getValue("SelTipologiaDisc");

		document.formScan.provenienza.value = document.formSalva.provenienza.value;
		document.formScan.medico_riferimento.value = document.formSalva.medico_riferimento.value;
		document.formScan.altro_medico.value = document.formSalva.altro_medico.value;

		// ************
		//aggiungiElementoScansione();
		//scansioneFinita = false;
		// ************
		
		document.formScan.submit();
	}

	catch(e){
		alert("AppletScan - Error: "+ e.description);
	}
}






function aggiungiElementoScansione(idenDoc){
	var descrScansione = "";

	try{
		//if (isNaN(nScansione)){nScansione = 0;}
		if(document.formSalva.Fdescr.type.toString().toLowerCase()=="hidden"){
			descrScansione = "SCANSIONE N." + parseInt(nScansione + 1);
		}
		else{
			descrScansione =  document.formSalva.Fdescr.value + " - SCANSIONE N." + parseInt(nScansione + 1) ; 
		}
		addElementToLoadedDoc("idSelDocLoaded", "SCANSIONE_" + nScansione, document.formSalva.Fdescr.value + " - SCANSIONE " + parseInt(nScansione + 1), idenDoc);
		nScansione++;
		//addElementToLoadedDoc("idSelDocLoaded", "SCANSIONE_" + nScansione, " - SCANSIONE " + parseInt(nScansione + 1));
	}
	catch(e){
		alert("aggiungiElementoScansione - Error: "+ e.description);
	}
}


function addElementToLoadedDoc(idCombo, valueToAdd, textToAdd, idenDoc){

	var lastIden = "";
	try{
		//alert("addElementToLoadedDoc " + idenDoc);
		/*if (typeof idenDoc =="undefined"){
			lastIden = getLastIdenDoc();
		}
		else{
			lastIden = idenDoc;
		}*/
		lastIden = idenDoc;
		//alert("lastIden: "+ lastIden + " " + valueToAdd);
		add_elem(idCombo, lastIden, textToAdd);
	}
	catch(e){
		alert("addElementToLoadedDoc - Error: "+ e.description);
	}
}

function getLastIdenDoc(){
	var strOuput = "";
	var myLista = new Array();
	var rs;
	var stmName = "" ;
	try{
		// aTTENZIONE !! Verificare quando viene aggiunto l'elemnto
		// al combobox nel caso di scansione !!!!
		myLista.push(gbl_iden_anag);
		myLista.push(web_user);
		
		// in base alla chiamata esterna devo
		// fare query su db di whale o ambulatorio
		if (caller.toString().toLowerCase()!="whale"){
			stmName = "getLastIdenDoc";
		}
		else{
			stmName = "getLastIdenDoc_whale";
		}
		//alert(stmName);
		try{rs = getRef4Stm().executeQuery('allegaDoc.xml',stmName,myLista);}catch(e){alert("Errore: " + stmName);}
		if (rs.next()){
			strOuput = rs.getString("iden");
		}
	}
	catch(e){
		alert("addElementToLoadedDoc - Error: "+ e.description);
	}
	return strOuput;
}





function Carica_dati(){
	var el ;
	//alert("carica dati");
	/*fillLabels(arrayLabelName,arrayLabelValue);
	try{tutto_schermo();}catch(e){;}*/
	if (document.formSalva.Fdescr.value=="")
		document.formSalva.Fdescr.value = descrScansioneDefault;
	
	if (lockRadioBt){
		// metto in sola lettura i radio button
		document.formSalva.S_esa_anag[0].disabled = true; 
		document.formSalva.S_esa_anag[1].disabled = true;
	}
	//document.formSalva.S_esa_anag[0].checked=true;
	try{
		//bgndColorYellow
		$('#lblAnag').parent().css('background-color', '#FFFF99');
		$('#lblEsa').parent().css('background-color', '#FFFF99');
		// nascondo il pulsante chiudi se la chiamata è esterna
		if (caller!= ""){
			el = document.getElementById("close").parentNode.parentNode;
			el.parentNode.removeChild(el);
		}
	}
	catch(e){
		alert(e.description);
	}
	//carico tipologie doc
	fill_selectWithEmptyOption('SelTipologiaDoc',array_iden_tipologie_doc,array_descr_tipologie_doc,30,"...");
	// carico tipologie discipline
	// SelTipologiaDoc SelTipologiaDisc
	fill_selectWithEmptyOption('SelTipologiaDisc',array_iden_tipologie_disc,array_descr_tipologie_disc,30,"...");	
	// modifica 11-12-15
	if (iden_tipo_doc!=""){
		selectOptionByValue("SelTipologiaDoc", iden_tipo_doc);
	}		
	// **********************
	
}

function LoadFile(){
	var estensioneFile = "";
	var lista ;
	// ambulatorio
	if (document.all.file.value == ""){
		alert("Prego, selezionare un documento");
		return;
	}
	document.formSalva.anag_iden.value = gbl_iden_anag;
	if (!document.formSalva.S_esa_anag[0].checked)
	{
		// nel caso di associazione ad anag setto iden_esame a zero
		document.formSalva.esami_iden.value="0";
	}
	else{
		document.formSalva.esami_iden.value = gbl_iden_esa;	
	}
	lista =  document.all.file.value.split(".");
	estensioneFile = lista[lista.length - 1];
	if(document.formSalva.Fdescr.type.toString().toLowerCase()=="hidden"){
		document.formSalva.descr_doc.value = getfileName();
	}
	else{
		document.formSalva.descr_doc.value = document.formSalva.Fdescr.value + "." + estensioneFile;
	}
	document.formSalva.data_doc.value = document.formSalva.txtDaData.value;
	document.formSalva.iden_tipo_doc.value = getValue("SelTipologiaDoc");
	document.formSalva.iden_tipo_disciplina.value = getValue("SelTipologiaDisc");
	// chiamata post per inviare il file
	document.formSalva.submit();
	// chiamata get per la percentuale di avanzamento
	ajaxUploadFunction();
	return;
}


function getfileName(){
	var pathFile = "";
	var charSplit="";
	var nomeFile = "";
	try{
		pathFile = document.all.file.value;
		if (pathFile.indexOf("\\")>-1){
			charSplit = "\\";
		}
		else{
			charSplit = "/";
		}
		var lista = pathFile.split(charSplit);
		if (lista.length>0){
			nomeFile = lista[lista.length-1];
		}
	}
	catch(e){
		alert("getfileName - Error: " + e.description);
	}
	return nomeFile;
}

function SaveFile(){
	var codiciDoc = "";
	var myLista = new Array();
	var mioCodice ;
	saveClicked = true;
	var bolSaveTag= false;
	var valoreChiave="";
	try{
		valoreChiave = $( "#idProvenienza" ).val();
		if ((provenienzaScelta=="")&&(valoreChiave!="")){bolSaveTag = true;}
		if ((provenienzaScelta!="")&&((valoreChiave!=""))&&(valoreChiave!=provenienzaScelta)){bolSaveTag = true;}
		//alert("salvo tag: " + bolSaveTag);
		if (bolSaveTag){
			
			myLista = new Array();
			myLista.push(web_user);			
			myLista.push(valoreChiave);
			myLista.push("DOC_PROVENIENZA");
			// alert(valoreChiave +" " + web_user );
			var stm = getRef4Stm().executeStatement('allegaDoc.xml','insertTag',myLista,0);
//			alert(stm[0]);
			if (stm[0]!="OK"){
				alert("Errore: problemi nel salvataggio del tag Provenienza");
				return;
			}
			else{
				//alert("Elemento aggiunto correttamente.");
			}	
		}
		//alert(document.getElementById("idSelDocLoaded").length);
		codiciDoc = getAllOptionCodeWithSplitElement("idSelDocLoaded",",");
		//alert("codiciDoc " + codiciDoc);
		//return;
		if (codiciDoc==""){
			// nulla da salvare 
			alert("Nulla da registrare");
			return;
		}
		myLista = new Array();
		myLista.push(codiciDoc);
		if (caller.toString().toLowerCase()=="whale"){
			// al momento non funzionac correttamente
			// quindi chiamo le mie classi
			stm =  getRef4Stm().executeStatement('scanner.xml','whale_setStatoDocumenti',myLista,0);
			/*
			sql = "update DOCUMENTI_ALLEGATI set DELETED='N' where IDEN_ANAG = " + gbl_iden_anag + " and DELETED = 'S'";
			dwr.engine.setAsync(false);
			ajaxQueryCommand.ajaxDoCommand("WHALE_DATA",sql ,function (returnValue){
				var feedback;
				feedback = returnValue.split("*");
				try{
					if (feedback[0].toString().toUpperCase()!="OK"){
						// azzero funzione di callback 
						// da chiamare per interrompere la catena in caso di errore
						alert("Error: " + feedback[1]);
					}
					else{
						// tutto ok
						alert("Registrazione effettutata.")
					}
				}
				catch(e){
					alert("ajaxDoCommand - Error: " + e.description);
				}});*/
		}
		else{
			// classico
			stm = getRef4Stm().executeStatement('scanner.xml','setStatoDocumenti',myLista,0);
		}
//		alert(stm[0]);
		if (stm[0]!="OK"){
			alert("Errore: problemi nel salvataggio dei documenti" + stm[1]);
			return;
		}
		else{
			alert("Registrazione effettuata.");
		}			

	}
	catch(e){
		alert("SaveFile - Error: " + e.description);
	}
	finally{
		try{dwr.engine.setAsync(true);}catch(e){;}
	}
	
}


function callQueryCommand(sql){
	if (sql==""){
		return;
	}
	try{
		ajaxQueryCommand.ajaxDoCommand("DATA",sql ,replyQueryCommand)
	}
	catch(e){
		alert("callQueryCommand - " + e.description)
	}	
}

var replyQueryCommand = function (returnValue){
	
	var feedback;
	
	feedback = returnValue.split("*");
	

	try{
		if (feedback[0].toString().toUpperCase()!="OK"){
			// azzero funzione di callback 
			// da chiamare per interrompere la catena in caso di errore
			functionCallBack = "";
			alert("Error: " + feedback[1]);
		}
		else{
			aggiorna();
		}
	}
	catch(e){
		alert("replyQueryCommand - Error: " + e.description);
	}
	
}


function chiudiScheda(){
	try{
		var codiciDoc = getAllOptionCode("idSelDocLoaded");
		if ((saveClicked)||(codiciDoc=="")){
			try{parent.opener.aggiorna();
			parent.self.close();}catch(e){top.close();}
		}
		else{
			if (confirm("ATTENZIONE - è necessario salvare per confermare gli allegati. Uscire comunque?")){
				try{parent.opener.aggiorna();
				parent.self.close();}catch(e){top.close();}
			}
		}
	}
	catch(e){
		alert("chiudiScheda - Error: "+ e.description);
		try{parent.opener.aggiorna();parent.self.close();}catch(e){top.close();}
	}
}




// ******************************************************************
// ******************************************************************
// ******************************************************************
// funzione che ritorna riferimento
// corretto per chiamare statement
function getRef4Stm (){
	
	var oggetto ;
	try{
		if (caller.toString().toLowerCase()=="whale"){
			oggetto = this;
		}
		else{
			try{
				if (top.opener.top){
					oggetto = top.opener.top;
				}
			}catch(e){
				oggetto = this;
			}
		}
	}
	catch(e){
		alert("getRef4Stm - Error: " + e.description);
	}
	return oggetto;
}


// ******************************************************************