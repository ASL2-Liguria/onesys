
try { parent.removeVeloNero('oIFWk'); } catch (e) {}

var idInfoLayerAboutPat = "idInfoLayerAboutPat";
var idInfoLayerAboutPatInner = "idInfoLayerAboutPatInner";
var idInfoLayerAboutPatShadow = "idInfoLayerAboutPatShadow";
var bolCreatedInfoPatLayer = false;
var clientx ;
var clienty ;

$(document).ready(function(){
	window.WindowHome = window;
	while((window.WindowHome.name != 'Home' || window.WindowHome.name != 'schedaRicovero') && window.WindowHome.parent != window.WindowHome){	
		window.WindowHome = window.WindowHome.parent;
    }

	window.baseReparti 	= WindowHome.baseReparti;
	window.baseGlobal 	= WindowHome.baseGlobal;
	window.basePC 		= WindowHome.basePC;
	window.baseUser 	= WindowHome.baseUser;
	
});

//funzione legata al pulsante del menu contestuale della wk delle consulenze
function accettaConsulenza(){
	var statementFile = "OE_Consulenza.xml";
	var statementName = "consulenze.setAccettato";
	
	//var idenConsulenza = stringa_codici(array_iden);
	var idenTestata = stringa_codici(array_iden_testata);
	var utente = baseUser.IDEN_PER;
	var stato_richiesta = stringa_codici(array_stato_richiesta);
	
	if (stato_richiesta=="") {
		return alert('Effettuare una selezione');
	}
	
	//var parameters = [idenConsulenza, idenTestata, utente];
	var parameters = [idenTestata, utente];
	
	//controllo se è già accettata e se è prenotata
	if (stato_richiesta!='I'){

		alert('Attenzione! La consulenza risulta già ACCETTATA.\n\nImpossibile eseguire l\'operazione richiesta');
		return;
	}
	
	var vResp = top.executeStatement(statementFile,statementName,parameters);
	
	if (vResp[0]=='OK'){
		parent.FILTRO_WK_CONSULENZE.applica_filtro_consulenze();
	}else{
		var msg = 'Errore nell\'accettazione della consulenza\n\n'+vResp[1];
		return alert(msg);
	}
}

//funzione legata al pulsante del menu contestuale della wk delle consulenze
function annullaAccettazione(){
	var statementFile = "OE_Consulenza.xml";
	var statementName = "consulenze.annullaAccettato";
	
	//var idenConsulenza = stringa_codici(array_iden);
	var idenTestata = stringa_codici(array_iden_testata);
	var utente = baseUser.IDEN_PER;
	var stato_richiesta = stringa_codici(array_stato_richiesta);
	
	if (stato_richiesta=="") {
		return alert('Effettuare una selezione');
	}	
//	var parameters = [idenConsulenza, idenTestata, utente];
	var parameters = [ idenTestata, utente,'ANNULLA_ACC'];

	//controllo se è già accettata e se è prenotata
	if (stato_richiesta =='I'){

		alert('Attenzione! Impossibile annullare l\'accettazione di una richiesta non ancora accettata!');
		return;
	}else if (stato_richiesta!='A' && stato_richiesta!='I'){
		alert('Attenzione! Impossibile annullare l\'accettazione di una richiesta già eseguita o refertata!');
		return;
	}
	
	if(!confirm('Si vuole annullare l\'accettazione della consulenza selezionata?')){return;}

	var vResp = top.executeStatement(statementFile,statementName,parameters);
	
	if (vResp[0]=='OK'){
		parent.FILTRO_WK_CONSULENZE.applica_filtro_consulenze();
	}else{
		var msg = 'Errore nell\'annullamento accettazione della consulenza\n\n'+vResp[1];
		return alert(msg);
	}
}



function apriCartella(num_min,obj) {
    var riga            = setRiga(obj);
    var stato_richiesta = array_stato_richiesta[riga];
    var iden_visita 	= array_iden_visita[riga];
    var	idenTes 	= array_iden_testata[riga];
    var parameters 	= new Array();
    var modalita;
    
    parameters.push(idenTes);
    parameters.push(iden_visita);
	parameters.push(num_min);
    
    var statementFile = "OE_Consulenza.xml";
    var statementName = "consulenze.logoFisio.aperturaCartella";
    
    if(baseUser.TIPO == 'I'){
    	return alert('Funzionalit� non disponibile');
    }
    if ((baseUser.TIPO == 'M' && baseUser.TIPO_MED == 'F') || baseUser.TIPO == 'L' || baseUser.TIPO == 'F' || baseUser.TIPO == 'D' || baseUser.TIPO == 'AS') {
        // trova la data e confrontala
        var vResp = top.executeStatement(statementFile,statementName,parameters,1);
        if (vResp[0] == 'OK') {
            switch (vResp[2].split('|')[0]) {
                case 'OK':
           		 if(baseUser.TIPO!='AS'){
           			if(typeof (array_tipologia)!='undefined' && array_tipologia[riga]=='14'){
    		        	modalita 	= 'PRESA_IN_CARICO';
    		        }
    		       else{
    		    	   modalita="CONSULENZA";
    		       }
        		 }
        		 else{
        			 modalita="CONSULENZA_ASSISTENTE_SOCIALE";
        		 }
                    top.NS_CARTELLA_PAZIENTE.apri({
                      iden_evento         : array_iden_visita[riga],
                      funzione            : "apriVuota();",
                      ModalitaAccesso    : modalita
                    });
                    break;
                default:
					alert(vResp[2].split('|')[1]);
            }
        } else return alert(vResp[1]);
    } else {	
        if (stato_richiesta == 'R' && parseInt(num_min) > 360) {
            alert('Cartella Bloccata: superate limite massimo di ore!');
            return;
	} else {
		 if(baseUser.TIPO!='AS'){
    			if(typeof (array_tipologia)!='undefined' && array_tipologia[riga]=='14'){
		        	modalita 	= 'PRESA_IN_CARICO';
		        }
		       else{
		    	   modalita="CONSULENZA";
		       }
		 }
		 else{
			 modalita="CONSULENZA_ASSISTENTE_SOCIALE";
		 }
            top.NS_CARTELLA_PAZIENTE.apri({
                iden_evento         : array_iden_visita[riga],
                funzione            : "apriVuota();",
                ModalitaAccesso    : modalita
            });
        }
    }
}



function apriConsolleRefertazione(tipo){
	if (controllaRichiestaAnnullata())
		return;
	if (controllaRefertoAnnullativo())
		return;
	if (controllaTipoUtente())
		return;
	
	var statementFile = "OE_Consulenza.xml";
	var statementName = "consulenze.setAccettato";
	var funzione 	= 'CONSULENZE_REFERTAZIONE';
	
/*   var consenso = checkConsensoDocumento(stringa_codici(array_iden_testata),funzione);
   if (consenso){
       apriRegistrazioneConsenso();
   }else{*/

        //var idenEsa 	= stringa_codici(array_iden);
        var stato_richiesta = stringa_codici(array_stato_richiesta);

        var idenTes 	= stringa_codici(array_iden_testata);
        var utente		= baseUser.IDEN_PER;
        var tabPerTipo	= baseUser.TIPO;
        var datiPaz 	= stringa_codici(array_paziente);
        var repProv		= stringa_codici(array_cdc_rep_prov);
        var idenVis 	= stringa_codici(array_iden_visita);
        var idenAna 	= stringa_codici(array_iden_anag);
        var nosolog 	= retrieveNumNosologico(idenVis);
        var idenRef 	= stringa_codici(array_iden_ref);
        var repDest 	= stringa_codici(array_cdc_dest);
        var idRemoto	= stringa_codici(array_id_remoto);

        var parameters = [idenTes, utente];
        
        if(typeof (array_tipologia)!='undefined' && stringa_codici(array_tipologia)=='14'){
        	if(baseUser.TIPO_MED!='F'){
        		return alert('Funzionalit� riservata al personale fisiatrico');
        	}
        	funzione 	= 'PRESA_IN_CARICO';
        }
        if (stato_richiesta == 'I'){/*Consulenza ancora da accettare*/

            var vResp = top.executeStatement(statementFile,statementName,parameters);

            if (vResp[0]=='OK'){
                try {parent.FILTRO_WK_CONSULENZE.applica_filtro_consulenze()} catch(e){};
                try {parent.FILTRO_WK_PRESAINCARICO.applica_filtro_presaincarico()} catch(e){};
            }else{
                var msg = 'Errore nell\'accettazione della consulenza';
                return alert(msg);
            }
        }


        if (idenAna=="") {
            return alert('Effettuare una selezione');
        }

        //var url = 'srvRefConsulenze?paziente='+datiPaz+
        var url = 	'servletGeneric?class=refertazioneConsulenze.refertazioneConsulenzeEngine'+
                    '&paziente='+datiPaz+
                    '&reparto='+repProv+
                    '&repartoDest='+repDest+
                    '&idenVisita='+idenVis+
                    '&idenAnag='+idenAna+
                    '&ricovero='+nosolog+
                    '&funzione='+funzione+
                    '&idenReferto='+idenRef+
                    '&idenTes='+idenTes+
                    '&idRemoto='+idRemoto+
                    '&tabPerTipo='+tabPerTipo+				
                    '&tipo='+ (typeof tipo=='undefined'?'generic':tipo)+
                    '&abilitaFirma=S'+
                    '&arrivatoDa=WHALE';

        var finestra = window.open(url,'consulenza','fullscreen=yes');

        try{
            top.closeWhale.pushFinestraInArray(finestra);
        }catch(e){
            //alert(e.description);
        }
    //}
}


function apriDiv(tipo,quesito, quadro, descrEsa, descrMed, descrRepDestMed){

	clientx = event.clientX;
	clienty = event.clientY;
	createDivInfoPatLayer();
	setLayerPosition(clienty,clientx);
	setContentLayer(quesito, quadro, descrEsa, descrMed, descrRepDestMed);

}


function apriStampaWorklistConsulenze(){

	var funzione	= 'WK_CONSULENZE_GENERICHE_RICHIESTE';
	var repStampa  	= '';
	var iden_per	= baseUser.IDEN_PER;
	var reparti		= parent.document.getElementById("hRepartiElenco").value;

	reparti=reparti.replace(/\'/g,"");

	if (array_iden_testata.length<1){

		alert('Attenzione, non ci sono consulenze nella worklist');
		return;

	}else{

		sf= "{VIEW_RICHIESTE_WK_REPORT.IDEN} in [" + array_iden_testata  + "]";// and {VIEW_RICHIESTE_WK_REPORT.IDEN_PER}="+iden_per+"&prompt<pRep>="+reparti;
		top.confStampaReparto(funzione,sf,'S',repStampa,null);
	}
}

function apriStampa(obj){
	/*la variabile stato la recupero dall'array stato_referto e dall'array stato_richiesta*/
	var riga = setRiga(obj);
	
	if (retBooleanStato(array_stato_richiesta[riga],array_stato_referto[riga])){
		var url 	 = "ApriPDFfromDB?AbsolutePath="+top.getAbsolutePath()+"&idenVersione="+array_iden_ref[riga];
		var finestra = window.open(url,'','scrollbars=yes,fullscreen=yes');
		try{
			top.closeWhale.pushFinestraInArray(finestra);
		}catch(e){}
		
	}else{
		var funzione 	= 'CONSULENZE_REFERTAZIONE';
		var sf			= '&prompt<pIdenTR>='+array_iden_testata[riga];
		
        if(typeof (array_tipologia)!='undefined' && array_tipologia[riga]=='14'){
        	funzione 	= 'PRESA_IN_CARICO';
        }

		top.confStampaReparto(funzione,sf,'S','',null);
	}
}



//creo livello con le informazioni
//dell'esame al suo interno
function createDivInfoPatLayer(){

	var divInfoLayer;
	var divInfoLayerInner;
	var divInfoLayerShadow;

	try{
		divInfoLayerInner = document.createElement("DIV");
		divInfoLayerInner.id = idInfoLayerAboutPatInner;
		divInfoLayerInner.className = "boxInfoLayer-inner";

		divInfoLayer = document.createElement("DIV");

		try{divInfoLayer.title = 'Dettaglio consulenza';}catch(e){;}

		divInfoLayer.id = idInfoLayerAboutPat;
		divInfoLayer.className = "boxInfoLayer";
		divInfoLayer.appendChild(divInfoLayerInner);
		divInfoLayer.onclick = function(){hideInfoLayerInWorklist();};

		// shadow
		// divInfoLayerShadow = document.createElement("DIV");
		// divInfoLayerShadow.id = idInfoLayerAboutPatShadow;
		// divInfoLayerShadow.className = "boxInfoLayer";

		document.body.appendChild(divInfoLayer);
		// document.body.appendChild(divInfoLayerShadow);
		bolCreatedInfoPatLayer = true;
	}
	catch(e){
		alert("createDivInfoPatLayer " + e.description);
	}
}



// funzione che nasconde livello
// riguardante le info del paziente
function hideInfoLayerInWorklist(){
	hideInfoLayerById(idInfoLayerAboutPat);
	hideInfoLayerById(idInfoLayerAboutPatInner);
	hideInfoLayerById(idInfoLayerAboutPatShadow);
}


function hideInfoLayerById(id){
	var obj = document.getElementById(id);
	if (obj){
		obj.style.visibility = 'hidden';
		obj.id=obj.id + '1';
	}
}


function setContentLayer(quesito, quadro, descrEsa, descrMed, descrRepartoMed){
	
	var obj = document.getElementById(idInfoLayerAboutPatInner);
	var contenutoHtml = "";
	try{
		if(obj){
			// paziente
			contenutoHtml = "<div onclick=\"hideInfoLayerInWorklist()\"></DIV>";
			contenutoHtml += "<table cellspacing='2' width='100%' class='classFormRicPaz' border='0' cellpadding='2'><TBODY>";
			contenutoHtml += "<TR></TR>";
			contenutoHtml += "<TR><td class='TitoloSez'>Esami Richiesti</td></TR>";
			contenutoHtml += "<TR><td class='textDettaglio'>" + descrEsa+"<br /></TD></TR>";
			contenutoHtml += "<TR></TR>";
			contenutoHtml += "<TR></TR>";
			contenutoHtml += "<TR><td class='TitoloSez'>Medico Prescrittore</td></TR>";
			contenutoHtml += "<TR><td class='textDettaglio'>" + descrMed+"<br /></TD></TR>";
			contenutoHtml += "<TR></TR>";
			contenutoHtml += "<TR></TR>";
			contenutoHtml += "<TR><td class='TitoloSez'>Quesito</td></TR>";
			contenutoHtml += "<TR><td class='textDettaglio'>" + quesito+"<br /></TD></TR>";
			contenutoHtml += "<TR></TR>";
			contenutoHtml += "<TR></TR>";
			contenutoHtml += "<TR><td class='TitoloSez'>Quadro Clinico</td></TR>";
			contenutoHtml += "<TR><td class='textDettaglio'>" + quadro +"</TD></TR>";
			contenutoHtml += "<TR></TR>";
			contenutoHtml += "<TR></TR>";
			contenutoHtml += "<TR><td class='TitoloSez'>Reparto Destinatario</td></TR>";
			contenutoHtml += "<TR><td class='textDettaglio'>" + descrRepartoMed +"</TD></TR>";
            contenutoHtml += "</TBODY></TABLE>";
			obj.innerHTML = contenutoHtml;
			obj.style.visibility = 'visible';
		}
	}catch(e){
		alert("setContentLayer - Error: "+ e.description);
	}
}


function setDateFiltri(){
	
	var tDay = new Date();
	var tMonth = tDay.getMonth()+1;
	var tDate = tDay.getDate();
	
	if ( tMonth < 10) tMonth = "0"+tMonth;
	if ( tDate < 10) tDate = "0"+tDate;
	//alert( tDate+"/"+tMonth+"/"+tDay.getFullYear());
	
	document.all['txtDaDataRic'].value = tDate+"/"+tMonth+"/"+tDay.getFullYear();
}



function setLayerPosition(top,left){

	var altezzaDocumento = document.body.offsetHeight;
	var larghezzaDocumento = document.body.offsetWidth;
	var obj = document.getElementById(idInfoLayerAboutPat);

	var posizioneTop;
	var posizioneLeft;

	try{
		if (obj){
			obj.style.visibility = 'visible';
			obj.style.position = "absolute";
			posizioneLeft = left;
			// posizionamento verticale
			if ((top+obj.scrollHeight)>altezzaDocumento){
				if ((top-obj.scrollHeight)>0){
					posizioneTop = document.body.scrollTop+(top-obj.scrollHeight);
					}
				else{
					posizioneTop = document.body.scrollTop
				}

			}
			else{
				posizioneTop = document.body.scrollTop+top;
			}
			// posizionamento orizzontale
			if ((left+obj.scrollWidth)>larghezzaDocumento){
				if ((left-obj.scrollWidth)>0){
					posizioneLeft = document.body.scrollLeft+(left-obj.scrollWidth);
					}
				else{
					posizioneLeft = document.body.scrollLeft
				}

			}
			else{
				posizioneLeft = document.body.scrollLeft+left;
			}
			// ******************************


			obj.style.left = posizioneLeft ;
			obj.style.top = posizioneTop;
		}
		// sposto anche l'ombra
		var objShadow = document.getElementById(idInfoLayerAboutPatShadow);
		if (objShadow){
			//objShadow.style.visibility = 'visible';
			//objShadow.style.position = "absolute";
			//objShadow.style.left = parseInt(posizioneLeft+5);
			//objShadow.style.top =  parseInt(posizioneTop+5);
		}
	}
	catch(e){
		alert("setLayerPosition " + e.description);
	}

}


function setRiga(obj){

        while(obj.nodeName != 'TR'){
          obj = obj.parentNode;
        }
        return obj.sectionRowIndex;
        //return rigaSelezionataDalContextMenu=obj.parentNode.parentNode.parentNode.sectionRowIndex;
}

function aggiungiPrestazione(){
	var stato_richiesta = stringa_codici(array_stato_richiesta);
	if (stato_richiesta == 'I' ){
		var url = 	"servletGenerator?KEY_LEGAME=SCELTA_LISTA_DOPPIA_CONS"+
		"&HIDDEN_IDEN_TESTATA_RICHIESTE="+ stringa_codici(array_iden_testata)+
		"&HIDDEN_CDC_DESTINATARIO="+ stringa_codici(array_cdc_dest)+
		"&HIDDEN_CDC_SORGENTE="+ stringa_codici(array_cdc_rep_prov);						
		top.$.fancybox({
							'padding'	: 3,
							'width'		: 1024,
							'height'	: 260,
							'href'		: url,
							'type'		: 'iframe',
							'showCloseButton'	: false,
				            'onClosed'	:function(){
				            							document.location.reload();
				            						}
		});
	}else{
		alert('Consulenza accettata,impossibile aggiungere nuove prestazioni');
	}		
}


function controllaRefertoAnnullativo(){
	var stato_richiesta	= stringa_codici(array_stato_richiesta);
	var stato_referto	= stringa_codici(array_stato_referto);
	var iden_ref 		= stringa_codici(array_iden_ref);
	var statementFile 	= "OE_Consulenza.xml";
	var statementName 	= "consulenze.controllaRefertoAnnullativo";	
	var parameters 		= [ iden_ref];

	//controllo se è già accettata e se è prenotata
	if (retBooleanStato(stato_richiesta,stato_referto)){
		var vRs = top.executeQuery(statementFile,statementName,parameters);
		
		if (vRs.next()){
			if (vRs.getString("TYPE_FIRMA")=='3')
			{
				alert('Referto Annullativo,impossibile da modificare');
				return true;
			}
		}else{
			return false;
		}
	}else{
		return false;
	}
}

function controllaRichiestaAnnullata(){
	var stato_consulenza = stringa_codici(array_stato_richiesta);
	if (stato_consulenza=='X'){
		alert('Richiesta di Consulenza Annullata: impossibile refertare')
		return true;
	}
	
}
	
function controllaTipoUtente(){
	var tipo_utente = baseUser.TIPO;
	var tipoUtentiPermessi = new Array();
	tipoUtentiPermessi.push('M');
	tipoUtentiPermessi.push('L');
	tipoUtentiPermessi.push('F');
    tipoUtentiPermessi.push('D');
    tipoUtentiPermessi.push('AS');
	
	if ($.inArray(baseUser.TIPO,tipoUtentiPermessi)<0){
		alert('Funzionalit�riservata al personale medico')
		return true;
	}
}

function retrieveNumNosologico(idenVisita){
	var statementFile 	= "OE_Consulenza.xml";
	var statementName 	= "consulenze.retrieveNumNosologico";	
	var parameters 		= [idenVisita];
	
	var vResp = top.executeStatement(statementFile,statementName,parameters,1);
	if (vResp[0]=='OK'){
		return vResp[2];
	}else{
		var msg = 'Errore nel recupero del nosologico';
		return '';
	}
	return;	
}

function retBooleanStato(statoRichiesta,statoReferto){
	if (statoRichiesta == 'R' && statoReferto==1)
		return true;
	else
		return false;
}

/*Da definire per il salvataggio della situazione dell'evento di nosologico
function apriRegistrazioneConsenso(){
    var urlParameters   =  'tabella=INFOWEB.TESTATA_RICHIESTE';
    urlParameters       += '&tipologia_documento=CONSULENZE_REFERTAZIONE';
//    urlParameters       += 'consenso_espresso='+stringa_codici(array_consenso_espresso)+'&';
//    urlParameters       += 'volonta_cittadino='+stringa_codici(array_volonta_cittadino)+'&';
//    urlParameters       += 'per_legge='+stringa_codici(array_per_legge)+'&';    

    urlParameters       += '&statement_to_load=loadConsensoEspressoDocumento';
    urlParameters       += '&iden='+stringa_codici(array_iden_testata);
  
    WindowHome.$.fancybox({
        'padding'	: 3,
        'width'		: 570,
        'height'	: 150,
        'href'		: 'consenso.html?'+urlParameters,
        'type'		: 'iframe',
        'showCloseButton'	: false,
        'onClosed':function(){
            parent.FILTRO_WK_CONSULENZE.applica_filtro_consulenze();
        }
    });
}


function checkConsensoDocumento(iden,funzione){
   var pStatementFile = 'consensi.xml';
    var pStatementStatement = 'loadConsensoEspressoDocumento';
    var pBinds = new Array();
    pBinds.push(iden);
    pBinds.push(funzione);
    var vResp = WindowHome.executeStatement(pStatementFile,pStatementStatement,pBinds,3);
    if (vResp[0]=='OK'){
        if (vResp[2]==null)
            return false;
        else
            return true;
    }else{
        return false;
    }
}*/