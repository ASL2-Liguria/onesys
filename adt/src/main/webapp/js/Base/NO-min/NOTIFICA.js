/*
 * Ambiance - Notification Plugin for jQuery
 * Version 1.0.1
 * @requires jQuery v1.7.2
 *
 * Copyright (c) 2012 Richard Hsu
 * Documentation: http://www.github.com/richardhsu/jquery.ambiance
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($) {
    $.fn.ambiance = function(options) {

        var defaults = {
            title: "",
            message: "",
            type: "default",
            permanent: false,
            timeout: 2,
            fade: true,
            width: 300
        };

        var options = $.extend(defaults, options);
        var note_area = $("#ambiance-notification");

        // Construct the new notification.
        var note = $(window.document.createElement('div'))
            .addClass("ambiance")
            .addClass("ambiance-" + options['type']);

        if(options['id'])
        {
            var id = "notifica_" + options['id'];
            $('#' + id).remove();
            note.attr("id",id);
        }


        note.css({width: options['width']});


        // Deal with adding the close feature or not.
        if (!options['permanent']) {
            note.prepend($(window.document.createElement('a'))
                .addClass("ambiance-close")
                .attr("href", "#_")
                .html("&times;"));

        }

        // Deal with adding the title if given.
        if (options['title'] !== "") {
            note.append($(window.document.createElement('div'))
                .addClass("ambiance-title")
                .append(options['title']));
        }

        // Append the message (this can also be HTML or even an object!).
        note.append(options['message']);

        // Add the notification to the notification area.
        note_area.append(note);

        // Deal with non-permanent note.
        if (!options['permanent']) {
            if (options['timeout'] != 0) {
                if (options['fade']) {
                    note.delay(options['timeout'] * 1000).fadeOut('slow');
                    note.queue(function() { $(this).remove(); });
                } else {
                    note.delay(options['timeout'] * 1000)
                        .queue(function() { $(this).remove(); });
                }
            }
        }
    };
    $.ambiance = $.fn.ambiance; // Rename for easier calling.
})(jQuery);

var NOTIFICA = {

    init:function()
    {
        if ($("#ambiance-notification").length == 0) {
            var note_area = $(window.document.createElement('div'))
                .attr("id", "ambiance-notification");
            $('body').append(note_area);
        }
    },
    error:function(params)
    {
        params.type = 'error';
        NOTIFICA.ambiance(params);
    },
    success:function(params)
    {
        params.type = 'success';
        NOTIFICA.ambiance(params);
    },
    warning:function(params)
    {
        params.type = 'warning';
        NOTIFICA.ambiance(params);
    },
    important: function( params )
    {
        params.type = 'important-warning';
        NOTIFICA.ambiance(params);
    },
    info:function(params)
    {
        params.type = 'info';
        NOTIFICA.ambiance(params);
    },
    ambiance:function(params)
    {
        LIB.checkParameter(params,"type","info");
        LIB.checkParameter(params,"timeout","5");
        LIB.checkParameter(params,"width","400");

        params.permanent = false;

        $.ambiance(params);
    }
};

$(document).ready(NOTIFICA.init);
$(document).on("click",".ambiance-close",function(){$(this).parent().remove();return false;});