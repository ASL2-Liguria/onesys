var _filtro_list_gruppo  = null;
var _filtro_list_profili = null;
var _filtro_list_elenco	 = null;
var _filtro_list_scelti  = null;
var _ID_PROFILO 		 = null;
var _POS_PROFILO 		 = null;

function onLoad(){
	document.body.onselectstart=function(){return false;}
	var obj;
	for (var i=0;i<document.all.lstEsamiGruppi.length;i++){
		obj=document.all.lstEsamiGruppi[i];
		if(obj.value==""){ // gruppo
			obj.className='gruppo';
		}else{  //esame
			obj.className='esame';
			obj.innerText = '    ' + obj.innerText;
		}
	}
}

function appendGroup(obj){
	
	if(event.keyCode!=13)return;
	var myOpt = document.createElement("OPTION");
	myOpt.text = obj.value;
	myOpt.className = 'gruppo';
	document.all.lstEsamiGruppi.add(myOpt);
	obj.value="";
	document.all.lstEsamiGruppi.selectedIndex = document.all.lstEsamiGruppi.length-1;
	document.all.lstEsamiGruppi.scrollTop = document.all.lstEsamiGruppi.scrollHeight;

}

function appendOpt(){
	obj2append = document.all.lstEsami[document.all.lstEsami.selectedIndex].cloneNode();
	obj2append.text = '    ' + document.all.lstEsami[document.all.lstEsami.selectedIndex].text;

	for (var i=0;i<document.all.lstEsamiGruppi.length;i++){
		if(document.all.lstEsamiGruppi[i].value==obj2append.value){
			alert('Esame già inserito in visualizzazione');return;
		}
	}		
	document.all.lstEsamiGruppi.add(obj2append);
	document.all.lstEsamiGruppi.selectedIndex = document.all.lstEsamiGruppi.length-1;	
	document.all.lstEsamiGruppi.scrollTop = document.all.lstEsamiGruppi.scrollHeight;
}

function removeOpt(){
	document.all.lstEsamiGruppi.options.remove(document.all.lstEsamiGruppi.selectedIndex);
}

function su(){
	
	var arOption2append=new Array();
	
	idSelezionato = document.all.lstEsamiGruppi.selectedIndex;
	if(idSelezionato==0)return;

	var objApp;

	for (var i=0;i<document.all.lstEsamiGruppi.length;i++){
		if(i==idSelezionato-1){	
			objApp = document.all.lstEsamiGruppi[idSelezionato].cloneNode();
			objApp.innerText = document.all.lstEsamiGruppi[idSelezionato].innerText;
			arOption2append.push(objApp);		
			
			objApp = document.all.lstEsamiGruppi[i].cloneNode();
			objApp.innerText = document.all.lstEsamiGruppi[i].innerText;
			arOption2append.push(objApp);
			
			i=idSelezionato;
		}else{
			objApp = document.all.lstEsamiGruppi[i].cloneNode();
			objApp.innerText = document.all.lstEsamiGruppi[i].innerText;
			arOption2append.push(objApp);
		}
	}
	for (var i=(document.all.lstEsamiGruppi.length-1);i>=0;i--){
		document.all.lstEsamiGruppi.options.remove(i);
	}	
	
	for (var i=0;i<arOption2append.length;i++){
		document.all.lstEsamiGruppi.appendChild(arOption2append[i]);
	}	
	document.all.lstEsamiGruppi.selectedIndex=idSelezionato-1;	
}

function giu(){
	
	var arOption2append=new Array();
	idSelezionato = document.all.lstEsamiGruppi.selectedIndex;

	if(idSelezionato==-1 || idSelezionato==document.all.lstEsamiGruppi.length-1)return;
	
			
	for (var i=0;i<document.all.lstEsamiGruppi.length;i++){
		if(i==idSelezionato){	
			objApp = document.all.lstEsamiGruppi[i+1].cloneNode();
			objApp.innerText = document.all.lstEsamiGruppi[i+1].innerText;
			arOption2append.push(objApp);
			
			objApp = document.all.lstEsamiGruppi[i].cloneNode();
			objApp.innerText = document.all.lstEsamiGruppi[i].innerText;
			arOption2append.push(objApp);
			
			i= idSelezionato+1;
		}else{
			objApp = document.all.lstEsamiGruppi[i].cloneNode();
			objApp.innerText = document.all.lstEsamiGruppi[i].innerText;
			arOption2append.push(objApp);			
		}
		
	}
	for (var i=(document.all.lstEsamiGruppi.length-1);i>=0;i--){
		document.all.lstEsamiGruppi.options.remove(i);
	}	
	
	for (var i=0;i<arOption2append.length;i++){
		document.all.lstEsamiGruppi.appendChild(arOption2append[i]);
	}	
	document.all.lstEsamiGruppi.selectedIndex=idSelezionato+1;
}

function registraConf(){
	
	var arEsameIden = new Array();
	var arEsameOrder = new Array();	
	var arGruppoDescr = new Array();
	var arGruppoCod = new Array();
	
	var gruppoDescr='GRUPPO';
	var gruppoProgr=0;
	var esameProgr=0;
	var obj;
	
	for (var i =0;i<document.all.lstEsamiGruppi.length;i++){
		obj=document.all.lstEsamiGruppi[i];
		if(obj.value=='') {//gruppo
			gruppoDescr = obj.innerText;
			gruppoProgr++;
			esameProgr=0;
		}else{ //esame
			arEsameIden.push(obj.value);
			arEsameOrder.push(esameProgr);
			arGruppoDescr.push(gruppoDescr);
			arGruppoCod.push(gruppoProgr);
			
			esameProgr++;
		}
	}
	
	if(arEsameIden.length==0){
		alert('Nessun esame selezionato');
		return;
	}	
	
	var reparto= document.all.cmbReparto[document.all.cmbReparto.selectedIndex].value;
	var tipologia = document.all.cmbGruppo[document.all.cmbGruppo.selectedIndex].value;
	
	dwr.engine.setAsync(false);
	dwrConfigurazioneVisualizzazione.setConfigurazioni(reparto,tipologia,arEsameIden,arEsameOrder,arGruppoDescr,arGruppoCod,callBack);
	dwr.engine.setAsync(true);
	
	function callBack(resp){
		if(resp=='OK')alert('Salvataggio effettuato');
		else{alert(resp);}
	}
}