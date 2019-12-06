var pwdPS;
    
function chiudi_ins_mod()
{
	opener.parent.Ricerca.put_last_value(document.frm_web.webuser.value);
	self.close();
}	
	
function annulla()
{
	opener.aggiorna_worklist();
	self.close();
}
        
function scegli_nome_utente()
{
	finestraIdenPer = window.open('','winIdenPer','width=400,height=600, resizable = yes, status=yes, top=10,left=10');
    document.form_iden_personale.myric.value = document.frm_web.nome_per.value;
    document.form_iden_personale.myproc.value = 'TAB_PER';
    document.form_iden_personale.mywhere.value = '';
    document.form_iden_personale.submit();
}
        
        
function duplica()
{
	if(document.frm_web.webuser.value == '' || document.frm_web.nome_per.value == '' || document.frm_web.iden_per.value == '')
	{
    	if(document.frm_web.webuser.value == '')
		{
        	alert(ritornaJsMsg('ins_webuser'));
          	document.frm_web.webuser.focus();
          	return;
        }
        else
		{
             if(document.frm_web.nome_per.value == '')
			 {
                 alert(ritornaJsMsg('ins_nome_per'));
                 document.frm_web.nome_per.focus();
                 return;
             }
             else
			 {
                 alert(ritornaJsMsg('ins_hiden_per'));
                 document.frm_web.nome_per.value = '';
                 document.frm_web.nome_per.focus();
                 return;
             }
        }
     }
     else
	 {
        var finestra_pwd = window.open('PasswordServlet?nome_form=frm_web','popDialog','height=250,width=400,scrollbars=no,top=250,left=300');
      }
}
        
function CambiaTipoPersonale(ck)
{
}


function controlla_webuser()
{
	var res = controllo_correttezza_webuser(document.frm_web.webuser, 'alert_wrong_webuser');
	if(res == 1)
		CJsCheckPrimaryKey.check_primary_key("web@webuser='"+document.frm_web.webuser.value+"'@attivo", cbkPrimaryKey);
}

function cbkPrimaryKey(attivo)
{
	//alert('ATTIVO= ' + attivo);
	if(attivo == 'N')
	{
		var ripristina = confirm(ritornaJsMsg('webuser_cancellato'));//L'utente inserito è già presente nel database ma è cancellato:vuoi ripristinarlo?
		if(ripristina)
			ripristina_pc();
		else
		{
			document.frm_web.webuser.value = '';
			document.frm_web.webuser.focus();
		}
		return;
	}
	if(attivo == 'S')
	{
		alert(ritornaJsMsg('webuser_esistente'));//L'utente inserito è già presente nel database.Modificare il webuser
		document.frm_web.webuser.value = '';
		document.frm_web.webuser.focus();
		return;
	}
	else
		if(attivo != 'S' && attivo != 'N' && attivo != '')
		{
			alert(deleted);//errore
			return;
		}
}

function ripristina_pc()
{	
	CJsCheckPrimaryKey.ripristina_record("web@webuser = '" + document.frm_web.webuser.value + "'@attivo='S',deleted='N'", cbkRipristino);
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
