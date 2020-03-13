;
(function ($)
{
    function ulfunc(el, options, onAfter)
    {
        this.el = $(el);
        this.options = options;
        this.init(options);
    };

    $.fn.UlFunc = function (options, onAfter)
    {
        var defaults = {};
        var options = $.extend({}, defaults, options);

        var plugin = new ulfunc(this.get(0), options, onAfter);

        $(this).data('UlFunc', plugin);

        if (typeof onAfter == 'function')
        {
            onAfter.call({obj: this});
        }

        return plugin;
    };

    ulfunc.prototype = {
        init: function (options)
        {
            var $this = this;

            $this.el.find("li > a").DisableSelection();
        },
        show: function (id)
        {
            this.el.find('#' + id).closest('li').addClass('shownFunc').removeClass('hiddenFunc').show();
        },
        hide: function (id)
        {
            this.el.find('#' + id).closest('li').removeClass('shownFunc').addClass('hiddenFunc').hide();
        },
        shown: function (id)
        {
            return this.el.find('#' + id).closest('li').hasClass("shownFunc");
        },
        hidden: function ()
        {
            return this.el.find('#' + id).closest('li').hasClass("hiddenFunc");
        }
    }
})(jQuery);
