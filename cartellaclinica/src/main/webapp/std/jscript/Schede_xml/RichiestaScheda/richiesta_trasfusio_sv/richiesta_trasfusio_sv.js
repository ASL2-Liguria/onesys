/**
 * User: matteopi
 * Date: 20/05/13
 * Time: 17.47
 */
var urgenzaGenerale = '';

var WindowCartella = null;
jQuery(document).ready(function () {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    NS_TRASFUSIONALE.init();
    NS_TRASFUSIONALE.event();
});

var NS_TRASFUSIONALE = {
    init : function () {
        WindowCartella.utilMostraBoxAttesa(false);

        //costruzione della parte relativa al motivo richiesta

        NS_TRASFUSIONALE.buildRadioOrizontale();

        valorizzaMed();
         // parte css gestita da js
        $('#lblPrestRich_L').parent().css({'width': '120px'});
        $('#txtEmazie, #txtPlasmaNr, #txtConcPiaNr, #txtPredepositoNr').parent().css({'width': '40px'});
        $("#txtEmazie, #txtPlasmaNr, #txtConcPiaNr, #txtPredepositoNr").css({"width": "40px"});
        $('#lblEmazie_, #lblPlasmaNr, #lblConcPiaNr, #lblPredepositoNr').parent().css({"width": "60px"});
        NS_TRASFUSIONALE.setWidthFirstColumn($('#lblEmazie').closest('tbody'));
        NS_TRASFUSIONALE.setWidthFirstColumn($('#lblTrasfPregress').closest('tbody'));

        //valorizzazione campo
        $('#Hiden_pro').val(document.EXTERN.Hiden_pro.value);
        document.dati.Hiden_op_rich.value = baseUser.IDEN_PER;

        //$('#hUrgenza').val(document.EXTERN.URGENZA.value);

        NS_TRASFUSIONALE.hideandShow();
        NS_TRASFUSIONALE.addCaledar('#dataRicovero');
        NS_TRASFUSIONALE.firstload();
//        NS_TRASFUSIONALE.valorizzaCmbEsamiInit();
        NS_TRASFUSIONALE.controlloOra('txtOraProposta');
        NS_TRASFUSIONALE.controlloOra('txtOraTrasfusione');
        
        if (_STATO_PAGINA == 'E' || _STATO_PAGINA == 'L') {
            NS_TRASFUSIONALE.setUrgenzaScheda(document.EXTERN.URGENZA.value);
        }
    },
    event : function () {
        $('[name="RadioMotivoRich"]').change(NS_TRASFUSIONALE.hideandShow);
        $('#chkEmazie').click(function () {
            NS_TRASFUSIONALE.checkRadio($('#chkEmazie'), "RadioEmazie");
        });
        $('#chkPredeposito').click(function () {
            NS_TRASFUSIONALE.checkRadio($('#chkPredeposito'), "RadioPredeposito");
        });
        $('[name="RadioMotivoRich"]').click(function(){
            NS_TRASFUSIONALE.gestioneRadio($(this).parent().find('label').first().text());
        });
        $('[name="RadioMotivoRich"]').next().next().click(function(){
            NS_TRASFUSIONALE.hideandShow();
            NS_TRASFUSIONALE.gestioneRadio($(this).text());
        });
    },
    radioIntervento:function(radio){
        var div = $('<div></div>').css({'display':'block'});
        var divdata = $('<div></div>').css({'display':'inline-block'});
        div.append($('#txtIntervento').css({'display':'block'}));
        divdata.append($('[name="lblDataRicovero"]').css({'display':'inline-block','float':'left'}));
        divdata.append($('#txtDataRicovero').css({'display':'inline-block'}));

        $('[name="RadioRicovero"]').each(function(i){
            divdata.append($(this).parent().children());
        });
        div.append(divdata);
        radio.append(div)
        return radio;
    },
    radioAltro:function(radio){
        var html = '<div>'+$('#txtAltro').closest('td').html()+'</div>';
        $('#txtAltro').closest('td').remove();
        return radio.append(html);
    },
    radioAnemia:function(radio){
        var html = '<div>'+$('#txtAnemia').closest('td').html()+'</div>';
        $('#txtAnemia').closest('td').remove();
        return  radio.append(html);
    },

    hideandShow:function () {
        $.each($('input:radio[name=RadioMotivoRich]'), function (i) {
            var txt = $(this).parent().find('label').first().text();
            var selector = '#txt' + txt;
            if($(this).is(':checked')) {
                $(selector).closest('div').show();
            } else {
                $(selector).closest('div').hide();
            }
        });

        if(_STATO_PAGINA == 'E') {
            $('#lblMotAnn_L').show();
            $('#txtMotivoAnnullamento_L').show();
            $("#txtMotivoAnnullamento_L").attr("readonly", true);
        } else {
            $('#lblMotAnn_L').hide();
            $('#txtMotivoAnnullamento_L').hide();            
        }
    },
    addCaledar:function (id) {
        jQuery(id).datepick({onClose: function(){jQuery(this).focus();},
            showOnFocus : false,
            showTrigger : '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger">'});
    },
    setWidthFirstColumn : function (tr) {
        $.each(tr.find('tr'), function () {
            $(this).find('td:first-child').css({'width': '250'});
        })
    },
    buildRadioOrizontale:function () {
        //costruire un radio orizzontale
        var table = $('#groupMotivoRich table');
        var table_new = $('<table></table>').css({'width':'100%'});
        var radio1 = table.find('td:eq(1)');
        var radio2 = table.find('td:eq(2)');
        var radio3 = table.find('td:eq(3)');
        var tr = $('<tr></tr>').css({'width':'100%'});
        $('td',tr).each(function(){
            $(this).hide();
        });
        var tr1 = tr.clone();
        var tr2 = tr.clone();
        var tr3 = tr.clone();
        tr1.append(NS_TRASFUSIONALE.radioIntervento(radio1));
        tr2.append(NS_TRASFUSIONALE.radioAnemia(radio2));
        tr3.append(NS_TRASFUSIONALE.radioAltro(radio3));
        table_new.append(tr1);
        table_new.append(tr2);
        table_new.append(tr3);

        $('#groupMotivoRich table').remove();
        $('#groupMotivoRich').find('FIELDSET').append(table_new);
        jQuery('#txtDataRicovero').datepick({onClose: function(){jQuery(this).focus();},
            showOnFocus : false,
            showTrigger : '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger test">'});
    },
    checkRadio          : function (check, NameRadio) {
        if(!check.is(':checked')) {
            $('[name="' + NameRadio + '"]')
                .attr('disabled', true)
                .attr("checked", false);
        } else {
            $('[name="' + NameRadio + '"]').removeAttr('disabled');
        }
    },
    valorizzaCmbEsami:function () {

        var cdc = document.EXTERN.HrepartoRicovero.value; 
        var urg	= $('#hUrgenza').val();

        // IDEN - DESCR - DESCSIRM - COD_DEC - COD_ESA - COD_MIN - METODICA - URGENZA - MDC - IDEN_SCHEDA - IDEN_TAPPO - DESCR_TAPPO - CLASSE_TAPPO - ORDINE_ESAME
        var rsEsami = WindowCartella.executeQuery("OE_Richiesta.xml", "getEsamiRichiedibili", ['LABO',cdc,'R',urg,'T']);
        while (rsEsami.next()) {
            add_elem('cmbPrestRich_L', rsEsami.getString('COL01')+'@'+rsEsami.getString('COL07')+'@'+rsEsami.getString('COL09'), rsEsami.getString('COL03'));
        }
    },
    controllaOraProposta:function(lblOra){

        var oggetto = document.all[lblOra];

        if (oggetto.value != ''){

            if (oggetto.value.toString().length != 5) {
                oggetto.value = '';
                oggetto.focus();
                return alert (' Formato ora errato \n\n Inserire l\'ora nel formato HH:MM');
            }
        }
    },
    valorizzaCmbEsamiInit:function(){
        if(_STATO_PAGINA == 'E' || _STATO_PAGINA == 'L'){
            NS_TRASFUSIONALE.valorizzaCmbEsami();
        }
    },
    controlloOra:function(id){
        var selector = '#'+id;
        $(selector).keyup(function() {
            oraControl_onkeyup(document.getElementById(id));
        });
        $(selector).blur(function() {
            oraControl_onblur(document.getElementById(id));
        });
    },
    firstload:function(){
        if(_STATO_PAGINA=='I'){
        $('[name="RadioRicovero"]').attr("checked", false);
        $('[name="RadioEmazie"], [name="RadioPredeposito"]').attr("checked", false).attr('disabled', true);
        }else{
            NS_TRASFUSIONALE.valorizzaCmbEsamiInit();
            $('#hUrgenza').val(document.EXTERN.URGENZA.value);
        }
        
        jQuery("#txtQuesito_L").parent().css({float:'left'}).append($('<div></div>').addClass('classDivEpi').attr("title","Recupera Epicrisi").click(function() {
            var rs = WindowCartella.executeQuery("diari.xml", "getEpicrisiRicovero", WindowCartella.getRicovero("NUM_NOSOLOGICO"));
            // Recupero valori epicrisi e carico in textarea
            while (rs.next()) {
                $("#txtQuesito_L").append(rs.getString("EPICRISI") + "<br/>");
            }
        }));        
    },
    gestioneRadio:function(txt){
        switch  (txt){
            case 'Intervento':
                $('#txtAltro, #txtAnemia').text('');
                $('[name="RadioRicovero"]').removeAttr('disabled');
                break;
            case 'Altro':
                $('#txtIntervento, #txtAnemia').text('');
                $('[name="RadioRicovero"]').attr('disabled', true).attr("checked", false);
                $('#txtDataRicovero').val('');
                break;
            case 'Anemia':
                $('#txtIntervento, #txtAltro').text('');
                $('[name="RadioRicovero"]').attr('disabled', true).attr("checked", false);
                $('#txtDataRicovero').val('');
                break;
            default:
                //non dovrebbe mai entrare
                $('#txtIntervento, #txtAltro, #txtAnemia').text('');
                $('#txtDataRicovero').val('');
                $('[name="RadioRicovero"]').attr('disabled', true).attr("checked", false);
                break;
        }

    },
            
    bindData: function() {
        $('#txtDataProposta').bind('focusout', function() {
            $('#txtDataTrasfusione').val($('#txtDataProposta').val());
        });
    },
            
    enableData: function() {
        $('#lblDataTrasfusione').parent().removeClass('classTdLabel');
        $('#lblDataTrasfusione').parent().addClass('classTdLabel_O');
        $('#lblDataTrasfusione').parent().removeAttr('STATO_CAMPO');
        $('#lblDataTrasfusione').parent().attr('STATO_CAMPO', 'O');

        $('#txtDataTrasfusione').parent().removeClass('classTdField');
        $('#txtDataTrasfusione').parent().addClass('classTdField_O_O');
        $('#txtDataTrasfusione').parent().removeAttr('STATO_CAMPO');
        $('#txtDataTrasfusione').parent().attr('STATO_CAMPO', 'O');   
        $('#txtDataTrasfusione').removeAttr('STATO_CAMPO');
        $('#txtDataTrasfusione').attr('STATO_CAMPO', 'O');  
        $('#txtDataTrasfusione').attr('STATO_CAMPO_LABEL', 'lblDataTrasfusione');
        $('#txtDataTrasfusione').removeAttr('disabled');
        $('#txtDataTrasfusione').next().show();

        NS_TRASFUSIONALE.unbindData();
    },
            
    disableData: function() {
        $('#lblDataTrasfusione').parent().removeClass('classTdLabel_O');
        $('#lblDataTrasfusione').parent().addClass('classTdLabel');
        $('#lblDataTrasfusione').parent().removeAttr('STATO_CAMPO');
        $('#lblDataTrasfusione').parent().attr('STATO_CAMPO', 'E');

        $('#txtDataTrasfusione').parent().removeClass('classTdField_O_O');
        $('#txtDataTrasfusione').parent().addClass('classTdField');
        $('#txtDataTrasfusione').parent().removeAttr('STATO_CAMPO');
        $('#txtDataTrasfusione').parent().attr('STATO_CAMPO', 'E');   
        $('#txtDataTrasfusione').removeAttr('STATO_CAMPO');
        $('#txtDataTrasfusione').attr('STATO_CAMPO', 'E');
        $('#txtDataTrasfusione').removeAttr('STATO_CAMPO_LABEL');
        $('#txtDataTrasfusione').next().hide();
        $('#txtDataTrasfusione').attr('disabled', 'disabled');

        $('#txtDataTrasfusione').val($('#txtDataProposta').val());
        NS_TRASFUSIONALE.bindData();
    },
            
    unbindData: function() {
        $('#txtDataProposta').unbind('focusout'); 
    },

    bindOra: function() {
        $('#txtOraProposta').bind('focusout', function() {
            $('#txtOraTrasfusione').val($('#txtOraProposta').val());
        });
    },
            
    enableOra: function() {
        $('#lblOraTrasfusione').parent().removeClass('classTdLabel');
        $('#lblOraTrasfusione').parent().addClass('classTdLabel_O_O');
        $('#lblOraTrasfusione').parent().removeAttr('STATO_CAMPO');
        $('#lblOraTrasfusione').parent().attr('STATO_CAMPO', 'O');

        $('#txtOraTrasfusione').parent().removeClass('classTdField');
        $('#txtOraTrasfusione').parent().addClass('classTdField_O_O');
        $('#txtOraTrasfusione').parent().removeAttr('STATO_CAMPO');
        $('#txtOraTrasfusione').parent().attr('STATO_CAMPO', 'O');   
        $('#txtOraTrasfusione').removeAttr('STATO_CAMPO');
        $('#txtOraTrasfusione').attr('STATO_CAMPO', 'O');  
        $('#txtOraTrasfusione').attr('STATO_CAMPO_LABEL', 'lblOraTrasfusione');
        $('#txtOraTrasfusione').removeAttr('disabled');
        $('#txtOraTrasfusione').next().show();

        NS_TRASFUSIONALE.unbindOra();
    },
            
    disableOra: function() {
        $('#lblOraTrasfusione').parent().removeClass('classTdLabel_O_O');
        $('#lblOraTrasfusione').parent().addClass('classTdLabel');
        $('#lblOraTrasfusione').parent().removeAttr('STATO_CAMPO');
        $('#lblOraTrasfusione').parent().attr('STATO_CAMPO', 'E');

        $('#txtOraTrasfusione').parent().removeClass('classTdField_O_O');
        $('#txtOraTrasfusione').parent().addClass('classTdField');
        $('#txtOraTrasfusione').parent().removeAttr('STATO_CAMPO');
        $('#txtOraTrasfusione').parent().attr('STATO_CAMPO', 'E');   
        $('#txtOraTrasfusione').removeAttr('STATO_CAMPO');
        $('#txtOraTrasfusione').attr('STATO_CAMPO', 'E');
        $('#txtOraTrasfusione').removeAttr('STATO_CAMPO_LABEL');
        $('#txtOraTrasfusione').next().hide();
        $('#txtOraTrasfusione').attr('disabled', 'disabled');

        $('#txtOraTrasfusione').val($('#txtOraProposta').val());
        NS_TRASFUSIONALE.bindOra();
    },
            
    unbindOra: function() {
        $('#txtOraProposta').unbind('focusout'); 
    },  
           
    enableDataOra: function() {
        NS_TRASFUSIONALE.enableData();
        NS_TRASFUSIONALE.enableOra();
    },
            
    disableDataOra: function() {
        NS_TRASFUSIONALE.disableData();
        NS_TRASFUSIONALE.disableOra();
    },            
            
    setUrgenzaScheda: function(urgenza) {
        switch (urgenza) {
            // A Disposizione
            case '0':
                urgenzaGenerale = '0';
                document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' A DISPOSIZIONE  ';
                document.all.lblTitleUrgenza_L.className = 'adisposizione';
                document.all.hUrgenza.value = '0';
                NS_TRASFUSIONALE.enableDataOra();
                break;
                // Non urgente
            case '1':
                urgenzaGenerale = '1';
                document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' NON URGENTE    ';
                document.all.lblTitleUrgenza_L.className = 'nonurgente';
                document.all.hUrgenza.value = '1';
                NS_TRASFUSIONALE.enableDataOra();
                break;
                // Urgente
            case '2':
                urgenzaGenerale = '2';
                document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' URGENTE    ';
                document.all.lblTitleUrgenza_L.className = 'urgente';
                document.all.hUrgenza.value = '2';
                NS_TRASFUSIONALE.disableDataOra();
                break;
                // Urgentissima
            case '3':
                urgenzaGenerale = '3';
                document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' URGENTISSIMA    ';
                document.all.lblTitleUrgenza_L.className = 'urgentissima';
                document.all.hUrgenza.value = '3';
                NS_TRASFUSIONALE.disableDataOra();
                break;
        }
    }        

};

function setUrgenza(){

    if (urgenzaGenerale == ''){
        urgenzaGenerale=document.getElementById('hUrgenza').value;
    }


    var urgenza = document.all.hUrgenza.value;

    //controllo se la pagina è in modalità di inserimento
    if (_STATO_PAGINA == 'I' || _STATO_PAGINA == 'E'){
        document.dati.HelencoEsami.value = '';
        svuotaListBox(document.dati.cmbPrestRich_L);

        NS_TRASFUSIONALE.valorizzaCmbEsami();
        NS_TRASFUSIONALE.setUrgenzaScheda(urgenza);
        return;

    }else{
        alert ('Impossibile modificare il grado di urgenza');
    }
}
//funzione che svuota completamente il listbox
function svuotaListBox(elemento){

    var object;
    var indice;

    if (typeof elemento == 'String'){
        object = document.getElementById(elemento);
    }else{
        object = elemento;
    }

    if (object){

        indice = parseInt(object.length);

        while (indice>-1){
            object.options.remove(indice);
            indice--;
        }
    }
}

function preSalvataggio(){

    var esami = '';
    var metodiche = '';
    var esaMetodica = '';
    var doc = document.dati;
    var materiali = '';

    //	Valorizza HelencoEsami, HelencoMetodiche, Hmateriali leggendo i valori della ListBox cmbPrestRich_L dopo averli splittati [@] e ciclati
    for(var i = 0; i < doc.cmbPrestRich_L.length; i++){

        esaMetodica = doc.cmbPrestRich_L[i].value.split('@');

        if(esami != ''){
            esami += '#';
            metodiche += '#';
            materiali += '#';
        }

        esami += esaMetodica[0];
        metodiche += esaMetodica[1];
        materiali += esaMetodica [2];
    }
    doc.HelencoEsami.value = '';
    doc.HelencoMetodiche.value ='';
    doc.Hmateriali.value ='';
    doc.HelencoEsami.value = esami;
    doc.HelencoMetodiche.value = metodiche;
    doc.Hmateriali.value = materiali;


    //	Se in Inserimento o modifica, valorizza il cdc_destinatario
    if (document.EXTERN.LETTURA.value == 'N'){
        doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
    }

    // controllo la lunghezza dell'ora e il formato
    NS_TRASFUSIONALE.controllaOraProposta('txtOraProposta');
    NS_TRASFUSIONALE.controllaOraProposta('txtOraTrasfusione');

    /*var debug = 'IDEN: ' + doc.Hiden.value;
    debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
    debug += '\nUTE_INS: ' + document.all.Hiden_op_rich.value;
    debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
    debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
    debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
    debug += '\nESAMI: ' + doc.HelencoEsami.value;
    debug += '\nURGENZA: ' + doc.hUrgenza.value;
    debug += '\nNOTE: ' + doc.txtNote_L.value;
    debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
    debug += '\nQUESITO: ' + doc.txtQuesito_L.value;
    debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;
    debug += '\nMETODICA: ' + doc.HelencoMetodiche.value;
    debug += '\nMATERIALI: ' + doc.Hmateriali.value;


    alert(debug);*/

    registra();


};
//Funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico
function valorizzaMed(){

    //alert (baseUser.TIPO);
    //alert (document.EXTERN.LETTURA.value);
    //if (document.EXTERN.LETTURA.value != 'S' || document.EXTERN.MODIFICA.value !='S')
    if (document.EXTERN.LETTURA.value != 'S') {

        if (baseUser.TIPO == 'M'){

            document.dati.Hiden_MedPrescr.value = baseUser.IDEN_PER;
            document.dati.txtMedPrescr.value = baseUser.DESCRIPTION;
            document.dati.Hiden_op_rich.value = baseUser.IDEN_PER;
            document.dati.txtOpeRich_L.value = baseUser.DESCRIPTION;
            jQuery('#txtMedPrescr').attr("readOnly",true);

        }else{

            document.dati.Hiden_op_rich.value = baseUser.IDEN_PER;
            document.dati.txtOpeRich_L.value = baseUser.DESCRIPTION;

        }
    }

    if (typeof document.EXTERN.Hiden_pro != 'undefined'){
        document.dati.Hiden_pro.value = document.EXTERN.Hiden_pro.value;
    }
}

