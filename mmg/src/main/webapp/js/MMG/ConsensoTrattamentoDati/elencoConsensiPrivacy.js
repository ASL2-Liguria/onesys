$(document).ready(function() {

	ELENCO_CONSENSO_PRIVACY.init();
	ELENCO_CONSENSO_PRIVACY.setEvents();

});

var ELENCO_CONSENSO_PRIVACY = {
		
		wkElencoConsensi:null,
		
		init:function(){
			
			ELENCO_CONSENSO_PRIVACY.initWk('NOTDEFINED');
			$("td.tdButton").css("text-align","right");
			
			home.$.NS_DB.getTool({_logger : home.logger}).select({
	            id:'WORKLIST.CONSENSI_NUMERO',
	            parameter:
	            {
	            	iden_med			: { v : home.baseUser.IDEN_PER, t : 'N'}
	            }
			}).done( function(resp) {
				if(LIB.isValid(resp.result[0].NUMERO_CONSENSI) && resp.result[0].NUMERO_CONSENSI != '0'){
					var numero_consensi = $(document.createElement("span")).attr('id', 'numero_consensi').html('Numero dei consensi compilati: ' + resp.result[0].NUMERO_CONSENSI);
					$(".buttons").parent().prepend(numero_consensi);
				}
			});
		},
		
		setEvents:function(){
			
			$("#butCerca").on("click",function(){
				ELENCO_CONSENSO_PRIVACY.initWk();
			});
			
			$(".butStampa").on("click",function(){
				ELENCO_CONSENSO_PRIVACY.stampa();
			});
			
			$("#Cognome, #Nome").on("blur",function(){
				$(this).val($(this).val().toUpperCase());
			});
			
			$("body").on("keyup",function(e) {
			    if(e.keyCode == 13) {
			    	ELENCO_CONSENSO_PRIVACY.initWk();
			    }
			});
		},
		
		initWk:function(param){
			
			$("#Cognome, #Nome").blur();
			
			if(typeof param != 'undefined' && param == 'NOTDEFINED'){
				//cognome = 'NOTDEFINED'; nome = 'NOTDEFINED';
				$("#h-txtDaData").val(moment().subtract(30, 'days').format('YYYYMMDD'));
				$("#txtDaData").val(moment().subtract(30, 'days').format('DD/MM/YYYY'));
				$("#h-txtAData").val(moment().format('YYYYMMDD'));
				$("#txtAData").val(moment().format('DD/MM/YYYY'));
				
			}
			
			//antiscroll-inner
			var h = $('.contentTabs').innerHeight() - $('#fldRicerca').outerHeight(true) -10;
			$("#divWk").height( h );
			
			var cognome = $("#Cognome").val() == null ? '' : $("#Cognome").val();
			var nome = $("#Nome").val() == null ? '' : $("#Nome").val();
			
			var params = {
					"id"    	: 'WK_ELENCO_CONSENSI_PRIVACY',
					"aBind" 	: ["cognome", "nome", "da_data", "a_data", "iden_utente"],
					"aVal"  	: [cognome, nome, $("#h-txtDaData").val(), $("#h-txtAData").val(), home.baseUser.IDEN_PER],
					"container" : 'divWk'
				};
			
			this.wkElencoConsensi = new WK(params);
			this.wkElencoConsensi.loadWk();
		},
		
		stampa:function(){
			
			var prompts = {
			   pIdenPer            	: home.baseUser.IDEN_PER,
			   pIdenMed				: home.CARTELLA.getMedPrescr(),
			   pCognome            	: $("#Cognome").val().toUpperCase(), 
			   pNome               	: $("#Nome").val().toUpperCase(), 
			   pDaData		       	: $("#h-txtDaData").val(), 
			   pAData 				: $("#h-txtAData").val() != '' ?  $("#h-txtAData").val() : '22000101'
			};

			home.NS_PRINT.print({
				path_report: "LISTA_CONSENSI.RPT" + "&t=" + new Date().getTime(),
			   	prompts: prompts,
			   	show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: "pdf"
			});	     
		}
};

var WK_ELENCO_CONSENSI = {

		modifica:function(rec){
			
			home.NS_MMG.apriModuloConsenso(rec.IDEN_ANAG, rec.SCHEDA, rec.IDEN, rec.IDEN_MED_BASE);
		},
		
		stampa:function(rec, vType){
			
			var vPdf = LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N');
			var prompts = {pIden: rec.IDEN, pIdenAnag: rec.IDEN_ANAG, pIdenPer: rec.IDEN_MED_BASE};
							
			switch(vType){
			
			case 'PRINT':
				
				home.NS_PRINT.print({
					
					path_report: "CONSENSO_PRIVACY_MMG.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: vPdf,
					output: "pdf"
				});
				break;
				
			case 'PDF':
				
				home.NS_PRINT.print({
					
					path_report: "CONSENSO_PRIVACY_MMG.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: 'S',
					output: "pdf"
				});

				break;
			}
		},

		cancella:function(rec, con_ripristino){
			if (typeof con_ripristino === "undefined") {
				con_ripristino = "S";
			}
			
			if (home.MMG_CHECK.canDelete(rec.UTE_INS, rec.IDEN_MED)) {
				var dialog = home.NS_MMG.confirm("Cancellare questo modulo? L'operazione non &egrave; reversibile" + (con_ripristino == "N" ? " e il consenso risulter&agrave; <strong>NON ACQUISITO</strong>" : ""),function() {
					home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({

						id:'SP_DELETE_CONSENSO',
						parameter: {
							n_iden			: { v : rec.IDEN, t : 'N'},
							n_iden_anag		: { v : rec.IDEN_ANAG, t : 'N'},
							v_ripristina	: { v : con_ripristino, t : 'V'},
							n_iden_utente	: { v : home.baseUser.IDEN_PER, t: 'N'},
							v_out			: { v : null, t : 'V' , d: 'O'}
						}

					}).done( function(resp) {
						if (resp.v_out.indexOf("KO$")==0) {
							home.NOTIFICA.error({
								title: "Impossibile cancellare",
								message: resp.v_out.substring(3)
							});
						} else {
							ELENCO_CONSENSO_PRIVACY.initWk();
						}

					}).fail( function(resp) {
						home.NOTIFICA.error({
							title:traduzione.lblErrorSave,
							message:traduzione.lblNoSave
						});
					});
					dialog.destroy();
				});
			}
		},
		
		visualizzaStorico:function(rec){
			
			//TODO:immettere controllo per la visualizzazione del consenso
			
			home.NS_MMG.apri("STORICO_CONSENSO","&IDEN_ANAG="+rec.IDEN_ANAG+"&IDEN_PER="+home.baseUser.IDEN_PER);
		}
};