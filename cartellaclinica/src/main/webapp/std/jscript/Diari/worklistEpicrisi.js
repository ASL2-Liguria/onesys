/**
 * Javascript in uso dalla worklist Epicrisi della pagina DIARI.
 */

var WindowCartella = null;
$(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
	if (baseUser.ATTIVA_NUOVA_WORKLIST == 'S'){
			$().callJSAfterInitWorklist('initEpicrisi()');
	} else{
			 $('table#oTable tr>td:nth-child(5)[title!="Cancellato: N"]').parent().addClass('gray');
	}
    try {
    	parent.$('div[name=frameDiari], div[name=frameSecondario]').remove();
    	parent.removeVeloNero('frameSecondario');
    } catch (e) {}
});

function initEpicrisi(){
	$('table#oTable tr>td>div[class="colorDelete"]').parent().parent().addClass('colorDelete').removeClass('clsOdd');
}

function concatenaEpicrisi(){

	var testo='';
	for (indice in array_testo) {
		  testo+='<table id=tableConcatDiari width="100%"><tr><th>'+array_ute_inserimento[indice]+' '+array_data_evento[indice]+' '+array_ora_evento[indice]+'</th></tr><tr><td>'+array_testo[indice]+'</td></tr></table>';
		  testo+='<HR size="3" width="45" color="red">';
		 // testo+=array_ute_registrazione[indice];
		 // testo+='utente inserimento:';
		 // testo+=array_testo[indice];
	 }
	 parent.showDialog('Visualizza Epicrisi',testo,'success');
 }

function controllaData(range) {
	var data = clsDate.str2date(stringa_codici(array_data_reg),'DD/MM/YYYY',stringa_codici(array_ora_reg));
	
    var check = clsDate.dateCompare(data, new Date(), range);
    switch(check) {
    	case 1:
    		alert("Attenzione: operazione non consentita poiché mancano ancora più di "+range.top+" ore alla data di inserimento del diario");
			return false;
    	case -1:
    		alert("Attenzione: operazione non consentita poiché sono trascorse più di "+range.down+" ore dalla data di inserimento del diario");
    		return false;
    	case 0: default: // data valida
    }
    return true;
}


function InserisciEpicrisi()
{
	var nome = getKeyLegame();

	var vDati = {};
	try {
		vDati = WindowCartella.getForm(document);
	} catch(e) {
		vDati['iden_visita'] = stringa_codici(array_iden_visita);
		vDati['iden_ricovero'] = '';
		vDati['reparto'] = stringa_codici(array_reparto_di_ricovero);
	}
	if(vDati['iden_visita'] == '' || vDati['reparto'] == ''){
		return alert('Attenzione: effettuare una selezione');
	}
	
    var tipoDiario = null;
    switch (parent.document.EXTERN.KEY_TIPO_DIARIO.value) {
        case 'MEDICO': case 'M':
        	if(parent.baseUser.TIPO != 'M'){ return alert('Funzionalità riservata al personale medico');}
        	tipoDiario = 'EPICRISI';
            break;
        case 'INFERMIERE': case 'I':
            if(parent.baseUser.TIPO!='I'){ return alert('Funzionalità riservata al personale infermieristico');}
        	tipoDiario = 'EPICRISI_INF';
            break;
        case 'RIABILITATIVO':
            if (parent.baseUser.TIPO!='L' && parent.baseUser.TIPO!='F'){ return alert('Funzionalità riservata ai logopedisti o fisioterapisti');}
            if (parent.baseUser.TIPO == 'L') {
            	tipoDiario = 'EPICRISI_LOG';
            }
            else if (parent.$.inArray("ROBOTICA", parent.baseUser.ATTRIBUTI) > -1) {
            	tipoDiario = 'EPICRISI_ROB';
            }
            else {
            	tipoDiario = 'EPICRISI_FIS';
            }
            break;
        default:
        	return alert('Funzionalità non abilitata');
    }
	var url = 'servletGenerator?KEY_LEGAME=' + nome + '&KEY_ID=0&KEY_TIPO_DIARIO='+tipoDiario+'&KEY_IDEN_VISITA='+(vDati.iden_visita != '' ? vDati.iden_visita : vDati.iden_ricovero);
//	servlet += '&KEY_TIPO_DIARIO='+tipoDiario;
	url += '&REPARTO='+vDati.reparto;
	url += '&FUNZIONE='+nome;
	parent.$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 580,
		'href'		: url,
		'type'		: 'iframe',
		'showCloseButton':false
	});
}

function getKeyLegame() {
	var nome=null;
	switch(document.EXTERN.TIPO_WK.value) {
		case 'WK_EPICRISI':	nome='SCHEDA_EPICRISI'; break;
		case 'WK_DIETA' : nome='SCHEDA_DIETA'; break;
		default: alert("Inserimento non previsto"); throw new Error("getKeyLegame: case not found");
	}
	return nome;
};

function ModificaEpicrisi(){

	if (stringa_codici(array_deleted)=="S"){
		 return alert('Attenzione: scheda cancellata');
	}

	//il diario può essere modificato solamente dall'utente che lo ha inserito
	if (stringa_codici(array_ute_registrazione)!=baseUser.IDEN_PER){
		return alert("Modifica consentita solo all'utente che ha inserito l'epicrisi");
	}
	
	var vDati = {};
	try {
		vDati = WindowCartella.getForm(document);
	} catch(e) {
		vDati['reparto'] = stringa_codici(array_reparto_di_ricovero);
	}
	if(vDati['reparto'] == ''){
		return alert('Attenzione: effettuare una selezione');
	}
	
	var range;
	try {
		range = parent.config.tipi[parent.document.EXTERN.KEY_TIPO_DIARIO.value].modifica.range;
	} catch(e) {
		range = {down: null, top: null}; // controllo sulla data disabilitato
	}
	var res = controllaData(range);
	if(res==true){
		var nome = getKeyLegame();
        var tipoDiario = null;
        switch (parent.document.EXTERN.KEY_TIPO_DIARIO.value) {
            case 'MEDICO': case 'M':
                tipoDiario = 'EPICRISI'; 
                break;
            case 'INFERMIERE': case 'I':
                tipoDiario = 'EPICRISI_INF'; 
                break;
            case 'RIABILITATIVO':
                if (parent.baseUser.TIPO == 'L') {
                    tipoDiario = 'EPICRISI_LOG';
                }
                else if (parent.$.inArray("ROBOTICA", parent.baseUser.ATTRIBUTI) > -1) {
                    tipoDiario = 'EPICRISI_ROB';
                }
                else {
                    tipoDiario = 'EPICRISI_FIS';
                }
                break;
            default:
            	return alert('Funzionalità non abilitata');
        }
		var iden_epicrisi = stringa_codici(array_iden_diario);
	
		if(iden_epicrisi == ''){
			return alert('Attenzione: effettuare una selezione');
		}
		//var vDati = top.getForm(document);
		var url = "servletGenerator?KEY_LEGAME=" + nome + "&KEY_ID="+iden_epicrisi+'&KEY_TIPO_DIARIO='+tipoDiario;
		url += '&REPARTO='+vDati.reparto;
		url += '&FUNZIONE='+nome;
	    url += '&MODIFICA=S';
	    parent.$.fancybox({
			'padding'	: 3,
			'width'		: 1024,
			'height'	: 580,
			'href'		: url,
			'type'		: 'iframe',
			'showCloseButton':false
		});
	}
}

function cancellaEpicrisi(){
	var iden_diario  = stringa_codici(array_iden_diario);
	//mi prendo l'indice dell'array dei dati relativi al tipo diario aperto

	if (stringa_codici(array_deleted)=="S"){
		return alert('Attenzione: epicrisi già cancellata');
	}
	if(iden_diario == ''){
		return alert('Attenzione:effettuare una selezione');
	}
	if (stringa_codici(array_ute_registrazione)!=baseUser.IDEN_PER){
		return alert("Cancellazione consentita solo all'utente che ha inserito l'epicrisi ");
	}

	var range;
	try {
		range = parent.config.tipi[parent.document.EXTERN.KEY_TIPO_DIARIO.value].cancellazione.range;
	} catch(e) {
		range = {down: null, top: null}; // controllo sulla data disabilitato
	}
	// Vecchio Controllo per la Cancellazione - la Data di Registrazione Non Poteva essere Inferiore SYSDATE - 12H
	//var res = controllaData(range);
	var res = true;
	if(res==true){
		var url = 'motivoCancellazione.html';
		$.fancybox({
			'padding'	: 3,
			'width'		: 750,
			'height'	: 110,
			'href'		: url,
			'type'		: 'iframe',
			'showCloseButton':false
		});
	}
}

function cancellaRecord(vMotivazione){
	var iden_diario  = stringa_codici(array_iden_diario);
	var pBinds = new Array();

	pBinds.push(iden_diario);
	pBinds.push(vMotivazione);

    WindowCartella.dwr.engine.setAsync(false);
    WindowCartella.dwrUtility.executeStatement('diari.xml','cancellaDiarioEpicrisi',pBinds,0,callBack);
    WindowCartella.dwr.engine.setAsync(true);

	function callBack(resp){
		if(resp[0]=='KO'){
			alert(resp[1]);
		}
		else
		{
			document.location.reload();
		}
		parent.$.fancybox.close();
	}
}


/*funzione di stampa*/
/*function stampaDiarioMedico(){
	var vDati	  = top.getForm(document);
	var sf		  = '&prompt<pVisita>='+top.FiltroCartella.getIdenRiferimento(top.getForm(document));;
	var anteprima = 'S';
	var reparto   = vDati.reparto;
	var funzione;
	if(parent.document.EXTERN.KEY_TIPO_DIARIO.value =='MEDICO')
	{
		funzione = 'DIARIO_MEDICO';
		if(parent.baseUser.TIPO!='M'){
			alert('Funzionalità riservata al personale medico');
			return;
		}
	}

	if(parent.document.EXTERN.KEY_TIPO_DIARIO.value=='INFERMIERE')
	{
		funzione = 'DIARIO_INFERMIERISTICO';
		if(parent.baseUser.TIPO!='I'){
			alert('Funzionalità riservata al personale infermieristico');
			return;
		}
	}

	if(parent.document.EXTERN.KEY_TIPO_DIARIO.value=='TECNICO')
	{
		funzione = 'DIARIO_TECNICO';
		if(parent.baseUser.TIPO!='T'){
			alert('Funzionalità riservata al personale tecnico');
			return;
		}
	}


	top.confStampaReparto(funzione,sf,anteprima,reparto,null);
}*/

function VisualizzaEpicrisi(){

	var nome = getKeyLegame();
	var iden_diario = stringa_codici(array_iden_diario);

	var vDati = {};
	try {
		vDati = WindowCartella.getForm(document);
	} catch(e) {
		vDati['reparto'] = stringa_codici(array_reparto_di_ricovero);
	}
	if(vDati['reparto'] == '' || iden_diario == ''){
		return alert('Attenzione: effettuare una selezione');
	}

	var url = "servletGenerator?KEY_LEGAME=" + nome + "&KEY_ID="+iden_diario+'&KEY_TIPO_DIARIO=EPICRISI';
	url += '&REPARTO='+vDati.reparto;
	url += '&FUNZIONE='+nome;
	url += '&LETTURA=S';
	parent.$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 580,
		'href'		: url,
		'type'		: 'iframe',
		'showCloseButton':false
	});
}

// ridefinisce le funzioni di ordinamento
setManualAscOrder = function(campo) {
	if (typeof parent.applica_filtro!='undefined'){
		parent._WK_ORDINA_CAMPO = campo + ' asc';
		parent.applica_filtro('frameSecondario', true);
	} else if (typeof parent.IFRAMESET_DIARIO_MEDICO === 'object') {
		parent.IFRAMESET_DIARIO_MEDICO.loadWkEpicrisi();
	}
	
	event.returnValue = false;
};

setManualDescOrder = function(campo) {
	if (typeof parent.applica_filtro!='undefined'){
		parent._WK_ORDINA_CAMPO = campo + ' desc';
		parent.applica_filtro('frameSecondario', true);
	} else if (typeof parent.IFRAMESET_DIARIO_MEDICO === 'object') {
		parent.IFRAMESET_DIARIO_MEDICO.loadWkEpicrisi();
	}
	
	event.returnValue = false;
};

if (typeof apriChiudiInfoReferto === "undefined") {
	apriChiudiInfoReferto = function() {return ModificaEpicrisi.apply(this, arguments);};
}
