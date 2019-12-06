/**
 * Created by matteo.pipitone on 18/01/2016.
 */

var DATE_CONTROL = {
    equalsDate : function(json){
        if(DATE_CONTROL.checkParam(json.date1) && DATE_CONTROL.checkParam(json.date2)) {

            var annomesegiornodt1 = DATE_CONTROL.getAnnoMeseGiornoOraMinuti(json.date1);
            var annomesegiornodt2 = DATE_CONTROL.getAnnoMeseGiornoOraMinuti(json.date2);

            var data1 = new Date(annomesegiornodt1.ANNO,annomesegiornodt1.MESE,annomesegiornodt1.GIORNO, annomesegiornodt1.ORA, annomesegiornodt1.MINUTI);
            var data2 = new Date(annomesegiornodt2.ANNO,annomesegiornodt2.MESE,annomesegiornodt2.GIORNO, annomesegiornodt2.ORA, annomesegiornodt2.MINUTI);

            return data1.getTime() == data2.getTime();
        }
    },
    /**
     *  data1 è la data che deve essere maggiore di data2
     *  data2 deve essere minore di data1
     *  date1 varchar dd/mm/yyyy
     *  date2 varchar dd/mm/yyyy
     *
     * @param json
     * @return boolean
     * */
    checkBetwen2Date : function (json) {

        if(DATE_CONTROL.checkParam(json.date1) && DATE_CONTROL.checkParam(json.date2)){
            var annomesegiornodt1 = DATE_CONTROL.getAnnoMeseGiornoOraMinuti(json.date1); //data dimissione
            var annomesegiornodt2 = DATE_CONTROL.getAnnoMeseGiornoOraMinuti(json.date2); //data valorizazione

            var data1 = new Date(annomesegiornodt1.ANNO,Number(annomesegiornodt1.MESE)-1,annomesegiornodt1.GIORNO, annomesegiornodt1.ORA, annomesegiornodt1.MINUTI);
            var data2 = new Date(annomesegiornodt2.ANNO,Number(annomesegiornodt2.MESE)-1,annomesegiornodt2.GIORNO, annomesegiornodt2.ORA, annomesegiornodt2.MINUTI);
            /*
            console.log(data1);
            console.log(data2);
            */
            return  data1.getTime() >= data2.getTime();

        }else {
            alert(json);
            return false;
        }
    } ,
    /**
     * data1 è la data di partenza
     * date2 è la data da fare il confronto
     * date3 è la data minima (data di partenza >= della data minima)
     * range è il range che andrà aggiunto alla date1
     * date1 varchar dd/mm/yyyy
     * date2 varchar dd/mm/yyyy
     * rangeDate Number
     * @param json
     * @return boolean
     * */
    checkBetwen3Date : function (json) {
        //effettuo il controllo che i parametri siano validi
        //console.log(JSON.stringify(json));
        if(typeof json.rangeDate == 'undefined' ){
            json.rangeDate = 0;
        }
        /*
        console.log(DATE_CONTROL.checkParam(json.date1));
        console.log(DATE_CONTROL.checkParam(json.date2));
        console.log(DATE_CONTROL.checkParam(json.date3));
        console.log(DATE_CONTROL.checkParam(json.rangeDate));
         */
        if(DATE_CONTROL.checkParam(json.date1) && DATE_CONTROL.checkParam(json.date2) && DATE_CONTROL.checkParam(json.date3)/* && DATE_CONTROL.checkParam(json.rangeDate)*/){

            var annomesegiornodt1 = DATE_CONTROL.getAnnoMeseGiornoOraMinuti(json.date1); //data dimissione
            var annomesegiornodt2 = DATE_CONTROL.getAnnoMeseGiornoOraMinuti(json.date2); //data valorizazione
            var annomesegiornodt3 = DATE_CONTROL.getAnnoMeseGiornoOraMinuti(json.date3); //data apertura ricovero

            var data1 = new Date(annomesegiornodt1.ANNO,Number(annomesegiornodt1.MESE)-1,annomesegiornodt1.GIORNO, annomesegiornodt1.ORA, annomesegiornodt1.MINUTI);
            var data2 = new Date(annomesegiornodt2.ANNO,Number(annomesegiornodt2.MESE)-1,annomesegiornodt2.GIORNO, annomesegiornodt1.ORA , annomesegiornodt1.MINUTI);
            var data3 = new Date(annomesegiornodt3.ANNO,Number(annomesegiornodt3.MESE)-1,annomesegiornodt3.GIORNO, annomesegiornodt1.ORA, annomesegiornodt1.MINUTI);

            //aggiungo un mese alla data dimissione
            //data1.setMonth(data1.getMonth() + 1);

            data1.setDate(data1.getDate() + Number(json.rangeDate));
            //la data valorizzata deve essere minore di dimissione + 1 mese
            //la data valorizzata deve essere maggiore di data ricovero
             /*
            console.log(data1);
            console.log(data2);
            console.log(data3);
            console.log(data3.getTime() <= data2.getTime());
            console.log(data2.getTime() <= data1.getTime());
                     */


            return ( data3.getTime() <= data2.getTime() && data2.getTime()  <= data1.getTime() );
        }else{
            alert(json);
            //parametri errati
            return false;
        }

    },

    checkParam : function(p){

        if (typeof p !== 'undefined' && p !== '' && p != null){
            return p;
        }else{
            return false;
        }

    },
    /**
     * funzione che da una stringa torna il valore splittato in un json
     * torna il json {anno: "2016", mese: "01", giorno:"16"}
     * formati accettati HH24:MI DD/MM/YYYY,  DD/MM/YYYY,   YYYYMMDD HH24:MI,  YYYYMMDDD,
     * @param data
     * @return {}
     * */
    //formatoInput DD/MM/YYYY o YYYYMMDD
    getAnnoMeseGiornoOraMinuti: function (data) {
        //console.log("getAnnoMeseGiornoOraMinuti" + data);
        var DDMMYYYY = new RegExp("^[0-9]{2}\/[0-9]{2}\/[1-2]{1}[0-9]{3}$");
        var YYYYMMDD = new RegExp("^[1-2]{1}[0-9]{7}$");
        var DDMMYYYY_HHMM = new RegExp("^[0-9]{2}\/[0-9]{2}\/[1-2]{1}[0-9]{3} [0-2][0-9]:[0-9]{2}$");
        var HHMM_DDMMYYYY = new RegExp("^[0-9]{2}:[0-9]{2} [0-9]{2}\/[0-9]{2}\/[1-2]{1}[0-9]{3}$");
        var YYYYMMDD_HHMM = new RegExp("^[1-2]{1}[0-9]{7} [0-9]{2}:[0-9]{2}$");
        var YYYYMMDDHHmm = new RegExp("^[1-2]{1}[0-9]{7}[0-9]{2}:[0-9]{2}$");

        var anno = "", mese = "", giorno = "", ora = "", minuti = "", result = {};

        if(HHMM_DDMMYYYY.test(data)) {
            //HH24:MI DD/MM/YYYY        15:00 18/01/2016
            ora = data.substring(0, 2);
            minuti = data.substring(3, 5);
            giorno = data.substring(6, 8);
            mese = data.substring(9, 11);
            anno = data.substring(12, 16);

        } else if(YYYYMMDD_HHMM.test(data)) {
            //formato YYYYMMDD hh:mm
            //yyyyMMdd hh24:mi
            ora = data.substring(9, 11);
            minuti = data.substring(12, 14);
            giorno = data.substring(6, 8);
            mese = data.substring(4, 6);
            anno = data.substring(0, 4);
        } else if(YYYYMMDDHHmm.test(data)) {
            //YYYYMMDDHH:mm
            ora = data.substring(8, 10);
            minuti = data.substring(11, 13);
            giorno = data.substring(6, 8);
            mese = data.substring(4, 6);
            anno = data.substring(0, 4);

        } else if(YYYYMMDD.test(data)) {
            //formato YYYYMMDD
            giorno = data.substring(6, 8);
            mese = data.substring(4, 6);
            anno = data.substring(0, 4);

        }
        else if(DDMMYYYY.test(data)) {
            //formato data DD/MM/YYYY
            giorno = data.substring(0, 2);
            mese = data.substring(3, 5);
            anno = data.substring(6, 10);

        } else if(data instanceof Date) {
            //data = new Date(data);
            ora = data.getHours();
            minuti = data.getMinutes();
            giorno = data.getDate();
            mese = data.getMonth()+1;  //parte da 0
            anno = data.getFullYear();
        } else if(DDMMYYYY_HHMM.test(data)) {
            //22/01/2015 10:55
            ora = data.substring(11, 13);
            minuti = data.substring(14, 16);
            giorno = data.substring(0, 2);
            mese = data.substring(3, 5);
            anno = data.substring(6, 10);
        } else {

            alert("formato non riconosciuto " + data);
            //not implemented yet
        }

        result.ANNO = anno;
        result.MESE = mese;
        result.GIORNO = giorno;
        result.ORA = ora;
        result.MINUTI = minuti;
        return result;

    }

};