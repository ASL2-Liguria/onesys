$(document).ready(function(){
	REPORT_VACCINI.init();
	REPORT_VACCINI.setEvents();
	
});

var REPORT_VACCINI = {
		
			init:function(){
				
				home.REPORT_VACCINI = this;
//				$("#radSesso_U").hide();
				
				var vDaData =  $("#h-txtDaData").val() != "" ? $('#h-txtDaData').val() : moment().subtract('days', 180).format('YYYYMMDD');
				$("#txtDaData").val($("#h-txtDaData").val() != "" ? $('#txtDaData').val() : moment().subtract('days', 180).format('DD/MM/YYYY'));
				$("#h-txtDaData").val($("#h-txtDaData").val() != "" ? $('#h-txtDaData').val() : moment().subtract('days', 180).format('YYYYMMDD'));
			},
			
			setEvents:function(){
				
				$("#butEseguiConteggio").on("click", function() {
					home.NS_LOADING.showLoading();
					REPORT_VACCINI.eseguiConteggio();
				});
			},
			
			eseguiConteggio: function(){
				
				var query = '';
				var periodo = '';
				var ses = '';
				var q_ses = '';
				
				if($("#h-radUM").val() == 'A'){
					periodo = "anni";
					query = 'SDJ.Q_REPORT_VACCINI_ANNI';
				}else{
					periodo = "mesi";
					query = 'SDJ.Q_REPORT_VACCINI_MESI';
				}
				
				if ($("#h-radSesso").val() == 'M'){
					q_ses = 'M';
					ses = 'di sesso maschile';
				}
				
				if ($("#h-radSesso").val() == 'F'){
					q_ses = 'F';
					ses = 'di sesso femminile';
				}
				
				
				var vDaData =  $("#h-txtDaData").val() != "" ? $('#h-txtDaData').val() : moment().subtract('days', 180).format('YYYYMMDD');
				$("#txtDaData").val($("#h-txtDaData").val() != "" ? $('#txtDaData').val() : moment().subtract('days', 180).format('DD/MM/YYYY'));
				$("#h-txtDaData").val($("#h-txtDaData").val() != "" ? $('#h-txtDaData').val() : moment().subtract('days', 180).format('YYYYMMDD'));
				
				var param = {
					
					sesso			: { v : '%' + q_ses, t : 'V'},
					da_data			: { v : $("#h-txtDaData").val(), t : 'V'},
					a_data			: { v : $("#h-txtAData").val(), t : 'V'},
					tipo_vaccino	: { v : $("#h-radTipoVaccino").val(), t : 'V'},
					da				: { v : $("#txtDataInizio").val(), t : 'N'},
					a				: { v : $("#txtDataFine").val(), t : 'N'},
					iden_utente		: { v : $("#UTE_INS").val(), t : 'N'}
				};
				
				home.$.NS_DB.getTool({_logger : home.logger}).select({
	            id: query,
	            parameter: param

				}).done( function(resp) {
					//alert(resp.result[0].REPORT);
					/*var str = "Risultano " + resp.result[0].REPORT + " vaccini di tipo " + $("#h-radTipoVaccino").val() +
							" somministrati a pazienti " + ses + " con et&agrave; compresa fra i " + $("#txtDataInizio").val() +
							" e i " + $("#txtDataFine").val() + " " + periodo + " al momento della vaccinazione.";*/
					
					var a_capo = "</br>";
					var a_capo_spazio = "</br></br>";
					var tipo_vaccino = "<a style='color:blue; font-weight:bold;'>" + $("#radTipoVaccino").find(".RBpulsSel").attr("data-descr") + "</a>";
					var anni_da = "<a style='color:blue; font-weight:bold;'>" + $("#txtDataInizio").val() + "</a>";
					var anni_a = "<a style='color:blue; font-weight:bold;'>" + $("#txtDataFine").val() + "</a>";
					var periodo_da = "<a style='color:blue; font-weight:bold;'>" + $("#txtDaData").val() + "</a>";
					var periodo_a = "<a style='color:blue; font-weight:bold;'>" +  $("#txtAData").val() + "</a>";
					var sesso = "<a style='color:blue; font-weight:bold;'>" + ses + "</a>";
					
					var str = "<a style='font-size:30px; text-align:center; color:blue;'>"+resp.result[0].REPORT+ "</a>" +
								a_capo_spazio +
								"Vaccini di tipo " + tipo_vaccino + "</strong>" +
								a_capo +
								" somministrati a pazienti " + sesso + 
								a_capo +
								" con et&agrave; compresa fra i " +anni_da +
								" e i " + anni_a + " " + periodo + " al momento della vaccinazione."+
								a_capo_spazio +
								"Periodo preso in considerazione:"+
								a_capo +
								"dal  "+ periodo_da + "  al  " + periodo_a;
								
					
					$("#lblQueryResult").html(str);
					//alert(str)
					var vContent = $("<label>",{'id':'txtRisultato', 'html': str}).css({width: 450, height: 60, "text-align": "center"});//-->meglio textarea o label?
					
					$.dialog( vContent, {

						'id'				:'dialogWk',
						'title'				:"Risultato",
						'ESCandClose'		: true,
						'created'			: function(){ $('.dialog').focus(); },
						'showBtnClose'		:false,
						'width'				: 500,
						buttons : 
							[{
								 "label"  :  "Chiudi",
								 "action" :   function(){$.dialog.hide();}
							}],
					});
				} );

				home.NS_LOADING.hideLoading();
			}
};