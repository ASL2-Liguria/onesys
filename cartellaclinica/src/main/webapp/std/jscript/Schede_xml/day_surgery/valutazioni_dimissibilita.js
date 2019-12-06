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
        NS_VALUTAZIONE_DIMISSIBILITA.init();
        NS_VALUTAZIONE_DIMISSIBILITA.setEvents();
    } catch (e) {
        alert(e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description);
    }
});

var NS_VALUTAZIONE_DIMISSIBILITA = {
    init: function() {
        NS_FUNCTIONS.setColumnsDimension("groupScheda", ["500px", "250px", "250px"]);

        NS_FUNCTIONS.disableEnableInputText('txtTemperaturaCorporea', $('INPUT[name="radTemperaturaCorporea"]:checked').val() === undefined ? "" : $('INPUT[name="radTemperaturaCorporea"]:checked').val(), 'S');
        NS_FUNCTIONS.disableEnableInputText('txtDimissibile', $('INPUT[name="radDimissibile"]:checked').val() === undefined ? "" : $('INPUT[name="radDimissibile"]:checked').val(), 'X');

        // tappullo tamporaneo => da configurare correttamente su ModalitaCartella.js
        baseUser.TIPO == 'I' ? $("#lblRegistra").parent().parent().hide() : null;   
        
        if (_STATO_PAGINA == 'L'){
      		 document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
          }  
    },
    setEvents: function() {
        // Controllo sulla data
        var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
        oDateMask.attach($('input[name=txtDataRilevazione]')[0]);
        
        $('INPUT[name="radTemperaturaCorporea"]').change(function() {
            NS_FUNCTIONS.disableEnableInputText('txtTemperaturaCorporea', $(this).is(':checked') ? $(this).val() : "", 'S');
        });
        $('INPUT[name="radDimissibile"]').change(function() {
            NS_FUNCTIONS.disableEnableInputText('txtDimissibile', $(this).is(':checked') ? $(this).val() : "", 'X');
        });

        $("#txtDimissibile").blur(function() {
            oraControl_onblur(document.getElementById('txtDimissibile'));
        });
        $("#txtDimissibile").keyup(function() {
            oraControl_onkeyup(document.getElementById('txtDimissibile'));
        });

        $("#txtOraRilevazione").blur(function() {
            oraControl_onblur(document.getElementById('txtOraRilevazione'));
        });
        $("#txtOraRilevazione").keyup(function() {
            oraControl_onkeyup(document.getElementById('txtOraRilevazione'));
        });

        /*$('DIV#groupScheda TABLE TBODY TR').each(function(i) {
            $(this).find("TD").each(function(j) {
                //alert(i + " " + j);
                if (i == 3 && j == 0) {
                    $(this).attr('colspan', '5');
                    $(this).css('width', 'auto');
                } else if (i == 3 && j == 1) {
                    $(this).attr('colspan', '10');
                }

                if (i == 10 && j == 0) {
                    $(this).attr('colspan', '3');
                    $(this).css('width', 'auto');
                } else if (i == 10 && j == 1) {
                    $(this).attr('colspan', '2');
                } else if (i == 10 && j == 2) {
                    //$(this).removeAttr('colSpan');
                    $(this).attr('colspan', '10');
                }
            });
        });*/
        
        $('DIV#groupScheda TABLE TBODY TR').each(function(i) {
        	 $(this).find("TD").each(function(j) {
        		 
        		 if (i == 16 && j == 1) {
                     $(this).attr('colspan', '2');
                     $(this).css('width', 'auto');
                 }
        	 });
        });
        
    },
    stampaModulo: function() {
        var funzione = document.EXTERN.FUNZIONE.value;
        var anteprima = 'S';
        var reparto = WindowCartella.getAccesso("COD_CDC");
        var sf = '&prompt<pIdenVisita>=' + WindowCartella.getRicovero("IDEN");

        WindowCartella.confStampaReparto(funzione, sf, anteprima, reparto, basePC.PRINTERNAME_REF_CLIENT);
    }
};
