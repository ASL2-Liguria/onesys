var WindowCartella = null;

jQuery(document).ready(function() {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }

    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }

    $('#lblAlimentazione, #lblIgienePersonale, #lblAbbigliamento, #lblBagnoDoccia, #lblContinenzaUrinaria, #lblContinenzaIntestinale, #lblUsoGabinetto, #lblTrasferimenti, #lblDeambulazione, #lblScale, #lblUsoCarrozzina').addClass('labelClass').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div></div>').addClass('Link'));
    infoBarthel.init();

    if (document.EXTERN.BISOGNO.value == 'N') {
        document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
    }

    if (_STATO_PAGINA == 'L') {
    	document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
    }

    try {
        if (!WindowCartella.ModalitaCartella.isStampabile(document)) {
            document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
        }
    } catch (e) {
    }

    try {
        if (!WindowCartella.ModalitaCartella.isStampabile(document)) {
            document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
        }
    } catch (e) {
    }

    $('#groupBarthel .classDataEntryTable tbody tr td').css('width', '15%');
});

var count;
var click;
function countChecked() {
    count = 0;
    click = 'N';

    sommaBarthel10(document.all.chkAlimentazione);
    sommaBarthel5(document.all.chkIgienePersonale);
    sommaBarthel10(document.all.chkAbbigliamento);
    sommaBarthel5(document.all.chkBagnoDoccia);
    sommaBarthel10(document.all.chkContinenzaUrinaria);
    sommaBarthel10(document.all.chkContinenzaIntestinale);
    sommaBarthel10(document.all.chkUsoGabinetto);
    sommaBarthel15(document.all.chkTrasferimenti);
    sommaBarthel15(document.all.chkDeambulazione);
    sommaBarthel10(document.all.chkScale);
    if(!$("input[name=chkDeambulazione][value=0]").is(":checked")) {
    	$("input[name=chkUsoCarrozzina]:checked").attr("checked", false);
    	// Disabilito la scelta del checkbox
    	$("input[name=chkUsoCarrozzina]").attr("disabled", true).parent().addClass("disabled");
    } else {
    	// Abilito la scelta del checkbox
    	$("input[name=chkUsoCarrozzina]").attr("disabled", false).parent().removeClass("disabled");
    }
    sommaBarthel5(document.all.chkUsoCarrozzina);

    if (click == 'S' || count > 0) {
        document.all.txtScoreTotale.value = count;
        document.all.txtScoreTotale.disabled = true;
    }
}

function sommaBarthel15(radio) {
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            click = 'S';
            if (i == '0')
                count += 15;
            else if (i == '1')
                count += 12;
            else if (i == '2')
                count += 8;
            else if (i == '3')
                count += 3;
        }
    }
}

function sommaBarthel10(radio) {
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            click = 'S';
            if (i == '0')
                count += 10;
            else if (i == '1')
                count += 8;
            else if (i == '2')
                count += 5;
            else if (i == '3')
                count += 2;
        }
    } 
}

function sommaBarthel5(radio) {
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            click = 'S';
            if (i == '0')
                count += 5;
            else if (i == '1')
                count += 4;
            else if (i == '2')
                count += 3;
            else if (i == '3')
                count += 1;
        }
    }
}

function chiudiBarthel() {
    try {
    	try{
    		parent.parent.$.fancybox.close();
    	 } catch (e) {}
        var opener = window.dialogArguments;

        var query = "select to_char(data_ultima_modifica,'DD/MM/YYYY') DATA_ULTIMA_MODIFICA from radsql.cc_scale where key_legame='SCALA_BARTHEL' and iden_visita=" + document.EXTERN.IDEN_VISITA.value;
        query += "@DATA_ULTIMA_MODIFICA";
        query += "@1";
        dwr.engine.setAsync(false);
        CJsUpdate.select(query, gestDati);
        dwr.engine.setAsync(true);

    } catch (e) {}
}

function gestDati(dati) {
    var array_dati = null;
    try {
        var opener = window.dialogArguments;
        array_dati = dati.split('@');
        if (array_dati[0] != "$$$$$") {
            opener.document.getElementById('txtDataBarthel').value = array_dati[0];
            opener.document.getElementById('txtEsitoBarthel').value = document.getElementById('txtTotale').value;
        }
    } catch (e) {}
}

var infoBarthel = {
    init: function() {
        $('.Link').live('click', function() {
            infoBarthel.open($(this).parent().find('label').attr('id'));
        });
    },
    open: function(id) {
        popupBarthel.remove();

        var paramObj = {
            obj: null,
            title: null,
            width: 900,
            height: 600
        };

        paramObj.vObj = $('<table id=tableInfoBarthel></table>')
                ;
        switch (id) {
            case 'lblAlimentazione':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(10) DA SOLO'))
                        .append($('<td style="width: 20%;"></td>').text('(8) INDIPENDENTE'))
                        .append($('<td style="width: 20%;"></td>').text('(5) SUPERVISIONE'))
                        .append($('<td style="width: 20%;"></td>').text('(2) ASSISTITO'))
                        .append($('<td style="width: 20%;"></td>').text('(0) DIPENDENTE'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Capace di alimentarsi da solo quando i cibi sono preparati su di un vassoio o tavolo raggiungibili. Se usa un ausilio deve essere capace di utilizzarlo, tagliare la carne, e, se lo desidera, usare sale e pepe, spalmare il burro ecc.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Indipendente nell\'alimentarsi con cibi preparati su di un vassoio, ad eccezione di tagliare la carne, aprire il contenitore del latte, girare il coperchio di un vasetto etc. Non è necessaria la presenza di un\'altra persona.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Capace di alimentarsi da solo, con supervisione. Richiede assistenza nelle attività associate come versare latte nel the, usare sale e pepe, spalmare il burro, girare un piatto di portata o altro.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Capace di utilizzare una posata, in genere un cucchiaio, ma qualcuno deve assistere attivamente durante il pasto.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Dipendente per tutti gli aspetti. Deve essere imboccato.'))
                                );
                paramObj.title = "ALIMENTAZIONE";
                break;
            case 'lblIgienePersonale':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(5) DA SOLO'))
                        .append($('<td style="width: 20%;"></td>').text('(4) AIUTO MINIMO'))
                        .append($('<td style="width: 20%;"></td>').text('(3) AIUTO PER QUALCHE OPERAZIONE'))
                        .append($('<td style="width: 20%;"></td>').text('(1) AIUTO PER TUTTE LE OPERAZIONI'))
                        .append($('<td style="width: 20%;"></td>').text('(0) DIPENDENTE'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Capace di lavarsi mani e faccia, pettinarsi, lavarsi i denti e radersi. Un uomo deve essere capace di usare senza aiuto, qualsiasi tipo di rasoio, comprese tutte le manipolazioni necessarie. Una donna deve essere capace di truccarsi, se abituata. (Non sono da considerare le attività relative all\'acconciatura dei capelli).'))
                                .append($('<td style="vertical-align: top;"></td>').text('In grado di attendere all\'igiene personale, ma necessita di aiuto minimo prima e/o dopo le operazioni.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per una o più operazioni dell\'igiene personale.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per tutte le operazioni.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Incapace di attendere all\'igiene personale, dipendente sotto tutti gli aspetti.'))
                                );
                paramObj.title = "IGIENE PERSONALE (LAVARSI)";
                break;
            case 'lblAbbigliamento':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(10) DA SOLO'))
                        .append($('<td style="width: 20%;"></td>').text('(8) AIUTO MINIMO'))
                        .append($('<td style="width: 20%;"></td>').text('(5) AIUTO PER QUALSIASI INDUMENTO'))
                        .append($('<td style="width: 20%;"></td>').text('(2) DIPENDENTE E COLLABORA'))
                        .append($('<td style="width: 20%;"></td>').text('(0) DIPENDENTE E NON COLLABORA'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Capace di indossare, togliere e chiudere correttamente gli indumenti, allacciarsi le scarpe e toglierle, applicare oppure togliere un corsetto od una protesi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita solo di minimo aiuto per alcuni aspetti, come bottoni, cerniere, reggiseno, lacci di scarpe.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per mettere o togliere qualsiasi indumento.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Capace di collaborare in qualche modo, ma dipendente sotto tutti gli aspetti'))
                                .append($('<td style="vertical-align: top;"></td>').text('Dipendente sotto tutti gli aspetti e non collabora.'))
                                );
                paramObj.title = "ABBIGLIAMENTO (VESTIRSI)";
                break;
            case 'lblBagnoDoccia':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(5) AUTONOMO'))
                        .append($('<td style="width: 20%;"></td>').text('(4) SUPERVISIONE'))
                        .append($('<td style="width: 20%;"></td>').text('(3) AIUTO PER TRASF./LAVARSI/ASCIUGARSI'))
                        .append($('<td style="width: 20%;"></td>').text('(1) AIUTO PER TUTTE LE OPERAZIONI'))
                        .append($('<td style="width: 20%;"></td>').text('(0) DIPENDENTE'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Capace di fare il bagno in vasca, la doccia, o una spugnatura completa. Autonomo in tutte le operazioni, senza la presenza di un\'altra persona, quale che sia il metodo usato.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di supervisione per sicurezza (trasferimenti, T° dell\'acqua, ecc.).'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per il trasferimento nella doccia/bagno oppure nel lavarsi o asciugarsi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per tutte le operazioni.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Totale dipendenza nel lavarsi.'))
                                );
                paramObj.title = "BAGNO/DOCCIA";
                break;
            case 'lblContinenzaUrinaria':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(10) INDIPENDENTE'))
                        .append($('<td style="width: 20%;"></td>').text('(8) AIUTO MINIMO'))
                        .append($('<td style="width: 20%;"></td>').text('(5) AIUTO PARZIALE'))
                        .append($('<td style="width: 20%;"></td>').text('(2) INCONTINENTE'))
                        .append($('<td style="width: 20%;"></td>').text('(0) DIPENDENTE'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Controllo completo durante il giorno e la notte e/o indipendente con i dispositivi esterni o interni.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Generalmente asciutto durante il giorno e la notte, ha occasionalmente qualche perdita o necessita di minimo aiuto per l\'uso dei dispositivi esterni o interni.'))
                                .append($('<td style="vertical-align: top;"></td>').text('In genere asciutto durante il giorno ma non di notte, necessario aiuto parziale nell\'uso dei dispositivi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Incontinente ma in grado di cooperare all\'applicazione di un dispositivo esterno o interno.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Incontinente o catetere a dimora. Dipendente per l\'applicazione di dispositivi interni o esterni.'))
                                );
                paramObj.title = "CONTINENZA URINARIA";
                break;
            case 'lblContinenzaIntestinale':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(10) INDIPENDENTE'))
                        .append($('<td style="width: 20%;"></td>').text('(8) SUPERVISIONE'))
                        .append($('<td style="width: 20%;"></td>').text('(5) AIUTO MANOVRE/DISPOSITIVI'))
                        .append($('<td style="width: 20%;"></td>').text('(2) AIUTO POSIZIONE/MANOVRE'))
                        .append($('<td style="width: 20%;"></td>').text('(0) INCONTINENTE'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Controllo intestinale completo e nessuna perdita, capace di mettersi supposte o praticarsi un enteroclisma se necessario.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Può necessitare di supervisione per l\'uso di supposte o enteroclisma, occasionali perdite.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Capace di assumere una posizione appropriata, ma non può eseguire manovre facilitatorie, o pulirsi da solo senza assistenza, ed ha perdite frequenti. Necessita di aiuto nell\'uso di sispositivi come pannoloni ecc.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto nell\'assumere una posizione appropriata e necessita di manovre facilitatorie.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Incontinente.'))
                                );
                paramObj.title = "CONTINENZA INTESTINALE";
                break;
            case 'lblUsoGabinetto':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(10) DA SOLO'))
                        .append($('<td style="width: 20%;"></td>').text('(8) SUPERVISIONE'))
                        .append($('<td style="width: 20%;"></td>').text('(5) AIUTO TRASF./ECC'))
                        .append($('<td style="width: 20%;"></td>').text('(2) AIUTO PER TUTTO'))
                        .append($('<td style="width: 20%;"></td>').text('(0) DIPENDENTE'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Capace di trasferirsi sul e dal gabinetto, gestire i vestiti senza sporcarsi, usare la carta igenica senza aiuto. Se necessario, può usare la comoda o la padella, o il pappagallo, ma deve essere in grado di svuotarli e pulirli.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di supervisione per sicurezza con l\'uso del normale gabinetto. Usa i sostituti del gabinetto (comoda, padella, pappagallo) indipendentemente tranne che per svuotarli e pulirli.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per svestirsi/vestirsi, per i trasferimenti e per lavare le mani.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per tutti gli aspetti.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Completamente dipendente.'))
                                );
                paramObj.title = "USO DEL GABINETTO";
                break;
            case 'lblTrasferimenti':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(15) INDIPENDENTE'))
                        .append($('<td style="width: 20%;"></td>').text('(12) SUPERVISIONE'))
                        .append($('<td style="width: 20%;"></td>').text('(8) AIUTO MINIMO TRASF.'))
                        .append($('<td style="width: 20%;"></td>').text('(3) AIUTO E COLLABORA'))
                        .append($('<td style="width: 20%;"></td>').text('(0) AIUTO E NON COLLABORA'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Capace di avvicinarsi con sicurezza al letto, bloccare i freni, sollevare le pedane, trasferirsi con sicurezza sul letto, sdraiarsi, rimettersi seduto sul bordo, cambiare la posizione della carrozzina, trasferirvisi con sicurezza. E\' indipendente durante tutte le fasi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessaria la presenza di una persona per maggior fiducia o per supervisione a scopo di sicurezza.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessario minimo aiuto da parte di una persona per uno o più aspetti del trasferimento.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Collabora ma richiede massimo aiuto da parte di una persona durante tutti i movimenti del trasferimento.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Non collabora al trasferimento. Necessarie due persone per trasferire il Pz. con o senza un sollevatore.'))
                                );
                paramObj.title = "TRASFERIMENTI LETTO <-> CARROZZINA";
                break;
            case 'lblDeambulazione':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(15) DA SOLO'))
                        .append($('<td style="width: 20%;"></td>').text('(12) SUPERVISIONE'))
                        .append($('<td style="width: 20%;"></td>').text('(8) PERSONA PER USO AUSILI'))
                        .append($('<td style="width: 20%;"></td>').text('(3) PERSONA/E PER DEAMBULARE'))
                        .append($('<td style="width: 20%;"></td>').text('(0) NON DEAMBULA'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Capace di portare una protesi se necessario, bloccarla, sbloccarla, assumere la stazione eretta, sedersi e piazzare gli ausili a portata di mano. In grado di usare stampelle, bastoni, walker, e deambulare per almeno 50 mt senza aiuto o supervisione.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Indipendente nella deambulazione ma con autonomia <50 mt. Necessita di supervisione per maggior fiducia o sicurezza in situazioni pericolose.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di assistenza di 1 persona per raggiungere gli ausili e/o per la loro manipolazione.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Neccesita della presenza costante di uno o più assistenti durante la deambulazione.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Non in grado di deambulare.'))
                                );
                paramObj.title = "DEAMBULAZIONE";
                break;
            case 'lblScale':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(10) DA SOLO'))
                        .append($('<td style="width: 20%;"></td>').text('(8) SUPERVISIONE'))
                        .append($('<td style="width: 20%;"></td>').text('(5) AIUTO PER USO AUSILI'))
                        .append($('<td style="width: 20%;"></td>').text('(2) AIUTO PER SALIRE/SCENDERE'))
                        .append($('<td style="width: 20%;"></td>').text('(0) INCAPACE'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('In grado di salire e scendere una rampa di scale con sicurezza, senza aiuto o supervisione. In grado di usare i corrimano, bastone o stampelle se necessario, ed è in grado di portarli con sé durante la salita o discesa.'))
                                .append($('<td style="vertical-align: top;"></td>').text('In genere non richiede assistenza. Occasionalmente necessita di supervisone, per sicurezza (es. a causa di rigidità mattutina, dispnea, ecc.).'))
                                .append($('<td style="vertical-align: top;"></td>').text('Capace di salire/scendere le scale, ma non in grado di gestire gli ausili e necessita di supervisione ed assistenza.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per salire e scendere le scale (compreso eventuale uso di ausili).'))
                                .append($('<td style="vertical-align: top;"></td>').text('Incapace di salire e scendere le scale.'))
                                );
                paramObj.title = "SCALE";
                break;
            case 'lblUsoCarrozzina':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(5) DA SOLO'))
                        .append($('<td style="width: 20%;"></td>').text('(4) SUPERVISIONE'))
                        .append($('<td style="width: 20%;"></td>').text('(3) AIUTO PER AVVICINAMENTI'))
                        .append($('<td style="width: 20%;"></td>').text('(1) AIUTO PER TUTTE LE MANOVRE'))
                        .append($('<td style="width: 20%;"></td>').text('(0) DIPENDENTE'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Capace di compiere autonomamente tutti gli spostamenti (girare attorno agli angoli, rigirarsi, avvicinarsi al tavolo, letto, wc, ecc.). L\'autonomia deve essere >=50 mt.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Capace di spostarsi autonomamente, per periodi ragionevolmente lunghi, su terreni e superficie regolare. Può essere necessaria assistenza per fare curve strette.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessaria la presenza e l\'assistenza costante di una persona per avvicinare la carrozzina al tavolo, al letto, ecc.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Capace di spostarsi solo per brevi tratti e su superfici piane, necessaria assistenza per tutte le manovre.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Dipendente negli spostamenti con la carrozzina.'))
                                )
                        .append(
                        		$('<tr></tr>')
                        		.append($('<td colspan="5" style="vertical-align: top;border:0px"></td>').text('(*) Solo se il paziente non è in grado di deambulare.'))
                        		);
                paramObj.title = "USO DELLA CARROZZINA (*)";
                break;
        }

        popupBarthel.append({
            obj: paramObj.vObj,
            title: paramObj.title,
            width: paramObj.width,
            height: paramObj.height
        });
    },
    show: function() {
        $('#lblFunzione').addClass('Link');
    },
    hide: function() {
        $('#lblFunzione').removeClass('Link');
    }
};


var popupBarthel = {
    append: function(pParam) {
        popupBarthel.remove();

        pParam.header = (typeof pParam.header != 'undefined' ? pParam.header : null);
        pParam.footer = (typeof pParam.footer != 'undefined' ? pParam.footer : null);
        pParam.title = (typeof pParam.title != 'undefined' ? pParam.title : "");
        pParam.width = (typeof pParam.width != 'undefined' ? pParam.width : 500);
        pParam.height = (typeof pParam.height != 'undefined' ? pParam.height : 300);

        $('body').append(
                $('<div id="divPopUpInfoBarthel"></div>')
                .css("font-size", "12px")
                .append(pParam.header)
                .append(pParam.obj)
                .append(pParam.footer)
                .attr("title", pParam.title)
                );

        $('#divPopUpInfoBarthel').dialog({
            position: [event.clientX, event.clientY],
            width: pParam.width,
            height: pParam.height
        });

        popupBarthel.setRemoveEvents();

    },
    remove: function() {
        $('#divPopUpInfoBarthel').remove();
    },
    setRemoveEvents: function() {
        $("body").click(popupBarthel.remove);
    }
};