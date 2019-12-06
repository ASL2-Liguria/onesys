var timeOutRicerca=500;
var timer;

var WindowCartella = null;
$(document).ready(function() {

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    if (window.WindowCartella.name=='') {
    	window.WindowCartella = parent.opener.top.window;
    }
    

	/****** try catch perchè dentro la lettera non c'è il pulsante registra come nell'anamnesi ad esempio**/
	try{
		document.getElementById('lblRegistra').parentElement.style.display = 'none';
		document.getElementById('lblChiudi').parentElement.style.display = 'none';
	}catch(e){
		//alert(e.description);
	}

jQuery("tr[class*=mceLast]").hide();
	
	jQuery("input[name=radioRicerca]").click(function(){ricerca();});
	document.frmRicerca.txtRicerca.onkeyup = function(){if(this.value!='')timer=setTimeout("ricerca()",timeOutRicerca);};
	document.frmRicerca.txtRicerca.onkeydown = function(){clearTimeout(timer);}	;
	document.frmRicerca.chkPersonali.onclick=function(){ricerca();} ;
	document.frmRicerca.chkReparto.onclick=function(){ricerca();} ;
	document.frmRicerca.chkFunzione.onclick=function(){ricerca();} ;
	document.all.divRisultati.onselectstart=function(){abilitaSelezione();} ;
	document.all.txtShowTestoStd.onselectstart=function(){abilitaSelezione();} ;
	
	document.frmRicerca.txtRicerca.onkeypress=function(){
		if(event.keyCode==13)ricerca();				
		return (event.keyCode!=13);
	} ;
	
	document.frmRicerca.chkReparto.checked=true;
	document.frmRicerca.chkPersonali.checked=false;
	document.frmRicerca.chkFunzione.checked=true;
	document.getElementById('radioDescr').checked='checked';
	
	ricerca();
	
	if(document.frmExternTesti==undefined){
		ricerca();	
	}
});

function abilitaSelezione(){
	event.cancelBubble=true;
	document.body.onmouseup=function(){
		if( window.clipboardData && clipboardData.setData ){
			clipboardData.setData("Text", document.selection.createRange().text);
		}
		document.body.onmouseup=function(){};
	};	
}


function chiudiScheda() {
	
	document.all.divTestoEdit.style.display = 'none';
	document.all.divTestoShow.style.display = 'none';
	
	/****** try catch perchè dentro la lettera non c'ìè il pulsante registra come nell'anamnesi ad esempio**/
	try{
		document.getElementById('lblChiudi').parentElement.style.display = 'none';
		document.getElementById('lblRegistra').parentElement.style.display = 'none';
	}catch(e){
		//alert(e.description);
	}
	
	//parent.$.fancybox.close(); 
}


function deleteTesto(codice,reparto,idenMed){

	try{
		repartoConf=parent.document.EXTERN.REPARTO.value;
	}catch(e){
		try{
			repartoConf=document.EXTERN.REPARTO.value;
		}catch(e){
			repartoConf =getRepartoLettera();
		}
	}
	
	var msg='Si vuole cancellare il testo standard?';
	
	if(!confirm(msg)){
		return;
	}

	event.cancelBubble=true;

	if (reparto!=repartoConf){
		alert("E' possibile rimuovere esclusivamente testi standard del reparto attivo!");
		return;
	}
	
	if (idenMed != '' && idenMed != baseUser.IDEN_PER){
		alert("E' possibile rimuovere esclusivamente i propri testi standard personali!");
		return;
	}
   	var vResp = WindowCartella.executeStatement("TestiStandard.xml","delete",[codice,reparto]);

	if(vResp[0]=='KO'){
		alert(vResp[1]);
	}else{		
		ricerca();
		chiudiScheda();
	}	
}


function registraTesto(){

	var uteIns = baseUser.IDEN_PER;
	var idenMed=null;
	if(document.all.txtCodiceEdit.value==''){alert('Il campo codice è obbligatorio');return;}
	
	var testo = tinyMCE.get('txtEditTestoStd').getContent();
	
	for(var j=0;j<arRE2replace.length;j++){
		testo= testo.replace(arRE2replace[j],arChar4replace[j]);
	}

	if(testo==''){
		alert('Inserire un testo valido');
		return;
	}
	
	codice=document.all.txtCodiceEdit.value;

	if(document.frmEdit.chkEditPersonale.checked){
		idenMed=baseUser.IDEN_PER;
	}
	try{
		
		funzione=parent.document.EXTERN.FUNZIONE.value;
		reparto=parent.document.EXTERN.REPARTO.value;
		
	}catch(e){
		try{
			funzione=document.EXTERN.FUNZIONE.value;
			reparto=document.EXTERN.REPARTO.value;
		}catch(e){
			funzione=getFunzioneLettera();
			reparto =getRepartoLettera();
		}
	}
	
	var vStatementName = '';

	switch (document.frmEdit.hTipo.value){
		
		case 'M': 
			vStatementName = "update";
			break;
		
		default:  
			vStatementName = "insert";
			break;			
	}

	//alert("Codice: "+codice+"\nReparto: "+reparto+"\nTesto: "+testo+"\nIdenMed: "+idenMed+"\nFunzione: "+funzione+"\nUtente: "+uteIns);

	var vResp = WindowCartella.executeStatement("TestiStandard.xml",vStatementName,[codice,reparto,testo,idenMed,funzione,uteIns]);
	//alert(vResp[0]+'\n'+vResp[1]);

	if(vResp[0]=='KO'){
		
		var resp = vResp[1].substring(0,28);
		
		if(resp == 'ORA-00001: unique constraint'){
			alert('Errore nel salvataggio!\n\n Il codice inserito risulta duplicato.\nInserire un altro codice!');
		}else{
			alert('Errore nel salvataggio!');
		}

	}else{
		
		document.all.divTestoEdit.style.display = 'none';
		
		/****** try catch perchè dentro la lettera non c'ìè il pulsante registra come nell'anamnesi ad esempio**/
		try{ 
			document.getElementById('lblRegistra').parentElement.style.display = 'none';
			document.getElementById('lblChiudi').parentElement.style.display = 'none';
		}catch(e){}
		/*******************************************************************************************************/

		ricerca();
	}
}


function ricerca(){
	
	var txt=document.frmRicerca.txtRicerca.value;
	var funzione='';
	var reparto='';
	
	jQuery("input[name=radioRicerca]").each(function(){
		if(jQuery(this).attr("checked")==true){
			if(jQuery(this).attr("id")=='radioDescr'){
				tipoRicerca = 'TESTO';
			}else{
				tipoRicerca = 'CODICE';
			}
		}
	});

	try{
		
		funzione=parent.document.EXTERN.FUNZIONE.value;
		reparto=parent.document.EXTERN.REPARTO.value;

	}catch(e){
		try{
			funzione=document.EXTERN.FUNZIONE.value;
			reparto=document.EXTERN.REPARTO.value;
		}catch(e){
			funzione=getFunzioneLettera();
			reparto =getRepartoLettera();
		}
	}

	var btnM="<div class=''tableButton mod''		title=Modifica onclick=\"setEdit(''M'',this,'''|| case when iden_med is null then 'N' else 'S' end ||''',''' || REPLACE(CODICE, '''', '\\''') || ''',''' || CODICE_REPARTO || ''',''' || IDEN_MED || ''');\">M</div>";
	var btnD="<div class=''tableButton duplica''  	title=Duplica onclick=\"setEdit(''D'',this,'''|| case when iden_med is null then 'N' else 'S' end ||''',''' || REPLACE(CODICE, '''', '\\''') || ''',''' || CODICE_REPARTO || ''',''' || IDEN_MED || ''');\">D</div>";
	var btnC="<div class=''tableButton canc'' 		title=Cancella onclick=\"deleteTesto(''' || REPLACE(CODICE, '''', '\\''') || ''',''' || CODICE_REPARTO || ''',''' || IDEN_MED || ''');\">C</div>";
	
	var btnI="<div class=''tableButton imp'' 		title=Importa onclick=\"importaTestoStd(''' || REPLACE(CODICE, '''', '\\''') || ''', ''row' || ROWNUM || ''');\" >";
		btnI+="<input id=row' || ROWNUM || ' type=hidden value=''' || IDEN || '''></input> &lt; </div>";
	
	var sql =  'select \'' + btnM + btnD + btnC + btnI;
		sql += '\' \" \", CODICE,TESTO,descr_medico UTENTE, descr_reparto REPARTO from view_CC_TESTI_STD ';	
		sql += 'where '+tipoRicerca+' like \'%'+txt.replace("'", "''")+'%\'';

	if(document.frmRicerca.chkReparto.checked)
		//sql+=" and CODICE_REPARTO='"+document.frmLettera.reparto.value+"'";
		sql+=" and CODICE_REPARTO='"+reparto+"'";
	if(document.frmRicerca.chkPersonali.checked)
		sql+=" and IDEN_MED="+baseUser.IDEN_PER;
	if(document.frmRicerca.chkFunzione.checked)
		sql+=" and FUNZIONE='"+funzione+"'";

	sql+=" and ROWNUM<=100";
	sql+=" order by CODICE";

	//alert(sql);

	dwr.engine.setAsync(false);
	dwrUtility.getTableResult('tabRisultatiTestiStd','risultati',sql,'data', reply);
	dwr.engine.setAsync(true);

	function reply(resp){

		if(resp.split('*')[0]=='KO'){alert(resp);return;}
		
		document.getElementById('divRisultati').innerHTML=resp.split('*')[1];

		if(document.frmRicerca.chkPersonali.checked){
			check_pers='S';
		}else{
			check_pers='N';	
		}
		
		var tabRisultatiTestiStd = $('table#tabRisultatiTestiStd').get(0);
		tabRisultatiTestiStd.rows[0].cells[0].innerHTML = '<div class=tableButton title=Inserisci onclick=\"setEdit(\'I\',this,check_pers);\">+</div>';
		
		for(var i=1;i<tabRisultatiTestiStd.rows.length;i++){
			tabRisultatiTestiStd.rows[i].onclick=function(){showTesto(this);};
		}
	}
}


function setEdit(tipo,objDiv,personale,codice,reparto,idenMed){
	
	/* DEBUG ****************
		alert(tipo);
		alert(objDiv);
		alert(personale);
		alert(codice);
		alert(reparto);
		alert(idenMed);
	************************/
	
	
	event.cancelBubble=true;
	
	if(document.EXTERN.PROV.value != 'LETTERA'){
		disableEditor();
	}
	
	setTestoStd2edit(tipo,objDiv.parentNode.parentNode,personale,codice,reparto,idenMed);
	
	try{
		document.getElementById('lblRegistra').parentElement.style.display = 'block';
		document.getElementById('lblChiudi').parentElement.style.display = 'block';
	}catch(e){
		//alert(e.description);
	}
	
}


function setTestoStd2edit(tipo,objRow,pers,codice,reparto,idenMed){

	document.all.divTestoShow.style.display = 'none';	
	document.frmEdit.txtCodiceEdit.disabled=true;	
	document.frmEdit.chkEditPersonale.disabled=false;
	
	var repartoConf='';

	if (pers=='N'){
		document.frmEdit.chkEditPersonale.checked=false;  
	}else{
		document.frmEdit.chkEditPersonale.checked=true;	
	}	
	
	try{
		repartoConf=parent.document.EXTERN.REPARTO.value;
	}catch(e){
		try{
			repartoConf=document.EXTERN.REPARTO.value;
		}catch(e){
			repartoConf =getRepartoLettera();
		}
	}
	
	document.frmEdit.hTipo.value=tipo;
	document.all.divTestoEdit.style.display = 'block';
	jQuery("tr[class*=mceLast]").find('td').css("height","1px");
	//jQuery("[class*=mceIframeContainer mceFirst mceLast]").css("width","400px");

	switch (tipo){
		
		case 'D':	
			 
			title='Duplica';
			testo=objRow.cells[2].innerHTML;
			document.frmEdit.txtCodiceEdit.disabled=false;
			codice='';
			break;					
		
		case 'M':

			title='Modifica';
			testo=objRow.cells[2].innerHTML;
			document.frmEdit.txtCodiceEdit.disabled=true;
			
			if (reparto!=repartoConf){
				alert("E' possibile modificare esclusivamente testi standard del reparto attivo!");
				chiudiScheda();
				return;
			}

			if (idenMed != '' && idenMed != baseUser.IDEN_PER){
				alert("E' possibile modificare esclusivamente i propri testi standard personali!");
				chiudiScheda();
				return;
			}
			break;						
		
		case 'I':   
			
			title='Inserimento';
			codice='';
			reparto='';
			idenMed='';
			testo='';
			document.frmEdit.txtCodiceEdit.disabled=false;	
			break;
	}
	
	document.all.lblEditTesto.innerText=title;	
	document.all.txtCodiceEdit.value=codice;
	document.all.txtEditTestoStd_ifr.contentWindow.document.body.innerHTML=testo;		
}


function showTesto(objRow){

	document.all.divTestoEdit.style.display = 'none';
	document.all.txtCodiceShow.disabled = true;
	document.all.txtCodiceShow.value = objRow.cells[1].innerText;
	document.all.txtShowTestoStd.innerHTML = objRow.cells[2].innerHTML;
	document.all.divTestoShow.style.display = 'block';
	//jQuery("tr[class*=mceLast]").hide();
	
	/****** try catch perchè dentro la lettera non c'è il pulsante registra come nell'anamnesi ad esempio**/
	try{
		document.getElementById('lblChiudi').parentElement.style.display = 'block';
		document.getElementById('lblRegistra').parentElement.style.display = 'block';
	}catch(e){
		//alert(e.description);
	}
}

function disableEditor(){

	$("#txtEditTestoStd_toolbar1").hide();
	$("#txtEditTestoStd_tbl").css("width","100%");
	
}

function getFunzioneLettera(){
	var funzione = '';
	try{//lettera ordinaria
		funzione = document.frmLettera.funzione.value;
	}catch(e){//lettera dh
		funzione = document.frmGestionePagina.funzione.value;
	}
	return funzione;
}

function getRepartoLettera(){
	var reparto = '';
	try{//lettera ordinaria
		reparto = document.frmLettera.reparto.value;
	}catch(e){//lettera dh
		reparto = document.frmGestionePagina.reparto.value;
	}
        return reparto;
}
