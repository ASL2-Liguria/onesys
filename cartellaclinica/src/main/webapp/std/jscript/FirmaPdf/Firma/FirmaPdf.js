/*Javascript Gestione Firma P7M(tramite ActiveX)*/
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++)if ((new Date().getTime() - start) > milliseconds)break;
}

$(document).ready(function(){
	
	window.baseUser = opener.top.baseUser;
	
	firmaPdf.init();	
})




var firmaPdf = {
	typeProcedure:'',
	myObject:'',
	pdfPosition:'',
	salvaFirma:'KO',
	closeFirma: false,
	
	init:function(){
		firmaPdf.appendOcx();
		firmaPdf.typeProcedure = $('#typeProcedure').val();
		firmaPdf.inizializzaFirma();

	},
	
	appendOcx:function(){
		var $newobj = $('<object name="ocxfirma" id = "objocxfirma">'+
						'<param name="utente_web" value=""></param>'+
						'<param name="utente_connesso" value=\"'+baseUser.IDEN_PER+'\"></param>'+
						'<param name="codice_fiscale" value=\"'+baseUser.COD_FISC+'\"></param>'+
						'<param name="numero_copie"value="1"></param>'+
						'<param name="percorso_http" value=""></param>'+
						'<param name="stampante" value=""></param>'+
						'</object>');
	
		$('#EXTERN').append($newobj);
		$newobj.attr("classid","clsid:BE1968E9-C85D-4B6A-AA9F-C2CA1DC20299");
		
	},
	
	
	inizializzaFirma:function(){
		document.id_aggiorna.action = document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_AFTER.value;
/*		document.formConfigurazioneFirma.action = document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_AFTER.value;
		alert(document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_AFTER.value);*/
	  	var viewInfo = document.formConfigurazioneFirma.VIEW_TO_TAKE_JS.value;
   
	  	switch(firmaPdf.typeProcedure) 
	  	{	 
			case 'LETTERA_STANDARD'		: 
		  	case 'LETTERA_PROSECUZIONE'	: 
		  	case 'LETTERA_DIMISSIONI_DH':
		  	case 'LETTERA_AL_CURANTE'	:
		  	case 'LETTERA_FARMACIA'		:		
		  	case 'LETTERA_PRIMO_CICLO'	: firmaPdf.getInfoLettera(viewInfo); 
				break;  		
		  
		  	case 'CONSULENZE_REFERTAZIONE': firmaPdf.getInfoConsulenza(viewInfo);
		  		break;

		  	case 'VISITA_ANESTESIOLOGICA': firmaPdf.getInfoVisitaAnestesiologica(viewInfo);
		  		break;            
            
		  	case 'LETTERA_TRASFERIMENTO':
		  	case 'SEGNALAZIONE_DECESSO':	
		  		eval(document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_BEFORE.value);//preparaLetTrasferimento();
		  		break;
		  
		  	default: null; 
	  	}
		
	},
	
	getInfoLettera:function(viewInfo){
		var campoFiltro;
		var valoreFiltro;
		// il campo da filtrare è idenVisita 
		campoFiltro  = $('#campoDaFiltrare').val();		
		/* valore di idenVisita */
		valoreFiltro = $('#whereReport').val();	
		dwr.engine.setAsync(false);
		dwrPreparaFirma.getInfo(viewInfo,campoFiltro,valoreFiltro,firmaPdf.PreparaFirma);
		dwr.engine.setAsync(true);
	},
	
	getInfoConsulenza:function(viewInfo){
		var campoFiltro;
		var valoreFiltro;
		// VIEW_CC_CONSULENZA_DA_FIRMARE 
		// il campo da filtrare è l'iden_esame 
		//campoFiltro  = 'IDEN_ESAME';//(da trasformare in campoDaFiltrare LATO JAVA)															
		// valore di iden_esame 
		//valoreFiltro = idenEsame;
		campoFiltro  = 'IDEN';/*(da trasformare in campoDaFiltrare LATO JAVA)*/															
	// valore di iden_esame 
		valoreFiltro = $('#idenTes').val();
		dwr.engine.setAsync(false);
		dwrPreparaFirma.getInfo(viewInfo,campoFiltro,valoreFiltro,firmaPdf.PreparaFirma);
		dwr.engine.setAsync(true);	
	},
    
    getInfoVisitaAnestesiologica:function(viewInfo){
        var campoFiltro;
		var valoreFiltro;
		// VIEW_CC_CONSULENZA_DA_FIRMARE 
		// il campo da filtrare è l'iden_esame 
		//campoFiltro  = 'IDEN_ESAME';//(da trasformare in campoDaFiltrare LATO JAVA)															
		// valore di iden_esame 
		//valoreFiltro = idenEsame;
		campoFiltro  = 'IDEN';/*(da trasformare in campoDaFiltrare LATO JAVA)*/															
	// valore di iden_esame 
		valoreFiltro = $('#idenTes').val();
		dwr.engine.setAsync(false);
		dwrPreparaFirma.getInfo(viewInfo,campoFiltro,valoreFiltro,firmaPdf.PreparaFirmaVisitaAnestesiologica);
		dwr.engine.setAsync(true);	
    },
    
	
	PreparaFirma:function(resp){
		if (resp!='')
		{
			//Errore ritornato dalla chiamata al dwr getInfo()
			alert(resp);
		}
		else
		{
			eval(document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_BEFORE.value);					
		}
	},
	
	PreparaFirmaLettera:function(){
		var spToCallBefore = document.formConfigurazioneFirma.PROC_TO_CALL_BEFORE.value;
	
		var valoriParametri = new Array();	
		var tipiParametri = new Array();	
		
		//da qui si impostano i parametri da passare alla SP tipi['CLOB','VARCHAR',,'NUMBER','FLOAT']	
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push(firmaPdf.typeProcedure);	
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push(setParam.arrParam['TABELLA']);	
	
		// Iden Della Lettera
		tipiParametri.push('NUMBER');
		valoriParametri.push(setParam.arrParam['IDEN']);	
	
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#whereReport').val());	
	
		tipiParametri.push('NUMBER');
		valoriParametri.push(baseUser.IDEN_PER);					
	
		//fine parametri per la SP
		dwr.engine.setAsync(false);
		dwrPreparaFirma.preparaFirma(spToCallBefore,tipiParametri,valoriParametri,firmaPdf.afterdwrPreparazione);
		dwr.engine.setAsync(true);
	},
	
	preparaLetteraTrasferimento:function()
	{
		var spToCallBefore = document.formConfigurazioneFirma.PROC_TO_CALL_BEFORE.value;
		var valoriParametri = new Array();	
		var tipiParametri = new Array();	
		//da qui si impostano i parametri da passare alla SP tipi['CLOB','VARCHAR',,'NUMBER','FLOAT']	
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push(firmaPdf.typeProcedure);	
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push($('#tabella').val());	
	
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#idenLettera').val());		
	
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#idenVisita').val());	
		
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#idenPer').val());					
		//fine parametri per la SP
		dwr.engine.setAsync(false);
		dwrPreparaFirma.preparaFirma(spToCallBefore,tipiParametri,valoriParametri,firmaPdf.afterdwrPreparazione);
		dwr.engine.setAsync(true);
	},
	
	PreparaFirmaConsulenza:function(){
	// Chiama la procedura che inserisce all'interno di cc_firma_pdf un record su cui fare l'update
	//	SP_CC_NUOVA_VERSIONE_FIRMA
		var spToCallBefore = document.formConfigurazioneFirma.PROC_TO_CALL_BEFORE.value;
	
		var valoriParametri = new Array();	
		var tipiParametri = new Array();	
		
		//da qui si impostano i parametri da passare alla SP tipi['CLOB','VARCHAR',,'NUMBER','FLOAT']	
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push(firmaPdf.typeProcedure);	
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push(setParam.arrParam['TABELLA']);	
		// Iden Del Referto
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#idenReferto').val());		
	
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#whereReport').val());	
		
		tipiParametri.push('NUMBER');
		valoriParametri.push(baseUser.IDEN_PER);					
	
		//fine parametri per la SP
		dwr.engine.setAsync(false);
		dwrPreparaFirma.preparaFirma(spToCallBefore,tipiParametri,valoriParametri,firmaPdf.afterdwrPreparazione);
		dwr.engine.setAsync(true);
	},
    
    PreparaFirmaVisitaAnestesiologica:function(){
	// Chiama la procedura che inserisce all'interno di cc_firma_pdf un record su cui fare l'update
	//	SP_CC_NUOVA_VERSIONE_FIRMA
		var spToCallBefore = document.formConfigurazioneFirma.PROC_TO_CALL_BEFORE.value;
	
		var valoriParametri = new Array();	
		var tipiParametri = new Array();	
		
		//da qui si impostano i parametri da passare alla SP tipi['CLOB','VARCHAR',,'NUMBER','FLOAT']	
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push(firmaPdf.typeProcedure);	
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push(setParam.arrParam['TABELLA']);	
		// Iden Del Referto
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#idenReferto').val());		
	
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#whereReport').val());	
		
		tipiParametri.push('NUMBER');
		valoriParametri.push(baseUser.IDEN_PER);					
	
		//fine parametri per la SP
		dwr.engine.setAsync(false);
		dwrPreparaFirma.preparaFirma(spToCallBefore,tipiParametri,valoriParametri,firmaPdf.afterdwrPreparazione);
		dwr.engine.setAsync(true);
	},
    
	
	afterdwrPreparazione:function(variReturn){
		if(variReturn==null || variReturn=='')
		{
			var pdfPosition =""
			pdfPosition+=document.formConfigurazioneFirma.webScheme.value+'://';
			pdfPosition+=document.formConfigurazioneFirma.webServerName.value+':';
			pdfPosition+=document.formConfigurazioneFirma.webServerPort.value;
			pdfPosition+=document.formConfigurazioneFirma.webContextPath.value;
			
			reparto  = document.formConfigurazioneFirma.REPARTO.value;
			report   = document.formConfigurazioneFirma.REPORT.value;
			sfReport = document.formConfigurazioneFirma.WHERE_REPORT.value;
	
		//	pdfPosition = 'http://192.168.3.34:8080/whale';
	
			pdfPosition+='/ServletStampe?';
			pdfPosition+='report=' + reparto + '/' + report;
			//pdfPosition+='&sf=' + sfReport + whereReport;
			
			switch(firmaPdf.typeProcedure) { 

			case 'LETTERA_STANDARD'		: 
		  	case 'LETTERA_PROSECUZIONE'	:				  
			case 'LETTERA_DIMISSIONI_DH':	pdfPosition+=firmaPdf.componiPdfUrlLetteraDimissioni(); 
			break;
			
			case 'LETTERA_FARMACIA':
			case 'LETTERA_AL_CURANTE':		 		
			case 'LETTERA_PRIMO_CICLO':		pdfPosition+=firmaPdf.componiPdfUrlLettera(); 
			break;  		  		
	
			case 'CONSULENZE_REFERTAZIONE': pdfPosition+=firmaPdf.componiPdfUrlConsulenza();
			break;

			case 'VISITA_ANESTESIOLOGICA': pdfPosition+=firmaPdf.componiPdfUrlVisitaAnestesiologica();
			break;            
            	
			case 'LETTERA_TRASFERIMENTO': pdfPosition+=firmaPdf.componiPdfUrlLetteraTrasferimento();
			break;
			case 'SEGNALAZIONE_DECESSO': pdfPosition+=firmaPdf.componiPdfUrlSegnalazioneDecesso();
			break;
			default: pdfPosition+=componiPdfUrlPT()
			}
			sleep(500);
			try{
				document.all.ocxfirma.start_firma(pdfPosition+'&t='+new Date().getTime());
			}catch(e){}
		}
		else
		{
			alert(variReturn);
		}		
	},
	
	componiPdfUrlLetteraDimissioni:function()
	{

		var allegaDatiStr 	= $('#allegaDatiStr').val();
		var idenAnag		= $('#idenAnag').val();
		var repartoDati 	= $('#repartoDati').val();		
                var sf                  = '';       
		// alert('Firma: ' + opener._ALLEGATO_DATI_LABO.SETTINGS[opener._ALLEGATO_DATI_LABO.SETTINGS['FUNZIONE_ATTIVA']]['allegato']);

		if(opener._ALLEGATO_DATI_LABO.SETTINGS[opener._ALLEGATO_DATI_LABO.SETTINGS['FUNZIONE_ATTIVA']]['allegato']){
			var allegati		= opener._ALLEGATO_DATI_LABO.allegato;
			if(opener._ALLEGATO_DATI_LABO.allegato== 'S'){	
				sf = "&prompt<pVisita>="+setParam.arrParam['IDEN_VISITA'];
				sf += "&prompt<pFunzione>='"+firmaPdf.typeProcedure+"'";
				sf += "&prompt<pFunzioneAssociata>=";
				sf += "&prompt<pIdenAnag>="+idenAnag;
				sf += "&prompt<pReparto>="+repartoDati;
				sf += "&prompt<pAllega>="+opener._ALLEGATO_DATI_LABO.allegato;
				sf += "&prompt<pNosologico>="+$('input[name="paramNosologico"]').val();
				sf += "&prompt<pIdPaziente>="+$('input[name="paramIdPaziente"]').val();
				sf += "&prompt<pDaData>="+$('input[name="paramDaData"]').val();
				sf += "&prompt<pAData>="+$('input[name="paramAData"]').val();
				sf += "&prompt<pModalita>="+$('input[name="paramModalita"]').val();
				sf += "&prompt<pProvRisultati>="+$('input[name="paramProvRisultati"]').val();
				sf += "&prompt<pBranca>="+$('input[name="paramBranca"]').val();
				sf += "&prompt<pNumRichieste>="+$('input[name="paramNumRichieste"]').val(); 
				sf += "&prompt<pWebUser>="+window.baseUser.LOGIN;
			}else{
				sf = "&prompt<pVisita>="+setParam.arrParam['IDEN_VISITA'];
				sf += "&prompt<pFunzione>='"+firmaPdf.typeProcedure+"'";
				sf += "&prompt<pFunzioneAssociata>=";
				sf += "&prompt<pIdenAnag>="+idenAnag;
				sf += "&prompt<pReparto>="+repartoDati;
				sf += "&prompt<pAllega>=N";
				sf += "&prompt<pNosologico>=";
				sf += "&prompt<pIdPaziente>=";
				sf += "&prompt<pDaData>=";
				sf += "&prompt<pAData>=";
				sf += "&prompt<pModalita>=";
				sf += "&prompt<pProvRisultati>=";
				sf += "&prompt<pBranca>=";
				sf += "&prompt<pNumRichieste>=";
				sf += "&prompt<pWebUser>="+window.baseUser.LOGIN;				
			}
		}else{
			sf = "&prompt<pVisita>="+setParam.arrParam['IDEN_VISITA'];
			sf += "&prompt<pFunzione>='"+firmaPdf.typeProcedure+"'";
			sf += "&prompt<pFunzioneAssociata>=";
			sf += "&prompt<pIdenAnag>="+idenAnag;
			sf += "&prompt<pReparto>="+repartoDati;
			sf += "&prompt<pAllega>=N";
			sf += "&prompt<pNosologico>=";
			sf += "&prompt<pIdPaziente>=";
			sf += "&prompt<pDaData>=";
			sf += "&prompt<pAData>=";
			sf += "&prompt<pModalita>=";
			sf += "&prompt<pProvRisultati>=";
			sf += "&prompt<pBranca>=";
			sf += "&prompt<pNumRichieste>=";				
			sf += "&prompt<pWebUser>="+window.baseUser.LOGIN;
        }
        return sf;
        },

	componiPdfUrlLettera:function()
	{
		var idenAnag 			= $('#idenAnag').val();
		var repartoDati 		= $('#repartoDati').val();
		var allegati			= opener._ALLEGATO_DATI_LABO.allegato;
		var sf = '';

		if(opener._ALLEGATO_DATI_LABO.SETTINGS[opener._ALLEGATO_DATI_LABO.SETTINGS['FUNZIONE_ATTIVA']]['allegato']){
			if(opener._ALLEGATO_DATI_LABO.allegato== 'S'){		
				sf =  "&prompt<pVisita>="+setParam.arrParam['IDEN_VISITA'];
				sf += "&prompt<pFunzione>='"+firmaPdf.typeProcedure+"'";
				sf += "&prompt<pFunzioneAssociata>=";
				sf += "&prompt<pIdenAnag>="+idenAnag;
				sf += "&prompt<pReparto>="+repartoDati;
				sf += "&prompt<pAllega>="+allegati;
				sf += "&prompt<pNosologico>="+$('input[name="paramNosologico"]').val();
				sf += "&prompt<pIdPaziente>="+$('input[name="paramIdPaziente"]').val();
				sf += "&prompt<pDaData>="+$('input[name="paramDaData"]').val();
				sf += "&prompt<pAData>="+$('input[name="paramAData"]').val();
				sf += "&prompt<pModalita>="+$('input[name="paramModalita"]').val();
				sf += "&prompt<pProvRisultati>="+$('input[name="paramProvRisultati"]').val();
				sf += "&prompt<pBranca>="+$('input[name="paramBranca"]').val();
				sf += "&prompt<pNumRichieste>="+$('input[name="paramNumRichieste"]').val();
				sf += "&prompt<pWebUser>="+window.baseUser.LOGIN;
			}else{
				sf = "&prompt<pVisita>="+setParam.arrParam['IDEN_VISITA'];
				sf += "&prompt<pFunzione>='"+firmaPdf.typeProcedure+"'";
				sf += "&prompt<pFunzioneAssociata>=";
				sf += "&prompt<pIdenAnag>="+idenAnag;
				sf += "&prompt<pReparto>="+repartoDati;
				sf += "&prompt<pAllega>=N";
				sf += "&prompt<pNosologico>=";
				sf += "&prompt<pIdPaziente>=";
				sf += "&prompt<pDaData>=";
				sf += "&prompt<pAData>=";
				sf += "&prompt<pModalita>=";
				sf += "&prompt<pProvRisultati>=";
				sf += "&prompt<pBranca>=";
				sf += "&prompt<pNumRichieste>=";
				sf += "&prompt<pWebUser>="+window.baseUser.LOGIN;					
			}
		}else{
			sf = "&prompt<pVisita>="+setParam.arrParam['IDEN_VISITA'];
			sf += "&prompt<pFunzione>='"+firmaPdf.typeProcedure+"'";
			sf += "&prompt<pFunzioneAssociata>=";
			sf += "&prompt<pIdenAnag>="+idenAnag;
			sf += "&prompt<pReparto>="+repartoDati;
			sf += "&prompt<pAllega>=N";
			sf += "&prompt<pNosologico>=";
			sf += "&prompt<pIdPaziente>=";
			sf += "&prompt<pDaData>=";
			sf += "&prompt<pAData>=";
			sf += "&prompt<pModalita>=";
			sf += "&prompt<pProvRisultati>=";
			sf += "&prompt<pBranca>=";
			sf += "&prompt<pNumRichieste>=";
			sf += "&prompt<pWebUser>="+window.baseUser.LOGIN;						
		}
		sf += "&prompt<pIdenVersioneAssociata>="+setParam.arrParam['IDEN'];			
                return sf;
        },
	
	componiPdfUrlConsulenza:function(){
		//alert(setParam.arrParam['IDEN']+' '+$('#idenTes').val());

		return "&prompt<pIdenTR>="+setParam.arrParam['IDEN']+"&prompt<pIdenVersione>="+$('#idenReferto').val();
	},
    
    componiPdfUrlVisitaAnestesiologica:function(){

        return "&prompt<pIdenTestata>="+$('#idenTes').val();        
    },
    
	
	componiPdfUrlLetteraTrasferimento:function()
	{	
		return "&prompt<pVersione>="+$('#idenLettera').val();
	},
	
	componiPdfUrlSegnalazioneDecesso:function()
	{	
		return "&prompt<pIdenVisita>="+$('#idenVisita').val();
	},
	
	salva_pdf_consulenza:function(){
		var valoriParametri = new Array();	
		var tipiParametri = new Array();
		//da qui si impostano i parametri da passare alla SP
		//Funzione
		tipiParametri.push('VARCHAR');
		valoriParametri.push(firmaPdf.typeProcedure);
		//Tabella
		tipiParametri.push('VARCHAR');
		valoriParametri.push(setParam.arrParam['TABELLA']);
		//idenTab = idenReferto da salvare
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#idenReferto').val());
		//idenRef = idenReferto da sostituire
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#idenRefOld').val());
		
		tipiParametri.push('NUMBER');
		valoriParametri.push(setParam.arrParam['IDEN_VISITA']);	
	
		tipiParametri.push('CLOB');
		valoriParametri.push(document.id_aggiorna.HinputRefFirmato.value);
	
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#idenTes').val());
	
		tipiParametri.push('NUMBER');
		valoriParametri.push(baseUser.IDEN_PER);
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push($('#dataEsame').val() );
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push($('#oraEsame').val());
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push($('#validaFirma').val());
	
		var spToCallAfter = document.formConfigurazioneFirma.PROC_TO_CALL_AFTER.value;
		dwr.engine.setAsync(false);
		dwrPreparaFirma.archiviaFirma(spToCallAfter,tipiParametri,valoriParametri,firmaPdf.afterSaveOK);	
		dwr.engine.setAsync(true);		
		
	},

	salva_pdf_lettera:function()
	{
		var valoriParametri = new Array();	
		var tipiParametri = new Array();
		//da qui si impostano i parametri da passare alla SP
		tipiParametri.push('VARCHAR');
		valoriParametri.push(firmaPdf.typeProcedure);
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push(setParam.arrParam['TABELLA']);
	
		tipiParametri.push('NUMBER');
		valoriParametri.push(setParam.arrParam['IDEN']);	
	
		tipiParametri.push('NUMBER');
		valoriParametri.push(setParam.arrParam['IDEN_VISITA']);	
	
		tipiParametri.push('CLOB');
		valoriParametri.push(document.id_aggiorna.HinputRefFirmato.value);
	
		var spToCallAfter = document.formConfigurazioneFirma.PROC_TO_CALL_AFTER.value;
	
		dwr.engine.setAsync(false);
		dwrPreparaFirma.archiviaFirma(spToCallAfter,tipiParametri,valoriParametri,firmaPdf.afterSaveOK);
		dwr.engine.setAsync(true);
	},

	salva_lettera_trasferimento:function()
	{
		var valoriParametri = new Array();	
		var tipiParametri = new Array();
		//da qui si impostano i parametri da passare alla SP
		tipiParametri.push('VARCHAR');
		valoriParametri.push(firmaPdf.typeProcedure);
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push($('#tabella').val());
	
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#idenLettera').val());	
		
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#idenVisita').val());	
	
		tipiParametri.push('CLOB');
		valoriParametri.push(document.id_aggiorna.HinputRefFirmato.value);
	
		var spToCallAfter = document.formConfigurazioneFirma.PROC_TO_CALL_AFTER.value;
		dwr.engine.setAsync(false);
		dwrPreparaFirma.archiviaFirma(spToCallAfter,tipiParametri,valoriParametri,firmaPdf.afterSaveOK);
		dwr.engine.setAsync(true);
	},

	salva_pdf_visita_an:function(){
		var valoriParametri = new Array();	
		var tipiParametri = new Array();
		//da qui si impostano i parametri da passare alla SP
		//Funzione
		tipiParametri.push('VARCHAR');
		valoriParametri.push(firmaPdf.typeProcedure);
		//Tabella
		tipiParametri.push('VARCHAR');
		valoriParametri.push(setParam.arrParam['TABELLA']);
		//idenTab = idenReferto da salvare
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#idenReferto').val());
		//idenRef = idenReferto da sostituire
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#idenRefOld').val());
		
		tipiParametri.push('NUMBER');
		valoriParametri.push(setParam.arrParam['IDEN_VISITA']);	
	
		tipiParametri.push('CLOB');
		valoriParametri.push(document.id_aggiorna.HinputRefFirmato.value);
	
		tipiParametri.push('NUMBER');
		valoriParametri.push($('#idenTes').val());
	
		tipiParametri.push('NUMBER');
		valoriParametri.push(baseUser.IDEN_PER);
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push('' );
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push('');
	
		tipiParametri.push('VARCHAR');
		valoriParametri.push($('#validaFirma').val());
	
		var spToCallAfter = document.formConfigurazioneFirma.PROC_TO_CALL_AFTER.value;
		dwr.engine.setAsync(false);
		dwrPreparaFirma.archiviaFirma(spToCallAfter,tipiParametri,valoriParametri,firmaPdf.afterSaveOK);	
		dwr.engine.setAsync(true);		
		
	},	
	
	afterSaveOK:function(ret){
		{
			firmaPdf.salvaFirma = ret.split('*')[0];
		}
	},
	
	closeAnteprima:function()
	{
		firmaPdf.closeFirma=true;
		switch(firmaPdf.typeProcedure) 
		{	 
			case 'LETTERA_STANDARD'		: 
			case 'LETTERA_PROSECUZIONE'	: 
			case 'LETTERA_DIMISSIONI_DH':
			case 'LETTERA_AL_CURANTE'	:  
			case 'LETTERA_PRIMO_CICLO'	:
			case 'LETTERA_FARMACIA'		:
					opener.top.apriLetteraDimissioniNew(firmaPdf.typeProcedure); 
					break;  		
		  
			case 'CONSULENZE_REFERTAZIONE': 
					if (firmaPdf.salvaFirma=='KO')
					{
						dwr.engine.setAsync(false);
						dwrPreparaFirma.resetFirma('{call RADSQL.OE_CONSULENZA.resetRefetazioneConsulenza(?)}',$('#idenTes').val(),firmaPdf.afterReset);	
						dwr.engine.setAsync(true);
					}
					opener.chiudi();
					break;

			case 'VISITA_ANESTESIOLOGICA': 
					if (firmaPdf.salvaFirma=='KO')
					{
						dwr.engine.setAsync(false);
						dwrPreparaFirma.resetFirma('{call RADSQL.OE_REFERTAZIONE.resetrefertazionevisita(?)}',$('#idenTes').val(),firmaPdf.afterReset);	
						dwr.engine.setAsync(true);
						if ($('#idenRefOld').val()=='0'){
							opener.top.apriRefertoVisitaAnestesiologica($('#idenTes').val(),$('#idenReferto').val())
						}else{
							var pBinds = new Array();
							pBinds.push($('#idenRefOld').val());
							var statoRefertoPrecedente;
							var rs = opener.WindowCartella.executeQuery("OE_Refertazione_Visita_Anestesiologica.xml","loadingStatoRefertoPrecedente",pBinds);
							while (rs.next()){
								statoRefertoPrecedente = rs.getString("stato");
							}

							statoRefertoPrecedente=='R'?opener.top.apriRefertoVisitaAnestesiologica($('#idenTes').val(),$('#idenReferto').val()):opener.top.apriRefertoVisitaAnestesiologica($('#idenTes').val(),$('#idenRefOld').val());
						}	
							
					}else{
						opener.top.apriRefertoVisitaAnestesiologica($('#idenTes').val(),$('#idenReferto').val());					
					}

					break;            
            
			case 'LETTERA_TRASFERIMENTO': 
					if (firmaPdf.salvaFirma == 'KO'){
						//se lo stato della lettera precedente è F, allora la riattivo e cancello l'ultima inserita(cancellando anche la riga su cc_firma_pdf)
						if ($('#statoLetteraPrecedente').val()!=undefined && $('#statoLetteraPrecedente').val()=='F')
						{
							
							var resp = opener.top.executeStatement("letteraTrasferimento.xml","rollbackLetteraTrasferimento",[$('#idenLetteraPrecedente').val(),$('#idenLettera').val(),firmaPdf.typeProcedure]);
			 
							if (resp[0]=='OK')
								opener.location.reload();
							else
								alert('Errore Update di Rollback: '+ resp[1]);
						}
					}
					else
					{	
						opener.location.reload();
					}
					break;
		  
			default: null; 
		}
		
		self.close();
	},

	afterReset:function(ret){
		opener.chiudi();
		},
	
	checkLastComma:function (concatenazione){
		var concatenazioneCheck = '';
		if (concatenazione.substr(concatenazione.length-1,concatenazione.length) == ','){
			concatenazioneCheck = concatenazione.substr(0,concatenazione.length-1);
		}else{
			concatenazioneCheck = concatenazione;
		}
		return concatenazioneCheck;
	},
	
	apriStampaGlobale:function(){
		if (firmaPdf.salvaFirma=='KO')
			alert('La lettera non è firmata digitalmente.\n La stampa della cartella è momentamente non disponibile');
		else{
				var txtconfermastampa = confirm('Iniziare Processo di Stampa?')
				if (txtconfermastampa==true)
				{
					opener.top.stampaGlobaleCartella(true);
				}
			}
	}	
	
};



$(window).unload(function() {
		if (firmaPdf.closeFirma==false)
			firmaPdf.closeAnteprima();
	});


/*Funzione necessaria per il caricamento dei valori all'interno dell'array setParam dalla vista viewInfo attraverso dwrPreparaFirma.getInfo*/
function setParam(nome, valore){
	if(typeof setParam.arrParam == 'undefined')
		setParam.arrParam= new Array();
	setParam.arrParam[nome] = valore;	
}

/*function tornaIndietro(){
	alert('non deve entrarci')
	switch(firmaPdf.typeProcedure) 
	  	{	 
			case 'LETTERA_STANDARD'		: 
		  	case 'LETTERA_PROSECUZIONE'	: 
		  	case 'LETTERA_DIMISSIONI_DH':
		  	case 'LETTERA_AL_CURANTE'	:  
		  	case 'LETTERA_PRIMO_CICLO'	: 		
					try{
						self.close(); 
					}
					catch(e){}
		  			break;
		  	case 'CONSULENZE_REFERTAZIONE': firmaPdf.getInfoConsulenza(viewInfo);
		  		break;
  

  
		  	case 'LETTERA_TRASFERIMENTO': eval(document.formConfigurazioneFirma.FUNCT_JS_TO_CALL_BEFORE.value);//preparaLetTrasferimento();
		  		break;
		  
		  	default: null; 
	  	}
	if (firmaPdf.typeProcedure=='LETTERA_STANDARD' || firmaPdf.typeProcedure=='LETTERA_PROSECUZIONE')
	{
		try{
			//opener.top.refreshPage();
			self.close(); 
		}
		catch(e){}
	}
	else{
		try{
			self.close();
		}
		catch(e){}
	}
}*/