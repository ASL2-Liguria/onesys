$(document).ready(function ()
{
	
	if( !LIB.isValid( home.MAIN_PAGE.NUOVO_ACCESSO_MOSTRATO ) ){
		home.MAIN_PAGE.NUOVO_ACCESSO_MOSTRATO = {};
	}
	
	//controllo il parametro del nuovo accesso e se l'ho già aperto o meno per il paziente in questione in questa sessione di lavoro
	if( home.baseUser.MOSTRA_NUOVO_ACCESSO == 'S' && (typeof home.MAIN_PAGE.NUOVO_ACCESSO_MOSTRATO[home.ASSISTITO.IDEN_ANAG] == 'undefined' || home.MAIN_PAGE.NUOVO_ACCESSO_MOSTRATO[home.ASSISTITO.IDEN_ANAG] != 'S')){
		
		home.NS_MMG.apri( 'NUOVO_ACCESSO' );
		home.MAIN_PAGE.NUOVO_ACCESSO_MOSTRATO[home.ASSISTITO.IDEN_ANAG] = 'S';
	}
	
	//controllo che l'anagrafica non sia da completare
	if( home.ASSISTITO.READONLY == 'S'){
		
		home.NS_MMG.apri( 'SCHEDA_ANAGRAFICA_MMG', "&STATO_ANAGRAFICA=DA_COMPLETARE");
	}
	
	RIEPILOGO.init( {} );
	RIEPILOGO.setEvents();
	
});

var RIEPILOGO = {
		
	init: function( parameters ){
		
		home.RIEPILOGO		= this;
		RIEPILOGO.options	= $.extend( RIEPILOGO.getDataToLoad(), parameters || {} );
		
		RIEPILOGO.loadData( RIEPILOGO.options, RIEPILOGO.resize );
		
		//parte commentata dove avevo cominciato a ragionare sulla grandezza resizable degli iframe. Ricordarsi che devono essere messi dentro ad un div
		/*$( "#Riepilogo1" ).addClass("ui-widget-content");
		$( "#Riepilogo2" ).addClass("ui-widget-content");
		$( "#Riepilogo3" ).addClass("ui-widget-content");
		$( "#Riepilogo4" ).addClass("ui-widget-content");
		

		$( "#Riepilogo1" ).resizable({
			start: function(event, ui) {
				ui.element.append($("<div/>", {
					id: "iframe-barrier",
					css: {
						position: "absolute",
						top: 0,
						right: 0,
						bottom: 0,
						left: 0,
						"z-index": 10
				}
				}));
			},
			stop: function(event, ui) {
				$("#iframe-barrier", ui.element).remove();
			},
			resize: function(event, ui) {
				$("iframe", ui.element).width(ui.size.width).height(ui.size.height);
			}
		});
		$( "#Riepilogo2" ).resizable();
		$( "#Riepilogo3" ).resizable();
		$( "#Riepilogo4" ).resizable();
		*/
	},
	
	setEvents: function(){
		
		$(window)
			.resize( function(event){ RIEPILOGO.resize(); })
			.on('unload',function(){ home.RIEPILOGO = null; });
	},
	
	getDataToLoad: function(){
		
		var 
			options		= new Object(),
			layout_num	= LIB.getParamUserGlobal( 'LAYOUT', 4 );
			layout		= LIB.getParamUserGlobal( 'LAYOUT_' + layout_num, 'RIEP_ACCESSI_PROBLEMI,TAB_RR_FARMACI,DIARI_WK,TAB_RR_ACCERTAMENTI' ).split(',');
			
		if ( layout_num == 4 ) 
		{
		
			options = 
			{
			
				'iframes': 
						[
						 	{ 'id' : '#Riepilogo1', 'width' : '40%', 'height' : '50%', 'float' : 'left',  'src' : 'page?KEY_LEGAME=' + layout[0] },
							{ 'id' : '#Riepilogo2', 'width' : '60%', 'height' : '50%', 'float' : 'right', 'src' : 'page?KEY_LEGAME=' + layout[1] },
				       	 	{ 'id' : '#Riepilogo3', 'width' : '40%', 'height' : '50%', 'float' : 'left',  'src' : 'page?KEY_LEGAME=' + layout[2] },
				       	 	{ 'id' : '#Riepilogo4', 'width' : '60%', 'height' : '50%', 'float' : 'right', 'src' : 'page?KEY_LEGAME=' + layout[3] }
				       	]
			
			};
				
		}
		else if ( layout_num == 3 )
		{
			
			options = 
			{
			
				'iframes': 
						[
						 	{ 'id' : '#Riepilogo1', 'width' : '50%', 'height' : '100%','float' : 'left',  'src' : 'page?KEY_LEGAME=' + layout[0] },
							{ 'id' : '#Riepilogo2', 'width' : '50%', 'height' : '65%', 'float' : 'right', 'src' : 'page?KEY_LEGAME=' + layout[1] },
				       	 	{ 'id' : '#Riepilogo3', 'width' : '50%', 'height' : '35%', 'float' : 'right', 'src' : 'page?KEY_LEGAME=' + layout[2] }
				       	]
			
			};
			
			$('#Riepilogo4').css('display', 'none');
			
		}
		else if ( layout_num == 2 ) 
		{
			
			options = 
			{
			
				'iframes': 
						[
						 	{ 'id' : '#Riepilogo1', 'width' : '50%', 'height' : '100%', 'float' : 'left',  'src' : 'page?KEY_LEGAME=' + layout[0] },
							{ 'id' : '#Riepilogo2', 'width' : '50%', 'height' : '100%', 'float' : 'right', 'src' : 'page?KEY_LEGAME=' + layout[1] }
				       	]
								       	
			};
			
			$('#Riepilogo3, #Riepilogo4').css('display', 'none');
			
		}
		
		return options;
		
	},
	
	loadData: function( options, callBack ){
		
		var med_iniz = '';
		
		/* inserito per la medicina di iniziativa ma da valutare se prendere informazioni in altra maniera */
		if(home.baseUser.TIPO_UTENTE == 'M' && home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0){			
			med_iniz 	= '&MED_INIZ=S';
		}
		
		var parameters 	= home.NS_MMG.getCommonParameters() + med_iniz;
			
		for( var i = 0; i < options.iframes.length; i++ ){
			
			$( options.iframes[i]['id'] ).attr('src', options.iframes[i]['src'] + parameters + '&IDFRAME=' + options.iframes[i]['id'].replace('#','') );
		}
		
 		if( typeof callBack === 'function' ){
 			callBack();
 		}
	},
	
	resize: function()
	{
		
		var 
			body			= $('body'),
			margin			= 5,
			options			= RIEPILOGO.options,
			totalWidth		= home.MAIN_PAGE.iContent.innerWidth() - body.pixels('paddingTop') - body.pixels('paddingBottom'),
			totalHeight		= home.MAIN_PAGE.iContent.innerHeight() - body.pixels('paddingLeft') - body.pixels('paddingRight');
		
		for( var i = 0; i < options.iframes.length; i++ ){
			
			var partialWidth	= parseInt( totalWidth / 100 * options.iframes[i]['width'].replace('%','') ) - ( margin * 2 );
			var partialHeight	= parseInt( totalHeight / 100 * options.iframes[i]['height'].replace('%','') ) - margin;
			
			$( options.iframes[i]['id'] ).css( 
					{
						'width': 	partialWidth,
						'height':	partialHeight,
						'float':	options.iframes[i]['float']
					});
			
			home.RIEPILOGO[ options.iframes[i]['id'].replace('#','') ] = new Object();
			
			home.RIEPILOGO[ options.iframes[i]['id'].replace('#','') ].iframeHeight = partialHeight;
		}
	},
	
	notify: function( type, title, msg )
	{
		
		home.NOTIFICA[ type ]( { title : title, message	: msg } );
		
	},
	
	expand: function( id, callBack )
	{
		
		var iFrame	= $('#'+ id );
		var width	= home.MAIN_PAGE.iContent.innerWidth() - 10;
		var height	= home.MAIN_PAGE.iContent.innerHeight();
		
		home.RIEPILOGO.oldStyle			= iFrame.attr('style');
		home.RIEPILOGO.oldiframeHeight	= home.RIEPILOGO[id].iframeHeight;
		home.RIEPILOGO[id].iframeHeight	= height;
		
		iFrame.css({ 'width' : width, 'height': height }).addClass('full');
		
		if( typeof callBack === 'function' )
			callBack();
		
		iFrame.attr('src', iFrame.attr('src') );
		
	},
	
	setLayout: function( id, namespace, doc )
	{	
		if ( typeof id != 'undefined') 
			RIEPILOGO.setDefaultLayout( id, namespace );
		else 
			RIEPILOGO.setWrapperLayout( doc );
		
	},
	
	setDefaultLayout: function( id, namespace ) {
		var iFrame			= $( '#' + id );
		var content			= iFrame.contents();
		var height			= RIEPILOGO.getIFrameHeight( id );	
		var iconResizeFull	= $( document.createElement('i') ).addClass('icon-resize-full-1').attr('title', 'Espandi');
		var iconResizeSmall	= $( document.createElement('i') ).addClass('icon-resize-small-1').attr('title', 'Restringi');

		content.find('.contentTabs').height( height );
		
		iconResizeFull.on('click', function(){ home.RIEPILOGO.expand( id, home[namespace].adattaLayout ); });
			
		iconResizeSmall.on('click', function(){ home.RIEPILOGO.resize(); iFrame.removeClass('full').attr( 'src', iFrame.attr('src') ); });
		
		content.find('.iconContainer').append( iconResizeFull, iconResizeSmall );
	},
	
	setWrapperLayout: function( doc )  {
		var height 		= home.RIEPILOGO_WRAPPER.getContentHeight(); 
		doc.find('.contentTabs').height( height );
	},
	
	getIFrameHeight: function( id ) {
		
		var iFrame			= $('#'+id);
		var content			= iFrame.contents();
		var iframeHeight	= home.RIEPILOGO[id].iframeHeight;
		var headerTabs		= content.find('.headerTabs').outerHeight( true );
		var footerTabs		= content.find('.footerTabs').outerHeight( true );
		
		return iframeHeight - headerTabs - footerTabs;
		
	},
	
	toggleButtons: function( id ){
		
		var iFrame			= $('#'+id);
		var content			= iFrame.contents();
		
		if( iFrame.hasClass('full') ){
			
			content.find('.icon-resize-full-1').hide();
			content.find('.icon-resize-small-1').show();
			
		}else{
			
			content.find('.icon-resize-full-1').show();
			content.find('.icon-resize-small-1').hide();
		}
	}			
};
