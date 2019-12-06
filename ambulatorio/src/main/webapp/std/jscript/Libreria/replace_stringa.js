

function replace_stringa(sString, sReplace) 
{ 
	if(sString.length == 1 && sString == "'")
	{
		alert('Prego, inserire un valore corretto per la ricerca');
		sString = '';
	}
	else
		if (sString != "") 
		{
			var counter = 0;

			for(j = 0; j < sString.length; j++)
			{
				for(i = j; i < sString.length; i++)
				{
					if(sString.substring(i, i+1) == sReplace)
					{
						counter++;
					}
					if(sString.substring(i+1, i+2) != sReplace)
					{
						var appo = '';
						for(x = j; x < counter; x++)
							appo += sReplace;
					
						if(appo.length > 0)
							sString = sString.replace(appo, sReplace);
						
						counter = 0;
					}
				}
				j = i+2;	
			}//for j
		}//if
	
	return sString;
}



