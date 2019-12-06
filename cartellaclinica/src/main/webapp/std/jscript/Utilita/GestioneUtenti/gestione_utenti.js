var cdc;
var setCdc = false;
var pwdPS;
var servlet = location.pathname.split("/").slice(-1)[0].toUpperCase();


function canc_iden(n)
{
	if (n==1)
	{
		document.frm_web.iden_per.value=''; 
		document.frm_web.tipo.value=''; 
		document.frm_web.htipo_iden_per.value = ''; 
	}
}

function assrep(){
	
	utente = jQuery("input[name=webuser]").val();
	operazione = jQuery("input[name=opIMC]").val();
	//alert(operazione);
   
	var scelta_cdc = window.open("","winAssCdc","width=400,height=520, scrollbars=no,top=10,left=10");
    document.form_associa_cdc.cdc_scelti.value = cdc;
    //document.form_associa_cdc.webuser.value = '" + this.webUser + "';
    document.form_associa_cdc.webuser.value = utente;
    //document.form_associa_cdc.operazione.value = '" + this.operazione + "';
    document.form_associa_cdc.operazione.value = operazione;
    document.form_associa_cdc.submit();
    
    if (setCdc == true){
    	document.frm_generale.hsetCdc.value = true;
    }

    popolaVisualizzaOmino();
	/*
	var url='servletGenerator?KEY_LEGAME=ASSOCIA_CDC&UTENTE='+utente;
	$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 768,
		'href'		: url,
		'type'		: 'iframe'
	});*/
}     


function sel_radio()
{
	doc=document.frm_web;	
	if (doc.tipo.value=='O')
	{
		doc.tipo_utente[3].checked=1; 
		return;
	}
	if (doc.tipo.value=='I')
	{
		doc.tipo_utente[2].checked=1; 
		return;
	}
	if (doc.tipo.value=='T')
	{
		doc.tipo_utente[1].checked=1; 
		return;
	}
	if ((doc.tipo.value=='M') || (doc.tipo.value=='S') || (doc.tipo.value=='P') || (doc.tipo.value=='R'))
	{
		doc.tipo_utente[0].checked=1; return;
	}
}



function addCDC(testo,valore)
{
    var newCdc = new Option(testo, valore);
    document.frm_web.cdc_attivi_utente.add(newCdc, document.frm_web.cdc_attivi_utente.length);
}


function removeCDC()
{
    for(var i = document.frm_web.cdc_attivi_utente.length; i > 0; i--)
    	document.frm_web.cdc_attivi_utente.remove(0);
}
            
function salva()
{
	
    var pressRegistra 	= false;
    var doc 			= document.frm_web;
    var doc_gen 		= document.frm_generale;
    var mancano			= '';
		
	if(doc.webuser.value == '' || (doc.livello[0].checked == 0 && doc.livello[1].checked == 0) || cdc == '' || doc.cdc_attivi_utente.value == ''
	|| (doc.opIMC.value == 'INS' && doc.iden_per.value == '') || (doc.opIMC.value == 'MOD' && doc.nome_per.value == ''))																						
	{
		if (doc.webuser.value == '')
		{
			 mancano = '- UTENTE\n';
		}

		if((doc.opIMC.value == 'INS' && doc.iden_per.value == '') || (doc.opIMC.value == 'MOD' && doc.nome_per.value == ''))
		{
			mancano += '- NOME UTENTE\n';
		}
		
		if (doc.livello[0].checked == 0 && doc.livello[1].checked == 0)
		{
			 mancano += '- LIVELLO UTENTE\n';
		}

		if(cdc == '' || doc.cdc_attivi_utente.value == '')
		{
			 mancano += "- CDC ASSOCIATI ALL'UTENTE\n";
		}
		
		alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
		return;
	 }
		

	/*Gestione campo web.FILTRI_VOCI_INATTIVE*/
	if(doc.filtri_voci_inattive.checked)
		doc_gen.hfiltri_voci_inattive.value = 'S';
	else
		doc_gen.hfiltri_voci_inattive.value = 'N';
		
	/*ABILITA_CONTEXT_MENU*/	
	if(doc.abilita_context_menu.checked)
		doc_gen.habilita_context_menu.value = 'S';
	else
		doc_gen.habilita_context_menu.value = 'N';
		
	if(doc.cdc_utente.checked)
		doc_gen.hcdc_utente.value = 'S';
	else
		doc_gen.hcdc_utente.value = 'N';		

    doc_gen.hiden_group.value = doc.group.value;
    doc_gen.hwebuser.value = doc.webuser.value;
    doc_gen.hiden_per.value = doc.iden_per.value;
    doc_gen.hcod_ope.value = '';
    doc_gen.hcod_ope.value = doc.cod_ope_pre.value + doc.cod_ope_acc.value + 
    doc.cod_ope_ese.value + doc.cod_ope_ref.value+doc.cod_ope_ana.value + 
    doc.cod_ope_par.value + doc.cod_ope_mag.value+doc.cod_ope_can.value + doc.ripr_canc.value + 
    doc.cod_canc_esa.value;
	
    var permessi_tabelle = '';
    
	if (doc.permesso_tabelleA.checked == 1)
         permessi_tabelle += 'A';
    else
         permessi_tabelle += ' ';
    
	if (doc.permesso_tabelleT.checked == 1)
         permessi_tabelle += 'T';
    else
    	permessi_tabelle += ' ';
    
	if (doc.permesso_tabelleE.checked == 1) 
		permessi_tabelle += 'E';
    else
    	permessi_tabelle += ' ';
    
	if (doc.permesso_tabelleR.checked == 1)
         permessi_tabelle += 'R';
    else
         permessi_tabelle += ' ';
    
	if (doc.permesso_tabelleP.checked == 1)
         permessi_tabelle += 'P';
    else
    	permessi_tabelle += ' ';
    
	if (doc.permesso_tabelleO.checked == 1)
         permessi_tabelle += 'O';
    else
    	permessi_tabelle += ' ';
    
	if (doc.permesso_tabelleC.checked == 1)
        permessi_tabelle += 'C';
    else
    	permessi_tabelle += ' ';
    
	if (doc.permesso_tabelleX.checked == 1)
         permessi_tabelle += 'X';
    else
    	permessi_tabelle += ' ';
		
	if(permessi_tabelle == '        ')
		permessi_tabelle = '          ';
	
	//alert(permessi_tabelle.length);
	
	doc_gen.hgest_tab.value = permessi_tabelle;
	
    if (doc.livello[0].checked == 1)
         doc_gen.hlivello.value = doc.livello[0].value;
    if (doc.livello[1].checked == 1)
         doc_gen.hlivello.value = doc.livello[1].value;
    doc_gen.hnome_per.value = doc.nome_per.value;
	
    doc_gen.hcdc_attivi_utente.value = doc.cdc_attivi_utente.value; 
    doc_gen.hPH_DimCar.value = doc.PH_DimCar.value; 
	doc_gen.infoGruppoLDAP.value = doc.infoGruppoLDAP.value; 
    doc_gen.hlingua.value = doc.lingua.value; 

    if (doc.tipo_utente[0].checked == 1)
         doc_gen.htipo.value = doc.tipo_utente[0].value;
    if (doc.tipo_utente[1].checked == 1)
         doc_gen.htipo.value = doc.tipo_utente[1].value;
    if (doc.tipo_utente[2].checked == 1)
         doc_gen.htipo.value = doc.tipo_utente[2].value;
    if (doc.tipo_utente[3].checked == 1)
         doc_gen.htipo.value = doc.tipo_utente[3].value;
		 
	if(doc.visualizza_omino.value == '0')
		doc_gen.hvisualizza_omino.value = '0';
		
	if(doc.visualizza_omino.value == '1')
		doc_gen.hvisualizza_omino.value = '1';
		
	if(doc.visualizza_omino.value == '2')
		doc_gen.hvisualizza_omino.value = '2';
		
	if(doc.visualizza_omino.value == '3')
		doc_gen.hvisualizza_omino.value = '3';
		 
		 
    pressRegistra = true;
    document.frm_generale.hpressRegistra.value = pressRegistra;
    document.frm_generale.hcodici.value = cdc;
    document.frm_generale.hgu.value = document.frm_web.webuser.value;
    document.frm_generale.hop.value = document.frm_web.opIMC.value;
    
	if(document.frm_web.opIMC.value == '')
         document.frm_generale.hop.value='CANC';
    
	if(document.frm_generale.hop.value == 'INS')
	{
        popup = window.open('PasswordServlet?nome_form=frm_generale','popDialog','height=250,width=400,scrollbars=no,top=200,left=300');
	}
    else {
         document.frm_generale.submit(); 
         alert(ritornaJsMsg('reg'));
         
		 chiudi_ins_mod();
        }
}
  
  
function chiudi()
{
	opener.aggiorna_worklist();
	self.close();
}
     
	 
function chiudi_ins_mod()
{
	opener.parent.Ricerca.put_last_value(document.frm_web.webuser.value);
	
	if (servlet === 'UTSERVLET') self.close();
}	 
         

function popolaVisualizzaOmino()
{
	var vis_omino_salvato = document.frm_web.hvis_omino.value;

	//alert('Visualizza Omino: ' + vis_omino_salvato);

	try {
		document.all.visualizza_omino.options[0] = new Option('NON visualizzare omino', '0', false, false);	
		document.all.visualizza_omino.options[1] = new Option('Visualizzare omino in prenotazione', '1', false, false);	
		document.all.visualizza_omino.options[2] = new Option('Visualizzare omino in accettazione', '2', false, false);	
		document.all.visualizza_omino.options[3] = new Option('Visualizzare omino sia in prenotazione che in accettazione', '3', false, false);
		
		if(vis_omino_salvato == '')
			document.all.visualizza_omino.options[3].selected = true;
			
		if(vis_omino_salvato == '0')
			document.all.visualizza_omino.options[0].selected = true;
		if(vis_omino_salvato == '1')
			document.all.visualizza_omino.options[1].selected = true;
		if(vis_omino_salvato == '2')
			document.all.visualizza_omino.options[2].selected = true;
		if(vis_omino_salvato == '3')
			document.all.visualizza_omino.options[3].selected = true;	
	} catch (e) {
		//alert(e.message);
	}
}		 

function apri_scan_db(procedura, campo)
{
    var finestra = window.open('','winScanDb','width=250,height=600, resizable = yes, status=yes, top=10,left=10');
    document.form_scan_db.myric.value = campo;
    document.form_scan_db.myproc.value = procedura;
    document.form_scan_db.mywhere.value = '';
    document.form_scan_db.submit();
}

function CambiaTipoPersonale(ck)
{
	$('input[name=tipo_utente]:checked').attr('checked', false);
	if(ck) {
		$('input[name="tipo_utente"][value='+document.frm_web.htipo_iden_per.value+']').attr('checked', true);
	}
	document.frm_web.nome_per_precedente.value = document.frm_web.nome_per.value;
	if (servlet === 'UTSERVLET') return;

	// Queste istruzioni vengono eseguite solo dalla nuova pagina creata con il configuratore
	if ($('input[name=tipo_utente]:checked').is(':checked')) {
		$('input[name=tipo_utente]').parent().parent().css('visibility', 'visible');
		$('input[name=tipo_utente]').parent().parent().show();
	} else {
		$('input[name=tipo_utente]').parent().parent().css('visibility','hidden');
		$('input[name=tipo_utente]').parent().parent().hide();
	}
}

function controlla_webuser()
{
	var res = controllo_correttezza_webuser(document.frm_web.webuser, 'alert_wrong_webuser');
	if(res == 1)
		CJsCheckPrimaryKey.check_primary_key("web@webuser='"+document.frm_web.webuser.value+"'@attivo", cbkPrimaryKey);
}

function cbkPrimaryKey(attivo)
{
	if(attivo == 'N')
	{
		var ripristina = confirm(ritornaJsMsg('webuser_cancellato'));//L'utente inserito è già presente nel database ma è cancellato:vuoi ripristinarlo?
		if(ripristina)
			ripristina_pc();
		else
		{
			document.frm_web.webuser.value = '';
			document.frm_web.webuser.focus();
		}
		return;
	}
	if(attivo == 'S')
	{
		alert(ritornaJsMsg('webuser_esistente'));//L'utente inserito è già presente nel database.Modificare il webuser
		document.frm_web.webuser.value = '';
		document.frm_web.webuser.focus();
		return;
	}
	else
		if(attivo != 'S' && attivo != 'N' && attivo != '')
		{
			alert(attivo);//errore
			return;
		}
}

function ripristina_pc(){	
	CJsCheckPrimaryKey.ripristina_record("web@webuser = '" + document.frm_web.webuser.value + "'@attivo='S',deleted='N'", cbkRipristino);
}
	
function cbkRipristino(message){
	
	if(message != '')
	{
		alert(message);
		return;
	}
	else
	{
		chiudi_ins_mod();
	}
}

/**
 * Nuova implementazione per la gestione degli utenti mediante l'uso del configuratore.
 * ATTENZIONE: per mantenere la compabilità con la vecchia versione, si sono mantenute
 *             alcune variabili e funzioni in comune.
 * 
 * @author  gianlucab
 * @version 1.0
 * @since   2014-07-28
 */
if (typeof jQuery === 'function') {
jQuery(document).ready(function() 
{
	if (servlet === 'UTSERVLET') return;

	// Queste istruzioni vengono eseguite solo dalla nuova pagina creata con il configuratore
    try {
    	GESTIONE_UTENTI.init();
    	GESTIONE_UTENTI.caricaDati();
    	GESTIONE_UTENTI.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
});

var GESTIONE_UTENTI = {};
(function() {
	this.init = function() {
		document.title = 'Gestione utenti';
		WindowCartella = opener.top;
		operazione = $('form[name=EXTERN] input[name=OPERAZIONE]').val(); // INS o MOD
		operazione = typeof operazione !== 'string' || operazione.match(/^(undefined||null|INS)$/i) ? 'INS' : operazione.toUpperCase();
		
		switch(baseGlobal.SITO){
		case  'ASL2':
			$('#groupGestioneLDAP').hide();
			$('#lblGestioneLDAP').parent().parent().parent().hide();
			break;
		default:
			$('#groupUtilitaSistema FIELDSET').eq(1).hide();
		}
		
		
		// CSS
		$('td.classTdLabel').css('width', '30%');
		$('#webuser').css('text-transform', 'lowercase');
		$('#nome_per').css('text-transform', 'uppercase');
		
		// JS
		$('#webuser').attr('maxlength', '30').parent().attr('colspan','14');
		$('#nome_per').attr('length', '70').attr('size', '70').attr('maxlength', '60').parent().attr('colspan','14');
		$('input[name=livello]').parent().css({'width':'1%','padding-right':'5em'});
		$('input[name=livello]').last().parent().css({'width':'auto','padding':''});
				
		$('#nome_per').parent().append(
			'&nbsp;<span style="font-weight:bold;font-size:10pt"><a style="text-decoration:none;color:blue;" href="javascript:GESTIONE_UTENTI.openTabIns(\'INS\');" title="Inserimento"><img height="16" width="16" src="imagexPix/contextMenu/MnCntIns.gif" border="0">&nbsp;Nuovo</span></a>'
			+'&nbsp;<span style="font-weight:bold;font-size:10pt"><a style="text-decoration:none;color:blue;" href="javascript:GESTIONE_UTENTI.openTabIns(\'MOD\');" title="Modifica"><img height="16" width="16" src="imagexPix/contextMenu/MnCntEdit.gif" border="0">&nbsp;Modifica</span></a>'
		);
	};
	
	this.caricaDati = function() {
		var rs = null;
		document.frm_web.opIMC.value = operazione;
		
		switch (operazione) {			
		// Modifica utente
		case 'MOD':
			var pBinds = new Array();
			pBinds.push($('form[name=EXTERN] input[name=CODICE]').val());
			rs = WindowCartella.executeQuery("gestione_utenti.xml","info",pBinds);
			if(rs.next()){
				var webuser = rs.getString('webuser');
				$('input[name=webuser]').val(webuser);
				$('input[name=nome_per]').val(rs.getString('descr'));
				$('input[name=iden_per]').val(rs.getString('iden_per'));
				$('input[name=tipo_utente][value='+rs.getString('tipo')+']').attr('checked', true);
				$('input[name=livello][value='+rs.getString('livello')+']').attr('checked', true);
				$('input[name=infoGruppoLDAP]').val(rs.getString('infogruppoLDAP'));
				//$('input[name=last_access]').val(rs.getString('data_ultimo_utilizzo'));
				//$('input[name=last_password]').val(rs.getString('data_inserimento_pw'));
				//$('input[name=abilita_context_menu]').attr('checked', rs.getString('abilita_context_menu').toUpperCase() == 'S');
				
				// Attributi readonly
				$('input[name=webuser]').attr('readonly',true);
				
				// Carica le descrizione dei cdc
				rs = WindowCartella.executeQuery("gestione_utenti.xml","descrizioni_cdc",[webuser, webuser]);
				while(rs.next()){
		    		descrizioni[rs.getString('cod_cdc')] = rs.getString('descr');
		    	}
				
				// Carica i cdc attivi in base alle scadenze
				pBinds.push(pBinds[0], pBinds[0], pBinds[0], pBinds[0]);
				rs = WindowCartella.executeQuery("gestione_utenti.xml","cdc",pBinds);
				while(rs.next()){
					var cdc_attivi_utente = rs.getString('reparti').replace(/\,/g,"*");
					var txtDataInizioAbilitazione = rs.getString('data_inizio_abilitazione');
					var txtDataFineAbilitazione = rs.getString('data_fine_abilitazione');
					this.addCDC(cdc_attivi_utente, txtDataInizioAbilitazione, txtDataFineAbilitazione);
				}
				this.aggiornaCDC();
				
				//carica il gruppo di visualizzazione onesys attivo  
				rs = WindowCartella.executeQuery("gestione_utenti.xml","us_conf_web",[webuser]);
				while(rs.next()){
					$('select[name=cmbGruppi]').val(rs.getString('gruppo'));
		    	}
				
				
				break;
			}
			// Se non trovo il personale da modificare, proseguo con un inserimento
			operazione = 'INS';
		
		// Inserimento utente
		case 'INS':
			if (baseGlobal.SITO=='RAVENNA'){
				$('input[name=infoGruppoLDAP]').val('intra.ausl.ra.it');
			}
			break;
		default:
		}
	};
	
	this.setEvents = function() {
		// Apertura a tutto schermo e focus sul webuser
		tutto_schermo();
		$('#webuser').focus();
		
		// Gestione scandb
		$('#nome_per').keydown(function(e){if(e.keyCode==13){window.focus();e.preventDefault();}});

		// Apertura layer default
		//HideLayer('groupAltriParametri');
		
		// Associazione apertura delle sezioni con un click
		$('.classTabHeaderMiddle label').css('cursor', 'pointer').each(function(){
			var id = $(this).attr('id').replace('lbl', 'group');
			$(this)[0].onclick = function(){ShowHideLayer(id);};
		});
	    
		// Attributi readonly non cliccabili
		$('input[readonly]').focus(function(){$(this).blur();});

		// Form
		$('form[name=form_associa_cdc]').attr('action', 'AssCDCServlet').attr('target', 'winAssCdc');
		document.frm_generale.submit = function() {
			ajaxUserManage.getCryptedString(
				document.frm_generale.hpwd.value /* password da criptare*/,
				function(returnValue){ /* funzione di callback */
					document.frm_generale.hpwd.value = returnValue;
					registra();
				}
			);
		};
		
		// Controllo inserimento utente
		var rs = null;
		$('form[name=frm_web] input[name=webuser]').blur(function() {
			if (operazione == 'MOD') return;
			
			var webuser = $(this).val().toLowerCase();
			if (webuser.match(/[^a-z0-9\-\_]/)) {
				alert(ritornaJsMsg('alert_wrong_webuser'));
				$(this).val('');
				return;
			}

			rs = WindowCartella.executeQuery("gestione_utenti.xml","webuser",[webuser]);
			if(rs.next()) {
				cbkPrimaryKey(rs.getString('attivo'));
			} else {
				//$('#nome_per').focus();
			}
		});
		
		// Impedisce di modificare la finestra corrente se è attiva la finestra di inserimento del personale
		$(window).focus(parent_disable).click(parent_disable).bind('beforeunload', function() {
			try {
				popupWindow.close();
			} catch(e) {}
		});
		
		// Nascondo la riga del tipo utente quando non è selezionato
		if ($('input[name=tipo_utente]:checked').is(':checked')) {
			$('input[name=tipo_utente]').parent().parent().css('visibility', 'visible');
			$('input[name=tipo_utente]').parent().parent().show();
		} else {
			$('input[name=tipo_utente]').parent().parent().css('visibility','hidden');
			$('input[name=tipo_utente]').parent().parent().hide();
		}
		
		// Aggiunta attributo "for" per le label accanto ai radio input
		$("input:radio").each(function() {
			var label = $(this).next().next();
			if (label.attr("tagName").toUpperCase() == 'LABEL') {
				var idname = $(this).attr('name')+'_'+$(this).val();
				$(this).attr("id", idname);
				label.attr("for", idname);
			}
		});
		
		// Controlla livelli di utente con attributi particolari
		var livello = '1';
		rs = WindowCartella.executeQuery("gestione_utenti.xml","attributi",[$('form[name=frm_web] input[name=webuser]').val().toLowerCase()]);
		while(rs.next()){
			livello = rs.getString('livello');
			if (livello == '1' && rs.getString('attributo') == 'POWER') {
	    		livello = '2';
	    		break;
    		}
    	}
		
		// Riseleziono il livello utente
		$('input[name=livello][value='+livello+']').attr('checked', true);

		// Controlla i privileggi dell'utente loggato
		livello = '1';
		rs = WindowCartella.executeQuery("gestione_utenti.xml","attributi",[baseUser.LOGIN]);
		while(rs.next()){
			livello = rs.getString('livello');
			if (livello == '1' && rs.getString('attributo') == 'POWER') {
				livello = '2';
	    		break;
    		}
    	}
		
		// Disabilito la selezione dell'utente se l'utente loggato è un utente standard o se l'utente selezionato è un utente system
		switch(livello) {
		case '2': // Power user/Amministratore
			if ($('input[name=livello][value=0]').is(':checked')) {
				$('input[name=livello]').attr('disabled', true);
			} else {
				$('input[name=livello][value=0]').attr('disabled', true);
			}
			break;
		case '0': // System
			break;
		case '1': // Standard
		default:
			$('input[name=livello]').attr('disabled', true);
			break;
		}
	};
	
	this.addCDC = function(cdc_attivi_utente, data_inizio_abilitazione, data_fine_abilitazione) {
		cdc_attivi_utente = typeof cdc_attivi_utente === 'string' ? cdc_attivi_utente : "";
		data_inizio_abilitazione = typeof data_inizio_abilitazione === 'string' ? data_inizio_abilitazione : "";
		data_fine_abilitazione = typeof data_fine_abilitazione === 'string' ? data_fine_abilitazione : "";
		
		$('#lblAggiungiCDC').parent().parent().hide();
		
		var tr =
			"<tr>"+
			"<td STATO_CAMPO='E' class='classTdField' style='text-align:center'><label name='lblAssociaCDC"+rownum+"' id='lblAssociaCDC"+rownum+"'><A style='color:red;font-weight:bold' href='javascript:GESTIONE_UTENTI.delCDC(\"cdc_attivi_utente"+rownum+"\");' title='Elimina questa associazione'>X</A></label></td>"+
			"<td STATO_CAMPO='E' class='classTdField' style='background-color:#FFCCCC'><A id='lnkAssociaCDC"+rownum+"' href='javascript:GESTIONE_UTENTI.assrep(\""+rownum+"\");' title='Clicca per associare un reparto'>Associa CDC</A><INPUT id='cdc_attivi_utente"+rownum+"' type='hidden' name='cdc_attivi_utente"+rownum+"' STATO_CAMPO='E' value='"+cdc_attivi_utente+"'/></td>"+
			"<td STATO_CAMPO='E' class='classTdLabel'><label id='lblDataInizioAbilitazione"+rownum+"' name='lblDataInizioAbilitazione"+rownum+"'>Data inizio abilitazione</label></td>"+
			"<td STATO_CAMPO='E' class='classTdField'><input id='txtDataInizioAbilitazione"+rownum+"' STATO_CAMPO='E' name='txtDataInizioAbilitazione"+rownum+"' maxlength='10' value='"+data_inizio_abilitazione+"' size='10' type='text'/></td>"+
			"<td STATO_CAMPO='E' class='classTdLabel'><label id='lblDataFineAbilitazione"+rownum+"' name='lblDataFineAbilitazione"+rownum+"'>Data fine abilitazione</label></td>"+
			"<td STATO_CAMPO='E' class='classTdField'><input id='txtDataFineAbilitazione"+rownum+"' STATO_CAMPO='E' name='txtDataFineAbilitazione"+rownum+"' maxlength='10' value='"+data_fine_abilitazione+"' size='10' type='text'/></td>"+
			"</tr>";
		
		$('#groupUtilitaSistema table :first').append(tr);
		$('#lblAggiungiCDC').parent().attr('colspan','6').parent().remove().show().insertAfter($('#lblAssociaCDC'+rownum).parent().parent());
	    controlloData('txtDataInizioAbilitazione' + rownum); controlloData('txtDataFineAbilitazione' + rownum);
	    setDatepicker('txtDataInizioAbilitazione' + rownum); setDatepicker('txtDataFineAbilitazione' + rownum);
		rownum++;
	};
	
	this.delCDC = function(cdc_attivi_utente) {
		var done = true;
		var reparti = $('#'+cdc_attivi_utente).val();
		
		if (reparti != "")
			done = confirm('Si sta per eliminare l\'associazione per i seguenti reparti:\n'+reparti.split("*").join('\n')+"\nProcedere?");
			
		if (done) $('#'+cdc_attivi_utente).parent().parent().remove();
		this.aggiornaCDC();
	};
	
    /**
     * Aggiorna i cdc_scelti e la variabile globale cdc con il contenuto di tutti i cdc selezionati (in caso
     * di scelta multipla).
     * 
     * @param cdc_scelti (String)
     */
    this.aggiornaCDC = function(cdc_scelti, arr_descrizioni) {
    	if (typeof arr_descrizioni === 'object') {
	    	for (var i in arr_descrizioni) {
	    		descrizioni[i] = arr_descrizioni[i];
	    	}
    	}
    	aggiorna_cdc(cdc_scelti);
    };

	/**
	 * Funzione che associa i reparti selezionati dall'utente.
	 * 
	 * Descrizione del flusso:
	 * 1. document.form_associa_cdc.cdc_scelti = cdc; // tutti i cdc scelti da escludere nell'elenco generale
	 * 2. document.form_associa_cdc.cdc_visibili = document.frm_web.cdc_attivi_utente<N>; // sottoelenco di reparti associati
	 * 3. document.form_associa_cdc.submit();
	 * 4.1 document.frm_web.cdc_attivi_utente<N> = <codici registrati>;
	 * 4.2 aggiorno cdc globale
	 * 5. document.frm_generale.hcdc_attivi_utente = cdc; // l'intero elenco dei cdc scelti
	 * 
	 * @param row	(String) identificativo della riga che contiene i cdc selezionati
	 */
	this.assrep = function(row) {
		associa_cdc(row);
	};
    
    /**
     * Salva il form.
     */
	this.salva = function() {
		salva();
	};
	
	this.close = function() {
		try {
	        if (!GESTIONE_UTENTI.setPwd) alert(ritornaJsMsg('reg'));
			opener.parent.Ricerca.put_last_value(document.frm_web.webuser.value);
			/* //TODO
			 * Attenzione: non ricarica il baseUser neanche con location.reload(true);
			 */
		} catch(e) {
			alert(e.message);
		}
		//location.reload(true);
		self.close();
	};
	
	this.getOperazione = function() {
		return operazione;
	};
	
	this.getRow = function() {
		return rownum;
	};
	
	this.openTabIns = function(val, tipo /* @deprecato */) {
		var doc = document.form;
		
		if(val == 'MOD' || val == 'INS' || tipo)
		{
			if (!tipo)
			{
				popupWindow = window.open(
					'servletGenerator?KEY_LEGAME=INSERISCI_PERSONALE&OPERAZIONE='+val+'&WEBUSER='+$('#webuser').val()+'&TIPO='+$('input[name=tipo_utente]:checked').val()+'&CODICE='+$('input[name=iden_per]').val(),
					'',
					'left=0,top=0,directories=no,titlebar=no,toolbar=no,location=no,status=yes,menubar=no,scrollbars=yes,resizable=no,width=1000,height=600'
				);
			}
			/*
			 * @deprecato
			 */
			else {
				switch(tipo) {
				case 'M':
					doc.target = 'winTabMed';
					doc.action = 'TabMedicoServlet';
					break;
				case 'T':
				case 'I':
					doc.target = 'winTabTecInf';
					doc.action = 'TabTecInfServlet';
					break;
				case 'O':
					doc.target = 'winTabOpe';
					doc.action = 'TabOperatoriServlet';
					break;
				default:
					alert('Il tipo '+tipo+' non è definito.');
					return;
				}
				
				popupWindow = window.open('', doc.target ,'width=1000,height=600, status=yes, top=0,scrollbars=yes, resizable=no,left=0');
			    doc.hoperazioneTab.value = 'INS';
			    doc.hidenTab.value = '';
			    doc.submit();
			}
		}
	};
	
	this.aggiornaPersonale = function(cod_dec) {
		var pBinds = [cod_dec];
		var rs = WindowCartella.executeQuery("gestione_utenti.xml",'info_personale',pBinds);
		if(rs.next()) {
			$('input[name=nome_per]').val(rs.getString('descr'));
			$('input[name=iden_per]').val(rs.getString('iden_per'));
			$('input[name=tipo_utente]:checked').attr('checked', false);
			$('input[name=tipo_utente][value='+rs.getString('tipo')+']').attr('checked', true);
		}
	};
	
	this.setPwd = false;
	
	//// funzioni e variabili private ////////////////////////////////////////////////////////
	var rownum = 1;
	var riga_selezionata = "";
	var WindowCartella = null;
	var popupWindow = null;
	var operazione = "";
	var descrizioni = [];
	
	function controlloData(id)
	{
		try {
			var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
			oDateMask.attach(document.getElementById(id));
		}catch(e){
			alert(e.message);
		}
	}
    
    function setDatepicker(id)
    {
        $('#' + id).removeClass('hasDatepick');
        $('#' + id).next().remove();
        $('#' + id).datepick({
            onClose: function() {
                jQuery(this).focus();
            },
            showOnFocus: false,
            minDate: function() {
            	
            	var d = new Date();			
                d.setYear('1900');
                d.setMonth('00');
                d.setDate('01');					
				return d;
            },
            showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"/>'
        });
    }
    
    function associa_cdc(row)
    {
		if (typeof row !== 'string') row = "";
		riga_selezionata = row;
		
		var utente			= jQuery("input[name=webuser]").val();
		var operazione		= jQuery("input[name=opIMC]").val();
		var data_inizio_cdc	= jQuery("input[name=txtDataInizioAbilitazione"+row+"]").val();
		var data_fine_cdc	= jQuery("input[name=txtDataFineAbilitazione"+row+"]").val();
		var cdc_visibili	= jQuery("input[name=cdc_attivi_utente"+row+"]").val();
		//alert(operazione);
		//alert(data_inizio_cdc);
		//alert(data_fine_cdc);
		//alert(cdc_visibili);
	   
		/* var scelta_cdc = window.open("","winAssCdc","width=400,height=520, scrollbars=no,top=10,left=10");*/
	    jQuery("form[name=form_associa_cdc] input[name=cdc_scelti]").val(cdc);
	    //jQuery("form[name=form_associa_cdc] input[name=webuser]").val('" + this.webUser + "');
	    jQuery("form[name=form_associa_cdc] input[name=webuser]").val(utente);
	    //jQuery("form[name=form_associa_cdc] input[name=operazione]").val('" + this.operazione + "');
	    jQuery("form[name=form_associa_cdc] input[name=operazione]").val(operazione);
	    
	    jQuery("form[name=form_associa_cdc] input[name=data_inizio_cdc]").val(data_inizio_cdc);
	    jQuery("form[name=form_associa_cdc] input[name=data_fine_cdc]").val(data_fine_cdc);
	    jQuery("form[name=form_associa_cdc] input[name=cdc_visibili]").val(cdc_visibili);
	    
	    /* document.form_associa_cdc.submit();
	    
	    if (setCdc == true){
	    	document.frm_generale.hsetCdc.value = true;
	    }*/

		var url='servletGenerator?KEY_LEGAME=ASSOCIA_CDC&UTENTE='+encodeURIComponent(utente);
		$.fancybox({
			'padding'	: 3,
			'width'		: 800,
			'height'	: 600,
			'href'		: url,
			'type'		: 'iframe'
		});
    }
    
    function parent_disable(event)
    {
    	if(popupWindow && !popupWindow.closed)
    	{
    		try {
    			popupWindow.focus();
    	    	return false;
    		} catch(e) {
    			popupWindow = null;
    		}
    	}
    	return null;
    }
    
    function aggiorna_cdc(cdc_scelti)
    {
		if (typeof cdc_scelti === 'string') jQuery('form[name=frm_web] input[name=cdc_attivi_utente'+riga_selezionata+']').val(cdc_scelti);

		var cdc_selezionati = true; // tutti i cdc sono stati impostati
		cdc = "";
		
		jQuery('form[name=frm_web] input[name^=cdc_attivi_utente]').each(function(){
			var i_cdc = $(this).val().replace(/[\#\*]+$/g, '');
			var row = $(this).attr('name').match(/\d+$/)[0];
			
			cdc += i_cdc+'#';
	    	
			if ($(this).val().match(/^[\*]*$/) == null) {
				var arr_cdc = i_cdc.replace(/[\*]+$/,"").split("*");
				var text = "";
				var n = 1;
				var m = arr_cdc.length - n; 
				if (m > 0) {
					text = join_cdc(arr_cdc.slice(0, n), ", ")+", ... (più altri " + m + " reparti)";
				} else {
					text = join_cdc(arr_cdc, ", ");
				}
				
	    		$('#lnkAssociaCDC'+row).text(text);
	    		$('#lnkAssociaCDC'+row).attr('title',join_cdc(arr_cdc, ", "));
	    		$('#lnkAssociaCDC'+row).css('text-decoration','none');
	    		$('#lnkAssociaCDC'+row).parent().css('background-color', ''); // default
	    	} else {
	    		$('#lnkAssociaCDC'+row).text('Associa CDC');
	    		$('#lnkAssociaCDC'+row).attr('title','Clicca per associare un reparto');
	    		$('#lnkAssociaCDC'+row).css('text-decoration','underline');
	    		$('#lnkAssociaCDC'+row).parent().css('background-color', '#FFCCCC');
	    		cdc_selezionati = false;
	    	}
		});
		cdc = cdc.replace(/[\#\*]+$/g, '');
		//alert(cdc);
		
		return cdc_selezionati;
	}
    
	function salva()
	{
		var pressRegistra 	= false;
		var doc 			= document.frm_web;
		var doc_gen 		= document.frm_generale;
		var mancano			= '';

		//CDC
		var cdc_selezionati = aggiorna_cdc();
				
		//CAMPI OBBLIGATORI
		doc.webuser.value = trim(doc.webuser.value.toLowerCase());
		if (doc.webuser.value == '')
		{
			mancano += '- UTENTE\n';
		}

		if((doc.opIMC.value == 'INS' && doc.iden_per.value == '') || (doc.opIMC.value == 'MOD' && doc.nome_per.value == '')/* || $('input[name=tipo_utente]:checked').val()==null*/)
		{
			mancano += '- NOME UTENTE\n';
		}
			
		if ($('input[name=livello]:checked').val()==null)
		{
			mancano += '- LIVELLO UTENTE\n';
		}

		if(cdc == '' || !cdc_selezionati)
		{
			mancano += "- CDC ASSOCIATI ALL'UTENTE\n";
		}
			
		
		if ($('SELECT[name=cmbGruppi]').val()=='' && baseGlobal.SITO=='ASL2')
		{
			mancano += '- FUNZIONALITA\' ATTIVE\n';
		}
		
		if (mancano != '')
		{
			alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
			return;
		}
		
		// SCADENZE
		var arr_date = [];
		var data_inizio = '';
		var data_fine = '';
		
		$('form[name=frm_web] input[name^=txtDataInizioAbilitazione]').each(function(){
			var rownum = $(this).attr('name').match(/[\d]+$/)[0].toString();
			var field_data_inizio = $(this);
			var field_data_fine = $('form[name=frm_web] input[name=txtDataFineAbilitazione'+rownum+']');
			arr_date[rownum] = {
				'campo_inizio': field_data_inizio, 'data_inizio': parseDate(field_data_inizio.val()),
				// NOTA: per comodità dell'utente, la data di fine abilitazione è considerata inclusa.
				'campo_fine': field_data_fine, 'data_fine': parseDate(field_data_fine.val(), +1)
			};
		});

		for(var item in arr_date) {
			// Se entrambe le date non sono state compilate passa alla successiva riga dei centri di costo
			if (isNaN(arr_date[item].data_inizio.getTime()) && isNaN(arr_date[item].data_fine.getTime())) {
				data_inizio +=arr_date[item].campo_inizio.val()+'#';
				data_fine += arr_date[item].campo_fine.val()+'#';
				continue;
			}
			
			// Se la data di inizio è mancante, si prega di inserirla
			if (isNaN(arr_date[item].data_inizio.getTime())) {
				alert(ritornaJsMsg('alert_data_inizio'));
				$(arr_date[item].campo_inizio).focus();
				return;
			// Se la data di fine è mancante o anteriore, si prega di reinserirla corretta
			} else if (isNaN(arr_date[item].data_fine.getTime())
				|| arr_date[item].data_fine.getTime() <= arr_date[item].data_inizio.getTime()) {
				alert(ritornaJsMsg('alert_data_fine'));
				$(arr_date[item].campo_fine).focus();
				return;
			}
			
			// Le date inserite sono valide
			data_inizio +=arr_date[item].campo_inizio.val()+'#';
			// Salvo sul DB la data di fine abilitazione, esclusa
			data_fine += toStringDate(arr_date[item].data_fine)+'#';
		}
		/*
		//Gestione campo web.FILTRI_VOCI_INATTIVE
		if(doc.filtri_voci_inattive.checked)
			doc_gen.hfiltri_voci_inattive.value = 'S';
		else
			doc_gen.hfiltri_voci_inattive.value = 'N';

		//CDC_UTENTE
		if(doc.cdc_utente.checked)
			doc_gen.hcdc_utente.value = 'S';
		else
			doc_gen.hcdc_utente.value = 'N';

		//ABILITA_CONTEXT_MENU
		if(doc.abilita_context_menu.checked)
			doc_gen.habilita_context_menu.value = 'S';
		else
			doc_gen.habilita_context_menu.value = 'N';	
	 	*/
	    doc_gen.hwebuser.value = doc.webuser.value;
	    doc_gen.hiden_per.value = doc.iden_per.value;
	    /*doc_gen.hcod_ope.value = '';
	    doc_gen.hcod_ope.value = doc.cod_ope_pre.value + doc.cod_ope_acc.value + 
	    doc.cod_ope_ese.value + doc.cod_ope_ref.value+doc.cod_ope_ana.value + 
	    doc.cod_ope_par.value + doc.cod_ope_mag.value+doc.cod_ope_can.value + doc.ripr_canc.value + 
	    doc.cod_canc_esa.value;

	    var permessi_tabelle = '';
	    
		if (doc.permesso_tabelleA.checked == 1)
	         permessi_tabelle += 'A';
	    else
	         permessi_tabelle += ' ';
	    
		if (doc.permesso_tabelleT.checked == 1)
	         permessi_tabelle += 'T';
	    else
	    	permessi_tabelle += ' ';
	    
		if (doc.permesso_tabelleE.checked == 1) 
			permessi_tabelle += 'E';
	    else
	    	permessi_tabelle += ' ';
	    
		if (doc.permesso_tabelleR.checked == 1)
	         permessi_tabelle += 'R';
	    else
	         permessi_tabelle += ' ';
	    
		if (doc.permesso_tabelleP.checked == 1)
	         permessi_tabelle += 'P';
	    else
	    	permessi_tabelle += ' ';
	    
		if (doc.permesso_tabelleO.checked == 1)
	         permessi_tabelle += 'O';
	    else
	    	permessi_tabelle += ' ';
	    
		if (doc.permesso_tabelleC.checked == 1)
	        permessi_tabelle += 'C';
	    else
	    	permessi_tabelle += ' ';
	    
		if (doc.permesso_tabelleX.checked == 1)
	         permessi_tabelle += 'X';
	    else
	    	permessi_tabelle += ' ';
			
		if(permessi_tabelle == '        ')
			permessi_tabelle = '          ';
		
		//alert(permessi_tabelle.length);
		
	    doc_gen.hiden_group.value = doc.group.value;
		doc_gen.hgest_tab.value = permessi_tabelle;
	*/	
	    doc_gen.hlivello.value = $('input[name=livello]:checked').val();
	    doc_gen.hnome_per.value = doc.nome_per.value;
        
	    /*doc_gen.hcdc_attivi_utente.value = doc.cdc_attivi_utente.value;*/
	    /*doc_gen.hPH_DimCar.value = doc.PH_DimCar.value; */
		doc_gen.hinfoGruppoLDAP.value = doc.infoGruppoLDAP.value;
	    /*doc_gen.hlingua.value = doc.lingua.value; */ 
        
        doc_gen.htipo.value = $('input[name=tipo_utente]:checked').val();
		doc_gen.hvisualizza_omino.value = doc.visualizza_omino.value;
        
	    pressRegistra = true;
	    document.frm_generale.hpressRegistra.value = pressRegistra;
	    document.frm_generale.hcodici.value = cdc;
	    document.frm_generale.hdata_inizio.value = data_inizio.replace(/[\#]$/,'');
	    document.frm_generale.hdata_fine.value = data_fine.replace(/[\#]$/,'');
	    document.frm_generale.hgu.value = document.frm_web.webuser.value;
	    document.frm_generale.hop.value = document.frm_web.opIMC.value;
	    
	    document.frm_generale.hCodGruppoOnesys.value =$('select[name=cmbGruppi]').val();
	    
		if(document.frm_web.opIMC.value == '') {
	         document.frm_generale.hop.value='CANC';
		}
		if(document.frm_generale.hop.value == 'INS') {
	        GESTIONE_UTENTI.setPwd = true;
			popup = window.open('PasswordServlet?nome_form=frm_generale','popDialog','height=250,width=400,scrollbars=no,top=200,left=300');
		} else {
			GESTIONE_UTENTI.setPwd = false;
			registra();
	    }
	}
	
	function trim(s)
	{
		if (typeof s === 'string')
		{
			return s.replace(/^\s+|\s+$/, '');
		}
		return '';
	}
	
	function join_cdc(arr, separator)
	{
		if (arr.length > 0) {
			var s = '';
			var i=0;
			do {
				if (typeof descrizioni[arr[i]] === 'string') {
					s += descrizioni[arr[i]];
				} else {
					s += arr[i];
				}
				if (++i<arr.length)
					s+= separator;
				else break;
			} while(1);
			return s;
		}
		return arr.join(separator);
	}
	
	/**
	 * Restituisce un oggetto data da una stringa nel formato dd/mm/yyyy.
	 * 
	 * @param strDate (String) la stringa da convertire in data
	 * @param days    (int) il numero di giorni da sommare o sottrarre (opzionale)
	 * @return la data convertita
	 */
	function parseDate(strDate, days) {
		days = typeof days === 'number' ? days*86400000 : 0;
		
		var arrDate = strDate.match(/^([\d]{2})[^\d]([\d]{2})[^\d]([\d]{4})$/);
		if (arrDate == null) return new Date(undefined);
		
		var dd = parseInt(arrDate[1], 10);
		var mm = parseInt(arrDate[2], 10)-1;
		var yyyy = parseInt(arrDate[3], 10);
		var date = new Date(yyyy, mm, dd);
		return new Date(date.getTime()+days);
	}
	
	/**
	 * Restituisce una stringa nel formato dd/mm/yyyy da un oggetto data.
	 */
	function toStringDate(date) {
		try {
			var dd = ("0"+date.getDate()).slice(-2);
			var mm = ("0"+(date.getMonth()+1)).slice(-2);
			var yyyy = date.getFullYear();
			return dd+"/"+mm+"/"+yyyy;
		} catch(e) {}
		return "";
	}
	
	/**
	 * Restituisce la data corrente
	 */
	function getToday() {
		var now = new Date();
		return new Date(now.getFullYear(), now.getMonth(), now.getDate());
	}
}).apply(GESTIONE_UTENTI);

function aggiorna_worklist() {/* do nothing */}

} // end if