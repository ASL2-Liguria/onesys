$(document).ready(function()
{
	
	GRUPPI_FAMILIARI.init();
	GRUPPI_FAMILIARI.setEvents();
	
	NS_FENIX_SCHEDA.registra = GRUPPI_FAMILIARI.registra;
	NS_FENIX_SCHEDA.beforeSave = GRUPPI_FAMILIARI.beforeSave;
	
});

var GRUPPI_FAMILIARI = {
		
		init: function(){
			
			home.GRUPPI_FAMILIARI = this;
			
			GRUPPI_FAMILIARI.setLayout();
			
			$('#container').append( GRUPPI_FAMILIARI.getList() );
			
			GRUPPI_FAMILIARI.loadParentele();
		},
		
		setEvents: function(){
			
			$('#butApplica')
				.on('click', 
						function()
						{
					
							$('#txtCognome').val( $('#txtCognome').val().toUpperCase() );
							$('#txtNome').val( $('#txtNome').val().toUpperCase() );

							GRUPPI_FAMILIARI.loadWkParentela();
							
						});
			
			$('#txtCognome')
				.on('keyup', function(){ $(this).val( $(this).val().toUpperCase() ); })
					.on('keydown', function( event ){ event.keyCode == '13' ? GRUPPI_FAMILIARI.loadWkParentela() : null; });
		
			$('#txtNome')
				.on('keyup', function(){ $(this).val( $(this).val().toUpperCase() ); })
					.on('keydown', function( event ){ event.keyCode == '13' ? GRUPPI_FAMILIARI.loadWkParentela() : null; });
			
			$('#container')
				.on('click', '.icon-minus-circled', 
						function( event ) 
						{ 
							GRUPPI_FAMILIARI.deleteFamiliare( $(this).closest('li') ); 
						})
					.on('click', '.icon-user', 
							function( event ) 
							{ 
								GRUPPI_FAMILIARI.apriCartella( $(this) ); 
							})
						.on('click', '.icon-pencil', 
								function( event )
								{ 							
									GRUPPI_FAMILIARI.nota( $(this).closest('li').attr('data-id'), $(this).closest('li').attr('data-nota') ); 
								});
			
		},
		
		setLayout:function(){
			var height = $('.contentTabs').innerHeight() - $('#fldParentela').outerHeight(true); // - $('#fldInserimentoParentela').outerHeight(true);
			$('#divWk').height( height );
			
			$("#fldInserimentoParentela").addClass("backgroundYellow");			
		},
		
		beforeSave:function(){
			home.MMG_CHECK.isDead();
		},
		
		loadWkParentela: function(){
			
			var 
				nome		= $('#txtNome').val() + '%25',
				cognome		= $('#txtCognome').val() + '%25',
				dataNascita	= $('#h-txtDataNascita').val() + '%25',
				parameters	= 
				{
					'id': 		'ANAGRAFICA_GRUPPI_FAMILIARI',
					'aBind':	[ 'nome', 'cognome', 'data_nascita' ],
					'aVal':		[ nome, cognome, dataNascita ]
				};
			
			if( !LIB.isValid( GRUPPI_FAMILIARI.wkParentela ) ){
				
				GRUPPI_FAMILIARI.wkParentela = new WK( parameters );
				GRUPPI_FAMILIARI.wkParentela.loadWk();
				
			}else{
				GRUPPI_FAMILIARI.wkParentela.filter( parameters );
			}
		},
		
		loadParentele: function() {
			
			toolKitDB.getResultDatasource( 'MMG_DATI.GRUPPI_FAMILIARI_ESISTENTI', 'MMG_DATI', { 'iden_anag' : home.ASSISTITO.IDEN_ANAG }, null, function( response ) {
				if( LIB.isValid( response ) ) {
					for( var i = 0; i < response.length; i++ ) {
						var record = {
							'IDEN_ANAG'				: response[i]['IDEN_ANAG'],
							'IDEN_PARENTE'			: response[i]['IDEN_PARENTE'],
							'GRADO'					: response[i]['GRADO'],
							'PARENTE'				: response[i]['PARENTE'],
							'NOTE'					: response[i]['NOTE'],	
							'IDEN_MED_BASE'			: response[i]['IDEN_MED_BASE'],
							'CONSENSO_PRIVACY_MMG'	: response[i]['CONSENSO_PRIVACY_MMG'],
							'PERMESSI_LETTURA'		: response[i]['PERMESSI_LETTURA']
						};
						
						GRUPPI_FAMILIARI.addItem( record, true );
					}
				}
			});
		},
		
		getList: function() {
			return GRUPPI_FAMILIARI.list = $(document.createElement('ul')).addClass('list');
		},
		
		addItem: function( rec, readOnly ) {
			
			var li = $(document.createElement('li')).attr({ 
				'data-id' 	: rec['IDEN_PARENTE'], 
				'data-med' 	: rec['IDEN_MED_BASE'],
				'data-cons' : rec['CONSENSO_PRIVACY_MMG'],
				'data-perm' : rec['PERMESSI_LETTURA']
			});
			var h3				= $(document.createElement('h3')).text( rec['PARENTE'] );
			var combo			= $('#cmbTipoParentela').clone(true).attr('id', 'cmbTipoParentela_' + rec['IDEN_PARENTE'] );
			var iconDelete		= $(document.createElement('i')).addClass('icon-minus-circled worklist-icon').attr('title', 'Elimina parentela');
			var iconPaziente	= $(document.createElement('i')).addClass('icon-user worklist-icon').attr('title', 'Cartella assistito');
			var iconNota		= $(document.createElement('i')).addClass('icon-pencil worklist-icon').attr('title', 'Inserisci/modifica nota');
			
			readOnly = readOnly || false;
			
			if( LIB.isValid( rec['NOTE'] ) && rec['NOTE'] != '' ){
				li.attr('data-nota', rec['NOTE'] );
			}
			
			if(readOnly){
				combo.attr( 'disabled', readOnly ).val( rec['GRADO'] );
			}
			
			li.append( h3.prepend( iconPaziente, iconDelete, iconNota ), combo ).appendTo( GRUPPI_FAMILIARI.list );
			$("#li-fldInserimentoParentela").click();
		},
		
		nota: function( item, text ){
			
			GRUPPI_FAMILIARI.itemSelected = item;
			
			var title	= 'Nota relativa alla parentela '+ $('#cmbTipoParentela_'+ item +' :selected').text();
			
			var buttons = [
				 {
					label: traduzione.butSalva, 
					action: 
						function()
						{
							
							item = GRUPPI_FAMILIARI.itemSelected;
							
							GRUPPI_FAMILIARI.list.find('[data-id="'+ item +'"]').attr('data-nota', $('#nota').val() );
							
							$.dialog.hide(); 
						
						}
				 },
				 {
					label: traduzione.butChiudi, 
					action: 
						function(){
								$.dialog.hide(); 
							}
				}];
			
			var textarea = $(document.createElement('textarea')).attr( { 'id' : 'nota', 'name' : 'nota', 'placeholder' : 'Inserisci il testo della nota', 'maxLength' : '4000' });
			
			textarea.val( text );
			
			$.dialog( textarea,
				{
					id				: 'dialogNota',
					title			: title,
					width			: '600px',
					showBtnClose	: false,
					ESCandClose		: true,
					created			: function(){ $('.dialog').focus(); },
					buttons			: buttons
				});
		},
		
		beforeSave: function(){
			
			var passed = GRUPPI_FAMILIARI.list.find('li').length > 0;
			
			if( !passed ){
				home.NOTIFICA.warning( { 'title' : 'Attenzione', 'message' : traduzione.selezionareParente  }); 
			}
			
			return passed;
		},
		
		registra: function(){
			
			if( GRUPPI_FAMILIARI.beforeSave() ){
				
				var vUtente = home.baseUser.IDEN_PER;
				var array_iden_parente = GRUPPI_FAMILIARI.list.find('li').map(function(){
					return $(this).attr("data-id");
				}).get();
				var array_tipo = GRUPPI_FAMILIARI.list.find('li').map(function(){
					return $(this).find("select").val();
				}).get();
				var parameters = {
					'p_Iden_anag':		home.ASSISTITO.IDEN_ANAG,
					'p_Iden_parente':	array_iden_parente.toString(),
					'p_parentela':		array_tipo.toString(),
					'p_Utente':			vUtente,
					'p_note':			$(this).attr('data-nota')
				};

				toolKitDB.executeFunctionDatasource( 'SAVE_GRUPPI_FAMILIARI', 'MMG_DATI', parameters, function( response ) {
					var status = response.p_result.split('$')[0], message = response.p_result.split('$')[1];
					if( status == 'OK' ){
						home.NOTIFICA.success({ message : message , title : 'Successo!' });
					}else{
						home.NOTIFICA.error({ message : message , title : 'Errore!' });
					}
				});
			}
		},
		
		deleteFamiliare:function( item ){
			
			var params = 
			{
				p_Iden_anag:	home.ASSISTITO.IDEN_ANAG,
				p_Iden_parente:	item.attr('data-id')
			};
			
			toolKitDB.executeProcedureDatasource( 'DELETE_GRUPPI_FAMILIARI', 'MMG_DATI', params, 
				function( response ){

					var status 	= response.p_result.split('$')[0];
					var message = response.p_result.split('$')[1];
					
					if( status == 'OK' ){
						
						home.NOTIFICA.success({ message : message , title : 'Successo!' });
						item.remove();
					
					}else{						
						home.NOTIFICA.error({ message : message , title : 'Errore!' });
					}
				});
		},
		
		apriCartella:function(obj){
			
			/*	if(home.CARTELLA.REGIME == 'LP' || home.CARTELLA.REGIME == 'AC'){
				home.NOTIFICA.warning({ 
					message 	: 'In regime di LP o AC non &egrave; possibile accedere alla cartella dei parenti del paziente', 
					title 		: 'Errore!',
					timeout		:6
					});
				return;
			}*/
			
			var param_med = {
				IDEN_ANAG 				: obj.closest("li").attr('data-id'),
				PAZIENTE 				: obj.closest("h3").text(),
				IDEN_MED_BASE 			: obj.closest("li").attr('data-med'),
				CONSENSO_PRIVACY_MMG 	: obj.closest("li").attr('data-cons'),
				PERMESSI_LETTURA 		: obj.closest("li").attr('data-perm')
			};
			
			NS_MENU_WORKLIST_ASSISTITI.apriCartellaAssistito( param_med, 'CARTELLA', home.NS_FENIX_TOP.chiudiUltima);
		}
};