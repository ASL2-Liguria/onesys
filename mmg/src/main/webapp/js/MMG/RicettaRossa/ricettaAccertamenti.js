idx_sel = '';
var $option;
var $crono;
var _riga;
var newRiga;
var classRiga = "trRigaAccertamenti";

var msg_1 = 'L\'operazione richiesta non risulta possibile su un\'accertamento cancellato';
var msg_2 = 'L\'operazione richiesta non risulta possibile in quanto l\'accertamento non risulta ancora cancellato';


$(function(){

	//$(".headerTabs").hide();
	RICETTA_ACCERTAMENTI.init();
	RICETTA_ACCERTAMENTI.setEvents();
	RICETTA.getProdotti = RICETTA_ACCERTAMENTI.getProdotti;
	RICETTA.getProblemi = RICETTA_ACCERTAMENTI.getProblemi;
	RICETTA.updEsenzioniObjSalvataggio = RICETTA_ACCERTAMENTI.updEsenzioniObjSalvataggio;
	
	home.RIEPILOGO.toggleButtons( $('#IDFRAME').val() );

	RICETTA_ACCERTAMENTI.addSearchBar();
	
});


var RICETTA_ACCERTAMENTI = {

		vType:'MMG_ACCERTAMENTI',
		
		table:null,

		init:function(){
			
			home.RICETTA_ACCERTAMENTI = this;
			
			home.NS_CONSOLEJS.addLogger({ name: 'RICETTA_ACCERTAMENTI', console: 0 });
			RICETTA_ACCERTAMENTI.logger = home.NS_CONSOLEJS.loggers['RICETTA_ACCERTAMENTI'];
			
			home.RIEPILOGO.setLayout( $('#IDFRAME').val(), 'RICETTA_ACCERTAMENTI', $( document ) );
			
			RICETTA_ACCERTAMENTI.table = $("#tableRisultati");
			
			//prendo la prima riga in modo da duplicarla sempre da 'vergine'
			$("tr[tipoRiga=ins]").find(".tdAction input").attr("checked","checked");
			_riga = $("tr[tipoRiga=ins]");
			newRiga = _riga.clone();

			$crono = $(".icon-cog-1").contextMenu(menuCrono,{openSubMenuEvent: "click", openInfoEvent: "click"});
			$option =  $(".icon-hourglass").contextMenu(menuOption,{openSubMenuEvent: "click", openInfoEvent: "click"});
			
			var $ins = $("tr[tipoRiga=ins] .tdAction");
			$ins.find("i").hide();
			//$ins.find("input").attr("disabled","disabled");
			
			//funzione che controllainit tutti i dati della riga (temporaneita' cronicita', se e' da stampare, ...)
			RICETTA.checkRiga(classRiga);
			
			//nascondo l'icona della x per chiudere
			$("div.iconContainer").find("i.icon-cancel-squared").hide();			
		},
		
		addSearchBar: function(){
			var search = $(document.createElement('input'));
			search.attr({ 'type' : 'text', 'id': 'search-filter' });
			search.hide();
			search.on('keydown', function(event) { 
				if( event.which != 9 )
					RICETTA_ACCERTAMENTI.filterRows(event); 
			}); 
			var icon = $(document.createElement('i'));
			icon.addClass('icon-search');
			icon.on('click', RICETTA_ACCERTAMENTI.toggleSearchBar );
			$('.headerTabs').find('.iconContainer').prepend( search, icon );
		},
		
		toggleSearchBar: function(){
			if( $('#search-filter').is(':visible') ){
				$('#search-filter').hide();
				$('#tableRisultati').find('tr').show();
			} else {				
				$('#search-filter').show().css("display", "inline-block").focus();	
			}
		},
		
		filterRows: function( event ){
						
			var 
				search	= $('#search-filter').val().toUpperCase(),
				table	= $('#tableRisultati'), 
				rows	= table.find('tr').not('[tiporiga="ins"]'), 
				columns = rows.find('td.tdRRAccertamenti.classAccertamento'), 
				columns_to_hide;
		
			columns.closest('tr').show();
			
			if (window.console)
				console.log( 'which == '+ event.which);
			
			if( event.which == 9 )
				$('#txttd_accertamento0').focus();
			
			if( search != '' ){
				
				columns_to_hide = columns.filter(function(){
					return $(this).text().indexOf( search ) == -1;
				});
				columns_to_hide.closest('tr').hide();
			}
		},
		
		setEvents:function(){
			
			$(".butPrescrLibera").click(function(){
				home.NS_MMG.checkAccesso().done(function(){
					if(!home.MMG_CHECK.isDead()){return;}
					RICETTA_ACCERTAMENTI.insertPrescrLibera();
				});
			});

			$(".footerTabs").on("dblclick",function(){
				RICETTA_ACCERTAMENTI.debug(false);
			});

			$(".classRisultato input").on("dblclick",function(){
				RICETTA_ACCERTAMENTI.apriDialogRisultati($(this));
			});
			
			$("#th_data").on("click", function(){
				TABLE.orderRows($(this),'RR_ACCERTAMENTI',"DATA","");
			});
			
			$("#th_accertamento").on("click", function(){
				TABLE.orderRows($(this),'RR_ACCERTAMENTI',"ACCERTAMENTO","");
			});
			
			//selezione della riga
			$("tr."+classRiga).on("click",function(){
				RICETTA_ACCERTAMENTI.setIDX($(this).attr("idx"),true);
			});
			
			$("tr."+classRiga).find("input[type=checkbox]").on("change", function(){
				if(!home.MMG_CHECK.isDead()){return;}
				if($(this).is(":checked")){
					RICETTA_ACCERTAMENTI.controllaEsenzioni($(this).closest("tr").attr("idx"));
				}
			});
			
			//onblur sull'inserimento dell'accertamento
			$("tr."+classRiga).find('.classAccertamento').find("input").off("blur").on("blur",function(){
				
				if(!home.MMG_CHECK.isDead()){return;}
				var riga=$("tr[idx="+idx_sel+"]");
				$(this).val($(this).val().toUpperCase());
				var testoRicerca = $(this).val().replace(".","*");
				
				if($(this).attr("elaborato") && $(this).val() != ''){
					return;
				}
				
				if($(this).val() != ''){
					if(!home.MMG_CHECK.isDead()){
						return;
					}
					home.NS_MMG.apri("MMG_SCELTA_ACCERTAMENTI&IDX="+$("#IDX").val()+"&CAMPO_VALUE="+testoRicerca+"&IDX_RIGA="+riga.attr("idx") );
					//$(this).val("");
				}
			});
			
			//keyup sull'inserimento dell'accertamento
			$("tr."+classRiga).find('.classAccertamento').find("input").on(RICETTA.eventKeyUpBrowser,function(e){
				if(!home.MMG_CHECK.isDead()){return;}
				
				if(e.which == '13'){
					var riga=$("tr[idx="+idx_sel+"]");
					$(this).val($(this).val().toUpperCase());
					var testoRicerca = $(this).val().replace(".","*");
					if($(this).val() != ''){
						home.NS_MMG.apri("MMG_SCELTA_ACCERTAMENTI&IDX="+$("#IDX").val()+"&CAMPO_VALUE="+testoRicerca+"&IDX_RIGA="+riga.attr("idx") );
						$(this).val("");
					}
				}

				//fatto per bloccare la selezione del pulsante del tipo di ricetta
				e.stopImmediatePropagation();
			});
			
			//doppio clic sull'input di inserimento del accertamento
			$("tr."+classRiga).find('.classAccertamento').find("input").on("dblclick",function(){
				if(!home.MMG_CHECK.isDead()){return;}
				var riga=$("tr[idx="+idx_sel+"]");
				var testoRicerca = $(this).val().replace(".","*");
				home.NS_MMG.apri("MMG_SCELTA_ACCERTAMENTI&IDX="+$("#IDX").val()+"&CAMPO_VALUE="+testoRicerca+"&IDX_RIGA="+riga.attr("idx") );
				$(this).val("");
			});
			
			//doppio clic sull'inserimento dell'esenzione
			$("tr."+classRiga).find('.classEsenzione').find("input").on("dblclick",function(){
				if(!home.MMG_CHECK.isDead()){return;}
				var riga=$("tr[idx="+idx_sel+"]");
				home.NS_MMG.apri("MMG_SCELTA_ESENZIONI&PROVENIENZA=ACCERTAMENTI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
				$(this).val("");
			});
			
			//onblur sull'inserimento della esenzione
			$("tr."+classRiga).find('.classEsenzione').find("input").on("blur",function(){ 
				
				if(!home.MMG_CHECK.isDead()){return;}

				if($(this).val()!= '' && $(this).val()!= riga.esenzione){
					
					home.NS_MMG.apri("MMG_SCELTA_ESENZIONI&PROVENIENZA=ACCERTAMENTI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+ $(this).closest("tr").attr("idx") );
					$(this).val("");
					
				}else if ($(this).val() == ''){
					RICETTA_ACCERTAMENTI.setEsenzione( $(this).closest("tr").attr("idx") , { descrizione: "", codice: "" } );
				}
			});
			
			//keyup sull'inserimento dell'esenzione
			$("tr."+classRiga).find(".classEsenzione input").on(RICETTA.eventKeyUpBrowser,function(e){
				if(!home.MMG_CHECK.isDead()){return;}
				var riga=$("tr[idx="+idx_sel+"]");
				if(e.which == '13'){
					home.NS_MMG.apri("MMG_SCELTA_ESENZIONI&PROVENIENZA=ACCERTAMENTI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
					$(this).val("");
				}
			});
			
			//onblur sul campo del risultato
			$("tr."+classRiga).find(".classRisultato input").on("blur",function(){
				if(!home.MMG_CHECK.isDead()){return;}
				if($(this).val() != riga.risultato){
					RICETTA.updRiga({
						"iden_per"		: home.baseUser.IDEN_PER,
						"tabella"		: "MMG_ACCERTAMENTI",
						"nome_campo"	: "RISULTATO",
						"iden_tabella"	: $(this).closest("tr").attr("iden"),
						"valore"		: $(this).val()
						});
				}
				if($(this).closest("tr").attr("data_esecuzione") != riga.data_esecuzione){
					RICETTA.updRiga({
						"iden_per"			: home.baseUser.IDEN_PER,
						"tabella"			: "MMG_ACCERTAMENTI_DETTAGLIO",
						"nome_campo"		: "DATA_ESECUZIONE",
						"iden_tabella"		: $(this).closest("tr").attr("iden"),
						"campo_iden_where"	: "IDEN",
						"valore"			: $(this).closest("tr").attr("data_esecuzione")
					});
				}
			});
			
			$(".butInserisci").click(function(){
				if(!home.MMG_CHECK.isDead()){return;}
				TABLE.insertRow();
			});

			RICETTA_ACCERTAMENTI.table.on("click",".icon-cog-1",function(e){
				RICETTA_ACCERTAMENTI.setIDX($(this).parent().parent().attr("idx"), true);

				e.preventDefault();
				e.stopImmediatePropagation();
				RICETTA_ACCERTAMENTI.closeContextMenu();
				$option.test(e, this);
			});

			RICETTA_ACCERTAMENTI.table.on("click",".icon-hourglass", function(e){
				RICETTA_ACCERTAMENTI.setIDX($(this).parent().parent().attr("idx"), true);
				
				e.preventDefault();
				e.stopImmediatePropagation();
				RICETTA_ACCERTAMENTI.closeContextMenu();
				$crono.test(e, this);
			});
			
			RICETTA_ACCERTAMENTI.table.on("click",".icon-pencil", function(e){
				RICETTA_ACCERTAMENTI.setIDX($(this).parent().parent().attr("idx"), true);
				RICETTA_ACCERTAMENTI.context_menu.inserisciNota('ACCERTAMENTO');
				
				e.preventDefault();
				e.stopImmediatePropagation();
				RICETTA_ACCERTAMENTI.closeContextMenu();
				$crono.test(e, this);
			});
			
			RICETTA_ACCERTAMENTI.table.on("click",".icon-doc", function(e){
				RICETTA_ACCERTAMENTI.setIDX($(this).parent().parent().attr("idx"), true);
				if(!home.MMG_CHECK.isDead()){return;}
				var riga = $(this).parent().parent();
				
				if (riga.attr("dastampare") == "D") {
					return;
				}
				
				var icona = $(this);
				
				var param = {
					'pIden'	 	: riga.attr("iden"),
					'pUteIns'	: home.baseUser.IDEN_PER,
					'pType'		: objSalvataggio.tipo_ricetta
				};
				
		        toolKitDB.executeProcedureDatasource("SP_REMOVE_DASTAMPARE", "MMG_DATI", param, function(resp){
		        	$.each(resp,function(k,v){
		        		if(v=='OK'){
		        			icona.hide();
		        		}
		        	});
		        });
			});
			
			// modifica data accertamento
			$(document).on("dblclick","tr[iden] .classData", function() {
				if(!home.MMG_CHECK.isDead()){return;}
				
				if($(this).parent().attr("sito") == 'MMG'){
					RICETTA.apriDialogData($(this), RICETTA_ACCERTAMENTI.vType);
				}else{
					home.NOTIFICA.warning({
						message: traduzione.deniedCambioDataMI,
						title: "Attenzione",
						timeout:"15"
					});
				}
			});
			
			// popup info accertamento
			$(document).on("click",".tdAction .icon-info-circled", function() {
				RICETTA_ACCERTAMENTI.showInfoAccertamento( $(this).closest("tr").attr("iden"), $(this).closest('tr').find('.icon-pencil').attr('title') );
			});
			
			//scelta di quel determinato farmaco
			$("tr."+classRiga+":not([tiporiga=ins])").find(".classAccertamento").on("dblclick", function(){
				
				if(!home.MMG_CHECK.isDead()){return;}
				
				var valoreCampo = $(this).html();
				var rigaIns 	= $("tr[tiporiga=ins]").first();
				var rigaAttuale = $(this).parent();
				
				qta				= rigaAttuale.find(".classQuantita input").val();
				
				valoreCampo = valoreCampo.replace("\%"," ");
				
				rigaIns.find(".classFarmaco input").val(valoreCampo);
				idxLinea = rigaIns.attr("idx");
				
				home.NS_MMG.apri("MMG_SCELTA_ACCERTAMENTI&IDX="+$("#IDX").val()+
						"&CAMPO_VALUE="+valoreCampo+
						"&IDX_RIGA="+idxLinea);
			});
		},
		
		setNScheda: function(n_scheda) {
			RICETTA.chiudischeda = n_scheda;
		},

		context_menu:{
			
			allega_documento:function(provenienza){
				
				var iden=$("tr[idx="+idx_sel+"]").attr("iden");
				var url_agg = "&IDEN_EPISODIO="+iden+"&TIPO_EPISODIO="+provenienza;
				home.NS_MMG.apri("DOCUMENTI_ALLEGATI" + url_agg);
			},

			annullaCancellaAccertamento:function(){
				
				if($("tr[idx="+idx_sel+"]").hasClass("TRdeleted")){
					
					$("tr[idx="+idx_sel+"]").find("input").removeAttr("disabled");
					RICETTA.removeDisableRiga(idx_sel);
					RICETTA.updateInfoRow($("tr[idx="+idx_sel+"]"), 'UNDELETED');
				
				}else{
					home.NOTIFICA.warning({
			            message: msg_2,
			            title: "Attenzione",
						timeout:"15"
			        });
				}
			},
			
			apriModulo:function(pModulo){
				
				if(!home.MMG_CHECK.isDead()){return;}
				
				var riga		= $("tr[idx="+idx_sel+"]");
				var iden_acc 	= riga.attr("iden");
				var Problema 	= riga.attr("iden_problema");
				var Urgenza 	= riga.attr("urgenza");
				var urlAgg 		= "&IDEN_ACCERTAMENTO=" + iden_acc + "&ID_PROBLEMA=" + Problema + "&PROVENIENZA=TAB_RR_ACCERTAMENTI" + "&URGENZA=" + Urgenza ;
				home.NS_MMG.apri( pModulo,  urlAgg );
				
			},
			
			cancellaAccertamento:function(){
				
				if(!home.MMG_CHECK.isDead()){return;}
				
				if($("tr[idx="+idx_sel+"]").attr("sito") == 'MMG'){	
					var iden = $("tr[idx="+idx_sel+"]").attr("iden");				
					RICETTA.cancella('ACCERTAMENTI', [iden]);
				}else{
					home.NOTIFICA.warning({
						message: traduzione.deniedDeleteMI,
						title: "Attenzione",
						timeout:"15"
					});
				}
			},
			
			cancellaAccertamenti:function(){
				
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
						title: "Attenzione",
						timeout:"15"
					});						
				
				}else{
					RICETTA.cancella('ACCERTAMENTI', arIden);
				}
				
				//avviso che alcune righe non sono state cancellate
				if(counter>0){
					home.NOTIFICA.warning({
						message: traduzione.deniedDeleteMIMulti,
						title: "Attenzione",
						timeout:"15"
					});
				}
			},
			
			inserisciNota:function(){
				
				var riga= $("tr[idx="+idx_sel+"]");
				var indice = $("#IDX").val();
				var accertamento=riga.find(".classAccertamento").text();
				var iden = riga.attr("iden");
				var nota = riga.attr("note_prescrizione");
				var url_agg = "&CASE=NOTA&IDEN="+iden+"&IDX="+indice+"&OBJ="+accertamento+"&NOTA="+nota;
				//var url = home.NS_MMG.apri("CRONO_RR_ACCERTAMENTI",url_agg, true);
				
				if(!riga.hasClass("TRdeleted")){
					//home.NS_MMG.apri(url,400,750);
					home.NS_MMG.apri("CRONO_RR_ACCERTAMENTI" + url_agg);
				}else{
					home.NOTIFICA.warning({
			            message: msg_1,
			            title: "Attenzione",
						timeout:"15"
			        });
				}
			},
			
			mostraInPatSummary: function( pValore ) {
				
				if(!home.MMG_CHECK.isDead()){return;}
				
				RICETTA.updRiga({
						"iden_per"			: home.baseUser.IDEN_PER,
						"tabella"			: "MMG_ACCERTAMENTI_DETTAGLIO",
						"nome_campo"		: "PAT_SUMMARY",
						"iden_tabella"		: $("tr[idx="+idx_sel+"]").attr("iden"),
						"storicizza"		: "N",
						"campo_iden_where"	: "IDEN",
						"valore"			: pValore
				}, function() {
					
					$("tr[idx="+idx_sel+"]").attr("pat_summary",pValore);
					home.NOTIFICA.success({
						message: "Salvataggio effettuato",
					});
				});
				
			},

			oscuraBackend: function( flag_oscuramento, dati_elemento, callback) {
				dati_elemento.tabella = "MMG_ACCERTAMENTI_DETTAGLIO";
				dati_elemento.campo_multi = "CODICE_ACCERTAMENTO";
				RICETTA.oscura(flag_oscuramento, dati_elemento, callback);
			},
			
			oscura: function(flag_oscuramento) {
				RICETTA_ACCERTAMENTI.context_menu.oscuraBackend(flag_oscuramento, {
					iden_tabella:$("tr[idx="+idx_sel+"]").attr("iden"),
					iden_multi:$("tr[idx="+idx_sel+"]").attr("cod_accertamento")
				}, {
					singola: function(dati_elemento) {
						$("tr[idx="+idx_sel+"]").attr("oscurato",flag_oscuramento);
					},
					multi: function(dati_elemento) {
						RICETTA.reload();
					}
				});
			},
			
			mostraInPatSummaryMulti: function( pValore ) {
				
				if(!home.MMG_CHECK.isDead()){return;}
				
				var arIdenTabella = [];
				var selRows = $("tr[iden]").not("[tiporiga='ins']").find(".tdAction input:checked").closest("tr");
				selRows.each(function() {
					arIdenTabella.push($(this).attr("iden"));
				});
				
				if(arIdenTabella.length<1)
				{
					home.NOTIFICA.warning({
						message: traduzione.lblSelAlmeno,
						title: "Attenzione",
						timeout:"15"
					});						
				}
				else
				{
					RICETTA.updRighe({
						"iden_per"			: home.baseUser.IDEN_PER,
						"tabella"			: "MMG_ACCERTAMENTI_DETTAGLIO",
						"nome_campo"		: "PAT_SUMMARY",
						"ar_iden_tabella"	: arIdenTabella,
						"storicizza"		: "N",
						"campo_iden_where"	: "IDEN",
						"valore"			: pValore
					}, function() {
						selRows.attr("pat_summary",pValore);
						home.NOTIFICA.success({
							message: "Salvataggio effettuato",
						});
					});
				}
				
			},

			setPeriodica: function(riga){
				
				if(!home.MMG_CHECK.isDead()){return;}
				
				if(!riga.hasClass("TRdeleted")){
					var iden = riga.attr("iden");
					var accertamento = riga.find(".classAccertamento").text();
					var url_agg = "&CASE=PERIODICA&IDEN="+iden+"&OBJ="+accertamento;
					home.NS_MMG.apri( "CRONO_RR_ACCERTAMENTI" + url_agg );
					
				}else{
					home.NOTIFICA.warning({
			            message: msg_1,
			            title: "Attenzione",
						timeout:"15"
			        });
				}
			},		
			
			setTemporanea: function(riga){
				
				if(!home.MMG_CHECK.isDead()){return;}
				
				if(!riga.hasClass("TRdeleted")){
					var iden = riga.attr("iden");
					var accertamento = riga.find(".classAccertamento").text();
					var url_agg = "&CASE=TEMPORANEA&IDEN="+iden+"&OBJ="+accertamento;
					home.NS_MMG.apri( "CRONO_RR_ACCERTAMENTI", url_agg );
					
				}else{
					home.NOTIFICA.warning({
			            message: msg_1,
			            title: "Attenzione",
						timeout:"15"
			        });
				}
			},
			
			setImportanza: function(riga, valore) {
				
				RICETTA.updRiga({
					"iden_per"			: home.baseUser.IDEN_PER,
					"tabella"			: "MMG_ACCERTAMENTI_DETTAGLIO",
					"nome_campo"		: "IMPORTANZA",
					"iden_tabella"		: $("tr[idx="+idx_sel+"]").attr("iden"),
					"storicizza"		: "N",
					"campo_iden_where"	: "IDEN",
					"valore"			: valore
					}, function() {
						$("tr[idx="+idx_sel+"]").attr("importanza", valore)
					});
			},
			
			removeMI:function(pIden){
				arIden = [pIden];
				MEDICINA_INIZIATIVA.auxCallDb("REMOVE","ACCERTAMENTI", arIden);
				$("tr[iden="+pIden+"]").attr("mi","N");
				RICETTA.checkInfoAccertamenti("trRigaAccertamenti", pIden);
			},
			
			removeMIMulti:function(){
				if(!home.MMG_CHECK.isDead()){return;}

				var arIden = [];
				$("tr[iden]").not("[tiporiga='ins']").find(".tdAction input:checked").each(function() {
					arIden.push($(this).closest("tr").attr("iden"));
					$("tr["+$(this).closest("tr").attr("iden")+"]").attr("mi","N");
				});
				if(arIden.length<1){
					home.NOTIFICA.warning({
						message: traduzione.lblSelAlmeno,
						title: "Attenzione",
						timeout:"15"
					});						
				}else{
					MEDICINA_INIZIATIVA.auxCallDb("REMOVE","ACCERTAMENTI", arIden);
				}

				RICETTA.checkInfoAccertamenti("trRigaAccertamenti");
			},
			
			setMI:function(pIden, pType){
				arIden = [pIden];
				MEDICINA_INIZIATIVA.auxCallDb("SET","ACCERTAMENTI", arIden);
			},
			
			setMIMulti:function(pType){

				if(!home.MMG_CHECK.isDead()){return;}

				var arIden = [];
				$("tr[iden]").not("[tiporiga='ins']").find(".tdAction input:checked").each(function() {
					arIden.push($(this).closest("tr").attr("iden"));
				});
				if(arIden.length<1){
					home.NOTIFICA.warning({
						message: traduzione.lblSelAlmeno,
						title: "Attenzione",
						timeout:"15"
					});						
				}else{
					MEDICINA_INIZIATIVA.auxCallDb("SET","ACCERTAMENTI", arIden);
				}
			}
		},
		
		closeContextMenu:function(){
			$crono.close();
			$option.close();
		},
		
		controllaEsenzioni:function(idRiga){
			
			var $this = $("tr[idx="+idRiga+"]");
			var esenzioneTotale = home.ASSISTITO.getEsenzioni(null,"T");
			
			if (home.CARTELLA.getRegime() == 'LP') {
				setEsenzione($this, null, true);
				return;
			}

			//nel caso ci sia la 048 e il paziente la abbia ancora
			if(	($this.attr("cod_esenzione") == "TDL01" && (vEse="TDL01"))				||
				($this.attr("cod_esenzione") == '048' 	&& (vEse=getEsenzione("048"))) 	||
				($this.attr("cod_esenzione") == '046' 	&& (vEse=getEsenzione("046"))) 	||
				($this.attr("cod_esenzione") == '040' 	&& (vEse=getEsenzione("040"))) 	||
				($this.attr("cod_esenzione") == 'L02' 	&& (vEse=getEsenzione("L02"))) 	||
				($this.attr("cod_esenzione") == 'L03' 	&& (vEse=getEsenzione("L03"))) 	||
				($this.attr("cod_esenzione") == 'L04' 	&& (vEse=getEsenzione("L04"))) 	||
				($this.attr("cod_esenzione") == 'L04' 	&& (vEse=getEsenzione("L04"))) 	||
				($this.attr("cod_esenzione") == 'S03' 	&& (vEse=getEsenzione("S03"))) 	||
				($this.attr("cod_esenzione") == 'M50' 	&& (vEse=getEsenzione("M50"))) 	||
				($this.attr("cod_esenzione") == '041' 	&& (vEse=getEsenzione("041")))

				
				/* eliminato per favorire l'associazione di prestazioni a questi codici esenzione, in attesa di specifiche migliori
				 || ($this.attr("cod_esenzione") == '0A02' && (vEse=getEsenzione("0A02"))) ||
						($this.attr("cod_esenzione") == '0B02' && (vEse=getEsenzione("0B02"))) ||
							($this.attr("cod_esenzione") == '0C02' && (vEse=getEsenzione("0C02")))



				*/
				
				)
			{
				return;
			}


			
			// esenzioni totali che non richiedono il controllo delle parziali
			// esenzioni S01 e S02 (invalidità per servizio) che devono essere trattate come C01 e C02 (indicazione del Dr Fusetti, che ha sentito Dr Bessero, del 13/07/2015)
			// esenzione parziale G02 che ha la priorita' sulle altre esenzioni
			// (28/08/2015 lucas: Aggiunta la gestione della V01
			else if (
						(vEse = getEsenzione("G02")) || 
						(vEse = getEsenzione("G01")) ||
						(vEse = getEsenzione("S01")) ||
						(vEse = getEsenzione("S02")) ||
						(vEse = getEsenzione("V01")) ||
						(vEse = getEsenzione("C02")) ||
						(vEse = getEsenzione("C01")) 						
					) 
			{

				setEsenzione($this,vEse,true);
			}

			//altre esenzioni totali
			else if(esenzioneTotale.length > 0){
				vEse = esenzioneTotale[0];
				setEsenzione($this,vEse,true);
			}
			
			// non ha l'esenzione parziale G02, G01, V01 ne' ha esenzioni totali
			// (28/08/2015 lucas: Aggiunta la gestione della V01
			else if ((getEsenzione("G02")==null && getEsenzione("G01")==null && getEsenzione("V01")==null) && esenzioneTotale.length==0)
			{
				setEsenzione($this,null);
				RICETTA_ACCERTAMENTI.controllaEsenzioniParziali($this);
			}

			else 
			{
				vEse = esenzioneTotale[0];
				setEsenzione($this,vEse,true);
				RICETTA_ACCERTAMENTI.controllaEsenzioniParziali($this);
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
			
			var codAccertamento = pRiga.attr("cod_accertamento");
			home.ASSISTITO.checkEsenzioniPrestazioni(codAccertamento, function(esenzioni) {
				var esenzione = esenzioni[codAccertamento];
				if( typeof esenzione != 'undefined' ) {
					pRiga.attr("cod_esenzione",esenzione.CODICE_ESENZIONE);
					pRiga.find(".classEsenzione input").val(esenzione.CODICE_ESENZIONE + ' - ' +esenzione.DESCR_ESENZIONE).addClass("esenzParziale").attr("title",esenzione.CODICE_ESENZIONE + ' - ' +esenzione.DESCR_ESENZIONE);
				}
			});
		},

		debug:function(boolAlert){

			var msg = 'DEBUG INFORMAZIONI RIGA SELEZIONATA:\n';
			msg+= '\n@riga.nome_accertamento: '		+riga.nome_accertamento;
			msg+= '\n@riga.cod_accertamento: '		+riga.cod_accertamento;
			msg+= '\n@riga.quantita: '				+riga.quantita;
			msg+= '\n@riga.esenzione: '				+riga.esenzione;
			msg+= '\n@riga.cod_esenzione: '			+riga.cod_esenzione;
			msg+= '\n@riga.risultato: '				+riga.risultato;
			msg+= '\n@riga.data_esecuzione: '		+riga.data_esecuzione;
			msg+= '\n@riga.cod_risultato: '			+riga.cod_risultato;
			msg+= '\n@riga.cronica: '				+riga.cronica;
			msg+= '\n@riga.periodica: '				+riga.periodica;
			msg+= '\n@riga.temporanea: '			+riga.temporanea;
			msg+= '\n@riga.problema: '				+riga.problema;
			msg+= '\n@riga.deleted: '				+riga.deleted;
			msg+= '\n@riga.da_stampare: '			+riga.da_stampare;
			msg+= '\n@riga.blocco: '				+riga.blocco;
			msg+= '\n@riga.urgenza: '				+riga.urgenza;
			msg+= '\n@riga.diagnosi: '				+riga.diagnosi;
			msg+= '\n@riga.cod_situazione_clinica: '+riga.cod_situazione_clinica;
			msg+= '\n@riga.forzatura: '				+riga.forzatura;
			msg+= '\n@riga.importanza: '			+riga.importanza;
			msg+= '\n@riga.suggerita: '				+riga.suggerita;

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
			
			var prodottiElaborati = new Array();
			
			RICETTA_ACCERTAMENTI.initObjSalvataggio();
			var regime = home.CARTELLA.getRegime();
			
			$(".tdAction input:checked").each(function(){
				var riga = $(this).parent().parent();
				var tipoRiga = typeof riga.attr("tiporiga") != 'undefined' ? riga.attr("tiporiga") : 'undefined';
				var descrAccertamento = typeof riga.find(".classAccertamento input").val() != 'undefined' ? riga.find(".classAccertamento input").val() : riga.find(".classAccertamento").html();
				
				//if($(this).attr("checked")=="checked"){
					
				if(riga.attr("cod_accertamento")!='' && 
						descrAccertamento != '' && 
						riga.attr("deleted") != 'S') {

					prodottiElaborati.push(riga.attr("cod_accertamento"));

					var accertamento = new Object();
					accertamento.index = riga.attr("idx");
					accertamento.iden = riga.attr("iden");
					accertamento.cod_accertamento = riga.attr("cod_accertamento");

					//controllo di che tipo e' la riga per prendere il valore nel modo corretto
					if(tipoRiga == 'undefined'){
						accertamento.accertamento = riga.find(".classAccertamento").text().trim();
						//accertamento.data = NS_MMG_UTILITY.getData('yyyymmmdd');
						accertamento.data = moment().format('YYYYMMDD');
					}else{
						accertamento.accertamento = riga.find(".classAccertamento input").val();
						accertamento.data = riga.attr("data");
					}

					var quantita = RICETTA.checkQTA(riga.find(".classQuantita input").val());
					accertamento.qta = isNaN(quantita) ? '1' : quantita;

					if(riga.find(".classEsenzione input").val()!=''){
						accertamento.cod_esenzione = riga.attr("cod_esenzione");
//								accertamento.descr_esenzione = riga.find(".classEsenzione input").val();
					}

					accertamento.cronicita = riga.attr("cronica");
					accertamento.periodicita = riga.attr("periodica");
					accertamento.temporaneita = riga.attr("temporanea");
					accertamento.da_stampare = riga.attr("daStampare");
					accertamento.urgenza = riga.attr("urgenza");
					accertamento.diagnosi = riga.attr("diagnosi");
					accertamento.blocco = riga.attr("blocco");
					accertamento.cod_situazione_clinica = riga.attr("cod_situazione_clinica");
					accertamento.forzatura = riga.attr("forzatura");
					accertamento.importanza = riga.attr("importanza");
					accertamento.suggerita = NS_MMG_UTILITY.getAttr(riga,"suggerita", "N");
					accertamento.cicliche = NS_MMG_UTILITY.getAttr(riga,"cicliche", "0");
					accertamento.num_sedute = NS_MMG_UTILITY.getAttr(riga,"num_sedute", "0");

					if(home.ASSISTITO.IDEN_PROBLEMA!= ''){
						accertamento.problema = home.ASSISTITO.IDEN_PROBLEMA;
					} else {
						accertamento.problema = riga.attr("iden_problema");
					}

					accertamento.onere = regime;

					objSalvataggio.accertamento.push(accertamento);

					if(tipoRiga == 'ins'){
						//riga.remove();
						accertamento.risultato = riga.find(".classRisultato input").val();
					}else{
						accertamento.risultato = "";
						$(this).attr("checked",false);
					}
					//Per ora in riprescrizione solo le sedute
					if (accertamento.cicliche > "0") {
						accertamento.note = NS_MMG_UTILITY.getAttr(riga,"note_prescrizione", "");
					} else {
						accertamento.note = "";
					}

					accertamento.appropriatezza = NS_MMG_UTILITY.getAttr(riga,"appropriatezza", "");
					accertamento.id_nota_appropriatezza = NS_MMG_UTILITY.getAttr(riga,"id_nota_appropriatezza", "");

					accertamento.iden_ricetta = NS_MMG_UTILITY.getAttr(riga,"iden_ricetta", "");
				}
				//}
				
				//alert(objSalvataggio);
			});
			
			
			//alert('JSON STRINGIFIZZATO: \n'+JSON.stringify(objSalvataggio));
			return RICETTA_ACCERTAMENTI.getCodiciAccertamenti();
		},
		
		ciclaCampo:function(campo) {
			var concatenati = "";
			for(var x=0; x < objSalvataggio.accertamento.length; x++) {
				if (x>0) {
					concatenati += ",";
				}
				
				var v_var = objSalvataggio.accertamento[x][campo] == '' ?'0' : objSalvataggio.accertamento[x][campo];
				concatenati += v_var;	
			}
			return concatenati;
		},
		
		getEsenzioneFromIdx: function(idxRow){
			var row = $("tr[idx="+idxRow+"]");
//			alert(row.find(".classEsenzione input").val())
			return row.find(".classEsenzione input").val();
		},
		
		getCodiciAccertamenti:function() {
			return RICETTA_ACCERTAMENTI.ciclaCampo("cod_accertamento");
		},
		
		getProblemi:function(){
			return RICETTA_ACCERTAMENTI.ciclaCampo("problema");
		},
		
		insertAccertamenti:function(arrAccertamenti, classRigaPrescrLibera){
	
			var classPrescrLibera = typeof classRiga == 'undefined' ? '' : classRigaPrescrLibera;
			for(var i=0;i<arrAccertamenti.length;i++){
				
				var idx = TABLE.insertRow(classPrescrLibera);
				var row = $("[idx="+idx+"]");
				
				row.find(".classAccertamento").find("input").val(arrAccertamenti[i].accertamento);
				row.find(".classData").not(".hidden").html(arrAccertamenti[i].data);
				row.attr("cod_accertamento",arrAccertamenti[i].cod_accertamento);
				row.attr("data",arrAccertamenti[i].data_hidden);
				row.attr("cicliche",arrAccertamenti[i].cicliche);
				row.attr("num_sedute",arrAccertamenti[i].num_sedute);
				row.attr("appropriatezza", arrAccertamenti[i].appropriatezza);
				row.attr("id_nota_appropriatezza", arrAccertamenti[i].id_nota_appropriatezza);
				
				RICETTA_ACCERTAMENTI.controllaEsenzioni(idx);
			}
			
			$("tr[tiporiga=ins]").each(function(){
				if($(this).attr("cod_accertamento") == "" && !jQuery(this).find('.classAccertamento input').attr("elaborato")){
					jQuery(this).remove();
				}else{
					jQuery(this).find('.classAccertamento input').attr("elaborato",true);
				}
				
				jQuery(this).find(".classQuantita input").focus();
	
			});
			
			//in caso di prescrizione libera
			if(classRigaPrescrLibera == 'prescrLibera'){
				$("tr[tiporiga=ins]").find(".classAccertamento input").focus();
			}
			
			TABLE.insertRow();
		},
		
		insertPrescrLibera:function(){
			
			var arrAccertamenti = new Array();
			
			arrAccertamenti.push({
				accertamento: "",
				cod_accertamento: "LIBERA.00@00-",
				data_hidden: moment().format('YYYYMMDD'),
				data: moment().format('DD/MM/YYYY')
			});
			
			RICETTA_ACCERTAMENTI.insertAccertamenti(arrAccertamenti, 'prescrLibera');
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
			objSalvataggio.accertamento = new Array();
		},
		
		onClose:function(){
			//TODO: implementare funzione sull'onclose
		},
		
		setIDX:function(idx, booleano){
			
			idx_sel = idx;

			if(booleano){
				RICETTA_ACCERTAMENTI.setInfoRiga(idx_sel);
			}
			
			RICETTA.selectRiga(idx,classRiga);
		},
		
		setInfoRiga:function(indice){

			var row = $("[idx="+idx_sel+"]");
			
			riga._this					= row;
			riga.iden 					= row.attr("iden");
			riga.nome_accertamento 		= row.find(".classAccertamento").not(".hidden").html();
			riga.cod_accertamento 		= row.attr("cod_accertamento");
			riga.quantita 				= row.find(".classQuantita").find("input").val();
			riga.esenzione				= row.find(".classEsenzione").find("input").val();
			riga.cod_esenzione 			= row.attr("cod_esenzione");
			riga.risultato 				= row.find(".classRisultato").find("input").val();
			riga.data_esecuzione		= row.attr("data_esecuzione");
			riga.cod_risultato 			= row.attr("cod_risultato");
			riga.cronica 				= row.attr("cronica");
			riga.periodica 				= row.attr("periodica");
			riga.temporanea 			= row.attr("temporanea");
			riga.problema	 			= row.attr("iden_problema");
			riga.deleted	 			= row.attr("deleted");
			riga.da_stampare			= row.attr("daStampare");
			riga.diagnosi				= row.attr("diagnosi");
			riga.urgenza				= row.attr("urgenza");
			riga.cod_situazione_clinica	= row.attr("cod_situazione_clinica");
			riga.forzatura				= row.attr("forzatura");
			riga.importanza				= row.attr("importanza");
			riga.suggerita				= row.attr("suggerita");
			riga.cicliche				= NS_MMG_UTILITY.getAttr(row,"cicliche","0");
			riga.num_sedute				= NS_MMG_UTILITY.getAttr(row,"num_sedute","0");
		},
		
		apriDialogRisultati: function(obj) {
			var dt = $("<input/>", {style:"width:80px; float:left"});
			var label = $("<div/>", {style:"width:120px; float:left;"}).text("Data del risultato: ");
			var ta = $("<textarea/>", {style:"width:100%;height:80px;overflow:auto;"});
			$.dialog($("<div/>").append([label,dt,ta]), {			
				'ESCandClose'		: true,
				'created'			: function(){ $('.dialog').focus(); },
				'buttons'			: [ {
					"label"  			: "Ok",
					'classe'			: "butVerde",
					"action" 			:  function() {
						
							obj.closest("tr").attr("data_esecuzione", moment(dt.val(), "DD/MM/YYYY").format("YYYYMMDD"));
							obj.val(ta.val()).blur(); 
							$.dialog.hide();
						}
				}, {
					"label"  			:  "Annulla",

					"keycode"			: "27",
					"action"			:   $.dialog.hide
				} ],
				'title' 				: "Inserisci risultato",
				'width' 				: 600,
				'height'				: 150
			});
			ta.focus().val(obj.val());
			dt.Zebra_DatePicker({ inside:false });
			var savedDataEse = obj.closest("tr").attr("data_esecuzione");
			if (savedDataEse != '')
				dt.val(moment(savedDataEse, "YYYYMMDD").format("DD/MM/YYYY"));
			$(".Zebra_DatePicker").css({"z-index": 10000});
		},
		
		reload: function(numRow) {
			RICETTA.reload(numRow);
		},
		
		saveStampa: function(stampa_ricetta){
			RICETTA.saveStampa(stampa_ricetta);
		},
		
		setEsenzione: function(idxRow, esenzione) {
			var row = $("tr[idx="+idxRow+"]");
			var esenzioneBefore = row.attr("cod_esenzione");
			//row.find(".classEsenzione input").val(esenzione.descrizione).attr("elaborato",true);;	
			row.find(".classEsenzione input").val(esenzione.codice).attr("elaborato",true).attr("title",esenzione.descrizione);
			row.attr("cod_esenzione", esenzione.codice);
		},
		
		getObjSalvataggio: function() {
			//devo risettare l'iden accesso poichè la chiamata al db non è sincrona e la risposta non arriva in tempo nella funzione checkAccesso.
			objSalvataggio.iden_accesso = home.ASSISTITO.IDEN_ACCESSO;
			return objSalvataggio;
		},
		
		updEsenzioniObjSalvataggio: function( codEse, descrEse ) {
			var arAccertamenti = objSalvataggio.accertamento;
			for ( var i=0; i < arAccertamenti.length ; i++ ) {
				arAccertamenti[i].cod_esenzione = codEse;
				var esenz = new Object();
				esenz.descrizione = descrEse;
				esenz.codice = codEse;
				
				RICETTA_ACCERTAMENTI.setEsenzione(arAccertamenti[i].index, esenz);
//				arAccertamenti[i].descr_esenzione = descrEse; // o deve rimanere arAccertamenti[i].esenzione?
			}
		},
		
		getToolDb: function() 
		{
			if (!RICETTA_ACCERTAMENTI.toolDb)
				RICETTA_ACCERTAMENTI.toolDb = $.NS_DB.getTool({_logger: RICETTA_ACCERTAMENTI.logger});
			
			return RICETTA_ACCERTAMENTI.toolDb;
		},
		
		showInfoAccertamento: function( pIden, nota ) {
			
			RICETTA_ACCERTAMENTI.notaSelezionata = nota;
			
			RICETTA_ACCERTAMENTI.getToolDb()
			.select({
				id: "RICETTE.GET_INFO_ACCERTAMENTO",
				parameter: {
					iden : { v : pIden , t : 'N'}
				}
			})
			.done( function( resp ){
				home.NOTIFICA.info({
					message: resp.result[0].MESSAGE + '<br>'+ RICETTA_ACCERTAMENTI.notaSelezionata ,
					title: resp.result[0].TITLE,
					timeout: 10
				});
			});
		},
		
		getRow: function( idx )
		{
			return $("tr[idx="+idx+"]");
		},
		
		getRowSelected: function()
		{
			return RICETTA_ACCERTAMENTI.getRow( idx_sel );
		}
};

RICETTA.setEventNewRow=function(riga){
	
	riga.find(".classEsenzione input").on("mousedown",function(e){
		
		var tipoRicetta = RICETTA.getType(classRiga);
		if(tipoRicetta == 'RR_ACCERTAMENTI'){
			RICETTA_ACCERTAMENTI.setIDX($(this).parent().parent().attr("idx"), true);
		}else{					
			RICETTA_FARMACI.setIDX($(this).parent().parent().attr("idx"), true);
		}
		
		if(e.button == '2'){
			$esenzioni.test(e, this);
		}

	});
	
	
	/*controllo che non sia una prescrizione libera per inserire la ricerca sul doppio clic,sull'onblur e sul tasto invio. Altrimenti lo lascio libero*/
	if(!riga.hasClass("prescrLibera")){
	
		//doppio clic sull'input di inserimento dell'accertamento
		riga.find('.classAccertamento').find("input").on("dblclick",function(){
			home.NS_MMG.apri("MMG_SCELTA_ACCERTAMENTI&IDX="+$("#IDX").val()+"&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx") );
		});
		
		//onblur sull'inserimento dell'accertamento
		riga.find('.classAccertamento').find("input").on("blur",function(){
			$(this).val($(this).val().toUpperCase());
			
			if(jQuery(this).attr("elaborato") && jQuery(this).val() != ''){
				return;
			}
			
			if($(this).val() != ''){
				home.NS_MMG.apri("MMG_SCELTA_ACCERTAMENTI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx") );
				$(this).val("");
			}
		});
			
		//tasto invio sull'inserimento del farmaco
		riga.find('.classAccertamento').find("input").on(RICETTA.eventKeyUpBrowser,function(e){

			if(e.which == '13'){
		
				$(this).val($(this).val().toUpperCase());
				if($(this).val() != ''){
					home.NS_MMG.apri("MMG_SCELTA_ACCERTAMENTI&IDX="+$("#IDX").val()+"&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx") );
					$(this).val("");
				}
			}
		});
		
	}else{
		
		//metto il testo maiuscolo all'onblur del campo
		riga.find('.classAccertamento').find("input").on("blur",function(){
			$(this).val($(this).val().toUpperCase());
		});
	}
	
	//doppio clic sull'inserimento dell'esenzione
	riga.find('.classEsenzione').find("input").on("dblclick",function(){
		home.NS_MMG.apri("MMG_SCELTA_ESENZIONI&PROVENIENZA=ACCERTAMENTI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
		$(this).val("");
	});
			
	//keyup sull'inserimento dell'esenzione
	riga.find('.classEsenzione').find("input").on(RICETTA.eventKeyUpBrowser,function(e){
		if(e.which == '13'){
			home.NS_MMG.apri("MMG_SCELTA_ESENZIONI&PROVENIENZA=ACCERTAMENTI&CAMPO_VALUE="+$(this).val()+"&IDX_RIGA="+riga.attr("idx"));
			$(this).val("");
		}
	});
	
};


TABLE.replaceRows=function(arrayNew){
			
			$(classRiga).not("[tipoRiga=ins]").remove();
			
			$(arrayNew).each(function(a,b){
				RICETTA_ACCERTAMENTI.table.append(b['riga']);
			});
};
		
TABLE.collectRows=function(){
			
			var objRighe=new Array();
			
			$collectionRows = RICETTA_ACCERTAMENTI.table.find("tr."+classRiga).not("[tipoRiga=ins]"); 
			$collectionRows.each(function(a,b){
				
				var riga = home.NS_MMG_UTILITY.outerHTML(b);
				objRighe.push(riga);
			});
			
			//alert('fine di collectRows.\n Righe presenti nr: '+$collectionRows.length);
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
				case 'ACCERTAMENTO':
					
					$cRighe.each(function(a,b){
						var dataToOrder=$(b).find(".classAccertamento").html();
						//alert(dataToOrder);
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
			
			//alert('array: '+arr);
			return arr;
};

//oggetto valorizzato con i valori della riga selezionata
var riga = {
		cod_accertamento	: '',
		quantita			: '',
		nome_accertamento	: '',
		esenzione			: '',
		cod_esenzione		: '',
		risultato			: '',
		cod_risultato		: '',
		cronica				: '',
		periodica			: '',
		temporanea			: '',
		problema			: '',
		deleted				: '',
		da_stampare			: '',
		blocco				: '',
		urgenza				: '',
		diagnosi			: '',
		cod_situazione_clinica 	: '',
		forzatura			: '',
		importanza		 	: '',
		suggerita			: '',
		ripetibile			: ''
};


var objSalvataggio = {
		
		tipo_ricetta	: 'ACCERTAMENTI',
		iden_anag		: null,
		iden_utente		: null,
		iden_med_base	: null,
		iden_med_prescr : null,
		urgenza			: '',
		note			: '',
		accertamento	: new Array(),
		iden_accesso	: '',
		ricovero		: '',
		suggerita		: '',
		altro			: ''
};


//MENU CONTESTUALE ICONA OPTION (ingranaggio)
var menuOption={
		"menu":{
			"id": "MENU_RICETTA_ACCERTAMENTI",
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
					"link":  "",
					"enable": "S",
					"icon_class": "copia",
					"output": "traduzione.lblModuli",
					"separator": "false",
					"where": function(rec) {
						return $("tr[idx="+idx_sel+"]").attr("iden")!= '';
					},
					"list":[
					{
						"concealing": "true",
						"link":  function(){
							RICETTA_ACCERTAMENTI.context_menu.apriModulo("MMG_MODULO_RM_V2");
						},
						"enable": "S",
						"icon_class": "apri-datawharehouse",
						"where": function(rec){
							return  true;
						},
						"output": "traduzione.lblModuloRM",
						"separator": "false"
					},			         
					{
						"concealing": "true",
						"link":  function(){
							RICETTA_ACCERTAMENTI.context_menu.apriModulo("MMG_MODULO_TC_V2");
						},
						"enable": "S",
						"icon_class": "apri-datawharehouse",
						"where": function(rec){
							return  true;
						},
						"output": "traduzione.lblModuloTC",
						"separator": "false"
					},
					{
						"concealing": "true",
						"link":  function(){
							RICETTA_ACCERTAMENTI.context_menu.apriModulo("MMG_PRIORITA_CLINICA");
						},
						"enable": "S",
						"icon_class": "apri-datawharehouse",
						"where": function(rec){
							return  true;
						},
						"output": "traduzione.lblStampaModuloUrgenza",
						"separator": "false"
					}]
				},	
				
				{
					"concealing": "true",
					"link":  RICETTA_ACCERTAMENTI.context_menu.cancellaAccertamento,
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
					"link":  function(){
						RICETTA_ACCERTAMENTI.context_menu.allega_documento("ACCERTAMENTO");
					},
					"enable": "S",
					"icon_class": "documentipaziente",
					"where": function(rec){
						return $("tr[idx="+idx_sel+"]").attr("iden")!= '';
					},
					"output": "traduzione.lblAllegaDocumento",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  function(){
						RICETTA_ACCERTAMENTI.context_menu.inserisciNota("ACCERTAMENTO");
					},
					"enable": "S",
					"icon_class": "diariomedico",
					"where": function(rec){
						return  true;
					},
					"output": "traduzione.lblInserisciNota",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  RICETTA.associaProblema,
					"enable": "S",
					"icon_class": "esegui",
					"where": function(rec){
						return  $("tr[idx="+idx_sel+"]").attr("sito") == 'MMG' ;
					},
					"output": "traduzione.lblAssociaProblema",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  function() { RICETTA_ACCERTAMENTI.context_menu.mostraInPatSummary("S"); },
					"enable": "S",
					"icon_class": "esegui",
					"where": function(rec){
						return $("tr[idx="+idx_sel+"]").attr("pat_summary") == 'N' && $("tr[idx="+idx_sel+"]").attr("sito") == 'MMG' ;
					},
					"output": "traduzione.lblMostraInPatSummary",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  function() { RICETTA_ACCERTAMENTI.context_menu.mostraInPatSummary("N"); },
					"enable": "S",
					"icon_class": "elimina",
					"where": function(rec){
						return $("tr[idx="+idx_sel+"]").attr("pat_summary") == 'S' && $("tr[idx="+idx_sel+"]").attr("sito") == 'MMG' ;
					},
					"output": "traduzione.lblNascondiInPatSummary",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  function() { RICETTA_ACCERTAMENTI.context_menu.oscura("N");},
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
					"link":  function() { RICETTA_ACCERTAMENTI.context_menu.oscura("S");},
					"enable": "S",
					"icon_class": "appropriatezza",
					"where": function(rec){
						return $("tr[idx="+idx_sel+"]").attr("iden")!= '' && $("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && $("tr[idx="+idx_sel+"]").attr("sito") == 'MMG' ;
					},
					"output": "traduzione.lblOscura",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  function(riga) { RICETTA.context_menu.forzatura($("tr[idx="+idx_sel+"]"),'B'); },
					"enable": "S",
					"icon_class": "prenota",
					"where": function(rec){ 
											return ($("tr[idx="+idx_sel+"]").attr("forzatura") == '') ;
										},
					"output": "traduzione.lblForzaRicettaBianca",
					"separator": "false"
	 			},
	 			{
	 				"concealing": "true",
	 				"link":  function(riga) { RICETTA.context_menu.forzatura($("tr[idx="+idx_sel+"]"),''); },
	 				"enable": "S",
	 				"icon_class": "elimina",
	 				"where": function(rec){ return $("tr[idx="+idx_sel+"]").attr("forzatura")!= ''; },
	 				"output": "traduzione.lblRimuoviForzatura",
	 				"separator": "false"
	 			},
				{
					"concealing": "true",
					"link":  function(riga) { RICETTA_ACCERTAMENTI.context_menu.setImportanza($("tr[idx="+idx_sel+"]"),'1'); },
					"enable": "S",
					"icon_class": "urgenzadifferita",
					"where": function(rec){ return ($("tr[idx="+idx_sel+"]").attr("importanza") == '') ; },
					"output": "traduzione.lblSetImportanza1",
					"separator": "false"
	 			},
	 			{
	 				"concealing": "true",
	 				"link":  function(riga) { RICETTA_ACCERTAMENTI.context_menu.setImportanza($("tr[idx="+idx_sel+"]"),''); },
	 				"enable": "S",
	 				"icon_class": "elimina",
	 				"where": function(rec){ return $("tr[idx="+idx_sel+"]").attr("importanza")!= ''; },
	 				"output": "traduzione.lblUnsetImportanza",
	 				"separator": "false"
	 			},

	 			{
		        	 "concealing": "true",
		        	 "link": "",
		        	 "enable": "S",
		        	 "icon_class": "visualizza-n-archivio",
		        	 "output": "traduzione.MedicinaIniziativa",
		        	 "where": function(rec){
		        		 return (home.baseUser.TIPO_UTENTE == 'M' && $("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0)  && $("tr[idx="+idx_sel+"]").attr("sito") == 'MMG');
		        	 },
		        	 "separator": "false"
		        	,
		        	 "list": [
		      				
	        	          {
		      					"concealing": "true",
			   		        	 "link":  function() { RICETTA_ACCERTAMENTI.context_menu.setMI($("tr[idx="+idx_sel+"]").attr("iden"), ""); },
					        	 "enable": "S",
					        	 "icon_class": "visualizza-n-archivio",
					        	 "where": function(rec){
					        		 return ($("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0) && ($("tr[idx="+idx_sel+"]").attr("mi") != '' && $("tr[idx="+idx_sel+"]").attr("mi") != 'S')  && $("tr[idx="+idx_sel+"]").attr("sito") == 'MMG');
					        	 },
					        	 "output": "traduzione.MedicinaIniziativa",
					        	 "separator": "false"
				        	},
				        	{
					        	 "concealing": "true",
					        	 "link":  function() { RICETTA_ACCERTAMENTI.context_menu.removeMI($("tr[idx="+idx_sel+"]").attr("iden")); },
					        	 "enable": "S",
					        	 "icon_class": "visualizza-n-archivio",
					        	 "where": function(rec){
					        		 return ($("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0) && ($("tr[idx="+idx_sel+"]").attr("mi") != '' && $("tr[idx="+idx_sel+"]").attr("mi") != 'N')  && $("tr[idx="+idx_sel+"]").attr("sito") == 'MMG');
					        	 },
					        	 "output": "traduzione.removeMI",
					        	 "separator": "false"
					         }
	        	          /*,  
		        	        {
		      					"concealing": "true",
			   		        	 "link":  function() { RICETTA_ACCERTAMENTI.context_menu.setMI($("tr[idx="+idx_sel+"]").attr("iden"), "BPCO"); },
					        	 "enable": "S",
					        	 "icon_class": "visualizza-n-archivio",
					        	 "where": function(rec){
					        		 return ($("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0) && ($("tr[idx="+idx_sel+"]").attr("mi") != '' && $("tr[idx="+idx_sel+"]").attr("mi") != 'S'));
					        	 },
					        	 "output": "traduzione.BPCO",
					        	 "separator": "false"
				        	},
				        	{
				        		"concealing": "true",
					        	 "link":  function() { RICETTA_ACCERTAMENTI.context_menu.setMI($("tr[idx="+idx_sel+"]").attr("iden"), "SCOMPENSO_CARDIACO" ); },
					        	 "enable": "S",
					        	 "icon_class": "visualizza-n-archivio",
					        	 "where": function(rec){
					        		 return ($("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0) && ($("tr[idx="+idx_sel+"]").attr("mi") != '' && $("tr[idx="+idx_sel+"]").attr("mi") != 'S'));
					        	 },
					        	 "output": "traduzione.scompensoCardiaco",
					        	 "separator": "false"
					        },
					        {
					        	"concealing": "true",
					        	 "link":  function() { RICETTA_ACCERTAMENTI.context_menu.setMI($("tr[idx="+idx_sel+"]").attr("iden"), "DIABETE"); },
					        	 "enable": "S",
					        	 "icon_class": "visualizza-n-archivio",
					        	 "where": function(rec){
					        		 return ($("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0) && ($("tr[idx="+idx_sel+"]").attr("mi") != '' && $("tr[idx="+idx_sel+"]").attr("mi") != 'S'));
					        	 },
					        	 "output": "traduzione.diabete",
					        	 "separator": "false"
					        }*/
					        ]
					   
		         },
		         /*{
		        	 "concealing": "true",
		        	 "link":  function() { RICETTA_ACCERTAMENTI.context_menu.removeMI($("tr[idx="+idx_sel+"]").attr("iden")); },
		        	 "enable": "S",
		        	 "icon_class": "visualizza-n-archivio",
		        	 "where": function(rec){
		        		 return ($("tr[idx="+idx_sel+"]").attr("oscurato") != 'S' && (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0) && ($("tr[idx="+idx_sel+"]").attr("mi") != '' && $("tr[idx="+idx_sel+"]").attr("mi") != 'N'));
		        	 },
		        	 "output": "traduzione.removeMI",
		        	 "separator": "false"
		         }*/]
			},
			"title": "traduzione.lblMenu",
			"status": true
		}};

//MENU CONTESTUALE ICONA CRONO (clessidra)
var menuCrono ={
		"menu":{
			"id": "MENU_RICETTA_ACCERTAMENTI_CRONO",
			"structure": {
				"list": [
				{
					"concealing": "true",
					"link":  function(){
						RICETTA_ACCERTAMENTI.context_menu.setTemporanea($("tr[idx="+idx_sel+"]"));
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
						RICETTA_ACCERTAMENTI.context_menu.setPeriodica($("tr[idx="+idx_sel+"]"));
					},
					"enable": "S",
					"icon_class": "data",
					"where": function(rec){
						return  true;
					},
					"output": "traduzione.lblPeriodica",
					"separator": "false"
				}]
			},
			"title": "traduzione.lblMenu",
			"status": true
		}};

// menu contestuale per le funzioni non legate al singolo secord (es. cancella selezionate, associa probelma selezionate)
var menuCommons = {
		"menu" : {
			"id" : "MENU_COMMONS",
			"structure" : {
				"list" : [ {
					"concealing": "true",
					"link":  RICETTA_ACCERTAMENTI.context_menu.cancellaAccertamenti,
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
					"link":   function() { RICETTA.context_menu.cambiaDataMulti(RICETTA_ACCERTAMENTI.vType); },
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
					"link":  function() { RICETTA_ACCERTAMENTI.context_menu.mostraInPatSummaryMulti("S"); },
					"enable": "S",
					"icon_class": "esegui",
					"where": function(rec){
						return $("tr[iden]").not("[tiporiga='ins']").find(".tdAction input:checked").length > 0;
					},
					"output": "traduzione.lblMostraInPatSummaryMulti",
					"separator": "false"
				},
				{
					"concealing": "true",
					"link":  function() { RICETTA_ACCERTAMENTI.context_menu.mostraInPatSummaryMulti("N"); },
					"enable": "S",
					"icon_class": "elimina",
					"where": function(rec){
						return $("tr[iden]").not("[tiporiga='ins']").find(".tdAction input:checked").length > 0;
					},
					"output": "traduzione.lblNascondiInPatSummaryMulti",
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
		        	 "link":  "",
		        	 "enable": "S",
		        	 "icon_class": "visualizza-n-archivio",
		        	 "where": function(rec){
		        		 return (home.baseUser.TIPO_UTENTE == 'M' && home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0);
		        	 },
		        	 "list": [
							{
								"concealing": "true",
							   	 "link":  function() { RICETTA_ACCERTAMENTI.context_menu.setMIMulti(""); },
								 "enable": "S",
								 "icon_class": "visualizza-n-archivio",
								 "where": function(rec){
									 return (home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0);
								 },
								 "output": "traduzione.Generico",
								 "separator": "false"
							},
					        {
					        	 "concealing": "true",
					        	 "link":  function() { RICETTA_ACCERTAMENTI.context_menu.removeMIMulti(); },
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
			   		        	 "link":  function() { RICETTA_ACCERTAMENTI.context_menu.setMIMulti("BPCO"); },
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
					        	 "link":  function() { RICETTA_ACCERTAMENTI.context_menu.setMIMulti("SCOMPENSO_CARDIACO"); },
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
					        	 "link":  function() { RICETTA_ACCERTAMENTI.context_menu.setMIMulti("DIABETE"); },
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
		         }]
			},
			"title" : "traduzione.lblMenu",
			"status" : true
		}
};
