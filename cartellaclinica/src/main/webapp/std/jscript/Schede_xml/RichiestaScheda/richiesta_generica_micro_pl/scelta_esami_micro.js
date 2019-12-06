//variabili per le funzioni di filtroQuery
var PAGINA = 'MICROBIOLOGIA_PIETRA_LIGURE';
var _filtro_list_esami='';
var _filtro_list_materiali='';
var _filtro_list_corpo='';
var numeroRiga = 0;
var tipoChiamata='DEFAULT';

/* css - inserisco qui le larghezze in modo da gestire le larghezze in un punto solo*/
larghezza1= " 3%; ";
larghezza2= " 23%; ";
larghezza3= " 23%; ";
larghezza4= " 23%; ";
larghezza5= " 28%; ";

//stabilisco un ordine per le pagine e setto delle variabili per comodità
var prima=document.getElementById('divElencoMateriali');
var seconda=document.getElementById('divElencoEsami');
var terza=document.getElementById('divElencoCorpo');

var MATERIALI = {};
var ESAMI     = {};

jQuery(document).ready(function(){
	//FIXME
	dwr.engine.setAsync(false);		
	toolKitDB.getListResultData(
		"select min(art.iden) min, max(art.iden) max from radsql.MG_ART ART, radsql.COD_EST_TABELLA CET where origine='"+PAGINA+"' and CET.CODICE=ART.IDEN AND CET.TABELLA='TAB_ESA' " +
		"union all " +
		"select min(te.iden) min, max(te.iden) max from radsql.TAB_ESA TE, radsql.COD_EST_TABELLA CET where origine='"+PAGINA+"' and CET.IDEN_TABELLA=TE.IDEN and tabella='TAB_ESA' and te.attivo = 'S'",
		function(rs) {
			if (rs.length == 2) {
				MATERIALI = {"MIN": Number(rs[0][0]), "MAX": Number(rs[0][1])};
				ESAMI     = {"MIN": Number(rs[1][0]), "MAX": Number(rs[1][1])};
			}
		}
	);
	dwr.engine.setAsync(true);
	
	caricamento();
	
	
	switch (_STATO_PAGINA){

		// 	INSERIMENTO ////////////////////////////////
		case 'I':
		
			//ONCLICK  elencoEsami
			document.getElementById("elencoEsami").onclick=function(){
				try {	
					scegli(document.getElementById('elencoEsami'),document.getElementById('txtRiepilogoEsame'),document.getElementById('hRiepilogoEsame')); 
					filtroCorpo();
					if (document.getElementById('elencoCorpo').length!=0) {
						avanti(2);
					}
				} catch(e) {
					//alert(e.message);
				}
			};
			
			//ONCLICK  elencoMateriali
			document.getElementById("elencoMateriali").onclick=function(){
				try {
					scegli(document.getElementById('elencoMateriali'),document.getElementById('txtRiepilogoMateriale'),document.getElementById('hRiepilogoMateriale')); 
					filtroEsami();
					filtroCorpo();
					if (document.getElementById('elencoEsami').length!=0) {
						avanti(1);
					}

					removeClass(prima,'divVisibile');
					addClass(prima,'divVisibileScelto');
				} catch(e) {
					//alert(e.message);
				}
			};
			
			//ONCLICK  elencoCorpo
			document.getElementById("elencoCorpo").onclick=function(){ 
				try {
					scegli(document.getElementById('elencoCorpo'),document.getElementById('txtRiepilogoCorpo'), document.getElementById('hRiepilogoCorpo'));
					addClass(document.getElementById('lblRiepilogoEsame'),'border'); 
					controllaPresEsame();
				} catch(e) {
					//alert(e.message);
				}
			};
			
			//ONKEYUP  txtRicercaEsami
			jQuery("#txtRicercaEsami").keyup(function(){ _filtro_list_esami.searchListRefresh("DESCR like '%" + document.dati.txtRicercaEsami.value.toUpperCase() + "%'", "RICERCA_ESAMI"); });
			
			//ONKEYUP  txtRicercaEsami
			jQuery("#txtRicercaMateriali").keyup(function(){ _filtro_list_materiali.searchListRefresh("DESCR like '%" + document.dati.txtRicercaMateriali.value.toUpperCase() + "%'", "RICERCA_MATERIALI"); });
			
			//ONKEYUP  txtRicercaEsami
			jQuery("#txtRicercaCorpo").keyup(function(){ _filtro_list_corpo.searchListRefresh("DESCRIZIONE like '%" + document.dati.txtRicercaCorpo.value.toUpperCase() + "%'", "RICERCA_CORPO"); });
			
			//ONLOAD  body
			TABELLA.caricaAnalisi();
			filtroMateriali(); 
			
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
	$("#lblCancellaSel").parent().hide();
	$("select[name=elencoRiepilogo]").parent().hide();
	$("#lblRiepilogo").hide();

	TABELLA.alterTable('APPEND');
	
	//do le classi ai div di scelta 
	addClass(prima,'divVisibile');		//1°
	addClass(seconda,'divVisibile1');	//2°
	addClass(terza,'divVisibile2');		//3°
}


//function associata al pulsante annulla
function annullaRichiesta(){

	if (confirm('Attenzione! \nLe scelte effettuate non saranno salvate. \nProseguire?')){	
		self.close();
	}
}


//funzione che rende dislay block i div delle scelte a seconda dell'ordine delle variabili dichiarate ad inizio javascript (a seconda dello z-index nei css)
function avanti(pos){

	if (pos==1){
		
		seconda.style.display='block';
		// $('#divElencoMateriali').show(200);
		//addClass(prima,'opacity');	
		return;
	}
	
	if (pos==2){
		
		terza.style.display='block';
		// $('#divElencoCorpo').show(200);
		//addClass(seconda,'opacity');	
		return;
	}
	
 	if (pos==3){	
	
	} 
}


//function associata al pulsante cancella
function cancellaEsame(){

	for (var i=0, length=arguments.length; i<length; i++) {
		try { arguments[i].value = ''; } catch(e) {}
	}
	seconda.style.display='none';
	terza.style.display='none';
	removeClass(document.getElementById('lblRiepilogoEsame'),'border');
	$('#divRiepilogoEsame').hide(300);
	$('#divRiepilogoRichiesta').removeClass('opacity'); //rende opaco il box di riepilogo
}


function controllaPresEsame(){

	var esameConfronto='';
	var esame='';
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


//carica  le aprti del corpo del listobox
function filtroCorpo(){

	var obj=document.getElementById('elencoMateriali');
	var whereCond=obj.options[obj.selectedIndex].value;
	document.getElementById('hRiepilogoCorpo').value='';

	//alert('select cet.iden_tabella, COR.DESCRIZIONE from RADSQL.LABO_SEDI_CORPO COR, RADSQL.COD_EST_TABELLA CET where ORIGINE=\''+PAGINA+'\' AND CET.CODICE=COR.IDEN AND CET.TABELLA = \'MG_ART\' AND CET.IDEN_TABELLA=\''+whereCond+'\' order by DESCRIZIONE ASC');
	_filtro_list_corpo = new FILTRO_QUERY('elencoCorpo', null);
	_filtro_list_corpo.setEnableWait('N');
	_filtro_list_corpo.setValueFieldQuery('CET.CODICE');
	_filtro_list_corpo.setDescrFieldQuery('COR.DESCRIZIONE');
	_filtro_list_corpo.setFromFieldQuery('RADSQL.LABO_SEDI_CORPO COR, RADSQL.COD_EST_TABELLA CET');
	_filtro_list_corpo.setWhereBaseQuery('ORIGINE=\''+PAGINA+'\' AND CET.CODICE=COR.IDEN AND CET.TABELLA = \'MG_ART\' AND CET.IDEN_TABELLA=\''+whereCond+'\'');
	_filtro_list_corpo.setOrderQuery('DESCRIZIONE ASC');
	_filtro_list_corpo.searchListRefresh();

	document.getElementById('txtRiepilogoCorpo').value='';
	document.getElementById('hRiepilogoCorpo').value='';
	$('#divRiepilogoEsame').show(300);
	$('#groupRiepilogoEsame').hide(300); 	
	$('#lblTitleRiepEsame').css("border","5px solid white").css("margin","30px"); 
	addClass(document.getElementById('divRiepilogoRichiesta'),'opacity'); 
	//document.getElementById('txtNote').focus();	
}

//carica gli esami del listbox
function filtroEsami(){
	
	var obj=document.getElementById('elencoMateriali');
	
	var whereCond=obj.options[obj.selectedIndex].value;
	
	document.getElementById('hRiepilogoEsame').value='';
	document.getElementById('hRiepilogoCorpo').value='';

	var select = 'select iden_tabella from radsql.COD_EST_TABELLA  where tabella = \'TAB_ESA\' and origine = \''+PAGINA+'\' and codice	 = '+whereCond;
	//alert(select);
	_filtro_list_esami = new FILTRO_QUERY('elencoEsami', null);
	_filtro_list_esami.setEnableWait('N');
	_filtro_list_esami.setValueFieldQuery('IDEN');
	_filtro_list_esami.setDescrFieldQuery('DESCR');
	_filtro_list_esami.setFromFieldQuery('RADSQL.TAB_ESA TE');
	_filtro_list_esami.setWhereBaseQuery('TE.ATTIVO=\'S\' and IDEN IN ('+select+')');
	_filtro_list_esami.setOrderQuery('DESCR ASC');
	_filtro_list_esami.searchListRefresh();
	
}

//carica i materiali del listbox
function filtroMateriali(){
	
	//alert('select cet.iden_tabella, art.descr from RADSQL.MG_ART ART,RADSQL.COD_EST_TABELLA CET where ORIGINE=\''+PAGINA+'\' and CET.CODICE=ART.IDEN AND CET.TABELLA = \'TAB_ESA\'')
	_filtro_list_materiali = new FILTRO_QUERY('elencoMateriali', null);
	_filtro_list_materiali.setEnableWait('N');
	_filtro_list_materiali.setDistinctQuery('S');
	_filtro_list_materiali.setValueFieldQuery('CODICE');
	_filtro_list_materiali.setDescrFieldQuery('DESCR');
	_filtro_list_materiali.setFromFieldQuery('RADSQL.MG_ART ART,RADSQL.COD_EST_TABELLA CET');
	_filtro_list_materiali.setWhereBaseQuery('ORIGINE=\''+PAGINA+'\' and CET.CODICE=ART.IDEN AND CET.TABELLA = \'TAB_ESA\'');
	_filtro_list_materiali.setOrderQuery('DESCR ASC');
	_filtro_list_materiali.searchListRefresh();
	
	//nel caso si vedessero li nascondo
	$('#divElencoCorpo').hide(200);
	$('#divRiepilogoEsame').hide(200); 
	removeClass(document.getElementById('divRiepilogoRichiesta'),'opacity');

}

//function che prepara i dati all'interno della pagina per essere trasportati nella pagina di richiesta
function preSalvataggio(){

	//alert("preSalvataggio");
	
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
	var idEsami='';
	var optArray = new Array ();
	var error = "";
	
	jQuery(".trAnalisi").each(function(){
		if (error != "") {return;}
		var analisi=jQuery(this).find("label.analisi").val();
		var textAnalisi=jQuery(this).find("label.analisi").text();
		var materiali=jQuery(this).find("label.materiale").val();
		var textMat=jQuery(this).find("label.materiale").text();
		var sedeCorpo=jQuery(this).find("label.sedeCorpo").val();
		var txtSedeCorpo=jQuery(this).find("label.sedeCorpo").text();
		var note=jQuery(this).find("textarea.note").text();
		
		/******** DEBUG ********************************************/
		var debug = "DEBUG di preSalvataggio:\n";
		debug += "analisi: "+analisi;
		debug += "\ntextANALISI: "+textAnalisi;
		debug += "\nmateriali: "+materiali;
		debug += "\ntextMat: "+textMat;
		debug += "\nsedeCorpo: "+sedeCorpo;
		debug += "\ntxtSedeCorpo: "+txtSedeCorpo;
		debug += "\nnote: "+note;
		//FIXME
		if (materiali > MATERIALI.MAX || materiali < MATERIALI.MIN || analisi > ESAMI.MAX || analisi < ESAMI.MIN) { error = "Attenzione: un esame contiene informazioni non corrette.\n\n["+debug+'\n]'; return; }
		/******** DEBUG ********************************************/
		
		var text	=	textAnalisi	+	'  -  '	+textMat	+	'  -  '	+txtSedeCorpo+' ';
		var value	=	analisi		+	  '@'	+materiali	+	  '@'	+sedeCorpo   +'@';
		
		if (note!=''){ 
			text+='  - *****Note Esame: '+note+' *****';
			value+=note;		
		}else{
			value+='';	
		}
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
			"TG.IDEN_MATERIALE, "+
			"MG.DESCR DESCR_MAT, "+
			"TG.IDEN_SEDE, "+
			"LS.DESCRIZIONE DESCR_SEDE, "+
			"TG.NOTE "+ 
			"from RADSQL.TAB_ESA TE "+
			"join RADSQL.TAB_ESA_GRUPPI TG on (TE.IDEN=TG.IDEN_ESA) "+
			"left outer join RADSQL.MG_ART MG on (MG.IDEN=TG.IDEN_MATERIALE) "+
			"left outer join radsql.labo_sedi_corpo ls on (ls.iden=tg.iden_sede)"+
			"where tg.cod_gruppo='"+val+"' " +
			"AND REPARTO='"+reparto+"'"; 
			
	//alert('sql: '+sql);

	dwr.engine.setAsync(false);		
	toolKitDB.getListResultData(sql, TABELLA.creaOptEsami);		
	dwr.engine.setAsync(true);
}


//funzione associata al pulsante seleziona, che popola il listbox degli esami in maniera corretta
function selezionaEsame(){
	var materialiSelezionati= jQuery('select[name=elencoMateriali]').find(':selected');
	var esamiSelezionati=jQuery('select[name=elencoEsami]').find(':selected');

	if (!materialiSelezionati.length) {
		alert('Scegliere un materiale dall\'elenco.');
		return;
	}
	if (!esamiSelezionati.length) {
		alert('Scegliere un esame dall\'elenco.');
		return;
	}

	var esame=document.getElementById('txtRiepilogoEsame').value;
	var hEsame=document.getElementById('hRiepilogoEsame').value;
	var materiale=document.getElementById('txtRiepilogoMateriale').value;
	var hMateriale=document.getElementById('hRiepilogoMateriale').value;
	var combo= document.getElementById('elencoCorpo');
	var p_note='';
	var controllo=0;
	
	//se non trovo sedi del corpo
	if (combo.options.length < 1){
		
		TABELLA.aggiungiRiga(numeroRiga, materiale, hMateriale,  esame, hEsame);
		
	}else{
		
		for(var i=0;i<combo.options.length;i++){
		
			if(combo.options[i].selected==true){
				p_note=TABELLA.controllaNote(hMateriale, combo.options[i].value);
				//alert('p_note'+p_note);
				TABELLA.aggiungiRiga(numeroRiga, materiale , hMateriale,  esame, hEsame, p_note, combo.options[i].text, combo.options[i].value);
				controllo++;
			}
		}
		
		//se non si selezionano sedi del corpo anche se disponibili
		if(controllo==0){
			TABELLA.aggiungiRiga(numeroRiga, materiale, hMateriale,  esame, hEsame);
		}
	}
	
	//riporto la situazione a quella iniziale
	seconda.style.display='none';
	terza.style.display='none';
	$('#divRiepilogoEsame').hide(300);
	$('#divRiepilogoRichiesta').removeClass('opacity');
	$('#divElencoMateriali').removeClass('divVisibileScelto');
	$('#divElencoMateriali').addClass('divVisibile');
	
	_filtro_list_materiali.searchListRefresh();
	
	document.getElementById('divRiepilogoEsame').style.display='none';
	controllo=0;	
}





var TABELLA = {

	//aggiungo la tabella
	alterTable:function(istruzione){
		
		var table = "<table id='tableRiepilogo' width=100% >";
		table +="<tr id='primariga' height:10 px >";
		table += "<td STATO_CAMPO='E' class='classTdLabel aggiungi' style='width:"+ larghezza1 +"'>" +
					"<label title='' name='lbl' id='lbl'>&nbsp;</label>" +
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel TDmateriale'  style='width:"+ larghezza2 +"'>" +
					"<label name='lblMateriale' id='lblMateriale'>MATERIALE</label>" +
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel TDanalisi' style='width:"+ larghezza3 +"'>" +
					"<label name='lblAnalisi' id='lblAnalisi'>ANALISI</label>" +
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel TDsede'  style='width:"+ larghezza4 +"'>" +
					"<label name='lblSede' id='lblSede'>SEDE</label>" +
				"</td>";
		table += "<td STATO_CAMPO='E' class='classTdLabel TDnote'  style='width:"+ larghezza5 +"'>" +
					"<label name='lblNoteTestata' id='lblNoteTestata'>NOTE</label>" +
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
	
	//funzione richiamata per aggiungere la riga dell'esame
	aggiungiRiga:function(indice, materiale, iden_materiale, esame, iden_esame, note, sede, iden_sede){

		note=note?note:'';
		materiale=materiale?materiale:'';
		iden_materiale=iden_materiale?iden_materiale:'';		
		sede=sede?sede:'';
		iden_sede=iden_sede?iden_sede:'';
		
		/******** DEBUG ********************************************/
		var debug = 'DEBUG DI aggiungiRiga()\n\n';
		debug += 'INDICE: '+indice;
		debug += '\nMATERIALE: '+materiale;
		debug += '\nMATERIALE iden: '+iden_materiale;
		debug += '\nESAME: '+esame;
		debug += '\nESAME iden: '+iden_esame;
		debug += '\nSEDE: '+sede;
		debug += '\nSEDE iden: '+iden_sede;
		debug += '\nNOTE: '+note;
		
		//alert(debug);
		/******** DEBUG ********************************************/
		
		var rowspan = ' rowSpan = 2 ';
		var style1 = " style='background: white; BORDER-BOTTOM:2px solid #BDBDBD; width: ";
		
		var riga = "<tr class='trAnalisi' id='tr_"+indice+"' valore="+esame+" >";
		//alert("v_disabled="+v_disabled);
		//alert("v_max_val="+v_max_val);
		riga += "<td STATO_CAMPO='E' class='classTdLabel butt_elimina tabella' 	"+rowspan + style1 + larghezza1 + "'><label class='butt_elimina' title='Elimina' name='lblElimina"+indice+"' id='lblElimina"+indice+"'> X </label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel materiale tabella' 	"+rowspan + style1 + larghezza2 + "'><label indice = "+indice+" value="+iden_materiale+" class='materiale' name='lblMat"+indice+"' id='lblMat"+indice+"'>"+materiale+"</label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel analisi tabella'  		"+rowspan + style1 + larghezza3 + "'><label class='analisi'id='txtAnalisi"+indice+"' STATO_CAMPO='E' value='"+iden_esame+"' name='txtQuantita"+indice+"' >"+esame+"</label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel sedeCorpo tabella'	 	"+rowspan + style1 + larghezza4 + "'><label class='sedeCorpo' id='txtSedeCorpo"+indice+"' STATO_CAMPO='E' name='txtSedeCorpo"+indice+"' value="+iden_sede+">"+sede+"</label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel note tabella'  		"+rowspan + style1 + larghezza5 + "'><textarea rows='2' style='width:100%' class='note' id='txtNote"+indice+"' STATO_CAMPO='E' name='txtNote"+indice+"' indice='"+indice+"'>"+note+"</textarea></td>";
		riga += "</tr><tr id='tr_"+indice+"' valore="+esame+" ></tr>";
		
		//alert(riga);
		
		jQuery("#tableRiepilogo").append(riga);
		
		jQuery("#txtNote"+indice).blur(function(){
			
			id=jQuery(this).attr("indice");
						
			idMat=jQuery("#tr_"+id).find("label.materiale").val();
			idSede=jQuery("#tr_"+id).find("label.sedeCorpo").val();
			thisNota=jQuery("#tr_"+id).find("textarea.note").text();
			
			TABELLA.riportaNote(idMat,idSede,thisNota);
		});
		
		jQuery("#lblElimina"+indice).click(function(){
			 TABELLA.eliminaRiga(indice);
		});
		
		numeroRiga++;
	},
	
	//funzione che serve per prendere i dati delle analisi dalla pagina di testata e riportarli nella pagina di scelta esami
	caricaAnalisi:function(){

		var innerListBox = opener.document.getElementById('cmbPrestRich_L').options;
		
		for (var i=0;i<innerListBox.length;i++){
			
			var testo = innerListBox[i].text.split("-");
			var value = innerListBox[i].value.split("@");
			
			var esame 			= $.trim(testo[0]);
			var iden_esame		= value[0];
			var note			= value[3];
			var materiale 		= $.trim(testo[1]);
			var iden_materiale	= value[1];
			var sede			= $.trim(testo[2]);
			var iden_sede		= value[2];
			
			
			/******** DEBUG ********************************************/
			var debug = 'DEBUG DI caricaAnalisi()\n\n';
			debug += 'INDICE: '			+numeroRiga;
			debug += '\nOPT VALUE: '	+innerListBox[i].text;
			debug += '\nOPT TEXT: '		+innerListBox[i].value;
			debug += '\nMATERIALE: '	+materiale;
			debug += '\nMATERIALE: '	+materiale;
			debug += '\nMATERIALE iden: '+iden_materiale;
			debug += '\nESAME: '		+esame;
			debug += '\nESAME iden: '	+iden_esame;
			debug += '\nSEDE: '			+sede;
			debug += '\nSEDE iden: '	+iden_sede;
			debug += '\nNOTE: '			+note;
			
			//alert(debug);
			/******** DEBUG ********************************************/
			

			//TABELLA.aggiungiRiga(indice, materiale, iden_materiale, esame, iden_esame, note, sede, iden_sede)
			TABELLA.aggiungiRiga(numeroRiga, materiale, iden_materiale, esame, iden_esame, note, sede, iden_sede)
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
			var debug = 'DEBUG DI caricaAnalisi()\n\n';
			debug += 'INDICE: '+numeroRiga;
			debug += '\nMATERIALE: '+iden_esa;
			debug += '\nMATERIALE iden: '+descr_esa;
			debug += '\nESAME: '+iden_mat;
			debug += '\nESAME iden: '+descr_mat;
			debug += '\nSEDE: '+iden_sede;
			debug += '\nSEDE iden: '+descr_sede;
			debug += '\nNOTE: '+note;
			
			//alert(debug);
			/******** DEBUG ********************************************/
			
			//creo la riga nel riepilogo
			TABELLA.aggiungiRiga(numeroRiga, descr_mat, iden_mat, descr_esa, iden_esa, note, descr_sede, iden_sede);			
		}

		jQuery("#tr_"+(numeroRiga-1).toString()).find("textarea.note").focus();
	},
	
	//funzione che serve ad eliminare la riga dell'analisi  dalla tabella
	eliminaRiga:function(indice){
		
		//alert('indice: '+indice);
		jQuery("#tr_"+indice).remove();
		jQuery("#tr_"+indice).remove();
	},
	
	riportaNote:function(idenMateriale, idenSede, testoNota){
		
		//se la nota è null non ha senso continuare
		if (testoNota == ''){
			return;
		}
		
		//serve per controllare di non ripetere più volte il messaggio di notifica
		var controllo=0;
		
		msg="Attenzione! Il testo di questa nota verrà riportato su ogni esame con lo stesso materiale e stessa sede";
		
		jQuery(".trAnalisi").each(function(){
			
			var materiali=jQuery(this).find("label.materiale").val();
			var sedeCorpo=jQuery(this).find("label.sedeCorpo").val();
			
			if(idenMateriale == materiali && idenSede == sedeCorpo){
				
				if(jQuery(this).find("textarea.note").val() != testoNota){
					if(controllo==0){alert(msg); controllo++;}
					
					jQuery(this).find("textarea.note").val(testoNota);
				}
			}
		});
	},
	
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