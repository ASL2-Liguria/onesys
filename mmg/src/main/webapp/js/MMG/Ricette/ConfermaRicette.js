$(document).ready(function(){
	
	CONFERMA_RICETTE.init();
	CONFERMA_RICETTE.setEvents();
	CONFERMA_RICETTE.setLayout();
});

var CONFERMA_RICETTE = {
		
		provenienza:"CARTELLA_OUT",
		
		init: function(){
			
			WORKLIST_RICETTE.refreshWk = this.loadWk; //Potrebbe essere condiviso con l'altro elenco ricette
			
			//controllo i parametri in entrata
			CONFERMA_RICETTE.checkParameters();
			
			CONFERMA_RICETTE.loadWk();
		},
		
		setEvents: function(){
			
			$('#butApplica').on( 'click', CONFERMA_RICETTE.loadWk );
			$('#h-radVisualizza').on( 'change', CONFERMA_RICETTE.loadWk );
			
			$('.butSelezionaTutto').on( 'click', CONFERMA_RICETTE.selectAll );
			$('.butDeselezionaTutto').on( 'click', CONFERMA_RICETTE.deselectAll );
			
			$('.butConfermaRicette').on( 'click', CONFERMA_RICETTE.conferma );
			
			$("body").on("keyup",function(e) {
				
				if(e.keyCode == 13) {
					CONFERMA_RICETTE.loadWk();
				}
			});
		},
		
		setLayout:function(){
			
			$("#radDemaSN").parent().attr("colSpan","4").attr("margin-top","50px");
			$("#radVisualizza").parent().attr("colSpan","4");
			$("#radStampate").parent().attr("colSpan","4");
			$("#radVisualizza").parent().attr("colSpan","4");
		},
		
		checkParameters:function(){
			if(typeof $("#PARAMETRI").val() != 'undefined'){
				var vJson=$.parseJSON( $("#PARAMETRI").val());
				CONFERMA_RICETTE.provenienza = 'CARTELLA_IN';
				CONFERMA_RICETTE.selectValueRadio(CONFERMA_RICETTE.provenienza, vJson);
			} else {
				CONFERMA_RICETTE.selectValueRadio(CONFERMA_RICETTE.provenienza, vJson);
			}
		},
		
		loadInfo:function(){
			
			var stato		= '';
			var	data_inizio	= moment($('#h-txtDataInizio').val(), "YYYYMMDD").format("DD/MM/YYYY");
			var	data_fine	= moment($('#h-txtDataFine').val(), "YYYYMMDD").format("DD/MM/YYYY");
			var demasn		= '';
			var stampato	= '';
			
			var testo = 'Ricerca effettuata per ricette ';
			var medico = ' prescritte da ' + $("#cmbMedico option:selected").text() + " ";
			var testo_finale = ' dal ' + data_inizio + ' al ' + data_fine;
			
			switch($('#radVisualizza').data('RadioBox').val()){
				
				case 'I':
					stato = 'DA CONFERMARE, ';
					break;
					
				case 'C,S':
					stato = 'CONFERMATE, ';
					break;
					
				case 'I,C,S':
				default: 
					stato = 'DA CONFERMARE E CONFERMATE, ';
					break;
					
			}
			
			switch($('#radDemaSN').data('RadioBox').val()){
				
				case 'S,D':
					demasn = 'DEMATERIALIZZATE, ';
					break;
					
				case 'N':
					demasn = 'RICETTE ROSSE, ';
					break;
					
				case 'S,N,D':
				default: 
					demasn = '';
					break;
			}
			
			switch($('#radStampate').data('RadioBox').val()){
				
				case 'S':
					stampato = 'STAMPATE, ';
					break;
					
				case 'N':
					stampato = 'DA STAMPARE, ';
					break;
					
				case 'S,N':
				default: 
					stampato = '';
					break;
			}
			
			
			var msg = testo + medico + demasn + stato + stampato + testo_finale;
			
			$("#divInfoSearch").html(msg);
		},
		
		loadWk: function(){
			
			var stato		= $('#radVisualizza').data('RadioBox').val(); 
			var	data_inizio	= $('#h-txtDataInizio').val();
			var	data_fine	= $('#h-txtDataFine').val();
			var demasn		= $('#radDemaSN').data('RadioBox').val();
			var stampato	= $('#radStampate').data('RadioBox').val();
			var iden_med	= $("#cmbMedico").val();
			if (!LIB.isValid(iden_med)) {
				iden_med = home.CARTELLA.getMedPrescr();
			}
			var  parameters 	=  {
				'id':			'CONFERMA_RICETTE',
				'container':	'divWk',
				'aBind':		[ 'iden_med', 'stato', 'data_inizio', 'data_fine', 'demasn', 'stampato' ],
				'aVal':			[ iden_med, stato, data_inizio, data_fine, demasn, stampato ]
			};
			
			if( !LIB.isValid( CONFERMA_RICETTE.wk ) ){
				
				var height = $('.contentTabs').innerHeight() - $('#fldFiltri').outerHeight(true) - 45;
				
				$('#divWk').height( height );
				
				CONFERMA_RICETTE.wk = new WK( parameters );
				CONFERMA_RICETTE.wk.loadWk();
				
			} else {
				
				CONFERMA_RICETTE.wk.filter( parameters );
			}
			
			CONFERMA_RICETTE.loadInfo();
		},
		
		selectValueRadio:function(pProvenienza, pJson){
			
			/* DEBUG *********************************
			
			//ESEMPIO DI JSON CHE DEVE ESSERE PASSATO IN ENTRATA
			pJson = {
				dematerializzata 	: 'N',
				daConfermare		: 'N',
				daStampare			: 'N',
				dataInizio			: '19000101',
				dataFine			: '19000202'
			}
			pProvenienza = 'CARTELLA_IN';
			
			 *****************************************/

			if(pProvenienza == 'CARTELLA_OUT'){
				
				/* Seleziono alcune voci di default */
				$("#radDemaSN").data("RadioBox").selectByValue("S,N,D"); 		// ENTRAMBE
				if (home.MMG_CHECK.isMedico()) {
					$("#radVisualizza").data("RadioBox").selectByValue("I"); 	// DA CONFERMARE
					$("#radStampate").data("RadioBox").selectByValue("S,N"); 	// ENTRAMBE
				} else {
					$("#radVisualizza").data("RadioBox").selectByValue("C,S"); 	// CONFERMATE
					$("#radStampate").data("RadioBox").selectByValue("N"); 	// DA STAMPARE
				}
			}else{
				var demat = (pJson.Dematerializzate == "S") ? "S,D" : "N";
				$("#radDemaSN").data("RadioBox").selectByValue(demat);
				var conf = (pJson.Confermate == "S") ? "C,S" : "N";
				$("#radVisualizza").data("RadioBox").selectByValue(conf);
				$("#radStampate").data("RadioBox").selectByValue(pJson.Stampate);
				$('#h-txtDataInizio').val(pJson.dataInizio);
				$('#h-txtDataFine').val(pJson.dataFine);
				$('#txtDataInizio').val(moment(pJson.dataInizio, "YYYYMMDD").format("DD/MM/YYYY"));
				$('#txtDataFine').val(moment(pJson.dataFine, "YYYYMMDD").format("DD/MM/YYYY"));
			}
			
			$("#cmbMedico").val(home.CARTELLA.getMedPrescr());
		},
		
		selectAll: function(){
			
			$('.clsWkScroll','#divWk').find('tr').each(
				function(){
					
					if(! $(this).hasClass('rowSel') )
						$(this).trigger('click');
				}
			);
		},
		
		deselectAll: function(){
			
			$('.clsWkScroll','#divWk').find('tr').each(
				function(){
					
					if( $(this).hasClass('rowSel') )
						$(this).trigger('click');
				}
			);
		}
};
