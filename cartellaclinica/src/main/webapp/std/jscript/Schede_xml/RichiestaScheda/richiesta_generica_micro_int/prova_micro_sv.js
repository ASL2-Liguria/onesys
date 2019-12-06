var _filtro_list_elenco='';
var _filtro_list_scelti='';


jQuery(document).ready(function(){
	caricamento();
	AddClass();
});




function caricamento(){
	
	//valorizzo alcune variabili
	var reparto=document.EXTERN.REPARTO.value;
	var urgenza=document.EXTERN.URGENZA.value;
	
	/*attivo il tabulatore*/
	var lista = ['Esami Microbiologia','BK_DNA_PCR'];
	//alert(lista);
	attivaTab(lista,1);
	document.getElementById("oIFWk").contentWindow.location.replace(apriContenitoreLabo());
	
	jQuery("body").keypress (function(e) {

	    if(e.keyCode==13){
	            _filtro_list_elenco.searchListRefresh("DESCR like '%" + document.dati.txtDescr.value.toUpperCase() + "%'", "RICERCA_ELENCO");
	    }
	});
	
}

function AddClass(){
	
	//do le classi agli elementi
	document.all['ElencoEsamiRichiesta'].className='';
	addClass(document.all['ElencoEsamiRichiesta'],'listboxGiallo');
	document.all['txtDescr'].className='';
	addClass(document.all['txtDescr'],'textRicerca');
	document.all['ElencoEsami'].className='';
	addClass(document.all['ElencoEsami'],'listboxEsami');

	document.getElementById('hDescr').parentElement.style.display='none';
	
}


function scegliEsamiProfilo(val){
	
	var sql='select tg.iden_esa, te.descr from radsql.tab_esa te join radsql.tab_esa_gruppi tg on (te.iden=tg.iden_esa) where tg.cod_gruppo=\''+val+'\' AND REPARTO=\''+reparto+'\'';
	//alert('sql: '+sql);

	dwr.engine.setAsync(false);		
	toolKitDB.getListResultData(sql, creaOptEsami);		
	dwr.engine.setAsync(true);
}


function creaOptEsami(elenco){

	 //alert('Risultato query dwr: \n\n' +elenco);
	
	var Listbox=document.getElementById('ElencoEsamiRichiesta');
	arrayOpt=new Array();;
	
	for (i=0;i<elenco.length; i++){
	
		var oOpt = document.createElement('Option');
		
		oOpt.value = elenco[i][0];
		oOpt.text = elenco[i][1];
		//alert(oOpt.value);
		
		if (oOpt!=''){
		
		//alert((in_array(Listbox, oOpt.value)));
			
			if (in_array(Listbox, oOpt.value)){
			
				//alert('L\'esame '+oOpt.text+' è già presente');
				
			}else{
			
				Listbox.add(oOpt,0);
			
			}
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


function filtroQuery(){

	//commentato per La Spezia (configuratore)
	//alert(parent.opener.document.all.HelencoEsami.value);
	var ElencoEsami=opener.document.all.HelencoEsami.value;
	var whereCond='';
	var elenco='';
	var urgenza=document.EXTERN.URGENZA.value;
	var idenPro=document.EXTERN.Hiden_pro.value;
	
	//se il campo HelencoEsami non è vuoto utilizzo i valori per filtrare gli esami nella query
	if (ElencoEsami != ''){
	
			var esame= new Array();
			esame = ElencoEsami.split('#');

			for (i=0;i<esame.length;i++){
				
					if (esame[i]!=''){
					
						if (elenco==''){
							elenco=esame[i];
						}else{
							elenco+=','+esame[i];
						}
					//alert(elenco);
					}
			}
			
		whereCond='iden in ('+elenco+')';
	} 
	
	_filtro_list_elenco = new FILTRO_QUERY('ElencoEsami', null);
	_filtro_list_elenco.setEnableWait('N');
	_filtro_list_elenco.setValueFieldQuery('IDEN_ESA');
	_filtro_list_elenco.setDescrFieldQuery('DESCR');
	_filtro_list_elenco.setFromFieldQuery('RADSQL.VIEW_SCELTA_ESAMI_MICRO_SV');
	_filtro_list_elenco.setWhereBaseQuery('URGENZA='+urgenza+' and IDEN_PRO='+idenPro);
	_filtro_list_elenco.setOrderQuery('DESCR ASC');
	_filtro_list_elenco.searchListRefresh();
	
	//if (baseUser.LOGIN == 'lucas'){alert('select iden,descr from radsql.TAB_ESA where '+whereCond+' order by descr asc');}
	_filtro_list_scelti = new FILTRO_QUERY('ElencoEsamiRichiesta', null);
	_filtro_list_scelti.setEnableWait('N');
	_filtro_list_scelti.setValueFieldQuery('IDEN');
	_filtro_list_scelti.setDescrFieldQuery('DESCR');
	_filtro_list_scelti.setFromFieldQuery('RADSQL.TAB_ESA');
	_filtro_list_scelti.setWhereBaseQuery(whereCond);
	_filtro_list_scelti.setOrderQuery('DESCR ASC');
	
	
	//commentato per provare il configuratore per La Spezia
	 if (ElencoEsami!=''){
		 _filtro_list_scelti.searchListRefresh();
	 }
}


//funzione che crea due array con id e valore degli esami con il check
function selezionaEsami(){

	var myListBox= document.createElement('select');
	var ListBoxOld=opener.document.getElementById('cmbPrestRich_L');
	
	myListBox.id='cmbPrestRich_L';
	myListBox.name='cmbPrestRich_L';
	myListBox.style.width = '100%';
	myListBox.setAttribute('STATO_CAMPO','E');
	myListBox.setAttribute('multiple','multiple');
	
	svuotaListBox(myListBox);
	svuotaListBox(ListBoxOld);
	
	//alert(opener.document.all['HelencoEsami'].value);	
	opener.document.all['HelencoEsami'].value='';
	opener.document.all['Hmateriali'].value='';
	
	var lst=document.getElementById("ElencoEsamiRichiesta");
	var idEsami='';
	var optArray = new Array ();
	
	for (var i=0; i<lst.length;i++){
			optArray.push(new Option(lst[i].text, lst[i].value));
	}
	
	for(var i=0; i<optArray.length; i++) {
		myListBox.options[myListBox.options.length] = new Option(optArray[i].text, optArray[i].value + '@' + 'A@0' );
		idEsami += optArray[i].value + '#';
		opener.document.all['Hmateriali'].value +=  '0#';
	}
	
	var s= idEsami;
	var b=/#$/.test(s);   
	var t=s.replace(/#$/,"");    
	
	opener.document.all['HelencoEsami'].value = idEsami; //valorizzo il campo nascosto della pagina precedente

	var innerListBox = opener.document.getElementById('cmbPrestRich_L');
	jQuery(innerListBox).append(myListBox.options.innerHTML);
	self.close();
}


function controllaPresEsami(val1,val2){

	var opt= val1.options[val1.selectedIndex].value;
	
	//alert('opt: '+opt   );
	
	for (i=0;i<val2.length;i++){

		if (val2.options[i].value==opt){
		
			alert('Attenzione! Esame già presente nella lista degli esami da richiedere');
			return;
		}		
	}

	add_selected_elements(val1.name, val2.name, true,0);
	//sortSelect(val1.name);
}

function chiudiScelta(){

	if (confirm('Attenzione! \nLe scelte effettuate non saranno salvate. \nProseguire?')){
		self.close();
	}
}


//funzione che apre la servlet contenitore che contiene le servlet di scelta esami
function apriContenitoreLabo(){
	
	var url = '';
	var urgenza = opener.document.all.hUrgenza.value;
	var idpagina = '';
	
	//controllo se ho passato l'iden della provenienza alla pagina... se non l'ho passato sono in modifica e quindi lo prendo dalla pagina...
	if (typeof opener.document.EXTERN.Hiden_pro == 'undefined' ){
		iden_Pro=opener.document.dati.Hiden_pro.value; //lo prendo direttamente dal campo della pagina
	}else{
		iden_Pro=opener.document.EXTERN.Hiden_pro.value; //lo prendo dai parametri passati in chiamata
	}
	
	
	//controllo l'urgenza della pagina e seleziono l'idpagina. Per ora sono solo due!!!
	if (urgenza == '0'){
		idpagina = '3';
		}
	
	if (urgenza == '2'){
		idpagina = '4';
		}
		
	if(opener.document.EXTERN.LETTURA.value !="S" ){
		
		url = "servletGenerator?KEY_LEGAME=SCELTA_BK_DNA_PCR&Hiden_pro="+iden_Pro+"&URGENZA="+urgenza+"&REPARTO="+opener.document.EXTERN.HrepartoRicovero.value+"&IDPAGINA="+idpagina;
		return url;
		//alert (url);
	}
}


function salvaEsami(){
	
	
	
}