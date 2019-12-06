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

    $('#lblAndaturaPerno,#lblAndaturaSuperficiePiana,#lblAndaturaTestaX,#lblAndaturaTestaY,#lblIntornoOstacolo,#lblPassi,#lblSopraOstacolo,#lblVariazioneVelocitaAndatura').addClass('labelClass').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div></div>').addClass('Link'));
    infoDGI.init();

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

    $('#groupDGI .classDataEntryTable tbody tr td:first').css('width', '550px');
    $('#groupDGI .classDataEntryTable tbody tr:last-child td:last-child').css('width', '550px');
});

var count;
var click;
function countChecked() {
    count = 0;
    click = 'N';

    sommaDGI(document.all.chkAndaturaPerno);
    sommaDGI(document.all.chkAndaturaSuperficiePiana);
    sommaDGI(document.all.chkAndaturaTestaX);
    sommaDGI(document.all.chkAndaturaTestaY);
    sommaDGI(document.all.chkIntornoOstacolo);
    sommaDGI(document.all.chkPassi);
    sommaDGI(document.all.chkSopraOstacolo);
    sommaDGI(document.all.chkVariazioneVelocitaAndatura);

    if (click == 'S' || count > 0) {
        document.all.txtScoreTotale.value = count;
        document.all.txtScoreTotale.disabled = true;
    }
}

function sommaDGI(radio) {
    for (i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            click = 'S';
            if (i == '0')
                count += 3;
            else if (i == '1')
                count += 2;
            else if (i == '2')
                count += 1;
        }
    }
}

function chiudiDGI() {
    try {
        var opener = window.dialogArguments;

        var query = "select to_char(data_ultima_modifica,'DD/MM/YYYY') DATA_ULTIMA_MODIFICA from radsql.cc_scale where key_legame='SCALA_DGI' and iden_visita=" + document.EXTERN.IDEN_VISITA.value;
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
            opener.document.getElementById('txtDataDGI').value = array_dati[0];
            opener.document.getElementById('txtEsitoDGI').value = document.getElementById('txtTotale').value;
        }
    } catch (e) {}
}

var infoDGI = {
    init: function() {
        $('.Link').live('click', function() {
            infoDGI.open($(this).parent().find('label').attr('id'));
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
        popupDGI.remove();

        var paramObj = {
            obj: null,
            title: null,
            width: 900,
            height: 450
        };

        paramObj.vObj = $('<table id=tableInfoDGI></table>')
                ;
        switch (id) {
            case 'lblAndaturaSuperficiePiana':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 25%;"></td>').text('(3) NORMAL'))
                        .append($('<td style="width: 25%;"></td>').text('(2) MILD IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(1) MODERATE IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(0) SEVERE IMPAIRMENT'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Walks 20\', no assistive devices, good speed, no evidence for imbalance, normal gait pattern.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Walks 20\', uses assistive devices, slower speed, mild gait deviations.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Walks 20\', slow speed, abnormale gait pattern, evidence for imbalance.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Cannot walk 20\' without assistance, severe gait deviations or imbalance.'))
                                );
                paramObj.title = "Gait level surface. Instructions: Walk at your normal speed from here to the next mark (20').";
                break; 
            case 'lblVariazioneVelocitaAndatura':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 25%;"></td>').text('(3) NORMAL'))
                        .append($('<td style="width: 25%;"></td>').text('(2) MILD IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(1) MODERATE IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(0) SEVERE IMPAIRMENT'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Able to smoothly change walking speed without loss of balance or gait deviation. Shows a significant difference in walking speeds between normal, fast and slow speeds.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Is able to change speed but demonstrates mild gait deviations, or not gait deviations but unable to achieve a significant change in velocity, or uses an assistive device.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Makes only minor adjustments to walking speed, or accomplishes a change in speed with significant gait deviations, or changes speed but has significant gait deviations, or changes speed but loses balance but is able to recover and continue walking.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Cannot change speeds, or loses balance and has to reach for wall or be caught.'))
                                );
                paramObj.title = "Change in gait speed. Instructions: Begin walking at your normal pace (for 5'), when I tell you \"go\", walk as fast as you can (for 5'). When i tell you \"slow\", walk as slowly as you can (for 5').";
                break; 
            case 'lblAndaturaTestaX':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 25%;"></td>').text('(3) NORMAL'))
                        .append($('<td style="width: 25%;"></td>').text('(2) MILD IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(1) MODERATE IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(0) SEVERE IMPAIRMENT'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Performs head turns smoothly with no change in gait.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Performs head turns smoothly with slight change in gait velocity, i.e., minor disruption to smooth gait path or uses walking aid.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Performs head turns with moderate change in gait velocity, slows down, staggers but recovers, can continue to walk.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Performs task with severe disruption of gait, i.e., staggers outside 15" path, loses balance, stops, reaches for wall.'))
                                );
                paramObj.title = "Gait with horizontal head turns. Instructions: Begin walking at your normal pace. When I tell you to \"look right\", keep walking straight, but turn your head to the right. Keep looking to the right until I tell you \"look left\", then keep walking straight and turn your head to the left. Keep your head to the left until I tell you \"look straight\", then keep walking straight, but return your head to the center.";
                break; 
            case 'lblAndaturaTestaY':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 25%;"></td>').text('(3) NORMAL'))
                        .append($('<td style="width: 25%;"></td>').text('(2) MILD IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(1) MODERATE IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(0) SEVERE IMPAIRMENT'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Performs head turns smoothly with no change in gait.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Performs head turns smoothly with slight change in gait velocity, i.e., minor disruption to smooth gait path or uses walking aid.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Performs head turns with moderate change in gait velocity, slows down, staggers but recovers, can continue to walk.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Performs task with severe disruption of gait, i.e., staggers outside 15" path, loses balance, stops, reaches for wall.'))
                                );
                paramObj.title = "Gait with vertical head turns. Instructions: Begin walking at your normal pace. When I tell you to \"look up\", keep walking straight, but tip your head up. Keep looking up until I tell you \"look down\", then keep walking straight and tip your head down. Keep your head down until I tell you \"look straight\", then keep walking straight, but return your head to the center.";
                break; 
            case 'lblAndaturaPerno':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 25%;"></td>').text('(3) NORMAL'))
                        .append($('<td style="width: 25%;"></td>').text('(2) MILD IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(1) MODERATE IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(0) SEVERE IMPAIRMENT'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Pivot turns safely within 3 seconds and stops quickly with no loss of balance.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Pivot turns safely in > 3 seconds and stops with no loss of balance.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Turns slowly, requires verbal cueing, requires several small steps to catch balance following turn and stop.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Cannot turn safely, requires assistance to turn and stop.'))
                                );
                paramObj.title = "Gait and pivot turn. Instructions: Begin walking at your normal pace. When I tell you \"turn and stop\", turn as quickly as you can to face the opposite direction and stop.";
                break; 
            case 'lblSopraOstacolo':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 25%;"></td>').text('(3) NORMAL'))
                        .append($('<td style="width: 25%;"></td>').text('(2) MILD IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(1) MODERATE IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(0) SEVERE IMPAIRMENT'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Is able to step over the box without changing gait speed, no evidence of imbalance.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Is able to step over the box, but must slow down and adjust steps to clear box safely.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Is able to step over the box but must stop, then step over. May require verbal cueing.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Cannot perform without assistance.'))
                                );
                paramObj.title = "Step over obstacle. Instructions: Begin walking at your normal speed. When you come to the shoebox, step over it, not around it, and keep walking.";
                break;
            case 'lblIntornoOstacolo':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 25%;"></td>').text('(3) NORMAL'))
                        .append($('<td style="width: 25%;"></td>').text('(2) MILD IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(1) MODERATE IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(0) SEVERE IMPAIRMENT'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Is able to walk around cones safely without changing gait speed; no evidence of imbalance.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Is able to step around both cones, but must slow down and adjust steps to clear cones.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Is able to clear cones but must significantly slow, speed to accomplish task, or requires verbal cueing.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Unable to clear cones, walks into one or both cones, or requires physical assistance.'))
                                );
                paramObj.title = "Step around obstacles. Instructions: Being walking at normal speed. When you come to the first cone (about 6' away), walk around the right side of it. When you come to the second cone (6' past first cone), walk around it to the left.";
                break; 
            case 'lblPassi':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 25%;"></td>').text('(3) NORMAL'))
                        .append($('<td style="width: 25%;"></td>').text('(2) MILD IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(1) MODERATE IMPAIRMENT'))
                        .append($('<td style="width: 25%;"></td>').text('(0) SEVERE IMPAIRMENT'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Alternating feet, no rail.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Alternating feet, must use rail.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Two feet to a stair, must use rail.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Cannot do fafely.'))
                                );
                paramObj.title = "Steps. Instructions: Walk up these stairs as you would at home, i.e., using the railing if necessary. At the stop, turn around and walk down.";
                break;               
        }

        popupDGI.append({
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


var popupDGI = {
    append: function(pParam) {
        popupDGI.remove();

        pParam.header = (typeof pParam.header != 'undefined' ? pParam.header : null);
        pParam.footer = (typeof pParam.footer != 'undefined' ? pParam.footer : null);
        pParam.title = (typeof pParam.title != 'undefined' ? pParam.title : "");
        pParam.width = (typeof pParam.width != 'undefined' ? pParam.width : 500);
        pParam.height = (typeof pParam.height != 'undefined' ? pParam.height : 300);

        $('body').append(
                $('<div id="divPopUpInfoDGI"></div>')
                .css("font-size", "12px")
                .append(pParam.header)
                .append(pParam.obj)
                .append(pParam.footer)
                .attr("title", pParam.title)
                );

        $('#divPopUpInfoDGI').dialog({
            position: [event.clientX, event.clientY],
            width: pParam.width,
            height: pParam.height
        });

        popupDGI.setRemoveEvents();

    },
    remove: function() {
        $('#divPopUpInfoDGI').remove();
    },
    setRemoveEvents: function() {
        $("body").click(popupDGI.remove);
    }
};