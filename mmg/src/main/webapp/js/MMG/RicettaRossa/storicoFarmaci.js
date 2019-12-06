$(function(){
	WK_STORICO_FARMACI.init();
	WK_STORICO_FARMACI.setEvents();
});

//di default come data di inizio viene presa quella di un mese fa
var start = moment().subtract(30, 'days').format('YYYYMMDD');
// di default come data di fine presa quella odierna
var end = moment().format('YYYYMMDD');

var WK_STORICO_FARMACI = {
		
	objWk : null,
	
	graphStoricoPosologia : null,
	valori: {},

	init: function(){
//		$("#PrincipioAttivo").closest("tr").hide();
		WK_STORICO_FARMACI.initWk();
		$(".butStampaGrafico").hide();
		
		$('#h-txtDaData').val(moment().subtract(180, 'days').format('YYYYMMDD'));
        $('#txtDaData').val(moment().subtract(30, 'days').format('DD/MM/YYYY'));
	},
	
	setEvents: function(){
		
		$("#li-tabStoricoTerapia").on("click", function(){
			WK_STORICO_FARMACI.creaGrafico();
			$(".butStampaGrafico").show();
			$(".butStampaStorico").hide();
		});
		
		$("#li-tabMain").on("click", function(){
			$(".butStampaGrafico").hide();
			$(".butStampaStorico").show();
		});
		
		$(".butStampaGrafico").on("click", function(){
			WK_STORICO_FARMACI.stampaGrafico();
		});
		
		$(".butStampaStorico").on("click", function(){
			WK_STORICO_FARMACI.stampaStorico();
		});
		
		$("#butApplica").on("click", function(){
			WK_STORICO_FARMACI.creaGrafico();
		});
	},
	
	creaGrafico: function(){
		
		var days = 30;
		// di default come data di inizio viene presa quella di un mese fa
		start = $('#h-txtDaData').val() == ''? moment().subtract(30, 'days').format('YYYYMMDD') : $('#h-txtDaData').val();
		// di default come data di fine presa quella odierna
		end = $('#h-txtAData').val() == ''? moment().format('YYYYMMDD') : $('#h-txtAData').val();
		
		/*** gia' che ci siamo mettiamo un controllino sulle date ***/
		if(end - start < 0){
			
			home.NOTIFICA.warning({
                message		: "Intervallo di date non valido. Data fine terapia antecedente a quella di inizio.",
                title		: "Attenzione",
                timeout		: 8
			});
			return;
		} else {
			days = moment(end,"YYYYMMDD").diff(moment(start,"YYYYMMDD"),"days");
		}
		
		/*** Uso dati nella forma: ['2008-09-30',4], ['2008-10-30',6.5] ***/
		var series = this.getValori();
		
		start = start.substr(0,4) + '-' + start.substr(4,2) + '-' + start.substr(6,2);
		end = end.substr(0,4) + '-' + end.substr(4,2) + '-' + end.substr(6,2);
		 
		var options = { 
				title:"Grafico della terapia nell'arco temporale impostato", 
//		        axesDefaults: { labelRenderer: $.jqplot.CanvasAxisLabelRenderer },
		        axes: {
		        	xaxis : {
		        		tickOptions: {
		        			formatString:'%#d %b',
		        			angle: -75
		        		},
		        		renderer		: $.jqplot.DateAxisRenderer,
		        		labelRenderer	: $.jqplot.CanvasAxisLabelRenderer,
		                tickRenderer	: $.jqplot.CanvasAxisTickRenderer,
		        		label			: 't (giorni)',
		        		min				: start,
		        		max				: end
		        	},
		        	yaxis : {
		        		label		:'Posologia',
						min			:0,
		        		max			:10,
		        		numberTicks	:21
		        	},
		        	series:[{lineWidth:4, markerOptions:{style:'square'}}]
		        },
		        shadowAngle:10
		};
		$("#divStoricoPosologia").empty();

		WK_STORICO_FARMACI.graphStoricoPosologia = $.jqplot("divStoricoPosologia", [series], options);
	},
	
	getValori : function () 
	{
		var arValori = [];
		var arCoord = [];
		
		dwr.engine.setAsync(false);
		toolKitDB.getResultDatasource('GRAFICI.POSOLOGIA',"MMG_DATI",
				{ 
					iden_anag		: home.ASSISTITO.IDEN_ANAG, 
					iden_utente		: home.baseUser.IDEN_PER, 
					iden_med		: home.ASSISTITO.IDEN_MED_PRESCR, 
					cod_farmaco		: $("#COD_FARMACO").val(), 
					da_data 		: start, 
					a_data			: end
				},
				null,function(resp){
			arValori = resp;
		});
		if (arValori.length==0) {
			arValori.push({"DATA_GRAPH": -1, "QUANTITA_GIORN" :-1});
		}
		dwr.engine.setAsync(true);
		
		for (var i = 0; i<arValori.length; i++) {
			arCoord.push([arValori[i]["DATA_GRAPH"],arValori[i]["QUANTITA_GIORN"]]);
		}
		
		//alert(arCoord);
		
		return arCoord;
	},
	
	initWk: function(){
		$("#divWk").height( $('.contentTabs').innerHeight() - 40 ).width("98%");
	   
	    this.objWk = new WK({
            "id"    : 'STORICO_FARMACI',
            "aBind" : ["iden_anag","iden_utente","cod_farmaco"],
            "aVal"  : [home.ASSISTITO.IDEN_ANAG, home.baseUser.IDEN_PER,$("#COD_FARMACO").val()]
	    });
	    this.objWk.loadWk();			
	},
	
	addResizers: function(divContainer, plot) {
		var 
			iconResizeFull	= $( document.createElement('i') ).addClass('icon-resize-full-1').attr('title', 'Espandi').on("click",
				function() { 
					$(this).hide();
					divContainer.siblings().hide();
					divContainer.find(".icon-resize-small-1").show();
					divContainer.width("98%").height($(".contentTabs").height() - 15);
					plot.replot({resetAxes:false});
					
				}),
		
			iconResizeSmall	= $( document.createElement('i') ).addClass('icon-resize-small-1').attr('title', 'Restringi').on("click",
				function() { 
					$(this).hide();
					divContainer.siblings().show();
					divContainer.find(".icon-resize-full-1").show();
					var pWidth = "49%";//Math.floor( 100 / ( divContainer.siblings().length / 2 + 1 ) ) - 1;  
					divContainer.width(pWidth+"%").height("");
					plot.replot({resetAxes:false});
				});
		divContainer.prepend(iconResizeFull,iconResizeSmall);
	},
	
	cancella: function(row) {
		if (home.MMG_CHECK.canDelete(row[0].IDEN_UTENTE, row[0].IDEN_MEDICO)) {
			var iden= row[0].IDEN;
			home.NS_MMG.confirm(traduzione.lblDialogCancella, function() {
				NS_LOADING.showLoading();
				var promise = home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
					id:'RR_CANCELLA',
					parameter: {
						v_tipo		:{ v : 'FARMACI', t : 'V'},
						v_ar_iden	:{ v : [iden], t :'A'},
						c_errori	:{ t : 'C' , d: 'O'},
						n_iden_ute	:{ v : home.baseUser.IDEN_PER, t : 'N'},
						v_username	:{ v : home.baseUser.USERNAME, t : 'V'},
						v_note		:{ v : '', t : 'V'}
					}
				});
				promise.done( function(response) {
					if (LIB.isValid(response['c_errori']) && response['c_errori'] != "") {
						home.NOTIFICA.error({
							message: "Impossibile annullare la ricetta: " + response['c_errori'],
							title: "Attenzione"
						});
					}
					home.RICETTA_FARMACI.reload();
					WK_STORICO_FARMACI.objWk.refresh();
				});
				promise.fail(NS_LOADING.hideLoading);
			});
		}
	},
	
	setInfo: function(data){

		var deleteIcon  = $(document.createElement('i')).addClass('icon-cancel-squared');
		deleteIcon.attr('title', 'Elimina');
		deleteIcon.on('click', function(){
			WK_STORICO_FARMACI.cancella([{
				IDEN: data.IDEN,
				UTE_INS: data.UTE_INS,
				IDEN_MED: data.IDEN_MED
			}]);
		});
		
		var div = $('<div>').append( deleteIcon );
		if (data.OSCURATO == "S") {
			var oscurato = $(document.createElement('i')).addClass('icon-minus-circled');
			oscurato.attr("title", "Farmaco oscurato");
			oscurato.on('click', function(){
				WK_STORICO_FARMACI.disOscura([{
					IDEN: data.IDEN,
					COD_FARMACO: data.COD_FARMACO,
				}]);
			});
			div.append(oscurato);
		}
		return div;
	},
	
	stampaStorico: function(){
		
		var prompts = { pIdenAnag: home.ASSISTITO.IDEN_ANAG, pIdenPer: $("#IDEN_MED_PRESCR").val(), pCodFarmaco: $("#COD_FARMACO").val() };
		
		home.NS_PRINT.print({
			path_report		: "STORICO_FARMACI.RPT" + "&t=" + new Date().getTime(),
			prompts			: prompts,
			show			: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
			output			: "pdf"
		});
	},
	
	stampaGrafico: function(){
		
		var strPage = "<html><head><style>img { margin: 15px; width: 90%;}</style></head><body><center><h2>"+home.ASSISTITO.NOME_COMPLETO+"</h2></center>";
		strPage +="<center><h1>Posologia del farmaco " + $("#DESCR_FARMACO").val().replace("*", " ") +"</h1></center>";
		strPage +="<center><h1>dal " + $('#txtDaData').val() + " al " + $('#txtAData').val() + "</h1></center>";
		strPage +="<center><div id='grafico'></div></center></body></html>";
		
		var newWindow = window.open();
		newWindow.document.write(strPage);
		newWindow.document.close();
		
		//var graphPosologia = $('<img/>').attr('src', $('#divStoricoPosologia').jqplotToImageStr({}));
		$("#grafico", newWindow.document).append("<img src='" + $('#divStoricoPosologia').jqplotToImageStr({}) + "' />");
	},
	
	whereOscura: function(data) {
		return typeof data[0] != "undefined" && data[0].IDEN != '' && data[0].OSCURATO != 'S' && data[0].SITO == 'MMG';
	},
	
	whereDisOscura: function(data) {
		return typeof data[0] != "undefined" && data[0].IDEN != '' && data[0].OSCURATO != 'N' && data[0].SITO == 'MMG';
	},
	
	oscuraBackend: function(data, flag_oscuramento) {
		var semaforo_done = $.Deferred();
		home.RICETTA_FARMACI.context_menu.oscuraBackend(flag_oscuramento, {
			iden_tabella: data[0].IDEN,
			iden_multi: data[0].COD_FARMACO,
			semaforo_done: semaforo_done
		}, {
			singola: function(dati_elemento) {
				home.RICETTA_FARMACI.reload();
				dati_elemento.semaforo_done.resolve();
			},
			multi: function(dati_elemento) {
				home.RICETTA_FARMACI.reload();
				dati_elemento.semaforo_done.resolve();
			}
		});
		$.when(semaforo_done).then(function(){
			WK_STORICO_FARMACI.objWk.refresh();
		});
	},
	
	oscura: function(data) {
		WK_STORICO_FARMACI.oscuraBackend(data, "S");
	},
	
	disOscura: function(data) {
		WK_STORICO_FARMACI.oscuraBackend(data, "N");
	}
};
