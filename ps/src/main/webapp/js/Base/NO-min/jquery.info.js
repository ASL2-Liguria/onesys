;
(function ($)
{
	function Info(element, options, onReady)
	{

		this.element            = $(element),
		this.elements			= new Object(),
		this.options            = options;

		this.init();

	}

	$.fn.Info = function( options, onReady )
	{

		var options, plugin;
		var defaults    =
		{
			appendTo:				'body',
			width:					300,
			height:					'auto',
			content:                [],
			closeOnOverlayClick:	true,
			infoClick:				function( info, event ){ return info; }
		};

		options         = $.extend( defaults, options );
		plugin          = new Info( this.get(0), options, onReady );

		plugin.element.data('Info', plugin);

		if( typeof onReady === 'function' )  onReady.call( { obj : this } );

		return plugin;

	};

	Info.prototype = {

		init: function()
		{

			if( $('#info-container', this.options.appendTo).length > 0 )
				this.destroy();

			this.createOverlay();
			this.createInfoContainer();
			this.resize();
			this.setEvents();

		},

		createOverlay: function()
		{

			this.elements.overlay = $('<div>', { 'id' : 'info-overlay' } ).appendTo( this.options.appendTo );

		},

		createInfoContainer: function()
		{

			this.elements.info_container = $('<div>', { 'id' : 'info-container' } ).appendTo( this.options.appendTo );
			this.readContent();

		},

		readContent: function()
		{

			for( var i = 0; i < this.options.content.length; i++ )
				this.createInfo( this.options.content[i] );

		},

		createInfo: function( content )
		{

			var configurations =
			{
				'id':		content['id'],
				'class':	content['class'],
				'arrow':	content['arrow']
			};

			this.elements.info =
					$('<div>',
						{

							'class' :					'info',
							'data-refers-to-id' : 		content['id'],
							'data-refers-to-class' : 	content['class'],
							'data-configuration':		JSON.stringify( configurations )

						}).appendTo( this.elements.info_container );

			this.elements.info.width( this.options.width ).height( this.options.height );

			this.createContent( content['text'] );
			this.createArrow();

		},

		createContent: function( text )
		{

			this.elements.content = $('<div>', { 'class' : 'content', 'html' : text }).appendTo( this.elements.info );

		},

		createArrow: function()
		{

			this.elements.arrow = $('<div>', { 'class' : 'arrow' }).appendTo( this.elements.info );

		},

		resize: function()
		{

			var $this = this, selector, configuration, element, direction;

			$('.info', $this.elements.info_container ).each(function()
			{

				$this.updateReferences( $(this) );

				selector		= ( $(this).attr('data-refers-to-id') != '' ) ? '#'+ $(this).attr('data-refers-to-id') : '.'+ $(this).attr('data-refers-to-class');
			    element 		= $( selector, $this.options.appendTo ).first();
				configuration	= $.parseJSON( $(this).attr('data-configuration') );
				direction		= configuration.arrow;

				$this.setPosition( $(this), element, direction );
				$this.setArrowPosition( $(this), element, direction );

			});

		},

		setPosition: function( info, element, direction )
		{

			var offset = element.offset(), top, left;

			switch( direction )
			{

				case 'top':

					top		= offset.top + element.outerHeight(false) + 12 ;
					left	= offset.left + ( element.outerWidth(false) / 2 ) - ( info.outerWidth(false) / 2 );

					break;

				case 'bottom':

					top		= offset.top - info.outerHeight(false) - 12;
					left	= offset.left + ( element.outerWidth(false) / 2 ) - ( info.outerWidth(false) / 2 );

					break;

				case 'left':

					top		= offset.top + ( element.outerHeight(false) / 2 ) - ( info.outerHeight(false) / 2 );
					left	= offset.left + element.outerWidth(false) + 12;

					break;

				case 'right':

					top		= offset.top + ( element.outerHeight(false) / 2 ) - ( info.outerHeight(false) / 2 );
					left	= offset.left - info.outerWidth(false) - 12;

					break;

				default:
					offset	= false;

			}

			info.css( { 'top' : parseInt( top ), 'left' : parseInt( left ) } );

		},

		setArrowPosition: function( info, element, direction )
		{

			var offset = element.offset(), top, left;

			switch( direction )
			{

				case 'top':

					top 	= - 12;
					left	= ( info.outerWidth(false) / 2 ) - 12;

					break;

				case 'bottom':

					top 	= info.outerHeight(false);
					left	= ( info.outerWidth(false) / 2 ) - 12;

					break;

				case 'left':

					top		= ( info.outerHeight(false) / 2 ) - 12;
					left	= - 12;

					break;

				case 'right':

					top		= ( info.outerHeight(false) / 2 ) - 12;
					left	= info.outerWidth(false);

					break;

				default:
					offset	= false;

			}

			info.find('.arrow').addClass( direction ).css( { 'top' : parseInt( top ), 'left' : parseInt( left ) } );

		},

		updateReferences: function( info )
		{

			this.elements.info		= info;
			this.elements.arrow		= info.find('.arrow');
			this.elements.content	= info.find('.content');

			return this.elements;

		},

		setEvents: function()
		{

			var $this = this;

			if( $this.options.closeOnOverlayClick )
			{

				$this.elements.info_container.on('click', function( event )
				{

					$this.hide();

				});

			}

			$this.elements.info_container.on('click', '.info', function( event )
			{

				$this.options.infoClick( $(this), event );

			});

			$this.elements.info_container
				.on('mouseenter', '.info', function()
				{

					var selector = ( $(this).attr('data-refers-to-id') != '' ) ? '#'+ $(this).attr('data-refers-to-id') : '.'+ $(this).attr('data-refers-to-class');

					$( selector, $this.options.appendTo ).addClass('info-hover');

				})
				.on('mouseleave', '.info', function()
				{

					var selector = ( $(this).attr('data-refers-to-id') != '' ) ? '#'+ $(this).attr('data-refers-to-id') : '.'+ $(this).attr('data-refers-to-class');

					$( selector, $this.options.appendTo ).removeClass('info-hover');

				});

		},

		show: function()
		{

			this.elements.info_container.show();
			this.elements.overlay.show();

		},

		hide: function()
		{

			this.elements.info_container.hide();
			this.elements.overlay.hide();

		},

		destroy: function()
		{

			this.elements.info_container.remove();
			this.elements.overlay.remove();

		}

	}

})(jQuery);

