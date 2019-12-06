var reg = false;
var maxNumChar = 3000;
$(function(){
	document.form_ref.testo.value = decodeURI (document.form_ref.testo.value);
	$( document.form_ref.testo ).bind( "keypress", function( event ) {
		var re = new RegExp("%20", 'g');
		if (encodeURI($(this).val()).replace(re, ' ').length>maxNumChar){
		  event.preventDefault();
		  alert("Impossibile continuare, superato il numero massimo (" + maxNumChar+") di caratteri.");
		  return;
		}
	});
});

function salva()
{
	var doc = null;
	var testoInput = null;
	var testoOutput = null;
	var re = new RegExp("%20", 'g');	
	
	doc = document.form_ref;	
	doc.hduplicazione.value = duplicazione;//== D quando premo il pulsante duplica
	reg = true;
	
	testoInput = doc.testo.value;
	testoOutput = encodeURI(testoInput) ;
	if (testoOutput.replace(re, ' ').length>maxNumChar){
	  alert("Impossibile continuare, superato il numero massimo (" + maxNumChar+") di caratteri.");
	  return;
	}

	testoOutput = testoOutput.replace(re, ' ');

	
	if (doc.cod_dec.value=="")
	{
    	alert(ritornaJsMsg('a0'));
    	doc.cod_dec.focus();
    	return;
	}
	
	if(doc.descr.value=="")
	{
    	alert(ritornaJsMsg('a1'));
    	doc.descr.focus();
    	return;
	}
	
	if (doc.attivo.checked==1) 
    	doc.hattivo.value="N";
	else
    	doc.hattivo.value="S";
    
	doc.hregistrazione.value = reg;
	if((doc.hoperazione.value == 'MOD' && doc.hduplicazione.value == 'D'))// || doc.hoperazione.value == 'INS'
	{
		checkForInsertTabRef();
	}
	else
	{
		doc.testo.value = testoOutput;
		//document.form_ref.testo.value = document.form_ref.testo.value.toLowerCase();
		doc.submit();
		//setTimeout(function(){chiudi_ins_mod();},2000);
		chiudi_ins_mod();
	}
}

function chiudi()
{
	opener.aggiorna_worklist();
	self.close();
}

function chiudi_ins_mod()
{
	var tipo_ricerca;
	var campo_descr;
	tipo_ricerca = opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value;
	if(tipo_ricerca == 'DESCR')
		campo_descr = document.form_ref.descr.value;
    else
		campo_descr = document.form_ref.cod_dec.value;
	
	opener.parent.Ricerca.put_last_value(campo_descr);
	setTimeout(function(){self.close();},2000);
}

function duplica()
{
	document.form_duplica.tipo.value = 'D';
	document.form_duplica.cod_refDup.value = document.form_ref.cod_dec.value;
	document.form_duplica.iden_medDup.value = document.form_ref.medico.value;
	document.form_duplica.opDup.value = 'MOD';
	document.form_duplica.submit();
}


function funzione(operazione)
{
//	alert('funzione(): ' + operazione);
	if(operazione == 'inserimento')
	{
		// ***** modifica
		var testoOutput = encodeURI(document.form_ref.testo.value);
		var re = new RegExp("%20", 'g');		
		testoOutput = testoOutput.replace(re, ' ');
		document.form_ref.testo.value = testoOutput;
		// ****************
		document.form_ref.submit();
		chiudi_ins_mod();
	}
}
