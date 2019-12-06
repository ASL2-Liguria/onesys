$(document).ready(function()
{

	VACCINO.init();
	VACCINO.setEvents();
	
	//$('#radVaccino').data('RadioBox').selectByValue( 'A' );
	
	NS_FENIX_SCHEDA.customizeParam	= VACCINO.customizeParam;
	NS_FENIX_SCHEDA.beforeSave		= VACCINO.beforeSave;
	NS_FENIX_SCHEDA.successSave		= VACCINO.successSave; 
	NS_FENIX_SCHEDA.afterSave		= VACCINO.afterSave; 
	NS_FENIX_SCHEDA.beforeClose		= VACCINO.beforeClose;
	
	home.NS_LOADING.hideLoading();
	
});

var VACCINO = {
		
		objWkVaccinazioni:null,
		
		init: function(){

			$("#li-tabInserimento").trigger("click");
			
			var $this				= this;
			var iden_anag			= $('#IDEN_ANAG').val();
			
			home.VACCINO			= $this;
			$this.contentTabs		= $('.contentTabs');
			$this.tabs				= $('#Vaccino');
			$this.tabWk				= $('#li-tabLista');
			$this.wkVaccinazioni	= $('#wkVaccinazioni');
			$this.fldRicerca		= $('#fldRicercaPaziente');
			$this.wkPaziente		= $('#wkPaziente');
			$this.excClasseRischio	= $('#excClasseRischio');
			$this.cognome			= $('#txtCognome');
			$this.nome				= $('#txtNome');
			$this.dataNascita		= $('#h-txtDataDiNascita');
			
			if( iden_anag != '' ) {
				$this.fldRicerca.hide();
				$this.wkPaziente.hide();
			}else{
				$this.fldRicerca.show();
				$this.wkPaziente.show();
			}
			
			$("#radAdiuvato").closest('tr').hide();
			
			if($("#TIPOLOGIA").val() == "ANTINFLUENZALE"){
				
				$('#radVaccino').data('RadioBox').selectByValue( 'AI' );
				$this.excClasseRischio.show();
				$('#cmbNumeroLotto').closest('tr').removeClass('hide');
				$('#txtTipoVaccino').closest('tr').addClass('hide');
				
				$('#h-txtTipoVaccino').val( 'VAC_2' );
				
				
				//cambio il titolo
				var titolo = $("#lblTitolo").text()+' ';
				titolo += $("#TIPOLOGIA").val();

				$("#lblTitolo").text(titolo);

				
				if(!LIB.isValid($("#IDEN").val())){
	
					$('#radFornito').data('RadioBox').selectByValue( 'ASL' );
					$('#radEsecuzione').data('RadioBox').selectByValue( 'AMB' );
				}
				
				$("#radAdiuvato").closest('tr').show();
				
			}else{
				
				$this.excClasseRischio.hide();
				$('#cmbNumeroLotto').closest('tr').addClass('hide');
				$('#radVaccino').data('RadioBox').selectByValue( 'A' );
			}
			/******se la pagina del vaccino viene caricata per essere modificata faccio sparire il primo tab e disabilito il primo radio*******/
			if(LIB.isValid($("#IDEN").val())){

				$('#radVaccino').data('RadioBox').disable();
				
				$("#tabLista, #li-tabLista").hide();
				$("#li-tabInserimento").trigger("click");
			}
			
			if( $('#hIdenPPIP').val() != '' ){
				VACCINO.getClassiRischio( $('#hIdenPPIP').val() );
			}
		},
		
		setEvents: function()
		{
			
			var $this = this; 
			
			$("#li-tabLista").on("click",function() {


				if (VACCINO.objWkVaccinazioni==null) {
					VACCINO.loadWkVaccinazioni();
				}
			});
			
			$this.cognome
				.on('keyup',function(){ event.keyCode != '13' ? $(this).val( $(this).val().toUpperCase() ) : VACCINO.loadWkPaziente(); });
		
			$this.nome
				.on('keyup',function(){ event.keyCode != '13' ? $(this).val( $(this).val().toUpperCase() ) : VACCINO.loadWkPaziente(); });
			
			$('#butCerca')
				.on('click', function(){ VACCINO.loadWkPaziente(); });
			
			$('#h-radVaccino')
				.on('change', function()
				{
					
					if( $('#radVaccino').data('RadioBox').val() == 'AI' )
					{
						
						$this.excClasseRischio.show();
						$('#cmbNumeroLotto').closest('tr').removeClass('hide');
						$('#txtTipoVaccino').closest('tr').addClass('hide');
						
						$('#h-txtTipoVaccino').val( 'VAC_2' );
						$('#radFornito').data('RadioBox').selectByValue( 'ASL' );
						$('#radEsecuzione').data('RadioBox').selectByValue( 'AMB' );
						
						$("#radAdiuvato").closest('tr').show();
						
					}else{
						
						$this.excClasseRischio.hide();
						$('#cmbNumeroLotto').closest('tr').addClass('hide');
						$('#txtTipoVaccino').closest('tr').removeClass('hide');
						$('#h-txtTipoVaccino').val( '' );
						
						$("#radAdiuvato").closest('tr').hide();
					}
				});

			$(".butModuloConsensoInformato").on("click",function(){
				
			 	var prompts = {pIdenAnag: $("#IDEN_ANAG").val(), pIdenPer:home.baseUser.IDEN_PER};
				
				home.NS_PRINT.print({
					path_report: "CONSENSO_VACCINAZIONE_ANTINFLUENZALE.RPT",
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			});
		},
		
		cancellaVaccino: function(riga){
			if (home.MMG_CHECK.canDelete(riga[0].UTE_INS, riga[0].IDEN_MED)) {
				home.NS_MMG.confirm("Cancellare il vaccino selezionato?", function(){

					if(riga[0].CODICE == 'VAC_2'){

						home.NS_MMG.confirm("Verr\u00E0 eliminata anche la P.P.I.P. associata al vaccino. Procedere?", function(){
							deleteVaccino();
						});
					}else{
						deleteVaccino();
					}

					function deleteVaccino() {

						toolKitDB.executeProcedureDatasource('SP_CANCELLA_VACCINO', 'MMG_DATI', {pIden: riga[0].IDEN}, function(resp){
							VACCINO.loadWkVaccinazioni();
						});
					}
				});
			}
		},
		
		apriVaccino: function(riga){
			
			var pIden = riga[0].IDEN;
			var pTipoVaccino = riga[0].DESCRIZIONE;
			var pCodice = riga[0].CODICE;
			var url = "";
			var urlAgg = "";

			if(typeof $("#PROVENIENZA") != 'undefined' && $("#PROVENIENZA").val() == 'CONTEGGIO_VACCINI'){
				urlAgg = "&IDEN=" + pIden + '&PROVENIENZA=CONTEGGIO_VACCINI&N_SCHEDA='+ $('#N_SCHEDA').val();
			}else{
				urlAgg = "&IDEN=" + pIden + '&PROVENIENZA=VACCINI&N_SCHEDA='+ $('#N_SCHEDA').val();
			}
			
			//vaccinazione antinflueanzale
			if(pCodice == "VAC_2"){
				url = "page?KEY_LEGAME=MMG_INSERIMENTO_VACCINO&TIPOLOGIA=ANTINFLUENZALE" + home.NS_MMG.getCommonParameters() + urlAgg;
			}else{
				url = "page?KEY_LEGAME=MMG_INSERIMENTO_VACCINO" + home.NS_MMG.getCommonParameters() + urlAgg;
			}
					
			var iframe = home.NS_FENIX_TOP.body.find('.iScheda').last();
			
			iframe.attr( 'src', url );
		},
		
		beforeClose: function(){
			
			if(typeof $("#PROVENIENZA") != 'undefined' && $("#PROVENIENZA").val() == 'CONTEGGIO_VACCINI'){
				home.CONTEGGIO_VACCINI.objWk.refresh();
			}
			
			return true;
		},
	
		loadWkVaccinazioni: function(){
			
			var h = $('.contentTabs').innerHeight() - 70;
			$("#wkVaccinazioni").height( h );

			var 
				iden_anag		= $('#IDEN_ANAG').val(),
				all_iden_anag	= iden_anag == '' ? 'S' : 'N',
				parameters		= 
				{
					'id': 			'LISTA_VACCINI',
					'container':	'wkVaccinazioni',
					'aBind':		[ 'iden_anag', 'all_iden_anag', 'iden_utente' ],
					'aVal':			[ iden_anag, all_iden_anag, $("#IDEN_MED_PRESCR").val() ]//home.baseUser.IDEN_PER
				};
			
			if( ! LIB.isValid( this.objWkVaccinazioni ) )
			{
				
				this.objWkVaccinazioni = new WK( parameters );
				this.objWkVaccinazioni.loadWk();
				
			}else{
				this.objWkVaccinazioni.filter( parameters );
			}
		},
		
		loadWkPaziente: function()
		{
			
			var 
				cognome			= VACCINO.cognome.val(),
				nome			= VACCINO.nome.val(),
				dataNascita		= VACCINO.dataNascita.val(),
				parameters		= 
				{
					'id': 			'ASSISTITI_ALL',
					'container':	'wkPaziente',
					'aBind':		[ 'cogn', 'nome', 'data', 'cod_fisc'],
					'aVal':			[ cognome, nome, dataNascita, '']
				};
		
			if( ! LIB.isValid( this.objWkPaziente ) )
			{
				
				this.objWkPaziente = new WK( parameters );
				this.objWkPaziente.loadWk();
				
			}
			else
				this.objWkPaziente.filter( parameters );
			
		},
		
		customizeParam: function( params )
		{
			
			params.extern = true;
			return params;
			
		},
		
		beforeSave: function( params ){
			
			var performSave = true;
			
			if($("#h-chkInserisciPromemoria").val() == 'S' && $("#h-txtDataScadenzaVaccino").val() == ''){
				home.NOTIFICA.warning({

	                message	: "Inserire una data di scadenza per il vaccino",
	                title	: "Attenzione",
	                timeout	: 10

	            });
				
				performSave = false;
			}		
			
			if( $('#IDEN_ANAG').val() == '' ){
				
				VACCINO.notifyAlert( 'Selezionare un paziente cui associare il vaccino.' );
				performSave = false;

			}
			
			var valVaccino = $("#h-radVaccino").val();
			
			switch(valVaccino){
			
				case 'AI':
					if( $('#h-radAdiuvato').val() == '' )
					{
						VACCINO.notifyAlert( 'Selezionare un tipo di vaccino.' );
						performSave = false;
					}
					break;
						
				case 'A':
					if( $('#txtTipoVaccino').val() == '' )
					{
						VACCINO.notifyAlert( 'Selezionare un tipo di vaccino.' );
						performSave = false;
					}
					break;
					
				case '':
				default:
					VACCINO.notifyAlert( 'Selezionare la tipologia del vaccino' );
					performSave = false;
					break;
			}
			
			return performSave;
		},
		
		successSave:function(){

				if ($('#h-txtTipoVaccino').val() == 'VAC_2'){
				
				var paramOut = {'p_result': 'p_result'};
				var numero_residui = "";
				
				toolKitDB.executeProcedureDatasourceOut('CALCOLA_VACC_RESIDUI', 'MMG_DATI', {'p_Lotto':$("#cmbNumeroLotto").val(),'p_ute_ins':$("#IDEN_PER").val(),'P_TIPO_VACCINO':$("#h-radAdiuvato").val(),'P_OPERAZIONE':'DOWN'}, paramOut, 
						function(result){
							numero_residui = result.p_result;
							if(	$.isNumeric(numero_residui)){

								if(numero_residui > 0){
									
									home.NOTIFICA.info({

						                message: "Registrata esecuzione della vaccinazione antinfluenzale. NUMERO VACCINI ANTINFLUENZALI RESIDUI: " + numero_residui,
						                title: "Attenzione",
						                timeout: 15

						            });
									
								}else if(numero_residui == 0){
									
									home.NOTIFICA.warning({

						                message: "Registrata esecuzione della vaccinazione antinfluenzale. ATTENZIONE I VACCINI ANTINFLUENZALI DI TIPO " + $("#h-radAdiuvato").val() + " DEL LOTTO " + $("#cmbNumeroLotto").val() + " SONO ESAURITI",
						                title: "Attenzione",
						                timeout: 15

						            });
									
								}else{
									
									home.NOTIFICA.error({

						                message: "ATTENZIONE I VACCINI ANTINFLUENZALI DI TIPO " + $("#h-radAdiuvato").val() + " DEL LOTTO " + $("#cmbNumeroLotto").val() + " RISULTANO ESAURITI ",
						                title: "Attenzione",
						                timeout: 15

						            });
									
								}
							}
						});
			}
			
			if($("#h-chkInserisciPromemoria").val() == 'S' && $("#h-txtDataScadenzaVaccino").val() != ''){
				var text = '';
				if($("#h-radVaccino").val() == 'AI'){
					text = 'antinfluenzale ' + $("#h-radAdiuvato").val();
				}else{
					text = $("#txtTipoVaccino").val();
				}

				var obj = {
		    		'iden_anag'		: home.ASSISTITO.IDEN_ANAG,
		    		'text'			: 'Il giorno '+ moment( $("#h-txtDataScadenzaVaccino").val(), 'YYYYMMDD' ).format('DD/MM/YYYY') + ' scadra il vaccino '+ text,
		    		'data_inizio'	: moment().format('YYYYMMDD'),
		    		'data_fine'		: $("#h-txtDataScadenzaVaccino").val(),
		    		'priorita'		: 3,
		    		'note'			: 'Questo promemoria e\' stato inserito automaticamente'
			   	};
				home.NS_MMG_UTILITY.insertPromemoria(obj);
			}

			return true;
		},
		
		afterSave:function(){
			
			if(typeof $("#PROVENIENZA") != 'undefined' && $("#PROVENIENZA").val() == 'VACCINI'){
				
				NS_FENIX_SCHEDA.chiudi();
			
			}else if(typeof $("#PROVENIENZA") != 'undefined' && $("#PROVENIENZA").val() == 'CONTEGGIO_VACCINI'){
				
				home.CONTEGGIO_VACCINI.objWk.refresh();
				NS_FENIX_SCHEDA.chiudi();
				
			}else if(typeof $("#PROVENIENZA") != 'undefined' && $("#PROVENIENZA").val() == 'PATIENT_SUMMARY'){
				
				home.NS_MMG_PATIENT_SUMMARY.initWkVaccinazioni();
				NS_FENIX_SCHEDA.chiudi();
				
			}else{
				VACCINO.loadWkVaccinazioni();
				VACCINO.tabWk.trigger('click');
				$("#txtDescrizioneFornitore").val("");
				$('#radAdiuvato').data('RadioBox').empty();
				$('#chkInserisciPromemoria').data('CheckBox').deselectAll();
				$('#h-txtDataScadenzaVaccino').val('');
				$('#txtDataScadenzaVaccino').val('');
			}
		},
		
		notifyAlert: function( msg )
		{
			
			home.NOTIFICA.warning( { title : 'Attenzione', message	: msg } );
			
		},
		
		getClassiRischio: function( idenPPIP )
		{

			var parameters =
			{
				'iden' : idenPPIP
			};

			toolKitDB.getResultDatasource( 'MMG_DATI.CLASSI_RISCHIO', 'MMG_DATI', parameters, null, function( response )
			{
				VACCINO.loadClassiRischio( response );
			});
		

		},

		loadClassiRischio: function( list )
		{
			
			var option, attrName, attrValue;

			$('#ComboOut').empty();

			$.each(list, function( key, value )
			{

				option = $('<option>', { 'value' : value['IDEN'], 'text' : value['DESCRIZIONE'] } ).appendTo( '#ComboOut' );

				for( var data_key in value )
				{

					attrName	= ( data_key == 'DESCRIZIONE' ) ? 'data-descr' : ( ( data_key == 'IDEN' ) ? 'data-iden' : 'data-'+ data_key );
					attrValue	= value[ data_key ];

					option.attr( attrName, attrValue );

				};

			});

			VACCINO.checkDuplicates();

		},

		checkDuplicates: function()
		{

			var comboIn = $('#ComboIn'), comboOut = $('#ComboOut');

			comboOut.find('option').each(function()
			{

				comboIn.find('option[value=\''+ $(this).attr('data-iden') +'\']').remove();


			});

		},
		
		scelta: function() {
			/*funzione che non serve a nulla se non ad evitare un errore nell'autocomplete*/
		}
		
};