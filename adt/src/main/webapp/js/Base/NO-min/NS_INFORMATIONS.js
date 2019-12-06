var NS_INFORMATIONS =
{
    init: function ()
    {
        var last = $('.iScheda', 'body').length;

        NS_INFORMATIONS.homeContent = $('#content');
        NS_INFORMATIONS.iframe = ( $('#iScheda-' + last).length > 0 ) ? $('#iScheda-' + last) : NS_INFORMATIONS.homeContent.find('iframe');

        NS_INFORMATIONS.key_legame = NS_INFORMATIONS.iframe.attr('data-key-legame') ? NS_INFORMATIONS.iframe.attr('data-key-legame').split('=')[1] : null;
    },

	info: function()
	{

		NS_INFORMATIONS.update();

		NS_INFORMATIONS.appendTo	= NS_INFORMATIONS.iframe.contents().find('body');
		NS_INFORMATIONS.plugin		=
			NS_INFORMATIONS.homeContent.Info(
				{
					'appendTo':				NS_INFORMATIONS.appendTo,
					'width':				350,
					'content': 				NS_INFORMATIONS.getContent(),
					'closeOnOverlayClick':	true,
					'infoClick':			function( info, event ){ return info; }
				});

	},

	getContent: function()
	{

		NS_INFORMATIONS.content = new Array();

		$.ajax('./static/informations.html',
			{
				async: 		false,
				cache:		false,
				dataType:	'html'
			})
			.done(
				function( html )
				{

					$('<div>')
						.html( html )
						.find( '#'+ NS_INFORMATIONS.key_legame.split("&")[0] +' > div')
						.each(function()
						{

							NS_INFORMATIONS.content.push(
								{

									'id' :		LIB.isValid( $(this).attr('id') ) ? $(this).attr('id') : '',
									'class':	LIB.isValid( $(this).attr('class') ) ? $(this).attr('class') : '',
									'arrow':	LIB.isValid( $(this).attr('data-arrow') ) ? $(this).attr('data-arrow') : 'left',
									'text':		$(this).html()

								});

						});

				});

		return NS_INFORMATIONS.content;

	},

	toggleInfo: function()
	{

		if( NS_INFORMATIONS.iframe.contents().find('#info-container').length <= 0 )
		{

			NS_INFORMATIONS.info();

		}
		else if ( NS_INFORMATIONS.iframe.contents().find('#info-container:hidden').length > 0 )
		{

			NS_INFORMATIONS.plugin.show();

		}
		else
		{

			NS_INFORMATIONS.plugin.hide();

		}

	},

	setEvents: function()
	{


	},

	update: function()
	{

		NS_INFORMATIONS.init();

	}

}