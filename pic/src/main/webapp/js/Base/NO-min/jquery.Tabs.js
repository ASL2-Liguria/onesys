;(function($)
{
    function tabs(el, options, cbck)
    {
	    this.el = $(el);
        this.id = this.el.attr("id");
        this.options	= options;
        this.callback	= cbck;
        this.init(options);
    }

    $.fn.Tabs = function(options, callback)
    {
        var defaults = {
            idActive:null,
            headerVisible:true
        };

        var options = $.extend({}, defaults, options);

        var plugin = new tabs(this.get(0), options, callback);
        $(this).data('Tabs', plugin);

        return plugin;
    };

    tabs.prototype =
    {
        init:function(options)
        {
            var $this = this;

            var $ul = $("<ul/>", {
                id : "tabs-" + $this.el.prop("id")
            }).addClass("ulTabs");

            $dt = $this.el.find(".divtab");
            $dt.hide();

            $.each($dt,function(idx,val)
            {
                var $li = $("<li/>", {
                    id:"li-"+$(val).prop("id"),
                    'data-tab': $(val).prop("id"),
                    text: $(val).data("title")
                });

                $ul.append($li);
            });

            if(!$this.options.headerVisible) $(".headerTabs",$this.el).remove();


            if($this.options.idActive === null)
            {
                $ul.find("li:eq(0)").addClass("tabActive");
                $this.el.find(".divtab:eq(0)").show();
            }
            else
            {
                $ul.find("li[data-tab='" + $this.options.idActive + "']").addClass("tabActive");
                $("#" + $this.options.idActive).show();
            }

            this.setEvents($ul.find("li"));

            if($this.el.find(".ulTabs").html() == null) $this.el.prepend($ul);
            else $this.el.find(".ulTabs").replaceWith($ul);

        },
        setEvents:function(o){
            var $this = this;
            o.on("click",function()
            {
                $this.clickTab(this);
            });
        },
        setCallback:function(cbk){
            this.callback = cbk;
        },
        clickTab:function(el)
        {
            $(el).parent().find("li.tabActive").removeClass("tabActive");

            $(el).addClass("tabActive");

            var idtab = $(el).data("tab");

            $(el).parent().parent().find(".divtab").hide();
            $("#" + idtab).show();

            if(typeof this.callback == 'function')
            {
                this.callback.call(this,idtab);
            }
        },
        disable: function(params)
        {
            if(typeof params == 'undefined')
            {
                //this.options.idActive = $("#tabs-"+this.id).find("li.tabActive").data("tab");
                $("#tabs-"+this.id).addClass("tabsDisabled");
                $("#tabs-"+this.id).find("li").off("click");
            }
            else
            {
                $("#"+params.id,"#tabs-"+this.id).addClass("tabDisabled").off("click");
            }
        },
        enable: function(params)
        {
            $this = this;
            if(typeof params == 'undefined')
            {
                $("#tabs-"+this.id).removeClass("tabsDisabled");
                this.init(this.options);
            }
            else
                $("#"+params.id,"#tabs-"+this.id).removeClass("tabDisabled").on("click",function(){$this.clickTab(this)});
        },
        idActive: function()
        {
            return $("#tabs-"+this.id).find("li.tabActive").data("tab");
        },
        go: function(id)
        {
            var $this=this;
            $("#tabs-"+this.id).find("li.tabActive").removeClass("tabActive");
            $("#tabs-"+this.id).find("li[data-tab='"+id+"']").addClass("tabActive");

            $("#"+this.id).find(".divtab").hide();
            var tab = $("#" + id);
            tab.show();
            if(typeof $this.callback == 'function')
            {
                this.callback.call(this,id);
            }
        },
        /*{id,text,content,show}*/
        addTab:function(p){
           var $this = this;
           var $tabs= $(this.el).find(".ulTabs");
           var $content_tabs= $(this.el).find(".contentTabs");
           $tabs.append($("<li>",{"id":"li-"+ p.id,"data-tab": p.id}).text(p.text));
           $content_tabs.append($("<div>",{"id":p.id,"data-title": p.text}).css({"display":"none"}).append(p.content));
           this.setEvents($tabs.find("li"));
           if(p.show)this.go(p.id);
        }
    }
})(jQuery);