var function_after_registra = '';

/**
*/
function onLoad()
{
	document.all.div.style.display='block';
	document.form.login.value = baseUser.LOGIN;
	document.form.pwd.focus();	
}

/**
*/
function checkUtente(provenienza){
	//alert(provenienza);
	
	if(provenienza == 'SOMMINISTRAZIONE')
		verificaEsistenzaUtente();
	else
		verificaEsistenzaUtenteEsecuzione();
}

/**
Verifica anche la permissione per l'esecuzione di un esame
*/
function verificaEsistenzaUtenteEsecuzione(){
	var doc    = document.form;
	var utente = doc.login.value;
	var query  = '';
	
	query = "select attivo, deleted, iden_per, tipo, cod_ope, ob_esecuzione from WEB where webuser = '" + utente + "'";

	if(utente != ''){
		dwr.engine.setAsync(false);
		CJsGestioneUtentePwd.check_user_pwd(query, cbk_verificaEsistenzaUtenteEsecuzione);	
		dwr.engine.setAsync(true);
	}
}



/**
Funzione utilizzata per la gestione della parte di somministrazione di m.n.
*/
function verificaEsistenzaUtente(){
	var doc    = document.form;
	var utente = doc.login.value;
	var query  = '';
	
	query = "select attivo, deleted, iden_per from WEB where webuser = '" + utente + "'";

	if(utente != ''){
		dwr.engine.setAsync(false);
		CJsGestioneUtentePwd.checkUserPwd(query, cbk_verificaEsistenzaUtente);	
		dwr.engine.setAsync(true);
	}
}

/**
*/
function cbk_verificaEsistenzaUtente(message)
{
	//alert('cbk_verificaEsistenzaUtente: ' + message);
	/*if(message != 'true' && message != 'false')
	{
		alert(message);
		return;
	}*/
	if(message == 'false')
	{
		alert('Attenzione: inserire correttamente utente e pwd');
		return;
	}
}



/**
*/
function cbk_verificaEsistenzaUtenteEsecuzione(message)
{
	if(message != 'true' && message != 'false')
	{
		alert(message);
		return;
	}
	if(message == 'false')
	{
		alert('Attenzione: verificare utente, pwd e permissioni di esecuzione');
		return;
	}
}

/**
*/
function registra(provenienza)
{
	//alert(provenienza);
	if(provenienza == 'SOMMINISTRAZIONE')
		registraSomministrazione();
	else
		registraEsecuzione();	
}

/**
*/
function registraEsecuzione(){
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
		dwr.engine.setAsync(false);
		CJsGestioneUtentePwd.check_user_pwd(query + '@' + pwd + '@' + utente, cbk_registraEsecuzione);
		dwr.engine.setAsync(true);
	}
}


/**
*/
function registraSomministrazione(){
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
		query = "select attivo, deleted, iden_per from WEB where webuser = '" + utente + "'";
		query += " and webpassword = ";
		
		//alert('registraSomministrazione  ' + query);
		
		/*Controlli sull'utente e la pwd*/
		dwr.engine.setAsync(false);
		CJsGestioneUtentePwd.checkUserPwd(query + '@' + pwd + '@' + utente, cbk_registraSomministrazione);
		dwr.engine.setAsync(true);
	}
}

/**
*/
function cbk_registraSomministrazione(message){
	var query = null;
	
	if(message == 'false'){
		alert('Attenzione: utente o password errati');	
		return;
	}   
	
	query = "2@update DETT_ESAMI set ute_ins_somm = "+message+" where iden = "+ opener.stringa_codici(opener.array_iden_esame);
	
	//alert('cbk_registraSomministrazione ' + query);
	
	dwr.engine.setAsync(false);
	CJsUpdate.insert_update(query, cbk_aggiornaUteSomministrazione);	
	dwr.engine.setAsync(true);
}


/**
*/
function cbk_aggiornaUteSomministrazione(message){
	//alert('cbk_aggiornaUteSomministrazione: ' + message);
	if(message != ''){
		alert(message);
		return;
	}
	
	function_after_registra = document.form.next_function.value;
	eval(function_after_registra);
	
	self.close();
}

/**
*/
function cbk_registraEsecuzione(message)
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
	
	//alert('TEST: ' + function_after_registra);

	eval(function_after_registra);
	
	self.close();
	
	CJsGestioneUtentePwd = null;
}

/**
*/
function intercetta_tasti()
{
	var provenienza = null;
	
	if (window.event.keyCode == 13)
	{
		 window.event.returnValue = false;
		 provenienza = document.form.hprovenienza.value;
		 registra(provenienza);
	}	
}

/**
*/
function annulla()
{
	opener.aggiorna();
	self.close();
}


