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

    $('#groupHPT .classDataEntryTable tbody tr td:first').css('width', '550px');
    $('#groupHPT .classDataEntryTable tbody tr:last-child td:last-child').css('width', '550px');
});

function chiudiHPT() {
    try {
        var opener = window.dialogArguments;

        var query = "select to_char(data_ultima_modifica,'DD/MM/YYYY') DATA_ULTIMA_MODIFICA from radsql.cc_scale where key_legame='SCALA_HPT' and iden_visita=" + document.EXTERN.IDEN_VISITA.value;
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
            opener.document.getElementById('txtDataHPT').value = array_dati[0];
            opener.document.getElementById('txtEsitoHPT').value = document.getElementById('txtTotale').value;
        }
    } catch (e) {}
}
