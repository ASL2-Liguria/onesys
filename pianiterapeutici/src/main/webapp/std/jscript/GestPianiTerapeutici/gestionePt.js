var codFisc='';
var configPT;
var reparto='';

jQuery(document).ready(function() {
	$('body').keydown(function() {
		if (window.event && window.event.keyCode == 8) {
			window.event.cancelBubble = true;
			window.event.returnValue = false;
		}
	});

	getConfigurazioni();
	pazienteTrovato=true;
	$(document).bind("contextmenu",function(e){
		return false;
	});

	if ( typeof document.EXTERN.reparto !='undefined'){
		reparto=document.EXTERN.reparto.value;
	}
	else if (typeof document.EXTERN.reparto_cod_dec !='undefined'){
		getCodCdcReparto(document.EXTERN.reparto_cod_dec.value);
	}
	else{
		reparto='';	   
	}

	try{		
		$('#lblTitle').text(opener.stringa_codici(opener.array_nome)+' '+opener.stringa_codici(opener.array_cognome)+' '+opener.stringa_codici(opener.array_data));
	}
	catch(e){
		caricaDatiPaziente();	
	}

	document.title = 'PIANI TERAPEUTICI';
	$('#frameTop').height('90%');
	$('#frameBottom').hide();

	try{
		top.utilMostraBoxAttesa(false);
	}
	catch(e){}
	if(pazienteTrovato==true){

		document.all['frameTop'].src = "servletGenerator?KEY_LEGAME=PT_FILTRI_WK&TIPO="+document.EXTERN.TIPO.value+"&idRemoto="+document.EXTERN.idRemoto.value+"&REPARTO="+reparto;

		if(document.EXTERN.TIPO.value=='INSERIMENTO') {
			url="servletGenerator?KEY_LEGAME=PIANO_TERAPEUTICO&IDEN=&IDEN_TESTATA=&FIRMATO=N&idRemoto="+document.EXTERN.idRemoto.value+"&STATO=I&REPARTO="+reparto;
		}
		else if(document.EXTERN.TIPO.value=='INSERIMENTO_EXTRA_REG')
		{
			url="servletGenerator?KEY_LEGAME=PIANO_TER_EXTRA_REG&IDEN=&IDEN_TESTATA=&FIRMATO=N&idRemoto="+document.EXTERN.idRemoto.value+"&STATO=I";
		}

		if(document.EXTERN.TIPO.value=='INSERIMENTO' || document.EXTERN.TIPO.value=='INSERIMENTO_EXTRA_REG') 
		{
			$('#frameBottom').attr('src',url);
			$('#frameBottom').height('90%');
			$('#frameTop').hide();
			$('#frameBottom').show();
			$('#lblChiudi').parent().parent().hide();
		}
	}
	else
	{
		if (typeof (document.EXTERN.idRemoto)=='undefined' || document.EXTERN.idRemoto.value=='') {
			alert("Identificativo paziente non presente");
		}
		else{
			alert("Attenzione, paziente non trovato");	
		}
	}


});


function chiudi(){

	self.close();	
}

function caricaDatiPaziente(){
	
	if (typeof (document.EXTERN.idRemoto)=='undefined' || document.EXTERN.idRemoto.value=='') {
		$('#lblTitle').text('Identificativo paziente non presente');	
		pazienteTrovato=false;	
		return;
	}
	else{

	var sql="SELECT COGNOME,NOME,SUBSTR(DATA_NASCITA,7,2)|| '/' || SUBSTR(DATA_NASCITA,5,2) || '/' || SUBSTR(DATA_NASCITA,1,4) AS DATA, CODICE_FISCALE FROM RADSQL.VIEW_PT_PAZIENTI WHERE ID_REMOTO='"+document.EXTERN.idRemoto.value+"'";
	dwr.engine.setAsync(false);
	toolKitDB.getListResultData(sql,valorizzaCampiInt);
	dwr.engine.setAsync(true);	
	}

}


function valorizzaCampiInt(res){

	if(res.length==1)	
	{
		$('#lblTitle').text(res[0][0]+' '+res[0][1]+' '+res[0][2]);
		codFisc=res[0][3];
	}
	else {
		$('#lblTitle').text('Paziente non trovato');	
		pazienteTrovato=false;		
	}
}

function getCodCdcReparto(rep){

	var sql="SELECT COD_CDC FROM RADSQL.CENTRI_DI_COSTO WHERE ATTIVO='S' AND COD_DEC='"+rep+"'";
	dwr.engine.setAsync(false);
	toolKitDB.getListResultData(sql,respGetCdcReparto);
	dwr.engine.setAsync(true);		
}

function respGetCdcReparto(res){
	if(res.length>0){
		reparto=res[0];
	}	
}

function getConfigurazioni(){

	var sql=" SELECT imagoweb.pck_configurazioni.getValue('"+baseGlobal.SITO+"','','','CONFIGURAZIONI_PT') FROM DUAL";
	dwr.engine.setAsync(false);
	toolKitDB.getListResultData(sql,respGetConfigurazioni);
	dwr.engine.setAsync(true);	
}

function respGetConfigurazioni(res){
	if(res.length!=0){
		eval(res[0][0]);
	}
	configPT=config;

}


