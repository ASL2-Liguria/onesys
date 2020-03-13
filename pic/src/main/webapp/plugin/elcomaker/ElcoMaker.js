/*
 Autore: marchiosoft
 File: ElkoMaker.js
 */

/**
 * ElcoMakerData, oggetto utilizzato per costruire un JSON da utilizzare con ElcoMaker
 */
function ElcoMakerData() {
    this.jsonOutput = {
        id: null,
        dati: {

        }
    };
}


/**
 * Setta l'id del template XSL da utilizzare per costruire il PDF
 * @param {string} id - Id del template che corrisponde al nome del file xsl sul middleware. Chiedere a Simone o Jack
 */
ElcoMakerData.prototype.setIdTemplate = function (id) {
    this.jsonOutput.id = id;
};


/**
 * @returns {string}
 */
ElcoMakerData.prototype.getIdTemplate = function () {
    return this.jsonOutput.id;
};


/**
 * Ritorna un JSON che sarà convertito in xml, l'oggetto è vuoto
 * @returns {object}
 */
ElcoMakerData.prototype.getRoot = function () {
    return this.jsonOutput.dati;
};


/**
 *  ElcoMaker, oggetto utilizzato per costruire
 *  pdf o immagini a partire da un oggetto ElcoMakerData che verra
 *  poi convertito dal middleware in XML e applicato ad un foglio di
 *  stile XSL per produrre un XSL-FO da dare in pasto ad APACHE FOP
 */
function ElcoMaker () {
    this.data = new ElcoMakerData();
    this.urlElcoMaker = (typeof(home.baseGlobal.URL_ELCOMAKER) != 'undefined') ? home.baseGlobal.URL_ELCOMAKER : null;
    this.mimeType = "application/pdf"
}


/**
 * Effettua la chiamata al servizio del middleware elco
 * @param {function} cbkSucces
 * @param {function} cbkError
 */
ElcoMaker.prototype.send = function(cbkSucces,cbkError) {
    $.ajax({
        type: "POST",
        url: this.urlElcoMaker,
        data: {json : JSON.stringify(this.data.jsonOutput), mime: this.mimeType},
        dataType: "json",
        success:  function(resp){cbkSucces(resp)},
        error:    function(o){if (typeof cbkError !== 'undefined') {cbkError(o)}}
    })
};


/**
 * Setta l'url del servizio sul middleware
 * @param url - Default home.baseGlobal.URL_SERVIZI_GRAFOMETRICA + '/FIRMA/ELCOMAKER'
 */
ElcoMaker.prototype.setUrl = function(url) {
    this.urlElcoMaker = url;
};


/**
 * Getter url del servizio sul middleware
 * @returns {null|string}
 */
ElcoMaker.prototype.getUrl = function() {
    return this.urlElcoMaker;
};

/**
 * Setta il mimetype della risposta
 * @param mime - Mimetype risposta
 */
ElcoMaker.prototype.setMime = function(mime) {
    this.mimeType = mime;
};


/**
 * Getter mimetype
 * @returns {null|string}
 */
ElcoMaker.prototype.getMime = function() {
    return this.mimeType;
};