;
(function ($)
{
    function radiobox(el, options, onAfter)
    {
        this.el = $(el);
        this.idRB = this.el.attr("id");
        this.options = options;
        this.onAfter = onAfter;
        this.init(options);
    }
    $.fn.RadioBox = function (options, onAfter)
    {
        var defaults = {
            width: "120",
            idxDefault: null,
            enabled: true,
            callback: function(){}
        };
        var options = $.extend(
        {}, defaults, options);
		
        var plugin = new radiobox(this.get(0), options, onAfter);
		$(this).data('RadioBox', plugin);

		if(options.idxDefault != null && !plugin.val()){plugin.selectByIndex(options.idxDefault);}

        if(!options.enabled)
            plugin.disable();

		if (typeof onAfter == 'function')
        {
			onAfter.call({obj:this});
        }
		
		return plugin;
		 
        //return new radiobox(this.get(0), options, onAfter)
    };
    radiobox.prototype = {
        init: function (options)
        {
            var $this = this;

            $this.resetHiddenVal();
            //options = !LIB.isValid( options ) ? { width: null } : options;
            options || (options = {'width': null});

            $this.el.removeClass("RBdisabled");
            var puls = $this.el.find(".RBpuls");
            puls.off("click");
            puls.on("click", function (e)
            {
                if ($(this).hasClass("RBpulsSel"))
                {
                    $this.empty()
                }
                else
                {
                    $this.selectByValue($(this).data("value"))
                }
            });
            if (options.width != null && options.width != 'none')
            {
                this.el.find(".RBpuls").width(options.width)
            }
        },
        disable: function ()
        {
            if (this.isEnabled())
            {
                this.el.addClass("RBdisabled");
                this.el.off('click')
            }
        },
        enable: function ()
        {
            if (!this.isEnabled())
            {
                this.init(null);
                this.el.removeClass("RBdisabled")
            }
        },
        isEnabled: function ()
        {
            return !this.el.hasClass("RBdisabled")
        },
        resetHiddenVal: function() {
        	
        	var val = "";
        	this.el.find(".RBpulsSel").each(function(k,v){
            	if(k!=0) val += ",";
            	val += $(v).data("value");
            });
        	$("[name='" + this.idRB + "']").val(val);
        },
        selectByIndex: function (idx)
        {
            if (this.isEnabled())
            {
                $rb = this.el.find(".RBpuls").eq(idx);
                if (($rb.html() != null) && (!$rb.hasClass("RBpulsSel")))
                {
                    this.selectByValue($rb.data("value"))
                }
            }
        },
        selectByValue: function (val)
        {
            if (this.isEnabled())
            {
                var $rb = this.el.find("[id$='_" + val + "']");
                if (($rb.html() != null) && (!$rb.hasClass("RBpulsSel")))
                {
                    this.el.find(".RBpulsSel").removeClass("RBpulsSel");
                    $rb.addClass("RBpulsSel");

                    $("[name='" + this.idRB + "']").val(val);

                    if (typeof this.options.callback == 'function')
                    {
                        this.options.callback.call(this.el)
                    }

                    this.triggerChange();
                }
            }
        },
        empty: function ()
        {
            if (this.isEnabled())
            {
                this.el.find(".RBpulsSel").removeClass("RBpulsSel");
                $("[name='" + this.idRB + "']").val("");
                if (typeof this.options.callback == 'function')
                {
                    this.options.callback.call(this.el)
                }
                this.triggerChange();
            }
        },
        val: function ()
        {
            return $("[name='" + this.idRB + "']").val()
        },
        descr: function ()
        {
            return this.el.find(".RBpulsSel").text();
        },
        triggerChange:function()
        {
            $("[name='" + this.idRB + "']").trigger("change");
        }
    }
}(jQuery));


var RADIO=
{
    crea:function(param,opt)
    {
        var rad=$("<div>").addClass("RadioBox").attr({"id":param.id}).append($("<input>").attr({"type":"hidden","name":param.id,"id":"h-"+param.id}));
        $.each(param.elements,function(k,v){
            var el=$("<div>").addClass("RBpuls").attr({"id":param.id+"_"+ v.val,"data-value":v.val}).append($("<i>")).append($("<span>").text(v.descr));
            rad.append(el);
        });
        if(opt==null)opt={'idxDefault':0};
        rad.RadioBox(opt);
        return  rad;
    }

}