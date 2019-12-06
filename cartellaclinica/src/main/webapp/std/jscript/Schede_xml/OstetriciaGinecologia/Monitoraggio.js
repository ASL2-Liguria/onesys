var WindowCartella = null;

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
        NS_MONITORAGGIO.init();
        NS_MONITORAGGIO.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }

    if (WindowCartella.ModalitaCartella.isReadonly(document)) {
        $("INPUT").attr('disabled', 'disabled');
        NS_FUNCTIONS.hideRecords('lblregistra');
        $("#lblregistra").parent().parent().hide();
        $("td[class=classTdLabelLink]").attr('disabled', 'disabled');
    }
});

var NS_MONITORAGGIO = {
    init: function() {
        window.name = 'NS_MONITORAGGIO';

        var lista = ['Monitoraggio'];
        attivaTab(lista, 1);
        var iden_visita = document.EXTERN.IDEN_VISITA.value;

        NS_MONITORAGGIO.tableMonitoraggio('APPEND');

        NS_FUNCTIONS.setDimensioniPagina();
        //NS_FUNCTIONS.hideRecordsPrint('lblregistra', 'lblstampa');
    },
    setEvents: function() {
        jQuery("textarea[class*=expand]").TextAreaExpander();
    },
    registraMonitoraggio: function() {

        $('#hEpoca,#hCtg,#hPa,#hAlb,#hSf,#hVisita,#hOperatore,#hIdenPer,#hData,#hOra').val('');

        $('tr[class=trMonitoraggio]').each(function(index) {
            index == 0 ? $('#hEpoca').val($(this).find('td:eq(1)').find('textarea').text()) : $('#hEpoca').val($('#hEpoca').val() + '@' + $(this).find('td:eq(1)').find('textarea').text());
            index == 0 ? $('#hCtg').val($(this).find('td:eq(2)').find('textarea').text()) : $('#hCtg').val($('#hCtg').val() + '@' + $(this).find('td:eq(2)').find('textarea').text());
            index == 0 ? $('#hPa').val($(this).find('td:eq(3)').find('textarea').text()) : $('#hPa').val($('#hPa').val() + '@' + $(this).find('td:eq(3)').find('textarea').text());
            index == 0 ? $('#hAlb').val($(this).find('td:eq(4)').find('textarea').text()) : $('#hAlb').val($('#hAlb').val() + '@' + $(this).find('td:eq(4)').find('textarea').text());
            index == 0 ? $('#hSf').val($(this).find('td:eq(5)').find('textarea').text()) : $('#hSf').val($('#hSf').val() + '@' + $(this).find('td:eq(5)').find('textarea').text());
            index == 0 ? $('#hVisita').val($(this).find('td:eq(6)').find('textarea').text()) : $('#hVisita').val($('#hVisita').val() + '@' + $(this).find('td:eq(6)').find('textarea').text());
            index == 0 ? $('#hOperatore').val($(this).find('td:eq(7)').find('input').val()) : $('#hOperatore').val($('#hOperatore').val() + '@' + $(this).find('td:eq(7)').find('input').val());
            index == 0 ? $('#hIdenPer').val($(this).find('td:eq(7)').find('input#hIdenPer_' + index).val()) : $('#hIdenPer').val($('#hIdenPer').val() + '@' + $(this).find('td:eq(7)').find('input#hIdenPer_' + index).val());
            index == 0 ? $('#hData').val($(this).find('td:eq(8)').find('input').val()) : $('#hData').val($('#hData').val() + '@' + $(this).find('td:eq(8)').find('input').val());
            index == 0 ? $('#hOra').val($(this).find('td:eq(9)').find('input').val()) : $('#hOra').val($('#hOra').val() + '@' + $(this).find('td:eq(9)').find('input').val());
        });

        NS_FUNCTIONS.records();
    },
    stampaMonitoraggio: function() {
        //alert("stampaMonitoraggio");
        NS_FUNCTIONS.print('MONITORAGGIO', 'S');
    },
    tableMonitoraggio: function(modo) {
        function tdMonitoraggioLink(className, width, labelTitle, labelNameID) {
            return "<TD STATO_CAMPO='E' class='classTdLabelLink " + className + "' style='width:" + width + "%;'><LABEL title='" + labelTitle + "' name='" + labelNameID + "' id='" + labelNameID + "'>" + labelTitle + "</LABEL></TD>";
        }

        function tdMonitoraggioLabel(className, width, labelTitle, labelNameID) {
            return "<TD STATO_CAMPO='E' class='classTdLabel " + className + "' style='width:" + width + "%;'><LABEL title='" + labelTitle + "' name='" + labelNameID + "' id='" + labelNameID + "'>" + labelTitle + "</LABEL></TD>";
        }

        function addRowMonitoraggio(i, pEpoca, pCtg, pPa, pAlb, pSf, pVisita, pOperatore, pIdenPer, pData, pOra) {
            function addTdMonitoraggioLabel(className, labelTitle, labelName, index) {
                return "<TD STATO_CAMPO='E' class='classTdLabel " + className + "' style='border-left:1px solid red; border-bottom:3px solid red;'><LABEL class='" + className + "' title='" + labelTitle + "' name='" + labelName + "_" + index + "' id='" + labelName + "_" + index + "'> X </LABEL></TD>";
            }

            function addTdMonitoraggioTextArea(className, idName, index, value) {
                var str = "<TD STATO_CAMPO='E' class='classTdField' style='border-bottom:3px solid red;'><TEXTAREA id='" + idName + "_" + index + "' class='expand' style='width:100%;' name='" + idName + "_" + index + "' STATO_CAMPO='E'>";
                if (value != undefined) {
                    str += value;
                }
                str += "</TEXTAREA></TD>";
                return str;
            }

            function addTdMonitoraggioInput(className, idName, index, value) {
                var str = "<TD STATO_CAMPO='E' class='classTdField' style='border-bottom:3px solid red;'><INPUT class='" + className + "' id='" + idName + "_" + index + "' STATO_CAMPO='E' name='" + idName + "_" + index + "'";

                if (value != undefined) {
                    str += " value='" + value + "' ";
                }
                str += "type='text' style='width:100%;' ></INPUT></TD>";
                return str;
            }

            function addTdMonitoraggioInputWithHidden(className, idName, index, value, pIdenPer) {
                function addInputHidden(index, pIdenPer) {
                    return "<INPUT type='hidden' id='hIdenPer_" + index + "' name='hIdenPer_" + index + "' value='" + pIdenPer + "'></INPUT>";
                }

                var str = "<TD STATO_CAMPO='E' class='classTdField' style='border-bottom:3px solid red;'><INPUT class='" + className + "' id='" + idName + "_" + index + "' STATO_CAMPO='E' name='" + idName + "_" + index + "'";

                if (value != undefined) {
                    str += " value='" + value + "' ";
                }
                str += "type='text' style='width:100%;' ></INPUT>" + addInputHidden(index, pIdenPer) + "</TD>";
                return str;
            }

            function addTdMonitoraggioInputDate(className, idName, index, value) {
                return "<TD STATO_CAMPO='E' class='classTdField' style='border-bottom:3px solid red;'>" + NS_FUNCTIONS.input.date(idName + "_" + index, value) + "</TD>";
            }

            function removeRowMonitoraggio(index) {
            if (!WindowCartella.ModalitaCartella.isReadonly(document)) {
                $("#trMonitoraggio_" + index).remove();
            }
            }

            function disableAllInput(i) {
                $('#txtEpocaGestazionale_' + i).attr('disabled', true);
                $('#txtCTG_' + i).attr('disabled', true);
                $('#txtPA_' + i).attr('disabled', true);
                $('#txtALB_' + i).attr('disabled', true);
                $('#txtSF_' + i).attr('disabled', true);
                $('#txtVafe_' + i).attr('disabled', true);
                $('#txtDataEvento_' + i).attr('disabled', true);
                $('#txtOraEvento_' + i).attr('disabled', true);
            }

            function setStringEmptyDefalut(variable) {
                return variable === undefined ? '' : variable;
            }

            pEpoca = setStringEmptyDefalut(pEpoca);
            pCtg = setStringEmptyDefalut(pCtg);
            pPa = setStringEmptyDefalut(pPa);
            pAlb = setStringEmptyDefalut(pAlb);
            pSf = setStringEmptyDefalut(pSf);
            pVisita = setStringEmptyDefalut(pVisita);
            pOperatore = setStringEmptyDefalut(pOperatore);
            pIdenPer = setStringEmptyDefalut(pIdenPer);
            pData = setStringEmptyDefalut(pData);
            pOra = setStringEmptyDefalut(pOra);

            var row = "<TR id='trMonitoraggio_" + i + "' class='trMonitoraggio' >" +
                    // Setto un TD LABEL
                    addTdMonitoraggioLabel('butt_elimina', 'Elimina', 'lblEliminaMonitoraggio', i) +
                    // Setto un TD TEXTAREA
                    addTdMonitoraggioTextArea('EpocaGestazionale', 'txtEpocaGestazionale', i, pEpoca) +
                    addTdMonitoraggioTextArea('CTG', 'txtCTG', i, pCtg) +
                    addTdMonitoraggioTextArea('PA', 'txtPA', i, pPa) +
                    addTdMonitoraggioTextArea('ALB', 'txtALB', i, pAlb) +
                    addTdMonitoraggioTextArea('SF', 'txtSF', i, pSf) +
                    addTdMonitoraggioTextArea('Vafe', 'txtVafe', i, pVisita) +
                    // Setto un TD INPUT
                    addTdMonitoraggioInputWithHidden('Operatore', 'txtOperatore', i, pOperatore, pIdenPer) +
                    // Setto un TD DATE
                    addTdMonitoraggioInputDate('DataEvento', 'txtDataEvento', i, pData) +
                    addTdMonitoraggioInput('OraEvento', 'txtOraEvento', i, pOra) +
                    "</TR>";

            $("#tableMonitoraggio").append(row);

            if ($('#txtOperatore_' + i).val() == '') {
                $('#txtOperatore_' + i).val(baseUser.DESCRIPTION);
            }
            $('#txtOperatore_' + i).attr('disabled', true);

//            $("#lblEliminaMonitoraggio_" + i).click(function() {
//                removeRowMonitoraggio(i);
//            }); 

            if ($('#hIdenPer_' + i).val() == '' || $('#hIdenPer_' + i).val() == undefined) {
                $('#hIdenPer_' + i).val(baseUser.IDEN_PER);
                $("#lblEliminaMonitoraggio_" + i).click(function() {
                    removeRowMonitoraggio(i);
                });
            } else {
                $('#hIdenPer_' + i).val() != baseUser.IDEN_PER ? disableAllInput(i) : $("#lblEliminaMonitoraggio_" + i).click(function() {
                    removeRowMonitoraggio(i);
                });
            }

            var actualDate = new Date();
            if ($('#txtDataEvento_' + i).val() == '') {
                $('#txtDataEvento_' + i).val(WindowCartella.clsDate.getData(actualDate, "DD/MM/YYYY"));
            }

            NS_FUNCTIONS.controlloData('txtDataEvento_' + i);
            NS_FUNCTIONS.setDatepicker('txtDataEvento_' + i);

            if ($('#txtOraEvento_' + i).val() == '') {
                $('#txtOraEvento_' + i).val(WindowCartella.clsDate.getOra(actualDate));
            }

            $('#txtOraEvento_' + i).blur(function() {
                oraControl_onblur(document.getElementById('txtOraEvento_' + i));
            });
            $('#txtOraEvento_' + i).keyup(function() {
                oraControl_onkeyup(document.getElementById('txtOraEvento_' + i));
            });
        }

        // Creo la tabella con le colonne di intestazione
        var table = "<TABLE id='tableMonitoraggio' width='100%'><TR id='primariga' height='10px'>" +
                // Setto un TD LINK
                tdMonitoraggioLink('AggiungiMonitoraggio', 8, '<CENTER>Aggiungi</CENTER>', 'lblAggiungiMonitoraggioInt') +
                // Setto un TD LABEL
                tdMonitoraggioLabel('EpocaGestazionale', 12, '<CENTER>Epoca gestazionale</CENTER>', 'lblEpocaGestazionaleInt') +
                tdMonitoraggioLabel('CTG', 8, '<CENTER>CTG</CENTER>', 'lblCTGInt') +
                tdMonitoraggioLabel('PA', 8, '<CENTER>PA</CENTER>', 'lblPAInt') +
                tdMonitoraggioLabel('ALB', 8, '<CENTER>ALB</CENTER>', 'lblALBInt') +
                tdMonitoraggioLabel('SF', 8, '<CENTER>SF</CENTER>', 'lblSF') +
                tdMonitoraggioLabel('Vafe', 16, '<CENTER>Visita, AFI, Flussimetria, ecc</CENTER>', 'lblVafeInt') +
                tdMonitoraggioLabel('Operatore', 16, '<CENTER>Operatore</CENTER>', 'lblOperatoreInt') +
                tdMonitoraggioLabel('DataEvento', 12, '<CENTER>Data Evento</CENTER>', 'lblDataEventoInt') +
                tdMonitoraggioLabel('OraEvento', 8, '<CENTER>Ora Evento</CENTER>', 'lblOraEventoInt') +
                "</TR></TABLE>";

        switch (modo) {
            case 'APPEND':
                $("#tableMonitoraggio").remove();
                $("#divtab1").append(table);
                break;
        }

        //alert("hOperatore: " + $('#hOperatore').val() + "\nhIdenPer: " + $('#hIdenPer').val());

        var hEpoca = $('#hEpoca').val().split('@');
        var hCtg = $('#hCtg').val().split('@');
        var hPa = $('#hPa').val().split('@');
        var hAlb = $('#hAlb').val().split('@');
        var hSf = $('#hSf').val().split('@');
        var hVisita = $('#hVisita').val().split('@');
        var hOperatore = $('#hOperatore').val().split('@');
        var hIdenPer = $('#hIdenPer').val().split('@');
        var hData = $('#hData').val().split('@');
        var hOra = $('#hOra').val().split('@');

        for (i = 0; i < hEpoca.length; i++) {
            addRowMonitoraggio(i, hEpoca[i], hCtg[i], hPa[i], hAlb[i], hSf[i], hVisita[i], hOperatore[i], hIdenPer[i], hData[i], hOra[i]);
        }

        if (WindowCartella.ModalitaCartella.isReadonly(document)) {
            $('#lblAggiungiMonitoraggioInt').attr('disabled', 'disabled');
        } else {
            $("#lblAggiungiMonitoraggioInt").parent().click(function() {
                try {
                    // Aggiungo una riga alla tabella
                    addRowMonitoraggio(i);
                } catch (e) {
                    alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
                }
                i++;
            });
        }
    }
};
