;
(function ($)
{
    function printjson(el, options, onAfter)
    {
        this.el = $(el);
        this.options = options;

        if(this.options.jsonData && this.options.jsonConfig)
            this.init(this.options);
    };

    $.fn.PrintJson = function (options, onAfter)
    {
        var defaults = {
            jsonConfig:null,
            jsonData:null
        };
        var options = $.extend({}, defaults, options);

        var plugin = new printjson(this.get(0), options, onAfter);

        $(this).data('PrintJson', plugin);

        if (typeof onAfter == 'function')
        {
            onAfter.call({obj: this});
        }

        return plugin;
    };

    printjson.prototype = {
        init: function (options)
        {
            var $this = this;
            var riq = $("<div>");

            $this.el.empty();

            $.each($this.options.jsonConfig, function(k,v)
            {
                riq.append($this.generaRiquadro(k,v));
            });

            $this.el.append(riq);
        },
        generaRiquadro: function(k,v)
        {
            var div = $('<div>',{"class":"TextMini", "id":'riq' + v.key_id});

            div.append(this.generaHeader(k,v));
            div.append(this.generaContent(k,v));

            return div;
        },

        generaHeader: function(k,v)
        {
            return $('<h5>',{}).html(v.lbl);
        },

        generaContent: function(k,v)
        {
            var txt = this.options.jsonData[v.key_id];
            if(txt == '') txt = '-';
            var p = $('<p>',{"html":txt});

            return p;
        }

    }
})(jQuery);
