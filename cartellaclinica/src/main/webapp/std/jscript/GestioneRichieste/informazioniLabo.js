// JavaScript Document

var oggettoDettaglioLabo = new Object();
var idInfoLayerAboutExam = "idInfoLayerAboutExamLabo";
var idInfoLayerAboutExamInner = "idInfoLayerAboutExamInnerLabo";
var idInfoLayerAboutExamShadow = "idInfoLayerAboutExamShadowLabo";
var divCreato =false;

var clientx 
var clienty 



function initOggettoDettaglioLabo(){
	oggettoDettaglioLabo.IDEN_TESTATA = "";
	oggettoDettaglioLabo.DATAORA_CHECKIN = "";
	oggettoDettaglioLabo.ETICHETTA = "";
	
}

function mostraInfoRichiestaLabo(posizioneArray, oggetto){
	var idenRichiesta = '';
	var sql = ""
	clientx = event.clientX-400;
	clienty = event.clientY;
	
//	alert(clientx);
//	alert(clienty);
	
	try{
		idenRichiesta = array_iden[posizioneArray];
	//	alert(posizioneArray + '\n' + oggetto + '\n' + idenRichiesta);
	//	alert(posizioneArray);
	//	alert(array_iden[posizioneArray]);
	//	alert(idenRichiesta);
		initOggettoDettaglioLabo();
		
		// chiudo quello eventualmente aperto
		hideInfoLayerInWorklist();
				
		if(idenRichiesta == ''){return;}

		sql = "select IDEN_TESTATA, to_char(DATAORA_CHECKIN,'DD/MM/YYYY hh24:mi') as DATAORA_CHECKIN,ETICHETTA from infoweb.gestione_campioni_laboratorio g ";
		sql += " where g.iden_testata = " + idenRichiesta + "  order by DATAORA_CHECKIN,ETICHETTA ";

//alert(sql);
		getXMLData("", parseSql(sql),"processXmlDocumentLabo");
	}
	catch(e){
		alert("mostraDettaglioLabo:errore " + e.description)
	}
}


// funzione che nasconde livello
// riguardante le info dell'esame (quesito, quadro)
function hideInfoLayerInWorklist(){
	hideInfoLayerById(idInfoLayerAboutExam);
	hideInfoLayerById(idInfoLayerAboutExamInner);
	hideInfoLayerById(idInfoLayerAboutExamShadow);		
}

function hideInfoLayerById(id){
	var obj = document.getElementById(id);
	if (obj){
		obj.style.visibility = 'hidden';
	}	
}


// funzione di callback
// che viene chiamata solo in caso 
// non ci sia alcun errore
// in input si ha solo l'oggetto trovato tramite il tag
// response
function processXmlDocumentLabo(xmlDoc){
	var tagIdenTestata = null;
	var tagDataOra = null;
	var tagEtichetta = null;
	
	
	var valoreIdenTestata = '';
	var valoreDataOra = '';
	var valoreEtichetta = '';
	
//alert('processXmlDocumentLabo');
	
	/*try{
	 if (xmlDoc){
			//ESAMI RICHIESTI
			var etichette = xmlDoc.getElementsByTagName("ETICHETTA");
			var dataOra = xmlDoc.getElementsByTagName("DATAORA_CHECKIN");
		
				numeroEtichette = etichette.length;
			for(i = 0; i < (numeroEtichette-1); i++){
				
				
				if (dataOra[i].childNodes[0].nodeValue=='null'){
				tagDataOra='&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
				}
				else{
				tagDataOra = dataOra[i].childNodes[0].nodeValue + '';
				}
				
				tagEtichetta = setLunghezzaDescr(etichette[i].childNodes[0].nodeValue) + '<br>';
								
				valoreEtichetta += tagDataOra + '&nbsp&nbsp&nbsp' + tagEtichetta;
				
			//	alert(i);
				
			} 
		
			
			
	//		alert(valoreEtichetta);
		}
	}
	catch(e){
		alert("processXmlResponseLabo " + e.description)
	} */
	
	oggettoDettaglioLabo.IDEN_TESTATA = "";
	oggettoDettaglioLabo.DATAORA_CHECKIN = "";
	oggettoDettaglioLabo.ETICHETTA = valoreEtichetta;
	

	 // creo layer
	if (!divCreato){
		//creo x la prima volta il layer
		createDivDettaglioLabo();		
	}
	// setto posizione layet
	setLayerPositionLabo(clienty,clientx);
	// setto contenuto
	setContentLayerLabo(idInfoLayerAboutExamInner);

//	idInfoLayerAboutExamInner;
	
	
	makeTable(xmlDoc);
	
	
	
}




// creo livello con le informazioni
// dell'esame al suo interno
function createDivDettaglioLabo(){
	
	var divInfoLayer
	var divInfoLayerInner
	var divInfoLayerShadow	
	
	
	try{
		divInfoLayerInner = document.createElement("DIV");
		divInfoLayerInner.id = idInfoLayerAboutExamInner;
		divInfoLayerInner.className = "boxInfoLayer-inner";	
		
		divInfoLayer = document.createElement("DIV");
		divInfoLayer.title = ritornaJsMsg('tooltipInfoLayer');
		divInfoLayer.id = idInfoLayerAboutExam;
		divInfoLayer.className = "boxInfoLayer";
		divInfoLayer.appendChild(divInfoLayerInner);
//		divInfoLayer.style.visibility = "visible";
		divInfoLayer.onclick = function(){hideInfoLayerInWorklist();}
		
		
		// shadow
		divInfoLayerShadow = document.createElement("DIV");
		divInfoLayerShadow.id = idInfoLayerAboutExamShadow;
		divInfoLayerShadow.className = "boxInfoLayerShadow";
		
		
		document.body.appendChild(divInfoLayer);
		document.body.appendChild(divInfoLayerShadow);
		divCreato = true;
	}
	catch(e){
		alert("createDivInfoRichieste " + e.description);
	}
}
// funzione 
// che compone il 
// contenuto del layer
// nel formato html
function setContentLayerLabo(id){
	
	var obj = document.getElementById(id);
	var contenutoHtml = ""
	
	if(obj){		
		contenutoHtml = "<label class='Titolo'>Campioni pervenuti in laboratorio</label>";		
		contenutoHtml += oggettoDettaglioLabo.ETICHETTA;
		
		obj.innerHTML = contenutoHtml;
		obj.style.visibility = 'visible';
		
		
	}
}

function setLayerPositionLabo(top,left){
	var altezzaDocumento = document.body.offsetHeight;	
	var obj = document.getElementById(idInfoLayerAboutExam);

	var posizioneTop
	var posizioneLeft
	
	try{
		if (obj){
			obj.style.visibility = 'visible';		
			obj.style.position = "absolute";
			posizioneLeft = left;
			// posizionamento verticale
			if ((top+obj.scrollHeight)>altezzaDocumento){
				if ((top-obj.scrollHeight)>0){
					posizioneTop = document.body.scrollTop+(top-obj.scrollHeight);
					}
				else{
					posizioneTop = document.body.scrollTop
				}
				
			}
			else{
				posizioneTop = document.body.scrollTop+top;
			}	
			obj.style.left = posizioneLeft ;
			obj.style.top = posizioneTop;
		}
		// sposto anche l'ombra
		var objShadow = document.getElementById(idInfoLayerAboutExamShadow);
		if (objShadow){
			objShadow.style.visibility = 'visible';		
			objShadow.style.position = "absolute";
			objShadow.style.left = parseInt(posizioneLeft+5);
			objShadow.style.top =  parseInt(posizioneTop+5);
		}
	}
	catch(e){
		alert("setLayerPosition " + e.description);
	}

}

function setLunghezzaDescr(input){

var output="";

//alert(input);

if(input.length>40){

output=input.substring(0,40);
}
else
{

output=input;
for (q=0;q<(40-input.length); q++){
output=output+'&nbsp';
}

}


return output;
}



function makeTable(xmlDoc) {

	row=new Array();
	
	if (xmlDoc){
		//ESAMI RICHIESTI
		var etichette = xmlDoc.getElementsByTagName("ETICHETTA");
		var dataOra = xmlDoc.getElementsByTagName("DATAORA_CHECKIN");
	
			numeroEtichette = etichette.length;
			
			row_num=etichette.length;; //edit this value to suit
			cell_num=2; //edit this value to suit
			

	tab=document.createElement('table');
	tab.setAttribute('id','tabellaEsami');

	tho=document.createElement('thead');
	row[0]=document.createElement('tr');
	cell2=document.createElement('th');
	cont=document.createTextNode('Etichetta');
	cell2.appendChild(cont);
	row[0].appendChild(cell2);
	cell2=document.createElement('th');
	cont=document.createTextNode('Data checkin');
	cell2.appendChild(cont);
	row[0].appendChild(cell2);
	tho.appendChild(row[0]);
	tab.appendChild(tho);
	
	
	
	
	tbo=document.createElement('tbody');

	
	for(c=0;c<row_num;c++){
	row[c+1]=document.createElement('tr');
	
/*	if ((c+1) %2 == 1){
	row[c+1].setAttribute('class','rigaDispari');	
	}*/
 
	cell=document.createElement('td');
	cell.setAttribute('title',etichette[c].childNodes[0].nodeValue);
	cont=document.createTextNode(cecknull(etichette[c].childNodes[0].nodeValue));
	cell.appendChild(cont);
	row[c+1].appendChild(cell);
	
	cell2=document.createElement('td');
	cont=document.createTextNode(cecknull(dataOra[c].childNodes[0].nodeValue));
	cell2.appendChild(cont);
	row[c+1].appendChild(cell2);
	
	tbo.appendChild(row[c+1]);
	}
	tab.appendChild(tbo);
	document.getElementById('idInfoLayerAboutExamInnerLabo').appendChild(tab);
//	alert(tab.Value);
	}
	}

function cecknull(input){
	
	if (input == 'null'){
	output=' ';
	}
	else{
	if (input.length>25)	
	output=input.substring(0,25);
	else
	output=input;	
	}
	return output;
}

