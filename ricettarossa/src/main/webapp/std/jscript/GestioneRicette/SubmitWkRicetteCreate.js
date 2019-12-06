/**
 * @deprecated, replaced by {@link #SubmitWkRicetteConfermate.js}
 */

var provenienza = typeof document.EXTERN.PROV != 'undefined'?document.EXTERN.PROV.value:'';

jQuery(document).ready(function() { 
	
	document.getElementById('lblApriChiudi').parentElement.parentElement.style.display = 'none'; 
	jQuery("#lbConfermaStampa").parent().css("width","280px");
	jQuery("#lblBianca").parent().css("width","200px");
	jQuery("#groupDatiWK").find('#body').css('overflow','scroll');
	
	/*
	var tipoUtente=baseUser.TIPO;
	
	if (tipoUtente == 'I'){
		jQuery("#lbConferma").parent().parent().hide();
		document.getElementById('lbConfermaStampa').innerText='Stampa Ricetta Rossa';
		jQuery("#lbConfermaStampa").parent().css("width","200px");
	}else{
		document.getElementById('lbConfermaStampa').innerText='Conferma e Stampa Ricetta Rossa';
	}
	*/
});

function Ricetta_ConfStampa(){	
	var call_Progressivo= getURLParam("WKPROGRESSIVO");
	var call_Tipo= getURLParam("WKTIPO");
	
	//Aggiornamento record Stato & Stampato
	var sqlconfstampa = " STATO  = 'C', STAMPATO  = 'S' ";
	set_Ricette(call_Progressivo, sqlconfstampa);

	//Anteprima di Stampa
	Init_stampaRicetta(call_Tipo);
	
	//Chiusura Worklist
	chiudi();
}


/*Pulsante Ricetta Bianca*/
function Ricetta_Bianca(){	
	var call_Progressivo= getURLParam("WKPROGRESSIVO");
	var call_Tipo= getURLParam("WKTIPO");
	var ar_TipoRicetta= null;
	var ar_IdenTestata = null;
	var reparto		= baseGlobal.SITO; 			
	var funzione	= 'RICETTA_BIANCA';	
	var anteprima	= 'N';
	var stampante = "";
	var sf = "";	
	ar_TipoRicetta=document.getElementById('frameRicette').contentWindow.array_tipo_ricetta;
	ar_IdenTestata=document.getElementById('frameRicette').contentWindow.array_iden_testata;

	//Ricerca ricetta da stampare
	for (var i=0;i<ar_TipoRicetta.length;i++){
		if (ar_TipoRicetta[i]=='B') {
			sf = '&prompt<pIdenTestata>='+ar_IdenTestata[i];	
			/*imposto la stampante dedicata e se non c'� ne imposto la visualizzazione dell'anteprima*/
			stampante = basePC.PRINTERNAME_REF_CLIENT;	
			if (stampante == null){anteprima = 'S';}
			//esecuzione stampa..
			StampaRicetta(funzione,sf,anteprima,reparto,stampante);	
		}
		
	}	
	//Chiusura Worklist
	chiudi();
}


function RicettaConf(){	

	var call_Progressivo= getURLParam("WKPROGRESSIVO");
	var call_Tipo= getURLParam("WKTIPO");
	//Aggiornamento record Stato
	var sqlconf = " STATO  = 'C' ";
	set_Ricette(call_Progressivo, sqlconf);
	chiudi();
}


function Ricetta_Modifica(){	
	var call_Progressivo= getURLParam("WKPROGRESSIVO");
	var call_Tipo= getURLParam("WKTIPO");
	
	//Cancellazione Logica dei Record
	var sqldel = " STATO  = 'E' ";
	set_Ricette(call_Progressivo, sqldel);
	
	//Apertura Ricetta con dati precedentemente inseriti.
	var Tipo_Scheda="RICETTA_PRESTAZIONI";
	if (call_Tipo == "P"){ Tipo_Scheda="RICETTA_PRESTAZIONI";}
	else if (call_Tipo == "F"){ Tipo_Scheda="RICETTA_FARMACI";}
	var url="servletGenerator?KEY_LEGAME="+Tipo_Scheda+"&SITO=LOAD&idenprogressivo="+call_Progressivo+"";
	if ($("#PROV").val()!="") { url+="&PROV=AMB";}
	window.location.replace(url);
//	window.scrollTo();
/*	var finestra = window.open("servletGenerator?KEY_LEGAME="+Tipo_Scheda+"&SITO=LOAD&idenprogressivo="+call_Progressivo+"","","status=yes, scrollbars=yes, fullscreen=yes", true);*/
	//Chiusura Worklist
	//chiudi();
}


function set_Ricette(Progressivo, sqlfield)
{
	if (Progressivo!=null){
		var sql="update VIEW_RR_TESTATA set "+sqlfield+" where PROGRESSIVO="+Progressivo;
		dwr.engine.setAsync(false);
		toolKitDB.executeQueryData(sql, callback);	
		dwr.engine.setAsync(true);	
	}
	function callback(){}
}


function Init_stampaRicetta(tipo){	
	var arrayTipoRicetta = null;
	var arrayIdenTestata = null;
	var reparto		= baseGlobal.SITO; 							
	var funzione	= 'RICETTA_ROSSA_PRESTAZIONI';		
	var anteprima	= 'N';
	var stampante = "";
	var sf = "";
	
	if (tipo!=null) {
		arrayTipoRicetta=document.getElementById('frameRicette').contentWindow.array_tipo_ricetta;
		arrayIdenTestata=document.getElementById('frameRicette').contentWindow.array_iden_testata;
	
		for (var i=0;i<arrayTipoRicetta.length;i++){
			//alert('step 1 a');
			if (arrayTipoRicetta[i]=='P')
			{
				funzione="RICETTA_ROSSA_PRESTAZIONI";
				sf = '&prompt<pIdenTestata>='+arrayIdenTestata[i];
				/*imposto la stampante dedicata e se non c'� ne imposto la visualizzazione dell'anteprima*/
				stampante = basePC.PRINTERNAME_RICETTA_ROSSA;
				StampaRicetta(funzione,sf,anteprima,reparto,stampante);
			}		
			else if (arrayTipoRicetta[i]== "F") 
			{ 
				funzione="RICETTA_ROSSA_FARMACI";
				sf = '&prompt<pIdenTestata>='+arrayIdenTestata[i];	
				/*imposto la stampante dedicata e se non c'� ne imposto la visualizzazione dell'anteprima*/
				stampante = basePC.PRINTERNAME_RICETTA_ROSSA;	
				StampaRicetta(funzione,sf,anteprima,reparto,stampante);
			}
			else
			{ 
				funzione="RICETTA_BIANCA";
				sf = '&prompt<pIdenTestata>='+arrayIdenTestata[i];
				/*imposto la stampante dedicata e se non c'� ne imposto la visualizzazione dell'anteprima*/
				stampante = basePC.PRINTERNAME_REF_CLIENT;					
				StampaRicetta(funzione,sf,anteprima,reparto,stampante);		
			}	
		}
	}	
}



function StampaRicetta(funzione,sf,anteprima,reparto,stampante){
	
	if (basePC.USO_APPLET_STAMPA=='S' && (funzione =="RICETTA_ROSSA_PRESTAZIONI" || funzione =="RICETTA_ROSSA_FARMACI" )){
/* Aggiunta modifica per la stampa da applet
 * Per le funzioni RICETTA_ROSSA_PRESTAZIONI e RICETTA_ROSSA_FARMACI(se USO_APPLET_STAMPA = 'S'), utilizzo l'applet di stampa e ricreo 
 * il path per la stampa, passando direttamente da servlet stampe
 */ 
		var wnd;
		var opzioniStampa;
		if (top.name == 'schedaRicovero'){
			wnd = top;
			opzioniStampa = wnd.opener.NS_PRINT.ricette.getConfigurazione();
		}else{
			wnd = top.opener.top
			opzioniStampa = wnd.NS_PRINT.getOption();
		}	
		var url = getAbsolutePath()+'ServletStampe?';
		url += 'report='+ wnd.NS_PRINT.confStampe[funzione];
		url += sf;

		var ritorno = wnd.NS_PRINT.print({
			url:url,
			stampante:stampante,
			opzioni:opzioniStampa
			
		})

		if (ritorno && top.name == 'schedaRicovero'){
			wnd.visualizzaWorklistRicette();
		}
		
		if (!ritorno){
			return ('Contattare Assistenza. Riscontrato problema con applet di stampa')
		}
		
	}else{
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
			
		if(finestra){ finestra.focus(); }
	    else{ var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	    }
	}
}



function chiudi(){
	
	if(top.name == 'schedaRicovero'){
		
//		location.replace("blank.htm");
	}else{
		
		try{
			opener.parent.applica_filtro();
			self.close();
		}catch (e){
			
			try{
				parent.self.close();
			}catch(e){
				self.close();
			}
		}
	}
}		
	

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

function getAbsolutePath()
{
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}