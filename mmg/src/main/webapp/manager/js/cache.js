
$("document").ready(function(){
    CACHE.init();
    CACHE.setEvents();

});

var CACHE = {
    init:function(){},
    setEvents:function(){
        $("#butClearRegion").on("click",function(){
            var server = CACHE.getServerSelected();
            var region = CACHE.getRegionSelected();
            if(!server.length)NOTIFICA.warning({message: "Select at least one server", title: "Attention!", timeout: 5});
            $.each(server,function(k,v){
                CACHE.clearCache(v,region);
            });
        });
    },
    getServerSelected:function(){
        var serverList=[];
        $.each($("#serverList").find(':selected'),function(k,v){
            serverList.push($(v).val());
        });
        return serverList;
    },
    getRegionSelected:function(){
        return $("#cacheName").find(':selected').val();
    },
    clearCache:function(server,region){
        $.support.cors = true;
        $.ajax(
            {
                url: server + "?action=clearRegion&cacheName=" + region,
                type: "GET",
                crossDomain : true,
                xhrFields: {
                    withCredentials: true
                }
            }).done(function ( data )
            {
                NOTIFICA.info({
                    message: "Region " + region + " clear completed",
                    title: "JCSCache <br/> "+server,
                    timeout: 5
                });
            });
    }
}