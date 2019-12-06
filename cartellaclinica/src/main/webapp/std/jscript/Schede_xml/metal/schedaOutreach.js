/**
 * File JavaScript in uso dalla scheda Outreach.
 * 
 * @author	darioc
 * @version	1.0
 * @since	2015-07-29
 */
var records_del='';

jQuery(document).ready(function() {
	window.WindowCartella = window;
	while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
		window.WindowCartella = window.WindowCartella.parent;
	}
	
	if (WindowCartella.ModalitaCartella.isReadonly(document) || 'M,I'.indexOf(baseUser.TIPO) < 0) {
		_STATO_PAGINA = 'L';
	}
	
	try {
		SCHEDA_OUTREACH.init();
		SCHEDA_OUTREACH.setEvents();
	} catch (e) {
		alert(e.message);
	}
	
	try{
		WindowCartella.utilMostraBoxAttesa(false);
	} catch(e) {}
});

var SCHEDA_OUTREACH = new Function();
(function() {
	var _this = this;
	
	this.init = function(){
		NS_FUNCTIONS.moveLeftField({name: 'txtReclutamento', space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtPatologia', space: '&nbsp;&nbsp;&nbsp;'});
		$('#txtReclutamento, #txtPatologia').css('width', '100%');
		
		$('textarea[name=txtDiagnosi]').addClass("expand");			   
		$("textarea[class*=expand]").TextAreaExpander(20);
		
		$('INPUT[name=rdoEta],INPUT[name=rdoFC],INPUT[name=rdoPA],INPUT[name=rdoT],INPUT[name=rdoQU],INPUT[name=rdoAzo],INPUT[name=rdoGB],INPUT[name=rdoK],INPUT[name=rdoNa],INPUT[name=rdoHCO],INPUT[name=rdoBilirubina],INPUT[name=rdoGCS],INPUT[name=rdoPAO2]').attr('disabled',true);
		

		$("#groupScala LEGEND").append('<LABEL id="lblRicarica" style="BACKGROUND:#E8E6E7;margin-left:10px">Ricarica</LABEL>');
		
		if ($('#txtEta').val() == ''){
			$('#txtEta').val(_this.calcolaEta(clsDate.str2date(WindowCartella.getPaziente("DATA"), 'YYYYMMDD')));
			_this.calcolaParametro('rdoEta', 'txtEta');
			_this.caricaParametriSaps();
		}
		
		$('#lblGCS').parent().append('<LABEL id="lblApriScala">(Scala)</LABEL>');
		$('#lblApriScala').css({'color':'black','margin-left':'10px'});
		
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.getElementById('txtDataEntrata'));
		oDateMask.attach(document.getElementById('txtDataUscita'));
		
		$("#txtDataEntrata, #txtDataUscita").focus(function() {
			if ($(this).val() == '') {
				$(this).parent().find("img.datepick-trigger").first().click();
			}
		});
		
		$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color':'#6D6D6D','background-color': 'transparent' ,'border':'1px solid transparent'});
		
		// Tabulatore sul footer (opzionale)
		WindowCartella.CartellaPaziente.footerPagina({wnd: window, config: $('form[name=EXTERN] input[name=KEY_TABULATORE]').val()});
		
		// Pulsante Stampa (disabilitato)
		//if(!WindowCartella.ModalitaCartella.isStampabile(document)){
			document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
		//}
	};
	
	this.setEvents = function(){
		switch(_STATO_PAGINA) {
			case 'I': case 'E':
			
			// Aggiunta attributo "for" per le label accanto i radio input
			NS_FUNCTIONS.addForLabel("%s");
			
			NS_FUNCTIONS.enableDisable($('input[name="rdoReclutamento"]:radio:checked'), [$('input[name=rdoReclutamento][value=3]').val()], ['txtReclutamento']);
			NS_FUNCTIONS.enableDisable($('input[name="rdoPatologia"]:radio:checked'), [$('input[name=rdoPatologia][value=5]').val()], ['txtPatologia']);
			
			$('input[name="rdoReclutamento"]:radio').click(function() {
				NS_FUNCTIONS.enableDisable($('input[name="rdoReclutamento"]:radio:checked'), [$('input[name=rdoReclutamento][value=3]').val()], ['txtReclutamento'], true); 
			});
			
			$('input[name="rdoPatologia"]:radio').click(function() {
				NS_FUNCTIONS.enableDisable($('input[name="rdoPatologia"]:radio:checked'), [$('input[name=rdoPatologia][value=5]').val()], ['txtPatologia'], true); 
			});
			
			$('#txtEta').blur(function(e) {
				_this.calcolaParametro('rdoEta',$(this).attr('id'));
			});	
			$('#txtFC').blur(function(e) {
				_this.calcolaParametro('rdoFC',$(this).attr('id'));
			});
			$('#txtPA').blur(function(e) {
				_this.calcolaParametro('rdoPA',$(this).attr('id'));
			});
			$('#txtT').blur(function(e) {
				_this.calcolaParametro('rdoT',$(this).attr('id'));
			});
			$('#txtPAO2').blur(function(e) {
				if ($(this).val() == '') { $(this).val('0'); }
				_this.calcolaParametro('rdoPAO2',$(this).attr('id'));
			});
			$('#txtQU').blur(function(e) {
				_this.calcolaParametro('rdoQU',$(this).attr('id'));
			});
			$('#txtAzo').blur(function(e) {
				_this.calcolaParametro('rdoAzo',$(this).attr('id'));
			});
			$('#txtGB').blur(function(e) {
				 $(this).val($(this).val().replace(",","."));
				_this.calcolaParametro('rdoGB',$(this).attr('id'));
			});
			$('#txtK').blur(function(e) {
				 $(this).val($(this).val().replace(",","."));
				_this.calcolaParametro('rdoK',$(this).attr('id'));
			});
			$('#txtNa').blur(function(e) {
				_this.calcolaParametro('rdoNa',$(this).attr('id'));
			});
			$('#txtHCO').blur(function(e) {
				_this.calcolaParametro('rdoHCO',$(this).attr('id'));
			});
			$('#txtBilirubina').blur(function(e) {
				 $(this).val($(this).val().replace(",","."));
				_this.calcolaParametro('rdoBilirubina',$(this).attr('id'));
			});
			$('#txtGCS').blur(function(e) {
				_this.calcolaParametro('rdoGCS',$(this).attr('id'));
			});
			 
			$('INPUT[name=rdoPAO2],INPUT[name=rdoAmm],INPUT[name=rdoCom]').click(function(e) {
				_this.calcolaTotSaps();
			});
			
			$('#lblApriScala').live('click',function(){
				_this.apriGCS();
			});
			
			$('#lblRicarica').live('click',function(){
				if(confirm("Verranno ricaricati i parametri in base alle rilevazioni delle ultime 24 ore presenti in farmacoterapia. Continuare?")){
				_this.caricaParametriSaps();
				_this.calcolaTotSaps();
				}
			});
			
			break;
			
			case 'L': default:
			$("#lblRegistra").parent().parent().hide();
		}
	};
	
	this.caricaParametriSaps = function() {
		var codiceParam;
		var valParam;
		var rs = WindowCartella.executeQuery("schedaOutreach.xml","caricaParametriSaps",[WindowCartella.getAccesso("IDEN")]);
		while(rs.next()){
			codiceParam=rs.getString("CODICE");	
			valParam=rs.getString("VALORE");
			switch (codiceParam) {
			case 'FREQUENZA':
				_this.calcolaParametro('rdoFC','txtFC', valParam);
				break;
			case 'TEMPERATURA':
				_this.calcolaParametro('rdoT','txtT', valParam);
				break;
			case 'PAO2_FIO2':
				_this.calcolaParametro('rdoPAO2','txtPAO2', valParam || '0');
				break;
			case 'ARTERIOSA':
				_this.calcolaParametro('rdoPA','txtPA', valParam);
				break;
			case 'QUICK':
				_this.calcolaParametro('rdoQU','txtQU', valParam);
				break;
			case 'AZOTEMIA':
				_this.calcolaParametro('rdoAzo','txtAzo', valParam);
				break;
			case 'GLOBULI_BIANCHI':
				_this.calcolaParametro('rdoGB','txtGB', valParam);
				break;
			case 'POTASSIEMIA':
				_this.calcolaParametro('rdoK','txtK', valParam);
				break;
			case 'SODIEMIA':
				_this.calcolaParametro('rdoNa','txtNa', valParam);
				break;
			case 'GCS':
				_this.calcolaParametro('rdoGCS','txtGCS', valParam);
				break;
			}
		}
	};
	
	this.calcolaEta = function(birthDate){
		var today = new Date();
		var age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;	
	};
	
	this.calcolaParametro = function(param, id, /* opzionale */ value){
		value = typeof value === 'string' ? value : '';
		if (value != '') {
			$('#'+id).val(value);	
		} else {
			value = $('#'+id).val().trim() || 'undefined'; 
		}

		var val = value;
		var codice = '';
		if(val=='' || isNaN(Number(val))) {
			$('INPUT[name='+param+']').attr('checked',false);
			$('#'+id).val('');
			_this.calcolaTotSaps();
			return;
		}
		val = Number(val);
		
		if(param=='rdoEta'){
		  	if(val<40){codice='0';}
		  	else if (val>=40 && val < 60) {codice='7';}
		  	else if (val>=60 && val < 70) {codice='12';}
		  	else if (val>=70 && val < 75) {codice='15';}
		  	else if (val>=75 && val < 80) {codice='16';}
		  	else if (val>=80) {codice='18';}
		}
		else if(param=='rdoFC'){
		  	if(val<40){codice='11';}
		  	else if (val>= 40 && val <  70) {codice='2';}
		  	else if (val>= 70 && val < 120) {codice='0';}
		  	else if (val>=120 && val < 160) {codice='4';}
		  	else if (val>=160) {codice='7';}
		}
		else if(param=='rdoPA'){
		  	if(val<70){codice='13';}
		  	else if (val>= 70 && val < 100) {codice='5';}
		  	else if (val>=100 && val < 200) {codice='0';}
		  	else if (val>=200) {codice='2';}
		}
		else if(param=='rdoT'){
		  	if(val<39){codice='0';}
		  	else if (val>=39) {codice='3';}
		}
		else if(param=='rdoPAO2'){
		  	if(val>0 && val<100){codice='11';}
		  	else if (val>=100 && val < 200) {codice='9';}
		  	else if (val>=200) {codice='6';}
		  	else {codice='0';}
		}
		else if(param=='rdoQU'){
		  	if(val<500){codice='11';}
		  	else if (val>=500 && val < 1000) {codice='4';}
		  	else if (val>=1000) {codice='0';}
		}
		else if(param=='rdoAzo'){
		  	if(val<60){codice='0';}
		  	else if (val>=60 && val < 180) {codice='6';}
		  	else if (val>=180) {codice='10';}
		}
		else if(param=='rdoGB'){
		  	if(val<1){codice='12';}
		  	else if (val>=1 && val < 20) {codice='0';}
		  	else if (val>=20) {codice='3';}
		}
		else if(param=='rdoK'){
		  	if(val<3){codice='3.0';}
		  	else if (val>=3 && val < 5) {codice='0';}
		  	else if (val>=5) {codice='3';}
		}
		else if(param=='rdoNa'){
		  	if(val<125){codice='5';}
		  	else if (val>=125 && val <145) {codice='0';}
		  	else if (val>=145) {codice='1';}
		}
		else if(param=='rdoHCO'){
		  	if(val<15){codice='6';}
		  	else if (val>=15 && val <20) {codice='3';}
		  	else if (val>=20) {codice='0';}
		}
		else if(param=='rdoBilirubina'){
		  	if(val<4){codice='0';}
		  	else if (val>=4 && val <6) {codice='4';}
		  	else if (val>=6) {codice='9';}
		}
		else if(param=='rdoGCS'){
		  	if(val>13){codice='0';}
		  	else if (val>=11 && val <=13) {codice='5';}
		  	else if (val>=9 && val <11) {codice='7';}
		  	else if (val>=6 && val <9) {codice='13';}
		  	else if (val<6) {codice='26';}
		}
		$('INPUT[name='+param+'][value='+codice+']').attr('checked',true);
		_this.calcolaTotSaps();
	};
	
	this.calcolaTotSaps = function(){
		var tot=0;
		var radio = $('#groupScala input:radio:checked');
		if (radio.length == 15) {
			radio.each(function(){
				tot+=parseInt($(this).val());
			});
			$('#txtTot').val(tot);
			return;
		}
		$('#txtTot').val('');
	};
			
	this.registra = function() {
		if ($('#txtTot').val() == '' && !confirm('Attenzione! Il SAPS totale non è calcolabile.\nRegistrare ugualmente la scheda?')) {
			return;
		}
		
		registra();
	};

	this.stampa = function() {
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
	};
	
	this.apriGCS = function() {
		var url = "servletGenerator?KEY_LEGAME=SCALA_GLASGOW&FUNZIONE=SCALA_GLASGOW&READONLY="+WindowCartella.ModalitaCartella.isReadonly(document)+"&IDEN_VISITA=" + WindowCartella.getRicovero("IDEN")+ "&IDEN_VISITA_REGISTRAZIONE="+ WindowCartella.getAccesso("IDEN")+"&OPEN=SCHEDA_OUTREACH";
		$.fancybox({
			'padding': 3,
			'width': $(document).width(),
			'height': 580,
			'href': url,
			'type': 'iframe'
		});
	};
	
	this.apriDiarioMET = function() {
		var options = {
			IDEN_SCHEDA_MET: document.EXTERN.IDEN_SCHEDA_MET.value,
			KEY_TABULATORE: 'DIARI.tabulatore2'
		};
		var readonly = String($('form[name=EXTERN] input[name=LETTURA]').val()) == 'S';
		if (readonly) {
			options['CONTEXT_MENU'] = 'LETTURA';
		}
		WindowCartella.apriDiarioMET("", null, options);
	};
	
	this.apriWorklistMET = function() {
		WindowCartella.progettoMetal();
	};
}).apply(SCHEDA_OUTREACH);
