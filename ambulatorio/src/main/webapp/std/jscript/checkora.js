function checkora(campo)
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
		alert("Inserire ora corretta.Il carattere divore può essere '.' oppure ':'");
		campo.value = "";
		campo.focus();
		return;
	}
	vettore= valore.split(carattere_divisore);
	ore = vettore[0];
	if (ore=="")
	{
		alert("Inserire ora corretta.");
		campo.value = "";
		campo.focus();
		return;
	}
	if ((parseInt(ore)>23) || (parseInt(ore)<0))
	{
		alert("Inserire ora corretta.");
		campo.value = "";
		campo.focus();
		return;
	}
	min = vettore[1];
	if (min=="")
	{
		alert("Inserire ora corretta.");
		campo.value = "";
		campo.focus();
		return;
	}
	if ((parseInt(min)>59) || (parseInt(min)<0))
	{
		alert("Inserire ora corretta.");
		campo.value = "";
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