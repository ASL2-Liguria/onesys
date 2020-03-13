;
(function ($)
{
	function Resume(element, options, onReady)
	{

		this.element            = $(element),
			this.options            = options,
			this.elements           =
			{
				resume: null,
				ul:     null,
				li:     new Array(),
				icon:   null
			}

		this.init();
		this.setEvents();

	}

	$.fn.Resume = function( options, onReady )
	{

		var options;
		var plugin;
		var defaults    =
		{
			width:                  400,
			height:                 'auto',
			title:					'',
			content:                {},
			top:                    0,
			left:                   0,
			startAsVisible:         true,
			click:                  function( row ){ return row; },
			multiSelection:         true,
			addIcon:                false,
			iconClass:              ''
		};

		options         = $.extend( defaults, options );
		plugin          = new Resume( this.get(0), options, onReady );

		plugin.elements.resume.data('Resume', plugin);

		if( typeof onReady === 'function' )  onReady.call( { obj : this } );

		return plugin;

	};

	Resume.prototype = {

		CTRLPressed: false,

		init: function()
		{

			this.createResume();
			this.addIcon();
			this.resize();
			this.setEvents();

			if(! this.options.startAsVisible ) this.elements.resume.hide();

		},

		createResume: function()
		{

			this.elements.resume = $('<div>', { 'id' : 'resume' }).appendTo( this.element );
			this.createTitle();

		},

		createTitle: function()
		{

			this.elements.title = $('<div>', { 'class' : 'resume-header', 'text' : this.options.title }).appendTo( this.elements.resume );
			this.elements.close	= $('<i>', { 'class' : 'icon-cancel-squared' }).appendTo( this.elements.title );

			this.createUnorderedList();

		},

		createUnorderedList: function()
		{

			this.elements.ul = $('<ul>').appendTo( this.elements.resume );
			this.createListItems();

		},

		createListItems: function( otherContent )
		{
			var
				li          = null,
				li_child    = null,
				content     = this.options.content;

			if( otherContent )
				content     = otherContent;


			for( var i = 0; i < content.length; i++ )
			{

				li = $('<li>', { 'html' : content[i] }).appendTo( this.elements.ul );

				this.elements.li.push( li );

			}

		},

		addIcon: function()
		{

			if( this.options.addIcon != false && $('i.'+ this.options.iconClass).length == 0 )
			{

				this.elements.icon = $('<i>', { 'class' : this.options.iconClass }).appendTo( this.options.addIcon );

			}

		},

		resize: function()
		{

			var top		= this.options.top;
			var left	= this.options.left;

			if( top == 'auto' )
				top		= ( this.element.outerHeight(true) - parseInt( this.options.height ) ) / 2;

			if( left == 'auto' )
				left	= ( this.element.outerWidth(true) - parseInt( this.options.width ) ) / 2;

			this.elements.resume
				.width( this.options.width )
				.height( this.options.height )
				.css( { 'top' : top, 'left' : left } );

		},

		setEvents: function()
		{

			var $this = this;

			if( $this.options.multiSelection )
			{

				$(document)
					.on('keydown', function( event )
					{

						if( event.keyCode == 17 ) $this.CTRLPressed = true;

					})
					.on('keyup', function()
					{

						if( event.keyCode == 17 ) $this.CTRLPressed = false;

					});

			}

			$this.elements.ul.on('click', 'li', function( event )
			{

				event.stopImmediatePropagation();
				if( ! $this.CTRLPressed )
				{

					$this.deselectRow( $this.elements.resume.find('li') );

				}

				$this.selectRow( $(this) );
				$this.options.click( $(this) );

			});

			$this.elements.icon.on('click', function( event )
			{

				event.stopImmediatePropagation();

				if( $this.elements.resume.is(':visible') )
					$this.hide();
				else
					$this.show();

			});

			$this.elements.close.on('click', function()
			{

				$this.hide();

			});

		},

		selectRow: function( obj )
		{

			obj.addClass('selected');

		},

		deselectRow: function( obj )
		{

			obj.removeClass('selected');

		},

		addRow: function( content )
		{

			this.createListItems( content );

		},

		removeRow: function( index )
		{

			this.elements.li[ index ].remove();
			this.elements.li.splice( index, 1 );
			this.elements.resume.find('li:eq('+ index +')').remove();

		},

		reloadContent: function( content )
		{

			this.elements.li = new Array();
			this.elements.ul.empty();
			this.createListItems( content );

		},

		getRows: function()
		{

			return this.elements.li;

		},

		show: function()
		{

			this.elements.resume.show();

		},

		hide: function()
		{

			this.elements.resume.hide();

		},

		destroy: function()
		{

			this.elements.resume.remove();
			this.elements.icon.remove();

		}

	}

})(jQuery);