$("document").ready(function(){
    NS_EMPTY.init();
});

var NS_EMPTY={
    init:function()
    {
        var url = document.getElementById("URL").value;
        switch ($("#ORIGINE").val()) {
            case 'PENTAHO':
                url +=  "userid="+home.baseUser.USERNAME + "&password="+ home.baseUser.PASSWORD;
                break;
            default:
                break;

        }


        if(home.baseUser.USERNAME == 'mat'){alert(url)};
        $("#iframe").attr("src", url).css({width:"100%", height:"100%"});
    }

}