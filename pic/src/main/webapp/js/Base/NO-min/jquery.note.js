;
(function ($)
{

    function Note( element, options, onReady )
    {

        this.element            = $(element),
            this.options            = options,
            this.note				= null;

        this.init(options.event);
        this.setEvents();

    }

    $.fn.Note = function( options, onReady )
    {
        var plugin;
        var defaults    =
        {
            id:                     '',
            width:                  300,
            height:                 100,
            content:                '',
            dataAttribute:          {},
            startAsVisible:         true,
            beforeShow:             function(){ return true; },
            afterShow:				function(){ return false; },
            beforeHide:             function(){ return true; },
            afterHide:              function(){ return false; },
            beforeDestroy:          function(){ return true; },
            afterDestroy:           function(){ return false; }
        };

        options	= $.extend( defaults, options );
        plugin	= new Note( this.get(0), options, onReady );

        plugin.note.data( 'Note', plugin );

        if( typeof onReady === 'function' )
            onReady.call( { obj : this } );

        return plugin;

    };

    Note.prototype = {

        classes:        { note : 'note note-gradient', header : 'header', content : 'content', iconSave : 'icon-floppy', iconHide : 'icon-minus', iconClose : 'icon-trash' },
        extraOffset:    { top: -30, left: 5 },

        init: function(event)
        {

            var $this	= this;
            $this.note	= $this.createNote();

            $this.resize(event);
            $this.setEvents();

            if(! $this.options.startAsVisible )
                $this.note.hide();

        },

        createNote: function()
        {

            var $this = this;

            return  $( document.createElement('div') )
                .attr( 'id', $this.getId() )
                .attr( $this.options.dataAttribute )
                .addClass( $this.classes.note )
                .append( $this.getHeader() )
                .append( $this.getContent() )
                .appendTo( $this.element );

        },

        getId: function()
        {

            var $this = this;

            return ( $this.options.id != '' ) ? $this.options.id : ( $( '.note', $this.element ).length > 0  ? $( '.note', $this.element ).length : 0 );

        },

        getHeader: function()
        {

            var
                $this	= this,
                icon	= $( document.createElement('i') ),
                header	= $( document.createElement('div') );

            header.addClass( $this.classes.header );

            icon
                .clone()
                .addClass( $this.classes.iconSave )
                .attr( 'title', 'Salva e Chiudi' )
                .appendTo( header );

            icon
                .clone()
                .addClass( $this.classes.iconHide )
                .attr( 'title', 'Nascondi' )
                .appendTo( header );

            icon
                .clone()
                .addClass( $this.classes.iconClose )
                .attr( 'title', 'Elimina' )
                .appendTo( header );

            return header;

        },

        getContent: function()
        {

            var
                $this 		= this,
                content		= $( document.createElement('div') ),
                textarea	= $( document.createElement('textarea') );

            content.addClass( $this.classes.content );

            textarea
                .attr('maxLength', 4000 )
                .val( $this.options.content )
                .appendTo( content );

            return content;

        },

        resize: function( event )
        {

            var $this = this, e, header;

            $this.note
                .css(
                {
                    'width':	$this.options.width,
                    'height':	$this.options.height
                });

            if( typeof window.event != "undefined" && typeof window.event.pageX != 'undefined' &&  typeof window.event.pageY != 'undefined' )
                e = window.event;
            else if( typeof event != 'undefined' )
                e = event;
            else
                e = '';

            if( e != '' )
            {

                $this.note
                    .css(
                    {
                        'top':	( e.pageY - $this.options.height + $this.extraOffset.top ),
                        'left':	( e.pageX - $this.options.width + $this.extraOffset.left )
                    });

            }

            header = $this.note.find( '.'+ $this.classes.header );

            $this.note
                .find('textarea')
                .css( 'height', ( $this.options.height - header.outerHeight( true ) - 5 ) );

        },

        setEvents: function()
        {

            var $this = this;

            $this.note
                .on('click', '.'+ $this.classes.iconSave,
                function( event )
                {

                    event.stopImmediatePropagation();

                    $this.hide();

                })
                .on('click', '.'+ $this.classes.iconHide,
                function( event )
                {

                    event.stopImmediatePropagation();

                    $this.hide();

                })
                .on('click', '.'+ $this.classes.iconClose,
                function( event )
                {

                    event.stopImmediatePropagation();

                    $this.destroy();

                })
                .on('focus', 'textarea',
                function( event )
                {

                    $this.note.addClass('focused');

                })
                .on('blur', 'textarea',
                function( event )
                {

                    $this.note.removeClass('focused');

                });

        },

        show: function( event )
        {

            var $this = this;

            if( $this.options.beforeShow.apply( $this ) )
            {

                if( typeof event != 'undefined' )
                    $this.resize( event );

                $this.note.show();

                $this.options.afterShow.apply( $this );

            }

        },

        hide: function()
        {

            var $this = this;

            if( $this.options.beforeHide.apply( $this ) )
            {

                $this.note.hide();

                $this.options.afterHide.apply( $this );

            }

        },

        destroy: function()
        {

            var $this = this;

            if( $this.options.beforeDestroy.apply( $this ) )
            {

                $this.note.remove();

                $this.options.afterDestroy.apply( $this );

            }

        }

    };

})(jQuery);