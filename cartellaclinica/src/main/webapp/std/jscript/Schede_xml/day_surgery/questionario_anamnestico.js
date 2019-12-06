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
        NS_QUESTIONARIO_ANAMNESTICO.init();
        NS_QUESTIONARIO_ANAMNESTICO.setEvents();
    } catch (e) {
        alert(e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description);
    }
});

var NS_QUESTIONARIO_ANAMNESTICO = {
    init: function() {
        window.name = 'QUESTIONARIO_ANAMNESTICO';
        
        NS_FUNCTIONS.setColumnsDimension("divQAFamiglia", ["30%", "15%", "55%"]);
        NS_FUNCTIONS.setColumnsDimension("divQARiferisce", ["30%", "15%", "55%"]);
        NS_FUNCTIONS.setColumnsDimension("divQAAvuto", ["30%", "15%", "55%"]);
        NS_FUNCTIONS.setColumnsDimension("divQADonne", ["30%", "15%", "55%"]);
        NS_FUNCTIONS.setColumnsDimension("divQAIntervento", ["30%", "15%", "55%"]);
        
        $('#divQAAvuto').append('<IFRAME id=frameWkAllerte width=100% height=140px src="' + NS_QUESTIONARIO_ANAMNESTICO.getUrlWkAllerte() + '"></IFRAME>');
        
        $('DIV#divQARiferisce TABLE TBODY TR').each(function(i) {
            $(this).find("TD").each(function(j) {
                if (i == 0) {
                    if (j >= 2) {
                        $(this).css('width', '15%');
                    }
                }
            });
        });
        NS_QUESTIONARIO_ANAMNESTICO.enableDisableObligatoryInput(); 
        
        baseUser.TIPO == 'M' && WindowCartella.getRicovero("TIPOLOGIA").search("PRE") < 0 && $('#hMedConv').val() == '' ? $("#lblConvalida").parent().parent().show() : $("#lblConvalida").parent().parent().hide();

        // tappullo tamporaneo => da configurare correttamente su ModalitaCartella.js
        baseUser.TIPO == 'I' ? $("#lblRegistra").parent().parent().hide() : null;   
        
        if (_STATO_PAGINA == 'L'){
      		 document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
      		 document.getElementById('lblconvalida').parentElement.parentElement.style.display = 'none';
          }
    },
    setEvents: function() {
        var maxLength = 4000;
        var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
        jQuery('#txtAllergie').addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
            maxlength(this, maxLength, msg);
        });
    },
    getUrlWkAllerte: function() {
        var idenAllergie = $('#hArrayAllergie').val();
 
        if (idenAllergie != '' && typeof idenAllergie != 'undefined') {
            whereAgg = " and iden in(" + idenAllergie + ")";
        } else if (idenAllergie == '' && typeof idenAllergie != 'undefined') {
            whereAgg = " and data_ins < to_date('20130618','yyyyMMdd')";
        } else if (typeof idenAllergie == 'undefined') {
            //non dovrebbe mai entrare!
            //gestione nel caso non si trovi #hArrayAllergie
            return alert('Attenzione allergie e intolleranze non salvate nella pagina');
        }
        var urlAllerte = "servletGenerator?KEY_LEGAME=WK_ALLERTE&WHERE_WK= where TIPO IN ('ALLERGIA','INTOLLERANZA','REAZIONE_AVVERSA') AND IDEN_ANAG=" + document.EXTERN.IDEN_ANAG.value + whereAgg;

        if (WindowCartella.ModalitaCartella.isReadonly(document)) {
            urlAllerte += '&CONTEXT_MENU=WK_ALLERTE_LETTURA';
        }

        return  urlAllerte;
    },
    enableDisableObligatoryInput: function() {
        if (WindowCartella.getPaziente("SESSO") == 'M') {
            try {
                $('input[name="radCicloMestruale"]').attr('disabled', 'disabled');
                $('input[name="radCicloMestruale"]').removeAttr('STATO_CAMPO').attr('STATO_CAMPO', 'L').parent().removeAttr('STATO_CAMPO').attr('STATO_CAMPO', 'L').removeAttr('class').attr('class', 'classTdLabel');
                $('#lblCicloMestruale').parent().removeAttr('STATO_CAMPO').attr('STATO_CAMPO', 'L').removeAttr('class').attr('class', 'classTdLabel');
            } catch (e) {}
            try {
                $('#txtMenarca').attr('disabled', 'disabled');
            } catch (e) {}
            try {
                $('#txtMenopausa').attr('disabled', 'disabled');
            } catch (e) {}
            try {
                $('input[name="radAllattamento"]').attr('disabled', 'disabled');
                $('#txtAllattamentoigli').attr('disabled', 'disabled');
                $('input[name="radAllattamento"]').removeAttr('STATO_CAMPO').attr('STATO_CAMPO', 'L').parent().removeAttr('STATO_CAMPO').attr('STATO_CAMPO', 'L').removeAttr('class').attr('class', 'classTdLabel');
                $('#lblAllattamento').parent().removeAttr('STATO_CAMPO').attr('STATO_CAMPO', 'L').removeAttr('class').attr('class', 'classTdLabel');
            } catch (e) {}
            try {
               $('input[name="radGravidanza"]').attr('disabled', 'disabled');
                $('#txtGravidanza').attr('disabled', 'disabled');
                $('input[name="radGravidanza"]').removeAttr('STATO_CAMPO').attr('STATO_CAMPO', 'L').parent().removeAttr('STATO_CAMPO').attr('STATO_CAMPO', 'L').removeAttr('class').attr('class', 'classTdLabel');
                $('#lblGravidanza').parent().removeAttr('STATO_CAMPO').attr('STATO_CAMPO', 'L').removeAttr('class').attr('class', 'classTdLabel');
            } catch (e) {}
            try {
                $('input[name="radPillola"]').attr('disabled', 'disabled');
                $('#txtPillola').attr('disabled', 'disabled');
                $('input[name="radPillola"]').removeAttr('STATO_CAMPO').attr('STATO_CAMPO', 'L').parent().removeAttr('STATO_CAMPO').attr('STATO_CAMPO', 'L').removeAttr('class').attr('class', 'classTdLabel');
                $('#lblPillola').parent().removeAttr('STATO_CAMPO').attr('STATO_CAMPO', 'L').removeAttr('class').attr('class', 'classTdLabel');
            } catch (e) {}
        }
    },    
    registraQuestionario: function() {
        // Controllo uniformità allergie. Se la wk è compilata
        var idxRowAllergie = $('#frameWkAllerte').contents().find('#oTable tr:last-child').index();
        // Incremento l'indice in quanto se la tabella ha una riga sola io suo indice è 0
        idxRowAllergie += 1;
        var nodeRadio = document.getElementsByName('chkAllergieAnamnesi');
        for (var i = 0; i < nodeRadio.length; i++) {
            if (nodeRadio[i].checked)
                var valRadio = nodeRadio[i].value;
        }
        // 623 --> NO - 621 --> SI

//        salvare gli iden delle allergie
        $('#hArrayAllergie').val(document.getElementById('frameWkAllerte').contentWindow['array_iden'].join(","));
        if (idxRowAllergie > 0 && valRadio == 623) {
            alert('E\' stato segnalata l\'assenza di allergie nonostante l\'effettiva presenza. Prego ricontrollare.');
            return;
        } else if (idxRowAllergie <= 0 && valRadio == 621) {
            alert('E\' stato segnalata la presenza di allergie nonostante l\'effettiva assenza. Prego ricontrollare.');
            return;
        } else {
            registra(true, okReg);
        }
        
        function okReg() {
            baseUser.TIPO == 'M' && WindowCartella.getRicovero("TIPOLOGIA").search("PRE") < 0 && $('#hMedConv').val() == '' ? $("#lblConvalida").parent().parent().show() : $("#lblConvalida").parent().parent().hide();
        }
    },  
    stampaModulo: function() {
        if (WindowCartella.getRicovero("TIPOLOGIA").search("PRE") > -1 || WindowCartella.getConvalida('letteraDimEngine.xml', 'getConvalida', ['ESAME_OBIETTIVO_DS', 'QUESTIONARIO_ANAMNESTICO'])) {
            var funzione = document.EXTERN.FUNZIONE.value;
            var anteprima = 'S';
            var reparto = WindowCartella.getAccesso("COD_CDC");
            var sf = '&prompt<pIdenVisita>=' + WindowCartella.getRicovero("IDEN");

            WindowCartella.confStampaReparto(funzione, sf, anteprima, reparto, basePC.PRINTERNAME_REF_CLIENT);
        }
    },
    convalida: function() {
        $('#hMedConv').val(baseUser.IDEN_PER);
        NS_QUESTIONARIO_ANAMNESTICO.registraQuestionario();
    }
};
