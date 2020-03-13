/*	DISABLE SELECTION	*/
;(function ($) {
    $.fn.DisableSelection = function () {
        return this.each(function () {
            $(this).attr('unselectable', 'on').css({'-ms-user-select': 'none', '-moz-user-select': 'none', '-webkit-user-select': 'none', 'user-select': 'none'}).each(function () {
                this.onselectstart = function () {
                    return false
                }
            })
        })
    }
})(jQuery);
