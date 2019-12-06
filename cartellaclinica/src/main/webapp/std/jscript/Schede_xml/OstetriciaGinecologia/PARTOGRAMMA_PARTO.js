/**
 * @author  marcoulr
 * @author  darioc
 * @author  gianlucab
 * @version 1.1
 * @since   2014-03-28
 */
var WindowCartella = null;
var numColonne = 24; // 12 ore
var maxPosizioniGrafico = 2; // 24 ore
var hPartoN;
var hDataParto;
var hOraParto;
var hDurataParto;
var hSesso;
var hPesoNeo;
var hApgar1;
var hApgar5;
var hFeto;
var hNoteFiglio;
var hPresentazione;
var hPosizione;
var hSecondamento;
var hMinuti;
var hPlacenta;
var hPeso;
var hMembrane;
var hInserzione;
var hFunicolo;
var hVasi;
var hGiri;
var hNodiFunicolo;
var hNumeroGiri;
var hStatoGiri;
var hDoveGiri;
var arrOra;
var arrDilatazione;
var arrPresentazione;
var hPosizioneGrafico;
var hNumeroFigli;

jQuery(document).ready(function() {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }

    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }

    try {
        PARTOGRAMMA_PARTO.init();
        PARTOGRAMMA_PARTO.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
    if (WindowCartella.ModalitaCartella.isReadonly(document)) {
        $("INPUT,SELECT,TEXTAREA").attr('disabled', 'disabled');
    }
});

var PARTOGRAMMA_PARTO = {
    init: function() {
        window.name = 'PARTOGRAMMA_PARTO';

        /*attivo il tabulatore*/
        var lista = ['Partogramma e Parto'];
        attivaTab(lista, 1);

        //NS_FUNCTIONS.hideRecordsPrint('lblregistra', 'lblstampa');
        NS_FUNCTIONS.setDimensioniPagina();

        hPartoN = $('#hPartoN').val().split('@');
        hDataParto = $('#hDataParto').val().split('@');
        hOraParto = $('#hOraParto').val().split('@');
        hDurataParto = $('#hDurataParto').val().split('@');
        hSesso = $('#hSesso').val().split('@');
        hPesoNeo = $('#hPesoNeo').val().split('@');
        hApgar1 = $('#hApgar1').val().split('@');
        hApgar5 = $('#hApgar5').val().split('@');
        hFeto = $('#hFeto').val().split('@');
        hNoteFiglio = $('#hNoteFiglio').val().split('@');
        hPresentazione = $('#hPresentazione').val().split('@');
        hPosizione = $('#hPosizione').val().split('@');
        hSecondamento = $('#hSecondamento').val().split('@');
        hMinuti = $('#hMinuti').val().split('@');
        hPlacenta = $('#hPlacenta').val().split('@');
        hPeso = $('#hPeso').val().split('@');
        hMembrane = $('#hMembrane').val().split('@');
        hInserzione = $('#hInserzione').val().split('@');
        hFunicolo = $('#hFunicolo').val().split('@');
        hVasi = $('#hVasi').val().split('@');
        hGiri = $('#hGiri').val().split('@');
        hNodiFunicolo = $('#hNodiFunicolo').val().split('@');
        hNumeroGiri = $('#hNumeroGiri').val().split('@');
        hStatoGiri = $('#hStatoGiri').val().split('@');
        hDoveGiri = $('#hDoveGiri').val().split('@');
        arrOra = $('#hOra').val().split("|");
        arrDilatazione = $('#hDilatazione').val().split("|");
        arrPresentazione = $('#hDiscesa').val().split("|");
        hNumeroFigli = parseInt($('#hNumeroFigli').val(), 10);
        hNumeroFigli = !isNaN(hNumeroFigli) && hNumeroFigli > 0 ? hNumeroFigli : 1;
        hNumeroFIgli = hOraParto.length <= hNumeroFigli ? hNumeroFigli : hOraParto.length; // retrocompatibilità

        if (arrOra.length > numColonne * maxPosizioniGrafico)
            arrOra = arrOra.slice(0, numColonne * maxPosizioniGrafico);
        if (arrDilatazione.length > numColonne * maxPosizioniGrafico)
            arrDilatazione = arrDilatazione.slice(0, numColonne * maxPosizioniGrafico);
        if (arrPresentazione.length > numColonne * maxPosizioniGrafico)
            arrPresentazione = arrPresentazione.slice(0, numColonne * maxPosizioniGrafico);
        hPosizioneGrafico = 0;

        PARTOGRAMMA_PARTO.tableDilatazioneOra('APPEND');

        for (var j = 0; j < hNumeroFigli; j++) {
            PARTOGRAMMA_PARTO.creaDivFigli(j);
        }


        PARTOGRAMMA_PARTO.creaIntestazioneFigli();

        if (WindowCartella.ModalitaCartella.isReadonly(document)) {
            $("#lblregistra").parent().parent().hide();
        }

        NS_FUNCTIONS.controlloData('txtDataAtt');
        NS_FUNCTIONS.controlloData('txtTravaglioDataInizio');
        NS_FUNCTIONS.controlloData('txtRotturaMembraneData');
        NS_FUNCTIONS.controlloData('txtDataSpinte');
        NS_FUNCTIONS.controlloData('txtMembraneData');

        $("#txtOraAtt").blur(function() {
            oraControl_onblur(document.getElementById('txtOraAtt'));
        });
        $("#txtOraAtt").keyup(function() {
            oraControl_onkeyup(document.getElementById('txtOraAtt'));
        });
        $("#txtOraDC").blur(function() {
            oraControl_onblur(document.getElementById('txtOraDC'));
        });
        $("#txtOraDC").keyup(function() {
            oraControl_onkeyup(document.getElementById('txtOraDC'));
        });
        $("#txtTravaglioOraInizio").blur(function() {
            oraControl_onblur(document.getElementById('txtTravaglioOraInizio'));
        });
        $("#txtTravaglioOraInizio").keyup(function() {
            oraControl_onkeyup(document.getElementById('txtTravaglioOraInizio'));
        });
        $("#txtRotturaMembraneOra").blur(function() {
            oraControl_onblur(document.getElementById('txtRotturaMembraneOra'));
        });
        $("#txtRotturaMembraneOra").keyup(function() {
            oraControl_onkeyup(document.getElementById('txtRotturaMembraneOra'));
        });
        $("#txtOraSpinte").blur(function() {
            oraControl_onblur(document.getElementById('txtOraSpinte'));
        });
        $("#txtOraSpinte").keyup(function() {
            oraControl_onkeyup(document.getElementById('txtOraSpinte'));
        });

        // Controllo input ora
        $('#txtOraAtt').keypress(function(event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') { // Enter
                // Sposto il focus su un altro elemento per scatenare l'evento onBlur una volta sola
                $('#txtOraDC').focus();
                $('#txtOraDC').blur();
            }
        }).blur(function(event) {
        	PARTOGRAMMA_PARTO.tableDilatazioneOra('UPDATE', true);
        });
    },
    setEvents: function() {
        $("select[name='cmbTipoTravaglio']").change(function() {
            if ($(this).attr('value') == '1') {
                $('#chkProstaglandine,#chkOssitocina,#chkAmniorexi,#chkMeccanica').attr('checked', false);
                $('#chkProstaglandine,#chkOssitocina,#chkAmniorexi,#chkMeccanica').attr("disabled", true);
            }
            else {
                $('#chkProstaglandine,#chkOssitocina,#chkAmniorexi,#chkMeccanica').removeAttr("disabled");
            }
        });       
        
        $('select[name=cmbTipoPartoTP]').attr('id', 'cmbTipoPartoTP');
        $('select[name=cmbDistocico]').attr('id', 'cmbDistocico');       
        $('select[name=cmbCesareo]').attr('id', 'cmbCesareo');        
        
        NS_FUNCTIONS.enableDisable($('select[name="cmbTipoPartoTP"]'), ['1'], ['cmbDistocico']);
        $('select[name="cmbTipoPartoTP"]').change(function() {
        	NS_FUNCTIONS.enableDisable($('select[name="cmbTipoPartoTP"]'), ['1'], ['cmbDistocico'], true);
            if ($(this).attr('value') != '1') {
                $("select[name='cmbCesareo']").attr("disabled", true).val('');
            }
        });

        NS_FUNCTIONS.enableDisable($('select[name="cmbDistocico"]'), ['0'], ['cmbCesareo']);
        $('select[name="cmbDistocico"]').change(function() {
        	NS_FUNCTIONS.enableDisable($('select[name="cmbDistocico"]'), ['0'], ['cmbCesareo'], true);	
        });
        
        jQuery('#txtAvvertenze, #txtAltroIntervento, #txtIndicazioni').addClass("expand");
        jQuery("textarea[class*=expand]").TextAreaExpander();
    },
    controllaDilatazione: function(number) {
        var min = 0;
        var max = 10;
        var ret;
        try {
            ret = this.controllaValore(number, min, max, 'Inserire un valore tra ' + min + ' e ' + max + '.');
        } catch (e) {
            throw e;
        }
        return ret;
    },
    controllaPresentazione: function(number) {
        var min = -5;
        var max = 5;
        var ret;
        try {
            ret = this.controllaValore(number, min, max, 'Inserire un valore tra ' + min + ' e ' + max + '.');
        } catch (e) {
            throw e;
        }
        return ret;
    },
    controllaValore: function(number, min, max, message) {
        if (isNaN(number)) {
            throw new Error(message);
        } else {
            if (number < min) {
                throw new Error(message);
            } else if (number > max) {
                throw new Error(message);
            }
            number = Math.round(number * 2) / 2;
        }
        return number;
    },
    registraPartogrammaParto: function() {
        try {
            // Input ora
            $('[id^=Rilevamento]').each(function() {
                var i = parseInt($(this).attr("id").replace(/^[^\d]*([\d]+)[\s\S]*$/, "$1"), 10);
                arrOra[hPosizioneGrafico * numColonne + i] = $(this).html();
            });
            // Controllo input dilatazione
            $('[id^=_Dilatazione]').each(function() {
                if ($(this).val() != '') {
                    try {
                        var number = PARTOGRAMMA_PARTO.controllaDilatazione(parseFloat($(this).val().replace(',', '.')));
                        $(this).val(number);
                    } catch (e) {
                        $(this).focus();
                        throw e;
                    }
                }
                var i = parseInt($(this).attr("id").replace(/^[^\d]*([\d]+)[\s\S]*$/, "$1"), 10);
                arrDilatazione[hPosizioneGrafico * numColonne + i] = $(this).val();
            });
            // Controllo input presentazione
            $('[id^=_Presentazione]').each(function() {
                if ($(this).val() != '') {
                    try {
                        var number = PARTOGRAMMA_PARTO.controllaPresentazione(parseFloat($(this).val().replace(',', '.')));
                        $(this).val(number);
                    } catch (e) {
                        $(this).focus();
                        throw e;
                    }
                }
                var i = parseInt($(this).attr("id").replace(/^[^\d]*([\d]+)[\s\S]*$/, "$1"), 10);
                arrPresentazione[hPosizioneGrafico * numColonne + i] = $(this).val();
            });
        } catch (e) {
            alert(e.message);
            return;
        }

        $('#hPartoN,#hDataParto,#hOraParto,#hDurataParto,#hSesso,#hPesoNeo,#hApgar1,#hApgar5,#hFeto,#hNoteFiglio, #hPresentazione,#hPosizione,#hSecondamento,#hMinuti,#hPlacenta,#hPeso,#hMembrane,#hInserzione,#hFunicolo,#hVasi,#hGiri,#hNodiFunicolo,#hNumeroGiri,#hStatoGiri,#hDoveGiri').val('');

        $("table[id^='tabellaFiglio_']").each(function(index) {
            index == 0 ? $('#hPartoN').val($(this).find("input[name^='txtPartoN']").val()) : $('#hPartoN').val($('#hPartoN').val() + '@' + $(this).find("input[name^='txtPartoN']").val());
            index == 0 ? $('#hDataParto').val($(this).find("input[name^='txtPartoData']").val()) : $('#hDataParto').val($('#hDataParto').val() + '@' + $(this).find("input[name^='txtPartoData']").val());
            index == 0 ? $('#hOraParto').val($(this).find("input[name^='txtOraParto']").val()) : $('#hOraParto').val($('#hOraParto').val() + '@' + $(this).find("input[name^='txtOraParto']").val());
            index == 0 ? $('#hDurataParto').val($(this).find("input[name^='txtDurata']").val()) : $('#hDurataParto').val($('#hDurataParto').val() + '@' + $(this).find("input[name^='txtDurata']").val());
            index == 0 ? $('#hSesso').val($(this).find("select[name^='cmbSesso']").val()) : $('#hSesso').val($('#hSesso').val() + '@' + $(this).find("select[name^='cmbSesso']").val());
            index == 0 ? $('#hPesoNeo').val($(this).find("input[name^='txtPesoNeo']").val()) : $('#hPesoNeo').val($('#hPesoNeo').val() + '@' + $(this).find("input[name^='txtPesoNeo']").val());
            index == 0 ? $('#hApgar1').val($(this).find("input[name^='txtApgar1']").val()) : $('#hApgar1').val($('#hApgar1').val() + '@' + $(this).find("input[name^='txtApgar1']").val());
            index == 0 ? $('#hApgar5').val($(this).find("input[name^='txtApgar5']").val()) : $('#hApgar5').val($('#hApgar5').val() + '@' + $(this).find("input[name^='txtApgar5']").val());
            index == 0 ? $('#hFeto').val($(this).find("select[name^='cmbFeto']").val()) : $('#hFeto').val($('#hFeto').val() + '@' + $(this).find("select[name^='cmbFeto']").val());
            index == 0 ? $('#hNoteFiglio').val($(this).find("textarea[name^='txtNoteFiglio']").text()) : $('#hNoteFiglio').val($('#hNoteFiglio').val() + '@' + $(this).find("textarea[name^='txtNoteFiglio']").text());
            index == 0 ? $('#hPresentazione').val($(this).find("select[name^='cmbPresentazione']").val()) : $('#hPresentazione').val($('#hPresentazione').val() + '@' + $(this).find("select[name^='cmbPresentazione']").val());
            index == 0 ? $('#hPosizione').val($(this).find("select[name^='cmbPosizione']").val()) : $('#hPosizione').val($('#hPosizione').val() + '@' + $(this).find("select[name^='cmbPosizione']").val());
            index == 0 ? $('#hSecondamento').val($(this).find("select[name^='cmbSecondamento']").val()) : $('#hSecondamento').val($('#hSecondamento').val() + '@' + $(this).find("select[name^='cmbSecondamento']").val());
            index == 0 ? $('#hMinuti').val($(this).find("input[name^='cmbDopoMin']").val()) : $('#hMinuti').val($('#hMinuti').val() + '@' + $(this).find("input[name^='cmbDopoMin']").val());
            index == 0 ? $('#hPlacenta').val($(this).find("input[name^='txtPlacentaDia']").val()) : $('#hPlacenta').val($('#hPlacenta').val() + '@' + $(this).find("input[name^='txtPlacentaDia']").val());
            index == 0 ? $('#hPeso').val($(this).find("input[name^='txtPeso_']").val()) : $('#hPeso').val($('#hPeso').val() + '@' + $(this).find("input[name^='txtPeso_']").val());
            index == 0 ? $('#hMembrane').val($(this).find("select[name^='cmbMembrane']").val()) : $('#hMembrane').val($('#hMembrane').val() + '@' + $(this).find("select[name^='cmbMembrane']").val());
            index == 0 ? $('#hInserzione').val($(this).find("select[name^='cmbFunicolo']").val()) : $('#hInserzione').val($('#hInserzione').val() + '@' + $(this).find("select[name^='cmbFunicolo']").val());
            index == 0 ? $('#hFunicolo').val($(this).find("input[name^='txtFunicolo']").val()) : $('#hFunicolo').val($('#hFunicolo').val() + '@' + $(this).find("input[name^='txtFunicolo']").val());
            index == 0 ? $('#hVasi').val($(this).find("input[name^='txtVasi']").val()) : $('#hVasi').val($('#hVasi').val() + '@' + $(this).find("input[name^='txtVasi']").val());
            index == 0 ? $('#hGiri').val($(this).find("select[name^='cmbGiri']").val()) : $('#hGiri').val($('#hGiri').val() + '@' + $(this).find("select[name^='cmbGiri']").val());
            index == 0 ? $('#hNodiFunicolo').val($(this).find("select[name^='cmbNodiFunicolo']").val()) : $('#hNodiFunicolo').val($('#hNodiFunicolo').val() + '@' + $(this).find("select[name^='cmbNodiFunicolo']").val());
            index == 0 ? $('#hNumeroGiri').val($(this).find("input[name^='txtNumeroGiri']").val()) : $('#hNumeroGiri').val($('#hNumeroGiri').val() + '@' + $(this).find("input[name^='txtNumeroGiri']").val());
            index == 0 ? $('#hStatoGiri').val($(this).find("select[name^='cmbStatoGiri']").val()) : $('#hStatoGiri').val($('#hStatoGiri').val() + '@' + $(this).find("select[name^='cmbStatoGiri']").val());
            index == 0 ? $('#hDoveGiri').val($(this).find("select[name^='cmbDoveGiri']").val()) : $('#hDoveGiri').val($('#hDoveGiri').val() + '@' + $(this).find("select[name^='cmbDoveGiri']").val());
        });

        // Salva i punti del grafico nei campi nascosti;
        $('#hOra').val(arrOra.join("|"));//alert("hOra\n" + $('#hOra').val());
        $('#hDilatazione').val(arrDilatazione.join("|"));//alert("hDilatazione\n" + $('#hDilatazione').val());
        $('#hDiscesa').val(arrPresentazione.join("|"));//alert("hDiscesa\n" + $('#hDilatazione').val());

        // Salva il numero di figli
        $('#hNumeroFigli').val(hNumeroFigli);

        NS_FUNCTIONS.records();
    },
    stampaPartogrammaParto: function() {
        NS_FUNCTIONS.print('PARTOGRAMMA_PARTO', 'S');
    },
    visualizzaGrafico: function() {
        //TEST
        //var json = "{%22title%22:%22Partogramma%22,%22time%22:0.0,%22items%22:[{%22name%22:%22Presentazione%22,%22items%22:{%220;1%22:%22%22,%220.5;1%22:%22%22,%221;2%22:%22%22,%222;4%22:%22%22,%226;8%22:%22%22}},{%22name%22:%22Dilatazione%22,%22items%22:{%220;9%22:%22%22,%220.5;7%22:%22%22,%222.5;2.5%22:%22%22,%224;1%22:%22%22}}]}";

        var jsonSeries = [];
        var series = []; // Le serie devono essere plottate rispetto ai reciproci assi, quindi inverto l'ordine.
        series[1] = {name: "Dilatazione", data: arrDilatazione};
        series[0] = {name: "Presentazione", data: arrPresentazione};

        for (var k = 0; k < series.length; k++) {
            var name = series[k].name;
            var items = {};

            for (var i = 0; i < series[k].data.length; i++) {
                var x, y;
                x = i;
                y = parseFloat(series[k].data[i]);
                if (!isNaN(x) && !isNaN(y)) {
                    items[(x / 2) + ";" + y] = (arrOra[i] == '--:--' ? '' : String(arrOra[i])); // Ora rilevazione
                }
            }

            jsonSeries.push({
                "name": name,
                "items": items
            });
        }
        var title = 'Partogramma'; //$('#txtDataAtt').val() + '%20' + $('#txtOraAtt').val();
        var width = 650;
        var height = 650;

        // Reperisce l'ora di arrivo (ignora il passaggio all'ora legale)
        var today = new Date();
        today = new Date(today.getFullYear(), 0, 1); // 1 gennaio
        var time = $('#txtOraAtt').val().match(/0*(\d+)[\:\.\,]0*(\d+)/i);

        // Calcola l'ora di arrivo (in minuti) troncata all'inizio della mezz'ora appena trascorsa
        var decimalTime = PARTOGRAMMA_PARTO.roundDecimalTime(time != null ? parseInt(time[1], 10) + parseInt(time[2], 10) / 60 : 0);

        var jsonObject = {"title": title, "layout": "PARTOGRAMMA_PARTO", "time": decimalTime, "items": jsonSeries};
        //alert(JSON.stringify(jsonObject));
        
        var url = 'Charts?width=' + width + '&height=' + height + '&test=on&json=' + JSON.stringify(jsonObject);
        window.open(url, '_blank', 'width=' + (width + 40) + ',height=' + (height + 40) + ',status=yes,scrollbars=no,resizable=no,titlebar=no,location=no');
        //window.showModalDialog(url,'Titolo',"dialogHeight:"+height+"px;dialogWidth:"+width+"px;scroll:yes");
    },
    getFasciaOraria: function(date, minutes) {
        date.setHours(
                0, /* Hours*/
                minutes, /* Minutes */
                0, /* Seconds */
                0			/* Milliseconds */
                );
        var hh = ("00" + date.getHours()).slice(-2);
        var mm = ("00" + date.getMinutes()).slice(-2);
        return {"hh": hh, "mm": mm};
    },
    roundDecimalTime: function(trueDecimalTime) {
        if (trueDecimalTime >= 0)
            return Math.floor(trueDecimalTime * 2) / 2;
        return -1;
    },
    tableDilatazioneOra: function(modo, reset) {

        function thIntestazione(className, idName, index) {
            return "<TD STATO_CAMPO='E' colspan='2' class='classTdField' style='text-align:center;font-weight:bold;background-color:#DAF5FE'><LABEL>" + (index + 1) + "</LABEL></TD>";
        }

        function tdOraRilevamento(className, idName, date, minutes, i, index, value) {
            if (minutes >= 0) {
                var ret = PARTOGRAMMA_PARTO.getFasciaOraria(date, minutes + index * 30);
                return "<TD STATO_CAMPO='E' class='classTdField' style='text-align:center'><SPAN id='" + idName + "" + i + "' name='" + idName + "" + i + "'>" + ret.hh + ":" + ret.mm + "</SPAN></TD>";
            }
            return "<TD STATO_CAMPO='E' class='classTdField' style='text-align:center'><SPAN id='" + idName + "" + i + "' name='" + idName + "" + i + "'>" + value + "</SPAN></TD>";

//            if (minutes >= 0) {
//                var ret = PARTOGRAMMA_PARTO.getFasciaOraria(date, minutes + i * 30);
//                return "<TD STATO_CAMPO='E' class='classTdField' style='text-align:center'><SPAN id='" + idName + "' name='" + idName + "'>" + ret.hh + ":" + ret.mm + "</SPAN></TD>";
//            }
//            return "<TD STATO_CAMPO='E' class='classTdField' style='text-align:center'><SPAN id='" + idName + "' name='" + idName + "'>--:--</SPAN></TD>";
        }

        function tdDilatazioneOraInput(className, idName, index, value) {
            return "<TD STATO_CAMPO='E' class='classTdField' style=''><INPUT class='" + className + "' id='" + idName + "" + index + "' STATO_CAMPO='E' name='" + idName + "" + index + "' type='text' style='width:100%;' value='" + value + "' /></TD>";
        }

        function tdRowLabel(className, width, labelTitle, labelNameID) {
            return "<TD STATO_CAMPO='E' class='classTdLabel " + className + "' style='width:" + width + "%;background-color:#DAF5FE'><LABEL title='" + labelTitle + "' name='" + labelNameID + "' id='" + labelNameID + "'>" + labelTitle + "</LABEL></TD>";
        }

        var table = "<TABLE id='tableDilatazioneOra' style='border:0px solid #000000' width='100%'>";

        // Reperisce l'ora di arrivo (ignora il passaggio all'ora legale)
        var today = new Date();
        today = new Date(today.getFullYear(), 0, 1); // 1 gennaio
        var time = $('#txtOraAtt').val().match(/0*(\d+)[\:\.\,]0*(\d+)/i);

        // Calcola l'ora di arrivo (in minuti) troncata all'inizio della mezz'ora appena trascorsa
        var minutes = 60 * PARTOGRAMMA_PARTO.roundDecimalTime(time != null ? parseInt(time[1], 10) + parseInt(time[2], 10) / 60 : -1);
        
        // Ricalcola i valori delle ore rilevamento
        if (reset) {
        	if (minutes >= 0) {
        		for (var i in arrOra) {
                    var ret = PARTOGRAMMA_PARTO.getFasciaOraria(today, minutes + i * 30);
                    arrOra[i] = ret.hh+':'+ret.mm;
        		}
        	} else {
        		for (var i in arrOra) {
        			arrOra[i] = '--:--';
        		}
        	}
        }
        
        table += "<TR><TH></TH>";
        for (var i = 0; i < numColonne / 2; i++) {
            table += thIntestazione('Intestazione' + i, 'H', i + hPosizioneGrafico * (numColonne / 2));
        }
        table += "<TR>" + tdRowLabel('Ora', 13, 'Ora', 'lblOra');
        for (var i = 0; i < numColonne; i++) {
            var value = '--:--';
            var index = i + hPosizioneGrafico * numColonne;
            var min = minutes;
            if (typeof arrOra[index] === 'string' && arrOra[index].match(/0*(\d+)[\:\.\,]0*(\d+)/i)) {
                value = arrOra[index];
                min = -1;
            } else {
                arrOra[index] = value;
            }
            // tdOraRilevamento(className, idName, date, minutes, i, value)
            table += tdOraRilevamento('OraRilevamento' + i, 'Rilevamento', today, min, i, i + hPosizioneGrafico * numColonne, value);          
        }
        table += "</TR><TR>" + tdRowLabel('DilatazioneCervice', 13, 'Dilatazione Cervice (cm)', 'lblDilatazioneCerviceInt');
        for (var i = 0; i < numColonne; i++) {
            var value = '';
            var index = i + hPosizioneGrafico * numColonne;
            if (typeof arrDilatazione[index] === 'undefined') {
                arrDilatazione[index] = value;
            } else {
                value = arrDilatazione[index];
            }
            table += tdDilatazioneOraInput('Dilatazione' + i, '_Dilatazione', i, value);
        }
        table += "</TR><TR>" + tdRowLabel('Presentazione', 13, 'Presentazione (cm)', 'lblPresentazione');
        for (var i = 0; i < numColonne; i++) {
            var value = '';
            var index = i + hPosizioneGrafico * numColonne;
            if (typeof arrPresentazione[index] === 'undefined') {
                arrPresentazione[index] = value;
            } else {
                value = arrPresentazione[index];
            }
            table += tdDilatazioneOraInput('Presentazione' + i, '_Presentazione', i, value);
        }
        // ridefinisce e rende visibile il campo nascosto hNoteGrafico
        var hNoteGrafico = $('#hNoteGrafico').val();
        $('#hNoteGrafico').remove();
        table += "</TR><TR>";
        table += "<TD colspan=\"1\" style=\"text-align:left;padding:5px\"><span class=\"pulsante\" style=\"float:none\"><a href=\"javascript:void(0)\" title=\"Visualizza le 12 ore precedenti\" onclick=\"browseChart(-1)\" style=\"font-size:12px; text-decoration:none;\">&lt;&lt;</a></span></TD>";
        table += "<TD colspan=\"" + (numColonne - 3) + "\" style=\"text-align:center;padding:5px\"><span class=\"pulsante\" style=\"float:none;white-space:nowrap\"><a id=\"visualizzaGrafico\" href=\"javascript:void(0)\" onclick=\"showChart()\" style=\"font-size:12px; text-decoration:none;\">Visualizza grafico</a></span></TD>";
        table += "<TD colspan=\"3\" style=\"text-align:right;padding:5px\"><span class=\"pulsante\" style=\"float:none\"><a href=\"javascript:void(0)\" title=\"Visualizza le 12 ore successive\" onclick=\"browseChart(+1)\" style=\"font-size:12px; text-decoration:none;\">&gt;&gt;</a></span></TD>";
        table += "</TR><TR>" + tdRowLabel('NoteGrafico', 13, 'Note', 'lblNoteGrafico');
        table += "<TD class='classTdField' colspan='100'><TEXTAREA id='hNoteGrafico' name='hNoteGrafico' stato_campo='E' class='expand' style='width:100%'>"+hNoteGrafico+"</TEXTAREA></TD>";
        table += "</TR></TABLE>";

        switch (modo) {
            case 'APPEND':
                jQuery("#tableDCOA").remove();
                jQuery("#divPartogramma").append(table);
                break;
            case 'UPDATE':
                var parent = jQuery('#tableDilatazioneOra').parent();
                jQuery('#tableDilatazioneOra').remove();
                parent.append(table);
                break;
        }

        if (arrDilatazione.length == arrPresentazione.length && arrDilatazione.length <= numColonne * maxPosizioniGrafico && arrDilatazione.length >= numColonne) {
            //alert(hPosizioneGrafico = arrDilatazione.length/numColonne -1); 
        } else {
            throw new Error('Si è verificato un errore durante l\'inizializzazione della tabella');
        }

        // Controllo obbligatorietà valore numerico
        $('[id^=_Dilatazione], [id^=_Presentazione]').each(function() {
            $(this).keydown(function(e) {
                // Consenti: backspace, delete, tab, escape, enter, virgola, punto e meno
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 109, 110, 188, 189, 190]) !== -1 ||
                        // Consenti: Ctrl+A
                                (e.keyCode == 65 && e.ctrlKey === true) ||
                                // Consenti: home, end, left, right
                                        (e.keyCode >= 35 && e.keyCode <= 39)) {
                            return;
                        }
                        // Garantisce che sia stato premuto una cifra e termina il keypress
                        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                            e.preventDefault();
                        }
                    });
        });
        
        // Grafica pulsanti per la modifica dell'ora rilevamento
        $('span[id^=Rilevamento]').css({'cursor': 'pointer'});
        $('span[id^=Rilevamento]').parent().hover(function() {
            $(this).css("background-color", "#0099FF");
        }, function() {
            $(this).css("background-color", "#F2FEFF");
        });
        
        // Popup modifica orario
        $("TABLE#tableDilatazioneOra SPAN[name^='Rilevamento']").each(function(i) {
            $(this).click(function() {
                function getHour() {
                    var today = new Date();
                    var hours = today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
                    var minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
                    
                    return hours + ":" + minutes;
                }
                
                function setHour(old) {
                	if ($('#txtOraAtt').val() == '') {
                		$('#txtOraAtt').focus();
                		var now = new Date();
                		var hh = ('0'+now.getHours()).slice(-2);
                		var mm = ('0'+now.getMinutes()).slice(-2);
                		$('#txtOraAtt').val(hh+':'+mm);
                		return '--:--';
                	}
                    var hour = prompt("Inserisci l'ora", old);
                    if (hour == null) return old;
                        
                    var oldTime = old.match(/^\s*([01]?\d|2[0-3])[:\.\, ]?([0-5]\d)\s*$/);
                    var newTime = hour.match(/^\s*([01]?\d|2[0-3])[:\.\, ]?([0-5]\d)\s*$/);
                    
                    if (newTime == null) {
                        alert("FORMATO ORA ERRATO! Prego ricontrollare.");
                        return old;
                    }
                    
                    var decimalNewTime = PARTOGRAMMA_PARTO.roundDecimalTime(newTime != null ? parseInt(newTime[1], 10) + parseInt(newTime[2], 10) / 60 : 0);
                    var decimalOldTime = PARTOGRAMMA_PARTO.roundDecimalTime(oldTime != null ? parseInt(oldTime[1], 10) + parseInt(oldTime[2], 10) / 60 : 0);
                    
                    var hStart = Math.floor(decimalOldTime);
                    var mStart = (decimalOldTime - hStart) * 60;
                    
                    var hEnd = Math.floor(decimalOldTime + 0.4833);
                    var mEnd = Math.ceil((decimalOldTime + 0.4833 - hEnd) * 60);
                    
                    if (decimalNewTime == decimalOldTime) {
                        return newTime[1]+':'+newTime[2];
                    } else {
                        alert("Inserire l'ora nell'intervallo tra le " + ("0" + hStart).slice(-2) + ":" + ("0" + mStart).slice(-2) + " e le " + ("0" + hEnd).slice(-2) + ":" + ("0" + mEnd).slice(-2));
                        return old;
                    }
                }

                var old = $(this).html();
                
                $(this).html(old == '--:--' ? setHour(getHour(), i): setHour(old, i));
                arrOra[hPosizioneGrafico * numColonne + i] = $(this).html();
            });  
        });

        // Controllo input dilatazione
        $('[id^=_Dilatazione]').each(function() {
            $(this).blur(function(event) {
                if ($(this).val() != '') {
                    try {
                        var number = PARTOGRAMMA_PARTO.controllaDilatazione(parseFloat($(this).val().replace(',', '.')));
                        $(this).val(number);
                    } catch (e) {
                        alert(e.message);
                        $(this).focus();
                    }
                }
                var i = parseInt($(this).attr("id").replace(/^[^\d]*([\d]+)[\s\S]*$/, "$1"), 10);
                arrDilatazione[hPosizioneGrafico * numColonne + i] = $(this).val();
            });
        });

        // Controllo input presentazione
        $('[id^=_Presentazione]').each(function() {
            $(this).blur(function(event) {
                if ($(this).val() != '') {
                    try {
                        var number = PARTOGRAMMA_PARTO.controllaPresentazione(parseFloat($(this).val().replace(',', '.')));
                        $(this).val(number);
                    } catch (e) {
                        alert(e.message);
                        $(this).focus();
                    }
                }
                var i = parseInt($(this).attr("id").replace(/^[^\d]*([\d]+)[\s\S]*$/, "$1"), 10);
                arrPresentazione[hPosizioneGrafico * numColonne + i] = $(this).val();
            });
        });
    },
    creaIntestazioneFigli: function() {
        $('#lblDivPrecedenti>legend').append('<LABEL id=lblAggiungi style="BACKGROUND:#E8E6E7;margin-left:10px; cursor:hand;">Aggiungi</LABEL>');
        $('#lblDivPrecedenti>legend').append('<LABEL id=lblElimina style="BACKGROUND:#E8E6E7;margin-left:10px; cursor:hand;">Rimuovi</LABEL>');
        if (!WindowCartella.ModalitaCartella.isReadonly(document)) {
            $("#lblAggiungi").click(function() {
                PARTOGRAMMA_PARTO.creaDivFigli(hNumeroFigli);
                hNumeroFigli++;
            });
            $("#lblElimina").click(function() {
                if (hNumeroFigli > 1) {
                    PARTOGRAMMA_PARTO.eliminaUltimoDivFiglio();
                    hNumeroFigli--;
                }
            });
        }
    },
    enableInputGiri: function(nFigli) {
        //alert("enableInputGiri");
        $("table[id='tabellaFiglio_" + nFigli + "']").find('#txtNumeroGiri_' + nFigli).removeAttr('disabled');
        $("table[id='tabellaFiglio_" + nFigli + "']").find('select[name="cmbStatoGiri_' + nFigli + '"]').removeAttr('disabled');
        $("table[id='tabellaFiglio_" + nFigli + "']").find('select[name="cmbDoveGiri_' + nFigli  + '"]').removeAttr('disabled');
    },
    disableInputGiri: function(nFigli) {
        //alert("disableInputGiri");
        $("table[id='tabellaFiglio_" + nFigli + "']").find('#txtNumeroGiri_' + nFigli).attr('disabled', 'disabled');
        $("table[id='tabellaFiglio_" + nFigli + "']").find('select[name="cmbStatoGiri_' + nFigli + '"]').attr('disabled', 'disabled');
        $("table[id='tabellaFiglio_" + nFigli + "']").find('select[name="cmbDoveGiri_' + nFigli  + '"]').attr('disabled', 'disabled');
    },    
    creaDivFigli: function(index) {
        var nFigli = index + 1;
        var div = $("<div></div>").attr({id: "divFiglio_" + nFigli});
        var tbl = $('<table></table>').attr({id: "tabellaFiglio_" + nFigli, width: "100%"});
        var row1 = $('<tr></tr>').appendTo(tbl);

        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblPartoN', nFigli, 'Parto n')).appendTo(row1);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaInput('txtPartoN', nFigli, typeof (index) != 'number' ? null : hPartoN[index])).appendTo(row1);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblPartoData', nFigli, 'Data')).appendTo(row1);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaInputDate('txtPartoData', nFigli, typeof (index) != 'number' ? "" : hDataParto[index])).appendTo(row1);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblOraParto', nFigli, 'Ora parto')).appendTo(row1);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaInput('txtOraParto', nFigli, typeof (index) != 'number' ? null : hOraParto[index])).appendTo(row1);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblDurata', nFigli, 'Durata ore')).appendTo(row1);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaInput('txtDurata', nFigli, typeof (index) != 'number' ? null : hDurataParto[index])).appendTo(row1);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblSesso', nFigli, 'Sesso')).appendTo(row1);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaSelect('cmbSesso', nFigli, typeof (index) != 'number' ? null : hSesso[index])).appendTo(row1);


        var row15 = $('<tr></tr>').appendTo(tbl);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblPesoNeo', nFigli, 'Peso neonato gr.')).appendTo(row15);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaInput('txtPesoNeo', nFigli, typeof (index) != 'number' ? null : hPesoNeo[index])).appendTo(row15);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblApgar1', nFigli, 'APGAR1')).appendTo(row15);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaInput('txtApgar1', nFigli, typeof (index) != 'number' ? null : hApgar1[index])).appendTo(row15);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblApgar5', nFigli, 'APGAR5')).appendTo(row15);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaInput('txtApgar5', nFigli, typeof (index) != 'number' ? null : hApgar5[index])).appendTo(row15);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblFeto', nFigli, 'Feto nato')).appendTo(row15);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaSelect('cmbFeto', nFigli, typeof (index) != 'number' ? null : hFeto[index])).appendTo(row15);


        var row2 = $('<tr></tr>').appendTo(tbl);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblNoteFiglio', nFigli, 'Note')).appendTo(row2);
        $("<td colspan='9'></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaTextArea('txtNoteFiglio', nFigli, typeof (index) != 'number' ? null : hNoteFiglio[index])).appendTo(row2);

        var row3 = $('<tr></tr>').appendTo(tbl);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblPresentazione', nFigli, 'Presentazione')).appendTo(row3);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaSelect('cmbPresentazione', nFigli, typeof (index) != 'number' ? null : hPresentazione[index])).appendTo(row3);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblPosizione', nFigli, 'Posizione')).appendTo(row3);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaSelect('cmbPosizione', nFigli, typeof (index) != 'number' ? null : hPosizione[index])).appendTo(row3);

        var row4 = $('<tr></tr>').appendTo(tbl);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblSecondamento', nFigli, 'Secondamento')).appendTo(row4);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaSelect('cmbSecondamento', nFigli, typeof (index) != 'number' ? null : hSecondamento[index])).appendTo(row4);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblDopoMin', nFigli, 'Dopo minuti')).appendTo(row4);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaInput('cmbDopoMin', nFigli, typeof (index) != 'number' ? null : hMinuti[index])).appendTo(row4);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblPlacentaDia', nFigli, 'Placenta diametro cm.')).appendTo(row4);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaInput('txtPlacentaDia', nFigli, typeof (index) != 'number' ? null : hPlacenta[index])).appendTo(row4);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblPeso', nFigli, 'Peso gr.')).appendTo(row4);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaInput('txtPeso', nFigli, typeof (index) != 'number' ? null : hPeso[index])).appendTo(row4);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblMembrane', nFigli, 'Membrane')).appendTo(row4);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaSelect('cmbMembrane', nFigli, typeof (index) != 'number' ? null : hMembrane[index])).appendTo(row4);

        var row5 = $('<tr></tr>').appendTo(tbl);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblFunicolo', nFigli, 'Inserzione funicolo')).appendTo(row5);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaSelect('cmbFunicolo', nFigli, typeof (index) != 'number' ? null : hInserzione[index])).appendTo(row5);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblFunicolo', nFigli, 'Funicolo cm.')).appendTo(row5);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaInput('txtFunicolo', nFigli, typeof (index) != 'number' ? null : hFunicolo[index])).appendTo(row5);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblVasi', nFigli, 'Vasi')).appendTo(row5);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaInput('txtVasi', nFigli, typeof (index) != 'number' ? null : hVasi[index])).appendTo(row5);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblNodiFunicolo', nFigli, 'Nodi di funicolo')).appendTo(row5);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaSelect('cmbNodiFunicolo', nFigli, typeof (index) != 'number' ? null : hNodiFunicolo[index])).appendTo(row5);

        var row6 = $('<tr></tr>').appendTo(tbl);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblGiri', nFigli, 'Giri')).appendTo(row6);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaSelect('cmbGiri', nFigli, typeof (index) != 'number' ? null : hGiri[index])).appendTo(row6);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdLabel').append(PARTOGRAMMA_PARTO.creaLabel('lblNumeroGiri', nFigli, 'Numero giri')).appendTo(row6);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaInput('txtNumeroGiri', nFigli, typeof (index) != 'number' ? null : hNumeroGiri[index])).appendTo(row6);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaSelect('cmbStatoGiri', nFigli, typeof (index) != 'number' ? null : hStatoGiri[index])).appendTo(row6);
        $("<td></td>").attr('STATO_CAMPO', 'E').attr('class', 'classTdField').append(PARTOGRAMMA_PARTO.creaSelect('cmbDoveGiri', nFigli, typeof (index) != 'number' ? null : hDoveGiri[index])).appendTo(row6);

        tbl.appendTo(div);

        $("#divPrecedenti").append($("<fieldset id='fieldsetFiglio_" + nFigli + "'></fieldset>").append($("<legend>Figlio " + nFigli + "</legend>")).append(div));

        $("table[id='tabellaFiglio_" + nFigli + "']").find("select[name='cmbGiri_" + nFigli + "']").attr('id', 'cmbGiri_' + nFigli);
        $("table[id='tabellaFiglio_" + nFigli + "']").find("select[name='cmbStatoGiri_" + nFigli + "']").attr('id', 'cmbStatoGiri_' + nFigli);
        $("table[id='tabellaFiglio_" + nFigli + "']").find("select[name='cmbDoveGiri_" + nFigli + "']").attr('id', 'cmbDoveGiri_' + nFigli);
        NS_FUNCTIONS.enableDisable($("table[id='tabellaFiglio_" + nFigli + "']").find("select[name='cmbGiri_" + nFigli + "']"), ['0'], ['txtNumeroGiri_' + nFigli, 'cmbStatoGiri_' + nFigli, 'cmbDoveGiri_' + nFigli]);
        $("table[id='tabellaFiglio_" + nFigli + "']").find("select[name='cmbGiri_" + nFigli + "']").change(function() {
            //$(this).val() != '' && $(this).val() == 0 ? PARTOGRAMMA_PARTO.enableInputGiri(nFigli) : PARTOGRAMMA_PARTO.disableInputGiri(nFigli);
        	NS_FUNCTIONS.enableDisable($("table[id='tabellaFiglio_" + nFigli + "']").find("select[name='cmbGiri_" + nFigli + "']"), ['0'], ['txtNumeroGiri_' + nFigli, 'cmbStatoGiri_' + nFigli, 'cmbDoveGiri_' + nFigli], true);
        });
        
        NS_FUNCTIONS.controlloData('txtPartoData_' + nFigli);
        NS_FUNCTIONS.setDatepicker('txtPartoData_' + nFigli);
        $("#txtOraParto_" + nFigli).blur(function() {
            oraControl_onblur(document.getElementById('txtOraParto_' + nFigli));
        });
        $("#txtOraParto_" + nFigli).keyup(function() {
            oraControl_onkeyup(document.getElementById('txtOraParto_' + nFigli));
        });

    },
    eliminaUltimoDivFiglio: function() {
        $("#fieldsetFiglio_" + hNumeroFigli).remove();
    },
    creaLabel: function(labelNameID, index, labelTitle) {
        return "<LABEL title='" + labelTitle + "' name='" + labelNameID + "_" + index + "' id='" + labelNameID + "_" + index + "'>" + labelTitle + "</LABEL>";
    },
    creaInput: function(idName, index, value) {
        var str = "<INPUT  id='" + idName + "_" + index + "' STATO_CAMPO='E' name='" + idName + "_" + index + "'";
        if (value != undefined) {
            str += " value='" + value + "' ";
        }
        str += "type='text' ></INPUT>";
        return str;
    },
    creaInputDate: function(idName, index, value) {
        str = NS_FUNCTIONS.input.date(idName + "_" + index, value);
        return str;
    },
    creaTextArea: function(idName, index, value) {
        var str = "<TEXTAREA id='" + idName + "_" + index + "' class='expand' style='width:100%;' name='" + idName + "_" + index + "' STATO_CAMPO='E'>";
        if (value != undefined) {
            str += value;
        }
        str += "</TEXTAREA>";
        return str;
    },
    creaSelect: function(idName, index, value) {

        var str = "<SELECT id='" + idName + "_" + index + "' STATO_CAMPO='E' name='" + idName + "_" + index + "'><OPTION selected value=''></OPTION>";
        pBinds = new Array();
        pBinds.push('PARTOGRAMMA_PARTO');
        pBinds.push(idName);
        var rs = WindowCartella.executeQuery("ostetricia.xml", "caricaListBox", pBinds);
        while (rs.next()) {
            str += "<OPTION ";
            if (rs.getString("CODICE") == value) {
                str += " selected ";
            }
            str += " value='" + rs.getString("CODICE") + "'>" + rs.getString("DESCRIZIONE") + "</OPTION>";
        }
        str += '</SELECT>';
        return str;
    }
};

function browseChart(index) {
    index = typeof index === 'number' ? index : 1;
    index = index >= 0 ? 1 : -1;
    from_in = (typeof from_in === 'string') ? from_in.toLowerCase() : '';
    hPosizioneGrafico = (maxPosizioniGrafico + hPosizioneGrafico + index) % maxPosizioniGrafico;
    try {
        PARTOGRAMMA_PARTO.tableDilatazioneOra('UPDATE');
    } catch (e) {
        alert(e.message);
    }
}

function showChart() {
    PARTOGRAMMA_PARTO.visualizzaGrafico();
}
