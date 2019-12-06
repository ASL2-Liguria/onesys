// Nuova ricerca degli elementi della pagina...
document.getElementsByAttribute = function(strTagName, strAttributeName, strAttributeValue)
{
	var oElm 				= document.body;
	var arrElements 		= (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
	var arrReturnElements 	= new Array();
	var oAttributeValue 	= (typeof strAttributeValue != "undefined")? new RegExp("(^|\\s)" + strAttributeValue + "(\\s|$)") : null;
	var oCurrent;
	var oAttribute;
	
	for(var i=0; i<arrElements.length; i++)
	{
		oCurrent = arrElements[i];
		oAttribute = oCurrent.getAttribute && oCurrent.getAttribute(strAttributeName);
		
		if(typeof oAttribute == "string" && oAttribute.length > 0)
		{
			if(typeof strAttributeValue == "undefined" || (oAttributeValue && oAttributeValue.test(oAttribute)))
			{
				arrReturnElements.push(oCurrent);
			}
		}
	}
	
	return arrReturnElements;
}

// Un modo nuovo per fare la pagina tutto schermo
document.setTuttoSchermo = function()
{
	window.moveTo(0,0);
	
	if(document.all)
	{
		top.window.resizeTo(screen.availWidth,screen.availHeight);
	}
	else
	{
		if(document.layers || document.getElementById)
		{
			if(top.window.outerHeight<screen.availHeight || top.window.outerWidth<screen.availWidth)
			{
				top.window.outerHeight = screen.availHeight;
				top.window.outerWidth = screen.availWidth;
			}
		}
	}
	/*try
	{
		top.resizeTo(screen.availWidth, screen.availHeight);
		top.moveTo(0,0);
	}
	catch(e)
	{
	}*/
}

// Funzione che effettua il trim della stringa passata in input
function trim(stringa)
{
	stringa = stringa.replace(/^\s+/g, "");
	
	return stringa.replace(/\s+$/g, "");
}

document.apriAttesaSalvataggio = function(js_call)
{
	var divAttesa   = document.all['divAttesa'];
	var divRegistra = null;
	var imgAttesa   = null;
	var spanAttesa  = null;
	
	if(typeof divAttesa == 'undefined')
	{
		divAttesa = document.createElement('DIV');
		
		divAttesa.setAttribute('id', 'divAttesa');
		divAttesa.className = 'clsDivBlackOpacity';
		
		divRegistra = document.createElement('DIV');
		
		divRegistra.setAttribute('id', 'divRegistraAttesa');
		divRegistra.className = 'clsDivAttesaRegistra';
		
		divAttesa.appendChild(divRegistra);
		
		imgAttesa = new Image();
		
		imgAttesa.src = 'imagexPix/thickbox/loadingAnimation.gif';
		imgAttesa.className = 'clsImgAttesaRegistra';
		
		spanAttesa = document.createElement('DIV');
		
		spanAttesa.innerText = 'Firma in corso...';
		spanAttesa.setAttribute('id', 'spanRegistraAttesa');
		spanAttesa.className = 'clsSpanAttesaRegistra';
		
		divRegistra.appendChild(imgAttesa);
		divRegistra.appendChild(spanAttesa);
		
		divAttesa.setAttribute('onclick', new Function('javascript:document.chiudiAttesaSalvataggio();'));
		
		document.body.appendChild(divAttesa);
	}
	
	divAttesa.style.display = 'block';
	setTimeout(js_call,1)
	
}

document.chiudiAttesaSalvataggio = function()
{
	var divAttesa = document.all['divAttesa'];
	
	if(typeof divAttesa != 'undefined')
	{
		divAttesa.style.display = 'none';
	}
}