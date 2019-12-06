
var Popup = {
	
	append:function(pParam){

		Popup.remove();
		
		pParam.header = (typeof pParam.header != 'undefined' 	? pParam.header : null);
		pParam.footer = (typeof pParam.footer != 'undefined' 	? pParam.footer : null);
		pParam.title = 	(typeof pParam.title != 'undefined' 	? pParam.title 	: "");
		pParam.width = 	(typeof pParam.width != 'undefined' 	? pParam.width 	: 320);
		pParam.height = (typeof pParam.height != 'undefined' 	? pParam.height : 130);				

		
		$('body').append(
			$('<div id="divPopUpInfo"></div>')
				.css("font-size","12px")
				.append(pParam.header)
				.append(pParam.obj)
				.append(pParam.footer)
				.attr("title",pParam.title)
		);
		
		$('#divPopUpInfo').dialog({
					position:	[event.clientX,event.clientY],
					width:		pParam.width,
					height:		pParam.height
		});

	//	Popup.setRemoveEvents();

	},
	
	remove:function(){
		$('#divPopUpInfo').remove();
	},
	
	setRemoveEvents:function(){
		
		$('#frameWork').contents().find("body").on("click",Popup.remove);
		
	}	
	
};





