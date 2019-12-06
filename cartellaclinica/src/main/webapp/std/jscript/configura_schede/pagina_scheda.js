//do le classi agli elementi
document.getElementById('txtDescr').className='';
addClass(document.getElementById('txtDescr'),'txtRicerca');

 //creo due div
$(document).ready(function()
{
	if (parent.document.EXTERN.ATTIVO.value=='N'){
		document.getElementById('lblAttivo').innerText='SCHEDA NON ATTIVA';
		document.getElementById('hAttivo').value='N';
	}else if (parent.document.EXTERN.ATTIVO.value=='S'){
		document.getElementById('lblAttivo').innerText='SCHEDA ATTIVA';
		document.getElementById('hAttivo').value='S';
	}
	
});

//controlli ad inizio pagina
if (parent.document.EXTERN.URGENZA.value != ''){

	//valorizzo con la scelta giusta il combo dell'urgenza
	var comboUrgenza=document.getElementById('cmbUrgenza');
	comboUrgenza.options[comboUrgenza.options.selectedIndex].value=parent.document.EXTERN.URGENZA.value;
	//parent.document.getElementById('hUrgenza').value=parent.document.EXTERN.URGENZA.value;
	
	if (parent.document.EXTERN.ATTIVO.value=='S'){
		comboUrgenza.disabled='true'; //se la scheda è attiva non possono cambiare l'urgenza
	}

}

if (parent.document.EXTERN.STATO.value != 'INS'){

	document.dati.Hiden.value=parent.document.EXTERN.IDEN.value;
}

//funzione che controlla lo stato della scheda e disabilita di conseguenza elementi del configuratore
function controllaStato(){
	//se sono in visualizzazione non faccio vedere il tasto registra
	if (parent.document.EXTERN.STATO.value=='VIS'||parent.document.EXTERN.ATTIVO.value!='N'){

		if (parent.document.EXTERN.STATO.value=='VIS'){
		
			alert('Scheda aperta in visualizzazione. Il salvataggio verrà disabilitato!');
			parent.document.getElementById('lblRegistra').parentElement.style.display='none';
			return;
		}
		
		if (parent.document.EXTERN.ATTIVO.value!='N'){
		
			alert('La scheda aperta è attiva. Ogni modifica che verrà effettuata sarà immediatamente attiva');
			//parent.document.getElementById('lblRegistra').parentElement.style.display='none';
			return;
		}
		
	}
		
	if (parent.document.EXTERN.STATO.value == 'VIS' || parent.document.EXTERN.STATO.value == 'MOD'){
	
		var comboTipo=document.getElementById('cmbTipo');
		var comboUrgenza=document.getElementById('cmbUrgenza');
		//comboTipo.disabled='true';
		comboUrgenza.disabled='true';

	}
}

function preSalvataggio(){

	maiuscolo('txtNote');
	
	//valorizzo il campo nascosto della pagina con quello del tabulatore
	document.getElementById('Hiden').value=parent.document.getElementById('Hiden').value;
	document.getElementById('hEsami').value=parent.document.getElementById('hEsami').value;
	document.getElementById('hUrgenza').value=parent.document.getElementById('hUrgenza').value;
	document.getElementById('hReparti').value=parent.document.getElementById('hReparti').value;
	document.getElementById('hTipo').value=parent.document.getElementById('hTipo').value;
	document.EXTERN.IDEN.value=parent.document.EXTERN.IDEN.value;


	//rendo maiuscolo il contenuto di txtNote
	document.getElementById('txtNote').value=document.getElementById('txtNote').value.toUpperCase();
		
	var controllo='DEBUG';
	controllo+='\nIDEN= '+document.getElementById('Hiden').value;
	controllo+='\nNOTE= '+document.getElementById('txtNote').value;
	controllo+='\nDESCRIZIONE= '+document.getElementById('txtDescr').value;
	controllo+='\nTIPO= '+document.getElementById('hTipo').value;
	controllo+='\nURGENZA= '+document.getElementById('hUrgenza').value;
	controllo+='\nELENCO ESAMI= '+document.getElementById('hEsami').value;
	controllo+='\nELENCO REPARTI= '+document.getElementById('hReparti').value;
	
	
	// alert(controllo);
		
	registra();
		
}

//funzione che cambia il valore di hTipo e blocca il combo dell'urgenza se diverso da 'LABORATORIO'
function cambiaTipo(){

	var comboTipo=document.getElementById('cmbTipo');
	var comboUrgenza=document.getElementById('cmbUrgenza');
	
	parent.document.getElementById('hTipo').value=comboTipo.options[comboTipo.selectedIndex].value;
	parent.document.EXTERN.TIPO_SCHEDA.value=comboTipo.options[comboTipo.selectedIndex].text;
	

	if(comboTipo.options[comboTipo.selectedIndex].value=='B'){
		parent.document.all['oIFTappi'].src="servletGenerator?KEY_LEGAME=GESTIONE_BIOMOL&MODIFICA=N&LETTURA=N&INSERIMENTO=S";
	}else{
		parent.document.all['oIFTappi'].src="servletGenerator?KEY_LEGAME=GESTIONE_TAPPI&MODIFICA=N&LETTURA=N&INSERIMENTO=S";
	}
	//alert('hUrgenza: '+document.getElementById('hUrgenza').value);
	//alert('Tipo: '+comboTipo.options[comboTipo.selectedIndex].value);
	//alert(parent.document.getElementById('hTipo').value);
	
	if(comboTipo.options[comboTipo.selectedIndex].value=='L'){
		
		comboUrgenza.disabled=false;
	
	}else {
	
		comboUrgenza.options[comboUrgenza.selectedIndex].value='0';
		comboUrgenza.disabled=true;
	
	}
	
}

//funzione che cambia il nome del tab iniziale in modo da poter visualizzare il nome della scheda in tutto il configuratore
function cambiaEtichetta(){
	
	var descr=document.getElementById('txtDescr').value;
	
	if (descr==''){
		descr='Dettagli Scheda';
	}
	
	parent.$("[tab='tab1']").find("span").html(descr);

}


