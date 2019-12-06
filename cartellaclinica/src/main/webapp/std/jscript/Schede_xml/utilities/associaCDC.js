/**
 * @author  lucas
 * @author  gianlucab
 * @version 1.1
 */
var _filtro_list_elenco = null;
var _filtro_scelte = null;
var form = [];
var edit = false;

jQuery(document).ready(function() {
	try {		
		$('#txtRicerca').val("");
		document.getElementById('radioDescr').parentElement.colSpan = '5';
		jQuery("[name=elencoCDCsel]").addClass("elencoSel");
		jQuery("[value=descr]").attr("checked","checked");
		document.getElementById('hRic').parentElement.style.display='none';
	
		caricamento();
		setEvents();
		
		$('#txtRicerca').bind('keypress', function(e) {
	        if(e.keyCode==13){
	           var txt=document.getElementById('txtRicerca').value.toUpperCase();
	           Ricerca(txt);
	        }
		});
		
	} catch (e) {
		alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
	}
});

function caricamento()
{
	//var webuser = document.EXTERN.UTENTE.value;
	form['webuser'] = parent.jQuery("form[name=form_associa_cdc] input[name=webuser]").val();
	form['cdc_scelti'] = parent.jQuery("form[name=form_associa_cdc] input[name=cdc_scelti]").val().replace(/[\#\*]+$/,'').split(/[\#\*]/);
	form['cdc_visibili'] = parent.jQuery("form[name=form_associa_cdc] input[name=cdc_visibili]").val().replace(/[\#\*]+$/,'').split(/[\#\*]/);
	form['operazione'] = parent.jQuery("form[name=form_associa_cdc] input[name=operazione]").val();

	caricaElenchi();
}

function setEvents(){
	
	if (_STATO_PAGINA=='I'){
			
		//ONCONTEXTMENU elencoCDC
		document.getElementById('elencoCDC').oncontextmenu=function(){
			edit = true;
			add_selected_elements('elencoCDC', 'elencoCDCsel', true, 0);
			sortSelect('elencoCDCsel'); 
		};
		
		//ONDBLCLICK elencoCDC
		document.getElementById('elencoCDC').ondblclick=function(){
			edit = true;
			add_selected_elements('elencoCDC', 'elencoCDCsel', true, 0);
			sortSelect('elencoCDCsel'); 
		};
		
		//ONCONTEXTMENU elencoCDCsel
		document.getElementById('elencoCDCsel').oncontextmenu=function(){
			edit = true;
			add_selected_elements('elencoCDCsel', 'elencoCDC', true, 0);
			sortSelect('elencoCDC'); 
		};
		
		//ONDBLCLICK elencoCDCsel
		document.getElementById('elencoCDCsel').ondblclick=function(){
			edit = true;
			add_selected_elements('elencoCDCsel', 'elencoCDC', true, 0);
			sortSelect('elencoCDC'); 
		};
	}
}


/*VIENE RICHIAMATA DAL BOTTONE DI RICERCA*/
function Ricerca(txt){
	
	var query_elenco_cdc = setWhereCond('elencoCDC');
	var combo = jQuery("[name=radioDescr]:checked").val();
	
	if(txt != null){
		if (combo  == 'descr') { 
			query_elenco_cdc += " AND upper(DESCR) like '%"+txt+"%'";
		}else{
			query_elenco_cdc += " AND cod_cdc like '%"+txt+"%'";	
		}
	}
	
	_filtro_list_elenco.setWhereBaseQuery(query_elenco_cdc);
	_filtro_list_elenco.searchListRefresh();
}

//Carica i reparti associati all'utente
function caricaElenchi()
{	
	_filtro_list_elenco = new FILTRO_QUERY("elencoCDC", null);
	_filtro_list_elenco.setValueFieldQuery("COD_CDC");
	_filtro_list_elenco.setDescrFieldQuery("DESCR ||' - '||'       ( '||COD_CDC||' )'");
	_filtro_list_elenco.setFromFieldQuery("RADSQL.CENTRI_DI_COSTO");
	_filtro_list_elenco.setWhereBaseQuery(setWhereCond("elencoCDC"));
	_filtro_list_elenco.setOrderQuery("DESCR ASC");
	_filtro_list_elenco.searchListRefresh();
	
	_filtro_scelte = new FILTRO_QUERY("elencoCDCsel", null);
	_filtro_scelte.setValueFieldQuery("COD_CDC");
	_filtro_scelte.setDescrFieldQuery("DESCR ||' - '||'       ( '||COD_CDC||' )'");
	_filtro_scelte.setFromFieldQuery("RADSQL.CENTRI_DI_COSTO");
	_filtro_scelte.setWhereBaseQuery(setWhereCond("elencoCDCsel"));
	_filtro_scelte.setOrderQuery("DESCR ASC");
	_filtro_scelte.searchListRefresh();
}

function setWhereCond(name)
{
	var query_elenco_cdc = "";
	var centri_di_costo = "";
	switch (name) {
	case 'elencoCDC':
		centri_di_costo = "'"+(form.cdc_scelti.join("','"))+"'";
        query_elenco_cdc=" ATTIVO='S'";
		if (centri_di_costo != "''") {
			query_elenco_cdc += " and cod_cdc not in (" + centri_di_costo + ")";
		}
		break;
	case 'elencoCDCsel':
		centri_di_costo = "'"+(form.cdc_visibili.join("','"))+"'";
		query_elenco_cdc=" 1=1"; // voglio poter vedere anche eventuali CDC dismessi (ATTIVO = 'N' OR ATTIVO = 'S')
		query_elenco_cdc += " and cod_cdc in (" + centri_di_costo + ")";
		break;
	default:
		alert('Impossibile trovare l\'elenco "'+ name +'".');
	}
	return query_elenco_cdc;
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


function chiudiScheda(){
	
	if (edit) {
		if (confirm('Attenzione! Tutte le eventuali modifiche effettuate non saranno salvate.\n\nProcedere ugualmente?')) {
			parent.$.fancybox.close();
		}
	} else { 
		parent.$.fancybox.close();
	}
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


function registraCDC(){
	
	var doc = document.dati;	
    var i=0;
    var labels=[];

    doc.hRic.value = '';

    while(i != doc.elencoCDCsel.length) {
      doc.hRic.value += doc.elencoCDCsel.options[i].value + '*';
            
      labels[doc.elencoCDCsel.options[i].value] = doc.elencoCDCsel.options[i].innerText;
      i++;
    }

    if(doc.hRic.value == ''){
		
       alert('Prego, associare almeno un centro di costo.');
       return;
    }
	
	parent.setCdc = true;
	parent.frm_generale.hsetCdc.value = true;
	parent.GESTIONE_UTENTI.aggiornaCDC(doc.hRic.value, labels);
    
	parent.$.fancybox.close();
}


