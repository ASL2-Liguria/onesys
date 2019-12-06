$("document").ready(function(){
    NS_EMPTY.init();
});

var NS_EMPTY={
    init:function()
    {
        var url = document.getElementById("URL").value;
        var height =$(window).height();
        var width=$(window).width();
        switch ($("#ORIGINE").val()) {
            case 'PENTAHO':
				$('body').append($('<form name="pentaho" method="POST" target="_blank" action="'+url+'"><input type="hidden" name="userid" value="'+home.baseUser.USERNAME+'"/><input type="hidden" name="password" value="'+home.baseUser.PASSWORD+'"/></form>'));
				document.pentaho.submit();
				$('form[name="pentaho"]').remove();
                return;
            case 'DEGENTI' :
                url += 'utente='+home.baseUser.USERNAME+'&postazione='+home.basePC.IP+'&pagina=ALLETTAMENTO';
                break;
            default:
                break;

        }


        $("#iframe").attr("src", url).css({width:"100%", height:"100%"});



    }

}