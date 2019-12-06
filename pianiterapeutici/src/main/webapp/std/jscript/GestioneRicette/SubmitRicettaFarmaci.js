/**
 * File JavaScript in uso dalla pagina RICETTA_FARMACI.
 */
//location.href = 'PageUnderConstruction.htm';

var esenzione_redd , esenzione_redd_multi , esenzione_epf, esenzione_patologia, esenzione_tdl, esenzione_tdl_posologia;
var listcuf_select;
var aMotiviNonSostCod;
var aMotiviNonSostDescr;
var provenienza = typeof document.EXTERN.PROV != 'undefined'?document.EXTERN.PROV.value:'';
var abilitato = 'ABILITA_DEMA_FARM';
var preferenza = 'CHECK_DEMA_FARM';

//Default Value!!!
document.getElementById('hRicettaTipo').value = "F";

jQuery(document).ready(function(){	
	caricamento();
	setEvents();
	infoFarmaci.init();
});

var infoFarmaci = {
	init: function(){
		$('.Link').live('click',function(){
			infoFarmaci.open();			
		});
	},
	
	open: function(){
		var paramObj = {
				obj:null,
				title:null,
				width:500,
				height:330
		};
		var testoInfo="In relazione alla nuova normativa, è possibile continuare a prescrivere il nome commerciale del farmaco (come avviene oggi) ad eccezione del caso di<br>";
		testoInfo += "- prescrizione di farmaci a brevetto scaduto<br>";
		testoInfo += "- per pazienti trattati per la prima volta per una patologia cronica<br>";
		testoInfo += "- per pazienti affetti da un nuovo episodio di patologia non cronica<br>";
		testoInfo += "In questi ultimi casi, il medico può inserire il nome del farmaco di marca, ma deve sempre indicare anche il principio attivo e solo nel caso in cui voglia "; 
		testoInfo += "rendere NON SOSTITUIBILE la prescrizione dovrà apporre oltre l'indicazione di 'non sostituibilità' anche una motivazione sintetica";
		paramObj.obj = $("<p>"+testoInfo+"</p>");
		paramObj.title='Informativa sulla prescrizione dei farmaci';
		
		popupInfoFarmaci.append({
				obj:paramObj.obj,
				title:paramObj.title,
				width:paramObj.width,
				height:paramObj.height
			});
		}	
};

var popupInfoFarmaci ={
		append:function(pParam){
			popupInfoFarmaci.remove();
			
			pParam.header = (typeof pParam.header != 'undefined' 	? pParam.header : null);
			pParam.footer = (typeof pParam.footer != 'undefined' 	? pParam.footer : null);
			pParam.title = 	(typeof pParam.title != 'undefined' 	? pParam.title 	: "");
			pParam.width = 	(typeof pParam.width != 'undefined' 	? pParam.width 	: 500);
			pParam.height = (typeof pParam.height != 'undefined' 	? pParam.height : 300);				
			$("body").append(
				$("<div id='divPopUpInfoFarmaci'></div>")
					.css("font-size","12px")
					.append(pParam.header)
					.append(pParam.obj)
					.append(pParam.footer)
					.attr("title",pParam.title)
			);
			
			$("#divPopUpInfoFarmaci").dialog({
				position:	[event.clientX,event.clientY],
				width:		pParam.width,
				height:		pParam.height
			});
	
			popupInfoFarmaci.setRemoveEvents();

		},
	
	remove:function(){
		$('#divPopUpInfoFarmaci').remove();
	},
	
	setRemoveEvents:function(){
		$("body").click(popupInfoFarmaci.remove);
	}
};

function caricamento(){
	
	selMotiviNonSost();
	
	//ARRY Nascondo il bottone chiudi se apro la scheda dalla cartella
	if (top.name == 'schedaRicovero' && provenienza == ''){
		document.getElementById('lblAnnulla').parentElement.parentElement.style.display = 'NONE';
		try { top.utilMostraBoxAttesa(false); } catch(e) {}
	}
	
	document.getElementById('lblQuesito').parentElement.rowSpan = 3;

	jQuery("[name='EsenzioniScelte']").css("width", "100%").css("font-size", "10px");
	jQuery("[name='EsenzioniAnagrafe']").css("width", "100%").css("font-size", "10px");
	jQuery("[name='hEsenzioniParticolari']").parent().hide();
	jQuery("[name='hEsenzioniPatologia']").parent().hide();

	TABELLA.alterTable('APPEND');
	
	if (_STATO_PAGINA=='I'){
		HideLayer('groupSoggettiAssicurati');
		Load_FarmListbox();
	}
	
	var tipoUtente=baseUser.TIPO;
	
	/* CONTROLLO SULL'UTENTE PER FARE EDITARE IL CODICE FISCALE DEL MEDICO
	 * BISOGNA METTERE IL CAMPO txtMedCodFisc SU HTML_CAMPI_STATO = 'E' SEMPRE
	
	if (tipoUtente == 'I'){
		jQuery("#txtMedCodFisc").attr("STATO_CAMPO","L");
	}else if(tipoUtente == 'M'){
		jQuery("#txtMedCodFisc").attr("STATO_CAMPO","E");
	}
	*/
	
	//assegno di default il servizio Sanitario Nazionale
	jQuery("select[name='cmbTipoRicetta']").find('option').each(function(){
		if(jQuery(this).val()=='SSN'){
			jQuery(this).attr("selected","selected");
		}
	});
	$('#txtQuesitoLibero').addClass('expand');
	$("textarea[class*=expand]").TextAreaExpander(20,200);
	
	if (typeof document.EXTERN.quesito != 'undefined'){
		// se passato come parametro in url, carica il quesito
		$("#txtQuesitoLibero").val($("#quesito").val());
	}
	
	setTimeout("coloraRiga()",1000);
}

function apriSceltaFarmaci(){
	
	var finestra = window.open("servletGenerator?KEY_LEGAME=SCELTA_FARMACI","","status=yes fullscreen=yes");
    try{
    	top.opener.parent.idRicPazRicercaFrame.closeWhale.pushFinestraInArray(finestra);
       	}catch(e){}
}


function setEvents(){
	
	if (_STATO_PAGINA = 'I'){
		
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
			*/
		};
		
		//ONDBLCLICK EsenzioniScelte
		jQuery("select[name='EsenzioniScelte']").dblclick(function(){
			remove_elem_by_sel('EsenzioniScelte');
		});
		
		//ONDBLCLICK EsenzioniAnagrafe
		jQuery("select[name='EsenzioniAnagrafe']").dblclick(function(){
			add_selected_elements('EsenzioniAnagrafe', 'EsenzioniScelte', true);sortSelect('EsenzioniScelte');
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
		
		$('#lblRicercaPrestazioni LEGEND').prepend($("<div></div>").addClass('Link'));
		$('#lblRicercaPrestazioniNonEse LEGEND').prepend($("<div></div>").addClass('Link'));
		
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


/*
function selezionaRiga(index, listName){

	var elencoList = '';
	
	if (index == '-1'){return;}
	
	switch (listName){
	
		case 'FarmaciSceltiEsenti' :
		case 'FarmaciSceltiEsenti_Scatole' :
		case 'FarmaciSceltiEsenti_Posologia' :
		case 'FarmaciSceltiEsenti_cuf' :
			
			elencoList='FarmaciSceltiEsenti,FarmaciSceltiEsenti_Scatole,FarmaciSceltiEsenti_Posologia,FarmaciSceltiEsenti_cuf';
			selRiga(elencoList);
			break;
			
		case 'FarmaciSceltiNONEsenti' :
		case 'FarmaciSceltiNONEsenti_Scatole' :
		case 'FarmaciSceltiNONEsenti_Posologia' :
		case 'FarmaciSceltiNONEsenti_cuf' :
			
			elencoList='FarmaciSceltiNONEsenti,FarmaciSceltiNONEsenti_Scatole,FarmaciSceltiNONEsenti_Posologia,FarmaciSceltiNONEsenti_cuf';
			selRiga(elencoList);
			break;
			
		case 'FarmaciSceltiNONMutuabili' :
		case 'FarmaciSceltiNONMutuabili_Scatole' :
		case 'FarmaciSceltiNONMutuabili_Posologia' :
		case 'FarmaciSceltiNONMutuabili_cuf' :
			
			elencoList='FarmaciSceltiNONMutuabili,FarmaciSceltiNONMutuabili_Scatole,FarmaciSceltiNONMutuabili_Posologia';//,FarmaciSceltiNONMutuabili_cuf
			selRiga(elencoList);
			break;
			
		default:
			
			break;
		
	}
	
	function selRiga(lista){
		var sceltaSplit = lista.split(",");
		
		for(var i=0; i<sceltaSplit.length; i++){
			//alert(document.getElementById(sceltaSplit[i]));
			document.getElementById(sceltaSplit[i]).options.selectedIndex = index;
			document.getElementById(sceltaSplit[i]).scrollTop = document.getElementById(listName).scrollTop;
		}
	}
}
*/
/*Evoluzione di "function registra"  in engine\gestione.js */
function savedata_callBack(attiva_controllo){
	
	var SAVERESPONSE = false;
	_MSG_ERROR = '';
	
	if(typeof attiva_controllo != 'boolean') { attiva_controllo = true;}	
	if(check_dati(attiva_controllo) == ''){
		if(document.richiediUtentePassword.getRichiediPwdRegistra()) {
			document.richiediUtentePassword.view('registra(false);', 'S');
		}
		else{
			jQuery('#lblRegistra').attr('disabled', true);
			document.apriAttesaSalvataggio();		
			set_operazione();
			send_dati();
		}
		SAVERESPONSE = true;
	}
	return SAVERESPONSE;
}


/* Salvataggio sul pulsante conferma*/
function SalvaPrescrizione(){	
	
	var commit_transac=true;
	var flgMotivoNonSost=false;
	//reset boolean..
	esenzione_redd = false;
	esenzione_redd_multi = false;
	esenzione_epf = false;
	esenzione_patologia = false;
	esenzione_tdl =false;
	esenzione_tdl_posologia =false;
	
	//Impostazione SITO a "ALL" per salvataggio..
	_SITO_PAGINA = 'ALL';
	try{ document.EXTERN.SITO.value = "ALL"; } catch(e){}

	//ESENZIONI..
	var insert_ese=false;
	var lst_ese=document.getElementsByName("EsenzioniScelte")[0];
	var strese = '', load_esen = '';
	
	var load_esenzioni = '';
	for (var x=0;x<lst_ese.length;x++){
		load_esenzioni+=lst_ese[x].text + '#';
	}

	if (lst_ese){
		for (var i=0; i<lst_ese.length;i++){
			insert_ese=true;
			strese = strese + lst_ese[i].value + ";";
			load_esen = load_esen + lst_ese[i].value + ",";
			controllo_esenzioni(lst_ese[i].value);
		}	
		load_esen = load_esen.substring(0, load_esen.length-1);	
	}		
	//stringa esenzioni...
	document.getElementById('hEsenzioniScelte').value = strese;
	document.getElementById('hEsenzioniDescr').value = load_esenzioni;

	
	//elenco esenzioni per reload
	document.getElementById('hstringaEsenzioni').value = load_esen;
	
	//FARMACI ESENTI..
	var insert_esenfarm=false;	
	var strpresrizione_esenti = '';
	var lst_esen_farm = jQuery(".farmaciEsen");
	var lst_esen_qta=jQuery(".nConf");
	var lst_esen_posolog=jQuery(".posologia");
	var lst_esen_cuf=jQuery(".notaCuf");
	var lst_esen_prattivo=$(".prAttivo");
	var lst_esen_nonSost=$(".nonSostituibile");
	var lst_esen_motivo=$(".motivo");
	var testoMotivo='';
	var testoNonCorretto='';
	
	if (lst_esen_farm){
		lst_esen_farm.each(function(idx){
			//alert("lst_esen_qta["+idx+"]="+jQuery(lst_esen_qta[idx]).val());
			//alert("lst_esen_posolog["+idx+"]="+jQuery(lst_esen_posolog[idx]).val());
			//alert("lst_esen_cuf["+idx+"]="+jQuery(lst_esen_cuf[idx]).val());
			if (esenzione_tdl){ 
				var tdl_posolog =jQuery(lst_esen_posolog[idx]).val();
				if (tdl_posolog.length ==0){esenzione_tdl_posologia = true;}
			}
			strpresrizione_esenti += jQuery(this).attr("valore")+ "$" + parseChars(jQuery(this).text()) + "$" + parseChars(jQuery(lst_esen_posolog[idx]).val()) + "$" + parseChars(jQuery(lst_esen_cuf[idx]).val()) + "$" + parseChars(jQuery(lst_esen_qta[idx]).val())+ "$0";
			//alert($(lst_esen_prattivo[idx]).attr('checked'));
			if ($(lst_esen_prattivo[idx]).attr('checked')== true) 
				strpresrizione_esenti +="$1";
			else 
				strpresrizione_esenti +="$0";
			//alert($(lst_esen_nonSost[idx]).attr('checked'));
			testoMotivo='';
			if ($(lst_esen_nonSost[idx]).attr('checked')== true){
				strpresrizione_esenti +="$1";
				//if ($(lst_esen_motivo[idx]).val()==''){ // il motivo è obbligatorio
				if (lst_esen_motivo[idx].options[0].selected){
					testoNonCorretto=lst_esen_motivo[idx].options[0].text;
					flgMotivoNonSost|=true;
				}
				else {
					for (var k=1; k<lst_esen_motivo[idx].length; k++){
						if (lst_esen_motivo[idx].options[k].selected){
							flgMotivoNonSost|=false;
							//testoMotivo=aMotiviNonSostDescr[k-1];
							testoMotivo = lst_esen_motivo[idx].options[k].value; // codice del motivo
						}
					}
				}				
			} // non sostituibilità checked			
			else 
				strpresrizione_esenti +="$0";
			strpresrizione_esenti += "$"+ parseChars(testoMotivo)+";";
			//alert(strpresrizione_esenti);
			insert_esenfarm=true;
		});
	}
	//Iden-Descrizione-Posologia-cuf-Quantità-0-prAttivo-nonSost-motivo 
	
	document.getElementById('hFarmaciSceltiEsenti').value = strpresrizione_esenti;
	
	var lst_nonesen_farm=jQuery(".farmaciNonEse");
	var lst_nonesen_qta=jQuery(".nConfNonEse");
	var lst_nonesen_posolog=jQuery(".posologiaNonEse");
	var lst_nonesen_cuf=jQuery(".notaCufNonEse");
	var lst_nonesen_prattivo=$(".prAttivoNonEse");
	var lst_nonesen_nonSost=$(".nonSostituibileNonEse");
	var lst_nonesen_motivo=$(".motivoNonEse");
	var strpresrizione_nonesenti = '';
	if (lst_nonesen_farm){
		lst_nonesen_farm.each(function(idx){
			//alert('jQuery(this).attr("valore")='+jQuery(this).attr("valore"));
			//alert('jQuery(this).text()='+jQuery(this).text());
			//alert("lst_nonesen_qta["+idx+"]="+jQuery(lst_nonesen_qta[idx]).val());
			//alert("lst_nonesen_posolog["+idx+"]="+jQuery(lst_nonesen_posolog[idx]).val());
			//alert("lst_nonesen_cuf["+idx+"]="+jQuery(lst_nonesen_cuf[idx]).val());
			strpresrizione_nonesenti += jQuery(this).attr("valore") + "$" + parseChars(jQuery(this).text()) + "$" + parseChars(jQuery(lst_nonesen_posolog[idx]).val()) + "$" + parseChars(jQuery(lst_nonesen_cuf[idx]).val()) + "$" + parseChars(jQuery(lst_nonesen_qta[idx]).val()) +"$0";
			//alert($(lst_nonesen_prattivo[idx]).attr('checked'));
			if ($(lst_nonesen_prattivo[idx]).attr('checked')== true) 
				strpresrizione_nonesenti +="$1";
			else 
				strpresrizione_nonesenti +="$0";
			//alert($(lst_nonesen_nonSost[idx]).attr('checked'));
			if ($(lst_nonesen_nonSost[idx]).attr('checked')== true) {
				strpresrizione_nonesenti +="$1";
				if (lst_nonesen_motivo[idx].options[0].selected){
					testoNonCorretto=lst_nonesen_motivo[idx].options[0].text;
					flgMotivoNonSost|=true;
				}
				else{
					for (var k=1; k<lst_nonesen_motivo[idx].length; k++){
						if (lst_nonesen_motivo[idx].options[k].selected){
							flgMotivoNonSost|=false;
							//testoMotivo=aMotiviNonSostDescr[k-1];
							testoMotivo = lst_nonesen_motivo[idx].options[k].value; // codice del motivo
						}
					}
				}				
			}				
			else 
				strpresrizione_nonesenti +="$0";
			strpresrizione_nonesenti += "$"+ parseChars(testoMotivo)+";";
			//alert("strpresrizione_nonesenti="+strpresrizione_nonesenti);
		});
	}
	//Iden-Descrizione-Posologia-cuf-Quantità 
	document.getElementById('hFarmaciSceltiNONEsenti').value = strpresrizione_nonesenti;
	
	//FARMACI NON MUTUABILI..
	var lst_nonmut_farm=jQuery(".farmaciNonMut");
	var lst_nonmut_qta=jQuery(".nConfNonMut");
	var lst_nonmut_posolog=jQuery(".posologiaNonMut");
	var strpresrizione_nonmut = '';
	if (lst_nonmut_farm){
		lst_nonmut_farm.each(function(idx){
			//alert("jQuery(this).attr('valore')="+jQuery(this).attr("valore"));
			//alert("jQuery(this).text()="+jQuery(this).text());
			//alert("jQuery(lst_nonmut_posolog[idx]).val()="+jQuery(lst_nonmut_posolog[idx]).val());
			
			strpresrizione_nonmut += jQuery(this).attr("valore") + "$" + parseChars(jQuery(this).text()) + "$" + parseChars(jQuery(lst_nonmut_posolog[idx]).val()) + "$$"+ parseChars(jQuery(lst_nonmut_qta[idx]).val()) + "$0$0$0$;";
			//alert("strpresrizione_nonmut="+strpresrizione_nonmut);
		});
	}	

	//Iden-Descrizione-Posologia-cuf-Quantità
	document.getElementById('hFarmaciSceltiNONMutuabili').value = strpresrizione_nonmut;
	
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

	//Controllo inserimento Farmaci..
	//if((document.all.FarmaciSceltiEsenti.length==0) && (document.all.FarmaciSceltiNONEsenti.length==0) && (document.all.FarmaciSceltiNONMutuabili.length==0)) {
	if (lst_esen_farm.length==0 && lst_nonesen_farm.length==0 && lst_nonmut_farm.length==0){
		commit_transac = false;
		alert("Prego inserire almeno un farmaco \nprima di effettuare la registrazione");
	}
	//Controllo quesito valido
	if (commit_transac){
		var quesito = $("#txtQuesitoLibero").text().trim();
		var regex = /[a-zA-Z0-9]+/;
		//alert('quesito: '+quesito);
		if (quesito != "" && !regex.test(quesito)) {
			commit_transac = false;
			alert('La nota diagnosi in forma testuale non è significativa, inserirne una di senso compiuto.');
		}
	}
	//Controllo Esenzione presente x Farmaci Esenti..
	if ((commit_transac) && (insert_esenfarm) && (!strese)){			
		commit_transac = false;
		alert("Attenzione, sono stati inseriti farmaci esenti, senza aver indicato l'esenzione!");
	}
	//Controllo Esenzione singola per reddito..
	if ((commit_transac) && (esenzione_redd_multi)){		
		commit_transac = false;
		alert("Attenzione, è stata inserita più di un esenzione per reddito, si deve selezionarne soltanto una!");	
	}
	//Controllo Esenzione EPF per reddito..
	if ((commit_transac) && (esenzione_epf) && (esenzione_patologia == false)){		
		commit_transac = false;
		alert("Attenzione, è stata inserita un esenzione EPF per reddito, senza inserire l'esenzione per Patologia, prego selezionarne una!");	
	}
	//Controllo Posologia con Esenzione TDL01..
	if ((commit_transac) && (esenzione_tdl_posologia)){		
		commit_transac = false;
		alert("Attenzione, è stata inserita l'esenzione 'Terapia del Dolore Severo', ed è quindi obbligatorio specificare per ogni farmaco la relativa posologia!");	
	}
	//Controllo presenza motivo per i farmaci non sostituibili
	if (commit_transac && flgMotivoNonSost){
		commit_transac = false;
		if (testoNonCorretto=='')
			alert('Attenzione, per i farmaci non sostituibili, occorre indicare il motivo della non sostituibilità');
		else
			alert('Attenzione, il testo "'+ testoNonCorretto +'" non può essere utilizzato come motivo. Selezionare una opzione tra le rimanenti');
	}
	
	// per l'ambulatorio di bolzano, salvo le esenzioni del paziente
	if (provenienza=='AMB' && baseGlobal.SITO =='BOLZANO'){
		SalvaEsenzioniPaziente();
	}
	
	//Registrazione Scheda..  	
	if (commit_transac){commit_transac = savedata_callBack(true);}
}


/*Chiusura Windows */
function chiudi(){
	
	
	if(typeof document.EXTERN.Hiden_visita!="undefined"){
		if (document.dati.Hiden.value=='')			
			top.apriWorkListRichieste();		
		else{			
			parent.opener.aggiorna();
			parent.self.close();		
		}
	}
	else{parent.self.close();}

}


/*funzione cancellazione elemento Lista*/
/*
function Del_ListSelected(elementid)
{	
  var elSel = document.getElementById(elementid);
  if (elSel){ 
	  for (var i = elSel.length - 1; i>=0; i--) {
	    if (elSel.options[i].selected) {
	    	elSel.remove(i);
	    }
	  } 
  }
}
*/

/*funzione add ListBox*/

function add_listbox (list, lst_iden, lst_text){	
	var oOpt = document.createElement("Option");
	oOpt.value = lst_iden;
	oOpt.text = lst_text;
	list.add(oOpt);
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
				else { esenzione_redd_multi = true; }
			}
			//controllo esenzioni EPF.
			if ((lst_esen_red[i].text == 'ESENZ_EPF') && (lst_esen_red[i].value == element)) {
				esenzione_epf = true;
			}
			//controllo esenzioni TDL.
			if ((lst_esen_red[i].text == 'ESENZ_TDL') && (lst_esen_red[i].value == element)) {
				esenzione_tdl = true;
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


/*funzione cancellazione singolo farmaco su evento dbl-click*/
function removeFarmaci(listtype)
{	
  var elSel_farm = document.getElementsByName(listtype)[0];
  var elSel_qta = null;
  var elSel_cuf = null;
  var elSel_posolog = null;

  //cancellazione liste..
  if (elSel_farm){ 
	  for (var i = elSel_farm.length - 1; i>=0; i--) {
	    if (elSel_farm.options[i].selected) {
	    	elSel_farm.remove(i);
	    	if (listtype == "FarmaciSceltiEsenti"){ 
	    		  	elSel_qta = document.getElementsByName("FarmaciSceltiEsenti_Scatole")[0]; 	     
	    		  	elSel_posolog = document.getElementsByName("FarmaciSceltiEsenti_Posologia")[0];
	    		  	elSel_cuf = document.getElementsByName("FarmaciSceltiEsenti_cuf")[0]; 			
	    		  	elSel_qta.remove(i);
	    		  	elSel_posolog.remove(i);
	    		  	elSel_cuf.remove(i); 	
	    	}
	    	else if (listtype == "FarmaciSceltiNONEsenti"){ 
	    		  	elSel_qta = document.getElementsByName("FarmaciSceltiNONEsenti_Scatole")[0]; 
	    		  	elSel_posolog = document.getElementsByName("FarmaciSceltiNONEsenti_Posologia")[0];
	    		  	elSel_cuf = document.getElementsByName("FarmaciSceltiNONEsenti_cuf")[0]; 
	    			elSel_qta.remove(i);
	    			elSel_posolog.remove(i);
	    			elSel_cuf.remove(i);
	    	}
	    	else if (listtype == "FarmaciSceltiNONMutuabili"){ 
	    		  	elSel_qta = document.getElementsByName("FarmaciSceltiNONMutuabili_Scatole")[0]; 
	    		  	elSel_posolog = document.getElementsByName("FarmaciSceltiNONMutuabili_Posologia")[0];
	    			elSel_qta.remove(i);
	    			elSel_posolog.remove(i);
	    	}	
	    }
	  } 
  }
}


// Popup Scatole
/*
function Win_openScatole(listtype) {
	var elSel_qta = document.getElementsByName(listtype)[0];
	var value_qta = elSel_qta.options[elSel_qta.selectedIndex].value;
	//Parametri POPUP 
	var a_str_windowURL = '';
	var a_str_windowName = "Confezioni";
	var a_int_windowWidth = 300;
	var a_int_windowHeight = 200;
	var a_bool_scrollbars = 0;
	var a_bool_resizable = 0;
	var a_bool_menubar = 0;
	var a_bool_toolbar = 0;
	var a_bool_addressbar = 0;
	var a_bool_statusbar = 0;
	var a_bool_fullscreen = 0; 
	var int_windowLeft = (screen.width - a_int_windowWidth) / 2;
	var int_windowTop = (screen.height - a_int_windowHeight) / 2;
	//Apertura Popup  
	var str_windowProperties = 'height=' + a_int_windowHeight + ',width=' + a_int_windowWidth + ',top=' + int_windowTop + ',left=' + int_windowLeft + ',scrollbars=' + a_bool_scrollbars + ',resizable=' + a_bool_resizable + ',menubar=' + a_bool_menubar + ',toolbar=' + a_bool_toolbar + ',location=' + a_bool_addressbar + ',statusbar=' + a_bool_statusbar + ',fullscreen=' + a_bool_fullscreen + '';
	var popup_window = window.open(a_str_windowURL, a_str_windowName, str_windowProperties);  
	//Creazione HTML  
	popup_window.document.write("<html>");   
	popup_window.document.write("<head>");   
	popup_window.document.write("  <title>CONFEZIONI</title>");  
	popup_window.document.write(" <script type='text/javascript'>"); 
	popup_window.document.write(" var lista_confezioni='"+listtype+"'; ");  
	popup_window.document.write(" function Win_AumentaConf1() {var Conf = document.getElementById('farm_confezioni'); var error = Win_isnum(Conf); if ((!error) && (Conf.value<99)) {Conf.value = parseInt(Conf.value)+1; } } ");   
	popup_window.document.write(" function Win_DiminuisciConf1() {	var Conf = document.getElementById('farm_confezioni'); var error = Win_isnum(Conf); if ((!error) && (Conf.value>1))  {Conf.value = parseInt(Conf.value)-1;  } }   "); 
	popup_window.document.write(" function Win_Annulla1() {window.close(); }   ");																																																														
	popup_window.document.write(" function Win_Conferma1() { var Conf = document.getElementById('farm_confezioni'); var error = Win_isnum(Conf); if (!error) { var lst_dest=opener.document.getElementById(lista_confezioni); 	lst_dest.options[lst_dest.selectedIndex].text=Conf.value; lst_dest.options[lst_dest.selectedIndex].value=Conf.value; window.close();  } } ");
	popup_window.document.write(" function Win_isnum(obj) {	var error =false; if (isNaN(obj.value) || parseInt(obj.value)<0 || parseInt(obj.value) > 99 || obj.value=='') { alert('Attenzione, inserire un numero da 1 a 99!'); obj.value=''; obj.focus(); var error =true;} return error; }	   ");
	popup_window.document.write(" </script>"); 
	popup_window.document.write("</head>");   
	popup_window.document.write("<body bgcolor='#306EFF' border='1' topmargin=50>");   
	popup_window.document.write(" <div align=center>"); 
	popup_window.document.write(" <font face='verdana' color='#FFFFFF'> Numero di Confezioni: </font>"); 
	popup_window.document.write(" <input type='text' name='farm_confezioni' id='farm_confezioni' value='"+value_qta+"' SIZE=2 MAXLENGTH=2 />");  
	popup_window.document.write(" <input type='button' value='+' onClick ='Win_AumentaConf1();'>"); 
	popup_window.document.write(" <input type='button' value='-' onClick ='Win_DiminuisciConf1();'>"); 
	popup_window.document.write(" <br /> <br />"); 
	popup_window.document.write(" <input type='button' value='Annulla'  onClick ='Win_Annulla1();' >"); 
	popup_window.document.write(" <input type='button' value='Modifica' onClick ='Win_Conferma1();'>");    
	popup_window.document.write(" </div>"); 
	popup_window.document.write("</body>");  
	popup_window.document.write("</html>");   			
	//focus
	popup_window.window.focus();
	//
    try{
    	top.opener.closeWhale.pushFinestraInArray(popup_window);
       	}catch(e){}  
}

// Popup Posologia
function Win_openPosologia(listtype) {
	var elSel_posolog = document.getElementById(listtype);
	var value_posolog = elSel_posolog.options[elSel_posolog.selectedIndex].value;
	//Parametri POPUP 
	var a_str_windowURL = '';
	var a_str_windowName = "Posologia";
	var a_int_windowWidth = 500;
	var a_int_windowHeight = 200;
	var a_bool_scrollbars = 0;
	var a_bool_resizable = 0;
	var a_bool_menubar = 0;
	var a_bool_toolbar = 0;
	var a_bool_addressbar = 0;
	var a_bool_statusbar = 0;
	var a_bool_fullscreen = 0; 
	var int_windowLeft = (screen.width - a_int_windowWidth) / 2;
	var int_windowTop = (screen.height - a_int_windowHeight) / 2;	
	//Apertura Popup  
	var str_windowProperties = 'height=' + a_int_windowHeight + ',width=' + a_int_windowWidth + ',top=' + int_windowTop + ',left=' + int_windowLeft + ',scrollbars=' + a_bool_scrollbars + ',resizable=' + a_bool_resizable + ',menubar=' + a_bool_menubar + ',toolbar=' + a_bool_toolbar + ',location=' + a_bool_addressbar + ',statusbar=' + a_bool_statusbar + ',fullscreen=' + a_bool_fullscreen + '';
	var popup_window = window.open(a_str_windowURL, a_str_windowName, str_windowProperties);   
	//Creazione HTML  
	popup_window.document.write("<html>");   
	popup_window.document.write("<head>");   
	popup_window.document.write("  <title>POSOLOGIA</title>");  
	popup_window.document.write(" <script type='text/javascript'>"); 
	popup_window.document.write(" var lista_posologia='"+listtype+"'; ");  
	popup_window.document.write(" function Win_Annulla2() {window.close(); }   ");																																																														
	popup_window.document.write(" function Win_Conferma2() {	var Posol = document.getElementById('farm_posologia');  var lst_dest=opener.document.getElementById(lista_posologia); 	lst_dest.options[lst_dest.selectedIndex].text=Posol.value; lst_dest.options[lst_dest.selectedIndex].value=Posol.value; window.close();  } ");
	popup_window.document.write(" </script>"); 
	popup_window.document.write("</head>");   
	popup_window.document.write("<body bgcolor='#306EFF' border='1' topmargin=50>");   
	popup_window.document.write(" <div align=center>"); 
	popup_window.document.write(" <font face='verdana' color='#FFFFFF'> Posologia: </font>"); 
	popup_window.document.write(" <br /> <textarea name='farm_posologia' id='farm_posologia' rows='4' cols='50'>"+value_posolog+"</textarea>");  
	popup_window.document.write(" <br /> <br />"); 
	popup_window.document.write(" <input type='button' value='Annulla'  onClick ='Win_Annulla2();' >"); 
	popup_window.document.write(" <input type='button' value='Modifica' onClick ='Win_Conferma2();'>");    
	popup_window.document.write(" </div>"); 
	popup_window.document.write("</body>");  
	popup_window.document.write("</html>");   			
	//focus
	popup_window.window.focus();
	//
    try{
    	top.opener.closeWhale.pushFinestraInArray(popup_window);
       	}catch(e){}  
}

// Caricamento Note Cuf
function NotaCuf(listfarm ,listcuf) {
	var elSel_cuf = document.getElementById(listcuf);
	var elSel_farm = document.getElementById(listfarm);
	var iden_farm = elSel_farm.options[elSel_cuf.selectedIndex].value;
	listcuf_select = listcuf;
	//Nota cuf Allegata..
	var sql="SELECT NOTA_CUF FROM RADSQL.VIEW_RR_FARMACI WHERE NOTA_CUF IS NOT NULL AND IDEN = "+iden_farm.split("$")[0];
	dwr.engine.setAsync(false);		
	toolKitDB.getListResultData(sql, Win_openNotaCuf);
	dwr.engine.setAsync(true);
}

// Popup Note Cuf
function Win_openNotaCuf(elenco) {	
	
	if(elenco.length>0){ 
		var elSel_cuf = document.getElementById(listcuf_select);
		var value_cuf = elSel_cuf.options[elSel_cuf.selectedIndex].value;
		//Parametri POPUP 
		var a_str_windowURL = '';
		var a_str_windowName = "NoteCUF";
		var a_int_windowWidth = 300;
		var a_int_windowHeight = 200;
		var a_bool_scrollbars = 0;
		var a_bool_resizable = 0;
		var a_bool_menubar = 0;
		var a_bool_toolbar = 0;
		var a_bool_addressbar = 0;
		var a_bool_statusbar = 0;
		var a_bool_fullscreen = 0; 
		var int_windowLeft = (screen.width - a_int_windowWidth) / 2;
		var int_windowTop = (screen.height - a_int_windowHeight) / 2;
		//Apertura Popup  
		var str_windowProperties = 'height=' + a_int_windowHeight + ',width=' + a_int_windowWidth + ',top=' + int_windowTop + ',left=' + int_windowLeft + ',scrollbars=' + a_bool_scrollbars + ',resizable=' + a_bool_resizable + ',menubar=' + a_bool_menubar + ',toolbar=' + a_bool_toolbar + ',location=' + a_bool_addressbar + ',statusbar=' + a_bool_statusbar + ',fullscreen=' + a_bool_fullscreen + '';
		var popup_window = window.open(a_str_windowURL, a_str_windowName, str_windowProperties);
		//Creazione HTML  
		popup_window.document.write("<html>");   
		popup_window.document.write("<head>");   
		popup_window.document.write("  <title>NOTE CUF</title>");  
		popup_window.document.write(" <script type='text/javascript'>"); 
		popup_window.document.write(" var lista_cuf='"+listcuf_select+"'; ");  
		popup_window.document.write(" function Win_Annulla3() {window.close(); }   ");																																																														
		popup_window.document.write(" function Win_Conferma3() { var cuf = document.getElementById('farm_cuf');  var lst_dest=opener.document.getElementById(lista_cuf); 	lst_dest.options[lst_dest.selectedIndex].text=cuf.value; lst_dest.options[lst_dest.selectedIndex].value=cuf.value; window.close();  } ");
		popup_window.document.write(" </script>"); 
		popup_window.document.write("</head>");   
		popup_window.document.write("<body bgcolor='#306EFF' border='1' topmargin=20>");   
		popup_window.document.write(" <div align=center>"); 
		popup_window.document.write(" <font face='verdana' color='#FFFFFF'> Nota CUF: </font>"); 
		popup_window.document.write(" <br /> <select name='farm_cuf' id='farm_cuf'><option selected value=''></option></select>");  
		popup_window.document.write(" <br /> <br />"); 
		popup_window.document.write(" <input type='button' value='Annulla'  onClick ='Win_Annulla3();' >"); 
		popup_window.document.write(" <input type='button' value='Modifica' onClick ='Win_Conferma3();'>");    
		popup_window.document.write(" </div>"); 
		popup_window.document.write("</body>");  
		popup_window.document.write("</html>");
		//Note cuf popup
		var Listbox=popup_window.document.getElementById('farm_cuf');
		for (var c=0;c<elenco.length; c++){
			var cufstring = elenco[c][0];
			if(cufstring.indexOf('-')>-1){
				var cufstring1 = cufstring.substring(0, cufstring.indexOf('-'));
				var oOption1 = popup_window.document.createElement("Option");
				oOption1.text = cufstring1;
				oOption1.value = cufstring1;	
				Listbox.add(oOption1);
				var cufstring2 = cufstring.substring(cufstring.indexOf('-')+1, cufstring.length);
				var oOption2 = popup_window.document.createElement("Option");
				oOption2.text = cufstring2;
				oOption2.value = cufstring2;	
				Listbox.add(oOption2);
			}	
			else{
				var oOption = popup_window.document.createElement("Option");
				oOption.text = cufstring;
				oOption.value = cufstring;	
				Listbox.add(oOption);
			}
		}	
		//focus
		popup_window.window.focus();
		//    
		try{
			top.opener.closeWhale.pushFinestraInArray(popup_window);
			}catch(e){}  
	}
	else{
		alert("Per questo Farmaco non esistono note Cuf Allegate!");
	}
}
*/

/*funzione per carimento dati listbox in caso di modifica*/
function Load_FarmListbox()
{
	var call_progressivo= getURLParam("idenprogressivo");
	if ((call_progressivo != null) && (call_progressivo.length > 0)) {
		//Caricamento dati
		var xml_FarmEsenti = '/PAGINA/CAMPI/CAMPO[@KEY_CAMPO="hFarmaciSceltiEsenti"]/text()';
		var xml_FarmNONEsenti= '/PAGINA/CAMPI/CAMPO[@KEY_CAMPO="hFarmaciSceltiNONEsenti"]/text()';
		var xml_FarmNONMutuabili = '/PAGINA/CAMPI/CAMPO[@KEY_CAMPO="hFarmaciSceltiNONMutuabili"]/text()';
		//sql XML
		var sql="SELECT 1 Iden, Extract(Contenuto,'"+xml_FarmEsenti+"').Getstringval() FarmEsenti " ;
		sql+=" FROM RADSQL.View_Rr_Ricetta_Rossa_Scheda WHERE PROGRESSIVO = "+call_progressivo;
		sql+=" UNION SELECT 2 Iden, Extract(Contenuto,'"+xml_FarmNONEsenti+"').Getstringval() FarmNONEsenti " ;
		sql+=" FROM RADSQL.View_Rr_Ricetta_Rossa_Scheda WHERE PROGRESSIVO = "+call_progressivo;	
		sql+=" UNION SELECT 3 Iden, Extract(Contenuto,'"+xml_FarmNONMutuabili+"').Getstringval() FarmNONMutuabili " ;
		sql+=" FROM RADSQL.View_Rr_Ricetta_Rossa_Scheda WHERE PROGRESSIVO = "+call_progressivo;
		dwr.engine.setAsync(false);	
		toolKitDB.getListResultData(sql, bck_Load_FarmListbox);
		dwr.engine.setAsync(true);	
	}
}

/*funzione call back load Farmaci*/
function bck_Load_FarmListbox(elenco){
	var prescr_ckPrAttivo='0';
	var prescr_ckNonSost='0';
	var prescr_motivoNonSost='';
	var prescr_qta;
	var esenzioniScelte = document.getElementById('hEsenzioniScelte').value.split(';');
	var esenzioniDescr = document.getElementById('hEsenzioniDescr').value.split('#');
	//alert("document.getElementById('hEsenzioniScelte').value="+document.getElementById('hEsenzioniScelte').value);
	//alert("document.getElementById('hEsenzioniDescr').value="+document.getElementById('hEsenzioniDescr').value);
	for (var i=0;i<esenzioniScelte.length;i++){
		if(esenzioniScelte[i]!=''){
			//alert('esenzioniScelte[i]: '+esenzioniScelte[i] +'\n' + 'esenzioniDescr: '+esenzioniDescr[i]);
			add_listbox(document.getElementsByName('EsenzioniScelte')[0], esenzioniScelte[i], esenzioniDescr[i]);
		}
	}
	
	for (var r=0; r<elenco.length; r++){
		var iden = elenco[r][0];	
		var strload = elenco[r][1];		
		//alert("strload="+strload);
	    
		//var lst_farm=null, lst_note=null, lst_cuf=null, lst_qta=null;
		var lst_farm=null;
		if (iden == "1" ){ //Farmaci Esenti
			lst_farm=document.getElementsByName("FarmaciSceltiEsenti")[0]; 
		}
		if (iden == "2" ){ //Farmaci NON Esenti
			lst_farm=document.getElementsByName("FarmaciSceltiNONEsenti")[0]; 
			}
		if (iden == "3" ){ //Farmaci NON Mutuabili
			lst_farm=document.getElementsByName("FarmaciSceltiNONMutuabili")[0]; 
		}
		//Split String..
		var indice=0;
		var posFinePrest;
		//alert(strload.length);
		for (var pos=0; pos<strload.length; pos++){
			posFinePrest=strload.indexOf(";",pos); // memorizzo la posizione di fine prestazione
			//Load List Farmaci..	
			var prescr_iden = strload.substring(pos, strload.indexOf("$", pos));		
			pos = strload.indexOf("$", pos)+1;
			prescr_iden = prescr_iden + '$' +strload.substring(pos, strload.indexOf("$", pos));	
			pos = strload.indexOf("$", pos)+1;
			prescr_iden = prescr_iden + '$' +strload.substring(pos, strload.indexOf("$", pos));
		
			pos = strload.indexOf("$", pos)+1;
			var prescr_desc = strload.substring(pos, strload.indexOf("$", pos));
			//alert('prescr_iden: '+prescr_iden);
			//alert('prescr_desc: '+prescr_desc);
			var posNotaCuf= prescr_desc.indexOf("CUF");
			if (posNotaCuf>0){
				prescr_cuf=prescr_desc.substr(posNotaCuf+4);
			}
			else prescr_cuf="";
			//alert('prescr_cuf='+prescr_cuf);
			//Load List Posologia..	
			pos = strload.indexOf("$", pos)+1;
			var prescr_note= strload.substring(pos, strload.indexOf("$", pos));
			//alert('prescr_note='+prescr_note);
			//Load List Cuf..	
			pos = strload.indexOf("$", pos)+1;
			var cuf_sel= strload.substring(pos, strload.indexOf("$", pos));
			//alert('cuf_sel='+cuf_sel);
			//Load List Quantità..	
			pos = strload.indexOf("$", pos)+1;
			prescr_qta= strload.substring(pos, strload.indexOf("$", pos));
			//alert('prescr_qta='+prescr_qta);
			if (posFinePrest>=pos+5){ // le ricette senza principio attivo hanno meno campi
				// load List check principio attivo
				pos = strload.indexOf("$", pos)+3;
				prescr_ckPrAttivo= strload.substring(pos, strload.indexOf("$", pos));
				//alert('prescr_ckPrAttivo='+prescr_ckPrAttivo);
				// load list check non sostituibilita
				pos = strload.indexOf("$", pos)+1;
				prescr_ckNonSost= strload.substring(pos, strload.indexOf("$", pos));
				//alert('prescr_ckNonSost='+prescr_ckNonSost);
				// load list check motivo non sostituibilita
				pos = strload.indexOf("$", pos)+1;
				prescr_motivoNonSost= strload.substring(pos, strload.indexOf(";", pos));
				//alert('prescr_motivoNonSost='+prescr_motivoNonSost);
			}
			
			if (iden=="1") {
				TABELLA.aggiungiRigaEsen(indice, prescr_iden, prescr_desc, prescr_qta,prescr_note,prescr_cuf,cuf_sel,prescr_ckPrAttivo,prescr_ckNonSost,prescr_motivoNonSost);
			}
			else if (iden=="2"){
				TABELLA.aggiungiRigaNotEsen(indice, prescr_iden, prescr_desc, prescr_qta,prescr_note,prescr_cuf,cuf_sel,prescr_ckPrAttivo,prescr_ckNonSost,prescr_motivoNonSost);
			}
			else if (iden=="3"){
				TABELLA.aggiungiRigaNonMut(indice, prescr_iden, prescr_desc, prescr_qta, prescr_note);
			}
			//aggiorna contatore
		    pos = strload.indexOf(";", pos);
			indice ++;
		}	
	}
}


//ARRY Cambio la redirezione di pagina se sono dentro la cartella o meno
function redirectWkCreate(){	
	if(top.name != 'schedaRicovero'){
		//Fuori cartella chiudo tutto e lascio lo la wk
		location.replace("servletGenerator?KEY_LEGAME=RICETTA_WORKLIST_CREATE&WHERE_WK= WHERE PROGRESSIVO="+document.getElementById('hProgressivo').value+"&WKPROGRESSIVO="+document.getElementById('hProgressivo').value+"&WKTIPO="+document.getElementById('hRicettaTipo').value+"&WKANAGIDEN="+document.getElementById('hAnagIden').value+"");
/*		var finestra =window.open("servletGenerator?KEY_LEGAME=RICETTA_WORKLIST_CREATE&WHERE_WK= WHERE PROGRESSIVO="+document.getElementById('hProgressivo').value+"&WKPROGRESSIVO="+document.getElementById('hProgressivo').value+"&WKTIPO="+document.getElementById('hRicettaTipo').value+"&WKANAGIDEN="+document.getElementById('hAnagIden').value+"","","status=yes fullscreen=yes", true);
		try{top.opener.parent.idRicPazRicercaFrame.closeWhale.pushFinestraInArray(finestra);
		   }catch(e){} 
		parent.self.close();*/
	}else{
		//Dentro Cartella lascio la cartella stessa aperta
		location.replace("servletGenerator?KEY_LEGAME=RICETTA_WORKLIST_CREATE&WHERE_WK= WHERE PROGRESSIVO="+document.getElementById('hProgressivo').value+"&WKPROGRESSIVO="+document.getElementById('hProgressivo').value+"&WKTIPO="+document.getElementById('hRicettaTipo').value+"&WKANAGIDEN="+document.getElementById('hAnagIden').value+"");
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

function aggiornaAnag(){
	
	var sql = null;
	sql = "UPDATE RADSQL.ANAG SET COM_RES ='"+document.all.hLocalita.value+"'  WHERE IDEN="+document.all.hAnagIden.value;
	
	
	dwr.engine.setAsync(false);
	toolKitDB.executeQueryData(sql, chiudi);	
	dwr.engine.setAsync(true);
}

/**
*/
function cbk_aggiornaAnag(message){
}



/**
 * (elenco farmaci esenti,elenco farmaci non esenti,elenco farmaci non mutuabili)
 */
function apriElencoFarmaci(key_legame,call_type){
	var finestra = '';
	if (key_legame=='SCELTA_FARMACI')
	{
		switch (call_type) {  
		case 'ESEN':  
			finestra = window.open("servletGenerator?KEY_LEGAME="+key_legame+"&CALL_TYPE="+call_type,"","status=yes fullscreen=yes");
			break;  
		case 'NOTESEN':  
			finestra = window.open("servletGenerator?KEY_LEGAME="+key_legame+"&CALL_TYPE="+call_type,"","status=yes fullscreen=yes");
			break;  
		case 'NOTMUT':  
			finestra = window.open("servletGenerator?KEY_LEGAME="+key_legame+"&CALL_TYPE="+call_type,"","status=yes fullscreen=yes");
			break;  
		default:
			alert('variabile di call type non definita');
		break;  	
		}
	}
	else	
	{
		finestra = window.open("servletGenerator?KEY_LEGAME="+key_legame,"","status=yes fullscreen=yes");
	}	  
	try{//RRPt Liscio
		top.opener.closeWhale.pushFinestraInArray(finestra);
	}catch(e){//Dentro la cartella
		try{
			top.opener.top.closeWhale.pushFinestraInArray(finestra);
		}catch(e){
			
		}
	}  
	
}


var TABELLA = {
	//aggiungo la tabella
	alterTable:function(istruzione){
		
		// tabella farmaci ESENTI
		var table = "<table id='tableFarmaciEsenti' width=100% >";
		table +="<tr id='primariga' height:10 px >";
		table += "<td STATO_CAMPO='E' class='classTdLabelLink aggiungi' STYLE='BORDER-BOTTOM: #00ba19 3px solid; BACKGROUND: #d6ffdc; width:1%'>" +
					"<label title='Aggiungi Farmaci' name='lblAggiungi' id='lblAggiungi'>Agg.</label>" +
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel farmaciEsentiInt' STYLE='BORDER-BOTTOM: #00ba19 3px solid; BACKGROUND: #d6ffdc; width:28%'>" +
					"<label name='lblFarmaciEsenti' id='lblFarmaciEsenti'>FARMACO</label>" +
				"</td>";
		table +="<td STATO_CAMPO='E' class='classTdLabel prAttivoInt' style='BORDER-BOTTOM: #00ba19 3px solid; BACKGROUND: #d6ffdc; width:8%'>" +
				"<label name='lblprAttivo' id='lblprAttivo'>PRESCRIVI P.A.</label>"+
				"</td>";
		table +="<td STATO_CAMPO='E' class='classTdLabel nonSostituibileInt' style='BORDER-BOTTOM: #00ba19 3px solid; BACKGROUND: #d6ffdc; width:32%'>" +
				"<label name='lblnonSostituibile' id='lblnonSostituibile'>NON SOSTITUIBILITÀ</label>"+
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel nConfInt' style='width:1%; BORDER-BOTTOM: #00ba19 3px solid; BACKGROUND: #d6ffdc;'>" +
					"<label name='lblConfezioni' id='lblConfezioni'>N. CONF.</label>" +
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel posologiaInt' style='width:20%; BORDER-BOTTOM: #00ba19 3px solid; BACKGROUND: #d6ffdc;'>" +
					"<label name='lblPosologia' id='lblPosologia'>POSOLOGIA</label>" +
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel notaCufInt' style='width:10%; BORDER-BOTTOM: #00ba19 3px solid; BACKGROUND: #d6ffdc;'>" +
					"<label name='lblNotaCuf' id='lblNotaCuf'>NOTA CUF</label>" +
				"</td>";
		table += "</tr></table>";
		
		// tabella farmaci NON ESENTI
		var tableNE = "<table id='tableFarmaciNonEsenti' width=100% >";
		tableNE +="<tr id='primarigaNE' height:10 px >";
		tableNE += "<td STATO_CAMPO='E' class='classTdLabelLink aggiungiNonEse' STYLE='BORDER-BOTTOM: red 3px solid; BACKGROUND: #ffd0c9; width:1%'>" +
					"<label title='Aggiungi Farmaci' name='lblAggiungiNonEse' id='lblAggiungiNonEse'>Agg.</label>" +
					"</td>";
		tableNE += "<td STATO_CAMPO='E' class='classTdLabel farmaciNonEsentiInt' STYLE='BORDER-BOTTOM: red 3px solid; BACKGROUND: #ffd0c9; width:28%'>" +
					"<label name='lblFarmaciNonEsenti' id='lblFarmaciNonEsenti'>FARMACO</label>" +
					"</td>";
		tableNE +="<td STATO_CAMPO='E' class='classTdLabel prAttivoNonEseInt' style='BORDER-BOTTOM: red 3px solid; BACKGROUND: #ffd0c9; width:8%'>" +
				"<label name='lblprAttivo' id='lblprAttivo'>PRESCRIVI P.A.</label>"+
				"</td>";
		tableNE +="<td STATO_CAMPO='E' class='classTdLabel nonSostituibileNonEseInt' style='BORDER-BOTTOM: red 3px solid; BACKGROUND: #ffd0c9; width:32%'>" +
				"<label name='lblnonSostituibile' id='lblnonSostituibile'>NON SOSTITUIBILITÀ</label>"+
				"</td>";
		tableNE += "<td STATO_CAMPO='E' class='classTdLabel nConfNonEseInt' style='width:1%; BORDER-BOTTOM: red 3px solid; BACKGROUND: #ffd0c9;'>" +
					"<label name='lblConfezioniNonEse' id='lblConfezioniNonEse'>N. CONF.</label>" +
					"</td>";
		tableNE += "<td STATO_CAMPO='E' class='classTdLabel posologiaNonEseInt' style='width:20%; BORDER-BOTTOM: red 3px solid; BACKGROUND: #ffd0c9;'>" +
				"<label name='lblPosologiaNonEse' id='lblPosologiaNonEse'>POSOLOGIA</label>" +
				"</td>";
		tableNE += "<td STATO_CAMPO='E' class='classTdLabel notaCufNonEseInt' style='width:10%; BORDER-BOTTOM: red 3px solid; BACKGROUND: #ffd0c9;'>" +
				"<label name='lblNotaCufNonEse' id='lblNotaCufNonEse'>NOTA CUF</label>" +
				"</td>";
		tableNE += "</tr></table>";
		
		// tabella farmaci NON MUTUABILI
		var tableNM = "<table id='tableFarmaciNonMutuabili' width=100% >";
		tableNM +="<tr id='primarigaNM' height:10 px >";
		tableNM += "<td STATO_CAMPO='E' class='classTdLabelLink aggiungiNonMut' STYLE='BORDER-BOTTOM: #fed561 3px solid; BACKGROUND: #f6f1df; width=3%'>" +
					"<label title='Aggiungi Farmaci' name='lblAggiungiNonMut' id='lblAggiungiNonMut'>Agg.</label>" +
					"</td>";
		tableNM += "<td STATO_CAMPO='E' class='classTdLabel farmaciNonMutInt' STYLE='BORDER-BOTTOM: #fed561 3px solid; BACKGROUND: #f6f1df; width=40%'>" +
				"<label name='lblFarmaciNonMut' id='lblFarmaciNonMut'>FARMACO</label>" +
				"</td>";
		tableNM += "<td STATO_CAMPO='E' class='classTdLabel nConfNonMutInt' style='width:5%; BORDER-BOTTOM: #fed561 3px solid; BACKGROUND: #f6f1df;'>" +
					"<label name='lblConfezioniNonMut' id='lblConfezioniNonMut'>N. CONF.</label>" +
					"</td>";
		tableNM += "<td STATO_CAMPO='E' class='classTdLabel posologiaNonMutInt' style='width:40%; BORDER-BOTTOM: #fed561 3px solid; BACKGROUND: #f6f1df;'>" +
				"<label name='lblPosologiaNonMut' id='lblPosologiaNonMut'>POSOLOGIA</label>" +
				"</td>";
		tableNM += "</tr></table>";
		
		switch(istruzione){
		
			case 'CLEAR_FE':
				jQuery("#tableFarmaciEsenti").remove();
				jQuery("#divFarmaciEsenti").append(table);				
				break;
				
			case 'CLEAR_FNE':
				jQuery("#tableFarmaciNonEsenti").remove();
				jQuery("#divFarmaciNonEsenti").append(tableNE);				
				break;
			case 'CLEAR_FNM':
				jQuery("#tableFarmaciNonMutuabili").remove();
				jQuery("#divFarmaciNonMutuabili").append(tableNM);				
				break;
				
			case 'APPEND':
				
			default:
				jQuery("#divFarmaciEsenti").append(table);
				jQuery("#divFarmaciNonEsenti").append(tableNE);
				jQuery("#divFarmaciNonMutuabili").append(tableNM);
				break;		
		}
		
		jQuery("#lblAggiungi").parent().click(function(){
			apriElencoFarmaci('SCELTA_FARMACI','ESEN');
		}); //.css("background-color","#FFC663"); se si vuole aggiungere un colore al pulsante Aggiungi
		
		jQuery("#lblAggiungiNonEse").parent().click(function(){
			apriElencoFarmaci('SCELTA_FARMACI','NOTESEN');
		});
		
		jQuery("#lblAggiungiNonMut").parent().click(function(){
			apriElencoFarmaci('SCELTA_FARMACI','NOTMUT');
		});
	},
	
	aggiungiRigaEsen:function(indice, value, text, quantita,poso,noteCuf,notaCufSel,ckPrAttivo,ckNonSost,motivoNonSost){
		var maxIndice = Number(($("table#tablePrestazioni tr.trFarmaEse").last().attr("id") || "tr_-1").replace("tr_", ""));
		if (!(indice != null && indice > -1 && indice <= maxIndice)) {
			indice = maxIndice+1;
		}
		
		var riga;
		var v_disabled='';
		quant=(quantita?quantita:1);
		var idenFarma = value.split('$');
		var aNoteCuf;
		var statoPrAttivo='';
		var statoNonSost='';
		var statockNonSost='disabled';
		var statoMotivo='disabled';
		var indMotivo=-1;
		
		// Decodifica delle entità HTML
		text = $('<div/>').html(text.replace(/(&apos;)/gi, "&#39;")).text();
		
		if (ckPrAttivo==1) {
			statoPrAttivo='checked';
			statockNonSost='';
		}
		if (ckNonSost==1) {
			statoNonSost='checked';	
			statoMotivo='';
		}
		riga = "<tr id='tr_"+indice+"' valore="+value+"  class = 'trFarmaEse' >";
		riga += "<td STATO_CAMPO='E' class='classTdLabel butt_elimina' style='border-left:1px solid #00bA19; BORDER-BOTTOM:3PX SOLID #00bA19'><label class='butt_elimina' title='Elimina' name='lblElimina"+indice+"' id='lblElimina"+indice+"'> X </label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel farmaciEsenti' style='BORDER-BOTTOM:3PX SOLID #00bA19'><label indice = "+indice+" valore="+value+" class='farmaciEsen' name='lblFarmaEsen"+indice+"' id='lblFarmaEsen"+indice+"'>"+text+"</label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel' style='BORDER-BOTTOM:3PX SOLID #00bA19'><input class='prAttivo' type=checkbox value='' name='ckPrAttivo"+indice+"' id='ckPrAttivo"+indice+"' "+statoPrAttivo+" STATO_CAMPO='E'>prescrivi p.a.</input></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel' style='BORDER-BOTTOM:3PX SOLID #00bA19'><input class='nonSostituibile' type='checkbox' value='' name='ckNonSostituibile"+indice+
		"'id='ckNonSostituibile"+indice+"' "+statoNonSost+" " +statockNonSost+" STATO_CAMPO='E'>non sostituibilità per</input>";
		if (motivoNonSost!='undefined' || motivoNonSost!="")
			indMotivo=cercaMotivo(motivoNonSost);
		if((motivoNonSost=='undefined') ||(motivoNonSost=="") || (indMotivo>=0)){ 
			riga += "<select class='motivo' STATO_CAMPO='E' name='cmbMotivoNonSost"+indice+"' "+statoMotivo+" ><option value=''></option>" ;
		}
		else {
			riga += "<select class='motivo' STATO_CAMPO='E' name='cmbMotivoNonSost"+indice+"' "+statoMotivo+" ><option value=''>"+motivoNonSost+"</option>"	;			
		}

		for (var j=0; j<aMotiviNonSostCod.length; j++){
			riga += "<option value='"+aMotiviNonSostCod[j]+"'";
			if (j==indMotivo) riga +=" selected ";
			riga +=">"+aMotiviNonSostDescr[j]+"</option>";
		}
		riga+="</SELECT></td>";		

		riga += "<td STATO_CAMPO='E' class='classTdLabel' style='BORDER-BOTTOM:3PX SOLID #00bA19'><input class='nConf' id='txtnConf"+indice+"' STATO_CAMPO='E' value='"+quant+"' name='txtnConf"+indice+"' "+v_disabled+" type='text'></input></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel' style='BORDER-BOTTOM:3PX SOLID #00bA19'><input class='posologia' id='txtPosologia"+indice+"' STATO_CAMPO='E' value='"+poso+"' name='txtPosologia"+indice+"' type='text'></input></td>";
		riga += "<TD STATO_CAMPO='E' class='classTdLabel' style='BORDER-BOTTOM:3PX SOLID #00bA19'><select name='cmbNotaCuf' class='notaCuf' STATO_CAMPO='E' idenFarma='" + idenFarma[0] + "'><option value = '' ></option>";
		if (noteCuf!=""){
			aNoteCuf=noteCuf.split('-');
			for (var i=0; i<aNoteCuf.length; i++)
				riga += "<option value='" + aNoteCuf[i] + "'>"+aNoteCuf[i]+"</option>";
		}
		riga += "</select></td>";	
		riga += "</tr>";

		jQuery("#tableFarmaciEsenti").append(riga);
		
		jQuery("#lblElimina"+indice).click(function(){
			 TABELLA.eliminaRiga(indice);			 
			});
		
		if (!notaCufSel==""){
			TABELLA.selectNotaCuf(idenFarma[0],notaCufSel);
		}
		
		$("#ckPrAttivo"+indice).click(function(){
			if (this.checked){ // abilito il check di non sostituibilità 
				$("#ckNonSostituibile"+indice).attr("disabled", false);				
			}				
			else{ // cancello e disabilito il check di non sostituibilità e il motivo
				$("#ckNonSostituibile"+indice).attr("checked",false);
				$("#ckNonSostituibile"+indice).attr("disabled", true);
				//$("#txtMotivo"+indice).val('');
				//$("#txtMotivo"+indice).attr("disabled", true);
				$("select[name='cmbMotivoNonSost"+indice+"']").val('');
				$("select[name='cmbMotivoNonSost"+indice+"']").attr("disabled", true);
			}
				
		});
		
		$("#ckNonSostituibile"+indice).click(function(){
			if (this.checked) { // abilito il campo motivo
				//$("#txtMotivo"+indice).attr("disabled", false);
				$("select[name='cmbMotivoNonSost"+indice+"']").attr("disabled", false);
			}
			else { // cancello e disabilito il campo motivo
				//$("#txtMotivo"+indice).val('');
				//$("#txtMotivo"+indice).attr("disabled", true);
				$("select[name='cmbMotivoNonSost"+indice+"']").val('');
				$("select[name='cmbMotivoNonSost"+indice+"']").attr("disabled", true);
			}
				
		});
		
	},
	
	aggiungiRigaNotEsen:function(indice, value, text, quantita,poso,noteCuf,notaCufSel,ckPrAttivo,ckNonSost,motivoNonSost){
		var maxIndice = Number(($("table#tablePrestazioni tr.trFarmaNonEse").last().attr("id") || "tr_-1").replace("tr_", ""));
		if (!(indice != null && indice > -1 && indice <= maxIndice)) {
			indice = maxIndice+1;
		}
		
		var riga;
		var v_disabled='';
		var aNoteCuf;
		var statoPrAttivo='';
		var statoNonSost='';
		var statockNonSost='disabled';
		var statoMotivo='disabled';
		var indMotivo=-1;

		// Decodifica delle entità HTML
		text = $('<div/>').html(text.replace(/(&apos;)/gi, "&#39;")).text();
		
		if (ckPrAttivo==1) {
			statoPrAttivo='checked';
			statockNonSost='';
		}
		if (ckNonSost==1) {
			statoNonSost='checked';	
			statoMotivo='';
		}
		quant=(quantita?quantita:1);
		var idenFarma = value.split('$');
		/*if (text.indexOf("NIMESULIDE")>=0){
			v_disabled='disabled';
		}*/
		
		riga = "<tr id='trNonEse_"+indice+"' valore='"+value+"' class='trFarmaNonEse'>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel butt_eliminaNonEse' style='border-left:1px solid red; BORDER-BOTTOM:3PX SOLID RED'><label  class='butt_eliminaNonEse' title='Elimina' name='lblEliminaNonEse"+indice+"' id='lblEliminaNonEse"+indice+"'> X </label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel farmaciNonEsenti' style='BORDER-BOTTOM:3PX SOLID RED'><label indice = "+indice+" valore='"+value+"' class='farmaciNonEse' name='lblFarmaNonEse"+indice+"' id='lblFarmaNonEse"+indice+"'>"+text+"</label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel' style='BORDER-BOTTOM:3PX SOLID RED'><input class='prAttivoNonEse' type=checkbox name='ckPrAttivoNonEse"+indice+"' id='ckPrAttivoNonEse"+indice+"' "+statoPrAttivo+">prescrivi p.a.</input></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel' style='BORDER-BOTTOM:3PX SOLID RED'><input class='nonSostituibileNonEse' type=checkbox name='ckNonSostituibileNonEse"+indice+
		//"'id='ckNonSostituibileNonEse"+indice+"' "+statoNonSost+" " +statockNonSost+" >non sostituibilità per</input><input type='text' name='txtMotivoNonese"+indice+"' class='motivoNonEse' id='txtMotivoNonEse"+indice+"' value='"+motivoNonSost+"' "+ statoMotivo+"></input></td>";
		"'id='ckNonSostituibileNonEse"+indice+"' "+statoNonSost+" " +statockNonSost+" STATO_CAMPO='E'>non sostituibilità per</input>";
		if (motivoNonSost!='undefined' || motivoNonSost!="")
			indMotivo=cercaMotivo(motivoNonSost);
		if((motivoNonSost=='undefined') ||(motivoNonSost=="") || (indMotivo>=0)){  
			riga += "<select class='motivoNonEse' STATO_CAMPO='E' name='cmbMotivoNonEse"+indice+"' "+statoMotivo+" ><option value=''></option>";
		}
		else {
			riga += "<select class='motivoNonEse' STATO_CAMPO='E' name='cmbMotivoNonEse"+indice+"' "+statoMotivo+" ><option value=''>"+motivoNonSost+"</option>";			
		}
		
		for (var j=0; j<aMotiviNonSostCod.length; j++){
			riga += "<option value='"+aMotiviNonSostCod[j]+"'";
			if (j==indMotivo) riga +=" selected ";
			riga +=">"+aMotiviNonSostDescr[j]+"</option>";
		}
		riga+="</SELECT></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel' style='BORDER-BOTTOM:3PX SOLID RED'><input class='nConfNonEse' id='txtnConfNonEse"+indice+"' STATO_CAMPO='E' value='"+quant+"' name='txtnConfNonEse"+indice+"' "+v_disabled+" type='text'></input></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel' style='BORDER-BOTTOM:3PX SOLID RED'><input class='posologiaNonEse' id='txtPosologiaNonEse"+indice+"' STATO_CAMPO='E' value='"+poso+"' name='txtPosologiaNonEse"+indice+"' type='text'></input></td>";
		riga += "<TD STATO_CAMPO='E' class='classTdLabel' style='BORDER-BOTTOM:3PX SOLID RED'><select name='cmbNotaCufNonEse' class='notaCufNonEse' STATO_CAMPO='E' idenFarma='" + idenFarma[0] + "'";
		if (noteCuf!=""){
			riga += "><option value='' title='Forza su ricetta bianca'></option>";
			aNoteCuf=noteCuf.split('-');
			for (var i=0; i<aNoteCuf.length; i++) {
				if (Number(aNoteCuf[i]) == 4) {
					riga += "<option value='R' title='Forza su ricetta rossa o dematerializzata'>Forza RR</option>";
				}
				riga += "<option value='" + aNoteCuf[i] + "' title='Inserisci nota CUF " + aNoteCuf[i] + "'>"+aNoteCuf[i]+"</option>";
			}
		} else {
			riga += " disabled='disabled'><option value=''></option>";
		}
		riga += "</select></td>";
		riga += "</tr>";

		//alert(riga);
		
		jQuery("#tableFarmaciNonEsenti").append(riga);
		
		jQuery("#lblEliminaNonEse"+indice).click(function(){
			 TABELLA.eliminaRigaNonEse(indice);
		});
		
		if (!notaCufSel==""){
			TABELLA.selectNotaCufNonEse(idenFarma[0],notaCufSel);
		}
		$("#ckPrAttivoNonEse"+indice).click(function(){
			if (this.checked){ // abilito il check di non sostituibilità 
				$("#ckNonSostituibileNonEse"+indice).attr("disabled", false);				
			}				
			else{ // cancello e disabilito il check di non sostituibilità e il motivo
				$("#ckNonSostituibileNonEse"+indice).attr("checked",false);
				$("#ckNonSostituibileNonEse"+indice).attr("disabled", true);
				//$("#txtMotivoNonEse"+indice).val('');
				//$("#txtMotivoNonEse"+indice).attr("disabled", true);
				$("select[name='cmbMotivoNonEse"+indice+"']").val('');
				$("select[name='cmbMotivoNonEse"+indice+"']").attr("disabled", true);
			}
				
		});
		
		$("#ckNonSostituibileNonEse"+indice).click(function(){
			if (this.checked) { // abilito il campo motivo
				//$("#txtMotivoNonEse"+indice).attr("disabled", false);
				$("select[name='cmbMotivoNonEse"+indice+"']").attr("disabled", false);
			}
			else { // cancello e disabilito il campo motivo
				//$("#txtMotivoNonEse"+indice).val('');
				//$("#txtMotivoNonEse"+indice).attr("disabled", true);
				$("select[name='cmbMotivoNonEse"+indice+"']").val('');
				$("select[name='cmbMotivoNonEse"+indice+"']").attr("disabled", true);
			}				
		});
	},
	
	aggiungiRigaNonMut:function(indice, value, text, quantita, poso){
		var maxIndice = Number(($("table#tablePrestazioni tr.trFarmaNonMut").last().attr("id") || "tr_-1").replace("tr_", ""));
		if (!(indice != null && indice > -1 && indice <= maxIndice)) {
			indice = maxIndice+1;
		}
		
		var riga;
		var v_disabled='';
		quant=(quantita?quantita:1);
		var idenFarma = value.split('$');
		/*if (text.indexOf("NIMESULIDE")>=0){
			v_disabled='disabled';
		}*/
		
		// Decodifica delle entità HTML
		text = $('<div/>').html(text.replace(/(&apos;)/gi, "&#39;")).text();
		
		riga = "<tr id='trNonMut_"+indice+"' valore="+value+"  class = 'trFarmaNonMut' >";
		riga += "<td STATO_CAMPO='E' class='classTdLabel butt_eliminaNonMut' style='border-left:1px solid #fed561; border-bottom:3px solid #fed561'><label class='butt_eliminaNonMut' title='Elimina' name='lblEliminaNonMut"+indice+"' id='lblEliminaNonMut"+indice+"'> X </label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel farmaciNonMutuabili' style='border-bottom:3px solid #fed561'><label indice = "+indice+" valore="+value+" class='farmaciNonMut' name='lblFarmaNonMut"+indice+"' id='lblFarmaNonMut"+indice+"'>"+text+"</label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel' style='border-bottom:3px solid #fed561'><input class='nConfNonMut' id='txtnConfNonMut"+indice+"' STATO_CAMPO='E' value='"+quant+"' name='txtnConfNonMut"+indice+"' "+v_disabled+" type='text'></input></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel' style='border-bottom:3px solid #fed561'><input class='posologiaNonMut' id='txtPosologiaNonMut"+indice+"' STATO_CAMPO='E' value='"+poso+"' name='txtPosologiaNonMut"+indice+"' type='text'></input></td>";
		riga += "</tr>";

		//alert(riga);
		
		jQuery("#tableFarmaciNonMutuabili").append(riga);
		
		jQuery("#lblEliminaNonMut"+indice).click(function(){
			 TABELLA.eliminaRigaNonMut(indice);
		});
		
	},
	
	eliminaRiga:function(indice){		
		jQuery("#tr_"+indice).remove();
		jQuery("#tr_2"+indice).remove();
	},
	
	eliminaRigaNonEse:function(indice){		
		jQuery("#trNonEse_"+indice).remove();
		jQuery("#tr_2NonEse"+indice).remove();
	},
	
	eliminaRigaNonMut:function(indice){		
		jQuery("#trNonMut_"+indice).remove();
		jQuery("#tr_2NonMut"+indice).remove();
	},
	
	selectNotaCuf:function(idenFarma,notaCufSel){
		var combo=jQuery(".notaCuf");
		combo.each(function(){
			if (jQuery(this).attr("idenFarma") == idenFarma){
				var opzioni = jQuery(this).find('option');
				opzioni.each(function(){
					if (jQuery(this).val()==notaCufSel)
						jQuery(this).attr("selected","selected");
				});
			}
		});
	},
	
	selectNotaCufNonEse:function(idenFarma,notaCufSel){
		var combo=jQuery(".notaCufNonEse");
		combo.each(function(){
			if (jQuery(this).attr("idenFarma") == idenFarma){
				var opzioni = jQuery(this).find('option');
				opzioni.each(function(){
					if (jQuery(this).val()==notaCufSel)
						jQuery(this).attr("selected","selected");
				});
			}
		});
	}
		
};

function TestNimesulide(strFarmaEsenti,strFarmaNonEsenti,strFarmaNonMutuabili){
	var aFarma;
	var aFarmaTot;
	var contaFarmaNimesulide=0;
	if (strFarmaEsenti!="") {
		aFarmaTot=strFarmaEsenti.split(";"); // i farmaci sono separati da ;
		for (var i=0; i<aFarmaTot.length-1; i++){
			aFarma=aFarmaTot[i].split("$"); // i dati del farmaco sono separati da $
			if (aFarma[3].indexOf("NIMESULIDE")>=0) { // alla posizione 3 c'è la descrizione + pricipio attivo
				contaFarmaNimesulide += parseInt(aFarma[6]); // alla posizione 6 c'è il n. confezioni
			}			
		}
	}
	if (strFarmaNonEsenti!="") {
		aFarmaTot=strFarmaNonEsenti.split(";");
		for (var i=0; i<aFarmaTot.length-1; i++){
			aFarma=aFarmaTot[i].split("$");
			if (aFarma[3].indexOf("NIMESULIDE")>=0) {
				contaFarmaNimesulide += parseInt(aFarma[6]);
			}			
		}
	}
	if (strFarmaNonMutuabili!="") {
		aFarmaTot=strFarmaNonMutuabili.split(";");
		for (i=0; i<aFarmaTot.length-1; i++){
			aFarma=aFarmaTot[i].split("$");
			if (aFarma[3].indexOf("NIMESULIDE")>=0) {
				contaFarmaNimesulide += parseInt(aFarma[6]);
			}			
		}
	}
	// alert(contaFarmaNimesulide);
	if (contaFarmaNimesulide>1){
		return false; // test non OK
	}
	else{
		return true; // test OK
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

function selMotiviNonSost(){
	var sql="select codice, descrizione from mmg.mmg_codifiche where tipo_dato='cmbMotivoNonSost' and tipo_scheda='RICETTA_ROSSA' and attivo='S' order by codice";
	dwr.engine.setAsync(false);		
	toolKitDB.getListResultData(sql, fcb_selMotivoNonSost);
	dwr.engine.setAsync(true);
}

function fcb_selMotivoNonSost(aMotivi){
	aMotiviNonSostCod = new Array(aMotivi.length);
	aMotiviNonSostDescr = new Array(aMotivi.length);
	for (var i=0; i< aMotivi.length; i++) {
		aMotiviNonSostCod[i]=aMotivi[i][0];
		aMotiviNonSostDescr[i]=aMotivi[i][1];
	}

}

function cercaMotivo(testoMotivo /* valore o descrizione */){
	var trova=-1;
	for (var i=0; i<aMotiviNonSostDescr.length; i++){
		if (testoMotivo==aMotiviNonSostCod[i] || testoMotivo==aMotiviNonSostDescr[i])
			trova = i;
	}
	return trova;
}

/**
 * Invia o conferma la ricetta.
 * 
 * @param {Object}    parametri in ingresso
 * @param success     callback da eseguire in caso di successo
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