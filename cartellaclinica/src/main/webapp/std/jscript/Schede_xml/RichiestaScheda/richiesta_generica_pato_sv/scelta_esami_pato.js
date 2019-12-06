/**
 * File JavaScript in uso dalla scheda 'SCELTA_ESAMI_PATO'.
 * Nota: per i materiali è ammesso qualsiasi valore editato.
 * 
 * @author  gianlucab
 * @version 1.1
 * @since   2014-09-22
 */
//variabili per le funzioni di filtroQuery
var PAGINA = 'ANATOMIA_PATOLOGICA';
var _filtro_list_materiali = null;
var _filtro_list_esami = null;
var _filtro_list_corpo = null;
var numeroRiga = 0;
var tipoChiamata='DEFAULT';
var charsNotAllowed = [String("@").charCodeAt(0), String("#").charCodeAt(0)];

/* css - inserisco qui le larghezze in modo da gestire le larghezze in un punto solo*/
larghezza1= " 3%; ";
larghezza2= " 23%; ";
larghezza3= " 23%; ";
larghezza4= " 23%; ";
larghezza5= " 28%; ";

var SEDI  = {};
var ESAMI = {};

//stabilisco un ordine per le pagine e setto delle variabili per comodità
var prima=document.getElementById('divElencoMateriali');
var seconda=document.getElementById('divElencoEsami');
var terza=document.getElementById('divElencoCorpo');

jQuery(document).ready(function(){
	//FIXME
	dwr.engine.setAsync(false);		
	toolKitDB.getListResultData(
		"select min(art.cod_art) min, max(art.cod_art) max from radsql.MG_ART ART, radsql.COD_EST_TABELLA CET where origine='"+PAGINA+"' and CET.CODICE=ART.IDEN AND CET.TABELLA='TAB_ESA' " +
		"union all " +
		"select min(te.iden) min, max(te.iden) max from radsql.TAB_ESA TE, radsql.COD_EST_TABELLA CET where origine='"+PAGINA+"' and CET.IDEN_TABELLA=TE.IDEN and tabella='TAB_ESA' and te.attivo = 'S'",
		function(rs) {
			if (rs.length == 2) {
				SEDI  = {"MIN": String(rs[0][0]), "MAX": String(rs[0][1])};
				ESAMI = {"MIN": Number(rs[1][0]), "MAX": Number(rs[1][1])};
			}
		}
	);
	dwr.engine.setAsync(true);
	
	caricamento();
	
	switch (_STATO_PAGINA){

		// 	INSERIMENTO ////////////////////////////////
		case 'I': case 'E':

			//ONCLICK  elencoMateriali
			document.getElementById("elencoMateriali").onclick=function(){			
				try {
					scegli(document.getElementById('elencoMateriali'),document.getElementById('txtRiepilogoMateriale'),document.getElementById('hRiepilogoMateriale'));
					
					/*filtroEsami();*/ // Per anatomia patologica i materiali sono un campo libero
					/*filtroCorpo();*/ // Le sedi non sono legate agli esami
					
					avanti(1);
	
					removeClass(prima,'divVisibile');
					addClass(prima,'divVisibileScelto');
				} catch(e) {
					//alert(e.message);
				}
			};
			
			//ONCLICK  elencoEsami
			document.getElementById("elencoEsami").onclick=function(){
				try {
					$("select[name=elencoEsami]").val($("select[name=elencoEsami] option:selected").val());
					scegli(document.getElementById('elencoEsami'),document.getElementById('txtRiepilogoEsame'),document.getElementById('hRiepilogoEsame')); 
					
					filtroCorpo();
					if (document.getElementById('elencoEsami').length!=0) {
						avanti(2);
						removeClass(seconda,'divVisibile1');
						addClass(seconda,'divVisibileScelto1');
					}
				} catch(e) {
					//alert(e.message);
				}
			};
			
			//ONDBLCLICK  elencoEsami
			document.getElementById("elencoCorpo").ondblclick=function(){
				selezionaEsame();
			};
			
			//ONCLICK  elencoCorpo
			document.getElementById("elencoCorpo").onclick=function(){
				try {
					scegli(document.getElementById('elencoCorpo'),document.getElementById('txtRiepilogoCorpo'), document.getElementById('hRiepilogoCorpo'));
					controllaPresEsame();
				} catch(e) {
					//alert(e.message);
				}
			};
					
			//ONKEYUP  txtRicercaEsami
			var callback_ricerca_esami = function(e) {
				var whereCond = "UPPER(DESCR) like '%" + document.dati.txtRicercaEsami.value.toUpperCase() + "%'";
				if (!$('#chkRicercaEsami').is(':checked')) {
					//whereCond += ' AND (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')';
					if (document.dati.txtRicercaEsami.value.length < 3 )
						return;
				}
				_filtro_list_esami.searchListRefresh(whereCond, "RICERCA_ESAMI");
			};
			jQuery("#chkRicercaEsami").click(callback_ricerca_esami);
			jQuery("#txtRicercaEsami").keyup(callback_ricerca_esami);
			
			//ONKEYUP  txtRicercaCorpo
			var callback_ricerca_corpo = function(e) {
				if (document.dati.txtRicercaCorpo.value.length < 3) {
					if (e.keyCode == 13) alert('Il campo ricerca deve contenere almeno 3 caratteri.');
					return;
				}
				var whereCond = "UPPER(DESCR) like '%" + document.dati.txtRicercaCorpo.value.toUpperCase() + "%'";
				_filtro_list_corpo.searchListRefresh(whereCond, "RICERCA_CORPO");
			};
			jQuery("#txtRicercaCorpo").keyup(callback_ricerca_corpo);
			
			//ONLOAD  body
			TABELLA.caricaPrestazioni();
			filtroEsami(); 
			
		break;
			
		// LETTURA ////////////////////////////////
		case 'L':
			
		break;
	}
});

function caricamento(){
	
	//do la classe al div del riepilogo
	addClass(document.getElementById('divRiepilogoEsame'),'groupRiepilogoEsame'); 
	//alert(document.getElementById('divRiepilogoRichiesta'));
	addClass(document.getElementById('divRiepilogoRichiesta'),'groupRiepilogoRichiesta');
	document.getElementById('divRiepilogoEsame').style.display='none';
	//$('#lblCancella').parent().parent().hide();
	$('#lblCancellaSel').parent().parent().hide();
	$("select[name=elencoRiepilogo]").parent().hide();
	$("#lblRiepilogo").hide();
	$('#txtRicercaEsami').parent().append('<input style="display:none" type="checkbox" title="Seleziona tutte le prestazioni" id="chkRicercaEsami" name="chkRicercaEsami"/><label style="display:none" class="chkRicercaEsami" for="chkRicercaEsami">Tutte le prestazioni</label>');

	TABELLA.alterTable('APPEND');
	
	//do le classi ai div di scelta 
	addClass(prima,'divVisibile');		//1°
	addClass(seconda,'divVisibile1');	//2°
	addClass(terza,'divVisibile2');		//3°
	
	// Visualizza i materiali
	avanti(0);
}


//function associata al pulsante annulla
function annullaRichiesta(){

	if (confirm('Attenzione! \nLe scelte effettuate non saranno salvate. \nProseguire?')){	
		self.close();
	}
}


//funzione che rende display block i div delle scelte a seconda dell'ordine delle variabili dichiarate ad inizio javascript (a seconda dello z-index nei css)
function avanti(pos){
	pos = typeof pos === 'number' ? pos : 0;
	
	switch(pos) {
	case 0:
		$('#divRiepilogoEsame').hide();
		removeClass(document.getElementById('divRiepilogoRichiesta'),'opacity');
		//$('#groupRiepilogoEsame').hide(); 	
		$('#lblTitleRiepEsame').css("border","5px solid white").css("margin","30px"); 
	
		// Salta direttamente alle prestazioni
		prima.style.display='none';
		seconda.style.display='block';
		$("#txtRicercaEsami").focus();
		break;
	
	case 1:
		$('#divRiepilogoEsame').show();
		addClass(document.getElementById('divRiepilogoRichiesta'),'opacity');
		
		seconda.style.display='block';
		// $('#divElencoMateriali').show(200);
		//addClass(prima,'opacity');
		break;
	
	case 2:
		$('#divRiepilogoEsame').show(300);
		$('#groupRiepilogoEsame').hide(300); 	
		$('#lblTitleRiepEsame').css("border","5px solid white").css("margin","30px"); 
		addClass(document.getElementById('divRiepilogoRichiesta'),'opacity'); 
		//document.getElementById('txtNote').focus();	
		
		terza.style.display='block';
		document.getElementById('txtRicercaCorpo').focus();
		// $('#divElencoCorpo').show(200);
		//addClass(seconda,'opacity');	
		break;
	
	case 3:	
 		break;
 		
 	default:
	} 
}


//function associata al pulsante cancella
function cancellaEsame(obj, obj2, obj3, obj4){
	if (obj) obj.value='';
	if (obj2) obj2.value='';
	if (obj3) obj3.value='';
	if (obj4) obj4.value='';
	seconda.style.display='block';
	terza.style.display='none';
	$('#divRiepilogoRichiesta').removeClass('opacity');	
	$('#divElencoEsami').removeClass('divVisibileScelto1');
	$('#divElencoEsami').addClass('divVisibile1');
	
	if (document.dati.elencoMateriali.value=='') {
		avanti(0);
	}
	
	_filtro_list_esami.searchListRefresh();	
}


function controllaPresEsame(){

	var esameConfronto='';
	//var esame='';
	var elenco=document.getElementById('elencoRiepilogo').options;
	var hEsame=document.getElementById('hRiepilogoEsame').value;
	var hMateriale=document.getElementById('hRiepilogoMateriale').value;
	var hCorpo=document.getElementById('hRiepilogoCorpo').value;
	var ok='0';
	
	esameConfronto=hEsame+'@'+hMateriale+'@'+hCorpo;
	
	// alert('esame da confrontare: '+esameConfronto);
	
	for(var i=0;i<elenco.length;i++){
		
		var comboEsa=elenco[i].value.split('@');
		var esa=comboEsa[0]+'@'+comboEsa[1]+'@'+comboEsa[2];
		
		//alert(''esame dell'elenco riepilogo: '+esa);
		
		if (esa == esameConfronto){
		
			if (!confirm('Combinazione ESAME-MATERIALE-SEDE CORPO già presente!\nContinuare?')){
			
				//riporto la situazione a quella iniziale
				
				seconda.style.display='none';
				terza.style.display='none';
				$('#divRiepilogoEsame').hide(300);
				$('#divRiepilogoRichiesta').removeClass('opacity');
				$('#divElencoEsami').removeClass('divVisibileScelto');
				$('#divElencoEsami').addClass('divVisibile');
				
				_filtro_list_esami.searchListRefresh();
				ok='1';
			}
			break;
		}	
	}
	
	if (ok=='0'){
		
		$('#divRiepilogoEsame').show(300); 
		addClass(document.getElementById('divRiepilogoRichiesta'),'opacity'); 	
		//document.getElementById('txtNote').focus(); 	
	}
}


//funzione che rende display none i div delle scelte a seconda dell'ordine delle variabili dichiarate ad inizio javascript (a seconda dello z-index nei css)
function indietro(pos){
	
	if (pos==1){
	
	} 
	
	if (pos==2){

		seconda.style.display='none';
		// $('#divElencoMateriali').hide(200);
	}
	
 	if (pos==3){

		terza.style.display='none';
		// $('#divElencoCorpo').hide(200);
	} 

}


//carica le parti del corpo del listbox
function filtroCorpo(){
	document.getElementById('txtRiepilogoCorpo').value='';
	document.getElementById('hRiepilogoCorpo').value='';
	
	if (_filtro_list_corpo) return;
	_filtro_list_corpo = new FILTRO_QUERY('elencoCorpo', null);
	_filtro_list_corpo.setEnableWait('S');
	_filtro_list_corpo.setDistinctQuery('S');
	_filtro_list_corpo.setValueFieldQuery('COD_ART');
	_filtro_list_corpo.setDescrFieldQuery('DESCR');
	_filtro_list_corpo.setFromFieldQuery('RADSQL.MG_ART ART');
	_filtro_list_corpo.setWhereBaseQuery('ART.TIPO=\'A\' AND ROWNUM < 201');
	_filtro_list_corpo.setOrderQuery('DESCR ASC');
	if (document.dati.txtRicercaCorpo.value.length > 2)
		_filtro_list_corpo.searchListRefresh();
}

//carica gli esami del listbox
function filtroEsami(){
	document.getElementById('hRiepilogoEsame').value='';
	document.getElementById('hRiepilogoCorpo').value='';

	if(_filtro_list_esami) return;
	
	var whereCond = ' ATTIVO = \'S\' AND BRANCA = \'A\' AND TIPO = \'R\' AND REPARTO_DESTINAZIONE = \'ANATOMIA_PATOLOGICA\'';
	
	_filtro_list_esami = new FILTRO_QUERY('elencoEsami', null);
	_filtro_list_esami.setEnableWait('S');
	_filtro_list_esami.setDistinctQuery('S');
	_filtro_list_esami.setValueFieldQuery('IDEN');
	_filtro_list_esami.setDescrFieldQuery('DESCR');
	_filtro_list_esami.setFromFieldQuery('RADSQL.VIEW_TAB_ESA_REPARTO');
	_filtro_list_esami.setWhereBaseQuery(whereCond);
	_filtro_list_esami.setOrderQuery('DESCR ASC');
	
	var whereCond2 = '';
	if (!$('#chkRicercaEsami').is(':checked')) {
		//whereCond2 = ' (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')';
		if (document.dati.txtRicercaEsami.value.length < 3 )
			return;
	}
	_filtro_list_esami.searchListRefresh(whereCond2, 'RICERCA_ESAMI');
}

//carica i materiali del listbox
function filtroMateriali(){
}


//function che prepara i dati all'interno della pagina per essere trasportati nella pagina di richiesta
function preSalvataggio(){

	//alert("preSalvataggio");
	var skip = false;
	var exists = {"unique": true, "duplicates": []};
	
	var myListBox= document.createElement('select');
	var arrayAnalisi='';
	var arrayMateriali='';
	var arrayCorpo='';
	var arrayNote='';
	var arrayMetodiche='';
	
	myListBox.id='cmbPrestRich_L';
	myListBox.name='cmbPrestRich_L';
	myListBox.style.width = '100%';
	myListBox.setAttribute('STATO_CAMPO','E');
	myListBox.setAttribute('multiple','multiple');

	//per sicurezza lo svuoto
	svuotaListBox(myListBox);
		
	/*var lst=document.getElementById("elencoRiepilogo");*/
	//var idEsami='';
	var optArray = new Array ();
	var error = "";
	
	jQuery(".trAnalisi").each(function(){
		if (skip) return;
		if (error != "") {return;}
		var analisi=jQuery(this).find("label.analisi").val();
		var textAnalisi=jQuery(this).find("label.analisi").text();
		var materiali='';
		var textMat=jQuery(this).find("textarea.materiale").text().replace(/^\s+|\s+$/,'').toUpperCase();
		var txtSedeCorpo=jQuery(this).find("label.sedeCorpo").text();
		var sedeCorpo=jQuery(this).find("label.sedeCorpo").val();
		var note=jQuery(this).find("textarea.note").text().toUpperCase();
		
		/******** DEBUG ********************************************/
		var debug = "DEBUG di preSalvataggio:\n";
		debug += "analisi: "+analisi;
		debug += "\ntextAnalisi: "+textAnalisi;
		debug += "\nmateriali: "+materiali;
		debug += "\ntextMat: "+textMat;
		debug += "\nsedeCorpo: "+sedeCorpo;
		debug += "\ntxtSedeCorpo: "+txtSedeCorpo;
		debug += "\nnote: "+note;
		//FIXME
		if (sedeCorpo > SEDI.MAX || sedeCorpo < SEDI.MIN || analisi > ESAMI.MAX || analisi < ESAMI.MIN) { error = "Attenzione: un esame contiene informazioni non corrette.\n\n["+debug+'\n]'; return; }
		/******** DEBUG ********************************************/
		
		if (note == '') {
			alert('Specificare il campo N. Campioni negli spazi mancanti.');
			skip = true;
			return;
		}
		
		if (textMat == '') {
			alert('Specificare il campo Materiale negli spazi mancanti.');
			skip = true;
			return;
		}
		
		var text	=	textAnalisi	+ '  -  ' + txtSedeCorpo;
		var value	=	analisi + '@' + textMat + '@' + sedeCorpo + '@';
		
		//text+='  - *****Note Esame: '+note+' *****';
		text+='  - N. Campioni: '+note;
		
		if (typeof exists[value] === "boolean") {
			exists[value] = true;
			exists.unique = false;
			exists.duplicates.push(textAnalisi	+ '  -  ' + txtSedeCorpo + ' - ' + textMat);
		} else {
			exists[value] = false;
		}
		
		value+=note;
		
		text += (textMat == '' ? '' : '  -  '	+ textMat);
		optArray.push(new Option(text, value));
		
		if(arrayAnalisi != ''){
			arrayAnalisi+= '#';
			arrayMateriali+= '#';
			arrayCorpo+= '#';
			arrayNote+= '#';
			arrayMetodiche+= '#';
		}		
	
		arrayAnalisi	+= analisi;
		arrayMateriali	+= materiali;
		arrayCorpo		+= sedeCorpo;
		arrayNote		+= note;
		arrayMetodiche	+='A';
		
	});

	if (skip) return;

	if (!exists.unique && !confirm("Questa richiesta contiene prestazioni duplicate. Continuare?\n\n" + exists.duplicates.join("\n"))) {
		return;
	}
	
	if (error != "") { return alert(error); }
	
	//aggiungo le options al listbox che ho creato
	for(var i=0; i<optArray.length; i++) {
		myListBox.options[myListBox.options.length] = new Option(optArray[i].text, optArray[i].value);
	}
	
	//da decommentare dopo l'inserimento all'interno della scheda di richiesta
	opener.document.getElementById('HelencoEsami').value=arrayAnalisi;
	opener.document.getElementById('Hmateriali').value=arrayMateriali;
	opener.document.getElementById('HelencoCorpo').value=arrayCorpo;
	opener.document.getElementById('Hnote').value=arrayNote;
	opener.document.getElementById('HelencoMetodiche').value=arrayMetodiche;
	
	var innerListBox = opener.document.getElementById('cmbPrestRich_L');
	svuotaListBox(innerListBox);
	jQuery(innerListBox).append(myListBox.options.innerHTML);
	
	/******** DEBUG ********************************************/
	var debug2 = "DEBUG degli array di preSalvataggio()\n\n";
	debug2 += "analisi: "+arrayAnalisi;
	debug2 += "\nmateriali: "+arrayMateriali;
	debug2 += "\nsedeCorpo: "+arrayCorpo;
	debug2 += "\nnote: "+arrayNote;
	
	//alert(debug2);
	/******** DEBUG ********************************************/
	
	self.close();
}

function scegli(obj,target, Htarget){

	target.value=obj.options[obj.selectedIndex].text;
	Htarget.value=obj.options[obj.selectedIndex].value;
	//parent.document.getElementById('hTipo').value=obj.options[obj.selectedIndex].value;

}

function scegliEsamiProfilo(val){
	
	var reparto=document.EXTERN.REPARTO.value;
	
	var sql="select TG.IDEN_ESA , "+
			"te.descr DESCR_ESA, "+
			"null IDEN_MAT, "+
			"null DESCR_MAT, "+
			"MG.COD_ART, "+
			"MG.DESCR DESCR_SEDE, "+
			"TG.NOTE "+ 
			"from RADSQL.TAB_ESA TE "+
			"join RADSQL.TAB_ESA_GRUPPI TG on (TE.IDEN=TG.IDEN_ESA) "+
			"left outer join RADSQL.MG_ART MG on (MG.IDEN=TG.IDEN_SEDE) "+
			"where tg.cod_gruppo='"+val+"' " +
			"AND REPARTO='"+reparto+"'"; 
			
	//alert('sql: '+sql);

	dwr.engine.setAsync(false);		
	toolKitDB.getListResultData(sql, TABELLA.creaOptEsami);		
	dwr.engine.setAsync(true);
}

//funzione associata al pulsante seleziona, che popola il listbox degli esami in maniera corretta
function selezionaEsame(){
	var esameSelezionati=jQuery('select[name=elencoEsami]').find(':selected');
	var sediSelezionate= jQuery('select[name=elencoCorpo]').find(':selected');

	if (!esameSelezionati.length) {
		alert('Scegliere una prestazione dall\'elenco.');
		return;
	}
	if (!sediSelezionate.length) {
		alert('Scegliere una sede dall\'elenco.');
		return;
	}
	
	for (var i=0; i<esameSelezionati.length; i++) {
		var esame = esameSelezionati[i].innerText;//document.getElementById('txtRiepilogoEsame').value;
		var hEsame= esameSelezionati[i].value;//document.getElementById('hRiepilogoEsame').value;
		var materiale=document.getElementById('txtRiepilogoMateriale').value;
		var hMateriale=document.getElementById('hRiepilogoMateriale').value;
		var combo = document.getElementById('elencoCorpo');
		
		for(var i=0;i<combo.options.length;i++){
		
			if(combo.options[i].selected==true){
				p_note=TABELLA.controllaNote(hMateriale, combo.options[i].value);
				//alert('p_note'+p_note);
				TABELLA.aggiungiRiga(numeroRiga, materiale , hMateriale,  esame, hEsame, p_note, combo.options[i].text, combo.options[i].value);
			}
		}
	}
	
	//riporto la situazione a quella iniziale
	seconda.style.display='none';
	terza.style.display='none';
	$('#divRiepilogoEsame').hide(300);
	$('#divRiepilogoRichiesta').removeClass('opacity');
	$('#divElencoEsami').removeClass('divVisibileScelto1');
	$('#divElencoEsami').addClass('divVisibile1');

	if (document.dati.elencoMateriali.value=='') {
		avanti(0);
	}
	
	jQuery("#tr_"+(numeroRiga-1).toString()).find("textarea.note").focus();
	_filtro_list_esami.searchListRefresh();	
}

var TABELLA = {

	//aggiungo la tabella
	alterTable:function(istruzione){
		
		var table = "<table id='tableRiepilogo' width=100% >";
		table +="<tr id='primariga' height:10 px >";
		table += "<td STATO_CAMPO='E' class='classTdLabel aggiungi' style='width:"+ larghezza1 +"'>" +
					"<label title='' name='lbl' id='lbl'>&nbsp;</label>" +
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel TDanalisi' style='width:"+ larghezza3 +"'>" +
					"<label name='lblAnalisi' id='lblAnalisi'>PRESTAZIONE</label>" +
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel TDmateriale'  style='width:"+ larghezza2 +"'>" +
				"<label name='lblMateriale' id='lblMateriale'>SEDE</label>" +
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel TDnote'  style='width:"+ larghezza4 +"'>" +
					"<label name='lblNoteTestata' id='lblNoteTestata'>N. CAMPIONI</label>" +
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel TDsede'  style='width:"+ larghezza5 +"'>" +
					"<label name='lblSede' id='lblSede'>MATERIALE</label>" +
				"</td>";
		table += "</tr></table>";
		

		switch(istruzione){
		
			case 'CLEAR':
				//alert('case CLEAR');
				jQuery("#tableRiepilogo").remove();
				jQuery("#groupRiepilogo").append(table);
				
				break;
				
			case 'APPEND':
				//alert('case APPEND');
			default:
				
				jQuery("#groupRiepilogo").append(table);
				break;		
		}

	},
	
	/**
	 * Aggiunge una riga per l'esame scelto
	 * 
	 * @param note        n° campioni
	 */
	aggiungiRiga:function(indice, materiale, iden_materiale, esame, iden_esame, note, sede, iden_sede){
		
		note=note?note:'';
		materiale=materiale?materiale:'';
		iden_materiale=iden_materiale?iden_materiale:'';		
		sede=sede?sede:'';
		iden_sede=iden_sede?iden_sede:'';
		
		/******** DEBUG ********************************************/
		var debug = 'DEBUG DI aggiungiRiga()\n\n';
		debug += 'INDICE: '+indice;
		debug += '\nSEDE: '+sede;
		debug += '\nSEDE iden: '+iden_sede;
		debug += '\nESAME: '+esame;
		debug += '\nESAME iden: '+iden_esame;
		debug += '\nNOTE: '+note;
		
		//alert(debug);
		/******** DEBUG ********************************************/
		
		var rowspan = ' rowSpan = 2 ';
		var style1 = " style='background: white; BORDER-BOTTOM:2px solid #BDBDBD; width: ";
		
		var riga = "<tr class='trAnalisi' id='tr_"+indice+"' valore="+esame+" >";
		//alert("v_disabled="+v_disabled);
		//alert("v_max_val="+v_max_val);
		riga += "<td STATO_CAMPO='E' class='classTdLabel butt_elimina tabella' 	"+rowspan + style1 + larghezza1 + "'><label class='butt_elimina' title='Elimina' name='lblElimina"+indice+"' id='lblElimina"+indice+"'> X </label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel analisi tabella'  		"+rowspan + style1 + larghezza2 + "'><label class='analisi'id='txtAnalisi"+indice+"' STATO_CAMPO='E' value='"+iden_esame+"' name='txtQuantita"+indice+"' >"+esame+"</label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel sedeCorpo tabella'	 	"+rowspan + style1 + larghezza3 + "'><label class='sedeCorpo' id='txtSedeCorpo"+indice+"' STATO_CAMPO='E' name='txtSedeCorpo"+indice+"' value="+iden_sede+">"+sede+"</label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel note tabella'  		"+rowspan + style1 + larghezza4 + "'><textarea rows='2' style='width:100%' class='note' id='txtNote"+indice+"' STATO_CAMPO='E' name='txtNote"+indice+"' indice='"+indice+"'>"+note+"</textarea></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel materiale tabella'	 	"+rowspan + style1 + larghezza5 + "'><textarea rows='2' style='width:100%' class='materiale' id='txtMateriale"+indice+"' STATO_CAMPO='E' name='txtMateriale"+indice+"' indice='"+indice+"'>"+materiale+"</textarea></td>";
		riga += "</tr><tr id='tr_"+indice+"' valore="+esame+" ></tr>";
		
		//alert(riga);
		
		jQuery("#tableRiepilogo").append(riga);
		
		jQuery("#txtNote"+indice).blur(function(){
			
			id=jQuery(this).attr("indice");
						
			idMat=jQuery("#tr_"+id).find("label.materiale").val();
			idSede=jQuery("#tr_"+id).find("textarea.sedeCorpo").val();
			thisNota=jQuery("#tr_"+id).find("textarea.note").text();
			
			TABELLA.riportaNote(idMat,idSede,thisNota);
		});
		
		jQuery("#txtNote"+indice+", #txtMateriale"+indice).keypress(function(e){
			if (jQuery.inArray(e.keyCode, charsNotAllowed) > -1) {
				e.preventDefault();
				return false;
			}
		});
		
		jQuery("#lblElimina"+indice).click(function(){
			 TABELLA.eliminaRiga(indice);
		});
		
		numeroRiga++;
	},
	
	//funzione che serve per prendere i dati delle prestazioni dalla pagina di testata e riportarli nella pagina di scelta esami
	caricaPrestazioni:function(){

		var innerListBox = opener.document.getElementById('cmbPrestRich_L').options;
		
		for (var i=0;i<innerListBox.length;i++){
			var testo = innerListBox[i].text.split("-");
			var value = innerListBox[i].value.split("@");

			var esame 			= '';
			var iden_esame		= '';
			var note			= '';
			var materiale 		= '';
			var iden_materiale	= '';
			var sede			= '';
			var iden_sede		= '';
			
			esame 			= $.trim(testo[0]);
			iden_esame		= value[0];
			materiale 		= $.trim(testo[3]);
			iden_materiale	= value[1];
			sede			= $.trim(testo[1]);
			iden_sede		= value[2];
			note			= value[3];
			
			/******** DEBUG ********************************************/
			var debug = 'DEBUG DI caricaPrestazioni()\n\n';
			debug += 'INDICE: '			+numeroRiga;
			debug += '\nOPT VALUE: '	+innerListBox[i].text;
			debug += '\nOPT TEXT: '		+innerListBox[i].value;
			debug += '\nMATERIALE: '	+materiale;
			debug += '\nMATERIALE iden: '+iden_materiale;
			debug += '\nESAME: '		+esame;
			debug += '\nESAME iden: '	+iden_esame;
			debug += '\nSEDE: '			+sede;
			debug += '\nSEDE iden: '	+iden_sede;
			debug += '\nNOTE: '			+note;
			
			//alert(debug);
			/******** DEBUG ********************************************/
					
			TABELLA.aggiungiRiga(numeroRiga, materiale, iden_materiale, esame, iden_esame, note, sede, iden_sede);
		}
	},
	
	//function che prepara i dati per l'inserimentio  del profilo
	creaOptEsami:function(resp){
		
		/*
		 resp[i][0] = iden_esa
		 resp[i][1] = descrizione esame
		 resp[i][2] = iden_materiale
		 resp[i][3] = descrizione del materiale
		 resp[i][4] = iden sede del corpo
		 resp[i][5] = descrizione della sede del corpo
		 resp[i][6] = note di tab_esa_gruppi
		 */

		for (var i=0;i<resp.length;i++){
			
			var iden_esa = resp[i][0];
			var descr_esa = resp[i][1];
			var iden_mat = resp[i][2];
			var descr_mat = resp[i][3];
			var iden_sede = resp[i][4];
			var descr_sede = resp[i][5];
			var note = resp[i][6];
			
			/******** DEBUG ********************************************/
			var debug = 'DEBUG DI creaOptEsami()\n\n';
			debug += 'INDICE: '+numeroRiga;
			debug += '\nESAME iden: '+iden_esa;
			debug += '\nESAME: '+descr_esa;
			debug += '\nMATERIALE iden: '+iden_mat;
			debug += '\nMATERIALE: '+descr_mat;
			debug += '\nSEDE iden: '+iden_sede;
			debug += '\nSEDE: '+descr_sede;
			debug += '\nNOTE: '+note;
			
			//alert(debug);
			/******** DEBUG ********************************************/
			
			//creo la riga nel riepilogo
			//TABELLA.aggiungiRiga(numeroRiga, descr_esa, iden_esa, note, descr_mat, iden_mat, descr_sede, iden_sede);
			TABELLA.aggiungiRiga(numeroRiga, descr_mat, iden_mat, descr_esa, iden_esa, note, descr_sede, iden_sede);
		}

		//riporto la situazione a quella iniziale
		seconda.style.display='none';
		terza.style.display='none';
		$('#divRiepilogoEsame').hide(300);
		$('#divRiepilogoRichiesta').removeClass('opacity');
		$('#divElencoEsami').removeClass('divVisibileScelto1');
		$('#divElencoEsami').addClass('divVisibile1');

		if (document.dati.elencoMateriali.value=='') {
			avanti(0);
		}
		
		jQuery("#tr_"+(numeroRiga-1).toString()).find("textarea.note").focus();
		_filtro_list_esami.searchListRefresh();
	},
	
	//funzione che serve ad eliminare la riga dell'analisi dalla tabella
	eliminaRiga:function(indice){
		
		//alert('indice: '+indice);
		jQuery("#tr_"+indice).remove();
		jQuery("#tr_"+indice).remove();
	},
	
	riportaNote:function(idenMateriale, idenSede, testoNota){
	},
	
	/**
	 * 
	 * 
	 * @param idenMateriale
	 * @param idenSede
	 * @returns {String}
	 */
	controllaNote:function(idenMateriale, idenSede){
	
		var returnNota='';
		
		jQuery(".trAnalisi").each(function(){
			
			var materiale=jQuery(this).find("label.materiale").val();
			var sedeCorpo=jQuery(this).find("label.sedeCorpo").val();
			var note=jQuery(this).find("textarea.note").text();
			var note1=jQuery(this).find("textarea.note").val();
			
			/******** DEBUG ********************************************/
			var debug = 'DEBUG DI controllaNote()\n\n';
			debug += '\nMATERIALE iden: '+idenMateriale;
			debug += '\nMATERIALE confronto: '+materiale;
			debug += '\nSEDE iden: '+idenSede;
			debug += '\nSEDE confronto: '+sedeCorpo;
			debug += '\nNOTE: '+note + note1;
			
			
			//alert(debug);
			/******** DEBUG ********************************************/
			
			if(idenMateriale == materiale && idenSede == sedeCorpo){
				returnNota=note;
				return false;
			}else{
				returnNota= '';
			}
			
			
		});
		
		return returnNota;
	}
	
};