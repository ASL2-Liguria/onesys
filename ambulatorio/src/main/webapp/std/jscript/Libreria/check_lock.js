var s_sp_out_result;
var s_sp_out_lock;

function getStatusResult()
{
	return s_sp_out_result;
}

function getStatusLock()
{
	return s_sp_out_lock == 'TRUE';
}

function isLockPage(pagina, idens, parametri)
{
	var par_dwr;
	var bRet;
	var tint;

	s_sp_out_result = '';
	s_sp_out_lock = '';
	try{
		
		par_dwr = pagina + '*' + idens + '*' + parametri;
 
		dwr.engine.setAsync(false);
		dwrLockPage.isLockRet(par_dwr, chkisLockPage);
		dwr.engine.setAsync(true);
	}
	catch(e){alert("isLockPage - Error: " + e.description)}

	return (s_sp_out_lock == 'TRUE');
}

function chkisLockPage(par)
{
	try{
		dwrLockPage.getOut(setOutLock);
		dwrLockPage.getResult(setOutResult);
	}
	catch(e){alert("chkisLockPage - Error: " + e.description)}
}

function setOutLock(ret)
{
	try{
		s_sp_out_lock = ret;
	}catch(e){alert("setOutLock - Error: " + e.description)}
}

function setOutResult(ret)
{
	try{
		s_sp_out_result = ret;
	}catch(e){alert("setOutResult - Error: " + e.description)}
}