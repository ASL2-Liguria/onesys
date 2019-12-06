/**
 * Javascript in uso dalla worklist Diario della pagina DIARI.
 */

var WindowCartella = null;
jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    if (baseUser.ATTIVA_NUOVA_WORKLIST == 'S'){
        $().callJSAfterInitWorklist('initDiari()');
    }
    else{        
        if(typeof(array_fascia_oraria)!='undefined'){
        	for (var i in array_fascia_oraria) {
        		if(array_fascia_oraria[i]=='MATTINO')
        			$('table#oTable tr:eq('+i+')').addClass('rosa');
        		else if (array_fascia_oraria[i]=='POMERIGGIO')
        			$('table#oTable tr:eq('+i+')').addClass('giallo');
        		else if (array_fascia_oraria[i]=='NOTTE')
        			$('table#oTable tr:eq('+i+')').addClass('celeste');   		  
        	}
        }
        
        $('table#oTable tr> td[title="Cancellato: S"]').parent().removeClass('rosa giallo celeste').addClass('gray');
        
    }
    try {
        parent.$('div[name=frameDiari], div[name=frameSecondario]').remove();
    	parent.removeVeloNero('frameDiari');
    } catch (e) {}
});

function initDiari(){
	$('table#oTable tr>td>div[class="colorDelete"]').parent().parent().addClass('colorDelete').removeClass('clsOdd');	
}

function InserisciDiarioMedico() {
	var nome = 'SCHEDA_DIARIO_MEDICO';
	var tipoDiario='';
	switch (parent.document.EXTERN.KEY_TIPO_DIARIO.value) {
            case 'MEDICO': case 'M':
                    if(parent.baseUser.TIPO != 'M'){ return alert('Funzionalità riservata al personale medico');}
                    tipoDiario = 'MEDICO';
                    break;
            case 'INFERMIERE': case 'I':
                    if(parent.baseUser.TIPO!='I'){ return alert('Funzionalità riservata al personale infermieristico');}
                    tipoDiario = 'INFERMIERE';
                    break;
            case 'RIABILITATIVO':
                    if (parent.baseUser.TIPO!='L' && parent.baseUser.TIPO!='F'){ return alert('Funzionalità riservata ai logopedisti o fisioterapisti');}
                    if (parent.baseUser.TIPO=='L'){
                        tipoDiario='LOGOPEDISTA';
                    }
                    else if (parent.$.inArray("ROBOTICA", parent.baseUser.ATTRIBUTI) > -1) {
                        tipoDiario='ROBOTICA';
                    }
                    else {
                        tipoDiario='FISIOTERAPISTA';
                    }
                    break;
            case 'DIETISTA': case 'D':
                if (parent.baseUser.TIPO!='D') { 
                    return alert('Funzionalità riservata ai dietisti');
                }
                tipoDiario = 'DIETISTA';
                break;
            case 'OSTETRICO': case 'OST':
                if (parent.baseUser.TIPO!='OST') { 
                    return alert('Funzionalità riservata al personale ostetrico');
                }
                tipoDiario = 'OSTETRICO';
                break; 
            case 'SOCIALE': case 'AS':
                if (parent.baseUser.TIPO!='AS') { 
                    return alert('Funzionalità riservata agli assistenti sociali');
                }
                tipoDiario = 'SOCIALE';
                break;
            default:
            	return alert('Funzionalità non abilitata');
	}
	var vDati = WindowCartella.getForm(document);

	var url = 'servletGenerator?KEY_LEGAME=' + nome;
	url += '&KEY_ID=0';
	url += '&KEY_IDEN_VISITA=' + WindowCartella.FiltroCartella.getIdenRiferimentoInserimento(vDati);
	url += '&KEY_TIPO_DIARIO='+tipoDiario;
	url += '&REPARTO='+vDati.reparto;
	url += '&FUNZIONE=SCHEDA_DIARIO_'+tipoDiario;
	if (typeof parent.idenSchedaMET === 'number' && parent.idenSchedaMET > 0) {
		url += '&ARRIVATO_DA=CC_SCHEDE_METAL';
		url += '&IDEN_RIFERIMENTO='+parent.idenSchedaMET;
	} else {
		url += '&ARRIVATO_DA=';
		url += '&IDEN_RIFERIMENTO=';
	}
	parent.$.fancybox({
		'padding'	: 3,
		'width'		: parent.body.offsetWidth/10*9,
		'height'	: parent.body.offsetHeight/10*9,
		'href'		: url,
		'type'		: 'iframe',
		'showCloseButton':false
	});
}

function ModificaDiarioMedico() { 
    var vDati = WindowCartella.getForm(document);
    var iden_diario = stringa_codici(array_iden_diario);
    var vIdenVisita = stringa_codici(array_iden_visita);
    
    if (iden_diario == '') { 
        return alert('ATTENZIONE: effettuare una selezione!');
    }
    
    if (isAConsulting(iden_diario) && (parent.document.EXTERN.KEY_TIPO_DIARIO.value!='MEDICO' || isSegnalazioneDecesso(stringa_codici(array_arrivato_da))) && ((parent.document.EXTERN.KEY_TIPO_DIARIO.value!='MEDICO' && parent.document.EXTERN.KEY_TIPO_DIARIO.value!='INFERMIERE') || isNotFromFenix(stringa_codici(array_arrivato_da)))) {
             if (stringa_codici(array_deleted) == "S") {
             return alert('ATTENZIONE: diario cancellato!');
        }

        //	il diario può essere modificato solamente dall'utente che lo ha inserito
        if (stringa_codici(array_ute_registrazione) != baseUser.IDEN_PER) {
            return alert("ATTENZIONE: Modifica consentita solo all'utente che ha inserito il diario!");
        }
        
    	var range;
    	try {
    		range = parent.config.tipi[parent.document.EXTERN.KEY_TIPO_DIARIO.value].modifica.range;
    	} catch(e) {
    		range = {down: null, top: null}; // controllo sulla data disabilitato
    	}
        
        if (controllaData(range)) { 
            var nome = 'SCHEDA_DIARIO_MEDICO';

            var tipoDiario = null;
            switch (parent.document.EXTERN.KEY_TIPO_DIARIO.value) {
                case 'MEDICO': case 'M':
                    tipoDiario = 'MEDICO'; 
                    break;
                case 'INFERMIERE': case 'I':
                    tipoDiario = 'INFERMIERE'; 
                    break;
                case 'TECNICO': case 'T':
                    tipoDiario = 'TECNICO'; 
                    break;
                case 'RIABILITATIVO':
                    if (parent.baseUser.TIPO == 'L') {
                        tipoDiario = 'LOGOPEDISTA';
                    }
                    else if (parent.$.inArray("ROBOTICA", parent.baseUser.ATTRIBUTI) > -1) {
                        tipoDiario = 'ROBOTICA';
                    }
                    else {
                        tipoDiario = 'FISIOTERAPISTA';
                    }
                    break;
                case 'DIETISTA': case 'D':
                    tipoDiario = 'DIETISTA'; 
                    break;
                case 'OSTETRICO': case 'OST':
                    tipoDiario = 'OSTETRICO'; 
                    break;
                case 'SOCIALE': case 'AS':
                    tipoDiario = 'SOCIALE'; 
                    break;
                default:
                	return alert('Funzionalità non abilitata');
            }
            //var vDati = top.getForm(document);
            var url = "servletGenerator?";
            url += "KEY_LEGAME=" + nome;
            url += "&KEY_ID="+iden_diario;
            url += '&KEY_IDEN_VISITA='+vIdenVisita;
            url += '&KEY_TIPO_DIARIO='+tipoDiario;
            url += '&REPARTO='+vDati.reparto;
            url += '&FUNZIONE=SCHEDA_DIARIO_'+tipoDiario;
            url += '&MODIFICA=S';
        	if (typeof parent.idenSchedaMET === 'number' && parent.idenSchedaMET > 0) {
        		url += '&ARRIVATO_DA=CC_SCHEDE_METAL';
        		url += '&IDEN_RIFERIMENTO='+parent.idenSchedaMET;
        	} else {
        		url += '&ARRIVATO_DA=';
        		url += '&IDEN_RIFERIMENTO=';
        	}
            parent.$.fancybox({
                'padding'           : 3,
                'width'             : 1024,
                'height'            : 600,
                'href'              : url,
                'type'              : 'iframe',
                'showCloseButton'   : false
            });
        }       
    }       
}

function cancellaDiario(){
	var iden_diario  = stringa_codici(array_iden_diario);

	if(iden_diario == ''){
		return alert('Attenzione:effettuare una selezione');
	}
	
	 if (isAConsulting(iden_diario) && (parent.document.EXTERN.KEY_TIPO_DIARIO.value!='MEDICO' || isSegnalazioneDecesso(stringa_codici(array_arrivato_da)))) {
		if (stringa_codici(array_deleted)=="S"){
			return alert('Attenzione: diario già cancellato');
		}
		if (stringa_codici(array_ute_registrazione)!=baseUser.IDEN_PER){
			return alert("Cancellazione consentita solo all'utente che ha inserito il diario ");
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
}

function cancellaRecord(vMotivazione){

	var pBinds = new Array();
	var iden_diario  = stringa_codici(array_iden_diario);


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
		$.fancybox.close();
	}
}

function notificaAInf(){
	
	var pBinds = new Array();
	var iden_diario = stringa_codici(array_iden_diario);
	var tipo_diario = stringa_codici(typeof array_tipo_diario === 'object' ? array_tipo_diario : []);
	
	if (typeof tipo_diario === 'string' && tipo_diario != 'MEDICO') {
		return alert('Funzionalità riservata al personale medico');
	}
	
    if (stringa_codici(array_ute_registrazione)!=baseUser.IDEN_PER){
        return alert("Non è possibile notificare diari inseriti da altri utenti");
    }
	pBinds.push(iden_diario);
	pBinds.push(baseUser.IDEN_PER);

    var resp=WindowCartella.executeStatement('diari.xml','inserisciNotifica',pBinds,1);

    if (resp[0]=="OK"){
    	if(resp[2]!=' '){
    		alert(resp[2]);
    	}
    	else{
    	document.location.reload();
    	}
    } else{
    	return alert(resp[0] +" "+ resp[1]);
    }
}

function eliminaNotificaAInf(){
	
	var pBinds = new Array();
	var iden_diario;
	var uteReg;
	
	if (rigaSelezionataDalContextMenu==-1){
		iden_diario = stringa_codici(array_iden_diario);
		uteReg = stringa_codici(array_ute_registrazione);
	}
	else{
		iden_diario = array_iden_diario[rigaSelezionataDalContextMenu];
		uteReg = array_ute_registrazione[rigaSelezionataDalContextMenu];
	}
	
    if (uteReg!=baseUser.IDEN_PER){
        return alert("Non è possibile cancellare una notifica inserita da altri utenti");
    }
	pBinds.push(iden_diario);

	var resp=WindowCartella.executeStatement('diari.xml','eliminaNotifica',pBinds,0);

    if (resp[0]=="OK"){
    	document.location.reload();
    } else{
    	return alert(resp[0] +" "+ resp[1]);
    }
}

function aggiorna() {
	try {
		if (typeof parent.document.all['frameDiari'] === 'object') {
			parent.document.all['frameDiari'].src=parent.document.all['frameDiari'].src;
		} else if (typeof parent.document.all['oIFWk'] === 'object') {
			parent.document.all['oIFWk'].src=parent.document.all['oIFWk'].src;
		}
	} catch(e) {}
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

function concatenaDiari(){

	var testo='';
	for (indice in array_testo) {
		testo+='<table id=tableConcatDiari width="100%"><tr><th>'+array_ute_inserimento[indice]+' '+array_data_evento[indice]+' '+array_ora_evento[indice]+'</th></tr><tr><td>'+array_testo[indice]+'</td></tr></table>';
		testo+='<HR size="3" width="45" color="red">';
		// testo+=array_ute_registrazione[indice];
		// testo+='utente inserimento:';
		// testo+=array_testo[indice];
	}
	parent.showDialog('Visualizza Diari',testo,'success');
}


function gestisciNotifica(){
	var iden_diario;
	var vIdenVisita;
	
	if (rigaSelezionataDalContextMenu==-1){
		iden_diario = stringa_codici(array_iden_diario);
		vIdenVisita = stringa_codici(array_iden_visita);
	}
	else{
		iden_diario = array_iden_diario[rigaSelezionataDalContextMenu];
		vIdenVisita = array_iden_visita[rigaSelezionataDalContextMenu];
	}
	
	if (parent.document.EXTERN.KEY_TIPO_DIARIO.value=='MEDICO' && baseUser.TIPO=='I'){
		var pBinds = new Array();
		pBinds.push(iden_diario);

	    var resp=WindowCartella.executeStatement('diari.xml','disattivaNotifica',pBinds,0);
	    if (resp[0]=="OK"){
	    	VisualizzaDiarioMedico();
	    	document.location.reload();
	    } else{
	    	return alert(resp[0] +" "+ resp[1]);
	    }
	}
	
	if (parent.document.EXTERN.KEY_TIPO_DIARIO.value=='MEDICO' && baseUser.TIPO=='M'){
		if (confirm("Attenzione: cancellare la notifica?")){
			eliminaNotificaAInf();
		}
	}
}


function VisualizzaDiarioMedico(){
	var iden_diario;
	var vIdenVisita;
	
	if (rigaSelezionataDalContextMenu==-1){
		iden_diario = stringa_codici(array_iden_diario);
		vIdenVisita = stringa_codici(array_iden_visita);
	}
	else{
		iden_diario = array_iden_diario[rigaSelezionataDalContextMenu];
		vIdenVisita = array_iden_visita[rigaSelezionataDalContextMenu];
	}

	if(iden_diario == ''){ return alert('Attenzione: effettuare una selezione');}

	var tipoDiario = null;
	switch (parent.document.EXTERN.KEY_TIPO_DIARIO.value) {
            case 'MEDICO': case 'M':
                    tipoDiario = 'MEDICO'; break;
            case 'INFERMIERE': case 'I':
                    tipoDiario = 'INFERMIERE'; break;
            case 'TECNICO': case 'T':
                    tipoDiario = 'TECNICO'; break;
            case 'RIABILITATIVO':
                if (parent.baseUser.TIPO=='L') {
                    tipoDiario='LOGOPEDISTA';
                }
                else if (parent.$.inArray("ROBOTICA", parent.baseUser.ATTRIBUTI) > -1) {
                    tipoDiario='ROBOTICA';
                }
                else {
                    tipoDiario='FISIOTERAPISTA';
                }
                break;
            case 'OSTETRICO': case 'OST':
                tipoDiario = 'OSTETRICO'; 
                break;
            case 'DIETISTA': case 'D':
                tipoDiario = 'DIETISTA'; 
                break;
            case 'SOCIALE': case 'AS':
                tipoDiario = 'SOCIALE'; 
                break;
            default:
            	return alert('Funzionalità non abilitata');
	}
	

	
	var vDati = WindowCartella.getForm(document);
	var nome = 'SCHEDA_DIARIO_MEDICO';
	var url = "servletGenerator?KEY_LEGAME=" + nome + "&KEY_ID="+iden_diario+'&KEY_IDEN_VISITA='+vIdenVisita;
	url += '&KEY_TIPO_DIARIO='+tipoDiario;
	url += '&REPARTO='+vDati.reparto;
	url += '&FUNZIONE=SCHEDA_DIARIO_'+tipoDiario;
	url += '&LETTURA=S';
	if (typeof parent.idenSchedaMET === 'number' && parent.idenSchedaMET > 0) {
		url += '&ARRIVATO_DA=CC_SCHEDE_METAL';
		url += '&IDEN_RIFERIMENTO='+parent.idenSchedaMET;
	} else {
		url += '&ARRIVATO_DA=';
		url += '&IDEN_RIFERIMENTO=';
	}
	parent.$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 600,
		'href'		: url,
		'type'		: 'iframe',
		'showCloseButton':false
	});
}

function visualizzaReferto(idenRef)
{
	var url 	 = "ApriPDFfromDB?AbsolutePath="+WindowCartella.getAbsolutePath()+"&idenVersione="+idenRef;
	var finestra = window.open(url,'','scrollbars=yes,fullscreen=yes');
	try
	{
        WindowCartella.opener.top.pushFinestraInArray(finestra);
	}catch(e)
	{
	}
}


/*funzione di stampa*/
function stampaDiarioMedico(tipo){
	var vDati	  = WindowCartella.getForm(document);
	
	if(!WindowCartella.ModalitaCartella.isStampabile(vDati)){
		return alert('Stampa non abilitata');
	}
	
	var funzione  = '';
	var sf 		  = '';
	var anteprima = 'S';
	var reparto	  = vDati.reparto;
	var tipo_diario = '';
	
	switch (parent.document.EXTERN.KEY_TIPO_DIARIO.value) {
            case 'MEDICO': case 'M':
                    funzione = 'DIARIO_MEDICO';
                    tipo_diario = parent.document.EXTERN.KEY_TIPO_DIARIO.value;
                    break;
            case 'INFERMIERE': case 'I':
                    funzione = 'DIARIO_INFERMIERISTICO';
                    tipo_diario = parent.document.EXTERN.KEY_TIPO_DIARIO.value;
                    break;
            case 'TECNICO': case 'T':
                    funzione = 'DIARIO_TECNICO';
                    tipo_diario =parent.document.EXTERN.KEY_TIPO_DIARIO.value;                    
                    break;
            case 'RIABILITATIVO':
                    funzione = 'DIARIO_RIABILITATIVO';
                    
                    var filtri_generale = [];
                    var filtri_epicrisi = [];
                    var pulsanti = parent.$(".pulsanteLISelezionato");
    				for (var i=0; i<pulsanti.length;i++) {
    					var id = pulsanti[i]["id"].replace(/^[^_]*_/,"");
    					var arrValue = parent.NS_DIARIO_GENERICO.getFiltroPulsante(id);
    					$.merge(filtri_generale, arrValue[0]);
    					$.merge(filtri_epicrisi, arrValue[1]);

    				};
    				
    				if (filtri_generale.length == 0){
    					filtri_generale = parent.NS_DIARIO_GENERICO.getFiltroPulsante("btnDiarioRiab")[0];
    					filtri_epicrisi = parent.NS_DIARIO_GENERICO.getFiltroPulsante("btnDiarioRiab")[1];
    				}
    				
    				tipo_diario = filtri_generale.concat(filtri_epicrisi).join("|");
    				sf += "&prompt<pTipoDiario>="+tipo_diario;

                    break;
            case 'DIETISTA': case 'D':
                funzione = 'DIARIO_DIETISTA'; 
                tipo_diario = parent.document.EXTERN.KEY_TIPO_DIARIO.value;
                break;
            case 'OSTETRICO': case 'OST':
                funzione = 'DIARIO_OSTETRICO'; 
                tipo_diario = parent.document.EXTERN.KEY_TIPO_DIARIO.value;
                break;
            case 'SOCIALE': case 'AS':
                funzione = 'DIARIO_SOCIALE'; 
                tipo_diario = parent.document.EXTERN.KEY_TIPO_DIARIO.value;
                break;
            default:
            	return alert('Funzionalità non abilitata');
	}

	// Stampa Diario Tutto Ricovero
	if (tipo=='N')
	{
		sf = "&prompt<pNoso>="+vDati.ricovero
		+ "&prompt<pIdenRicovero>="+vDati.iden_ricovero
		+ sf;
	}

	// Stampa Diario Accesso Corrente
	else if (tipo=='A')
	{
		sf = '{QUERY.IDEN_VISITA}='+WindowCartella.FiltroCartella.getIdenRiferimentoInserimento(vDati) +
		+ "&prompt<pNoso>="+vDati.ricovero
		+ "&prompt<pIdenRicovero>="+vDati.iden_ricovero
		+ sf;
	}
	
	// Stampa Diario Da Data A Data
	else
	{
		var data = undefined;
		
		if (tipo == 'D') {
			data = getDaDataADataDiario(clsDate.getData(new Date(), 'DD/MM/YYYY'),clsDate.getData(new Date(), 'DD/MM/YYYY'));
		} else {
			if (typeof parent.$('#txtDaData').val() === 'string' && parent.$('#txtDaData').val() != '') {
				data = {};
				data.dataIni = parent.$('#txtDaData').val();
				data.dataFine = clsDate.getData(new Date(), 'DD/MM/YYYY');
				if (typeof parent.$('#txtAData').val() === 'string' && parent.$('#txtAData').val() != '') {
					data['dataFine'] = parent.$('#txtAData').val();
				}
			} else {
				return alert('Valorizzare il campo "Da data"');
			}
		}

		if (data == undefined) //operazione annullata
			return;
		else
		{
			var data_ini = data.dataIni.substring(0,2);
			var mese_ini = data.dataIni.substring(3,5);
			var anno_ini = data.dataIni.substring(6,10);

			var data_fin = data.dataFine.substring(0,2);
			var mese_fin = data.dataFine.substring(3,5);
			var anno_fin = data.dataFine.substring(6,10);

			sf = '{query.data_ricovero}>=cdate('+anno_ini+','+mese_ini+','+data_ini+') and {query.data_ricovero}<=cdate('+anno_fin+','+mese_fin+','+data_fin+')'
			+ "&prompt<pNoso>="+vDati.ricovero
			+ "&prompt<pIdenRicovero>="+vDati.iden_ricovero
			+ sf;
		}
	}
    WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT,vDati.TipoRicovero);
}

function isAConsulting(iden_diario) {
    var resp = WindowCartella.executeStatement('diari.xml', 'isAConsulting', [iden_diario], 1);

    if (resp[0] == 'KO') {
        alert(resp[1]);
        return false;
    } else if (resp[2] != null && resp[2] != '') {
        alert('Attenzione: impossibile modificare o cancellare il testo di una consulenza');
        return false;
    } else {
        return true;       
    }     
}
function isSegnalazioneDecesso(arrivato_da) {
  if (arrivato_da=='SEGNALAZIONE_DECESSO') {
        alert('Attenzione: impossibile modificare o cancellare questa nota di diario');
        return false;
    } else {
        return true;       
    }     
}

function isNotFromFenix(arrivato_da) {
	  if (arrivato_da=='FENIX') {
	        alert('Attenzione: impossibile modificare o cancellare questa nota di diario');
	        return false;
	    } else {
	        return true;       
	    }     
}

function setRiga(obj){
	  
	if(typeof obj =='undefined') obj = event.srcElement;

	while(obj.nodeName.toUpperCase() != 'TR'){
		obj = obj.parentNode;
	}
	rigaSelezionataDalContextMenu = obj.sectionRowIndex;
	return rigaSelezionataDalContextMenu;
}

if (typeof apriChiudiInfoReferto === "undefined") {
	apriChiudiInfoReferto = function() {return ModificaDiarioMedico.apply(this, arguments);};
}
