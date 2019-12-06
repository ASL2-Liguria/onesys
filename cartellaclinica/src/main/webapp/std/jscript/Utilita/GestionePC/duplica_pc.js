var pwdPS;
        
function annulla()
{
	//opener.location.replace('SL_Manu_Tab_Worklist?procedura=T_PC');
	//self.close();
	opener.aggiorna_worklist();
	self.close();
}
        
function chiudi_ins_mod(){
	opener.parent.Ricerca.put_last_value(document.form_pc.ip.value);
	self.close();
}		
		
        
function duplica()
{
	if(document.form_pc.ip.value == '' || document.form_pc.nome_host.value == '')
	{
    	if(document.form_pc.ip.value == '')
		{
          alert(ritornaJsMsg('alert_ip'));
          document.form_pc.ip.focus();
          return;
        }
        else
		{
             if(document.form_pc.nome_host.value == '')
			 {
                 alert(ritornaJsMsg('alert_nome_host'));
                 document.form_pc.nome_host.focus();
                 return;
             }
       	}
     }
     else
	 {
		document.form_pc.nome_host.value = document.form_pc.nome_host.value.toUpperCase();
		//document.form_pc.ip.value = document.form_pc.ip.value.toUpperCase();
        document.form_pc.submit();
        chiudi_ins_mod();
       }
}

/*Controllo univocità dell' IP utilizzando AJAX*/
function ckeckPrimaryKey()
{
	if(document.form_pc.ip.value != '')
	{
		CJsCheckPrimaryKey.check_primary_key("configura_pc@ip='"+document.form_pc.ip.value+"'@deleted", cbkPrimaryKey);
	}
}
	
function cbkPrimaryKey(deleted)
{
	if(deleted == 'S')
	{
		var ripristina = confirm(ritornaJsMsg('ip_cancellato'));//L'ip inserito è già presente nel database ma è cancellato:vuoi 					                                                                  ripristinarlo?
		if(ripristina)
			ripristina_pc();
		else
		{
			document.form_pc.ip.value = '';
			document.form_pc.ip.focus();
		}
		return;
	}
	if(deleted == 'N')
	{
		alert(ritornaJsMsg('ip_esistente'));//L'ip inserito è già presente nel database.Modificare l'ip
		document.form_pc.ip.value = '';
		document.form_pc.ip.focus();
		return;
	}
	else
		if(deleted != 'S' && deleted != 'N' && deleted != '')
		{
			alert(deleted);//errore
			return;
		}
}

function ripristina_pc()
{	
	CJsCheckPrimaryKey.ripristina_record("configura_pc@ip = '" + document.form_pc.ip.value + "'@deleted='N'", cbkRipristino);
}
	
function cbkRipristino(message)
{
	if(message != '')
	{
		alert(message);
		return;
	}
	else
	{
		chiudi_ins_mod();
	}
}