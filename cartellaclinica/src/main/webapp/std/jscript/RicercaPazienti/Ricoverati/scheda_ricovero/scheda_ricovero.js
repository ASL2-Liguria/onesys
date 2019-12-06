var attivaConfronto     = false;
var sincronizzaFunzione = false;
var sincronizzaVisita   = false;
var sincronizzaScroll   = false;
var sezioneAttiva ='LEFT'; /* CONSULTAZIONE=frameSX, CONFRONTO=frameDX */

var FunzioniCartella = {
    logger : null
};

/* LINO */
function refreshPage(){utilMostraBoxAttesa(false);}
/*FRA*/
function apriDefault(){apriVuota();}

/* FRA */
function Abstract(pParam){// {RefreshFunction,GetUrlFunction,CodFunzione[,DescrFunzione][,CheckDisponibilita][,CheckFiltroLivello][,CheckFiltroData][,AbilitaVersioni][,Destinazione]}
    try{

        FunzioniCartella.logger.info(pParam.CodFunzione);

        if(!DatiNonRegistrati.check())
            return;

        utilMostraBoxAttesa(true);

        if(typeof pParam.RefreshFunction 	!= 'function'){
            alert('RefreshFunction non è definita');
            return utilMostraBoxAttesa(false);
        }
        if(typeof pParam.GetUrlFunction 	!= 'function'){
            alert('GetUrlFunction non è definita');
            return utilMostraBoxAttesa(false);
        }
        if(typeof pParam.CodFunzione 		== 'undefined'){
            alert('Funzione non è definita');
            return utilMostraBoxAttesa(false);
        }

        if(typeof pParam.CheckDisponibilita == 'undefined' || pParam.CheckDisponibilita == null)
            pParam.CheckDisponibilita = true;

        if(typeof pParam.CheckFiltroLivello == 'undefined' || pParam.CheckFiltroLivello == null)
            pParam.CheckFiltroLivello = true;

        if(typeof pParam.CheckFiltroData 	== 'undefined' || pParam.CheckFiltroData == null)
            pParam.CheckFiltroData = false;

        if(typeof pParam.CheckFiltroNrRichieste  == 'undefined' || pParam.CheckFiltroNrRichieste == null)
            pParam.CheckFiltroNrRichieste = false;

        if(typeof pParam.DatiObbligatori	== 'undefined' )
            pParam.DatiObbligatori = {
                IDEN_VISITA		:	{
                    lst:['iden_visita'],
                    callBack:function(){
                        openMenuAccessi();
                        utilMostraBoxAttesa(false);
                    }
                },
                NUM_NOSOLOGICO	:	{
                    lst:['iden_ricovero'/*,'ricovero'*/],
                    callBack:function(){
                        openMenuRicoveri();
                        utilMostraBoxAttesa(false);
                    }
                },
                ANAG_REPARTO	:	{
                    lst:['iden_anag','reparto'],
                    callBack:function(){
                        openMenuReparti();
                        utilMostraBoxAttesa(false);
                    }
                },
                IDEN_ANAG		:	{
                    lst:['iden_anag'],
                    callBack:function(){}
                }
            };

        if(typeof pParam.DescrFunzione 		== 'undefined' || pParam.DescrFunzione == null)
            pParam.DescrFunzione = "";

        if(typeof pParam.Destinazione		== 'undefined')
            pParam.Destinazione = 'FRAME';
        if(typeof pParam.InfoRegistrazione	== 'undefined')
            pParam.InfoRegistrazione = false;


        CartellaPaziente.setFunzione(pParam.CodFunzione);
        DatiNonRegistrati.set(false);

        if(typeof pParam.AbilitaVersioni != 'undefined' && pParam.AbilitaVersioni){
            $('div.btnMenuVersioni').show();
        }else{
            $('div.btnMenuVersioni').hide();
        }

        function loadFrame(pFrame,pDati){

            FunzioniCartella.logger.debug('loadFrame');
            Labels.setFunzione(pParam.DescrFunzione);
            if(pParam.InfoRegistrazione){
                InfoRegistrazione.show();
            }else{
                InfoRegistrazione.hide();
            }

            FunzioniCartella.logger.debug('CheckDisponibilita');
            if(pParam.CheckDisponibilita){
                if(!ModalitaCartella.isDisponibile(pDati)){
                    alert("Funzionalita' '" + pParam.DescrFunzione + "' non disponibile per la selezione effettuata");
                    return apriDefault();
                }
            }
            FiltroCartella.check();
            
            FunzioniCartella.logger.debug('CheckFiltroLivello');
            
            
            if(pParam.CheckFiltroLivello){
            	FiltroCartella.checkFiltroLivello(pDati);
                if(typeof pParam.DatiObbligatori[FiltroCartella.getLivelloValue()] != 'undefined'){

                    for(var i=0 ; i< pParam.DatiObbligatori[FiltroCartella.getLivelloValue()].lst.length ; i++){

                        var key = pParam.DatiObbligatori[FiltroCartella.getLivelloValue()].lst[i];
                        var value = pDati[key];

                        if(value == null || value ==''){
                            return pParam.DatiObbligatori[FiltroCartella.getLivelloValue()].callBack();
                        }
                    }

                }

            }else{
            	FiltroCartella.disableFiltroLivello(pDati);
            }
            FunzioniCartella.logger.debug('CheckFiltroData');
            // Check Fitro Da data/A Data
            if(pParam.CheckFiltroData){
                FiltroCartella.checkFiltroDaData();
                FiltroCartella.checkFiltroAData();
            }else{
                FiltroCartella.disableFiltroData(pDati);
            }

            // Check Filtro Numero Richieste
            if(pParam.CheckFiltroNrRichieste){
                FiltroCartella.checkFiltroNrRecords();
            }else{
                FiltroCartella.disableFiltroNrRecords(pDati);
            }

            var url = pParam.GetUrlFunction(pDati,pFrame);

            if(url== null || url == '')return;
            FunzioniCartella.logger.debug('switch Destinazione');

            // Inserisce il parametro CONTROLLO_ACCESSO come primo parametro della url
            var url_match = url.match(/^([^\?]+\?)\&?([\s\S]*)/);
            if (url_match) url = url_match[1]+"CONTROLLO_ACCESSO="+CartellaPaziente.getAccesso('IDEN')+'&'+url_match[2];
            
            switch(pParam.Destinazione){
                case 'FRAME' :
                    pFrame.src = url;
                    /*serve per gestire il refresh della funzione con il cambio paziente attraverso le frecce
                     e ovunque ci siano funzioni in frame annidati*/
                    refreshPage = pParam.RefreshFunction;
                    break;
                case 'FANCYBOX':
                    $.fancybox({
                        'padding'	: 3,
                        'width'		: document.body.offsetWidth/10*9,
                        'height'	: document.body.offsetHeight/10*8,
                        'href'		: url,
                        'type'		: 'iframe',
                        'hideOnOverlayClick':false,
                        'hideOnContentClick':false
                    });
                    break;
                default:
                    if(typeof pParam.Destinazione.location == 'undefined'){
                        alert('Destinazione pagina non valida');
                        return utilMostraBoxAttesa(false);
                    }
                    pParam.Destinazione.location.replace(url);
                    break;
            }
            
            //$('.refreshPage').click(refreshPage);
        }
		
        if(sezioneAttiva=='LEFT' ||  sincronizzaFunzione){
            loadFrame(ifLeft,getForm());
        }
        if(sezioneAttiva=='RIGHT' 	  ||  (attivaConfronto && sincronizzaFunzione)){
            loadFrame(ifRight,getForm());
        }

        //commentato e spostato nello switch(pParam.Destinazione)
        //refreshPage = pParam.RefreshFunction;


    }catch(e){
        FunzioniCartella.logger.error(e.message);		
        		
		ifLeft.src = "errore_cartella.htm";
		ifRight.src = "errore_cartella.htm";
        
		CartellaPaziente.clean.All();
        CartellaPaziente.createLogButton();
				
		utilMostraBoxAttesa(false);
    }

}

/* FRA */
function apriAnagrafica(){
    var finestra = window.open("servletGenerator?KEY_LEGAME=SCHEDA_ANAGRAFICA&IDEN_ANAG="+getPaziente("IDEN")+"&READONLY=" +ModalitaCartella.isReadonly(),"","fullscreen=yes");
    
    try{
        opener.top.closeWhale.pushFinestraInArray(finestra);
		}
    catch(e){}
    
    // window.open("servletGeneric?class=configurazioneReparto.interfaccia.Header","","fullscreen=yes")
    // alert(baseReparti.getValue('SP_OSTET','STAMPA_ANAMNESI'));
    // ifLeft.src = "ProvaAlbero.html";
}

/* MATTEO P */
function apriAssociazioneDatiAccesso(){

    Abstract({
        RefreshFunction:apriAssociazioneDatiAccesso,
        CodFunzione:"ASSOCIA_DATI",
        DescrFunzione:"Associazione Dati",
        GetUrlFunction:getUrlAccessi
    });


    function getUrlAccessi(pDati){
        var url = "servletGeneric?"
                + "class=it.elco.whale.GestioneDatiSanitari.AssociazioneDatiAccesso"
                + "&IdenRicovero="+ pDati.iden_ricovero
                + "&IdenAnag="+ pDati.iden_anag
            ;
        return url;
    }
}

function apriAssociazioneDatiRicovero(){

    Abstract({
        RefreshFunction:apriAssociazioneDatiAccesso,
        CodFunzione:"ASSOCIA_DATI",
        DescrFunzione:"Associazione Dati",
        GetUrlFunction:getUrlRicoveri
    });


    function getUrlRicoveri(pDati){
        var url = "servletGeneric?"
                + "class=it.elco.whale.GestioneDatiSanitari.AssociazioneDatiRicovero"
                + "&IdenRicovero="+ pDati.iden_ricovero
                + "&IdenAnag="+ pDati.iden_anag
            ;
        return url;
    }

}

/* FRA */
function apriBckScheda(pFunzione,pKeyLegame,pKeyId,pIdenVisita,pVersione,pSito){
    utilMostraBoxAttesa(true);
    var url = 'servletGenerator?KEY_LEGAME='+pKeyLegame;
    url += '&FUNZIONE='+pFunzione;
    url += '&KEY_ID='+pKeyId;
    url += '&IDEN_VISITA='+pIdenVisita;
    url += '&VERSIONE='+pVersione;
    url += '&SITO='+pSito;
    url += '&IDEN_ANAG='+datiIniziali.iden_anag;
    var iframe = getFrame();
    iframe.src= url;
}

/* ARRY */
function apriDatiPS() {

    Abstract({
        RefreshFunction : apriDatiPS,
        CodFunzione     : "DATI_PS",
        DescrFunzione   : "Dati PS",
        GetUrlFunction  : getUrlDatiPs
    });

    function getUrlDatiPs(pDati) {
        var url = "servletGenerator?KEY_LEGAME=DATI_PS_ONESYS&COD_FISC=" + pDati.idRemoto;
        url += "&DEA_PS_IDEN="  + pDati.dea_str;
        url += "&DEA_ANNO="     + pDati.dea_anno;
        url += "&DEA_NUMR="     + pDati.dea_cartella;
        url += "&IDEN_VISITA="  + pDati.iden_ricovero;
       
        return url;
    }
}

 //DARIO 
function apriDocumentiPaziente(pParametri){

	Abstract({
		RefreshFunction:function(){apriDocumentiPaziente(pParametri);},
		CodFunzione:"DOCUMENTI_PAZIENTE",
		DescrFunzione:"Documenti paziente",
		GetUrlFunction:getUrl
	});

/*	function getUrl(pDati){
        param={
            emergenza_medica: getPaziente('EMERGENZA_MEDICA'),
            opener:'cartella',
			heigntCartella:$('div.header').height()+$('div#AlberoConsultazione').height()
        };

        utilMostraBoxAttesa(false);
        return WindowCartella.NS_CONSENSI.gestioneAperturaDocumenti(param);
    }*/
	
	function getUrl(pDati){
		var url = "servletGenerator?KEY_LEGAME=VISDOC";
		url += "&idPatient="+pDati.idRemoto;
		if(pDati.cod_dec_Reparto!=''){
			url += "&reparto="+pDati.cod_dec_Reparto;
		}
		else{
			url+="&reparto="+baseUser.LISTAREPARTIUTENTECODDEC[0];
		}

		if (pParametri!=undefined){
			if (pParametri.identificativoEsterno!=undefined){
				url += "&identificativoEsterno="+pParametri.identificativoEsterno;		
			}	
			if (pParametri.reparto!=undefined){
				url += "&reparto="+pParametri.reparto;
			}	
			if (pParametri.LETTERE!=undefined){
				url += "&LETTERE="+pParametri.LETTERE;
			}	
		}
		
		/*Aggiungo controllo parametri privacy*/
		var repartoPar=getReparto("COD_CDC")!=''? getReparto("COD_CDC"):baseUser.LISTAREPARTI[0];
		var modalitaAccesso; try { modalitaAccesso = document.EXTERN.ModalitaAccesso.value; } catch(e) { modalitaAccesso = baseUser.MODALITA_ACCESSO || 'REPARTO'; }

		 eval('var privacy = ' + baseReparti.getValue(repartoPar,'ATTIVA_PRIVACY'));
        if(privacy.WK_DOC.ATTIVA=='S'){
        	url += "&COD_DEC="+baseUser.COD_DEC;
	        url += "&COD_FISC="+$("form[name='frmPaziente'] input[name='COD_FISC']").val();
	        url += "&PREDICATE_FACTORY=" + encodeURIComponent(privacy.WK_DOC.PREDICATE_FACTORY);
	        url += "&BUILDER=" + encodeURIComponent(privacy.WK_DOC.BUILDER);
	        url += "&SET_EMERGENZA_MEDICA="+getPaziente("EMERGENZA_MEDICA");       
	        url += "&QUERY=getListDocumentPatient";
	        url += "&TIPOLOGIA_ACCESSO="+modalitaAccesso;
	        url += "&EVENTO_CORRENTE="+getRicovero("NUM_NOSOLOGICO");	        
        }else{
        	url += "&COD_DEC=";
	        url += "&COD_FISC=";
	        url += "&PREDICATE_FACTORY=";
	        url += "&BUILDER=";
	        url += "&SET_EMERGENZA_MEDICA=";       
	        url += "&QUERY=";
	        url += "&TIPOLOGIA_ACCESSO=";
	        url += "&EVENTO_CORRENTE=";	
        }		


        url+="&ID_REMOTO=" +pDati.idRemoto; 
		return url;
		}
	
}

//FRA
function apriErrore(){

    Abstract({
        RefreshFunction:apriErrore,
        CodFunzione:'ERRORE',
        DescrFunzione:"Errore",
        CheckFiltroLivello:false,
        GetUrlFunction:getErrore
    });

    function getErrore(pDati){
        CartellaPaziente.clean.All();
        CartellaPaziente.createLogButton();
        utilMostraBoxAttesa(false);
        return "errore_cartella.htm";
    }


}

// LUCA
function apriListaRicoveri (){

    if(sezioneAttiva=='RIGHT' 	  ||  (attivaConfronto && sincronizzaFunzione))	{
        ifRight.src = "ricercaNosologici?idenAnag=" + datiRight.iden_anag;
        FiltroCartella.off(datiRight);
    }
    if(sezioneAttiva=='LEFT' 	  ||  (attivaConfronto && sincronizzaFunzione))	{
        ifLeft.src = "ricercaNosologici?idenAnag=" + datiLeft.iden_anag;
        FiltroCartella.off(datiLeft);
    }
}

// ARRY la funzione apre i PT su un altra webapp
function apriPianiTerapeutici(tipo){

    Abstract({
        RefreshFunction:function(){apriPianiTerapeutici(tipo);},
        CodFunzione:"PT",
        DescrFunzione:"Piani Terapeutici",
        CheckFiltroLivello:false,
        GetUrlFunction:getUrl
    });

    function getUrl(pDati){

        // Mi ricavo il path per il redirect della webapp
        /*urlString = top.getAbsolutePath();
        urlString = urlString .substring(0,(urlString .length-1));
        urlString = urlString .substring(0,urlString .lastIndexOf('/')) ;

        var url = urlString +'/RrPt/autoLogin?';
        url += "utente="+baseUser.LOGIN;
        url += "&postazione="+basePC.IP;
        url += "&pagina=INSERIMENTO_PT";
        url += "&idRemoto="+pDati.idRemoto;
        url += "&reparto="+pDati.reparto;*/
    	url = "servletGenerator?KEY_LEGAME=GESTIONE_PIANI_TERAPEUTICI&TIPO="+tipo+"&idRemoto="+pDati.idRemoto+"&utente="+baseUser.LOGIN+"&reparto="+pDati.reparto;
     /*   if(tipo=='VISUALIZZA'){
        	url+='&CONTEXT_MENU=WK_PT_VISUALIZZA';
        }*/
    	url = top.NS_APPLICATIONS.switchTo('RR_PT',url);

        return url;
    }
}

// ARRY
function apriRicettaFarmaci(){

    Abstract({
        RefreshFunction:apriRicettaFarmaci,
        CodFunzione:"RR_RICETTA_ROSSA_FARMACI",
        DescrFunzione:"Ricetta Rossa Farmaci",
        CheckFiltroLivello:false,
        GetUrlFunction:getUrl
    });

    function getUrl(pDati){

        // Mi ricavo il path per il redirect della webapp
        /*urlString = top.getAbsolutePath();
         urlString = urlString .substring(0,(urlString .length-1));
         urlString = urlString .substring(0,urlString .lastIndexOf('/')) ;

         var url = urlString +'/RrPt/autoLogin?';
         url += "utente="+baseUser.LOGIN;
         url += "&postazione="+basePC.IP;
         url += "&pagina=INSERIMENTO_RR_FARMACI";
         url += "&idRemoto="+pDati.idRemoto;*/
        var url = '';
    	if (false && typeof (document.EXTERN.pagina)!='undefined' && typeof (document.EXTERN.pagina.value)!='undefined' && document.EXTERN.pagina.value==='CARTELLAAMBULATORIO')
    	{
            alert('Scheda non configurata per la selezione effettuata');
    		url = "blank.htm";
    	}else{
    		url = 'servletGenerator?KEY_LEGAME=RICETTA_FARMACI&idRemoto='+pDati.idRemoto+'&utente='+baseUser.LOGIN;        
    		url = top.NS_APPLICATIONS.switchTo('RR_PT',url);     
    	}
        return url;
    }
	utilMostraBoxAttesa(false);
}

// ARRY
function apriRicettaPrestazioni(){

    Abstract({
        RefreshFunction:apriRicettaPrestazioni,
        CodFunzione:"RR_RICETTA_ROSSA_PRESTAZIONI",
        DescrFunzione:"Ricetta Rossa Prestazioni",
        CheckFiltroLivello:false,
        GetUrlFunction:getUrl     
    });

    function getUrl(pDati){

        // Mi ricavo il path per il redirect della webapp
        /*urlString = top.getAbsolutePath();
         urlString = urlString .substring(0,(urlString .length-1));
         urlString = urlString .substring(0,urlString .lastIndexOf('/')) ;

         var url = urlString + '/RrPt/autoLogin?';
         url += "utente="+baseUser.LOGIN;
         url += "&postazione="+basePC.IP;
         url += "&pagina=INSERIMENTO_RR_PRESTAZIONI";
         url += "&idRemoto="+pDati.idRemoto;	*/
        var url = '';
    	if (false && typeof (document.EXTERN.pagina)!='undefined' && typeof (document.EXTERN.pagina.value)!='undefined' && document.EXTERN.pagina.value==='CARTELLAAMBULATORIO')
    	{
            alert('Scheda non configurata per la selezione effettuata');
    		url = "blank.htm";
    	}else{
    		url = 'servletGenerator?KEY_LEGAME=RICETTA_PRESTAZIONI&idRemoto='+pDati.idRemoto+'&utente='+baseUser.LOGIN;
    		url = top.NS_APPLICATIONS.switchTo('RR_PT',url);
    	}
        return url;
    }
	utilMostraBoxAttesa(false);
}


// GRAZIA
function visualizzaWorklistRicette(){

    Abstract({
        RefreshFunction:visualizzaWorklistRicette,
        CodFunzione:"WORKLIST_RICETTE",
        DescrFunzione:"Worlist ricette",
        CheckFiltroLivello:false,
        GetUrlFunction:getUrl     
    });

    function getUrl(pDati){

        // Mi ricavo il path per il redirect della webapp
        /*urlString = top.getAbsolutePath();
         urlString = urlString .substring(0,(urlString .length-1));
         urlString = urlString .substring(0,urlString .lastIndexOf('/')) ;

         var url = urlString +'/RrPt/autoLogin?';
         url += "utente="+baseUser.LOGIN;
         url += "&postazione="+basePC.IP;
         url += "&pagina=WORKLIST_RICETTE";
         url += "&idRemoto="+pDati.idRemoto;*/
        var url = '';
    	if (false && typeof (document.EXTERN.pagina)!='undefined' && typeof (document.EXTERN.pagina.value)!='undefined' && document.EXTERN.pagina.value==='CARTELLAAMBULATORIO')
    	{
            alert('Scheda non configurata per la selezione effettuata');
    		url = "blank.htm";
    	}else{
    		url = 'servletGenerator?KEY_LEGAME=RICETTA_WORKLIST_CONFERMATE&WHERE_WK=&idRemoto='+pDati.idRemoto+'&utente='+baseUser.LOGIN;
//        var url = 'Home?load='+encodeURIComponent(decodeurl);
    		url = top.NS_APPLICATIONS.switchTo('RR_PT',url);
    	}
        return url;
    }
    utilMostraBoxAttesa(false);
}

function apriRicettaSpezia(tipo){
    Abstract({
        RefreshFunction:apriRicettaPrestazioni,
        CodFunzione:"RR_RICETTA_ROSSA_SPEZIA",
        DescrFunzione:"Ricetta Rossa Spezia",
        CheckFiltroLivello:false,
        GetUrlFunction:getUrl
    });

    function getUrl(pDati){
        // costruisco il path per il redirect della webapp
        var url = 'http://pvwebsp16:8080/Ricette/CompilaRicetta?';
 
           dataRRSpezia={
    		    COD_FISC:'',
    			COD_REP:''
    		};
        
        sqlBind = new Array();
        sqlBind.push(frmPaziente.IDEN.value);
        sqlBind.push(pDati.cod_dec_Reparto);
        top.dwr.engine.setAsync(false);
        top.dwrUtility.executeStatement('cartellaPaziente.xml','getDatiSpezia',sqlBind,2,cbf_anag);
        top.dwr.engine.setAsync(true);
        
        
        if (dataRRSpezia.COD_FISC==null){
            alert('Manca il codice fiscale del paziente! Impossibile compilare la ricetta');
            utilMostraBoxAttesa(false);
            return '';
        }
        if (dataRRSpezia.COD_REP==null){
            alert('Manca il codice reparto! Impossibile compilare la ricetta');
            utilMostraBoxAttesa(false);
            return '';
        }
        url +='cf='+dataRRSpezia.COD_FISC;
        url += '&reparto='+dataRRSpezia.COD_REP;
        url += '&utente='+baseUser.LOGIN;
        url += '&tipo='+tipo;
        var today = new Date();
        var giorno='0'+today.getDate();giorno =  giorno.substring(giorno.length-2,giorno.length);
        var mese='0'+(today.getMonth()+1);mese =  mese.substring(mese.length-2,mese.length);
        var ore='0'+today.getHours(); ore=  ore.substring(ore.length-2,ore.length);
        var minuti='0'+today.getMinutes(); minuti=  minuti.substring(minuti.length-2,minuti.length);
        var secondi='0'+today.getSeconds(); secondi=  secondi.substring(secondi.length-2,secondi.length);
        var sToday= giorno+"/"+mese+"/"+today.getYear()+' '+ore+"."+minuti+"."+secondi;
        
        url += '&data='+sToday;
        utilMostraBoxAttesa(false);
  //      alert(url);
        return url;
    }

    function cbf_anag(result){
        if (result[0]=='KO'){
        	dataRRSpezia.COD_FISC='';
        	dataRRSpezia.COD_REP='';
        }
        else{
        	dataRRSpezia.COD_FISC=result[2];
        	dataRRSpezia.COD_REP=result[3];
        }
    }
}

/* FRA */
function apriVuota(){

    Abstract({
        RefreshFunction:apriVuota,
        CodFunzione:'EMPTY',
        DescrFunzione:"",
        CheckFiltroLivello:true,
        GetUrlFunction:getBlank
    });

    function getBlank(pDati){
        utilMostraBoxAttesa(false);
        return "blank.htm";
    }

}

/*Lino - solo per Bs*/
function apriWkVisione(){

    Abstract({
        RefreshFunction:apriWkVisione,
        CodFunzione:"ESAMI_IN_VISIONE",
        DescrFunzione:"Esami in Visione",
        Destinazione:'FANCYBOX',
        GetUrlFunction:apriWkVisioneGericos
    });

    function apriWkVisioneGericos(pDati){
    	var url = top.baseGlobal.URL_PRENOTAZIONE + '/autoLogin?USER=' + top.baseUser.LOGIN ;
    	url += '&KEY=VISIONE';
    	url += '&ID_NOSO='+pDati.ricovero;
        return url;
    }
}

/* ARRY @deprecated ?*/
function apriWorklistRicoveri (){
    Abstract({
        RefreshFunction:apriWorklistRicoveri,
        CodFunzione:'WORKLIST_RICOVERI',
        DescrFunzione:"Ricoveri precedenti",
        CheckFiltroLivello:false,
        GetUrlFunction:getUrlWorklistRicoveri
    });

    utilMostraBoxAttesa(false);

    function getUrlWorklistRicoveri(pDati){
        var url = "servletGenerator?KEY_LEGAME=WK_RICOVERI_PRECEDENTI";
        url += "&WHERE_WK= where iden_anag = " + pDati.iden_anag + " and DIMESSO = 'S' and N_RICOVERO NOT LIKE 'S_%25'and ACCESSO = 0 &";
        url += "ModalitaCartella=READONLY";

        return url;
    }
}

/* NUOVA GESTIONE DELLE STAMPE DAL MENU CARTELLA - LINO */
function stampaDalMenuCartella(fnz)
{
	switch(fnz) {
	case 'SCHEDA_RIASSUNTIVA_PRERICOVERO':
		break;
	default:
	    if(document.EXTERN.ModalitaAccesso.value=='CONSULENZA_ASSISTENTE_SOCIALE'){
	        alert("Funzionalita' non disponibile per la selezione effettuata");
	        return;
	    }

	    if (fnz == 'TERAPIA_DOMICILIARE' || fnz == 'TERAPIA_DOMICILIARE_PROSECUZIONE')
	    {
	        if (!checkLetteraFirmata())
	        {
	            alert('ATTENZIONE: si ricorda che per inviare informaticamente la terapia domiciliare alla farmacia è necessario firmare digitalmente la lettera di dimissioni.');
	        }
	    }
	}
	
    var vDati = getForm();
    vDati.funzioneAttiva = fnz;
    if (!ModalitaCartella.isStampabile(vDati)){
        return alert('Stampa non abilitata');
    }
    FiltroCartella.check(vDati);
    /* Richieste e Consulenze Iden Visita*/
//	var sf			= "&prompt<pVisita>="+FiltroCartella.getIdenRiferimento(vDati);
    
    var sf			= "&prompt<pVisita>="+vDati.iden_ricovero;
    if (fnz == 'TERAPIA_DOMICILIARE' || fnz == 'TERAPIA_DOMICILIARE_VISITA')
    {
    	var iden_terapia_associata;
    	var pBinds = new Array();
    	pBinds.push(vDati.iden_ricovero)
    	var rs = executeQuery('terapia_domiciliare.xml','getLetteraFirmata',pBinds);
        if (rs.next()){
            iden_terapia_associata	= rs.getString("iden_terapia_associata");
            bool	= false;
            if (iden_terapia_associata=='' || iden_terapia_associata==null){
            	  confStampaReparto(fnz,sf,'S',vDati.reparto,basePC.PRINTERNAME_REF_CLIENT);              	
            }else{
            	url = "ApriPDFfromDB?idenVersione="+iden_terapia_associata+"&idenVisita=&db=&funzione=LETTERA_FARMACIA&progr=&AbsolutePath="; 
            	var finestra = window.open(url,"finestra","fullscreen=yes scrollbars=no");
            	WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
            }
            WindowCartella.utilMostraBoxAttesa(false);
        }  
    }
    else{
    	  confStampaReparto(fnz,sf,'S',vDati.reparto,basePC.PRINTERNAME_REF_CLIENT);
    }
}

/* LINO */
function stampaTerapieGlobali(fnz,pDati){
    window.utilMostraBoxAttesa(true);
	var vDati = typeof pDati == 'undefined' ? getForm() : pDati;
    vDati.funzioneAttiva = fnz;

    if (!ModalitaCartella.isStampabile(vDati)){
        return alert('Stampa non abilitata');
    }
    FiltroCartella.check(vDati);

    var txtconfermastampa = confirm('Iniziare Processo di Stampa?');
    if (txtconfermastampa==false)
    {
        window.utilMostraBoxAttesa(false);
        return;
    }
    
    var resp = eseguiProceduraTerapieGlobali(vDati);
    if (resp[0]=='KO')
    {
        window.utilMostraBoxAttesa(false);
        return alert('Stampa terapie globali in errore:\n'+resp[1]);
    }
    window.utilMostraBoxAttesa(false);
    var sf = "{TAB_WORK.WEBUSER}='"+baseUser.LOGIN+"' and {TAB_WORK.tipo}='"+vDati.funzioneAttiva+"'  and {TAB_WORK.VALOREN1}="+vDati.iden_ricovero;
    //stampa(fnz,sf,'S',baseReparti.getValue(vDati.reparto,'STAMPA_'+fnz),basePC.PRINTERNAME_REF_CLIENT);
    confStampaReparto(vDati.funzioneAttiva,sf,'S',vDati.reparto,basePC.PRINTERNAME_REF_CLIENT);
}

/* ARRY */
function stampaTabWorkScalaConley()
{
    var vDati = getForm();
    vDati.funzioneAttiva = 'SCALA_CONLEY';
    if (!ModalitaCartella.isStampabile(vDati)){
        return alert('Stampa non abilitata');
    }
    //alert(vDati.iden_visita + ' - ' + vDati.iden_ricovero);
    FiltroCartella.check(vDati);

    //var vResp = executeStatement('stampe.xml','setConley',[baseUser.LOGIN,FiltroCartella.getIdenRiferimento(vDati)]);
    var vResp = executeStatement('stampe.xml','setConley',[baseUser.LOGIN,vDati.iden_ricovero]);

    if(vResp[0]=='KO'){
        return alert('Stampa in errore:\n'+vResp[1]);
    }

    var sf 		   = "&prompt<pVisita>="+vDati.iden_ricovero+ "&prompt<pUser>=" +baseUser.LOGIN;
    confStampaReparto('SCALA_CONLEY',sf,'S',vDati.reparto,basePC.PRINTERNAME_REF_CLIENT);

}

/* NUOVA GESTIONE STAMPA GLOBALE - LINO */
function stampaGlobaleCartella() {
	stampaGlobaleCartellaCore();
	//apriVerificaCompletezza();
}

function stampaGlobaleCartellaCore(args)
{
	switch(typeof args) {
		case 'object': break;
		case 'boolean':
			args = { 'vResp': ['', ''], 'conferma': args}; break;
		default:
			args = { 'vResp': ['', ''], 'conferma': true}; break;
		
	}

    if(document.EXTERN.ModalitaAccesso.value=='CONSULENZA_ASSISTENTE_SOCIALE'){
        alert("Funzionalita' non disponibile per la selezione effettuata");
        return;
    }

    if(!ModalitaCartella.isStampabile()){
        return alert('Stampa non disponibile per per i pazienti dimessi');
    }
    window.utilMostraBoxAttesa(true);

    if (typeof args.conferma!='boolean' || args.conferma==true){
        if (confirm('Iniziare Processo di Stampa?') == false)
        {
            window.utilMostraBoxAttesa(false);
            return;
        }
    }

    /* CONFIGURAZIONE DEL REPARTO FATTA DA DENTRO ALL'XML */
    var vDati = getForm();
    vDati.funzioneAttiva = 'STAMPA_GLOBALE';
    FiltroCartella.check(vDati);

    var arrayFunction    = [];
    var arrayParameters  = [];
    var arrayNomeReport  = [];
    var arrayFirmato     = [];
    var arrayControllo   = [];
    var arrayDescrizione = [];
    var arrayModulo      = [];
    
    if (args.vResp[0] == "OK") {
    	arrayFunction     = args.vResp[2].split(';');
    	arrayParameters   = args.vResp[3].split(';');
    	arrayNomeReport   = args.vResp[4].split(';');
    	arrayFirmato      = args.vResp[5].split(';');
    	arrayControllo    = args.vResp[6].split(';');
    	arrayDescrizione  = args.vResp[7].split(';');
    	arrayModulo       = args.vResp[8].split(';');
    } else if (args.vResp[0] == "") {
	    var vResp = executeStatement('stampe.xml','StampaGlobale.Esegui',[
	        vDati.iden_ricovero,
	        vDati.funzioneAttiva,
	        baseReparti.getValue('','SITO')/* sito */,
	        ''/* struttura */,
	        vDati.reparto,
	        'FUNZIONE'/* tipoFunz */,
	        'PARAMETER'/* tipoParam */,
	        'PDF_FIRMATO'/* isFirmato */,
	        vDati.TipoRicovero
	    ],7);
	 
	    if(vResp[0]=='KO'){
	        return alert('Stampa in errore:\n'+vResp[1]);
	    }
	    
	    arrayFunction 	  = vResp[2].split(';');
	    arrayParameters   = vResp[3].split(';');
	    arrayNomeReport   = vResp[4].split(';');
	    arrayFirmato      = vResp[5].split(';');
	    arrayControllo    = vResp[6].split(';');
	    arrayDescrizione  = vResp[7].split(';');
	    arrayModulo       = vResp[8].split(';');
    } else {
    	return alert('Stampa in errore:\n'+args.vResp[1]);
    }
    
    // Elimina le configurazioni dei report che non devono essere stampati
    for (var i=0, j=i, length=arrayControllo.length; i<length; i++){
    	if (arrayControllo[j] == 'N' && arrayModulo[j] != 'A') {
    		// Elimina tutti gli elementi in posizione j
    		arrayFunction.splice(j, 1);
    		arrayParameters.splice(j, 1);
    		arrayNomeReport.splice(j, 1);
    		arrayFirmato.splice(j, 1);
    		arrayControllo.splice(j, 1);
			arrayModulo.splice(j, 1);
    	} else {
    		// Passa alla posizione successiva
    		j++;
    	}
    }
    
    var nomeCompleto	= '';
    var parametriRep	= '';
    var funzioni		= '';
    var isFirm			= '';
    for (var i=0;i<arrayParameters.length-1;i++){
        if (arrayFunction[i].split('=')[1]=='TERAPIE_GLOBALI')
        {
            vDati.funzioneAttiva = arrayFunction[i].split('=')[1];
            var resp = eseguiProceduraTerapieGlobali(vDati);
            if(resp[0]=='KO')
            {
                return alert('Stampa terapie globali in errore:\n'+resp[1]);
            }
        }
        else if (arrayFunction[i].split('=')[1]=='SCALA_CONLEY')
        {
            var vResp = executeStatement('stampe.xml','setConley',[baseUser.LOGIN,vDati.iden_ricovero]);
            if(vResp[0]=='KO')
            {
                return alert('Stampa Conley in errore:\n'+vResp[1]);
            }
        }

        funzioni	 = funzioni		+ arrayFunction[i] + ';';
        nomeCompleto = nomeCompleto + arrayNomeReport[i] + ';';
        parametriRep = parametriRep + eval(arrayParameters[i]) + ';';
        isFirm		 = isFirm		+ arrayFirmato[i] + ';';
    }
    
    var vRespParam = executeStatement('stampe.xml','StampaGlobale.setParametriStampaGlobale',[
          baseUser.LOGIN,
          vDati.iden_ricovero,
          "PARAMETRI_STAMPA_GLOBALE",
          funzioni,
          nomeCompleto,
          parametriRep,
          isFirm
          ]);
    if (vRespParam[0]=='KO'){
    	return alert("Errore nel salvataggio sul db dei parametri di stampa della cartella" + vRespParam[1]);
    }
    
    var url =  'elabStampaMulti?';
    
    $('body.singolo').append('<form id="stampaGlobale" />');
    /*$("form#stampaGlobale").append('<input type="hidden" name="allFunction" id="allFunction"/>');
    $("form#stampaGlobale input#allFunction").val(funzioni);
    $("form#stampaGlobale").append('<input type="hidden" name="allNameReport" id="allNameReport"/>');
    $("form#stampaGlobale input#allNameReport").val(nomeCompleto);
    $("form#stampaGlobale").append('<input type="hidden" name="allParamReport" id="allParamReport"/>');
    $("form#stampaGlobale input#allParamReport").val(parametriRep);
    $("form#stampaGlobale").append('<input type="hidden" name="allFirmato" id="allFirmato"/>');
    $("form#stampaGlobale input#allFirmato").val(isFirm);*/
    $("form#stampaGlobale").append('<input type="hidden" name="stampaAnteprima" id="stampaAnteprima"/>');
    $("form#stampaGlobale input#stampaAnteprima").val("S");
    $("form#stampaGlobale").append('<input type="hidden" name="numCopie" id="numCopie"/>');
    $("form#stampaGlobale input#numCopie").val("1");
    $("form#stampaGlobale").append('<input type="hidden" name="idenRicovero" id="idenRicovero"/>');
    $("form#stampaGlobale input#idenRicovero").val(vDati.iden_ricovero);    

    
    var finestra_stampaglobale = window.open("","stampa_globale","fullscreen=yes scrollbars=no");
	$("form#stampaGlobale").attr('target','stampa_globale');
	$("form#stampaGlobale").attr('action',url);
    $("form#stampaGlobale").attr('method','POST');
    $("form#stampaGlobale").submit(); 
    
    window.utilMostraBoxAttesa(false);
    
    try{
        opener.top.closeWhale.pushFinestraInArray(finestra_stampaglobale);
		}
    catch(e){}
    
}

//LINO
function eseguiProceduraTerapieGlobali(pDati){
    window.utilMostraBoxAttesa(true);
    var pBindsTerapie = '';
    pBindsTerapie = [baseUser.LOGIN,pDati.iden_ricovero,pDati.iden_visita,pDati.reparto,pDati.funzioneAttiva];
    var vRespTerapie 	= executeStatement('stampe.xml',ModalitaCartella.getStampaStatement(pDati),pBindsTerapie);
    return vRespTerapie;
}


//ARRY
function stampaScorePadua(){
    var vDati 		= getForm();
    var iden_visita	= vDati.iden_ricovero;
    var funzione	= 'SCORE_PADUA_BLEEDING_RISK';
    var reparto		= vDati.reparto;
    var anteprima	= 'S';
    var sf			= '&prompt<pVisita>='+iden_visita;
    //alert(' - iden_visita: ' + iden_visita + '\n - reparto: ' + reparto + '\n - anteprima: '+ anteprima + '\n - sf: ' + sf);
    confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);

}
//ARRY
function stampaScalaBraden(){
    var vDati 		= getForm();
    var iden_visita	= vDati.iden_ricovero;
    var funzione	= 'SCALA_BRADEN';
    var reparto		= vDati.reparto;
    var anteprima	= 'S';
    var sf			= '&prompt<pVisita>='+iden_visita;
    if(baseUser.LOGIN == 'arry' || baseUser.LOGIN == 'lino')
        alert(' Alert Solo per Admin!' + '\n - iden_visita: ' + iden_visita + '\n - reparto: ' + reparto + '\n - anteprima: '+ anteprima + '\n - sf: ' + sf);

    confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);

}
//Matteopi
function stampaScalaFace(){
    var vDati 		= getForm();
    var iden_visita	= vDati.iden_ricovero;
    var funzione	= 'SCALA_FACE';
    var reparto		= vDati.reparto;
    var anteprima	= 'S';
    var sf			= '&prompt<pVisita>='+iden_visita;
    if(baseUser.LOGIN == 'arry' || baseUser.LOGIN == 'matteopi')
        alert(' Alert Solo per Admin!' + '\n - iden_visita: ' + iden_visita + '\n - reparto: ' + reparto + '\n - anteprima: '+ anteprima + '\n - sf: ' + sf);

    confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);

}

function stampaScalaSoas(){
    var vDati 		= getForm();
    var iden_visita	= vDati.iden_ricovero;
    var funzione	= 'SCALA_SOAS';
    var reparto		= vDati.reparto;
    var anteprima	= 'S';
    var sf			= '&prompt<pVisita>='+iden_visita;
    if(baseUser.LOGIN == 'arry' || baseUser.LOGIN == 'matteopi')
        alert(' Alert Solo per Admin!' + '\n - iden_visita: ' + iden_visita + '\n - reparto: ' + reparto + '\n - anteprima: '+ anteprima + '\n - sf: ' + sf);

    confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);

}

function visualizzaDocAllegati(){

    Abstract({
        RefreshFunction:apriPianiTerapeutici,
        CodFunzione:"VISUALIZZATORE_DOC",
        DescrFunzione:"Visualizza documenti allegati",
        CheckFiltroLivello:false,
        GetUrlFunction:getUrl
    });

    function getUrl(pDati){

        var url ='servletGenerator?KEY_LEGAME=VISUALIZZATORE_DOC';

        return url;
    }


}

// UBE
function stampaScalaBarthel(){
    var vDati 		= getForm();
    var iden_visita	= vDati.iden_ricovero;
    var funzione	= 'SCALA_BARTHEL';
    var reparto		= vDati.reparto;
    var anteprima	= 'S';
    var sf			= '&prompt<pVisita>='+iden_visita;
    if(baseUser.LOGIN == 'arry' || baseUser.LOGIN == 'lino')
        alert(' Alert Solo per Admin!' + '\n - iden_visita: ' + iden_visita + '\n - reparto: ' + reparto + '\n - anteprima: '+ anteprima + '\n - sf: ' + sf);

    confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);

}
function stampaScalaBBS(){
    var vDati 		= getForm();
    var iden_visita	= vDati.iden_ricovero;
    var funzione	= 'SCALA_BBS';
    var reparto		= vDati.reparto;
    var anteprima	= 'S';
    var sf			= '&prompt<pVisita>='+iden_visita;
    if(baseUser.LOGIN == 'arry' || baseUser.LOGIN == 'lino')
        alert(' Alert Solo per Admin!' + '\n - iden_visita: ' + iden_visita + '\n - reparto: ' + reparto + '\n - anteprima: '+ anteprima + '\n - sf: ' + sf);

    confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);

}
function stampaScalaDGI(){
    var vDati 		= getForm();
    var iden_visita	= vDati.iden_ricovero;
    var funzione	= 'SCALA_DGI';
    var reparto		= vDati.reparto;
    var anteprima	= 'S';
    var sf			= '&prompt<pVisita>='+iden_visita;
    if(baseUser.LOGIN == 'arry' || baseUser.LOGIN == 'lino')
        alert(' Alert Solo per Admin!' + '\n - iden_visita: ' + iden_visita + '\n - reparto: ' + reparto + '\n - anteprima: '+ anteprima + '\n - sf: ' + sf);

    confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);

}
function stampaScalaTIS(){
    var vDati 		= getForm();
    var iden_visita	= vDati.iden_ricovero;
    var funzione	= 'SCALA_TIS';
    var reparto		= vDati.reparto;
    var anteprima	= 'S';
    var sf			= '&prompt<pVisita>='+iden_visita;
    if(baseUser.LOGIN == 'arry' || baseUser.LOGIN == 'lino')
        alert(' Alert Solo per Admin!' + '\n - iden_visita: ' + iden_visita + '\n - reparto: ' + reparto + '\n - anteprima: '+ anteprima + '\n - sf: ' + sf);

    confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);

}
function stampaScalaFM(){
    var vDati 		= getForm();
    var iden_visita	= vDati.iden_ricovero;
    var funzione	= 'SCALA_FM';
    var reparto		= vDati.reparto;
    var anteprima	= 'S';
    var sf			= '&prompt<pVisita>='+iden_visita;
    if(baseUser.LOGIN == 'arry' || baseUser.LOGIN == 'lino')
        alert(' Alert Solo per Admin!' + '\n - iden_visita: ' + iden_visita + '\n - reparto: ' + reparto + '\n - anteprima: '+ anteprima + '\n - sf: ' + sf);

    confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);

}
function stampaScalaHPT(){
    var vDati 		= getForm();
    var iden_visita	= vDati.iden_ricovero;
    var funzione	= 'SCALA_HPT';
    var reparto		= vDati.reparto;
    var anteprima	= 'S';
    var sf			= '&prompt<pVisita>='+iden_visita;
    if(baseUser.LOGIN == 'arry' || baseUser.LOGIN == 'lino')
        alert(' Alert Solo per Admin!' + '\n - iden_visita: ' + iden_visita + '\n - reparto: ' + reparto + '\n - anteprima: '+ anteprima + '\n - sf: ' + sf);

    confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);

}
function stampaScalaFAC(){
    var vDati 		= getForm();
    var iden_visita	= vDati.iden_ricovero;
    var funzione	= 'SCALA_FAC';
    var reparto		= vDati.reparto;
    var anteprima	= 'S';
    var sf			= '&prompt<pVisita>='+iden_visita;
    if(baseUser.LOGIN == 'arry' || baseUser.LOGIN == 'lino')
        alert(' Alert Solo per Admin!' + '\n - iden_visita: ' + iden_visita + '\n - reparto: ' + reparto + '\n - anteprima: '+ anteprima + '\n - sf: ' + sf);

    confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);

}
function stampaScalaTUG(){
    var vDati 		= getForm();
    var iden_visita	= vDati.iden_ricovero;
    var funzione	= 'SCALA_TUG';
    var reparto		= vDati.reparto;
    var anteprima	= 'S';
    var sf			= '&prompt<pVisita>='+iden_visita;
    if(baseUser.LOGIN == 'arry' || baseUser.LOGIN == 'lino')
        alert(' Alert Solo per Admin!' + '\n - iden_visita: ' + iden_visita + '\n - reparto: ' + reparto + '\n - anteprima: '+ anteprima + '\n - sf: ' + sf);

    confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);

}
function stampaScala10MWT(){
    var vDati 		= getForm();
    var iden_visita	= vDati.iden_ricovero;
    var funzione	= 'SCALA_10MWT';
    var reparto		= vDati.reparto;
    var anteprima	= 'S';
    var sf			= '&prompt<pVisita>='+iden_visita;
    if(baseUser.LOGIN == 'arry' || baseUser.LOGIN == 'lino')
        alert(' Alert Solo per Admin!' + '\n - iden_visita: ' + iden_visita + '\n - reparto: ' + reparto + '\n - anteprima: '+ anteprima + '\n - sf: ' + sf);

    confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);

}
function stampaScala6MWT(){
    var vDati 		= getForm();
    var iden_visita	= vDati.iden_ricovero;
    var funzione	= 'SCALA_6MWT';
    var reparto		= vDati.reparto;
    var anteprima	= 'S';
    var sf			= '&prompt<pVisita>='+iden_visita;
    if(baseUser.LOGIN == 'arry' || baseUser.LOGIN == 'lino')
        alert(' Alert Solo per Admin!' + '\n - iden_visita: ' + iden_visita + '\n - reparto: ' + reparto + '\n - anteprima: '+ anteprima + '\n - sf: ' + sf);

    confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);

}

var cartellaPaziente = {
    avvertenze : {
        apriPositivita : function(){
			var vRs = top.executeQuery("cartellaPaziente.xml","getInfoPositivitaRicovero",[getRicovero("IDEN"),getAccesso("IDEN")]);
			if (vRs.size <= 0)
				vRs = top.executeQuery("cartellaPaziente.xml","getInfoPositivita",[getPaziente("IDEN")]);
            var html = '<div class="title">Positività Sierologiche</div>';
            while(vRs.next()) {
            	html += '<label'+(vRs.getString("deleted") == 'S' ? ' style="text-decoration: line-through"' : '')+'>'+vRs.getString("descrizione")+'</label><br/>';
            }
            var props = {
                contents : html,
                css: {
// 'color':'blue',
                    'text-align':'center'
                }
            };
            infoPopup(props);
        },
        apriAllergie : function(){
        	var vRs;
        	switch(getRicovero("COD_CDC")){
        	case 'ATS_CAR_SV':
        	case 'UTIC_SV':
        	case 'DH_CARD_SV':
        		vRs = top.executeQuery("cartellaPaziente.xml","getInfoAllergieCarRicovero",[getRicovero("IDEN"),getRicovero("IDEN"),getAccesso("IDEN")]);
				if (vRs.size <= 0)
					vRs = top.executeQuery("cartellaPaziente.xml","getInfoAllergieCar",[getRicovero("IDEN"),getPaziente("IDEN")]);
        		break;
        	default:
				vRs = top.executeQuery("cartellaPaziente.xml","getInfoAllergieRicovero",[getRicovero("IDEN"),getAccesso("IDEN")]);
				if (vRs.size <= 0)
					vRs = top.executeQuery("cartellaPaziente.xml","getInfoAllergie",[getPaziente("IDEN")]);
        	}
        	       	
            var html = '<div class="title">Allergie e Intolleranze</div>';
            while(vRs.next()) {
                html += '<label'+(vRs.getString("deleted") == 'S' ? ' style="text-decoration: line-through"' : '')+'>'+vRs.getString("descrizione")+'</label><br/>';
            }
            var props = {
                contents : html,
                css: {
                    'text-align':'center'
                }
            };
            infoPopup(props);
        },
        apriDieta : function() {
            //var vRs = top.executeQuery("cartellaPaziente.xml","getInfoDieta",[getRicovero("IDEN")]);

            top.dwr.engine.setAsync(false);
            top.dwrUtility.executeStatement("cartellaPaziente.xml","getInfoDieta",[getRicovero("IDEN")],2,callBack);
            top.dwr.engine.setAsync(true);

            function callBack(resp){

                var testoAllertDieta;
                var notedieta;
                if (resp[0]=='KO'){
                    testoAllertDieta = 'Nessuna dieta somministrata' ;
                    notedieta='';
                }else{
                    testoAllertDieta = resp[2];
                    notedieta=resp[3];
                }
                var html = '<div class="title">Dieta</div>';

                html += '<label>'+testoAllertDieta+'</label><br/>';
                if (resp[3]!=null){
                    html += '<label>'+notedieta+'</label>';
                }
                var props = {
                    contents : html,
                    css: {
                        'text-align':'center'
                    }
                };
                infoPopup(props);
            }
        },
        apriGruppoSanguigno: function(){

            var vRs = top.executeQuery("cartellaPaziente.xml","getGruppoSanguigno",[getRicovero("IDEN")]);
            var html = '<div class="title">Gruppo sanguigno</div>';
            if(vRs.next()) {
                html += '<label>Gruppo: '+vRs.getString('gruppo')+'</label><br/>';
                html += '<label>Fattore Rh: '+vRs.getString('fattoreRh')+'</label><br/>';
            }
  
            var props = {
                contents : html,
                css: {
                    'text-align':'center'
                }
            };
            infoPopup(props);
        },
        apriRischioGravidanza: function(){

            var vRs = top.executeQuery("cartellaPaziente.xml","getRischioGravidanza",[getRicovero("IDEN")]);
            var html = '<div class="title">Rischio gravidanza</div>';
            if(vRs.next()) {
                html += '<label>'+vRs.getString('rischio')+'</label><br/><label>'+vRs.getString('note')+'</label><br/>';
            }
  
            var props = {
                contents : html,
                css: {
                    'text-align':'center'
                }
            };
            infoPopup(props);
        },
        apriPatologie: function(){
			var vRs = top.executeQuery("cartellaPaziente.xml","getInfoPatologieRicovero",[getRicovero("IDEN"),getAccesso("IDEN")]);
			if (vRs.size <= 0)
				vRs = top.executeQuery("cartellaPaziente.xml","getInfoPatologie",[getPaziente("IDEN")]);
            var html = '<div class="title">Patologie</div>';
            while(vRs.next()) {
            	html += '<label'+(vRs.getString("deleted") == 'S' ? ' style="text-decoration: line-through"' : '')+'>'+vRs.getString("descrizione")+'</label><br/>';
            }
            var props = {
                contents : html,
                css: {
                    'text-align':'left'
                }
            };
            infoPopup(props);
        },
        
        visualizzaGermi: function(){
            
				$('#divInfo').remove();
				
				setRiga();
			     var dataPos;
			     var dataNeg;
			     var esame;
				vObjDiv = $("<div id=divInfo style='background:#E6F4FF; width:280px; border:#dddddd 1px solid;font-family:Arial;font-size:12px;'></div>");
				
				var rs = WindowCartella.executeQuery('worklistRicercaRicoverati.xml','getPositivitaGermi',[getPaziente("ID_REMOTO")]);
				while(rs.next()){
					if (rs.getString('POSITIVITA')=='S' || rs.getString('POSITIVITA_PREGRESSA')=='S'){
						if(rs.getString('IDANALISI')=='9902') esame='KPC'; else esame='C. difficile';
						if (rs.getString('POSITIVITA')=='S'){
							dataPos= rs.getString('DATA_POSITIVITA'); 
							dataNeg='';
						}
						else{
							dataPos= rs.getString('DATA_P_PREGRESSA');   
							dataNeg= rs.getString('DATA_POSITIVITA'); 
						}
						
						vObjHeader = $("<div id=divHeader style='background:#B1DDFC;height: 15px;margin:5px; text-align:center;'>"+esame+"</div>");
						$(vObjDiv).append($(vObjHeader));
						vObj = $("<table id=tableInfo style='font-family:Arial;font-size:12px;'></table>");
						if(dataNeg!=''){
							$(vObj).append(
									$('<tr></tr>')
									.append($('<td></td>').text('Rilevata negatività il:'))
									.append($('<td></td>').text(dataNeg))
							)}	                    
						$(vObj).append(
								$('<tr></tr>')
								.append($('<td></td>').text('Rilevata positività il:'))
								.append($('<td></td>').text(dataPos))
						)
						$(vObjDiv).append($(vObj));

					}

				}
     
         vObjDiv.css({"position": "absolute","top":event.clientY+document.body.scrollTop+'px',"left":event.clientX+'px'}); 
         vObjDiv.appendTo('body');
         
         $('#divInfo').bind('click',function(){$(this).remove();});

        },
        
		apriMalattieRare: function() {
			var vRs = top.executeQuery("cartellaPaziente.xml","getInfoMalattieRare",[getPaziente("IDEN")]);
            var html = '<div class="title">Malattie rare</div>';
            for(var i=0;vRs.next();i++) {
            	html += '<label>'+vRs.getString("problema_completo")+vRs.getString("note")+'</label><br/>';
            	if (i < vRs.size-1) {
            		html += '<hr/>';
            	}
            }
            var props = {
                contents : html,
                css: {
                    'text-align':'left'
                }
            };
            infoPopup(props);
		}
    }
};

/**
 * Apre una scheda ricovero generica costruita utilizzando la classe servletGenerator.
 * 
 * @author             gianlucab
 * @version            1.3
 * @param   funzione   nome della funzione associata alla scheda
 * @param   label      (opzionale) stringa che ridefinisce il nome visualizzato per la scheda
 * @param   options    (opzionale) array associativo contenente i parametri manuali, es.: {readonly: true, sito: "ALL"}
 * @param   abstract   (opzionale) array associativo che modifica i parametri per l'Abstract
 * @since              2014-05-28
 */
function apriScheda(funzione, label, options, pAbstract) {
    var args = arguments;
    label = (typeof label === 'string') ? label : funzione;
    options = typeof options === 'object' ? options : {};
    pAbstract = typeof pAbstract === 'object' ? pAbstract : {};
    
    var _abstract = {
        RefreshFunction: function() {
            apriScheda.apply(window, args);
        },
        CodFunzione: funzione,
        DescrFunzione: label,
        InfoRegistrazione: true,
        CheckFiltroLivello: true,
        GetUrlFunction: getUrlScheda,
        Destinazione: 'FRAME'
    };
    
    // Merge _abstract with pAbstract
    $.extend(_abstract, pAbstract);
	
    Abstract(_abstract);
    
    function getUrlScheda(pDati) {
        var url = "servletGenerator?";

        var confScheda = getConfScheda(funzione, pDati, {showAlerts:false});
        var parametri = new Array();
        
        // Configurazione automatica dei parametri
        if (confScheda.valid) {
        	parametri["KEY_LEGAME"] = confScheda.KEY_LEGAME;
        	
        	if(confScheda.SITO != null && confScheda.SITO != '') {
        		parametri["SITO"] = confScheda.SITO;
        	}
        	if(confScheda.VERSIONE != null && confScheda.VERSIONE != '') {
        		parametri["VERSIONE"] = confScheda.VERSIONE;
        	}
        	if(confScheda.IDEN_SCHEDA != null && confScheda.IDEN_SCHEDA != '') {
        		parametri["IDEN_SCHEDA"] = confScheda.IDEN_SCHEDA;
        	}
        }
    	
        parametri["FUNZIONE"] = pDati.funzioneAttiva;
        parametri["IDEN_VISITA"] = FiltroCartella.getIdenRiferimento(pDati);
        parametri["IDEN_VISITA_REGISTRAZIONE"] = pDati.iden_visita;
        parametri["IDEN_ANAG"] = pDati.iden_anag;
        parametri["REPARTO"] = pDati.reparto;
        parametri["BISOGNO"] = "N";
        parametri["READONLY"] = ModalitaCartella.isReadonly(pDati) ? 'true' : 'false';
        
		// Configurazione manuale dei parametri (case insensitive)
        for (var i in options) {
            if (i === i.toUpperCase()) continue; /* salta al parametro successivo */
		
            var key = i.toUpperCase();
            var value = options[i];
            delete options[i];
            options[key] = value;
        }
        
        // Merge parametri with options
        $.extend(parametri, options);
        
        for (var key in parametri) {
        	url += encodeURIComponent(key)+'='+encodeURIComponent(parametri[key])+"&";
        }
        url = url.replace(/\&$/, '');
        //alert("URL: " + url);
        
        if (typeof parametri['KEY_LEGAME'] === 'string' && parametri['KEY_LEGAME'] != '') {
        	return url;
        }
        
        alert('Scheda non configurata per la selezione effettuata');
        utilMostraBoxAttesa(false);
        return "blank.htm";
    }
}

/**
 * Apre la pagina di anteprima per la Stampa Cartella.
 * 
 * @author             gianlucab
 * @version            1.0
 * @since              2015-06-17
 */
function apriVerificaCompletezza(){

    Abstract({
        RefreshFunction:apriVerificaCompletezza,
        CodFunzione:"STAMPA_GLOBALE",
        DescrFunzione:"Stampa Cartella",
        CheckFiltroLivello:false,
        GetUrlFunction:getUrlVerificaCompletezza
    });

    function getUrlVerificaCompletezza(pDati){
        if(!checkIdenVisita(pDati)){
            return null;
        }
        
        var url = "servletGeneric?class=stampe.multi.VerificaCompletezza";
        url += "&IDEN_RICOVERO="+pDati.iden_ricovero;
        url += "&FUNZIONE="+pDati.funzioneAttiva;
        url += "&SITO="+baseReparti.getValue('','SITO');
        url += "&REPARTO="+pDati.reparto;
        url += "&TIPO_RICOVERO="+pDati.TipoRicovero;

        return url;
    }
}

function nvl(value1,value2) 
{
    if (value1 == null||value1==''){
        return value2;
    }
    return value1;
}

