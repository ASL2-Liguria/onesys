var WindowCartella = null;

jQuery(document).ready(function() {
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti  = WindowCartella.baseReparti;
    window.baseGlobal   = WindowCartella.baseGlobal;
    window.basePC       = WindowCartella.basePC;
    window.baseUser     = WindowCartella.baseUser;
});

$(function(){
	$('div#idtabPaziente input').attr('disabled', 'disabled');
	$('input#dteDataAccesso').attr('disabled', 'disabled');
	$('input[name=txtOraAccesso]').bind('keyup', function(){ oraControl_onkeyup(document.getElementById('txtOraAccesso'));});
	$('input[name=txtOraAccesso]').bind('blur', function(){ oraControl_onblur(document.getElementById('txtOraAccesso'));});
	if(document.EXTERN.IDEN_VISITA) {
		$('select[name="cmbReparto"]').append('<option value=1 selected="selected">'+$('input[name="hReparto"]').val()+'</option>')
			.attr('disabled', 'disabled');
		$('select[name="cmbTipo"]').append('<option value=1 selected="selected">'+$('input[name="hTipoAccesso"]').val()+'</option>')
		.attr('disabled', 'disabled');
	}
	switch(document.EXTERN.TIPO.value) {
		case 'INSERIMENTO':
			break;
		case 'DUPLICA':
			$('input[name="dteDataAccesso"]').val('');
			break;
		case 'MODIFICA':
			break;
	}
	
});

function chiudiFinestra() {
	parent.$.fancybox.close();
}

function aggiornaOpener() {
	if (parent.document.getElementById('oIFWk0')){
		$('iframe#oIFWk0',parent.document)[0].contentWindow.location.reload();
	}
	chiudiFinestra();
}

function registraScheda() {
	var arrayReparto = $('select[name="cmbReparto"] option:selected').val().split('@');
	$('input[name="hIdenPro"]').val(arrayReparto[0]);
	$('input[name="hCodCdc"]').val(arrayReparto[3]);
	var dataAccesso = $('input#dteDataAccesso').val().substr(6,4)
		+ $('input#dteDataAccesso').val().substr(3,2)
		+ $('input#dteDataAccesso').val().substr(0,2);
	$('input[name="hDataAccesso"]').val(dataAccesso);
	var ora = $('input[name="txtOraAccesso"]').val();
	ora==''?$('input[name="hOraAccesso"]').val('00:00'):$('input[name="hOraAccesso"]').val(ora);
        	
	/*alert(
		'IDEN_ANAG:' +  document.EXTERN.IDEN_ANAG.value +'\n' +
		'IDEN_VISITA:' + '\n' +
		'hIdenPro:' + arrayReparto[0]+'\n' +
		'hCodCdc:' + arrayReparto[3]+'\n' +
		'cmbTipo:' +  $('select#cmbTipo option:eq(2)').attr("value") +'\n' +
		'hDataAccesso:' + dataAccesso+'\n' +
		'hOraAccesso:' + ora+'\n' +
		'txtareaMotivo:' + $('#txtareaMotivo').val()+'\n' +
		'TIPO:' 	+ document.EXTERN.TIPO.value +'\n'+
		'txtNotaBreve:'		+$('#txtNotaBreve').val()												
	);*/

        
    /**
     * Al registra di un pre-ricovero verificare se esiste già un altro record con i seguenti campi:
     * - reparto
     * - paziente
     * - data ricovero
     * - tipo ricovero
     * - dimesso = 'N'
     * - deleted = 'N'
     * 
     * Se esiste già un record mostrare il seguente alert:
     * Attenzione, il pre-ricovero che si vuole inserire esiste già. Verrà aperta la cartella relativa.
     * Verificare cosa vuole dire aggiungere anche il controllo con checkDatiAccesso per ogni record che restituisce la query sopra.
     * Nel caso non appesantisse l'iter, aprire la cce del pre-ricovero con dati dentro
     */
        
    var pBinds = new Array();
    
    pBinds.push($('input[name="hIdenPro"]').val());
    pBinds.push(document.EXTERN.IDEN_ANAG.value);
    pBinds.push($('input[name="hDataAccesso"]').val());
    pBinds.push($('select[name="cmbTipo"] option:selected').val());
    //alert(pBinds);
    
    WindowCartella.dwr.engine.setAsync(false);
    WindowCartella.dwrUtility.executeStatement('prericovero.xml', 'getIdenPrericovero', pBinds, 1, callBack);
    WindowCartella.dwr.engine.setAsync(true);

    function callBack(resp) {
        if (resp[0] == 'KO') {
            alert(resp[1]);
        } else {
            if (resp[2] == '0') {
                registra();
            } else {
                alert("Attenzione, il pre-ricovero che si vuole inserire esiste già. Verrà aperta la cartella relativa.");
                top.NS_CARTELLA_PAZIENTE.apri({
                    iden_evento : resp[2],
                    iden_anag   : document.EXTERN.IDEN_ANAG.value,
                    funzione    : 'apriVuota();',
                    window      : window
                });	               
            }  
        }
        $.fancybox.close();
    }   
}

function apriCartella() {
    var arrayReparto = $('select[name="cmbReparto"] option:selected').val().split('@');
    $('input[name="hIdenPro"]').val(arrayReparto[0]);
    
    var pBinds = new Array();
    pBinds.push($('input[name="hIdenPro"]').val());
    pBinds.push(document.EXTERN.IDEN_ANAG.value);
    pBinds.push($('input[name="hDataAccesso"]').val());
    pBinds.push($('select[name="cmbTipo"] option:selected').val());
    //alert(pBinds);

    WindowCartella.dwr.engine.setAsync(false);
    WindowCartella.dwrUtility.executeStatement('prericovero.xml', 'getIdenPrericovero', pBinds, 1, callBack);
    WindowCartella.dwr.engine.setAsync(true);

    function callBack(resp) {
        if (resp[0] == 'KO') {
            alert(resp[1]);
        } else {
            top.NS_CARTELLA_PAZIENTE.apri({
                iden_evento : resp[2],
                iden_anag   : document.EXTERN.IDEN_ANAG.value,
                funzione    : 'apriVuota();',
                window      : window
            });	            
        }
        $.fancybox.close();
    }     
}