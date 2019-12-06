var WindowCartella = null;

jQuery(document).ready(function() {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }

    NS_CONSENSO_AZIENDALE.init();
    NS_CONSENSO_AZIENDALE.setEvents();

    try {
        top.utilMostraBoxAttesa(false);
    } catch (e) {
    }
});

var NS_CONSENSO_AZIENDALE = {
    init: function() {
        document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
        if (_STATO_PAGINA == 'L') {
            document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
            /*document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';*/
            $('#lblMedPrescr').parent().attr('disabled', 'disabled');
        }

        NS_CONSENSO_AZIENDALE.valorizzaMedico();
        NS_CONSENSO_AZIENDALE.hideAllFieldSet();

        switch (document.EXTERN.TIPO.value) {
            case 'AUTOCERTIFICAZIONE_GENITORI':
                NS_CONSENSO_AZIENDALE.autocertificazioneGenitori();
                break;
            case 'CONSENSO_INFORMATO':
                NS_CONSENSO_AZIENDALE.acquisizioneConsensoInformato();
                break;
            case 'CONSENSO_INFORMATO_MINORI':
                NS_CONSENSO_AZIENDALE.acquisizioneConsensoInformatoMinori();
                break;
            case 'CONSENSO_INFORMATO_TEST_HIV':
                NS_CONSENSO_AZIENDALE.consensoInformatoTestHiv();
                break;
            case 'CONSENSO_INFORMATO_TRASFUSIONE':
                NS_CONSENSO_AZIENDALE.consensoInformatoTrasfusione();
                break;
        }
    },
    chiudiModulo: function() {
        top.$.fancybox.close();
    },
    regOK: function() {
        $('iframe#frameWork', parent.document)[0].contentWindow.$('iframe#oIFWk')[0].contentWindow.location.reload();
        NS_CONSENSO_AZIENDALE.chiudiModulo();
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
        $('#groupAutocertificazioneGenitori').hide();
        $('#groupConsensoHIV').hide();
        $('#groupRevoca').hide();
        $('#groupRevocaHIV').hide();
        $('#groupCondizioni').hide();

        NS_CONSENSO_AZIENDALE.hideAllLabel();
    },
    hideAllLabel: function() {
        $('#lblNomeP1, #lblCognomeP1, #lblLuogoNascitaP1, #lblDataNascitaP1, #lblGenitoriP1, #lblPadreP1, #lblMadreP1, #lblRappresentanteLegaleP1, #lblEstremiProvvedimentoP1').parent().parent().hide();
        $('#lblSituazioneClinicaP2, #lblAttoSanitarioP2, #lblTrasfusioneP2, #lblSangueP2Chk, #lblPlasmaP2Chk, #lblPiastrineP2Chk, #lblVuotaP2, #lblSomministrazioneP2, #lblAlbuminaP2Chk, #lblImmunoglobulineP2Chk, #lblAltroP2Chk, #lblLateralitaP2').parent().parent().hide();
        $('#lblSottoscrittiP3, #lblSottoscrittiP3, #lblMedPrescr, #lblAccettaP3, #lblOsservazioniP3').parent().parent().hide();
        $('#lblSottoscrittoP4, #lblSottoscrittiP4, #lblMinoreP4, #lblDataP4, #lblRevocaP4Chk').parent().parent().hide();
        $('#lblSottoscritto162, #lblLuogoNascitaIn162, #lblDataNascitaIn162, #lblComuneResidenzaIn162, #lblViaResidenzaIn162, #lblCivicoResidenzaIn162, #lblPazienteOut162, #lblLuogoNascitaOut162, #lblDataNascitaOut162, #lblStatoCivile162, #lblDivorzioSi162, #lblNoFirma162, #lblPotestaSeparata162, #lblPotestaSeparata162Chk, #lblAltro162, #lblIstanzaSottoscritta162, #lblIstanzaSottoscritta162Chk').parent().parent().hide();
        $('#lblPaziente13, #lblLuogoNascita13, #lblDataNascita13, #lblComuneResidenza13, #lblViaResidenza13, #lblCivicoResidenza13, #lblAccetta13, #lblSottoscritto13, #lblData13, #lblRevoca13Chk, #lblGTInfo13, #lblGTPaziente13, #lblGTLuogoNascita13, #lblGTDataNascita13, #lblGTComuneResidenza13, #lblGTViaResidenza13, #lblGTCivicoResidenza13, #lblGT_CI13, #lblPotesta13Chk, #lblTutore13Chk').parent().parent().hide();
    },
    setTitle: function() {
        var rs = WindowCartella.executeQuery('moduliConsenso.xml', 'getDescrModulo', [document.EXTERN.TIPO.value]);
        if (rs.next()) {
            $('#lblTitle').text('CONSENSI AZIENDALI - ' + rs.getString("DESCRIZIONE"));
        }
    },
    acquisizioneConsensoInformato: function() {
        //$('#lblTitle').text('CONSENSI AZIENDALI - Modulo di acquisizione del consenso informato');

        NS_CONSENSO_AZIENDALE.setTitle();

        $('#groupDatiIdentificativi').show();
        // SHOW campi oTableDatiIdentificativi
        $('#lblNomeP1, #lblCognomeP1, #lblDataNascitaP1, #lblGenitoriP1, #lblRappresentanteLegaleP1').parent().parent().show();
        // HIDE campi oTableDatiIdentificativi
        $('#lblLuogoNascitaP1, #lblPadreP1, #lblMadreP1, #lblEstremiProvvedimentoP1').parent().hide();
        $('input[name=txtLuogoNascitaP1], input[name=txtPadreP1], input[name=txtMadreP1], input[name=txtEstremiProvvedimentoP1]').parent().hide();
        // SET campi
        $('input[name=txtNomeP1]').attr('disabled', 'disabled');
        $('input[name=txtCognomeP1]').attr('disabled', 'disabled');
        $('input[name=txtDataNascitaP1]').attr('disabled', 'disabled');

        $('#groupDatiSanitari').show();
        // SHOW campi oTableDatiSanitari
        $('#lblSituazioneClinicaP2, #lblAttoSanitarioP2, #lblLateralitaP2').parent().parent().show();
        // HIDE campi oTableDatiSanitari
        $('#lblTrasfusioneP2, #lblSangueP2Chk, #lblPlasmaP2Chk, #lblPiastrineP2Chk, #lblVuotaP2, #lblSomministrazioneP2, #lblAlbuminaP2Chk, #lblImmunoglobulineP2Chk, #lblAltroP2Chk').parent().hide();
        $('input[name=txtTrasfusioneP2], input[name=chkSangueP2], input[name=chkPlasmaP2], input[name=chkPiastrineP2], input[name=txtSomministrazioneP2], input[name=chkAlbuminaP2], input[name=chkImmunoglobulineP2], input[name=chkAltroP2], input[name=txtAltroP2]').parent().hide();
        // SET campi
        $('#txtAttoSanitarioP2').parent().attr('colspan', 14);

        $('#groupEspressioneAcquisizione').show();
        // SHOW campi oTableEspressioneAcquisizione
        $('#lblSottoscrittoP3, #lblMedPrescr, #lblAccettaP3, #lblOsservazioniP3').parent().parent().show();
        // HIDE campi oTableEspressioneAcquisizione
        $('#lblSottoscrittiP3').parent().hide();
        $('input[name=txtSottoscrittiP3], input[name=txtOsservazioniP3]').parent().hide();
        // SET campi
        $('input[name=txtSottoscrittoP3]').attr('disabled', 'disabled');
        if (!$('input[name=radAccettaP3]').is(':checked')) {
            $('input[name=radAccettaP3][value=1]').attr('checked', true);
        }
        $('input[name=radAccettaP3]').parent().css({'background': 'orange', 'text-align': 'center'});

        if (document.EXTERN.REVOCA.value == 'N')
            $('#groupRevoca').hide();
        else {
            $('#groupRevoca').show();
            // SHOW campi oTableRevoca
            $('#lblSottoscrittoP4, #lblDataP4, #lblRevocaP4Chk').parent().parent().show();
            // HIDE campi oTableRevoca
            $('#lblSottoscrittiP4, #lblMinoreP4').parent().hide();
            $('input[name=txtSottoscrittiP4], input[name=txtMinoreP4]').parent().hide();
            // SET campi
            $('input[name=txtSottoscrittoP4]').attr('disabled', 'disabled');
            $('input[name=chkRevoca]').parent().css({'text-align': 'center'});
        }
    },
    acquisizioneConsensoInformatoMinori: function() {
        //$('#lblTitle').text('CONSENSI AZIENDALI - Modulo di acquisizione del consenso informato per i minori di età');

        NS_CONSENSO_AZIENDALE.setTitle();

        $('#groupDatiIdentificativi').show();
        // SHOW campi oTableDatiIdentificativi
        $('#lblNomeP1, #lblCognomeP1, #lblLuogoNascitaP1, #lblDataNascitaP1, #lblPadreP1, #lblMadreP1, #lblRappresentanteLegaleP1, #lblEstremiProvvedimentoP1').parent().parent().show();
        // HIDE campi oTableDatiIdentificativi
        $('#lblGenitoriP1').parent().hide();
        $('input[name=txtGenitoriP1]').parent().hide();
        // SET campi
        $('input[name=txtNomeP1]').attr('disabled', 'disabled');
        $('input[name=txtCognomeP1]').attr('disabled', 'disabled');
        $('input[name=txtLuogoNascitaP1]').attr('disabled', 'disabled');
        $('input[name=txtDataNascitaP1]').attr('disabled', 'disabled');

        $('#groupDatiSanitari').show();
        // SHOW campi oTableDatiSanitari
        $('#lblAttoSanitarioP2').parent().parent().show();
        // HIDE campi oTableDatiSanitari
        $('#lblSituazioneClinicaP2, #lblTrasfusioneP2, #lblSangueP2Chk, #lblPlasmaP2Chk, #lblPiastrineP2Chk, #lblVuotaP2, #lblSomministrazioneP2, #lblAlbuminaP2Chk, #lblImmunoglobulineP2Chk, #lblAltroP2Chk, #lblLateralitaP2').parent().hide();
        $('input[name=txtSituazioneClinicaP2], input[name=txtTrasfusioneP2], input[name=chkSangueP2], input[name=chkPlasmaP2], input[name=chkPiastrineP2], input[name=txtSomministrazioneP2], input[name=chkAlbuminaP2], input[name=chkImmunoglobulineP2], input[name=chkAltroP2], input[name=txtAltroP2], input[name=radLateralitaP2]').parent().hide();

        $('#groupEspressioneAcquisizione').show();
        // SHOW campi oTableEspressioneAcquisizione
        $('#lblSottoscrittiP3, #lblMedPrescr, #lblAccettaP3').parent().parent().show();
        // HIDE campi oTableEspressioneAcquisizione
        $('#lblSottoscrittoP3, #lblOsservazioniP3').parent().hide();
        $('input[name=txtSottoscrittoP3], input[name=txtOsservazioniP3]').parent().hide();
        // SET campi
        if (!$('input[name=radAccettaP3]').is(':checked')) {
            $('input[name=radAccettaP3][value=1]').attr('checked', true);
        }
        $('input[name=radAccettaP3]').parent().css({'background': 'orange', 'text-align': 'center'});

        if (document.EXTERN.REVOCA.value == 'N')
            $('#groupRevoca').hide();
        else {
            $('#groupRevoca').show();

            // SHOW campi oTableRevoca
            $('#lblSottoscrittiP4, #lblMinoreP4, #lblRevocaPlusP4Chk').parent().parent().show();
            // HIDE campi oTableRevoca
            $('#lblSottoscrittoP4, #lblDataP4').parent().hide();
            $('input[name=txtSottoscrittoP4], input[name=txtDataP4]').parent().hide();

            // SET campi
            $('input[name=txtMinoreP4]').attr('disabled', 'disabled');
            $('input[name=chkRevoca]').parent().css({'text-align': 'center'});
        }

    },
    autocertificazioneGenitori: function() {
        //$('#lblTitle').text('CONSENSI AZIENDALI - Modulo di autocertificazione per i genitori');

        NS_CONSENSO_AZIENDALE.setTitle();

        $('#groupAutocertificazioneGenitori').show();
        // SHOW campi oTableAutocertificazioneGenitori
        $('#lblSottoscritto162, #lblLuogoNascitaIn162, #lblDataNascitaIn162, #lblComuneResidenzaIn162, #lblViaResidenzaIn162, #lblCivicoResidenzaIn162, #lblPazienteOut162, #lblLuogoNascitaOut162, #lblDataNascitaOut162, #lblStatoCivile162, #lblDivorzioSi162, #lblNoFirma162, #lblPotestaSeparata162, #lblPotestaSeparata162Chk, #lblAltro162, #lblIstanzaSottoscritta162, #lblIstanzaSottoscritta162Chk').parent().parent().show();
        // HIDE campi oTableAutocertificazioneGenitori
        // SET campi
        $('input[name=txtPazienteOut162]').attr('disabled', 'disabled');
        $('input[name=txtLuogoNascitaOut162]').attr('disabled', 'disabled');
        $('input[name=txtDataNascitaOut162]').attr('disabled', 'disabled');
        if (!$('input[name=radStatoCivile162]').is(':checked')) {
            $('input[name=radStatoCivile162][value=1]').attr('checked', true);
        }
        if (!$('input[name=radDivorzioSi162]').is(':checked')) {
            $('input[name=radDivorzioSi162][value=1]').attr('checked', true);
        }
        $('input[name=radDivorzioSi162]').attr('disabled', 'disabled');
        $('#lblDisposizioni162').parent().css('width', '100%');
        $("input[name=radStatoCivile162]").change(function() {
            if ($("input[name=radStatoCivile162][value=4]").attr("checked")) {
                $('input[name=radDivorzioSi162]').removeAttr("disabled");
            } else {
                $('input[name=radDivorzioSi162]').attr('disabled', 'disabled');
            }
        });
    },
    consensoInformatoTestHiv: function() {
        //$('#lblTitle').text('CONSENSI AZIENDALI - Consenso informato per effettuare il test HIV');

        NS_CONSENSO_AZIENDALE.setTitle();

        $('#groupConsensoHIV').show();
        // SHOW campi oTableConsensoHIV
        $('#lblPaziente13, #lblLuogoNascita13, #lblDataNascita13, #lblComuneResidenza13, #lblViaResidenza13, #lblCivicoResidenza13, #lblAccetta13, #lblSottoscritto13, #lblData13, #lblRevoca13Chk, #lblGTInfo13, #lblGTPaziente13, #lblGTLuogoNascita13, #lblGTDataNascita13, #lblGTComuneResidenza13, #lblGTViaResidenza13, #lblGTCivicoResidenza13, #lblGT_CI13, #lblPotesta13Chk, #lblTutore13Chk').parent().parent().show();
        // HIDE campi oTableConsensoHIV
        // SET campi
        $('input[name=txtPaziente13]').attr('disabled', 'disabled');
        $('input[name=txtLuogoNascita13]').attr('disabled', 'disabled');
        $('input[name=txtDataNascita13]').attr('disabled', 'disabled');
        $('input[name=txtComuneResidenza13]').attr('disabled', 'disabled');
        $('input[name=txtViaResidenza13]').attr('disabled', 'disabled');
        $('input[name=txtCivicoResidenza13]').attr('disabled', 'disabled');
        $('input[name=txtSottoscritto13]').attr('disabled', 'disabled');
        $('#lblGTInfo13').parent().css('width', '100%');
        if (!$('input[name=radAccetta13]').is(':checked')) {
            $('input[name=radAccetta13][value=1]').attr('checked', true);
        }
        $('input[name=radAccetta13]').parent().css({'background': 'orange', 'text-align': 'center'});

        if (document.EXTERN.REVOCA.value == 'N')
            $('#groupRevocaHIV').hide();
        else {
            $('#groupRevocaHIV').show();
            // SET campi
            $('input[name=chkRevoca]').parent().css({'text-align': 'center'});
        }
    },
    consensoInformatoTrasfusione: function() {
        //$('#lblTitle').text('CONSENSI AZIENDALI - Scheda Informativa e Modulo di acquisizione del Consenso Informato sulla Trasfusione di sangue, emocomponenti ed emoderivati');

        NS_CONSENSO_AZIENDALE.setTitle();

        $('#groupDatiIdentificativi').show();
        // SHOW campi oTableDatiIdentificativi
        $('#lblNomeP1, #lblCognomeP1, #lblDataNascitaP1, #lblPadreP1, #lblMadreP1, #lblRappresentanteLegaleP1').parent().parent().show();
        // HIDE campi oTableDatiIdentificativi
        $('#lblLuogoNascitaP1, #lblGenitoriP1, #lblEstremiProvvedimentoP1').parent().hide();
        $('input[name=txtLuogoNascitaP1], input[name=txtGenitoriP1], input[name=txtEstremiProvvedimentoP1]').parent().hide();
        // SET campi
        $('input[name=txtNomeP1]').attr('disabled', 'disabled');
        $('input[name=txtCognomeP1]').attr('disabled', 'disabled');
        $('input[name=txtDataNascitaP1]').attr('disabled', 'disabled');

        $('#groupDatiSanitari').show();
        // SHOW campi oTableDatiSanitari
        $('#lblSituazioneClinicaP2, #lblAttoSanitarioP2, #lblTrasfusioneP2, #lblSangueP2Chk, #lblPlasmaP2Chk, #lblPiastrineP2Chk, #lblVuotaP2, #lblSomministrazioneP2, #lblAlbuminaP2Chk, #lblImmunoglobulineP2Chk, #lblAltroP2Chk').parent().parent().show();
        // HIDE campi oTableDatiSanitari
        $('#lblLateralitaP2').parent().hide();
        $('#txtAttoSanitarioP2, input[name=radLateralitaP2]').parent().hide();
        // SET campi
        $('input[name=txtAltroP2]').attr('disabled', 'disabled');
        $('input[name=chkAltroP2]').change(function() {
            if ($('input[name=chkAltroP2]').attr('checked')) {
                $('input[name=txtAltroP2]').removeAttr('disabled');
            } else {
                $('input[name=txtAltroP2]').attr('disabled', 'disabled');
            }
        });

        $('#groupEspressioneAcquisizione').show();
        // SHOW campi oTableEspressioneAcquisizione
        $('#lblSottoscrittoP3, #lblMedPrescr, #lblAccettaP3').parent().parent().show();
        // HIDE campi oTableEspressioneAcquisizione
        $('#lblSottoscrittiP3, #lblOsservazioniP3').parent().hide();
        $('input[name=txtSottoscrittiP3], input[name=txtOsservazioniP3]').parent().hide();
        // SET campi
        $('input[name=txtSottoscrittoP3]').attr('disabled', 'disabled');
        if (!$('input[name=radAccettaP3]').is(':checked')) {
            $('input[name=radAccettaP3][value=1]').attr('checked', true);
        }
        $('input[name=radAccettaP3]').parent().css({'background': 'orange', 'text-align': 'center'});

        if (document.EXTERN.REVOCA.value == 'N')
            $('#groupRevoca').hide();
        else {
            $('#groupRevoca').show();
            // SHOW campi oTableRevoca
            $('#lblSottoscrittoP4, #lblDataP4, #lblRevocaP4Chk').parent().parent().show();
            // HIDE campi oTableRevoca
            $('#lblSottoscrittiP4, #lblMinoreP4').parent().hide();
            $('input[name=txtSottoscrittiP4], input[name=txtMinoreP4]').parent().hide();
            // SET campi
            $('input[name=txtSottoscrittoP4]').attr('disabled', 'disabled');
            $('input[name=chkRevoca]').parent().css({'text-align': 'center'});
        }
    }

};
