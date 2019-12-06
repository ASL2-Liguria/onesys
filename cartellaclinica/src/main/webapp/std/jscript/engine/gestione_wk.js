var _PRIMA_VOLTA          = true;
var _DEFAULT_FIELD_FILTRO = 'WHERE_WK';
var _WK_PAGINE_ATTUALE 	  = undefined;
var _WK_PAGINE_TOTALI     = undefined;
var _WK_ORDINA_CAMPO      = '';
var _SQL_FILTRI_DB        = "SP_SAVE_FILTRO_WK('#USER_NAME#', #TIPO#, '#LASTVALUECHAR#');";
var _SQL_INS_FILTRI_DB    = "insert into FILTRI(USER_NAME, TIPO, LASTVALUECHAR) values('#USER_NAME#', #TIPO#, '#LASTVALUECHAR#')";
var _SQL_UPD_FILTRI_DB    = "update FILTRI set LASTVALUECHAR = '#LASTVALUECHAR#' where USER_NAME = '#USER_NAME#' and TIPO = #TIPO#";


function genereate_url_wk(url_origine, where, ricostruisci)
{
	var url_ret = '';
	var url_par	= [];
	var a_par	= null;
	var a_tmp	= null;
	var idx_par;
	//_WK_ORDINA_CAMPO=document.EXTERN.ORDER_FIELD_CAMPO
	
	if(typeof ricostruisci != 'undefined' && ricostruisci)
	{
		a_par = url_origine.split('&');
		
		url_origine = 'servletGenerator?';
		
		for(idx_par = 0; idx_par < a_par.length; idx_par++)
		{
			a_tmp = a_par[idx_par].split('=');
			
			if(a_tmp.length == 2)
			{
				// Riporta tutti i parametri sconosciuti e ricalcola quelli noti
				if(a_tmp[0] != 'PAGINA_WK' && a_tmp[0] != _DEFAULT_FIELD_FILTRO && a_tmp[0] != 'ORDER_FIELD_CAMPO')
				{
					url_par.push(a_par[idx_par]);
				}
			}
		}
		
		url_ret = url_origine + url_par.join("&");
	}
	else
	{
		url_ret = url_origine;
	}
	
	
	url_ret += '&PAGINA_WK=' + _WK_PAGINE_ATTUALE + '&' + _DEFAULT_FIELD_FILTRO + '=' + (/where/i.test(where) ? where : "%20where%20"+where) + '&ORDER_FIELD_CAMPO=' + _WK_ORDINA_CAMPO;

	return url_ret;
}

function salva_filtro(obj)
{
	if(typeof salva_filtro.obj == 'undefined' && typeof obj != 'undefined')
	{
		salva_filtro.obj = obj;
	}
	
	if(typeof obj.FILTRO_CAMPO_SAVE != 'undefined')
	{
		if(typeof salva_filtro.operazione == 'undefined')
		{
			salva_filtro.operazione = 'I';
		}
		
		if(salva_filtro.operazione == 'I')
		{
			salva_filtro.operazione = 'U';
			query = _SQL_UPD_FILTRI_DB;
		}
		else
		{
			salva_filtro.operazione = 'I';
			query = _SQL_INS_FILTRI_DB;
		}
		
		query = query.replace(/\#USER_NAME#/g, baseUser.LOGIN);
		query = query.replace(/\#TIPO#/g, obj.FILTRO_CAMPO_SAVE);
		query = query.replace(/\#LASTVALUECHAR#/g, document.getElementsByName(obj.getAttribute("FILTRO_CAMPO_VALORE"))[0].value.replace(/\'/g, "''"));
		
		//alert(query);
		dwr.engine.setAsync(false);
		toolKitDB.executeQueryData(query, response_salva_filtro);
		dwr.engine.setAsync(true);
		
		if(!isNaN(salva_filtro.risposta))
		{
			if(parseInt(salva_filtro.risposta, 10) <= 0)
			{
				return salva_filtro(obj);
			}
			else
			{
				salva_filtro.operazione = undefined;
				
				return salva_filtro.risposta;
			}
		}
		else
		{	
			salva_filtro.operazione = undefined;
			
			return -1;
		}
	}
}

function response_salva_filtro(risp)
{
	salva_filtro.risposta = risp;
}

function generate_save_filtro(obj)
{
    var query = '';
    
    if(typeof obj.FILTRO_CAMPO_SAVE != 'undefined')
    {
        query = _SQL_FILTRI_DB;
        query = query.replace(/\#USER_NAME#/g, baseUser.LOGIN);
        query = query.replace(/\#TIPO#/g, obj.FILTRO_CAMPO_SAVE);
        query = query.replace(/\#LASTVALUECHAR#/g, document.getElementsByName(obj.getAttribute("FILTRO_CAMPO_VALORE"))[0].value.replace(/\'/g, "''"));
    }
    
	//alert(query);
    return query;
}

function save_filtro(sql)
{
	//alert(sql);
    if(typeof sql != 'undefined' && sql != null)
    {
        var risp = '';
        
        dwr.engine.setAsync(false);
        toolKitDB.executeQueryData('begin ' + sql + 'end;', function(r){risp = r;});
        dwr.engine.setAsync(true);
    }
}

function apri_filtro(obj, not_init)
{
	var wFiltri;
	var url;
	
	url = 'servletGenerator?KEY_LEGAME=' + obj.getAttribute('FILTRO_KEY_LEGAME');
	url += '&FILTRO_CAMPO_DESCRIZIONE=' + obj.getAttribute('FILTRO_CAMPO_DESCRIZIONE');
	url += '&FILTRO_CAMPO_VALORE=' + obj.getAttribute('FILTRO_CAMPO_VALORE');
	//url += '&FILTRO_UTENTE=' + baseUser.LOGIN;
	
	url += '&FILTRO_SELEZIONA=' + escape(document.getElementsByName(obj.getAttribute("FILTRO_CAMPO_VALORE"))[0].value);
        if(typeof obj.getAttribute('FILTRO_CALL_AFTER_CLOSE') != 'undefined' && obj.getAttribute('FILTRO_CALL_AFTER_CLOSE')!=null)
            url += '&FILTRO_CALL_AFTER_CLOSE=' + obj.getAttribute('FILTRO_CALL_AFTER_CLOSE');
        else
            url += '&FILTRO_CALL_AFTER_CLOSE=';
	
	
	if (document.getElementById('hWhereCond')!=null){
		if (document.getElementById('hWhereCond').value != ''){
			url += '&FILTRO=' + escape(document.getElementById('hWhereCond').value);
		}
	}
	
	
//	wFiltri = window.open(url, 'winstd', 'status = yes, scrollbars = yes, height = 500, width = 800, top = 1500, left = 1500');
	wFiltri = window.open(url, 'winstd',"status = yes, scrollbars = yes, top=0,left=0,height=" + screen.availHeight + ", width=" + screen.availWidth);
	if(wFiltri)
	{
		wFiltri.focus();
	}
	else
	{
		wFiltri = window.open(url, 'winstd', 'status = yes, scrollbars = yes, height = 1, width = 1, top = 1500, left = 1500');
	}
}

function applica_filtro(url_new, not_init)
{
	var a_filtri = document.getElementsByAttribute('*', 'FILTRO_CAMPO_DESCRIZIONE');
	var a_valori = null;
	var where    = '';
	var where_noe = '';
	var campo    = '';
	var valore	 = '';
	var save	 = '';
	var url_tmp	 = '';
	var tmp_where;

	for(var idx_filtri = 0; idx_filtri < a_filtri.length; idx_filtri++)
	{
		// Salvo il filtro!
                /*if(!_PRIMA_VOLTA)
                    save += generate_save_filtro(a_filtri[idx_filtri]);*/
                if(!_PRIMA_VOLTA)        
                    NS_SALVA_FILTRO.init(baseUser.LOGIN,a_filtri[idx_filtri]);
                		
		campo = a_filtri[idx_filtri].getAttribute("FILTRO_CAMPO_DB");
		valore = document.getElementsByName(a_filtri[idx_filtri].getAttribute("FILTRO_CAMPO_VALORE"))[0].value;
		
		//alert(a_filtri[idx_filtri].getAttribute("FILTRO_CAMPO_DB") + ' - ' +document.getElementsByName(a_filtri[idx_filtri].getAttribute("FILTRO_CAMPO_VALORE"))[0].value);
		
		if(trim(valore) != '')
		{
			if(trim(where) != '')
			{
				where += ' and ';
			}
			
			if(a_filtri[idx_filtri].getAttribute("FILTRO_CAMPO_TIPO") == 'DATE')
			{
				a_valori = valore.split('/');
				valore = "'" + a_valori[2] + a_valori[1] + a_valori[0] + "'";
				where += '(' + campo + valore;
			}
			else
			{
				if(campo.toLowerCase().indexOf('like') > 0)
				{
					tmp_where = '';
					a_valori = valore.split(',');
					
					for(var idx_value = 0; idx_value < a_valori.length; idx_value++)
					{
						if(trim(tmp_where) != '')
						{
							tmp_where += ' or ';
						}
						
						if(typeof a_filtri[idx_filtri].getAttribute("FILTRO_CAMPO_AFTER_VALUE") == 'string')
						{
							tmp_where += campo + a_valori[idx_value].replace(/\'/, "''") + a_filtri[idx_filtri].getAttribute("FILTRO_CAMPO_AFTER_VALUE") + '\'';
						}
						else
						{
							tmp_where += campo + a_valori[idx_value].replace(/\'/, "''") + '\'';
						}
					}
					
					where += '(' + tmp_where;
				}
				else
				{   // se nel campo valore trovo "='" oppure "= '", aggiunge "'" in fondo 
					if (a_filtri[idx_filtri].getAttribute("FILTRO_CAMPO_TIPO")=='TEXT' && (campo.indexOf('= \'')>0 || campo.indexOf('=\'')>0) ) {
						valore = valore.replace(/\'/, "''") + '\'';
					}
					where += '(' + campo + valore;
				}

			}
			
			if(campo.substr(campo.length - 1) == '(')
			{
				where += ')';
			}
			
			if(campo.toLowerCase().indexOf('array_value') > 0)
			{
				where += ')';
			}
			
			where += ')';
			
		}
	}
	
	
        
        if(!_PRIMA_VOLTA)
        {
            NS_SALVA_FILTRO.save();
        }
        else
            _PRIMA_VOLTA = false;
        
	if(typeof document.all['WHERE_WK_EXTRA'] != 'undefined')
	{
		if(trim(document.all['WHERE_WK_EXTRA'].value) != '')
		{
			if(trim(where) != '')
			{
				where += ' and ';
			}
			
			var extra = document.all['WHERE_WK_EXTRA'].value.replace(/WHERE /, '');
			
			where += '(' + extra + ')';
			
		//	where += '(' + document.all['WHERE_WK_EXTRA'].value + ')';
		}
	}
	
	if(trim(where) != '')
	{
		
		where_noe = 'WHERE ' + where;
		where = 'WHERE ' + escape(where);
	}
	
	try
	{
		if(where == '' && document.all['WHERE_WK'].value != '')
			where = document.all['WHERE_WK'].value.replace(/where /, '');
	}
	catch(e)
	{
	}
	
	
	if(typeof url_new != 'undefined')
	{
		document.all.oIFWk.SRC_ORIGINE = url_new;
	}
	if(typeof not_init == 'undefined')
	{
		_WK_PAGINE_ATTUALE = 1;
	}
	
	if(typeof document.all.oIFWk != 'undefined')
	{
		/*if(document.all.oIFWk.src == 'blank')
			document.all.oIFWk.src = genereate_url_wk(document.all.oIFWk.SRC_ORIGINE, where);
		else
			document.all.oIFWk.contentWindow.jQuery().refreshWorklist(where_noe);*/
		
		document.all.oIFWk.src = genereate_url_wk(document.all.oIFWk.SRC_ORIGINE, where);
	}
	else
	{
		url_tmp = document.location + '';
		url_tmp = url_tmp.substr(url_tmp.indexOf('?') + 1, url_tmp.length);
		url_tmp = genereate_url_wk(url_tmp, where, true);
		document.location.replace(url_tmp);
	}

	
}

function gestisci_pulsanti_direzione(n_pag_totale, n_pag_corrente)
{
	var bt_avanti 	= document.getElementsByAttribute('td', 'className', 'classButtonHeaderHideSuccessivo');
	var bt_indietro = document.getElementsByAttribute('td', 'className', 'classButtonHeaderHidePrecedente');
	
	if(!isNaN(n_pag_corrente)) // typeof _WK_PAGINE_ATTUALE == 'undefined' || 
	{
		_WK_PAGINE_ATTUALE = n_pag_corrente;
	}
	
	if(!isNaN(n_pag_totale)) // typeof _WK_PAGINE_TOTALI == 'undefined' || 
	{
		_WK_PAGINE_TOTALI = n_pag_totale;
	}
	
	if(bt_avanti.length > 0 && bt_indietro.length > 0)
	{
		bt_avanti[0].style.display = parseInt(_WK_PAGINE_ATTUALE, 10) < parseInt(_WK_PAGINE_TOTALI, 10) ? 'block':'none';
		bt_indietro[0].style.display = parseInt(_WK_PAGINE_ATTUALE, 10) > 1 ? 'block':'none';
	}
}

function sfasa_pagina(offset)
{
	if(offset != '')
	{
		_WK_PAGINE_ATTUALE = eval('parseInt(_WK_PAGINE_ATTUALE, 10) ' + offset);
	}
	
	applica_filtro(undefined, true);
}

// Overwrite dei metodi tradizionali
function aggiungi_ordinamento(campo, tipo)
{
	_WK_ORDINA_CAMPO = campo + ' ' + tipo;

	if (typeof parent.applica_filtro!='undefined'){
		parent._WK_ORDINA_CAMPO = campo + ' ' + tipo;
		parent.applica_filtro(undefined, true);
	}else{
		applica_filtro(undefined, true);
	}
	
	event.returnValue = false;
}

function setManualAscOrder(campo)
{
	aggiungi_ordinamento(campo, 'asc');
}

function setManualDescOrder(campo)
{
	aggiungi_ordinamento(campo, 'desc');
}

NS_SALVA_FILTRO = {
    pArray : new Array(),
    pCheckArray : new Array(),
    pCheckValue:{
        pUtente:'',
        campo_save:'',
        valore:''
    },
    
    init : function(pUserLogin,pObj){
        if (typeof pObj.getAttribute('FILTRO_CAMPO_SAVE') != 'undefined' && pObj.getAttribute('FILTRO_CAMPO_SAVE') !=null){
            NS_SALVA_FILTRO.pArray.push([
                pUserLogin,
                pObj.getAttribute('FILTRO_CAMPO_SAVE'),
                document.all[pObj.getAttribute('FILTRO_CAMPO_VALORE')].value
            ]);
        }
    },
  
    save: function(){
		window.WindowCartella = window;
		while(window.WindowCartella.name != 'Home' && window.WindowCartella.name != 'schedaRicovero'){
			window.WindowCartella = window.WindowCartella.parent;
		}
        var resp = WindowCartella.executeBatchStatement("gestione_wk.xml","saveFiltroWk",NS_SALVA_FILTRO.pArray,0);
        NS_SALVA_FILTRO.pArray = [];
  }
    
};