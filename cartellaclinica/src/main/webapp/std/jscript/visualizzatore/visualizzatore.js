


function aggiornaDatiStrut(reparto,nosologico,id_paziente){
//	alert(document.all.selectRichieste.options[document.all.selectRichieste.selectedIndex].value);
	var numRic=document.all.selectRichieste.options[document.all.selectRichieste.selectedIndex].value;

	document.location.replace('listDocumentLabWhale?reparto='+reparto+'&nosologico='+nosologico+'&numRichieste='+numRic+'&idPatient='+id_paziente+'&idenRichiesta=&gruppi=&esami=&codEsami=');	  

}


function aggiornaDivAnag (intestazione)
{
	parent.divAnag.innerHTML = intestazione;

}	

function aggiornaLista(){

	displayBlock('frameList');
	displayNone('frameDocument');

	setVeloNero('frameList');


	if (document.formRequest.reparto==undefined){
		var newInput = document.createElement("INPUT");
		newInput.setAttribute('type','hidden');
		newInput.setAttribute('name','reparto');
		newInput.setAttribute('id','reparto');
		document.formRequest.appendChild(newInput);
	}


	document.formRequest.reparto.value=document.frameFiltri.filtri.Hcdc.value;
	document.formRequest.hDoc.value=document.formFiltri.hDoc.value;

	if (document.formRequest.idPatient!=undefined){
		document.formRequest.idPatient.value=document.formRequest.idPatient.valore_iniziale;
	}
//	document.formRequest.filtroReparto.value=document.formFiltri.filtroReparto.value;
	if (document.formRequest.cognome != undefined){
		document.formRequest.cognome.value ='';
		document.formRequest.nome.value = '';
		document.formRequest.datanasc.value = '';
		document.formRequest.sesso.value = '';
	}
	document.frameRicercaAvanzata.formRicAvan.textCognome.value='';
	document.frameRicercaAvanzata.formRicAvan.textNome.value='';
	document.frameRicercaAvanzata.formRicAvan.textDataNasc.value='';
	document.frameRicercaAvanzata.formRicAvan.radioM.checked=false;
	document.frameRicercaAvanzata.formRicAvan.radioF.checked=false;


	if (document.frameFiltri.filtri.txtdadata.value!='' && document.frameFiltri.filtri.txtdadata.value.length==10){
		document.formRequest.daData.value=document.frameFiltri.filtri.txtdadata.value.substring(6,10)+document.frameFiltri.filtri.txtdadata.value.substring(3,5)+document.frameFiltri.filtri.txtdadata.value.substring(0,2);
	}
	else{
		document.formRequest.daData.value='';
	}

	if (document.frameFiltri.filtri.txtadata.value!='' && document.frameFiltri.filtri.txtadata.value.length==10){
		document.formRequest.aData.value=document.frameFiltri.filtri.txtadata.value.substring(6,10)+document.frameFiltri.filtri.txtadata.value.substring(3,5)+document.frameFiltri.filtri.txtadata.value.substring(0,2);
	}
	else{
		document.formRequest.aData.value='';
	}



	if (document.frameFiltri.filtri.check_nosologico!=undefined){
		if (document.frameFiltri.filtri.check_nosologico.checked==false){
			document.formRequest.nosologico.value="";

		}
		else{
			document.formRequest.nosologico.value=document.formRequest.nosologico.valore_iniziale;

		}
	}

	document.formRequest.submit();

}


function aggiornaListaExt(){

	displayBlock('frameList');
	displayNone('frameDocument');


	if (document.formRequest.idPatient!=undefined){
		document.formRequest.idPatient.value=document.formRequest.idPatient.valore_iniziale;
	}

	if (document.frameFiltri.filtri.txtdadata.value!='' && document.frameFiltri.filtri.txtdadata.value.length==10){
		document.formRequest.daData.value=document.frameFiltri.filtri.txtdadata.value.substring(6,10)+document.frameFiltri.filtri.txtdadata.value.substring(3,5)+document.frameFiltri.filtri.txtdadata.value.substring(0,2);
	}
	else{
		document.formRequest.daData.value='';
	}

	if (document.frameFiltri.filtri.txtadata.value!='' && document.frameFiltri.filtri.txtadata.value.length==10){
		document.formRequest.aData.value=document.frameFiltri.filtri.txtadata.value.substring(6,10)+document.frameFiltri.filtri.txtadata.value.substring(3,5)+document.frameFiltri.filtri.txtadata.value.substring(0,2);
	}
	else{
		document.formRequest.aData.value='';
	}


	document.formRequest.submit();

}

function applica()
{
	document.formRequest.submit();
}


function apriChiudiFiltri(){

	if (document.all.apri_filtri.innerText=='Apri filtri'){
		document.all.apri_filtri.innerText='Chiudi filtri';
		displayBlock('frameFiltri');
	}
	else{
		document.all.apri_filtri.innerText='Apri filtri';
		displayNone('frameFiltri');
	}

}


function apriChiudiRicPaz(){
	/*
if (document.all.apri_ric_paz.innerText=='Apri ricerca paziente'){
document.all.apri_ric_paz.innerText='Chiudi ricerca paziente';
displayBlock('frameRicercaAvanzata');
}
else{
document.all.apri_ric_paz.innerText='Apri ricerca paziente';
displayNone('frameRicercaAvanzata');
}
	 */
}


function apriListaDoc(){

	if (document.all.apri_lista_doc.innerText=='Chiudi lista documenti'){
		document.all.apri_lista_doc.innerText='Apri lista documenti';
		displayNone('frameList');
		displayBlock('frameDocument');

	}
	else{
		displayBlock('frameList');
		displayNone('frameDocument');	
		document.all.apri_lista_doc.innerText='Chiudi lista documenti';

	}
}

function apri_scelta(valore_check,reparti_utente, filtro)
{
	var wScelta;
	var sSql;

	//alert(valore_check);

	if (filtro=='filtroTipDoc'){
		sSql = " SELECT CODE,DISPLAY  FROM CLASSCODE ORDER BY DISPLAY ";
	}
	else if(filtro=='filtroReparto')
	{
		sSql = " SELECT COD_DEC,DESCR FROM RADSQL.CENTRI_DI_COSTO WHERE ATTIVO='S' AND COD_CDC IN ("+ reparti_utente + ") ORDER BY DESCR ";
	}

	wScelta = window.open('sceltaValoriFiltri?colonne=3&sql=' + sSql + '&valore_check=' + valore_check + '&tipo=' + filtro ,'','fullscreen=yes');
}

function chiudiDocumento(){

//	alert('chiudi');

//	document.all.divMenuDoc.style.display='none';
//	document.all.divMenu.style.display='block';
	document.all.aggiorna.style.display='inline';
	document.all.chiudiPagina.style.display='inline';
	document.all.chiudiDoc.style.display='none';



	displayNone('frameDocument');
	displayBlock('frameList');


//	se c'è solo un documento e la chiamata è fatta con l'identificativo richiesta; numero righe=2 perchè conta anche l'intestazione
	if (document.all.formRequest.filtriAggiuntivi!=undefined && document.all.formRequest.filtriAggiuntivi.valore_iniziale.indexOf('identificativoEsterno')!=-1 && parent.frameList.tabella.rows.length==2){
		self.close();
	}


//	se non mi viene passata la richiesta riattivo la form dei filtri
//	if (document.all.formRequest.filtriAggiuntivi==undefined || document.all.formRequest.filtriAggiuntivi.valore_iniziale.indexOf('identificativoEsterno')==-1){
	document.all.frameFiltri.style.display='block';
//	}



	displayNone('frameDocument');
	displayBlock('frameList');

	if (document.all.formRequest.traceUser.valore_iniziale=='S'){
		dwr.engine.setAsync(false);
		dwrTraceUserAction.callTraceUserAction('','CHIUDI','','VISUALIZZATORE');
		dwr.engine.setAsync(true);
	}

}


function chiudiDocumentoExt(){

//	alert('chiudi');



//	se c'è solo un documento e la chiamata è fatta con l'identificativo richiesta; numero righe=2 perchè conta anche l'intestazione
	if (document.all.formRequest.filtriAggiuntivi!=undefined && document.all.formRequest.filtriAggiuntivi.valore_iniziale.indexOf('identificativoEsterno')!=-1 && parent.frameList.tabella.rows.length==2){
		self.close();
	}


//	se non mi viene passata la richiesta riattivo la form dei filtri
	if (document.all.formRequest.filtriAggiuntivi==undefined || document.all.formRequest.filtriAggiuntivi.valore_iniziale.indexOf('identificativoEsterno')==-1){
		document.all.frameFiltri.style.display='block';
	}


	document.all.aggiorna.style.display='inline';
	document.all.chiudiPagina.style.display='inline';
	document.all.chiudiDoc.style.display='none';


	displayNone('frameDocument');
	displayBlock('frameList');

	if (document.all.formRequest.traceUser.valore_iniziale=='S'){
		dwr.engine.setAsync(false);
		dwrTraceUserAction.callTraceUserAction('','CHIUDI','','VISUALIZZATORE');
		dwr.engine.setAsync(true);
	}

}




function ChiudiPagina(){
	self.close();	
}


function deseleziona_tutti()
{

	de_sel_tutti(false);
}

function de_sel_tutti(valore)
{
	var i;


	if(document.scelta.check_value.length == undefined)
	{

		document.scelta.check_value.checked = valore;

	}
	else
	{
		for(i=0; i<document.scelta.check_value.length; i++)
		{
			document.scelta.check_value[i].checked = valore;
		}
	}
}

function displayNone(idFrame){

	if(document.all[idFrame]!=undefined){	
		document.all[idFrame].style.display='none';
	}
}


function displayBlock(idFrame){
	if(document.all[idFrame]!=undefined){
		document.all[idFrame].style.display='block';
	}
}



function disabilitaTastoDx(){
	if (document.layers){
		document.captureEvents(Event.MOUSEDOWN);
		document.onmousedown=nrcNS;
	}else{document.onmouseup=nrcNS;
	document.oncontextmenu=nrcIE;}
	document.oncontextmenu=new Function("return false");
}





function espandiTabella(table){

//	alert('espandiTabella');

//	Calcoli per dimensionamento divtab
	var viewportwidth;
	var viewportheight;

	if (typeof window.innerWidth != 'undefined'){
		viewportwidth = window.innerWidth,
		viewportheight = window.innerHeight;
	}else if (typeof document.documentElement != 'undefined'
		&& typeof document.documentElement.clientWidth !=
			'undefined' && document.documentElement.clientWidth != 0){
		viewportwidth = document.documentElement.clientWidth,
		viewportheight = document.documentElement.clientHeight;
	}else{
		viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
		viewportheight = document.getElementsByTagName('body')[0].clientHeight;
	}


	if (table=='listDocumentLab'){	

		document.write("<script type='text/javascript'>fxheaderInit('tabella',"+(viewportheight-30)+",1,0);fxheader();</script>"); 
	}
	else if (table=='listDocument'){
		document.write("<script type='text/javascript'>$(document).ready(function(){$('#tabella').chromatable({width: \"99%\", height: \"" +viewportheight+"px\",	scrolling: \"yes\"});});</script>");
	}


}



function esportaPdf(reparto,nosologico)
{

	var url=getUrl();

	/*
	function setParam(){
		this.urlPdf=url+'ServletStampe?report=LABO_DATI_STRUTTURATI/LABO.RPT&prompt<pNosologico>='+nosologico+'&prompt<pReparto>='+reparto;
	//	this.nosologico=nosologico;
	//	this.reparto=reparto;
		this.tipo='DATI_STRUTTURATI';

	}
	var param = new setParam();

	 */

	var url=getUrl();
//	window.open("ServletStampe?report=SP_OSTET/LABO.RPT&prompt<pNosologico>="+nosologico+"&prompt<pReparto>="+reparto,'','fullscreen=yes');
//	window.showModalDialog('caricaPDF.html','http://192.168.1.20:8081/whaleTest/ServletStampe?report=SP_OSTET/LABO.RPT&prompt<pNosologico>='+nosologico+'&prompt<pReparto>='+reparto,'dialogWidth:'+screen.availWidth+'px;dialogHeight:'+screen.availHeight+'px');
	window.showModalDialog('caricaPDF.html',url+'ServletStampe?report=LABO_DATI_STRUTTURATI/LABO.RPT&prompt<pNosologico>='+nosologico+'&prompt<pReparto>='+reparto,'dialogWidth:'+screen.availWidth+'px;dialogHeight:'+screen.availHeight+'px');


}


//html in modo dinamico in base alla lingua
function fillLabels(arrayLabel, arrayValue){

	var indice=0;
	var objectNode;
	var oNewText;

	// controllo che ci sia uniformità negli array
	if (arrayLabel.length!=arrayValue.length){
		alert("Error!Arrays of label with different length");
		return;
	}
	try{
		for (indice=0;indice<arrayLabel.length;indice++){
			objectNode = document.getElementById(arrayLabel[indice])
			if (objectNode){
				if (objectNode.nodeName=="DIV"){
					objectNode.title = arrayValue[indice];
				}
				// se esiste la label cambio il suo valore
				if(objectNode.children.length==0){	
					// nessun testo impostato
					// creo testo e lo appendo
					switch (objectNode.nodeName){
					case "TITLE":
						document.title = arrayValue[indice];
						break;
					case "INPUT":
						//oNewText=document.createTextNode(arrayValue[indice]);
						objectNode.value = arrayValue[indice];
						break;
					case "LABEL":
						oNewText = document.createTextNode(arrayValue[indice]);
						objectNode.appendChild(oNewText);
						break;
					case "IMG":
						objectNode.title = arrayValue[indice];
						break;
					default:
						oNewText=document.createTextNode(arrayValue[indice]);
					objectNode.appendChild(oNewText);
					}
				}			
			}
		} // fine ciclo for
	}
	catch(e){
		alert("Error! Can't fill labels. Not define in table - " + e.description);
	}
}


function formatta(campo, label_alert){


	data=campo.value;
	if (data=="")
		return;	
	data1="";
	if ((data.substr(1,1)=="/") || (data.substr(1,1)==".") || (data.substr(1,1)=="-") || (data.substr(1,1)==" "))
		data1="0"+data.substr(0,1)+"/";
	else
		if ((data.substr(2,1)=="/") || (data.substr(2,1)==".") || (data.substr(2,1)=="-") || (data.substr(2,1)==" "))
			data1=data.substr(0,2)+"/";
		else
		{
			//alert(ritornaJsMsg(label_alert));//"Data non riconosciuta"
			alert("Data non riconosciuta")
			campo.value = '';
			campo.focus();
			return;
		}		
	if ((data.substr(3,1)=="/")||(data.substr(3,1)==".") || (data.substr(3,1)=="-") || (data.substr(3,1)==" ")||(data.substr(3,1)==""))
	{
		data1=data1+"0"+data.substr(2,1)+"/";
		data=data.substr(4,data.length-4);
	}	
	else
		if ((data.substr(4,1)=="/")||(data.substr(4,1)==".") || (data.substr(4,1)=="-") || (data.substr(4,1)==" ")||(data.substr(4,1)==""))				   {
			if((data.substr(2,1)=="/") || (data.substr(2,1)==".") || (data.substr(2,1)=="-") || (data.substr(2,1)==" "))
			{
				data1=data1+"0"+data.substr(3,1)+"/";
				data=data.substr(5,data.length-5);
			}
			else
			{
				data1=data1+data.substr(2,2)+"/";
				data=data.substr(5,data.length-5);
			}
		}
		else
			if ((data.substr(5,1)=="/")||(data.substr(5,1)==".") || (data.substr(5,1)=="-") || (data.substr(5,1)==" ")||(data.substr(5,1)==""))
			{
				data1=data1+data.substr(3,2)+"/";
				data=data.substr(6,data.length-6);
			}
			else
			{
				//	alert(ritornaJsMsg(label_alert));//"Data non riconosciuta"
				alert("Data non riconosciuta")
				campo.value = '';
				campo.focus();
				return;
			}
	d=new Date();
	if ((isNaN(data))||(data.length==3))
	{
		//	alert(ritornaJsMsg(label_alert));//"Data non riconosciuta"
		alert("Data non riconosciuta")
		campo.value = '';
		campo.focus();
		return;
	}
	if (data.length==4)
		data1=data1+data;
	else		
		if (data=="")
			data1=data1+d.getFullYear() ;
		else
			if (data>9)
				data1=data1+"19"+data;
			else
				if (data<10)
				{
					da=d.getFullYear() ;
					data1=data1+da;
					if (data.length==2)
						data=data.substr(1,1);
					data1=data1.substr(0,9)+data;
				}
	data=data1;
	strLength1=data.length;
	if (strLength1 == 10)
	{
		var data1=new Date(data.substring(6,10),data.substring(3,5)-1,data.substring(0,2));
		var strData1=data1.getDate()+"/"+(parseInt(data1.getMonth())+1)+"/"+data1.getFullYear();
		if (data1.getDate()!=data.substring(0,2)||(parseInt(data1.getMonth())+1)!=data.substring(3,5))
		{
			//  alert(ritornaJsMsg(label_alert));//"Data Errata"
			alert("Data errata")
			campo.value = '';
			campo.focus();
			return;
		}
	}
	else
	{
		//	alert(ritornaJsMsg(label_alert));//"Data Errata"
		alert("Data errata")
		campo.value = '';
		campo.focus();
		return;
	}
	campo.value=data;
	return(data);
}



function getUrl()
{
	var aTmp = document.location.href.split('/');
	var sRet = '';
	for(var idx = 0; idx < aTmp.length - 1; sRet += aTmp[idx++] + "/");

	return sRet;
}

function getDatiPacs(vIdEsameDicom){
	var sqlBinds = new Array(); 
	var splitIdEsameDicom=vIdEsameDicom.split(',');
	sqlBinds.push(splitIdEsameDicom[0]);
	dwr.engine.setAsync(false);
	dwrUtility.executeQuery("visualizzatore.xml","getDatiPacs",sqlBinds,getUrlPacs);
	dwr.engine.setAsync(true);



	function getUrlPacs(resp){
		if(resp[0][0]=='KO'){
			isValid = false;
			error = resp[0][1];
			ArColumns =  ArData =  new Array();
		}else{
			var urlCareStreamVEToCall = "";
			var regEx = /\*/g;
			var strAccessionNumber="";	
			var patId = "";
			var globalNodeName="";
			urlCareStreamVEToCall = parent.opener.basePC.URL_VE;
			strAccessionNumber = vIdEsameDicom.replace(',','\\').replace(regEx,"\\");
			patId = resp[2][0];	
			globalNodeName=resp[2][2];
			urlCareStreamVEToCall = urlCareStreamVEToCall + "&user_name=elco&password=elco";

			urlCareStreamVEToCall = urlCareStreamVEToCall + "&patient_id="+ patId;					
			urlCareStreamVEToCall = urlCareStreamVEToCall + "&accession_number="+ strAccessionNumber;
			urlCareStreamVEToCall = urlCareStreamVEToCall + "&server_name="+ globalNodeName;

			var hndMP = window.open(urlCareStreamVEToCall,"wndMP","top=0,left=0,width=500,height=500");
			if (hndMP){
				hndMP.focus();
			}
			else{
				hndMP = window.open(urlCareStreamVEToCall,"wndMP","top=0,left=0,width=500,height=500");
			}

		}

	}
}


function grafLab(obj){


	if (obj.nosologico!="") 
	{
//		sql=" select risultato, valore_min, valore_max, substr(data_prelievo,1,4) anno,substr(data_prelievo,5,2) mese,substr(data_prelievo,7,2) giorno,ora_prelievo from xdsregistry.view_risultati_lab l, xdsregistry.view_documenti d where l.id_referto=d.idrefertolab and d.id in (select distinct(parent) from xdsregistry.slot where name='nosologico' and value='"+obj.nosologico+"') and radsql.utility.GET_TOKEN(id_paziente,'1','^')='"+obj.idPatient+"' and codice_esame ='"+obj.parentElement.codiceEsame+"' order by data_prelievo||ora_prelievo ";
		sql=" select risultato, valore_min, valore_max, substr(data_prelievo,1,4) anno,substr(data_prelievo,5,2) mese,substr(data_prelievo,7,2) giorno,ora_prelievo from xdsregistry.view_risultati_lab l, xdsregistry.view_documenti d where l.id_referto=d.idrefertolab and d.id in (select distinct(parent) from xdsregistry.slot where name='nosologico' and value='"+obj.nosologico+"') and id_paziente='"+obj.idPatient+"' and codice_esame ='"+obj.parentElement.codiceEsame+"' order by data_prelievo||ora_prelievo ";


	}
	else
	{
//		sql=" select risultato, valore_min, valore_max, substr(data_prelievo,1,4) anno,substr(data_prelievo,5,2) mese,substr(data_prelievo,7,2) giorno,ora_prelievo from xdsregistry.view_risultati_lab where  DATA_PRELIEVO>='"+obj.daData+"' and DATA_PRELIEVO<='"+obj.aData+"' and radsql.utility.GET_TOKEN(id_paziente,'1','^')='"+obj.idPatient+"' and codice_esame ='"+obj.parentElement.codiceEsame+"' order by data_prelievo||ora_prelievo ";
		sql=" select risultato, valore_min, valore_max, substr(data_prelievo,1,4) anno,substr(data_prelievo,5,2) mese,substr(data_prelievo,7,2) giorno,ora_prelievo from xdsregistry.view_risultati_lab where  DATA_PRELIEVO>='"+obj.daData+"' and DATA_PRELIEVO<='"+obj.aData+"' and id_paziente='"+obj.idPatient+"' and codice_esame ='"+obj.parentElement.codiceEsame+"' order by data_prelievo||ora_prelievo ";

	}

//	query per grafici dati whale 

//	select DF.RISULTATOESAME,DF.VALORERIFMIN,DF.VALORERIFMAX,substr(DATA_ACCETTAZIONE,1,4) anno,substr(DATA_ACCETTAZIONE,5,2) mese,substr(DATA_ACCETTAZIONE,7,2) giorno,DF.ORA_ACCETTAZIONE from INFOWEB.DFRISULTATI_TEMP DF join TAB_ESA TE on (TE.cod_esa='E' || DF.IDESAMESINGOL0) where NUM_NOSOLOGICO in (select column_value NOSOLOGICO from table(split(='"+obj.elencoNosologici+"','$'))) and DF.IDESAMESINGOL0='"+obj.dfEsameSingolo+"'



	function setParam(){
		this.pSql=sql;
		this.pCodiceEsame=obj.parentElement.codiceEsame;
//		this.pDescrEsame=obj.parentElement.descrEsame;
		this.pIdPatient=obj.idPatient;

	}
	var param = new setParam();

	var resp = window.showModalDialog('modalUtility/grafici/chartContainerLabo.html',param,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');

}





function nrcIE(){
	if (document.all){return false;}}


function nrcNS(e){
	if(document.layers||(document.getElementById&&!document.all)){
		if (e.which==2||e.which==3){
			return false;}}}


function onUnloadChiudi(){

	if (document.all['frameDocument'].style.display=='block' && document.frameDocument.tabella==undefined)
	{
		if (document.all.formRequest.traceUser.valore_iniziale=='S'){
			dwr.engine.setAsync(false);
			dwrTraceUserAction.callTraceUserAction('','CHIUDI','','VISUALIZZATORE');
			dwr.engine.setAsync(true);
		}
	}
}



function refLab(obj){

	parent.displayNone('frameList');
	parent.displayBlock('frameDocument');
	parent.setSrc('frameDocument',obj);

}


function seleziona_tutti()
{	
	de_sel_tutti(true);
}


function set_nosologico(nosologico)
{	
	document.getElementById("lbl_value").innerHTML="Nosologico n°"+ nosologico;	
}


function setSingleSrc(mimetype,uri,uriSS,idDoc){
	var repartoIn;
//	alert(document.all.formRequest.reparto);
	if (document.all.formRequest.traceUser.valore_iniziale=='S'){
		if (document.all.formRequest.reparto!=undefined){
			repartoIn=document.all.formRequest.reparto.valore_iniziale;
		}
		else
		{
			repartoIn='';
		}
		dwr.engine.setAsync(false);
		dwrTraceUserAction.callTraceUserAction(repartoIn,'APRI',idDoc,'VISUALIZZATORE');
		dwr.engine.setAsync(true);
	}

//	parent.apri_lista_doc.innerText='Apri lista documenti';
	document.all["frameDocument"].src= "openDocument?mimeType="+mimetype+"&uri="+uri+"&uriSS="+uriSS;
	document.all.aggiorna.style.display='none';
	document.all.chiudiPagina.style.display='none';
	document.all.chiudiDoc.style.display='inline';
	displayNone('frameList');
	displayBlock('frameDocument');
	displayNone('frameFiltri');

}


function setSingleSrcAppoggio(mimetype,uri,uriSS,idDoc){

	parent.setSingleSrc(mimetype,uri,uriSS,idDoc);

}


function setSrc(idFrame,obj){


	var repartoIn;
	if (document.all.formRequest.reparto!=undefined){
		repartoIn=document.all.formRequest.reparto.valore_iniziale;
		if(repartoIn==undefined)
			repartoIn='';	
	}
	else
		repartoIn='';

//	alert(document.all.formRequest.traceUser.valore_iniziale);
	if (document.all.formRequest.traceUser.valore_iniziale=='S'){
		dwr.engine.setAsync(false);

		if (obj.IDREFERTO != undefined){
			dwrTraceUserAction.callTraceUserAction(repartoIn,'APRI DATI STRUTTURATI',obj.idDoc,'VISUALIZZATORE');
		}
		else{
			dwrTraceUserAction.callTraceUserAction(repartoIn,'APRI',obj.idDoc,'VISUALIZZATORE');
		}
		dwr.engine.setAsync(true);
	}


	if (obj.IDREFERTO != undefined){

		document.all[idFrame].style.visibility='hidden';
		document.body.style.cursor='wait';


		document.all[idFrame].src= "listDocumentLab?idReferto="+obj.IDREFERTO+"&idPatient="+obj.parentElement.patientId+"&nosologico="+obj.NOSOLOGICO+"&daData="+obj.DADATA+"&aData="+obj.ADATA;	
//		document.all[idFrame].src= "listDocumentLabWhale?idReferto="+obj.IDREFERTO+"&idPatient="+obj.parentElement.patientId+"&nosologico="+obj.NOSOLOGICO+"&daData="+obj.DADATA+"&aData="+obj.ADATA+"&idAccettazione="+obj.IDACCETTAZIONE+"&elencoEsami="+obj.ELENCOESAMI+"&idRichiestaWhale="+obj.ID_RICHIESTA_WHALE;	
//		document.all[idFrame].src= "listDocumentLabWhale?reparto=&nosologico=&idenRichiesta=9067&gruppi=&esami=&codEsami=3500$3515";	



	}
//	altrimenti viene aperto l'ocx col pdf
	else{


		document.all.aggiorna.style.display='none';
		document.all.chiudiPagina.style.display='none';
		document.all.chiudiDoc.style.display='inline';


		displayNone('frameFiltri');

		document.all[idFrame].src= "openDocument?mimeType="+obj.mimeType+"&uri="+obj.uri+"&uriSS="+obj.uriSS;
	}



}

function set_view_cdc(cdc, descr_cdc)
{	
//	se sono già stati aperti i filtri un'altra volta
	//if (parent.formFiltri.filtroReparto.value == 'S'){


	document.filtri.Hcdc.value = cdc;
	cdc = cdc.replace(/'/g, "");
	document.all.lblElencoCDC.innerHTML = descr_cdc.substr(0, 30) + '...';
	document.all.lblElencoCDC.title = descr_cdc;	
	//}	
}


function set_view_tipdoc(doc, descr_doc)
{

	// alert(doc);

	//  alert(parent.formFiltri.daData);
	//  alert(parent.formFiltri.hDoc);
	parent.formFiltri.hDoc.value = doc;
	doc = doc.replace(/'/g, "");
	document.all.lblElencoTipoDoc.innerHTML = descr_doc.substr(0, 30) + '...';
	document.all.lblElencoTipoDoc.title = descr_doc;	


}





function setVisible(){

	try{
		parent.setVisible2();
	}
	catch(e){
	}
}


function setVisible2(){
	document.all['frameDocument'].style.visibility='visible';
	document.body.style.cursor='auto';
}


function sort(index,type){

	if (parent.formRequest.indiceColonna == undefined)

	{
		var newInput = parent.document.createElement("INPUT");
		newInput.setAttribute('type','hidden');
		newInput.setAttribute('name','indiceColonna');
		newInput.setAttribute('id','indiceColonna');
		parent.formRequest.appendChild(newInput);	

	} 

	parent.formRequest.indiceColonna.value = index;

	if (parent.formRequest.sortType == undefined)
	{
		var newInput2 = parent.document.createElement('INPUT');
		newInput2.setAttribute('type','hidden');
		newInput2.setAttribute('name','sortType');
		newInput2.setAttribute('id','sortType');
		parent.formRequest.appendChild(newInput2);
	}

	parent.formRequest.sortType.value = type;

	parent.document.all.formRequest.submit();
}



function trClick(obj,table){


	for (i=0;i<document.all.tabella.rows.length;i++)
	{
		document.all.tabella.rows[i].selected ='0';
		for(j=0;j<document.all.tabella.rows[i].cells.length;j++)
			document.all.tabella.rows[i].cells[j].className=document.all.tabella.rows[i].cells[j].classStart;
	}
	if (table=='listDocument'){


		for (i=0;i<document.all.tabella.rows[obj.sectionRowIndex].cells.length;i++)
			document.all.tabella.rows[obj.sectionRowIndex+1].cells[i].className='click';
	}
	else if (table=='listDocumentLab'){

		for (i=0;i<document.all.tabella.rows[obj.sectionRowIndex].cells.length;i++)
			document.all.tabella.rows[obj.sectionRowIndex].cells[i].className='click';

	}	

}


function tableOut(obj,table){

	// for (i=0;i<document.all.tabella.rows.length;i++)
	// {
	//   if (document.all.tabella.rows[obj.sectionRowIndex].selected =='0')


	if (table=='listDocument'){

		document.all.tabella.rows[obj.sectionRowIndex+1].cells[0].classStart


		if (obj.selected=='0'){
			for(j=0;j<document.all.tabella.rows[obj.sectionRowIndex].cells.length;j++)
				document.all.tabella.rows[obj.sectionRowIndex+1].cells[j].className=document.all.tabella.rows[obj.sectionRowIndex+1].cells[j].classStart;
		}

	}

	else if (table=='listDocumentLab'){

		document.all.tabella.rows[obj.sectionRowIndex].cells[0].classStart


		if (obj.selected=='0'){
			for(j=0;j<document.all.tabella.rows[obj.sectionRowIndex].cells.length;j++)
				document.all.tabella.rows[obj.sectionRowIndex].cells[j].className=document.all.tabella.rows[obj.sectionRowIndex].cells[j].classStart;
		}

	} 



}
//}



function trDblClick(obj){

	for (i=0;i<document.all.tabella.rows.length;i++){
		document.all.tabella.rows[i].selected='0';
	}

	obj.selected='1';


	parent.displayNone('frameList');
	parent.displayBlock('frameDocument');


	parent.setSrc('frameDocument',obj);


}
function trHover(obj,table){
	/*  for (i=0;i<document.all.tabella.rows.length;i++)
	  {
		if (document.all.tabella.rows[i].selected =='0')
		  for(j=0;j<document.all.tabella.rows[i].cells.length;j++)
			document.all.tabella.rows[i].cells[j].className='even';
	  }
	 */
	//  if (document.all.tabella.rows[obj.sectionRowIndex+1].selected =='0')


	if (obj.selected=='0'){


		if (table=='listDocument'){

			for (i=0;i<document.all.tabella.rows[obj.sectionRowIndex].cells.length;i++)
				document.all.tabella.rows[obj.sectionRowIndex+1].cells[i].className='over';

		}
		else if (table=='listDocumentLab'){

			for (i=0;i<document.all.tabella.rows[obj.sectionRowIndex].cells.length;i++)
				document.all.tabella.rows[obj.sectionRowIndex].cells[i].className='over';

		}	  

	}
}



