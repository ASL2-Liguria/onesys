var function_after_registra = '';

/**
*/
function onLoad()
{
	document.form.login.value = baseUser.LOGIN;
	document.form.pwd.focus();	
}

/**
*/
function checkUtente(){
	var doc    = document.form;
	var utente = doc.login.value;
	var query  = '';
	
	query = "select attivo, deleted, iden_per, tipo, cod_ope, ob_esecuzione from WEB where webuser = '" + utente + "'";

	if(utente != '')
		CJsGestioneUtentePwd.check_user_pwd(query, cbk_checkUtente);	
}

/**
*/
function cbk_checkUtente(message)
{
	if(message != 'true' && message != 'false')
	{
		alert(message);
		return;
	}
	if(message == 'false')
	{
		alert('Attenzione: permissioni insufficienti');
		return;
	}
}

/**
*/
function registra()
{
	var doc    = document.form;
	var utente = doc.login.value;
	var pwd    = doc.pwd.value;
	var query  = '';
	
	if(utente == '' || pwd == '')
	{
		alert(ritornaJsMsg("utente_pwd"));
		doc.login.focus();
		return;
	}
	else
	{
		query = "select attivo, deleted, iden_per, tipo, cod_ope, ob_esecuzione from WEB where webuser = '" + utente + "'";
		query += " and webpassword = ";
		
		/*Controlli sull'utente e la pwd*/
		CJsGestioneUtentePwd.check_user_pwd(query + '@' + pwd + '@' + utente, cbk_check_user_pwd);
	}
	
}

/**
*/
function cbk_check_user_pwd(message)
{
	if(message != 'true' && message != 'false')
	{
		alert(message);
		return;
	}
	if(message == 'false')
	{
		document.form.pwd.value = '';
		document.form.pwd.focus();
		alert(ritornaJsMsg("ute_pwd_errata"));
		return;
	}
	
	
	function_after_registra = document.form.next_function.value;

	eval(function_after_registra);
	
	self.close();
	
	CJsGestioneUtentePwd = null;
}

/**
*/
function intercetta_tasti()
{
	if (window.event.keyCode == 13)
	{
		 window.event.returnValue = false;
		 registra();
	}	
}

/**
*/
function annulla()
{
	opener.aggiorna();
	self.close();
}