/**
 * Nasmespace per la gestione degli elementi creati dinamicamente
 * */
var NS_APPEND_RICHIESTE = {

    deleted: "",
    iden_esame_delete : "",

    /**
     * Funzione per la creazione dell'intestazione della tabella
     * dove vengono inseriti : quesiti, quadri, note, data, ora.
     * */
    creaIntestazioneTable: function () {
        var tr = document.createElement("tr");
        var thEsame = document.createElement("th");
       // var thUrgenza = document.createElement("th");
        var thQuesito = document.createElement("th");
        var thDataProp = document.createElement("th");
        var thOraProp = document.createElement("th");
        var thCancella = document.createElement("th");

        thCancella.innerText = "CANC.";
        thDataProp.innerText = "DATA";
        thOraProp.innerText = "ORA";
        thEsame.innerText = "ESAMI";
       // thUrgenza.innerText = "URG.";
        thQuesito.innerText = "QUESITO";

        $(tr).addClass("trIntestazione");
        $(thCancella).css({"width":"50px"});
        //$(thUrgenza).css({"width":"20px"});
        $(thDataProp).css({"width":"140px"});
        $(thOraProp).css({"width":"60px"});
        $(thEsame).css({"width":"400px"});

        tr.appendChild(thCancella);
        tr.appendChild(thDataProp);
        tr.appendChild(thOraProp);
        //tr.appendChild(thUrgenza);
        tr.appendChild(thEsame);
        tr.appendChild(thQuesito);

        $("#colAltriDati").find("table.campi").append(tr);
    },
    /**
     * Funzione che popola la tabella di cui sopra, per ogni richiesta,
     * con il nome esame, provenienza, ecc...
     * */
    creaTrTable: function () {

        var coAltriDati = $("#colAltriDati");
        coAltriDati.find("tr.trDati").remove();

        /* Ciclo per ogni Richiesta */
        for (var i = 0; i < NS_INVIA_RICHIESTE.jsonRichieste.length; i++) {

            var jsonSegRich = NS_INVIA_RICHIESTE.jsonRichieste[i];

            var tr = document.createElement("tr");
            var tdEsami = document.createElement("td");
            tdEsami.setAttribute('class','esami');
            //var tdUrgenza = document.createElement("td");
            var tdDataProp = document.createElement("td");
            var tdOraProp = document.createElement("td");
            var tdImgCancella = document.createElement("td");
            var inputDataProp = document.createElement("input");
            var inputHDataProp = document.createElement("input");
            var inputOraProp = document.createElement("input");
            var imgCancella = document.createElement("img");
            //var imgUrgenzaRichieste = document.createElement("img");

            /* Per ogni esame all'interno della richiesta */
            for (var j = 0; j < jsonSegRich.ESAMI.length; j++) {

                var imgCancellaSingolo = document.createElement("img");

                $(imgCancellaSingolo)
                    .attr({"id": "imgCancella_" + j,"idx": j, "src": "./img/CMenu/chiudi.png", "width": "16px", "height": "16px", "class": "cancellaSingolo"})
                    .on("click", function () { NS_APPEND_RICHIESTE.cancellaSingolo($(this)); })
                    .css({"cursor":"pointer"});

                /* Span contenente immagine con name iden_esame */
                var spanImg = document.createElement('span');
                spanImg.setAttribute('name', jsonSegRich.ESAMI[j].IDEN_ESA);
                spanImg.appendChild(imgCancellaSingolo);

                /* label descr prestazione con identificativi utili a identificarla */
                var text = document.createElement('label');
                text.setAttribute('iden_esa', jsonSegRich.ESAMI[j].IDEN_ESA);
                text.setAttribute('cod_dec', jsonSegRich.COD_DEC);
                text.setAttribute('urgenza', jsonSegRich.URGENZA);
                text.setAttribute('metodica', jsonSegRich.ESAMI[j].METODICA);
                text.setAttribute('id','prest'+j);

                /* In un esame di consulenze inserisco anche l'erogatore */
                if(jsonSegRich.ESAMI[j].METODICA==null || jsonSegRich.ESAMI[j].METODICA=="null" || jsonSegRich.ESAMI[j].METODICA=="E"){
                    text.innerText += jsonSegRich.ESAMI[j].ESAME + " - "+ jsonSegRich.EROGATORE+" \n";
                }else{
                    text.innerText += jsonSegRich.ESAMI[j].ESAME + " \n";
                }

                /* Metto la label nello span */
                var spanText = document.createElement('span');
                spanText.setAttribute('name', jsonSegRich.ESAMI[j].IDEN_ESA);
                spanText.appendChild(text);

                tdEsami.appendChild(spanImg);
                tdEsami.appendChild(spanText);
            }

            tdDataProp.className = "tdData";
            tdOraProp.className = "tdText";
            $(tdOraProp).addClass("oracontrol");
            $(tdOraProp).addClass("w80px");



            $(inputOraProp).attr({"type": "text", "id": "txtOraProp_"+jsonSegRich.COD_DEC+"_"+jsonSegRich.METODICA+"_"+jsonSegRich.URGENZA});
            $(inputDataProp).attr({"type": "text", "id": "txtDataProp_"+jsonSegRich.COD_DEC+"_"+jsonSegRich.METODICA+"_"+jsonSegRich.URGENZA});
            $(inputHDataProp).attr({"type": "hidden", "id": "h-txtDataProp_"+jsonSegRich.COD_DEC+"_"+jsonSegRich.METODICA+"_"+jsonSegRich.URGENZA,
                "readonly":"readonly", "name" : "h-txtOraProp_"+jsonSegRich.COD_DEC+"_"+jsonSegRich.METODICA+"_"+jsonSegRich.URGENZA, "data-filtro-applica":"S"});



            $(imgCancella)
                .attr({"id": "imgCancella_" + i, "src": "./img/CMenu/chiudi.png", "width": "16px", "height": "16px", "class": "cancella"})
                .on("click", function () { NS_APPEND_RICHIESTE.eliminaRigaRichiesta($(this), $(this).closest('tr').attr('id')); })
                .css({"cursor":"pointer","margin":"0 10px"});


            /*$(imgUrgenzaRichieste)
                .attr({"id": "imgUrgenza_" + i,"idx": j, "src": "\\onesys-ps\\img\\urgenza_richieste\\urgenza_"+jsonSegRich.URGENZA+".png", "width": "16px", "height": "16px", "class": "UrgenzaRichieste"})
                .css({"margin":"0 10px"});*/

            tdImgCancella.appendChild(imgCancella);
           // tdUrgenza.appendChild(imgUrgenzaRichieste);
            tdOraProp.appendChild(inputOraProp);
            tdDataProp.appendChild(inputDataProp);
            tdDataProp.appendChild(inputHDataProp);

            $(tr).attr({"id": (i).toString(), "class": "trDati"});

            tr.appendChild(tdImgCancella);
            tr.appendChild(tdDataProp);
            tr.appendChild(tdOraProp);
            //tr.appendChild(tdUrgenza);
            tr.appendChild(tdEsami);


            if(MAIN_INS_RICHIESTE.reparto_attuale != jsonSegRich.COD_CDC){

                var tdQuesito = document.createElement("td");
                var taQuesito = document.createElement("textarea");

                tdQuesito.className = "tdTextarea";

                $(taQuesito).attr({"id": "taQuesito_"+jsonSegRich.COD_DEC+"_"+jsonSegRich.METODICA+"_"+jsonSegRich.URGENZA, "class": "autoText"});


                for(var k=0; k < MAIN_INS_RICHIESTE.jsonQuesito.quesiti.length; k++){

                    if(MAIN_INS_RICHIESTE.jsonQuesito.quesiti[k].id == $(taQuesito).attr("id")){
                        $(taQuesito).val(MAIN_INS_RICHIESTE.jsonQuesito.quesiti[k].val);
                    }
                }
                    tdQuesito.appendChild(taQuesito);
                    tr.appendChild(tdQuesito);
            }


            coAltriDati.find("table.campi").append(tr);

            /*script per il plugin della data*/
            var dataProposta = $("#txtDataProp_"+jsonSegRich.COD_DEC+"_"+jsonSegRich.METODICA+"_"+jsonSegRich.URGENZA);
            dataProposta.Zebra_DatePicker({
                onSelect : function(){},
                startWithToday: true, readonly_element: false,
                format: 'Ymd', months: (traduzione.Mesi).split(','),
                days: (traduzione.Giorni).split(',')});
            //$(".Zebra_DatePicker_Icon ").hide();
            dataProposta.maskData({});

            dataProposta.on("blur change", function(){
                var _this = $(this);
                NS_APPEND_RICHIESTE.controlloData(_this);
            });

            var hData = $("#h-txtDataProp_"+jsonSegRich.COD_DEC+"_"+jsonSegRich.METODICA+"_"+jsonSegRich.URGENZA);
            var dataOrdinata="";
            dataOrdinata = (dataProposta.val()).split("/");
            hData.val(dataOrdinata[2]+dataOrdinata[1]+dataOrdinata[0]);

            /*script dell'ora*/
            $('td.oracontrol input')
                .css({"width": "60px !important"})
                .live()
                .setMask("29:59")
                .on("blur", function(){
                    var _this = $(this);
                    NS_APPEND_RICHIESTE.controlloOra(_this);
                })
                .keypress(function () {
                    var currentMask = $(this).data('mask').mask;
                    var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
                    if (newMask != currentMask) {
                        $(this).setMask(newMask);
                    }
                });

            /*setto i campi obbligatori*/
            NS_APPEND_RICHIESTE.campiObbligatori(jsonSegRich);
            //dataProposta.focus();
            //$(taQuesito).focus();


        }
        /*autosize delle textarea*/
        //$("textarea.autoText").autosize();

        $("td.oracontrol input").val(moment().format('HH:mm'));
    },
    /**
     * Aggiunge al Json delle richieste le informazioni ottenute dai campi
     * creati dinamicamente di quesito, quadro ecc..
     * */
    addValueJSON: function () {
        for (var i = 0; i < NS_INVIA_RICHIESTE.jsonRichieste.length; i++)
        {
            var jsonSegRich = NS_INVIA_RICHIESTE.jsonRichieste[i];

            for (var j = 0; j < jsonSegRich.ESAMI.length; j++)
            {
                jsonSegRich.QUESITO = $("#taQuesito_" + jsonSegRich.COD_DEC+"_"+jsonSegRich.METODICA+"_"+jsonSegRich.URGENZA).val();
                jsonSegRich.QUADRO ="";
                jsonSegRich.DATA_PROPOSTA = $("#h-txtDataProp_" + jsonSegRich.COD_DEC+"_"+jsonSegRich.METODICA+"_"+jsonSegRich.URGENZA).val();
                jsonSegRich.ORA_PROPOSTA = $("#txtOraProp_" + jsonSegRich.COD_DEC+"_"+jsonSegRich.METODICA+"_"+jsonSegRich.URGENZA).val();
            }
        }
    },
    /**
     * Rende obbligatorie le textarea del quesito e del quadro clinico a seconda della metodica
     * */
    campiObbligatori: function (jsonSegRich) {
        if (jsonSegRich.METODICA == "1" || jsonSegRich.METODICA == "2" ||
            jsonSegRich.METODICA == "3" || jsonSegRich.METODICA == "4" || jsonSegRich.METODICA == "V" ||
            jsonSegRich.METODICA == "W" || jsonSegRich.METODICA == "X" || jsonSegRich.METODICA == "E")
        {
            MAIN_INS_RICHIESTE.validator.attach($("#taQuesito_"+jsonSegRich.COD_DEC+"_"+jsonSegRich.METODICA+"_"+jsonSegRich.URGENZA),
                {tab: "tabDati", "name": "Quesito " + jsonSegRich.EROGATORE, "status": "required"});
            /*MAIN_INS_RICHIESTE.validator.attach($("#taQuadro_" + jsonSegRich.COD_DEC+"_"+jsonSegRich.METODICA),
             {tab: "tabDati", "name": "Quadro " + jsonSegRich.EROGATORE, "status": "required"});*/
        }
        MAIN_INS_RICHIESTE.validator.attach($("#txtOraProp_"+jsonSegRich.COD_DEC+"_"+jsonSegRich.METODICA+"_"+jsonSegRich.URGENZA),
            {tab: "tabDati", "name": "Ora Proposta " + jsonSegRich.EROGATORE, "status": "required"});

        MAIN_INS_RICHIESTE.validator.attach($("#txtDataProp_"+jsonSegRich.COD_DEC+"_"+jsonSegRich.METODICA+"_"+jsonSegRich.URGENZA),
            {tab: "tabDati", "name": "Data Proposta " + jsonSegRich.EROGATORE, "status": "required"});


    },

    eliminaRigaRichiesta: function (_this, idx) {

        // Se l'utente è MEDICO si cancellano le prestazioni presenti in questo gruppo e il relativo oggetto
        if(home.baseUser.TIPO_PERSONALE == 'M')
        {

            NS_INVIA_RICHIESTE.jsonRichieste.splice(idx, 1);
            $('#'+idx).nextAll().each(function(){
                var id = $(this).attr('id');
                id -= 1;
                $(this).attr('id',id);
            });
            _this.closest("tr.trDati").remove();

        }
        // Stessa cosa di sopra ma vengono cancellati anche dalla combolist qui presente
        else if(home.baseUser.TIPO_PERSONALE == 'I' || home.baseUser.TIPO_PERSONALE == 'OST')
        {

            var element = $('#'+idx);

            element.find('.cancellaSingolo').each(function(){
                $(this).click();
            });
            element.nextAll().each(function(){
                var id = $(this).attr('id');
                id -= 1;
                $(this).attr('id',id);
            });
            //NS_INVIA_RICHIESTE.jsonRichieste.splice(idx, 1);
            _this.closest("tr.trDati").remove();
        }

        if(NS_INVIA_RICHIESTE.jsonRichieste.length == 0){
            if(MAIN_INS_RICHIESTE.hasAValue(home) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL) && MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO)&& MAIN_INS_RICHIESTE.hasAValue(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
                home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
            }
        }
    },
    /**
     * Seleziona l'esame e lo passa alla funzione per l'eliminazione
     * @param _this
     */
    cancellaSingolo : function(_this){

        var idx = _this.attr("idx");
        var indiceRiga = _this.closest("tr").attr("id");

        var esame = $("#"+indiceRiga).find("#prest"+idx);

        var param= {
            IDEN_ESA : esame.attr("iden_esa"),
            COD_DEC  : esame.attr("cod_dec"),
            METODICA : esame.attr("metodica"),
            callback : function(){NS_APPEND_RICHIESTE.cbk(NS_APPEND_RICHIESTE.deleted, NS_APPEND_RICHIESTE.iden_esame_delete);}
        };

        /*Passo alla funzione i parametri della prestazione, il suo indice di posizionamento e
            la callback che eliminerà se dovuto le prestazioni a livello di interfaccia.
        */
        MAIN_INS_RICHIESTE.rimuoviPrestazione(param);
    },
    /**
     * Operazioni che vengono eseguite dopo aver cancellato le prestazioni
     * @param deleted
     * @param iden_esame
     */
    cbk : function cbk(deleted,iden_esame){
        if(deleted == 'S'){
            var toDelete = $('span[name='+iden_esame+']');
            var indiceRiga = $(toDelete).closest('tr').attr('id');
            var elemento = $('#'+indiceRiga);

            if(elemento.find('.esami').children().length> 2) {
                toDelete.remove();
                NS_APPEND_RICHIESTE.deleted = "";
                NS_APPEND_RICHIESTE.iden_esame_delete = "";
            }
            else{
                elemento.find('.cancella').trigger('click');
                NS_APPEND_RICHIESTE.deleted = "";
                NS_APPEND_RICHIESTE.iden_esame_delete = "";
            }
        }
    },

    controlloData : function(_this){
        var dataAperturaCartella = $("#hDataAperturaCartella").val();
        var adesso = moment().format("YYYYMMDDHHmm");
        var dataDigit = _this.parent().find("input[type=hidden]").val();
        var diffMax = moment(adesso,"YYYYMMDD").diff(moment(dataAperturaCartella,"YYYYMMDD"));
        diffMax = moment.duration(diffMax);

        if(!MAIN_INS_RICHIESTE.hasAValue(dataDigit)){
            NS_APPEND_RICHIESTE.alertDdataOra(_this, "Data");
        }else{
            var diffAttuale = moment(dataDigit,"YYYYMMDD").diff(moment(dataAperturaCartella,"YYYYMMDD"));
            diffAttuale = moment.duration(diffAttuale);

            if(diffAttuale >= 0 && diffAttuale <= diffMax){
                _this.removeClass("tdError");
                _this.addClass("tdObb");
            }else{
                NS_APPEND_RICHIESTE.alertDdataOra(_this, "Data");
            }
        }
    },

    controlloOra : function(_this){
        if (_this.val().length < 5 && _this.val().length !== 0){
            if(_this.val().length == 2){
                var value = _this.val();
                _this.val(value + ':00');

            }
            else{
                NS_APPEND_RICHIESTE.alertDdataOra(_this, 'Ora inserimento non corretta');
                $('.butSalva').hide();
            }
        }

        var dataDigit = _this.parent().prev().find("input[type=hidden]").val();

        if(!MAIN_INS_RICHIESTE.hasAValue(dataDigit)){_this.parent().prev().find("input[type=hidden]").focus()}

        var oraDigit = _this.val();
        var ora= oraDigit.split(":");
        oraDigit = ora[0]+ora[1];
        var giornoDigit = dataDigit+oraDigit;

        var dataAperturaCartella = $("#hDataAperturaCartella").val();
        var adesso = moment().format("YYYYMMDDHHmm");

        var diffMax = moment(adesso,"YYYYMMDDHHmm").diff(moment(dataAperturaCartella,"YYYYMMDDHHmm"));
        diffMax = moment.duration(diffMax);

        var diffAttuale = moment(giornoDigit,"YYYYMMDDHHmm").diff(moment(dataAperturaCartella ,"YYYYMMDDHHmm"));
        diffAttuale = moment.duration(diffAttuale);

        if(_this.val().length!==5 || diffAttuale < 0 || diffAttuale > diffMax){
            NS_APPEND_RICHIESTE.alertDdataOra(_this, "Ora");
        }else{
            _this.removeClass("tdError");
            _this.addClass("tdObb");
        }

    },

    alertDdataOra : function(_this,messaggio){
        $.dialog(messaggio + " inserita non corretta",
            {title: "Attenzione",
                buttons: [
                    {label: "OK", action: function () {
                        _this.val("");
                        _this.removeClass("tdObb");
                        _this.addClass("tdError");
                        $.dialog.hide();

                    }}
                ]
            });
    }

};