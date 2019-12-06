// Nuova ricerca degli elementi della pagina...
document.getElementsByAttribute = function(strTagName, strAttributeName, strAttributeValue)
{
	var oElm 				= document.body;
	var arrElements 		= (strTagName == "*" && oElm.all) ? oElm.all : oElm.getElementsByTagName(strTagName);
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
};

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
};

// Funzione che effettua il trim della stringa passata in input
function trim(str)
{
	return str.replace(/^\s+|\s+$/, '');
}

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/, '');
};

document.apriAttesaSalvataggio = function()
{
	try{
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
		
		spanAttesa.innerText = 'Salvataggio in corso...';
		spanAttesa.setAttribute('id', 'spanRegistraAttesa');
		spanAttesa.className = 'clsSpanAttesaRegistra';
		
		divRegistra.appendChild(imgAttesa);
		divRegistra.appendChild(spanAttesa);
		
		divAttesa.setAttribute('onclick', new Function('javascript:document.chiudiAttesaSalvataggio();'));
		
		//document.all['body'].appendChild(divAttesa);
		document.body.appendChild(divAttesa);
	}
	
	divAttesa.style.display = 'block';
	}catch(e){alert(e.description);}
};

document.chiudiAttesaSalvataggio = function()
{
	var divAttesa    = document.all['divAttesa'];
	var divRichiesta = document.all['divRichiesta'];
	
	if(typeof divAttesa != 'undefined')
	{
		//document.all['body'].removeChild(divAttesa);
		document.body.removeChild(divAttesa);
	}
	
	if(typeof divRichiesta != 'undefined')
	{
		//document.all['body'].removeChild(divRichiesta);
		document.body.removeChild(divRichiesta);
	}
};

document.richiediUtentePassword                  = new Object();
document.richiediUtentePassword.A_CAMPI_UTENTE   = new Array();
document.richiediUtentePassword.USERNAME         = '';
document.richiediUtentePassword.PASSWORD         = '';
document.richiediUtentePassword.VALIDO           = false;
document.richiediUtentePassword.VALORIZZA_USERID = false;
document.richiediUtentePassword.CALL_JS	         = '';
document.richiediUtentePassword.RICHIEDI_PWD_REG = false;

document.richiediUtentePassword.getValore = function(nome)
{
	return typeof document.richiediUtentePassword.A_CAMPI_UTENTE[nome] == 'undefined' ? '':document.richiediUtentePassword.A_CAMPI_UTENTE[nome];
};

document.richiediUtentePassword.init = function()
{
	document.richiediUtentePassword.A_CAMPI_UTENTE   = new Array();
	document.richiediUtentePassword.USERNAME         = '';
	document.richiediUtentePassword.PASSWORD         = '';
	document.richiediUtentePassword.VALIDO         	 = false;
	document.richiediUtentePassword.VALORIZZA_USERID = false;
	document.richiediUtentePassword.CALL_JS	         = '';
	document.richiediUtentePassword.RICHIEDI_PWD_REG = false;
};

document.richiediUtentePassword.annulla = function()
{
	this.init();
	
	document.chiudiAttesaSalvataggio();
};

document.richiediUtentePassword._check_pwd = function(pwd)
{
	document.richiediUtentePassword.PASSWORD = pwd;
};

document.richiediUtentePassword._check_db = function(valori)
{
	document.richiediUtentePassword.VALIDO = false;
	
	if(typeof valori != 'undefined')
	{
		if(valori.length > 1)
		{
			for(var idx = 0; idx < valori[1].length; idx++)
			{
				document.richiediUtentePassword.A_CAMPI_UTENTE[valori[0][idx]] = valori[1][idx];
			}
			
			document.richiediUtentePassword.VALIDO = true;
		}
	}
};

document.richiediUtentePassword.conferma = function(utente, password)
{
	var sql = 'select * from WEB where WEBUSER = \'' + utente + '\' and WEBPASSWORD = ';
	
	if(typeof utente != 'undefined' && typeof utente != 'undefined')
	{
		document.richiediUtentePassword.USERNAME = utente;
		
		dwr.engine.setAsync(false);
		
		toolKitUtility.decriptaPassword(password, this._check_pwd);
		
		sql += '\'' + document.richiediUtentePassword.PASSWORD + '\'';
		
		toolKitDB.getListResultWebMeta(sql, this._check_db);
		
		dwr.engine.setAsync(true);
		
		if(!document.richiediUtentePassword.VALIDO)
		{
			alert('Autenticazione fallita!');
		}
		else
		{
			if(document.richiediUtentePassword.VALORIZZA_USERID && typeof document.all['USER_ID'] != 'undefined')
			{
				document.all['USER_ID'].value = this.getValore('IDEN_PER');
			}
			
			document.chiudiAttesaSalvataggio();
			document.richiediUtentePassword.setRichiediPwdRegistra(false);
			
			eval(document.richiediUtentePassword.CALL_JS);
		}
	}
	else
	{
		alert('Errore interno: check utente/password.');
	}
	//return document.richiediUtentePassword.VALIDO;
};

document.richiediUtentePassword.view = function(js_call, carica_utente)
{
	var divAttesa    = document.all['divAttesa'];
	var divRichiesta = null;
	var pagina       = '';
	
	if(document.richiediUtentePassword.getRichiediPwdRegistra())
	{
		this.init();
		
		if(typeof carica_utente == 'undefined' || carica_utente != 'S')
		{
			document.richiediUtentePassword.VALORIZZA_USERID = false;
		}
		else
		{
			document.richiediUtentePassword.VALORIZZA_USERID = true;
		}
		
		if(typeof js_call == 'undefined' || trim(js_call) == '')
		{
			js_call = 'registra()'; // Default!
		}
		
		document.richiediUtentePassword.CALL_JS = js_call;
		
		if(typeof divAttesa == 'undefined')
		{
			divAttesa = document.createElement('DIV');
			
			divAttesa.setAttribute('id', 'divAttesa');
			divAttesa.className = 'clsDivBlackOpacity';
			
			// Lo so, fa schifo..... Ma è per far prima!!!
			pagina = '<table class="classTabHeader" cellSpacing=0 cellPadding=0><tr><td class="classTabHeaderSx"></td><td class="classTabHeaderMiddle"><label>Richiesta utente e password</label></TD><TD class="classTabHeaderDx"></td></tr></table>';
			pagina += '<table class="classDataEntryTable" cellSpacing=0 cellPadding=0>';
			pagina += '<tr><td class="classTdLabel"><label>Utente</label></td><td class="classTdField"><input id="txtRichiestaUtente" value=""  type="text" onkeypress="document.richiediUtentePassword.checkKeyPress();"></td></tr>';
			pagina += '<tr><td class="classTdLabel"><label>Password</label></td><td class="classTdField"><input id="txtRichiestaPassword" value="" type="password" onkeypress="document.richiediUtentePassword.checkKeyPress();"></td></tr>';
			pagina += '</table>';
			pagina += '<table cellpadding=0 cellspacing=0 class="classTabHeader"><tr>';
			pagina += '<td class="classTabFooterSx"></td><td class="classTabHeaderMiddle">&nbsp;</td>';
			pagina += '<td class="classButtonHeader"><div class="pulsante"><a href="javascript:document.richiediUtentePassword.conferma(document.all.txtRichiestaUtente.value, document.all.txtRichiestaPassword.value);">Conferma</a></div></td>';
			pagina += '<td class="classButtonHeader"><div class="pulsante"><a href="javascript:document.richiediUtentePassword.annulla();">Annulla</a></div></td>';
			pagina += '<td class="classTabFooterDx"></td>';
			pagina += '</tr></table>';
			
			divRichiesta = document.createElement('DIV');
			
			divRichiesta.setAttribute('id', 'divRichiesta');
			divRichiesta.className = 'clsdivRichiestaPassword';
			divRichiesta.innerHTML = pagina;
			
			divAttesa.setAttribute('onclick', new Function('javascript:document.chiudiAttesaSalvataggio();'));
			
			/*document.all['body'].appendChild(divAttesa);
			document.all['body'].appendChild(divRichiesta);*/
			document.body.appendChild(divAttesa);
			document.body.appendChild(divRichiesta);
		}
		
		divAttesa.style.display = 'block';
		document.all.txtRichiestaUtente.focus();
	}
};

document.richiediUtentePassword.setRichiediPwdRegistra = function(attivo)
{
	if(typeof attivo != 'undefined')
	{
		if(typeof attivo == 'boolean')
		{
			document.richiediUtentePassword.RICHIEDI_PWD_REG = attivo;
		}
		else
		{
			if(typeof attivo == 'string')
			{
				document.richiediUtentePassword.RICHIEDI_PWD_REG = (attivo == 'S');
			}
		}
	}
};

document.richiediUtentePassword.getRichiediPwdRegistra = function()
{
	return document.richiediUtentePassword.RICHIEDI_PWD_REG;
};

document.richiediUtentePassword.checkKeyPress = function()
{
	if(window.event.keyCode==13)
	{
		window.event.returnValue=false;
		
		document.richiediUtentePassword.conferma(document.all.txtRichiestaUtente.value, document.all.txtRichiestaPassword.value);
	}
};

/**
 * Codifica i caratteri non alfanumerici in entità HTML.
 * 
 * @author  gianlucab
 * @version 1.1
 * @since   2015-05-13
 * @returns String
 */
var _HTMLentities = {
	"\"": "&quot;",   // quotation mark
	"'" : "&apos;",   // apostrophe 
	"&" : "&amp;",    // ampersand
	"<" : "&lt;",     // less-than
	">" : "&gt;",     // greater-than
	" " : "&nbsp;",   // non-breaking space
	"¡" : "&iexcl;",  // inverted exclamation mark
	"¢" : "&cent;",   // cent
	"£" : "&pound;",  // pound
	"¤" : "&curren;", // currency
	"¥" : "&yen;",    // yen
	"¦" : "&brvbar;", // broken vertical bar
	"§" : "&sect;",   // section
	"¨" : "&uml;",    // spacing diaeresis
	"©" : "&copy;",   // copyright
	"ª" : "&ordf;",   // feminine ordinal indicator
	"«" : "&laquo;",  // angle quotation mark (left)
	"¬" : "&not;",    // negation
	"­" : "&shy;",    // soft hyphen
	"®" : "&reg;",    // registered trademark
	"¯" : "&macr;",   // spacing macron
	"°" : "&deg;",    // degree
	"±" : "&plusmn;", // plus-or-minus 
	"²" : "&sup2;",   // superscript 2
	"³" : "&sup3;",   // superscript 3
	"´" : "&acute;",  // spacing acute
	"µ" : "&micro;",  // micro
	"¶" : "&para;",   // paragraph
	"·" : "&middot;", // middle dot
	"¸" : "&cedil;",  // spacing cedilla
	"¹" : "&sup1;",   // superscript 1
	"º" : "&ordm;",   // masculine ordinal indicator
	"»" : "&raquo;",  // angle quotation mark (right)
	"¼" : "&frac14;", // fraction 1/4
	"½" : "&frac12;", // fraction 1/2
	"¾" : "&frac34;", // fraction 3/4
	"¿" : "&iquest;", // inverted question mark
	"×" : "&times;",  // multiplication
	"÷" : "&divide;", // division
	"À" : "&Agrave;", // capital a, grave accent
	"Á" : "&Aacute;", // capital a, acute accent
	"Â" : "&Acirc;",  // capital a, circumflex accent
	"Ã" : "&Atilde;", // capital a, tilde
	"Ä" : "&Auml;",   // capital a, umlaut mark
	"Å" : "&Aring;",  // capital a, ring
	"Æ" : "&AElig;",  // capital ae
	"Ç" : "&Ccedil;", // capital c, cedilla
	"È" : "&Egrave;", // capital e, grave accent
	"É" : "&Eacute;", // capital e, acute accent
	"Ê" : "&Ecirc;",  // capital e, circumflex accent
	"Ë" : "&Euml;",   // capital e, umlaut mark
	"Ì" : "&Igrave;", // capital i, grave accent
	"Í" : "&Iacute;", // capital i, acute accent
	"Î" : "&Icirc;",  // capital i, circumflex accent
	"Ï" : "&Iuml;",   // capital i, umlaut mark
	"Ð" : "&ETH;",    // capital eth, Icelandic
	"Ñ" : "&Ntilde;", // capital n, tilde
	"Ò" : "&Ograve;", // capital o, grave accent
	"Ó" : "&Oacute;", // capital o, acute accent
	"Ô" : "&Ocirc;",  // capital o, circumflex accent
	"Õ" : "&Otilde;", // capital o, tilde
	"Ö" : "&Ouml;",   // capital o, umlaut mark
	"Ø" : "&Oslash;", // capital o, slash
	"Ù" : "&Ugrave;", // capital u, grave accent
	"Ú" : "&Uacute;", // capital u, acute accent
	"Û" : "&Ucirc;",  // capital u, circumflex accent
	"Ü" : "&Uuml;",   // capital u, umlaut mark
	"Ý" : "&Yacute;", // capital y, acute accent
	"Þ" : "&THORN;",  // capital THORN, Icelandic
	"ß" : "&szlig;",  // small sharp s, German
	"à" : "&agrave;", // small a, grave accent
	"á" : "&aacute;", // small a, acute accent
	"â" : "&acirc;",  // small a, circumflex accent
	"ã" : "&atilde;", // small a, tilde
	"ä" : "&auml;",   // small a, umlaut mark
	"å" : "&aring;",  // small a, ring
	"æ" : "&aelig;",  // small ae
	"ç" : "&ccedil;", // small c, cedilla
	"è" : "&egrave;", // small e, grave accent
	"é" : "&eacute;", // small e, acute accent
	"ê" : "&ecirc;",  // small e, circumflex accent
	"ë" : "&euml;",   // small e, umlaut mark
	"ì" : "&igrave;", // small i, grave accent
	"í" : "&iacute;", // small i, acute accent
	"î" : "&icirc;",  // small i, circumflex accent
	"ï" : "&iuml;",   // small i, umlaut mark
	"ð" : "&eth;",    // small eth, Icelandic
	"ñ" : "&ntilde;", // small n, tilde
	"ò" : "&ograve;", // small o, grave accent
	"ó" : "&oacute;", // small o, acute accent
	"ô" : "&ocirc;",  // small o, circumflex accent
	"õ" : "&otilde;", // small o, tilde
	"ö" : "&ouml;",   // small o, umlaut mark
	"ø" : "&oslash;", // small o, slash
	"ù" : "&ugrave;", // small u, grave accent
	"ú" : "&uacute;", // small u, acute accent
	"û" : "&ucirc;",  // small u, circumflex accent
	"ü" : "&uuml;",   // small u, umlaut mark
	"ý" : "&yacute;", // small y, acute accent
	"þ" : "&thorn;",  // small thorn, Icelandic
	"ÿ" : "&yuml;"    // small y, umlaut mark
};
String.prototype.HTMLencode = function() {
	return this.replace(/[^ \r\na-zA-Z0-9!#$%()*+,\-.\/:;=?@\[\\\]\^_`{|}~]/g, function(match) {
	
		return _HTMLentities[match] || "&#x"+("0"+match.charCodeAt(0).toString(16)).slice(-2)+";";
	});
};