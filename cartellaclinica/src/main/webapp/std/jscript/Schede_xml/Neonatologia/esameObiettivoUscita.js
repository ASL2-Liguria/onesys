/**
 * File JavaScript in uso dalla scheda 'ESAME_OBIETTIVO_USCITA_ASL2_NIDO'.
 * 
 * @author	gianlucab
 * @version	1.1
 * @since	2014-05-28
 */

var WindowCartella = null;
var btnApriLetteraDimissione = false;

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

	if (_STATO_PAGINA == 'L'){
		document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
		document.getElementById('lblApriLettera').parentElement.parentElement.style.display = 'none';
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
		window.name = 'ESAME_OBIETTIVO_USCITA';

		// Attivo il primo tabulatore
		var label = "Esame obiettivo all'uscita";
		attivaTab([label+' (1)', label+' (2)', label+' (3)', label+' (4)'],
		           1);
		
		// Aggiunta attributo "for" per le label accanto ai check input
		$('label[name^=lblchk]').each(function () {
			var idname = $(this).attr("name").replace(/^(lbl)(chk[\s\S]*)$/, "$2");
			$(this).attr("for", idname);
		});
		
		$('select[name=cmbTestaTronco]').attr('id', 'cmbTestaTronco');
		$('textarea[name=txtNote]').parent().attr('rowspan', '3');
		$('input[name=txtNumDitaManoDX]').parent().attr('colspan', '12');
		$('input[name=txtNumDitaManoSX]').parent().attr('colspan', '12');
		$('#lblProporzioneSegmenti').css('white-space','nowrap');
		$('#divEsameCute td').attr('colspan', '1').css('width', '25%');
		$('#divEsameCute table input[name^=txt]').css('width', '100%');
		NS_FUNCTIONS.moveLeftField({name: 'txtAltro', colspan: 3, space: '&nbsp;&nbsp;&nbsp;'});
		$('label[name=lblNumDita]').parent().attr('rowspan', '4');
		$('#divEsameCapoCollo label[name=lblOcchi], '+
		  '#divEsameCapoCollo label[name=lblOrecchie], '+
		  '#divEsameCapoCollo label[name=lblBocca], '+
		  '#divEsameCapoCollo label[name=lblCollo]'
		).parent().parent().prev().after('<tr style="height:0.5em"><td/>');
		$('#divGenerale label, #divEsameCapoCollo label').css('white-space', 'nowrap');
		var e = $('#txtPerditeCuoio').parent();
		$('#txtPerditeCuoio').remove().appendTo($('select[name=cmbPerditeCuoio]').parent()).parent();
		e.remove();
		$('#txtSeborrea').parent().attr('colspan', '12');
		
		$('#lblTorace, #lblSchiena').attr('style', 'white-space:nowrap;text-decoration:underline');
		$('#txtSpecificaTorace, #txtSpecificaSchiena').css('width', '100%').parent().css('width', '100%');
		
		$('#divEsameTorace label, #divEsameAddome label, #divEsameDorsale label, #divEsameAnche label, #lblNoteDiagnostiche').css('white-space', 'nowrap');
		$('#lblAnche').css('white-space', 'normal').parent().css('width', '400px');
			
		$('#lblRiflessiNeonatali').parent().attr('rowspan', '2');
		$('select[name=cmbRiflessoMarcia]').parent().attr('colspan', '11');
		
		$('#lblApriLettera').css({'white-space': 'nowrap', 'padding': '0 5px 0 5px'});
	},
	caricaDati: function() {
		var pBinds = new Array();
		pBinds.push(document.EXTERN.IDEN_VISITA.value);
		var rs = WindowCartella.executeQuery("nido.xml","caricaEsameObiettivo",pBinds);
		if(rs.next()){
			$("#txtPesoL").val(rs.getString("txtPesoL"));
			$("#txtLunghezzaL").val(rs.getString("txtLunghezzaL"));
			$("#txtCircCranicaL").val(rs.getString("txtCircCranicaL"));
		}
		rs = WindowCartella.executeQuery("nido.xml","caricaAccertamentoInfermieristico",pBinds);
		if(rs.next()){
			if ($("#txtPesoL").val() == '') $("#txtPesoL").val(rs.getString("txtPesoL"));
			if ($("#txtLunghezzaL").val() == '') $("#txtLunghezzaL").val(rs.getString("txtLunghezzaL"));
			if ($("#txtCircCranicaL").val() == '') $("#txtCircCranicaL").val(rs.getString("txtCircCranicaL"));
		}
		
		pBinds = [document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value, 'PESOG'];
		if ($('#txtPeso').val()=='') {
			rs = WindowCartella.executeQuery("nido.xml","ultimaRilevazione", pBinds);
			if (rs.next()){
				$('#txtPeso').val(rs.getString("valore"));
			}
		}
	},
	setEvents: function() {
		$('#txtPesoL, #txtLunghezzaL, #txtCircCranicaL').css({'color':'#6D6D6D','background-color': 'transparent' ,'border':'1px solid #F2FEFF'});
		
		// Controllo obbligatorietà valore numerico
		$('input[name=txtPeso], '+
		  'input[name=txtLunghezza], '+
		  'input[name=txtCircCranica], '+
		  //'input[name=txtFontanellaAnte], '+
		  //'input[name=txtXcm], '+
		  //'input[name=txtFontanellaPost], '+
		  'input[name=txtNumDitaManoDX], '+
		  'input[name=txtNumDitaManoSX], '+
		  'input[name=txtNumDitaPiedeDX], '+
		  'input[name=txtNumDitaPiedeSX], '
		).keydown(NS_FUNCTIONS.controlloNumerico_onkeydown).blur(NS_FUNCTIONS.controlloNumerico_onblur);
		
		$('#divEsameCute input[name^=chk], #divEsameCapoCollo input[name^=chk]').each(function(){
			var id = $(this).attr('id').replace('chk', 'txt');
			NS_FUNCTIONS.enableDisable($(this), ['S'], [id]);
		});
		
		$('#divEsameCute input[name^=chk], #divEsameCapoCollo input[name^=chk]').click(function() {
			var id = $(this).attr('id').replace('chk', 'txt');
			$(this).val($(this).is(':checked') ? 'S' : 'N');
			NS_FUNCTIONS.enableDisable($(this), ['S'], [id], true);
		});
		
		$('#lblApriLettera').click(function(){btnApriLetteraDimissione=true;});
		$('#lblRegistra').click(function(){btnApriLetteraDimissione=false;});
	}
};

function apriLetteraDimissione() {
	if (btnApriLetteraDimissione) {
		top.apriLetteraDimissioni('LETTERA_STANDARD');
	}
}

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
