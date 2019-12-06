$(function(){
	ELENCO_RICETTE.init();
	ELENCO_RICETTE.setEvents();
	ELENCO_RICETTE.setLayout();

});

var ELENCO_RICETTE = {
			
			provenienza: '',
			
			report: '',
			
			init: function(){
				
				WORKLIST_RICETTE.refreshWk = this.refreshWk;
				
				ELENCO_RICETTE.provenienza = $('#PROVENIENZA').val() == 'CARTELLA_OUT' ?  'ELENCO_RICETTE_OUT' : 'ELENCO_RICETTE';
				ELENCO_RICETTE.report = $('#PROVENIENZA').val() == 'CARTELLA_OUT' ?  'RIEPILOGO_RICETTE' : 'RIEPILOGO_RICETTE_PAZIENTE';
				
				ELENCO_RICETTE.initWk();
				
				if( home.CARTELLA.isActive() ){
					$("#Nome").closest("tr").hide();
					$("#divInfoSearch").hide();
				}
				
				
				$("#Cognome").attr("tabindex","1");
				$("#Nome").attr("tabindex","2");
				$("#txtDaData").attr("tabindex","3");
				$("#txtAData").attr("tabindex","4");
				$("#cmbMedico").attr("tabindex","5");
				
				if (MMG_CHECK.isMedico()) {
					$("#lblMedico").hide();
					$("#cmbMedico").hide();
					$("#divInfoSearch").text("Ricette inserite da me o per i miei assistiti");
				} else {
					$("#divInfoSearch").text("Ricette inserite: a nome del medico selezionato, o per i suoi assistiti, o dall'utente corrente");
				}
			},
			
			setEvents: function(){
				
				$("#cmbRisultati").off("change");
				
				$("#butCerca").on("click", function(){
					ELENCO_RICETTE.refreshWk();
				});
				
				$(".butStampa").on("click", function(){
					ELENCO_RICETTE.stampaElencoRicette();
				});
				
				$("body").on("keyup",function(e) {
				    if(e.keyCode == 13) {
				    	ELENCO_RICETTE.refreshWk();
				    }
				});
				
				$("#cmbMedico").val(home.CARTELLA.getMedPrescr());
			},
			
			setLayout:function(){				
				$("#radStampate").parent().attr({
					"colSpan":"5"
				});
			},
			
			initWk:function(){
				if (ELENCO_RICETTE.provenienza == "ELENCO_RICETTE") {
					ELENCO_RICETTE.refreshWk();
				}
			},
			
			getVars: function() {
				var vars = {};
		    	
				vars.iden_utente = home.baseUser.IDEN_PER;
				
		    	if(LIB.isValid($("#IDEN_ANAG").val())){		  
		    		vars.idenAnag = $("#IDEN_ANAG").val();
		    	} else {
					vars.idenANag = "";
				}
				
				vars.idenMed = $("#cmbMedico").val();
				if (!LIB.isValid(vars.idenMed)) {
					vars.idenMed = home.CARTELLA.getMedPrescr();
				}
				vars.da_data = moment($("#txtDaData").val(),'DD/MM/YYYY').format('YYYYMMDD');
				
				if (vars.da_data ==""){
					vars.da_data = moment().format('YYYYMMDD');
				}
				
				vars.a_data = moment($("#txtAData").val(),'DD/MM/YYYY').format('YYYYMMDD');
				
				vars.nome = $("#Nome").val().toUpperCase();
				vars.cognome = $("#Cognome").val().toUpperCase();
				
				/*21/01/2016 - Ormai poco attendibile il filtro medico/gruppo*/
				vars.valoreFiltro = 'ASSISTITO,SOSTITUTO,SOSTITUTO_GRUPPO,GRUPPO';
				vars.valueDema = 'S,N,D';
				vars.valueStato = 'I,C,E,S';
				vars.valueStampato = $("#radStampate").data("RadioBox").val();
				return vars;
			},
			
			refreshWk: function(){
				
				//antiscroll-inner
				var h = $('.contentTabs').innerHeight() - $('#fldRicerca').outerHeight(true) -10;
				$("#ElencoWork").height( h );
				
		    	var vars = ELENCO_RICETTE.getVars();
				
				b = [ "nome", "cognome", "iden_anag", "iden_utente", "iden_med", "da_data", "a_data", "vua", "dema", "stato", "stampato"]; //"n_risultati", 
				v = [ vars.nome, vars.cognome, vars.idenAnag, vars.iden_utente, vars.idenMed, vars.da_data, vars.a_data, vars.valoreFiltro, vars.valueDema, vars.valueStato, vars.valueStampato]; //$("#cmbRisultati").val(),
				
				var params = {
					"id"		: ELENCO_RICETTE.provenienza,
	    			"aBind"		:b,
	    			"aVal"		:v,
	    			"container" : 'ElencoWork'
				};

				var objWk = new WK(params);
				objWk.loadWk();
			},
			
			stampaElencoRicette:function(){
				
				var vars = ELENCO_RICETTE.getVars();
				
				var prompts = {
					pIdenAnag: vars.idenAnag,
					pNome: vars.nome,
					pCognome: vars.cognome,
					pStato: vars.valueStato,
					pStampato: vars.valueStampato,
					pDema: vars.valueDema,
					pVua: vars.valoreFiltro,
					pDaData: vars.da_data,
					pAData: vars.a_data,
					pIdenPer: vars.iden_utente,
					pIdenMed: vars.idenMed
				};
				
				home.NS_PRINT.print({
					path_report: ELENCO_RICETTE.report + ".RPT&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});

			}
};