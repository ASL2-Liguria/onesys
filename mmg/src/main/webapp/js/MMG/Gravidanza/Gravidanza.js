$(document).ready(function()
{
	
	if( GRAVIDANZA.init() )
	{	
	
		GRAVIDANZA.setEvents();
		
//		if ($('#IDEN').length > 0 ) 
//		{
			$('#li-tabInserimentoGravidanza').trigger('click');
//		} 
//		else 
//		{
//			GRAVIDANZA.loadWkGravidanze();
//			$('#li-tabInserimentoGravidanza').hide();
//		} 
		
		NS_FENIX_SCHEDA.registra = GRAVIDANZA.registra;
	
	}
	
});

var GRAVIDANZA = 
{
		
		init: function()
		{
			
			home.GRAVIDANZA = this;
			
			if( home.ASSISTITO.SESSO != 'F' )
			{
			
				home.NOTIFICA.warning({  'message' : traduzione.lblErroreSesso });
				$('.butChiudi').trigger('click');
				
			}
			
			return home.ASSISTITO.SESSO == 'F';
			
		},
		
		setEvents: function()
		{	
			
			$('#cmbEsenzioneGravidanza').on('change', GRAVIDANZA.loadWkPrestazioni );
			
			$('#txtSettimanaGravidanza').on('blur', function()
				{ 
					
					var settimana = $(this).val();
				
					if( ! isNaN( settimana ) )
					{
						
						settimana.length == 1 ? $(this).val( '0' +  $(this).val() ) : null;
						
						$('#cmbEsenzioneGravidanza').val( 'M' + $(this).val() ).trigger('change');
						
					}	
							
				});
			
			$('#h-radGravidanzaARischio').on('change', function()
			{
				
				var gravidanzaARischio = $('#radGravidanzaARischio').data('RadioBox');
				
				if( gravidanzaARischio.val() == 'S' )
				{
					
					$('#cmbEsenzioneGravidanza').val('M50').trigger('change').off('change');
					$('#txtSettimanaGravidanza').off('blur');
				}
				else
					GRAVIDANZA.setEvents();
				
			});
			
			$('#li-tabListaGravidanze').on('click', function(){
				GRAVIDANZA.loadWkGravidanze();
				$('.butSalva').hide();
			});
			$('#li-tabPrestazioniCollegate').on('click', function(){
				GRAVIDANZA.loadWkPrestazioni();
				$('.butSalva').show();
			});
			$('#li-tabInserimentoGravidanza').on('click', function(){
				$('.butSalva').show();
			});
			
			$('#txtDataUltimoMestruo, #txtDataPresuntaParto, #txtDataParto').on('change', function(){

				GRAVIDANZA.checkDate();
			});
			
		},
		
		checkDate: function(){
			var dataUltimoMestruo = $('#h-txtDataUltimoMestruo').val();
			var dataPresuntaParto = $('#h-txtDataPresuntaParto').val();
			var dataParto = $('#h-txtDataParto').val();
			var res = 1;
			if(dataUltimoMestruo != '' && dataPresuntaParto != ''){
				if (dataPresuntaParto - dataUltimoMestruo <= 0){
					home.NOTIFICA.error({ 
					message : 'Data ultimo mestruo successiva alla data di parto presunta' , 
					title : 'Attenzione!' 
					});
					res = 0;
				}
			}
			if(dataUltimoMestruo != '' && dataParto != ''){
				if (dataParto - dataUltimoMestruo <= 0){
					home.NOTIFICA.error({ 
					message : 'Data ultimo mestruo successiva alla data del parto' , 
					title : 'Attenzione!' 
					});
					res = 0;
				}
			}
			return res;
		},
		
		loadWkPrestazioni: function()
		{
			
			var parameters =
				{
					'id'		: 'PRESTAZIONI_GRAVIDANZA',
					'aBind'		: ['esenzione'],
					'aVal'		: [ $('#cmbEsenzioneGravidanza').val() ],
					'container'	: 'divPrestazioni'
				};
			
			if( !LIB.isValid( GRAVIDANZA.wkPrestazioni ) )
			{
				
				var height = $('.contentTabs').outerHeight( true ) - $('#fldPrestazioniCollegate').outerHeight( true ) - 10;
				 
				$( '#'+ parameters.container ).height( height );
				
				GRAVIDANZA.wkPrestazioni = new WK( parameters );
				GRAVIDANZA.wkPrestazioni.loadWk();
				
			}
			else
				GRAVIDANZA.wkPrestazioni.filter( parameters );
			
		},
		
		loadWkGravidanze: function()
		{
			
			var parameters =
				{
					'id'		: 'GRAVIDANZA',
					'aBind'		: ['iden_anag'],
					'aVal'		: [ $('#IDEN_ANAG').val() ],
					'container'	: 'divListaGravidanze'
				};
			
			if( !LIB.isValid( GRAVIDANZA.wkGravidanze ) )
			{
				
				var height = $('.contentTabs').outerHeight( true ) - 20;
				 
				$( '#'+ parameters.container ).height( height );
				
				GRAVIDANZA.wkGravidanze = new WK( parameters );
				GRAVIDANZA.wkGravidanze.loadWk();
				
			}
			else
				GRAVIDANZA.wkGravidanze.filter( parameters );
			
		},
		
		registra: function()
		{
			if($("#h-txtDataUltimoMestruo").val() == '' && $("#h-txtDataParto").val() == ''){
				home.NOTIFICA.warning({ 
					message 	: "Inserire almeno una data tra 'Data effettiva parto' e 'Data ultimo mestruo'" , 
					title 		: 'Attenzione!',
					timeout		: 6
					});
				return;
			}
			var risCkDate = GRAVIDANZA.checkDate();
//			alert(risCkDate)
			if (risCkDate == 0){
				return;
			}else{
			
				var parameters = 
					{	
						'PACTION'		: $('#IDEN').val() == '' ? 'INS' : 'MOD',
						'vIden'			: $('#IDEN').val(),
						'VDATAMESTRUO'	: $('#h-txtDataUltimoMestruo').val(),
						'PIDENPROBLEMA'	: $('#IDEN_PROBLEMA').val(),
						'VIDENANAG'		: home.ASSISTITO.IDEN_ANAG,
						'VIDENMED'		: (home.baseUser.TIPO_UTENTE == 'A' ? null : $("#IDEN_MED_PRESCR").val()),
						'VUTENTE'		: home.baseUser.IDEN_PER,
						'VIDENACCESSO'	: (home.ASSISTITO.IDEN_ACCESSO || null),
						'vDataParto'	: $('#h-txtDataParto').val(),
						'vDataPresunta'	: $('#h-txtDataPresuntaParto').val(),
						'vNote'			: $('#txtNote').val(),
						'vRischio'		: $('#h-radGravidanzaARischio').val()
					};
				
				
				
				toolKitDB.executeProcedureDatasource( 'SP_GEST_GRAVIDANZA', 'MMG_DATI', parameters, function( response ){
					
					var status = response.p_result.split('$')[0];
					
					if( status == 'OK' ){
						
						home.NOTIFICA.success({ message : 'Salvataggio effettuato correttamente' , title : 'Successo!' });
						
						if( $('#h-radGravidanzaARischio').val() == 'S' && $('#h-txtDataUltimoMestruo').val() != ''){
							
							var param = new Object();
							param.iden_anag				= home.ASSISTITO.IDEN_ANAG;
							param.text					= "Gravidanza a rischio";
							param.data_inizio			= $('#h-txtDataUltimoMestruo').val();
							param.data_fine				= moment($('#h-txtDataUltimoMestruo').val(), "YYYYMMDD").add( 40,'weeks' ).format('YYYYMMDD');
							param.sezione				= 'BACHECA_GRAVIDANZA_RISCHIO';
							param.iden_riferimento		= response.p_result.split('$')[1];
							param.tabella_riferimento	= 'MMG_GRAVIDANZE';
					
							//toolKitDB.executeFunction( 'SAVE_PROMEMORIA_BACHECA', param , function(){} );
							
							home.NS_MMG_UTILITY.insertPromemoria(param);
						}
						
						try {
							home.RIEPILOGO_INSERIMENTO_PROBLEMA.initWkNoteDiario();
						}catch(e) { }
						
						home.ASSISTITO.setEsenzioni();
						home.NS_MMG.apri( 'RIEPILOGO', '', {fullscreen:false} );
						
						/* decisione un po' drastica ma caricava troppo in fretta la wk dei problemi e non si visualizzava l'ultimo inserito, in questo la gra
						home.RIEP_ACCESSI_PROBLEMI.objWk.refresh();
						home.FILTRI_DIARI_WK.objWk.refresh();*/
						
						NS_FENIX_SCHEDA.chiudi();
						
					}else{
				
						home.NOTIFICA.error({ message : response.p_result.split('$')[1] , title : 'Errore!' });
					}
					
				});
			}
		}
};

var NS_MENU_GRAVIDANZA = {
	
	inserisciGravidanza: function( rec, n_scheda ){
		
		 home.NS_MMG.reloadPage( n_scheda, 'GRAVIDANZA', '&IDEN=' );
	},
	
	modificaGravidanza: function( rec, n_scheda ){
		
		home.NS_MMG.reloadPage( n_scheda, 'GRAVIDANZA', '&IDEN=' + rec[0]['IDEN'] );
	},
	
	cancellaGravidanza: function( rec ) {
		if (home.MMG_CHECK.canDelete(rec[0].UTE_INS, rec[0].IDEN_MED)) {
			home.NS_MMG.confirm(traduzione.lblConfirmCancella, function()  {

				home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
					id:'SP_HIDE_SHOW_PROBLEMA',
					parameter:{

						"v_iden_problema" 	: { v : rec[0].IDEN_PROBLEMA, t : 'N'},
						"pUtente" 			: { v : home.baseUser.IDEN_PER, t : 'N'},
						"pDataHide" 		: { v : '', t : 'V'},
						"pTypeRequest"	 	: { v : 'DEL', t : 'V' }
					}

				}).done( function() {

					home.GRAVIDANZA.wkGravidanze.refresh();
					home.ASSISTITO.setEsenzioni();

					if (home.ASSISTITO.IDEN_PROBLEMA == rec[0].IDEN_PROBLEMA){
						home.MAIN_PAGE.unsetPatientProblem();
					}else{
						home.RIEP_ACCESSI_PROBLEMI.objWk.refresh();
					}
				});

				try{

					home.FILTRI_DIARI_WK.objWk.refresh();
					home.RIEPILOGO.wkDiarioClinico.refresh();

				}catch(e) {}
			});
		}
	},
	
	inserisciDataParto: function( rec ){
		
		var ta = $("<input/>", { value:rec[0].DATA_PARTO });
		
		$.dialog(ta, {
			'buttons' 			: [{ label: "Annulla", action: function (ctx){ $.dialog.hide(); }}],
			'title' 			: "Inserisci/Modifica data parto",
			'ESCandClose'		: true,
			'created'			: function(){ $('.dialog').focus(); },
			'height'			: 240,
			'width'  			: 250
		});
		
		ta.hide().Zebra_DatePicker({always_visible: ta.parent(), direction:false, onSelect: function(data, dataIso) {
			
			var parameters = {
					
				'PACTION'		:'CLOSE',
				'vIden'			:rec[0].IDEN,
				'VDATAMESTRUO'	:rec[0].DATA_ULTIMO_MESTRUO_ISO,//-->non serve
				'PIDENPROBLEMA'	:rec[0].IDEN_PROBLEMA,
				'VIDENANAG'		:home.ASSISTITO.IDEN_ANAG,
				'VIDENMED'		:(home.baseUser.TIPO_UTENTE == 'A' ? null : home.baseUser.IDEN_PER ),
				'VUTENTE'		:home.baseUser.IDEN_PER,
				'VIDENACCESSO'	:(home.ASSISTITO.IDEN_ACCESSO || null),
				'vDataParto'	:dataIso,
				'vDataPresunta'	:rec[0].DATA_PARTO_PRESUNTA_ISO,//-->non serve
				'vNote'			:rec[0].NOTE,
				'vRischio'		:rec[0].RISCHIO
			};
		
		toolKitDB.executeProcedureDatasource( 'SP_GEST_GRAVIDANZA', 'MMG_DATI', parameters, function( response ){
			
				var status = response.p_result.split('$')[0], message = response.p_result.split('$')[1];
				
				if( status == 'OK' ){
					
					home.NOTIFICA.success({ message : message , title : 'Successo!' });
					home.ASSISTITO.setEsenzioni();
					home.GRAVIDANZA.loadWkGravidanze();
					home.FILTRI_DIARI_WK.objWk.refresh();
					home.RIEP_ACCESSI_PROBLEMI.objWk.refresh();
				}else{
					home.NOTIFICA.error({ message : message , title : 'Errore!' });
				}
				$.dialog.hide();
			});
		}});
		
		$(".dp_footer").hide();
	}
};
