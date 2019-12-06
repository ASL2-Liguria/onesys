var LOGGER = {
  init:function(){

        function getDocWidth(){
            return $(document).width();
        }
        
        function getDocHeight(){
            return $(document).height();
        }

        var left = getDocWidth() - 550;
        var $div = $(document.createElement("div"));
        $div.attr("id","divConsolle");
        $div.css("margin-left",left);
        var $but1 = $(document.createElement("button"));
        $but1.attr("id","btCancConsolle");
        $but1.html("Cancella");
        var $but2 = $(document.createElement("button"));
        $but2.html("Chiudi");
        $but2.attr("id","btCloseConsolle");
        $div.append($but1);
        $div.append($but2);
        var $txtLog = $(document.createElement("textarea"));
        $txtLog.height(200);
        $txtLog.width(500);
        $txtLog.attr("id","textLogger").attr("readonly","true");
        $txtLog.text("");
        $div.append($txtLog);
        $div.hide();
        $("body").append($div);
        $("#btCancConsolle").click(function(){
           LOGGER.clear(); 
        });
        $("#btCloseConsolle").click(function(){
           LOGGER.hide(); 
        });
  },
  write:function(_text){
      $("#textLogger").text($("#textLogger").text() + "\r" + _text);
  },
  clear:function(){
      $("#textLogger").empty();
  },
  show:function(){
      $("#divConsolle").show();
  },
  hide:function(){
      $("#divConsolle").hide();
  }
};

$(document).keypress(function(e) {
    //ctr+shift+j
    if(e.ctrlKey && e.shiftKey){
        if(e.which == 10){
            if($("#divConsolle").is(":visible")){
                $("#divConsolle").hide();    
            }else{
                $("#divConsolle").show();    
            }  
        }
    }
 
});


