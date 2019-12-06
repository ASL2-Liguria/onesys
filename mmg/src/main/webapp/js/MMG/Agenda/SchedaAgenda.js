$(document).ready(function ()
{

    SCHEDA_AGENDA.init();
    SCHEDA_AGENDA.setEvents();
        
//    SCHEDA_AGENDA.toggleVisibility();
    
    NS_FENIX_SCHEDA.beforeSave = SCHEDA_AGENDA.beforeSave;
    NS_FENIX_SCHEDA.successSave = SCHEDA_AGENDA.successSave;
    
});

var SCHEDA_AGENDA = 
{

		init: function()
		{
			
			home.SCHEDA_AGENDA				= this;
			
			$("#lblTitolo").text($("#lblTitolo").text() + ' - ' + $("#DESCR_MEDICO").val())
			
			SCHEDA_AGENDA.orarioMattino		= $('#fldFasceOrarie').find('[id*="Mattino"]').filter(':not([id^="txtPosti"])');
			SCHEDA_AGENDA.orarioPomeriggio	= $('#fldFasceOrarie').find('[id*="Pomeriggio"]').filter(':not([id^="txtPosti"])');
			
//			SCHEDA_AGENDA.posti				= $('#fldFasceOrarie').find('[id^="txtPosti"]').filter('[id*="Mattino"], [id*="Pomeriggio"]');
//			SCHEDA_AGENDA.postiMattino		= $('#fldFasceOrarie').find('[id^="txtPosti"]').filter('[id*="Mattino"]');
//			SCHEDA_AGENDA.postiPomeriggio	= $('#fldFasceOrarie').find('[id^="txtPosti"]').filter('[id*="Pomeriggio"]');
			
			SCHEDA_AGENDA.orarioMattino.attr( 'maxLength', 5 );
			SCHEDA_AGENDA.orarioPomeriggio.attr( 'maxLength', 5 );
			
//			SCHEDA_AGENDA.postiMattino.attr( 'maxLength', 3 );
//			SCHEDA_AGENDA.postiPomeriggio.attr( 'maxLength', 3 );
			
			SCHEDA_AGENDA.setSummaryContent();
			
			$("#IDEN_MEDICO").val($("#ID_MEDICO").val());
			
			
		},
		
		setEvents: function()
		{
			
			/*$('#txtDescrizioneAgenda, #txtDataInizioAgenda, #txtDataFineAgenda')
				.on('change', 
					function()
					{
					
						SCHEDA_AGENDA.toggleVisibility();
						SCHEDA_AGENDA.setSummaryHeader();
						
					});*/
			
			$('#fldFasceOrarie').find('input[type="text"]')
				.on('change', SCHEDA_AGENDA.setSummaryContent );
			
			SCHEDA_AGENDA.orarioMattino
				.on('keydown', 
					function( event )
					{
						
						var 
							obj		= $(this),
							hour	= obj.val(), 
							dayName = obj.closest('tr').find('td:eq(0)').attr('id').replace('lbl','');
						
						if( hour != '' )
							LIB.isHour( hour ) && SCHEDA_AGENDA.isMorning( hour ) ? obj.removeClass('error') : obj.addClass('error');
						else
							obj.removeClass('error');
						
//						$('#txtPosti'+ dayName +'Mattino').val( SCHEDA_AGENDA.getSlots( obj ) );
					
					})
				.on('blur',
					function( event )
					{
						
						if( $(this).hasClass('error') ) 
							$(this).trigger('keydown');
						
						SCHEDA_AGENDA.formatError( $(this), traduzione.erroreOrarioMattino );
					
					});
			
			SCHEDA_AGENDA.orarioPomeriggio
				.on('keydown', 
					function( event )
					{
						
						var 
							obj		= $(this),	
							hour	= obj.val(), 
							dayName = obj.closest('tr').find('td:eq(0)').attr('id').replace('lbl','');
						
						if( hour != '' )
							LIB.isHour( hour ) && SCHEDA_AGENDA.isAfternoon( hour ) ? obj.removeClass('error') : obj.addClass('error');
						else
							obj.removeClass('error');	
						
//						$('#txtPosti'+ dayName +'Pomeriggio').val( SCHEDA_AGENDA.getSlots( obj ) );
						
					})
				.on('blur',
					function( event )
					{
						
						if( $(this).hasClass('error') ) 
							$(this).trigger('keydown');
					
						SCHEDA_AGENDA.formatError( $(this), traduzione.erroreOrarioPomeriggio );
					
					});
			
			/*SCHEDA_AGENDA.posti
				.on('keyup', 
					function( event )
					{
						
						!isNaN( $(this).val()  ) && $(this).val() != '' ? $(this).removeClass('error') : $(this).addClass('error');					
					
					})
				.on('blur',
					function( event )
					{
					
						SCHEDA_AGENDA.formatError( $(this), traduzione.errorePosto );
					
					});*/
			
		},
		
		toggleVisibility: function()
		{
			
			var 
				descrizione = $('#txtDescrizioneAgenda').val(),
				dataInizio	= $('#txtDataInizioAgenda').val(),
				dataFine	= $('#txtDataFineAgenda').val();
			
			if( LIB.isValid( descrizione ) && LIB.isValid( dataInizio ) && LIB.isValid( dataFine ) )
			{
				
				$('#fldFasceOrarie, #fldRiepilogo').fadeIn(500);
				
			}
			else
			{
				
				$('#fldFasceOrarie, #fldRiepilogo').fadeOut(500);
				
			}
			
		},
		
		formatError: function( obj, message )
		{
			
			if( obj.hasClass('error') && obj.val() != '' ) 
				home.NOTIFICA.warning( { 'title' : 'Attenzione', 'message' : message, 'timeout' : 6 });
			
		},
		
		isHour: function( val )
		{
			
			return LIB.isHour( val );
			
		},
		
		isDate: function()
		{
			
			return new RegExp('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$').test( val );
			
		},
		
		// L'ORARIO IN INPUT (FORMATO HH:MM) E' COMPRESO TRA 00:00 E 12:00
		isMorning: function( val )
		{
			
			var hour = val.replace(':','');
			
			return parseInt( hour ) >= 0 && parseInt( hour ) <= 1400;
			
		},
		
		// L'ORARIO IN INPUT (FORMATO HH:MM) E' COMPRESO TRA 12:01 E 23:59
		isAfternoon: function( val )
		{
			
			var hour = val.replace(':','');
			
			return parseInt( hour ) >= 1301 && parseInt( hour ) <= 2359;
			
		},
		
		isBigger: function( lowValue, highValue )
		{
			
			return parseInt( highValue.replace(':','') ) > parseInt( lowValue.replace(':','') );
			
		},
		
		getSlots: function( obj )
		{
						
			var 
				id			= obj.attr('id'),
				dayName 	= obj.closest('tr').find('td:eq(0)').attr('id').replace('lbl',''),
				hourStart, hourEnd, slots;
			
			if( id.indexOf('Mattino') != -1 )
			{
				
				hourStart	= moment( $( '#txt'+ dayName + 'MattinoInizio' ).val(), 'HH:mm' );
				hourEnd		= moment( $( '#txt'+ dayName + 'MattinoFine' ).val(), 'HH:mm' );
				
			}
			else if( id.indexOf('Pomeriggio') != -1 )
			{
				
				hourStart	= moment( $( '#txt'+ dayName + 'PomeriggioInizio' ).val(), 'HH:mm' );
				hourEnd		= moment( $( '#txt'+ dayName + 'PomeriggioFine' ).val(), 'HH:mm' );
				
			}
			
			slots = LIB.isValid( hourStart ) && LIB.isValid( hourEnd ) ? parseInt( hourEnd.diff( hourStart, 'minutes' ) / 15 ) : 0;
			
			return !isNaN( slots ) ? slots : '';
			
		},
		
		setSummaryHeader: function()
		{
			
			var header = 'L\'agenda <b>'+ $('#txtDescrizioneAgenda').val() + '</b> sar&agrave; attiva dal <b>'+ $('#txtDataInizioAgenda').val() + '</b> al <b>'+ $('#txtDataFineAgenda').val() + '</b>.';
				
			$('#riepilogo')
				.empty()
				.append( SCHEDA_AGENDA.getParagraph( header ) )
				.append( SCHEDA_AGENDA.getParagraph( 'Gli orari sono i seguenti:' ) );
			
		},
		
		setSummaryContent: function()
		{
			
			var table = $('#fldFasceOrarie').find('table'), rows = table.find('tr').not('tr:eq(0)');
			
			rows.each( function()
				{
				
					var 
						dayName				= $(this).find('td:eq(0)').attr('id').replace('lbl',''),
						morningStarts		= $('#txt'+ dayName +'MattinoInizio').val(),
						morningEnds			= $('#txt'+ dayName +'MattinoFine').val(),
//						morningSlots		= $('#txtPosti'+ dayName +'Mattino').val(),
						afternoonStarts		= $('#txt'+ dayName +'PomeriggioInizio').val(),
						afternoonEnds		= $('#txt'+ dayName +'PomeriggioFine').val(),
//						afternoonSlots		= $('#txtPosti'+ dayName +'Pomeriggio').val(),
						morning				= LIB.isValid( morningStarts ) && LIB.isValid( morningEnds ),// && LIB.isValid( morningSlots ),
						afternoon			= LIB.isValid( afternoonStarts ) && LIB.isValid( afternoonEnds ),// && LIB.isValid( afternoonSlots ),
						text;
					
					text = '<b>'+ traduzione['lbl'+dayName] +'</b> ';
					
					if( morning )
					{
						
						text += 'dalle ore <b>' + morningStarts + '</b> alle ore <b>' + morningEnds + '</b>';// con <b>'+ morningSlots + '</b> posti disponibili';
						
					}
							
					
					if( afternoon )
					{
						
						if( morning )
							text += ' e ';
							
						text += 'dalle ore <b>' + afternoonStarts + '</b> alle ore <b>' + afternoonEnds + '</b>'; // con <b>'+ afternoonSlots + '</b> posti disponibili';
						
					}
						
					if( morning || afternoon )
					{
						
						if( $('#riepilogo'+ dayName).length == 0 )
						{
							
							$('#riepilogo').append( SCHEDA_AGENDA.getParagraph( text ).attr( 'id', 'riepilogo'+ dayName ) );
							
						}
						else
						{
							
							$('#riepilogo'+ dayName).html( text );
							
						}
						
					}
						
				});
			
		},
		
		getParagraph: function( text )
		{
						
			return $( document.createElement('p') ).html( text );
			
		},
		
		beforeSave: function() {
			
			var lun = [], mar = [], mer = [], gio = [], ven = [], sab = [], dom = [];
			pushInterval(lun,$("#txtLunediMattinoInizio").val());
			pushInterval(lun,$("#txtLunediMattinoFine").val());
			pushInterval(lun,$("#txtLunediPomeriggioInizio").val());
			pushInterval(lun,$("#txtLunediPomeriggioFine").val());
			pushInterval(mar,$("#txtMartediMattinoInizio").val());
			pushInterval(mar,$("#txtMartediMattinoFine").val());
			pushInterval(mar,$("#txtMartediPomeriggioInizio").val());
			pushInterval(mar,$("#txtMartediPomeriggioFine").val());
			pushInterval(mer,$("#txtMercolediMattinoInizio").val());
			pushInterval(mer,$("#txtMercolediMattinoFine").val());
			pushInterval(mer,$("#txtMercolediPomeriggioInizio").val());
			pushInterval(mer,$("#txtMercolediPomeriggioFine").val());
			pushInterval(gio,$("#txtGiovediMattinoInizio").val());
			pushInterval(gio,$("#txtGiovediMattinoFine").val());
			pushInterval(gio,$("#txtGiovediPomeriggioInizio").val());
			pushInterval(gio,$("#txtGiovediPomeriggioFine").val());
			pushInterval(ven,$("#txtVenerdiMattinoInizio").val());
			pushInterval(ven,$("#txtVenerdiMattinoFine").val());
			pushInterval(ven,$("#txtVenerdiPomeriggioInizio").val());
			pushInterval(ven,$("#txtVenerdiPomeriggioFine").val());
			pushInterval(sab,$("#txtSabatoMattinoInizio").val());
			pushInterval(sab,$("#txtSabatoMattinoFine").val());
			pushInterval(sab,$("#txtSabatoPomeriggioInizio").val());
			pushInterval(sab,$("#txtSabatoPomeriggioFine").val());
			pushInterval(dom,$("#txtDomenicaMattinoInizio").val());
			pushInterval(dom,$("#txtDomenicaMattinoFine").val());
			pushInterval(dom,$("#txtDomenicaPomeriggioInizio").val());
			pushInterval(dom,$("#txtDomenicaPomeriggioFine").val());
			
			var sett = [lun,mar,mer,gio,ven,sab,dom];
			$("#ORARI").val(JSON.stringify(sett));
			return true;
			
			function pushInterval(array, val) {
				
				if (val =='') return;
				array.push(Number(val.substring(0,2))*60 + Number(val.substring(3,5)));
			}
		},
		
		successSave: function() {
			home.SCHEDULER.loader.loadOrariMedici();
			NS_FENIX_SCHEDA.chiudi();
		}
			
		
};