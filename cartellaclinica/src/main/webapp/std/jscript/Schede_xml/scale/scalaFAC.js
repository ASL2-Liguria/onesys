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

    if (document.EXTERN.BISOGNO.value == 'N') {
        document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
    }
    
    $('#lblScoreTotale').addClass('labelClass').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div></div>').addClass('Link'));
    infoFAC.init();    

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

    //$('#groupFAC .classDataEntryTable tbody tr td:first').css('width', '550px');
    //$('#groupFAC .classDataEntryTable tbody tr:last-child td:last-child').css('width', '550px');
});

function chiudiFAC() {
    try {
        var opener = window.dialogArguments;

        var query = "select to_char(data_ultima_modifica,'DD/MM/YYYY') DATA_ULTIMA_MODIFICA from radsql.cc_scale where key_legame='SCALA_FAC' and iden_visita=" + document.EXTERN.IDEN_VISITA.value;
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
            opener.document.getElementById('txtDataFAC').value = array_dati[0];
            opener.document.getElementById('txtEsitoFAC').value = document.getElementById('txtTotale').value;
        }
    } catch (e) {}
}

var infoFAC = {
    init: function() {
        $('.Link').live('click', function() {
            infoFAC.open($(this).parent().find('label').attr('id'));
        });
        
        NS_FUNCTIONS.moveLeftField({name: 'txtAusili', width: '100%', space: '&nbsp;&nbsp;&nbsp;'});
        
        var arrValue = [];
        $('select[name="chkAusili"] option').filter(function(){
        	return $.trim($(this).text()).match(/(specificare)/ig);
        }).each(function(){
        	arrValue.push($(this).val());
        });
        
        var callback = {
        	'function': function() {
        		if (this.id == 'txtAusili') NS_FUNCTIONS.setCampoStato('txtAusili','lblAusili', this.enable ? 'O' : 'E');
        	},
        	'arguments': null,
        	'scope': null
        };
        
        NS_FUNCTIONS.enableDisable($('select[name="chkAusili"]'), arrValue, ['txtAusili'], false, callback);
        $('select[name="chkAusili"]').change(function() {
        	NS_FUNCTIONS.enableDisable($('select[name="chkAusili"]'), arrValue, ['txtAusili'], true, callback);	
        });
    },
    open: function(id) {
        popupFAC.remove();

        var paramObj = {
            obj: null,
            title: null,
            width: 900,
            height: 300
        };

        paramObj.vObj = $('<table id=tableInfoFAC></table>')
                ;
        switch (id) {             
            case 'lblScoreTotale':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 33%;"></td>').text('Score'))
                        .append($('<td style="width: 33%;"></td>').text('Category'))
                        .append($('<td style="width: 33%;"></td>').text('Interpretation'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('0'))
                                .append($('<td style="vertical-align: top;"></td>').text('Nonfunctional ambulator'))
                                .append($('<td style="vertical-align: top;"></td>').text(' '))
                                )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('1'))
                                .append($('<td style="vertical-align: top;"></td>').text('Ambulator, dependent on physical assistance - level I'))
                                .append($('<td style="vertical-align: top;"></td>').text('Indicates a patient who requires continuous manual contac to support body weight as well as to maintain balance or to assist coordination.'))
                                )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('2'))
                                .append($('<td style="vertical-align: top;"></td>').text('Ambulator, dependent on physical assistance - level II'))
                                .append($('<td style="vertical-align: top;"></td>').text('Indicates a patient who requires intrmittent or continuous light touch to assist balance or coordination.'))
                                )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('3'))
                                .append($('<td style="vertical-align: top;"></td>').text('Ambulator, indipendent on supervision'))
                                .append($('<td style="vertical-align: top;"></td>').text('Indicates a patient who can ambulate on level surface without manual contact of another person but requires standby guarding of one person either for safety or verbal cueing.'))
                                )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('4'))
                                .append($('<td style="vertical-align: top;"></td>').text('Ambulator, indipendent level surface only'))
                                .append($('<td style="vertical-align: top;"></td>').text('Indicates a patient who can ambulate indipendently on level surface but requires supervision to negotiate (e.g. stairs, inclines, nonlevel surface).'))
                                )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('5'))
                                .append($('<td style="vertical-align: top;"></td>').text('Ambulator indipendent'))
                                .append($('<td style="vertical-align: top;"></td>').text('Indicates a patient who can walk everywhere indipendently, including stairs.'))
                                );
                paramObj.title = "Interpretation.";
                break;         
        }

        popupFAC.append({
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

var popupFAC = {
    append: function(pParam) {
        popupFAC.remove();

        pParam.header = (typeof pParam.header != 'undefined' ? pParam.header : null);
        pParam.footer = (typeof pParam.footer != 'undefined' ? pParam.footer : null);
        pParam.title = (typeof pParam.title != 'undefined' ? pParam.title : "");
        pParam.width = (typeof pParam.width != 'undefined' ? pParam.width : 500);
        pParam.height = (typeof pParam.height != 'undefined' ? pParam.height : 300);

        $('body').append(
                $('<div id="divPopUpInfoFAC"></div>')
                .css("font-size", "12px")
                .append(pParam.header)
                .append(pParam.obj)
                .append(pParam.footer)
                .attr("title", pParam.title)
                );

        $('#divPopUpInfoFAC').dialog({
            position: [event.clientX, event.clientY],
            width: pParam.width,
            height: pParam.height
        });

        popupFAC.setRemoveEvents();

    },
    remove: function() {
        $('#divPopUpInfoFAC').remove();
    },
    setRemoveEvents: function() {
        $("body").click(popupFAC.remove);
    }
};