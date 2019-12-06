
/****************************** DIALOG **********************************/
/*
 * jQuery  Dialog plugin 1.0
 * Released: October 05, 2012
 * 
 * Copyright (c) 2008 Jacopo Brovida
 *
 * @license http://www.opensource.org/licenses/mit-license.php
 * @license http://www.gnu.org/licenses/gpl.html
 * @project jquery.modaldialog
 * 
 * 
 * parametri:
 * 
 * 		title  titolo del Dialog
 * 		width ranghezza del Dialog
 * 		timeout tempo di autochiusura del Dialog
 * 		showCountDown (boolean) visualizza o meno il countdown del tempo residuo alla chiusura
 * 		buttons:[
			  		{"label":,"action":}									  
				]
		autoClose: funzione richiamato all'autochiusura del Dialog
 * 
 */
(function($) {
		$.dialog = function(msg, options){
				var settings = $.extend({}, $.dialog.defaults, options);
				
				settings.timeout = (typeof(settings.timeout) == "undefined") ? 0 : settings.timeout;
									
		if (!document.getElementById('dialog')) {
			
			var dialogmask=$("<div></div>").attr("id","dialog-mask");
			
			var dialog=$("<div></div>").attr("id","dialog");
					var header= $("<div></div>").addClass('hRiq').addClass('hRiq26');					
								header.append($("<span></span>").addClass('hSx'));
								header.append($("<div></div>").addClass('hC'));
								header.append($("<span></span>").addClass('hDx'));
								
								
					var content=$("<div />").attr("id","dialog-content");
								content.append($("<div></div>").attr("id","dialog-content-inner"));
								content.append($("<div></div>").attr("id","dialog-button-container")
								.append($("<div></div>").attr("id","dialog-button-container-float")));
								
			$(dialog).append(header);
			$(dialog).append(content);							
															
					
			$(dialogmask).hide();
			$(dialog).hide();
			
			$("body").append(dialogmask);
			$("body").append(dialog);
			
			
			$.each(settings.buttons,function(i,val){
						
				var button = $("<a href='javascript:void(0);'></a>")
					.addClass("button")
					.click(val.action)
					.append(
						$("<span id='"+val.label+"'></span>")
							.text(val.label)
					)
				
				$('#dialog-button-container-float').append(button);
					
			});			

		}

		var dl = $('#dialog');
				
		$('.hC').html(settings.title);
		$('#dialog-content-inner').html(msg);
		
		if(settings.showCountDown && settings.showCountDown ==true && settings.timeout){
			$('#dialog-content-inner').append("<h1 id='dialog-countDown'>"+(settings.timeout)+"</h1>");
		}
		
		// Center the dialog in the window but make sure it's at least 25 pixels from the top
		// Without that check, dialogs that are taller than the visible window risk
		// having the close buttons off-screen, rendering the dialog unclosable 
		dl.css('width', settings.width);
		var dialogTop = Math.abs($(document).height() - dl.height()) / 2;
		dl.css('left', ($(document).width() - dl.width()) / 2);
		dl.css('top', (dialogTop >= 25) ? dialogTop : 25);
		

		if (settings.timeout ) {		
			t=window.setTimeout(settings.autoClose, (settings.timeout * 1000));
			cd=window.setInterval(countDown,1000);
			
		}
	
		/*dl.fadeIn("fast");
		$('#dialog-mask').fadeIn("normal");*/
		
		dl.show();
		$('#dialog-mask').show();		
	};
	
	

	$.dialog.hide = function() {
		if(typeof(t)!='undefined'){window.clearTimeout(t);}
		if(typeof(cd)!='undefined'){window.clearInterval(cd);}
		//$('#dialog').fadeOut("slow", function () { $(this).hide(0); });
		//$('#dialog-mask').fadeOut("normal", function () { $(this).hide(0); });
		$('#dialog').remove();
		$('#dialog-mask').remove();
	};


	$.dialog.defaults = {
		timeout: 0
		, width: 525
		,   buttons:[
						{"label":"Chiudi","action":$.dialog.hide}			  
					  ]
		,autoClose:$.dialog.hide		  
	};
		
	function countDown(){
		var time=$("#dialog-countDown").html();
		parseInt(time);
		$("#dialog-countDown").html(time-1);
		};
})(jQuery);



/***************** END DIALOG **********************/
