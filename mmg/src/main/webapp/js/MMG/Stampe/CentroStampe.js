jQuery(document).ready(function(){
	CENTRO_STAMPE.init();
	CENTRO_STAMPE.setEvents();
	
	$('#h-radDatiAnagrafici').trigger('change');
});

var CENTRO_STAMPE = {
		
	inOut:'',

	init:function(){
		
		var $this = this;
		home.CENTRO_STAMPE = this;
		
		$this.setDefaults();
		
		$('#txtTesto').attr('contenteditable',true);
	},
	
	setDefaults: function(){
		
		if( LIB.isValid( home.ASSISTITO ) && LIB.isValid( home.ASSISTITO.IDEN_ANAG ) ){
			
			CENTRO_STAMPE.inOut = 'IN';
			$('#radVacciniAntinfluenzali, #radPIP, #radRiepilogoADI, #radRiepilogoADP, #radRiepilogoRP').closest('tr').hide();
		
		}else{

			CENTRO_STAMPE.inOut = 'OUT';
			var data = moment().format('DD/MM/YYYY'), dataISO = moment().format('YYYYMMDD');
			
			$('#li-tabLetteraAccompagnamento').hide();
			$('#fldOpzioniStampa, #fldSezioniStampabili tr').hide();
			$('#radAccertamentiPrescritti').closest('tr').hide();
			$('#radVacciniAntinfluenzali, #radPIP, #radRiepilogoADI, #radRiepilogoADP, #radRiepilogoRP, #lblTipoVaccino, #radStoricoVaccinazioni').closest('tr').show();
			$('#radTipoVaccino').closest('td').attr('colSpan','8');
				
			$('input[type=\'text\'][id$=\'DaData\']').each(function(){
				
				var id = $(this).attr('id');
				
				$(this).val( data );
				$( '#h-'+ id ).val( dataISO );
			});
		}
		
		$('#fldPaziente').find(':input').attr('readOnly', true);
		$('#radSesso').data('RadioBox').disable();
	},
	
	setEvents:function(){
	
		$(".butStampa").on('click',function(){
			CENTRO_STAMPE.checkStampa();
		});
		
		$('#h-radDatiAnagrafici').on('change', function(){

			var datiAnagrafici = $('#radDatiAnagrafici').data('RadioBox');
			
			datiAnagrafici.val() == 'S' ? $('#fldPaziente').show() : $('#fldPaziente').hide();
		});
		
	},

        pathReport: {
            intestazioneCartella: "INTESTAZIONE_CARTELLA_PAZIENTE.RPT",
            schedaAnagrafica: "ANAGRAFICA.RPT",
    //      patientSummary			: "PATIENT_SUMMARY.RPT",
            patientSummary: "PATIENT_SUMMARY_PRIVACY_V2.RPT",
            patientSummarySintesi: "PATIENT_SUMMARY_PRIVACY_SINTESI.RPT",
            vaccinoAntinfluenzale: "VACCINI_ANTINFLUENZALI.RPT",
            storicoVaccinazioni: "VACCINI_ANTINFLUENZALI_STORICO.RPT",
            storicoVaccinazioniPz: "VACCINI_ANTINFLUENZALI_STORICO_PAZIENTE.RPT",
            ppip: "PPIP.RPT",
            diari: "DIARI_PAZIENTE.RPT",
            terapieCroniche: "TERAPIE_CRONICHE.RPT",
            problemi: "PROBLEMI_ATTIVI_PAZIENTE.RPT",
            accertamentiPrescritti: "ACCERTAMENTI_PAZIENTE.RPT",
            farmaciPrescritti: "TERAPIE_PAZIENTE.RPT",
            testoAccompagnamento: "TESTO_ACCOMPAGNAMENTO.RPT",
            vaccinazioni: "VACCINI_PAZIENTE.RPT",
            rilevazioni: "RILEVAZIONI_PAZIENTE.RPT",
            riepilogo_adi: "RIEPILOGO_ADI.RPT",
            riepilogo_adp: "RIEPILOGO_ADP.RPT",
            riepilogo_rp: "RIEPILOGO_RP.RPT"
        },
	
	checkStampa:function(){
		
		var prompts='';
		var obj='';
		var arrObjStampa = new Array();
		var vDaData = '';
		var vAData = '';
		var vIdenAnag = home.ASSISTITO.IDEN_ANAG;
		var vIdenPer = home.baseUser.IDEN_PER;
		var vIdenMedPrescr = home.CARTELLA.IDEN_MED_PRESCR;
		var vReport = '';
		
		//INTESTAZIONE CARTELLA
		if( $("#h-radIntestazioneCartella").val() == 'S'){
			
			prompts = { pIdenAnag:vIdenAnag, pIdenPer:vIdenPer, pIdenMedPrescr:vIdenMedPrescr };
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.intestazioneCartella + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
			
		}
		
		//SCHEDA ANAGRAFICA
		if( $("#h-radSchedaAnagrafica").val() == 'S'){
			
			prompts = { pIdenAnag:vIdenAnag };
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.schedaAnagrafica + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
			
		}
		
		//PATIENT SUMMARY
		if( $("#h-radPatientSummary").val() == 'S'){

			prompts = {
					pIdenAnag:vIdenAnag,
					pIdenPer: home.baseUser.IDEN_PER,
					pProvenienza: "MMG"
			};
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.patientSummary + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
			
		}
		
		//PATIENT SUMMARY SINTESI
		if( $("#h-radPatientSummarySintesi").val() == 'S'){

			prompts = {
					pIdenAnag:vIdenAnag,
					pIdenPer: home.baseUser.IDEN_PER,
					pProvenienza: "MMG"
			};
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.patientSummarySintesi + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
			
		}
		
		//VACCINAZIONI ANTINFLUENZALI
		if( $("#h-radVacciniAntinfluenzali").val() == 'S'){
		
			vDaData = $("#h-txtVacciniAntinfluenzaliDaData").val() == '' ? home.ASSISTITO.DATA_NASCITA_ISO : $("#h-txtVacciniAntinfluenzaliDaData").val();
			vAData  = $("#h-txtVacciniAntinfluenzaliAData").val();
			vTipo   = $("#h-radTipoVaccino").val();
			
			prompts = {pDaData:vDaData, pAData:vAData, pIdenPer:vIdenPer, pTipoVaccino:vTipo};
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.vaccinoAntinfluenzale + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
			
		}
		
		//STORICO VACCINAZIONI
		if( $("#h-radStoricoVaccinazioni").val() == 'S'){
			
			vDaData = $("#h-txtVaccinazioniDaData").val() == '' ? home.ASSISTITO.DATA_NASCITA_ISO : $("#h-txtVaccinazioniDaData").val();
			vAData =  $("#h-txtVaccinazioniAData").val();
			vReport = CENTRO_STAMPE.inOut == 'IN' ? CENTRO_STAMPE.pathReport.storicoVaccinazioniPz : CENTRO_STAMPE.pathReport.storicoVaccinazioni ;

			prompts = {pDaData:vDaData, pAData:vAData, pIdenPer:vIdenPer, pIdenAnag:vIdenAnag};
			
			obj = {
				path_report: vReport + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
			
		}
		
		//PPIP
		if( $("#h-radPIP").val() == 'S'){
		
			vDaData = $("#h-txtPIPDaData").val() == '' ? home.ASSISTITO.DATA_NASCITA_ISO : $("#h-txtPIPDaData").val();
			vAData =  $("#h-txtPIPAData").val();
			
			prompts = {pDaData:vDaData, pAData:vAData, pIdenPer:vIdenPer};
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.ppip + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
		}
		
		
		//VACCINAZIONI
		if( $("#h-radVaccinazioni").val() == 'S'){
		
			vDaData = $("#h-txtVaccinazioniDaData").val() == '' ? home.ASSISTITO.DATA_NASCITA_ISO : $("#h-txtVaccinazioniDaData").val();
			vAData =  $("#h-txtVaccinazioniAData").val();
			
			prompts = {pDaData:vDaData, pAData:vAData, pIdenUtente:vIdenPer, pIdenMed:vIdenPer, pIdenAnag:vIdenAnag};
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.vaccinazioni + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
		}
		
		//DIARI
		if( $("#h-radDiario").val() == 'S'){
		
			vDaData = $("#h-txtDiarioDaData").val() == '' ? home.ASSISTITO.DATA_NASCITA_ISO : $("#h-txtDiarioDaData").val();
			vAData =  $("#h-txtDiarioAData").val();
			
			prompts = {pDaData:vDaData, pAData:vAData, pIdenUtente:vIdenPer, pIdenMed:vIdenPer, pIdenAnag:vIdenAnag};
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.diari + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
		}
		
		//PROBLEMI
		if( $("#h-radProblemi").val() == 'S'){
		
			vDaData = $("#h-txtProblemiDaData").val() == '' ? home.ASSISTITO.DATA_NASCITA_ISO : $("#h-txtProblemiDaData").val();
			vAData =  $("#h-txtProblemiAData").val();
			
			prompts = {pDaData:vDaData, pAData:vAData, pIdenPer:vIdenPer, pIdenAnag:vIdenAnag};
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.problemi + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
		}
		
		//ACCERTAMENTI PRESCRITTI
		if( $("#h-radAccertamentiPrescritti").val() == 'S'){
		
			vDaData = $("#h-txtAccertamentiPrescrittiDaData").val() == '' ? home.ASSISTITO.DATA_NASCITA_ISO : $("#h-txtAccertamentiPrescrittiDaData").val();
			vAData =  $("#h-txtAccertamentiPrescrittiAData").val();
			
			prompts = {pDaData:vDaData, pAData:vAData, pIdenPer:vIdenPer, pIdenAnag:vIdenAnag};
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.accertamentiPrescritti + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
		}
		
		//FARMACI PRESCRITTI
		if( $("#h-radFarmaciPrescritti").val() == 'S'){
		
			vDaData = $("#h-txtFarmaciPrescrittiDaData").val() == '' ? home.ASSISTITO.DATA_NASCITA_ISO : $("#h-txtFarmaciPrescrittiDaData").val();
			vAData =  $("#h-txtFarmaciPrescrittiAData").val();
			
			vDaData = vDaData == '' ? home.ASSISTITO.DATA_NASCITA_ISO : vDaData;
			
			prompts = {pDaData:vDaData, pAData:vAData, pIdenPer:vIdenPer, pIdenAnag:vIdenAnag, pCronicita:'N'};
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.farmaciPrescritti + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
		}
		
		//TERAPIE CRONICHE
		if( $("#h-radTerapieCroniche").val() == 'S'){

			vDaData = $("#h-txtTerapieCronicheDaData").val() == '' ? home.ASSISTITO.DATA_NASCITA_ISO : $("#h-txtTerapieCronicheDaData").val();
			vAData =  $("#h-txtTerapieCronicheAData").val();
			
			vDaData = vDaData == '' ? home.ASSISTITO.DATA_NASCITA_ISO : vDaData;
			
			prompts = {pDaData:vDaData, pAData:vAData, pIdenPer:vIdenPer, pIdenAnag:vIdenAnag};
	
			obj = {
				path_report:CENTRO_STAMPE.pathReport.terapieCroniche + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
		}
		
		//RILEVAZIONI
		if( $("#h-radRilevazioni").val() == 'S'){
		
			vDaData = $("#h-txtRilevazioniDaData").val() == '' ? home.ASSISTITO.DATA_NASCITA_ISO : $("#h-txtRilevazioniDaData").val();
			vAData =  $("#h-txtRilevazioniAData").val();
			var vTipoMed = '';
			if(home.MMG_CHECK.isPediatra()) {
				vTipoMed = 'P';
			}else{
				vTipoMed = 'B';
			}
			prompts = {pDaData:vDaData, pAData:vAData, pIdenUtente:vIdenPer, pTipoMed:vTipoMed, pIdenMed:vIdenPer, pIdenAnag:vIdenAnag};
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.rilevazioni + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
		}

		//TESTO ACCOMPAGNAMENTO
		if( $("#h-radStampaTesto").val() == 'S'){
			
			var vTesto = jQuery("#txtTesto").html();
			var vDatiAnagrafici = $("#h-radDatiAnagrafici").val();
			
			prompts = {pTesto:vTesto, pIdenPer:vIdenPer, pIdenAnag:vIdenAnag, pDatiAnagrafici:vDatiAnagrafici};
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.testoAccompagnamento + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
		}
		
		//RIEPILOGO_ADI
		if( $("#h-radRiepilogoADI").val() == 'S'){
			
			var vTesto = jQuery("#txtTesto").html();
			vDaData = $("#h-txtAdiDaData").val() == '' ? home.ASSISTITO.DATA_NASCITA_ISO : $("#h-txtAdiDaData").val();
			vAData =  $("#h-txtAdiAData").val();
			
			prompts = {pIdenPer:vIdenPer, pDaData:vDaData, pAData:vAData};
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.riepilogo_adi + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
		}
		
		//RIEPILOGO_ADP
		if( $("#h-radRiepilogoADP").val() == 'S'){
			
			var vTesto = jQuery("#txtTesto").html();
			vDaData = $("#h-txtAdpDaData").val() == '' ? home.ASSISTITO.DATA_NASCITA_ISO : $("#h-txtAdpDaData").val();
			vAData =  $("#h-txtAdpAData").val();
			
			prompts = {pIdenPer:vIdenPer, pDaData:vDaData, pAData:vAData};
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.riepilogo_adp + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			
			arrObjStampa.push(obj);
		}
		
		//RIEPILOGO_RP
		if( $("#h-radRiepilogoRP").val() == 'S'){
			
			var vTesto = jQuery("#txtTesto").html();
			vDaData = $("#h-txtRPDaData").val() == '' ? home.ASSISTITO.DATA_NASCITA_ISO : $("#h-txtRPDaData").val();
			vAData =  $("#h-txtRPAData").val();
			
			prompts = {pIdenPer:vIdenPer, pDaData:vDaData, pAData:vAData};
	
			obj = {
				path_report: CENTRO_STAMPE.pathReport.riepilogo_rp + "&t=" + new Date().getTime(),
				prompts:prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: 'pdf'
			};
			arrObjStampa.push(obj);
		}
		CENTRO_STAMPE.stampaMultipla(arrObjStampa);
	},	
	
	formatHTMLText: function( text ){
		
		return text.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
	},
	
	chiudiScheda:function(){
		
		/*
		if(confirm(traduzione.lblChiudiScheda)){
			
			if($("#PROVENIENZA").val() == 'TAB_RR_ACCERTAMENTI' || $("#PROVENIENZA").val() == 'ELENCO_RICETTE' || $("#STATO_PAGINA").val() == 'K'){
				parent.$.fancybox.close();	
			}else{
				home.NS_FENIX_TOP.chiudiUltima();
			}
		}
		*/
	},
	
	stampaMultipla:function(arrObjStampa){
	
		var anteprima = false;
		
		if(arrObjStampa.length < 1){
			 home.NOTIFICA.warning({
				message: traduzione.lblNoStampa,
				title:traduzione.lblAttenzione
			});
		}
		
		for (var i = 0; i<arrObjStampa.length; i++){
			
			if( arrObjStampa[i]['show'] == 'S' && !anteprima ){
				if( confirm( 'Si vuole visualizzare l\'anteprima di queste stampe?') ){
					CENTRO_STAMPE.anteprima();
				}
			}	
		
			home.NS_PRINT.print(arrObjStampa[i]);
		}
	},
	
	anteprima: function(){
		
		return false;
	}
	
};