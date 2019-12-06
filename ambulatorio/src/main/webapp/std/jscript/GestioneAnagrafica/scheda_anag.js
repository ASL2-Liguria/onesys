var _INSERISCI_ESAME 	= 'N';	//	Apre scheda esame dopo il salvataggio della scheda anagrafica
var _CTRL_XMPI			= 'N';	//	Se esiste codice esterno XMPI, non rende possibile la modifica dei campi obbligatori
var stato				= 'I';
/*	Per scheda anagrafica fatta con generatore Jack	*/

/*
 *	Al caricamento della pagina
 */
var configSito = "SAVONA";
$(document).ready(function() 
{	
	try{
		configSito = opener.top.home.getConfigParam("SITO");
	}
	catch(e){
		//alert("Nessun sito configurato, error: " + e.description);
	}
	// modifica 7-10-15
	if (configSito=="SAVONA"){
		$("table[class='classTabHeader']").each(function(indice, valore){
			// nascondo layer trattamento dati
			if (indice==9 ){
				//$(this).hide();
			}
		});
	}
	// ***********

	// **** pinned ****
	var pin = jQuery('[name = "txtID4"]').val();	
	// ****************
	//	Per nascondere il tasto registra
	//	hideRegistra();
	
	//	Titolo pagina
	//	baseGlobal.SOTTONUMERO == 'N' -> NUM_ARC
	//	baseGlobal.SOTTONUMERO == 'S' -> NUM_OLD, Reparto
	/*personalizzazione per savona: non visibili i campi num civico*/
	jQuery("#txtCivico,#txtCivico2").hide();
	jQuery("#lblCivico,#lblCivico2").parent().html("");

	if($('#IDEN_ANAG').val() != null)
	{
		$('#lblSconosciuto').parent().parent().hide();
		var Narchivio = "";
		
		if($('input[name="hNumArc"]').val() != "")
		{
			if(baseGlobal.SOTTONUMERO == 'N'){
				Narchivio = " (N. Archivio: " + $('input[name="hNumArc"]').val() + ")";
			}else{
				Narchivio = " (N. Archivio: " + $('input[name="hNumOld"]').val() + " Reparto: " + $('input[name="hNaRep"]').val() + ")";
			}
		}
		$('#titBase').after(" "+$('#txtCogn').val()+" "+$('#txtNome').val()+" - nato il "+$('#txtDataNasc').val()+Narchivio);
		$('#lblRegInsEsa').parent().parent().remove();
	}
	else
	{
		$('#titBase').after("Inserimento nuovo paziente");
		$('#titBase').hide();
		$('#lblStampa').parent().hide();
	}
	
	//	Riceve dati in ingresso in caso di inserimento nuovo paziente
	if($('#COGNOME').val() != ""){ $('#txtCogn').val($('#COGNOME').val());}
	if($('#NOME').val() != ""){ $('#txtNome').val($('#NOME').val());}
	if($('#DATA').val() != ""){ $('#txtDataNasc').val($('#DATA').val());}
	if($('#COD_FISC').val() != ""){ $('#txtCodFisc').val($('#COD_FISC').val());}
	
	//	Nasconde il tasto registra se la pagina e' readonly
	/* modifica aldo 12-14 */
	// aggiunto controllo su SBLOCCA_READONLY
	if((_STATO_PAGINA == 'R') && (jQuery('#SBLOCCA_READONLY').length==0)){ 
		hideRegistra();
		$("input").attr("readonly","readonly").addClass("inputReadOnly");
	}
	
	//	Aggiustamenti alla grafica	(non possibili con configuratore)
	$('#txtIDcitt').parent().addClass("w25p");
	$('#txtNtes').parent().addClass("w25p");
	$('#txtICT').parent().addClass("w25p");	

	//	Impostazione trattamento dati
	var consenso = $('input[name="hTrattamentoDati"]').val();
	if(consenso == 'S'){ $('input[name="radTrattamentoDati"]')[0].checked = true;}
	

	// hMADRELINGUA
	jQuery("[name=cmbMadrelingua]").find("option").each(function(){
		//alert(jQuery(this).val() + "-" + document.getElementById("hMADRELINGUA").value);
		if (jQuery(this).val() == document.getElementById("hMADRELINGUA").value){
			jQuery(this).attr("selected", "selected");
		}
	})
	
	jQuery("[name=cmbMadrelingua]").change(function(){
		//alert(jQuery(this).val());
		document.getElementById("hMADRELINGUA").value = jQuery(this).val(); 
//		$('#hMADRELINGUA').val(jQuery(this).val());
	});
	
	
	//	Certificazione
	
	var cert = $('#txtCert').val();
	switch(cert)
	{
		case 'S':
			$('#txtCert').val("Si");
			hideRegistra();
			break;
		
		case 'CE': case 'CP':
			$('#txtCert').val("Dato certificato");
			$("input").not("input[STATO_CAMPO='E']").attr("readonly","readonly").addClass("inputReadOnly");
			break;
			
		case 'NC':
			$('#txtCert').val("Dato NON certificato ma validato");
			hideRegistra();
			break;
		case 'NV':
			$('#txtCert').val("Dato NON certificato e NON validato");
			hideRegistra();
			break;
		case 'IN':
			$('#txtCert').val("Dato incompleto");
			hideRegistra();
			break;
	}
	
	//	Check/Unchek sul click sul trattamento dati
	$('input[name="hTrattamentoDati"]').val('N');
	$('input[name="radTrattamentoDati"]').click(function(){
		var consenso = $('input[name="hTrattamentoDati"]').val();
		if(consenso == 'N'){
			$('input[name="hTrattamentoDati"]').val('S');
			$('input[name="radTrattamentoDati"]')[0].checked = true;
		}else {
			$('input[name="hTrattamentoDati"]').val('N');
			$('input[name="radTrattamentoDati"]')[0].checked = false;
		}
	});
	
	//	Calcolo anni/mesi
	if($('#txtDataNasc').val() != ""){	
		if($('#txtDataNasc').val() != ""){
			dataN = checkData($('#txtDataNasc').val());
			switch(dataN){
				case -1:
					alert("Errore - La data di nascita del paziente ha un formato errato (gg/mm/aaaa)");
				break;
				case -2:
					alert('Errore - La data di nascita del paziente ha valore futuro');
				break;
				case -3:
					alert('Errore - La data di nascita del paziente è troppo vecchia');
				break;
			}			
			if(dataN > 0){			
				$('#txtEtaAnni').val(getAgeYears($('#txtDataNasc').val()));
				$('#txtEtaMesi').val(getAgeMonths($('#txtDataNasc').val()));
			}
		}
			
	}
	$('#txtDataNasc').blur(function(){
		if($('#txtDataNasc').val() != ""){
			dataN = checkData($('#txtDataNasc').val());
			switch(dataN){
				case -1:
					alert("Errore - La data di nascita del paziente ha un formato errato (gg/mm/aaaa)");
					// ********* aldo , modifica del 20140519
					$('#txtDataNasc').val("");
					// ******************************
					return;
				break;
				case -2:
					alert('Errore - La data di nascita del paziente ha valore futuro');
					// ********* aldo , modifica del 20140519
					$('#txtDataNasc').val("");
					// ******************************
					return;
				break;
				case -3:
					alert('Errore - La data di nascita del paziente è troppo vecchia');
					return;
				break;
			}			
			if(dataN > 0){
				$('#txtEtaAnni').val(getAgeYears($('#txtDataNasc').val()));
				$('#txtEtaMesi').val(getAgeMonths($('#txtDataNasc').val()));
			}
		}
	});
	
	$('#txtDataDec').blur(function(){
		if($('#txtDataDec').val() != ""){
			dataM = checkDataMorte($('#txtDataDec').val(),$('#txtDataNasc').val());
			switch(dataM){
				case -1:
					alert("Errore - La data di morte del paziente ha un formato errato (gg/mm/aaaa)");
					return;
				break;
				case -2:
					alert('Errore - La data di morte del paziente ha valore futuro');
					return;
				break;
				case -3:
					alert('Errore - La data di morte del paziente è troppo vecchia');
					return;
				case -4:
					alert('Errore - La data di morte del paziente è precedente alla data di nascita');
					return;
				break;
			}
		}
	});
	
	//	Gestione apertura layer default
	//HideLayer('groupInfoPaz');
	//HideLayer('groupInfoRes');
	HideLayer('groupInfoDom');
	HideLayer('groupDatiTesEuro');
	HideLayer('groupCodEst');
	HideLayer('groupAnamnesi');
	HideLayer('groupNote');
	HideLayer('groupRegistra');
	
	//	Calcolo BMI all'apertura della pagina se peso e altezza sono valorizzati
	var weight = Number($('#txtPeso').val());
	var height = Number($('#txtAlt').val());
	if((weight != null) && (height != null) && (weight != "") && (height != "")){ 	bmiCalc(weight,height);}
	
	//	Calcolo BMI onblur su altezza e peso
	$('#txtPeso').blur(function()
	{
		weight = Number($('#txtPeso').val());
		height = Number($('#txtAlt').val());
		if((weight != null) && (height != null) && (weight != "") && (height != "")) {	bmiCalc(weight,height);}
		return;
	});
	$('#txtAlt').blur(function()
	{
		weight = Number($('#txtPeso').val());
		height = Number($('#txtAlt').val());
		if((weight != null) && (height != null) && (weight != "") && (height != "")) {	bmiCalc(weight,height);}
		return;
	});
	
	jQuery('#lblCodFisc').click(function(){
		/*modifica richiesta per integrazione AAC<-->RIS, AAC<-->UNISYS*/
		if(getAgeDays(jQuery('#txtDataNasc').val())<=30 && ((jQuery('#IDEN_ANAG').val()=="" || typeof (jQuery('#IDEN_ANAG').val())=="undefined") )){
			jQuery('#txtCodFisc').val(calcola_cfs(jQuery('#txtCogn').val(),jQuery('#txtNome').val(),jQuery('#txtDataNasc').val(),jQuery('input[name="radSesso"]:checked').val(),jQuery('input[name="hCodCom"]').val()));
		}
	});

	//	Traduzione U -> Sconosciuto nel campo Sesso
	$("label:contains('U')").html("Sconosciuto");	 
	
	//	Se esiste codice remoto XMPI (Codici esterni ID1 oppure ID2 oppure ID3) i campi obbligatori diventano readonly
	if( (_CTRL_XMPI == 'S') && ($("#txtID4").val() != ""))
	{
		$("input[STATO_CAMPO='O']").attr("readonly","readonly").addClass("inputReadOnly");
		
		//	Nascondo le alternative radiobox del sesso
		$("input[type='radio']:not(:checked)").hide();
		$("input[type='radio']:not(:checked)").prev().hide();
		
		//	Nascondo l'icona del calendario
		$("#txtDataNasc").parent().find("img").hide();
	}
	else
	{
		//	Calcolo Codice Fiscale
		$('#lblCodFisc').addClass("lblCodFisc");
		$('#lblCodFisc').hover(function(){$(this).css("cursor","pointer");},function(){$(this).css("cursor","default");});
		/*$('#lblCodFisc').click(function()
		{
			$('#txtCodFisc').val(calcola_cfs($('#txtCogn').val(),$('#txtNome').val(),$('#txtDataNasc').val(),$('input[name="radSesso"]:checked').val(),$('input[name="hCodCom"]').val()));
		});*/
	}
	
//	$("#lblLuogoNasc").attr("onclick","");
	$("#txtLuogoNasc").attr("onblur","");
	$("#lblLuogoNasc").click(function(){
		launch_scandb_link(this);
	});
	$("#txtLuogoNasc").blur(function(){
		launch_scandb_link(this);
	});
	
	
	// ambulatorio
	// cancello pulsante esenzione!!
	var el = document.getElementById('lblEsenzione').parentNode.parentNode;
	if (el.parentNode){
		el.parentNode.removeChild(el);
	}
	// *** 
	

	/****disabilito campi sensibili per anagrafiche pinnate****/	
	// SOLO in modifica
	if((jQuery('#IDEN_ANAG').val()!="" && typeof(jQuery('#IDEN_ANAG').val())!="undefined") && pin != '') {
		jQuery('#txtNome, #txtCogn, [name="radSesso"], #txtDataNasc, #txtLuogoNasc, #txtCodFisc').attr('disabled', true);
		jQuery('#lblLuogoNasc').attr('onclick','');
		jQuery("#txtDataNasc").next().hide();		
	}
	// ************	
	
	// modifica 24-9-15
	// nascondo pulsante paziente sconosciuto	
	if ((opener.top.home.getConfigParam("SHOW_BT_PAZ_SCONOSCIUTO")=="N")||(configSito == "SAVONA")){
		$('#lblSconosciuto').parent().hide();
	}
	// **********	
    $('#lblMedBase').parent().attr('disabled',true);
	$('#txtMedBase').attr('disabled',true);
});


function launch_scandb(obj){
	if($("#txtDataNasc").val() == ""){
		alert("Inserire prima la Data di Nascita");
		return;
	}
	else{
		$('input[name="hDataNasc"]').val(elab_data($('#txtDataNasc').val()));
		
		var ddd = $('input[name="hDataNasc"]').val();		
		$("#txtLuogoNasc").attr("SCANDB_WHERE"," INIZIO_VALID_ISO <= '" + ddd + "' AND (FINE_VALID_ISO >= '" + ddd + "' OR FINE_VALID_ISO is null)");
		$("#lblLuogoNasc").attr("SCANDB_WHERE"," INIZIO_VALID_ISO <= '" + ddd + "' AND (FINE_VALID_ISO >= '" + ddd + "' OR FINE_VALID_ISO is null)");
		
		launch_scandb_link(obj);
	}
}
function hideRegistra()
{
	$('#lblRegistra').parent().parent().hide();
}

function aux_stampa(){
	stampa($('#IDEN_ANAG').val());
}

function stampa(iden_anag){
	if(iden_anag == '-1'){
		alert('Impossibile effettuare la stampa.Paziente sconosciuto');
		return;
	}
	
	winStampa = window.open('elabStampa?stampaIdenEsame='+iden_anag+'&stampaFunzioneStampa=SCHEDA_ANAG_STD&stampaSorgente=Scheda_Anagrafica','wndStampaAnag','status=yes, scrollbars = yes, width=1000, height=680, top=0,left=5');
	if (winStampa){	
		winStampa.focus();
	}else{
		winStampa = window.open('elabStampa?stampaIdenEsame='+iden_anag+'&stampaFunzioneStampa=SCHEDA_ANAG_STD&stampaSorgente=Scheda_Anagrafica','wndStampaAnag','top=200,left=120,width=800,height=223,status=yes,scrollbars=no');
	}
}

function esenzione(){
	readOnly = "";
	
	var esenzione = window.open('SL_EsenzioniPaziente?readonly='+readOnly,'wndEsenzione','status=yes, width=1000, height=680, top=0,left=5');
}



function aux_registra(ins)
{
	if(typeof ins != 'undefined')
	{
		_INSERISCI_ESAME = ins;
	}
	
	if(!checkText($('#txtCogn').val()))
	{
		alert("Il cognome è composto da caratteri non validi");
		return;
	}
	
	if(!checkText($('#txtNome').val()))
	{
		alert("Il nome è composto da caratteri non validi");
		return;
	}
	
	$('#txtCogn').val($('#txtCogn').val().toUpperCase());
	$('#txtNome').val($('#txtNome').val().toUpperCase());
	
	$('#txtInd ').val($('#txtInd').val().toUpperCase());
	
	switch(checkData($('#txtDataNasc').val()))
	{
		case -1:
			alert("La data di nascita del paziente ha un formato errato (gg/mm/aaaa)");
			return;
		break;
		case -2:
			alert('La data di nascita del paziente ha valore futuro');
			return;
		break;
		case -3:
			alert('La data di nascita del paziente è troppo vecchia');
			return;
		break;
	}
	$('input[name="hDataNasc"]').val(elab_data($('#txtDataNasc').val()));
	
	switch(checkData($('#txtDataDec').val()))
	{
		case -1:
			alert("La data di morte del paziente ha un formato errato (gg/mm/aaaa)");
			return;
		break;
		case -2:
			alert('La data di morte del paziente ha valore futuro');
			return;
		break;
	}
	$('input[name="hDataMorte"]').val(elab_data($('#txtDataDec').val()));
	
	switch(checkData($('#txtDataScadTes').val()))
	{
		case -1:
			alert("La data di scadenza tessera del paziente ha un formato errato (gg/mm/aaaa)");
			return;
		break;
	}
	$('input[name="hDataScadTes"]').val(elab_data($('#txtDataScadTes').val()));
	
	if(!checkEMail($('#txtMail').val())){
		alert("Inserire una mail valida");
		return;
	}
	
	//	Se il CODCOM inizia per 'Z' significa che è un paziente straniero quindi non
	//	Viene effettuato il controllo sul codice fiscale
	if(($('input[name="hCodCom"]').val().substr(0,1)) != 'Z'){
		if(($('#txtCodFisc').val() != "") && (!checkCodFisc($('#txtCodFisc').val()))){
			alert("Inserire un codice fiscale valido");
			return;
		}
	}
	
	var cf = calcola_cfs($('#txtCogn').val(),$('#txtNome').val(),$('#txtDataNasc').val(),$('input[name="radSesso"]:checked').val(),$('input[name="hCodCom"]').val());
	$('#txtCodFisc').val($('#txtCodFisc').val().toUpperCase());	
	if( ($('#txtCodFisc').val() != "") && (cf != $('#txtCodFisc').val()) )
	{
		var conf = confirm("Il codice fiscale inserito non corrisponde al codice fiscale calcolato. Registrare il codice fiscale inserito manualmente?");
		if(!conf){ return;}
	}
	
		
	// controllo sul telefono
/*	if( ($('#txtTel').val() == "") && ($('#txtCell').val() == "") )
	{
		var conf = confirm("Il numero di telefono non e' specificato per il paziente, lo si vuole inserire ora?");
		if(!conf){ return;}
	}*/
	

	//da togliere
	//return;
	// *****************************************************************	
	/* modifica aldo 12-14 */
	// commentato precedente controllo
	if(controlloCodiceFiscale()){
		try{
			// 
			if(typeof attiva_controllo != 'boolean')	{		attiva_controllo = true;	}
			_MSG_ERROR = '';
			if(check_dati(attiva_controllo) == ''){			
				if( jQuery('#IDEN_ANAG').val()!='' && jQuery('#IDEN_ANAG').val()!= undefined && jQuery('#SBLOCCA_READONLY').val()=='S'){ //modifica
					if (!sbloccaReadOnly(registra)){
						// errore nello sbloccaggio, non proseguo
						return;
					}
				}		
				else{
					registra();
				}
			}
		}
		catch(e){alert("Errore sbloccaReadOnly - "  + e.description);}		
	}
	// ********************

}


function controlloCodiceFiscale() {

	var strSqlCodFisc = "";
	// pin
	//jQuery('[name = "txtID1"]').val();
	if ($('#txtCodFisc').val()!=""){
		/* nuovi controlli secondo mail di Roberto */
//		alert("qui ! ");
		if ($('#txtCodFisc').val().length != 16 && $('#txtCodFisc').val().length != 11){
			// lunghezza errata
			alert("Inserire un codice fiscale valido.\nLa lunghezza del codice fiscale non è corretta.");
			return false;
		}
		else if ($('#txtCodFisc').val().length == 16){
			/* definitivo */
			if (verificaCodiceFiscaleDefinitivo($('#txtCodFisc').val()) == false){
				alert("Inserire un codice fiscale valido.");
				return false;				
			}
		}
		else if ($('#txtCodFisc').val().length == 11){
			/* provvisorio */		
			if (verificaCodiceFiscaleProvvisorio($('#txtCodFisc').val()) == false){
				alert("Inserire un codice fiscale valido.");
				return false;				
			}			
		}		
		/* ****************************** */
		strSqlCodFisc = "select cod_fisc from radsql.anag where cod_fisc = '" + $('#txtCodFisc').val().toUpperCase() + "' and deleted = 'N'";
		if (typeof ($('#IDEN_ANAG').val())!="undefined"){
			if((jQuery('#IDEN_ANAG').val() != null && jQuery('#IDEN_ANAG').val() != '' )){	
				strSqlCodFisc += " and iden <>" + $('#IDEN_ANAG').val();
			}
		}
//		alert(strSqlCodFisc);
		var bolCodFiscDoppio = false;
		try{
			dwr.engine.setAsync(false);	
			toolKitDB.getResultData(strSqlCodFisc, function(callback){
				if (callback!=null){
					// esiste anag doppia
					alert("Il codice fiscale inserito corrisponde ad un'altra anagrafica.\nModificarlo e registrare nuovamente.");
					bolCodFiscDoppio = true;
					return false;
				}
			});
		}
		catch(e){
		}
		finally{
			dwr.engine.setAsync(true);			
		}

		if (bolCodFiscDoppio){return;}
	}
	var checkCodFiscSql = "select cod_fisc from radsql.anag where cod_fisc = '" + $('#txtCodFisc').val().toUpperCase() + "'";
	// ********
	checkCodFiscSql += " and cogn ='" + $('#txtCogn').val().replace("'","''") + "'";
	checkCodFiscSql += " and nome ='" + $('#txtNome').val().replace("'","''") + "'";
	var dataNasc = $('#txtDataNasc').val();
	dataNasc = dataNasc.substring(6,10) + dataNasc.substring(3,5) + dataNasc.substring(0,2);
	checkCodFiscSql += " and data ='" +  dataNasc +"'";
	checkCodFiscSql += " and com_nasc ='" + $('input[name="hXxxCcom"]').val() +"'"; // cambiare
	checkCodFiscSql += " and sesso ='" + $('input[name="radSesso"]:checked').val() + "'";
	// ********
	if(($('#IDEN_ANAG').val() != null)&&(jQuery('#IDEN_ANAG').val() != "undefined")){
		checkCodFiscSql += " and iden <>" + $('#IDEN_ANAG').val();
	}
	// ***********
	// modifica del 13-11-2014
	// *************
	checkCodFiscSql += " and deleted = 'N'";
	// ***************
	dwr.engine.setAsync(false);	
	toolKitDB.getResultData(checkCodFiscSql, resp_check_data);
	dwr.engine.setAsync(true);	
	
	if(resp_check_data.risposta != null){
		alert("Attenzione, l'anagrafica E' gia' presente sull'applicativo.");
		return false;
	}
	return true;
}


/*
 *	aux_sconosciuto()
 *
 *	Funzione richiamata dal pulsante P.Sconosciuto della Scheda Anagrafica.
 *	Valorizza i campi txtCogn, txtNome, txtDataNasc, hataNasc, radSesso
 *	prendendo i valori dalla VIEW_PAZ_SCONOSCIUTO
 */
function aux_sconosciuto()
{
	//	Configurazione by DWR
	dwr.engine.setAsync(false);	
	toolKitDB.getResultData("select Scognome,Snome,Sdata,Shdata from radsql.view_paz_sconosciuto", resp_check_data);
	dwr.engine.setAsync(true);
	
	if(resp_check_data.risposta != '0')
	{
		var Scognome = resp_check_data.risposta[0];
		var Snome = resp_check_data.risposta[1];
		var Sdata = resp_check_data.risposta[2];
		var Shdata = resp_check_data.risposta[3];
	}
	else
	{
		alert('Impossibile leggere i dati relativi al paziente sconosciuto.');
		return false;
	}

	//	Valorizzazione campi
	$('#txtCogn').val(Scognome);
	$('#txtNome').val(Snome);
	$('#txtDataNasc').val(Sdata);
	$('input[name="hDataNasc"]').val(Shdata);
	$('input[name="radSesso"]')[2].checked = true;
}

/*
 *	Funzione di callback della dwr per leggere i dati per il paziente sconosciuto
 */
function resp_check_data(valore)
{
	resp_check_data.risposta = valore;
}

function chiudi_anag()
{
	var iden;
	
	if(_INSERISCI_ESAME == 'S')
	{
		dwr.engine.setAsync(false);
		toolKitDB.getResultData("select VALORE1 from TAB_WORK where WEBUSER = '" + baseUser.LOGIN + "' and TIPO = 'INSERIMENTO_PAZIENTE'", function(risp){iden = risp});
		dwr.engine.setAsync(true);
		// ambulatorio
		document.location.replace('sceltaEsami?Hiden_anag=' + iden + '&tipo_registrazione=I&visualizza_metodica=N&cmd_extra=hideMan();');
	}
	else
	{
		try{
			/*
			 *	Se scheda aperta tramite Ricerca Pazienti, valorizza i 3 campi di quest'ultima e ne aggiorna il risultato
			 */
			if(opener.name == "RicPazWorklistFrame")
			{
				opener.parent.idRicPazRicercaFrame.document.form_pag_ric.COGN.value = $('#txtCogn').val();
				opener.parent.idRicPazRicercaFrame.document.form_pag_ric.NOME.value = $('#txtNome').val();
				opener.parent.idRicPazRicercaFrame.document.form_pag_ric.DATA.value = $('#txtDataNasc').val();
			}
			
			opener.aggiorna();
			self.close();
			
		}catch(e){
		}
	}
}

function disabilita_ce()
{
	$(".classTdLabelLink").attr("disabled", true);
	$(".datepick-trigger").attr("disabled", true);
}


function bmiCalc(weight,height){if(!checkNum(weight,"Peso")){return false;}if(!checkNum(height,"Altezza")){return false;}var sesso=$('input[name="radSesso"]:checked').val();if(sesso=='F'){idealConvert=45.5;}else{idealConvert=50;}AltezzaMetri=height/100;var AreaSupCorporea=0.20247*Math.pow(AltezzaMetri,0.725)*Math.pow(weight,0.425);var PesIdKg=idealConvert+2.3*((AltezzaMetri*100/2.54)-60);var bmi=weight/Math.pow(AltezzaMetri,2);AreaSupCorporea=rounding(AreaSupCorporea,2);PesIdKg=Math.round(PesIdKg);bmi=rounding(bmi,1);if(bmi<18.5){var interp="Sottopeso";}else{if(bmi<25.0){var interp="Normopeso";}else{if(bmi<30.0){var interp="Sovrappeso";}else{var interp="Obesità";}}}$('#txtSupCorp').val(AreaSupCorporea);$('#txtPesoId').val(PesIdKg);$('#txtBMI').val(bmi);$('#txtRisPeso').val(interp);return true;}
function calcola_cfs(cognome,nome,datanascita,sesso,provincia){if(cognome==''){return"Cognome mancante";}if(nome==''){return"Nome mancante";}if(sesso==undefined){return"Sesso mancante";}if(provincia==''){return"Luogo di nascita mancante";}if(datanascita==''){return"Data di nascita mancante";}cognome=cognome.toUpperCase();vocali="";consonanti="";l=cognome.length;a="AEIOU";b="BCDFGHJKLMNPQRSTVWXYZ";for(i=0;i<l;i++){if(a.search(cognome.substr(i,1))!=-1){vocali=vocali+cognome.substr(i,1);}if(b.search(cognome.substr(i,1))!=-1){consonanti=consonanti+cognome.substr(i,1);}if(consonanti.length==3){break;}}if(consonanti.length<3){consonanti=consonanti+vocali.slice(0,(3-consonanti.length));}if(consonanti.length<3){var appo=consonanti+'XXX';consonanti=appo.substr(0,3);}cfs=consonanti;nome=nome.toUpperCase();vocali="";consonanti="";l=nome.length;for(i=0;i<l;i++){if(a.search(nome.substr(i,1))!=-1){vocali=vocali+nome.substr(i,1);}if(b.search(nome.substr(i,1))!=-1){consonanti=consonanti+nome.substr(i,1);}}if((consonanti.length>4)||(consonanti.length==4)){consonanti=consonanti.slice(0,1)+consonanti.substr(2,2);}if(consonanti.length<4){covo=consonanti+vocali;consonanti=covo.slice(0,3);if(consonanti.length<3){var appo=consonanti+'XXX';consonanti=appo.substr(0,3);}}cfs=cfs+consonanti;cfs=cfs+datanascita.slice(8,10);a="ABCDEHLMPRST";cfs=cfs+a.substr(datanascita.slice(3,5)-1,1);if(sesso=="F"){cfs=cfs+(parseFloat(datanascita.slice(0,2))+40);}else{cfs=cfs+datanascita.slice(0,2);}cfs=cfs+provincia;tempnum=0;a="B1A0KKPPLLC2QQD3RRE4VVOOSSF5TTG6UUH7MMI8NNJ9WWZZYYXX";b="A0B1C2D3E4F5G6H7I8J9KKLLMMNNOOPPQQRRSSTTUUVVWWXXYYZZ";cicla=1;i=0;while(cicla==1){apponum=a.search(cfs.substr(i,1))+1;tempnum=tempnum+((apponum-1)&32766)/2;i++;if(i>13){cicla=0;}apponum=b.search(cfs.substr(i,1))+1;tempnum=tempnum+((apponum-1)&32766)/2;i++;}tempnum=tempnum%26;a="ABCDEFGHIJKLMNOPQRSTUVWXYZ";cfs=cfs+a.substr(tempnum,1);return(cfs);}	

function rounding(number,decimal){multiplier=Math.pow(10,decimal);number=Math.round(number*multiplier)/multiplier;return number;}

function checkCodFisc(cf){var re=/^[a-zA-Z]{6}[0-9]{2}[a-zA-Z]{1}[0-9]{2}[a-zA-Z]{1}[a-zA-Z0-9]{3}[a-zA-Z]{1}$/;var verifica=cf.match(re);if(!verifica&&cf!=''){return false;}return true;}
function checkNum(val,text){if((val==null)||(isNaN(val))||(val=="")||(val<0)){alert("Inserire un valore corretto il parametro "+text+".");return false;}return true;}
/*	SENZA UMLAUT */
function checkText(cf){var re=/^([0-9a-zA-Z\xE0\xE8\xE9\xF9\xF2\xEC\x27\x40]\s?)+$/;var verifica=cf.match(re);if(!verifica&&cf!=''){return false;}return true;}	
/*	ÄÜÖäüöß	*/
function checkText(cf){var re=/^([0-9a-zA-Z\xE0\xE8\xE9\xF9\xF2\xEC\x27\x40\xDF\xDC\xD6\xE4\xF6\xFC\xC4-]\s?)+$/;var verifica=cf.match(re);if(!verifica&&cf!=''){return false;}return true;}	
function checkEMail(eMail){var T=0;var stato=0;var mioChar='';var boolRet=false;var strTmp="";if(eMail!=""){for(T=0;T<eMail.length;T++){mioChar=eMail.charAt(T);switch(stato){case 0:strTmp=strTmp.concat("0");if(mioChar=='.'){stato=1;}else if(mioChar=='@'){stato=2;}else if(!checkValidChar(mioChar)){T=eMail.length;}break;case 1:strTmp=strTmp.concat("1");if(checkValidChar(mioChar)){stato=0;}else{T=eMail.length;}break;case 2:strTmp=strTmp.concat("2");if(checkValidChar(mioChar)){stato=3;}else{T=eMail.length;}break;case 3:strTmp=strTmp.concat("3");if(mioChar=='.'){stato=4;}else if(!checkValidChar(mioChar)){T=eMail.length;}break;case 4:strTmp=strTmp.concat("4");if(checkValidChar(mioChar)){stato=3;}else{T=eMail.length;}break;}}if(stato==3){boolRet=true;}}else{boolRet=true;}return boolRet;}
function checkValidChar(mioChar){var boolRet=false;if((mioChar>='a'&&mioChar<='z')||(mioChar>='A'&&mioChar<='Z')||(mioChar>='0'&&mioChar<='9')){boolRet=true;}return boolRet;}

//	data di morte precedente alla data di nascita?
function checkDataMorte(dataMorte,dataNascita){var ret=checkData(dataMorte);if(ret<0){return ret;}SdataMorte=dataMorte.substr(6,4)+dataMorte.substr(3,2)+dataMorte.substr(0,2);SdataNascita=dataNascita.substr(6,4)+dataNascita.substr(3,2)+dataNascita.substr(0,2);if(SdataMorte<SdataNascita){return-4;}else{return 1;}}

//	CONTROLLO SULLA DATA DI NASCITA: se data inserita è maggiore di 150 anni o se ha data futura
//	 1 	-> OK
//	-1	-> Formato errato
//	-2	-> Data con valore futuro
//	-3	-> Data piu vecchia di 150 anni
function checkData(tmp){if(tmp==''){return;}var expr=/^[0-9]{2}[/]{1}[0-9]{2}[/]{1}[0-9]{4}$/;if(!expr.test(tmp)){return-1;}data_stringa=tmp.substr(6,4)+tmp.substr(3,2)+tmp.substr(0,2);dataOggi=new Date();dataOggiGiorno=dataOggi.getDate();dataOggiMese=dataOggi.getMonth()+1;dataOggiAnno=dataOggi.getFullYear();dataOggiStringa=""+dataOggiAnno;if(dataOggiMese<10){dataOggiStringa+="0";}dataOggiStringa+=dataOggiMese;if(dataOggiGiorno<10){dataOggiGiorno+="0";}dataOggiStringa+=dataOggiGiorno;if(parseInt(dataOggiStringa)<parseInt(data_stringa)){return-2;}annoInserito=tmp.substr(6,4);valoreMinimoAccettabile=(parseInt(dataOggiAnno)-parseInt(150));if(parseInt(annoInserito)<parseInt(valoreMinimoAccettabile)){return-3;}return 1;}

//	se ha data futura ritorna false
function noDataFutura(tmp){if(tmp==''){return false;}var expr=/^[0-9]{2}[/]{1}[0-9]{2}[/]{1}[0-9]{4}$/;if(!expr.test(tmp)){return false;}data_stringa=tmp.substr(6,4)+tmp.substr(3,2)+tmp.substr(0,2);dataOggi=new Date();dataOggiGiorno=dataOggi.getDate();dataOggiMese=dataOggi.getMonth()+1;dataOggiAnno=dataOggi.getFullYear();dataOggiStringa=""+dataOggiAnno;if(dataOggiMese<10){dataOggiStringa+="0";}dataOggiStringa+=dataOggiMese;if(dataOggiGiorno<10){dataOggiGiorno+="0";}dataOggiStringa+=dataOggiGiorno;if(parseInt(dataOggiStringa)<parseInt(data_stringa)){return false;}return true;}

//	Ritornano l'eta' in anni, giorni o mesi
function getAgeYears(dataNascita){dat=new Date();year=dat.getYear();month=dat.getMonth()+1;day=dat.getDate();if(year<100){year+=1900;}if(isNaN(dataNascita)){mese=dataNascita.substr(3,2);if(mese.substr(0,1)=="0"){mese=parseInt(mese.substr(1,1));}else{mese=parseInt(mese);}dataNascitaInt=new Date(dataNascita.substr(6,4),mese-1,dataNascita.substr(0,2));}else{mese=dataNascita.substr(4,2);if(mese.substr(0,1)=="0"){mese=parseInt(mese.substr(1,1));}else{mese=parseInt(mese);}dataNascitaInt=new Date(dataNascita.substr(0,4),mese-1,dataNascita.substr(6,2));}annoNascita=dataNascitaInt.getYear();meseNascita=dataNascitaInt.getMonth()+1;giornoNascita=dataNascitaInt.getDate();if(annoNascita<100){annoNascita+=1900;}eta=year-annoNascita;if(meseNascita*100+giornoNascita>month*100+day){eta-=1;}if(isNaN(eta)){eta=0;}return eta;}
function getAgeDays(dataNascita){annoNascita=parseInt(dataNascita.substr(6),10);meseNascita=parseInt(dataNascita.substr(3,2),10);giornoNascita=parseInt(dataNascita.substr(0,2),10);oggi=new Date();annoOggi=parseInt(oggi.getYear());meseOggi=parseInt(oggi.getMonth()+1);giornoOggi=parseInt(oggi.getDate());var dataok1=new Date(annoNascita,meseNascita-1,giornoNascita);var dataok2=new Date(annoOggi,meseOggi-1,giornoOggi);differenza=dataok2-dataok1;giorni_differenza=new String(differenza/86400000);return giorni_differenza;}
function getAgeMonths(dataNascita){giorni=parseInt(getAgeDays(dataNascita));return parseInt(giorni/30.3375);}

function elab_data(dataIn){anno=dataIn.substr(6,4);mese=dataIn.substr(3,2);giorno=dataIn.substr(0,2);return anno+mese+giorno;}



function verificaCodiceFiscaleProvvisorio(pi)
{
	if( pi == '' )  return false;
	if( pi.length != 11 )
		return false;
	validi = "0123456789";
	for( i = 0; i < 11; i++ ){
		if( validi.indexOf( pi.charAt(i) ) == -1 )
			return false;
	}
	s = 0;
	for( i = 0; i <= 9; i += 2 )
		s += pi.charCodeAt(i) - '0'.charCodeAt(0);
	for( i = 1; i <= 9; i += 2 ){
		c = 2*( pi.charCodeAt(i) - '0'.charCodeAt(0) );
		if( c > 9 )  c = c - 9;
		s += c;
	}
	if( ( 10 - s%10 )%10 != pi.charCodeAt(10) - '0'.charCodeAt(0) )
		return false;
	return true;		
}

function verificaCodiceFiscaleDefinitivo(cfins)
{
	if( cfins == '' )  return false;
	if( cfins.length != 16 )
		return false;
	var cf = cfins.toUpperCase();
	// modifica 8-10-15
	//var cfReg = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/;
	var cfReg = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{2}(\d|[L-V])[A-Z]$/;
	//********************************
	if (!cfReg.test(cf))
		return false;
	var set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
	var s = 0;
	for( i = 1; i <= 13; i += 2 )
		s += setpari.indexOf( set2.charAt( set1.indexOf( cf.charAt(i) )));
	for( i = 0; i <= 14; i += 2 )
		s += setdisp.indexOf( set2.charAt( set1.indexOf( cf.charAt(i) )));
	if ( s%26 != cf.charCodeAt(15)-'A'.charCodeAt(0) )
		return false;
	return true;
}


// ************ modifica per ferrara
function callbackScanDb(value){
	try{
		if (value == "TAB_COMR_ANAG" && configSito == "FERRARA"){
			// copio i valori da residenza  a domicilio
			document.dati.txtLocalita2.value = document.dati.txtLocalita.value;
			document.dati.hXxxLocalita2.value = document.dati.hXxxLocalita.value;
			document.dati.txtUSL2.value = document.dati.txtUSL.value;
			document.dati.txtReg2.value = document.dati.txtReg.value;
			document.dati.txtCAP2.value = document.dati.txtCAP.value;
			document.dati.hLocalita2.value = document.dati.hLocalita.value;
			document.dati.txtProv2.value = document.dati.txtProv.value;	
		}
	}
	catch(e){
		alert("callbackScanDb - Error: " + e.description);
	}
	
}
// ***************

/* modifica Aldo 12-14 */
function sbloccaReadOnly(toDoAfterAll){
	var bolEsito = false;
	try{
//		try{document.apriAttesaSalvataggio();}catch(e){;}
		var resp = opener.top.executeStatement("anagrafica.xml","sbloccaReadOnly",[jQuery('#IDEN_ANAG').val()],0)

		if (resp[0]=="OK"){
			bolEsito = true;
		}
		else{
			alert("Errore nello sblocco anagrafica - " + resp[1]);
		}
	}
	catch(e){
		alert("sbloccaReadOnly - Error: " + e.description);
	}
	finally{
		if (bolEsito){
			toDoAfterAll();
		}
	}
	return bolEsito;
}
/* ***************** */
