$(function() 
{
	NS_MMG_PATIENT_SUMMARY.init();
	NS_MMG_PATIENT_SUMMARY.setEvents();
	
	PAT_SUM_ALLERGIE_INTOLLERANZE.initWk();
	
	NS_FENIX_SCHEDA.successSave = NS_MMG_PATIENT_SUMMARY.successSave;
	NS_FENIX_SCHEDA.afterSave = NS_MMG_PATIENT_SUMMARY.afterSave;
	NS_FENIX_SCHEDA.beforeSave = NS_MMG_PATIENT_SUMMARY.beforeSave;
});


var NS_MMG_PATIENT_SUMMARY = {
		
		wkEsenzioni:null,
		
		wkVaccinazioni:null,
		
		daStampare:false,
		
//		vReport:"PATIENT_SUMMARY.RPT",
		vReport:"PATIENT_SUMMARY_PRIVACY_V2.RPT",
		
		init : function() {
			
			home.NS_MMG_PATIENT_SUMMARY = this;
			
			/****se la pagina viene aperta in visualizzazione ( e non in modifica STATO = 'MOD') allora disattivo l'intera pagina*****/
			/****con le ultime modifiche e' meglio capovolgere la logica dell'if da $("#STATO").val() == 'VIS' a $("#STATO").val() != 'MOD'****/
			if(LIB.isValid($("#STATO").val()) && $("#STATO").val() != 'MOD'){
				NS_MMG_PATIENT_SUMMARY.blocca();
			}
			/****se il medico che cerca di vedere il PS NON e' il medico di base del paziente ma uno del suo stesso gruppo allora disattivo l'intera pagina*****/
			/*home.$.NS_DB.getTool({_logger : home.logger}).select({
	            id:'SDJ.IDEN_MED_BASE_PAZIENTE',
	            parameter:
	            {
	            	iden_anag		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'}
	            }
			}).done( function(resp) {
				if(resp.result[0].IDEN_MED_BASE != home.baseUser.IDEN_PER){
					NS_MMG_PATIENT_SUMMARY.blocca();
				}
			} );*/
			
			//faccio le modifiche di layout
			NS_MMG_PATIENT_SUMMARY.setLayout();
			
			if (LIB.isValid($("#PROVENIENZA").val()) && $("#PROVENIENZA").val() == 'AUTOLOGIN'){
				NS_MMG_PATIENT_SUMMARY.setCloseWindow();
			}
			
			if($("#OPENTAB").val() !='undefined'){
				$("#li-"+$("#OPENTAB").val()).trigger("click");
			}
			
			$("#txtEta").val(home.$(".infoEta").text());
			
			//carico le vaccinazioni
			var param = {'iden_vaccinazioni': $("#hiddenVaccinazioni").val()};
			dwr.engine.setAsync(false);
			toolKitDB.getResultDatasource('PATIENT_SUMMARY.VACCINAZIONI','MMG_DATI',param,null,function(resp){
				createOption(resp);
			});
			dwr.engine.setAsync(true);
			
			//carico la familiarita
			NS_MMG_PATIENT_SUMMARY.setComboFamiliarita();
			
			//carico il valore del check nel tab delle allergie
			dwr.engine.setAsync(false);
			toolKitDB.executeFunctionDatasource("CHECK_ASSENZA_ALLERGIE","MMG_DATI",{ 'pIdenAnag' : $("#IDEN_ANAG").val() },function(resp){
				
				var r = resp['p_result'];
				if(r.substr(0,2) == 'KO'){
					
					home.NOTIFICA.warning({
	                     message: "Il paziente risulta avere allergie o intolleranze",
	                     title: "Attenzione"
            		 });
					$("#chkAssenza_Allergie_S").removeClass("CBpulsSel");
					$("#h-chkAssenza_Allergie").val("");
				}
			});
			dwr.engine.setAsync(true);
		},
		
		setEvents : function() {
			$("#lblFamiliarita").click(function()  { NS_MMG_PATIENT_SUMMARY.apriDialog("MMG_FAMILIARITA", NS_MMG_PATIENT_SUMMARY.registraFamiliarita, "Familiarita"  ); });

			$("#li-tabEsenzioni").on("click",function() {
				if (NS_MMG_PATIENT_SUMMARY.wkEsenzioni==null) {
					NS_MMG_PATIENT_SUMMARY.initWkEsenzioni();
				}
			});
			$("#li-tabVaccinazioni").on("click",function() {
				if (NS_MMG_PATIENT_SUMMARY.wkVaccinazioni==null) {
					NS_MMG_PATIENT_SUMMARY.initWkVaccinazioni();
				}
			});
			$("#li-tabScreening").on("click",function() {
				if (NS_MMG_PATIENT_SUMMARY.wkScreening==null) {
					NS_MMG_PATIENT_SUMMARY.initWkScreening();
				}
			});
			$("#li-tabTerapieCroniche").on("click",function() {
				if (NS_MMG_PATIENT_SUMMARY.wkTerapie==null) {
					NS_MMG_PATIENT_SUMMARY.initWkTerapie();
				}
			});
			$("#li-tabProblemi").on("click",function() {
				if (NS_MMG_PATIENT_SUMMARY.wkProblemi==null) {
					NS_MMG_PATIENT_SUMMARY.initWkProblemi();
				}
			});
			$("#li-tabInterventi").on("click",function() {
				if (NS_MMG_PATIENT_SUMMARY.wkInterventi==null) {
					NS_MMG_PATIENT_SUMMARY.initWkInterventi();
				}
			});
			$("#li-tabAllergie").on("click",function() {
				if (NS_MMG_PATIENT_SUMMARY.wkAllergie==null) {
					NS_MMG_PATIENT_SUMMARY.initWkAllergie();
				}
			});
			$("#li-tabAccertamenti").on("click",function() {
				if (NS_MMG_PATIENT_SUMMARY.wkAccertamenti==null) {
					NS_MMG_PATIENT_SUMMARY.initWkAccertamenti();
				}
			});
			
			$("#radMestruazioni_N").on("click", function(){
				$("#cmbMestruazioni").attr("disabled","disabled");
			});
			
			$("#radMestruazioni_S").on("click", function(){
				
				$("#cmbMestruazioni").attr("disabled",false);
				$("#h-cmbMestruazioni").val("");
				$("#cmbMestruazioni").val("");
			});
			
			$("#radTipoSostanza").on("change", function(){
				if($("#h-radTipoSostanza").val() == 'FAR'){
					$("#Farmaco").closest("tr").show();
					$("#PrincipioAttivo").closest("tr").hide();
					$("#PrincipioAttivo").val("");
					$("#h-PrincipioAttivo").val("");
					$("#txtAllergia").val("");
				}else{
					$("#PrincipioAttivo").closest("tr").show();
					$("#Farmaco").closest("tr").hide();
					$("#Farmaco").val("");
					$("#h-Farmaco").val("");
					$("#cmbLivello").empty();
					$("#cmbLivello").val("");
				}
			});
			
			$("#radFumo").on("change", function(){
				if($("#h-radFumo").val() == 'S'){
					$("#lblQtaSigarette, #txtQtaSigarette").show();
				}else{
					$("#lblQtaSigarette, #txtQtaSigarette").hide()
				}
			});
			$("#radExFumo").on("change", function(){
				if($("#h-radExFumo").val() == 'S'){
					$("#lblDataFineFumo, #txtDataFineFumo").show();
				}else{
					$("#lblDataFineFumo, #txtDataFineFumo").hide()
				}
			});

			$(".butOldVersion").on("click", NS_MMG_PATIENT_SUMMARY.showOldVersion );
			$(".butAnagrafica").on("click", NS_MMG_PATIENT_SUMMARY.apriAnagrafica );
			$("#buttonInsAllergie").on("click", NS_MMG_PATIENT_SUMMARY.inserisciAllergia );
			$("#buttonIns").on("click", NS_MMG_PATIENT_SUMMARY.inserisciIntervento );

			$(".butStampa").on("click", function(){
				NS_MMG_PATIENT_SUMMARY.aux_stampa();
			});
			
			$("#chkAssenza_Allergie").on("change",function(){
				
				if ($("#h-chkAssenza_Allergie").val() == 'S'){
					
					var pIdenAnag = $("#IDEN_ANAG").val();
					
					dwr.engine.setAsync(false);
					toolKitDB.executeFunctionDatasource("CHECK_ASSENZA_ALLERGIE","MMG_DATI",{ 'pIdenAnag' : pIdenAnag },function(resp){
						
						var r = resp['p_result'];
						if(r.substr(0,2) == 'KO'){
							
							home.NOTIFICA.warning({
			                     message: "Il paziente risulta avere allergie o intolleranze",
			                     title: "Attenzione"
		            		 });
							
							$("#chkAssenza_Allergie_S").removeClass("CBpulsSel");
							$("#h-chkAssenza_Allergie").val("");
						}
					});
					dwr.engine.setAsync(true);
				}
			});
		},
		
		setLayout:function(){
			
			//se e' maschio levo tutto cio' che e' relativo alle mestruazione e menopausa
			if(home.ASSISTITO.SESSO == 'M'){
				$("#radMestruazioni").closest("tr").hide();
				$("#txtMenarcaAnni").closest("tr").hide();
				$("#radMenopausa").closest("tr").hide();
			}
			
			if($("#h-radMestruazioni").val() == 'N'){
				$("#cmbMestruazioni").attr("disabled","disabled");
			}
			
			$("#PrincipioAttivo").closest("tr").hide();	
			
			$("#tabAnamnesi")
			.find("fieldset")
			.each(
					function(idx, element) {
						var textarea = $(element).find(".tdTextarea");
						($(element).attr("id") == 'fldAnamnesiFisiologica') ? textarea.attr("colspan", 3): textarea.attr("colspan", 2);
					});
			
			$(".tdComboList").attr("colspan", 2);
			$("#txtTipoReazAllergica, #txtAllergia").parents().attr("colSpan", "8");
			
			//metto il fieldset del medico in readonly
			$('#fldMedico').find(':input').attr('readOnly', true);
			
			$("#buttonInsAllergie, #buttonIns").addClass("butVerde");
			
			NS_MMG_PATIENT_SUMMARY.checkCampiFumatore();
			
			NS_MMG_PATIENT_SUMMARY.buildLabelInfo();
			$("#li-tabOldVersion").hide();
		},
		
		setComboFamiliarita: function() 
		{
			//Esempio di input in entrata: idenParente1*descrParente1:idenMalattia1*descrMalattia1,idenMalattia2*descrMalattia2,...$idenParente2*descrParente2:idenMalattia1*descrMalattia1,...
			var familiarita = $("#hiddenFamiliaritaSave").val(); 
			
			if(familiarita != ""){
				
				try{
					
					var arrFam = familiarita.split("$");
					$.each(arrFam,function(k,v){
						
						var arrGroup = v.split(":");
						var parentela = arrGroup[0].split("*");
						var malattie = arrGroup[1].split(",");
						
						var optGroup = $("<optgroup label='" + parentela[1] + "' value='" + parentela[0] + "'/>");
						
						$.each(malattie,function(k1,v1){
							var malattia = v1.split("*");
							optGroup.append($('<option value='+malattia[0]+'>'+malattia[1]+'</option>'));
						});
						
						$('#cmbFamiliaritaResult').append(optGroup);
					});
				}catch(e){
					$("#hiddenFamiliaritaSave").val('');
				}
			}
		},
		
		afterSave:function(){
			
			NS_PRIVACY.save();
		},
		
		apriDialog : function(key_legame,registrafnc,title) {
			
			var vHeight = 320;
			var vWidth = 750;
			var url = "page?KEY_LEGAME="+key_legame;
			//TODO: METTERE OVERFLOW
			var obj =$("<iframe>").attr("src",url).attr("id","iframeHTML").css({"height" : vHeight+"px", "width" : vWidth+"px"});

			$.dialog(obj, {

				'ESCandClose'		: true,
				'created'			: function(){ $('.dialog').focus(); },
				'title' 			: title,
				'width' 			: vWidth+50,
				'height'		 	: vHeight+50,
				'buttons'			: 
					[{
						 "label"  : "Registra",
						 "action" :  registrafnc
					 }, 
					 {
						 "label"  :  "Chiudi",
						 "action" :   $.dialog.hide
					}]
			});
			
			$("#iframeHTML").attr("scrolling","yes");
		},

		apriPrestazioni: function(row){
			
			var iden = row[0].IDEN;
			home.NS_MMG.apri( 'MMG_ESENZIONI_PRESTAZIONI' + '&IDEN_ESENZIONE=' + iden);
		},
		
		apriVaccino: function(riga){
			
			var pIden = riga[0].IDEN;
			var pTipoVaccino = riga[0].DESCRIZIONE;
			var pCodice = riga[0].CODICE;
			var url = "";
			var urlAgg = "&IDEN=" + pIden + '&PROVENIENZA=PATIENT_SUMMARY';

			//if(pTipoVaccino == "VACCINAZIONE ANTINFLUENZALE"){
			if(pCodice == "VAC_2"){
				url = "MMG_INSERIMENTO_VACCINO&TIPOLOGIA=ANTINFLUENZALE" + urlAgg;
			}else{
				url = "MMG_INSERIMENTO_VACCINO" + urlAgg;
			}
					
			home.NS_MMG.apri( url );
		},
		
		apriAnagrafica: function() {
			
			if($("#STATO").val() == 'VIS'){
				home.NS_MMG.apri( "SCHEDA_ANAGRAFICA_MMG", "&LAYOUT=LOCKED" );
			}else{
				home.NS_MMG.apri( "SCHEDA_ANAGRAFICA_MMG", /*"&LAYOUT=READONLY"*/ "" );
			}
		},
		
		aux_stampa:function(){
			
			home.$.dialog(traduzione.lblPreStampaPS, {
				'id'				: "dialogPreStampa",
				'title'				: traduzione.lblTitlePreStampa,
				'width'				: 600,
				'showBtnClose' 		: false,
				'ESCandClose'		: true,
				'created'			: function(){ $('.dialog').focus(); },
				'modal'				: true,
				'buttons' : 
					[{
						 "label"  	: "Salva e Stampa",
						 "action" 	:  function(){  NS_MMG_PATIENT_SUMMARY.daStampare = true; $(".butSalva").trigger("click"); home.$.dialog.hide(); },
						 "keycode"	: "13",
						 "class" 	: "butVerde"		
					 }, 
					 {
						 "label"  	:  "Stampa senza salvare",
						 "action" 	:  function(){NS_MMG_PATIENT_SUMMARY.stampa(); home.$.dialog.hide();}
					 },
					 {
						 "label" 	:  "Annulla",
						 "action" 	:  function(){home.$.dialog.hide()}
					 }]
			});
			
		},
		
		beforeSave:function(){
			$("#h-radTipoAllergia").val("");
			$("#h-radTipoSostanza").val("");
			$("#h-Farmaco").val("");
			$("#Farmaco").val("");
			$("#PrincipioAttivo").val("");
		    $("#h-PrincipioAttivo").val("");
			$("#txtDataIntervento").val("");
			$("#h-txtDataIntervento").val("");
			$("#Intervento").val("");
			$("#CodiceIntervento").val("");
			$("#h-Intervento").val("");
			$("#h-CodiceIntervento").val("");
			return home.MMG_CHECK.isDead();
		},
		
		blocca: function() {
			
			$("body input").attr("disabled","disabled");
			$("body select").attr("disabled","disabled");
			$("body textarea ").attr("disabled","disabled");
			$("body button ").attr("disabled","disabled");
			$(".butChiudi").attr("disabled",false).on('click',function(){home.NS_FENIX_MINI_MENU.logout();});
			$(".butAnagrafica").attr("disabled",false);
			$(".butSalva").hide();
			
			radViveSolo.disable();
			radViveStruttura.disable();
			radUtilizzaServiziSociali.disable();
			radPersonaInterdetta.disable();
			radPersonaInabilitata.disable();
			
			radMestruazioni.disable();
			radMenopausa.disable();
			radFumo.disable();
			
			radOrganiMancanti.disable();
			radTrapianti.disable();
			radEspianti.disable();
			radProtesi.disable();
			radImpianti.disable();
			radAusili.disable();
			radDipendenze.disable();
			radSostanzeTossiche.disable();
			
			radTipoAllergia.disable();
			chkAssenza_Allergie.disable();
		},
		
		buildLabelInfo: function(){
			
			var vIntestazione = $("#fldIntestazione table");
			
			vIntestazione.append( 
					$("<tr/>", { "class" : 'separator' } )
						.append(
							$("<td/>", { "class":"label informativa"})
								.append(
										$('<label>'+traduzione.lblOldVersion+'</label>', { 'class' : 'label_separator' })
							))
							.append($(document.createElement('i')).addClass('icon-cancel-squared').attr({'title': 'Elimina'}).on('click', function(){$("#fldIntestazione").hide();})
							)
					);
		},
		
		cancellaAccertamento: function(riga){

			home.NS_MMG.confirm("Vuoi veramente nascondere l'accertamento selezionato?", function(){
				
				toolKitDB.executeProcedureDatasource('SP_NASCONDI_ACCERTAMENTO', 'MMG_DATI', {pIden: riga[0].IDEN_DETTAGLIO}, function(resp){});
				NS_MMG_PATIENT_SUMMARY.initWkAccertamenti();
			});
		},
		
		cancellaScreening: function(riga){
			
			home.NS_MMG.confirm("Vuoi veramente cancellare lo screening selezionato?", function(){
			
				dwr.engine.setAsync(false);
				
				toolKitDB.executeProcedureDatasource('SP_CANCELLA_SCREENING', 'MMG_DATI', {pIden: riga[0].IDEN}, function(resp){});
				
				dwr.engine.setAsync(true);
				NS_MMG_PATIENT_SUMMARY.initWkScreening();
			});
		},
		
		cancellaVaccino: function(riga){
			
			home.NS_MMG.confirm("Cancellare il vaccino selezionato?", function(){

				if(riga[0].CODICE == 'VAC_2'){
					home.NS_MMG.confirm("Verr\u00E0 eliminata anche la P.P.I.P. associata al vaccino. Procedere?", function(){
						deleteVaccino();
					});
				}else{
					deleteVaccino();
				}
				
				function deleteVaccino(){
					toolKitDB.executeProcedureDatasource('SP_CANCELLA_VACCINO', 'MMG_DATI', {pIden: riga[0].IDEN}, function(resp){
						VACCINO.loadWkVaccinazioni();
					});
				}
			});
		},
		
		cancellaIntervento: function(riga){
			
			home.NS_MMG.confirm("Cancellare l' intervento selezionato?", function(){
			
				dwr.engine.setAsync(false);
				toolKitDB.executeProcedureDatasource('SP_CANCELLA_INTERVENTO', 'MMG_DATI', {pIden: riga[0].IDEN}, function(resp){});
				dwr.engine.setAsync(true);
				
				NS_MMG_PATIENT_SUMMARY.initWkInterventi();
			});
			
		},
		
		//function che controlla i campi dei fumatori e nasconde/mostra in base ai valori
		checkCampiFumatore:function(){
			
			if($("#h-radFumo").val() == 'S'){
				$("#lblQtaSigarette, #txtQtaSigarette").show();
			}else{
				$("#lblQtaSigarette, #txtQtaSigarette").hide()
			}
			
			if($("#h-radExFumo").val() == 'S'){
				$("#lblDataFineFumo, #txtDataFineFumo").show();
			}else{
				$("#lblDataFineFumo, #txtDataFineFumo").hide()
			}
		},
		
		//function che crea i pulsanti e te li restituisce
		creaButton:function(idButton, textButton, classButton){
			var button = $("<a/>").attr({href:"#",id:idButton}).addClass(classButton).append($("<span/>").html(textButton));
			return button;
		},
		
		initWkEsenzioni:function() {
			NS_MMG_PATIENT_SUMMARY.wkEsenzioni = new WK({
				"id"		: 'ESENZIONI_PAZIENTE',
    			"aBind"		: ["iden_anag"],
    			"aVal"		: [home.ASSISTITO.IDEN_ANAG],
    			"container" : 'divWkEsenzioni'
			});
			NS_MMG_PATIENT_SUMMARY.wkEsenzioni.loadWk();
		},
		
		initWkVaccinazioni:function() {
			NS_MMG_PATIENT_SUMMARY.wkVaccinazioni = new WK({
				'id'		: 'LISTA_VACCINI',
				'aBind'		: [ 'iden_anag', 'all_iden_anag', 'iden_utente' ],
				'aVal'		: [ home.ASSISTITO.IDEN_ANAG, "N", home.baseUser.IDEN_PER ],
    			"container" : 'divWkVaccinazioni'
			});
			NS_MMG_PATIENT_SUMMARY.wkVaccinazioni.loadWk();
		},
		
		initWkScreening:function() {
			NS_MMG_PATIENT_SUMMARY.wkScreening = new WK({
				"id"    	: 'SCREENING',
                "aBind" 	: ["ute_ins","iden_anag"],
                "aVal"  	: [home.baseUser.IDEN_PER.toString(),$("#IDEN_ANAG").val()],
                "container" : "divWkScreening"
			});
			NS_MMG_PATIENT_SUMMARY.wkScreening.loadWk();
		},
		
		initWkTerapie:function() {
			
			var idWk = typeof home.baseUser.SHOW_FARMACO_ORIGINALE != 'undefined' &&  home.baseUser.SHOW_FARMACO_ORIGINALE == '0' ? 'TERAPIE_PA' : 'TERAPIE';
			
			NS_MMG_PATIENT_SUMMARY.wkTerapie = new WK({
				"id"    	: idWk,
                "aBind" 	: ["cronicita","iden_anag","iden_per",],
                "aVal"  	: ["S",home.ASSISTITO.IDEN_ANAG,home.baseUser.IDEN_PER],
                "container" : "divWkTerapie"
			});
			NS_MMG_PATIENT_SUMMARY.wkTerapie.loadWk();
		},
		
		initWkProblemi:function() {
			NS_MMG_PATIENT_SUMMARY.wkProblemi = new WK({
				"id"    	: 'PROBLEMI_PS',
                "aBind" 	: ["chiuso","iden_anag","nascosto","iden_per"],
                "aVal"  	: ["N,S,R",home.ASSISTITO.IDEN_ANAG,"N",home.baseUser.IDEN_PER],
                "container" : "divWk"
			});
			NS_MMG_PATIENT_SUMMARY.wkProblemi.loadWk();
		},
		
		initWkInterventi:function() {
			NS_MMG_PATIENT_SUMMARY.wkInterventi = new WK({
				"id"    	: 'INTERVENTI_WK',
                "aBind" 	: ["iden_anag","iden_per"],
                "aVal"  	: [home.ASSISTITO.IDEN_ANAG,home.baseUser.IDEN_PER],
                "container" : "divWkInterventi"
			});
			NS_MMG_PATIENT_SUMMARY.wkInterventi.loadWk();
		},
		
		initWkAllergie:function() {
			NS_MMG_PATIENT_SUMMARY.wkAllergie = new WK({
				"id"    	: 'ALLERGIE_INTOLLERANZE',
                "aBind" 	: ["iden_anag"],
                "aVal"  	: [home.ASSISTITO.IDEN_ANAG],
                "container" : "divWkAllergie"
			});
			NS_MMG_PATIENT_SUMMARY.wkAllergie.loadWk();
		},
		
		initWkAccertamenti:function() {
			NS_MMG_PATIENT_SUMMARY.wkAccertamenti = new WK({
				"id"    	: 'ACCERTAMENTI_PATIENT_SUMMARY',
                "aBind" 	: ["iden_anag", "iden_per"],
                "aVal"  	: [home.ASSISTITO.IDEN_ANAG, home.baseUser.IDEN_PER],
                "container" : "divWkAccertamenti"
			});
			NS_MMG_PATIENT_SUMMARY.wkAccertamenti.loadWk();
		},
		
		//function associata al tasto inserisci nel tab Allergie
		inserisciAllergia:function(){

			var descrAllergia = $("#txtAllergia").val().toUpperCase();
			var Allergia = '';
			var radioAllergia = $("#h-radTipoAllergia").val();
			if($("#h-radTipoSostanza").val() == 'FAR'){
				Allergia = descrAllergia != '' ?  descrAllergia : $("#Farmaco").attr("data-c-descr"); 
			}
			if($("#h-radTipoSostanza").val() == 'PA'){
				Allergia = descrAllergia != '' ?  descrAllergia : $("#PrincipioAttivo").attr("data-c-descr");
			}
//			alert(Allergia)
			if (typeof Allergia == 'undefined'){
				home.NOTIFICA.warning({
				
	                message	: "Indicare a quale farmaco o principio attivo si riferisce l'allergia o l'intolleranza",
	                title	: "Attenzione",
	                timeout	: 6
	            });
				
				return;
			}
			if(radioAllergia == ""){
	            home.NOTIFICA.warning({
	                message	: "Specificare se si tratta di allergia o intolleranza",

	                title	: "Attenzione",
	                timeout	: 6
	            });
				
	            return;
			}
			
			var assenza_allergie = $("#h-chkAssenza_Allergie").val();
			if (assenza_allergie == ""){
				
				assenza_allergie = 'N';
			}
			
			if (Allergia != "" ||  radioAllergia != ""){
				
				assenza_allergie = 'N';
				$("#chkAssenza_Allergie_S").removeClass("CBpulsSel");
				$("#h-chkAssenza_Allergie").val("");
			}
			
			var param = {
					'pIdenAnag' 	: $("#IDEN_ANAG").val(),
					'pDescr' 		: Allergia,
					'pTipo' 		: radioAllergia,
					'pUteIns' 		: home.baseUser.IDEN_PER,
					'pIdenMed' 		: $("#IDEN_MED_PRESCR").val(),
					'pAtcGmp' 		: $("#cmbLivello").val(),
					'pCodFarmaco' 	: $("#h-Farmaco").val(),
					'pTipoReaz'     : $("#txtTipoReazAllergica").val(),
					'pAsseAllergie' : assenza_allergie,
					'pCod_Pa' 		: $("#h-PrincipioAttivo").val()
			};
			
	
			var paramfx = {
					'viden_anag' : $("#IDEN_ANAG").val()
			}, 
			iden_riferimento = '';

			//alert(JSON.stringify(param));
			
			dwr.engine.setAsync(false);
			toolKitDB.executeProcedureDatasource('SP_SAVE_ALLERGIE_INT','MMG_DATI',param,function(resp){
				
				var status = resp.p_result.split('$')[0];
				
				if( status == 'OK' ){
					iden_riferimento = resp.p_result.split('$')[1];
				}else{	
					iden_riferimento = '';
					
					home.NOTIFICA.error({
		                message: resp.p_result.split('$')[1],
		                title: "Errore"
		            });
				}
			});

			toolKitDB.executeFunctionDatasource("GET_ALLERGIE_INT","MMG_DATI",paramfx,function(resp){
								
				NS_MMG_PATIENT_SUMMARY.gestisciIconaBar(resp);
			});

			dwr.engine.setAsync(true);
			
			var parameters = new Object();
			var tipologia = $('#radTipoAllergia').data('RadioBox').val();
			
			
			if( iden_riferimento != '' && ( tipologia == 'ALL' || tipologia == 'INT' ) )
			{
				
				parameters.text					= tipologia == 'ALL' ? ( "Allergia inserita: " + Allergia ) : ( "Intolleranza inserita: " + Allergia);
				parameters.iden_anagrafica		= home.ASSISTITO.IDEN_ANAG;
				parameters.data_inizio			= moment().format('YYYYMMDD');
				parameters.data_fine			= moment().add( 100,'years' ).format('YYYYMMDD');
				parameters.priorita				= 3;
				parameters.sezione				= 'BACHECA_ALLERGIA_INTOLLERANZA';
				parameters.iden_riferimento		= iden_riferimento;
				parameters.tabella_riferimento	= 'MMG_ALLERGIE_INTOLLERANZE';
				
				//toolKitDB.executeFunction( 'SAVE_PROMEMORIA_BACHECA', parameters , function(){} );
				
				home.NS_MMG_UTILITY.insertPromemoria(parameters);
			}
				
			var ValueAllergie = new Array();
			var BindAllergie = new Array();

			BindAllergie.push("iden_anag");
			ValueAllergie.push(home.ASSISTITO.IDEN_ANAG);
			
		    PAT_SUM_ALLERGIE_INTOLLERANZE.caricaWk("ALLERGIE", BindAllergie, ValueAllergie);
		    
		    $("#txtAllergia").val("");
		    $("#Farmaco").val("");
		    $("#h-Farmaco").val("");
		    $("#PrincipioAttivo").val("");
		    $("#h-PrincipioAttivo").val("");
		    $("#h-radTipoAllergia").val("");
		    $("#txtTipoReazAllergica").val("");
		    $("#radTipoAllergia div").removeClass("RBpulsSel");
		    $("#cmbLivello").empty();
		},
		
		//function associata al tasto inserisci nel tab Interventi
		inserisciIntervento:function(){
			
			var dataInt = $("#h-txtDataIntervento").val();
			var Int = $("#h-CodiceIntervento").val();
			var descrInt = $("#Intervento").val().toUpperCase();
			//alert(Int + ' ' + descrInt);
			if(Int == "" || descrInt ==""){
	            home.NOTIFICA.warning({
	                message: "Specificare Il Codice e Descrizione Intervento",
	                title: "Attenzione"
	            });
				return;
			}
			var param={
					'pIdenAnag' 		: $("#IDEN_ANAG").val(),
					'pDataIntervento' 	: dataInt,
					'pCodIntervento' 	: Int,
					'pDescrIntervento' 	: descrInt,
					'pUteIns' 			: home.baseUser.IDEN_PER,
					'pIdenMed' 			: $("#IDEN_MED_PRESCR").val()
			};
			
			dwr.engine.setAsync(false);
			toolKitDB.executeProcedureDatasource('SP_SAVE_INTERVENTO','MMG_DATI',param,function(resp){
				
				var r = resp['p_result'];
				
				if(r.substr(0,2) == 'OK'){
					
					NOTIFICA.success({
						message:traduzione.successSave,
						title: traduzione.successTitleSave
					});
					
					var BindInterventi = new Array();
					var ValueInterventi = new Array();
					BindInterventi.push("iden_anag", "iden_per");
					ValueInterventi.push(home.ASSISTITO.IDEN_ANAG, home.baseUser.IDEN_PER);
					
				    PAT_SUM_ALLERGIE_INTOLLERANZE.caricaWk("INTERVENTI", BindInterventi, ValueInterventi);
				    
				    var vText = traduzione.lblInseritoIntervento + ': ' +$("#CodiceIntervento").val() + ' - ' + $("#Intervento").val();
				    
					$("#txtDataIntervento").val("");
					$("#h-txtDataIntervento").val("");
					$("#Intervento").val("");
					$("#CodiceIntervento").val("");
					$("#h-Intervento").val("");
					$("#h-CodiceIntervento").val("");
				
					if($("#chkInsNotaCont div").hasClass("CBpulsSel")){
						
						var vParameters = {
								'PIDENANAG' 		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'},
								'PIDENSCHEDA' 		: { v : null, t : 'N'},
								'PIDENACCESSO' 		: { v : home.ASSISTITO.IDEN_ACCESSO, t : 'N'},
								'PIDENPROBLEMA' 	: { v : null, t : 'N'},
								'PIDENMED' 			: { v : home.baseUser.IDEN_PER, t : 'N'},
								'PUTENTE' 			: { v : home.baseUser.IDEN_PER, t : 'N'},
								'P_DATA' 			: { v : moment().format('YYYYMMDD'), t : 'V'},
								'P_ACTION' 			: { v : 'MOD_SCHEDA', t : 'V'},
								'P_IDEN_NOTA'		: { v : '', t : 'V'},
								'V_OSCURATO'		: { v : 'N', t : 'V'},
								'P_NOTEDIARIO' 		: { v : vText, t : 'C'},
								'P_TIPO' 			: { v : 'NOTE', t : 'V'},
								'P_SITO' 			: { v : 'MMG', t : 'V'},
								"V_RETURN_DIARIO"	: {t: 'V', d: 'O'}
							};

						home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
							id:'SP_NOTE_DIARIO',
							parameter: vParameters
						}).done( function() {});
					}
				
				}else{
					NOTIFICA.warning({
						message:traduzione.errorSave,
						title: traduzione.errorTitleSave
					});
				}
				
			});
			dwr.engine.setAsync(true);
			
		},
		
		gestisciIconaBar:function(resp){
			try{
				var r = resp["p_result"].split("*");
				//alert(r[0] + ' ' +r[1]);
				if(r[0] == "S" ){
					var iconaAllInt = jQuery("<div></div>").addClass("iconaAllergieInt").attr("title", r[1]);
					parent.$("#divAllInt").on("click",function(){
						NS_MMG.apri('PATIENT_SUMMARY',"&OPENTAB=tabAllergie");
					});
					parent.$("#divAllInt").html(iconaAllInt);
				}else{
					var iconaAllInt = jQuery("<div></div>").addClass("iconaNoAllergieInt").attr("title","Nessuna Allergia/Intolleranza");
					parent.$("#divAllInt").html(iconaAllInt);
				}
			}
			catch(e){
				//alert(e.description);
			}
		},

		nascondiProblema:function(obj, typerequest){
			
			if(!confirm(traduzione.lblConfirmCancella)){
				return;
			}

			home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
	            id:'SP_HIDE_SHOW_PROBLEMA',
	            parameter:
	            {
	            	"v_iden_problema" 	: { v : obj[0].IDEN, t : 'N'},
					"pUtente" 			: { v : home.baseUser.IDEN_PER, t : 'N'},
					"pDataHide" 		: { v : '', t : 'V'},
					"pTypeRequest"	 	: { v : typerequest, t : 'V' }
	            }
			}).done( function() {
				
				if (home.ASSISTITO.IDEN_PROBLEMA == obj[0].IDEN)
					home.MAIN_PAGE.unsetPatientProblem();
				else
					home.RIEP_ACCESSI_PROBLEMI.objWk.refresh();
				
				NS_MMG_PATIENT_SUMMARY.initWkProblemi();
			});
			
		},
		
		registraFamiliarita:function() {
			
			var valueToSave='';
			var cmbFamiliarita=$("#iframeHTML").contents().find("#cmbFamiliarita");
			
			cmbFamiliarita.find("optgroup").each(function() {
				
				valueToSave += $(this).attr("value")+"*"+$(this).attr("label")+ ":";
				$(this).find("option").each(function() {
					valueToSave += $(this).val()+"*"+$(this).text()+",";
				});
				valueToSave = valueToSave.substring(0, valueToSave.length-1) + "$";
			});
			valueToSave = valueToSave.substring(0, valueToSave.length-1);
			
			$("#cmbFamiliaritaResult").html(cmbFamiliarita.html());
			$("#hiddenFamiliaritaSave").val(valueToSave);
			
			$.dialog.hide();
		},
		
		registraVaccinazioni:function(){
			
			var ritornoHTMLVaccinazioni=document.getElementById("iframeHTML").contentWindow.$("select[name='ComboVaccinazioniOut']").html();
			
			$("select[name='cmbVaccinazioniResult']").html(ritornoHTMLVaccinazioni);
			$.dialog.hide();
		},
		
		showOldVersion:function(){
			
			$("#li-tabOldVersion").show();
		},

		setCloseWindow: function(){
			
			$(".butChiudi").unbind().on("click", function() {
				top.window.close();
			});
		},
		
		successSave:function(){
			
			if(NS_MMG_PATIENT_SUMMARY.daStampare){
				NS_MMG_PATIENT_SUMMARY.stampa();
			}
			
			NS_MMG_PATIENT_SUMMARY.daStampare = false;
		},
		
		stampa:function(){
			
			var prompts = {
					pIdenAnag: home.ASSISTITO.IDEN_ANAG,
					pIdenPer: home.baseUser.IDEN_PER,
					pProvenienza: "MMG",
					pCoinvolgimentoCura: ""
			};
			
			home.NS_PRINT.print({
				path_report: NS_MMG_PATIENT_SUMMARY.vReport + "&t=" + new Date().getTime(),
				prompts: prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: "pdf"
			});
			
			NS_MMG_PATIENT_SUMMARY.daStampare=false;
		}
};

var PAT_SUM_ALLERGIE_INTOLLERANZE = {
		
		//function che fa l'init delle wk all'apertura della pagina
		initWk:function(){
			
			var h = $('.contentTabs').innerHeight() - $('#fldInserimentoAllergie').outerHeight(true) - 300;
			$("#divWkAllergie").height( h );
			
			var altezza = $('.contentTabs').innerHeight() - $("#fldInserimentoIntervento").outerHeight(true) - 200;
			$("#divWkInterventi").height( altezza );
		    $("#divWkInterventi").find(".classWkScroll").css("height","300px").css("width","800px");
		},
		
		//function che carica le wk a seconda del caso che gli si passa
		caricaWk:function(pCase, arrayBind, arrayValue){
			
			switch(pCase){
			
				case 'INTERVENTI':
					
					var sub = $("#divWkInterventi").worklist();
					
					if(arrayBind != ''){
						sub.data.where.init();
						sub.data.where.set('', arrayBind, arrayValue);
					}
					
					sub.data.load();
					break;
				
				case 'ALLERGIE':
					
					var sub = $("#divWkAllergie").worklist();
					
					if(arrayBind != ''){
						sub.data.where.init();
						sub.data.where.set('', arrayBind, arrayValue);
					}
					
					sub.data.load();
					break;
			}
		}
};


function createOption(obj){
	
    var me=this;
    $.each(obj,function(k1,v1){
    	
    	me.opt=$("<option>");
    	$.each(v1,function(k2,v2){
    		if(k2 == "DESCR"){
    			me.opt.html(v2);
    			me.opt.attr("data-descr",v2);
    		}
    		if(k2 == "VALUE"){
                me.opt.val(v2);
                me.opt.attr("data-valore",v2);
    		}
    		
    	});
    	
    	$("#cmbVaccinazioniResult").append(me.opt);
   });
}



var AC = {
	
		select:function(riga, type){
			
			$("#CodiceIntervento").val(riga.VALUE);
			$("#h-CodiceIntervento").val(riga.VALUE);
			$("#Intervento").val(riga.DESCR);
		},
		
		choose:function(){}
};

var OSCURAMENTI_CUSTOM = {
	"cmbFamiliaritaResult" : {
		disoscura : function() {
			$("#cmbFamiliaritaResult").html('');
			$("#lblFamiliarita").show();
			$("#hiddenFamiliaritaSave").val('');
		}
	}
};