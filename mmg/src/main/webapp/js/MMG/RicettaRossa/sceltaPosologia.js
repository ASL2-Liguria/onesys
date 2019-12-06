var al = '';

$(document).ready(function(){
	
	SCELTA_POSOLOGIA.init();
	SCELTA_POSOLOGIA.setEvents();
});
		
		
var SCELTA_POSOLOGIA = {
		
		$ricerca:$("#txtRicerca"),
		
		idxRiga : null,
		
		init:function(){

			this.idxRiga = $("#IDX_RIGA").val();
			$("#txtRicerca").val($("#CAMPO_VALUE").val().toUpperCase());
			SCELTA_POSOLOGIA.initWk();
			
			SCELTA_POSOLOGIA.setSizeLayout();
			
		},
		
		setEvents:function(){
			$("#butRicerca").on("click",function(){
				SCELTA_POSOLOGIA.ricerca(SCELTA_POSOLOGIA.$ricerca.val().toUpperCase());
			});
			
			$("body").on("keyup",function(e) {
				    if(e.keyCode == 13) {
				    	SCELTA_POSOLOGIA.ricerca(SCELTA_POSOLOGIA.$ricerca.val().toUpperCase());
				    }
			});
			
//			$("#txtQuantita").blur(function(){
//				SCELTA_POSOLOGIA.checkIsNumber($(this));
//			});
			
//			$("#txtQuantitaMisura").blur(function(){
//				var qta = $("#lblQuantitaMisura").text();
//				if($(this).val() != '' && !SCELTA_POSOLOGIA.checkIsNumber($(this))){
//					home.NOTIFICA.warning({
//			            message: "Attenzione! Il campo "+qta+" non \u00E8 un valore numerico. Inserire un valore numerico",
//			            title: "Attenzione"
//			        });
//					$(this).val("").focus();
//					return;
//				}
//			});
			
			$("#txtNote").blur(function(){
				$(this).val($(this).val().toUpperCase());
			});
			
			$("#radQuantitaPastiglia .RBpuls").on("click", function(){
				$("#txtQuantitaMisura").val($(this).attr("data-value"));
				SCELTA_POSOLOGIA.componiPosologia();
			});
			
			$("#butInserisci").on("click",function(){
				SCELTA_POSOLOGIA.inserisciPosologia();
			});
			
			$("#cmbMisura, #radVolte").on("change", function(){
				SCELTA_POSOLOGIA.componiPosologia();
			});
			
			$("#txtQuantita").on("keyup", function(){
				if(SCELTA_POSOLOGIA.checkIsNumber($(this), $("#lblQuantita").text())){
					
					SCELTA_POSOLOGIA.componiPosologia();
				}
			});
			
			$("#txtQuantitaMisura").on("keyup", function(){
				if(SCELTA_POSOLOGIA.checkIsNumber($(this), $("#lblQuantitaMisura").text())){
					
					SCELTA_POSOLOGIA.componiPosologia();
				}
			});
		},
		
		setSizeLayout:function(){
			//$("#tabs-sceltaPosologia").height(0);
			$("#hRicerca").parent().hide();
			
//			$("#radVolte").parent().attr("colSpan","2");
//			$("#txtNote").parent().attr("colSpan","3");
			$("#butInserisci").parent().attr("colSpan","2");
			$("#lblposologiaCompleta").attr("colSpan","2").click(function(){
				$("#txtNote").val($(this).html());
			});
			
//			$("#txtNote, #txtQuantita").parent().attr("colSpan","8");
//			$("#radVolte").parent().attr("colSpan","8");
		},
		
		checkControlSave:function(){
			
			var dosiGG = $("#lblQuantita").text();
			var qta = $("#lblQuantitaMisura").text();
			var descrPosologia = $("#lblNote").text();
			var cont=0;
			
			al = "I seguenti campi non sono compilati correttamente: \n\n";
			
			if($("#txtQuantita").val() != '' && !SCELTA_POSOLOGIA.checkIsNumber($("#txtQuantita"), $("#lblQuantita").text())){
				cont++;
				al += "- Il valore inserito nel campo "+dosiGG+" non \u00E8 un valore numerico. Si prega di inserire un valore numerico\n";
			}
			
			if($("#txtQuantitaMisura").val() != '' && !SCELTA_POSOLOGIA.checkIsNumber($("#txtQuantitaMisura"), $("#lblQuantitaMisura").text())){
				cont++;
				al += "- Il valore inserito nel campo "+qta+" non \u00E8 un valore numerico. Si prega di inserire un valore numerico\n";
			}
			
			if($("#txtQuantitaMisura").val() == '' && radQuantitaPastiglia.val() == ''){
				cont++;
				al += "- Compilare il campo "+qta+"\n";
			}
			
			if($("#txtQuantita").val() == '' ){
				cont++;
				al += "- Compilare il campo "+dosiGG+"\n";
			}
			
			if($("#txtNote").val() == ''){
				cont++;
				al += "- Compilare il campo "+descrPosologia+"\n";
			}
			
			if(cont < 1){
				return true;	
			}else{
				 home.NOTIFICA.warning({
			            message: al,
			            title: "Attenzione",
			            timeout: 8
			     });
				return false;
			}
			
		},
		
		componiPosologia: function(){
			
			var frequenza 		= $("#txtQuantita").val();
			var quantita 		= $("#txtQuantitaMisura").val();
			var unita_misura 	= $("select#cmbMisura option:selected").text();
			var periodo 		= $("select#radVolte option:selected").text();
			
			var testo = "";
			
			switch (quantita){
			case '0.25':
				testo = traduzione.lblUnQuarto;
				break;
			case '0.333':
				testo = traduzione.lblUnTerzo;
				break;
			case '0.5':
				testo = traduzione.lblMeta;
				break;
			case '1':
				testo = traduzione.lblUno;
				break;
			case '2':
				testo = traduzione.lblDue;
				break;
			case '3':
				testo = traduzione.lblTre;
				break;
			case '4':
				testo = traduzione.lblQuattro;
				break;
			case '5':
				testo = traduzione.lblCinque;
				break;
			case '6':
				testo = traduzione.lblSei;
				break;
			case '7':
				testo = traduzione.lblSette;
				break;
			case '8':
				testo = traduzione.lblOtto;
				break;
			case '9':
				testo = traduzione.lblNove;
				break;
			case '10':
				testo = traduzione.lblDieci;
				break;
			default:
				testo = quantita;
			}
			
			testo += " " + unita_misura;
			if(frequenza != ""){
				testo += " " + frequenza + " volte";
			}
			testo += " " + periodo;
			
			$("#lblposologiaCompleta").html(testo);
		},
		
		checkIsNumber:function(obj, label){
//			var dosiGG = $("#lblQuantita").text();
			var val = obj.val();
			var value = val.replace(',', '.');//per il controllo lato javascript
			if(val != '' && !NS_MMG_UTILITY.checkIsNumber(value)){
				home.NOTIFICA.warning({
//		            message: "Attenzione! Il campo "+dosiGG+" non \u00E8 un valore numerico. Inserire un valore numerico",
		            message: "Attenzione! Il campo "+label+" non \u00E8 un valore numerico. Inserire un valore numerico",
		            title: "Attenzione",
		            timeout: 6
		        });
				obj.val("").focus();
				return false;
			}
			obj.val(val.replace('.', ','));//sostituisco il punto con la virgola per il salvataggio
			return true;
		},
		
		checkQta:function(){
			
			var q = '';
			
			if($(".RadioBox").find(".RBpulsSel").length > 0){
				q = $(".RadioBox").find(".RBpulsSel").attr("data-value");
			}else{
				q = $("#txtQuantitaMisura").val();
			}
			
			return q;
		},
		
		ricerca:function(){
			
			var text = SCELTA_POSOLOGIA.$ricerca.val().toUpperCase();
			SCELTA_POSOLOGIA.$ricerca.val(text);
			var user = home.baseUser.IDEN_PER;
	    	
			var b = new Array();
	    	var v = new Array();
			b.push("bind");
			b.push("ute");
			v.push("%25"+ text+ "%25");
			v.push(user);
			
			var obj={
				id:"divWk",
    			arBind:b,
    			arValue:v
			};
			
			SCELTA_POSOLOGIA.refreshWk(obj);
		},
		
		initWk:function(){
			
			var hDivWk = NS_MMG_UTILITY.getHeightPercent(60);
			$("#divWk").height(hDivWk);
			//$("#divWk").width(700);
			var text = SCELTA_POSOLOGIA.$ricerca.val().toUpperCase();
			var user = home.baseUser.IDEN_PER;
			
	    	var b = new Array();
	    	var v = new Array();
			b.push("bind");
			b.push("ute");
			v.push(text + "%25");
			v.push(user);
			
			var params = {
				"id":"POSOLOGIE",
    			"aBind":b,
    			"aVal":v
			};
			
			var objWk = new WK(params);
			objWk.loadWk();
		},
		
		inserisciPosologia:function(){
			
			var qtaDayPosologia=$("#txtQuantita").val();
			//var qta=$("#radPastiglia").val();
			var qta=SCELTA_POSOLOGIA.checkQta();
			var textPosologia = $("#txtNote").val().toUpperCase();
			var utente = home.baseUser.IDEN_PER;
			var udm = $("#cmbMisura").val();
			var tempistica = $("#radVolte").val();
			if(tempistica == ''){
				tempistica='GIORNO';
			}
			
			var debug = "Quantit�: "+qta;
			debug += "\n - Quantit� giornaliera " + qtaDayPosologia;
			debug += "\n - Posologia" + textPosologia;
			debug += "\n - Utente" + utente;
			debug += "\n - Tempistica" + tempistica;
			debug += "\n - Udm" + udm;
			
			//alert(debug);
			
			if(!SCELTA_POSOLOGIA.checkControlSave()){
				
				return;
			}
			
			var codice = SCELTA_POSOLOGIA.saveSTD(qta, qtaDayPosologia, textPosologia, utente, udm, tempistica, "");
			
			
			if(codice.split('$')[0] == 'OK'){
				
				codice = "PS_" + codice.split('$')[1];
				
				SCELTA_POSOLOGIA.insert(codice, textPosologia);
				SCELTA_POSOLOGIA.chiudiScheda();
				
			}else{
				alert("Errore nella creazione del codice della posologia");
				
			};
			
		},

		insert:function(pCodice, pDescrizione){
			home.RICETTA_FARMACI.setPosologia(this.idxRiga, {"codice":pCodice, "descrizione":pDescrizione});
		},
		
		saveSTD:function(qta, qtaDay, text, utente, udm, tempistica, note){

			var vOut = '';
			var param = { 
				"pQta"			: qta,
				"pQtaDay"		: qtaDay,
				"pText"			: text,
				"pNote"			: note,
				"pIdenMed"		: utente,
				"pUteIns"		: home.baseUser.IDEN_PER,
				"pUdm"			: udm,
				"pTempistica" 	: tempistica
				
			};
			
			dwr.engine.setAsync(false);
			toolKitDB.executeFunctionDatasource("SALVA_POSOLOGIA", "MMG_DATI", param, cbk);
			dwr.engine.setAsync(true);
			
			function cbk(response){
				$.each(response,function(k,v){
					vOut = v;
				});
			}
			
			return vOut;
		},
		
		refreshWk:function(arBindValue){
			var sub = $("#"+arBindValue.id).worklist();
			sub.data.where.init();
			sub.data.where.set('', arBindValue.arBind, arBindValue.arValue);
			sub.data.load();
		},
		
		chiudiScheda:function(){
			NS_FENIX_SCHEDA.chiudi();
		}
};


var WK_POSOLOGIA = {
		
	select:function(riga){
		
	},
	
	choose:function(riga){
		//alert(riga.CODICE + ' ' + riga.POSOLOGIA);
		SCELTA_POSOLOGIA.insert(riga.CODICE, riga.POSOLOGIA);
		SCELTA_POSOLOGIA.chiudiScheda();
	},
	
	cancella:function(row){
		
		if(row[0].PERSONALE == 'N'){
			home.NOTIFICA.warning({
				message:traduzione.lblErrorPersonale,
				title:traduzione.lblTitleError
			});
			return;
		}
		
		home.NS_MMG.confirm(traduzione.lblConfirmCancella, function(){
			var param = { 
					'V_IDEN_POSOLOGIA' 	: row[0].IDEN,
					'PUTENTE' 			: home.baseUser.IDEN_PER,
					'P_ACTION'			: 'DEL'
			};
	
			toolKitDB.executeProcedureDatasourceOut("SP_POSOLOGIE","MMG_DATI",param,{'V_OUT': 'V_OUT'}, function(response){
				SCELTA_POSOLOGIA.ricerca();
			});
		
		});

	}
};
