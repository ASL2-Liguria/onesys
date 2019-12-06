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
    
    $('#lblScoreTotale, #lblScoreTotaleCognitive, #lblScoreTotaleManual').addClass('labelClass').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div></div>').addClass('Link'));
    infoTUG.init();    

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

    //$('#groupTUG .classDataEntryTable tbody tr td:first').css('width', '550px');
    //$('#groupTUG .classDataEntryTable tbody tr:last-child td:last-child').css('width', '550px');
});

function chiudiTUG() {
    try {
        var opener = window.dialogArguments;

        var query = "select to_char(data_ultima_modifica,'DD/MM/YYYY') DATA_ULTIMA_MODIFICA from radsql.cc_scale where key_legame='SCALA_TUG' and iden_visita=" + document.EXTERN.IDEN_VISITA.value;
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
            opener.document.getElementById('txtDataTUG').value = array_dati[0];
            opener.document.getElementById('txtEsitoTUG').value = document.getElementById('txtTotale').value;
        }
    } catch (e) {}
}

var infoTUG = {
    init: function() {
        $('.Link').live('click', function() {
            infoTUG.open($(this).parent().find('label').attr('id'));
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
        popupTUG.remove();

        var paramObj = {
            obj: null,
            title: null,
            width: 400,
            height: 400
        };

        paramObj.vObj = $('<table id=tableInfoTUG></table>')
                ;
        switch (id) {             
            case 'lblScoreTotale':
            case 'lblScoreTotaleCognitive':
            case 'lblScoreTotaleManual':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('Score'))
                        .append($('<td style="width: 80%;"></td>').text('Interpretazione'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('< 10s'))
                                .append($('<td style="vertical-align: top;"></td>').text('Completamente indipendente.'))
                                )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('< 20s'))
                                .append($('<td style="vertical-align: top;"></td>').text('Indipendente nei principali trasferimenti.'))
                                )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('> 30s'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita si assistenza, dipendente nella maggior parte delle attività.'))
                                );
                paramObj.title = "Interpretazione.";
                break;         
        }

        popupTUG.append({
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

var popupTUG = {
    append: function(pParam) {
        popupTUG.remove();

        pParam.header = (typeof pParam.header != 'undefined' ? pParam.header : null);
        pParam.footer = (typeof pParam.footer != 'undefined' ? pParam.footer : null);
        pParam.title = (typeof pParam.title != 'undefined' ? pParam.title : "");
        pParam.width = (typeof pParam.width != 'undefined' ? pParam.width : 500);
        pParam.height = (typeof pParam.height != 'undefined' ? pParam.height : 300);

        $('body').append(
                $('<div id="divPopUpInfoTUG"></div>')
                .css("font-size", "12px")
                .append(pParam.header)
                .append(pParam.obj)
                .append(pParam.footer)
                .attr("title", pParam.title)
                );

        $('#divPopUpInfoTUG').dialog({
            position: [event.clientX, event.clientY],
            width: pParam.width,
            height: pParam.height
        });

        popupTUG.setRemoveEvents();

    },
    remove: function() {
        $('#divPopUpInfoTUG').remove();
    },
    setRemoveEvents: function() {
        $("body").click(popupTUG.remove);
    }
};