$(document).ready(function()
{

	RIEPILOGO.init();
	RIEPILOGO.setEvents();
	
	RIEPILOGO.loadWkProblemi();
	
});

var RIEPILOGO = 
{


	init: function()
	{
		
		home.RIEPILOGO				= this;
		
		RIEPILOGO.tabProblemi		= $('#li-tabProblemi');
		RIEPILOGO.tabDiarioClinico	= $('#li-tabDiarioClinico');
		RIEPILOGO.tabAccertamenti	= $('#li-tabAccertamenti');
		RIEPILOGO.tabFarmaci		= $('#li-tabFarmaci');
		
	},
	
	setEvents: function()
	{
	
		RIEPILOGO.tabProblemi.on('click', RIEPILOGO.loadWkProblemi );
		RIEPILOGO.tabDiarioClinico.on('click', RIEPILOGO.loadWkDiarioClinico );
		RIEPILOGO.tabAccertamenti.on('click', RIEPILOGO.loadWkAccertamenti );
		RIEPILOGO.tabFarmaci.on('click', RIEPILOGO.loadWkFarmaci );
		
	},
	
	loadWkProblemi: function()
	{
		
		var parameters =
			{
				'id':			'PROBLEMI',
				'container':	'divProblemi',
				'aBind':		[ 'iden_anag', 'data_da', 'data_a', 'chiuso', 'nascosto', 'iden_utente' ],
				'aVal':			[ home.ASSISTITO.IDEN_ANAG, '0' , moment().format('YYYYMMDD'), 'S,N,R', 'N', home.baseUser.IDEN_PER ]
			};
		
		if( !LIB.isValid( RIEPILOGO.wkProblemi ) )
		{
			
			$('#'+ parameters.container).height( RIEPILOGO.getWkHeight() );
			
			RIEPILOGO.wkProblemi = new WK( parameters );
			RIEPILOGO.wkProblemi.loadWk();
			
		}
		else
			RIEPILOGO.wkProblemi.filter( parameters );
		
	},
	
	loadWkDiarioClinico: function()
	{
		
		var parameters = { 'container': 'divDiarioClinico' };
		
		if( home.MMG_CHECK.isPediatra() )
		{
			
			parameters.id		= 'DIARI_WK_PLS';
			parameters.aBind	= [ 'iden_utente', 'iden_anag', 'iden_problema', 'data_da', 'data_a', 'scheda', 'iden_gruppo', 'tipo_med' ];
			parameters.aVal		= [ home.baseUser.IDEN_PER, home.ASSISTITO.IDEN_ANAG, home.ASSISTITO.IDEN_PROBLEMA, '0', moment().format('YYYYMMDD'), 'ALL', null, 'P' ];
			
		}
		else
		{
			
			parameters.id		= 'DIARI_WK';
			parameters.aBind	= [ 'iden_utente', 'iden_anag', 'iden_problema', 'data_da', 'data_a', 'scheda', 'iden_gruppo', 'tipo_med' ];
			parameters.aVal		= [ home.baseUser.IDEN_PER, home.ASSISTITO.IDEN_ANAG, home.ASSISTITO.IDEN_PROBLEMA, '0', moment().format('YYYYMMDD'), 'ALL' ];
			
		}
		
		if( !LIB.isValid( RIEPILOGO.wkDiarioClinico ) )
		{
			
			$('#'+ parameters.container).height( RIEPILOGO.getWkHeight() );
			
			RIEPILOGO.wkDiarioClinico = new WK( parameters );
			RIEPILOGO.wkDiarioClinico.loadWk();
			
		}
		else
			RIEPILOGO.wkDiarioClinico.filter( parameters );
		
	},
	
	getWkHeight: function()
	{
		
		return $('.contentTabs').innerHeight() - $( '#'+ $('.tabActive').attr('id').replace('li-', '') ).find('fieldset').outerHeight(true) - 20;
		
	}

};