var checkAbil=true;
try{parent.removeVeloNero('oIFWk');}catch(e){alert(e.description);}


jQuery(document).ready(function() {

try{
		parent.removeVeloNero('framePT');
	}catch(e){
		//alert(e.description);	
	}
	
//	$('DIV[class="infoWk"]').css({'float':'left','background':'url(imagexPix/GestioneRichieste/btinfo.gif) no-repeat','width':'25px','height':'25px','cursor':'pointer'});
	
	// $('table#oTable tr>td[name="wk_pt_validita"]>div:contains("SCADUTO")').parent().addClass('PianoScaduto');
	 $('table#oTable tr>td>div:contains("SCADUTO"),table#oTable tr>td>div:contains("CHIUSO")').parent().parent().addClass('PianoScaduto');
});


function inserisciPianoTerapeutico(){
	var reparto;
	if ( typeof parent.parent.reparto !='undefined')
		reparto=parent.parent.reparto;
	else
		reparto='';	
	
	parent.parent.$('#frameBottom').show();
     parent.parent.document.all['frameBottom'].src = "servletGenerator?KEY_LEGAME=PIANO_TERAPEUTICO&IDEN=&IDEN_TESTATA=&FIRMATO=N&idRemoto="+parent.document.EXTERN.idRemoto.value+"&STATO=I&REPARTO="+reparto;
//	   parent.parent.document.all['frameBottom'].src = "servletGenerator?KEY_LEGAME=PIANO_TER_EXTRA_REG&IDEN=&IDEN_TESTATA=&FIRMATO=N&idRemoto="+parent.document.EXTERN.idRemoto.value+"&STATO=I&REPARTO="+reparto;
		
	parent.parent.$('#frameBottom').height('90%');
	parent.parent.$('#frameTop').hide();
	parent.parent.document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';

	
}

function modificaPianoTerapeutico(){

	var id_remoto 	= stringa_codici(ar_id_remoto);
	var iden_med 	= stringa_codici(ar_medico_iden);
	var iden_xml 	= stringa_codici(ar_iden_xml);
	var iden_testata= stringa_codici(ar_iden_testata);
	var firmato 	= stringa_codici(ar_firmato);
	var validita    = stringa_codici(ar_validita);
	var flg_remoto  = stringa_codici(ar_remoto);
	var specialita  = stringa_codici(ar_specialita);
	var cod_pa  	= stringa_codici(ar_cod_pa);
	var id_piano    = stringa_codici(ar_iden_remote);
	var medico_descr= stringa_codici(ar_medico_descr);
	
	checkAbil=true;
	
	if(id_remoto == ''){
		alert('Attenzione:effettuare una selezione');
		return;
	}
	
	//se la specialita del piano selezionato è diversa da quella del reparto con cui è entrato l'utente
	if(specialita==parent.specialita){
	//devo controllare se l'utente è abilitato a lavorare su quel pa
		var sql="select case when  '"+cod_pa+"' in ( select distinct(campo2) from pt_associazioni where campo1 in( select distinct(campo1) from pt_associazioni where tipo='SPECIALITA_REPARTO' and campo2 in ( select reparto from imagoweb.web_cdc where webuser='"+baseUser.LOGIN+"' ))) then '1' else '0' end resp from dual";
		dwr.engine.setAsync(false);
		toolKitDB.getListResultData(sql,respCheckAbil);
		dwr.engine.setAsync(true);	
		
		if(checkAbil==false){
			alert('L \'utente non è abilitato a utilizzare il principio attivo prescritto nel piano selezionato');
			return;
		}
		
	}
	
	
	if(flg_remoto == 'S'){
		alert('Funzionalità non disponibile. Piano inserito da un\'altra asl');
		return;
	}

	if(baseGlobal.SITO=='ASL2' && iden_med!=document.EXTERN.USER_ID.value){
	alert("La modifica è consentita solo all'utente che ha inserito il piano");
	return;
	} 
	
	if (firmato=='S' && typeof(parent.parent.configPT.MODIFICA_ENTRO_2_ORE)!='undefined' && parent.parent.configPT.MODIFICA_ENTRO_2_ORE=='S')
	{
		if (controllaDataFirma()==false)
		{
			alert("E' possibile modificare un piano terapeutico solamente entro 2 ore dalla firma dello stesso");
			return;
		}
	}
/*	if (firmato=='S'){
		alert("Impossibile modificare un piano già firmato");
		return;
		}*/

	
	if (validita=='SCADUTO'){
		alert("Piano scaduto, impossibile effettuare modifiche");
		return;		
	}
	if (validita=='CHIUSO'){
		alert("Piano chiuso, impossibile effettuare modifiche");
		return;		
	}
	
	parent.parent.$('#frameBottom').show();
	if(medico_descr=='EXTRA REGIONE'){
		 src="servletGenerator?KEY_LEGAME=PIANO_TER_EXTRA_REG&idRemoto="+id_remoto+"&IDEN="+iden_xml+"&IDEN_TESTATA="+iden_testata+"&STATO=M";
		}
		else{
		src="servletGenerator?KEY_LEGAME=PIANO_TERAPEUTICO&idRemoto="+id_remoto+"&IDEN="+iden_xml+"&IDEN_TESTATA="+iden_testata+"&STATO=M&FIRMATO="+firmato+"&IDPIANO="+id_piano;	
		}
    parent.parent.document.all['frameBottom'].src = src;
	parent.parent.$('#frameBottom').height('90%');
	parent.parent.$('#frameTop').hide();
	parent.parent.document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';

}

function respCheckAbil(resp){
	if(resp=='0')
	checkAbil=false;		
}



function visualizzaPianoTerapeutico(){

	var id_remoto 	= stringa_codici(ar_id_remoto);
	var iden_med	= stringa_codici(ar_medico_iden);
	var iden_xml 	= stringa_codici(ar_iden_xml);
	var iden_testata= stringa_codici(ar_iden_testata);
	var firmato 	= stringa_codici(ar_firmato);
	var validita    = stringa_codici(ar_validita);
	var id_piano    = stringa_codici(ar_iden_remote);
	var medico_descr= stringa_codici(ar_medico_descr);
	var scaduto='N';
	var src 		= '';
	
	if(id_remoto == ''){
		alert('Attenzione:effettuare una selezione');
		return;
	}	
	
	//per disabilitare il pulsante di stampa dalla scheda di visualizzazione
	if (validita=='SCADUTO' || validita=='CHIUSO'){
	scaduto='S';
	}
	
	
	parent.parent.$('#frameBottom').show();
	//extra regione
	
	if(medico_descr=='EXTRA REGIONE'){
	 src="servletGenerator?KEY_LEGAME=PIANO_TER_EXTRA_REG&idRemoto="+id_remoto+"&IDEN="+iden_xml+"&IDEN_TESTATA="+iden_testata+"&STATO=L&SCADUTO="+scaduto;
	}
	else{
		src= "servletGenerator?KEY_LEGAME=PIANO_TERAPEUTICO&idRemoto="+id_remoto+"&IDEN="+iden_xml+"&IDEN_TESTATA="+iden_testata+"&STATO=L&FIRMATO="+firmato+"&SCADUTO="+scaduto+"&IDPIANO="+id_piano;
		src+="&REMOTO="+stringa_codici(ar_remoto);
	}
	parent.parent.document.all['frameBottom'].src = src;
	parent.parent.$('#frameBottom').height('90%');
	parent.parent.$('#frameTop').hide();
	parent.parent.document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';

}

function rinnovaPianoTerapeutico(){
var id_remoto 	= stringa_codici(ar_id_remoto);	
var data_scad 	= stringa_codici(ar_data_scadenza);	
var firmato 	= stringa_codici(ar_firmato);
var validita    = stringa_codici(ar_validita);
var medico_descr= stringa_codici(ar_medico_descr);
var flg_remoto  = stringa_codici(ar_remoto);

if(medico_descr=='EXTRA REGIONE'){
	alert('Funzionalità non disponibile. Piano extra regione');
	return;
}

if(id_remoto == ''){
	alert('Attenzione:effettuare una selezione');
	return;
}	

if(flg_remoto == 'S'){
	alert('Funzionalità non disponibile. Piano inserito da un\'altra asl');
	return;
}

if(validita == 'CHIUSO'){
	alert('Attenzione, non è possibile rinnovare un piano precedentemente chiuso');
	return;
}	

if(baseGlobal.SITO=='ASL2' && firmato != 'S'){
	alert('Attenzione, non è possibile rinnovare un piano non firmato');
	return;
}	

var conferma=true;
if (validita!='SCADUTO'){
	conferma=confirm('Attenzione, il piano selezionato è valido ancora per '+validita+'. Continuare?')
}
if(conferma){
	duplicaPianoTerapeutico(data_scad);
}
}

function duplicaPianoTerapeutico(data_scadenza){

	var id_remoto 	= stringa_codici(ar_id_remoto);
	var iden_xml 	= stringa_codici(ar_iden_xml);
	var iden_testata= stringa_codici(ar_iden_testata);
	var firmato 	= stringa_codici(ar_firmato);
	var validita    = stringa_codici(ar_validita);
	var flg_remoto  = stringa_codici(ar_remoto);
	var id_piano    = stringa_codici(ar_iden_remote);
	var medico_descr= stringa_codici(ar_medico_descr);
	var src 		= '';
	
	src="servletGenerator?KEY_LEGAME=PIANO_TERAPEUTICO&idRemoto="+id_remoto;
	src+="&IDEN="+iden_xml;
	src+="&IDEN_TESTATA="+iden_testata;
	src+="&STATO=M";
	src+="&DUPLICA=S";
	src+="&FIRMATO=N";
	src+="&REMOTO="+stringa_codici(ar_remoto);
	src+="&IDPIANO="+id_piano;
	
	if(medico_descr=='EXTRA REGIONE'){
		alert('Funzionalità non disponibile. Piano extra regione');
		return;
	}

	//se si tratta di un rinnovo
	if (typeof data_scadenza !='undefined' && data_scadenza!='')
	src+="&DATA_ATTIVAZIONE="+data_scadenza;
	else
//se si tratta di una duplicazione
	{
	if(validita!='SCADUTO' && validita!='CHIUSO' )	
	{
		alert('Attenzione, non è possibile duplicare un piano ancora attivo');
		return;
	}

	
		
	}
	
	if(id_remoto == ''){
		alert('Attenzione:effettuare una selezione');
		return;
	}	
	
	parent.parent.$('#frameBottom').show();
    parent.parent.document.all['frameBottom'].src = src;
	parent.parent.$('#frameBottom').height('90%');
	parent.parent.$('#frameTop').hide();
	parent.parent.document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
	//decommentare se si vuole duplicare il pt direttamente da worklist
	/*
	var PC = document.EXTERN.PC_ID.value;
	var user = document.EXTERN.USER_LOGIN.value;
	var user_id = document.EXTERN.USER_ID.value;
	var iden = stringa_codici(ar_iden_xml);
	var sql='';

	sql = "{call ? := RADSQL_BCK.DUPLICA_PIANO_TERAPEUTICO(" + iden + ", " + user_id + ",'" + PC + "','" + user + "')}";
	
	//alert(sql);

	dwr.engine.setAsync(false);
	toolKitDB.executeFunctionData(sql, callRisp);
	dwr.engine.setAsync(true);
	
	function callRisp(resp){
		//alert(resp);
		location.replace(location);
	}
	*/
}

function chiudiPianoTerapeutico(){
	
	var id_remoto 	= stringa_codici(ar_id_remoto);
	var iden_med 	= stringa_codici(ar_medico_iden);
	var iden_xml 	= stringa_codici(ar_iden_xml);
	var iden_testata= stringa_codici(ar_iden_testata);
	var firmato 	= stringa_codici(ar_firmato);
	var validita    = stringa_codici(ar_validita);
	var flg_remoto  = stringa_codici(ar_remoto);
	var data_att  	= stringa_codici(ar_data_attivazione);
	var id_piano    = stringa_codici(ar_iden_remote);
	var medico_descr= stringa_codici(ar_medico_descr);
	
	if(id_remoto == ''){
		alert('Attenzione:effettuare una selezione');
		return;
	}	
	
	if(flg_remoto == 'S'){
		alert('Funzionalità non disponibile. Piano inserito da un\'altra asl');
		return;
	}
	if(medico_descr=='EXTRA REGIONE'){
		alert('Funzionalità non disponibile. Piano extra regione');
		return;
	}
	
	if(baseGlobal.SITO=='ASL2' && iden_med!=document.EXTERN.USER_ID.value){
	alert("La chiusura è consentita solo all'utente che ha inserito il piano");
	return;
	}

	if(validita == 'SCADUTO'){
		alert('Attenzione, piano già scaduto');
		return;
	}
	
	if(validita == 'CHIUSO'){
		alert('Attenzione, piano già precedentemente chiuso');
		return;
	}
	
/*	if (data_att>clsDate.getData(new Date(),'YYYYMMDD')){
		alert('Impossibile chiudere un piano la cui data di attivazione è maggiore della data odierna');	
		return;
	}*/
		
	
	
	
	parent.parent.$('#frameBottom').show();
    parent.parent.document.all['frameBottom'].src = "servletGenerator?KEY_LEGAME=PIANO_TERAPEUTICO&idRemoto="+id_remoto+"&IDEN="+iden_xml+"&IDEN_TESTATA="+iden_testata+"&STATO=MC&FIRMATO="+firmato+"&IDPIANO="+id_piano;
	parent.parent.$('#frameBottom').height('90%');
	parent.parent.$('#frameTop').hide();
	parent.parent.document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
	
	
	
}

function stampaPianoTerapeutico(){

	var idenTestataPT =stringa_codici(ar_iden_testata);
	var validita    = stringa_codici(ar_validita);
	var flg_remoto  = stringa_codici(ar_remoto);
	var medico_descr= stringa_codici(ar_medico_descr);
	if (idenTestataPT==''){
	alert('Attenzione, effettuare una selezione');
	return;
	}
	
	if(flg_remoto == 'S'){
		alert('Funzionalità non disponibile. Piano inserito da un\'altra asl');
		return;
	}
	
	if (validita=='SCADUTO'){
		alert("Piano scaduto, impossibile stampare");
		return;		
	}
	
	if (validita=='CHIUSO'){
		alert("Piano chiuso, impossibile stampare");
		return;		
	}
		
	if(medico_descr=='EXTRA REGIONE'){
		alert('Funzionalità non disponibile. Piano extra regione');
		return;
	}

	if (stringa_codici(ar_firmato)=='S')
	{
		var loc = document.location;
		var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
		var progr = retrieveProgressivo(idenTestataPT,'PIANO_TERAPEUTICO');

		var path=loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));

		var url = "ApriPDFfromDB?AbsolutePath="+path+"&idenVersione="+idenTestataPT+"&funzione=PIANO_TERAPEUTICO&progr="+progr;
		var finestra = window.open(url,"finestra","fullscreen=yes scrollbars=no");
			try{
			top.opener.closeWhale.pushFinestraInArray(finestra);
		   	}catch(e){}
	}
	else
	{

		if (baseGlobal.SITO=='ASL1' || baseGlobal.SITO=='ASL5'){

			var funzione  = 'PIANO_TERAPEUTICO';
			var anteprima = 'S';
			var reparto   = baseGlobal.SITO;
			var sf		  = '&prompt<pIdenTestata>='+idenTestataPT+'&prompt<pEnte>=EnteTest&prompt<pCognMedico>=CognomeProva&prompt<pNomeMedico>=NomeProva&prompt<pCert>=CertificatoProva&prompt<pNotaInFondo>=N';
			var stampante = null;
			var url 	  = 'elabStampa?stampaFunzioneStampa='+funzione;

			url += '&stampaAnteprima='+anteprima;

			if(reparto!=null && reparto!='')		
				url += '&stampaReparto='+reparto;

			if(sf!=null && sf!='')
				url += '&stampaSelection='+sf;	

			if(stampante!=null && stampante!='')
				url += '&stampaStampante='+stampante;	

			var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);

			if(finestra)
			{	
				finestra.focus();
			}
			else
			{
				var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
			}
				try{
				top.opener.closeWhale.pushFinestraInArray(finestra);
			   	}catch(e){}

		}
		else{

			alert('Attenzione, non è possibile stampare un piano non firmato');	
		}


	}	
}




function importaPTRemoto() { 
	var idRemPiano = stringa_codici(ar_numero_psp);
	dwr.engine.setAsync(false);
	dwrPianiTerapeutici.getPT('ricercaPerIdPT',idRemPiano,resp); 
	//dwrPianiTerapeutici.getPT('ricercaPerNumSAL',"802849",resp);
	dwr.engine.setAsync(true);		
	
}

function resp(res){	
var idRemoto=parent.document.EXTERN.idRemoto.value;	
if (res!='KO'){
/*	parent.parent.$('#frameBottom').show();
    parent.parent.document.all['frameBottom'].src = "servletGenerator?KEY_LEGAME=PIANO_TERAPEUTICO&idRemoto="+idRemoto+"&IDEN="+res+"&STATO=L";
	parent.parent.$('#frameBottom').height('90%');
	parent.parent.$('#frameTop').hide();
	parent.parent.document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
*/
	
	top.document.all['frameTop'].src = "servletGenerator?KEY_LEGAME=PT_FILTRI_WK&TIPO=VISUALIZZA&idRemoto="+top.document.EXTERN.idRemoto.value;


}
else
	alert('Ricerca non andata a buon fine');	
}





function controllaData() {
	
	var ini  = clsDate.dateAdd(new Date(),'h',-200);
	var data = clsDate.str2date(stringa_codici(ar_data_reg),'DD/MM/YYYY',stringa_codici(ar_ora_reg));
	
	if(ini<=data)
		return true;
	else
	return false;
}

function controllaDataFirma() {
	if (stringa_codici(ar_data_reg)=='')
		return true;
	else
	{
		var iden_testata = stringa_codici(ar_iden_testata);
		var data = '';
		var datafine = '';
		var ini = '';
	    data = clsDate.str2date(stringa_codici(ar_data_reg),'DD/MM/YYYY',stringa_codici(ar_ora_reg));
		datafine = clsDate.dateAdd(data,'h',2);
		ini = new Date();

		if(ini<=datafine)
			return true;
		else
			return false;
	}
}



function retrieveProgressivo(iden_testata_pt,funzione){
	
	var progressivo = '';
 
	 dwr.engine.setAsync(false); 
	 toolKitDB.getResultData('select max(progr) from CC_FIRMA_PDF where iden_tab = ' + iden_testata_pt + ' and funzione = \''+funzione+'\'', resp_check);
	 dwr.engine.setAsync(true);
	 
	 function resp_check(resp){
		 progressivo=resp;
	 }
 
	 return progressivo;
}

function firmaPianoTerapeutico()
{
	var idenTestataPT = stringa_codici(ar_iden_testata); 
	var validita    = stringa_codici(ar_validita);
	var firmato 	= stringa_codici(ar_firmato);
	var iden_med 	= stringa_codici(ar_medico_iden);
	var flg_remoto  = stringa_codici(ar_remoto);
	var medico_descr= stringa_codici(ar_medico_descr);
	
	if (idenTestataPT==''){
	alert('Attenzione, effettuare una selezione');
	return;
	}
	if(flg_remoto == 'S'){
		alert('Funzionalità non disponibile. Piano inserito da un\'altra asl');
		return;
	}
	
	if(iden_med!=document.EXTERN.USER_ID.value){
		alert("La firma è consentita solo all'utente che ha inserito il piano");
		return;
		}
	
	if (validita=='SCADUTO'){
		alert("Piano scaduto, impossibile firmare");
		return;		
	}
	if (validita=='CHIUSO'){
		alert("Piano chiuso, impossibile firmare");
		return;		
	}
	if(medico_descr=='EXTRA REGIONE'){
		alert('Funzionalità non disponibile. Piano extra regione');
		return;
	}
	
	if (firmato=='S'){
		alert("Attenzione, piano già firmato");
		return;		
	}
		
	

	var url = "SrvFirmaPdfGenerica?typeFirma=PIANO_TERAPEUTICO&tabella=PT_TESTATA&idenTestataPT="+idenTestataPT+'&reparto='+baseGlobal.SITO+'&iden_per='+baseUser.IDEN_PER;
	var finestra = window.open(url,"finestra","fullscreen=yes scrollbars=no");
try{
		top.opener.closeWhale.pushFinestraInArray(finestra);
	   	}catch(e){}
}


