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
	if (typeof WindowCartella === 'undefined') WindowCartella = top;

	window.moveTo(0,0);
	
	if(WindowCartella.window.resizeTo)
	{
		WindowCartella.window.resizeTo(screen.availWidth,screen.availHeight);
	}
	else
	{
		if(document.layers || document.getElementById)
		{
			if(WindowCartella.window.outerHeight<screen.availHeight || WindowCartella.window.outerWidth<screen.availWidth)
			{
				WindowCartella.window.outerHeight = screen.availHeight;
				WindowCartella.window.outerWidth = screen.availWidth;
			}
		}
	}
	/*try
	{
		WindowCartella.resizeTo(screen.availWidth, screen.availHeight);
		WindowCartella.moveTo(0,0);
	}
	catch(e)
	{
	}*/
};

// Funzione che effettua il trim della stringa passata in input
function trim(str)
{
	if (typeof str === 'string')
		return str.replace(/^\s+|\s+$/, '');
	return '';
}

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/, '');
};

document.apriAttesaSalvataggio = function()
{
	try{
		var divAttesa   = $('#divAttesa');
		var divRegistra = null;
		var imgAttesa   = null;
		var spanAttesa  = null;
		
		if(typeof divAttesa.get(0) === 'undefined')
		{
			divAttesa = $('<div id="divAttesa" class="clsDivBlackOpacity"/>');
			divAttesa.get(0).onclick = function() { document.chiudiAttesaSalvataggio(); };

			divRegistra = $('<div id="divRegistraAttesa" class="clsDivAttesaRegistra"/>');
			divRegistra.appendTo(divAttesa);
				
			spanAttesa = $('<div id="spanRegistraAttesa" class="clsSpanAttesaRegistra">Salvataggio in corso...</div>');
			spanAttesa.appendTo(divRegistra);

			imgAttesa = $('<img src="imagexPix/thickbox/loadingAnimation.gif" class="clsImgAttesa8Registra"/>');
			imgAttesa.appendTo(divRegistra);
			
			divAttesa.appendTo('body');
			
			divRegistra.css('left', ((document.body.offsetWidth / 2) - 100) + 'px');
			divRegistra.css('top', ((document.body.offsetHeight / 2) - 50) + 'px');
			divAttesa.css('height', document.body.offsetHeight + 'px');
			imgAttesa.css('top', (document.getElementById('divRegistraAttesa').offsetHeight + 30) + 'px');
		}
		
		divAttesa.css('display', 'block');
	} catch(e){
		alert(e.message);
	}
};

document.chiudiAttesaSalvataggio = function()
{
	var divAttesa    = document.getElementById('divAttesa');
	var divRichiesta = document.getElementById('divRichiesta');
	
	if(typeof divAttesa != 'undefined' && divAttesa)
	{
		document.body.removeChild(divAttesa);
	}
	
	if(typeof divRichiesta != 'undefined' && divRichiesta)
	{
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
			if(document.richiediUtentePassword.VALORIZZA_USERID && typeof document.getElementById('USER_ID') != 'undefined')
			{
				document.getElementById('USER_ID').value = this.getValore('IDEN_PER');
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
	var divAttesa    = document.getElementById('divAttesa');
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
			pagina += '<td class="classButtonHeader"><div class="pulsante"><a href="javascript:document.richiediUtentePassword.conferma(document.getElementById(\'txtRichiestaUtente\').value, document.getElementById(\'txtRichiestaPassword\').value);">Conferma</a></div></td>';
			pagina += '<td class="classButtonHeader"><div class="pulsante"><a href="javascript:document.richiediUtentePassword.annulla();">Annulla</a></div></td>';
			pagina += '<td class="classTabFooterDx"></td>';
			pagina += '</tr></table>';
			
			divRichiesta = document.createElement('DIV');
			
			divRichiesta.setAttribute('id', 'divRichiesta');
			divRichiesta.className = 'clsdivRichiestaPassword';
			divRichiesta.innerHTML = pagina;
			
			divAttesa.setAttribute('onclick', new Function('javascript:document.chiudiAttesaSalvataggio();'));
			
			document.body.appendChild(divAttesa);
			document.body.appendChild(divRichiesta);
		}
		
		divAttesa.style.display = 'block';
		document.getElementById('txtRichiestaUtente').focus();
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
		
		document.richiediUtentePassword.conferma(document.getElementById('txtRichiestaUtente').value, document.getElementById('txtRichiestaPassword').value);
	}
};

String.prototype.stripX=function(boo){
	
	var str= this;
	
	if(boo){
		
		str = str.replace(/\&amp;/g,'&');
		str = str.replace(/\&lt;/g,'<');
		str = str.replace(/\&gt;/g, ">");
		str = str.replace(/\&quot;/g, "\"");
		str = str.replace(/\&#039;/g, "'");
		
	}else{
		
		str = str.replace(/\&/g,'&amp;');
		str = str.replace(/</g,'&lt;');
		str = str.replace(/>/g,'&gt;');
		str = str.replace(/\"/g,'&quot;');
		str = str.replace(/\'/g,'&#039;');
		
	}
	
	return str;
};

/**
 * Codifica i caratteri non alfanumerici in entità HTML.
 * 
 * @author  gianlucab
 * @version 1.0
 * @since   2015-05-13
 * @returns String
 */
var _HTMLentities = {
	"'" : "&apos;",
	"\"": "&quot;",
	"&" : "&amp;",
	"<" : "&lt;",
	">" : "&gt;"
};
String.prototype.HTMLencode = function() {
	return this.replace(/([^a-z-A-Z0-9])/g, function(match, capture) {
		return _HTMLentities[capture] || "&#x"+("0"+capture.charCodeAt(0).toString(16)).slice(-2)+";";
	});
};
