function checkDatiFondamentali (_json_anagrafica, sconosciuto) {

    var isSconosiuto = typeof sconosciuto == "undefined" ? false : sconosciuto;
    var isNeonato = moment().diff(moment(_json_anagrafica.dataNascita, 'YYYYMMDD'), 'day') <= 3;
    var campiNonValorizzati = [];

    if (_json_anagrafica.nome == null || _json_anagrafica.nome == "") {
        campiNonValorizzati.push("Nome");
    }

    if (_json_anagrafica.cognome == null || _json_anagrafica.cognome == "") {
        campiNonValorizzati.push("Cognome");
    }

    if (!isNeonato && (_json_anagrafica.codiceFiscale == null || _json_anagrafica.codiceFiscale == "")) {
        campiNonValorizzati.push("Codice Fiscale");
    }

    if (_json_anagrafica.sesso == null) {
        campiNonValorizzati.push("Sesso");
    }


    if (_json_anagrafica.dataNascita == null) {
        campiNonValorizzati.push("Data di Nascita");
    }

    if (_json_anagrafica.comuneResidenza.regione.codice == null && !isSconosiuto) {
        campiNonValorizzati.push("Regione di Residenza");
    }

    if (_json_anagrafica.comuneNascita.id == null && !isSconosiuto) {
        campiNonValorizzati.push("Comune Nascita");
    }

    if (_json_anagrafica.comuneResidenza.id == null && !isSconosiuto) {
        campiNonValorizzati.push("Comune Residenza");
    }

    if (_json_anagrafica.comuneResidenza.indirizzo == null && !isSconosiuto && _json_anagrafica.comuneResidenza.regione.codice != '999') {
        campiNonValorizzati.push("Indirizzo di Residenza");
    }
    if (_json_anagrafica.comuneResidenza.cap == null && !isSconosiuto) {
        campiNonValorizzati.push("CAP di Residenza");
    }

     if (_json_anagrafica.titoloStudio.id == null && !isSconosiuto) {
     campiNonValorizzati.push("Titolo di Studio");
     }

     if (_json_anagrafica.statoCivile.id == null && !isSconosiuto) {
     campiNonValorizzati.push("Stato Civile");
     }

    if (_json_anagrafica.cittadinanze.length == 0 && !isSconosiuto) {
        campiNonValorizzati.push("Cittadinanza");
    }
    /*
     if (_json_anagrafica.nazionalita.id == null) {
     campiNonValorizzati.push("Nazionalit&agrave;");
     }
     */
    if (_json_anagrafica.comuneResidenza.asl.codice == null && !isSconosiuto) {
        campiNonValorizzati.push("ASL di Residenza");
    }

    if (_json_anagrafica.telefono == null && !isSconosiuto) {
        campiNonValorizzati.push("Telefono");
    }

    return campiNonValorizzati;
}
