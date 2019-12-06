var WindowCartella = null;

jQuery(document).ready(function() {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }

    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }

    try {
        TRIAGE_OSTETRICO.init();
        TRIAGE_OSTETRICO.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
});


var TRIAGE_OSTETRICO = {
    init: function() {
        
        // gianlucab
    	// Aggiunta attributo "for" per le label accanto i radio input
    	$("input:radio").each(function() {
    		var label = $(this).next().next();
    		if (label.attr("tagName").toUpperCase() == 'LABEL') {
    			var idname = $(this).attr('name') + '_' + $(this).val();
    			$(this).attr("id", idname);
        		label.attr("for", idname);
    		}
        });
    	
        // Aggiunta attributo "for" per le label accanto ai check input
        $('label[name^=lblchk]').each(function () {
        	var idname = $(this).attr("name").replace(/^(lbl)(chk[\s\S]*)$/, "$2");
        	$(this).attr("for", idname);
        });
              
        // Se trova valorizzati i vecchi campi cmbCollo e cmbLivelloPP, seleziona i radio corrispondenti
        try {
            //var arrCmbCollo     = new Array('--nessuna selezione--', 'chkColloAppianato', 'chkColloRaccorciato23', 'chkColloRaccorciato13', 'chkColloConservato', 'chkColloCentralizzato', 'chkColloInViaDiCentr', 'chkColloPosteriore', 'chkColloMorbido', 'chkColloRigido');
            //var arrCmbLivelloPP = new Array('--nessuna selezione--', 'chkLivelloPPExtrapelvica', 'chkLivelloPPAltaEMobile', 'chkLivelloPPRespingibile', 'chkLivelloPPAdagiata', 'chkLivelloPPTendente', 'chkLivelloPPImpegnata');
            
            var i = parseInt($('#cmbCollo').val());     $('input[name=radCollo1][value='+(isNaN(i)?'':i)+']').attr('checked', true);
            var j = parseInt($('#cmbLivelloPP').val()); $('input[name=radLivelloPP][value='+(isNaN(j)?'':j)+']').attr('checked', true);
        	
            $('#cmbCollo').val('');     $('#cmbCollo').remove();
            $('#cmbLivelloPP').val(''); $('#cmbLivelloPP').remove();
        } catch (e) {
            //alert(e.message);
        }
        
        //NS_FUNCTIONS.addInputText('groupGenerale', '&nbsp;&nbsp;&nbsp;<INPUT id="txtPresentazione" name="txtPresentazione" STATO_CAMPO="E">', '7|1|0', 'select');
        //NS_FUNCTIONS.addInputText('groupGenerale', '&nbsp;&nbsp;&nbsp;<INPUT id="txtPatMatNot" name="txtPatMatNot" STATO_CAMPO="E">', '5|1|0', 'input');
        //NS_FUNCTIONS.addInputText('groupGenerale', '&nbsp;&nbsp;&nbsp;<INPUT id="txtPatFetNot" name="txtPatFetNot" STATO_CAMPO="E">', '5|3|0', 'input');
        NS_FUNCTIONS.moveLeftField({name: 'txtEsaEmaNor', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
        NS_FUNCTIONS.moveLeftField({name: 'txtTamponeVG', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
        
        NS_FUNCTIONS.moveLeftField({name: 'txtPresentazione', colspan: 20, space: '&nbsp;&nbsp;&nbsp;'});
        NS_FUNCTIONS.moveLeftField({name: 'txtPatMatNot', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
        NS_FUNCTIONS.moveLeftField({name: 'txtPatFetNot', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
        
        $('#lblCollo').parent().attr('rowspan', 3);
        $('input[name=radProfilassiAB]:radio').parent().attr('colspan', 20);
        $('#txtDilatazione').parent().attr('colspan', 20);
        $('input[name=radCTG]:radio').parent().attr('colspan', 20);
		   	       
        //NS_FUNCTIONS.enableDisable($('input[name="radPresentazione"]:radio:checked'), [1], ['txtPresentazione']);
        NS_FUNCTIONS.enableDisable($('select[name="cmbPresentazione"]'), [2], ['txtPresentazione']);
        NS_FUNCTIONS.enableDisable($('input[name="radPatMatNot"]:radio:checked'), [$('input[name=radPatMatNot]:radio').val()], ['txtPatMatNot']);
        NS_FUNCTIONS.enableDisable($('input[name="radPatFetNot"]:radio:checked'), [$('input[name=radPatFetNot]:radio').val()], ['txtPatFetNot']);
        NS_FUNCTIONS.enableDisable($('select[name="cmbMembrane"]'), [2], ['txtMembraneData', 'txtMembraneOra']);
        NS_FUNCTIONS.showHideCalendar('txtMembraneData', $('select[name="cmbMembrane"]').val() == '2' ? true : false);
        
      /*  var actualDate = new Date();
        $('#txtDataVisita').val(WindowCartella.clsDate.getData(actualDate, "DD/MM/YYYY"));
        $('#txtOraVisita').val(WindowCartella.clsDate.getOra(actualDate));   */
        
        if (baseUser.TIPO!='M'){
        	$("#lblconvalidato").parent().parent().hide();
        }
        
        NS_FUNCTIONS.controlloData('txtUM');
        NS_FUNCTIONS.controlloData('txtEPP');
        NS_FUNCTIONS.controlloData('txtDataVisita');
        NS_FUNCTIONS.controlloData('txtMembraneData');
		$("#txtOraVisita").blur(function(){ oraControl_onblur(document.getElementById('txtOraVisita')); });
		$("#txtOraVisita").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraVisita')); });
		$("#txtMembraneOra").blur(function(){ oraControl_onblur(document.getElementById('txtMembraneOra')); });
		$("#txtMembraneOra").keyup(function(){ oraControl_onkeyup(document.getElementById('txtMembraneOra')); });
		
        
	//	TRIAGE_OSTETRICO.getRischio();
	       
        $('#txtUM').focusout(function() {
            $(this).val() != null && $(this).val() != '' ? $('#txtEPP').val(TRIAGE_OSTETRICO.setDPP($(this).val())): $('#txtEPP').val('');
            $(this).val() != null && $(this).val() != '' ? $('#txtSettGest').val(TRIAGE_OSTETRICO.setSettimane($(this).val())): $('#txtSettGest').val('');
        });
        
       if (baseUser.TIPO!='M'){ 
        $("input[name='radDiaIng'],#txtDiaIng").attr('disabled',true);
       }
       
       baseUser.TIPO == 'M' ? $("#lblconvalidato").parent().parent().show() : $("#lblconvalidato").parent().parent().hide();
       $('#hConvalidato').val() != 'S' ? $("#lblstampa").parent().parent().hide() : $("#lblstampa").parent().parent().show();
       $('#hConvalidato').val() == 'S' && baseUser.TIPO == 'OST' ? $("#lblregistra").parent().parent().hide() : $("#lblregistra").parent().parent().show();
    },
    setEvents: function() {
        /*$('input[name="radPresentazione"]:radio').change(function() {
            NS_FUNCTIONS.enableDisable($('input[name="radPresentazione"]:radio:checked'), [1], ['txtPresentazione'], true);
        });*/
        $('select[name="cmbPresentazione"]').change(function() {
            NS_FUNCTIONS.enableDisable($('select[name="cmbPresentazione"]'), [2], ['txtPresentazione'], true);
        });
        $('input[name="radPatMatNot"]:radio').click(function() {
            NS_FUNCTIONS.enableDisable($('input[name="radPatMatNot"]:radio:checked'), [$('input[name=radPatMatNot]:radio').val()], ['txtPatMatNot'], true);
        });
        $('input[name="radPatFetNot"]:radio').click(function() {
            NS_FUNCTIONS.enableDisable($('input[name="radPatFetNot"]:radio:checked'), [$('input[name=radPatFetNot]:radio').val()], ['txtPatFetNot'], true);
        });
        $('select[name="cmbMembrane"]').change(function() {
            NS_FUNCTIONS.enableDisable($('select[name="cmbMembrane"]'), [2], ['txtMembraneData', 'txtMembraneOra'], true);
            NS_FUNCTIONS.showHideCalendar('txtMembraneData', $('select[name="cmbMembrane"]').val() == '2' ? true : false);
        });
        
        $('input[name=radDiaIng]:radio').click(function() {
        	if ($(this).val() == '1' || $(this).val() == '2') {
        		$('#txtDiaIng').focus();
        	} 
        });

		var maxLength = 4000;
		var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
		jQuery('#txtDiaIng').addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
		    maxlength(this, maxLength, msg);
		});

		jQuery("textarea[class*=expand]").TextAreaExpander();
		
		if (_STATO_PAGINA == 'L'){
   		 document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
   		 document.getElementById('lblconvalidato').parentElement.parentElement.style.display = 'none';
       }
    },
    convalidatoTriage: function() {
    	$('#hConvalidato').val('S');
    	TRIAGE_OSTETRICO.registraTriage();
    	$("#lblstampa").parent().parent().show();
    },              
    registraTriage: function() {    	
    	// Controllo rischio gravidanza
    	var value = $('input[name=radDiaIng]:radio:checked').val();
    	if (value == '1' || value == '2') {
    		if ($('#txtDiaIng').val().replace(/^\s+|\s+$/, '') == '') {
    			alert('Attenzione: il campo note è obbligatorio se il rischio di gravidanza non è basso');
    			return;
    		}
    	}
    	
        NS_FUNCTIONS.records();
    },
    getRischio: function(){
		pBinds = new Array();
		pBinds.push(document.EXTERN.IDEN_VISITA.value);
		var rs = WindowCartella.executeQuery("ostetricia.xml","getRischio",pBinds);
		if(rs.next()){
			if (rs.getString("rischio")!=''){
			$("input[name='radDiaIng'][value="+rs.getString("rischio")+"]").attr('checked', true);
			}
		}
		$("input[name='radDiaIng']").attr('disabled',true);
    },
    stampaTriage: function() {
    	if ($('#hConvalidato').val()==''){
    		return alert('Stampa non consentita; la scheda non è ancora stata convalidata');
    	}
        NS_FUNCTIONS.print('TRIAGE', 'S');
    },
    setDPP: function(stringDate) {
        return WindowCartella.clsDate.dateAddStr(stringDate, "DD/MM/YYYY", "00:00", "D", "280");
    },
    setSettimane: function(stringDate) {
        var diffGiorni=WindowCartella.clsDate.difference.day(new Date(),clsDate.str2date(stringDate,'DD/MM/YYYY'));
    	var settimane = Math.floor(WindowCartella.clsDate.difference.day(new Date(),clsDate.str2date(stringDate,'DD/MM/YYYY'))/7);
    	var giorni= diffGiorni-(settimane*7);
    	return settimane +'+'+giorni;
    }
};