var albero='';

jQuery(document).ready(function(){

	/*//nascondo il pulsante registra se in visualizzazione
	if (document.EXTERN.STATO.value=='VIS'){
		document.getElementById('lblRegistra').parentElement.style.display='none';
	}
	*/
	
	document.getElementById('lblDiagnosi').ondblclick= function(){
		eliminaOpt(this.options.value);
	};
	
	//do le classi
	jQuery("#lblInserisciNote, #lblCancella").parent().addClass("pulsante");
	jQuery("#lblVuota1").parent().removeClass("classTdLabel");
	jQuery("#lblVuota1").parent().addClass("vuota");

	//pulsante inserisci note
	jQuery("#lblInserisciNote").parent().mouseover(function(){
		
		jQuery("#lblInserisciNote").parent().removeClass("pulsante");
		jQuery("#lblInserisciNote").parent().addClass("pulsanteOver");
	
	}).mouseout(function(){
		
		jQuery("#lblInserisciNote").parent().removeClass("pulsanteOver");
		jQuery("#lblInserisciNote").parent().addClass("pulsante");
	
	}).click(function(){
		
		inserisciNote(document.getElementById('lblDiagnosi').options.value);
	});
	
	//pulsante cancella
	jQuery("#lblCancella").parent().mouseover(function(){

		jQuery("#lblCancella").parent().removeClass("pulsante");
		jQuery("#lblCancella").parent().addClass("pulsanteOver");
	
	}).mouseout(function(){

		jQuery("#lblCancella").parent().removeClass("pulsanteOver");
		jQuery("#lblCancella").parent().addClass("pulsante");
		
	}).click(function(){
		
		eliminaOpt(document.getElementById("lblDiagnosi").options.value);
	});

});

/*
function divAcr(){
	
	try{
		document.all['lblACR'].parentNode.removeChild(document.getElementById('clsAcr'));
		return;
	}catch(e){}

	//creo il div per l'acr
	
	div = document.createElement('DIV');
	div.id = 'clsACR';
	div.className = 'clsACR';

	document.all['lblACR'].parentNode.appendChild(div);
	
	creaDivACR('clsACR', 0, 'DIAGNOSI_IPCCC', riempiDiagnosi);
	
	document.getElementById('hDescrACR').value = '';
	document.getElementById('hCodeACR').value = '';
}*/
	
	
//function che carica il div dell'albero all'interno del group layer
function divAcr(){
	try{
		albero.hide();
		albero.show();
	}catch(e){
		try{
			albero = NS_CascadeTree.append('#lblACR',{gruppo:'DIAGNOSI_IPCCC',abilita_ricerca_descrizione:'S',abilita_ricerca_codice:'S',onSelection:riempiDiagnosi,CreaNascosto:'S'});
		}catch(e){
			alert(e.description);
		}
	}
}

function  riempiDiagnosi(obj) {

		//funzione che riempe il campo nascosto 

		/*											
			obj.iden = iden di radsql.CONFIG_ACR
			obj.codice = codice di radsql.CONFIG_ACR
			obj.descrizione = testo del ramo selezionato
			obj.ref = iden_figlio radsql.CONFIG_ACR
			obj.path = percorso del ramo (es:"1.34.567.1.34")
			obj.path_descr = percorso delle descrizioni per arrivare al ramo 
		*/




	var splitDescr = obj.path_descr.split('/');
	//var splitCode = codici.split('/');

	var lunghezza = splitDescr.length;
	var v_descrizione = '.. / '+ splitDescr[lunghezza-1] + ' / ' + obj.descrizione
	document.all.lblDiagnosi.options[document.all.lblDiagnosi.length] = new Option(v_descrizione, parseInt(obj.iden));

	document.all.hIPCCC.value = obj.iden;
	//document.all['body'].removeChild(document.all['clsACR'][0]); se si vuole una chiusura senza effetti grafici...
	
	
	//jQuery(document.all['clsACR'][0]).fadeOut(500, function(){document.all['lblACR'].parentNode.removeChild(document.all['clsACR'][0]);}); //chiusura del div con effetto grafico fadeOut, dissolvenza
	jQuery("#lblDiagnosiIPCCC").hide().show(800);
	albero.hide();
}



// funzione per impostare il messaggio di scelta nella label delle attività
function controllaLabel() {

	//alert (document.all.hAttivita.value);
	if (document.all.hIPCCC.value == ''){

		document.all.lblDiagnosi.innerText = '...';
	}
}

function eliminaOpt(opt){
	
	var myListBox = document.getElementById('lblDiagnosi');
	
	for (var i=0;i< myListBox.options.length; i++){

		if (myListBox.options[i].value == opt){
			myListBox.removeChild(myListBox.options[i]);
		}
	}

}


function preSalvataggio(){
	
	var combo= document.getElementById('lblDiagnosi');
	var elencoIden='';
	var elencoDescr='';
	var elencoDescrFinale='';
	var elencoNote='';
	
	for (var i=0;i<combo.options.length;i++){
		
		if (elencoIden != ''){
			elencoIden+='#';
			elencoDescr+='#';
			elencoDescrFinale+='#';
			elencoNote+='#';
		}
		
		//combo.options[i].value += '@';		
		//alert('combo.options[i].value: '+combo.options[i].value);
		var splCodice = combo.options[i].text.split('*');
		var testoCodice = splCodice[0];
		//alert(testoCodice);
		var splitText=testoCodice.split('/');
		var splitValue=combo.options[i].value.split('@');
		
		//alert('splitValue: '+splitValue[0] + ' ' + splitValue[1]);
		
		if(splitValue[1]!=undefined){
			elencoNote += splitValue[1];
		}else{
			elencoNote += '';
		}
		
		elencoIden += splitValue[0];
		elencoDescr += testoCodice;
		elencoDescrFinale += splitText[splitText.length - 1];

	}
	
	document.getElementById('hElencoIden').value = elencoIden;
	document.getElementById('hElencoDescr').value = elencoDescr;
	document.getElementById('hElencoNote').value = elencoNote;
	document.getElementById('hIPCCC').value = elencoDescrFinale;
	
	/*var debug = '';
	debug += 'hElencoDescr: '+elencoDescr;
	debug += '\n hElencoIden: '+elencoIden;
	debug += '\n hIPCCC: '+elencoDescrFinale;
	debug += '\n hElencoNote: '+elencoNote;
	debug += '\n KEY_LEGAME: '+document.EXTERN.KEY_LEGAME.value;;
	debug += '\n user_id: '+document.EXTERN.USER_ID.value;
	
	alert(debug);*/
	
	registra();
		
}
function controllaCampiNumerici(campo, label) {

	var descrizione = label.innerText;
	var contenutoDopoReplace = campo.value.replace (',','.');
	
	campo.value = contenutoDopoReplace;
	
//	alert ('contenuto dopo replace: '+campo.value);
//	alert ('campo: '+campo);
//	alert ('label: '+label);
//	alert ('contenuto: '+contenutoDopoReplace);
//	alert ('descrizione: '+descrizione);
	
	if (isNaN(campo.value)){
		alert ('il valore immesso in '+' " ' +descrizione+' " '+' non è un numero. Il campo richiede un valore numerico');
		campo.value= '';
		campo.focus();
		return;		
	}
}


function inserisciNote(option){
	
	if (option == ''){
		alert('Attenzione! Selezionare almeno un codice dall\'elenco');
		return;
	}
	
	url = "servletGenerator?KEY_LEGAME=PAG_INS_NOTE_IPCCC&PROVENIENZA="+document.EXTERN.KEY_LEGAME.value;
	//alert(url);
	
	$.fancybox({
		'padding'	: 3,
		'width'		: 470,
		'height'	: 250,
		'href'		: url,
		'type'		: 'iframe'
	});
}

function chiudiScheda(){

	//alert(opener.parent.EXTERN.IDEN_ANAG.value);

	var id_remoto= document.EXTERN.ID_REMOTO.value;
	var url='servletGenerator?KEY_LEGAME=WK_IPCCC&WHERE_WK= where ID_REMOTO = '+id_remoto+' AND TIPO_IPCCC=\'DIAGNOSI\'';

	opener.location.replace(opener.location);

	self.close();

}

function controllaAnno() {

	var anno = document.all['txtAnno'].value;

	if (anno!=''){
		if (!IsNumeric(anno) || anno.length!= 4){

			alert('Inserire l\'anno in formato corretto (YYYY)');

			document.all['txtAnno'].value='';
			document.all['txtAnno'].focus();
		} 
	}
}

function controllaMese() {

	var mese = document.all['txtMese'].value;

	if (mese!=''){

		if (!IsNumeric(mese) || parseInt(mese) > 12){

			alert('Inserire il mese in formato corretto (<=12)');

			document.all['txtMese'].value='';
			document.all['txtMese'].focus();
		} else {
			if (mese.length == 1) {
				document.all['txtMese'].value = '0' + mese;
			}
		}
	}
}

function controllaGiorno() {

	var giorno = document.all['txtGiorno'].value;

	if (giorno!=''){

		if (!IsNumeric(giorno) || parseInt(giorno) > 31) {

			alert('Inserire il giorno in formato corretto (<=31)');

			document.all['txtGiorno'].value='';
			document.all['txtGiorno'].focus();
			
		} else {
		
			if (giorno.length == 1) {
				document.all['txtGiorno'].value = '0' + giorno;
			}
		}
	}
}

function chiudi(){

	self.close();

}

function registraScheda(){

	//maiuscolo('txtNote') ;
	
	preSalvataggio();
	
}

function IsNumeric(sText){
	var ValidChars = "0123456789.";var IsNumber=true;var Char;
	for (var i = 0; i < sText.length && IsNumber == true; i++){ 
		Char = sText.charAt(i); 
		if (ValidChars.indexOf(Char) == -1){IsNumber = false;}
	}
	return IsNumber;
}


