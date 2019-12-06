/**
 * User: matteopi
 * Date: 24/01/13
 * Time: 9.41
 */

var WindowCartella = null;
jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
});


var NS_DIARI = {

    pagina:{

        inserisciMedico:function(parametri){

        },
        inserisciInfermiere:function(parametri){

        },
        inserisciDieta:function(parametri){
            /*
             parametri= {
             iden_visita: <valore>
             [,callBackOk:<function>]
             }
             */
            var vUrl = NS_DIARI.getUrlSchedaDieta({
                iden_visita:parametri.iden_visita
            });

            NS_DIARI.apriFancybox({
                url:vUrl,
                callBack:parametri.callBackOk
            });

        },
        modificaDieta:function(){

            var vUrl = NS_DIARI.getUrlSchedaDieta({
                iden_visita:WindowCartella.getAccesso("IDEN"),
                id:stringa_codici(array_iden_diario)
            });
            NS_DIARI.apriFancybox({
                url:vUrl,
                callBack:NS_WK_DIETA.refresh
            });
        }

    },

    getUrlWk:function(pTipoDiario, parametri){

        switch (pTipoDiario){
            case 'MEDICO':
                NS_DIARI.pagina.inserisciMedico(parametri);
                break;
            case 'INFERMIERE':
                NS_DIARI.pagina.inserisciInfermiere(parametri);
                break;
            case 'DIETA':
                NS_DIARI.pagina.inserisciDieta(parametri);
                break;
            default:
                alert('Tipologia non riconosciuta');
        }

    },

    getUrlWkMedico:function(parametri){

    },

    getUrlWkInfermiere:function(parametri){

    },

    getUrlWkDieta:function(parametri){
        /*
         parametri= {
         iden_ricovero: <valore>
         }
         */
        return 'servletGenerator?' +
            'KEY_LEGAME=WORKLIST&' +
            'TIPO_WK=WK_DIETA&' +
            'ILLUMINA=javascript:illumina(this.sectionRowIndex);&' +
            'WHERE_WK= where CONTENUTO IS NOT NULL and iden_ricovero = '+ parametri.iden_ricovero+'&VISUALIZZA_WK=S';
    },

    getUrlScheda:function(pTipoDiario,parametri){

        switch (pTipoDiario){
            case 'MEDICO':
                NS_DIARI.getUrlSchedaMedico(parametri);
                break;
            case 'INFERMIERE':
                NS_DIARI.getUrlSchedaInfermiere(parametri);
                break;
            case 'DIETA':
                NS_DIARI.getUrlSchedaDieta(parametri);
                break;
            default:
                alert('Tipologia non riconosciuta');
        }

    },

    getUrlSchedaMedico:function(){

    },

    getUrlSchedaInfermiere:function(){

    },

    getUrlSchedaDieta:function(parametri){
        /*
         parametri= {
         iden_visita: <valore>
         [id: <valore>]
         }
         */
        return 'servletGenerator?' +
            'KEY_LEGAME=SCHEDA_DIETA&' +
            'KEY_IDEN_VISITA='+parametri.iden_visita+'&' +
            'KEY_TIPO_DIARIO=DIETA&' +
            'VISUALIZZA_WK=N'+ (typeof parametri.id == 'undefined'?"":("&KEY_ID="+parametri.id));
    },

    apriFancybox:function(parametri){
        /*
         parametri= {
         url: <valore>
         [callBack: <valore> ]
         }
         */

        parametri.callBack = (typeof parametri.callBack != 'function') ? function(){} : parametri.callBack;
        WindowCartella.$.fancybox({
            'padding'	: 3,
            'width'		: 1024,
            'height'	: 140,
            'href'		: parametri.url,
            'type'		: 'iframe',
            'onCleanup' : parametri.callBack
        });
    }

};