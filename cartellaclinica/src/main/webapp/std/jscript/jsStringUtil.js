// JavaScript Document
// Aggiunge una funzione denominata trim come metodo dell'oggetto 
// prototipo del costruttore String.
String.prototype.trim = function()
{
    // Utilizza un'espressione regolare per sostituire gli spazi 
    // iniziali e finali con la stringa vuota
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

// verificare se funziona!!!
String.prototype.replaceAll = function(stringToBeReplaced, stringToReplace)
{
	var strOutput = "";
	
	var regex =new RegExp(stringToBeReplaced , "g");
	return this.replace(regex,stringToReplace);
}
