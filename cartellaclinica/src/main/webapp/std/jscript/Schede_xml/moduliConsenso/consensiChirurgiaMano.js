var WindowCartella = null;

jQuery(document).ready(function() {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }

    NS_CONSENSO_CHIRURGIA_MANO.init();
    NS_CONSENSO_CHIRURGIA_MANO.setEvents();

    try {
        top.utilMostraBoxAttesa(false);
    } catch (e) {
    }
});

var NS_CONSENSO_CHIRURGIA_MANO = {
    init: function() {
        document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
        if (_STATO_PAGINA == 'L') {
            document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
            /*            document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';*/
            $('#lblMedPrescr').parent().attr('disabled', 'disabled');
        }

        NS_CONSENSO_CHIRURGIA_MANO.valorizzaMedico();
        NS_CONSENSO_CHIRURGIA_MANO.hideAllFieldSet();

        switch (document.EXTERN.TIPO.value) {
            case 'CONSENSO_INFORMATO_CHIRURGIA_MANO':
                NS_CONSENSO_CHIRURGIA_MANO.acquisizioneConsensoInformato();
                break;
        }
    },
    chiudiModulo: function() {
        top.$.fancybox.close();
    },
    regOK: function() {
        $('iframe#frameWork', parent.document)[0].contentWindow.$('iframe#oIFWk')[0].contentWindow.location.reload();
        NS_CONSENSO_CHIRURGIA_MANO.chiudiModulo();
    },
    stampaModulo: function() {
        var funzione = document.EXTERN.TIPO.value;
        var anteprima = 'S';
        var reparto = top.getAccesso("COD_CDC");
        var sf = '&prompt<pVisita>=' + top.getRicovero("IDEN");

        parent.confStampaReparto(funzione, sf, anteprima, reparto, basePC.PRINTERNAME_REF_CLIENT);
    },
    setEvents: function() {
    },
    valorizzaMedico: function() {
        if (baseUser.TIPO == 'M') {
            if (_STATO_PAGINA != 'L') {
                document.dati.Hiden_MedPrescr.value = baseUser.IDEN_PER;
                document.dati.txtMedPrescr.value = baseUser.DESCRIPTION;
            }
            $('#lblMedPrescr').parent().attr('disabled', 'disabled');
        }
        $('#txtMedPrescr').attr('disabled', 'disabled');
    },
    hideAllFieldSet: function() {
        $('#groupDatiIdentificativi').hide();
        $('#groupDatiSanitari').hide();
        $('#groupEspressioneAcquisizione').hide();
        $('#groupRevoca').hide();
    },
    setTitle: function() {
        var rs = WindowCartella.executeQuery('moduliConsenso.xml', 'getDescrModulo', [document.EXTERN.TIPO.value]);
        if (rs.next()) {
            $('#lblTitle').text('CONSENSI ATTI SANITARI S.C. CHIRURGIA MANO - ' + rs.getString("DESCRIZIONE"));
        }
    },
    acquisizioneConsensoInformato: function() {
        //$('#lblTitle').text('CONSENSI ATTI SANITARI S.C. CHIRURGIA MANO - Informativa e Modulo di acquisizione del Consenso Informato di Chirurgia della Mano');

        NS_CONSENSO_CHIRURGIA_MANO.setTitle();

        $('#groupDatiIdentificativi').show();
        // SET campi
        $('input[name=txtNomeP1]').attr('disabled', 'disabled');
        $('input[name=txtCognomeP1]').attr('disabled', 'disabled');
        $('input[name=txtDataNascitaP1]').attr('disabled', 'disabled');

        $('#groupDatiSanitari').show();
        // SET campi
        $('input[name=radLateralitaP2][value=4]').hide().nextAll('label').hide();

        $('#groupEspressioneAcquisizione').show();
        // SET campi
        $('input[name=txtPazienteP3]').attr('disabled', 'disabled');
        if (!$('input[name=radAttoSanitarioP3]').is(':checked')) {
            $('input[name=radAttoSanitarioP3][value=1]').attr('checked', true);
        }
        $('input[name=radAttoSanitarioP3]').parent().css({'background': 'orange', 'text-align': 'center'});

        if (document.EXTERN.REVOCA.value == 'N')
            $('#groupRevoca').hide();
        else {
            $('#groupRevoca').show();
            // SET campi
            $('input[name=txtPazienteP4]').attr('disabled', 'disabled');
            $('input[name=chkRevoca]').parent().css({'text-align': 'center'});
        }
    }

};
