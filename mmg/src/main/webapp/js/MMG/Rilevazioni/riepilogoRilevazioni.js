$(document).ready(function(){

	RIEPILOGO_RILEVAZIONI.init();
	RIEPILOGO_RILEVAZIONI.setEvents();
	NS_FENIX_SCHEDA.afterSave = NS_FENIX_SCHEDA.chiudi;

});


var RIEPILOGO_RILEVAZIONI = {

		objWk			: null,
		active			: null,

		init: function(){	

			$("#txtAData, #txtDaData").parents().attr("colSpan", "8");

			var h = $('.contentTabs').innerHeight() - $('#fldRicerca').outerHeight(true) -10;
			$("#ElencoWork").height( h );
		},

		setEvents: function(){

			$(".butInserisci").hide();

			$("#but_BMI, #but_Cuore, #but_Pressione, #but_Temperatura, #but_Alcol, #but_Fumo, #but_Altro").on("click",function(){

				var idRilevazione = $(this).attr('id').split("_")[1];

				var da_data = $("#txtDaData").val() != "" ? $("#h-txtDaData").val() : '19000101';
				var a_data = $("#h-txtAData").val();

				RIEPILOGO_RILEVAZIONI.apriWk( idRilevazione, da_data, a_data );

			});

			$(".butGrafico").on("click", RIEPILOGO_RILEVAZIONI.showGraph );
		},

		apriWk: function(id_Riv, data_start, data_end){

			switch (id_Riv){
			case 'BMI':
				RIEPILOGO_RILEVAZIONI.caricaWk("RILEVAZIONI_BMI",data_start, data_end);
				break;
			case 'Cuore':
				RIEPILOGO_RILEVAZIONI.caricaWk("RILEVAZIONI_CARDIO",data_start, data_end);
				break;
			case 'Pressione':
				RIEPILOGO_RILEVAZIONI.caricaWk("RILEVAZIONI_PRESSIONE",data_start, data_end);
				break;
			case 'Temperatura':
				RIEPILOGO_RILEVAZIONI.caricaWk("RILEVAZIONI_TEMPERATURA",data_start, data_end);
				break;
			case 'Fumo':
				RIEPILOGO_RILEVAZIONI.caricaWk("RILEVAZIONI_FUMO",data_start, data_end);
				break;
			case 'Alcol':
				RIEPILOGO_RILEVAZIONI.caricaWk("RILEVAZIONI_ALCOL",data_start, data_end);
				break;
			case 'Altro':
				RIEPILOGO_RILEVAZIONI.caricaWk("RILEVAZIONI_ALTRO",data_start, data_end);
				break;
			}
		},

		caricaWk: function(pTipo, data_start, data_end) {

			this.objWk = new WK({
				"id"   		: pTipo,
				"aBind" 	: ["iden_anag", "iden_med","da_data", "a_data"],
				"aVal"  	: [home.ASSISTITO.IDEN_ANAG, home.baseUser.IDEN_PER, data_start, data_end],
				"container" : 'ElencoWork'
			});
			this.objWk.loadWk();

		},

		cancellaRilevazione: function(riga, tipoRilevazione) {
			if (home.MMG_CHECK.canDelete(riga[0].UTE_INS, riga[0].IDEN_MED)) {
				if(riga[0].IDEN_VISITA != null){
					home.NOTIFICA.warning({

						message: "La rilevazione selezionata risulta legata ad una visita. Cancellare la relativa visita se si desidera eliminare la rilevazione selezionata.",
						title: "Attenzione",
						timeout: 10
					});				
					return;
				}else{
					home.NS_MMG.confirm("Cancellare la rilevazione selezionata?", function(){

						toolKitDB.executeProcedureDatasource('SP_DEL_RILEVAZIONI', 'MMG_DATI', RIEPILOGO_RILEVAZIONI.getRilevazione(riga, tipoRilevazione), function() {
							RIEPILOGO_RILEVAZIONI.objWk.refresh();
						});
					});
				}
			}
		},

		getRilevazione: function(row, tipoRilevazione){

			var ritorno = {};
			ritorno.pIden = row[0].IDEN;

			switch (tipoRilevazione){
			case 'BMI':
				ritorno.pTipo = row[0].TIPO_RILEVAZIONE;
				break;
			case 'CARDIO':
				ritorno.pTipo = "RILEVAZIONE_CARDIO";
				break;
			case 'PRESSIONE':
				ritorno.pTipo = "RILEVAZIONE_PRESSIONE";
				break;
			case 'FUMO':
				ritorno.pTipo = "RILEVAZIONE_FUMO";
				break;
			case 'ALCOL':
				ritorno.pTipo = "RILEVAZIONE_ALCOL";
				break;
			}

			return ritorno;
		},

		showGraph: function() {

			var dialog = $.dialog(
					"<div>" +
					"	<label>Rilevazione: </label>" +
					"	<select id='cmbCurva'>" +
					"		<option value=''></option>" +
					"		<option value='PESO'>Peso [Kg]</option>" +
					"		<option value='ALTEZZA'>Altezza [cm]</option>" +
					"		<option value='BMI'>B.M.I.</option>" +
					"		<option value='PRESSIONE_MIN$PRESSIONE_MAX'>Pressione Min/Max</option>" +
					"		<option value='TAO$INR'>TAO e INR</option>" +
					"	</select>" +
					"	<label style='float:right'>Filtro date: "+ 
								(( $("#txtDaData").val()=='' ) ? "n.d." : $("#txtDaData").val()) +" - "+ 
								(( $("#txtAData").val()=='' ) ? "n.d." : $("#txtAData").val()) +"</label>" +
					"</div>" +
					"<div id='graphContainer' style='height:95%; width:98%;'></div>",
					{
				'id' 				: "divGraph",
				'title' 			: "Grafici Rilevazioni",
				'ESCandClose'		: true,
				'created'			: function(){ $('.dialog').focus(); },
				'width' 			: 800,
				'height'			: $("#riepilogoRilevazioni").height() - 150,
				'modal' 			: true,
				'buttons' 			: [{
					label : traduzione.butStampa,
					action : function(ctx) {
						RIEPILOGO_RILEVAZIONI.printGraph();
					}
				}, {
					label : traduzione.butChiudi,
					action : function(ctx) {
						dialog.close();
					}
				}]
			});
			
			$("#cmbCurva").on("change", function () {
				
				var opt = $(this).find("option:selected");
				if (opt.val()=='')
					return;
				
				RIEPILOGO_RILEVAZIONI.plot( opt.val().split("$"), opt.text() );
			});
		},

		plot: function( pCurve, pTitle ) {

			var options = { 
					title: "<label style='color:black'>"+ pTitle +"</label>", 
					seriesColors: ["black", "red"],
					series: [],
					axesDefaults: {
						labelRenderer: $.jqplot.CanvasAxisLabelRenderer
					},
					axes: {
						xaxis : {
							renderer:$.jqplot.DateAxisRenderer,
							tickOptions: { formatString: '%d/%m/%Y' }
						},
						yaxis : {
							autoscale: true, min:0 
						}
					},
			        legend: { show: (pCurve.length > 1), location: 'a' }
			};
			
			var series = [];
			for (var i = 0; i < pCurve.length; i++){
				series.push(RIEPILOGO_RILEVAZIONI.getValori("GRAFICI."+pCurve[i]));
				options.series.push({label:pCurve[i], pointLabels: { show:true }});
			}
			
			$('#graphContainer').empty();
			$.jqplot("graphContainer",  series, options);

		},

		getValori : function ( pTipo ) 	{
			var arValori = [];
			var arCoord = [];
			var da_data = $("#txtDaData").val() != "" ? $("#h-txtDaData").val() : '19000101';
			var a_data = $("#h-txtAData").val();

			dwr.engine.setAsync(false);
			toolKitDB.getResultDatasource(pTipo,"MMG_DATI",{iden_anag: home.ASSISTITO.IDEN_ANAG,iden_med: home.baseUser.IDEN_PER, data_ini : da_data, data_fine: a_data },null,function(resp){
				arValori = resp;
			});
			if (arValori.length==0) 
			{
				arValori.push({"DATA": a_data, "VALORE" : 0});
			}
			dwr.engine.setAsync(true);

			for (var i = 0; i<arValori.length; i++)
			{
				arCoord.push([new Date(Date.UTC(
						arValori[i]["DATA"].substring(0,4),
						arValori[i]["DATA"].substring(4,6) - 1,
						arValori[i]["DATA"].substring(6,8))
				),
				Number(arValori[i]["VALORE"])]);	
			}
			return arCoord;

		},

		printGraph: function() {
			var newWindow = window.open();
			newWindow.document.write(
					"<html>" +
					"	<head>" +
					"		<style>img { margin: 25px 10px 10px 0px; width: 95%;}</style>" +
					"	</head>" +
					"	<body>" +
					"		<center><h2>"+home.ASSISTITO.NOME_COMPLETO+"</h2></center>" +
					"		<div id='grafici'></div>" +
					"	</body>" +
					"</html>");
			newWindow.document.close();

			//var graph = $('<img/>').attr('src', $('#graphContainer').jqplotToImageStr({}));
			$("#grafici", newWindow.document).append("<img src='" + $('#graphContainer').jqplotToImageStr({}) + "' />");
		}

};