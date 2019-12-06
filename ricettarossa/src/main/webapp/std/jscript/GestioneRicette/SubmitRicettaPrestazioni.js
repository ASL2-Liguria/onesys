/**
 * File JavaScript in uso dalla pagina RICETTA_PRESTAZIONI.
 */
//location.href = 'PageUnderConstruction.htm';

var esenzione_redd , esenzione_redd_multy , esenzione_epf, esenzione_patologia;
var errore_ciclica, errore_complementare, prestazioni_primarie, prestazioni_complementari;
var prestCompl;
var modifica='N';
var provenienza = typeof document.EXTERN.PROV != 'undefined'?document.EXTERN.PROV.value:'';
var abilitato = 'ABILITA_DEMA_PREST';
var preferenza = 'CHECK_DEMA_PREST'; 

//Default Value!!!
document.getElementById('hRicettaTipo').value = "P";

jQuery(document).ready(function(){
	caricamento();
	setEvents();
});

function setEvents(){
	if (_STATO_PAGINA=='I'){
		
		//OK_REGISTRA sul body
		document.body.ok_registra=null;
		
		// Definisce l'evento ok_registra (sincrono) del configuratore
		document.body.callback_ok_registra = function() {
			inviaRicetta(
				{ // parametri
					"progressivo": $('#hProgressivo').val(),
					"dematerializzata": $('input[name=cmbDematerializzata]:checked').val()
				},
				function(ricette) { // callback
					setAttributo(preferenza, $('input[name=cmbDematerializzata][value=S]').is(':checked') ? preferenza : '');
					redirectWkConfermate(ricette);
				}
			);
			/*
			window.open("servletGenerator?KEY_LEGAME=RICETTA_WORKLIST_CREATE&WHERE_WK= WHERE PROGRESSIVO="+document.getElementById('hProgressivo').value+"&WKPROGRESSIVO="+document.getElementById('hProgressivo').value+"&WKTIPO="+document.getElementById('hRicettaTipo').value+"&WKANAGIDEN="+document.getElementById('hAnagIden').value+"","","status=yes fullscreen=yes", true);
			parent.self.close();
			aggiornaAnag();
			*/
		};

		//ONDBLCLICK delle esenzioni legate all'anagrafica
		jQuery("select[name='EsenzioniAnagrafe']").dblclick(function(){
			//add_selected_elements('EsenzioniAnagrafe', 'EsenzioniScelte', true);
			add_selected_elements('EsenzioniAnagrafe', 'EsenzioniScelte', false);
			sortSelect('EsenzioniScelte');
			TABELLA.popolaCmbEsenzioni();
		});
		
		//ONDBLCLICK delle esenzioni legate all'anagrafica
		jQuery("select[name='EsenzioniScelte']").dblclick(function(){
			remove_elem_by_sel('EsenzioniScelte');
			TABELLA.popolaCmbEsenzioni();	
		});
		
		// onblur del campo txtCodiceICD
		jQuery("#txtCodiceICD").blur(function(){
			jQuery("#txtCodiceICD").val("");
		});
		
		$('textarea[name=txtQuesitoLibero]').focusout(function() {
			if ($(this).val().length>256){
				alert('Attenzione, non è possibile inserire un testo maggiore di 256 caratteri');
				$(this).focus();
			}
		});
		
		var attributi = [abilitato, preferenza];
		var valori = getAttributo(attributi);
		
		// Verifica se l'utente è abilitato a prescrivere ricette dematerializzate
		if (!existsAttributo(abilitato, valori)) {
			$('#lblDematerializzata').css('visibility', 'hidden').parent().removeClass().addClass("classTdLabel");
			$('input[name=cmbDematerializzata]:first-child').parent().children().css('visibility', 'hidden');
			$('input[name=cmbDematerializzata][value=N]').attr("checked", true);
		}
		
		// Invia la ricetta come dematerializzata se non è stato scelto il tipo di invio della ricetta
		else if (!$('input[name=cmbDematerializzata]').is(':checked')) {
			$('input[name=cmbDematerializzata][value='+(existsAttributo(preferenza, valori) ? 'S' : 'N')+']').attr("checked", true);
		}
		
		// Reset radio button
		$('input[name=rdoPaziente]').mousedown(function(e){
			$(this).data('checked', $(this).is(':checked'));
		}).click(function(e){
			$(this).attr('checked', !$(this).data('checked'));
		}).dblclick(function(e){
			$(this).attr('checked', !$(this).data('checked'));
		});
	}	
}

function caricamento(){
	//ARRY Nascondo il bottone chiudi se apro la scheda dalla cartella
	if (top.name == 'schedaRicovero' && provenienza == ''){
		document.getElementById('lblAnnulla').parentElement.parentElement.style.display = 'NONE';
		try { top.utilMostraBoxAttesa(false); } catch(e) {}
	}
	
	$('#lblPaziente').parent().parent().hide();
	
	document.getElementById('lblQuesito').parentElement.rowSpan = 3;
	
	jQuery("[name='hEsenzioniPatologia']").parent().hide();
	jQuery("[name='hEsenzioniParticolari']").parent().hide();
	
	jQuery("[name='EsenzioniScelte']").css("width", "100%").css("font-size", "10px");
	jQuery("[name='EsenzioniAnagrafe']").css("width", "100%").css("font-size", "10px");
	
	//creo la tabella delle prestazioni
	TABELLA.alterTable('APPEND');
	TABELLA.popolaCmbEsenzioni();

	//assegno di default il servizio Sanitario Nazionale
	jQuery("select[name='cmbTipoRicetta']").find('option').each(function(){
		if(jQuery(this).val()=='SSN'){
			jQuery(this).attr("selected","selected");
		}
	});
	
	//nascondo il gruppo dei soggetti assicurati
	if (_STATO_PAGINA=='I'){
		HideLayer('groupSoggettiAssicurati'); 
		Load_PrestListbox();
	}
	
	/* CONTROLLO SULL'UTENTE PER FARE EDITARE IL CODICE FISCALE DEL MEDICO
	 * BISOGNA METTERE IL CAMPO txtMedCodFisc SU HTML_CAMPI_STATO = 'E' SEMPRE
	
		var tipoUtente=baseUser.TIPO;
		
		if (tipoUtente == 'I'){
			jQuery("#txtMedCodFisc").attr("STATO_CAMPO","L");
		}else if(tipoUtente == 'M'){
			jQuery("#txtMedCodFisc").attr("STATO_CAMPO","E");
		}
	*/
	
	//se passate come parametro in url, carica le prestazioni in tabella dinamica
	if (typeof  document.EXTERN.prest != 'undefined'){
		caricaPrestazioni($("#prest").val());
	}
	
	if (typeof document.EXTERN.quesito != 'undefined'){
		// se passato come parametro in url, carica il quesito
		$("#txtQuesitoLibero").val($("#quesito").val());
	}
	
	$('#txtQuesitoLibero').addClass('expand');
	$("textarea[class*=expand]").TextAreaExpander(20,200);
	
	setTimeout("coloraRiga()",1000);
}

function apriSceltaPrestazioni(){
	
	var finestra = window.open("servletGenerator?KEY_LEGAME=SCELTA_PRESTAZIONI","","status=yes fullscreen=yes");
    try{
    	top.opener.closeWhale.pushFinestraInArray(finestra);
       	}catch(e){}
}

function apriElencoPrestazioni(key_legame){
	var finestra = window.open("servletGenerator?KEY_LEGAME="+key_legame,"","status=yes fullscreen=yes");
	  
    try{//RrPt liscio
    		top.opener.closeWhale.pushFinestraInArray(finestra);
       	}catch(e){//Dentro la cartella
			top.opener.top.closeWhale.pushFinestraInArray(finestra);	
       	}  
}


// Evoluzione di "function registra"  in engine\gestione.js 
function savedata_callBack(attiva_controllo){

	var SAVERESPONSE = false;
	_MSG_ERROR = '';
	
	if(typeof attiva_controllo != 'boolean') {
		attiva_controllo = true;
	}	
	
	if(check_dati(attiva_controllo) == ''){
		
		if(document.richiediUtentePassword.getRichiediPwdRegistra()) {
			document.richiediUtentePassword.view('registra(false);', 'S');
		}else{
			jQuery('#lblRegistra').attr('disabled', true);
			document.apriAttesaSalvataggio();
			set_operazione();
			send_dati();
		}
		
		SAVERESPONSE = true;
	}
	return SAVERESPONSE;
}


// Salvataggio sul pulsante conferma
function SalvaPrescrizione(){	

	var commit_transac=true;
	
	//reset boolean..
	esenzione_redd = false;
	esenzione_redd_multy = false;
	esenzione_epf = false;
	esenzione_patologia = false;
	errore_ciclica  = false;
	errore_complementare= false;
	
	//Impostazione SITO a "ALL" per salvataggio..
	_SITO_PAGINA = 'ALL';
	
	try{ document.EXTERN.SITO.value = "ALL"; }catch(e){}

	//ESENZIONI..
	var lst_ese=document.getElementsByName("EsenzioniScelte")[0];
	var strese = '';
	var load_esen = '';
	
	if (lst_ese){
		for (var i=0; i<lst_ese.length;i++){
			strese = strese + lst_ese[i].value + ";";
			load_esen = load_esen + lst_ese[i].value + ",";
			controllo_esenzioni(lst_ese[i].value);
		}	
		load_esen = load_esen.substring(0, load_esen.length-1);	
	}

	//stringa esenzioni...
	document.getElementById('hEsenzioniScelte').value = strese;	
	
	//elenco esenzioni per reload
	document.getElementById('hstringaEsenzioni').value = load_esen;
	
	//PRESTAZIONI..
	var lst_presta=jQuery(".prestaz");
	var lst_presta_cuf=jQuery(".notePrestazioni option:selected");
	var lst_presta_qta=jQuery(".qta");
	var lst_presta_note=jQuery(".cicliSedute");
	var lst_presta_cicli=jQuery(".cicliSedute");
	var lst_presta_ese=jQuery(".esenz");
	var lst_esenzioni=document.getElementsByName('EsenzioniScelte')[0].options;
	var strpresrizione = '', load_prestazioni = '';
	var load_esenzioni = '';
	var conta_prest_senza_ese = 0;
	var conta_prest_con_ese = 0;
	var lst_presta_bianche = jQuery("");
	
	if (lst_presta){
		lst_presta.each(function(idx){
			if (!commit_transac) {
				return;
			}
			
			var sedute=jQuery(lst_presta_cicli[idx]);
			var cuf=jQuery(lst_presta_cuf[idx]);
			if (!sedute.is(':disabled') && (Number(sedute.val())||0) < 1) {
				commit_transac = false;
				alert('Il valore inserito deve essere un numero compreso tra\n(minimo numero sedute):\t1\n(massimo numero sedute):\t'+sedute.attr('maxVal'));
				sedute.val('').focus();
				return;
			}
			if (cuf.hasClass("allegato")) {
				commit_transac = false;
				alert("Per una o più prestazioni è stata scelta una nota che prevede la selezione della patologia dall'allegato Genetica.");
				return;
			}
			if (cuf.val() == 'B' && typeof $('input[name=rdoPaziente]:checked').val() === 'undefined') {
				lst_presta_bianche = lst_presta_bianche.add(cuf.parent().parent());
			}
			var qta=jQuery(lst_presta_qta[idx]);
			var ese = jQuery(lst_presta_ese[idx]).val();
			if (ese=='') {
				//ese=0;
				conta_prest_senza_ese++;
			}else{
				conta_prest_con_ese++;
			}
			
			strpresrizione += jQuery(this).attr("valore") + "$" + parseChars(jQuery(this).text()) + "$" + parseChars(jQuery(lst_presta_cicli[idx]).val()) + "$" + parseChars(cuf.val()) + "$"+  parseChars(qta.val()) +"$"+ parseChars(ese) +"$0$0$;";
			load_prestazioni +=	jQuery(this).attr("valore")+ ",";
			
			//alert('strpresrizione: '+strpresrizione);
			//alert('load_prestazioni: '+load_prestazioni);
		});	
		load_prestazioni = load_prestazioni.substring(0, load_prestazioni.length-1);
	}
	
	// reimposta i warning ed evidenzia i campi per i quali è necessario controllare le note del decreto Lorenzin o selezionare la tipologia del paziente
	if (lst_presta_bianche.length == 0) {
		setWarningNote();
	} else {
		setWarningNote(lst_presta_bianche.add($("#lblPaziente, input[name=rdoPaziente]").parent()));
	}
	
	if (commit_transac && lst_presta_bianche.length > 0 && !confirm('Attenzione: una o più prestazioni stanno per essere prescritte su ricetta bianca in quanto non è stata selezionata la nota sulla condizione di erogabilità indicata dal Decreto 9 dicembre 2015 ("Decreto Lorenzin") o non è stata specificata la tipologia del paziente.\n\nPremere "OK" per continuare o "Annulla" per apportare le modifiche alla prescrizione nei campi evidenziati.')) {
		commit_transac = false;
		return;
	}
	
	for (var x=0;x<lst_esenzioni.length;x++){
		load_esenzioni+=lst_esenzioni[x].text.replace(/[\#]+/g, '') + '#';
	}
	
	document.getElementById('hEsenzioniDescr').value = load_esenzioni;

	//Iden-Descrizione-Posologia-cuf-Quantità 
	document.getElementById('hPrestazioniScelte').value = strpresrizione;

	//elenco prestazioni per reload
	document.getElementById('hstringaPrestazioni').value = load_prestazioni;

	//Controllo inserimento cod fisc..
	if(document.all.txtCodFisc.value.length!=16) {
		commit_transac = false;
		alert("Prego inserire correttamente il codice fiscale del paziente");
		return;
	}

	//Controllo inserimento cod fisc..
	if(document.all.txtMedCodFisc.value.length!=16) {
		commit_transac = false;
		alert("Prego inserire correttamente il codice fiscale del medico prescrittore");
		return;
	}

	//Controllo inserimento Prestazioni..
	if(jQuery(".prestaz").length==0) {
		commit_transac = false;
		alert("Prego inserire almeno una prestazione \nprima di effettuare la registrazione");
	}
	
	//Controllo Prestazioni cicliche..
	if (commit_transac){
		//controllo_cicliche();
		//controllo errori..
		/*if (errore_ciclica){		
			commit_transac = false;
			alert("Attenzione, le prestazioni cicliche riportate di seguito, non devono superare il limite di 3 unità:\n\n "+prestazioni_primarie+prestazioni_complementari);	
		}
		else*/
		/*var prestCompl=controllo_complementari();
		if (errore_complementare){		
			commit_transac = false;
			alert("Attenzione, le prestazioni complementari ("+prestCompl+") devono essere prescritte insieme a prestazioni primarie di Medicina Riabilitativa\n\n");	
		}*/
	}
	//Controllo obbligo presenza quesito valido o codice icd9
	if (commit_transac){
		var quesito = $("#txtQuesitoLibero").text().trim();
		var icd9 = $("#txtCodiceICD").val();
		var regex = /[a-zA-Z0-9]+/;
		//alert('quesito: '+quesito);
		//alert('icd9: '+icd9);
		if (quesito == "" && icd9 == ""){
			commit_transac = false;
			alert("Inserire il quesito oppure una codifica ICD9");
		} else if (quesito != "" && !regex.test(quesito)) {
			commit_transac = false;
			alert('La nota diagnosi in forma testuale non è significativa, inserirne una di senso compiuto.');
		}
	}
	//Controllo Esenzione singola per reddito..
	if ((commit_transac) && (esenzione_redd_multy)){		
		commit_transac = false;
		alert("Attenzione, è stata inserita più di un esenzione per reddito!\nOccorre selezionarne soltanto una sola!");	
	}
	
	//Controllo Esenzione EPF per reddito..
	if ((commit_transac) && (esenzione_epf)){		
		commit_transac = false;
		alert("Attenzione, il codice esenzione EPF è valido solo per Ricette contenenti Farmaci!");	
	}
	
	// Controllo prestazioni senza esenzione assegnata, ma esenzioni in ricetta
	if (commit_transac && (load_esenzioni!="")){
		if (conta_prest_con_ese==0){
			if (!confirm("Le prestazioni sono senza esenzione associata! Si vuole procedere comunque?")){
				commit_transac = false;
			}
		}
	}
	// per l'ambulatorio di bolzano, salvo le esenzioni del paziente
	if (provenienza=='AMB' && baseGlobal.SITO =='BOLZANO'){
		SalvaEsenzioniPaziente();
	}
	
	//Registrazione Scheda..  
	if (commit_transac){ commit_transac = savedata_callBack(true);}
}

/**
 * Evidenzia i campi da richiamare al controllo da parte dell'utente.
 * 
 * @param {jQuery} $obj (opzionale)
 */
function setWarningNote($obj) {
	var color = "#ffff33";
	var className = "warningNote";

	// Ripristina i campi impostando lo sfondo originale
	$("."+className).each(function(){
		$(this).css("background-color", $(this).data("background-color"));
	});

	// Per ogni campo memorizza lo sfondo corrente e lo aggiorna
	if ($obj instanceof jQuery) {
		$obj.each(function(){
			$(this)
			.data("background-color", $(this).css("background-color"))
			.addClass(className)
			.css("background-color", color);
		});
	}
}

/**
 * Controlla le prestazioni cicliche complementari.
 * 
 * @deprecated
 * @returns {String}
 */
function controllo_complementari(){
	var prest;
	var idenTipoPrest;
	var conta_cicliche=0;
	var conta_compl=0;
	var s_idenPrest="";
	var prestCompl="";
	var complementari = '';
	
	$(".prestaz").each(function(){
		
		var txt = $(this).attr("valore").split('$')[1];
		var iden = $(this).attr("valore").split('$')[0];
		
		if (txt=='2'||txt=='3'){
			if (complementari==""){
				complementari = $(this).text();
			}else{ 
				complementari += ','+ $(this).text();
			}
		}else{
			if (s_idenPrest==""){
				s_idenPrest=iden;
			}else{
				s_idenPrest+=','+iden;
			}
			
			// cicliche primarie
			if (txt=='1'){
				conta_cicliche++;
			}
		}
	});
	
	if (complementari!="") {
		// ci sono prest. complementari
		if (conta_cicliche==0) { // non ci sono prest. cicliche primarie
			//if (s_idenPrest!=""){ // se ci sono altre prestazioni,  si verifica che ci siano prest. di branca fisiatria
			//	controlla_prest_fis(s_idenPrest);
			//}else{
			errore_complementare=true;
		}
	} 
	return complementari;					
}

/**
 * Controlla le prestazioni di fisiatria.
 * 
 * @deprecated
 */
function controlla_prest_fis(s){
	
	var sql="select count(iden) numPrestFis from view_rr_prestazioni where branca like ('%12%') and iden in ("+s+")";
	
	dwr.engine.setAsync(false);		
	toolKitDB.getListResultData(sql, function(sqlRs){
		if (sqlRs.length>0){
			if (sqlRs[0]==0){
				errore_complementare=true;
			}
		}
	});
	dwr.engine.setAsync(true);
}

//Chiusura Windows 
function chiudi(){
	
	if(typeof document.EXTERN.Hiden_visita!="undefined"){
		if (document.dati.Hiden.value==''){			
			top.apriWorkListRichieste();		
		}else{			
			parent.opener.aggiorna();
			parent.self.close();		
		}
	}else{
		parent.self.close();
	}
}


//funzione cancellazione elemento Lista
function Del_ListSelected(elementname){	
	
	var elSel = document.getElementsByName(elementname)[0];
  
	if (elSel){ 
		for (var i = elSel.length - 1; i>=0; i--) {
			if (elSel.options[i].selected) {
				elSel.remove(i);
			}
		} 
	}
}

/*funzione add ListBox*/
function add_listbox (list, lst_iden, lst_text){	
	
	var oOpt = document.createElement("Option");
	
	oOpt.value = lst_iden;
	oOpt.text = lst_text;
	list.add(oOpt);
}

/*funzione svuota ListBox*/
function svuotaListBox(elementname){	
	
	var elSel = document.getElementsByName(elementname)[0];
	 
	 if (elSel){ 
		  for (var i = elSel.length - 1; i>=0; i--) {
		    	elSel.remove(i);
		  } 
	 }
}

/*funzione x Parametri URL */
function getURLParam(strParamName){
	
	var strReturn = "";
	var strHref = window.location.href;
	
	if ( strHref.indexOf("?") > -1 ){
		
		var strQueryString = strHref.substr(strHref.indexOf("?")).toUpperCase();
		var aQueryString = strQueryString.split("&");
		
		for ( var iParam = 0; iParam < aQueryString.length; iParam++ ){
			if (aQueryString[iParam].indexOf(strParamName.toUpperCase() + "=") > -1 ){
				var aParam = aQueryString[iParam].split("=");
				strReturn = aParam[1];
				break;
			}
		}
	}
	
	return unescape(strReturn);
}
		

/*funzione controllo esenzioni*/
function controllo_esenzioni (element){	
	
	var lst_esen_red=document.getElementById("hEsenzioniParticolari");
	
	if (lst_esen_red){
		for (var i=0; i<lst_esen_red.length;i++){
			
			//controllo esenzioni per reddito.
			if ((lst_esen_red[i].text == 'ESENZ_RED') && (lst_esen_red[i].value == element)) {
				if(!esenzione_redd){ esenzione_redd = true; }
				else if(esenzione_redd){ esenzione_redd_multy = true; }
			}
			
			//controllo esenzioni EPF.
			if ((lst_esen_red[i].text == 'ESENZ_EPF') && (lst_esen_red[i].value == element)) {
				esenzione_epf = true;
			}
		}	
	}
	
	var lst_esen_pat=document.getElementById("hEsenzioniPatologia");
	
	if (lst_esen_pat){
		for (var i=0; i<lst_esen_pat.length;i++){
			//controllo esenzioni patologia.
			if (lst_esen_pat[i].value == element) {
				esenzione_patologia = true;
				break;
			}		
		}
	}
}

/**
 * Controlla le prestazioni cicliche.
 * 
 * @deprecated
 */
function controllo_cicliche() {
	
	var sql="Select Pre.Iden, Cod.Tipo_Dato, Pre.Descrizione From Radsql.Rr_Prestazioni Pre Join MMG.Mmg_Codifiche Cod ";
	sql+= "On (Tipo_Scheda = 'RICETTA_ROSSA' And Tipo_Dato Like 'CICLICHE_%' And Cod.Codice = Pre.Dm_Codice )";
	
	dwr.engine.setAsync(false);		
	toolKitDB.getListResultData(sql, function(elenco){
		if(elenco.length>0){ 
			
			var num_cicliche = 0; 
			num_primarie = 0; 
			num_complementari = 0;
			prestazioni_primarie = ""; 
			prestazioni_complementari = "";
			var lst_presta=document.getElementsByName("PrestazioniScelte")[0];
			
			if (lst_presta){
				//Elenco Prestazioni Cicliche..
				
				for (var r=0; r<elenco.length; r++){	
						//Elenco Prestazioni Scelte..
						
					for (var i=0; i<lst_presta.length;i++){
							
						if (elenco[r][0] == lst_presta[i].value){
								
							num_cicliche ++;
							if (elenco[r][1] == "CICLICHE_PRIM"){
								num_primarie ++;
								prestazioni_primarie = prestazioni_primarie + elenco[r][2] + "\n ";
							}
							else if (elenco[r][1] == "CICLICHE_SEC"){
								num_complementari++; 
								prestazioni_complementari= prestazioni_complementari + elenco[r][2] + "\n ";
							}
							break;
						}
					}	
				}	
				
				//segnalazione errore nel caso siano maggiori di 3..
				if (num_cicliche > 3 ){errore_ciclica = true;}
				
				//segnalazione errore nel caso complementare senza prestazioni primarie..
				if (num_complementari > num_primarie ){errore_complementare = true;}
				
				//segnalazione errore nel caso complementare maggiore di 1..
				else if ((num_complementari <= num_primarie ) && (num_complementari > 1 )) {errore_complementare = true;}
			}				
		}
	});
	dwr.engine.setAsync(true);
}

// funzione cancellazione singola prestazione su evento dbl-click
function removePrestazione(){	
		
	var elSel_presta = document.getElementsByName("PrestazioniScelte")[0];
	var elSel_qta=document.getElementsByName("PrestazioniScelte_Scatole")[0];
	var elSel_note = document.getElementsByName("PrestazioniScelte_Note")[0]; 	 
	  
	//cancellazione liste..
	if (elSel_presta){ 
		for (var i = elSel_presta.length - 1; i>=0; i--) {
			if (elSel_presta.options[i].selected) {
				elSel_presta.remove(i);	
				elSel_qta.remove(i);
				elSel_note.remove(i);
			}
		}   
	}
}


// Caricamento Prestazioni Cicliche
function NotePrestazioni(listfarm ,listcuf) {
	
	var elSel_note = document.getElementsByName('PrestazioniScelte_Note')[0];
	var elSel_presta = document.getElementsByName('PrestazioniScelte')[0];
	var iden_presta = elSel_presta.options[elSel_note.selectedIndex].value;
	
	//Prestazioni Cicliche..
	var sql="SELECT IDEN FROM RADSQL.Rr_Prestazioni WHERE Iden = '"+iden_presta+"' and DM_CODICE in (Select Codice FROM MMG.MMG_CODIFICHE Where Tipo_Scheda = 'RICETTA_ROSSA' AND TIPO_DATO LIKE 'CICLICHE_%')";
	
	dwr.engine.setAsync(false);		
	toolKitDB.getListResultData(sql, Win_openNote);
	dwr.engine.setAsync(true);
}	


// funzione per carimento dati listbox in caso di modifica
function Load_PrestListbox(){
	
	var call_progressivo= getURLParam("idenprogressivo");
	
	if ((call_progressivo != null) && (call_progressivo.length > 0)) {
		//Caricamento dati
		var xml_Prestazioni = '/PAGINA/CAMPI/CAMPO[@KEY_CAMPO="hPrestazioniScelte"]/text()';
		//sql XML
		var sql="SELECT Extract(Contenuto,'"+xml_Prestazioni+"').Getstringval() Prestazioni " ;
		sql+=" FROM RADSQL.View_Rr_Ricetta_Rossa_Scheda WHERE PROGRESSIVO = "+call_progressivo;
		dwr.engine.setAsync(false);		
		toolKitDB.getListResultData(sql, bck_Load_PrestListbox);
		dwr.engine.setAsync(true);	
	}
}


/*funzione call back load Prestazioni*/
function bck_Load_PrestListbox(elenco){
	//svuotaListBox("PrestazioniScelte");
	
	modifica='S';
	
	jQuery("select[name='cmbTipoRicetta']").find('option').each(function(){
		if(jQuery(this).val()==jQuery("hTipoRicetta").val()){
			jQuery(this).attr("selected","selected");
		}
	});
	
	for (var r=0; r<elenco.length; r++){	
		
		var strload = elenco[r][0];
		//alert(strload);
		var lst_presta=document.getElementsByName("PrestazioniScelte")[0];
		var lst_presta_qta=document.getElementsByName("PrestazioniScelte_Scatole")[0];
		var lst_presta_note=document.getElementsByName("PrestazioniScelte_Note")[0];
		var lst_esenzioni=document.getElementById("hEsenzioniDescr").value;
		var v_ese='';
		var posFinePrest;
		var msg_prest_non_attive="";
		var visualizzaPazienteOCI = false;
		//Split String..
		for (var pos=0; pos<strload.length; pos++){
			posFinePrest=strload.indexOf(";",pos); // memorizzo la posizione di fine prestazione
			//Load List Prestazioni.. iden$info_cicliche e descrizione
			var prescr_iden = strload.substring(pos, strload.indexOf("$", pos)); //sara corretto?????
			pos = strload.indexOf("$", pos)+1; 
			prescr_iden = prescr_iden + '$' +strload.substring(pos, strload.indexOf("$", pos));
			var v_tipo_ciclicita = strload.substring(pos, strload.indexOf("$", pos));
			pos = strload.indexOf("$", pos)+1;
			prescr_iden = prescr_iden + '$' +strload.substring(pos, strload.indexOf("$", pos));
			var v_max_sedute = strload.substring(pos, strload.indexOf("$", pos));
			
			pos = strload.indexOf("$", pos)+1;
			var prescr_desc = strload.substring(pos, strload.indexOf("$", pos));

			//Load List Note(Ciclo Sedute)..
			pos = strload.indexOf("$", pos)+1; 
			var v_num_sedute= strload.substring(pos, strload.indexOf("$", pos));
			//alert('prescr_sedute: '+v_num_sedute);
			
			var prescr_sedute= strload.substring(strload.indexOf("$", pos), strload.indexOf("$", pos)-1);
			if (prescr_sedute == "$") {prescr_sedute = "0"; }
			
			//Load List Note prescrizione (analogo al Cuf dei farmaci)	
			pos = strload.indexOf("$", pos)+1;
			var prescr_cuf= strload.substring(pos, strload.indexOf("$", pos));
			
			//Load List Quantità..	
			pos = strload.indexOf("$", pos)+1;
			var prescr_qta= strload.substring(pos, strload.indexOf("$", pos));
			  
			//indice,value, text  , qta, cicli
			pos = strload.indexOf("$", pos)+1;
			var prescr_ese;
			
			if (posFinePrest < pos+5)
				prescr_ese= strload.substring(pos, strload.indexOf(";", pos));
			else
				prescr_ese= strload.substring(pos, strload.indexOf("$", pos));
			if(v_num_sedute==0){v_num_sedute='';}
			//alert(prescr_iden);
			var attiva=testPrestAttiva(prescr_iden);
			if (attiva=="S"){
				var codice = prescr_iden.substring(0, prescr_iden.indexOf("$"));
				var prestazione = TABELLA.creaPrestazioni(codice)[0];
				prestazione.setTipoCiclicita(v_tipo_ciclicita);
				prestazione.setLimiteSedute(Number(v_max_sedute)||0);
				prestazione.setIndiceNotaPredefinita($.inArray(prescr_cuf, prestazione.getListaIDNote()));
				if (prestazione.getIndiceNotaPredefinita() < 0) {
					prestazione.setAllegatoNota(prescr_cuf);
				}
				TABELLA.aggiungiRiga(pos, prescr_iden,prescr_desc,prescr_qta, v_num_sedute,prescr_ese,prestazione);
				if (prestazione.getListaIDNote().length > 0) {
					visualizzaPazienteOCI = true;
				}
			}
			else{
				//alert("La prestazione " +prescr_desc+" non è più attiva e non verrà caricata");
				msg_prest_non_attive += " " +prescr_desc+"\n";
			}
			
			//aggiorna contatore
		    pos = strload.indexOf(";", pos);	    
		}
		$('#lblPaziente').parent().parent().css('display', visualizzaPazienteOCI ? 'block' : 'none');
		if (msg_prest_non_attive!=""){
			alert("Le seguenti prescrizioni non sono più attive:\n"+msg_prest_non_attive);
		}
	    var esenzioniScelte = document.getElementById('hEsenzioniScelte').value.split(';');
	    var esenzioniDescr = document.getElementById('hEsenzioniDescr').value.split('#');
	    //alert("document.getElementById('hEsenzioniScelte').value="+document.getElementById('hEsenzioniScelte').value);
	    
	    for (var i=0;i<esenzioniScelte.length;i++){
	    	if(esenzioniScelte[i]!=''){
	    		add_listbox(document.getElementsByName('EsenzioniScelte')[0], esenzioniScelte[i], esenzioniDescr[i]);
	    	}
	    }
	    
	    TABELLA.popolaCmbEsenzioni();
	}
}


function aggiornaAnag(){
	
	var sql = null;
	sql = "UPDATE RADSQL.ANAG SET COM_RES ='"+document.all.hLocalita.value+"'  WHERE IDEN="+document.all.hAnagIden.value;
	
	dwr.engine.setAsync(false);
	toolKitDB.executeQueryData(sql, callback);	
	dwr.engine.setAsync(true);

	function callback(){
	}
}

//function che colora le righe dell'esenzioni a seconda se quest'ultime sono parziali o totali
function coloraRiga(){
	var combo = document.getElementsByName('EsenzioniAnagrafe')[0].options;

	for (var i=0;i<combo.length;i++){
		if (combo[i].text.substring(0,3)=='( t'){
			combo[i].style.backgroundColor = '#97f997'; //verde chiaro
		}else{	
			combo[i].style.backgroundColor = '#fdfbcb'; //giallo chiaro
		}
	}
	
	combo = document.getElementsByName('EsenzioniScelte')[0].options;

	for (var i=0;i<combo.length;i++){
		if (combo[i].text.substring(0,3)=='( t'){
			combo[i].style.backgroundColor = '#97f997'; //verde chiaro
		}else{	
			combo[i].style.backgroundColor = '#fdfbcb'; //giallo chiaro
		}
	}
	
	setTimeout("coloraRiga()",1000);
}

var popupInfoPrestazioni = {
		append:function(pParam){
			popupInfoPrestazioni.remove();
			
			pParam.header = (typeof pParam.header != 'undefined' 	? pParam.header : null);
			pParam.footer = (typeof pParam.footer != 'undefined' 	? pParam.footer : null);
			pParam.title = 	(typeof pParam.title != 'undefined' 	? pParam.title 	: "");
			pParam.width = 	(typeof pParam.width != 'undefined' 	? pParam.width 	: 500);
			pParam.height = (typeof pParam.height != 'undefined' 	? pParam.height : 300);				
			$("body").append(
				$("<div id='divPopUpInfoPrestazioni'></div>")
					.css("font-size","12px")
					.append(pParam.header)
					.append(pParam.obj)
					.append(pParam.footer)
					.attr("title",pParam.title)
			);
			
			$("#divPopUpInfoPrestazioni").dialog({
				position:	  'auto'//[event.clientX,event.clientY],
				, width:      pParam.width
				, height:     pParam.height
				, draggable:  false
				, resizable:  false
			}).css({
				width:        'auto'
				, "min-height":     '100%'
				, padding:    '0px'
				, overflow:   'visible'
			}).bind('blur', function(e){
				popupInfoPrestazioni.remove();
			}).focus();
		},
	
	remove:function(){
		$('#divPopUpInfoPrestazioni').remove();
	}
};

var TABELLA = {

	//aggiungo la tabella
	alterTable:function(istruzione){
				
		var table = "<table id='tablePrestazioni' width=100% >";
		table +="<tr id='primariga' height:10 px >";
		table += "<td STATO_CAMPO='E' class='classTdLabelLink aggiungi' STYLE='WIDTH:5%;BORDER-BOTTOM:2PX SOLID BLUE; BACKGROUND-COLOR: #d6eaff'>" +
					"<label title='Aggiungi Prestazioni' name='lblAggiungi' id='lblAggiungi'>Aggiungi</label>" +
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel prestazioni' STYLE='WIDTH:45%;BORDER-BOTTOM:2PX SOLID BLUE; BACKGROUND-COLOR: #d6eaff'>" +
					"<label name='lblPrestaz' id='lblPrestaz'>PRESTAZIONI</label>" +
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel qtaInt' style='BORDER-BOTTOM:2PX SOLID BLUE; BACKGROUND-COLOR: #d6eaff'>" +
					"<label name='lblQuantita' id='lblQuantita'>Q.TA'</label>" +
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel cicliSeduteInt' style='BORDER-BOTTOM:2PX SOLID BLUE; BACKGROUND-COLOR: #d6eaff'>" +
					"<label name='lblCicli' id='lblCicli'>N.SEDUTE</label>" +
				"</td>";
		table += "<td colspan='2' STATO_CAMPO='E' class='classTdLabel esenzioni' style='WIDTH:350px;BORDER-BOTTOM:2PX SOLID BLUE; BACKGROUND-COLOR: #d6eaff'>" +
					"<label name='lblEsenz' id='lblEsenz'>ESENZIONI</label>" +
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel notePrestazioni' style='BORDER-BOTTOM:2PX SOLID BLUE; BACKGROUND-COLOR: #d6eaff'>" +
					"<label name='lblNotaPrest' id='lblNotaPrest'>NOTE</label>" +
				"</td>";
		table += "</tr></table>";
		
		switch(istruzione){
		
			case 'CLEAR':
				//alert('case CLEAR');
				jQuery("#tablePrestazioni").remove();
				jQuery("#divPrestazioni").append(table);
				
				break;
				
			case 'APPEND':
				//alert('case APPEND');
			default:
				
				jQuery("#divPrestazioni").append(table);
				break;		
		}

		jQuery("#lblAggiungi").parent().click(function(){
			apriSceltaPrestazioni();
		}); //.css("background-color","#FFC663"); se si vuole aggiungere un colore al pulsante Aggiungi
	},

	
	
	aggiungiRiga:function(indice, value, text, quantita, cicli, ese, prestazione){
		var maxIndice = Number(($("table#tablePrestazioni tr.trPresta").last().attr("id") || "tr_-1").replace("tr_", ""));
		if (!(indice != null && indice > -1 && indice <= maxIndice)) {
			indice = maxIndice+1;
		}
		
		var quant='';
		var v_cicli = cicli;
		var v_disabled;
		var v_limite_sedute = String(prestazione.getLimiteSedute());
		var debug='';
		var v_backcolor;
		
		// Decodifica delle entità HTML
		text = $('<div/>').html(text.replace(/(&apos;)/gi, "&#39;")).text();
		
		debug += 'INDICE: '+indice;
		debug += '\nVALUE: '+value;
		debug += '\nTEXT: '+text;
		debug += '\nQUANTITA: '+quantita;
		debug += '\nCICLI: '+cicli;
		debug += '\nLIMITE SEDUTE: '+v_limite_sedute;
		//alert(debug);
		
		quant=(quantita?quantita:1);
		
		if (prestazione.isCiclica()) {
			if (prestazione.getLimiteSedute() < 1) {
				v_cicli = '1';
				v_limite_sedute = '1';
			}
			v_disabled='';
			v_backcolor='';
		} else { // se la prestazione non è ciclica il campo va messo disabled
			v_cicli='';
			v_limite_sedute='0';
			v_disabled='disabled';
			v_backcolor="grey";
		}
		
		var idenPrest = value.split('$');
		
		var riga = "<tr id='tr_"+indice+"' valore="+value+" class='trPresta'>";
		//alert("v_disabled="+v_disabled);
		//alert("v_limite_sedute="+v_limite_sedute);
		riga += "<td STATO_CAMPO='E' class='classTdLabel butt_elimina' style='border-left:1px solid blue; BORDER-BOTTOM:3PX SOLID BLUE'><label class='butt_elimina' title='Elimina' name='lblElimina"+indice+"' id='lblElimina"+indice+"'> X </label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel prestazioni'  style='BORDER-BOTTOM:3PX SOLID BLUE'><label indice = "+indice+" valore="+value+" class='prestaz' name='lblPrestaz"+indice+"' id='lblPrestaz"+indice+"'>"+text+"</label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel'  style='BORDER-BOTTOM:3PX SOLID BLUE'><input class='qta' id='txtQuantita"+indice+"' STATO_CAMPO='E' value='"+quant+"' name='txtQuantita"+indice+"' type='text'></input></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel'  style='BORDER-BOTTOM:3PX SOLID BLUE'><input class='cicliSedute "+v_backcolor+"' id='txtCicloSedute"+indice+"' STATO_CAMPO='E' name='txtCicloSedute"+indice+"' "+v_disabled+" maxVal="+v_limite_sedute+" type='text' value="+v_cicli+"></input></td>";
		riga += "<TD STATO_CAMPO='E' class='classTdLabel'  style='WIDTH:250px;BORDER-BOTTOM:3PX SOLID BLUE' ><SELECT name=cmbEsenzioni class='esenz' STATO_CAMPO='E' STATO_CAMPO_LABEL='lblPriorita"+indice+"' idenPrest='"+idenPrest[0]+"' valore="+ese+"><option value = '' ></option></SELECT></td>";
		riga += "<TD STATO_CAMPO='E' class='classTdLabel'  style='WIDTH:100px;BORDER-BOTTOM:3PX SOLID BLUE' ><button onclick='javascript:TABELLA.setEsenzione(\""+idenPrest[0]+"\")'name='applicaEse' id='applicaEse"+indice+"' class='applicaEse'  valore="+idenPrest[0]+">Applica a tutte</button></td>";
		riga += "<TD STATO_CAMPO='E' class='classTdLabel'  style='BORDER-BOTTOM:3PX SOLID BLUE' >";
		riga += "<input type='hidden' value='' onblur='launch_scandb_text(this);' id='hCodicePatologia"+indice+"' name='hCodicePatologia"+indice+"' SCANDB_PROC='MMG_RR_NOTE_PRESTAZIONI'/>";
		riga += "<input type='hidden' value='' onblur='launch_scandb_text(this);' id='hDescrizionePatologia"+indice+"' name='hDescrizionePatologia"+indice+"' SCANDB_PROC='MMG_RR_NOTE_PRESTAZIONI'/>";
		riga += "<select class='notePrestazioni' id='cmbNotaPrest"+indice+"' STATO_CAMPO='E' value='' name='cmbNotaPrest"+indice+"' type='text' SCANDB_PROC='MMG_RR_NOTE_PRESTAZIONI'";		
		//alert(prestazione);
		var notePrestazioni= prestazione.getListaIDNote();
		var idxNotaSelezionata = prestazione.getIndiceNotaPredefinita();
		if (notePrestazioni.length > 0){
			if ($.inArray('CON', prestazione.getListaTipiNote()) > -1) {
				riga += "><option value='B' title='Forza su ricetta bianca'></option>";
			} else {
				riga += "><option value=''></option>";
			}
			for (var i=0; i<notePrestazioni.length; i++) {
				var allegatoGenetica = prestazione.getListaAllegatiGeneticaNote()[i];
				if (prestazione.getListaTipiNote()[i] == 'CON') {
					if (allegatoGenetica == null) {
						riga += "<option value='" + notePrestazioni[i] + "' title='Inserisci nota di erogabilità " + prestazione.getListaCodiciNote()[i] + "'"+(idxNotaSelezionata > -1 && notePrestazioni[i] === notePrestazioni[idxNotaSelezionata] ? " selected='selected'" : "")+">"+prestazione.getListaCodiciNote()[i]+"</option>";
					} else {
						riga += "<option class='allegato' data-allegato='"+allegatoGenetica+"' value='" + notePrestazioni[i] + "' title='Selezionare la patologia...'"+(idxNotaSelezionata > -1 && notePrestazioni[i] === notePrestazioni[idxNotaSelezionata] ? " selected='selected'" : "")+">"+prestazione.getListaCodiciNote()[i]+"</option>";
					}
				} else {
					riga += "<option style='background-color:#99ccff' value='" + notePrestazioni[i] + "' title='Inserisci nota di appropriatezza " + prestazione.getListaCodiciNote()[i] + "'"+(idxNotaSelezionata > -1 && notePrestazioni[i] === notePrestazioni[idxNotaSelezionata] ? " selected='selected'" : "")+">"+prestazione.getListaCodiciNote()[i]+"</option>";
				}
			}
			riga += "</select>&nbsp;<input id='InfoNota"+indice+"' type='button' class='btnInfo' title='Visualizza informativa'/></td>";
		} else {
			riga += " disabled='disabled'><option value=''></option></select></td>";
		}
		
		/* COMMENTATA PER TOGLIERE IL CAMPO NOTE. Se reinserisco il campo note togliere il border dai td delle altre colonne(prestazioni, esenzioni, ecc.)
		riga += "</tr><tr id='tr_1"+indice+"' class = 'trPresta'>";
		riga += "<td STATO_CAMPO='E' colSpan='4' id='t_note' class='classTdField' style='BORDER-BOTTOM:3PX SOLID RED'><TEXTAREA class='note expand' id='txtNotaBreve"+indice+"' style='width:100%' STATO_CAMPO='E' value='' name='txtNotaBreve"+indice+"'></TEXTAREA></td>";		
		*/
		
		riga += "</tr>";

		//alert(riga);
		
		jQuery("#tablePrestazioni").append(riga);
		
		// memorizza la prestazione associandola alla riga appena creata
		jQuery("#tr_"+indice).data("prestazione", prestazione);
		
		jQuery("#lblElimina"+indice).click(function(){
			 TABELLA.eliminaRiga(indice);
		});
		
		// modifica sul campo txtCicloSeduteN		
		jQuery("#txtCicloSedute"+indice).blur(function(){
			TABELLA.controlloSedute(jQuery(this),jQuery(this).val(),jQuery(this).attr("maxVal"));
		});
		
		// controllo sul campo txtCicloSeduteN		
		jQuery("#txtQuantita"+indice).blur(function(){
			sVal = jQuery(this).val();
			nVal = Number(jQuery(this).val())||0;
			if (sVal != nVal || nVal < 1) {
				alert('Il valore inserito deve essere un numero maggiore o uguale a 1.');
				jQuery(this).val(1);
			}
		});
		
		// apre l'informativa sulle condizioni di erogabilità e appropriatezza
		var i = $.inArray("CON", prestazione.getListaTipiNote());
		var j = $.inArray("IND", prestazione.getListaTipiNote());
		var erogabilita = i > -1 ? prestazione.getListaDescrizioniNote()[i] : "\r\n";
		var appropriatezza = j > -1 ? prestazione.getListaDescrizioniNote()[j] : "\r\n";
		
		jQuery("#InfoNota"+indice).click(function(e){
			TABELLA.apriInfoNote(erogabilita, appropriatezza);
		});
		
		// caso in cui si selezioni una nota con allegato "Genetica"
		if (jQuery("select#cmbNotaPrest"+indice+" option.allegato").length > 0) {
			// ricarica la nota scelta nell'allegato aggiungendola al menu a tendina
			if (prestazione.getIndiceNotaPredefinita() < 0 && /\-[^\-]+$/i.test(prestazione.getAllegatoNota())) {
				jQuery("select#cmbNotaPrest"+indice+" option.allegato").attr('selected','selected');
				TABELLA.aggiungiAllegatoNote(indice, prestazione.getAllegatoNota().match(/\-([^\-]+)$/i)[1]);
			}
			
			// apre la scelta della patologia
			jQuery("select#cmbNotaPrest"+indice).change(function(e){
				if (jQuery("select#cmbNotaPrest"+indice+" option:selected").hasClass("allegato")) {
					if (document.body.scan_db_callback == undefined || document.body.scan_db_callback == null) {
						document.body.scan_db_callback = function(element, value){
							var name = $(element).attr('id') || $(element).attr('name');
							if (name == 'hCodicePatologia'+indice) {
								TABELLA.aggiungiAllegatoNote(indice, value);
							}
						};
					}
					var colonne = "'"+jQuery("select#cmbNotaPrest"+indice+" option:selected").attr("data-allegato").split(",").join("','")+"'";
					launch_scandb_link_where(this, "colonna in (" + colonne + ")", {"hCodicePatologia": "hCodicePatologia"+indice, "hDescrizionePatologia": "hDescrizionePatologia"+indice});
				}
			});
		}		
	},
	
	/**
	 * Aggiunge una voce al menu delle note delle prestazioni in seguito alla scelta della patologia dall'allegato "Genetica"
	 * 
	 * @param indice     posizione della select delle note
	 * @param codice     codice della patologia
	 */
	aggiungiAllegatoNote: function(indice, codice) {
		var opzione = $("select#cmbNotaPrest" + indice + " option:selected");
		var valore = opzione.val()+'-'+codice;
		var descrizione = opzione.text()+'-'+codice;
		$("select#cmbNotaPrest" + indice + " option.patologia").remove();
		$("select#cmbNotaPrest" + indice + " option.allegato:selected").after($("<option class=\"patologia\" title=\"Inserisci nota di erogabilità "+ descrizione + "\"/>").val(valore).text(descrizione));
		$("select#cmbNotaPrest" + indice).css('width','auto').val(valore);
		document.body.scan_db_callback = null;
	},
	
	creaPrestazioni: function() {
		
		function _constructor() {
			var ret = new Array();
			var arrCodiciDM = new Array();
			var i, length;
			
			// Crea un array di oggetti di classe Prestazione e colleziona tutti i codici DM
			for (i=0, length=arguments.length; i<length; i++) {
				var p = new Prestazione(arguments[i].toString());
				ret[i] = p;
				arrCodiciDM[i] = p.getCodiceDM();
			}
			
			// Esegue la query per trovare le note delle prestazioni
			var prestazioni = {};
			var sql = "with lista as ("
			          + "    select distinct to_char(regexp_substr(x, '[^,]+', 1, level)) dm_codice"
			          + "    from(select '"+arrCodiciDM.join(',')+"' x from dual)"
			          + "    connect by level <= length(x) - length(replace(x, ',')) + 1"
			          + ") select p.dm_codice, p.id_opt, p.tipo_nota, p.id_nota||id_dett codice_nota, p.descrizione_nota, p.genetica from radsql.view_rr_prestazioni_note p join lista on lista.dm_codice = p.dm_codice order by id_opt";
			dwr.engine.setAsync(false);		
			toolKitDB.getListResultData(sql, function(resp){
				for (i=0,length=resp.length; i<length; i++) {
					rs.apply(window, [prestazioni].concat(resp[i]));
				}
			});
			dwr.engine.setAsync(true);
			
			// Associa le note trovate alle prestazioni selezionate
			for (i=0, length=ret.length; i<length; i++) {
				var prestazione = ret[i];
				if (typeof prestazioni[prestazione.getCodiceDM()] !== 'undefined') {
					prestazione.setNote(prestazioni[prestazione.getCodiceDM()].getNote());
				}
			}
			
			// Popola le note comuni alle prestazioni con lo stesso codice DM
			function rs(prestazioni, dm_codice, id_opt, tipo_nota, codice_nota, descrizione_nota, allegatoGenetica){
				if (typeof prestazioni[dm_codice] === 'undefined') {
					 prestazioni[dm_codice] = new Prestazione("", dm_codice);
				}
				// Le condizioni di erogabilità o di appropriatezza senza lettera terminano con uno 0 (zero) che non deve essere mostrato
				prestazioni[dm_codice].addNota(id_opt, tipo_nota, codice_nota.replace(/0$/, ""), descrizione_nota, allegatoGenetica != '' ? allegatoGenetica : null);
			}
			
			return ret;
		}
		
		/**
		 * Crea una lista di prestazioni con tanto di nota di appropriatezza a partire da una lista
		 * di codici alfanumerici passati come parametro.
		 * 
		 * @param {Array}    lista di codici di prestazione, ciascuno nella forma <CUR>@<DM>
		 * @returns {Array}  array di oggetti di tipo Prestazione
		 */
		if (arguments.length <= 0) {
			return [];
		} else if (arguments.length == 1 && Object.prototype.toString.call(arguments[0]) === '[object Object]') {
			var args = new Array();
			for (var i in arguments[0]) {
				args[args.length] = arguments[0][i]; 
			}
			return _constructor.apply(null, args);
		} else if (arguments.length == 1 && Object.prototype.toString.call(arguments[0]) === '[object Array]') {
			return _constructor.apply(null, arguments[0]);
		
		/**
		 * Crea una lista di prestazioni con tanto di nota di appropriatezza a partire da uno o
		 * più codici alfanumerici passati come parametro.
		 * 
		 * @param string [, string]   uno o più codici di prestazione, ciascuno nella forma <CUR>@<DM>
		 * @returns {Array}           array di oggetti di tipo Prestazione
		 */
		} else {
			return _constructor.apply(null, arguments);
		}
	},
	
	apriInfoNote:function(erogabilita, appropriatezza){
		function str2HTML(s) {
			if (s == null) {
				return "";
			}
			return s.HTMLencode().replace(/(?:\r\n|\r|\n)/g, '<br />').replace(/(&apos;)/gi, "&#39;");
		}
		
		var paramObj = {
			title:null,
			obj:null,
			footer:null,
			width:650,
			height:330
		};
		
		paramObj.title='Informativa sulla nota della prestazione';
		paramObj.obj = $("<table style=\"border:1px solid #aed0ea;width:100%;height:100%;font-size:11px\"/>")
		.append($("<tr style=\"height:25px\"/>")
			.append($("<td style=\"font-weight:bold;background-color:#ccc;width:50%;padding:5px;\"/>").append($("<p/>").html(str2HTML("Condizione di erogabilità"))))
			.append($("<td style=\"font-weight:bold;background-color:#ccc;width:50%;padding:5px;\"/>").append($("<p/>").html(str2HTML("Indicazioni di appropriatezza prescrittiva"))))
		)
		.append($("<tr/>")
			.append($("<td style=\"vertical-align:top;width:50%;padding:5px;background-color:#fff\"/>").append($("<p/>").html(str2HTML(erogabilita))))
			.append($("<td style=\"vertical-align:top;width:50%;padding:5px;background-color:#b0dbff\"/>").append($("<p/>").html(str2HTML(appropriatezza))))
		);
		paramObj.footer = $("<div style=\"height:15px;font-size:11px;padding:5px;\"/>").append("<p/>").html(str2HTML(""));
		
		popupInfoPrestazioni.append({
			title:paramObj.title,
			obj:paramObj.obj,
			footer:paramObj.footer,
			width:paramObj.width,
			height:paramObj.height
		});
	},
	
	controlloSedute:function(obj,nSed,maxNum){
		var intNSed = Number(nSed) == nSed ? Number(nSed) : NaN;
		var intMaxNum = Number(maxNum) == maxNum ? Number(maxNum) : NaN;
		//alert('nSed: '+intNSed+'\nmaxNum: '+intMaxNum+'\nnSed > maxNum: '+(intNSed > intMaxNum));
		
		if (isNaN(intNSed) || intNSed < 1 || intNSed > intMaxNum){
			alert('Il valore inserito deve essere un numero compreso tra\n(minimo numero sedute):\t1\n(massimo numero sedute):\t'+intMaxNum);
			obj.val(intMaxNum);
			return;
		}
	},
	
	eliminaRiga:function(indice){
		//alert('indice: '+indice);
		jQuery("#tr_"+indice).remove();
		jQuery("#tr_1"+indice).remove();
		jQuery("#tr_2"+indice).remove();
		
		/*
		 * I radio button del paziente sono visibili se esiste almeno una prestazione
		 * caricata che contenga delle note di erogabilità/appropriatezza.
		 */
		var visualizzaPazienteOCI = false;
		$("tr.trPresta").each(function(){
			if (visualizzaPazienteOCI) {
				return;
			}
			var prestazione = jQuery(this).data("prestazione");
			if (prestazione.getListaIDNote().length > 0) {
				visualizzaPazienteOCI = true;
			}
		});
		$('#lblPaziente').parent().parent().css('display', visualizzaPazienteOCI ? 'block' : 'none');
	},
	
	//se passo elencoPrestazioni vuol dire che i valori che passo sono le prestazioni da popolare 
	//poichè presumo che quelle che erano già presenti siano già state associate ad una esenzione
	popolaCmbEsenzioni:function(elencoPrestazioni){

		//alert(elencoPrestazioni);

		var combo = jQuery("select[name='EsenzioniScelte']");
		var elencoCmb = jQuery(".esenz");
		var elencoPrestaz = '';
		var splitPrestaz='';
		var elencoEse = '';
		
		/*if (typeof elencoPrestazioni != 'undefined'){
			
			splitPrestaz=elencoPrestazioni.split(",");
			
			for (var i=0;i<splitPrestaz.length;i++){
				
				// tolgo tutte le option dalle cmbEsenzioni di quelle prestazioni che ho passato tranne quella vuota prima di ripopolarlo
				var iden_prestazione=splitPrestaz[i].split("$");
				elencoCmb.each(function(idx2){
					if (jQuery(this).attr("idenPrest")==iden_prestazione[0]){
						jQuery(this).find("option").each(function(idx2){
							if (jQuery(this).attr("value")!=''){
								jQuery(this).remove();
							}
						});
					}
				});
				
				// ciclo i vari combo nella pagina e assegno le varie option in base alle esenzioni del listbox
				combo.find("option").each(function(idx){
					
					var valore=jQuery(this).val();
					var testo=jQuery(this).text();
					
					//prendo il valore delle options del listbox delle esenzioni
					elencoCmb.each(function(idx2){
						
						if (jQuery(this).attr("idenPrest")==iden_prestazione[0]){//alert('option value: '+valore+' text: '+testo);
							jQuery(this).append('<option value='+valore+'>'+testo+'</option>');
							if (elencoPrestaz != ''){elencoPrestaz+=',';}
							elencoPrestaz += jQuery(this).attr("idenPrest");
						}
					});
				});
				
				// se ce n'è una totale la associo a tutti
				elencoCmb.find("option").each(function(){
					if (jQuery(this).parent().attr("idenPrest")==iden_prestazione[0]){
						if (jQuery(this).text().substr(0,3)=='( t'){
							jQuery(this).attr("selected","selected");
						}
					}
				});
			}
			
		//non passo nessuna prestazione e quindi le condizioni le applico a tutti i combo
		}else{*/
			
			// tolgo tutte le option dalle cmbEsenzioni tranne quella vuota prima di ripopolarlo
			elencoCmb.find("option").each(function(idx2){
				if (jQuery(this).attr("value")!=''){
					jQuery(this).remove();
				}
			});

			
			// ciclo i vari combo nella pagina e assegno le varie option in base alle esenzioni del listbox
			combo.find("option").each(function(idx){
				
				var valore=jQuery(this).val();
				var testo=jQuery(this).text();
				
				if (elencoEse != ''){elencoEse+=',';}
				elencoEse += valore;
				
				//prendo il valore delle options del listbox delle esenzioni
				elencoCmb.each(function(idx2){
					jQuery(this).append('<option value='+valore+'>'+testo+'</option>');
					if (elencoPrestaz != ''){elencoPrestaz+=',';}
					elencoPrestaz += jQuery(this).attr("idenPrest");
				});
			});
			

			// se ce n'è una totale la associo a tutti
			elencoCmb.find("option").each(function(){

				if (jQuery(this).text().substr(0,3)=='( t'){
					jQuery(this).attr("selected","selected");
				}
			});


		if (modifica=="S"){
			TABELLA.setLoadEsenzioni();
		}
		
		if (elencoPrestaz != ''){
		
			TABELLA.selezionaEsenzCollegate(elencoPrestaz,elencoEse);
		}
	},
	
	// caricamento delle esenzioni in modifica
	setLoadEsenzioni:function(){
		
		var elencoCmb = jQuery(".esenz");
		
		elencoCmb.each(function(){
			//alert(jQuery(this).attr("valore"));
			if (jQuery(this).attr("valore")!= '0'){
				var valoreCmb=jQuery(this).attr("valore");
				jQuery(this).find("option").each(function(){
					//alert(jQuery(this).val());
					if(jQuery(this).val()==valoreCmb){
						jQuery(this).attr("selected","selected");
					}
				});
			}else{
				jQuery(this).find("option").each(function(){
					if(jQuery(this).val()==""){
						jQuery(this).attr("selected","selected");
					}
				});
			}
		});
	},
	
	//abbinamento esenzione collegata alla prestazione
	selezionaEsenzCollegate:function(elenco,elencoEse){
		
		//alert('elenco: '+elenco+'\nElencoEse: '+elencoEse);
		/*sql = "{call ? := RADSQL.RR_ESENZIONE_PRESTAZIONE('"+elenco+"','"+elencoEse+"')}";
		
		dwr.engine.setAsync(false);
		toolKitDB.executeFunctionData(sql, callEsami);
		dwr.engine.setAsync(true);*/
		var pBindMatrix=[];
		pBindMatrix.push(elenco);
		pBindMatrix.push(elencoEse);
		
		dwr.engine.setAsync(true);
		dwrUtility.executeStatement("rr_statement.xml","rr_esenzioni_prestazioni",pBindMatrix,1,callEsami);
		dwr.engine.setAsync(false);
		
		function callEsami(resp){
			//alert('callEsami ' +resp[0]+'\n'+resp[1]+'\n'+resp[2]);
			if (resp[0] == 'OK'){
			
				var splitPrestaEse=resp[2].split("$");
				
				var splitStringa=splitPrestaEse[0].split("#");
				var esenzioni_prestazione='';
				var esen_parz_associata = '';
				
				//ciclo il risultato dello split che è IDEN@IDEN_ESENZIONE,IDEN_ESENZIONE,... , IDEN@IDEN_ESENZIONE,IDEN_ESENZIONE,... , 
				for (var i=0;i<splitStringa.length;i++){

					esenzioni_prestazione=splitStringa[i].split("||");
					
					if(esenzioni_prestazione[1]){
						
						if(esenzioni_prestazione[1]!=''){						
							
							cicloEsenz=esenzioni_prestazione[1].split(","); //mi ricavo l'elenco di iden esenzioni
							
							//ciclo i vari iden prestazione che mi sono ricavato dopo un ulteriore split e 
							//per ognuno vado a controllare le esenzioni associate nel combo
							//se trovo una esenzione che è nell'elenco esenzioni dello split, arrivato dalla funzione, allora la evidenzio
							//non so se si capisce quello che ho scritto... 
							
							for (var x=0;x<cicloEsenz.length;x++){
	
								jQuery("select[idenPrest='"+esenzioni_prestazione[0]+"']").find("option").each(function(){
									
									if(jQuery(this).val()==cicloEsenz[x]){
										jQuery(this).css("background","#FFD48A");//#D7E6FC azzurrino //#FFD48A arancione
										jQuery(this).attr("selected","selected");
										jQuery(this).attr("esenzione_associata",true);
										esen_parz_associata += jQuery(this).val() +",";
									}
								});							
							}
						}
					}
				}
				
				//riciclo le prestazioni e tolgo le esenzioni associati alle prestazioni che non le prevedono

				for (var i=0;i<splitStringa.length;i++){
					
					esenzioni_prestazione=splitStringa[i].split("||");

				
					jQuery("select[idenPrest='"+esenzioni_prestazione[0]+"']").find("option").each(function(idx){

						
						var split_ese = esen_parz_associata.split(",");
						var split_ese_noAssociaz = splitPrestaEse[1].split(",");
						var this_opt=jQuery(this);
						//alert('valore: '+this_opt.val()+'\nselected: '+this_opt.attr("selected"));
						//alert('splitEse: '+split_ese[idx]);
						//alert('splitPrestaEse[1]: '+splitPrestaEse[1]);
						
					/*	for (var x=0; x<split_ese.length; x++){
							if((this_opt.val() != "") && (this_opt.val()==split_ese[x]) && (!this_opt.attr("selected"))){
								this_opt.remove();
							}

						}*/
						
						if (split_ese_noAssociaz == ''){
							
							for (var x=0;x<split_ese_noAssociaz.length;x++){
								
								var debug =	'\n DEBUG ESENZ ASSOCIATE == NULL'+
											'\n Esenzione Testo: '		+this_opt.text()+
											'\n Esenzione valore: '		+this_opt.val()+
											'\n Attributo esenz_ass: '	+this_opt.attr("esenzione_associata")+
											'\n SplitEsenzAss: '		+split_ese_noAssociaz[x]+
											'\n condiz (this_opt.val() != ""): '+(this_opt.val() != "")+
											'\n condiz (this_opt.val()!= split_ese_noAssociaz[x]): '+(this_opt.val()!= split_ese_noAssociaz[x])+
											'\n condiz this_opt.attr("esenzione_associata") != true): '+(!this_opt.attr("esenzione_associata"))+
											
											'\nCondizione soddisfatta?: '+((this_opt.val() != "") && 
																			(this_opt.val()!= split_ese_noAssociaz[x]) && 
																			(!this_opt.attr("esenzione_associata")) &&
																			(TABELLA.in_array(splitPrestaEse[1].split(","), this_opt.val()) == false));
								//alert(debug);
								
								if((this_opt.val() != "") && 
										(this_opt.val()!= split_ese_noAssociaz[x]) && 
											(!this_opt.attr("esenzione_associata")) &&
												(TABELLA.in_array(splitPrestaEse[1].split(","), this_opt.val()) == false) ){
									//alert('Elimino '+this_opt.val() + ' - '+this_opt.text());


							//		this_opt.remove();
								}
							}
							
						}else{
							
							var debug =	'\n DEBUG ESENZ ASSOCIATE != NULL'+
										'\n Esenzione Testo: '		+this_opt.text()+
										'\n Esenzione valore: '		+this_opt.val()+
										'\n Attributo esenz_ass: '	+this_opt.attr("esenzione_associata")+
										'\n condiz (this_opt.val() != ""): '+(this_opt.val() != "")+
										'\n condiz (TABELLA.in_array(splitPrestaEse[1].split(","), this_opt.val()) == false): '+(TABELLA.in_array(splitPrestaEse[1].split(","), this_opt.val()) == false)+
										'\n condiz this_opt.attr("esenzione_associata") != true): '+(!this_opt.attr("esenzione_associata"))+
							
										'\nCondizione soddisfatta?: '+((this_opt.val() != "") && 
																		(!this_opt.attr("esenzione_associata")) &&
																			(TABELLA.in_array(splitPrestaEse[1].split(","), this_opt.val()) == false));
							//alert(debug);

							
							if((this_opt.val() != "") && 
									(!this_opt.attr("esenzione_associata")) &&
										(TABELLA.in_array(splitPrestaEse[1].split(","), this_opt.val()) == false)){
								//alert('Elimino '+this_opt.val() + ' - '+this_opt.text());

							//	this_opt.remove();
							}
						}
					});





				}
			} else{
				alert(resp[1]);
			}
		}
	},
	
	// collegate al bottone 'applica a tutte'
	setEsenzione:function(valoreCombo){
		
		var idenEse='';
		var controllo="OK";
		
		jQuery("select[idenPrest='"+valoreCombo+"']").find("option").each(function(){
			if(jQuery(this).attr("selected")==true){
				
				//controllo attributo esenzione associata
				if (jQuery(this).attr("esenzione_associata") == true){
					controllo="KO";
				}
				
				idenEse=jQuery(this).val();
			}
		});
		
		var elencoCmb = jQuery(".esenz");
		elencoCmb.find("option").each(function(idx){
			if (idenEse==jQuery(this).val()){
				jQuery(this).attr("selected","selected");	
			}			
		});
			
		if(controllo=='KO'){
			alert("Attenzione! Non è possibile applicare questo tipo di esenzione a tutte le prestazioni selezionate, ma solo a quelle che la prevedono");
		}
	},
	
	//function modificata per le esenzioni
	in_array:function(thaArray, element){	

		var res=false;	
		for(var e=0;e<thaArray.length;e++){
			//alert('thaArray[e]: '+thaArray[e] +'\n\nelement: '+element);
			if(thaArray[e] == element){
				res=true;
				break;
			}
		}return res;
	}
};

//ARRY Cambio la redirezione di pagina se sono dentro la cartella o meno
function redirectWkCreate(){
	if(top.name != 'schedaRicovero' || provenienza=='AMB'){
		//Fuori cartella chiudo tutto e lascio solo la wk
		var url="servletGenerator?KEY_LEGAME=RICETTA_WORKLIST_CREATE&WHERE_WK= WHERE PROGRESSIVO="+document.getElementById('hProgressivo').value+"&WKPROGRESSIVO="+document.getElementById('hProgressivo').value+"&WKTIPO="+document.getElementById('hRicettaTipo').value+"&WKANAGIDEN="+document.getElementById('hAnagIden').value+"";
		if (provenienza=='AMB') { url += "&PROV=AMB";}
		window.location.replace(url,"","status=yes fullscreen=yes scrollbars=yes", true);
		//parent.self.close();
		aggiornaAnag();	
	
	}else{
		//Dentro Cartella lascio la cartella stessa aperta
		location.replace("servletGenerator?KEY_LEGAME=RICETTA_WORKLIST_CREATE&WHERE_WK= WHERE PROGRESSIVO="+document.getElementById('hProgressivo').value+"&WKPROGRESSIVO="+document.getElementById('hProgressivo').value+"&WKTIPO="+document.getElementById('hRicettaTipo').value+"&WKANAGIDEN="+document.getElementById('hAnagIden').value+"");
		//window.open("servletGenerator?KEY_LEGAME=RICETTA_WORKLIST_CREATE&WHERE_WK= WHERE PROGRESSIVO="+document.getElementById('hProgressivo').value+"&WKPROGRESSIVO="+document.getElementById('hProgressivo').value+"&WKTIPO="+document.getElementById('hRicettaTipo').value+"&WKANAGIDEN="+document.getElementById('hAnagIden').value+"","","status=yes fullscreen=yes", true);aggiornaAnag();
	}	
}

function redirectWkConfermate(ricette){
	var param = [
		"KEY_LEGAME=RICETTA_WORKLIST_CONFERMATE",
		"idRemoto="+($("form[name=EXTERN] input[name=idRemoto]").val() || ""),
		//"DA_DATA="+($("form[name=EXTERN] input[name=DA_DATA]").val() || ""),
		//"A_DATA="+($("form[name=EXTERN] input[name=A_DATA]").val() || ""),
		"RICETTE_CREATE="+(typeof ricette === 'string' ? ricette : ''),
		"PROV="+($("form[name=EXTERN] input[name=PROV]").val() || "")
	];
	location.replace("servletGenerator?"+param.join("&"));
}

function caricaPrestazioni(elencoPrest){
	if (elencoPrest!=""){
		var aPrest=elencoPrest.split("@");
		sql="select iden,descrizione,codice,num_sedute,cicliche from radsql.view_rr_prestazioni where codice_regionale in ('";
		for (var i=0; i<aPrest.length; i++){
			if (i>0) { sql+=",'";}
			sql += aPrest[i]+"'";
		}
		sql+=")";
		
		var visualizzaPazienteOCI = false;
		dwr.engine.setAsync(false);		
		toolKitDB.getListResultData(sql, function(result){
			var aPrest= new Array();
			for (var i=0; i< result.length; i++){
				var numSedute=aPrest[3]; // default 0
				var compl=aPrest[4]; // 0= non ciclica, 1=ciclica primaria, 2=ciclica secondaria, 3=complementare
				var prestazione = new Prestazione(result[2]);
				prestazione.setTipoCiclicita(compl);
				prestazione.setLimiteSedute(Number(result[3])||0);
				//alert(aPrest);
				//alert("Iden: "+aPrest[0]+"\nCicliche: "+compl+"\nN° Sedute: "+numSedute);
				TABELLA.aggiungiRiga(i, aPrest[0]+"$"+compl+"$"+numSedute, aPrest[2]+" - "+aPrest[1], 1, numSedute,"0", prestazione);
				if (prestazione.getListaIDNote().length > 0) {
					visualizzaPazienteOCI = true;
				}
			}
		});
		$('#lblPaziente').parent().parent().css('display', visualizzaPazienteOCI ? 'block' : 'none');
		dwr.engine.setAsync(true);
	}
}

function SalvaEsenzioniPaziente(){
	var idenAnag=$("#hAnagIden").val();
	var sql="select iden_esenzione from radsql.esenzioni_paziente where iden_anag="+idenAnag;
	dwr.engine.setAsync(false);		
	toolKitDB.getListResultData(sql, fcb_esenzioniPaziente);
	dwr.engine.setAsync(true);
}

function fcb_esenzioniPaziente(aEsePaz){
	var idenAnag = $("#hAnagIden").val();
	var elencoEse = $("select[name='EsenzioniScelte']");
	var eseTrovata;
	//alert(aEsePaz);
	elencoEse.find("option").each(function(){	
		var valore=jQuery(this).val();
		eseTrovata=false;
		for (var i=0; i<aEsePaz.length; i++){
			if (aEsePaz[i]==valore){ eseTrovata=true;}
		}					
		if (eseTrovata==false){
			sql="insert into RADSQL.ESENZIONI_PAZIENTE (iden_anag,iden_esenzione,data_inizio) values ("+ idenAnag +","+valore+",to_char(sysdate,'YYYYMMDD'))";
			//alert(sql);
			dwr.engine.setAsync(false);
			toolKitDB.executeQueryData(sql);	
			dwr.engine.setAsync(true);
		}
	});
}

function testPrestAttiva(codPrest){
	var pBindMatrix = new Array(codPrest.split('$')[0]);
	var ret = 'N';
	
	dwr.engine.setAsync(false);
	dwrUtility.executeStatement("rr_statement.xml","rr_prest_attiva",pBindMatrix,1,function(resp){
		//alert(resp[0]+'\n'+resp[1]+'\n'+resp[2]);
		if (resp[0]=='OK'){
			ret= resp[2];
		}
		else ret= 'N' ;
	});
	dwr.engine.setAsync(true);
	
	return ret;
}

/**
 * Invia o conferma la ricetta.
 * 
 * @param {Object}    parametri in ingresso
 * @param success     funzione di callback da eseguire in caso di successo
 */
function inviaRicetta(param, success) {
	if (top.name == 'schedaRicovero' && provenienza == ''){
		try { top.utilMostraBoxAttesa(true); } catch(e) {}
	}
	
	var pBinds;
	var tipoInvio = String(param.dematerializzata).toUpperCase();
	
	switch (tipoInvio) {
	case 'N': /* invio ricetta rossa tradizionale */
	case 'S': /* invio dematerializzata già effettuato */
	case 'D': /* invio dematerializzata differita */
		pBinds = [param.progressivo, tipoInvio];
		dwr.engine.setAsync(false);
		dwrUtility.executeStatement("rr_statement.xml", 'inviaRicettaDematerializzata', pBinds, 2, callback);
		dwr.engine.setAsync(true);
		break;
	default:
		alert('Tipo invio non riconosciuto.');
		break;
	}
	
	function callback(resp) {
		jQuery('#lblRegistra').attr('disabled', false);
		if(resp[0]=='OK') {
			var e = new Object();
			eval("e = "+resp[2]+';');
			
			if (e.number > -1) {
				alert(e.message);
			}
			
			success(resp[3]);
		} else{
			alert(resp[1]);
		}
	}
	return;
}

// Rimuove i caratteri proibiti
function parseChars(s) {
	return s.replace(/[\;\$]+/g, ' ');
}