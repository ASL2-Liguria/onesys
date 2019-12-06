$(document).ready(function ()
{
    MANAGER.init();
    MANAGER.setEvents();
});

var MANAGER =
{
    parameters:
    {
        url_server: ""
    },

    call_url: function(param, page, fnccallback)
    {
        if(!page)
            page = "managerWeb";

        page = this.parameters.url_server + page;

        $.ajax(
            {
                url: page + "?" + param
            }).done(function (data)
            {
                alert('Operazione completata');

                if(fnccallback)
                    fnccallback();
            });
    },

    init: function() {
    },

    setEvents: function()
    {},

    purge: function(id, fnccallback)
    {
        this.call_url("TYPE=POOL&ACTION=PURGE&ID=" + id, null, fnccallback);
    },

    purgesingle: function(id, fnccallback)
    {
        this.call_url("TYPE=POOL&ACTION=PURGE&ID=" + id, "../managerWeb", fnccallback);
    },

    context: function(id)
    {
        this.call_url("TYPE=CONTEXT&ACTION=" + id);
    },

    logback: function(id)
    {
        this.call_url("TYPE=LOGBACK&ACTION=" + id);
    },

    cache: function(action)
    {
        this.call_url("action=" + action, "manager/JCSAdmin.jsp");
    },

    switch_server: function(idx, ip, name)
    {
	 window.location.replace(ip + "/Manager.jsp");
        /*this.parameters.url_server = ip;
        $("#mServers").text("Server: " + name).append("<i class='icon-down-dir'></i>");*/
    },
    
    apriPagina: function(param) {
    	$('#content > iframe').attr('src', param.url);
    	$('#content > iframe').attr('height', LIB.getHeight() - $('#menuBar').outerHeight(true));
    }
}