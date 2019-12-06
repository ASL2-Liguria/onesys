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
	
	par_dwr = pagina + '*' + idens + '*' + parametri;
	
	dwr.engine.setAsync(false);
	
	dwrLockPage.isLockRet(par_dwr, chkisLockPage);
	
	dwr.engine.setAsync(true);
	
	return (s_sp_out_lock == 'TRUE');
}

function chkisLockPage(par)
{
	dwrLockPage.getOut(setOutLock); 
	dwrLockPage.getResult(setOutResult);
}

function setOutLock(ret)
{
	s_sp_out_lock = ret;
}

function setOutResult(ret)
{
	s_sp_out_result = ret;
}