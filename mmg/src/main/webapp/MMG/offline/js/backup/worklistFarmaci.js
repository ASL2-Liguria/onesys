$(document).ready(function()
{
	
	WORKLIST_FARMACI.init();
	WORKLIST_FARMACI.setEvents();
		
});

var WORKLIST_FARMACI = 
{
	
	db:		'fenixMMG',
	store:	'FARMACI',		
		
	init: function()
	{
		
	},
	
	setEvents: function()
	{
		
		$('#txtFarmaco').on( 'keyup', function( event ) {
			event.keyCode != '13' ? $(this).val( $(this).val().toUpperCase() ) : WORKLIST_FARMACI.loadWk();
		});
		
		$('#butApplicaFarmaco').on('click', WORKLIST_FARMACI.loadWk );
		
	},
	
	/*
	 * 	SPECULARE ALL'OMONIMA FUNZIONE DEL NAMESPACE WORKLIST_ASSISTITI
	 */
	loadWk: function()
	{
		
		if( !OFFLINE.beforeLoadWk( $('#txtFarmaco') ) )
			return false;
		
		var 
			parameters	= 
			{
				'id':					'FARMACI_OFFLINE',
				'container':			'divWorklistFarmaci',
				'aBind':				[],
				'aVal':					[],
				'build_callback': { 
						'after':	WORKLIST_FARMACI.getWorklistData,
				},
				'load_callback': { 
						'before':	WORKLIST_FARMACI.showLoading,
				},
				'type': 'GET'
			};
	
		if( !LIB.isValid( WORKLIST_FARMACI.wkFarmaci ) )
		{
			
			var h = $('.contentTabs').innerHeight() - $('#fldWorklistFarmaci').outerHeight(true) - 10;
			$( '#'+ parameters.container ).height( h );
			
		}
		
		WORKLIST_FARMACI.wkFarmaci = new WK( parameters );
		WORKLIST_FARMACI.wkFarmaci.loadWk();
		
	},
	
	/*
	 * 	SPECULARE ALL'OMONIMA FUNZIONE DEL NAMESPACE WORKLIST_ASSISTITI
	 */
	getWorklistData: function()
	{
		
		var 
			farmaco		= $('#txtFarmaco').val().trim().toUpperCase(),
			recordset	= new Array(),
			dataPromise = 
			
				$.indexedDB( WORKLIST_FARMACI.db ).objectStore( WORKLIST_FARMACI.store ).index('DESCRIZIONE').each(
					function( record )
					{
						
						recordset.push( record.value );
						
					}, IDBKeyRange.bound( farmaco, farmaco + '\uffff' ) );
			
			return dataPromise.done( 
				function()
				{
										
					WORKLIST_FARMACI.wkJSON = WORKLIST_FARMACI.getWorklistJSON( recordset );
					
					WORKLIST_FARMACI.wkFarmaci.$wk.worklist().data.result = WORKLIST_FARMACI.wkJSON;
					WORKLIST_FARMACI.wkFarmaci.$wk.worklist().grid.populate( WORKLIST_FARMACI.wkJSON );
					
					return recordset;
					
				});
		
	},
	
	/*
	 * 	SPECULARE ALL'OMONIMA FUNZIONE DEL NAMESPACE WORKLIST_ASSISTITI
	 */
	getWorklistJSON: function( recordset )
	{
		
		var json = { 'page' : {}, 'rows' : [] };
			
		json.page = { 'total' : 1, 'current' : 1, 'size' : 100 };
		
		for( var i = 0; i < recordset.length; i++ )
		{
			
			var row = 
				{
					'COD_FARMACO':		recordset[i]['COD_FARMACO'],
					'DESCRIZIONE':		recordset[i]['DESCRIZIONE'],
					'PRINCIPIO_ATTIVO':	recordset[i]['PRINCIPIO_ATTIVO'],
					'N_ROW':			i
				};
			
			json.rows.push( row );
		
		}
		
		return json;
		
	},
	
	showLoading: function()
	{
		
		WORKLIST_FARMACI.wkFarmaci.$wk.worklist().structure.objects.get('loading').show();
		
	}
	
};