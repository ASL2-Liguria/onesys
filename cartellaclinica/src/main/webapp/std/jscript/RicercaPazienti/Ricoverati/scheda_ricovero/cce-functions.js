/* DARIO */
function allegaDocumenti()
{
    Abstract({
        RefreshFunction:allegaDocumenti,
        CodFunzione:"ALLEGADOC",
        DescrFunzione:"Allega documenti",
        InfoRegistrazione:false,
        GetUrlFunction:getUrl
    });

    function getUrl(pDati){

        var vDati = getForm();
   
        var url="SrvScanFrameset?all_iden_esa=1&readonly_attach_to=S";
        url+="&all_iden_anag="+vDati.iden_anag;
        url+="&web_user="+baseUser.LOGIN;
        url+="&cdc_user="+vDati.reparto;
        url+="&caller=whale&other_info=";
        url+="&default_descr_doc=SCANSIONE";
        url+="&doc_attach_to=ANAG";
        url+="&readonly_attach_to=N";
        url+="&iden_nosologico="+vDati.iden_visita;
        url = top.NS_APPLICATIONS.switchTo('AMBULATORIO',url);
        return 	url;
    }
    utilMostraBoxAttesa(false);

}

function allegaDiarioFermoSistema()
{
    Abstract({
        RefreshFunction:allegaDocumenti,
        CodFunzione:"ALLEGADOC",
        DescrFunzione:"Allega documenti",
        InfoRegistrazione:false,
        GetUrlFunction:getUrl
    });

    function getUrl(pDati){

        var vDati = getForm();
   
        var url="SrvScanFrameset?all_iden_esa=1&readonly_attach_to=S";
        url+="&all_iden_anag="+vDati.iden_anag;
        url+="&web_user="+baseUser.LOGIN;
        url+="&cdc_user="+vDati.reparto;
        url+="&caller=whale";
        url+="&other_info=SCANSIONE_NO";
        url+="&default_descr_doc=Diario Fermo Sistema ONE.SYS";
        url+="&iden_tipo_doc=1144";
        url+="&doc_attach_to=ANAG";
        url+="&readonly_attach_to=N";
        url+="&iden_nosologico="+vDati.iden_visita;
        url = top.NS_APPLICATIONS.switchTo('AMBULATORIO',url);
        return 	url;
    }
    utilMostraBoxAttesa(false);

}

/* FRA */
function apriAllerte(pTipo){

    Abstract({
        RefreshFunction:function(){apriAllerte(pTipo);},
        CodFunzione:"ALLERTE",
        DescrFunzione:"Allerte",
        GetUrlFunction:getUrl,
        Destinazione:'FANCYBOX'
    });

    function getUrl(pDati){

        var url = "servletGenerator?KEY_LEGAME=WK_ALLERTE";
        url +=	"&CONTEXT_MENU=WK_ALLERTE_LETTURA";
        url +=	"&WHERE_WK= where IDEN_VISITA="+pDati.iden_visita;
        url += 	(pTipo!= undefined && pTipo!=''?" and TIPO='"+pTipo+"'":'');

        return url;
    }

}

/* DARIO */
function apriAnamnesi(pDocument)
{
    Abstract({
        RefreshFunction:apriAnamnesi,
        CodFunzione:"ANAMNESI",
        DescrFunzione:"Anamnesi",
        // AbilitaVersioni:true,
        InfoRegistrazione:true,
        GetUrlFunction:getUrl,
        Destinazione:(typeof pDocument != 'undefined' ? pDocument : 'FRAME')
    });

    function getUrl(pDati){

        confScheda = getConfScheda('ANAMNESI',pDati);
        if(!confScheda.valid)
            return "blank.htm";

      /*  if(pDati.TipoRicovero == 'OBI' && window.baseReparti.getValue(getRicovero('COD_CDC'),'URL_AUTOLOGIN_PS')  != null ){

            var idenContatto;
            var iden_lista;
            var iden_provenienza;
            var idenCdc;
            var stato_pagina;

            var rs = executeQuery("PS.xml","getDatiContatto",[getRicovero('NUM_NOSOLOGICO'),getRicovero('NUM_NOSOLOGICO')]);

            if(rs.next()){
                idenContatto=rs.getString("IDEN_CONTATTO");
                iden_provenienza= rs.getString("IDEN_PROVENIENZA");
                iden_lista = rs.getString("IDEN_LISTA");
                idenCdc = rs.getString("IDEN_CDC");
                stato_pagina = $.parseJSON(rs.getString("JSON_STATO_PAGINA"));
            }

            try {
                eval("url_auto_login="+window.baseReparti.getValue(getRicovero('COD_CDC'),'URL_AUTOLOGIN_PS'));
                url =  url_auto_login.ricovero.url_auto_login;

            }catch(e){
                alert(e);
            }
            url += 'username='   +  baseUser.LOGIN+
                '&scheda=ESAME_OBIETTIVO' +
                '%26IDEN_ANAG=' + pDati.iden_anag +
                '%26IDEN_CONTATTO=' + idenContatto+
                '%26nomeHost=' + basePC.IP +
                '%26NO_APPLET=N' +
                '%26TEMPLATE=CODICE_COLORE/CodiceColore.ftl' +
                '%26IDEN_LISTA=' + iden_lista +
                '%26IDEN_CDC_PS=' + idenCdc +
                '%26IDEN_PROVENIENZA=' + iden_provenienza +
                '%26IDEN_PER=' + baseUser.IDEN_PER +
                '%26USERNAME=' + baseUser.LOGIN+
                '%26IDEN_ESA_VISITA_PRONTO_SOCCORSO=10517' +
                '%26TIPO_PERSONALE=' + baseUser.TIPO+
                '%26SCHEDA=ESAME_OBIETTIVO&STATO_PAGINA='+stato_pagina.ESAME_OBIETTIVO;


            utilMostraBoxAttesa(false);

        }else {  */
        	var url;
        
        	var vKeyLegame=confScheda.KEY_LEGAME;
        	
        	if (pDati.reparto=='NIDO_SV' || pDati.reparto=='PAT_NEO_PL' || pDati.reparto=='PAT_NEO_SV' || pDati.reparto=='NIDO_PL'){
        		url = "servletGenerator?KEY_LEGAME=" + vKeyLegame;
        	}else{
        		url = "servletSynthesis?KEY_LEGAME=" + vKeyLegame;
        	}
        		
            url += "&FUNZIONE=" + pDati.funzioneAttiva;
            url += "&IDEN_ANAG=" + pDati.iden_anag;
            url += "&REPARTO=" + pDati.reparto;
            url += "&STATO_PAGINA=" + (ModalitaCartella.isReadonly(pDati) ? 'L' : 'E');
            url += "&IDEN_VISITA=" + FiltroCartella.getIdenRiferimento(pDati);
            url += "&IDEN_VISITA_REGISTRAZIONE=" + pDati.iden_visita;
            url += "&DATA_ULTIMA_MODIFICA=" + confScheda.DATA_ULTIMA_MODIFICA;
            
            if(confScheda.IDEN_SCHEDA != null && confScheda.IDEN_SCHEDA != '') {
                url += "&IDEN_SCHEDA=" + confScheda.IDEN_SCHEDA;
            }
            if(confScheda.SITO != null && confScheda.SITO != '') {
                url += "&SITO=" + confScheda.SITO;
            }
            if(confScheda.VERSIONE != null && confScheda.VERSIONE != '') {
                url += "&VERSIONE=" + confScheda.VERSIONE;
            }



//        }

        return    url;
    }
}

function apriAnamnesiAnestesista(pDocument)
{
    Abstract({
        RefreshFunction:apriAnamnesiAnestesista,
        CodFunzione:"ANAMNESI_AN",
        DescrFunzione:"Anamnesi anestesiologica",
        // AbilitaVersioni:true,
        InfoRegistrazione:true,
        GetUrlFunction:getUrl,
        Destinazione:(typeof pDocument != 'undefined' ? pDocument : 'FRAME')
    });

    function getUrl(pDati){

        confScheda = getConfScheda('ANAMNESI_AN',pDati);
        if(!confScheda.valid)
            return "blank.htm";

        var url = "servletSynthesis?KEY_LEGAME="+confScheda.KEY_LEGAME;
        url+="&FUNZIONE="+pDati.funzioneAttiva;
        url+="&IDEN_ANAG="+pDati.iden_anag;
        url+="&REPARTO="+pDati.reparto;
        url+="&STATO_PAGINA="+(ModalitaCartella.isReadonly(pDati) ? 'L' : 'E');
        url+="&IDEN_VISITA="+FiltroCartella.getIdenRiferimento(pDati);
        url+="&IDEN_VISITA_REGISTRAZIONE="+pDati.iden_visita;
        url+="&DATA_ULTIMA_MODIFICA="+confScheda.DATA_ULTIMA_MODIFICA;

        if(confScheda.SITO != null && confScheda.SITO !=''){url+="&SITO="+confScheda.SITO}
        if(confScheda.VERSIONE != null && confScheda.VERSIONE !=''){url+="&VERSIONE="+confScheda.VERSIONE}

        return 	url;
    }
}

function apriAndamentoScale(){
	 Abstract({
	        RefreshFunction:apriAndamentoScale,
	        CodFunzione:"ANDAMENTO_SCALE",
	        DescrFunzione:"Andamento scale", 
	        GetUrlFunction:getUrlAndamentoScale
	    });

	    function getUrlAndamentoScale(pDati){
	    	var url = 'servletGeneric?class=cartellaclinica.cartellaPaziente.andamentoScale.andamentoScaleFiltro';
	    	url+='&idenVisita='+FiltroCartella.getIdenRiferimento(pDati);
	    	url+='&reparto='+pDati.reparto;
	        utilMostraBoxAttesa(false);
	        return url;
	    }
	
}

/*LINOB*/
function apriVisualizzaTerapie(){
	Abstract({
        RefreshFunction:apriVisualizzaTerapie,
        CodFunzione:"VISUALIZZA TERAPIE",
        DescrFunzione:"Visualizza Terapie",
        InfoRegistrazione:true,
        Destinazione:(typeof pDocument != 'undefined' ? pDocument : 'FRAME'),
        GetUrlFunction:getVisualizzaTerapie
    });

    function getVisualizzaTerapie(pDati){
		   utilMostraBoxAttesa(false);
		return "visualizza_terapie_struttura.html";
    }
}


//ALEC
function apriBilancioIdrico() {

    Abstract({
        RefreshFunction:apriBilancioIdrico,
        CodFunzione:"BILANCIO_IDRICO",
        DescrFunzione:"Bilancio Idrico",
        InfoRegistrazione:false,
        GetUrlFunction:getUrl
    });

    function getUrl(pDati){

        var url = "servletGenerator?KEY_LEGAME=PAG_BILANCI_IDRICI";
        return url;
    }
}

/* FRA */
function apriBisogniAssistenziali(funzione){

    Abstract({
        RefreshFunction:function(){apriBisogniAssistenziali(funzione);},
        CodFunzione:(typeof funzione!='undefined'? funzione : 'BISOGNI_ASSISTENZIALI'),
        DescrFunzione:"Bisogni assistenziali",
        GetUrlFunction:getUrl
    });

    function getUrl(pDati){

        var url = "frameSetBisogni?reparto="+pDati.reparto;
        url += "&REPARTO="+pDati.reparto;
        url += "&READONLY=" +ModalitaCartella.isReadonly(pDati);
        url += "&iden_visita=" + FiltroCartella.getIdenRiferimento(pDati);
        url += (typeof funzione!='undefined'?"&funzione="+funzione:"");

        return url;
    }

}

/* FRA */
function apriBisogno(funzione,pDocument){

    Abstract({
        RefreshFunction:function(){apriBisogno(funzione);},
        CodFunzione:funzione,
        DescrFunzione:funzione,
        // AbilitaVersioni:true,
        Destinazione:(typeof pDocument != 'undefined' ? pDocument : 'FRAME'),
        InfoRegistrazione:true,
        GetUrlFunction:getUrl
    });

    function getUrl(pDati){

        var confScheda =getConfScheda(funzione,pDati);

        if(!confScheda.valid)
            return "blank.htm";

        var url = "servletSynthesis?KEY_LEGAME="+confScheda.KEY_LEGAME;
        url += "&FUNZIONE="+funzione;
        url += "&REPARTO="+pDati.reparto;
        url += '&READONLY=' +ModalitaCartella.isReadonly(pDati);
        url += "&IDEN_VISITA="+FiltroCartella.getIdenRiferimento(pDati);
        url += "&IDEN_VISITA_REGISTRAZIONE="+pDati.iden_visita;

        if(confScheda.SITO != null && confScheda.SITO !=''){url+="&SITO="+confScheda.SITO}
        if(confScheda.VERSIONE != null && confScheda.VERSIONE !=''){url+="&VERSIONE="+confScheda.VERSIONE}

        return url;
    }

}
/* MATTEOPI */
function apriCertificazioneCremazioneSalma(){

    Abstract({
        RefreshFunction:apriCertificazioneCremazioneSalma,
        CodFunzione:"CERTIFICAZIONE_CREMAZIONE_SALMA",
        DescrFunzione:"CERTIFICAZIONE CREMAZIONE SALMA",
        GetUrlFunction:getUrl
    });

    function getUrl(){
        var url = "servletGenerator?KEY_LEGAME=CERT_CREMAZIONE_SALMA";
        url += "&KEY_ID=";
        return url;
    }

}

/* FRA */
function apriDatiGenerali(pDocument){

    Abstract({
        RefreshFunction:apriDatiGenerali,
        CodFunzione:"DATI_GENERALI",
        DescrFunzione:"Dati Generali",
        InfoRegistrazione:true,
        GetUrlFunction:getUrl,
        Destinazione:(typeof pDocument != 'undefined' ? pDocument : 'FRAME')
    });

    function getUrl(pDati){

        confScheda = getConfScheda('DATI_GENERALI',pDati);
        if(!confScheda.valid)
            return "blank.htm";

    	var url;
    	if (pDati.reparto=='NIDO_SV' || pDati.reparto=='PAT_NEO_PL' || pDati.reparto=='PAT_NEO_SV' || pDati.reparto=='NIDO_PL'){
    		url = "servletGenerator?KEY_LEGAME=" + confScheda.KEY_LEGAME;
    	}else{
    		url = "servletSynthesis?KEY_LEGAME=" + confScheda.KEY_LEGAME;
    	}
        url += "&KEY_LEGAME_SINTESI="+confScheda.KEY_LEGAME;
        url += "&IDEN_ANAG="+pDati.iden_anag;
        url += "&FUNZIONE="+pDati.funzioneAttiva;
        url += "&STATO_PAGINA="+(ModalitaCartella.isReadonly(pDati)?'L':'I');
        url += "&IDEN_VISITA="+FiltroCartella.getIdenRiferimento(pDati);
        url += "&IDEN_VISITA_REGISTRAZIONE="+pDati.iden_visita;
        url += "&READONLY="+ModalitaCartella.isReadonly(pDati);

        if(confScheda.SITO != null && confScheda.SITO !=''){url+="&SITO="+confScheda.SITO}
        if(confScheda.VERSIONE != null && confScheda.VERSIONE !=''){url+="&VERSIONE="+confScheda.VERSIONE}

        return url;
    }
}

function apriDatiGeneraliDS(pDocument, options){
    var args = arguments;
    options = typeof options === 'object' ? options : {};
	
    Abstract({
        RefreshFunction: function() {
        	apriDatiGeneraliDS.apply(window, args);
        },
        CodFunzione:"DATI_GENERALI_DS",
        DescrFunzione:"Dati Generali",
        InfoRegistrazione:true,
        GetUrlFunction:getUrl,
        Destinazione:(pDocument && typeof pDocument === 'object' ? pDocument : 'FRAME')
    });

    function getUrl(pDati){
    	var url = "servletSynthesis?";

        confScheda = getConfScheda('DATI_GENERALI_DS',pDati,{showAlerts:false});
        var parametri = {};

        // Configurazione automatica dei parametri
        if (confScheda.valid) {
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
        
        parametri["KEY_LEGAME"] = confScheda.KEY_LEGAME || "DATI_GENERALI_ASL2_DS";
        parametri["KEY_LEGAME_SINTESI"] = confScheda.KEY_LEGAME || "DATI_GENERALI_ASL2_DS";
        parametri["IDEN_ANAG"] = pDati.iden_anag;
        parametri["FUNZIONE"] = pDati.funzioneAttiva;
        parametri["STATO_PAGINA"] = ModalitaCartella.isReadonly(pDati)?'L':'I';
        parametri["IDEN_VISITA"] = FiltroCartella.getIdenRiferimento(pDati);
        parametri["IDEN_VISITA_REGISTRAZIONE"] = pDati.iden_visita;
        
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

/* DARIO */
function apriDiario(tipo, pDocument){
	var funzione;
	var keyLegame;
	var descrizione;
	var titolo;
	var args = arguments;
	
	switch(tipo) {
	
	case "MEDICO":
		keyLegame = "DIARI";
		funzione = "DIARIO"+tipo;
		descrizione = "Diario medico";
		titolo = "DIARIO MEDICO";
		break;
	
	case "INFERMIERE":
		keyLegame = "DIARI";
		funzione = "DIARIO"+tipo;
		descrizione = "Diario infermieristico";
		titolo = "DIARIO INFERMIERISTICO";
		break;
    
	case "DIETISTA":
		keyLegame = "FILTRO_WK_DIARI_DIET";
		funzione = "DIARIODIET";
		descrizione = "Diario Dietista";
		titolo = "Ricerca Diari Dietista";
		break;
	
	case "OSTETRICO":
		keyLegame = "FILTRO_WK_DIARI_OST";
		funzione = "DIARIOOSTE";
		descrizione = "Diario Ostetrico";
		titolo = "Ricerca Diari Ostetrica";
		break;
	
	case "RIABILITATIVO":
		keyLegame = "DIARI";
		funzione = "DIARIORIAB";
		descrizione = "Diario riabilitativo";
		titolo = "DIARIO RIABILITATIVO";
		break;
		
	case 'SOCIALE':
    	keyLegame = "DIARI";
    	funzione = "DIARIO"+tipo;
    	descrizione = "Diario sociale";
    	titolo = "DIARIO SOCIALE";
    	break;
	
	// Altri diari
	case "ESAMI_DA_RICHIEDERE":
    	keyLegame = "IFRAMESET_DIARIO_MEDICO";
    	funzione = "DIARIO"+tipo;
        descrizione = "Esami da richiedere";
        titolo = "ESAMI DA RICHIEDERE";
        break;
    
	case 'DIETA':
    	keyLegame = "IFRAMESET_DIARIO_MEDICO";
    	funzione = "DIARIO"+tipo;
    	descrizione = "Diete";
    	titolo = "STORICO DIETA";
    	break;
	
    // Tutti i diari
	default:
		tipo = "";
    	keyLegame = "DIARI";
		funzione = "DIARIO";
		descrizione = "Diario";
		titolo = "DIARI";
		break;
	}

    Abstract({
        RefreshFunction:function(){
        	apriDiario.apply(window, args);
        },
        CodFunzione:funzione,
        DescrFunzione:descrizione,
        GetUrlFunction:getUrlDiario,
        Destinazione:(typeof pDocument === 'object' && pDocument != null ? pDocument : 'FRAME')/*,
        CheckFiltroData:true*/
    });

    function getUrlDiario(pDati){
        var url = '';
        url += "servletGenerator?KEY_LEGAME=" + keyLegame;
        url += "&KEY_IDEN_VISITA=" + pDati.iden_visita;
        url += "&KEY_NOSOLOGICO=" + pDati.ricovero;
        url += "&KEY_TIPO_DIARIO=" + tipo;
        url += "&CONTEXT_MENU=" + (ModalitaCartella.isReadonly(pDati)?"LETTURA":"");
        url += "&REPARTO=" + pDati.reparto;
        url += "&NOME_DIARIO=" + encodeURIComponent(titolo);
        return url;
    }
}

/* DARIO */
function apriDiarioMedico(){
    apriDiario('MEDICO');
}

/* DARIO */
function apriDiarioInfermiere(){
    apriDiario('INFERMIERE');
}

/* GRAZIA */
function apriDiarioRiab(){
	apriDiario('RIABILITATIVO');
}

/* UBE */
function apriDiarioDiet(){
	apriDiario('DIETISTA');
}

/* DARIO */
function apriDiarioSociale(){
	apriDiario('SOCIALE');
}

/* FRA */
function apriEsameObiettivo(pDocument){

    Abstract({
        RefreshFunction:apriEsameObiettivo,
        CodFunzione:'ESAME_OBIETTIVO',
        DescrFunzione:"Esame obiettivo",
        InfoRegistrazione:true,
        GetUrlFunction:getUrlEsameObiettivo,
        Destinazione:(typeof pDocument != 'undefined' ? pDocument : 'FRAME')
    });

    function getUrlEsameObiettivo(pDati){

        confScheda = getConfScheda('ESAME_OBIETTIVO',pDati);
        if(!confScheda.valid)
            return "blank.htm";
        
        var url=(confScheda.SINTESI=='S')? "servletSynthesis?":"servletGenerator?";
     
        url += "KEY_LEGAME="+confScheda.KEY_LEGAME;	
        url += "&FUNZIONE="+pDati.funzioneAttiva;
        url += "&REPARTO="+pDati.reparto;
        url += "&READONLY="+ModalitaCartella.isReadonly(pDati);
        url += "&IDEN_VISITA="+FiltroCartella.getIdenRiferimento(pDati);
        url += "&IDEN_VISITA_REGISTRAZIONE="+pDati.iden_visita;

        if(confScheda.SITO != null && confScheda.SITO !=''){url+="&SITO="+confScheda.SITO}
        if(confScheda.VERSIONE != null && confScheda.VERSIONE !=''){url+="&VERSIONE="+confScheda.VERSIONE}

        return url;
    }
}

function apriEsameObiettivoAnestesista(pDocument){

    Abstract({
        RefreshFunction:apriEsameObiettivo,
        CodFunzione:'ESAME_OBIETTIVO_AN',
        DescrFunzione:"Esame obiettivo anestesiologico",
        InfoRegistrazione:true,
        GetUrlFunction:getUrlEsameObiettivo,
        Destinazione:(typeof pDocument != 'undefined' ? pDocument : 'FRAME')
    });

    function getUrlEsameObiettivo(pDati){

        confScheda = getConfScheda('ESAME_OBIETTIVO_AN',pDati);
        if(!confScheda.valid)
            return "blank.htm";

        var url = "servletSynthesis?KEY_LEGAME="+confScheda.KEY_LEGAME;
        url += "&FUNZIONE="+pDati.funzioneAttiva;
        url += "&REPARTO="+pDati.reparto;
        url += "&READONLY="+ModalitaCartella.isReadonly(pDati);
        url += "&IDEN_VISITA="+FiltroCartella.getIdenRiferimento(pDati);
        url += "&IDEN_VISITA_REGISTRAZIONE="+pDati.iden_visita;

        if(confScheda.SITO != null && confScheda.SITO !=''){url+="&SITO="+confScheda.SITO}
        if(confScheda.VERSIONE != null && confScheda.VERSIONE !=''){url+="&VERSIONE="+confScheda.VERSIONE}

        return url;
    }
}

function apriEsameObiettivoDS(pDocument){

    Abstract({
        RefreshFunction:apriEsameObiettivoDS,
        CodFunzione:'ESAME_OBIETTIVO_DS',
        DescrFunzione:"Esame obiettivo",
        InfoRegistrazione:true,
        GetUrlFunction:getUrlEsameObiettivo,
        Destinazione:(typeof pDocument != 'undefined' ? pDocument : 'FRAME')
    });

    function getUrlEsameObiettivo(pDati){

        confScheda = getConfScheda('ESAME_OBIETTIVO_DS',pDati);
        if(!confScheda.valid)
            return "blank.htm";

        var url = "servletSynthesis?KEY_LEGAME="+confScheda.KEY_LEGAME;
        url += "&FUNZIONE="+pDati.funzioneAttiva;
        url += "&REPARTO="+pDati.reparto;
        url += "&READONLY="+ModalitaCartella.isReadonly(pDati);
        url += "&IDEN_VISITA="+FiltroCartella.getIdenRiferimento(pDati);
        url += "&IDEN_VISITA_REGISTRAZIONE="+pDati.iden_visita;

        if(confScheda.SITO != null && confScheda.SITO !=''){url+="&SITO="+confScheda.SITO}
        if(confScheda.VERSIONE != null && confScheda.VERSIONE !=''){url+="&VERSIONE="+confScheda.VERSIONE}

        return url;
    }
}


// MATTEOPI
function apriInserimentoAllergie(){
    Abstract({
        RefreshFunction:function(){apriInserimentoAllergie();},
        CodFunzione:"INSERIMENTO_ALLERGIE",
        DescrFunzione:"Inserimento allergie",
        GetUrlFunction:getUrlInserimentoAllergie
    });

    function getUrlInserimentoAllergie(pDati){

        var context_menu = ModalitaCartella.isReadonly(pDati)?'&CONTEXT_MENU=WK_ALLERTE_LETTURA':'';
        var url = "servletGenerator?KEY_LEGAME=WK_ALLERTE&WHERE_WK= where TIPO IN ('ALLERGIA','INTOLLERANZA','REAZIONE_AVVERSA') AND IDEN_ANAG="+pDati.iden_anag+"&REPARTO="+pDati.reparto+"&IDEN_VISITA="+pDati.iden_visita+context_menu;
        return url;
    }

}

/*
 * LINO
 * 
 * Lettera dimissioni ricovero ordinario richiamata la servlet
 * letteradimissioni(CONFIG_MENU_REPARTO) funzioneLettera='LETTERA_STANDARD'
 */
function apriLetteraDimissioni(funzioneLettera){
    apriLetteraDimissioniNew(funzioneLettera);
}

/*
 * LINO
 * 
 * Lettera dimissioni per i dh Richiamata la servlet
 * letteradim(CONFIG_MENU_REPARTO)
 */
function apriLetteraDimissioniNew(funzioneLettera){

    Abstract({
        RefreshFunction:function(){apriLetteraDimissioniNew(funzioneLettera);},
        CodFunzione:getCodFunzione(),
        DescrFunzione:getDescrFunzione(),
        GetUrlFunction:getUrlLetteraDimissioniNew,
        InfoRegistrazione:true        
    });

    function getCodFunzione(){
        switch(funzioneLettera){
            case 'LETTERA_TRASFERIMENTO':
            case 'LETTERA_AL_CURANTE'	:
            case 'LETTERA_PRIMO_CICLO'	: 
            case 'LETTERA_FARMACIA'		:
            case 'LETTERA_PROSECUZIONE'	:return funzioneLettera;
            case 'LETTERA_DIMISSIONI_DH':
            default : return "LETTERA_DIMISSIONI";
        }
    }

    function getDescrFunzione(){
        switch(funzioneLettera){
            case 'LETTERA_TRASFERIMENTO': 	return 'Lettera Trasferimento';
            case 'LETTERA_AL_CURANTE'	: 	return 'Lettera Al Curante';
            case 'LETTERA_FARMACIA'	: 	
            case 'LETTERA_PRIMO_CICLO'	: 	return 'Lettera Primo Ciclo';
            case 'LETTERA_PROSECUZIONE'	:	return 'Lettera Prosecuzione Ricovero';
            case 'LETTERA_DIMISSIONI_DH':
            default :						return 'Lettera Dimissioni';
        }
    }

    function getUrlLetteraDimissioniNew(pDati){
        var url;

        switch(funzioneLettera){
            case 'LETTERA_AL_CURANTE'	:
            case 'LETTERA_PRIMO_CICLO'	:
            	if(!checkIdenVisita(pDati)){
                    return null;
                }
                url	=	"letteraDim?idenVisita="+pDati.iden_visita;
                url += 	"&idenRicovero="+pDati.iden_ricovero;
                url	+=  "&idenVisitaRegistrazione="+pDati.iden_visita;
                break;
            case 'LETTERA_FARMACIA'	:
                
            	if(!checkIdenVisita(pDati)){
                    return null;
                }
                url	=	"letteraDim?idenVisita="+pDati.iden_ricovero;
                url += 	"&idenRicovero="+pDati.iden_ricovero;
                url	+=  "&idenVisitaRegistrazione="+pDati.iden_visita;	                
                
                break;

            case 'LETTERA_DIMISSIONI_DH':
                url	=	"letteraDim?idenVisita="+FiltroCartella.getIdenRiferimento(pDati);
                url	+=  "&idenVisitaRegistrazione="+pDati.iden_visita;
                break;
            case 'LETTERA_TRASFERIMENTO':   url="servletGenerator?KEY_LEGAME=LETTERA_TRASFERIMENTO&IDEN_VISITA="+FiltroCartella.getIdenRiferimento(pDati);
                break;
            default :/*Lettera standard,lettera prosecuzione, lettera farmaci*/
            	url="letteradimissioni?idenVisita="+FiltroCartella.getIdenRiferimento(pDati);
            	url	+=  "&idenVisitaRegistrazione="+pDati.iden_visita;
                break;
        }

        url += "&idenAnag="	+ pDati.iden_anag;
        url += "&ricovero="	+ pDati.ricovero;
        url += "&reparto="	+ pDati.reparto;
        url += "&funzione="	+ funzioneLettera;
        url += "&IDEN_VISITA_REGISTRAZIONE="+pDati.iden_visita;
        var iden;
        var iden_terapia_associata;
        var bool=true;
        //TODO controllare cosa viene aperto se la funzione è LETTERA_FARMACIA
        
        if (funzioneLettera === 'LETTERA_FARMACIA'){
        	var pBinds = new Array();
        	pBinds.push(pDati.iden_ricovero)
        	var rs = executeQuery('terapia_domiciliare.xml','getLetteraFirmata',pBinds);
            if (rs.next()){
                iden	= rs.getString("iden");
                iden_terapia_associata	= rs.getString("iden_terapia_associata");
                bool	= false;
                if (iden_terapia_associata=='' || iden_terapia_associata==null){
                	url = "ApriPDFfromDB?idenVersione="+iden+"&idenVisita=&db=&funzione=&progr=&AbsolutePath=";                	
                }else{
                	url = "ApriPDFfromDB?idenVersione="+iden_terapia_associata+"&idenVisita=&db=&funzione=&progr=&AbsolutePath=";                	
                }
                WindowCartella.utilMostraBoxAttesa(false);
            }        	
        }
        if (bool){
            return url;        	
        }else{
        	var finestra = window.open(url,"finestra","fullscreen=yes scrollbars=no");
        	WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
            return "blank.htm";
        }
        


    }
}

/* UBE */
function getConvalida(statementFile, statementQuery, array_funzioni) {
    try {
        var convalidato = 'S';
        var messaggio = '';
        for (var i = 0; i < array_funzioni.length; i++) {
            var pBinds = new Array();
            pBinds.push(array_funzioni[i]);
            pBinds.push(getRicovero("IDEN"));

            var rs = executeQuery(statementFile, statementQuery, pBinds);
            if (rs.next()) {
                if (rs.getString('CONVALIDATO') == 'N') {
                    messaggio += messaggio == '' ? "Impossibile aprire la scheda:\n- " + array_funzioni[i] + " non convalidato!" : "\n- " + array_funzioni[i] + " non convalidato!"
                    convalidato = 'N';
                }
            } else {
                messaggio += messaggio == '' ? "Impossibile aprire la scheda:\n- " + array_funzioni[i] + " non convalidato!" : "\n- " + array_funzioni[i] + " non convalidato!"
                convalidato = 'N';
            }
        }
        
        if (convalidato == 'N') {alert(messaggio)}; 
        return convalidato == 'S';
    } catch (e) {
        alert(e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description);
    }
} 
   
/* linob */
function apriListaLavoroInterventi(){
    Abstract({
        RefreshFunction:apriListaLavoroInterventi,
        CodFunzione:'LISTA_LAVORO_INTERVENTI',
        DescrFunzione:"Lista Lavoro Interventi",
        CheckFiltroLivello:true,
        GetUrlFunction:getUrlListaLavoroInterventi
    });

    function getUrlListaLavoroInterventi(pDati){
        
//KEY_LEGAME=WK_INTERVENTI_ANAMNESI&WHERE_WK=%20where%20iden_visita%20%3C%3E%20' + document.EXTERN.IDEN_VISITA.value + '%20and%20IDEN_ANAG%20%3D%20' + document.EXTERN.IDEN_ANAG.value + '%20and%20DATA_INSERIMENTO%20%3C%3D%20to_date(%27' + dataRiferimentoWkInt + '%27%2C%27yyyyMMddhh24:mi:ss%27)';        
        var url = "servletGenerator?KEY_LEGAME=WK_INTERVENTI";
        url += "&WHERE_WK= where iden_visita="+pDati.iden_visita;
        url += " and iden_anag="+pDati.iden_anag;
        url+="&CONTEXT_MENU=" + (ModalitaCartella.isReadonly(pDati) ? "WK_INTERVENTI" : "");

        return url;
    }    
}
/* DARIO */
function apriModulistica(){

    Abstract({
        RefreshFunction:apriModulistica,
        CodFunzione:'MODULISTICA',
        DescrFunzione:"Modulistica",
        CheckFiltroLivello:true,
        GetUrlFunction:getUrlModulustica
    });

    function getUrlModulustica(pDati){
        if(!checkIdenVisita(pDati)){
            return null;
        }
        var url = "servletGenerator?KEY_LEGAME=FILTRO_MODULI_CONSENSO";
        url += "&IDEN_ANAG="+pDati.iden_anag;
        url += "&IDEN_VISITA="+FiltroCartella.getIdenRiferimento(pDati);
        url += "&IDEN_VISITA_REGISTRAZIONE="+pDati.iden_visita;
        url += "&REPARTO="+pDati.reparto;
        url += "&WHERE_WK= where iden_visita="+FiltroCartella.getIdenRiferimento(pDati);
        url+="&CONTEXT_MENU=" + (ModalitaCartella.isReadonly(pDati) ? "WK_MODULI_CONSENSO_LETTURA" : "");

        return url;
    }

}

/* DARIO */
function apriPassaggioConsegne(){

    Abstract({
        RefreshFunction:apriPassaggioConsegne,
        CodFunzione:"PASSAGGIO_CONSEGNE",
        DescrFunzione:"Passaggio consegne",
        CheckFiltroLivello:false,
        GetUrlFunction:getUrlPassaggioConsegne
    });

    function getUrlPassaggioConsegne(pDati){
        if(!checkIdenVisita(pDati)){
            return null;
        }
        var url = "servletGeneric?class=paginaTab.paginaTab";
        url += "&REPARTO="+pDati.reparto;
        url += "&IDEN_VISITA="+pDati.iden_visita;
        url += "&PROCEDURA=passaggioConsegne";

        return url;
    }
}

//* FRA */
function apriPianoTerapeutico(pPianoTerapeutico){
    Abstract({
        RefreshFunction:typeof pPianoTerapeutico=='undefined'?apriPianoTerapeutico:pPianoTerapeutico,
        CodFunzione:"PIANO_TERAPEUTICO",
        DescrFunzione:"Piano giornaliero",
        GetUrlFunction:getUrlPianoTerapeutico
    });

    function getUrlPianoTerapeutico(pDati){
        var url = "pianoGiornaliero?";
        url += "scrollTop=0";
        url += "&iden_visita="+FiltroCartella.getIdenRiferimentoInserimento(pDati);
        url += "&filtroCartella="+FiltroCartella.getLivelloValue();
        if(pDati.dimesso == 'S'){
            url += "&offSet=0";
        }
        


		if(DatiInterfunzione.get("PIANO_GIORNALIERO_FILTRI") != ""){
			url += "&filtri=" + DatiInterfunzione.get("PIANO_GIORNALIERO_FILTRI")/*.stringify()*/;      
			DatiInterfunzione.remove("PIANO_GIORNALIERO_FILTRI");
        }
        
        if (DatiInterfunzione.get("PIANO_GIORNALIERO_FILTRO_TIPO_ATTIVITA") != ""){
			url += "&tipoFiltro=" + DatiInterfunzione.get("PIANO_GIORNALIERO_FILTRO_TIPO_ATTIVITA")/*.stringify()*/;      
			DatiInterfunzione.remove("PIANO_GIORNALIERO_FILTRO_TIPO_ATTIVITA");
        }
        return url;
    }
}

/*FRA*/
function apriPianoTerapeuticoLesioni(){
	var filtri = "[TURNO_PRECEDENTE:1][TURNO_SUCCESSIVO:1]";
    filtri += "[TERAPIE:N]";
    filtri += "[TERAPIE_CHIUSE:N]";
    filtri += "[PARAMETRI:N]";
    filtri += "[ATTIVITA:N]";
    filtri += "[PT_MEDICAZIONE:S]";
    filtri += "[PT_PRESIDIO:N]";
    filtri += "[TUTTO_RICOVERO:N]";
    filtri += "[ABILITA_FILTRO_TERAPIE:N]";
    filtri += "[ABILITA_FILTRO_PARAMETRI:N]";
    filtri += "[ABILITA_FILTRO_PT_PRESIDIO:N]";
    filtri += "[ABILITA_FILTRO_PT_MEDICAZIONE:S]";
    filtri += "[ABILITA_FILTRO_ATTIVITA:N]";  
	DatiInterfunzione.set("PIANO_GIORNALIERO_FILTRI",filtri);
	
	apriPianoTerapeutico();
}

/*FRA*/
function apriPianoTerapeuticoPresidi(){
	var filtri = "[TURNO_PRECEDENTE:1][TURNO_SUCCESSIVO:1]";
    filtri += "[TERAPIE:N]";
    filtri += "[TERAPIE_CHIUSE:N]";
    filtri += "[PARAMETRI:N]";
    filtri += "[ATTIVITA:N]";
    filtri += "[PT_MEDICAZIONE:N]";
    filtri += "[PT_PRESIDIO:S]";
    filtri += "[TUTTO_RICOVERO:N]";
    filtri += "[ABILITA_FILTRO_TERAPIE:N]";
    filtri += "[ABILITA_FILTRO_PARAMETRI:N]";
    filtri += "[ABILITA_FILTRO_PT_PRESIDIO:S]";
    filtri += "[ABILITA_FILTRO_PT_MEDICAZIONE:N]";
    filtri += "[ABILITA_FILTRO_ATTIVITA:N]";  
	DatiInterfunzione.set("PIANO_GIORNALIERO_FILTRI",filtri);
	
	apriPianoTerapeutico();
}

/*FRA*/
function apriPianoTerapeuticoRilevazioni(){
	var filtri = "[TURNO_PRECEDENTE:1][TURNO_SUCCESSIVO:1]";
    filtri += "[TERAPIE:N]";
    filtri += "[TERAPIE_CHIUSE:N]";
    filtri += "[PARAMETRI:S]";
    filtri += "[ATTIVITA:N]";
    filtri += "[PT_MEDICAZIONE:N]";
    filtri += "[PT_PRESIDIO:N]";
    filtri += "[TUTTO_RICOVERO:N]";
    filtri += "[ABILITA_FILTRO_TERAPIE:N]";
    filtri += "[ABILITA_FILTRO_PARAMETRI:S]";
    filtri += "[ABILITA_FILTRO_PT_PRESIDIO:N]";
    filtri += "[ABILITA_FILTRO_PT_MEDICAZIONE:N]";
    filtri += "[ABILITA_FILTRO_ATTIVITA:N]";  
	DatiInterfunzione.set("PIANO_GIORNALIERO_FILTRI",filtri);
	
	apriPianoTerapeutico();
}

/*FRA*/
function apriPianoTerapeuticoTerapie(){
	var filtri = "[TURNO_PRECEDENTE:1][TURNO_SUCCESSIVO:1]";
    filtri += "[TERAPIE:S]";
    filtri += "[TERAPIE_CHIUSE:S]";
    filtri += "[PARAMETRI:N]";
    filtri += "[ATTIVITA:N]";
    filtri += "[PT_MEDICAZIONE:N]";
    filtri += "[PT_PRESIDIO:N]";
    filtri += "[TUTTO_RICOVERO:N]";
    filtri += "[ABILITA_FILTRO_TERAPIE:S]";
    filtri += "[ABILITA_FILTRO_PARAMETRI:N]";
    filtri += "[ABILITA_FILTRO_PT_PRESIDIO:N]";
    filtri += "[ABILITA_FILTRO_PT_MEDICAZIONE:N]";
    filtri += "[ABILITA_FILTRO_ATTIVITA:N]";   

    DatiInterfunzione.set("PIANO_GIORNALIERO_FILTRI",filtri);
	
	apriPianoTerapeutico();
}

/*lino*/
function apriPianoTerapeuticoAttivita(){
    var fitri ='';
    var tipoFiltro = '26';
	var vRs = executeQuery("attivita.xml","getFiltroAttivita",[baseUser.LOGIN,tipoFiltro]);
    if(vRs.next()) {
        filtri = vRs.getString("lastvaluechar");
    }else{
        filtri = "[TURNO_PRECEDENTE:1][TURNO_SUCCESSIVO:1]";
        filtri += "[TERAPIE:N]";
        filtri += "[TERAPIE_CHIUSE:N]";
        filtri += "[PARAMETRI:N]";
        filtri += "[ATTIVITA:S]";
        filtri += "[PT_MEDICAZIONE:N]";
        filtri += "[PT_PRESIDIO:N]";
        filtri += "[TUTTO_RICOVERO:N]";
        filtri += "[ABILITA_FILTRO_TERAPIE:N]";
        filtri += "[ABILITA_FILTRO_PARAMETRI:N]";
        filtri += "[ABILITA_FILTRO_PT_PRESIDIO:N]";
        filtri += "[ABILITA_FILTRO_PT_MEDICAZIONE:N]";
        filtri += "[ABILITA_FILTRO_ATTIVITA:S]";        
    }
    

    
    DatiInterfunzione.set("PIANO_GIORNALIERO_FILTRI",filtri);
	DatiInterfunzione.set("PIANO_GIORNALIERO_FILTRO_TIPO_ATTIVITA",tipoFiltro);
	apriPianoTerapeutico(apriPianoTerapeuticoAttivita);
  
    /*   1=Turni prima
    2=Turni dopo

    3=Pianificate
    4=Eseguite

    5=terapie
      6=non confermata; S/N
      7=confermata; S/N
      8=chiusa S/N

    9=Parametri
      10=Parametro regolare
      11=Parametro Allerta
      12=Parametro critico

    13=Attivita
      14=attivita non indicato
      15=attivita autosuff
      16=attivita coadiu
      17=attivita non autosuff

    18=livello attenzione
    19=tutto il ricovero    
    var filtri ="1@1@@" //turni precedentei + successivi + pianificato + eseguito
				+ "@" + "N"
				+ "@@" // non confermate + confermate + chiuse
				+ "@" + "N"
				+ "@" + "N"
				+ "@@@" // regolare + allerta + critico
				+ "@" + "S"
				+ "@@@@" // non indicato + autosufficiente + coadiuvato + non autosufficiente
				+ "@" // livello attenzione
				+ "@" //tutto il ricovero
				//+ "@" + ""
				;*/

}

/*francescog*/
function apriPianoTerapeuticoTutto(){
	var filtri = "[TURNO_PRECEDENTE:1][TURNO_SUCCESSIVO:1]";
    filtri += "[TERAPIE:S]";
    filtri += "[TERAPIE_CHIUSE:S]";
    filtri += "[PARAMETRI:S]";
    filtri += "[ATTIVITA:S]";
    filtri += "[PT_MEDICAZIONE:S]";
    filtri += "[PT_PRESIDIO:S]";
    filtri += "[TUTTO_RICOVERO:N]";
    filtri += "[ABILITA_FILTRO:S]";
    /*var filtri ="@@@" //turni precedentei + successivi + pianificato + eseguito
				+ "@" + "S"
				+ "@@" // non confermate + confermate + chiuse
				+ "@" + "S"
				+ "@" + "S"
				+ "@@@" // regolare + allerta + critico
				+ "@" + "S"
				+ "@@@@" // non indicato + autosufficiente + coadiuvato + non autosufficiente
				+ "@" // livello attenzione
				+ "@" //tutto il ricovero
				+ "@" + "[PT_PRESIDIO]" + "[PT_MEDICAZIONE]"
				;*/
	DatiInterfunzione.set("PIANO_GIORNALIERO_FILTRI",filtri);
	
	apriPianoTerapeutico();
}

/* FRA */
function apriProblemi(){
    Abstract({
        RefreshFunction:apriProblemi,
        CodFunzione:"PROBLEMI",
        DescrFunzione:"Gestione diagnosi", //"Problemi sanitari",
        GetUrlFunction:getUrlProblemi
    });

    function getUrlProblemi(pDati){
        var url = "listaProblemiRicovero";
        url += "?iden_visita=" 		+ pDati.iden_visita;
        url += "&iden_ricovero=" 	+ pDati.iden_ricovero;
        url += "&ricovero=" 		+ pDati.ricovero;
        url += "&reparto=" 			+ pDati.reparto;
        url += "&iden_anag=" 		+ pDati.iden_anag;
        url += "&FiltroCartella=" 	+ FiltroCartella.getLivelloValue();
        return url;
    }
}

/* FRA wk doppia problemi+allerte */
function apriProblemiAllerte(){
    refreshPage=apriProblemiAllerte;
    getFrame().src= "problemiAllerte.html";
    FiltroCartella.off(getForm());
}

function apriProgrammaRiabilitativo(){
	 Abstract({
	        RefreshFunction:apriProgrammaRiabilitativo,
	        CodFunzione:"PROGRAMMA_RIABILITATIVO",
	        DescrFunzione:"Programma riabilitativo",
	        GetUrlFunction:getUrlProgrammaRiabilitativo
	    });

	    function getUrlProgrammaRiabilitativo(pDati){
	        var url = "programmaRiabilitativo.html";
	        utilMostraBoxAttesa(false);
	        return url;
	    }
	
}

// FRA
function apriRiepilogo(){

    Abstract({
        RefreshFunction:apriRiepilogo,
        CodFunzione:"RIEPILOGO_RICOVERO",
        DescrFunzione:"Riepilogo appuntamenti",
        GetUrlFunction:getUrlRiepilogo,
        CheckFiltroData:true
    });

    function getUrlRiepilogo(pDati){

        var url = 	"servletGeneric?class=cartellaclinica.gestioneAppuntamenti.RiepilogoRicovero";


        url += "&FILTRO=" + FiltroCartella.getLivelloValue();

        switch(FiltroCartella.getLivelloValue()){
            case 'NUM_NOSOLOGICO':
                    url += "&IDEN_RICOVERO="	+ pDati.iden_ricovero;
                    url += "&IDEN_PRERICOVERO="+ pDati.iden_prericovero;
                break;
            case 'ANAG_REPARTO':
                    url += "&IDEN_ANAG=" + pDati.iden_anag;
                    url += "&COD_CDC="   + pDati.reparto;
                break;
        }

        url 	+= 	"&DATA_INIZIO=" + FiltroCartella.getDaDataValue();
        url 	+= 	"&DATA_FINE=" 	+ FiltroCartella.getADataValue();

        url		+=	"&DiarioMedico="	+(baseUser.TIPO=='M'?'S':'N');
        url		+=	"&DiarioInfermiere="+(baseUser.TIPO=='I'?'S':'N');

        return url;
    }

}

// DARIO
function apriScalaBraden(){
    apriScale('SCALA_BRADEN');
}
// DARIO
function apriScalaConley(){
    apriScale('SCALA_CONLEY');
}

// MATTEOPI
function apriScalaFace(){
    apriScale('SCALA_FACE');
}

// DARIO
function apriScalaRischioTromboticoIndividuale(){
    apriScale('RISCHIO_TROMBOTICO_INDIVIDUALE');
}

// MATTEOPI
function apriScalaSoas(){
    apriScale('SCALA_SOAS');
}

// DARIO
function apriScale(funzione){

    Abstract({
        RefreshFunction:function(){apriScale(funzione);},
        CodFunzione:funzione,
        DescrFunzione:funzione,
        CheckFiltroLivello:true,
        InfoRegistrazione:true,
        GetUrlFunction:getUrlScale
    });

    function getUrlScale(pDati){
    	confScheda = getConfScheda(funzione,pDati);
        if(!confScheda.valid)
            return "blank.htm";

        var url = "servletGenerator?KEY_LEGAME="+confScheda.KEY_LEGAME;
        url += "&FUNZIONE="+pDati.funzioneAttiva;
        url += "&IDEN_VISITA="+FiltroCartella.getIdenRiferimento(pDati);
        url += "&IDEN_VISITA_REGISTRAZIONE="+pDati.iden_visita;
        url += "&BISOGNO=N";
        url += "&READONLY=" +ModalitaCartella.isReadonly(pDati);
        return url;
    }
}

//darioc
function apriSchedaPazienteOnco(){

    Abstract({
        RefreshFunction:function(){apriSchedaPazienteOnco();},
        CodFunzione:'SCHEDA_PAZ_ONCO',
        DescrFunzione:'Scheda paziente',
        CheckFiltroLivello:true,
        InfoRegistrazione:false,
        GetUrlFunction:getUrlSPO
    });

    function getUrlSPO(pDati){

    	 var url = 	'servletGenerator?KEY_LEGAME=SCHEDA_PAZ_ONCOL_ASL2'+
    	 			'&PAGINA=SCHEDA_PAZ_ONCOL_ASL2'+
    	 			'&IDEN_RIF='+pDati.iden_anag;
        return url;
    }
}

/* ARRY */
function apriSintesiBisogni(pDocument){

    Abstract({
        RefreshFunction:apriSintesiBisogni,
        CodFunzione:"BISOGNI_SINTESI",
        DescrFunzione:"Sintesi Bisogni",
        InfoRegistrazione:true,
        Destinazione:(typeof pDocument != 'undefined' ? pDocument : 'FRAME'),
        GetUrlFunction:getUrlSintesiBisogni
    });

    function getUrlSintesiBisogni(pDati){
        var confScheda = getConfScheda('BISOGNI_SINTESI',pDati);
        if(!confScheda.valid)
            return "blank.htm";

        var url = "servletSynthesis?KEY_LEGAME="+confScheda.KEY_LEGAME;
        url += "&REPARTO=" + pDati.reparto;
        url += "&READONLY=" + (ModalitaCartella.isReadonly(pDati)?'S':'N');
        url += "&IDEN_VISITA="+ FiltroCartella.getIdenRiferimento(pDati);
        url += "&IDEN_VISITA_REGISTRAZIONE="+ pDati.iden_visita;

        return url;
    }
}

/* LUCA */
function apriTabSintesiBisogni(){

    Abstract({
        RefreshFunction:apriTabSintesiBisogni,
        CodFunzione:"TABULATORE_SINTESI",
        DescrFunzione:"Sintesi Bisogni",
        InfoRegistrazione:true,
        GetUrlFunction:getUrlTabSintesiBisogni
    });

    function getUrlTabSintesiBisogni(pDati){

        var confScheda = getConfScheda('TABULATORE_SINTESI',pDati);
        if(!confScheda.valid)
            return "blank.htm";

        //var param=[{label:'Sintesi Bisogni', action:apriSintesiBisogni},{label:'Wk Obiettivi',action:alert('1')}];

        var url = "servletGenerator?KEY_LEGAME=TABULATORE";
        url += "&READONLY=" + (ModalitaCartella.isReadonly(pDati)?'S':'N');
        url += "&IDEN_VISITA="+ FiltroCartella.getIdenRiferimento(pDati);
        url += "&IDEN_VISITA_REGISTRAZIONE="+ pDati.iden_visita;
        url += "&KEY=SINTESI BISOGNI";

        //alert(url);
        //url += "&PARAMETRI="+param;

        return url;
    }
}

//Matteop

function apriModuloDichMorte(){

    Abstract({
        RefreshFunction:apriModuloDichMorte,
        CodFunzione:"DICHIARAZIONE_MORTE",
        DescrFunzione:"Dichiarazione morte",
        GetUrlFunction:getUrlModuloDichMorte
    });

    function getUrlModuloDichMorte(){
        return "servletGenerator?KEY_LEGAME=DICH_MORTE&KEY_ID=";
    }

}

//Matteop
function apriModuloDichMortePS(){

    Abstract({
        RefreshFunction:apriModuloDichMortePS,
        CodFunzione:"DICHIARAZIONE_MORTE_PS",
        DescrFunzione:"Dichiarazione morte ps",
        GetUrlFunction:getUrlModuloDichMortePS
    });

    function getUrlModuloDichMortePS(){
        return "servletGenerator?KEY_LEGAME=DICH_MORTE_PS&KEY_ID=";
    }
}



//Matteop
function apriSegnalazioneDecesso(){

    Abstract({
        RefreshFunction:apriSegnalazioneDecesso,
        CodFunzione:"SEGNALAZIONE_DECESSO",
        DescrFunzione:"Segnalazione decesso",
        GetUrlFunction:getUrlSegnalazioneDecesso,
        InfoRegistrazione:true
    });

    function getUrlSegnalazioneDecesso(pDati){
        var url="servletGenerator?KEY_LEGAME=SEGNALAZIONE_DECESSO&KEY_ID=&IDEN_VISITA="+FiltroCartella.getIdenRiferimento(pDati)+"&IDEN_VISITA_REGISTRAZIONE="+ pDati.iden_visita;
        url += "&READONLY=" +ModalitaCartella.isReadonly(pDati);
        return url;       
    }
}
//ALEC
function apriWkAppuntamenti(data,data_out) {

    var fieldset = document.createElement('fieldset');
    fieldset.style.backgroundColor="#b9e0ff";
    var legend = document.createElement('legend');
    legend.innerHTML = '<strong>Agenda giornaliera di ' + data_out + "</strong>";
    fieldset.appendChild(legend);
    var url = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_INSERIMENTO_APPUNTAMENTI&" +
        "ILLUMINA=javascript:illumina(this.sectionRowIndex);&" +
        "WHERE_WK=WHERE %28COD_CDC%20LIKE%20%27"+getRicovero("COD_CDC")+"%27%29%20and%20%28DATA_FILTRO%20%3D%27"+data+"%27%29&amp;ORDER_FIELD_CAMPO=";
    var frameWkAgenda = document.createElement('iframe');
    frameWkAgenda.id = 'frameWkAgenda';
    frameWkAgenda.style.width = ($(document).width()-200)+'px';
    frameWkAgenda.style.height = '600px';
    frameWkAgenda.setAttribute("src", url);
    fieldset.appendChild(frameWkAgenda);
    $.fancybox({
        'width'		: $(document).width(),
        'height'	: 600,
        'padding'	: 3,
        'content'	: fieldset
    });
}

/* LUCA */
function apriWkObiettivi(pDocument){

    Abstract({
        RefreshFunction:apriSintesiBisogni,
        CodFunzione:"WK_OBIETTIVI_GENERALE",
        DescrFunzione:"Wk Obiettivi generale",
        InfoRegistrazione:true,
        Destinazione:(typeof pDocument != 'undefined' ? pDocument : 'FRAME'),
        GetUrlFunction:getUrlWkObiettivi
    });

    function getUrlWkObiettivi(pDati){
        var confScheda = getConfScheda('WK_OBIETTIVI_GENERALE',pDati);
        if(!confScheda.valid)
            return "blank.htm";

        var url = "servletGenerator?KEY_LEGAME="+confScheda.KEY_LEGAME;
        url += "&REPARTO=" + pDati.reparto;
        url += "&READONLY=" + (ModalitaCartella.isReadonly(pDati)?'S':'N');
        url += "&IDEN_VISITA="+ FiltroCartella.getIdenRiferimento(pDati);
        url += "&IDEN_VISITA_REGISTRAZIONE="+ pDati.iden_visita;

        return url;
    }
}

/* LINO */
function checkLetteraFirmata(){
    var vRs = executeQuery("lettere.xml","getLetteraDimissioniFirmata",[getRicovero("IDEN")]);
    if(vRs.next()) {
        return true;
    }else{
        return false;
    }
}

/*darioc*/
function compilaSDO(){
	var url='';
	var idenContatto='';
	
	SplitCodice = CartellaPaziente.getAccesso("CODICE_MODALITA_CARTELLA").split('_');
	if(SplitCodice[1]=='READONLY')
		return alert('Funzionalità non disponibile');	
	
	if(window.baseReparti.getValue(getRicovero('COD_CDC'),'NUOVA_ADT')!='S'){
		return alert("Funzionalità non disponibile");
	}
	 var rs = executeQuery("SDO.xml","getContatto",[getRicovero('NUM_NOSOLOGICO')]);
	 if(rs.next()){
		idenContatto=rs.getString("CONTATTO");
    }
	 
	 var aTmp = document.location.href.split('/');
	 var sRet = '';
	 for(var idx = 0; idx < aTmp.length - 2; sRet += aTmp[idx++] + "/");
	 url=sRet+"onesys-adt/Autologin?";
	 url+="username="+baseUser.LOGIN+"&nomeHost="+basePC.IP+"&NO_APPLET=N";
	 url+="&scheda=ACC_RICOVERO%26IDEN_ANAG="+getPaziente("IDEN")+"%26SDO%3DS%26STATO_PAGINA=E%26IDEN_CONTATTO="+idenContatto+"%26EXIT_ALL=S";

	var finestra = window.open(url,"","fullscreen=yes"); 
}

/*darioc*/
function inserisciInListaAttesa(){
	var url='';
	var aTmp = document.location.href.split('/');
	var sRet = '';
	for(var idx = 0; idx < aTmp.length - 2; sRet += aTmp[idx++] + "/");
	 url=sRet+"onesys-adt/Autologin?";
	 url+="username="+baseUser.LOGIN;
	 url+="&scheda=LISTA_ATTESA_SCELTA%26IDEN_ANAG="+getPaziente("IDEN")+"%26STATO_PAGINA=T%26nomeHost="+basePC.IP+"%26NO_APPLET=N";

	var finestra = window.open(url,"","fullscreen=yes"); 
}

//linob
var CARTELLA_CARDIOLOGICA = {

	apriTabCartellaCardiologica:function(pCodFunzione,pDescrFunzione,pKeyConfigurazione){
		Abstract({
			RefreshFunction:CARTELLA_CARDIOLOGICA.apriTabCartellaCardiologica,
			CodFunzione:pCodFunzione,
			DescrFunzione:pDescrFunzione,
			InfoRegistrazione:true,
			GetUrlFunction:getUrlTabCartellaCardiologica
		});
	
		function getUrlTabCartellaCardiologica(pDati){
			var confScheda = getConfScheda(pCodFunzione,pDati);
			if(!confScheda.valid)
				return "blank.htm";

			var url = "servletGenerator?KEY_LEGAME=TABULATORE";
			url += "&READONLY=" + (ModalitaCartella.isReadonly(pDati)?'S':'N');
			url += "&IDEN_VISITA="+ FiltroCartella.getIdenRiferimento(pDati);
			url += "&IDEN_VISITA_REGISTRAZIONE="+ pDati.iden_visita;
			url += "&KEY="+pKeyConfigurazione;
	
			return url;
		}
	}
	
//	pKeyConfigurazione 	= "CARTELLA MEDICA CARDIOLOGICA" , CARTELLA INFERMIERISTICA CARDIOLOGICA"
//	pCodFunzione		= "TABULATORE_CARTELLA_MEDICA_CARDIOLOGICA" , "TABULATORE_CARTELLA_INFERMIERISTICA_CARDIOLOGICA"
//	pDescrFunzione 		= "Cartella Cardiologica","?"
};

/* UBE */
function apri36Settimana(pDocument) {
    Abstract({
        RefreshFunction     : apri36Settimana,
        CodFunzione         : "SETTIMANA36",
        DescrFunzione       : "36 Settimana",
        InfoRegistrazione   : true,
        GetUrlFunction      : getUrl36Settimana,
        Destinazione        : (typeof pDocument != 'undefined' ? pDocument : 'FRAME')
    });

    function getUrl36Settimana(pDati) {
        confScheda = getConfScheda('SETTIMANA36', pDati);
        if (!confScheda.valid) {return "blank.htm";}

        var url =   "servletGenerator?KEY_LEGAME=" + confScheda.KEY_LEGAME;
        url     +=  "&FUNZIONE=" + pDati.funzioneAttiva;
        url     +=  "&IDEN_ANAG=" + pDati.iden_anag;
        url     +=  "&REPARTO=" + pDati.reparto;
        url     +=  "&READONLY=" + ModalitaCartella.isReadonly(pDati);
        url     +=  "&IDEN_VISITA=" + FiltroCartella.getIdenRiferimento(pDati);
        url     +=  "&IDEN_VISITA_REGISTRAZIONE=" + pDati.iden_visita;
        url     +=  "&DATA_ULTIMA_MODIFICA=" + confScheda.DATA_ULTIMA_MODIFICA;

        if(confScheda.SITO != null && confScheda.SITO !=''){url+="&SITO="+confScheda.SITO;}
        if(confScheda.VERSIONE != null && confScheda.VERSIONE !=''){url+="&VERSIONE="+confScheda.VERSIONE;}

        return	url;
    }
}

/* UBE */
function apriMonitoraggio(pDocument) {
    Abstract({
        RefreshFunction     : apriMonitoraggio,
        CodFunzione         : "MONITORAGGIO",
        DescrFunzione       : "Monitoraggio",
        InfoRegistrazione   : true,
        GetUrlFunction      : getUrlMonitoraggio,
        Destinazione        : (typeof pDocument != 'undefined' ? pDocument : 'FRAME')
    });

    function getUrlMonitoraggio(pDati) {
        confScheda = getConfScheda('MONITORAGGIO', pDati);
        if (!confScheda.valid) {return "blank.htm";}

        var url =   "servletGenerator?KEY_LEGAME=" + confScheda.KEY_LEGAME;
        url     +=  "&FUNZIONE=" + pDati.funzioneAttiva;
        url     +=  "&IDEN_ANAG=" + pDati.iden_anag;
        url     +=  "&REPARTO=" + pDati.reparto;
        url     +=  "&READONLY=" + ModalitaCartella.isReadonly(pDati);
        url     +=  "&IDEN_VISITA=" + FiltroCartella.getIdenRiferimento(pDati);
        url     +=  "&IDEN_VISITA_REGISTRAZIONE=" + pDati.iden_visita;
	
        if(confScheda.SITO != null && confScheda.SITO !=''){url+="&SITO="+confScheda.SITO;}
        if(confScheda.VERSIONE != null && confScheda.VERSIONE !=''){url+="&VERSIONE="+confScheda.VERSIONE;}

        return url;
    }
}

/* UBE */
function apriEsameObiettivoSpecialistico(pDocument) {
    Abstract({
        RefreshFunction     : apriEsameObiettivoSpecialistico,
        CodFunzione         : "ESAME_OBIETTIVO_SPECIALISTICO",
        DescrFunzione       : "Esame Obiettivo Specialistico",
        InfoRegistrazione   : true,
        GetUrlFunction      : getUrlEsameObiettivoSpecialistico,
        Destinazione        : (typeof pDocument != 'undefined' ? pDocument : 'FRAME')
    });

    function getUrlEsameObiettivoSpecialistico(pDati) {

        confScheda = getConfScheda('ESAME_OBIETTIVO_SPECIALISTICO', pDati);
        if (!confScheda.valid) {return "blank.htm";}
	   var url =   "servletGenerator?KEY_LEGAME=" + confScheda.KEY_LEGAME;
       url     +=  "&FUNZIONE=" + pDati.funzioneAttiva;
       url     +=  "&REPARTO=" + pDati.reparto;
       url     +=  "&READONLY=" + ModalitaCartella.isReadonly(pDati);
       url     +=  "&IDEN_VISITA=" + FiltroCartella.getIdenRiferimento(pDati);
       url     +=  "&IDEN_VISITA_REGISTRAZIONE=" + pDati.iden_visita;


        if(confScheda.SITO != null && confScheda.SITO !=''){url+="&SITO="+confScheda.SITO;}
        if(confScheda.VERSIONE != null && confScheda.VERSIONE !=''){url+="&VERSIONE="+confScheda.VERSIONE;}
        return url;
    }
}

/* UBE */
function apriTriage(pDocument) {
    Abstract({
        RefreshFunction     : apriTriage,
        CodFunzione         : "TRIAGE",
        DescrFunzione       : "Triage",
        InfoRegistrazione   : true,
        GetUrlFunction      : getUrlTriage,
        Destinazione        : (typeof pDocument != 'undefined' ? pDocument : 'FRAME')
    });

    function getUrlTriage(pDati) {
        confScheda = getConfScheda('TRIAGE', pDati);
        if (!confScheda.valid) {return "blank.htm";}
        var url =   "servletGenerator?KEY_LEGAME=" + confScheda.KEY_LEGAME;
        url     +=  "&FUNZIONE=" + pDati.funzioneAttiva;
        url     +=  "&IDEN_ANAG=" + pDati.iden_anag;
        url     +=  "&REPARTO=" + pDati.reparto;
        url     +=  "&READONLY=" + ModalitaCartella.isReadonly(pDati);
        url     +=  "&IDEN_VISITA=" + FiltroCartella.getIdenRiferimento(pDati);
        url     +=  "&IDEN_VISITA_REGISTRAZIONE=" + pDati.iden_visita;

        if(confScheda.SITO != null && confScheda.SITO !=''){url+="&SITO="+confScheda.SITO;}
        if(confScheda.VERSIONE != null && confScheda.VERSIONE !=''){url+="&VERSIONE="+confScheda.VERSIONE;}

        return url;
    }
}

/* UBE */
function apriDiarioOste(){
    apriDiario("OSTETRICO");
}

/* UBE */
function apriPartogrammaParto(pDocument) {
    Abstract({
        RefreshFunction     : apriPartogrammaParto,
        CodFunzione         : "PARTOGRAMMA_PARTO",
        DescrFunzione       : "Partogramma e Parto",
        InfoRegistrazione   : true,
        GetUrlFunction      : getUrlPartogrammaParto,
        Destinazione        : (typeof pDocument != 'undefined' ? pDocument : 'FRAME')
    });

    function getUrlPartogrammaParto(pDati) {
        confScheda = getConfScheda('PARTOGRAMMA_PARTO', pDati);
        if (!confScheda.valid) {return "blank.htm";}
        
        var url =   "servletGenerator?KEY_LEGAME=" + confScheda.KEY_LEGAME;
        url     +=  "&FUNZIONE=" + pDati.funzioneAttiva;
        url     +=  "&IDEN_ANAG=" + pDati.iden_anag;
        url     +=  "&REPARTO=" + pDati.reparto;
        url     +=  "&READONLY=" + ModalitaCartella.isReadonly(pDati);
        url     +=  "&IDEN_VISITA=" + FiltroCartella.getIdenRiferimento(pDati);
        url     +=  "&IDEN_VISITA_REGISTRAZIONE=" + pDati.iden_visita;
	
        if(confScheda.SITO != null && confScheda.SITO !=''){url+="&SITO="+confScheda.SITO;}
        if(confScheda.VERSIONE != null && confScheda.VERSIONE !=''){url+="&VERSIONE="+confScheda.VERSIONE;}

        return url;
    }
}

/*
 * @author:linob
 * 
 * Visita Anestesiologica per i pre-operatori
 * pIdenTestata = infoweb.testata_richieste.iden
 * pIdenRef     = radsql.cc_lettera_versioni.iden  
 */
function apriRefertoVisitaAnestesiologica(pIdenTestata,pIdenRef){

    var idenTestata;
    var idenReferto;  
    if (typeof(pIdenTestata)=='undefined'){
        /*chiamata dalla wk dei ricoverati*/
        var pBinds = new Array();
        pBinds.push(getRicovero("IDEN")); // doppio OK
        pBinds.push(getRicovero("IDEN"));
        pBinds.push(getPrericovero("IDEN"));
        pBinds.push(getPrericovero("IDEN"));
        pBinds.push('11');
        var vRs = executeQuery("OE_Refertazione_Visita_Anestesiologica.xml","searchLastRefertoAnestesiologico",pBinds);
        if(vRs.next()) {
            idenTestata = vRs.getString("IDEN");
            idenReferto = vRs.getString("IDEN_REF")==''?-1:vRs.getString("IDEN_REF");
        }
    }else{
        idenTestata = pIdenTestata;
        idenReferto = pIdenRef;  
    }
    var idenTerapiaAssociata = 0;
    if (idenReferto>-1){
    	var pBinds = new Array();
    	pBinds.push(idenReferto)
    	var vRs = executeQuery("OE_Refertazione_Visita_Anestesiologica.xml","searchTerapiaAssociata",pBinds);
        if(vRs.next()) {
        	idenTerapiaAssociata = vRs.getString("IDEN_TERAPIA_ASSOCIATA");
        }
    }

    var pDatiRefertazione ={
        funzione    : 'VISITA_ANESTESIOLOGICA',
        idenTes     : idenTestata,
        tabPerTipo  : baseUser.TIPO,
        datiPaz     : getPaziente('INTESTAZIONE'),
        repProv     : getRicovero('COD_CDC'),
        idenVis     : getRicovero('IDEN'),
        idenAna     : getPaziente('IDEN'),
        nosolog     : getRicovero('NUM_NOSOLOGICO'),
        idenRef     : idenReferto,
        repDest     : getRicovero('COD_CDC'),
        idRemoto    : getPaziente('ID_REMOTO'),
        idenTerAss	: idenTerapiaAssociata
                    
    }; 

    apriConsolleRefertazioneVisitaAnestesiologica(pDatiRefertazione)
    
}
/*
 * @author:linob
 * 
 * Visita Anestesiologica per i pre-operatori
 */
function apriConsolleRefertazioneVisitaAnestesiologica(pRefertazione){
    Abstract({
        RefreshFunction:function(){apriConsolleRefertazioneVisitaAnestesiologica(pRefertazione);},
        CodFunzione:pRefertazione.funzione,
        DescrFunzione:'Referto Visita Anestesiologica',
        GetUrlFunction:getUrlVisitaAnestesiologica
    });

    function getUrlVisitaAnestesiologica(pDati){
        /*
         * controllo tipologia utente?
         * controllo accettazione della visita?
         * */
        if (typeof(pRefertazione.idenTes)=='undefined'){
            utilMostraBoxAttesa(false);
            return "blank.htm";
        }
        
        var url = 	'servletGeneric?class=refertazioneConsulenze.refertazioneAnestesiologicaEngine'+
                    '&paziente='+pRefertazione.datiPaz+
                    '&reparto='+pRefertazione.repProv+
                    '&repartoDest='+pRefertazione.repProv+
                    '&idenVisita='+pRefertazione.idenVis+
                    '&idenAnag='+pRefertazione.idenAna+
                    '&ricovero='+pRefertazione.nosolog+
                    '&funzione='+pRefertazione.funzione+
                    '&idenReferto='+pRefertazione.idenRef+
                    '&idenTes='+pRefertazione.idenTes+
                    '&idRemoto='+pRefertazione.idRemoto+
                    '&tabPerTipo='+pRefertazione.tabPerTipo+
                    '&idenTerapiaAssociata='+pRefertazione.idenTerAss;

        return url;

    }
}


function registraConsenso(tipo){
    param={
        tipo:tipo,
        action:'',
        opener:'cartella'
    };
    switch(tipo){
        case 'INSERIMENTO_CONSENSO_UNICO':
        case 'INSERIMENTO_CONSENSO_EVENTO':            
            param.action = 'INSERISCI';
            break;
        case 'VISUALIZZA_CONSENSO_UNICO':
            param.action = 'VISUALIZZA';
            break;
    }
    
    NS_CONSENSI.gestioneConsenso(param);
}

/* ALEC */
function apriPianificaTerapie(pDocument) {
	
	 Abstract({
	        RefreshFunction     : apriEsameObiettivoSpecialistico,
	        CodFunzione         : "PIANIFICA_TERAPIE",
	        DescrFunzione       : "Pianifica terapie",
	        InfoRegistrazione   : true,
	        GetUrlFunction      : getUrlPianificaTerapie,
	        Destinazione        : (typeof pDocument != 'undefined' ? pDocument : 'FRAME')
	    });
	 
	 function getUrlPianificaTerapie(pDati) {
		 
		 	var url="servletGenerator?KEY_LEGAME=PIANIFICA_TERAPIE" +
		 			"&WHERE_WK=%20where%20IDEN_VISITA%20=%20"+pDati.iden_visita+"%20and%20STATO='B'";
			url+="&ILLUMINA=javascript:illumina_multiplo_generica(this.sectionRowIndex);";
			
			if(ModalitaCartella.isReadonly(pDati))
				url+='&CONTEXT_MENU=WK_TERAPIE_ANAMNESI_LETTURA';
//	        var url =   "servletGenerator?KEY_LEGAME=PIANIFICA_TERAPIE";
//	        url     +=  "&FUNZIONE=" + pDati.funzioneAttiva;
	        url     +=  "&IDEN_ANAG=" + pDati.iden_anag;
	        url     +=  "&REPARTO=" + pDati.reparto;
//	        url     +=  "&STATO_PAGINA=" + (ModalitaCartella.isReadonly(pDati) ? 'L' : 'E');
//	        url     +=  "&IDEN_VISITA=" + FiltroCartella.getIdenRiferimento(pDati);
//	        url     +=  "&IDEN_VISITA_REGISTRAZIONE=" + pDati.iden_visita;*/
//	        url     +=  "&DATA_ULTIMA_MODIFICA=" + confScheda.DATA_ULTIMA_MODIFICA;

//	        if(confScheda.SITO != null && confScheda.SITO !=''){url+="&SITO="+confScheda.SITO;}
//	        if(confScheda.VERSIONE != null && confScheda.VERSIONE !=''){url+="&VERSIONE="+confScheda.VERSIONE;}

	        return 	url;
	    }
}

/* LINO 
function apriTerapiaDomiciliare(){

    Abstract({
        RefreshFunction:apriTerapiaDomiciliare,
        CodFunzione:"TERAPIA_DOMICILIARE",
        DescrFunzione:"Terapia Domiciliare",
        GetUrlFunction:getUrlTerapiaDomiciliare
    });

    function getUrlTerapiaDomiciliare(pDati){
        top.utilMostraBoxAttesa(true);

        var dati	= WindowCartella.getForm(document);
        var url		= "servletGeneric?class=cartellaclinica.lettera.pckInfo.sTerapie";
        url			+= "&idenRicovero=" + pDati.iden_ricovero;
        url			+= "&idenVisita=" + pDati.iden_visita;
                url			+= "&reparto=" + pDati.reparto;

        var pBinds = new Array();
        pBinds.push(pDati.iden_ricovero);
        pBinds.push(pDati.iden_visita);
        pBinds.push(pDati.funzioneAttiva);
        var rs = executeQuery('terapia_domiciliare.xml','getTerapiaDomiciliareFirmata',pBinds);
        if (rs.next()){
            url			+= "&idenLettera="+rs.getString("iden");        	
            url			+= "&stato="+rs.getString("stato");     
        }else{
        	url			+= "&idenLettera=";
            url			+= "&stato=";  
        }
        
        
        url			+= "&idenAnag=" + pDati.iden_anag;
        url			+= "&reparto=" + pDati.reparto;
		url			+= "&farmaciAlBisogno=1";
		url			+= "&funzione="+pDati.funzioneAttiva;

        return url;
    }
}*/


function apriTriagePS(pDati){
    var url;
    var idenContatto;
    var iden_lista;
    var iden_provenienza;
    var idenCdc;
    var stato_pagina;
	var cod_cdc;
    
	var cartella = getPrericovero('NUM_NOSOLOGICO');
    var rs = executeQuery("PS.xml","getDatiContattoTriagePs",[cartella,cartella,getPaziente('IDEN')]);

    if(rs.next()){
        try {
            idenContatto=rs.getString("IDEN_CONTATTO");
            iden_provenienza= rs.getString("IDEN_PROVENIENZA");
            iden_lista = rs.getString("IDEN_LISTA");
            idenCdc = rs.getString("IDEN_CDC");
			cod_cdc =getReparto('COD_CDC');
            stato_pagina = $.parseJSON(rs.getString("JSON_STATO_PAGINA"));
        }catch(e){	
            alert(e.message);
        }
    }
    //alert('idenContatto'+idenContatto+'\niden_provenienza'+iden_provenienza+'\niden_lista'+iden_lista+'\nidenCdc'+idenCdc+'\nstato_pagina'+stato_pagina);
	  if(window.baseReparti.getValue(getRicovero('COD_CDC'),'URL_AUTOLOGIN_PS')  != null ){
		 try {
        eval("url_auto_login="+window.baseReparti.getValue(getRicovero('COD_CDC'),'URL_AUTOLOGIN_PS'));
        url =  url_auto_login.ricovero.url_auto_login;

		}catch(e){
			alert(e);
		}
	}else{
		url = "http://10.106.0.115:8082/onesys-ps/Autologin?";
		stato_pagina = {ESAME_OBIETTIVO:'E'}
	 }
	 if (getRicovero('COD_CDC')=='OBI_SV'){
		 var aTmp = document.location.href.split('/');
		 var sRet = '';
		 for(var idx = 0; idx < aTmp.length - 2; sRet += aTmp[idx++] + "/");
	    	url =sRet+"crystal/?report=/usr/local/report/fenix/PS/1/DIARI_CLINICO_PS_OBI.RPT&init=pdf&promptpIdenContatto=" + idenContatto +"&ts=" + new Date().getTime();
	    }

	 else{
		    try{
		        url += 'username='   +  baseUser.LOGIN+
		            '&scheda=ESAME_OBIETTIVO' +
		            '%26IDEN_ANAG=' + getPaziente("IDEN") +
		            '%26IDEN_CONTATTO=' + idenContatto+
		            '%26nomeHost=' + basePC.IP +
		            '%26NO_APPLET=N' +
		            '%26TEMPLATE=CODICE_COLORE/CodiceColore.ftl' +
		            '%26IDEN_LISTA=' + iden_lista +
		            '%26IDEN_CDC_PS=' + idenCdc +
					'%26COD_CDC='+ cod_cdc +
		            '%26IDEN_PROVENIENZA=' + iden_provenienza +
		            '%26IDEN_PER=' + baseUser.IDEN_PER +
		            '%26USERNAME=' + baseUser.LOGIN+
		            '%26IDEN_ESA_VISITA_PRONTO_SOCCORSO=10517' +
		            '%26TIPO_PERSONALE=' + baseUser.TIPO+
		            '%26SCHEDA=ESAME_OBIETTIVO&STATO_PAGINA='+stato_pagina.ESAME_OBIETTIVO;
		
		    }catch(e){alert(e.message)}
	 	}
    utilMostraBoxAttesa(false);
    var finestra = window.open(url,"","fullscreen=yes");

}


/**
 * Apre la pagina di Pronto Soccorso per chiudere un O.B.I.
 */
function apriChiusuraOBI() {
	try {		
		var cartella = getPrericovero('NUM_NOSOLOGICO');
		var rs = executeQuery("PS.xml","getDatiContatto",[cartella,cartella,getPaziente('IDEN')]);
		if(rs.next()){
			var url;
			if (window.baseReparti.getValue(getRicovero('COD_CDC'),'URL_AUTOLOGIN_PS')  != null) {
				var obj = {};
				eval("obj="+window.baseReparti.getValue(getRicovero('COD_CDC'),'URL_AUTOLOGIN_PS'));
		        url =  obj.ricovero.url_auto_login;
			} else {
				url = "http://10.106.0.115:8082/onesys-ps/Autologin?";
			}
			
			// Parametri GET
			url += "username=" + baseUser.LOGIN;
			url += "&nomeHost=" + basePC.IP;
			url += "&scheda=VERBALE";
			url += "%26NO_APPLET%3DN";
			url += "%26IDEN_CONTATTO%3D" + rs.getString("IDEN_CONTATTO");
			url += "%26IDEN_PROVENIENZA%3D" + rs.getString("IDEN_PROVENIENZA");
			url += "%26IDEN_CDC_PS%3D" + rs.getString("IDEN_CDC");
			url += "%26IDEN_LISTA%3D" + rs.getString("IDEN_LISTA"); // ADT.LISTA_ATTESA => iden dell'ultimo record attivo='S' e deleted='N' per quell'iden_contatto
			url += "%26TEMPLATE%3DCODICE_COLORE/CodiceColore.ftl";
			url += "%26SITO%3DPS";
			url += "%26SCHEDA%3DVERBALE";
			url += "%26STATO_PAGINA%3D" + $.parseJSON(rs.getString("JSON_STATO_PAGINA"))['VERBALE']; // se sulla tabella ps_schede_xml esiste già un record con scheda='VERBALE' and attivo='S'
																								 // and deleted='N' lo stato della pagina sarà ='E' altrimenti se non ci sono record precedenti stato='I'
			utilMostraBoxAttesa(false);
			window.open(url,"","fullscreen=yes");
		} else {
			throw new Error("Impossibile aprire la funzionalità richiesta");
		}
	} catch(e) {
		alert(e.message);
	}
}

function setEmergenzaMedica() {
    if (getPaziente('EMERGENZA_MEDICA') == 'FALSE') {
    	url = "insNotaEmergenzaMedica.html";   	
    	parent.$.fancybox({
    		'padding'	: 3,
    		'width'		: 800,
    		'height'	: 350,
    		'href'		: url,
    		'type'		: 'iframe'
    	});
  
    } else {
    	abilitaEmergenzaMedica(false,'');
    }
    refreshPage();
};

function abilitaEmergenzaMedica(abilita,nota){

	if (abilita){
	dwr.engine.setAsync(false);
	dwrTraceUserAction.openTraceUserActionEmergenza('SET_EMERGENZA_MEDICA',CartellaPaziente.getPaziente("IDEN"),'CARTELLA',nota,CartellaPaziente.getAccesso("IDEN"));
	dwr.engine.setAsync(true);	
		
    $(".emergenzaMedicaFalse").toggleClass('emergenzaMedicaTrue');
    $(".emergenzaMedicaFalse").toggleClass('emergenzaMedicaFalse');
    getPaziente().EMERGENZA_MEDICA = 'TRUE' ;
    Labels.setEmergenzaMedica();
	}
	else{
        $(".emergenzaMedicaTrue").toggleClass('emergenzaMedicaFalse');
        $(".emergenzaMedicaTrue").toggleClass('emergenzaMedicaTrue');
        getPaziente().EMERGENZA_MEDICA = 'FALSE' ;
        Labels.svuotaEmergenzaMedica();
        dwr.engine.setAsync(false);
        dwrTraceUserAction.closeTraceUserAction('SET_EMERGENZA_MEDICA', (getForm().iden_visita == '' ? getForm().iden_ricovero : getForm().iden_visita), callBack);
        dwr.engine.setAsync(true);	
        function callBack(resp) {
            if (resp != '')
                alert(resp);
        }
	}
	
}



function inserisciPositivitaGermi(){
	
	SplitCodice = CartellaPaziente.getAccesso("CODICE_MODALITA_CARTELLA").split('_');
	if(SplitCodice[1]=='READONLY')
		return alert('Funzionalità non disponibile');	
	
	$.fancybox({
		'padding'	: 3,
		'width'		: 350,
		'height'	: 175,
		'href'		: 'inserimentoGermi.html',
		'type'		: 'iframe'
	});
}

function progettoMetal(pDocument){
	Abstract({
		RefreshFunction: function(){
			progettoMetal(pDocument);
		},
		CodFunzione:'PROGETTO_METAL',
		DescrFunzione:"Progetto Metal",
		GetUrlFunction:getUrlProgettoMetal,
		Destinazione:(typeof pDocument === 'object' && pDocument != null ? pDocument : 'FRAME')
	});
	
	function getUrlProgettoMetal(pDati){
		var where;
		where = " where IDEN_VISITA=" + getRicovero("IDEN");
		//utilMostraBoxAttesa(false);
		var url = "servletGenerator?KEY_LEGAME=WORKLIST"
		+"&TIPO_WK=WK_PROGETTO_METAL"
		+"&WHERE_WK="+where
		+"&ILLUMINA=javascript:illumina(this.sectionRowIndex);";
		
		return url;
	}
}

function progettoRiabilitativo(pDocument){
	Abstract({
		RefreshFunction: function(){
			progettoRiabilitativo(pDocument);
		},
		CodFunzione:'PROGETTO_RIABILITATIVO',
		DescrFunzione:"Progetto riabilitativo individuale",
		GetUrlFunction:getUrlProgettoMetal,
		Destinazione:(typeof pDocument === 'object' && pDocument != null ? pDocument : 'FRAME')
	});
	
	function getUrlProgettoMetal(pDati){
		var where;
		where = " where IDEN_VISITA=" + getRicovero("IDEN");
		//utilMostraBoxAttesa(false);
		var url = "servletGenerator?KEY_LEGAME=WORKLIST"
		+"&TIPO_WK=WK_PROGETTO_RIABILITATIVO"
		+"&WHERE_WK="+where
		+"&ILLUMINA=javascript:illumina(this.sectionRowIndex);";
		
		return url;
	}
}

function apriDiarioMET(tipo, pDocument, options){
	Abstract({
		RefreshFunction: function(){
			progettoMetal(pDocument);
		},
		CodFunzione:'DIARIO_MET',
		DescrFunzione:"Diari",
		GetUrlFunction:getUrlDiarioMET,
		Destinazione:(typeof pDocument === 'object' && pDocument != null ? pDocument : 'FRAME')
	});
	
	function getUrlDiarioMET(pDati){
		var url = "servletGenerator?";
        var parametri = [];
		
        // Configurazione automatica dei parametri
		parametri["KEY_LEGAME"] = "DIARI";
		parametri["KEY_IDEN_VISITA"] = pDati.iden_visita;
		parametri["KEY_NOSOLOGICO"] = pDati.ricovero;
		parametri["KEY_TIPO_DIARIO"] = tipo;
		parametri["CONTEXT_MENU"] = (ModalitaCartella.isReadonly(pDati)?"LETTURA":"");
		parametri["REPARTO"] = pDati.reparto;
		
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
    	
        if (typeof parametri['KEY_LEGAME'] === 'string' && parametri['KEY_LEGAME'] != '')
        	return url;
        
        alert('Scheda non configurata per la selezione effettuata');
        return "blank.htm";
	}
}

/**
 * 
 * @param obj -> voce di menu su cui viene cliccato
 * @param statement -> statement per la creazione dei li(statement bisogni e scale)
 */
function setMenuLi(obj,statement,categoria){
	var objParent = $(obj).parent();

	var $ul;
//	cerco ul e elimino se ci sono i li
	if (objParent.has('ul')){
		$ul = objParent.find('ul');
		$ul.children().remove();
	}else{
		var $ul = $('<ul></ul>');
	}
//	creo i li dalla query passata come parametro	
	var tmpTable = [];
    var dati	= WindowCartella.getForm(document);
	var pBinds = new Array();
	if(statement == 'menuAlbero.setMenuScale') pBinds.push(typeof categoria === 'string' ? categoria : null);
	pBinds.push(dati.iden_ricovero);
	pBinds.push(dati.reparto);
	
	var rs = WindowCartella.executeQuery('menu.xml',statement,pBinds);
	if (rs.getError() != '') {
		alert('Errore in "'+statement+'" (menu.xml)\n'+rs.getError());
		return;
	}
	for (var i=1;rs.next();i=i+1){
		tmpTable[i]= '<li id="id'+rs.getString('LABEL')+'"><a href="#" class="'+rs.getString('GRUPPO')+'" onclick="'+rs.getString('FUNZIONE')+'">'+rs.getString('LABEL')+'</a></li>'
	}
	$ul.append(tmpTable.join(''));
	objParent.append($ul);

  //  $slidemenu.buildmenuClick("slideMenuMain", arrowimages);
  
}

function closeMenuActive(){
	$(".liMenuActive")
		.find("ul")
		.slideUp($slidemenu.animateduration.out)
		.attr("aperto","false");	
	$(".liMenuActive").removeClass("liMenuActive");
	
	$(".topMenuActive")
	.find("ul")
    .slideUp($slidemenu.animateduration.out);
}
