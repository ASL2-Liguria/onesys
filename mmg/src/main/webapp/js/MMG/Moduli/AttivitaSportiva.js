$(document).ready(function()
{

	ATTIVITA_SPORTIVA.init();
	ATTIVITA_SPORTIVA.setEvents();

	NS_FENIX_SCHEDA.beforeSave = ATTIVITA_SPORTIVA.beforeSave;
	NS_FENIX_SCHEDA.successSave = ATTIVITA_SPORTIVA.successSave;
	
});

var ATTIVITA_SPORTIVA = 
{
	vFormato:'A4',
	
	daStampare:false,

	init: function()
	{
		
		ATTIVITA_SPORTIVA.riepilogo		= $('#riepilogo');
		ATTIVITA_SPORTIVA.mioAssistito	= $('#radMioAssistito').data('RadioBox');
		ATTIVITA_SPORTIVA.ECG			= $('#radECG').data('RadioBox');
		ATTIVITA_SPORTIVA.scopoLudico	= $('#radScopoLudico').data('RadioBox');
		ATTIVITA_SPORTIVA.dataECG		= $("#txtDataECG, #lblDataECG");
		
		$('#fldDatiPaziente').find(':input').attr('readOnly', true);
		
		ATTIVITA_SPORTIVA.loadPatientData();
		
		$(".butSalva").removeClass("butVerde");
		$(".butStampa").addClass("butVerde");
		
		ATTIVITA_SPORTIVA.dataECG.hide();
	},
	
	setEvents: function(){
		
		$('#h-radMioAssistito, #h-radECG, #h-radScopoLudico').on('change', ATTIVITA_SPORTIVA.updateSummary );
		
		$(".butStampa").on("click", function(){
			ATTIVITA_SPORTIVA.auxStampa();
		});
		
		$("#txtDataECG").on("change", function(){
			ATTIVITA_SPORTIVA.updateSummary();
		});
	},
	
	loadPatientData: function(){
			
		toolKitDB.getResult('MMG_DATI.DATI_PAZIENTE', { 'iden_anag' : home.ASSISTITO.IDEN_ANAG }, null,
			function( response ){
				
				if( response.length > 0 ){
					var paziente = response[0];
					$('#txtCognome').val( paziente['COGN'] );
					$('#txtNome').val( paziente['NOME'] );
					$('#txtDataNascita').val( paziente['DATA_NASCITA'] );
					$('#txtLuogoNascita').val( paziente['COMUNE_NASC'] );
					ATTIVITA_SPORTIVA.updateSummary();
				}
			}
		);
	},
	
	updateSummary: function(){
		
		ATTIVITA_SPORTIVA.riepilogo.empty().html( ATTIVITA_SPORTIVA.getSummary() );
		
		
		
		if($("#h-radECG").val()=='S'){
			ATTIVITA_SPORTIVA.dataECG.show();
		}else{
			ATTIVITA_SPORTIVA.dataECG.hide();
		}
	},
	
	getSummary: function(){
		
		var	cognome			= $('#txtCognome').val();
		var	nome			= $('#txtNome').val();
		var	data_nascita	= $('#txtDataNascita').val();
		var	luogo_nascita	= $('#txtLuogoNascita').val();
		var	data_ecg		= $("#txtDataECG").val();
		var	mio_assistito	= ATTIVITA_SPORTIVA.mioAssistito.val();
		var	ecg				= ATTIVITA_SPORTIVA.ECG.val();
		var	scopo_ludico	= ATTIVITA_SPORTIVA.scopoLudico.val();
		
		var summary  = 'Si certifica che il Sig./Sig.ra <strong>'+ cognome + ' '+ nome + '</strong> nato/a il <strong>'+ data_nascita + '</strong> a <strong>'+ luogo_nascita + '</strong>, ';
		summary += mio_assistito == 'S' ? '<strong>mio assistito</strong> , ' : '';
		summary += 'da me visitato/a in data odierna, in base all\'anamnesi e alla documentazione clinica in mio possesso ';
		summary += ecg == 'S' ? 'e all\'<strong>ECG</strong> effettuato in data ' + data_ecg + ' '  : '';
		summary += 'e\' da considerarsi attualmente idoneo alla pratica sportiva non agonistica ';
		summary += scopo_ludico == 'S' ? '<strong>a scopo ludico/riabilitativo</strong> ' : '';
		
		return summary;
	},
	
	beforeSave: function(){
		
		var val =  home.NS_MMG_UTILITY.replaceAll('<strong>', '', ATTIVITA_SPORTIVA.getSummary());
		val = home.NS_MMG_UTILITY.replaceAll('</strong>', '', val);
		$('#hTesto').val( val ) ;
				
		return true;
	},
	
	successSave:function(pIden){
		
		if ( ATTIVITA_SPORTIVA.daStampare ){
			ATTIVITA_SPORTIVA.stampa(pIden, ATTIVITA_SPORTIVA.vFormato);
		}
		
		NS_FENIX_SCHEDA.chiudi();
	},
	
	auxStampa:function(){
		
		home.$.dialog(traduzione.lblDialogFormato, {
			'title' 			: traduzione.titleFormato,
			'ESCandClose'		: true,
			'created'			: function(){ $('.dialog').focus(); },
			'movable' 			: true,
			'buttons' : [
					{
						label : traduzione.lblA4,
						action : function() {
							ATTIVITA_SPORTIVA.vFormato = 'A4';
							ATTIVITA_SPORTIVA.daStampare = true;
							NS_FENIX_SCHEDA.registra();
							home.$.dialog.hide();
						}
					}, {
						label : traduzione.lblA5,
						action : function() {
							ATTIVITA_SPORTIVA.vFormato = 'A5';
							ATTIVITA_SPORTIVA.daStampare = true;
							NS_FENIX_SCHEDA.registra();
							home.$.dialog.hide();
						}
					}, {
						label : traduzione.lblAnnulla,
						action : function() {
							home.$.dialog.hide();
						}
					}]
		});
		
	},

	stampa: function(pIden, formato){
		
		var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
		var v_report;
		var v_opzioni;
		
		if(formato=='A4'){
			v_report = 'ATTIVITA_SPORTIVA_A4.RPT';
			v_opzioni = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_DEFAULT_A4;
		}else{
			v_report = 'ATTIVITA_SPORTIVA_A5.RPT';
			v_opzioni = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_DEFAULT_A5;
		}
		
		var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR};
		
		home.NS_PRINT.print({
			path_report: v_report + "&t=" + new Date().getTime(),
			prompts: prompts,
			show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
			output: "pdf"
		});
		
		ATTIVITA_SPORTIVA.daStampare = false;
	}		

};