var NS_LOADING = {

    showLoading:function(params)
    /*{
        [,timeout] Il loading viene eliminato dopo n secondi, 5 sec default, se 0 si chiude al click
     */
    {
        var h = (typeof home == 'undefined') ? window : home;

        if(typeof params == 'undefined') var params = {};
        if(typeof params.timeout == 'undefined') params.timeout = 5;
        if(typeof params.destinazione == 'undefined') params.destinazione = h.document.body;
        if(typeof params.testo == 'undefined') params.testo = '';
        if(typeof params.loadingclick == 'undefined') params.loadingclick = function()
        {
           // if(h.NS_FENIX_TOP)
           //     h.NS_FENIX_TOP.chiudiUltima();
            NS_LOADING.hideLoading();
        };

		$('<div>',{
			id:'divLoading',
            html:'<div id="divLoadingText">' + params.testo + '</div>'
		}).prependTo(params.destinazione);

		if(params.timeout != 0)
			setTimeout("NS_LOADING.hideLoading()",params.timeout*1000);
		else
		{
			$("#divLoading", h.document.body).on("click", params.loadingclick);
		}

    },
    hideLoading:function( params )
    {
        var h = (typeof home == 'undefined') ? window : home;

		if(typeof params == 'undefined') var params = {};
		if(typeof params.destinazione == 'undefined') params.destinazione = h.document.body;

        $("#divLoading", params.destinazione).remove();

    } ,
    setLoadingText:function( params )
    {
        $("#divLoadingText").html(params);
    }
}