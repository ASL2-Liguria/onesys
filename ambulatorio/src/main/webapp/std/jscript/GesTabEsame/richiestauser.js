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
}

document.richiediUtentePassword.init = function()
{
	document.richiediUtentePassword.A_CAMPI_UTENTE   = new Array();
	document.richiediUtentePassword.USERNAME         = '';
	document.richiediUtentePassword.PASSWORD         = '';
	document.richiediUtentePassword.VALIDO         	 = false;
	document.richiediUtentePassword.VALORIZZA_USERID = false;
	document.richiediUtentePassword.CALL_JS	         = '';
	document.richiediUtentePassword.RICHIEDI_PWD_REG = false;
}

document.richiediUtentePassword.annulla = function()
{
	this.init();
	
	document.chiudiAttesaSalvataggio();
}

document.richiediUtentePassword._check_pwd = function(pwd)
{
	document.richiediUtentePassword.PASSWORD = pwd;
}

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
}

document.richiediUtentePassword.conferma = function(utente, password)
{
	var sql = 'select * from WEB where WEBUSER = \'' + utente + '\' and WEBPASSWORD = ';
	
	if(document.all.txtNoteRichiestaPassword.value != '')
	{
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
				
				document.gestione_esame.Hute_sblocca_impegnativa.value = this.getValore('IDEN_PER');
				document.gestione_esame.Hnote_sblocca_impegnativa.value = document.all.txtNoteRichiestaPassword.value;
				document.gestione_esame.impegnativa.value = '';
				
				document.chiudiAttesaSalvataggio();
				document.richiediUtentePassword.setRichiediPwdRegistra(false);
				
				eval(document.richiediUtentePassword.CALL_JS);
			}
		}
		else
		{
			alert('Errore interno: check utente/password.');
		}
	}
	else
	{
		alert('Inserire le note!');
	}
	//return document.richiediUtentePassword.VALIDO;
}

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
pagina += '<tr><td class="classTdLabel"><label>Note</label></td><td class="classTdField"><textarea id="txtNoteRichiestaPassword" value="" rows=4 style="width:100%"></textarea></td></tr>';
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
}

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
}

document.richiediUtentePassword.getRichiediPwdRegistra = function()
{
	return document.richiediUtentePassword.RICHIEDI_PWD_REG;
}

document.richiediUtentePassword.checkKeyPress = function()
{
	if(window.event.keyCode==13)
	{
		window.event.returnValue=false;
		
		document.richiediUtentePassword.conferma(document.all.txtRichiestaUtente.value, document.all.txtRichiestaPassword.value);
	}
}

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
}
