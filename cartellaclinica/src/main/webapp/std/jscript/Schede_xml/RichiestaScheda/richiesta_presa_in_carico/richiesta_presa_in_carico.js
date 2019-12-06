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
			
			//ONLOAD  body
			document.getElementById('lblTitleUrgenza').innerText='Grado di urgenza: ';
			document.all.hUrgenza.value='0';
			setUrgenza();
			valorizzaMed();
			cambiaPulsante();
			nascondiCampi();
			setEvents();
		break;	
		// 	MODIFICA ////////////////////////////////
		case 'E':
			//ONLOAD  body
			setUrgenzaScheda();
			valorizzaMed();
			nascondiCampi();
			cambiaPulsante();
			setEvents();
		break;
		
		// LETTURA ////////////////////////////////
		case 'L':		
			//ONLOAD  body
			valorizzaMed();	
			cambiaPulsante();
		break;
	}

});


//funzione richiamata all'onload della pagina
function caricamento(){
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}

	document.all.lblTitleUrgenza.innerText='Grado urgenza';
	
	//nascondo in lettura il tasto registra
	if (document.EXTERN.LETTURA.value=='S'){
		document.getElementById('lblRegistra').parentElement.style.display='none';
	}else{
		jQuery('#txtOpeRich').attr("readOnly",true);
	}
	
	document.getElementById('Hiden_anag').value = document.EXTERN.Hiden_anag.value;
	
	$("#lblRepartoRic").parent().css("width","170px").removeClass('classTdLabelLink').addClass('classTdLabel_O_O');
	$("#txtRepartoRic").attr("readOnly",true);
	
}                    

// funzione che valroizza i campo medico e operatore
function valorizzaMed(){
	
	//alert ('BASEuSER.tipo: '+baseUser.TIPO);
	
	if (document.EXTERN.LETTURA.value != 'S') {
	
		if (baseUser.TIPO == 'M'){
		
			document.dati.Hiden_MedPrescr.value = baseUser.IDEN_PER; 
			document.dati.txtMedPrescr.value = baseUser.DESCRIPTION;
			document.dati.Hiden_op_rich.value = baseUser.IDEN_PER; 
			document.dati.txtOpeRich.value = baseUser.DESCRIPTION;
			//jQuery('#txtMedPrescr').attr("readOnly",true);

		}else{
		
			document.dati.Hiden_op_rich.value = baseUser.IDEN_PER; 
			document.dati.txtOpeRich.value = baseUser.DESCRIPTION;
		}
	}
			
	if (typeof document.EXTERN.Hiden_pro != 'undefined'){	
		document.dati.Hiden_pro.value = document.EXTERN.Hiden_pro.value;
	}
}

//funzione che modifica la label del div a seconda del grado dell'urgenza
function setUrgenza(){
	
	var urgenza = document.all.hUrgenza.value;
	//controllo se la pagina è in modalità di inserimento
//	if (_STATO_PAGINA == 'I'){
			
		switch(urgenza){
			// Non urgente
			case '0':
				if (document.all.lblTitleUrgenza.innerText == '    Grado Urgenza:  ' + ' URGENZA    '){
					//controllo se l'urgenza prima del click è diversa
					document.dati.HelencoEsami.value = '';
				}
				
				document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' Non Urgente    ';
				document.all.lblTitleUrgenza.className = '';
				addClass(document.all.lblTitleUrgenza,'routine');
				break;
			
			// Urgenza
			case '2':
				if (document.all.lblTitleUrgenza.innerText == '    Grado Urgenza:  ' + ' ROUTINE    '){
					
				}
				
				document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  ' + ' Urgente    ';
				document.all.lblTitleUrgenza.className = '';
				addClass(document.all.lblTitleUrgenza,'urgenza');
				break;
		}
		return;
	
	/*}else{	
		alert ('Impossibile modificare il grado di urgenza');	
	}*/
}

//funziona che modifica la label in modalità visualizzazione/modifica
function setUrgenzaScheda(){
	
	var urgenza = document.EXTERN.URGENZA.value;
	document.all.lblTitleUrgenza.innerText = 'Grado Urgenza';

	document.all.hUrgenza.value = urgenza;

		switch(urgenza){
			// Non urgente
			case '0':
				document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  NON URGENTE    ';
				document.all.lblTitleUrgenza.className = '';
				addClass(document.all.lblTitleUrgenza,'routine');
				break;
			
			// Urgenza
			case '2':
				document.all.lblTitleUrgenza.innerText = '    Grado Urgenza:  URGENZA    ';
				document.all.lblTitleUrgenza.className = '';
				addClass(document.all.lblTitleUrgenza,'urgenza');
				break;
		}
}

//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){

	HideLayerFieldset("divGroupOperatori");
	HideLayerFieldset("divGroupDatiAmministrativi");
}

//funzione che 'prepara' i dati e valorizza i campi nascosti per il salvataggio. Alla fine lancia registra()
function preSalvataggio(){	
	
	if($('#divComCardio input:checked').length==0){
		return alert('Compilare la sezione \"Comorbilità cardiologiche\".');
	}
	if($('#divComResp input:checked').length==0){
		return alert('Compilare la sezione \"Comorbilità respiratorie\".');
	}
	if($('#divComInf input:checked').length==0){
		return alert('Compilare la sezione \"Comorbilità infettive\".');
	}
	if($('#divComNeuro input:checked').length==0){
		return alert('Compilare la sezione \"Comorbilità neurologiche\".');
	}
	if($('#divGroupCapacita input:checked').length==0){
		return alert('Compilare la sezione \"Capacità funzionale pregressa\".');
	}
	if($('#divGroupCarico input:checked').length==0){
		return alert('Compilare la sezione \"Carico\".');
	}
	if($('#divArt input:checked').length==0){
		return alert('Compilare la sezione \"Articolarità\".');
	}

	if($('#divGroupTutore input[name=radTutore]:checked').val()==undefined){
		return alert('Compilare la sezione \"Tutore o ortesi\".');
	}

	
	var doc = document.dati;
	if (_STATO_PAGINA=='I'){
		doc.HelencoEsami.value = document.EXTERN.IDEN_ESAME.value;
	}

        registra();	
}

function stampa_scheda_richiesta(){
	
	var sf		 = "&prompt<pIdenTR>="+document.EXTERN.ID_STAMPA.value;
	var funzione = 'PRESA_IN_CARICO';	
	var reparto	 = document.EXTERN.HrepartoRicovero.value;
	var anteprima;	
	var stampante = basePC.PRINTERNAME_REF_CLIENT;
	
	if(basePC.PRINTERNAME_REF_CLIENT==''){
		anteprima='S';
	}else{
		anteprima='N';
	}		
	
	var stampante=basePC.PRINTERNAME_REF_CLIENT;
    WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,stampante);
}

function setEvents(){
	// Aggiunta attributo "for" per le label accanto i radio input
	$("input:radio").each(function() {
		var label = $(this).next().next();
		if (label.attr("tagName").toUpperCase() == 'LABEL') {
			var id = $(this).attr("id");
			if (id == '' || id == $(this).attr("name")) {
				id = $(this).attr("name")+$(this).val();
				$(this).attr("id", id);
			}
			label.attr("for", id);
		}
	});
	
	// Aggiunta attributo "for" per le label accanto ai check input
	$('label[name^=lblchk], label[name^=lblChk]').each(function () {
		var id = $(this).attr("name").replace(/^(lbl)(chk[\s\S]*)$/i, "$2");
		$(this).attr("for", id.charAt(0).toLowerCase() + id.slice(1));
	});
	
	if(!$("#chkCaricoInib").is(':checked')){
		$('INPUT[name=radCaricoInib]').attr('disabled',true);
		$('#txtCaricoInib').attr('disabled',true);
	}
	else{
		$('INPUT[name=radCaricoInib]').attr('disabled',false);
		$('#txtCaricoInib').attr('disabled',false);
	}
    $("#chkCaricoInib").click(function() {
    	 if ($(this).is(':checked')) {
    	 	$('INPUT[name=radCaricoInib]').attr('disabled',false);
    	 	$('#txtCaricoInib').attr('disabled',false);
    	 }
    	 else{
    		 $('INPUT[name=radCaricoInib]').attr('disabled',true).removeAttr('checked');
    		 $('#txtCaricoInib').val('').attr('disabled',true);
    	 }    	
    });
    
	if(!$("#chkCaricoTotale").is(':checked')){
		$('#txtCaricoTotale').attr('disabled',true);
	}
	else{
		$('#txtCaricoTotale').attr('disabled',false);
	}
    $("#chkCaricoTotale").click(function() {
    	 if ($(this).is(':checked')) {
    	 	$('#txtCaricoTotale').attr('disabled',false);
    	 }
    	 else{
    		 $('#txtCaricoTotale').val('').attr('disabled',true);
    	 }    	
    });
    
	if(!$("#chkCaricoConc").is(':checked')){
		$('#txtCaricoConc').attr('disabled',true);
	}	
	else{
		$('#txtCaricoConc').attr('disabled',false);
	}
	
    $("#chkCaricoConc").click(function() {
    	 if ($(this).is(':checked')) {
    	 	$('#txtCaricoConc').attr('disabled',false);
    	 }
    	 else{
    		 $('#txtCaricoConc').val('').attr('disabled',true);
    	 }    	
    });
    
	if(!$("#chkArtCons").is(':checked')){
		$('#txtArtCons').attr('disabled',true);
	}	
	else{
		$('#txtArtCons').attr('disabled',false);
	}
	
    $("#chkArtCons").click(function() {
    	 if ($(this).is(':checked')) {
    	 	$('#txtArtCons').attr('disabled',false);
    	 }
    	 else{
    		 $('#txtArtCons').val('').attr('disabled',true);
    	 }    	
    });
    
	if(!$("#chkArtLimA").is(':checked')){
		$('#txtArtLimA').attr('disabled',true);
	}
	else{
		$('#txtArtLimA').attr('disabled',false);
	}
	
    $("#chkArtLimA").click(function() {
    	 if ($(this).is(':checked')) {
    	 	$('#txtArtLimA').attr('disabled',false);
    	 }
    	 else{
    		 $('#txtArtLimA').val('').attr('disabled',true);
    	 }    	
    });
    
	if(!$("#chkArtLimDa").is(':checked')){
		$('#txtArtLimDa,#txtArtLimDaA').attr('disabled',true);
	}	
	else{
		$('#txtArtLimDa,#txtArtLimDaA').attr('disabled',false);
	}
	
    $("#chkArtLimDa").click(function() {
    	 if ($(this).is(':checked')) {
    	 	$('#txtArtLimDa,#txtArtLimDaA').attr('disabled',false);
    	 }
    	 else{
    		 $('#txtArtLimDa,#txtArtLimDaA').val('').attr('disabled',true);
    	 }    	
    });
    
    if(!$("#chkTutoreAltro").is(':checked')){
		$('#txtTutoreAltro').attr('disabled',true);
	}	
    else{
    	$('#txtTutoreAltro').attr('disabled',false);
    }
    
    $("#chkTutoreAltro").click(function() {
    	 if ($(this).is(':checked')) {
    	 	$('#txtTutoreAltro').attr('disabled',false);
    	 }
    	 else{
    		 $('#txtTutoreAltro').val('').attr('disabled',true);
    	 }    	
    });
    
    if(!$("#chkTutoreRim").is(':checked')){
		$('#txtTutoreRim').attr('disabled',true);
	}
    else{
    	$('#txtTutoreRim').attr('disabled',true);
    }
    
    $("#chkTutoreRim").click(function() {
    	 if ($(this).is(':checked')) {
    	 	$('#txtTutoreRim').attr('disabled',false);
    	 }
    	 else{
    		 $('#txtTutoreRim').val('').attr('disabled',true);
    	 }    	
    });
    
    if($("INPUT[name=radTutore]:checked").val()=='N'){
    	$('#divGroupTutore input[type=checkbox]').attr('disabled',true);
    	 $('#txtTutoreAltro,#txtTutoreRim').val('').attr('disabled',true);
	}	
    $("INPUT[name=radTutore]").click(function() {
   	 if ($(this).val()=='S') {
   		$('#divGroupTutore input[type=checkbox]').attr('disabled',false);
   	 }
   	 else{
   		$('#divGroupTutore input[type=checkbox]').attr('disabled',true).attr('checked',false);
   		$('#txtTutoreAltro,#txtTutoreRim').val('').attr('disabled',true);
   	 }    	
   });
    
    if(!$("#chkCapacitaDeambu").is('checked')){
		$('#chkCapacitaAiuto,#chkCapacitaAusili,#chkCapacitaOrtesi').attr('disabled',true);
	}		
    $("#chkCapacitaDeambu").click(function() {
    	 if ($(this).is(':checked')) {
    	 	$('#chkCapacitaAiuto,#chkCapacitaAusili,#chkCapacitaOrtesi').attr('disabled',false);
    	 }
    	 else{
    		 $('#chkCapacitaAiuto,#chkCapacitaAusili,#chkCapacitaOrtesi').attr('checked',false).attr('disabled',true);
    	 }    	
    });
	
}
