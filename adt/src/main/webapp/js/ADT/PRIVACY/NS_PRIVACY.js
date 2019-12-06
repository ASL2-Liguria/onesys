/**
 * Created by matteo.pipitone on 26/11/2014.
 */

$(document).ready(function(){
    NS_PRIVACY.init();
})
var NS_PRIVACY = {
    init:function(){
        home.NS_PRIVACY = this;
    },
    openPick :function(params) {
        /* struttura parametri che mi aspetto
         {
             tipoConsenso :'INSERIMENTO_CONSENSO_EVENTO',
             anagrafica : _JSON_ANAGRAFICA.id,
             cognome : _JSON_ANAGRAFICA.cognome,
             nome:_JSON_ANAGRAFICA.nome,
             sesso : _JSON_ANAGRAFICA.sesso,
             codice_fiscale : _JSON_ANAGRAFICA.codiceFiscale,
             comuneNascita:_JSON_ANAGRAFICA.comuneNascita.codice,
             codice : data.contatto.id,
             callback : NS_FENIX_SCHEDA.chiudi,
             paramsCallback : {'refresh':true}
         }
        */

        if(home.baseGlobal.ATTIVA_PRIVACY === 'S') {
            var vUrl = home.baseGlobal.URL_PIC + 'Autologin?';
            vUrl += 'username=' + home.baseUser.USERNAME;
            //alert(home.basePC.IP);
            vUrl += '&nomeHost=' + home.basePC.IP;
            switch (params.tipoConsenso) {
                case 'INSERIMENTO_CONSENSO_UNICO' :  // dalle wk
                    vUrl += '&scheda=CONSENSO_UNICO';
                    break;
                case 'INSERIMENTO_CONSENSO_EVENTO' : //inserimento ricovero
                    vUrl += '&scheda=CONSENSO_EVENTO';
                    break;
                case 'INSERIMENTO_CONSENSO_DOCUMENTO' :
                    vUrl += '&scheda=CONSENSO_DOCUMENTO';
                    break;
                default:
                    alert(params.tipoConsenso + ' non riconosciuto');
                    break;
            }

            vUrl += encodeURIComponent('&ACTION=' + params.action);
            vUrl += encodeURIComponent('&ASSIGNING_AUTHORITY=' + 'ADT');
            vUrl += encodeURIComponent('&ANAGRAFICA=' + (typeof params.anagrafica == 'undefined' ? '' : params.anagrafica));
            vUrl += encodeURIComponent('&COGNOME=' + (typeof params.cognome == 'undefined' ? '' : params.cognome));
            vUrl += encodeURIComponent('&NOME=' + (typeof params.nome == 'undefined' ? '' : params.nome));
            vUrl += encodeURIComponent('&DATA_NASCITA=' +  (typeof  params.data_nascita == 'undefined' ? '' : params.data_nascita));
            vUrl += encodeURIComponent('&SESSO=' + (typeof params.sesso == 'undefined' ? '' : params.sesso));
            vUrl += encodeURIComponent('&CODICE_FISCALE=' + (typeof params.codiceFiscale == 'undefined' ? '' : params.codiceFiscale));
            vUrl += encodeURIComponent('&COM_NASC=' + (typeof params.comuneNascita == 'undefined' ? '' : params.comuneNascita));
            vUrl += encodeURIComponent('&NOSOLOGICO_PAZIENTE=' + (typeof params.codice == 'undefined' ? '' : params.codice));
            //top.NS_FENIX_TOP.apriPagina({url:vUrl,id:'PIC',fullscreen:true})
            //alert(vUrl);
            openAndCloseWindow(vUrl,'portaleConsensi',"fullscreen=yes scrollbars=no",params.callback, params.paramsCallback);
            //return true;
        }else{
            typeof params.paramsCallback=='undefined'?params.callback():params.callback(params.paramsCallback);
        }
    }

}


function openAndCloseWindow(uri, name, options, closeCallback,paramCallback) {
    //alert("openAndCloseWindow");
    var win = window.open(uri, name, options);
    var interval = window.setInterval(function() {
        try {
            if (win == null || win.closed) {
                window.clearInterval(interval);
                typeof paramCallback=='undefined'?closeCallback():closeCallback(paramCallback);
            }
        }
        catch (e) {}
    }, 1000);
    return win;
}
