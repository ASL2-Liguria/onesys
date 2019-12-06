$(document).ready(function()
{
	
	VISUALIZZATORE.init();
	VISUALIZZATORE.setEvents();
	
});

var VISUALIZZATORE =
{
		
	init: function()
	{
		
		home.VISUALIZZATORE = this;
		
		VISUALIZZATORE.iframe = $('#iDocument');
		
		VISUALIZZATORE.setTitle();
		VISUALIZZATORE.loadDocument();
		
	},
	
	setEvents: function()
	{
		
		
		
	},
	
	setTitle: function()
	{
		
		var path = $('#path').val(), tmp, titolo = '';
		
		if( LIB.isValid( path ) )
		{
			
			tmp		= path.split('/');
			titolo	= 'Visualizzazione del file '+ tmp[ tmp.length - 1 ];
			
		}
		
		$('#lblTitolo').find( 'span' ).text( titolo );
		
		
	},
	
	getDocumentPath: function()
	{
		
		return $('#path').val();
		
	},
	
	getIframeDimensions: function()
	{
		
		var dimensions = { 'width' : 0, 'height' : 0 };
		
		dimensions.width	= $('.contentTabs').innerWidth() - 20;
		dimensions.height	= $('.contentTabs').innerHeight() - 20;
		
		return dimensions;
		
	},
	
	loadDocument: function()
	{
		
		VISUALIZZATORE.iframe
			.css( VISUALIZZATORE.getIframeDimensions() )
				.attr( 'src', VISUALIZZATORE.getDocumentPath() ); 
		
	}
		
};