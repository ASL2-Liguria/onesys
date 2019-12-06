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
    
    $('#lblMSecVSpon, #lblMSecVMax, #lblMMinVSpon, #lblMMinVMax').addClass('labelClass').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div></div>').addClass('Link'));
    info10MWT.init();    

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

    //$('#group10MWT .classDataEntryTable tbody tr td:first').css('width', '550px');
    //$('#group10MWT .classDataEntryTable tbody tr:last-child td:last-child').css('width', '550px');
    
    document.all.txtMediaVSpon.disabled = true;
    document.all.txtMSecVSpon.disabled = true;
    document.all.txtMMinVSpon.disabled = true;
    
    $("#txtP1VSpon").forceNumeric();
    $('#txtP1VSpon').focusout(function() {averagingVSpon();});
    $("#txtP2VSpon").forceNumeric();
    $('#txtP2VSpon').focusout(function() {averagingVSpon();});
    $("#txtP3VSpon").forceNumeric();
    $('#txtP3VSpon').focusout(function() {averagingVSpon();});    
    
    
    document.all.txtMediaVMax.disabled = true;
    document.all.txtMSecVMax.disabled = true;
    document.all.txtMMinVMax.disabled = true;
    
    $("#txtP1VMax").forceNumeric();
    $('#txtP1VMax').focusout(function() {averagingVMax();});
    $("#txtP2VMax").forceNumeric();
    $('#txtP2VMax').focusout(function() {averagingVMax();});
    $("#txtP3VMax").forceNumeric();
    $('#txtP3VMax').focusout(function() {averagingVMax();});      
});


function isEmpty(id) {
    return $('#' + id).val() == '';
}

function getValueNumber(id) {
    //alert(id + " :" +$('#' + id).val());
	 return isEmpty(id) ? 0 : parseFloat($('#' + id).val().replace(',','.'));
}

function calculateMSec(id, idAverage) {
    $('#' + id).val(Math.round((6 / $('#' + idAverage).val()) * Math.pow(10, 1)) / Math.pow(10, 1));
}

function calculateMMin(id, idAverage) {
    $('#' + id).val(Math.round(((6 / $('#' + idAverage).val()) * 60) * Math.pow(10, 1)) / Math.pow(10, 1));
}

function averagingVSpon() {
    var nTestVSpon = 0;
    nTestVSpon += isEmpty('txtP1VSpon') ? 0 : 1;
    nTestVSpon += isEmpty('txtP2VSpon') ? 0 : 1;
    nTestVSpon += isEmpty('txtP3VSpon') ? 0 : 1;

    $('#txtMediaVSpon').val(Math.round(((getValueNumber('txtP1VSpon') + getValueNumber('txtP2VSpon') + getValueNumber('txtP3VSpon'))/nTestVSpon) * Math.pow(10, 1)) / Math.pow(10, 1));
    
    calculateMSec('txtMSecVSpon', 'txtMediaVSpon');
    calculateMMin('txtMMinVSpon', 'txtMediaVSpon');
}

function averagingVMax() {
    var nTestVMax = 0;
    nTestVMax += isEmpty('txtP1VMax') ? 0 : 1;
    nTestVMax += isEmpty('txtP2VMax') ? 0 : 1;
    nTestVMax += isEmpty('txtP3VMax') ? 0 : 1;

    $('#txtMediaVMax').val(Math.round(((getValueNumber('txtP1VMax') + getValueNumber('txtP2VMax') + getValueNumber('txtP3VMax'))/nTestVMax) * Math.pow(10, 1)) / Math.pow(10, 1));
    
    calculateMSec('txtMSecVMax', 'txtMediaVMax');
    calculateMMin('txtMMinVMax', 'txtMediaVMax');    
}

function chiudi10MWT() {
    try {
        var opener = window.dialogArguments;

        var query = "select to_char(data_ultima_modifica,'DD/MM/YYYY') DATA_ULTIMA_MODIFICA from radsql.cc_scale where key_legame='SCALA_10MWT' and iden_visita=" + document.EXTERN.IDEN_VISITA.value;
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
            opener.document.getElementById('txtData10MWT').value = array_dati[0];
            opener.document.getElementById('txtEsito10MWT').value = document.getElementById('txtTotale').value;
        }
    } catch (e) {}
}

var info10MWT = {
    init: function() {
        $('.Link').live('click', function() {
            info10MWT.open($(this).parent().find('label').attr('id'));
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
        popup10MWT.remove();

        var paramObj = {
            obj: null,
            title: null,
            width: 500,
            height: 550
        };

        paramObj.vObj = $('<table id=tableInfo10MWT style="text-align: center;"></table>')
                ;
        switch (id) {  
            case 'lblMSecVSpon':
            case 'lblMSecVMax':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 33%;"></td>').text('< 0.4 m/s were more likely to be household ambulators.'))
                        .append($('<td style="width: 33%;"></td>').text('0.4 - 0.8 m/s limited community ambulators.'))
                        .append($('<td style="width: 33%;"></td>').text('> 0.8 m/s were community ambulators.'))
                        );
                paramObj.title = "Interpretation.";
                break;              
            case 'lblMMinVSpon':
            case 'lblMMinVMax':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text(' '))
                        .append($('<td colspan="2"></td>').text('Velocità confortevole (m/min)'))
                        .append($('<td colspan="2"></td>').text('Massima velocità (m/min)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('Genere/Decade'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('Uomini'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('Donne'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('Uomini'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('Donne'))
                                )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('20s'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('83.6'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('84.4'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('151.9'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('148.0'))
                                )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('30s'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('87.5'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('84.9'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('147.4'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('140.5'))
                                )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('40s'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('88.1'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('83.5'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('147.7'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('127.4'))
                                )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('50s'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('83.6'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('83.7'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('124.1'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('120.6'))
                                )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('60s'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('81.5'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('77.8'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('115.9'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('106.4'))
                                )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('70s'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('79.8'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('76.3'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('124.7'))
                                .append($('<td style="width: 20%; vertical-align: top;"></td>').text('104.9'))
                                );
                paramObj.title = "Velocità normali di riferimento (82 m/min = media veloce).";
                break;         
        }

        popup10MWT.append({
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

var popup10MWT = {
    append: function(pParam) {
        popup10MWT.remove();

        pParam.header = (typeof pParam.header != 'undefined' ? pParam.header : null);
        pParam.footer = (typeof pParam.footer != 'undefined' ? pParam.footer : null);
        pParam.title = (typeof pParam.title != 'undefined' ? pParam.title : "");
        pParam.width = (typeof pParam.width != 'undefined' ? pParam.width : 500);
        pParam.height = (typeof pParam.height != 'undefined' ? pParam.height : 300);

        $('body').append(
                $('<div id="divPopUpInfo10MWT"></div>')
                .css("font-size", "12px")
                .append(pParam.header)
                .append(pParam.obj)
                .append(pParam.footer)
                .attr("title", pParam.title)
                );

        $('#divPopUpInfo10MWT').dialog({
            position: [event.clientX, event.clientY],
            width: pParam.width,
            height: pParam.height
        });

        popup10MWT.setRemoveEvents();

    },
    remove: function() {
        $('#divPopUpInfo10MWT').remove();
    },
    setRemoveEvents: function() {
        $("body").click(popup10MWT.remove);
    }
};