var _filtro_list_elenco = null;
var _filtro_scelte = null;

jQuery(document).ready(function() {	
	
	caricamento();
	setEvents();
	
	$('#txtRicercaEsenzione').bind('keypress', function(e) {
	        if(e.keyCode==13){
	               var txtesen=document.getElementById('txtRicercaEsenzione').value.toUpperCase();
	               var txtcod=document.getElementById('txtRicercaCodice').value.toUpperCase();
	               RicercaEsenzioni(txtesen, txtcod);
	        }
	});

	$('#txtRicercaCodice').bind('keypress', function(e) {
        if(e.keyCode==13){
               var txtesen=document.getElementById('txtRicercaEsenzione').value.toUpperCase();
               var txtcod=document.getElementById('txtRicercaCodice').value.toUpperCase();
               RicercaEsenzioni(txtesen, txtcod);
        }  
	});
});


function caricamento(){
	
	document.getElementById('EsenzioniElenco').onclick = function(){ coloraRiga(); };
	document.getElementById('EsenzioniSelezionate').onclick = function(){ coloraRiga(); };
	caricaEsenzioni();
}

function setEvents(){
	
	if (_STATO_PAGINA=='I'){
			
		//ONCONTEXTMENU EsenzioniElenco
		document.getElementById('EsenzioniElenco').oncontextmenu=function(){	
			add_selected_elements('EsenzioniElenco', 'EsenzioniSelezionate', true);
			sortSelect('EsenzioniSelezionate'); 
		};
		
		//ONDBLCLICK EsenzioniElenco
		document.getElementById('EsenzioniElenco').ondblclick=function(){	
			add_selected_elements('EsenzioniElenco', 'EsenzioniSelezionate', true);
			sortSelect('EsenzioniSelezionate'); 
		};
		
		//ONCONTEXTMENU EsenzioniSelezionate
		document.getElementById('EsenzioniSelezionate').oncontextmenu=function(){	
			add_selected_elements('EsenzioniSelezionate', 'EsenzioniElenco', true);
			sortSelect('EsenzioniElenco'); 
		};
		
		//ONDBLCLICK EsenzioniSelezionate
		document.getElementById('EsenzioniSelezionate').ondblclick=function(){	
			add_selected_elements('EsenzioniSelezionate', 'EsenzioniElenco', true);
			sortSelect('EsenzioniElenco'); 
		};
	}
}


/*VIENE RICHIAMATA DAL BOTTONE DI RICERCA*/
function RicercaEsenzioni(txtesenzione, txtcodice){
	
	var whereCond=" ATTIVO='S' ";
	if((txtesenzione != null) & (txtesenzione != "")) { whereCond=whereCond+" AND upper(DESCRIZIONE) like '%"+txtesenzione+"%'";}
	if((txtcodice != null) & (txtcodice != "")) { whereCond=whereCond+" AND CODICE like '%"+txtcodice+"%'";}
	

	_filtro_list_elenco = new FILTRO_QUERY("EsenzioniElenco", null);
	_filtro_list_elenco.setValueFieldQuery("CODICE");
	_filtro_list_elenco.setDescrFieldQuery("' ( '||ESENZIONE_DESCR||' ) - '||CODICE||' - '||DESCRIZIONE");
	_filtro_list_elenco.setFromFieldQuery("RADSQL.VIEW_RR_ESENZIONI");
	_filtro_list_elenco.setWhereBaseQuery(whereCond, "RICERCA_ELENCO");
	_filtro_list_elenco.setOrderQuery(" CODICE||' '||DESCRIZIONE ASC");
	_filtro_list_elenco.searchListRefresh();
	
	setTimeout("coloraRiga()",1000);
}

//Carica le esenzioni della pagina precedente
function caricaEsenzioni(){
	var elenco=["''"];
	var list=opener.document.getElementById("EsenzioniScelte").options;
	
	for (var i=0;i<list.length;i++){
		elenco.push("'"+list[i].value+"'");
	}
	
	var whereCond=" ATTIVO='S' AND DELETED='N' and codice in ("+elenco.join(", ")+")";

	_filtro_scelte = new FILTRO_QUERY("EsenzioniSelezionate", null);
	_filtro_scelte.setValueFieldQuery("CODICE");
	_filtro_scelte.setDescrFieldQuery("' ( '||ESENZIONE_DESCR||' ) - '||CODICE||' - '||DESCRIZIONE");
	_filtro_scelte.setFromFieldQuery("RADSQL.VIEW_RR_ESENZIONI");
	_filtro_scelte.setWhereBaseQuery(whereCond);
	_filtro_scelte.setOrderQuery(" CODICE||' '||DESCRIZIONE ASC");
	_filtro_scelte.searchListRefresh();
	
	setTimeout("coloraRiga()",1000);
}

//function che colora le righe dell'esenzioni a seconda se quest'ultime sono parziali o totali
function coloraRiga(){
	
	var combo = document.getElementById('EsenzioniElenco').options;

	for (var i=0;i<combo.length;i++){
		if (combo[i].text.substring(0,3)=='( t'){
			combo[i].style.backgroundColor = '#97f997'; //verde chiaro
		}else{	
			combo[i].style.backgroundColor = '#fdfbcb'; //giallo chiaro
		}
	}
	
	var combo2 = document.getElementById('EsenzioniSelezionate').options;

	for (var i=0;i<combo2.length;i++){
		if (combo2[i].text.substring(0,3)=='( t'){
			combo2[i].style.backgroundColor = '#97f997'; //verde chiaro
		}else{	
			combo2[i].style.backgroundColor = '#fdfbcb'; //giallo chiaro
		}
	}
	
	setTimeout("coloraRiga()",1000);
	
}


function in_array(thaArray, element){	
	var res=false;	
	for(var e=0;e<thaArray.length;e++){
			if(thaArray[e].value == element){
				res=true;
				break;
			}
	}
	return res;
}


function RiportaSelezionati(){		
	
	var lst_source=document.getElementById("EsenzioniSelezionate");
	var lst_dest=opener.document.getElementById('EsenzioniScelte');
	
	if (lst_dest){
		
		svuotaListBox(lst_dest);
		
		for (var i=0; i<lst_source.length;i++){
			var oOption = opener.document.createElement("Option");
			oOption.text = lst_source[i].text;
			oOption.value = lst_source[i].value;
			lst_dest.add(oOption);
		}	
	}		
	//close windows..
	chiudiScheda();
}


function chiudiScheda(){

	window.opener.setTimeout("coloraRiga()",1000);
	if (opener.document.getElementById('hRicettaTipo').value == "P"){
		window.opener.TABELLA.popolaCmbEsenzioni();
	}
	self.close();
}


function svuotaListBox(elemento){	
	var object;
	var indice;
	if (typeof elemento == 'String'){object = document.getElementById(elemento);}
	else{ object = elemento;}
	
	if (object){
		indice = parseInt(object.length);
		while (indice>-1) {
			object.options.remove(indice);
			indice--;
		}
	}
}




