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
        NS_36_SETTIMANA.init();
        NS_36_SETTIMANA.setEvents();
        NS_36_SETTIMANA.tablePatologie('APPEND');
        NS_36_SETTIMANA.CaricaPato();
        NS_36_SETTIMANA.caricaDati();
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


var NS_36_SETTIMANA = {
    editabile: true, // i raccordi sono editabili fino a 30 giorni dalla dimissione del paziente, anche se l'anamnesi è in sola lettura

	salvata: false,
		
    init: function() {
        window.name = '36_SETTIMANA';

        var iden_scheda = parseInt($('form[name=EXTERN] input[name=IDEN_SCHEDA]').val());
        NS_36_SETTIMANA.editabile = !WindowCartella.ModalitaCartella.isReadonly(document);//!(/DIMESSO/gi).test(WindowCartella.getAccesso("CODICE_MODALITA_CARTELLA"));
        NS_36_SETTIMANA.salvata = !isNaN(iden_scheda);
        
        /*attivo il tabulatore*/
        var lista = ['36 Settimana'];
        attivaTab(lista, 1);
        var iden_visita = document.EXTERN.IDEN_VISITA.value;
        var data;
        dataRiferimentoWkInt = document.EXTERN.DATA_ULTIMA_MODIFICA.value;

        /*aggiungo icona testi standard a testarea*/
        jQuery("#txtAbitudini").css({width: '95%', float: 'left'}).parent().append($('<div></div>').addClass('classDivTestiStd').attr("title", "Testi Standard").click(function() {
            NS_36_SETTIMANA.apriTestiStandard('txtAbitudini');
        }));
        jQuery("#txtPatologicaProssima").css({width: '95%', float: 'left'}).parent().append($('<div></div>').addClass('classDivTestiStd').attr("title", "Testi Standard").click(function() {
            NS_36_SETTIMANA.apriTestiStandard('txtPatologicaProssima');
        }));

        /*carico wk interventi e allerte*/
        $('#divAllergie').append('<IFRAME id=frameWkAllerte width=100% height=140px src="' + NS_36_SETTIMANA.getUrlWkAllerte() + '"></IFRAME>');
        $('#divInterventi').append('<IFRAME id=frameWkInterventi width=100% height=140px src="' + NS_36_SETTIMANA.getUrlWkInterventi() + '"></IFRAME>');

        NS_36_SETTIMANA.tablePatologie('APPEND');
        NS_36_SETTIMANA.tableAnamnesiOstetrica('APPEND');
        NS_36_SETTIMANA.tableSchedaEcografica('APPEND');
        NS_36_SETTIMANA.tableDiagnosiPrenatale('APPEND');
        NS_36_SETTIMANA.tableConsulenze('APPEND');
        NS_36_SETTIMANA.tableEsamiAppuntamenti('APPEND');

        NS_FUNCTIONS.controlloData('txtUM');
        NS_FUNCTIONS.controlloData('txtDPP');
        NS_FUNCTIONS.controlloData('txtDPPeco');
        NS_FUNCTIONS.controlloData('txtDataEcoDatazione');
        NS_FUNCTIONS.controlloData('txtDataEcoMorfologica');
        NS_FUNCTIONS.controlloData('txtDataEcoBiometrica');
        NS_FUNCTIONS.controlloData('txtVA');
        NS_FUNCTIONS.controlloData('txtCCT');
        NS_FUNCTIONS.controlloData('txtPM');
        NS_FUNCTIONS.controlloData('txtEpicrisi');
        NS_FUNCTIONS.controlloData('txtData37Settimana');

        NS_FUNCTIONS.moveLeftField({name: 'txtPaptest', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
        $('#txtPaptest').parent().attr('colspan', 20);
        $('#txtPaptest').css('width', '100%');

        NS_FUNCTIONS.setDimensioniPagina();
        //NS_FUNCTIONS.hideRecordsPrint('lblregistra', 'lblstampa');

        $('#txtCognomePadre, #txtNomePadre, #txtProf, #txtLuogoNasc, #txtCittad, #txtRegionePadre').css('text-transform', 'uppercase');
        $('#txtLuogoNasc, #txtProf').css('width', '100%');
        $('#txtRecapito1P').css('width', '100%').before('<label>Recapito:</label>&nbsp;&nbsp;&nbsp;').parent().attr('class', 'classTdLabel');
        $('#txtRecapito2P').css('width', '100%').before('<label>Recapito:</label>&nbsp;&nbsp;&nbsp;').parent().attr('class', 'classTdLabel');
        $('#txtRecapito3P').css('width', '100%').before('<label>Recapito:</label>&nbsp;&nbsp;&nbsp;').parent().attr('class', 'classTdLabel');
        $('#lblTelefonoM').parent().attr('rowspan', '3');
        $('#lblTelefonoP').parent().attr('rowspan', '3');

        $('#lblRischioGravidanza').css('white-space', 'nowrap');
        $('input[name=radRischioGravidanza]').parent().css('white-space', 'nowrap');
        $('#txtRischioGravidanza').parent().css('width', '100%');
    },
    getUrlWkGenerica: function(strWorklistName, sqlQuery, boolForceCheck) {
    	var whereAgg = '';
		var pBinds = new Array(
			WindowCartella.getPaziente("IDEN"),
			WindowCartella.getRicovero("IDEN"),
			WindowCartella.getAccesso("IDEN")
		);
		
		var boolRicoveriPrecedenti = true;
		if (!boolForceCheck && NS_36_SETTIMANA.salvata) {
			// Se l'anamnesi è già stata registrata, assumo che le righe della worklist siano già state importate
			boolRicoveriPrecedenti = false;
		} else {
			var vResp = WindowCartella.executeStatement("anamnesi.xml", sqlQuery, pBinds, 1);
			if(vResp[0]=='KO'){
				alert(vResp[1]);
			}
			// Se non ci sono righe già salvate per il presente ricovero, importo tutti i record attivi del paziente
			var numRighe = Number(vResp[2]);
			boolRicoveriPrecedenti = !isNaN(numRighe) && numRighe > 0 ? false : true;
		}
		
		var strImportaPaziente = '';
		switch (strWorklistName) {
		case 'WK_ALLERTE':
			whereAgg = " AND TIPO IN ('ALLERGIA','INTOLLERANZA','REAZIONE_AVVERSA') AND " + (boolRicoveriPrecedenti ? "(VISUALIZZA_IN_ALTRI_RICOVERI = 'S' AND DELETED='N')" : "(IDEN_RICOVERO = :IDEN_VISITA OR IDEN_VISITA = :IDEN_ACCESSO)");
			strImportaPaziente = "importaAllergieIdenPaziente";
			break;
		case 'WK_INTERVENTI_ANAMNESI':
			whereAgg = " AND (";
			whereAgg+= "(ARRIVATO_DA = 'INTERFACCIA' AND " + (boolRicoveriPrecedenti ? "(VISUALIZZA_IN_ALTRI_RICOVERI = 'S' AND DELETED='N')" : "(IDEN_RICOVERO = :IDEN_VISITA OR IDEN_VISITA = :IDEN_ACCESSO)");
			whereAgg+= " OR ";
			whereAgg+= "(ARRIVATO_DA <> 'INTERFACCIA' AND DATA_INSERIMENTO <= to_date('" + document.EXTERN.DATA_ULTIMA_MODIFICA.value + "', 'yyyyMMddhh24:mi:ss') AND IDEN_RICOVERO <> :IDEN_VISITA AND IDEN_VISITA <> :IDEN_ACCESSO))";
			whereAgg+=")";
			strImportaPaziente = "importaInterventiIdenPaziente";
		default:
		}
		
		if (boolRicoveriPrecedenti) {
			NS_36_SETTIMANA[strImportaPaziente] = isNaN(Number(pBinds[0])) ? null : Number(pBinds[0]);
		} else {
			NS_36_SETTIMANA[strImportaPaziente] = null;
		}
		
    	whereAgg = whereAgg
    		.replace(/(:iden_anag)/gi,    String(pBinds[0]))
    		.replace(/(:iden_visita)/gi,  String(pBinds[1]))
    		.replace(/(:iden_accesso)/gi, String(pBinds[2]));
    	var orderBy = " ORDER BY iden asc";
    	
        var url = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK="+strWorklistName+"&WHERE_WK=" + encodeURIComponent(" where IDEN_ANAG=" + pBinds[0] + whereAgg + orderBy).replace(/([\'\(\)\=])/g, function(match, capture) { return "%"+("0"+capture.charCodeAt(0).toString(16)).slice(-2); } );
        //if (WindowCartella.ModalitaCartella.isReadonly(document)) {
        if (!NS_36_SETTIMANA.editabile) {
            url += "&CONTEXT_MENU="+strWorklistName+"_LETTURA";
        }
        url += "&ILLUMINA=illumina(this.sectionRowIndex)";
        
        //alert(decodeURIComponent(url));
        return url;
    },
    getUrlWkAllerte: function() {
        return NS_36_SETTIMANA.getUrlWkGenerica("WK_ALLERTE", "contaAllerte", true /* esegue sempre il calcolo degli interventi associati a ricoveri precedenti */);
    },
    getUrlWkInterventi: function() {
        return NS_36_SETTIMANA.getUrlWkGenerica("WK_INTERVENTI_ANAMNESI", "contaInterventi", true /* esegue sempre il calcolo degli interventi associati a ricoveri precedenti */);
    },
    setEvents: function() {
        //setto un attributo che verrà controllato dal salvataggio per determinare quali form siano stati modificati
        $('form[name="OSTETRICIA_GINECOLOGIA"]').click(function() {
            $(this).attr("edited", "edited");
        });

        var maxLength = 4000;
        var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
        jQuery('#txtNote,#txtPatologicaProssima,#txtAllergie,#txtNoteRemote,#txtAbitudini,#txtRischioGravidanza').addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
            maxlength(this, maxLength, msg);
        });
        jQuery("textarea[class*=expand]").TextAreaExpander();

        $('#txtStatura').blur(function() {
            var statura = parseInt($(this).val(), 10);
            var peso = parseInt($('#txtPeso').val(), 10);
            statura = isNaN(statura) ? 0 : statura;
            peso = isNaN(peso) ? 0 : peso;
            if (statura > 0 && peso > 0) {
                $(this).val(String(statura));
                $('#txtBMI').val(NS_FUNCTIONS.calculateBMI(peso, statura));
            } else {
                $('#txtBMI').val('');
            }
        });

        $('#txtPeso').blur(function() {
            var statura = parseInt($('#txtStatura').val(), 10);
            var peso = parseInt($(this).val(), 10);
            statura = isNaN(statura) ? 0 : statura;
            peso = isNaN(peso) ? 0 : peso;
            if (statura > 0 && peso > 0) {
                $(this).val(String(peso));
                $('#txtBMI').val(NS_FUNCTIONS.calculateBMI(peso, statura));
            } else {
                $('#txtBMI').val('');
            }
        });

        $('#txtUM').focusout(function() {
            $(this).val() != null && $(this).val() != '' ? $('#txtDPP').val(NS_36_SETTIMANA.setDPP($(this).val())) : $('#txtDPP').val('');
        });

        $('#txtStatura, #txtPeso, #txtStaturaPadre').keydown(NS_FUNCTIONS.controlloNumerico_onkeydown).blur(NS_FUNCTIONS.controlloNumerico_onblur);
        var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
        oDateMask.attach(document.getElementById('txtDataNascitaPadre'));

        $('label[name=lblOperatore37Settimana]').each(function() {
            var element = $(this)[0];
            element.onclick = function() {
                var items = {'inValMedico': 'txtOperatore37Settimana', 'hMed': 'hOperatore37Settimana'};
                launch_scandb_link(this, items);
            };
        });
    },
    apriTestiStandard: function(targetOut) {
        if (_STATO_PAGINA == 'L') {
            return;
        }

        var url = 'servletGenerator?funzione=LETTERA_STANDARD&KEY_LEGAME=SCHEDA_TESTI_STD&TARGET=' + targetOut + '&PROV=' + document.EXTERN.FUNZIONE.value;
        $.fancybox({
            'padding': 3,
            'width': 1024,
            'height': 580,
            'href': url,
            'type': 'iframe'
        });
    },
    registra36Settimana: function() {
        // Controllo rischio gravidanza
        var value = $('input[name=radRischioGravidanza]:radio:checked').val();
        if (typeof value === 'string') {
            var rischio = $('input[name=radRischioGravidanza][value=' + value + ']').next().next().html().toUpperCase();
            if (rischio == 'MEDIO' || rischio == 'ALTO') {
                if ($('#txtRischioGravidanza').val().replace(/^\s+|\s+$/, '') == '') {
                    alert('Attenzione: il campo note è obbligatorio se il rischio di gravidanza non è basso');
                    return;
                }
            }
        }

        $('#hAnamnesiOste').val($('input[name=txtAnamnesiOstetricaGravida]').val() + '@' + $('input[name=txtAnamnesiOstetricaPara]').val() + '@' + $('input[name=txtAnamnesiOstetricaAborti]').val() + '@' + $('input[name=txtAnamnesiOstetricaIVG]').val() + '@' + $('input[name=txtAnamnesiOstetricaFigliViventi]').val());

        $('#hOstetricaAnno,#hOstetricaParto,#hOstetricaSett,#hOstetricaPeso,#hOstetricaSesso,#hOstetricaAllatt').val('');


        $('tr[class=trAnamnesiOstetrica_2]').each(function(index) {

            index == 0 ? $('#hOstetricaAnno').val($(this).find('td:eq(1)').find('input').val()) : $('#hOstetricaAnno').val($('#hOstetricaAnno').val() + '@' + $(this).find('td:eq(1)').find('input').val());
            index == 0 ? $('#hOstetricaParto').val($(this).find('td:eq(2)').find('input').val()) : $('#hOstetricaParto').val($('#hOstetricaParto').val() + '@' + $(this).find('td:eq(2)').find('input').val());
            index == 0 ? $('#hOstetricaSett').val($(this).find('td:eq(3)').find('input').val()) : $('#hOstetricaSett').val($('#hOstetricaSett').val() + '@' + $(this).find('td:eq(3)').find('input').val());
            index == 0 ? $('#hOstetricaPeso').val($(this).find('td:eq(4)').find('input').val()) : $('#hOstetricaPeso').val($('#hOstetricaPeso').val() + '@' + $(this).find('td:eq(4)').find('input').val());
            index == 0 ? $('#hOstetricaSesso').val($(this).find('td:eq(5)').find('input').val()) : $('#hOstetricaSesso').val($('#hOstetricaSesso').val() + '@' + $(this).find('td:eq(5)').find('input').val());
            index == 0 ? $('#hOstetricaAllatt').val($(this).find('td:eq(6)').find('input').val()) : $('#hOstetricaAllatt').val($('#hOstetricaAllatt').val() + '@' + $(this).find('td:eq(6)').find('input').val());

        });

        $('#hConsulenzeTipo,#hConsulenzeTesto').val('');

        $('tr[class=trConsulenze]').each(function(index) {
            index == 0 ? $('#hConsulenzeTipo').val($(this).find('td:eq(1)').find('input').val()) : $('#hConsulenzeTipo').val($('#hConsulenzeTipo').val() + '@' + $(this).find('td:eq(1)').find('input').val());
            index == 0 ? $('#hConsulenzeTesto').val($(this).find('td:eq(2)').find('input').val()) : $('#hConsulenzeTesto').val($('#hConsulenzeTesto').val() + '@' + $(this).find('td:eq(2)').find('input').val());
        });

        // Salvataggio patologie in campo nascosto txtPatologieSelez
        NS_36_SETTIMANA.SalvaPato();

        NS_FUNCTIONS.records();
    },
    setDPP: function(stringDate) {
        return WindowCartella.clsDate.dateAddStr(stringDate, "DD/MM/YYYY", "00:00", "D", "280");
    },
    stampa36Settimana: function() {
        NS_FUNCTIONS.print('36_SETTIMANA', 'S');
    },
    tablePatologie: function(modo) {
        function tdLinkPatologie(className, width, labelTitle, labelNameID) {
            return "<TD STATO_CAMPO='E' class='classTdLabelLink " + className + "' style='width:" + width + "%;'><LABEL title='" + labelTitle + "' name='" + labelNameID + "' id='" + labelNameID + "'>" + labelTitle + "</LABEL></TD>";
        }

        function tdPatologie(className, width, labelTitle, labelNameID) {
            return "<TD STATO_CAMPO='E' class='classTdLabel " + className + "' style='width:" + width + "%;'><LABEL title='" + labelTitle + "' name='" + labelNameID + "' id='" + labelNameID + "'>" + labelTitle + "</LABEL></TD>";
        }

        // tabella patologie
        var table = "<TABLE id='tablePato' width='100%'><TR id='primariga' height='10px'>" +
                tdLinkPatologie('aggiungi', 5, 'Aggiungi Patologia', 'lblAggiungiPato') +
                tdPatologie('PatoIntestaz', 40, 'PATOLOGIA', 'lblPatoIntestaz') +
                tdPatologie('PatoAnnoIntestaz', 5, 'ANNO', 'lblPatoAnnoIntestaz') +
                tdPatologie('PatoNoteIntestaz', 40, 'NOTE', 'lblPatoNoteIntestaz') +
                "</TR></TABLE>";
        //alert(table);

        switch (modo) {
            case 'APPEND':
                jQuery("#tablePato").remove();
                jQuery("#divPatoRemota").append(table);
                break;
        }
        if (WindowCartella.ModalitaCartella.isReadonly(document)) {
            $('#lblAggiungiPato').attr('disabled', 'disabled');
        }
        else {
            jQuery("#lblAggiungiPato").parent().click(function() {
                var url = "servletGenerator?KEY_LEGAME=SCELTA_PATOLOGIE&status=yes fullscreen=yes";
                $.fancybox({
                    'padding': 3,
                    'width': 1024,
                    'height': 580,
                    'href': url,
                    'type': 'iframe',
                    onClosed: function() {
                        $("#txtNoteRemote").focus();
                    }
                });
            });
        }
    },
    aggiungiRigaPato: function(i, valore, testo, anno, nota) {
        //alert('i='+i+' valore='+valore+' testo='+testo);
        riga = "<tr id='tr_" + i + "' valore=" + valore + "  class = 'trPato' >" +
                "<td STATO_CAMPO='E' class='classTdLabel butt_elimina' style='border-left:1px solid red; BORDER-BOTTOM:3PX SOLID RED'><label class='butt_elimina' title='Elimina' name='lblElimina" + i + "' id='lblElimina" + i + "'> X </label></td>" +
                "<td STATO_CAMPO='E' class='classTdLabel patoScelte' style='BORDER-BOTTOM:3PX SOLID RED'><label indice = " + i + " valore='" + valore + "' class='patologieScelte' name='lblPatoScelte" + i + "' id='lblPatoScelte" + i + "'>" + testo + "</label></td>" +
                "<td STATO_CAMPO='E' class='classTdField' style='BORDER-BOTTOM:3PX SOLID RED'><input class='annoPato' id='txtAnno" + i + "' STATO_CAMPO='E' value='" + anno + "' name='txtAnno" + i + "' type='text'></input></td>" +
                "<td STATO_CAMPO='E' class='classTdField' style='BORDER-BOTTOM:3PX SOLID RED'><input class='notePato' id='txtNote" + i + "' STATO_CAMPO='E' value='" + nota + "' name='txtNote" + i + "' type='text'></input></td>" +
                "</tr><TR id='tr_2" + i + "' style='line-height:35px; margin-bottom:200px'></TR>";

        //alert(riga);
        jQuery("#tablePato").append(riga);
        jQuery("#lblElimina" + i).click(function() {
            NS_36_SETTIMANA.eliminaRigaPato(i);
        });
    },
    eliminaRigaPato: function(i) {
        jQuery("#tr_" + i).remove();
        jQuery("#tr_2" + i).remove();
    },
    SalvaPato: function() { // salva le patologie in txtPatologieSelez
        var elenco = "";
        var elencoPato = jQuery(".patologieScelte");
        var elencoAnno = jQuery(".annoPato");
        var elencoNote = jQuery(".notePato");
        var testo = "";
        var valore = "";

        elencoPato.each(function(index) {
            testo = jQuery(this).text();
            valore = jQuery(this).attr("valore");
            //alert(jQuery(this).attr("valore")+"$"+jQuery(this).text() + "$"+jQuery(elencoAnno[index]).val()+"$"+jQuery(elencoNote[index]).val());
            if (elenco != '') {
                elenco += ',';
            }
            elenco += jQuery(this).attr("valore") + "$" + jQuery(this).text().replace(/\,/gi, " ") + "$" + jQuery(elencoAnno[index]).val() + "$" + jQuery(elencoNote[index]).val().replace(/\,/gi, " ");
        });

        jQuery("#txtPatologieSelez").val(elenco);

    },
    CaricaPato: function() { // carica le patologie da txtPatologieSelez
        var elencoPato = jQuery("#txtPatologieSelez").val();
        var aElencoPato = elencoPato.split(",");
        //alert("aElencoPato.length="+aElencoPato.length);
        if (aElencoPato != "") {
            for (var e=0; e < aElencoPato.length; e++) {
                var pato = aElencoPato[e].split("$");
                //alert(pato[0]+" "+pato[1]+" "+pato[2]+" "+pato[3]);
                if (typeof pato[1] == "undefined") {
                    NS_36_SETTIMANA.aggiungiRigaPato(e, "", pato[0], "", "");
                }
                else {
                    NS_36_SETTIMANA.aggiungiRigaPato(e, pato[0], pato[1], pato[2], pato[3]);
                }

            }
            if (WindowCartella.ModalitaCartella.isReadonly(document)) {
                $('LABEL[name^="lblElimina"]').attr('disabled', 'disabled');
                $('INPUT[name^="txtAnno"]').attr('disabled', 'disabled');
                $('INPUT[name^="txtNote"]').attr('disabled', 'disabled');
            }
        }

    },
// #############################################################################################################################################                
    tableAnamnesiOstetrica: function(modo) {
        function tdAnamnesiOstetricaLabel(className, labelTitle, labelName, width) {
            return "<TD STATO_CAMPO='E' class='classTdLabel " + className + "' style='width:" + width + "%;'><LABEL name='" + labelName + "' id='" + labelName + "'>" + labelTitle + "</LABEL></TD>";
        }

        function tdAnamnesiOstetricaInput(inputName, value) {
            return "<TD STATO_CAMPO='E' class='classTdField'><INPUT id='" + inputName + "' name='" + inputName + "' value='" + value + "' STATO_CAMPO='E' style='width:100%'></TD>";
        }

        function tdAnamnesiOstetricaLink(className, labelTitle, labelName, width) {
            return "<TD STATO_CAMPO='E' class='classTdLabelLink " + className + "' style='width:" + width + "%;'><LABEL title='" + labelTitle + "' name='" + labelName + "' id='" + labelName + "'>" + labelTitle + "</LABEL></TD>";
        }

        function addRowAnamnesiOstetrica(i, pAnno, pParto, pSett, pPeso, pSesso, pAllatt) {
            function addTdAnamnesiOstetricaInput(className, idName, index, value) {
                var str = "<TD STATO_CAMPO='E' class='classTdField' style='border-bottom:3px solid red;'><INPUT class='" + className + "' id='" + idName + "_" + index + "' STATO_CAMPO='E' name='" + idName + "_" + index + "'";
                if (value != undefined) {
                    str += " value='" + value + "' ";
                }

                str += "type='text' style='width:100%;' ></INPUT></TD>";
                return str;
            }

            function addTdAnamnesiOstetricaLabel(className, labelTitle, labelName, index) {
                return "<TD STATO_CAMPO='E' class='classTdLabel " + className + "' style='border-left:1px solid red; border-bottom:3px solid red;'><LABEL class='" + className + "' title='" + labelTitle + "' name='" + labelName + "_" + index + "' id='" + labelName + "_" + index + "'> X </LABEL></TD>";
            }

            function removeRowAnamnesiOstetrica(index) {
                $("#trAnamnesiOstetrica_2_" + index).remove();
            }

            var row = "<TR id='trAnamnesiOstetrica_2_" + i + "' class='trAnamnesiOstetrica_2' >" +
                    // Setto un TD LABEL
                    addTdAnamnesiOstetricaLabel('butt_elimina', 'Elimina', 'lblEliminaAnamnesiOstetrica_2', i) +
                    // Setto un TD INPUT
                    addTdAnamnesiOstetricaInput('AnamnesiOstetricaAnno', 'txtAnamnesiOstetricaAnno', i, pAnno) +
                    addTdAnamnesiOstetricaInput('AnamnesiOstetricaParto', 'txtAnamnesiOstetricaParto', i, pParto) +
                    addTdAnamnesiOstetricaInput('AnamnesiOstetricaSettimane', 'txtAnamnesiOstetricaSettimane', i, pSett) +
                    addTdAnamnesiOstetricaInput('AnamnesiOstetricaPeso', 'txtAnamnesiOstetricaPeso', i, pPeso) +
                    addTdAnamnesiOstetricaInput('AnamnesiOstetricaSesso', 'txtAnamnesiOstetricaSesso', i, pSesso) +
                    addTdAnamnesiOstetricaInput('AnamnesiOstetricaAllattamento', 'txtAnamnesiOstetricaAllattamento', i, pAllatt) +
                    "</TR>";
            $("#tableAnamnesiOstetrica_2").append(row);
            $("#lblEliminaAnamnesiOstetrica_2_" + i).click(function() {
                // Rimuovo la riga dalla tabella
                removeRowAnamnesiOstetrica(i);
            });
        }

        var hAnamnesiOste = ($('[name=hAnamnesiOste]').val() != '' ? $('[name=hAnamnesiOste]').val().split('@') : '@@@@'.split('@'));
        // Creo la tabella 1 con le colonne di intestazione
        var table = "<TABLE id='tableAnamnesiOstetrica_1' width='100%'><TR id='primariga' height='10px'>" +
                // Setto un TD LABEL
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaGravida', 'GRAVIDA', 'lblAnamnesiOstetricaGravida', 20) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaPara', 'PARA', 'lblAnamnesiOstetricaPara', 20) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaAborti', 'ABORTI', 'lblAnamnesiOstetricaAborti', 20) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaIVG', 'IVG', 'lblAnamnesiOstetricaIVG', 20) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaFigliViventi', 'FIGLI VIVENTI', 'lblAnamnesiOstetricaFigliViventi', 20) +
                "</TR><TR>" +
                // Setto un TD INPUT
                tdAnamnesiOstetricaInput('txtAnamnesiOstetricaGravida', hAnamnesiOste[0]) +
                tdAnamnesiOstetricaInput('txtAnamnesiOstetricaPara', hAnamnesiOste[1]) +
                tdAnamnesiOstetricaInput('txtAnamnesiOstetricaAborti', hAnamnesiOste[2]) +
                tdAnamnesiOstetricaInput('txtAnamnesiOstetricaIVG', hAnamnesiOste[3]) +
                tdAnamnesiOstetricaInput('txtAnamnesiOstetricaFigliViventi', hAnamnesiOste[4]) +
                "</TR></TABLE><BR/>";

        // Creo la tabella 2 con le colonne di intestazione
        table += "<TABLE id='tableAnamnesiOstetrica_2' width='100%'><TR id='primariga' height='10px'>" +
                // Setto un TD LINK
                tdAnamnesiOstetricaLink('aggiungiInt', 'Aggiungi', 'lblAddAnamnesiOstetricaInt', 5) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaAnnoInt', 'ANNO', 'lblAnamnesiOstetricaAnnoInt', 10) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaPartoInt', 'PARTO', 'lblAnamnesiOstetricaPartoInt', 10) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaSettimaneInt', 'SETTIMANE', 'lblAnamnesiOstetricaSettimaneInt', 10) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaPesoInt', 'PESO', 'lblAnamnesiOstetricaPesoInt', 10) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaSessoInt', 'SESSO', 'lblAnamnesiOstetricaSessoInt', 10) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaAllattamentoInt', 'ALLATTAMENTO', 'lblAnamnesiOstetricaAllattamentoInt', 10) +
                "</TR></TABLE><BR/>";
        //alert(table);





        switch (modo) {
            case 'APPEND':
                $("#tableAnamnesiOstetrica_1").remove();
                $("#tableAnamnesiOstetrica_2").remove();
                $("#divOstetrica").prepend(table);
                break;
        }

        var hOstetricaAllatt = $('#hOstetricaAllatt').val().split('@');
        var hOstetricaAnno = $('#hOstetricaAnno').val().split('@');
        var hOstetricaPeso = $('#hOstetricaPeso').val().split('@');
        var hOstetricaParto = $('#hOstetricaParto').val().split('@');
        var hOstetricaSesso = $('#hOstetricaSesso').val().split('@');
        var hOstetricaSett = $('#hOstetricaSett').val().split('@');

        for (var i=0; i < hOstetricaAnno.length; i++) {
            addRowAnamnesiOstetrica(i, hOstetricaAnno[i], hOstetricaParto[i], hOstetricaSett[i], hOstetricaPeso[i], hOstetricaSesso[i], hOstetricaAllatt[i]);
        }

        if (WindowCartella.ModalitaCartella.isReadonly(document)) {
            $('#lblAddAnamnesiOstetricaInt').attr('disabled', 'disabled');
        }

        $("#lblAddAnamnesiOstetricaInt").parent().click(function() {
            try {
                // Aggiungo una riga alla tabella 2
                addRowAnamnesiOstetrica(i);
            } catch (e) {
                alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
            }
            i++;
        });
    },
// #############################################################################################################################################                          
    tableSchedaEcografica: function(modo) {

        var STATO_CAMPO = 'E';
        var disabled = "";
        var readOnly = "";
        if (WindowCartella.ModalitaCartella.isReadonly(document)) {
            stato_campo = 'L';
            disabled = "disabled";
            readOnly = "readOnly";
        }

        function tdSchedaEcograficaTransparent() {
            return "<TD style='width:25%; background-color:transparent;'></TD>";
        }

        function tdSchedaEcograficaLabel(className, labelTitle, labelName) {
            return "<TD STATO_CAMPO='E' class='classTdLabel " + className + "' style='width:25%;'><LABEL name='" + labelName + "' id='" + labelName + "'>" + labelTitle + "</LABEL></TD>";
        }

        function tdSchedaEcograficaInputDate(inputName) {
            return "<TD STATO_CAMPO='E' class='classTdField'>" + NS_FUNCTIONS.input.date(inputName) + "</TD>";
        }

        function tdSchedaEcograficaInput(inputName) {
            return "<TD STATO_CAMPO='E' class='classTdField'><INPUT id='" + inputName + "' name='" + inputName + "' STATO_CAMPO='E' style='width:100%'></TD>";
        }

        //$("<TR><TD style='font-size: 12px;'><BR/><B>SCHEDA ECOGRAFICA</B></TD></TR>").insertAfter('#divGravidanza table.classDataEntryTable > tbody:last tr:eq(1)');

        // Creo la tabella con le colonne e le righe di intestazione
        var table = "<BR/><B>SCHEDA ECOGRAFICA</B><BR/><TABLE id='tableSchedaEcografica' width='100%'><TR id='primariga' height='10px'>" +
                // Setto un TD trasparent
                tdSchedaEcograficaTransparent() +
                // Setto un TD LABEL
                tdSchedaEcograficaLabel('EcoData', '<CENTER>Eco di datazione</CENTER>', 'lblEcoData') +
                tdSchedaEcograficaLabel('EcoMorfo', '<CENTER>Eco Morfologica</CENTER>', 'lblEcoMorfo') +
                tdSchedaEcograficaLabel('EcoBio', '<CENTER>Eco Biometrica</CENTER>', 'lblEcoBio') +
                "</TR><TR>" +
                tdSchedaEcograficaLabel('Data', '<CENTER>Data</CENTER>', 'lblData') +
                // Setto un TD INPUT DATE
                tdSchedaEcograficaInputDate('txtDataEcoDatazione') +
                tdSchedaEcograficaInputDate('txtDataEcoMorfologica') +
                tdSchedaEcograficaInputDate('txtDataEcoBiometrica') +
                "</TR><TR>" +
                tdSchedaEcograficaLabel('WAMestr', '<CENTER>Epoca di Amenorrea</CENTER>', 'lblWAMestr') +
                // Setto un TD INPUT
                tdSchedaEcograficaInput('txtEAEcoDatazione') +
                tdSchedaEcograficaInput('txtEAEcoMorfologica') +
                tdSchedaEcograficaInput('txtEAEcoBiometrica') +
                "</TR><TR>" +
                tdSchedaEcograficaLabel('CorrEco', '<CENTER>Corrispo Eco</CENTER>', 'lblCorrEco') +
                tdSchedaEcograficaInput('txtCEEcoDatazione') +
                tdSchedaEcograficaInput('txtCEEcoMorfologica') +
                tdSchedaEcograficaInput('txtCEEcoBiometrica') +
                "</TR></TABLE>" +
                "<DIV style=\"padding-top:10px\"><TABLE class=classDataEntryTable><TBODY><TR><TD class=classTdLabel STATO_CAMPO=\"E\"><LABEL id=\"lblCurvaOGTT\" name=\"lblCurvaOGTT\">Curva OGTT</LABEL></TD><TD class=classTdField colSpan=14 STATO_CAMPO=\"E\"><TEXTAREA style=\"WIDTH: 100%\" id=\"txtCurvaOGTT\" name=\"txtCurvaOGTT\" " + readOnly + " STATO_CAMPO=\"" + STATO_CAMPO + "\"></TEXTAREA></TD></TR></TABLE></DIV>";

        switch (modo) {
            case 'APPEND':
                $("#tableSchedaEcografica").remove();
                $(table).insertAfter("#divGravidanza table.classDataEntryTable");
                break;
        }

        NS_FUNCTIONS.setDatepicker('txtDataEcoDatazione');
        NS_FUNCTIONS.setDatepicker('txtDataEcoMorfologica');
        NS_FUNCTIONS.setDatepicker('txtDataEcoBiometrica');

    },
// #############################################################################################################################################              
    tableDiagnosiPrenatale: function(modo) {
        var STATO_CAMPO = 'E';
        var disabled = "";
        var readOnly = "";
        if (WindowCartella.ModalitaCartella.isReadonly(document)) {
            stato_campo = 'L';
            disabled = "disabled";
            readOnly = "readOnly";
        }

        var table;
        table = "<BR/><B>DIAGNOSI PRENATALE</B><DIV id=divDiagnosiPrenatale><TABLE class=classDataEntryTable><TBODY><TR>" +
                tdDiagnosiPrenataleLabel('lblBit', 'Bi-test') +
                tdDiagnosiPrenataleCheck('chkBit') +
                tdDiagnosiPrenataleInput('txtBit', 170) +
                "</TR><TR>" +
                tdDiagnosiPrenataleLabel('lblTri', 'Tri-test') +
                tdDiagnosiPrenataleCheck('chkTri') +
                tdDiagnosiPrenataleInput('txtTri', 170) +
                "</TR><TR>" +
                tdDiagnosiPrenataleLabel('lblAmn', 'Amniocentesi') +
                tdDiagnosiPrenataleCheck('chkAmn') +
                tdDiagnosiPrenataleInput('txtAmn', 170) +
                "</TR><TR>" +
                tdDiagnosiPrenataleLabel('lblVil', 'Villocentesi') +
                tdDiagnosiPrenataleCheck('chkVil') +
                tdDiagnosiPrenataleInput('txtVil', 170) +
                "</TR><TR>" +
                tdDiagnosiPrenataleLabel('lblTgsp', 'Test genetico su sangue periferico') +
                tdDiagnosiPrenataleCheck('chkTgsp') +
                tdDiagnosiPrenataleInput('txtTgsp', 170) +
//    	"</TR><TR>" +
//    	tdDiagnosiPrenataleLabel('lblMammografia', 'Mammografia') +
//    	tdDiagnosiPrenataleCheck('chkMammografia') +
//    	tdDiagnosiPrenataleInput('txtMammografia', 170) +
//    	"</TR><TR>" +
//    	tdDiagnosiPrenataleLabel('lblTestDiGravidanza', 'Test di gravidanza') +
//    	tdDiagnosiPrenataleCheck('chkTestDiGravidanza') +
//    	tdDiagnosiPrenataleInput('txtTestDiGravidanza', 170) +
//    	"</TR><TR>" +
//    	tdDiagnosiPrenataleLabel('lblTrasfusioniPregresse2', 'Trasfusioni pregresse') +
//    	tdDiagnosiPrenataleCheck('chkTrasfusioniPregresse2') +
//    	tdDiagnosiPrenataleInput('txtTrasfusioniPregresse2', 170) +
//    	"</TR><TR>" +
//    	tdDiagnosiPrenataleLabel('lblImmunoprofilassiAntiD', 'Immunoprofilassi anti-D') +
//    	tdDiagnosiPrenataleCheck('chkImmunoprofilassiAntiD') +
//    	tdDiagnosiPrenataleInput('txtImmunoprofilassiAntiD', 170) +
//    	"</TR><TR>" +
                "</TR></TABLE></DIV>";

        switch (modo) {
            case 'APPEND':
                $('#tableConsulenze').remove();
                $('#divGravidanza').append(table);
                break;
        }

        function tdDiagnosiPrenataleLabel(labelName, labelTitle) {
            return "<TD class=classTdLabel STATO_CAMPO=\"" + STATO_CAMPO + "\"><LABEL id=\"" + labelName + "\" name=\"" + labelName + "\">" + labelTitle + "</LABEL></TD>";
        }

        function tdDiagnosiPrenataleCheck(checkName) {
            return "<TD class=classTdField STATO_CAMPO=\"" + STATO_CAMPO + "\"><INPUT " + disabled + " id=\"" + checkName + "\" name=\"" + checkName + "\" value=\"\" type=checkbox STATO_CAMPO=\"" + STATO_CAMPO + "\"></INPUT><LABEL></LABEL></TD>";
        }

        function tdDiagnosiPrenataleInput(inputName, size) {
            return "<TD class=classTdField STATO_CAMPO=\"" + STATO_CAMPO + "\"><INPUT id=\"" + inputName + "\" name=\"" + inputName + "\" " + readOnly + " size=" + size + " STATO_CAMPO=\"" + STATO_CAMPO + "\" length=\"" + size + "\"> </INPUT></TD>";
        }
    },
// #############################################################################################################################################              
    tableConsulenze: function(modo) {
        function tdConsulenzeLink(className, labelTitle, labelName, width) {
            return "<TD STATO_CAMPO='E' class='classTdLabelLink " + className + "' style='width:" + width + "%;'><LABEL title='" + labelTitle + "' name='" + labelName + "' id='" + labelName + "'>" + labelTitle + "</LABEL></TD>";
        }

        function tdConsulenzeLabel(className, labelTitle, labelName, width) {
            return "<TD STATO_CAMPO='E' class='classTdLabel " + className + "' style='width:" + width + "%;'><LABEL name='" + labelName + "' id='" + labelName + "'>" + labelTitle + "</LABEL></TD>";
        }

        function addRowConsulenze(i, pTipo, pTesto) {
            function addTdConsulenzeLabel(className, labelTitle, labelName, index) {
                return "<TD STATO_CAMPO='E' class='classTdLabel " + className + "' style='border-left:1px solid red; border-bottom:3px solid red;'><LABEL class='" + className + "' title='" + labelTitle + "' name='" + labelName + "_" + index + "' id='" + labelName + "_" + index + "'> X </LABEL></TD>";
            }

            function addTdConsulenzeInput(className, idName, index, value) {
                var str = "<TD STATO_CAMPO='E' class='classTdField' style='border-bottom:3px solid red;'><INPUT class='" + className + "' id='" + idName + "_" + index + "' STATO_CAMPO='E' name='" + idName + "_" + index + "'";

                if (value != undefined) {
                    str += " value='" + value + "' ";
                }
                str += "type='text' style='width:100%;' ></INPUT></TD>";
                return str;

            }

            function removeRowConsulenze(index) {
                jQuery("#trConsulenze_" + index).remove();
            }

            var row = "<TR id='trConsulenze_" + i + "' class='trConsulenze' >" +
                    // Setto un TD LABEL
                    addTdConsulenzeLabel('butt_elimina', 'Elimina', 'lblEliminaConsulenze', i) +
                    // Setto un TD INPUT
                    addTdConsulenzeInput('ConsulenzeTipo', 'txtConsulenzeTipo', i, pTipo) +
                    addTdConsulenzeInput('ConsulenzeTesto', 'txtConsulenzeTesto', i, pTesto) +
                    "</TR>";

            $('#tableConsulenze').append(row);
            $('#lblEliminaConsulenze_' + i).click(function() {
                // Rimuovo la riga dalla tabella
                removeRowConsulenze(i);
            });
        }

        // Creo la tabella con le colonne di intestazione
        var table = "<BR/><B>CONSULENZE</B><BR/><TABLE id='tableConsulenze' width='100%'><TR id='primariga' height='10px'>" +
                // Setto un TD LINK
                tdConsulenzeLink('aggiungiInt', 'Aggiungi', 'lblAggiungiConsulenzeInt', 5) +
                // Setto un TD LABEL
                tdConsulenzeLabel('ConsulenzeTipoInt', 'Tipo Consulenza', 'lblConsulenzeTipoInt', 15) +
                tdConsulenzeLabel('ConsulenzeTestoInt', 'Testo Consulenza', 'lblConsulenzeTestoInt', 80) +
                "</TR></TABLE>";

        switch (modo) {
            case 'APPEND':
                $('#tableConsulenze').remove();
                $('#divGravidanza').append(table);
                break;
        }

        var hConsulenzeTipo = $('#hConsulenzeTipo').val().split('@');
        var hConsulenzeTesto = $('#hConsulenzeTesto').val().split('@');

        for (var a=0; a < hConsulenzeTipo.length; a++) {
            addRowConsulenze(a, hConsulenzeTipo[a], hConsulenzeTesto[a]);
        }
        if (WindowCartella.ModalitaCartella.isReadonly(document)) {
            $('#lblAggiungiConsulenzeInt').attr('disabled', 'disabled');
        } else {
            jQuery("#lblAggiungiConsulenzeInt").parent().click(function() {
                try {
                    // Aggiungo una riga alla tabella
                    addRowConsulenze(a);
                } catch (e) {
                    alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
                }
                i++;
            });
        }
    },
// #############################################################################################################################################                            
    tableEsamiAppuntamenti: function(modo) {
        function tableEsamiPreparto() {
            function trEsamiPreparto(tdLabel, tdIDradio, tdIDtxt) {
                return "<TR><TD class=classTdLabel STATO_CAMPO='E' style='width:30%; font-size:12px;'><LABEL>" + tdLabel + "</LABEL></TD><TD class='classTdField' STATO_CAMPO='E' style='width:15%; font-size:12px;'><INPUT type='radio' name='" + tdIDradio + "' value='S' STATO_CAMPO='E'> </INPUT><LABEL>Si</LABEL><INPUT type='radio' name='" + tdIDradio + "' value='N' STATO_CAMPO='E'> </INPUT><LABEL>No</LABEL></TD><TD class='classTdField' STATO_CAMPO='E' style='width:55%; font-size:12px;'><INPUT id='" + tdIDtxt + "' name='" + tdIDtxt + "' STATO_CAMPO='E' style='width:100%;'> </INPUT></TD></TR>";
            }

            // Creo il FIELDSET per gli esami pre-parto
            return "<FIELDSET id='lblDivEsamiPreparto' style='font-size:12px;'><LEGEND>ESAMI PRE-PARTO</LEGEND><DIV id='divEsamiPreparto'><TABLE class='classDataEntryTable'><TBODY>" +
                    trEsamiPreparto('Coagulazione', 'chkCoagulazione', 'txtCoagulazione') +
                    trEsamiPreparto('Azotemia e Creatininemia', 'chkAzoCre', 'txtAzoCre') +
                    trEsamiPreparto('CMV', 'chkCMV', 'txtCMV') +
                    trEsamiPreparto('Rubeo Test IGG', 'chkRT', 'txtRT') +
                    trEsamiPreparto('Rubeo Test IGM', 'chkRT2', 'txtRT2') +
                    trEsamiPreparto('TPHA', 'chkTPHA', 'txtTPHA') +
                    trEsamiPreparto('Tampone Vaginale Rettale', 'chkTVR', 'txtTVR') +
                    trEsamiPreparto('ECG', 'chkECG', 'txtECG') +
                    trEsamiPreparto('Gruppo Sanguigno', 'chkGS', 'txtGS') +
                    trEsamiPreparto('Emocromo', 'chkEmocromo', 'txtEmocromo') +
                    trEsamiPreparto('Esame urine', 'chkEU', 'txtEU') +
                    trEsamiPreparto('HIV', 'chkHIV', 'txtHIV') +
                    trEsamiPreparto('HCV', 'chkHCV', 'txtHCV') +
                    trEsamiPreparto('HBsAg', 'chkHBsAg', 'txtHBsAg') +
                    trEsamiPreparto('Test di Coombs', 'chkTC', 'txtTC') +
                    trEsamiPreparto('Toxo Test IGG', 'chkTT', 'txtTT') +
                    trEsamiPreparto('Toxo Test IGM', 'chkTT2', 'txtTT2') +
                    trEsamiPreparto('Altri Esami', 'chkAE', 'txtAE') +
                    "<COLGROUP><COL><COL><COL></COLGROUP></TABLE></DIV></FIELDSET>";
        }

        function table37Settimana() {
            function td37SettimanaLabel(tdLabel, tdWidth) {
                var ret = "<TD class=classTdLabel STATO_CAMPO='E' style='width:" + tdWidth + "%; font-size:12px;'><LABEL>" + tdLabel + "</LABEL></TD>";
                return ret;
            }

            function td37SettimanaLabelLink(tdLabel, tdWidth, input, scanDbName) {
                var ret = "<TD class=classTdLabelLink STATO_CAMPO='E' style='width:" + tdWidth + "%; font-size:12px;'><LABEL id='lblOperatore37Settimana' name='lblOperatore37Settimana' onclick='javascript:launch_scandb_link(this);' SCANDB_PROC='" + scanDbName + "' SCANDB_RIC='" + input + "'>" + tdLabel + "</LABEL></TD>";
                return ret;
            }

            function td37SettimanaInputData(tdID) {
                var ret = "<TD class='classTdField' STATO_CAMPO='E'>" + NS_FUNCTIONS.input.date(tdID) + "</TD>";
                return ret;
            }

            function td37SettimanaInput(tdID, tdStatus) {
                var ret = "<TD class='classTdField' STATO_CAMPO='E'><INPUT id='" + tdID + "' name='" + tdID + "' STATO_CAMPO='" + tdStatus + "' style='width:100%;'></INPUT></TD>";
                return ret;
            }

            function td37SettimanaInputScanDb(tdID, hInput, tdStatus) {
                var ret = "<TD class='classTdField' STATO_CAMPO='E'><INPUT id='" + tdID + "' name='" + tdID + "' STATO_CAMPO='" + tdStatus + "' style='width:100%;'></INPUT><INPUT id='" + hInput + "' name='" + hInput + "' type='hidden' STATO_CAMPO='E' value=''></INPUT></TD>";
                return ret;
            }

            // Creo il FIELDSET per la 37 Settimana
            return "<FIELDSET id=lblDiv37Sett style='font-size:12px;'><LEGEND>37 SETTIMANA</LEGEND><DIV id=div37Sett><TABLE class=classDataEntryTable><TBODY>" +
                    "<TR>" +
                    td37SettimanaLabel("DATA", 22) +
                    td37SettimanaLabel("BCF", 10) +
                    td37SettimanaLabel("PA", 10) +
                    td37SettimanaLabel("SF", 10) +
                    td37SettimanaLabel("ESAMI", 22) +
                    td37SettimanaLabelLink("OPERATORE", 26, "txtOperatore37Settimana", "TAB_MED_OST" /* SCANDB */) +
                    "</TR><TR>" +
                    td37SettimanaInputData("txtData37Settimana", "E") +
                    td37SettimanaInput("txtBCF37Settimana", "E") +
                    td37SettimanaInput("txtPA37Settimana", "E") +
                    td37SettimanaInput("txtSF37Settimana", "E") +
                    td37SettimanaInput("txtEsami37Settimana", "E") +
                    td37SettimanaInputScanDb("txtOperatore37Settimana", "hOperatore37Settimana", "E") +
                    "</TR>" +
                    "<COLGROUP><COL><COL><COL><COL><COL><COL></COLGROUP></TABLE></DIV></FIELDSET>";
        }

        function tableAppuntamentiSuccessivi() {
            function trAppuntamentiSuccessivi(tdLabel, tdID, tdIDNote) {
                var ret =
                        "<TR><TD class=classTdLabel STATO_CAMPO='E' style='width:33%; font-size:12px;'><LABEL>" + tdLabel + "</LABEL></TD><TD class='classTdField' STATO_CAMPO='E'>" + NS_FUNCTIONS.input.date(tdID) +
                        "&nbsp;<INPUT id='" + tdIDNote + "' name='" + tdIDNote + "' STATO_CAMPO='E' style='width:90%'>" +
                        "</TD></TR>";
                return ret;
            }

            // Creo il FIELDSET per gli appuntamenti successivi
            return "<FIELDSET id=lblDivAppSucc style='font-size:12px;'><LEGEND>APPUNTAMENTI SUCCESSIVI</LEGEND><DIV id=divAppSucc><TABLE class=classDataEntryTable><TBODY>" +
                    trAppuntamentiSuccessivi('Visita Anestesista', 'txtVA', 'txtVANote') +
                    trAppuntamentiSuccessivi('Colloquio centro trasfusionale', 'txtCCT', 'txtCCTNote') +
                    trAppuntamentiSuccessivi('Primo monitoraggio', 'txtPM', 'txtPMNote') +
                    trAppuntamentiSuccessivi('Epicrisi', 'txtEpicrisi', 'txtEpicrisiNote') +
                    "<COLGROUP><COL><COL><COL></COLGROUP></TABLE></DIV></FIELDSET>";
        }

        // Creo la tabella contenitore per gli esami pre-parto e per gli appuntamenti successivi
        var table = "<TABLE id='tableAppuntamentiSuccessivi' width='100%'><TR>" +
                "<TD width='50%'>" + tableEsamiPreparto() + "</TD>" +
                "<TD width='50%'>" + table37Settimana() + tableAppuntamentiSuccessivi() + "</TD>" +
                "</TR></TABLE>";

        switch (modo) {
            case 'APPEND':
                $("#tableAppuntamentiSuccessivi").remove();
                $("#divGravidanza").append(table);
                break;
        }

        /*if ($('#txtOperatore37Settimana').val() == '') {
         $('#txtOperatore37Settimana').val(baseUser.DESCRIPTION);
         }
         $('#txtOperatore37Settimana').attr('disabled', true);*/

        NS_FUNCTIONS.setDatepicker('txtData37Settimana');
        NS_FUNCTIONS.setDatepicker('txtVA');
        NS_FUNCTIONS.setDatepicker('txtCCT');
        NS_FUNCTIONS.setDatepicker('txtPM');
        NS_FUNCTIONS.setDatepicker('txtEpicrisi');
    },
    caricaDati: function() {
        pBinds = new Array();
        pBinds.push(document.EXTERN.IDEN_VISITA.value);
        var rs = WindowCartella.executeQuery("ostetricia.xml", "caricaDati36settimana", pBinds);
        if (rs.next()) {
            $("#txtDataEcoDatazione").val(rs.getString("txtDataEcoDatazione"));
            $("#txtDataEcoMorfologica").val(rs.getString("txtDataEcoMorfologica"));
            $("#txtDataEcoBiometrica").val(rs.getString("txtDataEcoBiometrica"));
            $("#txtEAEcoDatazione").val(rs.getString("txtEAEcoDatazione"));
            $("#txtEAEcoMorfologica").val(rs.getString("txtEAEcoMorfologica"));
            $("#txtEAEcoBiometrica").val(rs.getString("txtEAEcoBiometrica"));
            $("#txtCEEcoDatazione").val(rs.getString("txtCEEcoDatazione"));
            $("#txtCEEcoMorfologica").val(rs.getString("txtCEEcoMorfologica"));
            $("#txtCEEcoBiometrica").val(rs.getString("txtCEEcoBiometrica"));
            $("#txtCurvaOGTT").val(rs.getString("txtCurvaOGTT"));
            $("#txtData37Settimana").val(rs.getString("txtData37Settimana"));
            $("#txtBCF37Settimana").val(rs.getString("txtBCF37Settimana"));
            $("#txtPA37Settimana").val(rs.getString("txtPA37Settimana"));
            $("#txtSF37Settimana").val(rs.getString("txtSF37Settimana"));
            $("#txtEsami37Settimana").val(rs.getString("txtEsami37Settimana"));
            $("#txtOperatore37Settimana").val(rs.getString("txtOperatore37Settimana"));

            $("#txtVA").val(rs.getString("txtVA"));
            $("#txtCCT").val(rs.getString("txtCCT"));
            $("#txtPM").val(rs.getString("txtPM"));
            $("#txtEpicrisi").val(rs.getString("txtEpicrisi"));
            $("#txtVANote").val(rs.getString("txtVANote"));
            $("#txtCCTNote").val(rs.getString("txtCCTNote"));
            $("#txtPMNote").val(rs.getString("txtPMNote"));
            $("#txtEpicrisiNote").val(rs.getString("txtEpicrisiNote"));

            $("#txtGS").val(rs.getString("txtGS"));
            $("#txtTC").val(rs.getString("txtTC"));
            $("#txtHIV").val(rs.getString("txtHIV"));
            $("#txtHCV").val(rs.getString("txtHCV"));
            $("#txtHBsAg").val(rs.getString("txtHBsAg"));
            $("#txtEmocromo").val(rs.getString("txtEmocromo"));
            $("#txtCoagulazione").val(rs.getString("txtCoagulazione"));
            $("#txtEU").val(rs.getString("txtEU"));
            $("#txtTT").val(rs.getString("txtTT"));
            $("#txtTT2").val(rs.getString("txtTT2"));
            $("#txtRT").val(rs.getString("txtRT"));
            $("#txtRT2").val(rs.getString("txtRT2"));
            $("#txtTPHA").val(rs.getString("txtTPHA"));
            $("#txtECG").val(rs.getString("txtECG"));
            $("#txtTVR").val(rs.getString("txtTVR"));
            $("#txtAE").val(rs.getString("txtAE"));
            $("#txtAzoCre").val(rs.getString("txtAzoCre"));
            $("#txtCMV").val(rs.getString("txtCMV"));

            $("#txtBit").val(rs.getString("txtBit"));
            $("#txtTri").val(rs.getString("txtTri"));
            $("#txtAmn").val(rs.getString("txtAmn"));
            $("#txtVil").val(rs.getString("txtVil"));
            $("#txtTgsp").val(rs.getString("txtTgsp"));
            $("#txtMammografia").val(rs.getString("txtMammografia"));
            $("#txtTestDiGravidanza").val(rs.getString("txtTestDiGravidanza"));
            $("#txtTrasfusioniPregresse2").val(rs.getString("txtTrasfusioniPregresse2"));
            $("#txtImmunoprofilassiAntiD").val(rs.getString("txtImmunoprofilassiAntiD"));

            NS_36_SETTIMANA.setRadio("chkGS", rs.getString("chkGS"));
            NS_36_SETTIMANA.setRadio("chkTC", rs.getString("chkTC"));
            NS_36_SETTIMANA.setRadio("chkHIV", rs.getString("chkHIV"));
            NS_36_SETTIMANA.setRadio("chkHCV", rs.getString("chkHCV"));
            NS_36_SETTIMANA.setRadio("chkHBsAg", rs.getString("chkHBsAg"));
            NS_36_SETTIMANA.setRadio("chkEmocromo", rs.getString("chkEmocromo"));
            NS_36_SETTIMANA.setRadio("chkCoagulazione", rs.getString("chkCoagulazione"));
            NS_36_SETTIMANA.setRadio("chkEU", rs.getString("chkEU"));
            NS_36_SETTIMANA.setRadio("chkTT", rs.getString("chkTT"));
            NS_36_SETTIMANA.setRadio("chkTT2", rs.getString("chkTT2"));
            NS_36_SETTIMANA.setRadio("chkRT", rs.getString("chkRT"));
            NS_36_SETTIMANA.setRadio("chkRT2", rs.getString("chkRT2"));
            NS_36_SETTIMANA.setRadio("chkTPHA", rs.getString("chkTPHA"));
            NS_36_SETTIMANA.setRadio("chkECG", rs.getString("chkECG"));
            NS_36_SETTIMANA.setRadio("chkTVR", rs.getString("chkTVR"));
            NS_36_SETTIMANA.setRadio("chkAE", rs.getString("chkAE"));
            NS_36_SETTIMANA.setRadio("chkAzoCre", rs.getString("chkAzoCre"));
            NS_36_SETTIMANA.setRadio("chkCMV", rs.getString("chkCMV"));

            NS_36_SETTIMANA.setCheckBox("chkBit", rs.getString("chkBit"));
            NS_36_SETTIMANA.setCheckBox("chkTri", rs.getString("chkTri"));
            NS_36_SETTIMANA.setCheckBox("chkAmn", rs.getString("chkAmn"));
            NS_36_SETTIMANA.setCheckBox("chkVil", rs.getString("chkVil"));
            NS_36_SETTIMANA.setCheckBox("chkTgsp", rs.getString("chkTgsp"));
            NS_36_SETTIMANA.setCheckBox("chkMammografia", rs.getString("chkMammografia"));
            NS_36_SETTIMANA.setCheckBox("chkTestDiGravidanza", rs.getString("chkTestDiGravidanza"));
            NS_36_SETTIMANA.setCheckBox("chkTrasfusioniPregresse2", rs.getString("chkTrasfusioniPregresse2"));
            NS_36_SETTIMANA.setCheckBox("chkImmunoprofilassiAntiD", rs.getString("chkImmunoprofilassiAntiD"));
        }

    },
    setRadio: function(name, value) {
        if (value == 'S') {
            $('input[name=' + name + '][value=S]').attr('checked', true);
        }
        else if (value == 'N') {
            $('input[name=' + name + '][value=N]').attr('checked', true);
        }

    },
    setCheckBox: function(name, value) {
        if (value == 'S') {
            $('input[name=' + name + ']').attr('checked', 'checked');
        }

    },

    importaAllergieIdenPaziente: null,
    importaInterventiIdenPaziente: null
};