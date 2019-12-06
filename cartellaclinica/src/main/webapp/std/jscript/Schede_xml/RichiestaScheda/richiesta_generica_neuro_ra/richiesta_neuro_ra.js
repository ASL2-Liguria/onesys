var _filtro_list = null;
var dataAppuntamento = '';
var albero='';
var controllo = 0; //variabile che permette di aprire e chiudere l'albero.
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

	caricamento(_STATO_PAGINA);
	$('SELECT[name=cmbPrestRich]').dblclick(function(){
		remove_elem_by_sel('cmbPrestRich'); 
		$('#txtQuesito').val('');
	});	
	
	$("[name='radAllergie']").click(function(){		
		if (document.all.radAllergie[1].checked) {
			$('#txtAllergie').val('').attr('disabled','disabled');
		}
		else{
			$('#txtAllergie').val('').removeAttr('disabled');
		} 
	});
	$("[name='radControind']").click(function(){		
		if (document.all.radControind[1].checked) {
			$('#txtControind').val('').attr('disabled','disabled');;
			} 
		else{
			$('#txtControind').val('').removeAttr('disabled');
		}			
	});
	
	$('div[class="pulsanteUrgenza0"]>a').prepend('<IMG style="margin-right:3px;"  onclick="javascript:openInfoUrgenza(0);" border=0 WIDTH=18 src="imagexPix/interrogativo.png">');
	$('div[class="pulsanteUrgenza1"]>a').prepend('<IMG style="margin-right:3px;"  onclick="javascript:openInfoUrgenza(1);" border=0 WIDTH=18 src="imagexPix/interrogativo.png">');
	$('div[class="pulsanteUrgenza2"]>a').prepend('<IMG style="margin-right:3px;"  onclick="javascript:openInfoUrgenza(2);" border=0 WIDTH=18 src="imagexPix/interrogativo.png">');
	$('div[class="pulsanteUrgenza3"]>a').prepend('<IMG style="margin-right:3px;"  onclick="javascript:openInfoUrgenza(3);" border=0 WIDTH=18 src="imagexPix/interrogativo.png">');
	
	$("[name='radAllergie']").parent().width('200px');
	
	switch (_STATO_PAGINA){
		
		// 	INSERIMENTO ////////////////////////////////
		case 'I':
		
	
			//ONLOAD  body
			valorizzaMed();
			cambiaPulsante();
			nascondiCampi();
			if(typeof document.EXTERN.URGENZA != 'undefined'){
				setUrgenzaScheda();
			}else{
				document.all.hUrgenza.value = '0';
				setUrgenza();
			}			
		
		break;
		
				//MODIFICA
		case 'E':
			
	
			//ONLOAD  body
			//valorizzaMed();
			cambiaPulsante();
			nascondiCampi();
			if(typeof document.EXTERN.URGENZA != 'undefined'){
				setUrgenzaScheda();
			}else{
				document.all.hUrgenza.value = '0';
				setUrgenza();
			}			
		
		break;
		
		// LETTURA ////////////////////////////////
		case 'L':
			
			//ONLOAD  body
			valorizzaMed();
			setUrgenzaScheda();
			cambiaPulsante();
			document.all['lblRegistra'].parentElement.parentElement.style.display = 'none';
			if(document.EXTERN.LETTURA.value== 'S'){
				//HideLayer('groupUrgenza');
				HideLayerFieldset('divGroupUrgenza');
			}
			
		break;
	}
});

function caricamento(statoPagina){
	
	//funzione che carica la data proposta se arriva in input	
	if(statoPagina == 'I'){
		caricaDataOraInput();
	}
	

	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
}

// funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico
function valorizzaMed(){
	
	//alert (baseUser.TIPO);
	
	if (document.EXTERN.LETTURA.value != 'S') {
	
		if (baseUser.TIPO == 'M'){
		
			document.dati.Hiden_MedPrescr.value = baseUser.IDEN_PER; 
			document.dati.txtMedPrescr.value = baseUser.DESCRIPTION;
			document.dati.Hiden_op_rich.value = baseUser.IDEN_PER; 
			document.dati.txtOpRich.value = baseUser.DESCRIPTION;
			jQuery('#txtMedPrescr').attr("readOnly",true);

		}else{
		
			document.dati.Hiden_op_rich.value = baseUser.IDEN_PER; 
			document.dati.txtOpRich.value = baseUser.DESCRIPTION;	
		}
	}
				
	if (typeof document.EXTERN.Hiden_pro != 'undefined'){	
		document.dati.Hiden_pro.value = document.EXTERN.Hiden_pro.value;
	}
}

//funzione che modifica la label del div a seconda del grado dell'urgenza
function setUrgenza(){
	
	var urgenza = document.all.hUrgenza.value;
	document.all.lblTitleUrgenza.innerText = 'Grado Urgenza';

	//controllo se la pagina è in modalità di inserimento
	if (_STATO_PAGINA != 'L'){


	
	if(urgenza == ''){
		document.all.hUrgenza.value = '0';
		urgenza = '0';
	}
		
	switch(urgenza){
	
		// Non urgente
		case '0':
			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' ROUTINE    ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'routine');
			break;
		
		// Urgenza differita
		case '1':
			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' URGENZA DIFFERITA    ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'urgenzaDifferita');
			break;
		
		// Urgenza
		case '2':
			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' URGENZA    ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'urgenza');
			break;
		
		// Emergenza
		case '3':
			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' EMERGENZA   ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'emergenza');
			break;
	}
	
	return;
	
	}else{
	
		alert ('Impossibile modificare il grado di urgenza in modalità visualizzazione');
	
	}
	
}

/**
*/
//funzione commentata per un eventuale gestione della scelta esami diversa dal listbox
function scegli_prestazioni(){
	
	var url = null;
	var popup = null;
	var esaMetodica='';
	var esami='';

	for(var i = 0; i < document.dati.cmbPrestRich.length; i++){
			
		esaMetodica = document.dati.cmbPrestRich[i].value.split('@');
		//alert (esaMetodica);

		if (esami != ''){
			esami += ',';
		}
			
		esami += "'"+esaMetodica[0]+"'";
		//alert(esami)
	}
		
	//alert(esami);
	
	if (document.EXTERN.LETTURA.value != "S"){
	
		url = 'servletGenerator?KEY_LEGAME=SCELTA_ESAMI';
		url += '&CDC=' + document.EXTERN.DESTINATARIO.value;
		url += '&SITO=' + document.EXTERN.DESTINATARIO.value;
		url += '&ESAMI='+esami;
		url += '&RICHIEDENTE=' + document.EXTERN.HrepartoRicovero.value;
		url += '&TIPO=R';
		url += '&REPARTO=' + document.EXTERN.HrepartoRicovero.value;
		url += '&URGENZA=' + document.all.hUrgenza.value;
	
		popup = window.open(url, "", "status = yes, scrollbars = yes");
		if(popup){
			popup.focus();
		}else{
			popup = window.open(url, "", "status = yes, scrollbars = yes");
		}
	}
}

function genera_stringa_codici(sel, carattere){
	
	//alert(sel + '\n ' + carattere);
	var idx;
	var ret = '';
	
	for(idx = 0; idx < sel.length; idx++){
		
		if(ret != ''){
			ret += carattere; //'*';
		}
		
		ret += sel[idx].value;
	}
	
	return ret;
}

/**
*/
//funzione che 'prepara' i dati e valorizza i campi nascosti per il salvataggio. Alla fine lancia registra()
function preSalvataggio(){

	var esami = '';
	var metodiche = '';
	var mdc_sino = '';
	var esaMetodica = '';
	var doc = document.dati;
	
	if (document.all.hUrgenza.value == ''){
			alert ('scegliere Urgenza');
			return;		
	}
	
	if ($("input[name=radAllergie]:checked").val() == 'S' && $("#txtAllergie").val()==''){
		alert ('Inserire allergie');
		return;		
	}
	
	if ($("input[name=radControind]:checked").val() == 'S' && $("#txtControind").val()==''){
		alert ('Inserire controindicazioni');
		return;		
	}

	
	for(i = 0; i < doc.cmbPrestRich.length; i++){
		
		esaMetodica = doc.cmbPrestRich[i].value.split('@');
	
		if(esami != ''){
			
			esami += '#';
			metodiche += '#';
	//		mdc_sino+='#';
		}
		
		esami += esaMetodica[0];
		metodiche += esaMetodica[1];
	//	mdc_sino += esaMetodica[2];
		
		//alert(esaMetodica[0]+'/n'+esaMetodica[1]);
	}
	
	doc.HelencoEsami.value = '';
	doc.HelencoEsami.value = esami;
	doc.HelencoMetodiche.value = metodiche;
	
	if (document.EXTERN.LETTURA.value == 'N'){
		
		doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
	}
	
	//	Obbligatorietà di scelta di almeno una prestazione
	var al = '';
	
	if (doc.HelencoEsami.value == ''){		
		
		al = '-Scegliere prestazioni\n';
	}

	/**
	 * @author  gianlucab
	 * @version 1.0
	 * @since   2014-04-04
	 *//*
	// Obbligatorietà di scelta della modalità di accesso
	if (doc.cmbModAccesso.value == ''){
		al += '-Selezionare la modalità di accesso\n';
	}
	// Verifica la presenza degli altri dati amministrativi se la provenienza è esterna
	var provenienza = "I";
	if (provenienza == "E"){
		if (doc.txtNumImp.value == ''){
			al += '-Inserire il numero dell\'impegnativa\n';
		}
		if (doc.txtOnere.value == ''){
			al += '-Selezionare l\'onere\n';
		}
		if (doc.cmbTicket.value == ''){
			al += '-Selezionare il ticket\n';
		}
		if (doc.txtCodEsenzione.value == ''){
			al += '-Inserire il codice esenzione\n';
		}
		if (doc.txtRicetta.value == ''){
			al += '-Inserire la ricetta\n';
		}
		if (doc.txtDataRicetta.value == ''){
			al += '-Inserire la data della ricetta\n';
		}
		if (doc.cmbTipoRicetta.value == ''){
			al += '-Selezionare il tipo di ricetta modalità di accesso\n';
		}
		if (doc.cmbClassePriorita.value == ''){
			al += '-Selezionare la classe di priorità\n';
		}
		if (doc.cmbModPrescr.value == ''){
			al += '-Selezionare la modalità di prescrizione\n';
		}
		if (doc.txtCodDSA.value == ''){
			al += '-Inserire il codice DSA\n';
		}
		if (doc.cmbTipoDSA.value == ''){
			al += '-Selezionare il tipo di DSA\n';
		}
	}*/
	
	if (al != ''){
	
		alert (al);
		return;
	}
	
	if(document.all.hUrgenza.value=='1' || document.all.hUrgenza.value=='2' || document.all.hUrgenza.value=='3'){		
		alert('La richiesta va accompagnata da una telefonata');
	}
	
/*	  if(metodiche.indexOf('4')>=0 || mdc_sino.indexOf('S')>=0){
			alert('Attenzione: ricordarsi di stampare, far firmare al paziente e consegnare alla Radiologia il modulo del consenso');
		}*/

	
	registraScheda();
	
}

/**
*/
function chiudi(){
	//alert(parent.name);
	if(parent.name == 'WHALE_winVisRich'){
		parent.opener.aggiorna();
		self.close();
	}else{
        WindowCartella.apriWorkListRichieste();
	}
}

function svuotaListBox(elemento){
	
	var object;
	var indice;
	
	if (typeof elemento == 'String')
		object = document.getElementById(elemento);
	else
		object = elemento;

	
	if (object){
		indice = parseInt(object.length);
		while (indice>-1)
		{
			object.options.remove(indice);
			indice--;
		}
	}
}

//funziona che modifica la label in modalità visualizzazione/modifica
function setUrgenzaScheda(){
	
	var urgenza = document.EXTERN.URGENZA.value;

	document.all.hUrgenza.value = urgenza;
		
	switch(urgenza){
	
		// Non urgente
		case '0':
			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' ROUTINE    ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'routine');
			break;
		
		// Urgenza differita
		case '1':
			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' URGENZA DIFFERITA    ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'urgenzaDifferita');
			break;
		
		// Urgenza
		case '2':
			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' URGENZA    ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'urgenza');
			break;
		
		// Emergenza
		case '3':
			document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' EMERGENZA   ';
			document.all.lblTitleUrgenza.className = '';
			addClass(document.all.lblTitleUrgenza,'emergenza');
			break;
	}
}


//funzione che impedisce il salvataggio in modalità visualizzazione
function registraScheda(){
	
//	alert (document.EXTERN.LETTURA.value);

	
	if (document.EXTERN.LETTURA.value == 'S'){
		
		alert ('Impossibile salvare in modalità VISUALIZZAZIONE');
		return;
	}else{
	
		registra();
	
	}

}

function chiudiAlbero(){
	
	HideLayer('groupCDC');	
}

function appendDivACR(obj){

	if(!document.all['clsACR']){
		divAcr = document.createElement('DIV');
		divAcr.id='clsACR'; 
		divAcr.className = 'clsACR';
		obj.appendChild(divAcr);
	}

	creaDivACR('clsACR', 0, 'SCELTA_SCHEDA_RICHIESTA', chiudiAlbero);
}


//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){

	document.all['lblMotAnn'].parentElement.style.display = 'none';
	document.all['txtMotivoAnnullamento'].parentElement.style.display = 'none';
	document.all['txtDataRichiesta'].parentElement.style.display = 'none';
	document.all['lblDataRichiesta'].parentElement.style.display = 'none';
	document.all['txtOraRichiesta'].parentElement.style.display = 'none';
	document.all['lblOraRichiesta'].parentElement.style.display = 'none';
	HideLayerFieldset('divGroupOperatori');
}

function controllaCampiNumerici(campo, label) {

	var descrizione = label.innerText;
	var contenutoDopoReplace = campo.value.replace (',','.');
	
	campo.value = contenutoDopoReplace;
	
	if (isNaN(campo.value)){
		alert ('il valore immesso in '+' " ' +descrizione+' " '+' non è un numero. Il campo richiede un valore numerico');
		campo.value= '';
		campo.focus();
		return;		
	}
}


function controllaCampiNumerici(campo, label) {

	var descrizione = label.innerText;
	var contenutoDopoReplace = campo.value.replace (',','.');
	
	campo.value = contenutoDopoReplace;
	
	if (isNaN(campo.value)){
		alert ('il valore immesso in '+' " ' +descrizione+' " '+' non è un numero. Il campo richiede un valore numerico');
		campo.value= '';
		campo.focus();
		return;		
	}
}
/*
function stampa_scheda_richiesta(){

	var sf;
	var funzione;
	var reparto;
	var anteprima;
	var idRichiesta='';
	var stampante = null;
	
	var keyLegame       	= document.EXTERN.KEY_LEGAME.value;
	var versione        	  	= document.EXTERN.VERSIONE.value;
	var cdcDestinatario  	= document.EXTERN.DESTINATARIO.value;	

	if (document.EXTERN.LETTURA.value == 'N'){
	
		//alert (document.EXTERN.ID_STAMPA.value);
		idRichiesta = document.EXTERN.ID_STAMPA.value;
		//alert(idRichiesta);
		
		if (idRichiesta == ""){
			alert ('Salvataggio non effettuato');
			return;
			}
	}
	
	if (document.EXTERN.LETTURA.value == 'S'){
	
		//alert(document.EXTERN.KEY_ID.value);
		idRichiesta = document.EXTERN.KEY_ID.value;
		//alert (idRichiesta);
	}

	//sf= "{TESTATA_RICHIESTE.IDEN}="+idRichiesta;
	sf= "{VIEW_VIS_RICHIESTA_REPORT.IDEN}="+idRichiesta;
	funzione = cdcDestinatario + '_' + keyLegame + '_' + versione ;
	reparto = cdcDestinatario;
	
	if(basePC.PRINTERNAME_REF_CLIENT==''){
		anteprima='S';
	}else{
		anteprima='N';
	}	
	
	url =  'elabStampa?stampaFunzioneStampa='+funzione;
	url += '&stampaAnteprima='+anteprima;
	url += '&ServletStampe=N';
	
	if(reparto!=null && reparto!='')
		url += '&stampaReparto='+reparto;	
	if(sf!=null && sf!='')
		url += '&stampaSelection='+sf;	
	if(stampante!=null && stampante!='')
		url += '&stampaStampante='+stampante;	
	
	var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra){ 
		finestra.focus();
	}else{
    	finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}
	
	return 0;
}*/

function obbligaCampiSino(){

	var esaMetodica = '';
	var arrayEsami = new Array();

	for(var i = 0; i < document.dati.cmbPrestRich.length; i++){

		esaMetodica = document.dati.cmbPrestRich[i].value.split('@');
		arrayEsami.push(esaMetodica[0]);
	}

	//alert('arrayEsami: '+arrayEsami);
	
	var sql="select count(*) from radsql.TAB_ESA where IDEN in ("+arrayEsami+") and MDC_SINO='S'";
	
	if(baseUser.LOGIN=='lucas'){
		alert('lucas.sql: '+sql);
	}
	
	//deve essere un array diviso da virgole altrimenti manda in errore il dwr
	//cerco se tra gli esami scelti ce ne sia uno o più con TAB_ESA.MDC_SINO = 'S'

	dwr.engine.setAsync(false);	
	toolKitDB.getResultData(sql, checkEsami);
	dwr.engine.setAsync(true);
}


function checkEsami(resp){

	if(baseUser.LOGIN=='lucas'){
		alert ('lucas.resp chechEsami: '+resp);
	}
	
	if(!jQuery('input#radioNoContro').attr("checked")){
		//alert('ho schiacciato si');
		if (resp>0){		

			if (document.all['lblControindicazioni'].parentElement.style.display == 'none'){
			
				document.all['lblControindicazioni'].parentElement.style.display = 'block';
				document.all['cmbControindicazioni'].parentElement.style.display = 'block';
			}
						
				jQuery('label#lblPresControindicazioni').parent().attr("STATO_CAMPO","O");
				jQuery('input#radioSiContro , input#radioNoContro').attr("STATO_CAMPO","O");
				jQuery('input#radioSiMDC , input#radioNoMDC').attr("STATO_CAMPO","O");
				obbligaCampo(document.all['Hiden_controindicazioni'], document.all['lblControindicazioni']);	   //chiedere a Marco
		}else{
			

			jQuery('input#radioSiMDC , input#radioNoMDC').attr("STATO_CAMPO","E");
			
		}

	}else{
		
		//alert('ho schiacciato no');
		//alert(document.all['Hiden_controindicazioni'].STATO_CAMPO);
		document.all['Hiden_controindicazioni'].STATO_CAMPO='E';
		jQuery('#lblControindicazioni').attr("STATO_CAMPO","E");
		jQuery('#cmbControindicazioni').attr("STATO_CAMPO","E");
		jQuery('label#lblPresControindicazioni').parent().attr("STATO_CAMPO","E");
		jQuery('input#radioSiMDC , input#radioNoMDC').attr("STATO_CAMPO","E");
		jQuery('input#radioSiContro , input#radioNoContro').attr("STATO_CAMPO","E");
		
	}
}



function apriAlberoPrestazioni(){
	
	if (document.EXTERN.LETTURA.value != "S"){
		//albero da creare
		if (controllo == 0){

			try{
				albero = NS_CascadeTree.append('#divGroupPrestazioni',{gruppo:'APPROPRIATEZZA_RAVENNA',abilita_ricerca_descrizione:'N',abilita_ricerca_codice:'N',onSelection:selezioneRamo,CreaNascosto:'N'});
				controllo=1;
			}catch(e){
				alert(e.description);
			}

			//albero da nascondere
		}
		else if(controllo == 1){

			albero.hide();
			controllo=2;

			//albero da mostrare
		}else if(controllo == 2){

			albero.show();
			controllo=1;
		}
	}
}

function  selezioneRamo (obj) {
//	alert(obj);
	
	$('#hAlberoPath').val(obj.path);
	$('#hAlberoCodice').val(obj.codice);
	
	if (obj.codice=='OMINO') {
		scegli_prestazioni();
	}
	else{
		
		eval('var vCodice='+obj.codice);
		$('SELECT[name=cmbPrestRich]').append('<option value='+vCodice.iden_esa+'@'+vCodice.metodica+'@'+vCodice.mdc+'>'+obj.descrizione+'</option>');

		if($('#txtQuesito').val()==''){
			$('#txtQuesito').val(obj.path_descr.substr(0,obj.path_descr.lastIndexOf("/")));	
		}
		else{
			$('#txtQuesito').val($('#txtQuesito').val()+' - '+obj.path_descr.substr(0,obj.path_descr.lastIndexOf("/")));
		}
	
	}
	
	controllo=2;
	albero.hide();

}

function apriInfo(url){
	var vObj = '<iframe frameBorder="0" width="280" height="280" src="'+WindowCartella.NS_APPLICATIONS.getApplicationPath("REPOSITORY")+url+'"></iframe>';

    WindowCartella.Popup.append({
		title:"Informazioni",
		obj:vObj,
		width:300,
		height:320,
		position:[event.clientX+10,event.clientY+70]
	});
}


function openInfoUrgenza(a){
	
    var vObj = '';
	
    switch(a){
    case 0:
        vObj='<div>TEMPI:<br>Ordinario: RX 1 gg, TC 3gg, ECO max 2gg, RM 3-4gg<br>DH e post ricovero: tutti gli esami entro 30gg</div>';	
        break;
    case 1:
        vObj='<div>La richiesta con urgenza differita va accompagnata da una telefonata e verrà valutata dalla radiologia</div>';	
        break;
    case 2:
        vObj='<div>La richiesta urgente va accompagnata da una telefonata e verrà valutata dalla radiologia<br>TEMPI:<br>RX subito, TC 1-2gg, ECO in giornata </div>';	
        break;
    case 3:
        vObj='<div>La richiesta con emergenza va accompagnata da una telefonata e verrà valutata dalla radiologia<br>TEMPI:<br>RX il prima possibile, TC il prima possibile, ECO il prima possibile </div>';	
        break;

    }

    WindowCartella.Popup.append({
		title:"Informazioni",
		obj:vObj,
		width:330,
		height:150,
		position:[event.clientX+10,event.clientY+70]
	});
}

function salvaContrAllergie(){
	
	var utente = document.EXTERN.USER_ID.value;
	var user_login = document.EXTERN.USER_LOGIN.value;
//	var iden_visita= document.EXTERN.HidenVisita.value;
	var iden_anag= document.EXTERN.Hiden_anag.value;
	
		rs = top.executeStatement("OE_Richiesta.xml","gestContrAllergie",[utente, user_login,iden_anag,$('#txtAllergie').val(),$('#txtControind').val()]);
	
	if(typeof document.EXTERN.Hiden_visita!="undefined"){
		top.apriWorkListRichieste();
	}
	else{
		parent.self.close();
	}

}

