var NS_TERAPIA_FUNZIONI = {
    /**
     * Funzione di approssimazione.
     * @param {type} number Numero da approssimare.
     * @param {type} pos    Cifre parte intera.
     * @param {type} neg    Cifre parte frazionaria
     * @returns {String|Number} numero approssimato.
     */
    roundToX: function(number, pos, neg) {
        //alert('NS_TERAPIA_FUNZIONI.roundToX(number, pos, neg)');
        top.Terapie.logger.debug('NS_TERAPIA_FUNZIONI.roundToX(number, pos, neg)');

        var ePos = "e+" + pos.toString();
        var eNeg = "e-" + neg.toString();

        return +(Math.round(number + ePos) + eNeg);
    },
    /**
     * Funzione per il calcolo del DOSAGGIO.
     * @param {type} dose Dose inserita.
     * @param {type} peso Peso inserito.
     * @returns {Number|String} il DOSAGGIO calcolato (approssimato).
     */
    dosaggio: function(dose, peso) {
        //alert('NS_TERAPIA_FUNZIONI.dosaggio(dose, peso)');
        top.Terapie.logger.debug('NS_TERAPIA_FUNZIONI.dosaggio(dose, peso)');

        // Calcolo dosaggio
        return NS_TERAPIA_FUNZIONI.roundToX(dose * peso, 3, 3);
    },
    /**
     * Funzione per calcolo della CONCENTRAZIONE.
     * @param {type} soluto     Soluto inserito. 
     * @param {type} solvente   Solvente inserito.
     * @returns {Number|String} la CONCENTRAZIONE calcolata (approssimata).
     */
    concentrazione: function(soluto, solvente) {
        //alert('NS_TERAPIA_FUNZIONI.concentrazione(soluto, solvente)');
        top.Terapie.logger.debug('NS_TERAPIA_FUNZIONI.concentrazione(soluto, solvente)');

        // Calcolo concentrazione
        return NS_TERAPIA_FUNZIONI.roundToX(soluto / solvente, 3, 3);
    },
    /**
     * Funzione per il controllo del valore del campo INPUT passato.
     * @returns {Boolean} TRUE se è valorizzato correttamente, FALSE altrimenti.
     */
    ctrlInputValue: function(pValue) {
        //alert('NS_TERAPIA_FUNZIONI.ctrlInputValue(pValue)');
        top.Terapie.logger.debug('NS_TERAPIA_FUNZIONI.ctrlInputValue(pValue)');

        return !isNaN(pValue) && pValue != undefined && pValue != '0' && pValue != '';
    },
    /**
     * Elenco dei campi OPTION della SCALA DOSE iniziale.
     * @type @exp;NS_TERAPIA_FUNZIONI@pro;optionScalaDose|@call;$@call;clone
     */
    optionScalaDose: null,
    /**
     * Funzione di rimozione di tutte le scale presenti in SCALA SOLVENTE (ad esclusione di quella relativa ai "ml").
     * @returns {undefined}
     */
    removeScalaSolvente: function() {
        //alert('NS_TERAPIA_FUNZIONI.removeScalaSolvente()');
        top.Terapie.logger.debug('NS_TERAPIA_FUNZIONI.removeScalaSolvente()');

        $('div[cls="GruppoFarmaci"][tipo="2"] div[name="UdmFarmaco"] select[name="UdmFarmaco"] option').unbind('each');
        $('div[cls="GruppoFarmaci"][tipo="2"] div[name="UdmFarmaco"] select[name="UdmFarmaco"] option').each(function() {
            $(this).text() == 'ml' ? null : $(this).remove();
        });
    },
    /**
     * Funzione di rimozione di tutte le scale presenti in SCALA SOLUTO (ad esclusione di quella relativa ai "mg" e "UI").
     * @returns {undefined}
     */
    removeScalaSoluto: function() {
        //alert('NS_TERAPIA_FUNZIONI.removeScalaSoluto()');
        top.Terapie.logger.debug('NS_TERAPIA_FUNZIONI.removeScalaSoluto()');

        NS_TERAPIA_FUNZIONI.setScalaDose();

        $('div[cls="GruppoFarmaci"][tipo="3"] div[name="UdmFarmaco"] select[name="UdmFarmaco"] option').unbind('each');
        $('div[cls="GruppoFarmaci"][tipo="3"] div[name="UdmFarmaco"] select[name="UdmFarmaco"] option').each(function() {
            $(this).text() == 'mg' || $(this).text() == 'UI' ? null : $(this).remove();
        });

        $('div[cls="GruppoFarmaci"][tipo="3"] div[name="UdmFarmaco"] select[name="UdmFarmaco"]').unbind('change');
        $('div[cls="GruppoFarmaci"][tipo="3"] div[name="UdmFarmaco"] select[name="UdmFarmaco"]').change(function() {
            switch ($(this).find("option:selected").text()) {
                case 'mg':
                    $('div[cls="UserInput"] select[name="scalaConcentrazione"] option[label="mg/ml"]').attr('selected', true);
                    break;
                case 'UI':
                    $('div[cls="UserInput"] select[name="scalaConcentrazione"] option[label="UI/ml"]').attr('selected', true);
                    break;
            }
            NS_TERAPIA_FUNZIONI.setScalaDose();
        });
    },
    /**
     * Funzione per resettare le scale disponibili in SCALA DOSE.
     * @returns {undefined}
     */
    resetScalaDose: function() {
        //alert('NS_TERAPIA_FUNZIONI.resetScalaDose()');
        top.Terapie.logger.debug('NS_TERAPIA_FUNZIONI.resetScalaDose()');

        $('div[cls="UserInput"] select[name="scalaDose"] option').each(function() {
            $(this).remove();
        });
    },
    /**
     * Funzione per settare le scale disponibili in SCALA DOSE.
     * @returns {undefined}
     */
    setScalaDose: function() {
        //alert('NS_TERAPIA_FUNZIONI.setScalaDose()');
        top.Terapie.logger.debug('NS_TERAPIA_FUNZIONI.setScalaDose()');

        var value = null;

        NS_TERAPIA_FUNZIONI.statusScalaDose = document.EXTERN.PROCEDURA.value == 'MODELLO' ? NS_TERAPIA_FUNZIONI.statusScalaDose : 0;

        NS_TERAPIA_FUNZIONI.optionScalaDose = NS_TERAPIA_FUNZIONI.optionScalaDose == null ? $('div[cls="UserInput"] select[name="scalaDose"] option').clone() : NS_TERAPIA_FUNZIONI.optionScalaDose;
        NS_TERAPIA_FUNZIONI.resetScalaDose();

        switch ($('div[cls="GruppoFarmaci"][tipo="3"] div[name="UdmFarmaco"] select[name="UdmFarmaco"] option:selected').text()) {
            case 'UI':
                // Popolo il campo SELECT
                NS_TERAPIA_FUNZIONI.optionScalaDose.each(function() {
                    $(this).text().indexOf("UI") != -1 ? $('div[cls="UserInput"] select[name="scalaDose"]').append($(this)) : null;
                });
                // Seleziono il campo SELECT
                $('div[cls="UserInput"] select[name="scalaDose"] option').each(function() {
                    switch (document.EXTERN.PROCEDURA.value) {
                        case 'INSERIMENTO':
                            $(this).text() == 'UI/ora' ? $(this).attr('selected', 'selected') : null;
                            break;
                        case 'MODELLO':
                            $(this).text() == 'UI/ora' && NS_TERAPIA_FUNZIONI.statusScalaDose == 1 ? $(this).attr('selected', 'selected') : null;
                            break;
                        default:
                            break;
                    }
                });
                break;
            case 'mg':
                // Popolo il campo SELECT
                this.optionScalaDose.each(function() {
                    $(this).text().indexOf("UI") == -1 ? $('div[cls="UserInput"] select[name="scalaDose"]').append($(this)) : null;
                });
                // Seleziono il campo SELECT
                $('div[cls="UserInput"] select[name="scalaDose"] option').each(function() {
                    switch (document.EXTERN.PROCEDURA.value) {
                        case 'INSERIMENTO':
                            $(this).text() == 'mg/ora' ? $(this).attr('selected', 'selected') : null;
                            break;
                        case 'MODELLO':
                            $(this).text() == 'mg/ora' && NS_TERAPIA_FUNZIONI.statusScalaDose == 1 ? $(this).attr('selected', 'selected') : null;
                            break;
                        default:
                            break;
                    }
                });
                break;
        }

        if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_DOSAGGIO.getPeso()) && NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_CONCENTRAZIONE.getSoluto()) && NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_VELOCITA.getVelocita())) {
            NS_TERAPIA_DOSAGGIO.setDose(NS_TERAPIA_DOSAGGIO.calculates());
        } else {
            NS_TERAPIA_DOSAGGIO.reset();
        }

        NS_TERAPIA_FUNZIONI.statusScalaDose = document.EXTERN.PROCEDURA.value == 'MODELLO' ? 1 : 0;
    },
    /**
     * Stato della SCALA DOSE.
     * @type Number
     */
    statusScalaDose: 0,
    /**
     * Funzione per recuperare i valori da un array associativo.
     * @param {type} array
     * @param {type} key
     * @returns {NS_TERAPIA_FUNZIONI.getValueFromKey.array} valore memorizzato nell'array per quella specifica key.
     */
    getValueFromKey: function(array, key) {
        //alert('NS_TERAPIA_FUNZIONI.getValueFromKey(array, key)');
        top.Terapie.logger.debug('NS_TERAPIA_FUNZIONI.getValueFromKey(array, key)');

        return array !== undefined && array != null && array[key] !== undefined && array[key] != null ? array[key] : null;
    },
    /**
     * Funzione per settare un campo di INPUT se esiste.
     * @param {type} pathInput
     * @param {type} pValue
     * @returns {undefined}
     */
    setIfExists: function(pathInput, pValue) {
        //alert('NS_TERAPIA_FUNZIONI.setIfExists(pathInput, pValue)');
        top.Terapie.logger.debug('NS_TERAPIA_FUNZIONI.setIfExists(pathInput, pValue)');

        $(pathInput).length ? $(pathInput).val(pValue) : '';
    }
};

/**
 * GAMMA KG.
 * @type type
 */
var NS_GAMMA_KG = {
    /**
     * Concentrazione.
     * @type @arr;array
     */
    concentrazione: null,
    /**
     * Dose.
     * @type @arr;array
     */
    dose: null,
    /**
     * Dose del farmaco.
     * @type @arr;array
     */
    doseFarmaco: null,
    /**
     * Durata.
     * @type @arr;array
     */
    durata: null,
    /**
     * Peso.
     * @type @arr;array
     */
    peso: null,
    /**
     * Scala della concentrazione.
     * @type @arr;array
     */
    scalaConcentrazione: null,
    /**
     * Scala della dose.
     * @type @arr;array
     */
    scalaDose: null,
    /**
     * Velocità.
     * @type @arr;array
     */
    velocita: null,
    /**
     * Volume totale.
     * @type @arr;array
     */
    volumeTotale: null,
    /**
     * Funzione di inizializzazione dei GAMMA KG.
     * @param {type} parametri Array contenente i parametri con cui inizializzare i GAMMA KG.
     * @returns {undefined}
     */
    init: function(parametri) {
        NS_GAMMA_KG.setConcentrazione(NS_TERAPIA_FUNZIONI.getValueFromKey(parametri, "CONCENTRAZIONE"));
        NS_GAMMA_KG.setDose(NS_TERAPIA_FUNZIONI.getValueFromKey(parametri, "DOSE"));
        NS_GAMMA_KG.setDoseFarmaco(NS_TERAPIA_FUNZIONI.getValueFromKey(parametri, "DOSE_FARMACO"));
        NS_GAMMA_KG.setDurata(NS_TERAPIA_FUNZIONI.getValueFromKey(parametri, "DURATA"));
        NS_GAMMA_KG.setPeso(NS_TERAPIA_FUNZIONI.getValueFromKey(parametri, "PESO"));
        NS_GAMMA_KG.setScalaConcentrazione(NS_TERAPIA_FUNZIONI.getValueFromKey(parametri, "SCALA_CONCENTRAZIONE"));
        NS_GAMMA_KG.setScalaDose(NS_TERAPIA_FUNZIONI.getValueFromKey(parametri, "SCALA_DOSE"));
        NS_GAMMA_KG.setVelocita(NS_TERAPIA_FUNZIONI.getValueFromKey(parametri, "VELOCITA"));
        NS_GAMMA_KG.setVolumeTotale(NS_TERAPIA_FUNZIONI.getValueFromKey(parametri, "VOLUME_TOTALE"));
        //alert(NS_GAMMA_KG.getConcentrazione());
    },
    /**
     * Funzione per la gestione degli eventi associati ai GAMMA KG.
     * @returns {undefined}
     */
    setEvents: function() {

    },
    /**
     * Funzione per il recupero del valore della concentrazione.
     * @returns {NS_GAMMA_KG.concentrazione} il valore della concentrazione.
     */
    getConcentrazione: function() {
        return NS_GAMMA_KG.concentrazione;
    },
    /**
     * Funzione per il recupero del valore della dose.
     * @returns {NS_GAMMA_KG.dose} il valore della dose.
     */
    getDose: function() {
        return NS_GAMMA_KG.dose;
    },
    /**
     * Funzione per il recupero del valore della dose farmaco.
     * @returns {NS_GAMMA_KG.doseFarmaco} il valore della dose farmaco.
     */
    getDoseFarmaco: function() {
        return NS_GAMMA_KG.doseFarmaco;
    },
    /**
     * Funzione per il recupero del valore della durata.
     * @returns {NS_GAMMA_KG.durata} il valore della durata.
     */
    getDurata: function() {
        return NS_GAMMA_KG.durata;
    },
    /**
     * Funzione per il recupero del valore del peso.
     * @returns {NS_GAMMA_KG.peso} il valore del peso.
     */
    getPeso: function() {
        return NS_GAMMA_KG.peso;
    },
    /**
     * Funzione per il recupero del valore della scala concentrazione.
     * @returns {NS_GAMMA_KG.scalaConcentrazione} il valore della scala concentrazione.
     */
    getScalaConcentrazione: function() {
        return NS_GAMMA_KG.scalaConcentrazione;
    },
    /**
     * Funzione per il recupero del valore della scala dose.
     * @returns {NS_GAMMA_KG.scalaDose} il valore della scala dose.
     */
    getScalaDose: function() {
        return NS_GAMMA_KG.scalaDose;
    },
    /**
     * Funzione per il recupero del valore della velocità.
     * @returns {NS_GAMMA_KG.velocita} il valore della velocità.
     */
    getVelocita: function() {
        return NS_GAMMA_KG.velocita;
    },
    /**
     * Funzione per il recupero del valore del volume totale.
     * @returns {NS_GAMMA_KG.volumeTotale} il valore del volume totale.
     */
    getVolumeTotale: function() {
        return NS_GAMMA_KG.volumeTotale;
    },
    /**
     * Funzione per settare il valore della concentrazione.
     * @param {type} pConcentrazione
     * @returns {undefined}
     */
    setConcentrazione: function(pConcentrazione) {
        NS_GAMMA_KG.concentrazione = pConcentrazione;
    },
    /**
     * Funzione per settare il valore della dose.
     * @param {type} pDose
     * @returns {undefined}
     */
    setDose: function(pDose) {
        NS_GAMMA_KG.dose = pDose;
    },
    /**
     * Funzione per settare il valore della dose farmaco.
     * @param {type} pDoseFarmaco
     * @returns {undefined}
     */
    setDoseFarmaco: function(pDoseFarmaco) {
        NS_GAMMA_KG.doseFarmaco = pDoseFarmaco;
    },
    /**
     * Funzione per settare il valore della durata.
     * @param {type} pDurata
     * @returns {undefined}
     */
    setDurata: function(pDurata) {
        NS_GAMMA_KG.durata = pDurata;
    },
    /**
     * Funzione per settare il valore del peso.
     * @param {type} pPeso
     * @returns {undefined}
     */
    setPeso: function(pPeso) {
        NS_GAMMA_KG.peso = pPeso;
    },
    /**
     * Funzione per settare il valore della scala concentrazione.
     * @param {type} pScalaConcentrazione
     * @returns {undefined}
     */
    setScalaConcentrazione: function(pScalaConcentrazione) {
        NS_GAMMA_KG.scalaConcentrazione = pScalaConcentrazione;
    },
    /**
     * Funzione per settare il valore della scala dose.
     * @param {type} pScalaDose
     * @returns {undefined}
     */
    setScalaDose: function(pScalaDose) {
        NS_GAMMA_KG.scalaDose = pScalaDose;
    },
    /**
     * Funzione per settare il valore della velocità.
     * @param {type} pVelocita
     * @returns {undefined}
     */
    setVelocita: function(pVelocita) {
        NS_GAMMA_KG.velocita = pVelocita;
    },
    /**
     * Funzione per settare il valore del volume totale.
     * @param {type} pVolumeTotale
     * @returns {undefined}
     */
    setVolumeTotale: function(pVolumeTotale) {
        NS_GAMMA_KG.volumeTotale = pVolumeTotale;
    }
};

/**
 * DOSAGGIO
 * @type type
 */
var NS_TERAPIA_DOSAGGIO = {
    mcg_min: 0.06,
    mcg_ora: 0.001,
    mg_UI_min: 60,
    mg_UI_ora: 1,
    /**
     * Funzione di inizializzazione del DOSAGGIO.
     * @returns {undefined}
     */
    init: function() {
        //alert('NS_TERAPIA_DOSAGGIO.init()');
        top.Terapie.logger.debug('NS_TERAPIA_DOSAGGIO.init()');

        switch (document.EXTERN.PROCEDURA.value) {
            // In LETTURA non abilito nulla per la dose.
            case 'LETTURA':
                break;
            // In MODIFICA abilito la gestione degli eventi per la dose.
            case 'MODIFICA':
                NS_TERAPIA_DOSAGGIO.setEvents();
                break;
            // In MODELLO provo a calcolare la concentrazione nel caso in cui abbia i tutti i parametri a disposizione.
            case 'MODELLO':
                // Recupero il peso se salvato nei parametri vitali
                var rs = top.executeQuery("parametri.xml", "getLastWeight", document.EXTERN.IDEN_VISITA.value);
                $('div[cls="UserInput"] input[name="Peso"]').val(rs.next() ? rs.getString("PESO") : '');

                if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_DOSAGGIO.getPeso())) {
                    if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_CONCENTRAZIONE.getSoluto()) && NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_VELOCITA.getVelocita())) {
                        NS_TERAPIA_DOSAGGIO.setDose(NS_TERAPIA_DOSAGGIO.calculates());
                    } else if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_CONCENTRAZIONE.getSoluto()) && NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_DOSAGGIO.getDose()())) {
                        NS_TERAPIA_VELOCITA.setVelocita(NS_TERAPIA_VELOCITA.calculates());
                    } else if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_CONCENTRAZIONE.getSoluto()) && NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_VELOCITA.getDurata())) {
                        $('div[cls="UserInput"] input[name="Durata"]').trigger('focus').trigger('blur');
                    }
                } else {
                    NS_TERAPIA_DOSAGGIO.reset();
                }

                NS_TERAPIA_DOSAGGIO.setEvents();
                break;
            // Altrimenti abilito la gestione degli eventi per la dose.      
            default:
                // Recupero il peso se salvato nei parametri vitali
                var rs = top.executeQuery("parametri.xml", "getLastWeight", document.EXTERN.IDEN_VISITA.value);
                $('div[cls="UserInput"] input[name="Peso"]').val(rs.next() ? rs.getString("PESO") : '');

                NS_TERAPIA_DOSAGGIO.setEvents();
                break;
        }
    },
    /**
     * Funzione per la gestione degli eventi associati al DOSAGGIO.
     * @returns {undefined}
     */
    setEvents: function() {
        //alert('NS_TERAPIA_DOSAGGIO.setEvents()');
        top.Terapie.logger.debug('NS_TERAPIA_DOSAGGIO.setEvents()');

        $('div[cls="UserInput"] input[name="Dose"], div[cls="UserInput"] select[name="scalaDose"]').unbind('focusin');
        /**
         * Il PESO è il primo campo da valorizzare per la composizione ed il calcolo del DOSAGGIO
         */
        $('div[cls="UserInput"] input[name="Dose"], div[cls="UserInput"] select[name="scalaDose"]').focusin(function() {
            if (!NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_DOSAGGIO.getPeso())) {
                alert("ATTENZIONE: inserire prima il peso del paziente!");
                $('div[cls="UserInput"] input[name="Peso"]').focus();
            }
        });

        $('div[cls="UserInput"] input[name="Dose"]').unbind('focusout');
        /**
         * Quando valorizzo la DOSE controllo tutti gli altri campi di INPUT per il calcolo del DOSAGGIO,
         * - se gli INPUT del DOSAGGIO e della CONCENTRAZIONE sono compilati calcolo la VELOCITA
         * - se solo gli INPUT del DOSAGGIO sono compilati, resetto la CONCENTRAZIONE
         * - altrimenti resetto la VELOCITA
         */
        $('div[cls="UserInput"] input[name="Dose"]').focusout(function() {
            if (NS_TERAPIA_DOSAGGIO.ctrl(NS_TERAPIA_DOSAGGIO.getDose(), NS_TERAPIA_DOSAGGIO.getPeso()) && NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_CONCENTRAZIONE.getSoluto())) {
                NS_TERAPIA_VELOCITA.setVelocita(NS_TERAPIA_VELOCITA.calculates());
            } else if (NS_TERAPIA_DOSAGGIO.ctrl(NS_TERAPIA_DOSAGGIO.getDose(), NS_TERAPIA_DOSAGGIO.getPeso())) {
                NS_TERAPIA_CONCENTRAZIONE.reset();
            } else {
                NS_TERAPIA_VELOCITA.reset();
            }
        });

        $('div[cls="UserInput"] select[name="scalaDose"]').unbind('change');
        /**
         * Quando cambio la SCALA DOSE controllo se il PESO è valorizzato correttamente:
         * - se la CONCENTRAZIONE e la VELOCITA sono valorizzate correttamente  [== TRUE, calcolo DOSAGGIO]
         * - se la CONCENTRAZIONE e il DOSAGGIO sono valorizzate correttamente  [== TRUE, calcolo VELOCITA]
         * - se la CONCENTRAZIONE e la DURATA sono valorizzate correttamente    [== TRUE, calcolo VELOCITA e DOSAGGIO]
         * altrimenti resetto DOSAGGIO
         */
        $('div[cls="UserInput"] select[name="scalaDose"]').change(function() {
            if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_DOSAGGIO.getPeso())) {
                if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_CONCENTRAZIONE.getSoluto()) && NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_VELOCITA.getVelocita())) {
                    NS_TERAPIA_DOSAGGIO.setDose(NS_TERAPIA_DOSAGGIO.calculates());
                } else if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_CONCENTRAZIONE.getSoluto()) && NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_DOSAGGIO.getDose())) {
                    NS_TERAPIA_VELOCITA.setVelocita(NS_TERAPIA_VELOCITA.calculates());
                } else if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_CONCENTRAZIONE.getSoluto()) && NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_VELOCITA.getDurata())) {
                    $('div[cls="UserInput"] input[name="Durata"]').trigger('focus').trigger('blur');
                }
            } else {
                NS_TERAPIA_DOSAGGIO.reset();
            }
        });

        $('div[cls="UserInput"] input[name="Peso"]').unbind('focusout');
        /**
         * Se il PESO è valorizzato correttamente:
         * - se la CONCENTRAZIONE e la VELOCITA sono valorizzate correttamente  [== TRUE, calcolo DOSAGGIO]
         * - se la CONCENTRAZIONE e il DOSAGGIO sono valorizzate correttamente  [== TRUE, calcolo VELOCITA]
         * - se la CONCENTRAZIONE e la DURATA sono valorizzate correttamente    [== TRUE, calcolo VELOCITA e DOSAGGIO]
         * altrimenti resetto DOSAGGIO
         */
        $('div[cls="UserInput"] input[name="Peso"]').focusout(function() {
            if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_DOSAGGIO.getPeso())) {
                if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_CONCENTRAZIONE.getSoluto()) && NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_VELOCITA.getVelocita())) {
                    NS_TERAPIA_DOSAGGIO.setDose(NS_TERAPIA_DOSAGGIO.calculates());
                } else if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_CONCENTRAZIONE.getSoluto()) && NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_DOSAGGIO.getDose())) {
                    NS_TERAPIA_VELOCITA.setVelocita(NS_TERAPIA_VELOCITA.calculates());
                } else if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_CONCENTRAZIONE.getSoluto()) && NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_VELOCITA.getDurata())) {
                    $('div[cls="UserInput"] input[name="Durata"]').trigger('focus').trigger('blur');
                }
            } else {
                NS_TERAPIA_DOSAGGIO.reset();
            }
        });
    },
    /**
     * Funzione per il calcolo della DOSE.
     * @param {type} pScalaDose
     * @param {type} pPeso
     * @param {type} pConcentrazione
     * @param {type} pVelocita 
     * @returns {Number|String} la DOSE calcolata (approssimata).
     */
    calculates: function(pScalaDose, pPeso, pConcentrazione, pVelocita) {
        //alert('NS_TERAPIA_DOSAGGIO.calculates(pScalaDose, pPeso, pConcentrazione, pVelocita)');
        top.Terapie.logger.debug('NS_TERAPIA_DOSAGGIO.calculates(pScalaDose, pPeso, pConcentrazione, pVelocita)');

        var dose = '';
        var velocita = pVelocita !== undefined && pVelocita != null ? pVelocita : NS_TERAPIA_VELOCITA.getVelocita();
        var concentrazione = pConcentrazione !== undefined && pConcentrazione != null ? pConcentrazione : NS_TERAPIA_CONCENTRAZIONE.getConcentrazione();
        var scalaDose = pScalaDose !== undefined && pScalaDose != null ? pScalaDose : NS_TERAPIA_DOSAGGIO.getScalaDose();
        var peso = NS_TERAPIA_DOSAGGIO.getPesoFormula(scalaDose, pPeso !== undefined && pPeso != null ? pPeso : NS_TERAPIA_DOSAGGIO.getPeso());

        // Calcolo dose
        switch (scalaDose) {
            case '1':
            case '7':
                dose = NS_TERAPIA_FUNZIONI.roundToX(((velocita * concentrazione) / peso) * (1 / NS_TERAPIA_DOSAGGIO.mcg_min), 3, 3);
                break;
            case '2':
            case '8':
                dose = NS_TERAPIA_FUNZIONI.roundToX(((velocita * concentrazione) / peso) * (1 / NS_TERAPIA_DOSAGGIO.mcg_ora), 3, 3);
                break;
            case '3':
            case '5':
            case '9':
                dose = NS_TERAPIA_FUNZIONI.roundToX(((velocita * concentrazione) / peso) * (1 / NS_TERAPIA_DOSAGGIO.mg_UI_min), 3, 3);
                break;
            case '4':
            case '6':
            case '10':
            case '11':
                dose = NS_TERAPIA_FUNZIONI.roundToX(((velocita * concentrazione) / peso) * (1 / NS_TERAPIA_DOSAGGIO.mg_UI_ora), 3, 3);
                break;
        }

        return dose;
    },
    /**
     * Funzione per il controllo dei valori della DOSE e del PESO per il calcolo del DOSAGGIO.
     * @param {type} pDose
     * @param {type} pPeso
     * @returns {Boolean} TRUE se tutti gli INPUT sono valorizzati, FALSE altrimenti.
     */
    ctrl: function(pDose, pPeso) {
        //alert('NS_TERAPIA_DOSAGGIO.ctrl(pDose, pPeso)');
        top.Terapie.logger.debug('NS_TERAPIA_DOSAGGIO.ctrl(pDose, pPeso)');

        return NS_TERAPIA_FUNZIONI.ctrlInputValue(pDose) && NS_TERAPIA_FUNZIONI.ctrlInputValue(pPeso);
    },
    /**
     * Funzione per il recupero del valore della DOSE.
     * @returns {jQuery} il valore della DOSE.
     */
    getDose: function() {
        //alert('NS_TERAPIA_DOSAGGIO.getDose()');
        top.Terapie.logger.debug('NS_TERAPIA_DOSAGGIO.getDose()');

        return $('div[cls="UserInput"] input[name="Dose"]').val();
    },
    /**
     * Funzione per il recupero del valore del PESO.
     * @returns {jQuery} il valore del PESO.
     */
    getPeso: function() {
        //alert('NS_TERAPIA_DOSAGGIO.getPeso()');
        top.Terapie.logger.debug('NS_TERAPIA_DOSAGGIO.getPeso()');

        return $('div[cls="UserInput"] input[name="Peso"]').val();
    },
    /**
     * Funzione per recuperare il "PESO" sulla base della SCALA DOSE selezionata [return 1 per le scale senza peso].
     * @param {type} pScalaDose
     * @param {type} pPeso
     * @returns {String|Number} il PESO sulla base della SCALA DOSE selezionata.
     */
    getPesoFormula: function(pScalaDose, pPeso) {
        //alert('NS_TERAPIA_DOSAGGIO.getPesoFormula(pScalaDose, pPeso)');
        top.Terapie.logger.debug('NS_TERAPIA_DOSAGGIO.getPesoFormula(pScalaDose, pPeso)');

        var peso = '';
        var scalaDose = pScalaDose;

        switch (scalaDose) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
                peso = pPeso;
                break;
            default:
                peso = 1;
        }

        return peso;
    },
    /**
     * Funzione per il recupero del valore della SCALA DOSE.
     * @returns {jQuery} il valore della SCALA DOSE.
     */
    getScalaDose: function() {
        //alert('NS_TERAPIA_DOSAGGIO.getScalaDose()');
        top.Terapie.logger.debug('NS_TERAPIA_DOSAGGIO.getScalaDose()');

        return $('div[cls="UserInput"] select[name="scalaDose"] option:selected').val();
    },
    /**
     * Funzione per settare il valore della DOSE.
     * @param {type} pDose valore della DOSE da settare.
     * @returns {undefined}
     */
    setDose: function(pDose) {
        //alert('NS_TERAPIA_DOSAGGIO.setDose(pDose)');
        top.Terapie.logger.debug('NS_TERAPIA_DOSAGGIO.setDose(pDose)');

        $('div[cls="UserInput"] input[name="Dose"]').val(pDose);
    },
    /**
     * Funzione per il reset del valore della DOSE.
     * @returns {undefined}
     */
    reset: function() {
        //alert('NS_TERAPIA_DOSAGGIO.reset()');
        top.Terapie.logger.debug('NS_TERAPIA_DOSAGGIO.reset()');

        $('div[cls="UserInput"] input[name="Dose"]').val('');
    }
};

/**
 * CONCENTRAZIONE.
 * @type type
 */
var NS_TERAPIA_CONCENTRAZIONE = {
    /**
     * Funzione di inizializzazione della CONCENTRAZIONE.
     * @returns {undefined}
     */
    init: function() {
        //alert('NS_TERAPIA_CONCENTRAZIONE.init()');
        top.Terapie.logger.debug('NS_TERAPIA_CONCENTRAZIONE.init()');

        $('div[cls="GruppoFarmaci"][tipo="2"]').is(":empty") ? null : NS_TERAPIA_FUNZIONI.removeScalaSolvente();
        $('div[cls="GruppoFarmaci"][tipo="3"]').is(":empty") ? null : NS_TERAPIA_FUNZIONI.removeScalaSoluto();

        switch (document.EXTERN.PROCEDURA.value) {
            // In LETTURA non abilito nulla per la concentrazione.
            case 'LETTURA':
                break;
            // In MODIFICA abilito la gestione degli eventi per la concentrazione.
            case 'MODIFICA':
                NS_TERAPIA_CONCENTRAZIONE.setEvents();
                break;
            // In MODELLO provo a calcolare la concentrazione nel caso in cui abbia i tutti i parametri a disposizione.    
            case 'MODELLO':
                if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_CONCENTRAZIONE.getSoluto())) {
                    NS_TERAPIA_CONCENTRAZIONE.setConcentrazione(NS_TERAPIA_CONCENTRAZIONE.calculates());
                } else {
                    NS_TERAPIA_CONCENTRAZIONE.reset();
                }

                NS_TERAPIA_CONCENTRAZIONE.setEvents();
                break;
            // Altrimenti abilito la gestione degli eventi per la concentrazione.    
            default:
                NS_TERAPIA_CONCENTRAZIONE.setEvents();
                break;
        }
    },
    /**
     * Funzione per la gestione degli eventi associati alla CONCENTRAZIONE.
     * @returns {undefined}
     */
    setEvents: function() {
        //alert('NS_TERAPIA_CONCENTRAZIONE.setEvents()');
        top.Terapie.logger.debug('NS_TERAPIA_CONCENTRAZIONE.setEvents()');

        $('div[cls="GruppoFarmaci"] div[cls="Farmaco"] input[name="DoseFarmaco"]').unbind('change');
        /**
         * Quando valorizzo il SOLUTO/SOLVENTE controllo tutti gli altri campi di INPUT per il calcolo della CONCENTRAZIONE:
         * - TRUE, calcolo la CONCENTRAZIONE e:
         *      - se i campi di INPUT del DOSAGGIO sono OK, calcolo la VELOCITA, altrimenti
         *      - se il PESO e la VELOCITA sono OK, calcolo la DOSE, altrimenti
         *      - se la DURATA è OK, "calcolo" la VELOCITA e se il PESO è OK si calcola in automatico la DOSE
         * - FALSE, resetto CONCENTRAZIONE
         */
        $('div[cls="GruppoFarmaci"] div[cls="Farmaco"] input[name="DoseFarmaco"]').change(function() {
            if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_CONCENTRAZIONE.getSoluto())) {
                NS_TERAPIA_CONCENTRAZIONE.setConcentrazione(NS_TERAPIA_CONCENTRAZIONE.calculates());

                var dosaggio = NS_TERAPIA_DOSAGGIO.ctrl(NS_TERAPIA_DOSAGGIO.getDose(), NS_TERAPIA_DOSAGGIO.getPeso());
                var peso = NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_DOSAGGIO.getPeso());
                var velocita = NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_VELOCITA.getVelocita());
                var durata = NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_VELOCITA.getDurata());

                peso && velocita ? NS_TERAPIA_DOSAGGIO.setDose(NS_TERAPIA_DOSAGGIO.calculates()) : null;
                dosaggio && !velocita ? NS_TERAPIA_VELOCITA.setVelocita(NS_TERAPIA_VELOCITA.calculates()) : null;
                !dosaggio && !velocita && durata ? $('div[cls="UserInput"] input[name="Durata"]').trigger('focus').trigger('blur') : null;
            } else {
                NS_TERAPIA_CONCENTRAZIONE.reset();
                NS_TERAPIA_DOSAGGIO.reset()
            }
        });

        $('div[cls="UserInput"] select[name="scalaConcentrazione"]').unbind('change');
        /**
         * Quando cambio la SCALA CONCENTRAZIONE modifico la SCALA SOLUTO e la SCALA DOSE
         */
        $('div[cls="UserInput"] select[name="scalaConcentrazione"]').change(function() {
            switch ($(this).find("option:selected").text()) {
                case 'mg/ml':
                    $('div[cls="GruppoFarmaci"][tipo="3"] div[name="UdmFarmaco"] select[name="UdmFarmaco"] option[label="mg"]').attr('selected', true);
                    break;
                case 'UI/ml':
                    $('div[cls="GruppoFarmaci"][tipo="3"] div[name="UdmFarmaco"] select[name="UdmFarmaco"] option[label="UI"]').attr('selected', true);
                    break;
            }
            NS_TERAPIA_FUNZIONI.setScalaDose();
        });
    },
    /**
     * Funzione per il calcolo della CONCENTRAZIONE.
     * @returns {String|Number} la CONCENTRAZIONE calcolata (approssimata).
     */
    calculates: function() {
        //alert('NS_TERAPIA_CONCENTRAZIONE.calculates()');
        top.Terapie.logger.debug('NS_TERAPIA_CONCENTRAZIONE.calculates()');

        var concentrazione = '';
        var solvente = NS_TERAPIA_VELOCITA.getVolumeTotale();
        var soluto = NS_TERAPIA_CONCENTRAZIONE.getSoluto();

        concentrazione = NS_TERAPIA_FUNZIONI.concentrazione(soluto, solvente == undefined ? 50 : solvente);

        return concentrazione;
    },
    /**
     * Funzione per il controllo della valorizzazione dei valori di INPUT per il calcolo del CONCENTRAZIONE.
     * @param {type} pSolvente
     * @param {type} pSoluto
     * @returns {Boolean} TRUE se tutti gli INPUT sono valorizzati, FALSE altrimenti.
     */
    ctrl: function(pSolvente, pSoluto) {
        //alert('NS_TERAPIA_CONCENTRAZIONE.ctrl(pSolvente, pSoluto)');
        top.Terapie.logger.debug('NS_TERAPIA_CONCENTRAZIONE.ctrl(pSolvente, pSoluto)');

        return NS_TERAPIA_FUNZIONI.ctrlInputValue(pSolvente) && NS_TERAPIA_FUNZIONI.ctrlInputValue(pSoluto);
    },
    /**
     * Funzione per il recupero del valore della CONCENTRAZIONE.
     * @returns {jQuery} il valore della CONCENTRAZIONE.
     */
    getConcentrazione: function() {
        //alert('NS_TERAPIA_CONCENTRAZIONE.getConcentrazione()');
        top.Terapie.logger.debug('NS_TERAPIA_CONCENTRAZIONE.getConcentrazione()');

        return $('div[cls="UserInput"] input[name="Concentrazione"]').val();
    },
    /**
     * Funzione per il recupero del valore della SCALA CONCENTRAZIONE.
     * @returns {jQuery} il valore della SCALA CONCENTRAZIONE.
     */
    getScalaConcentrazione: function() {
        //alert('NS_TERAPIA_CONCENTRAZIONE.getScalaConcentrazione()');
        top.Terapie.logger.debug('NS_TERAPIA_CONCENTRAZIONE.getScalaConcentrazione()');

        return $('div[cls="UserInput"] select[name="scalaConcentrazione"] option:selected').val();
    },
    /**
     * Funzione per il recupero del valore del SOLUTO.
     * @returns {jQuery} il valore SOLUTO.
     */
    getSoluto: function() {
        //alert('NS_TERAPIA_CONCENTRAZIONE.getSoluto()');
        top.Terapie.logger.debug('NS_TERAPIA_CONCENTRAZIONE.getSoluto()');

        return $('div[cls="GruppoFarmaci"][tipo="3"] div[cls="Farmaco"] input[name="DoseFarmaco"]').val();
    },
    /**
     * Funzione per il recupero del valore del SOLVENTE.
     * @returns {jQuery} il valore del SOLVENTE.
     */
    getSolvente: function() {
        //alert('NS_TERAPIA_CONCENTRAZIONE.getSolvente()');
        top.Terapie.logger.debug('NS_TERAPIA_CONCENTRAZIONE.getSolvente()');

        return $('div[cls="GruppoFarmaci"][tipo="2"] div[cls="Farmaco"] input[name="DoseFarmaco"]').val();
    },
    /**
     * Funzione per settare il valore della CONCENTRAZIONE.
     * @param {type} pConcentrazione valore della CONCENTRAZIONE da settare.
     * @returns {undefined}
     */
    setConcentrazione: function(pConcentrazione) {
        //alert('NS_TERAPIA_CONCENTRAZIONE.setConcentrazione(pConcentrazione)');
        top.Terapie.logger.debug('NS_TERAPIA_CONCENTRAZIONE.setConcentrazione(pConcentrazione)');

        $('div[cls="UserInput"] input[name="Concentrazione"]').val(pConcentrazione);
    },
    /**
     * Funzione per il reset del valore della CONCENTRAZIONE.
     * @returns {undefined}
     */
    reset: function() {
        //alert('NS_TERAPIA_CONCENTRAZIONE.reset()');
        top.Terapie.logger.debug('NS_TERAPIA_CONCENTRAZIONE.reset()');

        $('div[cls="UserInput"] input[name="Concentrazione"]').val('');
    }
};

/**
 * VELOCITA.
 * @type type
 */
var NS_TERAPIA_VELOCITA = {
    /**
     * Funzione di inizializzazione della VELOCITA.
     * @returns {undefined}
     */
    init: function() {
        //alert('NS_TERAPIA_VELOCITA.init()');
        top.Terapie.logger.debug('NS_TERAPIA_VELOCITA.init()');

        switch (document.EXTERN.PROCEDURA.value) {
            // In LETTURA non abilito nulla per la velocità.
            case 'LETTURA':
                break;
            // In MODIFICA abilito la gestione degli eventi per la velocità.
            case 'MODIFICA':
                NS_TERAPIA_VELOCITA.setEvents();
                break;
            // In MODELLO provo a calcolare la velocità nel caso in cui abbia i tutti i parametri a disposizione.
            case 'MODELLO':
                if (NS_TERAPIA_DOSAGGIO.ctrl(NS_TERAPIA_DOSAGGIO.getDose(), NS_TERAPIA_DOSAGGIO.getPeso())
                        && NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_CONCENTRAZIONE.getSoluto())
                        && !NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_VELOCITA.getVelocita())) {
                    NS_TERAPIA_VELOCITA.setVelocita(NS_TERAPIA_VELOCITA.calculates());
                }

                NS_TERAPIA_VELOCITA.setEvents();
                break;
            // Altrimenti abilito la gestione degli eventi per la velocità.
            default:
                NS_TERAPIA_VELOCITA.setEvents();
                break;
        }
    },
    /**
     * Funzione per la gestione degli eventi associati alla VELOCITA.
     * @returns {undefined}
     */
    setEvents: function() {
        //alert('NS_TERAPIA_VELOCITA.setEvents()');
        top.Terapie.logger.debug('NS_TERAPIA_VELOCITA.setEvents()');

        $('div[cls="UserInput"] input[name="Velocita"]').unbind('change');
        /**
         * Quando valorizzo la VELOCITA controllo tutti gli altri campi di INPUT per il calcolo della DOSE:
         * - TRUE, calcolo la DOSE
         * - FALSE, resetto la DOSE
         */
        $('div[cls="UserInput"] input[name="Velocita"]').change(function() {
            if (NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_VELOCITA.getVelocita()) && NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_CONCENTRAZIONE.getSoluto()) && NS_TERAPIA_FUNZIONI.ctrlInputValue(NS_TERAPIA_DOSAGGIO.getPeso())) {
                NS_TERAPIA_DOSAGGIO.setDose(NS_TERAPIA_DOSAGGIO.calculates());
            } else {
                NS_TERAPIA_DOSAGGIO.reset();
            }
        });
    },
    /**
     * Funzione per il calcolo della VELOCITA.
     * @param {type} pDose
     * @param {type} pScalaDose
     * @param {type} pPeso
     * @param {type} pConcentrazione
     * @returns {Number|String} la VELOCITA calcolata (approssimata).
     */
    calculates: function(pDose, pScalaDose, pPeso, pConcentrazione) {
        //alert('NS_TERAPIA_VELOCITA.calculates(pDose, pScalaDose, pPeso, pConcentrazione)');
        top.Terapie.logger.debug('NS_TERAPIA_VELOCITA.calculates(pDose, pScalaDose, pPeso, pConcentrazione)');

        var velocita = '';
        var dose = NS_TERAPIA_DOSAGGIO.getDose();
        var concentrazione = pConcentrazione !== undefined && pConcentrazione != null ? pConcentrazione : NS_TERAPIA_CONCENTRAZIONE.getConcentrazione();
        var scalaDose = pScalaDose !== undefined && pScalaDose != null ? pScalaDose : NS_TERAPIA_DOSAGGIO.getScalaDose();
        var peso = NS_TERAPIA_DOSAGGIO.getPesoFormula(scalaDose, pPeso !== undefined && pPeso != null ? pPeso : NS_TERAPIA_DOSAGGIO.getPeso());

        // Calcolo velocita
        switch (scalaDose) {
            case '1':
            case '7':
                velocita = NS_TERAPIA_FUNZIONI.roundToX((NS_TERAPIA_FUNZIONI.dosaggio(dose, peso) / concentrazione) * NS_TERAPIA_DOSAGGIO.mcg_min, 3, 3);
                break;
            case '2':
            case '8':
                velocita = NS_TERAPIA_FUNZIONI.roundToX((NS_TERAPIA_FUNZIONI.dosaggio(dose, peso) / concentrazione) * NS_TERAPIA_DOSAGGIO.mcg_ora, 3, 3);
                break;
            case '3':
            case '5':
            case '9':
                velocita = NS_TERAPIA_FUNZIONI.roundToX((NS_TERAPIA_FUNZIONI.dosaggio(dose, peso) / concentrazione) * NS_TERAPIA_DOSAGGIO.mg_UI_min, 3, 3);
                break;
            case '4':
            case '6':
            case '10':
            case '11':
                velocita = NS_TERAPIA_FUNZIONI.roundToX((NS_TERAPIA_FUNZIONI.dosaggio(dose, peso) / concentrazione) * NS_TERAPIA_DOSAGGIO.mg_UI_ora, 3, 3);
                break;
        }

        return velocita;
    },
    /**
     * Funzione per il recupero del valore della DURATA.
     * @returns {jQuery} il valore della DURATA.
     */
    getDurata: function() {
        //alert('NS_TERAPIA_VELOCITA.getDurata()');
        top.Terapie.logger.debug('NS_TERAPIA_VELOCITA.getDurata()');

        return $('div[cls="UserInput"] input[name="Durata"]').val();
    },
    /**
     * Funzione per il recupero del valore della VELOCITA.
     * @returns {jQuery} il valore della VELOCITA.
     */
    getVelocita: function() {
        //alert('NS_TERAPIA_VELOCITA.getVelocita()');
        top.Terapie.logger.debug('NS_TERAPIA_VELOCITA.getVelocita()');

        return $('div[cls="UserInput"] input[name="Velocita"]').val();
    },
    /**
     * Funzione per il recupero del valore del VOLUME TOTALE.
     * @returns {jQuery} il valore del VOLUME TOTALE.
     */
    getVolumeTotale: function() {
        //alert('NS_TERAPIA_VELOCITA.getVolumeTotale()');
        top.Terapie.logger.debug('NS_TERAPIA_VELOCITA.getVolumeTotale()');

        return $('div[cls="UserInput"] input[name="VolumeTotale"]').val();
    },
    /**
     * Funzione per settare il valore della VELOCITA.
     * @param {type} pVelocita valore della VELOCITA da settare.
     * @returns {undefined}
     */
    setVelocita: function(pVelocita) {
        //alert('NS_TERAPIA_VELOCITA.setVelocita(pVelocita)');
        top.Terapie.logger.debug('NS_TERAPIA_VELOCITA.setVelocita(pVelocita)');

        $('div[cls="UserInput"] input[name="Velocita"]').val(pVelocita);
        $('div[cls="UserInput"] input[name="Velocita"]').trigger('change');
        velocita.setDurata();
    },
    /**
     * Funzione per i reset dei valori della VELOCITA e della DURATA.
     * @returns {undefined}
     */
    reset: function() {
        //alert('NS_TERAPIA_VELOCITA.reset()');
        top.Terapie.logger.debug('NS_TERAPIA_VELOCITA.reset()');

        $('div[cls="UserInput"] input[name="Velocita"]').val('');
        $('div[cls="UserInput"] input[name="Velocita"]').trigger('change');
        velocita.setDurata();
    }
};