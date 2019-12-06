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
	
	var resto=0;
	var bolEnableAlternateColors ;

	resto = (old_selezionato)%2;
	try{
		bolEnableAlternateColors = enableAlternateColors;
	}
	catch(e){
		bolEnableAlternateColors="N";
	}
			
	// ****
	if (hasClass(document.getElementById('oTable').rows.item(indice), "sel")){
		// aggiunto il 8/9
		// affinchè ci sia sempre almeno
		// un record selezionato
		//removeClass(document.getElementById('oTable').rows.item(indice), "sel");
		//rimuovi_indice(indice);
		return;
		}
	else{
		addClass(document.getElementById('oTable').rows.item(indice), "sel");
		nuovo_indice_sel(indice);
		 if ((old_selezionato!=-1)&&(old_selezionato!=indice)){
			removeClass(document.getElementById('oTable').rows.item(old_selezionato), "sel");
			removeClass(document.getElementById('oTable').rows.item(old_selezionato), "col_over");
			rimuovi_indice(old_selezionato);
		 }
	 }
	old_selezionato = indice;
}
/*Lascia la facoltà di deselezionare tutto*/
function illuminaSelDesel(indice){
	
	var resto=0;
	var bolEnableAlternateColors ;

	resto = (old_selezionato)%2;
	try{
		bolEnableAlternateColors = enableAlternateColors;
	}
	catch(e){
		bolEnableAlternateColors="N";
	}
			
	// ****
	if (hasClass(document.getElementById('oTable').rows.item(indice), "sel")){
		removeClass(document.getElementById('oTable').rows.item(indice), "sel");
		rimuovi_indice(indice);
		}
	else{
		addClass(document.getElementById('oTable').rows.item(indice), "sel");
		nuovo_indice_sel(indice);
		 if ((old_selezionato!=-1)&&(old_selezionato!=indice)){
			removeClass(document.getElementById('oTable').rows.item(old_selezionato), "sel");
			removeClass(document.getElementById('oTable').rows.item(old_selezionato), "col_over");
			rimuovi_indice(old_selezionato);
		 }
	 }
	old_selezionato = indice;
}

// funzione ILLUMINA multiplo
function illumina_multiplo(indice, vettore){

	var array_to_compare;
	var resto=0;
	var bolEnableAlternateColors;


	if (vettore==null){
		array_to_compare = array_iden_anag;
	}else{
		array_to_compare = vettore;
	}	
	
	resto = (indice)%2;
	try{
		bolEnableAlternateColors = enableAlternateColors;
	}
	catch(e){
		bolEnableAlternateColors="N";
	}
	
	
	if (hasClass(document.getElementById('oTable').rows.item(indice), "sel")){
		// deseleziona
		rimuovi_indice(indice);
		if (bolEnableAlternateColors!="S"){
			removeClass(document.getElementById('oTable').rows.item(indice), "sel");
			removeClass(document.getElementById('oTable').rows.item(indice), "col_over");
		}
		else{

			if (resto!=0){
				// dispari
				removeClass(document.getElementById('oTable').rows.item(indice), "sel");
				removeClass(document.getElementById('oTable').rows.item(indice), "col_over");
			}
			else{
				//pari
				removeClass(document.getElementById('oTable').rows.item(indice), "sel");
				removeClass(document.getElementById('oTable').rows.item(indice), "col_over");
			}
		}
	}
	else{
		// seleziona
		addClass(document.getElementById('oTable').rows.item(indice), "sel");
		nuovo_indice_sel(indice);
		//auto_deselezione_paz_div(array_to_compare, indice);
		}
	old_selezionato = indice;
}



// funzione per autodeselzione di paziente selezionato diverso dal precedente
function auto_deselezione_paz_div(vettore, indice_ultimo_paz){
	var iden_ultimo_paz_selez= "";
	var i =0;
	if (vettore){
		iden_ultimo_paz_selez = vettore[indice_ultimo_paz];
		//alert("iden_anag ultimo paz sel: " + iden_ultimo_paz_selez)
		//vettore_indici_sel.length CAMBIA DINAMICAMENTE !!
		for (i=0;i<vettore_indici_sel.length;i++)
		{	
		/*	alert("i: " + i + "indici selezionati nel vettore :" + vettore_indici_sel.length)
			alert("indice nel vettore indici:" + vettore_indici_sel[i])
			alert("iden_anag i-esimo selezionato:"+  array_iden_anag[vettore_indici_sel[i]])
			*/
			if (vettore[vettore_indici_sel[i]]!=iden_ultimo_paz_selez){
				// deillumino
				removeClass(document.getElementById("oTable").rows.item(vettore_indici_sel[i]), "sel");
				rimuovi_indice(vettore_indici_sel[i]);
				// torno indietro di uno per non perdermi gli altri elementi
				if (vettore_indici_sel.length>1){
					i = i -1;
				}
			}
		}
	}
}

/** funzione che permette il rollover della riga */
function rowSelect_over(myIndice){
	if (!arrayContieneElemento(vettore_indici_sel,myIndice)){
		addClass(document.getElementById('oTable').rows.item(myIndice), "col_over");
	}
}

function rowSelect_out(myIndice){
	
	var resto=0;
	var bolEnableAlternateColors;


	resto = (myIndice)%2;
	try{
		bolEnableAlternateColors = enableAlternateColors;
	}
	catch(e){
		bolEnableAlternateColors="N";
	}	
	
	if (!arrayContieneElemento(vettore_indici_sel,myIndice)){
		if (bolEnableAlternateColors!="S"){
			removeClass(document.getElementById('oTable').rows.item(myIndice), "col_over");
		}
		else{
			if (resto!=0){
				// dispari
				removeClass(document.getElementById('oTable').rows.item(myIndice), "col_over");
			}
			else{
				//pari
				removeClass(document.getElementById('oTable').rows.item(myIndice), "col_over");
			}
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

function stringa_codici_con_vuoti(vettore){
var selezionati = 0;
var codici_esami_sel = '';
for (i=0;i<vettore_indici_sel.length;i++){
	selezionati ++;
	if (i==0){
		codici_esami_sel = vettore[vettore_indici_sel[i]];
	}
	else{
		codici_esami_sel = codici_esami_sel + '*' + vettore[vettore_indici_sel[i]];
	}
}
return codici_esami_sel;
}

/*
	Funzione ILLUMINA multiplo generica
*/
function illumina_multiplo_generica(indice){

	if (hasClass(document.getElementById('oTable').rows.item(indice), "sel")){
		// deseleziona
		removeClass(document.getElementById('oTable').rows.item(indice), "sel");
		rimuovi_indice(indice);}
	else{
		// seleziona
		addClass(document.getElementById('oTable').rows.item(indice), "sel");
		nuovo_indice_sel(indice);
		}
	old_selezionato = indice;
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