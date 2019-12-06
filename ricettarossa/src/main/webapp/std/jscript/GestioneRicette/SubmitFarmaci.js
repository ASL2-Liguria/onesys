var _filtro_list_elenco = null;
var _filtro_list_elenco_scelti=null;

jQuery(document).ready(function() {	
	
	caricamento();
	setEvents();

});

function caricamento(){
	
	/*$('select[name=FarmaciElenco]').css("font-size","12px"); 
	$('select[name=FarmaciSelezionati]').css("font-size","12px");*/
	
	$('#txtRicercaFarmaci').bind('keypress', function(e) {
		if(e.keyCode == '13'){
			var txtfarm=document.getElementById('txtRicercaFarmaci').value;
			var txtprincipio=document.getElementById('txtRicercaPrincipioAttivo').value;
			RicercaFarmaci(txtfarm, txtprincipio);
		}
	});

	$('#txtRicercaPrincipioAttivo').bind('keypress', function(e) {
		if(e.keyCode == '13'){
			var txtfarm=document.getElementById('txtRicercaFarmaci').value;
	    	var txtprincipio=document.getElementById('txtRicercaPrincipioAttivo').value;
	    	RicercaFarmaci(txtfarm, txtprincipio);
		}
	});
	
	farmaciScelti();
}

function setEvents(){

	if(_STATO_PAGINA == 'I'){
	
		/*jQuery("select[name='ProfiliElenco']").dblclick(function(){
			AggiungiProfilo('ProfiliElenco');
		});*/
		
		//ONDBLCLICK FarmaciSelezionati
		document.getElementsByName("FarmaciSelezionati")[0].ondblclick=function(){
			add_selected_elements('FarmaciSelezionati', 'FarmaciElenco', true);sortSelect('FarmaciElenco');
		};
		
		//ONDBLCLICK FarmaciElenco
		document.getElementsByName("FarmaciElenco")[0].ondblclick=function(){
			add_selected_elements('FarmaciElenco', 'FarmaciSelezionati', true);sortSelect('FarmaciSelezionati');
		};
		
		//ONCONTEXTMENU FarmaciSelezionati
		document.getElementsByName("FarmaciSelezionati")[0].oncontextmenu=function(){
			add_selected_elements('FarmaciSelezionati', 'FarmaciElenco', true);sortSelect('FarmaciElenco');
		};
		
		//ONCONTEXTMENU FarmaciElenco
		document.getElementsByName("FarmaciElenco")[0].oncontextmenu=function(){
			add_selected_elements('FarmaciElenco', 'FarmaciSelezionati', true);sortSelect('FarmaciSelezionati');
		};
		
		$('#txtRicercaFarmaci').focus();
	}	
}

/*VIENE RICHIAMATA DAL BOTTONE DI RICERCA*/
function RicercaFarmaci(txtfarm, txtprincipio, showAlerts){
	showAlerts = typeof showAlerts === 'boolean' ? showAlerts : true;
	
	if ((txtfarm == null || txtfarm.length < 3) && (txtprincipio == null || txtprincipio.length < 3)) {
		if (showAlerts)
			alert("Inserire almeno 3 caratteri nel campo di ricerca.");
		return;
	}
	var whereCond=" COMMERCIO='S' "; // farmaci in commercio

	//Usa l'indice FULLTEXT
	var match = txtfarm.replace(/'/g, "''").replace(/([!"#$%&\(\)\*\+\,\-\.\/:;<=>?@\[\]^_`\\\{|\}~])/g, "\\$1");
	//alert(match);

	if(txtfarm != null && txtfarm != "") { whereCond=whereCond+" AND CONTAINS(DESCRIZIONE, '"+match.toUpperCase()+"%') > 0";}
	if(txtprincipio != null && txtprincipio != "") { whereCond=whereCond+" AND PRINCIPIO_ATTIVO LIKE '"+txtprincipio.toUpperCase()+"%'";}
	//if(getURLParam('CALL_TYPE') == 'notmut') { whereCond=whereCond+" AND REGIME_SSN_SN='N' "; } else { whereCond=whereCond+" AND REGIME_SSN_SN='S' "; }

	_filtro_list_elenco = new FILTRO_QUERY("FarmaciElenco", null);
	//AGGIUNGO LO ZERO ALL'IDEN PER ALLINEARLE ALLE PRESTAZIONI DOVE METTO INVECE CHE LO '0' L'INFO SULLE CICLICHE
	_filtro_list_elenco.setEnableWait("S");
	_filtro_list_elenco.setValueFieldQuery("CODICE_PRODOTTO||'$0$0'");  
	_filtro_list_elenco.setDescrFieldQuery(
		"decode(LISTA_TRASPARENZA, 'S', '', '[NON SOSTITUIBILE] ')||" +
		"DESCRIZIONE ||' - '|| PRINCIPIO_ATTIVO||' - '||DECODE (NVL(note_sulla_prescriz_1, '')||'-'||NVL(note_sulla_prescriz_2, ''), '-', '', note_sulla_prescriz_1||'-', 'CUF:'||note_sulla_prescriz_1, '-'||note_sulla_prescriz_2, 'CUF:'||note_sulla_prescriz_2, 'CUF:'||note_sulla_prescriz_1||'-'||note_sulla_prescriz_2)"
	);
	_filtro_list_elenco.setFromFieldQuery("MMG.FARMADATI$VM_PRODOTTI_RICERCA");
	_filtro_list_elenco.setWhereBaseQuery(whereCond, "RICERCA_ELENCO");
	_filtro_list_elenco.setOrderQuery("DESCRIZIONE ASC");
	_filtro_list_elenco.searchListRefresh();	
}

function scegliEsamiProfilo(codprofilo){
	var sql="SELECT CODICE||'$0$0', DECODE(NVL(SOSTITUIBILE, ''), 'N', '[NON SOSTITUIBILE] ', '') || DESCRIZIONE ||' - '|| cod||' - '||DECODE(NVL(NOTA_CUF, ''), '', '', 'CUF:'||NOTA_CUF) FROM RADSQL.VIEW_RR_PROFILI_FARMADATI WHERE CODICE_PROFILO = '"+codprofilo+"'";
	dwr.engine.setAsync(false);		
	toolKitDB.getListResultData(sql, creaOptEsami);
	dwr.engine.setAsync(true);
}


function creaOptEsami(elenco){
	var Listbox=document.getElementsByName('FarmaciSelezionati')[0];
	arrayOpt=new Array();
	
	for (var i=0;i<elenco.length; i++){
		var oOption = document.createElement("Option");
		oOption.text = elenco[i][1];
		oOption.value = elenco[i][0];			
		if (!in_array(Listbox, oOption.value)){	Listbox.add(oOption);}
	}
}

/*funzione controllo array */
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


function CreanuovoProfilo () {
	Win_openProfiloNew();
}

/*
function RiportaSelezionatiOld(){		
	
	var calltype= getURLParam("CALL_TYPE");
	var dest_tagfarm = null;
	var dest_tagqta = null;
	var dest_cuf = null;
	var dest_tagposolog = null;
	
	if (calltype == "notesen"){//Farmaci non esenti
		dest_tagfarm = "FarmaciSceltiNONEsenti";
		dest_tagqta = "FarmaciSceltiNONEsenti_Scatole";
		dest_tagposolog = "FarmaciSceltiNONEsenti_Posologia";
		dest_cuf = "FarmaciSceltiNONEsenti_cuf"; 
	}
	else if (calltype == "esen"){//Farmaci esenti
		dest_tagfarm = "FarmaciSceltiEsenti";
		dest_tagqta = "FarmaciSceltiEsenti_Scatole";
		dest_tagposolog = "FarmaciSceltiEsenti_Posologia";
		dest_cuf = "FarmaciSceltiEsenti_cuf";	
	}
	else if (calltype == "notmut"){//Farmaci non Mutuabili
		dest_tagfarm = "FarmaciSceltiNONMutuabili";
		dest_tagqta = "FarmaciSceltiNONMutuabili_Scatole";
		dest_tagposolog = "FarmaciSceltiNONMutuabili_Posologia";
		dest_cuf = "FarmaciSceltiNONMutuabili_cuf";	
	}
	
	if (dest_tagfarm != null){
		var lst_source=document.getElementById("FarmaciSelezionati");
		var lst_dest=opener.document.getElementById(dest_tagfarm);
		var lst_qta=opener.document.getElementById(dest_tagqta);
		var lst_cuf=opener.document.getElementById(dest_cuf);
		var lst_posolog=opener.document.getElementById(dest_tagposolog);
		
		if (lst_dest){
			//svuotaListBox(lst_dest);
			//svuotaListBox(lst_qta);
			//svuotaListBox(lst_cuf);
			//svuotaListBox(lst_cuf);

			//Fill ListBox "PrestazioniScelte".. ;)
			for (var i=0; i<lst_source.length;i++){
				//Farmaco..
				var oOpt_farm = opener.document.createElement("Option");
				oOpt_farm.text = lst_source[i].text;
				oOpt_farm.value = lst_source[i].value;  //aggiungo sempre l'informazione per allineare con le prestazioni(che hanno l'info sulle cicliche)
				lst_dest.add(oOpt_farm);
				//Quantità..
				var oOpt_Qta = opener.document.createElement("Option");
				oOpt_Qta.text = "1";
				oOpt_Qta.value = "1";
				lst_qta.add(oOpt_Qta);
				//Posologia
				var oOpt_posolog = opener.document.createElement("Option");
				oOpt_posolog.text = "";
				oOpt_posolog.value = "";
				lst_posolog.add(oOpt_posolog);	
				//Nota cuf..
				if (calltype != "notmut"){
					var oOpt_Cuf = opener.document.createElement("Option");
					oOpt_Cuf.text = "";
					oOpt_Cuf.value = "";
					lst_cuf.add(oOpt_Cuf);
				}
			}	
		}		
	}
	//close windows..
	parent.self.close();	
}
*/
function RiportaSelezionati(){		
	
	var lst_source=document.getElementsByName("FarmaciSelezionati")[0];
	var arrayScelti = '';
	var arrayPresenti = '';
	var lst_scelti="";
	var arrayNuovi = '';
	var calltype= getURLParam("CALL_TYPE");
	var notaCuf="";
	
	// farmaci già scelti nella opener
	if (calltype == "esen"){ 
		lst_scelti=window.opener.jQuery(".farmaciEsen");
	}
	else if (calltype == "notesen"){
		lst_scelti=window.opener.jQuery(".farmaciNonEse");
	}
	else if (calltype == "notmut") {
		lst_scelti=window.opener.jQuery(".farmaciNonMut");
	}	
	// i farmaci già scelti vengono messi nella stringa arrayPresenti separati da ,
	lst_scelti.each(function(){
		arrayPresenti +=jQuery(this).attr("valore")+',';
	});
	
	// ciclo i farmaci selezionati 
	for (var i=0; i<lst_source.length;i++){		
		var farmaco = lst_source[i].text;
		var posNotaCuf= farmaco.indexOf("CUF");
		if (posNotaCuf>0){
			notaCuf=farmaco.substr(posNotaCuf+4);
		}
		else notaCuf="";
		arrayScelti += lst_source[i].value + ",";	
		if (calltype == "esen"){
			if (!in_array_jQuery(arrayPresenti,lst_source[i].value)){
				window.opener.TABELLA.aggiungiRigaEsen(i,lst_source[i].value,lst_source[i].text, 1,"",notaCuf,"",0,0,"");
				arrayNuovi += lst_source[i].value + ",";
			}
		}
		else if (calltype=="notesen") {
			if (!in_array_jQuery(arrayPresenti,lst_source[i].value)){
				window.opener.TABELLA.aggiungiRigaNotEsen(i,lst_source[i].value,lst_source[i].text, 1,"",notaCuf,"",0,0,"");
				arrayNuovi += lst_source[i].value + ",";
			}
		}
		else if (calltype=="notmut"){
			if (!in_array_jQuery(arrayPresenti,lst_source[i].value)){
				window.opener.TABELLA.aggiungiRigaNonMut(i,lst_source[i].value,lst_source[i].text, 1,"");
				arrayNuovi += lst_source[i].value + ",";
			}
		}
	}

	// si ricarica la lista degli esami scelti per capire se qualcuno è stato cancellato
	if (calltype == "esen"){ 
		lst_scelti=window.opener.jQuery(".farmaciEsen");
	}
	else if (calltype == "notesen"){
		lst_scelti=window.opener.jQuery(".farmaciNonEse");
	}
	else if (calltype == "notmut") {
		lst_scelti=window.opener.jQuery(".farmaciNonMut");
	}
	
	lst_scelti.each(function(){
		if(!in_array_jQuery(arrayScelti, jQuery(this).attr("valore"))){
			if (calltype == "esen"){
				window.opener.TABELLA.eliminaRiga(jQuery(this).attr("indice"));
				}
			else if (calltype == "notesen"){
				window.opener.TABELLA.eliminaRigaNonEse(jQuery(this).attr("indice"));
			}
			else if (calltype == "notmut"){
				window.opener.TABELLA.eliminaRigaNonMut(jQuery(this).attr("indice"));
			}
			
		}
	});
	
	self.close();
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

/*
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
*/

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


function Win_openProfiloNew() {
	var Tipo_Scheda="CONFIGURAZIONE_PROFILI_RICETTA";
//	var strprestazioni = "35223,35224,35229";
	var finestra = window.open("servletGenerator?KEY_LEGAME="+Tipo_Scheda+"&SITO=ALL&TIPO=RR_FARMACI&INSERIMENTO=N","","status=yes fullscreen=yes", false);	
	try
	{//fuori dalla cartella
		top.opener.opener.closeWhale.pushFinestraInArray(finestra);
	}
	catch(e)
	{  
		opener.top.opener.top.closeWhale.pushFinestraInArray(finestra);
	}       	
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

function farmaciScelti(){	
	var calltype= getURLParam("CALL_TYPE");
	var farmaci = null;
	if (calltype=="esen"){
		farmaci = opener.jQuery(".farmaciEsen");
	}
	else if (calltype=="notesen"){
		farmaci = opener.jQuery(".farmaciNonEse");
	}
	else if (calltype="notmut"){
		farmaci = opener.jQuery(".farmaciNonMut");
	}
	var whereCond='';
	var elenco='';
	
	farmaci.each(function(index){
		if (elenco != ''){ elenco += ',';}
		var split = $(this).attr("valore").split('$');
		elenco += "'"+split[0]+"'";		
	});
	
	if (elenco==''){elenco="''";}
	
	whereCond= 'CODICE_PRODOTTO IN ('+elenco+')';

	_filtro_list_elenco_scelti = new FILTRO_QUERY("FarmaciSelezionati", null);
	//AGGIUNGO LO ZERO ALL'IDEN PER ALLINEARLE ALLE PRESTAZIONI DOVE METTO INVECE CHE LO '0' L'INFO SULLE CICLICHE
	_filtro_list_elenco_scelti.setValueFieldQuery("CODICE_PRODOTTO||'$0$0'");  
	_filtro_list_elenco_scelti.setDescrFieldQuery(
		"decode(nvl((select Codice_Prodotto_Equivalente from mmg.Farmadati$v_Cod_Farmaci_Equiv e where e.codice_prodotto = MMG.FARMADATI$VM_PRODOTTI_RICERCA.codice_prodotto and rownum = 1), ''), '', '[NON SOSTITUIBILE] ', '')||" +
		"DESCRIZIONE ||' - '|| PRINCIPIO_ATTIVO||' - '||DECODE (NVL(note_sulla_prescriz_1, '')||'-'||NVL(note_sulla_prescriz_2, ''), '-', '', note_sulla_prescriz_1||'-', 'CUF:'||note_sulla_prescriz_1, '-'||note_sulla_prescriz_2, 'CUF:'||note_sulla_prescriz_2, 'CUF:'||note_sulla_prescriz_1||'-'||note_sulla_prescriz_2)"	
	);
	_filtro_list_elenco_scelti.setFromFieldQuery("MMG.FARMADATI$VM_PRODOTTI_RICERCA");
	_filtro_list_elenco_scelti.setWhereBaseQuery(whereCond, "RICERCA_ELENCO");
	_filtro_list_elenco_scelti.setOrderQuery("DESCRIZIONE ASC");
	_filtro_list_elenco_scelti.searchListRefresh();	
}
