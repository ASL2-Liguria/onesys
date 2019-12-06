$(document).ready(function(){
	RIEPILOGO_INSERIMENTO_PROBLEMA.init();
	RIEPILOGO_INSERIMENTO_PROBLEMA.setEvents();
//	NS_FENIX_SCHEDA.successSave = MODULO_REAZIONE_AVVERSA.successSave;

});
//var vIdenAnag = home.CARTELLA.isActive() ? home.ASSISTITO.IDEN_ANAG : "";

var RIEPILOGO_INSERIMENTO_PROBLEMA = {
			
			init:function(){
				
				objWk : null,
				
				home.RIEPILOGO_INSERIMENTO_PROBLEMA = this;

//				if($("#ID_PROBLEMA").val() != ""){
//					alert($("#ID_PROBLEMA").val())
//					alert("IDEN_PROBLEMA: " + $("#IDEN_PROBLEMA").val())
//					$("#IDEN_PROBLEMA").val($("#ID_PROBLEMA").val());
//					alert("IDEN_PROBLEMA: " + $("#IDEN_PROBLEMA").val())
//				}
				
				$(".butStampa").hide(); // ---> in futuro potrebbe stampare
				RIEPILOGO_INSERIMENTO_PROBLEMA.initWkVisite();
				RIEPILOGO_INSERIMENTO_PROBLEMA.initWkNoteDiario();
				
				document.getElementById("lblTitolo").innerHTML = "<h2> Riepilogo inserimento problema: " + $("#PROBLEMA_COMPLETO").val() + "</h2>";
				$("#txtProblema").val($("#PROBLEMA_COMPLETO").val());
				$("#txtUtenteInserimento").val($("#MEDICO_INSERIMENTO").val());
				$("#txtDataInserimento").val($("#DATA_INSERIMENTO").val());
				
				home.$.NS_DB.getTool({_logger : home.logger}).select({
		            id:'SDJ.Q_NOTE_PROBLEMA_INSERIMENTO',
		            parameter:
		            {
		            	iden_problema		: { v : $("#ID_PROBLEMA").val(), t : 'N'}
		            }
				}).done( function(resp) {
					$("#taNoteInserimento").val(resp.result[0].NOTE);
				} );
			},
			
			setEvents:function(){
				
				$("#li-tabRiepilogo_II").on("click", function(){
					
					RIEPILOGO_INSERIMENTO_PROBLEMA.initWkBMI();
					RIEPILOGO_INSERIMENTO_PROBLEMA.initWkTemperatura();
					RIEPILOGO_INSERIMENTO_PROBLEMA.initWkRilevazioni();
				});
				
				$("#li-tabRiepilogo_III").on("click", function(){
					
					RIEPILOGO_INSERIMENTO_PROBLEMA.initWkPrescrFarmaci();
					RIEPILOGO_INSERIMENTO_PROBLEMA.initWkPrescrAccertamenti();
					RIEPILOGO_INSERIMENTO_PROBLEMA.initWkCertificati();
				});
			},
			
			initWkVisite: function(){
				var vIdenAnag = home.CARTELLA.isActive() ? home.ASSISTITO.IDEN_ANAG : "";
				//var h = $('.contentTabs').innerHeight() - $('#fldRicerca').outerHeight(true) -10;
				$("#WkPrestazioni").height( 150 );
				
				this.objWk = new WK({
					"id"        : 	'WK_VISITE_PROBLEMA',
	    			"aBind"     :	["iden_anag", "iden_med", "iden_problema"],
	    			"aVal"      :	[vIdenAnag, home.baseUser.IDEN_PER, $("#ID_PROBLEMA").val()],
	    			"container" : 	'WkPrestazioni'
				});
				this.objWk.loadWk();
			},
			
			initWkNoteDiario: function(){
				var vIdenAnag = home.CARTELLA.isActive() ? home.ASSISTITO.IDEN_ANAG : "";
				$("#wkNoteDiario").height( 150 );
				
				this.objWk = new WK({
					"id"        : 	'WK_NOTE_DIARIO_PROBLEMA',
	    			"aBind"     :	["iden_anag", "iden_med", "iden_problema"],
	    			"aVal"      :	[vIdenAnag ,home.baseUser.IDEN_PER, $("#ID_PROBLEMA").val()],
	    			"container" : 	'wkNoteDiario'
				});
				this.objWk.loadWk();
			},
			
			initWkBMI: function(){
				var vIdenAnag = home.CARTELLA.isActive() ? home.ASSISTITO.IDEN_ANAG : "";
				$("#WkBMI").height( 150 );
				
				this.objWk = new WK({
					"id"        : 	'WK_RIL_BMI_PROBLEMA',
	    			"aBind"     :	["iden_anag", "iden_med", "iden_problema"],
	    			"aVal"      :	[vIdenAnag, home.baseUser.IDEN_PER, $("#ID_PROBLEMA").val()],
	    			"container" : 	'WkBMI'
				});
				this.objWk.loadWk();
			},
			
			initWkTemperatura: function(){
				var vIdenAnag = home.CARTELLA.isActive() ? home.ASSISTITO.IDEN_ANAG : "";
				$("#WkTemperatura").height( 150 );
				
				this.objWk = new WK({
					"id"        : 	'WK_RIL_TEMPERATURA_PROBLEMA',
	    			"aBind"     :	["iden_anag", "iden_med", "iden_problema"],
	    			"aVal"      :	[vIdenAnag, home.baseUser.IDEN_PER, $("#ID_PROBLEMA").val()],
	    			"container" : 	'WkTemperatura'
				});
				this.objWk.loadWk();
			},
			
			initWkRilevazioni: function(){
				var vIdenAnag = home.CARTELLA.isActive() ? home.ASSISTITO.IDEN_ANAG : "";
				$("#WkRilevazioni").height( 150 );
				
				this.objWk = new WK({
					"id"        : 	'WK_RIL_GENERALI_PROBLEMA',
	    			"aBind"     :	["iden_anag", "iden_med", "iden_problema"],
	    			"aVal"      :	[vIdenAnag, home.baseUser.IDEN_PER, $("#ID_PROBLEMA").val()],
	    			"container" : 	'WkRilevazioni'
				});
				this.objWk.loadWk();
			},
			
			initWkPrescrFarmaci: function(){
				var vIdenAnag = home.CARTELLA.isActive() ? home.ASSISTITO.IDEN_ANAG : "";
				$("#WkPrescrFarmaci").height( 150 );
				
				this.objWk = new WK({
					"id"        : 	'WK_FARMACI_PROBLEMA',
	    			"aBind"     :	["iden_anag", "iden_med", "iden_problema"],
	    			"aVal"      :	[vIdenAnag, home.baseUser.IDEN_PER, $("#ID_PROBLEMA").val()],
	    			"container" : 	'WkPrescrFarmaci'
				});
				this.objWk.loadWk();
			},
			
			initWkPrescrAccertamenti: function(){
				var vIdenAnag = home.CARTELLA.isActive() ? home.ASSISTITO.IDEN_ANAG : "";
				$("#WkPrescrAccertamenti").height( 150 );
				
				this.objWk = new WK({
					"id"        : 	'WK_ACCERTAMENTI_PROBLEMA',
	    			"aBind"     :	["iden_anag", "iden_med", "iden_problema"],
	    			"aVal"      :	[vIdenAnag, home.baseUser.IDEN_PER, $("#ID_PROBLEMA").val()],
	    			"container" : 	'WkPrescrAccertamenti'
				});
				this.objWk.loadWk();
			},
			
			initWkCertificati: function(){
				var vIdenAnag = home.CARTELLA.isActive() ? home.ASSISTITO.IDEN_ANAG : "";
				$("#WkCertificati").height( 150 );
				
				this.objWk = new WK({
					"id"        : 	'WK_CERTIFICATI_PROBLEMA',
	    			"aBind"     :	["iden_anag", "iden_med", "iden_problema"],
	    			"aVal"      :	[vIdenAnag, home.baseUser.IDEN_PER, $("#ID_PROBLEMA").val()],
	    			"container" : 	'WkCertificati'
				});
				this.objWk.loadWk();
			},
			
			apriVisita: function(row){
				
				var url = "&IDEN=" + row[0].IDEN;
				url += "&ID_PROBLEMA=" + $("#ID_PROBLEMA").val();
				home.NS_MMG.apri( "MMG_VISITE" + url );
			},
			
			apriCertificato: function( row ){
				
				var url = "&IDEN=" + row[0].IDEN;
				url += "&ID_PROBLEMA=" + $("#ID_PROBLEMA").val();
				home.NS_MMG.apri( "ALTRE_STAMPE"  + url );				
			},
			
			apriNotaDiario: function(row){
				
				var pIdenScheda = row[0].IDEN_SCHEDA_XML;
				
				if(pIdenScheda != null && row[0].TIPO == 'VISITA'){
					
					var url = "&IDEN=" + row[0].IDEN_SCHEDA_XML;
					url += "&ID_PROBLEMA=" + $("#ID_PROBLEMA").val();
					home.NS_MMG.apri( "MMG_VISITE" + url );
				}else if(pIdenScheda != null && row[0].TIPO == 'GRAVIDANZA'){
					/*ma la nota della gravidanza...deve aprirsi come gravidanza?...*/
					home.NS_MMG.apri("GRAVIDANZA", "&IDEN=" + row[0].IDEN_SCHEDA_XML);
				}else{
				/*...o come nota?*/
					var url = "&IDEN=" + row[0].IDEN;
					url += "&NOTA=" + row[0].NOTE;
					url += "&ACTION=MOD";
					url += "&DATA=" + row[0].DATA;
					url += "&ID_PROBLEMA=" + $("#ID_PROBLEMA").val();
					home.NS_MMG.apri( "INSERIMENTO_DIARIO" + url);
				}
			},
};

