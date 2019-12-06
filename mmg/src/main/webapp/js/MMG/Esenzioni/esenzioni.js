$(document).ready(function() 
{
	
	ESENZIONI.init();
	ESENZIONI.setEvents();
	
});

var ESENZIONI = 
{

	init : function() 
	{
		
		home.ESENZIONI = this;
		
		ESENZIONI.loadEsenzioni();
		
	},

	setEvents : function() 
	{
		
		$('#li-tabEsenzioni').on('click', ESENZIONI.loadEsenzioni);
		
		$('#li-tabEsenzioniScadute').on('click', ESENZIONI.loadEsenzioniScadute );
		
	},

	loadEsenzioni: function()
	{
		
		var 
			parameters	= 
			{
				'id':			'ESENZIONI_PAZIENTE_25PX',
				'container':	'wkEsenzioni',
				'aBind':		['iden_anag'],
				'aVal':		[home.ASSISTITO.IDEN_ANAG]
			};
		
		if( !LIB.isValid( ESENZIONI.wkEsenzioni ) )
		{
			
			var height = $('.contentTabs').innerHeight() - $('#fldEsenzioni').outerHeight( true ); 
			
			$('#wkEsenzioni').height( height );
			
			ESENZIONI.wkEsenzioni = new WK( parameters );
			ESENZIONI.wkEsenzioni.loadWk();
			
		}
		else
			ESENZIONI.wkEsenzioni.filter( parameters );
		
	},
	
	loadEsenzioniScadute: function()
	{
		
		var 
			parameters	= 
			{
				'id':			'ESENZIONI_PAZIENTE_SCADUTE_25PX',
				'container':	'wkEsenzioniScadute',
				'aBind':		['iden_anag'],
				'aVal':		[home.ASSISTITO.IDEN_ANAG]
			};
		
		if( !LIB.isValid( ESENZIONI.wkEsenzioniScadute ) )
		{
			
			var height = $('.contentTabs').innerHeight() - $('#fldEsenzioniScadute').outerHeight( true ); 
			
			$('#wkEsenzioniScadute').height( height );
				
			ESENZIONI.wkEsenzioniScadute = new WK( parameters );
			ESENZIONI.wkEsenzioniScadute.loadWk();
			
		}
		else
			ESENZIONI.wkEsenzioniScadute.filter( parameters );
		
	},

	apriPrestazioni : function(row) {

		var iden = row[0].IDEN;
		home.NS_MMG.apri('MMG_ESENZIONI_PRESTAZIONI' + '&IDEN_ESENZIONE='
				+ iden);

	}
};