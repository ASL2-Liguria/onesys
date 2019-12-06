$(document).ready(function()
{
	
	WORKLIST_ACCERTAMENTI.init();
	WORKLIST_ACCERTAMENTI.setEvents();
		
});

var WORKLIST_ACCERTAMENTI = 
{
	
	db:		'fenixMMG',
	store:	'ACCERTAMENTI',		
		
	init: function()
	{
		
	},
	
	setEvents: function()
	{
		
		$('#txtAccertamento').on( 'keyup', function( event ){
			event.keyCode != '13' ? $(this).val( $(this).val().toUpperCase() ) : WORKLIST_ACCERTAMENTI.loadWk();
		});
		
		$('#butApplicaAccertamento').on('click', WORKLIST_ACCERTAMENTI.loadWk );
		
	},
	
	/*
	 * 	SPECULARE ALL'OMONIMA FUNZIONE DEL NAMESPACE WORKLIST_ASSISTITI
	 */
	loadWk: function()
	{
		
		if( !OFFLINE.beforeLoadWk( $('#txtAccertamento') ) )
			return false;
				
		var 
			parameters	= 
			{
				'id':					'ACCERTAMENTI_OFFLINE',
				'container':			'divWorklistAccertamenti',
				'aBind':				[],
				'aVal':					[],
				'build_callback': { 
						'after':	WORKLIST_ACCERTAMENTI.getWorklistData,
				},
				'load_callback': { 
						'before':	WORKLIST_ACCERTAMENTI.showLoading,
				},
				'type': 'GET'
			};
	
		if( !LIB.isValid( WORKLIST_ACCERTAMENTI.wkAccertamenti ) )
		{
			
			var h = $('.contentTabs').innerHeight() - $('#fldWorklistAccertamenti').outerHeight(true) - 10;
			$( '#'+ parameters.container ).height( h );
			
		}
		
		WORKLIST_ACCERTAMENTI.wkAccertamenti = new WK( parameters );
		WORKLIST_ACCERTAMENTI.wkAccertamenti.loadWk();
		
	},
	
	/*
	 * 	SPECULARE ALL'OMONIMA FUNZIONE DEL NAMESPACE WORKLIST_ASSISTITI
	 */
	getWorklistData: function()
	{
		
		var
			accertamento	= $('#txtAccertamento').val().trim().toUpperCase(),
			recordset		= new Array(),
			dataPromise 	= 
			
				$.indexedDB( WORKLIST_ACCERTAMENTI.db ).objectStore( WORKLIST_ACCERTAMENTI.store ).index('DESCRIZIONE').each( 
					function( record )
					{
						
						recordset.push( record.value );
						
					}, IDBKeyRange.bound( accertamento, accertamento + '\uffff' ) );
			
			return dataPromise.done( 
				function()
				{
										
					WORKLIST_ACCERTAMENTI.wkJSON = WORKLIST_ACCERTAMENTI.getWorklistJSON( recordset );
					
					WORKLIST_ACCERTAMENTI.wkAccertamenti.$wk.worklist().data.result = WORKLIST_ACCERTAMENTI.wkJSON;
					WORKLIST_ACCERTAMENTI.wkAccertamenti.$wk.worklist().grid.populate( WORKLIST_ACCERTAMENTI.wkJSON );
					
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
					'CODICE':			recordset[i]['CODICE'],
					'DESCRIZIONE':		recordset[i]['DESCRIZIONE'],
					'N_ROW':			i
				};
			
			json.rows.push( row );
		
		}
		
		return json;
		
	},
	
	showLoading: function()
	{
		
		WORKLIST_ACCERTAMENTI.wkAccertamenti.$wk.worklist().structure.objects.get('loading').show();
		
	}
	
};