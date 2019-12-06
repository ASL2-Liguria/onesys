var WindowCartella = null;

jQuery(document).ready(function() {
    // Gestione dell'apertura della pagina da finestra modale o dal menu
    if (typeof window.dialogArguments === 'object') {
    	window.WindowCartella = window.dialogArguments.top.window;
    } else {
        window.WindowCartella = window;
        while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
            window.WindowCartella = window.WindowCartella.parent;
        }
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

    $('#txtNote').focus().addClass("expand").parent().css('width', '80%');
    $("textarea.expand").TextAreaExpander(40);
    
    $('input[name=chkLivello]').each(function(){
    	var id = $(this).attr('id').replace(/^[^0-9]+/, '');
    	$('#lblDescrizione'+id).attr("for", $(this).attr('id'));
    });
    $('td.classTdLabelLink label').attr('title', 'Visualizza storico');
});
