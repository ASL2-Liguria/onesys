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

    if (baseUser.ATTIVA_NUOVA_WORKLIST == 'S'){
        $().callJSAfterInitWorklist('WK_APPUNTAMENTI.init()');
    }
    else{
        WK_APPUNTAMENTI.init();
    }

});

function aggiorna(){
    parent.aggiorna();
}



var WK_APPUNTAMENTI = {

    init:function(){
    	WK_APPUNTAMENTI.caricaAvvertenze();
        WK_APPUNTAMENTI.setEvents();
        try{
            parent.removeVeloNero('oIFWk0');
        }catch(e){
            //caricato dalla consultazione di ambulatorio
        }
        WK_APPUNTAMENTI.initRiepilogo();

    },
    
     caricaAvvertenze:function(){
    	
    	
    	var jsonRecord = [];
    	var min=0;
    	var max=array_iden_anag.length;

    		for (min; min < max; ++min) {
    			jsonRecord.push({
    				"IDEN_ANAG": array_iden_anag[min].toString(),
    				"IDEN_VISITA": array_iden_visita[min].toString(),
    				"IDEN_RICOVERO": array_iden_ricovero[min].toString(),
    				"REPARTO": array_cdc_reparti[min],
    				"NUM_NOSOLOGICO": array_nosologici[min],
    				"COD_TIPO_RICOVERO": array_tipo_ricovero_codice[min],
    				"DATA": array_data_appuntamento[min]
    			});

    		}
    		var jsonObject = {"TIPO_UTE":baseUser.TIPO,"IDEN_PER":baseUser.IDEN_PER,"records": jsonRecord};

    		dwrAvvertenze.getHtml(JSON.stringify(jsonObject),'campoAvvertenzeWkAccessiDH',callBack);

    	function callBack(resp){
    	//	alert(resp);
    		for (var i = 0; i < resp.length; i++) {
    			$('table#oTable tr:eq('+(i)+')').find('td:eq(1)').html(resp[i]);
    		}
    	}	

    },


    setEvents:function(){
        $('tr').dblclick(function(){WK_APPUNTAMENTI.apriCartella('apriRiepilogo();');});
    },

    getRowIndex:function(){
        var vObj = event.srcElement;
        while (vObj.nodeName.toUpperCase()!='TR')
            vObj = vObj.parentNode;
        return vObj.sectionRowIndex;
    },

    initRiepilogo:function(){
        $('.wk-tabberRiepilogo > span > a').toggle(
            function(){activate($(this));},
            function(){deactivate($(this));}
        )


        function activate(obj){
            checkLoadedElements();

            obj.addClass("active");
            var keys = 	obj.data("key").split(" ");
            for(var i = 0 ; i < keys.length; i ++){
                obj.parent().siblings('*[data-key="'+keys[i]+'"]').show();
            }

        }

        function deactivate(obj){
            obj.removeClass("active");
            var keys = 	obj.data("key").split(" ");
            for(var i = 0 ; i < keys.length; i ++){
                obj.parent().siblings('*[data-key="'+keys[i]+'"]').hide();
            }
        }

        function checkLoadedElements(){

            var index = WK_APPUNTAMENTI.getRowIndex();

            if($('div.wk-tabberRiepilogo:eq('+index+')').data("loaded") != "true"){

                WindowCartella.executeAction(
                    "RiepilogoRicovero",
                    "getSingleRow",
                    {
                        iden_ricovero:array_iden_ricovero[index],
                        iden_prericovero:array_iden_prericovero[index],
                        data:array_data_appuntamento[index],
                        cod_cdc:array_cdc_reparti[index]
                    },
                    function(resp){
                        if(resp.success == false){
							$('div.wk-tabberRiepilogo:eq('+index+')').data("loaded","false");
                            return alert(resp.message);
                        }
                        var tabber = $('div.wk-tabberRiepilogo:eq('+index+')');

                        for(var i in resp.elements){
                            tabber.append($(resp.elements[i]));
                        }
                        $('div.wk-tabberRiepilogo:eq('+index+')').data("loaded","true");
                    }
                )

            }
        }

    },

    openRiepilogoRicovero:function(){
        parent.apriCartella(null,'apriRiepilogo();');
    },

    openAssociaPrecedenti:function(){

		var index = WK_APPUNTAMENTI.getRowIndex();

        var url = 	"servletGenerator?KEY_LEGAME=ASSOCIA_PRECEDENTI"
				+	"&IDEN_ANAG="		+array_iden_anag[index]
				+	"&IDEN_RICOVERO="	+array_iden_ricovero[index]
				+	"&IDEN_PRERICOVERO="+array_iden_prericovero[index]
				+	"&COD_CDC="			+array_cdc_reparti[index]
				+	"&DATA_RICOVERO="	+array_data_ricovero[index]
				+	"&TIPO_RICOVERO="	+array_tipo_ricovero_codice[index];		
		

        WK_APPUNTAMENTI.openFancyBox(url,700);

    },

    openRimuoviPianificazioni:function(){
        var url = 	"servletGenerator?KEY_LEGAME=RIMUOVI_PIANIFICAZIONI";
        url		+=	"&IDEN_ANAG="		+array_iden_anag[WK_APPUNTAMENTI.getRowIndex()];
        url		+=	"&IDEN_RICOVERO="	+array_iden_ricovero[WK_APPUNTAMENTI.getRowIndex()];
        url		+=	"&COD_CDC="			+array_cdc_reparti[WK_APPUNTAMENTI.getRowIndex()];

        WK_APPUNTAMENTI.openFancyBox(url,700);
    },

    apriCartella:function(pFunzione){

        var vDatiInterfunzione = [];
        for(var i = 0 ; i < array_data_appuntamento.length; i++)
            vDatiInterfunzione.push('DataAppuntamento='+array_data_appuntamento[i]);

        WindowCartella.NS_CARTELLA_PAZIENTE.apri({
            index:WK_APPUNTAMENTI.getRowIndex(),
            iden_visita:array_iden_visita,
            iden_ricovero:array_iden_ricovero,
            funzione:pFunzione,
            DatiInterfunzione:vDatiInterfunzione,
            window:window
        });

        /*parent.apriCartella(
         event.srcElement,
         (typeof pFunzione == 'undefined' ? "apriVuota();" : pFunzione),
         'DataAppuntamento='+array_data_appuntamento[WK_APPUNTAMENTI.getRowIndex()]
         );*/
    },

    Appuntamento:{
        set:function(){
            var IdenRicovero = stringa_codici(array_iden_ricovero);
            if(IdenRicovero=='' || IdenRicovero<0)return alert('Nessun paziente selezionato');
            if(stringa_codici(array_dimesso)=='S')return alert('Impossibile inserire un appuntamento di un paziente dimesso');

            WK_APPUNTAMENTI.openFancyBox(
                WK_APPUNTAMENTI.Appuntamento.getUrl({
                    iden_visita:stringa_codici(array_iden_ricovero),
                    iden_anag:stringa_codici(array_iden_anag)
                }),700);
        },

        edit:function(){

            var IdenRicovero = stringa_codici(array_iden_ricovero);
            if(IdenRicovero=='' || IdenRicovero<0)return alert('Nessun appuntamento selezionato');

            var data_appuntamento = stringa_codici(array_data_appuntamento);
            var data_fine_ricovero = '';
            var dimesso = 'N';        /*di default non è dimesso*/
            var rs = WindowCartella.executeQuery('AccessiAppuntamenti.xml','getInfoNosologici',[stringa_codici(array_iden_visita)]);
            while(rs.next()){
                dimesso = rs.getString("DIMESSO");
                data_fine_ricovero = (dimesso == 'S'?rs.getString("DATA_FINE_RICOVERO"):'');
            }
            if (data_fine_ricovero != '' && data_appuntamento < data_fine_ricovero ) {
                return alert('Impossibile modificare un appuntamento con data precedente alla data di fine ricovero ' + clsDate.str2str(data_fine_ricovero,'YYYYMMDD', 'DD/MM/YYYY'));
            }

            WK_APPUNTAMENTI.openFancyBox(
                WK_APPUNTAMENTI.Appuntamento.getUrl({
                    iden_appuntamento:stringa_codici(array_iden_appuntamento),
                    iden_visita:stringa_codici(array_iden_ricovero),
                    iden_anag:stringa_codici(array_iden_anag),
                    dimesso:dimesso,
                    data_fine_ricovero:data_fine_ricovero
                }),700);
        },

        remove :function(){

            APPUNTAMENTI.pagina.remove(//iden_appuntamento,iden_accesso,iden_visita,dimesso,lbltitolo[,callBackOk][,callBackKo]}
                {
                    iden_visita:stringa_codici(array_iden_visita)== '-1'?'':stringa_codici(array_iden_visita),
                    dimesso:stringa_codici(array_dimesso),
                    iden_appuntamento:stringa_codici(array_iden_appuntamento),
                    iden_accesso:stringa_codici(array_iden_visita)== '-1'?'':stringa_codici(array_iden_visita),
                    lbltitolo:'Modulo cancellazione appuntamento',
                    callBackOk:function(){
                        document.location.replace(document.location);
                    },
                    callBackKo:function(vResp){
                        if(confirm(vResp[3] + '\nSi desidera aprire il riepilogo?' )){
                            WK_APPUNTAMENTI.openRiepilogoRicovero();
                        }
                    }
                });

        },

        getUrl:function(pParam){

            var vUrl = "servletGenerator?KEY_LEGAME=INSERIMENTO_APPUNTAMENTO";
            vUrl += "&ORA="+(typeof pParam.ora=='undefined'?"": pParam.ora);
            vUrl += "&DATA="+(typeof pParam.data=='undefined'?"": pParam.data);
            vUrl += "&IDEN_APPUNTAMENTO="+(typeof pParam.iden_appuntamento=='undefined'?"": pParam.iden_appuntamento);
            vUrl += "&ACCESSO="+(typeof pParam.accesso=='undefined'?"N":pParam.accesso);;
            vUrl += "&IDEN_VISITA="+(typeof pParam.iden_visita=='undefined'?"": pParam.iden_visita);
            vUrl += "&IDEN_ANAG="+(typeof pParam.iden_anag=='undefined'?"": pParam.iden_anag);
            vUrl += "&DIMESSO="+(typeof pParam.dimesso=='undefined'?"": pParam.dimesso);
            vUrl += "&DATA_FINE_RICOVERO="+(typeof pParam.data_fine_ricovero=='undefined'?"": pParam.data_fine_ricovero);

            return vUrl;

        }

    },

    Accesso : {
        set:function(){

            var IdenRicovero = stringa_codici(array_iden_ricovero);
            var TipoRicovero = stringa_codici(array_tipo_ricovero_codice);

            if(IdenRicovero=='' || IdenRicovero<0)return alert('Nessun appuntamento selezionato');
            if(TipoRicovero=='PRE-DH')return alert('Impossibile segnalare un accesso per un PRE-DH');
            if(stringa_codici(array_iden_visita)>0)return alert("Accesso gia' segnalato in questa data");
            if(stringa_codici(array_dimesso)=='S')return alert('Impossibile segnalare un accesso di un paziente dimesso');
            var vNote= '';
            var vNotaBreve = '';
            var vResp = WindowCartella.executeStatement("AccessiAppuntamenti.xml","setAccesso",[
                stringa_codici(array_iden_ricovero),
                stringa_codici(array_data_appuntamento),
                stringa_codici(array_ora_appuntamento),
                vNote,
                vNotaBreve
            ],1);
            if(vResp[0]=='KO'){
                alert(vResp[1]);
            }else{
                //parent.applica_filtro();
                document.location.replace(document.location);
            }
        },

        remove:function(){

            ACCESSI.sql.remove({
                dimesso:stringa_codici(array_dimesso),
                iden_accesso:stringa_codici(array_iden_visita),
                callBackOk:function(){document.location.replace(document.location);},
                callBackKo:null
            });

        }
    },

    openFancyBox:function(pUrl,pHeight){

        var vHeight = (typeof pHeight=='undefined'?(top.$('body')[0].offsetHeight)/100*95:pHeight);
        //alert(top.$('body')[0].offsetHeight)
        var vWidth = (top.$('body')[0].offsetWidth)/100*95;

        top.$.fancybox({
            'padding': 3,
            'width':vWidth,
            'height':vHeight,
            'href':pUrl,
            'type':'iframe'	,
            'onClosed':	function(){document.location.replace(document.location);}
        });

    },

    stampa:{
        Worklist:function(){

            var funzione	= 	'WK_ACCESSI_LISTA_LAVORO';
            var reparto		= 	parent.$('[name="cmbRepProvenienza"]').find('option:selected').val();
            var dataFiltro 	= 	parent.document.getElementById('txtADataRic').value;
            var giorno 		= 	dataFiltro.substring(0,2);
            var mese		= 	dataFiltro.substring(3,5);
            var anno		= 	dataFiltro.substring(6,10);
            dataFiltro 		= 	anno+mese+giorno;
            sf				= 	'&prompt<pCodCdc>=' + reparto + '&prompt<pDataRicovero>='+ dataFiltro;

            //alert('selection formula : '+ sf +'data filtro :' + dataFiltro +'reparto : ' + reparto);
            try{
                WindowCartella.confStampaReparto(funzione,sf,'S',reparto,null);
            }catch(e){
                alert(e.description);
            }
        },

        Appuntamenti:function(){
            var reparto = stringa_codici(array_cdc_reparti);
            if(reparto=='' || reparto<0)
                return alert('Nessun paziente selezionato');    

            var funzione	= 	'DH_ACCESSI_APPUNTAMENTI';
            var nosologico	= 	stringa_codici(array_nosologici);
            sf			= 	'&prompt<pNosologico>=' + nosologico;
                
            //alert('selection formula : '+ sf +'reparto : ' + reparto);

            WindowCartella.confStampaReparto(funzione,sf,'S',reparto,null);
        }
    },
    switchOnClick: function (classClicked,param){
    	eval(param[classClicked.split(' ')[1]]);
    }
    
};
