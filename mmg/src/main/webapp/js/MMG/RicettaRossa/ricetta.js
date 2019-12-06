$(function() {

	RICETTA.init();
	RICETTA.setEvents();
});

var $esenzioni;
var $commons;

var objSalvataggio;

var RICETTA = {
	
	eventKeyUpBrowser:'keyup',
		
	init : function() {

		//tapullo fatto perchè onkeyup e onkeypress si conmportano diversamente su ie e sul resto del mondo
		if($.browser.msie){
			RICETTA.eventKeyUpBrowser = 'keydown';
		}
		
		// nascondo le icone del documento per le ricette da non stampare
		//$(".icon-doc").hide();
		$(".icon-lock").hide();

		// gestisco le icone e gli input della riga di inserimento
		var $ins = $("tr[tipoRiga=ins] .tdAction");
		$ins.find("i").not(".icon-cog-1").hide();

		// nascondo tuttele frecce dell'ordinamento
		$(".intestazione").find("i").hide();

		RICETTA.creaComboRisultati();

		//creo il pulsante della stampa rapida solo per la partee dei farmaci
		if(RICETTA.getTipoRicetta() == 'FARMACI'){
			RICETTA.creaDivStampa();
		}

		$esenzioni = $(".classEsenzione").contextMenu(menuEsenzioni, {
			openSubMenuEvent : "mousedown",
			openInfoEvent : "mousedown"
		});

		$(".butStampaRicetta").addClass("butVerde");

		$("tr[idx]").each(function() {
			var riga = $(this);
			riga.find(".icon-attention").attr("title",
				RICETTA.getRimanenza(riga)).on("click", function(){
					home.NOTIFICA.info({
						title:		'Rimanenza  '+riga.find(".classFarmaco").html(),
						message:	RICETTA.getRimanenza(riga,'NOTIFICA'),
						timeout: 	10
					});
				}
			);
			riga.find(".icon-doc").attr("title", "DA STAMPARE");
			riga.find(".icon-hourglass").attr("title", "Apri menu attributi prescrizione");
			riga.find(".icon-cog-1").attr("title", "Apri menu azioni prescrizione");
			riga.find(".icon-info-circled").attr("title", "Apri Informazioni");
			riga.find(".icon-lock").attr("title", "TERAPIA BLOCCATA! Rimuovi il blocco");
			riga.find(".icon-pencil").attr("title", "Nota: " + riga.attr("note_prescrizione"));
			riga.find(".icon-pencil").addClass("evidenziaNota");
			try {
				RICETTA.checkPT(riga);
			} catch (e) {
			}
		});

		$(".iconContainer").prepend( $( "<i/>" ).addClass('icon-cog-1').attr("id","iCommonFunctions").attr('title', 'Funzioni'));
		
		if(RICETTA.isDemaAbilitata()) {
			RICETTA.chooseType();
		}
	},
	
	getToolDb: function() {
		if (typeof RICETTA_ACCERTAMENTI != "undefined") {
			return RICETTA_ACCERTAMENTI.getToolDb();
		};
		if (typeof RICETTA_FARMACI != "undefined") {
			return RICETTA_FARMACI.getToolDb();
		};
		return home.$.NS_DB.getTool({_logger : home.logger});
	},
	
	getRigaSelezionata: function() {
		return $("tr[idx="+idx_sel+"]");
	},

	setEvents : function() {
		
		//keyup sull'inserimento del risultato.
		$(document.documentElement).on("keyup",function(e){
			if(!home.MMG_CHECK.isDead()){return;}
			
			switch(e.keyCode) {
			
			case 40: //40 freccia giu'
				
				var risInput = RICETTA.getRigaSelezionata().find(".classRisultato input");
				
				idx_sel = parseInt(idx_sel)+1;
				
				RICETTA.selectRiga(idx_sel, classRiga);
				
				if(risInput.is(':focus')) {
					RICETTA.getRigaSelezionata().find(".classRisultato input").focus();	
				}
				break;
			
			case 38: //38 freccia su
				
				var risInput = RICETTA.getRigaSelezionata().find(".classRisultato input");
				
				idx_sel = parseInt(idx_sel)-1;
				
				RICETTA.selectRiga(idx_sel, classRiga);
				
				if(risInput.is(':focus')){
					RICETTA.getRigaSelezionata().find(".classRisultato input").focus();	
				}
				break;
				
			//32 barra spaziatrice
			case 32:
				var riga = RICETTA.getRigaSelezionata();
				if(!(riga.find("input").is(':focus'))) {
					RICETTA.selectRiga(idx_sel, classRiga);
					
					var check = riga.find(".tdAction input");
					
					if(check.is(":checked")){
						check.removeAttr("checked");
					}else{
						check.attr("checked","checked");
					}
					check.trigger("change");
				}
				break;
			
			case 113: //113 tasto f2
				e.preventDefault();
				$(".butStampaRicetta").trigger("click");
				break;
			
			//114 tasto f3	
			case 115:
				e.preventDefault();
				$(".butSalvaRicetta").trigger("click");
				break;
			default:
			}
		});
		

		$(".classQuantita").find("input").on("blur", function() {
			var $inp = $(this);
			if (!home.NS_MMG_UTILITY.checkIsNumber($(this).val())) {
				$inp.val("").focus();
				home.NOTIFICA.warning({
					message : traduzione.lblInsValNum,
					title : "Attenzione",
					timeout:"15"
				});
				return;
			}
		});

		$(".butSalvaRicetta").on("click", function() {
			if(!home.MMG_CHECK.isDead()){return;}
			RICETTA.apriPreSalvataggio('SAVE_ONLY');
		});

		$(".butStampaRicetta").on("click", function() {
			if(!home.MMG_CHECK.isDead()){return;}
			RICETTA.apriPreSalvataggio('PRESCRIZIONE');
		});

		$(".classEsenzione input").on(
				"mousedown",
				function(e) {

					var tipoRicetta = RICETTA.getType(classRiga);
					if (tipoRicetta == 'RR_ACCERTAMENTI') {
						RICETTA_ACCERTAMENTI.setIDX($(this).parent().parent()
								.attr("idx"), true);
					} else {
						RICETTA_FARMACI.setIDX($(this).parent().parent().attr(
								"idx"), true);
					}

					if (e.button == '2') {
						$esenzioni.test(e, this);
					}

				});

		$("#cmbRisultati").on("change", function() {
			var numRow = $(this).val();
			RICETTA.reload(numRow);
		});

		if ( typeof menuCommons != "undefined" ) 
		{
			$commons = $("#iCommonsFunction").contextMenu(menuCommons,{openSubMenuEvent: "click", openInfoEvent: "click"});
			$("#iCommonFunctions").on("click", function(e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				$commons.test(e, this);
			});
		}
	},

	// ovverride da parte di RICETTA_FARMACI
	checkPreSalvataggio: function( callbackOk ) {
		RICETTA.checkPreSalvataggioCommon( callbackOk );
	},
	
	checkPreSalvataggioCommon: function( callbackOk ) {
		// controllo esenzioni aperte
		// controllo che il paziente non abbia esenzioni L02,L04,048,046,M50,040. Nel caso le abbia, chiedo conferma prima di procedere
		
		if (home.CARTELLA.getRegime() == 'LP') {
			callbackOk();
			return;
		}
		
		var listaEsenzioni = home.ASSISTITO.getEsenzioni(null, null);
		
		var vEsenzioni = "";
		var cmb = $("<select></select>")
		cmb.attr("multiple", "multiple");
		cmb.attr("id","cmbEsenzioniAperte");
		cmb.attr("style", 'width:560px; border: 1px solid grey; margin-top: 10px; margin-bottom: 10px; padding: 5px;');

		//TODO: Da inserire le esenzioni per malattia rara
		
		for ( var i = 0; i < listaEsenzioni.length; i++) {
			
			var vCodEse = listaEsenzioni[i].CODICE_ESENZIONE;
			var vDescrEse = listaEsenzioni[i].CODICE_ESENZIONE + " - " + listaEsenzioni[i].DESCR_ESENZIONE;
			
			if (vCodEse == 'L02' || /*INVALIDI LAVORO CON R.CAP.LAV. SUP. 2/3 FINO A 79%*/
				vCodEse == 'L03' || /*INVALIDI PER LAVORO CON R.C.L. MIN. 2/3*/
				vCodEse == 'L04' || /*INFORT. SUL LAVORO O AFFETTI MAL.PROFESS*/
				vCodEse == '040' || /*NEONATI PREMAT. IMMAT. A TERMINE CON RICOVERO IN TERAPIA INTEN. NEON*/
				vCodEse == '041' || /*NEUROMIELITE OTTICA*/
				vCodEse == '046' || /*SCLEROSI MULTIPLA*/ 
				vCodEse == '048' || /*SOGG.AFF. DA PATOL.NEOPLAST. MALIGNE E DA TUMORI DI COMPORT. INCERTO*/ 
				vCodEse == '050' || /*SOGG. IN ATTESA DI TRAP.(RENE,CUORE,POLMONE,FEGATO,PANCREAS,MIDOLLO)*/ 
				vCodEse == '052' || /*SOGG. SOTTOPOSTI A TRAP.(RENE,CUORE,POLMONE,FEGATO,PANCREAS,MIDOLLO)*/
				vCodEse == '054' || /*SPONDILITE ANCHILOSANTE*/
				vCodEse == 'M50' || /*ESENTE PER STATO DI GRAVIDANZA (EX D.M. DEL 10/09/1998) - IN GRAVIDANZA A RISCHIO;*/
				vCodEse == 'S03' ||	/*INVALIDI PER SERVIZIO, CAT. DA VI A VIII*/
				vCodEse.substring(0,1) == 'R' /*cerco eventuali esenzioni per malattia rara del paziente*/
			){
				
				vEsenzioni += vCodEse + ",";
				
				cmb.append($("<option/>", {
			        value: vCodEse,
			        text: vDescrEse
				}));
			}
		}

		//creo il div da mettere il dialog
		var div = $("<div></div>");
		div.html("<p>" + traduzione.lblEsePazAperte + vEsenzioni.substring(0, vEsenzioni.length - 1) + "<br/>"+traduzione.lblDesAssociare + "</p>");
		div.append(cmb);
		div.append("<div>"+ " " + traduzione.lblAllePrescr+"</div>");

		//seleziono la prima option della select multiple delle esezioni
		div.find("option:first-child").attr("selected","selected");
		
		if (vEsenzioni != "" && LIB.getParamUserGlobal('AVVISO_ESENZIONI_APERTE','S') == 'S'){
			var dialog = home.$.dialog(div,
					{
						id : "dialogConfirm",
						title : traduzione.lblConfermaPrescrizione,
						width : 600,
						showBtnClose : false,
						modal : true,
						movable : true,
						buttons : [ 
						{
							label : traduzione.lblProcediApplica,
							keycode : "13",
							'classe': "butVerde",
							action : function(ctx) {
								var optSel = home.$("select#cmbEsenzioniAperte option:selected");
								RICETTA.updEsenzioniObjSalvataggio(optSel.val(), optSel.text());
								home.$.dialog.hide();
								callbackOk();
							}
						},
						{
							label :traduzione.lblProcediSenzaApplica,
							action : function(ctx) {
								home.$.dialog.hide();
								callbackOk();
							}
						}, {
							label : traduzione.lblAnnulla,
							action : function(ctx) {
								home.$.dialog.hide();
							}
						} ]
					});
		} else {
			callbackOk();
		};
	},
	
	apriDialogData:function(obj, vType){
	
		var ta = $("<input/>", { value:obj.text() });
		
		$.dialog(ta, {
			'buttons' 			: [{ label: "Annulla", action: function (ctx){
				$.dialog.hide();
        	  }}],
			'title' 			: "Modifica data",
			'ESCandClose'		: true,
			'created'			: function(){ $('.dialog').focus(); },
			'height'			: 240,
			'width'				: 250
		});
		
		ta.hide().Zebra_DatePicker({always_visible: ta.parent(), direction:false, onSelect: function(data,dataIso) {

			RICETTA.updRiga({
				"iden_per"		: home.baseUser.IDEN_PER,
				"tabella"		: vType,
				"nome_campo"	: "DATA_ISO",
				"iden_tabella"	: obj.closest("tr").attr("iden"),
				"valore"		: dataIso
				}, RICETTA.reload );
			}
		});
	},
	
	apriPreSalvataggio : function(type) {
		$.when(RICETTA.checkDati()).then(function() {
			var ricetta = RICETTA.getType(classRiga);
			var idenProdotti = RICETTA.getProdotti();
			var idenProblemi = RICETTA.getProblemi();
			
			/*Controlli sui prodotti in prescrizione
			 */
			var prodotti = ricetta == "RR_FARMACI" ? objSalvataggio.farmaco : objSalvataggio.accertamento;
			
			var avviso_ricetta_creata = false;
			
			for (var p=0; p < prodotti.length; p++) {
				/*Se ci sono ricette dematerializzate differite da approvare*/
				if (prodotti[p].da_stampare == "D") {
					home.NOTIFICA.warning({
						title: "Attenzione",
						message: "Non &egrave; possibile riprescrivere ricette dematerializzate ancora da confermare o stampare",
						timeout:"15"
					});
					return;
				}
				if (!avviso_ricetta_creata && prodotti[p].da_stampare == "S" && LIB.isValid(prodotti[p].iden_ricetta) && prodotti[p].iden_ricetta != "") {
					avviso_ricetta_creata = true;
					home.NOTIFICA.warning({
						title: "Attenzione",
						message: "La ricetta è già stata creata ed è disponibile nell'elenco ricette. Proseguendo, verrà ricreata.",
						timeout:"15"
					});
				}
			}

			RICETTA.checkPreSalvataggio( okPrescrivi );
			
			function okPrescrivi() {

				if (type == 'SAVE_ONLY') {
					RICETTA.save();
				} else {
					var url = "";

					switch (ricetta) {
						case 'RR_FARMACI':
							if (objSalvataggio.farmaco.length < 1) {
								return alert(traduzione.lblNoPrescrSelezionata);
							}
							url = "MMG_SALVATAGGIO_RR";
							url += "&FARMACI=" + idenProdotti;
							url += "&PROBLEMI=" + idenProblemi;
							break;
	
						case 'RR_ACCERTAMENTI':
	
							if (objSalvataggio.accertamento.length < 1) {
								return alert(traduzione.lblNoPrescrSelezionata);
							}
							url = "MMG_SALVATAGGIO_ACCERTAMENTI";
							url += "&ACCERTAMENTI=" + idenProdotti;
							url += "&PROBLEMI=" + idenProblemi;
							break;
					}
					home.NS_MMG.apri(url);
				}
			}
		});
	},

	// override
	updEsenzioniObjSalvataggio: function() { },

	checkBlocco : function() {
		$("." + classRiga).each(function() {
			if ($(this).attr("blocco") != 'S') {
				$(this).find(".icon-lock").hide();
			} else {
				$(this).find(".icon-lock").show();
			}
		});
	},

	checkCronica : function(classRiga) {
		$("." + classRiga).each(
				function() {
					if ($(this).attr("cronica") == 'S') {
						$(this).addClass("RRCronica");
						$(this).find(".icon-hourglass").removeClass(
								"RRGreen RRYellow RRRed");
					} else {
						$(this).removeClass("RRCronica");
					}
				});
	},

	checkCrono : function(classRiga) {

		$("." + classRiga).not(".RRCronica").each(
				function() {
					var colore = $(this).attr("coloreIcona");
					$(this).find(".icon-hourglass").removeClass(
							"RRGreen RRYellow RRRed");

					switch (colore) {

					case 'V':
						$(this).find(".icon-hourglass").addClass("RRGreen")
								.attr("title", "Terapia riprescrivibile");
						break;

					case 'G':
						$(this).find(".icon-hourglass").addClass("RRYellow");
						break;

					case 'R':
						$(this).find(".icon-hourglass").addClass("RRRed");
						break;

					default:

						break;
					}
				});
	},

	/*Oggetto Deferred, non boolean*/
	checkDati : function() {
		return home.NS_MMG.checkAccesso();
	},

	checkPA : function(classRiga) {

		$("." + classRiga).each(function() {
			var t = $(this).find(".classPA");
			if ($(this).attr("pa") == 'S') {
				t.find("input").attr("checked", "checked");
			} else {

			}
		});
	},

	// funzione per ottimizzare il controllo delle informazioni
	checkInfoFarmaci : function(classRiga, pIdenRiga) {

		var t = $(this).find(".classPA");
		$(".icon-attention").removeClass("RRIconRed RRIconYellow RRIconGreen");
		
		if(typeof pIdenRiga != 'undefined'){
			var row = $("."+classRiga+"[iden="+pIdenRiga+"]");
			RICETTA.checkRigaFarmaci(row);
		}else{
			$("." + classRiga).each(function() {
				RICETTA.checkRigaFarmaci($(this));
			});	
		}
	},

	checkInfoAccertamenti: function(classRiga, pIdenRiga) {
		if(typeof pIdenRiga != 'undefined'){
			var row = $("."+classRiga+"[iden="+pIdenRiga+"]");
			RICETTA.checkRigaAccertamenti(row);
		}else{
			$("." + classRiga).each(function() {
				RICETTA.checkRigaAccertamenti($(this));
			});	
		}
	},
	
	checkRigaAccertamenti:function(row){
		
		// Attivo
		if (row.attr("attivo") == 'N') {
			row.find(".tdAction i").hide();
			row.find("td:not(.classRisultato)").find("input").attr("disabled", true);
			row.addClass("RRDisattivo");
			row.attr({
				"title": "Accertamento non presente nel catalogo"
			});
		}

		// Cronica
		if (row.attr("cronica") == 'S') {
			row.addClass("RRCronica");
			row.find(".icon-hourglass").removeClass(
					"RRGreen RRYellow RRRed");
		} else {
			row.removeClass("RRCronica");
		}

		/* Da stampare - fatto da css
		var da_stampare = row.attr("daStampare");
		if (da_stampare == 'S' || da_stampare == 'D') {
			row.find(".icon-doc").show();
			if (da_stampare == 'D') {
				row.find(".icon-doc").css("background","yellow");
			}
		} else {
			row.find(".icon-doc").hide();
		}*/

		// Nota
		if (row.attr("note_prescrizione") == '') {
			row.find(".icon-pencil").hide();
		}

		//controllo per medicina d'iniziativa
		if(home.baseUser.TIPO_UTENTE != 'M' ){
			$("i.medIniz").hide();
		}
	},
	
	checkRigaFarmaci:function(row){
	
		// PA
		if (row.attr("pa") == 'S') {
			row.find(".classPA input").attr("checked", true);
		}

		// Attivo
		if (row.attr("attivo") == 'N') {
			row.addClass("RRDisattivo");
			//row.find(".tdAction i").hide();
			row.find("input").attr("disabled", true);
			row.attr({
				"title": "Farmaco non in commercio"
			});
		}

		// Rimanenza
		if(row.attr("rimanenza") != ''){
			
			/* 19/8/2014 lucas: modificata per considerare i gg di terapia rimanenti e non la rimanenza del farmaco stesso */
			/* 16/10/2014 lucas: cambiata la logica del controllo in quanto non metteva l'icona di colore rosso per i farmaci finiti */
			/* 14/11/2014 lucas: aggiunte regole css e commentato (fino alla verifica che funzioni il tutto) il codice js che nascondeva le icone a seconda dell'attributo */
			/* 25/02/2015 lucas: Fusetti accetta (finalmente) il fatto che si debba considerare il farmaco e non il principio attivo. Speriamo duri */
			/* 30/07/2015 lucas: corretta la funzione in quanto c'era un '$(this)' al posto di un 'row' */
			
			var rimanenza_function = row.attr("rimanenza").split("@");
			var rimanenza = parseInt(rimanenza_function[4]);
			
			/*
			 * rimanenza_function[0] --> rimanenza principio attivo
			 * rimanenza_function[1] --> rimanenza principio attivo in giorni
			 * rimanenza_function[2] --> quantità totale della prescrizione selezionata
			 * rimanenza_function[3] --> rimanenza farmaco
			 * rimanenza_function[4] --> rimanenza farmaco in giorni
			 */
			
			if (rimanenza > 15) {
				row.find(".icon-attention").addClass("RRIconGreen");
			} else if (rimanenza <= 5 ) {
				row.find(".icon-attention").addClass("RRIconRed");
			} else if (rimanenza > 5 && rimanenza <= 15) {
				row.find(".icon-attention").addClass("RRIconYellow");
			} else {
				// TODO:mettere qualche istruzione se si vuole gestire il fatto
				// che non si possa calcolare la rimanenza
			}
		}
		
		// Sostituibilita'
		if (row.attr("sost") == 'N'
				&& row.attr("tiporiga") != 'ins') {
			var rigaSost = row.find(".classSost");
			rigaSost.find("select").show();
			rigaSost.find("select").val(row.attr("cod_sost"));
			rigaSost.find("input").attr("checked", "checked");
		}

		// Cronica
		if (row.attr("cronica") == 'S') {
			row.addClass("RRCronica");
			row.find(".icon-hourglass").removeClass(
					"RRGreen RRYellow RRRed");
		} else {
			row.removeClass("RRCronica");
		}

		// Da stampare
		/*if (row.attr("daStampare") == 'S') {
			row.find(".icon-doc").show();
		}*/

		// Piano Terapeutico
		/*if (row.attr("pt") == 'N') {
			row.find(".iconPT").hide();
		}*/

		// SSN
		if (row.attr("concedibile") == 'N'
				|| row.attr("classe_farmaco") == 'C') {
			row.find(".iconSSN").hide();
		}
		
		// Ripetibile
		if (row.attr("ripetibile") != 'S') {
			row.find(".iconRipetibile").hide();
		}
		
		//controllo per medicina d'iniziativa
		if(home.baseUser.TIPO_UTENTE != 'M' ){
			$("i.medIniz").hide();
		}
	},

	checkPT : function(row) {

		var textPT = row.find(".iconPT").attr("title");
		var data = '';
		data = row.attr("data_fine");
		var dataFine = '';
		if (data != '') {
			dataFine += data.substr(6, 2) + '/';
			dataFine += data.substr(4, 2) + '/';
			dataFine += data.substr(0, 4);
		}
		textPT += dataFine;

//		var dataOggi = NS_MMG_UTILITY.getData('yyyyMMdd');
		var dataOggi = moment().format('YYYYMMDD');

		if ((parseInt(dataOggi) > parseInt(data)) && data != '') {
			row.find(".iconPT").css("color", "red").addClass("scaduto");
		}

		row.find(".iconPT").attr("title", textPT);
	},

	checkQTA : function(pValue) {
		if (pValue == null || pValue == '') {
			return '1';
		} else {
			return pValue.trim();
		}
	},

	checkRiga : function(classRiga) {

		var typeRR = RICETTA.getType(classRiga);

		switch (typeRR) {

		case 'RR_FARMACI':

			RICETTA.checkInfoFarmaci(classRiga);
			RICETTA.checkCrono(classRiga);
			// RICETTA.checkCronica(classRiga);
			// RICETTA.checkRimanenza(classRiga);
			// RICETTA.checkStampa(classRiga);
			// RICETTA.checkSostituibilita(classRiga);
			// RICETTA.checkPA(classRiga);
			// RICETTA.checkBlocco(classRiga);
			break;

		case 'RR_ACCERTAMENTI':
			RICETTA.checkInfoAccertamenti(classRiga);
			RICETTA.checkCrono(classRiga);
			// RICETTA.checkCronica(classRiga);
			// RICETTA.checkStampa(classRiga);
			break;
		}
	},

	checkRimanenza : function(classRiga) {
		
		/* 19/8/2014 lucas: modificata per considerare i gg di terapia rimanenti e non la rimanenza del farmaco stesso */
		
		$(".icon-attention").removeClass("RRIconRed RRIconYellow RRIconGreen");
		$("." + classRiga).each(function() {
			var rimanenza_function = row.attr("rimanenza").split("@");
			var rimanenza = parseInt(rimanenza_function[1]);
			if (rimanenza == '') {
				// TODO:mettere qualche istruzione se si vuole gestire il fatto
				// che non si possa calcolare la rimanenza
			} else if (rimanenza <= 5) {
				$(this).find(".icon-attention").addClass("RRIconRed");
			} else if (rimanenza > 5 && rimanenza <= 15) {
				$(this).find(".icon-attention").addClass("RRIconYellow");
			} else {
				// che si fa?
			}

		});
	},

	checkSostituibilita : function(classRiga) {
		var arrRighe = $("." + classRiga);
		arrRighe.each(function(a, b) {
			if ($(this).attr("sost") == 'N'
					&& $(this).attr("tiporiga") != 'ins') {
				var rigaSost = $(this).find(".classSost");
				rigaSost.find("select").show();
				rigaSost.find("select").val($(this).attr("cod_sost"));
				rigaSost.find("input").attr("checked", "checked");
			}
		});
	},

	chiudiAttesa : function(idx) {
		try {
			parent.NS_MMG_UTILITY.removeVeloNero("iFrameRiepilogo"
					+ indiceIframe);
		} catch (e) {
			home.logger.debug('Errore nella rimozione velo nero: '
					+ e.description);
		}
	},
	
	chooseType: function( value ) {
		
		var button		= $( document.createElement('button') ).attr('type', 'button').addClass('btn').css("height","20px");
		var icon		= $( document.createElement('i') ).addClass('icon-ok');

		var ricetta_rossa		= button.clone().text('R. Rossa').attr({ 'id' : 'R_ROSSA', 'data-value' : 'N' });
		var ricetta_dem			= button.clone().text('R. Demat.').attr({
			'id' : 'R_DEM',
			'data-value' : home.RICETTA_UTILS.invioImmediato("S") ? 'S' : 'D'
		});
//		var ricetta_dem_diff	= button.clone().text('R. Demat. Differita').attr({ 'id' : 'R_DEM_DIFF', 'data-value' : 'D' });
		var ricetta_dem_manuale = $(document.createElement("i")).addClass("icon-info-circled").attr('id', "R_DEM_MANUALE").on("click",function() {
			home.MANUALE.open("ricetta_dematerializzata");
		});
	
		if( $('.iconContainer').find('#R_ROSSA, #R_DEM').length == 0 ) { //, #R_DEM_DIFF
			
			$('.iconContainer').append(ricetta_dem_manuale, ricetta_rossa, ricetta_dem); //, ricetta_dem_diff

			$('.iconContainer button').off().on('click', function(event) {
				
				$('#R_ROSSA, #R_DEM').removeClass('selected').find('i.icon-ok').remove(); //, #R_DEM_DIFF
				$(this).addClass('selected').append( icon );
				RICETTA.setDematerializzata($(this).attr('data-value'));
			});
			
			switch (RICETTA.isDematerializzata()) {
				case "D":
				case "S":
					$('#R_DEM').trigger("click");
					break;
				case "N":
				default:
					$('#R_ROSSA').trigger("click");
			}
		}
		
		if( typeof value != 'undefined' ) {
			$('.iconContainer').find('button[data-value=\''+ value +'\']').trigger('click');
		}
	},

	context_menu : {

		applicaEsenzioni: function(riga) {
			
			var ese = riga.find(".classEsenzione input").val();
			var codEse = riga.attr("cod_esenzione");

			$(".tdAction input:checked").each(function() {
				var _riga = $(this).closest("tr");

				//controllo se la riga è riferita ad un presidio o cose del genere o ad un farmaco di classe C (magari la prossima volta controlla se è solo per i farmaci o anche per gli accertamenti, PIRLA!!!!)
				if( RICETTA.getTipoRicetta() == 'FARMACI' && 
							(!LIB.isValid(_riga.attr("classe_farmaco")) ||
								(_riga.attr("classe_farmaco") == 'C' && ( codEse != 'G02' || codEse != 'G01' )))){
					return;
				}
				_riga.find(".classEsenzione input").val(ese);
				_riga.attr("cod_esenzione", codEse);
			});
		},
		
		cancellaEsenzioni:function(){
			
			var ese = '';
			var codEse = '';

			$(".tdAction input:checked").each(function() {
				var _riga = $(this).closest("tr");

				_riga.find(".classEsenzione input").val(ese);
				_riga.attr("cod_esenzione", codEse);
			});
		},
		
		forzatura: function(riga, valore) {
			$(riga).attr("forzatura", valore);
		},
		
		forzaturaMulti: function(valore) {
			
			if(!home.MMG_CHECK.isDead()){return;}
			
			var selRows = $("tr[iden]").find(".tdAction input:checked").closest("tr");
			selRows.each(function() {
				selRows.attr("forzatura",valore);
			});			
		},
		
		cambiaDataMulti:function(vType){
			
			var counter = 0;
			
			if(!home.MMG_CHECK.isDead()){return;}

			var arIden = [];
			$("tr[iden]").not("[tiporiga='ins']").find(".tdAction input:checked").each(function() {
				if($(this).closest("tr").attr("sito") == 'MMG'){					
					arIden.push($(this).closest("tr").attr("iden"));	
				}else{
					counter++;
				}
			});
			
			if(arIden.length>0){
				RICETTA.cambiaDataMulti(vType, arIden);
			}
			
			//avviso che alcune righe non sono state cambiate
			if(counter>0){
				home.NOTIFICA.warning({
					message: traduzione.deniedCambioDataMIMulti,
					title: "Attenzione",
					timeout:"15"
				});
			}
		}
	},

	creaComboRisultati : function() {

		var div = $("<div>");
		div.attr("id", "divCmbRes");
		div.css("float", "left");
		div.css("padding-left", "10px");
		div.html("Risultati: ");
		var combo = $("<select></select>");
		combo.attr("id", "cmbRisultati");
		combo.append(creaOption("75", "75"));
		combo.append(creaOption("150", "150"));
		combo.append(creaOption("300", "300"));
		combo.append(creaOption("10000", "ALL"));
		
		div.append(combo);
		
		$(".footerTabs").append(div);
		
		function creaOption(val, html) {
			var opt = $("<option></option>");
			opt.attr("value", val);
			opt.html(html);

			return opt;
		}

		if (NS_MMG_UTILITY.getUrlParameter("NUM_ROW") != '') {
			$("#cmbRisultati").val(NS_MMG_UTILITY.getUrlParameter("NUM_ROW"));
		}
	},
	
	creaDivStampa:function(){
		
		var divStampa 	= $( document.createElement('button') ).attr({'type':'button', 'id':'btnStampaRapida'}).addClass('btn').text(traduzione.btnStampaRapida);
		var icon		= $( document.createElement('i') ).addClass('icon-ok').css({"color":"green","padding-left":"5px"});
		var iconNo		= $( document.createElement('i') ).addClass('icon-cancel-1').css({"color":"red", "padding-left":"3px"});
		var iconInfo	= $( document.createElement('i') ).addClass('icon-info-circled').css({"color":"#274069", "padding-left":"2px"}).on("click",
							function(){
								var div = '<div>'+traduzione.msgDialogStampa1+"<i class='icon-ok' style='color:green;'></i>"+traduzione.msgDialogStampa2+'</div>';
								$.dialog(div, {
									'buttons'			: [{ label: "Ok", keycode : "13", 'classe': "butVerde", action: function (ctx)
							        	  {
										$.dialog.hide();
						        	  }}],
									'title' 			: traduzione.dialogInfoStampa,
									'ESCandClose'		: true,
									'created'			: function(){ $('.dialog').focus(); },
									'height'			: 150,
									'width'				:340
								});
								return false;
							});
		
		divStampa.append(iconInfo).append(iconNo);
		
		$(".footerTabs").append(divStampa);
		
		if(home.baseUser.SALVATAGGIO_RAPIDO_RR == 'S'){
			$('#btnStampaRapida').removeClass('selected').find('i.icon-cancel-1').remove();
			$('#btnStampaRapida').addClass('selected').append( icon );
			home.baseUser.SALVATAGGIO_RAPIDO_RR = 'S';
		}
		
		$('#btnStampaRapida').on('click', function(event) {
			
			if($(this).hasClass('selected')){
				$(this).removeClass('selected').find('i.icon-ok').remove();
				$(this).append(iconNo);
				home.baseUser.SALVATAGGIO_RAPIDO_RR = 'N';
				
			}else{
				
				$(this).removeClass('selected').find('i.icon-cancel-1').remove();
				$(this).addClass('selected').append( icon );
				home.baseUser.SALVATAGGIO_RAPIDO_RR = 'S';
			}
		});
		
		
	},

	disableRiga : function(idx) {
		$("tr[idx=" + idx + "]").removeClass("TRselected")
				.addClass("TRdeleted");
	},

	duplicateRow : function() {

		var idxNewRiga = $("table#tableRisultati").attr("idx_next");
		$("table#tableRisultati").attr("idx_next", (parseInt(idxNewRiga) + 1));

		var newRow = $("tr[idx=" + idx_sel + "]").clone();
		newRow.attr("idx", idxNewRiga);
		newRow
				.removeClass("RRYellow RRRed RRGreen RRIconRed RRIconGreen RRIconYellow RRCronica");

		return newRow;
	},

	getProblemi : function() {
		// TODO: fare override nel file della ricetta corretta
	},

	getProdotti : function() {
		// TODO: fare override nel file della ricetta corretta
	},

	// funzione che valorizza il title dell'icona del triangolino
	getRimanenza: function(obj,type) {
		
		//per informazioni sui risultati vedere package RR_INFO_PRESCRIZIONE

		var a_capo = typeof type != 'undefined' ? '<br/>' : '\n' ;
		
		var msg = '';

		if (typeof obj.attr("rimanenza") != 'undefined'
				&& obj.attr("rimanenza") != '') {

			var rim = obj.attr("rimanenza").toString();
			var rimanenza_function = rim.split("@");
			var rimanenza = rimanenza_function[0];
			var rimanenza_gg = rimanenza_function[1];
			var quantita_scatola = rimanenza_function[2]; 
			var rimanenza_farmaco = rimanenza_function[3];//da verificare il corretto calcolo in base alla rimanenza per principio attivo. Comincia a risultare difficile
			var rimanenza_gg_farmaco = rimanenza_function[4];
			
			try{
				rimanenza_farmaco = parseInt(rimanenza_function[3]) < 0 ? '0' : rimanenza_function[3];
			}catch(e){
				rimanenza_farmaco = rimanenza_function[3];
			}
		

			if (rimanenza == null || rimanenza == '') {
				msg = traduzione.lblNonCalcolabile;
			} else if (rimanenza < 0) {
				msg = traduzione.lblFarmacoTerminato + rimanenza + ')';
			} else {
				msg = ' ' 	+ traduzione.lblRimanenza + rimanenza + a_capo
							+ traduzione.lblRimanenzagg + rimanenza_gg + a_capo 
							+ a_capo
							+ traduzione.lblRimanenzaFarmaco + rimanenza_farmaco  + a_capo 
							+ traduzione.lblRimanenzaggFarmaco + rimanenza_gg_farmaco + a_capo
							+ a_capo
							+ traduzione.lblQtaScatola + quantita_scatola + a_capo
							+ a_capo
							+ traduzione.lblInfoRimanenza
							+ a_capo
							+ traduzione.lblInfoRimanenza2;
			}
		} else {
			msg = traduzione.lblNonCalcolabile;
		}

		return msg;
	},
	
	/*
	 * Se non c'e' un metodo migliore...
	 */
	getTipoRicetta: function() {
		
		var ret =  (typeof RICETTA_FARMACI != "undefined") ? "FARMACI" : "ACCERTAMENTI" ;
		return ret;
	},

	getType : function(classe) {

		var v_ret = '';

		switch (classe) {

		case 'trRigaFarmaci':
			v_ret = 'RR_FARMACI';
			break;

		case 'trRigaAccertamenti':
			v_ret = 'RR_ACCERTAMENTI';
			break;

		default:
			break;
		}

		return v_ret;
	},
	
	getValueDematerializzata:function(){
		
		var valDemat = (classRiga == 'classAccertamento') ? 'N' : 'S'; //TODO: implementare la valorizzazione della variabile per quanto riguarda i farmaci
		return valDemat;
	},
	
	isDematerializzata: function() {
		/*
		 * Fase di test per soli farmaci
		 */
		if (typeof RICETTA_FARMACI == "undefined" && (home.baseUser.GRUPPO_PERMESSI.indexOf('DEMAPRESTAZIONI') == -1))
			return "N";
		if (!LIB.isValid(RICETTA._isDematerializzata)) {
			if (RICETTA.isDemaAbilitata() && typeof localStorage != "undefined" && LIB.isValid(localStorage[RICETTA.getTipoRicetta() + "_isDematerializzata"])) {
				RICETTA._isDematerializzata = localStorage[RICETTA.getTipoRicetta() + "_isDematerializzata"];
			} else {
				RICETTA.setDematerializzata("N");
			}
		}
		return RICETTA._isDematerializzata;
	},
	
	isDemaAbilitata: function() {
		return (home.baseUser.GRUPPO_PERMESSI.indexOf('DEMATESTER') != -1 && typeof RICETTA_FARMACI != "undefined")
				||
				(home.baseUser.GRUPPO_PERMESSI.indexOf('DEMAPRESTAZIONI') != -1 && typeof RICETTA_ACCERTAMENTI != "undefined");
	},
	
	setDematerializzata: function(s_n) {
		RICETTA._isDematerializzata = s_n;
		if (typeof localStorage != "undefined") {
			localStorage[RICETTA.getTipoRicetta() + "_isDematerializzata"] = s_n;
		}
	},

	onClose : function() {
		// TODO: da implementare dove serve
	},
	
	chiudischeda: null,

	reload : function(numRow) {

		if (LIB.isValid(numRow) && $.isNumeric(numRow)) {
			var url = "page?KEY_LEGAME=" + $("#KEY_LEGAME").val()
					+ home.NS_MMG.getCommonParameters() + "&NUM_ROW=" + numRow + "&IDFRAME=" +$('#IDFRAME').val();
			if (numRow == '10000') {
				alert(traduzione.lblWaitSeconds);
			}
			document.location.replace(url);
		} else {
			document.location.reload(true);
		}
		if (LIB.isValid(RICETTA.chiudischeda)) {
			home.NS_FENIX_TOP.chiudiScheda({n_scheda: RICETTA.chiudischeda});
			RICETTA.chiudischeda = null;
		}
	},

	removeDisableRiga : function(idx) {
		$("tr[idx=" + idx + "]").removeClass("TRdeleted");
	},
	
	canclose: $.Deferred(),

	save : function(INVIO_PACKAGE, stampa_ricetta) {
		
		if (!home.MMG_CHECK.isMedico()) {

			if (home.CARTELLA.IDEN_MED_PRESCR == ''
					|| home.CARTELLA.IDEN_MED_PRESCR == null) {
				home.NOTIFICA.error({
					message : "Inserire il medico prescrittore",
					title : "Attenzione"
				});
				home.$("#lblMedPrescrittore").addClass("evidenzia");
				return;
			}
		}
		
		NS_LOADING.showLoading({destinazione: $("body")});

		if (typeof INVIO_PACKAGE == 'undefined') {
			INVIO_PACKAGE = 'N';
		}
		objSalvataggio.INVIO_PACKAGE = INVIO_PACKAGE;
		objSalvataggio.dematerializzata = RICETTA.isDematerializzata();
		objSalvataggio.SHOW_FARMACO_ORIGINALE = LIB.getParamUserGlobal("SHOW_FARMACO_ORIGINALE", "1");
		
		/*objSalvataggio.rootNode = "ricetta";
		var param = JSON.stringify(objSalvataggio);
		
		if (window.console)
			console.log( objSalvataggio );*/
		
		var param = json2xml({"ricetta": objSalvataggio});
		
		RICETTA.getToolDb().call_procedure({
            id:'RR_SALVA_PRESCRIVI',
            parameter: {
            	"p_request": { v : param, t : 'C', d: 'I'},
            	"p_result": {t: 'C', d: 'O'}
            }
		}).done( function(resp) {
			if (resp.p_result.indexOf('OK')==0) {
				var control_object = {
					done: function () {
						RICETTA.reload();
					},
					fail: function () {
						RICETTA.reload();
					}
				};
				
				if (LIB.isValid(objSalvataggio.dematerializzata)) {
					control_object.dematerializzata = objSalvataggio.dematerializzata;
				} else {
					control_object.dematerializzata = "N";
				}
		
				if (typeof stampa_ricetta == "undefined") {
					stampa_ricetta = true;
				}
				control_object.stampa_ricetta = stampa_ricetta;
					
				if (INVIO_PACKAGE == 'S')
					home.RICETTA_UTILS.stampaRicette(resp.p_result.substring(3), control_object);
				else
					control_object.done();
				
			} else {
				home.NOTIFICA.error({
					message : resp.message
				});
			}
		});
		
	},

	saveStampa : function(stampa_ricetta) {
		if(!home.MMG_CHECK.isDead()){return;}
		RICETTA.save("S", stampa_ricetta);
		/*RICETTA.reload();*/
	},

	selectRiga : function(idx, classRiga) {
		$("." + classRiga).removeClass("TRselected");
		$("tr[idx=" + idx + "]").addClass("TRselected");
		$('.contentTabs').data('jsp').scrollToElement($("tr[idx=" + idx + "]"), false);
	},

	setEventNewRow : function(riga) {
		// TODO:implementare nel file js dove serve
	},

	setValueRiga : function(type, className, value, indice) {

		var row = $("[idx=" + indice + "]");

		switch (type) {

		case 'input':
			row.find("." + className).find("input").val(value);
			break;

		case 'label':
			row.find("." + className).not(".hidden").html(value);
			break;

		default:
			row.find("." + className).val(value);
			break;
		}
	},

	cancella : function(pTipo, pArIden) {

		home.RICETTA_UTILS.cancella(pTipo, pArIden, {
			done: function(response) {
				/*Messaggio di errore gestito in RICETTA_UTILS*/
				//fatto perchè rimaneva appeso la schermata di loading
				NS_LOADING.hideLoading();
				//ricarico la parte della ricetta
				RICETTA.reload();
			},
			fail: NS_LOADING.hideLoading
		}, traduzione.lblDialogCancella);
	},

	cambiaDataMulti: function(pTipo, pArIden)
	{
		var ta = $("<input/>");
		$.dialog(ta, {
			'ESCandClose'		: true,
			'created'			: function(){ $('.dialog').focus(); },
			'buttons'			: [{ label: "Annulla", keycode : "13", 'classe': "butVerde", action: function (ctx) {
				$.dialog.hide();
        	  }}],
			'title' 			: "Modifica data accertamento",
			'height'			: 240,
			'width'				: 250
		});
		ta.hide().Zebra_DatePicker({always_visible: ta.parent(), direction: false, onSelect: function(data,dataIso) {
			
			RICETTA.updRighe({
				"iden_per"			: home.baseUser.IDEN_PER,
				"tabella"			: pTipo,
				"nome_campo"		: "DATA_ISO",
				"ar_iden_tabella"	: pArIden,
				"storicizza"		: "N",
				"valore"			: dataIso
			}, 	RICETTA.reload );
		}});
	},
	
	updateInfoRow : function(pRow, pTypeUpdate) {
		
		if(!home.MMG_CHECK.isDead()){return;}

		var tipoRicetta = RICETTA.getType(classRiga);
		var vIden = pRow.attr("iden");
		
		var resp; /*non sicuro che serva a qualcosa*/

		switch (pTypeUpdate) {

		case 'CRONICA':
			// case 'DELETED':
		case 'UNDELETED':
		case 'DELETED_CRONICA':
		case 'REMOVE_BLOCCO':

			var vFunction = 'SET_INFO_RR';
			var param = {
				"pIden" : {v: vIden, t: 'V'},
				"pTypeUpdate" : {v: pTypeUpdate, t: 'V'},
				"pTypeRicetta" : {v: tipoRicetta, t: 'V'},
				"pOut": {v: resp, t: 'V', d: 'O'}
			};
			break;

		default:
			return;
		}
		$.when(RICETTA.getToolDb().call_procedure({
			id: vFunction,
			parameter: param
		})).then(function() {
			RICETTA.checkRiga(classRiga);
		});
		
	},
	
	updRiga : function(param, callback) {
		
		if(!home.MMG_CHECK.isDead()){return;}
		
		RICETTA.getToolDb().call_procedure({
            id:'UPD_CAMPO_STORICIZZA',
            parameter: {
            	"pIdenPer" 			: { v : param.iden_per, t : 'N'},
				"pTabella" 			: { v : param.tabella, t : 'V'},
				"pNomeCampo" 		: { v : param.nome_campo, t : 'V'},
				"pIdenTabella" 		: { v : param.iden_tabella, t : 'N' },
				"pNewValore" 		: { v : param.valore, t : 'V' },
				"pStoricizza" 		: { v : typeof param.storicizza == 'undefined' ? "S" : param.storicizza, t : 'V' },
				"pCampoIdenWhere" 	: { v : typeof param.campo_iden_where == 'undefined' ? "IDEN" : param.campo_iden_where, t : 'V' }
            }
		}).done( function() {
			if (typeof callback == 'function')
				callback();
		});
	},
	
	updRighe : function(param, callback) {
		
		if(!home.MMG_CHECK.isDead()){return;}
		
		RICETTA.getToolDb().call_procedure({
			id:'UPD_CAMPO_STORICIZZA_MULTI',
			parameter:
			{
				"pIdenPer" 			: { v : param.iden_per, t : 'N'},
				"pTabella" 			: { v : param.tabella, t : 'V'},
				"pNomeCampo" 		: { v : param.nome_campo, t : 'V'},
				"pArIdenTabella" 	: { v : param.ar_iden_tabella, t : 'A' },
				"pNewValore" 		: { v : param.valore, t : 'V' },
				"pStoricizza" 		: { v : typeof param.storicizza == 'undefined' ? "S" : param.storicizza, t : 'V' },
				"pCampoIdenWhere" 	: { v : typeof param.campo_iden_where == 'undefined' ? "IDEN" : param.campo_iden_where, t : 'V' }
			}
		}).done( function() {
			if (typeof callback == 'function')
				callback();
		});
	},
	
	associaProblema: function() 
	{
		if(!home.MMG_CHECK.isDead()){return;}
		
		var arRows = [riga._this];
		RICETTA.updAssociazioneProblema(arRows);
	},
	
	associaProblemaMulti: function ()
	{
		if(!home.MMG_CHECK.isDead()){return;}
		
		var arRows = [];
		$("tr[iden]").find(".tdAction input:checked").each(function() {
			arRows.push($(this).closest("tr"));
		});
		
		if(arRows.length<1)
		{
			home.NOTIFICA.warning({
				message: traduzione.lblSelAlmeno,
				title: "Attenzione",
				timeout:"15"
			});						
		}
		else
		{
			RICETTA.updAssociazioneProblema(arRows);
		}
	},
	
	updAssociazioneProblema : function(arRows) {

		toolKitDB.getResult("SDJ.R_PROBLEMA_ATTIVO", {
			"iden_utente" : home.baseUser.IDEN_PER,
			"iden_anag" : home.ASSISTITO.IDEN_ANAG
		}, null, function(resp) {
			var cmb = $("<select/>",{style:"width:100%"})
				.append($("<option/>", {"value" : ""}).text(""));
			$.each(resp, function(index, el) {
				cmb.append($("<option/>", {
					"value" : el.VALUE
				}).text(el.DESCR != null ? el.DESCR : ""));
			});
			cmb.find("option[value=" + arRows[0].attr("iden_problema") + "]").attr("selected", true);
			
			$.dialog(
					"<div>Selezionare il problema a cui associare la prescrizione</div>",
					{
						'id'				: "dialogConfirm",
						'title' 			: "Associa prescrizione a problema",
						'width'				: 350,
						'showBtnClose' 		: false,
						'modal' 			: true,
						'movable' 			: true,
						'ESCandClose'		: true,
						'created'			: function(){ $('.dialog').focus(); },
						'buttons' 			: [{
							
									label : traduzione.butApplica,
									keycode : "13",
									action : function(ctx) {
										var iden_problema = cmb.find("option:selected").val();
										var arIden = [];
										
										for ( var i = 0; i < arRows.length; i++ )
										{
											arRows[i].attr("iden_problema", iden_problema);
											if (arRows[i].attr("iden") != '')
												arIden.push(arRows[i].attr("iden"));
										}
										if (arIden.length > 0)
										{
											RICETTA.updRighe({
												"iden_per" 			: home.baseUser.IDEN_PER,
												"tabella" 			: typeof RICETTA_FARMACI != "undefined" ? "MMG_FARMACI": "MMG_ACCERTAMENTI",
												"nome_campo" 		: "IDEN_PROBLEMA",
												"ar_iden_tabella" 	: arIden,
												"valore" 			: iden_problema
											});
										}
										$.dialog.hide();
									}
								}, {
									label : traduzione.butChiudi,
									action : function(ctx) {
										$.dialog.hide();
									}
								} ]
					});
			$(".dialog-content-inner").append(cmb);
		});
	},
	
	/*
	 * 
	 * @param {string} flag_oscuramento S/N
	 * @param {object} dati_elemento: {tabella:'', iden_tabella:'', campo_multi:'', iden_multi:''}
	 * @param {object} callback: {singola: function(){}, multi: function(){}}
	 * @returns {undefined}
	 */
	oscura: function(flag_oscuramento, dati_elemento, callback) {
		if(!home.MMG_CHECK.isDead()){
			return;
		}
		
		var dialog = home.$.dialog( flag_oscuramento == "S" ? traduzione.lblConfermaOscuraPrescrizione : traduzione.lblConfermaDisOscuraPrescrizione, {
			id : "dialogConfirm",
			title : traduzione.lblOscuramentoTitle,
			width : 600,
			showBtnClose : false,
			modal : true,
			movable : true,
			buttons : [{
				label : traduzione.lblOscuraSingola,
				keycode : "13",
				'classe': "butVerde",
				action : function(ctx) {
					RICETTA.updRiga({
						"iden_per"			: home.baseUser.IDEN_PER,
						"tabella"			: dati_elemento.tabella,
						"nome_campo"		: "OSCURATO",
						"iden_tabella"		: dati_elemento.iden_tabella,
						"storicizza"		: "S",
						"campo_iden_where"	: "IDEN",
						"valore"			: flag_oscuramento
					}, function() {
						home.NOTIFICA.success({
							message: "Modifica oscuramento effettuata",
						});
						callback.singola(dati_elemento);
					});
					home.$.dialog.hide();
				}
			}, {
				label: traduzione.lblOscuraTutte,
				action: function(ctx) {
					home.RICETTA_UTILS.oscura({
						v_tabella: {v: dati_elemento.tabella, t:'V'},
						n_iden_anag: {v: home.ASSISTITO.IDEN_ANAG, t:'N'},
						v_campo_condition: {v: dati_elemento.campo_multi, t:'V'},
						v_valore_condition: {v: dati_elemento.iden_multi, t:'V'},
						v_oscuramento: {v: flag_oscuramento, t:'V'},
						n_iden_ute: {v: home.baseUser.IDEN_PER, t:'N'},
						v_username: {v: home.baseUser.USERNAME, t:'V'}
					}, function() {
						home.$.dialog.hide();
						callback.multi(dati_elemento);
					});
				}
			}, {
				label : traduzione.lblAnnulla,
				action : function(ctx) {
					home.$.dialog.hide();
				}
			} ]
		});
	},
	
	whereCanDeleteRow: function(tr){
		return  tr.attr("iden")!= '' && tr.attr("sito") == 'MMG'
			&& (
				typeof tr.attr("iden_utente") == "undefined"
				|| typeof tr.attr("iden_medico") == "undefined"
				|| home.MMG_CHECK.canDeleteSilent(tr.attr("iden_utente"), tr.attr("iden_medico"), false)
			);
	},
	
	whereCanDeleteRows: function() {
		var ret = true;
		$("tr[iden]").not("[tiporiga='ins']").has(".tdAction input:checked").each(function() {
			var tr = $(this);
			if (!RICETTA.whereCanDeleteRow(tr)) {
				ret = false;
				return false;
			}
		});
		return ret;
	}
};

// namespace per l'ordinamento della tabella
var TABLE = {

	checkOrder : function(tipoRicetta, colonna) {

		switch (tipoRicetta) {

		case 'RR_FARMACI':
			var tipo = colonna == 'DATA' ? orderFarmaco.data
					: orderFarmaco.farmaco;
			return tipo;
			break;

		case 'RR_ACCERTAMENTI':
			var tipo = colonna == 'DATA' ? orderAccertamento.data
					: orderAccertamento.accertamento;
			return tipo;
			break;
		}
	},

	collectRows : function() {
		// TODO:da implementare nei file js; deve ritornare un array di righe
	},

	insertRow : function(classRiga) {

		var idxNewRiga = $("table#tableRisultati").attr("idx_next");
		$("table#tableRisultati").attr("idx_next", (parseInt(idxNewRiga) + 1));

		var nuovaRiga = newRiga.clone();
		nuovaRiga.attr("idx", idxNewRiga);
		nuovaRiga.find(".tdAction input").attr("checked", "checked");
		if (classRiga != '') {
			nuovaRiga.addClass(classRiga);
		}

		$("tr[tipoRiga=ins]:first").before(nuovaRiga);

		var nR = $("tr[idx=" + idxNewRiga + "]");
		RICETTA.setEventNewRow(nR);

		return idxNewRiga;
	},

	orderRows : function(obj, tipoRicetta, columnSelected, typeOrder) {

		// recupero l'array di oggetti con il campo da ordinare
		var order = '';
		var arrRigaValore = '';

		home.logger.debug("ORDINAMENTO RICETTA " + tipoRicetta + ': '
				+ columnSelected);

		order = TABLE.checkOrder(tipoRicetta, columnSelected);

		order = order.toUpperCase();

		switch (order) {

		case 'ASC':

			arrRigaValore = TABLE.setArrayByColumn(columnSelected);
			arrRigaValore.sort(TABLE.sortArrayDesc);
			TABLE.setOrder(tipoRicetta, columnSelected, 'DESC');
			TABLE.setClass(obj, 'DESC');
			// alert(orderFarmaco.data + ' <> ' + orderFarmaco.farmaco);
			break;

		case 'DESC':

			arrRigaValore = TABLE.setArrayByColumn('');
			arrRigaValore.sort(TABLE.sortArrayAsc);
			TABLE.setOrder(tipoRicetta, columnSelected, '');
			TABLE.setClass(obj, '');
			// alert(orderFarmaco.data + ' <> ' + orderFarmaco.farmaco);
			break;

		default:

			arrRigaValore = TABLE.setArrayByColumn(columnSelected);
			arrRigaValore.sort(TABLE.sortArrayAsc);
			TABLE.setOrder(tipoRicetta, columnSelected, 'ASC');
			TABLE.setClass(obj, 'ASC');
			break;
		}

		// rimpiazzo le righe della table, tranne quella dell'inserimento
		TABLE.replaceRows(arrRigaValore);
	},

	replaceRows : function(arrayNew, className) {
		// TODO:implementare dove serve
	},

	setArrayByColumn : function(columnSelected) {
		// TODO:implementare dove serve
	},

	setClass : function(obj, ordine) {

		$(".intestazione").find("i").removeClass("iSelected").hide();

		switch (ordine) {

		case 'ASC':

			obj.find(".icon-up").addClass("iSelected").show();
			break;

		case 'DESC':

			obj.find(".icon-down").addClass("iSelected").show();
			break;

		case '':
		default:
			break;
		}
	},

	setOrder : function(tipoRicetta, colonna, ordine) {

		switch (tipoRicetta) {

		case 'RR_FARMACI':

			if (colonna == 'DATA') {
				orderFarmaco.data = ordine;
			} else {
				orderFarmaco.farmaco = ordine;
			}
			break;

		case 'RR_ACCERTAMENTI':

			if (colonna == 'DATA') {
				orderAccertamento.data = ordine;
			} else {
				orderAccertamento.accertamento = ordine;
			}
			break;
		}
	},

	sortArrayAsc : function(a, b) {

		var a1 = a.dataToOrder, b1 = b.dataToOrder;
		if (a1 == b1) {
			return 0;
		}
		return a1 > b1 ? 1 : -1;
	},

	sortArrayDesc : function(a, b) {

		var a1 = a.dataToOrder, b1 = b.dataToOrder;
		if (a1 == b1) {
			return 0;
		}
		return a1 < b1 ? 1 : -1;
	}
};

var orderFarmaco = {
	data : '',
	farmaco : ''
};

var orderAccertamento = {
	data : '',
	accertamento : ''
};

var MEDICINA_INIZIATIVA = {
		
		auxCallDb:function(action, arrType, arrIden, arrMedIniz){
			
			var vUtente = home.baseUser.IDEN_PER;
			var vMedico = home.CARTELLA.getMedPrescr();
			
			/*
			alert('action '+action);
			alert('arrType '+arrType);
			alert('arrIden '+arrIden);
			alert('arrMedIniz '+arrMedIniz);
			alert('vUtente '+vUtente);
			alert('vMedico '+vMedico);
			*/
			
			MEDICINA_INIZIATIVA.callDb(action, arrType, arrIden, arrMedIniz, vUtente, vMedico)
		},
		
		callDb:function(action, arrType, arrIden, arrMedIniz, pUtente, pIdenMed){
			
			home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
				id:'MMG.SP_MEDICINA_INIZIATIVA',
				parameter:
				{
					/*pAction in varchar2, pType in array_string, pIden in array_string, pMedIniz in array_string, pUtente in number, pIdenMed in number, vOut out nocopy varchar2) as*/
					"pAction" 			: { v : action, t : 'V'},
					"pType" 			: { v : arrType, t : 'A'},
					"pIden" 			: { v : arrIden, t : 'A'},
					"pMedIniz" 			: { v : arrMedIniz, t : 'A' },
					"pUtente" 			: { v : pUtente, t : 'N' },
					"pIdenMed" 			: { v : pIdenMed, t : 'N' },
					"vOut"				: { t : 'V', d: 'O'}
				}
			}).done( function() {
				
				if(action == 'SET'){
					MEDICINA_INIZIATIVA.setMI(arrIden);
				}else{
					MEDICINA_INIZIATIVA.removeMI(arrIden);
				}
				
			});
		},
		
		setMI:function(arrIden){
			for(i=0;i<arrIden.length;i++){
				$("." + classRiga + "[iden='"+arrIden[i]+"']").attr("mi","S");
			}
		},
		
		removeMI:function(arrIden){
			for(i=0;i<arrIden.length;i++){
				$("." + classRiga + "[iden='"+arrIden[i]+"']").attr("mi","N");
			}
		}
}

// MENU CONTESTUALE CAMPO ESENZIONI PER APPLICA TUTTI
var menuEsenzioni = {
	"menu" : {
		"id" : "MENU_RICETTA_ESENZIONI",
		"structure" : {
			"list" : [ {
				"concealing" : "true",
				"link" : function() {
					RICETTA.context_menu.applicaEsenzioni($("tr[idx=" + idx_sel +"]"));
				},
				"enable" : "S",
				"icon_class" : "incolla",
				"where" : function(rec) {
					return true;
				},
				"output" : "traduzione.lblApplicaEsenzioni",
				"separator" : "false"
			},
			{
				"concealing" : "true",
				"link" : function() {
					RICETTA.context_menu.cancellaEsenzioni($("tr[idx=" + idx_sel +"]"));
				},
				"enable" : "S",
				"icon_class" : "bidone",
				"where" : function(rec) {
					return true;
				},
				"output" : "traduzione.lblCancellaEsenzioni",
				"separator" : "false"
			}]
		},
		"title" : "traduzione.lblMenu",
		"status" : true
	}
};