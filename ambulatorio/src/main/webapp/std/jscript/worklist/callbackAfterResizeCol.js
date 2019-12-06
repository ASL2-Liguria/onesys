// JavaScript Document

// definisco la funzione che deve essere 
// richiamata dopo il resize della colonna
// *** ATTENZIONE ***
// le funzioni di callback 
// dovranno TUTTE averre questa interfaccia
function callBackFunctionAfterColResizing(nomeCampo, larghezza){
	// aggiorno form per l'aggiornamento automatico
	document.frmAggiorna.hidNomeCampoToResize.value = nomeCampo;
	document.frmAggiorna.hidWidthFieldToResize.value = larghezza;
	// aggiorno
	aggiorna();
}