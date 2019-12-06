var _filtro_list_elenco	= null;
var _REPARTO_RICHIEDENTE= document.EXTERN.REPARTO_RICHIEDENTE.value;
var _CDC_DESTINATARIO	= document.EXTERN.CDC_DESTINATARIO.value;
var _TIPO		= document.EXTERN.TIPO.value;
var _URGENZA		= document.EXTERN.URGENZA.value;
var _METODICA		= document.EXTERN.METODICA.value;
var _IDEN_SCHEDA	= typeof document.EXTERN.IDEN_SCHEDA=='undefined'?'':document.EXTERN.IDEN_SCHEDA.value;

//do le classi agli elementi
document.all['ElencoEsamiRichiesta'].className='';
addClass(document.all['ElencoEsamiRichiesta'],'listboxGiallo');
document.all['txtDescr'].className='';
addClass(document.all['txtDescr'],'textRicerca');
document.all['ElencoEsami'].className='';
addClass(document.all['ElencoEsami'],'listboxEsami');

document.getElementById('hDescr').parentElement.style.display='none';

jQuery("body").keypress (function(e) {

        if(e.keyCode==13){
                _filtro_list_elenco.searchListRefresh("COL02 like '%" + document.dati.txtDescr.value.toUpperCase() + "%'", "RICERCA_ELENCO");
        }
});

// Nasconde il fildset nel caso in cui richiediamo esami POCT .
// Da rivedere il filtro per nascondere l'elemento: _IDEN_SCHEDA non nullo potrebbe non bastare in futuro.
if (_IDEN_SCHEDA != '') {
    $('#lblProfiliFS').hide();
}


function scegliEsamiProfilo(val){
	
	var sql='select tg.iden_esa, te.descr from radsql.tab_esa te join radsql.tab_esa_gruppi tg on (te.iden=tg.iden_esa) where tg.cod_gruppo=\''+val+'\' AND REPARTO=\''+_REPARTO_RICHIEDENTE+'\'';

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
	
	var ElencoEsami	= parent.opener.document.all.HelencoEsami.value;
	var whereCond	= '';
	var elenco		= '';	
	
	//se il campo HelencoEsami non è vuoto utilizzo i valori per filtrare gli esami nella query
	if (ElencoEsami != ''){
	
			var esame= new Array();
			esame = ElencoEsami.split('#');
			//alert(esame);
			
			for (var i=0;i<esame.length;i++){
				
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

	_filtro_list_elenco.setValueFieldQuery('COL01');
	_filtro_list_elenco.setDescrFieldQuery('COL02');
        _filtro_list_elenco.setFromFieldQuery("table(RADSQL.GETESAMIRICHIEDIBILI('"+_CDC_DESTINATARIO+"','"+_REPARTO_RICHIEDENTE+"','"+_TIPO+"','"+_URGENZA+"','"+_METODICA+"','"+_IDEN_SCHEDA+"'))");
	_filtro_list_elenco.setOrderQuery('COL02 ASC');
	_filtro_list_elenco.refreshList();
	
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
		myListBox.options[myListBox.options.length] = new Option(optArray[i].text, optArray[i].value + '@' + 'L@0' );
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
	add_selected_elements(val1.name, val2.name, true, 0);
	//sortSelect(val1.name);
}

function chiudiScelta(){

	if (confirm('Attenzione! \nLe scelte effettuate non saranno salvate. \nProseguire?')){
	
		self.close();
	}
}

//funzione che svuota completamente il listbox
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


