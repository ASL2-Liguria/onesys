// modifica 18-4-16
window.setTimeout(function(){
	document.ins_ora.txt_ora.focus();
},500);
// **************

function annulla_invio()
{
	if (window.event.keyCode==13)
	{
		window.event.returnValue=false;
		inserisci();
	}
}

function inserisci()
{
	var par;
	
	checkora(document.ins_ora.txt_ora);
	
	if(document.ins_ora.txt_ora.value == '')
	{
		alert('Prego inserire l\'orario!');
	}
	else
	{
		par = document.ins_ora.iden_imp_sale.value + '*' + document.ins_ora.txt_ora.value + '*S';
		
		prenDWRClient.forza_orario(par, check_inserisci)
	}
}

function check_inserisci(ret)
{
	if(ret != null && ret != '')
	{
		alert(ret);
	}
	
	annulla();
}

function annulla()
{
	try
	{
		opener.aggiorna();
	}
	catch(ex)
	{
	}
	
	self.close();
}