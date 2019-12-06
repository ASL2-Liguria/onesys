var iden_anag_sel = null;
var cod_fisc_sel = null;
var iden_med_base_sel = null;
//var tipoUtente = home.baseUser.TIPO_UTENTE;

var gruppo={
	iden_med_gruppo:''
};

$(document).ready(function(){

	window.provenienza = 'RICERCA_PAZIENTE';
	
	NS_WK_RICERCA.init();
	NS_WK_RICERCA.setEvents();
	$("#txtCogn").focus();

});


var NS_WK_RICERCA = {

		init:function(){
			$("#taNote").val(home.CONSULTA_AGENDA.parameters.pNote);
		},
		
		wk:null,
		
		filter:function(){
			NS_WK_RICERCA.toUpper();
			
			if(NS_WK_RICERCA.controls() !="KO"){
				
				this.ricercato = true;
				
				var aBind = ["cogn","nome","data","cod_fisc", "iden_utente"];
				var aVal = [$("#txtCogn").val(),$("#txtNome").val(),$("#h-txtData").val(),$("#txtCodFisc").val(), home.baseUser.IDEN_PER];

				this.wk = new WK({container:"divWk",id:"ASSISTITI_ALL","aBind":aBind,"aVal":aVal, load_callback: {
		        		after: function() { /*funzione di callback sulla ricerca locale per lanciare la ricerca remota nel caso non ci siano record*/

		        			if (NS_WK_RICERCA.wk.getRows().length==0 && LIB.getParamUserGlobal("ANAGRAFICA_REMOTA","N") == "S") {
				        		home.dwrMMG.RicercaInRemoto(aBind, aVal, function () {
				        			NS_WK_RICERCA.wk = new WK({container:"divWk",id:"ANAGRAFE_SANITARIA","aBind":aBind,"aVal":aVal});
				        			NS_WK_RICERCA.wk.loadWk();
				        		});

				        	}
		        		}
		        }});
		        this.wk.loadWk();

			}
		},
		
		setEvents:function(){
			
			$("body").on("keyup",function(e) {
				if(e.keyCode == 13) {
					NS_WK_RICERCA.filter();
				}
			});
			
			$("#butRicerca").on("click",function(){
				NS_WK_RICERCA.filter();
			});

			$("#butInserisci").on("click",function(){ 
				NS_WK_RICERCA.inserisciAnagrafica();
			});
			
			$(".butConferma").on("click",function(){
				NS_WK_RICERCA.confermaAnagrafica();
			});
			
			$("#txtCogn, #txtNome , #txtCodFisc").on("blur",function(){
				NS_WK_RICERCA.toUpper();
			});
			
		},
		
		toUpper:function(){
			$("#txtCogn").val($("#txtCogn").val().toUpperCase());
			$("#txtNome").val($("#txtNome").val().toUpperCase());
			$("#txtCodFisc").val($("#txtCodFisc").val().toUpperCase());
		},
		
		controls:function(){
			if ($("#txtCogn").val()==""){
				$("#txtCogn").focus();

				if($("#txtCodFisc").val() != ""){
					return "OK";	
				}else{
		            home.NOTIFICA.warning({
		                message: "Specificare Cognome del Paziente o Il Codice fiscale",
		                title: "Attenzione"
		            });
					return "KO";
				}
			}else{
				if($("#txtCogn").val().length < 2 ){
		            home.NOTIFICA.warning({
		                message: "Specificare Almeno 2 lettere del Cognome",
		                title: "Attenzione"
		            });
					return "KO";
				}else{
					return "OK";	
				}
			}
			
			//controllo se ho ricercato solo per codice fiscale (molto probabilmente con la pistola)
			if($("#txtCogn").val() == '' && $("#txtNome").val() == '' && $("#h-txtData").val() == '' && ($("#txtCodFisc").val()!='' && $("#txtCodFisc").val().length()==16)){
				NS_WK_RICERCA.ricercaCF = true;			
			}
		},
		
		inserisciAnagrafica:function(){
			
			if(this.ricercato){
				url = "page?KEY_LEGAME=SCHEDA_ANAGRAFICA_MMG&IDEN_ANAG=";
				$.fancybox({
					'padding'	: 3,
					'width'		: 700,
					'height'	: 700,
					'href'		: url,
					'scrolling'	: 'no',
					'onClosed'  : function(params){
										NS_WK_RICERCA.open_accesso();
									},
					'type'		: 'iframe',
					'iden_anag' : '',
					'cod_fisc' : ''
				});
			}else{
	            home.NOTIFICA.warning({
	                message: "Prima di inserire un paziente effettuare la ricerca in modo da NON duplicare i pazienti sull'anagrafica",
	                title: "Attenzione",
	                timeout:0
	            });
			}

		},
		
		open_accesso:function(){
			iden_anag_sel = $.fancybox.iden_anag;
			if($.fancybox.iden_anag != undefined){
				cod_fisc_sel = $.fancybox.cod_fisc;
				this.apri("NUOVO_ACCESSO&NUOVA_ANAGRAFICA=S");
			}
		},
		
		ricercato:false,
		
		ricercaCF:false,
		
		gesRecord : function(pIdenAnag,pCodFisc,pIdenMedBase){
			
		},
		confermaAnagrafica : function() {
			
			var pNote = $("#taNote").val();
			var pIdenAnag = this.wk == null ? '0' : (this.wk.getArrayRecord().length==0 ? '0' : this.wk.getArrayRecord()[0].IDEN_ANAG);
			if(pIdenAnag=='0' && pNote=='') {return alert( traduzione.selezionareAnagrafica );}

			home.CONSULTA_AGENDA.prenotaOccupaAgenda(pIdenAnag, pNote);
			home.NS_FENIX_TOP.chiudiUltima();
		},
		loadAnagrafica : function (vCognome,vNome,vDataNasc,vCodFisc) {
			$("#txtCogn").val(vCognome);
			$("#txtNome").val(vNome);
			$("#txtCodFisc").val(vCodFisc);
			$("#txtData").val(vDataNasc);
			this.filter();
		}
};

var NS_PERMESSI_RICERCA = {
		
		initUtente:function(){
			
			var param = {
				'iden_per': baseUser.IDEN_PER
			};
			
			toolKitDB.getResultDatasource('MMG_DATI.MEDICI_GRUPPO','MMG_DATI',param,null,function(resp){
				$.each(resp,function(k1,v1){
					gruppo.iden_med_gruppo = v1.GRUPPO;
					//alert(gruppo.iden_med_gruppo);
				});
			});

		},
		
		checkPermission:function(){
			
			if(home.MMG_CHECK.isAdministrator()){
				return true;
			}
			
			if(!NS_MMG_UTILITY.checkPresenzaInArray(gruppo.iden_med_gruppo.split(','),iden_med_base_sel)){
				NOTIFICA.error({
					message	: "Non \u00E8 possibile operare su assistiti di altri medici (o di medici non appartenenti al proprio gruppo).\n "+
					"Se il paziente risulta erroneamente associato ad un altro medico (o ad un altro gruppo), contattare l'assistenza",
					title	: "Attenzione",
					timeout	: 10
				});
				return false;
			}else{
				return true;
			}
		}		
};
