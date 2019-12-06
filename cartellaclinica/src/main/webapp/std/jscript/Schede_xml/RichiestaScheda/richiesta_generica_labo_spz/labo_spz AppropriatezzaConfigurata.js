var _filtro_list = null;
var P_registra = 'OK';
var elencoEsaAppr='';
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

	caricamento();
	
	switch (_STATO_PAGINA){

		// 	INSERIMENTO ////////////////////////////////
		case 'I':
		
			//ONBLUR  txtOraProposta
			jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
			//ONKEYUP  txtOraProposta
			jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			
			//ONBLUR  txtDataProposta
			jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
			
			//ONBLUR  txtAltezza
			jQuery("#txtAltezza").blur(function(){ controllaCampiNumerici(document.dati.txtAltezza ,document.all['lblAltezza']); });
			
			//ONBLUR  txtDiuresi_L
			jQuery("#txtDiuresi_L").blur(function(){ 
				controllaCampiNumerici(document.dati.txtDiuresi_L,document.all['lblDiuresi_L']);
				controllaDiuresi();
			});
			
			//ONBLUR  txtGravidanza_L
			jQuery("#txtGravidanza_L").blur(function(){ controllaCampiNumerici(document.dati.txtGravidanza_L,document.all['lblGravidanza_L']);});
			
			//ONBLUR  txtPeso
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });
			
			//ONLOAD  body
			valorizzaMed();
			document.all['lblStampa'].parentElement.style.display = 'none';
			nascondiCampi();
			cambiaPulsante();
			if(typeof document.EXTERN.URGENZA != 'undefined'){setUrgenzaScheda();}
			document.getElementById('txtDiuresi_ore').value='24'; 
			document.getElementById('txtDiuresi_ore').style.visibility='hidden'; 
			document.getElementById('lblDiuresi_ore').style.visibility='hidden'; 
			
		break;
		
		// MODIFICA ////////////////////////////////
		case 'E':
			
			//ONBLUR  txtAltezza
			jQuery("#txtAltezza").blur(function(){ controllaCampiNumerici(document.dati.txtAltezza ,document.all['lblAltezza']); });
				
			//ONBLUR  txtDiuresi_L
			jQuery("#txtDiuresi_L").blur(function(){ 
				controllaCampiNumerici(document.dati.txtDiuresi_L,document.all['lblDiuresi_L']);
				controllaDiuresi();
			});
			
			//ONBLUR  txtGravidanza_L
			jQuery("#txtGravidanza_L").blur(function(){ controllaCampiNumerici(document.dati.txtGravidanza_L,document.all['lblGravidanza_L']);});
					
			//ONBLUR  txtPeso
			jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });
					
			//ONLOAD  body
			valorizzaMed();
			setUrgenzaScheda();
			cambiaPulsante();
			if(document.EXTERN.MODIFICA.value== 'S'){HideLayer('groupUrgenzaLabo'); }
			$(".datepick-trigger").hide();
			document.getElementById('txtDiuresi_ore').value='24'; 
			document.getElementById('txtDiuresi_ore').style.visibility='hidden'; 
			document.getElementById('lblDiuresi_ore').style.visibility='hidden';
			
		break;
			
		// LETTURA ////////////////////////////////
		case 'L':
			
			//ONLOAD  body
			valorizzaMed();
			setUrgenzaScheda();
			cambiaPulsante();
			document.all['lblRegistraLabo'].parentElement.parentElement.style.display = 'none';
			if(document.EXTERN.LETTURA.value== 'S'){
				HideLayer('groupUrgenzaLabo');
			}			
			
		break;
	}
});

function caricamento(){
	
	try {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtUltimeMestrua);
		oDateMask.attach(document.dati.txtDataProposta);
	}catch(e){
		//alert(e.description);
	}
	
	document.all.lblTitleUrgenza_L.innerText = 'Grado Urgenza';
	
	dialog = document.createElement('div');
	dialog.id='dialog'; 
	dialog.className = 'jqmWindow jqmID1';
	document.body.appendChild(dialog);
	
	dialog2 = document.createElement('div');
	dialog2.id='dialog2'; 
	dialog2.className = 'jqmWindow jqmID1';
	document.body.appendChild(dialog2);
		
}
/**
/*
Funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico 
*/
function valorizzaMed(){
	
	//alert (baseUser.TIPO);
	
	if (baseUser.TIPO == 'M'){

		document.dati.Hiden_MedPrescr.value = baseUser.IDEN_PER; 
		document.dati.txtMedPrescr.value = baseUser.DESCRIPTION;
		jQuery('#txtMedPrescr').attr("readOnly",true);

	}
			
	if (typeof document.EXTERN.Hiden_pro != 'undefined'){	
	document.dati.Hiden_pro.value = document.EXTERN.Hiden_pro.value;
	}
}

//funzione che modifica la label del div a seconda del grado dell'urgenza
function setUrgenza(){
	
	var urgenza = document.all.hUrgenza.value;
	document.all.lblTitleUrgenza_L.innerText = 'Grado Urgenza';


	//controllo se la pagina è in modalità di inserimento
	if (_STATO_PAGINA == 'I'){
	
		svuotaListBox(document.dati.cmbPrestRich_L);     // svuoto il listbox degli esami e il campo nascosto
			
		switch(urgenza){
			// Non urgente
			case '0':
				
				if (document.all.lblTitleUrgenza_L.innerText == '    Grado Urgenza:  ' + ' URGENZA    '){
					//controllo se l'urgenza prima del click è diversa
					document.dati.HelencoEsami.value = '';
					
				}
				document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' ROUTINE    ';
				document.all.lblTitleUrgenza_L.className = '';
				addClass(document.all.lblTitleUrgenza_L,'routine');
				apriContenitoreLabo();
				break;
			
			// Urgenza
			case '2':
				
				if (document.all.lblTitleUrgenza_L.innerText == '    Grado Urgenza:  ' + ' ROUTINE    '){
					//controllo se l'urgenza prima del click è diversa
					document.dati.HelencoEsami.value = '';
					
				}
				
				document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' URGENZA    ';
				document.all.lblTitleUrgenza_L.className = '';
				addClass(document.all.lblTitleUrgenza_L,'urgenza');
				apriContenitoreLabo();
				break;
		}
		return;
	
	}else{	
		
		alert ('Impossibile modificare il grado di urgenza');	
	}
}

/**
*/
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
	
	//var controindicazioni = '';
	var esami = '';
	var metodiche = '';
	var esaMetodica = '';
	var doc = document.dati;
	var materiali = '';
	
/* 	//	Valorizza Hiden_controindicazioni leggendo i valori della ListBox cmbControindicazioni
	for(i = 0; i < doc.cmbControindicazioni.length; i++){
		
		if(doc.cmbControindicazioni.length-1 == i){
			controindicazioni += doc.cmbControindicazioni[i].value;
		}else{
			controindicazioni += doc.cmbControindicazioni[i].value + ',';
		}
	}
	 */
	//doc.Hiden_controindicazioni.value = controindicazioni;
		
	//	Valorizza HelencoEsami, HelencoMetodiche, Hmateriali leggendo i valori della ListBox cmbPrestRich_L dopo averli splittati [@] e ciclati
	for(var i = 0; i < doc.cmbPrestRich_L.length; i++){
		
		esaMetodica = doc.cmbPrestRich_L[i].value.split('@');

			if(esami != ''){
				esami += '#';
				metodiche += '#';
				materiali += '#';
			}		
		
		esami += esaMetodica[0];
		metodiche += esaMetodica[1];
		materiali += esaMetodica [2];
		
		//alert(esaMetodica[0]+'/n'+esaMetodica[1]);
	}
	
	doc.HelencoEsami.value = '';
	doc.HelencoMetodiche.value ='';
	doc.Hmateriali.value =''; 
	doc.HelencoEsami.value = esami;
	doc.HelencoMetodiche.value = metodiche;
	doc.Hmateriali.value = materiali;
	
	if (doc.Hiden_sc_labo_ins.value=='' || doc.Hiden_sc_micro_ins.value==''){
		
		if (doc.hUrgenza.value== '0'){
			doc.Hiden_sc_labo_ins.value=doc.Hiden_sc_labo.value;
		}else{
			doc.Hiden_sc_labo_ins.value=doc.Hiden_sc_labo_urg.value;
		}	
		doc.Hiden_sc_micro_ins.value=doc.Hiden_sc_micro.value;
		//doc.Hiden_sc_labo.value='';
		//doc.Hiden_sc_micro.value='';
	}
	
	//	Se in Inserimento o modifica, valorizza il cdc_destinatario
	if (document.EXTERN.LETTURA.value == 'N'){			
		doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
	}
	
	//	Obbliagatorietà di scelta di almeno una prestazione
	var al = '';
		
		if (doc.HelencoEsami.value == ''){		
			
			al = '-Scegliere prestazioni';
		
		}
		if (doc.txtOraProposta.value == '' && doc.txtOraProposta.STATO_CAMPO == 'O'){
			
			al += '\n\n-Inserire Orario Programmato Prelievo ';
		
		}
		
		if (al != ''){
	
			alert (al);
			return;
		}
		
		//controllo la lunghezza dell'ora e il formato
		controllaOraProposta();
			
	 // var debug = 'IDEN: ' + doc.Hiden.value;
	 // debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
	 // debug += '\nUTE_INS: ' + document.all.Hiden_op_rich.value;
	 // debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
	 // debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
	 // debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
	 // debug += '\nCONTROINDICAZIONI: ' + doc.Hiden_controindicazioni.value;
	 // debug += '\nESAMI: ' + doc.HelencoEsami.value;
	 // debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
	 // debug += '\nURGENZA: ' + doc.hUrgenza.value;
	 // debug += '\nNOTE: ' + doc.txtNote_L.value;
	 // debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
	 // debug += '\nQUESITO: ' + doc.txtQuesito_L.value;
	 // debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;
	 // debug += '\nMATERIALI: ' + doc.Hmateriali.value;

	 //alert(debug);
	
	if (P_registra == 'OK'){
		registra();
	}
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


//funziona che modifica la label in modalità visualizzazione/modifica
function setUrgenzaScheda(){

	var urgenza = document.EXTERN.URGENZA.value;

	document.all.hUrgenza.value = urgenza;
		
	switch(urgenza){
		// Non urgente
		case '0':
			document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' ROUTINE    ';
			document.all.lblTitleUrgenza_L.className = '';
			addClass(document.all.lblTitleUrgenza_L,'routine');
			break;
		
		// Urgenza
		case '2':
			document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' URGENZA    ';
			document.all.lblTitleUrgenza_L.className = '';
			addClass(document.all.lblTitleUrgenza_L,'urgenza');
			break;
	}
}

function stampa_scheda_richiesta(){
	
	var sf= '{TESTATA_RICHIESTE.IDEN}='+document.EXTERN.KEY_ID.value;
	var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_LABO_SPZ_0&stampaReparto=RICHIESTA_GENERICA_LABO_SPZ&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra){	
		finestra.focus();
	}else{
		finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_LABO_SPZ_0&stampaReparto=RICHIESTA_GENERICA_LABO_SPZ&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}
}

//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){
	document.all['lblMotAnn_L'].parentElement.style.display = 'none';
	document.all['txtMotivoAnnullamento_L'].parentElement.style.display = 'none';
	//document.all['txtDataRichiesta_L'].parentElement.style.display = 'none';
	//document.all['lblDataRichiesta_L'].parentElement.style.display = 'none';
	//document.all['txtOraRichiesta_L'].parentElement.style.display = 'none';
	//document.all['lblOraRichiesta_L'].parentElement.style.display = 'none';
	HideLayer('groupOperatoriLabo');
}

function controllaCampiNumerici(campo, label) {

	var descrizione = label.innerText;
	var contenutoDopoReplace = campo.value.replace (',','.');
	
	campo.value = contenutoDopoReplace;
	
//	alert ('contenuto dopo replace: '+campo.value);
//	alert ('campo: '+campo);
//	alert ('label: '+label);
//	alert ('contenuto: '+contenutoDopoReplace);
//	alert ('descrizione: '+descrizione);
	
	if (isNaN(campo.value)){
		alert ('il valore immesso in '+' " ' +descrizione+' " '+' non è un numero. Il campo richiede un valore numerico');
		campo.value= '';
		campo.focus();
		return;		
	}
}

//funzione che apre la servlet contenitore che contiene le servlet di scelta esami
function apriContenitoreLabo(){
	
	var url = '';
	var urgenza = document.all.hUrgenza.value;
	var idpagina = '';
	//var Iden_Pro='';
	
	//controllo se ho passato l'iden della provenienza alla pagina... se non l'ho passato sono in modifica e quindi lo prendo dalla pagina...
	if (typeof document.EXTERN.Hiden_pro == 'undefined' ){
		iden_Pro=document.dati.Hiden_pro.value; //lo prendo direttamente dal campo della pagina
	}else{
		iden_Pro=document.EXTERN.Hiden_pro.value; //lo prendo dai parametri passati in chiamata
	}
	
	//mi prendo i vari iden delle schede attive in questo momento per questo reparto e li splitto assegnandoli ai vari campi nascosti	
	var sql='SELECT resp from radsql.view_idenschede_reparti where iden='+iden_Pro;

	dwr.engine.setAsync(false);	
	toolKitDB.getResultData("select ("+sql+") from dual", callBack);
	dwr.engine.setAsync(true);
	
	function callBack(resp){
		
		var split=resp.toString().split('@');
		document.getElementById('Hiden_sc_labo').value=split[0];
		document.getElementById('Hiden_sc_labo_urg').value=split[1];
		document.getElementById('Hiden_sc_micro').value=split[2];
	
	}

	//a seconda di che urgenza prendo il valore del campo nascosto corretto e lo assegno alla variabile
	if (urgenza == '0'){
		var idenSchedaLabo=document.getElementById('Hiden_sc_labo').value;
	}else{
		var idenSchedaLabo=document.getElementById('Hiden_sc_labo_urg').value;
	}
	var idenSchedaMicro=document.getElementById('Hiden_sc_micro').value;
	
	
	//nel caso le due variabile siano vuote le valorizzo con gli iden scheda al momento dell'inserimento
	if (idenSchedaLabo==''){
		idenSchedaLabo=document.getElementById('Hiden_sc_labo_ins').value;
	}
	if (idenSchedaMicro==''){
		idenSchedaMicro=document.getElementById('Hiden_sc_micro_ins').value;
	}
	
/*	
/////////////////////TAPPULLO ASSOLUTAMENTE DA LEVARE////////decommentare in caso di bisogno///////////////////////////////////////////////////////////////////
		if (urgenza == '0'){
			if (idenSchedaLabo==''){
				idenSchedaLabo='2400';
			}
		}else{
			if (idenSchedaLabo==''){
				idenSchedaLabo='2401';
			}
		}
		if (idenSchedaMicro==''){
			idenSchedaMicro='2409';
		}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	

*/	
	
	//controllo l'urgenza della pagina e seleziono l'idpagina. Per ora sono solo due!!!
	if (urgenza == '0'){
		idpagina = '3';
	}
	
	if (urgenza == '2'){
		idpagina = '4';
	}
	
	if(document.EXTERN.LETTURA.value !="S" ){
	
		if (document.getElementById('Hiden_sc_labo_ins').value=='' && document.getElementById('Hiden_sc_micro_ins').value == ''){
		
			url = "sceltaEsamiLaboratorio?Hiden_pro="+iden_Pro+"&URGENZA="+urgenza+"&REPARTO="+document.EXTERN.HrepartoRicovero.value+"&IDPAGINA="+idpagina+"&Hiden_sc_labo="+idenSchedaLabo+"&Hiden_sc_micro="+idenSchedaMicro;
			window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
			// alert (url);
			
		}
		
		//controllo che non siano cambiate le schede degli esami richiedibili confrontandoli con l'iden delle schede al momento dell'inserimento; se si non possono modificare gli esami
		else if(idenSchedaLabo==document.getElementById('Hiden_sc_labo_ins').value || idenSchedaMicro==document.getElementById('Hiden_sc_micro_ins').value){
			
			url = "sceltaEsamiLaboratorio?Hiden_pro="+iden_Pro+"&URGENZA="+urgenza+"&REPARTO="+document.EXTERN.HrepartoRicovero.value+"&IDPAGINA="+idpagina+"&Hiden_sc_labo="+idenSchedaLabo+"&Hiden_sc_micro="+idenSchedaMicro;
			window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
			// alert (url);
			
		}else{
		
			
			url = "sceltaEsamiLaboratorio?Hiden_pro="+iden_Pro+"&URGENZA="+urgenza+"&REPARTO="+document.EXTERN.HrepartoRicovero.value+"&IDPAGINA="+idpagina+"&Hiden_sc_labo="+idenSchedaLabo+"&Hiden_sc_micro="+idenSchedaMicro;
			window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
			// alert (url);

			// alert('Non è possibile modificare gli esami per questa richiesta');
			// return;
		}
	}
}

//funzione che serve a formattare l'ora in inserimento. PER ORA NON FUNZIONA CON I NUMERI INSERITI DA TASTIERINO NUMERICO!!!!!!!!!!!!!!!!!!
function verificaOra(obj){
	
	obj.disableb = true;
		if(event.keyCode==8){ //backspace
			if(obj.value.toString().length==2 || obj.value.toString().length==3){
				obj.value=obj.value.substring(0,1);
			}
			obj.disabled = false;			
			return;		
		}
		if(obj.value.toString().length==1){
			if(event.keyCode>50 || event.keyCode<48)
				obj.value='';
			obj.disabled = false;			
			return;
		}
		if(obj.value.toString().length==2){
			if(parseInt(obj.value.substring(0,1),10)==2){
				if(event.keyCode>51 || event.keyCode<48)
					obj.value=obj.value.substring(0,1);
				else{
					obj.value=obj.value+':';}
			}else{
				if(event.keyCode>57 || event.keyCode<48)
					obj.value=obj.value.substring(0,1);
				else{
					obj.value=obj.value+':';}				
			}
			obj.disabled = false;
			return;		
		}	
		if(obj.value.toString().length==4){
			if(event.keyCode>53 || event.keyCode<48){
				obj.value=obj.value.substring(0,3);			
			}
			obj.disabled = false;
			return;		
		}
		if(obj.value.toString().length==5){
			if(event.keyCode>57 || event.keyCode<48){
				obj.value=obj.value.substring(0,4);			
			}
			obj.disabled = false;
			return;		
		}
		if(obj.value.toString().length>5){
			obj.value=obj.value.substring(0,5);	
			obj.disabled = false;
			return;
		}
}


//funzione che rende lo stato campo obbligatorio per l'ora proposta
function obbligaCampoProposta(campoCondizione, campoDestinazione, labelDestinazione){

	if (campoCondizione.value !=''){
	
		campoDestinazione.STATO_CAMPO = 'O';
		labelDestinazione.STATO_CAMPO = 'O';
		campoDestinazione.STATO_CAMPO_LABEL = labelDestinazione.name;
		
		//alert('className PRIMA: '+labelDestinazione.parentElement.className);
		
		if (labelDestinazione.parentElement.className != 'classTdLabel_O'){
		
			labelDestinazione.parentElement.className = ''; 
			addClass(labelDestinazione,'classTdLabel_O_O');
			//alert('className DOPO: '+labelDestinazione.parentElement.className);
		}
	}
}

function controllaDataProposta(){

	//alert('entro nella funzione controllaDataProposta');

	var dataProposta= document.all['txtDataProposta'].value;
	
	//alert('dataProposta: '+dataProposta);

	if (dataProposta!=''){
	
		if (dataProposta.length<10){
				
			alert('Inserire la data in un formato corretto (dd/MM/yyyy)');
				
			document.all['txtDataProposta'].value='';
			document.all['txtDataProposta'].focus();
		}	
		
		if(controllo_data(dataProposta).previous){
			
			alert('Attenzione! La data programmata per il prelievo è precedente alla data odierna');
			
			document.all['txtDataProposta'].value='';
			document.all['txtDataProposta'].focus();
			
		}
	}
}

//funzione che controlla la lunghezza del campo ora. Nel caso sia minore del dovuto cancella il campo e sposta il focus sul campo stesso. Da mettere sull'evento onblur	
function controllaOraProposta(){

	var oggetto = document.all['txtOraProposta']; 

	if (oggetto.value != ''){
		
		if (oggetto.value.toString().length < 4) {
		
			alert (' Formato ora errato \n\n Inserire l\'ora nel formato HH:MM'); 
			oggetto.value = '';
			oggetto.focus();
		}
	}
}

//funzione che controlla che il valore della diuresi sia maggiore uguale a 100
function controllaDiuresi(){

	var oggetto=document.getElementById('txtDiuresi_L');

	if(oggetto.value!='' && oggetto.value <100){
	
		alert('Attenzione! Il valore deve essere superiore a 100 ml');
		oggetto.value = '';
		oggetto.focus();
	}
}


//funzione che controlla l'appropriatezza esami
function controllaAppropriatezza(){
	
	var repartoRicovero=document.EXTERN.HrepartoRicovero.value;
	P_registra = 'OK';
	
	if (baseReparti.getValue(repartoRicovero,'CONTROLLO_APPROPRIATEZZA') == 'S'){
		
		var idenAnag=document.EXTERN.Hiden_anag.value;
		var doc=document.dati;
		var listaEsami='';
		var esami='';
		var data =document.getElementById('txtDataProposta').value;
		var dataProposta=data.substring(6,10) + data.substring(3,5) + data.substring(0,2);
		//alert(dataProposta);
	
		for(var i = 0; i < doc.cmbPrestRich_L.length; i++){
			
			listaEsami = doc.cmbPrestRich_L[i].value.split('@');
	
				if(esami != ''){
					esami += '#';
				}		
			
			esami += listaEsami[0];
			
		}
		
		if (dataProposta == ''){return;}
		
		sql = "{call ? := CONTROLLA_APPROPRIATEZZA("+ idenAnag+", '"+ esami+"','"+dataProposta+"','"+repartoRicovero+"')}";
		//alert(sql);
		
		dwr.engine.setAsync(false);	
		toolKitDB.executeFunctionData(sql, resp_check_appropriatezza);
		dwr.engine.setAsync(true);
		 
	}else{
		//alert('non faccio il controllo');
	}

}

function resp_check_appropriatezza(resp){
	
	//alert('resp.length '+resp.length);
	//alert('resp DEL CONTROLLA_APPROPRIATEZZA: '+resp);

	if (resp!=' '){
		
		var splitEsa = resp.split('@');
		//var elencoDescr= splitEsa[1].substring(0, splitEsa[0].length - 1);
		var splitdescr= splitEsa[1].split('*');
		
		var testo="<p>La richiesta non soddisfa i criteri di appropriatezza temporale <p><p>";
		
		for (var i = 0; i < splitdescr.length; i++){
			if (splitdescr[i]!=''){
				testo+='-';
				testo+=splitdescr[i];
				testo+='<BR><BR>';
			}
		}

		testo += "<p><p><p><p>Proseguire senza richiedere l\'esame/i non appropriato/i?<BR>(Premere invio per eliminare l'esame/i non appropriato/i<p> ";
		var html = '<div id="dialog" class="jqmDialog jqmdWide">'+testo;
		html +=  '<INPUT class=ieFocusBattolla id=btSI value=SI type=submit >';
		html += '<INPUT class=iefocus id=btNO value=NO type=submit></div>';
		document.getElementById('dialog').innerHTML = html;
		
		elencoEsaAppr = splitEsa[0];

		$('#dialog').jqm({overlay: 30, modal:true}); 
		jQuery('#dialog').jqmShow();
		jQuery("#btNO").click(function(e){ Appr_step2();});
		jQuery("#btSI").click(function(e){ cancEsa();});
	
	}else{
		preSalvataggio();
	}
}

function Appr_step2(){
	
	$('#dialog').jqmHide();
	
	var testo="La richiesta non soddisfa i criteri di appropriatezza.";
	var testo1="Proseguire senza richiedere l'esame/i non appropriato/i";
	var testo2="Forzare la richiesta";

	var html='<div id="dialog" class="jqmDialog jqmdWide"><p>'+testo;
	html += '</p><INPUT class=ieFocusBattolla id=btProcedere value="'+testo1+'" type=submit >';
	html += '<INPUT class=iefocus id=btForzare value="'+testo2+'" type=submit ></div>';
	
	document.getElementById('dialog2').innerHTML = html;

	$('#dialog2').jqm({overlay: 30 , modal:true}); 
	jQuery('#dialog2').jqmShow();
	jQuery("#btForzare").click(function(e){ P_registra='OK'; preSalvataggio(); $('#dialog2').jqmHide();});
	jQuery("#btProcedere").click(function(e){ cancEsa(); });
} 

function cancEsa(){
	 
	var elenco=$.trim(elencoEsaAppr);
	var splitElenco = elenco.split(',');
	//alert('splitElenco '+splitElenco);
	var combo=document.getElementById('cmbPrestRich_L').options;
	
	for (var i=0;i<splitElenco.length; i++){

		for (var x=0;x<combo.length; x++){
			
			esaMetodica = combo[x].value.split('@');
			//alert(esaMetodica[0] + '==' + splitElenco[i] + ' --> ' + (esaMetodica[0] == splitElenco[i]));

			if (esaMetodica[0] == splitElenco[i]){

				//jQuery("#cmbPrestRich_L").remove(x);
				document.getElementById('cmbPrestRich_L').removeChild(combo[x]);
			}	
		}
	}
	
	try{$('#dialog').jqmHide();}catch(e){};
	try{$('#dialog2').jqmHide();}catch(e){};
	
	P_registra='OK';
	//return;
	if (document.getElementById('cmbPrestRich_L').options.length == 0){
		
		alert('La richiesta è senza esami associati');
		chiudiScheda();
	}else{
		preSalvataggio();
	}
}