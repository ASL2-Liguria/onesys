/**
 * File JavaScript in uso dalla scheda METal.
 * 
 * @author	gianlucab
 * @version	1.0
 * @since	2015-07-27
 */
var WindowCartella = null;
var codiciRossi = new Array('lblChkComa', 'lblChkOstrVieAeree', 'lblChkArrestoRespiratorio', 'lblChkFVTV', 'lblChkAsistolia', 'lblChkPEA');
var codiciGialli = new Array('lblChkFrequenzaRespiratoria', 'lblChkDistressRespiratorio', 'lblChkDesaturazione', 'lblChkBradicardia', 'lblChkTachicardia', 'lblChkPAO', 'lblChkPeggioramentoScore', 'lblChkCianosi', 'lblChkEmorragia', 'lblChkTemperatura');
var parametriMetal = {
	'TEMPERATURA': 'chkTemperatura',
	'FR'         : 'chkFrequenzaRespiratoria',
	'SATURAZIONE': 'chkDesaturazione',
	'BRADICARDIA': 'chkBradicardia',
	'TACHICARDIA': 'chkTachicardia',
	'ARTERIOSA'  : 'chkPAO',
	'DISTRESS'   : 'chkDistressRespiratorio'
};

$(document).ready(function(){
	try {
		window.WindowCartella = window;
		while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
			window.WindowCartella = window.WindowCartella.parent;
		}
		
		if (WindowCartella.ModalitaCartella.isReadonly(document) || 'M,I'.indexOf(baseUser.TIPO) < 0) {
			_STATO_PAGINA = 'L';
		}
	
		NS_SCHEDA_MET.init();
		NS_SCHEDA_MET.caricaDati();
		NS_SCHEDA_MET.setEvents();
	} catch (e) {
		alert(e.message);
	}
	
	try {
		WindowCartella.utilMostraBoxAttesa(false);
	} catch (e) {
		/*catch nel caso non venga aperta dalla cartella*/
	}
});

var NS_SCHEDA_MET = new Function();
(function() {
	var _this = this;
	var nRivalutazioni = 1; // Rivedibile
	var arrMinutiIntervento = new Array({'Med':0,'Inf':0});
	var cdc = "";
	var reparto = "";
	var iden_scheda = 0;
	var nRilevazioni = 1; // Parametri vitali
	
	this.salvata = false;
	
	this.init = function() {
		// Reparto assistenziale (o reparto giuridico nel caso coincidano) in cui è ricoverato il paziente
		cdc = WindowCartella.$('form[name=frmRepartoAppoggio] input[name="COD_CDC"]').val() || WindowCartella.getReparto("COD_CDC");
		reparto = WindowCartella.$('form[name=frmRepartoAppoggio] input[name="DESCR"]').val() || WindowCartella.getReparto("DESCR");
		
		switch(_STATO_PAGINA) {
		
		// Inserimento, modifica
		case 'I': case 'E':
			// Campi obbligatori
			NS_FUNCTIONS.setCampoStato('chkMedico','lblPresenti','O');
			NS_FUNCTIONS.setCampoStato('chkComa','lblMotivo','O');
			NS_FUNCTIONS.setCampoStato('chkREPNullaA','lblInterventi','O');
			NS_FUNCTIONS.setCampoStato('rdoEvoluzione','lblEvoluzione','O');
			break;
		
		// Lettura
		case 'L': default:
			var label = $("td[class=classTdLabelLink]").removeClass('classTdLabelLink').addClass('classTdLabel').find('label');
			for (var i=0,length=label.length; i<length; i++) {
				label.get(i).onclick = null;
			}
			$("#lblRegistra").parent().parent().hide();
		}
		
		// Dati della chiamata
		NS_FUNCTIONS.moveLeftField({name: 'chkInfermiere', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkOSS', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkParenti', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkAltriPresenti', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtAltriPresenti', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtChiamataNonCorretta', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		$("#lblTempi, #txtOraChiamata").parent().attr("colspan", "2");
		$("input[name=rdoProvenienza]").parent().attr("colspan", "12");
		$("#lblComposizione, #txtChiamataNonCorretta, #inValMedico1, #inValInf1").parent().attr("colspan", "14");
		$('#txtDurataMissione').parent().attr("colspan", "16");
		$('td.classTdField_O_O').css({'white-space':'nowrap','font-weight':'normal'});
		
		// Motivo della chiamata
		$('input[name=chkComa], input[name=chkArrestoRespiratorio], input[name=chkFVTV], input[name=chkPeggioramentoScore], input[name=chkCianosi]').parent().css({'width':'20%'}); 
		NS_FUNCTIONS.moveLeftField({name: 'txtCPAPTipo', colspan: 1, space: '&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtNIVTipo', colspan: 1, space: '&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtLiquidi', colspan: 1, space: '&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtDefibScariche', colspan: 1, space: '&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtPacingmA', colspan: 1, space: '<label>(mA)&nbsp;</label>'});
		NS_FUNCTIONS.moveLeftField({name: 'txtPacingHr', colspan: 1, space: '<label>&nbsp;(Hr)&nbsp;</label>'});
		NS_FUNCTIONS.moveLeftField({name: 'txtCVEJoules', colspan: 1, space: '&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtAdrenalina', colspan: 1, space: '&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtAtropina', colspan: 1, space: '&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtAmiodarone', colspan: 1, space: '&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtAltroMotivo1', colspan: 1, space: '<br/>'});
		NS_FUNCTIONS.moveLeftField({name: 'txtAltroMotivo2', colspan: 1, space: '<br/>'});
		NS_FUNCTIONS.moveLeftField({name: 'txtAltroMotivo3', colspan: 1, space: '<br/>'});
		NS_FUNCTIONS.moveLeftField({name: 'txtAltroMotivo4', colspan: 1, space: '<br/>'});
		$('div#divMotivo td').attr("colspan", "1");
		$("#chkAltroMotivo3").parent().attr("rowspan", "2");
		$("#chkCianosi").parent().attr("rowspan", "3");
		$("#chkAltroMotivo2, #chkConvulsioni, #chkPeggioramentoScore").parent().attr("rowspan", "4");
		$('#chkAltroMotivo4').parent().attr("rowspan", "4");
		
		// Codici rossi
		for (var i=0,length=codiciRossi.length; i<length; i++) {
			document.getElementById(codiciRossi[i]).parentElement.style.backgroundColor = 'red';
			document.getElementById(codiciRossi[i]).parentElement.style.color = 'white';
		}
		
		// Codici gialli
		for (var i=0,length=codiciGialli.length; i<length; i++) {
			document.getElementById(codiciGialli[i]).parentElement.style.backgroundColor = 'yellow';
		}
		
		// Interventi
		$('td.classTdLabel').css({'width':'20%'}); 
		NS_FUNCTIONS.moveLeftField({name: 'txtAltroInterventoA', colspan: 1, space: '<br/>'});
		NS_FUNCTIONS.moveLeftField({name: 'txtAltroInterventoB', colspan: 1, space: '<br/>'});
		NS_FUNCTIONS.moveLeftField({name: 'txtAltroInterventoC', colspan: 1, space: '<br/>'});
		NS_FUNCTIONS.moveLeftField({name: 'txtAltroInterventoD', colspan: 1, space: '<br/>'});
		NS_FUNCTIONS.moveLeftField({name: 'txtAltroInterventoE', colspan: 1, space: '<br/>'});
		$('input[name^=chkMET]').each(function(){
			NS_FUNCTIONS.moveLeftField({name: $(this).attr('name'), colspan: 1, space: ' '});
		});
		$('#chkREPAltroA').parent().attr("rowspan","2");
		$('#chkREPNullaA').parent().attr("rowspan","7");
		$('#chkREPAltroB').parent().attr("rowspan","2");
		$('#chkREPNullaB').parent().attr("rowspan","5");
		$('#chkREPAltroD').parent().attr("rowspan","2");
		$('#chkREPNullaD').parent().attr("rowspan","8");
		$('#chkREPAltroE').parent().attr("rowspan","2");
		$('#chkREPNullaE').parent().attr("rowspan","12");
		
		//NS_FUNCTIONS.addCounter($('#chkREPCannula,#chkMETCannula'));
		
		// Evoluzione
		NS_FUNCTIONS.moveLeftField({name: 'txtAltraEvoluzione', colspan: 15, space: '&nbsp;&nbsp;&nbsp;'});
		$('input[name=rdoEvoluzione][value=7], input[name=rdoEvoluzione][value=8], input[name=rdoEvoluzione][value=9]').before('<br/>');
		$("#btPlus1").parent().addClass("btPlus").css("width", "");
		$("#lblVuota").parent().css("width", "5%");	
		
		// Campi non editabili (sola lettura)
		$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color':'#6D6D6D','background-color': 'transparent' ,'border':'1px solid transparent'});
		
		// Textarea espandibili
		$('textarea').addClass("expand");
		
		// Pulsante Stampa (disabilitato)
		//if(!WindowCartella.ModalitaCartella.isStampabile(document)){
			document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
		//}
		
		// EXTERN
		// Iden scheda
		iden_scheda = Number($('form[name=EXTERN] input[name=IDEN_SCHEDA]').val());
		if (!isNaN(iden_scheda) && iden_scheda > 0) {
			_this.salvata = true;
		} else {
			iden_scheda = 0;
			$('form[name=EXTERN] input[name=IDEN_SCHEDA]').remove();
			$('form[name=EXTERN]').append("<input id='IDEN_SCHEDA' value='"+iden_scheda+"' name='IDEN_SCHEDA' type='hidden'/>");
		}
		
		// Tabulatore sul footer (opzionale)
		WindowCartella.CartellaPaziente.footerPagina({wnd: window, config: $('form[name=EXTERN] input[name=KEY_TABULATORE]').val()});
	};
	
	this.caricaDati = function() {
		// Rivalutazioni
		var hRivalutazioni = Number($('input[name=hRivalutazioni]').val() || '1');
		if (hRivalutazioni>1) {
			for (var i=0;i<hRivalutazioni-1; i++) {
				_this.inserisciRivalutazione();
			}
		}
		
		// Rilevazioni parametri
		var hParametri = Number($('input[name=hParametri]').val() || '1');
		if (hParametri>1) {
			for (var i=0;i<hParametri-1; i++) {
				_this.aggiungiRilevazioneParametro();
			}
		}
		
		// Rivedibile
		if($('input[name=hRivedibile]').val() == 'S') {
			$('input[name=hRivedibile]').remove();
			$('input[name=rdoEvoluzione][value=7]').hide().next().next().attr("for","hRivedibile")[0].onclick = null;
			$('input[name=rdoEvoluzione][value=7]').after($('<input type="checkbox" id="hRivedibile" name="hRivedibile" checked="checked" onclick="'+(_STATO_PAGINA == 'L' ? 'return false;' : '$(\'input[name=rdoEvoluzione][value=7]\').attr(\'checked\',this.checked);"')+'" value="S"/>'));
		}
		
		// Outreach
		if($('input[name=hCCOR]').val() == 'S') {
			$('input[name=hCCOR]').remove();
			$('input[name=rdoEvoluzione][value=8]').hide().next().next().attr("for","hCCOR")[0].onclick = null;
			$('input[name=rdoEvoluzione][value=8]').after($('<input type="checkbox" id="hCCOR" name="hCCOR" checked="checked" onclick="'+(_STATO_PAGINA == 'L' ? 'return false;' : '$(\'input[name=rdoEvoluzione][value=8]\').attr(\'checked\',this.checked);"')+'" value="S"/>'));
		}
		
		if (cdc != "" && cdc.substr(0,7) != "REP_MET") {
			$("select[name=cmbSedeChiamata]").append($('<option>', {
				value: 'REP',
				text:  reparto //'Reparto degenza'
			}));
			arrayLabelValue[$.inArray("lblSedeChiamata", arrayLabelName)] = 'SEDE DELLA CHIAMATA';
		}
		
		switch(_STATO_PAGINA) {
		
		// Dati precompilati in fase di inserimento nuova scheda
		case 'I':
			// Paziente
			document.dati.txtEtaAnni.value = getAge(clsDate.str2date(WindowCartella.getPaziente("DATA"), 'YYYYMMDD'));
			document.dati.txtSesso.value = WindowCartella.getPaziente("SESSO");
			document.dati.hRepartoAppoggioDescr.value = reparto;
			document.dati.hRepartoAppoggioCdc.value = cdc;
			
			// Personale
			switch(baseUser.TIPO) {
			case 'M':
				document.dati.inValMedico1.value = baseUser.DESCRIPTION;
				document.dati.hMed1.value = baseUser.IDEN_PER;
				break;
			case 'I':
				document.dati.inValInf1.value = baseUser.DESCRIPTION;
				document.dati.hInf1.value = baseUser.IDEN_PER;
				break;
			default:
			}
			
			// Reparto
			if (cdc != "" && cdc.substr(0,7) != "REP_MET") {
				$("select[name=cmbSedeChiamata]").val('REP');
			}
			
			// Data chiamata
			$('#txtDataChiamata').val(clsDate.getData(new Date(), "DD/MM/YYYY"));
			
			// Motivo chiamata
			var rs = WindowCartella.executeStatement("schedaMET.xml","recuperaParametriMetal",[WindowCartella.getAccesso("IDEN")], 1);
			if(rs[0]=='KO'){
				return alert(rs[1]);
			}
			if (typeof rs[2] === 'string' && rs[2] != null) { 
				var arrParam = rs[2].split(',');
				for (var i=0, length=arrParam.length; i<length; i++) {
					var key = arrParam[i];
					$('#'+parametriMetal[key]).attr("checked", true);
				}
				break;
			}
		
		default:
			
			// Caricamento dati da contenuto xml (viene conservato il reparto di appoggio originale)
			if (iden_scheda > 0) {
				var rs = WindowCartella.executeQuery("schedaMET.xml","caricaDati",[iden_scheda]);
				while(rs.next()){
					var campo = rs.getString("CAMPO");
					var valore = rs.getString("VALORE");
					switch(campo) {
					
					case 'cmbSedeChiamata':
						$('select[name='+campo+'] option[value='+valore+']').attr('selected', true);
						break;
					
					case 'hRepartoAppoggioDescr':
						reparto = valore;
						$("select[name=cmbSedeChiamata] option[value=REP]").text(reparto);
						document.getElementsByName(campo)[0].value = valore;
						break;
					
					case 'hRepartoAppoggioCdc':
						cdc = valore;
						document.getElementsByName(campo)[0].value = valore;
						break;
					
					default:
						var obj = document.getElementsByName(campo)[0];
						if (typeof obj === 'object') {
							obj.value = valore;
						}
					}
				}
			}	
		}
	};
	
	this.setEvents = function() {
		if (_STATO_PAGINA == 'L') return;
		
		$("#txtOraChiamata")
			.blur(function() {
				oraControl_onblur(document.getElementById('txtOraChiamata'));
				controlloDataOraIntervento();
			})	
			.keyup(function() {
				oraControl_onkeyup(document.getElementById('txtOraChiamata'));
			});
		
		$("#txtOraArrivo1")
			.blur(function() {
				oraControl_onblur(document.getElementById('txtOraArrivo1'));
				controlloDataOraIntervento();
			})	
			.keyup(function() {
				oraControl_onkeyup(document.getElementById('txtOraArrivo1'));
			});
		
		$("#txtOraRientro1")
			.blur(function() {
				oraControl_onblur(document.getElementById('txtOraRientro1'));
				controlloDataOraIntervento();
			})
			.keyup(function() {
				oraControl_onkeyup(document.getElementById('txtOraRientro1'));
			});
		
		$("#txtOraParametri1")
		.blur(function() {
			oraControl_onblur(document.getElementById('txtOraParametri1'));
		})
		.keyup(function() {
			oraControl_onkeyup(document.getElementById('txtOraParametri1'));
		});
		
		// Aggiunta attributo "for" per le label accanto i radio input
		$("input:radio").each(function() {
			var label = $(this).next().next();
			if (label.attr("tagName").toUpperCase() == 'LABEL') {
				var id = $(this).attr("id");
				if (id == '' || id == $(this).attr("name")) {
					id = $(this).attr("name")+$(this).val();
					$(this).attr("id", id);
				}
				label.attr("for", id);
			}
		});
		
		// Aggiunta attributo "for" per le label accanto ai check input
		$('label[name^=lblchk], label[name^=lblChk]').each(function () {
			var id = $(this).attr("name").replace(/^(lbl)(chk[\s\S]*)$/i, "$2");
			$(this).attr("for", id.charAt(0).toLowerCase() + id.slice(1));
		});
		
		// Apertura selezione del personale medico sul click della label
		$('label[name="lblMedico1"]')[0].onclick = function() {
			$('input[name="inValMedico1"], input[name="hMed1"]').val('');
			launch_scandb_link(this, {'inValMedico': 'inValMedico1', 'hMed': 'hMed1'});
		};
		
		// Apertura selezione del personale infermieristico sul click della label
		$('label[name="lblInfermiere1"]')[0].onclick = function() {
			$('input[name="inValInf1"], input[name="hInf1"]').val('');
			launch_scandb_link(this, {'inValInf': 'inValInf1', 'hInf': 'hInf1'});
		};
		
		NS_FUNCTIONS.enableDisable($('input[name="chkAltriPresenti"]:checked'), ['S'], ['txtAltriPresenti']);
		NS_FUNCTIONS.enableDisable($('input[name="rdoChiamataCorretta"]:radio:checked'), [$('#rdoChiamataCorrettaN').val()], ['txtChiamataNonCorretta']);
		NS_FUNCTIONS.enableDisable($('input[name="chkAltroMotivo1"]:checked'), ['S'], ['txtAltroMotivo1']);
		NS_FUNCTIONS.enableDisable($('input[name="chkAltroMotivo2"]:checked'), ['S'], ['txtAltroMotivo2']);
		NS_FUNCTIONS.enableDisable($('input[name="chkAltroMotivo3"]:checked'), ['S'], ['txtAltroMotivo3']);
		NS_FUNCTIONS.enableDisable($('input[name="chkAltroMotivo4"]:checked'), ['S'], ['txtAltroMotivo4']);
		NS_FUNCTIONS.enableDisable($('input[name="rdoEvoluzione"]:radio:checked'), ['7','8'], ['lblAggiungi','lblRimuovi']);
		NS_FUNCTIONS.enableDisable($('input[name="rdoEvoluzione"]:radio:checked'), [$('input[name="rdoEvoluzione"][value=9]').val()], ['txtAltraEvoluzione']);
		
		$('input[name="chkAltriPresenti"]').click(function() {
			$(this).val($(this).is(':checked') ? 'S' : 'N');
			NS_FUNCTIONS.enableDisable($('input[name="chkAltriPresenti"]'), ['S'], ['txtAltriPresenti'], true);
		});
		
		$('input[name="rdoChiamataCorretta"]:radio').click(function() {
			NS_FUNCTIONS.enableDisable($('input[name="rdoChiamataCorretta"]:radio:checked'), [$('#rdoChiamataCorrettaN').val()], ['txtChiamataNonCorretta'], true);
		});
		
		$('input[name^="chkAltroMotivo"]').click(function() {
			$(this).val($(this).is(':checked') ? 'S' : 'N');
			NS_FUNCTIONS.enableDisable($(this), ['S'], [$(this).attr("name").replace("chk","txt")], true);
		});
		
		$('#txtChiamataNonCorretta').blur(function() {
			if ($(this).val().trim() == "" && $('input[name="rdoChiamataCorretta"]:checked').val() == 'N') {
				$(this).val("").attr("disabled", "disabled");
				$('input[name="rdoChiamataCorretta"][value=S]').attr("checked", true);
			}
		});
		
		$('input[name="rdoEvoluzione"]:radio').click(function() {
			NS_FUNCTIONS.enableDisable($('input[name="rdoEvoluzione"]:radio:checked'), [$('#rdoEvoluzione9').val()], ['txtAltraEvoluzione'], true);
			NS_FUNCTIONS.enableDisable($('input[name="rdoEvoluzione"]:radio:checked'), ['7','8'], ['lblAggiungi','lblRimuovi'], true); 
		});
		$('input[name="hRivedibile"]').click(function() {
			$(this).val($(this).is(':checked') ? 'S' : 'N');
			NS_FUNCTIONS.enableDisable($(this), ['S'], ['lblAggiungi','lblRimuovi'], true);
		});
		$('input[name="hCCOR"]').click(function() {
			$(this).val($(this).is(':checked') ? 'S' : 'N');
			NS_FUNCTIONS.enableDisable($(this), ['S'], ['lblAggiungi','lblRimuovi'], true);
		});
		
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.getElementById('txtDataChiamata'));
		oDateMask.attach(document.getElementById('txtDataParametri1'));
		
		$("#txtDataChiamata, #txtDataParametri1").focus(function() {
			if ($(this).val() == '') {
				$(this).parent().find("img.datepick-trigger").first().click();
			}
		});
		
		$("textarea[class*=expand][name!=txtIndaginiEffettuate]")
		.keydown(function(e){
			var keyCode = e.which || e.keyCode;
	        // Impedisce di inserire i new line
	        if ('10,13'.indexOf(keyCode) > -1) {
	        	e.preventDefault();
	        }
		})
		.TextAreaExpander(20);
		$("textarea[name=txtIndaginiEffettuate]").TextAreaExpander(60);
		
		$("td.btPlus").click(_this.aggiungiRilevazioneParametro);
		
		if (cdc.substr(0,7) == "REP_MET") {
			$('#rdoEvoluzione7, #rdoEvoluzione8').attr("disabled", true);
			$('label[for=rdoEvoluzione7], label[for=rdoEvoluzione8], label[for=hRivedibile], label[for=hCCOR]').attr("for","").each(function(){
				$(this)[0].onclick = null;
			});
			$('input[name=hRivedibile], input[namehCCOR]').each(function(){
				$(this)[0].onclick = function(){return false;};
			});
		}
	};
	
	this.inserisciRivalutazione = function(txtDataArrivo, txtOraArrivo, inValMedico, hMed, txtDataRientro, txtOraRientro, inValInf, hInf) {
		txtDataArrivo  = typeof txtDataArrivo === 'string' ? txtDataArrivo : '';
		txtOraArrivo   = typeof txtOraArrivo === 'string' ? txtOraArrivo : '';
		inValMedico    = typeof inValMedico === 'string' ? inValMedico : '';
		hMed           = typeof hMed === 'string' ? hMed : '';
		txtDataRientro = typeof txtDataRientro === 'string' ? txtDataRientro : '';
		txtOraRientro  = typeof txtOraRientro === 'string' ? txtOraRientro : '';
		inValInf       = typeof inValInf === 'string' ? inValInf : '';
		hInf           = typeof hInf === 'string' ? hInf : '';
		
		nRivalutazioni++;
		
		$('#lblTempoArrivo').parent().parent().before(
			$('<tr>')
				.append($('<td class="classTdLabel" STATO_CAMPO="O"><label id="lblOraArrivo'+nRivalutazioni+'" name="lblOraArrivo'+nRivalutazioni+'">Ora di arrivo M.E.T.</label></td>'))
				.append($('<td class="classTdField_O_O" STATO_CAMPO="O" STATO_CAMPO_LABEL="lblOraArrivo"><input type="hidden" value="'+txtDataArrivo+'" id="txtDataArrivo'+nRivalutazioni+'" name="txtDataArrivo'+nRivalutazioni+'" STATO_CAMPO="E"/><input id="txtOraArrivo'+nRivalutazioni+'" size="10" value="'+txtOraArrivo+'" name="txtOraArrivo'+nRivalutazioni+'" STATO_CAMPO="O" STATO_CAMPO_LABEL="lblOraArrivo" length="10"/></td>'))
				.append($('<td class="classTdLabelLink" STATO_CAMPO="E"><label id="lblMedico'+nRivalutazioni+'" name="lblMedico'+nRivalutazioni+'" SCANDB_PROC="TAB_MED_GRM" SCANDB_RIC="inValMedico'+nRivalutazioni+'">Medico</label></td>'))
				.append($('<td class="classTdField" colSpan="14" STATO_CAMPO="E"><input value="'+hMed+'" type="hidden" name="hMed'+nRivalutazioni+'" STATO_CAMPO="E"/><input onblur="launch_scandb_text(this);" readonly="readonly" id="inValMedico'+nRivalutazioni+'" value="'+inValMedico+'" size="70" name="inValMedico'+nRivalutazioni+'" STATO_CAMPO="E" length="70" SCANDB_PROC="TAB_MED_GRM" SCANDB_RIC="inValMedico'+nRivalutazioni+'"/></td>'))
		).before(
			$('<tr>')
				.append($('<td class="classTdLabel" STATO_CAMPO="O"><label id="lblOraRientro'+nRivalutazioni+'" name="lblOraRientro'+nRivalutazioni+'">Ora di rientro M.E.T.</label></td>'))
				.append($('<td class="classTdField_O_O" STATO_CAMPO="O" STATO_CAMPO_LABEL="lblOraRientro"><input type="hidden" value="'+txtDataRientro+'" id="txtDataRientro'+nRivalutazioni+'" name="txtDataRientro'+nRivalutazioni+'" STATO_CAMPO="E"/><input id="txtOraRientro'+nRivalutazioni+'" size="10" value="'+txtOraRientro+'" name="txtOraRientro'+nRivalutazioni+'" STATO_CAMPO="O" STATO_CAMPO_LABEL="lblOraRientro" length="10"/></td>'))
				.append($('<td class="classTdLabelLink" STATO_CAMPO="E"><label id="lblInfermiere'+nRivalutazioni+'" name="lblInfermiere'+nRivalutazioni+'" SCANDB_PROC="TAB_INF_GRM" SCANDB_RIC="inValInf'+nRivalutazioni+'">Infermiere</label></td>'))
				.append($('<td class="classTdField" colSpan="14" STATO_CAMPO="E"><input value="'+hInf+'" type="hidden" name="hInf'+nRivalutazioni+'" STATO_CAMPO="E"/><input onblur="launch_scandb_text(this);" readonly="readonly" id="inValInf'+nRivalutazioni+'" value="'+inValInf+'" size="70" name="inValInf'+nRivalutazioni+'" STATO_CAMPO="E" length="70" SCANDB_PROC="TAB_INF_GRM" SCANDB_RIC="inValInf'+nRivalutazioni+'"/></td>'))
		);
		
		$('input[name="inValMedico'+nRivalutazioni+'"], input[name="inValInf'+nRivalutazioni+'"]').css({'color':'#6D6D6D','background-color': 'transparent' ,'border':'1px solid transparent'});
		
		// Controllo sul formato dell'ora
		$("input[name^=txtOraArrivo]")
			.blur(function() {
				oraControl_onblur(document.getElementById($(this).attr("id")));
				controlloDataOraIntervento();
			})
			.keyup(function() {
				oraControl_onkeyup(document.getElementById($(this).attr("id")));
			});
	
		$("input[name^=txtOraRientro]")
			.blur(function() {
				oraControl_onblur(document.getElementById($(this).attr("id")));
				controlloDataOraIntervento();
			})
			.keyup(function() {
				oraControl_onkeyup(document.getElementById($(this).attr("id")));
			});
		
		// Apertura selezione del personale medico sul click della label
		$('label[name="lblMedico'+nRivalutazioni+'"]')[0].onclick = function() {
			var id = $(this).attr("name").replace(/[^0-9]/g, '');
			$('input[name="inValMedico'+id+'"], input[name="hMed'+id+'"]').val('');
			launch_scandb_link(this, {'inValMedico': 'inValMedico'+id, 'hMed': 'hMed'+id});
		};
		
		// Apertura selezione del personale infermieristico sul click della label
		$('label[name="lblInfermiere'+nRivalutazioni+'"]')[0].onclick = function() {
			var id = $(this).attr("name").replace(/[^0-9]/g, '');
			$('input[name="inValInf'+id+'"], input[name="hInf'+id+'"]').val('');
			launch_scandb_link(this, {'inValInf': 'inValInf'+id, 'hInf': 'hInf'+id});
		};
		
		if ('I,E'.indexOf(_STATO_PAGINA) > 0) {
			// Personale
			switch(baseUser.TIPO) {
			case 'M':
				$('input[name=inValMedico'+nRivalutazioni+']').val(baseUser.DESCRIPTION);
				$('input[name=hMed'+nRivalutazioni+']').val(baseUser.IDEN_PER);
				break;
			case 'I':
				$('input[name=inValInf'+nRivalutazioni+']').val(baseUser.DESCRIPTION);
				$('input[name=hInf'+nRivalutazioni+']').val(baseUser.IDEN_PER);
				break;
			default:
			}
		}
	};
	
	this.rimuoviRivalutazione = function() {
		if(nRivalutazioni < 2) {
			alert("La prima valutazione non è eliminabile.");
			return;
		}
		if (!confirm(
			'Eliminare l\'ultima rivalutazione?\n\n'+
			ritornaJsMsg('lblOraArrivo1')+'\t'+$('#txtOraArrivo'+nRivalutazioni).val()+'\n'+
			ritornaJsMsg('lblOraRientro1')+'\t'+$('#txtOraRientro'+nRivalutazioni).val()
		)) {
			return;
		}
		
		// Rimuove l'ultima rivalutazione
		$('#txtOraArrivo'+nRivalutazioni+', #txtOraRientro'+nRivalutazioni).parent().parent().remove();
		nRivalutazioni--;
		
		// Aggiorna i contatori
		controlloDataOraIntervento();
	};
	
	this.getRivalutazioni = function() {
		return nRivalutazioni;
	};
	
	this.aggiungiRilevazioneParametro = function() {
		if ($('#divEvoluzione table tr').last().filter(function(){
				var data = $(this).find("input[name^=txtDataParametri]").val();
				var ora = $(this).find("input[name^=txtOraParametri]").val();
				return (data == '' || ora == '');
			}).length > 0) {
			alert('Inserire la data e l\'ora della rilevazione.');
			return;
		}
		
		nRilevazioni++;
		
		$("td.btMinus").removeClass("btMinus").each(function(){
			$(this)[0].onclick = null;
		});
			
		$('#divEvoluzione table tr').last().after(
			$('<tr>')
				.append($('<TD class="classTdLabel btMinus" STATO_CAMPO="E"><LABEL id="btPlus'+nRilevazioni+'" name="btPlus'+nRilevazioni+'">&nbsp;</LABEL></TD>'))
				.append($('<TD class="classTdField" STATO_CAMPO="E"><INPUT id="txtDataParametri'+nRilevazioni+'" maxLength="10" size="10" name="txtDataParametri'+nRilevazioni+'" STATO_CAMPO="E" length="10" max_length="10"></TD>'))
				.append($('<TD class="classTdField" STATO_CAMPO="E"><INPUT id="txtOraParametri'+nRilevazioni+'" size="10" name="txtOraParametri'+nRilevazioni+'" STATO_CAMPO="E" length="10"/></TD>'))
				.append($('<TD class="classTdField" STATO_CAMPO="E"><INPUT id="txtFC'+nRilevazioni+'" name="txtFC'+nRilevazioni+'" STATO_CAMPO="E"/></TD>'))
				.append($('<TD class="classTdField" STATO_CAMPO="E"><INPUT id="txtPAS'+nRilevazioni+'" name="txtPAS'+nRilevazioni+'" STATO_CAMPO="E"/></TD>'))
				.append($('<TD class="classTdField" STATO_CAMPO="E"><INPUT id="txtPAD'+nRilevazioni+'" name="txtPAD'+nRilevazioni+'" STATO_CAMPO="E"/></TD>'))
				.append($('<TD class="classTdField" colSpan="9" STATO_CAMPO="E"><INPUT id="txtSPO'+nRilevazioni+'" name="txtSPO'+nRilevazioni+'" STATO_CAMPO="E"/></TD>'))
		);
		
		// Eventi
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.getElementById("txtDataParametri"+nRilevazioni));
		
		jQuery("#txtDataParametri"+nRilevazioni)
		.datepick({
			onClose: function(){jQuery(this).focus();}, 
			showOnFocus: false,  
			showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'
		})
		.focus(function() {
			if ($(this).val() == '') {
				$(this).parent().find("img.datepick-trigger").first().click();
			}
		});
		
		$("td.btMinus")[0].onclick = _this.rimuoviRilevazioneParametro;
		
		$("input[name^=txtOraParametri]")
			.blur(function() {
				oraControl_onblur(document.getElementById($(this).attr("id")));
			})
			.keyup(function() {
				oraControl_onkeyup(document.getElementById($(this).attr("id")));
			});
	};
	
	this.rimuoviRilevazioneParametro = function() {
		if(nRilevazioni < 2) {
			alert("La prima rilevazione non è eliminabile.");
			return;
		}
		
		if (!confirm('Eliminare la rilevazione?')) {
			return;
		}
			
		// Rimuove l'ultima rilevazione
		$('#txtDataParametri'+nRilevazioni).parent().parent().remove();
		nRilevazioni--;
		
		if (nRilevazioni > 1) {
			$('#divEvoluzione table tr').last().find('td').first().addClass("btMinus").click(_this.rimuoviRilevazioneParametro);
		}
	};
	
	this.getRilevazioniParametro = function() {
		return nRilevazioni;
	};
	
	this.registra = function() {
		// Controllo data e ora degli interventi
		try {
			controlloDataOraIntervento(true);
		} catch(e) {
			alert(e.message);
			return;
		}

		var nMinutiMedico     = 0;
		var nMinutiInfermiere = 0;
		for (var i=0, length=arrMinutiIntervento.length; i<length; i++) {
			if (arrMinutiIntervento[i].Med + arrMinutiIntervento[i].Inf == 0 || length != nRivalutazioni) {
				alert('Specificare il nome di almeno un medico o un infermiere per ogni intervento.');
				return;
			}
			nMinutiMedico += arrMinutiIntervento[i].Med;
			nMinutiInfermiere += arrMinutiIntervento[i].Inf;
		}
		
		// Popolamento campi nascosti
		$('input[name=hSedeChiamata]').val($('select[name=cmbSedeChiamata] option:selected').text());
		$('input[name=hRepartoCdc]').val(WindowCartella.getReparto("COD_CDC") || ""); // reparto giuridico
		$('input[name=hRepartoDescr]').val(WindowCartella.getReparto("DESCR") || "");
		$('input[name=hRivalutazioni]').val(_this.getRivalutazioni());
		$('input[name=hParametri]').val(_this.getRilevazioniParametro());
		$('input[name=txtMinutiInterventoMed]').val(nMinutiMedico);
		$('input[name=txtMinutiInterventoInf]').val(nMinutiInfermiere);

		// Rivedibile
		if($('input[name=hRivedibile]').val() != 'S') {
			$('input[name=hRivedibile]').val($('input#rdoEvoluzione7').is(':checked') ? 'S' : 'N');
		}

		// Outreach
		if($('input[name=hCCOR]').val() != 'S') {
			$('input[name=hCCOR]').val($('input#rdoEvoluzione8').is(':checked') ? 'S' : 'N');
		}
		
		if (($('input#rdoEvoluzione7').is(':checked') || $('input[type=checkbox][name=hRivedibile]').is(':checked')) &&
			($('input#rdoEvoluzione8').is(':checked') || $('input[type=checkbox][name=hCCOR]').is(':checked'))) {
			alert('Le evoluzioni:\n- Rivedibile\n- Inserito in Outreach C. Care\nnon possono essere selezionate contemporaneamente.');
			return;
		}
		
		var nCodiciRossi = 0;
		var nCodiciGialli = 0;
		for (var i=0,length=codiciRossi.length; i<length; i++) {
			var id = $('#'+codiciRossi[i]).attr("for");
			nCodiciRossi += $('#'+id).is(':checked') ? 1 : 0;
		}
		for (var i=0,length=codiciGialli.length; i<length; i++) {
			var id = $('#'+codiciGialli[i]).attr("for");
			nCodiciGialli += $('#'+id).is(':checked') ? 1 : 0;
		}
		$('input[name=hCodiciRossi]').val(nCodiciRossi);
		$('input[name=hCodiciGialli]').val(nCodiciGialli);
		
		// Controlla che sia spuntata almeno una voce del campo 'Presenti sul posto'.
		if ($('#chkMedico, #chkInfermiere, #chkOSS, #chkParenti, #chkAstanti, #chkAltriPresenti').filter(':checked').length > 0) {
			$('input[name=chkMedico]').val('S');
		} else {
			$('input[name=chkMedico]').val('');
		}
		// Controlla che sia spuntata almeno una voce della sezione 'Motivo della chiamata'
		if ($('div#divMotivo input[type=checkbox]').filter(':checked').length > 0) {
			$('input[name=chkComa]').val('S');
		} else {
			$('input[name=chkComa]').val('');
		}
		// Controlla che sia spuntata almeno una voce della sezione 'Interventi'
		if ($('div#divInterventi input[type=checkbox]').filter(':checked').length > 0) {
			$('input[name=chkREPNullaA]').val('S');
		} else {
			$('input[name=chkREPNullaA]').val('');
		}
		
		// Salvataggio dei campi
		registra();
		
		// Ripristino i valori di default
		$('input[name=chkMedico]').val('');
		$('input[name=chkComa]').val('');
		$('input[name=chkREPNullaA]').val('');
	};
	
	this.okRegistra = function() {
		switch(_STATO_PAGINA) {
		case 'I':
			// Cancellazione dei parametri che hanno generato la chiamata
			eliminaParametriMetal();
			
			// Recupero iden scheda
			rs = WindowCartella.executeQuery("schedaMET.xml","getIdenScheda",[WindowCartella.getRicovero("IDEN")]);
			if(rs.next()){
				_this.salvata = true;
				iden_scheda = Number(rs.getString("IDEN"));
				//_this.apriSchedaMET();
				_this.apriDiarioMET();
				return;
			}
			break;
		case 'E':
			// Cancellazione dei parametri che hanno generato la chiamata
			eliminaParametriMetal();
			break;
		default:
		}
	};
	
	this.stampa = function() {
		try {
			var vDati 		= WindowCartella.getForm();
			var funzione	= document.EXTERN.FUNZIONE.value;
			var reparto		= vDati.reparto;
			var anteprima	= 'S';
			var sf			= '&prompt<pIden>='+iden_scheda;
			WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,WindowCartella.basePC.PRINTERNAME_REF_CLIENT);		
		} catch(e) {
			window.alert(e.message);
		}
	};
	
	this.apriSchedaMET = function() {
		WindowCartella.apriScheda(
			'SCHEDA_MET',
			'Scheda M.E.T.al',
			{
				key_legame:'SCHEDA_MET',
				LETTURA:'N',
				MODIFICA:'S',
				IDEN_SCHEDA:iden_scheda,
				KEY_TABULATORE:'SCHEDA_MET.tabulatore'
			},
			{
		    	RefreshFunction: WindowCartella.progettoMetal,
		    	InfoRegistrazione: false
		    }
		);
	};
	
	this.apriDiarioMET = function() {
		if(!_this.salvata){
			alert('Prima di inserire una nota di diario registrare la scheda corrente.');
		} else {
			var CCOR = $('#rdoEvoluzione8').is(':checked') || $('#hCCOR').is(':checked') || false;
			var options = {
				IDEN_SCHEDA_MET: iden_scheda,
				KEY_TABULATORE: CCOR ? 'DIARI.tabulatore2' : 'DIARI.tabulatore1' 
			};
			var readonly = String($('form[name=EXTERN] input[name=LETTURA]').val()) == 'S';
			if (readonly) {
				options['CONTEXT_MENU'] = 'LETTURA';
			}
			WindowCartella.apriDiarioMET("", null, options);
		}
	};
	
	/**
	 * Controlla la correttezza dei tempi di ogni intervento.
	 */
	function controlloDataOraIntervento(showErrors) {
		showErrors = showErrors === true ? true : false;

		// Azzera i contatori
		$('#txtTempoArrivo, #txtDurataMissione').val("");
		
		// Data e ora chiamata
		var dataOraChiamata = clsDate.str2date($("#txtDataChiamata").val(), "DD/MM/YYYY", $("#txtOraChiamata").val());
		if ($("#txtOraChiamata").val() == '' || isNaN(dataOraChiamata.getTime())) {
			if (showErrors)
				throw new Error("Inserire data e ora della chiamata.");
			return;
		}
		
		// Durate parziali intervento
		arrMinutiIntervento = [];
		
		// Durata missione (in minuti)
		var durataMissione = 0;
		
		var arrDataOraArrivo  = [];
		var arrDataOraRientro = [];
		for (var i=0,n=1; i<nRivalutazioni; i++,n=(i+1)) {
			// Data e ora arrivo
			if ($("#txtOraArrivo"+n).val() == '') {
				if (showErrors)
					throw new Error("Inserire l'ora di arrivo.");
				return;
			}
			if (i==0) {
				arrDataOraArrivo[i] = clsDate.str2date($("#txtDataChiamata").val(), "DD/MM/YYYY", $("#txtOraArrivo"+n).val());
				if (arrDataOraArrivo[i].getTime() < dataOraChiamata.getTime()) {
					arrDataOraArrivo[i] = clsDate.dateAdd(arrDataOraArrivo[i], 'h', +24);
				}
				
				// Tenpo di arrivo (in minuti)
				var tempoArrivo = Math.floor((arrDataOraArrivo[i].getTime() - dataOraChiamata.getTime())/60000);
				var hh = ('0'+Math.floor(tempoArrivo/60)).slice(-2);
				var mm = ('0'+(tempoArrivo%60)).slice(-2);
				$('#txtTempoArrivo').val(hh+':'+mm);
				$('input[name=hTempoArrivo]').val(tempoArrivo);
			} else {
				arrDataOraArrivo[i] = clsDate.str2date(clsDate.getData(arrDataOraRientro[i-1],'DD/MM/YYYY'), "DD/MM/YYYY", $("#txtOraArrivo"+n).val());
				if (arrDataOraArrivo[i].getTime() < arrDataOraRientro[i-1].getTime()) {
					arrDataOraArrivo[i] = clsDate.dateAdd(arrDataOraArrivo[i], 'h', +24);
				}
			}
			$('input[type=hidden][name=txtDataArrivo'+n+']').val(clsDate.getData(arrDataOraArrivo[i],'DD/MM/YYYY'));
			
			// Data e ora rientro
			if ($("#txtOraRientro"+n).val() == '') {
				if (showErrors)
					throw new Error("Inserire l'ora di rientro.");
				return;
			}		
			arrDataOraRientro[i] = clsDate.str2date(clsDate.getData(arrDataOraArrivo[i],'DD/MM/YYYY'), "DD/MM/YYYY", $("#txtOraRientro"+n).val());			
			if (arrDataOraRientro[i].getTime() < arrDataOraArrivo[i].getTime()) {
				arrDataOraRientro[i] = clsDate.dateAdd(arrDataOraRientro[i], 'h', +24);
			}
			// Data e ora rientro
			if (arrDataOraRientro[i].getTime() <= arrDataOraArrivo[i].getTime()) {
				if (showErrors)
					throw new Error("Inserire un'ora di rientro successiva all'ora di arrivo.");
				return;
			}
			$('input[type=hidden][name=txtDataRientro'+n+']').val(clsDate.getData(arrDataOraRientro[i],'DD/MM/YYYY'));
			
			// Durata intervento (in minuti)
			arrMinutiIntervento[i] = {'Med':0,'Inf':0};
			if ($('input[name=inValMedico'+n+']').val() != '' && $('input[name=hMed'+n+']').val() != '') {
				arrMinutiIntervento[i].Med = Math.floor((arrDataOraRientro[i].getTime()-arrDataOraArrivo[i].getTime())/60000);
			}
			if ($('input[name=inValInf'+n+']').val() != '' && $('input[name=hInf'+n+']').val() != '') {
				arrMinutiIntervento[i].Inf = Math.floor((arrDataOraRientro[i].getTime()-arrDataOraArrivo[i].getTime())/60000);
			}
			
			// Durata missione (in minuti)
			durataMissione += Math.floor((arrDataOraRientro[i].getTime() - arrDataOraArrivo[i].getTime())/60000);
			var hh = ('0'+Math.floor(durataMissione/60)).slice(-2);
			var mm = ('0'+(durataMissione%60)).slice(-2);
			$('#txtDurataMissione').val(hh+':'+mm);
			$('input[name=hDurataMissione]').val(durataMissione);
		}
	}
	
	/**
	 * Elimina i record su TAB_AVVERTENZE nel caso in cui l'evoluzione non sia Rivedibile o Outreach C. Care.
	 */
	function eliminaParametriMetal() {
		if ($('input#rdoEvoluzione7').is(':checked') || $('input#rdoEvoluzione8').is(':checked')) {
			return;
		}
		
		var rs = WindowCartella.executeStatement("schedaMET.xml","eliminaParametriMetal",[WindowCartella.getAccesso("IDEN")], 0);
		if(rs[0]=='KO'){
			return alert(rs[1]);
		}
	}
}).apply(NS_SCHEDA_MET);

function getAge(birthDate) {
    var today = new Date();
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
