var stato_add;
var stato_del;

var obj_prestazioni = [];
$(function(){
	var bolNessunCdcSelezionato = true;
	// ********
	try{hideMan();}catch(e){;}
	// ********
	var globalSito = "SAVONA"; 
	
	window.HomeWindow = window.CartellaWindow = window.iFrameMain = null;
	var win = window;

	while(win.parent != win){
		
		win = win.parent;

		switch(win.name){
			case 'schedaRicovero': 	window.CartellaWindow = win;
				break;
			case 'Home':			window.HomeWindow = win;
				break;
			case 'iframe_main': window.iFrameMain = win;
				break;
			default:break;
		}
	}	
//	alert(globalCaller);
	// modifica  20140203
	// modifica 18-4-16	, aggiunto PS
	if ((globalCaller.toUpperCase()=="WHALE")||(globalCaller.toUpperCase()=="PS")){
		// DEVO bloccare scelta CDC
//		alert($('div[btCDC="S" title="Tutti"]').attr("btCDC"));
//		alert($('table[class="classDataEntryTable"]').first().html());
		$('table[class="classDataEntryTable"]').first().attr("id", "tableFiltri");
		$('table#tableFiltri tr:eq(1)').remove()
	}
	else{
		// nel caso di ferrara nascondo pulsante tutti
		if (globalSito=="FERRARA"){	$("div[class='pulsante'][title='Tutti']").remove(); 			}
		$('div[btCDC="S"] A').each(function(){
			var btScelto = $(this).html();
			// *********
			if (document.scelta_esame.Hcdc.value == btScelto){
				bolNessunCdcSelezionato = false;
				//.removeClass("pulsante").addClass("pulsanteSelettore");	
				$(this).parent().removeClass("pulsante").addClass("pulsanteGreen");
				if (globalSito=="FERRARA"){
					// rendere parametrico
					$("#lblTitoloZonaSel2").append(" - Ambulatorio: " + "<label id='lblCdcScelto' style='color:red;'>" + $(this).parent().attr("title") + "</label>");	
				}
				else{
					$("#lblTitoloZonaSel2").append(" - CDC: " + "<label id='lblCdcScelto' style='color:red;'>" + $(this).parent().attr("title") + "</label>");	
				}
			}
			// controllo se devo rimappare pulsanti CDC
			try{
				if (getHomeFrame().getConfigParam("MOSTRA_DESCR_CDC").split("#")[0]=="S"){ 
					var strTempCdc = "";
					var lunghDefaultMax = 20;
					strTempCdc = $(this).parent().attr("title");
					// controllo lunghezza testo
					if (isNaN(getHomeFrame().getConfigParam("MOSTRA_DESCR_CDC").split("#")[1])){
		//						strTmp = strTmp.toString().cutAndPad(5);
						strTmp = strTempCdc.toString().cutAndPad(lunghDefaultMax);
					}
					else{
						strTmp = strTempCdc.toString().cutAndPad(getHomeFrame().getConfigParam("MOSTRA_DESCR_CDC").split("#")[1]);
					}
					$(this).html("" + strTempCdc);
					if ($(this).parent().hasClass("pulsante")){
						$(this).parent().removeClass("pulsante").addClass("pulsanteCDC_scelta_esami");}
					if ($(this).parent().hasClass("pulsanteGreen")){						
						$(this).parent().removeClass("pulsanteGreen").addClass("pulsanteCDC_scelta_esamiGreen");}
				}
			}catch(e){;}
			
		});		// fine each
		try{
			if (bolNessunCdcSelezionato && getHomeFrame().getConfigParam("STARTUP.CARICA_TUTTE_PRESTAZIONI")=="N"){
				/* ********************************* */
				/* ********************************* */
				/* ********************************* */
				// attenzione nel caso un solo cdc caricare
				// indipendentemente da parametro  'N'
				// già solo le pretsazione di quell'unico CDC
				/* ********************************* */
				// da modificare !!!! **** 3/10/14
				// *******************************	
				/* ********************************* */
				/* ********************************* */
				/*
				if (baseUser.LISTAREPARTI.length==1){
				}*/

				if($("[name='Hcdc']").val()==""){
					$("#lblTitoloZonaSel2").parent().append().append("<label style='color=red;'>Selezionare una unita' erogante.</label>");
				}
			}
		}
		catch(e){}
	}
	// *********************

	// caso di associazione esame : devo filtrare per quel cdc
	
	if (globalSito=="FERRARA"){
		if (document.scelta_esame.tipo_registrazione.value == "A" && document.scelta_esame.Hcdc.value!=""){
			// associazione e NON ho ancora filtrato
			// filtro per cdc
			$("#lblCdc").parent().parent().hide();
			try{$("select[name='esami_sel']").attr("size",parseInt($("select[name='esami_sel']").attr("size")+2));}catch(e){;}
		}
	}
	

		
	// ***************
	// vecchio codice con combo
/*/	if (document.getElementById("idComboCdc")){
		if ($("#idComboCdc option:selected").text()!=""){
			$("#lblTitoloZonaSel2").append(" - CDC: " + "<span style='color=red'>" + $("#idComboCdc option:selected").text() + "</span>");
		}
		else{
			$("#lblTitoloZonaSel2").append(" - CDC: [tutti]");
		}

	}*/
	
	/*if($('input[name="Hiden_pro"]').val() == ""){
		$('#btContinue')
			.text('Esterni')
			.closest('td')
			.before(
				$('<td class="classButtonHeader"></td>')
					.append(
						$('<div class="pulsante"></div>')
							.append(
								$('<A id="btInterni" href="#_">Interni</A>')
									.click(function(){
										//alert(document.scelta_esame.action)

										document.scelta_esame.urgente.value = '0';

										document.scelta_esame.Hiden_posto.value = window.iFrameMain.parametri.ID_DETTAGLIO;
										document.scelta_esame.Hcdc.value = window.iFrameMain.parametri.VALORE;

										document.scelta_esame.action = top.NS_APPLICATIONS.switchTo('WHALE','servletGenerator');
										$(document.scelta_esame)
											.append(
												$('<input type="hidden" name="KEY_LEGAME" value="FILTRO_WK_PAZIENTI_RICOVERATI"/>')
											
											);
											
										avanti();
									})
							)
					)
			)
	}*/

	// *****************************************
	// ************ modifica 23-10-2014
	// x radiologia: aggiungo contatore prestazioni scelte
	// e pulsante per (ripeti N volte esame scelto)
	$("select[name='esami_sel']").first().attr("id","id_esami_sel");
	// <div class='pulsante'><a id='lblIncludi' href="javascript:add_esame_check('S');"></a></div>
	var strPulsante = "<div class='pulsante' title='Includi la prestazione n volte'><a id='lblIncludiRipeti' href='javascript:add_ripeti_esame();'>Includi e ripeti Esame</a></div>";
	$("#lblIncludi").parent().parent().prepend(strPulsante);
	updateExamNumLabel();
	// *****************************************
	
	// ******** 10-06-2014
	$("input[name='codice_esame']").focus();
	// ************
});

// modifica 20140203
var globalCaller = "";
function setCaller(caller){
	
	var globalCaller = "";
	globalCaller = caller;
	// **********************
	// modifica 18-4-16
	try{		window.parent.objCaller = {"caller":caller, "url":location.href};	}	catch(e){		;	}
	// **********************
}
// ***************


function cambioCdc(value){
	try{
		// modifica cdc
		if (value !=""){
			// resetto extra where
			document.scelta_esame.extra_where.value = "";
		}
		else{
			// potrei volerli vedere tutti 
			// 
			try{
				if (getHomeFrame().getConfigParam("STARTUP.CARICA_TUTTE_PRESTAZIONI")=="N"){
					// ferrara
					document.scelta_esame.extra_where.value = "iden=0";
				}
				else{
					// caso classico
					document.scelta_esame.extra_where.value = "";				
				}
			}
			catch(e){
				document.scelta_esame.extra_where.value = "";				
			}
		}

		document.scelta_esame.Hcdc.value=value;
		aggiorna("@","@");
	}
	catch(e){
		alert("cambioCdc - Error: "+ e.description);
	}
}

function chiudi()
{
	try{
	if (globalSito=="FERRARA"){
		//se provengo da ricerca pazienti il parametro è gestito
		// se provengo da wk esami non è gestito, quindi
		// si comporta in modo classico
		opener.aggiorna("A");
		self.close();		
	}
	else{
		opener.aggiorna();
		self.close();
	}
	}catch(e){
		opener.aggiorna();
		self.close();
	}

}

function chiudi_prenotazione()
{
	ritorna_prenotazione();
}

function carica_lista_esami(vis)
{
    if($("[name='Hiden_esame']").val() != ""){    
        //delgiu associa
        dwr.engine.setAsync(false);
        var v_sql = "select iden_prestazione from view_rr_tab_esa_esenz where iden_esenzione in (select IDEN_ESENZIONE_PATOLOGIA from esami where iden = "+$("[name='Hiden_esame']").val()+") ";
        toolKitDB.getListResultData(v_sql,function(rs){
           if(rs!=null){
               $.each(rs,function(k,v){
                   try{
                    obj_prestazioni.push(v[0]);
                    }catch(e){
                        
                    }
               });
           }
        });
        dwr.engine.setAsync(true);
    }    
	var i;
	i = n_a_esa - 1;
	
	while(i>-1)
	{
		document.scelta_esame.esami_in.options.remove(i);
		i--;
	}
	
	for(i = 0; i < n_a_esa; i++)
	{
		var oOpt = document.createElement('Option');
		
		if(vis == 'D')
		{
			oOpt.text = a_descr[i];
		}
		else if (vis =="CMD"){
			oOpt.text = a_cod_min[i] + ' ' + a_descr[i];
		}
		else
		{
			oOpt.text = a_cod_esa[i] + ' ' + a_descr[i];
		}
		
		oOpt.value = a_iden[i];
                if($("[name='Hiden_esame']").val() != ""){  
                    $.each(obj_prestazioni,function(k,v){
                        if(oOpt.value == v){
                            oOpt.style.color="red";
                        }
                    });
                }
		document.scelta_esame.esami_in.add(oOpt);
	}
}

function sortSelect(obj)
{
	var o = new Array();
	
	for (var i=0; i<obj.options.length; i++)
	{
		o[o.length] = new Option( obj.options[i].text, obj.options[i].value, obj.options[i].defaultSelected, obj.options[i].selected);
	}
	
	o = o.sort( 
				function(a,b)
				{ 
					if((a.text+"") < (b.text+"")){return -1;}
					if((a.text+"") > (b.text+"")){return 1;}
					
					return 0;
				}
			  );

	for (var i=0; i<o.length; i++)
	{
		obj.options[i] = new Option(o[i].text, o[i].value, o[i].defaultSelected, o[i].selected);
	}
}

function check_evento_esame(elenco, mul, caso, ripetizione)//add_esame_check(mul)
{
	var launch = 'SP_CHECK_SCELTA_ESAME@';
	var par = '';
	var esami_sel = '';
	
	if(mul == 'S')
	{
		for(i = 0; i < elenco.length; i++)
		{
			if(elenco[i].selected)
			{
				if(esami_sel != '')
					esami_sel += ',';
				
				if(elenco.options(i).value.indexOf('*') > 0)
					esami_sel += elenco.options(i).value.split('*')[0];
				else
					esami_sel += elenco.options(i).value;
			}
		}
	}
	else
	{
		if(elenco.length > 0)
			if(elenco.options(elenco.selectedIndex).value.indexOf('*') > 0)
				esami_sel = elenco.options(elenco.selectedIndex).value.split('*')[0];
			else
				esami_sel = elenco.options(elenco.selectedIndex).value;
	}

	if (caso=="ADD"){
		add_esame(stato_add, ripetizione);
	}
	else if (caso =="DEL"){
		del_esame(stato_del);
	}
	// Ambulatorio
	//alert("Disabilito chiamata SP_CHECK_SCELTA_ESAME da check_evento_esame");
	return;	
	// ************
	if(esami_sel != '')
	{
		par = 'SP_CHECK_SCELTA_ESAME@';
		par += 'IString#IString#IString#IString#IString#IString#OVarchar@';
		par += baseUser.LOGIN + '#';
		par += document.scelta_esame.tipo_registrazione.value + '#';
		par += caso + '#';
		par += esami_sel + '#';
		par += crea_stringa_esami().replace(/\*/g,",") + '#';
		par += document.scelta_esame.extra_db.value;
		
		dwr.engine.setAsync(false);
		
		functionDwr.launch_sp(par, responseDWR);
		
		dwr.engine.setAsync(true);
	}
}

function responseDWR(valore)
{
	var a_risp = valore.split("*");
	
	if(a_risp[0] != 'ERROR')
	{
		eval(valore);
	}
	else
	{
		alert('Errore interno, messaggio: ' + a_risp[1]);
	}
}

// modifica 23-10-2014
function add_ripeti_esame(){
	
	// controllo siano selezionati degli esami
	var countExam = $("#esami_in :selected").length;
	if (countExam<=0){ return;}
		
	var ripetizione = prompt("Inserire numero di ripetizioni", "1");
    if (ripetizione != null) {
		if (isNaN(ripetizione)){
			alert("Prego inserire un valore numerico");
			return;
		}
	}	
	add_esame_check('S',ripetizione)
}

function add_esame_check(mul, ripetizione)
{
	var myRipetizione;
	
	if (ripetizione==null || ripetizione=="undefined"){
		myRipetizione = 1;
	}
	else{
		myRipetizione = ripetizione;	
	}
	// se mul è vuoto l'inserimento è singolo
	// altrimenti è multiplo (guarda cosa è selezionato)
	stato_add = mul;
	
	check_evento_esame(document.scelta_esame.esami_in, mul, 'ADD', myRipetizione);
	
	// *****************************************
	// ************ modifica 23-10-2014
	updateExamNumLabel();
	// *****************************************	
}


// modificato 23-10-2014
function add_esame(mul, ripetizione)
{
	var i;
	
	if (ripetizione== null || ripetizione=="undefined"){
	  ripetizione = 1;
	}
	
	if(mul == 'S')
	{
		for(i = 0; i < n_a_esa; i++)
		{
			if(document.scelta_esame.esami_in[i].selected)
			{
				for (var k=0;k<ripetizione;k++){
					var oOpt = document.createElement('Option');
					oOpt.text = document.scelta_esame.esami_in.options(i).text;
					oOpt.value = document.scelta_esame.esami_in.options(i).value + '*' + a_metodica[i];
					document.scelta_esame.esami_sel.add(oOpt);
				}
			}
		}
	}
	else
	{
		for (var k=0;k<ripetizione;k++){
			var oOpt = document.createElement('Option');
			oOpt.text = document.scelta_esame.esami_in.options(document.scelta_esame.esami_in.selectedIndex).text;
			oOpt.value = document.scelta_esame.esami_in.options(document.scelta_esame.esami_in.selectedIndex).value + '*' + a_metodica[document.scelta_esame.esami_in.selectedIndex];
			document.scelta_esame.esami_sel.add(oOpt);
		}
	}
	
	sortSelect(document.scelta_esame.esami_sel);
}

function del_esame_check(tutti)
{
	stato_del = tutti;

	if(tutti != 'S')
		check_evento_esame(document.scelta_esame.esami_sel, tutti, 'DEL');
	else
		del_esame(tutti);
		
	// *****************************************
	// ************ modifica 23-10-2014
	updateExamNumLabel();
	// *****************************************
}

function updateExamNumLabel(){
	var examNum = "";
	examNum = $('#id_esami_sel option').length ;
	$("#lblTitoloEsaSel").html("Esami Selezionati, <label style='color:red'>N: " + examNum + "</label>");
}

function del_esame(tutti)
{
	if(tutti == 'S')
	{
		while(document.scelta_esame.esami_sel.length > 0)
		{
			document.scelta_esame.esami_sel.options.remove(document.scelta_esame.esami_sel.length - 1);
		}
	}
	else
	{
		if(document.scelta_esame.esami_sel.selectedIndex !=-1)
		{
			document.scelta_esame.esami_sel.options.remove(document.scelta_esame.esami_sel.selectedIndex);
		}
	}
}

function crea_stringa_esami(descr)
{
	var sEsa 		= '';
	var idEsa 		= '';
	var metEsa		= '';
	var descrEsa 	= '';
	var i;
	
	if(document.scelta_esame.esami_sel)
	{
		for(i = 0; i < document.scelta_esame.esami_sel.length; i++)
		{
			if(idEsa == '')
			{
				idEsa = document.scelta_esame.esami_sel.options(i).value.split("*")[0];
				metEsa = document.scelta_esame.esami_sel.options(i).value.split("*")[1];
				descrEsa = document.scelta_esame.esami_sel.options(i).text;
			}
			else
			{
				idEsa += '*' + document.scelta_esame.esami_sel.options(i).value.split("*")[0];
				metEsa += '*' + document.scelta_esame.esami_sel.options(i).value.split("*")[1];
				descrEsa += '*' + document.scelta_esame.esami_sel.options(i).text;
			}
		}
		sEsa = descr ? idEsa + '@' + descrEsa:idEsa;
		
		document.scelta_esame.Ha_sel_metodica.value = metEsa;
	}
	else
	{
		sEsa = document.scelta_esame.Hiden_esa.value;
	}
	
	return sEsa;
}

// 20130712
// attenzione: cambiare qui
function cambia_cdc(valore)
{
	document.scelta_esame.Hcdc.value = valore;
	aggiorna(document.scelta_esame.Hzona.value, document.scelta_esame.Hmodalita.value);
}

function aggiorna(zona, modalita)
{
	document.scelta_esame.action = '\sceltaEsami';
	if(zona != '@')
	{
		document.scelta_esame.Hzona.value = zona;
	}
	if(modalita != '@')
	{
		document.scelta_esame.Hmodalita.value = modalita;
	}
	document.scelta_esame.Ha_sel_iden.value = crea_stringa_esami();
	document.scelta_esame.Hiden_esa.value = crea_stringa_esami();
	
	if(document.scelta_esame.tipo_registrazione.value == 'PR' || document.scelta_esame.tipo_registrazione.value == 'PC')
		document.scelta_esame.tipo_registrazione.value = 'P';
	
	
	document.scelta_esame.submit();
}


function ricerca()
{
	// modifica 27-9-16
	if(document.scelta_esame.optRicerca[1].checked){
		document.scelta_esame.codice_esame.value = document.scelta_esame.codice_esame.value.toString().toUpperCase();
	}
	// ****************	
	
	var cod = document.scelta_esame.codice_esame.value;
	var tipo = document.scelta_esame.optRicerca[0].checked ? 'C':'D';
	var i;
	
	if(cod == '')
	{
		alert('Inserire un valore di ricerca valido!');
		document.scelta_esame.codice_esame.focus();
		return;
	}
	
	if(tipo == 'C')
	{
		for(i = 0; i < n_a_esa; i++)
		{
			if(cod.toUpperCase() == a_cod_esa[i].toUpperCase())
			{
				var oOpt = document.createElement('Option');
				
				oOpt.text = a_descr[i];
				oOpt.value = a_iden[i];
				
				document.scelta_esame.esami_sel.add(oOpt);
				document.scelta_esame.codice_esame.value = '';
				document.scelta_esame.codice_esame.focus();
				return;
			}
		}
	}
	else
	{
		/*for(i = document.scelta_esame.esami_in.selectedIndex; i < n_a_esa; i++)
		{
			if(cod.toUpperCase() == a_descr[i].substr(0,cod.length).toUpperCase())
			{
				document.scelta_esame.esami_in.selectedIndex = i;
				
				return;
			}
		}*/
		document.scelta_esame.esami_in.selectedIndex = ricava_indice(document.scelta_esame.esami_in.selectedIndex, cod);
		if(document.scelta_esame.esami_in.selectedIndex> 0)
			return;
	}
	
	alert('Esame non trovato!');
	document.scelta_esame.codice_esame.focus();
}


function avanti(pass)
{
	initbaseUser();
	initbaseGlobal();
	
	//alert(document.scelta_esame.next_servlet.value);
	// *********************
	
	document.scelta_esame.method = "GET";
	document.scelta_esame.Hiden_esa.value = crea_stringa_esami();
	if(document.scelta_esame.Hiden_pro.value == '')
	{
		document.scelta_esame.Hiden_pro.value = baseUser.PROVENIENZA_LOGIN_IDEN;
	}
	
	if((document.scelta_esame.Hiden_pro.value + '') == 'undefined')
	{
		document.scelta_esame.Hiden_pro.value = '';
	}
	
	if((document.scelta_esame.Htip_esec.value + '') == 'undefined')
	{
		document.scelta_esame.Htip_esec.value = '';
	}
	
	if(document.scelta_esame.Hiden_anag.value == '')
	{
		if(typeof parent.iden_anag != 'undefined' && parent.iden_anag != '')
			document.scelta_esame.Hiden_anag.value = parent.iden_anag;
	}
	
	if(document.scelta_esame.Hiden_esa.value == '')
	{
		alert('Selezionare almeno un esame');
	}
	else
	{
		if(check_metodica())
		{			
			if(parent.frameDirezione)
			{
				if(typeof pass == 'undefined')
				{
					
					if(parent.frameDirezione.document.all.btSchedaEsami.style.visibility == 'hidden')
					{
						document.scelta_esame.tipo_registrazione.value = 'P';
					}
					else
					{
						document.scelta_esame.tipo_registrazione.value = 'PR';
					}
					
					document.scelta_esame.action = 'javascript:next_prenotazione();';
				}
				
				if(typeof document.scelta_esame.esami_sel != 'undefined')
					parent.frameDirezione._num_esami_totali = document.scelta_esame.esami_sel.length;
				else
					parent.frameDirezione._num_esami_totali = document.scelta_esame.Hiden_esa.value.replace(/\*/g, ",").split(",").length;
				
				parent.frameDirezione.colora_sel_desel('btSchedaEsami');
			}
						
			if(document.scelta_esame.tipo_registrazione.value == 'A' && document.scelta_esame.apri_scheda_esame.value == 'S'){
				document.scelta_esame.action = 'schedaEsame';
			}
			
			/*francescog+linob 23/08/2013 aggiunto il controllo su apri_scheda_esame in modo da far aprire la scheda se gli arriva il parametro a 'S'*/
//			alert(document.scelta_esame.tipo_registrazione.value +"#" + document.scelta_esame.apri_scheda_esame.value);
			if(document.scelta_esame.tipo_registrazione.value == 'P' && document.scelta_esame.apri_scheda_esame.value == 'S'){
				document.scelta_esame.action = 'javascript:next_prenotazione();';		
			}		
							
			//alert('scelta_esame.js : \n'+document.scelta_esame.action + '\n' + document.scelta_esame.tipo_registrazione.value)
						
			//alert($(document.scelta_esame).serialize());
			//return alert(document.scelta_esame.next_servlet.value);
			
			// metodo "pseudo empirico" per sapere se
			// la chiamata proviene da "ripeti ciclica"
			// modifica 11-5-15
			/*if (document.scelta_esame.extra_where.value.toString().indexOf("INIZIO_CICLO")>-1){
				// per ora controllo che non ci sia più di un esame !!
				if (document.scelta_esame.esami_sel.length>1){
					alert("Impossibile continuare!\nNon e' possibile ripetere piu' di un esame per volta.");
					return;
				}
			}*/
			// ***********
			
			document.scelta_esame.submit();
		}
		else
		{
			alert('Attenzione! Selezionare esami con la stessa metodica!');
		}
	}
}

function utenteFailed()
{
	alert('Utente non valido per eseguire l\'inserimento di un esame!');
	chiudi();
}

function annulla_invio()
{
	if (window.event.keyCode==13)
	{
		window.event.returnValue=false;
		ricerca();
	}
}

function check_metodica()
{
	var i;
	var f_met = '';
	var a_met = document.scelta_esame.Ha_sel_metodica.value.split('*');
	var ret = true;
	
	if(document.scelta_esame.tipo_registrazione.value.substr(0,1) != 'P' && baseGlobal.ACC_PER_STESSA_METODICA != 'N')
	{
		for(i=0; i < a_met.length && ret; i++)
		{
			if(f_met == '')
			{
				f_met = a_met[i];
			}
			
			ret = f_met == a_met[i];
		}
	}
	return ret;
}

function check_dati_prenota(cod_imp, forza)
{
	var esa = '';
	var par = '';
	//alert('check_dati_prenota :' + cod_imp)
	// Inutile... ma non si sa mai!!!
	document.scelta_esame.Hiden_esa.value = crea_stringa_esami();
	document.scelta_esame.Hiden_posto.value = cod_imp;
	if(forza == 'S')
	{
		document.scelta_esame.tipo_registrazione.value = 'PF';
	}
	
	esa = document.scelta_esame.Hiden_esa.value.replace(/\*/g, ",");
	par = cod_imp + '*' + esa + '*S*' + forza;
//	alert("occupa_posto "+ par + "!");
	prenDWRClient.occupa_posto(par, check_dati_prenota_confirm);
}

function check_dati_prenota_confirm(msg)
{
	//alert('check_dati_prenota_confirm')
	var a_msg = msg.split("*");
	
	document.scelta_esame.onSubmit = false;
	
	if(msg != null && msg.substr(0, 5).toUpperCase() == 'ERROR')
	{
		// Tutto ko, lo fermo
		alert(a_msg[1]);
	}
	else
	{
		// Tutto ok!
		document.scelta_esame.Hiden_posto.value = a_msg[1].replace(/\,/g, "*");
		document.scelta_esame.action = 'schedaEsame';
		document.scelta_esame.submit();
	}
}

function check_richiesta_prenota()
{
	var url_send;
	
	// Fa schifo, ma non ho scelta!!!
	document.scelta_esame.onSubmit = false;
	
	parent.iden_esa = crea_stringa_esami();
	
	// Compongo la url
	/*url_send = 'schedaEsame?'
	url_send += 'tipo_registrazione=P&'; // Tipo Prenotazione
	url_send += 'tipo_azione=C&'; // Indica ke deve passare nella consultazione...
	url_send += 'Hiden_anag=' + parent.iden_anag + '&';
	url_send += 'Hiden_esa=' + crea_stringa_esami() + '&';
	url_send += 'Hiden_infoweb_richiesta=' + parent.iden_infoweb_richiesta + '&';
	
	url_send += 'urgente=' + parent.urgente + '&';
	
	url_send += 'iden_med_rich=' + parent.iden_med_rich + '&';
	url_send += 'iden_tab_pro=' + parent.iden_tab_pro + '&';
	
	url_send += 'txtNote=' + parent.note + '&';
	url_send += 'txtQuadroClinico=' + parent.quadro_clinico + '&';
	url_send += 'txtQuesitoClinico=' + parent.quesito_clinico;
	
	document.location.replace(url_send);*/
	//document.scelta_esame.tipo_registrazione.value = 'P';
	//document.scelta_esame.tipo_azione.value = 'C';
	document.scelta_esame.appendChild(document.createElement("<input name='tipo_azione' type='hidden' value='C'>"));
	//document.scelta_esame.Hiden_anag.value = parent.iden_anag;
	document.scelta_esame.Hiden_esa.value = crea_stringa_esami();
	//document.scelta_esame.Hiden_infoweb_richiesta.value = parent.iden_infoweb_richiesta;
	
/*	if(document.scelta_esame.Htip_esec.value == '')
	{
		document.scelta_esame.Htip_esec.value = parent.tip_esec;
		if(document.scelta_esame.Htip_esec.value == 'undefined')
			document.scelta_esame.Htip_esec.value = '';
	}
	
	document.scelta_esame.urgente.value = parent.urgente;
	
	document.scelta_esame.iden_med_rich.value = parent.iden_med_rich;
//	document.scelta_esame.Hiden_pro.value = parent.iden_tab_pro;
	
	document.scelta_esame.txtNote.value = parent.note;
	document.scelta_esame.txtQuadroClinico.value = parent.quadro_clinico;
	document.scelta_esame.txtQuesitoClinico.value = parent.quesito_clinico;*/

	document.scelta_esame.action = 'schedaEsame';
	document.scelta_esame.method = 'POST';
	document.scelta_esame.target = '_self';
	
	document.scelta_esame.submit();
}

function set_descr_omino()
{
	try{
		if (document.getElementById("layerOmino")){
			var aDescr = document.scelta_esame.Hdescr_omino.value.split(",");
			var idx;
			initbaseUser();
	
			for(idx=0; idx<aDescr.length; idx++)
			{
				document.all["areaOmino" + idx].alt=aDescr[idx];
			}
			
			// ambulatorio
			hideMan();
			// ****
		}
	}
	catch(e){alert("set_descr_omino - Error: "+ e.description);}
}

function prestazioni_richiedibili()
{
	var esami_scelti 		= crea_stringa_esami(true).split('@');
	var esami_scelti_iden 	= esami_scelti[0];
	var esami_scelti_descr 	= esami_scelti[1];
	var iden 				= esami_scelti_iden.split('*');
	var descr 				= esami_scelti_descr.split('*');

	document.scelta_esame.onSubmit 		 = false;
	opener.document.form.Hmetodica.value = document.scelta_esame.Ha_sel_metodica.value.replace(/\*/g, ","); //document.scelta_esame.Hmodalita.value;
	opener.document.form.Hiden_esa.value = esami_scelti_iden;

	while(opener.document.form.prestazioni.length > 0)
	{
		opener.document.form.prestazioni.remove(opener.document.form.prestazioni.length - 1);
	}
	
	for(i = 0; i < descr.length; i++)
	{
		var oOpt = opener.document.createElement('Option');
		oOpt.text = descr[i];
		oOpt.value = iden[i];
		
		opener.document.form.prestazioni.add(oOpt);
	}
	
	chiudi();
}

function avviso_lock()
{
	//alert('Attenzione! Impossibile proseguire, paziente di sola lettura!');
	alert("Attenzione! Impossibile proseguire, paziente di sola lettura!\nPer renderlo utilizzabile aprire una segnalazione alla assistenza tecnica\ncomunicando le informazioni anagrafiche corrette.");
}

function check_riprenota()
{
	var url_send;
	
	document.scelta_esame.onSubmit = false;
	
	// Compongo la url
	url_send = 'schedaEsame?'
	url_send += 'tipo_registrazione=P&'; // Tipo Prenotazione
	url_send += 'tipo_azione=C&'; // Indica ke deve passare nella consultazione...
	url_send += 'Hiden_esa=' + crea_stringa_esami() + '&';
	url_send += 'Hiden_esame=' + document.scelta_esame.Hiden_esame.value;
	
	document.location.replace(url_send);
}

function ricava_indice(idx, ric)
{
	var ret_idx = -1;
	var esci	= false;
	var a_tmp;
	var primo;
	var i;
	
	if(idx < 0)
	{
		idx = 0;
		primo = false;
	}
	else
	{
		idx++;
		primo = true;
	}
	
	while(!esci)
	{
		for(i = idx; i < n_a_esa; i++)
		{
			if(document.scelta_esame.chkRicercaSens.checked)
			{
				if(a_descr[i].indexOf(ric) >= 0)
				{
					ret_idx = i;
					break;
				}
			}
			else
			{
				if(ric.toUpperCase() == a_descr[i].substr(0,ric.length).toUpperCase())
				{
					ret_idx = i;
					break;
				}
			}
		}
		if(ret_idx == -1 && primo)
		{
			idx = 0;
			primo = false;
		}
		else
		{
			esci = true;
		}
	}
	
	return ret_idx;
}

// modifica 27-9-16	
function check_ricerca()
{
	var tipo = document.scelta_esame.optRicerca[0].checked ? 'C':'D';

	if(document.scelta_esame.optRicerca[1].checked){
		// descrizione
		document.all['tdCheckRicerca'].style.display = 'block';
		document.scelta_esame.chkRicercaSens.checked = true;
	}else{
		// codice
		document.all['tdCheckRicerca'].style.display = 'none';
		document.scelta_esame.chkRicercaSens.checked = false;		
	}
}

function apri_scheda_dettaglio(url_send)
{
	var win = window.open(url_send,"","status=yes,scrollbars=yes,fullscreen=yes");
	
	if(win)
		win.focus();
	else
		win = window.open(url,"","status=yes,scrollbars=yes,fullscreen=yes");
}

function add_esame_acr(iden, iden_padre, iden_figlio, descr, quesito)
{
	var oOpt 	= null; 
	var ret 	= true;
	
	if(document.scelta_esame.extra_db.value == '')
	{
		document.scelta_esame.Hiden_esa.value = iden_figlio;
		document.scelta_esame.extra_db.value = 'ACR_DETAIL=' + iden;
		document.scelta_esame.txtQuesitoClinico.value = quesito;
		
		oOpt = document.createElement('Option');
		
		oOpt.text = descr;
		oOpt.value = iden_figlio;
		
		document.scelta_esame.esami_sel.add(oOpt);
	}
	else
	{
		if(document.scelta_esame.extra_db.value == 'ACR_DETAIL=' + iden)
		{
			document.scelta_esame.Hiden_esa.value = '';
			document.scelta_esame.extra_db.value = '';
		}
		else
		{
			alert('Selezionare solo un\'esame acr!');
			
			ret = false;
		}
	}
	
	return ret;
}



//ambulatorio
function hideMan(){
	try{
		if (document.getElementById("layerOmino")){
			document.getElementById("layerOmino").style.visibility = "hidden";
			document.getElementById("layerOmino").style.display = "none";
		}
	}
	catch(e){
		alert("hideMan -  Error: "+ e.description);
	}
}

function filtraCicliche(){
	try{
		alert("filtraCicliche");
	}
	catch(e){
		alert("filtraCicliche -  Error: "+ e.description);
	}
}

function getHomeFrame(){
	try {
		if (opener.top.home){
			return opener.top.home;
		}
		else{
			return top.home;
		}
	}
	catch(e){
		return top.home;
	}
}