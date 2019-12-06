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
        EOS_OSTETRICIA.init();
        EOS_OSTETRICIA.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
});

var EOS_OSTETRICIA = {
    init: function() {
        if (top.ModalitaCartella.isReadonly(document)) {
            document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
        }

        if (!top.ModalitaCartella.isStampabile(document)) {
            document.getElementById('lblstampa').parentElement.parentElement.style.display = 'none';
        }

        try {
            eval(baseReparti.getValue(top.getForm(document).reparto, 'ESAME_OBIETTIVO_SPECIALISTICO'));
        } catch (e) {
            alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
        }
    
        var hPartePresentata = $('#txtPartePresentata').remove().val();
        NS_FUNCTIONS.addInputText('groupGenerale', '&nbsp;&nbsp;&nbsp;<INPUT id="txtPartePresentata" name="txtPartePresentata" value="' + hPartePresentata + '" STATO_CAMPO="E"/>', '4|1|0', 'select');
        NS_FUNCTIONS.enableDisable($('select[name="cmbMembrane"]'), [2], ['txtDataRotte', 'txtOraRotte']);
        NS_FUNCTIONS.showHideCalendar('txtDataRotte', $('select[name="cmbMembrane"]').val() == '2' ? true : false);
        //NS_FUNCTIONS.enableDisable($('select[name="cmbPartePresentata"]'), [3], ['txtPartePresentata']);
        
        NS_FUNCTIONS.controlloData('txtDataRotte');
		$("#txtOraRotte").blur(function(){ oraControl_onblur(document.getElementById('txtOraRotte')); });
		$("#txtOraRotte").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraRotte')); });
        //tableFormatting('groupGenerale', ["1|3|2","3|2|1"]);
        
        //NS_FUNCTIONS.hideRecordsPrint('lblregistra', 'lblstampa');
    },
    setEvents: function() {
        $('select[name="cmbMembrane"]').change(function() {
            NS_FUNCTIONS.enableDisable($('select[name="cmbMembrane"]'), [2], ['txtDataRotte', 'txtOraRotte'], true);
            NS_FUNCTIONS.showHideCalendar('txtDataRotte', $('select[name="cmbMembrane"]').val() == '2' ? true : false);
        });
        $('select[name="cmbPartePresentata"]').change(function() {
            NS_FUNCTIONS.enableDisable($('select[name="cmbPartePresentata"]'), [3], ['txtPartePresentata'], true);
        });
    },
    registraEsameObiettivoSpecialistico: function() {
        //alert("registraEsameObiettivoSpecialistico");
        NS_FUNCTIONS.records();
    },
    stampaEsameObiettivoSpecialistico: function() {
        //alert("stampaEsameObiettivoSpecialistico");
        NS_FUNCTIONS.print('ESAME_OBIETTIVO_SPECIALISTICO', 'S');
    }           
};
