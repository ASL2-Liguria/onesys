var NS_CHECK = {

    msgError:{

        Generic:{
            ASSENZA_DATA:		'Nessuna data indicata',
            ASSENZA_ORA:		'Nessuna ora indicata'
        },

        Ricovero:{
            DIMESSO:			'Il ricovero indicato risulta dimesso',
            NESSUNA_SELEZIONE:	'Nessun ricovero selezionato',
            DATA:               'Attenzione si vuole modificare un\' appuntamento di un ricoverò già chiuso'
        },

        Appuntamento:{
            NESSUNA_SELEZIONE:	'Nessun appuntamento selezionato',
            DATA_GIA_SEGNALATA:	"E' già  stato segnalato un appuntamento nella data indicata"
        },

        Accesso:{
            NESSUNA_SELEZIONE:	'Nessun accesso selezionato',
            DATA_GIA_SEGNALATA:	"E' già  stato segnalato un accesso nella data indicata",
            PRESENZA_DIPENDENZE_VISITA: "Sono presenti dati legati all'accesso selezionato"
        }

    },

    msgConfirm:{
        Appuntamento:{
            PRESENZA_ACCESSO:   "E' segnalato un accesso relativo all'appuntamento selezionato. Procedere alla sua rimozione?",
            SEGNALAZIONE:		"Si conferma la segnalazione dell'appuntamento?",
            RIMOZIONE:			"Si vuole procedere alla rimozione dell'appuntamento?"
        },

        Accesso:{
            SEGNALAZIONE:		"Si conferma la segnalazione dell'accesso?",
            RIMOZIONE:			"Si vuole procedere alla rimozione dell'accesso?"
        }

    },

    Generic:{

        data:function(pParam){
            if(typeof pParam.data == 'undefined' || pParam.data == ''){
                alert(NS_CHECK.msgError.Generic.ASSENZA_DATA);
                return false;
            }
            return true;
        },

        ora:function(pParam){
            if(typeof pParam.ora == 'undefined' || pParam.ora == ''){
                alert(NS_CHECK.msgError.Generic.ASSENZA_ORA);
                return false;
            }
            return true;
        }
    },

    Ricovero:{

        selezione:function(pParam){
            if(typeof pParam.iden_ricovero == 'undefined' || pParam.iden_ricovero == null){
                alert(NS_CHECK.msgError.Ricovero.NESSUNA_SELEZIONE);
                return false;
            }
            return true;
        },

        dimesso:function(pParam){
            if(typeof pParam.dimesso != 'undefined' && ( pParam.dimesso!='S' || pParam.dimesso == false )){
                return true;
            }else{
                alert(NS_CHECK.msgError.Ricovero.DIMESSO);
                return false;
            }
        },
        checkdata:function(pParam){
            if(typeof pParam.data_fine_ricovero != 'undefined' || pParam.data_fine_ricovero == false ){
                return true;
            }else{
                alert(NS_CHECK.msgError.Ricovero.DATA);
                return false;
            }
        }

    },

    Appuntamento:{

        selezione:function(pParam){
            if(typeof pParam.iden_appuntamento == 'undefined' || pParam.iden_appuntamento == null){
                alert(NS_CHECK.msgError.Appuntamento.NESSUNA_SELEZIONE);
                return false;
            }
            return true;
        }

    },

    Accesso:{

        selezione:function(pParam){
            if(typeof pParam.iden_accesso == 'undefined' || pParam.iden_accesso == null){
                alert(NS_CHECK.msgError.Accesso.NESSUNA_SELEZIONE);
                return false;
            }
            return true;
        }

    }

};

var APPUNTAMENTI = {

    pagina:{//gestione delle modifiche tramite pagina

        set:function(pParam,pWindow){//{iden_ricovero,dimesso,[data],[ora],[accesso]}
            if(!NS_CHECK.Ricovero.selezione(pParam))return;
            if(!NS_CHECK.Ricovero.dimesso(pParam))return;
            if(!NS_CHECK.Ricovero.checkdata(pParam))return;
            pWindow = (typeof pWindow == 'undefined'?pWindow = top:pWindow);
            FANCYBOX.open({win:pWindow,url:APPUNTAMENTI.pagina.getUrl(pParam),callBack:pParam.callBack});
        },

        edit:function(pParam,pWindow){//{iden_ricovero,iden_appuntamento,[data],[ora],[accesso]}
            if(!NS_CHECK.Appuntamento.selezione(pParam))return;
            APPUNTAMENTI.pagina.set(pParam,pWindow,pParam.callBack);
        },

        remove:function(pParam){//{iden_appuntamento,iden_accesso,iden_visita,dimesso[,lbltitolo][,callBackOk][,callBackKo]}


            top.FancyboxParameters = {

                functionregistra: function (parameters) {

                    var vMotivo = parameters.testo;
                    var vIden = pParam.iden_appuntamento;
                    var vIdenPer = parameters.idenper ;

                    var vResp = top.executeStatement("AccessiAppuntamenti.xml", "delAppuntamento", [ vIden, vIdenPer, vMotivo, ], 2);
                    if (vResp[0] == 'KO') {
                        alert(vResp[1]);
                    } else {
                        top.$.fancybox.close();
                    }

                }
            };
            if (typeof pParam.lbltitolo=='undefined'){pParam.lbltitolo = '&nbsp;'};
            var pUrl = 'servletGenerator?KEY_LEGAME=MOTIVO_CANCELLAZIONE&KEY_ID=&lblTitolo='+ pParam.lbltitolo;

            var paramFancy = ({
                url: pUrl,
                win: top,
                height: 135,
                width: 750,
                callBack: function () {
                    document.location.reload();
                }
            });

            if (pParam.iden_accesso == '') {

                var rs = top.executeStatement("AccessiAppuntamenti.xml", "controlloAppuntamentoDipendenze", [pParam.iden_appuntamento], 1);

                if (rs[2] != null) {
                    return alert(rs[2]);
                }
                FANCYBOX.open(paramFancy); //{url,[win],[height],[width],[callBack]}

            }else if (pParam.iden_accesso !=''){

                if (confirm(NS_CHECK.msgConfirm.Appuntamento.PRESENZA_ACCESSO)){

                    ACCESSI.sql.remove({//{dimesso,iden_accesso,[callBackOk],[callBackKo]}
                        dimesso:pParam.dimesso,
                        iden_accesso: pParam.iden_visita,
                        callBackOk:function(){
                            FANCYBOX.open(paramFancy); //{url,[win],[height],[width],[callBack]}
                        },
                        callBackKo:function(){
                            alert("Errore nella cancellazione dell'accesso");
                        }
                    });
                }
            }
        },

        getUrl:function(pParam){
            var vUrl = "servletGenerator?KEY_LEGAME=INSERIMENTO_APPUNTAMENTO";
            vUrl += "&IDEN_VISITA="+		(typeof pParam.iden_ricovero=='undefined'		? "" : pParam.iden_ricovero);
            vUrl += "&IDEN_APPUNTAMENTO="+	(typeof pParam.iden_appuntamento=='undefined'	? "" : pParam.iden_appuntamento);
            vUrl += "&IDEN_ANAG="+			(typeof pParam.iden_anag=='undefined'			? "" : pParam.iden_anag);
            vUrl += "&DATA="+				(typeof pParam.data=='undefined'				? "" : pParam.data);
            vUrl += "&ORA="+				(typeof pParam.ora=='undefined'					? "" : pParam.ora);
            vUrl += "&ACCESSO="+			(typeof pParam.accesso=='undefined'				? "N": pParam.accesso);
            vUrl += "&DIMESSO="+            (typeof pParam.dimesso=='undefined'             ? "" : pParam.dimesso);
            vUrl += "&DATA_FINE_RICOVERO="+ (typeof pParam.data_fine_ricovero=='undefined'  ? "" : pParam.data_fine_ricovero);

            return vUrl;
        }
    },

    sql:{//gesitone delle modifiche tramite sql

        set:function(pParam){//{dimesso,iden_ricovero,data,ora,[reparto],[note],[nota_breve],[accesso],[callBackOk],[callBackKo]}
            if(!NS_CHECK.Ricovero.selezione(pParam))return;
            if(!NS_CHECK.Ricovero.dimesso(pParam))return;
            if(!NS_CHECK.Generic.data(pParam))return;
            if(!NS_CHECK.Generic.ora(pParam))return;

            var vResp = top.executeStatement("AccessiAppuntamenti.xml" , "setAppuntamento" , [
                (typeof pParam.iden_appuntamento != 'undefined'?pParam.iden_appuntamento:''),
                pParam.ora,
                (typeof pParam.reparto != 'undefined'?pParam.reparto:''),
                (typeof pParam.accesso != 'undefined'?pParam.accesso:''),
                (typeof pParam.note != 'undefined'?pParam.note:''),
                pParam.data,
                pParam.iden_ricovero,
                (typeof pParam.nota_breve != 'undefined'?pParam.nota_breve:''),
                top.baseUser.IDEN_PER
            ] , 1);

            if(vResp[0]=='KO'){
                if (vResp[1].indexOf('DATA_ERRORE') != '-1'){
                    alert('La data scelta ha giÃ  un appuntamento salvato');
                }else if(vResp[1].indexOf('DIPENDENZE_ACCESSO')!= '-1'){
                    alert("Si sta cercando di rimuovere un accesso al quale afferiscono dati.\nContattare l'amministratore di sistema");
                }else{
                    alert(vResp[1]);
                }
                CALLBACK.triggerKO(pParam,vResp);
            }else{
                CALLBACK.triggerOK(pParam,vResp);
            }
        },

        setBatch:function(pParam) {
            if(!NS_CHECK.Ricovero.selezione(pParam[0]))return;
            if(!NS_CHECK.Ricovero.dimesso(pParam[0]))return;

            var sqlBinds = new Array();
            for (var i=0; i<pParam.length; i++) {

                var iParam=pParam[i];
                if(!NS_CHECK.Generic.data(pParam[i]))return;
                if(!NS_CHECK.Generic.ora(pParam[i]))return;

                sqlBinds.push([
                    (typeof iParam.iden_appuntamento != 'undefined'?iParam.iden_appuntamento:''),
                    iParam.ora,
                    (typeof iParam.reparto != 'undefined'?iParam.reparto:''),
                    (typeof iParam.accesso != 'undefined'?iParam.accesso:''),
                    (typeof iParam.note != 'undefined'?iParam.note:''),
                    iParam.data,
                    iParam.iden_ricovero,
                    (typeof iParam.nota_breve != 'undefined'?iParam.nota_breve:''),
                    top.baseUser.IDEN_PER
                ]);
            }

            var vResp = top.executeBatchStatement("AccessiAppuntamenti.xml" , "setAppuntamento" , sqlBinds, 1);
            if(vResp[0][0]=='KO'){
                if (vResp[0][1].indexOf('DATA_ERRORE') != '-1'){
                	var data=vResp[0][1].substr(vResp[0][1].indexOf('#')+1,8);
                    alert('Il paziente ha già un appuntamento salvato per il '+data.substr(6,2)+'/'+data.substr(4,2)+'/'+data.substr(0,4));
                }else if(vResp[0][1].indexOf('DIPENDENZE_ACCESSO')!= '-1'){
                    alert("Si sta cercando di rimuovere un accesso al quale afferiscono dati.\nContattare l'amministratore di sistema");
                }else{
                    alert(vResp[0][1]);
                }
                CALLBACK.triggerKO(pParam[0],vResp);
            }else{
                CALLBACK.triggerOK(pParam[0],vResp);
            }

        },

        edit:function(pParam){//{dimesso,iden_ricovero,iden_appuntamento,data,ora,[reparto],[note],[nota_breve],[accesso],[callBackOk],[callBackKo]}
            if(!NS_CHECK.Appuntamento.selezione(pParam))return;
            APPUNTAMENTI.sql.set(pParam);
        },


//Da chiamare esclusivamente se si Ã¨ certi che non vi siano accessi associati

        removeSenzaAccesso:function(pParam){//{iden_appuntamento, motivo_canc, [callBackOk],[callBackKo]}

            var pBindsVariable =   [pParam.iden_appuntamento,top.baseUser.IDEN_PER,pParam.motivo_canc];
            var vResp = top.executeStatement("AccessiAppuntamenti.xml","delAppuntamento",pBindsVariable,2);
            if(vResp[0]=='KO'){
                alert(vResp[1]);
                if(typeof pParam.callBackKo == 'function'){
                    CALLBACK.triggerKO(pParam,vResp);
                }
            }else{
                if(vResp[2]=='KO'){
                    alert(vResp[3]);
                    CALLBACK.triggerKO(pParam,vResp);
                }else{
                    CALLBACK.triggerOK(pParam,vResp);
                }
            }
        },

        exist:function(pParam){//{iden_ricovero,data}
            if(!NS_CHECK.Ricovero.selezione(pParam))return false;
            if(!NS_CHECK.Appuntamento.data(pParam))return false;

            var rs = top.executeQuery("AccessiAppuntamenti.xml","existAppuntamento",[pParam.iden_ricovero,pParam.data]);
            return rs.next();
        }
    }


};

var ACCESSI = {

    pagina:{//gesitone delle modifiche tramite pagina

        set:function(){},

        edit:function(){},

        remove:function(){}

    },

    sql:{//gesitone delle modifiche tramite sql

        set:function(pParam){//{dimesso,iden_ricovero,data,ora,note,nota_breve,[checkExistAppuntamento],[checkExistAccesso],[callBackOk],[callBackKo]}
            if(!NS_CHECK.Ricovero.selezione(pParam))return;
            if(!NS_CHECK.Ricovero.dimesso(pParam))return;
            if(!NS_CHECK.Generic.data(pParam))return;

            if(typeof pParam.checkExistAccesso != 'function'){
                pParam.checkExistAccesso = function(){return ACCESSI.sql.exist({iden_ricovero:pParam.iden_ricovero,data:pParam.data});};
            }
            if(pParam.checkExistAccesso())return alert(NS_CHECK.msgError.Accesso.DATA_GIA_SEGNALATA);

            if(typeof pParam.checkExistAppuntamento != 'function'){
                pParam.checkExistAppuntamento = function(){return APPUNTAMENTI.sql.exist({iden_ricovero:pParam.iden_ricovero,data:pParam.data});};
            }
            if(!pParam.checkExistAppuntamento())return alert(NS_CHECK.msgError.Appuntamento.NESSUNA_SELEZIONE);

            if(typeof pParam.note == 'undefined'){
                pParam.note = '';
            }
            if(typeof pParam.nota_breve == 'undefined'){
                pParam.nota_breve = '';
            }

            var vResp = top.executeStatement("AccessiAppuntamenti.xml","setAccesso",[pParam.iden_ricovero,pParam.data,pParam.ora,pParam.note,pParam.nota_breve],1);
            if(vResp[0]=='KO'){
                alert(vResp[1]);
                CALLBACK.triggerKO(pParam,vResp);
            }else{
                CALLBACK.triggerOK(pParam,vResp);
            }
        },

        edit:function(){
        },

        remove:function(pParam){//{dimesso,iden_accesso,[callBackOk],[callBackKo]}
            if(!NS_CHECK.Accesso.selezione(pParam))return;
            if(!NS_CHECK.Ricovero.dimesso(pParam))return;

            var rs = top.executeQuery("AccessiAppuntamenti.xml","checkDatiAccesso",[pParam.iden_accesso]);
            if(!rs.isValid){
                alert(rs.getError());
                CALLBACK.triggerKO(pParam,null);
            }else{
                if(rs.next() && rs.getInt("DATI_ACCESSO") == 0){
                    var vResp = top.executeStatement("AccessiAppuntamenti.xml","delAccesso",[pParam.iden_accesso]);
                    CALLBACK.triggerOK(pParam,vResp);
                }else{
                    alert(NS_CHECK.msgError.Accesso.PRESENZA_DIPENDENZE_VISITA);
                    CALLBACK.triggerKO(pParam,vResp);
                }

            }
        },

        exist:function(pParam){//{iden_ricovero,data}
            if(!NS_CHECK.Ricovero.selezione(pParam))return;
            if(!NS_CHECK.Generic.data(pParam))return false;

            rs = top.executeQuery("AccessiAppuntamenti.xml","existAccesso",[pParam.iden_ricovero,pParam.data]);
            return rs.next();
        }

    }

};

var CALLBACK = {

    triggerOK : function(pParam,pResp){
        if(typeof pParam.callBackOk == 'function'){
            pParam.callBackOk(pResp);
        }
    },

    triggerKO : function(pParam,pResp){
        if(typeof pParam.callBackKo == 'function'){
            pParam.callBackKo(pResp);
        }
    }
};

var FANCYBOX = {
    open:function(pParam){//{url,[win],[height],[width],[callBack]}
        var vWindow =(pParam.win!='undefined'?pParam.win:window);
        var vBody = vWindow.document.body;
        vWindow.$.fancybox({
            'padding': 	3,
            'width':	(typeof pParam.width=='undefined'?vBody.offsetWidth/100*95:pParam.width),
            'height':	(typeof pParam.height=='undefined'?vBody.offsetHeight/100*95:pParam.height),
            'href':		pParam.url,
            'type':		'iframe',
            'onClosed':	(typeof pParam.callBack == 'function' ? pParam.callBack : function(){})
        });
    }
};

function MultiSubstring(pValue,pRanges){//[	[0,1,'/'] ] begin-end -delimiter
    var StringOut = '';
    for (var i = 0 ; i < pRanges.length ; i++){
        StringOut += pValue.substring(pRanges[i][0],pRanges[i][1]) + (typeof pRanges[i][2] != 'undefined' ? pRanges[i][2]: '')
    }
    return StringOut;
}