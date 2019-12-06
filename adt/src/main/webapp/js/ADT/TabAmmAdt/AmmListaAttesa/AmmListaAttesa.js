/**
 * User: matteopi
 * Date: 15/10/13
 * Time: 12.18
 */
var nome_lista = '';
var reparti = '';
jQuery(document).ready(function () {

    if(document.getElementById('STATO_PAGINA').value == 'I'){
        NS_AMM_LISTA_ATTESA_INS.init();
        NS_AMM_LISTA_ATTESA_INS.event();
        NS_FENIX_SCHEDA.registra = NS_AMM_LISTA_ATTESA_INS.registra;
    }else{
        NS_AMM_LISTA_ATTESA_EDIT.init();
        NS_AMM_LISTA_ATTESA_EDIT.event();
        NS_FENIX_SCHEDA.registra = NS_AMM_LISTA_ATTESA_EDIT.registra;
    }

        top.NS_CONSOLEJS.addLogger({name:'HOME_LISTA_ATTESA',console:0});
        window.logger = top.NS_CONSOLEJS.loggers['HOME_LISTA_ATTESA'];

});

var NS_AMM_LISTA_ATTESA_INS = {
    init : function () {

    },
    event: function () {

    },
    registra:function(){

        dwr.engine.setAsync(false);
        presalvataggio();
        var param =
        {
            PDESCR :nome_lista,
            pidensprovenienza : reparti

        }

        toolKitDB.executeProcedureDatasource("ADT_LISTA_ATTESA.ADDLIST","ADT",param,function(resp){
            if (resp.p_result!='OK'){
                logger.error(JSON.stringify(resp));
                home.NOTIFICA.error({message: 'Errore nell\' aggiunta della nuova lista',timeout: 5, title: "Error"});
            }else{
                home.NOTIFICA.success({message: 'Salvataggio effettuato correttamente', timeout: 2, title: 'Success'});
                var params = {'refresh':true}
                NS_FENIX_SCHEDA.chiudi(params);
            }

        });
        dwr.engine.setAsync(true);

    }
}
var NS_AMM_LISTA_ATTESA_EDIT = {
    init : function () {

        $('#txtNome').attr('readonly','readonly');
        var iden_reparti = document.getElementById('iden_prov').value;
        var descrizione_reparti = document.getElementById('descr_prov').value;
//        alert('iden_reparti ' + iden_reparti +'\n descrizione_reparti ' +descrizione_reparti);
        NS_AMM_LISTA_ATTESA_EDIT.valorizeReparti(iden_reparti,descrizione_reparti);
    },
    event: function () {

    },
    registra:function(){

        var iden_lista = document.getElementById('IDEN').value
        dwr.engine.setAsync(false);
        presalvataggio();

        var param =
        {
            PIDENTIPI :iden_lista,
            pidenprovenienza:reparti

        }

        toolKitDB.executeProcedureDatasource("ADT_LISTA_ATTESA.EDITREP","ADT",param,function(resp){

            if (resp.p_result!='OK'){
                home.NOTIFICA.error({message: 'Errore nell\'a modifica dei reparti',timeout: 5, title: "Error"});
            }else{
                home.NOTIFICA.success({message: 'Salvataggio effettuato correttamente', timeout: 2, title: 'Success'});
                var params = {'refresh':true}
                NS_FENIX_SCHEDA.chiudi(params);
            }

        });
        dwr.engine.setAsync(true);

    },
    valorizeReparti:function(array_iden, array_descr){
        var descrs = array_descr.split(',');
        var idens =  array_iden.replace(/\[iden_pro:/g,',').replace(/\]/g,'').substring(1).split(',');
        for(var i = 0; i<idens.length; i++){
            var reparto = 'Reparto'+(i+1);
            $('#'+reparto).val(descrs[i]).attr('data-c-value',idens[i]);
            $('#h-'+reparto).val(descrs[i]).attr('data-c-value',idens[i]);
        }
    }
}

function presalvataggio(){
    reparti = '';
    nome_lista = document.getElementById('txtNome').value;

    $('.campi tbody').each(function(i){
        var reparto = $('#Reparto'+i).attr("data-c-value");

        if(reparto != 'undefined' && typeof  reparto != 'undefined' && $('#Reparto'+i).val() != ''){
            reparti = reparti + '[iden_pro:'+reparto+']';
        }
    });
}


