/*imposto il riferimento al modello utilizzato per gestirne eventuali eventi post-caricamento come ad esmpio l'inseirimento di un farmaco*/
var msg = '';

var ModelloInterfaccia = {
    init: function() {
    },
    setEvents: function() {
    },
    setData: function() {
    },
    onFarmacoAppend: function() {
    },
    onFarmacoRemove: function() {
    }
};

var ModelloAttivo = ModelloInterfaccia;
/**/

var ModelloBase = {
    init: function() {
        top.Terapie.logger.debug('ModelloBase.init();');
        ModelloBase.setEvents();
        ModelloBase.setData();
        ModelloAttivo = ModelloBase;
    },
    setEvents: function() {
        try {
            top.Terapie.logger.debug('ModelloBase.setEvents();');
            msg = 'Applica Generic';
            generic.setEvents();
            msg = 'Applica Default';
            Default.setDefault();
            msg = 'Applica prescrizione';
            prescrizione.setEvents();
            msg = 'Applica utility';
            utility.setEvents();

            if (parent.name != "CicloTerapia") {
                parent.attesa(false);
            }

        } catch (e) {
            alert(msg + " ;" + e.description);
        }
    },
    setData: function() {
        top.Terapie.logger.debug('ModelloBase.setData();');
        validita.setNumeroGiorni();
        //		validita.setNumeroSomministrazioni(false);
        try {
            msg = "Set dati prescrizione";
            prescrizione.setData();
        } catch (e) {
            alert(msg + " ;" + e.description);
        }
    },
    onFarmacoAppend: function() {
    },
    onFarmacoRemove: function() {
    }
};

var ModelloTerapia = {
    init: function() {
        top.Terapie.logger.debug('ModelloTerapia.init();');
        ModelloTerapia.setEvents();
        ModelloTerapia.setData();
        ModelloAttivo = ModelloTerapia;
    },
    setEvents: function() {
        top.Terapie.logger.debug('ModelloTerapia.setEvents();');
        try {
            msg = 'Applica eventi alternabilità';
            ModelloTerapia.setAlternabilitaEvents();
            msg = 'Applica ModelloBase';
            ModelloBase.setEvents();
            msg = 'Applica farmaci';
            farmaci.setEvents();

            msg = 'Applica blur Durata Dettaglio';
            ModelloTerapia.setDurataDettaglioBlur();

        } catch (e) {
            alert(msg + " ;" + e.description);
        }
    },
    setData: function() {
        top.Terapie.logger.debug('ModelloTerapia.setData();');
        ModelloBase.setData();
    },
    onFarmacoAppend: function() {
        top.Terapie.logger.debug('ModelloTerapia.onFarmacoAppend();');
        timelines.svuota_cambia_dosi();
        farmaci.setEventsSomma(farmaci.TipoSomma, farmaci.DestinatarioSomma);
    },
    onFarmacoRemove: function() {
        top.Terapie.logger.debug('ModelloTerapia.onFarmacoRemove();');
    },
    setDurataDettaglioBlur: function() {
        //se la durata è > 24h disabilita la prescrizione oraria
        $('input[name="DurataDettaglio"]').blur(function() {
            var value = parseInt($(this).val(), 10);
            if (value >= 24) {
                $('input[name="TipoPrescrizione"][value="1"]').attr({"disabled": "disabled", "checked": ""});
            } else {
                $('input[name="TipoPrescrizione"][value="1"]').attr("disabled", "");
            }
        });
    },
    /*setAlternabilitaEvents:function(){
     $('input[name="TipoAltarnabilita"]').click(function(){
     
     var gruppo_prescrizioni = getElementsByAttributes({cls:'GruppoPrescrizioni'},document.body,'div')[0];
     
     if($(this).val() == 'SECONDARY'){
     var lst = getElementsByAttributes({name:'TipoPrescrizione'},document.body,'div');
     generic.obbliga(lst[0],false);
     
     $(gruppo_prescrizioni).find('div[cls="UserInput"]').each(
     function(){generic.obbliga(this,false);}
     )
     
     generic.show(gruppo_prescrizioni,false);
     
     }else{
     lst = getElementsByAttributes({cls:'GruppoPrescrizioni'},document.body,'div');
     generic.show(gruppo_prescrizioni,true);
     }
     
     });
     }*/

    setAlternabilitaEvents: function() {
        $('input[name="TipoAltarnabilita"]').click(function() {

            var gruppo_prescrizioni = getElementsByAttributes({cls: 'GruppoPrescrizioni'}, document.body, 'div')[0];


            switch ($(this).val()) {
                case 'PRIMARY':
                    //mostro gruppo_prescrizioni
                    generic.show(gruppo_prescrizioni, true);

                    $('input[name="TipoPrescrizione"]').attr("disabled", "disabled");
                    $('input[name="TipoPrescrizione"][value="1"]').removeAttr("disabled").click();

                    break;
                case 'SECONDARY':
                    //imposto oraria,
                    $('input[name="TipoPrescrizione"][value="1"]').click();
                    //nascondo gruppo_prescrizioni
                    generic.show(gruppo_prescrizioni, false);

                    break;
                default:
                    //mostro gruppo_prescrizioni
                    generic.show(gruppo_prescrizioni, true);
                    $('input[name="TipoPrescrizione"]').removeAttr("disabled");
                    break;
            }

        });
    }
};

var ModelloTerapiaVelocita = {
    abilitaCalcoloGammaChilo: false,
    init: function() {
        top.Terapie.logger.debug('ModelloTerapiaVelocita.init();');
        try {
            if (this.abilitaCalcoloGammaChilo) {
                // Si evita il calcolo della velocità per le vecchie terapie infusionali continue pompe siringa
                if ($('div[cls="UserInput"] input[name="Concentrazione"]').val() != undefined && $('div[cls="UserInput"] input[name="Dose"]').val() != undefined) {
                    NS_TERAPIA_DOSAGGIO.init();
                    NS_TERAPIA_CONCENTRAZIONE.init();
                    NS_TERAPIA_VELOCITA.init();
                }
            }

            ModelloTerapiaVelocita.setEvents();
            ModelloTerapiaVelocita.setData();
            ModelloTerapiaVelocita.checkVelocitaBck();
            ModelloAttivo = ModelloTerapiaVelocita;
        } catch (e) {
            alert(e.description);
        }
    },
    setEvents: function() {
        top.Terapie.logger.debug('ModelloTerapiaVelocita.setEvents();');
        try {
            msg = 'Applica ModelloTerapia';
            ModelloTerapia.setEvents();
            msg = 'Applica velocità ';
            velocita.setEvents();
        } catch (e) {
            alert(msg + " ;" + e.description);
        }
    },
    setData: function() {
        top.Terapie.logger.debug('ModelloTerapiaVelocita.setData();');
        ModelloTerapia.setData();
    },
    setAbilitaCalcoloGammaChilo: function(isAttivo) {
        this.abilitaCalcoloGammaChilo = isAttivo;
    },
    onFarmacoAppend: function() {
        top.Terapie.logger.debug('ModelloTerapiaVelocita.onFarmacoAppend();');
        ModelloTerapia.onFarmacoAppend();

        if (this.abilitaCalcoloGammaChilo) {
            if ($('div[cls="UserInput"] input[name="Concentrazione"]').val() != undefined && $('div[cls="UserInput"] input[name="Dose"]').val() != undefined) {
                NS_TERAPIA_CONCENTRAZIONE.init();
            }
        }
    },
    onFarmacoRemove: function() {
        top.Terapie.logger.debug('ModelloTerapiaVelocita.onFarmacoRemove();');

        if (this.abilitaCalcoloGammaChilo) {
            if ($('div[cls="UserInput"] input[name="Concentrazione"]').val() != undefined && $('div[cls="UserInput"] input[name="Dose"]').val() != undefined) {
                NS_TERAPIA_CONCENTRAZIONE.init();
                NS_TERAPIA_VELOCITA.init();
            }
        } else {
            farmaci.sommaUnitaCompatibili({
                tipo: 'ml',
                nameDestinazione: 'VolumeTotale'
            });
            getElementsByAttributes({name: 'Velocita'}, document.body, 'input')[0].blur();
        }
    },
    checkVelocitaBck: function() {
        if ($('*[name="VelocitaBck"] div').length > 0) {
            $('input[name="Velocita"]').closest('div[cls="Riga"]').prepend(
                    $('<div></div>')
                    .attr({title: 'Apri storico velocità', cls: "Button", 'Storico': 'S'})
                    .append('<div></div>')
                    .click(velocita.apriStorico)
                    );
        }
    }
};

var ModelloOssigeno = {
    init: function() {
        top.Terapie.logger.debug('ModelloOssigeno.init();');
        ModelloOssigeno.setEvents();
        ModelloOssigeno.setData();
    },
    setEvents: function() {
        top.Terapie.logger.debug('ModelloOssigeno.setEvents();');
        try {
            msg = 'Applica ModelloBase';
            ModelloBase.setEvents();
            msg = 'Applica ossigenoterapia';
            ossigenoterapia.setEvents();
            msg = 'Applica utility';
            utility.setEvents();

        } catch (e) {
            alert(msg + " ;" + e.description);
        }

        ModelloAttivo = ModelloOssigeno;
    },
    setData: function() {
        top.Terapie.logger.debug('ModelloOssigeno.setData();');
        ModelloBase.setData();
    },
    onFarmacoAppend: function() {
        top.Terapie.logger.debug('ModelloOssigeno.onFarmacoAppend();');
    },
    onFarmacoRemove: function() {
        top.Terapie.logger.debug('ModelloOssigeno.onFarmacoAppend();');
    }
};

/*var DragDrop = {
 setTarget:function(){
 
 if(typeof parent.DragDrop == 'undefined')return;
 
 lst = getElementsByAttributes({cls:"GruppoFarmaciDescrizione"},document.body,'div');
 for (var i=0;i<lst.length;i++){
 parent.DragDrop.addTarget({object:lst[i],gruppo:'farmaci'});
 }
 }
 }*/

var velocita = {
    setEvents: function() {
        velocita.setEventsCalcoloVelocitaDurata();
    },
    setEventsCalcoloVelocitaDurata: function() {
        getElementsByAttributes({name: 'VolumeTotale'}, document.body, 'input')[0].attachEvent("onblur", velocita.volumeTotaleBlur);
        getElementsByAttributes({name: 'Velocita'}, document.body, 'input')[0].attachEvent("onblur", velocita.setDurata);
        getElementsByAttributes({name: 'Durata'}, document.body, 'input')[0].attachEvent("onblur", velocita.setVelocita);
        getElementsByAttributes({name: 'UdmVelocita'}, document.body, 'select')[0].attachEvent("onchange", velocita.setDurata);
        getElementsByAttributes({name: 'UdmDurata'}, document.body, 'select')[0].attachEvent("onchange", velocita.setVelocita);
    },
    setVolumeFarmaciBlur: function() {
        var lst = getElementsByAttributes({name: 'VolumeFarmaco'}, document.body, 'input');
        //alert(lst.length);
        for (var i = 0; i < lst.length; i++) {
            lst[i].attachEvent("onblur", velocita.farmacoVolumeBlur);
        }
    },
    setDoseFarmaciBlur: function() {
        var lst = getElementsByAttributes({name: 'DoseFarmaco'}, document.body, 'input');
        //alert(lst.length);
        for (var i = 0; i < lst.length; i++) {
            lst[i].attachEvent("onblur", velocita.farmacoDoseBlur);
        }
    },
    farmacoDoseBlur: function() {
        //alert(checkDato.isPositive());
        if (!checkDato.isTextualPositive())
            return;
        velocita.sommaVolumi();

    },
    volumeTotaleBlur: function() {
        velocita.setDurata();
    },
    farmacoVolumeBlur: function() {

        if (!checkDato.isNotNegative())
            return;
        velocita.sommaVolumi();

    },
    sommaVolumi: function() {
        var lst = getElementsByAttributes({name: 'VolumeFarmaco'}, document.body, 'input');
        var volumeTotale = 0;

        var dose, volume;

        for (var i = 0; i < lst.length; i++) {

            volume = lst[i];
            dose = getElementsByAttributes({name: 'DoseFarmaco'}, lst[i].parentNode.parentNode.parentNode, 'input')[0];

            if (checkDato.isObligatory(dose) || checkDato.isObligatory(volume)) {
                if (dose.value != '' && volume.value != '') {
                    volumeTotale += (eval(volume.value) * eval(dose.value));
                }

            }

        }
        getElementsByAttributes({name: 'VolumeTotale'}, document.body, 'input')[0].value = volumeTotale;
        getElementsByAttributes({name: 'Velocita'}, document.body, 'input')[0].blur();
    },
    setDurata: function(parameters) {
        top.Terapie.logger.debug('velocita.setDurata(' + typeof parameters + ')');
        try {
            if (!checkDato.isPositive())
                return;
        } catch (e) {
            //alert(e.description);
            //capita quando viene forzato la funzione senza passare da event hander (event.srcElement on error);
        }

        parameters = checkParameter(parameters, {});
        parameters.objVelocita = checkParameter(parameters.objVelocita, $('input[name="Velocita"]'));
        parameters.objVelocitaMinuti = checkParameter(parameters.objVelocitaMinuti, $('input[name="VelocitaMinuti"]'));
        parameters.objDurata = checkParameter(parameters.objDurata, $('input[name="Durata"]'));
        parameters.objVolumeTotale = checkParameter(parameters.objVolume, $('input[name="VolumeTotale"]'));
        parameters.factorVelocita = checkParameter(parameters.factorVelocita, utility.getCmbValue({name: 'UdmVelocita'}));
        parameters.factorDurata = checkParameter(parameters.factorDurata, utility.getCmbValue({name: 'UdmDurata'}));

        var velocita = parameters.objVelocita.val();
        top.Terapie.logger.debug('velocita.setDurata : velocita=' + velocita);

        var volume = parameters.objVolumeTotale.val();
        top.Terapie.logger.debug('velocita.setDurata : volume=' + volume);

        if (velocita == '' || volume == '') {
            return;
        }


        var velocitaMinuti = velocita / parameters.factorVelocita;
        top.Terapie.logger.debug('velocita.setDurata : velocitaMinuti=' + velocitaMinuti);

        parameters.objVelocitaMinuti.val(velocitaMinuti);

        var durata = generic.roundTo(volume / velocitaMinuti / parameters.factorDurata, 2);
        top.Terapie.logger.debug('velocita.setDurata : durata=' + durata);

        parameters.objDurata.val(durata);
    },
    setVelocita: function() {
        //alert('Velocita: ' + event.srcElement);
        if (!checkDato.isPositive())
            return;

        var pDurata = getElementsByAttributes({name: 'Durata'}, document.body, 'input')[0].value;
        var volume = getElementsByAttributes({name: 'VolumeTotale'}, document.body, 'input')[0].value;

        if (pDurata == '' || volume == '')
            return;


        var factorVelocita = utility.getCmbValue({name: 'UdmVelocita'});
        var factorDurata = utility.getCmbValue({name: 'UdmDurata'});

        var velocitaMinuti = volume / pDurata / factorDurata;

        getElementsByAttributes({name: 'VelocitaMinuti'}, document.body, 'input')[0].value = velocitaMinuti;
        getElementsByAttributes({name: 'Velocita'}, document.body, 'input')[0].value = velocitaMinuti * factorVelocita;
        $('div[cls="UserInput"] input[name="Velocita"]').trigger('change');
    },
    apriStorico: function() {

        var msg = "";

        $('*[name="VelocitaBck"] div[cls="Item"]').each(function() {

            var $item = $(this);
            var velocita = $item.find('input[name="VelocitaBck"]').val();
            var udm = $item.find('select[name="UdmVelocitaBck"]/option').val();
            var data_inizio = $item.find('input[name="dtaInizioVelocitaBck"]').val();
            var data_fine = $item.find('input[name="dtaFineVelocitaBck"]').val();

            msg += "\n" + velocita + ' ' + udm + ' dal ' + data_inizio + ' al ' + data_fine;

        });

        alert(msg);
    }
};

var farmaci = {
    TipoSomma: null,
    DestinatarioSomma: null,
    DosiAttive: true,
    DosiObbliga: true,
    UdmAttive: true,
    UdmObbliga: true,
    setEvents: function() {
        farmaci.setButtonRimuovi();
        utility.alterna({cls: "Farmaco"});
        farmaci.setNumeroFarmaci();
    },
    setEventsSomma: function(pTipo, pDest) {

        farmaci.TipoSomma = pTipo;
        farmaci.DestinatarioSomma = pDest;

        $('div[cls="Farmaco"] input[name="DoseFarmaco"]').blur(farmaci.DoseFarmacoBlur);
        $('div[cls="Farmaco"] select[name="UdmFarmaco"]').change(farmaci.UdmFarmacoChange);
    },
    UdmFarmacoChange: function() {
        //alert('Change: ');
        farmaci.sommaUnitaCompatibili(/*farmaci.TipoSomma,farmaci.DestinatarioSomma*/);
    },
    DoseFarmacoBlur: function() {
        //alert('Blur: ');
        if (!checkDato.isTextualPositive())
            return;
        farmaci.sommaUnitaCompatibili(/*farmaci.TipoSomma,farmaci.DestinatarioSomma*/);
    },
    setNumeroFarmaci: function() {
        var lst = getElementsByAttributes({cls: 'Farmaco'}, document.body, 'div');
        if (lst.length > 0) {
            getElementsByAttributes({name: 'FarmaciSelezionati'}, document.body, 'input')[0].value = lst.length;
        } else {
            getElementsByAttributes({name: 'FarmaciSelezionati'}, document.body, 'input')[0].value = '';
        }
    },
    setButtonRimuovi: function() {
        var lst = getElementsByAttributes({cls: 'Farmaco'}, document.body, 'div');
        for (var i = 0; i < lst.length; i++) {

            lstButton = getElementsByAttributes({cls: 'Button'}, lst[i], 'div');
            for (var j = 0; j < lstButton.length; j++) {
                lstButton[j].onclick = farmaci.ButtonRimuoviClick;
            }
            farmaci.IdSessione = null;

        }
    },
    ButtonRimuoviClick: function(params) {/*{[iden_farmaco][,id_sessione][,callBackOk][,callBackKo]}*/

        params = typeof params == 'undefined' ? {} : params;

        if (!confirm('Si conferma la rimozione del farmaco?'))
            return;

        var obj;
        if (typeof params.iden_farmaco != 'undefined') {
            obj = $('div[cls="Farmaco"][iden="' + params.iden_farmaco + '"]')[0];
        } else {
            obj = farmaci.getFarmaco(event.srcElement);
        }

        var id_sessione = checkParameter(params.id_sessione, parent.$('iframe#SchedaTerapia').data("ID_SESSIONE"));

        var gruppo = farmaci.getGruppo(obj);
        dwr.engine.setAsync(true);
        //alert(gruppo.getAttribute("tipo") + ' : ' +obj.getAttribute("iden") )
        Terapia.removeFarmaco(gruppo.getAttribute("tipo"), obj.getAttribute("iden"), id_sessione, callBack);
        dwr.engine.setAsync(true);

        function callBack(resp) {
            if (resp[0] == 'KO') {
                alert(resp[1]);
                if (typeof params.callBackKo == 'function') {
                    params.callBackKo();
                }
                return;
            }
            obj.removeNode(true);
            utility.alterna({cls: "Farmaco"});
            farmaci.setNumeroFarmaci();
            ModelloAttivo.onFarmacoRemove();

            if (typeof params.callBackOk == 'function') {
                params.callBackOk();
            }

        }
    },
    getFarmaco: function(elm) {
        while (elm.getAttribute("cls") != "Farmaco") {
            elm = elm.parentNode;
        }
        return elm;
    },
    getGruppo: function(elm) {
        while (elm.getAttribute("cls") != "GruppoFarmaci") {
            elm = elm.parentNode;
        }
        return elm;
    },
    getGruppi: function() {

        var ar = new Array();
        //var voce = {Text: '', tipo: '', Min: 0, Max: 0, Current: 0};
        var lst = getElementsByAttributes({cls: "GruppoFarmaci"}, document.body, 'div');

        for (var i = 0; i < lst.length; i++) {

            ar.push({
                Text: lst[i].previousSibling.innerText,
                tipo: lst[i].tipo,
                Min: parseInt(lst[i].minimo, 10),
                Max: parseInt(lst[i].massimo, 10),
                Current: lst[i].childNodes.length
            });
        }
        return ar;
    },
    getIdenFarmaci: function() {
        var lst = getElementsByAttributes({cls: "Farmaco"}, document.body, 'div');
        ;

        var ar = new Array();
        for (var i = 0; i < lst.length; i++) {
            ar.push(lst[i].iden);
        }
        return ar;

    },
    setFarmaco: function(selection) {

        farmaci.IdSessione = selection.IdSessione;
        dwr.engine.setAsync(false);
        Terapia.getFarmaco(selection.tipo, selection.iden_farmaco, selection.IdSessione, callBack);
        dwr.engine.setAsync(true);

        function callBack(resp) {

            if (resp[0] == 'KO') {
                alert(resp[1]);
                return;
            }

            var obj = getElementsByAttributes({cls: "GruppoFarmaci", tipo: selection.tipo}, document.body, 'div')[0];
            obj.innerHTML = obj.innerHTML + resp[1];
            farmaci.setButtonRimuovi();
            utility.alterna({cls: "Farmaco"});

            var lst = getElementsByAttributes({None: true}, obj, 'div');
//			alert('lst:'+lst.length);
            for (var i = 0; i < lst.length; i++) {
                generic.show(lst[i], false);
            }

            ModelloAttivo.onFarmacoAppend();
            farmaci.setNumeroFarmaci();

            farmaci.enableDosi(farmaci.DosiAttive, farmaci.DosiObbliga);
            farmaci.enableUdm(farmaci.UdmAttive, farmaci.UdmObbliga);
        }
    },
    remove: function(params/*respDwr*/) {
        /* francescog 20130326 - non dovrebbe più essere usata questa parte, ho riutilizzato il nome della function per fare una cosa fifferente
         
         if(respDwr[0]=='KO'){
         alert(respDwr[1]);
         return;
         }*/

        if (checkValidParameter(params.tipo) == false || checkValidParameter(params.iden) == false || checkValidParameter(params.id_sessione) == false) {
            return alert('Parametro non valido');
        }

        checkParameter(params.callBack, function() {
        });

        dwr.engine.setAsync(true);
        Terapia.removeFarmaco(params.tipo, params.iden, params.id_sessione, callBack);
        dwr.engine.setAsync(true);
    },
    sommaUnitaCompatibili: function(parameters/*pTipo,pDest*/) {/*{
     [tipo]
     [,nameDestinazione]
     [,lstUdm]
     [,lstDose]
     }*/
        top.Terapie.logger.debug('farmaci.sommaUnitaCompatibili()');
        try {
            parameters = checkParameter(parameters, {});
            parameters.tipo = checkParameter(parameters.tipo, farmaci.TipoSomma);
            parameters.nameDestinazione = checkParameter(parameters.nameDestinazione, farmaci.DestinatarioSomma);
            parameters.lstUdm = checkParameter(parameters.lstUdm, $('select[name="UdmFarmaco"] option:selected'));
            parameters.lstDose = checkParameter(parameters.lstDose, $('input[name="DoseFarmaco"]'));

            var totale = 0;
            var udmTipo, a_somma;

            for (var i = 0; i < parameters.lstUdm.length; i++) {

                try {
                    a_somma = $(parameters.lstUdm[i]).attr("somma");
                    udmTipo = a_somma.split('|')[0];

                    if (udmTipo == parameters.tipo) {
                        totale += utility.decodeTextualNumber($(parameters.lstDose[i]).val()) * eval(a_somma.split('|')[1]);
                    }
                } catch (e) {
                    top.Terapie.logger.error('sommaUnitaCompatibili' + ':' + e.description);
                }


            }
            if (totale == 0)
                totale = '';
            $('input[name="' + parameters.nameDestinazione + '"]').val(totale);

        } catch (e) {
            top.Terapie.logger.error('sommaUnitaCompatibili' + ':' + e.description);
        }
    },
    enableDosi: function(enable, obbliga) {
        farmaci.DosiAttive = enable;
        farmaci.DosiObbliga = obbliga;
        var lst = getElementsByAttributes({cls: 'UserInput', name: 'DoseFarmaco'}, document.body, 'div');

        for (var i = 0; i < lst.length; i++) {

            generic.enable(lst[i], enable);
            generic.obbliga(lst[i], obbliga);
            if (enable == false)
                generic.setValue(lst[i], "");
        }
    },
    enableUdm: function(enable, obbliga) {
        farmaci.UdmAttive = enable;
        farmaci.UdmObbliga = obbliga;
        var lst = getElementsByAttributes({cls: 'UserInput', name: 'UdmFarmaco'}, document.body, 'div');
        for (var i = 0; i < lst.length; i++) {
            generic.enable(lst[i], enable);
            generic.obbliga(lst[i], obbliga);
        }
    }
};

var prescrizione = {
    setEvents: function() {

        validita.setEvents();

        var lst = getElementsByAttributes({name: 'TipoPrescrizione'}, document.body, 'input');
        for (var i = 0; i < lst.length; i++) {
            lst[i].attachEvent("onclick", prescrizione.radioClick);

            switch (lst[i].getAttribute("value")) {
                case '0':
                    prescrizione.frequenza.setEvents();
                    break;
                case '1':
                    prescrizione.oraria.setEvents();
                    break;
                case '2':
                    prescrizione.singola.setEvents();
                    break;
                case '3':
                    prescrizione.continua.setEvents();
                    break;
                case '4':
                    prescrizione.albisogno.setEvents();
                    break;
                case '5':
                    prescrizione.ciclica.setEvents();
                    break;
                case '6':
                    prescrizione.coumadin.setEvents();
                    break;
                case '7':
                    prescrizione.tao.setEvents();
                    break;
            }

        }

        //$('div[name="DataInizio"] input').blur(function(){alert('ciao')});
        $('input[name="NumeroGiorni"]').blur(function() {
            //alert('NumeroGiorniBlur');
            switch ($('input[name="TipoPrescrizione"]:checked').val()) {
                case '7':
                    prescrizione.tao.giorno.setLimite(parseInt($(this).val(), 10));
                    break;
                default:
                    break;
            }
        });
        $('input[name="RadioNumeroGiorni"]').live("click", prescrizione.RadioNumeroGiorniClick);
    },
    setData: function() {

        var lst = getElementsByAttributes({name: 'TipoPrescrizione'}, document.body, 'input');

        for (var i = 0; i < lst.length; i++) {
            switch (lst[i].getAttribute("value")) {
                case '0':
                    prescrizione.frequenza.setData();
                    break;
                case '1':
                    prescrizione.oraria.setData();
                    break;
                case '2':
                    prescrizione.singola.setData();
                    break;
                case '3':
                    prescrizione.continua.setData();
                    break;
                case '4':
                    prescrizione.albisogno.setData();
                    break;
                case '5':
                    prescrizione.ciclica.setData();
                    break;
                case '6':
                    prescrizione.coumadin.setData();
                    break;
                case '7':
                    prescrizione.tao.setData();
                    break;
            }

        }
    },
    radioClick: function() {
        prescrizione.albisogno.init();
        $('input[name="TipoPrescrizione"]').removeAttr("selected");
        event.srcElement.setAttribute("selected");

        var vTipoPrescrizione = event.srcElement.getAttribute("value");

        $('div[cls="Prescrizione"][tipo!="' + vTipoPrescrizione + '"]').hide();
        $('div[cls="Prescrizione"][tipo="' + vTipoPrescrizione + '"]').show();//fadeIn('fast');
        var RadioNumeroGiorni = null;
        try {
            RadioNumeroGiorni = getElementsByAttributes({name: 'RadioNumeroGiorni'}, document.body, 'div')[0];
        } catch (e) {
        }
        var NumeroGiorni = $('input[name="NumeroGiorni"]').val();

        if (NumeroGiorni == 0)
            $('input[name="NumeroGiorni"]').val('');

        switch (vTipoPrescrizione) {
            case '1':
                farmaci.enableDosi(true, true);
                $('div[name="btnRefresh"]').show();
                $('div[name="btnRefreshTao"]').hide();
                try {
                    generic.show(RadioNumeroGiorni, false);
                } catch (e) {
                }
                $(RadioNumeroGiorni).find('input').attr("checked", "");
                $('input[name="NumeroGiorni"]').closest("[cls=UserInput]").show();
                $('input[name="chkNoDataFine"]').closest("[cls=UserInput]").show();
                prescrizione.oraria.timeline.init();
                break;
            case '2':
                farmaci.enableDosi(true, true);
                $('div[name="btnRefresh"],div[name="btnRefreshTao"]').hide();
                try {
                    generic.show(RadioNumeroGiorni, false);
                } catch (e) {
                }
                $(RadioNumeroGiorni).find('input').attr("checked", "");
                $('input[name="NumeroGiorni"]').val(0).closest("[cls=UserInput]").hide();
                $('input[name="chkNoDataFine"]').closest("[cls=UserInput]").hide();
                prescrizione.singola.setData();
                break;
            case '6':
                farmaci.enableDosi(true, true);
                $('div[name="btnRefresh"]').show();
                $('div[name="btnRefreshTao"]').hide();
                generic.show(RadioNumeroGiorni, true);
                switch (NumeroGiorni) {
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                        $('input[name="NumeroGiorni"]').val(NumeroGiorni);
                        $(RadioNumeroGiorni).find('input[value="' + NumeroGiorni + '"]').attr("checked", "checked").click();

                        break;
                    default:
                        $('input[name="NumeroGiorni"]').val("3");
                        $(RadioNumeroGiorni).find('input[value="3"]').attr("checked", "checked").click();
                        break;
                }
                $('input[name="NumeroGiorni"]').closest("[cls=UserInput]").hide();
                $('input[name="chkNoDataFine"]').closest("[cls=UserInput]").hide();

                break;
            case '7':
                farmaci.enableDosi(false, false);
                $('div[name="btnRefresh"]').hide();
                $('div[name="btnRefreshTao"]').show();
                prescrizione.tao.btnRefreshClick();
                try {
                    generic.show(RadioNumeroGiorni, false);
                } catch (e) {
                }
                $(RadioNumeroGiorni).find('input').attr("checked", "");
                $('input[name="NumeroGiorni"]').closest("[cls=UserInput]").show();
                $('input[name="chkNoDataFine"]').closest("[cls=UserInput]").hide();
                break;
            default:
                farmaci.enableDosi(true, true);
                $('div[name="btnRefresh"]').hide();
                $('div[name="btnRefreshTao"]').hide();
                try {
                    generic.show(RadioNumeroGiorni, false);
                } catch (e) {
                }
                $(RadioNumeroGiorni).find('input').attr("checked", "");
                $('input[name="NumeroGiorni"]').closest("[cls=UserInput]").show();
                $('input[name="chkNoDataFine"]').closest("[cls=UserInput]").show();
                break;
        }

        $('div[cls="Prescrizione"]').each(
                function() {
                    if (this.getAttribute("tipo") == vTipoPrescrizione) {
                        utility.setDipendentiObbligatori(this);
                    } else {
                        $(this).find('div[cls="UserInput"]').each(
                                function() {
                                    generic.obbliga(this, false);
                                }
                        );
                    }
                }
        );


    },
    RadioNumeroGiorniClick: function() {
        $('input[name="NumeroGiorni"]').val($(this).val());
        validita.setDataOraFine();
        prescrizione.coumadin.timeline.set();
    },
    frequenza: {
        setEvents: function() {
            $('input[name="Frequenza"]').blur(prescrizione.frequenza.campoFrequenzaBlur);
            $('input[name="TipoFrequenza"]').click(prescrizione.frequenza.radioFrequenzaClick);
        },
        setData: function() {
            validita.setData();
        },
        radioFrequenzaClick: function() {
            prescrizione.frequenza.setFrequenzaOraria();
        },
        campoFrequenzaBlur: function() {
            if (!checkDato.isPositive())
                return;
            prescrizione.frequenza.setFrequenzaOraria();
        },
        setFrequenzaOraria: function() {

            var vFrequenza = getElementsByAttributes({name: 'Frequenza'}, document.body, 'input')[0].value;
            var factor = utility.getRadioValue({name: 'TipoFrequenza'});

            if (vFrequenza == '' || factor == '')
                return;
            $('input[name="FrequenzaOraria"]').attr("value", vFrequenza * factor);
        }

    },
    oraria: {
        setEvents: function() {

            var objPrescrizione = $('div[cls="Prescrizione"][tipo="1"]');

            objPrescrizione.find('input[name^="Giorno"]').click(prescrizione.oraria.checkboxGiorniClick);
            objPrescrizione.find('input[name="GiorniTutti"]').click(prescrizione.oraria.checkboxGiorniTuttiClick);

            objPrescrizione.find('select[name="ProfiliOrari"]').change(prescrizione.oraria.setProfiloOrario);

            objPrescrizione.find('input[name="CambiaDosi"]').click(prescrizione.oraria.timeline.build_cambia_dosi);

            objPrescrizione.find('input[name="OraInizio"]').blur(prescrizione.oraria.timeline.init);

            //prescrizione.oraria.timeline.init();
        },
        setData: function() {
            var objPrescrizione = $('div[cls="Prescrizione"][tipo="1"]');
            prescrizione.oraria.timeline.value2dettagli();
            prescrizione.oraria.allineaGiorniSelezionati(objPrescrizione[0]);
            validita.setData();
        },
        checkboxGiorniClick: function() {
            var objPrescrizione = prescrizione.getPrescrizione(event.srcElement);
            prescrizione.oraria.allineaGiorniSelezionati(objPrescrizione);
        },
        checkboxGiorniTuttiClick: function() {
            var objPrescrizione = prescrizione.getPrescrizione(event.srcElement);
            var lst = getElementsByAttributes({type: 'checkbox'}, objPrescrizione, 'input'); //,name:'Giorno.'
            for (var i = 0; i < lst.length; i++) {
                lst[i].checked = event.srcElement.checked;
            }
            prescrizione.oraria.allineaGiorniSelezionati(objPrescrizione);
        },
        allineaGiorniSelezionati: function(elm) {
            var lst = getElementsByAttributes({chkGiorno: true}, elm, 'div');

            var newValue = '';
            for (var i = 0; i < lst.length; i++) {
                if (lst[i].lastChild.firstChild.checked)
                    newValue += (i + 1) + ',';
            }

            getElementsByAttributes({name: 'GiorniSelezionati'}, elm, 'input')[0].value = newValue.substring(0, newValue.length - 1);
        },
        setProfiloOrario: function() {
            var cmb = event.srcElement;
            if (cmb.options[cmb.selectedIndex].value == '')
                return;

            var ar = cmb.options[cmb.selectedIndex].value.split(';');

            var myDate;
            var dataIni = clsDate.getData(timeline.properties.dateIni, 'YYYYMMDD');

            for (var i = 0; i < ar.length; i++) {
                myDate = clsDate.str2date(dataIni, 'YYYYMMDD', ar[i]);
                if (myDate < timeline.properties.dateIni) {
                    myDate = clsDate.dateAdd(myDate, 'D', 1);
                }
                timeline.addDettaglio(timeline.arTbody[0].obj, myDate);
            }
            cmb.selectedIndex = 0;
        },
        timeline: {
            init: function() {
                var obj = $('div[cls="Prescrizione"][tipo="1"]').find('#timeline')[0];
                var newData = $('input[name="DataInizio"]').val();
                var newOra = $('input[name="OraInizio"]').val();
                newOra = newOra.substr(3, 5) == '00' ? newOra : (Number(newOra.substr(0, 2)) + 1) + ':00';
                timeline.setup = {
                    zoom: 1,
                    data: clsDate.str2str(newData, 'DD/MM/YYYY', 'YYYYMMDD'),
                    ora: newOra,
                    numeroOre: 24,
                    minutiBlocco: 60,
                    tipoAlternaColore: '1',
                    minutiEditing: 60,
                    callBackRemoveDettaglio: prescrizione.oraria.timeline.build_cambia_dosi,
                    callBackAddDettaglio: prescrizione.oraria.timeline.build_cambia_dosi
                };
                timeline.build(obj);
            },
            set: function() {
                prescrizione.oraria.timeline.dettagli2value(true);
                prescrizione.oraria.timeline.init();
                prescrizione.oraria.timeline.value2dettagli();
            },
            dettagli2value: function(pRemove) {
                //prendo dall'interno della timeline e metto i dati nel value dello UserInput
                var value = "";
                var lst = getElementsByAttributes({id: 'dettaglio'}, $('div[cls="Prescrizione"][tipo="1"]').find('#timeline')[0], 'div');
                for (var i = 0; i < lst.length; i++) {
                    value += lst[i].getAttribute("data") + '@' + lst[i].getAttribute("ora") + '@' + lst[i].getAttribute("day") + '|';
                    if (pRemove) {
                        timeline.removeDettaglio(lst[i]);
                    }
                }
                getElementsByAttributes({cls: 'UserInput', tipo: 'timeline'}, $('div[cls="Prescrizione"][tipo="1"]')[0], 'div')[0].setAttribute("value", value.substring(0, value.length - 1));

                prescrizione.oraria.timeline.save_cambia_dosi();
            },
            value2dettagli: function() {
                //prendo dello UserInput e inserisco nella timeline
                var value = getElementsByAttributes({cls: 'UserInput', tipo: 'timeline'}, $('div[cls="Prescrizione"][tipo="1"]')[0], 'div')[0].getAttribute('value');

                if (value == '')
                    return;

                var arDettagli = value.split('|');
                var dettaglio = {data: '', ora: '', day: ''};
                var myDate;
                for (var i = 0; i < arDettagli.length; i++) {

                    dettaglio.data = clsDate.getData(timeline.properties.dateIni, 'YYYYMMDD');
                    dettaglio.ora = arDettagli[i].split('@')[1];


                    myDate = clsDate.str2date(dettaglio.data, 'YYYYMMDD', dettaglio.ora);
                    if (myDate < timeline.properties.dateIni) {
                        myDate = clsDate.dateAdd(myDate, 'D', 1);
                    }
                    if (myDate >= timeline.properties.dateFine) {
                        myDate = clsDate.dateAdd(myDate, 'D', -1);
                    }
                    if (myDate >= timeline.properties.dateIni && myDate < timeline.properties.dateFine) {
                        timeline.addDettaglio(timeline.arTbody[0].obj, myDate);
                    }
                }

                prescrizione.oraria.timeline.build_cambia_dosi();
            },
            build_cambia_dosi: function() {

                var objPrescrizione = $('div[cls="Prescrizione"][tipo="1"]');

                var cd = objPrescrizione.find('input[name=CambiaDosi]');
                if (cd.length == 0)
                    return;

                if (cd.attr("checked") && $('div[cls="Farmaco"]').length == 0) {
                    alert("Inserire almeno un farmaco");
                    cd.attr("checked", "");
                    return;
                }

                if (cd.is(':checked') && $('div[cls="Farmaco"]').length > 1) {
                    cd.attr("checked", "");
                    return alert("Funzionalità non disponibile per più di un farmaco");
                }

                var inputdosi = "<div> </div>";

                objPrescrizione.find('#DivCambiaDosi').html(inputdosi);

                if (cd.attr("checked") == true) {
                    /*svuoto e disabilito i campi dosaggio farmaco*/
                    farmaci.enableDosi(false, false);
                    farmaci.enableUdm(false, false);

                    /*
                     * Recupero dosi eventualmente gia' impostate e le metto in un array
                     */
                    var stringa_dosi = objPrescrizione.find("input[name=DosiOrarie]").val();
                    var array_dettagli = stringa_dosi.split("|");
                    var array_valori = new Array();
                    for (var i = 0; i < array_dettagli.length; i++) {
                        var array_name_value = array_dettagli[i].split("=");
                        array_valori[array_name_value[0]] = array_name_value[1];
                    }
                    objPrescrizione.find("[#dettaglio").each(function() {
                        var dettaglio = $(this);
                        var day = parseInt(dettaglio.attr("day"), 10);
                        var ora = dettaglio.attr("ora");
                        inputdosi = inputdosi + "<div label style='clear:left;'>" + ora + "</div>";
                        $("div[cls=Farmaco]").each(function() {
                            var descr = $("div[cls=DescrizioneFarmaco]", this).text();
                            var udm = $("select[name=UdmFarmaco] option:selected", this).text();
                            if (udm == "")
                                udm = "unita'";
                            var name = $(this).attr("iden") + "_" + ora.replace(":", "") + ":" + day;
                            var dose = array_valori[name];
                            if (dose == '' || dose == null || dose == 'undefined')
                                dose = $("input[name=DoseFarmaco]", this).val();
                            if (dose == 'undefined')
                                dose = '';
                            inputdosi = inputdosi + "<div xpath='/Terapia/' tipo='text' msg='Dose variabile h: " + ora + " ' cls='UserInput' obligatory='S' TextualNotNegative='S' w='2' style='clear:left;'><div label>" + descr + "</div><div><input class='DosiCambiate' TextualNotNegative='S' type='text' name='" + name + "' value='" + dose + "'/> " + udm + "</div></div>";

                            objPrescrizione.find('#DivCambiaDosi').html(inputdosi);
                        });
                    });
                } else {

                    timelines.svuota_cambia_dosi();
                }
                return inputdosi;
            },
            save_cambia_dosi: function() {
                var stringa_dosi = "";
                $("div[cls='Prescrizione'][tipo='1'] input.DosiCambiate").each(function() {
                    if (stringa_dosi.length > 0)
                        stringa_dosi = stringa_dosi + "|";
                    stringa_dosi = stringa_dosi + $(this).attr("name") + "=" + $(this).val();
                });
                $("div[cls='Prescrizione'][tipo='1'] input[name=DosiOrarie]").val(stringa_dosi);
            },
            removeDettagli: function() {

                var lst = getElementsByAttributes(
                        {id: 'dettaglio'},
                $('div[cls="Prescrizione"][tipo="1"]').find('#timeline')[0],
                        'div'
                        );

                for (var i = 0; i < lst.length; i++) {
                    timeline.removeDettaglio(lst[i]);
                }
            }

        }
    },
    coumadin: {
        setEvents: function() {
            var objPrescrizione = $('div[cls="Prescrizione"][tipo="6"]');
            //alert($('div[cls="Prescrizione"][tipo="6"]').find('div[name="timelineCoumadin"]').attr("value"))
            objPrescrizione.find('select[name="ProfiliOrari"]').change(prescrizione.coumadin.setProfiloOrario);

            objPrescrizione.find('input[name="CambiaDosi"]').click(prescrizione.coumadin.timeline.build_cambia_dosi);

            objPrescrizione.find('input[name="OraInizio"]').blur(prescrizione.coumadin.timeline.init);

            //prescrizione.coumadin.timeline.init();
        },
        setData: function() {

            prescrizione.coumadin.timeline.value2dettagli();
            validita.setData();
        },
        setProfiloOrario: function() {
            var cmb = event.srcElement;
            if (cmb.options[cmb.selectedIndex].value == '')
                return;

            var ar = cmb.options[cmb.selectedIndex].value.split('|');

            var myDate;

            for (var i = 0; i < ar.length; i++) {


                var obj = {
                    ora: ar[i].split('#')[0],
                    day: parseInt(ar[i].split('#')[1], 10)
                };
//				alert(ar[i] + '\n' + obj.ora + '\n' + obj.day + '\n' + timeline.properties.dateIni);
                myDate = clsDate.dateAdd(timeline.properties.dateIni, 'D', obj.day);
                myDate = clsDate.setData(clsDate.getData(myDate, 'YYYYMMDD'), obj.ora);
                if (myDate < timeline.properties.dateIni) {
                    myDate = clsDate.dateAdd(myDate, 'D', 1);
                }
                timeline.addDettaglio(timeline.arTbody[0].obj, myDate);
            }
            cmb.selectedIndex = 0;
        },
        timeline: {
            creata: false,
            init: function() {

                var obj = $('div[cls="Prescrizione"][tipo="6"]').find('#timeline')[0];
                var NumeroGiorni = $('input[name="NumeroGiorni"]').val();
                var newData = $('input[name="DataInizio"]').val();
                var newOra = $('input[name="OraInizio"]').val();

                oraNumber = Number(newOra.substr(0, 2));
                if (NumeroGiorni <= 2) {
                    oraNumber = newOra.substr(3, 5) == '00' ? oraNumber : oraNumber + 1;
                } else {
                    oraNumber = oraNumber % 2 == 0 ? oraNumber + (newOra.substr(3, 5) == '00' ? 0 : 2) : oraNumber + 1;
                }

                newOra = "00" + oraNumber;
                newOra = newOra.substr(newOra.length - 2, newOra.length) + ":00";

                timeline.arTbody = new Array();
                timeline.setup = {
                    zoom: 1,
                    data: clsDate.str2str(newData, 'DD/MM/YYYY', 'YYYYMMDD'),
                    ora: newOra,
                    numeroOre: (24 * NumeroGiorni),
                    minutiBlocco: (NumeroGiorni <= 2 ? 60 : 120),
                    tipoAlternaColore: '1',
                    minutiEditing: (NumeroGiorni <= 2 ? 60 : 120),
                    callBackRemoveDettaglio: prescrizione.coumadin.timeline.build_cambia_dosi,
                    callBackAddDettaglio: prescrizione.coumadin.timeline.build_cambia_dosi
                };
                timeline.build(obj);

                prescrizione.coumadin.timeline.creata = true;

            },
            set: function() {
                prescrizione.coumadin.timeline.dettagli2value(true);
                prescrizione.coumadin.timeline.init();
                prescrizione.coumadin.timeline.value2dettagli();
            },
            dettagli2value: function(pRemove) {
                //prendo dall'interno della timeline e metto i dati nel value dello UserInput
                if (!prescrizione.coumadin.timeline.creata)
                    return;
                var value = "";
                var lst = getElementsByAttributes({id: 'dettaglio'}, $('div[cls="Prescrizione"][tipo="6"]').find('#timeline')[0], 'div');
                if (lst.length == 0)
                    return;
                for (var i = 0; i < lst.length; i++) {
                    value += lst[i].getAttribute("data") + '@' + lst[i].getAttribute("ora") + '@' + lst[i].getAttribute("day") + '|';
                    if (pRemove)
                        timeline.removeDettaglio(lst[i]);
                }
                getElementsByAttributes({cls: 'UserInput', tipo: 'timeline'}, $('div[cls="Prescrizione"][tipo="6"]')[0], 'div')[0].setAttribute("value", value.substring(0, value.length - 1));

                prescrizione.coumadin.timeline.save_cambia_dosi();
            },
            value2dettagli: function() {

                //prendo dello UserInput e inserisco nella timeline
                var value = getElementsByAttributes({cls: 'UserInput', tipo: 'timeline'}, $('div[cls="Prescrizione"][tipo="6"]')[0], 'div')[0].getAttribute('value');

                if (value == '')
                    return;

                var arDettagli = value.split('|');
                var dettaglio = {data: '', ora: '', day: 0};
                var myDate;
                for (var i = 0; i < arDettagli.length; i++) {

                    dettaglio.ora = arDettagli[i].split('@')[1];
                    dettaglio.day = parseInt(arDettagli[i].split('@')[2], 10);
                    dettaglio.data = clsDate.getData(clsDate.dateAdd(timeline.properties.dateIni, 'D', dettaglio.day), 'YYYYMMDD');

                    myDate = clsDate.str2date(dettaglio.data, 'YYYYMMDD', dettaglio.ora);

                    timeline.addDettaglio(timeline.arTbody[0].obj, myDate);

                }

                prescrizione.coumadin.timeline.build_cambia_dosi();
            },
            build_cambia_dosi: function() {

                var objPrescrizione = $('div[cls="Prescrizione"][tipo="6"]');

                var cd = objPrescrizione.find('input[name=CambiaDosi]');
                if (cd.length == 0)
                    return;

                if (cd.attr("checked") && $('div[cls="Farmaco"]').length == 0) {
                    alert("Inserire almeno un farmaco");
                    cd.attr("checked", "");
                    return;
                }
                if (cd.is(':checked') && $('div[cls="Farmaco"]').length > 1) {
                    cd.attr("checked", "");
                    return alert("Funzionalità non disponibile per più di un farmaco");
                }

                var inputdosi = "<div> </div>";

                objPrescrizione.find('#DivCambiaDosi').html(inputdosi);

                if (cd.attr("checked") == true) {
                    /*svuoto e disabilito i campi dosaggio farmaco*/
                    farmaci.enableDosi(false, false);
                    farmaci.enableUdm(false, false);

                    /*
                     * Recupero dosi eventualmente gia' impostate e le metto in un array
                     */
                    var stringa_dosi = objPrescrizione.find("input[name=DosiOrarie]").val();

                    var array_dettagli = stringa_dosi.split("|");
                    var array_valori = new Array();
                    for (var i = 0; i < array_dettagli.length; i++) {
                        var array_name_value = array_dettagli[i].split("=");
                        array_valori[array_name_value[0]] = array_name_value[1];
                    }

                    var lstDettagli = objPrescrizione.find("[id=dettaglio]");
                    lstDettagli.sort(function(a, b) {
                        var _a = $(a);
                        var _b = $(b);

                        var DateA = clsDate.dateAdd(clsDate.setData('19700101', _a.attr("ora")), 'D', parseInt(_a.attr("day"), 10));
                        var DateB = clsDate.dateAdd(clsDate.setData('19700101', _b.attr("ora")), 'D', parseInt(_b.attr("day"), 10));

                        return DateA - DateB;
                    });
                    //objPrescrizione.find("[id=dettaglio]").each(function(){
                    lstDettagli.each(function() {
                        var dettaglio = $(this);
                        var day = parseInt(dettaglio.attr("day"), 10);

                        var ora = dettaglio.attr("ora");
                        inputdosi = inputdosi + "<div label style='clear:left;'>Giorno " + (day + 1) + ' ' + ora + "</div>";
                        $("div[cls=Farmaco]").each(function() {
                            var descr = $("div[cls=DescrizioneFarmaco]", this).text();
                            var udm = $("select[name=UdmFarmaco] option:selected", this).text();
                            if (udm == "")
                                udm = "unita'";
                            var name = $(this).attr("iden") + "_" + ora.replace(":", "") + ":" + day;
                            var dose = array_valori[name];
                            if (dose == '' || dose == null || dose == 'undefined')
                                dose = $("input[name=DoseFarmaco]", this).val();
                            if (dose == 'undefined')
                                dose = '';
                            inputdosi = inputdosi + "<div xpath='/Terapia/' tipo='text' msg='Dose variabile gg: " + (day + 1) + " h: " + ora + " ' cls='UserInput' obligatory='S' NotNegative='S' style='clear:left;'><div label>" + descr + "</div><div><input class='DosiCambiate' NotNegative='S' type='text' name='" + name + "' value='" + dose + "'/> " + udm + "</div></div>";
                            objPrescrizione.find('#DivCambiaDosi').html(inputdosi);
                        });
                    });
                } else {
                    timelines.svuota_cambia_dosi();
                }
                return inputdosi;
            },
            save_cambia_dosi: function() {
                var stringa_dosi = "";
                $("div[cls='Prescrizione'][tipo='6'] input.DosiCambiate").each(function() {
                    if (stringa_dosi.length > 0)
                        stringa_dosi = stringa_dosi + "|";
                    stringa_dosi = stringa_dosi + $(this).attr("name") + "=" + $(this).val();
                });
                $("div[cls='Prescrizione'][tipo='6'] input[name=DosiOrarie]").val(stringa_dosi);
            }

        }
    },
    tao: {
        creato: false,
        setEvents: function() {
            $('select[name="ProfiliOrari"]').change(prescrizione.tao.setProfilo);
            $('div[name="btnRemoveOra"]').live('click', prescrizione.tao.ora.remove);
            $('input[name="NuovoOrario"]').blur(prescrizione.tao.ora.add);
            $('input.Dose').live('blur', prescrizione.tao.TableToValue);
            $('div[name="btnRemoveOra"]').click(prescrizione.tao.visualizzaStorico);
        },
        setData: function() {
            prescrizione.tao.ValueToTable();
        },
        btnRefreshClick: function() {
            //alert('btnRefreshClick');
            switch ($('input[name="TipoPrescrizione"]:checked').val()) {
                case '7':
                    if (prescrizione.tao.creato == false && $('input[name="ValueTAO"]').val() != '')
                        return;
                    prescrizione.tao.giorno.setLimite(parseInt($('input[name="NumeroGiorni"]').val(), 10));
                    break;
                default:
                    break;
            }

        },
        lst: {
            giorni: {},
            ore: {}
        },
        valori: {}, //litterale 'bidimensionale'

        TableToValue: function() {
            //alert('TableToValue');
            var _result = $('input[name="ValueTAO"]');

            _result.val("");
            $('div[name="HtmlTAO"]').find('input').each(function(i) {
                var _this = $(this);
                //if(_this.val() == "")return;
                if (typeof prescrizione.tao.lst.giorni[_this.attr("giorno")] == 'undefined')
                    return;
                _result.val(_result.val() + _this.attr("giorno") + "@" + _this.attr("ora") + "@" + _this.val() + "|");
            });
            if (_result.val() != '') {
                _result.val(_result.val().substring(0, _result.val().length - 1));
            }

        },
        ValueToTable: function() {
//			alert('ValueToTable');
            prescrizione.tao.ore = {};
            prescrizione.tao.giorni = [];
            var _value = $('input[name="ValueTAO"]').val();
//			alert(_value);
            if (_value != "") {
                var ArInput = _value.split('|');

                var ArDati;
                for (var i = 0; i < ArInput.length; i++) {
                    ArDati = ArInput[i].split('@');
                    prescrizione.tao.setValue(ArDati[0], ArDati[1], ArDati[2]);
                }
            }

            prescrizione.tao.build();
            //$('input[name="ValueTAO"]').val("");
        },
        giorno: {
            set: function(pGiorno) {

                if (typeof prescrizione.tao.lst.giorni[pGiorno] != 'undefined')
                    return;
                prescrizione.tao.lst.giorni[pGiorno] = null;
                prescrizione.tao.valori[pGiorno] = {};

                for (var i in prescrizione.tao.lst.ore) {
                    prescrizione.tao.valori[pGiorno][i] = null;
                }

            },
            Delete: function(pGiorno) {
                delete prescrizione.tao.lst.giorni[pGiorno];
                delete prescrizione.tao.giorni[pGiorno];
            },
            setLimite: function(pLimite) {

                pLimite = (isNaN(pLimite) ? 0 : pLimite);

                var DataInizio = clsDate.str2date(
                        $('input[name="DataInizio"]').val(),
                        'DD/MM/YYYY',
                        '00:00'
                        );

                var DataFine = clsDate.str2date(
                        $('input[name="DataFine"]').val(),
                        'DD/MM/YYYY',
                        '00:00'
                        );
                //pLimite = parseInt($(this).val(),10);
                for (var i in prescrizione.tao.lst.giorni) {

                    var Giorno = clsDate.str2date(i, 'YYYYMMDD', '00:00');
                    //aggiunta la condizione <= per correggere il baco della prescrizione tao per un giorno
                    if (DataInizio > Giorno || DataFine <= Giorno) {
                        prescrizione.tao.giorno.Delete(i);
                    }

                }

                for (var i = 0; i < pLimite; i++) {
                    var vData = clsDate.getData(
                            clsDate.dateAdd(DataInizio, 'D', i),
                            'YYYYMMDD'
                            );

                    prescrizione.tao.giorno.set(vData);

                }

                prescrizione.tao.TableToValue();
                prescrizione.tao.ValueToTable();

            }

        },
        ora: {
            add: function() {
                var _ora = this.value;

                /*if(_ora=="")return;
                 
                 if(_ora.length==1)
                 _ora = '0' + _ora;
                 if(_ora.length == 2)
                 _ora += ":00";
                 if(_ora.length == 4)
                 _ora += "0";
                 
                 this.value = _ora;
                 */

                if (_ora == "" || _ora.match(/[0-9]{2}:[0-9]{2}/) == null) {
                    return;
                }

                prescrizione.tao.ora.set(_ora);
                prescrizione.tao.TableToValue();
                prescrizione.tao.ValueToTable();
                this.value = "";
            },
            remove: function() {
                var _ora = $(this).attr("ora");

                $('div[name="HtmlTAO"]').find('input[ora="' + _ora + '"]').remove();

                prescrizione.tao.ora.Delete(_ora);

                prescrizione.tao.TableToValue();
                prescrizione.tao.ValueToTable();
            },
            set: function(pOra) {
                if (typeof prescrizione.tao.lst.ore[pOra] != 'undefined')
                    return;
                prescrizione.tao.lst.ore[pOra] = null;

                for (var i in prescrizione.tao.valori) {
                    prescrizione.tao.valori[i][pOra] = null;
                }

            },
            Delete: function(pOra) {
                delete prescrizione.tao.lst.ore[pOra];

                for (var i in prescrizione.tao.valori) {
                    delete prescrizione.tao.valori[i][pOra];
                }
            }
        },
        setValue: function(pGiorno, pOra, pValue) {
            prescrizione.tao.giorno.set(pGiorno);
            prescrizione.tao.ora.set(pOra);
            prescrizione.tao.valori[pGiorno][pOra] = pValue;
        },
        setProfilo: function() {
            _NewValue = $(this).val();
            if (_NewValue == null || _NewValue == "")
                return
            $('input[name="NuovoOrario"]').val(_NewValue).blur();
            this.selectedIndex = -1;

        },
        build: function() {
            try {
                //alert('build');
                var DateIni = clsDate.str2date(
                        $('input[name="DataInizio"]').val(),
                        "DD/MM/YYYY",
                        $('input[name="OraInizio"]').val()
                        );
                //alert(DateIni);

                $('div[name="HtmlTAO"]').html(".");
                var ArGiorni = new Array();
                var ArOre = new Array();

                for (var i in prescrizione.tao.lst.giorni) {
                    ArGiorni.push(i);
                }
                ArGiorni.sort();
                //alert(ArGiorni);

                for (var i in prescrizione.tao.lst.ore) {
                    ArOre.push(i);
                }
                ArOre.sort();
                //alert(ArOre);
                var _table = null;
                if (ArGiorni.length == 0) {
                    _table = $("<div>Compilare il campo 'Numero giorni'</div>").css({"font-size": "10px", "color": "red"});
                } else {
                    _table = $('<table></table>');
                }

                for (var i = 0; i < ArGiorni.length; i++) {

                    if (i == 0) {

                        var _tr = $('<tr></tr>');
                        _tr.append('<th></th>');
                        for (var j = 0; j < ArOre.length; j++) {

                            _tr.append(
                                    $('<th></th>')
                                    .append(
                                            $('<div>' + ArOre[j] + '</div>')
                                            )
                                    .append(
                                            $('<div>X</div>')
                                            .attr({
                                                "cls": "Button",
                                                "name": "btnRemoveOra",
                                                "ora": ArOre[j]
                                            })
                                            )
                                    );
                        }
                        _table.append(_tr);
                    }

                    var _tr = $('<tr></tr>');

                    _tr.append('<th>Giorno ' + (i + 1) + " - " + MultiSubstring(ArGiorni[i], [[6, 8, '/'], [4, 6, '/'], [0, 4]]) + '</th>');

                    var ControlloOrari = true;

                    for (var j = 0; j < ArOre.length; j++) {
                        //alert('start; ' + '\n' +i + '\n' + j + '\n' + (typeof tao.valori[ArGiorni[i]][ArOre[j]]))
                        var NewData = clsDate.str2date(
                                ArGiorni[i],
                                "YYYYMMDD",
                                ArOre[j]
                                );
                        //alert(NewData)

                        _tr.append(
                                $('<td></td>').append(
                                $('<div></div>')
                                .attr({"cls": "UserInput", "TextualNotNegative": "S"})
                                .append(
                                        $('<input />')
                                        .attr({
                                            "giorno": ArGiorni[i],
                                            "ora": ArOre[j],
                                            "critical": (DateIni > NewData ? 'S' : 'N'),
                                            "disabled": (DateIni > NewData ? 'disabled' : '')
                                        })
                                        .val(
                                                prescrizione.tao.valori[ArGiorni[i]][ArOre[j]] == null
                                                /*|| DateIni > NewData*/
                                                ? ""
                                                : prescrizione.tao.valori[ArGiorni[i]][ArOre[j]]
                                                )
                                        .addClass("Dose")
                                        )
                                )
                                );

                        if (DateIni > NewData)
                            ControlloOrari = false;
                    }


                    if (ControlloOrari == false) {
                        _tr.append(
                                $("<td>Orario precedente all'inizio di validità</td>")
                                .css({"font-size": "10px", "color": "red"})
                                );
                    }

                    _table.append(_tr);
                }

                $('div[name="HtmlTAO"]').html("").append(_table).parents('div[cls="Riga"]').height(_table.height());

                prescrizione.tao.TableToValue();

                prescrizione.tao.creato = true;

            } catch (e) {
                alert(e.description);
            }
        },
        
        visualizzaStorico:function(configurazione){
        	if (configurazione === undefined) {
        		alert("Impossibile visualizzare il grafico per la scheda corrente: nessuna configurazione definita.");
        		return;
        	}
        	var idenAnag = top.CartellaPaziente.getPaziente('IDEN');
        	var idenVisita = top.CartellaPaziente.getAccesso('IDEN');
        	var idenScheda = $("form[name=EXTERN] input[name=IDEN_SCHEDA]").val();
        	var ricovero = top.CartellaPaziente.getRicovero('NUM_NOSOLOGICO');
        	var reparto = $("form[name=EXTERN] input[name=REPARTO]").val();
        	
        	var form = $('<form/>', { "name":"dati", "id":"dati", "accept-charset":"UNKNOWN", "enctype":"application/x-www-form-urlencoded" })
        	.append(
        		$('<input/>', { "type":"hidden", "id":"idenAnag", "name":"idenAnag"}).val(idenAnag),
        		$('<input/>', { "type":"hidden", "id":"idenVisita", "name":"idenVisita"}).val(idenVisita),
        		$('<input/>', { "type":"hidden", "id":"idenScheda", "name":"idenScheda"}).val(idenScheda),
        		$('<input/>', { "type":"hidden", "id":"ricovero", "name":"ricovero"}).val(ricovero),
        		$('<input/>', { "type":"hidden", "id":"reparto", "name":"reparto"}).val(reparto),
        		$('<input/>', { "type":"hidden", "id":"key", "name":"key"}).val(configurazione)
        	);
        	$("form[name=dati]").remove();
            $('body').append(form);
            
        	window.open('modalUtility/grafici/chartContainer.html','','fullscreen=yes');
        }
    },
    singola: {
        setEvents: function() {
        },
        setData: function() {
            validita.setData();
        }
    },
    continua: {
        setEvents: function() {
        },
        setData: function() {
            validita.setData();
        }
    },
    albisogno: {
        init: function() {
            switch ($('select[name=ParametroRicovero] option:selected').attr('codice')) {
                case 'NAUSEA':
                case 'DIARREA':
                case 'DISTRESS':
                case 'TOSSE':
                case 'DELIRIUM':
                case 'P_DOLORE':
                case 'VOMITO':
                case 'CONVULSIVA':
                case 'AGITAZIONE':
                case 'ANSIA':
                case 'BRIVIDI':
                case 'STIMOLO':
                case 'EDEMA':
                case 'PRURITO':
                case 'INSONNIA':
                case 'SHOCK':
                case 'EPILETTICHE':
                    $('select[name="CriterioBisogno"] option[codice=PRESENT]').attr("disabled", false);
                    $('select[name="CriterioBisogno"] option[codice=GREATER]').attr("disabled", true);
                    $('select[name="CriterioBisogno"] option[codice=LOWER]').attr("disabled", true);
                    break;
                default:
                    $('select[name="CriterioBisogno"] option[codice=PRESENT]').attr("disabled", true);
                    $('select[name="CriterioBisogno"] option[codice=GREATER]').attr("disabled", false);
                    $('select[name="CriterioBisogno"] option[codice=LOWER]').attr("disabled", false);
            }
        },
        setEvents: function() {
            $('select[name=ParametroRicovero]').change(function() {
                switch ($('select[name=ParametroRicovero] option:selected').attr('codice')) {
                    case 'NAUSEA':
                    case 'DIARREA':
                    case 'DISTRESS':
                    case 'TOSSE':
                    case 'DELIRIUM':
                    case 'P_DOLORE':
                    case 'VOMITO':
                    case 'CONVULSIVA':
                    case 'AGITAZIONE':
                    case 'ANSIA':
                    case 'BRIVIDI':
                    case 'STIMOLO':
                    case 'EDEMA':
                    case 'PRURITO':
                    case 'INSONNIA':
                    case 'SHOCK':
                    case 'EPILETTICHE':
                        $('select[name="CriterioBisogno"] option[codice=PRESENT]').attr("disabled", false).attr("selected", true);
                        $('select[name="CriterioBisogno"] option[codice=GREATER]').attr("disabled", true);
                        $('select[name="CriterioBisogno"] option[codice=LOWER]').attr("disabled", true);
                        $('input[name="ValoreSoglia"]').val(1).parent().parent().hide();
                        break;
                    default:
                        $('select[name="CriterioBisogno"] option[codice=PRESENT]').attr("disabled", true);
                        $('select[name="CriterioBisogno"] option[codice=GREATER]').attr("disabled", false).attr("selected", true);
                        $('select[name="CriterioBisogno"] option[codice=LOWER]').attr("disabled", false);
                        $('input[name="ValoreSoglia"]').val('').parent().parent().show();
                }
            });
        },
        setData: function() {
            validita.setData();
        }
    },
    ciclica: {
        setEvents: function() {
            $('div[cls="Prescrizione"][tipo="5"] div[cls="Button"][name="btnAddGiorno"]').click(function() {
                prescrizione.ciclica.addGiorno();
            });
            $('div[cls="Prescrizione"][tipo="5"] div[cls="Button"][name="btnRemoveGiorno"]').live("click", function() {
                prescrizione.ciclica.removeGiorno(this);
            });
            $('div[cls="Prescrizione"][tipo="5"] input[name="GiornoSomministrazione"]').live("blur", prescrizione.ciclica.giorni2value);
            $('div[cls="Prescrizione"][tipo="5"] input[name="OraSomministrazione"]').live("blur", prescrizione.ciclica.giorni2value);
        },
        setData: function() {
            prescrizione.ciclica.loadGiorni();
        },
        addGiorno: function(pGiorno, pOra, pOffset, pCodSal) {
            var ora = $('<div cls="UserInput" msg="" name="OraSomministrazione" Orario="S"></div>')
                    .append($('<div label>Ora</div>'))
                    .append($('<div><input value="' + (typeof pOra == 'undefined' ? '08:00' : pOra) + '" name="OraSomministrazione" /></div>'));

            var giorno = $('<div cls="UserInput" msg="" name="GiornoSomministrazione" NotNegative="S"></div>')
                    .append($('<div label>Giorno</div>'))
                    .append($('<div><input value="' + (typeof pGiorno == 'undefined' ? '1' : pGiorno) + '" name="GiornoSomministrazione" data-offset="' + (typeof pOffset == 'undefined' ? '' : pOffset) + '" data-cod_sal="' + (typeof pCodSal == 'undefined' ? '' : pCodSal) + '"/></div>'));

            var gruppo = $('<div cls="GiornoCiclo"></div>')
                    .append($('<div cls="Button" name="btnRemoveGiorno"><div>X</div></div>'))
                    .append(giorno)
                    .append(ora);

            $('div#DivGiorniCiclo').append(gruppo);
            prescrizione.ciclica.giorni2value();
        },
        removeGiorno: function(pObj) {
            $(pObj).parent().remove();
            prescrizione.ciclica.giorni2value();
        },
        value2giorni: function() {
            var value = $('div[cls="Prescrizione"][tipo="5"] input[name="hGiorniCiclo"]').val();
            if (value == '')
                return;
            var arValue = value.split(',');
            for (var i = 0; i < arValue.length; i++) {
                var settings = arValue[i].split('|');
                //alert('value2giorni : ' + settings)
                prescrizione.ciclica.addGiorno(
                        settings[0],
                        settings[1],
                        (settings.length > 2 ? settings[2] : ''),
                        (settings.length > 3 ? settings[3] : '')
                        );
            }
        },
        giorni2value: function() {
            var arValue = new Array();
            $('div[cls="GiornoCiclo"]').each(
                    function() {
                        var _giorno = $(this).find('div[name="GiornoSomministrazione"] input').val();
                        var _ora = $(this).find('div[name="OraSomministrazione"] input').val();
                        var _offset = $(this).find('div[name="GiornoSomministrazione"] input').attr("data-offset");
                        var _cod_sal = $(this).find('div[name="GiornoSomministrazione"] input').attr("data-cod_sal");
                        arValue.push(
                                _giorno + '|' +
                                _ora + '|' +
                                (typeof _offset == 'undefined' ? '' : _offset) + '|' +
                                (typeof _cod_sal == 'undefined' ? '' : _cod_sal)
                                );
                    }
            );
            //alert(arValue)
            $('div[cls="Prescrizione"][tipo="5"] input[name="hGiorniCiclo"]').val(arValue);
        },
        loadGiorni: function() {
            prescrizione.ciclica.value2giorni();
        },
        reloadGiorni: function() {
            prescrizione.ciclica.giorni2value();
            $('div[cls="Prescrizione"][tipo="5"] div[cls="GiornoCiclo"]').remove();
            prescrizione.ciclica.value2giorni();
        }
    },
    getPrescrizione: function(obj) {
        while (obj.getAttribute("cls") != 'Prescrizione') {
            obj = obj.parentNode;
        }
        return obj;
    }

};


var ossigenoterapia = {
    setEvents: function() {

        var lst = getElementsByAttributes({name: 'TipoOssigenoterapia'}, document.body, 'input');

        for (var i = 0; i < lst.length; i++) {
            lst[i].attachEvent("onclick", function() {
                ossigenoterapia.radioClick('TipoOssigenoterapia');
            });
        }

        lst = getElementsByAttributes({name: 'TipoVentilatoreMeccanico'}, document.body, 'input');

        for (var i = 0; i < lst.length; i++) {
            lst[i].attachEvent("onclick", function() {
                ossigenoterapia.radioClick('TipoVentilatoreMeccanico');
            });
        }

    },
    radioClick: function(pName) {
        var lst = getElementsByAttributes({name: pName}, event.srcElement.parentNode, 'input');

        for (var i = 0; i < lst.length; i++) {
            lst[i].removeAttribute("selected");
        }

        event.srcElement.setAttribute("selected");

        utility.setDipendentiShow(event.srcElement.parentNode.parentNode.parentNode.parentNode);
        utility.setDipendentiMantieniValore(event.srcElement.parentNode.parentNode.parentNode.parentNode);
        utility.setDipendentiObbligatori(event.srcElement.parentNode.parentNode.parentNode.parentNode);

    }

};

var validita = {
    setEvents: function() {
    	validita.setDataOraFine();
        $('input[name="NumeroGiorni"]').blur(validita.setDataOraFine);      
        $('input[name="OraInizio"]').blur(validita.setDataOraFine);
        $('input[name="DurataTerapia"]').blur(validita.setDataOraFine);
        $('input[name="TipoDurata"]').click(validita.setDataOraFine);
        $('input[name="chkNoDataFine"]').click(validita.setNumeroGiorni);
//		$('input[name="chkPerNumSomministr"]').click(function(){validita.setNumeroSomministrazioni(true)});
    
    },
    setData: function() {
        validita.setDataOraFine();

    },
    setDataOraFine: function() {
        var data = $('input[name="DataInizio"]').attr("value");
        var ora = $('input[name="OraInizio"]').attr("value");
        var numeroGiorni = $('input[name="NumeroGiorni"]').attr("value");
        var durataTerapia = $('input[name="DurataTerapia"]').attr("value");
        
        
        if (typeof durataTerapia != 'undefined' && durataTerapia != '') {
            var date = clsDate.dateAdd(clsDate.str2date(data, 'DD/MM/YYYY', ora), 'h', parseInt(durataTerapia, 10) * utility.getRadioValue({name: 'TipoDurata'}));
            $('input[name="DataFine"]').attr("value", clsDate.getData(date, 'DD/MM/YYYY'));
            $('input[name="OraFine"]').attr("value", clsDate.getOra(date));

        }
        else {
            if (numeroGiorni == '' || numeroGiorni == '-1')
                return;



            var date = clsDate.dateAdd(clsDate.str2date(data, 'DD/MM/YYYY', ora), 'D', parseInt(numeroGiorni, 10));
            $('input[name="DataFine"]').attr("value", clsDate.getData(date, 'DD/MM/YYYY'));
            $('input[name="OraFine"]').attr("value", clsDate.getOra(date));

        }


    },
    setNumeroGiorni: function() {
        var numeroGiorni = $('input[name="NumeroGiorni"]');
        if ($('input[name="chkNoDataFine"]').is(":checked")) {
            numeroGiorni.val(-1).parent().parent().css({visibility: "hidden"});
            $('input[name="DataFine"]').val('');
            $('input[name="OraFine"]').val('');
        } else {
            numeroGiorni.parent().parent().css({visibility: "visible"});
            if (numeroGiorni.val() == -1) {
                numeroGiorni.val('');
            }
        }
    },
    setNumeroSomministrazioni: function(click) {

        if ($('input[name="chkPerNumSomministr"]').length > 0 && $('input[name="chkPerNumSomministr"]').is(":checked"))
        {
            $('input[name="chkNoDataFine"]').attr("checked", false).parent().parent().css({visibility: "hidden"});
            $('input[name="NumSomministr"]').parent().parent().css({visibility: "visible"}).attr("obligatory", "S");
            $('input[name="NumeroGiorni"]').val(-1).parent().parent().css({visibility: "hidden"});
            $('input[name="DataFine"]').val('');
            $('input[name="OraFine"]').val('');
        }
        else if (click == true)
        {
            $('input[name="chkNoDataFine"]').parent().parent().css({visibility: "visible"});
            $('input[name="NumeroGiorni"]').val('').parent().parent().css({visibility: "visible"});
            $('input[name="NumSomministr"]').val('').parent().parent().css({visibility: "hidden"}).attr("obligatory", "N");
            ;
        }
    }
};

var timelines = {
    btnRefreshClick: function() {
        switch ($('input[name="TipoPrescrizione"]:checked').val()) {
            case '1':
                prescrizione.oraria.timeline.set();
                break;
            case '6':
                prescrizione.coumadin.timeline.set();
                break;
            default:
                break;
        }

    },
    DataOraTrigger: function() {
        var vTipoPrescrizione = $('input[name="TipoPrescrizione"]:checked').val();
        if ($('div[cls="Prescrizione"][tipo="' + vTipoPrescrizione + '"]').find('#timeline').length > 0) {

            switch (vTipoPrescrizione) {
                case '1':
                    prescrizione.oraria.timeline.set();
                    break;
                case '6':
                    prescrizione.coumadin.timeline.set();
                    break;
                default:
                    break;
            }

        }
    },
    svuota_cambia_dosi: function() {

        var vTipoPrescrizione = $('input[name="TipoPrescrizione"]:checked').val();
        switch (vTipoPrescrizione) {
            case '1':
            case '6':
                var chkCambiaDosi = $('div[cls="Prescrizione"][tipo="' + vTipoPrescrizione + '"]').find("input[name='CambiaDosi']");

                if (chkCambiaDosi == null) {
                    return;
                }

                chkCambiaDosi.attr('checked', false);
                farmaci.enableDosi(true, true);
                farmaci.enableUdm(true, true);
                break;
            default:
                break;
        }
    }

};

function checkParameter(pParameter, pDefaultValue) {
    return typeof pParameter == 'undefined' ? pDefaultValue : pParameter;
}

function checkValidParameter(pParameter) {
    return typeof pParameter != 'undefined';
}