/*Funzione che effettua il trim della stringa passata in input*/
function trim(stringa)
{
	stringa = stringa.replace(/^\s+/g, "");
	return stringa.replace(/\s+$/g, "");
}
