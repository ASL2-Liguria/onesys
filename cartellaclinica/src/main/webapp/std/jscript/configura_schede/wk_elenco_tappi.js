var  _filtro_list_esami_tappo=null
	
jQuery(document).ready(function() {	
	caricaLabelOrder();
});


//wk elenco_tappi
function associaTappi(descrizione, classe){

	if(parent.parent.document.getElementById('hTipo').value==''){
		
		alert('Scegliere la tipologia nel Dettaglio Scheda');
		return;
	}
	
	parent.document.getElementById('hContenitore').value="";
	parent.document.getElementById('hDescrContenitore').value=descrizione.toUpperCase();
	parent.document.getElementById('hClasse').value=classe;
	//alert(parent.document.getElementById('hContenitore').value);

	visualizzaTappoWk();
}

 
//function che carica le label degli ordinamenti delle wk
function caricaLabelOrder(){

	var order =document.EXTERN.ORDER_FIELD_CAMPO.value;
	parent.document.getElementById('lblOrder').innerText+='';

	//parent.document.getElementById('lblOrder').innerText='order: ';

	if (order !=''){
		if (order.substring(order.length-4,order.length)==' ASC'){
			//parent.document.getElementById('lblOrder').innerText+=order;
			parent.document.getElementById('lblOrder').className='';
			addClass(parent.document.getElementById('lblOrder'), 'orderAsc');
		}else{
			parent.document.getElementById('lblOrder').className='';
			addClass(parent.document.getElementById('lblOrder'), 'orderDesc');
		}
	}else{
		parent.document.getElementById('lblOrder').innerText+=' ';
	}
}


//carica gli esami del tappo --adattata per la wk
function filtroEsamiTappoWk(){

 	var whereCond='iden in (select iden_esa from radsql.gestione_laboratorio where ';
	var ListTappi='';
	var Ins='';
	var Mod='';
	 
	 //distinguo se richiamo la funzione da wk o da gestione_tappi
	 if (typeof parent.document.EXTERN.INSERIMENTO =='undefined'){
		
		Ins=document.EXTERN.INSERIMENTO.value;
		Mod=document.EXTERN.MODIFICA.value;
		ListTappi=document.getElementById('elencoTappiScheda');
		
	 }else{
	 
		Ins=parent.document.EXTERN.INSERIMENTO.value;
		Mod=parent.document.EXTERN.MODIFICA.value;
		ListTappi=parent.document.getElementById('elencoTappiScheda');
	 }
	 
	 //alert('Inserimento\Modifica: +'Ins +' - '+ Mod );
	
	if (Ins !='S'){
	
		whereCond+='iden_pro=\'0\' and iden_tappo='+document.getElementById('hContenitore').value+')';		

		if (Mod != 'N'){
			whereCond+='iden_tappo='+document.getElementById('hContenitore').value+')';		
		}
		
	}else{
	
		whereCond='1=0';
	}

	if (typeof _filtro_list_esami_tappo == 'string'){

		//alert('select distinct cod_Esa, to_char(ID_ANALISI ||\' - \'|| DESCR) from radsql.view_labo_esami where '+whereCond);
		_filtro_list_esami_tappo = new FILTRO_QUERY('elencoEsamiTappo', null);
		_filtro_list_esami_tappo.setEnableWait('N');
		_filtro_list_esami_tappo.setDistinctQuery('S');	
		_filtro_list_esami_tappo.setValueFieldQuery('COD_ESA');
		_filtro_list_esami_tappo.setDescrFieldQuery('DESCRIZIONE_LISTBOX');
		_filtro_list_esami_tappo.setFromFieldQuery('RADSQL.VIEW_LABO_ESAMI');
		_filtro_list_esami_tappo.setWhereBaseQuery(whereCond);
		_filtro_list_esami_tappo.setOrderQuery('DESCRIZIONE_LISTBOX ASC');
		_filtro_list_esami_tappo.setTypesElement("UL","LI");
		_filtro_list_esami_tappo._obj.parentNode.style.overflowY = 'scroll';
		_filtro_list_esami_tappo._obj.parentNode.style.position = 'relative';
		
		_filtro_list_esami_tappo.searchListRefresh(); 	
	
	}else if (typeof _filtro_list_esami_tappo == 'object'){

		_filtro_list_esami_tappo.setWhereBaseQuery(whereCond);
		_filtro_list_esami_tappo.searchListRefresh(); 
		
	}
	
	if (Ins !='S'){
		_filtro_list_esami_tappo.searchListRefresh(); 	
	}
	
	parent.sortableLi();
}


function insNewTappo(){
	
	url = "servletGenerator?KEY_LEGAME=PAG_INS_TAPPO&STATO=INS";
	
	parent.$.fancybox({
		'padding'	: 3,
		'width'		: 470,
		'height'	: 250,
		'href'		: url,
		'type'		: 'iframe'
	});
}


function cancellaTappo(){

	var sql='';
	sql = "{call ? := RADSQL.CLS_CANCELLA_TAPPO(" + idenScheda + ","+idenTappo+")}";

	dwr.engine.setAsync(false);
	toolKitDB.executeFunctionData(sql, callTappo);
	dwr.engine.setAsync(true);

	function callTappo(resp){
		
		if(resp.substring(0,2) != 'KO'){
			ricaricaWk();
		}else{
			alert(resp.substring(2));
		}
	}
}

function ricaricaWk(){

	//da considerare il fatto che non ci sono più options e si dovrà ciclare i vari li del div
	var ListEsami='';
	ListEsami=jQuery("#elencoTappiScheda [tipo='tappi']");
	var splitEsa='';
	 
	var elencoIden='';
	var src='';

		for (var i=0;i<ListEsami.length;i++){

			if (elencoIden!='' && ListEsami[i].value !=''){
				elencoIden+=',';
			}
			
			if(ListEsami[i].value!=''){
				elencoIden+=ListEsami[i].value;
				//alert(elencoIden);
			}
		}

	src="servletGenerator?KEY_LEGAME=WK_ELENCO_TAPPI&WHERE_WK= where iden not in ('"+elencoIden+"')&ORDER_FIELD_CAMPO="; //da cambiare con nome corretto wk
	//alert(src);

	//ricarico la worklist con la nuova where condition
	var iframe='';
	iframe+='<div id="divElencoTappi" ><IFRAME id=elencoTappi height=300 src="'+src+'" frameBorder=0 width=510 scrolling=yes SRC_ORIGINE="blank.htm"></IFRAME></div>';

	$("#elencoTappi").replaceWith(iframe);
}


//function che apre i div del dettaglio degli esami relativi al tappo. Se obj non glielo passo lui prende la option selezionata nell'elenco dell'anagrafica dei tappi, altrimenti gli si passa la option selezionata 
//nell'elenco dei tappi associati alla scheda
function visualizzaTappoWk(obj){

	//alert('obj: '+obj+'\ntypeof obj: '+typeof obj);
	
	var idenTappo=parent.document.getElementById('hContenitore').value;
	
	if (typeof obj == 'undefined'){
		obj=stringa_codici(array_descrizione);
		parent.filtroEsamiTappo();
	}else{
		 filtroEsamiTappoWk();
	}
	
	var src="servletGenerator?KEY_LEGAME=WK_ESAMI_CONFIGURATORE&ORDER_FIELD_CAMPO=&WHERE_WK= where 1=1";
	//alert(src);
	
	parent.$('#divEsamiTappo').show(300);
	parent.$('#divRicEsami').show(300);
	addClass(parent.document.getElementById('divElencoTappi'),'opacity');
	addClass(parent.document.getElementById('divTappiScheda'),'opacity');
	parent.document.getElementById('lblElencoEsamiTappo').innerText= obj.toUpperCase();
	
	//ricarico la worklist con la nuova where condition
	var iframe='';
	iframe+='<div id="divElencoEsami" ><IFRAME id=elencoEsami height=350 src="'+src+'" frameBorder=0 width=500 scrolling=yes SRC_ORIGINE="blank.htm"></IFRAME></div>';

	parent.$("#elencoEsami").replaceWith(iframe);
	
	//assegno la classe alla label per il colore del tappo
	parent.document.getElementById("lblColore").parentElement.className ='';
	addClass(parent.document.getElementById("lblColore").parentElement, parent.document.getElementById("hClasse").value);
	parent.document.getElementById("lblColore").innerText='QUESTO E\' IL COLORE DEL CONTENITORE';
	
	ricaricaWk();
}


