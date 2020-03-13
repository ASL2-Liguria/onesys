;(function($)
{
    function ullist(el, options, onAfter)
    {
        this.el = $(el);
        this.options = options;
        this.init(options);
    };

    $.fn.UlList = function (options, onAfter)
    {
        var defaults = {
            splitter: ","
        };
        var options = $.extend({}, defaults, options);

        var plugin = new ullist(this.get(0), options, onAfter);

        $(this).data('UlList', plugin);

        if (typeof onAfter == 'function')
        {
            onAfter.call({obj:this});
        }

        return plugin;
    };

    ullist.prototype = {
        init: function (options)
        {
            var $this = this;

            $this.el.on("click","li",function(e)
            {
                e.stopImmediatePropagation();
                $lithis = $(this);

                if($lithis.hasClass("selected"))
                    $lithis.removeClass("selected");
                else
                    $lithis.addClass("selected");

                $this.triggerChange($lithis);
            });

            $this.el.find("li").DisableSelection();
        },
        selectAll:function()
        {
            this.el.find("li").addClass("selected");
            this.triggerChange(this.el);
        },
        deselectAll:function()
        {
            this.el.find("li").removeClass("selected");
            this.triggerChange(this.el);
        },
        select:function(id)
        {
            $li = this.el.find("li#"+id);
            $li.addClass("selected");
            this.triggerChange($li);
        },
        deselect:function(id)
        {
            $li = this.el.find("li#"+id);
            $li.removeClass("selected");
            this.triggerChange($li);
        },
        isSelected:function(id)
        {
            return this.el.find("li#"+id).hasClass("selected");
        },
        getSplitter:function()
        {
            return this.options.splitter;
        },
        val:function(attribute)
        {
            var $this = this;
            var obj = this.el.find(".selected");
            var attr = (typeof attribute != 'undefined') ? attribute : "id";

            var result = "";
            $.each(obj, function (index, value)
            {
                if(index > 0) result += $this.options.splitter;
                result += $(value).data(attr);
            })
            return result;
        },
        triggerChange:function(el)
        {
            this.el.trigger("change",el);
        },
        disable:function()
        {
            this.el.off("click","li");
        },
        enable:function()
        {
            this.init();
        }
    }
})(jQuery);
