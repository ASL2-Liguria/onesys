/*
function ricaricaDati(){

var tipoTipologia='';	
var tipoSintomi='';	

	if(document.all.chkSceltaTipo(0).checked){
		tipoTipologia='cmbTipologia_allergia';
		tipoSintomi='elencoSintomi_allergia';
	}
	else if(document.all.chkSceltaTipo(1).checked){
		tipoTipologia='cmbTipologia_intolleranza';
		tipoSintomi='elencoSintomi_intolleranza';
	}
	else if(document.all.chkSceltaTipo(2).checked){
		tipoTipologia='cmbTipologia_reazione';
		tipoSintomi='elencoSintomi_reazione';
	
	}
		
	var sql="select iden,descrizione from radsql.tab_codifiche  where tipo_scheda='SCELTA_ALLERGIE_INTOLLERANZE' and tipo_dato='" + tipoTipologia +"' order by ordine";

	dwr.engine.setAsync(false);			
	toolKitDB.getListResultData(sql, creaOptTipologia);			
	dwr.engine.setAsync(true);
	
	
	var sql="select iden,descrizione from radsql.tab_codifiche  where tipo_scheda='SCELTA_ALLERGIE_INTOLLERANZE' and tipo_dato='" + tipoSintomi +"' order by ordine";

	dwr.engine.setAsync(false);			
	toolKitDB.getListResultData(sql, creaOptSintomi);			
	dwr.engine.setAsync(true);


}


function clearlistbox(lb){
	  for (var i=lb.options.length-1; i>=0; i--){
	    lb.options[i] = null;
	  }
	  lb.selectedIndex = -1;
	}

function creaOptSintomi(elenco){
	// alert('Risultato query dwr: \n\n' +elenco);
	var Listbox=document.getElementById('elencoSintomi');
	arrayOpt=new Array();

	clearlistbox(Listbox);
	clearlistbox(document.getElementById('elencoSintomiSel'));
	
	var oOpt = document.createElement('Option');
	
	for (i=0;i<elenco.length; i++){
	oOpt = document.createElement('Option');
		
		
		oOpt.value = elenco[i][0];
		oOpt.text = elenco[i][1];
		
	 Listbox.add(oOpt);		
		}
	}

function creaOptTipologia(elenco){
	// alert('Risultato query dwr: \n\n' +elenco);
	
	var Listbox=document.getElementById('cmbTipologia');
	arrayOpt=new Array();

	clearlistbox(Listbox);
	
	var oOpt = document.createElement('Option');
	Listbox.add(oOpt);
	
	for (i=0;i<elenco.length; i++){
	oOpt = document.createElement('Option');
		
		
		oOpt.value = elenco[i][0];
		oOpt.text = elenco[i][1];
		
	 Listbox.add(oOpt);		
		}
	}

*/

function chiudiAllergieIntolleranze(){
/*	var iden_anag;
	var stato_pagina;
	try{
		iden_anag=opener.parent.document.EXTERN.IDEN_ANAG.value;	
		stato_pagina=opener.parent._STATO_PAGINA;
	}
	catch(e){
		iden_anag=parent.opener.parent.document.EXTERN.IDEN_ANAG.value;
		stato_pagina=parent.opener.parent._STATO_PAGINA;
	}
	url="servletGenerator?KEY_LEGAME=WK_ALLERTE&WHERE_WK= where TIPO IN ('ALLERGIA','INTOLLERANZA','REAZIONE_AVVERSA') AND IDEN_ANAG="+iden_anag;
	if(stato_pagina=='L')
	url+='&CONTEXT_MENU=WK_ALLERTE_LETTURA';
	try{
	opener.parent.document.getElementById('frameWkAllerte').src=url;
	self.close();
	
	}
	catch(e){
		parent.opener.parent.document.getElementById('frameWkAllerte').src=url;
		parent.self.close();
	}*/
	
//	$('iframe#frameWkAllerte',parent.document)[0].contentWindow.location.reload();
//	parent.$.fancybox.close(); 
	WindowCartella.CartellaPaziente.refresh.avvertenze.paziente();
	parent.aggiornaOpener();
		
	
}

function registraScheda(){
	registra();
}

function callbackregistrazione(){
    var idenAllerta= '';
    var rs = WindowCartella.executeStatement('anamnesi.xml','getIdenAllertaInserita',[baseUser.IDEN_PER,document.EXTERN.IDEN_VISITA.value],1);
    if(rs[0]=='KO'){
        return alert(rs[0] + '\n' + rs[1]);
    }else{
        idenAllerta  = rs[2];
    }

    switch(parent.parent.name) {
        case 'ANAMNESI': case '36_SETTIMANA':
            var iden_anag = WindowCartella.getPaziente("IDEN");
            var iden_visita = WindowCartella.getAccesso("IDEN");
            if (parent.parent.NS_ANAMNESI.importaAllergieIdenPaziente === Number(iden_anag)) {
                rs = WindowCartella.executeStatement('anamnesi.xml','duplicaAllerte',[idenAllerta, baseUser.IDEN_PER, iden_visita, iden_anag],0);
                if(rs[0]=='KO'){
                    return alert(rs[0] + '\n' + rs[1]);
                }
			    parent.parent.NS_ANAMNESI.importaAllergieIdenPaziente = null;
			}
            // break;
        case 'QUESTIONARIO_ANAMNESTICO':
            var hidden = parent.parent.$('#hArrayAllergie');
            hidden.val(hidden.val() +  (hidden.val() != '' ? ',' : '' ) + idenAllerta);
            break;
        default:
    }
}

jQuery(document).ready(function(){
	
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
	
	jQuery('#txtNota').addClass("expand");
	jQuery("textarea[class*=expand]").TextAreaExpander();
	
	try{
    	parent.document.getElementById('scheda').height=$(document).height()+5;
	}
	catch(e){

    }
	 /*  if (_STATO_PAGINA == 'L'){
		   document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
		}*/
	}
);

	
