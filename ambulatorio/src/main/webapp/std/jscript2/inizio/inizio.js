jQuery(document).ready(
function()
{
	jQuery('span#keepIcon').attr("bloccato","0");
	
	jQuery('li.title a').click
	(
		function(e)
		{
			var subMenu  = jQuery(this).parent().next();
			var spanMenu = jQuery(this).find('span:id<>keepIcon');
			var car 	 = spanMenu.html();
			
			jQuery('span.menuPlus').html('+');
			jQuery('.sub-menu').not(subMenu).slideUp(200);
			
			if(car == '-')
			{
				subMenu.slideUp(200);
			}
			else
			{
				spanMenu.html("-");
				subMenu.slideDown(200);
			}
		}
	);
	
	jQuery('#divMenu').hover(chiudiVerticalMenu);
	
	jQuery('span#keepIcon').click(function()
	{
		if(jQuery('span#keepIcon').attr("bloccato") == 0)
		{
			jQuery(this).removeClass('keepMenu').addClass('keepMenuPressed');
			jQuery('#divMenu').removeClass('clsMenuFrame').addClass('clsMenuFrameBlock');
			jQuery('#divWork').addClass('clsResized');
			jQuery('span#keepIcon').attr("bloccato","1");
		}
		else
		{
			jQuery(this).addClass('keepMenu').removeClass('keepMenuPressed');
			jQuery('#divMenu').removeClass('clsMenuFrameBlock').addClass('clsMenuFrame');
			jQuery('#divWork').removeClass('clsResized');
			jQuery('span#keepIcon').attr("bloccato","0");
		}
	});
});

function expand_menu()
{
	if(jQuery('#divMenu').hasClass('clsMenuFrame'))
	{
		apriVerticalMenu();
	}
	else
	{
		chiudiVerticalMenu();
	}
}

function chiudiVerticalMenu()
{
	if(jQuery('span#keepIcon').attr("bloccato") != 1)
	{
		if(!jQuery('#divMenu').hasClass('clsMenuFrameBlock'))
		{
			jQuery('span.menuPlus').html('+');
			jQuery('.sub-menu').hide();
			jQuery('#divMenu').removeClass('clsMenuFrameExpand');
			jQuery('#divMenu').addClass('clsMenuFrame');
		}
	}
}

function apriVerticalMenu()
{
	jQuery('#divMenu').removeClass('clsMenuFrame');
	jQuery('#divMenu').addClass('clsMenuFrameExpand');
}