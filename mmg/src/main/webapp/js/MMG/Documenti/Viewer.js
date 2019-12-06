$(document).ready(function()
{
	
	VIEWER.init();
	VIEWER.setEvents();
	
});

var VIEWER = 
{
	init:function(){
			
		var uri = $("#URI").val();
		var descrizione = $("#DESCRIZIONE").val();
		document.getElementById("lblTitolo").innerHTML = "<h2> DOCUMENTO: " + descrizione + "</h2>";
		$("#ifrload").attr("src", uri);

	},
		
	setEvents:function(){

	},
		
	/*init: function()
	{
		
		var $this = this;
		$this.loadDocument();
		$('#lblTitolo').text( 'Stai visualizzando il file: '+ $this.getTitle() );
	},
	
	loadDocument: function()
	{
		
		var 
			$this		= this, 
			url			= $this.getDocumentUrl(), 
			extension	= url.split('.'),
			parameters;
		
		extension	= extension[ extension.length - 1 ];
		extension = 'jpg';
		url = 'http://localhost:8080/fenixMMG/web/sfondoPulsanti.jpg';
		parameters	=
		{
			'width':	'100%',
			'height':	'100%',
			'type':		LIB.getMymeType( extension ),
			'src':		url
		};
		
		$this.embed = $( document.createElement('embed') ).attr( parameters ).appendTo( '.contentTabs' );
		
		home.NS_LOADING.hideLoading();
		
	},
	
	getDocumentUrl: function()
	{	
		
		return $('#URL').val();
		
	},
	
	getTitle: function()
	{
		
		var $this = this, doc = $this.getDocumentUrl().split('/');
		
		return doc[ doc.length - 1 ];
		
	}*/
	
		
};