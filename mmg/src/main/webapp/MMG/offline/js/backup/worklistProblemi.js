$(document).ready(function()
{
	
	WORKLIST_PROBLEMI.init();
	WORKLIST_PROBLEMI.setEvents();
		
});

var WORKLIST_PROBLEMI = 
{
	
	db:		'fenixMMG',
	store:	'PROBLEMI',		
		
	init: function()
	{
		
	},
	
	setEvents: function()
	{
		
		$('#txtProblema').on( 'keyup', function( event ) {
			event.keyCode != '13' ? $(this).val( $(this).val().toUpperCase() ) : WORKLIST_PROBLEMI.loadWk();
		});
		
		$('#butApplicaProblema').on('click', WORKLIST_PROBLEMI.loadWk );
		
	},
	
	/*
	 * 	SPECULARE ALL'OMONIMA FUNZIONE DEL NAMESPACE WORKLIST_ASSISTITI
	 */
	loadWk: function()
	{
		
		if( !OFFLINE.beforeLoadWk( $('#txtProblema') ) )
			return false;
		
		var 
			parameters	= 
			{
				'id':					'OFFLINE_PROBLEMI',
				'container':			'divWorklistProblemi',
				'aBind':				[],
				'aVal':					[],
				'build_callback': { 
						'after':	WORKLIST_PROBLEMI.getWorklistData,
				},
				'load_callback': { 
						'before':	WORKLIST_PROBLEMI.showLoading,
				},
				'type': 'GET'
			};
	
		if( !LIB.isValid( WORKLIST_PROBLEMI.wkProblemi ) )
		{
			
			var h = $('.contentTabs').innerHeight() - $('#fldWorklistProblemi').outerHeight(true) - 10;
			$( '#'+ parameters.container ).height( h );
			
		}
		
		WORKLIST_PROBLEMI.wkProblemi = new WK( parameters );
		WORKLIST_PROBLEMI.wkProblemi.loadWk();
		
	},
	
	/*
	 * 	SPECULARE ALL'OMONIMA FUNZIONE DEL NAMESPACE WORKLIST_ASSISTITI
	 */
	getWorklistData: function()
	{
		
		var
			problema	= $('#txtProblema').val().trim().toUpperCase(),
			recordset	= new Array(),
			dataPromise = 
			
				$.indexedDB( WORKLIST_PROBLEMI.db ).objectStore( WORKLIST_PROBLEMI.store ).index('DESCRIZIONE').each( 
					function( record )
					{

						recordset.push( record.value );
						
					}, IDBKeyRange.bound( problema, problema + '\uffff' ) );
			
			return dataPromise.done( 
				function()
				{
										
					WORKLIST_PROBLEMI.wkJSON = WORKLIST_PROBLEMI.getWorklistJSON( recordset );
					
					WORKLIST_PROBLEMI.wkProblemi.$wk.worklist().data.result = WORKLIST_PROBLEMI.wkJSON;
					WORKLIST_PROBLEMI.wkProblemi.$wk.worklist().grid.populate( WORKLIST_PROBLEMI.wkJSON );
					
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
					'IDEN':			recordset[i]['IDEN'],
					'DESCRIZIONE':		recordset[i]['DESCRIZIONE'],
					'N_ROW':			i
				};
			
			json.rows.push( row );
		
		}
		
		return json;
		
	},
	
	showLoading: function()
	{
		
		WORKLIST_PROBLEMI.wkProblemi.$wk.worklist().structure.objects.get('loading').show();
		
	}
	
};