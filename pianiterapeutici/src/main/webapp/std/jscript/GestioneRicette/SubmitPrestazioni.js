var _filtro_list_elenco_scelte = null;
var _filtro_list_elenco = null;

jQuery(document).ready(function() {	
	
	caricamento();
	setEvents();

});

function caricamento(){
	
	/*$('select[name=PrestazioniElenco]').css("font-size","12px"); 
	$('select[name=PrestazioniSelezionate]').css("font-size","12px");*/
	
	$('#txtRicercaPrestazione').bind('keypress', function(e) {
        if(e.keyCode==13){
        	var txtpresta=document.getElementById('txtRicercaPrestazione').value;
        	var txtcodice=document.getElementById('txtRicercaCodice').value;
        	RicercaPrestazioni(txtpresta, txtcodice);
        }
	});
	
	$('#txtRicercaCodice').bind('keypress', function(e) {
        if(e.keyCode==13){
        	var txtpresta=document.getElementById('txtRicercaPrestazione').value;
        	var txtcodice=document.getElementById('txtRicercaCodice').value;
        	RicercaPrestazioni(txtpresta, txtcodice);
        }
	});
	
	prestazioniScelte();
	
}

function setEvents(){

	if(_STATO_PAGINA == 'I'){
	
		/*jQuery("select[name='ProfiliElenco']").dblclick(function(){
			AggiungiProfilo('ProfiliElenco');
		});*/
		
		//ONDBLCLICK PrestazioniSelezionate
		document.getElementsByName("PrestazioniSelezionate")[0].ondblclick=function(){
			add_elements('PrestazioniSelezionate', 'PrestazioniElenco', true);sortSelect('PrestazioniElenco');
		};
		
		//ONDBLCLICK PrestazioniElenco
		document.getElementsByName("PrestazioniElenco")[0].ondblclick=function(){
			add_elements('PrestazioniElenco', 'PrestazioniSelezionate', true);sortSelect('PrestazioniSelezionate');
		};
		
		//ONCONTEXTMENU PrestazioniSelezionate
		document.getElementsByName("PrestazioniSelezionate")[0].oncontextmenu=function(){
			add_elements('PrestazioniSelezionate', 'PrestazioniElenco', true);sortSelect('PrestazioniElenco');
		};
		
		//ONCONTEXTMENU PrestazioniElenco
		document.getElementsByName("PrestazioniElenco")[0].oncontextmenu=function(){
			add_elements('PrestazioniElenco', 'PrestazioniSelezionate', true);sortSelect('PrestazioniSelezionate');
		};
		
		$('#txtRicercaPrestazione').focus();
	}	
}

//VIENE RICHIAMATA DAL BOTTONE DI RICERCA
function RicercaPrestazioni(txtpresta, txtcodice){
	var whereCond=" ATTIVO= 'S' ";
	
	if((txtpresta != null) & (txtpresta != "")) { whereCond=whereCond+" AND DESCRIZIONE like '%"+txtpresta.toUpperCase()+"%'";}
	if((txtcodice != null) & (txtcodice != "")) { whereCond=whereCond+" AND UPPER(DM_CODICE) like '%"+txtcodice.toUpperCase()+"%'";}

	_filtro_list_elenco = new FILTRO_QUERY("PrestazioniElenco", null);
	_filtro_list_elenco.setValueFieldQuery("CODICE||'$'||CICLICHE||'$'||NUM_SEDUTE");
	_filtro_list_elenco.setDescrFieldQuery("DM_CODICE||' - '||DESCRIZIONE");
	_filtro_list_elenco.setFromFieldQuery("radsql.VIEW_RR_PRESTAZIONI");
	_filtro_list_elenco.setWhereBaseQuery(whereCond, "RICERCA_ELENCO");
	_filtro_list_elenco.setOrderQuery("DM_CODICE||' '||DESCRIZIONE  ASC");
	_filtro_list_elenco.searchListRefresh();	
}

//VIENE RICHIAMATA DAL BOTTONE DI RICERCA
function prestazioniScelte(){	
	
	var combo=opener.jQuery(".prestaz");
	//combo=opener.document.getElementsByName('PrestazioniScelte')[0].options;
	var whereCond='';
	var elenco=[];
	
	combo.each(function(index){		
		var codice = "";
		try {
			codice = $(this).attr('valore').match(/^[^$]+/)[0];
		} catch(e) {}
		if (codice != "") elenco.push("'"+codice+"'");
		//alert(elenco.join(','));
	});
	
	if (elenco.length == 0) elenco = ["''"];
	whereCond="CODICE IN ("+elenco.join(',')+")";
	
	_filtro_list_elenco_scelte = new FILTRO_QUERY("PrestazioniSelezionate", null);
	_filtro_list_elenco_scelte.setValueFieldQuery("CODICE||'$'||CICLICHE||'$'||NUM_SEDUTE");
	_filtro_list_elenco_scelte.setDescrFieldQuery("DM_CODICE||' - '||DESCRIZIONE");
	_filtro_list_elenco_scelte.setFromFieldQuery("radsql.VIEW_RR_PRESTAZIONI");
	_filtro_list_elenco_scelte.setWhereBaseQuery(whereCond, "RICERCA_ELENCO");
	_filtro_list_elenco_scelte.setOrderQuery("DM_CODICE||' '||DESCRIZIONE  ASC");
	_filtro_list_elenco_scelte.searchListRefresh();
}


function scegliEsamiProfilo(codprofilo){
	var sql="SELECT P.CODICE||'$'||P.CICLICHE||'$'||NUM_SEDUTE, P.cod||' - '||P.DESCRIZIONE FROM RADSQL.VIEW_RR_PROFILI_FARMADATI P WHERE CODICE_PROFILO = '"+codprofilo+"'";
	dwr.engine.setAsync(false);		
	toolKitDB.getListResultData(sql, creaOptEsami);
	dwr.engine.setAsync(true);
}


function creaOptEsami(elenco){
	
	var Listbox=document.getElementsByName('PrestazioniSelezionate')[0];
	arrayOpt=new Array();
	
	for (var i=0;i<elenco.length; i++){
		
		var oOption = document.createElement("Option");
		oOption.text = elenco[i][1];
		oOption.value = elenco[i][0];	
		
		if (!in_array(Listbox, oOption.value)){	Listbox.add(oOption);}
	}
}


function in_array(thaArray, element){	

	var res=false;	
	for(var e=0;e<thaArray.length;e++){
		//alert('thaArray[e].value: '+thaArray[e].value +'\n\nelement: '+element);
		if(thaArray[e].value == element){
			res=true;
			break;
		}
	}
	return res;
}

function in_array_jQuery(thaArray, element){	

	var res=false;
	var arr = thaArray.split(",");
	
	for(var i=0;i<arr.length;i++){
		//alert('arr[I].value: '+arr[i]+'\n\nelement: '+element);
		if(arr[i] == element){
			res=true;
			break;
		}
	}
	return res;
}



function CreanuovoProfilo() {
	Win_openProfiloNew();
}


function RiportaSelezionati(){		
	var tipo_ciclica;
	var limite_sedute;
	var lst_source=document.getElementsByName("PrestazioniSelezionate")[0];
	var arrayScelti = '';
	var arrayPresenti = '';
	var lst_scelti=window.opener.jQuery(".prestaz");
	var arrayNuovi = '';
	var arrayCodiciPrestazioni = new Array();
	var arrayPrestazioni = new Array();
	
	lst_scelti.each(function(){
		arrayPresenti +=jQuery(this).attr("valore")+',';
	});

	for (var i=0, length=lst_source.length; i<length; i++) {
		arrayCodiciPrestazioni[i] = lst_source[i].value.split("$")[0];
	}
	arrayPrestazioni = window.opener.TABELLA.creaPrestazioni(arrayCodiciPrestazioni);
	
	for (var i=0; i<lst_source.length;i++){
		
		var s = lst_source[i].value.split('$');
		tipo_ciclica = s[1];
		limite_sedute = Number(s[2])||0;
		
		arrayScelti += lst_source[i].value + ",";
		
		var visualizzaPazienteOCI = false;
		//alert('Questo '+lst_source[i].text+ 'c\'è? \n'+ (in_array_jQuery(arrayPresenti,lst_source[i].value)));
		if (!in_array_jQuery(arrayPresenti,lst_source[i].value)){
			var prestazione = arrayPrestazioni[i];
			prestazione.setTipoCiclicita(tipo_ciclica);
			prestazione.setLimiteSedute(limite_sedute);
			var num_sedute = String(limite_sedute);
			window.opener.TABELLA.aggiungiRiga(null/*auto*/,lst_source[i].value,lst_source[i].text, 1,num_sedute,0,prestazione);
			arrayNuovi += lst_source[i].value + ",";
			if (arrayPrestazioni[i].getListaIDNote().length > 0) {
				visualizzaPazienteOCI = true;
			}
			if (visualizzaPazienteOCI) {
				window.opener.$('#lblPaziente').parent().parent().show();
			}
		}
		
	}
	
	lst_scelti=window.opener.jQuery(".prestaz");
	
	lst_scelti.each(function(){
		//alert(jQuery(this).attr("valore"));
		if(!in_array_jQuery(arrayScelti, jQuery(this).attr("valore"))){
			window.opener.TABELLA.eliminaRiga(jQuery(this).attr("indice"));
		}
	});
	//alert('array delle prestazioni: '+arrayNuovi);
	window.opener.TABELLA.popolaCmbEsenzioni(arrayNuovi);
	//alert('chiusura');
	self.close();
}


function svuotaListBox(elemento){	
	
	var object;
	var indice;
	
	if (typeof elemento == 'String'){
		object = document.getElementsByName(elemento)[0];
	}else{ 
		object = elemento;
	}
	
	if (object){
		
		indice = parseInt(object.length);
		while (indice>-1) {
			object.options.remove(indice);
			indice--;
		}
	}
}


function getURLParam(strParamName){

	var strReturn = "";
	var strHref = window.location.href;
	
	if ( strHref.indexOf("?") > -1 ){
		
		var strQueryString = strHref.substr(strHref.indexOf("?")).toLowerCase();
		var aQueryString = strQueryString.split("&");
		
		for (var iParam = 0; iParam < aQueryString.length; iParam++ ){
			if (aQueryString[iParam].indexOf(strParamName.toLowerCase() + "=") > -1 ){
				var aParam = aQueryString[iParam].split("=");
				strReturn = aParam[1];
				break;
			}
	    }
	}
	
	return unescape(strReturn);
}


function Win_openProfiloNew() {
	//Apertura Profili..
	var Tipo_Scheda="CONFIGURAZIONE_PROFILI_RICETTA";
	//var strprestazioni = "35223,35224,35229";
	var finestra = window.open("servletGenerator?KEY_LEGAME="+Tipo_Scheda+"&SITO=ALL&TIPO=RR_PRESTAZIONI&INSERIMENTO=N","","status=yes fullscreen=yes", false);	
    try
	{//fuori dalla cartella
    	top.opener.opener.closeWhale.pushFinestraInArray(finestra);
    }
	catch(e)
	{  
		opener.top.opener.top.closeWhale.pushFinestraInArray(finestra);
	}
}

function chiudiScheda(){
	self.close();
}

/*
function add_elements(elementoOrigine, elementoDestinazione, rimozione){

	var Listbox=document.getElementsByName('PrestazioniSelezionate')[0];
	var elenco=document.getElementsByName(elementoOrigine)[0];
	
	for (var i=0;i<elenco.options.length; i++){

		if (!in_array(Listbox, oOption.value)){	Listbox.add(oOption);}
	}
	
	if (!in_array(elementoDestinazione, valore_iden)){	objectTarget.add(oOption);}

}*/


function add_elements(elementoOrigine, elementoDestinazione, rimozione){
	
	var objectSource;
	var objectTarget;
	var num_elementi=0;
	var i=0;
	var controllo='OK';
	
	var valore_iden, valore_descr;

	objectSource = document.getElementsByName(elementoOrigine)[0];
	objectTarget = document.getElementsByName(elementoDestinazione)[0];
	if ((objectSource)&&(objectTarget)){
		num_elementi = objectSource.length ;
		for (i=0;i<num_elementi;i++){
			
			if (objectSource[i].selected){
			
				valore_iden = objectSource.options(i).value;
				valore_descr = objectSource.options(i).text;
				var oOption = document.createElement("Option");
				oOption.text = valore_descr;
				oOption.value = valore_iden;
				
				if (!in_array(objectTarget, valore_iden)){	
					
					objectTarget.add(oOption);
				
					// rimuovo elemento
					if (rimozione==true){
						remove_elem_by_id(elementoOrigine,i);
						i--;
						num_elementi--;
					}
					
				}else{
					controllo="KO";
				}
			}
		}
	}
	
	if (controllo!= 'OK'){
		alert('Alcuni degli elementi non sono stati trasferiti perchè già presenti');
	}
}
