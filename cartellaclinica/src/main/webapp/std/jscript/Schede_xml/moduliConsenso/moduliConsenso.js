var WindowCartella = null;

jQuery(document).ready(function() {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }

    $('#oIFWk').attr('src', 'servletGenerator?KEY_LEGAME=WK_MODULI_CONSENSO&CONTEXT_MENU=' + document.EXTERN.CONTEXT_MENU.value + '&WHERE_WK=' + document.EXTERN.WHERE_WK.value);
});

var NS_MODULI_CONSENSO = {
    
    appendDivACR : function(obj) {
        var reparto = document.EXTERN.REPARTO.value;
        var gruppo  = '';

        _ACR_PARAMETER._SQL_ELENCO_ACR = "select GEST_ALBERO.GET_HTML(#WHERE#,xmltype(imagoweb.pck_configurazioni.getValueCdc('#REPARTO#','ALBERO_MODULI'))) DESCRIZIONE from dual".replace('#REPARTO#', reparto);

        //al cambio di selezione svuoto il contenuto e lo ricreo
        if (document.all.lblAlberoModuli.parentNode.lastChild.id == 'clsACR')
            document.all.lblAlberoModuli.parentNode.lastChild.removeNode(true);

        if (!document.all['clsACR']) {
            divAcr              = document.createElement('DIV');
            divAcr.id           = 'clsACR';
            divAcr.className    = 'clsACR';
            obj.appendChild(divAcr);
        }

        creaDivACR('clsACR', 0, gruppo, NS_MODULI_CONSENSO.chiudiAlbero);

        try {
            var elmOL = document.all.lblAlberoModuli.parentNode.lastChild.firstChild;
            elmOL.childNodes[0].firstChild.click();
        } catch (e) {
            //alert(e.description);
        }
    },
            
    chiudiAlbero : function() {
    },
            
    apriModulo : function(paramUrl) {
        var paramObj = {
            url     : null,
            width   : $(document).width(),
            height  : $(document).height()
        };

        if (WindowCartella.ModalitaCartella.isReadonly(document) == true || paramUrl.readonly == true) {
            paramUrl.readonly = true;
        }
        
        var keyID                   = (paramUrl.key_id != undefined ? paramUrl.key_id : 0);
        var idenVisita              = (paramUrl.iden_visita != undefined ? paramUrl.iden_visita : 0);
        var idenVisitaRegistrazione = (paramUrl.iden_visita_registrazione != undefined ? paramUrl.iden_visita_registrazione : 0);
        var idenAnag                = (paramUrl.iden_anag != undefined ? paramUrl.iden_anag : 0);
        var tipo                    = (paramUrl.tipo != undefined ? paramUrl.tipo : 0);
        var revoca                  = (paramUrl.revoca != undefined ? paramUrl.revoca : 'N');
        var readOnly                = (paramUrl.readonly != undefined ? paramUrl.readonly : true);
        
        switch (paramUrl.tipo) {
            case 'CONSENSO_TRATTAMENTO_DATI':
                paramObj.url = 'servletGenerator?KEY_LEGAME=CONSENSO_TRATTAMENTO_DATI&KEY_ID=' + keyID + '&IDEN_VISITA=' + idenVisita + '&IDEN_VISITA_REGISTRAZIONE=' + idenVisitaRegistrazione + '&IDEN_ANAG=' + idenAnag + '&READONLY=' + readOnly;
                break;
            case 'CONSENSO_TRATTAMENTO_DATI_ASL5':
                paramObj.url = 'servletGenerator?KEY_LEGAME=CONSENSO_TRATTAMENTO_DATI_ASL5&KEY_ID=' + keyID + '&IDEN_VISITA=' + idenVisita + '&IDEN_VISITA_REGISTRAZIONE=' + idenVisitaRegistrazione + '&IDEN_ANAG=' + idenAnag + '&TIPO=' + tipo + '&REVOCA=' + revoca + '&READONLY=' + readOnly;
                break;
            case 'ATTO_MEDICO':
            case 'BIOPSIA_OSTEO':
            case 'CATETERE_TORACICO':
            case 'COLANGIO':
            case 'COLONSCOPIA':
            case 'ESOFAGOGASTRO':
            case 'INDAGINE_ENDO':
            case 'INFLIXIMAB':
            case 'PARACENTESI':
            case 'PEG':
            case 'PROPYL':
            case 'TORACENTESI':
            case 'PROCEDURE_ANEST':
                paramObj.url = 'servletGenerator?KEY_LEGAME=CONSENSO_ATTO_SANITARIO&KEY_ID=' + keyID + '&IDEN_VISITA=' + idenVisita + '&IDEN_VISITA_REGISTRAZIONE=' + idenVisitaRegistrazione + '&IDEN_ANAG=' + idenAnag + '&TIPO=' + tipo + '&REVOCA=' + revoca + '&READONLY=' + readOnly;
                break;
            case 'MODULO_BENI_PREZIOSI':
                paramObj.url = 'servletGenerator?KEY_LEGAME=MODULO_BENI_PREZIOSI&KEY_ID=' + keyID + '&IDEN_VISITA=' + idenVisita + '&IDEN_VISITA_REGISTRAZIONE=' + idenVisitaRegistrazione + '&IDEN_ANAG=' + idenAnag + '&TIPO=' + tipo + '&REVOCA=' + revoca + '&READONLY=' + readOnly;
                break;
            case 'MODULO_PROTESI_DENTARIA':
                paramObj.url = 'servletGenerator?KEY_LEGAME=MODULO_PROTESI_DENTARIA&KEY_ID=' + keyID + '&IDEN_VISITA=' + idenVisita + '&IDEN_VISITA_REGISTRAZIONE=' + idenVisitaRegistrazione + '&IDEN_ANAG=' + idenAnag + '&TIPO=' + tipo + '&REVOCA=' + revoca + '&READONLY=' + readOnly;
                break;
            case 'MODULO_DIARIO_ALIMENTARE':
                paramObj.url = 'servletGenerator?KEY_LEGAME=MODULO_DIARIO_ALIMENTARE&KEY_ID=' + keyID + '&IDEN_VISITA=' + idenVisita + '&IDEN_VISITA_REGISTRAZIONE=' + idenVisitaRegistrazione + '&IDEN_ANAG=' + idenAnag + '&TIPO=' + tipo + '&REVOCA=' + revoca + '&READONLY=' + readOnly;
                break;
            /* CONSENSI_AZIENDALI */
            case 'AUTOCERTIFICAZIONE_GENITORI':
            case 'CONSENSO_INFORMATO':
            case 'CONSENSO_INFORMATO_MINORI':
            case 'CONSENSO_INFORMATO_TEST_HIV':
            case 'CONSENSO_INFORMATO_TRASFUSIONE':
                //alert(keyID);
                paramObj.url = 'servletGenerator?KEY_LEGAME=CONSENSI_AZIENDALI&KEY_ID=' + keyID + '&IDEN_VISITA=' + idenVisita + '&IDEN_VISITA_REGISTRAZIONE=' + idenVisitaRegistrazione + '&IDEN_ANAG=' + idenAnag + '&TIPO=' + tipo + '&REVOCA=' + revoca + '&READONLY=' + readOnly;
                break;
            /* CONSENSI_CHIRURGIA_MANO */
            case 'CONSENSO_INFORMATO_CHIRURGIA_MANO':
                //alert(keyID);
                paramObj.url = 'servletGenerator?KEY_LEGAME=CONSENSI_CHIRURGIA_MANO&KEY_ID=' + keyID + '&IDEN_VISITA=' + idenVisita + '&IDEN_VISITA_REGISTRAZIONE=' + idenVisitaRegistrazione + '&IDEN_ANAG=' + idenAnag + '&TIPO=' + tipo + '&REVOCA=' + revoca + '&READONLY=' + readOnly;
                break;
            case 'CONSENSO_PROTESI':
                paramObj.url = 'servletGenerator?KEY_LEGAME=CONSENSO_PROTESI&KEY_ID=' + keyID + '&IDEN_VISITA=' + idenVisita + '&IDEN_VISITA_REGISTRAZIONE=' + idenVisitaRegistrazione + '&IDEN_ANAG=' + idenAnag + '&TIPO=' + tipo + '&REVOCA=' + revoca + '&READONLY=' + readOnly;
                break;
            case 'CATENA_CUSTODIA':
                paramObj.url = 'servletGenerator?KEY_LEGAME=CATENA_CUSTODIA&KEY_ID=' + keyID + '&IDEN_VISITA=' + idenVisita + '&IDEN_VISITA_REGISTRAZIONE=' + idenVisitaRegistrazione + '&IDEN_ANAG=' + idenAnag + '&TIPO=' + tipo + '&REVOCA=' + revoca + '&READONLY=' + readOnly;
                break;
            case 'RICHIESTA_ESENZIONI':
                paramObj.url = 'servletGenerator?KEY_LEGAME=MODULO_RICHIESTA_ESENZIONE&KEY_ID=' + keyID + '&IDEN_VISITA=' + idenVisita + '&IDEN_VISITA_REGISTRAZIONE=' + idenVisitaRegistrazione + '&IDEN_ANAG=' + idenAnag + '&TIPO=' + tipo +'&READONLY=' + readOnly;
                break;
            default :
        }

        WindowCartella.$.fancybox({
            'padding'   : 3,
            'width'     : paramObj.width,
            'height'    : paramObj.height,
            'href'      : paramObj.url,
            'type'      : 'iframe'
        });

    },
            
    inserisciModulo : function(pTipo) {
        if (typeof WindowCartella.ModalitaCartella != 'undefined' && WindowCartella.ModalitaCartella.isReadonly(document) == true) {
            alert('Funzionalità non disponibile');
            return;
        }

        var paramUrl = {
            iden_visita                 : document.EXTERN.IDEN_VISITA.value,
            iden_visita_registrazione   : document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,
            iden_anag                   : document.EXTERN.IDEN_ANAG.value,
            tipo                        : pTipo.tipo,
            revoca                      : 'N',
            readonly                    : false
        };

        /*	if(pTipo.controlloApertura=='S'){
         var rs=top.executeQuery('moduliConsenso.xml','checkData',[paramUrl.tipo,paramUrl.iden_visita]);
         if(rs.next()) {
         if(rs.getString("TOTALE")!='0'){
         if (!confirm("Attenzione: esiste già almeno un consenso salvato di questo tipo, inserirne un altro?")){
         return;
         }
         }
         }
         }	*/

        NS_MODULI_CONSENSO.apriModulo(paramUrl);
    },
    
    stampaModulo: function(pTipo){
     var sf='';
     if (pTipo.tipo=='MODULO_RIABILIT_INTENSIVA')
    	 sf='&prompt<pIdenAnag>=' + WindowCartella.getPaziente("IDEN");
     else
    	sf='&prompt<pVisita>=' + WindowCartella.getRicovero("IDEN"); 

     WindowCartella.confStampaReparto(pTipo.tipo,sf,'S', WindowCartella.getAccesso("COD_CDC"), WindowCartella.basePC.PRINTERNAME_REF_CLIENT);
       
    }

};


