var WindowCartella = null;
var chir =null;

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
	$('#lbltabIntervento').hide();
	$('input[name=txtOraAccesso]').bind('keyup', function(){ oraControl_onkeyup(document.getElementById('txtOraAccesso'));});
	$('input[name=txtOraAccesso]').bind('blur', function(){ oraControl_onblur(document.getElementById('txtOraAccesso'));});
	$('select[name="cmbReparto"]').bind('change',function(){		
		arr = $(this).val().split('@');	
		setCheckVpo(arr[arr.length-1]);		
	})
	
		if(document.EXTERN.TIPO.value=='MODIFICA') {
		$('select[name="cmbReparto"] option[value^="'+$('input[name="hReparto"]').val()+'"]').attr('selected','selected');
		$('select[name="cmbTipo"]').val($('input[name="hTipoAccesso"]').val());
		arr = $('select[name="cmbReparto"]').val().split('@');
		setCheckVpo(arr[arr.length-1]);
		if ($('input[name="hVpo"]').val()=='VAL_PREOP'){
			$('input#chkVpo').attr('checked','checked');
		}
	}
	
	$("#txtCodiceICD,#txtCodiceICDDiagnosi").parent().width("50");	
	var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
	oDateMask.attach(document.getElementById('dteDataAccesso'));
 
	$("#txtDescrizioneICD,#txtDescrICDDiagnosi").width("500");
 
});

function chiudiFinestra() {
	parent.$.fancybox.close();
}

function aggiornaOpener() {

/*	if (parent.document.getElementById('oIFWk0')){
		$('iframe#oIFWk0',parent.document)[0].aggiorna();
	}*/
	chiudiFinestra();
	
	if(document.EXTERN.TIPO.value=='INSERIMENTO'){apriCartella();}
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
	
	//preoperatorio
	if(chir=='S'){
	if(($('input#chkVpo').attr('checked')==true)){$('input[name="hVpo"]').val('VAL_PREOP')}else{$('input[name="hVpo"]').val('REPARTO')}
	}
	else{
		$('input[name="hVpo"]').val('');
		$("#hVpo,#txtCodiceICD,#txtCodiceICDDiagnosi,TEXTAREA[name='txtNoteIntervento']").val('');
	}
        	
       
    /**
     * In inserimento al registra di un pre-ricovero verificare se esiste già un altro record con i seguenti campi:
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

	if(document.EXTERN.TIPO.value=='INSERIMENTO') {
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
	else{
		 registra();
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

function setCheckVpo(val){
if(val!=''){
	chir='S';
	$('#lbltabIntervento').show();
}
else{
	chir='N';
	$('#lbltabIntervento').hide();
}
}