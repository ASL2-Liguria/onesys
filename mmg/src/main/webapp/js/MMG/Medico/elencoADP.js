$(function() {
	ELENCO_ADP.init();
	ELENCO_ADP.setEvents();
	ELENCO_ADP.setLayout();
});

var ELENCO_ADP = {
		
		objWk : null,

		provenienza:'',
		
		vReport :'MODULO_ASSISTENZA_PROGRAMMATA_V2.RPT',
		
		vDaData : '',
		
		vAData : '',
		
		vVua : '',
		
		init: function(){
			
			ELENCO_ADP.provenienza = $('#PROVENIENZA').val() == 'CARTELLA_OUT' ?  'WK_ELENCO_ADP_OUT' : 'WK_ELENCO_ADP';
			ELENCO_ADP.vReport = $('#PROVENIENZA').val() == 'CARTELLA_OUT' ?  'ELENCO_ADP.RPT' : 'ELENCO_ADP_PAZIENTE.RPT';
		
			/***setto la data di partenza della ricerca un mese prima di quella odierna***/
			$("#txtDaData").val(moment().subtract('months', 19).format('DD/MM/YYYY'));
			$("#h-txtDaData").val(moment().subtract('months', 19).format('YYYYMMDD'));
			$("#selezioneFiltroRicette").parent().attr({"colSpan":"4","text-align":"center"});
			$("#butCerca").parent().attr({"colSpan":"4"});

			ELENCO_ADP.initWk();
		},
		
		setEvents:function(){
			
			$("#butCerca").on("click", function(){
				ELENCO_ADP.refreshWk();
			});
			
			$(".butStampa").on("click", function(){
				ELENCO_ADP.stampaElenco();
			});
			
			$("body").on("keyup",function(e) {
			    if(e.keyCode == 13) {
			    	ELENCO_ADP.refreshWk();
			    }
			});
		},
		
		setLayout:function(){
		
			if($('#PROVENIENZA').val() != 'CARTELLA_OUT'){
				$("#selezioneFiltroRicette").closest("tr").hide();
				$("#txtNome").closest("tr").hide();
			}
			
		},
		
		initWk:function(){
			
			ELENCO_ADP.refreshWk();
		},
		
		refreshWk:function(){
		
			var h = $('.contentTabs').innerHeight() - 50;
			$("#divWk").height( h );
			
			ELENCO_ADP.setValueParameters();
			
			ELENCO_ADP.objWk = new WK({
				"id"		: ELENCO_ADP.provenienza,
    			"aBind"		:["nome","cognome","da_data","a_data","iden_utente","iden_med", "vua","iden_anag"],
    			"aVal"		:[$("#txtNome").val().toUpperCase(), $("#txtCognome").val().toUpperCase(), ELENCO_ADP.vDaData, ELENCO_ADP.vAData, home.baseUser.IDEN_PER, home.CARTELLA.getMedPrescr(), ELENCO_ADP.vVua, $("#IDEN_ANAG").val()],
    			"container" : 'divWk'
			});
			
			ELENCO_ADP.objWk.loadWk();
			//home.activeWk = this.objWk;
		},
		
		insert: function(){
			home.NS_MMG.apri('MMG_ASSISTENZA_PROGR_V2');
		},
		
		setValueParameters:function(){
			
			ELENCO_ADP.vDaData = $("#h-txtDaData").val();
			
			if (ELENCO_ADP.vDaData == ""){
				ELENCO_ADP.vDaData = moment().format('YYYYMMDD');
			}
			
			ELENCO_ADP.vAData = $("#h-txtAData").val();
			
			if (ELENCO_ADP.vAData == ""){
				ELENCO_ADP.vAData = moment().add( 100,'years' ).format('YYYYMMDD');
			}
			
			if($("#selezioneFiltroRicette").data("RadioBox").val() == 'MY'){
				ELENCO_ADP.vVua = 'ASSISTITO';
			}else{
				ELENCO_ADP.vVua = 'ASSISTITO,SOSTITUTO,SOSTITUTO_GRUPPO,GRUPPO';
			}
			
		},
		
		stampaModulo: function( rec ){
			
			var vIden 	= rec.IDEN;
			var vScheda = rec.SCHEDA;
			
			var prompts = {
					pIdModulo:vIden, 
					pIdenPer:home.CARTELLA.IDEN_MED_PRESCR 
			};
				
			home.NS_PRINT.print({
				path_report: ELENCO_ADP.vReport + "&t=" + new Date().getTime(),
				prompts: prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: "pdf"
			});
		},
		
		stampaElenco: function(){

			ELENCO_ADP.setValueParameters();
			
			if($("#PROVENIENZA").val() == 'CARTELLA_OUT'){
				
				prompts = {
						pNome		: $("#txtNome").val().toUpperCase(), 
					    pCognome	: $("#txtCognome").val().toUpperCase(),
					    pDaData		: ELENCO_ADP.vDaData,
					    pAData		: ELENCO_ADP.vAData,
					    pIdenUtente	: home.baseUser.IDEN_PER,
					    pVua		: ELENCO_ADP.vVua
				};
			
			}else{
				
				prompts = {
						pIdenAnag	: home.ASSISTITO.IDEN_ANAG,
					    pDaData		: ELENCO_ADP.vDaData,
					    pAData		: ELENCO_ADP.vAData,
					    pIdenUtente	: home.baseUser.IDEN_PER,
					    pVua		: ELENCO_ADP.vVua
				};
			}
			
			home.NS_PRINT.print({
				path_report: ELENCO_ADP.vReport + "&t=" + new Date().getTime(),
				prompts: prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: "pdf"
			});
			
		}
}