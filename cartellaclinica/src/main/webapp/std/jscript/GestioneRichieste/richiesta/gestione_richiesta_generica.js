var rangeGiorni;
jQuery(document).ready(function(){
	
	window.WindowHome = window;

	while((window.WindowHome.name != 'Home' && window.WindowHome.name != 'schedaRicovero')){	
		window.WindowHome = window.WindowHome.parent;
    }
	switch(WindowHome.name){
		case 'Home':
		    window.baseReparti 	= WindowHome.baseReparti;
		    window.baseGlobal 	= WindowHome.baseGlobal;
		    window.basePC 		= WindowHome.basePC;
		    window.baseUser 	= WindowHome.baseUser;
		    break;
		case 'schedaRicovero':
		    window.baseReparti 	= WindowHome.baseReparti;
		    window.baseGlobal 	= WindowHome.baseGlobal;
		    window.basePC 		= WindowHome.basePC;
		    window.baseUser 	= WindowHome.baseUser;
		    break;
		default:
		try{
		    window.baseReparti 	= opener.top.baseReparti;
	    	window.baseGlobal 	= opener.top.baseGlobal;
	    	window.basePC 		= opener.top.basePC;
	    	window.baseUser 	= opener.top.baseUser;
			}catch(e){
		    window.baseReparti 	= top.baseReparti;
	    	window.baseGlobal 	= top.baseGlobal;
	    	window.basePC 		= top.basePC;
	    	window.baseUser 	= top.baseUser;				
			}			
	}
	$('#txtCognome,#txtNome').bind('keyup', function(){
		intercettaTasti();
		document.dati.txtCognome.value = document.dati.txtCognome.value.toUpperCase();
	});
	
	$('#txtAdata,#txtDaData').bind('keyup', function(){
		intercettaTasti();
	});	
	
	$('#cmbStatoRichiesta').change(function() {
		cmbStatoChange();
		applica_filtro_richieste();
	 });
	
	rangeGiorni=WindowHome.baseReparti.getValue(baseUser.LISTAREPARTI[0],'OE_WK_RICHIESTE_RANGE_TEMPO');
	if(rangeGiorni==''){
	 rangeGiorni=20;
	}
	cmbStatoChange();
	var wkRic = WindowHome.baseReparti.getValue(baseUser.LISTAREPARTI[0],'OE_WK_RICHIESTE_TIPO_WK');
	applica_filtro_richieste('worklistRichieste?Htipowk='+wkRic+'&pulsanti=');

});

function chiudi(){
	try{
		opener.aggiorna();
	}catch(ex){}
	
	self.close();
}


function scegli_prestazioni(){
	
	var url = null;
	var popup = null;
	var esami=null;
	
	if(document.richiesta.hCDC.value == ''){
		alert('Attenzione: prima di scegliere le prestazioni selezionara il CDC di Destinazione');	
		return;
	}
	
	url = "sceltaEsami?Hcdc=" + document.richiesta.hCDC.value;
	url +="&Ha_sel_iden=" + document.richiesta.HelencoEsami.value;
	url +="&next_servlet=javascript:prestazioni_richiedibili(\"richiesta\");";
	url +="&tipo_registrazione=IR";

	popup = window.open(url, "", "status = yes, scrollbars = no");
	if(popup)
		popup.focus();
	else 
		popup = window.open(url, "", "status = yes, scrollbars = no");
}


function genera_stringa_codici(sel, carattere){
	
	//alert(sel + '\n ' + carattere);
	var idx;
	var ret = '';
	
	for(idx = 0; idx < sel.length; idx++)
	{
		if(ret != '')
			ret += carattere; //'*';
		
		ret += sel[idx].value;
	}
	
	return ret;
}

/*Scelta delle controindicazioni corrisponde ad una semplice select sulla tabella
CONTROINDICAZIONI
*/
function scegli_controindicazioni(){
	
	var doc = document.richiesta;
	var controind = '';

	/*if(doc.hControindicazioni.value.length == 0)
	{
		controind = "-1";
	}
	else
		controind = doc.hControindicazioni.value;*/		
	
	document.richiesta.hControindicazioni.value = genera_stringa_codici(document.richiesta.selControindicazioni, ",");
	controind = document.richiesta.hControindicazioni.value;
	
	if(controind == '')
		controind = '-1';
	
	where_condition_sx = " iden_anag= "+document.EXTERN.Hiden_anag.value+" and  iden not in ("+ controind +") and visualizza_in_altri_ricoveri = 'S' and deleted = 'N' ";
	where_condition_dx = " iden_anag= "+document.EXTERN.Hiden_anag.value+" and iden in ("+ controind +") and visualizza_in_altri_ricoveri = 'S' and deleted = 'N' ";
	
	var servlet = 'SL_Scelta?where_condition_sx='+where_condition_sx+'&where_condition_dx='+where_condition_dx;
	servlet += '&table=VIEW_CC_ALLERTE_RICOVERO&ltitle=lblCntInd&campo_descr=selControindicazioni&campo_iden=hControindicazioni';

	window.open(servlet,'','width=700,height=800, resizable = yes, status=yes, top=10,left=10');
}



/*Function richiamata dalla finestra di scelta Esami (omino)*/
function aggiorna(){}


function cambia_urgenza(urg){
	
	document.richiesta.Hiden_esa.value = genera_stringa_codici(document.richiesta.prestazioni, "*");
	
	if(urg == '')
		urg = document.richiesta.hUrgenza.value;
	else
		document.richiesta.hUrgenza.value = urg;
		
	if(urg == ''){
		urg = '0';
		document.richiesta.hUrgenza.value = urg;
	}
	
	//alert('URGENZA: ' + urg);	
	
	switch(urg){
	
		// Non urgente
		case '0':
			document.all.lblTitleUrgenza.innerText = 'Grado Urgenza: ' + document.all.btNonUrgenza.innerText;
			break;
		
		// Urgenza differita
		case '1':
			document.all.lblTitleUrgenza.innerText = 'Grado Urgenza: ' + document.all.btUrgenzaDifferita.innerText;
			break;
		
		// Urgenza
		case '2':
			document.all.lblTitleUrgenza.innerText = 'Grado Urgenza: ' + document.all.btUrgenza.innerText;
			break;
		
		// Emergenza
		case '3':
			document.all.lblTitleUrgenza.innerText = 'Grado Urgenza: ' + document.all.btEmergenza.innerText;
			break;
	}
	
	return;
}

function registra(){
	
	var mancano = '';
	var retStato = '';
	var doc = document.richiesta;
	//doc.action = 'SL_VisualizzaRichiestaGenerica';
	//doc.target = '_self';
	doc.method = 'POST';

	if(doc.selStatoPaz.value == '' || doc.Hiden_esa.value == '' || doc.hCDC.value == '' || (doc.hIdenMedPrescrittore.value == '0' || doc.hIdenMedPrescrittore.value == '') || (doc.txtQuesito.value == '' || doc.txtQuesito.value.length < 12))
	{
		if(doc.selStatoPaz.value == '')
			mancano += '- STATO PAZIENTE\n';	
		
		if(doc.hCDC.value == '')
			mancano += '- CENTRO DI COSTO \n';		
				
		if(doc.Hiden_esa.value == '')
			mancano += '- PRESTAZIONI \n';
			
		if(doc.hIdenMedPrescrittore.value == '0' || doc.hIdenMedPrescrittore.value == '')
			mancano += '- MEDICO PRESCRITTORE\n';	

		if(doc.txtQuesito.value == '' || doc.txtQuesito.value.length < 12)
			mancano += '- QUESITO CLINICO (esauriente)\n';			
		
		alert('Attenzione, inserire i seguenti campi:\n' + mancano);//alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
		return;
	}
	
	doc.registrazione.value = 'S';
	
	doc.hControindicazioni.value = '';
	for(i = 0; i < doc.selControindicazioni.length; i++)
    {
	 	doc.hControindicazioni.value = doc.hControindicazioni.value + doc.selControindicazioni.options[i].value + ',';
    }	
	if(doc.hControindicazioni.value.indexOf(",") > 0){
		doc.hControindicazioni.value = doc.hControindicazioni.value.substring(0, doc.hControindicazioni.value.length-1);
	}		
	//alert(doc.hControindicazioni.value);
	
	if(doc.hiden_testata_richieste.value == '')
		doc.tipo_registrazione.value = 'I';
	else
		doc.tipo_registrazione.value = 'M';
		
	doc.hCDC.value = doc.selCDC.value;
	
	var retStato = load_dati_page('RICHIESTA');
		
	if(retStato == '')
	{
		doc.submit();
	}
	else
	{
		alert('Errore nel dwr di Jack: ' + retStato);
	}	
}

function fine_registrazione(){
	chiudi();
}

/*
Caricamento della worklist delle richieste con i seguenti campi valorizzati:
nome, cognome e data di nascita.
*/
function carica_wk_richieste(){
	
	var doc = document.form;
	var window_opener = opener.name;

	if(window_opener == 'RicPazRecordFrame'){
		
		opener.parent.opener.parent.worklistTopFrame.document.form_ric_richieste.cognome.value = doc.cogn.value;
		opener.parent.opener.parent.worklistTopFrame.document.form_ric_richieste.nome.value = doc.nome.value;
		opener.parent.opener.parent.worklistTopFrame.document.form_ric_richieste.txtDataNascita.value = doc.data_paz.value;
		
		opener.parent.opener.parent.worklistTopFrame.ricerca();
		opener.parent.close();
		self.close();
	}
	
	if(window_opener == 'worklistMainFrame'){
		
		opener.parent.worklistTopFrame.document.form_ric_richieste.cognome.value = doc.cogn.value;
		opener.parent.worklistTopFrame.document.form_ric_richieste.nome.value = doc.nome.value;
		opener.parent.worklistTopFrame.document.form_ric_richieste.txtDataNascita.value = doc.data_paz.value;
		opener.parent.worklistTopFrame.ricerca();
		
		self.close();
	}
}



/*Se è un medico ad aver effettuato il login a scrivere una richiesta:
il campo Medico Richiedente verrà settato e non modificabile
*/
function disabilita_campo_medico(){
	
	if(baseUser.TIPO == 'M'){
		
		document.form.med_richiedente.disabled = true;
	}
}

/**
*/
function scheda_richiesta(){
	
	tutto_schermo();
	cambia_urgenza(''); 
	allarga_select('txtQuesito*txtQuadroClinico*txtNote*prestazioni*selPrestazioniErogate*selControindicazioni*txtMotivoAnnullamento');
}





/**
	GESTIONE RICERCA RICHIESTE
*/
function applica_filtro_richieste(url_new)
{	
	_DEFAULT_FIELD_FILTRO = 'hidWhere';	
	var doc = document.dati;
	var data_filtro		= clsDate.dateAddStr($('#txtDaData').val(),'DD/MM/YYYY','00:00','D',-30);
	var descrCdc='';
	
//	doc.WHERE_WK_EXTRA.value = " DATA_FILTRO>='"+clsDate.str2str(data_filtro,'DD/MM/YYYY','YYYYMMDD')+"'";
//	doc.WHERE_WK_EXTRA.value = " DATA_RICHIESTA_ORDER_BY>='20120601'";
//	utilCreaBoxAttesa();
//	utilMostraBoxAttesa(true);
	
	 if (typeof (WindowHome.EXTERN.cod_mda) !='undefined'){
	      	doc.WHERE_WK_EXTRA.value = " cod_mda='"+WindowHome.EXTERN.cod_mda.value+"'";
				$('#lblRepartiElenco').text(WindowHome.EXTERN.cod_mda.value);
		//	var $label = $("<label>").text('Date:');
	      	$('#lblReparti').parent().append('<label id=lblError>MDA</label>').removeClass('classTdLabelLink').addClass('classTdLabel');
	      	$('#lblReparti').remove();
	 }
	 
		
		  else if (typeof (WindowHome.EXTERN.cod_dec_Reparto) !='undefined'){	
	    	$('#hRepartiElenco').val('\''+WindowHome.EXTERN.cod_dec_Reparto.value+'\'');
	    	$('#lblReparti').parent().removeClass('classTdLabelLink').addClass('classTdLabel');
	    	
	    	  var rs = WindowHome.executeQuery("OE_Richiesta.xml","getDescrCdc",[WindowHome.EXTERN.cod_dec_Reparto.value]);
	    	    while (rs.next()) {
	    	    	descrCdc=rs.getString('DESCR');
	    	    }

	        	$('#lblRepartiElenco').text(descrCdc);
	        	$('#lblRepartiElenco').attr('title',WindowHome.EXTERN.cod_dec_Reparto.value);
	        	
	    }

	 
	
	 if ($('#txtDaData').val()=='' && ($('#txtCognome').val()=='' || $('#txtCognome').val().length<2))
            {
                return alert('Attenzione, inserire un intervallo di tempo inferiore a '+rangeGiorni+' giorni o valorizzare il campo "Cognome" (almeno i due caratteri iniziali)');
            }

	if ($('#txtCognome').val()=='' || $('#txtCognome').val().length<2){
		if(clsDate.difference.day($('#txtAData').val()!=''?clsDate.str2date($('#txtAData').val(),'DD/MM/YYYY'):new Date(),clsDate.str2date($('#txtDaData').val(),'DD/MM/YYYY'))>parseInt(rangeGiorni)){
			alert('Attenzione, inserire un intervallo di tempo inferiore a '+rangeGiorni+' giorni o valorizzare il campo "Cognome" (almeno i due caratteri iniziali)');	
			return;
		}
	}
	
	setVeloNero('oIFWk');
	applica_filtro(url_new);

}

function caricamento(){
	/*if(typeof document.dati != 'undefined')
	{
		var doc = document.dati;
			
		if(doc.txtDaData.value == '')
			doc.txtDaData.value = getToday();
		if(doc.txtAData.value == '')
			doc.txtAData.value = getToday();			
	}*/
}

function cmbStatoChange(stato){
	
	var cmb = document.getElementsByName("cmbStatoRichiesta")[0];

	if(typeof stato != 'undefined'){
		for (var i=0; i<cmb.options.length;i++){
			if(cmb.options[i].value == stato){
				cmb.options[i].selected = true;;
			}
		}
	}else{
		stato = cmb[cmb.selectedIndex].value;
	}
	
	var txtDaData,txtAData;

	switch (stato){
		case "'I'": txtDaData = getDateByRange(-2);		
					txtAData = "";
				break;
		case "'R'":	txtDaData = getDateByRange(-10);
					txtAData = getDateByRange(0);
				break;				
		default:	txtDaData= getDateByRange(0);
					txtAData = "";
				break;
	}

	document.dati.txtDaData.value = txtDaData;
	document.dati.txtAData.value = txtAData;	
	
	function getDateByRange(pRange){
		var vData = new Date();
		vData.setDate(vData.getDate()+pRange);
		return getData(vData,'DD/MM/YYYY');
	}
	
}

function getData(pDate,format){
	anno = pDate.getFullYear();	
	mese = '0'+(pDate.getMonth()+1);mese =  mese.substring(mese.length-2,mese.length);
	giorno = '0'+pDate.getDate();giorno =  giorno.substring(giorno.length-2,giorno.length);
	switch(format){
		case 'YYYYMMDD':	return anno+mese+giorno;
		case 'DD/MM/YYYY':	return giorno+'/'+mese+'/'+anno;		
	}
}
/**
*/
function intercettaTasti(){
	if(window.event.keyCode==13)
	{
		window.event.keyCode = 0;
		applica_filtro_richieste();
  	}
}

/**
*/
function resettaFiltri(){
	var doc = document.dati;
	
	doc.cmbStatoRichiesta[0].selected = true;
	doc.txtCognome.value = '';
	doc.txtNome.value = '';
	doc.txtDataNascita.value = '';
	doc.txtDaData.value = getToday();
	doc.txtAData.value = '';
}





/**

function applica_filtro_richieste___(url_new)
{
	var a_filtri = document.getElementsByAttribute('*', 'FILTRO_CAMPO_DESCRIZIONE');
	var a_valori = null;
	var where    = '';
	var campo    = '';
	var valore	 = '';
	var risp	 = '';
	var tmp_where;
	
	for(var idx_filtri = 0; idx_filtri < a_filtri.length; idx_filtri++)
	{	
		// Salvo il filtro!
		risp = salva_filtro(a_filtri[idx_filtri]);
		
		campo = a_filtri[idx_filtri].FILTRO_CAMPO_DB;
		valore = document.all[a_filtri[idx_filtri].FILTRO_CAMPO_VALORE].value;
		
		if(trim(valore) != '')
		{
			if(trim(where) != '')
			{
				where += ' and ';
			}
			
			if(a_filtri[idx_filtri].FILTRO_CAMPO_TIPO == 'DATE')
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
						
						tmp_where += campo + a_valori[idx_value] + '\'';
					}
					
					where += '(' + tmp_where;
				}
				else
				{
					where += '(' + campo + valore;
				}
			}
			
			if(campo.substr(campo.length - 1) == '(')
				where += ')'
			
			where += ')';
		}
	}
	
	if(typeof document.all['WHERE_WK_EXTRA'] != 'undefined')
	{
		if(trim(document.all['WHERE_WK_EXTRA'].value) != '')
		{
			if(trim(where) != '')
			{
				where += ' and ';
			}
			
			where += '(' + document.all['WHERE_WK_EXTRA'].value + ')';
		}
	}
	
	if(trim(where) != '')
	{
		where = 'where ' + escape(where);
	}
	
	if(typeof url_new != 'undefined')
	{
		document.all.oIFWk.SRC_ORIGINE = url_new;
	}
	
	where += ' and IDEN_PER='+baseUser.IDEN_PER;
	
	alert('applica_filtro_richieste: ' + where);
	
	document.all.oIFWk.src = document.all.oIFWk.SRC_ORIGINE + '&PAGINA_WK=' + _WK_PAGINE_ATTUALE + '&hidWhere=' + where;
}
*/



/*
	@param TRiden_urgenza contiene  TESTATA_RICHIESTE.iden + '@' + urgenza + '@' + v_globali.GERICOS_ALERT_ESA_URGENTE				
*/
/*
function stampa_richiesta(TRiden_urgenza_alert, nome, cognome, data_paz)
{
	var doc = document.form;

	var iden_urgenza_alert = TRiden_urgenza_alert.split("@");
	
	var TR_iden = iden_urgenza_alert[0];
	var urgenza = iden_urgenza_alert[1];
	var v_globali_alert = iden_urgenza_alert[2];
	
	//alert('TR.iden = ' + TR_iden + ' - urgenza = ' + urgenza + ' - v_globali.alert = ' + v_globali_alert);
	

	if(v_globali_alert == 'S' && urgenza != '0')
	{
		if(confirm('RICHIESTA DI URGENZA:Ricordarsi di telefonare al reparto. Effettuare stampa di Riepilogo?'))
		{
			var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_STD&stampaIdenTes=' + TR_iden + '&stampaAnteprima=S'+"","","top=0,left=0");
		
				if(finestra)
				{
					finestra.focus();
				}
				else
				{
					finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_STD&stampaIdenTes=' + TR_iden + '&stampaAnteprima=S'+"","","top=0,left=0");
				}
				carica_wk_richieste_stampa(nome, cognome, data_paz);	
		}
		else
			carica_wk_richieste_stampa(nome, cognome, data_paz);	
	}	
	else{
		self.close();
	}
}



function carica_wk_richieste_stampa(nome, cognome, data_paz)
{
	var doc = document.form;
	var window_opener = opener.name;
	
	if(window_opener == 'RicPazRecordFrame')
	{
		opener.parent.opener.parent.worklistTopFrame.document.form_ric_richieste.cognome.value = cognome;
		opener.parent.opener.parent.worklistTopFrame.document.form_ric_richieste.nome.value = nome;
		opener.parent.opener.parent.worklistTopFrame.document.form_ric_richieste.txtDataNascita.value = data_paz;
		
		opener.parent.opener.parent.worklistTopFrame.ricerca();
		opener.parent.close();
		self.close();
	}
	
	if(window_opener == 'worklistMainFrame')
	{
		opener.parent.worklistTopFrame.document.form_ric_richieste.cognome.value = cognome;
		opener.parent.worklistTopFrame.document.form_ric_richieste.nome.value = nome;
		opener.parent.worklistTopFrame.document.form_ric_richieste.txtDataNascita.value = data_paz;
		opener.parent.worklistTopFrame.ricerca();
		
		self.close();
	}
}
*/

/*
function apri_scan_db(procedura, campo)
{
	//alert(procedura + ' -- ' + campo);
	
	var read_only 		      = document.form.readonly.value;
	var permissioni_richieste = baseUser.COD_OPE.substring(2,3);
	
	if(read_only == 'false' && permissioni_richieste == 'X')
	{
		if(document.form.med_richiedente.disabled != 1 && procedura == 'TAB_PER_RICH')
		{
			var doc 			= document.form_scandb;
			doc.target 			= 'GRwinScanDb';
			doc.action 			= 'scanDB';
			doc.method		    = 'POST';
			doc.myric.value 	= campo;
			doc.myproc.value 	= procedura;
			doc.mywhere.value 	= '';
		
			var finestra = window.open('','GRwinScanDb','width=250,height=600, resizable = yes, status=yes, top=10,left=10');
			
			doc.submit();
		}
		
		if(procedura == 'TAB_SPAZ')
		{
			var doc 			= document.form_scandb;
			doc.target 			= 'GRwinScanDb';
			doc.action 			= 'scanDB';
			doc.method		    = 'POST';
			doc.myric.value 	= campo;
			doc.myproc.value 	= procedura;
			doc.mywhere.value 	= '';
		
			var finestra = window.open('','GRwinScanDb','width=250,height=600, resizable = yes, status=yes, top=10,left=10');
			
			doc.submit();
		}
	}
}

function apri_omino()
{
	var read_only 		= document.form.readonly.value;
	
	var permissioni_richieste = baseUser.COD_OPE.substring(2,3);
		
	if(read_only == 'false' && permissioni_richieste == 'X')
	{
		var servlet = 'sceltaEsami?next_servlet=javascript:prestazioni_richiedibili();&Ha_sel_iden='+document.form.Hiden_esa.value+'&tipo_registrazione=I';
		var finestra = window.open(servlet,'GRwinOmino','resizable = yes, status=yes');
	}
}
*/

