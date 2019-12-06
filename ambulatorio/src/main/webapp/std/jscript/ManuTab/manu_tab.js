function apri_chiudi()
{
	var righe = 133;
	var frameClose = 50;
	
	if(document.form_ricerca.procedura.value == 'T_WEB')
		righe = 105;
	if(document.form_ricerca.procedura.value == 'T_PC')
		righe = 80;		
	
    if (parent.document.all.oFramesetManu_Tab.rows == righe + ",*")
	{
    	parent.document.all.oFramesetManu_Tab.rows = frameClose + ",*";
    }
    else
	{
        parent.document.all.oFramesetManu_Tab.rows = righe + ",*";
    }
}

function raddoppia_apici(value){
	var stringa = value.replace(/\'/g, "\'\'");
	return stringa;
}


function setInizio()
{
	var doc = document.form_ricerca;
	doc.ricerca.focus();

	if(doc.procedura.value != 'T_PC')
	{
		//doc.attivo[2].checked = 1;
		doc.attivo[0].checked = 1;
		doc.hattivo.value = 'S';
	}

	/*if(doc.procedura.value == 'T_SALE' || doc.procedura.value == 'T_MAC' || doc.procedura.value == 'T_ARE')
	{
		doc.attivo[0].checked = 1;
		doc.hattivo.value = 'S';
	}*/
				
	if(doc.procedura.value != 'T_PC' && doc.procedura.value != 'T_WEB')
		doc.tipo_ricerca[0].checked = 1;
}


function sendCampi()
{
	var doc = document.form_ricerca;

	if(doc.procedura.value != 'T_PC')
	{			
		if(doc.hattivo.value == '' && doc.attivo[2].checked != 1)
			doc.attivo[0].checked = 1;

		doc.hattivo.value = '';
		if(doc.attivo[0].checked)
			doc.hattivo.value = "S";
		if(doc.attivo[1].checked)
			doc.hattivo.value = "N";	
	}
	
	doc.hricerca.value = raddoppia_apici(doc.ricerca.value);
	doc.hricerca.value = doc.hricerca.value + '%';
}

/*
	Funzione richiamata dal frame worklist per visualizzare l'ultimo record
	inserito o modificato
*/
function put_last_value(ricerca)
{
	document.form_ricerca.ricerca.value = ricerca;
	document.form_ricerca.hricerca.value = ricerca.replace("\'", "\'\'");

	if(document.form_ricerca.procedura.value != 'T_WEB' && document.form_ricerca.procedura.value != 'T_PC')
		document.form_ricerca.ricerca.value = document.form_ricerca.ricerca.value.toUpperCase();	
		
	document.form_ricerca.target = "Worklist";	
	document.form_ricerca.action = "SL_Manu_Tab_Worklist?procedura="+document.form_ricerca.procedura.value;
    document.form_ricerca.submit();
}



//********************                FUNZIONE RICERCA
function ricerca(numero_pagina)
{
	if(numero_pagina != '')
		document.form_ricerca.pagina_da_vis.value = numero_pagina;
    if(document.form_ricerca.procedura.value != 'T_WEB' && document.form_ricerca.procedura.value != 'T_PC')
		document.form_ricerca.ricerca.value = document.form_ricerca.ricerca.value.toUpperCase();
	document.form_ricerca.target = "Worklist";
	
	document.form_ricerca.action = "SL_Manu_Tab_Worklist?procedura="+document.form_ricerca.procedura.value;
	
	if (document.form_ricerca.context_menu_in.value!='')
		{
		document.form_ricerca.action =document.form_ricerca.action +"&context_menu_in="+document.form_ricerca.context_menu_in.value;
		}
	if(document.form_ricerca.procedura.value == 'T_PRO')
		{
		document.form_ricerca.action =document.form_ricerca.action +"&context_menu_in=T_PRO";
		}
	sendCampi();
	
	
	if(document.form_ricerca.procedura.value == 'T_AREE_PROVENIENZE')
		document.form_ricerca.where_cond_aree_prov.value = ' and iden in (select iden_pro from TAB_AREE_PROVENIENZE where iden_sal = ' + document.form_ricerca.iden_sala.value + ' and iden_mac = ' + document.form_ricerca.iden_mac.value + ' and iden_are = ' + document.form_ricerca.iden_area.value + ') AND IDEN_ARE = ' + document.form_ricerca.iden_area.value;
	
	
	//alert(document.form_ricerca.where_cond_aree_prov.value);
	
    document.form_ricerca.submit();
}
        
        
//********************                FUNZIONE INTERCETTA TASTI
function intercetta_tasti(){
	if (window.event.keyCode==13)
	{
		document.form_ricerca.ricerca.value = replace_stringa(document.form_ricerca.ricerca.value, "'");
		//raddoppia_apici(document.form_ricerca.ricerca.value);
		if(document.form_ricerca.ricerca.value == '') 
			ricerca();
        else
		{
        	if(document.form_ricerca.procedura.value != 'T_WEB' && document.form_ricerca.procedura.value != 'T_PC')
				document.form_ricerca.ricerca.value = document.form_ricerca.ricerca.value.toUpperCase();
			document.form_ricerca.target = "Worklist";	
			document.form_ricerca.action = "SL_Manu_Tab_Worklist?procedura="+document.form_ricerca.procedura.value;
			sendCampi();
            document.form_ricerca.submit();
        } 
    }
}
    
	
//********************                FUNZIONE RESETTA
function resetta()
{ 
	document.form_ricerca.ricerca.value = '';
    if(document.form_ricerca.procedura.value != 'T_PC')
	{
    	document.form_ricerca.attivo[0].checked = 1;
		//document.form_ricerca.attivo[2].checked = 1;//document.form_ricerca.hattivo.value = '';
    }
	
	/*if(document.form_ricerca.procedura.value == 'T_SALE' || document.form_ricerca.procedura.value == 'T_MAC' || document.form_ricerca.procedura.value == 'T_ARE') 
	{
    	document.form_ricerca.attivo[0].checked = 1;//document.form_ricerca.hattivo.value = '';
    }*/
	
    if(document.form_ricerca.procedura.value != 'T_WEB' && document.form_ricerca.procedura.value != 'T_PC')
	{
    	document.form_ricerca.tipo_ricerca[0].checked = 1;
    }
	
    if(document.getElementById('div').style.display != 'none')
		document.form_ricerca.ricerca.focus();
}
