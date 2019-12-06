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
        _V_DATI = WindowCartella.getForm();
    } catch (e) {
        window.WindowCartella = parent.opener.top.window;
    }    

    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }
    
    try {
        NS_CHECK_LIST_POST_INTERVENTO.init();
        NS_CHECK_LIST_POST_INTERVENTO.setEvents();
    } catch (e) {
        alert(e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description);
    }
});

var NS_CHECK_LIST_POST_INTERVENTO = {
    init: function() {
        $('DIV#groupChkListPostIntervento TABLE TBODY TR').each(function(i) {
            $(this).find("TD").each(function(j) {
                if (i != 16) {
                    if (j == 0) {
                        $(this).attr('colspan','1');
                        $(this).css('width','350px');
                    } else if (j == 1 || j == 2) {
                        $(this).css('width','120px'); 
                    }
                }
            }); 
        });
        NS_CHECK_LIST_POST_INTERVENTO.loadIntervento();
        
        //NS_FUNCTIONS.setColumnsDimension("groupChkListPostIntervento", ["25%", "15%", "10%", "50%"]);
        $('#chkEndovenoso').insertAfter($('#lblPresenzaElastomero'));
        $('#lblEndovenoso').insertAfter($('#chkEndovenoso'));
        $('#chkPeridurale').insertAfter($('#lblEndovenoso'));
        $('#lblPeridurale').insertAfter($('#chkPeridurale'));
        
        if (_STATO_PAGINA == 'L'){
    		 document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
        }
        
    },
    setEvents: function() {  
        // Controllo sulla data
        var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
        oDateMask.attach($('input[name=txtData]')[0]);
    },
    loadIntervento: function() {
        pBinds = new Array();
        pBinds.push("ESAME_OBIETTIVO_DS");
        pBinds.push(WindowCartella.getRicovero("IDEN"));
        var rs = WindowCartella.executeQuery("checkListIntervento.xml", "getIntervento", pBinds);
        if (rs.next()) {
            $("#txtCodiceICD").val(rs.getString("TXT_CODICE_ICD"));
            $("#txtDescrizioneICD").val(rs.getString("TXT_DESCRIZIONE_ICD"));
        }
    },
    stampaModulo: function() {
        var funzione = document.EXTERN.FUNZIONE.value;
        var anteprima = 'S';
        var reparto = WindowCartella.getAccesso("COD_CDC");
        var sf = '&prompt<pIdenVisita>=' + WindowCartella.getRicovero("IDEN");

        WindowCartella.confStampaReparto(funzione, sf, anteprima, reparto, basePC.PRINTERNAME_REF_CLIENT);
    }   
};
