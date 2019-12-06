/**
 * File JavaScript in uso dalla scheda 'ESAME_OBIETTIVO_ASL2_DS'.
 * 
 * @author	gianlucab
 * @version	1.0
 * @since	2014-06-05
 */

var WindowCartella = null;

$(document).ready(function() {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }

    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    try {
        DAYSURGERY.init();
        DAYSURGERY.setEvents();
        DAYSURGERY.CaricaPato();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }

    if ($('form[name=EXTERN] input[name=BISOGNO]').val() == 'N') {
        document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
    }

    if (_STATO_PAGINA == 'L') {
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
        document.getElementById('lblConvalida').parentElement.parentElement.style.display = 'none';
    }

    try {
        if (!WindowCartella.ModalitaCartella.isStampabile(document)) {
            document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
        }
    }
    catch (e) {
    }

    //Nasconde il pulsante Stampa
    //document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';

    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }
});

var DAYSURGERY = {
    init: function() {
        DAYSURGERY.tablePatologie('APPEND');

        // Aggiunta attributo "for" per le label accanto ai check input
        $('label[name^=lblchk]').each(function() {
            var idname = $(this).attr("name").replace(/^(lbl)(chk[\s\S]*)$/, "$2");
            $(this).attr("for", idname);
        });

        //$('<tr style="height:0.2em"><td/>').insertBefore($('#lblLateralita').parent().parent());
        //$('input[name=rdoLateralita]').next().next().css('font-weight','bold');
        //$('td.classTdLabel_O_O').css('max-width','100px');

        $("#txtEsameObiettivo").parent().append($('<div></div>').addClass('classDivTestiStd').attr("title", "Testi Standard").click(function() {
            DAYSURGERY.apriTestiStandard('txtEsameObiettivo');
        }));
        $("#divTerapie label").css('white-space', 'nowrap');
        $("#divTerapie textarea").parent().attr('width', '100%');

        $('select[name=cmbLocoRegionale]').attr('id', 'cmbLocoRegionale');
        NS_FUNCTIONS.moveLeftField({name: 'cmbLocoRegionale', space: '&nbsp;&nbsp;&nbsp;'});
        $('select[name=cmbLocoRegionale]').parent().attr('colspan', 14);
        NS_FUNCTIONS.enableDisable($('select[name="cmbTipoAnestesia"]'), [3], ['cmbLocoRegionale']);

        // show/hide pulsante CONVALIDA
        baseUser.TIPO == 'M' && WindowCartella.getRicovero("TIPOLOGIA").search("PRE") < 0 && $('#hMedConv').val() == '' ? $("#lblConvalida").parent().parent().show() : $("#lblConvalida").parent().parent().hide();
    },
    setEvents: function() {
        $("#lblAggiungiPato").parent().click(function() {
            var url = "servletGenerator?KEY_LEGAME=SCELTA_PATOLOGIE&status=yes fullscreen=yes";
            $.fancybox({
                'padding': 3,
                'width': 1024,
                'height': 580,
                'href': url,
                'type': 'iframe',
                onClosed: function() {
                    $("#txtSede").focus();
                }
            });
        });

        $('select[name="cmbTipoAnestesia"]').change(function() {
            NS_FUNCTIONS.enableDisable($('select[name="cmbTipoAnestesia"]'), [3], ['cmbLocoRegionale'], true);
        });

        // Controllo obbligatorietà valore numerico
        $('input[name=txtMinutiIntervento]')
                .keydown(NS_FUNCTIONS.controlloNumerico_onkeydown)
                .blur(NS_FUNCTIONS.controlloNumerico_onblur);

        // Controllo sulla data
        var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
        oDateMask.attach($('input[name=txtDataIntervento]')[0]);
        
        
        
		$('label[name^="lblDescrizioneICD"],label[name^="lblCodiceICD"]').each(function(){
			var element = $(this)[0];
			var item = $(this).attr("id").replace(/^(lbl|txt)([\s\S]+)(Inf)$/, "$2");
			var lastC='';
			if (item.substr(item.length-1)=='2' || item.substr(item.length-1)=='3'){
				lastC=item.substr(item.length-1);
			}

			element.onclick = function() {
				var items = {'hIdenProcedura': 'hIdenProcedura'+lastC, 'txtCodiceICD': 'txtCodiceICD'+lastC, 'txtDescrizioneICD': 'txtDescrizioneICD'+lastC};
				launch_scandb_link(this, items);
			};
		});
        
        
        
        
    },
    tablePatologie: function(modo) {
        var table = "<DIV id=divAggiungiPatologie>" +
                "<table id='tablePato' class=\"classDataEntryTable\" width=100% ><tbody>" +
                "<tr id='primariga' height:10 px>" +
                "<td STATO_CAMPO='E' class='classTdLabelLink aggiungi' STYLE='BORDER-BOTTOM: #00ba19 3px solid; BACKGROUND: #d6ffdc; width=5%'>" +
                "<label title='Aggiungi Patologia' name='lblAggiungiPato' id='lblAggiungiPato'>Aggiungi Patologia</label>" +
                "</td>" +
                "<td STATO_CAMPO='E' class='classTdLabel PatoIntestaz' STYLE='BORDER-BOTTOM: #00ba19 3px solid; BACKGROUND: #d6ffdc; width=40%'>" +
                "<label name='lblPatoIntestaz' id='lblPatoIntestaz'>Patologia</label>" +
                "</td>" +
                "<td STATO_CAMPO='E' class='classTdLabel PatoAnnoIntestaz' style='width:5%; BORDER-BOTTOM: #00ba19 3px solid; BACKGROUND: #d6ffdc;'>" +
                "<label name='lblPatoAnnoIntestaz' id='lblPatoAnnoIntestaz'>Anno</label>" +
                "</td>" +
                "<td STATO_CAMPO='E' class='classTdLabel PatoNoteIntestaz' style='width:40%; BORDER-BOTTOM: #00ba19 3px solid; BACKGROUND: #d6ffdc;'>" +
                "<label name='lblPatoNoteIntestaz' id='lblPatoNoteIntestaz'>Note</label>" +
                "</td>" +
                "</tr></TBODY><COLGROUP><COL></COL></COLGROUP>\n" +
                "</TABLE></DIV>";

        switch (modo) {
            case 'APPEND':
                $('#divAggiungiPatologie').remove();
                var div = $('#divPatologie');
                div.remove();
                $('#groupPatologie fieldset').append(table);
                $('#groupPatologie fieldset').append(div);
                break;
        }
    },
    aggiungiRigaPato: function(i, valore, testo, anno, nota) {
        //alert('i='+i+' valore='+valore+' testo='+testo);
        riga = "<tr id='tr_" + i + "' valore=" + valore + "  class = 'trPato' >";
        riga += "<td STATO_CAMPO='E' class='classTdLabel' style='text-align: center; border-left:1px solid red; BORDER-BOTTOM:3PX SOLID RED'><label style='font-size: 10px;	width:20px; color:red;' title='Elimina' name='lblElimina" + i + "' id='lblElimina" + i + "'>X</label></td>";
        riga += "<td STATO_CAMPO='E' class='classTdLabel patoScelte' style='BORDER-BOTTOM:3PX SOLID RED'><label indice = " + i + " valore='" + valore + "' class='patologieScelte' name='lblPatoScelte" + i + "' id='lblPatoScelte" + i + "'>" + testo + "</label></td>";
        riga += "<td STATO_CAMPO='E' class='classTdField' style='BORDER-BOTTOM:3PX SOLID RED'><input class='annoPato' id='txtAnno" + i + "' STATO_CAMPO='E' value='" + anno + "' name='txtAnno" + i + "' type='text'></input></td>";
        riga += "<td STATO_CAMPO='E' class='classTdField' style='BORDER-BOTTOM:3PX SOLID RED'><input class='notePato' id='txtNote" + i + "' STATO_CAMPO='E' value='" + nota + "' name='txtNote" + i + "' type='text' style='width:100%'></input></td>";
        riga += "</tr><TR id='tr_2" + i + "' style='line-height:35px; margin-bottom:200px'></TR>";

        //alert(riga);
        jQuery("#tablePato").append(riga);
        jQuery("#lblElimina" + i).click(function() {
            DAYSURGERY.eliminaRigaPato(i);
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
            for (i = 0; i < aElencoPato.length; i++) {
                var pato = aElencoPato[i].split("$");
                //alert(pato[0]+" "+pato[1]+" "+pato[2]+" "+pato[3]);
                if (typeof pato[1] == "undefined") {
                    DAYSURGERY.aggiungiRigaPato(i, "", pato[0], "", "");
                } else {
                    DAYSURGERY.aggiungiRigaPato(i, pato[0], pato[1], pato[2], pato[3]);
                }

            }
            if (WindowCartella.ModalitaCartella.isReadonly(document)) {
                $('LABEL[name^="lblElimina"]').attr('disabled', 'disabled');
                $('INPUT[name^="txtAnno"]').attr('disabled', 'disabled');
                $('INPUT[name^="txtNote"]').attr('disabled', 'disabled');
            }
        }
    },
    save: function() {
        var patologie = DAYSURGERY.contaPatologie();

        if (patologie == 1) {
            alert('Inserire almeno una patologia prima di effettuare la registrazione.');
            return;
        }

        // Salvataggio patologie in campo nascosto txtPatologieSelez
        DAYSURGERY.SalvaPato();

        registra(true, okReg);

        function okReg() {
            // show/hide pulsante CONVALIDA
            baseUser.TIPO == 'M' && top.getRicovero("TIPOLOGIA").search("PRE") < 0 && $('#hMedConv').val() == '' ? $("#lblConvalida").parent().parent().show() : $("#lblConvalida").parent().parent().hide();
        }
    },
    apriTestiStandard: function(targetOut) {

        if (_STATO_PAGINA == 'L')
            return;

        var url = 'servletGenerator?funzione=LETTERA_STANDARD&KEY_LEGAME=SCHEDA_TESTI_STD&TARGET=' + targetOut + '&PROV=' + document.EXTERN.FUNZIONE.value;
        $.fancybox({
            'padding': 3,
            'width': 1024,
            'height': 580,
            'href': url,
            'type': 'iframe'
        });
    },
    contaPatologie: function() {
        return document.getElementById('tablePato').rows.length;
    },
    convalida: function() {
        $('#hMedConv').val(baseUser.IDEN_PER);
        DAYSURGERY.save();
    }
};

// Stampa la scheda
function stampa() {
    try {
        if (WindowCartella.getRicovero("TIPOLOGIA").search("PRE") > -1 || WindowCartella.getConvalida('letteraDimEngine.xml', 'getConvalida', ['ESAME_OBIETTIVO_DS', 'QUESTIONARIO_ANAMNESTICO'])) {
            var vDati = WindowCartella.getForm();
            var iden_visita = vDati.iden_ricovero;
            var funzione = document.EXTERN.FUNZIONE.value;
            var reparto = vDati.reparto;
            var anteprima = 'S';
            var sf = '&prompt<pVisita>=' + iden_visita + '&prompt<pFunzione>=' + funzione;

            WindowCartella.confStampaReparto(funzione, sf, anteprima, reparto, WindowCartella.basePC.PRINTERNAME_REF_CLIENT);
        }
    } catch (e) {
        window.alert(e.message);
    }
}
