var lockEvent = false;
var FasciaSelezionata = null;
var DataSelezionata = null;
var OraSelezionata = null;
var codificaTestataSelezionata = null;
var codificaDettaglioSelezionato = null;
var idenTestataSelezionata = null;
var idenDettaglioSelezionato = null;
var idenParentSelezionato = null;
var idenPrecedenteSelezionato = null;
var statoTestataSelezionata = null;
var statoSchedaSelezionata = null;
var statoDettaglioSelezionato = null;
var idenSchedaSelezionata = null;
var idenUtenteTestataSelezionata = null;
var idenUtenteSchedaSelezionata = null;
var sottotipoSchedaSelezionata = null;
var idenUtenteDettaglioSelezionato = null;
var dataDettaglioSelezionato = null;
var oraDettaglioSelezionato = null;
var idenCicloTestataSelezionata = null;
var modificaDettaglioAbilitata = false;
var WindowCartella = null;
var sezioni2view = new Array();
var arrayDettagliRange = new Array();
var arrayDate = new Array();

var zoomAttivo = false;
var vDati;
/* 'contextTerapiaType', */
var ArrayContextDescriptor = new Array('contextMenu', 'contextStorico',
    'contextFiltri', 'contextStampe');

var classMenu = {
    Fascia : null,
    Data : null,
    Ora : null,
    codificaTestata : null,
    codificaDettaglio : null,
    idenTestata : null,
    idenScheda : null,
    idenDettaglio : null,
    idenParent : null,
    idenPrecedente : null,
    statoTestata : null,
    statoScheda : null,
    statoDettaglio : null,
    idenUtenteTestata : null,
    idenUtenteScheda : null,
    sottotipoScheda : null,
    idenUtenteDettaglio : null,
    dataDettaglio : null,
    oraDettaglio : null,
    sezioni : [],
    ModificaAbilitata : false,
    idenCiclo : null,
    Reset : function() {
        classMenu.Fascia = classMenu.Data = classMenu.Ora = null;
        classMenu.codificaTestata = classMenu.codificaDettaglio = null;
        classMenu.idenTestata = classMenu.idenScheda = classMenu.idenDettaglio = classMenu.idenParent = idenPrecedente = null;
        classMenu.statoTestata = classMenu.statoScheda = classMenu.statoDettaglio = null;
        classMenu.idenUtenteTestata = classMenu.idenUtenteScheda =classMenu.sottotipoScheda = classMenu.idenUtenteDettaglio = null;
        classMenu.dataDettaglio = classMenu.oraDettaglio = null;
        classMenu.sezioni = new Array();
        classMenu.ModificaAbilitata = false;
        classMenu.idenCiclo = null;

        classMenu.Init();
        classMenu.ResetParameter();
    },
    Init : function() {
        classMenu.Fascia = FasciaSelezionata;
        classMenu.Data = DataSelezionata;
        classMenu.Ora = OraSelezionata;
        classMenu.codificaTestata = codificaTestataSelezionata;
        classMenu.codificaDettaglio = codificaDettaglioSelezionato;
        classMenu.idenTestata = idenTestataSelezionata;
        classMenu.idenScheda = idenSchedaSelezionata;
        classMenu.idenDettaglio = idenDettaglioSelezionato;
        classMenu.idenParent = idenParentSelezionato;
        classMenu.idenPrecedente = idenPrecedenteSelezionato;
        classMenu.statoTestata = statoTestataSelezionata;
        classMenu.statoScheda = statoSchedaSelezionata;
        classMenu.statoDettaglio = statoDettaglioSelezionato;
        classMenu.idenUtenteTestata = idenUtenteTestataSelezionata;
        classMenu.idenUtenteScheda = idenUtenteSchedaSelezionata;
        classMenu.sottotipoScheda = sottotipoSchedaSelezionata;
        classMenu.idenUtenteDettaglio = idenUtenteDettaglioSelezionato;
        classMenu.dataDettaglio = dataDettaglioSelezionato;
        classMenu.oraDettaglio = oraDettaglioSelezionato;
        classMenu.sezioni = sezioni2view;
        classMenu.ModificaAbilitata = modificaDettaglioAbilitata;
        classMenu.idenCiclo = idenCicloTestataSelezionata;
    },
    ResetParameter : function() {
        codificaTestataSelezionata = codificaDettaglioSelezionato = null;
        idenTestataSelezionata = idenSchedaSelezionata = idenDettaglioSelezionato = idenParentSelezionato = idenPrecedenteSelezionato = null;
        statoTestataSelezionata = statoSchedaSelezionata = statoDettaglioSelezionato = null;
        idenUtenteTestataSelezionata = idenUtenteSchedaSelezionata = sottotipoSchedaSelezionata = idenUtenteDettaglioSelezionato = dataDettaglioSelezionato = oraDettaglioSelezionato = FasciaSelezionata = null;
        DataSelezionata = OraSelezionata = null;
        idenCicloTestataSelezionata = null;
        modificaDettaglioAbilitata = false;
        sezioni2view = new Array();
    }
};

var idenTerapia2ins;
var typeTerapia2ins;
$.fn.equalizeHeights = function() {
    var maxHeight = this.map(function(i, e) {
        return $(e).height();
    }).get();
    return this.height(Math.max.apply(this, maxHeight));
};

$(function() {
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
    try {
    	
    	$('div.Terapia').find('th').find('div#divIntScheda').hide();
        window.vDati = WindowCartella.getForm(document);

        window.name = 'PIANO_GIORNALIERO';
        //vDati = top.getForm(document);
        // $('div.in_validita:even').css({"border-bottom":"2px solid red"});

        if(!WindowCartella.ModalitaCartella.isReadonly()
            && $("input#importazioneTerapie").val()=="S"
            && $.inArray(baseUser.TIPO,config.terapie.inserimento.utenti)>=0
            && confirm("Si vuole procedere all\'importazione delle terapie da un ricovero precedente?")) {
            terapie.apriImportazione();
        }

        $('div.in_validita').live('mouseover', function(e) {
            $(this).addClass('selected');
        });
        $('div.out_validita').live('mouseover', function(e) {
            var table = $(this).closest('table');
            table.css({
                'z-index' : -1
            });
        });
        $('div.in_validita').live('mouseleave', function(e) {
            var tables = $(this).closest('table').siblings();
            $(this).removeClass('selected');
            tables.css({
                'z-index' : 0
            });
        });
        $('div.Procedura,div.Terapia').each(function() {
            $(this).find('table').equalizeHeights();
        });

        var height = $('#content').height();
        $('tr#fasce').height(height);
        $('#content').css({
            top : -height - 1
        });

        $('div.Terapia table.Scheda').live('mousedown', function(e) {
            var Scheda = $(this);
            var Terapia = $(this).parent();

            deSelect.row();
            Scheda.addClass("selected");

            idenTestataSelezionata = Terapia.attr("iden_terapia");
            statoTestataSelezionata = Terapia.attr("stato");
            idenUtenteTestataSelezionata = Terapia.attr("iden_utente");
            idenCicloTestataSelezionata = Terapia.attr("iden_ciclo");
            idenSchedaSelezionata = Scheda.attr("iden_scheda");
            idenUtenteSchedaSelezionata = Scheda.attr("iden_utente");
            codificaTestataSelezionata = 'terapia';
            sottotipoSchedaSelezionata=Scheda.attr("sottotipo");
            classMenu.Init();
            if (e.which == 3) {
                if (idenCicloTestataSelezionata != '') {
                    sezioni2view.push('ciclo_terapia');
                } else {
                    sezioni2view.push('terapia');
                }
            }

        });

        $('div.Parametro').live('mousedown', function(e) {
            if (e.which == 3) {
                var Parametro = $(this);
                idenTestataSelezionata = Parametro.attr("iden_parametro");
                codificaTestataSelezionata = 'parametro';
                sezioni2view.push('parametro');
            }
        });

        $('div.Procedura table.Scheda').live(
            'mousedown',
            function(e) {
                var Scheda = $(this);
                var Procedura = $(this).parent();

                deSelect.row();
                Scheda.addClass("selected");
                codificaTestataSelezionata = Procedura.attr("codifica");
                idenTestataSelezionata = Procedura.attr("iden_procedura");
                idenUtenteTestataSelezionata = Procedura
                    .attr("iden_utente");
                statoTestataSelezionata = Procedura.attr("stato");
                idenSchedaSelezionata = Scheda.attr("iden_scheda");
                idenUtenteSchedaSelezionata = Scheda.attr("iden_utente");
                sottotipoSchedaSelezionata = Scheda.attr("sottotipo");
                classMenu.Init();
                if (e.which == 3) {
                    var ArSpecificMenu = jsonProcedura[Procedura
                        .attr("codifica")].specificMenu;
                    for ( var i = 0; i < ArSpecificMenu.length; i++) {
                        sezioni2view.push(ArSpecificMenu[i]);
                    }
                    sezioni2view.push('procedura');
                }
            });
        nsJson.detail.setMouseEvent('');

        nsJson.detail.addBorder('');

        $(document.body).click(function() {
            // deSelect.detail();
            deSelect.row();
            hideContextMenu();
        });

        $(document.body).mousedown(function(e) {
            if (e.which == 3) {
                sezioni2view.push('generale');
            }
        });

        document.body.oncontextmenu = function() {
            return contextMenu();
        };
        document.body.onselectstart = function() {
            return false;
        };

        $('.FiltroSezione span, .submenu .btn').click(function(e){
            e.stopPropagation();

            if($(this).hasClass('selected')){
                $(this).removeClass('selected');
            }else{
                $(this).addClass('selected');
            }

            WindowCartella.DatiInterfunzione.set("PIANO_GIORNALIERO_FILTRI",(new filtriInstance()).stringify());
            WindowCartella.apriPianoTerapeutico();

        });

        $('.FiltroSezione span div.btnMenu').click(function(e){
            e.stopPropagation();
            var _parent = $(this).parent();
            var _id = '';
            switch(_parent.attr("id")){
                case 'chkTerapie': _id = 'subMenuTerapie'
                    break;
            }

            $('#' + _id)
//				.click(function(){$(this).hide();})
                .css({
                    left:_parent.position().left,
                    top:_parent.position().top + _parent.height()
                })
                .toggle();

        });

        $('div.Terapia[stato!="C"] div[tipo="SOMMINISTRAZIONE"][stato="P"]')
            .live(
            'click',
            function() {
                if ($(this).hasClass('Yellow')) {
                    $(
                        'div.Terapia div[iden_dettaglio='
                            + $(this)
                            .attr('iden_dettaglio')
                            + '].Yellow').removeClass(
                            'Yellow').addClass('White');
                    $(
                        'div.Terapia div[iden_dettaglio='
                            + $(this)
                            .attr('iden_dettaglio')
                            + '].RYellow').removeClass(
                            'RYellow').addClass('RWhite');
                    $(
                        'div.Terapia div[iden_dettaglio='
                            + $(this)
                            .attr('iden_dettaglio')
                            + '].LYellow').removeClass(
                            'LYellow').addClass('LWhite');
                } else {
                    if ($(
                        'div.Terapia div[iden_dettaglio='
                            + $(this)
                            .attr('iden_dettaglio')
                            + '].White').attr(
                            'dose_variabile') == '') {
                        $(
                            'div.Terapia div[iden_dettaglio='
                                + $(this).attr(
                                'iden_dettaglio')
                                + '].White').removeClass(
                                'White').addClass('Yellow');
                        $(
                            'div.Terapia div[iden_dettaglio='
                                + $(this).attr(
                                'iden_dettaglio')
                                + '].RWhite').removeClass(
                                'RWhite').addClass('RYellow');
                        $(
                            'div.Terapia div[iden_dettaglio='
                                + $(this).attr(
                                'iden_dettaglio')
                                + '].LWhite').removeClass(
                                'LWhite').addClass('LYellow');
                    } else {
                        alert('Impossibile selezionare una somministrazione con dose variabile');
                    }
                }
            });
        
        
        

        $('#txtTurniSucc').blur(controlloParametroInseritoFiltri);
        $('#txtTurniPrec').blur(controlloParametroInseritoFiltri);


    } catch (e) {
        alert('Ready function : ' + e.description);
    }
});

function controlloParametroInseritoFiltri(numero){
   var valore = $(this).val()
    if(isNaN(valore)){
        $(this).val('0');
        return alert('Il valore inserito non è un numero');
    }

}
var deSelect = {

    detail : function() {
        try {
            var Dettaglio = $('div.Yellow');
            Dettaglio.removeClass("Yellow")
                .addClass(Dettaglio.data("json").css);
        } catch (e) {
        }
    },

    row : function() {
        $('table.selected').removeClass("selected");
    }
};

function attesa(bool) {
    try {
        WindowCartella.utilMostraBoxAttesa(bool);
    } catch (e) {
    }
}

function contextMenu() {

    if (WindowCartella.baseUser.LIVELLO == '0') {
        sezioni2view.push('test');
    }
    classMenu.Reset();
    for ( var i = 0; i < document.all['contextMenu'].firstChild.rows.length; i++) {
        for ( var j = 0; j < classMenu.sezioni.length; j++) {
            if (document.all['contextMenu'].firstChild.rows[i].gruppo == classMenu.sezioni[j]
                && (document.all['contextMenu'].firstChild.rows[i].abilita == ''
                || (document.all['contextMenu'].firstChild.rows[i].abilita == 'A'
                && classMenu.statoTestata != 'C' && classMenu.statoTestata != 'E') || (document.all['contextMenu'].firstChild.rows[i].abilita
                .indexOf(classMenu.statoDettaglio) != -1
                /*&& classMenu.statoTestata != 'C' && classMenu.statoTestata != 'E'*/))) {
                document.all['contextMenu'].firstChild.rows[i].style.display = 'block';
                break;
            } else {
                document.all['contextMenu'].firstChild.rows[i].style.display = 'none';
            }
        }
    }

    return MenuTxDx('contextMenu');
}

function afterLoad(inScrollTop) {
    document.getElementById('content').scrollTop = inScrollTop;
    setOffsetDocument();

    // fine range
    try {
        if (WindowCartella.ModalitaCartella.isReadonly(document)) {
            check.Modalita.readonly = true;
            WindowCartella.utilMostraBoxAttesa(false);
            return;
        }
    } catch (e) {
        alert(e.description);
        WindowCartella.utilMostraBoxAttesa(false);

    }

    var arContextParametri = document.getElementById("contextMenuParametri").childNodes;
    for ( var i = 0; i < arContextParametri.length; i++)
        ArrayContextDescriptor.push(arContextParametri[i].id);

    WindowCartella.utilMostraBoxAttesa(false);
    // init();
}

function segnalaReazioneAvversa() {
    if (check.Modalita.isReadonly())
        return;
    if (!confirm('Proseguendo verrà segnalata una reazione avversa per ogni farmaco collegato alla terapia, continuare?'))
        return;

    var sql = "insert into CC_ALLERTE_RICOVERO (TIPO,IDEN_VISITA,IDEN_FARMACO,IDEN_TERAPIA,UTE_INS) select 'AVVERSA',"
        + document.EXTERN.iden_visita.value
        + ",iden_farmaco,iden_terapia,"
        + WindowCartella.baseUser.IDEN_PER
        + " from CC_TERAPIE_FARMACI_COLLEGATI where iden_terapia="
        + classMenu.idenTestata;
    execSql(sql);
}

function resizeFancy(height) {
    alert('test');
    $('#fancybox-content').height(height);
}

function eseguiAttivita() {
    if (check.Modalita.isReadonly())
        return;
    var orario = getConfermaOrario(clsDate.getData(new Date(), 'YYYYMMDD'),
        clsDate.getOra(new Date()), arrayDate);
    // alert(orario);
    if (orario == null) {
        return;
    }
    var sql = null;
    if (classMenu.idenDettaglio == null) {
        sql = "insert into CC_ATTIVITA_RICOVERO (iden_attivita,iden_visita,iden_ute,esito_positivo,data,ora)";
        sql += " values (" + classMenu.idenTestata + ","
            + document.EXTERN.iden_visita.value + "," + WindowCartella.baseUser.IDEN_PER
            + ",'S','" + orario.data + "','" + orario.ora + "')";
        } else {
        sql = "update CC_ATTIVITA_RICOVERO set esito_positivo='S',ora='"
            + orario.ora + "',iden_ute=" + WindowCartella.baseUser.IDEN_PER
            + ",data_ultima_modifica=sysdate where iden="
            + classMenu.idenDettaglio;
    }
    // alert(sql);
    execSql(sql);
}
function apriConfigChart() {
    var finestra = window.open(
        "servletGenerator?KEY_LEGAME=PAGINA_GRAFICI&idenAnag="
            + vDati.iden_anag + "&idenVisita="
            + document.EXTERN.iden_visita.value + "&ricovero="
            + vDati.ricovero + "&reparto=" + vDati.reparto, "",
        "fullscreen=yes");
    try {
        WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
    } catch (e) {
    }
}
function apriGraficoParametro() {
    var finestra = window.open(
        "servletGenerator?KEY_LEGAME=GRAFICO_PIANOGG&idenParametro="
            + classMenu.idenTestata + "&idAnag=" + vDati.iden_anag
            + "&REPARTO=" + vDati.reparto, "", "fullscreen=yes");
    try {
        WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
    } catch (e) {
    }
}
function execStatement(pFile, pName, pBinds) {
    WindowCartella.utilMostraBoxAttesa(true);
    var StrBinds = '';
    if (pBinds.length > 0) {
        for ( var i = 0; i < pBinds.length; i++) {
            StrBinds += pBinds[i] + '#';
        }
        StrBinds = StrBinds.substring(0, StrBinds.length - 1);
    }

    document.EXTERN.offSet.value = document.formPrincipale.offSet.value;
    document.EXTERN.scrollTop.value = document.getElementById('content').scrollTop;
    document.EXTERN.sqlBinds.value = StrBinds;
    document.EXTERN.StatementFile.value = pFile;
    document.EXTERN.StatementName.value = pName;
    document.EXTERN.submit();
}
function execSql(sql, sqlBinds) {

    WindowCartella.utilMostraBoxAttesa(true);
    document.EXTERN.offSet.value = document.formPrincipale.offSet.value;
    document.EXTERN.scrollTop.value = document.getElementById('content').scrollTop;
    document.EXTERN.filtroCartella.value = WindowCartella.FiltroCartella.getLivelloValue(WindowCartella
        .getForm(document));
    document.EXTERN.sql.value = sql;
    document.EXTERN.sqlBinds.value = (typeof sqlBinds == 'undefined' ? ''
        : sqlBinds);
    document.EXTERN.submit();

}
function refreshPiano(resp) {
    if (resp != 'OK') {
    	//salvataggio parametri
    	if(resp=='METAL'){
    		alert('Attenzione, sono presenti più parametri gialli; chiamare il medico di reparto o, in sua assenza, il rianimatore.');
    	}
    	else{
    		alert(resp);
    	}
    }
    execSql('');
}

function hideMenuSecondari() {

    for ( var i = 1; i < ArrayContextDescriptor.length; i++) {
        try {
            document.all[ArrayContextDescriptor[i]].style.visibility = 'hidden';
        } catch (e) {/* menu non presente */
        }
    }

    if (typeof document.all["X"] == 'undefined')
        return;
    if (typeof document.all["X"].length == 'undefined') {
        document.all["X"].style.visibility = 'hidden';
    } else {
        for ( var i = 0; i < document.all["X"].length; i++) {
            document.all["X"][i].style.visibility = 'hidden';
        }
    }

    if (typeof document.all["Y"] == 'undefined')
        return;
    if (typeof document.all["Y"].length == 'undefined') {
        document.all["Y"].style.visibility = 'hidden';
    } else {
        for ( var i = 0; i < document.all["Y"].length; i++) {
            document.all["Y"][i].style.visibility = 'hidden';
        }
    }

    if (typeof document.all["resultX"] == 'undefined')
        return;
    if (typeof document.all["resultX"].length == 'undefined') {
        document.all["resultX"].style.visibility = 'hidden';
    } else {
        for ( var i = 0; i < document.all["resultX"].length; i++) {
            document.all["resultX"][i].style.visibility = 'hidden';
        }
    }

    if (typeof document.all["resultY"] == 'undefined')
        return;
    if (typeof document.all["resultY"].length == 'undefined') {
        document.all["resultY"].style.visibility = 'hidden';
    } else {
        for ( var i = 0; i < document.all["resultY"].length; i++) {
            document.all["resultY"][i].style.visibility = 'hidden';
        }
    }
}

var scrollTop;
function init(inScrollTop) {
    document.all.framePianoGiornaliero.style.height = parseInt(
        screen.availHeight - 5 - parent.document.all['frameWork'].offsetTop
            - document.all.framePianoGiornaliero.offsetTop, 10);

    scrollTop = inScrollTop;
    aggiornaPianoGiornaliero(inScrollTop);

}

function chiudiPlgTerapia() {
    // document.all.frameInserimento.style.display = 'none';
    // document.all.frameInserimento.src="blank.htm";
    // document.getElementById('framePianoGiornaliero').style.display = 'block';
    // document.all.framePianoGiornaliero.style.height=
    // parseInt(screen.availHeight -5-
    // parent.document.all['frameWork'].offsetTop -
    // document.all.framePianoGiornaliero.offsetTop,10);
    aggiornaPianoGiornaliero();
}

function aggiornaPianoGiornaliero(pScrollTop) {
	pScrollTop = pScrollTop ? pScrollTop : 0;
	
	try {
	    //WindowCartella.utilMostraBoxAttesa(true);
	    var url = "pianoGiornaliero?";
	    url += "iden_visita=" + window.document.EXTERN.iden_visita.value;
		url += "&CONTROLLO_ACCESSO=" + window.document.EXTERN.CONTROLLO_ACCESSO.value;
	    // url += "&iden_anag="+vDati.iden_anag;
	    // url += "&reparto="+vDati.reparto;
	    // url += "&ricovero="+vDati.ricovero;
	    // url += "&idRemoto="+vDati.idRemoto;
	    url += "&filtroCartella=" + WindowCartella.FiltroCartella.getLivelloValue(vDati);
	    url += "&scrollTop=" + pScrollTop;
	    window.document.location.replace(url);
	//	WindowCartella.$('#frameWork').attr("src",url);
	} catch(e) {
		window.history.go(0);
	}
}

function abilitaFiltroTerapie(bool) {

    document.filtri.chkTerapieNonConfermate.checked = bool;
    document.filtri.chkTerapieNonConfermate.disabled = !bool;

    document.filtri.chkTerapieConfermate.checked = bool;
    document.filtri.chkTerapieConfermate.disabled = !bool;

    document.filtri.chkTerapieChiuse.checked = bool;
    document.filtri.chkTerapieChiuse.disabled = !bool;
}

function abilitaFiltroParametri(bool) {

    document.filtri.chkParametroRegolare.checked = bool;
    document.filtri.chkParametroRegolare.disabled = !bool;

    document.filtri.chkParametroAllerta.checked = bool;
    document.filtri.chkParametroAllerta.disabled = !bool;

    document.filtri.chkParametroCritico.checked = bool;
    document.filtri.chkParametroCritico.disabled = !bool;
}

function abilitaFiltroAttivita(bool) {

    document.filtri.chkAttivitaNonIndicato.checked = bool;
    document.filtri.chkAttivitaNonIndicato.disabled = !bool;

    document.filtri.chkAttivitaAutosufficiente.checked = bool;
    document.filtri.chkAttivitaAutosufficiente.disabled = !bool;

    document.filtri.chkAttivitaCoadiuvato.checked = bool;
    document.filtri.chkAttivitaCoadiuvato.disabled = !bool;

    document.filtri.chkAttivitaNonAutosufficiente.checked = bool;
    document.filtri.chkAttivitaNonAutosufficiente.disabled = !bool;
}

function aggiornaFiltri(offSet) {
    var filtri;

//    filtri = '[TUTTO_RICOVERO:'+(document.filtri.chkRicovero.checked?'S':'N')+']';
    filtri = '[TUTTO_RICOVERO:N]';
    filtri += '[TURNO_PRECEDENTE:'+(document.filtri.txtTurniPrec.value != ''?''+document.filtri.txtTurniPrec.value+'':'0')+']';
    filtri += '[TURNO_SUCCESSIVO:'+(document.filtri.txtTurniSucc.value != ''?''+document.filtri.txtTurniSucc.value+'':'0')+']';    
    filtri += '[TERAPIE:'+(document.filtri.chkTerapie.checked?'S':'N')+']';
    if (document.filtri.chkTerapie.checked)
        filtri += '[TERAPIE_CHIUSE:'+(document.filtri.chkTerapieChiuse.checked?'S':'N')+']';
    else
        filtri += '[TERAPIE_CHIUSE:N]';
    filtri += '[PARAMETRI:'+(document.filtri.chkParametri.checked?'S':'N')+']';
    filtri += '[ATTIVITA:'+(document.filtri.chkAttivita.checked?'S':'N')+']';
    filtri += '[PT_PRESIDIO:'+(document.filtri.chkPresidi.checked?'S':'N')+']';
    filtri += '[PT_MEDICAZIONE:'+(document.filtri.chkMedicazioni.checked?'S':'N')+']';   
/*tipoFiltro = 26 -> filtro solo per le attivita(USU_PL)*/
    if (document.EXTERN.tipoFiltro.value==26){
        filtri += "[ABILITA_FILTRO_TERAPIE:N]";
        filtri += "[ABILITA_FILTRO_PARAMETRI:N]";
        filtri += "[ABILITA_FILTRO_PT_PRESIDIO:N]";
        filtri += "[ABILITA_FILTRO_PT_MEDICAZIONE:N]";
        filtri += "[ABILITA_FILTRO_ATTIVITA:S]";    
    }else{
        filtri += "[ABILITA_FILTRO_TERAPIE:S]";
        filtri += "[ABILITA_FILTRO_PARAMETRI:S]";
        filtri += "[ABILITA_FILTRO_PT_PRESIDIO:S]";
        filtri += "[ABILITA_FILTRO_PT_MEDICAZIONE:S]";
        filtri += "[ABILITA_FILTRO_ATTIVITA:N]";   
    }    
    setOffset(offSet, filtri);

}

function setOffset(value, pFiltri) {
    WindowCartella.utilMostraBoxAttesa(true);
    document.EXTERN.scrollTop.value = document.getElementById('content').scrollTop;
    if (value == null) {
        document.EXTERN.offSet.value = -1;
    } else {
        document.EXTERN.offSet.value = parseInt(
            document.formPrincipale.offSet.value, 10)
            + value;
    }
    if (typeof pFiltri != 'undefined') {
        document.EXTERN.filtri.value = pFiltri;
    }
    document.EXTERN.submit();
}

var attivita = {
   
    show : function(iden_bisogno){
        if (check.Modalita.isReadonly())
            return;

        var url = "servletGeneric?class=cartellaclinica.pianoGiornaliero.pianificaAttivita";
        url+= typeof iden_bisogno=='undefined'?"":"&iden_bisogno_selezionato=" + iden_bisogno;
        url+= "&cod_cdc=" + WindowCartella.getForm().reparto;
            
        $.fancybox({
            'padding' : 3,
            'width' : 800,
            'height' : 540,
            'href' : url,
            'type' : 'iframe'
        });
    },
    
    cancella : function(){
        if (check.Modalita.isReadonly())
            return;
        var pBinds = new Array();
        pBinds.push(classMenu.idenTestata);
        pBinds.push(WindowCartella.baseUser.IDEN_PER);
        if (!confirm('Si conferma la cancellazione dell\' attivita selezionata?'))
            return;
        var resp = WindowCartella.executeStatement("attivita.xml", "cancella", pBinds);
        if (resp[0]=="OK"){
            refreshPiano(resp[0]);
        } else{
        	return alert(resp[0] +" "+ resp[1]);
        }        
    }, 
    
    chiudi : function(){
        if (check.Modalita.isReadonly())
            return;
        if (classMenu.statoTestata=='C')
            return alert('Attivita già chiusa');
        var pBinds = new Array();
        pBinds.push(classMenu.idenTestata);
        pBinds.push(WindowCartella.baseUser.IDEN_PER);
        if (!confirm('Si conferma la chiusura dell\' attivita selezionata?'))
            return;
        var resp = WindowCartella.executeStatement("attivita.xml", "chiudi", pBinds);
        if (resp[0]=="OK"){
            refreshPiano(resp[0]);
        } else{
        	return alert(resp[0] +" "+ resp[1]);
        }
    },
    
    esegui : function(){
        if (check.Modalita.isReadonly())
            return;
        modal.reset();
        modal.options = {
            'data_default' : clsDate.getData(new Date(), 'YYYYMMDD'),
            'array_date' : arrayDate
        };
        modal.open();
        modal.save = function(resp) {
            var pBinds = new Array();
            pBinds.push(classMenu.idenTestata);
            pBinds.push('S');
            pBinds.push(resp.data);
            pBinds.push(resp.ora);
            pBinds.push(WindowCartella.baseUser.IDEN_PER);
            pBinds.push(resp.note);
            var resp = WindowCartella.executeStatement("attivita.xml", "inserisciEsecuzioneDettaglio",pBinds);
            if (resp[0]=="OK"){
                chiudiFinestra();
                refreshPiano(resp[0]);
            } else{
                return alert(resp[0] +" "+ resp[1]);chiudiFinestra();
            }
        };
        
        /*$.fancybox({
            'padding' : 3,
            'width' : 480,
            'height' : 340,
            'href' : modal.url,
            'type' : 'iframe'
        });*/
        
        /*if (check.Modalita.isReadonly())
            return;
        var orario = getConfermaOrario(clsDate.getData(new Date(), 'YYYYMMDD'),
        clsDate.getOra(new Date()), arrayDate);

        if (orario == null) {
            return;
        }
        var sql = null;

        var pBinds = new Array();
        pBinds.push(classMenu.idenTestata);
        pBinds.push('S');
        pBinds.push(orario.data);
        pBinds.push(orario.ora);
        pBinds.push(WindowCartella.baseUser.IDEN_PER);
        alert(pBinds)
        var resp = WindowCartella.executeStatement("attivita.xml","inserisciEsecuzioneDettaglio",pBinds);

        if(resp[0]=='OK') { 
            alert('esecuzione avvenuta correttamente');
            refreshPiano(resp[0]);
        } else {
            alert('errore '+resp[1]);
        }*/  
    },
    nonEseguireDettaglio : function(){
        if (check.Modalita.isReadonly())
            return;
        modal.reset();
        modal.options = {
            'data_default' : clsDate.getData(new Date(), 'YYYYMMDD'),
            'array_date' : arrayDate
        };
        modal.save = function(resp) {
            var pBinds = new Array();
            pBinds.push(classMenu.idenDettaglio);
            pBinds.push('N');
            pBinds.push(resp.data);
            pBinds.push(resp.ora);
            pBinds.push(WindowCartella.baseUser.IDEN_PER);
            pBinds.push(resp.note);
            var resp = WindowCartella.executeStatement("attivita.xml", "segnalaNonEseguitoDettaglio",pBinds);
            if (resp[0]=="OK"){
                parent.refreshPiano(resp[0]);
            } else{
                return alert(resp[0] +" "+ resp[1]);
            }
        };
        $.fancybox({
            'padding' : 3,
            'width' : 480,
            'height' : 340,
            'href' : modal.url,
            'type' : 'iframe'
        }); 
    },
    cancellaDettaglio : function(){
        if (check.Modalita.isReadonly())
            return;
        modal.reset();
        modal.options = {
            'data_default' : clsDate.getData(new Date(), 'YYYYMMDD'),
            'array_date' : arrayDate
        };
        modal.save = function(resp) {
            var pBinds = new Array();
            pBinds.push(classMenu.idenDettaglio);
            pBinds.push('X');
            pBinds.push(resp.data);
            pBinds.push(resp.ora);
            pBinds.push(WindowCartella.baseUser.IDEN_PER);
            pBinds.push(resp.note);
            var resp = WindowCartella.executeStatement("attivita.xml", "cancellaDettaglio",pBinds);
            if (resp[0]=="OK"){
                chiudiFinestra();
                try{
                    parent.refreshPiano(resp[0]);}catch(e){alert(e.message)}
            } else{
                return alert(resp[0] +" "+ resp[1]);
            }
        };
        modal.open();
        $.fancybox({
            'padding' : 3,
            'width' : 480,
            'height' : 340,
            'href' : modal.url,
            'type' : 'iframe'
        }); 
    }
};

var parametri = {
    inserisci : function() {
        var url = 'servletGenerator?KEY_LEGAME=SCHEDA_PARAMETRO&REPARTO='
            + vDati.reparto;
        $.fancybox({
            'padding' : 3,
            'width' : 600,
            'height' : 340,
            'href' : url,
            'type' : 'iframe'
        });
    },
    pianifica : function() {
        if (check.Modalita.isReadonly())
            return;
        if (!check.utente(config.parametri.pianificazione.utenti))
            return;
        //	var parametriReparto = $('div.Parametro:first').attr("iden_parametro");
        var url = "servletGeneric?class=cartellaclinica.pianoGiornaliero.pianificaRilevazioni"
            + "&iden_parametro=" + classMenu.idenTestata
            + "&cod_cdc=" + WindowCartella.getForm().reparto
//				+ "&parametriReparto=" + parametriReparto;
        $.fancybox({
            'padding' : 3,
            'width' : 600,
            'height' : 340,
            'href' : url,
            'type' : 'iframe'
        });

    },

    cancellaMulti : function(valore) {
        var msg = '';
        try {
            msg = 'check.Modalita.isReadonly';
            if (check.Modalita.isReadonly())
                return;
            msg = 'check.utente';
            if (!check.utente(config.parametri.cancellazione['P'].utenti))
                return;

            /*
             * var array_dettagli = $('div.Parametro div.Yellow');
             * if(array_dettagli.length==0) {return alert('Selezionare almeno un
             * dettaglio');}; for (var i = 0; i<array_dettagli.length; i++) {
             * var resp =
             * top.executeStatement("parametri.xml","cancella",[array_dettagli[i].iden_dettaglio,baseUser.IDEN_PER]);
             * if (resp[0]!='OK') { alert(resp); } } refreshPiano("OK");
             */
            var resp = getMotivoData(-1, 2,'N');
            if (resp == null) {
                return;
            }

            var sqlBinds = new Array();
            sqlBinds.push(WindowCartella.getRicovero("IDEN"));
            sqlBinds.push(classMenu.idenTestata);
            sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
            sqlBinds.push(resp.data + resp.ora);
            sqlBinds.push(resp.data2 + resp.ora2);
            var resp = WindowCartella.executeStatement("parametri.xml",
                "annullaPianificati", sqlBinds);
            refreshPiano(resp[0]);
        } catch (e) {
            alert('parametri.cancellazione - ' + msg + ' : ' + e.description);
        }
    },
    dettaglio : {
        rileva : function(rilevaDa) { // rileva : function(e) {
        	if (event!=null){
        		event.cancelBubble = true;
        	}
        	
        	if (check.Modalita.isReadonly())
                return;
        	if (event!=null){
        		if($(event.srcElement).closest('.Parametro').attr("rilevabile") == 'N'){
                    return alert('Parametro non rilevabile');
                }
        	}
            

            var concatDate = '';
            for ( var i = 0; i < arrayDate.length; i++) {
                concatDate += arrayDate[i] + '|';
            }
            concatDate = concatDate.substring(0, concatDate.length - 1);
            var url = "servletGeneric?";
            url += "class=cartellaclinica.pianoGiornaliero.rilevaParametri";
            url += "&idenPer=" + WindowCartella.baseUser.IDEN_PER;
            url += "&reparto=" + vDati.reparto;
            url += "&idenVisita=" + document.EXTERN.iden_visita.value;
            url += "&idenTestata=" + (classMenu.idenTestata == null ? '' : classMenu.idenTestata);

            if (classMenu.idenDettaglio != null) {
                url += "&idenDettaglio=" + classMenu.idenDettaglio; // in questo
                // caso ci
                // sono il/i
                // dettagli
                // concatenati
            }
            url += "&concatDate=" + concatDate;
            url += "&rilevaDa="+rilevaDa;

            classMenu.ResetParameter();
            // var height = (classMenu.idenTestata > 0 ? 200 : 540) +
            // arrayDate.length/3*20;
            $.fancybox({
                'padding' : 3,
                'width' : 800,
                // 'height' : height,
                'href' : url,
                'type' : 'iframe',
                'onComplete' : function() {
                    $('#fancybox-frame').load(
                        function() {
                            $('#fancybox-content').height(
                                $(this).contents().find('body')
                                    .height());
                            $.fancybox.center();
                        });
                }
            });
        },
        setNota : function() {
            if (check.Modalita.isReadonly())
                return;
            var nota;
            var nota_pre = $("div[iden_dettaglio=" + classMenu.idenDettaglio
                + "][tipo=NOTA]");
            if (nota_pre.length > 0) {
                nota = getNotaTerapia(nota_pre.attr("text"), nota_pre
                    .attr('stato'));
            } else {
                nota = getNotaTerapia("", "");
            }

            if (!nota) {
                return;
            }
//			var stato = nota.stato == 'E' ? 1 : 3;

            var sqlBinds = new Array();
            sqlBinds.push(classMenu.idenDettaglio);
            sqlBinds.push(nota.text);
//			sqlBinds.push(stato);

            var resp = WindowCartella.executeStatement("parametri.xml",
                "updNotaRilevazione", sqlBinds);
            refreshPiano(resp[0]);

        },
        cancella : function() {
            if (check.Modalita.isReadonly())
                return;
            var msg = '';
            try {
                msg = 'check.Modalita.isReadonly';
                if (check.Modalita.isReadonly())
                    return;

                msg = 'check.dettaglio';
                if (!check.dettaglio())
                    return;

                msg = 'check.utente';
                if (!check
                    .utente(config.parametri.cancellazione[classMenu.statoDettaglio].utenti))
                    return;

                msg = 'check.data';
                if (!check
                    .data(config.parametri.cancellazione[classMenu.statoDettaglio].range))
                    return;

                msg = 'check.utenteMedesimo';
                if (!check
                    .utenteMedesimo(
                        config.parametri.cancellazione[classMenu.statoDettaglio].controlloUtente,
                        'dettaglio'))
                    return;

                if (!confirm('Si conferma la cancellazione logica della rilevazione/nota?'))
                    return;

                var resp = WindowCartella.executeStatement("parametri.xml", "cancella", [
                    classMenu.idenDettaglio, WindowCartella.baseUser.IDEN_PER ]);
                refreshPiano(resp[0]);
            } catch (e) {
                alert('parametri.cancellazione - ' + msg + ' : '
                    + e.description);
            }
        }
    },
    setNota : function() {
        if (check.Modalita.isReadonly())
            return;
        modal.reset();
        modal.options = {
            'data_default' : clsDate.getData(new Date(), 'YYYYMMDD'),
            'array_date' : arrayDate
            // ,
            // 'nota':terapie.util.getNota().testo,
            // 'livello':terapie.util.getNota().livello,
            // 'dose_var':terapie.util.getDettaglio().attr('dose_variabile'),
            // 'arUdm':arUdm
        };
        modal.save = function(resp) {
            var sqlBinds = new Array();
            sqlBinds.push(document.EXTERN.iden_visita.value);
            sqlBinds.push(classMenu.idenTestata);
            sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
            sqlBinds.push(resp.data);
            sqlBinds.push(resp.ora);
            sqlBinds.push(resp.note);
            if (resp.note == '')
                return alert("Nessuna nota salvata");
            var resp = WindowCartella.executeStatement("parametri.xml", "setNota",
                sqlBinds);
            refreshPiano(resp[0]);
        };
        $.fancybox({
            'padding' : 3,
            'width' : 480,
            'height' : 340,
            'href' : modal.url,
            'type' : 'iframe'
        });
    },
    showQuickRilevazione : function(objRigaMenu) {
        if (check.Modalita.isReadonly())
            return;
        if (document.all["menuQuickParametro" + classMenu.idenTestata].childNodes.length == 0)
            clsGrid.build(document.all["menuQuickParametro"
                + classMenu.idenTestata]);
        ShowMenu2(objRigaMenu, "menuQuickParametro" + classMenu.idenTestata);

    },
    rilevazione : function(val1, val2) {
        if (check.Modalita.isReadonly())
            return;
        if (!check.utente(config.parametri.rilevazione.utenti))
            return;

        var orario = getConfermaOrario(clsDate.getData(new Date(), 'YYYYMMDD'),
            classMenu.Ora, arrayDate);
        if (orario == null)
            return;

        if (typeof val2 == 'undefined' || val2 == null || val2 == '')
            val2 = 'null';

        var sql = "insert into cc_parametri_ricovero (iden_ute,iden_parametro,iden_visita,valore_1,valore_2,data,ora) values ";
        sql += "(" + WindowCartella.baseUser.IDEN_PER + "," + classMenu.idenTestata + ","
            + document.EXTERN.iden_visita.value + "," + val1 + "," + val2
            + ",'" + orario.data + "','" + orario.ora + "')";
        // alert(sql);

        execSql(sql);
    }
};

var modal = {
    height : null,
    width : null,
    url : null,
    options : null,
    save : null,
    reset : function() {
        modal.height = 340, modal.width = 480,
            modal.url = "modalUtility/piano_terapeutico_modal.html";
        modal.options = null;
        modal.save = null;
    },
    open : function() {
        $.fancybox({
            'padding' : 3,
            'width' : modal.width,
            'height' : modal.height,
            'href' : modal.url,
            'type' : 'iframe'
        });
    }
};

var CicloTerapia = {
    modifica : {

        Terapia : function() {
            CicloTerapia.modifica.Work('MODIFICA_TERAPIA', classMenu.idenCiclo,
                classMenu.idenTestata);
        },

        Ciclo : function() {
            CicloTerapia.modifica.Work('MODIFICA_CICLO', classMenu.idenCiclo,
                null);
        },

        Work : function(pProcedura, pIdenCiclo, pIdenTerapia) {

            WindowCartella.utilMostraBoxAttesa(true);

            var url = 'servletGeneric?class=cartellaclinica.gestioneTerapia.CicloTerapia';
            url += '&Procedura=' + pProcedura;
            url += '&idenVisita=' + vDati.iden_visita;
            url += '&reparto=' + vDati.reparto;
            //url += '&idenAnag=' + vDati.iden_anag;

            url += (pIdenCiclo != null ? '&IDEN_CICLO=' + pIdenCiclo : '');
            url += (pIdenTerapia != null ? '&IDEN_TERAPIA=' + pIdenTerapia : '');

            $.fancybox({
                'padding' : 3,
                'width' : document.body.offsetWidth / 10 * 9,
                'height' : document.body.offsetHeight / 10 * 9,
                'href' : url,
                'onCleanup':function(){
                    WindowCartella.dwrUtility.removeSessionObject("schede_terapia_correnti");
                    aggiornaPianoGiornaliero();
                },
                'type' : 'iframe'
            });
        }

    },

    cancella :function(){
        var pUrl = " servletGenerator?KEY_LEGAME=MOTIVO_CANCELLAZIONE&KEY_ID=&lblTitolo=Modulo cancellazione ciclo terapeutico";

        $.fancybox({
            height: 135,
            width: 750,
            'href' : pUrl,
            'type' : 'iframe'
        });
    },
    chiudiCiclo:function(){

        var pUrl = " servletGenerator?KEY_LEGAME=MOTIVO_CANCELLAZIONE&KEY_ID=&lblTitolo=Modulo chiusura ciclo terapeutico";

        $.fancybox({
            height: 135,
            width: 750,
            'href' : pUrl,
            'type' : 'iframe'
        });

    }

};

var terapie = {
    somministrazione : {
        esegui : function() {
            try {
                if (check.Modalita.isReadonly())
                    return;
                if (!check.utente(config.terapie.somministrazione.esecuzione.utenti))
                    return;
                modal.reset();
                modal.options = {
                    'data_default' : clsDate.getData(new Date(), 'YYYYMMDD'),
                    'array_date' : arrayDate,
                    'nota' : terapie.util.getNota().testo,
                    // 'livello':terapie.util.getNota().livello,
                    'dose_var' : terapie.util.getDettaglio().attr('dose_variabile'),
                    'arUdm' : arUdm,
                    'info' : terapie.util.getScheda().attr('info'),
                    'data_prevista' : terapie.util.getDettaglio().attr("data") + ' ' + terapie.util.getDettaglio().attr("ora")
                };
                modal.save = function(resp) {
                    // var stato = resp.stato == 'E' ? 1 : 3;
                    // if (resp.note==''){stato = 0;};
                    var sqlBinds = new Array();
                    sqlBinds.push('S');
                    sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
                    sqlBinds.push(resp.data + resp.ora);
                    sqlBinds.push(resp.note);
                    sqlBinds.push(classMenu.idenDettaglio);
                    sqlBinds.push(resp.dosi);
                    Reload.terapia(classMenu.idenTestata, "terapie.xml",
                        "somministrazione.esegui", sqlBinds,0,
                        function(){
                           //alert(classMenu.idenDettaglio + '\n'+resp.data + resp.ora );
                            terapie.somministrazione.scarica_magazzino({
                                iden_somministrazioni : classMenu.idenDettaglio,
                                data_ora: resp.data + resp.ora
                            });
                        });
                };
                $.fancybox({
                    'padding' : 3,
                    'width' : 480,
                    'height' : 340,
                    'href' : modal.url,
                    'type' : 'iframe'
                });
            } catch (e) {
                alert(e.description);
            }
        },
        nonEseguito : function() {
            if (check.Modalita.isReadonly())
                return;
            if (!check.utente(config.terapie.somministrazione.esecuzione.utenti))
                return;
            var resp = getMotivoModale(0);
            if (resp == null) {
                return;
            }
            var sqlBinds = new Array();
            sqlBinds.push('N');
            sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
            sqlBinds.push(resp);
            sqlBinds.push(classMenu.idenDettaglio);
            Reload.terapia(classMenu.idenTestata, "terapie.xml",
                "somministrazione.nonEseguito", sqlBinds);
        },
        eseguiMulti : function() {
            if (check.Modalita.isReadonly())
                return;
            if (!check.utente(config.terapie.somministrazione.esecuzione.utenti))
                return;
            var array_dettagli = $('div[tipo="SOMMINISTRAZIONE"].Yellow');
            if (array_dettagli.length == 0) {
                return alert('Selezionare almeno un dettaglio');
            }

            modal.reset();
            modal.options = {
                'data_default' : clsDate.getData(new Date(), 'YYYYMMDD'),
                'array_date' : arrayDate,
                'data' : array_dettagli[0].data,
                'ora' : array_dettagli[0].ora
            };

            modal.save = function(resp) {

                for ( var i = 0; i < array_dettagli.length; i++) {
                    if (array_dettagli[i].dose_variabile != '') {
                        return alert('Impossibile procedere con la somministrazione multipla su somministrazioni a dose variabile');
                    }
                    switch (array_dettagli[i].menu) {
                        case 'dettaglio':
                            var sqlBinds = new Array();
                            sqlBinds.push('S');
                            sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
                            sqlBinds.push(resp.data + resp.ora);
                            sqlBinds.push(resp.note);
                            sqlBinds.push(array_dettagli[i].iden_dettaglio);
                            sqlBinds.push(resp.dosi);
                            Reload.terapia(array_dettagli[i].iden_terapia, "terapie.xml",
                                "somministrazione.esegui", sqlBinds);
                            break;
                        case 'infusione':
                            var sqlBinds = new Array();
                            sqlBinds.push(array_dettagli[i].iden_dettaglio);
                            sqlBinds.push(array_dettagli[i].iden_scheda);
                            sqlBinds.push(resp.data);
                            sqlBinds.push(resp.ora);
                            sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
                            sqlBinds.push(resp.note);
                            sqlBinds.push(resp.dosi);
                            Reload.terapia(array_dettagli[i].iden_terapia, "terapie.xml",
                                "infusione.inizio", sqlBinds);
                            break;
                        default:
                    }
                }
            };
            $.fancybox({
                'padding' : 3,
                'width' : 480,
                'height' : 340,
                'href' : modal.url,
                'type' : 'iframe'
            });

        },
        nonEseguitoMulti : function () {
            if (check.Modalita.isReadonly())
                return;
            if (!check.utente(config.terapie.somministrazione.esecuzione.utenti))
                return;
            var array_dettagli = $('div[tipo="SOMMINISTRAZIONE"].Yellow');
            if (array_dettagli.length == 0) {
                return alert('Selezionare almeno un dettaglio');
            }
            var resp = getMotivoModale(0);
            if (resp == null) {
                return;
            }
            for ( var i = 0; i < array_dettagli.length; i++) {
                var sqlBinds = new Array();
                sqlBinds.push('N');
                sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
                sqlBinds.push(resp);
                sqlBinds.push(array_dettagli[i].iden_dettaglio);
                Reload.terapia(array_dettagli[i].iden_terapia, "terapie.xml",
                    "somministrazione.nonEseguito", sqlBinds);
            }
        },
        annullaEsecuzione : function() {
            if (check.Modalita.isReadonly())
                return;
            try {
                var abilitazioni = config.terapie.somministrazione.annullamentoEsecuzione;
                if (!check.utente(abilitazioni.utenti))
                    return;
                if (!check.utenteMedesimo(abilitazioni.controlloUtente,
                    'dettaglio'))
                    return;
                if (!check.data(abilitazioni.range))
                    return;

                var sqlBinds = new Array();
                sqlBinds.push(classMenu.idenDettaglio);
                sqlBinds.push(classMenu.idenScheda);
                sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
                Reload.terapia(classMenu.idenTestata, "terapie.xml",
                    "somministrazione.annullaEsecuzione", sqlBinds);

            } catch (e) {
                alert(e.description);
            }
        },
        modifica : function() { // /DA IMPLEMENTARE
            if (check.Modalita.isReadonly())
                return;
            if (!check.utente(config.terapie.somministrazione.esecuzione.utenti))
                return;

            var nota = terapie.util.getNota();
            var dosiScheda = terapie.util.getScheda().attr('farmaci');
            var resp = getConfermaOrarioNote(clsDate.getData(new Date(),
                'YYYYMMDD'), null, arrayDate, nota.testo, nota.livello,
                dosiScheda, arUdm);
            if (resp == undefined) {
                return;
            }
            var stato = resp.stato == 'E' ? 1 : 3;
            if (resp.note == '') {
                stato = 0;
            }
        },                 
        sospendi : function(valore) {
            if (check.Modalita.isReadonly())
                return;
            if (!check.utente(config.terapie.sospensione.utenti))
                return;
            var sqlBinds = new Array();
            sqlBinds.push(classMenu.idenDettaglio);
            sqlBinds.push(WindowCartella.baseUser.IDEN_PER);

            if (valore == 'S') {
                var resp = getMotivoModale(0);
                if (resp == null) {
                    return;
                }

                sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
                sqlBinds.push("S");
                sqlBinds.push(resp);
            } else {
                sqlBinds.push("");
                sqlBinds.push("N");
                sqlBinds.push("");
            }
            Reload.terapia(classMenu.idenTestata, "terapie.xml",
                "somministrazione.sospendi", sqlBinds);
        },
        setNota : function() {
            try {
                if (check.Modalita.isReadonly())
                    return;
                if (!check.utente(config.terapie.somministrazione.esecuzione.utenti))
                    return;

                var nota_pre = terapie.util.getNota();
                var nota = getNotaTerapia(nota_pre.testo, nota_pre.livello);

                if (!nota) {
                    return;
                }
//				var stato = nota.stato == 'E' ? 1 : 3;

                var sqlBinds = new Array();
                sqlBinds.push(classMenu.idenDettaglio);
                sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
                sqlBinds.push(nota.text);
//				sqlBinds.push(stato);
                Reload.terapia(classMenu.idenTestata, "terapie.xml",
                    "somministrazione.setNota", sqlBinds);

            } catch (e) {
                alert(e.description);
            }
        },
        setDosaggioDettaglio : function() {
            try {
                if (check.Modalita.isReadonly())
                    return;
                if (!check.utente(config.terapie.somministrazione.esecuzione.utenti))
                    return;

                if(terapie.getInfoScheda(classMenu.idenScheda).TIPO_PRESCRIZIONE!='TAO'){
                	return alert('Operazione non consentita per la terapia selezionata');
                }
                var resp = getDosaggioDettaglio('');
                if (!resp || resp.text == '') {
                    return;
                }

                var sqlBinds = new Array();
                sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
                sqlBinds.push(classMenu.idenDettaglio);
                /* sqlBinds.push(...); IDEN_FARMACO */
                sqlBinds.push(resp.text);
                Reload.terapia(classMenu.idenTestata, "terapie.xml",
                    "somministrazione.setDosaggioDettaglio", sqlBinds);

            } catch (e) {
                alert(e.description);
            }
        },
        scarica_magazzino:function(params){
            /*
             iden_somministrazioni : <valore> || [<valori>],
             data_ora
             */
            params.iden_somministrazioni = (typeof params.iden_somministrazioni == 'array' ? params.iden_somministrazioni : [params.iden_somministrazioni]);
            var codice_magazzino = WindowCartella.baseReparti.getValue(vDati.reparto, 'FT_CODICE_MAGAZZINO');
            if (codice_magazzino == null || codice_magazzino == '') return;
            //return alert('CODICE MAGAZZINO: '+  codice_magazzino +'\nIDEN DETTAGLIO: '+  params.iden_somministrazioni.join() +'\nDATA & ORA: '+ params.data_ora + '\nDOSI: '+ params.dosi +'\nIDEN USER: '+ WindowCartella.baseUser.IDEN_PER);
            var resp ;

            //return  alert(params.iden_somministrazioni.join());

            if(codice_magazzino != null && codice_magazzino != ''){
                //alert(codice_magazzino +  params.iden_somministrazioni.join("|") + params.data_ora + WindowCartella.baseUser.IDEN_PER);
                resp = WindowCartella.executeStatement("Magazzino.xml","SCARICO_FARM_SOMMINISTRAZIONE",[codice_magazzino, params.iden_somministrazioni.join("|") ,params.data_ora, WindowCartella.baseUser.IDEN_PER],3);
            }
            if(resp[0]=='OK'){

                //indexOf returns the position of the string in the other string. If not found, it will return -1:
                if(resp[2].indexOf("|") != -1){

                    var vresps = resp[2].split('|');
                    var vMessages =  resp[3].split('|');
                    var params = resp[4].split('|');

                    $.each(vresps, function(i){
                        if (vresps[i] == 'KO'){
                            if(confirm(vMessages[i])){
                                var para =  params[i];
                                return alert(para.split(','));
                                var vresp = WindowCartella.executeStatement("Magazzino.xml","SCARICOFARM",para.split(','));
                                if (vresp[0]=='KO'){
                                    alert(vresp[1]);
                                }
                            }
                        }
                    });
                }else{

                    var vresps = resp[2];
                    var vMessages =  resp[3];
                    var params = resp[4].split(',');

                    if(vresps =='KO'){
                        if(confirm(vMessages)){
                            var vresp = WindowCartella.executeStatement("Magazzino.xml","SCARICOFARM",params);
                            if (vresp[0]=='KO'){
                                alert(vresp[1]);
                            }
                        }
                    }
                }
            }else {
                alert('KO\n' + resp[1]);
            }
        }

    },
    modificaVelocita:function(){
        if (check.Modalita.isReadonly())
            return;
		if(terapie.getInfoScheda(classMenu.idenScheda).SOTTOTIPO != 'RANGE'){
			return alert('Operazione non consentita per la terapia selezionata');
		}

		if (!check.utente(config.terapie.modifica.testata.utenti)){
                return;
		}
		
        $.fancybox({
            'padding' : 3,
            'width' : 500,
            'height' : 80,
            'href' : "modalUtility/ModificaVelNutrizionale.html",
//                'onCleanup' : param.onClose,
            'type' : 'iframe'});
    },
    infusione : {
        inizio : function() {
            if (check.Modalita.isReadonly())
                return;
            if (!check.utente(config.terapie.somministrazione.esecuzione.utenti))
                return;

            modal.reset();
            modal.options = {
                'data_default' : clsDate.getData(new Date(), 'YYYYMMDD'),
                'array_date' : arrayDate,
                'nota' : terapie.util.getNota().testo,
                // 'livello':terapie.util.getNota().livello,
                'dose_var' : terapie.util.getDettaglio().attr('dose_variabile'),
                'data_prevista' : terapie.util.getDettaglio().attr("data") + ' ' + terapie.util.getDettaglio().attr("ora")
            };
            modal.save = function(resp) {
                var sqlBinds = new Array();
                sqlBinds.push(classMenu.idenDettaglio);
                sqlBinds.push(classMenu.idenScheda);
                sqlBinds.push(resp.data);
                sqlBinds.push(resp.ora);
                sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
                sqlBinds.push(resp.note);
                sqlBinds.push(resp.dosi);
                Reload.terapia(classMenu.idenTestata, "terapie.xml",
                    "infusione.inizio", sqlBinds);
            };
            $.fancybox({
                'padding' : 3,
                'width' : 600,
                'height' : 340,
                'href' : modal.url,
                'type' : 'iframe'
            });
        },
        fine : function() {
            if (check.Modalita.isReadonly())
                return;
            if (!check.utente(config.terapie.somministrazione.esecuzione.utenti))
                return;

            modal.reset();
            modal.options = {
                'data_default' : clsDate.getData(new Date(), 'YYYYMMDD'),
                'array_date' : arrayDate,
                // 'livello':terapie.util.getNota().livello,
                'nota' : terapie.util.getNota().testo,
                'data_prevista' : terapie.util.getDettaglio().attr("data_fine") + ' ' + terapie.util.getDettaglio().attr("ora_fine"),
                'validationFunction' : function(date){

                    if(date<=clsDate.str2date(terapie.util.getDettaglio().attr("data"),'YYYYMMDD', terapie.util.getDettaglio().attr("ora"))){
                        alert("Attenzione, chiudere l'infusione in data successiva a quella d'inizio");
                        return false;
                    }else{
                        return true;
                    }
                }
            };
            modal.save = function(resp) {
                var sqlBinds = new Array();
                sqlBinds.push(classMenu.idenDettaglio);
                sqlBinds.push(resp.data);
                sqlBinds.push(resp.ora);
                sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
                sqlBinds.push(resp.note);
                sqlBinds.push(resp.residuo);
                Reload.terapia(classMenu.idenTestata, "terapie.xml",
                    "infusione.fine", sqlBinds);
            };
            $.fancybox({
                'padding' : 3,
                'width' : 600,
                'height' : 340,
                'href' : modal.url,
                'type' : 'iframe'
            });
        },
        cambioSacca : function() {
            if (check.Modalita.isReadonly())
                return;
            if (!check.utente(config.terapie.somministrazione.esecuzione.utenti))
                return;

            modal.reset();
            modal.options = {
                'data_default' : clsDate.getData(new Date(), 'YYYYMMDD'),
                'array_date' : arrayDate,
                // 'livello':terapie.util.getNota().livello,
                //'nota' : terapie.util.getNota().testo,
                'data_prevista' : terapie.util.getDettaglio().attr("data_fine") + ' ' + terapie.util.getDettaglio().attr("ora_fine")
            };
            modal.save = function(resp) {
                var sqlBinds = new Array();
                sqlBinds.push(classMenu.idenDettaglio);
                sqlBinds.push(classMenu.idenScheda);
                sqlBinds.push(classMenu.idenTestata);
                sqlBinds.push(resp.data);
                sqlBinds.push(resp.ora);
                sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
                sqlBinds.push(resp.note);
                Reload.terapia(classMenu.idenTestata, "terapie.xml",
                    "infusione.cambioSacca", sqlBinds,1);
            };
            $.fancybox({
                'padding' : 3,
                'width' : 600,
                'height' : 340,
                'href' : modal.url,
                'type' : 'iframe'
            });
        },
        annullaEsecuzione : function() {
            if (!check.utenteMedesimo(
                config.terapie.somministrazione.annullamentoEsecuzione,
                'dettaglio'))
                return null;
            var sqlBinds = new Array();
            sqlBinds.push(classMenu.idenDettaglio);
            sqlBinds.push(classMenu.idenScheda);
            sqlBinds.push(classMenu.idenTestata);
            sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
            Reload.terapia(classMenu.idenTestata, "terapie.xml",
                "infusione.annullaEsecuzione", sqlBinds,1);
        },
        cambioVelocita : function(sosp) {
        	
            if (check.Modalita.isReadonly()){
                return;
			}
            if (!check.utente(config.terapie.somministrazione.cambioVelocita.utenti)){
                return;
			}

            var resp =getCambioVelocita(classMenu.dataDettaglio,classMenu.oraDettaglio,sosp);
            if (resp == null) {
                return;
            }

            var sqlBinds = new Array();
            sqlBinds.push(classMenu.idenDettaglio);
            sqlBinds.push(resp.dataIni);
            sqlBinds.push(resp.oraIni);
            sqlBinds.push(typeof(resp.dataFine)=='undefined'?'':resp.dataFine);
            sqlBinds.push(typeof(resp.dataFine)=='undefined'?'':resp.oraFine);
            sqlBinds.push(resp.velocita);
            sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
            sqlBinds.push(resp.residuo);
            
            Reload.terapia(classMenu.idenTestata, "terapie.xml", "infusione.cambioVelocita",
                sqlBinds);
        }
    },
    ossigenoterapia : {
        esegui : function() {
            try {
                if (check.Modalita.isReadonly())
                    return;
                if (!check.utente(config.terapie.somministrazione.esecuzione.utenti))
                    return;

                modal.reset();
                modal.options = {
                    'data_default' : clsDate.getData(new Date(), 'YYYYMMDD'),
                    'array_date' : arrayDate,
                    // 'livello':terapie.util.getNota().livello,
                    'nota' : terapie.util.getNota().testo,
                    'data_prevista' : terapie.util.getDettaglio().attr("data") + ' ' + terapie.util.getDettaglio().attr("ora")
                };
                modal.save = function(resp) {
                    var sqlBinds = new Array();
                    sqlBinds.push(resp.data + resp.ora);
                    sqlBinds.push(resp.note);
                    sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
                    sqlBinds.push(classMenu.idenDettaglio);
                    sqlBinds.push(classMenu.idenTestata);
                    sqlBinds.push(classMenu.idenScheda);

                    Reload.terapia(classMenu.idenTestata, "terapie.xml",
                        "ossigenoterapia.esegui", sqlBinds);
                };
                $.fancybox({
                    'padding' : 3,
                    'width' : 600,
                    'height' : 340,
                    'href' : modal.url,
                    'type' : 'iframe'
                });
            } catch (e) {
                alert(e.description);
            }
        }
    },
    nutrizionale:{

    },
    util : {
        param : function(operazione, pTipoTerapia) {
            this.operazione = operazione;
            this.tipo = 'Open';
            this.modality = 'I';
            this.btn = "Conferma::registra('conferma');@Salva Prescr Std::modelli.registra();::left@Salva Ciclo::cicli.registra();::left";// @Chiudi::chiudi();";
            this.tipo_terapia = null;
            this.iden_terapia = null;
            this.iden_scheda = null;
            this.statoTerapia = 'I';
            this.onClose = function() {
            };
            switch (operazione) {
                case "INSERIMENTO":
                    this.tipo_terapia = typeof pTipoTerapia != 'undefined' ? pTipoTerapia
                        : null;
                    this.onClose = function() {
                        WindowCartella.dwrUtility.removeSessionObject("schede_terapia_correnti");
                        aggiornaPianoGiornaliero();
                    };
                    break;
                case "LETTURA":
                    this.modality = 'V';
                    this.iden_scheda = classMenu.idenScheda;
                    this.btn = "";// "Chiudi::chiudi();";
                    this.tipo = 'Modal';
                    this.statoTerapia = null;
                    break;
                case "MODIFICA":
                    this.modality = 'V';
                    this.iden_terapia = classMenu.idenTestata;
                    this.iden_scheda = $(
                        'div.Terapia[iden_terapia="' + classMenu.idenTestata
                            + '"]>table:last').attr('iden_scheda');
                    this.btn = "Conferma::registra('conferma');";// @Chiudi::chiudi();",
                    this.tipo = 'Modal';
                    this.statoTerapia = 'P';
                    break;
                case "DUPLICA":
                    this.iden_terapia = classMenu.idenTestata;
                    this.iden_scheda = classMenu.idenScheda;
                    this.onClose = function() {
                        aggiornaPianoGiornaliero();
                    };
                    break;
                case "ANNULLAMENTO":
                    this.iden_terapia = classMenu.idenTestata;
                    this.iden_scheda = classMenu.idenScheda;
                    this.statoTerapia = null;
                    break;
            }
        },
        apriScheda : function(param) {
            var url = "servletGeneric?class=cartellaclinica.gestioneTerapia.plgTerapia";
            // url+="&statoTerapia=I";
            url += "&layout=O&reparto=" + vDati.reparto;
            url += "&idenVisita=" + document.EXTERN.iden_visita.value
                + "&idenAnag=" + vDati.iden_anag;
            url += "&PROCEDURA=" + param.operazione;
            url += "&modality=" + param.modality;
            url += "&btnGenerali=" + param.btn;

            url += (param.tipo_terapia != null) ? "&TIPO_TERAPIA="
                + param.tipo_terapia : '';
            url += (param.iden_terapia != null) ? "&idenTerapia="
                + param.iden_terapia : '';
            url += (param.iden_scheda != null) ? "&idenScheda="
                + param.iden_scheda : '';
            url += (param.statoTerapia != null) ? "&statoTerapia="
                + param.statoTerapia : '';

            $.fancybox({
                'padding' : 3,
                'width' : $('#content').width(),
                'height' : $('#content').height(),
                'href' : url,
                'onCleanup' : param.onClose,
                'type' : 'iframe'
            });
        },
        getTerapia : function() {
            return $('div.Terapia[iden_terapia="' + classMenu.idenTestata
                + '"]');
        },
        getScheda : function() {
            return $('table[iden_scheda="' + classMenu.idenScheda + '"]',
                terapie.util.getTerapia());
        },
        getDettaglio : function() {
            return $('div[iden_dettaglio="' + classMenu.idenDettaglio
                + '"][tipo="SOMMINISTRAZIONE"]', terapie.util.getTerapia());
        },
        getNota : function() {
            var nota = new Object();
            if (typeof $(
                'div[iden_dettaglio="' + classMenu.idenDettaglio
                    + '"][tipo="NOTA"]', terapie.util.getTerapia())
                .attr('title') != 'undefined') {
                var div = $('div[iden_dettaglio="' + classMenu.idenDettaglio
                    + '"][tipo="NOTA"]', terapie.util.getTerapia());
                nota.testo = div.attr('title');
                nota.livello = div.attr('stato');
            } else {
                nota.testo = '';
                nota.livello = '';
            }
            return nota;
        }
    },
    inserisci : function(pTipoTerapia) {

        if (check.Modalita.isReadonly())
            return;
        if (!check.utente(config.terapie.inserimento.utenti))
            return;

        var param = new terapie.util.param('INSERIMENTO', pTipoTerapia);
        terapie.util.apriScheda(param);
    },
    visualizza : function() {
        var param = new terapie.util.param('LETTURA');
        terapie.util.apriScheda(param);
    },
    modifica : function() {
        if (check.Modalita.isReadonly())
            return;
        
        if (!check.utente(config.terapie.inserimento.utenti))
            return;

        //if (terapie.checkAllerte()) {
            var param = new terapie.util.param('MODIFICA');

                    var tipo_alternabilita = terapie.getInfoScheda(param.iden_scheda).TIPO_ALTERNABILITA
            /*	if(tipo_alternabilita == 'PRIMARY' || tipo_alternabilita == 'SECONDARY'){
                            return alert('Operazione non consentita per la terapia selezionata');
                    }	*/	

            terapie.util.apriScheda(param);
        //}
    },
    checkAllerte : function() {
        var allerte;

        var url = "avviso?";
        url += "nomeSP=CC_AVVISI_PRE_TERAPIA";
        url += "&origine=AVVISI_PRE_TERAPIA";
        url += "&1=NUMBER@" + vDati.iden_anag;
        allerte = window.showModalDialog(url, null, "dialogHeight:500px;dialogWidth:800px");

        return (allerte == 'S');
    }, 
    duplica : function() {	
    	
        if (check.Modalita.isReadonly())
            return;
    	
        if (!check.utente(config.terapie.inserimento.utenti))
            return;

        var param = new terapie.util.param('DUPLICA');
		
		var tipo_alternabilita = terapie.getInfoScheda(param.iden_scheda).TIPO_ALTERNABILITA
		
		if(tipo_alternabilita == 'PRIMARY' || tipo_alternabilita == 'SECONDARY'){
			return alert('Operazione non consentita per la terapia selezionata');
		}
				
        terapie.util.apriScheda(param);
    },
    chiudi : function() {
        if (check.Modalita.isReadonly())
            return;
        if (WindowCartella.baseUser.TIPO != 'M') {
            alert("Funzionalità riservata al personale medico");
            return;
        }

		/*@TODO so che fa schifo ma giuro che appena finisco le pipe-function lo sistemo*/
		var rs = WindowCartella.executeQuery("terapie.xml", "infusione.getSomministrazioneInCorso", [classMenu.idenTestata]);
		var residuo =0;
	/*	if(rs.next()){
			var resp = WindowCartella.executeStatement("terapie.xml", "infusione.getResiduo", [rs.getInt("IDEN"), null, null],1);
			if(resp[0]=='KO'){
				alert(resp[1]);
				throw(resp[1]);
			}
			residuo = resp[2];
		}*/
		

        var resp = terapie.getInfoScheda(classMenu.idenScheda).SOTTOTIPO=='RANGE'?getMotivoData(0,1,'S',{"residuo":residuo}):getMotivoData(0,1,'N');
        if (resp == null) {return;};
        if ((resp.data+' '+resp.ora) < $("div.Terapia[iden_terapia="+classMenu.idenTestata+"]").attr("data_ini")) {
            return alert("Impossibile chiudere una terapia con data di chiusura antecedente alla data di inizio.");};

   //per ossigenoterapia e fototerapia quando chiudo terapia chiudo anche il dettaglio
        if(terapie.getInfoScheda(classMenu.idenScheda).SOTTOTIPO=='RANGE_SCHEDA'){
        	resp.chiudiDet='S';
        } 
            
        var sqlBinds = new Array();
        sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
        sqlBinds.push(resp.motivo);
        sqlBinds.push(classMenu.idenTestata);
        sqlBinds.push(WindowCartella.baseUser.DESCRIPTION);
        sqlBinds.push(resp.data);
        sqlBinds.push(resp.ora);
        sqlBinds.push(clsDate.getData(new Date(), 'YYYYMMDD')
            + clsDate.getOra(new Date()));
        sqlBinds.push(resp.chiudiDet);
        sqlBinds.push(resp.residuo);

        /*
         return alert((WindowCartella.baseUser.IDEN_PER) +'\n' +resp.motivo +'\n'+classMenu.idenTestata+'\n'+ WindowCartella.baseUser.DESCRIPTION +'\n'+
         resp.data  +'\n'+resp.ora +'\n'+clsDate.getData(new Date(), 'YYYYMMDD')
         + clsDate.getOra(new Date()));
         */
        
        
        var resp = WindowCartella.executeStatement("terapie.xml", "chiudi", sqlBinds,1);
        if (resp[0]=="OK"){
        	if(resp[2]!=' '){
        		alert(resp[2]);
        	}
        	document.EXTERN.submit();
        } else{
        	return alert(resp[0] +" "+ resp[1]);
        }


    },
    sospendi : function(valore) {
        if (check.Modalita.isReadonly())
            return;
        if (!check.utente(config.terapie.sospensione.utenti))
            return;
        
        if(classMenu.sottotipoScheda=='RANGE'){
         alert('Funzionalità non disponibile per la tipologia di terapia selezionata');	
        	return;
        }

        var resp = (valore=='S') ? getMotivoData(0, 2,'N') : getMotivoData(0, 1,'N');
        if (resp == null) {
            return;
        }

        var sqlBinds = new Array();
        sqlBinds.push(valore);
        sqlBinds.push(classMenu.idenTestata);
        sqlBinds.push(WindowCartella.baseUser.IDEN_PER);
        sqlBinds.push(resp.data + resp.ora);
        sqlBinds.push(typeof(resp.data2)=='undefined'?'':resp.data2 + resp.ora2);
        sqlBinds.push(resp.motivo);
     
        Reload.terapia(classMenu.idenTestata, "terapie.xml", "sospendi",
            sqlBinds);
    },
    cancella : function() {

        if (check.Modalita.isReadonly())
            return;

        if (!check.utente(config.terapie.cancellazione.utenti))
            return;
        if (!check.utenteMedesimo(config.terapie.cancellazione.utenteMedesimo,
            'testata'))
            return;
        if (confirm('Si conferma la cancellazione della terapia?')) {
            var sqlBinds = new Array();
            sqlBinds.push(classMenu.idenTestata);
            var resp = WindowCartella.executeStatement("terapie.xml", "cancella",
                sqlBinds, 1);
            if (resp[0]=="OK"){

                if (resp[2] == 'OK') {
                    $('div.Terapia[iden_terapia=' + classMenu.idenTestata + ']')
                        .remove();
                } else {
                    alert('Impossibile cancellare la terapia, sono presenti delle somministrazioni eseguite');
                }

            } else{
                return alert(resp[0] +" "+ resp[1]);
            }

        }
    },
    espandi : function(iden_terapia) {
        var scheda = $('div.Terapia[iden_terapia="' + iden_terapia
            + '"] table.Scheda[stato="E"]');
        if (window.event.srcElement.innerText == '+') {
            window.event.srcElement.innerText = '-';
            window.event.srcElement.title = 'Mostra solo l\'ultima scheda';
            scheda.css({
                position : 'relative'
            }).find('th').css({
                    visibility : 'visible'
                }).find('div').css({display:'block'});
            $('div.Terapia[iden_terapia="' + iden_terapia+'"]').find('div#divIntScheda').show();
            $('div.Terapia[iden_terapia="' + iden_terapia+'"]').find('div#divIntPeriodo').hide();
        } else {
            window.event.srcElement.innerText = '+';
            window.event.srcElement.title = 'Mostra tutte le schede';
            scheda.css({
                position : 'absolute'
            }).find('th').css({
                    visibility : 'hidden'
                });
            $('div.Terapia[iden_terapia="' + iden_terapia+'"]').find('div#divIntScheda').hide();
            $('div.Terapia[iden_terapia="' + iden_terapia+'"]').find('div#divIntPeriodo').show();
        }
    },
    importa : function() {
        if (check.Modalita.isReadonly()) {return;}
        if (!check.utente(config.terapie.inserimento.utenti)){return;}

        terapie.apriImportazione();
    },
    apriImportazione: function () {

        var url = "servletGeneric?class=cartellaclinica.gestioneTerapia.importaTerapie" +
            "&idenAnag="+WindowCartella.getPaziente("IDEN") +
            "&idenRegistrazione="+document.EXTERN.iden_visita.value +
            "&idenRicovero="+WindowCartella.getRicovero("IDEN");
        $.fancybox({
            'padding'	: 3,
            'width'		: document.body.offsetWidth/10*9,
            'height'	: document.body.offsetHeight/10*9,
            'href'		: url,
            'type'		: 'iframe'
        });
    },
    pianifica:function(){
        var iden_per = WindowCartella.baseUser.IDEN_PER;
        var tipo_ute = WindowCartella.baseUser.TIPO;
        var iden_scheda = classMenu.idenScheda;
       // return alert(iden_per +'\n'+  tipo_ute +'\n'+ iden_scheda);
        var vResp = WindowCartella.executeStatement('terapie.xml','isTerapiaPianificabile',[iden_per,tipo_ute,iden_scheda],2);

        if (vResp[0]== 'KO'){
            return alert(vResp[1]);
        }
        if (vResp[2]=='KO'){
            return alert(vResp[3]);
        }

        var url = 'modalUtility/TerapiaPianifica.html';
        $.fancybox({
            'width' : 1024,
            'height' : 580,
            'href' : url,
            'type' : 'iframe',
			'onCleanup':function(){aggiornaPianoGiornaliero();}
        });

    },
	
	getInfoScheda:function(pIdenScheda){
		if($('table.Scheda[iden_scheda="'+pIdenScheda+'"]').data("TIPOLOGIE") == null){
			terapie.setInfoScheda(pIdenScheda);
		}
		
		return $('table.Scheda[iden_scheda="'+pIdenScheda+'"]').data("TIPOLOGIE")
	},
	
	setInfoScheda:function(pIdenScheda){
		
		WindowCartella.executeAction(
			'Database',
			'getSingleRecord',
			{
				file_name:'terapie.xml',
				statement_name:'getInfoScheda',
				parameters:pIdenScheda
			},
			function(resp){
				if(resp.success == false){
					return alert(resp.message);
				}
				$('table.Scheda[iden_scheda="'+pIdenScheda+'"]').data("TIPOLOGIE",resp.record);
			}
		);		
		
	}


};

var storico = {
    apri : function(tipo) {
        var param = storico.param(tipo);
        if (param == null)
            return;
        var url = "avviso?";
        switch (classMenu.codificaTestata) {
            case 'terapia':
                url += "nomeSP=CC_TERAPIA_PAGE_BCK";
                url += "&origine=TERAPIA_BCK";
                url += "&1=NUMBER@" + classMenu.idenTestata;
                url += "&2=VARCHAR@" + param.data;
                url += "&3=NUMBER@" + param.idenDettaglio;
                break;
            case 'parametro':
                url += "nomeSP=CC_PARAMETRI_PAGE_BCK";
                url += "&origine=PARAMETRO_BCK";
                url += "&1=NUMBER@" + classMenu.idenTestata;
                url += "&2=NUMBER@" + vDati.iden_anag;
                url += "&3=NUMBER@" + param.idenRicovero;
                url += "&4=NUMBER@" + param.idenVisita;
                url += "&5=VARCHAR@" + param.data;
                url += "&6=NUMBER@" + param.idenDettaglio;
                break;
            case 'attivita':
                url += "nomeSP=CC_ATTIVITA_PAGE_BCK";
                url += "&origine=ATTIVITA_BCK";
                url += "&1=VARCHAR@" + WindowCartella.baseUser.LOGIN;
                url += "&2=NUMBER@" + document.EXTERN.iden_visita.value;
                url += "&3=NUMBER@" + classMenu.idenTestata;
                url += "&4=VARCHAR@" + param.data;
                url += "&5=NUMBER@" + param.idenDettaglio;
                break;
            default:
                return;
        }
        // window.open(url,"","fullscreen=yes");
        $.fancybox({
            'width' : 1024,
            'height' : 580,
            'href' : url,
            'type' : 'iframe'
        });
    },
    param : function(tipo) {
        var param = {
            data : null,
            idenDettaglio : null,
            idenRicovero : null,
            idenVisita : null
        };
        switch (tipo) {
            case 'dettaglio':
                if (classMenu.idenDettaglio == null) {
                    alert('Selezionare un dettaglio');
                    return null;
                } else
                    param.idenDettaglio = classMenu.idenDettaglio;
            case 'giorno':
                param.data = /* classMenu.Data; */clsDate.getData(new Date(),
                    'YYYYMMDD');
            case 'episodio':
                param.idenVisita = WindowCartella.getAccesso("IDEN");
            case 'ricovero':
                param.idenRicovero = WindowCartella.getRicovero("IDEN");
        }
        return param;
    }
};

var check = {

    Modalita : {

        readonly : false,
        isReadonly : function() {
            if (check.Modalita.readonly)
                alert('Funzionalità non disponibile');
            return check.Modalita.readonly;
        }
    },

    isValid : function(pParam) {

        if (typeof pParam['STATO_TESTATA'] != 'undefined')
            if (!check.stato.testata(pParam['STATO_TESTATA']))
                return false;

        if (typeof pParam['STATO_DETTAGLIO'] != 'undefined')
            if (!check.stato.dettaglio(pParam['STATO_DETTAGLIO']))
                return false;

        if (typeof pParam['DIPENDENZE'] != 'undefined')
            if (check.dipendenze(pParam['DIPENDENZE']))
                return false;

        if (typeof pParam['USER'] != 'undefined')
            if (!check.utente(pParam['USER']))
                return false;
        /*
         * DA MODIFICARE NEL JSON AGGIUNGERE PARAM PER DETTAGLIO O SCHEDA O
         * TESTATA
         */
        // if(typeof pParam['SAMEUSER'] != 'undefined')
        // if(!check.utenteMedesimo(pParam['SAMEUSER']))return false;
        if (typeof pParam['RANGE'] != 'undefined')
            if (!check.data(pParam['RANGE']))
                return false;
        // alert('controllo ok');
        return true;
    },

    modifica : function() {
        if (!classMenu.ModificaAbilitata)
            alert('Modifica non disponibile');
        return classMenu.ModificaAbilitata;
    },

    stato : {

        testata : function(pArray) {

            for ( var i = 0; i < pArray.length; i++) {
                if (pArray[i] == classMenu.statoTestata)
                    return true;
            }
            alert('Stato dell\'evento non compatibile con la funzionalità richiesta');
            return false;
        },

        dettaglio : function(pArray) {

            for ( var i = 0; i < pArray.length; i++) {
                if (pArray[i] == classMenu.statoDettaglio)
                    return true;
            }
            alert('Stato dell\'evento non compatibile con la funzionalità richiesta');
            return false;
        }

    },

    dipendenze : function(pArray) {

        var jSon = jsonDettagli[classMenu.idenDettaglio];

        for ( var i = 0; i < pArray.length; i++) {
            // alert(jSon.dipendenze[pArray[i]]);
            if (jSon.dipendenze[pArray[i]]) {
                alert("Selezione non valida a causa di azioni successive dipendenti");
                return true;
            }
        }
    },

    utente : function(pArray) {
        for ( var i = 0; i < pArray.length; i++) {
            if (pArray[i] == WindowCartella.baseUser.TIPO)
                return true;
        }
        alert('Utente non abilitato');
        return false;
    },

    utenteMedesimo : function(pFlag, pLivello) {
        var idenUtente;
        switch (pLivello) {
            case 'testata':
                idenUtente = classMenu.idenUtenteTestata;
                break;
            case 'scheda':
                idenUtente = classMenu.idenUtenteScheda;
                break;
            case 'dettaglio':
                idenUtente = classMenu.idenUtenteDettaglio;
                break;
            default:
                alert('Error: selezione non valida');
                return false;
                break;
        }
        if (!pFlag || WindowCartella.baseUser.IDEN_PER == idenUtente)
            return true;
        else {
            alert("Modifica riservata esclusivamente all'utente originale");
            return false;
        }
    },

    data : function(pRange) {
        var msg = '';
        try {
            var ini = clsDate.dateAdd(new Date(), 'h', -pRange.down);
            msg = 'ini:' + ini;

            var fine = clsDate.dateAdd(new Date(), 'h', pRange.up);
            msg = 'fine :' + fine;

            var data = clsDate.str2date(classMenu.dataDettaglio, 'YYYYMMDD',
                classMenu.oraDettaglio);
            msg = 'data :' + data;
            if (ini <= data && data <= fine)
                return true;

            alert('Operazione esterna al range orario consentito');
            return false;
        } catch (e) {
            alert('check.data - ' + msg + ' : ' + e.description);
        }
    },

    dettaglio : function() {
        if (classMenu.idenDettaglio != null)
            return true;

        alert('Selezionare un dettaglio');
        return false;
    }
};

var procedure = {

    initActivity : function(pParam) {
        if (check.Modalita.isReadonly())
            return;
        if (!check.isValid(pParam))
            return;
        pParam['FUNCTION'](pParam);
    },
    inserisci : function(pParam) {
        if (check.Modalita.isReadonly())
            return;
        procedure.utility.apriFancyProcedure(procedure.utility.getUrl(pParam));
    },
    modifica : function(pParam) {
        if (check.Modalita.isReadonly())
            return;
        pParam['IDEN_PROCEDURA'] = classMenu.idenTestata;
        procedure.utility.apriFancyProcedure(procedure.utility.getUrl(pParam));
    },
    visualizza : function(pParam) {
        pParam['IDEN_PROCEDURA'] = classMenu.idenTestata;
        pParam['IDEN_SCHEDA'] = classMenu.idenScheda;
        procedure.utility.apriFancyProcedure(procedure.utility.getUrl(pParam));
    },
    chiudi : function(pParam) {
        pParam['IDEN_PROCEDURA'] = classMenu.idenTestata;
        procedure.utility.apriFancyProcedure(procedure.utility.getUrl(pParam)
            + '&GUARIGIONE=S');
    },
    cancella : function() {
        if (check.Modalita.isReadonly())
            return;
        
        if (!check.utente(config.procedure.cancellazione.utenti))
            return;
        if (!check.utenteMedesimo(
            config.procedure.cancellazione.controlloUtente, 'testata'))
            return;
        var sqlBinds = new Array();
        sqlBinds.push(classMenu.idenTestata);
        var resp = WindowCartella.executeStatement("procedure.xml", "cancellaTestata",
            sqlBinds, 1);
        if (resp[2] == 'OK') {
            $('div.Procedura[iden_procedura=' + classMenu.idenTestata + ']')
                .remove();
        } else {
            alert(resp[2]);
        }
    },
    cancellaUltimaScheda : function() {
        if (check.Modalita.isReadonly())
            return;
    	
        if (!check.utente(config.procedure.cancellazione.utenti))
            return;
        if (!check.utenteMedesimo(
            config.procedure.cancellazione.controlloUtente, 'testata'))
            return;
        var sqlBinds = new Array();
        sqlBinds.push(classMenu.idenTestata);
        var resp = WindowCartella.executeStatement("procedure.xml", "cancellaScheda",
            sqlBinds, 1);
        if (resp[2] == 'OK') {
            refreshPiano(resp[2]);
        } else {
            alert(resp[2]);
        }
    },
    espandi : function(iden_procedura) {
        var scheda = $('div.Procedura[iden_procedura="' + iden_procedura
            + '"] table.Scheda[stato="E"]');
        if (window.event.srcElement.innerText == '+') {
            window.event.srcElement.innerText = '-';
            window.event.srcElement.title = 'Mostra solo l\'ultima scheda';
            scheda.css({
                position : 'relative',
                height : 'auto'
            });
            scheda.parent().find('div.out_validita').addClass("velonero");
        } else {
            window.event.srcElement.innerText = '+';
            window.event.srcElement.title = 'Mostra tutte le schede';
            scheda.css({
                position : 'absolute'
            });
            scheda.parent().find('div.out_validita').removeClass("velonero");
            scheda.parent().find('table').equalizeHeights();
        }
    },
    dettaglio : {
        inserisci : function(pParam) {
            pParam['IDEN_PROCEDURA'] = classMenu.idenTestata;
            procedure.utility.apriFancyProcedure(procedure.utility
                .getUrl(pParam));
        },
        cancella : function(pParam) {

            var abilitazioni = config.procedure.dettagli.cancellazione;
            if (!check.utente(abilitazioni.utenti))
                return;
            if (!check
                .utenteMedesimo(abilitazioni.controlloUtente, 'dettaglio'))
                return;
            if (!check.data(abilitazioni.range))
                return;

            var resp = WindowCartella.executeStatement("procedure.xml",
                "cancellaDettaglio", [ WindowCartella.baseUser.IDEN_PER,
                    classMenu.idenDettaglio ]);
            refreshPiano(resp[0]);

        }
    },
    utility : {
        getUrl : function(pParam) {
            var url = "";
            switch (pParam['PROCEDURA']) {
                case 'PT_MEDICAZIONE':
                case 'PT_PRESIDIO':
                case 'PT_DETTAGLIO':
                    url += "servletGenerator?KEY_LEGAME=PT_WRAPPER";
                    url += "&CODICE_REPARTO=" + vDati.reparto;
                    url += "&IDEN_VISITA=" + document.EXTERN.iden_visita.value;
                    url += "&TIPO_DATO=" + pParam['PROCEDURA'];
                    url += "&STATO_PAGINA=" + pParam['STATO'];
                    if (typeof pParam['SEZIONI'] != 'undefined') {
                        url += "&SEZIONI=" + pParam['SEZIONI'];
                        url += "&PROPS=" + pParam['PROPS'];
                    }
                    if (typeof pParam['IDEN_PROCEDURA'] != 'undefined') {
                        url += '&SITO=LOAD&IDEN_PROCEDURA='
                            + pParam['IDEN_PROCEDURA'];
                        url += '&KEY_PROCEDURA=' + pParam['KEY_LEGAME'];
                    }
                    if (typeof pParam['IDEN_SCHEDA'] != 'undefined') {
                        url += '&IDEN_SCHEDA=' + pParam['IDEN_SCHEDA'];
                    }
                    break;
            }
            return url;
        },
        apriFancyProcedure : function(url) {
            $.fancybox({
                'padding' : 3,
                'width' : $('#content').width(),
                'height' : $('#content').height(),
                'href' : url,
                'type' : 'iframe'
            });
        },
        execute : function(pParam) {

            // if (top.ModalitaCartella.isReadonly(document))return;
            try {
                var sql = pParam['SQL'];
                var sqlBinds = '';

                if (typeof pParam['DATI'] != 'undefined') {
                    var newObject = {};

                    if (typeof pParam['DATI']['PARAM'] != 'undefined') {

                        newObject = jQuery.extend(true, {},
                            pParam['DATI']['PARAM']);

                        for ( var i in newObject) {
                            try {
                                newObject[i] = eval(pParam['DATI']['PARAM'][i]);
                            } catch (e) {
                                /* è già un valore valido */
                            }
                        }
                        var dati = getDati(pParam['DATI']['PAGE'], newObject);// (clsDate.getData(new
                        // Date(),'YYYYMMDD'),null,arrayDate);
                    } else {
                        var dati = pParam['DATI']['FUNCTION'](clsDate.getData(
                            new Date(), 'YYYYMMDD'), null, arrayDate);
                    }
                    // var dati =
                    // getDati(pParam['DATI']['PAGE'],newObject);//(clsDate.getData(new
                    // Date(),'YYYYMMDD'),null,arrayDate);
                    if (typeof dati == 'undefined')
                        return;
                }

                for ( var i = 0; i < pParam['SQLBINDS'].length; i++) {
                    sqlBinds += eval(pParam['SQLBINDS'][i]) + '#';
                }
                // if(baseUser.LOGIN=='fra')alert(sql + '\n' + sqlBinds);
                execSql(sql, sqlBinds.substring(0, sqlBinds.length - 1));
            } catch (e) {
                alert(e.description);
            }
        }
    }
};

var nsJson = {
    detail : {

        Load : function() {

            for ( var i = 0; i < jSonDettagli.length; i++) {
                nsJson.detail.build(jSonDettagli[i]).appendTo(
                    $('div.Procedura[iden_procedura="'
                        + jSonDettagli[i].iden.procedura
                        + '"] table td.Dettagli'));
            }
        },

        build : function(json) {
            var styleWidth = 'width:0px';
            switch (json.width) {
                case null:
                    styleWidth = 'width :' + (100 - json.left) + '%'; // viene
                    // prolungato
                    // in
                    // 'eterno'
                    break;
                case 0:
                    styleWidth = ''; // evento a spot, si 'dovrebbe adattare al
                    // contenuto'
                    break;
                default:
                    styleWidth = 'width :' + (json.width) + '%'; // evento a
                    // range
                    // 'classico'
                    break;
            }
            try {
                var detail = $(
                    '<div' + ' iden_procedura="'
                        + json.iden.procedura
                        + '"'
                        + ' iden_scheda="'
                        + json.iden.scheda
                        + '"'
                        + ' iden_dettaglio="'
                        + json.iden.dettaglio
                        + '"'
                        + ' container="'
                        + json.container
                        + '"'
                        + ' class="'
                        + json.css
                        + ' H'
                        + jsonProcedura[json.codifica].lines[json.type].css
                        + ' Outer"'
                        + ' title="'
                        + json.title
                        + '"'
                        + ' style="left:'
                        + json.left
                        + '%;'
                        + styleWidth
                        + ';top:'
                        + jsonProcedura[json.codifica].lines[json.type].top
                        + 'px">' + '<div class="Inner">' + json.text
                        + '</div>' + '</div>').data("json", json);

                return detail;
            } catch (e) {
                alert('nsJson.build -' + e.description);
                alert(' json.codifica :' + json.codifica + '\n json.type:'
                    + json.type + '\n jsonProcedura[json.codifica]:'
                    + jsonProcedura[json.codifica]
                    + '\n jsonProcedura[json.codifica].lines[json.type]:'
                    + jsonProcedura[json.codifica].lines[json.type]);
            }
        },
        addBorder : function(filter) {
            $(filter + 'div[iden_dettaglio][container]').each(function(i) {
                var detail = $(this);
                var width = 5;
                var container = {
                    'SX' : 'S',
                    'DX' : 'S'
                };
                try {

                    container['SX'] = jsonDettagli[detail
                        .attr('iden_dettaglio')].container[0];
                    container['DX'] = jsonDettagli[detail
                        .attr('iden_dettaglio')].container[1];

                } catch (e) {
                    container['SX'] = detail.attr("container").split(
                        ',')[0];
                    container['DX'] = detail.attr("container").split(
                        ',')[1];
                }

                if (container['SX'] == 'S') {
                    var obj = getObject(true, this).click(function(e) {
                        e.stopPropagation();
                        detail.trigger('click');
                    }).mousedown(function(e) {
                        if (e.which == 3) {
                            nsJson.detail.MouseDown(detail);
                        }
                    }).dblclick(function(e) {
                        nsJson.detail.DblClick(detail);
                    }).appendTo(detail.parent());
                    
                    // Ridefinizione dell'attributo left
                    var w = parseInt(String(obj.width()), 10);
                    if (!isNaN(w)) width = w;
                    obj.css('left', (this.offsetLeft - width)+'px');
                }

                if (container['DX'] == 'S') {
                    getObject(false, this).click(function(e) {
                        e.stopPropagation();
                        detail.trigger('click');
                    }).mousedown(function(e) {
                        if (e.which == 3) {
                            nsJson.detail.MouseDown(detail);
                        }
                    }).dblclick(function(e) {
                        nsJson.detail.DblClick(detail);
                    }).appendTo(detail.parent());
                }

                function getObject(isLeft, detail) {
                    var obj = $('<div class="'
                        + (isLeft ? 'L' : 'R')
                        + $(detail).attr("class")
                        + '" title="'
                        + $(detail).attr("title")
                        + '"'
                        + ' iden_dettaglio="'
                        + $(detail).attr("iden_dettaglio")
                        + '" tipo="'
                        + (isLeft ? 'LEFT' : 'RIGHT')
                        + '" style="'
                        + 'left:'
                        + (isLeft ? detail.offsetLeft - width
                        : detail.offsetLeft + detail.offsetWidth)
                        + 'px;' + 'top:' + detail.offsetTop
                        + 'px"></div>');
                    return obj;
                }
            });
        },

        setMouseEvent : function(filter) {
            $(filter + 'div[iden_dettaglio][container]').mousedown(function(e) {
                if (e.which == 3) {
                    nsJson.detail.MouseDown($(this));
                }
            });

            $(filter + 'div[iden_dettaglio][container]').dblclick(function(e) {
                nsJson.detail.DblClick($(this));
            });

        },

        DblClickEvents : {
            'dettaglio' : {
                'P' : terapie.somministrazione.esegui,
                'S' : function() {
                    terapie.somministrazione.sospendi('N');
                }
            },
            'infusione' : {
                'P' : terapie.infusione.inizio,
                'I' : function() {
                 	if(terapie.getInfoScheda(classMenu.idenScheda).TIPO_PRESCRIZIONE!='CONTINUA'){
	                    if (confirm("Proseguendo verrà segnalata finita l'infusione, continuare?")) {
	                        terapie.infusione.fine();
	                    }
                 	}
                 	else{
                 		alert('Nessuna operazione veloce associata');
                 	}
                },
                'S' : function() {
                    terapie.somministrazione.sospendi('N');
                }
            },
            'ossigenoterapia' : {
                'P' : terapie.ossigenoterapia.esegui
            },
            'parametri' : {
                'P' : parametri.dettaglio.rileva
            }
        },

        DblClick : function(obj) {
            idenSchedaSelezionata = obj.attr("iden_scheda");
            idenDettaglioSelezionato = obj.attr("iden_dettaglio");
            switch (obj.attr("MENU")) {
                case 'dettaglio':
                case 'infusione':
                case 'ossigenoterapia':
                    idenTestataSelezionata = obj.attr("iden_terapia");
                    break;
                case 'parametri':
                    idenTestataSelezionata = obj.attr("iden_parametro");
                    break;
                default:
                    break;
            }

            classMenu.Reset();

            try {
                nsJson.detail.DblClickEvents[obj.attr("MENU")][obj
                    .attr("STATO")]();
            } catch (e) {
                alert('Nessuna operazione veloce associata');
                // alert(obj.attr("MENU") + '\n' + obj.attr("STATO"));
            }
        },

        MouseDown : function(obj) {
            var Dettaglio = obj;// $(this);

            try {

                var jSon = jsonDettagli[$(obj).attr('iden_dettaglio')];
//				Dettaglio.removeClass(jSon.css).addClass("Yellow");

                var ArSpecificMenu = jsonProcedura[jSon.codifica].lines[jSon.type].specificMenu;
                for ( var i = 0; i < ArSpecificMenu.length; i++) {
                    sezioni2view.push(ArSpecificMenu[i]);
                }

                codificaDettaglioSelezionato = jSon.type;
                statoDettaglioSelezionato = jSon.stato;
                idenParentSelezionato = jSon.iden_parent;
                idenPrecedenteSelezionato = jSon.iden_precedente;
                idenUtenteDettaglioSelezionato = jSon.trace['INSERIMENTO'].IDEN_PER;
                dataDettaglioSelezionato = jSon.trace['INSERIMENTO'].DATA;
                oraDettaglioSelezionato = jSon.trace['INSERIMENTO'].ORA;
                // sezioni2view.push('procedura_dettaglio');

            } catch (e) {
                // ai dettagli non di priocedura manca il json
                // alert(Dettaglio.attr('menu'));
                var ArSpecificMenu;
                try {
                    ArSpecificMenu = Dettaglio.attr('menu').split(',');
                } catch (e) {
                    Dettaglio = $("div[iden_dettaglio="
                        + Dettaglio.attr("iden_dettaglio") + "][menu]",
                        Dettaglio.parent());
                    ArSpecificMenu = Dettaglio.attr('menu').split(',');
                }
                for ( var i = 0; i < ArSpecificMenu.length; i++) {
                    sezioni2view.push(ArSpecificMenu[i]);
                }
                statoDettaglioSelezionato = Dettaglio.attr("stato");
                idenUtenteDettaglioSelezionato = Dettaglio.attr("iden_ute");
                dataDettaglioSelezionato = Dettaglio.attr("data");
                oraDettaglioSelezionato = Dettaglio.attr("ora");
            }

            idenSchedaSelezionata = Dettaglio.attr("iden_scheda");
            idenDettaglioSelezionato = Dettaglio.attr("iden_dettaglio");
        }
    },

    procedura : {

    }
};

var Reload = {
    terapia : function(pIden, pFileName, pStatementName, pBinds, pOuts, pCallbackOk) {
        if (typeof pOuts == 'undefined') {
            pOuts = 0;
        }
        try { // alert(dateFrom + ' | ' + dateTo);
            attesa(true);
            WindowCartella.dwr.engine.setAsync(false);
            WindowCartella.dwrUtility.getSectionReloaded('TERAPIA', pIden, dateFrom,
                dateTo, pFileName, pStatementName, pBinds, pOuts, callBack);
            WindowCartella.dwr.engine.setAsync(true);
            attesa(false);
        } catch (e) {
            alert('Errore Reload.terapia: ' + e.description);
        }

        if(typeof pCallbackOk == 'function'){
            pCallbackOk();
        }

        function callBack(resp) {
            if (resp[0] == 'KO') {
                alert('Errore: ' + resp[1]);
            } else {
                if (resp[1] != null) {
                    alert(resp[1]);
                }            
                $('div.Terapia[iden_terapia="' + pIden + '"]').html(resp[2])
                    .find('table').equalizeHeights();
                $('div.Terapia[iden_terapia="' + pIden + '"]').find('th').find('div#divIntScheda').hide();
                // $('div.Terapia[iden_terapia="' + pIden + '"]
                // div.in_validita:even').css({"border-bottom":"2px solid
                // red"});
                nsJson.detail.addBorder('div.Terapia[iden_terapia="' + pIden
                    + '"] ');
                nsJson.detail.setMouseEvent('div.Terapia[iden_terapia="'
                    + pIden + '"] ');
            }
        }
    },
    procedura : function(pIden, pFileName, pStatementName, pBinds, pOuts) {
        if (typeof pOuts == 'undefined') {
            pOuts = 0;
        }
        try {
            attesa(true);
            WindowCartella.dwr.engine.setAsync(false);
            WindowCartella.dwrUtility.getSectionReloaded('PROCEDURA', pIden, dateFrom,
                dateTo, pFileName, pStatementName, pBinds, pOuts, callBack);
            WindowCartella.dwr.engine.setAsync(true);
            attesa(false);
        } catch (e) {
            alert('Errore Reload.terapia: ' + e.description);
        }

        function callBack(resp) {
            if (resp[0] == 'KO') {
                alert(resp[1]);
            } else {
                if (resp[1] != null) {
                    alert(resp[1]);
                }
                $('div.Procedura[iden_procedura="' + pIden + '"]')
                    .html(resp[2]).find('table').equalizeHeights();
                // $('div.Procedura[iden_procedura="' + pIden + '"]
                // div.in_validita:even').css({"border-bottom":"2px solid
                // red"});
                nsJson.detail.addBorder('div.Procedura[iden_procedura="'
                    + pIden + '"] ');
                nsJson.detail.setMouseEvent('div.Procedura[iden_procedura="'
                    + pIden + '"] ');
            }
        }
    }
};

function chiudiFinestra() {
    $.fancybox.close();
}
function apriLegenda() {
    var url = "piano_terapeutico_legenda.html";
    $.fancybox({
        'width' : 1024,
        'height' : 580,
        'href' : url,
        'type' : 'iframe'
    });
};

function spostasu() {
    var thisDiv = $(event.srcElement).parent().parent();
    thisDiv.prev().before(thisDiv);
}
function spostagiu() {
    var thisDiv = $(event.srcElement).parent().parent();
    thisDiv.next().after(thisDiv);
}

function inserisciBilancioIdrico(pTipoBilancio) {
	if (check.Modalita.isReadonly()) {return;}
	var tipo	= typeof pTipoBilancio == 'undefined' ? 'STANDARD' : pTipoBilancio ;
    var url = "servletGenerator?KEY_LEGAME=BILANCIO_IDRICO&idenVisita="+WindowCartella.getAccesso("IDEN")
        +"&STATO_PAGINA=I"
        +"&REPARTO=" + WindowCartella.getAccesso("COD_CDC")
        +"&KEY_ORARIO=BILANCIO_IDRICO_ORARIO"
        +"&TIPO_BILANCIO=" + tipo;
    $.fancybox({
        'padding'	: 3,
        'width'		: document.body.offsetWidth/10*9,
        'height'	: document.body.offsetHeight/10*9,
        'href'		: url,
        'type'		: 'iframe'
    });
}

function filtriInstance(){
    try{

        var form = document.filtri;
        
        this.terapie = {
            enable:$('#chkTerapie').hasClass('selected'),
            chiuse:$('#chkTerapieChiuse').hasClass('selected')//form.chkTerapieChiuse.checked
        };

        this.rilevazioni = {
            enable:$('#chkParametri').hasClass('selected')
        };

        this.attivita = {
            enable:$('#chkAttivita').hasClass('selected')
        };

        this.procedure = {
            enable:{
                PT_MEDICAZIONE : $('#chkLesioni').hasClass('selected'),
                PT_PRESIDIO : $('#chkPresidi').hasClass('selected')
            }

        };

        this.getCodiciProcedureAbilitate = function(){
            var out = "";
            for(var i in this.procedure.enable){
                out += (this.procedure.enable[i] ? "["+i+":S]" : "["+i+":N]");
            }
            return out;
        };
        
        this.tuttoRicovero = function(){
            enable:$('#chkRicovero').hasClass('selected');
        };
        
        this.abilitaFiltro = function(){
            var filtri;
            if ($('#tipoFiltro').val()==26){
                filtri = "[ABILITA_FILTRO_TERAPIE:N]";
                filtri += "[ABILITA_FILTRO_PARAMETRI:N]";
                filtri += "[ABILITA_FILTRO_PT_PRESIDIO:N]";
                filtri += "[ABILITA_FILTRO_PT_MEDICAZIONE:N]";
                filtri += "[ABILITA_FILTRO_ATTIVITA:S]";
            }else{
                filtri = "[ABILITA_FILTRO_TERAPIE:S]";
                filtri += "[ABILITA_FILTRO_PARAMETRI:S]";
                filtri += "[ABILITA_FILTRO_PT_PRESIDIO:S]";
                filtri += "[ABILITA_FILTRO_PT_MEDICAZIONE:S]";
                filtri += "[ABILITA_FILTRO_ATTIVITA:N]";                
            }
            return filtri;
        };

        this.stringify = function(){
            return (this.terapie.enable ? '[TERAPIE:S]' : '[TERAPIE:N]')
                + (this.terapie.chiuse ? '[TERAPIE_CHIUSE:S]' : '[TERAPIE_CHIUSE:N]')
                + (this.rilevazioni.enable ? '[PARAMETRI:S]' : '[PARAMETRI:N]')
                + (this.attivita.enable ? '[ATTIVITA:S]' : '[ATTIVITA:N]')
                + this.getCodiciProcedureAbilitate()
//                + (this.tuttoRicovero.enable ? '[TUTTO_RICOVERO:S]' : '[TUTTO_RICOVERO:N]')
                + '[TUTTO_RICOVERO:N]'
                + this.abilitaFiltro()
                + '[TURNO_PRECEDENTE:1][TURNO_SUCCESSIVO:1]';
        
            /*return "@@@" //turni precedentei + successivi + pianificato + eseguito
                + "@" + (this.terapie.enable ? '[terapie:S]' : '[terapie:N]')
                + "@@" // non confermate + confermate + chiuse
                + "@" + (this.terapie.chiuse ? '[terapie_chiuse:S]' : '[terapie_chiuse:N]')
                + "@" + (this.rilevazioni.enable ? '[parametri:S]' : '[parametri:N]')
                + "@@@" // regolare + allerta + critico
                + "@" + (this.attivita.enable ? '[attivita:S]' : '[attivita:N]')
                + "@@@@" // non indicato + autosufficiente + coadiuvato + non autosufficiente
                + "@" // livello attenzione
                + "@" //tutto il ricovero
                + "@" + this.getCodiciProcedureAbilitate()
                ;*/
        };

    }catch(e){
        alert(e.description)
    }
}
FancyboxParameters = {

    functionregistra: function (parameters) {

        var vMotivo = parameters.testo;
        var vIdenCiclo = classMenu.idenCiclo;
        var vIdenPer = parameters.idenper;
        var vTitle =   parameters.title;
        switch (vTitle){
            case   'Modulo chiusura ciclo terapeutico':
                var vRs = WindowCartella.executeQuery("terapie.xml","idenTerapieCiclo",[vIdenCiclo]);
                while(vRs.next()){

                    var sqlBinds = new Array();
                    sqlBinds.push(vIdenPer);
                    sqlBinds.push(vMotivo);
                    sqlBinds.push(vRs.getString('IDEN'));
                    sqlBinds.push(WindowCartella.baseUser.DESCRIPTION);
                    sqlBinds.push(clsDate.getData(new Date(), 'YYYYMMDD'));
                    sqlBinds.push(clsDate.getOra(new Date()));
                    sqlBinds.push(clsDate.getData(new Date(), 'YYYYMMDD')
                        + clsDate.getOra(new Date()));
                    var vResp = WindowCartella.executeStatement("terapie.xml","chiudi",sqlBinds);
                    if(vResp[0]=='K0'){
                        alert(vResp[1]);
                    }
                }

                break
            case 'Modulo cancellazione ciclo terapeutico':
                var vResp = WindowCartella.executeStatement("terapie.xml","Cicli.cancella",[vIdenCiclo, vMotivo],1);

                if (vResp[0]=='KO'){
                    alert(vResp[0] + vResp[1]);
                }
                if (vResp[2] == 'KO'){
                    return alert("Attenzione impossibile cancellare il ciclo, sono presenti delle somministrazioni eseguite");
                }
                break
            default : return alert("Parametro non riconosciuto");
        }

        if (vResp[0]=='KO'){
            alert("Errore \n" +resp[0]+'\n'+resp[1]);
        } else{
            $.fancybox.close();
            aggiornaPianoGiornaliero();
        }
    }
};

/**
 * Ricarica il frame interno se nel frame superiore il valore di CONTROLLO_ACCESSO è differente.
 * 
 * @author  gianlucab
 * @version 1.0
 * @since   2014-10-03
 */
jQuery(window).load(function(){
	try {
		if (typeof top.CartellaPaziente === 'object') 
			top.CartellaPaziente.controllaPaziente($('form[name=EXTERN] input[name=CONTROLLO_ACCESSO]').val());
	} catch(e) {
		alert(e.message);
	}
});