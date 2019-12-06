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

function DeselezionaTutto() {
	var chk=document.getElementsByName("chkEsami");

	for (var i=0; i<chk.length;i++){
		if (chk[i].checked){
			chk[i].checked = false;
		}
	}
}

//funzione che crea due array con id e valore degli esami con il check
function arrayEsami(n, STATO_CAMPO){
	//alert("micro_int");
	var myListBox= document.createElement('select');
	
	myListBox.id='cmbPrestRich_L';
	myListBox.name='cmbPrestRich_L';
	myListBox.style.width = '100%';
	myListBox.setAttribute('STATO_CAMPO',STATO_CAMPO);
	myListBox.setAttribute('multiple','multiple');
	svuotaListBox(myListBox);
	
	var chk=document.getElementsByName("chkEsami");
	var idEsami='';
	var optArray = new Array ();
	
	for (var i=0; i<chk.length;i++)	
		if (chk[i].checked)
			optArray.push(new Option(chk[i].descr, chk[i].id));
	
	for(var i=0; i<optArray.length; i++) {
		myListBox.options[myListBox.options.length] = new Option(optArray[i].text, optArray[i].value + '@' + 'L@0' );
		//alert('optArray[i].value: '+optArray[i].value);
		idEsami += optArray[i].value + '#';
		parent.opener.document.all['Hmateriali'].value +=  '0#';
	}
	
	var s= idEsami;
	var b=/#$/.test(s);   
	var t=s.replace(/#$/,"");    
	
	parent.document.all['HelencoEsami'].value += idEsami; //valorizzo il campo nascosto della pagina precedente
	
	var innerListBox = parent.document.all['cmb'];
	jQuery(innerListBox).append(myListBox.options.innerHTML);
}

//funzione che al click seleziona tutti gli esami della provetta cliccata
function selezioneProvetta(provetta){
	
	var chk=document.getElementsByName("chkEsami");

	for (var i=0; i<chk.length;i++){
		if (chk[i].gruppo == provetta){    //controllo se l'attributo tappo del check è uguale alla provetta selezionata
			if (chk[i].disabled){         //controllo se l'esame in questione è disabilitato, se lo è non verrà selezionato
			}else{
				if (chk[i].checked){					
					chk[i].checked = false;				
				}else{				
					chk[i].checked = true;					
				}
			}		
		}
	}
}

//funzione che seleziona gli esami già scelti alla riapertura della pagina	
function ricordaEsami(){

	var Esami = parent.opener.document.all.HelencoEsami.value;	
	var esame= new Array();
	esame = Esami.split('#');

	for (var i=0; i<esame.length; i++){	
		try{
			if(esame[i] != ''){
				if(typeof document.getElementById(''+esame[i]+'') != 'undefined'){
					document.getElementById(''+esame[i]+'').checked=true;
				}
			}
			
		}catch(e){}

	}
}

//funzione che permette di scegliere solo determinati esami se la richiesta è urgente
function urgenza(){
/*	
	var tipoUrgenza = parent.window.opener.document.all.hUrgenza.value;
	
	var urgenza = '';
		
		if (tipoUrgenza != 2){
			
			urgenza = 0;
			
		}else{
			
			urgenza = tipoUrgenza;
			
		}

//	alert ('tipoUrgenza' + tipoUrgenza);
	
	chk = document.getElementsByName('chkEsami');
		
	for (var i=0; i<chk.length;i++){
		
		if (tipoUrgenza != 2){ 			//se l'attributo urgenza del check differisce dal valore 
										//dell'urgenza, i checkbox ciclati vengono disabilitati
							   			//altrimenti è permesso cliccarli
			
			
//			alert ('chkUrgenza' + chk[i].urgenza);
			
			chk[i].disabled = false;
			
		}else{
			
			if (chk[i].urgenza != tipoUrgenza){
				
				chk[i].disabled = true;
				addClass(chk[i].parentNode,"nonUrgente");
//				alert (chk[i].className);
				
			}
			
			
	}
*/
}


