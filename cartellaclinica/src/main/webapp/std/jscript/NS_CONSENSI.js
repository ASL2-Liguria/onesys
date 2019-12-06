var NS_CONSENSI ={
    
    urlAutoLogin:'',
    assigning_authority:'WHALE',
    datiPaziente:{
        set:function(name,value){
            NS_CONSENSI.datiPaziente[name] = value;
        }
    },

    parametri:{
        set:function(name,value){
            NS_CONSENSI.parametri[name] = value;
        }
    },    

    
    gestioneConsenso:function(param){
        NS_CONSENSI.getUrlAutologin();
        NS_CONSENSI.getDatiPaziente(param);
        
        NS_CONSENSI.parametri.set('tipo',param.tipo);
        NS_CONSENSI.parametri.set('opener',param.opener);
        NS_CONSENSI.parametri.set('action',param.action);        
        NS_CONSENSI.parametri.set('assigning_authority','WHALE');  
        
        NS_CONSENSI.getConsensoFromPortale(NS_CONSENSI.datiPaziente,NS_CONSENSI.parametri);
       
    },

    getDatiPaziente:function(param){
        /*Se sono fuori dalla cartella, i parametri del paziente vengono passati(ricerca pazienti-ipatient)*/
        switch(param.opener){
            case 'ipatient':
            case 'ricerca_pazienti':
                NS_CONSENSI.datiPaziente.set('iden_anag'    ,param.iden_anag);
                NS_CONSENSI.datiPaziente.set('cognome'      ,param.cognome);
                NS_CONSENSI.datiPaziente.set('nome'         ,param.nome);
                NS_CONSENSI.datiPaziente.set('data_nascita' ,param.data_nascita);
                NS_CONSENSI.datiPaziente.set('sesso'        ,param.sesso);
                NS_CONSENSI.datiPaziente.set('cod_fisc'     ,param.cod_fisc);                  
                NS_CONSENSI.datiPaziente.set('com_nasc'     ,param.com_nasc); 
                NS_CONSENSI.datiPaziente.set('nosologico'   ,'');
                NS_CONSENSI.datiPaziente.set('id'           ,param.id);
                break;
            case 'cartella':
                var vDati = getForm();
                NS_CONSENSI.datiPaziente.set('iden_anag'        ,vDati.iden_anag);
                NS_CONSENSI.datiPaziente.set('cognome'          ,getPaziente('COGN'));
                NS_CONSENSI.datiPaziente.set('nome'             ,getPaziente('NOME'));
                NS_CONSENSI.datiPaziente.set('data_nascita'     ,getPaziente('DATA'));
                NS_CONSENSI.datiPaziente.set('sesso'            ,getPaziente('SESSO'));
                NS_CONSENSI.datiPaziente.set('cod_fisc'         ,getPaziente('COD_FISC'));        
                NS_CONSENSI.datiPaziente.set('com_nasc'         ,getPaziente('COM_NASC'));  
                NS_CONSENSI.datiPaziente.set('iden_ricovero'    ,vDati.iden_ricovero);        
                NS_CONSENSI.datiPaziente.set('id'               ,getPaziente('ID_REMOTO'));  
                NS_CONSENSI.datiPaziente.set('nosologico'       ,vDati.ricovero);
                NS_CONSENSI.datiPaziente.set('emergenza_medica' ,param.emergenza_medica);
                break;
            default:null;   
        }
    },
    
    getConsensoFromPortale:function(paramPaziente,paramGeneric){
        var vUrl = NS_CONSENSI.urlAutoLogin;
        vUrl += 'username='+baseUser.LOGIN;
        //vUrl += '&url=/page?KEY_LEGAME=MAIN_PAGE';
        vUrl += '&nomeHost='+basePC.NOME_HOST;
        
        switch(paramGeneric.tipo){
            //case 'INSERIMENTO_CONSENSO_UNICO'       : vUrl += '&KEY_SCHEDA=CONSENSO_UNICO'; break;
            case 'INSERIMENTO_CONSENSO_UNICO'       : vUrl += '&scheda=CONSENSO_UNICO'; break;
            //case 'INSERIMENTO_CONSENSO_EVENTO'      : vUrl += '&KEY_SCHEDA=CONSENSO_EVENTO'; break;
            case 'INSERIMENTO_CONSENSO_EVENTO'      : vUrl += '&scheda=CONSENSO_EVENTO'; break;
            //case 'INSERIMENTO_CONSENSO_DOCUMENTO'   : vUrl += '&KEY_SCHEDA=CONSENSO_DOCUMENTO'; break;
            case 'INSERIMENTO_CONSENSO_DOCUMENTO'   : vUrl += '&scheda=CONSENSO_DOCUMENTO'; break;
            default: alert(paramGeneric.tipo + ' non riconosciuto');
        }
        vUrl += '::ACTION='+ (typeof paramGeneric.action=='undefined'?'':paramGeneric.action);
        vUrl += '::ASSIGNING_AUTHORITY='+(typeof paramGeneric.assigning_authority=='undefined'?'':paramGeneric.assigning_authority);
        vUrl += '::ANAGRAFICA='+(typeof paramPaziente.iden_anag=='undefined'?'':paramPaziente.iden_anag);
        vUrl += '::COGNOME='+(typeof paramPaziente.cognome=='undefined'?'':paramPaziente.cognome);
        vUrl += '::NOME='+(typeof paramPaziente.nome=='undefined'?'':paramPaziente.nome);            
        vUrl += '::DATA_NASCITA='+(typeof paramPaziente.data_nascita=='undefined'?'':paramPaziente.data_nascita);
        vUrl += '::SESSO='+(typeof paramPaziente.sesso=='undefined'?'':paramPaziente.sesso);
        vUrl += '::CODICE_FISCALE='+(typeof paramPaziente.cod_fisc=='undefined'?'':paramPaziente.cod_fisc); 
        vUrl += '::COM_NASC='+(typeof paramPaziente.com_nasc=='undefined'?'':paramPaziente.com_nasc);
        vUrl += '::NOSOLOGICO_PAZIENTE='+(typeof paramPaziente.nosologico=='undefined'?'':paramPaziente.nosologico); 
        //alert(vUrl);
        
        openAndCloseWindow(vUrl,'portaleConsensi',"fullscreen=yes scrollbars=no",NS_CONSENSI.refresh,paramGeneric.opener);
    },
    
    refresh:function(param){
        switch(param){
            case 'cartella': 
                CartellaPaziente.refresh.avvertenze.paziente(); 
                break;
            case 'ricerca_pazienti': /*simulo il click sul bottone ricerca*/
                var frame = typeof $("#iframe_main").attr('src')!='undefined'?$("#iframe_main").contents().find("frame"):$("#iRicercaPz").contents().find("frame");
                var doc =  $(frame[0].contentWindow.document);
                doc.find('#Lricerca')[0].click();
                break;
            case 'ipatient':
                NS_FUNZIONI.getInfoPaziente();
				NS_PAGINA.setIntestazionePZ();
        }        
    },

    gestioneAperturaDocumenti:function(param){
        NS_CONSENSI.getUrlAutologin();
        NS_CONSENSI.getDatiPaziente(param);
        
        NS_CONSENSI.parametri.set('emergenza_medica',param.emergenza_medica);
        NS_CONSENSI.parametri.set('opener',param.opener);     
        NS_CONSENSI.parametri.set('assigning_authority','WHALE');
        NS_CONSENSI.parametri.set('heigntCartella',typeof param.heigntCartella==undefined?0:param.heigntCartella);
        
        
        return NS_CONSENSI.openDocumentiPaziente(NS_CONSENSI.datiPaziente,NS_CONSENSI.parametri);
        
    },    
    
    openDocumentiPaziente: function(paramPaziente,paramGeneric) {
        try {        
            var url = NS_CONSENSI.urlAutoLogin;
            url += 'username=' + baseUser.LOGIN;
            url += '&nomeHost=' + basePC.NOME_HOST;
            //url += '&url=/page?KEY_LEGAME=MAIN_PAGE&KEY_SCHEDA=DOCUMENTI_PAZIENTE';
            url += '&scheda=DOCUMENTI_PAZIENTE';
            
            url += '::SITO=PIC';
            url += '::ASSIGNING_AUTHORITY='+paramGeneric.assigning_authority;
            url += '::CODICE_FISCALE=' + paramPaziente.cod_fisc;
            url += '::COGNOME=' + paramPaziente.cognome;
            url += '::COM_NASC=' + paramPaziente.com_nasc;
            url += '::DATA_NASCITA=' + paramPaziente.data_nascita;
            url += '::EMERGENZA_MEDICA=' + paramGeneric.emergenza_medica.toLowerCase();
            url += '::ID_REMOTO=' + paramPaziente.id;
            url += '::NOME=' + paramPaziente.nome;
            url += '::ANAGRAFICA=' + paramPaziente.iden_anag;
            url += '::SESSO=' + paramPaziente.sesso;
            url += '::HEIGHTCARTELLA=' + paramGeneric.heigntCartella;
            //alert(url);
            
            return url;
        } catch (e) {
            alert("CALL => NS_CONSENSI.openDocumentiPaziente\n" + e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description);
        }          
    },
    
    getUrlAutologin:function(){
        var reparto = 'DIMI_SV';
        var key ='URL_AUTOLOGIN_PORTALE_CONSENSI';
        var url = baseReparti.getValue(reparto,key);
        NS_CONSENSI.urlAutoLogin = url;
    },
    
    /*
     * Controlla la presenza del consenso all'evento/lettera/richiesta a seconda dell'oggetto passatogli
     * param.file,param.statement,param.value
     * para:{
     *  statement:'',
     *  value:{}   (nel caso della lettera, bisogna specificare la funzione 3 volte)
     * }
     */
    checkPresenzaConsensoWhale : function (param){
        var message ={
            value:true,
            messaggio:''
        };
        var rs = executeQuery('consensi.xml',param.statement,param.value);
        if (rs.next()){
            if (rs.getString('consenso_espresso')===''){
                message.value = false;
                message.messaggio = 'Attenzione: il consenso all\'evento non è stato inserito, si ricorda di procedere alla compilazione.';                
            }else{
                message.value = true;
                message.messaggio = '';                                
            }
        }
        return message;
    }
};
                