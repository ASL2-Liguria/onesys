//DA CONTROLLARE POICHè è LA COPIA DI ASSOCIA_ESAMI_SCHEDA


_filtro_list_elenco='';
_filtro_list_scelti='';
_filtro_list_elenco_micro='';
_filtro_list_scelti_micro='';

//do le classi agli elementi
document.all['lblEsamiScheda'].className='';
addClass(document.all['lblEsamiScheda'],'lblElenco');
document.all['lblEsami'].className='';
addClass(document.all['lblEsami'],'lblElenco');
//document.all['lblEsamiMicro'].className='';
//addClass(document.all['lblEsamiMicro'],'lblElenco');
//document.all['lblEsamiSchedaMicro'].className='';
//addClass(document.all['lblEsamiSchedaMicro'],'lblElenco');
document.all['txtDescr'].className='';
addClass(document.all['txtDescr'],'textProfilo');
document.all['lblLink'].className='';
addClass(document.all['lblLink'],'pulsante');
//document.all['txtDescrMicro'].className='';
//addClass(document.all['txtDescrMicro'],'textProfilo');


function filtroQuery(){

	var whereCond2='';
	
	if (parent.document.dati.hTipo.value=='LABORATORIO'){
		
		document.getElementById('lblTitleAssociazione').innerText='Esami LABORATORIO';	
		whereCond2='ATTIVO=\'S\' and METODICA=\'L\'';
	
	}else if (parent.document.dati.hTipo.value=='MICROBIOLOGIA'){
	
		whereCond2= 'ATTIVO=\'S\' and METODICA=\'A\'';
		document.getElementById('lblTitleAssociazione').innerText='Esami MICROBIOLOGIA';
	
	}else{
	
		whereCond2= 'ATTIVO=\'S\'';
		document.getElementById('lblTitleAssociazione').innerText='Esami MICROBIOLOGIA';
		
	}
	
	_filtro_list_elenco = new FILTRO_QUERY('ElencoEsami', null);
	_filtro_list_elenco.setEnableWait('N');
	_filtro_list_elenco.setValueFieldQuery('IDEN');
	_filtro_list_elenco.setDescrFieldQuery('DESCR')	;
	_filtro_list_elenco.setFromFieldQuery('RADSQL.TAB_ESA');
	_filtro_list_elenco.setWhereBaseQuery(whereCond2);
	_filtro_list_elenco.setOrderQuery('DESCR ASC');
	
	if(parent.document.EXTERN.STATO.value!='INS'){
	
		_filtro_list_elenco.searchListRefresh();
	
	}
	
	_filtro_list_scelti = new FILTRO_QUERY('ElencoEsamiScheda', null);
	_filtro_list_scelti.setEnableWait('N');
	_filtro_list_scelti.setValueFieldQuery('tl.IDEN_ESA');
	_filtro_list_scelti.setDescrFieldQuery('te.DESCR');
	_filtro_list_scelti.setFromFieldQuery('RADSQL.TAB_LABO_SCHEDE_ESAMI tl,TAB_ESA te');
	_filtro_list_scelti.setWhereBaseQuery('tl.IDEN_ESA=te.IDEN AND tl.IDEN_SCHEDA='+parent.document.EXTERN.IDEN_SCHEDA.value );
	_filtro_list_scelti.setOrderQuery('te.DESCR ASC');
	_filtro_list_scelti.searchListRefresh();
	
	document.getElementById('lblTitleAssociazione').innerText='Scelta Esami';
	
}



 function preSalvataggio(){
	 
	var Listbox=document.getElementById('ElencoEsamiScheda');
	var arrayEsami='';
	
		for (i=0;i<Listbox.length; i++){
				
			if(arrayEsami!=''){
			
				arrayEsami+='#';
				
			}
			
				arrayEsami+=Listbox[i].value;
				//alert('arrayEsami: '+arrayEsami);
		}
		
	parent.document.getElementById('hEsami').value='';
	parent.document.getElementById('hEsami').value=arrayEsami;
	//alert( 'hEsami: '+parent.document.getElementById('hEsami').value);
	
 }
