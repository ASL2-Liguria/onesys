var _filtro_list_elenco = null;
//funzione generazione codice profilo..
//var cod_gruppo ="'"+gruppo_profilo+"'||(Select nvl(MAX(to_number( substr(Cod_Gruppo, 2, length(Cod_Gruppo)) )),0)+1 num	From Radsql.Tab_Esa_Gruppi  where Sito = '"+sito+"') ";	


function RicercaProfilo()
{
	var whereCond=" 1 = 1 ";
	var reparto = document.getElementById("txtCodCdc").value ;
	var gruppo = document.getElementById("cmbGruppo").value ;

	if((reparto != null) & (reparto != "") &  (gruppo != null) &  (gruppo != "")){ 
		 whereCond=whereCond+" AND Reparto_Profilo = '"+reparto+"' AND SUBSTR(Codice_Profilo, 0, 1) = '"+gruppo+"'";
		 
		_filtro_list_elenco = new FILTRO_QUERY('lstProfili', null);
		_filtro_list_elenco.setDistinctQuery('S');
		_filtro_list_elenco.setValueFieldQuery('CODICE_PROFILO');
		_filtro_list_elenco.setDescrFieldQuery('DESCR_PROFILO');
		_filtro_list_elenco.setFromFieldQuery('radsql.VIEW_RR_PROFILI');
		_filtro_list_elenco.setWhereBaseQuery(whereCond, "RICERCA_ELENCO");
		_filtro_list_elenco.setOrderQuery('DESCR_PROFILO ASC');
		_filtro_list_elenco.searchListRefresh();	
		
		//mostra profilo.
		SelezionaProfilo();
	}
}


function InserisciProfilo()
{	
	var aggiorna_profilo = false;
	//Nuovo Profilo
	var cod_profilo = document.getElementById("txt_cod_Profilo").value;
	var nome_profilo = document.getElementById("txtProfilo").value ;
	
	//Inserimento Esame di default..
	aggiorna_profilo = InserisciEsami(cod_profilo, nome_profilo, 0) ;	
	
	if (aggiorna_profilo){ alert("Profilo Inserito!");	}
	
	//Clear Campi
	document.getElementById("txt_cod_Profilo").value = "";
	document.getElementById("txtProfilo").value = "";
	
	//Referesh..
	RicercaProfilo();
}


function SelezionaProfilo(){
	//Profilo Selezionato..
	var lstProfili = document.getElementById('lstProfili');
	var codprofilo = lstProfili.options[lstProfili.selectedIndex].value;
	if (codprofilo != null){
		var sql="SELECT IDEN, DESCRIZIONE FROM RADSQL.VIEW_RR_PROFILI WHERE CODICE_PROFILO = '"+codprofilo+"'";
		dwr.engine.setAsync(false);		
		toolKitDB.getListResultData(sql, RiportaProfilo);
		dwr.engine.setAsync(true);	
	}
}


function RiportaProfilo(elenco){
	var Listbox=document.getElementById('lstEsamiScelti');
	svuotaListBox(Listbox);
	arrayOpt=new Array();
	
	for (i=0;i<elenco.length; i++){
		var oOption = document.createElement("Option");
		oOption.text = elenco[i][1];
		oOption.value = elenco[i][0];			
		if (!in_array(Listbox, oOption.value)){	Listbox.add(oOption);}
	}
}


function CancellaProfilo(iden_profilo)
{
	var gruppo_profilo = document.getElementById("cmbGruppo").value ;

	if((iden_profilo != null) & (iden_profilo != "") &  (gruppo_profilo != null) &  (gruppo_profilo != "")){ 
		var sito = "RR_PRESTAZIONI";
		
		if (gruppo_profilo == "P") {sito= "RR_PRESTAZIONI";	} else if (gruppo_profilo == "F") {sito= "RR_FARMACI";}
		
		var sql="DELETE radsql.tab_esa_gruppi WHERE sito='"+sito+"' AND  cod_gruppo='"+iden_profilo+"'";
		
		dwr.engine.setAsync(false);
		toolKitDB.executeQueryData(sql);	
		dwr.engine.setAsync(true);	
	}	
}

function ElencoRicerca(txtesame){	
	var gruppo_profilo = document.getElementById("cmbGruppo").value ;

	if (gruppo_profilo == "P") {
		RicercaPrestazioni(txtesame);	
	}
	else if (gruppo_profilo == "F") {
		RicercaFarmaci(txtesame);
	}
}

function RicercaPrestazioni(txtpresta){	
	var whereCond=" ATTIVO= 'S' ";
	if((txtpresta != null) & (txtpresta != "")) { whereCond=whereCond+" AND DESCRIZIONE like '%"+txtpresta+"%'";}

	_filtro_list_elenco = new FILTRO_QUERY("lstEsami", null);
	_filtro_list_elenco.setValueFieldQuery("IDEN");
	_filtro_list_elenco.setDescrFieldQuery("DM_CODICE||' - '||DESCRIZIONE");
	_filtro_list_elenco.setFromFieldQuery("radsql.VIEW_RR_PRESTAZIONI");
	_filtro_list_elenco.setWhereBaseQuery(whereCond, "RICERCA_ELENCO");
	_filtro_list_elenco.setOrderQuery("DM_CODICE||' '||DESCRIZIONE  ASC");
	_filtro_list_elenco.searchListRefresh();	
}


function RicercaFarmaci(txtfarm){
	var whereCond=" ATTIVO= 'S' ";
	if((txtfarm != null) & (txtfarm != "")) { whereCond=whereCond+" AND DESCRIZIONE like '"+txtfarm+"%'";}

	_filtro_list_elenco = new FILTRO_QUERY("lstEsami", null);
	_filtro_list_elenco.setValueFieldQuery("IDEN");
	_filtro_list_elenco.setDescrFieldQuery("DESCRIZIONE ||' - '|| SOSTANZA");
	_filtro_list_elenco.setFromFieldQuery("radsql.VIEW_RR_FARMACI");
	_filtro_list_elenco.setWhereBaseQuery(whereCond, "RICERCA_ELENCO");
	_filtro_list_elenco.setOrderQuery("DESCRIZIONE ASC");
	_filtro_list_elenco.searchListRefresh();	
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
	//Profilo Selezionato..
	var lstProfili = document.getElementById('lstProfili');
	var codprofilo = lstProfili.options[lstProfili.selectedIndex].value;
	var nome_profilo =  lstProfili.options[lstProfili.selectedIndex].text;

	//Cancellazione versione profilo precedente..
	CancellaProfilo(codprofilo);
	
	var lst_elenco=document.getElementById("lstEsami");
	var lst_source=document.getElementById("lstEsamiScelti");
	if (lst_source){
		for (var i=0; i<lst_source.length;i++){ 
			iden_esame = lst_source[i].value;
			if (iden_esame!=0){
				InserisciEsami(codprofilo, nome_profilo, iden_esame);		
			}
		}	
	}		
	alert("Profilo Aggiornato!");
	
	//Svuota ListBox
	svuotaListBox(lst_elenco);
	svuotaListBox(lst_source);
	
	//Clear Ricerca
	document.getElementById("txtEsamiRicerca").value = "";
	
	//Referesh..
	RicercaProfilo();
}


function InserisciEsami(iden_profilo, nome_profilo, iden_esame)
{
	var Inserisci = false;
	var reparto_profilo = document.getElementById("txtCodCdc").value ;
	var gruppo_profilo = document.getElementById("cmbGruppo").value ;

	if ((iden_profilo!=null) &  (nome_profilo!=null) &  (reparto_profilo!=null) & (gruppo_profilo!=null) & (iden_esame!=null)) {
		var sito = "RR_PRESTAZIONI";
		if (gruppo_profilo == "P") {sito= "RR_PRESTAZIONI";	} else if (gruppo_profilo == "F") {sito= "RR_FARMACI";}
		
		var sql="insert into radsql.tab_esa_gruppi (sito, reparto, cod_gruppo, descr, iden_esa) Values ('"+sito+"', '"+reparto_profilo+"', '"+gruppo_profilo+""+iden_profilo.toUpperCase()+"', '"+nome_profilo.toUpperCase()+"', "+iden_esame+")";
		
		dwr.engine.setAsync(false);
		toolKitDB.executeQueryData(sql);	
		dwr.engine.setAsync(true);	
		//Record Inserito..
		Inserisci = true;
	}	
	return Inserisci;
}


function chiudiScheda(){
	if(typeof document.EXTERN.Hiden_visita!="undefined"){
		if (document.dati.Hiden.value=='')			
			top.apriWorkListRichieste();		
		else{			
			parent.opener.aggiorna();
			parent.self.close();		
		}
	}
	else{parent.self.close();}
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


function getURLParam(strParamName){
	var strReturn = "";
	var strHref = window.location.href;
	if ( strHref.indexOf("?") > -1 ){
	    var strQueryString = strHref.substr(strHref.indexOf("?")).toLowerCase();
	    var aQueryString = strQueryString.split("&");
	    for ( var iParam = 0; iParam < aQueryString.length; iParam++ ){
	      if (aQueryString[iParam].indexOf(strParamName.toLowerCase() + "=") > -1 ){
	        var aParam = aQueryString[iParam].split("=");
	        strReturn = aParam[1];
	        break;
	      }
	    }
	}
	return unescape(strReturn);
}


