/**
 * File JavaScript in uso dalla pagina RICETTA_WORKLIST_CONFERMATE.
 * 
 * Visualizza anche le ricette nello stato INSERITO. I valori dei campi MMG.RR_Ricetta_Rossa_Testata sono:
 *	-STATO:    I=Inserita, C=Confermata, S=Inviata (Sent), D=Cancellata (Deleted), E=Confermata ma Esclusa dall'invio
 * 	-STAMPATO: S=Sì, N=No
 */
//location.href = 'PageUnderConstruction.htm';

jQuery(document).ready(function() { 
	//document.getElementById('lblApriChiudi').parentElement.parentElement.style.display = 'none'; 
	jQuery("#lblConfermaStampa").parent().css("width","280px");
	jQuery("#lblBianca").parent().css("width","200px");
	document.getElementById('lblApriChiudi').innerText = 'Chiudi';
	document.getElementById('lblApriChiudi').parentElement.onclick=function(){
		if(top.name == 'schedaRicovero'){
			location.replace("blank.htm");
		} else {
			self.close();
		}
	};	
    
	var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
    oDateMask.attach(document.getElementById('txtDaData'));
    oDateMask.attach(document.getElementById('txtAData'));
    
	jQuery('#txtDaData, #txtAData').live("keydown", function(e){
		var keyCode = e.which || e.keyCode;
		if (keyCode == 13) {
			Ricerca(true);
		}
	});

	//valorizzo alcuni campi dei filtri con i valori che ho nella url della pagina:

	//nullable
	document.getElementById('hIdRemoto').value = typeof $("form[name=EXTERN] input[name=idRemoto]").val() === 'string' ? "'"+$("form[name=EXTERN] input[name=idRemoto]").val()+"'" : "";
	document.getElementById('hMedico').value=Number($("form[name=EXTERN] input[name=USER_ID]").val()) || "";
	document.getElementById('hIdenRicette').value=$("form[name=EXTERN] input[name=RICETTE_CREATE]").val() || "";
	//not nullable
	document.getElementById('hSito').value = "'"+($("form[name=EXTERN] input[name=PROV]").val() || "CC")+"'";
	if (document.getElementById('hSito').value.indexOf('CC') == -1) document.getElementById('hSito').value+=",'CC'";
	document.getElementById('txtDaData').value=$("form[name=EXTERN] input[name=DA_DATA]").val() || "";
	document.getElementById('txtAData').value=$("form[name=EXTERN] input[name=A_DATA]").val() || "";
	//check
	document.getElementById('txtDaData').value = checkData(document.getElementById('txtDaData').value, document.getElementById('hSito').value);
	document.getElementById('txtAData').value = checkData(document.getElementById('txtAData').value, document.getElementById('hSito').value);
	document.getElementById('hStato').value="'E'";
	
	/*var tipoUtente=baseUser.TIPO;
	if (tipoUtente == 'I'){
		jQuery("#lblConferma").parent().parent().hide();
		document.getElementById('lblConfermaStampa').innerText='Stampa Ricetta Rossa';
		jQuery("#lblConfermaStampa").parent().css("width","200px");
	}else{
		document.getElementById('lbConfermaStampa').innerText='Conferma e Stampa Ricetta Rossa';
	}*/
	
	// Aggiungo il pulsante Stampa Ricette Confermate
	if (existsAttributo('ABILITA_DEMA_FARM')) $("<td class=classButtonHeader><div style=\"width:225px\" class=\"pulsante\"><A id=\"lblStampaDematerializzate\" href=\"javascript:Ricetta_Dema();\">Stampa Ricette Dematerializzate</a></div></td>").insertAfter($('#lblConfermaStampa').parent().parent());
	
	try{
		top.utilMostraBoxAttesa(false);
	}
	catch(e){}
	
	Ricerca();
});

function Ricerca(resettaFiltriOpzionali) {
	if (resettaFiltriOpzionali) {
		document.getElementById('hIdenRicette').value='';
	}
	
	// Gestire la provenienza per visualizzare le ricette di più pazienti prescritte anche da altri medici
	//TODO
	
	// Campi obbligatori
	if (document.getElementById('hIdRemoto').value == '' && document.getElementById('txtDaData').value == '' && document.getElementById('txtAData').value == '' && document.getElementById('hIdenRicette').value == '') {
		return alert('Prego compilare i seguenti campi prima di effettuare \nla ricerca:'+
			'\n\t- Da data' +
			'\n\t- A data'
		);
	}
	
	setVeloNero('oIFWk');
	applica_filtro('servletGenerator?KEY_LEGAME=WK_RICETTE_CONFERMATE');
}

function ShowHideLayer(){
	try {
		top.close();
	} catch(e) {
		self.close();
	}
}

/**
 * Set di funzioni richiamate dalla pagina RICETTA_WORKLIST_CONFERMATE ma definite nel frame interno della worklist WK_RICETTE_CONFERMATE.
 */
function Ricetta_Modifica()              { var obj = document.getElementById('oIFWk').contentWindow.Ricetta_Modifica;              return obj.apply(obj, arguments); }
function Ricetta_Cancella()              { var obj = document.getElementById('oIFWk').contentWindow.Ricetta_Cancella;              return obj.apply(obj, arguments); }
function Ricetta_Conferma_Stampa()       { var obj = document.getElementById('oIFWk').contentWindow.Ricetta_Conferma_Stampa;       return obj.apply(obj, arguments); }
function Ricetta_Conferma_Stampa_Tutte() { var obj = document.getElementById('oIFWk').contentWindow.Ricetta_Conferma_Stampa_Tutte; return obj.apply(obj, arguments); }
function Ricetta_Bianca()                { var obj = document.getElementById('oIFWk').contentWindow.Ricetta_Bianca;                return obj.apply(obj, arguments); }
function Ricetta_Dema()                  { var obj = document.getElementById('oIFWk').contentWindow.Ricetta_Dema;                  return obj.apply(obj, arguments); }

function set_Ricette(Progressivo, sqlfield)
{
	if (Progressivo!=null){
		var sql="update VIEW_RR_TESTATA set "+sqlfield+" where PROGRESSIVO="+Progressivo;
		dwr.engine.setAsync(false);
		toolKitDB.executeQueryData(sql, callBack);	
		dwr.engine.setAsync(true);	
	}
	
	function callBack(resp){}
}

function Init_stampaRicetta(tipo){	
	var arrayTipoRicetta = null;
	var arrayIdenTestata = null;

	if (tipo!=null) {
		var reparto		= 'ASL2'; 								//CONFIGURA_STAMPE.CDC
		var funzione	= 'RICETTA_ROSSA_PRESTAZIONI';			//CONFIGURA_STAMPE.FUNZIONE_CHIAMANTE 
		var anteprima	= 'N';
		var stampante 	= "";
		var sf			= "";
		
		arrayTipoRicetta=document.getElementById('frameRicette').contentWindow.array_tipo_ricetta;
		arrayIdenTestata=document.getElementById('frameRicette').contentWindow.array_iden_testata;
	
		for (var i=0;i<arrayTipoRicetta.length;i++){
			if (arrayTipoRicetta[i]=='P')
			{
				funzione="RICETTA_ROSSA_PRESTAZIONI";
				sf = '&prompt<pIdenTestata>='+arrayIdenTestata[i];
				
				stampante = basePC.PRINTERNAME_RICETTA_ROSSA;
				StampaRicetta(funzione,sf,anteprima,reparto,stampante);
			}		
			else if (arrayTipoRicetta[i]== "F") 
			{ 
				funzione="RICETTA_ROSSA_FARMACI";
				sf = '&prompt<pIdenTestata>='+arrayIdenTestata[i];
				
				stampante = basePC.PRINTERNAME_RICETTA_ROSSA;
				StampaRicetta(funzione,sf,anteprima,reparto,stampante);
			}
			else
			{ 
				funzione="RICETTA_BIANCA";
				sf = '&prompt<pIdenTestata>='+arrayIdenTestata[i];

				stampante = basePC.PRINTERNAME_REF_CLIENT;
				StampaRicetta(funzione,sf,anteprima,reparto,stampante);
			}
			
		}
	}	
}



function StampaRicetta(funzione,sf,anteprima,reparto,stampante){
	
	if(stampante == '' || stampante == null)
		anteprima = 'S';
	
	url =  'elabStampa?stampaFunzioneStampa='+funzione;
	url += '&stampaAnteprima='+anteprima;

	if(reparto!=null && reparto!='')
		url += '&stampaReparto='+reparto;	
	if(sf!=null && sf!='')
		url += '&stampaSelection='+sf;	
	if(stampante!=null && stampante!='')
		url += '&stampaStampante='+stampante;	

	var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	//alert(url);
	if(finestra){ finestra.focus(); }
    else{ finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);}
	
	try{
		top.opener.closeWhale.pushFinestraInArray(finestra);
	}catch(e){alert(e.description);}
}


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
	

function getURLParam(strParamName){
	var strReturn = "";
	var strHref = window.location.href;
	if ( strHref.indexOf("?") > -1 ){
	    var strQueryString = strHref.substr(strHref.indexOf("?")).toLowerCase();
	    var aQueryString = strQueryString.split("&");
	    for ( var iParam = 0; iParam < aQueryString.length; iParam++ ){
	      if (aQueryString[iParam].indexOf(strParamName.toLowerCase() + "=") > -1 ){
	        var aParam = aQueryString[iParam].split("=");
	        strReturn = aParam[1];
	        break;
	      }
	    }
	}
	return unescape(strReturn);
}

/**
 * Controlla se il formato della data è corretto.
 * Una data non valida è sostituita con un valore di default a seconda della
 * provenienza. Una data nulla è considerata valida solo se la provenienza è
 * diversa da "'CC'". 
 * 
 * @param strData
 * @param provenienza (default: "'CC'")
 * @param formato (default: "DD/MM/YYYY")
 * @returns
 */
function checkData (strData, provenienza, formato) {
	provenienza = typeof provenienza === 'string' ? provenienza : "'CC'";
	formato = formato === "YYYYMMDD" ? formato : "DD/MM/YYYY";
	
	if (strData != clsDate.getData(clsDate.str2date(strData,formato,''),formato)) {
		// La data nel formato inserito non è valida
		switch(provenienza) {
			case "'CC'":
				return clsDate.getData(new Date(),formato);
			default:
				if (strData == "") { break; }
				return clsDate.getData(clsDate.dateAdd(new Date(), 'D', -5), formato);
		}
	}
	return strData;
}