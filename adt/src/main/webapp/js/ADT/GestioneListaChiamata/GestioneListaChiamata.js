/**
 * Created by matteo.pipitone on 06/11/2014.
 * js che gestisce le liste d'attesa
 */
$(document).ready(function(){

    top.NS_CONSOLEJS.addLogger({name:'GESTIONE_LISTA_CHIAMATA',console:0});
    window.logger = top.NS_CONSOLEJS.loggers['GESTIONE_LISTA_CHIAMATA'];

    NS_GESTIONE_LISTA_CHIAMATA.init();
    NS_GESTIONE_LISTA_CHIAMATA.setEvents();
    NS_FENIX_SCHEDA.registra = NS_GESTIONE_LISTA_CHIAMATA.registra;


});

var NS_GESTIONE_LISTA_CHIAMATA = {


    init:function(){
        NS_GESTIONE_LISTA_CHIAMATA.valorizeListe();

    },
    setEvents:function(){

    },

    registra:function(){

        var ID_WK = $("#txtIdWk").val();
        var CODICE_ORMA = $("#txtCodiceOrma").val();
        var LISTA_CHIAMATA = $("#h-radSiNoListaChiamata").val();
        var ID_TEMPLATE = $("#txtIdTemplate").val();
        var ABILITA_RICOVERO = $("#h-radSiNoRicovero").val();
        var NUMERO_PAZIENTI = $("#txtNumeroPazienti").val();

        var DESCR = $("#txtNome").val();
        var LISTE =  NS_GESTIONE_LISTA_CHIAMATA.getListe();

        var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
        var  params =    {
            pIdWk                      : {t: 'V', v: ID_WK, d: 'I'},
            pCODICE                    : {t: 'V', v: CODICE_ORMA, d: 'I'},
            pLISTA_CHIAMATA            : {t: 'V', v: LISTA_CHIAMATA, d: 'I'},
            pABILITA_RICOVERO          : {t: 'V', v: ABILITA_RICOVERO, d: 'I'},
            pNUMERO_PAZIENTI           : {t: 'N', v: parseInt(NUMERO_PAZIENTI), d: 'I'},
            pASSIGNING_AUTHORITY_AREA  : {t: 'V', v: "ADT", d: 'I'},
            //pArrayCdcPrericovero       : {t: 'A', v: pArrayCdcPrericovero, d: 'I'},
            PDESCR                     : {t: 'V', v: DESCR, d: 'I'},
            pIdenTemplate              : {t: 'V', v: ID_TEMPLATE, d: 'I'},
            pArrayListe                : {t: 'A', v: LISTE, d: 'I'},
            p_result                   : {t:'V',d:'O'},
            PIDENLISTA                 : {t: 'N', v: parseInt($("#IDEN").val()), d: 'I'}
        };

        //return alert(params);
        var xhr =  db.call_procedure(
            {
                id       : 'LISTA_ATTESA_GESTIONE.EDITLIST',
                parameter:  params
            });

        xhr.done(function (data, textStatus, jqXHR) {
//            alert(data);
            var resp = data.p_result.split('|');

            if(resp[0] == 'OK'){
              logger.info(JSON.stringify(data));
              home.NOTIFICA.success({message: "Salvataggio effettuato correttamente", timeout: 3, title: 'Success'});
              home.NS_HOME_AMM.caricaWkListaChiamata();
              NS_FENIX_SCHEDA.chiudi({refresh:true});
            }else{
                logger.error(JSON.stringify(data));
                alert('Errore guardare la console');
            };

        });

        xhr.fail(function (response) {
            logger.error(JSON.stringify(response));
            home.NOTIFICA.error({ title: "Attenzione", message: 'Errore GUARDARE LA CONSOLLE' });
        });
    },
    getListe : function(){
        /*
         * che ritorna l'array di reparti
         */
        var liste = [];

        $('.campi tbody').each(function(i){
            var lista = $('#Lista'+i).attr("data-c-value");

            if(lista != 'undefined' && typeof  lista != 'undefined' && $('#Lista'+i).val() != ''){
                liste.push(lista);
            }
        });

        return liste;
    },
    valorizeListe:function(){
        /*
         * funzione che prende l'array di iden e descr lo splitta e valorizza gli autocomplete
         */
        //alert("valorizeListe");
        var descrs =  jsonData.descr_liste.split(',');
        var idens =  jsonData.iden_liste.split(',');

        for(var i = 0; i<idens.length; i++){
            var reparto = 'Lista'+(i+1);
            $('#'+reparto).val(descrs[i]).attr('data-c-value',idens[i]);
            $('#h-'+reparto).val(descrs[i]).attr('data-c-value',idens[i]);
        }
    }

};
