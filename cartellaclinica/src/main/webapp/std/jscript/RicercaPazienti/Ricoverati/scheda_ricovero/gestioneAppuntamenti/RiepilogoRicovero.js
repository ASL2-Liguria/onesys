
var WindowCartella = null;

$(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }

    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    ContextMenu.init();
    ContextMenu.setEvents();

    RiepilogoRicovero.init();
    RiepilogoRicovero.setEvents();

    try{
        WindowCartella.utilMostraBoxAttesa(false);
    }catch(e){}
});

var RiepilogoRicovero = {

    /*iden_ricovero 	: 	null,
     cod_cdc         :   null,  */
    iden_anag 		:	null,//document.EXTERN.IDEN_ANAG.value,
    //dimesso			:	null,
    liEvents		:	[],

    init:function(){

        //RiepilogoRicovero.iden_ricovero = top.getRicovero("IDEN");
        /*if(document.EXTERN.IDEN_RICOVERO){
         RiepilogoRicovero.iden_ricovero = document.EXTERN.IDEN_RICOVERO.value
         }  */

        //RiepilogoRicovero.dimesso = top.getRicovero("DIMESSO");
        /*if(document.EXTERN.DIMESSO_RICOVERO){
         RiepilogoRicovero.dimesso = document.EXTERN.DIMESSO_RICOVERO.value
         } */
        RiepilogoRicovero.iden_anag = WindowCartella.getPaziente("IDEN");
        // RiepilogoRicovero.cod_cdc = top.getReparto("COD_CDC");

        /*if(document.EXTERN.COD_CDC){
         RiepilogoRicovero.cod_cdc = document.EXTERN.COD_CDC.value
         } */

        RiepilogoRicovero.checkPresenzaDati();

        /*$('input#txtDaData').val(top.clsDate.str2str($('input#txtDaData').val(),'YYYYMMDD','DD/MM/YYYY'));
         $('input#txtAData').val(top.clsDate.str2str($('input#txtAData').val(),'YYYYMMDD','DD/MM/YYYY'));

         $('input.Calendario')
         .datepick({
         showOnFocus: false,
         showTrigger: '<img class=\"trigger\" src=\"imagexPix/calendario/cal20x20.gif\" class=\"trigger\"></img>',
         onClose: RiepilogoRicovero.refresh
         })
         .attr("disabled","disabled");*/

        RiepilogoRicovero.setVisibilitaDiari();

        $('div.Riga[data="'+clsDate.getData(new Date(),'YYYYMMDD')+'"]').addClass('Today');

        RiepilogoRicovero.liEvents = [
            {selector:'li[tipo="Richieste"][stato="C"] a',evento:'click',azione:RiepilogoRicovero.actions.apriDocumentoRichiesta},
            {selector:'li[tipo="Consulenze"][stato="C"] a',evento:'click',azione:RiepilogoRicovero.actions.apriDocumentoRichiesta},
            {selector:'li[tipo="Prenotazioni"][stato="C"] a',evento:'click',azione:RiepilogoRicovero.actions.apriDocumentoRichiesta},
            {selector:'li[tipo="Lettere"] span.farmaci',evento:'click',azione:RiepilogoRicovero.actions.showFarmaciPrimoCiclo},
            {selector:'li[tipo="Lettere"] span.lettera',evento:'click',azione:RiepilogoRicovero.actions.apriLettera},
            {selector:'li[tipo="Terapie"] span.farmaci',evento:'click',azione:RiepilogoRicovero.actions.showFarmaciCollegati}
        ];
        RiepilogoRicovero.differenziaPerIdenRicovero();

    },

    setEvents:function(){
        document.body.onselectstart = function(){return false;};
        RiepilogoRicovero.setDragDrop();

        $('.withContent').live('click',function(e){
            $(this).find('> ul').slideToggle('fast');
        });

        for(var i in RiepilogoRicovero.liEvents) {
            var liEvent = RiepilogoRicovero.liEvents[i];
            $(liEvent.selector).bind(liEvent.evento, liEvent.azione).addClass("Link");
        }

        $('input#chkDiarioMedico , input#chkDiarioInfermiere').click(RiepilogoRicovero.setVisibilitaDiari);

        $('div.tDetail div.Appuntamento').click(function(e){RiepilogoRicovero.Appuntamento.checkAction(this,e);});
        $('div.tDetail div.Accesso').click(function(e){RiepilogoRicovero.Accesso.checkAction(this,e);});
        $('div.Info.ATTIVO').click(function(e){RiepilogoRicovero.Appuntamento.showInfo(this,e);});//RiepilogoRicovero.Appuntamento.showInfo);
        $('span.richiesta, span.counsulenza, span.prenotazione').click(function(e){RiepilogoRicovero.Appuntamento.showRichieste(this,e)})
    },

    setVisibilitaDiari:function(){
        var chkMedico = $('input#chkDiarioMedico').attr("checked");
        var chkInfermiere = $('input#chkDiarioInfermiere').attr("checked");

        var _ora = $('div.Riga:eq(0) > div.Ora')
        var PaddingLeft = _ora.position().left + _ora.width();
        var Width = $('div.Riga:eq(0)').width();

        $('div.RowDiari').css("padding-left",PaddingLeft+"px");

        if(chkMedico || chkInfermiere){
            $('div.RowDiari').show();
            if(chkMedico && chkInfermiere){
                $('div.DiarioMedico,div.DiarioInfermiere').css("width",((Width-PaddingLeft-4)/2)+"px").show();
            }
            if(chkMedico && !chkInfermiere){
                $('div.DiarioMedico').css("width",(Width-PaddingLeft-2)+"px").show();
                $('div.DiarioInfermiere').css("width","0%").hide();
            }
            if(!chkMedico && chkInfermiere){
                $('div.DiarioMedico').css("width","0%").hide();
                $('div.DiarioInfermiere').css("width",(Width-PaddingLeft-2)+"px").show();
            }
        }else{
            $('div.RowDiari').hide();
        }
    },

    setDragDrop:function(){
        $('div.Droppable').each(function(){
            var _this = $(this);

            _this.droppable({
                scope : _this.attr('title'),
                hoverClass: 'Dropover',
                tolerance : 'pointer',
                drop: function(event , ui) {

                    var DroppableUl = $(this).find('> ul');
                    var newData = $(this).parent('.Riga').attr("data");

                    var vTipo 	= ui.draggable.attr("tipo");
                    var vStato 	= ui.draggable.attr("stato");
                    var vId 	= ui.draggable.attr("id");



                    if(RiepilogoRicovero.setData(vTipo,vStato,vId,newData)){
                        DroppableUl.append(ui.draggable.css({top:0,left:0}));
                    }

                    RiepilogoRicovero.checkPresenzaDati(this);
                    RiepilogoRicovero.checkPresenzaDati(ui.draggable.parent('div.Droppable')[0]);

                    DroppableUl.slideDown();


                }
            });

            _this.find('> ul > li[locked="N"]').draggable({
                scope: _this.attr('title') ,
                revert: 'invalid'
            });

        });
    },

    checkPresenzaDati:function(pDroppable){

        if(typeof pDroppable != 'undefined'){
            checkPrimoLivello(pDroppable);
            checkSecondoLivello(pDroppable);
            checkStato(pDroppable);
        }else{
            $('div.Droppable').each(function(){
                checkPrimoLivello(this);
            });
            $('div.Droppable ul li').each(function(){
                checkSecondoLivello(this);
            });
            $('div.Droppable.withContent').each(function(){
                checkStato(this);
            });
        }

        function checkPrimoLivello(pObj){
            var _this = $(pObj);
            if(_this.find('li').length==0){
                _this.removeClass('withContent').attr("stato","");
            }else{
                _this.addClass('withContent');
            }
        }

        function checkSecondoLivello(pObj){
            var _this = $(pObj);
            if(_this.find('li').length==0){
                _this.removeClass('withContent');
            }else{
                _this.addClass('withContent');
            }
        }

        function checkStato(pObj){
            var _this = $(pObj);

            if(_this.find('li[stato="C"]').length>0){
                _this.attr("stato","C");
            }
            if(_this.find('li[stato="E"]').length>0){
                _this.attr("stato","E");
            }
            if(_this.find('li[stato="I"]').length>0){
                _this.attr("stato","I");
            }
            if(_this.find('li[stato="P"]').length>0){
                _this.attr("stato","P");
            }
            if(_this.find('li[stato="R"]').length>0){
                _this.attr("stato","R");
            }
        }
    },

    setData : function(pTipo,pStato,pIden,pData,pOra){
        //alert(pScope+'\n'+pStato+'\n'+pIden+'\n'+pData);
        switch (pTipo){
            case 'Richieste':
                var resp=WindowCartella.executeStatement("OE_Richiesta.xml" , "setDataOra" , [pIden,pData,null,top.baseUser.IDEN_PER]);
                if(resp[0]=='KO'){
                    alert(resp[1]);
                }

                var vDati = WindowCartella.getForm(document);

                var vOra = '';
                var vRs = WindowCartella.executeQuery('ORRORI_DA_RIMUOVERE.xml','getInfoRichiesta',pIden);
                while(vRs.next()){
                    vOra = vRs.getString('ora_proposta');
                    var cdc_destinatario = vRs.getString("CDC_DESTINATARIO");
                    var cdc_sorgente = vRs.getString("CDC_SORGENTE");
                }

                OE_RICHIESTA.callBackModifiche(
                    pIden,
                    {
                        data : pData,
                        ora : vOra,
                        iden_anag: vDati.iden_anag,
                        cod_pro: vDati.cod_dec_Reparto,
                        reparto_sorgente:   cdc_sorgente,
                        reparto_destinatario: cdc_destinatario
                    }
                );

                return RiepilogoRicovero.refresh();


            case 'Esami':
                if(pStato=='P'){
                    return setTagliaPrenotazione();
                }

            default:
                return setDataDefault();
        }

        function setDataDefault(){
            var resp=WindowCartella.executeStatement("AccessiAppuntamenti.xml" , "setData" , [pTipo,pIden,pData,baseUser.IDEN_PER]);
            if(resp[0]=='KO')
                alert(resp[1]);
            return(resp[0]=='OK');
        }

        function setTagliaPrenotazione(){

            var resp=WindowCartella.executeStatement("AccessiAppuntamenti.xml","tagliaPrenotazione",[baseUser.LOGIN,pIden],3);

            if(resp[0]=='KO'){
                alert(resp[1]);
            }else{
                var url = "prenotazioneDettaglio"
                    + "?Hdata="+pData
                    + "&menu_tenda=prenotazione_orario_consulta"
                    + "&id_aree="+resp[2]
                    + "&js_indietro=javascript:ritorna_consulta('CDC', '\\'"+resp[4]+"\\'','"+resp[3]+"', '', '0');";

                WindowCartella.$.fancybox({

                    'padding'	: 3,
                    'width'		: top.document.body.offsetWidth/10*9,
                    'height'	: top.document.body.offsetHeight/10*8,
                    'href'		: WindowCartella.NS_APPLICATIONS.switchTo('AMBULATORIO',url),
                    'onCleanup'	: RiepilogoRicovero.refresh,
                    'type'		: 'iframe',
                    'hideOnOverlayClick':false,
                    'hideOnContentClick':false
                });
            }
            //return(resp[0]=='OK');
        }


    },
    differenziaPerIdenRicovero: function(){

        var iden_ricovero= {};
        $.each($('.Riga'),function(){
            var iden = $(this).attr('iden_ricovero');
            if(iden !='' && iden != 'undefined' && iden != null && iden != 'null'){
                iden_ricovero[iden] = iden;
            }
        })

        var color1 = 'blue';
        var color2 = 'green';
        var color3 = 'red';
        var color4 = 'purlple';
        var counter = 1;
        for(var i in iden_ricovero){
            /*pseudo codice
             mi prendo tutti gli elementi con quell'iden_ricovero
             gli imposto la classe color+i
             */
            var color = eval('color'+counter);
            $('div[iden_ricovero="'+i+'"]').addClass(color);
            counter++;
        }
    },

    Appuntamento:{

        checkAction:function(pObj,pEvent){
            pEvent.stopPropagation();
            var _this = $(pObj);
            $('.light').removeClass('light');
            _this.parent('.Riga').addClass('light');
            if( _this.parent().attr("dimesso") != 'S'){
                if(_this.hasClass('ATTIVO')){
                    if(confirm(NS_CHECK.msgConfirm.Appuntamento.RIMOZIONE)){
                        RiepilogoRicovero.Appuntamento.remove();
                    }
                }else{
                    RiepilogoRicovero.Appuntamento.set();
                }
            }
        },

        set:function(){

            var Row = RiepilogoRicovero.getRow();

            APPUNTAMENTI.pagina.set({
                iden_ricovero                   :   WindowCartella.getRicovero("IDEN"),
                dimesso                         :   WindowCartella.getRicovero("DIMESSO"),
                iden_anag                       :   RiepilogoRicovero.iden_anag,
                data                            :   Row.data,
                ora                             :   Row.ora,
                data_fine_ricovero              :   WindowCartella.getRicovero("DATA_FINE"),


                callBack                        :   RiepilogoRicovero.refresh
            },window);
        },

        edit:function(){

            var Row = RiepilogoRicovero.getRow();
            if ((Row.dimesso== 'S' && WindowCartella.getRicovero("DATA_FINE")== 'undefined')||(WindowCartella.getRicovero("DATA_FINE")>Row.data)){
                return alert('Attenzione non si può modificare un appuntamento di un ricovero già chiuso');
            }
            APPUNTAMENTI.pagina.edit({
                iden_ricovero:Row.iden_ricovero,
                dimesso:Row.dimesso,
                iden_anag:RiepilogoRicovero.iden_anag,
                iden_appuntamento:Row.iden_appuntamento,
                data_fine_ricovero:WindowCartella.getRicovero("DATA_FINE"),
                callBack:RiepilogoRicovero.refresh
            },window);

        },
        showRichieste:function(pObj, pEvent){
            event.cancelBubble=true;
            var _this = $(pObj);

            var table = top.$('<table></table>').css("width","100%");

            var div = _this.closest('div.Riga');

            var iden_ricovero = div.attr('iden_ricovero');

            var data_richiesta =  div.attr('data');
            var counter = 50;

            var rs = WindowCartella.executeQuery("AccessiAppuntamenti.xml","getInfoRichieste",[iden_ricovero,data_richiesta]);

            if (rs.isValid){

                while(rs.next()){
                    table.append(
                        top.$('<tr></tr>')
                            .append(
                                top.$('<td></td>')
                                    .append(
                                        top.$('<div></div>').text(rs.getString('DESCSIRM')))
                            )
                    );
                    counter = counter + 20;
                }

                top.Popup.append({
                    title:'INFO RICHIESTE',
                    obj:table,
                    position:[event.clientX,event.clientY+80],
                    height: counter,
                    width: 400
                });

            }else {
                alert("Errore nella visualizzazione delle info\n impossibile ottenere le informazioni richieste");
            }


        },

        remove:function(){
            var Row = RiepilogoRicovero.getRow();       
            APPUNTAMENTI.pagina.remove({
                dimesso:Row.dimesso,
                iden_appuntamento:Row.iden_appuntamento,
                iden_accesso:Row.iden_accesso,
                iden_visita:Row.iden_accesso,
                lbltitolo: 'Modulo cancellazione appuntamento',
                callBackOk:function(){
                    var _Riga = $("div.Riga.light");
                    _Riga.attr("iden_appuntamento","");
                    _Riga.find("div.Appuntamento").removeClass("ATTIVO");
                    _Riga.find("div.Accesso").removeClass("ATTIVO");
                    _Riga.find("div.Ora").text("");
                }
            });

            ContextMenu.hide();

        },
        showInfo:function(pObj, pEvent){
            pEvent.stopPropagation();
            var _this = $(pObj);
            $('.light').removeClass('light');
            _this.parent('.Riga').addClass('light');
            var vResp = WindowCartella.executeQuery("AccessiAppuntamenti.xml","getInfoAppuntamenti",[RiepilogoRicovero.getRow().iden_appuntamento]);




            if(vResp.isValid){
                var table = top.$('<table></table>').css("width","100%");

                if(vResp.next()){
                    var ute_ins = vResp.getString("ute_ins");
                    var ute_mod = vResp.getString("ute_mod");
                    var data_ins= vResp.getString("DATA");
                    var data_mod= vResp.getString("DATA_MOD");

                    ute_ins = RiepilogoRicovero.Appuntamento.controlloInserimentoAppuntamento(ute_ins);
                    if(ute_mod!=''){ute_mod = RiepilogoRicovero.Appuntamento.controlloInserimentoAppuntamento(ute_mod)};

                    table.append(
                        top.$('<tr></tr>')
                            .append(
                                top.$('<th></th>').text('Data')
                            )
                            .append(
                                top.$('<th></th>').text('Tipo')
                            )
                            .append(
                                top.$('<th></th>').text('Utente')
                            )
                    );

                    table.append(
                        top.$('<tr></tr>')
                            .append(
                                top.$('<td></td>')
                                    .append(
                                        top.$('<div></div>').text(data_ins))
                            )
                            .append(
                                top.$('<td></td>').text('Inserimento')
                            )
                            .append(
                                top.$('<td></td>').text(ute_ins)
                            )
                    );
                    table.append(
                        top.$('<tr></tr>')
                            .append(
                                top.$('<td></td>').text(data_mod)
                            )
                            .append(
                                top.$('<td></td>').text('Modifica')
                            )
                            .append(
                                top.$('<td></td>').text(ute_mod)
                            )
                    );
                }
                top.Popup.append({
                    title:'INFO APPUNTAMENTO',
                    obj:table,
                    position:[event.clientX,event.clientY+80],
                    width:450
                });
            }else {

                alert("Errore nella visualizzazione delle info\n impossibile ottenere le informazioni richieste");
            }
        },
        controlloInserimentoAppuntamento:function(str){
            if(str==''||str==null||str=='null'){
                return str='Sistema esterno';
            }else{
                return str;
            }
        }

    },

    Accesso : {

        checkAction:function(pObj,pEvent){
            pEvent.stopPropagation();
            var _this = $(pObj);
            $('.light').removeClass('light');
            _this.parent('.Riga').addClass('light');
            if( _this.parent().attr("dimesso") == 'N'){
                if(_this.hasClass('ATTIVO')){
                    if(confirm(NS_CHECK.msgConfirm.Accesso.RIMOZIONE)){
                        RiepilogoRicovero.Accesso.remove();
                    }
                }else{
                    if(confirm(NS_CHECK.msgConfirm.Accesso.SEGNALAZIONE)){
                        RiepilogoRicovero.Accesso.set();
                    }
                }
            }
        },

        set:function(){

            var Row = RiepilogoRicovero.getRow();

            ACCESSI.sql.set({
                dimesso:Row.dimesso,
                iden_ricovero:Row.iden_ricovero,
                data:Row.data,
                ora:Row.ora,
                note:'',
                nota_breve:'',
                checkExistAccesso:function(){return (Row.iden_accesso != '')},
                checkExistAppuntamento:function(){return (Row.iden_appuntamento != '')},
                callBackOk:function(pResp){$("div.Riga.light").attr("iden_accesso",pResp[2]).find("div.Accesso").addClass("ATTIVO");}
            });
            ContextMenu.hide();
        },

        remove:function(){

            var _row = RiepilogoRicovero.getRow();

            ACCESSI.sql.remove({
                dimesso:_row.dimesso,
                iden_accesso:_row.iden_accesso,
                callBackOk:function(){$("div.Riga.light").attr("iden_accesso","").find("div.Accesso").removeClass("ATTIVO");},
                callBackKo:null
            });
            ContextMenu.hide();
        }
    },

    getRow:function(){
        var _row = $(".light");
        if($("div.Riga.light").length==0 || typeof _row[0].iden_appuntamento=='undefined'){
            return {data:'',ora:'',note:'',iden_accesso:'',iden_appuntamento:''};
        }else{
            return {
                data:_row.attr("data"),
                ora:_row.attr("ora"),
                note:_row.attr("note"),
                iden_accesso:_row.attr("iden_accesso"),
                iden_appuntamento:_row.attr("iden_appuntamento"),
                iden_ricovero : _row.attr("iden_ricovero"),
                dimesso : _row.attr("dimesso")
            };
        }
    },

    refresh:function(){
        WindowCartella.utilMostraBoxAttesa(true);
        /*document.EXTERN.DATA_INIZIO.value = top.clsDate.str2str($('input#txtDaData').val(),'DD/MM/YYYY','YYYYMMDD');
         document.EXTERN.DATA_FINE.value = top.clsDate.str2str($('input#txtAData').val(),'DD/MM/YYYY','YYYYMMDD');
         document.EXTERN.submit();*/
        WindowCartella.apriRiepilogo();
    },

    Richiesta:{

        iden_selezionato : null,

        visualizza:function(){
            WindowCartella.apriRichiestaLettura(RiepilogoRicovero.Richiesta.iden_selezionato);
        },

        inserisci:function(){
            WindowCartella.DatiInterfunzione.set("DataAppuntamento",RiepilogoRicovero.getRow().data);
            WindowCartella.inserisciRichiestaConsulenza();
        },

        associa:function(){
            WindowCartella.DatiInterfunzione.set("OraAppuntamento",RiepilogoRicovero.getRow().ora);
            WindowCartella.DatiInterfunzione.set("CODICI_ESTERNI","AMB_IDEN_ESAME:"+RiepilogoRicovero.Esame.iden_selezionato);
            RiepilogoRicovero.Richiesta.inserisci();
        },

        annulla:function(){

            /*$.fancybox({
             'padding'	: 3,
             'width'		: 600,
             'height'	: 250,
             'href'		: "annullamentoRichiestaPrenotazione.html",
             'type'		: 'iframe'
             });*/

            window.FinestraAnnullamentoParametri = {
                tipo_utente: top.baseUser.TIPO,
                tipologia : 'RICHIESTA',
                callBackOk:annullaRichiestaPrenotazioneGenerica,
                callBackKo:function(){}
            };

            var finestra = window.open("annullamentoRichiestaPrenotazione.html", "winAnnullamento", "width=600, height=300, top=150, left=300,resizable=yes");

            try{
                WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
        		}
            catch(e){}
        
        }


    },

    Consulenza:{

        iden_selezionato : null,

        annulla:function(){

            window.FinestraAnnullamentoParametri = {
                tipo_utente: WindowCartella.baseUser.TIPO,
                tipologia : 'CONSULENZA',
                callBackOk:annullaRichiestaPrenotazioneGenerica,
                callBackKo:function(){}
            };

            var finestra = window.open("annullamentoRichiestaPrenotazione.html", "winAnnullamento", "width=600, height=300, top=150, left=300,resizable=yes");
            try{
                WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
        		}
            catch(e){}        
        }

    },

    Esame:{
        iden_selezionato : null,

        accetta:function(){
            var vResp = WindowCartella.executeStatement(
                "PST_Prenotazione.xml",
                "accettaEsame",
                [
                    RiepilogoRicovero.Esame.iden_selezionato,
                    WindowCartella.baseUser.IDEN_PER,
                    "data_accettazione",
                    "ora_accettazione"
                ]
            );
            if(vResp[0]=='KO'){
                alert(vResp[1]);
            }else{
                RiepilogoRicovero.refresh();
            }
        },

        esegui:function(){
            var vResp = WindowCartella.executeStatement(
                "PST_Prenotazione.xml",
                "eseguiEsame",
                [
                    RiepilogoRicovero.Esame.iden_selezionato,
                    top.baseUser.IDEN_PER,
                    "data_esecuzione",
                    "ora_esecuzione"
                ]
            );
            if(vResp[0]=='KO'){
                alert(vResp[1]);
            }else{
                RiepilogoRicovero.refresh();
            }
        },

        eseguiPrenotato:function(){
            WindowCartella.dwrUtility.executeAction(

                "Esami",
                "eseguiEsamePrenotato",
                {
                    iden_esame:RiepilogoRicovero.Esame.iden_selezionato,
                    iden_per:WindowCartella.baseUser.IDEN_PER,
                    data_esecuzione:"",
                    ora_esecuzione:""
                },
                function(status){
                    if(status.success =="KO"){
                        alert(status.message);
                    }else{
                        RiepilogoRicovero.refresh();
                    }
                }
            )
        }
    },

    Stampa:{

        Appuntamenti :function(){
            var vDati = WindowCartella.getForm(document);
            sf			= 	'&prompt<pNosologico>=' + vDati.ricovero;
            //alert('selection formula : '+ sf +'reparto : ' + vDati.reparto);
            WindowCartella.confStampaReparto('DH_ACCESSI_APPUNTAMENTI',sf,'S',vDati.reparto,null);
        }

    },

    actions : {
        showFarmaciPrimoCiclo:function(){
            event.cancelBubble=true;

            var vRs = WindowCartella.executeQuery("lettere.xml","getHtmlSezione",[
                $(event.srcElement).closest('li').attr('id'),
                'idTerapiaDomiciliare'
            ]);

            if(vRs.next()){
                $.fancybox({
                    'width'		: 300,
                    'height'	: 400,
                    'padding'	: 3,
                    'content'	: '<div class="letteraFarmaci">' + vRs.getString("testo_html") +'</div>'
                });
            }
        },

        apriDocumentoRichiesta:function(){
            event.cancelBubble=true;
            var IdenRichiesta = $(event.srcElement).closest('li').attr('id');
            var vResp = WindowCartella.executeStatement("OE_Richiesta.xml","ConfermaLetturaEsito",[IdenRichiesta,top.baseUser.IDEN_PER]);
            if(vResp[0]=='KO'){
                alert('Segnalazione di lettura avvenuta con errori.\n'+vResp[1]);
            }
            //var finestra = window.open ("header?filtriAggiuntivi=identificativoEsterno~WHALE"+IdenRichiesta,'','fullscreen=yes');
            url = "servletGenerator?KEY_LEGAME=VISDOC&identificativoEsterno=WHALE"+IdenRichiesta+"&reparto="+WindowCartella.getReparto('COD_DEC');
            var finestra = window.open (url,'','fullscreen=yes');
            try{
                WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
        		}
            catch(e){} 
        },

        apriLettera:function() {
            var rs = WindowCartella.executeQuery("lettere.xml","getLettera",[$(event.srcElement).closest('li').attr('id')]);
            if(!rs.isValid){
                return alert(rs.getError());
            }

            if(rs.next()){
                WindowCartella.DatiCartella.loadAccesso(rs.getString("IDEN_VISITA"));
                WindowCartella.apriLetteraDimissioniNew($(event.srcElement).attr("funzione"));
            }else{
                return alert('Riferimento a lettera non esistente');
            }
        },

        showFarmaciCollegati:function(){
            event.cancelBubble=true;
            var IdenSomministrazione = $(event.srcElement).closest('li').attr("id");

            var vRs = WindowCartella.executeQuery("terapie.xml","somministrazione.getFarmaciCollegati",[IdenSomministrazione]);

            var table = top.$('<table></table>').css("width","100%");

            while(vRs.next()){
                table.append(
                    top.$('<tr></tr>')
                        .append(
                            top.$('<td></td>')
                                .append(top.$('<div></div>').text(vRs.getString("FARMACO")))
                                .append(top.$('<div></div>').text(vRs.getString("SOSTANZA")).css("font-size","10px"))
                                .css("color",vRs.getString("TIPO") == '3' ? 'red' : 'black' )
                        )
                        .append(
                            top.$('<td></td>').text(vRs.getString("DOSAGGIO"))
                        )
                        .append(
                            top.$('<td></td>').text(vRs.getString("UNITA_DI_MISURA"))
                        )
                );
            }

            top.Popup.append({
                title:'Farmaci',
                obj:table,
                position:[event.clientX,event.clientY+80],
                width:400
            });

        }

    }
};

var ContextMenu = {

    init:function(){

        ContextMenu.struttura = [
            {gruppo:"",voce:"",handler:null},
            {gruppo:"",voce:"Inserimento Nuovo Appuntamento",handler:RiepilogoRicovero.Appuntamento.set},
            {gruppo:"",voce:"Modifica appuntamento",handler:RiepilogoRicovero.Appuntamento.edit},
            {gruppo:"",voce:"Stampa appuntamenti paziente",handler:RiepilogoRicovero.Stampa.Appuntamenti},
            {gruppo:"",voce:"",handler:null},
            {gruppo:"",voce:"Inserisci richiesta",handler:RiepilogoRicovero.Richiesta.inserisci},
            {gruppo:"EsamiPrenotati",voce:"Associa richiesta",handler:RiepilogoRicovero.Richiesta.associa},
            {gruppo:"Richieste",voce:"Annulla richiesta",handler:RiepilogoRicovero.Richiesta.annulla},
            {gruppo:"Consulenze",voce:"Annulla consulenza",handler:RiepilogoRicovero.Consulenza.annulla},
            {gruppo:"",voce:"",handler:null},
            {gruppo:"EsamiPrenotati",voce:"Segnala accettato",handler:RiepilogoRicovero.Esame.accetta},
            {gruppo:"EsamiPrenotati",voce:"Segnala eseguito",handler:RiepilogoRicovero.Esame.eseguiPrenotato},
            {gruppo:"EsamiAccettati",voce:"Segnala eseguito",handler:RiepilogoRicovero.Esame.esegui}

        ];

        ContextMenu.selezioni = [
            {selector:'div.tDetail',ligthed:true,gruppo:'',trigger:function(obj){}},

            {selector:'li[tipo="Richieste"][stato="R"]',ligthed:false,gruppo:'Richieste',trigger:function(obj){RiepilogoRicovero.Richiesta.iden_selezionato = $(obj).attr("id");}},
            {selector:'li[tipo="Richieste"][stato="P"]',ligthed:false,gruppo:'Richieste',trigger:function(obj){RiepilogoRicovero.Richiesta.iden_selezionato = $(obj).attr("id");}},
            {selector:'li[tipo="Richieste"][stato="I"]',ligthed:false,gruppo:'Richieste',trigger:function(obj){RiepilogoRicovero.Richiesta.iden_selezionato = $(obj).attr("id");}},

            {selector:'li[tipo="Consulenze"][stato="R"]',ligthed:false,gruppo:'Consulenze',trigger:function(obj){RiepilogoRicovero.Consulenza.iden_selezionato = $(obj).attr("id");}},


            {selector:'li[tipo="Esami"][stato="P"]',ligthed:false,gruppo:'EsamiPrenotati',trigger:function(obj){RiepilogoRicovero.Esame.iden_selezionato = $(obj).attr("id");}},
            {selector:'li[tipo="Esami"][stato="I"]',ligthed:false,gruppo:'EsamiAccettati',trigger:function(obj){RiepilogoRicovero.Esame.iden_selezionato = $(obj).attr("id");}}

        ];
        ContextMenu.build();
    },

    setEvents:function(){

        document.body.oncontextmenu = function(){return (parent.baseUser.ABILITA_CONTEXT_MENU == 'S');};

        for (var i=0;i<ContextMenu.selezioni.length;i++){
            var selezione = ContextMenu.selezioni[i];
            $(selezione.selector).data({
                ligthed:	(typeof selezione.ligthed!='undefined'?selezione.ligthed:false),
                gruppo:		(typeof selezione.gruppo!='undefined'?selezione.gruppo:''),
                trigger:	(typeof selezione.trigger=='function'?selezione.trigger:function(){})
            })
                .bind('contextmenu',function(e){
                    var _this = $(this);
                    _this.data("trigger")(this);

                    ContextMenu.gruppiDaMostrare.push(_this.data("gruppo"));
                    if(_this.data("ligthed")){
                        $('.light').removeClass('light');
                        _this.addClass('light');
                    }
                });
        }

        $('body').bind('contextmenu',function(e){
            ContextMenu.gruppiDaMostrare.push("");
            ContextMenu.show(e);
            ContextMenu.gruppiDaMostrare = [];
        });

        $('body').click(ContextMenu.hide);

    },

    selezioni:[],

    gruppiDaMostrare:[],

    struttura:[],

    build:function(){
        var Menu = $('<div class="ContextMenu"></div>');

        for (var i=0;i<ContextMenu.struttura.length;i++){
            if(ContextMenu.struttura[i].handler == null){
                Menu.append($('<div class="MenuHeader" gruppo="'+ContextMenu.struttura[i].gruppo+'">'+ContextMenu.struttura[i].voce+'</div>'));
            }else{
                Menu.append($('<div class="MenuDetail" gruppo="'+ContextMenu.struttura[i].gruppo+'">'+ContextMenu.struttura[i].voce+'</div>').click(ContextMenu.struttura[i].handler));
            }
        }

        $('body').append(Menu.hide());
    },

    show:function(e){

        $('div.ContextMenu').css("left",e.pageX-(e.pageX + $('div.ContextMenu').outerWidth()>document.body.offsetWidth?$('div.ContextMenu').outerWidth():0));

        if ((e.pageY+$('div.ContextMenu').outerHeight())>document.body.offsetHeight){
            if ((e.pageY-$('div.ContextMenu').outerHeight())>0){
                $('div.ContextMenu').css("top",document.body.scrollTop+(e.pageY-$('div.ContextMenu').outerHeight()));
            }else{
                $('div.ContextMenu').css("top",document.body.scrollTop);
            }
        }
        else{
            $('div.ContextMenu').css("top",document.body.scrollTop+e.pageY);
        }

        $('div.ContextMenu > div').hide();
        for(var i=0;i<ContextMenu.gruppiDaMostrare.length;i++){
            $('div.ContextMenu > div[gruppo="'+ContextMenu.gruppiDaMostrare[i]+'"]').show();
        }

        $('div.ContextMenu').show();
    },

    hide:function(){
        $('.light').removeClass('light');
        $('div.ContextMenu').hide();
    }
};

/////////////////////////////////
function annullaRichiestaPrenotazioneGenerica(motivoAnnullamento,pIdenPer){

    //alert('motivo Annullamento: '+motivoAnnullamento);

    if(motivoAnnullamento != ''){
        motivoAnnullamento = motivoAnnullamento.toString().replace(/\'/,"''");
    }

    var rs = WindowCartella.executeQuery("ORRORI_DA_RIMUOVERE.xml","getInfoRichiesta",[RiepilogoRicovero.Richiesta.iden_selezionato]);
	var bloccoAnnullamento = false;
    
			if(rs.next()){
				var cdc_destinatario = rs.getString("CDC_DESTINATARIO");
				var cdc_sorgente = rs.getString("CDC_SORGENTE");

				if(rs.getString("TIPOLOGIA_RICHIESTA")=='3'){
					if(rs.getString("STATO_RICHIESTA") != 'P' && rs.getString("STATO_RICHIESTA") != 'I'){
						bloccoAnnullamento = true;
					}else{
						bloccoAnnullamento = false;
					}
				}
				else  {
					if(rs.getString("TIPOLOGIA_RICHIESTA") != '3' && rs.getString("PRENOTAZIONE_DIRETTA") == 'N' && rs.getString("STATO_RICHIESTA") != 'I'){
						bloccoAnnullamento = true;
					}else{
						if(rs.getString("TIPOLOGIA_RICHIESTA") != '3' && rs.getString("STATO_RICHIESTA") != 'P' && rs.getString("PRENOTAZIONE_DIRETTA") == 'S'){
							bloccoAnnullamento = true;
						}       
					}
				}

			}else{
				return alert('Errore nel reperimento dei dati');
			}
			
			if(bloccoAnnullamento){
				return alert('Attenzione: selezionare una prenotazione/richiesta inviata');
				
			}

    OE_RICHIESTA.annulla({
        'iden_richiesta':RiepilogoRicovero.Richiesta.iden_selezionato,
        'reparto_sorgente':cdc_sorgente,
        'reparto_destinatario':cdc_destinatario,
        'motivo_annullamento':motivoAnnullamento,
        'iden_med':pIdenPer,
        'callBackOk':RiepilogoRicovero.refresh,
        'callBackKo':function(resp){
            alert(resp.message);
        }
    });

}