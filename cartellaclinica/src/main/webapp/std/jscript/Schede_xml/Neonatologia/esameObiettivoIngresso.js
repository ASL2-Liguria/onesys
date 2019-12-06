/**
 * File JavaScript in uso dalla scheda 'ESAME_OBIETTIVO_ASL2_NIDO'.
 * 
 * @author	gianlucab
 * @version	1.1
 * @since	2014-05-28
 */

var WindowCartella = null;

$(document).ready(function() {	
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }

    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    try {
    	NEONATOLOGIA.init();
        NEONATOLOGIA.caricaDati();
        NEONATOLOGIA.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
    
    if ($('form[name=EXTERN] input[name=BISOGNO]').val()=='N'){
        document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
    }

    if (_STATO_PAGINA == 'L'){
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
    }

    try{
        if(!WindowCartella.ModalitaCartella.isStampabile(document)){
            document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
        }
    }
    catch(e){}
        
    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }
});

var NEONATOLOGIA = {	
	init: function() {
        window.name = 'ESAME_OBIETTIVO_INGRESSO';
	
        // Aggiunta attributo "for" per le label accanto ai check input
        $('label[name^=lblchk]').each(function () {
        	var idname = $(this).attr("name").replace(/^(lbl)(chk[\s\S]*)$/, "$2");
        	$(this).attr("for", idname);
        });
               
        NS_FUNCTIONS.moveLeftField({name: 'chkLBW', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
        
        jQuery("#txtCute").addClass("expand").parent().append($('<div></div>').addClass('classDivTestiStd').attr("title","Testi Standard").click(function(){NS_FUNCTIONS.apriTestiStandard('txtCute');}));
        jQuery("#txtMalformazioni").addClass("expand").parent().append($('<div></div>').addClass('classDivTestiStd').attr("title","Testi Standard").click(function(){NS_FUNCTIONS.apriTestiStandard('txtMalformazioni');}));
        jQuery("#txtAddome").addClass("expand").parent().append($('<div></div>').addClass('classDivTestiStd').attr("title","Testi Standard").click(function(){NS_FUNCTIONS.apriTestiStandard('txtAddome');}));
        jQuery("#txtRespiratorio").addClass("expand").parent().append($('<div></div>').addClass('classDivTestiStd').attr("title","Testi Standard").click(function(){NS_FUNCTIONS.apriTestiStandard('txtRespiratorio');}));
        jQuery("#txtGenitali").addClass("expand").parent().append($('<div></div>').addClass('classDivTestiStd').attr("title","Testi Standard").click(function(){NS_FUNCTIONS.apriTestiStandard('txtGenitali');}));
        jQuery("#txtAnche").addClass("expand").parent().append($('<div></div>').addClass('classDivTestiStd').attr("title","Testi Standard").click(function(){NS_FUNCTIONS.apriTestiStandard('txtAnche');}));
        
        jQuery("#txtNoteRivedibile").addClass("expand").parent().css('width','100%');
        //NS_FUNCTIONS.moveLeftField({name: 'chkLBW', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
        jQuery("textarea[class*=expand]").TextAreaExpander();
	},
	caricaDati: function() {
		var pBinds = new Array();
		pBinds.push(document.EXTERN.IDEN_VISITA.value);
		var rs = WindowCartella.executeQuery("nido.xml","caricaAccertamentoInfermieristico",pBinds);
		if(rs.next()){
			if ($("#txtPeso").val() == '') $("#txtPeso").val(rs.getString("txtPesoL"));
			if ($("#txtLunghezza").val() == '') $("#txtLunghezza").val(rs.getString("txtLunghezzaL"));
			if ($("#txtCircCranica").val() == '') $("#txtCircCranica").val(rs.getString("txtCircCranicaL"));
			if ($("#txtCircToracica").val() == '') $("#txtCircToracica").val(rs.getString("txtCircToracicaL"));
			if ($("#txtTemperatura").val() == '') $("#txtTemperatura").val(rs.getString("txtTemperaturaL"));
		}
	},
	setEvents: function() {
		// Controllo obbligatorietà valore numerico
	    $('input[name=txtPeso], '+
	      'input[name=txtLunghezza], '+
	      'input[name=txtCircCranica], '+
	      'input[name=txtCircToracica], '+
	      //'input[name=txtFontanellaAnte], '+
	      //'input[name=txtFontanellaPost], '+
	      'input[name=txtTemperatura]'
	    ).keydown(NS_FUNCTIONS.controlloNumerico_onkeydown).blur(NS_FUNCTIONS.controlloNumerico_onblur);
	    
        NEONATOLOGIA.enableDisableLBW($('input[name=chkLBW]'));
		$('#txtPeso').blur(function(){			
			NEONATOLOGIA.enableDisableLBW($('input[name=chkLBW]'));
		});
        $('input[name=chkLBW]').click(function(){
        	return false;
        });
        
        NS_FUNCTIONS.enableDisable($('select[name="cmbTremori"]'), [1], ['txtSpecificaTremori']);
        $('select[name="cmbTremori"]').change(function() {
        	NS_FUNCTIONS.enableDisable($('select[name="cmbTremori"]'), [1], ['txtSpecificaTremori'], true);
        });
	},
	enableDisableLBW: function(element) {
		element.attr('checked', false);
		$('label[name=lblchkLBW]').css('color', 'black');
		if ($('#txtPeso').val() == '') return;
		var peso = parseInt($('#txtPeso').val(),10);
		peso = isNaN(peso) ? 0 : peso; 
		if (peso < 2500) {
			element.attr('checked', true);
			$('label[name=lblchkLBW]').css('color', 'red');
		}
	},
	registraPesoNascita: function(){
		// Evento associato alla registrazione della scheda	
		var peso=NEONATOLOGIA.rilevaAggiornamentoPeso();
		if (peso == null) return;

		var pBinds = new Array(
			document.EXTERN.USER_ID.value,
			document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,
			null,
			0,
			clsDate.getData(new Date(),'YYYYMMDD') ,
			clsDate.getOra(new Date()),
			peso,
			null,
			'',
			'',
			'',
			'PesogNasc',
			'ESAME_OBIETTIVO' // il parametro verrà rilevato ma non visualizzato
		);
		var vResp = WindowCartella.executeStatement("parametri.xml","setParametro",pBinds,1);
		if(vResp[0]=='KO'){
			return alert(vResp[1]);
		}
		//alert(vResp[2]);
	},
	rilevaAggiornamentoPeso: function(){
		// Rileva se il peso alla nascita è stato modificato.
		// Nota: il valore registrato nell'esame obiettivo ha la priorità.
		var pBinds = new Array();		
		pBinds.push(document.EXTERN.IDEN_VISITA.value);
		var vResp = WindowCartella.executeStatement("nido.xml","aggiornaParametroPesogNascita",pBinds,1);
		if(vResp[0]=='KO'){
			return alert(vResp[1]);
		}
		return vResp[2];
	}
};

// Stampa la scheda
function stampa(){
	try {
		var vDati 		= WindowCartella.getForm();
		var iden_visita	= vDati.iden_ricovero;
		var funzione	= document.EXTERN.FUNZIONE.value;
		var reparto		= vDati.reparto;
		var anteprima	= 'S';
		var sf			= '&prompt<pVisita>='+iden_visita;

		WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,WindowCartella.basePC.PRINTERNAME_REF_CLIENT);		
	} catch(e) {
		window.alert(e.message);
	}
}
