
//assegno alcune classi all'apertura della pagina
addClass(document.all['ElencoCDCscelti'],'listboxCDC');
addClass(document.all['ElencoPartiScelte'],'listboxCDC');
addClass(document.all['txtCodEsa'],'textCDC');
addClass(document.all['txtDescrEsa'],'textCDC');
document.getElementById('divCorpo').style.display='none';


function chiudi(){

	alert('funzione che chiude la pagina, si attende la posizione in cui andrà collocata la pagina per decidere in che modo chiuderla');
	//self.close();

}

function preSalvataggio(){

	alert('Dovrei salvare... ma......... non ce la faccio!!!!');
	//registra();

}

function onChangeMetodica(){

	if (true){
	
		document.getElementById('divCorpo').style.display='none';
	
	}

}
