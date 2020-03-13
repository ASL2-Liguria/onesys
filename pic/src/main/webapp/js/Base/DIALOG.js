var DIALOG={
    /*[loadUser]
     [loadUserReadonly]
     [callback]
     */
    si_no: function (p)
    {
        LIB.checkParameter(p, "title", traduzione.lblConferma);
        LIB.checkParameter(p, "msg", traduzione.lblConfirmOperazione);
        LIB.checkParameter(p, "cbkSi", null);
        LIB.checkParameter(p, "cbkNo", null);

        $.dialog(p.msg,
            {
                title: p.title,
                showBtnClose: false,
                buttons: [
                    {"label": traduzione.lblSi, "action": function (ctx)
                    {

                        if(typeof p.cbkSi == 'function')
                            p.cbkSi(p);
                        ctx.data.close();
                    }},
                    {"label": traduzione.lblNo, "action": function (ctx)
                    {


                        if(typeof p.cbkNo == 'function')
                            p.cbkNo(p);
                        ctx.data.close();

                        return false;
                    }}
                ],
                width: 300
            }
        );
    },
    autenticazioneFirmaRemota:function(param){
        var p=(!LIB.isValid(param))?{}:param;
        var frm = $(document.createElement('form'))
            .attr({"id": "frmDialog"})
            .append(
            $(document.createElement('p')).append(
                $(document.createElement('label')).attr({"for": "txtPass", "id": "lblPass"}).text("Password:"),
                $(document.createElement('input')).attr({"id": "txtPass", "name": "txtPass", "type": "password"})
            ),
            $(document.createElement('p')).append(
                $(document.createElement('label')).attr({"for": "txtOtp", "id": "lblOtp"}).text("OTP:"),
                $(document.createElement('input')).attr({"id": "txtOtp", "name": "txtOtp", "type": "text"})
            ),
            $(document.createElement('p')).append(
                $(document.createElement('span')).attr({"id": "errorMsg"}).addClass("colorRed"))
        );

        var txtUsr = frm.find('#txtPass');
        var txtPsw = frm.find('#txtOtp');
        var errorMsg = frm.find('#errorMsg');

        var static_config={
            showMask:false,
            id:"Dialog_autenticazione",
            title:"Autenticazione",
            width:250,
            showBtnClose:false,
            movable:true,
            buttons:[
                {label:"Verifica",action:function(ctx){p.callback(dial,dial.getForm());}},
                {label:"Annulla",action:function(ctx){dial.close();}}
            ]
        };
        var extended_config = $.extend({},static_config,p['config']);
        var dial = $.dialog(frm,extended_config);

        //continua di qui
    },
    autenticazione:function(param)
    {
        var p=(!LIB.isValid(param))?{}:param;
        LIB.checkParameter(p,"loadUser",false)
        LIB.checkParameter(p,"loadUserReadonly",false)
        LIB.checkParameter(p,"callback",null)
        LIB.checkParameter(p,"config",{});

        var frm = $(document.createElement('form'))
            .attr({"id": "frmDialog"})
            .append(
                $(document.createElement('p')).append(
                    $(document.createElement('label')).attr({"for": "txtUsr", "id": "lblUsr"}).text("Username:"),
                    $(document.createElement('input')).attr({"id": "txtUsr", "name": "txtUsr", "type": "text"})
                ),
                $(document.createElement('p')).append(
                    $(document.createElement('label')).attr({"for": "txtPsw", "id": "lblPsw"}).text("Password:"),
                    $(document.createElement('input')).attr({"id": "txtPsw", "name": "txtPsw", "type": "password"})
                ),
                $(document.createElement('p')).append(
                    $(document.createElement('span')).attr({"id": "errorMsg"}).addClass("colorRed"))
            );

        var txtUsr = frm.find('#txtUsr');
        var txtPsw = frm.find('#txtPsw');
        var errorMsg = frm.find('#errorMsg');

        var static_config={
            showMask:false,
            id:"Dialog_autenticazione",
                title:"Autenticazione",
            width:250,
            showBtnClose:false,
            movable:true,
            buttons:[
                {label:"Verifica",action:function(ctx){checkUserPsw(dial,dial.getForm())}},
                {label:"Annulla",action:function(ctx){dial.close();}}
            ]
        };
        var extended_config = $.extend({},static_config,p['config']);
        var dial = $.dialog(frm,extended_config);

        if (p.loadUser)
        {
            var user = (p.user)? p.user:baseUser.USERNAME;
            txtUsr.val(user);
            txtPsw.focus();
        }

        if (p.loadUserReadonly)
        {
            var user = (p.user)? p.user:baseUser.USERNAME;
            txtUsr.val(user).attr("readonly", "readonly");
            txtPsw.focus();
        }

        if (!p.loadUserReadonly && !p.loadUser)
            txtUsr.focus();

        $("#Dialog_autenticazione").on("keyEnter", txtPsw, function (e)
        {
            checkUserPsw(dial,dial.getForm());
        });

        function checkUserPsw(ctx,data)
        {
            /*alert(data[0].value) alert(data[1].value) */
            var param = { "p_utente": data[0].value, "p_pwd": data[1].value };
            var msg="";
            toolKitDB.checkUserPsw("SP_CHECK_USER_PSW", "CONFIG_WEB", param, function (response)
            {

                if (LIB.isValid(response.p_result))
                {
                    var resp = response.p_result.toString().split("$")[0];
                    msg = response.p_result.toString().split("$")[1];

                    switch (resp)
                    {
                        case "OK":
                            if($.isFunction(p.callback))
                                p.callback(ctx,msg);
                            dial.close(); // chiudo sempre NON SI TOCCA!!!
                            break;
                        default:
                            errorMsg.text(msg);
                            txtPsw.focus();
                            if($.isFunction(p.koCheck)){
                                p.koCheck(msg);
                            }
                            break;
                    }
                }

            });
        }


    },
    sceltaUtente:function(param)
    {
        var p=(!LIB.isValid(param))?{}:param;
        LIB.checkParameter(p,"loadUser",false)
        LIB.checkParameter(p,"loadUserReadonly",false)
        LIB.checkParameter(p,"callback",null)

        var frm = $(document.createElement('form'))
            .attr({"id": "frmDialog"})
            .append(
                $(document.createElement('p')).append(
                    $(document.createElement('label')).attr({"for": "txtUsr", "id": "lblUsr"}).text("Username:"),
                    $(document.createElement('input')).attr({"id": "txtUsr", "name": "txtUsr", "type": "text"})
                )

            );

        var txtUsr = frm.find('#txtUsr');


        var dial = $.dialog(frm,{
            id:"Dialog_Scelta_Utente",
            title:"Scelta Utente",
            width:250,
            showBtnClose:false,
            movable:true,
            buttons:[
                {label:"Verifica",action:function(ctx){checkUser(dial,dial.getForm())}},
                {label:"Annulla",action:function(ctx){dial.close();}}
            ]
        });

        if (p.loadUser)
        {
            txtUsr.val(baseUser.USERNAME);
            txtUsr.focus();
        }

        if (p.loadUserReadonly)
        {
            txtUsr.val(baseUser.USERNAME).attr("readonly", "readonly");
            txtUsr.focus();
        }


        $("#Dialog_Scelta_Utente").on("keyEnter", txtUsr, function (e)
        {
            checkUser(dial,dial.getForm());
        });

        function checkUser(ctx,data)
        {
            /*alert(data[0].value) alert(data[1].value) */
            var param = { "p_utente": data[0].value};
            var msg="";
            toolKitDB.executeFunctionDatasource("FX_CHECK_USER", "CONFIG_WEB", param, function (response)
            {

                if (LIB.isValid(response.p_result))
                {
                    var resp = response.p_result.toString().split("$")[0];
                    msg = response.p_result.toString().split("$")[1];

                    switch (resp)
                    {
                        case "OK":
                            if($.isFunction(p.callback))
                                p.callback(ctx,msg);
                            dial.close(); // chiudo sempre NON SI TOCCA!!!

                            break;
                        default:
                            NOTIFICA.error({
                                message: msg,
                                title: "Error!",
                                timeout: 3,
                                width: 300
                            });
                            break;
                    }
                }

            });
        }


    },
    appropriatezza:function(param)
    {
        var p=(!LIB.isValid(param))?{}:param;
        LIB.checkParameter(p,"callback",null)
        var form =$("<form>");
        var rad=RADIO.crea({"id":"esameAppropriato",elements:[{"val":"S","descr":"Si"},{"val":"N","descr":"No"}]},{width:80,idxDefault:0});
        var motivazione1=$("<select>",{"name":"motivazione1"});
        var motivazione2=$("<select>",{"name":"motivazione2"});

        toolKitDB.getResult("DATI.MOTIVAZIONE_APPROPRIATEZZA",null,null,function(response){
            $.each(response,function(k,v){
                motivazione1.append($("<option>").val(v.VALUE).text(v.DESCR));
                motivazione2.append($("<option>").val(v.VALUE).text(v.DESCR));
            });

        });
        form.append($("<label>").text("Appropriato:"));
        form.append(rad);
        form.append($("<label>").text("Motivazione1:"));
        form.append(motivazione1);
        form.append($("<label>").text("Motivazione2:"));
        form.append(motivazione2);
        $.dialog(form,{
            id:"Dialog_appropriatezza",
            title:"Appropriatezza Esame",
            width:600,
            showBtnClose:false,
            "showMask":true,
            buttons:[
                {label:"Inserisci",action:function(ctx){
                    saveAppropriatezza(ctx.data.getForm());
                    ctx.data.close();}
                }
            ]
        });

        function saveAppropriatezza(param)
        {
            var valore=(param[0].value=="N")?param[0].value:param[0].value + '*' + param[1].value + '*' + param[2].value
            var par={"inValore":valore,"inIdenReferto": p.iden_referto};
            toolKitDB.executeFunction("SAVE_APPROPRIATEZZA_GASLINI",par,function(result){
                //$.dialog.close();
            });
            if($.isFunction(p.callback))p.callback();
        }

    },
    annullaRichiesta:function(param)
    {

        var frm = $("<form>");
        var struct={
            lblMotivazione : $("<label>").attr("for","cmbMotivazione").text("Motivazione:"),
            cmbMotivazione : $("<select>",{"name":"pIdenMotivazione","id":"cmbMotivazione"}),
            lblAltro : $("<label>").attr("for","txtMotivazionAltro").text("Altro:"),
            txtMotivazionAltro : $("<textarea>",{"name":"pMotivazione","id":"txtMotivazionAltro"}).css({width:300,height:130})
        }

        toolKitDB.getResult("DATI.MOTIVAZIONE_ANNULLAMENTO_RICHIESTA",null,null,function(response){
            $.each(response,function(k,v){
                struct.cmbMotivazione.append($("<option>").val(v.VALUE).text(v.DESCR));
            });

        });

        $.each(struct,function(k,v){
            frm.append(v);
        })

        $.dialog(frm,{
            id:"Dialog_annullamentoRichiesta",
            title:"Annullamento Richiesta",
            width:350,
            showBtnClose:false,
            movable:true,
            buttons:[
                {label:traduzione.butAnnullaRichiesta,action:function(ctx){annullaRichiesta(ctx,param.rows,ctx.data.getForm())}},
                {label:traduzione.butChiudi,action:function(ctx){ctx.data.close();}}
            ]
        });


        function annullaRichiesta(ctx,rows,form){
            var pIdenTestata = "";
            var pIdenDettaglio="";
            var pIdenPerUtente = baseUser.IDEN_PER;
            var num_rec=0;
            $.each(rows,function(k,v){
                num_rec++
                $.each(v,function(k1,v1){
                    if(k1 == "IDEN_TESTATA" || k1 == "IDEN_ESAME_TESTATA"){
                        pIdenTestata= v1.toString();
                    }
                });
            });
            var params={"pIdenTestata":pIdenTestata.toString(),"pIdenDettaglio":pIdenDettaglio,"pUtente":pIdenPerUtente/*"pIdenMotivazione":,"pMotivazione":*/};
            $.each(form,function(k,v){
                var tmp={};
                tmp[v.name]=v.value;
                $.extend(params,tmp);
            }) ;

            dwr.engine.setAsync(false);
            toolKitDB.executeFunction("GESTIONE_RIS_ESAMI.CANCELLA_ESAME",params,function(response){

                var resp = response.p_result.split("$")[0];
                var msg = response.p_result.split("$")[1];

                switch (resp)
                {
                    case "OK":
                        ctx.data.close();
                        NOTIFICA.success({
                            message: 'Esame cancellato.',
                            title: "Success!",
                            timeout: 3,
                            width: 300
                        });
                        if($.isFunction(param.callback))param.callback(ctx);
                        NS_AGGIORNA.aggiorna();
                        break;
                    default:
                        NOTIFICA.error({
                            message: msg,
                            title: "Error!",
                            timeout: 3,
                            width: 300
                        });
                        break;
                }
            });
            dwr.engine.setAsync(true);

        }
    },
    nonErogazioneEsame:function(param)
    {
        var frm = $("<form>");
        var struct={
            lblMotivazione: $("<label>").attr("for", "cmbMotivazione").text("Motivazione:"),
            cmbMotivazione: $("<select>", {"name": "pIdenMotivazione", "id": "cmbMotivazione"})
        }

        dwr.engine.setAsync(false);
        toolKitDB.getResult("DATI.MOTIVAZIONE_ESAME_NON_EROGATO", null, null, function (response)
        {
            $.each(response, function (k, v)
            {
                struct.cmbMotivazione.append($("<option>").val(v.VALUE).text(v.DESCR));
            });
        });
        dwr.engine.setAsync(true);

        $.each(struct, function (k, v)
        {
            frm.append(v);
        });

        $.dialog(frm,{
            id:"Dialog_EsameNonErogato",
            title:"Non Erogato",
            width:350,
            showBtnClose:false,
            movable:true,
            showMask:false,
            buttons:[
                {label:"Ok",action:function(ctx){esame_non_erogato(ctx,param.rows,ctx.data.getForm())}},
                {label:"Annulla",action:function(ctx){ctx.data.close();}}
            ]
        });

        function esame_non_erogato(ctx,rows,form){
            var pIdenTestata = [];
            var pIdenDettaglio=[];
            var pIdenPerUtente = baseUser.IDEN_PER;
            var num_rec=0;
            $.each(rows,function(k,v){
                num_rec++
                $.each(v,function(k1,v1){
                    if(k1 == "IDEN_TESTATA" || k1 == "IDEN_ESAME_TESTATA"){
                        pIdenTestata.push(v1);
                    }
                    if(k1=="IDEN_DETTAGLIO" || k1=="IDEN_ESAME_DETTAGLIO" ){
                        pIdenDettaglio.push(v1);
                    }
                });
            })

            var params={"pIdenTestata":pIdenTestata.toString(),"pIdenDettaglio":pIdenDettaglio.toString(),"pUtente":pIdenPerUtente/*"pIdenMotivazione":,"pMotivazione":*/};
            $.each(form,function(k,v){
                var tmp={};
                tmp[v.name]=v.value;
                $.extend(params,tmp);
            })

            dwr.engine.setAsync(false);
            toolKitDB.executeFunction("GESTIONE_RIS_ESAMI.NON_EROGAZIONE_ESAME",params,function(response){

                var resp = response.p_result.split("$")[0];
                var msg = response.p_result.split("$")[1];

                switch (resp)
                {
                    case "OK":
                        ctx.data.close();
                        NOTIFICA.success({
                            message: 'Esame annullato.',
                            title: "Success!",
                            timeout: 3,
                            width: 300
                        });
                        if($.isFunction(param.callback))param.callback(ctx);


                        break;
                    default:
                        NOTIFICA.error({
                            message: msg,
                            title: "Error!",
                            timeout: 3,
                            width: 300
                        });
                        break;
                }

                home.NS_AGGIORNA.aggiorna();
            });
            dwr.engine.setAsync(true);
        }
    },
    cancellazioneEsame:function(param)
    {
        var frm = $("<form>");
        var struct={
            lblMotivazione: $("<label>").attr("for", "cmbMotivazione").text("Motivazione:"),
            cmbMotivazione: $("<select>", {"name": "pIdenMotivazione", "id": "cmbMotivazione"}),
            lblAltro: $("<label>").attr("for", "txtMotivazionAltro").text("Altro:"),
            txtMotivazionAltro: $("<textarea>", {"name": "pMotivazione", "id": "txtMotivazionAltro"}).css({width: 300, height: 130})
        };

        dwr.engine.setAsync(false);
        toolKitDB.getResult("DATI.MOTIVAZIONE_CANCELLAZIONE_ESAME", null, null, function (response)
        {
            $.each(response, function (k, v)
            {
                struct.cmbMotivazione.append($("<option>").val(v.VALUE).text(v.DESCR));
            });
        });
        dwr.engine.setAsync(true);

        $.each(struct, function (k, v)
        {
            frm.append(v);
        });

        $.dialog(frm,{
            id:"Dialog_cancellazioneEsame",
            title:"Cancellazione Esame",
            width:350,
            showBtnClose:false,
            movable:true,
            showMask:false,
            buttons:[
                {label:"Cancella",action:function(ctx){cancella_esame(ctx,param.rows,ctx.data.getForm())}},
                {label:"Annulla",action:function(ctx){ctx.data.close();}}
            ]
        });

        function checkImpegnativa(rows,pIdenTestata,pIdenDettaglio){
            var param = {"operazione":"D"};
            $.each(rows,function(k,v){
                if(rows[k].TIPO_RICETTA=="NRE"){
                    param.codice_fiscale_paziente = rows[k].CODICE_FISCALE;
                    param.codice_struttura = rows[k].CODICE_STRUTTURA;
                    param.nre = rows[k].NUMERO_IMPEGNATIVA;
                    home.RICETTA.aggiornaDemaCancellazione(param);
                }
            });
        }

        function cancella_esame(ctx,rows,form){
            var pIdenTestata = [];
            var pIdenDettaglio=[];
            var pIdenPerUtente = baseUser.IDEN_PER;
            var num_rec=0;
            $.each(rows,function(k,v){
                num_rec++
                $.each(v,function(k1,v1){
                    if(k1 == "IDEN_TESTATA" || k1 == "IDEN_ESAME_TESTATA"){
                        pIdenTestata.push(v1);
                    }
                    if(k1=="IDEN_DETTAGLIO" || k1=="IDEN_ESAME_DETTAGLIO" ){
                        pIdenDettaglio.push(v1);
                    }
                });
            })
            checkImpegnativa(rows,pIdenTestata,pIdenDettaglio);
            var params={"pIdenTestata":"","pIdenDettaglio":pIdenDettaglio.toString(),"pUtente":pIdenPerUtente/*"pIdenMotivazione":,"pMotivazione":*/};
            $.each(form,function(k,v){
                var tmp={};
                tmp[v.name]=v.value;
                $.extend(params,tmp);
            })

            dwr.engine.setAsync(false);
            toolKitDB.executeFunction("GESTIONE_RIS_ESAMI.CANCELLA_ESAME",params,function(response){

                var resp = response.p_result.split("$")[0];
                var msg = response.p_result.split("$")[1];

                switch (resp)
                {
                    case "OK":
                        ctx.data.close();
                        NOTIFICA.success({
                            message: 'Esame cancellato.',
                            title: "Success!",
                            timeout: 3,
                            width: 300
                        });
                        if($.isFunction(param.callback))param.callback(ctx);

                        break;
                    default:
                        NOTIFICA.error({
                            message: msg,
                            title: "Error!",
                            timeout: 3,
                            width: 300
                        });
                        break;
                }

                home.NS_AGGIORNA.aggiorna();
            });
            dwr.engine.setAsync(true);
        }
    },
    /*{okFunction}*/
    pin:function(param){

        var frm = $(document.createElement('form'))
            .attr({"id": "frmDialog","action":"javascript::return false;"})
            .append(
            $(document.createElement('p')).append(
                $(document.createElement('label')).attr({"for": "txtPIN", "id": "lblPIN"}).text("PIN:"),
                $(document.createElement('input')).attr({"id": "txtPIN", "name": "txtPIN", "type": "password"})
            )
        );
        var txtPIN =  frm.find('#txtPIN');
        var dial = $.dialog(frm,{
            id:"Dialog_pin",
            title:"Inserire PIN",
            width:200,
            showBtnClose:true,
            movable:true,
            buttons:[
                {label:"OK",action:function(ctx){param.okFunction(ctx,ctx.data.getForm());ctx.data.close();}},
                {label:"Annulla",action:function(ctx){ctx.data.close();}}
            ]
        });
        $("#Dialog_pin").on("keyEnter", txtPIN, function (e)
        {
            param.okFunction(dial,dial.getForm());
        });
        txtPIN.focus();
    },
    nuovoFiltroPersonale:function(jsonFiltri,groupFilter,sito){

        var frm = $(document.createElement('form'))
            .attr({"id": "frmDialog","action":"javascript::return false;"})
            .append(
                $(document.createElement('p')).append(
                    $(document.createElement('label')).attr({"for": "txtNomeFiltri", "id": "lblNomeFiltri"}).text("Nome:"),
                    $(document.createElement('input')).attr({"id": "txtNomeFiltri", "name": "txtNomeFiltri", "type": "text"})
                )
            );

        $.dialog(frm,{
            id:"Dialog_nuovoFiltroPersonale",
            title:"Nuovo filtro Personale",
            width:200,
            showBtnClose:true,
            movable:true,
            buttons:[
                {label:"Salva",action:function(ctx){salvaFiltriPersonali(ctx,ctx.data.getForm())}},
                {label:"Annulla",action:function(ctx){ctx.data.close();}}
            ]
        });

        $("#txtNomeFiltri").focus();


        function salvaFiltriPersonali(ctx,form)
        {
            //alert(form[0].value);
            if(form[0].value != "")
            {
                dwr.engine.setAsync(false);
                toolKitDB.salvaFiltri(JSON.stringify(jsonFiltri),groupFilter,form[0].value,baseUser.USERNAME, sito,
                    {
                        callback: function (response)
                        {
                            if (response.result == "KO")
                            {
                                NOTIFICA.error({
                                    message: traduzione.koSalvataggioFiltriPersonali,
                                    title: traduzione.errorTitleSave,
                                    timeout: 2
                                });

                            }
                            else
                            {
                                NOTIFICA.success({
                                    message: traduzione.okSalvataggioFiltriPersonali,
                                    title: traduzione.successTitleSave,
                                    timeout: 2
                                });
                                ctx.data.close();

                                $('#iContent').contents().find('body').trigger('click');
                            }
                        },
                        timeout: 2000,
                        errorHandler: function (response)
                        {
                            NOTIFICA.error({
                                message: traduzione.koSalvataggioFiltriPersonali,
                                title: traduzione.errorTitleSave,
                                timeout: 2
                            });
                        }
                    });
                dwr.engine.setAsync(true);

            }
            else
            {
                NOTIFICA.error({
                    message: traduzione.nomeObbligatorio,
                    title: traduzione.errorTitleSave,
                    timeout: 2
                });
            }

        }
    },
    /*iden_anagrafica,data*/
    esami_da_eseguire:function(params){
        var dbParams = {
            iden_anagrafica: {v: params.iden_anagrafica, t: 'N'},
            data: {v: params.data, t: 'V'}
        }
        var db = $.NS_DB.getTool();
        var xhr = db.select(
            {
                datasource: 'POLARIS_DATI',
                id: 'DATI.ESAMI_DA_ESEGUIRE',
                parameter: dbParams
            });
        xhr.done(function (response) {
            if(!response.result.length)return;
            var $ul = $("<ul>");
            $.each(response.result,function(k,v){
                var $li=$("<li>");
                $li.append('<div class="clsLineSeparator"><p><b>'+traduzione.lblEsame+'</b>: '+v.DESCRIZIONE + "</p><p><b>"+traduzione.lblSala+'</b>: ' + v.SALA + "</p></div>")
                $ul.append($li);
            });

            $.dialog($("<div>").append($ul),{
                id:"Dialog_esamiDaEsegiure",
                title:traduzione.titEsamiDaEseguire,
                width:400,
                height:500,
                showBtnClose:true,
                movable:true,
                showMask:false,
                buttons:[
                    {label:traduzione.lblOk,action:function(ctx){ctx.data.close();}}
                ]
            });

        });

        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error('Errore Dialog esamiDaEsegiure : ' + errorThrown);

        });
    },
    /*iden_anagrafica,da_data*/
    prenotazioniPaziente:function(params){

        var dbParams = {
            iden_anagrafica: {v: params.iden_anagrafica, t: 'N'},
            da_data: {v: params.da_data, t: 'V'}
        }
        var db = $.NS_DB.getTool();
        var xhr = db.select(
            {
                datasource: 'POLARIS_DATI',
                id: 'DATI.PRENOTAZIONI_PAZIENTE',
                parameter: dbParams
            });

        xhr.done(function (response) {
            if(!response.result.length)return;
            var $ul = $("<ul>");
            $.each(response.result,function(k,v){
                var $li=$("<li>");
                $li.append('<div class="clsLineSeparator"><p>'+v.DESCRIZIONE + "</p><p>" + v.SALA + "</p><p><i class='icon-calendar'></i>" + DATE.format({'date':v.DATA_PRENOTAZIONE}) + " <i class='icon-clock'></i>"+v.ORA_PRENOTAZIONE+"</p></div>")
                $ul.append($li);
            });

            $.dialog($ul,{
                id:"Dialog_prenotazioniPaziente",
                title:traduzione.titPrenotazioniPaziente,
                width:400,
                height:500,
                showBtnClose:true,
                movable:true,
                buttons:[
                    {label:traduzione.lblOk,action:function(ctx){ctx.data.close();}}
                ]
            });

        });

        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error('Errore Dialog prenotazioniPaziente : ' + errorThrown);

        });


    },
    sceltaOperatore:function(param)
    {
        var param=(!LIB.isValid(param))?{}:param;
        var frm = $(document.createElement('form'))
            .attr({"id": "frmDialog"})
            .append(
                $(document.createElement('p'))

            );

        var cmb=$(document.createElement('select')).attr({"id": "cmbOperatore", "name": "cmbOperatore"});
        var query   =(!LIB.isValid(param.query))?"DATI.OPERATORE":param.query
        var datasource  =(!LIB.isValid(param.datasource))?"POLARIS_DATI":param.datasource

        toolKitDB.getResultDatasource(query,datasource,param,null ,
        {
        callback: function (response)
           {
            $.each(response,function(k,v){
                cmb.append("<option value='" + v.VALUE+ "'>" + v.DESCR + "</option>");
            });
               frm.append(cmb);
              var dial = $.dialog(frm,{
                   id:"Dialog_Scelta_Operatore",
                   title:(!LIB.isValid(param.title))?"Scelta Operatore":param.title,
                   width:250,
                   showBtnClose:false,
                   movable:true,
                   buttons:[
                       {label:"Seleziona",action:function(ctx){UpdateOperatore(dial,dial.getForm(),param)}},
                       {label:"Annulla",action:function(ctx){dial.close();}}
                   ]
               });
                $("#Dialog_Scelta_Operatore").on("keyEnter",  $('#cmbOperatore'), function (e)
               {
                   UpdateOperatore(dial,dial.getForm(),param);
               });

           },
            errorHandler: function (errorString, exception)
               {
                   logger.error('Errore nella creazione del form scelta operatore. ' + errorString + ' - ' + exception);

                   if (typeof param.callbackKO === "function") {
                       callbackKO(errorString);
                   }
               }

        });



        function UpdateOperatore(ctx,data,param)
        {
            /*alert(data[0].value) alert(data[1].value) */

            var msg="";

            var p=new Object();
            p=param.PARAM_BCK;
            p.iden_operatore=data[0].value;
            var datasource  =(!LIB.isValid(param.datasource))?"POLARIS_DATI":param.datasource
            toolKitDB.executeFunctionDatasource(param.CBK_OK_PROCEDURA, datasource, p, function (response)
            {

                if (LIB.isValid(response.p_result))
                {
                    var resp = response.p_result.toString().split("$")[0];
                    msg = response.p_result.toString().split("$")[1];

                    switch (resp)
                    {
                        case "OK":
                            if($.isFunction(param.callback))
                                p.callback(ctx,msg);
                            else
                            {
                                NOTIFICA.success({
                                    message: "Medico Refertante associato",
                                    title: "Success!",
                                    timeout: 3,
                                    width: 300
                                });
                            }
                            ctx.close(); // chiudo sempre NON SI TOCCA!!!

                            break;
                        default:
                            NOTIFICA.error({
                                message: msg,
                                title: "Error!",
                                timeout: 3,
                                width: 300
                            });
                            break;
                    }
                }

            });
        }


    },
    richiediPesoAltezzaMDC:function(iden_anagrafica,iden_esame_testata,iden_esame_dettaglio){

        var frm = $(document.createElement('form'))
            .attr({"id": "frmDialog"})


        var $r1 = $(document.createElement("label")).html("Peso").append(
                            $(document.createElement("input")).attr({"id":"peso","type":"text","name":"p_peso"}));
        var $r2 = $(document.createElement("label")).html("Altezza").append(
                    $(document.createElement("input")).attr({"id":"altezza","type":"text","name":"p_altezza"}));
        var $r3 = $(document.createElement("label")).html("MDC").append(
                    $(document.createElement("input")).attr({"id":"mdc","type":"text","name":"p_mdc"}));
        var $r4 = $(document.createElement("input")).attr({"id":"iden_anagrafica","name":"p_iden_anagrafica","value":iden_anagrafica,"type":"hidden"});
        var $r5 =  $(document.createElement("input")).attr({"id":"iden_esame_testata","name":"p_iden_esame_testata","value":iden_esame_testata,"type":"hidden"});
        var $r6 =  $(document.createElement("input")).attr({"id":"iden_esame_dettaglio","name":"p_iden_esame_dettaglio","value":iden_esame_dettaglio,"type":"hidden"});

        frm.append($r1);
        frm.append($r2);
        frm.append($r3);
        frm.append($r4);
        frm.append($r5);
        frm.append($r6);
        var dial = $.dialog(frm, {
            id: "dialogPAM",
            title: "Inserimento Dati",
            width: 350,
            showBtnClose: false,
            movable: true,
            buttons: [
                {
                    label: "Registra", action: function (ctx) {
                        UpdateDati(dial, dial.getForm())
                    }
                },
                    {
                        label: "Annulla", action: function (ctx) {
                        dial.close();
                    }
                }
            ]
        });

        $("#peso").focus();

        $("#peso").on("change", function(e){
           if(isNaN($("#peso").val())==false){
                $("#mdc").val($("#peso").val()*1.5);
            }
        });

        $("#peso,#altezza,#mdc").on("keyEnter", function (e)
        {
            UpdateDati(dial,dial.getForm());
        });

        function UpdateDati(ctx,data){
            var params = {};
            $.each(data,function(k,v){
                params[v.name]=v.value.replace('.',',');
            });

            toolKitDB.executeFunctionDatasource("SAVE_ALTEZZA_PESO_MDC", "POLARIS_DATI", params, function (response){
                if(response.p_result.split("$")[0] == "OK"){
                    home.NOTIFICA.success({
                        message: "Dati Registrati!",
                        title: "Success!",
                        timeout: 3,
                        width: 300
                    });
                    ctx.close();
                }else{
                    home.NOTIFICA.error({
                        message: response.p_result.split("$")[1],
                        title: "Error!",
                        timeout: 3,
                        width: 300
                    });
                }
            });
        }

    },
    dialogList:function(pParams){

            var v_param = pParams.dbParams;
            var v_query = (typeof pParams.query == 'undefined'||pParams.query == null ||pParams.query == "")?"":pParams.query;
            var v_datasource = (typeof pParams.datasource =='undefined' || pParams.datasource =="" )?null:pParams.datasource;
            var v_order = (typeof pParams.order =='undefined' || pParams.order =="" )?null:pParams.order;

            toolKitDB.getResultDatasource(v_query,v_datasource,v_param ,v_order,function(resp){
                var lista = $(document.createElement('ul')).attr({
                    "class": "UlList", "id": "listDialog"
                });
                $.each(resp,function(idx,el){

                    $(document.createElement('li')).attr({"id": el.IDEN}).html(el.DESCRIZIONE)
                        .on('click', function ()
                        {
                            $.dialog.hide();
                            pParams["fxClick"](el.IDEN,pParams.dbParams,pParams.others);
                        })
                        .appendTo(lista);
                });
                $.dialog(lista,
                    {
                        title: typeof pParams.title=='undefined'?"Lista":pParams.title,
                        showBtnClose: false,
                        buttons: [
                            {"label": "Annulla", "action": function ()
                            {
                                $.dialog.hide();
                                return false;
                            }
                            }
                        ],
                        width: 500
                    }
                );

            });
        }

}