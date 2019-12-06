$(document).ready(function(){
	LETTERA.init();
	LETTERA.setEvents();

});

var LETTERA = {
		
			init:function(){
				
				CheckCarica = $("#txtCorpo").val();
				
					if(CheckCarica != ""){ 
					
						$(".butSalva").hide();
						
				}
				
			},
			
			setEvents:function(){
				

				$(".butStampa").on("click", function(){
					path = home.baseUser.LETTERA;
					sf = "{ESAMI_TESTATA.IDEN}=29626"; 

					var param = {
							path_report : path,
							selection_formula : sf
					};
					home.NS_PRINT.print(param);
				});
				
				$(".butSalva").on("click", function(){
					LETTERA.checkLettera();
				});
				
			},
			
			checkLettera:function(){
				
					CheckLettera = $("#txtCorpo").val();
				
					if(CheckLettera == "") {
					
						alert("Inserire il testo della lettera!");
						$("#txtCorpo").focus();
						
					}
				
				
			}
			
};
