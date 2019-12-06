function delete_on_rows_lock(provenienza)
{
	/*alert('delete_on_rows_lock');
	alert(document.form_rows_lock.hblocco.value);*/
	
	var doc = document.form_rows_lock;
	doc.action = 'SL_Rows_Lock';
	doc.target = 'win_lock';
	doc.method = 'POST';

	/*20080609*/
	var win_lock = window.open("", "win_lock", 'width=1, height=1, status=yes, top=800000, left=0');
	if(win_lock)
		win_lock.focus();
	else
		win_lock = window.open("", "win_lock", 'width=1, height=1, status=yes, top=800000, left=0');
	

	doc.submit();
	
	try
	{
		if(provenienza == 'A')//if(provenienza != 'R')
			opener.aggiorna('NO');
	}
	catch(e){
	}
	
	try{
		win_lock.close();
	}
	catch(e){
		alert('Non è stata chiusa la finestra della gestione lock');
	}
}


