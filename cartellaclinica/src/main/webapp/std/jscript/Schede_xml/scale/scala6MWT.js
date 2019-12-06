var WindowCartella = null;

jQuery(document).ready(function() {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }

    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }

    if (document.EXTERN.BISOGNO.value == 'N') {
        document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
    }

    if (_STATO_PAGINA == 'L') {
    	 document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
    }

    try {
        if (!WindowCartella.ModalitaCartella.isStampabile(document)) {
            document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
        }
    } catch (e) {
    }

    try {
        if (!WindowCartella.ModalitaCartella.isStampabile(document)) {
            document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
        }
    } catch (e) {
    }

    //setAltezzaPaziente();
    $('#txtVNorm').attr('disabled', true);
    $("#txtScoreTotale").forceNumeric();
    if ($('#hAltezza').val() != 0) {
        $('#txtScoreTotale').focusout(function() {calculateVNorm();});
    }
    
    // Aggiunta del campo txtAusili
    NS_FUNCTIONS.moveLeftField({name: 'txtAusili', width: '100%', space: '&nbsp;&nbsp;&nbsp;'});
    
    var arrValue = [];
    $('select[name="chkAusili"] option').filter(function(){
    	return $.trim($(this).text()).match(/(specificare)/ig);
    }).each(function(){
    	arrValue.push($(this).val());
    });
    
    var callback = {
    	'function': function() {
    		if (this.id == 'txtAusili') NS_FUNCTIONS.setCampoStato('txtAusili','lblAusili', this.enable ? 'O' : 'E');
    	},
    	'arguments': null,
    	'scope': null
    };
    
    NS_FUNCTIONS.enableDisable($('select[name="chkAusili"]'), arrValue, ['txtAusili'], false, callback);
    $('select[name="chkAusili"]').change(function() {
    	NS_FUNCTIONS.enableDisable($('select[name="chkAusili"]'), arrValue, ['txtAusili'], true, callback);	
    });
});

function setAltezzaPaziente() {
    $('#hAltezza').val(getAltezzaPaziente());
}

function getAltezzaPaziente() {
    var vRs = WindowCartella.executeQuery('scale.xml', 'getAltezzaPaziente', [document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value]);
    if (vRs.next()) {
        return vRs.getString('ALTEZZA');
    } else {
        alert("ATTENZIONE: manca l'altezza del paziente e il calcolo della velocità normalizzata non sarà automatico.");
        return 0;
    }
}

function isEmpty(id) {
    return $('#' + id).val() == '';
}

function getValueNumber(id) {
    //alert(id + " :" +$('#' + id).val());
    return isEmpty(id) ? 0 : parseInt($('#' + id).val());
}

function calculateVNorm() {
    $('#txtVNorm').val(Math.round((getValueNumber('txtScoreTotale')/($('#hAltezza').val()/100)/360) * Math.pow(10, 1)) / Math.pow(10, 1));
}

function chiudi6MWT() {
    try {
        var opener = window.dialogArguments;

        var query = "select to_char(data_ultima_modifica,'DD/MM/YYYY') DATA_ULTIMA_MODIFICA from radsql.cc_scale where key_legame='SCALA_6MWT' and iden_visita=" + document.EXTERN.IDEN_VISITA.value;
        query += "@DATA_ULTIMA_MODIFICA";
        query += "@1";
        dwr.engine.setAsync(false);
        CJsUpdate.select(query, gestDati);
        dwr.engine.setAsync(true);

    } catch (e) {}
}

function gestDati(dati) {
    var array_dati = null;
    try {
        var opener = window.dialogArguments;
        array_dati = dati.split('@');
        if (array_dati[0] != "$$$$$") {
            opener.document.getElementById('txtData6MWT').value = array_dati[0];
            opener.document.getElementById('txtEsito6MWT').value = document.getElementById('txtTotale').value;
        }
    } catch (e) {}
}
