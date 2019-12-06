//variabili per le funzioni di filtroQuery
var _filtro_list_esami='';
var _filtro_list_materiali='';
var _filtro_list_corpo='';

//stabilisco un ordine per le pagine e setto delle variabili per comodità
var prima=document.getElementById('divElencoEsami');
var seconda=document.getElementById('divElencoMateriali');
var terza=document.getElementById('divElencoCorpo');

	

jQuery(document).ready(function(){
	
	caricamento();
	
	switch (_STATO_PAGINA){

		// 	INSERIMENTO ////////////////////////////////
		case 'I':
		
			//ONCLICK  elencoEsami
			document.getElementById("elencoEsami").onclick=function(){ 
				scegli(document.getElementById('elencoEsami'),document.getElementById('txtRiepilogoEsame'),document.getElementById('hRiepilogoEsame')); 
				filtroMateriali();
				avanti(1);
				removeClass(document.getElementById('divElencoEsami'),'divVisibile');
				addClass(document.getElementById('divElencoEsami'),'divVisibileScelto');
			};
			
			//ONCLICK  elencoMateriali
			document.getElementById("elencoMateriali").onclick=function(){ 
				scegli(document.getElementById('elencoMateriali'),document.getElementById('txtRiepilogoMateriale'),document.getElementById('hRiepilogoMateriale')); 
				filtroCorpo();
				if (document.getElementById('elencoCorpo').length!=0) {
					avanti(2);
				}
			};
			
			//ONCLICK  elencoCorpo
			document.getElementById("elencoCorpo").onclick=function(){ 
				scegli(document.getElementById('elencoCorpo'),document.getElementById('txtRiepilogoCorpo'), document.getElementById('hRiepilogoCorpo')); 
				addClass(document.getElementById('lblRiepilogoEsame'),'border'); 
				controllaPresEsame();
			};
			
			//ONKEYUP  txtRicercaEsami
			jQuery("#txtRicercaEsami").keyup(function(){ _filtro_list_esami.searchListRefresh("DESCR like '%" + document.dati.txtRicercaEsami.value.toUpperCase() + "%'", "RICERCA_ESAMI"); });
			
			//ONKEYUP  txtRicercaEsami
			jQuery("#txtRicercaMateriali").keyup(function(){ _filtro_list_materiali.searchListRefresh("DESCR like '%" + document.dati.txtRicercaMateriali.value.toUpperCase() + "%'", "RICERCA_MATERIALI"); });
			
			//ONKEYUP  txtRicercaEsami
			jQuery("#txtRicercaCorpo").keyup(function(){ _filtro_list_corpo.searchListRefresh("DESCRIZIONE like '%" + document.dati.txtRicercaCorpo.value.toUpperCase() + "%'", "RICERCA_CORPO"); });
			
			//ONLOAD  body
			caricaCombo();
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
	addClass(document.getElementById('divRiepilogoRichiesta'),'groupRiepilogoRichiesta'); 
	document.getElementById('divRiepilogoEsame').style.display='none';
	
	//do le classi ai div di scelta 
	addClass(prima,'divVisibile');		//1°
	addClass(seconda,'divVisibile1');	//2°
	addClass(terza,'divVisibile2');		//3°
	
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

function  caricaCombo(){

	var innerListBox = opener.document.getElementById('cmbPrestRich_L');
	var combo=document.getElementById('elencoRiepilogo');
	svuotaListBox(combo);
	//alert(innerListBox.options.innerHTML);
	jQuery(combo).append(innerListBox.options.innerHTML); 
}


//function associata al pulsante cancella
function cancellaEsame(obj,obj2,obj3,obj4){

	obj.value='';
	obj2.value='';
	obj3.value='';
	obj4.value='';
	seconda.style.display='none';
	terza.style.display='none';
	removeClass(document.getElementById('lblRiepilogoEsame'),'border');
	$('#divRiepilogoEsame').hide(300);
	$('#divRiepilogoRichiesta').removeClass('opacity'); //rende opaco il box di riepilogo
}


//funzione associata al pulsante seleziona, che popola il listbox degli esami in maniera corretta
function selezionaEsame(){

	var esame=document.getElementById('txtRiepilogoEsame').value;
	var hEsame=document.getElementById('hRiepilogoEsame').value;
	var materiale=document.getElementById('txtRiepilogoMateriale').value;
	var hMateriale=document.getElementById('hRiepilogoMateriale').value;
	var corpo=document.getElementById('txtRiepilogoCorpo').value;
	var hCorpo=document.getElementById('hRiepilogoCorpo').value;
	var note=document.getElementById('txtNote').value;
	var Listbox=document.getElementById('elencoRiepilogo');
	
	
	var text	=	esame+'  -  '+materiale+'  -  '+corpo+' ';
	var value=	hEsame+'@'+hMateriale+'@'+hCorpo+'@';
	
	if (note!=''){ 
		text+='  - *****Note Esame: '+note+' *****';
		value+=note;		
	}else{
		value+='';	
	}

	//alert ('text: '+text+'\nvalue: '+value);

	removeClass(document.getElementById('lblRiepilogoEsame'),'border');
	
	Listbox.options[Listbox.options.length]=new Option(text, value );
	
	document.getElementById('txtNote').value='';
	
	//riporto la situazione a quella iniziale
	seconda.style.display='none';
	terza.style.display='none';
	$('#divRiepilogoEsame').hide(300);
	$('#divRiepilogoRichiesta').removeClass('opacity');
	$('#divElencoEsami').removeClass('divVisibileScelto');
	$('#divElencoEsami').addClass('divVisibile');
	
	
	_filtro_list_esami.searchListRefresh();
	  
	//document.getElementById('divRiepilogoEsame').style.display='none';
}


function scegli(obj,target, Htarget){

	target.value=obj.options[obj.selectedIndex].text;
	Htarget.value=obj.options[obj.selectedIndex].value;
	//parent.document.getElementById('hTipo').value=obj.options[obj.selectedIndex].value;

}


//function che prepara i dati all'interno della pagina per essere trasportati nella pagina di richiesta
function preSalvataggio(){

	//alert("preSalvataggio");
	
	var myListBox= document.createElement('select');
	var esami='';
	var materiali='';
	var corpo='';
	var note='';
	var metodiche='';
	
	myListBox.id='cmbPrestRich_L';
	myListBox.name='cmbPrestRich_L';
	myListBox.style.width = '100%';
	myListBox.setAttribute('STATO_CAMPO','E');
	myListBox.setAttribute('multiple','multiple');
	
	//per sicurezza lo svuoto
	svuotaListBox(myListBox);
		
	var lst=document.getElementById("elencoRiepilogo");
	var idEsami='';
	var optArray = new Array ();
	
	//ciclo il listbox degli esami scelti e divido i dati (esami, materiali, parti del corpo e note)
	for (var i=0; i<lst.length;i++){
		
		optArray.push(new Option(lst[i].text, lst[i].value));
		
		idEsami = lst[i].value.split('@');

			if(esami != ''){
				esami += '#';
				materiali += '#';
				corpo += '#';
				note+='#'
				metodiche+='#';
			}		
		
		esami += idEsami[0];
		materiali += idEsami[1];
		corpo += idEsami [2];
		note+=idEsami[3];
		metodiche+='A'

	}
	
	//aggiungo le options al listbox che ho creato
	for(var i=0; i<optArray.length; i++) {
		
		myListBox.options[myListBox.options.length] = new Option(optArray[i].text, optArray[i].value);
	}
	
	var s= esami;
	var b=/#$/.test(s);   
	var t=s.replace(/#$/,"");    
	
	document.getElementById('HelencoEsami').value=esami;
	document.getElementById('HelencoMateriali').value=materiali;
	document.getElementById('HelencoCorpo').value=corpo;
	document.getElementById('Hnote').value=note;
	
	//da decommentare dopo l'inserimento all'interno della scheda di richiesta
	 opener.document.getElementById('HelencoEsami').value=esami;
	 opener.document.getElementById('Hmateriali').value=materiali;
	 opener.document.getElementById('HelencoCorpo').value=corpo;
	 opener.document.getElementById('Hnote').value=note;
	 opener.document.getElementById('HelencoMetodiche').value=metodiche;
	
	
	var innerListBox = opener.document.getElementById('cmbPrestRich_L');
	svuotaListBox(innerListBox);
	jQuery(innerListBox).append(myListBox.options.innerHTML);
	
	// alert('esami: '+esami);
	// alert('materiali: '+materiali);
	// alert('corpo: '+corpo);
	// alert('note: '+note);
	
	self.close();

}

//carica gli esami del listbox
function filtroEsami(){
	
	var select = 'select iden_tabella from radsql.COD_EST_TABELLA  where tabella = \'TAB_ESA\' and origine = \'MICROBIOLOGIA_PIETRA_LIGURE\'';

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
	
	var obj=document.getElementById('elencoEsami');
	var whereCond=obj.options[obj.selectedIndex].value;

	document.getElementById('hRiepilogoMateriale').value='';
	document.getElementById('hRiepilogoCorpo').value='';

	
	//alert('select cet.iden_tabella, art.descr from RADSQL.MG_ART ART,RADSQL.COD_EST_TABELLA CET where ORIGINE=\'MICROBIOLOGIA_PIETRA_LIGURE\' and CET.CODICE=ART.IDEN AND CET.TABELLA = \'TAB_ESA\' AND IDEN_TABELLA=\''+whereCond + '\' order by DESCR ASC')
	_filtro_list_materiali = new FILTRO_QUERY('elencoMateriali', null);
	_filtro_list_materiali.setEnableWait('N');
	_filtro_list_materiali.setValueFieldQuery('ART.IDEN');
	_filtro_list_materiali.setDescrFieldQuery('ART.DESCR');
	_filtro_list_materiali.setFromFieldQuery('RADSQL.MG_ART ART,RADSQL.COD_EST_TABELLA CET');
	_filtro_list_materiali.setWhereBaseQuery('ORIGINE=\'MICROBIOLOGIA_PIETRA_LIGURE\' and CET.CODICE=ART.IDEN AND CET.TABELLA = \'TAB_ESA\' AND IDEN_TABELLA=\''+whereCond+'\'');
	_filtro_list_materiali.setOrderQuery('DESCR ASC');
	_filtro_list_materiali.searchListRefresh();
	
	//nel caso si vedessero, li nascondo
	$('#divElencoCorpo').hide(200);
	$('#divRiepilogoEsame').hide(200); 
	removeClass(document.getElementById('divRiepilogoRichiesta'),'opacity');

}

//carica  le parti del corpo del listobox
function filtroCorpo(){

	var obj=document.getElementById('elencoMateriali');
	var whereCond=obj.options[obj.selectedIndex].value;
	
	document.getElementById('hRiepilogoCorpo').value='';

	//alert('select cet.CODICE, COR.DESCRIZIONE from RADSQL.LABO_SEDI_CORPO COR, RADSQL.COD_EST_TABELLA CET where ORIGINE=\'MICROBIOLOGIA_PIETRA_LIGURE\' AND CET.CODICE=COR.IDEN AND CET.TABELLA = \'MG_ART\' AND CET.IDEN_TABELLA=\''+whereCond+'\' order by DESCRIZIONE ASC');
	_filtro_list_corpo = new FILTRO_QUERY('elencoCorpo', null);
	_filtro_list_corpo.setEnableWait('N');
	_filtro_list_corpo.setValueFieldQuery('CET.CODICE');
	_filtro_list_corpo.setDescrFieldQuery('COR.DESCRIZIONE');
	_filtro_list_corpo.setFromFieldQuery('RADSQL.LABO_SEDI_CORPO COR, RADSQL.COD_EST_TABELLA CET');
	_filtro_list_corpo.setWhereBaseQuery('ORIGINE=\'MICROBIOLOGIA_PIETRA_LIGURE\' AND CET.CODICE=COR.IDEN AND CET.TABELLA = \'MG_ART\' AND CET.IDEN_TABELLA=\''+whereCond+'\'');
	_filtro_list_corpo.setOrderQuery('DESCRIZIONE ASC');
	_filtro_list_corpo.searchListRefresh();

	//if (document.getElementById('elencoCorpo').length==0){

		document.getElementById('txtRiepilogoCorpo').value='';
		document.getElementById('hRiepilogoCorpo').value=0;
		addClass(document.getElementById('lblRiepilogoEsame'),'border'); 
		$('#divRiepilogoEsame').show(300); 
		addClass(document.getElementById('divRiepilogoRichiesta'),'opacity'); 
		document.getElementById('txtNote').focus();
		
	//}

	
}

//funzione che cancella l'esame selezionato
function cancellaSel(){

	var combo=document.getElementById('elencoRiepilogo');
	var i='';
	
	for(i=combo.options.length-1;i>=0;i--){
		
		if(combo.options[i].selected)
		combo.remove(i);
	}

}

function annullaRichiesta(){

	if (confirm('Attenzione! \nLe scelte effettuate non saranno salvate. \nProseguire?')){
	
		self.close();
	
	}
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
		
			if (confirm('Combinazione ESAME-MATERIALE-SEDE CORPO già presente!\nContinuare?')){
			
			
			}else{
			
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
		document.getElementById('txtNote').focus(); 
	}

}