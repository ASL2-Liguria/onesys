$(document).ready(function() {
    try {
        NS_PAGINA.readDati();
        setTimeout(function() {
            NS_PAGINA.init();
        }, 500);
    } catch(e) {
        alert("Raise Exception: "+e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description);
    }
});


var _PROV_CHIAMATA = null;
var _CONTEXT = 'iPatient';
//var _URL_PIC_AUTOLOGIN = 'http://192.168.3.123:8084/fenix_pic/Autologin?';
var _RICERCA_PZ = null;
var _REPARTO = null;
var _SET_EMERGENZA_MEDICA = null;
var _TIPOLOGIA_ACCESSO = null;
var _EVENTO_CORRENTE = null;
var WindowIPatient = window;


var Paziente = {
    iden_anag: '',
    id: '',
    nome: '',
    cognome: '',
    data_nascita: '',
    cod_fisc: '',
    com_nasc: '',
    sesso: '',
    consenso: '',
    emergenza_medica:''
};

var Operatore = {
    login: 0,
    iden: 0,
    tipo: '',
    descr: '',
    livello: 0,
    cdc: []
};


var NS_PAGINA = {
	privacy:'',
	file:'',
    readDati: function() {
        Paziente.id = NS_UTILITY.getUrlParameter('id_paziente');
        Operatore.iden = NS_UTILITY.getUrlParameter('IDEN_PER');
        Operatore.reparto = NS_UTILITY.getUrlParameter('REPARTO');
        // Definizione Parametri x Comportamento
        _PROV_CHIAMATA = NS_UTILITY.getUrlParameter('PROV_CHIAMATA');
        _RICERCA_PZ = (_PROV_CHIAMATA == 'UNISYS'||_PROV_CHIAMATA == 'UNISYS_EMERG_TRUE'||_PROV_CHIAMATA == 'UNISYS_EMERG_FALSE') ? true : false;
        _SET_EMERGENZA_MEDICA = NS_UTILITY.getUrlParameter('SET_EMERGENZA_MEDICA') != '' ? NS_UTILITY.getUrlParameter('SET_EMERGENZA_MEDICA') : 'FALSE';
        _TIPOLOGIA_ACCESSO = NS_UTILITY.getUrlParameter('TIPOLOGIA_ACCESSO') != '' ? NS_UTILITY.getUrlParameter('TIPOLOGIA_ACCESSO') : '';
        _EVENTO_CORRENTE = NS_UTILITY.getUrlParameter('EVENTO_CORRENTE') != '' ? NS_UTILITY.getUrlParameter('EVENTO_CORRENTE') : '';
    },
    init: function() {
        // alert('PROV_CHIAMATA: ' + _PROV_CHIAMATA + '\n - _RICERCA_PZ: ' + _RICERCA_PZ);
        NS_PAGINA.checkPrivacy();
        
        if (NS_PAGINA.privacy.IPATIENT.ATTIVA=='S'){
			NS_PAGINA.file = NS_PAGINA.privacy.IPATIENT.fileQuerySI;
		}	
        else{
        	NS_PAGINA.file = NS_PAGINA.privacy.IPATIENT.fileQueryNO;		
		}
        
        NS_PAGINA.Style.setGenericStyle();
    	NS_PAGINA.Events.setGenericEvents();
    	// Get Informazioni Operatore
        NS_FUNZIONI.getInfoOperatore();
        // Set Funzioni Menu SecondoAttributo FUNZIONE
        NS_MENU.SETTINGS.setMenuUtente();
        
        switch (_PROV_CHIAMATA) {
            case 'AMBULATORIO' :
            case 'CARTELLA' :
            case 'MMG' :
            case 'POLARIS' :
            case 'UNISYS_EMERG_TRUE' :
            case 'UNISYS_EMERG_FALSE' :
                NS_FUNZIONI.getInfoPaziente();
                NS_PAGINA.setIntestazionePZ();
                NS_MENU.SETTINGS.showIstruzioniMenuLaterale();            	
                break;
            case 'UNISYS' :
                NS_PAGINA.setRicercaAnagrafica();
        }

        baseUser.TIPO == 'M' && baseUser.TIPO_MED == 'I' && _SET_EMERGENZA_MEDICA != '' && _SET_EMERGENZA_MEDICA == 'TRUE' ? $('#chkEmergenzaMedica').attr('checked', 'checked') : null;
        
    },
    
    Events: {
        setGenericEvents: function() {
//        	alert(baseUser.TIPO+'\n'+baseUser.TIPO_MED+'\n'+_SET_EMERGENZA_MEDICA)
            if (baseUser.TIPO == 'M' && baseUser.TIPO_MED == 'I' && _SET_EMERGENZA_MEDICA != '') {
                var newurl = 'servletGeneric?class=iPatient.iPatient';
                newurl += '&id_paziente=' 	+ Paziente.id; 
                newurl += '&iden_anag=' 	+ Paziente.iden_anag; 
                newurl += '&PROV_CHIAMATA=CARTELLA';
                /*newurl += '&fileQuery='		+ NS_PAGINA.file;
                var tmp = NS_PAGINA.privacy.IPATIENT.ATTIVA=='S'?"TRUE":"FALSE"
                newurl += '&SET_ATTIVA_PRIVACY='	+ tmp;*/
                $('#chkEmergenzaMedica').click(function() {
                	var obj = $(this); 
                    if (obj.is(":checked")) {                  	
                    	url = "insNotaEmergenzaMedica.html";
                    	
                    	parent.$.fancybox({
                    		'padding'	: 3,
                    		'width'		: 800,
                    		'height'	: 350,
                    		'href'		: url,
                    		'type'		: 'iframe'
                    	});
                    }
                     else {
                    	 abilitaEmergenzaMedica(false,'');
                    }
                });
            }
            document.body.onbeforeunload = function(){NS_UTILITY.closeTraceUser();};
        },
        close: function() {
	        	NS_UTILITY.closeTraceUser();
        	
            switch (_PROV_CHIAMATA) {
                case 'UNISYS' :
                case 'UNISYS_EMERG_TRUE' :
                case 'UNISYS_EMERG_FALSE' :
                    opener.location.reload();
                    break;
                case 'CARTELLA':
                    try {
                        opener.NS_CARTELLA_PAZIENTE.refreshCaller();
                    } catch (e) {
                        alert(e.description);
                    }
                    break;
            }
            self.close();
        },
        attesa: function(pBool) {
            if (pBool) {
                $('#divSpinner').show();
            } else {
                $('#divSpinner').hide();
            }
        }
    },
    Style: {
        setGenericStyle: function() {
            var pWidthMenu = $('#divMenuSX').outerWidth();
            var pWidthDoc = $(document).width();
            var pHeightDoc = $(document).height();
            var bodyHeight = $(document).height() - $('#divInfoTOP').offset().top;

            var x = 0;
            if (self.innerHeight) {
                x = self.innerWidth;
            } else if (document.documentElement && document.documentElement.clientHeight) {
                x = document.documentElement.clientWidth;
            } else if (document.body) {
                x = document.body.clientWidth;
            }

            var bodyWidth = (pWidthDoc - $('#divMenuSX').outerWidth() + 1);
            // '[0 - Set Generic Style] - Imposto Prima Le Altezze In base alla Chiamata e Poi Nascondo Tutti gli elementi e li riapro poi' 

            switch (_PROV_CHIAMATA) {
                case 'AMBULATORIO' :
                case 'CARTELLA' :
                case 'UNISYS' :
                case 'UNISYS_EMERG_TRUE' :
                case 'UNISYS_EMERG_FALSE' :
                case 'POLARIS' :
                    bodyHeight = $(document).height() - $('#iRicercaPz').offset().top;
                    break;
                case 'MMG' :
                    bodyHeight = $(document).height() - $('#iRicercaPz').offset().top;
                    break;
            }

            // Set Altezze + Width
            $('#divMenuSX').css({'height': pHeightDoc});

            $('#divInfoTOP').css({'width': bodyWidth});
            $('#divInfoTOP p').css({'width': bodyWidth - 75});
            if (NS_PAGINA.privacy.IPATIENT.ATTIVA=='S'){
               $('<div id="divInfoPIC"><p>Il fascicolo può non essere completo</p>' + (NS_PAGINA.privacy.IPATIENT.ATTIVA=='S' && baseUser.TIPO == 'M' && baseUser.TIPO_MED == 'I' && _SET_EMERGENZA_MEDICA != '' ? '<div class="divEmergenzaPIC">EMERGENZA MEDICA</div><div class="divChkPIC"><input type="checkbox" name="chkEmergenzaMedica" id="chkEmergenzaMedica" value="1"></div></div>' : '</div>')).insertBefore('#divInfoTOP p');
            	$('#divInfoTOP').css({'height':'60'});
            	$('#divBody').css({'top':'60'});
            }
            if(_SET_EMERGENZA_MEDICA=='TRUE'){
            	$('#divInfoPIC p').html('');
            }
            $('#divInfoPIC').css({'width': bodyWidth});
            $('#divInfoPIC p').css({'width': bodyWidth - 225});
            $('#iRicercaPz').css({'border': '0', 'width': /*$('#divInfoTOP').innerWidth()*/bodyWidth - 2, 'height': bodyHeight});
            $('#iBody').css({'border': '0', 'width': bodyWidth, 'height': bodyHeight});
            $('#divBody').css({'border': '0', 'width': bodyWidth, 'height': bodyHeight});
            $('#divSpinner').css({'border': '0', 'width': bodyWidth, 'height': bodyHeight});
            // Hide Wrapper
            $('#divInfoTOP').hide();
            $('#iRicercaPz').hide();
            $('#iBody').hide();
            $('#divBody').hide();
            $('#divSpinner').hide();
        }
    },
    setIntestazionePZ: function() {
        // // '[0 - Set Intestazione Paziente]'
        $('#divInfoTOP > p').html(Paziente.cognome + '&nbsp;' + Paziente.nome + '&nbsp;-&nbsp; ' + clsDate.str2str(Paziente.data_nascita, 'YYYYMMDD', 'DD/MM/YYYY'));
        $('#divInfoTOP').show();
        if (NS_PAGINA.privacy.IPATIENT.ATTIVA=='S'){
        	$('#divInfoTOP > p').css({'width':$('#divBody').width() - 90});
            if (Paziente.consenso == '' || Paziente.consenso == null) {
                $('#divBtnConsenso').addClass('consensoPazienteAssente');
            } else if (Paziente.consenso == '0') {
                $('#divBtnConsenso').addClass('consensoPazienteOK');
            } else {
                $('#divBtnConsenso').addClass('consensoPazienteKO');
            }        	
        }

        $('#divBtnConsenso').click(function() {
            Paziente['opener'] = 'ipatient';
            Paziente['action'] = 'INSERISCI';
            Paziente['tipo'] = 'INSERIMENTO_CONSENSO_UNICO';
            switch (Paziente['tipo']) {
                case 'INSERIMENTO_CONSENSO_UNICO':
                    Paziente['action'] = 'INSERISCI';
                    break;
                case 'INSERIMENTO_CONSENSO_EVENTO':
                    Paziente['action'] = 'OSCURA';
                    break;
                case 'VISUALIZZA_CONSENSO_UNICO':
                    Paziente['action'] = 'VISUALIZZA';
                    break;
            }

            NS_CONSENSI.gestioneConsenso(Paziente);
        });
    },
    setIntestazioneRicercaAnagrafica: function() {
        // '[0 - Set Intestazione Ricerca Anagrafica]'
        $('#divInfoTOP p').html('Ricerca Anagrafica');
        $('#divInfoTOP').show();
    },
    setRicercaAnagrafica: function() {
        // '[0 - Set Ricerca Anagrafica]'
        NS_MENU.SETTINGS.resetBody();
        _PROV_CHIAMATA == 'UNISYS';
        $('#divBtnConsenso').removeClass('consensoPazienteAssente consensoPazienteOK consensoPazienteKO');
        $('#divInfoTOP p').html('Ricerca Anagrafica');
		$('#divInfoPIC').remove();
		if (_SET_EMERGENZA_MEDICA==null){
			_SET_EMERGENZA_MEDICA =NS_UTILITY.getUrlParameter('SET_EMERGENZA_MEDICA') != '' ? NS_UTILITY.getUrlParameter('SET_EMERGENZA_MEDICA') : 'FALSE';
		}
		$('#divInfoTOP').show();
        $('#iRicercaPz').attr('src', 'SL_RicercaPazienteFrameset?rf1=141&amp;rf2=*').show();
        NS_PAGINA.setIntestazioneRicercaAnagrafica();
    },

    checkPrivacy:function(){
        eval('NS_PAGINA.privacy = ' + baseReparti.getValue(baseUser.LISTAREPARTI[0],'ATTIVA_PRIVACY'));
	}

};

function abilitaEmergenzaMedica(abilita,nota){

	var newurl = 'servletGeneric?class=iPatient.iPatient';
	newurl += '&id_paziente=' 	+ Paziente.id; 
	newurl += '&iden_anag=' 	+ Paziente.iden_anag; 

	if (abilita){	
		if(_PROV_CHIAMATA=='UNISYS'){
			_PROV_CHIAMATA='UNISYS_EMERG_TRUE';
		}
		
		_SET_EMERGENZA_MEDICA = "TRUE";
		newurl += '&SET_EMERGENZA_MEDICA=TRUE';
		
		dwr.engine.setAsync(false);
		dwrTraceUserAction.openTraceUserActionEmergenza('SET_EMERGENZA_MEDICA',Paziente.iden_anag,'IPATIENT',nota,'');
		dwr.engine.setAsync(true);

	}
	else
	{
		if(_PROV_CHIAMATA=='UNISYS'){
			_PROV_CHIAMATA='UNISYS_EMERG_FALSE';
		}
		newurl += '&SET_EMERGENZA_MEDICA=FALSE';
		
		NS_UTILITY.closeTraceUser();
		_SET_EMERGENZA_MEDICA = "FALSE";
	}
	newurl += '&PROV_CHIAMATA='+_PROV_CHIAMATA;
	newurl += '&TIPOLOGIA_ACCESSO='+_TIPOLOGIA_ACCESSO;
	newurl += '&EVENTO_CORRENTE='+_EVENTO_CORRENTE;
	window.location = newurl;    
}

NS_FUNZIONI = {
    CHECK: {
        livelloPermessi: {
            'APRI_CARTELLA': ['I', 'M', 'B']
        },
        checkCartellaRepartoCompetente: function(obj) {
            // alert(' - Check Reparto cartella PZ: '+$.inArray(obj.cdc,Operatore.cdc) + '\n - Cdc: ' +  obj.data('cod_cdc'));
            return livello = $.inArray(obj.data('cod_cdc'), Operatore.cdc) < 0 ? false : true;
        },
        checkLivelloPermessi: function(key, value) {
            // alert(' - Key: ' + key +'\n - Value: '+ value + '\n - Array: '+ NS_FUNZIONI.CHECK.livelloPermessi[key] + '\n - In Array: ' + $.inArray(value, NS_FUNZIONI.CHECK.livelloPermessi[key]))
            return livello = $.inArray(value, NS_FUNZIONI.CHECK.livelloPermessi[key]) < 0 ? false : true;
        },
        checkLivelloButton: function(obj) {
            // alert('chek livello button: \n' + ' - livello utente: ' + obj.livelloUte + '\n  - lvello Button: ' + obj.livelloButton);
            return livello = $.inArray(obj.livelloUte, obj.livelloButton.split('|')) < 0 ? false : true;
        }
    },
    hideShowRecordWk: function(obj) {
        var show = eval(obj.attr('show'));

        if (show) {
            $('.tableWk tr:gt(0)').show();
            obj.attr('show', 'false').html('Nascondi Precedenti');
        } else {
            $('.tableWk tr:gt(9)').hide();
            obj.attr('show', 'true').html('Visualizza Precedenti');
        }
    },
    apriDocumentoAmbulatorio: function(idRepository) {
        // NS_MENU.SETTINGS.resetBody();
        // $('#iBody').attr('src',"servletGenerator?KEY_LEGAME=VISDOC&idDocumento=" + idRepository).show();	
        var finestra = window.open("servletGenerator?KEY_LEGAME=VISDOC&idDocumento=" + idRepository + "&btnChiudi=S", 'documentoAmbulatorio', 'fullscreen=yes, status=no, scrollbars=no');
    },
    apriPrestazioniStrumentali: function(idRepository) {
        var finestra = window.open("servletGenerator?KEY_LEGAME=VISDOC&idDocumento=" + idRepository + "&btnChiudi=S", 'prestazioniStrumentali', 'fullscreen=yes, status=no, scrollbars=no');
    },
    apriAccesso: function(obj) {
        if (!NS_FUNZIONI.CHECK.checkLivelloPermessi('APRI_CARTELLA', Operatore.tipo))
            return alert('L\'Utente Loggato NON Dispone di Autorizzazioni Sufficienti per effettuare l\'operazione Richiesta');

        if (!NS_FUNZIONI.CHECK.checkCartellaRepartoCompetente(obj)) {
            var msg = 'Attenzione: selezionando OK sarà consentita la visualizzazione di tutti i documenti sanitari memorizzati. E\' responsabilità dell\' utente accedere alle sole informazioni di competenza, nel rispetto della vigente normativa sulla privacy. Tutte le operazioni eseguite verranno tracciate. Continuare?';
            if (!confirm(msg)) {
                return;
            }
        }

        // alert('[0 - Apri Accesso] \n Link Accesso: '+ obj.data('accesso') + '\n Ricovero: ' + obj.data('ricovero') + '\n Cod Cdc: ' + obj.data('cod_cdc') + '\n');
        var url = 'servletGeneric?class=cartellaclinica.cartellaPaziente.cartellaPaziente';
        url += '&iden_evento=' + obj.data('accesso');
        url += '&iden_anag=' + Paziente.iden_anag;
        url += '&reparto=' + obj.data('cod_cdc');
		url += '&ModalitaAccesso=REPARTO';
        // url += '&funzione=' 		 + data.funzione;	url += '&DatiInterfunzione=' + data.DatiInterfunzione;	url += '&ModalitaCartella='  + data.ModalitaCartella;		

        var finestra = window.open(url, 'schedaRicoveroIPatient', 'fullscreen=yes, status=no, scrollbars=no');
        try {
            opener.top.closeWhale.pushFinestraInArray(finestra);
        } catch (e) {
        }
    },
    apriSintesiPS: function(obj) {
        // '[0 - Apri Accesso] '
        // DEA_PS_IDEN - DEA_ANNO - DEA_NUMR
        var url = "servletGenerator?KEY_LEGAME=DATI_PS_ONESYS";
        url += "&COD_FISC=" + Paziente.cod_fisc;
        url += "&DEA_PS_IDEN=" + obj.data('dea_ps_iden');
        url += "&DEA_ANNO=" + obj.data('dea_anno');
        url += "&DEA_NUMR=" + obj.data('dea_numr');
        url += "&IDEN_VISITA=" + obj.data('ricovero');

        if (Operatore.login == 'arry') {
            alert('Alert Solo x Admin: \n' + url);
        }

        NS_MENU.SETTINGS.setButtonActive(obj);
        NS_MENU.SETTINGS.resetBody();
        $('#iBody').attr('src', url).show();
    },
    // Lista Ricoveri DH, ORD, AMBU tranne PS
    getList: function(pStatementName, pParam, pTipo, pAttivaPrivacy) {
        var _div_wrapper = $('<div></div>').addClass("divWrapperWk");
        var _div_titolo = $('<div></div>').addClass("divTitoloWk").text(pTipo);
        var _div_prec = $('<div></div>').addClass("divPrecedenti").text('Visualizza Precedenti').attr('show', 'true').click(function() {
            NS_FUNZIONI.hideShowRecordWk($(this));
        });

        var _table = $('<table></table>').addClass("tableWk");
        var _tr = $('<tr></tr>');
        var _td1 = $('<td></td>');
        var _td2 = $('<td></td>');
        var _td3 = $('<td></td>');
        var _td4 = $('<td></td>');

        var contatore = 0;
//        alert(NS_PAGINA.file+'\n'+pStatementName+'\n'+pParam)
        executeAction(
                "Database"
                , "getListFromResultset"
                , {
                    file_name: NS_PAGINA.file
                    , statement_name: pStatementName
                    , parameters: pParam
                    , predicateFactoryClass: pAttivaPrivacy==true?"it.elco.whale.privacy.predicates.PredicateEventiPrecedentiFactory":""
                    , predicateFactoryParameters: {
                        iden_anag: Paziente.iden_anag
                        , nome: Paziente.nome
                        , cognome: Paziente.cognome
                        , sesso: Paziente.sesso
                        , data_nascita: Paziente.data_nascita
                        , comune_nascita: Paziente.com_nasc
                        , codice_fiscale: Paziente.cod_fisc
                        , codice_utente: baseUser.COD_DEC
                        , emergenza_medica: _SET_EMERGENZA_MEDICA
                        , builderClass: "it.elco.whale.privacy.builders.ElementBuilderRICOVERI"
                        , tipologia_accesso : _TIPOLOGIA_ACCESSO
                        , evento_corrente : _EVENTO_CORRENTE
                    }
                }
        , function(data) {
            // Intestazione tabella
            _td1.text('Data Inizio');
            _td2.text('Data Fine');
            _td3.text('Reparto');
            _td4.text('').css({'width': 27});
            _tr.addClass('trIntestazione');
            _tr.append(_td1);
            _tr.append(_td2);
            _tr.append(_td3);
            _tr.append(_td4);
            _table.append(_tr);

            while (contatore < data["records"].length) {
                _tr = $('<tr></tr>').attr('accesso', data["records"][contatore].LINK_ACCESSO);
                _td1 = $('<td></td>');
                _td2 = $('<td></td>');
                _td3 = $('<td></td>');
                _td4 = $('<td></td>');

                if (data["records"][contatore].DATA_FINE == '') {
                    _tr.addClass('rowGeneric');
                    _td4.append($("<div class='btnRicoveroOpen'></div>"));
                } else {
                    _tr.addClass('rowGeneric');
                    _td4.append($("<div class='btnRicoveroClosed'></div>"));
                }

                $('div', _td4).data({'accesso': data["records"][contatore].LINK_ACCESSO, 'ricovero': data["records"][contatore].IDEN, 'cod_cdc': data["records"][contatore].COD_CDC}).click(function() {
                    NS_FUNZIONI.apriAccesso($(this));
                });

                _td1.text(data["records"][contatore].DATA_INIZIO);
                _td2.text(data["records"][contatore].DATA_FINE);
                _td3.text(data["records"][contatore].REPARTO);

                _tr.append(_td1);
                _tr.append(_td2);
                _tr.append(_td3);
                _tr.append(_td4);

                _table.append(_tr);

                contatore++;
            }

            // Width Tabella
            _table.css({'width': $('#divBody').width() - 30});

            _div_wrapper.append(_div_titolo);
            _div_wrapper.append(_table);

            $('tr:gt(9)', _table).hide();

            if (contatore >= 10) {
                _div_wrapper.append(_div_prec);
            }

            $('#divBody').append(_div_wrapper);
        });
    },
    // Elenco Accessi PS
    getListPS: function(pStatementName, pParam, pTipo, pAttivaPrivacy) {
        var _div_wrapper = $('<div></div>').addClass("divWrapperWk");
        var _div_titolo = $('<div></div>').addClass("divTitoloWk").text(pTipo);
        var _div_prec = $('<div></div>').addClass("divPrecedenti").text('Visualizza Precedenti').attr('show', 'true').click(function() {
            NS_FUNZIONI.hideShowRecordWk($(this));
        });

        var _table = $('<table></table>').addClass("tableWk");
        var _tr = $('<tr></tr>');
        var _td1 = $('<td></td>');
        var _td2 = $('<td></td>');
        var _td3 = $('<td></td>');
        var _td4 = $('<td></td>');
        var _td5 = $('<td></td>');
        var _td6 = $('<td></td>');

        var contatore = 0;

        executeAction(
                "Database"
                , "getListFromResultset"
                , {
                    file_name: NS_PAGINA.file
                    , statement_name: pStatementName
                    , parameters: pParam
                    , predicateFactoryClass: pAttivaPrivacy==true?"it.elco.whale.privacy.predicates.PredicateEventiPrecedentiFactory":""
                    , predicateFactoryParameters: {
                        iden_anag: Paziente.iden_anag
                        , nome: Paziente.nome
                        , cognome: Paziente.cognome
                        , sesso: Paziente.sesso
                        , data_nascita: Paziente.data_nascita
                        , comune_nascita: Paziente.com_nasc
                        , codice_fiscale: Paziente.cod_fisc
                        , codice_utente: baseUser.COD_DEC
                        , emergenza_medica: _SET_EMERGENZA_MEDICA
                        , builderClass: "it.elco.whale.privacy.builders.ElementBuilderRICOVERI"
                        , tipologia_accesso : _TIPOLOGIA_ACCESSO
                        , evento_corrente : _EVENTO_CORRENTE                        	
                    }
                }
        , function(data) {
            // Intestazione tabella
            _td1.text('Data Accesso');
            _td3.text('Pronto Soccorso');
            _td4.text('Modalità Dimissione');
            _td5.text('Esito');
            _td6.text('');
            _tr.addClass('trIntestazione');
            _tr.append(_td1);	/*_tr.append(_td2);*/
            _tr.append(_td3);
            _tr.append(_td4);
            _tr.append(_td5);
            _tr.append(_td6).css({'width': 27});
            _table.append(_tr);

            while (contatore < data["records"].length) {
                _tr = $('<tr></tr>');
                _td1 = $('<td></td>');
                _td2 = $('<td></td>');
                _td3 = $('<td></td>');
                _td4 = $('<td></td>');
                _td5 = $('<td></td>');
                _td6 = $('<td></td>');

                // DEA_PS_IDEN-DEA_ANNO-DEA_NUMR
                _tr.addClass('rowGeneric');

                _td6.append($("<div class='btnRicoveroClosed'></div>"));
                $('div', _td6).data({'dea_ps_iden': data["records"][contatore].NUM_NOSOLOGICO.split('-')[0],
                    'dea_anno': data["records"][contatore].NUM_NOSOLOGICO.split('-')[1],
                    'dea_numr': data["records"][contatore].NUM_NOSOLOGICO.split('-')[2],
                    'accesso': data["records"][contatore].LINK_ACCESSO,
                    'ricovero': data["records"][contatore].IDEN,
                    'cod_cdc': data["records"][contatore].COD_CDC}
                ).click(function() {
                    NS_FUNZIONI.apriSintesiPS($(this));
                });

                _td1.text('Dal ' + data["records"][contatore].DATA_INIZIO);
                _td3.text(data["records"][contatore].REPARTO);
                _td4.text(data["records"][contatore].MOD_DIMISSIONE);
                _td5.text(data["records"][contatore].POST_PS);

                _tr.append(_td1);
                _tr.append(_td3);
                _tr.append(_td4);
                _tr.append(_td5);
                _tr.append(_td6);

                _table.append(_tr);

                contatore++;
            }
            // Width Tabella
            _table.css({'width': $('#divBody').width() - 30})

            _div_wrapper.append(_div_titolo);
            _div_wrapper.append(_table);

            $('tr:gt(9)', _table).hide();

            if (contatore >= 10) {
                _div_wrapper.append(_div_prec);
            }

            $('#divBody').append(_div_wrapper);
        });
    },
    // WK Visite Ambulatorio
    getListVisiteAmbulatorio: function(pStatementName, pParam, pTipo, pAttivaPrivacy) {
        var _div_wrapper = $('<div></div>').addClass("divWrapperWk");
        var _div_titolo = $('<div></div>').addClass("divTitoloWk").text(pTipo);
        var _div_prec = $('<div></div>').addClass("divPrecedenti").text('Visualizza Precedenti').attr('show', 'true').click(function() {
            NS_FUNZIONI.hideShowRecordWk($(this));
        });

        var _table = $('<table></table>').addClass("tableWk");
        var _tr = $('<tr></tr>');
        var _td1 = $('<td></td>');
        var _td2 = $('<td></td>');
        var _td3 = $('<td></td>');
        var _td4 = $('<td></td>');

        // Intestazione tabella
        _td1.text('Esame');
        _td2.text('Data');
        _td3.text('Provenienza');
        _td4.text('').css({'width': 30});
        _tr.addClass('trIntestazione');
        _tr.append(_td1);
        _tr.append(_td2);
        _tr.append(_td3);
        _tr.append(_td4);
        _table.append(_tr);

        var contatore = 0;
        executeAction(
                "Database"
                , "getListFromResultset"
                , {
                    file_name: NS_PAGINA.file
                    , statement_name: pStatementName.split('|')[0]
                    , parameters: pParam[0]
                    , predicateFactoryClass: pAttivaPrivacy==true?"it.elco.whale.privacy.predicates.PredicateDocumentiPrecedentiFactory":""
                    , predicateFactoryParameters: {
                        iden_anag: Paziente.iden_anag
                        , nome: Paziente.nome
                        , cognome: Paziente.cognome
                        , sesso: Paziente.sesso
                        , data_nascita: Paziente.data_nascita
                        , comune_nascita: Paziente.com_nasc
                        , codice_fiscale: Paziente.cod_fisc
                        , codice_utente: baseUser.COD_DEC
                        , emergenza_medica: _SET_EMERGENZA_MEDICA
                        , builderClass: "it.elco.whale.privacy.builders.ElementBuilderDOCUMENTI"
                        , tipologia_accesso : _TIPOLOGIA_ACCESSO
                        , evento_corrente : _EVENTO_CORRENTE	
                    }
                }
        , function(data) {
            while (contatore < data["records"].length) {
                _tr = $('<tr></tr>');
                _td1 = $('<td></td>');
                _td2 = $('<td></td>');
                _td3 = $('<td></td>');
                _td4 = $('<td></td>');

                var idRepository = data["records"][contatore].ID_REPOSITORY;
                if (idRepository != '' && idRepository != null) {
                    _tr.addClass('rowGeneric');
                    //_td4.append($("<div class='esameRefertato' id_referto='"+idRepository+"'></div>"));
                    //$("div.esameRefertato[id_referto='"+idRepository+"']",_td4).click(function(){NS_FUNZIONI.apriDocumentoAmbulatorio(idRepository)});
                    _td4.append($("<div class='esameRefertato' onclick='NS_FUNZIONI.apriDocumentoAmbulatorio(\"" + idRepository + "\");'></div>")/*.click(function(){NS_FUNZIONI.apriDocumentoAmbulatorio(idRepository)})*/);
                } else {
                    _tr.addClass('rowGeneric');
                    _td4.append($("<div></div>"));
                }

                _td1.text(data["records"][contatore].DESCR);
                _td2.text(data["records"][contatore].DAT_ESAME);
                _td3.text(data["records"][contatore].PROVENIENZA);

                _tr.append(_td1);
                _tr.append(_td2);
                _tr.append(_td3);
                _tr.append(_td4);

                _table.append(_tr);

                contatore++;
            }
        });

        var contatore = 0;
        executeAction(
                "Database"
                , "getListFromResultset"
                , {
                    file_name: NS_PAGINA.file
                    , statement_name: pStatementName.split('|')[1]
                    , parameters: pParam[0]
                    , predicateFactoryClass: pAttivaPrivacy==true?"it.elco.whale.privacy.predicates.PredicateDocumentiPrecedentiFactory":""
                    , predicateFactoryParameters: {
                        iden_anag: Paziente.iden_anag
                        , nome: Paziente.nome
                        , cognome: Paziente.cognome
                        , sesso: Paziente.sesso
                        , data_nascita: Paziente.data_nascita
                        , comune_nascita: Paziente.com_nasc
                        , codice_fiscale: Paziente.cod_fisc
                        , codice_utente: baseUser.COD_DEC
                        , builderClass: "it.elco.whale.privacy.builders.ElementBuilderDOCUMENTI"
                        , tipologia_accesso : _TIPOLOGIA_ACCESSO
                        , evento_corrente : _EVENTO_CORRENTE	
                    }
                }
        , function(data) {
            while (contatore < data["records"].length) {
                _tr = $('<tr></tr>');
                _td1 = $('<td></td>');
                _td2 = $('<td></td>');
                _td3 = $('<td></td>');
                _td4 = $('<td></td>');

                var idRepositoryUVA = data["records"][contatore].ID_REPOSITORY;
                if (idRepositoryUVA) {
                    _tr.addClass('rowGeneric');
                    //_td4.append($("<div class='esameRefertato' id_referto='"+idRepositoryUVA+"'></div>"));
                    //$("div.esameRefertato[id_referto='"+idRepositoryUVA+"']",_td4).click(function(){NS_FUNZIONI.apriDocumentoAmbulatorio(idRepositoryUVA)});
                    _td4.append($("<div class='esameRefertato' onclick='NS_FUNZIONI.apriDocumentoAmbulatorio(\"" + idRepositoryUVA + "\");'></div>")/*.click(function(){NS_FUNZIONI.apriDocumentoAmbulatorio(idRepository)})*/);
                } else {
                    _tr.addClass('rowGeneric');
                    _td4.append($("<div></div>"));
                }

                _td1.text(data["records"][contatore].DESCR);
                _td2.text(data["records"][contatore].DAT_ESAME);
                _td3.text(data["records"][contatore].PROVENIENZA);

                _tr.append(_td1);
                _tr.append(_td2);
                _tr.append(_td3);
                _tr.append(_td4);

                _table.append(_tr);

                contatore++;
            }
        });

        // Width Tabella
        _table.css({'width': $('#divBody').width() - (30)});

        _div_wrapper.append(_div_titolo);
        _div_wrapper.append(_table);

        $('tr:gt(9)', _table).hide();

        if (contatore >= 10) {
            _div_wrapper.append(_div_prec);
        }

        $('#divBody').append(_div_wrapper);
    },
    /**
     * Worklist delle prestazioni di radiologia ed endoscopia (informazioni recuperate dal db del RIS polaris).
     * @param {type} pStatementName
     * @param {type} pParam
     * @param {type} pTipo
     * @returns {undefined} 
     */
    getListPrestazioniStrumentali: function(pStatementName, pParam, pTipo, pAttivaPrivacy) {
        //alert("NS_FUNZIONI.getListPrestazioniStrumentali(pStatementName, pParam, pTipo);");
        var _div_wrapper = $('<div></div>').addClass("divWrapperWk");
        var _div_titolo = $('<div></div>').addClass("divTitoloWk").text(pTipo);
        var _div_prec = $('<div></div>').addClass("divPrecedenti").text('Visualizza Precedenti').attr('show', 'true').click(function() {
            NS_FUNZIONI.hideShowRecordWk($(this));
        });

        var _table = $('<table></table>').addClass("tableWk");

        var _td1 = $('<td></td>');
        _td1.text('Esame');
        var _td2 = $('<td></td>');
        _td2.text('Data');
        var _td3 = $('<td></td>');
        _td3.text('Provenienza');
        var _td4 = $('<td></td>');
        _td4.text('').css({'width': 30});

        var _tr = $('<tr></tr>');
        _tr.addClass('trIntestazione');
        _tr.append(_td1);
        _tr.append(_td2);
        _tr.append(_td3);
        _tr.append(_td4);

        _table.append(_tr);

        /*alert("SELECT te.DESCR, radsql.datetimeconverter(e.DAT_ESA, 'YYYYMMDD', 'DD/MM/YYYY') DAT_ESA, tp.DESCR AS PROVENIENZA, IDEN_REF, cee.ARRIVATODA, cee.IDEN_INFOWEB_RICHIESTA, (SELECT ID_REPOSITORY FROM VERSIONI_REFERTI WHERE IDEN_VR IN (SELECT MAX(IDEN_VR) FROM VERSIONI_REFERTI WHERE IDEN_REF = e.IDEN_REF)) AS ID_REPOSITORY\n"+
         "FROM ESAMI e\n"+
         "INNER JOIN TAB_ESA te ON te.IDEN = e.IDEN_ESA\n"+
         "INNER JOIN TAB_PRO tp ON tp.IDEN = e.IDEN_PRO\n"+
         "INNER JOIN COD_EST_ESAMI cee ON cee.IDEN_ESAME = e.IDEN\n"+
         "WHERE e.IDEN_ANAG IN (SELECT IDEN_ANAG FROM COD_EST_ANAG WHERE id1 = '"+pParam[0]+"') AND e.ESEGUITO = '1' AND e.DELETED = 'N' AND e.REPARTO <> 'UVAPL' AND te.METODICA <> '0'\n"+
         "ORDER BY DAT_ESA DESC;");*/

        var contatore = 0;
        executeAction(
                "Database"
                , "getListFromResultset"
                , {
                    file_name: NS_PAGINA.file
                    , statement_name: pStatementName
                    , parameters: pParam[0]
                    , predicateFactoryClass: pAttivaPrivacy==true?"it.elco.whale.privacy.predicates.PredicateDocumentiPrecedentiFactory":""
                    , predicateFactoryParameters: {
                        iden_anag: Paziente.iden_anag
                        , nome: Paziente.nome
                        , cognome: Paziente.cognome
                        , sesso: Paziente.sesso
                        , data_nascita: Paziente.data_nascita
                        , comune_nascita: Paziente.com_nasc
                        , codice_fiscale: Paziente.cod_fisc
                        , codice_utente: baseUser.COD_DEC
                        , emergenza_medica: _SET_EMERGENZA_MEDICA
                        , builderClass: "it.elco.whale.privacy.builders.ElementBuilderDOCUMENTI"
                        , tipologia_accesso : _TIPOLOGIA_ACCESSO
                        , evento_corrente : _EVENTO_CORRENTE
                    }
                }
        , function(data) {
            while (contatore < data["records"].length) {
                var idRepository = data["records"][contatore].ID_REPOSITORY;

                _tr = $('<tr></tr>');
                _td1 = $('<td></td>');
                _td1.text(data["records"][contatore].DESCR);
                _td2 = $('<td></td>');
                _td2.text(data["records"][contatore].DAT_ESA);
                _td3 = $('<td></td>');
                _td3.text(data["records"][contatore].PROVENIENZA);
                _td4 = $('<td></td>');
                if (idRepository != '') {
                    _tr.addClass('rowGeneric');
                    _td4.append($("<div class='esameRefertato' onclick='NS_FUNZIONI.apriPrestazioniStrumentali(\"" + idRepository + "\");'></div>"));
                } else {
                    _tr.addClass('rowGeneric');
                    _td4.append($("<div></div>"));
                }

                _tr.append(_td1);
                _tr.append(_td2);
                _tr.append(_td3);
                _tr.append(_td4);

                _table.append(_tr);

                contatore++;
            }

            _table.css({'width': $('#divBody').width() - (30)});

            _div_wrapper.append(_div_titolo);
            _div_wrapper.append(_table);

            $('tr:gt(9)', _table).hide();

            if (contatore >= 10) {
                _div_wrapper.append(_div_prec);
            }

            $('#divBody').append(_div_wrapper);
        });
    },
    getInfoPaziente: function() {
                var vResp = executeStatement("iPatient.xml", "getInfoPaziente", [Paziente.id], 9);
                if (vResp[0] == 'KO' && vResp[1] == 'no data found') {
                    alert('Paziente NON Presente in Anagrafica Locale. \nPer il paziente in Esame NON è possibile visualizzare Correttamente l\'I-Patient');
                    return false;
                }
                Paziente = {'iden_anag': vResp[2], 'data_nascita': vResp[5], 'nome': vResp[3], 'cognome': vResp[4], 'cod_fisc': vResp[6], 'id': vResp[7], 'com_nasc': vResp[8], 'sesso': vResp[9], 'consenso': vResp[10]}
                //alert("iden_anag: "+Paziente.iden_anag+"\ndata_nascita: "+clsDate.str2str(Paziente.data_nascita,'YYYYMMDD','DD/MM/YYYY')+"\nnome: "+Paziente.nome+"\ncognome: "+Paziente.cognome+"\ncod_fisc: "+Paziente.cod_fisc+"\nid: "+Paziente.id+"\ncom_nasc: "+Paziente.com_nasc+"\nsesso: "+Paziente.sesso+"\nconsenso: "+Paziente.consenso);

        return true;
    },
    getInfoOperatore: function() {
        Operatore.login = baseUser.LOGIN;
        Operatore.descr = baseUser.DESCRIPTION;
        Operatore.tipo = baseUser.TIPO;
        Operatore.livello = baseUser.LIVELLO;
        Operatore.cdc = baseUser.LISTAREPARTI;

    },
    // IPatient x Nuovo PZ
    esaminaPaziente: function(pIdPz) {
        Paziente.id = pIdPz;
	   var pWidthDoc = $(document).width();
	   var bodyWidth = (pWidthDoc - $('#divMenuSX').outerWidth() + 1);
	/*   $('<div id="divInfoPIC"><p>Il fascicolo può non essere completo</p>' + (NS_PAGINA.privacy.IPATIENT.ATTIVA=='S' && baseUser.TIPO == 'M' && baseUser.TIPO_MED == 'I' && _SET_EMERGENZA_MEDICA != '' ? '<div class="divEmergenzaPIC">EMERGENZA MEDICA</div><div class="divChkPIC"><input type="checkbox" name="chkEmergenzaMedica" id="chkEmergenzaMedica" value="1"></div></div>' : '</div>')).insertBefore('#divInfoTOP p');
	   $('#divInfoPIC').css({'width': bodyWidth});
       $('#divInfoPIC p').css({'width': bodyWidth - 225});	*/
       	
	  var messaggio = "Attenzione!! "+Operatore.descr+": la visualizzazione dei dati dei pazienti è consentita dalla normativa Privacy vigente solamente per fini di prevenzione, diagnosi e cura dell'interessato e unicamente da parte di soggetti,  operanti in ambito sanitario, che a vario titolo hanno in cura il paziente stesso."+
		"\n\n"+
		"Accedendo alla funzione richiesta, Le rendiamo noto che tutte le operazioni di consultazione, ricerca e registrazione di dati che effettuerà saranno analiticamente tracciate dal sistema informatico, dichiarando Lei, con la selezione del pulsante OK, di rispettare le disposizioni vigenti in materia di trattamenti dei dati personali."+ 
		"\n\n"+
		"Continuare?";
		
	  if (confirm(messaggio)){
		  
       //   $('#divInfoTOP').css({'width': bodyWidth});
      //    $('#divInfoTOP p').css({'width': bodyWidth - 75});  
      //    $('#divInfoTOP p').css({'width': '1400'});  
          if (NS_PAGINA.privacy.IPATIENT.ATTIVA=='S'){
              $('<div id="divInfoPIC"><p>Il fascicolo può non essere completo</p>' + (NS_PAGINA.privacy.IPATIENT.ATTIVA=='S' && baseUser.TIPO == 'M' && baseUser.TIPO_MED == 'I' && _SET_EMERGENZA_MEDICA != '' ? '<div class="divEmergenzaPIC">EMERGENZA MEDICA</div><div class="divChkPIC"><input type="checkbox" name="chkEmergenzaMedica" id="chkEmergenzaMedica" value="1"></div></div>' : '</div>')).insertBefore('#divInfoTOP p');
           	$('#divInfoTOP').css({'height':'60'});
           	$('#divBody').css({'top':'60'});
           }
          $('#divInfoPIC').css({'width': bodyWidth});
          $('#divInfoPIC p').css({'width': bodyWidth - 225});
          
          if(_SET_EMERGENZA_MEDICA=='TRUE'){
          	$('#divInfoPIC p').html('');
          }
        // Info PZ
        if (!NS_FUNZIONI.getInfoPaziente()) {
            return;
        }
        // Intestazione PZ
        NS_PAGINA.setIntestazionePZ();
        NS_PAGINA.Events.setGenericEvents();
        
        // Menu Laterale PZ
        NS_MENU.getMenuLaterale();

        // Istruzioni Utilizzo IPatient PZ
        NS_MENU.SETTINGS.showIstruzioniMenuLaterale();

        $('#iRicercaPz').hide();
	  }
    },
    bloccaEsaminaPaziente: function() {
        var idPazienteBloccati = new Array();
        idPazienteBloccati.push('PRZVLV44B62B104T');
        idPazienteBloccati.push('PPERFL62H15A145D');
        idPazienteBloccati.push('PPELSN66E05A145T');

        if (jQuery.inArray(Paziente.id, idPazienteBloccati) > -1) {
            return true;
        } else {
            return false;
        }
    }
};

NS_MENU = {
    apriDatilabo: function(obj) {
        NS_PAGINA.Events.attesa(true);
        NS_MENU.SETTINGS.setButtonActive(obj);
        NS_MENU.SETTINGS.resetBody();

        // chiamarta nuova
        $('#iBody').attr('src', 'servletGeneric?class=cartellaclinica.cartellaPaziente.datiStrutturatiLabo.listDocumentLaboratorioFiltro&reparto=IPATIENT&nosologico=&elencoEsami=&numRichieste=5&idPatient=' + Paziente.id + '&provRisultati=&provChiamata=IPATIENT&modalita=PAZIENTE&userLogin=' + Operatore.login + '&idenAnag=' + Paziente.iden_anag);

        $('#iBody').show();
    },
    apriPT: function(obj) {
        NS_MENU.SETTINGS.setButtonActive(obj);
        NS_MENU.SETTINGS.resetBody();
        $('#iBody').show();

        var url = 'servletGenerator?KEY_LEGAME=GESTIONE_PIANI_TERAPEUTICI&TIPO=VISUALIZZA&idRemoto=' + Paziente.id + '&utente=' + Operatore.login + '&CONTEXT_MENU=WK_PT_VISUALIZZA';
        var dt = new Date();
        var today = clsDate.getData(dt, 'YYYYMMDD');
        dt.setDate(dt.getDate() - 365);
        var year = clsDate.getData(dt, 'YYYYMMDD');

        $('#iBody').attr('src', NS_APPLICATIONS.switchTo('RR_PT', url));
    },
    getRicoveri: function(obj) {
        // '[0] Get Ricoveri'
        NS_MENU.SETTINGS.setButtonActive(obj);
        NS_MENU.SETTINGS.resetBody();
        $('#divBody').show();
        NS_FUNZIONI.getList('getRicoveri', [Paziente.id, 'ORD,URG'], 'Ricoveri',NS_PAGINA.privacy.IPATIENT.ATTIVA=='S');
    },
    getRicoveriDH: function(obj) {
        // '[1 - Get Ricoveri DH] 547182'
        NS_MENU.SETTINGS.setButtonActive(obj);
        NS_MENU.SETTINGS.resetBody();
        $('#divBody').show();
        NS_FUNZIONI.getList('getRicoveri', [Paziente.id, 'DH,DS,ODS'], 'Accessi in Day Hospital',NS_PAGINA.privacy.IPATIENT.ATTIVA=='S');
    },
    getAccessiAmbulatorio: function(obj) {
        // '[1 - Get Accessi Ambulatorio]'
        NS_MENU.SETTINGS.setButtonActive(obj);
        NS_MENU.SETTINGS.resetBody();
        $('#divBody').show();
        NS_FUNZIONI.getList('getRicoveriAmbulatorio', [Paziente.id, 'AMB'], 'Cartelle Ambulatoriali',NS_PAGINA.privacy.IPATIENT.ATTIVA=='S');
    },
    getEsamiAmbulatorio: function(obj) {
        // '[1 - Get Esami in Ambulatorio] 639860'
        NS_MENU.SETTINGS.setButtonActive(obj);
        NS_MENU.SETTINGS.resetBody();
        $('#divBody').show();
        NS_FUNZIONI.getListVisiteAmbulatorio('getEsamiAmbulatorio|getEsamiAmbulatorioUVA', [Paziente.id, 'AMB'], 'Esami in Ambulatorio',NS_PAGINA.privacy.IPATIENT.ATTIVA=='S');
    },
    getPrestazioniStrumentali: function(obj) {
        //alert("NS_MENU.getPrestazioniStrumentali(obj);");
        NS_MENU.SETTINGS.setButtonActive(obj);
        NS_MENU.SETTINGS.resetBody();
        $('#divBody').show();
        NS_FUNZIONI.getListPrestazioniStrumentali('getPrestazioniStrumentali', [Paziente.id, 'PRESTAZIONI_STRUMENTALI'], 'Prestazioni Strumentali',NS_PAGINA.privacy.IPATIENT.ATTIVA=='S');
    },
    getAccessiPS: function(obj) {
        // '[1 Get Accessi PS] 550023'
        NS_MENU.SETTINGS.setButtonActive(obj);
        NS_MENU.SETTINGS.resetBody();
        NS_MENU.SETTINGS.showBody();
        NS_FUNZIONI.getListPS('getRicoveri', [Paziente.id, 'PS'], 'Pronto Soccorso',NS_PAGINA.privacy.IPATIENT.ATTIVA=='S');
    },
    getDocumenti: function(obj) {
        try {         
            var msg = 'Attenzione: selezionando OK sarà consentita la visualizzazione di tutti i documenti sanitari memorizzati. E\' responsabilità dell\' utente accedere alle sole informazioni di competenza, nel rispetto della vigente normativa sulla privacy. Tutte le operazioni eseguite verranno tracciate. Continuare?';
            if (!confirm(msg)) {
                return;
            }

//            Paziente['opener']          = 'ipatient';
//            Paziente['emergenza_medica']= _SET_EMERGENZA_MEDICA;


//            var url = NS_CONSENSI.gestioneAperturaDocumenti(Paziente);
    		var url = 'servletGenerator?KEY_LEGAME=VISDOC&idPatient=' + Paziente.id + '&btnChiudi=S&opener=IPATIENT';
            if(NS_PAGINA.privacy.IPATIENT.ATTIVA=='S'){
            	url += "&COD_DEC="+baseUser.COD_DEC;
    	        url += "&COD_FISC="+Paziente.cod_fisc;
    	        url += "&PREDICATE_FACTORY=" + encodeURIComponent(NS_PAGINA.privacy.WK_DOC.PREDICATE_FACTORY);
    	        url += "&BUILDER=" + encodeURIComponent(NS_PAGINA.privacy.WK_DOC.BUILDER);
    	        url += "&SET_EMERGENZA_MEDICA="+_SET_EMERGENZA_MEDICA;       
    	        url += "&QUERY=getListDocumentPatient";
    	        url += "&ID_REMOTO="+Paziente.id;
    	        url += "&TIPOLOGIA_ACCESSO="+_TIPOLOGIA_ACCESSO; 
    	        url += "&EVENTO_CORRENTE="+_EVENTO_CORRENTE;
            }else{
            	url += "&COD_DEC=";
    	        url += "&COD_FISC=";
    	        url += "&PREDICATE_FACTORY=";
    	        url += "&BUILDER=";
    	        url += "&SET_EMERGENZA_MEDICA=";       
    	        url += "&QUERY=";        	
    	        url += "&ID_REMOTO="+Paziente.id;
    	        url += "&TIPOLOGIA_ACCESSO="; 
    	        url += "&EVENTO_CORRENTE=";    	        
            }         
            
        } catch (e) {
            alert("CALL => NS_MENU.getDocumenti\n" + e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description);
        }         

        NS_MENU.SETTINGS.setButtonActive(obj);
        NS_MENU.SETTINGS.resetBody();

        var finestra = window.open(url, 'schedaRicoveroIPatient', 'fullscreen=yes, status=no, scrollbars=no');
        try {
            opener.top.closeWhale.pushFinestraInArray(finestra);
        } catch (e) {
        }
    },
    getPatientSummary: function(obj) {
        /*NS_PAGINA.Events.attesa(true);
         NS_MENU.SETTINGS.setButtonActive(obj);
         NS_MENU.SETTINGS.resetBody();
         
         NS_PATIENT_SUMMARY.getIntestazione();
         NS_PATIENT_SUMMARY.getMedicoDiBase();
         NS_PATIENT_SUMMARY.getProblemiPaziente();
         NS_PATIENT_SUMMARY.getAllergiePaziente();
         NS_PATIENT_SUMMARY.getFarmaciTerapiaCronicaPaziente();	
         NS_PATIENT_SUMMARY.getEsenzioniPaziente();	
         
         setTimeout(function(){		
         NS_PAGINA.Events.attesa(false);
         NS_MENU.SETTINGS.showBody();
         },500);
         */
        /*
         NS_MENU.SETTINGS.setButtonActive(obj);
         NS_MENU.SETTINGS.resetBody();
         $('#iBody').show();
         
         var url = "page?KEY_LEGAME=MMG_PATIENT_SUMMARY&IDEN_ANAG="+Paziente.iden;
         
         $('#iBody').attr('src',NS_APPLICATIONS.switchTo('MMG',url));
         */
		 
    	var date = new Date();

		/* 15/12/2016	lucas : modificato per prevedere la possibilità che obj.attr("coinvolgimento_cura") = '' che prima non veniva considerata mettendo sempre 'N' */
		var coinvolgimento = (typeof obj.attr("coinvolgimento_cura") != 'undefined' || obj.attr("coinvolgimento_cura") == '')  ? (obj.attr("coinvolgimento_cura") == '' ? 'S' : obj.attr("coinvolgimento_cura")) : 'N' ;

		var provenienza = coinvolgimento == 'S' ? 'ASL' : 'ASL_NON_COINVOLTO';
    	var url ='http://10.106.0.145:8082/crystal/?report=/usr/local/report/MMG/DEFAULT/PATIENT_SUMMARY.RPT&t=' + date.getTime() + '&init=pdf&promptpIdenAnag=' + Paziente.iden_anag + "&promptpProvenienza="+provenienza+"&promptpIdenPer=" + Operatore.iden;

    	
/*        var innerUrl = escape("page?KEY_LEGAME=MAIN_PAGE&KEY_SCHEDA=MMG_PATIENT_SUMMARY&IDEN_ANAG=" + Paziente.iden_anag + "&URL_EXTRA=" + escape("STATO=VIS"));
        var url = 'http://10.99.1.132:8081/fenixMMG/Autologin?username=' + "mmg" + '&url=' + innerUrl + '&nomeHost=' + basePC.IP;*/
        window.open(url, "main", "toolbar=no, menubar=no, resizable=no, height=" + (screen.availHeight - 1) + ", width=" + (screen.availWidth - 1) + ",top=0,left=0,status=no,location=no");
    },
    getMenuLaterale: function() {
        var contatore = 0;
        executeAction(
                'Paziente',
                'getIPatientData',
                {
                    iden_anag: Paziente.iden_anag,
                    id_paziente: Paziente.id,
                    emergenzaMedica:_SET_EMERGENZA_MEDICA,
                    provenienza:'UNISYS',
                    attivaPrivacy:NS_PAGINA.privacy.IPATIENT.ATTIVA=='S',
                    fileQuery:NS_PAGINA.file		
                },
        function(resp) {
            if (resp.success == false) {
                return alert('Resp Action: ' + resp.message);
            }

            var _liMenu;

            // [1 - Get Menu Laterale] - Ciclo Tabella Per Ripopolare i Button Con le Nuove Impostazione per il Nuovo Paziente
            $('#UlMenuLaterale li').remove();
            for (var i in resp.data) {
            	_liMenu = $("<li></li>");
                _divWrap = $("<div class='divWrapButton'></div>");
                _divLbl = $("<div class='divLblButton'></div>");

                _divLbl.text(resp.data[i].label);
                _liMenu.attr('livello', resp.data[i].livello);
                _liMenu.attr('funzione', resp.data[i].funzione);
				_liMenu.attr('tipo_ute', resp.data[i].tipo_ute);
				_liMenu.attr('coinvolgimento_cura',resp.data[i].coinvolgimentoCura)
				_liMenu.attr('id', i);

                _divWrap.append(_divLbl);
                _liMenu.append(_divWrap);

                if (resp.data[i].livello < 1) {
                    _liMenu.addClass('liBtnMenuDisabled');
                } else {
                    _liMenu.addClass('liBtnMenu');
                }

                // '[2 - Get Menu Laterale] - Get Menu Laterale key \n' +i + '\n label: ' + resp.data[i].label+ '\n livello: ' + resp.data[i].livello + '\n Funzione: ' + resp.data[i].funzione
                $('#UlMenuLaterale').append(_liMenu);

                contatore++;
            }
            NS_MENU.SETTINGS.setMenuUtente();
        });

        if (_RICERCA_PZ) {
            $('#divRicercaPZ').click(function(){
            NS_UTILITY.closeTraceUser();
            NS_PAGINA.setRicercaAnagrafica();  
            }).show();
        } else {
            $('#divRicercaPZ').hide();
        }

        // Disabilito i Button con LIVELLO 0
        $('.tdBtnMenuDisabled').each(function() {
            $(this).unbind('click').attr('onclick', '');
        });
    },
    SETTINGS: {
        resetBody: function() {
            $('#divBody').html('').hide();
            $('#iRicercaPz').hide();
            $('#iBody').attr('src', 'blank.htm').hide();
        },
        showBody: function() {
            $('#divBody').show();
        },
        setButtonActive: function(obj) {
            var _this = $(obj);
            $('.liBtnMenuActive').each(function() {
                $(this).removeClass('liBtnMenuActive').addClass('liBtnMenu');
            });
            _this.removeClass('liBtnMenu').addClass('liBtnMenuActive');
        },
        showIstruzioniMenuLaterale: function() {
            var _divAvvisoMenu = $('<div></div>');
            _divAvvisoMenu.attr('id', 'divAvvisoMenu');
            _divAvvisoMenu.html('Per Visualizzare le Informazioni sul Paziente Utilizzare il Menu Laterale');
            NS_MENU.SETTINGS.resetBody();
            $('#divBody').append(_divAvvisoMenu).show();
        },
        setMenuUtente: function() {
            $('#UlMenuLaterale li').each(function() {
                var livelloUteButton = $(this).attr('TIPO_UTE');		// Utenti Abilitati al Button
                var livelloButton = $(this).attr('LIVELLO');		// Presenza Dati x Quel Button				
                var livelloButtonUte = NS_FUNZIONI.CHECK.checkLivelloButton({'livelloUte': Operatore.tipo, 'livelloButton': livelloUteButton}); // Utente Abilitato per quel Button

                if (livelloButtonUte > 0) {
                    $(this).addClass('liBtnMenu').unbind('click').click(NS_COMPORTAMENTI.comportamenti[$(this).attr('FUNZIONE')]);
                } else {
                    $(this).addClass('liBtnMenuForbidden').unbind('click').click(function() {
                        return alert('Permissioni NON Sufficienti per Visualizzare i Dati');
                    });
                }

                $(this).find('div.divLblButton').css({'margin-top': ((50 - $(this).find('div.divLblButton').height()) / 2)});

            });

            // Disabilito Button LIVELLO 0
            $('#UlMenuLaterale li[LIVELLO="0"]').each(function() {
                $(this).removeClass().addClass('liBtnMenuDisabled').unbind('click').attr('onclick', '');
            });

            // Ricerca PZ SOLO x UNISYS
            if (_RICERCA_PZ) {
            	 $('#divRicercaPZ').click(function(){
                 NS_UTILITY.closeTraceUser();
                 NS_PAGINA.setRicercaAnagrafica();  
                 }).show();

            } else {
                $('#divRicercaPZ').hide();
            }
        }
    }
};

NS_COMPORTAMENTI = {
    comportamenti: {
        'RICERCA_PZ': function(obj) {
            NS_PAGINA.setRicercaAnagrafica();
        },
        'SCREENING': function(obj) {
            alert('Screening');
        },
        'PT': function(obj) {
            NS_MENU.apriPT($(this));
        },
        'PATIENT_SUMMARY': function(obj) {
            NS_MENU.getPatientSummary($(this));
        },
        'PST': function(obj) {
            NS_MENU.getEsamiAmbulatorio($(this));
        },
        'AMB': function(obj) {
            NS_MENU.getAccessiAmbulatorio($(this));
        },
        'LABO': function(obj) {
            NS_MENU.apriDatilabo($(this));
        },
        'PS': function(obj) {
            NS_MENU.getAccessiPS($(this));
        },
        'DH': function(obj) {
            NS_MENU.getRicoveriDH($(this));
        },
        'RICOVERI': function(obj) {
            NS_MENU.getRicoveri($(this));
        },
        'DOCUMENTI': function(obj) {
            NS_MENU.getDocumenti($(this));
        },
        'PRESTAZIONI_STRUMENTALI': function(obj) {
            NS_MENU.getPrestazioniStrumentali($(this));
        }
    }
};

NS_PATIENT_SUMMARY = {
    getIntestazione: function() {
        var _div_wrapper = $('<div></div>').addClass("divWrapperWk");
        var _div_titolo = $('<div></div>').addClass("divTitoloWk").text('Patient Summary');

        _div_wrapper.append(_div_titolo);
        $('#divBody').append(_div_wrapper);
    },
    getMedicoDiBase: function() {
        var vResp = executeStatement("iPatient.xml", "getMedicoPaziente", [Paziente.id], 1);
        if (vResp[0] == 'KO') {
            return alert('Get Medico di Base: \n' + vResp[1]);
        }

        // alert('Medico di Base: ' + vResp[2]);

        var _table = $('<table></table>').addClass("tableWk");
        var _tr = $('<tr></tr>');
        var _td1 = $('<td>' + vResp[2] + '</td>');

        var _div_wrapper = $('<div></div>').addClass("divWrapperWk");
        var _div_titolo = $('<div></div>').addClass("divTitoloWkPatientSummary").text('Medico di Base');

        _div_wrapper.append(_div_titolo);
        _tr.append(_td1);
        _table.append(_tr);
        _div_wrapper.append(_table);
        $('#divBody').append(_div_wrapper);
    },
    getProblemiPaziente: function() {
        var contatore = 0;
        var rs = executeQuery("iPatient.xml", "getProblemiPaziente", [Paziente.id]);

        var _div_wrapper = $('<div></div>').addClass("divWrapperWk");
        var _div_titolo = $('<div></div>').addClass("divTitoloWkPatientSummary").text('Problemi Paziente');

        var _table = $('<table></table>').addClass("tableWk");
        var _tr = $('<tr></tr>');
        var _td1 = $('<td></td>');
        var _td2 = $('<td></td>');
        var _td3 = $('<td></td>');

        while (rs.next()) {
            if (contatore == 0) {
                // Creo Intestazione tabella
                _td1.text('Data Problema');
                _td2.text('Descrizione Problema');
                _td3.text('Medico');
                _tr.addClass('trIntestazione');
                _tr.append(_td1);
                _tr.append(_td2);
                _tr.append(_td3);
                _table.append(_tr);
            }

            _tr = $('<tr></tr>').addClass('rowGeneric');
            _td1 = $('<td></td>');
            _td2 = $('<td></td>');
            _td3 = $('<td></td>');

            _td1.text(rs.getString("DATA_PROBLEMA"));
            _td2.text(rs.getString("DESCR_PROBLEMA"));
            _td3.text(rs.getString("DESCR_MED"));

            _tr.append(_td1);
            _tr.append(_td2);
            _tr.append(_td3);

            _table.append(_tr);

            contatore++;
        }

        if (contatore == 0) {
            // Wk Vuota
            _td1.text('Nessun Problema Presente');
            _tr.append(_td1);
            _table.append(_tr);
        }

        _div_wrapper.append(_div_titolo);
        _div_wrapper.append(_table);

        _table.append(_tr);
        $('#divBody').append(_div_wrapper);
    },
    getAllergiePaziente: function() {
        var contatore = 0;
        var rs = executeQuery("iPatient.xml", "getAllergiePaziente", [Paziente.id]);

        var _div_wrapper = $('<div></div>').addClass("divWrapperWk");
        var _div_titolo = $('<div></div>').addClass("divTitoloWkPatientSummary").text('Allergie Paziente');

        var _table = $('<table></table>').addClass("tableWk");
        var _tr = $('<tr></tr>');
        var _td1 = $('<td></td>');
        var _td2 = $('<td></td>');
        var _td3 = $('<td></td>');

        while (rs.next()) {
            if (contatore == 0) {
                // Creo Intestazione tabella
                _td1.text('Data');
                _td2.text('Descrizione Allergia');
                _td3.text('Medico');
                _tr.addClass('trIntestazione');
                _tr.append(_td1);
                _tr.append(_td2);
                _tr.append(_td3);
                _table.append(_tr);
            }

            _tr = $('<tr></tr>').addClass('rowGeneric');
            _td1 = $('<td></td>');
            _td2 = $('<td></td>');
            _td3 = $('<td></td>');

            _td1.text(rs.getString("DATA_ALLERGIA"));
            _td2.text(rs.getString("DESCRIZIONE"));
            _td3.text(rs.getString("DESCR_MED"));

            _tr.append(_td1);
            _tr.append(_td2);
            _tr.append(_td3);

            _table.append(_tr);

            contatore++;
        }

        if (contatore == 0) {
            // Wk Vuota
            _td1.text('Nessuna Allergia Presente');
            _tr.append(_td1);
            _table.append(_tr);
        }

        _div_wrapper.append(_div_titolo);
        _div_wrapper.append(_table);

        _table.append(_tr);
        $('#divBody').append(_div_wrapper);

    },
    getFarmaciTerapiaCronicaPaziente: function() {
        var contatore = 0;
        var rs = executeQuery("iPatient.xml", "getFarmaciTerapiaCronicaPaziente", [Paziente.id]);

        var _div_wrapper = $('<div></div>').addClass("divWrapperWk");
        var _div_titolo = $('<div></div>').addClass("divTitoloWkPatientSummary").text('Farmaci Costituenti Terapia Cronica');

        var _table = $('<table></table>').addClass("tableWk");
        var _tr = $('<tr></tr>');
        var _td1 = $('<td></td>');
        var _td2 = $('<td></td>');
        var _td3 = $('<td></td>');

        while (rs.next()) {
            if (contatore == 0) {
                // Creo Intestazione tabella
                _td1.text('Data');
                _td2.text('Farmaco');
                _td3.text('Posologia');
                _tr.addClass('trIntestazione');
                _tr.append(_td1);
                _tr.append(_td2);
                _tr.append(_td3);
                _table.append(_tr);
            }
            _tr = $('<tr></tr>').addClass('rowGeneric');
            _td1 = $('<td></td>');
            _td2 = $('<td></td>');
            _td3 = $('<td></td>');

            _td1.text(rs.getString("DATA"));
            _td2.text(rs.getString("FARMACO"));
            _td3.text(rs.getString("POSOLOGIA"));

            _tr.append(_td1);
            _tr.append(_td2);
            _tr.append(_td3);

            _table.append(_tr);

            contatore++;
        }

        if (contatore == 0) {
            // Wk Vuota
            _td1.text('Nessun Farmaco Costituente Terapia Cronica Presente');
            _tr.append(_td1);
            _table.append(_tr);
        }

        _div_wrapper.append(_div_titolo);
        _div_wrapper.append(_table);

        _table.append(_tr);
        $('#divBody').append(_div_wrapper);
    },
    getEsenzioniPaziente: function() {
        var contatore = 0;
        var rs = executeQuery("iPatient.xml", "getEsenzioniPaziente", [Paziente.id]);

        var _div_wrapper = $('<div></div>').addClass("divWrapperWk");
        var _div_titolo = $('<div></div>').addClass("divTitoloWkPatientSummary").text('Esenzioni Paziente');

        var _table = $('<table></table>').addClass("tableWk");
        var _tr = $('<tr></tr>');
        var _td1 = $('<td></td>');
        var _td2 = $('<td></td>');

        while (rs.next()) {
            if (contatore == 0) {
                // Creo Intestazione tabella
                _td1.text('Codice Esenzione');
                _td2.text('Esenzione');
                _tr.addClass('trIntestazione');
                _tr.append(_td1);
                _tr.append(_td2);
                _table.append(_tr);
            }
            _tr = $('<tr></tr>').addClass('rowGeneric');
            _td1 = $('<td></td>');
            _td2 = $('<td></td>');
           _td1.text(rs.getString("COD_ESENZIONE"));
            _td2.text(rs.getString("DESCR_ESENZIONE"));
            _tr.append(_td1);
            _tr.append(_td2);
            _table.append(_tr);

            contatore++;
        }


        if (contatore == 0) {
            // Wk Vuota
            _td1.text('Nessuna Esenzione per il Paziente');
            _tr.append(_td1);
            _table.append(_tr);
        }




        // Width Tabella
        _table.css({'width': $('#divBody').width() - (30)});



        _div_wrapper.append(_div_titolo);
        _div_wrapper.append(_table);


        _table.append(_tr);
        $('#divBody').append(_div_wrapper);
    }
};




NS_UTILITY = {
    getUrlParameter: function(name) {
        var tmpURL = document.location.href;
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(tmpURL);






        if (results == null) {
        	return "";
        } else {
        	return results[1];
        }
    },
    raddoppia_apici: function(valore) {
    	var stringa = valore.replace('\'', '\'\'');
    	return stringa;
    },
    closeTraceUser:function(){
    	if(_SET_EMERGENZA_MEDICA=='TRUE'){
    	dwr.engine.setAsync(false);            
    	dwrTraceUserAction.closeTraceUserAction('SET_EMERGENZA_MEDICA',null, callBack);
    	dwr.engine.setAsync(true);	
    	function callBack(resp) {
    		if (resp != '')
    			alert(resp);
    	}
    	_SET_EMERGENZA_MEDICA='FALSE';
    	}}
};

