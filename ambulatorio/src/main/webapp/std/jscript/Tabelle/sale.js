var reg = false;
var indiceDettaglioRiga = 1;
var righeIniziali = 3;
// ***************************************************************************
// modifica aldo 11/8/14
// ***************************************************************************
$(document).ready(function(){
	var htmlNote = "";
	var noteValue = "";
	var dettValue = "";
	var idenSal = "";
	
	

	htmlNote = "<tr><td class='classTdLabelNoWidth'><label id='lblNote'>Note</label></td><td class='classTdField'><textarea id ='txtNote' name ='txtNote' rows ='8' style='width:100%'></textarea></td></tr>";
	$("table[class='classDataEntryTable']").first().append(htmlNote);
	// in base alla modalita di inserimento / modifica 
	// caricare valore delle note
	try{idenSal = document.form_sale.iden.value;}
	catch(e){
		// inserimento 
		idenSal = "";
	}
	if (idenSal !=""){
		// modifica
		var rs = opener.top.executeQuery('tab_sal.xml','getDettSala',[idenSal]);
		if (rs.next()){
			noteValue = rs.getString("note");
			dettValue = rs.getString("info_dettaglio");
			$("#txtNote").val(noteValue);
			if (dettValue!=""){
				var objJson = JSON.parse(dettValue);
				var righe = [];
				for (var key in objJson) {
				  if (objJson.hasOwnProperty(key)) {
					righe.push(key);
					addRigaInfoDettaglio(indiceDettaglioRiga);
					$("#" + key).val(objJson[key]);
					indiceDettaglioRiga++;
				  }
				}
			}
			else{
				for (var k=0;k<righeIniziali;k++){
					addRigaInfoDettaglio(indiceDettaglioRiga);
					indiceDettaglioRiga++;
				}				
			}
		}
		
	}
	else{
	// rimappo link di registrazione
//	$("#registra").attr("href",$("#registra").attr("href")+"javascript:salvaNote();");
		for (var k=0;k<righeIniziali;k++){
			addRigaInfoDettaglio(indiceDettaglioRiga);
			indiceDettaglioRiga++;
		}
	}
	$("#registra").attr("href","javascript:registraSala();");
	
						   
 });


function addRiga(){
	addRigaInfoDettaglio(indiceDettaglioRiga);
	indiceDettaglioRiga++;
}

function addRigaInfoDettaglio(indice){
	var htmlDett = "<tr><td class='classTdLabelNoWidth'>";
//	htmlDett += "<a href='#' onclick='javascript:addRiga();'>Aggiungi</a>";
	htmlDett += "<img src='imagexPix/button/plus.png' width='25' height='25' title ='Nuova riga dettaglio' onclick='javascript:addRiga();' style='border:0;cursor:pointer;'>";
	htmlDett += "&nbsp;<label id='lblRiga_" + indice + "'>Riga "+ indice +"</label></td><td class='classTdField'><textarea id ='RIGA_" + indice +"' name ='RIGA_" + indice +"' rows ='3' style='width:100%'></textarea></td></tr>";
	$("table[class='classDataEntryTable']").first().append(htmlDett);
	
}

function getDettRighe(){
	var strOutput = "";
	
	$("textarea[id^='RIGA_']").each(function(index){
//		alert($(this).val() + " " + $(this).attr("id"));
		var valore = "";
		valore = $(this).val().replace(/"/g, '\\"');
		if (strOutput!=""){
			strOutput += ",\"" + $(this).attr("id") + "\":\"" + valore +"\"";
		}
		else{
			strOutput += "\"" + $(this).attr("id") + "\":\"" + valore +"\"";			
		}
	});
	if (strOutput!=""){
		strOutput = "{" + strOutput + "}";
	}
	return strOutput;
}

// verrà usata questa funzione per il salvataggio,
// il motivo è dato dal fatto che aggiungere il salvataggio "al volo",
// lato client, di un nuovo campo NON è fattibile senza dover necessariamente
// cambiare la parte java, quindi rifaccio tutto lato client
function registraSala(){
	try{
		var idenSal = "";
		try{idenSal = document.form_sale.iden.value;}catch(e){;}
		var attivo = $("input[name='attivo']").first().attr('checked')==true?'N':'S';
		var AEtitle = $("select[name='aetitle']").first().val();
		
		var dettRighe = getDettRighe();
		var tipoOperazione = idenSal == ""?"I":"M";
		if (idenSal == ""){
			// controllare se cod_dec è duplicato
			/*
			var rs = opener.top.executeQuery('tab_sal.xml','getSalaByCodDec',[$("input[name='cod_dec']").first().val()]);
			if (rs.next()){
				alert("Codice gia' utilizzato per " + rs.getString("descr") + ". Prego cambiarlo.");
				document.form_sale.cod_dec.focus();
				return;
			}
			return;*/
			// inserimento

//			alert($("input[name='cod_dec']").first().val()+ "*" +$("input[name='descr']").first().val()+ "*" + attivo + "*" +$("select[name='reparto']").first().val()+ "*" + AEtitle + "*" +$("#txtNote").val());
			var stm = opener.top.executeStatement('tab_sal.xml','insertSala',[$("input[name='cod_dec']").first().val(),
						 $("input[name='descr']").first().val(),
						 attivo,
						 $("select[name='reparto']").first().val(),
						 AEtitle,
						 $("#txtNote").val(),
						 dettRighe],1);
			if (stm[0]!="OK"){
				alert("Errore: problemi nella salvataggio. " + stm[1]);
				return;
			}
			else{
				//tutto ok chiudo
				idenSal = stm[2];
			}
		}
		else{
			// modifica
//						alert($("input[name='cod_dec']").first().val()+ "*" +$("input[name='descr']").first().val()+ "*" + attivo + "*" +$("select[name='reparto']").first().val()+ "*" + AEtitle + "*" +$("#txtNote").val());
			var stm = opener.top.executeStatement('tab_sal.xml','updateSala',[idenSal,
						$("input[name='cod_dec']").first().val(),
						 $("input[name='descr']").first().val(),
						 attivo,
						 $("select[name='reparto']").first().val(),
						 AEtitle,
						 $("#txtNote").val(),
						 dettRighe],0);
			if (stm[0]!="OK"){
				alert("Errore: problemi nella salvataggio ! " + stm[1]);
				return;
			}
			else{
			    alert(ritornaJsMsg('a3'));
			}			
		}
		// salvo operazione, come da codice java. Serve ancora ?
		try{
		var stmOp = opener.top.executeStatement('tab_sal.xml','insertOperation',[idenSal,tipoOperazione,opener.baseUser.LOGIN, "TAB_SAL"],0);
			if (stmOp[0]!="OK"){
				alert("Errore: problemi nella salvataggio ! " + stmOp[1]);
				return;
			}
		}catch(e){;}
		// chiudo e aggiorno
		chiudi_ins_mod();
		
		
	}
	catch(e){
		alert("salvaNote - Error: " + e.description);
	}
}



// ***************************
// ***************************************************************************

function chiudi()
{
	opener.aggiorna_worklist();
	self.close();
}


function chiudi_ins_mod()
{
	var tipo_ricerca;
	var campo_descr;
	tipo_ricerca = opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value;
	if(tipo_ricerca == 'DESCR')
		campo_descr = document.form_sale.descr.value;
    else
		campo_descr = document.form_sale.cod_dec.value;
	opener.parent.Ricerca.put_last_value(campo_descr);
	self.close();
}
    
function salva()
{
	reg = true;
	doc=document.form_sale;
    if (doc.cod_dec.value=='')
	{
        alert(ritornaJsMsg('a1'));
        doc.cod_dec.focus();
        return;
	}
    if (doc.descr.value=='')
	{
    	alert(ritornaJsMsg('a2'));
        doc.descr.focus();
        return;
	}
    if (doc.attivo.checked==1) 
    	doc.hattivo.value = 'N';
    else
 	    doc.hattivo.value= 'S';
    doc.registrazione.value = reg;
    doc.submit();
    alert(ritornaJsMsg('a3'));
    chiudi_ins_mod();
}

/*
	Funzione richiamata dalla funzione di callback del dwr (cbkJsCheck())
	contenuta nel file check.js
*/
function funzione()
{
	document.form_sale.cod_dec.value = '';
	document.form_sale.cod_dec.focus();
}