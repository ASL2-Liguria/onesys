$(document).ready(function(){

	RILEVAZIONI.init();

	NS_FENIX_SCHEDA.afterSave = NS_FENIX_SCHEDA.chiudi;
	NS_FENICX_SCHEDA.beforeSave = RILEVAZIONI.beforeSave;
});

var RILEVAZIONI = {

		init:function(){	

			RILEVAZIONI.setEvents();
			RILEVAZIONI.addIcons();

			home.$.NS_DB.getTool({_logger : home.logger}).select({
				id:'SDJ.Q_ALTEZZA_PAZIENTE',
				parameter:{
					iden_anag		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'}
				}
			}).done( function(resp) {
				
				if(typeof resp.result[0] != 'undefined'){					
					$("#txtAltezza").val(resp.result[0].ALTEZZA);
				}
			} );
			
			$("#txtBMI").attr("readonly","readonly").addClass("readonly");
		},

		setEvents:function(){
			
			$("#txtAltezza").blur(function(){
				if($(this).val() != ''){

					$(this).val($(this).val().replace(",","."));
					
					if(	!$.isNumeric($(this).val())){
						$(this).val("");
						$(this).focus();
						home.NOTIFICA.warning({
							message: 'Il valore inserito non \u00E8 numerico!',
							title: "Attenzione"
						});
						return;
					}else{
						$(this).val($(this).val().replace(".",","));
					}

					if($("#txtAltezza").val() != '' && $("#txtPeso").val() != ''){
						var BMI = top.NS_MMG_UTILITY.calcoloBMI( $(this).val(), $("#txtPeso").val() );
						$("#txtBMI").val(BMI);
					}
				}
			});

			$("#txtPeso").blur(function(){
				if($(this).val() != ''){
					
					$(this).val($(this).val().replace(",","."));

					if(	!$.isNumeric($(this).val())){
						$(this).val("");
						$(this).focus();
						home.NOTIFICA.warning({
							message: 'Il valore inserito non \u00E8 numerico!',
							title: "Attenzione"
						});
						return;
					}else{
						$(this).val($(this).val().replace(".",","));
					}

					if($("#txtAltezza").val() != '' && $("#txtPeso").val() != ''){
						var BMI = home.NS_MMG_UTILITY.calcoloBMI($("#txtAltezza").val(), $(this).val());
						$("#txtBMI").val(BMI);
					}

				}
			});

			$("#txtCirconfernza").blur(function(){
				if($(this).val() != ''){

					$(this).val($(this).val().replace(",","."));
					
					if(	!$.isNumeric($(this).val())){
						$(this).val("");
						$(this).focus();
						return alert('Il valore inserito non \u00E8 numerico!');
					}else{
						$(this).val($(this).val().replace(".",","));
					}
				}
			});

			$("#txtAttFisica").blur(function(){
				if($(this).val() != ''){
					$(this).val($(this).val().toUpperCase());
				}
			});
		},
		
		beforeSave:function(){
			
			//per sicurezza
			$("#txtPeso").val($("#txtPeso").val().replace(".",","));
			$("#txtCirconfernza").val($("#txtCirconfernza").val().replace(".",","));
			$("#txtAltezza").val($("#txtAltezza").val().replace(".",","));
			$("#txtBMI").val($("#txtBMI").val().replace(".",","));
			
		},

		addIcons: function(){

			var icon = $( document.createElement('i') ).addClass('icon-clock').on('click', function(event){ RILEVAZIONI.showLatest( event, $(this).closest('td') ); });

			$('.tdLbl').not('#lblData, #lblAttFisica, #lblAttFisicaDett').append( icon );
		},

		showLatest: function( event, element ){

			var formatParameters	= RILEVAZIONI.getFormatParameters( element.attr('id') );
			var parameters			= { 
				iden_anag 	: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'}, 
				tipo		: { v : RILEVAZIONI.getType( element ), t : 'V'}, 
				iden_utente : { v : home.baseUser.IDEN_PER, t : 'N'},   
			};

			/* NON FUNZIONA PIU'
			$('.headerTabs').Popup({

				'title' :			'Ultime 3 rilevazioni per: '+ traduzione[element.attr('id')],
				'content':			'',
				'width':			450,
				'arrowPosition':	RILEVAZIONI.getArrowPosition( element )

			});*/

			home.$.NS_DB.getTool({_logger : home.logger}).select({
				
				id:formatParameters.query,
				parameter:parameters,
			
			}).done( function(resp) {
				
				RILEVAZIONI.loadLast( resp.result, formatParameters.fieldName, formatParameters.descrField); 
			} );
		},

		getFormatParameters: function( id ){

			var query = 'MMG_DATI.ULTIME_RILEVAZIONI', fieldName = '';

			switch( id ){

				case 'lblAltezza':
					fieldName = 'ALTEZZA';
					descrField = 'ALTEZZA';
					break;
	
				case 'lblPeso':
					fieldName = 'PESO';
					descrField = 'PESO';
					break;
	
				case 'lblBMI':
					fieldName = 'BMI';
					descrField = 'BMI';
					break;
	
				case 'lblCirconferenza':
					fieldName = 'VALORE_1';
					descrField = 'Circonferenza Cranica';
					break;
	
				case 'lblMassima': 
					query = 'MMG_DATI.ULTIME_RILEVAZIONI_PRESSIONE';
					fieldName = 'PRESSIONE_MAX_MIN';
					descrField = 'PRESSIONE MAX';
					break;
	
				case 'lblMinima': 
					query = 'MMG_DATI.ULTIME_RILEVAZIONI_PRESSIONE';
					fieldName = 'PRESSIONE_MAX_MIN';
					descrField = 'PRESSIONE MIN';
					break;
	
				case 'lblTemperatura':
					fieldName = 'VALORE';
					descrField = 'TEMPERATURA';
					break;
	
				case 'lblFrequenza':
					query = 'MMG_DATI.ULTIME_RILEVAZIONI_CARDIO';
					fieldName = 'FREQUENZA';
					descrField = 'FREQUENZA';
					break;
	
				case 'lblRitmo': 
					query = 'MMG_DATI.ULTIME_RILEVAZIONI_CARDIO';
					fieldName = 'RITMO';
					descrField = 'RITMO';
					break;
	
				case 'lblAmpiezza':
					query = 'MMG_DATI.ULTIME_RILEVAZIONI_CARDIO';
					fieldName = 'AMPIEZZA';
					descrField = 'AMPIEZZA';
					break;	
	
				case 'lblSimmetria':
					query = 'MMG_DATI.ULTIME_RILEVAZIONI_CARDIO';
					fieldName = 'SIMMETRIA';
					descrField = 'SIMMETRIA';
					break;		
	
				case 'lblInr': 
					fieldName = 'VALORE_1';
					descrField = 'INR';
					break;
	
				case 'lblTao': 
					fieldName = 'VALORE_1';
					descrField = 'TAO';
					break;
	
				case 'lblGlicemia': 
					fieldName = 'VALORE_1';
					descrField = 'GLICEMIA';
					break;
	
				case 'lblSaturazione_Ossigeno': 
					fieldName = 'VALORE_1';
					descrField = 'SATURAZIONE OSSIGENO';
					break;
	
				default: 
					query = fieldName = '';
			}

			return {
			
				'fieldName' : fieldName, 
				'descrField' : descrField, 
				'query' : query 
			};
		},


		loadLast: function( response, fieldName, descrField ){
			
			//var popup 	= $('.popup').last();
			var li		= $(document.createElement('li')); 
			var ul		= $(document.createElement('ul'));//.appendTo( popup.find('.content') );
			var rilevazione;
			var vMessage=$("<div></div>");

			if( typeof response != 'undefined' && response.length > 0 ){

				for( var i = 0; i < response.length; i++ ){
					
					rilevazione = li.clone().html( 'Rilevazione del  '+ response[i]['DATA_RILEVAZIONE'] +'  : '+ response[i][fieldName] + '<br><br>' ); 
					rilevazione.appendTo( ul );
				}
				
			} else {

				rilevazione = li.clone().text( 'Non ci sono rilevazioni precedenti.' );
				rilevazione.appendTo( ul );
			}
			
			vMessage.html(ul)
			
			NOTIFICA.info({
				title:"STORICO "+descrField,
				message:vMessage
			})
		},

		getType: function( element ){

			var fieldset = element.closest('fieldset').attr('id');
			var id = element.attr('id'), type = '';

			if( fieldset == 'fldBMI' ){

				if( id == 'lblCirconferenza' ){
					type = 'CIRCONF_ADDOMINALE';
				}else{
					type = 'PESO_ALTEZZA';
				}
			}

			if( fieldset == 'fldTemperatura' ){
				type = 'TEMPERATURA';
			}

			if( fieldset == 'fldAltro' ){

				if( id == 'lblInr' ){					
					type = 'INR';
				}

				if( id == 'lblTao' ){					
					type = 'TAO';
				}

				if( id == 'lblGlicemia'){
					type = 'GLICEMIA';
				}
				
				if( id == 'lblSaturazione_Ossigeno' ){					
					type = 'SATURAZIONE OSSIGENO';
				}
			}
			return type;				
		},

		getArrowPosition: function( element ){

			var fieldset = element.closest('fieldset').attr('id');

			return fieldset == 'fldBMI' || fieldset == 'fldCardio' ? 'left' : 'right';
		}
};