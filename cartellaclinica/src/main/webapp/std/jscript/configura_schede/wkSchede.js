
var _filtro_elenco_reparti=null;
var _filtro_elenco_esami=null;
var _filtro_elenco_contenitori=null;
var _filtro_elenco_esa_codice=null;

//creo due div
$(document).ready(function()
{
	$("body").append('<div id="popup" class="hide"></div>');
	$("body").append('<div id="overlay" class="hide"></div>');
	
	dialog = document.createElement('div');
	dialog.id='dialog'; 
	dialog.className = 'jqmWindow jqmID1';
	document.body.appendChild(dialog);
	
	//tappullo per evitare che il tasto invio dia la submit direttamente alla pagina e la ricarichi
	try{
		jQuery("#hRisoluzioneProblema").parent().hide();
	}catch(e){}
	
	//assegno l'evento keypress al tasto invio in modo da ricaricare la wk con il tasto invece che schiacciando il tasto applica
	jQuery("body").keypress (function(e) {

			if(e.keyCode==13){
				try{
					applica_filtro();
				}catch(e){}
			}
	});
	
});

function apriDiv(tipo, idenScheda){

	var divEl = "";
	
	//fare contenitori diversi con i css
	if (tipo=='E'){
	
		divEl += '<span id="titPopup">ANALISI ASSOCIATE</span>';
		divEl += '<DIV id=divTitPopup>';
		divEl += '<SELECT style="WIDTH: 80%; HEIGHT: 300px; overflow: auto;" multiple name=infoElenco STATO_CAMPO="E"></SELECT>';
		divEl += '</DIV>';
		divEl += '<span id="footPopup"></span>';
		$("#popup").removeClass("hide");
		$("#popup").html(divEl);
		document.getElementById('popup').className='';
		$("#popup").addClass("popupEsami");
		//	Posiziona il popup
		var hTable = $("body").height();
		var hPopup = $("#popup").height();
		var offset = $("body").offset();
		var spazioLiberoInBasso = offset.top + hTable - event.clientY;
		var posXpopup = 0;
		
		if(spazioLiberoInBasso > hPopup){
			posXpopup = event.clientY;
		}else{
			posXpopup = offset.top + hTable - hPopup - 15;
		}
		
		$("#popup").css("top",posXpopup);
		$("#popup").css("left",event.clientX+10);
		filtroEsami(idenScheda);
		
	}else if(tipo=='C'){
		
		divEl += '<span id="titPopupCont">CONTENITORI ASSOCIATI</span>';
		divEl += '<DIV id=divTitPopupCont ><SELECT style="WIDTH: 80%; HEIGHT: 300px; overflow:auto;" multiple name=infoElenco STATO_CAMPO="E" dpieagent_iecontroltype="7"></SELECT></DIV>';
		divEl += '<span id="footPopupCont"></span>';
		$("#popup").removeClass("hide");
		$("#popup").html(divEl);
		document.getElementById('popup').className='';
		$("#popup").addClass("popupContenitori");
		//	Posiziona il popup
		var hTable = $("body").height();
		var hPopup = $("#popup").height();
		var offset = $("body").offset();
		var spazioLiberoInBasso = offset.top + hTable - event.clientY;
		var posXpopup = 0;
		
		if(spazioLiberoInBasso > hPopup){
			posXpopup = event.clientY;
		}else{
			posXpopup = offset.top + hTable - hPopup - 15;
		}
		
		$("#popup").css("top",posXpopup);
		$("#popup").css("left",event.clientX+10);

		filtroContenitori(idenScheda);
		
		
	}else if (tipo=='R'){
	
		divEl += '<span id="titPopupRep">REPARTI ASSOCIATI</span>';
		divEl += '<DIV id=divTitPopupRep ><SELECT style="WIDTH: 80%; HEIGHT: 300px; overflow:auto;" multiple name=infoElenco STATO_CAMPO="E" dpieagent_iecontroltype="7"></SELECT></DIV>';
		divEl += '<span id="footPopupRep"></span>';
		$("#popup").removeClass("hide");
		$("#popup").html(divEl);
		document.getElementById('popup').className='';
		$("#popup").addClass("popupReparti");
		//	Posiziona il popup
		var hTable = $("body").height();
		var hPopup = $("#popup").height();
		var offset =$("body").offset();
		var spazioLiberoInBasso = offset.top + hTable - event.clientY;
		var posXpopup = 0;
		
		if(spazioLiberoInBasso > hPopup){
			posXpopup = event.clientY;
		}else{
			posXpopup = offset.top + hTable - hPopup - 15;
		}
		
		$("#popup").css("top",posXpopup);
		$("#popup").css("left",event.clientX+10);
		filtroReparti(idenScheda);
	
	}
	
	$("#popup").show();
	$("#overlay").removeClass("hide");
	$("#overlay").click(function(){$("#popup").hide();$("#overlay").addClass("hide");});
}

//DA RIVEDERE
function filtroReparti(idenScheda){

	_filtro_elenco_reparti = new FILTRO_QUERY('infoElenco', null);
	_filtro_elenco_reparti.setEnableWait('N');
	_filtro_elenco_reparti.setDistinctQuery('S');
	_filtro_elenco_reparti.setValueFieldQuery('IDEN_PRO');
	_filtro_elenco_reparti.setDescrFieldQuery('DESCR');
	_filtro_elenco_reparti.setFromFieldQuery('RADSQL.VIEW_REPARTI_ASSOCIATI');
	_filtro_elenco_reparti.setWhereBaseQuery('IDEN_SCHEDA='+idenScheda);
	_filtro_elenco_reparti.setOrderQuery('DESCR ASC');
	_filtro_elenco_reparti.searchListRefresh();
}

function filtroEsami(idenScheda){

	_filtro_elenco_esami = new FILTRO_QUERY('infoElenco', null);
	_filtro_elenco_esami.setEnableWait('N');
	//_filtro_elenco_esami.setDistinctQuery('S');
	_filtro_elenco_esami.setValueFieldQuery('IDEN');
	_filtro_elenco_esami.setDescrFieldQuery('DESCRIZIONE_LISTBOX');
	_filtro_elenco_esami.setFromFieldQuery('RADSQL.VIEW_LABO_ESAMI');
	_filtro_elenco_esami.setWhereBaseQuery('IDEN_SCHEDA='+idenScheda);
	//_filtro_elenco_esami.setOrderQuery('DESCR ASC');
	_filtro_elenco_esami.searchListRefresh();

}

function filtroContenitori(idenScheda){

	_filtro_elenco_contenitori = new FILTRO_QUERY('infoElenco', null);
	_filtro_elenco_contenitori.setEnableWait('N');
	_filtro_elenco_contenitori.setValueFieldQuery('IDEN');
	_filtro_elenco_contenitori.setDescrFieldQuery('DESCR');
	_filtro_elenco_contenitori.setFromFieldQuery('RADSQL.view_labo_tappi_scheda');
	_filtro_elenco_contenitori.setWhereBaseQuery('IDEN_SCHEDA='+idenScheda);
	_filtro_elenco_contenitori.searchListRefresh();
}

function valorizzaTipo(){

	var comboTipo=document.getElementById('cmbTipo');
	
	if(comboTipo.options[comboTipo.selectedIndex].value!=''){
	
		document.getElementById('hTipo').value="'"+comboTipo.options[comboTipo.selectedIndex].value	+"'";
	
	}else{
	
		document.getElementById('hTipo').value=comboTipo.options[comboTipo.selectedIndex].value;
	
	}
}

//funzione predispone i dati corretti per l'attivazione o la disattivazione della scheda
function lanciaDisAtt(){

	var idenScheda=stringa_codici(array_iden);
	var attivo=stringa_codici(array_attivo);
	var tipoScheda=stringa_codici(array_tipo_scheda);
	var urgenza=stringa_codici(array_urgenza);
	
	if (attivo == 'N'){
		
		var operazione='ATTIVA';
		disAttScheda(idenScheda, operazione, tipoScheda, urgenza);
	
	}else{
	
		var operazione='DISATTIVA';
		disAttScheda(idenScheda, operazione, tipoScheda, urgenza);
	}
}

// funzione che lancia la dwr
function disAttScheda(idenScheda, operazione, tipoScheda, urgenza){
	//alert(operazione + '_' + idenScheda);
	var sql='';
	var funzione='';
	
	//lancio la funzione con un dwr
	sql = "{call ? := RADSQL.CLS_DIS_ATT_SCHEDA("+idenScheda+",'"+operazione+"','"+tipoScheda+"',"+urgenza+")}";
	
	if (operazione=='ATTIVA'){
		
		dwr.engine.setAsync(false);	
		toolKitDB.executeFunctionData(sql, callBack);
		dwr.engine.setAsync(true);
	}else{

		dwr.engine.setAsync(false);	
		toolKitDB.executeFunctionData(sql, callReturn);
		dwr.engine.setAsync(true);
	}
		
	
	function callReturn(resp){
	
		var elenco='';
		var testo='';
		//alert(resp);
		//se la risp è null vuol dire che non ci sono esami associati, quindi viene disattivata solo la scheda in TAB_LABO_SCHEDE;
		if (resp==null){
			return;
		}
		if (resp.substring(0,2) =='KO'){
			alert('La disattivazione non è andata a buon fine!\n' +resp.substring(3));
		}else{
		
		var split = resp.split(',');
			
			for (var i=0;i<split.length;i++){
			
				elenco+=split[i]+'<BR><BR>';
			}
			
			elenco=elenco.substring(0,elenco.length-2);
			
			testo += '<p>I seguenti reparti sono senza una scheda associata:<BR><BR>'+elenco+'<p><p>'
			testo += "<p><p><p><p>Provvedere ad effettuare una nuova associazione<BR><p> ";
		
			var html = '<div id="dialog" class="jqmDialog jqmdWide">'+testo;
			html +=  '<INPUT class=ieFocusBattolla id=btSI value=OK type=submit >';
			document.getElementById('dialog').innerHTML = html;


			$('#dialog').jqm({overlay: 30, modal:true}); 
			jQuery('#dialog').jqmShow();
			jQuery("#btSI").click(function(e){ 
				try{$('#dialog').jqmHide();
				}catch(e){};
				parent.applica_filtro();
			});
			
		

			//alert('I seguenti reparti sono senza una scheda associata:\n\n'+elenco+'Provvedere ad effettuare una nuova associazione');
		}	
	}
	
	function callBack(resp){
		//alert('Resp: '+resp+'\n'+resp.substring(3));
		if (resp.substring(0,2) == 'KO'){
			alert('L\'attivazione non è andata a buon fine!\n' +resp.substring(3));
		}else{
			alert('Attivazione effettuata');
			parent.applica_filtro();
		}	
	
	}
	
}


function cancellaScheda(idenScheda){


	var operazione = 'CANCELLA';
	var utente=parent.document.EXTERN.USER_ID.value;
	
	//controllo se la scheda è attiva
	if (stringa_codici(array_attivo)=='S'){
	
		alert('La scheda è attiva! Disattivarla prima di procedere alla cancellazione!');
		return;
	}
	
	if (confirm('Cancellare la scheda selezionata?')){
	
		var sql = "{call ? := RADSQL.CLS_SALVA_CANC_SCHEDA(null,null,'"+operazione+"',"+utente+","+idenScheda+")}";
		
		//alert(sql);
				
		dwr.engine.setAsync(false);
		toolKitDB.executeFunctionData(sql, callCanc);
		dwr.engine.setAsync(true);
		self.close();
		
		function callCanc(resp){
		
			//alert('Resp: '+resp+'\nResp substring: '+resp.substring(0,2));
			
			if (resp.substring(0,2) == 'KO'){
				alert('La cancellazione non è andata a buon fine!\nCi sono ancora reparti associati alla scheda');
			}else if(resp.substring(0,2)=='OK'){
				alert('Cancellazione effettuata');
			}	
		
		}
		
		parent.applica_filtro();
	}
}
function duplicaScheda (idenScheda, utente){

	var sql = "{call ? := RADSQL.CLS_DUPLICA_SCHEDA("+idenScheda+","+utente+")}";
		
	dwr.engine.setAsync(false);
	toolKitDB.executeFunctionData(sql, callCanc);
	dwr.engine.setAsync(true);
	self.close();
	
	function callCanc(resp){
		
		//alert('Resp: '+resp+'\nResp substring: '+resp.substring(0,2));
		
		if (resp.substring(0,2) == 'KO'){
			alert('La duplicazione non è andata a buon fine!');
		}else{
			alert('Duplicazione effettuata');
		}	
		
		parent.applica_filtro();
	}
}

function apriScheda(stato){

	var urgenza='';
	var attivo='';
	// alert(stato);

	if (stato=='INS'){
		
		urgenza=0;
		attivo='N';
		window.open("servletGenerator?KEY_LEGAME=GESTIONE_SCHEDA&STATO=INS&IDEN=&URGENZA="+urgenza+"&TIPO_SCHEDA=&ATTIVO="+attivo,"","status=yes fullscreen=yes");
	
	}else if (stato=='MOD'){
	
		urgenza=stringa_codici(array_urgenza);
		attivo=stringa_codici(array_attivo);
		var sql="servletGenerator?KEY_LEGAME=GESTIONE_SCHEDA&STATO=MOD&IDEN="+stringa_codici(array_iden)+"&ATTIVO="+attivo+"&URGENZA="+urgenza+"&TIPO_SCHEDA="+stringa_codici(array_tipo_scheda);

		if(stringa_codici(array_iden) != ''){
			window.open(sql,"","status=yes fullscreen=yes");
		}else{
			alert("Attenzione! Nessuna scheda selezionata");
		}
	}
}
