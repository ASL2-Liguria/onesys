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
	var chk=document.getElementsByName("chkMat");

	for (var i=0; i<chk.length;i++){		
		if (chk[i].checked){			
			chk[i].checked = false;		
		}
	}
}

//funzione che crea due array con id e valore degli esami con il check
function arrayEsami(n, STATO_CAMPO){
	//alert("biomol");
	var myListBox= document.createElement('select');
	
	myListBox.id='cmbPrestRich_L';
	myListBox.name='cmbPrestRich_L';
	myListBox.style.width = '100%';
	myListBox.setAttribute('STATO_CAMPO',STATO_CAMPO);
	myListBox.setAttribute('multiple','multiple');
	svuotaListBox(myListBox);
	
	var chk=document.getElementsByName("chkMat");
	var idEsami='';
	var optArray = new Array ();
	var iden='';
	var materiale='';
	var ideMat='';
	var OptValue = '';
	
	for (var i=0; i<chk.length;i++){	
		if (chk[i].checked)
			optArray.push(new Option(chk[i].descr, (chk[i].id+'@'+chk[i].materiale)));
		}
	
	for(var i=0; i<optArray.length; i++) {

		if (optArray[i].value != ''){
		
			ideMat=optArray[i].value.split('@');
			
				//alert('ideMat[0]iden: '+ideMat[0]);
				//alert('ideMat[1]materiale: '+ideMat[1]);
				
				iden = ideMat[0];
				materiale =ideMat[1];
				
				OptValue= iden + '@' + 'B@' + materiale ;
//				alert('OptValue: '+OptValue);
				parent.document.all['HelencoEsami'].value += iden + '#';
				parent.opener.document.all['Hmateriali'].value +=materiale + '#';

		
		}
			
			myListBox.options[myListBox.options.length] = new Option(optArray[i].text, OptValue );
			idEsami += OptValue + '#';	
					
	}
	
	var s= idEsami;
	var b=/#$/.test(s);   
	var t=s.replace(/#$/,"");    
	
	//parent.document.all['HelencoEsami'].value += idEsami; //valorizzo il campo nascosto della pagina precedente
	
	var innerListBox = parent.document.all['cmb'];
	jQuery(innerListBox).append(myListBox.options.innerHTML);
}

//funzione che al click seleziona tutti gli esami della provetta cliccata
function selezionaTutto(mat){
	var chk=document.getElementsByName("chkMat");

	for (var i=0; i<chk.length;i++){
		if (chk[i].materiale == mat){  //controllo se l'attributo materiale del check è uguale al materiale selezionato
			if (chk[i].disabled){         //controllo se l'esame in questione è disabilitato, se lo è non verrà selezionato
				
			}else{			
				if (chk[i].checked){					
					id = "#mat-"+mat+" a";
					jQuery(id).attr('title', 'Seleziona tutti gli esami associati');
					chk[i].checked = false;
				}else{	
					id = "#mat-"+mat+" a";
					jQuery(id).attr('title', 'Deseleziona tutti gli esami associati');
					chk[i].checked = true;	
				}
			}			
		}		
	}
	
}

//funzione che seleziona gli esami già scelti alla riapertura della pagina	
function ricordaEsami(){

	var Esami = parent.opener.document.all.HelencoEsami.value;
	var Materiali = parent.opener.document.all.Hmateriali.value;
	//alert('Esami: ' + Esami);
	//alert('Materiali: ' + Materiali);
	
	
	var esame= new Array();
	var materiale= new Array();
	esame = Esami.split('#');
	materiale = Materiali.split('#');
	//alert('lunghezza dell\'array esami: ' + esame.length);
	//alert('lunghezza dell\'array materiali: ' + materiale.length);
	
	var chk=document.getElementsByName("chkMat");
	
		for (var i=0; i<materiale.length ; i++){
			//alert('ciclo l\'array dei materiali for (var i=0; i<materiale.length ; i++');
		
			if (materiale[i] != '0'){
				//alert('il materiale ' +materiale[i] +'è diverso da 0' );

				for (var z=0; z<chk.length;z++){
					//alert('for (var z=0; z<chk.length;z++)');
					
					if(chk[z].materiale == materiale[i]){
							//alert(' if  chk[z].materiale == materiale[i]');
					
						if (chk[z].id == esame[i]){ //se l'id del check che sto ciclando è uguale all'iden degli esami che corrisponde all'indice [i] dell'array degli esami
							//alert('chk[z]: '+ chk[z]);
							chk[z].checked=true;
						}
					}
				}		
			}
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
}*/
}
