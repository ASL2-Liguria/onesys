function enableDisable(valore)
{
	if(!document.getElementById || !document.getElementsByTagName)
	{
		return;
	}
	scan("input", !valore);
}

function scan(tag, valore)
{
	aObj = document.getElementsByTagName(tag);
	
	for(i = 0; i < aObj.length; i++)
	{
		aObj[i].disabled = valore;
	}
}