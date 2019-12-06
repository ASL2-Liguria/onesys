/*
	Funzione che effettua il controllo sull'ora.
	I caratteri divisori accettati sono il punto ed i due punti.
	@param campo valore del campo che contiene l'ora
	@param nome_label_alert indica il nome della label inserito nella tabella imagoweb.LINGUE
*/
function checkora(campo, nome_label_alert)
{
	var vettore;

	valore = campo.value
	carattere_divisore = ""
	if (valore=="")
	{
		return;	
	}
	indice_punto = valore.indexOf(".")
	indice_linea = valore.indexOf(":")
	if (indice_punto != -1)
	{
		carattere_divisore = ".";
	}
	if (indice_linea != -1)
	{
		carattere_divisore = ":";
	}
	if (carattere_divisore == "" )
	{
		alert(ritornaJsMsg(nome_label_alert));
		campo.value = '';
		campo.focus();
		return;
	}
	vettore= valore.split(carattere_divisore);
	ore = vettore[0];
	if (ore=="")
	{
		alert(ritornaJsMsg(nome_label_alert));
		campo.value = '';
		campo.focus();
		return;
	}
	if ((parseInt(ore)>23) || (parseInt(ore)<0))
	{
		alert(ritornaJsMsg(nome_label_alert));
		campo.value = '';
		campo.focus();
		return;
	}
	min = vettore[1];
	if (min=="")
	{
		alert(ritornaJsMsg(nome_label_alert));
		campo.value = '';
		campo.focus();
		return;
	}
	if ((parseInt(min)>59) || (parseInt(min)<0))
	{
		alert(ritornaJsMsg(nome_label_alert));
		campo.value = '';
		campo.focus();
		return;
	}
	if (parseInt(ore)<10)
	{
		ore = "0" + parseInt(ore,10);
	}
	if (parseInt(min)<10)
	{
		min = "0" + parseInt(min,10);
	}
	campo.value = ore + ":" + min;
}

/*function checkora(oggetto, nome_label_alert){
var res;
var re = /^[0-9]{2}[:|^.][0-9]{2}$/;
var valore = oggetto.value;
var verifica = valore.match(re);
if(verifica){
	res = 1;
	oggetto.value = oggetto.value.replace('.', ':');
	}
else{
	alert(ritornaJsMsg(nome_label_alert));
	oggetto.value = '';
	//oggetto.focus();
	res = 0;
	}
}
*/
