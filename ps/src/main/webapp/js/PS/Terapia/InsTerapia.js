/* global home */

/**
 * CarloG + MatteoPi
 *
 * Salvataggio terapie e wk terapie più utilizzate
 */
jQuery(document).ready(function () {
    NS_TERAPIA.init();
    NS_TERAPIA.event();

});

var NS_TERAPIA = {
    WkFarmaci: null,
    filtroSel: null,
    farmaci : false,
    tipoWk: parent.$("#WK_APERTURA").val(),
    tipoPersonale: home.baseUser.TIPO_PERSONALE,
    /*jsonDatiVSomministraz: null,
     jsonDatiVeicolo: null,
     jsonDatiDiluizione: null,*/

    init: function () {
        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        NS_TERAPIA.overrideFunction();
        NS_TERAPIA.detectBaseUser();
        NS_TERAPIA.defaultValorize();
        NS_TERAPIA.initWkFarmaciUtilizzati();

        $("#colTerapiaSel").find("table.campi").append(NS_TERAPIA.creaIntestazioneTable);
        $("#cmbDiluizione_, #cmbVieSomministra_, #cmbVeicolo_, #cmbUnitaMisura_").hide();

        if(home.baseUser.TIPO_PERSONALE == 'I' || home.baseUser.TIPO_PERSONALE == 'OST'){

            $("#checkInfermiere_PDP").addClass("CBpulsSel");
            $("#checkMedico_MEDICO").removeClass("CBpulsSel");
        }
        else{
            $("#checkMedico").trigger('click');
        }

        NS_FENIX_SCHEDA.addFieldsValidator({config: "V_FARMACI"});
        // NS_FENIX_SCHEDA.addFieldsValidator({config:"V_INS_TERAPIA"});
        //NS_TERAPIA.salvaHide($('#hUteRiferimento').val(),NS_TERAPIA.tipoWk,NS_TERAPIA.tipoPersonale);

        $('#acMedico').data('acList').changeBindValue({"iden_cdc": Number($("#IDEN_CDC").val())});
    },

    event: function () {
        $("#radFiltroWk").on("change", function () {
            NS_TERAPIA.filtroSel = $("#h-radFiltroWk").val();
            NS_TERAPIA.caricaWkFarmaci('');
        });
        $("#butCerca").on("click", function(){

            if( $('#filtroText').val() !== '') {
                NS_TERAPIA.caricaWkFarmaci('');
            }else{
                home.NOTIFICA.error({message: 'Scrivere almeno un carattere nel filtro', title : 'Error', timeout : 5})
            }
        });
        //catturo pressione tasto invio
        $("#filtroText").keypress(function (e) {
            if(e.which == 13) {
                if( $('#filtroText').val() !== '') {
                    NS_TERAPIA.caricaWkFarmaci('');
                }

            }
        });
        $("#checkMedico_MEDICO, #checkInfermiere_PDP").on("click", NS_TERAPIA.gestCompetenza);
        $("#dati").on("click", function(){
                if(!(NS_TERAPIA.tipoWk == 'LISTA_APERTI' && NS_TERAPIA.tipoPersonale == 'M' && $('#hUteRiferimento').val() != home.baseUser.IDEN_PER)){
                    if($("button.butSalva").is(':visible')) {
                        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";
                    }
                }
        });

        $("#txtDataIns").on("blur change", function(){

           var data =  $('#h-txtDataIns').val();
           var ora =  $('#txtOraIns');
           var data_ora = data + ora.val();
           data_ora = moment(data_ora, 'YYYYMMDDHH:mm');

           if(!(moment(home.CARTELLA.NS_INFO_PAZIENTE.DATI_AMMINISTRATIVI.dataIngresso, 'YYYYMMDDHHmm') <= data_ora && data_ora <= moment()) || ora.val().length != 5)  {
               $.dialog("Data o Ora inserita non corretta",
                   {title: "Attenzione",
                       buttons: [
                           {label: "OK", action: function () {
                              $(this).val("");
                               $("#txtDataIns").addClass("tdError");
                               ora.addClass("tdError");
                              $.dialog.hide();
                           }}
                       ]
                   }
               );
           }else{
               $("#txtDataIns").removeClass("tdError");
                ora.removeClass("tdError");
            }

        });
        $('#txtOraIns').on("blur",function(e){
            var data = $('#h-txtDataIns').val() + $(this).val();
            data = moment(data, 'YYYYMMDDHH:mm');
            var ora =  $('#txtOraIns').val();
            var dataCampo =  $("#txtDataIns");

            if(!(moment(home.CARTELLA.NS_INFO_PAZIENTE.DATI_AMMINISTRATIVI.dataIngresso, 'YYYYMMDDHHmm') <= data && data <= moment()) || ora.length != 5){
                $.dialog("Ora inserita non corretta",
                    {title: "Attenzione",
                        buttons: [
                            {label: "OK", action: function () {
                                $(this).val("");
                                $('#txtOraIns').addClass("tdError");
                                dataCampo.addClass("tdError");
                                $.dialog.hide();

                            }}
                        ]
                    }
                );
            }else{
                dataCampo.removeClass("tdError");
                $('#txtOraIns').removeClass("tdError");
            }
        });
    },

    overrideFunction: function () {
        NS_FENIX_SCHEDA.beforeSave =  NS_TERAPIA.beforeSave;
        NS_FENIX_SCHEDA.successSave = NS_TERAPIA.successSave;
        NS_FENIX_SCHEDA.leggiCampiDaSalvare = NS_TERAPIA.leggiCampiDaSalvare;
        NS_FENIX_SCHEDA.customizeParam = function (params) {
            params.valida = true;
            return params;
        };
    },

    detectBaseUser: function () {
        var butSalva = $("button.butSalva");
        var TipoPersonale = home.baseUser.TIPO_PERSONALE;
        var statoContatto = $("#hStatoContatto").val();        
        if(TipoPersonale==="M"){
            NS_TERAPIA.valorizeMedico();
        }                

        if(NS_TERAPIA.tipoWk === 'LISTA_APERTI' && NS_TERAPIA.tipoPersonale === 'M' && $('#hUteRiferimento').val() !== home.baseUser.IDEN_PER){
            butSalva.hide();
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        }else if(NS_TERAPIA.tipoWk === 'LISTA_CHIUSI' && NS_TERAPIA.tipoPersonale === 'M' && ($('#hUteRiferimento').val() === home.baseUser.IDEN_PER || home.basePermission.hasOwnProperty('SUPERUSER'))){
            butSalva.show();
        }else if (statoContatto === "ADMITTED"){
            butSalva.show();
        }else if (TipoPersonale === "A" || statoContatto === "DISCHARGED")  {
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
            butSalva.hide();
        }
    },

    defaultValorize: function () {
        NS_TERAPIA.filtroSel = 0;
        $("#checkMedico_MEDICO").addClass("CBpulsSel");
        $("#checkMagazzino_MAGAZZINO").addClass("CBpulsSel");
        $("#radFiltroWk_0").addClass("RBpulsSel");
        $('#txtOraIns').val(moment().format('HH:mm'));
    },

    /**
     * Inizializza la Wk dei farmaci piu utilizzati
     */
    initWkFarmaciUtilizzati: function () {
        $("div#divWkFarmaci").height("160px");

        NS_TERAPIA.WkFarmaciUtilizzato = new WK({
            id       : "FARMACI_UTILIZZATI",
            container: "divWkFarmaci",
            aBind    : [ "IDEN_PROVENIENZA" ],
            aVal     : [ $("#IDEN_PROVENIENZA").val() ]
        });
        NS_TERAPIA.WkFarmaciUtilizzato.loadWk();

    },


    initWkFarmaci : function (descr,principio,codice) {

        $("div#divWkFarmaci").height("160px");
        var params = {
            container: "divWkFarmaci"
        };
        if(!((descr != '' && descr != "%25") || (principio != ''&& principio != "%25") || (codice != ''&& codice != "%25"))){
            params.loadData =  false;
        }
        if($("#checkMagazzino_MAGAZZINO").hasClass("CBpulsSel")){
            params.id = 'FARMACI_MAGAZZINO';
            params.aBind = ["descr", "principio", "codice", "cod_cdc"];
            params.aVal = [descr, principio, codice, home.baseUserLocation.cod_cdc];

        }else{
            params.id = 'FARMACI';
            params.aBind =  ["descr", "principio", "codice"];
            params.aVal = [descr, principio, codice];

        }
        NS_TERAPIA.WkFarmaci = new WK(params);
        NS_TERAPIA.WkFarmaci.loadWk();

    },

    valorizeMedico: function () {
        var DescrPersonale = home.baseUser.DESCRIZIONE;
        var IdenPresonale = home.baseUser.IDEN_PER;
        $("#txtMedico").val(DescrPersonale).attr({"data-c-value": IdenPresonale, "data-c-descr": DescrPersonale});
        $("#h-txtMedico").val(IdenPresonale);
    },

    /**
     * setto univocità tra 2 checkbox   (fa schifo)
     */
    gestCompetenza: function () {
        var id = this.id;
        $("#checkMedico_MEDICO, #checkInfermiere_PDP").removeClass("CBpulsSel");
        $("#" + id).addClass("CBpulsSel");

        if(id == 'checkMedico_MEDICO') {
            //se viene cliccato il medico l'autocomplete deve essere attivo
            $("#txtMedico").removeAttr("disabled");

            $('#acMedico').data("acList").enable();
        } else {
            //svuoto l'autocomplete
            $("#txtMedico").val("").attr({"data-c-value": "", "data-c-descr": "", "disabled": "disabled"});
            $("#h-txtMedico").val(home.baseUser.IDEN_PER);
            $('#acMedico').data("acList").disable();

        }
    },

    caricaWkFarmaci : function (filtro) {
        if ( filtro == '') {
            filtro = NS_TERAPIA.setUpperFiltro('filtroText');
        }

        switch (NS_TERAPIA.filtroSel) {
            case '0': //farmaci + utilizzati
                NS_TERAPIA.initWkFarmaciUtilizzati();
                break;
            case '1': //filtro per descrizione
                NS_TERAPIA.initWkFarmaci(filtro,"","");
                break;
            case '2': //filtro per codice
                NS_TERAPIA.initWkFarmaci("","",filtro);
                break;
            case '3': //filtro per principio attivo
                NS_TERAPIA.initWkFarmaci("",filtro,"");
                break;
        }

    },
    /**
     * mette uppercase il filtro che ho passato  e ritorna il valore uppercase
     * @param id
     * @returns {*}
     */
    setUpperFiltro       : function (id) {
        var testoFiltro;
        var idSelector = $("#" + id);

        if(idSelector.val() == "") {
            testoFiltro = "%25";
        } else {
            testoFiltro = idSelector.val().toUpperCase();
            idSelector.val(testoFiltro);
        }
        return testoFiltro;
    },
    /**
     * Funzioni che permettono di selezionare un farmaco dalla wk dei più utilizzati e inserirlo nella nostra selezione
     * @param data
     * @returns {*|jQuery}
     */
    addFarmaco : function (data) {
        return $(document.createElement('a'))
            .attr('onclick', "NS_TERAPIA.addComboList(" + JSON.stringify(data) + ")")
            .html("<i class=' icon-up-circled icoFarm' title='Aggiungi farmaco'>");
    },
    /**
     * crea le colonne di intestazione della table
     * @returns {HTMLElement}
     */
    creaIntestazioneTable: function () {
        var tr = document.createElement("tr");
        var thEliminaFarmaco = document.createElement("th");
        var thDescrFarmaco = document.createElement("th");
        var thDosaggio = document.createElement("th");
        var thUnitaMisura = document.createElement("th");
        var thVieSomministraz = document.createElement("th");
        var thVeicolo = document.createElement("th");
        var thDiluizione = document.createElement("th");
        var thVelocita = document.createElement("th");
        var thPosologia = document.createElement("th");

        thEliminaFarmaco.innerText = "Elimina farmaco";
        thDescrFarmaco.innerText = traduzione.lblDescrizione;
        thDosaggio.innerText = traduzione.lblDosaggio;
        thUnitaMisura.innerText = traduzione.lblUnitaMisura;
        thVieSomministraz.innerText = traduzione.lblVSomministraz;
        thVeicolo.innerText = traduzione.lblVeicolo;
        thDiluizione.innerText = traduzione.lblDiluizione;
        thVelocita.innerText = traduzione.lblVelocita;
        thPosologia.innerText = traduzione.lblPosologia;

        tr.appendChild(thEliminaFarmaco);
        tr.appendChild(thDescrFarmaco);
        tr.appendChild(thDosaggio);
        tr.appendChild(thUnitaMisura);
        tr.appendChild(thVieSomministraz);
        tr.appendChild(thVeicolo);
        tr.appendChild(thDiluizione);
        tr.appendChild(thVelocita);
        tr.appendChild(thPosologia);

        $(tr).addClass("trIntestazione");

        return tr;
    },
    /**
     * Aggiunge una riga alla tabella dei farmaci selezionati
     * la prima volta che creo il tr lo creo con tutti gli elementi, le volte successive creo il tr con solo il nome del farmaco e la quantità
     * ho fatto il clone di elementi che esistono x evitare di fare le query e riaprire un'altra connessione al db
     * @param rec = {"CODICE": "022531139","N_ROW": 1,"DESCRIZIONE": "TAVOR*4MG/ML IM IV 5F 1ML","PRINCIPIO_ATTIVO": "LORAZEPAM (DC.IT) (FU)","IDEN": 1206319}
     */
    addComboList : function (rec) {
        function controllaDosaggio (text) {
           try {
               text = text.replace(',','.');
               eval('var a = ' + text);
               return true;

           }catch (e){
               logger.error(e);
               return false;
           }
        }
        var tr = $(document.createElement("tr")).attr({"IDEN_FARMACO": rec.IDEN, "class": "trTerapia"});
        var tdDosaggio = $(document.createElement("td")).attr({"id": "tdDosaggio"});
        var classTerapia = $(".trTerapia");

        tdDosaggio.append($(document.createElement("input")).attr({"type":"text","value": 1, "class" :"inputposologia tdObb", "id":"dosaggio"+rec.IDEN }).on("blur", function(){
            if(this.value == ''){
                $(this).removeClass("tdObb");
                $(this).addClass("tdError") ;
                home.NOTIFICA.error({message: "Attenzione Inserire il dosaggio", title: "Error" });
            }else if(!controllaDosaggio(this.value)) {
                home.NOTIFICA.error({message: "Attenzione Inserire un valore numerico nel dosaggio", title: "Error" });
                $(this).removeClass("tdObb");
                $(this).addClass("tdError");
            }else{
                $(this).removeClass("tdError");
                $(this).addClass("tdObb");
            }
        }));
        var tdImgCancella = document.createElement("td");
        var imgCancella = $(document.createElement("img")).attr({"id": "tdImmage"});
        $(imgCancella)
            .attr({"id": "imgCancella_" + rec.IDEN,"idx": rec.IDEN, "src": "./img/CMenu/chiudi.png", "width": "16px", "height": "16px", "class": "cancella"})
            .on("click", function () {
                var tr = $(this).closest("tr");
                var id = tr.find("td input.cmbUnitaMisura").attr("id");
                V_FARMACI.elements[id] = {};
                NS_FENIX_SCHEDA.addFieldsValidator({config: "V_FARMACI"});

                tr.remove();

                //rimuovere anche il validator
                if($(".trTerapia").size() == 0){
                    $("tr#1").remove();
                    NS_TERAPIA.farmaci = false;
                }
            });
        $(tdImgCancella).append(imgCancella);

        var tdFarmaco = $(document.createElement("td")).attr({"id": "tdDescrFarmaco"}).text(rec.DESCRIZIONE);
        var tdUnitaMisura = $(document.createElement("td")).attr({"id": "tdUnitaMisurazione"}).append($("#cmbUnitaMisura_").clone().attr({"class": "cmbUnitaMisura tdObb",  "id": "cmbUnitaMisura" + +rec.IDEN}));


        var table =  $("#colTerapiaSel").find("table");
        if(classTerapia.size() == 0) {
            var trIntestazione = $(document.createElement("tr")).attr({"id": 1});
            var tdvuoto = $(document.createElement("td")).attr({"colspan":"4"});
            var tdVieSomm = $(document.createElement("td")).attr({"id": "tdVieSomministra","rowspan":2}).append($("#cmbVieSomministra_").clone().attr({"id": "cmbVieSomministra", "class": "tdObb"}));
            var tdDiluizione = $(document.createElement("td")).attr({"id": "tdDiluizione","rowspan":2}).append($("#cmbDiluizione_").clone().attr({"id": "cmbDiluizione"}));
            var tdVeicolo = $(document.createElement("td")).attr({"id": "tdVeicolo","rowspan":2}).append($("#cmbVeicolo_").clone().attr({"id": "cmbVeicolo"}));
            var tdVelocita = $(document.createElement("td")).attr({"id": "tdVelocita","rowspan":2}).append($(document.createElement("input")).attr({"id": "txtVelocita", "type": "text"}).css("width", "100%"));
            var tdPosologia = $(document.createElement("td")).attr({"id": "tdPosologia","rowspan":2}).append($(document.createElement("input")).attr({"id": "txtPosologia", "type": "text"}).css("width", "100%"));
            table.append(trIntestazione
                    .append(tdvuoto)
                    .append(tdVieSomm)
                    .append(tdVeicolo)
                    .append(tdDiluizione)
                    .append(tdVelocita)
                    .append(tdPosologia)
            );

            $("#cmbVieSomministra").show();
            $("#cmbDiluizione").show();
            $("#cmbVeicolo").show();

        }

        table.append(tr.append(tdImgCancella).append(tdFarmaco).append(tdDosaggio).append(tdUnitaMisura));
        $("#tdVieSomministra").attr("rowspan", classTerapia.size() + 2);
        $("#tdDiluizione").attr("rowspan", classTerapia.size() + 2);
        $("#tdVeicolo").attr("rowspan", classTerapia.size() + 2);
        $("#tdVelocita").attr("rowspan", classTerapia.size() + 2);
        $("#tdPosologia").attr("rowspan", classTerapia.size() + 2);

        $(".cmbUnitaMisura").show();

        NS_TERAPIA.farmaci = true;
        NS_FENIX_SCHEDA.addFieldsValidator({config: "V_FARMACI"});
        V_FARMACI.elements.cmbVieSomministra ={tab: "tabDati", "name": "Vie di somministrazione", "status": "required"};

        V_FARMACI.elements["cmbUnitaMisura"+rec.IDEN] = {
            tab: "tabDati", "name": "Formulazione", "status": "required"
        };

        //V_FARMACI.elements.cmbUnitaMisura ={tab: "tabDati", "name": "Unita Di Misura", "status": "required"};
        NS_FENIX_SCHEDA.addFieldsValidator({config: "V_FARMACI"});


        document.getElementById("dosaggio"+rec.IDEN).focus();


    },

    createOptionFromJsonData: function (jsonData) {
        var select = ($(document.createElement("select")).attr({"id": "cmbVieSomministraz"}).css("width", "100%"));

        $.each(jsonData, function (chiave, valore) {
            select.append($(document.createElement("option")).val(valore).text(chiave));
        });

        return select
    },

    /**
     * Personalizzo il json  consente la scelta multipla di farmaci ogni farmaco scenlto sarà una riga inserita nella tabella farmaci associati
     * @param json
     * @returns {*}
     */
      //  @deprecated
    customizeJson           : function (json) {
        json.campo.push(NS_TERAPIA.leggiCampiDaSalvare());

        return json;
    },
    /**
     * funzione che personalizza il salvataggio andando ad aggiungere all'xml un json con le terapie
     * @returns {{}}
     */
    leggiCampiDaSalvare : function () {

        var protocollo = 'N';

        if($("#checkInfermiere_PDP").hasClass('CBpulsSel')) {
            protocollo = 'S'
        }

        var jsonTerapia = {};
        jsonTerapia.IDEN_ANAG = $("#IDEN_ANAG").val();
        jsonTerapia.IDEN_CONTATTO = $("#IDEN_CONTATTO").val();
        jsonTerapia.VIE_SOMMINISTRAZIONE = $("#cmbVieSomministra").find("option:selected").attr("data-value");
        jsonTerapia.VEICOLO = $("#cmbVeicolo").find("option:selected").attr("data-value");
        jsonTerapia.DILUIZIONE = $("#cmbDiluizione").find("option:selected").attr("data-value");
        jsonTerapia.VELOCITA = $("#txtVelocita").val();
        jsonTerapia.POSOLOGIA = $("#txtPosologia").val();
        jsonTerapia.UTENTE_INSERIMENTO = home.baseUser.IDEN_PER;
        jsonTerapia.DATA_SOMMINISTRAZIONE = $("#h-txtDataIns").val() + $("#txtOraIns").val();
        jsonTerapia.UTENTE_COMPETENTE = $("#h-txtMedico").val();
        jsonTerapia.PREVISTO_PROTOCOLLO = protocollo;

        jsonTerapia.campo = [];

        var $form = $("[data-procedura-salvataggio]");
        jsonTerapia.proceduraSalvataggio = $form.data("procedura-salvataggio");
        jsonTerapia.connessioneSalvataggio = $form.data("connessione-salvataggio");

        $.each($(".trTerapia"), function () {
            jsonTerapia.campo.push({
                KEY_CAMPO   : "FARMACI",
                IDEN_FARMACO: $(this).attr("iden_farmaco"),
                POSOLOGIA   : $(this).find(".inputposologia").val(),
                UNITA_MISURA   :     $(this).find(".cmbUnitaMisura").find("option:selected").val()
            });
        });

        return jsonTerapia;
    },

    successSave: function () {
        home.NS_LOADING.showLoading({"timeout":"5000"});
        $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>COMPLETATO</h2>");
        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        //
        home.PANEL.NS_REFERTO.apriInsTerapia(function(){home.NS_LOADING.hideLoading();});
    },

    beforeSave : function(){
        if($(".tdError").length > 0 ){
            home.NOTIFICA.error({message: "Attenzione controllare tutti i campi", title: "Error", timeout: 10});
            return false;
        }
        if(!NS_TERAPIA.farmaci){
            home.NOTIFICA.error({message: "Errore: Attenzione inserire almeno un farmaco nella terapia", title: "Error", timeout: 10});
            return false;
        }else{
         return true;
        }


    }
    //salvaHide: function(uteRif, tipoWk, tipoPersonale){
    //    var butSalva = $("button.butSalva");


   // }

};
