/* global home, traduzione, RICETTA, MEDICINA_INIZIATIVA, moment, NOTIFICA, NS_MMG_UTILITY, LIB, TABLE, MMG_CHECK */

var idx_sel = '';
var $option;
var $crono;
var _riga;
var newRiga;
var indiceIframe = '';
var $collectionRows = '';
var $collectionRowsToOrder = '';
var classRiga = "trRigaFarmaci";




$(function(){

	RICETTA_FARMACI.init();
	RICETTA.chiudiAttesa(indiceIframe);
	RICETTA.getProdotti = RICETTA_FARMACI.getProdotti;
	RICETTA.getProblemi = RICETTA_FARMACI.getProblemi;
	RICETTA.checkPreSalvataggio = RICETTA_FARMACI.checkPreSalvataggio;
	RICETTA.updEsenzioniObjSalvataggio = RICETTA_FARMACI.updEsenzioniObjSalvataggio;

	home.RIEPILOGO.toggleButtons( $('#IDFRAME').val() );

	RICETTA_FARMACI.addSearchBar();
	
});


var RICETTA_FARMACI = {

		vType : "MMG_FARMACI",
		
		toolDb: null,

		table:null,

		init:function(){

			home.RICETTA_FARMACI = this;

			home.NS_CONSOLEJS.addLogger({ name: 'RICETTA_FARMACI', console: 0 });
			RICETTA_FARMACI.logger = home.NS_CONSOLEJS.loggers['RICETTA_FARMACI'];

			home.RIEPILOGO.setLayout( $('#IDFRAME').val(), 'RICETTA_FARMACI', $( document ) );

			RICETTA_FARMACI.table = $("#tableRisultati");
			RICETTA_FARMACI.setEvents();

			indiceIframe = $("#IDX").val();

			//prendo la prima riga in modo da duplicarla sempre da 'vergine'
			$("tr[tipoRiga=ins]").find(".tdAction input").attr("checked","checked");
			_riga = $("tr[tipoRiga=ins]");
			newRiga = _riga.clone();

			$crono = $(".icon-cog-1").contextMenu(menuCrono,{openSubMenuEvent: "click", openInfoEvent: "click"});
			$option =  $(".icon-hourglass").contextMenu(menuOption,{openSubMenuEvent: "click", openInfoEvent: "click"});
			$info = $(".icon-info-circled").contextMenu(menuInfo,{openSubMenuEvent: "click", openInfoEvent: "click"});

			//funzione che controlla tutti i dati della riga (temporaneita' cronicita', se e' da stampare, ...)
			RICETTA.checkRiga(classRiga);

			$("tr[tiporiga=ins]").find(".classPA").find("input[type='checkbox']").attr("checked",true);
			$("tr[tiporiga=ins]").attr('pa','S');
			
			$(".classFarmaco").each(function(){
				
				//alert($(this).parent().attr("nota_cuf"));
				
				var classe = $(this).parent().attr("classe_farmaco") != '' ? $(this).parent().attr("classe_farmaco" ) : 'Non è presente alcuna classe<\br>';
				var nota = typeof $(this).parent().attr("nota_cuf")  != 'undefined' && $(this).parent().attr("nota_cuf") != '' ? ('  |  Nota Farmaco: ' +$(this).parent().attr("nota_cuf" )) : '';
				var titleFarmaco = $(this).attr("title"); 
				titleFarmaco += '  |  Classe del farmaco: ' + classe;
				titleFarmaco +=  nota;
				
				$(this).attr("title", titleFarmaco);
			});

			//nascondo l'icona della x per chiudere
			$("div.iconContainer").find("i.icon-cancel-squared").hide();
		},
		
		addSearchBar: function() {
			var search	= $(document.createElement('input'));
			search.attr({ 'type' : 'text', 'id': 'search-filter' });
			search.hide();
			search.on('keydown', function(event){
				if( event.keyCode != 9 )
					RICETTA_FARMACI.filterRows(event); 
			});
			var icon = $(document.createElement('i'));
			icon.addClass('icon-search');
			icon.on('click', RICETTA_FARMACI.toggleSearchBar );
			$('.headerTabs').find('.iconContainer').prepend( search, icon );
		},
		
		toggleSearchBar: function() {
			if( $('#search-filter').is(':visible') ) {
				$('#search-filter').hide();
				$('#tableRisultati').find('tr').show();
			} else {
				$('#search-filter').show().css("display", "inline-block").focus();	
			}
		},

		filterRows: function( event ) {
			var search = $('#search-filter').val().toUpperCase();
			var table	= $('#tableRisultati');
			var rows	= table.find('tr').not('[tiporiga="ins"]');
			var columns = rows.find('td.tdRRFarmaci.classFarmaco');
			var columns_to_hide;

			columns.closest('tr').show();

			if( search != '' ){
				columns_to_hide = columns.filter(function(){
					return $(this).text().indexOf( search ) == -1;
				});
				columns_to_hide.closest('tr').hide();
			}
		},
		
		getRigaIns: function() {
			return $("tr[tiporiga=ins]").first();
		},

		setEvents:function(){

			//debug temporaneo
			$(".footerTabs").on("dblclick",function(){
				RICETTA_FARMACI.debug(false);
				//parent.NS_MMG_UTILITY.setVeloNero("iFrameRiepilogo"+indiceIframe);
				//RICETTA.reload(indiceIframe);
			});

			//ordinamento per data
			$("#th_data").on("click", function(){
				TABLE.orderRows($(this),'RR_FARMACI',"DATA","");
			});

			//ordinamento per farmaci
			$("#th_farmaco").on("click", function(){
				TABLE.orderRows($(this),'RR_FARMACI',"FARMACO","");
			});
			
			//scelta di quel determinato farmaco
			$("tr."+classRiga+":not([tiporiga=ins])").find(".classFarmaco").on("dblclick", function(){
				
				if(!home.MMG_CHECK.isDead()){return;}
				
				var valoreCampo = $(this).html();
				var rigaIns 	= $("tr[tiporiga=ins]").first();
				var rigaAttuale = $(this).parent();
				
				descrPosologia 	= rigaAttuale.find(".classPosologia input").val();
				codPosologia 	= rigaAttuale.attr("cod_posologia");
				qta				= rigaAttuale.find(".classQuantita input").val();
				
				//alert(descrPosologia + ' ' + codPosologia + ' ' + qta);
				
				valoreCampo = valoreCampo.replace("\%"," ");
				
				rigaIns.find(".classFarmaco input").val(valoreCampo);
				idxLinea = rigaIns.attr("idx");
				
				rigaIns.find(".classPosologia input").val(descrPosologia);
				rigaIns.find(".classQuantita input").val(qta);
				rigaIns.attr("cod_posologia", codPosologia);
				
				home.NS_MMG.apri("MMG_SCELTA_FARMACI&CAMPO_VALUE="+valoreCampo+"&IDX_RIGA="+idxLinea);
			});

			//selezione della riga
			$("tr."+classRiga).on("click",function(){

				RICETTA_FARMACI.setIDX($(this).attr("idx"),true);
			});

			//selezione della riga
			$("tr."+classRiga).find(".tdAction input").on("change",function(){
				var check = $(this);
				var riga =  check.parent().parent();
				RICETTA_FARMACI.setIDX(riga.attr("idx"),true);
				
				if(riga.find(".iconPT").hasClass("scaduto")){
					check.attr("checked",false);
					home.NOTIFICA.warning({
						message: traduzione.lblPTScaduto,
						title: "Attenzione",
						timeout:"15"
					});
				}

				var vChecked = check.is(":checked");
				var vFarmaco = NS_MMG_UTILITY.getAttr(riga,"cod_farmaco");
				if(vChecked && vFarmaco != ''){
					RICETTA_FARMACI.controllaEsenzioni( riga );
					RICETTA_FARMACI.checkPianoTerapeutico( riga );
				}
			});

			//doppio clic sull'input di inserimento del farmaco
			$("tr."+classRiga).find('.classFarmaco').find("input").on("dblclick",function(){
				if(!home.MMG_CHECK.isDead()){return;}
				var riga=$("tr[idx="+idx_sel+"]");
				$(this).val($(this).val().toUpperCase());
				var valoreCampo = escape($(this).val());
				home.NS_MMG.apri("MMG_SCELTA_FARMACI&CAMPO_VALUE="+valoreCampo+"&IDX_RIGA="+riga.attr("idx"));
				$(this).val("");
			});

			$("tr."+classRiga).find('.classFarmaco').find("input").off("blur").on("blur",function(){
				if(!home.MMG_CHECK.isDead()){return;}
				var riga=$("tr[idx="+idx_sel+"]");
				//alert('blur')
				$(this).val($(this).val().toUpperCase());
				var valoreCampo = escape($(this).val());
				if($(this).val() != ''){
					home.NS_MMG.apri("MMG_SCELTA_FARMACI&CAMPO_VALUE="+valoreCampo+"&IDX_RIGA="+riga.attr("idx"));
					$(this).val("");
				}
			});

			$("tr."+classRiga).find('.classFarmaco').find("input").off(RICETTA.eventKeyUpBrowser).on(RICETTA.eventKeyUpBrowser,function(e){
				if(!home.MMG_CHECK.isDead()){return;}
				
				if(e.which == '13'){
					var riga=$("tr[idx="+idx_sel+"]");
					$(this).val($(this).val().toUpperCase());
					if($(this).val() != ''){
						
						home.NS_MMG.apri("MMG_SCELTA_FARMACI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
						$(this).val("");
					}
					return false;
				}
				//fatto per bloccare la selezione del pulsante del tipo di ricetta
				e.stopImmediatePropagation();
			});

			//doppio clic sull'inserimento dell'esenzione
			$("tr."+classRiga).find('.classEsenzione').find("input").on("dblclick",function(){
				if(!home.MMG_CHECK.isDead()){return;}
				home.NS_MMG.apri("MMG_SCELTA_ESENZIONI&PROVENIENZA=FARMACI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+idx_sel);
				$(this).val("");
			});

			//keyup sull'inserimento dell'esenzione
			$("tr."+classRiga).find('.classEsenzione').find("input").on(RICETTA.eventKeyUpBrowser,function(e){
				if(!home.MMG_CHECK.isDead()){return;}
				var riga=$("tr[idx="+idx_sel+"]");
				if(e.which == '13'){
					home.NS_MMG.apri("MMG_SCELTA_ESENZIONI&PROVENIENZA=FARMACI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+idx_sel);
					$(this).val("");
				}
			});

			//onblur sull'inserimento della esenzione
			$("tr."+classRiga).find('.classEsenzione').find("input").on("blur",function(){ 
				
				if(!home.MMG_CHECK.isDead()){return;}
				
				if($(this).val()!= '' && $(this).val()!= riga.esenzione){
					
					home.NS_MMG.apri("MMG_SCELTA_ESENZIONI&PROVENIENZA=FARMACI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+ $(this).closest("tr").attr("idx") );
					$(this).val("");
				
				}else if ($(this).val() == ''){
					RICETTA_FARMACI.setEsenzione( $(this).closest("tr").attr("idx") , { descrizione: "", codice: "" } );
				}
			});

			//doppio clic sull'inserimento della posologia
			$("tr."+classRiga).find('.classPosologia').find("input").on("dblclick",function(){
				if(!home.MMG_CHECK.isDead()){return;}
				home.NS_MMG.apri("MMG_SCELTA_POSOLOGIA&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+idx_sel);
				$(this).val("");
			});

			//onblur sull'inserimento della posologia
			$("tr."+classRiga).find('.classPosologia').find("input").on("blur",function(){
				if(!home.MMG_CHECK.isDead()){return;}
				if($(this).val()!= ''){
					home.NS_MMG.apri("MMG_SCELTA_POSOLOGIA&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+$(this).closest("tr").attr("idx"));
					$(this).val("");
				}
				else
					RICETTA_FARMACI.setPosologia( $(this).closest("tr").attr("idx"), { descrizione: "", codice: "" } );
			});

			//tasto invio sull'inserimento della posologia
			$("tr."+classRiga).find('.classPosologia').find("input").on(RICETTA.eventKeyUpBrowser,function(e){
				if(!home.MMG_CHECK.isDead()){return;}
				if(e.which == '13'){
					if($(this).val()!= ''){
						var riga=$("tr[idx="+idx_sel+"]");
						home.NS_MMG.apri("MMG_SCELTA_POSOLOGIA&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
						$(this).val("");
					}
				}
			});

			//doppio clic sull'inserimento della concedibilita'
			$("tr."+classRiga).find('.classConcedibilita').find("input").on("dblclick",function(){
				if(!home.MMG_CHECK.isDead()){return;}
				var riga=$("tr[idx="+idx_sel+"]");
				home.NS_MMG.apri("MMG_SCELTA_CONCEDIBILITA&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
			});

			//button inserisci
			$(".butInserisci").click(function(){
				if(!home.MMG_CHECK.isDead()){return;}
				TABLE.insertRow();
			});

			//button inserisci prescrizione libera
			$(".butPrescrLibera").click(function(){
				if(!home.MMG_CHECK.isDead()){return;}
				RICETTA_FARMACI.insertPrescrLibera();
			});



			//show del motivo sostituzione se il check risulta selezioato
			$(".classSost").find("input[type='checkbox']").on("click", function(){
				if(!home.MMG_CHECK.isDead()){return;}
				//var riga = $(this).closest("tr");
				
				if($(this).is(":checked")){

					//riga.find(".tdAction input").attr("checked",true);
					RICETTA_FARMACI.showMotivoSost($(this).parent(),true);
				}else{
					//riga.find(".tdAction input").attr("checked",false);
					RICETTA_FARMACI.showMotivoSost($(this).parent(),false);
				};
			});

			//show del motivo sostituzione se il check risulta selezioato
			$(".classPA").find("input[type='checkbox']").on("click", function(){
				if(!home.MMG_CHECK.isDead()){return;}
				var riga = $(this).parent().parent();
				if($(this).attr("checked") == 'checked'){
					riga.attr("pa","S");
					riga.find(".tdAction input").attr("checked",true);
				}else{
					riga.attr("pa","N");
					//riga.find(".tdAction input").attr("checked",false);
				};
			});

			//setdella data di fine del pt
			$(".iconPT").on("click", function(){
				if(!home.MMG_CHECK.isDead()){return;}
				var riga = $(this).parent().parent();
				RICETTA_FARMACI.context_menu.setPianoTerapeutico(riga);
			});


			//apertura menu contestuale al click sulle icone
			//icona ingranaggio
			RICETTA_FARMACI.table.on("click",".icon-cog-1",function(e){
				RICETTA_FARMACI.setIDX($(this).parent().parent().attr("idx"), true);
				e.preventDefault();
				e.stopImmediatePropagation();
				RICETTA_FARMACI.closeContextMenu();
				$option.test(e, this);
			});

			//icona clessidra
			RICETTA_FARMACI.table.on("click",".icon-hourglass", function(e){
				RICETTA_FARMACI.setIDX($(this).parent().parent().attr("idx"), true);

				e.preventDefault();
				e.stopImmediatePropagation();
				RICETTA_FARMACI.closeContextMenu();
				$crono.test(e, this);
			});

			//icona rimanenza (triangolino)
			RICETTA_FARMACI.table.on("click",".icon-attention", function(){
				RICETTA_FARMACI.setIDX($(this).parent().parent().attr("idx"), true); 

				var obj = $(this);
			});


			//icona info
			RICETTA_FARMACI.table.on("click",".icon-info-circled", function(e){
				RICETTA_FARMACI.setIDX($(this).parent().parent().attr("idx"), true); 

				e.preventDefault();
				e.stopImmediatePropagation();
				RICETTA_FARMACI.closeContextMenu();
				$info.test(e, this);
				
				//decommentare se si vuole il popup informazione sul clic dell'iconcina delle info
				//RICETTA_FARMACI.context_menu.showInfoPrescrizione($("tr[idx="+idx_sel+"]"));
			});

			//icona blocco
			RICETTA_FARMACI.table.on("click",".icon-lock", function(e){
				RICETTA_FARMACI.setIDX($(this).parent().parent().attr("idx"), true); 
				var riga = $(this).parent().parent();
				RICETTA_FARMACI.context_menu.rimuoviBlocco(riga);
			});


			// modifica data prescrizione
			$(document).on("dblclick","tr[iden] .classData", function() {
				if(!home.MMG_CHECK.isDead()){return;}
				if($(this).parent().attr("sito") == 'MMG'){
					RICETTA.apriDialogData($(this), RICETTA_FARMACI.vType);
				}else{
					home.NOTIFICA.warning({
						message: traduzione.deniedCambioDataMI,
						title: "Attenzione",
						timeout:"15"
					});
				}
			});

		},

		setNScheda: function(n_scheda) {
			RICETTA.chiudischeda = n_scheda;
		},

		checkEsenzione:function(riga){
			if(riga.attr("concedibile") == 'N'){
				home.NOTIFICA.error({
					message: traduzione.lblFarmacoNonEsente,
					title: "Attenzione"
				});
				return false;
			}else{
				return true;
			}
		},

		checkPianoTerapeutico: function( row ) {

			if( row.attr("pt") == "N" || ( row.attr("pt") == "S" && row.attr("data_fine") < moment().format("YYYYMMDD"))){
				
				RICETTA_FARMACI.getToolDb().select({
					id: "RICETTE.CHECK_PIANO_TERAPEUTICO",
					parameter: {
						cod_farmaco : { v : row.attr("cod_farmaco") , t : 'V'},
						eta : { v : home.ASSISTITO.ETA , t : 'V'}
					}
				}).done( function( resp ){
					if (resp.result[0].PT > 0 ) {
						RICETTA_FARMACI.dialogPianoTerapeutico( row );
					}
				});
			}
		},

		dialogPianoTerapeutico: function( row ){
			var dialogContent = $("<p/>").html("Il farmaco selezionato &egrave; soggetto a Piano Terapeutico. Per confermare, inserire la data di fine del piano");
			var options = {
				'id'				: "dialogConfirm",
				'title'				: row.find("td.classFarmaco").text(),
				'ESCandClose'		: true,
				'created'			: function(){ $('.dialog').focus(); },
				'width'				: 250,
				'height'			: 320,
				'showBtnClose' 		: false,
				'modal'				: true,
				'movable'			: true,
				'buttons'			: [{
						label: "Seleziona ugualmente senza PT",
						action: function (ctx) {
							home.$.dialog.hide();
						}
					}
				]
			};
			
			home.$.dialog(dialogContent, options);
			dialogContent.Zebra_DatePicker({always_visible: dialogContent.parent(), onSelect: function(data,dataIso) {

				row.attr("pt","S");
				row.attr("data_ini", moment().format('YYYYMMDD'));
				row.attr("data_fine",dataIso);
				home.$.dialog.hide();
			}});
			home.$(".Zebra_DatePicker .dp_footer").hide();
		},

		getToolDb: function() 
		{
			if (!RICETTA_FARMACI.toolDb)
				RICETTA_FARMACI.toolDb = $.NS_DB.getTool({_logger: RICETTA_FARMACI.logger});

			return RICETTA_FARMACI.toolDb;
		},

		context_menu:{

			azzeraContatore:function(riga){ 
				
				var motivazione = '';
				
				$.dialog(
						"<div><a>"+ traduzione.dialogMotivazioneAzzeramento +"</a>" +
						"<textarea id='txtMotivazione' style='width:300px; height:50px'>"
						+"</textarea></div>",
						{
							'id' 				: "dialogConfirm",
							'title' 			: "Azzeramento",
							'ESCandClose'		: true,
							'created'			: function(){ $('.dialog').focus(); },
							'width' 			: 350,
							'height'			: 120,
							'showBtnClose'	 	: false,
							'modal' 			: true,
							'movable' 			: true,
							'buttons'			: [
									{
										label : traduzione.lblOk,
										keycode : "13",
										'classe': "butVerde",
										action : function(ctx) {
											
											motivazione = $("#txtMotivazione").val() != '' ? $("#txtMotivazione").val() : 'Nessuna motivazione inserita' ;
											
											RICETTA.getToolDb().call_procedure({
									            id:'RR_INFO_PRESCRIZIONE.AZZERA_CONTATORE_FARMACO',
									            parameter: {
									            	"pUteIns"		: { v : home.baseUser.IDEN_PER, t : 'N', d: 'I'},
									            	"pIdenMed"		: { v : home.CARTELLA.IDEN_MED_PRESCR, t : 'N', d: 'I'},
									            	"pCodFarmaco"	: { v : riga.attr("cod_farmaco"), t : 'V', d: 'I'},
									            	"pCodPA"		: { v : riga.attr("cod_pa"), t : 'V', d: 'I'},
									            	"pIdenAnag"		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N', d: 'I'},
									            	"pMotivazione"	: { v : motivazione, t : 'V', d: 'I'},
									            	"p_result"		: { t : 'V', d: 'O'}
									            }
											}).done( function(resp) {

												if (resp.p_result.indexOf('OK')==0) {

													//ricarico la parte della ricetta
													RICETTA.reload();
													
												} else {
													home.NOTIFICA.error({
														message : resp.message
													});
												}
											});
											$.dialog.hide();
										}
									}, {
										label : traduzione.lblAnnulla,
										keycode : "27",
										action : function(ctx) {
											$.dialog.hide();
										}
									} ]
						});
				
			},
			
			removeCronica:function(riga){
				if(!home.MMG_CHECK.isDead()){return;}
				if(!$("tr[idx="+idx_sel+"]").hasClass("TRdeleted")){
					$("tr[idx="+idx_sel+"]").attr("cronica","N");
					RICETTA.checkRiga(classRiga);
					RICETTA.updateInfoRow($("tr[idx="+idx_sel+"]"), 'DELETED_CRONICA');
				}else{
					home.NOTIFICA.warning({
						message: traduzione.msg_1,
						title: "Attenzione",
						timeout:"15"
					});
				}
			},

			setCronica:function(riga){
				if(!home.MMG_CHECK.isDead()){return;}
				if(!$("tr[idx="+idx_sel+"]").hasClass("TRdeleted")){
					$("tr[idx="+idx_sel+"]").attr("cronica","S");
					RICETTA.checkRiga(classRiga);
					RICETTA.updateInfoRow($("tr[idx="+idx_sel+"]"), 'CRONICA');
				}else{
					home.NOTIFICA.warning({
						message: traduzione.msg_1,
						title: "Attenzione",
						timeout:"15"
					});
				}
			},

			setTemporanea:function(riga){
				if(!home.MMG_CHECK.isDead()){return;}
				var indice = $("#IDX").val();
				var iden=$("tr[idx="+idx_sel+"]").attr("iden");

				if(!$("tr[idx="+idx_sel+"]").hasClass("TRdeleted")){
					home.NS_MMG.apri("CRONO_RR_FARMACI&CASE=TEMPORANEA&IDEN="+iden+"&IDX="+indice+"&OBJ="+riga.find("td.classFarmaco").text(),400,750);
				}else{
					home.NOTIFICA.warning({
						message: traduzione.msg_1,
						title: "Attenzione",
						timeout:"15"
					});
				}
			},

			setPeriodica:function(riga){
				if(!home.MMG_CHECK.isDead()){return;}
				var indice = $("#IDX").val();
				var iden=$("tr[idx="+idx_sel+"]").attr("iden");

				if(!$("tr[idx="+idx_sel+"]").hasClass("TRdeleted")){
					home.NS_MMG.apri("CRONO_RR_FARMACI&CASE=PERIODICA&IDEN="+iden+"&IDX="+indice+"&OBJ="+riga.find("td.classFarmaco").text(),400,750);
				}else{
					home.NOTIFICA.warning({
						message: traduzione.msg_1,
						title: "Attenzione",
						timeout:"15"
					});
				}
			},

			setPianoTerapeutico:function(riga){
				if(!home.MMG_CHECK.isDead()){return;}
				var indice = $("#IDX").val();
				var iden=riga.attr("iden");
				var dataInizio = riga.attr("data_ini");
				var dataFine =riga.attr("data_fine");

				if(!riga.hasClass("TRdeleted")){
					home.NS_MMG.apri("CRONO_RR_FARMACI&CASE=PT&IDEN="+iden+"&IDX="+indice+"&DATA_INIZIO="+dataInizio+"&DATA_FINE="+dataFine,400,400);
				}else{
					home.NOTIFICA.warning({
						message: traduzione.msg_1,
						title: "Attenzione",
						timeout:"15"
					});
				}
			},

			oscuraBackend: function( flag_oscuramento, dati_elemento, callback) {
				dati_elemento.tabella = "MMG_FARMACI_DETTAGLIO";
				dati_elemento.campo_multi = "COD_FARMACO";
				RICETTA.oscura(flag_oscuramento, dati_elemento, callback);
			},
			
			oscura: function(flag_oscuramento) {
				RICETTA_FARMACI.context_menu.oscuraBackend(flag_oscuramento, {
					iden_tabella:$("tr[idx="+idx_sel+"]").attr("iden"),
					iden_multi:$("tr[idx="+idx_sel+"]").attr("cod_farmaco")
				}, {
					singola: function(dati_elemento) {
						$("tr[idx="+idx_sel+"]").attr("oscurato",flag_oscuramento);
					},
					multi: function(dati_elemento) {
						RICETTA.reload();
					}
				});
			},

			duplicaPosologia:function(riga){

				if(!home.MMG_CHECK.isDead()){return;}

				if(!$("tr[idx="+idx_sel+"]").hasClass("TRdeleted")){
					//mi creo la copia della riga
					var row = RICETTA.duplicateRow();

					//cancello i valori che non interessano
					row.find(".classData").html("");
					row.find(".classFarmaco").html(newRiga.find(".classFarmaco").html());
					row.attr("cod_farmaco","");
					row.attr("cronica","");
					row.attr("periodica","");
					row.attr("temporanea","");
					row.attr("iden_problema",home.ASSISTITO.iden_problema);
					row.attr("blocco","N");;

					row.removeClass("TRselected");

					row.find(".tdAction").find("i").hide();
					row.find(".tdAction input").attr("disabled","disabled");

					RICETTA.setEventNewRow(row);

					_riga.before(row);

				}else{
					home.NOTIFICA.warning({
						message: traduzione.msg_1,
						title: "Attenzione"
					});
				}
			},

			cancellaPrescrizione:function(){

				if(!home.MMG_CHECK.isDead()){return;}

				var iden = $("tr[idx="+idx_sel+"]").attr("iden");

				if($("tr[idx="+idx_sel+"]").attr("sito") == 'MMG'){					
					RICETTA.cancella('FARMACI', [iden]);
				}else{
					home.NOTIFICA.warning({
						message: traduzione.deniedDeleteMI,
						title: "Attenzione",
						timeout:"15"
					});
				}
			},

			cancellaPrescrizioni:function(){
				
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

				if(arIden.length<1){
					
					home.NOTIFICA.warning({
						message: traduzione.lblSelAlmeno,
						title: "Attenzione"
					});						
				
				}else{
					RICETTA.cancella('FARMACI', arIden);
				}
				
				//avviso che alcune righe non sono state cancellate
				if(counter>0){
					home.NOTIFICA.warning({
						message: traduzione.deniedDeleteMIMulti,
						title: "Attenzione"
					});
				}
			},

			annullaCancellaPrescrizione:function(){

				if($("tr[idx="+idx_sel+"]").hasClass("TRdeleted")){

					$("tr[idx="+idx_sel+"]").find("input").removeAttr("disabled");
					RICETTA.removeDisableRiga(idx_sel);
					RICETTA.updateInfoRow($("tr[idx="+idx_sel+"]"), 'UNDELETED');

				}else{
					home.NOTIFICA.warning({
						message: traduzione.msg_2,
						title: "Attenzione",
						timeout:"15"
					});
				}
			},

			rimuoviBlocco:function(riga){

				if(!home.MMG_CHECK.isDead()){return;}

				if(!home.MMG_CHECK.isMedicoCheck({
					message: "La terapia pu\u00F2 essere sbloccata unicamente da un utente medico",
					title: "Attenzione"
				})) {
					return;
				}

				RICETTA.updateInfoRow($("tr[idx="+idx_sel+"]"), 'REMOVE_BLOCCO');
				riga.find(".icon-lock").hide();
			},
			
			removeMI:function(pIden){
				arIden 		= [pIden];
				//arMedIniz 	= [pMedIniz];
				MEDICINA_INIZIATIVA.auxCallDb("REMOVE", ["FARMACI"], arIden, '');
				$("tr[iden="+pIden+"]").attr("mi","N");
				RICETTA.checkInfoFarmaci("trRigaFarmaci", pIden);
			},
			
			removeMIMulti:function(pType){
				if(!home.MMG_CHECK.isDead()){return;}

				var arIden 		= [];
				var arType 		= [];
				var arMedIniz	= [];
				
				$("tr[iden]").not("[tiporiga='ins']").find(".tdAction input:checked").each(function() {
					arIden.push($(this).closest("tr").attr("iden"));
					$("tr["+$(this).closest("tr").attr("iden")+"]").attr("mi","N");
					arType.push("FARMACI");
					arMedIniz.push(pType);
				});
				if(arIden.length<1){
					home.NOTIFICA.warning({
						message: traduzione.lblSelAlmeno,
						title: "Attenzione"
					});						
				}else{
					MEDICINA_INIZIATIVA.auxCallDb("REMOVE", arType, arIden, arMedIniz);
				}
				
				RICETTA.checkInfoFarmaci("trRigaFarmaci");
			},
			
			setMI:function(pIden, pMedIniz){
				arIden 		= [pIden];
				arMedIniz 	= typeof pMedIniz != 'undefined' ? [pMedIniz] : '' ;
				MEDICINA_INIZIATIVA.auxCallDb("SET", ["FARMACI"], arIden, arMedIniz);
			},
			
			setMIMulti:function(pType){

				if(!home.MMG_CHECK.isDead()){return;}

				var arIden 		= [];
				var arType 		= [];
				var arMedIniz	= [];
				
				$("tr[iden]").not("[tiporiga='ins']").find(".tdAction input:checked").each(function() {
					arIden.push($(this).closest("tr").attr("iden"));
					arType.push("FARMACI");
					arMedIniz.push(pType);
				});
				if(arIden.length<1){
					home.NOTIFICA.warning({
						message: traduzione.lblSelAlmeno,
						title: "Attenzione",
						timeout:"15"
					});						
				}else{
					MEDICINA_INIZIATIVA.auxCallDb("SET", arType, arIden, arMedIniz);
				}
			},			

			showMonografia:function(riga){
				RICETTA_FARMACI.icone.openInfo(idx_sel);
			},

			showInfo:function(riga){

				var cod_farmaco = riga.attr("cod_farmaco");
				var titolo = riga.find(".classFarmaco").text();

				home.NS_MMG.open('MMG_INFO_FARMACO&COD_FARMACO='+cod_farmaco);

			},

			showInfoPrescrizione: function( riga ) {
				
				var pIden = riga.attr("iden");
				
				RICETTA_FARMACI.getToolDb()
				.select({
					id: "RICETTE.GET_INFO_FARMACO",
					parameter: {
						iden : { v : pIden , t : 'N'}
					}	
				})
				.done( function( resp ){
					home.NOTIFICA.info({
						message: resp.result[0].MESSAGE ,
						title: resp.result[0].TITLE,
						timeout: 10
					});
				});		
			},
			
			showInterazioni:function(riga){

				var cod_farmaco = riga.attr("cod_farmaco");
				var titolo = riga.find(".classFarmaco").text();

				home.NS_MMG.apri('INTERAZIONI_FARMACO&COD_FARMACO='+cod_farmaco);

			},

			showStorico:function(riga){

				var cod_farmaco = riga.attr("cod_farmaco");
				var descr_farmaco = riga.attr("tiporiga") == 'ins' ? riga.find(".classFarmaco input").val() : riga.find(".classFarmaco").text();
				home.NS_MMG.apri('STORICO_FARMACI', '&COD_FARMACO=' + cod_farmaco + '&DESCR_FARMACO=' + descr_farmaco);

			}
		},

		closeContextMenu:function(){
			$crono.close();
			$option.close();
			$info.close();
		},

		controllaEsenzioni:function( row ){
			
			if (home.CARTELLA.getRegime() == 'LP') {
				setEsenzione(row, null, true);
				RICETTA.context_menu.forzatura(row,'');
				return;
			}
			
			var esenzioneTotale = home.ASSISTITO.getEsenzioni(null,"T");
			var vEse;

			// se la riga non ha classe_farmaco e' un presidio, quindi salto il controllo esenzioni
			// (28/08/2015 lucas: Aggiunta la gestione della V01
			if( !LIB.isValid(row.attr("classe_farmaco")) &&  getEsenzione("G01")==null && getEsenzione("G02")==null && getEsenzione("V01")==null)
			{
				return;
			}
			
			// se ha classe farmaco C salto il controllo esenzioni. L'importante è che non abbia G02, G01 che coprono anche i faramci in classe C
			// (17/04/2015 lucas: modificato da row.attr("classe_farmaco") == "C"  -->  row.attr("classe_farmaco") != "A"  in quanto metteva l'esenzione anche su farmaci e su integratori che avevano classe diversa da A o C)
			// (28/08/2015 lucas: Aggiunta la gestione della V01
			else if( row.attr("classe_farmaco") != "A" &&  getEsenzione("G01")==null && getEsenzione("G02")==null && getEsenzione("V01")==null)
			{
				return;
			}
			
			// nel caso ci siano esenzioni, come la 048, e il paziente le abbia ancora
			else if((row.attr("cod_esenzione") == 'TDLO1' 	&& (vEse="TDL01")) 					||
					(row.attr("cod_esenzione") == '048' 	&& (vEse=getEsenzione("048"))) 		||
					(row.attr("cod_esenzione") == '046' 	&& (vEse=getEsenzione("046"))) 		||
					(row.attr("cod_esenzione") == '0A02' 	&& (vEse=getEsenzione("0A02"))) 	||
					(row.attr("cod_esenzione") == '0B02' 	&& (vEse=getEsenzione("0B02"))) 	||
					(row.attr("cod_esenzione") == '0C02' 	&& (vEse=getEsenzione("0C02"))) 	||
					(row.attr("cod_esenzione") == 'L02' 	&& (vEse=getEsenzione("L02"))) 		||
					(row.attr("cod_esenzione") == 'L03' 	&& (vEse=getEsenzione("L03"))) 		||
					(row.attr("cod_esenzione") == 'L04' 	&& (vEse=getEsenzione("L04"))) 		||
					(row.attr("cod_esenzione") == 'S03' 	&& (vEse=getEsenzione("S03")))		||
					(row.attr("cod_esenzione") == 'M50' 	&& (vEse=getEsenzione("M50")))		||
					(row.attr("cod_esenzione") == '041' 	&& (vEse=getEsenzione("041")))
			){

				return;
			}
			
			// esenzioni totali che non richiedono il controllo delle parziali
			// esenzioni S01 e S02 (invalidità per servizio) che devono essere trattate come C01 e C02 (indicazione del Dr Fusetti, che ha sentito Dr Bessero, del 13/07/2015)
			// esenzione parziale G01,G02 che hanno la priorita' sulle esenzioni legate ai farmaci
			// (28/08/2015 lucas: Aggiunta la gestione della V01
			else if (	(vEse=getEsenzione("G02")) || 
						(vEse=getEsenzione("G01"))||
						(vEse=getEsenzione("S01"))||
						(vEse=getEsenzione("S02"))||
						(vEse=getEsenzione("V01"))||
						(vEse=getEsenzione("C02"))||
						(vEse=getEsenzione("C01"))
					)
			{
				setEsenzione(row,vEse,true);
			}
			
			// non ha l'esenzione parziale G02,G01,V01 e non ha esenzioni totali (la C03 non e' considerata esenzione totale per i farmaci)  --> controllo esenzioni parziali
			// (28/08/2015 lucas: Aggiunta la gestione della V01
			else if (
						(getEsenzione("G02")==null &&  getEsenzione("G02")==null && getEsenzione("G02")==null) &&
						(esenzioneTotale.length==0 || (esenzioneTotale.length==1 && getEsenzione("C03")))
					)
			{
				setEsenzione(row,null);
				RICETTA_FARMACI.controllaEsenzioniParziali(row);
			}
			else 
			{
				vEse = (esenzioneTotale[0].CODICE_ESENZIONE != "C03") ? esenzioneTotale[0] : esenzioneTotale[1];
				setEsenzione(row,vEse,true);
				RICETTA_FARMACI.controllaEsenzioniParziali(row);
			}

			function getEsenzione(codice){
				var esenzione = home.ASSISTITO.getEsenzione(codice);
				return typeof esenzione != 'undefined' ? esenzione : null;
			};

			function setEsenzione(row, esenzione, totale) {

				var inpEse = row.find(".classEsenzione input");
				esenzione = (esenzione != null) ? esenzione : {CODICE_ESENZIONE:'', DESCR_ESENZIONE:''};
				row.attr("cod_esenzione",esenzione.CODICE_ESENZIONE);
				inpEse.val(esenzione.CODICE_ESENZIONE + " - " + esenzione.DESCR_ESENZIONE).attr("title",esenzione.DESCR_ESENZIONE);
				totale ? inpEse.addClass("esenzTotale") : inpEse.removeClass("esenzTotale");
			};
		},

		controllaEsenzioniParziali: function(pRiga) {

			var codFarmaco = pRiga.attr("cod_farmaco");
			home.ASSISTITO.checkEsenzioniFarmaci(codFarmaco, function(esenzioni) {
				var esenzione = esenzioni[codFarmaco];
				if( typeof esenzione != 'undefined' ) {
					pRiga.attr("cod_esenzione",esenzione.CODICE_ESENZIONE);
					pRiga.find(".classEsenzione input").val(esenzione.CODICE_ESENZIONE + ' - ' +esenzione.DESCR_ESENZIONE).addClass("esenzParziale").attr("title",esenzione.CODICE_ESENZIONE + ' - ' +esenzione.DESCR_ESENZIONE);
				}
			});
		},

		debug:function(boolAlert){

			var msg = 'DEBUG INFORMAZIONI RIGA SELEZIONATA:\n';
			msg+= '\n@riga.nome_farmaco: '		+riga.nome_farmaco;
			msg+= '\n@riga.cod_farmaco: '		+riga.cod_farmaco;
			msg+= '\n@riga.quantita: '			+riga.quantita;
			msg+= '\n@riga.esenzione: '			+riga.esenzione;
			msg+= '\n@riga.cod_esenzione: '		+riga.cod_esenzione;
			msg+= '\n@riga.concedibilita: '		+riga.concedibilita;
			msg+= '\n@riga.cod_concedibilita: '	+riga.cod_concedibilita;
			msg+= '\n@riga.cronica: '			+riga.cronica;
			msg+= '\n@riga.periodica: '			+riga.periodica;
			msg+= '\n@riga.temporanea: '		+riga.temporanea;
			msg+= '\n@riga.posologia: '			+riga.posologia;
			msg+= '\n@riga.cod_posologia: '		+riga.cod_posologia;
			msg+= '\n@riga.problema: '			+riga.problema;
			msg+= '\n@riga.deleted: '			+riga.deleted;
			msg+= '\n@riga.da_stampare: '		+riga.da_stampare;
			msg+= '\n@riga.PA: '				+riga.PA;
			msg+= '\n@riga.codPA: '				+riga.codPA;
			msg+= '\n@riga.sost_si_no: '		+riga.sost_si_no;
			msg+= '\n@riga.motivo_sost: '		+riga.motivo_sost;
			msg+= '\n@riga.classe_icona: '		+riga.classe_icona;
			msg+= '\n@riga.blocco: '			+riga.blocco;
			msg+= '\n@riga.note_cuf: '			+riga.note_cuf;
			msg+= '\n@riga.piano_terapeutico: '	+riga.piano_terapeutico;
			msg+= '\n@riga.classe: '			+riga.classe;

			if(boolAlert){
				home.NOTIFICA.warning({
					message: msg,
					title: "Attenzione",
					timeout:"15"
				});
			}else{
				home.logger.debug(msg);
			}
		},

		getProdotti:function(){

			//var prodottiNonSelezionati = new Array();
			var prodottiConBlocco = new Array();
			RICETTA_FARMACI.initObjSalvataggio();
			RICETTA_FARMACI.initObjControl();
			var regime = home.CARTELLA.getRegime();
			
			$(".tdAction input:checked").each(function(){
				
				var riga = $(this).parent().parent();

				/*
				//controllo e prendo i farmaci prescritti negli ultimi 6 mesi per il controllo delle interazioni
				if(NS_MMG_UTILITY.giorni_differenza(riga.attr("data")) <= 180 || riga.attr("data") == ''){
					
					var obj_farmaco = new Array();
					obj_farmaco[0] = new Array();
					obj_farmaco[1] = new Array();
					obj_farmaco[2] = new Array();


					obj_farmaco[0].push(riga.attr("cod_farmaco"));
					obj_farmaco[1].push(riga.attr("tiporiga") == 'ins' ? riga.find(".classFarmaco input").val() : riga.find(".classFarmaco").text());
					obj_farmaco[2].push(NS_MMG_UTILITY.getAttr(riga,"cod_pa"));
					
					objControl.prodottiDaControllare.push(riga.attr("cod_farmaco"));
					objControl.descrProdDaControllare.push(riga.attr("tiporiga") == 'ins' ? riga.find(".classFarmaco input").val() : riga.find(".classFarmaco").text());
				}
				
				//pusho l'oggetto codice-descrizione_farmaco
				objControl.farmaco.push(obj_farmaco);
				*/
//				if($(this).attr("checked")=="checked"){

				if(riga.attr("cod_farmaco")!='' && riga.attr("deleted") != 'S' ){
					if(riga.attr("blocco") != 'S'){
						var farmaco = new Object();

						farmaco.index = riga.attr("idx");
						farmaco.iden = riga.attr("iden");
						farmaco.cod_farmaco = riga.attr("cod_farmaco");
						farmaco.descr_farmaco = riga.attr("tiporiga") == 'ins' ? riga.find(".classFarmaco input").val() : riga.find(".classFarmaco").text();
						//farmaco.data = moment().format('YYYYMMDD'); //sempre "now", potrebbe servire riga.attr("data") o altro nel caso di inserimento prescrizioni pregresse per il calcolo corretto della rimanenza?
						var quantita = RICETTA.checkQTA(riga.find(".classQuantita input").val());
						farmaco.qta = isNaN(quantita) ? '1' : quantita;
						farmaco.pa_si_no = LIB.isValid(riga.attr("pa")) && riga.attr("pa") != "" ? riga.attr("pa") : "S";
						farmaco.cod_pa = NS_MMG_UTILITY.getAttr(riga,"cod_pa");
						farmaco.cronicita = riga.attr("cronica");
						farmaco.periodicita = riga.attr("periodica");
						farmaco.temporaneita = riga.attr("temporanea");
						farmaco.concedibilita = riga.attr("concedibile");
						farmaco.da_stampare = riga.attr("daStampare");
						farmaco.blocco = riga.attr("blocco");				
						farmaco.note_cuf = riga.attr("nota_cuf");
						farmaco.forzatura = riga.attr("forzatura");
						farmaco.onere = regime;
						farmaco.piano_terapeutico =riga.attr("pt");
						farmaco.data_ini =riga.attr("data_ini");
						farmaco.data_fine = riga.attr("data_fine");
						farmaco.classe =NS_MMG_UTILITY.getAttr(riga,"classe_farmaco");
						farmaco.suggerita =NS_MMG_UTILITY.getAttr(riga,"suggerita", "N");
						farmaco.ripetibile =NS_MMG_UTILITY.getAttr(riga,"ripetibile", "N");
						farmaco.stampa_posologia = NS_MMG_UTILITY.getAttr(riga,"stampa_posologia", "N") == "S" ? "S" : "";

						//lo considero solo nel caso sia diverso da quello di default
						if(NS_MMG_UTILITY.getAttr(riga,"show_farmaco_originale") != '' && NS_MMG_UTILITY.getAttr(riga,"show_farmaco_originale") != LIB.getParamUserGlobal('SHOW_FARMACO_ORIGINALE','1')){
							farmaco.SHOW_FARMACO_ORIGINALE = NS_MMG_UTILITY.getAttr(riga,"show_farmaco_originale");
						}

						if(riga.find(".classPosologia input").val()!=''){
							farmaco.cod_posologia = riga.attr("cod_posologia");
						}

						/*inserito il controllo sul campo nascosto perche' in visualizzazione le esenzioni non piu' valide vengono 
						visualizzate con la descrizione ma non con il codice nel campo nascosto*/
						if(riga.find(".classEsenzione input").val()!='' && riga.attr("cod_esenzione")!=''){
							farmaco.cod_esenzione = riga.attr("cod_esenzione");
//								if(home.baseUser.SALVATAGGIO_RAPIDO_RR == 'N')
//									farmaco.descr_esenzione = riga.find(".classEsenzione input").val();
						}

						if(riga.find(".classSost input").attr("checked")=="checked"){
							farmaco.sost_si_no = "N";
							farmaco.motivo_sost = riga.find(".classSost select").val();
						}else{
							farmaco.sost_si_no = "S";
							farmaco.motivo_sost = "";
						}

						if(home.ASSISTITO.IDEN_PROBLEMA != ''){
							farmaco.problema = home.ASSISTITO.IDEN_PROBLEMA;
						} else {
							farmaco.problema = riga.attr("iden_problema");
						}

						//metto solo i priincipi attivi di ciò che sto prescrivendo
						objControl.paDaControllare.push(NS_MMG_UTILITY.getAttr(riga,"cod_pa"));

						farmaco.iden_ricetta = NS_MMG_UTILITY.getAttr(riga,"iden_ricetta", "");

						objSalvataggio.farmaco.push(farmaco);
					}else{
						prodottiConBlocco.push("\n - "+riga.find(".classFarmaco").text() + " - Prescritta in data " + riga.find(".classData").text()+"\n");
					}
					/*
					}else{
						prodottiNonSelezionati.push(riga.attr("cod_farmaco"));
					}
					*/
				}
				
			});

			if(prodottiConBlocco.length > 0){
				var msgAlert = "I seguenti farmaci non sono stati prescritti in quanto sono terapie bloccate.\n\n";
				msgAlert += prodottiConBlocco.toString();
				msgAlert += "\n\nFarle sbloccare dal medico curante";
				home.NOTIFICA.warning({
					message: msgAlert,
					title: "Attenzione",
					timeout:"15"
				});
			}
			
			if(objSalvataggio.farmaco.length>0){
				
				//alert('JSON STRINGIFIZZATO: \n'+JSON.stringify(objSalvataggio));
				return RICETTA_FARMACI.getCodiciFarmaci();
			}
		},

		ciclaCampo:function(campo) {
			var concatenati = "";
			for(var x=0; x < objSalvataggio.farmaco.length; x++) {
				if (x>0) {
					concatenati += ",";
				}

				var v_var = objSalvataggio.farmaco[x][campo] == '' ?'0' : objSalvataggio.farmaco[x][campo];
				concatenati += v_var;	
			}
			return concatenati;
		},

		getCodiciFarmaci:function() {
			return RICETTA_FARMACI.ciclaCampo("cod_farmaco");
		},

		getProblemi:function(){
			return RICETTA_FARMACI.ciclaCampo("iden_problema");
		},

		icone:{

			openInfo:function(idx){

				var cod_farmaco = $("tr[idx="+idx+"]").attr("cod_farmaco");
//				var titolo = $("tr[idx="+idx+"]").find(".classFarmaco").text();
				if(cod_farmaco != ''){

					var url = home.baseGlobal.URL_MONOGRAFIE +cod_farmaco;
					var frame = $("<iframe/>", {"src":url, "width":"100%", "height":"350px" });
					var dialog = home.$.dialog(frame,{
						id: "dialog",
						title: "Monografia",
						width: 800,
						showBtnClose: false,
						modal:true,
						movable: true,
						buttons: [{label: traduzione.butChiudi, keycode :"13", action: function () { home.$.dialog.hide(); }}]}
					);
				}
			}

		},
		
		initObjControl:function(){
			
			objControl.prodottiDaControllare = new Array();
			objControl.paDaControllare = new Array();
			objControl.descrProdDaControllare = new Array();
			objControl.farmaco;
			
		},

		initObjSalvataggio:function(){

			//valorizzo le variabili in modo che non vada in errore la pagina
			objSalvataggio.iden_anag		= home.ASSISTITO.IDEN_ANAG;
			objSalvataggio.iden_utente		= home.baseUser.IDEN_PER;
			objSalvataggio.iden_med_base	= home.ASSISTITO.IDEN_MED_BASE;
			objSalvataggio.iden_accesso		= home.ASSISTITO.IDEN_ACCESSO;
			objSalvataggio.iden_med_prescr	= home.CARTELLA.getMedPrescr();

			objSalvataggio.urgenza = '';
			objSalvataggio.note = '';
			objSalvataggio.dematerializzata = RICETTA.getValueDematerializzata(classRiga);			
			objSalvataggio.farmaco = new Array();
		},

		insertPrescrLibera:function(){

			if(!home.MMG_CHECK.isDead()){return;}

			var idx = TABLE.insertRow('prescrLibera');

			//TODO: gestire l'inserimento del farmaco libero

			$("tr[idx="+idx+"]").find(".classFarmaco").find("input").focus();
			$("tr[idx="+idx+"]").attr("cod_farmaco",""); /*TODO*/
			$("tr[idx="+idx+"]").attr("concedibile",'S');
		},

		onClose:function(){
			//TODO: implementare funzione sull'onclose
		},

		setCronica:function(riga){
			riga.attr("cronica","S");
		},

		setIDX:function(idx, booleano){

			idx_sel = idx;

			if(booleano){
				RICETTA_FARMACI.setInfoRiga(idx_sel);
			}

			RICETTA.selectRiga(idx, classRiga);
		},

		setInfoRiga:function(indice){

			var row = $("[idx="+idx_sel+"]");

			riga._this				= row;
			riga.nome_farmaco 		= row.attr("idx")=='0' ? row.find(".classFarmaco").find("input").val() : row.find(".classFarmaco").not(".hidden").html();
			riga.iden 				= row.attr("iden");
			riga.cod_farmaco 		= row.attr("cod_farmaco");
			riga.quantita 			= row.find(".classQuantita").find("input").val();
			riga.esenzione			= row.find(".classEsenzione").find("input").val();
			riga.cod_esenzione 		= row.attr("cod_esenzione");
			riga.cod_concedibilita 	= row.attr("concedibile");
			riga.cronica 			= row.attr("cronica");
			riga.periodica 			= row.attr("periodica");
			riga.temporanea 		= row.attr("temporanea");
			riga.posologia 			= row.find(".classPosologia").find("input").val();
			riga.cod_posologia 		= row.attr("cod_posologia");
			riga.problema	 		= row.attr("iden_problema");
			riga.deleted	 		= row.attr("deleted");
			riga.da_stampare		= row.attr("daStampare");
			riga.PA					= row.attr("pa");
			riga.codPA				= NS_MMG_UTILITY.getAttr(row,"cod_pa");
			riga.sost_si_no			= row.attr("sost");
			riga.classe_icona		= row.attr("coloreIcona");
			riga.blocco				= row.attr("blocco");
			riga.note_cuf			= row.attr("nota_cuf");
			riga.piano_terapeutico	= row.attr("pt");
			riga.data_ini			= row.attr("data_ini");
			riga.data_fine			= row.attr("data_fine");
			riga.classe				= row.attr("classe_farmaco");

			if(row.find(".classSost input").attr("checked")=="checked"){
				riga.motivo_sost = row.find(".classSost select").val();
			}
		},

		setRigaWithSelected:function(cod, value){

			var row = $("tr[tipoRiga=ins]");
			row.attr("cod_farmaco",cod);
			row.find(".classFarmaco").val(value);
		},

		showMotivoSost:function($obj, bool){

			var rigaThis = $obj;
			if(bool){
				$obj.find("select").show();
				rigaThis.attr("sost","N");
			}else{
				$obj.find("select").hide();
				rigaThis.attr("sost","S");
			} 
		},

		reload: function(numRow) {
			RICETTA.reload(numRow);
		},

		saveStampa: function(stampa_ricetta){
			RICETTA.saveStampa(stampa_ricetta);
		},

		setFarmaco: function(idxRow, farmaco, pt) {
			
			var row = $("tr[idx="+idxRow+"]");
			row.find(".classFarmaco").find("input").val(farmaco.FARMACO);	
			row.attr("cod_farmaco",farmaco.CODICE);
			row.attr("concedibile",farmaco.CONCEDIBILITA);
			row.attr("cod_pa",farmaco.CODICE_PRINCIPIO_ATTIVO);
			row.attr("classe_farmaco",farmaco.CLASSE);
			row.find(".classQuantita input").focus();
			

			if (typeof pt != 'undefined') {
				row.attr("pt","S");
				row.attr("data_ini",pt.data_ini);
				row.attr("data_fine",pt.data_fine);
			}
			
			/* Farmaci senza codice equivalenza vanno messi non sostituibili in dematerializzata (e forse anche sulla ricetta normale) */
			console.log(farmaco);
			if (RICETTA.isDematerializzata() == "S" && farmaco.CLASSE == "A" && (!LIB.isValid(farmaco.CODICE_EQUIVALENZA) || farmaco.CODICE_EQUIVALENZA == "")) {
				row.find(".classSost").find("input[type='checkbox']").trigger("click");
				row.find(".classSost select").val("4"); /*Non art.15, comma 11-bis*/
				RICETTA_FARMACI.showMotivoSost(row, true);
			}

			RICETTA_FARMACI.controllaEsenzioni( row );
			TABLE.insertRow();
			
			//metto la riga checked poichè in alcuni casi non risultava selezionata
			row.find(".tdAction input").prop("checked",true);
		},
		
		getPosologiaFromIdx: function(idxRow){
			var row = $("tr[idx="+idxRow+"]");
//			alert(row.find(".classPosologia input").val())
			return row.find(".classPosologia input").val();
		},
		
		setPosologia: function(idxRow, posologia) {
			var row = $("tr[idx="+idxRow+"]");
			var posologiaBefore = row.attr("cod_posologia");
			row.find(".classPosologia").find("input").val(posologia.descrizione);	
			row.attr("cod_posologia", posologia.codice);

			/* update della posologia solo per le righe gia' salvate (con iden). Magari per correggere la rimanenza. */
			
			if (row.find(".tdAction input").attr("checked") != 'checked' && row.attr("iden")>0 ) { 
				RICETTA.updRiga({
					"iden_per"		: home.baseUser.IDEN_PER,
					"tabella"		: "MMG_FARMACI",
					"nome_campo"	: "COD_POSOLOGIA",
					"iden_tabella"	: row.attr("iden"),
					"valore"		: posologia.codice
				});
			}
		},
		
		getEsenzioneFromIdx: function(idxRow){
			var row = $("tr[idx="+idxRow+"]");
//			alert(row.find(".classEsenzione input").val())
			return row.find(".classEsenzione input").val();
		},

		setEsenzione: function(idxRow, esenzione) {
			var row = $("tr[idx="+idxRow+"]");
			var esenzioneBefore = row.attr("cod_esenzione");
			var esenzioneSubstr = esenzione.codice.substring(0,3);
			
			//row.find(".classEsenzione input").val(esenzione.descrizione).attr("elaborato",true);
			row.find(".classEsenzione input").val(esenzione.codice).attr("elaborato",true).attr("title",esenzione.descrizione);
			row.attr("cod_esenzione", esenzione.codice);
			
			if(esenzioneSubstr == 'TDL'){
				home.NOTIFICA.warning({
					message: traduzione.lblObbligoPosologia,
					title: traduzione.lblTitleObbligoPosologia,
					timeout: 20
				});	
			}

		},

		getObjSalvataggio: function() {
			/* devo risettare l'iden accesso poiche' la chiamata al db non e' sincrona e la risposta non arriva in tempo nella funzione checkAccesso. */
			objSalvataggio.iden_accesso = home.ASSISTITO.IDEN_ACCESSO;
			return objSalvataggio;
		},
		
		getObjControl: function(){
			
			return objControl;
		},

		checkPreSalvataggio: function( callbackOk ) {

			RICETTA.checkPreSalvataggioCommon( function() {

				if ( home.baseUser.TIPO_PERSONALE=='A' && LIB.getParamUserGlobal('AVVISO_PRESCR_NON_CRONICHE','S') == 'S') {
					checkCroniche();
				} else
					callbackOk(); 
			});

			function checkCroniche() {

				var arFarmaci = RICETTA_FARMACI.getObjSalvataggio().farmaco;

				var presenzaNonCroniche = false;

				for (var i = 0; i < arFarmaci.length; i++) {
					if (arFarmaci[i].cronicita != 'S')	{
						presenzaNonCroniche = true;
						break; 
					}
				}

				if (presenzaNonCroniche) {

					home.NS_MMG.confirm("Attenzione: la prescrizione contiene anche terapie non croniche.<br/>Continuare comunque con la prescrizione?", function() {
						callbackOk();
					});

				} else
					callbackOk();
			}
		},
 
		updEsenzioniObjSalvataggio: function( codEse, descrEse ) {

			var arFarmaci = objSalvataggio.farmaco;
			for ( var i=0; i < arFarmaci.length ; i++ ) {
				if (arFarmaci[i].classe == 'A') {
					arFarmaci[i].cod_esenzione = codEse;
					var esenz = new Object();
					esenz.descrizione = descrEse;
					esenz.codice = codEse;
					
					RICETTA_FARMACI.setEsenzione(arFarmaci[i].index, esenz);
//					arFarmaci[i].descr_esenzione = descrEse; // o deve rimanere arFarmaci[i].esenzione?
				}
			}
		},
		
		apriPosTerCronica: function(){

			if(!home.MMG_CHECK.isDead()){return;}

			var arIden = [];
			$("tr[iden]").not("[tiporiga='ins']").find(".tdAction input:checked").each(function() {
				arIden.push($(this).closest("tr").attr("iden"));
			});

			if(arIden.length<1)
			{
				home.NOTIFICA.warning({
					message: traduzione.lblSelAlmeno,
					title: "Attenzione",
					timeout:"15"
				});						
			}
			else{
				RICETTA_FARMACI.getProdotti();
				home.NS_MMG.apri("POS_TER_CRONICA");
			}
		},
		
		apriTerapieGiornaliere: function(){
			
			if(!home.MMG_CHECK.isDead()){return;}

			var arIden = [];
			$("tr[iden]").not("[tiporiga='ins']").find(".tdAction input:checked").each(function() {
				arIden.push($(this).closest("tr").attr("iden"));
			});

			if(arIden.length<1)
			{
				home.NOTIFICA.warning({
					message: traduzione.lblSelAlmeno,
					title: "Attenzione",
					timeout:"15"
				});						
			}
			else{
				RICETTA_FARMACI.getProdotti();
				home.NS_MMG.apri("INFO_TER_GIORN");
			}
		}
};

TABLE.replaceRows=function(arrayNew){

	$(classRiga).not("[tipoRiga=ins]").remove();

	$(arrayNew).each(function(a,b){
		RICETTA_FARMACI.table.append(b['riga']);
	});

	//TODO:devo riassegnare l'evento alla riga. Da capire perche' non funziona
	$("tr."+classRiga).on("click",function(){
		RICETTA_FARMACI.setIDX($(this).attr("idx"),true);
	});
};

TABLE.collectRows=function(){

	var objRighe=new Array();

	$collectionRows = RICETTA_FARMACI.table.find("tr."+classRiga).not("[tipoRiga=ins]"); 
	$collectionRows.each(function(a,b){

		var riga = home.NS_MMG_UTILITY.outerHTML(b);
		objRighe.push(riga);
	});

	//alert('fine di collectRows');
	return objRighe;
};

TABLE.setArrayByColumn=function(columnSelected){

	var $cRighe = $(TABLE.collectRows());
	var obj='';
	var arr = new Array();

	switch(columnSelected){

	case 'DATA':

		$cRighe.each(function(a,b){
			var dataToOrder=$(b).attr("data");
			//alert(dataToOrder);
			obj={"dataToOrder":dataToOrder, "riga":$(b)};
			arr.push(obj);
		});

		break;

	case 'FARMACO':

		$cRighe.each(function(a,b){
			var dataToOrder=$(b).find(".classFarmaco").html();
			///alert(dataToOrder);
			obj={"dataToOrder":dataToOrder, "riga":$(b)};
			arr.push(obj);
		});
		break;

	case '':
	default:

		$cRighe.each(function(a,b){
			var dataToOrder=parseInt($(b).attr("idx"));
			///alert(dataToOrder);
			obj={"dataToOrder":dataToOrder, "riga":$(b)};
			arr.push(obj);
		});
	break;
	}

	return arr;
};

//@override affinche' vengano assegnati gli eventi anche alla nuova riga
RICETTA.setEventNewRow=function(riga){

	//doppio clic sull'input di inserimento del farmaco
	riga.find('.classFarmaco').find("input").on("dblclick",function(){
		home.NS_MMG.apri("MMG_SCELTA_FARMACI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
	});

	//doppio clic sull'inserimento dell'esenzione
	riga.find('.classEsenzione').find("input").on("dblclick",function(){
		if(RICETTA_FARMACI.checkEsenzione(riga)){
			home.NS_MMG.apri("MMG_SCELTA_ESENZIONI&PROVENIENZA=FARMACI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
			$(this).val("");
		}
	});

	//doppio clic sull'inserimento della posologia
	riga.find('.classPosologia').find("input").on("dblclick",function(){
		home.NS_MMG.apri("MMG_SCELTA_POSOLOGIA&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
		$(this).val("");
	});

	//onblur sull'inserimento del farmaco
	riga.find('.classFarmaco').find("input").on("blur",function(){
		$(this).val($(this).val().toUpperCase());
		if($(this).val() != ''){
			home.NS_MMG.apri("MMG_SCELTA_FARMACI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
			$(this).val("");
		}
	});

	//tasto invio sull'inserimento del farmaco
	riga.find('.classFarmaco').find("input").on(RICETTA.eventKeyUpBrowser,function(e){
		
		if(e.which == '13'){

			$(this).val($(this).val().toUpperCase());
			if($(this).val() != ''){
				home.NS_MMG.apri("MMG_SCELTA_FARMACI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
				$(this).val("");
			}
		}
	});

	//keyup sull'inserimento dell'esenzione
	riga.find('.classEsenzione').find("input").on(RICETTA.eventKeyUpBrowser,function(e){
		if(e.which == '13'){
			home.NS_MMG.apri("MMG_SCELTA_ESENZIONI&PROVENIENZA=FARMACI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
			$(this).val("");
		}
	});

	//doppio clic sull'inserimento della posologia
	riga.find('.classPosologia').find("input").on("dblclick",function(){
		home.NS_MMG.apri("MMG_SCELTA_POSOLOGIA&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
	});

	//onblur sull'inserimento della posologia
	riga.find('.classPosologia').find("input").on("blur",function(){ 
		if($(this).val()!= ''){
			home.NS_MMG.apri("MMG_SCELTA_POSOLOGIA&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
			$(this).val("");
		}
		else
			RICETTA_FARMACI.setPosologia( riga.attr("idx"), { descrizione: "", codice: "" } );
	});

	//onblur sull'inserimento della esenzione
	riga.find('.classEsenzione').find("input").on("blur",function(){ 
		if($(this).val()!= ''){
			home.NS_MMG.apri("MMG_SCELTA_ESENZIONI&PROVENIENZA=FARMACI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
			$(this).val("");
		}
		else
			RICETTA_FARMACI.setEsenzione( riga.attr("idx"), { descrizione: "", codice: "" } );
	});

	//tasto invio sull'inserimento della posologia
	riga.find('.classPosologia').find("input").on(RICETTA.eventKeyUpBrowser,function(e){

		if(e.which == '13'){
			if($(this).val()!= ''){
				home.NS_MMG.apri("MMG_SCELTA_POSOLOGIA&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
				$(this).val("");
			}
		}
	});

	//show del motivo sostituzione se il check risulta selezioato
	riga.find(".classSost").find("input[type='checkbox']").on("click", function(){

		if($(this).is(":checked")){

			//riga.find(".tdAction input").attr("checked",true);
			RICETTA_FARMACI.showMotivoSost($(this).parent(),true);
		}else{
			riga.find(".tdAction input").attr("checked",false);
			RICETTA_FARMACI.showMotivoSost($(this).parent(),false);
		};
	});

	//selezione della riga
	$("tr."+classRiga).on("click",function(){
		RICETTA_FARMACI.setIDX($(this).attr("idx"),true);
	});

	riga.find(".classPA").find("input[type='checkbox']").attr("checked",true);
	riga.attr("pa",'S');
};

//oggetto valorizzato con i valori della riga selezionata
var riga = {
		cod_farmaco			: '',
		quantita			: '',
		nome_farmaco		: '',
		classe				: '',
		esenzione			: '',
		cod_esenzione		: '',
		concedibilita		: '',
		cronica				: 'N',
		periodica			: 'N',
		temporanea			: 'N',
		posologia			: '',
		cod_posologia		: '',
		problema			: '',
		PA					: '',
		codPA 				: '',
		sost_si_no			: '',
		motivo_sost 		: '',
		deleted				: '',
		classe_icona		: '',
		da_stampare			: '',
		blocco				: '',
		note_cuf			: '',
		forzatura			: '',
		piano_terapeutico	: ''
};

var objSalvataggio = {

		tipo_ricetta	: 'FARMACI',
		iden_anag		: null,
		iden_utente		: null,
		iden_med_base	: null,
		iden_med_prescr : null,
		urgenza			: '',
		note			: '',
		diagnosi		: '',
		farmaco			: new Array(),
		iden_accesso	: '',
		ricovero		: '',
		suggerita		: '',
		altro			: ''
};

var objControl = {
		
		prodottiDaControllare 	: new Array(),
		paDaControllare 	  	: new Array(),
		descrProdDaControllare	: new Array(),
		farmaco					: new Array()
};

//MENU CONTESTUALE ICONA OPTION (ingranaggio)
var menuOption={
		"menu":{
			"id": "MENU_RICETTA_FARMACI",
			"structure": {
				"list": [
						{
							"concealing": "true",
							"link":  function(riga) { home.RICETTA_UTILS.showRowInfo(riga);},
							"enable": "S",
							"icon_class": "icon-cog-1",
							"where": function(rec){ 
								return MMG_CHECK.isAdministrator();
							},
							"output": "traduzione.lblInfoAdmin",
							"separator": "false"
						},
						{
							"concealing": "true",
							"link":  function(riga) { RICETTA.context_menu.forzatura($("tr[idx="+idx_sel+"]"),'R'); },//RICETTA_FARMACI.context_menu.forzaRicettaRossa,
							"enable": "S",
							"icon_class": "referta",
							"where": function(rec){ 
								if(home.CARTELLA.REGIME == 'LP'){ 
									return false;
								}else{
									return ($("tr[idx="+idx_sel+"]").attr("classe_farmaco")=='C' || 
											   $("tr[idx="+idx_sel+"]").attr("forzatura") == 'B' ||
												   (typeof $("tr[idx="+idx_sel+"]").attr("classe_farmaco") == 'undefined' ||
													   $("tr[idx="+idx_sel+"]").attr("classe_farmaco") == '')	);
								}
							},
							"output": "traduzione.lblForzaRicettaRossa",
							"separator": "false"
						},
						{
							"concealing": "true",
							"link":  function(riga) { RICETTA.context_menu.forzatura($("tr[idx="+idx_sel+"]"),'B'); },//RICETTA_FARMACI.context_menu.forzaRicettaBianca,
							"enable": "S",
							"icon_class": "prenota",
							"where": function(rec){ 
								if(home.CARTELLA.REGIME == 'LP'){ 
									return false;
								}else{
									return true;

								}
							},
							"output": "traduzione.lblForzaRicettaBianca",
							"separator": "false"
						},
						{
							"concealing": "true",
							"link":  function(riga) { RICETTA.context_menu.forzatura($("tr[idx="+idx_sel+"]"),''); },//RICETTA_FARMACI.context_menu.forzaRicettaBianca,
							"enable": "S",
							"icon_class": "elimina",
							"where": function(rec){ return $("tr[idx="+idx_sel+"]").attr("forzatura")!= ''; },
							"output": "traduzione.lblRimuoviForzatura",
							"separator": "false"
						},
						{
							"concealing": "true",
							"link":  RICETTA_FARMACI.context_menu.cancellaPrescrizione,
							"enable": "S",
							"icon_class": "bidone",
							"where": function(rec){
								return RICETTA.whereCanDeleteRow($("tr[idx="+idx_sel+"]"));
							},
							"output": "traduzione.lblCancella",
							"separator": "false"
						},
						{
							"concealing": "true",
							"link":  RICETTA.associaProblema,
							"enable": "S",
							"icon_class": "esegui",
							"where": function(rec){
								return  true;
							},
							"output": "traduzione.lblAssociaProblema",
							"separator": "false"
						},
						{
							"concealing": "true",
							"link":  function() {
								RICETTA_FARMACI.context_menu.oscura("N");
							},
							"enable": "S",
							"icon_class": "utente",
							"where": function(rec){
								return $("tr[idx="+idx_sel+"]").attr("iden")!= '' && $("tr[idx="+idx_sel+"]").attr("oscurato") == 'S' && $("tr[idx="+idx_sel+"]").attr("sito") == 'MMG' ;
							},
							"output": "traduzione.lblDisoscura",
							"separator": "false"
						},
						{
							"concealing": "true",
							"link": function() {
								RICETTA_FARMACI.context_menu.oscura("S");
							},
							"enable": "S",
							"icon_class": "appropriatezza",
							"where": function(rec){
								return $("tr[idx="+idx_sel+"]").attr("iden")!= '' && $("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && $("tr[idx="+idx_sel+"]").attr("sito") == 'MMG';
							},
							"output": "traduzione.lblOscura",
							"separator": "false"
						},
						{
							"concealing": "true",
							"link":  "",
							"enable": "S",
							"icon_class": "visualizza-n-archivio",
							"where": function(rec){
								return (home.baseUser.TIPO_UTENTE == 'M' && $("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0) && $("tr[idx="+idx_sel+"]").attr("sito") == 'MMG');
							},
				        	 "list": [
									{
										"concealing": "true",
									   	 "link":  function() { RICETTA_FARMACI.context_menu.setMI($("tr[idx="+idx_sel+"]").attr("iden"), ""); },
										 "enable": "S",
										 "icon_class": "visualizza-n-archivio",
										 "where": function(rec){
											 return ($("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0 && ($("tr[idx="+idx_sel+"]").attr("mi") != '') && $("tr[idx="+idx_sel+"]").attr("mi") == 'N'  && $("tr[idx="+idx_sel+"]").attr("sito") == 'MMG');
										 },
										 "output": "traduzione.MedicinaIniziativa",
										 "separator": "false"
									},
									{
							        	 "concealing": "true",
							        	 "link":  function() { RICETTA_FARMACI.context_menu.removeMI($("tr[idx="+idx_sel+"]").attr("iden")); },
							        	 "enable": "S",
							        	 "icon_class": "visualizza-n-archivio",
							        	 "where": function(rec){
							        		 return ($("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0) && ($("tr[idx="+idx_sel+"]").attr("mi") != '' && $("tr[idx="+idx_sel+"]").attr("mi") != 'N') && $("tr[idx="+idx_sel+"]").attr("sito") == 'MMG');
							        	 },
							        	 "output": "traduzione.removeMI",
							        	 "separator": "false"
							         }
									/*,
				      				{
				      					"concealing": "true",
					   		        	 "link":  function() { RICETTA_FARMACI.context_menu.setMI($("tr[idx="+idx_sel+"]").attr("iden"), "BPCO"); },
							        	 "enable": "S",
							        	 "icon_class": "visualizza-n-archivio",
							        	 "where": function(rec){
							        		 return ($("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0 && ($("tr[idx="+idx_sel+"]").attr("mi") != '' && $("tr[idx="+idx_sel+"]").attr("mi") != 'S'));
							        	 },
							        	 "output": "traduzione.BPCO",
							        	 "separator": "false"
						        	},
						        	{
						        		"concealing": "true",
							        	 "link":  function() { RICETTA_FARMACI.context_menu.setMI($("tr[idx="+idx_sel+"]").attr("iden"), "SCOMPENSO_CARDIACO" ); },
							        	 "enable": "S",
							        	 "icon_class": "visualizza-n-archivio",
							        	 "where": function(rec){
							        		 return ($("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0 && ($("tr[idx="+idx_sel+"]").attr("mi") != '' && $("tr[idx="+idx_sel+"]").attr("mi") != 'S'));
							        	 },
							        	 "output": "traduzione.scompensoCardiaco",
							        	 "separator": "false"
							        },
							        {
							        	"concealing": "true",
							        	 "link":  function() { RICETTA_FARMACI.context_menu.setMI($("tr[idx="+idx_sel+"]").attr("iden"), "DIABETE"); },
							        	 "enable": "S",
							        	 "icon_class": "visualizza-n-archivio",
							        	 "where": function(rec){
							        		 return ($("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0 && ($("tr[idx="+idx_sel+"]").attr("mi") != '' && $("tr[idx="+idx_sel+"]").attr("mi") != 'S'));
							        	 },
							        	 "output": "traduzione.diabete",
							        	 "separator": "false"
							        }*/
							        ],
				        	 "output": "traduzione.MedicinaIniziativa",
				        	 "separator": "false"
				         }/*,
				         {
				        	 "concealing": "true",
				        	 "link":  function() { RICETTA_FARMACI.context_menu.removeMI($("tr[idx="+idx_sel+"]").attr("iden")); },
				        	 "enable": "S",
				        	 "icon_class": "visualizza-n-archivio",
				        	 "where": function(rec){
				        		 return ($("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0) && ($("tr[idx="+idx_sel+"]").attr("mi") != '' && $("tr[idx="+idx_sel+"]").attr("mi") != 'N'));
				        	 },
				        	 "output": "traduzione.removeMI",
				        	 "separator": "false"
				         }*/
				         ]
			},
			"title": "traduzione.lblMenu",
			"status": true
		}};

//MENU CONTESTUALE ICONA CRONO (clessidra)
var menuCrono ={
		"menu":{
			"id": "MENU_RICETTA_FARMACI_CRONO",
			"structure": {
				"list": [{
					"concealing": "true",
					"link": function(rec){
						RICETTA_FARMACI.context_menu.setCronica(classRiga, $("tr[idx="+idx_sel+"]")) ;
					},
					"enable": "S",
					"icon_class": "gestione",
					"where": function(rec){
						return true;
					},
					"output": "traduzione.lblCronica",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  function(){
						RICETTA_FARMACI.context_menu.setPianoTerapeutico($("tr[idx="+idx_sel+"]"));
					},
					"enable": "S",
					"icon_class": "gestionept",
					"where": function(rec){
						return  true;
					},
					"output": "traduzione.lblPT",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  function(){
						RICETTA_FARMACI.context_menu.setTemporanea($("tr[idx="+idx_sel+"]"));
					},
					"enable": "S",
					"icon_class": "calendario",
					"where": function(rec){
						return  true;
					},
					"output": "traduzione.lblTemporanea",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  function(){
						RICETTA_FARMACI.context_menu.setPeriodica($("tr[idx="+idx_sel+"]"));
					},
					"enable": "S",
					"icon_class": "data",
					"where": function(rec){
						return  true;
					},
					"output": "traduzione.lblPeriodica",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  function(){
						RICETTA_FARMACI.context_menu.showStorico($("tr[idx="+idx_sel+"]"));
					},
					"enable": "S",
					"icon_class": "visualizza-n-archivio",
					"where": function(rec){
						return  true;
					},
					"output": "traduzione.lblStorico",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  function(){
						RICETTA_FARMACI.context_menu.azzeraContatore($("tr[idx="+idx_sel+"]"));
					},
					"enable": "S",
					"icon_class": "taglia",
					"where": function(rec){
						return  true;
					},
					"output": "traduzione.lblAzzeraContatore",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link": function(rec){
						RICETTA_FARMACI.context_menu.removeCronica(classRiga, $("tr[idx="+idx_sel+"]"));
					},
					"enable": "S",
					"icon_class": "elimina",
					"where": function(rec){
						return true;
					},
					"output": "traduzione.lblRimuoviCronica",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  function(){
						RICETTA_FARMACI.context_menu.rimuoviBlocco($("tr[idx="+idx_sel+"]"));
					},
					"enable": "S",
					"icon_class": "sblocca-referto",
					"where": function(rec){
						return  true;
					},
					"output": "traduzione.lblRimuoviBlocco",
					"separator": "false"
				}]
			},
			"title": "traduzione.lblMenu",
			"status": true
		}};

//MENU CONTESTUALE ICONA INFO (informazioni)
var menuInfo ={
		"menu":{
			"id": "MENU_RICETTA_FARMACI_INFO",
			"structure": {
				"list": [{
					"concealing": "true",
					"link": function(rec){
						RICETTA_FARMACI.context_menu.showMonografia($("tr[idx="+idx_sel+"]"));
					},
					"enable": "S",
					"icon_class": "anteprima",
					"where": function(rec){
						return true;
					},
					"output": "traduzione.lblMonografia",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link": function(rec){
						RICETTA_FARMACI.context_menu.showInfo($("tr[idx="+idx_sel+"]"));
					},
					"enable": "S",
					"icon_class": "informazioni",
					"where": function(rec){
						return true;
					},
					"output": "traduzione.lblInfo",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link": function(rec){
						RICETTA_FARMACI.context_menu.showInfoPrescrizione($("tr[idx="+idx_sel+"]"));
					},
					"enable": "S",
					"icon_class": "visualizza-esame-paziente",
					"where": function(rec){
						return true;
					},
					"output": "traduzione.lblInfoPrescrizione",
					"separator": "false"
				}]
			},
			"title": "traduzione.lblMenu",
			"status": true
		}};

//menu contestuale per le funzioni non legate al singolo secord (es. cancella selezionate, associa problema selezionate)
var menuCommons = {
		"menu" : {
			"id" : "MENU_COMMONS",
			"structure" : {
				"list" : [ {
					"concealing": "true",
					"link":  RICETTA_FARMACI.context_menu.cancellaPrescrizioni,
					"enable": "S",
					"icon_class": "bidone",
					"where": function(rec){
						//return $("tr[iden]").not("[tiporiga='ins']").find(".tdAction input:checked").length > 0;
						return RICETTA.whereCanDeleteRows();
					},
					"output": "traduzione.lblCancellaMulti",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  function(){ RICETTA.context_menu.cambiaDataMulti(RICETTA_FARMACI.vType);},
					"enable": "S",
					"icon_class": "gestione",
					"where": function(rec){
						return $("tr[iden]").not("[tiporiga='ins']").find(".tdAction input:checked").length > 0;
					},
					"output": "traduzione.lblCambiaDataMulti",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  RICETTA.associaProblemaMulti,
					"enable": "S",
					"icon_class": "esegui",
					"where": function(rec){
						return  true;
					},
					"output": "traduzione.lblAssociaProblema",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  function() { RICETTA.context_menu.forzaturaMulti('R'); },
		        	"enable": "S",
		        	"icon_class": "referta",
		        	"where": function(rec){
						if(home.CARTELLA.REGIME == 'LP'){ 
							return false;
						} else {
							return true;
						}
					},
		        	"output": "traduzione.lblForzaRicettaRossa",
					"separator": "false"
	 			},
				{
					"concealing": "true",
					"link":  function() { RICETTA.context_menu.forzaturaMulti('B'); },
					"enable": "S",
					"icon_class": "prenota",
					"where": function(rec){ 
						return true;
					},
					"output": "traduzione.lblForzaRicettaBianca",
					"separator": "false"
	 			},
	 			{
	 				"concealing": "true",
	 				"link":  function() { RICETTA.context_menu.forzaturaMulti(''); },
	 				"enable": "S",
	 				"icon_class": "elimina",
	 				"where": function(rec){ 
	 					return true;
					},
	 				"output": "traduzione.lblRimuoviForzatura",
	 				"separator": "false"
	 			},
	 			{
	 				"concealing": "true",
					"link":  RICETTA_FARMACI.apriPosTerCronica,
					"enable": "S",
					"icon_class": "calendario",
					"where": function(rec){
						return $("tr[iden]").not("[tiporiga='ins']").find(".tdAction input:checked").length > 0;
					},
					"output": "traduzione.lblPosTerCronica",
					"separator": "false"
	 			},
				{
					"concealing": "true",
					"link":  RICETTA_FARMACI.apriTerapieGiornaliere,
					"enable": "S",
					"icon_class": "calendario",
					"where": function(rec){
						return $("tr[iden]").not("[tiporiga='ins']").find(".tdAction input:checked").length > 0;
					},
					"output": "traduzione.lblTerapieGiornaliere",
					"separator": "false"
				},
		         {
		        	 "concealing": "true",
		        	 "link":  "",
		        	 "enable": "S",
		        	 "icon_class": "visualizza-n-archivio", 
		        	 "where": function(rec){
		        		 return (home.baseUser.TIPO_UTENTE == 'M' && home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0);
		        	 },
		        	 "list": [
		      				{
		      					"concealing": "true",
			   		        	 "link":  function() { RICETTA_FARMACI.context_menu.setMIMulti(""); },
					        	 "enable": "S",
					        	 "icon_class": "visualizza-n-archivio",
					        	 "where": function(rec){
					        		 return (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0);
					        	 },
					        	 "output": "traduzione.BPCO",
					        	 "separator": "false"
				        	},{
					        	 "concealing": "true",
					        	 "link":  function() { RICETTA_FARMACI.context_menu.removeMIMulti(); },
					        	 "enable": "S",
					        	 "icon_class": "visualizza-n-archivio",
					        	 "where": function(rec){
					        		 return (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0);
					        	 },
					        	 "output": "traduzione.removeMI",
					        	 "separator": "false"
					        }/*,
		      				{
		      					"concealing": "true",
			   		        	 "link":  function() { RICETTA_FARMACI.context_menu.setMIMulti("BPCO"); },
					        	 "enable": "S",
					        	 "icon_class": "visualizza-n-archivio",
					        	 "where": function(rec){
					        		 return (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0);
					        	 },
					        	 "output": "traduzione.BPCO",
					        	 "separator": "false"
				        	},
				        	{
				        		"concealing": "true",
					        	 "link":  function() { RICETTA_FARMACI.context_menu.setMIMulti("SCOMPENSO_CARDIACO"); },
					        	 "enable": "S",
					        	 "icon_class": "visualizza-n-archivio",
					        	 "where": function(rec){
					        		 return (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0);
					        	 },
					        	 "output": "traduzione.scompensoCardiaco",
					        	 "separator": "false"
					        },
					        {
					        	"concealing": "true",
					        	 "link":  function() { RICETTA_FARMACI.context_menu.setMIMulti("DIABETE"); },
					        	 "enable": "S",
					        	 "icon_class": "visualizza-n-archivio",
					        	 "where": function(rec){
					        		 return (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0);
					        	 },
					        	 "output": "traduzione.diabete",
					        	 "separator": "false"
					        }*/],
		        	 "output": "traduzione.MedicinaIniziativa",
		        	 "separator": "false"
		         } 
				]
			},
			"title" : "traduzione.lblMenu",
			"status" : true
		}
};
