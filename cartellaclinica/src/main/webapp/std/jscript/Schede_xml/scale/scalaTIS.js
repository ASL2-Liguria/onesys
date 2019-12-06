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
        infoTIS.init();
        infoTIS.setEvents();
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

var count_ESS;
var click_ESS;

var count_EDS;
var click_EDS;

var count_C;
var click_C;

function countChecked() {
    count_ESS = 0;
    click_ESS = 'N';
    sommaTIS_ESS(document.all.chkPosizioneDiPartenzaESS);
    sommaTIS_ESS(document.all.chkPosizioneDiPartenzaESS2);
    sommaTIS_ESS(document.all.chkPosizioneDiPartenzaESS3);
    if (click_ESS == 'S' || count_ESS > 0) {
        document.all.txtScoreTotaleESS.value = count_ESS;
    }    
    
    count_EDS = 0;
    click_EDS = 'N';    
    sommaTIS_EDS(document.all.chkPosizioneDiPartenzaEDS);
    sommaTIS_EDS(document.all.chkPosizioneDiPartenzaEDS2);
    sommaTIS_EDS(document.all.chkPosizioneDiPartenzaEDS3);
    sommaTIS_EDS(document.all.chkPosizioneDiPartenzaEDS4);
    sommaTIS_EDS(document.all.chkPosizioneDiPartenzaEDS5);
    sommaTIS_EDS(document.all.chkPosizioneDiPartenzaEDS6);
    sommaTIS_EDS(document.all.chkPosizioneDiPartenzaEDS7);
    sommaTIS_EDS(document.all.chkPosizioneDiPartenzaEDS8);
    sommaTIS_EDS(document.all.chkPosizioneDiPartenzaEDS9);
    sommaTIS_EDS(document.all.chkPosizioneDiPartenzaEDS10);
    if (click_EDS == 'S' || count_EDS > 0) {
        document.all.txtScoreTotaleEDS.value = count_EDS;
    } 
    
    count_C = 0;
    click_C = 'N';    
    sommaTIS_C(document.all.chkPosizioneDiPartenzaC);
    sommaTIS_C(document.all.chkPosizioneDiPartenzaC2);
    sommaTIS_C(document.all.chkPosizioneDiPartenzaC3);
    sommaTIS_C(document.all.chkPosizioneDiPartenzaC4);
    if (click_C == 'S' || count_C > 0) {
        document.all.txtScoreTotaleC.value = count_C;
    }   
    
    document.all.txtScoreTotaleTIS.value = count_ESS + count_EDS + count_C;
}

function sommaTIS_ESS(radio) {
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            click_ESS = 'S';
            count_ESS += parseInt(i);
        }
    }
}

function sommaTIS_EDS(radio) {
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            click_EDS = 'S';
            count_EDS += parseInt(i);
        }
    }
}

function sommaTIS_C(radio) {
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            click_C = 'S';
            count_C += parseInt(i);
        }
    }
}

function chiudiTIS() {
    try {
        var opener = window.dialogArguments;

        var query = "select to_char(data_ultima_modifica,'DD/MM/YYYY') DATA_ULTIMA_MODIFICA from radsql.cc_scale where key_legame='SCALA_TIS' and iden_visita=" + document.EXTERN.IDEN_VISITA.value;
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
            opener.document.getElementById('txtDataTIS').value = array_dati[0];
            opener.document.getElementById('txtEsitoTIS').value = document.getElementById('txtTotale').value;
        }
    } catch (e) {}
}

var infoTIS = {};
(function() {
	var _this = this;
	
    this.init = function() {
        $('#groupESS .classDataEntryTable tbody tr:eq(0) td:eq(0)').css('width', '600px');
        $('#groupESS .classDataEntryTable tbody tr:eq(0) td:eq(2)').hide();
        $('#groupESS .classDataEntryTable tbody tr:eq(0) td:eq(4)').hide();
        
        $('#groupESS .classDataEntryTable tbody tr:eq(1) td:eq(2)').hide();
        $('#groupESS .classDataEntryTable tbody tr:eq(1) td:eq(4)').hide();   
        
        $('#groupESS .classDataEntryTable tbody tr:eq(3) td:eq(0)').css('width', '600px');
        
        $('#groupEDS .classDataEntryTable tbody tr:eq(0) td:eq(0)').css('width', '600px');
        $('#groupEDS .classDataEntryTable tbody tr:eq(0) td:eq(3)').hide();
        $('#groupEDS .classDataEntryTable tbody tr:eq(0) td:eq(4)').hide(); 
        
        $('#groupEDS .classDataEntryTable tbody tr:eq(1) td:eq(0)').css('width', '600px');    
        $('#groupEDS .classDataEntryTable tbody tr:eq(1) td:eq(3)').hide();
        $('#groupEDS .classDataEntryTable tbody tr:eq(1) td:eq(4)').hide(); 
        
        $('#groupEDS .classDataEntryTable tbody tr:eq(2) td:eq(0)').css('width', '600px');
        $('#groupEDS .classDataEntryTable tbody tr:eq(2) td:eq(3)').hide();
        $('#groupEDS .classDataEntryTable tbody tr:eq(2) td:eq(4)').hide();     
        
        $('#groupEDS .classDataEntryTable tbody tr:eq(3) td:eq(0)').css('width', '600px');
        $('#groupEDS .classDataEntryTable tbody tr:eq(3) td:eq(3)').hide();
        $('#groupEDS .classDataEntryTable tbody tr:eq(3) td:eq(4)').hide();   

        $('#groupEDS .classDataEntryTable tbody tr:eq(4) td:eq(0)').css('width', '600px');
        $('#groupEDS .classDataEntryTable tbody tr:eq(4) td:eq(3)').hide();
        $('#groupEDS .classDataEntryTable tbody tr:eq(4) td:eq(4)').hide();   

        $('#groupEDS .classDataEntryTable tbody tr:eq(5) td:eq(0)').css('width', '600px');
        $('#groupEDS .classDataEntryTable tbody tr:eq(5) td:eq(3)').hide();
        $('#groupEDS .classDataEntryTable tbody tr:eq(5) td:eq(4)').hide();     
        
        $('#groupEDS .classDataEntryTable tbody tr:eq(6) td:eq(0)').css('width', '600px');
        $('#groupEDS .classDataEntryTable tbody tr:eq(6) td:eq(3)').hide();
        $('#groupEDS .classDataEntryTable tbody tr:eq(6) td:eq(4)').hide(); 
       
        $('#groupEDS .classDataEntryTable tbody tr:eq(7) td:eq(0)').css('width', '600px');
        $('#groupEDS .classDataEntryTable tbody tr:eq(7) td:eq(3)').hide();
        $('#groupEDS .classDataEntryTable tbody tr:eq(7) td:eq(4)').hide(); 
        
        $('#groupEDS .classDataEntryTable tbody tr:eq(8) td:eq(0)').css('width', '600px');
        $('#groupEDS .classDataEntryTable tbody tr:eq(8) td:eq(3)').hide();
        $('#groupEDS .classDataEntryTable tbody tr:eq(8) td:eq(4)').hide(); 
        
        $('#groupEDS .classDataEntryTable tbody tr:eq(9) td:eq(0)').css('width', '600px');
        $('#groupEDS .classDataEntryTable tbody tr:eq(9) td:eq(3)').hide();
        $('#groupEDS .classDataEntryTable tbody tr:eq(9) td:eq(4)').hide();  
        
        $('#groupEDS .classDataEntryTable tbody tr:eq(10) td:eq(0)').css('width', '600px');
        
        $('#groupC .classDataEntryTable tbody tr:eq(0) td:eq(0)').css('width', '600px');
        $('#groupC .classDataEntryTable tbody tr:eq(0) td:eq(4)').hide(); 

        $('#groupC .classDataEntryTable tbody tr:eq(1) td:eq(0)').css('width', '600px');
        $('#groupC .classDataEntryTable tbody tr:eq(1) td:eq(3)').hide();
        $('#groupC .classDataEntryTable tbody tr:eq(1) td:eq(4)').hide(); 
        
        $('#groupC .classDataEntryTable tbody tr:eq(2) td:eq(0)').css('width', '600px');
        $('#groupC .classDataEntryTable tbody tr:eq(2) td:eq(4)').hide(); 
       
        $('#groupC .classDataEntryTable tbody tr:eq(3) td:eq(0)').css('width', '600px');
        $('#groupC .classDataEntryTable tbody tr:eq(3) td:eq(3)').hide();
        $('#groupC .classDataEntryTable tbody tr:eq(3) td:eq(4)').hide();     
        
        $('#groupC .classDataEntryTable tbody tr:eq(4) td:eq(0)').css('width', '600px'); 
        
        $('#groupTIS .classDataEntryTable tbody tr:eq(0) td:eq(0)').css('width', '600px');
    	
    	$('#lblPosizioneDiPartenzaESS,#lblPosizioneDiPartenzaESS2,#lblPosizioneDiPartenzaESS3,#lblPosizioneDiPartenzaEDS,#lblPosizioneDiPartenzaEDS2,#lblPosizioneDiPartenzaEDS3,#lblPosizioneDiPartenzaEDS4,#lblPosizioneDiPartenzaEDS5,#lblPosizioneDiPartenzaEDS6,#lblPosizioneDiPartenzaEDS7,#lblPosizioneDiPartenzaEDS8,#lblPosizioneDiPartenzaEDS9,#lblPosizioneDiPartenzaEDS10,#lblPosizioneDiPartenzaC,,#lblPosizioneDiPartenzaC2,,#lblPosizioneDiPartenzaC3,,#lblPosizioneDiPartenzaC4').addClass('labelClass').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div></div>').addClass('Link'));
        $('#txtNote').parent().css('width','80%');
        
		// Inizializzazione dei punteggi
		$('#txtScoreTotaleESS').parent().append("<input class='totale'/ name='txtTotale' value='/7'/>");
		$('#txtScoreTotaleEDS').parent().append("<input class='totale'/ name='txtTotale' value='/10'/>");
		$('#txtScoreTotaleC').parent().append("<input class='totale'/ name='txtTotale' value='/6'/>");
		$('#txtScoreTotaleTIS').parent().append("<input class='totale'/ name='txtTotale' value='/23'/>");
    };
    
    this.setEvents = function() {
        $('.Link').live('click', function() {
            _this.open($(this).parent().find('label').attr('id'));
        });
    	
		// Attributi readonly
		$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color':'#000000','background-color': 'transparent' ,'border':'1px solid transparent', 'text-align':'right'});
		
        // Gestione dei pulsanti che azzerano i punteggi
        $('input[name=chkPosizioneDiPartenzaESS][value=0]').click(azzeraPosizioneDiPartenzaESS).parent().find('label').click(azzeraPosizioneDiPartenzaESS);
        $('input[name=chkPosizioneDiPartenzaEDS][value=0]').click(azzeraPosizioneDiPartenzaEDS).parent().find('label').click(azzeraPosizioneDiPartenzaEDS);
        $('input[name=chkPosizioneDiPartenzaEDS2][value=0]').click(azzeraPosizioneDiPartenzaEDS2).parent().find('label').click(azzeraPosizioneDiPartenzaEDS2);
   		$('input[name=chkPosizioneDiPartenzaEDS4][value=0]').click(azzeraPosizioneDiPartenzaEDS4).parent().find('label').click(azzeraPosizioneDiPartenzaEDS4);
   		$('input[name=chkPosizioneDiPartenzaEDS5][value=0]').click(azzeraPosizioneDiPartenzaEDS5).parent().find('label').click(azzeraPosizioneDiPartenzaEDS5);
		$('input[name=chkPosizioneDiPartenzaEDS7][value=0]').click(azzeraPosizioneDiPartenzaEDS7).parent().find('label').click(azzeraPosizioneDiPartenzaEDS7);
		$('input[name=chkPosizioneDiPartenzaEDS9][value=0]').click(azzeraPosizioneDiPartenzaEDS9).parent().find('label').click(azzeraPosizioneDiPartenzaEDS9);
        $('input[name=chkPosizioneDiPartenzaC][value=0]').click(azzeraPosizioneDiPartenzaC).parent().find('label').click(azzeraPosizioneDiPartenzaC);
        $('input[name=chkPosizioneDiPartenzaC3][value=0]').click(azzeraPosizioneDiPartenzaC3).parent().find('label').click(azzeraPosizioneDiPartenzaC3);
    };
    
    this.open = function(id) {
        popupTIS.remove();

        var paramObj = {
            obj: null,
            title: null,
            width: 900,
            height: 300
        };

        paramObj.vObj = $('<table id=tableInfoTIS></table>')
                ;
        switch (id) {
            case 'lblPosizioneDiPartenzaESS':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 50%;"></td>').text('(0)'))
                        .append($('<td style="width: 50%;"></td>').text('(2)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente cade o non riesce a mantenere la posizione di partenza per 10 secondi senza il sostegno delle braccia.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente può mantenere la posizione di partenza per 10 secondi.'))
                                );
                paramObj.title = "Posizione di partenza.";
                break;
            case 'lblPosizioneDiPartenzaESS2':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 50%;"></td>').text('(0)'))
                        .append($('<td style="width: 50%;"></td>').text('(2)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente cade o non riesce a mantenere la posizione seduta per 10 secondi senza il sostegno delle braccia.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente può mantenere la posizione di partenza per 10 secondi.'))
                                );
                paramObj.title = "Il terapista accavalla la gamba sana su quella plegica.";
                break;
            case 'lblPosizioneDiPartenzaESS3':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 25%;"></td>').text('(0)'))
                        .append($('<td style="width: 25%;"></td>').text('(1)'))
                        .append($('<td style="width: 25%;"></td>').text('(2)'))
                        .append($('<td style="width: 25%;"></td>').text('(3)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente cade.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente non riesce ad accavallare le gambe senza appaggiarsi al lettino con le braccia.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente accavalla le gambe ma sposta il tronco indietro per più di 10 cm, o si aiuta con la mano.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente accavalla le gambe senza spostare il tronco o aiutarsi con la mano.'))
                                );
                paramObj.title = "Il paziente accavalla la gamba sana su quella plegica.";
                break;  
            case 'lblPosizioneDiPartenzaEDS':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 50%;"></td>').text('(0)'))
                        .append($('<td style="width: 50%;"></td>').text('(1)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente cade, necessita del sostegno di un arto superiore, o il gomito non tocca il lettino.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente muove attivamente senza aiuto, il gomito tocca il lettino.'))
                                );
                paramObj.title = "Posizione di partenza. Il paziente è sollecitato a toccare il lettino con il gomito affetto (accorciando il lato emiplegico e allungando il sano) e a ritornare alla posizione di partenza.";
                break;  
            case 'lblPosizioneDiPartenzaEDS2':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 50%;"></td>').text('(0)'))
                        .append($('<td style="width: 50%;"></td>').text('(1)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente dimostra nessun/contrario accorciamento/allungamento.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente dimostra un appropriato accorciamento/allungamento.'))
                                );
                paramObj.title = "Ripetere precedente.";
                break; 
            case 'lblPosizioneDiPartenzaEDS3':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 50%;"></td>').text('(0)'))
                        .append($('<td style="width: 50%;"></td>').text('(1)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente compensa. Possibili compensi sono: (1) uso dell\'estremità superiore, (2) abduzione dell\'anca controlaterale, (3) flessione dell\'anca (se il gomito tocca il lettino oltre la metà prossimale del femore), (4) flessione del ginocchio, (5) scivolamento del piede.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente si muove senza compensi.'))
                                );
                paramObj.title = "Ripetere precedente.";
                break; 
            case 'lblPosizioneDiPartenzaEDS4':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 50%;"></td>').text('(0)'))
                        .append($('<td style="width: 50%;"></td>').text('(1)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente cade, necessita del sostegno di un arto superiore, o il gomito non tocca il lettino.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente muove attivamente senza aiuto, il gomito tocca il lettino.'))
                                );
                paramObj.title = "Posizione di partenza. Il paziente è sollecitato a toccare il lettino con il gomito sano (accorciando il lato sano e allungando il lato emiplegico) e a ritornare alla posizione di partenza.";
                break; 
            case 'lblPosizioneDiPartenzaEDS5':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 50%;"></td>').text('(0)'))
                        .append($('<td style="width: 50%;"></td>').text('(1)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente dimostra nessun/contrario accorciamento/allungamento.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente dimostra un appropriato accorciamento/allungamento.'))
                                );
                paramObj.title = "Ripetere precedente.";
                break; 
            case 'lblPosizioneDiPartenzaEDS6':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 50%;"></td>').text('(0)'))
                        .append($('<td style="width: 50%;"></td>').text('(1)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente compensa. Possibili compensi sono: (1) uso dell\'estremità superiore, (2) abduzione dell\'anca controlaterale, (3) flessione dell\'anca (se il gomito tocca il lettino oltre la metà prossimale del femore), (4) flessione del ginocchio, (5) scivolamento del piede.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente si muove senza compensi.'))
                                );
                paramObj.title = "Ripetere precedente.";
                break;  
            case 'lblPosizioneDiPartenzaEDS7':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 50%;"></td>').text('(0)'))
                        .append($('<td style="width: 50%;"></td>').text('(1)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente dimostra nessun/contrario accorciamento/allungamento.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente dimostra un appropriato accorciamento/allungamento.'))
                                );
                paramObj.title = "Posizione di partenza. Il paziente è sollecitato a sollevare il bacino dal lettino dalla parte affetta (accorciando il lato emiplegico e allungando il sano) e a ritornare alla posizione di partenza.";
                break;  
            case 'lblPosizioneDiPartenzaEDS8':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 50%;"></td>').text('(0)'))
                        .append($('<td style="width: 50%;"></td>').text('(1)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente compensa. Possibili compensi sono: (1) uso dell\'estremità superiore, (2) spinta del piede ipsilaterale (il tallone perde il contatto col pavimento).'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente si muove senza compensi.'))
                                );
                paramObj.title = "Ripetere precedente.";
                break;   
            case 'lblPosizioneDiPartenzaEDS9':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 50%;"></td>').text('(0)'))
                        .append($('<td style="width: 50%;"></td>').text('(1)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente dimostra nessun/contrario accorciamento/allungamento.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente dimostra un appropriato accorciamento/allungamento.'))
                                );
                paramObj.title = "Posizione di partenza. Il paziente è sollecitato a sollevare il bacino dal lettino dalla parte sana (accorciando il lato sano e allungando il lato emiplegico) e a ritornare alla posizione di partenza.";
                break;  
            case 'lblPosizioneDiPartenzaEDS10':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 50%;"></td>').text('(0)'))
                        .append($('<td style="width: 50%;"></td>').text('(1)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente compensa. Possibili compensi sono: (1) uso dell\'estremità superiore, (2) spinta del piede ipsilaterale (il tallone perde il contatto col pavimento).'))
                                .append($('<td style="vertical-align: top;"></td>').text('Il paziente si muove senza compensi.'))
                                );
                paramObj.title = "Ripetere precedente.";
                break;  
            case 'lblPosizioneDiPartenzaC':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 25%;"></td>').text('(0)'))
                        .append($('<td style="width: 25%;"></td>').text('(1)'))
                        .append($('<td style="width: 25%;"></td>').text('(2)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il lato emiplegico non viene mosso tre volte.'))
                                .append($('<td style="vertical-align: top;"></td>').text('La rotazione è assimetrica.'))
                                .append($('<td style="vertical-align: top;"></td>').text('La rotazione è simmetrica.'))
                                );
                paramObj.title = "Posizione di partenza. Il paziente è sollecitato a ruotare il tronco superiore 6 volte (ogni spalla dovrebbe essere mossa in avanti 3 volte), il primo lato a muoversi è quello emiplegico, il capo dovrebbe rimanere stabile in posizione di partenza.";
                break;  
            case 'lblPosizioneDiPartenzaC2':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 50%;"></td>').text('(0)'))
                        .append($('<td style="width: 50%;"></td>').text('(1)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('La rotazione è assimetrica.'))
                                .append($('<td style="vertical-align: top;"></td>').text('La rotazione è simmetrica.'))
                                );
                paramObj.title = "Ripetere precedente entro 6 secondi.";
                break; 
            case 'lblPosizioneDiPartenzaC3':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 25%;"></td>').text('(0)'))
                        .append($('<td style="width: 25%;"></td>').text('(1)'))
                        .append($('<td style="width: 25%;"></td>').text('(2)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Il lato emiplegico non viene mosso tre volte.'))
                                .append($('<td style="vertical-align: top;"></td>').text('La rotazione è assimetrica.'))
                                .append($('<td style="vertical-align: top;"></td>').text('La rotazione è simmetrica.'))
                                );
                paramObj.title = "Posizione di partenza. Il paziente è sollecitato a ruotare il tronco inferiore 6 volte (ogni ginocchio dovrebbe essere mosso in avanti 3 volte), il primo lato a muoversi è quello emiplegico, il tronco superiore dovrebbe rimanere stabile in posizione di partenza.";
                break; 
            case 'lblPosizioneDiPartenzaC4':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 50%;"></td>').text('(0)'))
                        .append($('<td style="width: 50%;"></td>').text('(1)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('La rotazione è assimetrica.'))
                                .append($('<td style="vertical-align: top;"></td>').text('La rotazione è simmetrica.'))
                                );
                paramObj.title = "Ripetere precedente entro 6 secondi.";
                break;             
        }

        popupTIS.append({
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
    
    // Funzioni di callback per la gestione dei pulsanti che azzerano i punteggi
    function azzeraPosizioneDiPartenzaESS(event){
    	var name = '';
    	if ($(this)[0].tagName.toLowerCase() === 'label') {
    		name = $(this).parent().find("input").first().attr("name");
    	} else {
    		name = $(this).attr("name");
    	}
    	name = name.replace("chkPosizioneDiPartenza", "");
    	$('#divESS, #divEDS, #divC').find('input[type=radio]:checked').each(function(){
    		$('input[type=radio][name='+$(this).attr('name')+'][value=0]').attr('checked','checked');
    	});
    	countChecked();
    };
    
    function azzeraPosizioneDiPartenzaEDS(event) {
    	$('input[name=chkPosizioneDiPartenzaEDS2], input[name=chkPosizioneDiPartenzaEDS3]').each(function(){
    		$('input[type=radio][name='+$(this).attr('name')+'][value=0]').attr('checked','checked');
    	});
    	countChecked();    	
    }
    function azzeraPosizioneDiPartenzaEDS2(event) {
    	azzeraPosizioneDiPartenzaEDS.call(null, event);
    }
    function azzeraPosizioneDiPartenzaEDS4(event) {
    	$('input[name=chkPosizioneDiPartenzaEDS5], input[name=chkPosizioneDiPartenzaEDS6]').each(function(){
    		$('input[type=radio][name='+$(this).attr('name')+'][value=0]').attr('checked','checked');
    	});
    	countChecked();
    }
    function azzeraPosizioneDiPartenzaEDS5(event) {
    	azzeraPosizioneDiPartenzaEDS4.call(null, event);
    }
    function azzeraPosizioneDiPartenzaEDS7(event) {
    	$('input[name=chkPosizioneDiPartenzaEDS8]').each(function(){
    		$('input[type=radio][name='+$(this).attr('name')+'][value=0]').attr('checked','checked');
    	});
    	countChecked();
    }
    function azzeraPosizioneDiPartenzaEDS9(event) {
    	$('input[name=chkPosizioneDiPartenzaEDS10]').each(function(){
    		$('input[type=radio][name='+$(this).attr('name')+'][value=0]').attr('checked','checked');
    	});
    	countChecked();
    }
    function azzeraPosizioneDiPartenzaC(event) {
    	$('input[name=chkPosizioneDiPartenzaC2]').each(function(){
    		$('input[type=radio][name='+$(this).attr('name')+'][value=0]').attr('checked','checked');
    	});
    	countChecked();
    }
    function azzeraPosizioneDiPartenzaC3(event) {
    	$('input[name=chkPosizioneDiPartenzaC4]').each(function(){
    		$('input[type=radio][name='+$(this).attr('name')+'][value=0]').attr('checked','checked');
    	});
    	countChecked();
    }
}).apply(infoTIS);


var popupTIS = {
    append: function(pParam) {
        popupTIS.remove();

        pParam.header = (typeof pParam.header != 'undefined' ? pParam.header : null);
        pParam.footer = (typeof pParam.footer != 'undefined' ? pParam.footer : null);
        pParam.title = (typeof pParam.title != 'undefined' ? pParam.title : "");
        pParam.width = (typeof pParam.width != 'undefined' ? pParam.width : 500);
        pParam.height = (typeof pParam.height != 'undefined' ? pParam.height : 300);

        $('body').append(
                $('<div id="divPopUpInfoTIS"></div>')
                .css("font-size", "12px")
                .append(pParam.header)
                .append(pParam.obj)
                .append(pParam.footer)
                .attr("title", pParam.title)
                );

        $('#divPopUpInfoTIS').dialog({
            position: [event.clientX, event.clientY],
            width: pParam.width,
            height: pParam.height
        });

        popupTIS.setRemoveEvents();

    },
    remove: function() {
        $('#divPopUpInfoTIS').remove();
    },
    setRemoveEvents: function() {
        $("body").click(popupTIS.remove);
    }
};