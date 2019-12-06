// JavaScript Document

function controlloNumerico(oggetto){
	try{
		
		if ($(oggetto).val()==""){ 
			jQuery(oggetto).removeClass("campoErrato_redBorder");
			return true;
		}
		
		$(oggetto).val($(oggetto).val().replace(',', '.'));
		if (jQuery.isNumeric($(oggetto).val())){
			jQuery(oggetto).removeClass("campoErrato_redBorder");
			return true;
		}
		else{
			// *******
			var position = $(oggetto).offset();
			openMsgInfoAtPosition("Inserire un valore numerico",position.left,position.top,1500, $(oggetto));
			// jQuery(oggetto).removeClass("campoErrato_redBorder").addClass("campoErrato_redBorder");
			// $(oggetto).focus();
			// *******			
			
		}
	}
	catch(e){
		alert("controlloNumerico - Error: " + e.description);
	}	
}

function openMsgInfoAtPosition(messaggio, x,y, timeout, oggetto){
	try{
		$.blockUI({ 
			centerY: 0,
			message: '<p style="font-size:14px; color:red; padding-top:10px; padding-bottom:10px">' + messaggio + '</p>', 
			css: {
					top: y,
					left: x

				} 
		}); 
 		
		setTimeout(function() { 
            $.unblockUI({ 
                onUnblock: function(){
					jQuery(oggetto).removeClass("campoErrato_redBorder").addClass("campoErrato_redBorder");
					$(oggetto).focus();
				} 
            }); 
        }, timeout)
	}
	catch(e){
		alert("openMsgInfoAtPosition - Error: " + e.description);
	}		
}