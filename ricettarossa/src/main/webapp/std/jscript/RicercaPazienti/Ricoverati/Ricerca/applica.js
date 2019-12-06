/*
 * Start RICERCA ANAGRAFICA per COGNOME, NOME E DATA DI NASCITA 
 * dalla gestione del reparto
*/
function ricercaCognNomeDataReparto(numero_pagina)
{
	var doc = document.form_pag_ric;
	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';
	
	//doc.provenienza.value = 'consultazione_anagrafica';
	
	doc.hidcampo0.value = doc.COGN.value;

	if(numero_pagina == '-100'){
		doc.hidWhere.value = "where iden = '-100'";		
		doc.submit();		
	}
	else
	{
		if(numero_pagina != '')
			doc.pagina_da_vis.value = numero_pagina;
		
		doc.COGN.value = doc.COGN.value.toUpperCase();
		doc.NOME.value = doc.NOME.value.toUpperCase();
	
		if(controllo_cognomeCNDR())
		{
			doc.hidWhere.value = "where cogn like '" + raddoppia_apici(doc.COGN.value) + "%'";
		
			if(doc.NOME.value != '')
				doc.hidWhere.value += " and nome like '" + raddoppia_apici(doc.NOME.value) + "%'";
		
			if(doc.DATA.value != '')
				doc.hidWhere.value += " and data like '" + doc.DATA.value + "'";
			
			doc.hidOrder.value = "order by cogn, nome, dataorder";
	
			doc.submit();
	
			parent.parent.hideFrame.apri_attesa();
		}
	}
}



/**
*/
function controllo_cognomeCNDR()
{
	var ricerca = false;
	var doc = document.form_pag_ric;
	
	if(doc.DATA.value != '')
	{
		ricerca = true;
	}
	else
	{	
		doc.COGN.value = replace_stringa(doc.COGN.value, "'");
		doc.NOME.value = replace_stringa(doc.NOME.value, "'");
		
		//alert('RES: ' + doc.cogn.value);return;
		
		for(i = 0; i < doc.COGN.value.length; i++)
			if(doc.COGN.value.substring(i, i+1) == '_')
			{
				alert(ritornaJsMsg('alert_underscore'));
				doc.COGN.value == '';
				ricerca = false;
				return;
			}
	
		if(doc.COGN.value == '' 														 || 
		   doc.COGN.value.length < 2 													 || 
		  (doc.COGN.value.substring(0,1) == '%' && doc.COGN.value.substring(1,2) == '%'))																																						
		{
			if(doc.COGN.value.substring(0,1) == '%' && doc.COGN.value.substring(1,2) == '%')
			{
				alert(ritornaJsMsg('alert_%'));
				if(document.getElementById('div').style.display != 'none')
					doc.COGN.focus();
				
				doc.COGN.value = '';
				ricerca = false;
				return;
			}
			else
			{
				if(doc.COGN.value == '' || doc.COGN.value.length < 2)
				{
					alert(ritornaJsMsg('alert_cogn'));
					if(document.getElementById('div').style.display != 'none')
						doc.COGN.focus();
					
					doc.COGN.value = '';
					ricerca = false;
					return;
				}
				ricerca = true;
			}
		}
		else
		{
			ricerca = true;
		}
	}
	return ricerca;
}



/**
*/	
function apriChiudiCNDR(){
	ShowHideLayer('div');

	if(parent.document.all.oFramesetRicercaPaziente.rows == "141,*,0,0")
	{
    	parent.document.all.oFramesetRicercaPaziente.rows = "50,*,0,0";
	}
	else
	{
        parent.document.all.oFramesetRicercaPaziente.rows = "141,*,0,0";
    }	
}


/**
*/
function tastiCNDR()
{
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaCognNomeDataReparto();
 	}
}


/**
*/	
function resettaDatiCNDR()
{
	var doc = document.form_pag_ric;
	
	doc.COGN.value = '';
	doc.NOME.value = '';
	doc.DATA.value = '';
	if(document.getElementById('div').style.display != 'none')
		doc.COGN.focus();
}

/*end RICERCA ANAGRAFICA per COGNOME, NOME, E DATA DI NASCITA*/



/*
 * Start RICERCA ANAGRAFICA dei RICOVERATI
 */
function ricercaRicoverati(numero_pagina)
{

	var happlicativo = null;
	var doc = document.form_pag_ric;
	doc.action = 'SL_RicPazWorklist';
	doc.target = 'RicPazWorklistFrame';
	doc.method = 'POST';
	
	doc.provenienza.value = 'consultazione_per_ricoverati';
	
	doc.hidcampo0.value = doc.cogn.value;
	doc.hidWhere.value = '';
	doc.hidOrder.value = '';
	
	happlicativo = document.createElement("input");
	happlicativo.type = 'hidden';
	happlicativo.name = 'applicativo';
	happlicativo.value = 'WHALE';
	doc.appendChild(happlicativo);

	if(numero_pagina == '-100' || numero_pagina == '0'){
		if(numero_pagina == '-100')
			doc.hidWhere.value = "where iden = '-100'";		
		else{
			if(trim(doc.hcdc.value) != '')
				doc.hidWhere.value = "where codice_reparto in (" + trim(doc.hcdc.value) + ")";
			else
				doc.hidWhere.value = "where codice_reparto in ('" + baseUser.LISTAREPARTIUTENTECODDEC.toString().replace(/\,/g, "','") + "')";
		}
			
		doc.hidWhere.value += " and iden_per = " + baseUser.IDEN_PER;
		
		doc.hidOrder.value = "order by cogn, nome, dataorder";	
		doc.submit();		
	}
	else
	{
		if(numero_pagina != '')
			doc.pagina_da_vis.value = numero_pagina;

		doc.cogn.value = doc.cogn.value.toUpperCase();
		doc.nome.value = doc.nome.value.toUpperCase();
		doc.nosologico.value = doc.nosologico.value.toUpperCase();
	
		if(doc.cogn.value != ''){
			if(controllo_cognomeRicoverati())
			{	
				doc.hidWhere.value = "where cogn like '" + raddoppia_apici(doc.cogn.value) + "%'";
			
				if(doc.nome.value != '')
					doc.hidWhere.value += " and nome like '" + raddoppia_apici(doc.nome.value) + "%'";
			
				if(doc.DATA.value != '')
					doc.hidWhere.value += " and data like '" + doc.DATA.value + "'";
					
				if(doc.nosologico.value != '')
					doc.hidWhere.value += " and NUMERO_NOSOLOGICO like '" + doc.nosologico.value + "'";	
			}
		}
		else{
			if(doc.nome.value != ''){
				doc.hidWhere.value += " where nome like '" + raddoppia_apici(doc.nome.value) + "%'";
				
				if(doc.DATA.value != '')
					doc.hidWhere.value += " and data_nascita like '" + doc.DATA.value + "'";
					
				if(doc.nosologico.value != '')
					doc.hidWhere.value += " and NUMERO_NOSOLOGICO like '" + doc.nosologico.value + "'";		
			}
			else
				if(doc.DATA.value != ''){
					doc.hidWhere.value += " where data_nascita like '" + doc.DATA.value + "'";
					
					if(doc.nosologico.value != '')
						doc.hidWhere.value += " and NUMERO_NOSOLOGICO like '" + doc.nosologico.value + "'";		
				}
				else
					if(doc.nosologico.value != '')
						doc.hidWhere.value = "where NUMERO_NOSOLOGICO like '" + raddoppia_apici(doc.nosologico.value) + "%'";			
		}



		if(trim(doc.hcdc.value) != ''){
			if(doc.hidWhere.value == '')
				doc.hidWhere.value = " where codice_reparto in (" + trim(doc.hcdc.value) + ")";
			else
				doc.hidWhere.value += " and codice_reparto in (" + trim(doc.hcdc.value) + ")";
		}
		else{
			if(doc.hidWhere.value == '')
				doc.hidWhere.value = " where codice_reparto in ('" + baseUser.LISTAREPARTIUTENTECODDEC.toString().replace(/\,/g, "','") + "')";
			else
				doc.hidWhere.value += " and codice_reparto in ('" + baseUser.LISTAREPARTIUTENTECODDEC.toString().replace(/\,/g, "','") + "')";
		}

		
		if(doc.stanza.value != '')
			doc.hidWhere.value += " and stanza like '" + doc.stanza.value + "%'" ;
		if(doc.letto.value != '')
			doc.hidWhere.value += " and letto like '" + doc.letto.value + "%'" ;	

		
		doc.hidWhere.value += " and iden_per = " + baseUser.IDEN_PER;

		doc.hidOrder.value = "order by cogn, nome, dataorder";

		doc.submit();			
	}
	
	//alert('WHERE: \n' + doc.hidWhere.value);
	
	salvaProvenienzeUtente();
	
	parent.parent.hideFrame.apri_attesa();
}


function salvaProvenienzeUtente(){
	//var text = doc.FilUrgenze.value + '@' + doc.hMetodica.value + '@' + doc.hCdc.value + '@' + provenienza;
	//text +=  '@' + doc.hSale.value + '@' + doc.FilMed.value + '@' + doc.txtDaData.value + '@' + doc.txtAData.value;
	//text +=  '@' + doc.hstato_iden.value + '@';
	
	var text = ' @ @'+document.form_pag_ric.hcdc.value+' @ @ @ @ @ @ @ ';

	dwr.engine.setAsync(false);
	CJsUpdTabFiltri.updateFiltri(text, cbksalvaProvenienzeUtente);/* parametro per la funzione java + callback */
	dwr.engine.setAsync(true);
}

function cbksalvaProvenienzeUtente(messaggio){
	//alert('cbksalvaProvenienzeUtente: ' + messaggio);
}


/**
	
*/
function resettaDatiRicoverati()
{
	var doc = document.form_pag_ric;
	
	doc.cogn.value = '';
	doc.nome.value = '';
	doc.DATA.value = '';
	doc.nosologico.value = '';
	doc.letto.value = '';
	doc.stanza.value = '';
	
	if(document.getElementById('div').style.display != 'none')
		doc.cogn.focus();
}


/**
	
*/
function apriChiudiRicoverati(){
	ShowHideLayer('div');

	if(parent.document.all.oFramesetRicercaPaziente.rows == "140,*,0,0")
	{
    	parent.document.all.oFramesetRicercaPaziente.rows = "50,*,0,0";
	}
	else
	{
        parent.document.all.oFramesetRicercaPaziente.rows = "140,*,0,0";
    }	
}


/**
	
*/
function tastiRicoverati(){
	if (window.event.keyCode==13)
	{
     	window.event.keyCode = 0;
     	ricercaRicoverati();
 	}
}

/**
	
*/
function controllo_cognomeRicoverati()
{
	var ricerca = false;
	var doc = document.form_pag_ric;
	
	if(doc.DATA.value != '')
	{
		ricerca = true;
	}
	else
	{	
		doc.cogn.value = replace_stringa(doc.cogn.value, "'");
		doc.nome.value = replace_stringa(doc.nome.value, "'");
		
		//alert('RES: ' + doc.cogn.value);return;
		
		for(i = 0; i < doc.cogn.value.length; i++)
			if(doc.cogn.value.substring(i, i+1) == '_')
			{
				alert(ritornaJsMsg('alert_underscore'));
				doc.cogn.value == '';
				ricerca = false;
				return;
			}
	
		if(doc.cogn.value == '' 														 || 
		   doc.cogn.value.length < 2 													 || 
		  (doc.cogn.value.substring(0,1) == '%' && doc.cogn.value.substring(1,2) == '%'))																																						
		{
			if(doc.cogn.value.substring(0,1) == '%' && doc.cogn.value.substring(1,2) == '%')
			{
				alert(ritornaJsMsg('alert_%'));
				if(document.getElementById('div').style.display != 'none')
					doc.cogn.focus();
				
				doc.cogn.value = '';
				ricerca = false;
				return;
			}
			else
			{
				/*if(doc.cogn.value == '' || doc.cogn.value.length < 2)
				{
					alert(ritornaJsMsg('alert_cogn'));
					if(document.getElementById('div').style.display != 'none')
						doc.cogn.focus();
					
					doc.cogn.value = '';
					ricerca = false;
					return;
				}*/
				ricerca = true;
			}
		}
		else
		{
			ricerca = true;
		}
	}
	return ricerca;
}


/*end RICERCA ANAGRAFICA dei RICOVERATI*/


