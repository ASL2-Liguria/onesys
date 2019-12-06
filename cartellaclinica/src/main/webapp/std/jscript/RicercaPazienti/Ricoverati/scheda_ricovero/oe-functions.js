/* ARRY */
function apriDatiLaboratorio(pParametri){

    Abstract({
        RefreshFunction:function(){apriDatiLaboratorio();},
        CodFunzione:"DATI_LABORATORIO",
        DescrFunzione:"Dati Laboratorio",
        GetUrlFunction:getUrl,
        CheckFiltroData:false,
        CheckFiltroNrRichieste:false
    });
	
	return;
    function getUrl(pDati){
		
		var url = 'servletGeneric?class=cartellaclinica.cartellaPaziente.datiStrutturatiLabo.listDocumentLaboratorioFiltro';
    	
		
    	function getUrlParameter(name){
	
			var tmpURL = document.location.href;
			var regexS = "[\\?&]"+name+"=([^&#]*)";
			var regex = new RegExp( regexS );
			var results = regex.exec( tmpURL );
			
			if( results == null )
				return "";
			else
				return results[1];
		};
			
		var chiamata	= getUrlParameter('provChiamata') == '' ? chiamata = 'CARTELLA' : chiamata 	= getUrlParameter('provChiamata'); 


		if(typeof pParametri != 'undefined')
			url += '&reparto=' + pParametri.reparto + '&idenAnag=' + top.getPaziente('IDEN') + '&idenRichiesta=' + pParametri.idenRichiesta + '&provChiamata=CARTELLA&modalita=PAZIENTE_RICHIESTA';
		else{
		switch (chiamata)
		{
			case 'AMBULATORIO': 
				url += '&modalita=PAZIENTE';
				url +=  '&provChiamata=' + chiamata + '&idenAnag=' + getUrlParameter('iden_anag')+ '&userLogin=' + getUrlParameter('ute') + '&numRichieste=10';
				break;
				
			case 'CARTELLA':
				switch (FiltroCartella.getLivelloValue())
				{
					case 'IDEN_ANAG':
						url += '&modalita=PAZIENTE';
					case 'ANAG_REPARTO':
						url += '&modalita=PAZIENTE_REPARTO';
					case 'NUM_NOSOLOGICO':	
						url += '&modalita=RICOVERO';
				}
				
				url += '&reparto='+top.getForm().reparto+'&idenAnag=' + top.getPaziente('IDEN') + '&provChiamata=' + chiamata;
				break;

		}
		}

	    return url;
		
		
    }

}
/*Darioc*/
function apriDatiMicrobiologia(pParametri){

    Abstract({
        RefreshFunction:function(){apriDatiMicrobiologia(pParametri);},
        CodFunzione:"DATI_MICROBIOLOGIA",
        DescrFunzione:"Dati microbiologia",
        GetUrlFunction:getUrl,
        CheckFiltroData:false,
        CheckFiltroNrRichieste:false
    });
	
	return;
    function getUrl(pDati){
		
    	var url = 'servletGeneric?class=cartellaclinica.cartellaPaziente.datiMicrobiologia.datiMicrobiologiaFiltro';


		
        return url;
		
		
    }

}

/* DARIO */
function apriDatiTrasfusionale(pParametri){

    Abstract({
        RefreshFunction:function(){apriDatiTrasfusionale(pParametri);},
        CodFunzione:"DATI_TRASFUSIONALE",
        DescrFunzione:"Dati Trasfusionale",
        GetUrlFunction:getUrl
    });

    function getUrl(pDati){

        url = 'servletGeneric?class=cartellaclinica.datiStrutturati.datiStruttTrasfusionale.datiStruttTrasfusionale';
        if (pParametri==undefined){// chiamata da wk ricoverati
            url+='&reparto='+pDati.reparto;
            switch (FiltroCartella.getLivelloValue()){
                case 'ANAG_REPARTO': 	url += '&idPatient='+pDati.idRemoto;
                    break;
                case 'NUM_NOSOLOGICO':
                    if(pDati.iden_prericovero == null || pDati.iden_prericovero == ""){
                        url += '&nosologico='+pDati.ricovero;
                    }else{
                        url += '&nosologico='+pDati.ricovero+','+pDati.prericovero;
                    }
                    break;
                default:return ;
                    break;
            }
        }else{		// chiamata da wk richieste
            url += '&idenRichiesta='+pParametri.idenRichiesta+'&reparto='+pParametri.reparto;
        }

        return url;
    }

}

// LUCA
function apriPrenotazione(pIdenEsame){
    FiltroCartella.off(getForm());
    getFrame().src='schedaEsame?tipo_registrazione=X&Hiden_esame=' + pIdenEsame;
}

// LUCA
function apriRichiesta(/*pParametri*/pIdenRichiesta,pModifica){

    Abstract({
        RefreshFunction:function(){apriRichiesta(pIdenRichiesta,pModifica);},
        CodFunzione:(pModifica=='S'?"MODIFICA_RICHIESTA":"VISUALIZZA_RICHIESTA"),
        DescrFunzione:(pModifica=='S'?"Modifica Richiesta":"Visualizza Richiesta"),
        CheckFiltroLivello:false,
        GetUrlFunction:getUrlRichiesta
    });

    function getUrlRichiesta(pDati){

        try{
            var rs = executeQuery("OE_Richiesta.xml","getRichiesta",[pIdenRichiesta]);

            if(rs.next()){
                url =  'servletGenerator?KEY_LEGAME=' 	+ rs.getString("KEY_LEGAME")//pParametri.key_legame;
                url+= '&VERSIONE='						+ rs.getString("VERSIONE")//pParametri.versione;
                url+= '&IDEN='							+ rs.getString("IDEN_XML")//pParametri.iden;
                url+= '&DESTINATARIO='					+ rs.getString("CDC")//pParametri.destinatario;
                url+= '&KEY_ID='						+ rs.getString("IDEN")//pParametri.iden_richiesta;	//
                url+= '&URGENZA='						+ rs.getString("URGENZA")//pParametri.urgenza;			//
                url+= '&Hiden_anag='					+ rs.getString("IDEN_ANAG")//pParametri.iden_anag; 		//
                url+= '&Hiden_pro='						+ rs.getString("IDEN_TAB_PRO")//pParametri.iden_pro;  		//
                url+= '&Hiden_visita='					+ rs.getString("IDEN_VISITA")//pParametri.iden_visita; 		//
                url+= '&HrepartoRicovero='				+ rs.getString("REPARTO")//pParametri.sorgente;
                url+= '&TIPOLOGIA_RICHIESTA='			+ rs.getString("TIPOLOGIA_RICHIESTA")//pParametri.tipologia;
                url+= '&ID_STAMPA=&STAMPA=N';
                url+= '&MODIFICA='						+ pModifica;//pParametri.modifica;
                url+= '&LETTURA='						+ (pModifica=='S' ? 'N' : 'S');//pParametri.lettura;

                return url;
            }

        }catch(e){
            alert(e.description);
            return null;
        }
    }
}

function apriRichiestaLettura(pIdenRichiesta){
    apriRichiesta(pIdenRichiesta,'N');
}

function apriRichiestaModifica(pIdenRichiesta){
    apriRichiesta(pIdenRichiesta,'S');
}
/* linob */
function apriVisualizzaEsamiStrumentali(){
    Abstract({
        RefreshFunction:function(){apriVisualizzaEsamiStrumentali()},
        CodFunzione:'VISUALIZZA_ESAMI_STRUMENTALI',
        DescrFunzione:"Visualizza Esami Strumentali",
        GetUrlFunction:getUrlVisualizzaEsamiStrumentali
    });
	function getUrlVisualizzaEsamiStrumentali(pDati){
	        var where = "where id_remoto = '"+pDati.idRemoto+"'";
	        
	        var url = "servletGenerator?KEY_LEGAME=WK_ESAMI_IMMAGINI"
	            +"&WHERE_WK="+where
	            +"&ILLUMINA=javascript:illumina(this.sectionRowIndex);";
	        utilMostraBoxAttesa(false);
	        return url;
	}
}
/* FRA */
function apriWorkListPrestazioni(obj){

    Abstract({
        RefreshFunction:apriWorkListPrestazioni,
        CodFunzione:'WORKLIST_ESAMI',
        DescrFunzione:"Prestazioni interne",
        GetUrlFunction:getUrlWorkListPrestazioni
    });

    function getUrlWorkListPrestazioni(pDati){

        var dati_ambulatorio = CartellaPaziente.getRiferimentiAmbulatorio();

        var where;
        switch(FiltroCartella.getLivelloValue()){
            case 'IDEN_VISITA':		where = " where cod4 ='" + pDati.iden_visita + "'";
                break;
            case 'NUM_NOSOLOGICO':
                if(pDati.iden_prericovero == ""){
                    where = " where cod3 ='" + pDati.iden_ricovero + "'";
                }else{
                    where = " where cod3  in ('" + pDati.iden_ricovero + "','" + pDati.iden_prericovero + "')";
                }
                break;
            case 'ANAG_REPARTO':	where = " where iden_anag =" + dati_ambulatorio.iden_anag + " and reparto='" + pDati.reparto + "'";
                break;
            default:				where = " where iden_anag =" + dati_ambulatorio.iden_anag ;
                break;
        }

        utilMostraBoxAttesa(false);

        utilMostraBoxAttesa(false);

        var url = "servletGenerator?KEY_LEGAME=WORKLIST"
            +"&TIPO_WK=WK_VISITE_PAZIENTE"
            +"&WHERE_WK="+where
            +"&NOME_POOL=elcoPool_ambulatorio"
            +"&ILLUMINA=javascript:illumina(this.sectionRowIndex);";

        return url; //NS_APPLICATIONS.switchTo("AMBULATORIO",url);
    }
}

function apriWkPrestazioniDaReparto(obj){

    Abstract({
        RefreshFunction:apriWkPrestazioniDaReparto,
        CodFunzione:'WORKLIST_ESAMI_DA_REPARTO',
        DescrFunzione:"Prestazioni ambulatoriali",
        GetUrlFunction:getUrlWorkListPrestazioniRep
    });

    function getUrlWorkListPrestazioniRep(pDati){

        var dati_ambulatorio = CartellaPaziente.getRiferimentiAmbulatorio();
        var where;
        where = " where iden_anag =" + dati_ambulatorio.iden_anag + " and reparto in("+obj.cdc_ambu+")";
   
        utilMostraBoxAttesa(false);
        var url = "servletGenerator?KEY_LEGAME=WORKLIST"
            +"&TIPO_WK=WK_VISITE_PAZIENTE"
            +"&WHERE_WK="+where
            +"&CONTEXT_MENU=WK_VISITE_PAZIENTE_REP"
            +"&NOME_POOL=elcoPool_ambulatorio"
            +"&ILLUMINA=javascript:illumina(this.sectionRowIndex);";

        return url; //NS_APPLICATIONS.switchTo("AMBULATORIO",url);
    }
}

/* LUCA */
function apriWorkListRichieste(){
    Abstract({
        RefreshFunction:apriWorkListRichieste,
        CodFunzione:'WORKLIST_RICHIESTE',
        DescrFunzione:"Esami/Consulenze",
        GetUrlFunction:getUrlWorkListRichieste
    });

    function getUrlWorkListRichieste(pDati){
        var objDate;
        var vWhere;
        switch(FiltroCartella.getLivelloValue()){
            case 'IDEN_VISITA':		vWhere = " where iden_visita =" + pDati.iden_visita;
                break;
            case 'NUM_NOSOLOGICO':
                /*if(pDati.iden_prericovero == ""){
                    vWhere = " where num_nosologico ='" + pDati.ricovero + "' and iden_visita is not null";
                }else{
                    vWhere = " where num_nosologico in ('" + pDati.ricovero + "','" + pDati.prericovero + "') and iden_visita is not null";
                }*/
                if(pDati.iden_prericovero == ""){
                    vWhere = " where num_nosologico ='" + pDati.ricovero + "' and (iden_visita =" + pDati.iden_ricovero + " or parent = "+ pDati.iden_ricovero +")";
                }else{
                    vWhere = " where num_nosologico in ('" + pDati.ricovero + "','" + pDati.prericovero + "') and (iden_visita in (" + pDati.iden_ricovero + ","+pDati.iden_prericovero+") or parent in ("+ pDati.iden_ricovero +","+pDati.iden_prericovero+"))";
                }				
                break;
            case 'ANAG_REPARTO':	vWhere = " where iden_anag =" + pDati.iden_anag + " and codice_reparto_prov='" + pDati.reparto + "'";
                break;
            default:				vWhere = " where iden_anag =" + pDati.iden_anag ;
                break;
        }

        objDate	= ModalitaCartella.getFilterData(pDati);
  
        /*if(FiltroCartella.getDaDataEnable()){
            vWhere += " and DATA_FILTRO >= '" + FiltroCartella.getDaDataValue() + "'";
        }

        if(FiltroCartella.getADataEnable()){
            vWhere += " and DATA_FILTRO <= '" + FiltroCartella.getADataValue() + "'";
        }*/
        // alert(vWhere);
        
        var vDati = getForm();
        var pulsante = baseReparti.getValue(vDati.reparto,'OE_PULSANTI_WKRICHIESTE');
        var wkRic = baseReparti.getValue(vDati.reparto,'OE_WK_RICHIESTE_PAZIENTE_TIPO_WK');
        //var pulsante= "pulsWkRich,Inserimento Richieste,insRichCartella()@"
        //		+ "pulsWkPren,Inserimento Prenotazioni,insPrenCartella()@";

        /*
         * var url =
         * "worklistRichieste?Htipowk=WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE";
         * url += "&hidWhere=" + vWhere + " and iden_visita is not null";//aggiunta
         * per ridurre il peso della query url += "&hidOrder= iden"; url +=
         * "&pulsanti="+pulsante;
         */

        var url = "servletGenerator?KEY_LEGAME=FILTRI_WK_RICHIESTE&KEY_WORKLIST=worklistRichieste&Htipowk="+wkRic;
        url += "&hidWhere=" + vWhere;
        url += "&hidOrder= iden";
        url += "&pulsanti="+pulsante;
        url += "&filtri=S";

        if(CartellaPaziente.checkPrivacy('WK_RICHIESTE')){
	        url += "&COD_DEC="+baseUser.COD_DEC;
	        url += "&COD_FISC="+$("form[name='frmPaziente'] input[name='COD_FISC']").val();
	        url += "&PREDICATE_FACTORY=" + encodeURIComponent(privacy.WK_RICHIESTE.PREDICATE_FACTORY);
	        url += "&BUILDER=" + encodeURIComponent(privacy.WK_RICHIESTE.BUILDER);
	        url += "&SET_EMERGENZA_MEDICA="+getPaziente("EMERGENZA_MEDICA");
	        url += "&ID_REMOTO="+getPaziente("ID_REMOTO");        
	        url += "&QUERY=getListDocumentPatient";
	        url += "&TIPOLOGIA_ACCESSO="+document.EXTERN.ModalitaAccesso.value;
	        url += "&EVENTO_CORRENTE="+getRicovero("NUM_NOSOLOGICO");
        }
        return url;
    }
}

/* LUCA */
//funzione per l'apertura della consultazione della prenotazione a Brescia
function consultaPrenotazione(){

    if(baseUser.TIPO != 'M'){
        return alert('Funzionalità non disponibile');
    }

    var num_nosologico =  top.getForm().ricovero;

    var url = baseGlobal.URL_PRENOTAZIONE + '/autoLogin?USER=' + baseUser.LOGIN ;
    url += '&KEY=PRENOTAZIONE_CONSULTA';
    url += '&ID_NOSO = '+num_nosologico;

    //document.getElementById('frameWork').contentWindow.document.location.replace(url);
    var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);

    if(finestra){
        finestra.focus();
    }else{
        finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
    }
	
    try{
        opener.top.closeWhale.pushFinestraInArray(finestra);
		}
    catch(e){}
    
    utilMostraBoxAttesa(false);
}

/* GRAZIA */
function inserisciConsultaPrenotazione(){

    Abstract({
        RefreshFunction:inserisciConsultaPrenotazione,
        CodFunzione:'CONSULTA_PRENOTAZIONE',
        DescrFunzione:"Prenotazione",
        CheckFiltroLivello:false,
        GetUrlFunction:getUrlConsultaPrenotazione
    });

    function getUrlConsultaPrenotazione(pDati){
        var url ="prenotazioneFrame?servlet=consultazioneInizio";
        url += "&tipo=CDC";
        url += "&events=onunload";
        url +="&actions=libera_all('" + baseUser.IDEN_PER + "', '" + basePC.IP + "')";

        return url;
    }
}

/* FRA/LUCA */
function inserisciEsame(tipoAlbero){

    Abstract({
        RefreshFunction:function(){inserisciEsame(tipoAlbero);},
        CodFunzione:'INSERIMENTO_ESAME',
        DescrFunzione:"Inserimento Esami/Consulenze",
        GetUrlFunction:getUrlInserisciEsame
    });

    function getUrlInserisciEsame(pDati,pFrame){

        pFrame.scrolling = 'auto';

        var url = "servletGenerator?KEY_LEGAME=RICHIESTA_GENERICA_CDC";
        url += "&tipoAlbero="			+ tipoAlbero;
        url += "&Hiden_anag="			+ pDati.iden_anag;
        url += "&Hiden_visita="			+ FiltroCartella.getIdenRiferimento(pDati);
        url += '&Hreparto_ricovero='	+ pDati.reparto;
        url += "&PRENOTAZIONE=N";
        url += "&cod_dec_Reparto="		+ pDati.cod_dec_Reparto;
        url += "&Hiden_pro="			+ pDati.IdenPro;

        return url;
    }
}

/* LUCA */
function inserisciGenerico(pTipoAlbero,pCodFunzione,pDescrFunzione){

    Abstract({
        RefreshFunction:function(){inserisciGenerico(pTipoAlbero,pCodFunzione,pDescrFunzione);},
        CodFunzione:pCodFunzione,
        DescrFunzione:pDescrFunzione,
        GetUrlFunction:getUrl
    });


    function getUrl(pDati,pFrame){

        pFrame.scrolling = 'auto';

        var url = "servletGenerator?KEY_LEGAME=RICHIESTA_GENERICA_CDC";
        url += "&KEY_ID=0";
        url += "&tipoAlbero="			+ pTipoAlbero;
        url += "&Hiden_anag="			+ pDati.iden_anag;
        url += "&Hiden_visita="			+ FiltroCartella.getIdenRiferimento(pDati);
        url += '&Hreparto_ricovero='	+ pDati.reparto;
        url += "&PRENOTAZIONE=N";
        url += "&cod_dec_Reparto="		+ pDati.cod_dec_Reparto;
        url += "&Hiden_pro="			+ pDati.IdenPro;

        return url;
    }
}

//funzione creata per essere richiamata da ambulatorio tramite autologin e gestire le richieste fatte da Riccio
function inserisciRichiesta(tipo){
	var descrFunzione= tipo=='LABO' ? "Inserimento richiesta labo ":"Inserimento richiesta micro ";
	Abstract({
        RefreshFunction:inserisciRichiesta,
        CodFunzione:"INS_RICHIESTA",
        DescrFunzione:descrFunzione,
        GetUrlFunction:getUrl,
        Destinazione:(typeof pDocument != 'undefined' ? pDocument : 'FRAME')
    });

    function getUrl(pDati){
    	var url;
    	var keyLegame=tipo=='LABO' ? 'RICHIESTA_GENERICA_LABO_SV':'RICHIESTA_GENERICA_MICRO_PL';
    	url = 'servletGenerator?KEY_LEGAME='+ keyLegame;
    	url+='&IDEN=';
    	url+='&DESTINATARIO='+tipo ;
    	url+='&Hiden_anag=' + pDati.iden_anag;
    	url+='&HrepartoRicovero=' + pDati.reparto;
    	url+='&LETTURA=N';
    	url+='&Hiden_visita=' + FiltroCartella.getIdenRiferimento(pDati);
    	url+='&TIPOLOGIA_RICHIESTA=0';
    	url+='&ID_STAMPA=&STAMPA=N';
    	url+='&Hiden_pro=' + pDati.IdenPro;
    	
    	if(DatiInterfunzione.get('CODICI_ESTERNI') != ""){
    		url += "&CODICI_ESTERNI=" + DatiInterfunzione.get('CODICI_ESTERNI').replace(/:/g,"=");
            DatiInterfunzione.remove('CODICI_ESTERNI');
    	}
    	
    	return url;
    }
}

/* Viene richiamata la Prenotazione di POLARIS */
function inserisciPrenotazione(){
    inserisciGenerico("ALBERO_PRENOTAZIONI",'INSERIMENTO_PRENOTAZIONE',"Inserimento prenotazione");
}

/* Viene richiamata la Prenotazione di AMBULATORIO */
function inserisciPrestazione(param){//[cdc_destinatario,apri_scheda_esame]
    Abstract({
        RefreshFunction:inserisciPrestazione,
        CodFunzione:'INSERIMENTO_PRESTAZIONE',
        DescrFunzione:'Inserimento Prestazione',
        GetUrlFunction:getUrlPrenotazionePrestazioni
    });

    utilMostraBoxAttesa(false);

    function getUrlPrenotazionePrestazioni(pDati,pFrame){
        param = typeof param == 'undefined' ? {} : param;

        var dati_ambulatorio = CartellaPaziente.getRiferimentiAmbulatorio(param);

        if(dati_ambulatorio.success == 'KO'){
            alert(dati_ambulatorio.message);
            return "blank.htm";
        }

        top.executeStatement("AccessiAppuntamenti.xml","Servizi.clean",[top.baseUser.LOGIN]);

        var nested_url 	= "sceltaEsami"
                + "?tipo_registrazione=P"
                + "&Hiden_pro=" + dati_ambulatorio.iden_pro

                + "&Hcdc=" + (typeof param.cdc_destinatario == "undefined" ? pDati.reparto : param.cdc_destinatario) + "@" +  dati_ambulatorio.iden_pro

                + "&urgente=0"

                + "&cmd_extra=hideMan();setCaller('WHALE');"
                + "&next_servlet=prenotazioneInizio"
                + "&Hclose_js=chiudi_prenotazione();"
                + "&js_after_load=continua();"
                + "&extra_db="+(typeof param.extra_db == "undefined" ? "WHALE_CC<riferimenti iden_ricovero='"+pDati.iden_ricovero+"' iden_visita='"+pDati.iden_visita+"'/>" : param.extra_db)
                + "&visualizza_metodica=N";
        
        if (typeof param == 'undefined')
			 nested_url+="";
		else {
			 nested_url+="&apri_scheda_esame="+(typeof param.apri_scheda_esame == "undefined" ? 'N' : param.apri_scheda_esame);
			 if (top.baseUser.TIPO=='M'){
				 var rs = executeQuery("OE_Richiesta.xml","prenotazione.WhaleToAmbu.recuperoCodDecUtente",[top.baseUser.IDEN_PER]);
				 if(rs.next()){
	                nested_url+= "&cod_dec_med_rich="+ rs.getString("COD_DEC");
	            }				 
			 }

		}
        var url = "prenotazioneFrame"
            		+ "?Hiden_anag=" + dati_ambulatorio.iden_anag
            		+ "&servlet=" + encodeURIComponent(nested_url);
        
        return NS_APPLICATIONS.switchTo('AMBULATORIO',url);

    }
}

function inserisciPrestazioneSuReparto(pCdcDestinatario){
    inserisciPrestazione({cdc_destinatario:pCdcDestinatario,apri_scheda_esame:'S'});
}

function inserisciPrestazioneSuRepartoDaEsterno(){
	var vDati = getForm();
	eval("var configurazioni = "+baseReparti.getValue(vDati.reparto,'PRENOTAZIONE_ESTERNA'));
	
	var CodiceModalitaCartella = CartellaPaziente.getAccesso('CODICE_MODALITA_CARTELLA');
	CartellaPaziente.getReparto().Modalita[CodiceModalitaCartella == null ? "" : CodiceModalitaCartella].AFTER_SAVE.INSERIMENTO_PRESTAZIONE = 'prenotazionePazienteEsternoAMB';
	inserisciPrestazione({cdc_destinatario:configurazioni.cdc_destinatario,apri_scheda_esame:'S',cod_dec:configurazioni.cod_dec_esterno,extra_db:'WHALE'});
	//consultaPrenotazioneTest({cdc_destinatario:configurazioni.cdc_destinatario,apri_scheda_esame:'S',cod_dec:configurazioni.cod_dec_esterno});

}

function consultaPrenotazioneTest(param){
    Abstract({
        RefreshFunction:consultaPrenotazioneTest,
        CodFunzione:'CONSULTA_PRENOTAZIONE',
        DescrFunzione:'Consulta prenotazione',
        GetUrlFunction:getUrlConsultaTest
    });

    utilMostraBoxAttesa(false);

    function getUrlConsultaTest(pDati,pFrame){
        param = typeof param == 'undefined' ? {} : param;

        var dati_ambulatorio = CartellaPaziente.getRiferimentiAmbulatorio(param);

        if(dati_ambulatorio.success == 'KO'){
            alert(dati_ambulatorio.message);
            return "blank.htm";
        }

     /*   var nested_url 	= "consultazioneInizio"
                + "?tipo=CDC&attivo_filtro_web=N"
                + "&attivo_filtro_sql=S&auto_visualizza=S"
                +"&js=parent.parent.parametri=new Array(13);parent.parent.parametri[10]='prenotazione_consulta_richiesta'"
                + "&urgente=0"
                + "parent.parent.parametri[11]='"+dati_ambulatorio.iden_anag+"';parent.parent.parametri[12]='"+dati_ambulatorio.iden_pro+"';"
               
        
        var url = "prenotazioneFrame"
            		+ "?&servlet=" + encodeURIComponent(nested_url)
					+ "?Hiden_anag=" + dati_ambulatorio.iden_anag
					+ "&events=onunload&actions=libera('1234', '"+basePC.IP+"');';";
					
        
		alert(url);
        return NS_APPLICATIONS.switchTo('AMBULATORIO',url);*/
					 var aTmp = document.location.href.split('/');
					 var sRet = '';
					 for(var idx = 0; idx < aTmp.length - 2; sRet += aTmp[idx++] + "/");
					// url=sRet + 'ambulatorio_non_strumentale/autoLogin?USER=' + WindowCartella.baseUser.LOGIN ;
					 url='http://10.106.0.146:8082/ambulatorio_non_strumentale/autoLogin?USER=' + WindowCartella.baseUser.LOGIN ;
					url += '&IP='+WindowCartella.basePC.IP;
					url += '&KEY=CONSULTAZIONE';
					url += '&IDEN_ANAG='+dati_ambulatorio.iden_anag;
					url += '&IDEN_PRO='+dati_ambulatorio.iden_pro;
					url += '&CDC_IDEN_PRO=' + param.cdc_destinatario + '%40'+dati_ambulatorio.iden_pro;
					
					alert(url);
					return url;

    }
}

/* LUCA */
function inserisciRichiestaConsulenza(){
	albero=(CartellaPaziente.getAccesso('PRE_OPERATORIO')=='VAL_PREOP')?'ALBERO_RICHIESTE_CONSULENZE_VPO':'ALBERO_RICHIESTE_CONSULENZE';
	inserisciGenerico(albero,'INSERIMENTO_RICHIESTA',"Inserimento richiesta");
 
}

/* LUCA */
function inserisciRichiestaGenerica(){
    inserisciGenerico("ALBERO_RICHIESTE",'INSERIMENTO_RICHIESTA',"Inserimento richiesta");
}

/* LUCA */
function inserisciRichiestaPrenotazione(){
    inserisciGenerico("ALBERO_RICHIESTE_PRENOTAZIONI",'INSERIMENTO_RICHIESTA_PRENOTAZIONE',"Inserimento richiesta/prenotazione");
}

function apriInserimentoRichiestaPS(){

    Abstract({
        RefreshFunction:function(){apriInserimentoRichiestaPS();},
        CodFunzione:"INSERIMENTO_RICHIESTA",
        DescrFunzione:"Inserimento richiesta",
        GetUrlFunction:getUrl,
        CheckFiltroData:false,
        CheckFiltroNrRichieste:false
    });
	
	return;
    function getUrl(pDati){
		
    	var url;
        var idenContatto;
        var iden_provenienza;
        var idenCdc;
    	var cod_cdc;
    	var struttura;
		var cartella;
		//if obi mettere pre altrimenti se è medicina urgenza passargli getRicovero
		if (getRicovero('TIPOLOGIA')=='OBI'){
			cartella = getPrericovero('NUM_NOSOLOGICO');	
		}
		else{
			cartella = getRicovero('NUM_NOSOLOGICO');
		}
    	
        var rs = executeQuery("PS.xml","getDatiContatto",[cartella,cartella,getPaziente('IDEN')]);

        if(rs.next()){
                idenContatto=rs.getString("IDEN_CONTATTO");
        }
			iden_provenienza=getReparto("IDEN_PRO");
			cod_cdc = getReparto('COD_CDC');
			struttura = getReparto('COD_STRUTTURA_CDC');
        
           eval("url_auto_login="+baseReparti.getValue(getRicovero('COD_CDC'),'URL_AUTOLOGIN_PS'));
           url =  url_auto_login.ricovero.url_auto_login;

           url += 'username='   +  baseUser.LOGIN+
       		'&nomeHost=' + basePC.IP +
       		'&NO_APPLET=N' +
            '&scheda=INS_RICHIESTE' +
           '%26IDEN_CONTATTO=' + idenContatto+
           '%26IDEN_PROVENIENZA=' + iden_provenienza+
           '%26COD_CDC_PS=' + cod_cdc+
           '%26WK_APERTURA=LISTA_APERTI'+
           '%26STATO_PAGINA=I'+
           '%26TEMPLATE=URGENZA_RICHIESTE/UrgenzaRichiesta.ftl'+
           '%26hStruttura=' + struttura+
           '%26hCodCdc='+ cod_cdc+
           '%26URGENZA='+
           '%26AUTOLOGIN=S'+
           '%26COD_DEC_CDC='+
           '%26DESCR_CDC='+
		   '%26NUM_NOSOLOGICO='+getRicovero('NUM_NOSOLOGICO');
		 utilMostraBoxAttesa(false);
        return 'insRichiestaPS.jsp?url='+encodeURIComponent(url);
		
		
    }

}