var WindowCartella = this;
$(document).ready(function() {

    if ($('form[name="frmPaziente"]').length == 0) {
        return;
    }

    utilCreaBoxAttesa();
    utilMostraBoxAttesa(true);

    setTimeout(function() {
        CartellaPaziente.setEvents();
        CartellaPaziente.setData();

        $('#intest').css("visibility", "visible");
    }, 1);
});

var ifLeft, ifRight;

var rightMenuBuilded = false;

var FunzioniRichiamate = new Object();

var SezioneLeft;
var SezioneRight;

function loadCartella() {

    try {
        $slidemenu.buildmenuClick("slideMenuMain", arrowimages);
        $slidemenu.buildmenuClick("slideMenuLEFT", arrowimages);

        SezioneHeader = $('.header');
        SezioneLeft = $('#AlberoConsultazioneLEFT');
        SezioneRight = $('#AlberoConsultazioneRIGHT');

        for (var i = 0; i < arrayLabelName.length; i++) {
            SezioneHeader.find('#' + arrayLabelName[i]).text(arrayLabelValue[i]);
            SezioneLeft.find('#' + arrayLabelName[i]).text(arrayLabelValue[i]);
            SezioneRight.find('#' + arrayLabelName[i]).text(arrayLabelValue[i]);
        }

        ifLeft = document.all.frameWork;
        ifRight = document.all.frameConfronto;

        // alert('1 - ifLeft: ' + ifLeft + ' ifRight: ' + ifRight + ' - Dati Cartella: ' + DatiCartella);
        setDimensioniFrameWork();

        try {

            CartellaPaziente.setIdenAnag(
                    DatiCartella.loadForm(DatiCartella.Pazienti, "frmPaziente", "IDEN")
                    );
            //DatiCartella.loadUbicazione(CartellaPaziente.getPaziente("IDEN"));			

            CartellaPaziente.setIdenAccesso(
                    DatiCartella.loadForm(DatiCartella.Accessi, "frmAccesso", "IDEN")
                    );

            if (CartellaPaziente.getAccesso() != null) {
                DatiCartella.loadUbicazione(CartellaPaziente.getAccesso("IDEN"));
            }

            CartellaPaziente.setIdenRicovero(
                    DatiCartella.loadForm(DatiCartella.Ricoveri, "frmRicovero", "IDEN")
                    );
            CartellaPaziente.setIdenPrericovero(
                    DatiCartella.loadForm(DatiCartella.Prericoveri, "frmPrericovero", "IDEN")
                    );

            CartellaPaziente.setReparto(
                    DatiCartella.loadForm(DatiCartella.Reparti, "frmReparto", "COD_CDC", "Modalita")
                    );

            if (CartellaPaziente.getReparto() == null) {
                DatiCartella.Reparti[""] = {COD_CDC: "", Modalita: {}};
                CartellaPaziente.setReparto("");
            }

            DatiCartella.loadForm(DatiCartella.Reparti, "frmRepartoAppoggio", "COD_CDC", "Modalita");

            var CodiceModalitaCartella = CartellaPaziente.getAccesso('CODICE_MODALITA_CARTELLA');
            CodiceModalitaCartella = CodiceModalitaCartella == null ? "" : CodiceModalitaCartella;

            // alert('2 - DatiCartella.Reparti: ' + DatiCartella.Reparti + CartellaPaziente.getReparto() + ' - CodiceModalitaCartella: ' + CodiceModalitaCartella);

            var Modalita = CartellaPaziente.getReparto().Modalita[CodiceModalitaCartella] = $.extend(true, {}, ModalitaCartella.basic);

            var SplitCodice = CodiceModalitaCartella.split('_');
            var pCodCdc = CartellaPaziente.getReparto("COD_CDC");
			
            var Modificatori = {
                TipoRicovero: (SplitCodice.length > 0 ? SplitCodice[0] : ''),
                StatoRicovero: (SplitCodice.length > 1 ? SplitCodice[1] : ''),
                TipoApertura: (typeof document.EXTERN.ModalitaAccesso == 'undefined' ? '' : document.EXTERN.ModalitaAccesso.value),
				Reparto: pCodCdc
            };

            ModalitaCartella.setModificatori(Modalita, Modificatori);

            var pModalita = CodiceModalitaCartella;

            // alert('4 - Modalita: ' + Modalita + ' - pModalita: ' + pModalita + ' - pCodCdc: ' + pCodCdc);

            eval($('form[name="frmModalita"] input[name="RIFERIMENTI"]').val());

            /**********************************************/
            CartellaPaziente.setModalita(CodiceModalitaCartella);

            document.getElementById('AlberoConsultazioneLEFT').className = ModalitaCartella.getClassName();

            DatiInterfunzione.load();
		
            CartellaPaziente.refresh.avvertenze.paziente();

            CartellaPaziente.refresh.labels();

            //CartellaPaziente.refresh.menu();		
            //document.EXTERN.funzione.value = 'apriPianoTerapeutico();';

        } catch (e) {
            DatiCartella.logger.error(e.message);
            document.EXTERN.funzione.value = 'apriErrore();';
            CartellaPaziente.RiferimentiAttivi[sezioneAttiva]['modalita'] = ModalitaCartella.basic;
        }

    } catch (e) {
        alert(e.message);
    }

}

function gestTrace() {
    if (baseReparti.getValue(getForm().reparto, 'TRACE_APERTURA_CARTELLA') == 'S') {
        dwr.engine.setAsync(false);
        dwrTraceUserAction.closeTraceUserAction('NOSOLOGICI_PAZIENTE', (getForm().iden_visita == '' ? getForm().iden_ricovero : getForm().iden_visita), callBack);
        dwr.engine.setAsync(true);
        
        if (WindowCartella.getPaziente('EMERGENZA_MEDICA')){
	    	dwr.engine.setAsync(false);
	        dwrTraceUserAction.closeTraceUserAction('SET_EMERGENZA_MEDICA', (getForm().iden_visita == '' ? getForm().iden_ricovero : getForm().iden_visita), callBack);
	        dwr.engine.setAsync(true);	
        }
        
    } else {
        callBack('');
    }
    function callBack(resp) {
        if (resp != '')
            alert(resp);
    }
}
function setDimensioniFrameWork()
{
    h = document.body.offsetHeight - ifLeft.offsetTop;
    ifLeft.style.height = h + 'px';
    ifRight.style.height = h + 'px';
    try {
        $('#frameWork')[0].contentWindow.setDimensioniPagina();
    }
    catch (e) {
    }
}

function checkIdenVisita(pDati) {
    if (CartellaPaziente.getAccesso() == null) {
        //if(pDati.iden_visita == ''){
        alert('Selezionare un accesso');
        openMenuAccessi();
        utilMostraBoxAttesa(false);
        return false;
    }
    return true;
}

function checkIdenRicovero(pDati) {
    if (CartellaPaziente.getRicovero() == null) {
        //if(pDati.iden_ricovero == ''){
        alert('Selezionare un ricovero');
        openMenuRicoveri();
        utilMostraBoxAttesa(false);
        return false;
    }
    return true;
}

function checkCodCdc(pDati) {
    if (CartellaPaziente.getReparto() == null) {
        //if(pDati.reparto == ''){
        alert('Selezionare un reparto');
        openMenuReparti();
        utilMostraBoxAttesa(false);
        return false;
    }
    return true;
}

/*ALESSANDROC*/
function checkPrericoveri() {
    if (baseReparti.getValue(CartellaPaziente.getReparto("COD_CDC"), 'ABILITA_ASSOCIAZIONE_PRERICOVERO') != 'S' && baseReparti.getValue(CartellaPaziente.getReparto("COD_CDC"), 'ABILITA_ASSOCIAZIONE_OBI') != 'S')
        return;
    //switch (datiIniziali.TipoRicovero){
    switch (CartellaPaziente.getAccesso("TIPOLOGIA")) {
        case 'PRE-DH':
        case 'PRE-DS':
        case 'PRE':
        case 'PRE-VPO':
        case 'OBI':
            return;
            break;
        default:
            break;
    }

    if (CartellaPaziente.getRicovero("IDEN_PRERICOVERO") == "" && (CartellaPaziente.getRicovero("PRESENZA_PRERICOVERI") == 'S' || CartellaPaziente.getAccesso("PRESENZA_OBI") == 'S')) {

        var url = "servletGenerator?KEY_LEGAME=ASSOCIA_PRECEDENTI";
        url += "&IDEN_ANAG=" + CartellaPaziente.getPaziente("IDEN");// datiIniziali.iden_anag;
        url += "&IDEN_RICOVERO=" + CartellaPaziente.getRicovero("IDEN");///datiIniziali.iden_ricovero;
        url += "&IDEN_PRERICOVERO=" + CartellaPaziente.getRicovero("IDEN_PRERICOVERO");//datiIniziali.iden_prericovero;
        url += "&COD_CDC=" + CartellaPaziente.getReparto("COD_CDC");//datiIniziali.reparto;
        url += "&DATA_RICOVERO=" + CartellaPaziente.getRicovero("DATA_ORA_INIZIO").substring(0, 8);//datiIniziali.DataInizioRicovero;
        url += "&TIPO_RICOVERO=" + CartellaPaziente.getAccesso("TIPO_RICOVERO");
        $.fancybox({
            'padding': 3,
            'width': document.body.offsetWidth / 10 * 9,
            'height': document.body.offsetHeight / 10 * 8,
            'href': url,
            'type': 'iframe',
            'hideOnOverlayClick': false,
            'hideOnContentClick': false
        });
    }
}

/**
 * Controlla se la cartella corrente ha associata una cartella di DS. 
 * 
 * @author  gianlucab
 * @version 1.0
 * @since   2016-01-29
 */
function checkDaySurgery() {
	$('div#slideMenuLEFT ul li').filter(function(){
		return /Cartella DS/i.test($(this).text());
	}).css('display', CartellaPaziente.getRicovero('CARTELLA_DS') == 'S' ? 'block' : 'none');
}

function loadInFancybox(param) {
    $.fancybox({
        'padding': 3,
        'width': document.documentElement.offsetWidth / 10 * 9,
        'height': document.documentElement.offsetHeight / 10 * 8,
        'href': param.url,
        'onClosed': typeof param.onClosed == 'function' ? param.onClosed : function() {
        },
        'type': 'iframe',
        'hideOnOverlayClick': false,
        'hideOnContentClick': false
    });
}

function apriChiudiInfo() {
    Frames.toggle();
    setDimensioniFrameWork();
}

function setRiga(obj) {
}//function finta per uniformare le avvertenze alla wk;

function setModalitaCartella(pAttivaConfronto) {

    attivaConfronto = pAttivaConfronto;

    if (attivaConfronto) {
        document.body.className = 'confronto';
        if (!rightMenuBuilded) {
            $slidemenu.buildmenuClick("slideMenuRIGHT", arrowimages);
            rightMenuBuilded = true;
        }
    } else {
        document.body.className = 'singolo';
    }

}

/*FRA reperisce le configurazioni per le schede xml su IMAGOWE.CONFIG_SCHEDE_REPARTO 
 function getConfScheda(pFunzione,pDati){
 try{
 var conf = new Object();
 var vIdenRiferifento = FiltroCartella.getIdenRiferimento(pDati);
 //alert(pFunzione + '\n' + vIdenRiferifento + '\n' + pDati.reparto + '\n' + pDati.iden_anag);
 dwr.engine.setAsync(false);
 dwrUtility.getDatiFunzione(
 pFunzione,
 pDati.reparto,
 vIdenRiferifento,
 pDati.iden_anag,
 callBack
 );
 dwr.engine.setAsync(true);
 
 function callBack(resp){
 if(resp[0]!="OK"){
 FunzioniCartella.logger.debug(resp[1]); // era FunzioniCartella.logger.warning, ma non funzionava 
 alert('Scheda non configurata per la selezione effettuata');
 utilMostraBoxAttesa(false);
 conf = {valid:false};
 }else{
 conf = {valid:true,KEY_LEGAME:resp[1],SITO:resp[2],VERSIONE:resp[3]};
 if(
 resp[4]=='S' &&
 !ModalitaCartella.isReadonly() &&
 confirm("Si vuole procedere all'importazione dei dati da una scheda precedente?")
 ){
 var url = "servletGeneric?class=schedeXml.importazione.html.importa"
 + "&REPARTO="+pDati.reparto
 + "&IDEN_ANAG="+pDati.iden_anag
 + "&IDEN_VISITA="+vIdenRiferifento
 + "&IDEN_VISITA_REGISTRAZIONE="+getAccesso("IDEN")
 + "&IDEN_PER="+baseUser.IDEN_PER
 + "&NUM_NOSOLOGICO="+pDati.ricovero
 + "&FUNZIONE="+pFunzione;
 
 window.showModalDialog(url,this,"dialogHeight:750px;dialogWidth:900px;");
 }
 }
 }
 return conf;
 }catch(e){
 alert('GetConfigurazioniScheda - ' + e.message);
 }
 }*/


function getConfScheda(pFunzione, pDati, pParam /* opzionale */) {
	pParam = typeof pParam === 'object' ? pParam : new Object();
	pParam.showAlerts = typeof pParam.showAlerts === 'boolean' ? pParam.showAlerts : true;
	var conf = new Object();
    try {
        var vIdenRiferifento = FiltroCartella.getIdenRiferimento(pDati);
        //alert(pFunzione + '\n' + vIdenRiferifento + '\n' + pDati.reparto + '\n' + pDati.iden_anag);
        var pFileName = 'schede.xml';
        var pStatementName = 'getConfigurazioneSchede';
        var pBinds = new Array();
        pBinds.push(pFunzione);
        pBinds.push(pDati.reparto);
        pBinds.push(vIdenRiferifento);
        pBinds.push(pDati.iden_anag);
        var pOutsNumber = 7;
        var resp = Statements.execute(pFileName, pStatementName, pBinds, pOutsNumber);
        if (resp[0] != "OK") {
            FunzioniCartella.logger.debug(resp[1]); // era FunzioniCartella.logger.warning, ma non funzionava
			if (pParam.showAlerts) {
				alert('Scheda non configurata per la selezione effettuata');
	            utilMostraBoxAttesa(false);
			}
            conf = {valid: false};
        } else {
            conf = {valid: true, KEY_LEGAME: resp[2], SITO: resp[3], VERSIONE: resp[4], DATA_ULTIMA_MODIFICA: resp[6], SINTESI: resp[7], IDEN_SCHEDA: resp[8]};
            if (resp[5] == 'S' && !ModalitaCartella.isReadonly()) {
                // Controllo importazione ds ods 
                var importabile = 'S';

                var isSchedaImportabile = executeStatement("DatiPrecedenti.xml", "isSchedaImportabile", [vIdenRiferifento, pFunzione], 1);
                if (isSchedaImportabile[0] == 'KO') {
                    alert(isSchedaImportabile[1]);
                } else {
                    importabile = isSchedaImportabile[2];
                }

                if (importabile == 'S') {
                    if (confirm("Si vuole procedere all'importazione dei dati da una scheda precedente?")) {
                        var url = "servletGeneric?class=schedeXml.importazione.html.importa"
                                + "&REPARTO=" + pDati.reparto
                                + "&IDEN_ANAG=" + pDati.iden_anag
                                + "&IDEN_VISITA=" + vIdenRiferifento
                                + "&IDEN_VISITA_REGISTRAZIONE=" + getAccesso("IDEN")
                                + "&IDEN_PER=" + baseUser.IDEN_PER
                                + "&NUM_NOSOLOGICO=" + pDati.ricovero
                                + "&FUNZIONE=" + pFunzione;

                        $.fancybox({
                            'padding': 3,
                            'width': document.body.offsetWidth / 10 * 9,
                            'height': document.body.offsetHeight / 10 * 8,
                            'href': url,
                            'type': 'iframe',
                            'hideOnOverlayClick': false,
                            'hideOnContentClick': false
                        });
                        //window.showModalDialog(url,this,"dialogHeight:450px;dialogWidth:900px;");
                    }
                }
            }
        }
    } catch (e) {
        alert('GetConfigurazioniScheda - ' + e.message);
		conf = {valid: false};
    }
	return conf;
}


function reloadMenu(pDati) {

    //alert(pDati + '\n' + pDati.iden_ricovero + '\n' + pDati.iden_visita + '\n' + pDati.iden_anag + '\n' + pDati.reparto + '\n' + pDati.ricovero + '\n' + pDati.leftRight);
    try {
        dwr.engine.setAsync(false);
        dwrUtility.getUlAlberoRicovero(
                pDati.reparto,
                "schedaRicoveratiMenu",
                "z48",
                CartellaPaziente.getRicovero("TIPOLOGIA"),
                new Array("LONG", "LONG", "LONG", "STRING", "STRING"),
                new Array("idenRicovero", "idenVisita", "idenAnag", "codiceReparto", "numNosologico"),
                new Array("" + pDati.iden_ricovero + "", "" + pDati.iden_visita + "", "" + pDati.iden_anag + "", "" + pDati.reparto + "", "" + pDati.ricovero + ""),
                callBack
                );
        dwr.engine.setAsync(true);

        function callBack(resp) {
            if (resp[0] != "OK") {
                alert(resp[1]);
            } else {
                //alert(resp[2]);
                document.all['slideMenu' + sezioneAttiva].innerHTML = resp[2];
                $slidemenu.buildmenuClick("slideMenu" + sezioneAttiva, arrowimages);
            }
        }
    } catch (e) {
        alert('reloadMenu - ' + e.message);
    }

}

function reloadMenuConfronto(pDati) {
    //alert(pDati + '\n' + pDati.iden_visita + '\n' + pDati.iden_anag + '\n' + pDati.reparto + '\n' + pDati.ricovero);

    try {
        dwr.engine.setAsync(false);
        dwrUtility.getUlAlbero(
                pDati.reparto,
                "schedaRicoveratiMenuConfronto",
                "z49",
                CartellaPaziente.getRicovero("TIPOLOGIA"),
                ["LONG", "LONG", "STRING", "STRING", "LONG"],
                ["idenVisita", "idenAnag", "codiceReparto", "numNosologico"],
                ["" + pDati.iden_visita + "", "" + pDati.iden_anag + "", "" + pDati.reparto + "", "" + pDati.ricovero + -""],
                callBack
                );
        dwr.engine.setAsync(true);


        function callBack(resp) {
            if (resp[0] != "OK") {
                alert(resp[1]);
            } else {
                document.all['slideMenuMain'].innerHTML = resp[2];
                $slidemenu.buildmenuClick("slideMenuMain", arrowimages);
            }
        }
    } catch (e) {
        alert('reloadMenuConfronto - ' + e.message);
    }

}

function openMenuAccessi() {
    openMenu('IDEN_VISITA');
}

function openMenuRicoveri() {
    openMenu('NUM_NOSOLOGICO');
}

function openMenuReparti() {
    openMenu('ANAG_REPARTO');
}

function openMenuStrutture() {
    openMenu('ANAG_STRUTTURA');
}

function openMenu(pTipoFiltro) {

    if (typeof event != 'undefined' && event != null) {
        event.cancelBubble = true;
    } else {
        return;
    }

    var vParam;

    var _menu = ModalitaCartella.getMenus()[pTipoFiltro];

    var predicateFC=CartellaPaziente.checkPrivacy('RICOVERI_PRECEDENTI')?"it.elco.whale.privacy.predicates.PredicateEventiPrecedentiFactory":null;
    switch (pTipoFiltro) {
        case 'IDEN_VISITA':
            vParam = {
                IdenIniziale: CartellaPaziente.RiferimentiAttivi['INIZIALE'].iden_accesso,
                IdenAttivo: CartellaPaziente.getAccesso("IDEN"),
                Attributes: ["IDEN"],
                StatementParam: [CartellaPaziente.getRicovero("IDEN")],
                StatementName: _menu.statement,
                Columns: _menu.columns,
						title:_menu.title,
                        predicateFactoryClass:null
            };
            break;
        case 'NUM_NOSOLOGICO':
        	/* if(CartellaPaziente.checkPrivacy('RICOVERI_PRECEDENTI')){
        	 
        	 }*/
            vParam = {
                IdenIniziale: CartellaPaziente.RiferimentiAttivi['INIZIALE'].iden_ricovero,
                IdenAttivo: CartellaPaziente.getRicovero("IDEN"),
                Attributes: ["LINK_ACCESSO", "IDEN"],
                StatementParam: [CartellaPaziente.getPaziente("IDEN")],
                StatementName: _menu.statement,
                Columns: _menu.columns,
						title:_menu.title,
                        predicateFactoryClass:predicateFC
            };
            break;
        case 'ANAG_REPARTO':
            vParam = {
                IdenIniziale: DatiCartella.Reparti[CartellaPaziente.RiferimentiAttivi['INIZIALE'].cod_cdc]["IDEN_PRO"],
                IdenAttivo: CartellaPaziente.getReparto("IDEN"),
                StatementName: "getReparti",
                StatementParam: [baseUser.LOGIN],
                Columns: [
                    {field: "REPARTO", label: "Reparto", width: "75%"}
                ],
                Attributes: ["IDEN", "COD_CDC"],
						title:"REPARTI",
                        predicateFactoryClass:predicateFC
            };
            break;
        default:
            return;
    }

	var _table = $('<table></table>').addClass("PopupMenu");

    var _tr = $('<tr></tr>')
            .append(
                    $('<th></th>').attr("width", "15%")
                    );

    for (var i = 0; i < vParam.Columns.length; i++) {
        _tr.append(
                $('<th>' + vParam.Columns[i].label + '</th>').attr("width", vParam.Columns[i].width)
                );
    }

    _table.append(
            $('<thead></thead>').append(_tr)
            );

    var _tbody = $('<tbody></tbody>');
    var modalitaAccesso; try { modalitaAccesso = document.EXTERN.ModalitaAccesso.value; } catch(e) { modalitaAccesso = baseUser.MODALITA_ACCESSO || 'REPARTO'; }

    executeAction(
            "Database"
            , "getListFromResultset"
            , {
                file_name : "cartellaPaziente.xml", 
                statement_name : vParam.StatementName, 
                parameters : vParam.StatementParam, 
                predicateFactoryClass : vParam.predicateFactoryClass, 
                predicateFactoryParameters: {
                    iden_anag : getPaziente("IDEN"), 
                    nome : getPaziente("NOME"), 
                    cognome : getPaziente("COGN"), 
                    sesso : getPaziente("SESSO"), 
                    data_nascita : getPaziente("DATA"), 
                    comune_nascita : getPaziente("COM_NASC"), 
                    codice_fiscale : getPaziente("COD_FISC"), 
                    codice_utente : baseUser.COD_DEC, 
                    emergenza_medica: getPaziente("EMERGENZA_MEDICA"),
                    builderClass : "it.elco.whale.privacy.builders.ElementBuilderRICOVERI",
                    tipologia_accesso:modalitaAccesso,
                    evento_corrente:getRicovero("NUM_NOSOLOGICO")
                }

            }
    , function(data) {
        //var rs = executeQuery("cartellaPaziente.xml" , vParam.StatementName , vParam.StatementParam);
        $.each(data['records'], function(index, valueMap) {

            var _tr = $('<tr></tr>');
            var _td = $('<td></td>');
            if (valueMap['IDEN'] == vParam.IdenIniziale) {
                _tr.addClass('Iniziale');
                _td.text("Selezione iniziale");
            }

            if (valueMap['IDEN'] == vParam.IdenAttivo) {
                _tr.addClass('Selezionato');
                _td.text("Selezione attuale");
            }

            _tr.append(_td);

            for (var i = 0; i < vParam.Columns.length; i++) {
                //alert(vParam.Columns[i].field + ' : ' + rs.getString(vParam.Columns[i].field));
                _tr.append($('<td>' + valueMap[vParam.Columns[i].field] + '</td>'));
            }
            for (var i = 0; i < vParam.Attributes.length; i++) {
                _tr.attr(vParam.Attributes[i], valueMap[vParam.Attributes[i]]);
            }
            _tr.click(function() {

                utilMostraBoxAttesa(true);

                DatiCartella.logger.clean();

                var _this = $(this);
                switch (pTipoFiltro) {
                    case 'IDEN_VISITA':
                        DatiCartella.loadAccesso(_this.attr("IDEN"));
                        break;
                    case 'NUM_NOSOLOGICO':
                    if (_this.attr("IDEN") == vParam.IdenIniziale) {
                        DatiCartella.loadAccesso(CartellaPaziente.RiferimentiAttivi['INIZIALE'].iden_accesso);
                    }
                    else {
                        DatiCartella.loadAccesso(_this.attr("LINK_ACCESSO"));
                    }
                        break;
                    case 'ANAG_REPARTO':
                        DatiCartella.loadReparto(_this.attr("COD_CDC"));
                        break;
                    default:
                        return;
                }

                $('div.menuRicoveriAccessi').remove();

                FiltroCartella.check();
                FiltroCartella.changeLivelloValue(pTipoFiltro);
                
                CartellaPaziente.ready();
            });
            _tbody.append(_tr);

        });

        _table.append(_tbody);
        var _pagine = Math.ceil(data['records'].size / 8);

        var _header = null;

        if (_pagine > 1) {
			_header =	$('<div></div>')
			.addClass("Paginatore")
			.data({
				"pagine":_pagine,
				"pagina":1,
				"righe": data['records'].size
			})
            .append($('<div></div>').addClass("btn").addClass("Previous").click(Menu.paginatore.previous).css("visibility", "hidden"))
            .append($('<div>Pagina 1 di ' + _pagine + '</div>').addClass("Testo"))
            .append($('<div></div>').addClass("btn").addClass("Next").click(Menu.paginatore.next));
            _tbody.find('tr:gt(7)').hide();
        }

        Menu.tbody = _tbody;
        Menu.paginatore.obj = _header;

        Popup.append({
            obj: _table,
            header: _header,
            title: vParam.title,
            width: 850,
            height: 440
        });

    }
    );
}

var Menu = {
    tbody: null,
    obj: null,
    paginatore: {
        obj: null,
        set: function() {

            Menu.paginatore.obj.find('.Previous')
                    .css({
                        "visibility": (Menu.paginatore.obj.data("pagina") == 1 ? "hidden" : "visible")
                    });

            Menu.paginatore.obj.find('.Next')
                    .css({
                        "visibility": (Menu.paginatore.obj.data("pagina") == Menu.paginatore.obj.data("pagine") ? "hidden" : "visible")
                    });

            var records = {
                bottom: (Menu.paginatore.obj.data("pagina") * 8) - 8 - 1,
                top: (Menu.paginatore.obj.data("pagina") * 8)
            };

            Menu.tbody.find('tr').hide();

            if (records.bottom < 0) {
                Menu.tbody.find('tr:lt(' + records.top + ')').show();
            } else {
                Menu.tbody.find('tr:gt(' + records.bottom + '):lt(' + records.top + ')').show();
            }

            Menu.paginatore.obj.find('.Testo').text(
                    "Pagina " + Menu.paginatore.obj.data("pagina") + " di " + Menu.paginatore.obj.data("pagine")
                    );
        },
        previous: function() {
            event.cancelBubble = true;
            Menu.paginatore.obj.data("pagina", Menu.paginatore.obj.data("pagina") - 1);
            Menu.paginatore.set();
        },
        next: function() {
            event.cancelBubble = true;
            Menu.paginatore.obj.data("pagina", Menu.paginatore.obj.data("pagina") + 1);
            Menu.paginatore.set();
        }

    }

};

function openMenuVersioni() {
    switch (CartellaPaziente.getFunzione()) {
        default:
            alert(CartellaPaziente.getFunzione());
    }
}

function getFrame(objDocument) {

    if (typeof objDocument == 'undefined') {
        if (sezioneAttiva == 'LEFT')
            return ifLeft;
        if (sezioneAttiva == 'RIGHT')
            return ifRight;
    }

    var Frame = undefined;
	try {
		while (getParentWindow(objDocument).frameElement) {
			Frame = getParentWindow(objDocument).frameElement;
			objDocument = getDocumentElement(Frame);
		}
	} catch(e) {
		// SecurityError
	}
    var id = typeof Frame === 'object' && typeof Frame.id === 'string' ? Frame.id : '';
    switch (id) {
        case 'frameWork':
            return ifLeft;
        case 'frameConfronto':
            return ifRight;
        default:
            return ifLeft;
    }

    function getParentWindow(obj) {
    	return obj.parentWindow || obj.defaultView;
    }
    
    function getDocumentElement(obj) {
        do {
            obj = obj.parentNode;
        } while (obj.parentNode)
        return obj;
    }

}

function getForm(objDocument) {
    var exceptions = {
        "DATA_INCONSISTENCY" : new Error("I dati caricati risultano incongruenti")
        };
	
    if (typeof objDocument !== 'undefined') {
    	var obj = getFrame(objDocument);
    	var id = typeof obj === 'object' && typeof obj.id === 'string' ? obj.id : '';
        switch (id) {
            case 'frameWork':
                sezioneAttiva = 'LEFT';
                break;
            case 'frameConfronto':
                sezioneAttiva = 'RIGHT';
                break;
            default:
                sezioneAttiva = 'LEFT';
                break;
        }
    }

    function clsForm() {

        this.iden_anag = CartellaPaziente.getPaziente("IDEN");
        this.idRemoto = CartellaPaziente.getPaziente("ID_REMOTO");
        this.iden_scheda = $('iframe#frameWork').contents().find('form[name=EXTERN] input[name=IDEN_SCHEDA]').val() || null;
        
        if (CartellaPaziente.getAccesso() != null) {

            if (CartellaPaziente.getAccesso("IDEN_ANAG") != this.iden_anag) {
                throw exceptions.DATA_INCONSISTENCY;
            }

            this.iden_visita = CartellaPaziente.getAccesso("IDEN");
            this.CodCdcAppoggio = CartellaPaziente.getAccesso("COD_CDC_APPOGGIO");

        } else {
            this.iden_visita = this.CodCdcAppoggio = "";
        }

        if (CartellaPaziente.getRicovero() != null) {

            if (CartellaPaziente.getRicovero("IDEN_ANAG") != this.iden_anag) {
                throw exceptions.DATA_INCONSISTENCY;
            }

            this.iden_ricovero = CartellaPaziente.getRicovero("IDEN");
            this.ricovero = CartellaPaziente.getRicovero("NUM_NOSOLOGICO");
            this.TipoRicovero = CartellaPaziente.getRicovero("TIPOLOGIA");
            this.dimesso = CartellaPaziente.getRicovero("DIMESSO");
            this.PresenzaPrericoveri = CartellaPaziente.getRicovero("PRESENZA_PRERICOVERI");

            this.dea_str = CartellaPaziente.getRicovero("DEA_STR");
            this.dea_anno = CartellaPaziente.getRicovero("DEA_ANNO");
            this.dea_cartella = CartellaPaziente.getRicovero("DEA_CARTELLA");
            //alert("DEA_STR: "+top.getForm().dea_str+"\nDEA_ANNO: "+top.getForm().dea_anno+"\nDEA_CARTELLA: "+top.getForm().dea_cartella);
        } else {
            this.iden_ricovero = this.ricovero = this.TipoRicovero = this.dimesso = this.PresenzaPrericoveri = "";
        }

        if (CartellaPaziente.getPrericovero() != null) {
        	switch(CartellaPaziente.getPrericovero("TIPOLOGIA")){
			case 'PRE-DH':
			case 'PRE-DS':
			case 'PRE':
			case 'PRE-VPO':
			case 'OBI':
			case 'PS':
        		if (CartellaPaziente.getPrericovero("IDEN_ANAG") != this.iden_anag) {
        			throw exceptions.DATA_INCONSISTENCY;
        		}
        		break;
        	default:
        		if (CartellaPaziente.getPrericovero("IDEN_ANAG") != this.iden_anag) {
        			DatiCartella.logger.error("I dati caricati risultano incongruenti: Prericovero Associato con iden anagrafico differente dal paziente selezionato");
        		} 
        		break;
        	}
            this.iden_prericovero = CartellaPaziente.getPrericovero("IDEN");
            this.prericovero = CartellaPaziente.getPrericovero("NUM_NOSOLOGICO");

        } else {
            this.iden_prericovero = this.prericovero = "";
        }

        if (CartellaPaziente.getReparto("COD_CDC") != "") {
            this.reparto = CartellaPaziente.getReparto("COD_CDC");
            this.cod_dec_Reparto = CartellaPaziente.getReparto("COD_DEC");
            this.IdenPro = CartellaPaziente.getReparto("IDEN_PRO");
        } else {
            this.reparto = this.cod_dec_Reparto = this.IdenPro = "";
        }

        this.funzioneAttiva = CartellaPaziente.getFunzione();

    }

    return new clsForm();
}

var PostInserimento = {
    CheckAppuntamento: function() {

        var vResp = executeStatement("cartellaPaziente.xml", "checkAppuntamentoAccesso", [baseUser.LOGIN, getRicovero("IDEN")/*datiIniziali.iden_ricovero*/], 1);
        if (vResp[0] == 'KO') {
            alert(vResp[1]);
        } else {

            if (vResp[2] != null && vResp[2] != 'null') {
                $.fancybox({
                    'padding': 3,
                    'width': document.body.offsetWidth / 10 * 9,
                    'height': document.body.offsetHeight / 10 * 8,
                    'href': "servletGenerator?KEY_LEGAME=GESTIONE_ACCESSI_APPUNTAMENTI&VALORI=" + vResp[2],
                    'type': 'iframe',
                    'hideOnOverlayClick': false,
                    'hideOnContentClick': false,
                    'onClosed': function() {
                        refreshPage();
                    }
                });
            }
        }
    }

}

var Statements = {
    logger: null,
    retArrayForStatement: function(pBinds) {
        var retArray = new Array();
        switch (typeof pBinds) {
            case 'object':
                retArray = pBinds;
                break;
            case 'undefined':
                break;
            default:
                retArray.push(pBinds);
                break;
        }
        return retArray;
    },
    execute: function(pFileName, pStatementName, pBinds, pOutsNumber) {
        var vResponse;
        //serve per le pagine aperte con window.open
        var vBinds = $.extend(true, [], Statements.retArrayForStatement(pBinds));
        dwr.engine.setAsync(false);
        dwrUtility.executeStatement(pFileName, pStatementName, vBinds, (typeof pOutsNumber == 'undefined' ? 0 : pOutsNumber), callBack);
        dwr.engine.setAsync(true);
        Statements.logger.info("'" + pFileName + "' - " + "'" + pStatementName + "' - [" + pBinds + "] [" + vResponse + "]");
        return vResponse;

        function callBack(resp) {
            vResponse = resp;
        }
    },
    executeBatch: function(pFileName, pStatementName, pBinds, pOutsNumber) {
        var vResponse;
        //serve per le pagine aperte con window.open
        var vBinds = $.extend(true, [], Statements.retArrayForStatement(pBinds));
        dwr.engine.setAsync(false);
        dwrUtility.executeBatchStatement(pFileName, pStatementName, vBinds, (typeof pOutsNumber == 'undefined' ? 0 : pOutsNumber), callBack);
        dwr.engine.setAsync(true);
        Statements.logger.info("'" + pFileName + "' - " + "'" + pStatementName + "' - [" + vBinds + "] [" + vResponse + "]");
        return vResponse;

        function callBack(resp) {
            vResponse = resp;
        }
    },
    query: function(pFileName, pStatementName, pBinds, pCallBack) {


        var vRs;
        var vResponse;
        var async = (typeof pCallBack == 'function');

        //serve per le pagine aperte con window.open
        var vBinds = $.extend(true, [], Statements.retArrayForStatement(pBinds));

        dwr.engine.setAsync(async);

        if (async) {
            dwrUtility.executeQuery(pFileName, pStatementName, vBinds, function(resp) {
                vRs = getResultset(resp);
                pCallBack(vRs);
            });
        } else {
            dwrUtility.executeQuery(pFileName, pStatementName, vBinds, callBack);
            return vRs;
        }

        function callBack(resp) {
			Statements.logger.info("'" + pFileName + "' - " + "'" + pStatementName + "' - [" + pBinds + "] [rows found:"+resp.length+"]");
            vRs = getResultset(resp);
        }

        function getResultset(resp) {
            var valid = true;
            var error = '';
            var ArColumns, ArData;

            if (resp[0][0] == 'KO') {
                valid = false;
                error = resp[0][1];
                ArColumns = ArData = new Array();
            } else {
                ArColumns = resp[1];
                ArData = resp.splice(2, resp.length-1);
            }

            return {
                isValid: valid,
                getError: function() {
                    return error;
                },
                columns: ArColumns,
                data: ArData,
                size: ArData.length,
                current: null,
                next: function() {
                    if (this.current == null && this.size > 0) {
                        this.current = 0;
                        return true;
                    } else {
                        return ++this.current < this.size;
                    }
                },
                getString: function(pColumnName) {
                    return this.data[this.current][this.getColumnIndex(pColumnName)];
                },
                getInt: function(pColumnName) {
                    return parseInt(this.getString(pColumnName), 10);
                },
                getColumnIndex: function(pColumnName) {
                    pColumnName = pColumnName.toUpperCase();
                    for (var i = 0; i < this.columns.length; i++) {
                        if (this.columns[i] == pColumnName) {
                            return i;
                        }
                    }
                }
            }

        }
    }
};

var Actions = {
    execute: function(scope, key, parameters, pCallBack) {

        pCallBack = typeof pCallBack == "function" ? pCallBack : callBack;

        dwr.engine.setAsync(false);
        dwrUtility.executeAction(
                scope,
                key,
                (typeof parameters == 'object' ? JSON.stringify(parameters) : parameters),
                pCallBack
                );
        dwr.engine.setAsync(true);

        function callBack(response) {
            if (response.success == false) {
                alert(response.message);
            }
        }
    }
};

window.executeStatement = Statements.execute;
window.executeBatchStatement = Statements.executeBatch;
window.executeQuery = Statements.query;

window.executeAction = Actions.execute;

//window.NS_APPLICATIONS			= top.NS_APPLICATIONS;

try {
    window.home = opener.top.home;
}
catch (e) {
    window.home = null;
}

function infoPopup(props) {
    $('div#infoPopup').remove();
    var infoContainer = $(document.createElement('DIV'));
    infoContainer.attr('id', 'infoPopup').addClass('boxInfoLayer');
    var infoContainerInner = $(document.createElement('DIV'));
    infoContainerInner.addClass('boxInfoLayer-inner').append(props.contents);
    infoContainer.append(infoContainerInner);
    var css = {
        'position': 'absolute',
        'left': event.clientX,
        'top': event.clientY,
        'z-index': 50,
        'display': 'none'
    };
    infoContainer.css(css);
    if (typeof props.css != undefined) {
        infoContainer.css(props.css);
    }

    $('body').append(infoContainer);
    infoContainer.click(function() {
        $(this).remove();
    }).show(typeof props.showSpeed == 'undefined' ? 200 : props.showSpeed);
}



function bloccaAperturaIpatient(idPaziente) {
    var idPazienteBloccati = new Array();
    idPazienteBloccati.push('PRZVLV44B62B104T');
    idPazienteBloccati.push('PPERFL62H15A145D');
    idPazienteBloccati.push('PPELSN66E05A145T');

    if (jQuery.inArray(idPaziente, idPazienteBloccati) > -1)
        return true;
    else
        return false;
}
