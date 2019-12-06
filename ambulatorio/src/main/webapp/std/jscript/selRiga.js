// JavaScript Document

var vettore_indici_sel = new Array();
var old_selezionato = -1;
var oldStyle;

function arrayContieneElemento(vettore,elemento){
	var i=0;
	
	for(i=0;i<vettore.length;i++){
		if(vettore[i]==elemento){
			return true;
		}
	}
	return false;
}


/*FUNZIONE ILLUMINA*/
function illumina(indice){
	
	// ****
	if (hasClass(document.all.oTable.rows(indice), "sel")){
		// aggiunto il 8/9
		// affinchè ci sia sempre almeno
		// un record selezionato
		// return;
		removeClass(document.all.oTable.rows(indice), "sel");
		rimuovi_indice(indice);
		}
	else{
		addClass(document.all.oTable.rows(indice), "sel");
		nuovo_indice_sel(indice);
		 if ((old_selezionato!=-1)&&(old_selezionato!=indice)){
			  //removeClass(document.all.oTable.rows(old_selezionato), "desel");
			  rimuovi_indice(old_selezionato);
		   }
	 }
	old_selezionato = indice;
}

function illumina_multiplo_generica(indice){

	if (hasClass(document.all.oTable.rows(indice), "sel")){
		// deseleziona
		removeClass(document.all.oTable.rows(indice), "sel");
		rimuovi_indice(indice);}
	else{
		// seleziona
		addClass(document.all.oTable.rows(indice), "sel");
		nuovo_indice_sel(indice);
		}
	old_selezionato = indice;
}

function illuminaSelDesel(indice){
	
	// ****
	if (hasClass(document.all.oTable.rows(indice), "sel")){
		// aggiunto il 8/9
		// affinchè ci sia sempre almeno
		// un record selezionato
		return;
		removeClass(document.all.oTable.rows(indice), "sel");
		rimuovi_indice(indice);
		}
	else{
		addClass(document.all.oTable.rows(indice), "sel");
		nuovo_indice_sel(indice);
		 if ((old_selezionato!=-1)&&(old_selezionato!=indice)){
			  removeClass(document.all.oTable.rows(old_selezionato), "sel");
			  rimuovi_indice(old_selezionato);
		   }
	 }
	old_selezionato = indice;
}

// funzione ILLUMINA multiplo
function illumina_multiplo(indice, vettore){
	
	var array_to_compare;
	
	if (vettore==null)
	{
		array_to_compare = array_iden_anag;
	}
	else
	{
		array_to_compare = vettore;
	}
	
	if (hasClass(document.all.oTable.rows(indice), "sel")){
		// deseleziona
		removeClass(document.all.oTable.rows(indice), "sel");
		rimuovi_indice(indice);}
	else{
		// seleziona
		addClass(document.all.oTable.rows(indice), "sel");
		nuovo_indice_sel(indice);
		//auto_deselezione_paz_div(array_to_compare, indice)
		}
	old_selezionato = indice;
}

function illumina_multiplo_Ctrl(indice){
	if (hasClass(document.all.oTable.rows(indice), "sel")){
		// deseleziona
		//alert(document.form_cong_giorno.KeyName.value)
		if (document.form_cong_giorno.KeyName.value=="Ctrl"){
		rimuovi_indice(indice);}}
	else{
		// seleziona
		
		addClass(document.all.oTable.rows(indice), "sel");
		//alert('indice='+indice);
		nuovo_indice_sel(indice);
		}
	
	old_selezionato = indice;
}



/** funzione che permette il rollover della riga */
function rowSelect_over(myIndice){
	if (!arrayContieneElemento(vettore_indici_sel,myIndice)){
		addClass(document.all.oTable.rows(myIndice), "col_over");
	}
}

function rowSelect_out(myIndice){
	if (!arrayContieneElemento(vettore_indici_sel,myIndice)){
		removeClass(document.all.oTable.rows(myIndice), "col_over");
	}
}
 
 function rowSelect_over_illumina(myIndice){
	if (!arrayContieneElemento(vettore_indici_sel,myIndice)){
		if (document.form_cong_giorno.KeyName.value=="Ctrl"){
			illumina_multiplo_Ctrl(myIndice);
		}else{
			addClass(document.all.oTable.rows(myIndice), "col_over");
		}
	}
	else {
		if (document.form_cong_giorno.KeyName.value=="Ctrl"){
			illumina_multiplo_Ctrl(myIndice);
		}
	}
}



 
/*FUNZIONE RIMUOVI_INDICE*/       
function rimuovi_indice(indice){
var trovato = false;
var lunghezza_array = vettore_indici_sel.length;
for (i=0;i<lunghezza_array;i++){
if (vettore_indici_sel[i]==indice){
	vettore_indici_sel[i] = -1;
	vettore_indici_sel.sort(confronto_dec);
	vettore_indici_sel.length = lunghezza_array -1;
	vettore_indici_sel.sort(confronto_asc);
	trovato = true;
	break;
		}
 	}
}

/*FUNZIONE NUOVO_INDICE_SEL*/     
function nuovo_indice_sel(indice){
	var trovato = false;
	//alert();
	lunghezza_array = vettore_indici_sel.length;
	for (i=0;i<lunghezza_array;i++){
		if (vettore_indici_sel[i]==indice){
		   trovato = true;
			break;
		}
	 }
	 if (trovato==false){
		vettore_indici_sel[lunghezza_array] = indice;
	}
	vettore_indici_sel.sort(confronto_asc);
}

/*FUNZIONE CONFRONTO_ASC*/
function confronto_asc (a,b){
 return a - b;
}
        
/*FUNZIONE CONFRONTO_DEC*/		
function confronto_dec (a,b){
 return b - a;
}

/*FUNZIONE STRINGA CODICI*/
function stringa_codici(vettore){
var selezionati = 0;
var codici_esami_sel = '';

for (i=0;i<vettore_indici_sel.length;i++){
	selezionati ++;
	if (codici_esami_sel.toString()==''){
		codici_esami_sel = vettore[vettore_indici_sel[i]];
	}
	else{
		codici_esami_sel = codici_esami_sel + '*' + vettore[vettore_indici_sel[i]];
	}
}
return codici_esami_sel;
}

function hasClass(ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
	if (!this.hasClass(ele,cls)){ ele.className += " "+cls;}
}

function removeClass(ele,cls) {
	if (hasClass(ele,cls)) {
    	var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className=ele.className.replace(reg,' ');
	}
}	