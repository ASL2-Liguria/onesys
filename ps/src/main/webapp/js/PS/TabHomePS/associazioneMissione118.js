/**
 * Gestore dell'associazione tra missione 118 e pratica di pronto soccorso che ne scaturisce
 *
* @param {function} onCancelConfirmed funzione da eseguire all'annullamento dell'associazione
 * @returns {AssociazioneMissione}
 */
function AssociazioneMissione(onCancelConfirmed){
    this.iden = null;
    this.codiceAmulanza = null;
    this.codiceMissione = {
        anno: null,
        progressivo: null
    };

    this.urgenza = {
        codice: null,
        descrizione: null
    };

    this.dataInserimento = null;
    this.praticaAssociata = null;

    this.onCancelConfirmed = onCancelConfirmed || function(){};
    this.widgets = [];
};


/**
 * setter per il codice missione, si occupa di separare anno e progressivo nel caso si fornisca un codice unico
 *
 * @param {Object || String} codiceMissione
 * @param {String} anno
 * @returns {undefined}
 */
AssociazioneMissione.prototype.setCodiceMissione = function(codiceMissione, anno){
    if(typeof codiceMissione === 'object'){
        this.codiceMissione = codiceMissione;
        return;
    };

    if(anno){
        this.codiceMissione.anno = anno;
        this.codiceMissione.progressivo = codiceMissione;
        return;
    }

    var pattern = /([0-9]{4})0*([0-9]+)/;
    var match = pattern.exec(codiceMissione);

    this.codiceMissione.anno = match[1];
    this.codiceMissione.progressivo = match[2];
};

/**
 * Costruisce il widget contenente le informazioni relative alla missione 118
 *
 *
 * @param {Window} win oggetto window al cui body verrà appeso il widget creato
 * @returns {jQuery} oggetto jQuery da appendere dove opportuno
 */
AssociazioneMissione.prototype.getWidget = function(win){
    var _this = this;

    var widget = win.$('<span></span>').css({height:'24px', 'line-height': '26px', 'font-size': '16px'});
    widget.append('<label>Urgenza:</label><strong>'+this.urgenza.descrizione+'</strong> ');
    widget.append('<label>Ambulanza:</label><strong>'+this.codiceAmulanza+'</strong> ');
    widget.append('<label>Missione:</label><strong>'+this.codiceMissione.anno+'/'+this.codiceMissione.progressivo+'</strong> ');

    var cancelBtn = win.$('<a id="linkClose"></a>')
            .css({width: '24px', height: '16px', 'margin-top': '6px', display: 'inline-block', cursor:'pointer'})
            .on('click', function(){
                AssociazioneMissione.prototype.cancel.call(_this, win);
            });

    widget.append(cancelBtn);

    this.widgets.push(widget);
    return widget;
};

/**
 * Annullamento della modalità associazione
 *
 * @param {Window} win oggetto window dal cui body verrà creato il dialog di conferma annullamento associazione
 * @returns {void}
 */
AssociazioneMissione.prototype.cancel = function(win){

    var _this = this;

    win.$.dialog("Si conferma l'annullamento dell'associazione con la missione selezionata?",{
        title: "Conferma operazione",
        buttons: [
            {label: "NO", action: function () {
                win.$.dialog.hide();
            }},
            {label: "SI", action: function () {
                _this.reset();
                win.$.dialog.hide();
            }}

        ]
    });

};

/**
 * Resetta la modalità di associazione rimuovendo i widget
 *
 * @returns {void}
 */
AssociazioneMissione.prototype.reset = function(){
    for(var i=0; i<this.widgets.length; i++){
        //se la pagina cui è stato appeso il widget non esiste più la rimozione solleva eccezione "script liberato"
        try{
            this.widgets[i].remove();
        }catch(e){
        }
    }

    this.onCancelConfirmed();
};