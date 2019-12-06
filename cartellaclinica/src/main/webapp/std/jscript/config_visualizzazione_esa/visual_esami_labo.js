var timeOutRicerca=500;
var timer;

document.all.txtRicercaEsame.onkeyup = function(){if(this.value!='')timer=setTimeout("ricerca()",timeOutRicerca);}
document.all.txtRicercaEsame.onkeydown = function(){clearTimeout(timer);}	

function ricerca(){
	document.all.txtRicercaEsame.value=document.all.txtRicercaEsame.value.toUpperCase();
	var txt=document.all.txtRicercaEsame.value;

	var sql = "select IDEN,COD_ESA,DESCR from TAB_ESA where METODICA in ('L','B') and (DESCR like '%"+txt+"%' or COD_ESA like '%"+txt+"%') and ROWNUM<30 order by COD_ESA";
	
	dwr.engine.setAsync(false);
	dwrConfigurazioneVisualizzazione.getTableEsami('lstEsami','lstEsami',sql, reply);
	dwr.engine.setAsync(true);
	function reply(resp){
		if(resp.split('*')[0]=='KO'){alert(resp);return;}
		document.all['lstEsamiContainer'].innerHTML=resp.split('*')[1];
		setListaEsami();
	}
}
function switchReparto(obj){

	utilMostraBoxAttesa(true);
	document.location.replace('servletGeneric?class=configurazioneReparto.confLabo.cConfiguraVisualizzazioneDatiLaboratorio&reparto='+obj[obj.selectedIndex].value+'&txtRicerca='+document.all.txtRicercaEsame.value);
	
}
function reloadPage(){
	
	utilMostraBoxAttesa(true);
	
	var openClose='';
	var listaGruppi = document.all['gruppo'];
	
	if(typeof listaGruppi!='undefined'){
		if(typeof listaGruppi.length=='undefined')
			if(listaGruppi.className=='open')openClose+='1';else{openClose+='0';}
		else{		
			for(var i=0;i<listaGruppi.length;i++)			
				if(listaGruppi[i].className=='open')openClose+='1*';else{openClose+='0*';}	
			openClose=openClose.substr(0,openClose.length-1);
		}
	}
	//alert(openClose);
	document.location.replace('servletGeneric?class=configurazioneReparto.confLabo.cConfiguraVisualizzazioneDatiLaboratorio&reparto='+document.dati.reparto.value+'&openClose='+openClose+'&txtRicerca='+document.all.txtRicercaEsame.value);
	
}
function setLegend(obj){
	var myInput = document.createElement('input');
	myInput.value=obj.innerText;
	
	myInput.onblur     = function(){this.parentNode.innerText = this.value;this.removeNode(true);}
	myInput.onkeypress = function(){if(event.keyCode==13){this.parentNode.innerText = this.value;this.removeNode(true);}}
	myInput.onmousedown = function(){event.cancelBubble = true;}
		
	obj.innerText = '';
	obj.appendChild(myInput);
	myInput.focus();
}
function init(){
	
	utilCreaBoxAttesa();
	utilMostraBoxAttesa(true);	
	
	var objSelezionato;
	var objTarget;
	DragDrop.setup(
	  {
		  object2disable:[document.body],
		  targetObject:[],			  
		  draggabledObject:[],	
		  classDragObj:'objTrascinato',
		  generateHtmlContent:null,				  
		  eventMouseUpInTarget:function(target){upIn(target);},		  
		  eventMouseUpOutTarget:function(obj){null;},			  
		  eventMouseUpRestore:null,				  			  
		  eventMouseMoveInTarget:function(target){moveIn(target);},
		  eventMouseMoveOutTarget:function(target){DragDrop.removeClass(target,'objOver');}			  
	  }
	)
	
	setGruppiEsami();	
	setListaEsami();
	
	utilMostraBoxAttesa(false);
}
function setListaEsami(){
	try{
		var listaEsami = document.all['lstEsami'].rows;
			for(var i=0;i<listaEsami.length;i++){			
				//DragDrop.addTarget({object:listaEsami[i],gruppo:'UNICO'});
				DragDrop.addSelectedObject({object:listaEsami[i],gruppo:'UNICO',cssObj:'objSelezionato'});
			}
		
	}catch(e){alert(e.description);}		
}
function setGruppiEsami(){
	//try{
		var listaGruppi = document.all['legend'];

		if(typeof listaGruppi=='undefined')return;
		if(typeof listaGruppi.length=='undefined'){
			DragDrop.addTarget({object:listaGruppi,gruppo:'UNICO'});
			DragDrop.addSelectedObject({object:listaGruppi,gruppo:'UNICO',cssObj:'objSelezionato'});			
		}else{		
			for(var i=0;i<listaGruppi.length;i++){			
				DragDrop.addTarget({object:listaGruppi[i],gruppo:'UNICO'});
				DragDrop.addSelectedObject({object:listaGruppi[i],gruppo:'UNICO',cssObj:'objSelezionato'});
			}
		}	
		
		var listaEsami = document.all['esame'];
		if(typeof listaEsami!='undefined'){
			if(typeof listaEsami.length=='undefined'){
					DragDrop.addTarget({object:listaEsami,gruppo:'UNICO'});
					DragDrop.addSelectedObject({object:listaEsami,gruppo:'UNICO',cssObj:'objSelezionato'});	
			}else{
				for(var i=0;i<listaEsami.length;i++){
					DragDrop.addTarget({object:listaEsami[i],gruppo:'UNICO'});
					DragDrop.addSelectedObject({object:listaEsami[i],gruppo:'UNICO',cssObj:'objSelezionato'});		
				}		
			}
		}
		
		var listaEsami = document.all['esami'];
		if(typeof listaEsami.length=='undefined'){
			setPosition(listaEsami);	
		}else{
			for(var i=0;i<listaEsami.length;i++){				
				setPosition(listaEsami[i]);	
			}		
		}		
		
		setPosition(document.all['right']);		
	//}catch(e){alert(e.description);}	
}
function ApriChiudiGruppo(obj,gruppo,cls){
	if(cls!=null){
		gruppo.className = cls;
	}else{
		if (gruppo.className=='open'){
			gruppo.className = 'close';
			obj.innerText = '+';
		}else{
			gruppo.className = 'open';
			obj.innerText = '-';			
		}
	}
	setPosition(gruppo.lastChild);
	setPosition(document.all['right']);
	DragDrop.recalTargetPosition('UNICO');
}
function getOrdineGruppo(obj){
	return obj.parentNode.parentNode.ordine;
}
function moveIn(target){
	
	var tipoTarget=target.tipo;
	var tipoSelezione=DragDrop.selectedObj.tipo;
	
	if(tipoSelezione=='legend'){
		if(tipoTarget=='legend' && getOrdineGruppo(target)!=getOrdineGruppo(DragDrop.selectedObj)){
			DragDrop.addClass(target,'objOver');
		}
	}
	
	if(tipoSelezione=='esame'){
		if(tipoTarget=='legend' && getOrdineGruppo(target)!=getOrdineGruppo(DragDrop.selectedObj.parentNode)){
			DragDrop.addClass(target,'objOver');			
		}
		if(tipoTarget=='esame' && target!=DragDrop.selectedObj && getOrdineGruppo(target.parentNode)==getOrdineGruppo(DragDrop.selectedObj.parentNode)){
			DragDrop.addClass(target,'objOver');
		}	
	}
	
	if(tipoSelezione=='esameSorg'){
		if(tipoTarget=='legend'){
			DragDrop.addClass(target,'objOver');				
		}
	}
	
}
function upIn(target){
	
	if(target==DragDrop.selectedObj)return;
	var tipoTarget=target.tipo;
	var tipoSelezione=DragDrop.selectedObj.tipo;	
	
	if(tipoSelezione=='legend'){
		if(tipoTarget=='legend' && getOrdineGruppo(target)!=getOrdineGruppo(DragDrop.selectedObj)){
			sposta(DragDrop.selectedObj.parentNode.parentNode,target.parentNode.parentNode,document.all['right']);	
		}
	}
	
	if(tipoSelezione=='esame'){
		
		var codEsa=DragDrop.selectedObj.value;
		var descrEsa=DragDrop.selectedObj.innerText;
		var newEsame;		
		
		if(tipoTarget=='legend' && getOrdineGruppo(target)!=getOrdineGruppo(DragDrop.selectedObj.parentNode)){
			var gruppo= target.parentNode.parentNode;
			newEsame=createObjEsame(codEsa,descrEsa);//lo copio
			if(appendEsame(gruppo,newEsame)){//incollo la copia				
				DragDrop.selectedObj.parentNode.removeNode(true);//cancello l'originale	
				reloadPage();
			}
			
		}
		if(tipoTarget=='esame' && getOrdineGruppo(target.parentNode)==getOrdineGruppo(DragDrop.selectedObj.parentNode)){
			sposta(DragDrop.selectedObj.parentNode,target.parentNode,DragDrop.selectedObj.parentNode.parentNode);
		}
	}
	
	if(tipoSelezione=='esameSorg'){
		
		var codEsa=DragDrop.selectedObj.value;
		var descrEsa=DragDrop.selectedObj.descr;
		var newEsame;			
		
		if(tipoTarget=='legend'){
			var gruppo= target.parentNode.parentNode;
			newEsame=createObjEsame(codEsa,descrEsa);//lo copio
			appendEsame(gruppo,newEsame);//incollo la copia		
			reloadPage();
		}
	}	

}
function step(obj,tipo,spostaSu){
	var ordine;
	var nextElement;
	var prevElement;

	if(tipo=='legend'){
		ordine=obj.parentNode.parentNode.ordine;
		elenco = document.all['right'].childNodes;
		if(typeof elenco.length == 'undefined')return; //ho un solo elemento
		for(var i=0;i<elenco.length;i++){
			if(parseInt(elenco[i].ordine,10)==(parseInt(ordine,10)-1))
				prevElement = elenco[i];
			if(parseInt(elenco[i].ordine,10)==(parseInt(ordine,10)+1))
				nextElement = elenco[i];				
		}						
		
		if(spostaSu && parseInt(ordine,10)>0){
			sposta(obj.parentNode.parentNode,prevElement,document.all['right']);
		}
		
		if(!spostaSu && parseInt(ordine,10)<(document.all['right'].childNodes.length-1)){
			sposta(nextElement,obj.parentNode.parentNode,document.all['right']);
		}
	}
	
	if(tipo=='esame'){	
		ordine=obj.parentNode.ordine;

		elenco = obj.parentNode.offsetParent.childNodes;
		if(typeof elenco.length == 'undefined')return; //ho un solo elemento
		for(var i=0;i<elenco.length;i++){
			if(parseInt(elenco[i].ordine,10)==(parseInt(ordine,10)-1))
				prevElement = elenco[i];
			if(parseInt(elenco[i].ordine,10)==(parseInt(ordine,10)+1))
				nextElement = elenco[i];				
		}				
		
		if(spostaSu && parseInt(ordine,10)>0){
			sposta(obj.parentNode,prevElement,obj.parentNode.offsetParent);
		}
		
		if(!spostaSu && parseInt(ordine,10)<(obj.parentNode.parentNode.childNodes.length-1)){
			sposta(nextElement,obj.parentNode,obj.parentNode.offsetParent);
		}
	}	
}

function sposta(sorgente,destinatario,contenitore){
	
	var ordSorg = parseInt(sorgente.ordine,10);
	var ordDest = parseInt(destinatario.ordine,10);

	//alert(ordSorg+' to '+ordDest);
	
	var elenco = contenitore.childNodes;

	for(var i=0;i<elenco.length;i++){	
		//alert('vecchio:' + elenco[i].ordine);
		
		var ordThis = parseInt(elenco[i].ordine,10);
		if(ordDest<ordSorg){
			if(ordThis==ordDest || (ordThis>ordDest && ordThis<ordSorg))
				elenco[i].ordine=ordThis+1;
				
			if(ordThis==ordSorg)		
				elenco[i].ordine = ordDest;
		}else{					
			if(ordThis==ordSorg)
				elenco[i].ordine=ordDest-1;
			if(ordThis>ordSorg && ordThis<ordDest)
				elenco[i].ordine=ordThis-1;
		}			
		//alert('nuovo:' + elenco[i].ordine);
	}
	setPosition(contenitore);
}

function createObjEsame(cod,descr){

	var newDiv = document.createElement('div');
		newDiv.value=cod;
		
	var aSu  = document.createElement('a');
		aSu.href='#';
		aSu.onclick = function(){step(this,'esame',true);}
		aSu.innerText = 'Su';

	var aGiu = document.createElement('a');	
		aGiu.href='#';
		aGiu.onclick = function(){step(this,'esame',false);}
		aGiu.innerText = 'Giù';		
		
	var aDel = document.createElement('a');	
		aDel.href='#';
		aDel.onclick = function(){remove(this);}
		aDel.innerText = 'X';			
		
	var span = document.createElement('span');
		span.id='esame';
		span.tipo='esame';
		span.value=cod;
		span.innerText = descr;

	newDiv.appendChild(aSu);
	newDiv.appendChild(aGiu);
	newDiv.appendChild(aDel);
	newDiv.appendChild(span);	

	return newDiv;

}
function appendEsame(objGruppo,objEsame){

	arEsamiDelGruppo = objGruppo.lastChild.childNodes;
	for(var i=0;i<arEsamiDelGruppo.length;i++){
		if(objEsame.lastChild.value==arEsamiDelGruppo[i].value){
			alert('Esame già associato al gruppo');return false;
		}
	}		
	objEsame.ordine=arEsamiDelGruppo.length;	
	objGruppo.lastChild.appendChild(objEsame);	
	
	return true;
}

function creaObjGruppo(descr){
	
	utilMostraBoxAttesa(true);
	var divGruppo = document.createElement('div');
		divGruppo.id='gruppo';
		divGruppo.className = 'open';
		if(typeof document.all['gruppo']=='undefined')
			divGruppo.ordine='0';
		else{
			if(typeof document.all['gruppo'].length=='undefined')
				divGruppo.ordine='1';
			else
				if(typeof document.all['gruppo'].length!='undefined')divGruppo.ordine=document.all['gruppo'].length;	
		}
//		try{divGruppo.ordine= document.all['gruppo'].length;}catch(e){divGruppo.ordine='0';}
//		alert(divGruppo.ordine);
	var divLegend = document.createElement('div');
		divLegend.className='legend';
			
		var spanDescr  = document.createElement('span');		
			spanDescr.id='legend';
			spanDescr.innerText = descr;
			
		divLegend.appendChild(spanDescr);
		
	divGruppo.appendChild(divLegend);
	
	var divEsami = document.createElement('div');
	
		var divEsame = document.createElement('div');
			divEsame.ordine='0';
			divEsame.value='0';
		
		divEsami.id='esami';
		//divEsami.appendChild(divEsame);
		
	divGruppo.appendChild(divEsami);
	
	document.all['right'].appendChild(divGruppo);		
	//setPosition(document.all['right']);
	reloadPage();
}
function remove(obj){

	if(typeof obj.parentNode.value != 'undefined'){//esame
		obj.parentNode.removeNode(true);
	}else{//gruppo
		obj.parentNode.parentNode.removeNode(true);	
	}
	reloadPage();
}
function setPosition(contenitore){
	
	var curtop=0;
	var listaDaAllineare = contenitore.childNodes;
	var listaAllineati = new Array(listaDaAllineare.length);

	for(var j=0;j<listaAllineati.length;j++){
		for (var i=0;i<listaDaAllineare.length;i++){					
			if(j==parseInt(listaDaAllineare[i].ordine,10)){
				listaAllineati[j]=listaDaAllineare[i];			
				break;
			}
		}
	}
	for (var i=0;i<listaAllineati.length;i++){
//			alert(listaAllineati.length);
		listaAllineati[i].style.top = (curtop+0)+'px';
		curtop =curtop + 3 + listaAllineati[i].offsetHeight;
	}	
	contenitore.style.height = curtop + 0 + 'px';
	document.all['right'].style.height='90%';
}
function registra(){
	var esameIden   = new Array();
	var esameOrdine = new Array();
	var gruppoCod   = new Array();
	var gruppoDescr = new Array();	
	
	var reparto=document.dati.reparto.value;
	var tipologia='';//document.dati.tipologia.value;
	
	var listaGruppi = document.all['gruppo'];
	if(typeof listaGruppi!='undefined'){
		if(typeof listaGruppi.length=='undefined'){
			addGruppo(listaGruppi);			
		}else{		
			for(var i=0;i<listaGruppi.length;i++){			
				addGruppo(listaGruppi[i]);	
			}
		}
	}
	//alert(esameIden);
//	if (esameIden.length<1){alert('Nessun esame selezionato, impossibile procedere con il salvataggio');return;}
	
	dwr.engine.setAsync(false);
	dwrConfigurazioneVisualizzazione.setConfigurazioni(reparto,'VISUALIZZA_ESA_LABO',esameIden,esameOrdine,gruppoDescr,gruppoCod,callBack);
	dwr.engine.setAsync(true);
	
	function callBack(resp){
		if(resp!='OK')alert(resp);			
		utilMostraBoxAttesa(false);
	}	
	
	function addGruppo(gruppo){
		var gruDescr = gruppo.firstChild.lastChild.innerText;

//alert(gruppo.lastChild.childNodes);


		var listaEsami = gruppo.lastChild.childNodes;
		//alert(gruDescr);
		//alert(listaEsami.length)
		if(listaEsami.length==0){//inserisco esame fittizio
			esameIden.push('0');
			esameOrdine.push('0');
			gruppoCod.push(gruppo.ordine);
			gruppoDescr.push(gruDescr);			
			
		}
		
		for(var j=0;j<listaEsami.length;j++){

			esameIden.push(listaEsami[j].value);
			esameOrdine.push(listaEsami[j].ordine);
			gruppoCod.push(gruppo.ordine);
			gruppoDescr.push(gruDescr);			
		}
	}
}