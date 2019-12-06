jQuery(document).ready(function()
		{

		if (baseUser.ATTIVA_NUOVA_WORKLIST == 'S'){
			$().callJSAfterInitWorklist('initDiari()');
		 }
		 else{
			 $('table#oTable tr>td:nth-child(5)[title!="Cancellato: N"]').parent().addClass('gray');
		 }
});

function initDiari(){
	$('table#oTable tr>td>div[class="colorDelete"]').parent().parent().addClass('colorDelete').removeClass('clsOdd');
}

try {
	parent.removeVeloNero('frameDiari');
} catch (e) {}



function InserisciNota() {
	var vDati = top.getForm(document);

	var url = 'servletGenerator?KEY_LEGAME=ESAMI_DA_RICHIEDERE&KEY_TIPO_DIARIO=ESAMI_DA_RICHIEDERE';
	url += '&KEY_ID=0';
	url += '&KEY_IDEN_VISITA=' + top.FiltroCartella.getIdenRiferimentoInserimento(vDati);
	parent.$.fancybox({
		'padding'	: 3,
		'width'		: parent.body.offsetWidth/10*9,
		'height'	: parent.body.offsetHeight/10*9,
		'href'		: url,
		'type'		: 'iframe',
		'showCloseButton':false
	});


}

function ModificaNota(){
    var vDati = top.getForm(document)
	var iden_nota = stringa_codici(array_iden_nota);
	var vIdenVisita = stringa_codici(array_iden_visita);

	if (stringa_codici(array_deleted)=="S"){
		 return alert('Attenzione: nota cancellata');
	}

	if(iden_nota == ''){ return alert('Attenzione: effettuare una selezione');}

	//	il diario può essere modificato solamente dall'utente che lo ha inserito
	if (stringa_codici(array_ute_registrazione)!=baseUser.IDEN_PER){
		return alert("Modifica consentita solo all'utente che ha inserito la nota ");
	}

		//var vDati = top.getForm(document);
		var url = "servletGenerator?";
		url += "KEY_LEGAME=ESAMI_DA_RICHIEDERE";
		url += "&KEY_ID="+iden_nota;
		url += '&KEY_IDEN_VISITA='+vIdenVisita;
		url += '&MODIFICA=S';
		parent.$.fancybox({
			'padding'	: 3,
			'width'		: 1024,
			'height'	: 600,
			'href'		: url,
			'type'		: 'iframe',
			'showCloseButton':false
		});
}

function cancellaNota(){
	var iden_nota  = stringa_codici(array_iden_nota);

	if (stringa_codici(array_deleted)=="S"){
		 return alert('Attenzione: nota già cancellata');
	}
	if(iden_nota == ''){
		return alert('Attenzione:effettuare una selezione');
	}
	if (stringa_codici(array_ute_registrazione)!=baseUser.IDEN_PER){
		return alert("Cancellazione consentita solo all'utente che ha inserito la nota ");
	}

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

function cancellaRecord(vMotivazione){
	var pBinds = new Array();
	var iden_nota  = stringa_codici(array_iden_nota);


	pBinds.push(iden_nota);
	pBinds.push(vMotivazione);

	top.dwr.engine.setAsync(false);
	top.dwrUtility.executeStatement('diari.xml','cancellaDiarioEpicrisi',pBinds,0,callBack);
	top.dwr.engine.setAsync(true);

	function callBack(resp){
		if(resp[0]=='KO'){
			alert(resp[1]);
		}
		else
		{
			document.location.reload();
		}
		$.fancybox.close();
	}
}

function aggiorna() {
	parent.document.all['oIFWk'].src=parent.document.all['oIFWk'].src;
}



function concatenaNote(){

	var testo='';
	for (indice in array_testo) {
		testo+='<table id=tableConcatDiari width="100%"><tr><th>'+array_ute_inserimento[indice]+'</th></tr><tr><td>'+array_testo[indice]+'</td></tr></table>';
		testo+='<HR size="3" width="45" color="red">';

	}
	parent.showDialog('Visualizza note',testo,'success');
}

function VisualizzaNota(){

	var iden_nota = stringa_codici(array_iden_nota);
	var vIdenVisita = stringa_codici(array_iden_visita);
	if(iden_nota == ''){ return alert('Attenzione: effettuare una selezione');}


	var vDati = top.getForm(document);
	var nome = 'ESAMI_DA_RICHIEDERE';
	var url = "servletGenerator?KEY_LEGAME=" + nome + "&KEY_ID="+iden_nota+'&KEY_IDEN_VISITA='+vIdenVisita;
	url += '&LETTURA=S';
	parent.$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 600,
		'href'		: url,
		'type'		: 'iframe',
		'showCloseButton':false
	});
}

