function allarga_select(sel_name)
{
	var aName;
	
	sel_name += '*';
	
	aName = sel_name.split('*');
	for(var i=0; i < aName.length; i++)
	{
		try
		{
			document.all[aName[i]].style.width = '100%';
		}
		catch(ex)
		{
		}
	}
}