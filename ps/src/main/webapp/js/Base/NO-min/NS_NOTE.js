var NS_NOTE =
{

    alreadyConfirmed: false,

    icons: { note : 'icon-clipboard', plus : 'icon-plus-circled' },

    init: function () {

        /*home.NS_NOTE 			= this;*/

        NS_NOTE.iconContainer	= $('#statDx');
        NS_NOTE.noteContainer	= $('#content');
        NS_NOTE.options 		= {
            id:                 '',
            width:              250,
            height:             100,
            content:            '',
            dataAttribute:      {},
            startAsVisible:     true,
            beforeHide:         NS_NOTE.beforeHide,
            afterHide:          NS_NOTE.afterHide,
            beforeDestroy:      NS_NOTE.beforeDestroy,
            afterDestroy:       NS_NOTE.afterDestroy
        };

        home.NS_CONSOLEJS.addLogger( {
			name:		'NS_NOTE',
			console:	0
		});

        NS_NOTE.logger = home.NS_CONSOLEJS.loggers['NS_NOTE'];

        NS_NOTE.iconContainer.append( NS_NOTE.getPlusButton() );
        NS_NOTE.loadNotes();
    },

    loadNotes: function() {

        var parameters = {
            'iden_personale': { t : 'N', v : home.baseUser.IDEN_PER }
        };

        $.NS_DB.getTool({_logger: NS_NOTE.logger}).select({
			id:			'DATI.NOTE',
			parameter:	parameters
		}).done(function( response ) {
			if( typeof response.result != 'undefined' ) {
				var length = response.result.length;
				for( var i = 0; i < length; i++ ) {
					var parameters = {
						'id':				response.result[i]['IDEN'],
						'content':			response.result[i]['VALORE'],
						'startAsVisible':	false,
						'dataAttribute':	{ 'data-note-image-id' : 'icon-note-' + NS_NOTE.getNoteImageNextId() }
					};
					NS_NOTE.addNote( parameters );
				}
				if( length > 0 ) {
					home.NOTIFICA.info({
						title:		'Informazioni',
						message:	'Ci sono '+ length + ' note appuntate relative al tuo utente. Le note sono visibili solo a te.'
					});
				}
			}
		}).fail(function( jqXHR, textStatus, errorThrown ) {
			NS_NOTE.logger.error('Errore NS_NOTE.loadNotes: ' + errorThrown );
		});
    },

    getPlusButton: function() {
        return $( document.createElement('i') ).addClass( NS_NOTE.icons.plus ).attr( 'title', 'Aggiungi una nota visibile solo a te' );
    },

    addNote: function( parameters ) {
        NS_NOTE.noteContainer.Note( $.extend( NS_NOTE.options, parameters ), NS_NOTE.addNoteImage );
    },

    addNoteImage: function() {
        var id = NS_NOTE.getNoteImageNextId();
        $( document.createElement('i') )
            .attr( 'id', 'icon-note-'+ id )
            .addClass( NS_NOTE.icons.note )
            .insertAfter( NS_NOTE.iconContainer.find( '.'+ NS_NOTE.icons.plus ) );
    },

    getNoteImageNextId: function() {
        return parseInt( NS_NOTE.iconContainer.find( '.'+ NS_NOTE.icons.note ).length ) + 1;
    },

    setEvents: function() {
        NS_NOTE.iconContainer.on('click', '.'+ NS_NOTE.icons.plus, function( event ) {
			var parameters = {
				'id':				'',
				'content':			'',
				'dataAttribute':	{ 'data-note-image-id' : 'icon-note-' + NS_NOTE.getNoteImageNextId() },
				'startAsVisible':	true,
				'event': event
			};
			NS_NOTE.addNote( parameters );
		}).on('click', '.'+ NS_NOTE.icons.note, function( event ) {
			event.stopImmediatePropagation();
			var iconId	= $(this).attr('id');
			var note	= NS_NOTE.noteContainer.find('.note').filter(function(){
				return $(this).attr('data-note-image-id') == iconId;
			});
			note.data('Note').show( event );
		});
    },

    beforeHide: function() {
        var parameters	= new Object();
        var $this		= this;
        var noteId		= $this.note.attr('id');
        var text		= $this.note.find('textarea').val().trim();

        if( text != '' ) {
            parameters = {
                p_iden:             { t : 'V', v : noteId || '' },
                p_iden_personale:   { t : 'V', v : home.baseUser.IDEN_PER },
                p_valore:           { t : 'V', v : text },
                p_attivo:           { t : 'V', v : 'S' },
                p_result:			{ t : 'V', d : 'O' }
            };
            NS_NOTE.save( parameters, noteId );
        }
        return true;
    },

    beforeDestroy: function() {
        var $this	= this;
		var noteId	= typeof $this.note != 'undefined' ? $this.note.attr('id') : home.NS_NOTE.currentNote.attr('id');
        var iconId	= typeof $this.note != 'undefined' ? $this.note.attr('data-note-image-id') : home.NS_NOTE.currentNote.attr('data-note-image-id');
        var text	= typeof $this.note != 'undefined' ? $this.note.find('textarea').val() : home.NS_NOTE.currentNote.find('textarea').val();

        if( typeof $this.note != 'undefined' )
            home.NS_NOTE.currentNote = $this.note;

        parameters = {
            p_iden:             { t : 'V', v : noteId },
            p_iden_personale:   { t : 'V', v : home.baseUser.IDEN_PER },
            p_valore:           { t : 'V', v : text },
            p_attivo:           { t : 'V', v : 'N' },
            p_result:			{ t : 'V', d : 'O' }
        };

        if( !NS_NOTE.alreadyConfirmed ) {

            NS_NOTE.alreadyConfirmed = true;
			
			/*tapullo*/
			if (typeof home.NS_MMG != "undefined") {
				home.NS_MMG.confirm(
					traduzione.confermaCancellazioneNote,
					function() {
						home.NS_NOTE.currentNote.data('Note').destroy();
						NS_NOTE.alreadyConfirmed = false;
					},
					function() {
						return false;
						NS_NOTE.alreadyConfirmed = false;
					}
				);
			} else {
				if (confirm("Sei sicuro di voler eliminare questa nota?")) {
					home.NS_NOTE.currentNote.data('Note').destroy();
					return true;
				} else {
					return false;
				}
				NS_NOTE.alreadyConfirmed = false;
			}
        } else {
            NS_NOTE.remove( parameters, iconId );
            return true;
        }
    },

    save: function( parameters, noteId )
    {

        $.NS_DB
            .getTool(
            {
                _logger: NS_NOTE.logger
            })
            .call_procedure(
            {
                id:			'SALVA_NOTE',
                parameter:	parameters
            })
            .done(
            function( response )
            {

                if( typeof noteId != 'undefined')
                    $( '#'+ noteId ).attr( 'id', response['p_result'] );

            })
            .fail(
            function( jqXHR, textStatus, errorThrown )
            {

                NS_NOTE.logger.error('Errore NS_NOTE.save: ' + errorThrown );


            });

    },

    remove: function( parameters, iconId )
    {

        $.NS_DB
            .getTool(
            {
                _logger: NS_NOTE.logger
            })
            .call_procedure(
            {
                id:			'SALVA_NOTE',
                parameter:	parameters
            })
            .done(
            function( response )
            {

                if( typeof iconId != 'undefined' )
                    $( '#'+ iconId ).remove();

            })
            .fail(
            function( jqXHR, textStatus, errorThrown )
            {

                NS_NOTE.logger.error('Errore NS_NOTE.remove: ' + errorThrown );


            });

    }

};