/**
 * @author: linob
 * @date:2015-03-10
 * @version:1.1
 * @1.0: implementazione stampa con applet
 * @1.1: implementazione stampa con applet con ricetta bianca e stampa con diverse configurazioni perl'applet(se stampa con activex la ricetta bianca usa la printername_ref_client)
 */

$(document).ready(function(){
	NS_STAMPA_RICETTE.init();
});


var NS_STAMPA_RICETTE = {
	wnd:'',
	opzioniStampa:'',
	opzioniStampaBianca:'',
	opzioniStampaDema:'',
	stampante:'',
	stampanteRicetteBianca:'',
	stampanteRicetteDema:'',
	
	init:function(){
		
		/*Se l'applet è attiva*/
		if (basePC.USO_APPLET_STAMPA=='S'){
			if (top.name === 'schedaRicovero'){
				/*Dentro l'applicativo di cartella*/
				NS_STAMPA_RICETTE.wnd = top;
//				Ricetta rossa
				NS_STAMPA_RICETTE.opzioniStampa = NS_STAMPA_RICETTE.wnd.opener.NS_PRINT.ricettarossa.getConfigurazione();
				NS_STAMPA_RICETTE.stampante = NS_STAMPA_RICETTE.wnd.opener.NS_PRINT.ricettarossa.getStampante();
//				Ricetta bianca
				NS_STAMPA_RICETTE.opzioniStampaBianca = NS_STAMPA_RICETTE.wnd.opener.NS_PRINT.ricettabianca.getConfigurazione();
				NS_STAMPA_RICETTE.stampanteRicetteBianca = NS_STAMPA_RICETTE.wnd.opener.NS_PRINT.ricettabianca.getStampante();
//				Ricetta Dema
				NS_STAMPA_RICETTE.opzioniStampaDema = NS_STAMPA_RICETTE.wnd.opener.NS_PRINT.ricettadema.getConfigurazione();
				NS_STAMPA_RICETTE.stampanteRicetteDema = NS_STAMPA_RICETTE.wnd.opener.NS_PRINT.ricettadema.getStampante();
				//alert('NS_STAMPA_RICETTE.opzioniStampaDema'+NS_STAMPA_RICETTE.opzioniStampaDema+'\nNS_STAMPA_RICETTE.stampanteRicetteDema'+NS_STAMPA_RICETTE.stampanteRicetteDema)
			}else if(top.name === 'ambulatorio'){
				/*Dentro l'applicativo di ambulatorio*/
				NS_STAMPA_RICETTE.wnd = top;
//				Ricetta rossa
				NS_STAMPA_RICETTE.opzioniStampa = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettarossa.getConfigurazione();
				NS_STAMPA_RICETTE.stampante = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettarossa.getStampante();
//				Ricetta bianca
				NS_STAMPA_RICETTE.opzioniStampaBianca = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettabianca.getConfigurazione();				
				NS_STAMPA_RICETTE.stampanteRicetteBianca = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettabianca.getStampante();
//				Ricetta dema
				NS_STAMPA_RICETTE.opzioniStampaDema = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettadema.getConfigurazione();				
				NS_STAMPA_RICETTE.stampanteRicetteDema = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettadema.getStampante();
			}else if(top.name === 'PSRicetta'){
				/*Dentro l'applicativo di ps*/
				NS_STAMPA_RICETTE.wnd = top;
//				Ricetta rossa
				NS_STAMPA_RICETTE.opzioniStampa = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettarossa.getConfigurazione();
				NS_STAMPA_RICETTE.stampante = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettarossa.getStampante();
//				Ricetta bianca
				NS_STAMPA_RICETTE.opzioniStampaBianca = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettabianca.getConfigurazione();				
				NS_STAMPA_RICETTE.stampanteRicetteBianca = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettabianca.getStampante();
//				Ricetta dema
				NS_STAMPA_RICETTE.opzioniStampaDema = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettadema.getConfigurazione();				
				NS_STAMPA_RICETTE.stampanteRicetteDema = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettadema.getStampante();
			}else{
				/*Dentro l'applicativo di ricetta rossa*/
				NS_STAMPA_RICETTE.wnd = top.opener.top;
//				Ricetta rossa
				NS_STAMPA_RICETTE.opzioniStampa = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettarossa.getConfigurazione();
				NS_STAMPA_RICETTE.stampante = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettarossa.getStampante();
//				Ricetta bianca
				NS_STAMPA_RICETTE.opzioniStampaBianca = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettabianca.getConfigurazione();	
				NS_STAMPA_RICETTE.stampanteRicetteBianca = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettabianca.getStampante();
//				Ricetta dema
				NS_STAMPA_RICETTE.opzioniStampaDema = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettadema.getConfigurazione();				
				NS_STAMPA_RICETTE.stampanteRicetteDema = NS_STAMPA_RICETTE.wnd.NS_PRINT.ricettadema.getStampante();
			}			
		}else{
//			Activex
			NS_STAMPA_RICETTE.wnd = top;
//			Ricetta Rossa
			NS_STAMPA_RICETTE.opzioniStampa = '';
			NS_STAMPA_RICETTE.stampante 	= basePC.PRINTERNAME_RICETTA_ROSSA;
//			Ricetta Bianca
			NS_STAMPA_RICETTE.opzioniStampaBianca = '';			
			NS_STAMPA_RICETTE.stampanteRicetteBianca = basePC.PRINTERNAME_REF_CLIENT;
//			Ricetta Dema
			NS_STAMPA_RICETTE.opzioniStampaDema = '';				
			NS_STAMPA_RICETTE.stampanteRicetteDema = basePC.PRINTERNAME_RICETTA_ROSSA;
			
		}
	},
	
	configuraStampa:function(arrIden,arrTipo){
		var funzione = '';
		var sf = '';
		var sfprompt = '';
		var promptFormula = '';
		var jsonObj = [];
		var stampante = '';
		var opzioni = '';
		for (var key = 0; key < arrIden.length;key++){
			var arrPrompt = [];			
			switch(arrTipo[key]){
			case 'F':
				funzione 	= NS_STAMPA_RICETTE.checkSitoApplet('RICETTA_ROSSA_FARMACI');			
				sfprompt 	= '&prompt<pIdenTestata>='+arrIden[key]+'&prompt<pPosologiaRR>=S&prompt<pShowOriginale>=1';
				stampante 	= NS_STAMPA_RICETTE.stampante;
				opzioni 	= NS_STAMPA_RICETTE.opzioniStampa;
				arrPrompt.push({"prompt<pIdenTestata>":arrIden[key]}); 
				arrPrompt.push({"prompt<pPosologiaRR>":"S"}); 
				arrPrompt.push({"prompt<pShowOriginale>":"1"}); 	
				break;
			case 'B':
			case 'Q':/*BIANCA PRESTAZIONI??*/
				funzione 	= 'RICETTA_BIANCA'; 
				sfprompt 	= '&prompt<pIdenTestata>='+arrIden[key];
				stampante 	= NS_STAMPA_RICETTE.stampanteRicetteBianca;
				opzioni 	= NS_STAMPA_RICETTE.opzioniStampaBianca;
				arrPrompt.push({"prompt<pIdenTestata>":arrIden[key]});				
				break;
			case 'P':
				funzione 	= NS_STAMPA_RICETTE.checkSitoApplet('RICETTA_ROSSA_PRESTAZIONI'); 				
				sfprompt 	= '&prompt<pIdenTestata>='+arrIden[key];		
				stampante 	= NS_STAMPA_RICETTE.stampante;
				opzioni 	= NS_STAMPA_RICETTE.opzioniStampa;
				arrPrompt.push({"prompt<pIdenTestata>":arrIden[key]});
				break;
			case 'FD':	
				funzione 	= 'RICETTA_FARMACI_DEMATERIALIZZATA'; 				
				sfprompt 	= '&prompt<pIdenTestata>='+arrIden[key];
				stampante 	= NS_STAMPA_RICETTE.stampanteRicetteDema;
				opzioni 	= NS_STAMPA_RICETTE.opzioniStampaDema;
				arrPrompt.push({"prompt<pIdenTestata>":arrIden[key]});				
				break;
			case 'PD':	
				funzione 	= 'RICETTA_PRESTAZIONI_DEMATERIALIZZATA'; 				
				sfprompt 	= '&prompt<pIdenTestata>='+arrIden[key];
				stampante 	= NS_STAMPA_RICETTE.stampanteRicetteDema;
				opzioni 	= NS_STAMPA_RICETTE.opzioniStampaDema;
				arrPrompt.push({"prompt<pIdenTestata>":arrIden[key]});
				break;
			default:
				break;
			}

			if (basePC.USO_APPLET_STAMPA=='S'){
				var anteprima = 'N';
				var reparto = baseGlobal.SITO;
				var item = {};

			    item["stampaFunzioneStampa"] 	= funzione;
			    item["stampaSelection"] 		= sf;
			    item["stampaPrompt"]			= arrPrompt;
			    item["stampaAnteprima"] 		= anteprima;
			    item["stampaReparto"] 			= baseGlobal.SITO;
			    item["stampaStampante"] 		= stampante;
			    item["stampaOpzioni"]			= opzioni;
			    jsonObj.push(item);	
				
										
			}else{
				var reparto = baseGlobal.SITO;
				
			    var item = {}

			    item["stampaFunzioneStampa"]= funzione;
			    item["stampaSelection"] 	= sf+sfprompt;
				if(stampante == '' || stampante == null){
					anteprima = 'S';
				}
				else{
					anteprima = 'N';
				}
			    item["stampaAnteprima"] = anteprima;
			    item["stampaReparto"] 	= baseGlobal.SITO;
			    item["stampaStampante"] = stampante;
			    item["stampaOpzioni"]	= '';
			    jsonObj.push(item);	
				
			}
		}
		
		if (basePC.USO_APPLET_STAMPA=='S'){
			NS_STAMPA_RICETTE.stampaConApplet(jsonObj,'N');
		}else{
			NS_STAMPA_RICETTE.stampaConActivex(jsonObj,'N');
		}
		
		
		
	},
	
	stampaConApplet:function(jsonArray,stampaPdfDiretto){
		
		/*var url = getAbsolutePath()+'ServletStampe?';
		url += 'report='+ NS_STAMPA_RICETTE.wnd.NS_PRINT.confStampe[funzione];
		url += sf;
		*/
		$.ajax({
			url: "elabStampaUrl", 
	        type: 'POST',
			data: JSON.stringify(jsonArray),
	        dataType:'json',
	        contentType: 'application/json',
	        mimeType: 'application/json',	        
	         
	        success: function (response) 
	        {
	        	var data = response;
	        	for (var i in data){

	        		var pdfUrl = data[i]["url"];
	        		var ritorno = NS_STAMPA_RICETTE.wnd.NS_PRINT.print({
		    			url:pdfUrl+'&t='+new Date().getTime(),
		    			stampante:data[i]["stampante"],
		    			opzioni:data[i]["opzioni"]
		    			
		    		});

		    		if (ritorno){
		    			parent.Ricerca();
		    		} else {
		    			alert('Contattare Assistenza. Riscontrato problema con applet di stampa');
		    		}
	        	}
	        },
	        error:function(response)
	        {
	        	alert('Si è verificato un errore durante la stampa.');
	        	//alert('response-errore'+response);
	        }
	    });
		

	},
	
	stampaConActivex:function(jsonArray,stampaPdfDiretto){
		for (var key in jsonArray){
			var url =	'elabStampa?';
		    url += 'stampaFunzioneStampa='+jsonArray[key]["stampaFunzioneStampa"];
			
			url += '&stampaAnteprima='+jsonArray[key]["stampaAnteprima"];
			if(jsonArray[key]["stampaReparto"]!=null && jsonArray[key]["stampaReparto"]!=''){
				url += '&stampaReparto='+jsonArray[key]["stampaReparto"];
			}		
			
			if(jsonArray[key]["stampaSelection"]!=null && jsonArray[key]["stampaSelection"]!=''){
				url += '&stampaSelection='+jsonArray[key]["stampaSelection"];
			}

			if(jsonArray[key]["stampaStampante"]!=null && jsonArray[key]["stampaStampante"]!=''){
				url += '&stampaStampante='+jsonArray[key]["stampaStampante"];
			}
			
			url += '&stampaPdfDiretto='+stampaPdfDiretto;

			var finestra  = window.open(url,key,"top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
				
			if(finestra){ 
				finestra.focus(); 
			}else{ 
				finestra  = window.open(url,key,"top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
			}
		}
		
	},
	
	
	checkSitoApplet:function(funzione){
		var strFunzione = '';
		//ASL3: baseGlobal.SITO == 'SITO' -> aggiunto _APPLET alla funzione 
		if (baseGlobal.SITO == 'SITO'){
			if (basePC.USO_APPLET_STAMPA=='S'){
				strFunzione = funzione+'_APPLET';
			}else{
				strFunzione = funzione;				
			}
		}else{
			strFunzione = funzione;
		}
		return strFunzione;
	}
};