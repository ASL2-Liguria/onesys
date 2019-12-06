/**
 * File JavaScript in uso dalla schede 'ANAMNESI_FAMILIARE_ASL2_NIDO' e 'ANAMNESI_OSTETRICA_ASL2_NIDO'.
 * 
 * @author	gianlucab
 * @version	1.2
 * @since	2014-05-15
 */

var WindowCartella = null;

var hOstetricaAnno   = [];
var hOstetricaParto  = [];
var hOstetricaSett   = [];
var hOstetricaPeso   = [];
var hOstetricaSesso  = [];
var hOstetricaAllatt = [];

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
        NEONATOLOGIA.tableGravidanzePrecedenti('APPEND');
        NEONATOLOGIA.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
    
    /*if (document.EXTERN.BISOGNO.value=='N'){
        document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
    }*/

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

$(window).load(function(){
    if (NEONATOLOGIA.strError != null) {
    	alert(NEONATOLOGIA.strError);
    }
});

var NEONATOLOGIA = new Function();
(function() {
	var _this = this;
	
	this.iden_scheda = null;
	
	this.strError = null;
	
	this.init = function() {
		_this.iden_scheda = parseInt($('form[name=EXTERN] input[name=IDEN_SCHEDA]').val(),10) || null;
		
		// Aggiunta attributo "for" per le label accanto ai radio input
		$("input:radio").each(function() {
			var label = $(this).next().next();
			if (label.attr("tagName").toUpperCase() == 'LABEL') {
				var id = $(this).attr('name')+'_'+$(this).val();
				$(this).attr("id", id);
	    		label.attr("for", id);
			}
	    });
		
		// Aggiunta attributo "for" per le label accanto ai check input
		$('label[name^=lblchk]').each(function () {
			var id = $(this).attr("name").replace(/^(lbl)(chk[\s\S]*)$/, "$2");
			$(this).attr("for", id);
		});
		
		switch (document.EXTERN.KEY_LEGAME.value) {
		case 'ANAMNESI_FAMILIARE_ASL2_NIDO':
			$(
				'#txtCognomeMadre, #txtNomeMadre, #txtProfessioneMadre, #txtProvenienzaMadre, #txtNazioneMadre, #txtRegioneMadre,'+
				'#txtCognomePadre, #txtNomePadre, #txtProf, #txtLuogoNasc, #txtCittad, #txtRegionePadre'
			).css('text-transform', 'uppercase');
			
			$('#txtProf, #txtLuogoNasc, #txtCittad').css('width', '100%');
			
			$('#txtRecapito1M').css('width', '100%').before('<label>Recapito:</label>&nbsp;&nbsp;&nbsp;').parent().attr({'class':'classTdLabel','colspan':'14'});			
			$('#txtRecapito2M').css('width', '100%').before('<label>Recapito:</label>&nbsp;&nbsp;&nbsp;').parent().attr('class','classTdLabel');			
			$('#txtRecapito3M').css('width', '100%').before('<label>Recapito:</label>&nbsp;&nbsp;&nbsp;').parent().attr('class','classTdLabel');
			$('#txtRecapito1P').css('width', '100%').before('<label>Recapito:</label>&nbsp;&nbsp;&nbsp;').parent().attr('class','classTdLabel');
			$('#txtRecapito2P').css('width', '100%').before('<label>Recapito:</label>&nbsp;&nbsp;&nbsp;').parent().attr('class','classTdLabel');
			$('#txtRecapito3P').css('width', '100%').before('<label>Recapito:</label>&nbsp;&nbsp;&nbsp;').parent().attr('class','classTdLabel');
			
			$('#lblTelefonoM').parent().attr('rowspan', '3');
			$('#lblTelefonoP').parent().attr('rowspan', '3');
			break;
		case 'ANAMNESI_OSTETRICA_ASL2_NIDO':
			break;
		default:
		}
                
		$('#lblStampa').parent().hide();
	};
	
	this.setEvents = function() {
		// Campi non editabili (sola lettura)
		$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color':'#6D6D6D','background-color': 'transparent' ,'border':'1px solid transparent'});
		
		switch (document.EXTERN.KEY_LEGAME.value) {
		case 'ANAMNESI_FAMILIARE_ASL2_NIDO':
			// Controllo obbligatorietà valore numerico
			$('#txtStaturaMadre, #txtStaturaPadre').keydown(NS_FUNCTIONS.controlloNumerico_onkeydown).blur(NS_FUNCTIONS.controlloNumerico_onblur);
			
			$('#lblFamiliare').click(_this.apriAnamnesiFamiliare);
			
			var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
			oDateMask.attach(document.getElementById('txtDataNascitaPadre'));
			
			//TODO
			// Per i salvataggi successivi vengono segnalati i campi importati da altre schede non ancora registrati nell'xml
			if (_this.iden_scheda != null) {
				NS_FUNCTIONS.segnalaCampiNonRegistrati();
				if (_STATO_PAGINA != 'L' && $('[data-uncommitted]').length > 0) {
					alert('Sono presenti dati non salvati provenienti dal ricovero della madre.\n\nPer convalidare l\'importazione è necessario registrare nuovamente la scheda.');
				}
			}
			
			// I campi importati da altre schede sono ora registrati nell'xml
			document.body.ok_registra = function() {
				NS_FUNCTIONS.segnalaCampiRegistrati();
			};
			
			break;
		case 'ANAMNESI_OSTETRICA_ASL2_NIDO':
			var maxLength = 4000;
			var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
			jQuery('#txtNoteTerapia, #txtNoteRemote').addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
			    maxlength(this, maxLength, msg);
			});

			jQuery("textarea[class*=expand]").TextAreaExpander();
			
			// Impedisce la modifica delle date
			$('.datepick-trigger').hide();
			
			break;
		default:
		}
	};
    
	this.apriAnamnesiFamiliare = function() {
        var url = "servletGenerator?KEY_LEGAME=ANAMNESI_FAMILIARE&HFAM=" + document.getElementById('hFam').value + "&HGENERALI=" + document.getElementById('hGenerali').value+"&CODICE_REPARTO="+document.EXTERN.REPARTO.value;
        $.fancybox({
            'padding': 3,
            'width': 1024,
            'height': 580,
            'href': url,
            'type': 'iframe'
        });
    };
	
    this.tableGravidanzePrecedenti = function(modo) {
    	var table;
    	var n=Math.max(hOstetricaAnno.length, hOstetricaParto.length, hOstetricaSett.length, hOstetricaPeso.length, hOstetricaSesso.length, hOstetricaAllatt.length);
    	if (n < 1) n = 1;
    	
		function tdGravidanzePrecedentiLabel(labelName, labelTitle, width) {
			width = typeof width !== 'string' ? "" : " style=\"width:"+ width +"\"";
			return "<TD class=classTdLabel STATO_CAMPO=\"E\"" + width + "><LABEL id=\"" + labelName + "\" name=\""+ labelName + "\">" + labelTitle + "</LABEL></TD>";
		}
		
		function tdGravidanzePrecedentiInput(inputName, inputValue) {
			return "<TD class=classTdField STATO_CAMPO=\"E\"><INPUT id=\"" + inputName + "\" readOnly name=\"" + inputName + "\" STATO_CAMPO=\"L\" style=\"width:100%\" value=\"" + inputValue + "\" /></TD>";
		}

		function trGravidanzePrecedentiHeader() {
			var tr = "<TR>" +
			         tdGravidanzePrecedentiLabel("lblVuota", "&nbsp;", "50px") +
			         tdGravidanzePrecedentiLabel("lblAnno", "Anno") +
			         tdGravidanzePrecedentiLabel("lblParto", "Parto") +
			         tdGravidanzePrecedentiLabel("lblSettimane", "Settimane") +
			         tdGravidanzePrecedentiLabel("lblPeso", "Peso") +
			         tdGravidanzePrecedentiLabel("lblSesso", "Sesso") +
			         tdGravidanzePrecedentiLabel("lblAllattamento", "Allattamento") +
			         "</TR>";
			return tr;
		}
		
		function trGravidanzePrecedentiAddRow(index) {
			var anno = typeof hOstetricaAnno[index] === "string" ? hOstetricaAnno[index] : "";
			var parto = typeof hOstetricaParto[index] === "string" ? hOstetricaParto[index] : "";
			var settimane = typeof hOstetricaSett[index] === "string" ? hOstetricaSett[index] : "";
			var peso = typeof hOstetricaPeso[index] === "string" ? hOstetricaPeso[index] : "";
			var sesso = typeof hOstetricaSesso[index] === "string" ? hOstetricaSesso[index] : "";
			var allattamento = typeof hOstetricaAllatt[index] === "string" ? hOstetricaAllatt[index] : "";
			
			index++;
			var tr = "<TR>" +
			         tdGravidanzePrecedentiLabel("lblFiglio"+index, "Figlio "+index, "50px") +
	                 tdGravidanzePrecedentiInput("txtAnno"+index, anno) +
			         tdGravidanzePrecedentiInput("txtParto"+index, parto) +
			         tdGravidanzePrecedentiInput("txtSettimane"+index, settimane) +
			         tdGravidanzePrecedentiInput("txtPeso"+index, peso) +
			         tdGravidanzePrecedentiInput("txtSesso"+index, sesso) +
			         tdGravidanzePrecedentiInput("txtAllattamento"+index, allattamento) +
			         "</TR>";
			return tr;
		}
		
		table = "<DIV id=divGroupGravidanzePrecedenti>" +
		        "<TABLE class=classDataEntryTable><TBODY>" +
		        trGravidanzePrecedentiHeader();
		
		for(var i=0; i<n; i++) {
			table += trGravidanzePrecedentiAddRow(i);
		}
		
		table += "</TBODY><COLGROUP><COL></COL></COLGROUP>\n" +
		         "</TABLE></DIV>";
		
		switch (modo) {
			case 'APPEND':
				$('#divGroupGravidanzePrecedenti').remove();
				$('#groupGravidanzePrecedenti fieldset').append(table);
				break;
		}
    };
	
    this.caricaDati = function(){
		/**
		 * IDEN_RIFERIMENTO è un nuovo attributo della tabella RADSQL.NOSOLOGICI_PAZIENTE del figlio
		 * che corrisponde all'IDEN del ricovero della madre (ACCESSO = 0). In questo modo è possibile
		 * reperire le schede ANAMNESI e PARTOGRAMMA_PARTO. Se al ricovero è associato un prericovero è
		 * possibile consultare anche la scheda SETTIMANA36.
		 */
		var pBinds = new Array();
		pBinds.push(top.getRicovero("IDEN_RIFERIMENTO"));
		this.strError = "Impossibile reperire le informazioni relative al ricovero della madre.";
		var rs = WindowCartella.executeQuery("nido.xml","carica36Settimana",pBinds);
		
		switch (document.EXTERN.KEY_LEGAME.value) {
		case 'ANAMNESI_FAMILIARE_ASL2_NIDO':
			if(rs.next()){
				// Carica da 36 settimana (se non ancora compilato)
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtStaturaMadre'), rs.getString("txtStatura"), false /* non sovrascrive */);
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtCognomePadre'), rs.getString("txtCognomePadre"), false);
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtNomePadre'), rs.getString("txtNomePadre"), false);
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtDataNascitaPadre'), rs.getString("txtDataNascitaPadre"), false);
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtProf'), rs.getString("txtProf"), false);
				if ($('#hProf').val() == '') $('#hProf').val(rs.getString("hProf"));
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtStaturaPadre'), rs.getString("txtStaturaPadre"), false);
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtLuogoNasc'), rs.getString("txtLuogoNasc"), false);
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtCittad'), rs.getString("txtCittad"), false);
				if ($('#hCittad').val() == '') $('#hCittad').val(rs.getString("hCittad"));
				if ($('#hIdenCittad').val() == '') $('#hIdenCittad').val(rs.getString("hIdenCittad"));
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtRegionePadre'), rs.getString("txtRegionePadre"), false);
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtRecapito1P'), rs.getString("txtRecapito1P"), false);
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtRecapito2P'), rs.getString("txtRecapito2P"), false);
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtRecapito3P'), rs.getString("txtRecapito3P"), false);
				
				// Carica dati delle gravidanze precedenti
				hOstetricaAnno = rs.getString("hOstetricaAnno").split('@');
				hOstetricaParto = rs.getString("hOstetricaParto").split('@');
				hOstetricaSett = rs.getString("hOstetricaSett").split('@');
				hOstetricaPeso = rs.getString("hOstetricaPeso").split('@');
				hOstetricaSesso = rs.getString("hOstetricaSesso").split('@');
				hOstetricaAllatt = rs.getString("hOstetricaAllatt").split('@');
				
				this.strError = null;
			}
			
			// Carica dati dell'anagrafica della madre
			rs = WindowCartella.executeQuery("nido.xml","caricaAnagraficaMadre",pBinds);
			if(rs.next()){
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtCognomeMadre'), rs.getString("COGN"));
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtNomeMadre'), rs.getString("NOME"));
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtDataNascitaMadre'), rs.getString("DATA_NASCITA"));
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtProfessioneMadre'), rs.getString("PROFESSIONE"));
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtStaturaMadre'), rs.getString("ALTEZZA"), false /* non sovrascrive */);
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtProvenienzaMadre'), rs.getString("COMUNE_NASC"));
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtNazioneMadre'), rs.getString("CITTADINANZA"));
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtRegioneMadre'), rs.getString("REGIONE"), false /* non sovrascrive */);
				NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtRecapito1M'), rs.getString("TEL"), false /* non sovrascrive */);
				
				this.strError = null;
			}
			
			// Carica dati dell'anamnesi (ricovero)
			rs = WindowCartella.executeQuery("nido.xml","caricaAnamnesiRicovero",pBinds);
			if(rs.next()){
				// Sovrascrive i valori se non presenti nella 36 Settimana
				if (hOstetricaAnno[0] == '') hOstetricaAnno = rs.getString("hOstetricaAnno").split('@');
				if (hOstetricaParto[0] == '') hOstetricaParto = rs.getString("hOstetricaParto").split('@');
				if (hOstetricaSett[0] == '') hOstetricaSett = rs.getString("hOstetricaSett").split('@');
				if (hOstetricaPeso[0] == '') hOstetricaPeso = rs.getString("hOstetricaPeso").split('@');
				if (hOstetricaSesso[0] == '') hOstetricaSesso = rs.getString("hOstetricaSesso").split('@');
				if (hOstetricaAllatt[0] == '') hOstetricaAllatt = rs.getString("hOstetricaAllatt").split('@');
				if (typeof $('input[name=rdoGruppoSanguignoMadre]:checked').val() === "undefined") NS_FUNCTIONS.assegnaCampoRadioNonRegistrato($('input[name=rdoGruppoSanguignoMadre]'), rs.getString("rdoGruppoSanguignoMadre"));
				if (typeof $('input[name=rdoRHMadre]:checked').val() === "undefined") NS_FUNCTIONS.assegnaCampoRadioNonRegistrato($('input[name=rdoRHMadre]'), rs.getString("rdoRHMadre"));			
				
				this.strError = null;
			}
			
			break;
		case 'ANAMNESI_OSTETRICA_ASL2_NIDO':
			// Carica dati da 36 Settimana (prericovero)
			if(rs.next()){
				$('#txtRischioGravidanza').val(rs.getString("txtRischioGravidanza"));
				$('#txtIncPond').val(rs.getString("txtIncPond"));
				
				$('#txtTT').val(rs.getString("txtTT"));
				$('#txtTT2').val(rs.getString("txtTT2"));
				$('#txtRT').val(rs.getString("txtRT"));
				$('#txtRT2').val(rs.getString("txtRT2"));
				$('#txtHBsAg').val(rs.getString("txtHBsAg"));
				$('#txtHCV').val(rs.getString("txtHCV"));
				$('#txtHIV').val(rs.getString("txtHIV"));
				$('#txtTVR').val(rs.getString("txtTVR"));
				$('#txtEU').val(rs.getString("txtEU"));
				$('#txtAmn').val(rs.getString("txtAmn"));
				$('#txtBit').val(rs.getString("txtBit"));
				
				$('input[name=chkTT]').attr('checked', rs.getString("chkTT") == 'S' ? true : false);
				$('input[name=chkTT2]').attr('checked', rs.getString("chkTT2") == 'S' ? true : false);
				$('input[name=chkRT]').attr('checked', rs.getString("chkRT") == 'S' ? true : false);
				$('input[name=chkRT2]').attr('checked', rs.getString("chkRT2") == 'S' ? true : false);
				$('input[name=chkHBsAg]').attr('checked', rs.getString("chkHBsAg") == 'S' ? true : false);
				$('input[name=chkHCV]').attr('checked', rs.getString("chkHCV") == 'S' ? true : false);
				$('input[name=chkHIV]').attr('checked', rs.getString("chkHIV") == 'S' ? true : false);
				$('input[name=chkTVR]').attr('checked', rs.getString("chkTVR") == 'S' ? true : false);
				$('input[name=chkEU]').attr('checked', rs.getString("chkEU") == 'S' ? true : false);
				$('input[name=chkAmn]').attr('checked', rs.getString("chkAmn") == 'S' ? true : false);
				$('input[name=chkBit]').attr('checked', rs.getString("chkBit") == 'S' ? true : false);
				
				$('#txtUM').val(rs.getString("txtUM"));
				$('#txtDPP').val(rs.getString("txtDPP"));
				$('#txtNoteOste').val(rs.getString("txtNoteOste"));
				
				this.strError = null;
			}
			
			// Carica dati dell'anamnesi (ricovero)
			rs = WindowCartella.executeQuery("nido.xml","caricaAnamnesiRicovero",pBinds);
			if(rs.next()){
				$('input[name=rdoFumo][value='+rs.getString("rdoFumo")+']').attr('checked', true);
				$('select[name=cmbAlcol]').val(rs.getString("cmbAlcol"));
				$('input[name=rdoDroghe][value='+rs.getString("rdoDroghe")+']').attr('checked', true);
				$('#txtNoteTerapia').val(rs.getString("txtNoteTerapia"));
				$('#txtNoteRemote').val(rs.getString("txtNoteRemote"));
				
				// Sovrascrive i valori se non presenti nella 36 Settimana
				if ($('#txtRischioGravidanza').val() === '') $('#txtRischioGravidanza').val(rs.getString("txtRischioGravidanza"));
				if ($('#txtUM').val() === '') $('#txtUM').val(rs.getString("txtUM"));
				if ($('#txtDPP').val() === '') $('#txtDPP').val(rs.getString("txtDPP"));
				if ($('#txtNoteOste').val() === '') $('#txtNoteOste').val(rs.getString("txtNoteOste"));
				if (!$('input[name=chkAmn]').is(':checked')) $('input[name=chkAmn]').attr('checked', rs.getString("chkAmn") == 'S' ? true : false);
				if (!$('input[name=chkBit]').is(':checked')) $('input[name=chkBit]').attr('checked', rs.getString("chkBit") == 'S' ? true : false);
				if ($('#txtAmn').val() === '') $('#txtAmn').val(rs.getString("txtAmn"));
				if ($('#txtBit').val() === '') $('#txtBit').val(rs.getString("txtBit"));
				
				this.strError = null;
			}
			
			break;
		default:
		}
	};
	
	this.registra = function() {
		$(
			'#txtCognomeMadre, #txtNomeMadre, #txtProfessioneMadre, #txtProvenienzaMadre, #txtNazioneMadre, #txtRegioneMadre,'+
			'#txtCognomePadre, #txtNomePadre, #txtProf, #txtLuogoNasc, #txtCittad, #txtRegionePadre'
		).each(function(){
			$(this).val($(this).val().toUpperCase());
		});
		
		registra();
	};
}).apply(NEONATOLOGIA);

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
