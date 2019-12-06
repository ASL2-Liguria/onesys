
var _filtro_list_elenco = null;
var _filtro_list_scelti  = null;

jQuery(document).ready(function(){
	
	jQuery("#lblDescr ").click(function(){
		
		preSalvataggio();
	
	});
	
	jQuery("input[name='hDescr']").parent().hide();
	

	//do le classi agli elementi
	document.all['lblReparti'].className='';
	addClass(document.all['lblReparti'],'lblElenco');
	document.all['lblRepartiScheda'].className='';
	addClass(document.all['lblRepartiScheda'],'lblElenco');
	document.all['txtDescr'].className='';
	addClass(document.all['txtDescr'],'txtReparto');
	addClass(document.all['ElencoRepartiScheda'],'txtReparto');
});

function filtroQuery(){
	
	var whereCond='';
	
	if (document.EXTERN.INSERIMENTO.value =='S'){
		whereCond='ATTIVO=\'S\'';
	}else{
		whereCond='ATTIVO=\'S\' and IDEN NOT IN (select iden_pro from RADSQL.VIEW_REPARTI_ASSOCIATI where iden_Scheda ='+document.EXTERN.IDEN.value+')';
	}
	
	//elenco reparti associati
	_filtro_list_scelti = new FILTRO_QUERY('ElencoRepartiScheda', null);
	_filtro_list_scelti.setDistinctQuery('S');
	_filtro_list_scelti.setValueFieldQuery('IDEN_PRO');
	_filtro_list_scelti.setDescrFieldQuery('DESCR');
	_filtro_list_scelti.setFromFieldQuery('RADSQL.VIEW_REPARTI_ASSOCIATI');
	_filtro_list_scelti.setWhereBaseQuery('IDEN_SCHEDA='+document.EXTERN.IDEN.value);
	_filtro_list_scelti.setOrderQuery('DESCR ASC');
	_filtro_list_scelti.searchListRefresh();
	
	//alert('select distinct iden_pro, descr from radsql.VIEW_REPARTI_ASSOCIATI where iden_Scheda='+document.EXTERN.IDEN.value+' order by descr asc');
	//alert('select distinct iden_pro, descr from radsql.tab_pro where ATTIVO=\'S\' and IDEN NOT IN (select iden_pro from RADSQL.VIEW_REPARTI_ASSOCIATI where iden_Scheda ='+document.EXTERN.IDEN.value+') order by descr asc');

	//elenco reparti da scegliere
	_filtro_list_elenco = new FILTRO_QUERY('ElencoReparti', null);
	_filtro_list_elenco.setValueFieldQuery('iden');
	_filtro_list_elenco.setDescrFieldQuery('descr');
	_filtro_list_elenco.setFromFieldQuery('tab_pro');
	_filtro_list_elenco.setWhereBaseQuery(whereCond);
	_filtro_list_elenco.setOrderQuery('DESCR ASC');
	_filtro_list_elenco.searchListRefresh();
}

 function preSalvataggio(){
	 
	var Listbox=document.getElementById('ElencoRepartiScheda');
	var arrayReparti='';
	var attivo=parent.document.EXTERN.ATTIVO.value;

	if (Listbox.length > 0 || attivo != 'S'){
		
		for (var i=0;i<Listbox.length; i++){
				
			if(arrayReparti!=''){ arrayReparti+=','; }
			
			arrayReparti+=Listbox[i].value;
			//alert('arrayReparti: '+arrayReparti);
		}
		
	}else{
		
		alert('Non è possibile salvare una scheda attiva senza associare nessun reparto');
		return;
		
	}
		
	parent.document.getElementById('hReparti').value=arrayReparti;
	//alert( 'hReparti: '+parent.document.getElementById('hReparti').value);
 }
