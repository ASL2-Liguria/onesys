function controllaCampiNumerici(campo, label) {

	var descrizione = label.innerText;
	var contenutoDopoReplace = campo.value.replace (',','.');
	
	campo.value = contenutoDopoReplace;
	
	// alert ('contenuto dopo replace: '+campo.value);
	// alert ('campo: '+campo);
	// alert ('label: '+label);
	// alert ('contenuto: '+contenutoDopoReplace);
	// alert ('descrizione: '+descrizione);
	
	if (isNaN(campo.value)){
		alert ('il valore immesso in '+' " ' +descrizione+' " '+' non è un numero. Il campo richiede un valore numerico');
		campo.value= '';
		campo.focus();
		return;		
	}
}

//funzione che serve a formattare l'ora in inserimento. PER ORA NON FUNZIONA CON I NUMERI INSERITI DA TASTIERINO NUMERICO!!!!!!!!!!!!!!!!!!
function verificaOra(obj){
	obj.disableb = true;
		if(event.keyCode==8){ //backspace
			if(obj.value.toString().length==2 || obj.value.toString().length==3){
				obj.value=obj.value.substring(0,1);
			}
			obj.disabled = false;			
			return;		
		}
		if(obj.value.toString().length==1){
			if(event.keyCode>50 || event.keyCode<48)
				obj.value='';
			obj.disabled = false;			
			return;
		}
		if(obj.value.toString().length==2){
			if(parseInt(obj.value.substring(0,1),10)==2){
				if(event.keyCode>51 || event.keyCode<48)
					obj.value=obj.value.substring(0,1);
				else{
					obj.value=obj.value+':';}
			}else{
				if(event.keyCode>57 || event.keyCode<48)
					obj.value=obj.value.substring(0,1);
				else{
					obj.value=obj.value+':';}				
			}
			obj.disabled = false;
			return;		
		}	
		if(obj.value.toString().length==4){
			if(event.keyCode>53 || event.keyCode<48){
				obj.value=obj.value.substring(0,3);			
			}
			obj.disabled = false;
			return;		
		}
		if(obj.value.toString().length==5){
			if(event.keyCode>57 || event.keyCode<48){
				obj.value=obj.value.substring(0,4);			
			}
			obj.disabled = false;
			return;		
		}
		if(obj.value.toString().length>5){
			obj.value=obj.value.substring(0,5);	
			obj.disabled = false;
			return;
		}
	}


//funzione che controlla se un elemento è associato alla classe
function hasClass(elemento,classe){
	
	return elemento.className.match(new RegExp('(\\s|^)'+classe+'(\\s|$)'));

}

//funzione che aggiunge una classe all'elemento
function addClass(elemento,classe){
	
	if (!hasClass(elemento,classe)){
		elemento.className += " "+classe;
		
	}
}

//funzione che rimuove la classe all'elemento
function removeClass(elemento,classe){
	
	if (hasClass(elemento,classe)){
		
		var reg=new RegExp('(\\s|^)'+classe+'(\\s|$)');
		elemento.className=elemento.className.replace(reg,' ');
	
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

function dataOdierna(oggetto){
	
	var data= new Date();
	var giorno= data.getDate() ;
	var mese=data.getMonth() +1;
	var anno=data.getYear();
	
	
	if (giorno.toString().length <2){
		
		alert ('giorno prima '+giorno);
		giorno = '0'+giorno;
		
	}
	
	if (mese.toString().length <2){
		
		alert ('giorno prima '+mese);
		mese = '0'+mese;
		
	}
	

	//data europea
	oggetto.value = giorno + '/' +mese+ '/' + anno;
	
	//data americana
	//oggetto.value = mese + '/' +giorno+ '/' + anno;

}

//funzione che imposta la data del giorno dopo nel formato gg/mm/yyyy
function dataDomani(oggetto){

	var data= new Date();
	var millisecondiDal1970 = data.getTime();
	var msGiornata = 86400000; // sono i ms del giorno 1000*60*60*24
	var msDomani = msGiornata + millisecondiDal1970;
	
	//giorno dopo
	var dataDomani = new Date (msDomani);
	var giorno= dataDomani.getDate() ;
	var mese=dataDomani.getMonth() + 1;
	var anno=dataDomani.getYear();
	
	if (giorno.toString().length <2){
		
		giorno = '0'+ giorno;
		
	}
	
	if (mese.toString().length <2){
		
		mese = '0'+ mese;
		
	}

	//data europea
	oggetto.value = giorno + '/' +mese+ '/' + anno;
	
	//data americana
	//oggetto.value = mese + '/' +giorno+ '/' + anno;

}


                                                  


//funzione che rende lo stato campo obbligatorio
function obbligaCampo(campoDestinazione, labelDestinazione){

	//alert ('entro nella funzione');
	
	campoDestinazione.STATO_CAMPO = 'O';
	labelDestinazione.STATO_CAMPO = 'O';
	campoDestinazione.STATO_CAMPO_LABEL = labelDestinazione.name;
	
	// alert('className PRIMA: '+labelDestinazione.parentElement.className);
	// alert('className.length PRIMA: '+labelDestinazione.parentElement.className.length);
	
	if (labelDestinazione.parentElement.className.substring(labelDestinazione.parentElement.className.length-2,labelDestinazione.parentElement.className.length) != '_O'){
	
		if (labelDestinazione.parentElement.className=='classTdLabelLink' || labelDestinazione.parentElement.className=='classTdLabel' ){
		
			labelDestinazione.parentElement.className = labelDestinazione.parentElement.className + "_O";
		
		}
		
	}
	
	// alert('className DOPO: '+labelDestinazione.parentElement.className);
	
}

//aggiungo al volo un evento all'elemento
jQuery(document).ready(function() {	
jQuery("#lblDelibera").click(function(){
		pd();
	});
	
});

//funzione che controlla il formato dell'ora inserita da inserire su evento onblur del campo.Nel caso sia minore del dovuto cancella il campo e sposta il focus sul campo stesso.
function controllaFormatoOra(oggetto){

	if (oggetto.value != ''){
		
		if (oggetto.value.toString().length < 4) {
		
			alert (' Formato ora errato \n\n Inserire l\'ora nel formato HH:MM'); 
			oggetto.value = '';
			oggetto.focus();
			
		}
	}
}


//function da richiamare in questa maniera: if(controllo_data('20101216').metodo); restituisce true o false per ogni metodo (previous,next,equal)
function controllo_data(data){
	
	var str =data.toString();
	
	function cls(){
		this.previous = false;
		this.next= false;
		this.equal = false;
	}
	
	var data= new Date();
	var giorno= data.getDate() ;
	var mese=data.getMonth() +1;
	var anno=data.getYear();
	
	if (giorno.toString().length <2){
		//alert ('giorno prima della modifica: '+giorno);
		giorno = '0'+giorno;	
	}
	
	if (mese.toString().length <2){
		//alert ('mese prima della modifica: '+mese);
		mese = '0'+mese;
	}
	
	var oggi=anno.toString()+mese.toString()+giorno.toString(); //creo una variabile con la data odierna in formato yyyyMMdd
	var dataControl ='';
	
	var myClass = new cls();
	
	if (str.length>8){
		//controllo se la lunghezza è maggiore di 8(yyyyMMdd) vuol dire che la data è in formato dd/MM/yyyy. Faccio una substring in modo da trasformarla...
		dataControl=str.substr(6,4)+str.substr(3,2)+str.substr(0,2);
		//alert('data da controllare:'+dataControl+'e oggi: '+oggi);

	}else{
		dataControl=str;
		//alert(dataControl);
	}
	
	if(dataControl>oggi){
		//alert('next');
		myClass.previous = false;
		myClass.next=true;
		myClass.equal = false;
	}
	
	if(dataControl==oggi){
		//alert('equal');
		myClass.previous = false;
		myClass.next=false;
		myClass.equal = true;
	}
	
	if(dataControl<oggi){
		//alert('previous');
		myClass.previous = true;
		myClass.next=false;
		myClass.equal = false;
	}

	return myClass;
}


function maiuscolo(obj){
	
	var valore=obj.split(',');
	
	//alert(valore);
	//alert(valore.length);
	
	for (i=0;i<valore.length;i++){
		
		//alert('prima: '+document.getElementById(valore[i]).value);
		document.getElementById(valore[i]).value=trim(document.getElementById(valore[i]).value).toUpperCase();
		//alert('dopo: '+document.getElementById(valore[i]).value);
		
	}

}

function controllaData(dataValue){

	//alert('entro nella funzione controllaData');

	//alert('parametro passato all funzione: '+dataValue.value);

	if (dataValue.value!=''){
	
		if (dataValue.value.length<10){
				
			alert('Inserire la data in un formato corretto (dd/MM/yyyy)');
				
			dataValue.value='';
			dataValue.focus();
		}	
	}
}

//funzione alla quale si passa l'elemento array e l'elemento da controllare. Se l
function in_array(thaArray, element){
	
	//alert('funzione in_array');
	
	var res=false;
		
		for(var e=0;e<thaArray.length;e++){
			if(thaArray[e].value == element){
				res=true;
				break;
			}
		}
	
	return res;
}

//funzione che controlla se l'elemento dell'oggetto val1 è presente nell'oggetto val2
function controllaPresObj(val1,val2){

	var opt= val1.options[val1.selectedIndex].value;
	
	//alert('opt: '+opt   );
	
	for (i=0;i<val2.length;i++){

		if (val2.options[i].value==opt){
		
			alert('Attenzione! Elemento già presente nella lista');
			return;
		}		
	}

	add_selected_elements(val1.name, val2.name, true);sortSelect(val1.name);

}

function f_onblur(campo){

	var ora=campo.value;
	var oraRep=ora.replace(/\./gi,"");
	var oraReplace=oraRep.replace(/\.\,@?\;/gi,"");
	
	if (campo.value==''){}else{
	
		if (oraReplace>ora){
			
			campo=oraReplace;
			campo.focus();
			return;
			
		}
		
		if (ora.length<5){
			
			alert('Immettere l\'ora nel formato corretto HH:MM');
			campo.value='';
			campo.focus();
			return;
		
		}
		
		try{
			if (isNaN(parseInt(ora.substring(0,2),10))||isNaN(parseInt(ora.substring(3,5),10))){
			
				alert('Il valore immesso non è un numero!');
				campo.value='';
				campo.focus();
				return;
			
			}
		}catch(e){
				//alert(e.description);
		}
		
		if (oraReplace.length<5 && ora!=''){
			
			alert('Immettere l\'ora nel formato corretto HH:MM');
			campo.value='';
			campo.focus();
			return;
				
		}
		
		
		if (ora.substring(0,2)>23 || ora.substring(0,2)<0){
			alert('Immettere l\'ora nel formato corretto HH:MM');
			campo.value='';
			campo.focus();
			return;
		}
		
		if (ora.substring(3,5)>59 || ora.substring(3,5)<0){
	
			alert('Immettere l\'ora nel formato corretto HH:MM');
			campo.value='';
			campo.focus();
			return;
	
		}
	}
}
function f_onkeyup(campo){
	
	var ora=campo.value;
	var oraReplace=ora.replace(/:/gi,"");

	if (ora.length>2){
	
		campo.value=oraReplace.substring(0,2)+':'+oraReplace.substring(2,4);
	
	}
	
	if (ora.length>5){
	
		campo.value=campo.value.substring(0,5);
	
	}
	
		if (ora.substring(0,2)>23 || ora.substring(0,2)<0){
			if(ora.substring(0,1)<=2){
				campo.value=ora.substring(0,1);
			}else{
				
				campo.value='';
				ora='0'+oraReplace.substring(0,oraReplace.substring(0,3));
				campo.value=ora.substring(0,2)+':'+ora.substring(2,4);
			}
		}
		
	if (ora.substring(3,5)>59 || ora.substring(3,5)<0){
	
		campo.value=ora.substring(0,3);
	
	}
}

//funzione che controlla se l'elemento dell'oggetto val1 è presente nell'oggetto val2
function controllaPresObj(val1,val2){

	//alert(val1 + ' ' + val2);
	var opt= val1.options[val1.selectedIndex].value;
	
	//alert('opt: '+opt   );
	
	for (var i=0;i<val2.length;i++){

		if (val2.options[i].value==opt){
		
			alert('Attenzione! Elemento già presente nella lista');
			return;
		}		
	}

	add_selected_elements(val1.name, val2.name, true);sortSelect(val1.name);

}




