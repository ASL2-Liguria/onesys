$(document).ready(function()
{
	OPEN_DOCUMENT.init();
	
});

var OPEN_DOCUMENT = {
		
		init:function()
		{
		if (parent.$('form[name=EXTERN] input[name=PROV]').val() === 'MMG'){
			$('body').addClass('bodyMMG');
		}	
			
		if( typeof (top.CartellaPaziente)!='undefined'){	
			$(window).bind('unload', function(){
				top.CartellaPaziente.Menu.show();
				 top.setDimensioniFrameWork();
				 parent.$("#groupFooter").parent().show();
			});
		}
			
			
		}		
};