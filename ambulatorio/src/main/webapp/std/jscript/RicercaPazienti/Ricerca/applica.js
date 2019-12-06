//var hnd_attesa='';

// modifica aldo  27/8/14 per radioterapia
var bolCreaGestRadioTerap =false;
// modifica 14-5-15
var bolRicercaAnonimato = false;
var bolAlready_initRicercaAnonimato = false;
// modifica 7-8-15
$(function(){
   //  resize dei campi x stare nei 1024*768
   $("input[type='text'][id='idcampo0'][name='COGN']").attr("size",25);   
   $("input[type='text'][id='idcampo1'][name='NOME']").attr("size",15);      
   $("input[type='text'][id='idcampo0'][name='COD_FISC']").attr("size",16);
   $("input[type='text'][id='idcampo2'][name='DATA']").attr("size",8);
   $("input[type='text'][id='idcampo7'][name='NUM_CARTELLA']").attr("size",12);   
});
// ****************
function initRicercaAnonimato(){
	try{
		var bolFoundMatch=false;
		if (bolAlready_initRicercaAnonimato){return;}
		try{
			var anonimato_repartiAbilitati = top.home.getConfigParam("GESTIONE_ANONIMATO.REPARTI").split(",");
		}
		catch(e){
			var anonimato_repartiAbilitati = [];
		}
		for (var z=0;z<anonimato_repartiAbilitati.length;z++){
			for (var k=0;k<baseUser.LISTAREPARTI.length;k++){
				if (baseUser.LISTAREPARTI[k]==anonimato_repartiAbilitati[z]){
					bolFoundMatch = true;
					break;
				}
			}
			if (bolFoundMatch) {break;}
		}
		if 	(bolFoundMatch){bolRicercaAnonimato=true;}	
	}
	catch(e){
		alert("jQuery initRicercaAnonimato Ready -" + e.description);
		bolRicercaAnonimato =false;
	}
}

function resetCampiAnonimato(){
	try{
		var bolAnonimo = $("#chkAnonimato").attr("checked");
		document.form_pag_ric.reset();
		if (bolAnonimo){
			document.form_pag_ric.NOME.value ="ANONIMO";
			$("#chkAnonimato").attr("checked", bolAnonimo);
		}
		document.form_pag_ric.COGN.focus();		
	}
	catch(e){
		alert("resetCampiAnonimato " + e.description);
	
	}
}
// *******************


var bolAlready_initRadioTerapInfo = false;
jQuery(function($){
	$("input[name='COGN']").first().focus();
try{	$("#idcampo2").mask("99/99/9999");}catch(e){;}
            
});

function initRadioTerapInfo(){
	try{
		if (bolAlready_initRadioTerapInfo){return;}
		bolAlready_initRadioTerapInfo = true;
		if (baseUser.LOGIN=="" || typeof(baseUser.LOGIN)=="undefined"){
			initbaseUser();
		}
		try{
			var radioTerap_utentiAbilitati = top.home.getConfigParam("GESTIONE_NUM_CART_RADTERAP.UTENTI_ABILITATI").split(",");
		}
		catch(e){
			var radioTerap_utentiAbilitati = [];
		}
		if (radioTerap_utentiAbilitati.length >0){
			try{
				for (var k=0;k<radioTerap_utentiAbilitati.length;k++){
					if (radioTerap_utentiAbilitati[k]==baseUser.LOGIN){
						bolCreaGestRadioTerap = true;
						break;
					}
				}
				
			}catch(e){}
		}
	}
	catch(e){
		alert("jQuery Ready -" + e.description);
		bolCreaGestRadioTerap =false;
	}	
}


// dal momento che la where su num_cartella della vista
// è troppo lenta aggiro il problema spezzando le select
// la funzione ritorna l'iden_anag sul quale filtrare
function getIdenAnagRadioTerapia (numCartella){
	var strOutput = "";
	var strReparto  = "";
	try{
		for (var i=0;i<baseUser.LISTAREPARTI.length;i++){
			if (strReparto==""){
				strReparto = baseUser.LISTAREPARTI[i];				
			}
			else{
				strReparto += "," + baseUser.LISTAREPARTI[i];
			}
		}
		
		try{var rs = top.executeQuery('radioTerapia.xml','getIdenAnagRadioTerapia',[numCartella,strReparto]);}catch(e){alert("Errore: getIdenAnagRadioTerapia!!!!");return;}
		while (rs.next()){
			if (strOutput==""){
				strOutput = rs.getString("IDEN_ANAG");
			}
			else{
				strOutput += ","+rs.getString("IDEN_ANAG");
			}
		}
		
	}
	catch(e){
		alert("getIdenAnagRadioTerapia error: " + e.description);
	}	
	return strOutput;
}

function tastiNumCartella()
{
	if(window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaNumCartella();
 	}
}

function ricercaNumCartella(numero_pagina){
	
	var doc = document.form_pag_ric;
	
	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';
	
	doc.hidcampo0.value = doc.COD_FISC.value;	

	if(numero_pagina == '-100'){
		doc.hidWhere.value = "where iden = '-100'";		
		doc.submit();		
	}	
	else{
		
		if(numero_pagina != '' && typeof(numero_pagina)!= "undefined")
			doc.pagina_da_vis.value = numero_pagina;
			
		if(doc.provenienza.value == '')
			doc.provenienza.value = 'FromMenuVerticalMenu';	
			
			var iden_anag = getIdenAnagRadioTerapia(doc.NUM_CARTELLA.value);
			if (iden_anag==""){
				alert("Nessun paziente corrisponde ai criteri inseriti.");
				return;
			}
//			doc.hidWhere.value = "where RADTERAP_NUM_CARTELLA = '" + doc.NUM_CARTELLA.value + "'";
			doc.hidWhere.value = "where iden in (" + iden_anag +")";
			doc.hidOrder.value = "order by cogn, nome, data";
			doc.submit();
			top.home.apri_attesa();

	}
	
	if(parent.worklistInfoEsame)
	{
		var righeFramRicerca = parent.document.all.oFramesetRicercaPaziente.rows.split(',');
		parent.document.all.oFramesetRicercaPaziente.rows = righeFramRicerca[0] + ',*,0,0';
	}	
	
}
// ********************************************************
// ********************************************************
 
function applica(pagina){
	var tipoRicercaAnagraficaUtente = parent.RicPazWorklistFrame.baseUser.TIPO_RICERCA_ANAGRAFICA;	
	
	//alert('applica(): tipoRicerca = ' + tipoRicercaAnagraficaUtente);
	/*
	if(tipoRicercaAnagraficaUtente == '0')
		ricercaCognNomeData(pagina);
		
	if(tipoRicercaAnagraficaUtente == '1')
		ricercaCodiceFiscale(pagina);
		
	if(tipoRicercaAnagraficaUtente == '2')
		ricercaNumeroArchivio(pagina);
		
	if(tipoRicercaAnagraficaUtente == '3')
		ricercaIdPazDicom(pagina);
		
	if(tipoRicercaAnagraficaUtente == '4')
		ricercaNumeroNosologico(pagina);
	
	if(tipoRicercaAnagraficaUtente == '5')
		ricercaNumeroArchivioNumOld(pagina);
		
	if(tipoRicercaAnagraficaUtente == '6')
		ricercaDaConfigurare(pagina);	*/
	switch (tipoRicercaAnagraficaUtente){
		case "0", "A":
			ricercaCognNomeData(pagina);
			break;
		case "1", "B":
			ricercaCodiceFiscale(pagina);
			break;
		case "2", "C":
			ricercaNumeroArchivio(pagina);
			break;
		case "3", "D":
			ricercaIdPazDicom(pagina);
			break;
		case "4", "E":
			ricercaNumeroNosologico(pagina);
			break;
		case "5", "F":
			ricercaNumeroArchivioNumOld(pagina);
			break;
		case "6", "G":
			// una volta era solo questo
			ricercaDaConfigurare(pagina);	
			break;			
		default:
			break;
	}
}


/**
	Funzione richiamata all'onLoad della parte di ricerca di Ricerca Pazienti
*/
function caricamento()
{	
	fillLabels(arrayLabelName,arrayLabelValue);
	document.getElementById("idcampo0").focus();
	
	tutto_schermo();	
}

/**
	
*/
function raddoppia_apici(valore)
{
	var stringa = valore.replace(/\'/g, "\'\'");//var stringa = valore.replace('\'', '\'\'');
	return stringa;
}



/**
	
*/
function chiudi()
{
	parent.opener.parent.worklistTopFrame.ricerca();
	parent.close();
}



/*
 * Start RICERCA ANAGRAFICA per COGNOME, NOME E DATA DI NASCITA
 */
function ricercaCognNomeData(numero_pagina)
{
	var doc = document.form_pag_ric;
	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';
	var strWhere = "";
	
	// ************************
	// modifica aldo 27/8/14
	initRadioTerapInfo();
	// *****************************
	// modifica 14-5-15
	initRicercaAnonimato();
	// *******************

	
	try{doc.COGN.focus();}catch(e){;}
	if(doc.provenienza.value == '')
		doc.provenienza.value = 'FromMenuVerticalMenu';
	
	doc.hidcampo0.value = doc.COGN.value;
	
	if (typeof(numero_pagina)!="undefined"){
		if(doc.hCOGN.value != '' || doc.hNOME.value != '' || doc.hDATA.value != ''){
			doc.COGN.value = doc.hCOGN.value;
			doc.NOME.value = doc.hNOME.value;
			doc.DATA.value = doc.hDATA.value;
		}
	}
	else{
		// caso in cui arrivo da una ricerca
		// voluta dall'utente
		doc.hCOGN.value = doc.COGN.value ;
		doc.hNOME.value = doc.NOME.value ;
		doc.hDATA.value = doc.DATA.value ;
	}
 
	if(numero_pagina == '-100' && doc.COGN.value == ''){
		// ************ modifica CF
		// primo caricamento
		$("table[class='classDataEntryTable']").each(function(){
			var  strTmp = "<TR>";
			strTmp += "<TD class=classTdLabelNoWidth width='100'>Cognome</TD>";
			strTmp += "<TD class=classTdField ><INPUT id=idcampo0 onkeypress=javascript:tastiCND(); size=30 name=COGN> </INPUT></TD>";
			strTmp += "<TD class=classTdLabelNoWidth width='100'>Nome</TD>";
			strTmp += "<TD class=classTdField><INPUT id=idcampo1 onkeypress=javascript:tastiCND(); size=30 name=NOME> </INPUT></TD>";
			strTmp += "<TD class=classTdLabelNoWidth width='100'>Data di Nascita</TD>";
			strTmp += "<TD class=classTdField ><INPUT id=idcampo2 onkeypress=javascript:tastiCND(); size=30 name=DATA> </INPUT></TD>";
			strTmp += "<TD class=classTdLabelNoWidth width='100'>Codice Fiscale</TD>";
			strTmp += "<TD class=classTdField ><input size='30' id='idcampo0' value='' name='COD_FISC' onKeyPress='javascript:tastiCF();' type='text'></INPUT><input type='hidden' id='redrawnLayout' /></TD>";
			if (bolCreaGestRadioTerap){
				strTmp += "<TD class=classTdLabelNoWidth width='100'>N.Cartella</TD>";
				strTmp += "<TD class=classTdField ><input size='30' id='idcampo7' value='' name='NUM_CARTELLA' onKeyPress='javascript:tastiNumCartella();' type='text'></INPUT></TD>";				
			}
			// modifica 14-5-15
			if (bolRicercaAnonimato){
				strTmp += "<TD class=classTdLabelNoWidth width='100'>Anonimato</TD>";
				strTmp += "<TD class=classTdField ><input type='checkbox' id='chkAnonimato' value='S' onclick='javascript:resetCampiAnonimato();' /></TD>";								
			}
			// **************************
			strTmp +="</TR>";
			jQuery(this).html(strTmp);
			//alert(jQuery(this).html());
			if (doc.provenienza.value != "RiconciliaSpostaEsami"){try{parent.document.all.oFramesetRicercaPaziente.rows = "85,*";}catch(e){;}}
		 });
		doc.hidWhere.value = "where iden = '-100'";		
		doc.submit();		
	}
	else
	{	

		// modifica per ciclica dopo prenotazione !!
		// vedere di unificare con caso precedente
		// SOLO nel caso non esista il CF
		
		//if (typeof(document.getElementById("redrawnLayout"))=="undefined"){ 
		if (typeof(doc.COD_FISC)=="undefined"){ 
			var myCogn = doc.COGN.value;
			var myNome = doc.NOME.value;
			var myData = doc.DATA.value;	
			$("table[class='classDataEntryTable']").each(function(){
				var  strTmp = "<TR>";
				strTmp += "<TD class=classTdLabelNoWidth width='100'>Cognome</TD>";
				strTmp += "<TD class=classTdField ><INPUT id=idcampo0 onkeypress=javascript:tastiCND(); size=30 name=COGN> </INPUT></TD>";
				strTmp += "<TD class=classTdLabelNoWidth width='100'>Nome</TD>";
				strTmp += "<TD class=classTdField><INPUT id=idcampo1 onkeypress=javascript:tastiCND(); size=30 name=NOME> </INPUT></TD>";
				strTmp += "<TD class=classTdLabelNoWidth width='100'>Data di Nascita</TD>";
				strTmp += "<TD class=classTdField ><INPUT id=idcampo2 onkeypress=javascript:tastiCND(); size=30 name=DATA> </INPUT></TD>";
				strTmp += "<TD class=classTdLabelNoWidth width='100'>Codice Fiscale</TD>";
				strTmp += "<TD class=classTdField ><input size='30' id='idcampo0' value='' name='COD_FISC' onKeyPress='javascript:tastiCF();' type='text'></INPUT></TD>";
				if (bolCreaGestRadioTerap){
					strTmp += "<TD class=classTdLabelNoWidth width='100'>N.Cartella</TD>";
					strTmp += "<TD class=classTdField ><input size='30' id='idcampo7' value='' name='NUM_CARTELLA' onKeyPress='javascript:tastiNumCartella();' type='text'></INPUT></TD>";				
				}
				// modifica 14-5-15
				if (bolRicercaAnonimato){
					strTmp += "<TD class=classTdLabelNoWidth width='100'>Anonimato</TD>";
					strTmp += "<TD class=classTdField ><input type='checkbox' id='chkAnonimato' value='S' onclick='javascript:resetCampiAnonimato();' /></TD>";								
				}
				// **************************				
				strTmp +="</TR>";
				jQuery(this).html(strTmp);
				//alert(jQuery(this).html());
				if (doc.provenienza.value != "RiconciliaSpostaEsami"){try{parent.document.all.oFramesetRicercaPaziente.rows = "85,*";}catch(e){;}}
			 });	
			
			  if(myCogn != '' || myNome != '' || myData != ''){
				doc.COGN.value = myCogn;
				doc.NOME.value = myNome;
				doc.DATA.value = myData;
			  }		
		}
		// ******************************************
		// ******************************************		
		if(numero_pagina != '')
			doc.pagina_da_vis.value = numero_pagina;
		
		doc.COGN.value = doc.COGN.value.toUpperCase();
		doc.NOME.value = doc.NOME.value.toUpperCase();
	
		if (doc.COD_FISC.value!=""){
			if(!controllo_COD_FISC()){
				return;
			}
		}

		// *****************************
		
		// modifica 14-5-15
		if (bolRicercaAnonimato){
			var idenAnagAnonimo = "";
			if ($("#chkAnonimato").attr("checked")){
				// ricerca in anonimato
				// devo transcodificare e rimappare
	//			getAnonimo 			gestione_anonimato.xml
				try{var rs = top.executeQuery('gestione_anonimato.xml','getAnonimo',[doc.COGN.value, doc.NOME.value]);}catch(e){alert("Errore: getAnonimo!!!!");return;}
				if (rs.next()){
					idenAnagAnonimo = rs.getString("iden");
				}
			}
		}
		// ******************************		

		if(controllo_cognomeCND())
		{
			strWhere = ""
			if (doc.COGN.value!=""){
				strWhere = "cogn like '" + raddoppia_apici(doc.COGN.value) + "%'";
			}

			if(doc.NOME.value != ''){
				if (strWhere!=""){
					strWhere += " and nome like '" + raddoppia_apici(doc.NOME.value) + "%'";
				}
				else{
					strWhere = "nome like '" + raddoppia_apici(doc.NOME.value) + "%'";
				}
			}
			if(doc.DATA.value != ''){
				if (strWhere!=""){				
					strWhere += " and data = '" + doc.DATA.value + "'";
				}
				else{
					strWhere = " data = '" + doc.DATA.value + "'";					
				}
			}
			if(doc.COD_FISC.value != ''){
				if (strWhere!=""){				
					strWhere += " and COD_FISC = '" + doc.COD_FISC.value + "'";
				}
				else{
					strWhere = " COD_FISC = '" + doc.COD_FISC.value + "'";					
				}
			}			
			// **************************************************************			
			// modifica aldo 27/8/14
			if (bolCreaGestRadioTerap){
				if (doc.NUM_CARTELLA.value!=""){
					
					var iden_anag = getIdenAnagRadioTerapia(doc.NUM_CARTELLA.value);
					if (iden_anag==""){
						alert("Nessun paziente corrisponde ai criteri inseriti.");
						return;
					}
					if (strWhere!=""){
						strWhere += " and iden in(" + iden_anag +")";
					}
					else{
						strWhere = " iden in(" + iden_anag +")";
					}
				}
			}
			// **************************************************************
			
			// modifica 14-5-15
			if (bolRicercaAnonimato && $("#chkAnonimato").attr("checked") && idenAnagAnonimo!="" && idenAnagAnonimo!="undefined"){
				strWhere = " iden = " + idenAnagAnonimo;
			}
			// ***************
			if (strWhere!=""){
				strWhere = "where " + strWhere;
			}
			else{
				alert("Errore GRAVE - Nessun criterio di ricerca!");
				return;
			}
//			alert(strWhere);			
			doc.hidWhere.value = strWhere;
			doc.hidOrder.value = "order by cogn, nome, dataorder";
	
			doc.submit();
	
			try{
				top.home.apri_attesa();
			}
			catch(e){
				//alert(e.description);
			}
		}
	}

	//alert('frame info esame: ' + parent.worklistInfoEsame);
	
	if(parent.worklistInfoEsame)
	{
		var righeFramRicerca = parent.document.all.oFramesetRicercaPaziente.rows.split(',');
		parent.document.all.oFramesetRicercaPaziente.rows = righeFramRicerca[0] + ',*,0,0';
	}
}


/**
	
*/
function controllo_cognomeCND()
{
	var ricerca = false;
	var doc = document.form_pag_ric;
	
	if(doc.DATA.value != '')
	{
		ricerca = true;
	}
	else
	{	

	
		doc.COGN.value = replace_stringa(doc.COGN.value, "'");
		doc.NOME.value = replace_stringa(doc.NOME.value, "'");

		// **************************************************************			
		// modifica aldo 27/8/14
		if (bolCreaGestRadioTerap && doc.NUM_CARTELLA.value!=""){
			return true;
		}
		// ***************************************************************
		//alert('RES: ' + doc.COGN.value);return;
		
		// modifica 14-5-15
		if (!bolRicercaAnonimato){
			for(i = 0; i < doc.COGN.value.length; i++){
				if(doc.COGN.value.substring(i, i+1) == '_')
				{
					alert(ritornaJsMsg('alert_underscore'));
					doc.COGN.value == '';
					ricerca = false;
					return;
				}
			}
		}
		// *************

		// modifica 29-9-15
		if (doc.COD_FISC.value==""){
			if ((doc.COGN.value.indexOf("%") > -1 ) || (doc.NOME.value.indexOf("%") > -1 )){
				alert("Il carattere '%' non e' ammesso");
				return false;			
			}		
			if (
				((doc.COGN.value == '')||(doc.COGN.value.length < 2))||
				((doc.NOME.value == '')||(doc.NOME.value.length < 2))
				){
				alert("Inserire almeno 2 caratteri nel cognome e/o nome");
				return false;
			}
			else
			{
				ricerca = true;
			}
		}
		else{
			ricerca = true;
		}		
		// *************
	}
	return ricerca;
}



/**
	
*/
function apriChiudiCND(){
	ShowHideLayer('div');
	riposiziona_frame_ric_paz();	
}

/**
	
*/
function tastiCND()
{
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaCognNomeData();
 	}
}

/**
	
*/
function resettaDatiCND()
{
	var doc = document.form_pag_ric;
	if(typeof doc.COGN != 'undefined')
	{
	doc.COGN.value = '';
	doc.NOME.value = '';
	doc.DATA.value = '';
		try{ 
			doc.reset();
		}catch(e){}

	
	if(document.getElementById('div').style.display != 'none')
		doc.COGN.focus();
	}
	else
	{
		// modifica aldo
		try{ 
			$("input[name='NUM_CARTELLA']").first().val("");
		}catch(e){}
			
		// ***********
		if(typeof doc.COD_FISC != 'undefined')
		{
			doc.COD_FISC.value = '';
			doc.COD_FISC.focus();
		}
		else
		{
			if(typeof doc.NUM_OLD != 'undefined')
			{
				doc.NUM_OLD.value = '';
				doc.NUM_OLD.focus();
			}
			else
			{
				if(typeof doc.NUM_NOSOLOGICO != 'undefined')
				{
					doc.NUM_NOSOLOGICO.value = '';
					doc.NUM_NOSOLOGICO.focus();
				}
				else
				{
					if(typeof doc.ID_PAZ_DICOM != 'undefined')
					{
						doc.ID_PAZ_DICOM.value = '';
						doc.ID_PAZ_DICOM.focus();
					}
				}
			}
		}
	}
}
/*end RICERCA ANAGRAFICA per COGNOME, NOME E DATA DI NASCITA*/

/*
 * Start RICERCA ANAGRAFICA per NUMERO NOSOLOGICO
 */
function ricercaNumeroNosologico(numero_pagina)
{
	var doc = document.form_pag_ric;
	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';

	doc.hidcampo0.value = doc.NUM_NOSOLOGICO.value;
	
	if(numero_pagina == '-100'){
		doc.hidWhere.value = "where iden = '-100'";
		doc.submit();
	}
	else
	{
		if(numero_pagina != '')
			doc.pagina_da_vis.value = numero_pagina;
		
		doc.NUM_NOSOLOGICO.value = doc.NUM_NOSOLOGICO.value.toUpperCase();
	
		controllo_num_nos();
	}
	
	if(parent.worklistInfoEsame)
	{
		var righeFramRicerca = parent.document.all.oFramesetRicercaPaziente.rows.split(',');
		parent.document.all.oFramesetRicercaPaziente.rows = righeFramRicerca[0] + ',*,0,0';
	}
}


/**
	
*/
function tastiNOS()
{
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaNumeroNosologico();
 	}
}

/**
	
*/
function apriChiudiNOS(){
	ShowHideLayer('div');
	riposiziona_frame_ric_paz();	
}

/**
	
*/
function resettaDatiNOS()
{
	var doc = document.form_pag_ric;
	
	doc.NUM_NOSOLOGICO.value = '';
	if(document.getElementById('div').style.display != 'none')
		doc.NUM_NOSOLOGICO.focus();
}
/*end RICERCA ANAGRAFICA per NUMERO NOSOLOGICO*/



/*
 * Start RICERCA ANAGRAFICA per NUMERO ARCHIVIO - NUM_ARC
 */
function ricercaNumeroArchivio(numero_pagina)
{
	var doc = document.form_pag_ric;

	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';

	doc.hidcampo0.value = doc.NUM_ARC.value;
	
	if(numero_pagina == '-100'){
		doc.hidWhere.value = "where iden = '-100'";
		doc.submit();
	}
	else
	{
		if(doc.provenienza.value == '')
			doc.provenienza.value = 'FromMenuVerticalMenu';
		
		if(numero_pagina != '')
			doc.pagina_da_vis.value = numero_pagina;
		
		doc.NUM_ARC.value = doc.NUM_ARC.value.toUpperCase();
	
		controllo_num_arc('NUM_ARC');
	}
	
	if(parent.worklistInfoEsame)
	{
		var righeFramRicerca = parent.document.all.oFramesetRicercaPaziente.rows.split(',');
		parent.document.all.oFramesetRicercaPaziente.rows = righeFramRicerca[0] + ',*,0,0';
	}
}

/**
	
*/
function tastiNA()
{
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaNumeroArchivio();
 	}
}

/**
	
*/
function apriChiudiNA(){
	ShowHideLayer('div');
	riposiziona_frame_ric_paz();	
}

/**
	
*/
function resettaDatiNA()
{
	var doc = document.form_pag_ric;
	
	doc.NUM_ARC.value = '';
	
	if(document.getElementById('div').style.display != 'none')
		doc.NUM_ARC.focus();
}
/*end RICERCA ANAGRAFICA per NUMERO ARCHIVIO NUM_ARC*/









/*
 * Start RICERCA ANAGRAFICA per NUMERO ARCHIVIO - NUM_OLD
 */
function ricercaNumeroArchivioNumOld(numero_pagina)
{
	var doc = document.form_pag_ric;

	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';

	// modifica aldo 18/12/14
	try{$("#Lricerca").attr("href","javascript:ricercaNumeroArchivioNumOld();");
	$("table[class='classDataEntryTable']").find("td:first").html("Numero archivio scheda");}catch(e){;}
	// *************

	doc.hidcampo0.value = doc.NUM_OLD.value;
	
	if(numero_pagina == '-100'){
		doc.hidWhere.value = "where iden = '-100'";
		doc.submit();
	}
	else
	{
		if(doc.provenienza.value == '')
			doc.provenienza.value = 'FromMenuVerticalMenu';
		
		if(numero_pagina != '')
			doc.pagina_da_vis.value = numero_pagina;
		
		doc.NUM_OLD.value = doc.NUM_OLD.value.toUpperCase();
	
		controllo_num_arc('NUM_OLD');
	}
	
	if(parent.worklistInfoEsame)
	{
		var righeFramRicerca = parent.document.all.oFramesetRicercaPaziente.rows.split(',');
		parent.document.all.oFramesetRicercaPaziente.rows = righeFramRicerca[0] + ',*,0,0';
	}
}

/**
	
*/
function tastiNO()
{
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaNumeroArchivioNumOld();
 	}
}

/**
	
*/
function apriChiudiNO(){
	ShowHideLayer('div');
	riposiziona_frame_ric_paz();	
}

/**
	
*/
function resettaDatiNO()
{
	var doc = document.form_pag_ric;
	
	doc.NUM_OLD.value = '';
	
	if(document.getElementById('div').style.display != 'none')
		doc.NUM_OLD.focus();
}
/*end RICERCA ANAGRAFICA per NUMERO ARCHIVIO - NUM_OLD*/








/*
 * Start RICERCA ANAGRAFICA per CODICE FISCALE
 */
function ricercaCodiceFiscale(numero_pagina)
{
	var doc = document.form_pag_ric;
	
	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';
	
	doc.hidcampo0.value = doc.COD_FISC.value;	

	if(numero_pagina == '-100'){
		doc.hidWhere.value = "where iden = '-100'";		
		doc.submit();		
	}	
	else{
		if(numero_pagina != '')
			doc.pagina_da_vis.value = numero_pagina;
			
		if(doc.provenienza.value == '')
			doc.provenienza.value = 'FromMenuVerticalMenu';	
		
		doc.COD_FISC.value = doc.COD_FISC.value.toUpperCase();
		
		if(controllo_COD_FISC())
		{
			doc.hidWhere.value = "where cod_fisc = '" + doc.COD_FISC.value + "'";
	
			doc.hidOrder.value = "order by cod_fisc";
		
			doc.submit();
			
			top.home.apri_attesa();
		}
	}
	
	if(parent.worklistInfoEsame)
	{
		var righeFramRicerca = parent.document.all.oFramesetRicercaPaziente.rows.split(',');
		parent.document.all.oFramesetRicercaPaziente.rows = righeFramRicerca[0] + ',*,0,0';
	}
}

/**
	
*/
function apriChiudiCF(){
	ShowHideLayer('div');
	riposiziona_frame_ric_paz();	
}

/**
	
*/
function tastiCF()
{
	if(window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaCodiceFiscale();
 	}
}


/**
	
*/
function resettaDatiCF()
{
	var doc = document.form_pag_ric;
	
	doc.COD_FISC.value = '';

	if(document.getElementById('div').style.display != 'none')
		doc.COD_FISC.focus();
}
/*end RICERCA ANAGRAFICA per CODICE FISCALE*/


/*
 * Start RICERCA ANAGRAFICA per ID_PAZ_DICOM
 */
function ricercaIdPazDicom(numero_pagina)
{
	var doc = document.form_pag_ric;
	
	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';

	doc.hidcampo0.value = doc.ID_PAZ_DICOM.value;
	
	if(numero_pagina == '-100'){
		doc.hidWhere.value = "where iden = '-100'";
		doc.submit();
	}
	else
	{
		if(doc.ID_PAZ_DICOM.value == ''){
			alert(ritornaJsMsg('alert_id_paz_dicom'));
			doc.ID_PAZ_DICOM.focus();
			return;
		}
		else{
			if(numero_pagina != '')
			doc.pagina_da_vis.value = numero_pagina;
		
			doc.ID_PAZ_DICOM.value = doc.ID_PAZ_DICOM.value.toUpperCase();
	
			controllo_ID_PAZ_DICOM();
		}
	}
	
	if(parent.worklistInfoEsame)
	{
		var righeFramRicerca = parent.document.all.oFramesetRicercaPaziente.rows.split(',');
		parent.document.all.oFramesetRicercaPaziente.rows = righeFramRicerca[0] + ',*,0,0';
	}
}


/**
	
*/
function tastiIPD()
{
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaIdPazDicom();
 	}
}

/**
	
*/
function apriChiudiIPD(){
	ShowHideLayer('div');
	riposiziona_frame_ric_paz();	
}

/**
	
*/
function resettaDatiIPD()
{
	var doc = document.form_pag_ric;
	
	doc.ID_PAZ_DICOM.value = '';
	if(document.getElementById('div').style.display != 'none')
		doc.ID_PAZ_DICOM.focus();
}
/*end RICERCA ANAGRAFICA per ID_PAZ_DICOM*/



/*
 * Start RICERCA ANAGRAFICA da CONFIGURARE
 */
function ricercaDaConfigurare(numero_pagina){
	var doc = document.form_pag_ric;
	document.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr')[0].getElementsByTagName('td')[1].innerHTML='Ricerca Per Id Anagrafica Centrale'
	document.getElementById('div').getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr')[0].getElementsByTagName('td')[0].innerHTML='Id Anagrafica Centrale'
	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';

	doc.hidcampo0.value = doc.DA_CONFIGURARE.value;
	
	if(numero_pagina == '-100'){
		doc.hidWhere.value = "where iden = '-100'";
		doc.submit();
	}
	else
	{
		if(doc.DA_CONFIGURARE.value == ''){
			alert('Attenzione: popolare il campo da ricercare');
			doc.DA_CONFIGURARE.focus();
			return;
		}
		else{
			if(numero_pagina != '')
				doc.pagina_da_vis.value = numero_pagina;
		
			doc.DA_CONFIGURARE.value = doc.DA_CONFIGURARE.value.toUpperCase();
			
			doc.hidWhere.value = "where DA_CONFIGURARE like '" + raddoppia_apici(doc.DA_CONFIGURARE.value) + "%'";

			doc.hidOrder.value = "order by cogn, nome, dataorder";
			
			doc.submit();

			try{
				top.home.apri_attesa();
			}
			catch(e){
			}
		}
	}
}


function tastiDaConfigurare(){
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaDaConfigurare();
 	}
}


function apriChiudiDaConfigurare(){
	ShowHideLayer('div');
	riposiziona_frame_ric_paz();	
}

function resettaDatiDaConfigurare(){
	var doc = document.form_pag_ric;
	
	doc.DA_CONFIGURARE.value = '';
	if(document.getElementById('div').style.display != 'none')
		doc.DA_CONFIGURARE.focus();
}


/*end RICERCA ANAGRAFICA per DA CONFIGURARE*/
