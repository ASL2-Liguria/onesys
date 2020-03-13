$(document).ready(function(){
						   
	$(".jqueryaccordion li > ul").hide();
	
	$(".jqueryaccordion li > ul").each(function(){
		$(this).parent().prepend("<img src='img/arrowdown.png'>");
	});
	
    $(".jqueryaccordion a").click(function(){
        $(this).next().next("ul").toggle(function(){
            $(this).prev("a").toggleClass("active");
        });
    });   
        
     $(".PermSelector").change(function(){
    	// alert($("option:selected",this).val());
    	 var va=$("option:selected",this).val();
    	 $(this).parent().find("ul").each(function(){
    		//alert($(this).html()); 
    		$("li",this).find(".PermSelector").each(function(){
    			$("option[value='"+va+"']",this).attr('selected', true);
    		});
    	 });
     });     
     
     
     $("#fldPermissioniMenu legend").click(function(){
    	 $(".jqueryaccordion li > ul").hide();
     });


     $(".jqueryaccordion").find("i").on("click",function(){
         var $this=$(this);

         $this.toggleClass("icon-check-1");
         $this.toggleClass("icon-check-empty");

     })
						   
						   });