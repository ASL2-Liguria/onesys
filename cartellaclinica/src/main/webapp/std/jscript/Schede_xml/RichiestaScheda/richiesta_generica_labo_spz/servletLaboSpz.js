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
	

	var chkP=document.getElementsByName("chkProqfilo");
		
		for (var i=0; i<chkP.length;i++){		
			if (chkP[i].checked){			
				chkP[i].checked = false;		
			}
		}

}

//funzione che crea due array con id e valore degli esami con il check
function arrayEsami(n, STATO_CAMPO){
	//alert("labo_int");
	var myListBox= document.createElement('select');
	
	myListBox.id='cmbPrestRich_L';
	myListBox.name='cmbPrestRich_L';
	myListBox.style.width = '100%';
	myListBox.setAttribute('STATO_CAMPO',STATO_CAMPO);
	myListBox.setAttribute('multiple','multiple');
	
	//alert(myListBox)
	
	svuotaListBox(myListBox);
	
	var chk=document.getElementsByName("chkEsami");
	var idEsami='';
	var optArray = new Array ();
	
	for (var i=0; i<chk.length;i++)	
		if (chk[i].checked)
			optArray.push(new Option(chk[i].descr, chk[i].id));
	
	for(var i=0; i<optArray.length; i++) {
		myListBox.options[myListBox.options.length] = new Option(optArray[i].text, optArray[i].value + '@L@0@' + optArray[i].text);
		idEsami += optArray[i].value + '#';
		parent.opener.document.all['Hmateriali'].value +=  '0#';
	}
	
	var s= idEsami;
	var b=/#$/.test(s);   
	var t=s.replace(/#$/,"");    
	
	parent.document.all['HelencoEsami'].value += idEsami; //valorizzo il campo nascosto della pagina precedente
	//opener.parent.document.all['Hmateriali'].value +=  '0#';
	var innerListBox = parent.document.all['cmb'];
	//alert(myListBox.options.innerHTML);
	jQuery(innerListBox).append(myListBox.options.innerHTML);
	//alert('esco');
	
}

//funzione che al click seleziona tutti gli esami della provetta cliccata
function selezioneProvetta(provetta){
	
	var chk=document.getElementsByName("chkEsami");

	for (var i=0; i<chk.length;i++){
			
		if (chk[i].tappo == provetta){ 		//controllo se l'attributo tappo del check è uguale alla provetta selezionata

			if (!chk[i].disabled){       	//controllo se l'esame in questione è disabilitato, se lo è non verrà selezionato

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
	if (parent.opener.document.all.HelencoEsami.value != ''){

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

}
/*
//seleziona gli esami di un determinato profilo. Configurabile nella tabella radsql.TAB_ESA_GRUPPI
function scegliProfilo(profilo){
	idProf = document.all[profilo];

	var Prof=new Array();
	Prof = idProf.value.split(',');
	
	for (var i = 0; i<Prof.length; i++){

		var idEsame = ""+Prof[i]+"";
		try{	
			chk = document.getElementById(idEsame);
//		if (chk.checked == true ||chk.disabled == true){
			if (chk.disabled == true){
				chk.checked = false;
			}else{
				chk.checked = true;
			}
		}catch(e){alert("L'esame con codice "+ idEsame + " è indicato nel profilo ma non è attivo, segnalarlo all'amministratore di sistema");}
	}
}*/

//seleziona gli esami di un determinato profilo. Configurabile nella tabella radsql.TAB_ESA_GRUPPI
function scegliProfilo(profilo){
	
	var idProf = document.getElementsByName(profilo)[0];
	//alert(idProf.value);
	var esamiProf=new Array();
	var controllo=new Array();
	var elenco=new Array();
	var idEsame='';
	var checkPag=document.getElementsByName('chkEsami');
	var checkProf=document.getElementsByName('chkProfilo');
	var contatore=0;
	idProf.value+=',';
	

		esamiProf = idProf.value.split(',');
		
		for (var i=0; i<esamiProf.length; i++){
			
			idEsame = esamiProf[i];
			//alert('idEsame: '+idEsame+'\ncontatore: '+i+'\nNr giri totali: '+esamiProf.length + '\nNr check Pagina: '+checkPag.length);
			if (controllo.length>0){
			
				if (!in_array(elenco, controllo[0])){
					elenco.push(controllo[0]);
				}
			
				controllo=new Array();
			}
			
			for (var z=0; z<checkPag.length; z++){
		
				//alert('checkPag.id: '+checkPag[z].id + ' \nIden Esame Profilo: ' + idEsame );
				
				if (checkPag[z].id == idEsame){

					if (checkPag[z].disabled == true){
						checkPag[z].checked = false;
					}else{
						checkPag[z].checked = true;
						contatore=contatore+1;
					}	
					
				}else{
					
					controllo.push(checkPag[z].id);
						
				}
			}
		}
		
		
		for (var z=0; z<checkProf.length; z++){

			// alert('checkProf.profilo: '+checkProf[z].profilo + ' - ' +profilo);
			// alert(checkProf[z].checked);
			
			if (checkProf[z].profilo == profilo.toString()){

				if (checkProf[z].checked == true){
					
					var sql='select WM_CONCAT(DESCR) from radsql.TAB_esa where iden in (' + elenco.toString() + ')';
					dwr.engine.setAsync(false);	
					toolKitDB.getResultData(sql, call_resp);
					dwr.engine.setAsync(true);
				
					function call_resp(resp){
					
						// alert(resp);
						var esami=resp.toString().split(',');
						var ritorno='Alcuni degli esami configurati nel profilo non sono più richiedibili:\n';
						
						for (var x = 0;x<esami.length;x++){
						
							ritorno+='\n - '+esami[x];
						
						}
					
						//alert(ritorno);
						//alert('NR. Esami selezionati: '+contatore);
						
					}
				}
			}
		}
		

}
//funzione che permette di scegliere solo determinati esami se la richiesta è urgente


function urgenza(){


	var tipoUrgenza = parent.window.opener.document.all.hUrgenza.value;
	
	var urgenza = '';
		
		if (tipoUrgenza != 2){
			
			urgenza = 0;
			
		}else{
			
			urgenza = tipoUrgenza;
			
		}


//	alert ('tipoUrgenza' + tipoUrgenza);
	
/*	chk = document.getElementsByName('chkEsami');
		
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
	}*/

	//se urgente profili disabilitati
	chkP = document.getElementsByName('chkProfilo');
	
	for (var i=0; i<chkP.length;i++){
		
		if (tipoUrgenza == 2){ 			
				
			chkP[i].disabled = true;
			addClass(chkP[i].parentNode,"nonUrgente");
			
		}else{
			
			if (chkP[i].urgenza != tipoUrgenza){
				
				chkP[i].disabled = false;

			}
			
			
	}
}

	labP = document.getElementsByName('labelProfilo');
	
	for (var i=0; i<labP.length;i++){
		
		if (tipoUrgenza == 2){ 			
				
			labP[i].disabled = true;
			addClass(labP[i].parentNode,"nonUrgente");
			
		}else{
			
			if (labP[i].urgenza != tipoUrgenza){
				
				labP[i].disabled = false;

			}

	}
}

}
	

