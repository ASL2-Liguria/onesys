$(document).ready(
function()
{
	$('li.title a').click(
	function(e)
	{
		var subMenu = $(this).parent().next();
		
		$('.sub-menu').not(subMenu).hide();
		subMenu.toggle();
		//e.preventDefault();
	})
});

function expand_menu()
{
	if(parent.jQuery('#oIFMenu').hasClass('clsMenuFrame'))
	{
		parent.apriVerticalMenu();
	}
	else
	{
		parent.chiudiVerticalMenu();
	}
}

function apri()
{
	
}