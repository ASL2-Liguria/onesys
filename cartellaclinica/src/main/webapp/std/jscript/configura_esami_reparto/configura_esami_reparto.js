// JavaScript Document

var _filtro_list_elenco = null;
var _filtro_list_richiedibili = null;

//funzione associata al pulsante conferma
function confermaReparto() {

	
	
	//alert('confermaReparto()');	
	parent.document.EXTERN.REPARTO.value=document.all['Hreparto'].value;
	
	if  (document.all['Hreparto'].value != ''){
	
	alert('VALORE DI REPARTO: '+parent.document.EXTERN.REPARTO.value);
	
	document.all['lblTitoloEsami'].innerText =' Scelta degli esami richiedibili per il reparto  :  ' + document.all['txtReparto'].value + '   ';
	document.all['lblTitoloEsami'].className = '';
	addClass(document.all['lblTitoloEsami'],'reparto');
	ShowLayer('groupEsami');
	document.all['lblRegistra'].parentElement.style.display='block';
	
	parent.document.getElementById('CONFIGURAZIONE_PROFILO_LABORATORIO').onclick=function(){setReparto();};

	}else{
	
		alert('Selezionare il reparto da configurare');
	
	}
	
}


//funzione che cicla l'elenco degli esami richiedibili e prepara i dati per la store procedure di salvataggio (salva però sulla tabella sbagliata) 
function registraEsami(){

	alert('funzione registraEsami');

	var esami = '';
	
	document.EXTERN.INDICE_TABULAZIONE.value='';

		for(i = 0; i < document.all.elencoEsamiRichiedibili.length; i++){

			if(document.all.elencoEsamiRichiedibili.length-1 == i){
				esami += document.all.elencoEsamiRichiedibili[i].value;
			}else{
				esami += document.all.elencoEsamiRichiedibili[i].value + ',';
			}
			
			//alert(esami);

		}

	
	document.dati.Hesami.value = esami;
		
	var debug = 'Valore di Hesami: ' + document.dati.Hesami.value ;
	debug += '\nValore di Hreparto: ' + document.dati.Hreparto.value;

	alert(debug);
	
	registra();
	
	HideLayer('groupEsami');
	parent.switch_tab(1);
}


function annullaEsami(){

	HideLayer('groupEsami');
	cancellaValoreRep();
	removeClass(document.all['lblTitoloEsami'],'reparto');
	document.all['lblTitoloEsami'].innerText ='Esami Richiedibili';
	
}

//funzione che svuota il listbox degli esami richiedibili
function cancellaEsami(){

	if(confirm('Cancellare elenco esami richiedibili?')){
	
		var object=document.dati.elencoEsamiRichiedibili;
		var indice;

		if (object){
		
			indice = parseInt(object.length);
		
			while (indice>-1){
			object.options.remove(indice);
			indice--;
		}
	
	}
	
}
	
//funzione che svuota il contenuto di un listbox
function svuotaListBox(elemento){
	
	var object;
	var indice;
	
	if (typeof elemento == 'String'){		
		object = document.getElementById(elemento);
	}else{
		object = elemento;
	}
	
	if (object){
		indice = parseInt(object.length);
		while (indice>-1){
			object.options.remove(indice);
			indice--;
		}
	}
}
	
}

//funzione che cancella la selezione del reparto
function cancellaValoreRep(){

	if (confirm('Cancellare la selezione del reparto?')){
		document.all.txtReparto.value = '';
		document.all.txtCodDec.value='';
		document.all.Hreparto.value='';
	}
}

function nascondiCampi(){
	
	HideLayer('groupEsami');
	document.all.lblRegistra.parentElement.style.display='none';

}

function configuraProfili(){

	if (document.all['Hreparto'].value != ''){

		parent.document.EXTERN.REPARTO.value=document.all['Hreparto'].value; 
		parent.switch_tab(1);
		setReparto();
	
	}else{
	
		alert('Selezionare il reparto da configurare');
	
	}

}