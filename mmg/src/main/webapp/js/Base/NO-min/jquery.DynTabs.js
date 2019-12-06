;(function($)
{
    function dyntabs(el, options, cbck)
    {
        this.el = $(el);
        this.id = this.el.attr("id");

        this.options	= options;

        this.callback	= cbck;

        this.init(options);
    }

    $.fn.DynTabs = function(options, callback)
    {
        var defaults = {
            idActive:null
        };

        var options = $.extend({}, defaults, options);

        var plugin = new dyntabs(this.get(0), options, callback);
        $(this).data('DynTabs', plugin);

        return plugin;
    };

    dyntabs.prototype =
    {
        init:function(options)
        {
            var $this = this;

            $ul = $this.el.find(".ulTabs");

            if($this.options.idActive === null)
            {
                $liActive = $ul.find("li:eq(0)");
                $liActive.addClass("tabActive");

                NS_DYN_TABS.comportamenti[$liActive.data("compo")].click();
            }
            else
            {
                $liActive = $ul.find("li#" + $this.options.idActive);
                $liActive.addClass("tabActive");

                NS_DYN_TABS.comportamenti[$liActive.data("compo")].click();
            }

            $ul.find("li").on("click",function()
            {
                $(this).parent().find("li.tabActive").removeClass("tabActive");
                $(this).addClass("tabActive");

                // chiamare comportamento
                var compo = $(this).data("compo");
                NS_DYN_TABS.comportamenti[compo].click();

                if(typeof $this.callback == 'function')
                {
                    $this.callback.call();
                }
            });
        },
        disable: function()
        {
            /*this.options.idActive = $("#tabs-"+this.id).find("li.tabActive").data("tab");
             $("#tabs-"+this.id).addClass("tabsDisabled");
             $("#tabs-"+this.id).find("li").off("click");*/
        },
        enable: function()
        {
            /*$("#tabs-"+this.id).removeClass("tabsDisabled");
             this.init(this.options);*/
        },
        idActive: function()
        {
            return $("#tabs-"+this.id).find("li.tabActive").data("tab");
        },
        go: function(id)
        {
            $("#tabs-"+this.id).find("li.tabActive").removeClass("tabActive");
            $("#tabs-"+this.id).find("li[data-compo='"+id+"']").addClass("tabActive");
            $("#tabs-"+this.id).find("li[data-compo='"+id+"']").trigger('click');//tapullino tapulloso

            $("#"+this.id).find(".divtab").hide();
            $("#" + id).show();
            if(typeof this.callback == 'function')
            {
                this.callback.call();
            }
        }
    }
})(jQuery);

var NS_DYN_TABS = {

    comportamenti:
    {
        Prova:function(){alert('pdb');}
    }
};

