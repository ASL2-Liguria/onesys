var $slidemenu = {
    animateduration: {
        over: 100,
        out: 50
    },
    buildmenuClick: function (a)
    {
        "use strict";
        $(document).ready(function (c)
        {
            var d = c("#" + a + ">ul");
            var e = d.find("ul").parent();
            d.find("ul").prop("aperto", "false");
            e.each(function ()
            {
                var d = c(this);
                var e = c(this).find("ul:eq(0)");
                this._dimensions = {
                    w: this.offsetWidth,
                    h: this.offsetHeight,
                    subulw: e.outerWidth(),
                    subulh: e.outerHeight()
                };
                this.istopheader = d.parents("ul").length === 1 ? true : false;
                e.css({
                    top: this.istopheader ? (this._dimensions.h - 1) + "px" : -1 + "px"
                });
                d.children("a:eq(0)")
                    .css(this.istopheader ? { paddingRight: 24} : {})
                    .append('<i class=\'' + (this.istopheader ? 'icon-down-dir' : 'icon-right-dir') + '\'></i>');
            });
            c("#" + a).find("ul:eq(0)").children("li").click(function ()
            {
                if (c(this).hasClass("topMenuActive"))
                {
                    c(this).removeClass("topMenuActive");
                    c(this).find("ul").find("ul").slideUp($slidemenu.animateduration.out).prop("aperto", "false");
                }
                else
                {
                    c(".topMenuActive").removeClass("topMenuActive");
                    if (c(this).children("ul").html() !== null)
                    {
                        c(this).addClass("topMenuActive");
                    }
                }
            });
            c("#" + a).find("ul:eq(0)").children("li").find("ul:eq(0)").children("li").click(function ()
            {
                if (c(this).hasClass("liMenuActive"))
                {
                    c(this).removeClass("liMenuActive");
                }
                else
                {
                    c(".liMenuActive").find("ul").slideUp($slidemenu.animateduration.out).prop("aperto", "false");
                    c(".liMenuActive").removeClass("liMenuActive");
                    if (c(this).children("ul").html() !== null)
                    {
                        c(this).addClass("liMenuActive");
                    }
                }
            });
            c("#" + a).find("ul:eq(0)").find("li").click(function (b)
            {
                var d = c(this).find("ul:eq(0)");
                if (c(this).children("ul").html() == null)
                {
                    c("#" + a).find("ul").find("ul").slideUp($slidemenu.animateduration.out).prop("aperto", "false");
                    c(".topMenuActive").removeClass("topMenuActive");
                    c(".liMenuActive").removeClass("liMenuActive");
                }
                if (d.prop("aperto") == "false")
                {
                    if (c(this).prop("istopheader"))
                    {
                        c(this).parent().find("li").find("ul").slideUp($slidemenu.animateduration.out).prop("aperto", "false");
                        c(".liMenuActive").removeClass("liMenuActive");
                    }
                    else
                    {
                        c(this).addClass("liMenuActive");
                    }
                    var dd = c(this).children("ul:eq(0)");
                    this._offsets = {
                        left: c(this).offset().left,
                        top: c(this).offset().top
                    };
                    var e = this.istopheader ? 0 : this._dimensions.w;
                    e = this._offsets.left + e + this._dimensions.subulw > c(window).width() ? this.istopheader ? -this._dimensions.subulw + this._dimensions.w : -this._dimensions.w : (e - 1);
                    if (dd.queue().length <= 1)
                    {
                        dd.css({
                            left: e + "px",
                            width: this._dimensions.subulw + "px"
                        }).slideDown($slidemenu.animateduration.over);
                    }
                    dd.css("overflow", "visible");
                    dd.prop("aperto", "true");
                }
                else
                {
                    var ddd = c(this).children("ul:eq(0)");
                    ddd.slideUp($slidemenu.animateduration.out);
                    ddd.prop("aperto", "false");
                    c(".liMenuActive").removeClass("liMenuActive");
                }
                LIB.stopBubble(b);
            });
            d.find("ul").css({
                display: "none",
                visibility: "visible"
            });
        });
    }
};
