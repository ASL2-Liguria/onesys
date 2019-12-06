var WindowCartella = null;

jQuery(document).ready(function() {
    // Gestione dell'apertura della pagina da finestra modale o dal menu
    if (typeof window.dialogArguments === 'object') {
    	window.WindowCartella = window.dialogArguments.top.window;
    } else {
        window.WindowCartella = window;
        while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
            window.WindowCartella = window.WindowCartella.parent;
        }
    }

    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
    
    try {
        infoFM.init();
        infoFM.setEvents();
    } catch (e) {
    	alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
    
    try {
	    if (document.EXTERN.BISOGNO.value == 'N') {
	        document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
	    }
    } catch (e) {}

    try {
	    if (_STATO_PAGINA == 'L') {
	    	document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
	        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
	    }
    } catch (e) {}

    try {
        if (!WindowCartella.ModalitaCartella.isStampabile(document)) {
            document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
        }
    } catch (e) {}
    
    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }
});

function chiudiFM() {
    try {
        var query = "select to_char(data_ultima_modifica,'DD/MM/YYYY') DATA_ULTIMA_MODIFICA from radsql.cc_scale where key_legame='SCALA_FM' and iden_visita=" + document.EXTERN.IDEN_VISITA.value;
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
            opener.document.getElementById('txtDataFM').value = array_dati[0];
            opener.document.getElementById('txtEsitoFM').value = document.getElementById('txtTotale').value;
        }
    } catch (e) {}
}

var infoFM = {};
(function() {
	var _this = this;
	
	var punteggio = new Object();
	
	function SommaPunteggio(array) {
		var ret = 0;
		
		if(Object.prototype.toString.call(array) !== '[object Object]') {
		    return ret;
		}
		
		for (var key in array) {
			ret += array[key];
		}

		return ret;
	}
	
    this.init = function() {
    	var width = $('#body').width() * 0.60;
    	$('td.classTdLabel label, td.classTdLabelLink label').css('white-space','nowrap');
    	
    	$('td.classTdLabelLink label').not('[id^=lblScoreTotale], #lblArtoSuperiore')
    	   .addClass('labelClass')
    	   .parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div></div>').addClass('Link'));
    	
        $('#groupA .classDataEntryTable tbody tr:eq(1) td:eq(0)').width(width);
        $('#groupB .classDataEntryTable tbody tr:eq(1) td:eq(0)').width(width);        
        $('#groupC .classDataEntryTable tbody tr:eq(1) td:eq(0)').width(width);
        $('#groupD .classDataEntryTable tbody tr:eq(1) td:eq(0)').width(width);
        
    	//$('#lblPosizioneDiPartenzaESS,#lblPosizioneDiPartenzaESS2,#lblPosizioneDiPartenzaESS3,#lblPosizioneDiPartenzaEDS,#lblPosizioneDiPartenzaEDS2,#lblPosizioneDiPartenzaEDS3,#lblPosizioneDiPartenzaEDS4,#lblPosizioneDiPartenzaEDS5,#lblPosizioneDiPartenzaEDS6,#lblPosizioneDiPartenzaEDS7,#lblPosizioneDiPartenzaEDS8,#lblPosizioneDiPartenzaEDS9,#lblPosizioneDiPartenzaEDS10,#lblPosizioneDiPartenzaC,,#lblPosizioneDiPartenzaC2,,#lblPosizioneDiPartenzaC3,,#lblPosizioneDiPartenzaC4')
        $('#txtNote').parent().css('width','80%');
        
		// Inizializzazione dei punteggi
		$('#txtScoreTotaleA').parent().append("<input class='totale'/ name='txtTotale' value='/36'/>");
		$('#txtScoreTotaleB').parent().append("<input class='totale'/ name='txtTotale' value='/10'/>");
		$('#txtScoreTotaleC').parent().append("<input class='totale'/ name='txtTotale' value='/14'/>");
		$('#txtScoreTotaleD').parent().append("<input class='totale'/ name='txtTotale' value='/6'/>");
		$('#txtScoreTotale').parent().append("<input class='totale'/ name='txtTotale' value='/66'/>");
		
		$('textarea').addClass("expand");
		$("textarea.expand").TextAreaExpander(40);
    };
    
    this.setEvents = function() {
        $('.Link').live('click', function() {
            _this.open($(this).parent().find('label').attr('id'));
        });
    	
		// Attributi readonly
		$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color':'#000000','background-color': 'transparent' ,'border':'1px solid transparent', 'text-align':'right'});
    };
    
    this.countChecked = function(inputName, update, idTotale) {
    	update = (typeof update === "boolean") ? update : true;
		var id = $('input[name="'+inputName+'"]:radio:checked');
		var p = parseInt(id.attr('value'),10);
		if (typeof punteggio[idTotale] === 'undefined') {
			punteggio[idTotale] = {risultato: 0, parziali: new Object()};
		}
		punteggio[idTotale]['parziali'][id.attr('name')] = isNaN(p) ? 0 : p;
		punteggio[idTotale].risultato = SommaPunteggio(punteggio[idTotale].parziali);
		
		if (update) {
			$('#'+idTotale).attr('value', punteggio[idTotale].risultato);
			
			var scoreScalaFM = 0;
			for (var key in punteggio) {
				scoreScalaFM += punteggio[key].risultato;
			}
			document.getElementById('txtScoreTotale').value = scoreScalaFM;	
		}
	};
    
    this.open = function(label) {
        popupFM.remove();

        var paramObj = {
            obj: null,
            title: null,
            width: 900,
            height: 200
        };

        paramObj.vObj = $('<table id=tableInfoFM></table>')
                ;
        switch (label) {
            default:
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 33%;"></td>').text('(0)'))
                        .append($('<td style="width: 33%;"></td>').text('(1)'))
                        .append($('<td style="width: 33%;"></td>').text('(2)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente non riesce ad eseguire il movimento.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente riesce ad eseguire il movimento in modo parziale.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente è perfettamente in grado di compiere il movimento.'))
                                );
                paramObj.title = ritornaJsMsg(label);
                break;             
        }

        popupFM.append({
            obj: paramObj.vObj,
            title: paramObj.title,
            width: paramObj.width,
            height: paramObj.height
        });
    };
    
    this.show = function() {
        $('#lblFunzione').addClass('Link');
    };
    
    this.hide = function() {
        $('#lblFunzione').removeClass('Link');
    };
}).apply(infoFM);


var popupFM = {
    append: function(pParam) {
        popupFM.remove();

        pParam.header = (typeof pParam.header != 'undefined' ? pParam.header : null);
        pParam.footer = (typeof pParam.footer != 'undefined' ? pParam.footer : null);
        pParam.title = (typeof pParam.title != 'undefined' ? pParam.title : "");
        pParam.width = (typeof pParam.width != 'undefined' ? pParam.width : 500);
        pParam.height = (typeof pParam.height != 'undefined' ? pParam.height : 300);

        $('body').append(
                $('<div id="divPopUpInfoFM"></div>')
                .css("font-size", "12px")
                .append(pParam.header)
                .append(pParam.obj)
                .append(pParam.footer)
                .attr("title", pParam.title)
                );

        $('#divPopUpInfoFM').dialog({
            position: [event.clientX, event.clientY],
            width: pParam.width,
            height: pParam.height
        });

        popupFM.setRemoveEvents();

    },
    remove: function() {
        $('#divPopUpInfoFM').remove();
    },
    setRemoveEvents: function() {
        $("body").click(popupFM.remove);
    }
};