function invioDati()
{
	if(window.event.keyCode==13)
	{
    	inserisciPwd();
	}
    else
     	alert(ritornaJsMsg('a1'));//Inserici password
}
	
	    
    /*    
        res += "if(document.form.pwd.value == document.form.conferma.value){\n";
        res += "window.opener.pwdPS = document.form.pwd.value;\n";
        res += "window.opener.document." + form + ".hpwd.value = document.form.pwd.value;\n";
        res += "window.opener.document." + form + ".submit();\n";
        res += "opener.opener.location.replace(\"Manu_Tab\");\n";
        res += "opener.close();\n";
        res += "alert(ritornaJsMsg('a2'));\n";//Registrazione effettuata
        res += "self.close();\n";
        res += "opener.location.replace(\"Manu_Tab\");\n";
        res += "}\n";
        res += "else{\n";
        res += "alert(ritornaJsMsg('a3'));\n";//La nuova password non è coerente con la conferma
        res += "document.form.pwd.focus();\n";
        res += "}\n";
        res += "}\n\n";
        return res;
function inserisciPwd(){
	var form = getNomeForm();//frm_generale
	var doc = 'window.opener.document.'+form;
	if(document.form.pwd.value == document.form.conferma.value)
	{
		window.opener.pwdPS = document.form.pwd.value;
		doc.hpwd.value = document.form.pwd.value;
		doc.submit();
		
		window.opener.chiudi_ins_mod();
		alert(ritornaJsMsg('a2'));//Registrazione effettuata
		chiudi();
	}
	else{
		alert(ritornaJsMsg('a3'));//La nuova password non è coerente con la conferma
		document.form.pwd.focus();
	}
}
*/

function chiudi(){
	self.close();
}

