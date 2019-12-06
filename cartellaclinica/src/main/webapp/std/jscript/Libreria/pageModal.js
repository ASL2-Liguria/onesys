function setPage(oDoc)
{
	if(oDoc != null)
	{
		oDoc.body.onblur = new Function('javascript:document.focus();');
		
		setAllTag(oDoc);
		
		oDoc.body.focus();
	}
}

function setAllTag(doc)
{
	var k, i, j;
	var aFrm;
	var aObj;
	var aInp;
	
	aFrm = doc.getElementsByTagName("FORM");
	if(aFrm != null)
	{
		for(k = 0; k < aFrm.length; k++)
		{
			aObj = aFrm[k].getElementsByTagName("TD");
			
			for(i = 0; i < aObj.length; i++)
			{
				aInp = aObj[i].getElementsByTagName("input");
				
				if(aInp == null || aInp.length < 1)
				{
					aInp = null;
					
					aInp = aObj[i].getElementsByTagName("textarea");
					
					if(aInp == null || aInp.length < 1)
					{
						aInp = null;
						
						aInp = aObj[i].getElementsByTagName("select");
						
						if(aInp == null || aInp.length < 1)
						{
							aObj[i].onclick = new Function('checkTastoModal();')//document.body.focus();');
						}
						else
						{
							for(j = 0; j < aInp.length; j++)
							{
								aInp[j].onblur = new Function('javascript:checkTastoModal();');//document.body.focus();');
							}
						}
					}
				}
				else
				{
					//aObj[i].onclick = new Function('document.' + aFrm[k].name + '.' + aInp[0].name + '.focus();');
					for(j = 0; j < aInp.length; j++)
					{
						aInp[j].onblur = new Function('javascript:checkTastoModal();');//document.body.focus();');
					}
				}
				
				aInp = null;
				
			}
		}
	}
}

function checkTastoModal()
{
	if(window.event.keyCode!=0)
	{
		document.body.focus();
	}
}