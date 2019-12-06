/**
 * Created by matteo.pipitone on 03/04/2015.
 */

var NS_CONTROLLI = {
    /**
     * controlla se ha un valore
     * @param value
     * @returns {boolean}
     */
    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value) && ("undefined" !== value) && ("null" !== value) && (typeof undefined !== value));
    },
    /**
     * controlla se è un number
     * @param value
     * @returns {boolean}
     */
    isANumber : function(value){
        return ( (!isNaN(value)) && (NS_CONTROLLI.hasAValue(value)) )
    },
    /**
     * controllo generale di un parametro
     * @param value
     * @param maxValue
     * @returns {boolean}
     */

    controlParametro: function(value, maxValue){
        if(typeof maxValue == 'undefined') {
            maxValue = 1000;
        }
        value = value.replace(/ /g, "");

        return ((!isNaN(value)) && (value.length<=3) && (value <= maxValue) && Number(value)>= 0);
    },
    /**
     * controlla che la freq respiratoria sia di max 2 cifre
     * @param value
     * @returns {boolean}
     */
    controlloFreqRespiratoria : function(value){

        return ((!isNaN(value)) && (value.length<=2) && Number(value) >= 0 && Number(value) <= 35);

    },

    /**
     * controlla che la saturazione sia compresa tra 0-100
     * @param value
     * @returns {boolean}
     */
    controlloSaturazione : function(value){
        value = value.replace(/ /g, "");
        return (value>0 && value<=100 && value >= 30);
    },
    /**
     * controllo che la temperatura sia nei parametri normali da 33° a 42° C
     * @param temperatura
     * @return {boolean}
     */

    controlloTemperatura : function(temperatura){

        var boolean = null;
        temperatura = temperatura.replace(',', '.');
        temperatura = temperatura.replace(/ /g, "");

        var count = (temperatura.match(/\./g) || []).length;
        /** Controllo che la stringa non contenga caratteri prima di farle il parseFloat **/


        if(/^-?\d+\.?\d*$/.test(''+temperatura+'')){

            temperatura = parseFloat(temperatura);
            boolean = true;
        }
        else{
            boolean = false;
        }

        return ((temperatura>=33) && (temperatura<=42) && (count<=1) && boolean);

    },
    /**
     * Controlla che la pressione max sia superiore alla min, altrimenti torna false
     * @returns {boolean}
     * @param pmax
     * @param pmin
     */
    controlloPressione:function(pmax, pmin) {
        logger.debug('pmax ->' + pmax  + ' pmin-> '+ pmin );

        if(pmin == '' ){
            pmin = 0;
        }


        return (
            /*NS_CONTROLLI.isANumber(Number(pmax)) && NS_CONTROLLI.isANumber(Number(pmin)) &&  */
            pmax < 301 && pmin < 201 && Number(pmax) >= Number(pmin)  &&  pmax >= 0 &&  pmin >= 0
            )



    },

    controlloFreqCardiaca : function (value) {

        return ((!isNaN(value)) && (value <= 400) && value >= 0 );

    }
};
