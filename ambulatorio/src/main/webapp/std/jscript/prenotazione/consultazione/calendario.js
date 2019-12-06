$(function(){

	window.HomeWindow = window.CartellaWindow = null;
	var win = window;

	while(win.parent != win){
		
		win = win.parent;

		switch(win.name){
			case 'schedaRicovero': 	window.CartellaWindow = win;
				break;
			case 'Home':			window.HomeWindow = win;
				break;
			default:break;
		}
	}

});

function change_week(num)
{
	try{
		document.calendario.Hoffset.value = (parseInt(document.calendario.Hoffset.value, 10) + num) + '';
		aggiorna();
	}
	catch(e){
		alert("change_week - Error: "+ e.description);
	}
}

function valorizza_form_MenuTxDx(data, id_aree, id_dett_imp_sale, elenco_id_dett_imp_sale, id_esame) {
	try{
		document.calendario.Hdata.value = data;
		document.calendario.id_aree.value = id_aree;
		document.calendario.id_dett_imp_sale.value = id_dett_imp_sale;
		document.calendario.elenco_id_dett_imp_sale.value = elenco_id_dett_imp_sale;
		document.calendario.id_esame.value = id_esame;
	}
	catch(e){
		alert("valorizza_form_MenuTxDx - Error: " + e.description);
	}
	return MenuTxDx();
}

function evidenzia_titolo(td) {
	var tabella = document.getElementById('oTable');
	var cells = tabella.rows(0).cells;
	for (i = 0; i < cells.length; i++) {
		$(cells(i)).removeClass("GiornoEvidenziato");
	}
	$(cells(td.cellIndex)).addClass("GiornoEvidenziato");
}

function dettaglio(data, aree, cdc, codGruppo, target, td)
{
	//alert(data +'\n'+aree+'\n'+ cdc+'\n'+codGruppo);
	// Mi servono per ritornare indietro...
	evidenzia_titolo(td);
	try{
		window.iFrameMain.parametri = new Object();
		window.iFrameMain.parametri.ORIGINE = 'CONSULTAZIONE'; // Origine
		window.iFrameMain.parametri.VALORE = document.calendario.valore.value; // Valore selezionato
		window.iFrameMain.parametri.DATA = data; // Giorno selezionato
		window.iFrameMain.parametri.AREE = aree; // Aree di quel giorno
		window.iFrameMain.parametri.ID_AREA = ''; // Area selezionata dal dettaglio (la setto dentro al dettaglio...)
		window.iFrameMain.parametri.TIPO = document.calendario.tipo.value;
		window.iFrameMain.parametri.OFFSET = document.calendario.Hoffset.value;
		window.iFrameMain.parametri.VALORE2 = document.calendario.valore2.value; // Valore secondario selezionato
		window.iFrameMain.parametri.FILTRO_ESAMI = document.calendario.filtro_esami.value; // Filtro degli esami...
		
		if(typeof(parent.frameOpzioni)!= 'undefined'){
			window.iFrameMain.parametri.OPZIONI_PRENOTA = parent.frameOpzioni.document.opzioni.prenota.value; // Prenotazione o no delle richieste...
		}else{
			document.calendario.menu_tenda.value = 'prenotazioneScreening'; //non c'è allora l ho aperta dallo screening;
		}
		if(typeof(parent.frameOpzioni)!= 'undefined'){
			if(parent.frameOpzioni.document.opzioni.prenota.value == 'S')
			{
				document.calendario.id_esame.value = parent.frameRiepilogo.getIdenEsa();
				document.calendario.idx_esame.value = parent.frameRiepilogo.getIdxEsa();
			}
		}
		//alert("oososososo");
		document.calendario.Hdata.value = data;
		document.calendario.id_aree.value = aree;
		document.calendario.id_area.value = ''; // ANCORA DA FINIREEEEEE
		document.calendario.js_click.value = 'javascript:';
		
		document.calendario.valore.value = cdc;

		document.calendario.js_indietro.value = 'javascript:parent.dettaglio_orario(document.dettaglio.Hiden_sal.value,"",window.name);';
		
		//document.calendario.js_indietro.value = 'javascript:ritorna_consulta("' + document.calendario.tipo.value + '", "\'' + document.calendario.valore.value + '\'", "' + document.calendario.valore2.value + '", "' + document.calendario.filtro_esami.value + '", "' + document.calendario.Hoffset.value + '");';
	
		switch(codGruppo){
			case 'TERAPIA':
				NS_CALENDARIO.apriDettaglioTerapia(cdc,data);
				break;
			case 'RICHIESTA':
				NS_CALENDARIO.apriDettaglioRichiesta(cdc,data);				
				break;
			case 'APPUNTAMENTO':
				NS_CALENDARIO.apriDettaglioAppuntamento(cdc,data);				
				break;
			default:
				NS_CALENDARIO.apriDettaglioEsame(cdc,data,target);
				break;
		}
	}catch(e){
		alert(e.description);
	}
}

var NS_CALENDARIO = {
	
	apriDettaglioEsame:function(cdc, data, target){
		
		var url = "prenotazioneDettaglio?" + $('form[name="calendario"]').serialize();

		if(window.CartellaWindow != null){
			NS_CALENDARIO.loadInFancyBox(top.NS_APPLICATIONS.switchTo('AMBULATORIO',url));
		}else{
			aggiorna(top.NS_APPLICATIONS.switchTo('AMBULATORIO',url), target);
		}
		
	},
	
	apriDettaglioTerapia:function(cdc,data){

		var _tr_sala = $(event.srcElement).closest('tr');

		var cod_sal = _tr_sala.attr("data-cod_dec");
		var default_container = _tr_sala.attr("data-default");
		
		var url = "servletGenerator"
				+ "?KEY_LEGAME=WORKLIST"
				+ "&TIPO_WK=WK_SOMMINISTRAZIONI_REPARTO"
				+ "&ILLUMINA=javascript:illumina(this.sectionRowIndex);"
				+ "&WHERE_WK=WHERE COD_CDC ='" + cdc + "' and DATAINIZIO='" + data + "' and (('"+default_container+"'='S' and COD_SAL_AMBU is null) or COD_SAL_AMBU='" + cod_sal + "')"
				+ "&ORDER_FIELD_CAMPO=ORAINIZIO ASC";
		
		if(window.CartellaWindow != null){
			NS_CALENDARIO.loadInFancyBox(top.NS_APPLICATIONS.switchTo('WHALE',url));
		}else{			
			document.location.replace(top.NS_APPLICATIONS.switchTo('WHALE',url));
		}		
	},
	
	apriDettaglioRichiesta:function(cdc,data){
		var url = "worklistRichieste"
				+ "?Htipowk=WK_RICHIESTE_RICOVERATI_GENERICHE"
				+ "&pulsanti="
				+ "&PAGINA_WK=1"
				+ "&hidWhere=where CODICE_REPARTO_PROV='" + cdc + "' and data_filtro= '" + data + "'"
				+ "&ORDER_FIELD_CAMPO=";
		
		if(window.CartellaWindow != null){
			NS_CALENDARIO.loadInFancyBox(top.NS_APPLICATIONS.switchTo('WHALE',url));
		}else{			
			document.location.replace(top.NS_APPLICATIONS.switchTo('WHALE',url));
		}
	},	
	
	apriDettaglioAppuntamento:function(cdc,data){
		var url = "servletGenerator"
				+ "?KEY_LEGAME=WORKLIST"
				+ "&TIPO_WK=WK_APPUNTAMENTI_DH"
				+ "&ILLUMINA=javascript:illumina(this.sectionRowIndex);"
				+ "&WHERE_WK=WHERE COD_CDC ='" + cdc + "' and DATA_FILTRO='" + data + "'";
		
		if(window.CartellaWindow != null){
			NS_CALENDARIO.loadInFancyBox(top.NS_APPLICATIONS.switchTo('WHALE',url));
		}else{			
			document.location.replace(top.NS_APPLICATIONS.switchTo('WHALE',url));
		}
	},
	
	loadInFancyBox:function(url){
		
		var win = HomeWindow != null ? HomeWindow : (CartellaWindow != null ? CartellaWindow : null);
		
		if(win != null){
			win.loadInFancybox({'url':url,'onClosed':function(){document.location.replace(document.location);}});			
		}else{
			alert('Errore nel reperimento della pagina principale');
		}
		
	}
	
};

function aggiorna(pagina, target_num)
{
	//alert("aggiorna del calendario \n" + pagina + "\n" + target_num);
	// ************
	parent.frameOpzioni.last_calendario_pagina = pagina ;
	parent.frameOpzioni.last_calendario_target_num = target_num ;
	// ************
	if(pagina == null || pagina == '')
	{
		pagina = 'consultazioneCalendario';
	}
	
	var target;
	
	if (typeof target_num == 'undefined') {
		target = '_self';
	} else {
		if (isNaN(target_num)) {
			target = target_num;
		} else {
			target = 'i' + target_num;
			var tr_id = 'tr' + target_num;
			document.all[tr_id].style.display = 'block';
		}
	}
	
	document.calendario.target = target;
	document.calendario.method = 'get';
	document.calendario.action = pagina;
	//alert("aggiorna... del calendario \n" + document.calendario.action + "\n" + document.calendario.target +"\n" + document.calendario.Hdata.value);
	document.calendario.submit();
}

function stampa()
{
	var wStampa = window.open('elabStampa?stampaFunzioneStampa=LISTA_GIORNATA_STD&data=' + document.calendario.Hdata.value +'&aree=' + document.calendario.id_aree.value, '', 'top=0,left=0');
	
	if(wStampa)
	{
		wStampa.focus();
	}
	else
	{
		wStampa = window.open('elabStampa?stampaFunzioneStampa=LISTA_GIORNATA_STD&data=' + document.calendario.Hdata.value +'&aree=' + document.calendario.id_aree.value, '', 'top=0,left=0');
	}
}

/**
 * 
 * @param sala_id Obbligatorio
 * @param tr_id Opzionale, si assume sia gia' display:block
 * @param ifr_id Obbligatorio
 */
function dettaglio_orario(sala_id, tr_id, ifr_id)
{	
	//alert(sala_id + "#" + tr_id + "#" + ifr_id);
	if(sala_id != null && sala_id != '' && ifr_id != null && ifr_id != '')
	{
		var url_aree = 'consultazioneCalendario?tipo=AREE&light=S&js_path=parent.&Hoffset=' + document.calendario.Hoffset.value + '&valore=' + sala_id + '&filtro_esami=' + document.calendario.filtro_esami.value;
		var url_scr = 'consultazioneCalendario?tipo=SCRD&light=S&js_path=parent.&Hoffset=' + document.calendario.Hoffset.value + '&valore=' + sala_id + '&filtro_esami=' + document.calendario.filtro_esami.value;
		if (tr_id != null && tr_id != '') {
			if(document.all[tr_id].style.display != 'block')
			{
				document.all[tr_id].style.display = 'block';
				if(document.calendario.tipo.value != 'SCR')
					document.all[ifr_id].src = url_aree;
				else
					document.all[ifr_id].src = url_scr;
			}
			else
			{
				document.all[tr_id].style.display = 'none';
				document.all[ifr_id].src = 'blank';
			}
		} else {
			if(document.calendario.tipo.value != 'SCR')
				document.all[ifr_id].src = url_aree;
			else
				document.all[ifr_id].src = url_scr;
		}
	}
}

function salva_note(oTxt, data)
{
	var par = oTxt.value + '###' + data;
	
	consultazioneDWR.salva_nota(par);
}

function disabilita_giorno()
{
	var aree = document.calendario.id_aree.value;
	var data = document.calendario.Hdata.value;
	var sql  = "{call ? := DISABILITA_GIORNO_AGENDA('" + aree + "', '" + data + "')}";
	
	if(confirm('Si vuole disabilitare definitivamente TUTTE le aree del giorno ' + data.substr(6, 2) + '/' + data.substr(4, 2) + '/' + data.substr(0, 4) +'?'))
	{
		dwr.engine.setAsync(false);
		toolKitDB.executeFunctionData(sql, check_disabilita_giorno);
		dwr.engine.setAsync(true);
	}
}

function check_disabilita_giorno(value)
{
	if(value != null && value != '')
		alert(value);
	else
		aggiorna();
}

function prenota(tipo_forzatura)
{
	var forzatura = (typeof tipo_forzatura == 'undefined' ? 'N':tipo_forzatura);
	parent.parent.document.location.replace('sceltaEsami?tipo_registrazione=P&next_servlet=javascript:check_dati_prenota(' + document.calendario.id_dett_imp_sale.value + ',"' + forzatura + '");&Hclose_js=chiudi_prenotazione();&Hiden_are=' + document.calendario.id_aree.value);// + '&Ha_sel_iden=' + cod);
}

function copia()
{
	var cod;
	var id;
	
	id = document.calendario.id_esame.value;
	
	if(isLockPage('PRENOTAZIONE_COPIA', id, 'ESAMI'))
	{
//		alert('Attenzione! Paziente di sola lettura!');
		alert("Attenzione! Impossibile proseguire, paziente di sola lettura!\nPer renderlo utilizzabile aprire una segnalazione alla assistenza tecnica\ncomunicando le informazioni anagrafiche corrette.");		
	}
	else
	{
		//if(check_copia_taglia('la copia'))
		//{
			cod = document.calendario.elenco_id_dett_imp_sale.value;
			
			if(id != '' && id != '-1')
			{
				prenDWRClient.copia(cod + '*' + id, check_copy);
			}
		//}
	}
}

function taglia()
{
	var cod;
	var id;
	
	id = document.calendario.id_esame.value;
	
	if(isLockPage('PRENOTAZIONE_TAGLIA', id, 'ESAMI'))
	{
		alert('Attenzione! Paziente di sola lettura!');
	}
	else
	{
		//if(check_copia_taglia('il taglia'))
		//{
			cod = document.calendario.elenco_id_dett_imp_sale.value;
			
			if(id != '' && id != '-1')
			{
				prenDWRClient.taglia(cod + '*' + id, check_cut);
			}
		//}
	}
	return;
}

function incolla()
{
	var cod   = document.calendario.id_dett_imp_sale.value;
	
	prenDWRClient.incolla(cod, check_paste);
}

function check_cut(msg)
{
	if(msg != null && msg != '')
	{
		alert(msg);
	}
	else
	{
		document.calendario.Hoffset.value = '';
		aggiorna();
	}
}

function check_paste(msg)
{
	if(msg != null && msg != '')
	{
		alert(msg.replace('ERROR*', ''));
	}
	else
	{
		document.calendario.id_esame.value = '';
		document.calendario.Hoffset.value = '';		
		aggiorna();
	}
}

function check_copy(msg)
{
	if(msg != null && msg != '')
	{
		alert(msg);
	}
	else
	{
		document.calendario.Hoffset.value = '';
		aggiorna();
	}
}


function cancella()
{
	var esa       = document.calendario.id_esame.value;
	var permit    = document.frmCancEsa.permissione.value.substring(9,10);
	var w_ins_pwd = null;
	
	initbaseGlobal();
	
	if(permit == 0)
	{
		alert('L\'utente non è abilitato alla cancellazione di esami!');
	}
	else
	{
		if(isLockPage('PRENOTAZIONE_CANCELLA', esa, 'ESAMI'))
		{
			alert('Attenzione! Paziente di sola lettura!');
		}
		else
		{
			/*if(stato == '1')
			{
				alert('Impossibile cancellare, esame già eseguito!');
			}
			else
			{*/
				try
				{
					esa = esa.replace(/\*/g, ",");
				}
				catch(ex)
				{
				}
				
				if(esa != '' && esa != '-1')
				{
					if(confirm('Sei sicuro di voler cancellare la prenotazione?'))
					{
						//document.frmCancEsa.idenEsame.value = esa;
						document.frmCancEsa.idenEsame.value = '';
						//prenDWRClient.cancella(esa, check_delete);
						if(baseGlobal.OB_PWD_CANC == 'S')
						{
							w_insPwd = window.open('SL_InsPwdCancellazione?provenienza=ESAMI','', 'height=250,width=400,scrollbars=no,top=200,left=300');
						}
						else
						{
							cancellazioneEsami(true);
						}
					}
				}
			//}
		}
	}
}

function cancellazioneEsami(canc_esa)
{
	var w_motivo = null;
	
	if(canc_esa)
	{
		document.frmCancEsa.action = 'SL_CancellazioneEsami';
		document.frmCancEsa.target = 'winInsertMotivazione';
		
		w_motivo = window.open("","winInsertMotivazione","top=200,left=120,width=800,height=223,status=yes,scrollbars=no");
		if(w_motivo)
		{
			w_motivo.focus();
		}
		else
		{
			w_motivo = window.open("","winInsertMotivazione","top=200,left=120,width=800,height=223,status=yes,scrollbars=no");
		}
		
		document.frmCancEsa.submit();
		
		document.frmCancEsa.idenEsame.value = document.calendario.id_esame.value;
	}
}

function cancellaESAMI()
{
	if(document.form.pwd.value == '')
	{
		alert('Prego, inserire la password.');
		document.form.pwd.focus();
		return;
	}
	var webpassword = document.form.hpwd.value;//web.webpassword
	var pwd_inserita = document.form.pwd.value;
	
	if(webpassword != pwd_inserita)
	{
		alert('Password errata.');
		document.form.pwd.value = '';
		document.form.pwd.focus();
		return;
	}
	else
	{
		opener.cancellazioneEsami(true);
		self.close();
	}
}
