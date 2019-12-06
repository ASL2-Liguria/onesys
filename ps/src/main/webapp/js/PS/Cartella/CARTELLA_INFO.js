$(document).ready(function() {
	CARTELLA_INFO.init();
	CARTELLA_INFO.setEvents();
});

var CARTELLA_INFO = {

	dimensioneWk : null,

	init : function() {
        $('#title').remove();
        home.CARTELLA_INFO = this;
        CARTELLA_INFO.calcolaDimensioneWk();
		CARTELLA_INFO.initWkPrecedenti();
		CARTELLA_INFO.initWkStoria();
	},
	setEvents : function() {

	},
    eliminaRilevazione:function(){

        var tdSel =  $("td.pressed");
        var tr = tdSel.closest("tr");
        var data = tr.find('td[data-header="DATA"] div').html();
        var ora =  tr.find('td[data-header="ORA"] div').html();
        var data_ora = moment(data + ora, 'DD/MM/YYYY HH:mm').format('YYYYMMDDHH:mm');

        var parameters = {
            IDEN_CONTATTO : $("#IDEN_CONTATTO").val(),
            DATA_ORA : data_ora, //
            IDEN_PER : home.baseUser.IDEN_PER

        };

        home.$.dialog("Si desidera eliminare la rilevazione ?",{
            title: "Attenzione",
            buttons: [
                {label: "SI", action: function () {
                    eliminaRilevazione(parameters);
                    home.$.dialog.hide()
                }},
                {label: "NO", action: function () {
                    home.$.dialog.hide();
                }}
            ]
        });

        function eliminaRilevazione(parameters){

            var params = {
                pIdenContatto : parameters.IDEN_CONTATTO, //,
                pDataOra : parameters.DATA_ORA, // rec.DATA + rec.ORA ,
                pIdenPer : parameters.IDEN_PER//
            };

            var parametri = {
                "datasource" : "PS",
                "id" : "PCK_PS_PARAMETRI.cancellaRilevazionePS",
                "params" : params,
                callbackOK : function(){
                    home.NOTIFICA.success({message: "Cancellazione avvenuta correttamente", timeout: 3, title: 'Success'});
                    document.location.replace(document.location);
                }

            };

            NS_CALL_DB.FUNCTION(parametri);
        }
    },
    modificaRilevazione:function(){

        var tdSel =  $("td.pressed");
        var header =  tdSel.data("header");
        var idenParametro =   tdSel.data("id_ps_parametri");
        var valore = tdSel.find("div").text().trim();

        var table = $("<table></table>").attr({"class": "tabledialog"})
            .append($(document.createElement("tr"))
                .append($(document.createElement("th")).text("Valore"))
            .append($(document.createElement("tr"))
                .append($(document.createElement("td"))
                        .append($(document.createElement("textarea")).text(valore).attr("id","valoreParametro"))
                )
            )
        );

        home.$.dialog(table,{
            title: "Modifica Parametro " + header,
            buttons: [
                {label: "Salva", action: function () {

                    modificaParametro();
                    home.$.dialog.hide()
                }},
                {label: "Chiudi", action: function () {
                    home.$.dialog.hide();
                }}
            ]
        });
        function modificaParametro(){


            var valore = home.$("#valoreParametro").val();
            /**piccolo controllo sul valore*/

            var header =  tdSel.data("header");
            var params = {};
            var parametri = {};

            if(header != 'P.A.' && !CARTELLA_INFO.checkParam(valore,header)){
                return  home.NOTIFICA.error({
                    message: 'Attenzione inserito un valore errato in ' + header,
                    title: "Error"});
            }
            /*tapullino per la pressione*/

            if(header == 'P.A.'){
                //se è pressione devo modificare 2 parametri e non 1
                var idenParametro1 = idenParametro.split(',')[0];
                idenParametro = idenParametro.split(',')[1];

                var valore1 = valore.split("/")[0];
                valore = valore.split("/")[1];

                if(!NS_CONTROLLI.controlloPressione(valore1,valore) ||  valore == '' || valore1 == ''){
                    return  home.NOTIFICA.error({
                        message: 'Attenzione inserito un valore errato in '+ header,
                        title: "Error"});
                }

                params = {
                    "pValore" :  {'v': valore1.replace(',','.') , 't':'V'},
                    "pIden" :  {'v':idenParametro1, 't':'N'},
                    "pIdenPer" : {'v':Number(home.baseUser.IDEN_PER), 't':'N'}
                };
                 parametri = {
                    "datasource" : "PS",
                    "id" : "PCK_PS_PARAMETRI.modificaRilevazione",
                    "params" : params

                };
                NS_CALL_DB.PROCEDURE(parametri);

            }

            params = {
                "pValore" :  {'v': valore.replace(',','.') , 't':'V'},
                "pIden" :  {'v':idenParametro, 't':'N'},
                "pIdenPer" : {'v':Number(home.baseUser.IDEN_PER), 't':'N'}
            };

            parametri = {
                "datasource" : "PS",
                "id" : "PCK_PS_PARAMETRI.modificaRilevazione",
                "params" : params,
                callbackOK : function(){
                    home.NOTIFICA.success({message: "Modifica avvenuta correttamente", timeout: 3, title: 'Success'});
                    document.location.replace(document.location);
                }

            };

            NS_CALL_DB.PROCEDURE(parametri);
        }
    },

    checkParam:function(p, header){
        switch (header){
            case 'F.C.':
              return NS_CONTROLLI.controlloFreqCardiaca(p);
                break;
            case 'F.R.':
                return NS_CONTROLLI.controlloFreqRespiratoria(p);
                break;
            case 'T.':
                return NS_CONTROLLI.controlloTemperatura(p);
                break;
            case 'Sat.':
                return NS_CONTROLLI.controlloSaturazione(p);
                break;
            case 'NRS':
                return NS_CONTROLLI.controlParametro(p,10);
                break;
            case 'GCS':
                return NS_CONTROLLI.controlParametro(p,15);
                break;
            case 'HGT':
                return NS_CONTROLLI.controlParametro(p);
                break;

            default :
                return NS_CONTROLLI.controlParametro(p);
                break;

        }


    },
    deleteRilevazione:function(){

        home.$.dialog("Si desidera eliminare la singola rilevazione ?",{
            title: "Attenzione",
            buttons: [
                {label: "SI", action: function () {
                    deleteRivalutazione();
                    home.$.dialog.hide()
                }},
                {label: "NO", action: function () {
                    home.$.dialog.hide();
                }}
            ]
        });
        function deleteRivalutazione(){
            var tdSel =  $("td.pressed");
            var idenParametro =  tdSel.data("id_ps_parametri");
            var header =  tdSel.data("header");
            var parameters ={};
            var parametri = {};

                if(header == 'P.A.') {
                //se è pressione devo modificare 2 parametri e non 1
                var idenParametro1 = idenParametro.split(',')[0];
                idenParametro = idenParametro.split(',')[1];

                parameters = {
                    pIden : {v:idenParametro1 , t:'N'} ,
                    pIdenPer : {v:Number(home.baseUser.IDEN_PER), t:'N'}
                };

                parametri = {
                    "datasource": "PS",
                    "id"        : "PCK_PS_PARAMETRI.cancellaiRilevazione",
                    "params"    : parameters

                };
                NS_CALL_DB.PROCEDURE(parametri);

            }

             parameters = {
                pIden : {v:idenParametro , t:'N'} ,
                pIdenPer : {v:Number(home.baseUser.IDEN_PER), t:'N'}
            };

             parametri = {
                "datasource" : "PS",
                "id" : "PCK_PS_PARAMETRI.cancellaiRilevazione",
                "params" : parameters,
                callbackOK : function(){
                    home.NOTIFICA.success({message: "Cancellazione avvenuta correttamente", timeout: 3, title: 'Success'});
                    document.location.replace(document.location);
                }

            };

            NS_CALL_DB.PROCEDURE(parametri);
        }

    },
	calcolaDimensioneWk : function(){
		var contentTabs = parseInt($("div.contentTabs").height());
		var intestazioneWk = parseInt($("div.headWk").height());
		var margine = 8;
		CARTELLA_INFO.dimensioneWk = contentTabs - intestazioneWk - margine;
	},
	initWkPrecedenti : function() {
		//if (!CARTELLA_INFO.WkPrecedenti) {
			var params = {
				container : "wkPrec",
				id : 'PRECEDENTI',
				aBind : [ 'IDEN_CONTATTO' ],
				aVal : [ $("#IDEN_CONTATTO").val() ]
			};
			$("div#wkPrec").height(CARTELLA_INFO.dimensioneWk);
			CARTELLA_INFO.WkPrecedenti = new WK(params);
			CARTELLA_INFO.WkPrecedenti.loadWk();
		/*}else{
            CARTELLA_INFO.WkPrecedenti.refresh();
        }*/
	},
	initWkStoria : function(callback) {
		if (!CARTELLA_INFO.wkStoria) {
			var params = {
				container : "wkStoria",
				id : 'STORIA_PAZIENTE',
				aBind : [ 'iden_anagrafica', 'template' ],
				aVal : [ $("#IDEN_ANAG").val(), home.CARTELLA.$("#TEMPLATE").val() ]
			};
			$("div#wkStoria").height(CARTELLA_INFO.dimensioneWk);
			CARTELLA_INFO.wkStoria = new WK(params);
			CARTELLA_INFO.wkStoria.loadWk();
            if(callback) callback();
		}else{
            CARTELLA_INFO.wkStoria.refresh();
            if(callback) callback();
        }
	},
    processInfo:function(data, $this, td){
        return td.text(data.DIAGNOSI).attr("title",data.DIAGNOSI_TESTUALE );
    },
    /**
     * processclass che dovrebbe assegnare al td l'id della relativa somministrazione
     * è stata utilizzata la regola IDEN_NOMECOLONNA per prendere l'iden della rilevazione
     * dovrà creare la toolbar
     * in questa process verrano anche definite le regole di rivalutazione
     *
     */
    processParametri:function(data, wk, td, nome_colonna){

        var valore = eval("data."+ nome_colonna);

        if(valore == '' || valore == '' || valore == null){
            logger.debug("data."+ nome_colonna + ' è vuoto');
            return '';
        }

        var json = JSON.parse(valore);

        //JSON = {"VALORE":"pValore","DELETED":"pDeleted","IDEN":"pIden"}
        //nel caso sia la pressione vengono concatenati i valori quindi la lunghezza del json è 2
        if(json.length == '2'){
            var valore="";
            var iden="";
            var deleted="";
            //ciclo il json in modo tale da rendere i dati uniformi al resto
            $.each(json, function (k,v) {
                //sul primo ciclo creo la prima parte del valore (esempio 120/ per il valore e X, per gli iden)
                if(k == 0){
                    if( json[k].VALORE != '' &&  json[k].VALORE != null){
                        valore += json[k].VALORE +'/';
                    }
                    iden += json[k].IDEN + ',';
                    deleted = json[k].DELETED
                }else{
                    //nel secondo ciclo concateno la parte finale.
                    valore += json[k].VALORE;
                    iden += json[k].IDEN ;
                  //  deleted = json[k].DELETED;
                }

            });
            json = { "VALORE":valore, "IDEN":iden,"DELETED": deleted } ;
            //alla fine dovrei ottenere un JSON così {VALORE:"120/80", IDEN:"1,2", DELETED:'N'}
        }
        var iden_ps_parametri = json.IDEN;

        if($("#STATO_PAGINA").val() == 'R'){
            logger.debug("STATO_PAGINA = R ");
            return json.VALORE;
        }
        if(iden_ps_parametri == null || iden_ps_parametri == ',' || 'undefined' == iden_ps_parametri){
            logger.debug("iden_ps_parametri = null o undefined o vuoto ");
            return json.VALORE;
        }
        if(data.IDEN_PER != home.baseUser.IDEN_PER){
            logger.debug("Iden per diversi ");

            return json.VALORE;
        }
        if(json.VALORE == null || json.VALORE == 'null' ||  json.VALORE == '' ||  json.VALORE == '/' ){
            logger.debug("JSON VALORE VUOTO");
            return json.VALORE;
        }
        if(json.DELETED == 'S'){
            td.addClass("deleted");
            return json.VALORE;
        }

        td.attr(
            "data-id_ps_parametri",iden_ps_parametri
        );

        var html;

        if(nome_colonna == 'STICK_URINARIO' || nome_colonna == 'FQ_CARDIO_TIPO' ){
            html = '<div id="user-toolbar-options"><a href="#" onclick="CARTELLA_INFO.deleteRilevazione()"><i class="icon-trash"  style="color: black" title="Cancella Parametro"></i></a><a onclick="CARTELLA_INFO.eliminaRilevazione()" title="Cancella Rilevazione"><i class="icon-ban-circle" style="color: black"></i></a></div>';
        }else{
            html = '<div id="user-toolbar-options"><a href="#" onclick="CARTELLA_INFO.modificaRilevazione()"><i class="icon-edit" title="Modifica Parametro"></i></a><a href="#" onclick="CARTELLA_INFO.deleteRilevazione()"><i class="icon-trash"  style="color: black" title="Cancella Parametro"></i></a><a onclick="CARTELLA_INFO.eliminaRilevazione()" title="Cancella Rilevazione"><i class="icon-ban-circle" style="color: black"></i></a></div>';
        }

        $("body").append(html);
        td.toolbar({
            content: '#user-toolbar-options',
            position: 'top',
            hideOnClick : true
        });

        return json.VALORE;

    },
    processNote : function (data, wk, td) {
        var json = JSON.parse(data.NOTE);

        if (json.VALORE == null || json.VALORE == '')
            return;

        var tableinfo =
            $(document.createElement("table")).attr({"id":"divInfoAnag"})
            .append($(document.createElement("table")).attr({"class":"tabledialog"})
            .append($(document.createElement("tr")).attr("class", "infoDati")
                .append($(document.createElement("td")).text(json.VALORE!=null?json.VALORE : "" ))));

        var $icon = $(document.createElement('i')).attr({
            "class": "icon-info-circled",
            "title": "Info note",
            "id": "INFONOTE"
        });
        $icon.on("click", function (e) {

        $.infoDialog({
            event: e,
            classPopup: "",
            headerContent: "NOTE info",
            content: tableinfo,
            width: 500,
            dataJSON: false,
            classText: "infoDialogTextMini"
            });
        });
       return $icon;
    },

    setColorStorico: function(data, elemento, td){

        var contatto = $('#IDEN_CONTATTO').val();

        if(data.IDEN == contatto){
            elemento.find('td').each(function(){
                $(this).css('background','#58ACFA');
            });
            td.css('background','#58ACFA');
        }
        td.text(data.DIAGNOSI);

    },

    apriCartellaStorico:function(rec){

        var statoPagina = parent.document.getElementById('STATO_PAGINA').value;

        var keyLegame = parent.$("div[name='NS_REFERTO']").find("iframe").contents().find("input[name='KEY_LEGAME']").val();


        if(statoPagina==="R")
        {
            home.NOTIFICA.error({message: "Non e' possibile aprire un'altra cartella di storico, chiudere prima quella attuale",title: "Error"});
        }
        else
        {
            if(keyLegame === "ESAME_OBIETTIVO"){
                parent.$.dialog("Si e' sicuri di voler uscire dalla scheda ? I dati inseriti verranno cancellati.",{
                    title: "Attenzione",
                    buttons: [

                        {label: "NO", action: function () {
                            //NS_REFERTO.iStruct.attr("src", urlKey);
                            parent.$.dialog.hide();

                        }},
                        {label: "SI", action: function () {
                            home.NS_FENIX_TOP.apriPagina({
                                url: 'page?KEY_LEGAME=CARTELLA&STATO_PAGINA=R&IDEN_ANAG=' + rec[0].IDEN_ANAGRAFICA + '&IDEN_CONTATTO=' +
                                rec[0].IDEN + '&IDEN_PROVENIENZA=' + rec[0].IDEN_PROVENIENZA + '&IDEN_CDC_PS=' + rec[0].IDEN_CDC +
                                    /*'&CODICE_FISCALE='+ rec[0].CODICE_FISCALE+*/
                                '&IDEN_LISTA=' + rec[0].IDEN_LISTA +
                                '&WK_APERTURA=LISTA_APERTI' + '&MENU_APERTURA=APRI_CARTELLA', fullscreen: true
                            });

                            parent.$.dialog.hide();

                        }}
                    ]
                });
            }
            else {
                home.NS_FENIX_TOP.apriPagina({
                    url: 'page?KEY_LEGAME=CARTELLA&STATO_PAGINA=R&IDEN_ANAG=' + rec[0].IDEN_ANAGRAFICA + '&IDEN_CONTATTO=' +
                    rec[0].IDEN + '&IDEN_PROVENIENZA=' + rec[0].IDEN_PROVENIENZA + '&IDEN_CDC_PS=' + rec[0].IDEN_CDC +
                        /*'&CODICE_FISCALE='+ rec[0].CODICE_FISCALE+*/
                    '&IDEN_LISTA=' + rec[0].IDEN_LISTA +
                    '&WK_APERTURA=LISTA_APERTI' + '&MENU_APERTURA=APRI_CARTELLA', fullscreen: true
                });
            }
        }
    }

};